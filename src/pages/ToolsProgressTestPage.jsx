import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'f-pt-orbit-kf';
const ORBIT_CLASS = 'f-pt-orbit-ring';
const LS_KEY = 'healthapp_f_test';
const LS_HIST = 'healthapp_f_test_hist';

const TEST_ITEMS = [
  { key: 'weight', label: 'Cân nặng', unit: 'kg', icon: '⚖️', how: 'Cân buổi sáng, sau vệ sinh, trước khi ăn', betterDir: 'Phụ thuộc mục tiêu' },
  { key: 'waist', label: 'Vòng eo', unit: 'cm', icon: '📏', how: 'Đo ngang rốn sau khi thở ra nhẹ, không hít vào', betterDir: 'Giảm là tốt (≤ 80cm nữ, ≤ 90cm nam)' },
  { key: 'sts', label: 'Sit-to-stand 1 phút', unit: 'lần', icon: '🪑', how: 'Đứng lên ngồi xuống từ ghế, không dùng tay đỡ, đếm trong 60 giây', betterDir: 'Tăng là tốt (≥ 20 lần = tốt)' },
  { key: 'plank', label: 'Plank (gối hoặc thường)', unit: 'giây', icon: '💪', how: 'Giữ tư thế plank đến khi không thể nữa, lưng thẳng', betterDir: 'Tăng là tốt (≥ 60 giây = tốt)' },
  { key: 'walk6', label: 'Đi bộ 6 phút', unit: 'm hoặc cảm giác', icon: '🚶', how: 'Đi bộ nhanh nhất có thể trong 6 phút, ghi quãng đường hoặc mức dễ/vừa/khó', betterDir: 'Cảm giác nhẹ hơn hoặc quãng đường xa hơn là tốt' },
  { key: 'sleep', label: 'Giấc ngủ TB', unit: 'giờ/đêm', icon: '😴', how: 'Trung bình 7 ngày qua, ước lượng gần nhất', betterDir: 'Mục tiêu ≥ 7 giờ' },
  { key: 'stress', label: 'Stress tự chấm', unit: '/10', icon: '🌡️', how: 'Mức stress cảm nhận trung bình tuần qua (1 = bình thản, 10 = quá tải)', betterDir: 'Giảm là tốt (≤ 4 = tốt)' },
  { key: 'energy', label: 'Năng lượng tự chấm', unit: '/10', icon: '⚡', how: 'Mức năng lượng cảm nhận trung bình tuần qua (1 = kiệt sức, 10 = tràn đầy)', betterDir: 'Tăng là tốt (≥ 7 = tốt)' },
];

const MILESTONES = [
  { week: 0, label: 'Baseline', desc: 'Đo lần đầu tiên trước khi bắt đầu chương trình' },
  { week: 4, label: 'Test 4 Tuần', desc: 'Kết quả đầu tiên — cảm giác và chỉ số đã thay đổi chưa?' },
  { week: 8, label: 'Test 8 Tuần', desc: 'Tiến bộ rõ rệt hơn — điều chỉnh nếu cần' },
  { week: 12, label: 'Test 12 Tuần', desc: 'Tổng kết 1 chu kỳ — lập kế hoạch tiếp theo' },
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

export default function ToolsProgressTestPage() {
  const [inputs, setInputs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
  });
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [testLabel, setTestLabel] = useState('Baseline');
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-pt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fPtOrbitSpin { to { --f-pt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-pt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fPtOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const setVal = (key, val) => {
    const next = { ...inputs, [key]: val };
    setInputs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const saveTest = () => {
    const entry = { date: testDate, label: testLabel, data: { ...inputs } };
    const next = [entry, ...history.filter(h => h.label !== testLabel)].sort((a, b) => a.label.localeCompare(b.label));
    setHistory(next);
    localStorage.setItem(LS_HIST, JSON.stringify(next));
    alert('Đã lưu kết quả test!');
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>📈</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Bộ Test Tiến Bộ 4 Tuần</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            8 chỉ số · Mỗi 4 tuần · Toàn diện hơn cân nặng
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đo tiến bộ không chỉ bằng cân nặng. 8 chỉ số phản ánh đầy đủ hơn: thể lực, phục hồi, tâm trí và lối sống. Cân bằng và trung thực với chính mình.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop" alt="Progress test" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            đo lường toàn diện · không chỉ là cân nặng
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Milestones */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Lịch Test 12 Tuần</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {MILESTONES.map((m, i) => (
            <div key={i} className="rounded-xl border p-4 text-center" style={{ borderColor: i === 0 ? `rgba(${RGB},0.3)` : 'rgba(255,255,255,0.08)', background: i === 0 ? `rgba(${RGB},0.05)` : 'transparent' }}>
              <div className="text-3xl font-black mb-1" style={{ color: COLOR }}>T{m.week}</div>
              <div className="font-bold text-text text-lg mb-1">{m.label}</div>
              <div className="text-base text-muted">{m.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Test form */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Nhập Kết Quả Test</h2>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-base text-muted block mb-1">Ngày test</label>
              <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-base text-muted block mb-1">Giai đoạn</label>
              <select value={testLabel} onChange={e => setTestLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-surface text-lg text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }}>
                {MILESTONES.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {TEST_ITEMS.map((item, i) => (
              <div key={item.key} className="rounded-xl border border-border overflow-hidden">
                <button onClick={() => setOpenItem(openItem === i ? null : i)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left">
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-lg font-medium text-text">{item.label}</div>
                    <div className="text-base text-muted">{inputs[item.key] ? `${inputs[item.key]} ${item.unit}` : 'Chưa nhập'}</div>
                  </div>
                  <span className="text-muted text-lg">{openItem === i ? '▲' : '▼'}</span>
                </button>
                {openItem === i && (
                  <div className="px-3 pb-3 border-t border-border pt-2">
                    <p className="text-base text-muted mb-2">📋 {item.how}</p>
                    <p className="text-base mb-2" style={{ color: COLOR }}>📊 {item.betterDir}</p>
                    <input type="text" value={inputs[item.key] ?? ''} onChange={e => setVal(item.key, e.target.value)}
                      placeholder={`Nhập ${item.unit}`} className="w-full px-3 py-2 rounded-lg border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                      style={{ borderColor: `rgba(${RGB},0.3)` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={saveTest} className="w-full py-3 rounded-xl font-bold text-lg text-white" style={{ background: COLOR }}>
            💾 Lưu kết quả {testLabel}
          </button>
        </div>
      </RevealBlock>

      {/* History comparison */}
      {history.length > 0 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>So Sánh Kết Quả</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted font-medium">Chỉ số</th>
                  {history.map(h => <th key={h.label} className="text-center py-2 text-muted font-medium">{h.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {TEST_ITEMS.map(item => (
                  <tr key={item.key} className="border-b border-border/40">
                    <td className="py-2 text-muted flex items-center gap-1">{item.icon} {item.label}</td>
                    {history.map(h => (
                      <td key={h.label} className="py-2 text-center font-medium" style={{ color: h.data[item.key] ? COLOR : '#666' }}>
                        {h.data[item.key] || '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      {/* Note */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>📌 Cách Đọc Kết Quả</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Không so sánh với người khác — chỉ so với chính mình lần trước</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Tiến bộ nhỏ đều ổn — tốt hơn 1% mỗi tuần = 50% tốt hơn sau 1 năm</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Nếu 3/8 chỉ số tốt hơn — đang đi đúng hướng</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Nếu tất cả đứng im — cần thay đổi gì đó trong lịch tập hoặc dinh dưỡng</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
