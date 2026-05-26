import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#8b5cf6';
const RGB = '139,92,246';
const ORBIT_ID = 'e-lipids-orbit-kf';
const ORBIT_CLASS = 'e-lipids-orbit-ring';
const ORBIT_PROP = '--e-lipids-orbit-angle';

const LIPID_PANEL = [
  {
    name: 'Cholesterol Toàn Phần',
    unit: 'mg/dL',
    levels: [
      { label: 'Tối ưu', range: '< 170', color: '#22c55e' },
      { label: 'Chấp nhận được', range: '170–199', color: '#eab308' },
      { label: 'Cao — Cần theo dõi', range: '200–239', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 240', color: '#ef4444' },
    ],
    desc: 'Tổng lượng cholesterol trong máu. Tự nó không đủ để đánh giá nguy cơ — cần xem cùng với LDL/HDL.',
  },
  {
    name: 'LDL-C (Cholesterol "Xấu")',
    unit: 'mg/dL',
    levels: [
      { label: 'Tối ưu', range: '< 100', color: '#22c55e' },
      { label: 'Gần tối ưu', range: '100–129', color: '#84cc16' },
      { label: 'Cao ranh giới', range: '130–159', color: '#eab308' },
      { label: 'Cao', range: '160–189', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 190', color: '#ef4444' },
    ],
    desc: 'Lipoprotein tỉ trọng thấp — vận chuyển cholesterol đến mô, có thể tích tụ trong thành mạch gây xơ vữa.',
  },
  {
    name: 'HDL-C (Cholesterol "Tốt")',
    unit: 'mg/dL',
    levels: [
      { label: 'Nguy cơ cao (thấp)', range: '< 40 (nam) / < 50 (nữ)', color: '#ef4444' },
      { label: 'Bình thường', range: '40–59', color: '#eab308' },
      { label: 'Bảo vệ tim mạch', range: '≥ 60', color: '#22c55e' },
    ],
    desc: 'Lipoprotein tỉ trọng cao — thu gom cholesterol dư thừa từ mô và đưa về gan để xử lý. HDL càng cao càng tốt.',
  },
  {
    name: 'Triglycerides',
    unit: 'mg/dL',
    levels: [
      { label: 'Bình thường', range: '< 150', color: '#22c55e' },
      { label: 'Cao ranh giới', range: '150–199', color: '#eab308' },
      { label: 'Cao', range: '200–499', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 500', color: '#ef4444' },
    ],
    desc: 'Chất béo trong máu. Cao do ăn nhiều carb tinh chế, đường, rượu, và ít vận động.',
  },
];

const FOOD_HELP = [
  { icon: '🐟', name: 'Cá béo (cá hồi, cá ngừ)', effect: 'Omega-3 → giảm TG, tăng HDL' },
  { icon: '🥑', name: 'Bơ, dầu ô liu', effect: 'Chất béo không bão hòa đơn → giảm LDL' },
  { icon: '🌰', name: 'Các loại hạt (óc chó, hạnh nhân)', effect: 'Omega-3, chất xơ → giảm LDL' },
  { icon: '🫘', name: 'Đậu các loại', effect: 'Chất xơ hòa tan → giảm hấp thu cholesterol' },
  { icon: '🥦', name: 'Rau xanh đậm', effect: 'Chất xơ, sterol thực vật → cải thiện lipid' },
  { icon: '🫐', name: 'Quả mọng (blueberry, dâu tây)', effect: 'Polyphenols → chống oxy hóa LDL' },
];

const FOOD_AVOID = [
  { icon: '🧈', name: 'Bơ động vật, mỡ lợn', reason: 'Chất béo bão hòa → tăng LDL' },
  { icon: '🍟', name: 'Đồ chiên rán, fast food', reason: 'Trans fat → tăng LDL, giảm HDL' },
  { icon: '🍰', name: 'Bánh ngọt, đồ ngọt', reason: 'Đường tinh chế → tăng TG' },
  { icon: '🍺', name: 'Rượu bia', reason: 'Tăng TG, calo rỗng' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-lip-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-lip-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthLipidsPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [openPanel, setOpenPanel] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eLipidsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eLipidsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🩸</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Mỡ Máu</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Bảng lipid máu · Tim mạch
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Rối loạn mỡ máu (dyslipidemia) là yếu tố nguy cơ hàng đầu của bệnh tim mạch và đột quỵ. Hầu hết trường hợp không có triệu chứng — chỉ phát hiện qua xét nghiệm máu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80&auto=format&fit=crop" alt="Mỡ máu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Hiểu bảng lipid máu của bạn
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-xs text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age >= 35 ? 'Nên xét nghiệm bảng lipid máu đầy đủ hàng năm.' : 'Xét nghiệm mỗi 5 năm nếu không có yếu tố nguy cơ.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Bảng Lipid Máu</h2>
        <p className="text-muted text-sm mb-6">Nhấn vào từng chỉ số để xem chi tiết. Xét nghiệm sau nhịn ăn 9–12 tiếng để có kết quả chính xác nhất.</p>
        <div className="space-y-3">
          {LIPID_PANEL.map((panel, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenPanel(openPanel === i ? null : i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
                <div className="font-bold text-sm text-text flex-1">{panel.name}</div>
                <span className="text-xs text-muted">{panel.unit}</span>
                <span className="text-muted ml-2">{openPanel === i ? '▲' : '▼'}</span>
              </button>
              {openPanel === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <p className="text-xs text-muted mb-4">{panel.desc}</p>
                  <div className="space-y-2">
                    {panel.levels.map((l, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                        <span className="text-xs font-bold" style={{ color: l.color }}>{l.label}</span>
                        <span className="text-xs text-muted ml-auto font-mono">{l.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Thực Phẩm Tốt Cho Mỡ Máu</h2>
        <p className="text-muted text-sm mb-5">Chế độ ăn đúng có thể giảm LDL 15–20% trong 6–12 tuần.</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {FOOD_HELP.map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3 hover:border-purple-500/30 transition-colors">
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="font-bold text-sm text-text">{f.name}</div>
                <div className="text-xs text-muted">{f.effect}</div>
              </div>
            </div>
          ))}
        </div>
        <h3 className="font-bold text-text mb-3">Nên Hạn Chế</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {FOOD_AVOID.map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3">
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="font-bold text-sm text-text">{f.name}</div>
                <div className="text-xs text-muted">{f.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text">Tần Suất Xét Nghiệm</h3>
          <div className="text-sm text-muted space-y-2">
            <p>• <strong className="text-text">Người bình thường &lt; 35 tuổi:</strong> Mỗi 5 năm nếu không có yếu tố nguy cơ</p>
            <p>• <strong className="text-text">35–65 tuổi:</strong> Mỗi 1–2 năm</p>
            <p>• <strong className="text-text">Có nguy cơ tim mạch, tiểu đường, hút thuốc:</strong> Hàng năm</p>
            <p>• <strong className="text-text">Đang điều trị mỡ máu:</strong> Mỗi 3–6 tháng để đánh giá đáp ứng thuốc</p>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
