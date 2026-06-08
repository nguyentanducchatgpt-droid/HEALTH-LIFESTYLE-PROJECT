import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#d946ef';
const RGB = '217,70,239';
const ORBIT_ID = 'd-meditation-orbit-kf';
const ORBIT_PROP = '--d-med-angle';
const ORBIT_CLASS = 'd-med-orbit-ring';

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

const MYTHS = [
  { myth: 'Phải không suy nghĩ gì', truth: 'Thiền là nhận ra mình đang suy nghĩ và quay lại nhẹ nhàng — không phải xóa sạch tư duy' },
  { myth: 'Cần ngồi 30–60 phút', truth: '3 phút mỗi ngày đã có tác dụng. Nhất quán quan trọng hơn thời lượng dài' },
  { myth: 'Phải ngồi hoa sen', truth: 'Ngồi ghế, nằm, đứng, đi bộ đều thiền được — miễn là thoải mái và tỉnh táo' },
  { myth: 'Thiền = tâm linh/tôn giáo', truth: 'Thiền chánh niệm là kỹ năng nhận thức khoa học, không gắn với bất kỳ tín ngưỡng nào' },
];

const PRACTICE_TYPES = [
  {
    id: '3min',
    icon: '⏱️',
    title: 'Thiền 3 Phút',
    subtitle: 'Dành cho người mới — bắt đầu từ đây',
    color: COLOR,
    steps: [
      { time: '1 phút', desc: 'Ngồi thoải mái, nhắm mắt hoặc nhìn xuống. Cảm nhận hơi thở vào và ra.' },
      { time: '1 phút', desc: 'Khi suy nghĩ xuất hiện — nói thầm "biết rồi" và quay lại hơi thở. Không tự trách.' },
      { time: '1 phút', desc: 'Quan sát cảm giác ở mũi, ngực, hoặc bụng khi thở. Kết thúc nhẹ nhàng.' },
    ],
    tip: 'Mỗi lần quay lại hơi thở là một lần "tập tạ" cho tâm trí.',
  },
  {
    id: '5min',
    icon: '🌙',
    title: 'Thiền 5 Phút Trước Ngủ',
    subtitle: 'Thư giãn sâu — chuyển sang trạng thái ngủ',
    color: '#8b5cf6',
    steps: [
      { time: '1 phút', desc: 'Thở chậm, sâu — bụng phồng khi hít, xẹp khi thở ra.' },
      { time: '2 phút', desc: 'Scan cơ thể: trán → vai → ngực → bụng → chân. Mỗi vùng thả lỏng khi thở ra.' },
      { time: '1 phút', desc: 'Thả lỏng bất kỳ vùng nào còn căng. Đặc biệt: hàm, vai, bàn tay.' },
      { time: '1 phút', desc: 'Tự nhắc: "Hôm nay đủ rồi. Ngày mai làm tiếp. Mình cho phép mình nghỉ."' },
    ],
    tip: 'Không cần hoàn thành "hoàn hảo" — cứ thư giãn và ngủ là thành công.',
  },
  {
    id: 'walking',
    icon: '🚶',
    title: 'Thiền Đi Bộ',
    subtitle: 'Cho người khó ngồi yên — thiền động',
    color: '#10b981',
    steps: [
      { time: 'Bắt đầu', desc: 'Đi bộ chậm hơn bình thường, không đội tai nghe, không nhìn điện thoại.' },
      { time: 'Trong khi đi', desc: 'Cảm nhận bàn chân chạm đất từng bước. Để ý trọng lượng cơ thể chuyển dịch.' },
      { time: 'Quan sát', desc: 'Nhìn ánh sáng, cây cối, mây trời. Nghe âm thanh xung quanh không phán xét.' },
      { time: 'Khi phân tâm', desc: 'Quay lại cảm giác bàn chân chạm đất. Thở đều, không đếm thành tích.' },
    ],
    tip: '5–10 phút đủ. Có thể làm trong giờ nghỉ trưa hoặc sau bữa ăn.',
  },
  {
    id: 'eating',
    icon: '🍽️',
    title: 'Chánh Niệm Khi Ăn',
    subtitle: 'Kết nối với Trụ Cột B — nhận biết no-đói',
    color: '#f59e0b',
    steps: [
      { time: 'Trước ăn', desc: 'Tắt màn hình. Quan sát đĩa thức ăn 5 giây trước khi bắt đầu ăn.' },
      { time: 'Khi ăn', desc: 'Nhai kỹ hơn, chậm hơn. Cảm nhận hương vị, kết cấu của từng miếng.' },
      { time: 'Giữa bữa', desc: 'Đặt đũa/thìa xuống một lần. Cảm nhận: đã no chưa? Còn đói thật không?' },
      { time: 'Trước khi lấy thêm', desc: 'Dừng 10 giây. Hỏi: "Mình lấy thêm vì đói hay vì thói quen?"' },
    ],
    tip: 'Ăn chậm 20 phút để não nhận tín hiệu no. Giảm ăn quá mức không cần kiêng khem.',
  },
];

// Simple meditation timer
function MeditationTimer({ color }) {
  const [duration, setDuration] = useState(3);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(180);
  const [done, setDone] = useState(false);
  const iRef = useRef(null);

  const start = () => {
    setDone(false);
    const total = duration * 60;
    setRemaining(total);
    setRunning(true);
    iRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(iRef.current); setRunning(false); setDone(true); return 0; }
        return r - 1;
      });
    }, 1000);
  };
  const stop = () => { clearInterval(iRef.current); setRunning(false); setRemaining(duration * 60); setDone(false); };
  useEffect(() => () => clearInterval(iRef.current), []);

  const total = duration * 60;
  const pct = ((total - remaining) / total) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="rounded-2xl border border-border bg-bg p-5 flex flex-col items-center gap-4 max-w-xs mx-auto">
      <div className="text-sm font-bold uppercase tracking-widest text-muted">Meditation Timer</div>
      {!running && !done && (
        <div className="flex gap-2">
          {[3, 5, 10].map(d => (
            <button key={d} onClick={() => setDuration(d)} className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all border ${duration === d ? 'text-white' : 'text-muted border-border'}`} style={{ background: duration === d ? color : undefined, borderColor: duration === d ? color : undefined }}>
              {d} ph
            </button>
          ))}
        </div>
      )}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" opacity="0.15" />
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center">
          {done ? (
            <div className="text-4xl">🎉</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-text">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</div>
              <div className="text-sm text-muted">{running ? 'thiền...' : `${duration} phút`}</div>
            </>
          )}
        </div>
      </div>
      {done ? (
        <div className="text-base font-bold text-center" style={{ color }}>Hoàn thành! 🧘</div>
      ) : (
        <button onClick={running ? stop : start} className="px-5 py-2 rounded-full text-base font-bold" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
          {running ? 'Dừng' : 'Bắt đầu'}
        </button>
      )}
    </div>
  );
}

export default function MindMeditationPage() {
  const [active, setActive] = useState('3min');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dMedOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dMedOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const practice = PRACTICE_TYPES.find(p => p.id === active);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🧘</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Thiền Ngắn & Chánh Niệm</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D3 · Thiền & Chánh Niệm</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Thiền không phải là "không suy nghĩ". Thiền là nhận ra mình đang bị cuốn đi và quay lại nhẹ nhàng. Mỗi lần quay lại là một lần tập — không cần hoàn hảo.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>4 kiểu thiền · Timer tương tác · Từ 3 phút</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Myths */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Hiểu Đúng Về Thiền</h2>
        <p className="text-muted text-base mb-6">4 hiểu lầm phổ biến khiến người mới bỏ cuộc trước khi bắt đầu.</p>
        <div className="space-y-3">
          {MYTHS.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4 grid md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2"><span className="text-red-400 text-base shrink-0">✗</span><div className="text-base text-muted line-through">{m.myth}</div></div>
              <div className="flex items-start gap-2"><span className="text-base shrink-0" style={{ color: COLOR }}>✓</span><div className="text-base text-text">{m.truth}</div></div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Practice types */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kiểu Thiền Cốt Lõi</h2>
        <p className="text-muted text-base mb-6">Chọn kiểu phù hợp với hoàn cảnh và sở thích của bạn.</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {PRACTICE_TYPES.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all border ${active === p.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: active === p.id ? p.color : undefined, borderColor: active === p.id ? p.color : undefined }}>
              {p.icon} {p.title}
            </button>
          ))}
        </div>
        {practice && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${practice.color}30`, background: `${practice.color}06` }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{practice.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{practice.title}</div>
                <div className="text-sm font-bold uppercase tracking-widest mt-0.5" style={{ color: practice.color }}>{practice.subtitle}</div>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {practice.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg">
                  <span className="text-sm font-bold shrink-0 mt-0.5 min-w-[55px]" style={{ color: practice.color }}>{s.time}</span>
                  <span className="text-base text-text leading-relaxed">{s.desc}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 text-sm" style={{ background: `${practice.color}10` }}>
              💡 <strong style={{ color: practice.color }}>Mẹo:</strong> <span className="text-muted">{practice.tip}</span>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Meditation Timer</h2>
        <p className="text-muted text-base mb-6">Thực hành ngay — chọn thời lượng và bắt đầu thiền.</p>
        <MeditationTimer color={COLOR} />
      </RevealBlock>

      {/* Week plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lộ Trình Tăng Dần</h2>
        <p className="text-muted text-base mb-6">Bắt đầu từ 3 phút, tăng dần trong 7 ngày.</p>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {[
            { day: 'T2', mins: 3 }, { day: 'T3', mins: 3 }, { day: 'T4', mins: 4 },
            { day: 'T5', mins: 5 }, { day: 'T6', mins: 5 }, { day: 'T7', mins: 7 }, { day: 'CN', mins: 10 },
          ].map(d => (
            <div key={d.day} className="rounded-xl border border-border bg-surface p-3 text-center">
              <div className="text-sm font-bold" style={{ color: COLOR }}>{d.day}</div>
              <div className="text-xl font-bold text-text mt-1">{d.mins}</div>
              <div className="text-sm text-muted">phút</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/breathing" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Kỹ Thuật Thở
        </Link>
        <Link to="/pillar/d" className="text-base text-muted hover:text-purple-400 transition-colors text-center">Tâm Trí An Nhiên →</Link>
        <Link to="/pillar/d/body-scan" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group justify-end">
          Body Scan
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
