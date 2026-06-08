import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#06b6d4';
const RGB = '6,182,212';
const ORBIT_ID = 'c-morning-orbit-kf';

const ROUTINE_5 = [
  { step: 1, time: '1 phút', action: 'Uống 1 ly nước (200–300ml)', why: 'Bổ sung nước sau 7–9 giờ không uống' },
  { step: 2, time: '1 phút', action: 'Mở rèm hoặc ra ngoài lấy ánh nắng', why: 'Tắt melatonin, bật cortisol tự nhiên' },
  { step: 3, time: '1 phút', action: 'Đi bộ nhẹ tại chỗ 50–100 bước', why: 'Tăng nhịp tim nhẹ, bật hệ tuần hoàn' },
  { step: 4, time: '1 phút', action: 'Xoay vai × 10, xoay hông × 10', why: 'Giảm cứng khớp sau khi ngủ' },
  { step: 5, time: '1 phút', action: 'Hít thở sâu 4–6 nhịp chậm', why: 'Oxy cho não, giảm cortisol lo âu' },
];

const ROUTINE_10 = [
  { step: 1, time: '2 phút', action: 'Uống nước + mở cửa sổ/ra ngoài lấy ánh sáng tự nhiên', why: 'Hydrate + báo hiệu bắt đầu ngày' },
  { step: 2, time: '3 phút', action: 'Đi bộ nhẹ (trong nhà, ra hành lang hoặc ngoài trời)', why: 'Tăng nhiệt độ cơ thể, bật năng lượng' },
  { step: 3, time: '3 phút', action: 'Mobility nhẹ: cổ vai gáy + xoay hông + vươn người', why: 'Giảm căng cơ, cải thiện tư thế ngày mới' },
  { step: 4, time: '2 phút', action: 'Thở chậm + xác định 1 việc quan trọng nhất hôm nay', why: 'Định hướng tâm trí, giảm lo âu sáng sớm' },
];

const ROUTINE_20 = [
  { step: 1, time: '3 phút', action: 'Uống nước + ánh sáng tự nhiên + journal 1 câu', why: 'Hydrate, tín hiệu ngày mới, khởi động tư duy' },
  { step: 2, time: '5 phút', action: 'Đi bộ ngoài trời + hít thở không khí sáng', why: 'Nhiệt độ cơ thể tăng, cortisol khỏe mạnh' },
  { step: 3, time: '7 phút', action: 'Mobility + kéo giãn toàn thân (xem bài tập bên dưới)', why: 'Chuẩn bị cơ thể cho ngày dài' },
  { step: 4, time: '3 phút', action: 'Thiền nhẹ hoặc thở cơ hoành + review 3 việc chính', why: 'Tâm trí bình tĩnh, focus cao' },
  { step: 5, time: '2 phút', action: 'Bữa ăn có đạm hoặc uống nước protein', why: 'Ổn định đường huyết, năng lượng bền' },
];

const MOBILITY_5 = [
  { name: 'Chin tuck', reps: '10 lần', muscles: 'Cổ trước' },
  { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', muscles: 'Vai, cổ' },
  { name: 'Xoay hông (đứng)', reps: '10 vòng mỗi bên', muscles: 'Hông, lưng dưới' },
  { name: 'Thoracic extension', reps: '8–10 lần', muscles: 'Lưng trên' },
  { name: 'World\'s greatest stretch', reps: '5 lần mỗi bên', muscles: 'Toàn thân' },
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

export default function LifestyleMorningPage() {
  const [mode, setMode] = useState('5');

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-morn-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cMornSpin { to { --c-morn-angle: 360deg; } }
      .c-morn-ring {
        background: conic-gradient(from var(--c-morn-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cMornSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const routines = { '5': ROUTINE_5, '10': ROUTINE_10, '20': ROUTINE_20 };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-base mb-8 hover:text-cyan-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🌅
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Routine Buổi Sáng</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C2 — 5 / 10 / 20 phút
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Buổi sáng không cần hoàn hảo. Chỉ cần bật cơ thể lên đúng cách. 5 phút đúng còn tốt hơn kế hoạch 1 tiếng không làm được.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-morn-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop"
              alt="Routine sáng" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Nước · Ánh sáng · Vận động nhẹ
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why morning matters */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Buổi Sáng Quan Trọng?</h2>
        <p className="text-muted text-base mb-6">Những gì bạn làm trong 30–60 phút đầu tiên thiết lập tone cho cả ngày.</p>
        <div className="grid gap-3">
          {[
            { icon: '🧠', title: 'Cortisol Awakening Response (CAR)', desc: 'Cortisol tự nhiên đạt đỉnh 30–45 phút sau thức dậy. Đây là window lý tưởng nhất trong ngày để não hoạt động sắc bén nhất.' },
            { icon: '☀️', title: 'Đồng hồ sinh học reset hàng ngày', desc: 'Ánh nắng buổi sáng là "nút reset" mạnh nhất. Giúp melatonin tối hôm đó tiết đúng lúc hơn — bạn sẽ dễ ngủ hơn 12–16 giờ sau.' },
            { icon: '💧', title: 'Cơ thể cần nước sau giấc ngủ', desc: 'Bạn thở và toát mồ hôi trong khi ngủ. Dậy với 200–300ml nước trước tiên giúp não hoạt động tốt hơn ngay lập tức.' },
            { icon: '🏃', title: 'Vận động nhẹ bật hệ tuần hoàn', desc: 'Chỉ 5 phút đi bộ nhẹ tăng dopamine, norepinephrine và serotonin — 3 neurotransmitter quan trọng cho mood và focus cả ngày.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-text text-base mb-1">{item.title}</div>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Routine plans */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Phiên Bản Routine</h2>
        <p className="text-muted text-base mb-5">Chọn phiên bản phù hợp với ngày hôm nay. Ngày bận = 5 phút. Ngày thường = 10 phút. Ngày rảnh = 20 phút.</p>
        <div className="flex gap-2 mb-6">
          {['5', '10', '20'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-base font-semibold transition-all"
              style={mode === m
                ? { background: `rgba(${RGB},0.15)`, color: COLOR, border: `1px solid rgba(${RGB},0.3)` }
                : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
              {m} phút
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {routines[mode].map((row, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-base font-bold"
                style={{ background: COLOR, color: 'black' }}>{row.step}</div>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{row.action}</div>
                <div className="text-sm text-muted mt-0.5">{row.why}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums shrink-0" style={{ color: COLOR }}>{row.time}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Mobility */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mobility Sáng 5 Phút</h2>
        <p className="text-muted text-base mb-6">Bài mobility nhẹ buổi sáng giảm cứng khớp, cải thiện tư thế và chuẩn bị cơ thể cho ngày làm việc.</p>
        <div className="space-y-2">
          {MOBILITY_5.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div>
                <div className="font-semibold text-text text-base">{ex.name}</div>
                <div className="text-sm text-muted">{ex.muscles}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums" style={{ color: COLOR }}>{ex.reps}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Practical tips */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẹo Thực Tế</h2>
        <div className="grid gap-3">
          {[
            { tip: 'Chuẩn bị từ tối hôm trước', detail: 'Để sẵn bình nước, giày đi bộ, quần áo tập. Giảm ma sát buổi sáng = tăng khả năng thực hiện.' },
            { tip: 'Không xem điện thoại trong 15 phút đầu', detail: 'Điện thoại ngay khi thức dậy → não vào chế độ reactive ngay. Ưu tiên routine trước, điện thoại sau.' },
            { tip: 'Bắt đầu từ 1 thói quen, không phải cả list', detail: 'Tuần 1: chỉ uống nước khi thức. Tuần 2: thêm ánh sáng. Tuần 3: thêm đi bộ 2 phút.' },
            { tip: 'Ngày bận nhất vẫn có thể làm 3 phút', detail: 'Uống nước + ánh sáng + 5 hít thở = 3 phút. Đây là "minimum viable morning routine" của bạn.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="font-semibold text-text text-base mb-1" style={{ color: COLOR }}>→ {item.tip}</div>
              <p className="text-muted text-sm leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/circadian" className="text-muted hover:text-cyan-400 transition-colors text-base">← Nhịp Sinh Học</Link>
        <Link to="/pillar/c/neat" className="text-base font-semibold" style={{ color: COLOR }}>NEAT →</Link>
      </div>
    </div>
  );
}
