import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'f-mp-orbit-kf';
const ORBIT_CLASS = 'f-mp-orbit-ring';
const LS_KEY = 'healthapp_f_meal';

const PLATE_SECTIONS = [
  { pct: 50, label: '½ Rau & Trái Cây', color: '#22c55e', desc: 'Rau lá xanh, cà chua, cà rốt, bông cải, dưa leo, chuối, cam' },
  { pct: 25, label: '¼ Đạm', color: '#f59e0b', desc: 'Thịt gà, cá, trứng, đậu phụ, tôm, thịt heo nạc' },
  { pct: 25, label: '¼ Tinh Bột', color: '#84cc16', desc: 'Cơm gạo lứt, khoai lang, bánh mì nguyên cám, ngô' },
];

const MEAL_IDEAS = [
  { meal: 'Sáng', icon: '🌅', color: '#f59e0b', options: ['Cơm + trứng + rau luộc', 'Bánh mì nguyên cám + trứng ốp la', 'Yến mạch + sữa chua + trái cây', 'Phở gà ít mỡ + rau thơm'] },
  { meal: 'Trưa', icon: '☀️', color: '#22c55e', options: ['Cơm gạo lứt + cá hấp + canh rau', 'Bún gà + rau sống', 'Cơm + thịt heo luộc + dưa cải', 'Salad + đậu phụ + bánh mì'] },
  { meal: 'Tối', icon: '🌙', color: '#6366f1', options: ['Cơm + canh chua cá + rau muống', 'Súp gà + bánh mì ít', 'Đậu phụ sốt cà chua + cơm', 'Thịt bò xào rau củ + ít cơm'] },
  { meal: 'Snack', icon: '🍌', color: '#14b8a6', options: ['Hạt điều/óc chó 30g', 'Trái cây tươi 1 phần', 'Sữa chua không đường', 'Trứng luộc 1–2 quả'] },
];

const NUTRITION_FIELDS = [
  { key: 'protein', label: 'Đạm đủ không?', icon: '🥩', placeholder: 'vd: 3 bữa có đạm' },
  { key: 'veg', label: 'Rau hôm nay?', icon: '🥗', placeholder: 'vd: 2 phần rau xào + canh' },
  { key: 'water', label: 'Nước (ml)', icon: '💧', placeholder: 'vd: 2000' },
  { key: 'mood', label: 'Cảm giác sau ăn', icon: '😊', placeholder: 'vd: no vừa, không buồn ngủ' },
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

export default function ToolsMealPlanPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [log, setLog] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || {}; } catch { return {}; }
  });
  const [openMeal, setOpenMeal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mp-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMpOrbitSpin { to { --f-mp-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mp-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const updateLog = (key, val) => {
    const next = { ...log, [key]: val };
    setLog(next);
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🍽️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Template Thực Đơn</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Đĩa ăn chuẩn · Nhật ký dinh dưỡng · Gợi ý bữa ăn Việt
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Mô hình đĩa ăn lành mạnh theo tỷ lệ ½ rau – ¼ đạm – ¼ tinh bột. Ghi nhật ký ăn uống đơn giản mỗi ngày để xây dựng ý thức dinh dưỡng.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop" alt="Meal plan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            ½ rau · ¼ đạm · ¼ tinh bột · đơn giản mỗi bữa
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Plate model */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Mô Hình Đĩa Ăn Chuẩn</h2>
        <p className="text-muted text-base mb-6">Áp dụng cho tất cả các bữa chính — không cần cân đo, chỉ cần nhìn đĩa.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {PLATE_SECTIONS.map((s, i) => (
            <div key={i} className="rounded-2xl border bg-surface p-5 text-center" style={{ borderColor: `${s.color}30` }}>
              <div className="text-5xl font-black mb-2" style={{ color: s.color }}>{s.pct}%</div>
              <div className="font-bold text-text mb-2 text-base">{s.label}</div>
              <div className="text-sm text-muted leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-2xl text-base text-muted" style={{ background: `rgba(${RGB},0.05)`, borderLeft: `3px solid ${COLOR}` }}>
          <strong style={{ color: COLOR }}>Nguyên tắc vàng:</strong> Luôn ăn rau trước → đạm → tinh bột. Ăn chậm, nhai kỹ, dừng khi no 80%.
        </div>
      </RevealBlock>

      {/* Meal ideas */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Gợi Ý Bữa Ăn Việt</h2>
        <p className="text-muted text-base mb-6">Click để xem gợi ý cho từng bữa. Ăn đa dạng, không ăn đi ăn lại 1 món.</p>
        <div className="space-y-3">
          {MEAL_IDEAS.map((m, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenMeal(openMeal === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-3xl">{m.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-text">Bữa {m.meal}</div>
                  <div className="text-sm text-muted">4 gợi ý · nhấn để xem</div>
                </div>
                <span className="text-muted">{openMeal === i ? '▲' : '▼'}</span>
              </button>
              {openMeal === i && (
                <div className="px-4 pb-4 border-t border-border">
                  <ul className="mt-3 space-y-2">
                    {m.options.map((opt, j) => (
                      <li key={j} className="flex gap-2 text-base text-muted">
                        <span style={{ color: m.color }}>→</span>{opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily nutrition log */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nhật Ký Hôm Nay</h2>
        <p className="text-muted text-base mb-6">Ghi nhanh — không cần hoàn hảo, chỉ cần ý thức về những gì đã ăn.</p>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          {NUTRITION_FIELDS.map(f => (
            <div key={f.key}>
              <label className="flex items-center gap-2 text-base font-medium text-text mb-2">
                <span>{f.icon}</span>{f.label}
              </label>
              <input type="text" value={log[f.key] ?? ''} onChange={e => updateLog(f.key, e.target.value)}
                placeholder={f.placeholder} className="w-full px-3 py-2 rounded-xl border bg-transparent text-base text-text placeholder-muted focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
          ))}
          <div>
            <label className="text-base font-medium text-text block mb-2">📝 Ghi chú bữa ăn ngày hôm nay</label>
            <textarea value={log.notes ?? ''} onChange={e => updateLog('notes', e.target.value)}
              rows={3} placeholder="Ăn gì, cảm giác thế nào, muốn điều chỉnh gì..." className="w-full px-3 py-2 rounded-xl border bg-transparent text-base text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>
        </div>
      </RevealBlock>

      {/* Quick rules */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>⚡ 5 Quy Tắc Ăn Uống Quan Trọng Nhất</h3>
          <ol className="space-y-2 text-base text-muted">
            {['Ăn đủ đạm mỗi bữa — đây là ưu tiên số 1', 'Ăn rau trước → no nhanh hơn, ít calo hơn', 'Không bỏ bữa — đói sẽ ăn bù nhiều hơn', 'Hạn chế thực phẩm siêu chế biến, không cần loại bỏ hoàn toàn', 'Uống nước thay vì nước ngọt, cà phê sữa nhiều đường'].map((rule, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold shrink-0" style={{ color: COLOR }}>{i + 1}.</span>{rule}
              </li>
            ))}
          </ol>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
