import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'd-habits-orbit-kf';
const ORBIT_CLASS = 'd-habits-orbit-ring';
const PROP = '--d-habits-orbit-angle';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

const LOOP_STEPS = [
  { n: '1', t: 'Cue (Kích Hoạt)', d: 'Tín hiệu kích hoạt hành vi. Có thể là thời gian, địa điểm, cảm xúc, người, hoặc hành động trước đó.', color: '#f59e0b', ex: 'Thức dậy → Cue cho uống nước' },
  { n: '2', t: 'Craving (Ham Muốn)', d: 'Động lực phía sau thói quen. Não dự đoán phần thưởng và tạo cảm giác muốn thực hiện hành vi.', color: '#ef4444', ex: 'Muốn cảm giác tỉnh táo, sảng khoái' },
  { n: '3', t: 'Response (Hành Vi)', d: 'Thói quen thực tế bạn thực hiện. Phải đơn giản đủ để vượt qua ngưỡng kháng cự.', color: '#3b82f6', ex: 'Uống 1 ly nước lớn' },
  { n: '4', t: 'Reward (Phần Thưởng)', d: 'Cảm giác thỏa mãn sau hành vi. Não học được: "cái này đáng làm lại".', color: '#10b981', ex: 'Cảm giác sảng khoái, tỉnh táo' },
];

const STACKING = [
  { t: 'Habit Stacking', d: 'Gắn thói quen mới vào sau thói quen đã có. "Sau khi [THÓI QUEN CŨ], tôi sẽ [THÓI QUEN MỚI]."', ex: '"Sau khi đánh răng, tôi sẽ thiền 2 phút."' },
  { t: 'Implementation Intention', d: 'Đặt kế hoạch cụ thể: "Lúc X, ở Y, tôi sẽ làm Z". Tăng xác suất thực hiện lên 91%.', ex: '"Thứ 2,4,6 lúc 7am tại phòng ngủ, tôi sẽ tập 20 phút."' },
  { t: '2-Minute Rule', d: 'Mọi thói quen mới đều bắt đầu bằng phiên bản 2 phút. Làm cho việc bắt đầu không thể nào không làm được.', ex: '"Tập gym" → "Mặc đồ thể thao" → "Ra khỏi nhà"' },
  { t: 'Environment Design', d: 'Thiết kế môi trường làm cho hành động tốt dễ hơn và hành động xấu khó hơn.', ex: 'Để bình nước trên bàn → uống nhiều hơn tự nhiên' },
];

const TRACKER_HABITS = [
  'Uống đủ nước (8 ly)',
  'Vận động ít nhất 20 phút',
  'Ăn đủ rau trong ngày',
  'Thiền/thở sâu 5 phút',
  'Không lướt mạng trước ngủ',
  'Ngủ trước 11pm',
  'Đọc ít nhất 10 phút',
  'Viết nhật ký',
];

function HabitTracker() {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const [checks, setChecks] = useState({});
  const toggle = (h, d) => setChecks(p => ({ ...p, [`${h}-${d}`]: !p[`${h}-${d}`] }));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-muted font-normal pb-3 pr-4 w-40">Thói Quen</th>
            {days.map(d => <th key={d} className="text-center text-muted font-normal pb-3 w-9">{d}</th>)}
            <th className="text-center text-muted font-normal pb-3 w-12">%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {TRACKER_HABITS.map(h => {
            const done = days.filter(d => checks[`${h}-${d}`]).length;
            const pct = Math.round(done / days.length * 100);
            return (
              <tr key={h}>
                <td className="py-2 pr-4 text-muted text-xs leading-tight">{h}</td>
                {days.map(d => (
                  <td key={d} className="py-2 text-center">
                    <button onClick={() => toggle(h, d)}
                      className="w-7 h-7 rounded-lg border transition-all hover:opacity-80 mx-auto flex items-center justify-center"
                      style={{ borderColor: checks[`${h}-${d}`] ? COLOR : '#333', background: checks[`${h}-${d}`] ? `${COLOR}25` : 'transparent' }}>
                      {checks[`${h}-${d}`] && <span style={{ color: COLOR }}>✓</span>}
                    </button>
                  </td>
                ))}
                <td className="py-2 text-center">
                  <span className="font-bold" style={{ color: pct >= 70 ? COLOR : pct >= 40 ? '#f59e0b' : '#6b7280' }}>{pct}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function MindHabitsPage() {
  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dHabitsOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dHabitsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🔄</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Xây Thói Quen Bền Vững</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D6 · Habit Formation Science</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">40% hành động của bạn mỗi ngày là thói quen tự động — không phải quyết định có ý thức. Hiểu cơ chế hình thành thói quen là cách thay đổi cuộc sống hiệu quả nhất.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop" alt="Habit Building" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>66 ngày trung bình để hình thành thói quen</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Vòng Lặp Thói Quen (Habit Loop)</h2>
        <p className="text-muted text-sm mb-6">4 yếu tố cấu thành mọi thói quen theo khoa học thần kinh</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LOOP_STEPS.map(s => (
            <div key={s.n} className="rounded-2xl border border-border bg-surface p-5 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-3" style={{ background: `${s.color}20`, color: s.color }}>{s.n}</div>
              <div className="font-bold text-text text-sm mb-2">{s.t}</div>
              <p className="text-xs text-muted leading-relaxed mb-3">{s.d}</p>
              <div className="rounded-lg px-2 py-1 text-xs font-medium" style={{ background: `${s.color}15`, color: s.color }}>{s.ex}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Xây Thói Quen</h2>
        <p className="text-muted text-sm mb-6">Những chiến lược được khoa học chứng minh hiệu quả nhất</p>
        <div className="space-y-4">
          {STACKING.map(s => (
            <div key={s.t} className="rounded-2xl border border-border bg-surface p-5 hover:border-emerald-500/30 transition-colors">
              <div className="font-bold text-text mb-2">{s.t}</div>
              <p className="text-sm text-muted mb-3 leading-relaxed">{s.d}</p>
              <div className="rounded-xl px-4 py-2 text-sm" style={{ background: `${COLOR}12`, color: COLOR }}>
                💡 {s.ex}
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Habit Tracker Tuần Này</h2>
        <p className="text-muted text-sm mb-6">Click vào ô để đánh dấu đã hoàn thành</p>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <HabitTracker />
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>Phá Thói Quen Xấu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: 'Làm cho Cue vô hình hơn', d: 'Xóa app mạng xã hội khỏi màn hình chính. Để đồ ăn vặt ở chỗ khó lấy.' },
            { t: 'Làm cho Craving không hấp dẫn', d: 'Ghi lại tất cả hậu quả tiêu cực của thói quen xấu. Đọc lại khi bị kéo vào.' },
            { t: 'Làm cho Response khó hơn', d: 'Thêm ma sát: phải mặc đồ thể thao mới vào bếp lấy đồ ăn đêm.' },
            { t: 'Làm cho Reward ít thỏa mãn hơn', d: 'Track tần suất thói quen xấu. Cảm giác số đang tăng làm giảm động lực tiếp tục.' },
          ].map(c => (
            <div key={c.t} className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-bold text-text mb-2">{c.t}</div>
              <p className="text-sm text-muted leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
