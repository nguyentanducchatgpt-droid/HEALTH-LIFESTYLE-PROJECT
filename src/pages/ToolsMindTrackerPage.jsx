import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'f-mt-orbit-kf';
const ORBIT_CLASS = 'f-mt-orbit-ring';
const LS_KEY = 'healthapp_f_mind';

const MOODS = [
  { icon: '😤', label: 'Căng thẳng', val: 'stressed', color: '#ef4444' },
  { icon: '😞', label: 'Mệt mỏi', val: 'tired', color: '#f59e0b' },
  { icon: '😐', label: 'Bình thường', val: 'neutral', color: '#6366f1' },
  { icon: '😊', label: 'Vui vẻ', val: 'happy', color: '#22c55e' },
  { icon: '🤩', label: 'Tuyệt vời', val: 'great', color: '#14b8a6' },
];

const CALM_OPTIONS = [
  { label: 'Thở sâu / Box breathing', icon: '🌬️' },
  { label: 'Thiền 5–10 phút', icon: '🧘' },
  { label: 'Đi bộ chậm / mindful walk', icon: '🚶' },
  { label: 'Viết nhật ký', icon: '📝' },
  { label: 'Không dùng điện thoại 30 phút', icon: '📵' },
  { label: 'Nghỉ ngơi không làm gì', icon: '😌' },
];

const JOURNAL_QS = [
  'Điều gì làm bạn căng thẳng nhất hôm nay?',
  'Điều gì bạn biết ơn hôm nay?',
  'Ngày mai bạn muốn cảm thấy thế nào?',
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

export default function ToolsMindTrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || { stress: 5, mood: '', calm: [], journal: {} }; } catch { return { stress: 5, mood: '', calm: [], journal: {} }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMtOrbitSpin { to { --f-mt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMtOrbitSpin 3.5s linear infinite;
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

  const toggleCalm = (val) => {
    const next = data.calm.includes(val) ? data.calm.filter(c => c !== val) : [...data.calm, val];
    update('calm', next);
  };

  const updateJournal = (qi, val) => {
    update('journal', { ...data.journal, [qi]: val });
  };

  const stressColor = data.stress <= 3 ? '#22c55e' : data.stress <= 6 ? '#f59e0b' : '#ef4444';
  const stressLabel = data.stress <= 3 ? 'Thấp — tốt' : data.stress <= 6 ? 'Vừa — chú ý' : 'Cao — cần giảm tải';

  const last7 = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🧘</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Mind &amp; Calm Tracker</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Stress · Mood · Calm practice · Journaling
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Theo dõi stress, tâm trạng và thực hành calm mỗi ngày. Nhận ra dấu hiệu cần giảm tải trước khi kiệt sức — không cần chờ đến khi vỡ vụn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop" alt="Mind tracker" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            nhận ra → điều chỉnh → bền vững
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Today */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: COLOR }}>Ghi Tâm Trí Hôm Nay</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-6">

          {/* Stress slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-text">🌡️ Mức stress hôm nay</label>
              <span className="text-sm font-bold" style={{ color: stressColor }}>{data.stress}/10 — {stressLabel}</span>
            </div>
            <input type="range" min="1" max="10" value={data.stress} onChange={e => update('stress', +e.target.value)}
              className="w-full" style={{ accentColor: stressColor }} />
            <div className="flex justify-between text-xs text-muted mt-1"><span>1 Bình thản</span><span>5 Vừa</span><span>10 Quá tải</span></div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-text block mb-3">🎭 Tâm trạng chủ đạo hôm nay</label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button key={m.val} onClick={() => update('mood', m.val)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all text-xs"
                  style={{ borderColor: data.mood === m.val ? m.color : 'rgba(255,255,255,0.08)', background: data.mood === m.val ? `${m.color}20` : 'transparent' }}>
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-muted">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calm practice */}
          <div>
            <label className="text-sm font-medium text-text block mb-3">🌿 Thực hành calm hôm nay (chọn tất cả đã làm)</label>
            <div className="grid grid-cols-2 gap-2">
              {CALM_OPTIONS.map((c, i) => (
                <button key={i} onClick={() => toggleCalm(i)}
                  className="flex items-center gap-2 p-3 rounded-xl border text-left transition-all text-xs"
                  style={{ borderColor: data.calm.includes(i) ? `rgba(${RGB},0.5)` : 'rgba(255,255,255,0.08)', background: data.calm.includes(i) ? `rgba(${RGB},0.1)` : 'transparent' }}>
                  <span className="text-base">{c.icon}</span>
                  <span className={data.calm.includes(i) ? 'text-text' : 'text-muted'}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Journaling */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Nhật Ký 3 Câu</h2>
        <p className="text-muted text-sm mb-6">3 câu hỏi đơn giản, 3–5 phút, giúp bạn xử lý cảm xúc và đặt ý định cho ngày mai.</p>
        <div className="space-y-4">
          {JOURNAL_QS.map((q, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <label className="text-sm font-medium text-text block mb-2">{i + 1}. {q}</label>
              <textarea value={data.journal[i] ?? ''} onChange={e => updateJournal(i, e.target.value)}
                rows={2} placeholder="Nhập suy nghĩ của bạn..." className="w-full px-3 py-2 rounded-xl border bg-transparent text-sm text-text placeholder-muted resize-none focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day trend */}
      {last7.length > 1 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>Xu Hướng 7 Ngày</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Ngày</th>
                  <th className="text-center py-2 font-medium">Stress</th>
                  <th className="text-center py-2 font-medium">Mood</th>
                  <th className="text-center py-2 font-medium">Calm</th>
                </tr>
              </thead>
              <tbody>
                {last7.map(([date, d]) => {
                  const moodObj = MOODS.find(m => m.val === d.mood);
                  const sc = (d.stress || 0) <= 3 ? '#22c55e' : (d.stress || 0) <= 6 ? '#f59e0b' : '#ef4444';
                  return (
                    <tr key={date} className="border-b border-border/50">
                      <td className="py-2 text-muted">{date.slice(5)}</td>
                      <td className="py-2 text-center"><span style={{ color: sc }}>{d.stress || '–'}/10</span></td>
                      <td className="py-2 text-center">{moodObj ? moodObj.icon : '–'}</td>
                      <td className="py-2 text-center text-muted">{(d.calm || []).length} mục</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      {/* Tips */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>💡 Dấu Hiệu Cần Giảm Tải</h3>
          <ul className="space-y-2 text-sm text-muted">
            {['Stress ≥ 7 trong 3 ngày liên tiếp', 'Mệt mỏi/căng thẳng là mood chủ đạo cả tuần', 'Không thực hành calm nào trong 3 ngày', 'Không ngủ được dù mệt', 'Không muốn nói chuyện với ai'].map((tip, i) => (
              <li key={i} className="flex gap-2"><span style={{ color: COLOR }}>⚠</span>{tip}</li>
            ))}
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
