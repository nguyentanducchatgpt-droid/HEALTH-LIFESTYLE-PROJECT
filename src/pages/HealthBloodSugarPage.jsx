import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f59e0b';
const RGB = '245,158,11';
const ORBIT_ID = 'e-bs-orbit-kf';
const ORBIT_CLASS = 'e-bs-orbit-ring';
const ORBIT_PROP = '--e-bs-orbit-angle';

const BS_CATS = [
  { label: 'Hạ đường huyết', range: '< 70 mg/dL', color: '#3b82f6', bg: '#3b82f618', note: 'Ăn ngay 15g carb nhanh (kẹo, nước cam). Đo lại sau 15 phút.' },
  { label: 'Bình thường (đói)', range: '70–99 mg/dL', color: '#22c55e', bg: '#22c55e18', note: 'Lý tưởng. Duy trì chế độ ăn cân bằng và vận động đều.' },
  { label: 'Tiền tiểu đường (đói)', range: '100–125 mg/dL', color: '#f97316', bg: '#f9731618', note: 'Nguy cơ cao. Thay đổi lối sống ngay để ngăn chặn tiến triển.' },
  { label: 'Tiểu đường (đói)', range: '≥ 126 mg/dL', color: '#ef4444', bg: '#ef444418', note: 'Cần xét nghiệm xác nhận và gặp bác sĩ trong vòng 1 tuần.' },
  { label: 'Sau ăn 2h — Bình thường', range: '< 140 mg/dL', color: '#22c55e', bg: '#22c55e18', note: 'Phản ứng đường huyết tốt sau bữa ăn.' },
  { label: 'Sau ăn 2h — Tiền ĐTĐ', range: '140–199 mg/dL', color: '#f97316', bg: '#f9731618', note: 'Cơ thể gặp khó khăn trong việc xử lý đường từ bữa ăn.' },
  { label: 'Sau ăn 2h — Tiểu đường', range: '≥ 200 mg/dL', color: '#ef4444', bg: '#ef444418', note: 'Cần theo dõi chặt chẽ và điều trị.' },
];

const HBAC_CATS = [
  { label: 'Bình thường', range: '< 5.7%', color: '#22c55e', note: 'Kiểm soát tốt trong 3 tháng qua.' },
  { label: 'Tiền tiểu đường', range: '5.7–6.4%', color: '#f97316', note: 'Đường huyết cao hơn bình thường liên tục.' },
  { label: 'Tiểu đường', range: '≥ 6.5%', color: '#ef4444', note: 'Đáp ứng tiêu chí chẩn đoán tiểu đường type 2.' },
  { label: 'Mục tiêu điều trị ĐTĐ', range: '< 7%', color: '#3b82f6', note: 'Nếu bạn đang điều trị, đây là đích cần đạt.' },
];

const DIET_TIPS = [
  { icon: '🥗', tip: 'Ưu tiên rau xanh, đậu, ngũ cốc nguyên hạt — GI thấp, tăng đường chậm hơn.' },
  { icon: '🍚', tip: 'Ăn cơm trắng ít hơn, thay bằng gạo lứt, khoai lang, bún gạo lứt.' },
  { icon: '🥩', tip: 'Kết hợp protein + chất xơ trong mỗi bữa ăn để làm chậm hấp thu đường.' },
  { icon: '🚶', tip: 'Đi bộ 10–15 phút sau bữa ăn giúp giảm đường huyết sau ăn hiệu quả.' },
  { icon: '💧', tip: 'Uống đủ nước (30–35ml/kg/ngày) — mất nước làm tăng nồng độ đường huyết.' },
  { icon: '😴', tip: 'Ngủ đủ 7–9 tiếng. Thiếu ngủ làm tăng insulin resistance trong vài ngày.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-bs-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-bs-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function BSCalculator() {
  const [fasting, setFasting] = useState('');
  const [postMeal, setPostMeal] = useState('');
  const [hba1c, setHba1c] = useState('');
  const [result, setResult] = useState(null);

  function analyze() {
    const f = parseFloat(fasting);
    const p = parseFloat(postMeal);
    const h = parseFloat(hba1c);
    const findings = [];
    if (!isNaN(f)) {
      if (f < 70) findings.push({ label: 'Đường huyết đói', status: 'Hạ đường huyết', color: '#3b82f6', action: 'Ăn ngay 15g carb nhanh.' });
      else if (f <= 99) findings.push({ label: 'Đường huyết đói', status: 'Bình thường', color: '#22c55e', action: 'Tiếp tục duy trì lối sống lành mạnh.' });
      else if (f <= 125) findings.push({ label: 'Đường huyết đói', status: 'Tiền tiểu đường', color: '#f97316', action: 'Thay đổi lối sống ngay, tái khám sau 3–6 tháng.' });
      else findings.push({ label: 'Đường huyết đói', status: 'Tiểu đường (nghi ngờ)', color: '#ef4444', action: 'Gặp bác sĩ trong tuần để xác nhận.' });
    }
    if (!isNaN(p)) {
      if (p < 140) findings.push({ label: 'Sau ăn 2h', status: 'Bình thường', color: '#22c55e', action: 'Phản ứng đường huyết tốt.' });
      else if (p <= 199) findings.push({ label: 'Sau ăn 2h', status: 'Tiền tiểu đường', color: '#f97316', action: 'Điều chỉnh bữa ăn, tăng vận động.' });
      else findings.push({ label: 'Sau ăn 2h', status: 'Tiểu đường (nghi ngờ)', color: '#ef4444', action: 'Cần theo dõi và điều trị.' });
    }
    if (!isNaN(h)) {
      if (h < 5.7) findings.push({ label: 'HbA1c', status: 'Bình thường', color: '#22c55e', action: 'Kiểm soát tốt trong 3 tháng qua.' });
      else if (h < 6.5) findings.push({ label: 'HbA1c', status: 'Tiền tiểu đường', color: '#f97316', action: 'Cần can thiệp lối sống tích cực.' });
      else findings.push({ label: 'HbA1c', status: 'Tiểu đường', color: '#ef4444', action: 'Cần điều trị và theo dõi chặt chẽ.' });
    }
    setResult(findings);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold mb-4" style={{ color: COLOR }}>Phân Tích Đường Huyết</h3>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-base text-muted mb-1 block">Đường huyết đói (mg/dL)</label>
          <input value={fasting} onChange={e => setFasting(e.target.value)} type="number" placeholder="vd: 95" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
        <div>
          <label className="text-base text-muted mb-1 block">Sau ăn 2h (mg/dL)</label>
          <input value={postMeal} onChange={e => setPostMeal(e.target.value)} type="number" placeholder="vd: 130" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
        <div>
          <label className="text-base text-muted mb-1 block">HbA1c (%)</label>
          <input value={hba1c} onChange={e => setHba1c(e.target.value)} type="number" step="0.1" placeholder="vd: 5.8" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
      </div>
      <button onClick={analyze} className="px-5 py-2 rounded-xl text-lg font-bold text-white mb-4" style={{ background: COLOR }}>Phân Tích</button>
      {result && result.length === 0 && <p className="text-muted text-lg">Nhập ít nhất một chỉ số để phân tích.</p>}
      {result && result.length > 0 && (
        <div className="space-y-2">
          {result.map((r, i) => (
            <div key={i} className="rounded-xl border border-border p-3 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: r.color }} />
              <div>
                <div className="text-base text-muted">{r.label}</div>
                <div className="font-bold text-lg" style={{ color: r.color }}>{r.status}</div>
                <div className="text-base text-muted mt-1">{r.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HealthBloodSugarPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eBsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🍬</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Đường Huyết</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Chỉ số chuyển hóa · Tiểu đường type 2
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đường huyết (glucose máu) cho biết cơ thể xử lý năng lượng từ thức ăn như thế nào. Mất kiểm soát đường huyết kéo dài gây tổn thương thần kinh, thận, mắt và mạch máu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop" alt="Đường huyết" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Kiểm soát từ bữa ăn hàng ngày
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age >= 45 ? 'Nên xét nghiệm đường huyết đói và HbA1c hàng năm.' : 'Xét nghiệm mỗi 3 năm nếu không có yếu tố nguy cơ.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại Đường Huyết</h2>
        <p className="text-muted text-lg mb-6">Xét nghiệm sau nhịn ăn ít nhất 8 tiếng hoặc 2 giờ sau bữa ăn (test dung nạp glucose).</p>
        <div className="space-y-2">
          {BS_CATS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: c.bg }}>
              <div className="flex items-center gap-2 sm:w-56 shrink-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-lg font-bold text-text">{c.label}</span>
              </div>
              <span className="font-mono text-lg font-bold sm:w-32 shrink-0" style={{ color: c.color }}>{c.range}</span>
              <p className="text-base text-muted flex-1">{c.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>HbA1c — Đường Huyết Trung Bình 3 Tháng</h2>
        <p className="text-muted text-lg mb-6">HbA1c đo lượng glucose gắn vào hemoglobin, phản ánh kiểm soát đường huyết trong 2–3 tháng qua. Không bị ảnh hưởng bởi ăn uống ngay trước đó.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {HBAC_CATS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className="font-bold text-lg text-text">{c.label}</span>
                <span className="ml-auto font-mono text-lg font-bold" style={{ color: c.color }}>{c.range}</span>
              </div>
              <p className="text-base text-muted">{c.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Phân Tích Chỉ Số Của Bạn</h2>
        <BSCalculator />
      </RevealBlock>

      <RevealBlock delay={4} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kiểm Soát Đường Huyết Bằng Lối Sống</h2>
        <p className="text-muted text-lg mb-6">Thay đổi lối sống có thể ngăn 58% trường hợp tiền tiểu đường không tiến triển thành tiểu đường type 2 (theo nghiên cứu DPP của NIH).</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {DIET_TIPS.map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3 hover:border-amber-500/30 transition-colors">
              <span className="text-3xl">{t.icon}</span>
              <p className="text-lg text-muted">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={5} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Khi Nào Cần Gặp Bác Sĩ?</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Đường huyết đói ≥ 126 mg/dL trong 2 lần đo riêng biệt</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> HbA1c ≥ 6.5% xác nhận bởi xét nghiệm</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Triệu chứng: khát nước nhiều, tiểu nhiều, mệt mỏi không rõ nguyên nhân, nhìn mờ</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Hạ đường huyết tái phát (&lt; 70 mg/dL) kèm chóng mặt, run tay</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
