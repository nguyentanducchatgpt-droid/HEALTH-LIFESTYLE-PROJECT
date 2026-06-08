import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-assessment-orbit-kf';
const ORBIT_PROP = '--c-assess-angle';
const ORBIT_CLASS = 'c-assess-orbit-ring';
const STORAGE_KEY = 'lifestyle_assessment_score';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const QUESTIONS = [
  {
    id: 'sleep_hours',
    category: 'Giấc Ngủ',
    icon: '😴',
    color: '#6366f1',
    q: 'Bạn ngủ bao nhiêu giờ mỗi đêm (trung bình)?',
    options: [
      { label: 'Dưới 5 giờ', pts: 0 },
      { label: '5–6 giờ', pts: 5 },
      { label: '6–7 giờ', pts: 10 },
      { label: '7–9 giờ', pts: 15 },
    ],
  },
  {
    id: 'sleep_quality',
    category: 'Giấc Ngủ',
    icon: '🌙',
    color: '#6366f1',
    q: 'Chất lượng giấc ngủ của bạn như thế nào?',
    options: [
      { label: 'Rất tệ — thường xuyên mất ngủ', pts: 0 },
      { label: 'Thấp — ngủ không ngon', pts: 5 },
      { label: 'Trung bình — đôi khi khó ngủ', pts: 10 },
      { label: 'Tốt — ngủ ngon thường xuyên', pts: 15 },
    ],
  },
  {
    id: 'neat_steps',
    category: 'NEAT & Vận Động',
    icon: '🚶',
    color: '#10b981',
    q: 'Số bước chân trung bình mỗi ngày?',
    options: [
      { label: 'Dưới 3.000 bước', pts: 0 },
      { label: '3.000–6.000 bước', pts: 5 },
      { label: '6.000–10.000 bước', pts: 10 },
      { label: 'Trên 10.000 bước', pts: 15 },
    ],
  },
  {
    id: 'circadian',
    category: 'Nhịp Sinh Học',
    icon: '☀️',
    color: '#f59e0b',
    q: 'Bạn có ra ngoài hoặc tiếp xúc ánh sáng tự nhiên buổi sáng không?',
    options: [
      { label: 'Gần như không bao giờ', pts: 0 },
      { label: 'Hiếm khi (< 2 ngày/tuần)', pts: 3 },
      { label: 'Thỉnh thoảng (3–4 ngày)', pts: 8 },
      { label: 'Thường xuyên (5+ ngày)', pts: 15 },
    ],
  },
  {
    id: 'stress',
    category: 'Quản Lý Căng Thẳng',
    icon: '🧘',
    color: '#a855f7',
    q: 'Mức độ căng thẳng mãn tính của bạn?',
    options: [
      { label: 'Rất cao — ảnh hưởng sinh hoạt', pts: 0 },
      { label: 'Cao — khó kiểm soát', pts: 3 },
      { label: 'Trung bình — có thể quản lý', pts: 8 },
      { label: 'Thấp — cân bằng tốt', pts: 10 },
    ],
  },
  {
    id: 'screen_evening',
    category: 'Môi Trường',
    icon: '📱',
    color: '#f43f5e',
    q: 'Bạn dùng điện thoại/màn hình trước khi ngủ bao lâu?',
    options: [
      { label: 'Cho đến khi ngủ', pts: 0 },
      { label: '>1 giờ trước ngủ', pts: 3 },
      { label: '30–60 phút trước ngủ', pts: 8 },
      { label: 'Không dùng trước ngủ 30 phút', pts: 10 },
    ],
  },
  {
    id: 'water',
    category: 'Hydration',
    icon: '💧',
    color: '#0ea5e9',
    q: 'Bạn uống bao nhiêu nước mỗi ngày?',
    options: [
      { label: 'Dưới 1 lít', pts: 0 },
      { label: '1–1.5 lít', pts: 3 },
      { label: '1.5–2.5 lít', pts: 8 },
      { label: 'Đủ theo công thức (cân nặng × 35ml)', pts: 10 },
    ],
  },
];

const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.pts)), 0);

const TRACKS = [
  { min: 0, max: 40, name: 'Track 1: Xây Nền', color: '#f97316', icon: '🌱', desc: 'Lối sống cần cải thiện cơ bản. Bắt đầu từ 1–2 thói quen đơn giản nhất.', actions: ['Ưu tiên giấc ngủ 7–8 giờ trước tiên', 'Đặt mục tiêu 6.000 bước/ngày', 'Uống đủ 1.5L nước mỗi ngày', 'Xem lộ trình 12 tuần để có kế hoạch cụ thể'] },
  { min: 41, max: 70, name: 'Track 2: Tăng Cường', color: '#f59e0b', icon: '📈', desc: 'Đã có nền tảng, cần tối ưu hóa và nhất quán hơn.', actions: ['Cải thiện chất lượng giấc ngủ (routine trước ngủ)', 'Tăng NEAT: 8.000–10.000 bước', 'Thiết kế môi trường buổi tối', 'Bắt đầu kỹ thuật thở 5 phút/ngày'] },
  { min: 71, max: MAX_SCORE, name: 'Track 3: Tối Ưu Hóa', color: '#10b981', icon: '🏆', desc: 'Lối sống tốt, tập trung vào tinh chỉnh và duy trì bền vững.', actions: ['Thêm biometric tracking (HRV, sleep stages)', 'Thiết kế deload theo chu kỳ', 'Thử Lifestyle Score 100 điểm đầy đủ', 'Chia sẻ và truyền cảm hứng cho người khác'] },
];

export default function LifestyleAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [savedScore, setSavedScore] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cAssessOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cAssessOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (s) setSavedScore(s);
    } catch {}
  }, []);

  const totalScore = Object.values(answers).reduce((sum, pts) => sum + pts, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);
  const track = TRACKS.find(t => totalScore >= t.min && totalScore <= t.max) || TRACKS[0];

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score: totalScore, max: MAX_SCORE, track: track.name, date: new Date().toISOString() }));
      setSavedScore({ score: totalScore, max: MAX_SCORE, track: track.name, date: new Date().toISOString() });
    } catch {}
  };

  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>📋</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Đánh Giá Lối Sống</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C0 · Lifestyle Assessment</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Đánh giá lối sống hiện tại của bạn qua 7 khía cạnh quan trọng. Kết quả sẽ xác định bạn đang ở Track nào và đề xuất hành động ưu tiên phù hợp.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Assessment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>7 câu hỏi · Điểm tối đa {MAX_SCORE} · 3 Tracks</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Previous score */}
      {savedScore && !submitted && (
        <RevealBlock className="mb-8">
          <div className="rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <div className="text-base font-bold uppercase tracking-widest mb-0.5" style={{ color: COLOR }}>Đánh Giá Gần Nhất</div>
              <div className="text-lg text-text">{savedScore.score}/{savedScore.max} điểm · {savedScore.track}</div>
              <div className="text-base text-muted">{new Date(savedScore.date).toLocaleDateString('vi-VN')}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: COLOR }}>{Math.round((savedScore.score / savedScore.max) * 100)}%</div>
            </div>
          </div>
        </RevealBlock>
      )}

      {!submitted ? (
        <>
          {/* Progress */}
          <RevealBlock className="mb-8">
            <div className="flex justify-between text-base text-muted mb-2">
              <span>{answeredCount}/{QUESTIONS.length} câu hỏi</span>
              <span style={{ color: COLOR }}>{progress}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: COLOR }} />
            </div>
          </RevealBlock>

          {/* Questions */}
          <div className="space-y-6 mb-10">
            {QUESTIONS.map((q, qi) => (
              <RevealBlock key={q.id} delay={qi * 50} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{q.icon}</span>
                  <div>
                    <div className="text-base font-bold uppercase tracking-widest mb-0.5" style={{ color: q.color }}>{q.category}</div>
                    <div className="text-lg font-medium text-text">{q.q}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.pts }))} className={`text-left text-lg p-3 rounded-xl border transition-all ${answers[q.id] === opt.pts ? '' : 'border-border hover:border-teal-500/30'}`} style={{ background: answers[q.id] === opt.pts ? `${q.color}15` : undefined, borderColor: answers[q.id] === opt.pts ? q.color : undefined, color: answers[q.id] === opt.pts ? q.color : undefined }}>
                      {opt.label}
                      {answers[q.id] === opt.pts && <span className="ml-2 text-base font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </RevealBlock>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={answeredCount < QUESTIONS.length} className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: answeredCount === QUESTIONS.length ? COLOR : 'rgba(107,114,128,0.3)' }}>
            {answeredCount < QUESTIONS.length ? `Còn ${QUESTIONS.length - answeredCount} câu chưa trả lời` : '→ Xem Kết Quả'}
          </button>
        </>
      ) : (
        /* Results */
        <RevealBlock className="space-y-6">
          {/* Score */}
          <div className="rounded-2xl border p-6 text-center" style={{ borderColor: `${track.color}40`, background: `${track.color}08` }}>
            <div className="text-6xl font-bold mb-2" style={{ color: track.color }}>{totalScore}</div>
            <div className="text-muted text-lg">/ {MAX_SCORE} điểm tối đa</div>
            <div className="mt-4 text-4xl">{track.icon}</div>
            <div className="text-2xl font-bold text-text mt-2">{track.name}</div>
            <p className="text-muted text-lg mt-2 max-w-sm mx-auto">{track.desc}</p>

            {/* Score bar */}
            <div className="mt-5 h-4 bg-bg rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.round((totalScore / MAX_SCORE) * 100)}%`, background: track.color }} />
            </div>
            <div className="text-base text-muted mt-1">{Math.round((totalScore / MAX_SCORE) * 100)}% điểm tối đa</div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-lg font-bold text-text mb-4">Chi Tiết Từng Khía Cạnh</div>
            <div className="space-y-3">
              {QUESTIONS.map(q => {
                const pts = answers[q.id] ?? 0;
                const maxPts = Math.max(...q.options.map(o => o.pts));
                const pct = Math.round((pts / maxPts) * 100);
                return (
                  <div key={q.id} className="flex items-center gap-3">
                    <span className="text-xl w-7">{q.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-base mb-1">
                        <span className="text-muted">{q.category}</span>
                        <span style={{ color: q.color }}>{pts}/{maxPts}</span>
                      </div>
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: q.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border p-5" style={{ borderColor: `${track.color}30`, background: `${track.color}06` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: track.color }}>Hành Động Ưu Tiên Cho Bạn</div>
            <ul className="space-y-2">
              {track.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-text">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${track.color}20`, color: track.color }}>{i + 1}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 py-3 rounded-xl border border-border text-lg text-muted hover:text-text hover:border-teal-500/30 transition-colors">
              Làm Lại
            </button>
            <Link to="/pillar/c/roadmap" className="flex-1 py-3 rounded-xl text-white text-lg font-bold text-center transition-colors" style={{ background: COLOR }}>
              Xem Lộ Trình →
            </Link>
          </div>
        </RevealBlock>
      )}

      <div className="h-px mt-10 mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/checklist" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Checklist Hằng Ngày
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/roadmap" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Lộ Trình 12 Tuần
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
