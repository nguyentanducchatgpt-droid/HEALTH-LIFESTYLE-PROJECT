import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'f-lt-orbit-kf';
const ORBIT_CLASS = 'f-lt-orbit-ring';
const LS_KEY = 'healthapp_f_lifestyle';

const SLEEP_QUALITY = [
  { label: 'Rất tệ', icon: '😫', val: 1 },
  { label: 'Tệ', icon: '😞', val: 2 },
  { label: 'Tạm được', icon: '😐', val: 3 },
  { label: 'Tốt', icon: '😊', val: 4 },
  { label: 'Rất tốt', icon: '😄', val: 5 },
];

const STEPS_RANGES = [
  { label: '< 3,000', color: '#ef4444', note: 'Ngồi nhiều — cần tăng' },
  { label: '3,000–5,000', color: '#f59e0b', note: 'Dưới mức khuyến nghị' },
  { label: '5,000–7,500', color: '#84cc16', note: 'Đủ tối thiểu' },
  { label: '7,500–10,000', color: '#22c55e', note: 'Tốt' },
  { label: '> 10,000', color: '#14b8a6', note: 'Xuất sắc' },
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

export default function ToolsLifestyleTrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || { sleep: 7, sleepQ: 3, steps: '', energy: 5, bedtime: '', waketime: '', notes: '' }; } catch { return { sleep: 7, sleepQ: 3, steps: '', energy: 5, bedtime: '', waketime: '', notes: '' }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-lt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fLtOrbitSpin { to { --f-lt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-lt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fLtOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const update = (key, val) => {
    const next = { ...data, [key]: val };
    setData(next);
    const all = { ...history, [today]: next };
    setHistory(all);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const last7 = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
  const avgSleep = last7.length ? (last7.reduce((s, [, v]) => s + (v.sleep || 0), 0) / last7.length).toFixed(1) : null;
  const avgEnergy = last7.length ? (last7.reduce((s, [, v]) => s + (v.energy || 0), 0) / last7.length).toFixed(1) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💤</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Lifestyle Tracker</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Ngủ · Bước chân · Năng lượng · 7 ngày trend
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi giấc ngủ, số bước chân và mức năng lượng mỗi ngày. Sau 1 tuần bạn sẽ thấy pattern rõ ràng ảnh hưởng cảm giác của mình.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop" alt="Lifestyle tracker" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            ngủ tốt → năng lượng tốt → kết quả tốt
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* 7-day summary */}
      {last7.length > 1 && (
        <RevealBlock delay={0} className="mb-8">
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLOR }}>{avgSleep}</div>
              <div className="text-base text-muted">giờ ngủ TB/ngày</div>
              <div className="text-base mt-1" style={{ color: +avgSleep >= 7 ? '#22c55e' : '#f59e0b' }}>{+avgSleep >= 7 ? '✓ Đủ giấc' : '⚠ Cần ngủ thêm'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLOR }}>{avgEnergy}</div>
              <div className="text-base text-muted">năng lượng TB/10</div>
              <div className="text-base mt-1" style={{ color: +avgEnergy >= 6 ? '#22c55e' : '#f59e0b' }}>{+avgEnergy >= 6 ? '✓ Tốt' : '⚠ Cần cải thiện'}</div>
            </div>
          </div>
        </RevealBlock>
      )}

      {/* Today's log */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Ghi Hôm Nay</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-6">

          {/* Sleep hours */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-lg font-medium text-text">😴 Số giờ ngủ đêm qua</label>
              <span className="text-lg font-bold" style={{ color: COLOR }}>{data.sleep} giờ</span>
            </div>
            <input type="range" min="3" max="12" step="0.5" value={data.sleep} onChange={e => update('sleep', +e.target.value)}
              className="w-full" style={{ accentColor: COLOR }} />
            <div className="flex justify-between text-base text-muted mt-1"><span>3h</span><span>7h (mục tiêu)</span><span>12h</span></div>
          </div>

          {/* Sleep quality */}
          <div>
            <label className="text-lg font-medium text-text block mb-3">⭐ Chất lượng giấc ngủ</label>
            <div className="flex gap-2 flex-wrap">
              {SLEEP_QUALITY.map(q => (
                <button key={q.val} onClick={() => update('sleepQ', q.val)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all text-base"
                  style={{ borderColor: data.sleepQ === q.val ? COLOR : 'rgba(255,255,255,0.08)', background: data.sleepQ === q.val ? `rgba(${RGB},0.15)` : 'transparent' }}>
                  <span className="text-2xl">{q.icon}</span>
                  <span className="text-muted">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedtime / waketime */}
          <div className="grid grid-cols-2 gap-3">
            {[['🌙 Giờ ngủ', 'bedtime'], ['☀️ Giờ dậy', 'waketime']].map(([lbl, key]) => (
              <div key={key}>
                <label className="text-lg font-medium text-text block mb-2">{lbl}</label>
                <input type="time" value={data[key] ?? ''} onChange={e => update(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }} />
              </div>
            ))}
          </div>

          {/* Steps */}
          <div>
            <label className="text-lg font-medium text-text block mb-2">🚶 Bước chân hôm nay</label>
            <input type="number" min="0" value={data.steps ?? ''} onChange={e => update('steps', e.target.value)}
              placeholder="vd: 7500" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>

          {/* Energy */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-lg font-medium text-text">⚡ Mức năng lượng hôm nay</label>
              <span className="text-lg font-bold" style={{ color: COLOR }}>{data.energy}/10</span>
            </div>
            <input type="range" min="1" max="10" value={data.energy} onChange={e => update('energy', +e.target.value)}
              className="w-full" style={{ accentColor: COLOR }} />
          </div>

          {/* Notes */}
          <div>
            <label className="text-lg font-medium text-text block mb-2">📝 Ghi chú hôm nay</label>
            <textarea value={data.notes ?? ''} onChange={e => update('notes', e.target.value)}
              rows={2} placeholder="Điều gì ảnh hưởng đến giấc ngủ/năng lượng hôm nay?" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>
        </div>
      </RevealBlock>

      {/* Steps guide */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Hướng Dẫn Bước Chân</h2>
        <div className="space-y-2">
          {STEPS_RANGES.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
              <span className="text-lg font-medium text-text w-32">{r.label}</span>
              <span className="text-base text-muted">{r.note}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* History */}
      {last7.length > 0 && (
        <RevealBlock delay={3} className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>7 Ngày Gần Nhất</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-base text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Ngày</th>
                  <th className="text-center py-2 font-medium">Ngủ</th>
                  <th className="text-center py-2 font-medium">Bước chân</th>
                  <th className="text-center py-2 font-medium">Năng lượng</th>
                </tr>
              </thead>
              <tbody>
                {last7.map(([date, d]) => (
                  <tr key={date} className="border-b border-border/50">
                    <td className="py-2 text-muted">{date.slice(5)}</td>
                    <td className="py-2 text-center">
                      <span style={{ color: (d.sleep || 0) >= 7 ? '#22c55e' : '#f59e0b' }}>{d.sleep || '–'}h</span>
                    </td>
                    <td className="py-2 text-center text-muted">{d.steps || '–'}</td>
                    <td className="py-2 text-center">
                      <span style={{ color: (d.energy || 0) >= 6 ? COLOR : '#f59e0b' }}>{d.energy || '–'}/10</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
