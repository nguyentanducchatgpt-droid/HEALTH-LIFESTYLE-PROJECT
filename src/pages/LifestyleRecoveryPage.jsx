import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a78bfa';
const RGB = '167,139,250';
const ORBIT_ID = 'c-recovery-orbit-kf';

const RECOVERY_TYPES = [
  {
    type: 'Thụ động (Passive)', icon: '😴', color: '#6366f1', rgb: '99,102,241',
    desc: 'Nằm nghỉ, ngủ, không làm gì. Cần thiết khi kiệt sức hoàn toàn hoặc bệnh.',
    best: 'Khi đau cấp, sốt, bệnh nặng, kiệt sức hoàn toàn',
    title: 'Phục Hồi Thụ Động — Khi Nào Cần Nằm Yên',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phục hồi thụ động bị hiểu lầm nhiều nhất — nhiều người hoặc dùng quá nhiều (lười biếng hóa ngày nghỉ) hoặc quá ít (cố tập dù ốm). Thụ động đúng nghĩa chỉ cần thiết trong 3 trường hợp cụ thể: đau cấp (24–72h đầu), bệnh sốt và kiệt sức hệ thần kinh trung ương hoàn toàn. Phần còn lại, active recovery thường tốt hơn.',
    detail: 'Nghỉ hoàn toàn là công cụ, không phải mặc định. Biết khi nào cần nằm yên và khi nào cần vận động nhẹ là kỹ năng quan trọng — dùng sai cả hai đều làm chậm phục hồi.',
    details: [
      'Đau cấp 24–72h đầu: viêm cấp tính cần giảm tải hoàn toàn. RICE protocol (Rest, Ice, Compression, Elevation) áp dụng trong giai đoạn này. Sau 72h nếu không còn sưng và đau giảm, bắt đầu chuyển sang active recovery nhẹ.',
      'Bệnh sốt: khi sốt >38°C, hệ thống miễn dịch đang làm việc tối đa. Tập luyện lúc này tranh giành nguồn năng lượng với hệ miễn dịch và có thể kéo dài thời gian bệnh. Nguyên tắc "neck rule": triệu chứng trên cổ (sổ mũi, đau họng) có thể tập nhẹ; dưới cổ (sốt, mệt toàn thân) — nghỉ hoàn toàn.',
      'Kiệt sức hệ thần kinh trung ương (CNS fatigue): khác với cơ mỏi thông thường. Dấu hiệu: không có động lực tập, không cải thiện sau giấc ngủ bình thường, tâm trạng thấp, tim đập nhanh hơn khi nghỉ. CNS fatigue cần 48–72h nghỉ thực sự, không chỉ ngủ thêm.',
      'Khác với "lười": cảm thấy "không muốn tập" thông thường không phải CNS fatigue. Cách phân biệt: nếu sau 10 phút khởi động bạn cảm thấy muốn tiếp tục — đó là inertia, không phải fatigue thực sự. Nếu vẫn kiệt sức sau khởi động — ngừng lại.',
      'Giấc ngủ là core của passive recovery: cơ thể tiết GH (Growth Hormone) tối đa trong giai đoạn deep sleep (N3) — cơ bắp và mô được sửa chữa khi ngủ, không phải khi nghỉ ngồi xem TV. Passive recovery = giấc ngủ chất lượng, không chỉ là không tập.',
      'Khi nào chuyển từ passive sang active: đau giảm xuống 3/10 hoặc ít hơn, không sưng đỏ, có thể di chuyển thoải mái. Ở trường hợp bệnh: không còn sốt + năng lượng trở lại một phần. Transition dần dần — không nhảy thẳng từ nằm vào tập nặng.',
    ],
    points: [
      { icon: '🌡️', label: 'Sốt >38°C → nghỉ hoàn toàn', note: '"Neck rule": triệu chứng dưới cổ = không tập, hệ miễn dịch cần ưu tiên' },
      { icon: '🧠', label: 'CNS fatigue khác cơ mỏi', note: 'Tim đập nhanh khi nghỉ + không cải thiện sau ngủ = nghỉ 48–72h thực sự' },
      { icon: '💤', label: 'Giấc ngủ = core recovery', note: 'GH tiết tối đa trong deep sleep — nằm xem TV không phải passive recovery' },
      { icon: '⏰', label: 'Đau cấp: 24–72h RICE', note: 'Sau 72h đau giảm, chuyển sang active recovery — không kéo dài passive' },
    ],
  },
  {
    type: 'Chủ động (Active)', icon: '🚶', color: '#10b981', rgb: '16,185,129',
    desc: 'Vận động nhẹ giúp tăng lưu thông máu, giảm DOMS và đẩy nhanh phục hồi.',
    best: 'Ngày sau tập nặng, cuối tuần, ngày không tập',
    title: 'Phục Hồi Chủ Động — Vận Động Để Hồi Phục Nhanh Hơn',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active recovery (vận động Zone 1–2, nhịp tim <130) thực sự đẩy nhanh phục hồi hơn nghỉ hoàn toàn cho hầu hết trường hợp. Cơ chế: tăng lưu thông máu đưa oxy và dưỡng chất đến cơ đang phục hồi, đẩy nhanh loại bỏ lactate và chất thải chuyển hóa. Nghiên cứu cho thấy giảm DOMS 20–30% so với nghỉ hoàn toàn.',
    detail: 'Active recovery là "ngày tập nhẹ" — không phải ngày nghỉ có thêm vài bài tập. Cường độ phải đủ thấp để không tạo thêm stress cơ bắp. Tiêu chí đơn giản: bạn phải có thể nói chuyện thoải mái trong suốt buổi tập.',
    details: [
      'Zone 1–2 là cường độ đúng: Zone 1 (<60% max HR ~110–120 bpm) và Zone 2 (60–70% max HR ~120–140 bpm cho người 30 tuổi). Đây là vùng cơ thể dùng chủ yếu fat làm nhiên liệu, không tạo thêm stress tập luyện đáng kể và tăng lưu thông máu nhiều nhất.',
      'DOMS (Delayed Onset Muscle Soreness): đau cơ 24–72h sau tập nặng do micro-tears cơ và phản ứng viêm nhẹ. Đây là quá trình bình thường và cần thiết để cơ to hơn. Active recovery giảm đau DOMS không phải bằng cách ức chế viêm mà bằng cách tăng lưu thông máu đến vùng đang phục hồi.',
      'Lactate clearance: tập cường độ cao tạo ra lactate tích lũy. Active recovery Zone 1–2 hiệu quả nhất để xử lý lactate — tốt hơn nghỉ hoàn toàn vì cơ bắp vẫn đang dùng lactate như nhiên liệu khi hoạt động nhẹ. Đây là lý do vận động viên chuyên nghiệp không ngồi yên sau thi đấu.',
      'Hoạt động phù hợp: đi bộ nhẹ (20–30 phút), đạp xe nhẹ nhàng (20–25 phút, resistance thấp), bơi nhẹ (không sprint), yoga nhẹ, stretching + mobility. Không phù hợp: HIIT, lifting nặng, chạy bộ nhanh.',
      'Tần suất: 1–2 ngày active recovery/tuần cho người tập 4–5 lần/tuần. Người mới tập: 2–3 ngày active recovery/tuần. Người tập ít (2–3 lần/tuần): không cần active recovery riêng — các ngày không tập đã là active recovery tự nhiên nếu có NEAT bình thường.',
      'Tâm lý active recovery: nhiều người cảm thấy "tội lỗi" khi không tập nặng. Hiểu rằng active recovery là một phần của training cycle giúp bỏ tâm lý này. Tập nặng mà không có recovery là "building without consolidating" — cơ bắp và hệ thần kinh cần thời gian thích nghi.',
    ],
    points: [
      { icon: '🩸', label: 'Tăng lưu thông máu đến cơ', note: 'Oxy + dưỡng chất đến vùng phục hồi — đẩy lactate và chất thải ra nhanh hơn' },
      { icon: '😮‍💨', label: 'DOMS giảm 20–30%', note: 'Active recovery rút ngắn đau cơ sau tập so với nghỉ hoàn toàn' },
      { icon: '💬', label: 'Talk test = cường độ đúng', note: 'Nói chuyện thoải mái trong suốt buổi = Zone 1–2, không tạo thêm stress' },
      { icon: '🏊', label: 'Đi bộ / đạp xe / bơi nhẹ', note: 'Low impact, low resistance — không phải HIIT hay lifting nhẹ hơn bình thường' },
    ],
  },
  {
    type: 'Phục hồi theo vùng', icon: '🎯', color: '#0ea5e9', rgb: '14,165,233',
    desc: 'Tập trung giãn cơ và bài tập nhẹ cho vùng đau mỏi cụ thể.',
    best: 'Đau cổ vai gáy, lưng dưới, gối mãn tính',
    title: 'Phục Hồi Theo Vùng — Điều Trị Có Địa Chỉ',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phục hồi theo vùng khác với stretch toàn thân ở chỗ có "địa chỉ" cụ thể — nhắm vào cơ chế gốc của từng vùng đau, không chỉ giãn cơ bề mặt. Đau cổ vai gáy cần counteract pattern gù + vai đổ về trước. Lưng dưới cần giải phóng hip flexor và tăng cường deep core. Gối cần quad/hamstring balance và hip stability.',
    detail: 'Đau mãn tính thường không do "cơ yếu" hay "cơ căng" đơn thuần — mà do imbalance: một nhóm cơ co cụm (tight) kéo xương lệch, nhóm đối lập bị ức chế (weak). Phục hồi theo vùng phải giải quyết cả hai phía: giãn nhóm tight và kích hoạt nhóm weak.',
    details: [
      'Cổ vai gáy (pattern gù): cơ ngực (pectoralis) và cơ thang trên (upper trapezius) bị tight. Cơ thang giữa/dưới và rhomboids bị weak. Điều trị: giãn ngực (doorway stretch), chin tuck để kéo giãn SCM, shoulder roll để tăng lưu thông khớp vai. Không chỉ "xoay cổ" ngẫu nhiên.',
      'Lưng dưới: hip flexors (psoas, iliacus) bị tight do ngồi lâu, kéo xương chậu ra trước (anterior pelvic tilt) → lưng dưới bị overextend. Core sâu (transversus abdominis) bị weak. Điều trị: hip flexor stretch (lunge) + cat-cow + bird-dog activation. Không phải "đứng thẳng" đơn giản.',
      'Gối: phổ biến nhất là "runner\'s knee" (patellofemoral pain) và IT band syndrome. Nguyên nhân thường là quad dominance (mông và hamstring yếu) và hip stability kém khiến gối đổ vào trong khi chuyển động. Điều trị nhắm vào hip abductor (glute med) và hamstring, không chỉ foam roll quanh gối.',
      'Vai (impingement): vai đổ về trước + nội xoay vai → gân rotator cuff bị kẹp trong không gian dưới mỏm cùng vai. Điều trị: ngoại xoay vai (external rotation với band), retraction bả vai (squeeze shoulder blades), giãn cơ ngực. Không tập overhead nặng cho đến khi giải quyết gốc rễ.',
      'Foam rolling vai trò: dùng foam roller để tăng lưu thông trước khi stretch (tác dụng myofascial release). Nhưng foam rolling không thay thế việc kéo giãn và kích hoạt cơ yếu. Thứ tự: foam roll → giãn nhóm tight → kích hoạt nhóm weak. Ba bước, không chỉ 1.',
      'Khi nào cần chuyên gia: đau không cải thiện sau 4–6 tuần tự xử lý, đau có hướng phóng xuống tay/chân (có thể là dây thần kinh bị chèn), đau kèm tê bì hoặc mất lực cơ đột ngột — cần đến physiotherapist hoặc bác sĩ thể thao, không tự xử lý tiếp.',
    ],
    points: [
      { icon: '⚖️', label: 'Tight vs Weak — cả hai phía', note: 'Giãn nhóm tight + kích hoạt nhóm weak — không chỉ stretch bề mặt' },
      { icon: '🦴', label: 'Cổ vai: counteract gù', note: 'Giãn pectoralis + kích hoạt rhomboids — pattern gù phải sửa từ gốc' },
      { icon: '🦵', label: 'Lưng dưới: hip flexor + deep core', note: 'Hip flexors tight → pelvis tilt → lưng bị overextend. Psoas stretch + bird-dog' },
      { icon: '🏥', label: 'Tê bì hoặc mất lực → gặp chuyên gia', note: 'Không tự xử lý khi có dấu hiệu thần kinh — physiotherapist hoặc bác sĩ thể thao' },
    ],
  },
];

const ROUTINE_10 = [
  { name: 'Thở cơ hoành', duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng' },
  { name: 'Shoulder roll', duration: '1 phút', note: '10 vòng trước + 10 vòng sau' },
  { name: 'Thoracic twist', duration: '1 phút', note: '8 lần mỗi bên' },
  { name: 'Hip flexor stretch', duration: '1 phút × 2', note: 'Giữ 30–45s mỗi bên' },
  { name: 'Hamstring stretch', duration: '1 phút × 2', note: 'Ngồi chân thẳng hoặc đứng cúi' },
  { name: 'Child pose + thở chậm', duration: '2 phút', note: 'Thở vào 4s, ra 6s' },
  { name: 'Đi bộ nhẹ', duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng, bình thường hóa' },
];

const ZONE_FIXES = [
  { zone: 'Cổ vai gáy', icon: '🦴', color: '#14b8a6', rgb: '20,184,166',
    cause: 'Ngồi gù, nhìn màn hình liên tục, vai xoáy vào trong',
    exercises: [
      { name: 'Chin tuck', reps: '10 lần × 2s giữ', why: 'Phục hồi đường cong cổ tự nhiên' },
      { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', why: 'Giải phóng căng cơ vai' },
      { name: 'Doorway stretch', reps: '30s × 2 lần', why: 'Mở ngực, giảm gù lưng' },
      { name: 'Scapular squeeze', reps: '15 lần × 2s giữ', why: 'Kích hoạt cơ lưng giữa yếu' },
      { name: 'Thoracic twist ngồi', reps: '8 lần mỗi bên', why: 'Cải thiện xoay lưng ngực' },
    ]
  },
  { zone: 'Lưng dưới', icon: '🫀', color: '#06b6d4', rgb: '6,182,212',
    cause: 'Ngồi lâu, cơ hông gấp căng, cơ bụng yếu',
    exercises: [
      { name: 'Dead bug', reps: '10 lần mỗi bên', why: 'Kích hoạt cơ bụng sâu an toàn' },
      { name: 'Bird-dog', reps: '10 lần mỗi bên', why: 'Ổn định lưng + kích hoạt glute' },
      { name: 'Glute bridge', reps: '15 lần × 2s giữ', why: 'Tăng cường glute giảm tải lưng' },
      { name: 'Child pose', reps: '1–2 phút', why: 'Giải phóng căng lưng dưới' },
      { name: 'Hip flexor stretch', reps: '45s mỗi bên', why: 'Giải phóng co cứng hông gấp' },
    ]
  },
  { zone: 'Gối', icon: '🦵', color: '#a78bfa', rgb: '167,139,250',
    cause: 'Yếu glute + quad, overuse, tư thế valgus',
    exercises: [
      { name: 'Sit-to-stand chậm', reps: '10 lần, kiểm soát', why: 'Tăng sức mạnh quad + glute an toàn' },
      { name: 'Glute bridge một chân', reps: '8–10 lần mỗi bên', why: 'Cân bằng sức mạnh 2 bên' },
      { name: 'Calf raise', reps: '15–20 lần', why: 'Hỗ trợ bơm máu về tim' },
      { name: 'Terminal knee extension', reps: '15 lần', why: 'Kích hoạt VMO — cơ bảo vệ gối' },
      { name: 'Hamstring stretch nhẹ', reps: '30s mỗi bên', why: 'Giảm lực kéo sau gối' },
    ]
  },
];

const ACTIVE_RECOVERY_BY_GOAL = [
  { goal: 'Giảm mỡ', activities: 'Đi bộ nhẹ 20–30 phút, mobility 10 phút, giãn cơ tối', note: 'Tránh tập nặng ngày phục hồi' },
  { goal: 'Tăng cơ', activities: 'Đi bộ 15–20 phút, stretching, foam rolling nhẹ', note: 'Ngủ đủ 7–9h là ưu tiên số 1' },
  { goal: 'Sức bền', activities: 'Đạp/đi bộ/bơi Zone 1–2 (nhịp tim dưới 130)', note: 'Active recovery giảm lactate tốt hơn nghỉ hoàn toàn' },
  { goal: 'Đau mỏi mãn tính', activities: 'Mobility nhẹ cho vùng đau, thở chậm, đi bộ ngắn', note: 'Vận động nhẹ thường tốt hơn nghỉ ngơi hoàn toàn' },
  { goal: 'Stress cao', activities: 'Đi bộ ngoài trời, thở cơ hoành, giãn cơ tối', note: 'Thiên nhiên + vận động nhẹ = double effect giảm cortisol' },
];

function RecoveryModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
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
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.title}</h2>
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
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

export default function LifestyleRecoveryPage() {
  const [openZone, setOpenZone] = useState(null);
  const [recoveryTypeIdx, setRecoveryTypeIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-rec-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cRecSpin { to { --c-rec-angle: 360deg; } }
      .c-rec-ring {
        background: conic-gradient(from var(--c-rec-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cRecSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-violet-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🔄
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Phục Hồi Chủ Động</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C4 — Active Recovery · 3 vùng đau mỏi
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Ngày phục hồi không phải ngày bỏ cuộc. Ngày phục hồi là ngày chương trình giúp bạn bền hơn, tiến xa hơn.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-rec-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop"
              alt="Phục hồi" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Mobility · Giãn cơ · Thở chậm
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Recovery types */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Loại Phục Hồi</h2>
        <p className="text-muted text-lg mb-6">Click vào từng loại để hiểu cơ chế và khi nào dùng đúng.</p>
        <div className="grid gap-4">
          {RECOVERY_TYPES.map((r, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ borderColor: `rgba(${r.rgb},0.2)`, border: `1px solid rgba(${r.rgb},0.2)`, background: `rgba(${r.rgb},0.06)` }}
              onClick={() => setRecoveryTypeIdx(i)}>
              <span className="text-3xl shrink-0">{r.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-text text-base">{r.type}</div>
                <p className="text-muted text-sm mt-0.5">{r.desc}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: r.color }}>Dùng khi: {r.best}</p>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: r.color, background: `rgba(${r.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 10-min routine */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Routine Phục Hồi 10 Phút</h2>
        <p className="text-muted text-lg mb-6">Routine mẫu cho ngày sau tập nặng hoặc ngày cảm thấy căng cơ.</p>
        <div className="space-y-2">
          {ROUTINE_10.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <span className="text-base font-bold tabular-nums w-20 shrink-0" style={{ color: COLOR }}>{r.duration}</span>
              <div>
                <div className="text-lg font-semibold text-text">{r.name}</div>
                <div className="text-base text-muted">{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Zone fixes */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phục Hồi Theo Vùng Đau Mỏi</h2>
        <p className="text-muted text-lg mb-6">Chọn vùng đang đau mỏi để xem bài tập phù hợp.</p>
        <div className="space-y-3">
          {ZONE_FIXES.map((z, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: `rgba(${RGB},0.15)` }}>
              <button onClick={() => setOpenZone(openZone === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left" style={{ background: `rgba(${RGB},0.06)` }}>
                <span className="flex items-center gap-3">
                  <span className="text-3xl">{z.icon}</span>
                  <div>
                    <div className="font-bold text-text">{z.zone}</div>
                    <div className="text-base text-muted">{z.cause}</div>
                  </div>
                </span>
                <span style={{ color: COLOR }}>{openZone === i ? '▲' : '▼'}</span>
              </button>
              {openZone === i && (
                <div className="p-4 space-y-3">
                  {z.exercises.map((ex, j) => (
                    <div key={j} className="flex justify-between items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: `rgba(${z.rgb},0.1)` }}>
                      <div>
                        <div className="text-lg font-semibold text-text">{ex.name}</div>
                        <div className="text-base text-muted">{ex.why}</div>
                      </div>
                      <span className="text-base font-semibold tabular-nums shrink-0" style={{ color: z.color }}>{ex.reps}</span>
                    </div>
                  ))}
                  <p className="text-base text-muted pt-1">⚠️ Dừng ngay nếu cảm thấy đau nhói, tê lan hoặc yếu chân tay.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Active recovery by goal */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Active Recovery Theo Mục Tiêu</h2>
        <div className="space-y-3">
          {ACTIVE_RECOVERY_BY_GOAL.map((g, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text text-lg" style={{ color: COLOR }}>{g.goal}</span>
              </div>
              <p className="text-lg text-muted mb-1">{g.activities}</p>
              <p className="text-base text-muted italic">{g.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sample recovery day */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Ngày Phục Hồi Mẫu</h2>
        <p className="text-muted text-lg mb-6">Một ngày phục hồi không có nghĩa là nằm im cả ngày.</p>
        <div className="space-y-3">
          {[
            { time: 'Sáng', action: 'Ánh sáng + đi bộ nhẹ 10 phút' },
            { time: 'Trưa', action: 'Đi bộ 5 phút sau ăn' },
            { time: 'Chiều', action: 'Mobility 10 phút (vùng hay đau mỏi)' },
            { time: 'Tối', action: 'Giãn cơ nhẹ + thở chậm 5 phút' },
            { time: 'Đêm', action: 'Ngủ sớm hơn 30 phút so với ngày thường' },
          ].map((row, i) => (
            <div key={i} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)` }}>
              <span className="w-14 text-base font-bold shrink-0" style={{ color: COLOR }}>{row.time}</span>
              <span className="text-lg text-muted">{row.action}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/neat" className="text-muted hover:text-violet-400 transition-colors text-lg">← NEAT</Link>
        <Link to="/pillar/c/deload" className="text-lg font-semibold" style={{ color: COLOR }}>Deload →</Link>
      </div>

      {/* ── Recovery types modal — outside all RevealBlocks ── */}
      {recoveryTypeIdx !== null && (
        <RecoveryModal
          item={RECOVERY_TYPES[recoveryTypeIdx]}
          idx={recoveryTypeIdx}
          total={RECOVERY_TYPES.length}
          onClose={() => setRecoveryTypeIdx(null)}
          onPrev={() => setRecoveryTypeIdx(i => Math.max(0, i - 1))}
          onNext={() => setRecoveryTypeIdx(i => Math.min(RECOVERY_TYPES.length - 1, i + 1))}
          hasPrev={recoveryTypeIdx > 0}
          hasNext={recoveryTypeIdx < RECOVERY_TYPES.length - 1}
        />
      )}
    </div>
  );
}
