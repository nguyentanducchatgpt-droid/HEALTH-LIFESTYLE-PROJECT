import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f43f5e';
const RGB = '244,63,94';
const ORBIT_ID = 'c-environment-orbit-kf';
const ORBIT_PROP = '--c-env-angle';
const ORBIT_CLASS = 'c-env-orbit-ring';

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

const ENV_ZONES = [
  {
    id: 'morning',
    icon: '🌅',
    title: 'Môi Trường Buổi Sáng',
    subtitle: 'Thiết kế cho sự khởi động',
    color: '#f59e0b',
    items: [
      { icon: '💡', title: 'Ánh sáng ngay khi thức', desc: 'Mở rèm hoặc bật đèn sáng trắng (5000K+) trong 5 phút đầu. Ức chế melatonin, reset đồng hồ sinh học.' },
      { icon: '🌡️', title: 'Nhiệt độ mát', desc: 'Giữ phòng 18–20°C buổi sáng. Nhiệt độ thấp kích hoạt cortisol tích cực, tăng tỉnh táo.' },
      { icon: '📵', title: 'Phone-free 30 phút', desc: 'Để điện thoại ở phòng khác hoặc chế độ DND. Không email, không mạng xã hội — não bộ cần thời gian "warm up".' },
      { icon: '💧', title: 'Nước trên bàn đêm', desc: 'Đặt sẵn ly nước lớn bên giường. Uống ngay khi thức dậy — cơ thể mất 0.5–1L qua đêm.' },
      { icon: '🎵', title: 'Âm nhạc hoặc im lặng', desc: 'Tránh podcast/news ngay từ sáng — chúng kích thích hệ thống xử lý thông tin trước khi não sẵn sàng.' },
    ],
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Môi Trường Làm Việc',
    subtitle: 'Tối ưu cho tập trung & năng suất',
    color: '#0ea5e9',
    items: [
      { icon: '🖥️', title: 'Bàn làm việc ngăn nắp', desc: 'Dọn dẹp bàn trước mỗi phiên tập trung. Môi trường hỗn loạn → não luôn dùng tài nguyên để xử lý thứ không liên quan.' },
      { icon: '🌿', title: 'Cây xanh & thiên nhiên', desc: 'Ít nhất 1 cây nhỏ trên bàn hoặc tầm nhìn ra cây xanh. Giảm stress, tăng sáng tạo theo nghiên cứu.' },
      { icon: '🎧', title: 'Kiểm soát âm thanh', desc: 'Nút tai, headphone noise-cancelling hoặc white noise (mynoise.net). 60–70dB là ngưỡng tối ưu cho sáng tạo.' },
      { icon: '🌡️', title: 'Nhiệt độ 20–22°C', desc: 'Nhiệt độ phòng ảnh hưởng trực tiếp đến năng suất. Quá nóng hoặc quá lạnh đều giảm hiệu suất nhận thức.' },
      { icon: '⏰', title: 'Pomodoro vật lý', desc: 'Đồng hồ đếm ngược (không phải điện thoại). Giúp não "cam kết" với thời gian làm việc hơn timer trên screen.' },
    ],
  },
  {
    id: 'evening',
    icon: '🌙',
    title: 'Môi Trường Buổi Tối',
    subtitle: 'Thiết kế cho phục hồi & giấc ngủ',
    color: '#a855f7',
    items: [
      { icon: '🔅', title: 'Dim light sau 20:00', desc: 'Giảm độ sáng tất cả đèn và màn hình xuống 30–40% sau 8 giờ tối. Kích hoạt sản xuất melatonin tự nhiên.' },
      { icon: '🌡️', title: 'Làm mát phòng ngủ', desc: 'Nhiệt độ phòng ngủ lý tưởng: 16–19°C. Cơ thể cần giảm nhiệt độ lõi 1–2°C để đi vào giấc ngủ sâu.' },
      { icon: '📵', title: 'Blue light filter 21:00', desc: 'Bật Night Shift / f.lux trên tất cả thiết bị. Hoặc tốt hơn — không dùng màn hình sau 21:30.' },
      { icon: '🧴', title: 'Mùi hương thư giãn', desc: 'Lavender, chamomile hoặc sandalwood. Hệ khứu giác kết nối trực tiếp với limbic system — vùng não điều tiết cảm xúc và giấc ngủ.' },
      { icon: '📚', title: 'Sách thay điện thoại', desc: 'Để sách trên giường thay điện thoại. Đọc sách giả tưởng hoặc nhẹ nhàng — không sách phát triển bản thân trước ngủ.' },
    ],
  },
];

const QUICK_WINS = [
  { icon: '🔲', title: 'Cất điện thoại khỏi phòng ngủ', impact: 'Cao', time: '0 phút', cost: 'Miễn phí' },
  { icon: '💡', title: 'Đèn đọc sách warm white', impact: 'Cao', time: '5 phút', cost: '< 200k' },
  { icon: '🌿', title: 'Mua 1 cây trồng chậu nhỏ', impact: 'Trung bình', time: '15 phút', cost: '< 100k' },
  { icon: '🎧', title: 'Nút tai chống ồn', impact: 'Cao', time: '0 phút', cost: '< 50k' },
  { icon: '💧', title: 'Ly nước đặt sẵn bên giường', impact: 'Trung bình', time: '0 phút', cost: 'Miễn phí' },
  { icon: '📦', title: 'Hộp đựng dây cáp, đồ lặt vặt', impact: 'Trung bình', time: '30 phút', cost: '< 100k' },
  { icon: '🌡️', title: 'Máy đo nhiệt độ phòng ngủ', impact: 'Cao', time: '0 phút', cost: '< 200k' },
  { icon: '🔅', title: 'Cài Night Mode tự động 20:00', impact: 'Cao', time: '2 phút', cost: 'Miễn phí' },
];

const IMPACT_COLOR = { 'Cao': '#10b981', 'Trung bình': '#f59e0b' };

const PRINCIPLES = [
  {
    icon: '✅', title: 'Friction Design',
    desc: 'Giảm "ma sát" cho hành vi tốt (đặt thảm tập ngay trước giường), tăng ma sát cho hành vi xấu (cất TV vào tủ).',
    color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Friction Design — Thiết Kế Ma Sát Thay Đổi Hành Vi',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Friction Design (thiết kế ma sát) là nguyên tắc hành vi học đơn giản nhất và mạnh nhất: giảm số bước/effort cần thiết để thực hiện hành vi tốt, tăng số bước cho hành vi xấu. Nghiên cứu của BJ Fogg (Stanford) và James Clear cho thấy thêm chỉ 20 giây vào một hành vi (ví dụ: để điện thoại phòng khác = phải đi lấy) giảm tần suất hành vi đó đến 30–50%. Ngược lại, giảm 20 giây cho hành vi tốt làm tăng tần suất tương tự.',
    detail: 'Friction Design không dựa vào willpower hay motivation — những thứ có hạn và dao động theo ngày. Thay vào đó, nó thay đổi cấu trúc môi trường để hành vi tốt trở thành "con đường ít kháng cự nhất" (path of least resistance). Não bộ luôn chọn con đường dễ nhất — Friction Design hack điều này có lợi.',
    details: [
      'Neuroscience của least effort: não bộ tiến hóa để tiết kiệm năng lượng — mỗi quyết định tiêu thụ glucose và mental bandwidth. Khi một hành vi đòi hỏi nhiều bước, não tự động resist nó (cognitive load quá cao). Friction Design giảm cognitive load của hành vi tốt xuống mức "auto-pilot" — không cần decision-making, chỉ cần một bước đơn giản.',
      'Hai chiều của Friction Design: (1) Giảm ma sát cho hành vi tốt: thảm yoga đặt cạnh giường → thức dậy vấp phải → tập ngay. Sách để trên bàn → thấy → đọc. Rau xanh để ở tầm mắt trong tủ lạnh → mở ra thấy ngay → ăn rau. (2) Tăng ma sát cho hành vi xấu: cất TV vào tủ có khóa → lấy phải mở khóa → bớt xem. Để điện thoại ở phòng khác khi ngủ → phải đi bộ lấy → bớt scroll đêm.',
      'The 2-Minute Rule của James Clear: thiết kế mọi hành vi tốt để có thể bắt đầu trong 2 phút. Không phải "tập gym 1 tiếng" — mà là "đi đến gym (2 phút)". Không phải "thiền 20 phút" — mà là "ngồi xuống đệm thiền (2 phút)". Khi đã bắt đầu, momentum tự nhiên đẩy tiếp. Friction Design = làm cho bước đầu tiên này dễ nhất có thể.',
      'Environment design vs willpower: nghiên cứu của Roy Baumeister cho thấy willpower là resource hữu hạn — cạn dần theo ngày. Người thành công không có willpower mạnh hơn — họ có môi trường tốt hơn, không đặt mình vào tình huống cần dùng willpower. Người ít ăn kẹo không phải vì "kỷ luật" — mà vì không để kẹo ở nhà.',
      'Friction audit: đi qua một ngày của bạn và liệt kê: hành vi tốt nào bạn hay bỏ qua? Có bao nhiêu bước để thực hiện nó? Hành vi xấu nào bạn hay làm dù không muốn? Có bao nhiêu bước? Giảm 1–2 bước cho hành vi tốt và thêm 2–3 bước cho hành vi xấu thường đủ để tạo ra sự thay đổi có ý nghĩa mà không cần motivation.',
      'Stacking Friction Design với identity: Friction Design hoạt động tốt nhất khi kết hợp với identity-based habits (James Clear). "Tôi là người chạy bộ buổi sáng" + giày chạy đặt ngay cửa ra vào = friction thấp + identity reinforcement. Mỗi lần thực hiện hành vi dễ dàng vì friction thấp, bạn đang bầu chọn cho identity của mình — củng cố vòng lặp tích cực.',
    ],
    points: [
      { icon: '⏱️', label: '+20 giây giảm hành vi 30–50%', note: 'Để điện thoại phòng khác = thêm 20 giây = scroll đêm giảm 40%' },
      { icon: '🧠', label: 'Không cần willpower', note: 'Môi trường tốt > kỷ luật — người thành công có môi trường tốt, không phải ý chí mạnh hơn' },
      { icon: '⚡', label: '2-Minute Rule: bắt đầu trong 2 phút', note: 'Thiết kế bước đầu tiên dễ nhất có thể — momentum tự đẩy tiếp' },
      { icon: '🔍', label: 'Friction audit định kỳ', note: 'Liệt kê hành vi tốt/xấu → đếm số bước → giảm/tăng ma sát tương ứng' },
    ],
  },
  {
    icon: '👁️', title: 'Visual Cues',
    desc: 'Những gì bạn thấy → bạn nghĩ đến → bạn làm. Để sách nơi dễ thấy, cất điện thoại khỏi tầm mắt.',
    color: '#f43f5e', rgb: '244,63,94',
    modalTitle: 'Visual Cues — Môi Trường Trực Quan Định Hướng Hành Vi',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Visual cues (tín hiệu thị giác) là trigger mạnh nhất để kích hoạt hành vi — mạnh hơn cả intention và reminder app. Não bộ xử lý thông tin thị giác nhanh hơn bất kỳ giác quan nào khác (11 triệu bits/giây so với 40 bits conscious processing). "Những gì bạn thấy" là môi trường kích hoạt liên tục suốt ngày — thiết kế visual environment đúng = thiết kế hành vi của bạn.',
    detail: 'Environmental psychology cho thấy con người phần lớn hành động theo context và visual cues xung quanh, không phải theo "ý định". Thay đổi những gì bạn nhìn thấy thay đổi những gì bạn làm — không cần self-discipline.',
    details: [
      'Implementation intentions và visual anchors: nghiên cứu của Peter Gollwitzer cho thấy "implementation intentions" (IF-THEN plans) kết hợp với visual cues tăng follow-through đến 91% so với chỉ có intention. "Khi tôi thấy thảm yoga cạnh giường (visual cue), tôi sẽ tập 10 phút ngay" hiệu quả hơn rất nhiều so với "Tôi sẽ tập yoga buổi sáng".',
      'Cue-routine-reward loop: theo Charles Duhigg (The Power of Habit), mọi habit đều có cấu trúc: Cue (tín hiệu) → Routine (hành vi) → Reward (phần thưởng). Visual cues là loại cue mạnh nhất vì não xử lý nó gần như tức thời và tự động. Thiết kế visual cue đúng = thiết kế cue mạnh nhất của habit loop.',
      'Visibility và salience: không phải mọi thứ bạn thấy đều tạo cue như nhau — salience (độ nổi bật) quan trọng. Sách đặt trên giá sách (thấy) khác sách đặt trên gối (salience cao hơn). Rau để ở tầm mắt tủ lạnh khác rau để ở ngăn dưới (salience cao hơn → ăn nhiều hơn 25%). Thiết kế visual cue = tăng salience của hành vi tốt, giảm salience của hành vi xấu.',
      'Out of sight, out of mind: nghiên cứu Cornell "Wansink Kitchen" cho thấy người để kẹo trên bàn bếp ăn trung bình nặng hơn 8–10 lbs so với người để trong tủ kín. Người để điện thoại trên bàn trong meeting nhớ ít hơn 20% nội dung — ngay cả khi điện thoại tắt (chỉ cần nhìn thấy là đủ gây distraction). Visual cue không cần conscious attention để ảnh hưởng hành vi.',
      'Thiết kế visual environment cụ thể: (Hành vi tốt) Đặt sách/kindle trên gối → đọc trước ngủ. Đặt vitamin trên bàn ăn sáng → uống mỗi sáng. Đặt bình nước 2L trên bàn làm việc → uống đủ nước. Đặt giày chạy ở cửa → chạy buổi sáng. (Hành vi xấu) Cất điện thoại vào hộc bàn → ít check. Cất remote TV vào tủ → ít xem. Để snack không healthy trong tủ kín trên cao → ít ăn.',
      'Visual cues và accountability: visual tracking (habit tracker dán tường, whiteboard goals, jar với marble đếm ngày liên tiếp) tạo external accountability thông qua visual cues. Thấy chuỗi ngày không gián đoạn trên tracker → không muốn phá vỡ chuỗi (don\'t break the chain — Jerry Seinfeld method). Visual progress = motivation duy trì hành vi.',
    ],
    points: [
      { icon: '👁️', label: '11 triệu bits/s xử lý thị giác', note: 'Não xử lý visual nhanh nhất — visual cue ảnh hưởng hành vi ngay cả khi không chú ý' },
      { icon: '📊', label: 'Salience: tầm mắt = 25% ăn nhiều hơn', note: 'Rau ở tầm mắt tủ lạnh → ăn nhiều hơn 25% so với để ngăn dưới' },
      { icon: '📱', label: 'Điện thoại trên bàn = nhớ kém 20%', note: 'Chỉ cần THẤY điện thoại (dù tắt) là đủ gây distraction measurable' },
      { icon: '📆', label: 'Visual tracker = don\'t break the chain', note: 'Thấy chuỗi habit days → không muốn phá vỡ → habit duy trì tự nhiên' },
    ],
  },
  {
    icon: '🔄', title: 'Habit Stacking',
    desc: 'Ghép thói quen mới vào môi trường/thói quen cũ. "Sau khi pha cà phê, tôi ngồi thiền 5 phút trên ghế bếp."',
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Habit Stacking — Xây Thói Quen Mới Trên Nền Cũ',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Habit Stacking là kỹ thuật của BJ Fogg (Tiny Habits) và James Clear (Atomic Habits): ghép thói quen mới vào ngay sau/trước một thói quen cũ đã vững chắc. Công thức: "Sau khi [THÓI QUEN CŨ], tôi sẽ [THÓI QUEN MỚI]." Neural pathway của thói quen cũ đã rất mạnh — khi kích hoạt, nó kéo theo thói quen mới, giảm effort cần thiết để bắt đầu xuống gần bằng 0.',
    detail: 'Habit Stacking hoạt động vì nó tận dụng "associative memory" — não bộ liên kết các sự kiện xảy ra cùng nhau. Sau đủ repetitions, não không còn cần nhắc nhở để làm thói quen mới — nó tự động xảy ra khi thói quen cũ kết thúc, giống như domino.',
    details: [
      'Neurological basis — associative learning: mỗi khi hai hành vi xảy ra liên tiếp, synapse giữa các neurons đại diện cho chúng được strengthen (Hebbian learning: "neurons that fire together, wire together"). Sau 30–50 repetitions, connection đủ mạnh để một hành vi tự động trigger hành vi kia — không cần conscious decision. Habit stacking exploit cơ chế này.',
      'Thói quen neo (anchor habits): để habit stacking hiệu quả, "anchor habit" (thói quen cũ làm cue) phải là thói quen đã hoàn toàn automatic — không cần suy nghĩ. Pha cà phê, đánh răng, ngồi vào bàn làm việc, ăn trưa, tắt máy tính buổi tối. Đây là những điểm "neo" tự nhiên trong ngày — mỗi điểm neo có thể gắn 1 thói quen mới.',
      'Nguyên tắc tiny: thói quen mới trong habit stack phải nhỏ hơn nhiều so với mục tiêu dài hạn. "Thiền 20 phút" → quá lớn để stack. "Ngồi yên 2 phút sau khi pha cà phê" → hoàn hảo. Tiny habit dễ thực hiện nhất quán và xây dựng momentum. Sau 2–4 tuần, tự nhiên muốn mở rộng ("2 phút cảm thấy tốt, thêm 3 phút nữa").',
      'Chain stacking — morning/evening routine: từ nhiều tiny habits stack lại tạo thành morning/evening routine hoàn chỉnh mà không cần discipline. Ví dụ morning stack: Tắt alarm → ra khỏi giường ngay (stack 1) → uống nước (stack 2) → mở rèm (stack 3) → 5 phút thở cơ hoành (stack 4) → 10 phút đọc sách (stack 5). Sau 6–8 tuần, toàn bộ chain xảy ra auto-pilot.',
      'Environment integration — location stacking: kết hợp Habit Stacking với visual cues và specific location. "Ngồi vào ghế bếp sau khi pha cà phê" hiệu quả hơn "thiền ở đâu đó sau khi pha cà phê" — location cụ thể tạo additional cue. Não associate location với hành vi (giải thích tại sao làm việc trên giường inefficient — não không associate giường với "work mode").',
      'Troubleshooting habit stacks thất bại: stack thất bại thường vì: (1) anchor habit không đủ automatic — chọn anchor khác. (2) Thói quen mới quá lớn — tiny-fy thêm. (3) Sequence không natural — test xem hành vi mới có phù hợp với ngữ cảnh anchor không. "Sau khi tắt máy tính, tôi tập 30 phút gym" — không natural vì gym cần travel. "Sau khi tắt máy tính, tôi thay đồ gym" — natural, chỉ 1 bước.',
    ],
    points: [
      { icon: '🔗', label: '"Sau khi X, tôi sẽ Y" — formula đơn giản nhất', note: 'Tận dụng neural pathway cũ đã mạnh để kéo thói quen mới theo không tốn effort' },
      { icon: '🧠', label: 'Neurons fire together → wire together', note: '30–50 repetitions đủ để thói quen mới tự động xảy ra sau anchor habit' },
      { icon: '⚡', label: 'Tiny habit: < 2 phút để stack', note: 'Bắt đầu nhỏ — "ngồi yên 2 phút" dễ stack hơn "thiền 20 phút" nhiều lần' },
      { icon: '📍', label: 'Location cụ thể tăng hiệu quả', note: '"Ghế bếp sau cà phê" > "đâu đó sau cà phê" — location = thêm 1 visual cue' },
    ],
  },
];

function EnvModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
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
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.modalTitle}</h2>
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

export default function LifestyleEnvironmentPage() {
  const [activeZone, setActiveZone] = useState('morning');
  const [principleIdx, setPrincipleIdx] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cEnvOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cEnvOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const zone = ENV_ZONES.find(z => z.id === activeZone);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🏠</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Thiết Kế Môi Trường</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C7 · Environment Design</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Hành vi tốt không chỉ từ ý chí mạnh — mà từ môi trường được thiết kế để làm cho hành vi tốt dễ hơn. Mỗi thay đổi nhỏ trong không gian sống là một "thiết kế hành vi" vô hình nhưng mạnh mẽ.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop" alt="Environment Design" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Môi trường quyết định hành vi · 3 không gian sống</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Core principle */}
      <RevealBlock className="mb-12">
        <div className="rounded-2xl p-5 border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
          <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Nguyên Tắc Cốt Lõi — Click để xem chi tiết</div>
          <div className="grid md:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title}
                className="rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                style={{ borderColor: `rgba(${p.rgb},0.2)`, background: `rgba(${p.rgb},0.06)` }}
                onClick={() => setPrincipleIdx(i)}>
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-lg font-bold mb-1" style={{ color: p.color }}>{p.title}</div>
                <div className="text-base text-muted leading-relaxed mb-3">{p.desc}</div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ color: p.color, background: `rgba(${p.rgb},0.12)` }}>Chi tiết →</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* 3 Environment zones */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Không Gian Cần Thiết Kế</h2>
        <p className="text-muted text-lg mb-6">Tối ưu hóa từng giai đoạn trong ngày bắt đầu từ môi trường xung quanh bạn.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {ENV_ZONES.map(z => (
            <button key={z.id} onClick={() => setActiveZone(z.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium transition-all border ${activeZone === z.id ? 'text-white' : 'text-muted border-border hover:border-rose-500/30'}`} style={{ background: activeZone === z.id ? z.color : undefined, borderColor: activeZone === z.id ? z.color : undefined }}>
              <span>{z.icon}</span>{z.title.replace('Môi Trường ', '')}
            </button>
          ))}
        </div>

        {zone && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${zone.color}30`, background: `${zone.color}06` }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{zone.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{zone.title}</div>
                <div className="text-base font-bold uppercase tracking-widest mt-0.5" style={{ color: zone.color }}>{zone.subtitle}</div>
              </div>
            </div>
            <div className="space-y-3">
              {zone.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg hover:border-opacity-30 transition-colors">
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-lg font-bold text-text">{item.title}</div>
                    <div className="text-base text-muted leading-relaxed mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Quick wins table */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>8 Thay Đổi Nhanh, Tác Động Lớn</h2>
        <p className="text-muted text-lg mb-6">Bắt đầu với những gì dễ nhất — ngay hôm nay, không cần kế hoạch phức tạp.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-border">
                {['Thay Đổi', 'Tác Động', 'Thời Gian', 'Chi Phí'].map(h => (
                  <th key={h} className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUICK_WINS.map((w, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="mr-2">{w.icon}</span>
                    <span className="text-text font-medium">{w.title}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-base font-bold" style={{ background: `${IMPACT_COLOR[w.impact]}20`, color: IMPACT_COLOR[w.impact] }}>{w.impact}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted">{w.time}</td>
                  <td className="py-3 text-muted">{w.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* 30-day challenge */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thử Thách 30 Ngày</h2>
        <p className="text-muted text-lg mb-6">Thực hiện từng thay đổi theo tuần — không làm tất cả một lúc.</p>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { week: 'Tuần 1', focus: 'Phòng ngủ', changes: ['Cất điện thoại ra ngoài', 'Nhiệt độ 18°C', 'Rèm tối hoàn toàn'] },
            { week: 'Tuần 2', focus: 'Buổi sáng', changes: ['Ly nước bên giường', 'Đèn sáng 5 phút đầu', 'Không phone 30 phút'] },
            { week: 'Tuần 3', focus: 'Làm việc', changes: ['Dọn bàn mỗi sáng', 'Nút tai/headphone', 'Cây xanh trên bàn'] },
            { week: 'Tuần 4', focus: 'Buổi tối', changes: ['Night mode 20:00', 'Sách thay điện thoại', 'Mùi lavender'] },
          ].map(w => (
            <div key={w.week} className="rounded-xl border border-border bg-surface p-4">
              <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>{w.week}</div>
              <div className="text-lg font-bold text-text mb-3">{w.focus}</div>
              <ul className="space-y-1">
                {w.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-muted"><span style={{ color: COLOR }}>→</span>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Principles modal — outside all RevealBlocks ── */}
      {principleIdx !== null && (
        <EnvModal
          item={PRINCIPLES[principleIdx]}
          idx={principleIdx}
          total={PRINCIPLES.length}
          onClose={() => setPrincipleIdx(null)}
          onPrev={() => setPrincipleIdx(i => Math.max(0, i - 1))}
          onNext={() => setPrincipleIdx(i => Math.min(PRINCIPLES.length - 1, i + 1))}
          hasPrev={principleIdx > 0}
          hasNext={principleIdx < PRINCIPLES.length - 1}
        />
      )}

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Kỹ Thuật Thở
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/checklist" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Checklist Hằng Ngày
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
