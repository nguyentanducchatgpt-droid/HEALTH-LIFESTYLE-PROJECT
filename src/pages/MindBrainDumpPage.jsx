import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'd-braindump-orbit-kf';
const ORBIT_CLASS = 'd-braindump-orbit-ring';
const PROP = '--d-braindump-orbit-angle';

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

const STEPS = [
  { n: '01', t: 'Cài đồng hồ 10 phút', d: 'Không cần hơn. Giới hạn thời gian giúp não tập trung xả hết.' },
  { n: '02', t: 'Lấy tờ giấy hoặc mở file text', d: 'Viết tay tốt hơn. Không cần máy tính đẹp, không cần note app.' },
  { n: '03', t: 'Viết MỌI THỨ đang trong đầu', d: 'Việc cần làm, lo âu, ý tưởng, hối tiếc, kế hoạch — tất cả ra hết.' },
  { n: '04', t: 'Không phán xét, không chỉnh sửa', d: 'Cứ viết. Câu không hoàn chỉnh cũng được. Chính tả sai cũng không sao.' },
  { n: '05', t: 'Phân loại sau khi xả xong', d: 'Nhìn lại danh sách: cái nào có thể làm ngay? Cái nào lo vô ích? Cái nào cần plan?' },
  { n: '06', t: 'Chọn 1–3 việc ưu tiên hôm nay', d: 'Chỉ 1–3 thôi. Gạch bỏ hoặc chuyển sang "ngày mai / không bao giờ".' },
];

const CATEGORIES = [
  { icon: '✅', label: 'Có thể làm ngay', color: '#10b981', desc: 'Dưới 5 phút — làm luôn' },
  { icon: '📅', label: 'Cần lên lịch', color: '#a855f7', desc: 'Quan trọng nhưng không khẩn' },
  { icon: '🗑️', label: 'Lo vô ích', color: '#6b7280', desc: 'Không kiểm soát được — buông bỏ' },
  { icon: '💡', label: 'Ý tưởng hay', color: '#f59e0b', desc: 'Lưu lại nhưng chưa cần làm ngay' },
];

function BrainDumpTool() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [sorted, setSorted] = useState({});
  const [phase, setPhase] = useState('dump'); // dump | sort

  const handleDump = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    setItems(lines.map((l, i) => ({ id: i, text: l, cat: null })));
    setPhase('sort');
  };

  const assignCat = (id, cat) => {
    setItems(p => p.map(it => it.id === id ? { ...it, cat } : it));
  };

  const grouped = CATEGORIES.map(c => ({ ...c, items: items.filter(it => it.cat === c.label) }));
  const unassigned = items.filter(it => !it.cat);

  if (phase === 'sort') return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-text">Phân Loại {items.length} Mục</span>
        <button onClick={() => { setPhase('dump'); setText(''); setItems([]); }} className="text-xs text-muted hover:text-text underline">Làm lại</button>
      </div>
      {unassigned.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-3">Chưa phân loại ({unassigned.length}):</p>
          <div className="space-y-2">
            {unassigned.map(it => (
              <div key={it.id} className="rounded-xl border border-border p-3">
                <p className="text-sm text-text mb-2">{it.text}</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.label} onClick={() => assignCat(it.id, c.label)}
                      className="text-xs px-3 py-1 rounded-full border transition-all hover:opacity-80"
                      style={{ borderColor: c.color, color: c.color }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unassigned.length === 0 && (
        <div className="space-y-4">
          {grouped.filter(g => g.items.length > 0).map(g => (
            <div key={g.label}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: g.color }}>{g.icon} {g.label}</p>
              <ul className="space-y-1">
                {g.items.map(it => (
                  <li key={it.id} className="text-sm text-muted pl-4 border-l-2" style={{ borderColor: g.color }}>{it.text}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted">✓ Brain dump hoàn tất! Chọn 1–3 việc từ "Có thể làm ngay" để bắt đầu.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}>
      <p className="text-xs font-semibold" style={{ color: COLOR }}>Viết hết những gì đang trong đầu (mỗi dòng một ý):</p>
      <textarea
        className="w-full rounded-xl border bg-bg text-text text-sm p-4 resize-none focus:outline-none focus:ring-2 min-h-[180px]"
        style={{ borderColor: `${COLOR}30`, '--tw-ring-color': `${COLOR}60` }}
        placeholder={"Việc cần làm...\nLo về...\nCần nhớ...\nMuốn làm...\nĐang tức về...\n(cứ viết hết vào đây)"}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{text.split('\n').filter(l => l.trim()).length} mục</span>
        <button
          onClick={handleDump}
          disabled={!text.trim()}
          className="px-5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-40"
          style={{ background: COLOR, color: '#fff' }}
        >
          Phân loại →
        </button>
      </div>
    </div>
  );
}

export default function MindBrainDumpPage() {
  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBrainDumpOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBrainDumpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🧹</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Brain Dump — Xả Tải Tâm Trí</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D4 · Kỹ Thuật Dọn Dẹp Đầu Óc</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Khi đầu óc quá tải — quá nhiều việc cần nhớ, quá nhiều lo âu — Brain Dump là cách nhanh nhất để làm trống "RAM não bộ" và lấy lại sự rõ ràng.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Brain Dump" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>10 phút · Khi não quá tải</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6 mb-6" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <p className="text-base text-text leading-relaxed italic">"Não bộ không được thiết kế để nhớ danh sách — nó được thiết kế để suy nghĩ. Khi bạn yêu cầu nó làm cả hai, nó sẽ làm cả hai đều kém."</p>
          <p className="text-xs mt-3" style={{ color: COLOR }}>— David Allen, Getting Things Done</p>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>6 Bước Brain Dump</h2>
        <p className="text-muted text-sm mb-6">Quy trình 10 phút để làm trống đầu óc</p>
        <div className="space-y-3">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-4 rounded-2xl border border-border bg-surface p-4 hover:border-sky-500/30 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black" style={{ background: `${COLOR}20`, color: COLOR }}>{s.n}</div>
              <div>
                <div className="font-semibold text-text mb-1">{s.t}</div>
                <p className="text-muted text-sm">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Thử Brain Dump Ngay</h2>
        <p className="text-muted text-sm mb-6">Viết ra mọi thứ trong đầu, rồi phân loại tự động</p>
        <BrainDumpTool />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Nhóm Phân Loại</h2>
        <p className="text-muted text-sm mb-6">Sau brain dump, phân loại để biết phải làm gì tiếp</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(c => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
              <p className="text-sm text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>Khi Nào Nên Brain Dump?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '😰', t: 'Khi cảm thấy quá tải', d: 'Quá nhiều việc cần làm, không biết bắt đầu từ đâu' },
            { icon: '😴', t: 'Trước khi ngủ', d: 'Không ngủ được vì đầu óc cứ lẩm nhẩm việc chưa xong' },
            { icon: '🌀', t: 'Khi lo âu vô lý', d: 'Cảm giác lo nhưng không rõ lo cái gì — viết ra sẽ rõ' },
          ].map(c => (
            <div key={c.t} className="rounded-2xl border border-border bg-surface p-5 text-center">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-semibold text-text mb-1">{c.t}</div>
              <p className="text-sm text-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
