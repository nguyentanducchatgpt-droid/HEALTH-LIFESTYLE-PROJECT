import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#6366f1';
const RGB = '99,102,241';
const ORBIT_ID = 'd-breathing-orbit-kf';
const ORBIT_PROP = '--d-breath-angle';
const ORBIT_CLASS = 'd-breath-orbit-ring';

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
    subtitle: 'Nền tảng — dùng hằng ngày',
    color: '#10b981',
    formula: 'Bụng phồng khi hít → bụng xẹp khi thở',
    when: 'Sau tập, trước ngủ, khi vai gáy căng',
    duration: '1–3 phút',
    steps: [
      'Nằm ngửa hoặc ngồi thoải mái',
      'Một tay đặt lên ngực, một tay đặt lên bụng',
      'Hít vào chậm qua mũi — bụng phồng lên, ngực ít di chuyển',
      'Thở ra từ từ qua miệng hoặc mũi — bụng xẹp xuống',
      'Vai không nhấc lên. Thở nhẹ, chậm, đều.',
    ],
    mistakes: ['Cố hít thật sâu gây chóng mặt', 'Gồng bụng quá mức', 'Vai nhô lên cao khi hít'],
    benefits: ['Giảm căng thẳng trong 2–3 phút', 'Cải thiện O₂ máu', 'Thư giãn cổ-vai-gáy', 'Chuẩn bị giấc ngủ tốt hơn'],
  },
  {
    id: 'box',
    icon: '⬜',
    title: 'Box Breathing',
    subtitle: '4-4-4-4 — Navy SEALs technique',
    color: COLOR,
    formula: 'Hít 4 → Giữ 4 → Thở 4 → Giữ 4',
    when: 'Trước họp, khi bực tức, mất tập trung, hồi hộp',
    duration: '4 vòng (khoảng 1–2 phút)',
    steps: [
      'Ngồi thẳng, vai thả lỏng',
      'Hít vào qua mũi — đếm 4 giây',
      'Giữ hơi thở — đếm 4 giây (thoải mái, không gắng)',
      'Thở ra từ từ — đếm 4 giây',
      'Giữ trống — đếm 4 giây trước khi hít vào tiếp',
    ],
    mistakes: ['Nín thở quá căng', 'Đếm quá nhanh', 'Cố giữ phần "giữ trống" khi khó chịu'],
    benefits: ['Reset hệ thần kinh trong 2 phút', 'Tăng khả năng chịu áp lực', 'Cải thiện tập trung', 'Giảm lo âu tức thời'],
  },
  {
    id: '478',
    icon: '🌊',
    title: 'Thở 4-7-8',
    subtitle: 'Extended exhale — chuẩn bị ngủ',
    color: '#d946ef',
    formula: 'Hít 4 → Giữ 7 → Thở 8',
    when: 'Buổi tối, trước ngủ, sau ngày căng',
    duration: '3–4 vòng',
    steps: [
      'Ngồi hoặc nằm thoải mái',
      'Hít vào qua mũi — đếm 4 giây',
      'Giữ hơi thở — đếm 7 giây',
      'Thở ra hoàn toàn qua miệng — đếm 8 giây (như thổi nến từ xa)',
      'Người mới: dùng nhịp 3-3-6 nếu khó giữ 7 giây',
    ],
    mistakes: ['Cố giữ 7 giây khi thấy chóng mặt — hãy rút ngắn', 'Thở ra quá mạnh, không chậm đều'],
    benefits: ['Kích hoạt hệ phó giao cảm nhanh nhất', 'Giảm nhịp tim trong 60 giây', 'Hiệu quả nhất trước ngủ', 'Giảm lo âu cấp tính'],
  },
  {
    id: 'reset2',
    icon: '⚡',
    title: 'Reset 2 Phút',
    subtitle: 'Emergency tool — dùng ngay khi quá tải',
    color: '#f59e0b',
    formula: 'Dừng → Thở → Thả lỏng → Neo',
    when: 'Khi quá tải, giữa ngày, sau tranh cãi, trước phản ứng nóng vội',
    duration: '2 phút',
    steps: [
      '30 giây: Dừng lại, không cầm điện thoại, không phản ứng ngay',
      '30 giây: Thở 5 nhịp chậm qua mũi',
      '30 giây: Thả lỏng vai, hàm, bàn tay (3 vùng thường căng nhất)',
      '30 giây: Nhìn xa khỏi màn hình → tự hỏi "Việc nhỏ tiếp theo là gì?"',
    ],
    mistakes: ['Bỏ qua bước thả lỏng cơ', 'Dùng điện thoại ngay sau khi reset'],
    benefits: ['Cắt ngắt phản ứng tự động', 'Lấy lại kiểm soát trong 2 phút', 'Dùng được mọi nơi, mọi lúc', 'Ngăn leo thang cảm xúc'],
  },
];

function BoxBreathingTimer({ color }) {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const iRef = useRef(null);
  const pIdxRef = useRef(0);
  const cntRef = useRef(0);
  const PHASES = [
    { key: 'inhale', label: 'Hít vào', dur: 4, scale: 1.2 },
    { key: 'hold1', label: 'Giữ', dur: 4, scale: 1.2 },
    { key: 'exhale', label: 'Thở ra', dur: 4, scale: 0.85 },
    { key: 'hold2', label: 'Giữ trống', dur: 4, scale: 0.85 },
  ];
  const startStop = () => {
    if (running) {
      clearInterval(iRef.current);
      setRunning(false); setPhase('idle'); setCount(0); setCycles(0); pIdxRef.current = 0;
    } else {
      setRunning(true); pIdxRef.current = 0;
      setPhase(PHASES[0].key); cntRef.current = PHASES[0].dur; setCount(PHASES[0].dur);
      iRef.current = setInterval(() => {
        cntRef.current--;
        if (cntRef.current <= 0) {
          const ni = (pIdxRef.current + 1) % 4;
          if (ni === 0) setCycles(c => c + 1);
          pIdxRef.current = ni;
          const p = PHASES[ni];
          setPhase(p.key); cntRef.current = p.dur; setCount(p.dur);
        } else setCount(cntRef.current);
      }, 1000);
    }
  };
  useEffect(() => () => clearInterval(iRef.current), []);
  const cur = PHASES.find(p => p.key === phase) || PHASES[0];
  const pct = phase !== 'idle' ? ((cur.dur - count) / cur.dur) * 100 : 0;
  return (
    <div className="rounded-2xl border border-border bg-bg p-6 flex flex-col items-center gap-4 max-w-sm mx-auto mt-4">
      <div className="text-xs font-bold uppercase tracking-widest text-muted">Box Breathing Interactive Timer</div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="3" opacity="0.15" />
          <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 68}`} strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center transition-transform duration-1000" style={{ transform: running ? `scale(${cur.scale})` : 'scale(1)' }}>
          <div className="text-4xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-xs text-muted mt-1">{running ? cur.label : 'Bắt đầu'}</div>
        </div>
      </div>
      {running && <div className="text-xs text-muted">Vòng {cycles + 1} · Mục tiêu: 4 vòng</div>}
      <button onClick={startStop} className="px-6 py-2 rounded-full text-sm font-bold" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

export default function MindBreathingPage() {
  const [activeTech, setActiveTech] = useState('box');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBreathOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBreathOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tech = TECHNIQUES.find(t => t.id === activeTech);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-xs text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🫁</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Kỹ Thuật Thở</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D2 · Thở & Hạ Nhịp</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Thở là công cụ miễn phí, luôn sẵn sàng, không cần dụng cụ. 4 kỹ thuật cho 4 tình huống khác nhau — từ nền tảng hằng ngày đến emergency reset trong 2 phút.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop" alt="Breathing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>4 kỹ thuật · Timer tương tác · Chọn đúng tình huống</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Quick reference */}
      <RevealBlock className="mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border">{['Tình Huống', 'Kỹ Thuật'].map(h => <th key={h} className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['Sau tập, trước ngủ, vai căng', 'Thở Cơ Hoành'],
                ['Trước họp, khi bực tức, mất tập trung', 'Box Breathing'],
                ['Buổi tối, trước ngủ, hạ nhịp', 'Thở 4-7-8'],
                ['Quá tải giữa ngày, sau tranh cãi', 'Reset 2 Phút'],
              ].map(([sit, tech2]) => (
                <tr key={sit} className="border-b border-border/30">
                  <td className="py-3 pr-4 text-muted text-xs">{sit}</td>
                  <td className="py-3 text-xs font-bold" style={{ color: COLOR }}>{tech2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* Techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Chi Tiết</h2>
        <p className="text-muted text-sm mb-6">Chọn kỹ thuật để xem hướng dẫn từng bước.</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {TECHNIQUES.map(t => (
            <button key={t.id} onClick={() => setActiveTech(t.id)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all border ${activeTech === t.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: activeTech === t.id ? t.color : undefined, borderColor: activeTech === t.id ? t.color : undefined }}>
              {t.icon} {t.title}
            </button>
          ))}
        </div>
        {tech && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${tech.color}30`, background: `${tech.color}06` }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-4xl">{tech.icon}</span>
              <div>
                <div className="text-lg font-bold text-text">{tech.title}</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: tech.color }}>{tech.subtitle}</div>
                <div className="text-sm font-mono mt-2 px-3 py-1 rounded-full inline-block" style={{ background: `${tech.color}15`, color: tech.color }}>{tech.formula}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Các Bước</div>
                <ol className="space-y-2">
                  {tech.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `${tech.color}20`, color: tech.color }}>{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                {activeTech === 'box' && <BoxBreathingTimer color={tech.color} />}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tech.color }}>Lợi Ích</div>
                  <ul className="space-y-1">{tech.benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-xs text-muted"><span style={{ color: tech.color }}>✓</span>{b}</li>)}</ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: tech.color }}>Lỗi Thường Gặp</div>
                  <ul className="space-y-1">{tech.mistakes.map((m, i) => <li key={i} className="flex items-start gap-2 text-xs text-muted"><span className="text-red-400">✗</span>{m}</li>)}</ul>
                </div>
                <div className="rounded-xl p-3 text-xs" style={{ background: `${tech.color}10` }}>
                  <span className="font-bold" style={{ color: tech.color }}>⏰ Khi nào:</span> <span className="text-muted">{tech.when}</span>
                  <br /><span className="font-bold" style={{ color: tech.color }}>🕐 Thời gian:</span> <span className="text-muted">{tech.duration}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Daily plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Lịch Thở Hằng Ngày</h2>
        <p className="text-muted text-sm mb-6">Tích hợp vào 4 điểm trong ngày — không cần thêm thời gian riêng.</p>
        <div className="space-y-3">
          {[
            { time: '🌅 Buổi sáng', tech: 'Thở Cơ Hoành', dur: '1–2 phút', tip: 'Trước khi ra khỏi giường — kích hoạt nhẹ nhàng' },
            { time: '💼 Trước họp/tập', tech: 'Box Breathing', dur: '4 vòng', tip: 'Tăng tập trung, bình tĩnh trước áp lực' },
            { time: '⚡ Giữa ngày căng', tech: 'Reset 2 Phút', dur: '2 phút', tip: 'Cắt vòng lặp stress, chọn việc tiếp theo' },
            { time: '🌙 Trước ngủ', tech: 'Thở 4-7-8 hoặc Cơ Hoành', dur: '3–5 phút', tip: 'Chuyển cơ thể sang trạng thái nghỉ ngơi' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-indigo-500/20 transition-colors">
              <div className="text-sm w-40 shrink-0 text-text font-medium">{item.time}</div>
              <div className="flex-1">
                <div className="text-xs font-bold" style={{ color: COLOR }}>{item.tech}</div>
                <div className="text-xs text-muted">{item.tip}</div>
              </div>
              <div className="text-xs text-muted shrink-0">{item.dur}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/stress" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Hiểu Stress
        </Link>
        <Link to="/pillar/d" className="text-sm text-muted hover:text-purple-400 transition-colors text-center">Tâm Trí An Nhiên →</Link>
        <Link to="/pillar/d/meditation" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group justify-end">
          Thiền Ngắn
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
