import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#06b6d4';
const RGB = '6,182,212';
const ORBIT_ID = 'c-circadian-orbit-kf';

const ENERGY_MAP = [
  { time: '6–8h', phase: 'Sáng sớm', level: 3, desc: 'Cortisol tự nhiên tăng. Tốt cho: cardio nhẹ, lập kế hoạch, bữa ăn có đạm.' },
  { time: '9–11h', phase: 'Buổi sáng', level: 5, desc: 'Đỉnh năng lượng. Tốt cho: công việc quan trọng, tập luyện, sáng tạo.' },
  { time: '12–14h', phase: 'Sau ăn trưa', level: 2, desc: 'Năng lượng tụt. Tốt cho: nghỉ ngắn 10–20 phút, công việc dễ, đi bộ nhẹ.' },
  { time: '15–17h', phase: 'Chiều', level: 4, desc: 'Năng lượng phục hồi. Nhiệt độ cơ thể cao nhất. Tốt cho: tập luyện cường độ cao, sáng tạo.' },
  { time: '18–20h', phase: 'Tối', level: 3, desc: 'Đang giảm dần. Tốt cho: đi bộ nhẹ, xã hội, nấu ăn, giãn cơ.' },
  { time: '21–23h', phase: 'Cuối ngày', level: 1, desc: 'Melatonin bắt đầu tăng. Giảm ánh sáng, giảm kích thích, chuẩn bị ngủ.' },
];

const LIGHT_RULES = [
  { time: 'Sáng 6–10h', action: 'Tăng ánh sáng tự nhiên', tip: 'Ra ngoài 5–10 phút hoặc ngồi gần cửa sổ. Ánh nắng trực tiếp mạnh gấp 100 lần ánh đèn trong nhà.', icon: '☀️' },
  { time: 'Chiều 14–17h', action: 'Duy trì ánh sáng đủ', tip: 'Tránh phòng tối hoàn toàn. Ánh sáng giúp tránh tụt năng lượng buổi chiều.', icon: '🌤️' },
  { time: 'Tối 20–22h', action: 'Giảm ánh sáng mạnh', tip: 'Dùng đèn ấm, giảm độ sáng màn hình. Night Mode trên thiết bị từ 20h.', icon: '🌅' },
  { time: 'Đêm 22h+', action: 'Giữ tối', tip: 'Phòng ngủ tối hoàn toàn. Ngay cả đèn báo nhỏ cũng có thể ảnh hưởng chất lượng ngủ sâu.', icon: '🌙' },
];

const CAFFEINE_GUIDE = [
  { rule: 'Không uống khi vừa thức dậy', reason: 'Cortisol tự nhiên đã cao 6–8h. Caffeine lúc này ít tác dụng hơn và có thể gây lệ thuộc.', good: 'Uống sau 90–120 phút dậy (8–9h nếu dậy lúc 6h)' },
  { rule: 'Không uống khi đói', reason: 'Caffeine khi dạ dày rỗng gây kích ứng axit và tim đập nhanh hơn.', good: 'Uống sau khi uống nước và ăn nhẹ có đạm' },
  { rule: 'Tránh sau 14–15h', reason: 'Half-life caffeine ~5–6 giờ. Uống 15h → còn ½ lúc 21h → khó vào giấc.', good: 'Người nhạy cảm: cut-off sau 12–13h' },
  { rule: 'Không dùng che lấp thiếu ngủ', reason: 'Caffeine không thay thế ngủ. Nó chỉ block cảm giác buồn ngủ, không phục hồi chức năng nhận thức.', good: 'Ngủ đủ + ít caffeine > ít ngủ + nhiều caffeine' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

export default function LifestyleCircadianPage() {
  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-circ-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cCircSpin { to { --c-circ-angle: 360deg; } }
      .c-circ-ring {
        background: conic-gradient(from var(--c-circ-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cCircSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-cyan-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          ☀️
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Nhịp Sinh Học & Năng Lượng</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C2 — Circadian Rhythm · Năng lượng 24h
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Cơ thể có đồng hồ sinh học 24h. Hiểu và sống theo nhịp này giúp bạn có năng lượng ổn định, ngủ tốt hơn và không cần dựa vào caffeine để tồn tại.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-circ-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80&auto=format&fit=crop"
              alt="Nhịp sinh học" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Ánh sáng · Nhịp ngủ thức · Năng lượng
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Energy map */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Bản Đồ Năng Lượng Trong Ngày</h2>
        <p className="text-muted text-sm mb-6">Năng lượng không đều nhau suốt ngày. Làm việc đúng loại vào đúng thời điểm giúp hiệu quả tăng rõ rệt.</p>
        <div className="space-y-3">
          {ENERGY_MAP.map((e, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="shrink-0 w-20">
                <div className="text-xs font-bold tabular-nums" style={{ color: COLOR }}>{e.time}</div>
                <div className="text-xs text-muted">{e.phase}</div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-3 h-1.5 rounded-full" style={{ background: n <= e.level ? COLOR : `rgba(${RGB},0.2)` }} />
                  ))}
                </div>
              </div>
              <p className="text-muted text-sm flex-1">{e.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Light rules */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Quy Tắc Ánh Sáng</h2>
        <p className="text-muted text-sm mb-6">Ánh sáng là tín hiệu quan trọng nhất điều chỉnh đồng hồ sinh học. Sáng: tăng. Tối: giảm. Đêm: giữ tối.</p>
        <div className="grid gap-4">
          {LIGHT_RULES.map((rule, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ borderColor: `rgba(${RGB},0.15)`, background: `rgba(${RGB},0.05)` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{rule.icon}</span>
                <div>
                  <div className="font-bold text-text text-sm">{rule.time}</div>
                  <div className="text-xs font-semibold" style={{ color: COLOR }}>{rule.action}</div>
                </div>
              </div>
              <p className="text-muted text-xs leading-relaxed">{rule.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Caffeine */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Caffeine Thông Minh</h2>
        <p className="text-muted text-sm mb-6">Dùng caffeine như công cụ, không phải phao cứu sinh. Biết khi nào dùng và khi nào không.</p>
        <div className="space-y-4">
          {CAFFEINE_GUIDE.map((g, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ borderColor: `rgba(${RGB},0.12)`, background: `rgba(${RGB},0.04)` }}>
              <div className="font-semibold text-text text-sm mb-1 flex items-center gap-2">
                <span className="text-red-400">✗</span>{g.rule}
              </div>
              <p className="text-muted text-xs mb-2 leading-relaxed">{g.reason}</p>
              <div className="flex items-start gap-2 text-xs">
                <span style={{ color: COLOR }} className="shrink-0">✓</span>
                <span className="font-semibold" style={{ color: COLOR }}>{g.good}</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Post-lunch dip */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Vì Sao Buồn Ngủ Sau Ăn Trưa?</h2>
        <p className="text-muted text-sm mb-6">Đây là hiện tượng sinh học bình thường — không phải vì bạn lười.</p>
        <div className="grid gap-3">
          {[
            { cause: 'Adenosine tích lũy', solution: 'Đây là chu kỳ sinh học bình thường lúc 13–15h. Nghỉ ngắn 10–20 phút hiệu quả hơn cà phê.' },
            { cause: 'Đường huyết sau ăn', solution: 'Ăn nhiều tinh bột nhanh → đường huyết tăng nhanh → giảm nhanh → buồn ngủ. Fix: thêm đạm + rau.' },
            { cause: 'Ngồi yên sau ăn', solution: 'Đi bộ 5–10 phút sau ăn trưa giúp tỉnh táo và ổn định đường huyết tốt hơn cà phê.' },
            { cause: 'Thiếu nước', solution: 'Mất nước nhẹ (1–2%) gây mệt mỏi. Uống 200–300ml nước trước và sau bữa trưa.' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="text-sm font-semibold text-text mb-1">{item.cause}</div>
              <p className="text-muted text-xs leading-relaxed">{item.solution}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day energy tracking */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Bài Tập: Vẽ Bản Đồ Năng Lượng 7 Ngày</h2>
        <p className="text-muted text-sm mb-6">Theo dõi 7 ngày để biết pattern riêng của bạn.</p>
        <div className="p-5 rounded-2xl border" style={{ borderColor: `rgba(${RGB},0.15)`, background: `rgba(${RGB},0.05)` }}>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted mb-4 font-semibold" style={{ color: COLOR }}>
            <span>Thời điểm</span>
            <span>Năng lượng (1–5)</span>
            <span>Ghi chú</span>
          </div>
          {['Sáng (7–9h)', 'Trưa (11–13h)', 'Chiều (14–16h)', 'Tối (18–20h)'].map((t, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 py-2 border-t text-sm" style={{ borderColor: `rgba(${RGB},0.08)` }}>
              <span className="text-muted">{t}</span>
              <span className="text-muted">___</span>
              <span className="text-muted text-xs">Ăn gì? Làm gì?</span>
            </div>
          ))}
          <div className="mt-4 text-xs text-muted">
            <p style={{ color: COLOR }} className="font-semibold mb-1">Sau 7 ngày bạn sẽ biết:</p>
            <ul className="space-y-1">
              <li>→ Mình hay mệt lúc nào và vì sao</li>
              <li>→ Caffeine có ảnh hưởng đến ngủ không</li>
              <li>→ Bữa ăn nào làm tụt năng lượng</li>
              <li>→ Ngủ bao nhiêu thì hôm sau tốt nhất</li>
            </ul>
          </div>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/sleep-routine" className="text-muted hover:text-cyan-400 transition-colors text-sm">← Routine Trước Ngủ</Link>
        <Link to="/pillar/c/morning" className="text-sm font-semibold" style={{ color: COLOR }}>Routine Sáng →</Link>
      </div>
    </div>
  );
}
