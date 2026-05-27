import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#22c55e';
const RGB = '34,197,94';
const ORBIT_ID = 'f-qw-orbit-kf';
const ORBIT_CLASS = 'f-qw-orbit-ring';

const WORKOUTS = [
  {
    dur: '5 phút', label: 'Reset Cơ Thể', color: '#22c55e', icon: '🌬️',
    goal: 'Duy trì chuỗi thói quen khi quá bận. Không phải để đốt mỡ.',
    who: 'Mọi cấp độ — đặc biệt hữu ích sau nhiều giờ ngồi máy tính.',
    steps: [
      { name: 'Thở cơ hoành', dur: '1 phút', desc: 'Hít vào 4s, giữ 4s, thở ra 6s. Lặp lại.' },
      { name: 'Xoay vai mở ngực', dur: '1 phút', desc: 'Xoay vai ra sau 10 lần, sau đó mở ngực hai bên.' },
      { name: 'Cat-cow hoặc Thoracic twist', dur: '1 phút', desc: 'Trên sàn hoặc ngồi ghế. 10 lần mỗi bên.' },
      { name: 'Squat ghế nhẹ', dur: '1 phút', desc: 'Đứng lên ngồi xuống từ ghế, chậm và kiểm soát.' },
      { name: 'Child pose / thở chậm', dur: '1 phút', desc: 'Nằm sấp, dạng gối, thở sâu. Giãn cơ lưng dưới.' },
    ],
    tip: 'Đặt hẹn 3 lần/ngày khi ngồi nhiều: sáng — trưa — chiều.',
  },
  {
    dur: '10 phút', label: 'Toàn Thân Người Mới', color: '#f97316', icon: '⚡',
    goal: 'Làm quen chuyển động cơ bản. Phù hợp buổi sáng sớm hoặc giờ nghỉ trưa.',
    who: 'Người mới bắt đầu, tuần đầu tiên, hoặc ngày không muốn tập nặng.',
    steps: [
      { name: 'Khởi động', dur: '2 phút', desc: 'Đi bộ tại chỗ, xoay vai, squat ghế. Tăng nhịp tim từ từ.' },
      { name: 'Vòng 1 × 6 phút', dur: '6 phút', desc: 'Squat 30s → Push-up gối 30s → Glute bridge 30s → Dead bug 30s. Nghỉ 30s rồi lặp lại.' },
      { name: 'Giãn cơ + thở', dur: '2 phút', desc: 'Kéo giãn đùi trước, ngực, hông. Thở sâu để hạ nhịp tim.' },
    ],
    tip: 'Khi quen, tăng từ 10 phút lên 15 phút bằng cách thêm 1 vòng nữa.',
  },
  {
    dur: '20 phút', label: 'Full Body Chuẩn', color: '#ef4444', icon: '🔥',
    goal: 'Tạo hiệu quả rõ ràng nếu duy trì 3–4 lần/tuần. Đủ kích thích cơ bắp toàn thân.',
    who: 'Người đã quen vận động, muốn kết quả thực sự mà không cần phòng gym.',
    steps: [
      { name: 'Khởi động', dur: '4 phút', desc: 'Đi bộ nhanh tại chỗ, jumping jack, xoay hông, squat nhẹ.' },
      { name: '3 vòng × 12 phút', dur: '12 phút', desc: 'Squat/Sit-to-stand → Push-up → Band row hoặc Dumbbell row → Glute bridge → Plank 30s hoặc Dead bug. Nghỉ 60s giữa vòng.' },
      { name: 'Cooldown giãn cơ', dur: '4 phút', desc: 'Kéo giãn đùi trước, ngực, vai, hông, lưng dưới. Thở sâu.' },
    ],
    tip: 'Tăng tiến bằng cách thêm cân hoặc tăng số reps, không phải tăng thời gian.',
  },
  {
    dur: '30 phút', label: 'Cardio Endurance', color: '#6366f1', icon: '🏃',
    goal: 'Tăng sức bền tim mạch và đốt calo hiệu quả. Thay thế hoàn toàn cho chạy bộ.',
    who: 'Người muốn cardio mà không cần ra ngoài. Tốt cho ngày phục hồi giữa hai buổi tập nặng.',
    steps: [
      { name: 'Khởi động nhẹ', dur: '5 phút', desc: 'Đi bộ tại chỗ, xoay khớp, high knee nhẹ.' },
      { name: 'Circuit cardio × 20 phút', dur: '20 phút', desc: 'Jumping jack 45s → March tại chỗ 15s. Step touch 45s → nghỉ 15s. Shadow boxing 45s → nghỉ 15s. Đi bộ fast pace 45s → nghỉ 15s. Lặp lại 3–4 vòng.' },
      { name: 'Cooldown đi bộ chậm', dur: '5 phút', desc: 'Đi bộ thật chậm tại chỗ. Thở sâu đều. Kéo giãn nhẹ.' },
    ],
    tip: 'Cường độ đúng: bạn có thể nói được câu ngắn nhưng không thể hát.',
  },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function ToolsQuickWorkoutsPage() {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-qw-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fQwOrbitSpin { to { --f-qw-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-qw-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fQwOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>⚡</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Thư Viện Bài Nhanh</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            5 · 10 · 20 · 30 phút · Không cần thiết bị
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Bài tập 5–30 phút cho mọi tình huống. Quá bận, quá mệt, hay chỉ cần reset — luôn có lựa chọn phù hợp. Không có lý do nào đủ để bỏ hoàn toàn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop" alt="Quick workouts" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            luôn có 5 phút — luôn có lựa chọn
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Workout selector */}
      <RevealBlock delay={0} className="mb-4">
        <div className="flex gap-2 flex-wrap mb-6">
          {WORKOUTS.map((w, i) => (
            <button key={i} onClick={() => setOpen(i)}
              className="px-4 py-2 rounded-full text-sm font-bold border transition-all"
              style={{ borderColor: open === i ? w.color : 'rgba(255,255,255,0.1)', background: open === i ? `${w.color}20` : 'transparent', color: open === i ? w.color : '#999' }}>
              {w.icon} {w.dur}
            </button>
          ))}
        </div>
      </RevealBlock>

      {/* Workout detail */}
      {WORKOUTS.map((w, i) => open === i && (
        <RevealBlock key={i} delay={0} className="mb-12">
          <div className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${w.color}30` }}>
            <div className="p-5 border-b border-border" style={{ background: `${w.color}08` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{w.icon}</span>
                <div>
                  <div className="font-black text-xl text-text">{w.dur} — {w.label}</div>
                  <div className="text-xs text-muted mt-0.5">Mục tiêu: {w.goal}</div>
                </div>
              </div>
              <div className="text-xs text-muted p-3 rounded-xl border" style={{ borderColor: `${w.color}20`, background: `${w.color}08` }}>
                <strong style={{ color: w.color }}>Phù hợp cho:</strong> {w.who}
              </div>
            </div>
            <div className="p-5 space-y-4">
              {w.steps.map((step, j) => (
                <div key={j} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ background: `${w.color}20`, color: w.color }}>{j + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text text-sm">{step.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ color: w.color, background: `${w.color}15` }}>{step.dur}</span>
                    </div>
                    <p className="text-sm text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="p-3 rounded-xl text-sm" style={{ background: `${w.color}10`, borderLeft: `3px solid ${w.color}` }}>
                <strong style={{ color: w.color }}>💡 Tip tăng tiến:</strong> <span className="text-muted">{w.tip}</span>
              </div>
            </div>
          </div>
        </RevealBlock>
      ))}

      {/* When to use */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>Chọn Bài Tập Thế Nào?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { situation: 'Đang rất bận, có 5 phút', recommend: 'Bài 5 phút Reset', icon: '⏰' },
            { situation: 'Mới bắt đầu, còn ngại', recommend: 'Bài 10 phút Người Mới', icon: '🌱' },
            { situation: 'Muốn kết quả thực sự', recommend: 'Bài 20 phút Full Body', icon: '💪' },
            { situation: 'Ngày không tập nặng', recommend: 'Bài 30 phút Cardio', icon: '🚶' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border p-4">
              <div className="text-xl mb-2">{s.icon}</div>
              <div className="text-xs text-muted mb-1">Tình huống: {s.situation}</div>
              <div className="text-sm font-bold" style={{ color: COLOR }}>→ {s.recommend}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
