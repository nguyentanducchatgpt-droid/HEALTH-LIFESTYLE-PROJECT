import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'd-roadmap-orbit-kf';
const ORBIT_CLASS = 'd-roadmap-orbit-ring';
const PROP = '--d-roadmap-orbit-angle';

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

const PHASES = [
  {
    phase: 'Giai Đoạn 1',
    weeks: 'Tuần 1–2',
    title: 'Nhận Diện & Nền Tảng',
    color: '#6366f1',
    icon: '🔍',
    goals: ['Làm bài đánh giá ban đầu', 'Học nhận diện 3 loại stress', 'Thực hành thở bụng 5 phút/ngày', 'Bắt đầu nhật ký 5 dòng mỗi tối'],
    milestones: ['Biết stress level hiện tại', 'Có 1 kỹ thuật thở cơ bản', 'Viết nhật ký được 7 ngày liên tiếp'],
    time: '15–20 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 2',
    weeks: 'Tuần 3–4',
    title: 'Xây Công Cụ Cốt Lõi',
    color: '#8b5cf6',
    icon: '🛠️',
    goals: ['Thiền 3 phút mỗi sáng', 'Học kỹ thuật Box Breathing', 'Brain dump 1 lần/tuần khi cảm thấy quá tải', 'Thiết lập 1 phone-free zone'],
    milestones: ['Thiền 7 ngày liên tiếp', 'Dùng box breathing khi stress', 'Giảm screen time trước ngủ'],
    time: '20–25 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 3',
    weeks: 'Tuần 5–8',
    title: 'Mở Rộng Thực Hành',
    color: '#a855f7',
    icon: '🌱',
    goals: ['Thiền 5–10 phút mỗi ngày', 'Body scan 1 lần/tuần', 'Thử Journaling theo 2 mẫu khác nhau', 'Xây 1 thói quen mới theo habit loop', 'Giới hạn social media 30ph/ngày'],
    milestones: ['Có routine buổi sáng và tối ổn định', 'Body scan 4 lần', 'Giữ 2 thói quen trong 30 ngày'],
    time: '25–35 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 4',
    weeks: 'Tuần 9–12',
    title: 'Cá Nhân Hóa & Ổn Định',
    color: '#d946ef',
    icon: '⭐',
    goals: ['Chọn 3–5 thực hành phù hợp nhất với bản thân', 'Làm lại bài đánh giá — so sánh trước/sau', 'Xây "Mental Wellness Stack" cá nhân', 'Chia sẻ hoặc hướng dẫn 1 người khác'],
    milestones: ['Calm Score tăng ít nhất 15 điểm', 'Có routine cá nhân ổn định', 'Cảm thấy bình tĩnh hơn trong stress'],
    time: '20–30 phút/ngày (bền vững)',
  },
];

const DAILY_STACK = [
  { time: 'Sáng (10ph)', items: ['Uống nước + 5 hít thở sâu', 'Thiền 3–5 phút', 'Viết 1 ý định cho ngày'] },
  { time: 'Chiều (5ph)', items: ['Check-in cảm xúc', 'Box breathing nếu stress', 'Di chuyển 5 phút'] },
  { time: 'Tối (10ph)', items: ['Viết nhật ký 5 dòng', 'Không màn hình 30ph trước ngủ', 'Body scan 5 phút (tuỳ chọn)'] },
];

const LINKS = [
  { to: '/pillar/d/assessment', icon: '🧠', t: 'Đánh Giá Tâm Trí', d: 'Đo lường trước khi bắt đầu' },
  { to: '/pillar/d/stress', icon: '😤', t: 'Quản Lý Stress', d: 'Tuần 1–2' },
  { to: '/pillar/d/breathing', icon: '💨', t: 'Kỹ Thuật Thở', d: 'Tuần 1–4' },
  { to: '/pillar/d/meditation', icon: '🧘', t: 'Thiền Định', d: 'Tuần 2–8' },
  { to: '/pillar/d/body-scan', icon: '🫀', t: 'Body Scan', d: 'Tuần 5–8' },
  { to: '/pillar/d/journaling', icon: '📓', t: 'Nhật Ký', d: 'Tuần 1–12' },
  { to: '/pillar/d/brain-dump', icon: '🧹', t: 'Brain Dump', d: 'Khi quá tải' },
  { to: '/pillar/d/digital-detox', icon: '📵', t: 'Digital Detox', d: 'Tuần 3–6' },
  { to: '/pillar/d/gentle-discipline', icon: '🌿', t: 'Kỷ Luật Mềm', d: 'Tuần 5–12' },
  { to: '/pillar/d/habits', icon: '🔄', t: 'Xây Thói Quen', d: 'Tuần 5–12' },
  { to: '/pillar/d/checklist', icon: '✅', t: 'Checklist Hằng Ngày', d: 'Toàn bộ lộ trình' },
];

export default function MindRoadmapPage() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dRoadmapOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dRoadmapOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const p = PHASES[activePhase];

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🗺️</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Lộ Trình 12 Tuần Tâm Trí An Nhiên</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D7 · Hành Trình Từng Bước</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Lộ trình từng bước để xây dựng sức khỏe tâm trí bền vững — từ nhận diện stress đến có một "bộ công cụ tâm trí" hoàn chỉnh cá nhân hóa cho bạn.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop" alt="Roadmap" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>4 Giai Đoạn · 12 Tuần</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Giai Đoạn Phát Triển</h2>
        <p className="text-muted text-sm mb-6">Click vào từng giai đoạn để xem chi tiết</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {PHASES.map((ph, i) => (
            <button key={i} onClick={() => setActivePhase(i)}
              className="rounded-2xl border p-4 text-left transition-all"
              style={activePhase === i
                ? { borderColor: ph.color, background: `${ph.color}15` }
                : { borderColor: '#2a2a2a', background: 'transparent' }}>
              <div className="text-2xl mb-2">{ph.icon}</div>
              <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: ph.color }}>{ph.weeks}</div>
              <div className="text-sm font-semibold text-text">{ph.title}</div>
            </button>
          ))}
        </div>
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${p.color}30`, background: `${p.color}07` }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{p.icon}</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.phase} · {p.weeks} · {p.time}</div>
              <div className="text-lg font-bold text-text">{p.title}</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: p.color }}>Mục Tiêu</p>
              <ul className="space-y-2">
                {p.goals.map(g => (
                  <li key={g} className="flex items-start gap-2 text-sm text-muted">
                    <span className="shrink-0 mt-1" style={{ color: p.color }}>→</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: p.color }}>Milestones</p>
              <ul className="space-y-2">
                {p.milestones.map(m => (
                  <li key={m} className="flex items-start gap-2 text-sm text-muted">
                    <span className="shrink-0 mt-1" style={{ color: p.color }}>✓</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Mental Wellness Stack Hằng Ngày</h2>
        <p className="text-muted text-sm mb-6">25 phút mỗi ngày chia ra 3 buổi — không cần làm tất cả cùng lúc</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_STACK.map(s => (
            <div key={s.time} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>{s.time}</div>
              <ul className="space-y-2">
                {s.items.map(it => (
                  <li key={it} className="flex items-start gap-2 text-sm text-muted">
                    <span className="shrink-0" style={{ color: COLOR }}>·</span>{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Tất Cả Công Cụ Của Bạn</h2>
        <p className="text-muted text-sm mb-6">Truy cập nhanh vào mọi module trong lộ trình</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-purple-500/40 transition-all group">
              <span className="text-xl shrink-0">{l.icon}</span>
              <div>
                <div className="text-sm font-semibold text-text group-hover:text-purple-300 transition-colors">{l.t}</div>
                <div className="text-xs text-muted">{l.d}</div>
              </div>
            </Link>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6 text-center" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <div className="text-3xl mb-3">🌟</div>
          <p className="text-base text-text font-semibold mb-2">Bắt Đầu Từ Hôm Nay</p>
          <p className="text-sm text-muted mb-5 max-w-lg mx-auto">Không cần hoàn hảo. Không cần làm tất cả. Chỉ cần bắt đầu 1 việc nhỏ nhất — thở sâu 5 lần, viết 1 dòng nhật ký, hay tắt điện thoại 30 phút trước khi ngủ.</p>
          <Link to="/pillar/d/assessment"
            className="inline-block px-8 py-3 rounded-full font-bold text-sm"
            style={{ background: COLOR, color: '#fff' }}>
            Bắt đầu với bài đánh giá →
          </Link>
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
