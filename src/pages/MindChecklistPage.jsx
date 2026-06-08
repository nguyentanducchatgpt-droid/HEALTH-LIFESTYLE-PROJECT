import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f59e0b';
const RGB = '245,158,11';
const ORBIT_ID = 'd-checklist-orbit-kf';
const ORBIT_CLASS = 'd-checklist-orbit-ring';
const PROP = '--d-checklist-orbit-angle';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

const DAILY = [
  { id: 'd1', cat: 'Thể Chất', icon: '💪', item: 'Vận động ít nhất 20 phút' },
  { id: 'd2', cat: 'Thể Chất', icon: '💧', item: 'Uống đủ 2L nước' },
  { id: 'd3', cat: 'Thể Chất', icon: '🥗', item: 'Ăn ít nhất 1 phần rau trong ngày' },
  { id: 'd4', cat: 'Tâm Trí', icon: '🧘', item: 'Thở sâu hoặc thiền ít nhất 5 phút' },
  { id: 'd5', cat: 'Tâm Trí', icon: '📓', item: 'Ghi nhật ký hoặc 3 điều biết ơn' },
  { id: 'd6', cat: 'Tâm Trí', icon: '📵', item: 'Không dùng điện thoại 30ph sau khi thức' },
  { id: 'd7', cat: 'Giấc Ngủ', icon: '🌙', item: 'Ngủ trước 11pm' },
  { id: 'd8', cat: 'Giấc Ngủ', icon: '📴', item: 'Tắt màn hình 1 tiếng trước khi ngủ' },
  { id: 'd9', cat: 'Kết Nối', icon: '👥', item: 'Nói chuyện thật sự với ít nhất 1 người' },
  { id: 'd10', cat: 'Phục Hồi', icon: '😴', item: 'Nghỉ ít nhất 5 phút không làm gì' },
];

const WEEKLY = [
  { id: 'w1', cat: 'Vận Động', icon: '🏃', item: 'Cardio 2–3 buổi trong tuần' },
  { id: 'w2', cat: 'Vận Động', icon: '🏋️', item: 'Sức mạnh 2–3 buổi trong tuần' },
  { id: 'w3', cat: 'Dinh Dưỡng', icon: '🍳', item: 'Meal prep ít nhất 1 lần' },
  { id: 'w4', cat: 'Dinh Dưỡng', icon: '📊', item: 'Đánh giá lại thực đơn tuần qua' },
  { id: 'w5', cat: 'Tâm Trí', icon: '🧠', item: 'Đọc hoặc học điều gì mới (30ph+)' },
  { id: 'w6', cat: 'Tâm Trí', icon: '🌿', item: 'Detox kỹ thuật số ít nhất 1 ngày' },
  { id: 'w7', cat: 'Kết Nối', icon: '❤️', item: 'Dành thời gian chất lượng với gia đình/bạn bè' },
  { id: 'w8', cat: 'Phục Hồi', icon: '🛁', item: 'Có ít nhất 1 hoạt động thư giãn sâu' },
  { id: 'w9', cat: 'Nhìn Lại', icon: '📝', item: 'Weekly review: 3 điều tốt, 1 điều cần cải thiện' },
];

const CATS_COLOR = {
  'Thể Chất': '#10b981',
  'Tâm Trí': '#a855f7',
  'Giấc Ngủ': '#0ea5e9',
  'Kết Nối': '#ec4899',
  'Phục Hồi': '#f59e0b',
  'Vận Động': '#10b981',
  'Dinh Dưỡng': '#84cc16',
  'Nhìn Lại': '#6366f1',
};

function Checklist({ items, storageKey }) {
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  });
  const toggle = id => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };
  const done = items.filter(it => checks[it.id]).length;
  const pct = Math.round(done / items.length * 100);

  const grouped = [...new Set(items.map(it => it.cat))].map(cat => ({
    cat,
    items: items.filter(it => it.cat === cat),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black" style={{ color: pct >= 80 ? '#10b981' : pct >= 50 ? COLOR : '#6b7280' }}>{done}/{items.length}</div>
          <div className="text-base text-muted">hoàn thành ({pct}%)</div>
        </div>
        <button onClick={() => { setChecks({}); localStorage.removeItem(storageKey); }} className="text-sm text-muted hover:text-text underline">Reset</button>
      </div>
      <div className="w-full h-2 rounded-full bg-surface border border-border mb-6 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 80 ? '#10b981' : pct >= 50 ? COLOR : '#6b7280' }} />
      </div>
      <div className="space-y-5">
        {grouped.map(g => (
          <div key={g.cat}>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: CATS_COLOR[g.cat] || '#888' }}>{g.cat}</p>
            <div className="space-y-2">
              {g.items.map(it => (
                <button key={it.id} onClick={() => toggle(it.id)}
                  className="w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
                  style={{ borderColor: checks[it.id] ? (CATS_COLOR[it.cat] || COLOR) : '#2a2a2a', background: checks[it.id] ? `${CATS_COLOR[it.cat] || COLOR}0d` : 'transparent' }}>
                  <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: checks[it.id] ? (CATS_COLOR[it.cat] || COLOR) : '#555', background: checks[it.id] ? (CATS_COLOR[it.cat] || COLOR) : 'transparent' }}>
                    {checks[it.id] && <span className="text-white text-sm font-bold">✓</span>}
                  </div>
                  <span className="text-lg shrink-0">{it.icon}</span>
                  <span className={`text-base ${checks[it.id] ? 'text-muted line-through' : 'text-text'}`}>{it.item}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MindChecklistPage() {
  const [tab, setTab] = useState('daily');

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dChecklistOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dChecklistOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Checklist Tâm Trí Hằng Ngày</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D7 · Theo Dõi Tiến Trình</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Checklist đơn giản để theo dõi những thói quen tâm trí và sức khỏe quan trọng nhất mỗi ngày và mỗi tuần. Lưu tự động trên thiết bị.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Checklist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>10 mục · Ngày / 9 mục · Tuần</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <div className="flex gap-2 mb-6">
          {[{ k: 'daily', l: '📅 Hằng Ngày' }, { k: 'weekly', l: '📆 Hằng Tuần' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className="px-5 py-2.5 rounded-full text-base font-semibold border transition-all"
              style={tab === t.k
                ? { background: COLOR, color: '#0a0a0a', borderColor: COLOR }
                : { background: 'transparent', color: '#888', borderColor: '#333' }}>
              {t.l}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
          {tab === 'daily' ? (
            <Checklist items={DAILY} storageKey="mind_checklist_daily" />
          ) : (
            <Checklist items={WEEKLY} storageKey="mind_checklist_weekly" />
          )}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Hướng Dẫn Sử Dụng</h2>
        <p className="text-muted text-base mb-6">Để checklist này thực sự hiệu quả</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '🌅', t: 'Sáng mở ra nhìn', d: 'Xem danh sách ngay khi bắt đầu ngày — đặt ý định cho ngày hôm nay' },
            { icon: '🌙', t: 'Tối tick hoàn thành', d: 'Trước khi ngủ, tick lại những gì đã làm — 1 phút thôi' },
            { icon: '📊', t: 'Không cần 100%', d: '70–80% là tuyệt vời. Hôm nào tệ hơn không sao — nhìn xu hướng dài hạn' },
            { icon: '🔄', t: 'Reset mỗi ngày', d: 'Nhấn Reset mỗi sáng để bắt đầu mới — không mang gánh nặng hôm qua' },
          ].map(c => (
            <div key={c.t} className="flex gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <div className="font-semibold text-text text-base mb-1">{c.t}</div>
                <p className="text-sm text-muted">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
