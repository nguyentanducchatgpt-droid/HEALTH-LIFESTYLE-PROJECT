import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'c-neat-orbit-kf';

const NEAT_VS_TEE = [
  { component: 'BMR (nghỉ ngơi)', pct: '60–70%', desc: 'Năng lượng cơ thể dùng khi hoàn toàn nghỉ ngơi', color: '#6366f1' },
  { component: 'TEF (tiêu hóa)', pct: '8–10%', desc: 'Năng lượng tiêu hóa và hấp thụ thức ăn', color: '#8b5cf6' },
  { component: 'Exercise (tập gym)', pct: '5–10%', desc: 'Buổi tập 45–60 phút tại phòng gym', color: '#a78bfa' },
  { component: 'NEAT (vận động trong ngày)', pct: '15–30%', desc: 'Đi bộ, đứng dậy, làm việc nhà, di chuyển', color: COLOR },
];

const NEAT_ACTIVITIES = [
  { activity: 'Đứng làm việc 4 tiếng', kcal: '+50–100', icon: '🧍' },
  { activity: 'Đi bộ 10.000 bước', kcal: '+300–400', icon: '🚶' },
  { activity: 'Đi cầu thang 10 phút', kcal: '+60–80', icon: '🪜' },
  { activity: 'Dọn nhà 30 phút', kcal: '+80–120', icon: '🧹' },
  { activity: 'Đi bộ sau 3 bữa ăn (5+10+15p)', kcal: '+80–120', icon: '🍽️' },
  { activity: 'Fidgeting/đung đưa chân', kcal: '+20–50', icon: '💫' },
];

const OFFICE_HACKS = [
  { hack: 'Timer 45 phút', detail: 'Dùng app hoặc đồng hồ. Sau 45 phút: đứng dậy, đi lấy nước, xoay vai 30 giây rồi ngồi lại.' },
  { hack: 'Bình nước 0.5L', detail: 'Đặt bình nước nhỏ (không phải 1.5L) để phải đứng dậy đổ thêm nước thường xuyên hơn.' },
  { hack: 'Họp đứng hoặc đi bộ', detail: 'Cuộc họp 1-1 hoặc cuộc gọi điện thoại: đứng dậy hoặc đi bộ chậm thay vì ngồi.' },
  { hack: 'Printer ở tầng khác', detail: 'Nếu có thể, đặt máy in, máy pha cà phê ở chỗ cần đi bộ thêm.' },
  { hack: 'Cầu thang thay thang máy', detail: 'Chỉ cần 1–2 tầng, 2–3 lần/ngày. Nhỏ nhưng tích lũy đáng kể.' },
  { hack: 'Lunch walk 10 phút', detail: 'Đi bộ 10 phút sau ăn trưa. Tỉnh táo + ổn định đường huyết + tăng NEAT.' },
];

const STEP_GOALS = [
  { profile: 'Ít vận động (dưới 3.000 bước)', goal: 'Tăng 1.000 bước so với nền', tip: 'Đừng nhảy ngay lên 10.000. Tăng dần.' },
  { profile: 'Trung bình (3.000–6.000)', goal: 'Tăng 1.000–2.000 bước/tuần', tip: 'Thêm 1 lần đi bộ 10 phút mỗi ngày.' },
  { profile: 'Cơ bản (6.000–8.000)', goal: 'Duy trì + tăng lên 8.000–10.000', tip: 'Thêm bước sau bữa tối.' },
  { profile: 'Tốt (8.000–10.000+)', goal: 'Duy trì + tối ưu chất lượng', tip: 'Tập trung phân bổ đều trong ngày.' },
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

export default function LifestyleNeatPage() {
  const [checks, setChecks] = useState({});

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-neat-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cNeatSpin { to { --c-neat-angle: 360deg; } }
      .c-neat-ring {
        background: conic-gradient(from var(--c-neat-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cNeatSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const checkCount = [0,1,2,3,4].filter(i => checks[i]).length;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-base mb-8 hover:text-emerald-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🚶
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">NEAT & Chống Ngồi Lâu</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C3 — Non-Exercise Activity Thermogenesis
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            NEAT là toàn bộ vận động ngoài buổi tập: đi bộ, đứng dậy, làm việc nhà, di chuyển trong ngày. Với người bận rộn, NEAT có thể quan trọng không kém buổi tập gym.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-neat-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop"
              alt="NEAT đi bộ" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Đi bộ · Đứng dậy · Vận động rải rác
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* NEAT vs TEE */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Chiếm Bao Nhiêu Trong Ngày?</h2>
        <p className="text-muted text-base mb-6">Tổng năng lượng tiêu thụ trong ngày (TDEE) gồm 4 thành phần chính.</p>
        <div className="space-y-3">
          {NEAT_VS_TEE.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}>
              <div className="w-16 text-center shrink-0">
                <div className="text-xl font-bold" style={{ color: item.color }}>{item.pct}</div>
              </div>
              <div>
                <div className="font-semibold text-text text-base">{item.component}</div>
                <div className="text-muted text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.07)`, border: `1px solid rgba(${RGB},0.2)` }}>
          <p className="text-base text-muted"><strong style={{ color: COLOR }}>Điểm mấu chốt:</strong> Buổi tập gym chỉ chiếm 5–10% tổng năng lượng. NEAT chiếm 15–30%. Người năng động (đi lại nhiều) có NEAT cao hơn người ngồi nhiều tới 500–700 kcal/ngày.</p>
        </div>
      </RevealBlock>

      {/* NEAT activities */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Tiêu Thụ Bao Nhiêu kcal?</h2>
        <p className="text-muted text-base mb-6">Các hoạt động NEAT phổ biến và năng lượng tiêu thụ ước tính.</p>
        <div className="grid gap-3">
          {NEAT_ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{a.icon}</span>
                <span className="text-base font-semibold text-text">{a.activity}</span>
              </div>
              <span className="text-base font-bold tabular-nums" style={{ color: COLOR }}>{a.kcal} kcal</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 2-minute rule */}
      <RevealBlock className="mb-12">
        <div className="p-6 rounded-2xl" style={{ background: `rgba(${RGB},0.08)`, border: `1px solid rgba(${RGB},0.25)` }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR }}>⏱ Quy Tắc Đứng Dậy 2 Phút</h2>
          <p className="text-muted text-base leading-relaxed mb-4">
            Ngồi liên tục hơn 90 phút làm giảm lưu thông máu, tăng căng cơ và giảm trao đổi chất. Nghiên cứu cho thấy ngắt quãng mỗi 45–60 phút có hiệu quả hơn tập gym 1 tiếng nếu phần còn lại của ngày bạn ngồi hoàn toàn.
          </p>
          <div className="grid gap-2">
            {['Đứng dậy và đi lấy nước', 'Xoay vai × 10 + xoay cổ × 8', 'Vươn người lên trần + bend forward', 'Đi bộ 1 vòng quanh bàn làm việc', 'Calf raise × 15 khi đứng chờ'].map((action, i) => (
              <div key={i} className="flex items-center gap-2 text-base">
                <span style={{ color: COLOR }}>→</span>
                <span className="text-muted">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Office hacks */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>6 Cách Tăng NEAT Cho Dân Văn Phòng</h2>
        <div className="grid gap-3">
          {OFFICE_HACKS.map((h, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="font-semibold text-text text-base mb-1">{h.hack}</div>
              <p className="text-muted text-sm leading-relaxed">{h.detail}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Step goals */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mục Tiêu Bước Theo Cấp Độ</h2>
        <p className="text-muted text-base mb-6">Không ép tất cả lên 10.000 bước. Tăng từ nền hiện tại, không nhảy vọt.</p>
        <div className="space-y-3">
          {STEP_GOALS.map((g, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text text-base">{g.profile}</span>
                <span className="text-sm font-bold" style={{ color: COLOR }}>{g.goal}</span>
              </div>
              <p className="text-sm text-muted">{g.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily NEAT checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Checklist Hằng Ngày</h2>
        <div className="space-y-3 mb-4">
          {['Đứng dậy sau mỗi 45–60 phút ngồi ít nhất 1 lần', 'Đi bộ sau ít nhất 1 bữa ăn hôm nay', 'Đạt mục tiêu bước cá nhân', 'Có ít nhất 1 lần vận động ngắn trong giờ làm việc', 'Không ngồi liên tục hơn 90 phút'].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                style={{ background: checks[i] ? COLOR : 'transparent', borderColor: COLOR }}>
                {checks[i] && <span className="text-black text-sm font-bold">✓</span>}
              </div>
              <span className="text-base text-muted group-hover:text-text transition-colors">{item}</span>
            </label>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: `rgba(${RGB},0.15)` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${checkCount / 5 * 100}%`, background: COLOR }} />
        </div>
        <p className="text-sm text-muted">{checkCount}/5 — {checkCount >= 4 ? 'Xuất sắc! NEAT cao nhất trong ngày' : checkCount >= 3 ? 'Tốt' : 'Đang xây dựng thói quen'}</p>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/morning" className="text-muted hover:text-emerald-400 transition-colors text-base">← Routine Sáng</Link>
        <Link to="/pillar/c/recovery" className="text-base font-semibold" style={{ color: COLOR }}>Phục Hồi →</Link>
      </div>
    </div>
  );
}
