import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#8b5cf6';
const RGB = '139,92,246';
const ORBIT_ID = 'd-stress-orbit-kf';
const ORBIT_PROP = '--d-stress-angle';
const ORBIT_CLASS = 'd-stress-orbit-ring';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const LAYERS = [
  { icon: '💪', title: 'Tầng Cơ Thể', color: '#f97316', signs: ['Tim đập nhanh, hồi hộp', 'Căng cổ vai gáy', 'Thở nông, thở nhanh', 'Đau đầu, khó ngủ', 'Mệt mỏi không rõ nguyên nhân'] },
  { icon: '😤', title: 'Tầng Cảm Xúc', color: '#ec4899', signs: ['Dễ cáu bẳn, mất kiên nhẫn', 'Lo lắng, bất an', 'Buồn bực, chán nản', 'Cảm giác quá tải', 'Khó tập trung, đãng trí'] },
  { icon: '🔄', title: 'Tầng Hành Vi', color: '#6366f1', signs: ['Ăn vặt nhiều hơn', 'Lướt điện thoại vô thức', 'Trì hoãn việc quan trọng', 'Bỏ tập, bỏ thói quen', 'Thức khuya, ngủ nướng'] },
];

const LOOPS = [
  {
    title: 'Vòng lặp công việc',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Deadline gấp, sếp hối' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Không xong được đâu"' },
      { icon: '😟', label: 'Cảm xúc', text: 'Panic, tê liệt' },
      { icon: '📱', label: 'Hành vi', text: 'Trì hoãn, làm việc khác' },
      { icon: '💢', label: 'Hậu quả', text: 'Deadline gần hơn, panic tăng' },
    ],
    breakpoint: 'Thở 4 vòng → viết "việc nhỏ tiếp theo là..."',
  },
  {
    title: 'Vòng lặp mạng xã hội',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Buồn chán, rảnh rỗi' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Xem 5 phút thôi"' },
      { icon: '😟', label: 'Cảm xúc', text: 'So sánh, tự ti' },
      { icon: '📱', label: 'Hành vi', text: 'Cuộn mãi, 1 giờ trôi qua' },
      { icon: '💢', label: 'Hậu quả', text: 'Mất thời gian, cảm thấy tệ hơn' },
    ],
    breakpoint: 'Tắt màn hình → đi bộ 5 phút → uống nước',
  },
  {
    title: 'Vòng lặp ăn uống',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Stress, buồn, bắt buộc' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Ăn cho khuây"' },
      { icon: '😟', label: 'Cảm xúc', text: 'An tâm tức thời' },
      { icon: '🍕', label: 'Hành vi', text: 'Ăn vặt, ăn quá nhiều' },
      { icon: '💢', label: 'Hậu quả', text: 'Mặc cảm, ăn thêm để xoa dịu' },
    ],
    breakpoint: 'Dừng 10 giây: "Mình đói hay mệt?" → thở 1 phút',
  },
];

const TECHNIQUES = [
  { icon: '🏷️', title: 'Đặt tên cho suy nghĩ', desc: 'Thay vì "Tôi thất bại rồi" → đổi thành "Tôi đang có suy nghĩ rằng mình thất bại." Tạo khoảng cách giữa bạn và suy nghĩ.', example: '"Mình đang bận tâm về X" thay vì "X là sự thật"' },
  { icon: '🔵', title: 'Vòng tròn kiểm soát', desc: 'Chia lo âu thành 2 nhóm: Tôi kiểm soát được (giờ ngủ, bữa ăn, cách phản ứng) vs Tôi không kiểm soát được (ý kiến người khác, kết quả tuyệt đối). Chỉ hành động với nhóm đầu.', example: 'Viết 2 cột, tập trung hành động vào cột trái' },
  { icon: '🔍', title: 'Tìm bằng chứng', desc: 'Khi có suy nghĩ tiêu cực, hỏi: "Có bằng chứng chắc chắn không? Có cách diễn giải khác không?" Não thường phóng đại mối nguy.', example: '"Mình mắc lỗi" → "Mình mắc lỗi một lần, không có nghĩa mình luôn mắc lỗi"' },
  { icon: '⏸️', title: 'Điểm dừng nhỏ', desc: 'Mục tiêu của Trụ cột D không phải xóa sạch lo âu, mà là chèn một điểm dừng nhỏ vào vòng lặp. Điểm dừng có thể là: thở 1 phút, viết 5 dòng, đi bộ 5 phút, tắt màn hình 10 phút.', example: 'Khi cảm thấy căng: dừng → thở → gọi tên cảm xúc → chọn việc nhỏ tiếp theo' },
];

const STRESS_TYPE_MODALS = [
  {
    icon: '✅', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Stress Tích Cực (Eustress)',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Eustress là nhiên liệu hiệu suất — não và cơ thể được thiết kế để phát huy tốt nhất khi có mức thách thức vừa phải, đủ để kích hoạt nhưng không đủ để làm tê liệt.',
    detail: 'Từ "eu-" (tiếng Hy Lạp: tốt) + stress. Hans Selye (1974) phân loại eustress là loại stress có lợi — kích hoạt norepinephrine, dopamine và cortisol ở mức vừa đủ tạo trạng thái "flow" và hiệu suất đỉnh cao.',
    details: [
      'Đường cong Yerkes-Dodson (1908): hiệu suất tăng theo mức kích thích — nhưng chỉ đến ngưỡng tối ưu. Eustress nằm ở vùng đỉnh của đường cong này, nơi não hoạt động tốt nhất.',
      'Norepinephrine tăng trong eustress giúp tăng tập trung, xử lý thông tin nhanh hơn và củng cố ký ức ngắn hạn — cơ chế tương tự tại sao deadline có thể giúp làm việc hiệu quả hơn.',
      'Cortisol ở mức vừa (eustress) kích thích neuroplasticity — não tạo kết nối mới và học hỏi tốt hơn. Vận động, học kỹ năng mới, thách thức sáng tạo đều gây eustress.',
      'Eustress kéo dài ngắn và có điểm kết thúc rõ ràng — khi thách thức hoàn thành, hệ thần kinh tự reset về baseline. Đây là điểm khác biệt cốt lõi với distress.',
      'Cảm giác "hứng khởi trước thử thách" là dấu hiệu eustress: dopamine được giải phóng khi não nhận ra thách thức có thể vượt qua được — tạo động lực hành động.',
      'Thiếu eustress cũng gây hại: trạng thái hoàn toàn không có thách thức (boredom) làm giảm dopamine, tăng nguy cơ trầm cảm và làm suy giảm nhận thức theo thời gian.',
    ],
    points: [
      { icon: '⚡', label: 'Kích Hoạt Hiệu Suất', note: 'Norepinephrine + dopamine ở mức tối ưu' },
      { icon: '🧠', label: 'Neuroplasticity', note: 'Cortisol vừa đủ → não tạo kết nối mới' },
      { icon: '📈', label: 'Đường Cong Yerkes-Dodson', note: 'Hiệu suất đỉnh tại mức kích thích vừa' },
      { icon: '🏁', label: 'Kết Thúc Rõ Ràng', note: 'Reset về baseline sau khi hoàn thành' },
    ],
  },
  {
    icon: '⚠️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Stress Mãn Tính (Distress)',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Distress không phải về cường độ mà về thời gian — không phải bao nhiêu áp lực mà là kéo dài bao lâu mà không có điểm kết thúc và không được xả.',
    detail: 'Cortisol mãn tính — kéo dài nhiều ngày/tuần — tích lũy tác hại lên não (thu nhỏ hippocampus), miễn dịch (ức chế NK cells), tim mạch và trao đổi chất. Cơ thể không phân biệt được stress công việc và nguy hiểm tính mạng.',
    details: [
      'Hippocampus — vùng não xử lý ký ức và học tập — bị thu nhỏ sau stress mãn tính kéo dài. McEwen (Rockefeller University) ghi nhận điều này qua MRI ở người mắc PTSD và trầm cảm nặng.',
      'HPA axis (Hypothalamic-Pituitary-Adrenal) bị dysregulation: sau stress mãn tính, hệ phản hồi cortisol hoạt động sai — không còn tăng đúng lúc và hạ đúng lúc như ở người khỏe mạnh.',
      'Hệ miễn dịch bị ức chế: cortisol cao mãn tính làm giảm NK cells (natural killer cells) và tăng cytokine gây viêm — giải thích tại sao người stress kéo dài dễ ốm và phục hồi chậm hơn.',
      'Giấc ngủ bị phá vỡ: cortisol cao vào buổi tối ngăn melatonin tiết ra đúng lúc — vòng lặp không ngủ được → stress hơn → càng không ngủ được hình thành và tự duy trì.',
      'Visceral fat (mỡ bụng nội tạng) tăng: cortisol mãn tính kích thích tích trữ mỡ ở vùng bụng — đây là loại mỡ nguy hiểm nhất, liên quan đến bệnh tim và tiểu đường type 2.',
      'Vòng lặp lo âu–thói quen hình thành khi stress mãn tính không được nhận diện: não tìm kiếm "giải pháp tạm thời" (lướt MXH, ăn vặt) → không giải quyết gốc rễ → stress tích lũy thêm.',
    ],
    points: [
      { icon: '🧠', label: 'Hippocampus Thu Nhỏ', note: 'Ảnh hưởng ký ức và học tập' },
      { icon: '🛡️', label: 'Miễn Dịch Suy Giảm', note: 'NK cells giảm, dễ ốm, phục hồi chậm' },
      { icon: '😴', label: 'Giấc Ngủ Vỡ', note: 'Cortisol cao → melatonin không tiết được' },
      { icon: '🔁', label: 'Vòng Lặp Tự Duy Trì', note: 'Không xả → tích lũy → thói quen bù đắp' },
    ],
  },
];

function CardModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, total, idx }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-xl px-4 py-3 mb-5 text-base font-medium leading-relaxed"
            style={{ background: `rgba(${item.rgb},0.1)`, borderLeft: `3px solid ${item.color}`, color: `rgba(${item.rgb},0.9)` }}>
            💡 {item.keyFact}
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>
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
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

export default function MindStressPage() {
  const [openLoop, setOpenLoop] = useState(null);
  const [stressModal, setStressModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dStressOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dStressOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🌪️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Hiểu Stress & Vòng Lặp Lo Âu</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D1 · Nền Tảng</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Stress không xấu. Stress giúp bạn tập trung và hành động. Vấn đề chỉ xảy ra khi stress kéo dài, không được xả và hình thành vòng lặp lo âu–thói quen. Hiểu cơ chế là bước đầu để phá vỡ vòng lặp đó.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop" alt="Stress" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>3 tầng stress · Vòng lặp lo âu · Kỹ thuật phá vỡ</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Good vs bad stress */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Stress Tốt vs Stress Xấu</h2>
        <p className="text-muted text-lg mb-6">Không phải stress nào cũng cần loại bỏ.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="group/card rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}
            onClick={() => setStressModal(0)}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-text">✅ Stress tích cực (Eustress)</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity"
                style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.08)' }}>
                chi tiết →
              </span>
            </div>
            <ul className="space-y-2">
              {['Giúp tập trung cao độ khi cần', 'Thúc đẩy hoàn thành deadline', 'Cảm giác hứng khởi trước thử thách', 'Kéo dài ngắn, kết thúc rõ ràng'].map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span className="text-green-400">→</span>{s}</li>)}
            </ul>
          </div>
          <div className="group/card rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            style={{ borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.05)` }}
            onClick={() => setStressModal(1)}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-text">⚠️ Stress mãn tính (Distress)</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity"
                style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>
                chi tiết →
              </span>
            </div>
            <ul className="space-y-2">
              {['Kéo dài nhiều ngày, không được xả', 'Ảnh hưởng ngủ, ăn, tập luyện', 'Cảm xúc không ổn định', 'Hình thành vòng lặp lo âu–thói quen'].map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span style={{ color: COLOR }}>→</span>{s}</li>)}
            </ul>
          </div>
        </div>
      </RevealBlock>

      {/* 3 layers */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Tầng Của Stress</h2>
        <p className="text-muted text-lg mb-6">Stress biểu hiện ở cả 3 tầng cùng lúc — nhận diện tầng nào đang ảnh hưởng bạn nhiều nhất.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {LAYERS.map(l => (
            <div key={l.title} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-4xl mb-3">{l.icon}</div>
              <div className="text-lg font-bold mb-3" style={{ color: l.color }}>{l.title}</div>
              <ul className="space-y-1">
                {l.signs.map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span style={{ color: l.color }}>·</span>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Anxiety loops */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vòng Lặp Lo Âu – Thói Quen</h2>
        <p className="text-muted text-lg mb-6">Mục tiêu không phải xóa sạch lo âu — mà là chèn một điểm dừng nhỏ vào vòng lặp.</p>
        <div className="space-y-3">
          {LOOPS.map((loop, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpenLoop(openLoop === i ? null : i)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
                <span className="text-lg font-medium text-text flex-1">{loop.title}</span>
                <span className="text-muted text-base">{openLoop === i ? '▲' : '▼'}</span>
              </button>
              {openLoop === i && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {loop.steps.map((s, si) => (
                      <div key={si} className="flex items-center gap-1">
                        <div className="rounded-lg p-2 text-center min-w-[80px]" style={{ background: `rgba(${RGB},0.08)` }}>
                          <div className="text-xl">{s.icon}</div>
                          <div className="text-base font-bold mt-0.5" style={{ color: COLOR }}>{s.label}</div>
                          <div className="text-base text-muted mt-0.5 leading-tight">{s.text}</div>
                        </div>
                        {si < loop.steps.length - 1 && <span className="text-muted text-base">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3 text-base border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
                    🔧 <strong style={{ color: COLOR }}>Điểm dừng:</strong> {loop.breakpoint}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Phá Vòng Lặp</h2>
        <p className="text-muted text-lg mb-6">Công cụ nhận thức giúp tạo khoảng cách giữa bạn và phản ứng tự động.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {TECHNIQUES.map(t => (
            <div key={t.title} className="rounded-2xl border border-border bg-surface p-5 hover:border-violet-500/20 transition-colors">
              <div className="text-3xl mb-3">{t.icon}</div>
              <div className="text-lg font-bold text-text mb-2">{t.title}</div>
              <p className="text-base text-muted leading-relaxed mb-3">{t.desc}</p>
              <div className="rounded-lg p-2 text-base italic text-muted border border-border">💡 {t.example}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Stress levels */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thang Đo Stress 0–10</h2>
        <p className="text-muted text-lg mb-6">Chấm điểm mỗi ngày để nhận diện xu hướng trước khi stress leo thang.</p>
        <div className="space-y-2">
          {[
            { range: '0–2', label: 'Bình thường', desc: 'Cơ thể và tâm trí ổn định. Tiếp tục duy trì.', color: '#10b981' },
            { range: '3–4', label: 'Nhẹ', desc: 'Có áp lực nhưng kiểm soát được. Dùng Reset 2 phút.', color: '#84cc16' },
            { range: '5–6', label: 'Trung bình', desc: 'Ảnh hưởng tập trung. Nên dùng box breathing + journal.', color: '#f59e0b' },
            { range: '7–8', label: 'Cao', desc: 'Căng thẳng rõ ràng. Ưu tiên nghỉ ngơi, giảm kỳ vọng.', color: '#f97316' },
            { range: '9–10', label: 'Nguy hiểm', desc: 'Không tự xử lý được. Hỏi người thân hoặc chuyên gia.', color: '#ef4444' },
          ].map(s => (
            <div key={s.range} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-surface">
              <div className="text-lg font-bold w-12 text-center shrink-0" style={{ color: s.color }}>{s.range}</div>
              <div className="w-16 shrink-0 text-base font-bold" style={{ color: s.color }}>{s.label}</div>
              <div className="text-base text-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Tâm Trí An Nhiên
        </Link>
        <Link to="/pillar/d/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Kỹ Thuật Thở
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {stressModal !== null && (
        <CardModal
          item={STRESS_TYPE_MODALS[stressModal]}
          onClose={() => setStressModal(null)}
          onPrev={() => setStressModal(i => Math.max(0, i - 1))}
          onNext={() => setStressModal(i => Math.min(STRESS_TYPE_MODALS.length - 1, i + 1))}
          hasPrev={stressModal > 0}
          hasNext={stressModal < STRESS_TYPE_MODALS.length - 1}
          total={STRESS_TYPE_MODALS.length}
          idx={stressModal}
        />
      )}
    </div>
  );
}
