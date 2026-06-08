import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'e-checkup-orbit-kf';
const ORBIT_CLASS = 'e-checkup-orbit-ring';
const ORBIT_PROP = '--e-checkup-orbit-angle';

const BASIC_PACKAGE = [
  { item: 'Khám lâm sàng toàn diện (chiều cao, cân nặng, HA, nhịp tim)', freq: 'Hàng năm' },
  { item: 'Xét nghiệm máu cơ bản: CBC (huyết đồ)', freq: 'Hàng năm' },
  { item: 'Sinh hóa máu: glucose đói, HbA1c, bộ lipid (cholesterol, LDL, HDL, TG)', freq: 'Hàng năm' },
  { item: 'Chức năng gan: AST, ALT, GGT, bilirubin', freq: 'Hàng năm' },
  { item: 'Chức năng thận: creatinine, ure, eGFR, acid uric', freq: 'Hàng năm' },
  { item: 'Tổng phân tích nước tiểu', freq: 'Hàng năm' },
  { item: 'Điện tâm đồ (ECG)', freq: 'Hàng năm (từ 35 tuổi)' },
  { item: 'Siêu âm bụng tổng quát', freq: 'Hàng năm' },
  { item: 'X-quang ngực thẳng', freq: 'Mỗi 2 năm' },
  { item: 'Khám mắt (thị lực, nhãn áp)', freq: 'Mỗi 2 năm' },
  { item: 'Khám nha khoa', freq: 'Mỗi 6 tháng' },
];

const EXTENDED_PACKAGES = [
  {
    title: 'Có nguy cơ tim mạch',
    icon: '❤️',
    color: '#ef4444',
    triggers: 'Hút thuốc, HA cao, tiểu đường, mỡ máu cao, béo phì, gia đình có tiền sử',
    tests: ['Siêu âm tim (Echocardiography)', 'Test gắng sức (Stress ECG)', 'CRP siêu nhạy', 'Homocysteine'],
  },
  {
    title: 'Phụ nữ > 40 tuổi',
    icon: '🌸',
    color: '#ec4899',
    triggers: 'Mọi phụ nữ từ 40 tuổi, hoặc sớm hơn nếu có yếu tố nguy cơ',
    tests: ['Siêu âm vú (mỗi năm)', 'Mamogram (mỗi 1–2 năm từ 40–45)', 'Pap smear hoặc HPV test (mỗi 3–5 năm)', 'DEXA scan (loãng xương từ 50 tuổi hoặc mãn kinh)'],
  },
  {
    title: 'Nam giới > 40 tuổi',
    icon: '💙',
    color: '#3b82f6',
    triggers: 'Mọi nam giới từ 40 tuổi, hoặc sớm hơn nếu có tiền sử gia đình',
    tests: ['PSA (kháng nguyên đặc hiệu tiền liệt tuyến)', 'Testosterone (nếu có triệu chứng)', 'Siêu âm tiền liệt tuyến nếu PSA bất thường'],
  },
  {
    title: 'Tiền sử gia đình ung thư',
    icon: '🧬',
    color: '#8b5cf6',
    triggers: 'Ba/mẹ/anh/chị/em ruột mắc ung thư đại tràng, vú, buồng trứng, dạ dày',
    tests: ['Nội soi đại tràng từ 40 tuổi (hoặc sớm hơn 10 năm so với người thân mắc bệnh)', 'Xét nghiệm gen BRCA (nếu nguy cơ cao)', 'Nội soi dạ dày nếu tiền sử gia đình'],
  },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-cu-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-cu-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthCheckupPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [checked, setChecked] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_checkup_done') || '[]'); } catch { return []; } });
  const [openExtended, setOpenExtended] = useState(null);

  function toggle(i) {
    const updated = checked.includes(i) ? checked.filter(c => c !== i) : [...checked, i];
    setChecked(updated);
    localStorage.setItem('healthapp_checkup_done', JSON.stringify(updated));
  }

  const doneCount = checked.filter(c => c < BASIC_PACKAGE.length).length;
  const pct = Math.round((doneCount / BASIC_PACKAGE.length) * 100);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eCheckupOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eCheckupOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🏥</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Khám Định Kỳ</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Tầm soát · Phát hiện sớm
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Phát hiện sớm bệnh ở giai đoạn chưa có triệu chứng là một trong những can thiệp y tế hiệu quả nhất. Tỷ lệ sống sót của ung thư phát hiện giai đoạn 1 cao hơn 5–10 lần so với giai đoạn muộn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop" alt="Khám định kỳ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Phát hiện sớm · Điều trị hiệu quả hơn
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-sm text-muted">{b0.age} tuổi · Nên khám định kỳ {b0.age >= 40 ? 'mỗi 6–12 tháng với gói cơ bản và mở rộng phù hợp tuổi.' : 'hàng năm với gói cơ bản.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Gói Khám Cơ Bản Hàng Năm</h2>
          <span className="text-base font-bold" style={{ color: COLOR }}>{doneCount}/{BASIC_PACKAGE.length}</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COLOR }} />
        </div>
        <div className="space-y-2">
          {BASIC_PACKAGE.map((item, i) => (
            <button key={i} onClick={() => toggle(i)} className="w-full flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left hover:border-lime-500/30 transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked.includes(i) ? '' : ''}`}
                style={checked.includes(i) ? { background: COLOR, borderColor: COLOR } : { borderColor: 'var(--border)' }}>
                {checked.includes(i) && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <div className="flex-1">
                <span className={`text-base ${checked.includes(i) ? 'line-through text-muted' : 'text-text'}`}>{item.item}</span>
              </div>
              <span className="text-sm text-muted shrink-0">{item.freq}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-muted mt-3">Nhấn để đánh dấu đã hoàn thành. Dữ liệu lưu trong thiết bị.</p>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Gói Mở Rộng Theo Nguy Cơ</h2>
        <p className="text-muted text-base mb-6">Trao đổi với bác sĩ về gói khám phù hợp với hồ sơ nguy cơ cá nhân của bạn.</p>
        <div className="space-y-3">
          {EXTENDED_PACKAGES.map((pkg, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenExtended(openExtended === i ? null : i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-2xl">{pkg.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-base text-text">{pkg.title}</div>
                </div>
                <span className="text-muted">{openExtended === i ? '▲' : '▼'}</span>
              </button>
              {openExtended === i && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <p className="text-sm text-muted"><strong style={{ color: pkg.color }}>Áp dụng khi: </strong>{pkg.triggers}</p>
                  <ul className="space-y-1">
                    {pkg.tests.map((t, j) => (
                      <li key={j} className="flex gap-2 text-base text-muted">
                        <span style={{ color: pkg.color }} className="shrink-0">+</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Chuẩn Bị Trước Khi Đi Khám</h3>
          <ul className="space-y-2 text-base text-muted">
            <li>• Nhịn ăn 8–12 tiếng (chỉ uống nước lọc) cho các xét nghiệm máu yêu cầu đói</li>
            <li>• Mang theo hồ sơ bệnh án cũ, toa thuốc đang dùng</li>
            <li>• Liệt kê trước các câu hỏi muốn hỏi bác sĩ</li>
            <li>• Ghi lại kết quả vào hồ sơ cá nhân để theo dõi xu hướng theo năm</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
