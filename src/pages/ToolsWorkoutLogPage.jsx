import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#22c55e';
const RGB = '34,197,94';
const ORBIT_ID = 'f-wl-orbit-kf';
const ORBIT_CLASS = 'f-wl-orbit-ring';
const LS_KEY = 'healthapp_f_workout';

const EXERCISE_TEMPLATES = [
  { name: 'Squat', muscles: 'Đùi, mông', type: 'Sức mạnh' },
  { name: 'Push-up', muscles: 'Ngực, vai, tam đầu', type: 'Sức mạnh' },
  { name: 'Romanian Deadlift', muscles: 'Đùi sau, mông, lưng', type: 'Sức mạnh' },
  { name: 'Dumbbell Row', muscles: 'Lưng trên, nhị đầu', type: 'Sức mạnh' },
  { name: 'Plank', muscles: 'Core', type: 'Ổn định' },
  { name: 'Glute Bridge', muscles: 'Mông, đùi sau', type: 'Sức mạnh' },
  { name: 'Đi bộ', muscles: 'Cardio toàn thân', type: 'Cardio' },
  { name: 'Chạy bộ', muscles: 'Cardio toàn thân', type: 'Cardio' },
];

const RPE_LABELS = ['', 'Rất nhẹ', 'Nhẹ', 'Vừa nhẹ', 'Vừa', 'Vừa nặng', 'Nặng', 'Rất nặng', 'Gần tối đa', 'Tối đa', 'Siêu tối đa'];
const RPE_COLORS = ['', '#14b8a6', '#22c55e', '#22c55e', '#84cc16', '#f59e0b', '#f59e0b', '#ef4444', '#ef4444', '#ef4444', '#7c3aed'];

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

export default function ToolsWorkoutLogPage() {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), exercise: '', sets: '', reps: '', weight: '', duration: '', rpe: 7, note: '' });
  const [showTemplate, setShowTemplate] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-wl-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fWlOrbitSpin { to { --f-wl-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-wl-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fWlOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const saveLog = () => {
    if (!form.exercise) return;
    const entry = { ...form, id: Date.now() };
    const next = [entry, ...logs].slice(0, 30);
    setLogs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setForm({ date: new Date().toISOString().slice(0, 10), exercise: '', sets: '', reps: '', weight: '', duration: '', rpe: 7, note: '' });
  };

  const deleteLog = (id) => {
    const next = logs.filter(l => l.id !== id);
    setLogs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const applyTemplate = (tmpl) => {
    setForm(f => ({ ...f, exercise: tmpl.name }));
    setShowTemplate(false);
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🏋️</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Nhật Ký Tập Luyện</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            RPE · Tăng tiến · 30 ngày lịch sử
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Ghi lại bài tập, số set/reps, cân nặng và cảm giác gắng sức (RPE). Xem lại để biết nên tăng tiến thế nào tuần sau.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop" alt="Workout log" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            ghi chép rõ ràng → tiến bộ có hệ thống
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Log form */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: COLOR }}>Ghi Buổi Tập Mới</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Ngày</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent text-sm text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Bài tập</label>
              <div className="flex gap-2">
                <input type="text" value={form.exercise} onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))}
                  placeholder="Tên bài tập" className="flex-1 px-3 py-2 rounded-xl border bg-transparent text-sm text-text placeholder-muted focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }} />
                <button onClick={() => setShowTemplate(o => !o)} className="px-3 py-2 rounded-xl text-xs font-bold border" style={{ color: COLOR, borderColor: `rgba(${RGB},0.3)` }}>
                  Template
                </button>
              </div>
            </div>
          </div>

          {showTemplate && (
            <div className="rounded-xl border p-3 grid grid-cols-2 gap-2" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
              {EXERCISE_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => applyTemplate(t)}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="text-sm font-medium text-text">{t.name}</div>
                  <div className="text-xs text-muted">{t.muscles}</div>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[['Sets', 'sets', 'số set'], ['Reps', 'reps', 'số lần'], ['Cân nặng (kg)', 'weight', '0 = bodyweight']].map(([lbl, key, ph]) => (
              <div key={key}>
                <label className="text-xs text-muted block mb-1">{lbl}</label>
                <input type="number" min="0" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={ph} className="w-full px-3 py-2 rounded-xl border bg-transparent text-sm text-text placeholder-muted focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Thời gian (phút)</label>
              <input type="number" min="0" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="tổng thời gian buổi tập" className="w-full px-3 py-2 rounded-xl border bg-transparent text-sm text-text placeholder-muted focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">RPE: {form.rpe}/10 — {RPE_LABELS[form.rpe]}</label>
              <input type="range" min="1" max="10" value={form.rpe} onChange={e => setForm(f => ({ ...f, rpe: +e.target.value }))}
                className="w-full" style={{ accentColor: RPE_COLORS[form.rpe] }} />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Ghi chú (tuần sau tăng tiến thế nào?)</label>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={2} placeholder="vd: tăng 2.5kg hoặc thêm 1 set" className="w-full px-3 py-2 rounded-xl border bg-transparent text-sm text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>

          <button onClick={saveLog} className="w-full py-3 rounded-xl font-bold text-sm text-white" style={{ background: COLOR }}>
            💾 Lưu buổi tập
          </button>
        </div>
      </RevealBlock>

      {/* Log history */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: COLOR }}>Lịch Sử Tập ({logs.length} buổi)</h2>
        {logs.length === 0 ? (
          <div className="text-center text-muted text-sm py-8">Chưa có buổi tập nào. Hãy ghi buổi đầu tiên!</div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text">{log.exercise}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ color: RPE_COLORS[log.rpe], background: `${RPE_COLORS[log.rpe]}15` }}>
                        RPE {log.rpe}
                      </span>
                    </div>
                    <div className="text-xs text-muted flex flex-wrap gap-3">
                      <span>📅 {log.date}</span>
                      {log.sets && <span>Sets: {log.sets}</span>}
                      {log.reps && <span>Reps: {log.reps}</span>}
                      {log.weight && <span>Cân: {log.weight}kg</span>}
                      {log.duration && <span>⏱ {log.duration} phút</span>}
                    </div>
                    {log.note && <div className="text-xs text-muted mt-1 italic">→ {log.note}</div>}
                  </div>
                  <button onClick={() => deleteLog(log.id)} className="text-xs text-muted hover:text-red-400 transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* RPE guide */}
      <RevealBlock delay={2} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>📊 Thang RPE (Rate of Perceived Exertion)</h3>
          <div className="grid grid-cols-2 gap-2">
            {[1,3,5,6,7,8,9,10].map(r => (
              <div key={r} className="flex items-center gap-2 text-xs">
                <span className="font-bold w-4" style={{ color: RPE_COLORS[r] }}>{r}</span>
                <span className="text-muted">{RPE_LABELS[r]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3">Mục tiêu thông thường: RPE 6–8 cho tập sức mạnh, RPE 4–6 cho cardio.</p>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
