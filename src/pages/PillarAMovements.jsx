import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ─── Style & image config ───────────────────────────────────────────────────────

const MS = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  ring:'ring-green-500/40',  glow:'rgba(34,197,94,0.3)',   overlay:'from-green-950/90 via-green-900/60 to-transparent'  },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/10',   border:'border-lime-500/30',   bar:'bg-lime-500',   ring:'ring-lime-500/40',   glow:'rgba(163,230,53,0.3)',  overlay:'from-lime-950/90 via-lime-900/60 to-transparent'   },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   ring:'ring-blue-500/40',   glow:'rgba(59,130,246,0.3)',  overlay:'from-blue-950/90 via-blue-900/60 to-transparent'   },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   ring:'ring-teal-500/40',   glow:'rgba(20,184,166,0.3)',  overlay:'from-teal-950/90 via-teal-900/60 to-transparent'   },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', ring:'ring-purple-500/40', glow:'rgba(168,85,247,0.3)',  overlay:'from-purple-950/90 via-purple-900/60 to-transparent' },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', ring:'ring-orange-500/40', glow:'rgba(249,115,22,0.3)',  overlay:'from-orange-950/90 via-orange-900/60 to-transparent' },
};

const WARMUP_IMGS = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=70',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=70',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=70',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=70',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&q=70',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=70',
];

const COOLDOWN_IMGS = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=70',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&q=70',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=70',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=70',
];

const WARMUP_TAB_META = [
  {
    key: 'warmup',
    label: 'Khởi Động Chuẩn',
    icon: '🔥',
    color: 'orange',
    duration: '5–8 phút',
    headerImg: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=70',
    desc: 'Tăng nhiệt cơ thể, bôi trơn khớp, kích hoạt hệ thần kinh trước khi tập',
    tip: 'Không bỏ qua dù đang vội — 5 phút này giảm đáng kể nguy cơ chấn thương và cải thiện hiệu suất tập 15–20%. Cơ thể cần đạt 38°C để co bóp tối ưu.',
    science: 'Nhiệt độ cơ tăng 1°C → tăng 2–5% lực cơ và tốc độ dẫn truyền thần kinh',
    fallbackSteps: [
      { exercise: 'Thở cơ hoành',    how: 'Tay đặt lên bụng, bụng phồng khi hít vào, thở ra chậm qua miệng', duration: '4–6 nhịp' },
      { exercise: 'Đi bộ tại chỗ',   how: 'Nâng gối vừa phải, vai thả lỏng, nhịp nhàng đều đặn',              duration: '60 giây'  },
      { exercise: 'Xoay vai',         how: 'Xoay chậm về phía sau, không rút cổ, cảm nhận sự giãn ra',         duration: '10 vòng'  },
      { exercise: 'Ép bờ vai',        how: 'Kéo nhẹ hai vai về sau, mở ngực, giữ 1–2 giây mỗi lần',            duration: '10 lần'   },
      { exercise: 'Gập hông cơ bản',  how: 'Đẩy hông ra sau, lưng thẳng, gối hơi chùng — không cúi bằng lưng', duration: '8 lần'    },
      { exercise: 'Ngồi xuống ghế',   how: 'Ngồi xuống rồi đứng lên kiểm soát, không "rơi" xuống ghế',          duration: '8 lần'    },
    ],
  },
  {
    key: 'cooldown',
    label: 'Giãn Cơ Sau Tập',
    icon: '🧘',
    color: 'teal',
    duration: '5–10 phút',
    headerImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=70',
    desc: 'Phục hồi nhịp tim, tăng linh hoạt khớp, giảm đau cơ ngày hôm sau',
    tip: 'Giữ mỗi động tác ≥ 20–30 giây để cơ thực sự được kéo giãn. Không nín thở — thở đều đặn giúp cơ mềm hơn. Cảm giác căng nhẹ là bình thường, đau nhói là dừng ngay.',
    science: 'Giãn cơ tĩnh sau tập giảm đau DOMS 20–30% và cải thiện linh hoạt dài hạn',
    fallbackSteps: [
      { exercise: 'Giãn gấp hông', how: 'Quỳ một chân, đẩy hông nhẹ về trước — cảm nhận căng trước đùi',  duration: '30 giây/bên' },
      { exercise: 'Giãn đùi sau',  how: 'Duỗi một chân, gập người nhẹ, lưng không gù quá mức',              duration: '30 giây/bên' },
      { exercise: 'Mở ngực',       how: 'Dan hai tay sau lưng hoặc chống tay vào cửa, ngực mở ra trước',     duration: '30 giây'     },
      { exercise: 'Tư thế em bé',  how: 'Ngồi về gót, vươn tay ra trước, thở chậm, cảm nhận lưng giãn',     duration: '30–60 giây'  },
      { exercise: 'Thở chậm',      how: 'Hít vào 4 giây, thở ra 6 giây — chú ý bụng phồng xẹp',             duration: '4–6 nhịp'    },
    ],
  },
];

const WARMUP_MODALS = [
  {
    icon: '🫁', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Thở Cơ Hoành', duration: '4–6 nhịp',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=75',
    keyFact: 'Thở cơ hoành kích hoạt hệ phó giao cảm — giảm cortisol tức thì và tạo trạng thái sẵn sàng vận động tối ưu',
    detail: 'Đây là bước đầu tiên và quan trọng nhất trong mọi buổi tập. Hô hấp cơ hoành (diaphragmatic breathing) giúp não chuyển từ chế độ "cảnh giác căng thẳng" sang "tập trung sẵn sàng". Tay đặt lên bụng giúp bạn kiểm tra xem cơ hoành có hoạt động đúng không — bụng phải phồng lên khi hít vào, không phải ngực.',
    details: [
      'Cơ hoành là cơ hô hấp chính — chiếm 70–80% công việc thở bình thường khi cơ thể ở trạng thái nghỉ ngơi',
      'Thở ngực nông (thở vai) kích hoạt hệ giao cảm — tăng nhịp tim và cortisol không cần thiết trước tập',
      'Mỗi hơi thở cơ hoành tạo ra áp lực ổ bụng giúp ổn định cột sống — nền tảng cho mọi động tác vận động',
      'Thở ra chậm qua miệng kích hoạt dây thần kinh phế vị (vagus nerve) — giảm lo lắng và tăng khả năng tập trung',
      'Chỉ 4–6 nhịp thở đúng kỹ thuật đủ để tăng SpO2 (độ bão hòa oxy máu) từ 95% lên 98–99%',
      'Kỹ thuật này cũng là nền tảng của Wim Hof Method và phương pháp thở trong Yoga — được kiểm chứng khoa học',
    ],
    points: [
      { icon: '🧠', label: 'Não bộ', note: 'Tăng sóng alpha — trạng thái tập trung thư thái' },
      { icon: '❤️', label: 'Tim mạch', note: 'Giảm nhịp tim nghỉ xuống 5–10 bpm' },
      { icon: '💪', label: 'Cơ bắp', note: 'Tăng oxy đến cơ trước khi bắt đầu tập' },
      { icon: '🛡️', label: 'Cột sống', note: 'Áp lực ổ bụng bảo vệ lưng dưới' },
    ],
  },
  {
    icon: '🚶', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Đi Bộ Tại Chỗ', duration: '60 giây',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=75',
    keyFact: '60 giây đi bộ tại chỗ tăng nhiệt độ cơ bắp lên 0.5–1°C — đủ để tăng tốc độ co cơ 15–20%',
    detail: 'Đi bộ tại chỗ là bài khởi động toàn thân nhẹ nhàng nhất và hiệu quả nhất. Chuyển động nhịp nhàng này kích hoạt hệ tuần hoàn, tăng lưu lượng máu đến cơ lớn ở đùi và mông, đồng thời làm nóng khớp gối và hông một cách an toàn mà không gây căng thẳng cơ học đột ngột.',
    details: [
      'Khi cơ được làm nóng, độ nhớt (viscosity) của mô cơ giảm — cơ co duỗi nhanh hơn và linh hoạt hơn đáng kể',
      'Nâng gối vừa phải (đùi song song với sàn) kích hoạt cơ gấp hông — nhóm cơ thường yếu do ngồi nhiều',
      'Vai thả lỏng và tay đánh nhịp tự nhiên giúp giải phóng căng thẳng tích lũy ở cổ và vai',
      'Nhịp điệu đều đặn của bước chân kích thích tuyến não tiết endorphin — tạo cảm giác tích cực nhẹ ngay từ đầu',
      'Khớp háng và gối được bôi trơn bởi dịch khớp synovial tăng lên khi có chuyển động nhẹ nhàng đều đặn',
      'Sau 60 giây, nhịp tim tăng từ ~70 lên ~85–90 bpm — mức lý tưởng để bắt đầu các bài khởi động tiếp theo',
    ],
    points: [
      { icon: '🌡️', label: 'Nhiệt độ', note: 'Tăng 0.5–1°C — tốc độ phản ứng enzyme tăng' },
      { icon: '🩸', label: 'Tuần hoàn', note: 'Lưu lượng máu tăng 3–4 lần so với nghỉ ngơi' },
      { icon: '🦴', label: 'Khớp', note: 'Dịch khớp tăng tiết — giảm ma sát và mài mòn' },
      { icon: '🧩', label: 'Thần kinh', note: 'Kết nối thần kinh-cơ được kích hoạt sẵn sàng' },
    ],
  },
  {
    icon: '🔄', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Xoay Vai', duration: '10 vòng',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=75',
    keyFact: 'Khớp vai là khớp linh hoạt nhất cơ thể — cũng dễ chấn thương nhất nếu không khởi động đúng cách',
    detail: 'Xoay vai chậm về phía sau là bước thiết yếu trước bất kỳ bài tập thân trên nào. Động tác này trải dài dây chằng và bao khớp vai, kích hoạt các cơ xoay cuff (rotator cuff) — nhóm cơ nhỏ nhưng quan trọng giúp ổn định đầu xương cánh tay trong ổ khớp.',
    details: [
      'Rotator cuff gồm 4 cơ nhỏ (SITS): supraspinatus, infraspinatus, teres minor, subscapularis — kiểm soát mọi chuyển động vai',
      'Xoay về phía sau (retraction + depression) ưu tiên hơn xoay trước vì phần lớn người bị cơ ngực và vai trước quá căng',
      'Không rút cổ khi xoay vai — cổ và vai là hai vùng riêng biệt, co rút cổ tạo điểm nén lên đốt sống cổ',
      'Cảm giác giãn ra ở phần trước ngực khi xoay lùi là dấu hiệu tốt — cơ ngực lớn và nhỏ đang được kéo dài',
      '10 vòng đủ để dịch hoạt dịch (synovial fluid) phân phối đều trong bao khớp vai — giảm nguy cơ impingement',
      'Sau xoay vai, phạm vi chuyển động (ROM) của khớp vai tăng trung bình 15–25% trong 5–10 phút tiếp theo',
    ],
    points: [
      { icon: '🎯', label: 'Rotator Cuff', note: 'Kích hoạt 4 cơ ổn định khớp vai' },
      { icon: '📐', label: 'Phạm vi ROM', note: 'Tăng 15–25% sau 10 vòng đúng kỹ thuật' },
      { icon: '🛡️', label: 'Phòng chấn thương', note: 'Giảm nguy cơ impingement hội chứng vai' },
      { icon: '🔓', label: 'Giải phóng', note: 'Thư giãn cơ ngực căng do ngồi bàn nhiều' },
    ],
  },
  {
    icon: '🤝', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Ép Bờ Vai', duration: '10 lần',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75',
    keyFact: 'Ép bờ vai (scapular retraction) kích hoạt cơ thang giữa và dưới — nhóm cơ thường bị ức chế do ngồi cúi đầu quá nhiều',
    detail: 'Động tác này đặc biệt quan trọng trong xã hội hiện đại khi hầu hết chúng ta dành 6–10 giờ/ngày ở tư thế cúi đầu nhìn màn hình. Ép bờ vai đúng kỹ thuật tái kích hoạt các cơ sau lưng trên bị ức chế, tạo "bộ nhớ cơ" về tư thế thẳng đứng đúng.',
    details: [
      'Scapular retraction = kéo hai xương bả vai về gần nhau — kích hoạt cơ thang giữa, thang dưới và rhomboids',
      'Cơ ngực lớn thường quá căng ở người ngồi nhiều, kéo vai về trước — ép bờ vai là đối lập trực tiếp giúp cân bằng',
      'Giữ 1–2 giây ở điểm tối đa kích hoạt thần kinh cơ (neuromuscular activation) sâu hơn so với chỉ kéo nhanh',
      'Không nâng vai (elevation) khi ép — nâng vai kích hoạt cơ thang trên đã quá căng; mục tiêu là thang giữa/dưới',
      'Mở ngực khi ép bờ vai kích thích tuyến não tiết norepinephrine nhẹ — cải thiện tâm trạng và sự tự tin tức thì',
      'Chỉ 2–3 tuần tập động tác này đều đặn giúp cải thiện đáng kể tư thế và giảm đau vai mãn tính',
    ],
    points: [
      { icon: '🔙', label: 'Cơ sau lưng', note: 'Kích hoạt thang giữa, thang dưới, rhomboids' },
      { icon: '⚖️', label: 'Cân bằng cơ', note: 'Đối lập với cơ ngực căng do ngồi màn hình' },
      { icon: '📏', label: 'Tư thế', note: 'Cải thiện tư thế đứng/ngồi trong 2–3 tuần' },
      { icon: '😊', label: 'Tâm lý', note: 'Ngực mở kích thích norepinephrine — tăng tự tin' },
    ],
  },
  {
    icon: '🦵', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Gập Hông Cơ Bản', duration: '8 lần',
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=75',
    keyFact: 'Gập hông (hip hinge) là kỹ năng vận động nền tảng nhất — nắm vững kỹ thuật này giúp phòng ngừa 80% chấn thương lưng dưới',
    detail: 'Gập hông cơ bản trong khởi động là phiên bản nhẹ nhàng, an toàn của Romanian Deadlift — mục tiêu là "lập trình lại" hệ thần kinh để não nhận ra đây là chuyển động bản lề ở hông chứ không phải ở lưng.',
    details: [
      'Hip hinge đúng: hông đẩy ra sau, lưng phẳng, trọng tâm ở gót — tải trọng chia đều lên cơ mông và đùi sau',
      'Hip hinge sai: cúi bằng lưng — tải lên đĩa đệm L4-L5 tăng 400–700%, nguy cơ thoát vị đĩa đệm cao',
      'Gối hơi chùng (không thẳng cứng) cho phép hamstrings kéo dài đúng mức mà không tạo điểm căng ở đầu gối',
      'Cảm nhận sự căng nhẹ ở đùi sau khi gập xuống là dấu hiệu đúng — hamstrings đang được kéo giãn eccentric',
      'Nhìn thẳng (không nhìn xuống đất) giúp duy trì độ cong tự nhiên của cột sống cổ — neutral spine toàn bộ',
      '8 lần với tốc độ chậm kiểm soát tạo "muscle memory" cho hip hinge — sẽ tự động trong deadlift và squat thật',
    ],
    points: [
      { icon: '🍑', label: 'Cơ mông', note: 'Kích hoạt glutes — cơ lớn nhất và mạnh nhất cơ thể' },
      { icon: '🦵', label: 'Đùi sau', note: 'Hamstrings tập kéo dài eccentric an toàn' },
      { icon: '🔒', label: 'Lưng an toàn', note: 'Học cách bảo vệ đĩa đệm L4-L5' },
      { icon: '🧠', label: 'Não-cơ', note: 'Lập trình pattern vận động đúng cho toàn bộ buổi tập' },
    ],
  },
  {
    icon: '🪑', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Ngồi Xuống Ghế', duration: '8 lần',
    img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=75',
    keyFact: 'Ngồi xuống/đứng lên có kiểm soát là bài "squat có hỗ trợ" — cách an toàn nhất để kích hoạt cơ đùi trước và học kỹ thuật squat đúng',
    detail: 'Bài tập này tận dụng chiếc ghế như một "điểm dừng an toàn" để dạy não bộ kiểm soát chuyển động xuống (eccentric) và lên (concentric) của squat. Không được "rơi" xuống ghế vì điều đó có nghĩa là bạn không kiểm soát được lực hãm — chính cơ kiểm soát eccentric là cơ bảo vệ đầu gối.',
    details: [
      'Eccentric control (kiểm soát khi xuống) tạo lực chống kéo trên dây chằng đầu gối — quan trọng hơn lực đẩy lên',
      '"Rơi" xuống ghế tạo lực tác động 3–5 lần thể trọng lên đầu gối — nguy hiểm cho sụn chêm và dây chằng',
      'Ngồi xuống chậm 2–3 giây kích hoạt cơ tứ đầu đùi (quadriceps) theo cách không thể đạt được khi xuống nhanh',
      'Không để gối vượt quá ngón chân quá nhiều — trọng tâm dồn về gót chân để bảo vệ khớp gối',
      'Đứng lên bằng cách đẩy gót vào sàn — ưu tiên cơ mông và đùi sau hơn là "kéo" bằng đầu gối',
      '8 lần khởi động này giảm 30–40% nguy cơ đau đầu gối khi tập squat nặng hơn sau đó',
    ],
    points: [
      { icon: '🦵', label: 'Tứ đầu đùi', note: 'Kích hoạt eccentric — bảo vệ gối hiệu quả nhất' },
      { icon: '🍑', label: 'Cơ mông', note: 'Tập đứng lên bằng glutes, không phải gối' },
      { icon: '⚖️', label: 'Thăng bằng', note: 'Học phân phối trọng tâm đúng cho squat' },
      { icon: '🛡️', label: 'An toàn đầu gối', note: 'Giảm 30–40% nguy cơ đau gối khi tập nặng' },
    ],
  },
];

const COOLDOWN_MODALS = [
  {
    icon: '🦵', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Giãn Gấp Hông', duration: '30 giây/bên',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=75',
    keyFact: 'Cơ gấp hông (hip flexor) bị rút ngắn sau 6–8 tiếng ngồi — giãn đúng cách phục hồi tư thế đứng thẳng và giảm đau lưng dưới',
    detail: 'Cơ gấp hông (iliopsoas và rectus femoris) là nhóm cơ thường xuyên bị rút ngắn và căng nhất ở người hiện đại. Sau buổi tập, chúng cần được giãn eccentric để phục hồi độ dài bình thường và giải phóng áp lực lên vùng thắt lưng.',
    details: [
      'Cơ gấp hông quá căng kéo xương chậu về trước (anterior pelvic tilt) — nguyên nhân chính của đau lưng dưới',
      'Quỳ một chân tạo "đòn bẩy" cho phép giãn sâu hơn mà không tạo áp lực lên khớp gối như khi đứng',
      'Đẩy hông nhẹ về trước trong khi giữ lưng thẳng — không được ưỡn lưng để bù trừ (arching back)',
      'Giữ 30 giây mỗi bên đủ để phá vỡ myofascial adhesions (điểm dính cơ mạc) nhẹ sau tập',
      'Thở đều và thả lỏng cơ bụng khi giãn — căng bụng sẽ cản trở cơ gấp hông giãn sâu',
      'Sau 4 tuần giãn đều đặn, độ cúi của xương chậu trở về trung lập — đau lưng mãn tính giảm 40–60%',
    ],
    points: [
      { icon: '🦴', label: 'Xương chậu', note: 'Phục hồi tư thế trung lập sau anterior tilt' },
      { icon: '🔙', label: 'Lưng dưới', note: 'Giảm căng thẳng vùng L1-L4 tức thì' },
      { icon: '⏱️', label: 'Thời gian', note: '30s mỗi bên = tối thiểu để có hiệu quả' },
      { icon: '📅', label: 'Dài hạn', note: 'Giảm đau lưng mãn tính 40–60% sau 4 tuần' },
    ],
  },
  {
    icon: '🦵', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Giãn Đùi Sau', duration: '30 giây/bên',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=75',
    keyFact: 'Hamstrings căng là nguyên nhân số 1 của chấn thương cơ đùi sau ở vận động viên — giãn đúng sau tập là bảo hiểm tốt nhất',
    detail: 'Cơ đùi sau (hamstrings) hoạt động mạnh trong tất cả bài tập chức năng — từ squat, deadlift đến chạy bộ. Sau buổi tập, chúng bị co rút lại do tích lũy acid lactic. Giãn duỗi đúng cách phục hồi độ dài cơ, giảm đau cơ hôm sau (DOMS) và tăng linh hoạt dài hạn.',
    details: [
      'Hamstrings gồm 3 cơ: biceps femoris, semitendinosus, semimembranosus — kiểm soát cả gối lẫn hông',
      'Duỗi chân nhưng không thẳng cứng gối — giữ gối hơi mềm để tránh căng thẳng điểm nối dây chằng đầu gối',
      'Gập người về trước từ hông (hip hinge) chứ không từ lưng — giãn đúng đùi sau, không phải đĩa đệm',
      'Lưng không cần phải phẳng hoàn hảo — chấp nhận gù nhẹ ở lưng trên nhưng không gù lưng dưới',
      '30 giây liên tục đủ để giảm độ cứng cơ và phục hồi độ dài sợi cơ sau tập căng cơ',
      'Kết hợp thở ra dài khi gập sâu hơn — hệ phó giao cảm kích hoạt giúp cơ thư giãn và giãn dài hơn',
    ],
    points: [
      { icon: '🎯', label: '3 đầu cơ', note: 'Biceps femoris, semitendinosus, semimembranosus' },
      { icon: '🔓', label: 'Phục hồi', note: 'Giảm DOMS (đau cơ khởi phát muộn) hôm sau' },
      { icon: '📏', label: 'Kỹ thuật', note: 'Gập từ hông, không từ lưng — tránh đĩa đệm' },
      { icon: '🌬️', label: 'Hô hấp', note: 'Thở ra khi gập sâu — cơ giãn tốt hơn 20%' },
    ],
  },
  {
    icon: '💙', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Mở Ngực', duration: '30 giây',
    img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=75',
    keyFact: 'Cơ ngực bị rút ngắn do tư thế cúi màn hình tạo ra "upper crossed syndrome" — 30 giây mở ngực phá vỡ vòng lặp này',
    detail: 'Upper Crossed Syndrome là tình trạng phổ biến: cơ ngực và cổ trước quá căng, cơ sau lưng trên và cổ sau quá yếu. Mở ngực sau tập giải phóng căng thẳng tích lũy ở cơ ngực, cải thiện tư thế và cho phép vai về vị trí trung lập tự nhiên.',
    details: [
      'Tư thế vai tròn (rounded shoulders) tạo tải bất thường lên đĩa đệm cổ — nguyên nhân đau cổ mãn tính',
      'Mở ngực ở cửa hoặc dan tay sau kéo giãn pectoralis major và minor — hai cơ thường bị rút ngắn nhất',
      'Giữ 30 giây kéo dài sợi cơ đến điểm giải phóng myofascial adhesion — cảm giác căng dần giảm bớt',
      'Không ưỡn lưng quá mức khi mở ngực — ưỡn lưng cũng kéo cột sống thắt lưng, không phải cơ ngực',
      'Nhìn thẳng hoặc nhìn lên nhẹ khi mở ngực — kết hợp giãn cổ trước và ngực đồng thời',
      'Thực hành mở ngực 2–3 lần/ngày trong 6 tuần đủ để giảm vai tròn và tăng chiều cao đứng 1–2cm',
    ],
    points: [
      { icon: '🫀', label: 'Cơ ngực', note: 'Giải phóng pectoralis major + minor căng' },
      { icon: '🦋', label: 'Vai', note: 'Phục hồi vị trí trung lập — giảm vai tròn' },
      { icon: '🌬️', label: 'Hô hấp', note: 'Lồng ngực mở ra — tăng dung tích hít thở' },
      { icon: '📐', label: 'Tư thế', note: 'Kháng lại "Upper Crossed Syndrome" hàng ngày' },
    ],
  },
  {
    icon: '🧘', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Tư Thế Em Bé', duration: '30–60 giây',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75',
    keyFact: 'Child\'s Pose (Balasana) giải nén đốt sống lưng, giãn cơ thắt lưng vuông (quadratus lumborum) và giải phóng toàn bộ cột sống sau tập',
    detail: 'Tư thế em bé là một trong những tư thế phục hồi tốt nhất trong Yoga ứng dụng sau tập luyện. Nó kết hợp đồng thời giãn lưng dưới, hông, mông, vai và cánh tay — tạo ra hiệu ứng giảm căng thẳng toàn thân chỉ trong 30–60 giây.',
    details: [
      'Khi ngồi về gót và vươn tay ra trước, đốt sống lưng được "giải nén" — tăng khoảng cách giữa các đốt sống',
      'Cơ thắt lưng vuông (QL) — nguyên nhân chính của đau lưng dưới — được giãn dài theo chiều đứng khi tay vươn xa',
      'Hông uốn hoàn toàn giải phóng cơ gấp hông sâu (psoas major) — phần cơ khó giãn bằng các bài tập thông thường',
      'Thở chậm trong tư thế này tạo áp lực ổ bụng nhẹ nhàng massage các cơ quan tiêu hóa — giảm căng thẳng nội tạng',
      'Trán chạm sàn kích thích điểm huyệt Ấn Đường (giữa hai chân mày) — giảm căng thẳng thần kinh tức thì',
      'Giữ 60 giây (thay vì 30) tăng gấp đôi hiệu quả giãn cơ thực sự — creep relaxation cần thời gian',
    ],
    points: [
      { icon: '🔓', label: 'Cột sống', note: 'Giải nén đĩa đệm sau tập tải trọng nặng' },
      { icon: '🦴', label: 'Hông', note: 'Giải phóng psoas sâu — khó đạt bằng cách khác' },
      { icon: '🧠', label: 'Thần kinh', note: 'Ấn Đường kích thích — giảm căng thẳng tức thì' },
      { icon: '⏱️', label: 'Tối ưu', note: 'Giữ 60s thay vì 30s tăng gấp đôi hiệu quả' },
    ],
  },
  {
    icon: '🌬️', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Thở Chậm', duration: '4–6 nhịp',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=75',
    keyFact: 'Thở ra dài hơn hít vào (tỷ lệ 4:6) kích hoạt phản xạ bảo vệ tim — giảm nhịp tim và phục hồi hệ thần kinh sau tập',
    detail: 'Đây không chỉ là "thở thường" — đây là kỹ thuật thở phục hồi có chủ đích. Hít vào 4 giây và thở ra 6 giây tạo ra tỷ lệ 4:6 kích hoạt phản xạ baroreceptor — giảm nhịp tim 10–15 bpm trong vòng 3–4 nhịp thở. Đây là cách nhanh nhất để chuyển cơ thể từ trạng thái "giao cảm" sang "phó giao cảm".',
    details: [
      'Thở ra dài hơn hít vào kích hoạt baroreceptor ở xoang động mạch cảnh — gửi tín hiệu "giảm nhịp tim" lên não',
      'Chú ý bụng phồng xẹp (không ngực) — thở cơ hoành ở cuối buổi tập giúp phục hồi nhanh hơn 25%',
      'Tỷ lệ 4:6 (hít:thở) được dùng trong Heart Rate Variability (HRV) training của vận động viên chuyên nghiệp',
      '4–6 nhịp thở như vậy (khoảng 1 phút) đủ để HRV tăng và nhịp tim giảm về gần mức nghỉ ngơi',
      'Mắt nhắm hoặc nhìn xuống trong khi thở giảm kích thích thị giác — tăng thêm hiệu quả phó giao cảm',
      'Kết hợp với Tư Thế Em Bé phía trước: thở chậm trong tư thế đó tăng hiệu quả giãn cơ thêm 30–40%',
    ],
    points: [
      { icon: '❤️', label: 'Nhịp tim', note: 'Giảm 10–15 bpm trong 3–4 nhịp thở' },
      { icon: '🧠', label: 'Thần kinh', note: 'Chuyển từ sympathetic sang parasympathetic' },
      { icon: '📊', label: 'HRV', note: 'Heart Rate Variability tăng — dấu hiệu phục hồi tốt' },
      { icon: '🔄', label: 'Kết hợp', note: 'Trong Child\'s Pose tăng hiệu quả thêm 30–40%' },
    ],
  },
];

const LEVEL_COLORS = [
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
];

const MOVE_VIDEO = { squat:'SQUAT', hinge:'HINGE', push:'PUSH', pull:'PULL', core:'CORE', breath:'BREATH' };

// ─── Step detail modal ──────────────────────────────────────────────────────────

function StepModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  const { color, rgb } = item;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.06) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          <div className="absolute bottom-5 right-6 text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: `rgba(${rgb},0.18)`, border: `1px solid rgba(${rgb},0.35)`, color }}>
            {item.duration}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color }}>{item.modalTitle}</h2>
          <div className="rounded-xl p-4 mb-6" style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `rgba(${rgb},0.7)` }}>✦ Khoa học đằng sau</p>
            <p className="text-sm text-text/90 leading-relaxed font-medium">{item.keyFact}</p>
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ─── Click-to-play video ────────────────────────────────────────────────────────

function MovementVideoPlayer({ videoKey, s }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const src = `${import.meta.env.BASE_URL}videos/${videoKey}.mp4`;

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {});
    setPlaying(true);
  };

  if (error) {
    return (
      <div className={`rounded-2xl border ${s.border} bg-surface flex items-center justify-center`} style={{ aspectRatio: '9/16' }}>
        <p className="text-base text-muted text-center px-4">Video không tải được.<br />Kiểm tra kết nối.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black cursor-pointer" style={{ aspectRatio: '9/16' }} onClick={!playing ? handlePlay : undefined}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        loop
        controls={playing}
        preload="metadata"
        src={src}
        onError={() => setError(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${s.border} shadow-lg`}
            style={{ background: 'rgba(0,0,0,0.55)', boxShadow: `0 0 28px ${s.glow}` }}>
            <svg className={`w-7 h-7 ${s.text} ml-1`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className={`mt-3 text-base font-semibold ${s.text}`}
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Nhấn để xem</span>
        </div>
      )}
    </div>
  );
}

// ─── Page component ─────────────────────────────────────────────────────────────

export default function PillarAMovements() {
  const { t: tPillars } = useTranslation('pillars');

  const movementsDetail = tPillars('pillarA.movements_detail', { returnObjects: true });
  const warmupI18n      = tPillars('pillarA.warmup',           { returnObjects: true });
  const cooldownI18n    = tPillars('pillarA.cooldown',         { returnObjects: true });

  const [activeMove,   setActiveMove]   = useState(0);
  const [activeWarmup, setActiveWarmup] = useState('warmup');
  const [stepModal,    setStepModal]    = useState(null);

  const currentMove = Array.isArray(movementsDetail) ? movementsDetail[activeMove] : null;

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=50',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=50',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=50',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.13 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-green-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          <nav className="flex items-center gap-1.5 text-base text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">Vận Động & Tập Luyện</Link>
            <span className="text-border/60">/</span>
            <span className="text-green-400 font-medium">Vận Động & Khởi Động</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-500/8 border border-green-500/20 text-green-400 text-base font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            1 / 4 · Vận Động & Khởi Động
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-3">
            6 Mẫu Vận Động Nền Tảng &amp;<br />
            <span className="text-green-400">Khởi Động & Giãn Cơ Sau Tập</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl">
            Học 6 chuyển động nền tảng với video minh họa chi tiết, khởi động chuẩn trước khi tập
            và giãn cơ đúng cách để tối ưu phục hồi.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '6', label: 'Mẫu vận động cơ bản' },
              { n: '6', label: 'Video hướng dẫn HD' },
              { n: '3', label: 'Cấp độ mỗi bài tập' },
              { n: '15', label: 'Phút khởi động + giãn cơ' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-green-400 font-extrabold text-lg leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6 Movements section ────────────────────────────────────────────────── */}
      {Array.isArray(movementsDetail) && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-lg font-black flex items-center justify-center shrink-0">⚡</span>
            <h2 className="text-3xl font-black text-text">6 Mẫu Vận Động Nền Tảng</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <p className="text-muted text-lg mb-6">Chọn bài tập để xem video minh họa và hướng dẫn chi tiết</p>

          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap pb-0.5">
              {movementsDetail.map((m, i) => {
                const s = MS[m.color] || MS.green;
                const isActive = activeMove === i;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMove(i)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-lg font-bold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                      isActive
                        ? `${s.bg} ${s.text} border ${s.border}`
                        : 'text-muted border border-transparent hover:border-border hover:text-text hover:bg-white/4'
                    }`}
                  >
                    <span className="text-lg leading-none">{m.icon}</span>
                    <span>{m.name}</span>
                    {isActive && <span className={`absolute bottom-0 inset-x-3 h-0.5 ${s.bar} rounded-full`} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          {currentMove && (() => {
            const s   = MS[currentMove.color] || MS.green;
            const vid = MOVE_VIDEO[currentMove.id];
            return (
              <div key={currentMove.id} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.5)')}, transparent)` }} />
                <div className="p-5 md:p-6">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl shrink-0`}>{currentMove.icon}</div>
                        <div>
                          <h3 className={`font-black text-lg ${s.text}`}>{currentMove.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${s.bg} ${s.border} ${s.text}`}>{currentMove.prescription}</span>
                        </div>
                      </div>
                      {vid && <MovementVideoPlayer key={vid} videoKey={vid} s={s} />}
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">🎯 Mục tiêu</p>
                        <p className="text-base text-text leading-relaxed">{currentMove.goal}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Bài cơ bản</p>
                        <p className={`font-bold ${s.text} mb-2`}>{currentMove.basic}</p>
                        <p className="text-base text-muted leading-relaxed">{currentMove.basic_how}</p>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">💡 Cue kỹ thuật</p>
                        <p className={`text-lg font-bold ${s.text} leading-relaxed`}>{currentMove.cue}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Cấp độ tiến bộ</p>
                        <div className="space-y-2">
                          {Array.isArray(currentMove.levels) && currentMove.levels.map((lvl, li) => (
                            <div key={li} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${LEVEL_COLORS[li % 3]}`}>{lvl.label}</span>
                              <span className="text-lg text-text">{lvl.exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-yellow-400/80 uppercase tracking-wider mb-2">⚠ Lỗi thường gặp</p>
                        <p className="text-base text-yellow-300/70 leading-relaxed">{currentMove.errors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ── Warmup & cooldown tabs ──────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-7">
          <span className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-lg font-black flex items-center justify-center shrink-0">🔥</span>
          <h2 className="text-3xl font-black text-text">Khởi Động & Giãn Cơ Sau Tập</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* Pill switcher */}
        <div className="flex gap-1.5 p-1.5 bg-surface rounded-2xl border border-border w-fit mb-6">
          {WARMUP_TAB_META.map(tab => {
            const isActive = activeWarmup === tab.key;
            const s = MS[tab.color];
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveWarmup(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all duration-250 focus:outline-none ${
                  isActive
                    ? `${s.bg} ${s.text} border ${s.border} shadow-sm`
                    : 'text-muted hover:text-text'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${
                  isActive ? `${s.bg} ${s.border} ${s.text}` : 'bg-bg border-border/50 text-muted'
                }`}>
                  {tab.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active tab panel */}
        {(() => {
          const tab       = WARMUP_TAB_META.find(t => t.key === activeWarmup) || WARMUP_TAB_META[0];
          const s         = MS[tab.color];
          const i18nList  = tab.key === 'warmup' ? warmupI18n : cooldownI18n;
          const exercises = Array.isArray(i18nList) && i18nList.length > 0 ? i18nList : tab.fallbackSteps;
          const imgs      = tab.key === 'warmup' ? WARMUP_IMGS : COOLDOWN_IMGS;
          return (
            <div key={tab.key} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.7)')}, transparent)` }} />

              {/* Header image */}
              <div className="relative h-48 overflow-hidden">
                <img src={tab.headerImg} alt="" className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/20" />

                <div className="absolute top-3 right-4 max-w-[220px]">
                  <div className="glass border border-white/10 rounded-xl px-3 py-2">
                    <p className="text-[9px] text-white/55 leading-snug">🔬 {tab.science}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-4xl">{tab.icon}</span>
                    <h3 className={`font-black text-2xl ${s.text}`}>{tab.label}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.border} ${s.text}`}>{tab.duration}</span>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed max-w-md">{tab.desc}</p>
                </div>
              </div>

              {/* Exercise list */}
              <div className="p-5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Trình tự thực hiện</p>
                <div className="space-y-2">
                  {exercises.map((ex, i) => {
                    const modals = tab.key === 'warmup' ? WARMUP_MODALS : COOLDOWN_MODALS;
                    const hasModal = !!modals[i];
                    return (
                      <div
                        key={i}
                        className={`group/step flex items-center gap-0 bg-bg/60 border border-border/40 rounded-xl overflow-hidden transition-all duration-200 hover:bg-bg/80 ${hasModal ? 'cursor-pointer hover:border-border-bright' : ''}`}
                        onClick={hasModal ? () => setStepModal({ tabKey: tab.key, stepIdx: i }) : undefined}
                      >
                        <div className="w-16 h-16 shrink-0 overflow-hidden">
                          <img
                            src={imgs[i] || imgs[imgs.length - 1]}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-400 group-hover/step:scale-110"
                            style={{ opacity: 0.65 }}
                          />
                        </div>
                        <span className={`w-6 h-6 rounded-full ${s.bg} border ${s.border} ${s.text} text-[10px] font-black flex items-center justify-center shrink-0 mx-3`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0 py-3 pr-2">
                          <p className="text-base font-semibold text-text">{ex.exercise}</p>
                          <p className="text-[10px] text-muted mt-0.5 leading-snug line-clamp-2">{ex.how}</p>
                        </div>
                        <div className="flex items-center gap-2 mr-3 shrink-0">
                          {hasModal && (
                            <span className={`text-[10px] font-bold opacity-0 group-hover/step:opacity-60 transition-opacity duration-150 ${s.text}`}>
                              chi tiết →
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border whitespace-nowrap ${s.bg} ${s.border} ${s.text}`}>
                            {ex.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4 mt-4">
                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                  <p className={`text-[10px] font-bold ${s.text} uppercase tracking-wider mb-2`}>💡 Ghi nhớ quan trọng</p>
                  <p className="text-base text-text/80 leading-relaxed">{tab.tip}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-4 mb-4">
        <div className="w-32 shrink-0" />
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-base bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-green-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <Link
          to="/pillar/a/framework"
          className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group"
        >
          <span>Khung Ngày & Thời Gian</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Step detail modal — outside all wrappers to prevent position:fixed constraint */}
      {stepModal !== null && (() => {
        const modals = stepModal.tabKey === 'warmup' ? WARMUP_MODALS : COOLDOWN_MODALS;
        const modalItem = modals[stepModal.stepIdx];
        if (!modalItem) return null;
        const total = modals.length;
        return (
          <StepModal
            item={modalItem}
            onClose={() => setStepModal(null)}
            onPrev={() => setStepModal(m => ({ ...m, stepIdx: Math.max(0, m.stepIdx - 1) }))}
            onNext={() => setStepModal(m => ({ ...m, stepIdx: Math.min(total - 1, m.stepIdx + 1) }))}
            hasPrev={stepModal.stepIdx > 0}
            hasNext={stepModal.stepIdx < total - 1}
          />
        );
      })()}
    </div>
  );
}
