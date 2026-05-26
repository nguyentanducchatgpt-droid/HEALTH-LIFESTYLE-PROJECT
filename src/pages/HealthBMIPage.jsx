import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#3b82f6';
const RGB = '59,130,246';
const ORBIT_ID = 'e-bmi-orbit-kf';
const ORBIT_CLASS = 'e-bmi-orbit-ring';
const PROP = '--e-bmi-orbit-angle';
const E0_KEY = 'healthapp_e0_profile';

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

const BMI_CATS = [
  { range: '< 18.5', label: 'Thiếu cân', color: '#f59e0b', action: 'Kiểm tra ăn uống, cơ bắp, bệnh lý nền. Tăng protein và calo lành mạnh.' },
  { range: '18.5–24.9', label: 'Bình thường', color: '#10b981', action: 'Duy trì cân nặng. Theo dõi xu hướng hàng tháng. Kiểm tra thêm vòng eo.' },
  { range: '25–29.9', label: 'Thừa cân', color: '#f59e0b', action: 'Điều chỉnh ăn uống, tăng vận động. Đo thêm vòng eo để đánh giá mỡ bụng.' },
  { range: '30–34.9', label: 'Béo phì độ I', color: '#ef4444', action: 'Cần kế hoạch dài hạn. Nên tư vấn chuyên môn về dinh dưỡng và vận động.' },
  { range: '≥ 35', label: 'Béo phì độ II–III', color: '#dc2626', action: 'Cần đánh giá y tế toàn diện. Xem xét hỗ trợ từ bác sĩ chuyên khoa.' },
];

const WAIST_RISKS = [
  { group: 'Nam', low: '<90 cm', normal: 'Bình thường', high: '≥90 cm', danger: 'Nguy cơ cao' },
  { group: 'Nữ', low: '<80 cm', normal: 'Bình thường', high: '≥80 cm', danger: 'Nguy cơ cao' },
];

function BMICalculator() {
  const e0 = (() => { try { return JSON.parse(localStorage.getItem(E0_KEY)) || {}; } catch { return {}; } })();
  const [weight, setWeight] = useState(e0.weight || '');
  const [height, setHeight] = useState(e0.height || '');
  const [waist, setWaist] = useState(e0.waist || '');
  const [sex, setSex] = useState(e0.sex || 'male');
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;
  const cat = bmi ? BMI_CATS.find((c, i) => {
    if (i === 0) return bmi < 18.5;
    if (i === 1) return bmi >= 18.5 && bmi < 25;
    if (i === 2) return bmi >= 25 && bmi < 30;
    if (i === 3) return bmi >= 30 && bmi < 35;
    return bmi >= 35;
  }) : null;
  const waistRisk = waist && sex ? (sex === 'male' ? waist >= 90 : waist >= 80) : null;
  const whr = waist && height ? (waist / height).toFixed(2) : null;

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}30`, background: `${COLOR}07` }}>
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: COLOR }}>Tính BMI & Đánh Giá Vòng Eo</p>
      <div className="grid grid-cols-2 gap-3">
        {[{ l: 'Cân nặng (kg)', v: weight, s: setWeight, ph: 'VD: 70' }, { l: 'Chiều cao (cm)', v: height, s: setHeight, ph: 'VD: 170' }, { l: 'Vòng eo (cm)', v: waist, s: setWaist, ph: 'VD: 85' }].map(f => (
          <div key={f.l}>
            <label className="text-xs text-muted mb-1 block">{f.l}</label>
            <input type="number" placeholder={f.ph} value={f.v} onChange={e => f.s(+e.target.value)}
              className="w-full rounded-xl border border-border bg-bg text-text text-sm px-3 py-2 focus:outline-none" />
          </div>
        ))}
        <div>
          <label className="text-xs text-muted mb-1 block">Giới tính</label>
          <div className="flex gap-2">
            {[{ v: 'male', l: 'Nam' }, { v: 'female', l: 'Nữ' }].map(g => (
              <button key={g.v} onClick={() => setSex(g.v)}
                className="flex-1 py-2 rounded-xl border text-xs font-semibold transition-all"
                style={sex === g.v ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
                {g.l}
              </button>
            ))}
          </div>
        </div>
      </div>
      {bmi && cat && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex gap-4">
            <div className="rounded-xl border p-3 flex-1 text-center" style={{ borderColor: `${cat.color}30`, background: `${cat.color}08` }}>
              <div className="text-3xl font-black" style={{ color: cat.color }}>{bmi}</div>
              <div className="text-xs font-bold" style={{ color: cat.color }}>{cat.label}</div>
              <div className="text-xs text-muted">BMI</div>
            </div>
            {waist && (
              <div className="rounded-xl border p-3 flex-1 text-center" style={{ borderColor: `${waistRisk ? '#ef4444' : '#10b981'}30`, background: `${waistRisk ? '#ef4444' : '#10b981'}08` }}>
                <div className="text-3xl font-black" style={{ color: waistRisk ? '#ef4444' : '#10b981' }}>{waist}</div>
                <div className="text-xs font-bold" style={{ color: waistRisk ? '#ef4444' : '#10b981' }}>{waistRisk ? 'Nguy cơ cao' : 'Bình thường'}</div>
                <div className="text-xs text-muted">Vòng eo (cm)</div>
              </div>
            )}
            {whr && (
              <div className="rounded-xl border border-border p-3 flex-1 text-center">
                <div className="text-3xl font-black text-text">{whr}</div>
                <div className="text-xs text-muted">Tỷ lệ eo/chiều cao</div>
                <div className="text-xs" style={{ color: +whr > 0.5 ? '#ef4444' : '#10b981' }}>{+whr > 0.5 ? 'Trên ngưỡng' : 'OK'}</div>
              </div>
            )}
          </div>
          <div className="rounded-xl p-3" style={{ background: `${cat.color}10`, borderLeft: `3px solid ${cat.color}` }}>
            <p className="text-xs text-muted leading-relaxed"><strong style={{ color: cat.color }}>Gợi ý hành động:</strong> {cat.action}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HealthBMIPage() {
  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBmiOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} { background: conic-gradient(from var(${PROP}), transparent 0deg, transparent 55deg, rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg, rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg, rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg); animation: eBmiOrbitSpin 3.5s linear infinite; }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Kiến Thức Sức Khỏe</span>
      </Link>
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>⚖️</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">BMI & Vòng Eo</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>E1 · Chỉ Số Cơ Thể</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">BMI sàng lọc tình trạng cân nặng, còn vòng eo phản ánh mỡ bụng nội tạng — nguy cơ tim mạch và chuyển hóa quan trọng hơn con số cân nặng đơn thuần.</p>
        </div>
      </div>
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="BMI" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>Đo vòng eo 1 lần/tuần · Cân 1–3 lần/tuần</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Tính BMI & Đánh Giá</h2>
        <p className="text-muted text-sm mb-6">Nhập số liệu để xem phân loại và gợi ý hành động</p>
        <BMICalculator />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại BMI & Hành Động</h2>
        <p className="text-muted text-sm mb-6">BMI là chỉ số sàng lọc — cần kết hợp với vòng eo và các chỉ số khác để đánh giá toàn diện</p>
        <div className="space-y-3">
          {BMI_CATS.map(c => (
            <div key={c.label} className="rounded-2xl border border-border bg-surface p-4 flex gap-4">
              <div className="shrink-0 w-24">
                <div className="text-sm font-black" style={{ color: c.color }}>{c.range}</div>
                <div className="text-xs font-bold" style={{ color: c.color }}>{c.label}</div>
              </div>
              <p className="text-sm text-muted leading-relaxed">{c.action}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">* BMI không phân biệt mỡ và cơ — người tập gym nhiều có thể BMI cao nhưng tỷ lệ mỡ thấp. Luôn kết hợp với vòng eo.</p>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Vòng Eo — Chỉ Số Quan Trọng Hơn Cân Nặng</h2>
        <p className="text-muted text-sm mb-6">Mỡ bụng nội tạng liên quan đến nguy cơ tim mạch, đái tháo đường type 2, gan nhiễm mỡ và hội chứng chuyển hóa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {WAIST_RISKS.map(w => (
            <div key={w.group} className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-bold text-text mb-3">{w.group}</div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#10b98115' }}>
                  <div className="font-black text-lg" style={{ color: '#10b981' }}>{w.low}</div>
                  <div className="text-xs text-muted">{w.normal}</div>
                </div>
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#ef444415' }}>
                  <div className="font-black text-lg" style={{ color: '#ef4444' }}>{w.high}</div>
                  <div className="text-xs text-muted">{w.danger}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-bold text-text mb-3">Cách Đo Vòng Eo Đúng</p>
          <ol className="space-y-2">
            {['Đứng thẳng, hai chân rộng bằng vai', 'Thở ra nhẹ — không hóp bụng', 'Đo ngang qua giữa bờ dưới xương sườn và mào chậu (hoặc ngang rốn)', 'Dùng cùng một vị trí đo mỗi tuần', 'Đo buổi sáng trước ăn là tốt nhất'].map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted">
                <span className="font-black shrink-0 w-5" style={{ color: COLOR }}>{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <h3 className="font-bold text-text mb-3">Nhìn Xu Hướng, Không Nhìn Một Con Số</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { t: 'Cân giảm ít nhưng vòng eo giảm 3–5cm', c: '#10b981', n: '✓ Tiến triển tốt — mỡ bụng đang giảm' },
              { t: 'Cân không giảm, vòng eo tăng', c: '#f59e0b', n: '⚠ Xem lại ăn uống, rượu bia, stress, ngủ' },
              { t: 'Vòng eo tăng nhanh kèm mệt, phù, khó thở', c: '#ef4444', n: '→ Nên đi khám bác sĩ' },
            ].map(c => (
              <div key={c.t} className="rounded-xl border p-3" style={{ borderColor: `${c.c}25`, background: `${c.c}08` }}>
                <p className="text-xs text-muted mb-1">{c.t}</p>
                <p className="text-xs font-bold" style={{ color: c.c }}>{c.n}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Kiến Thức Sức Khỏe</span>
      </Link>
    </div>
  );
}
