import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'c-breathing-orbit-kf';
const ORBIT_PROP = '--c-breath-angle';
const ORBIT_CLASS = 'c-breath-orbit-ring';

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

const TECHNIQUES = [
  {
    id: 'diaphragm',
    icon: '🫁',
    title: 'Thở Cơ Hoành',
    subtitle: 'Diaphragmatic Breathing',
    color: '#0ea5e9',
    desc: 'Kỹ thuật thở cơ bản, kích hoạt hệ phó giao cảm, giảm cortisol ngay lập tức.',
    steps: [
      'Nằm ngửa hoặc ngồi thoải mái, một tay đặt lên bụng, tay kia lên ngực.',
      'Hít vào chậm qua mũi — bụng phồng lên, ngực gần như không động.',
      'Thở ra từ từ qua miệng (hoặc mũi) — bụng xẹp xuống.',
      'Thực hành 5–10 phút, nhịp thở khoảng 6–8 lần/phút.',
    ],
    benefits: ['Giảm căng thẳng trong 3 phút', 'Cải thiện hàm lượng O₂ máu', 'Tăng HRV (Heart Rate Variability)', 'Hỗ trợ giấc ngủ sâu hơn'],
    when: 'Mỗi sáng, trước khi ngủ, khi căng thẳng',
    duration: '5–10 phút',
  },
  {
    id: 'box',
    icon: '⬜',
    title: 'Box Breathing',
    subtitle: '4-4-4-4 Square Breath',
    color: '#a855f7',
    desc: 'Kỹ thuật của Navy SEALs. Cân bằng hệ thần kinh tự chủ, tăng khả năng tập trung dưới áp lực.',
    steps: [
      'Hít vào chậm đếm 4 giây (qua mũi).',
      'Giữ hơi thở đếm 4 giây (không gắng, thoải mái).',
      'Thở ra từ từ đếm 4 giây (qua miệng hoặc mũi).',
      'Giữ trống đếm 4 giây trước khi hít vào tiếp.',
    ],
    benefits: ['Reset hệ thần kinh trong 2 phút', 'Tăng khả năng chịu đựng áp lực', 'Cải thiện tập trung và ra quyết định', 'Giảm lo âu nhanh chóng'],
    when: 'Trước bài tập, cuộc họp quan trọng, khi lo lắng',
    duration: '4–8 vòng (2–4 phút)',
  },
  {
    id: 'exhale',
    icon: '🌊',
    title: 'Extended Exhale',
    subtitle: '4-8 Breathing',
    color: '#10b981',
    desc: 'Kéo dài thở ra gấp đôi hít vào. Kích hoạt trực tiếp dây thần kinh phế vị, giảm nhịp tim nhanh.',
    steps: [
      'Hít vào qua mũi đếm 4 giây.',
      'Thở ra qua miệng đếm 8 giây (thở ra như thổi nến xa, chậm và đều).',
      'Không cần giữ hơi — liên tục hít-thở theo nhịp 4-8.',
      'Thực hành 5–10 vòng.',
    ],
    benefits: ['Giảm nhịp tim trong 60 giây', 'Hiệu quả nhất khi lo âu cấp tính', 'Dễ thực hành ở mọi nơi', 'Chuẩn bị giấc ngủ tốt hơn Box Breathing'],
    when: 'Khi lo âu đột ngột, trước khi ngủ, sau tranh luận',
    duration: '5–10 vòng (2–3 phút)',
  },
];

const SCIENCE = [
  { icon: '🧠', title: 'Hệ phó giao cảm', desc: 'Thở chậm kích hoạt vagus nerve, chuyển cơ thể từ "fight-or-flight" sang "rest-and-digest" trong 90 giây.' },
  { icon: '❤️', title: 'HRV & Sức khỏe tim', desc: 'Thở có nhịp 6 lần/phút tối ưu hoá HRV — chỉ số vàng về khả năng phục hồi và căng thẳng.' },
  { icon: '🧘', title: 'CO₂ & Trạng thái bình tĩnh', desc: 'Không phải O₂ mà CO₂ mới là tín hiệu thở. Thở quá nhanh → thiếu CO₂ → lo âu, chóng mặt.' },
  { icon: '💪', title: 'Hiệu suất thể thao', desc: 'Thở đúng tư thế (cơ hoành) trong tập luyện tăng sức bền, giảm mệt cơ phụ (cổ, vai).' },
];

// Box breathing animation component
function BoxBreathingTimer() {
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold1, exhale, hold2
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);
  const phaseRef = useRef('idle');
  const countRef = useRef(0);

  const PHASES = [
    { key: 'inhale', label: 'Hít vào', duration: 4, color: '#0ea5e9' },
    { key: 'hold1', label: 'Giữ', duration: 4, color: '#a855f7' },
    { key: 'exhale', label: 'Thở ra', duration: 4, color: '#10b981' },
    { key: 'hold2', label: 'Giữ trống', duration: 4, color: '#f97316' },
  ];

  const startStop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
      setPhase('idle');
      setCount(0);
      setCycles(0);
      phaseRef.current = 'idle';
    } else {
      setRunning(true);
      setPhase('inhale');
      setCount(4);
      phaseRef.current = 'inhale';
      countRef.current = 4;
      let phaseIdx = 0;
      intervalRef.current = setInterval(() => {
        countRef.current -= 1;
        if (countRef.current <= 0) {
          phaseIdx = (phaseIdx + 1) % 4;
          if (phaseIdx === 0) setCycles(c => c + 1);
          const nextPhase = PHASES[phaseIdx];
          phaseRef.current = nextPhase.key;
          setPhase(nextPhase.key);
          countRef.current = nextPhase.duration;
          setCount(nextPhase.duration);
        } else {
          setCount(countRef.current);
        }
      }, 1000);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const currentPhase = PHASES.find(p => p.key === phase) || PHASES[0];
  const progress = phase !== 'idle' ? ((currentPhase.duration - count) / currentPhase.duration) * 100 : 0;
  const circleSize = phase === 'inhale' ? 1.15 : phase === 'hold1' ? 1.15 : phase === 'exhale' ? 0.85 : 0.85;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col items-center gap-4">
      <div className="text-lg font-bold uppercase tracking-widest text-muted">Box Breathing Timer</div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: COLOR }} />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke={currentPhase.color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center transition-transform duration-1000" style={{ transform: `scale(${running ? circleSize : 1})` }}>
          <div className="text-5xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-base text-muted mt-1">{running ? currentPhase.label : 'Bắt đầu'}</div>
        </div>
      </div>
      {running && <div className="text-base text-muted">Vòng {cycles + 1}</div>}
      <button onClick={startStop} className="px-6 py-2 rounded-full text-lg font-bold transition-all" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : COLOR, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

export default function LifestyleBreathingPage() {
  const [activeTech, setActiveTech] = useState('box');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cBreathOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cBreathOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tech = TECHNIQUES.find(t => t.id === activeTech);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🌬️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Kỹ Thuật Thở</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C6 · Breathing</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Bạn thở 20.000 lần mỗi ngày. Đa số vô thức và không hiệu quả. Chỉ cần thay đổi cách thở 5 phút mỗi ngày, bạn có thể giảm cortisol, cải thiện giấc ngủ và tăng hiệu suất não bộ.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop" alt="Breathing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Hít thở có chủ ý · 3 kỹ thuật khoa học</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Science section */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Khoa Học Đằng Sau Hơi Thở</h2>
        <p className="text-muted text-lg mb-6">Thở là công cụ duy nhất bạn có thể điều khiển cả hệ tự chủ và ý thức.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCIENCE.map(s => (
            <div key={s.title} className="rounded-2xl border border-border bg-surface p-5 hover:border-sky-500/20 transition-colors">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-lg font-bold text-text mb-2">{s.title}</div>
              <div className="text-base text-muted leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 3 techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Kỹ Thuật Thở Cốt Lõi</h2>
        <p className="text-muted text-lg mb-6">Mỗi kỹ thuật có mục đích khác nhau — chọn đúng thời điểm để hiệu quả tối đa.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TECHNIQUES.map(t => (
            <button key={t.id} onClick={() => setActiveTech(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium transition-all border ${activeTech === t.id ? 'text-white' : 'text-muted border-border hover:border-sky-500/30'}`} style={{ background: activeTech === t.id ? t.color : undefined, borderColor: activeTech === t.id ? t.color : undefined }}>
              <span>{t.icon}</span>{t.title}
            </button>
          ))}
        </div>

        {tech && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${tech.color}30`, background: `${tech.color}08` }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{tech.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{tech.title}</div>
                <div className="text-base font-bold uppercase tracking-widest mt-1" style={{ color: tech.color }}>{tech.subtitle}</div>
                <p className="text-lg text-muted mt-2 leading-relaxed">{tech.desc}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Cách Thực Hiện</div>
                <ol className="space-y-2">
                  {tech.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-text">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${tech.color}20`, color: tech.color }}>{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Lợi Ích</div>
                  <ul className="space-y-1">
                    {tech.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-lg text-text"><span style={{ color: tech.color }}>✓</span>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl p-3" style={{ background: `${tech.color}10` }}>
                  <div className="text-base text-muted mb-1">⏰ Khi nào dùng</div>
                  <div className="text-lg text-text font-medium">{tech.when}</div>
                  <div className="text-base text-muted mt-1">🕐 {tech.duration}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Interactive box breathing timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Box Breathing Timer</h2>
        <p className="text-muted text-lg mb-6">Thực hành ngay — timer sẽ hướng dẫn từng bước theo nhịp 4-4-4-4.</p>
        <div className="max-w-xs mx-auto">
          <BoxBreathingTimer />
        </div>
      </RevealBlock>

      {/* Daily plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kế Hoạch Thở Hằng Ngày</h2>
        <p className="text-muted text-lg mb-6">Tích hợp 3 kỹ thuật vào thói quen hiện tại — không cần thêm thời gian riêng.</p>
        <div className="space-y-3">
          {[
            { time: 'Sáng thức dậy', tech: 'Thở Cơ Hoành', duration: '3–5 phút', why: 'Kích hoạt hệ phó giao cảm, ra khỏi trạng thái "còn ngủ"', icon: '🌅' },
            { time: 'Trước bài tập / họp', tech: 'Box Breathing', duration: '2–4 phút', why: 'Tăng tập trung, bình ổn hệ thần kinh trước áp lực', icon: '💪' },
            { time: 'Giữa ngày (stress cao)', tech: 'Extended Exhale', duration: '2–3 phút', why: 'Reset nhanh, giảm cortisol trong vài phút', icon: '🌊' },
            { time: 'Trước khi ngủ', tech: 'Thở Cơ Hoành hoặc Extended Exhale', duration: '5–10 phút', why: 'Chuyển sang trạng thái nghỉ ngơi, cải thiện sleep onset', icon: '🌙' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-4 border border-border bg-surface hover:border-sky-500/20 transition-colors">
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-lg font-bold text-text">{item.time}</div>
                <div className="text-base text-muted mt-0.5">{item.why}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold" style={{ color: COLOR }}>{item.tech}</div>
                <div className="text-base text-muted">{item.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/deload" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Deload
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/environment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Thiết Kế Môi Trường
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
