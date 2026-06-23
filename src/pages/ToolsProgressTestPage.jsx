import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  {
    week: 0, label: 'Baseline', desc: 'Đo lần đầu tiên trước khi bắt đầu chương trình',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dữ liệu nền tảng — điểm xuất phát của mọi tiến bộ',
    details: [
      'Baseline là lần đo quan trọng nhất trong cả hành trình — đây là "bức ảnh khởi đầu" giúp bạn nhìn lại tiến bộ thực sự sau 12 tuần.',
      'Hãy đo tất cả 8 chỉ số trong một buổi sáng, sau khi ngủ dậy, trước khi ăn uống để đảm bảo tính nhất quán cho các lần đo sau.',
      'Đừng lo nếu kết quả không đẹp — đây không phải bài kiểm tra năng lực, mà là điểm xuất phát. Không có Baseline nào "xấu".',
      'Ghi thêm cảm nhận chủ quan: mức năng lượng, chất lượng giấc ngủ, mức stress trung bình của tuần trước khi bắt đầu.',
      'Chụp ảnh màn hình hoặc in kết quả — bạn sẽ rất vui khi đối chiếu lại sau 12 tuần.',
      'Dùng Baseline để chọn cường độ tập ban đầu: nếu Plank dưới 20 giây, bắt đầu với cường độ nhẹ và tăng dần sau mỗi 2 tuần.',
    ],
    points: [
      { icon: '📅', label: 'Thời điểm đo', note: 'Buổi sáng, sau ngủ dậy, trước ăn' },
      { icon: '📋', label: 'Số chỉ số', note: '8 chỉ số toàn diện' },
      { icon: '🎯', label: 'Mục tiêu', note: 'Xác lập điểm xuất phát chính xác' },
      { icon: '💡', label: 'Lưu ý', note: 'Trung thực 100% — không tô hồng' },
    ],
  },
  {
    week: 4, label: 'Test 4 Tuần', desc: 'Kết quả đầu tiên — cảm giác và chỉ số đã thay đổi chưa?',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '4 tuần đủ cảm nhận sự thay đổi — chưa cần thấy số thay đổi lớn',
    details: [
      'Sau 4 tuần, cơ thể bắt đầu thích nghi với lịch vận động và ăn uống mới — bạn có thể chưa thấy nhiều thay đổi trên cân, nhưng cảm giác cơ thể sẽ rõ hơn.',
      'Tập trung vào chỉ số chức năng: Plank tăng bao nhiêu giây? Sit-to-stand tăng bao nhiêu lần? Đây là bằng chứng thể lực thực sự cải thiện.',
      'Nếu cân nặng chưa thay đổi — hoàn toàn bình thường. Cơ thể đang xây nền tảng bên trong trước khi thay đổi hình dáng bên ngoài.',
      'So sánh từng chỉ số với Baseline: cải thiện 5–10% sau 4 tuần là kết quả xuất sắc và cho thấy bạn đang đi đúng hướng.',
      'Nếu ≥ 5/8 chỉ số không đổi hoặc tệ hơn — đây là tín hiệu cần điều chỉnh: thêm buổi tập, xem lại dinh dưỡng hoặc giấc ngủ.',
      'Ghi lại những gì hoạt động tốt và những gì khó duy trì — thông tin này quý hơn bất kỳ con số nào.',
    ],
    points: [
      { icon: '📈', label: 'Kỳ vọng', note: 'Cảm giác tốt hơn là đủ' },
      { icon: '🔍', label: 'Ưu tiên', note: 'Chỉ số chức năng > cân nặng' },
      { icon: '⚖️', label: 'Đánh giá', note: '3/8 tốt hơn = đúng hướng' },
      { icon: '✏️', label: 'Điều chỉnh', note: 'Điều chỉnh nhẹ nếu cần thiết' },
    ],
  },
  {
    week: 8, label: 'Test 8 Tuần', desc: 'Tiến bộ rõ rệt hơn — điều chỉnh nếu cần',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuần 8 là thời điểm vàng — tiến bộ rõ nhất và sẵn sàng tăng thử thách',
    details: [
      'Đây là mốc hầu hết người thấy kết quả rõ nhất — cơ thể đã vượt qua giai đoạn thích nghi và cải thiện hiệu quả hơn.',
      'Nếu nhất quán từ đầu, các chỉ số chức năng (Plank, Sit-to-stand, đi bộ 6 phút) có thể tăng 20–40% so với Baseline.',
      'Đây là lúc cân nhắc tăng cường độ: thêm trọng lượng, thêm reps, hoặc thêm 1 buổi tập/tuần nếu cơ thể đã thích nghi tốt.',
      'Kiểm tra stress và giấc ngủ — nếu hai chỉ số này xấu đi dù cơ thể tốt hơn, bạn có thể đang overtrain hoặc thiếu thời gian phục hồi.',
      'So sánh 3 mốc: Baseline → T4 → T8. Tốc độ cải thiện có duy trì? Nếu chậm lại, xem lại chất lượng dinh dưỡng và giấc ngủ trước tiên.',
      'Lập kế hoạch cụ thể cho 4 tuần cuối (T8→T12) dựa trên điểm mạnh và điểm yếu vừa phát hiện.',
    ],
    points: [
      { icon: '🚀', label: 'Cơ hội', note: 'Tăng thử thách có kiểm soát' },
      { icon: '📊', label: 'Mục tiêu', note: '+20–40% vs Baseline' },
      { icon: '😴', label: 'Chú ý', note: 'Stress & ngủ không xấu hơn' },
      { icon: '🗓️', label: 'Kế hoạch', note: 'Định hướng rõ 4 tuần cuối' },
    ],
  },
  {
    week: 12, label: 'Test 12 Tuần', desc: 'Tổng kết 1 chu kỳ — lập kế hoạch tiếp theo',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hoàn thành 12 tuần = bạn đã xây dựng được thói quen — điều khó nhất',
    details: [
      'Hoàn thành test T12 đồng nghĩa bạn đã bền vững qua 1 chu kỳ đầy đủ — điều mà phần lớn người không làm được.',
      'So sánh toàn bộ 4 mốc: Baseline → T4 → T8 → T12. Nhìn vào xu hướng tổng thể, không chỉ so T12 với T8.',
      'Tính điểm hoàn thành: đếm bao nhiêu trong 8 chỉ số đã cải thiện so với Baseline. 5/8+ = thành công rõ ràng; 3–4/8 = tiến bộ, cần tinh chỉnh.',
      'Những gì bạn học được về cơ thể trong 12 tuần này quý hơn bất kỳ số liệu nào — bạn đã biết mình phản ứng thế nào với vận động, ăn uống và stress.',
      'Nghỉ 1–2 tuần deload (giảm cường độ hoặc nghỉ ngơi) trước khi bắt đầu chu kỳ mới — cơ thể cần thời gian đồng hóa.',
      'Chu kỳ tiếp: giữ T12 làm Baseline mới và đặt mục tiêu cụ thể hơn cho từng chỉ số dựa trên kinh nghiệm vừa tích lũy.',
    ],
    points: [
      { icon: '🏆', label: 'Thành tích', note: '12 tuần nhất quán = thói quen' },
      { icon: '📝', label: 'Tổng kết', note: 'So sánh đầy đủ 4 mốc' },
      { icon: '🔄', label: 'Chu kỳ mới', note: 'T12 làm Baseline tiếp theo' },
      { icon: '😴', label: 'Recovery', note: '1–2 tuần deload trước khi tái bắt đầu' },
    ],
  },
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

function MilestoneModal({ item, idx, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) onPrev();
      if (e.key === 'ArrowRight' && idx < total - 1) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, idx, total]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)`, color: item.color }}>
            T{item.week}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.label}</h2>
          <p className="font-semibold text-base mb-4" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.desc}</p>
          <div className="rounded-xl border-l-4 px-4 py-3 mb-6" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.07)` }}>
            <p className="text-base font-semibold" style={{ color: item.color }}>✦ {item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => idx > 0 && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx > 0 ? item.color : 'rgba(255,255,255,0.2)', background: idx > 0 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx > 0 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx > 0 ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => idx < total - 1 && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx < total - 1 ? item.color : 'rgba(255,255,255,0.2)', background: idx < total - 1 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx < total - 1 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx < total - 1 ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
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
  const [milestoneModal, setMilestoneModal] = useState(null);

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
            <div key={i}
              onClick={() => setMilestoneModal(i)}
              className="rounded-xl border p-4 text-center cursor-pointer group transition-all hover:bg-white/5"
              style={{ borderColor: milestoneModal === i ? `rgba(${m.rgb},0.45)` : `rgba(${m.rgb},0.2)`, background: `rgba(${m.rgb},0.04)`, transition: 'border-color 0.2s, background 0.2s' }}>
              <div className="text-3xl font-black mb-1" style={{ color: m.color }}>T{m.week}</div>
              <div className="font-bold text-text text-lg mb-1">{m.label}</div>
              <div className="text-sm text-muted mb-2">{m.desc}</div>
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: m.color }}>Chi tiết →</span>
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

      {milestoneModal !== null && (
        <MilestoneModal
          item={MILESTONES[milestoneModal]}
          idx={milestoneModal}
          total={MILESTONES.length}
          onClose={() => setMilestoneModal(null)}
          onPrev={() => setMilestoneModal(i => Math.max(0, i - 1))}
          onNext={() => setMilestoneModal(i => Math.min(MILESTONES.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
