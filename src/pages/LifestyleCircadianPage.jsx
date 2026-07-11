import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#06b6d4';
const RGB = '6,182,212';
const ORBIT_ID = 'c-circadian-orbit-kf';

const ENERGY_MAP = [
  {
    time: '6–8h', phase: 'Sáng sớm', level: 3, icon: '🌅',
    desc: 'Cortisol tự nhiên tăng. Tốt cho: cardio nhẹ, lập kế hoạch, bữa ăn có đạm.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol đạt đỉnh tự nhiên lúc 6–8h sáng — đây là "năng lượng mồi" của cơ thể để khởi động ngày mới. Đây là lý do bạn không nên uống cà phê ngay khi dậy.',
    detail: 'Cortisol awakening response (CAR) là cơ chế tự nhiên giúp cơ thể tỉnh giấc và sẵn sàng hoạt động. Nó tăng 50–100% trong 30 phút đầu sau khi thức dậy. Hiểu được điều này giúp bạn tận dụng năng lượng nội sinh thay vì phụ thuộc caffeine.',
    details: [
      'Cortisol awakening response (CAR) tăng 50–100% trong 30 phút đầu sau khi dậy — đây là năng lượng nội sinh mạnh nhất trong ngày, không cần caffeine.',
      'Ánh sáng mặt trời buổi sáng (đặc biệt 6–9h) kích hoạt đồng hồ sinh học và đặt lại nhịp 24h — 5–10 phút ngoài trời là đủ để kích hoạt tín hiệu này.',
      'Cardio nhẹ (đi bộ, yoga nhẹ) lúc 6–7h phù hợp hơn tập nặng vì nhiệt độ cơ thể còn thấp và cơ chưa warm-up đủ.',
      'Bữa sáng có đạm (trứng, sữa, đậu) trong khung giờ này giúp ổn định đường huyết và kéo dài cảm giác no đến buổi trưa.',
      'Lập kế hoạch ngày và xử lý thông tin tổng quan hiệu quả trong giai đoạn này khi não chuyển từ trạng thái ngủ sang hoạt động.',
      'Tránh uống cà phê ngay khi dậy — cortisol cao tự nhiên làm giảm hiệu quả caffeine và tăng nguy cơ lệ thuộc. Chờ 90–120 phút sau khi dậy.',
    ],
    points: [
      { icon: '⚡', label: 'Cortisol awakening', note: 'Tăng 50–100% trong 30 phút đầu sau dậy' },
      { icon: '☀️', label: 'Ánh sáng sáng sớm', note: '5–10 phút ngoài trời — đặt lại đồng hồ sinh học' },
      { icon: '🥚', label: 'Bữa sáng có đạm', note: 'Ổn định đường huyết, kéo dài no đến trưa' },
      { icon: '🚫', label: 'Tránh cà phê ngay', note: 'Chờ 90–120 phút sau dậy — tối ưu hiệu quả' },
    ],
  },
  {
    time: '9–11h', phase: 'Buổi sáng', level: 5, icon: '🔥',
    desc: 'Đỉnh năng lượng. Tốt cho: công việc quan trọng, tập luyện, sáng tạo.',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80&auto=format&fit=crop',
    keyFact: '9–11h là khung giờ "golden zone" của nhận thức — trí nhớ ngắn hạn, tập trung và phân tích logic đạt đỉnh. Đây là thời điểm hiếm hoi trong ngày không nên lãng phí vào email và họp không quan trọng.',
    detail: 'Nhiều nghiên cứu chronobiology xác nhận rằng thực hiện công việc đòi hỏi tư duy cao trong khung giờ 9–11h giúp năng suất tăng 20–30% so với cùng công việc đó lúc 14–16h. Đây là tài nguyên không thể tái tạo mỗi ngày.',
    details: [
      'Nhiệt độ cơ thể lúc này đang tăng dần — liên quan trực tiếp đến tốc độ xử lý nhận thức và khả năng tập trung của não bộ.',
      'Trí nhớ làm việc (working memory) và tốc độ phản ứng đạt đỉnh lúc 9–11h — phù hợp cho quyết định khó, viết lách, phân tích dữ liệu.',
      'Tập luyện cường độ cao (weightlifting, HIIT) trong khung giờ này cho kết quả tốt hơn buổi sáng sớm — cơ thể đã warm-up đủ, testosterone vẫn cao.',
      'Sáng tạo divergent (brainstorm, ideation) hoạt động tốt nhất lúc 9–11h khi tâm trí tỉnh táo, chưa mệt mỏi quyết định.',
      'Email và cuộc họp không cấp bách nên được xử lý vào khung giờ khác (11–12h hoặc 14–15h) để bảo vệ "peak window" này.',
      'Nếu bạn là "night owl", khung giờ đỉnh có thể trễ hơn 1–2 tiếng — nhưng nguyên tắc "bảo vệ peak window" vẫn áp dụng.',
    ],
    points: [
      { icon: '🧠', label: 'Đỉnh nhận thức', note: 'Working memory + tập trung + phân tích đạt cao nhất' },
      { icon: '💪', label: 'Tập luyện hiệu quả', note: 'Cơ thể đã warm-up, testosterone còn cao' },
      { icon: '🛡️', label: 'Bảo vệ khung giờ', note: 'Không họp lặt vặt, không check email vô định' },
      { icon: '📈', label: '+20–30% năng suất', note: 'So với cùng công việc thực hiện lúc 14–16h' },
    ],
  },
  {
    time: '12–14h', phase: 'Sau ăn trưa', level: 2, icon: '😴',
    desc: 'Năng lượng tụt. Tốt cho: nghỉ ngắn 10–20 phút, công việc dễ, đi bộ nhẹ.',
    color: '#94a3b8', rgb: '148,163,184',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tụt năng lượng sau ăn trưa (post-lunch dip) là hiện tượng sinh học bình thường — không phải vì bạn lười. Adenosine tích lũy + bữa ăn nhiều tinh bột tạo ra "double dip" khiến buồn ngủ rõ ràng.',
    detail: 'Nhiều nền văn hóa trên thế giới đã công nhận điều này: siesta ở Tây Ban Nha, đảo Địa Trung Hải, nhiều nước châu Á. NASA và quân đội Mỹ cũng nghiên cứu và áp dụng power nap trong khung giờ này để tăng hiệu suất.',
    details: [
      'Adenosine — phân tử gây buồn ngủ — tích lũy từ sáng sớm và đạt ngưỡng đủ để gây buồn ngủ nhẹ lúc 13–15h, trùng với nhịp sinh học giảm tự nhiên.',
      'Bữa ăn nhiều tinh bột nhanh (cơm trắng, bánh mì, nước ngọt) gây spike đường huyết rồi giảm nhanh → tăng insulin → buồn ngủ và mệt.',
      'Power nap 10–20 phút (không quá 30 phút) trong khung giờ này giúp phục hồi năng lượng hiệu quả hơn cà phê, không gây "ngủ quán tính" nếu đúng thời gian.',
      'Đi bộ 5–10 phút sau ăn trưa giúp ổn định đường huyết, tránh đường huyết giảm đột ngột và giảm buồn ngủ hiệu quả.',
      'Công việc nhẹ nhàng (trả lời email, cuộc họp ngắn, task đơn giản) phù hợp với khung giờ này khi não không trong trạng thái tập trung cao.',
      '"Caffeine nap" (uống cà phê rồi ngủ 20 phút ngay) là kỹ thuật hiệu quả nhất — caffeine mất 20 phút để hấp thụ, bạn tỉnh dậy đúng lúc nó có hiệu quả.',
    ],
    points: [
      { icon: '😪', label: 'Post-lunch dip sinh học', note: 'Adenosine tích lũy + nhịp circadian giảm tự nhiên' },
      { icon: '💤', label: 'Power nap 10–20 phút', note: 'Hiệu quả hơn cà phê, không gây ngủ quán tính' },
      { icon: '🚶', label: 'Đi bộ sau ăn', note: 'Ổn định đường huyết, giảm buồn ngủ hiệu quả' },
      { icon: '☕', label: 'Caffeine nap', note: 'Uống cà phê → ngủ 20 phút → tỉnh dậy tối ưu' },
    ],
  },
  {
    time: '15–17h', phase: 'Chiều', level: 4, icon: '⚡',
    desc: 'Năng lượng phục hồi. Nhiệt độ cơ thể cao nhất. Tốt cho: tập luyện cường độ cao, sáng tạo.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhiệt độ cơ thể đạt cao nhất lúc 15–17h — thời điểm lý tưởng cho tập luyện cường độ cao. Sức mạnh cơ, thời gian phản ứng và sức bền aerobic đều đạt đỉnh trong khung giờ này.',
    detail: 'Nghiên cứu thể thao cho thấy vận động viên thi đấu lúc 15–17h đạt thành tích tốt hơn buổi sáng khoảng 3–5%. Với người thường, đây là khung giờ tốt thứ hai trong ngày cho công việc đòi hỏi tư duy, sau giai đoạn phục hồi từ post-lunch dip.',
    details: [
      'Nhiệt độ cơ thể lõi đạt cực đại 15–17h — trực tiếp cải thiện hiệu suất cơ (strength output), tốc độ co cơ và khả năng chịu đựng aerobic.',
      'Thời gian phản ứng ngắn nhất trong ngày lúc 15–17h — lý tưởng cho các môn thể thao yêu cầu reflexes nhanh như cầu lông, tennis, bóng đá.',
      'Testosterone và adrenaline đạt mức tốt cho hiệu suất — cơ thể sẵn sàng tập luyện nặng hơn buổi sáng sớm (khi cơ thể vừa dậy).',
      'Sau power nap và bữa trưa tiêu hóa xong, não phục hồi khả năng tập trung — phù hợp cho công việc sáng tạo lần 2 trong ngày.',
      'Người đi làm văn phòng nếu không thể tập lúc 15–17h: tập lúc 17–19h sau giờ làm cũng nằm trong vùng "second wind" hiệu quả.',
      'Hạn chế: tập luyện cường độ cao sau 19h có thể làm tăng adrenaline và khó vào giấc — nên kết thúc tập nặng trước 20h.',
    ],
    points: [
      { icon: '🌡️', label: 'Nhiệt độ cơ thể đỉnh', note: 'Sức mạnh cơ + thời gian phản ứng tốt nhất trong ngày' },
      { icon: '🏋️', label: 'Tập nặng lý tưởng', note: 'Hiệu suất cao hơn buổi sáng ~3–5%' },
      { icon: '🎯', label: 'Second wind nhận thức', note: 'Sau power nap — não phục hồi tập trung tốt' },
      { icon: '⏰', label: 'Kết thúc trước 20h', note: 'Tập nặng sau 20h có thể ảnh hưởng giấc ngủ' },
    ],
  },
  {
    time: '18–20h', phase: 'Tối', level: 3, icon: '🌆',
    desc: 'Đang giảm dần. Tốt cho: đi bộ nhẹ, xã hội, nấu ăn, giãn cơ.',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: '18–20h là giai đoạn chuyển tiếp quan trọng — cơ thể bắt đầu "đóng cửa" hệ thần kinh kích thích. Quyết định sống trong 2 tiếng này ảnh hưởng trực tiếp đến chất lượng ngủ đêm.',
    detail: 'Cortisol bắt đầu giảm, nhiệt độ cơ thể từ từ hạ, hệ tiêu hóa vẫn đang xử lý bữa tối. Đây là thời điểm tốt nhất để kết nối xã hội, vận động nhẹ và chuẩn bị tâm lý cho việc nghỉ ngơi — không phải làm thêm việc nặng.',
    details: [
      'Cortisol bắt đầu giảm đáng kể từ 18h — cơ thể chuyển dần từ trạng thái "chiến đấu/bay" sang "nghỉ ngơi/tiêu hóa" (rest-and-digest mode).',
      'Đi bộ 20–30 phút sau bữa tối giúp ổn định đường huyết, hỗ trợ tiêu hóa và là hoạt động nhẹ nhàng không kích thích hệ thần kinh giao cảm.',
      'Hoạt động xã hội (trò chuyện gia đình, gặp bạn bè nhẹ nhàng) giúp giải phóng oxytocin và giảm cortisol — chuẩn bị tâm lý cho ngủ.',
      'Nấu ăn và chuẩn bị bữa tối đơn giản là hoạt động meditative tốt — tập trung vào hiện tại, nhịp độ chậm, không screen.',
      'Giãn cơ nhẹ, yoga phục hồi (yin yoga, stretching) trong khung giờ này giúp thả lỏng cơ sau ngày dài và chuẩn bị cơ thể cho giấc ngủ sâu.',
      'Tránh: email công việc, tin tức căng thẳng, tranh luận, quyết định lớn — cortisol giảm tự nhiên sẽ bị gián đoạn và ảnh hưởng đến giấc ngủ.',
    ],
    points: [
      { icon: '🚶', label: 'Đi bộ sau bữa tối', note: 'Ổn định đường huyết + tiêu hóa + giảm cortisol' },
      { icon: '👨‍👩‍👧', label: 'Kết nối xã hội nhẹ', note: 'Oxytocin tăng, cortisol giảm — chuẩn bị ngủ' },
      { icon: '🧘', label: 'Giãn cơ/yoga nhẹ', note: 'Thả lỏng cơ, chuẩn bị cơ thể cho ngủ sâu' },
      { icon: '🚫', label: 'Tránh công việc nặng', note: 'Email căng thẳng + quyết định lớn phá vỡ wind-down' },
    ],
  },
  {
    time: '21–23h', phase: 'Cuối ngày', level: 1, icon: '🌙',
    desc: 'Melatonin bắt đầu tăng. Giảm ánh sáng, giảm kích thích, chuẩn bị ngủ.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuyến tùng bắt đầu tiết melatonin lúc khoảng 21h khi ánh sáng giảm đủ — đây là "tín hiệu ngủ" tự nhiên mạnh nhất của cơ thể. Ánh sáng xanh từ màn hình trong giai đoạn này trực tiếp ức chế melatonin và trì hoãn giờ ngủ.',
    detail: 'Melatonin không phải là thuốc ngủ — nó là tín hiệu thời gian cho cơ thể biết "trời tối, sắp đến giờ ngủ". Nồng độ melatonin tăng dần trong 2–3 tiếng trước khi bạn thực sự ngủ. Bảo vệ giai đoạn này là quan trọng nhất để có giấc ngủ tự nhiên.',
    details: [
      'Tuyến tùng (pineal gland) bắt đầu tiết melatonin từ khoảng 21h khi cơ thể nhận tín hiệu ánh sáng giảm — quá trình này cần 2–3 tiếng để đạt đỉnh.',
      'Ánh sáng xanh 480nm từ màn hình điện thoại/laptop ức chế trực tiếp quá trình tiết melatonin — ngay cả dưới 10 phút xem màn hình sáng cũng đủ làm trễ giấc ngủ 30–60 phút.',
      'Nhiệt độ phòng lý tưởng cho ngủ là 18–20°C — cơ thể cần hạ nhiệt độ lõi 1–2°C để vào giấc ngủ sâu, phòng mát hỗ trợ quá trình này.',
      'Đọc sách giấy dưới đèn ấm là hoạt động lý tưởng nhất — không kích thích nhận thức, không ánh sáng xanh, nhịp độ chậm tự nhiên dẫn đến buồn ngủ.',
      'Tránh ăn nặng sau 21h — tiêu hóa kích hoạt hệ thần kinh và tăng thân nhiệt, cả hai đều cản trở quá trình vào giấc ngủ sâu.',
      'Nhất quán về giờ đi ngủ (±30 phút) là quan trọng nhất — cơ thể bắt đầu tiết melatonin đúng giờ khi nhịp sinh học được lập trình ổn định.',
    ],
    points: [
      { icon: '🌙', label: 'Melatonin tăng từ 21h', note: 'Tín hiệu ngủ tự nhiên — cần 2–3h để đạt đỉnh' },
      { icon: '📵', label: 'Không màn hình sáng', note: 'Ánh sáng 480nm ức chế melatonin trong <10 phút' },
      { icon: '❄️', label: 'Phòng 18–20°C', note: 'Cơ thể cần hạ nhiệt độ lõi để vào ngủ sâu' },
      { icon: '🕙', label: 'Giờ ngủ nhất quán', note: 'Lập trình nhịp sinh học — ±30 phút mỗi đêm' },
    ],
  },
];

const LIGHT_RULES = [
  {
    time: 'Sáng 6–10h', phase: 'Tăng ánh sáng tự nhiên', icon: '☀️', level: 5,
    tip: 'Ra ngoài 5–10 phút hoặc ngồi gần cửa sổ. Ánh nắng trực tiếp mạnh gấp 100 lần ánh đèn trong nhà.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng buổi sáng là tín hiệu quan trọng nhất để đặt lại đồng hồ sinh học 24h. Chỉ cần 5–10 phút ra ngoài lúc 6–9h mạnh gấp 100 lần ánh đèn trong nhà — và không thể thay thế bằng đèn nhân tạo.',
    detail: 'Tế bào ipRGC (intrinsically photosensitive retinal ganglion cells) trong võng mạc nhạy cảm đặc biệt với ánh sáng xanh ban ngày. Chúng gửi tín hiệu trực tiếp đến SCN (suprachiasmatic nucleus) — "đồng hồ chủ" của cơ thể — để đặt lại nhịp sinh học mỗi sáng.',
    details: [
      'Ánh sáng mặt trời buổi sáng chứa 10.000–100.000 lux, trong khi đèn LED trong nhà chỉ cho 100–500 lux — chênh lệch này lý giải tại sao ngồi gần cửa sổ không đủ hiệu quả bằng ra ngoài trực tiếp.',
      'Chỉ cần 5–10 phút tiếp xúc ánh sáng trực tiếp buổi sáng (không cần nhìn thẳng vào mặt trời) đủ để kích hoạt tín hiệu đặt lại đồng hồ sinh học.',
      'Ánh sáng sáng sớm tăng cortisol awakening response (CAR) — giúp bạn tỉnh táo nhanh hơn mà không cần caffeine ngay khi dậy.',
      'Lợi ích dài hạn: giờ ngủ ổn định hơn, dễ dậy đúng giờ hơn, ít cảm giác "lag" buổi sáng — đặc biệt rõ ràng sau 7–14 ngày áp dụng liên tục.',
      'Ngày흐u/mưa: ánh sáng ngoài trời vẫn mạnh hơn trong nhà (khoảng 1.000–5.000 lux ngay cả ngày흐u) — vẫn nên ra ngoài, thêm 5–10 phút so với ngày nắng.',
      'Kết hợp: đi bộ sáng sớm = ánh sáng tự nhiên + vận động nhẹ + không khí tươi — ba lợi ích circadian trong một hoạt động.',
    ],
    points: [
      { icon: '🌞', label: '10.000+ lux ngoài trời', note: 'Gấp 100 lần đèn nhà — không thể thay thế' },
      { icon: '⏱️', label: 'Chỉ cần 5–10 phút', note: 'Đủ để đặt lại đồng hồ sinh học mỗi sáng' },
      { icon: '⚡', label: 'Tăng cortisol sáng', note: 'Tỉnh táo tự nhiên, không cần caffeine ngay khi dậy' },
      { icon: '🌧️', label: 'Cả ngày흐u vẫn hiệu quả', note: '1.000–5.000 lux ngày흐u — vẫn hơn trong nhà nhiều' },
    ],
  },
  {
    time: 'Chiều 14–17h', phase: 'Duy trì ánh sáng đủ', icon: '🌤️', level: 4,
    tip: 'Tránh phòng tối hoàn toàn. Ánh sáng giúp tránh tụt năng lượng buổi chiều.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng buổi chiều giúp "neo" giai đoạn thức muộn của đồng hồ sinh học — đặc biệt quan trọng với người làm việc trong phòng tối suốt ngày. Thiếu ánh sáng chiều đẩy nhanh quá trình tiết melatonin, khiến bạn buồn ngủ sớm hơn bình thường.',
    detail: 'Nghiên cứu của Stanford (Andrew Huberman Lab) chỉ ra rằng việc tiếp xúc ánh sáng buổi chiều (14–17h) giúp cơ thể dự đoán thời điểm "tối thực sự" và điều chỉnh melatonin chính xác hơn — kết quả là ngủ ngon hơn vào đúng giờ bạn muốn.',
    details: [
      'Ánh sáng chiều giúp phân biệt "chiều muộn" với "tối" — không có tín hiệu này, cơ thể có thể bắt đầu tiết melatonin sớm hơn 1–2 tiếng.',
      'Người làm văn phòng không có cửa sổ: đi bộ ra ngoài 10 phút lúc 15–16h là thói quen đơn giản có tác động circadian đáng kể.',
      'Ánh sáng chiều ở mức 500–2.000 lux đủ hiệu quả — không cần ánh nắng trực tiếp như buổi sáng, ánh sáng tán xạ ngoài trời hoặc đèn sáng trong phòng cũng được.',
      'Tránh "phòng tối hoàn toàn" buổi chiều: phòng tối kích thích não nhận tín hiệu "sắp tối" sớm, làm tụt năng lượng và gây buồn ngủ sớm hơn mong muốn.',
      'Kết hợp với second wind (15–17h): ra ngoài 10 phút lúc 15h vừa nạp ánh sáng circadian vừa phá vỡ post-lunch dip và tận dụng đỉnh năng lượng buổi chiều.',
      'Mùa đông/ngày ngắn: ánh sáng chiều càng quan trọng hơn vì mặt trời xuống sớm — cân nhắc đèn light therapy 5.000–10.000 lux nếu ít tiếp xúc ánh sáng tự nhiên.',
    ],
    points: [
      { icon: '🔆', label: '500–2.000 lux đủ hiệu quả', note: 'Ánh sáng tán xạ ngoài trời hoặc đèn sáng trong nhà' },
      { icon: '🚶', label: 'Đi bộ 10 phút lúc 15h', note: 'Nạp ánh sáng + phá post-lunch dip + second wind' },
      { icon: '🏢', label: 'Tránh phòng tối cả chiều', note: 'Não nhận tín hiệu "tối" sớm → melatonin sớm hơn' },
      { icon: '❄️', label: 'Mùa đông cần nhiều hơn', note: 'Ngày ngắn → cân nhắc light therapy 5.000–10.000 lux' },
    ],
  },
  {
    time: 'Tối 20–22h', phase: 'Giảm ánh sáng mạnh', icon: '🌅', level: 2,
    tip: 'Dùng đèn ấm, giảm độ sáng màn hình. Night Mode trên thiết bị từ 20h.',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm ánh sáng xuống <50 lux (tương đương ánh nến) từ 20h giúp tuyến tùng bắt đầu tiết melatonin — cơ thể không phân biệt được "đèn LED trắng ban đêm" và "ban ngày". Đây là 2 tiếng quan trọng nhất để chuẩn bị cho giấc ngủ sâu.',
    detail: 'Hệ thống thị giác của con người tiến hóa trong môi trường lửa trại và ánh trăng buổi tối — ánh sáng ấm, yếu và không có ánh sáng xanh. Đèn LED hiện đại (đặc biệt ánh sáng trắng 5.000K+) hoàn toàn đảo lộn tín hiệu sinh học này.',
    details: [
      'Melanopsin trong tế bào võng mạc nhạy nhất với ánh sáng 480nm (xanh lam) — chính xác là bước sóng phổ biến nhất trong đèn LED trắng và màn hình thiết bị hiện đại.',
      'Ngưỡng <50 lux (tương đương ánh nến) là mức tối thiểu để tuyến tùng bắt đầu tiết melatonin — đèn phòng thông thường thường ở mức 200–500 lux, vượt ngưỡng hoàn toàn.',
      'Đèn ngủ ấm 2.700–3.000K (màu vàng/cam) chứa ít ánh sáng 480nm hơn đèn trắng ban ngày (5.000–6.500K) — thay thế thực tế và hiệu quả nhất.',
      'Night Mode / True Tone trên điện thoại và laptop giảm ánh sáng xanh nhưng KHÔNG loại bỏ hoàn toàn — vẫn tốt hơn không dùng, nhưng không ngang bằng tắt màn hình.',
      'Phòng tắm là điểm yếu lớn nhất: đèn LED trắng sáng lúc 22h phá hủy melatonin đã tích lũy — đặt đèn ngủ nhỏ ấm trong phòng tắm để dùng ban đêm.',
      'Smart bulb lập lịch tự động giảm về 2.700K lúc 20h mỗi đêm — đầu tư một lần, áp dụng tự động không cần nhớ, không cần ý chí.',
    ],
    points: [
      { icon: '🕯️', label: '<50 lux từ 20h', note: 'Ngưỡng để tuyến tùng bắt đầu tiết melatonin' },
      { icon: '🟠', label: 'Đèn 2.700–3.000K', note: 'Màu vàng/cam ấm — ít ánh sáng 480nm nhất' },
      { icon: '📱', label: 'Night Mode không đủ', note: 'Giảm nhưng không loại bỏ ánh sáng xanh hoàn toàn' },
      { icon: '💡', label: 'Smart bulb tự động', note: 'Lập lịch 2.700K lúc 20h — không cần nhớ mỗi đêm' },
    ],
  },
  {
    time: 'Đêm 22h+', phase: 'Giữ tối', icon: '🌙', level: 1,
    tip: 'Phòng ngủ tối hoàn toàn. Ngay cả đèn báo nhỏ cũng có thể ảnh hưởng chất lượng ngủ sâu.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngay cả ánh sáng yếu 10 lux (đèn báo, ánh đèn đường qua cửa sổ) trong lúc ngủ cũng làm giảm chất lượng ngủ sâu N3 và N4. Phòng ngủ tối hoàn toàn là thiết lập môi trường quan trọng nhất — đơn giản nhưng ít người thực hiện đúng.',
    detail: 'Nghiên cứu tại Northwestern University (2022) cho thấy ngủ trong phòng có ánh sáng nhẹ (100 lux) làm tăng nhịp tim, tăng insulin kháng trong khi ngủ và giảm chất lượng ngủ sâu đáng kể — ngay cả khi người ngủ không ý thức được ánh sáng.',
    details: [
      'Ánh sáng 10 lux trong phòng ngủ (tương đương đèn báo nhỏ hoặc ánh đèn đường qua rèm mỏng) đủ để ức chế melatonin một phần và làm giảm ngủ sâu.',
      'Da và mắt nhắm vẫn cảm nhận được ánh sáng qua mí mắt — hệ thống thần kinh không hoàn toàn "tắt" thị giác khi ngủ, đặc biệt là ipRGC vẫn nhạy cảm.',
      'Giải pháp đơn giản nhất: rèm blackout (che ánh đèn đường, ánh trăng) + che tất cả đèn báo nhỏ trong phòng (router, TV standby, sạc điện thoại).',
      'Mặt nạ ngủ (sleep mask) hiệu quả và rẻ nhất — đặc biệt hữu ích khi đi du lịch, phòng khách sạn thường có nhiều đèn LED không tắt được.',
      'Đèn báo cháy, đèn WiFi router, đèn TV standby: dán băng keo đen lên hoặc hướng về phía tường — âm thanh báo động vẫn hoạt động, chỉ che ánh sáng.',
      'Phòng ngủ tối + mát (18–20°C) + yên tĩnh là bộ ba môi trường tối ưu cho ngủ sâu — thiếu một yếu tố nào cũng làm giảm hiệu quả phục hồi.',
    ],
    points: [
      { icon: '🌑', label: 'Tối hoàn toàn < 5 lux', note: 'Ngay cả 10 lux cũng làm giảm ngủ sâu N3/N4' },
      { icon: '🪟', label: 'Rèm blackout', note: 'Che ánh đèn đường + ánh trăng qua cửa sổ' },
      { icon: '😴', label: 'Mặt nạ ngủ', note: 'Giải pháp đơn giản nhất — đặc biệt tốt khi du lịch' },
      { icon: '📡', label: 'Che đèn báo nhỏ', note: 'Router, TV standby, sạc — dán băng keo đen' },
    ],
  },
];

const POST_LUNCH_DIP = [
  {
    cause: 'Adenosine tích lũy', icon: '😴', level: 3,
    time: 'Adenosine tích lũy', phase: 'Nghỉ ngắn 10–20 phút',
    solution: 'Đây là chu kỳ sinh học bình thường lúc 13–15h. Nghỉ ngắn 10–20 phút hiệu quả hơn cà phê.',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Adenosine — phân tử gây buồn ngủ — tích lũy từ lúc thức dậy và đạt ngưỡng đủ để gây buồn ngủ rõ ràng lúc 13–15h, trùng với một nhịp sinh học circadian giảm tự nhiên. Đây không phải lỗi của bạn — đây là thiết kế sinh học.',
    detail: 'Hai yếu tố cùng lúc tạo ra "post-lunch dip": (1) áp lực ngủ từ adenosine tích lũy từ sáng, và (2) nhịp circadian có một điểm giảm tự nhiên lúc 13–15h — ngay cả những người không ăn trưa cũng trải qua điểm này. Bữa ăn nhiều tinh bột chỉ làm nó tệ hơn, không phải là nguyên nhân chính.',
    details: [
      'Adenosine tích lũy trong não từ thời điểm thức dậy — nồng độ tăng dần theo giờ thức. Đến 13–15h, đã đủ cao để gây buồn ngủ rõ ràng ngay cả khi không ăn trưa.',
      'Nhịp circadian có hai điểm giảm tự nhiên mỗi ngày: 2–4h sáng và 13–15h chiều — đây là kết quả tiến hóa, không phải do thói quen xấu.',
      'Power nap 10–20 phút (không quá 30 phút) trong khung giờ này giải phóng một phần adenosine mà không vào giấc ngủ sâu — bạn dậy tỉnh táo, không bị "ngủ quán tính".',
      'Nếu ngủ quá 30 phút: bạn vào N2/N3 (ngủ sâu hơn) — dậy bị ngủ quán tính (sleep inertia) mạnh, mất 20–30 phút để hoàn toàn tỉnh táo.',
      '"Caffeine nap": uống cà phê → ngủ 20 phút ngay → caffeine hấp thụ đúng lúc dậy — kết hợp hai hiệu ứng, tỉnh táo tốt hơn mỗi cái riêng lẻ.',
      'Không có điều kiện ngủ: thiền 10–15 phút, thở 4-7-8, hoặc đơn giản nhắm mắt + không kích thích cũng giúp giảm áp lực adenosine một phần.',
    ],
    points: [
      { icon: '🧠', label: 'Adenosine đạt ngưỡng', note: 'Tích lũy từ sáng, đủ để gây buồn ngủ lúc 13–15h' },
      { icon: '💤', label: 'Power nap 10–20 phút', note: 'Không quá 30 phút — tránh ngủ quán tính khi dậy' },
      { icon: '☕', label: 'Caffeine nap', note: 'Uống cà phê → ngủ 20 phút ngay → hai hiệu ứng cộng dồn' },
      { icon: '🌊', label: 'Nhịp circadian tự nhiên', note: 'Cả người không ăn trưa cũng buồn ngủ lúc 13–15h' },
    ],
  },
  {
    cause: 'Đường huyết sau ăn', icon: '🍚', level: 4,
    time: 'Đường huyết sau ăn', phase: 'Thêm đạm + rau vào bữa trưa',
    solution: 'Ăn nhiều tinh bột nhanh → đường huyết tăng nhanh → giảm nhanh → buồn ngủ. Fix: thêm đạm + rau.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa trưa nhiều tinh bột nhanh (cơm trắng, bánh mì, nước ngọt) gây spike đường huyết rồi giảm nhanh — kích hoạt insulin mạnh và tăng tryptophan vào não → serotonin → melatonin. Đây là "post-lunch dip tăng cường" do thực phẩm gây ra.',
    detail: 'Không phải cơm gây buồn ngủ — mà là tỷ lệ macro: cơm trắng không có đạm và chất xơ đi kèm. Cùng một lượng carb nhưng kết hợp với đạm + chất xơ sẽ làm đường huyết tăng chậm hơn, đều hơn và không có crash đột ngột sau đó.',
    details: [
      'Tinh bột nhanh (GI cao) gây đường huyết tăng nhanh → tụy tiết insulin nhiều → đường huyết giảm nhanh → não nhận tín hiệu "thiếu glucose" → buồn ngủ và khó tập trung.',
      'Tăng insulin sau ăn cũng thúc đẩy tryptophan vào não → chuyển thành serotonin → một phần chuyển thành melatonin — giải thích tại sao buồn ngủ hơn sau bữa ăn lớn.',
      'Fix đơn giản: thêm đạm (thịt, cá, đậu, trứng) và chất xơ (rau xanh) vào bữa trưa — làm chậm hấp thụ glucose, đường huyết đều hơn, không có crash.',
      'Giảm phần cơm 30% + thêm rau và đạm tương đương: đường huyết sau ăn thấp hơn đáng kể mà không cảm thấy đói hơn (nhờ đạm và chất xơ tạo no lâu).',
      'Nước ngọt, nước ép trái cây (kể cả 100% tự nhiên) trong bữa trưa: glucose liquid hấp thụ nhanh hơn solid — tránh hoặc thay bằng nước lọc trong bữa.',
      'Bữa trưa lý tưởng cho năng lượng chiều: ½ đĩa rau + ¼ đạm + ¼ carb phức hợp (gạo lứt, khoai lang) — đường huyết ổn định 3–4 tiếng sau ăn.',
    ],
    points: [
      { icon: '📊', label: 'Spike → crash đường huyết', note: 'Cơm trắng không kèm đạm/rau = đường huyết lên nhanh, xuống nhanh' },
      { icon: '🥩', label: 'Thêm đạm + chất xơ', note: 'Làm chậm hấp thụ glucose — năng lượng đều và bền hơn' },
      { icon: '🥗', label: '½ đĩa rau + ¼ đạm', note: 'Cơ cấu bữa trưa lý tưởng cho năng lượng chiều' },
      { icon: '🚫', label: 'Tránh nước ngọt bữa trưa', note: 'Glucose liquid hấp thụ nhanh nhất — tăng crash đột ngột' },
    ],
  },
  {
    cause: 'Ngồi yên sau ăn', icon: '🚶', level: 3,
    time: 'Ngồi yên sau ăn', phase: 'Đi bộ 5–10 phút sau bữa trưa',
    solution: 'Đi bộ 5–10 phút sau ăn trưa giúp tỉnh táo và ổn định đường huyết tốt hơn cà phê.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đi bộ 10 phút sau ăn làm giảm đỉnh đường huyết (glucose spike) tới 30% và duy trì nồng độ glucose ổn định lâu hơn — hiệu quả hơn cả 30 phút tập trước ăn. Đây là "hack" đơn giản nhất với tỷ lệ chi phí/lợi ích tốt nhất.',
    detail: 'Cơ bắp khi co rút trong khi đi bộ tiêu thụ glucose trực tiếp mà không cần insulin — giảm tải cho tụy và ngăn đường huyết tăng quá cao sau ăn. Kết hợp với ánh sáng tự nhiên và tư thế đứng, đi bộ sau ăn là một trong những thói quen có bằng chứng khoa học mạnh nhất.',
    details: [
      'Cơ bắp co rút khi đi bộ tiêu thụ glucose trực tiếp qua cơ chế không phụ thuộc insulin (GLUT4 translocation) — hạ đỉnh đường huyết sau ăn nhanh và hiệu quả.',
      'Nghiên cứu từ Đại học George Washington: đi bộ 15 phút sau mỗi bữa ăn kiểm soát đường huyết tốt hơn đi bộ 45 phút 1 lần/ngày — tổng thời gian ít hơn nhưng hiệu quả hơn.',
      'Tư thế đứng + đi giúp hệ tiêu hóa hoạt động tốt hơn ngồi: trọng lực hỗ trợ di chuyển thức ăn qua đường ruột và giảm áp lực lên cơ hoành.',
      'Ánh sáng tự nhiên trong 5–10 phút đi bộ trưa cũng giúp duy trì nhịp circadian buổi chiều — giảm nguy cơ melatonin tiết sớm hơn mong muốn.',
      'Không có không gian đi bộ: đứng tại chỗ hoặc ngồi trên ghế tập nhón gót (heel raises) cũng kích hoạt cơ bắp chân — ít hơn nhưng có tác động đo được.',
      'Sau 10 phút đi bộ: đường huyết ổn định hơn, não nhận đủ glucose đều đặn thay vì spike rồi crash — tỉnh táo và tập trung kéo dài hơn 45–60 phút so với ngồi ngay.',
    ],
    points: [
      { icon: '📉', label: 'Giảm glucose spike 30%', note: 'Cơ bắp tiêu thụ glucose trực tiếp khi đi bộ' },
      { icon: '⏱️', label: 'Chỉ cần 5–10 phút', note: 'Hiệu quả hơn tập 30 phút trước ăn về kiểm soát đường huyết' },
      { icon: '🧍', label: 'Không gian nhỏ cũng được', note: 'Đứng tại chỗ + heel raises — kích hoạt cơ bắp chân' },
      { icon: '☀️', label: 'Bonus: ánh sáng trưa', note: 'Duy trì nhịp circadian chiều — tránh melatonin tiết sớm' },
    ],
  },
  {
    cause: 'Thiếu nước', icon: '💧', level: 2,
    time: 'Thiếu nước', phase: 'Uống 200–300ml trước và sau bữa trưa',
    solution: 'Mất nước nhẹ (1–2%) gây mệt mỏi. Uống 200–300ml nước trước và sau bữa trưa.',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất nước chỉ 1–2% trọng lượng cơ thể (1.5–2kg với người 70kg) đủ để giảm hiệu suất nhận thức 5–10% và gây mệt mỏi rõ ràng — thấp hơn ngưỡng khát. Bạn mất nước trước khi cảm thấy khát.',
    detail: 'Nhiều người nhầm mệt mỏi buổi trưa với đói hoặc buồn ngủ, trong khi nguyên nhân thực sự là dehydration nhẹ tích lũy từ sáng. Não là cơ quan tiêu thụ nước nhiều nhất (chiếm 73% trọng lượng là nước) và nhạy cảm nhất với dehydration.',
    details: [
      'Mất nước 1% (700ml với người 70kg) làm giảm sự tập trung và tốc độ xử lý thông tin đo được — ngưỡng này thường đạt được trước bữa trưa nếu không uống nước từ sáng.',
      'Cảm giác khát chỉ xuất hiện khi mất nước khoảng 1.5–2% — nghĩa là đến lúc bạn khát, hiệu suất nhận thức đã giảm rồi.',
      'Não là 73% nước và tiêu thụ 20% lượng nước cơ thể — cơ quan nhạy cảm nhất với dehydration, giải thích tại sao thiếu nước gây mệt mỏi tinh thần rõ hơn mệt mỏi thể chất.',
      'Uống 200–300ml trước bữa trưa và 200ml sau: cung cấp đủ nước cho tiêu hóa và bù lại lượng nước mất qua hơi thở, mồ hôi từ sáng.',
      'Nước lọc hiệu quả nhất — nước có ga, nước ép, cà phê KHÔNG thay thế hoàn toàn được nước lọc cho mục đích hydration.',
      'Dấu hiệu đủ nước: nước tiểu màu vàng nhạt (như rơm) — vàng sậm = cần uống thêm ngay; trong suốt = uống nhiều hơn cần.',
    ],
    points: [
      { icon: '🧠', label: '73% não là nước', note: 'Cơ quan nhạy cảm nhất với dehydration trong cơ thể' },
      { icon: '📉', label: '1% mất nước = -5–10%', note: 'Hiệu suất nhận thức giảm trước khi bạn cảm thấy khát' },
      { icon: '💧', label: '200–300ml trước + sau', note: 'Bù lại lượng nước mất từ sáng, hỗ trợ tiêu hóa' },
      { icon: '🟡', label: 'Kiểm tra màu nước tiểu', note: 'Vàng nhạt như rơm = đủ nước; vàng sậm = cần uống thêm' },
    ],
  },
];

const TRACKER_SLOTS = [
  {
    slot: 'Sáng (7–9h)', icon: '🌅', level: 3,
    time: 'Sáng (7–9h)', phase: 'Theo dõi năng lượng khởi động',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Năng lượng buổi sáng là chỉ số nhạy cảm nhất phản ánh chất lượng giấc ngủ đêm trước. Một đêm ngủ sâu đủ → sáng tỉnh táo tự nhiên. Thiếu ngủ sâu → sáng uể oải dù ngủ đủ giờ.',
    detail: 'Sáng (7–9h) là "điểm xuất phát" của bản đồ năng lượng. Ghi lại mức năng lượng và những gì bạn ăn/làm giúp xác định xem thói quen buổi sáng nào thực sự giúp bạn tỉnh táo hơn — và thói quen nào đang kéo năng lượng xuống.',
    details: [
      'Ghi điểm năng lượng 1–5 lúc 8–9h: 1 = rất uể oải, 3 = bình thường, 5 = tỉnh táo hoàn toàn, không cần cà phê. Điểm thấp liên tục (1–2) sau 7+ tiếng ngủ = tín hiệu ngủ không sâu.',
      'Ghi "Ăn gì?": sáng ăn đạm (trứng, sữa) → thường năng lượng ổn đến trưa. Ăn bánh ngọt/tinh bột nhanh → đường huyết spike rồi crash trước 10h.',
      'Ghi "Làm gì?": đi bộ sáng hoặc ánh sáng tự nhiên → điểm năng lượng buổi sáng thường cao hơn 1–2 bậc so với ngồi trong nhà tối.',
      'So sánh điểm sáng với giờ ngủ đêm trước: pattern thường rõ sau 3–4 ngày — ngủ trước 23h → sáng hôm sau điểm cao hơn ngủ sau 0h dù cùng 7 tiếng.',
      'Ghi cà phê: uống ngay khi dậy (trước 8h) vs chờ đến 8–9h — tuần đầu ghi nhận xem cách nào cho năng lượng buổi sáng bền hơn.',
      'Pattern cần chú ý: nếu điểm sáng luôn ≤ 2 dù ngủ ≥ 7h, có thể ngủ không sâu do: rượu tối hôm trước, phòng quá sáng/ấm, ngủ không đúng giờ cố định.',
    ],
    points: [
      { icon: '📊', label: 'Chỉ số chất lượng ngủ', note: 'Điểm sáng phản ánh ngủ sâu đêm trước chính xác hơn giờ ngủ' },
      { icon: '🥚', label: 'Ghi bữa sáng', note: 'Đạm vs tinh bột — tác động đến năng lượng trước 10h' },
      { icon: '☀️', label: 'Ghi ánh sáng/vận động', note: 'Ra ngoài sáng sớm → điểm cao hơn 1–2 bậc' },
      { icon: '🔍', label: 'So sánh với giờ ngủ', note: 'Pattern ngủ sớm → sáng tốt hơn thường rõ sau 3–4 ngày' },
    ],
  },
  {
    slot: 'Trưa (11–13h)', icon: '☀️', level: 5,
    time: 'Trưa (11–13h)', phase: 'Theo dõi đỉnh năng lượng',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Trưa (11–13h) là thời điểm năng lượng cao nhất trong ngày với hầu hết mọi người. Ghi lại điểm năng lượng TRƯỚC bữa trưa — sau khi ăn điểm sẽ thay đổi do post-lunch dip. So sánh hai điểm giúp bạn biết bữa trưa ảnh hưởng đến năng lượng chiều như thế nào.',
    detail: 'Điểm 11h là đỉnh thật sự của nhịp sinh học — không bị ảnh hưởng bởi bữa ăn. Điểm 13h phản ánh tác động của bữa trưa. Chênh lệch lớn (ví dụ từ 5 xuống 2) = bữa trưa nhiều tinh bột nhanh. Chênh lệch nhỏ (từ 5 xuống 4) = bữa trưa cân đối tốt.',
    details: [
      'Ghi điểm 11h (TRƯỚC ăn): đây là điểm circadian thật sự, phản ánh năng lượng nội sinh không bị ảnh hưởng bởi thực phẩm. Điểm này thường cao nhất trong ngày.',
      'Ghi điểm 13h (SAU ăn): so sánh với điểm 11h — chênh lệch lớn (≥ 2 bậc) cho thấy bữa trưa đang gây post-lunch dip mạnh hơn bình thường.',
      'Ghi "Ăn gì?": cơm trắng + ít rau/đạm → chênh lệch lớn. Gạo lứt + nhiều rau + đạm → chênh lệch nhỏ hơn. Pattern này thường rõ sau 3–5 ngày ghi chép.',
      'Ghi "Làm gì?": nếu 11h bạn đang xử lý email không quan trọng — bạn đang "lãng phí" đỉnh nhận thức. Pattern này cần thay đổi: đặt task quan trọng nhất vào 9–11h.',
      'Nếu điểm 11h luôn chỉ ở 3–4 (không bao giờ đạt 5): xem xét chất lượng ngủ sâu, lịch caffeine, hoặc căng thẳng mãn tính làm giảm "ceiling" năng lượng.',
      'So sánh điểm trưa với thứ trong tuần: nhiều người báo cáo điểm thứ 2 thấp hơn (ngủ bù cuối tuần lệch nhịp) và điểm thứ 6 cao hơn (nhịp ổn định cả tuần).',
    ],
    points: [
      { icon: '🎯', label: 'Ghi 11h VÀ 13h', note: 'Trước và sau ăn — chênh lệch = tác động bữa trưa' },
      { icon: '🔝', label: 'Đỉnh circadian thật sự', note: 'Điểm 11h = năng lượng nội sinh — không bị thực phẩm ảnh hưởng' },
      { icon: '📉', label: 'Chênh lệch ≥ 2 = tín hiệu', note: 'Bữa trưa nhiều tinh bột nhanh — cần điều chỉnh macro' },
      { icon: '📅', label: 'So sánh thứ trong tuần', note: 'Thứ 2 thấp = ngủ bù cuối tuần lệch nhịp circadian' },
    ],
  },
  {
    slot: 'Chiều (14–16h)', icon: '⚡', level: 4,
    time: 'Chiều (14–16h)', phase: 'Theo dõi phục hồi sau post-lunch dip',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chiều (14–16h) là khoảng thời gian phục hồi sau post-lunch dip và bước vào second wind. Điểm chiều phụ thuộc mạnh vào: (1) bữa trưa có đạm/rau không, (2) có nghỉ ngắn sau trưa không, (3) caffeine cut-off có đúng giờ không.',
    detail: 'Second wind thật sự bắt đầu lúc ~15h khi nhiệt độ cơ thể đạt đỉnh — đây là cơ hội tốt thứ hai trong ngày cho công việc quan trọng. Nhưng nhiều người bỏ lỡ vì post-lunch dip kéo dài quá lâu do bữa trưa không phù hợp.',
    details: [
      'Ghi điểm 15h: nếu vẫn ≤ 2 sau bữa trưa tốt → đây là post-lunch dip circadian bình thường. Nếu vẫn ≤ 2 sau bữa trưa cân đối + nghỉ ngắn → xem xét chất lượng ngủ đêm.',
      'Ghi "Làm gì 14–15h?": power nap 10–20 phút → điểm 15h thường cao hơn 1–2 bậc so với không nghỉ. Caffeine nap → thường cao hơn 2+ bậc.',
      'Ghi caffeine: uống cà phê lúc mấy giờ và điểm chiều? Pattern caffeine ảnh hưởng đến điểm tối và chất lượng ngủ thường rõ sau 5–7 ngày ghi chép.',
      'So sánh điểm 15h với bữa trưa: ngày ăn ít tinh bột + nhiều đạm/rau → điểm 15h thường cao hơn 1 bậc và phục hồi nhanh hơn 30–60 phút.',
      'Ghi tập luyện: nếu tập lúc 15–17h, ghi điểm trước và sau tập — nhiều người báo cáo điểm sau tập buổi chiều cao hơn đáng kể và duy trì đến tối.',
      'Pattern cần chú ý: điểm chiều luôn ≤ 2 dù bữa trưa tốt + nghỉ ngắn = dấu hiệu sleep debt tích lũy từ nhiều ngày — cần "trả nợ ngủ" bằng cách ngủ sớm hơn 30–60 phút trong 3–5 ngày.',
    ],
    points: [
      { icon: '💤', label: 'Ghi power nap', note: 'Nghỉ 10–20 phút → điểm 15h thường +1–2 bậc' },
      { icon: '☕', label: 'Ghi giờ uống cà phê', note: 'Tương quan với điểm tối và chất lượng ngủ — rõ sau 5–7 ngày' },
      { icon: '🔄', label: 'Phục hồi nhanh = bữa trưa tốt', note: 'Đạm + rau → second wind lúc 15h, không kéo dài đến 16h' },
      { icon: '⚠️', label: 'Luôn ≤ 2 buổi chiều', note: 'Sleep debt tích lũy — cần ngủ sớm hơn 3–5 đêm liên tiếp' },
    ],
  },
  {
    slot: 'Tối (18–20h)', icon: '🌆', level: 3,
    time: 'Tối (18–20h)', phase: 'Theo dõi wind-down tự nhiên',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Điểm tối (18–20h) lý tưởng là 2–3/5 — đang giảm tự nhiên, không còn đỉnh năng lượng nhưng chưa kiệt sức. Điểm tối quá cao (4–5) = quá kích thích, khó vào giấc. Điểm tối quá thấp (≤ 1) = kiệt sức, sleep debt tích lũy.',
    detail: 'Điểm tối là chỉ số dự đoán tốt nhất cho chất lượng ngủ đêm đó. Điểm tối ổn định 2–3 qua nhiều ngày = nhịp sinh học hoạt động tốt. Điểm tối dao động mạnh (hôm 5, hôm 1) = nhịp sinh học không ổn định — cần xem xét giờ ngủ thức và ánh sáng buổi tối.',
    details: [
      'Điểm tối lý tưởng là 2–3: cơ thể đang "hạ cánh" tự nhiên — đủ năng lượng để sinh hoạt xã hội, nấu ăn, giãn cơ nhẹ, nhưng không còn năng lượng để làm việc nặng.',
      'Điểm tối 4–5: quá kích thích — thường do tập luyện cường độ cao sau 19h, cà phê muộn, tin tức căng thẳng, tranh luận. Dự báo khó vào giấc đêm đó.',
      'Điểm tối ≤ 1: kiệt sức — thường do sleep debt tích lũy (không ngủ đủ nhiều đêm liên tiếp). Đây là tín hiệu cần ưu tiên ngủ sớm hơn, không phải uống cà phê hôm sau.',
      'Ghi "Làm gì 18–20h?": xem phim hành động/tin tức → điểm tối thường cao hơn và khó ngủ. Đi bộ nhẹ/trò chuyện gia đình/đọc sách → điểm tối giảm tự nhiên hơn.',
      'Ghi ánh sáng: dùng đèn ấm + giảm màn hình từ 20h → điểm tối thường ≤ 3 lúc 21h. Dùng đèn sáng + màn hình → điểm tối cao hơn và trễ hơn 1–2 tiếng.',
      'Sau 7 ngày: so sánh điểm tối với điểm sáng hôm sau — pattern thường rõ: tối điểm 2–3 → sáng hôm sau 4–5. Tối điểm 5 → sáng hôm sau 2–3.',
    ],
    points: [
      { icon: '🎯', label: 'Lý tưởng: điểm 2–3 tối', note: 'Đang hạ cánh tự nhiên — không quá cao cũng không kiệt sức' },
      { icon: '⚠️', label: 'Điểm tối 4–5 = tín hiệu', note: 'Quá kích thích → dự báo khó vào giấc đêm nay' },
      { icon: '🔋', label: 'Điểm ≤ 1 = sleep debt', note: 'Cần ngủ sớm hơn, không phải cà phê nhiều hơn sáng mai' },
      { icon: '🔗', label: 'Tối ↔ sáng hôm sau', note: 'Pattern tương quan rõ nhất sau 7 ngày ghi chép' },
    ],
  },
];

const CAFFEINE_GUIDE = [
  {
    rule: 'Không uống khi vừa thức dậy', icon: '⏰', level: 3,
    time: 'Không uống khi vừa thức dậy', phase: 'Uống sau 90–120 phút dậy',
    reason: 'Cortisol tự nhiên đã cao 6–8h. Caffeine lúc này ít tác dụng hơn và có thể gây lệ thuộc.',
    good: 'Uống sau 90–120 phút dậy (8–9h nếu dậy lúc 6h)',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol tự nhiên đạt đỉnh trong 30–60 phút đầu sau khi dậy. Uống cà phê ngay lúc này vừa lãng phí (cortisol đã làm công việc của caffeine), vừa dạy não rằng caffeine mới = tỉnh táo — nền của lệ thuộc.',
    detail: 'Cơ chế lệ thuộc caffeine bắt đầu từ đây: khi bạn uống cà phê ngay sau dậy mỗi ngày, não giảm sản xuất cortisol tự nhiên buổi sáng và tăng receptor adenosine — dần dần bạn cần caffeine chỉ để cảm thấy "bình thường", không phải để tỉnh táo hơn.',
    details: [
      'Cortisol awakening response (CAR) tăng 50–100% trong 30–60 phút đầu sau dậy — đây là chất kích thích tự nhiên mạnh nhất mà não tự sản xuất mỗi sáng.',
      'Caffeine hoạt động bằng cách block receptor adenosine (gây buồn ngủ). Khi cortisol cao, adenosine đã bị ức chế tự nhiên — caffeine lúc này có ít "chỗ" để tác động, hiệu quả giảm rõ.',
      'Uống cà phê ngay sau dậy mỗi ngày khiến não giảm sản xuất cortisol buổi sáng theo thời gian — bạn cần caffeine chỉ để cảm thấy bình thường, không phải để tỉnh hơn.',
      'Chờ 90–120 phút sau khi dậy (khi cortisol bắt đầu giảm) là lúc caffeine có hiệu quả cao nhất — bạn dùng ít hơn nhưng cảm thấy tác động mạnh hơn.',
      'Trong 90 phút đầu: uống nước (250–500ml), ra ngoài lấy ánh sáng, ăn nhẹ có đạm — ba việc này giúp tỉnh táo không kém cà phê và không gây lệ thuộc.',
      'Thử thách 14 ngày: không cà phê trước 9h — sau 2 tuần, phần lớn người báo cáo tỉnh táo buổi sáng tốt hơn và ít cần caffeine hơn trong ngày.',
    ],
    points: [
      { icon: '📈', label: 'Cortisol đỉnh sáng sớm', note: 'Tự nhiên tăng 50–100% — làm công việc caffeine thay bạn' },
      { icon: '⏳', label: 'Chờ 90–120 phút', note: 'Caffeine hiệu quả nhất khi cortisol bắt đầu giảm' },
      { icon: '🔄', label: 'Tránh lệ thuộc', note: 'Uống sớm → não giảm cortisol → cần caffeine chỉ để "bình thường"' },
      { icon: '💧', label: 'Thay bằng nước + ánh sáng', note: '250–500ml nước + 5 phút ngoài trời — tỉnh táo không lệ thuộc' },
    ],
  },
  {
    rule: 'Không uống khi đói', icon: '🫙', level: 3,
    time: 'Không uống khi đói', phase: 'Uống sau khi ăn nhẹ có đạm',
    reason: 'Caffeine khi dạ dày rỗng gây kích ứng axit và tim đập nhanh hơn.',
    good: 'Uống sau khi uống nước và ăn nhẹ có đạm',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Caffeine khi dạ dày rỗng kích thích sản xuất axit dạ dày trực tiếp và làm tăng cortisol thêm — gây tim đập nhanh, lo lắng, kích ứng dạ dày và làm tăng cảm giác "cần caffeine" của não nhanh hơn.',
    detail: 'Thức ăn (đặc biệt đạm) làm chậm hấp thụ caffeine vào máu — thay vì spike nhanh rồi crash, bạn có đường cong năng lượng đều và kéo dài hơn. Đây là lý do uống cà phê sau bữa sáng cho cảm giác tốt hơn và bền hơn uống trước.',
    details: [
      'Caffeine khi dạ dày rỗng được hấp thụ nhanh hơn 45% vào máu — tạo spike cortisol đột ngột và tăng axit dạ dày, gây kích ứng, buồn nôn nhẹ hoặc tim đập nhanh ở người nhạy cảm.',
      'Thức ăn có đạm (trứng, sữa, các loại đậu) làm chậm hấp thụ caffeine — đường cong năng lượng đều hơn, không có crash đột ngột sau 2–3 tiếng.',
      'Caffeine khi đói làm tăng cortisol thêm lên — nếu buổi sáng bạn đã căng thẳng, uống cà phê khi đói có thể đẩy cortisol lên mức gây lo lắng hoặc bồn chồn.',
      'Uống nước trước khi uống cà phê (ít nhất 250ml): dehydration nhẹ sau ngủ đêm tăng cường tác động tiêu cực của caffeine khi dạ dày rỗng.',
      'Nếu không thể ăn sáng: ít nhất uống 1 ly nước và ăn 1 nắm hạt hoặc 1 quả trứng luộc trước cà phê — đủ để giảm thiểu tác động tiêu cực.',
      'Cà phê bulletproof (pha với bơ/dầu dừa) là giải pháp cho người ăn sáng muộn — chất béo làm chậm hấp thụ tương tự thức ăn, giảm spike cortisol.',
    ],
    points: [
      { icon: '⚡', label: 'Hấp thụ nhanh hơn 45%', note: 'Khi đói → spike đột ngột → lo lắng, tim đập nhanh' },
      { icon: '🥚', label: 'Ăn đạm trước', note: 'Làm chậm hấp thụ — năng lượng đều và bền hơn' },
      { icon: '💧', label: 'Nước trước tiên', note: '250ml nước sau ngủ dậy — giảm dehydration trước caffeine' },
      { icon: '🥜', label: 'Tối thiểu: 1 nắm hạt', note: 'Đủ để giảm kích ứng nếu không ăn sáng được' },
    ],
  },
  {
    rule: 'Tránh sau 14–15h', icon: '🕒', level: 4,
    time: 'Tránh sau 14–15h', phase: 'Người nhạy cảm: cut-off sau 12–13h',
    reason: 'Half-life caffeine ~5–6 giờ. Uống 15h → còn ½ lúc 21h → khó vào giấc.',
    good: 'Người nhạy cảm: cut-off sau 12–13h',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Half-life caffeine là 5–6 giờ — uống 1 ly cà phê lúc 15h, còn ½ lượng caffeine trong máu lúc 21h khi bạn cần vào giấc. Không phải caffeine làm bạn "tỉnh", nó block adenosine — adenosine vẫn tích lũy nhưng bị che khuất, gây sleep debt ẩn.',
    detail: 'Nhiều người uống cà phê buổi chiều và vẫn ngủ được — nhưng ngủ không sâu. Caffeine còn trong máu làm giảm ngủ sóng chậm (slow-wave sleep / N3) tới 20% ngay cả khi bạn ngủ đủ giờ. Bạn ngủ đủ số giờ nhưng không phục hồi đủ.',
    details: [
      'Half-life caffeine trung bình là 5–6 giờ, nhưng dao động 3–9 giờ tùy gen CYP1A2 — 50% dân số là "slow metabolizers" cần thêm 2–3 giờ để thải hoàn toàn.',
      'Uống 200mg caffeine (1 ly cà phê lớn) lúc 15h → còn 100mg lúc 21h → 50mg lúc 3h sáng — tương đương ½ ly espresso đang trong máu khi bạn ngủ.',
      'Caffeine giảm ngủ sóng chậm (deep sleep N3) tới 20% ngay cả khi bạn ngủ đủ 7–8 tiếng — bạn ngủ đủ giờ nhưng không phục hồi đủ, thức dậy vẫn mệt.',
      'Adenosine tích lũy suốt ngày nhưng bị caffeine block — khi caffeine hết tác dụng lúc đêm, adenosine "tràn" vào đột ngột, gây cảm giác kiệt sức buổi chiều muộn.',
      'Test cá nhân: thử cut-off sau 13h trong 1 tuần và ghi nhận chất lượng ngủ. Nếu cải thiện rõ rệt, bạn là slow metabolizer — cần cut-off sớm hơn.',
      'Thay thế sau 14h: green tea (ít caffeine hơn ~30mg, có L-theanine làm mượt tác dụng), nước uống mát, đi bộ ngắn — đủ phá post-lunch dip mà không ảnh hưởng ngủ.',
    ],
    points: [
      { icon: '⏱️', label: 'Half-life 5–6 giờ', note: '15h → còn ½ lúc 21h — đang trong máu khi vào giấc' },
      { icon: '😴', label: 'Giảm ngủ sâu 20%', note: 'Dù ngủ đủ giờ — không phục hồi đủ, dậy vẫn mệt' },
      { icon: '🧬', label: 'Gen CYP1A2 quan trọng', note: '50% người chuyển hóa chậm — cần cut-off trước 13h' },
      { icon: '🍵', label: 'Thay bằng green tea', note: '~30mg + L-theanine — nhẹ nhàng hơn, không phá giấc ngủ' },
    ],
  },
  {
    rule: 'Không dùng che lấp thiếu ngủ', icon: '🚫', level: 2,
    time: 'Không dùng che lấp thiếu ngủ', phase: 'Ngủ đủ + ít caffeine > ít ngủ + nhiều caffeine',
    reason: 'Caffeine không thay thế ngủ. Nó chỉ block cảm giác buồn ngủ, không phục hồi chức năng nhận thức.',
    good: 'Ngủ đủ + ít caffeine > ít ngủ + nhiều caffeine',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Caffeine block adenosine receptor — che khuất cảm giác mệt nhưng KHÔNG phục hồi hiệu suất nhận thức. Người thiếu ngủ + nhiều caffeine vẫn ra quyết định tệ như người say rượu, nhưng không cảm thấy như vậy. Đây là "ảo giác tỉnh táo" nguy hiểm nhất.',
    detail: 'Nghiên cứu của Matthew Walker (Why We Sleep) và các nhóm tại Harvard chỉ ra rằng caffeine có thể che lấp cảm giác buồn ngủ chủ quan nhưng không cải thiện được tốc độ phản ứng, trí nhớ làm việc, hay khả năng ra quyết định của người thiếu ngủ — các chức năng này chỉ phục hồi được bằng ngủ thật sự.',
    details: [
      'Caffeine block adenosine receptor nhưng adenosine vẫn tiếp tục tích lũy đằng sau — khi caffeine hết, toàn bộ adenosine tràn vào cùng lúc, gây "crash" mạnh hơn bình thường.',
      'Người thiếu ngủ mãn tính (< 6h/đêm) tích lũy "sleep debt" không thể trả bằng caffeine — não mất khả năng nhận ra chính xác mức độ mệt mỏi của mình (mất calibration).',
      'Ngủ đủ + 1 ly cà phê sáng > ngủ thiếu + 3–4 ly cà phê/ngày — về mọi thước đo: năng suất, trí nhớ, quyết định, sức khỏe dài hạn.',
      'Caffeine không phục hồi: trí nhớ consolidation (chỉ xảy ra khi ngủ sâu N3), emotional regulation (REM sleep), motor learning, immune function.',
      '"Caffeine nap" là ngoại lệ hợp lý duy nhất: uống cà phê → ngủ 20 phút ngay → caffeine hấp thụ đúng lúc bạn dậy = tỉnh táo thật sự trong 2–3 tiếng.',
      'Dấu hiệu bạn đang dùng caffeine che lấp thiếu ngủ: cần >3 ly/ngày để cảm thấy bình thường, không thể hoạt động sáng hôm sau mà không có cà phê, ngủ ngay khi ngồi yên.',
    ],
    points: [
      { icon: '🎭', label: 'Ảo giác tỉnh táo', note: 'Block cảm giác mệt nhưng không phục hồi hiệu suất thật' },
      { icon: '🧠', label: 'Ngủ không thể thay thế', note: 'Trí nhớ, cảm xúc, motor learning chỉ phục hồi khi ngủ' },
      { icon: '💥', label: 'Crash kép sau đó', note: 'Adenosine tích lũy → tràn vào khi caffeine hết → crash mạnh hơn' },
      { icon: '💤', label: 'Caffeine nap hợp lệ', note: 'Uống → ngủ 20 phút ngay → caffeine hấp thụ đúng lúc dậy' },
    ],
  },
];

function EnergyModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.phase} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
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
        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-bold tabular-nums" style={{ color: item.color }}>{item.time}</span>
            <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ color: item.color, background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>{item.phase}</span>
          </div>
          {/* Energy level dots */}
          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="w-4 h-2 rounded-full" style={{ background: n <= item.level ? item.color : `rgba(${item.rgb},0.2)` }} />
            ))}
          </div>
          {/* Key fact */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          {/* Numbered details */}
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          {/* Key points 2-col */}
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
          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {ENERGY_MAP.length}</span>
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

export default function LifestyleCircadianPage() {
  const { t: tPillars } = useTranslation('pillars');
  const hero = tPillars('pillarC.c_circadian_hero', { returnObjects: true }) || {};
  const trEM = tPillars('pillarC.c_circ_energy_map', { returnObjects: true });
  const energyMap = Array.isArray(trEM) ? ENERGY_MAP.map((it, i) => ({ ...it, ...(trEM[i] || {}) })) : ENERGY_MAP;
  const trLR = tPillars('pillarC.c_circ_light_rules', { returnObjects: true });
  const lightRules = Array.isArray(trLR) ? LIGHT_RULES.map((it, i) => ({ ...it, ...(trLR[i] || {}) })) : LIGHT_RULES;
  const trCaf = tPillars('pillarC.c_circ_caffeine', { returnObjects: true });
  const caffeineGuide = Array.isArray(trCaf) ? CAFFEINE_GUIDE.map((it, i) => ({ ...it, ...(trCaf[i] || {}) })) : CAFFEINE_GUIDE;
  const trPL = tPillars('pillarC.c_circ_post_lunch', { returnObjects: true });
  const postLunchDip = Array.isArray(trPL) ? POST_LUNCH_DIP.map((it, i) => ({ ...it, ...(trPL[i] || {}) })) : POST_LUNCH_DIP;
  const trTR = tPillars('pillarC.c_circ_tracker', { returnObjects: true });
  const trackerSlots = Array.isArray(trTR) ? TRACKER_SLOTS.map((it, i) => ({ ...it, ...(trTR[i] || {}) })) : TRACKER_SLOTS;
  const s5bullets = tPillars('pillarC.c_circ_s5_bullets', { returnObjects: true });
  const detailLabel = tPillars('pillarC.c_circ_detail_label') || 'Chi tiết →';
  const [energyIdx, setEnergyIdx] = useState(null);
  const [lightIdx, setLightIdx] = useState(null);
  const [caffeineIdx, setCaffeineIdx] = useState(null);
  const [dipIdx, setDipIdx] = useState(null);
  const [trackerIdx, setTrackerIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-circ-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cCircSpin { to { --c-circ-angle: 360deg; } }
      .c-circ-ring {
        background: conic-gradient(from var(--c-circ-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cCircSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-cyan-400 transition-colors">
        {hero.breadcrumb || '← Lối Sống Khỏe'}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          ☀️
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{hero.title || 'Nhịp Sinh Học & Năng Lượng'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            {hero.badge || 'C2 — Circadian Rhythm · Năng lượng 24h'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {hero.desc || 'Cơ thể có đồng hồ sinh học 24h. Hiểu và sống theo nhịp này giúp bạn có năng lượng ổn định, ngủ tốt hơn và không cần dựa vào caffeine để tồn tại.'}
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-circ-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80&auto=format&fit=crop"
              alt="Nhịp sinh học" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Ánh sáng · Nhịp ngủ thức · Năng lượng
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Energy map */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{tPillars('pillarC.c_circ_s1_title') || 'Bản Đồ Năng Lượng Trong Ngày'}</h2>
        <p className="text-muted text-lg mb-6">{tPillars('pillarC.c_circ_s1_sub') || 'Năng lượng không đều nhau suốt ngày. Làm việc đúng loại vào đúng thời điểm giúp hiệu quả tăng rõ rệt.'}</p>
        <div className="space-y-3">
          {energyMap.map((e, i) => (
            <div key={i}
              className="flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${e.rgb},0.05)`, border: `1px solid rgba(${e.rgb},0.15)` }}
              onClick={() => setEnergyIdx(i)}>
              <div className="shrink-0 w-8 flex items-center justify-center text-2xl">{e.icon}</div>
              <div className="shrink-0 w-20">
                <div className="text-base font-bold tabular-nums" style={{ color: e.color }}>{e.time}</div>
                <div className="text-sm text-muted">{e.phase}</div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-3 h-1.5 rounded-full" style={{ background: n <= e.level ? e.color : `rgba(${e.rgb},0.2)` }} />
                  ))}
                </div>
              </div>
              <p className="text-muted text-base flex-1">{e.desc}</p>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: e.color, background: `rgba(${e.rgb},0.1)` }}>{detailLabel}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Light rules */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{tPillars('pillarC.c_circ_s2_title') || 'Quy Tắc Ánh Sáng'}</h2>
        <p className="text-muted text-lg mb-6">{tPillars('pillarC.c_circ_s2_sub') || 'Ánh sáng là tín hiệu quan trọng nhất điều chỉnh đồng hồ sinh học. Sáng: tăng. Tối: giảm. Đêm: giữ tối.'}</p>
        <div className="grid gap-4">
          {lightRules.map((rule, i) => (
            <div key={i}
              className="p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ borderColor: `rgba(${rule.rgb},0.2)`, background: `rgba(${rule.rgb},0.05)` }}
              onClick={() => setLightIdx(i)}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{rule.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-text text-lg">{rule.time}</div>
                  <div className="text-base font-semibold" style={{ color: rule.color }}>{rule.phase}</div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg opacity-60 shrink-0"
                  style={{ color: rule.color, background: `rgba(${rule.rgb},0.1)` }}>{detailLabel}</span>
              </div>
              <p className="text-muted text-base leading-relaxed">{rule.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Caffeine */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{tPillars('pillarC.c_circ_s3_title') || 'Caffeine Thông Minh'}</h2>
        <p className="text-muted text-lg mb-6">{tPillars('pillarC.c_circ_s3_sub') || 'Dùng caffeine như công cụ, không phải phao cứu sinh. Biết khi nào dùng và khi nào không.'}</p>
        <div className="space-y-4">
          {caffeineGuide.map((g, i) => (
            <div key={i}
              className="p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ borderColor: `rgba(${g.rgb},0.2)`, background: `rgba(${g.rgb},0.05)` }}
              onClick={() => setCaffeineIdx(i)}>
              <div className="font-semibold text-text text-lg mb-1 flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span className="flex-1">{g.rule}</span>
                <span className="text-xs font-bold px-2 py-1 rounded-lg opacity-60 shrink-0"
                  style={{ color: g.color, background: `rgba(${g.rgb},0.1)` }}>{detailLabel}</span>
              </div>
              <p className="text-muted text-base mb-2 leading-relaxed">{g.reason}</p>
              <div className="flex items-start gap-2 text-base">
                <span style={{ color: g.color }} className="shrink-0">✓</span>
                <span className="font-semibold" style={{ color: g.color }}>{g.good}</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Post-lunch dip */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{tPillars('pillarC.c_circ_s4_title') || 'Vì Sao Buồn Ngủ Sau Ăn Trưa?'}</h2>
        <p className="text-muted text-lg mb-6">{tPillars('pillarC.c_circ_s4_sub') || 'Đây là hiện tượng sinh học bình thường — không phải vì bạn lười.'}</p>
        <div className="grid gap-3">
          {postLunchDip.map((item, i) => (
            <div key={i}
              className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.15)` }}
              onClick={() => setDipIdx(i)}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.icon}</span>
                <div className="font-semibold text-text text-base flex-1">{item.cause}</div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg opacity-60 shrink-0"
                  style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>{detailLabel}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed">{item.solution}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day energy tracking */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{tPillars('pillarC.c_circ_s5_title') || 'Bài Tập: Vẽ Bản Đồ Năng Lượng 7 Ngày'}</h2>
        <p className="text-muted text-lg mb-6">{tPillars('pillarC.c_circ_s5_sub') || 'Theo dõi 7 ngày để biết pattern riêng của bạn.'}</p>
        <div className="p-5 rounded-2xl border" style={{ borderColor: `rgba(${RGB},0.15)`, background: `rgba(${RGB},0.05)` }}>
          <div className="grid grid-cols-3 gap-2 text-sm text-muted mb-3 font-semibold px-3" style={{ color: COLOR }}>
            <span>Thời điểm</span>
            <span>Năng lượng (1–5)</span>
            <span>Ghi chú</span>
          </div>
          <div className="space-y-2">
            {trackerSlots.map((slot, i) => (
              <div key={i}
                className="grid grid-cols-3 gap-2 items-center px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `rgba(${slot.rgb},0.06)`, border: `1px solid rgba(${slot.rgb},0.18)` }}
                onClick={() => setTrackerIdx(i)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{slot.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: slot.color }}>{slot.slot}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="w-3 h-1.5 rounded-full" style={{ background: n <= slot.level ? slot.color : `rgba(${slot.rgb},0.2)` }} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted text-sm">{tPillars('pillarC.c_circ_tracker_note') || 'Ăn gì? Làm gì?'}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg opacity-60"
                    style={{ color: slot.color, background: `rgba(${slot.rgb},0.12)` }}>{detailLabel}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted">
            <p style={{ color: COLOR }} className="font-semibold mb-1">{tPillars('pillarC.c_circ_s5_after') || 'Sau 7 ngày bạn sẽ biết:'}</p>
            <ul className="space-y-1">
              {Array.isArray(s5bullets) ? s5bullets.map((b, i) => <li key={i}>{b}</li>) : (
                <>
                  <li>→ Mình hay mệt lúc nào và vì sao</li>
                  <li>→ Caffeine có ảnh hưởng đến ngủ không</li>
                  <li>→ Bữa ăn nào làm tụt năng lượng</li>
                  <li>→ Ngủ bao nhiêu thì hôm sau tốt nhất</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/sleep-routine" className="text-muted hover:text-cyan-400 transition-colors text-lg">{hero.nav_prev || '← Routine Trước Ngủ'}</Link>
        <Link to="/pillar/c/morning" className="text-lg font-semibold" style={{ color: COLOR }}>{hero.nav_next || 'Routine Sáng →'}</Link>
      </div>

      {/* ── Tracker slots modal ── */}
      {trackerIdx !== null && (
        <EnergyModal
          item={trackerSlots[trackerIdx]}
          idx={trackerIdx}
          onClose={() => setTrackerIdx(null)}
          onPrev={() => setTrackerIdx(i => Math.max(0, i - 1))}
          onNext={() => setTrackerIdx(i => Math.min(TRACKER_SLOTS.length - 1, i + 1))}
          hasPrev={trackerIdx > 0}
          hasNext={trackerIdx < TRACKER_SLOTS.length - 1}
        />
      )}

      {/* ── Post-lunch dip modal ── */}
      {dipIdx !== null && (
        <EnergyModal
          item={postLunchDip[dipIdx]}
          idx={dipIdx}
          onClose={() => setDipIdx(null)}
          onPrev={() => setDipIdx(i => Math.max(0, i - 1))}
          onNext={() => setDipIdx(i => Math.min(POST_LUNCH_DIP.length - 1, i + 1))}
          hasPrev={dipIdx > 0}
          hasNext={dipIdx < POST_LUNCH_DIP.length - 1}
        />
      )}

      {/* ── Caffeine guide modal ── */}
      {caffeineIdx !== null && (
        <EnergyModal
          item={caffeineGuide[caffeineIdx]}
          idx={caffeineIdx}
          onClose={() => setCaffeineIdx(null)}
          onPrev={() => setCaffeineIdx(i => Math.max(0, i - 1))}
          onNext={() => setCaffeineIdx(i => Math.min(CAFFEINE_GUIDE.length - 1, i + 1))}
          hasPrev={caffeineIdx > 0}
          hasNext={caffeineIdx < CAFFEINE_GUIDE.length - 1}
        />
      )}

      {/* ── Light rules modal ── */}
      {lightIdx !== null && (
        <EnergyModal
          item={lightRules[lightIdx]}
          idx={lightIdx}
          onClose={() => setLightIdx(null)}
          onPrev={() => setLightIdx(i => Math.max(0, i - 1))}
          onNext={() => setLightIdx(i => Math.min(LIGHT_RULES.length - 1, i + 1))}
          hasPrev={lightIdx > 0}
          hasNext={lightIdx < LIGHT_RULES.length - 1}
        />
      )}

      {/* ── Energy map modal — outside all RevealBlocks so position:fixed works ── */}
      {energyIdx !== null && (
        <EnergyModal
          item={energyMap[energyIdx]}
          idx={energyIdx}
          onClose={() => setEnergyIdx(null)}
          onPrev={() => setEnergyIdx(i => Math.max(0, i - 1))}
          onNext={() => setEnergyIdx(i => Math.min(ENERGY_MAP.length - 1, i + 1))}
          hasPrev={energyIdx > 0}
          hasNext={energyIdx < ENERGY_MAP.length - 1}
        />
      )}
    </div>
  );
}
