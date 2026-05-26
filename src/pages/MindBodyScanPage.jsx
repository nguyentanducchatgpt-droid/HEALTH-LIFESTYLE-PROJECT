import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ec4899';
const RGB = '236,72,153';
const ORBIT_ID = 'd-bodyscan-orbit-kf';
const ORBIT_PROP = '--d-bs-angle';
const ORBIT_CLASS = 'd-bs-orbit-ring';

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

const BODY_ZONES = [
  { id: 'head', icon: '🧠', name: 'Đầu & Trán', time: '1 phút', instructions: 'Cảm nhận trán — có căng không? Thả lỏng cơ trán, nhắm mắt nhẹ nhàng. Thở ra và để trán xẹp xuống.', tension: 'Thường căng khi lo lắng, nhìn màn hình nhiều' },
  { id: 'jaw', icon: '😶', name: 'Hàm & Cổ', time: '1 phút', instructions: 'Hàm có bị nghiến không? Để lưỡi chạm vòm miệng, miệng hé nhẹ. Cổ thả lỏng, đầu hơi nặng.', tension: 'Vùng giữ stress lớn nhất — nhiều người nghiến hàm mà không biết' },
  { id: 'shoulders', icon: '💪', name: 'Vai & Cánh Tay', time: '1 phút', instructions: 'Vai có đang nhô lên không? Hít vào, nhấc vai lên cao, thở ra mạnh và thả vai xuống hoàn toàn. Cảm nhận sức nặng của cánh tay.', tension: 'Tích lũy stress từ ngồi máy tính, mang ba lô, căng thẳng' },
  { id: 'chest', icon: '❤️', name: 'Ngực & Bụng', time: '1 phút', instructions: 'Cảm nhận ngực phồng-xẹp theo hơi thở. Bụng có căng không? Thở ra và để bụng mềm ra, không cần hút vào.', tension: 'Ngực thắt khi lo âu; bụng cứng khi giữ cảm xúc' },
  { id: 'hips', icon: '🦴', name: 'Lưng & Hông', time: '1 phút', instructions: 'Lưng đang tiếp xúc với mặt giường/ghế như thế nào? Thở ra và để lưng nặng hơn, chìm xuống. Hông thả lỏng.', tension: 'Ngồi nhiều làm cơ hông và lưng dưới căng cứng' },
  { id: 'legs', icon: '🦵', name: 'Đùi & Bắp Chân', time: '1 phút', instructions: 'Đùi có đang căng không? Thở ra và để đùi nặng xuống. Bắp chân thả lỏng, mắt cá chân buông.', tension: 'Vùng hay bị bỏ quên khi thư giãn, ảnh hưởng chất lượng ngủ' },
  { id: 'feet', icon: '🦶', name: 'Bàn Chân', time: '30 giây', instructions: 'Cảm nhận ngón chân, gan bàn chân. Duỗi nhẹ rồi thả ra. Cảm giác bàn chân nặng và ấm.', tension: 'Điểm kết thúc scan — khi đây thả lỏng, toàn thân đã đi vào nghỉ ngơi' },
  { id: 'whole', icon: '✨', name: 'Toàn Thân', time: '1 phút', instructions: 'Cảm nhận toàn thân từ đầu đến chân cùng lúc. Nếu còn vùng nào căng, thở vào đó và thở ra.', tension: 'Kết thúc bài scan — cơ thể đã sẵn sàng ngủ hoặc phục hồi' },
];

function BodyScanTimer({ color }) {
  const [step, setStep] = useState(-1);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);
  const cntRef = useRef(0);

  const DURATIONS = [60, 60, 60, 60, 60, 60, 30, 60]; // seconds per zone

  const start = () => {
    setStep(0);
    cntRef.current = DURATIONS[0];
    setCount(DURATIONS[0]);
    setRunning(true);
    iRef.current = setInterval(() => {
      cntRef.current--;
      setCount(cntRef.current);
      if (cntRef.current <= 0) {
        setStep(prev => {
          const next = prev + 1;
          if (next >= BODY_ZONES.length) { clearInterval(iRef.current); setRunning(false); return -2; }
          cntRef.current = DURATIONS[next];
          setCount(DURATIONS[next]);
          return next;
        });
      }
    }, 1000);
  };
  const stop = () => { clearInterval(iRef.current); setRunning(false); setStep(-1); setCount(0); };
  useEffect(() => () => clearInterval(iRef.current), []);

  const zone = step >= 0 ? BODY_ZONES[step] : null;
  const progress = zone ? ((DURATIONS[step] - count) / DURATIONS[step]) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-bg p-5 space-y-4">
      <div className="text-xs font-bold uppercase tracking-widest text-muted text-center">Body Scan Guided Timer · ~8 phút</div>
      {step === -2 ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🌟</div>
          <div className="text-sm font-bold" style={{ color }}>Hoàn thành! Ngủ ngon nhé.</div>
          <button onClick={() => setStep(-1)} className="mt-3 text-xs text-muted hover:text-text transition-colors">Làm lại</button>
        </div>
      ) : zone ? (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{zone.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-text">{zone.name}</div>
              <div className="text-xs text-muted">{zone.time}</div>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{count}s</div>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: color }} />
          </div>
          <p className="text-xs text-muted leading-relaxed italic">{zone.instructions}</p>
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>Vùng {step + 1}/{BODY_ZONES.length}</span>
            <button onClick={stop} className="text-red-400 hover:text-red-300 transition-colors">Dừng</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-muted mb-4">Nằm thoải mái, nhắm mắt. Bài scan sẽ hướng dẫn từng vùng cơ thể.</p>
          <button onClick={start} className="px-6 py-2.5 rounded-full text-sm font-bold" style={{ background: `rgba(${RGB},0.15)`, color, border: `1px solid rgba(${RGB},0.3)` }}>
            Bắt đầu Body Scan
          </button>
        </div>
      )}
    </div>
  );
}

export default function MindBodyScanPage() {
  const [activeZone, setActiveZone] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-xs text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🔍</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Body Scan</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D3b · Phục Hồi Sâu</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Body scan là bài thiền quét toàn thân — từng vùng từ đầu đến chân. Công cụ tốt nhất cho người khó ngủ, căng cơ sau tập, hoặc giữ stress trong người mà không biết.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format&fit=crop" alt="Body Scan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>8 vùng cơ thể · ~8 phút · Guided timer</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Guided timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Body Scan Có Hướng Dẫn</h2>
        <p className="text-muted text-sm mb-6">Nằm thoải mái, bắt đầu — timer sẽ dẫn qua từng vùng.</p>
        <BodyScanTimer color={COLOR} />
      </RevealBlock>

      {/* Zone guide */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>8 Vùng Cơ Thể</h2>
        <p className="text-muted text-sm mb-6">Nhấn vào từng vùng để xem hướng dẫn chi tiết.</p>
        <div className="space-y-2">
          {BODY_ZONES.map((z, i) => (
            <div key={z.id} className="rounded-xl border border-border overflow-hidden">
              <button onClick={() => setActiveZone(activeZone === i ? null : i)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left">
                <span className="text-xl">{z.icon}</span>
                <span className="flex-1 text-sm font-medium text-text">{z.name}</span>
                <span className="text-xs text-muted mr-2">{z.time}</span>
                <span className="text-muted text-xs">{activeZone === i ? '▲' : '▼'}</span>
              </button>
              {activeZone === i && (
                <div className="px-4 pb-4 space-y-2">
                  <p className="text-sm text-text leading-relaxed border-t border-border pt-3">{z.instructions}</p>
                  <div className="text-xs text-muted italic">💡 {z.tension}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* When to use */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Khi Nào Dùng Body Scan</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: '🌙', title: 'Trước khi ngủ', desc: 'Thay thế lướt điện thoại. Hiệu quả nhất để đi vào giấc ngủ sâu.' },
            { icon: '💪', title: 'Sau buổi tập nặng', desc: 'Kết hợp với cool-down. Giúp phục hồi cơ và hệ thần kinh.' },
            { icon: '😤', title: 'Khi stress tích lũy', desc: 'Nhận ra vùng cơ thể nào đang "giữ" stress — vai, hàm, bụng.' },
            { icon: '🎯', title: 'Trước thiền ngồi', desc: 'Dọn dẹp cơ thể trước — body scan → thiền ngồi hiệu quả hơn.' },
          ].map(u => (
            <div key={u.title} className="rounded-xl border border-border bg-surface p-4 hover:border-pink-500/20 transition-colors">
              <div className="text-2xl mb-2">{u.icon}</div>
              <div className="text-sm font-bold text-text mb-1">{u.title}</div>
              <div className="text-xs text-muted leading-relaxed">{u.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/meditation" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Thiền Ngắn
        </Link>
        <Link to="/pillar/d" className="text-sm text-muted hover:text-purple-400 transition-colors text-center">Tâm Trí An Nhiên →</Link>
        <Link to="/pillar/d/journaling" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group justify-end">
          Journaling 5 Dòng
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
