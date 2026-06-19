import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#06b6d4';
const RGB = '6,182,212';
const ORBIT_ID = 'c-morning-orbit-kf';

const ROUTINE_5 = [
  {
    step: 1, time: '1 phút', action: 'Uống 1 ly nước (200–300ml)', why: 'Bổ sung nước sau 7–9 giờ không uống',
    icon: '💧', title: 'Uống 1 ly nước (200–300ml)', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 7–9 giờ không uống, cơ thể mất 0.5–1 lít qua hơi thở và mồ hôi khi ngủ. Mất nước nhẹ 1% đủ làm giảm hiệu suất nhận thức 5–10% — uống nước là "hack" đơn giản nhất và hiệu quả nhất của toàn bộ routine sáng.',
    detail: 'Não là 73% nước và là cơ quan nhạy cảm nhất với dehydration. Buổi sáng sau khi ngủ dậy, nhiều người nhầm triệu chứng thiếu nước (mệt mỏi, đầu nặng) với "chưa uống cà phê" — trong khi thực ra họ chỉ cần hydrate.',
    details: [
      'Trong 7–9 giờ ngủ, cơ thể mất khoảng 0.5–1 lít qua hơi thở (respiratory water loss) và mồ hôi không nhìn thấy — dù phòng mát và không ra mồ hôi thấy được.',
      'Mất nước 1% (700ml với người 70kg) làm giảm sự tập trung và tốc độ xử lý thông tin có thể đo được — bạn thường đạt ngưỡng này ngay khi vừa dậy.',
      'Uống nước trước cà phê: caffeine có tác dụng lợi tiểu nhẹ — uống cà phê khi đang thiếu nước làm tăng tác động tiêu cực. Hydrate trước để tối ưu cả hai.',
      'Nước lạnh (10–15°C) giúp tỉnh táo nhanh hơn: nhiệt độ thấp kích thích nhẹ hệ thần kinh giao cảm, tạo "shock" nhỏ tỉnh táo trong 60 giây đầu sau khi uống.',
      'Chuẩn bị từ tối hôm trước: để sẵn bình nước cạnh giường hoặc trên bàn trước nhà vệ sinh — giảm ma sát = tăng khả năng thực hiện hằng ngày.',
      'Thêm một nhúm muối hồng hoặc lát chanh: electrolytes giúp hấp thụ nước vào tế bào nhanh hơn (electrolyte gradient) — hữu ích đặc biệt sau đêm nóng hoặc tập thể dục.',
    ],
    points: [
      { icon: '🌊', label: 'Mất 0.5–1 lít khi ngủ', note: 'Hơi thở cũng mang nước ra — dù không thấy mồ hôi' },
      { icon: '🧠', label: '-1% nước = -5–10% nhận thức', note: 'Đạt ngưỡng này trước khi cảm thấy khát' },
      { icon: '❄️', label: 'Nước lạnh tỉnh táo hơn', note: '10–15°C kích thích hệ giao cảm nhẹ — tỉnh nhanh hơn' },
      { icon: '🍋', label: 'Thêm muối/chanh', note: 'Electrolytes giúp hấp thụ nước vào tế bào nhanh hơn' },
    ],
  },
  {
    step: 2, time: '1 phút', action: 'Mở rèm hoặc ra ngoài lấy ánh nắng', why: 'Tắt melatonin, bật cortisol tự nhiên',
    icon: '☀️', title: 'Mở rèm hoặc ra ngoài lấy ánh nắng', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng mặt trời sáng sớm là tín hiệu mạnh nhất để tắt melatonin, khuếch đại Cortisol Awakening Response và đặt lại đồng hồ sinh học 24h. Tín hiệu này quyết định thời điểm bạn buồn ngủ tối nay — 12–16 giờ sau.',
    detail: 'Tế bào ipRGC trong võng mạc gửi tín hiệu trực tiếp đến SCN (đồng hồ sinh học chủ) khi nhận ánh sáng mạnh. SCN đặt "timer" cho toàn bộ nhịp hormone 24h dựa trên tín hiệu ánh sáng này — ảnh hưởng đến cortisol, melatonin, nhiệt độ cơ thể và năng lượng suốt ngày.',
    details: [
      'Melatonin — hormone gây buồn ngủ — cần ánh sáng mạnh để ngừng sản xuất. Phòng tối sau khi dậy kéo dài "đêm sinh học", làm chậm quá trình tỉnh táo thêm 30–60 phút.',
      'Ánh nắng trực tiếp ngoài trời đạt 10.000–100.000 lux — gấp 20–200 lần ánh đèn trong nhà (100–500 lux). Mở rèm để ánh sáng khuếch tán vào (~1.000–3.000 lux) vẫn hiệu quả hơn nhiều so với đèn điện.',
      'Không cần nhìn thẳng vào mặt trời: ánh sáng khuếch tán từ bầu trời xanh đã đủ kích hoạt ipRGC — chỉ cần mắt mở ra ngoài, không cần đeo kính và không cần nắng trực tiếp.',
      'Tác động kép lên cortisol: ánh sáng sáng sớm kích thích trục HPA tăng cortisol thêm ngoài CAR tự nhiên — tạo "double boost" năng lượng mà không cần caffeine.',
      'Đặt timer melatonin tối nay: ra ngoài lúc 7h → melatonin tiết khoảng 21–22h. Không nhận đủ ánh sáng sáng → melatonin tiết muộn → khó ngủ đúng giờ dù mệt.',
      'Ngày흐u/mưa: vẫn mở rèm hoặc ra ngoài — ánh sáng tán xạ ngoài trời ngày흐u (1.000–5.000 lux) vẫn mạnh hơn đèn trong nhà 10–50 lần.',
    ],
    points: [
      { icon: '🌅', label: 'Tắt melatonin ngay', note: 'Ánh sáng mạnh dừng sản xuất melatonin — tỉnh hơn ngay' },
      { icon: '⚡', label: 'Khuếch đại CAR', note: 'Ánh sáng + cortisol tự nhiên = double boost sáng' },
      { icon: '🕙', label: 'Đặt giờ ngủ tối nay', note: 'Ánh sáng 7h → melatonin tiết 21–22h — ngủ đúng giờ' },
      { icon: '🌧️', label: 'Ngày흐u vẫn hiệu quả', note: 'Khuếch tán ngoài trời vẫn 10–50x mạnh hơn đèn nhà' },
    ],
  },
  {
    step: 3, time: '1 phút', action: 'Đi bộ nhẹ tại chỗ 50–100 bước', why: 'Tăng nhịp tim nhẹ, bật hệ tuần hoàn',
    icon: '🚶', title: 'Đi bộ nhẹ tại chỗ 50–100 bước', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '50–100 bước đi bộ nhẹ đủ để tăng nhịp tim 10–15%, bắt đầu tiết dopamine và norepinephrine, và tăng nhiệt độ cơ thể nhẹ — ba tín hiệu sinh học quan trọng báo cho não "ngày đã bắt đầu".',
    detail: 'Sau 7–9 giờ nằm yên, hệ tuần hoàn đang ở tốc độ tối thiểu. Cơ bắp chân hoạt động như "bơm phụ" cho tim — khi co rút trong khi đi bộ, chúng đẩy máu từ tĩnh mạch chân lên tim và phân phối oxygen đến não hiệu quả hơn ngay lập tức.',
    details: [
      'Sau 7–9 giờ nằm yên, huyết áp và nhịp tim ở mức thấp nhất trong ngày — đứng dậy và đi bộ nhẹ ngay giúp cơ thể chuyển dần từ nghỉ sang hoạt động mà không bị chóng mặt đứng.',
      'Cơ bắp chân hoạt động như "bơm phụ" cho tim: khi co rút khi đi bộ, chúng đẩy máu từ tĩnh mạch chân lên tim. 50–100 bước đủ để kích hoạt cơ chế bơm này có tác động đo được.',
      'Dopamine và norepinephrine bắt đầu tăng sau vài phút vận động nhẹ — hai neurotransmitter này cải thiện động lực và tập trung, duy trì hiệu ứng 2–4 giờ sau khi dừng.',
      'Nhiệt độ cơ thể tăng nhẹ khi vận động — nhiệt độ cơ thể liên quan trực tiếp đến mức tỉnh táo: ấm hơn = tỉnh táo hơn. Đây là lý do tắm nóng buổi sáng cũng giúp tỉnh.',
      '50–100 bước chỉ mất ~1 phút — quá ngắn để cảm thấy phải "tập thể dục", nhưng đủ để cơ thể chuyển trạng thái. Ngưỡng tâm lý thấp giúp duy trì thói quen dễ hơn.',
      'Cộng dồn với ánh sáng (bước 2): đi bộ nhẹ + ánh sáng tự nhiên = tác động circadian và thần kinh cộng dồn — hiệu quả hơn từng thứ riêng lẻ.',
    ],
    points: [
      { icon: '❤️', label: 'Bật hệ tuần hoàn', note: 'Cơ bắp chân bơm máu lên tim — oxygen đến não nhanh hơn' },
      { icon: '🎯', label: 'Dopamine + Norepinephrine', note: 'Bắt đầu tăng sau vài phút — hiệu ứng kéo dài 2–4 giờ' },
      { icon: '🌡️', label: 'Nhiệt độ cơ thể tăng nhẹ', note: 'Ấm hơn = tỉnh táo hơn — cơ chế trực tiếp của não' },
      { icon: '🧘', label: 'Ngưỡng tâm lý thấp', note: '50–100 bước — dễ làm hằng ngày hơn từ "tập thể dục"' },
    ],
  },
  {
    step: 4, time: '1 phút', action: 'Xoay vai × 10, xoay hông × 10', why: 'Giảm cứng khớp sau khi ngủ',
    icon: '🔄', title: 'Xoay vai × 10, xoay hông × 10', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Khớp vai và hông là hai khớp có phạm vi chuyển động lớn nhất và cứng nhất sau một đêm bất động. Xoay tròn 10 lần mỗi khớp bơm dịch khớp (synovial fluid) trở lại, giảm cứng và đau buổi sáng trong dưới 1 phút.',
    detail: 'Khớp không có mạch máu trực tiếp — chúng nhận chất dinh dưỡng và bôi trơn thông qua dịch khớp được bơm ra khi khớp chuyển động. Sau 7–9 giờ bất động, dịch khớp giảm lưu thông, gây cảm giác cứng và đau nhẹ buổi sáng.',
    details: [
      'Dịch khớp (synovial fluid) bôi trơn và nuôi dưỡng sụn khớp — cần được "bơm" vào khớp thông qua chuyển động. Sau đêm bất động, dịch khớp giảm lưu thông và khớp trở nên cứng hơn.',
      'Xoay tròn là chuyển động hiệu quả nhất để bơm dịch khớp: chuyển động tròn kích hoạt toàn bộ phạm vi chuyển động, phân phối dịch khớp đều hơn chuyển động tuyến tính.',
      'Vai và hông cứng nhất sau ngủ vì: vai thường ở vị trí cúi về trước khi nằm, hông ở vị trí gập khi nằm nghiêng — cả hai bị co cụm trong nhiều giờ.',
      'Tiếng "kêu" khi xoay khớp buổi sáng là bình thường: thường là bóng khí nitơ trong dịch khớp nổ — không gây hại và thường đi kèm cảm giác nhẹ nhõm ngay lập tức.',
      'Tác dụng lên thần kinh: stretch receptors trong cơ và khớp gửi tín hiệu lên não khi được kích hoạt — "thức dậy" hệ thần kinh vận động và tăng nhận thức về cơ thể (proprioception).',
      'Mở rộng sau 1 tuần: thêm xoay cổ và cổ tay, cổ chân — 5 khớp × 10 lần = 3 phút mobility toàn thân đủ để giảm cứng sau ngủ hoàn toàn.',
    ],
    points: [
      { icon: '💧', label: 'Bơm dịch khớp', note: 'Chuyển động tròn phân phối synovial fluid — giảm cứng ngay' },
      { icon: '🎯', label: 'Vai + hông trước tiên', note: 'Hai khớp cứng nhất sau ngủ — ưu tiên xoay tròn' },
      { icon: '🔊', label: 'Tiếng kêu là bình thường', note: 'Bóng khí nitơ — không gây hại, thường kèm cảm giác nhẹ' },
      { icon: '🧠', label: 'Thức dậy hệ thần kinh', note: 'Stretch receptors → não nhận tín hiệu "cơ thể chuyển động"' },
    ],
  },
  {
    step: 5, time: '1 phút', action: 'Hít thở sâu 4–6 nhịp chậm', why: 'Oxy cho não, giảm cortisol lo âu',
    icon: '🌬️', title: 'Hít thở sâu 4–6 nhịp chậm', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: '4–6 nhịp thở sâu bằng cơ hoành (4 giây hít vào – 6 giây thở ra) kích hoạt dây thần kinh phế vị (vagus nerve), giảm nhịp tim, hạ cortisol lo âu và chuyển hệ thần kinh từ "chiến đấu/bay" sang "nghỉ ngơi/tập trung" trong dưới 1 phút.',
    detail: 'Hơi thở là cơ chế duy nhất bạn có thể điều khiển ý thức để trực tiếp tác động lên hệ thần kinh tự chủ. Thở ra dài hơn hít vào kích hoạt vagus nerve — giảm nhịp tim, hạ cortisol lo âu và tăng cảm giác bình tĩnh ngay lập tức.',
    details: [
      'Thở ra dài hơn hít vào (tỷ lệ 4:6 hoặc 4:8) kích hoạt dây thần kinh phế vị (vagus nerve) — kết nối trực tiếp não với tim, phổi và tiêu hóa. Kích hoạt vagal = giảm nhịp tim, giảm cortisol stress.',
      'Thở cơ hoành (bụng phình ra khi hít vào) hiệu quả hơn thở ngực: cơ hoành chiếm 2/3 dung tích phổi — thở ngực chỉ dùng 1/3 phổi trên, kém oxygen so với thở bụng đầy đủ.',
      '4–6 nhịp thở chậm đủ để đo được thay đổi trong HRV (heart rate variability) — chỉ số sức khỏe thần kinh tự chủ. HRV cao hơn = hệ thần kinh linh hoạt và phục hồi tốt hơn.',
      'Buổi sáng check điện thoại ngay khi dậy kích hoạt cortisol lo âu (stress cortisol) và duy trì trạng thái reactive cả ngày. 4–6 nhịp thở đặt lại trạng thái thần kinh trước khi tiếp xúc thông tin.',
      'Kết hợp với bước 4 (mobility): sau xoay khớp chuyển sang thở chậm — tạo sự tương phản rõ rệt giữa "chuyển động" và "tĩnh lặng", não nhận hai tín hiệu bổ trợ: cơ thể sẵn sàng + tâm trí bình tĩnh.',
      'Mở rộng: box breathing (4-4-4-4: hít 4, nín 4, thở 4, nín 4) được Navy SEALs dùng kiểm soát lo âu dưới áp lực. Bắt đầu với 4:6 đơn giản hơn và cũng hiệu quả.',
    ],
    points: [
      { icon: '🫁', label: 'Thở bụng > thở ngực', note: 'Cơ hoành = 2/3 phổi — thở bụng cho nhiều oxy hơn' },
      { icon: '💚', label: 'Kích hoạt vagus nerve', note: 'Thở ra dài → giảm nhịp tim, hạ cortisol stress ngay' },
      { icon: '📊', label: 'Tăng HRV ngay', note: 'Heart rate variability tăng sau 4–6 nhịp — đo được' },
      { icon: '🧘', label: 'Reset trạng thái thần kinh', note: 'Từ reactive/anxious → calm/focused trước khi bắt đầu ngày' },
    ],
  },
];

const ROUTINE_10 = [
  {
    step: 1, time: '2 phút', action: 'Uống nước + mở cửa sổ/ra ngoài lấy ánh sáng tự nhiên', why: 'Hydrate + báo hiệu bắt đầu ngày',
    icon: '💧☀️', title: 'Uống nước + Lấy ánh sáng tự nhiên', color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hai phút đầu tiên của 10-minute routine kết hợp hai tín hiệu sinh học quan trọng nhất: nước (hydrate não sau 7–9 giờ thiếu nước) và ánh sáng (đặt lại đồng hồ sinh học 24h). Làm đồng thời = tiết kiệm thời gian và khuếch đại hiệu quả cộng dồn.',
    detail: 'Mở cửa sổ uống nước trong ánh sáng sáng sớm — hai giây đơn giản tạo ra cascade sinh học: melatonin giảm, cortisol tăng, não được hydrate. Đây là bộ đôi nền tảng của mọi morning routine hiệu quả.',
    details: [
      'Uống 200–300ml nước lạnh ngay khi dậy: bù lại 0.5–1 lít mất qua hơi thở và mồ hôi khi ngủ, cung cấp nước cho não (73% nước) để hoạt động nhận thức bình thường.',
      'Mở cửa sổ hoặc ra ngoài cùng lúc: ánh sáng tự nhiên kích hoạt ipRGC trong võng mạc — gửi tín hiệu đặt lại đồng hồ sinh học SCN trong khi bạn uống nước.',
      'Hai phút trong ánh sáng sáng (ngay cả qua cửa sổ kính): hiệu quả hơn đèn trong nhà 5–20 lần về tín hiệu circadian, giúp melatonin giảm nhanh hơn và cortisol tăng đúng chu kỳ.',
      'Không mở điện thoại trong 2 phút này: uống nước + ánh sáng là "first input" của ngày — cho não nhận tín hiệu sinh học trước thông tin xã hội để tránh cortisol lo âu sớm.',
      '10-minute routine hiệu quả vì kết hợp: 2 phút này làm đồng thời hai việc mà 5-minute routine làm riêng biệt (bước 1 và 2) — tối ưu hóa thời gian mà không mất hiệu quả.',
      'Biến thể: pha nước ấm với chanh và uống bên cửa sổ — kết hợp hydration + vitamin C + ánh sáng + hơi ấm giúp tỉnh táo đa chiều.',
    ],
    points: [
      { icon: '🔗', label: 'Kết hợp = cộng dồn', note: 'Nước + ánh sáng cùng lúc — hiệu quả hơn làm riêng lẻ' },
      { icon: '📵', label: 'Không điện thoại', note: 'Cho não nhận tín hiệu sinh học trước thông tin xã hội' },
      { icon: '⏱️', label: '2 phút thay 2 bước riêng', note: '10-minute routine tối ưu thời gian bằng cách kết hợp' },
      { icon: '🍋', label: 'Biến thể nước ấm chanh', note: 'Hydration + vitamin C + ánh sáng — tỉnh táo đa chiều' },
    ],
  },
  {
    step: 2, time: '3 phút', action: 'Đi bộ nhẹ (trong nhà, ra hành lang hoặc ngoài trời)', why: 'Tăng nhiệt độ cơ thể, bật năng lượng',
    icon: '🚶', title: 'Đi bộ nhẹ 3 phút', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '3 phút đi bộ nhẹ tăng nhiệt độ cơ thể 0.2–0.5°C, tiết dopamine và norepinephrine có thể đo được, và bơm máu đến não nhanh hơn. Hiệu ứng này kéo dài 2–4 giờ — dài hơn nhiều so với 3 phút bỏ ra.',
    detail: '3 phút dài hơn 1 phút (ROUTINE_5) đủ để đạt nhiệt độ cơ thể tăng ổn định, tăng nhịp tim lên 20–30% và tiết đủ endorphin nhẹ — đặt nền năng lượng cho phần còn lại của routine.',
    details: [
      'Nhiệt độ cơ thể là chỉ số tốt nhất dự đoán mức tỉnh táo: tăng 0.2–0.5°C trong 3 phút đi bộ nhẹ đủ để cảm nhận được sự khác biệt trong mức tỉnh táo và tốc độ tư duy.',
      'Cơ bắp chân là "bơm phụ" lớn nhất cho tim — 3 phút đi bộ đủ để hệ tuần hoàn chuyển từ chế độ nghỉ ngơi (lưu lượng máu thấp) sang chế độ hoạt động có oxy đầy đủ cho não.',
      'Đi bộ trong nhà hoàn toàn hiệu quả: không cần thay quần áo, không cần chuẩn bị, không cần thời tiết tốt — giảm rào cản tâm lý là lý do chính để thói quen bền vững.',
      'Kết hợp với bước 1 (ánh sáng): nếu ra ngoài đi bộ, bạn nhận thêm ánh sáng tự nhiên — hiệu quả circadian tăng gấp đôi so với đi bộ trong nhà.',
      'Norepinephrine tăng trong 3 phút đi bộ nhẹ: neurotransmitter này cải thiện khả năng chú ý và xử lý thông tin — bạn sẽ đọc/nghe/xử lý thông tin hiệu quả hơn sau khi đi bộ so với ngồi ngay.',
      'Biến thể ngày bận: leo 2–3 tầng cầu thang = 2 phút vận động nhẹ đủ hiệu quả — tích lũy "movement snacks" ngắn có tác động circadian và thần kinh tương tự.',
    ],
    points: [
      { icon: '🌡️', label: '+0.2–0.5°C nhiệt độ cơ thể', note: 'Ấm hơn = tỉnh táo hơn — cơ chế trực tiếp' },
      { icon: '🏠', label: 'Trong nhà hoàn toàn ổn', note: 'Không cần thời tiết tốt — giảm rào cản thói quen' },
      { icon: '🧠', label: 'Norepinephrine + tập trung', note: 'Đọc/xử lý thông tin hiệu quả hơn sau khi đi bộ' },
      { icon: '🪜', label: 'Cầu thang = movement snack', note: 'Leo 2–3 tầng = 2 phút vận động nhẹ hiệu quả' },
    ],
  },
  {
    step: 3, time: '3 phút', action: 'Mobility nhẹ: cổ vai gáy + xoay hông + vươn người', why: 'Giảm căng cơ, cải thiện tư thế ngày mới',
    icon: '🔄', title: 'Mobility nhẹ: cổ vai gáy + xoay hông + vươn người', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: '3 phút mobility nhẹ kết hợp 3 khu vực: cổ/vai/gáy (hay căng nhất sau ngủ), hông (bị co cụm khi nằm nghiêng) và vươn người toàn thân (giải phóng cột sống). Đây là phiên bản đầy đủ hơn so với chỉ xoay vai + hông trong routine 5 phút.',
    detail: 'Tư thế buổi sáng thiết lập tư thế cả ngày. Cổ và vai căng → ngồi gù → đau lưng chiều. 3 phút mobility nhẹ phá vỡ pattern "cứng" từ giấc ngủ và thiết lập tư thế tốt hơn cho cả ngày làm việc.',
    details: [
      'Cổ và gáy: sau đêm ngủ gối cao hoặc không đúng tư thế, cơ ức đòn chũm và cơ thang thường bị co cụm. Xoay cổ tròn nhẹ (không nhanh, không gập quá mức) và cúi nghiêng 2 bên × 5 giây.',
      'Vai: shoulder roll về phía sau (10 vòng) chống lại tư thế vai cúi về trước của người làm việc máy tính. Kéo vai về sau và giữ 5 giây × 3 lần giải phóng cơ ngực và cơ thang trước.',
      'Xoay hông: đứng hai tay trên hông, xoay hông tròn 10 vòng mỗi chiều — bơm dịch khớp háng và giải phóng cơ gập hông (hip flexor) bị co cụm sau khi nằm nhiều giờ.',
      'Vươn người toàn thân: giơ tay lên cao hết mức, đứng trên đầu ngón chân, giữ 5–10 giây — kéo giãn toàn bộ cột sống, cơ liên sườn và cơ bụng, cải thiện tư thế đứng thẳng.',
      'Thứ tự quan trọng: từ trên xuống (cổ → vai → hông → toàn thân) theo luồng thần kinh từ não xuống — não nhận tín hiệu "toàn bộ cơ thể đã sẵn sàng" một cách tuần tự.',
      'Dịch khớp và fascia: bên cạnh dịch khớp, fascia (mô liên kết bao quanh cơ) cũng trở nên "dính" sau nhiều giờ bất động. Mobility nhẹ giải phóng fascia, giảm cảm giác căng cứng toàn thân.',
    ],
    points: [
      { icon: '🦒', label: 'Cổ + vai + gáy', note: 'Hay căng nhất sau ngủ — ưu tiên xoay tròn chậm' },
      { icon: '🔄', label: 'Hông 10 vòng mỗi chiều', note: 'Bơm dịch khớp háng + giải phóng hip flexor' },
      { icon: '🙆', label: 'Vươn người toàn thân', note: 'Kéo giãn cột sống + cơ liên sườn — cải thiện tư thế ngày' },
      { icon: '⬇️', label: 'Từ trên xuống dưới', note: 'Cổ → vai → hông → toàn thân — theo luồng thần kinh' },
    ],
  },
  {
    step: 4, time: '2 phút', action: 'Thở chậm + xác định 1 việc quan trọng nhất hôm nay', why: 'Định hướng tâm trí, giảm lo âu sáng sớm',
    icon: '🎯', title: 'Thở chậm + MIT (Most Important Task)', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Kết hợp thở chậm (giảm cortisol lo âu) và xác định MIT — Most Important Task — tạo ra sự chuyển đổi từ "reactive mode" (phản ứng với những gì xảy đến) sang "intentional mode" (chủ động quyết định ngày hôm nay sẽ là gì).',
    detail: 'Não buổi sáng dễ bị kéo vào chế độ reactive: check email → phản ứng với yêu cầu người khác → ngày bị chi phối bởi agenda của người khác. 2 phút thở chậm + 1 câu MIT tạo ra "bộ đệm" giữa giấc ngủ và thế giới ngoài kia.',
    details: [
      'Thở chậm 4:6 (hít 4 giây – thở 6 giây) trong 1 phút: kích hoạt vagus nerve, giảm cortisol stress, tăng HRV — chuyển hệ thần kinh từ sympathetic (căng thẳng) sang parasympathetic (bình tĩnh tập trung).',
      'MIT (Most Important Task): xác định 1 việc — chỉ 1 — mà nếu hoàn thành hôm nay, ngày sẽ cảm thấy thành công. Không phải danh sách, không phải goal lớn — 1 hành động cụ thể có thể hoàn thành trong ngày.',
      'Xác định MIT khi não ở trạng thái bình tĩnh (sau thở chậm) cho kết quả khác với xác định khi vội vã hoặc lo lắng: bạn chọn được việc thực sự quan trọng, không phải việc gây nhiều lo lắng nhất.',
      'MIT giúp đặt "default action": khi không biết làm gì tiếp theo trong ngày, não tự động quay về MIT thay vì mở email hoặc social media — giảm procrastination.',
      'Viết MIT ra giấy (không điện thoại): hành động viết tay củng cố commitment và giúp não xử lý thông tin sâu hơn nhập liệu số. 1 câu ngắn đủ — "Hoàn thành proposal cho khách hàng X."',
      'Kết thúc bằng 3 nhịp thở sâu: tạo cảm giác "sẵn sàng bắt đầu" — không còn nằm trong giấc ngủ, không còn hỗn loạn thông tin, nhưng đang ở trạng thái calm + intentional + focused.',
    ],
    points: [
      { icon: '🌬️', label: 'Thở 4:6 trong 1 phút', note: 'Vagus nerve → bình tĩnh → cortisol stress giảm ngay' },
      { icon: '🎯', label: 'Chỉ 1 MIT — không phải list', note: 'Nếu hoàn thành 1 việc này, ngày sẽ thành công' },
      { icon: '✍️', label: 'Viết tay, không điện thoại', note: 'Cam kết sâu hơn, tránh bị kéo vào notifications' },
      { icon: '🛡️', label: 'Bộ đệm chống reactive mode', note: 'Intentional mode: ngày do bạn quyết định, không phải inbox' },
    ],
  },
];

const ROUTINE_20 = [
  {
    step: 1, time: '3 phút', action: 'Uống nước + ánh sáng tự nhiên + journal 1 câu', why: 'Hydrate, tín hiệu ngày mới, khởi động tư duy',
    icon: '📓', title: 'Nước + Ánh sáng + Journal 1 câu', color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Journal 1 câu sáng sớm — trong trạng thái vừa dậy, trước khi não bị "ô nhiễm" bởi thông tin ngoài — là thời điểm tiếp cận suy nghĩ thật nhất của mình. Chỉ 1 câu đủ để khởi động tư duy và tạo tư liệu phản chiếu cá nhân có giá trị.',
    detail: 'Ba phút này là "bộ ba khởi động" hoàn chỉnh: nước (hydrate não), ánh sáng (đặt lại nhịp sinh học) và journal (khởi động tư duy có chủ đích). Làm đồng thời hoặc tuần tự trong 3 phút — bước nền tảng cho 20-minute routine.',
    details: [
      'Uống 200–300ml nước cùng lúc mở rèm: tiết kiệm thời gian khi kết hợp hydration + tín hiệu ánh sáng circadian — não nhận hai tín hiệu sinh học nền tảng trong 1 phút.',
      'Journal 1 câu: có thể là cảm xúc sáng dậy ("Hôm nay cảm thấy..."), điều đang lo lắng ("Điều đang chiếm tâm trí nhất là..."), hoặc intention ("Hôm nay tôi muốn...") — không cần đúng chính tả hay hay.',
      'Não buổi sáng ở trạng thái alpha (thư giãn) sau khi ngủ — trước khi check email hoặc tin tức, đây là cửa sổ hiếm để truy cập suy nghĩ sâu hơn và sáng tạo hơn. Journal 1 câu bắt lấy cửa sổ này.',
      'Không cần sổ đẹp hay cây bút tốt: bất kỳ tờ giấy nào, bút bic đều được. Rào cản vật chất thấp = khả năng thực hiện hằng ngày cao hơn.',
      'Sau 30 ngày journal: đọc lại 30 câu trong 5 phút — pattern suy nghĩ, cảm xúc tái diễn và điều đang thực sự ưu tiên sẽ nổi rõ. Đây là tư liệu tự nhận thức (self-awareness) có giá trị nhất.',
      '20-minute routine có journal vì đủ thời gian để không vội — 3 phút cho bộ ba này, không phải 3 phút gộp 2 việc vội vã.',
    ],
    points: [
      { icon: '🔗', label: 'Bộ ba không tách rời', note: 'Nước + ánh sáng + journal — ba tín hiệu nền tảng cho ngày' },
      { icon: '✍️', label: 'Chỉ 1 câu', note: 'Không cần hay, không cần dài — bắt lấy suy nghĩ đầu ngày' },
      { icon: '🌅', label: 'Cửa sổ alpha sáng sớm', note: 'Não ở trạng thái sáng tạo/sâu hơn trước khi check thông tin' },
      { icon: '📊', label: 'Tư liệu 30 ngày', note: 'Đọc lại sau 1 tháng — pattern suy nghĩ và ưu tiên nổi rõ' },
    ],
  },
  {
    step: 2, time: '5 phút', action: 'Đi bộ ngoài trời + hít thở không khí sáng', why: 'Nhiệt độ cơ thể tăng, cortisol khỏe mạnh',
    icon: '🌿', title: 'Đi bộ ngoài trời 5 phút', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút đi bộ ngoài trời buổi sáng là liều dopamine/serotonin/norepinephrine và ánh sáng circadian kết hợp — hiệu ứng thần kinh và sinh học mạnh nhất có thể đạt được trong 5 phút mà không cần bất kỳ thiết bị hay supplement nào.',
    detail: 'Khác với routine 5 phút (đi bộ tại chỗ) và 10 phút (đi bộ trong nhà), routine 20 phút ưu tiên đi bộ ngoài trời — nhận thêm ánh sáng tự nhiên, không khí tươi và thay đổi môi trường. Ba yếu tố này cộng dồn tác động thần kinh và circadian vượt trội so với đi bộ trong nhà.',
    details: [
      'Đi bộ ngoài trời 5 phút = vận động nhẹ (dopamine/norepinephrine) + ánh sáng tự nhiên (circadian reset) + không khí tươi (CO2 giảm, O2 tăng) + thay đổi môi trường (visual novelty kích thích não). Bốn lợi ích trong 1 hoạt động.',
      'Không khí tươi sáng sớm thường có nồng độ CO2 thấp hơn trong nhà — CO2 cao trong phòng ngủ kín sau đêm làm giảm sự tỉnh táo và tăng cảm giác "mù mờ" buổi sáng.',
      'Visual novelty (nhìn thấy môi trường thay đổi khi đi bộ) kích thích dopamine nhẹ — não phản ứng với sự mới lạ bằng cách tiết dopamine. Đây là lý do đi bộ ngoài thường cảm thấy "tốt hơn" đi bộ trên máy chạy bộ cùng tốc độ.',
      'Cortisol khỏe mạnh (healthy cortisol) vs cortisol stress: CAR + ánh sáng sáng sớm tạo ra spike cortisol sinh lý bình thường giúp tỉnh táo. Đây là cortisol "tốt" — khác hoàn toàn với cortisol do lo âu hay căng thẳng.',
      'Nhiệt độ cơ thể tăng 0.5–1°C sau 5 phút đi bộ ngoài trời — cao hơn đi bộ trong nhà vì cơ thể cần làm việc nhiều hơn để duy trì nhiệt khi tiếp xúc không khí lạnh buổi sáng.',
      'Ngày mưa: mặc áo và đi ra ngoài 5 phút vẫn hiệu quả — ánh sáng khuếch tán (1.000–5.000 lux ngày흐u) + không khí tươi + thay đổi môi trường vẫn cung cấp đủ ba lợi ích chính.',
    ],
    points: [
      { icon: '🌟', label: '4 lợi ích trong 5 phút', note: 'Vận động + ánh sáng + không khí + visual novelty cộng dồn' },
      { icon: '💨', label: 'Không khí tươi sáng sớm', note: 'CO2 thấp hơn trong nhà — giảm "mù mờ" buổi sáng' },
      { icon: '🎲', label: 'Visual novelty = dopamine', note: 'Não tiết dopamine khi nhìn môi trường thay đổi khi đi bộ' },
      { icon: '🌧️', label: 'Ngày mưa: mặc áo và đi', note: 'Ánh sáng tán xạ + không khí tươi vẫn đủ 3 lợi ích chính' },
    ],
  },
  {
    step: 3, time: '7 phút', action: 'Mobility + kéo giãn toàn thân (xem bài tập bên dưới)', why: 'Chuẩn bị cơ thể cho ngày dài',
    icon: '🧘', title: 'Mobility + kéo giãn toàn thân 7 phút', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: '7 phút mobility buổi sáng — dài nhất trong 3 phiên bản routine — đủ để thực hiện đầy đủ 5 bài tập mobility (Chin tuck, Shoulder roll, Xoay hông, Thoracic extension, World\'s greatest stretch) và kéo giãn tĩnh nhẹ. Đây là phiên bản chuyên sâu nhất cho tư thế và phòng ngừa đau.',
    detail: '7 phút là đủ thời gian để não và cơ thể thực sự "vào" trạng thái tập — không vội vàng, không bỏ qua khu vực nào. Mobility đầy đủ buổi sáng tác động đến tư thế cả ngày và giảm nguy cơ đau cổ vai gáy và lưng dài hạn.',
    details: [
      'Chin tuck (1 phút): kéo cằm vào, giữ 5 giây × 10 lần — chống lại "forward head posture" (đầu chìa về trước) do nhìn màn hình. Một trong những bài tập quan trọng nhất cho dân văn phòng.',
      'Shoulder roll (1 phút): 10 vòng ra sau + 10 vòng ra trước + kéo vai về sau giữ 5 giây × 3 lần — chống lại vai cúi về trước và giải phóng cơ ngực bị co cụm sau ngủ.',
      'Xoay hông (1 phút): 10 vòng mỗi chiều đứng + hip flexor stretch 30 giây mỗi bên — giải phóng cơ gập hông bị co cụm sau nhiều giờ nằm và ngồi.',
      'Thoracic extension (2 phút): nằm sấp Cobra pose hoặc đứng tay sau gáy, mở ngực về phía sau — counter lại tư thế ngồi cúi gù. Thoracic spine (ngực giữa) là khu vực bị bỏ quên nhất.',
      'World\'s greatest stretch (2 phút): 5 lần mỗi bên — kéo giãn hip flexor, xoay ngực, mở vai và kéo giãn hamstring trong 1 bài tập đa khớp. Được gọi là "greatest" vì cover nhiều nhóm cơ nhất trong ít thời gian nhất.',
      'Sau 7 phút: cơ thể ở nhiệt độ cao hơn, dịch khớp đã phân phối đều, cơ giải phóng, tư thế cải thiện rõ — nền tảng tốt nhất cho công việc dài và tập luyện chính buổi chiều.',
    ],
    points: [
      { icon: '🦒', label: 'Chin tuck quan trọng nhất', note: 'Chống forward head posture cho dân nhìn màn hình' },
      { icon: '💪', label: 'Thoracic extension', note: 'Khu vực bị bỏ quên nhất — mở ngực, chống gù lưng' },
      { icon: '🌟', label: "World's greatest stretch", note: 'Cover nhiều nhóm cơ nhất trong ít thời gian nhất' },
      { icon: '📈', label: '7 phút đủ thời gian vào', note: 'Không vội vàng — não và cơ thể thực sự vào trạng thái tập' },
    ],
  },
  {
    step: 4, time: '3 phút', action: 'Thiền nhẹ hoặc thở cơ hoành + review 3 việc chính', why: 'Tâm trí bình tĩnh, focus cao',
    icon: '🧘', title: 'Thiền nhẹ + Review 3 việc chính', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thiền nhẹ 2 phút + review 3 việc quan trọng nhất 1 phút là bước chuyển đổi từ "cơ thể sẵn sàng" sang "tâm trí sẵn sàng" — kết thúc phần sinh học của routine và bắt đầu phần nhận thức, intention và priorities.',
    detail: '3 phút thiền nhẹ cuối routine không cần kỹ thuật phức tạp — chỉ ngồi yên, mắt nhắm, theo dõi hơi thở và để suy nghĩ đến rồi đi. Sau đó mở mắt, viết 3 việc quan trọng nhất hôm nay. Sự đơn giản này là điểm mạnh, không phải điểm yếu.',
    details: [
      '2 phút thiền nhẹ: ngồi thoải mái, mắt nhắm, tập trung vào hơi thở ra vào. Không cần "không suy nghĩ" — chỉ cần nhận ra mỗi khi tâm trí lang thang và nhẹ nhàng quay về hơi thở. Mỗi lần quay về = 1 lần tập "chú ý" cơ bắp thần kinh.',
      'Không có gì thần bí trong thiền: thực chất là "attention training" — luyện khả năng phát hiện tâm trí đang ở đâu và điều chỉnh nó. Kỹ năng này áp dụng trực tiếp vào công việc, học tập và giao tiếp.',
      'Sau 2 phút thiền: mở mắt, viết 3 việc quan trọng nhất hôm nay (không phải urgent, không phải dễ — mà là quan trọng nhất). Review trong 1 phút — hình dung rõ mỗi việc sẽ diễn ra như thế nào.',
      '3 việc vs 1 việc (MIT của routine 10 phút): routine 20 phút có đủ thời gian để xác định 3 việc với độ sâu hơn — vẫn đặt thứ tự ưu tiên (việc 1 là MIT, 2 và 3 là secondary).',
      'Mental rehearsal sau khi viết: hình dung làm xong từng việc — não không phân biệt rõ giữa tưởng tượng và thực hiện trong quá trình chuẩn bị. Mental rehearsal tăng khả năng thực hiện thực tế.',
      'Kết thúc bằng 1 nhịp thở sâu và mở mắt chậm: tín hiệu "routine kết thúc, ngày bắt đầu" — chuyển đổi có chủ đích từ trạng thái chuẩn bị sang trạng thái hành động.',
    ],
    points: [
      { icon: '🎯', label: '3 việc quan trọng nhất', note: 'Không phải urgent, không phải dễ — mà là important nhất' },
      { icon: '🔁', label: 'Thiền = attention training', note: 'Mỗi lần quay về hơi thở = 1 lần tập cơ chú ý thần kinh' },
      { icon: '🎬', label: 'Mental rehearsal', note: 'Hình dung làm xong từng việc — tăng khả năng thực hiện thật' },
      { icon: '🚪', label: 'Cửa chuyển tiếp cơ thể → tâm trí', note: 'Kết thúc phần sinh học, bắt đầu phần nhận thức của ngày' },
    ],
  },
  {
    step: 5, time: '2 phút', action: 'Bữa ăn có đạm hoặc uống nước protein', why: 'Ổn định đường huyết, năng lượng bền',
    icon: '🥚', title: 'Bữa sáng có đạm / Protein shake', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa sáng có đạm (protein) là bước duy nhất trong routine 20 phút liên quan đến thực phẩm — vì đây là bước đủ quan trọng để được đưa vào lịch trình. Đạm buổi sáng ổn định đường huyết 3–4 giờ và giảm cravings tinh bột về trưa.',
    detail: 'Sau routine vận động và thiền, cơ thể cần nhiên liệu để chạy phần còn lại của ngày. Đạm là macro ưu việt nhất cho bữa sáng: tiêu hóa chậm, no lâu, không gây spike đường huyết và hỗ trợ tổng hợp neurotransmitter (serotonin, dopamine cần amino acids từ đạm).',
    details: [
      'Đạm no lâu nhất trong 3 macro: tiêu hóa mất 3–5 giờ (so với carb 1–2 giờ), ức chế ghrelin (hormone đói) hiệu quả và duy trì đường huyết ổn định đến bữa trưa.',
      'Amino acids từ đạm là nguyên liệu tổng hợp neurotransmitter: tryptophan → serotonin (mood), tyrosine → dopamine (động lực), glycine → giảm lo âu. Bữa sáng có đạm = nền tảng hóa học cho tâm trạng và focus cả ngày.',
      'Protein shake 2 phút: 20–30g protein từ whey/casein/plant protein + 200ml nước hoặc sữa — nhanh nhất, không cần nấu, phù hợp ngay cả ngày bận. Không tốt bằng thực phẩm nguyên hạt nhưng vẫn tốt hơn bỏ bữa.',
      'Thực phẩm đạm nhanh: 2 quả trứng luộc (chuẩn bị tối hôm trước), 150g sữa chua Hy Lạp, 30g hạt hỗn hợp + phô mai. Tất cả đều dưới 2 phút chuẩn bị nếu chuẩn bị nguyên liệu từ tối.',
      'Không bỏ bữa sáng để "uống cà phê cho gọn": caffeine khi đói spike cortisol và gây kích ứng dạ dày. Đạm trước caffeine ổn định đường huyết và giảm tác động tiêu cực của cà phê khi đói.',
      'Kết thúc routine: sau bước 5, bạn đã hydrate, nhận ánh sáng, đi bộ, mobility đầy đủ, thiền, xác định priorities và nạp nhiên liệu — cơ thể và tâm trí ở trạng thái tốt nhất có thể để bắt đầu ngày dài.',
    ],
    points: [
      { icon: '🔋', label: 'No lâu 3–4 giờ', note: 'Đạm tiêu hóa chậm nhất — ổn định đường huyết đến trưa' },
      { icon: '🧠', label: 'Amino acids = nguyên liệu não', note: 'Tryptophan → serotonin, Tyrosine → dopamine' },
      { icon: '⚡', label: 'Protein shake 2 phút', note: '20–30g protein + nước — nhanh nhất, không cần nấu' },
      { icon: '✅', label: 'Hoàn thành routine 20 phút', note: 'Cơ thể + tâm trí ở trạng thái tốt nhất để bắt đầu ngày' },
    ],
  },
];

const MOBILITY_5 = [
  {
    name: 'Chin tuck', reps: '10 lần', muscles: 'Cổ trước',
    icon: '🦒', title: 'Chin Tuck — Kéo Cằm Vào', color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mỗi 2.5cm đầu chìa về phía trước thêm ~5kg tải trọng lên cột sống cổ. Người dùng máy tính trung bình chìa đầu 5–7.5cm — tương đương gánh thêm 10–15kg lên cổ suốt ngày làm việc. 10 chin tuck mỗi sáng là "reset" đơn giản nhất để counteract forward head posture.',
    detail: 'Forward head posture là vấn đề phổ biến nhất của dân làm việc màn hình. Chin tuck kéo đầu về vị trí trung lập phía trên cột sống, giảm tải trọng lên đốt sống C5-C6 và kích hoạt cơ cổ sâu (deep cervical flexors) bị yếu do ít được dùng.',
    details: [
      'Forward head posture: với mỗi 2.5cm đầu chìa về trước, tải trọng lên cột sống cổ tăng khoảng 4.5–5kg. Người trung bình chìa đầu 5–7.5cm khi nhìn màn hình — gánh thêm 10–15kg liên tục lên đốt sống C5-C6.',
      'Deep cervical flexors (longus colli, longus capitis) là cơ ổn định cột sống cổ chính: bị yếu dần ở người ngồi nhiều vì không được dùng đúng cách. Chin tuck kích hoạt và tăng cường nhóm cơ này.',
      'Kỹ thuật đúng: đứng hoặc ngồi thẳng, nhìn thẳng về trước, kéo cằm thẳng ra sau (không cúi đầu xuống), giữ 5 giây, thả ra. Cảm thấy căng nhẹ phía sau cổ là đúng.',
      'Không phải cúi đầu: chin tuck là chuyển động ngang — đầu đi ra phía sau, không cúi xuống. Nhìn thẳng trong suốt bài tập. Đây là lỗi phổ biến nhất khi mới thực hiện.',
      'Thực hiện ở bất kỳ đâu: ngồi tại bàn, ngồi xe, đứng chờ — không cần thiết bị, không cần không gian. Lý tưởng nhất là thực hiện mỗi 1–2 giờ ngồi máy tính để reset tư thế cổ.',
      'Kết hợp với shoulder roll (bài 2): chin tuck + shoulder roll ra sau = combo counteract toàn bộ tư thế ngồi gù cúi của dân văn phòng. Hai bài bổ trợ nhau và nên làm liên tiếp.',
    ],
    points: [
      { icon: '📏', label: '+5kg/2.5cm đầu chìa', note: 'Người ngồi máy tính gánh thêm 10–15kg lên cổ mỗi ngày' },
      { icon: '💪', label: 'Kích hoạt cơ cổ sâu', note: 'Deep cervical flexors — nhóm cơ bị yếu nhất ở dân văn phòng' },
      { icon: '↔️', label: 'Chuyển động ngang', note: 'Kéo đầu ra sau — KHÔNG cúi xuống. Nhìn thẳng suốt bài' },
      { icon: '🔄', label: 'Mỗi 1–2 giờ ngồi máy', note: 'Không cần thiết bị — làm tại bàn, trong xe, mọi lúc' },
    ],
  },
  {
    name: 'Shoulder roll', reps: '10 vòng × 2 chiều', muscles: 'Vai, cổ',
    icon: '🔄', title: 'Shoulder Roll — Xoay Vai Tròn', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Rounded shoulders (vai cúi về trước) là pattern cơ học phổ biến nhất ở người làm việc máy tính. Shoulder roll ra sau 10 vòng kéo giãn cơ ngực (pectoralis) bị co cụm và kích hoạt rhomboids bị yếu — "reset" tư thế vai chỉ trong 1 phút.',
    detail: 'Cơ ngực bị co cụm do ngồi với tay ở trước — kéo vai về phía trước và xuống. Rhomboids và middle trapezius bị yếu vì ít được kích hoạt. Shoulder roll ra sau kích hoạt nhóm cơ yếu trong khi kéo giãn nhóm cơ căng — cân bằng lại tư thế vai.',
    details: [
      'Rounded shoulders: cơ ngực (pectoralis major/minor) bị co cụm do ngồi tay ở trước; cơ thang giữa (rhomboids, middle trapezius) bị yếu và dài ra. Kết quả: vai bị kéo về phía trước và xuống.',
      'Vai ra sau trước: backward roll kích hoạt rhomboids và middle trapezius — nhóm cơ bị yếu nhất. Forward roll chỉ tiếp tục kích hoạt cơ ngực vốn đã co cụm. Ưu tiên ra sau trước, ra trước sau để cân bằng.',
      'Kỹ thuật đúng: tạo vòng tròn đầy đủ nhất có thể — vai lên cao, ra sau, xuống thấp, ra trước. Không nhún vai quá mức. Hít thở bình thường trong suốt bài tập.',
      'Thêm kéo vai về sau giữ 5 giây × 3 lần: sau khi xoay, kéo hai vai về phía sau như cố chạm hai xương bả vai vào nhau, giữ 5 giây — tăng cường rhomboids hiệu quả nhất.',
      'Không cần thiết bị: shoulder roll chỉ dùng trọng lượng cánh tay. Có thể thêm tạ nhẹ 0.5–1kg nếu muốn tăng tác động, nhưng không cần cho bài mobility buổi sáng.',
      'Kết hợp với chin tuck: chin tuck + shoulder roll ra sau = posture reset 2 phút đầy đủ cho cổ và vai. Cổ thẳng + vai mở = tư thế đứng thẳng tự nhiên nhất.',
    ],
    points: [
      { icon: '💪', label: 'Kéo giãn cơ ngực', note: 'Pectoralis bị co cụm → kéo vai về trước. Roll ra sau giải phóng' },
      { icon: '✅', label: 'Kích hoạt rhomboids', note: 'Cơ thang giữa bị yếu nhất ở dân ngồi — roll ra sau tăng cường' },
      { icon: '⬅️', label: 'Ra sau trước tiên', note: 'Backward roll ưu tiên — kích hoạt nhóm yếu trước nhóm mạnh' },
      { icon: '🤝', label: 'Kéo bả vai lại gần nhau', note: 'Giữ 5 giây × 3 lần sau khi xoay — tăng cường hiệu quả nhất' },
    ],
  },
  {
    name: 'Xoay hông (đứng)', reps: '10 vòng mỗi bên', muscles: 'Hông, lưng dưới',
    icon: '🔃', title: 'Xoay Hông Đứng', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hip flexor là nhóm cơ bị co cụm nhất ở người ngồi nhiều — khi ngồi, cơ này bị giữ ở trạng thái co ngắn nhiều giờ. Hip flexor ngắn là nguyên nhân phổ biến nhất gây đau lưng dưới: kéo xương chậu về trước (anterior pelvic tilt) và tạo áp lực lên đĩa đệm L4-L5.',
    detail: 'Xoay hông tròn là chuyển động hiệu quả nhất để kéo giãn hip flexor và bơm dịch khớp háng (synovial fluid). Khớp háng không có mạch máu trực tiếp — nhận dinh dưỡng qua dịch khớp được bơm vào khi chuyển động. Xoay tròn phân phối dịch khớp đều hơn chuyển động tuyến tính.',
    details: [
      'Hip flexor (iliopsoas = iliacus + psoas major) kết nối cột sống thắt lưng với xương đùi. Khi bị co cụm do ngồi nhiều, nó kéo cột sống về phía trước (anterior pelvic tilt) — gây áp lực lên đĩa đệm L4-L5, nguyên nhân phổ biến nhất của đau lưng dưới mãn tính.',
      'Synovial fluid (dịch khớp): khớp háng không có mạch máu trực tiếp, nhận chất dinh dưỡng và bôi trơn từ dịch khớp. Sau nhiều giờ bất động, dịch khớp phân phối không đều. Xoay tròn bơm dịch khớp trở lại đều khắp khớp.',
      'Xoay tròn hiệu quả hơn chuyển động tuyến tính: kích hoạt toàn bộ phạm vi chuyển động của khớp háng, kéo giãn tất cả cơ xung quanh — hip flexor, piriformis, hip rotators và glutes.',
      'Kỹ thuật: đứng hai tay trên hông, xoay hông tạo vòng tròn lớn nhất có thể — ra trước, sang một bên, ra sau, sang bên kia. 10 vòng mỗi chiều. Giữ bàn chân cố định, chỉ chuyển động khớp háng.',
      'Anterior pelvic tilt: triệu chứng nhận biết — lưng dưới cong vào trong quá mức, bụng nhô ra nhẹ. Xoay hông + hip flexor stretch buổi sáng giảm dần tình trạng này nếu thực hiện đều đặn.',
      'Mở rộng: sau xoay, thêm hip flexor stretch (lunge sâu, đầu gối sau chạm đất, giữ 30 giây mỗi bên) để kéo giãn sâu hơn. Combo này mất 3 phút và hiệu quả nhất giảm đau lưng dưới do ngồi nhiều.',
    ],
    points: [
      { icon: '🦴', label: 'Hip flexor — cơ số 1 bị co cụm', note: 'Ngồi nhiều giờ → co ngắn → kéo cột sống lệch → đau lưng' },
      { icon: '💧', label: 'Bơm dịch khớp háng', note: 'Xoay tròn phân phối synovial fluid — giảm cứng và bôi trơn khớp' },
      { icon: '⭕', label: 'Vòng tròn lớn nhất có thể', note: 'Tối đa ROM — kéo giãn toàn bộ cơ xung quanh khớp háng' },
      { icon: '🔧', label: 'Phòng ngừa đau lưng L4-L5', note: 'Hip flexor ngắn = anterior tilt = áp lực đĩa đệm — xoay hàng ngày' },
    ],
  },
  {
    name: 'Thoracic extension', reps: '8–10 lần', muscles: 'Lưng trên',
    icon: '🦅', title: 'Thoracic Extension — Mở Ngực Ra Sau', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thoracic spine (T1–T12) là đoạn cột sống bị bỏ quên nhất: người tập thường chú ý cervical (cổ) và lumbar (lưng dưới), nhưng thoracic cứng là nguyên nhân gốc rễ khiến cả hai phải bù trừ quá mức và dễ chấn thương. Thoracic extension mở lại phạm vi chuyển động quan trọng này.',
    detail: 'Thoracic kyphosis (gù lưng trên) do ngồi máy tính hạn chế không chỉ tư thế mà còn hô hấp — phổi không thể mở rộng đầy đủ khi lồng ngực bị khép. Mở thoracic spine ra sau counteract kyphosis, cải thiện tư thế và tăng dung tích hô hấp.',
    details: [
      'Thoracic spine gồm 12 đốt sống (T1–T12) kết nối xương sườn. Cứng thoracic → hạn chế rotation và extension → lưng dưới (lumbar) và cổ phải bù trừ bằng cách di chuyển nhiều hơn → tăng nguy cơ chấn thương.',
      'Hô hấp và thoracic: lồng ngực bị khép (thoracic kyphosis) giảm dung tích hít vào tối đa 10–15%. Mở thoracic → lồng ngực mở rộng → thở sâu hơn — lý do yoga và pilates tập trung nhiều vào thoracic.',
      'Cobra pose (nằm sấp): nằm sấp, lòng bàn tay đặt cạnh vai, đẩy ngực lên khỏi sàn trong khi giữ hông xuống. Cảm thấy kéo giãn cột sống ngực và mở lồng ngực. Giữ 20–30 giây × 3 lần.',
      'Chair extension (ngồi ghế): ngồi thẳng, đan tay sau gáy, cẩn thận ngả người ra sau qua lưng ghế — dùng cạnh ghế như điểm tựa để extend thoracic spine. Thực hiện tại bàn làm việc.',
      'Thoracic rotation: đứng hoặc ngồi, tay trước ngực, xoay thân trên sang hai bên tối đa mà không xoay hông. Rotation mobility quyết định hiệu suất mọi môn thể thao dùng xoay người (golf, tennis, bơi, boxing).',
      'Sau 4–6 tuần: thoracic mobility cải thiện → tư thế thẳng hơn tự nhiên, hô hấp sâu hơn, đau cổ vai gáy mãn tính giảm — giải quyết nguyên nhân gốc rễ thay vì triệu chứng.',
    ],
    points: [
      { icon: '🔗', label: 'Đốt sống bị bỏ quên nhất', note: 'Thoracic cứng → cervical và lumbar bù trừ → dễ chấn thương' },
      { icon: '🫁', label: 'Mở ngực = thở sâu hơn', note: 'Kyphosis giảm dung tích phổi 10–15% — extension giải phóng' },
      { icon: '🦅', label: 'Cobra pose hoặc ghế', note: 'Nằm sấp đẩy ngực lên hoặc dùng cạnh ghế làm điểm tựa' },
      { icon: '🌀', label: 'Rotation = yếu tố thể thao', note: 'Thoracic rotation quyết định hiệu suất golf, tennis, bơi, boxing' },
    ],
  },
  {
    name: "World's greatest stretch", reps: '5 lần mỗi bên', muscles: 'Toàn thân',
    icon: '🌟', title: "World's Greatest Stretch", color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: "World's greatest stretch được gọi là 'greatest' vì cover 5 nhóm cơ quan trọng nhất trong 1 chuyển động: hip flexor, hamstring, cơ ngực, thoracic rotation và shoulder mobility. Không bài tập đơn nào khác có mật độ lợi ích cao như vậy trong 30 giây thực hiện.",
    detail: "Bài tập kết hợp lunge sâu (kéo giãn hip flexor), thoracic rotation (mở cột sống ngực) và arm reach (shoulder mobility) trong 1 chuyển động lưu loát. Được physical therapist và trainer chuyên nghiệp dùng như bài warm-up/mobility đơn tốt nhất có thể.",
    details: [
      'Hip flexor: bước lunge dài ra trước, đầu gối sau có thể chạm đất. Cảm thấy kéo giãn mặt trước đùi chân sau và háng — đây là kéo giãn hip flexor sâu nhất trong bài, quan trọng nhất với người ngồi nhiều.',
      'Thoracic rotation: từ vị trí lunge, đặt tay trong (cùng bên chân sau) xuống sàn cạnh chân trước. Từ từ xoay thân trên lên, giơ tay ngoài lên trần nhà. Nhìn theo tay — xoay tối đa không đau.',
      'Hamstring: có thể chuyển sang duỗi thẳng chân trước để kéo giãn hamstring chân trước. Kết hợp hip flexor + hamstring trong 1 chuyển động từ 1 vị trí — không cần đổi tư thế.',
      'Shoulder mobility: khi giơ tay lên (thoracic rotation), vai mở ra — shoulder mobility được kéo giãn thụ động. 5 lần mỗi bên đủ để cải thiện shoulder ROM đáng kể nếu thực hiện đều đặn.',
      "Thứ tự: bước lunge dài → tay trong xuống sàn → xoay thân → giơ tay lên cao nhìn theo → giữ 2–3 giây → hạ tay → chuyển chân. Chậm và có kiểm soát quan trọng hơn tốc độ.",
      "Tại sao 5 lần đủ: mobility hiệu quả nhất ở chất lượng chuyển động, không phải số lượng. 5 lần chất lượng > 20 lần vội vàng. World's greatest stretch cover đủ để không cần bài mobility nào khác nếu thời gian hạn chế.",
    ],
    points: [
      { icon: '5️⃣', label: '5 nhóm cơ trong 1 bài', note: 'Hip flexor + hamstring + cơ ngực + thoracic + shoulder' },
      { icon: '🏋️', label: 'Dùng bởi vận động viên', note: 'Physical therapist và trainer chuyên nghiệp chọn làm warm-up tốt nhất' },
      { icon: '🐢', label: 'Chậm và kiểm soát', note: '5 lần chất lượng > 20 lần vội vàng — chất lượng quan trọng hơn' },
      { icon: '⏱️', label: '30 giây/lần × 5 lần', note: 'Mật độ lợi ích cao nhất trong thời gian ngắn nhất có thể' },
    ],
  },
];

const WHY_MORNING = [
  {
    icon: '🧠', title: 'Cortisol Awakening Response (CAR)',
    desc: 'Cortisol tự nhiên đạt đỉnh 30–45 phút sau thức dậy. Đây là window lý tưởng nhất trong ngày để não hoạt động sắc bén nhất.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol Awakening Response (CAR) là đợt tăng cortisol tự nhiên 50–100% trong 30–45 phút đầu sau khi thức dậy. Đây là "năng lượng mồi" sinh học mạnh nhất trong ngày — không cần cà phê, không cần supplement.',
    detail: 'CAR là cơ chế tiến hóa giúp tổ tiên chúng ta tỉnh táo ngay khi dậy để đối phó với môi trường. Ngày nay nó vẫn hoạt động — nhưng chúng ta thường phá vỡ nó bằng điện thoại, ánh sáng nhân tạo và cà phê ngay khi dậy, trước khi cortisol đạt đỉnh tự nhiên.',
    details: [
      'Cortisol tăng 50–100% trong 30–45 phút đầu sau khi dậy — đây là cơ chế sinh học tự nhiên giúp não chuyển từ trạng thái ngủ sang hoạt động nhận thức đầy đủ.',
      'CAR mạnh hay yếu phụ thuộc vào: chất lượng ngủ đêm trước, giờ ngủ nhất quán, ánh sáng buổi sáng và mức độ căng thẳng mãn tính.',
      'Uống cà phê ngay khi dậy (trước khi CAR đạt đỉnh) lãng phí cả hai: cortisol cao làm giảm hiệu quả caffeine, và caffeine cạnh tranh với receptor adenosine khi adenosine chưa đủ tích lũy.',
      'Window CAR (30–45 phút đầu) là thời điểm tốt nhất để lên kế hoạch ngày, đọc nội dung phức tạp, hoặc xử lý bất kỳ tư duy sâu nào — không phải lướt social media.',
      'Ánh sáng tự nhiên sáng sớm khuếch đại CAR: ánh nắng kích hoạt tuyến thượng thận tăng cortisol thêm qua trục HPA, giải thích tại sao ra ngoài sáng sớm cho cảm giác "tỉnh hơn" rõ rệt.',
      'Người có CAR yếu (mệt mỏi dù ngủ đủ giờ): thường có sleep debt tích lũy, căng thẳng mãn tính hoặc nhịp circadian lệch — các vấn đề cần giải quyết gốc rễ, không phải caffeine nhiều hơn.',
    ],
    points: [
      { icon: '⚡', label: 'Tăng 50–100% tự nhiên', note: 'Trong 30–45 phút đầu sau khi dậy — mạnh hơn caffeine' },
      { icon: '🚫', label: 'Không cà phê ngay khi dậy', note: 'Chờ 90–120 phút — tận dụng CAR trước khi thêm caffeine' },
      { icon: '📖', label: 'Dùng window này cho việc quan trọng', note: 'Đây là đỉnh nhận thức — không lãng phí vào scrolling' },
      { icon: '☀️', label: 'Ánh sáng khuếch đại CAR', note: 'Ra ngoài 5 phút sáng sớm → cortisol tăng thêm' },
    ],
  },
  {
    icon: '☀️', title: 'Đồng hồ sinh học reset hàng ngày',
    desc: 'Ánh nắng buổi sáng là "nút reset" mạnh nhất. Giúp melatonin tối hôm đó tiết đúng lúc hơn — bạn sẽ dễ ngủ hơn 12–16 giờ sau.',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng mặt trời sáng sớm là tín hiệu quan trọng nhất để đặt lại đồng hồ sinh học 24h (SCN). Nó quyết định thời điểm melatonin tiết tối nay — 5 phút ngoài trời lúc 6–9h ảnh hưởng trực tiếp đến chất lượng ngủ đêm 12–16 giờ sau đó.',
    detail: 'Suprachiasmatic nucleus (SCN) — "đồng hồ chủ" nằm trong não — cần ánh sáng mạnh buổi sáng để đặt lại nhịp 24h chính xác. Nếu không nhận đủ ánh sáng sáng, SCN bị lệch pha, melatonin tiết muộn hơn, và bạn sẽ khó ngủ vào giờ bạn muốn.',
    details: [
      'SCN (suprachiasmatic nucleus) là đồng hồ sinh học chủ của cơ thể — nó cần ánh sáng 10.000+ lux buổi sáng để đặt lại chính xác. Ánh đèn trong nhà (100–500 lux) không đủ.',
      'Ánh sáng buổi sáng đặt "timer" cho melatonin: sau khoảng 12–16 giờ kể từ khi nhận ánh sáng mạnh, tuyến tùng bắt đầu tiết melatonin — đây là cơ chế giải thích tại sao ngủ cùng giờ mỗi đêm dễ hơn khi ra ngoài sáng sớm.',
      'Chỉ cần 5–10 phút tiếp xúc ánh sáng trực tiếp lúc 6–9h (không cần nhìn thẳng mặt trời) — đủ để kích hoạt tín hiệu đặt lại SCN cho cả ngày.',
      'Ngày흐u/mưa: ra ngoài vẫn hiệu quả hơn ngồi trong nhà — ánh sáng tán xạ ngoài trời ngày흐u (1.000–5.000 lux) vẫn mạnh hơn nhiều lần so với đèn trong nhà.',
      'Người không thể ra ngoài sáng sớm: ngồi cạnh cửa sổ có ánh nắng trực tiếp, dùng đèn light therapy (10.000 lux) 20–30 phút sau khi dậy — hai lựa chọn thay thế có bằng chứng.',
      'Tác động tích lũy: áp dụng liên tục 7–14 ngày sẽ thấy giờ buồn ngủ dịch về sớm hơn và giờ dậy tự nhiên ổn định hơn — không cần báo thức mỗi ngày.',
    ],
    points: [
      { icon: '🕐', label: '12–16h sau = ngủ ngon hơn', note: 'Ánh sáng 6–9h → melatonin tiết đúng giờ tối nay' },
      { icon: '⏱️', label: 'Chỉ 5–10 phút là đủ', note: 'Không cần nhìn mặt trời — ánh sáng tán xạ đủ hiệu quả' },
      { icon: '🌧️', label: 'Ngày흐u vẫn ra ngoài', note: '1.000–5.000 lux ngoài trời > 100–500 lux trong nhà' },
      { icon: '📅', label: 'Rõ sau 7–14 ngày', note: 'Giờ buồn ngủ dịch sớm hơn, dậy tự nhiên không cần báo thức' },
    ],
  },
  {
    icon: '💧', title: 'Cơ thể cần nước sau giấc ngủ',
    desc: 'Bạn thở và toát mồ hôi trong khi ngủ. Dậy với 200–300ml nước trước tiên giúp não hoạt động tốt hơn ngay lập tức.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 7–9 giờ không uống nước, cơ thể mất 0.5–1 lít qua hơi thở và mồ hôi khi ngủ. Mất nước nhẹ 1% đã đủ làm giảm hiệu suất nhận thức 5–10%. Uống 200–300ml nước ngay khi dậy là "hack" đơn giản nhất để não hoạt động tốt hơn trong 30 phút đầu.',
    detail: 'Não là 73% nước và tiêu thụ lượng nước không cân xứng so với trọng lượng của nó. Buổi sáng sau khi ngủ dậy, nhiều người nhầm triệu chứng dehydration nhẹ (mệt mỏi, khó tập trung, đau đầu nhẹ) với "chưa uống cà phê" — trong khi thực ra họ chỉ cần nước.',
    details: [
      'Trong 7–9 giờ ngủ, cơ thể mất khoảng 0.5–1 lít nước qua hơi thở (respiratory water loss) và mồ hôi không nhìn thấy (insensible perspiration).',
      'Mất nước 1% (700ml với người 70kg) làm giảm sự tập trung, tốc độ xử lý và trí nhớ ngắn hạn có thể đo được — bạn đạt ngưỡng này trước bữa sáng nếu không uống nước.',
      'Não là 73% nước: ngay cả dehydration nhẹ làm giảm thể tích não một phần, ảnh hưởng đến hiệu suất nhận thức trước khi bạn cảm thấy khát.',
      'Uống 200–300ml nước lạnh (10–15°C) ngay khi dậy giúp tăng cảnh giác nhanh hơn: nhiệt độ thấp kích thích thần kinh giao cảm nhẹ, tương tự "shock" nhỏ tỉnh táo.',
      'Thêm muối (một nhúm nhỏ) hoặc một lát chanh: giúp hấp thụ nước vào tế bào nhanh hơn (electrolytes) so với nước lọc thuần túy — hữu ích đặc biệt sau đêm ra nhiều mồ hôi.',
      'Nước TRƯỚC cà phê: caffeine có tác dụng lợi tiểu nhẹ — uống cà phê khi đang thiếu nước có thể tăng tác động tiêu cực. Hydrate trước để tối ưu cả hai.',
    ],
    points: [
      { icon: '🌊', label: 'Mất 0.5–1 lít khi ngủ', note: 'Qua hơi thở + mồ hôi — dù không cảm thấy khát khi dậy' },
      { icon: '🧠', label: 'Não 73% là nước', note: '-1% nước → -5–10% hiệu suất nhận thức ngay lập tức' },
      { icon: '❄️', label: '200–300ml nước lạnh', note: 'Nhiệt độ thấp kích thích tỉnh táo nhanh hơn nước ấm' },
      { icon: '🍋', label: 'Thêm muối/chanh', note: 'Electrolytes giúp hấp thụ nước vào tế bào nhanh hơn' },
    ],
  },
  {
    icon: '🏃', title: 'Vận động nhẹ bật hệ tuần hoàn',
    desc: 'Chỉ 5 phút đi bộ nhẹ tăng dopamine, norepinephrine và serotonin — 3 neurotransmitter quan trọng cho mood và focus cả ngày.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút vận động nhẹ sáng sớm tăng đồng thời dopamine (động lực), norepinephrine (tập trung) và serotonin (mood ổn định). Hiệu ứng này kéo dài 2–4 giờ — dài hơn 1 ly cà phê và không có crash sau đó.',
    detail: 'Vận động nhẹ không cần đổ mồ hôi để có tác dụng thần kinh. Chỉ cần tăng nhịp tim lên 30–40% so với nghỉ ngơi (đi bộ nhẹ, leo cầu thang, nhảy nhẹ tại chỗ) đủ để kích hoạt cascade neurotransmitter và BDNF — protein tăng trưởng não.',
    details: [
      'Dopamine: vận động sáng sớm tăng baseline dopamine — tạo cảm giác động lực, sẵn sàng hành động thay vì trì hoãn. Đây là neurotransmitter của "muốn làm" chứ không chỉ "cảm thấy vui".',
      'Norepinephrine: tăng cùng với dopamine khi vận động, cải thiện khả năng chú ý, tập trung và phản ứng nhanh — giải thích tại sao nhiều người báo cáo "đầu óc sắc bén hơn" sau khi đi bộ sáng.',
      'Serotonin: vận động + ánh sáng sáng sớm là combo kép tăng serotonin — ảnh hưởng đến mood, self-confidence và kiên nhẫn. Serotonin thấp thường gây khó chịu, dễ cáu và cảm giác "không muốn làm gì".',
      'BDNF (Brain-Derived Neurotrophic Factor): vận động kích thích sản xuất BDNF — "phân bón não" giúp tăng kết nối nơ-ron, cải thiện học tập và bảo vệ não khỏi lão hóa dài hạn.',
      'Chỉ cần 5 phút: nghiên cứu cho thấy ngay cả 5 phút đi bộ nhẹ đủ để đo được sự thay đổi neurotransmitter — không cần gym, không cần đổ mồ hôi, không cần thay đồ.',
      'Không có thang máy + ưu tiên cầu thang: leo 2–3 tầng cầu thang = 2 phút vận động nhẹ hiệu quả — tích lũy "movement snacks" nhỏ như thế này trong sáng có tác động đáng kể.',
    ],
    points: [
      { icon: '🎯', label: 'Dopamine + Norepinephrine', note: 'Động lực + tập trung — kéo dài 2–4 giờ sau vận động' },
      { icon: '😊', label: 'Serotonin tăng', note: 'Vận động + ánh sáng = combo kép cải thiện mood cả ngày' },
      { icon: '🌱', label: 'BDNF — phân bón não', note: 'Tăng kết nối nơ-ron, cải thiện học tập và bảo vệ não' },
      { icon: '⏱️', label: 'Chỉ cần 5 phút', note: 'Không cần đổ mồ hôi — đi bộ nhẹ đủ thay đổi neurotransmitter' },
    ],
  },
];

const PRACTICAL_TIPS = [
  {
    tip: 'Chuẩn bị từ tối hôm trước',
    desc: 'Để sẵn bình nước, giày đi bộ, quần áo tập. Giảm ma sát buổi sáng = tăng khả năng thực hiện.',
    icon: '🌙', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Friction" (ma sát) là yếu tố dự đoán tốt nhất hành vi có được duy trì hay không — không phải ý chí. Để sẵn bình nước, giày và quần áo tập từ tối hôm trước giảm số quyết định buổi sáng và tăng khả năng thực hiện routine lên 60–80% theo các nghiên cứu về thiết kế hành vi.',
    detail: '"Intention-action gap" — khoảng cách giữa dự định và thực hiện — bị thu hẹp nhất khi môi trường được thiết kế để ủng hộ hành vi mục tiêu. Chuẩn bị từ tối là chiến lược "environment design" đơn giản nhất và hiệu quả nhất mà không tốn thêm thời gian hay nỗ lực ý chí.',
    details: [
      '"Friction" trong tâm lý hành vi: não đánh giá effort cần bỏ ra cho mỗi hành động. Khi friction thấp (thiết bị đã chuẩn bị sẵn), não ít kháng cự hơn. Ngược lại, phải tìm giày, mặc quần áo, pha nước buổi sáng — mỗi bước nhỏ là quyết định cần willpower.',
      'BJ Fogg (Tiny Habits, Stanford) gọi đây là "environment architecture": thay đổi môi trường vật lý để hành vi mong muốn trở thành con đường kháng cự thấp nhất. Để bình nước cạnh giường = hành động đầu tiên khi thức dậy là uống nước, không phải quyết định uống hay không.',
      'Cụ thể những gì nên chuẩn bị: bình nước 300–500ml (có thể thêm chanh/muối từ tối), giày đi bộ cạnh cửa, quần áo tập để ngoài ghế — ba vật dụng này cover toàn bộ 3 bước cốt lõi (nước, ánh sáng, vận động).',
      'Night routine kết nối: chuẩn bị buổi sáng là phần cuối cùng của night routine — làm xong khi đi ngủ thì buổi sáng như "chạy trên ray". Mất 3–5 phút tối hôm trước tiết kiệm 15–20 phút quyết định và cognitive load buổi sáng.',
      'Decision fatigue: não có lượng hạn chế "quyết định chất lượng" mỗi ngày. Mỗi quyết định nhỏ buổi sáng tiêu tốn nguồn tài nguyên này sớm hơn. Chuẩn bị sẵn = giữ decision budget cho công việc quan trọng hơn.',
      'Mở rộng: chuẩn bị bữa sáng protein từ tối (trứng luộc sẵn, sữa chua để tủ lạnh), đặt điện thoại sạc ngoài phòng ngủ từ tối — để không cầm vào sáng. Mỗi thứ chuẩn bị sẵn là 1 ma sát bị loại bỏ khỏi sáng hôm sau.',
    ],
    points: [
      { icon: '🏗️', label: 'Environment design', note: 'Thay đổi môi trường vật lý — không cần thay đổi ý chí' },
      { icon: '🎯', label: '3 vật dụng cốt lõi', note: 'Bình nước + giày + quần áo tập — cover toàn bộ routine' },
      { icon: '🧠', label: 'Giảm decision fatigue', note: 'Mỗi quyết định sáng tốn budget nhận thức — chuẩn bị sẵn bảo tồn nó' },
      { icon: '⏰', label: '3–5 phút tối = 15–20 phút sáng', note: 'Đầu tư nhỏ tối hôm trước → sáng chạy trên ray không cần nghĩ' },
    ],
  },
  {
    tip: 'Không xem điện thoại trong 15 phút đầu',
    desc: 'Điện thoại ngay khi thức dậy → não vào chế độ reactive ngay. Ưu tiên routine trước, điện thoại sau.',
    icon: '📵', color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Check điện thoại trong 5–10 phút đầu sau khi thức dậy kích hoạt dopamine spike → dopamine crash → khó tập trung và dễ procrastinate trong 2–3 giờ sau. Não buổi sáng ở trạng thái alpha (4–8Hz) — trạng thái dễ "nhiễm" thông tin nhất và cũng sáng tạo nhất.',
    detail: 'Điện thoại được thiết kế để tối đa hóa engagement — mỗi notification, like, tin tức đều tạo dopamine micro-spike. Buổi sáng là thời điểm não dễ bị override nhất bởi external stimuli trước khi prefrontal cortex hoàn toàn active (~30 phút sau khi thức).',
    details: [
      'Trạng thái alpha buổi sáng (4–8Hz): ngay sau khi thức dậy, não ở trạng thái alpha/theta — ranh giới giữa ngủ và tỉnh. Trạng thái này đặc biệt sáng tạo và dễ tiếp nhận thông tin, nhưng cũng dễ bị "override" bởi external input như điện thoại.',
      'Dopamine hijack: mỗi notification, like, tin tức tạo micro-spike dopamine. Điện thoại buổi sáng đặt "bar" dopamine lên cao ngay từ đầu — mọi hoạt động "bình thường" sau đó (công việc, học tập) cảm thấy nhạt hơn và khó duy trì attention hơn.',
      'Reactive vs intentional mode: check điện thoại ngay → não vào chế độ respond-to-others-agenda. Các nghiên cứu của Gloria Mark (UC Irvine) cho thấy interrupt sáng sớm làm tăng "reactive work" cả ngày và giảm khả năng deep work tới 40%.',
      'Prefrontal cortex chưa đủ active: PFC — vùng não chịu trách nhiệm quyết định, ưu tiên và tư duy chiến lược — cần 20–30 phút sau khi thức để hoàn toàn hoạt động. Điện thoại sớm nghĩa là "amygdala (cảm xúc) dẫn đầu" thay vì PFC.',
      'Làm gì thay thế: 15 phút đầu là thời điểm tốt nhất cho: uống nước, mở cửa sổ/ra ngoài, đi bộ nhẹ, thiền ngắn, journal 1 câu, đọc sách vật lý. Tất cả những hoạt động này feed vào routine mà không bị interrupt.',
      'Thực tế: đặt điện thoại sạc ngoài phòng ngủ từ tối — không cần ý chí để không cầm điện thoại sáng nếu nó không ở bên. "Out of sight, out of habit-trigger" — loại bỏ cue là cách phá thói quen hiệu quả nhất.',
    ],
    points: [
      { icon: '🧠', label: 'Trạng thái alpha buổi sáng', note: 'Sáng tạo + dễ nhiễm — bảo vệ nó trước thông tin ngoài' },
      { icon: '🎭', label: 'Dopamine hijack', note: 'Notification spike dopamine sớm → mọi thứ sau cảm thấy nhạt hơn' },
      { icon: '🛡️', label: 'Intentional > Reactive mode', note: 'PFC chưa active — để amygdala dẫn đầu là để cảm xúc quyết định ngày' },
      { icon: '🔌', label: 'Sạc ngoài phòng ngủ', note: 'Loại bỏ cue = phá thói quen — không cần ý chí để không cầm máy' },
    ],
  },
  {
    tip: 'Bắt đầu từ 1 thói quen, không phải cả list',
    desc: 'Tuần 1: chỉ uống nước khi thức. Tuần 2: thêm ánh sáng. Tuần 3: thêm đi bộ 2 phút.',
    icon: '🌱', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1467664631004-58beab1ece0d?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Keystone habits" (Charles Duhigg) — thói quen then chốt — kéo theo 2–3 thói quen khác tự nhiên. Uống nước buổi sáng → nhớ ra ngoài → tự nhiên muốn di chuyển = hiệu ứng domino. Bắt đầu với 1 thói quen nhỏ nhất còn dễ hơn cả việc không làm gì.',
    detail: 'Thử làm quá nhiều cùng lúc = willpower depletion sớm. Não có lượng hạn chế cognitive resources cho thay đổi hành vi mỗi ngày. Bắt đầu với 1 thói quen → build identity ("tôi là người uống nước mỗi sáng") → từ identity đó các thói quen mới dễ dàng thêm vào.',
    details: [
      'Keystone habit: một thói quen duy nhất kéo theo cascade các thói quen khác tự nhiên do chuỗi tác động (uống nước → ra ngoài lấy ánh sáng → tự nhiên muốn đi bộ thêm). Chọn đúng keystone habit = ROI cao nhất trên 1 hành động.',
      'Ego depletion (Roy Baumeister): willpower là nguồn tài nguyên có giới hạn — bị tiêu hao khi dùng. Thử thực hiện 5 thói quen mới đồng thời đòi hỏi 5× willpower → thất bại nhiều hơn thành công → identity "tôi không giữ được thói quen" hình thành.',
      'Identity-based habits (James Clear, Atomic Habits): thay vì "tôi muốn uống nước mỗi sáng" (outcome), hãy "tôi là người chăm sóc cơ thể mình" (identity). Mỗi lần uống nước = 1 lá phiếu cho identity đó. Identity thay đổi → hành vi tự nhiên theo sau.',
      'Habit stacking: sau khi thói quen đầu tiên ổn định (2–4 tuần), thêm thói quen mới bằng cách gắn vào thói quen đã có: "Sau khi uống nước → mở cửa sổ". Thói quen cũ trở thành cue (tín hiệu) cho thói quen mới — không cần nhớ thêm.',
      'Lộ trình 4 tuần: Tuần 1: chỉ uống nước ngay khi thức (30 giây). Tuần 2: thêm mở cửa sổ/ra ngoài (1 phút). Tuần 3: thêm đi bộ nhẹ 2 phút. Tuần 4: thêm 5 nhịp thở chậm. Sau 4 tuần: có routine 5 phút đầy đủ mà không cảm thấy "cố gắng".',
      'Mở rộng: không cần "all or nothing". Ngày bận → làm rút gọn (chỉ uống nước). Ngày bình thường → làm đầy đủ. Linh hoạt > cứng nhắc trong giai đoạn xây dựng thói quen. Mục tiêu là giữ chuỗi, không phải hoàn hảo mỗi ngày.',
    ],
    points: [
      { icon: '🎯', label: 'Keystone habit = domino', note: '1 thói quen đúng kéo theo 2–3 thói quen khác tự nhiên' },
      { icon: '🪪', label: 'Identity-based habits', note: '"Tôi là người chăm sóc cơ thể" → hành vi tự nhiên theo sau' },
      { icon: '🔗', label: 'Habit stacking', note: 'Gắn thói quen mới vào thói quen cũ — không cần nhớ thêm' },
      { icon: '📅', label: '4 tuần lên full routine', note: '30 giây → 1 phút → 2 phút → 5 phút → có routine mà không "cố"' },
    ],
  },
  {
    tip: 'Ngày bận nhất vẫn có thể làm 3 phút',
    desc: 'Uống nước + ánh sáng + 5 hít thở = 3 phút. Đây là "minimum viable morning routine" của bạn.',
    icon: '⚡', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Never miss twice" (James Clear) — bỏ 1 ngày là tai nạn, bỏ 2 ngày là bắt đầu 1 pattern mới. Minimum viable routine (3 phút) quan trọng hơn không làm gì vì nó giữ identity và chuỗi thói quen intact ngay cả trong ngày bận nhất.',
    detail: 'Nghiên cứu về habit formation cho thấy "không bỏ 2 ngày liên tiếp" quan trọng hơn "làm đầy đủ mỗi ngày". 3 phút (nước + ánh sáng + 5 hít thở) đủ để giữ chain intact và não vẫn nhận được tín hiệu sinh học cơ bản cần thiết.',
    details: [
      '"Never miss twice" rule: missing once is an accident, missing twice is the start of a new habit. Một ngày bỏ routine không phá hủy thói quen — hai ngày liên tiếp bắt đầu rewire não theo pattern "tôi không làm routine". 3 phút ngăn ngày thứ hai bị bỏ.',
      'Minimum viable routine là khái niệm từ "Minimum Viable Product" trong startup: phiên bản tối giản nhất vẫn giữ được giá trị cốt lõi. Với morning routine, giá trị cốt lõi là: hydrate + ánh sáng + tín hiệu sinh học. 3 phút đủ làm cả ba.',
      '3 phút cụ thể: 1 phút uống nước (bình đã để sẵn từ tối) + 1 phút mở cửa sổ/bước ra cửa nhìn ra ngoài + 1 phút 5–6 nhịp thở chậm. Không cần thay đồ, không cần di chuyển xa, không cần thiết bị.',
      'Tâm lý học: "tôi đã làm routine sáng nay, dù chỉ 3 phút" giữ identity "người có routine buổi sáng" nguyên vẹn. Identity intact → ngày hôm sau dễ trở lại routine đầy đủ hơn. Identity bị phá vỡ → cần nhiều effort để restart hơn.',
      'Ngày đặc biệt bận: sáng họp sớm, chuyến bay, con ốm — những ngày này vẫn có 3 phút trong khi đun nước pha trà, trong thang máy, hoặc ngay sau khi dậy trước khi làm gì khác. 3 phút không cần điều kiện lý tưởng.',
      'Mở rộng: sau "minimum viable" ngày hôm nay → bù vào buổi trưa hoặc tối nếu điều kiện cho phép. Không có khái niệm "lỡ rồi thì thôi cả ngày" — tư duy "all or nothing" là kẻ thù lớn nhất của thói quen dài hạn.',
    ],
    points: [
      { icon: '🚫', label: 'Never miss twice', note: 'Bỏ 1 ngày là tai nạn — bỏ 2 ngày là pattern mới hình thành' },
      { icon: '✂️', label: 'Minimum viable routine', note: 'Nước + ánh sáng + thở = 3 phút. Giữ chain trong ngày bận nhất' },
      { icon: '🪪', label: 'Giữ identity nguyên vẹn', note: '"Tôi có routine sáng" — dù 3 phút hay 20 phút, identity không bị phá' },
      { icon: '🧩', label: 'Không phải all or nothing', note: 'Tư duy "lỡ rồi thôi" là kẻ thù lớn nhất của thói quen dài hạn' },
    ],
  },
];

function MorningModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total ?? WHY_MORNING.length}</span>
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

export default function LifestyleMorningPage() {
  const [mode, setMode] = useState('5');
  const [whyIdx, setWhyIdx] = useState(null);
  const [routineIdx, setRoutineIdx] = useState(null);
  const [mobilityIdx, setMobilityIdx] = useState(null);
  const [tipIdx, setTipIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-morn-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cMornSpin { to { --c-morn-angle: 360deg; } }
      .c-morn-ring {
        background: conic-gradient(from var(--c-morn-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cMornSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const routines = { '5': ROUTINE_5, '10': ROUTINE_10, '20': ROUTINE_20 };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-cyan-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🌅
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Routine Buổi Sáng</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C2 — 5 / 10 / 20 phút
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Buổi sáng không cần hoàn hảo. Chỉ cần bật cơ thể lên đúng cách. 5 phút đúng còn tốt hơn kế hoạch 1 tiếng không làm được.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-morn-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop"
              alt="Routine sáng" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Nước · Ánh sáng · Vận động nhẹ
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why morning matters */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Buổi Sáng Quan Trọng?</h2>
        <p className="text-muted text-lg mb-6">Những gì bạn làm trong 30–60 phút đầu tiên thiết lập tone cho cả ngày.</p>
        <div className="grid gap-3">
          {WHY_MORNING.map((item, i) => (
            <div key={i}
              className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.15)` }}
              onClick={() => setWhyIdx(i)}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-lg mb-1">{item.title}</div>
                <p className="text-muted text-base leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Routine plans */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Phiên Bản Routine</h2>
        <p className="text-muted text-lg mb-5">Chọn phiên bản phù hợp với ngày hôm nay. Ngày bận = 5 phút. Ngày thường = 10 phút. Ngày rảnh = 20 phút.</p>
        <div className="flex gap-2 mb-6">
          {['5', '10', '20'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-lg font-semibold transition-all"
              style={mode === m
                ? { background: `rgba(${RGB},0.15)`, color: COLOR, border: `1px solid rgba(${RGB},0.3)` }
                : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
              {m} phút
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {routines[mode].map((row, i) => (
            <div key={i}
              className="flex gap-4 items-center p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${row.rgb ?? RGB},0.05)`, border: `1px solid rgba(${row.rgb ?? RGB},0.15)` }}
              onClick={() => setRoutineIdx(i)}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: row.color ?? COLOR, color: 'black' }}>{row.step}</div>
              <span className="text-xl shrink-0">{row.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{row.action}</div>
                <div className="text-sm text-muted mt-0.5">{row.why}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums shrink-0" style={{ color: row.color ?? COLOR }}>{row.time}</div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: row.color ?? COLOR, background: `rgba(${row.rgb ?? RGB},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Mobility */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mobility Sáng 5 Phút</h2>
        <p className="text-muted text-lg mb-6">Bài mobility nhẹ buổi sáng giảm cứng khớp, cải thiện tư thế và chuẩn bị cơ thể cho ngày làm việc.</p>
        <div className="space-y-2">
          {MOBILITY_5.map((ex, i) => (
            <div key={i}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${ex.rgb},0.05)`, border: `1px solid rgba(${ex.rgb},0.18)` }}
              onClick={() => setMobilityIdx(i)}>
              <span className="text-xl shrink-0">{ex.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{ex.name}</div>
                <div className="text-sm text-muted">{ex.muscles}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums shrink-0" style={{ color: ex.color }}>{ex.reps}</div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: ex.color, background: `rgba(${ex.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Practical tips */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẹo Thực Tế</h2>
        <div className="grid gap-3">
          {PRACTICAL_TIPS.map((item, i) => (
            <div key={i}
              className="flex gap-3 items-start p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.18)` }}
              onClick={() => setTipIdx(i)}>
              <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-base mb-0.5" style={{ color: item.color }}>→ {item.tip}</div>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/circadian" className="text-muted hover:text-cyan-400 transition-colors text-lg">← Nhịp Sinh Học</Link>
        <Link to="/pillar/c/neat" className="text-lg font-semibold" style={{ color: COLOR }}>NEAT →</Link>
      </div>

      {/* ── Practical tips modal — outside all RevealBlocks ── */}
      {tipIdx !== null && (
        <MorningModal
          item={PRACTICAL_TIPS[tipIdx]}
          idx={tipIdx}
          total={PRACTICAL_TIPS.length}
          onClose={() => setTipIdx(null)}
          onPrev={() => setTipIdx(i => Math.max(0, i - 1))}
          onNext={() => setTipIdx(i => Math.min(PRACTICAL_TIPS.length - 1, i + 1))}
          hasPrev={tipIdx > 0}
          hasNext={tipIdx < PRACTICAL_TIPS.length - 1}
        />
      )}

      {/* ── Why morning modal — outside all RevealBlocks ── */}
      {whyIdx !== null && (
        <MorningModal
          item={WHY_MORNING[whyIdx]}
          idx={whyIdx}
          total={WHY_MORNING.length}
          onClose={() => setWhyIdx(null)}
          onPrev={() => setWhyIdx(i => Math.max(0, i - 1))}
          onNext={() => setWhyIdx(i => Math.min(WHY_MORNING.length - 1, i + 1))}
          hasPrev={whyIdx > 0}
          hasNext={whyIdx < WHY_MORNING.length - 1}
        />
      )}

      {/* ── Mobility modal — outside all RevealBlocks ── */}
      {mobilityIdx !== null && (
        <MorningModal
          item={MOBILITY_5[mobilityIdx]}
          idx={mobilityIdx}
          total={MOBILITY_5.length}
          onClose={() => setMobilityIdx(null)}
          onPrev={() => setMobilityIdx(i => Math.max(0, i - 1))}
          onNext={() => setMobilityIdx(i => Math.min(MOBILITY_5.length - 1, i + 1))}
          hasPrev={mobilityIdx > 0}
          hasNext={mobilityIdx < MOBILITY_5.length - 1}
        />
      )}

      {/* ── Routine steps modal — outside all RevealBlocks ── */}
      {routineIdx !== null && (() => {
        const arr = routines[mode];
        const item = arr[routineIdx];
        return (
          <MorningModal
            item={item}
            idx={routineIdx}
            total={arr.length}
            onClose={() => setRoutineIdx(null)}
            onPrev={() => setRoutineIdx(i => Math.max(0, i - 1))}
            onNext={() => setRoutineIdx(i => Math.min(arr.length - 1, i + 1))}
            hasPrev={routineIdx > 0}
            hasNext={routineIdx < arr.length - 1}
          />
        );
      })()}
    </div>
  );
}
