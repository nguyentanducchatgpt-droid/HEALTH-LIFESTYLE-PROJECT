import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'f-hs-orbit-kf';
const ORBIT_CLASS = 'f-hs-orbit-ring';
const LS_KEY = 'healthapp_f_score_today';
const LS_HIST = 'healthapp_f_score_hist';

const SCORE_ITEMS = [
  { key: 'workout', label: 'Vận động/tập luyện', max: 25, icon: '🏋️', desc: '25đ: tập ≥30ph sức mạnh · 15đ: tập 10–29ph · 5đ: vận động nhẹ' },
  { key: 'neat', label: 'Đi bộ/NEAT', max: 15, icon: '🚶', desc: '15đ: ≥8,000 bước · 10đ: 5,000–7,999 · 5đ: 3,000–4,999' },
  { key: 'nutrition', label: 'Dinh dưỡng cơ bản', max: 20, icon: '🍽️', desc: '20đ: đủ đạm + rau + không snack tệ · 12đ: 2/3 tiêu chí · 5đ: 1/3' },
  { key: 'water', label: 'Uống nước', max: 10, icon: '💧', desc: '10đ: ≥ nhu cầu cá nhân · 5đ: uống bình thường · 0đ: ít hơn nhiều' },
  { key: 'sleep', label: 'Ngủ/phục hồi', max: 15, icon: '😴', desc: '15đ: ngủ ≥7h, chất lượng tốt · 8đ: 6–7h · 3đ: < 6h' },
  { key: 'mind', label: 'Tâm trí/calm practice', max: 10, icon: '🧘', desc: '10đ: thực hành calm ≥5ph · 5đ: ý thức được stress · 0đ: không chú ý' },
  { key: 'journal', label: 'Ghi nhật ký', max: 5, icon: '📝', desc: '5đ: ghi nhật ký ngày hôm nay · 0đ: không' },
];

const SCORE_LEVELS = [
  { min: 90, label: 'Xuất sắc', color: '#22c55e', msg: 'Bạn đang vận hành ở mức tối ưu. Duy trì nhất quán.' },
  { min: 75, label: 'Tốt', color: '#84cc16', msg: 'Tốt. Tinh chỉnh 1–2 điểm yếu để lên xuất sắc.' },
  { min: 55, label: 'Ổn định', color: '#f59e0b', msg: 'Nền tảng tốt. Chọn 1 điểm yếu để cải thiện tuần này.' },
  { min: 35, label: 'Cần cải thiện', color: '#ef4444', msg: 'Hãy tập trung vào 2 trụ cột cơ bản nhất: vận động + ngủ.' },
  { min: 0, label: 'Bắt đầu lại', color: '#7c3aed', msg: 'Hôm nay là ngày mới. Chỉ cần tick 1 mục nhỏ là đủ để bắt đầu.' },
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

export default function ToolsHealthScorePage() {
  const today = new Date().toISOString().slice(0, 10);
  const [scores, setScores] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || {}; } catch { return {}; }
  });
  const [hist, setHist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
  });
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-hs-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fHsOrbitSpin { to { --f-hs-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-hs-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fHsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const setScore = (key, val) => {
    const next = { ...scores, [key]: Math.min(+val, SCORE_ITEMS.find(i => i.key === key).max) };
    setScores(next);
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const total = SCORE_ITEMS.reduce((s, i) => s + (scores[i.key] || 0), 0);
  const maxTotal = SCORE_ITEMS.reduce((s, i) => s + i.max, 0);
  const pct = Math.round((total / maxTotal) * 100);
  const level = SCORE_LEVELS.find(l => total >= l.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];

  const saveToHistory = () => {
    const entry = { date: today, total, pct, scores: { ...scores } };
    const next = [entry, ...hist.filter(h => h.date !== today)].slice(0, 30);
    setHist(next);
    localStorage.setItem(LS_HIST, JSON.stringify(next));
  };

  const last7hist = hist.slice(0, 7);
  const avg7 = last7hist.length ? Math.round(last7hist.reduce((s, h) => s + h.pct, 0) / last7hist.length) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💯</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Daily Health Score</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            100 điểm · 7 nhóm hành vi · Xu hướng 7 ngày
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Chấm điểm sức khỏe toàn diện mỗi ngày theo 7 nhóm hành vi. Không phải để phán xét — mà để biết tuần này đang đi đúng hướng không.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop" alt="Health score" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            đo lường để cải thiện · không để tự trách
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Score display */}
      <RevealBlock delay={0} className="mb-8">
        <div className="rounded-2xl border p-6 text-center" style={{ borderColor: `${level.color}30`, background: `${level.color}08` }}>
          <div className="text-7xl font-black mb-2" style={{ color: level.color }}>{total}</div>
          <div className="text-xl font-bold mb-1" style={{ color: level.color }}>{level.label}</div>
          <div className="text-base text-muted mb-4">{level.msg}</div>
          <div className="h-3 rounded-full bg-border overflow-hidden mx-auto max-w-sm">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: level.color }} />
          </div>
          <div className="text-sm text-muted mt-2">{total}/{maxTotal} điểm · {pct}%</div>
        </div>
      </RevealBlock>

      {/* Score inputs */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Chấm Điểm Hôm Nay</h2>
        <div className="space-y-3">
          {SCORE_ITEMS.map((item, i) => (
            <div key={item.key} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenItem(openItem === i ? null : i)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-base font-medium text-text">{item.label}</div>
                  <div className="text-sm text-muted">{scores[item.key] || 0}/{item.max} điểm</div>
                </div>
                <div className="w-24 h-2 rounded-full bg-border overflow-hidden mr-2">
                  <div className="h-full rounded-full" style={{ width: `${((scores[item.key] || 0) / item.max) * 100}%`, background: COLOR }} />
                </div>
                <span className="text-muted text-base">{openItem === i ? '▲' : '▼'}</span>
              </button>
              {openItem === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <p className="text-sm text-muted mb-3">{item.desc}</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max={item.max} value={scores[item.key] || 0}
                      onChange={e => setScore(item.key, e.target.value)}
                      className="flex-1" style={{ accentColor: COLOR }} />
                    <span className="text-base font-bold w-16 text-right" style={{ color: COLOR }}>{scores[item.key] || 0}/{item.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={saveToHistory} className="w-full mt-4 py-3 rounded-xl font-bold text-base text-white" style={{ background: COLOR }}>
          💾 Lưu điểm hôm nay vào lịch sử
        </button>
      </RevealBlock>

      {/* History */}
      {last7hist.length > 0 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lịch Sử Điểm</h2>
          {avg7 && <p className="text-muted text-base mb-4">Điểm trung bình 7 ngày: <strong style={{ color: COLOR }}>{avg7}%</strong></p>}
          <div className="space-y-2">
            {last7hist.map(h => {
              const lv = SCORE_LEVELS.find(l => h.total >= l.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
              return (
                <div key={h.date} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <span className="text-sm text-muted w-16">{h.date.slice(5)}</span>
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.pct}%`, background: lv.color }} />
                  </div>
                  <span className="text-base font-bold w-16 text-right" style={{ color: lv.color }}>{h.total}đ</span>
                  <span className="text-sm text-muted">{lv.label}</span>
                </div>
              );
            })}
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
