import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-bp-orbit-kf';
const ORBIT_CLASS = 'e-bp-orbit-ring';
const ORBIT_PROP = '--e-bp-orbit-angle';

const BP_CATS = [
  { label: 'Bình thường', sys: '< 120', dia: '< 80', color: '#22c55e', bg: '#22c55e18', action: 'Duy trì lối sống lành mạnh, tái khám hàng năm.' },
  { label: 'Tiền tăng huyết áp', sys: '120–129', dia: '< 80', color: '#eab308', bg: '#eab30818', action: 'Điều chỉnh chế độ ăn, giảm muối, tăng vận động.' },
  { label: 'Tăng HA độ 1', sys: '130–139', dia: '80–89', color: '#f97316', bg: '#f9731618', action: 'Thay đổi lối sống 3–6 tháng; cân nhắc thuốc nếu có nguy cơ.' },
  { label: 'Tăng HA độ 2', sys: '≥ 140', dia: '≥ 90', color: '#ef4444', bg: '#ef444418', action: 'Bắt đầu dùng thuốc + thay đổi lối sống, tái khám trong 1 tháng.' },
  { label: 'Khủng hoảng HA', sys: '> 180', dia: '> 120', color: '#7f1d1d', bg: '#ef444430', action: 'Đến cấp cứu ngay nếu có triệu chứng (đau đầu dữ dội, mờ mắt, đau ngực).' },
];

const STEPS = [
  { num: '1', title: 'Nghỉ ngơi 5 phút', desc: 'Ngồi yên, không nói chuyện, tư thế thoải mái trước khi đo.' },
  { num: '2', title: 'Tránh cà phê & thuốc lá', desc: 'Không dùng cà phê, thuốc lá, rượu 30 phút trước khi đo.' },
  { num: '3', title: 'Tư thế chuẩn', desc: 'Ngồi ngay lưng, hai chân chạm đất, tay đặt bằng tim trên bàn.' },
  { num: '4', title: 'Băng quấn đúng cỡ', desc: 'Băng quấn ôm sát, cách nếp khuỷu tay 2–3cm. Không quấn lên áo.' },
  { num: '5', title: 'Đo 2 lần liên tiếp', desc: 'Nghỉ 1–2 phút giữa 2 lần đo. Ghi lại trị số trung bình.' },
];

const LIFESTYLE = [
  { icon: '🧂', title: 'Giảm muối', desc: '< 5g muối/ngày (1 muỗng cà phê). Tránh đồ đóng hộp, mì gói.' },
  { icon: '🥦', title: 'Ăn nhiều rau quả', desc: 'DASH diet: rau, trái cây, ngũ cốc nguyên hạt, sữa ít béo.' },
  { icon: '🏃', title: 'Vận động đều', desc: '150 phút/tuần cường độ vừa (đi bộ nhanh, bơi lội, đạp xe).' },
  { icon: '⚖️', title: 'Giữ cân nặng hợp lý', desc: 'Giảm 1kg → HA giảm ~1 mmHg. Mục tiêu BMI 18.5–24.9.' },
  { icon: '🚭', title: 'Không hút thuốc', desc: 'Bỏ thuốc lá → HA giảm ngay trong vài tuần đầu.' },
  { icon: '🧘', title: 'Kiểm soát stress', desc: 'Thở sâu, thiền, yoga → giảm hệ thần kinh giao cảm.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-bp-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      id={`reveal-bp-${delay}`}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s`,
      }}
    >
      {children}
    </div>
  );
}

function BPJournal() {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_bp_journal') || '[]'); }
    catch { return []; }
  });
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');

  function addEntry() {
    if (!sys || !dia) return;
    const now = new Date();
    const entry = { sys: +sys, dia: +dia, pulse: +pulse || null, date: now.toLocaleDateString('vi-VN'), time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    const updated = [entry, ...entries].slice(0, 14);
    setEntries(updated);
    localStorage.setItem('healthapp_bp_journal', JSON.stringify(updated));
    setSys(''); setDia(''); setPulse('');
  }

  function getColor(s, d) {
    if (s > 180 || d > 120) return '#7f1d1d';
    if (s >= 140 || d >= 90) return '#ef4444';
    if (s >= 130 || d >= 80) return '#f97316';
    if (s >= 120) return '#eab308';
    return '#22c55e';
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold text-text mb-4" style={{ color: COLOR }}>Nhật Ký Huyết Áp 7 Ngày</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={sys} onChange={e => setSys(e.target.value)} placeholder="Tâm thu (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={dia} onChange={e => setDia(e.target.value)} placeholder="Tâm trương (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={pulse} onChange={e => setPulse(e.target.value)} placeholder="Nhịp tim (bpm)" type="number" className="flex-1 min-w-[100px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <button onClick={addEntry} className="px-4 py-2 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>+ Thêm</button>
      </div>
      {entries.length === 0 && <p className="text-muted text-lg text-center py-6">Chưa có dữ liệu. Thêm lần đo đầu tiên.</p>}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2 border border-border">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(e.sys, e.dia) }} />
            <span className="font-bold text-lg" style={{ color: getColor(e.sys, e.dia) }}>{e.sys}/{e.dia}</span>
            {e.pulse && <span className="text-base text-muted">♥ {e.pulse} bpm</span>}
            <span className="text-base text-muted ml-auto">{e.date} {e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HealthBPPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBpOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eBpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        ← Kiến Thức Sức Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>
          🫀
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Huyết Áp</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Chỉ số sinh tồn · Theo dõi thường xuyên
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Huyết áp là áp lực máu tác động lên thành mạch. Tăng huyết áp không triệu chứng thường trực — được gọi là "kẻ giết người thầm lặng" — và là nguyên nhân hàng đầu của đột quỵ, nhồi máu cơ tim.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&auto=format&fit=crop" alt="Đo huyết áp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Đo đúng cách · Đọc đúng số
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Personalized banner */}
      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — Nên đo huyết áp {b0.age >= 40 ? 'mỗi 3–6 tháng' : 'mỗi năm'} và theo dõi hàng ngày nếu có nguy cơ.</p>
          </div>
        </RevealBlock>
      )}

      {/* Classification */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại Huyết Áp (AHA 2017)</h2>
        <p className="text-muted text-lg mb-6">Đơn vị mmHg. Áp dụng cho người lớn ≥ 18 tuổi, không dùng thuốc huyết áp.</p>
        <div className="space-y-3">
          {BP_CATS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: c.bg }}>
              <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="font-bold text-lg text-text">{c.label}</span>
              </div>
              <div className="flex gap-4 text-base text-muted sm:w-40 shrink-0">
                <span>Tâm thu: <strong className="text-text">{c.sys}</strong></span>
                <span>Tâm trương: <strong className="text-text">{c.dia}</strong></span>
              </div>
              <p className="text-base text-muted flex-1">{c.action}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border p-4 text-lg" style={{ borderColor: `rgba(239,68,68,0.3)`, background: 'rgba(239,68,68,0.06)' }}>
          <span className="font-bold text-red-400">⚠ Khẩn cấp:</span> <span className="text-muted">HA &gt; 180/120 mmHg kèm đau đầu dữ dội, mờ mắt, đau ngực, khó thở, tê liệt → <strong className="text-text">Gọi 115 hoặc vào cấp cứu ngay.</strong></span>
        </div>
      </RevealBlock>

      {/* Measurement technique */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kỹ Thuật Đo Đúng Chuẩn</h2>
        <p className="text-muted text-lg mb-6">Sai kỹ thuật có thể khiến kết quả lệch 10–20 mmHg.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {STEPS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-4">
              <div className="w-9 h-9 rounded-xl font-bold text-xl flex items-center justify-center shrink-0" style={{ background: `rgba(${RGB},0.12)`, color: COLOR }}>{s.num}</div>
              <div>
                <div className="font-bold text-lg text-text mb-1">{s.title}</div>
                <div className="text-base text-muted">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-lg text-muted">
          <strong className="text-text">Nên đo lúc nào?</strong> Buổi sáng (sau khi thức, trước khi ăn, trước khi uống thuốc) và buổi tối (trước khi ngủ). Ghi lại cả hai lần để có xu hướng chính xác hơn.
        </div>
      </RevealBlock>

      {/* Lifestyle */}
      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lối Sống Kiểm Soát Huyết Áp</h2>
        <p className="text-muted text-lg mb-6">Thay đổi lối sống có thể giảm HA 5–20 mmHg mà không cần thuốc.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {LIFESTYLE.map((l, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3 hover:border-red-500/30 transition-colors">
              <span className="text-3xl">{l.icon}</span>
              <div>
                <div className="font-bold text-lg text-text mb-1">{l.title}</div>
                <div className="text-base text-muted">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Journal */}
      <RevealBlock delay={4} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Ghi Nhật Ký Huyết Áp</h2>
        <BPJournal />
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        ← Quay lại Kiến Thức Sức Khỏe
      </Link>
    </div>
  );
}
