import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'f-rm-orbit-kf';
const ORBIT_CLASS = 'f-rm-orbit-ring';

const PHASES = [
  {
    phase: 1, weeks: 'Tuần 1–2', title: 'Nền Tảng — Làm Quen Công Cụ', color: '#3b82f6',
    focus: 'Chọn 1–2 công cụ để bắt đầu, không cần dùng hết ngay.',
    goals: [
      'Bắt đầu Checklist 6 mục hàng ngày — mục tiêu ≥ 4/6 mỗi ngày',
      'Đo baseline: cân nặng, vòng eo, sit-to-stand, plank, giấc ngủ',
      'Ghi nhật ký tập luyện ít nhất 2 buổi đầu tiên',
      'Đặt giờ ngủ cố định và thực hành 1 lần/ngày',
      'Khám phá các module trong Pillar F',
    ],
    milestone: 'Hoàn thành baseline test + 10 ngày checklist liên tục',
    tools: ['Checklist Ngày & Tuần', 'Nhật Ký Tập', 'Bộ Test Baseline'],
  },
  {
    phase: 2, weeks: 'Tuần 3–6', title: 'Theo Dõi — Đo Tiến Bộ', color: '#22c55e',
    focus: 'Mở rộng sang thêm 2–3 module. Bắt đầu thấy pattern rõ ràng hơn.',
    goals: [
      'Thêm Lifestyle Tracker: theo dõi ngủ và bước chân hàng ngày',
      'Thêm Mind Tracker: ghi stress và mood 5 ngày/tuần',
      'Làm đầy đủ Template Thực Đơn ít nhất 3 ngày/tuần',
      'Chấm điểm Health Score 3–4 ngày/tuần',
      'Thực hiện Weekly Review cuối mỗi tuần',
    ],
    milestone: 'Test 4 tuần + So sánh với baseline + Review cuối tuần 4',
    tools: ['Lifestyle Tracker', 'Mind Tracker', 'Template Thực Đơn', 'Daily Health Score'],
  },
  {
    phase: 3, weeks: 'Tuần 7–10', title: 'Cá Nhân Hóa — Tối Ưu Theo Mình', color: '#f59e0b',
    focus: 'Điều chỉnh dựa trên dữ liệu. Không cần làm tất cả — làm đúng cái phù hợp với bạn.',
    goals: [
      'Dựa vào kết quả test 4 tuần: tập trung cải thiện 2 chỉ số yếu nhất',
      'Thử Meal Prep 3 ngày ít nhất 1 lần/tuần',
      'Sử dụng Reset Protocol khi lỡ nhịp',
      'Tùy chỉnh checklist theo thói quen thực tế của bạn',
      'Đặt mục tiêu cụ thể cho 4 tuần tiếp theo dựa trên dữ liệu',
    ],
    milestone: 'Test 8 tuần + Ít nhất 1 chỉ số cải thiện rõ rệt so với baseline',
    tools: ['Meal Prep 3 Ngày', 'Reset Protocol', 'Thư Viện Bài Nhanh'],
  },
  {
    phase: 4, weeks: 'Tuần 11–12+', title: 'Tự Vận Hành — Bền Vững Dài Hạn', color: '#a855f7',
    focus: 'Bạn không cần ai nhắc nữa. Hệ thống này đã trở thành của bạn.',
    goals: [
      'Làm Test 12 tuần và so sánh với baseline',
      'Đơn giản hóa routine — giữ lại những gì hoạt động tốt nhất với bạn',
      'Lên kế hoạch cho chu kỳ 12 tuần tiếp theo với mục tiêu mới',
      'Chia sẻ kiến thức và cách tiếp cận với người thân',
      'Review toàn bộ Health Score trend trong 12 tuần qua',
    ],
    milestone: 'Test 12 tuần + Xác định mục tiêu chu kỳ tiếp theo',
    tools: ['Tất cả công cụ', 'Lộ Trình mới'],
  },
];

const ALL_TOOLS = [
  { to: '/pillar/f/checklist', icon: '✅', title: 'Checklist Ngày & Tuần', color: '#f97316' },
  { to: '/pillar/f/workout-log', icon: '🏋️', title: 'Nhật Ký Tập Luyện', color: '#22c55e' },
  { to: '/pillar/f/meal-plan', icon: '🍽️', title: 'Template Thực Đơn', color: '#84cc16' },
  { to: '/pillar/f/lifestyle-tracker', icon: '💤', title: 'Lifestyle Tracker', color: '#14b8a6' },
  { to: '/pillar/f/mind-tracker', icon: '🧘', title: 'Mind & Calm Tracker', color: '#a855f7' },
  { to: '/pillar/f/health-score', icon: '💯', title: 'Daily Health Score', color: '#f97316' },
  { to: '/pillar/f/quick-workouts', icon: '⚡', title: 'Thư Viện Bài Nhanh', color: '#22c55e' },
  { to: '/pillar/f/meal-prep', icon: '🥡', title: 'Meal Prep 3 Ngày', color: '#84cc16' },
  { to: '/pillar/f/reset-protocol', icon: '🔄', title: 'Reset Protocol', color: '#0ea5e9' },
  { to: '/pillar/f/progress-test', icon: '📈', title: 'Bộ Test Tiến Bộ 4 Tuần', color: '#ef4444' },
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

export default function ToolsRoadmapPage() {
  const [openPhase, setOpenPhase] = useState(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-rm-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fRmOrbitSpin { to { --f-rm-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-rm-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fRmOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Lộ Trình 12 Tuần</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            4 giai đoạn · Làm quen → Tối ưu → Tự vận hành
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Hệ thống dẫn dắt từ việc làm quen công cụ, đo tiến bộ, cá nhân hóa theo mình, đến tự vận hành không cần ai nhắc. 12 tuần xây dựng lối sống chủ động.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Roadmap" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            12 tuần · từ công cụ → thói quen → tự vận hành
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Phases */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Lộ Trình 4 Giai Đoạn</h2>
        <p className="text-muted text-sm mb-6">Nhấn vào từng giai đoạn để xem mục tiêu và công cụ cần dùng.</p>
        <div className="space-y-3">
          {PHASES.map((ph, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenPhase(openPhase === i ? null : i)} className="w-full p-4 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${ph.color}20`, color: ph.color }}>P{ph.phase}</div>
                  <div className="flex-1">
                    <div className="font-bold text-text">{ph.title}</div>
                    <div className="text-xs text-muted mt-0.5">{ph.weeks}</div>
                  </div>
                  <span className="text-muted">{openPhase === i ? '▲' : '▼'}</span>
                </div>
              </button>
              {openPhase === i && (
                <div className="px-4 pb-5 border-t border-border pt-4 space-y-4">
                  <p className="text-sm text-muted italic">{ph.focus}</p>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ph.color }}>Mục Tiêu</div>
                    <ul className="space-y-1.5">
                      {ph.goals.map((g, j) => (
                        <li key={j} className="flex gap-2 text-sm text-muted">
                          <span style={{ color: ph.color }} className="shrink-0">→</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ph.color }}>Công Cụ Cần Dùng</div>
                    <div className="flex flex-wrap gap-2">
                      {ph.tools.map((t, j) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full border" style={{ color: ph.color, borderColor: `${ph.color}30`, background: `${ph.color}10` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-3 border-l-2 text-sm" style={{ borderColor: ph.color, background: `${ph.color}10` }}>
                    <strong style={{ color: ph.color }}>Milestone: </strong><span className="text-muted">{ph.milestone}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* All tools */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Tất Cả Công Cụ</h2>
        <p className="text-muted text-sm mb-6">Truy cập nhanh mọi công cụ trong Pillar F.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ALL_TOOLS.map((t, i) => (
            <Link key={i} to={t.to} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:border-purple-500/30 transition-colors group">
              <span className="text-xl">{t.icon}</span>
              <span className="text-sm font-medium text-text group-hover:text-white transition-colors">{t.title}</span>
              <span className="ml-auto text-muted group-hover:text-text transition-colors text-sm">→</span>
            </Link>
          ))}
        </div>
      </RevealBlock>

      {/* CTA */}
      <RevealBlock delay={2} className="mb-10">
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <div className="text-2xl mb-3">🚀</div>
          <h3 className="font-bold text-text mb-2">Bắt Đầu Giai Đoạn 1 Ngay Hôm Nay</h3>
          <p className="text-sm text-muted mb-4">Chỉ cần 1 hành động: mở Checklist và tick xong ngày hôm nay.</p>
          <Link to="/pillar/f/checklist" className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: COLOR }}>
            Mở Checklist →
          </Link>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-xs text-muted mb-6">⚠ Lộ trình mang tính hướng dẫn. Điều chỉnh tùy theo nhịp sống và mục tiêu cá nhân của bạn.</p>
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
