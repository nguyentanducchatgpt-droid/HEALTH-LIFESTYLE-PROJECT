import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WorkoutFramework from '../components/WorkoutFramework';

const MS = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.3)',   hex:'#22c55e', rgb:'34,197,94'   },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.3)',  hex:'#f97316', rgb:'249,115,22'  },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   glow:'rgba(20,184,166,0.3)',  hex:'#14b8a6', rgb:'20,184,166'  },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.3)',  hex:'#a855f7', rgb:'168,85,247'  },
};

const STEP_MODALS = {
  '0-0': {
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
  '0-1': {
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
  '0-2': {
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
  '0-3': {
    icon: '🤝', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Ép Bờ Vai', duration: '10 lần',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75',
    keyFact: 'Ép bờ vai (scapular retraction) kích hoạt cơ thang giữa và dưới — nhóm cơ thường bị ức chế do ngồi cúi đầu quá nhiều',
    detail: 'Động tác này đặc biệt quan trọng trong xã hội hiện đại khi hầu hết chúng ta dành 6–10 giờ/ngày ở tư thế cúi đầu nhìn màn hình. Ép bờ vai đúng kỹ thuật tái kích hoạt các cơ sau lưng trên bị ức chế, tạo "bộ nhớ cơ" (muscle memory) về tư thế thẳng đứng đúng.',
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
  '0-4': {
    icon: '🦵', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Gập Hông Cơ Bản', duration: '8 lần',
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=75',
    keyFact: 'Gập hông (hip hinge) là kỹ năng vận động nền tảng nhất — nắm vững kỹ thuật này giúp phòng ngừa 80% chấn thương lưng dưới',
    detail: 'Gập hông cơ bản trong khởi động là phiên bản nhẹ nhàng, an toàn của Romanian Deadlift — mục tiêu là "lập trình lại" hệ thần kinh để não nhận ra đây là chuyển động bản lề ở hông chứ không phải ở lưng. Đây là kỹ năng vận động quan trọng nhất mà hầu hết người tập đều thiếu.',
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
  '0-5': {
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
  '2-0': {
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
  '2-1': {
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
  '2-2': {
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
  '2-3': {
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
  '2-4': {
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
  '3-0': {
    icon: '🛋️', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Ngồi/Nằm Thoải Mái', duration: '30 giây',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75',
    keyFact: 'Chọn tư thế hoàn toàn thoải mái loại bỏ tín hiệu đau và bất tiện — não mới có thể chuyển sang chế độ phục hồi thực sự',
    detail: '30 giây đầu tiên của giai đoạn Tĩnh Tâm là để cơ thể "tìm thấy" trạng thái cân bằng của nó. Không có tư thế "đúng" hay "sai" — miễn là bạn hoàn toàn thoải mái và cột sống được đỡ. Mắt nhắm nhẹ hoặc nhìn xuống một điểm cố định kích hoạt phản xạ tĩnh lặng của não.',
    details: [
      'Tư thế không quan trọng bằng sự thoải mái hoàn toàn — khó chịu về thể chất sẽ chiếm toàn bộ sự chú ý của não',
      'Tay đặt lên bụng tạo phản hồi cảm giác nhẹ — giúp não "định vị" cơ thể và bắt đầu body scan tự động',
      'Nhắm mắt giảm 80% kích thích đầu vào của não — cho phép nguồn lực thần kinh chuyển sang xử lý nội tâm',
      'Lưng được đỡ hoàn toàn (ngồi tựa lưng hoặc nằm) loại bỏ tín hiệu đau từ cơ lưng mệt mỏi',
      '30 giây này là "giai đoạn chuyển tiếp" từ hoạt động sang nghỉ ngơi — não cần thời gian để "đóng tab"',
      'Nhiều vận động viên chuyên nghiệp thực hành "Yoga Nidra" bắt đầu bằng chính xác bước thiết lập tư thế này',
    ],
    points: [
      { icon: '🧘', label: 'Tư thế', note: 'Thoải mái > "đúng" — không có tư thế thiền bắt buộc' },
      { icon: '👁️', label: 'Thị giác', note: 'Nhắm mắt giảm 80% kích thích não bộ' },
      { icon: '🔋', label: 'Phục hồi', note: 'Não chuyển từ "làm" sang "hấp thụ và tái tạo"' },
      { icon: '⏱️', label: 'Chuyển tiếp', note: 'Bước quan trọng để các bước sau hiệu quả hơn' },
    ],
  },
  '3-1': {
    icon: '📦', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Thở Hộp (Box Breathing)', duration: '2–3 phút',
    img: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?w=800&q=75',
    keyFact: 'Box Breathing (4-4-4-4) được Navy SEALs và phi hành gia NASA sử dụng để kiểm soát cortisol trong điều kiện căng thẳng cực độ',
    detail: 'Box Breathing là kỹ thuật điều hòa hô hấp đã được kiểm chứng lâm sàng. Chu kỳ 4-4-4-4 (hít-giữ-thở-giữ) tạo ra nhịp hô hấp tối ưu khoảng 5–6 nhịp/phút — chính xác là tần số cộng hưởng tim-phổi (cardiopulmonary resonance) giúp tối đa hóa HRV và kích hoạt phó giao cảm sâu nhất.',
    details: [
      'Tần số 5–6 nhịp/phút tạo ra "resonance" giữa nhịp tim và nhịp thở — HRV đạt đỉnh tại tần số này',
      'Giai đoạn giữ hơi (breath hold) sau hít vào tăng áp suất oxy trong phế nang — cải thiện trao đổi khí',
      'Giai đoạn giữ sau thở ra (empty lung hold) kích hoạt phản xạ Hering-Breuer — hệ phó giao cảm cực mạnh',
      'Chỉ 2–3 phút Box Breathing đủ để cortisol giảm đo lường được trong máu — được xác nhận bởi Viện Sức Khỏe Quốc Gia Mỹ',
      'Navy SEALs dùng Box Breathing để duy trì bình tĩnh và quyết định sáng suốt trong tình huống chiến đấu thực tế',
      'Lặp 2–3 vòng là tối thiểu — 5–6 vòng là tối ưu nếu bạn có thêm thời gian sau buổi tập',
    ],
    points: [
      { icon: '🫀', label: 'HRV', note: 'Đạt đỉnh tại tần số thở 5–6 nhịp/phút' },
      { icon: '🧠', label: 'Cortisol', note: 'Giảm đo lường được sau 2–3 phút thực hành' },
      { icon: '⚓', label: 'Military Grade', note: 'Navy SEALs dùng trong tình huống stress cực độ' },
      { icon: '🔬', label: 'Khoa học', note: 'Được NIH xác nhận hiệu quả lâm sàng' },
    ],
  },
  '3-2': {
    icon: '🔍', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Quét Cơ Thể', duration: '1 phút',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=75',
    keyFact: 'Body scan (quét cơ thể) là kỹ thuật MBSR (Mindfulness-Based Stress Reduction) được chứng minh giảm đau cơ chủ quan và tăng nhận thức về trạng thái phục hồi',
    detail: 'Quét cơ thể là thực hành nhận biết không phán xét từng vùng cơ thể từ đầu đến chân. Điều này không chỉ có tác dụng thư giãn — nó còn giúp bạn phát hiện những vùng căng cứng bất thường, những cơn đau nhỏ trước khi chúng trở thành chấn thương, và xây dựng kết nối thần kinh-cơ quan trọng.',
    details: [
      'Body scan tăng cường interoception (nhận thức nội tâm) — khả năng nhận biết tín hiệu từ bên trong cơ thể',
      'Nhận biết không phán xét là từ khóa — chỉ quan sát "tôi cảm thấy căng ở vai" chứ không "tôi không nên bị đau"',
      'Phát hiện vùng căng bất thường sau tập giúp điều chỉnh bài tập tiếp theo — phòng ngừa overuse injury',
      'Nghiên cứu MBSR của Jon Kabat-Zinn tại UMass cho thấy body scan 1 phút giảm nhận thức đau cơ 25–35%',
      'Từ đầu xuống chân: đỉnh đầu → trán → mắt → hàm → cổ → vai → ngực → tay → bụng → hông → đùi → gối → bắp chân → bàn chân',
      'Sau 4–6 tuần thực hành, não bạn sẽ tự động "scan" cơ thể trong ngày — cảnh báo sớm trước khi chấn thương xảy ra',
    ],
    points: [
      { icon: '🔬', label: 'Interoception', note: 'Tăng nhận thức tín hiệu cơ thể nội tâm' },
      { icon: '🛡️', label: 'Phòng chấn thương', note: 'Phát hiện sớm vùng quá tải trước khi thành injury' },
      { icon: '😌', label: 'Đau cơ', note: 'Giảm nhận thức đau DOMS 25–35% (nghiên cứu MBSR)' },
      { icon: '🧠', label: 'Thói quen', note: 'Sau 6 tuần: tự động scan cả ngày, không chỉ sau tập' },
    ],
  },
  '3-3': {
    icon: '✨', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Ghi Nhận Tích Cực', duration: '30 giây',
    img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=75',
    keyFact: 'Ghi nhận 1 điều tích cực sau tập kích hoạt hệ dopamine — củng cố "vòng lặp thói quen" (habit loop) và tăng khả năng duy trì tập luyện dài hạn',
    detail: 'Bước này có vẻ đơn giản nhưng là yếu tố tâm lý quan trọng nhất trong việc duy trì thói quen tập luyện. Theo nghiên cứu habit formation của BJ Fogg (Stanford), cảm giác "chiến thắng" (even tiny wins) sau hành vi là "keo dán" giữ thói quen. Không cần phải là điều lớn — "đã hoàn thành" đã là đủ.',
    details: [
      'Hệ dopamine không cần thành tích lớn — mọi "micro-win" nhỏ nhất cũng đủ để kích hoạt cung bố thưởng',
      'BJ Fogg (Tiny Habits, Stanford) chứng minh: cảm xúc tích cực ngay sau hành vi là yếu tố hình thành thói quen #1',
      '3 gợi ý ghi nhận: (1) Đã hoàn thành buổi tập; (2) Cảm thấy khỏe hơn; (3) Tiến bộ cụ thể nào đó',
      'Không được tự chê hay so sánh với ngày khác trong bước này — não cần tín hiệu "thành công" không điều kiện',
      'Ghi nhận bằng lời trong đầu ("Tốt lắm — mình đã làm được") kích hoạt vỏ não trước trán — tăng tự kiểm soát',
      'Sau 66 ngày thực hành (ngưỡng trung bình hình thành thói quen theo Phillippa Lally, UCL), bước này trở thành tự động',
    ],
    points: [
      { icon: '🧠', label: 'Dopamine', note: 'Micro-win kích hoạt reward system — không cần thành tích lớn' },
      { icon: '🔗', label: 'Habit Loop', note: 'Cảm xúc tích cực = keo dán thói quen (BJ Fogg)' },
      { icon: '🚫', label: 'Không so sánh', note: 'Chỉ ghi nhận thành công — không chê bai hay so sánh' },
      { icon: '📅', label: '66 ngày', note: 'Ngưỡng tự động hóa thói quen theo nghiên cứu UCL' },
    ],
  },
  '3-4': {
    icon: '🎯', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Đặt Ý Định', duration: '30 giây',
    img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=75',
    keyFact: 'Đặt ý định sau tập (implementation intention) tăng 2–3 lần khả năng thực hiện hành vi mục tiêu trong ngày — được xác nhận bởi hơn 94 nghiên cứu độc lập',
    detail: 'Implementation intention là kỹ thuật tâm lý mạnh nhất để chuyển đổi ý định thành hành động. Không chỉ nói "tôi muốn ăn lành mạnh hôm nay" — mà là "khi tôi ngồi vào bàn ăn trưa, tôi sẽ chọn rau và protein trước". Trạng thái thư thái sau thiền ngay trước bước này làm cho ý định ghi sâu hơn vào bộ nhớ làm việc.',
    details: [
      'Implementation intention format: "Khi [tình huống cụ thể], tôi sẽ [hành vi cụ thể]" — hiệu quả hơn mục tiêu chung 200–300%',
      'Meta-analysis 94 nghiên cứu của Gollwitzer & Sheeran: implementation intention tăng tỷ lệ hoàn thành hành vi 2–3 lần',
      'Trạng thái thư thái sau Box Breathing + Body Scan làm não "tiếp nhận" ý định sâu hơn vào vỏ não trước trán',
      'Giới hạn 1 ý định — đặt nhiều hơn phân tán nguồn lực nhận thức và giảm hiệu quả của từng ý định',
      'Ý định liên quan đến thể chất và sức khỏe hiệu quả nhất ngay sau tập vì dopamine và endorphin đang cao',
      'Sau buổi tập, neuroplasticity (tính dẻo của não) cao hơn bình thường 30–40 phút — thời điểm tốt nhất để "lập trình" ý định',
    ],
    points: [
      { icon: '🎯', label: 'Implementation', note: '"Khi X, tôi sẽ Y" — hiệu quả hơn mục tiêu chung 3 lần' },
      { icon: '🧠', label: 'Neuroplasticity', note: 'Não dẻo nhất 30–40 phút sau tập — thời điểm vàng' },
      { icon: '1️⃣', label: '1 ý định thôi', note: 'Nhiều hơn 1 sẽ phân tán và giảm hiệu quả' },
      { icon: '🔬', label: 'Khoa học', note: '94 nghiên cứu độc lập xác nhận hiệu quả' },
    ],
  },
};

const DAILY_BLOCKS = [
  {
    time: '5 phút', name: 'Khởi Động', icon: '🔥', color: 'orange',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=70',
    goal: 'Tăng nhiệt cơ thể, bôi trơn khớp, kích hoạt hệ thần kinh — giảm nguy cơ chấn thương',
    steps: [
      { name: 'Thở cơ hoành',   how: 'Tay đặt lên bụng, bụng phồng khi hít vào, thở ra chậm qua miệng',        duration: '4–6 nhịp' },
      { name: 'Đi bộ tại chỗ',  how: 'Nâng gối vừa phải, vai thả lỏng, nhịp nhàng đều đặn',                     duration: '60 giây'  },
      { name: 'Xoay vai',       how: 'Xoay chậm về phía sau, không rút cổ, cảm nhận sự giãn ra',                duration: '10 vòng'  },
      { name: 'Ép bờ vai',      how: 'Kéo nhẹ hai vai về sau, mở ngực, giữ 1–2 giây mỗi lần',                   duration: '10 lần'   },
      { name: 'Gập hông cơ bản',how: 'Đẩy hông ra sau, lưng thẳng, gối hơi chùng — không cúi bằng lưng',        duration: '8 lần'    },
      { name: 'Ngồi xuống ghế', how: 'Ngồi xuống rồi đứng lên kiểm soát, không "rơi" xuống ghế',                duration: '8 lần'    },
    ],
    tips: [
      'Không bỏ qua dù đang vội — 5 phút này giảm đáng kể nguy cơ chấn thương',
      'Cơ thể cần 3–5 phút để tăng nhiệt độ cơ lên mức an toàn (38°C)',
      'Thở sâu đầu tiên giúp "bật" hệ thần kinh phó giao cảm → cơ thả lỏng tốt hơn',
    ],
  },
  {
    time: '10–20 phút', name: 'Vận Động Chính', icon: '💪', color: 'green',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70',
    goal: 'Kích thích cơ bắp & hệ tim mạch — đây là phần tạo ra sự thích nghi và tiến bộ',
    options: [
      {
        name: 'Sức Mạnh', icon: '🏋️', days: 'T2 · T4 · T6',
        exercises: [
          { name: 'Gập chân (Squat)',       sets: '2–3 × 10–12 lần'  },
          { name: 'Bước tấn (Lunge)',        sets: '2–3 × 10 lần/bên' },
          { name: 'Chống đẩy (Push-up)',     sets: '2–3 × 8–12 lần'   },
          { name: 'Kéo dây / khăn (Row)',    sets: '2–3 × 10–12 lần'  },
          { name: 'Cầu mông (Glute Bridge)', sets: '2–3 × 12–15 lần'  },
          { name: 'Gập hông (Romanian DL)',  sets: '2–3 × 10 lần'     },
          { name: 'Tư thế ván (Plank)',      sets: '2–3 × 20–40 giây' },
          { name: 'Superman (Lưng dưới)',    sets: '2–3 × 12 lần'     },
        ],
        note: 'Nghỉ 60–90 giây giữa các hiệp. Tăng tải ≤ 10%/tuần.',
      },
      {
        name: 'Tim Mạch', icon: '🏃', days: 'T3 · T5',
        exercises: [
          { name: 'Chạy bộ nhẹ Zone 2',     sets: '15–20 phút'   },
          { name: 'Đi bộ nhanh ngoài trời', sets: '15–20 phút'   },
          { name: 'Đạp xe nhẹ nhàng',       sets: '15–20 phút'   },
          { name: 'Leo cầu thang',           sets: '10–15 phút'   },
          { name: 'Nhảy dây nhẹ',           sets: '5–10 phút'    },
          { name: 'Nhịp tim mục tiêu',       sets: '50–70% HRmax' },
        ],
        note: 'HRmax ≈ 220 − tuổi. Có thể nói chuyện được là đúng vùng.',
      },
    ],
    tips: [
      'Chất lượng > số lượng — form chuẩn trước, tăng tải sau',
      'Uống nước ngay khi khát, đừng chờ đến khi rất khát',
      'Nếu quá mệt sau bài: giảm 1 hiệp hoặc giảm tải — tiến bộ dần đều mới bền vững',
    ],
  },
  {
    time: '5–10 phút', name: 'Giãn Cơ & Hạ Nhiệt', icon: '🧘', color: 'teal',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=70',
    goal: 'Phục hồi nhịp tim, tăng linh hoạt, giảm đau cơ hôm sau — không bỏ qua bước này',
    steps: [
      { name: 'Giãn gấp hông', how: 'Quỳ một chân, đẩy hông nhẹ về trước — cảm nhận căng trước đùi',  duration: '30 giây/bên' },
      { name: 'Giãn đùi sau',  how: 'Duỗi một chân, gập người nhẹ, lưng không gù quá mức',              duration: '30 giây/bên' },
      { name: 'Mở ngực',       how: 'Dan hai tay sau lưng hoặc chống tay vào cửa, ngực mở ra trước',     duration: '30 giây'     },
      { name: 'Tư thế em bé',  how: 'Ngồi về gót, vươn tay ra trước, thở chậm, cảm nhận lưng giãn',     duration: '30–60 giây'  },
      { name: 'Thở chậm',      how: 'Hít vào 4 giây, thở ra 6 giây — chú ý bụng phồng xẹp',             duration: '4–6 nhịp'    },
    ],
    tips: [
      'Giữ mỗi động tác ≥ 20 giây để cơ thực sự được kéo giãn',
      'Không nín thở — thở đều đặn giúp cơ mềm và dễ giãn hơn',
      'Cảm giác căng nhẹ là bình thường — đau nhói là dừng ngay',
    ],
  },
  {
    time: '5 phút', name: 'Tĩnh Tâm', icon: '🌿', color: 'purple',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=70',
    goal: 'Hạ cortisol, củng cố ký ức vận động, chuyển não từ chế độ "nỗ lực" sang "phục hồi"',
    steps: [
      { name: 'Ngồi/nằm thoải mái', how: 'Đặt tay lên bụng, nhắm mắt nhẹ hoặc nhìn xuống',                                    duration: '30 giây'  },
      { name: 'Thở hộp (Box)',       how: 'Hít vào 4s → giữ 4s → thở ra 4s → giữ 4s — lặp 2–3 vòng',                         duration: '2–3 phút' },
      { name: 'Quét cơ thể',         how: 'Nhận biết từng vùng từ đầu đến chân — cảm nhận không phán xét',                     duration: '1 phút'   },
      { name: 'Ghi nhận tích cực',   how: 'Nghĩ đến 1 điều tốt trong buổi tập: đã hoàn thành, cảm thấy khỏe, bước tiến nào đó',duration: '30 giây'  },
      { name: 'Đặt ý định',          how: 'Quyết định 1 điều muốn làm tốt trong phần còn lại của ngày',                        duration: '30 giây'  },
    ],
    tips: [
      'Không cần "đầu óc trống rỗng" — chỉ cần quan sát, không phán xét',
      '5 phút thiền sau tập giúp cortisol giảm 15–20%',
      'Đây là lúc não bộ củng cố và ghi nhớ các vận động mới học — đừng lướt điện thoại ngay',
    ],
  },
];

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
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.06) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          {/* Icon */}
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-5 right-6 text-[11px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: `rgba(${rgb},0.18)`, border: `1px solid rgba(${rgb},0.35)`, color }}>
            {item.duration}
          </div>
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color }}>{item.modalTitle}</h2>

          {/* Key fact banner */}
          <div className="rounded-xl p-4 mb-6" style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `rgba(${rgb},0.7)` }}>✦ Khoa học đằng sau</p>
            <p className="text-sm text-text/90 leading-relaxed font-medium">{item.keyFact}</p>
          </div>

          {/* Detail paragraph */}
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>

          {/* Numbered detail list */}
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col grid */}
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

          {/* Prev / Next */}
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

export default function PillarAFramework() {
  const { t: tPillars } = useTranslation('pillars');
  const { t } = useTranslation('common');
  const [activeDayBlock, setActiveDayBlock] = useState(0);
  const [stepModal, setStepModal] = useState(null);

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=60"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.12 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-orange-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          <nav className="flex items-center gap-1.5 text-base text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">{t('nav.home')}</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">{tPillars('pillarA.title')}</Link>
            <span className="text-border/60">/</span>
            <span className="text-orange-400 font-medium">{tPillars('pillarA.sub_framework_name')}</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-orange-500/8 border border-orange-500/20 text-orange-400 text-base font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
            2 / 4 · {tPillars('pillarA.sub_framework_name')}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-3">
            {tPillars('pillarA.sub_framework_h1_main')} &amp;<br />
            <span className="text-orange-400">{tPillars('pillarA.sub_framework_h1_accent')}</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl">
            {tPillars('pillarA.sub_framework_desc')}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '4', label: 'Khối trong ngày' },
              { n: '8', label: 'Mức: 20–180 phút' },
              { n: '7', label: 'Kcal/phút tối đa' },
              { n: '100+', label: 'Bài tập mẫu' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-orange-400 font-extrabold text-lg leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Daily framework tabs ────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-7">
          <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-lg flex items-center justify-center shrink-0 font-black">⏱</span>
          <h2 className="text-3xl font-black text-text">Khung Ngày Tập 20–40 Phút</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>
        <p className="text-muted text-lg mb-6">Mỗi buổi tập được chia thành 4 khối — chọn khối để xem chi tiết từng bước</p>

        {/* Tab bar */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
          <div className="flex gap-1.5 min-w-max pb-0.5">
            {DAILY_BLOCKS.map((b, i) => {
              const s = MS[b.color];
              const isActive = activeDayBlock === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveDayBlock(i)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-lg font-bold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                    isActive
                      ? `${s.bg} ${s.text} border ${s.border}`
                      : 'text-muted border border-transparent hover:border-border hover:text-text hover:bg-white/4'
                  }`}
                >
                  <span className="text-lg leading-none">{b.icon}</span>
                  <span>{b.name}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${
                    isActive ? 'bg-white/15 border-white/20 text-white/70' : 'bg-surface border-border text-muted'
                  }`}>
                    {b.time}
                  </span>
                  {isActive && <span className={`absolute bottom-0 inset-x-3 h-0.5 ${s.bar} rounded-full`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active block panel */}
        {(() => {
          const b = DAILY_BLOCKS[activeDayBlock];
          const s = MS[b.color];
          return (
            <div key={activeDayBlock} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.6)')}, transparent)` }} />

              {/* Image header */}
              <div className="relative h-52 overflow-hidden">
                <img src={b.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-3xl shrink-0`}>{b.icon}</div>
                    <div>
                      <h3 className={`font-black text-2xl ${s.text}`}>{b.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>{b.time}</span>
                    </div>
                  </div>
                  <p className="text-white/65 text-base leading-relaxed max-w-xl">{b.goal}</p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                {b.options ? (
                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    {b.options.map((opt, oi) => (
                      <div key={oi} className={`rounded-2xl border ${s.border} ${s.bg} overflow-hidden`}>
                        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                          <span className="text-xl">{opt.icon}</span>
                          <h4 className={`font-black text-lg ${s.text}`}>{opt.name}</h4>
                          <span className="ml-auto text-[10px] text-muted font-medium">{opt.days}</span>
                        </div>
                        <div className="p-3 space-y-1.5">
                          {opt.exercises.map((ex, ei) => (
                            <div key={ei} className="flex items-center justify-between bg-bg/70 border border-border/40 rounded-xl px-3 py-2.5 hover:border-border-bright transition-colors">
                              <span className="text-base text-text">{ex.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${s.bg} ${s.border} ${s.text}`}>{ex.sets}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 pb-3">
                          <p className="text-[10px] text-muted/60 italic">{opt.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    {b.steps.map((step, si) => {
                      const modalKey = `${activeDayBlock}-${si}`;
                      const hasModal = !!STEP_MODALS[modalKey];
                      return (
                        <div
                          key={si}
                          className={`group/step flex items-start gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3 transition-all duration-150 ${hasModal ? 'cursor-pointer hover:border-border-bright hover:bg-white/3' : 'hover:border-border-bright'}`}
                          onClick={hasModal ? () => setStepModal({ blockIdx: activeDayBlock, stepIdx: si }) : undefined}
                        >
                          <span className={`w-6 h-6 rounded-full ${s.bg} border ${s.border} ${s.text} text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>{si + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-text">{step.name}</p>
                            <p className="text-[10px] text-muted mt-0.5 leading-snug">{step.how}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 mt-0.5">
                            {hasModal && (
                              <span className={`text-[10px] font-bold opacity-0 group-hover/step:opacity-60 transition-opacity duration-150 ${s.text}`}>
                                chi tiết →
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${s.bg} ${s.border} ${s.text}`}>{step.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tips */}
                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">💡 Lưu ý quan trọng</p>
                  <ul className="space-y-2">
                    {b.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-base text-text/80 leading-relaxed">
                        <span className={`${s.text} shrink-0 mt-0.5 font-bold`}>·</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── WorkoutFramework (8 duration levels) ─────────────────────────────────── */}
      <WorkoutFramework />

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-8 mb-4">
        <Link
          to="/pillar/a/movements"
          className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>{tPillars('pillarA.sub_movements_name')}</span>
        </Link>
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-base bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-orange-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <Link
          to="/pillar/a/weekly"
          className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group"
        >
          <span>{tPillars('pillarA.sub_weekly_name')}</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      {/* Step detail modal — must be outside all wrappers to avoid position:fixed constraint */}
      {stepModal !== null && (() => {
        const key = `${stepModal.blockIdx}-${stepModal.stepIdx}`;
        const modalItem = STEP_MODALS[key];
        if (!modalItem) return null;
        const block = DAILY_BLOCKS[stepModal.blockIdx];
        const totalSteps = block.steps ? block.steps.length : 0;
        return (
          <StepModal
            item={modalItem}
            onClose={() => setStepModal(null)}
            onPrev={() => setStepModal(m => {
              const prevIdx = m.stepIdx - 1;
              if (prevIdx >= 0 && STEP_MODALS[`${m.blockIdx}-${prevIdx}`]) return { ...m, stepIdx: prevIdx };
              return m;
            })}
            onNext={() => setStepModal(m => {
              const nextIdx = m.stepIdx + 1;
              if (nextIdx < totalSteps && STEP_MODALS[`${m.blockIdx}-${nextIdx}`]) return { ...m, stepIdx: nextIdx };
              return m;
            })}
            hasPrev={stepModal.stepIdx > 0 && !!STEP_MODALS[`${stepModal.blockIdx}-${stepModal.stepIdx - 1}`]}
            hasNext={stepModal.stepIdx < totalSteps - 1 && !!STEP_MODALS[`${stepModal.blockIdx}-${stepModal.stepIdx + 1}`]}
          />
        );
      })()}
    </div>
  );
}
