import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-sroutine-orbit-kf';

const ROUTINE_60 = [
  { time: 'Trước ngủ 60 phút', action: 'Ngưng việc nặng, chốt công việc ngày mai', icon: '📋' },
  { time: 'Trước ngủ 50 phút', action: 'Kiểm tra tin nhắn lần cuối, sau đó đặt điện thoại đi', icon: '📱' },
  { time: 'Trước ngủ 45 phút', action: 'Giảm đèn phòng, bật đèn ngủ ấm', icon: '💡' },
  { time: 'Trước ngủ 40 phút', action: 'Tắm ấm hoặc rửa mặt, vệ sinh cá nhân', icon: '🚿' },
  { time: 'Trước ngủ 30 phút', action: 'Giãn cơ nhẹ: cổ vai gáy, lưng, hông (5–10 phút)', icon: '🧘' },
  { time: 'Trước ngủ 20 phút', action: 'Đọc sách giấy hoặc nghe nhạc nhẹ', icon: '📚' },
  { time: 'Trước ngủ 10 phút', action: 'Thở chậm cơ hoành 3–5 phút', icon: '🌬️' },
  { time: 'Lên giường', action: 'Không lướt điện thoại, nhắm mắt thư giãn', icon: '😴' },
];

const ROUTINE_10 = [
  { step: 1, action: 'Tắt màn hình và đặt điện thoại ra xa', duration: '1 phút' },
  { step: 2, action: 'Giãn cổ vai gáy nhẹ (xoay đầu, shoulder roll)', duration: '2 phút' },
  { step: 3, action: 'Child pose + vươn người (kéo căng lưng)', duration: '2 phút' },
  { step: 4, action: 'Thở chậm: hít 4 giây, thở 6 giây × 5–6 vòng', duration: '2 phút' },
  { step: 5, action: 'Viết 1 dòng: "Việc quan trọng nhất ngày mai là..."', duration: '1 phút' },
  { step: 6, action: 'Lên giường, nhắm mắt, tiếp tục thở chậm', duration: '2 phút' },
];

const WHY_ROUTINE = [
  {
    icon: '🧠', label: 'Giảm cortisol',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol và melatonin hoạt động nghịch chiều — cortisol cao thì melatonin không thể tăng dù trời đã tối. Đây là lý do "cố ngủ" càng khiến bạn tỉnh hơn.',
    detail: 'Cortisol là hormone cảnh báo — nó giữ cơ thể trong trạng thái sẵn sàng phản ứng. Não không thể vừa "cảnh giác" vừa "ngủ sâu" cùng lúc. Routine nhẹ nhàng (giãn cơ, thở chậm, đọc sách) kích hoạt hệ phó giao cảm — làm cortisol giảm tự nhiên và mở "cửa" cho melatonin tăng.',
    details: [
      'Trục HPA (hypothalamus–pituitary–adrenal) tiết cortisol khi căng thẳng — cortisol cao vào buổi tối là dấu hiệu cơ thể vẫn ở "chế độ chiến đấu".',
      'Melatonin và cortisol có mối quan hệ nghịch đảo — khi một cái tăng, cái kia giảm. Cortisol cao buổi tối = ức chế tiết melatonin từ tuyến tùng.',
      '"Cố ngủ" tạo ra lo âu (sleep anxiety) → kích hoạt thêm cortisol → càng khó ngủ — đây là vòng xoáy mà nhiều người mất ngủ mắc phải.',
      'Thở chậm (hít 4 giây, thở 6–8 giây) kích hoạt dây thần kinh phế vị (vagus nerve) → giảm nhịp tim → giảm cortisol trong 3–5 phút.',
      'Giãn cơ nhẹ (không tập nặng) làm giảm cortisol nhanh hơn ngồi yên — cơ bắp thư giãn gửi tín hiệu "an toàn" lên não.',
      'Cortisol tự nhiên thấp nhất lúc 0h–2h AM — routine giúp đẩy nhanh quá trình giảm để bạn ngủ sớm hơn thay vì chờ cortisol tự giảm.',
    ],
    points: [
      { icon: '⚖️', label: 'Cortisol ↔ Melatonin', note: 'Nghịch chiều — một cái tăng, cái kia giảm' },
      { icon: '😰', label: 'Sleep anxiety', note: 'Cố ngủ → cortisol tăng → càng khó ngủ hơn' },
      { icon: '🌬️', label: 'Thở 4–6–8 giây', note: 'Vagus nerve → giảm cortisol trong 3–5 phút' },
      { icon: '🧘', label: 'Giãn cơ nhẹ', note: 'Cơ thư giãn → tín hiệu "an toàn" → cortisol giảm' },
    ],
  },
  {
    icon: '🌡️', label: 'Hạ nhiệt độ cơ thể',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tắm ấm 40–42°C trong 10–15 phút trước ngủ 1–2 tiếng giúp vào giấc nhanh hơn 10 phút và tăng N3 (ngủ sâu) — bằng cơ chế giãn mạch máu tỏa nhiệt, làm nhiệt độ lõi cơ thể giảm nhanh.',
    detail: 'Nghe có vẻ ngược — tắm nóng lại giúp ngủ tốt hơn. Cơ chế là: nước nóng làm giãn mạch máu ngoài da → nhiệt tỏa ra ngoài qua da → nhiệt độ lõi cơ thể (core body temperature) giảm nhanh sau khi ra khỏi tắm → não nhận tín hiệu "đã hạ nhiệt" = "đến giờ ngủ".',
    details: [
      'Não cần nhiệt độ lõi cơ thể giảm 1–2°C để kích hoạt N3 (ngủ sâu) — đây là điều kiện sinh lý bắt buộc.',
      'Tắm ấm 40–42°C trong 10–15 phút: mạch máu ngoài da giãn ra, nhiệt tỏa ra qua da tay chân — "xả nhiệt" toàn thân.',
      'Sau khi ra tắm, nhiệt độ lõi giảm nhanh hơn bình thường (vì mạch máu ngoài da vẫn giãn) — tạo ra hiệu ứng "hạ nhiệt nhanh" thuận lợi cho ngủ sâu.',
      'Nghiên cứu University of Texas: tắm ấm 1–2 tiếng trước ngủ giúp vào giấc nhanh hơn 10 phút và tăng chất lượng giấc ngủ tổng thể.',
      'Không có bồn tắm? Ngâm chân ấm 15 phút cũng có hiệu quả tương tự — mạch máu ở bàn chân rất dồi dào, giúp tỏa nhiệt hiệu quả.',
      'Phòng ngủ mát (18–21°C) kết hợp với tắm ấm trước ngủ = kết hợp tối ưu nhất để đẩy nhanh quá trình hạ nhiệt độ lõi.',
    ],
    points: [
      { icon: '🌡️', label: 'Core temp giảm 1–2°C', note: 'Điều kiện bắt buộc để vào N3 (ngủ sâu)' },
      { icon: '🚿', label: 'Tắm 40–42°C, 10–15 phút', note: '1–2h trước ngủ — giãn mạch, tỏa nhiệt' },
      { icon: '🦶', label: 'Ngâm chân ấm', note: 'Thay thế nếu không có bồn tắm — hiệu quả tương tự' },
      { icon: '❄️', label: 'Phòng 18–21°C', note: 'Kết hợp phòng mát + tắm ấm = tối ưu nhất' },
    ],
  },
  {
    icon: '📵', label: 'Cắt kích thích cuối ngày',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dopamine spike từ mạng xã hội tối giữ não trong "chế độ tìm kiếm phần thưởng" — tương tự như ăn đồ ngọt trước ngủ nhưng cho não: kích thích liên tục ngăn não hạ nhiệt và chuyển sang chế độ ngủ.',
    detail: 'Não hiện đại nhận quá nhiều "thức ăn" kích thích mỗi tối — tin tức, mạng xã hội, email công việc, tranh luận. Mỗi thông báo = một đợt cortisol và dopamine nhỏ. Tích lũy cả tối, não vào trạng thái "hyperarousal" — không thể chuyển sang chế độ ngủ dù cơ thể đã mệt. Đây là trạng thái nghịch lý: mệt nhưng không ngủ được.',
    details: [
      'Hyperarousal là trạng thái kích thích thần kinh quá mức — đây là nguyên nhân chính của mất ngủ mãn tính, không phải thiếu melatonin.',
      'Mỗi "dopamine hit" nhỏ (like, comment, tin tức) tạo kỳ vọng cho cái tiếp theo — não ở chế độ "scan liên tục", không thể nghỉ.',
      'Tin tức tiêu cực (chiến tranh, tai nạn, chính trị) kích hoạt amygdala — tạo cortisol ngay lập tức dù bạn đọc nó ở 23h.',
      'Email/tin nhắn công việc buổi tối giữ não trong trạng thái "pending" — một phần não tiếp tục xử lý vấn đề ngay cả khi bạn đã đặt điện thoại xuống.',
      'Routine "đóng ngày" giúp não xác nhận: "Công việc đã xong, không còn gì cần theo dõi" — giảm hyperarousal đáng kể.',
      'Viết ra 3 việc ngày mai trước khi ngủ (brain dump) giải phóng não khỏi nhiệm vụ "nhớ" — giảm mind chatter khi nằm xuống.',
    ],
    points: [
      { icon: '🎰', label: 'Dopamine loop', note: 'Mạng xã hội giữ não trong "chế độ tìm kiếm thưởng"' },
      { icon: '😤', label: 'Hyperarousal', note: 'Mệt nhưng không ngủ được — kích thích quá mức' },
      { icon: '📰', label: 'Tin xấu = cortisol', note: 'Amygdala kích hoạt ngay cả khi đọc lúc 23h' },
      { icon: '✍️', label: 'Brain dump tối', note: 'Ghi ra 3 việc ngày mai — não không cần "nhớ" nữa' },
    ],
  },
  {
    icon: '🎯', label: 'Tạo tín hiệu Pavlov',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 2–3 tuần lặp lại cùng một chuỗi hành động trước ngủ, cơ thể bắt đầu tiết melatonin ngay khi nhận ra bước đầu của routine — không cần ý chí, không cần "cố ngủ".',
    detail: 'Ivan Pavlov cho chó nghe chuông trước khi cho ăn — sau vài tuần, tiếng chuông một mình đủ làm chó tiết nước bọt. Giấc ngủ hoạt động theo cùng cơ chế. Não học bằng liên kết: chuỗi hành động nhất quán trở thành "tín hiệu ngủ" mạnh hơn cả thuốc ngủ nhẹ. Sau 14–21 ngày lặp lại, chỉ cần bắt đầu routine là cơ thể tự chuẩn bị ngủ.',
    details: [
      'Classical conditioning (điều kiện hóa cổ điển) là cơ chế học của não — liên kết hai kích thích để tạo phản xạ tự động.',
      'Sau 14–21 ngày lặp lại cùng thứ tự (đánh răng → tắt đèn → giãn cơ → thở chậm), trình tự đó trở thành "trigger" ngủ tự động.',
      'Tính nhất quán quan trọng hơn độ dài routine — 10 phút mỗi đêm hiệu quả hơn 45 phút 2 lần/tuần.',
      'Mỗi lần bỏ routine làm yếu liên kết conditioning — không cần hoàn hảo, nhưng phải nhất quán ≥ 5/7 ngày.',
      'Giường chỉ dùng để ngủ (không làm việc, không xem phim trên giường) tăng cường "giường = ngủ" — loại stimulus conditioning mạnh nhất.',
      'Sau khi routine đã được conditioning, bạn sẽ tự động buồn ngủ khi bắt đầu — ý chí không còn là yếu tố quyết định nữa.',
    ],
    points: [
      { icon: '🔔', label: 'Classical conditioning', note: 'Não học liên kết: routine → buồn ngủ tự động' },
      { icon: '📅', label: '14–21 ngày', note: 'Thời gian để conditioning hình thành ổn định' },
      { icon: '🔄', label: 'Nhất quán > hoàn hảo', note: '5/7 đêm đủ để duy trì — không cần tuyệt đối' },
      { icon: '🛏️', label: 'Giường = chỉ ngủ', note: 'Stimulus control mạnh nhất để tăng conditioning' },
    ],
  },
];

const STRETCH_EXERCISES = [
  { name: 'Chin tuck', reps: '10 lần × 2s giữ', muscles: 'Cổ trước', icon: '🦴' },
  { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', muscles: 'Vai, cổ', icon: '💫' },
  { name: 'Thoracic twist', reps: '8 lần mỗi bên', muscles: 'Lưng trên', icon: '🔄' },
  { name: 'Child pose', reps: '1–2 phút giữ', muscles: 'Lưng dưới, hông', icon: '🧘' },
  { name: 'Hip flexor stretch', reps: '1 phút mỗi bên', muscles: 'Gấp hông, đùi trước', icon: '🦵' },
  { name: 'Legs up the wall', reps: '2–5 phút', muscles: 'Giảm sưng chân, thư giãn', icon: '🦶' },
];

function WhyRoutineModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);
  const { color, rgb } = item;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2" style={{ color }}>{item.label}</h2>
          <div className="rounded-xl p-3 mb-5 text-sm font-semibold" style={{ background: `rgba(${rgb},0.1)`, color, border: `1px solid rgba(${rgb},0.2)` }}>✦ {item.keyFact}</div>
          <p className="text-muted text-base leading-relaxed mb-5">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {WHY_ROUTINE.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

export default function LifestyleSleepRoutinePage() {
  const [mode, setMode] = useState('60');
  const [routineIdx, setRoutineIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-sr-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cSrSpin { to { --c-sr-angle: 360deg; } }
      .c-sr-ring {
        background: conic-gradient(from var(--c-sr-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cSrSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-teal-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🌙
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Routine Trước Ngủ</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C1 — 10 đến 60 phút · Reset 7 ngày
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Routine trước ngủ giúp chuyển cơ thể từ "chế độ làm việc" sang "chế độ phục hồi". Không cần hoàn hảo — chỉ cần có tín hiệu nhất quán.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-sr-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop"
              alt="Routine trước ngủ" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Giảm màn hình · Giãn cơ · Thở chậm
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why routine */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Cần Routine Trước Ngủ?</h2>
        <p className="text-muted text-lg mb-6">Não cần tín hiệu để chuyển từ "mode tỉnh táo" sang "mode ngủ". Routine là bộ tín hiệu đó.</p>
        <div className="grid gap-3">
          {WHY_ROUTINE.map((item, i) => (
            <div key={i}
              className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.14)` }}
              onClick={() => setRoutineIdx(i)}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg mb-1" style={{ color: item.color }}>{item.label}</div>
                <p className="text-muted text-base leading-relaxed">{item.details[0]}</p>
              </div>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Routine plans */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Routine Mẫu</h2>
        <p className="text-muted text-lg mb-5">Chọn phiên bản phù hợp với lịch trình của bạn.</p>
        <div className="flex gap-2 mb-6">
          {['10', '60'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-lg font-semibold transition-all"
              style={mode === m
                ? { background: `rgba(${RGB},0.15)`, color: COLOR, border: `1px solid rgba(${RGB},0.3)` }
                : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
              {m === '10' ? '10 phút rút gọn' : '60 phút đầy đủ'}
            </button>
          ))}
        </div>

        {mode === '10' ? (
          <div className="space-y-3">
            {ROUTINE_10.map((row, i) => (
              <div key={i} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-lg font-bold"
                  style={{ background: COLOR, color: 'black' }}>{row.step}</div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-text">{row.action}</div>
                </div>
                <div className="text-base font-semibold tabular-nums shrink-0" style={{ color: COLOR }}>{row.duration}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {ROUTINE_60.map((row, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
                <span className="text-2xl shrink-0">{row.icon}</span>
                <div className="flex-1">
                  <div className="text-base font-bold tabular-nums mb-1" style={{ color: COLOR }}>{row.time}</div>
                  <div className="text-lg text-text">{row.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* Stretching */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Giãn Cơ Trước Ngủ</h2>
        <p className="text-muted text-lg mb-6">Giãn cơ nhẹ 5–10 phút trước ngủ giảm căng cơ tích lũy, tăng thư giãn và cải thiện chất lượng giấc ngủ.</p>
        <div className="grid gap-3">
          {STRETCH_EXERCISES.map((ex, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <span className="text-3xl shrink-0">{ex.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-lg">{ex.name}</div>
                <div className="text-base text-muted">{ex.muscles}</div>
              </div>
              <div className="text-base font-semibold tabular-nums text-right" style={{ color: COLOR }}>{ex.reps}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Common mistakes */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lỗi Thường Gặp</h2>
        <div className="grid gap-3">
          {[
            { wrong: 'Cố ngủ sớm 2–3 tiếng ngay từ ngày 1', right: 'Kéo giờ ngủ sớm dần 15–30 phút mỗi 2–3 ngày' },
            { wrong: 'Xem phim trên điện thoại "cho đến khi ngủ được"', right: 'Đặt điện thoại ra xa và đọc sách giấy thay thế' },
            { wrong: 'Ngủ bù vào cuối tuần đến trưa', right: 'Dậy không quá 1 tiếng sau giờ thường — tránh lệch nhịp' },
            { wrong: 'Uống rượu để "dễ ngủ hơn"', right: 'Rượu giúp vào giấc nhưng phá giấc ngủ sâu và REM' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                <span className="text-lg text-muted">{item.wrong}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5" style={{ color: COLOR }}>✓</span>
                <span className="text-lg text-text">{item.right}</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/sleep" className="text-muted hover:text-teal-400 transition-colors text-lg">← Khoa Học Giấc Ngủ</Link>
        <Link to="/pillar/c/circadian" className="text-lg font-semibold" style={{ color: COLOR }}>Nhịp Sinh Học →</Link>
      </div>

      {/* ── Why routine modal — outside all RevealBlocks so position:fixed works ── */}
      {routineIdx !== null && (
        <WhyRoutineModal
          item={WHY_ROUTINE[routineIdx]}
          idx={routineIdx}
          onClose={() => setRoutineIdx(null)}
          onPrev={() => setRoutineIdx(i => Math.max(0, i - 1))}
          onNext={() => setRoutineIdx(i => Math.min(WHY_ROUTINE.length - 1, i + 1))}
          hasPrev={routineIdx > 0}
          hasNext={routineIdx < WHY_ROUTINE.length - 1}
        />
      )}
    </div>
  );
}
