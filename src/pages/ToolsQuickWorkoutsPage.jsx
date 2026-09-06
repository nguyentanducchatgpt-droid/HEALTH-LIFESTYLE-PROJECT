import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#22c55e';
const RGB = '34,197,94';
const ORBIT_ID = 'f-qw-orbit-kf';
const ORBIT_CLASS = 'f-qw-orbit-ring';

const WORKOUTS = [
  {
    dur: '5 phút', label: 'Reset Cơ Thể', color: '#22c55e', rgb: '34,197,94', icon: '🌬️',
    goal: 'Duy trì chuỗi thói quen khi quá bận. Không phải để đốt mỡ.',
    who: 'Mọi cấp độ — đặc biệt hữu ích sau nhiều giờ ngồi máy tính.',
    tip: 'Đặt hẹn 3 lần/ngày khi ngồi nhiều: sáng — trưa — chiều.',
    steps: [
      {
        name: 'Thở cơ hoành', dur: '1 phút', icon: '🫁',
        desc: 'Hít vào 4s, giữ 4s, thở ra 6s. Lặp lại.',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Thở cơ hoành (diaphragmatic breathing) kích hoạt hệ thần kinh phó giao cảm trong vòng 30–60 giây — giảm cortisol, hạ nhịp tim, và chuyển cơ thể từ trạng thái "chiến hay chạy" sang "nghỉ và tiêu hóa".',
        details: [
          'Cơ hoành là cơ thở chính — hình vòm nằm dưới phổi. Khi thở đúng, bụng phình ra (không phải ngực). 80% người thở ngực khi căng thẳng — thở nông, nhanh, làm tăng lo âu theo vòng tròn.',
          'Nhịp 4-4-6 (hít-giữ-thở): tỷ lệ thở ra dài hơn hít vào kích hoạt phó giao cảm mạnh hơn. Thở ra kéo dài → nhịp tim giảm rõ rệt. Đây là cơ sở của mọi kỹ thuật thiền, yoga, và breathwork.',
          'Tác động lên HRV (Heart Rate Variability): thở cơ hoành chậm tăng HRV — chỉ số quan trọng nhất của sức khỏe hệ thần kinh tự chủ. HRV cao = phục hồi tốt, stress thấp, khả năng thích nghi cao.',
          'Kỹ thuật kiểm tra: đặt 1 tay lên ngực, 1 tay lên bụng. Thở đúng khi tay bụng nâng lên còn tay ngực gần như không động. Nếu tay ngực nâng nhiều hơn — đang thở ngực.',
          'Tác dụng tức thì: nghiên cứu Stanford 2023 cho thấy 1 phút thở cơ hoành giảm cortisol đo được trong máu, cải thiện khả năng tập trung trong 20 phút sau, và giảm cảm giác lo lắng đáng kể.',
          'Ứng dụng hàng ngày: dùng trước cuộc họp căng thẳng, trước bữa ăn (cải thiện tiêu hóa), khi bắt đầu công việc mới, hoặc bất cứ lúc nào cảm thấy overwhelmed. 1 phút là đủ để cảm thấy khác biệt.',
        ],
        points: [
          { icon: '🧠', label: 'Giảm Cortisol Tức Thì', note: '30–60 giây đủ để kích hoạt phó giao cảm' },
          { icon: '🤲', label: 'Tay Bụng Phải Nâng', note: 'Tay ngực gần như không động — đó là đúng kỹ thuật' },
          { icon: '📊', label: 'Tăng HRV', note: 'Chỉ số phục hồi quan trọng nhất — thở chậm cải thiện rõ' },
          { icon: '⏱️', label: 'Thở Ra Dài Hơn Hít Vào', note: 'Tỷ lệ 4:6 hoặc 4:4:6 — không phải 1:1' },
        ],
      },
      {
        name: 'Xoay vai mở ngực', dur: '1 phút', icon: '🔄',
        desc: 'Xoay vai ra sau 10 lần, sau đó mở ngực hai bên.',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Ngồi máy tính nhiều giờ gây rút ngắn cơ ngực trước (pectoralis minor) và yếu cơ lưng giữa (rhomboids, mid-traps). Xoay vai và mở ngực counteract cả hai — chỉ cần 1 phút để cảm nhận sự khác biệt ngay.',
        details: [
          'Tư thế ngồi điển hình: vai đổ về trước, lưng cong, đầu đưa ra trước. Mỗi cm đầu đưa ra trước = thêm 4–5kg tải lên cột sống cổ. Sau 8 giờ ngồi, cổ phải chịu tải tương đương 20–25kg liên tục.',
          'Cơ ngực trước (pectoralis minor) co rút → kéo vai và xương bả vai về trước → làm cong lưng. Xoay vai ra sau + mở ngực kéo giãn ngực trước và kích hoạt lại rhomboids (cơ kéo vai về sau).',
          'Kỹ thuật xoay vai: giơ vai lên tai → kéo ra sau → hạ xuống → đưa về trước. Chuyển động tròn chậm và có kiểm soát. Cảm nhận căng ở mặt trước vai (anterior deltoid) khi vai đi về sau.',
          'Mở ngực (chest opener): đứng hoặc ngồi, đan tay sau lưng, nâng ngực lên và đẩy vai ra sau — giữ 5–10 giây. Cảm nhận căng rõ ở giữa ngực và cơ vai trước. Thở sâu trong tư thế này.',
          'Thoracic rotation (xoay lưng ngực): ngồi thẳng, đặt tay sau đầu, xoay thân người sang trái rồi sang phải — chỉ phần lưng trên xoay, không phải hông. Kích hoạt mobility của cột sống ngực thường bị cứng.',
          'Khi nào cần làm: sau mỗi 45–60 phút ngồi liên tục. Không cần đứng dậy — có thể làm ngay trên ghế. Ngay cả 30 giây xoay vai trong lúc họp online cũng giúp giải phóng căng thẳng cơ.',
        ],
        points: [
          { icon: '🔙', label: 'Vai Xoay Ra Sau', note: 'Không xoay về trước — counteract tư thế ngồi' },
          { icon: '💪', label: 'Kích Hoạt Rhomboids', note: 'Cơ lưng giữa bị ức chế khi ngồi — cần kéo vai về sau' },
          { icon: '⚖️', label: 'Mỗi 45–60 Phút', note: 'Không cần đứng dậy — làm ngay trên ghế' },
          { icon: '🌬️', label: 'Thở Khi Mở Ngực', note: 'Hít sâu trong tư thế mở = tăng dung tích phổi' },
        ],
      },
      {
        name: 'Cat-cow hoặc Thoracic twist', dur: '1 phút', icon: '🐱',
        desc: 'Trên sàn hoặc ngồi ghế. 10 lần mỗi bên.',
        img: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Cột sống cần được vận động theo đủ hướng mỗi ngày để duy trì sức khỏe đĩa đệm. Đĩa đệm không có mạch máu riêng — chúng nhận dưỡng chất qua cơ chế khuếch tán khi cột sống vận động. Ngồi bất động = đĩa đệm thiếu dinh dưỡng.',
        details: [
          'Đĩa đệm cột sống hoạt động như miếng bọt biển: khi vận động, đĩa đệm hút dịch khớp chứa dưỡng chất vào; khi bất động, chất dinh dưỡng không thể thấm vào. Đó là lý do đĩa đệm thoái hóa nhanh hơn ở người ngồi nhiều.',
          'Cat-cow (trên sàn): bắt đầu ở tư thế bò (4 điểm tựa). Cat: thở ra, cong lưng lên như mèo, hạ đầu xuống. Cow: hít vào, ưỡn lưng xuống, nâng đầu và xương cụt lên. Mỗi vòng 2–3 giây, 8–10 lần.',
          'Phiên bản ngồi ghế (Seated cat-cow): ngồi thẳng mép ghế, tay đặt lên đầu gối. Cat: cong lưng ra sau, cúi đầu xuống, thở ra. Cow: ưỡn ngực về trước, ngước đầu lên, hít vào. Hiệu quả tương đương khi không thể nằm sàn.',
          'Thoracic rotation (xoay lưng ngực): ngồi thẳng, tay đặt sau đầu, khuỷu tay mở ra ngoài. Xoay toàn bộ thân trên sang một bên, giữ 2–3 giây, về giữa, xoay bên kia. Cột sống ngực (T1-T12) là vùng cứng nhất — cần xoay chủ động mỗi ngày.',
          'Tại sao cột sống ngực hay cứng: 12 đốt sống ngực mỗi đốt kết nối với một xương sườn — cấu trúc này giới hạn tự nhiên biên độ vận động. Kết hợp với ngồi nhiều và ít xoay người = cột sống ngực mất mobility rất nhanh.',
          'Dấu hiệu cột sống ngực cần được chú ý: đau vai, đau cổ, khó thở sâu, cảm giác cứng giữa hai xương bả vai. Tất cả đều liên quan đến mobility kém của cột sống ngực — cat-cow và thoracic rotation giải quyết trực tiếp.',
        ],
        points: [
          { icon: '💧', label: 'Đĩa Đệm Cần Vận Động', note: 'Hút dưỡng chất qua khuếch tán — bất động = thoái hóa' },
          { icon: '🪑', label: 'Làm Được Trên Ghế', note: 'Seated cat-cow hiệu quả tương đương — không cần xuống sàn' },
          { icon: '🔄', label: 'Xoay Ngực Mỗi Ngày', note: 'T1-T12 cứng nhất cơ thể — cần chủ động duy trì' },
          { icon: '😮‍💨', label: 'Thở Theo Chuyển Động', note: 'Hít vào khi ưỡn (cow), thở ra khi cong (cat)' },
        ],
      },
      {
        name: 'Squat ghế nhẹ', dur: '1 phút', icon: '🪑',
        desc: 'Đứng lên ngồi xuống từ ghế, chậm và kiểm soát.',
        img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Ngồi lâu ức chế cơ mông (glute amnesia) — cơ mông "quên" cách co lại đúng cách. Đứng lên ngồi xuống từ ghế là bài tập hoàn hảo nhất để đánh thức lại cơ đùi và mông trong bất kỳ môi trường nào.',
        details: [
          'Glute amnesia (cơ mông "quên"): ngồi nhiều giờ gây ức chế thần kinh cơ mông — cơ vẫn còn đó nhưng tín hiệu thần kinh điều khiển bị giảm sút. Cảm giác khi đứng dậy mà mông không tham gia = cơ lưng và đùi trước bù trừ quá nhiều.',
          'Sit-to-stand vs squat thông thường: dùng ghế loại bỏ phần đi xuống rất sâu (deep squat) vốn khó với người mới hoặc có vấn đề về gối. Đồng thời tạo "target" rõ ràng để kiểm soát tư thế và tốc độ.',
          'Kỹ thuật đúng: ngồi mép ghế, chân rộng bằng vai, bàn chân song song hoặc hơi xoay ra ngoài. Nghiêng người về trước nhẹ (hinge hips), đứng dậy bằng cách ép gót xuống sàn và đẩy hông về trước. Đứng hẳn, siết mông ở đỉnh.',
          'Đi xuống chậm quan trọng hơn đứng lên nhanh: giai đoạn eccentric (đi xuống chậm) tạo nhiều kích thích cơ hơn. Đếm 3 giây khi ngồi xuống, 1 giây khi đứng lên. Không "rơi" vào ghế.',
          'Biến thể: không chạm ghế (squat giữa không khí khi gần tới ghế), thêm giữ ở đỉnh 2 giây để kích hoạt mông tối đa, hoặc đứng trên 1 chân để tăng khó. Mỗi biến thể phù hợp khi đã thành thạo bản gốc.',
          'Lợi ích dài hạn: sit-to-stand test là chỉ số dự đoán tuổi thọ. Người có thể đứng lên từ sàn mà không dùng tay có nguy cơ tử vong thấp hơn 6 lần (nghiên cứu European Journal of Preventive Cardiology). Mỗi lần squat ghế là đầu tư cho tương lai.',
        ],
        points: [
          { icon: '🍑', label: 'Kích Hoạt Cơ Mông', note: 'Siết mông ở đỉnh khi đứng hẳn — đừng bỏ qua bước này' },
          { icon: '⬇️', label: 'Đi Xuống Chậm 3 Giây', note: 'Eccentric quan trọng hơn concentric — đừng rơi vào ghế' },
          { icon: '👣', label: 'Ép Gót Xuống Sàn', note: 'Không đứng bằng mũi chân — gót tạo lực đẩy chính' },
          { icon: '🔬', label: 'Dự Đoán Tuổi Thọ', note: 'Sit-to-stand test liên quan trực tiếp đến tuổi thọ chức năng' },
        ],
      },
      {
        name: 'Child pose / thở chậm', dur: '1 phút', icon: '😌',
        desc: 'Nằm sấp, dạng gối, thở sâu. Giãn cơ lưng dưới.',
        img: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Child pose kết hợp giãn cơ lưng dưới, hông flexors, và vai trong một tư thế duy nhất — đồng thời kích hoạt phó giao cảm qua tư thế cúi người về trước và thở chậm. Đây là "reset" thực sự cho cả cơ thể lẫn hệ thần kinh.',
        details: [
          'Tư thế child pose: quỳ gối, ngồi lên gót chân (hoặc gần gót), duỗi tay về phía trước sàn, trán chạm sàn (hoặc dùng gối/khăn nếu không tới). Dạng rộng: gối dạng ra ngoài thoải mái, bụng rơi giữa hai đùi.',
          'Giãn lưng dưới (erector spinae, quadratus lumborum): đây là nhóm cơ bị co rút nhiều nhất sau khi ngồi lâu và đứng. Child pose kéo giãn toàn bộ mặt sau cột sống theo chiều dọc — cảm giác giải phóng rõ ràng sau 15–20 giây.',
          'Giãn hông flexors (hip flexors): psoas và iliacus co rút khi ngồi — kéo cột sống lưng dưới cong về trước và tăng đau lưng. Child pose kéo giãn hông flexors theo hướng ngược lại khi hông gập hoàn toàn.',
          'Tác động lên hệ thần kinh: tư thế cúi người về trước kết hợp với thở chậm kích hoạt phó giao cảm qua phản xạ baroreceptor (cảm biến áp lực ở ngực và bụng). Hiệu ứng tương tự như meditation — nhưng thụ động hơn.',
          'Thở trong child pose: hít vào, cảm nhận lưng dưới phình ra hai bên (thở vào lưng), thở ra và để cơ thể nặng hơn, chìm xuống sàn. Mỗi lần thở ra = thêm một chút giãn. Không ép — để trọng lực làm việc.',
          'Biến thể nếu gối có vấn đề: child pose nửa người (half child pose) với chỉ 1 chân gập, hoặc supine child pose nằm ngửa kéo gối vào ngực. Hiệu quả tương tự cho lưng dưới mà không tải lên gối.',
        ],
        points: [
          { icon: '🔙', label: 'Giãn Toàn Mặt Sau', note: 'Lưng dưới + hông flexors + vai — một tư thế, ba nhóm cơ' },
          { icon: '🌬️', label: 'Thở Vào Lưng', note: 'Cảm nhận lưng dưới phình ra — không phải bụng hay ngực' },
          { icon: '⚖️', label: 'Để Trọng Lực Làm Việc', note: 'Không ép — mỗi thở ra, cơ thể chìm thêm một chút' },
          { icon: '🧘', label: 'Reset Hệ Thần Kinh', note: 'Tư thế cúi + thở chậm = kích hoạt phó giao cảm thụ động' },
        ],
      },
    ],
  },
  {
    dur: '10 phút', label: 'Toàn Thân Người Mới', color: '#f97316', rgb: '249,115,22', icon: '⚡',
    goal: 'Làm quen chuyển động cơ bản. Phù hợp buổi sáng sớm hoặc giờ nghỉ trưa.',
    who: 'Người mới bắt đầu, tuần đầu tiên, hoặc ngày không muốn tập nặng.',
    tip: 'Khi quen, tăng từ 10 phút lên 15 phút bằng cách thêm 1 vòng nữa.',
    steps: [
      {
        name: 'Khởi động', dur: '2 phút', icon: '🔥',
        desc: 'Đi bộ tại chỗ, xoay vai, squat ghế. Tăng nhịp tim từ từ.',
        img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Khởi động không phải nghi lễ — là yêu cầu sinh lý học. Cơ lạnh có độ đàn hồi thấp hơn, mạch máu chưa mở rộng, và phản xạ thần kinh cơ chậm hơn. Bỏ khởi động tăng nguy cơ chấn thương và giảm chất lượng buổi tập.',
        details: [
          'Nhiệt độ cơ và hiệu suất: cơ hoạt động tối ưu ở 38–39°C (cao hơn nhiệt độ cơ thể nghỉ ngơi ~1–2°C). Khởi động đúng tăng nhiệt độ cơ, tăng tốc độ dẫn truyền thần kinh, và cải thiện sự kết hợp giữa cơ chủ động và cơ đối kháng.',
          'Đi bộ tại chỗ (2 phút): bắt đầu chậm, tăng dần tốc độ. Đưa cao gối nếu có thể (high knee nhẹ). Mục tiêu: nhịp tim từ 60–65 bpm (nghỉ ngơi) lên 80–90 bpm trước khi bắt đầu bài chính.',
          'Xoay vai trong lúc đi bộ: kết hợp khởi động tim mạch với mobility khớp vai. Xoay 10 lần ra sau, 10 lần ra trước, sau đó mở rộng cánh tay ngang và xoay 10 lần. Tiết kiệm thời gian và đa nhiệm.',
          'Squat ghế nhẹ (5–8 lần): dùng ghế làm điểm mốc, đi xuống chậm và kiểm soát. Mục đích là kích hoạt (prime) cơ đùi và mông trước khi tập chính — không phải mệt sức ở bước này.',
          'Tại sao 2 phút là đủ cho người mới: bài tập chính của 10 phút không nặng — không cần khởi động quá dài. 2 phút đủ để tăng nhiệt độ cơ nhẹ, kích hoạt hệ thần kinh, và chuẩn bị tâm lý bước vào tập.',
          'Dấu hiệu đã khởi động đủ: hơi nóng người, bắt đầu đổ mồ hôi nhẹ ở trán hoặc cổ, nhịp thở tăng nhưng vẫn thoải mái. Chưa mệt — chỉ là "sẵn sàng".',
        ],
        points: [
          { icon: '🌡️', label: 'Tăng Nhiệt Độ Cơ', note: 'Cơ tối ưu ở 38–39°C — lạnh hơn = hiệu suất kém' },
          { icon: '💓', label: 'Nhịp Tim 80–90 bpm', note: 'Mục tiêu sau 2 phút — chưa mệt, chỉ sẵn sàng' },
          { icon: '🪑', label: 'Squat Ghế Để Kích Hoạt', note: 'Prime cơ đùi + mông trước khi vào bài chính' },
          { icon: '⚠️', label: 'Không Bỏ Dù Bài Ngắn', note: 'Nguy cơ chấn thương tăng đáng kể khi bỏ khởi động' },
        ],
      },
      {
        name: 'Vòng 1 × 6 phút', dur: '6 phút', icon: '🔄',
        desc: 'Squat 30s → Push-up gối 30s → Glute bridge 30s → Dead bug 30s. Nghỉ 30s rồi lặp lại.',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
        keyFact: '4 động tác này kích hoạt đủ 5 pattern cơ bản (squat, push, hip hinge, core) trong 6 phút. Được thiết kế cho người mới: không cần thiết bị, không cần kỹ thuật phức tạp, nhưng đủ kích thích cơ để tạo thích nghi sau 4–6 tuần.',
        details: [
          'Squat 30 giây: không cần tạ — chỉ trọng lượng cơ thể. Chân rộng bằng vai, ngồi xuống như ngồi ghế sau lưng, gối theo hướng ngón chân, lưng thẳng. 30 giây với tốc độ vừa phải = 8–12 reps — đủ để kích thích cơ đùi và mông.',
          'Push-up gối 30 giây: thân người thẳng từ đầu gối đến vai, hạ thấp ngực gần chạm sàn, đẩy lên hết. KHÔNG cúi hông hoặc để mông nhô lên. Kích hoạt ngực, vai trước, và triceps — tương đương 60–70% hiệu quả push-up thường khi kỹ thuật đúng.',
          'Glute bridge 30 giây: nằm ngửa gối gập 90°, ép lưng dưới vào sàn, đẩy hông lên cao cho đến khi đùi-thân thẳng hàng. GIỮ 2 giây ở đỉnh. Cơ mông bị ức chế khi ngồi nhiều — bài này tái kích hoạt trực tiếp.',
          'Dead bug 30 giây: nằm ngửa, tay và chân nâng lên 90°. Từ từ hạ tay phải + chân trái xuống song song sàn (không chạm), đưa lên, đổi bên. Lưng dưới PHẢI áp sát sàn suốt — nếu cong lên, biên độ quá lớn. Bài tốt nhất cho cơ bụng sâu.',
          'Nghỉ 30 giây giữa 2 vòng: thở sâu, lắc nhẹ tay chân. Đủ để phục hồi nhẹ mà không mất momentum. Nếu quá mệt, tăng lên 45–60 giây — không có quy tắc cứng nhắc nào ở đây.',
          'Tiến bộ sau 4 tuần: push-up gối → push-up thường. Squat → squat giữ dưới 3 giây. Glute bridge → single-leg glute bridge. Dead bug biên độ rộng hơn. Cùng thời gian, tăng cường độ bằng kỹ thuật và biên độ.',
        ],
        points: [
          { icon: '🎯', label: '4 Nhóm Cơ Chính', note: 'Squat + Push + Hip hinge + Core — bao phủ toàn thân' },
          { icon: '🍑', label: 'Glute Bridge Giữ 2s', note: 'Không bật lên bật xuống — giữ đỉnh để kích hoạt mông' },
          { icon: '🔒', label: 'Dead Bug: Lưng Phải Dán Sàn', note: 'Nếu lưng cong lên — biên độ đang quá lớn' },
          { icon: '📈', label: 'Tiến Bộ Sau 4 Tuần', note: 'Tăng kỹ thuật và biên độ — không cần tăng thời gian' },
        ],
      },
      {
        name: 'Giãn cơ + thở', dur: '2 phút', icon: '🧘',
        desc: 'Kéo giãn đùi trước, ngực, hông. Thở sâu để hạ nhịp tim.',
        img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Cooldown sau tập không chỉ giảm đau nhức cơ — nó cũng là thời điểm cơ thể tổng hợp protein tốt nhất và tạo cơ chế thích nghi. Bỏ giãn cơ = bỏ 20–30% lợi ích của buổi tập.',
        details: [
          'Tại sao cần cooldown: khi tập, máu dồn vào các cơ hoạt động. Dừng đột ngột mà không cooldown gây máu "đọng" ở chân (venous pooling) → chóng mặt, buồn nôn. Đi bộ chậm 1 phút trước khi giãn cơ giúp máu tuần hoàn trở về tim từ từ.',
          'Kéo giãn đùi trước (quad stretch): đứng thẳng, gập 1 gối, dùng tay cùng bên giữ bàn chân ra sau, gối hai chân thẳng hàng. Giữ 20–30 giây mỗi bên. Đùi trước co lại nhiều khi squat và leo cầu thang.',
          'Kéo giãn ngực (chest stretch): đứng gần tường hoặc cửa, đặt cẳng tay lên tường ở góc 90°, xoay người ra khỏi tường cho đến khi cảm thấy căng ở ngực. Giữ 20 giây mỗi bên. Counteract push-up vừa làm.',
          'Kéo giãn hông (hip flexor stretch): tư thế lunge thấp, gối sau chạm sàn. Đẩy hông về trước cho đến khi cảm thấy căng ở đùi trong và hông trước của chân sau. Giữ 20–30 giây mỗi bên. Giải phóng psoas sau khi tập và ngồi.',
          'Thở sâu trong giãn cơ: thở sâu giúp cơ thư giãn sâu hơn — mỗi lần thở ra, cơ "bỏ" thêm một chút căng cứng (cơ chế inhibitory stretch reflex). Không nín thở khi kéo giãn — đây là sai lầm phổ biến nhất.',
          'Static vs Dynamic stretch: sau tập là thời điểm tốt nhất cho static stretch (giữ yên) — cơ đã nóng và đàn hồi cao. Trước tập nên dùng dynamic stretch (chuyển động). Không kéo giãn đến đau — chỉ cảm giác căng thoải mái.',
        ],
        points: [
          { icon: '💉', label: 'Venous Pooling', note: 'Dừng đột ngột → máu đọng ở chân → chóng mặt' },
          { icon: '😮‍💨', label: 'Thở Ra Để Giãn Sâu', note: 'Mỗi thở ra = cơ thư giãn thêm — không nín thở' },
          { icon: '⏱️', label: '20–30 Giây Mỗi Tư Thế', note: 'Dưới 15 giây không đủ để cơ thực sự giãn' },
          { icon: '📊', label: 'Giữ 20–30% Lợi Ích', note: 'Bỏ cooldown = mất một phần lớn thành quả buổi tập' },
        ],
      },
    ],
  },
  {
    dur: '20 phút', label: 'Full Body Chuẩn', color: '#ef4444', rgb: '239,68,68', icon: '🔥',
    goal: 'Tạo hiệu quả rõ ràng nếu duy trì 3–4 lần/tuần. Đủ kích thích cơ bắp toàn thân.',
    who: 'Người đã quen vận động, muốn kết quả thực sự mà không cần phòng gym.',
    tip: 'Tăng tiến bằng cách thêm cân hoặc tăng số reps, không phải tăng thời gian.',
    steps: [
      {
        name: 'Khởi động', dur: '4 phút', icon: '🌡️',
        desc: 'Đi bộ nhanh tại chỗ, jumping jack, xoay hông, squat nhẹ.',
        img: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Khởi động 4 phút cho bài 20 phút là tỷ lệ 1:5 — chuẩn khoa học thể thao. Mục tiêu không chỉ là tăng nhiệt độ cơ mà còn kích hoạt đúng các nhóm cơ sẽ làm việc chính, tăng bôi trơn khớp, và chuẩn bị tâm lý.',
        details: [
          'World\'s greatest stretch (WGS): bắt đầu từ tư thế lunge, đặt tay cùng bên với chân trước xuống sàn, xoay thân người và nâng tay kia lên trần nhà. Giữ 2 giây. Đây là bài khởi động duy nhất kích hoạt đồng thời hông, ngực, vai, cột sống ngực, và cơ lõi.',
          'Inchworm: đứng thẳng, cúi người xuống đặt tay sàn, bước tay ra trước đến tư thế plank, bước ngược lại về, đứng lên. 5–6 reps. Kéo giãn hamstring, kích hoạt vai và core, và tăng nhiệt độ cơ toàn thân trong một chuyển động.',
          'Jumping jack 1 phút: tăng nhịp tim nhanh chóng (có thể lên 100–110 bpm trong 60 giây). Là cardio warm-up hiệu quả nhất trong môi trường hạn chế không gian. Biến thể ít tác động: step jack (không nhảy, bước sang 2 bên).',
          'Squat nhẹ có pause: 5–8 lần, đi xuống chậm 3 giây, dừng 1 giây ở dưới, đứng lên nhanh. Mục đích là kích hoạt (activate) cơ đùi và mông ở range of motion đầy đủ trước khi tập chính.',
          'Xoay hông (hip circles): đứng chân rộng, tay trên hông, xoay vòng tròn chậm 10 lần mỗi chiều. Tăng tưới máu khớp háng và kích hoạt cơ hông xoay (hip rotators) — nhóm cơ thường bị bỏ qua trong khởi động.',
          'Dấu hiệu khởi động thành công: mồ hôi nhẹ ở trán và cổ, nhịp tim 90–100 bpm, cảm giác cơ thể nhẹ nhàng và linh hoạt hơn, khớp không cứng. Nếu chưa đạt — thêm 30–60 giây jumping jack trước khi vào bài.',
        ],
        points: [
          { icon: '🌍', label: 'World\'s Greatest Stretch', note: '1 động tác, 6 nhóm cơ — không thể thiếu cho bài 20 phút' },
          { icon: '🐛', label: 'Inchworm 5–6 Reps', note: 'Kéo giãn hamstring + kích hoạt shoulder + core' },
          { icon: '💓', label: 'Mục Tiêu 90–100 bpm', note: 'Nhịp tim sau khởi động — mồ hôi nhẹ là tốt' },
          { icon: '🔄', label: 'Xoay Hông 10 Vòng', note: 'Hip rotators bị bỏ qua nhiều nhất — quan trọng cho squat và lunge' },
        ],
      },
      {
        name: '3 vòng × 12 phút', dur: '12 phút', icon: '💪',
        desc: 'Squat/Sit-to-stand → Push-up → Band row hoặc Dumbbell row → Glute bridge → Plank 30s hoặc Dead bug. Nghỉ 60s giữa vòng.',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Bài 5 động tác này bao phủ tất cả 5 pattern vận động cơ bản của cơ thể người: squat (đứng/ngồi), push (đẩy), pull (kéo), hip hinge (bản lề hông), và core anti-extension. 3 vòng tạo đủ volume để kích thích tổng hợp protein cơ trong 24–48 giờ sau.',
        details: [
          'Squat/Sit-to-stand 40 giây: nếu có dây kháng lực (resistance band) quấn quanh đùi — tăng kích hoạt cơ mông thêm 30%. Tốc độ đề xuất: xuống 2 giây, lên 1 giây. Đếm 10–14 reps trong 40 giây.',
          'Push-up 40 giây: tùy trình độ — gối (người mới), thường (trung bình), decline với chân lên ghế (nâng cao). Đặt tay rộng hơn vai một chút, cánh tay thẳng ở đỉnh nhưng không khóa khuỷu. Ngực hạ xuống gần chạm sàn mỗi rep.',
          'Band row hoặc Dumbbell row 40 giây: kéo về phía mình, khuỷu tay sát thân, siết cơ lưng ở cuối hành trình, hạ về từ từ 2 giây. Đây là động tác kéo (pull) duy nhất trong bài — cực kỳ quan trọng vì hầu hết mọi người yếu ở nhóm cơ lưng giữa.',
          'Glute bridge 40 giây: phiên bản nâng cao — đặt chân lên ghế (elevated glute bridge) để tăng biên độ và kích hoạt hamstring. Hoặc single-leg glute bridge nếu muốn tăng khó. Siết mông mỗi rep.',
          'Plank 30 giây hoặc Dead bug 40 giây: vòng 1 = Plank; vòng 2 = Dead bug; vòng 3 = tùy chọn. Thay đổi để tránh bão hòa thần kinh cơ. Plank: không thở nín, không nhô mông. Dead bug: biên độ rộng hơn so với bài 10 phút.',
          'Nghỉ 60 giây giữa vòng: không nhiều hơn — metabolic stress (cortisol, lactic acid) tích lũy giữa các vòng là một phần của stimulus kích thích thích nghi. Dùng 60 giây để thở sâu và chuẩn bị tâm lý cho vòng tiếp theo.',
        ],
        points: [
          { icon: '5️⃣', label: '5 Pattern Vận Động', note: 'Squat + Push + Pull + Hinge + Core — đủ bộ' },
          { icon: '🔁', label: 'Pull = Quan Trọng Nhất', note: 'Band row thường bị bỏ — cơ lưng là yếu điểm phổ biến' },
          { icon: '⏱️', label: 'Nghỉ Đúng 60 Giây', note: 'Không nghỉ lâu hơn — metabolic stress là một phần lợi ích' },
          { icon: '🔄', label: 'Thay Đổi Giữa Vòng', note: 'Plank vòng 1, Dead bug vòng 2 — tránh bão hòa thần kinh' },
        ],
      },
      {
        name: 'Cooldown giãn cơ', dur: '4 phút', icon: '🧘',
        desc: 'Kéo giãn đùi trước, ngực, vai, hông, lưng dưới. Thở sâu.',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Cooldown 4 phút sau bài 20 phút là thời điểm vàng cho giãn cơ: cơ đang ở nhiệt độ cao nhất, tuần hoàn máu tốt, và cortisol bắt đầu giảm. Giãn cơ đúng lúc này tăng flexibility nhanh hơn 40% so với giãn cơ lúc cơ lạnh.',
        details: [
          'Thứ tự giãn cơ tối ưu: bắt đầu từ cơ lớn nhất và đã làm việc nhiều nhất (đùi, mông), sau đó lên ngực, vai, và kết thúc bằng lưng dưới. Cơ thể "hạ nhiệt" từ trung tâm ra ngoại vi.',
          'Pigeon pose (giãn hông sâu): từ tư thế plank, đưa chân trái về trước đặt nằm ngang (gối trái ở tay trái, gót trái ở tay phải), hạ người xuống. Đây là tư thế giãn hip flexor và piriformis sâu nhất — quan trọng sau squat và glute bridge.',
          'Kéo giãn đùi trước: nằm nghiêng, gập gối và kéo bàn chân về phía mông. Hoặc đứng (cần thăng bằng). 30 giây mỗi bên. Cảm nhận căng dọc theo mặt trước đùi từ gối đến hông.',
          'Doorway chest stretch: đặt hai cánh tay lên khung cửa ở góc 90°, bước về phía trước cho đến khi cảm thấy căng ở ngực và vai trước. Giữ 30 giây. Counteract tư thế đổ vai về trước sau push-up nhiều hiệp.',
          'Supine spinal twist: nằm ngửa, gập gối và đổ sang 1 bên, giữ vai áp sàn, ngoảnh đầu sang hướng ngược lại. 30 giây mỗi bên. Giải phóng căng cứng cột sống thắt lưng và hông — tuyệt vời sau 3 vòng squat và glute bridge.',
          'Thở 4-7-8 để kết thúc: hít vào 4 giây, giữ 7 giây, thở ra 8 giây. Làm 3 lần. Kỹ thuật này giảm cortisol nhanh nhất có thể — để cơ thể chuyển sang trạng thái phục hồi (anabolic window) ngay sau tập.',
        ],
        points: [
          { icon: '🕊️', label: 'Pigeon Pose Là Bắt Buộc', note: 'Giãn sâu nhất cho hông sau bài squat nặng' },
          { icon: '🌡️', label: 'Cơ Đang Nóng = Tốt Nhất', note: 'Flexibility tăng 40% khi giãn sau tập so với trước tập' },
          { icon: '🌀', label: 'Supine Spinal Twist', note: 'Giải phóng lưng dưới sau 3 vòng — không bỏ được' },
          { icon: '4️⃣', label: 'Thở 4-7-8 Để Kết Thúc', note: 'Giảm cortisol, kích hoạt anabolic recovery window' },
        ],
      },
    ],
  },
  {
    dur: '30 phút', label: 'Cardio Endurance', color: '#6366f1', rgb: '99,102,241', icon: '🏃',
    goal: 'Tăng sức bền tim mạch và đốt calo hiệu quả. Thay thế hoàn toàn cho chạy bộ.',
    who: 'Người muốn cardio mà không cần ra ngoài. Tốt cho ngày phục hồi giữa hai buổi tập nặng.',
    tip: 'Cường độ đúng: bạn có thể nói được câu ngắn nhưng không thể hát.',
    steps: [
      {
        name: 'Khởi động nhẹ', dur: '5 phút', icon: '🌅',
        desc: 'Đi bộ tại chỗ, xoay khớp, high knee nhẹ.',
        img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Khởi động cardio khác khởi động sức mạnh: không cần kích hoạt nhóm cơ cụ thể mà cần tăng nhịp tim dần dần để tim không bị shock. Nhịp tim tăng đột ngột từ 60 lên 130+ bpm mà không khởi động gây áp lực lớn lên tim.',
        details: [
          'Nguyên tắc "gradual onset": tim cần thời gian để tăng cung lượng (cardiac output), mở rộng mạch máu ngoại vi, và điều phối lại phân bổ máu từ các cơ quan nội tạng sang cơ xương. Tăng nhịp tim quá nhanh = tim hoạt động không hiệu quả trong 3–5 phút đầu.',
          'Đi bộ tại chỗ tốc độ tăng dần (2 phút): bắt đầu chậm, dần dần nâng cao gối (từ march → low high knee). Giữ tay đung đưa tự nhiên để tăng cường độ nhẹ. Nhịp tim mục tiêu sau 2 phút: 80–85 bpm.',
          'Xoay khớp (1 phút): xoay cổ chân, xoay gối (cẩn thận — xoay nhẹ nhàng), xoay hông, xoay vai. Bôi trơn tất cả các khớp sẽ chịu tải trong 20 phút cardio circuit. Đặc biệt quan trọng cho người có vấn đề khớp.',
          'High knee nhẹ (2 phút): nâng gối lên ngang hông, chạm đầu gối vào lòng bàn tay. Bắt đầu chậm (1 giây mỗi bước), tăng dần lên nhịp nhanh hơn trong 30 giây cuối. Nhịp tim mục tiêu sau 5 phút: 95–105 bpm.',
          'Hydration trước: uống 200–300ml nước trước khi bắt đầu. Cardio 30 phút mất 400–600ml mồ hôi tùy cường độ và nhiệt độ phòng. Không cần uống trong lúc tập nếu dưới 45 phút — nhưng bù nước ngay sau.',
          'Không cần stretching trước cardio: dynamic warm-up (chuyển động) tốt hơn static stretching (giữ yên) trước cardio. Static stretch trước tập có thể giảm hiệu suất và tăng nguy cơ chấn thương nhẹ — để static stretch cho cooldown.',
        ],
        points: [
          { icon: '💓', label: 'Tăng Nhịp Tim Dần', note: 'Tim cần thời gian điều phối máu — không shock đột ngột' },
          { icon: '🫙', label: 'Uống Nước Trước', note: '200–300ml trước tập — cardio mất nhiều mồ hôi' },
          { icon: '🦵', label: 'Xoay Khớp Cổ Chân', note: 'Cardio tải nặng lên cổ chân — bôi trơn trước để tránh căng' },
          { icon: '🚫', label: 'Không Static Stretch', note: 'Để static stretch cho sau tập — động tác trước tập tốt hơn' },
        ],
      },
      {
        name: 'Circuit cardio × 20 phút', dur: '20 phút', icon: '⚡',
        desc: 'Jumping jack 45s → March tại chỗ 15s. Step touch 45s → nghỉ 15s. Shadow boxing 45s → nghỉ 15s. Đi bộ fast pace 45s → nghỉ 15s. Lặp lại 3–4 vòng.',
        img: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Cardio circuit không cần chạy bộ nhưng đạt được 75–85% nhịp tim tối đa — ngưỡng "aerobic zone" đốt mỡ và tăng sức bền tim mạch hiệu quả nhất. Lợi thế: không tải trọng lớn lên khớp gối và cổ chân như chạy.',
        details: [
          'Zone 2 cardio (60–70% HRmax): nhịp tim mục tiêu khi tập. Công thức đơn giản: 220 - tuổi = HRmax. Zone 2 = 60–70% HRmax. Ví dụ: 35 tuổi → HRmax = 185 → Zone 2 = 111–130 bpm. Đây là zone đốt mỡ hiệu quả nhất và xây dựng aerobic base bền vững.',
          'Jumping jack 45 giây: toàn thân, nhịp tim tăng nhanh. Biến thể ít tác động: Step jack (bước sang 2 bên thay vì nhảy). Nếu cảm thấy dễ quá — thêm vỗ tay trên đầu mạnh hoặc tăng tốc độ. Nếu quá khó — step jack và thở đều.',
          'Step touch 45 giây: bước sang phải, chụm chân, bước sang trái, chụm chân. Tay đung đưa hoặc đẩy lên trên. Cường độ thấp hơn jumping jack — thời điểm "active recovery" trong circuit. Nhịp tim vẫn duy trì 90–100 bpm.',
          'Shadow boxing 45 giây: punch thẳng (jab, cross), punch móc (hook). Đứng tấn (chân trái trước), di chuyển trọng tâm. Kích hoạt cơ vai, core, và cẳng tay. Cảm giác vui và mạnh mẽ nhất trong circuit — tốt cho mental health.',
          'Fast pace walk 45 giây: đi bộ nhanh nhất có thể tại chỗ, nâng cao gối, đung đưa tay mạnh. Cardio zone 2 thuần túy — ít tác động nhất trong 4 động tác. Dùng làm "cooldown giữa circuit" trước khi bắt đầu vòng mới.',
          'Nghỉ 15 giây: đủ để bắt đầu động tác tiếp theo nhưng không đủ để nhịp tim giảm về baseline. Đây là HIIT-lite (High Intensity Interval Training với cường độ vừa phải) — hiệu quả hơn cardio đều đặn 20 phút trong cùng thời gian.',
        ],
        points: [
          { icon: '💓', label: 'Zone 2: 60–70% HRmax', note: '220 - tuổi = HRmax. Zone 2 = nói được nhưng khó thở' },
          { icon: '🥊', label: 'Shadow Boxing = Vui Nhất', note: 'Cơ vai + core + mental health — không bỏ động tác này' },
          { icon: '⏸️', label: 'Nghỉ 15s Giữ Nhịp Tim', note: 'Không đủ để về baseline — đó là điểm then chốt của HIIT' },
          { icon: '🦴', label: 'Low Impact Hơn Chạy', note: 'Không chấn động khớp gối — tốt cho người mới hoặc thừa cân' },
        ],
      },
      {
        name: 'Cooldown đi bộ chậm', dur: '5 phút', icon: '🌙',
        desc: 'Đi bộ thật chậm tại chỗ. Thở sâu đều. Kéo giãn nhẹ.',
        img: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Sau 20 phút cardio, nhịp tim có thể đang ở 130–150 bpm. Dừng đột ngột gây máu đọng ở chân (venous pooling) và đôi khi ngất xỉu. 5 phút đi bộ chậm hạ nhịp tim an toàn về dưới 100 bpm trước khi giãn cơ tĩnh.',
        details: [
          'Venous pooling nguy hiểm: trong khi tập cardio, tim đập nhanh để đẩy máu về. Cơ chân hoạt động như "tim phụ" bơm máu ngược về tim. Dừng đột ngột: tim vẫn đang ở nhịp cao nhưng cơ chân ngừng bơm → máu đọng ở chân → áp huyết não giảm → chóng mặt, ngất.',
          'Đi bộ chậm 2–3 phút: duy trì tác động bơm của cơ chân trong khi nhịp tim giảm dần. Tốc độ: chậm hơn nhiều so với warm-up. Cảm giác đang "hạ xuống" rõ ràng. Nhịp tim mục tiêu: về dưới 100 bpm.',
          'Thở sâu trong khi đi: 4 bước hít vào, 4 bước thở ra. Thở sâu tăng hồi lưu tĩnh mạch (cơ chế "bơm hô hấp") và tăng tốc độ hạ nhịp tim. Đây là kỹ thuật được vận động viên chuyên nghiệp dùng sau race.',
          'Giãn cơ tĩnh sau khi nhịp tim về <100 bpm: bắt đầu với cơ lớn nhất đã làm việc (đùi và mông), sau đó bắp chân, hông flexors, lưng dưới. Mỗi tư thế 20–30 giây. Không vội vàng — đây là khoảng thời gian "lắng đọng" của buổi tập.',
          'Hydration sau tập: uống 400–600ml nước trong 30 phút sau cardio 30 phút. Nếu đổ mồ hôi nhiều hoặc trời nóng: thêm điện giải (electrolytes). Không uống quá nhanh — 150–200ml mỗi 10 phút để hấp thu tốt hơn.',
          'Cửa sổ phục hồi: 30–60 phút sau tập là thời điểm tốt nhất để bổ sung carbohydrate và protein (nếu có mục tiêu tăng cơ hoặc phục hồi nhanh). Với mục tiêu giảm mỡ: bữa ăn bình thường trong vòng 1–2 giờ là đủ.',
        ],
        points: [
          { icon: '⚠️', label: 'Không Dừng Đột Ngột', note: 'Venous pooling → chóng mặt, ngất — đặc biệt khi trời nóng' },
          { icon: '🫁', label: 'Thở 4-4 Theo Bước Chân', note: '4 bước hít vào, 4 bước thở ra — tăng tốc hồi phục nhịp tim' },
          { icon: '💧', label: '400–600ml Nước Sau', note: 'Bù nước trong 30 phút — không uống một lúc quá nhiều' },
          { icon: '🕐', label: 'Cửa Sổ Phục Hồi 30–60 Phút', note: 'Thời điểm tốt nhất bổ sung dinh dưỡng sau cardio' },
        ],
      },
    ],
  },
];

const SITUATIONS = [
  {
    situation: 'Đang rất bận, có 5 phút', recommend: 'Bài 5 phút Reset',
    icon: '⏰', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút không phải là ít — đủ để duy trì habit chain và ngăn não bộ "xóa" thói quen vận động. Nghiên cứu về habit formation cho thấy tính liên tục (streak) quan trọng hơn thời lượng: 5 phút mỗi ngày hiệu quả hơn 35 phút một lần mỗi tuần.',
    details: [
      'Habit loop (vòng lặp thói quen): mỗi ngày không tập là một lần não bộ "ghi đè" lên thói quen cũ. 5 phút đủ để giữ cue → routine → reward loop hoạt động — ngay cả khi không tạo ra thay đổi thể chất đáng kể.',
      'Ngưỡng "không tập hôm nay": bỏ 1 ngày không sao, bỏ 2 ngày liên tiếp bắt đầu nguy hiểm, bỏ 3 ngày trở lên = phải xây lại từ đầu về mặt tâm lý. 5 phút duy trì chuỗi — đó là tất cả mục tiêu.',
      'Reset sinh lý học: 5 phút vận động nhẹ (thở cơ hoành + xoay vai + squat nhẹ) giảm cortisol đáng kể, tăng BDNF (yếu tố tăng trưởng thần kinh), và cải thiện tâm trạng qua endorphin tức thì.',
      'Khi nào dùng bài 5 phút: deadline dồn dập, đang đi công tác, trẻ bệnh, mệt mỏi thực sự — bất kỳ tình huống nào mà 10+ phút là không thực tế. Không có lý do nào đủ để bỏ hoàn toàn khi bài 5 phút tồn tại.',
      'Hiệu ứng "just start": tâm lý học cho thấy 80% người tiếp tục tập lâu hơn sau khi bắt đầu — ngay cả khi ban đầu chỉ định làm 5 phút. Sức ỳ (inertia) là vấn đề lớn nhất, không phải thời gian.',
      'Lên lịch cứng: đặt alarm cho 5 phút vào cùng giờ mỗi ngày (sáng sớm sau đánh răng, hoặc giờ ăn trưa). Gắn với anchor habit đã có sẵn để giảm ma sát quyết định.',
    ],
    points: [
      { icon: '🔗', label: 'Duy Trì Habit Chain', note: 'Streak quan trọng hơn thời lượng — đừng phá chuỗi' },
      { icon: '🧠', label: 'Just Start Effect', note: '80% người tiếp tục dài hơn sau khi bắt đầu 5 phút' },
      { icon: '⚗️', label: 'Giảm Cortisol Tức Thì', note: 'BDNF + endorphin tăng — đủ để cải thiện tâm trạng' },
      { icon: '⚓', label: 'Gắn Với Anchor Habit', note: 'Sau đánh răng, sau ăn trưa — giảm ma sát quyết định' },
    ],
  },
  {
    situation: 'Mới bắt đầu, còn ngại', recommend: 'Bài 10 phút Người Mới',
    icon: '🌱', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cảm giác ngại và e dè khi mới bắt đầu là phản ứng bình thường của não bộ trước thứ gì đó chưa quen. Bài 10 phút được thiết kế để vượt qua rào cản này: đủ ngắn để không đáng sợ, đủ cấu trúc để không bỡ ngỡ, đủ toàn diện để cảm thấy đã làm gì đó.',
    details: [
      'Novice advantage (lợi thế người mới): người chưa tập bao giờ có thể thấy cải thiện rõ rệt chỉ sau 2–3 tuần — nhanh hơn nhiều so với người đã tập lâu. Cơ thể thích nghi rất mạnh khi gặp kích thích mới lần đầu.',
      'Tại sao 10 phút phù hợp: đủ ngắn để vượt qua lực cản tâm lý ("chỉ 10 phút thôi"), nhưng đủ để kích hoạt tất cả nhóm cơ chính. Không cần chuẩn bị gì — không cần quần áo tập đặc biệt, không cần thiết bị, không cần không gian lớn.',
      'Kiến thức thay cho kỹ thuật: bài 10 phút dùng 4 động tác mà cơ thể đã quen (ngồi xuống, đẩy lên, nằm ngửa nâng hông, nằm ngửa giữ thăng bằng). Không cần học kỹ thuật phức tạp trước khi bắt đầu — học trong khi làm.',
      'Sai lầm phổ biến của người mới: chọn bài quá khó ngay từ đầu → thất bại → bỏ cuộc. Bài 10 phút thiết kế để thành công ngay từ lần đầu — quan trọng để não bộ ghi nhận "ta làm được".',
      'Tiến bộ trong 4 tuần đầu: tuần 1–2 quen với chuyển động và không còn đau nhức ngày hôm sau. Tuần 3–4 bắt đầu cảm thấy dễ hơn, muốn thêm nhiều hơn. Đây là dấu hiệu chuyển sang bài 20 phút.',
      'Môi trường tập: chọn chỗ riêng tư nếu vẫn ngại — phòng ngủ, sân thượng, hoặc bất cứ đâu bạn thoải mái. Không cần gym, không cần người hướng dẫn, không cần gương. Chỉ cần một tấm thảm và 10 phút.',
    ],
    points: [
      { icon: '🚀', label: 'Novice Advantage', note: 'Người mới cải thiện nhanh nhất — 2–3 tuần thấy rõ' },
      { icon: '✅', label: 'Thiết Kế Để Thành Công', note: 'Đủ dễ để hoàn thành lần đầu — xây confidence' },
      { icon: '📅', label: 'Tuần 3–4 Chuyển Cấp', note: 'Cảm thấy quá dễ = dấu hiệu chuyển sang bài 20 phút' },
      { icon: '🏠', label: 'Không Cần Gym', note: 'Phòng ngủ + tấm thảm + 10 phút — đủ để bắt đầu' },
    ],
  },
  {
    situation: 'Muốn kết quả thực sự', recommend: 'Bài 20 phút Full Body',
    icon: '💪', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '20 phút × 3–4 lần/tuần vượt ngưỡng tối thiểu để tạo thích nghi cơ học thực sự: tổng hợp protein cơ tăng trong 24–48h sau tập, trao đổi chất tăng (EPOC), và cải thiện nhạy cảm insulin. Đây là ngưỡng "đủ để thay đổi cơ thể".',
    details: [
      'EPOC (Excess Post-exercise Oxygen Consumption): sau bài 20 phút cường độ vừa-cao, cơ thể tiếp tục đốt thêm 100–200 kcal trong 12–24 giờ tiếp theo để phục hồi. Hiệu ứng này không xảy ra với bài 5–10 phút cường độ thấp.',
      'Muscle protein synthesis (MPS): 3 vòng circuit tạo đủ mechanical tension và metabolic stress để kích hoạt mTOR pathway — tín hiệu chính cho tổng hợp protein cơ. MPS đỉnh cao nhất 2–4 giờ sau tập và kéo dài 24–48 giờ.',
      'Ngưỡng 3–4 lần/tuần: dưới 3 lần, cơ thể không có đủ kích thích để duy trì thích nghi. Trên 5 lần cùng nhóm cơ mà không có ngày nghỉ = overtraining. 3–4 lần với 48h nghỉ giữa các buổi là tối ưu.',
      'Tiến bộ thấy rõ sau 6–8 tuần: tuần 1–4 thích nghi thần kinh (cơ mạnh hơn nhưng chưa to hơn), tuần 5–8 bắt đầu hypertrophy (cơ to hơn thực sự). Đừng bỏ cuộc trước tuần 6.',
      'Dinh dưỡng quyết định 70%: 20 phút tập mà ăn uống không hỗ trợ = kết quả hạn chế. Protein 1.6–2g/kg/ngày là yêu cầu tối thiểu để cơ phục hồi và phát triển. Không cần thực phẩm bổ sung — chỉ cần đủ protein từ thức ăn.',
      'Tracking tiến bộ: đo sức mạnh (số reps mỗi động tác), đo vóc dáng (vòng eo, vòng cánh tay), và chụp ảnh mỗi 4 tuần. Cân nặng là chỉ số kém nhất — có thể không đổi hoặc tăng trong khi cơ thể thực sự đang thay đổi.',
    ],
    points: [
      { icon: '🔥', label: 'EPOC 12–24 Giờ', note: 'Đốt thêm 100–200 kcal sau tập — hiệu ứng kéo dài' },
      { icon: '🗓️', label: '3–4 Lần/Tuần Là Tối Ưu', note: 'Ít hơn = không đủ kích thích. Nhiều hơn = overtraining' },
      { icon: '🥩', label: 'Protein 1.6–2g/kg', note: '70% kết quả đến từ dinh dưỡng — không thể bỏ qua' },
      { icon: '📸', label: 'Ảnh 4 Tuần / Lần', note: 'Đừng dùng cân làm thước đo duy nhất — ảnh chính xác hơn' },
    ],
  },
  {
    situation: 'Ngày không tập nặng', recommend: 'Bài 30 phút Cardio',
    icon: '🚶', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active recovery (phục hồi chủ động) hiệu quả hơn passive recovery (nghỉ hoàn toàn) cho hầu hết mọi người. Cardio nhẹ ngày nghỉ tăng tuần hoàn máu đến cơ đang phục hồi, giảm DOMS (đau nhức cơ), và duy trì aerobic base.',
    details: [
      'DOMS (Delayed Onset Muscle Soreness): đau nhức cơ xuất hiện 24–72 giờ sau tập nặng — do vi tổn thương cơ và phản ứng viêm nhẹ. Đây là dấu hiệu cơ đang phục hồi và thích nghi, không phải chấn thương. Cardio nhẹ tăng lưu lượng máu đến vùng bị DOMS, giúp dọn dẹp chất thải trao đổi chất nhanh hơn.',
      'Zone 2 cardio ngày phục hồi: 55–65% HRmax (cảm giác thoải mái, có thể nói chuyện dễ dàng). Đủ để tăng tuần hoàn mà không tạo thêm stress cho cơ đang phục hồi. Bài 30 phút Cardio được thiết kế ở cường độ này.',
      'Aerobic base building: tim mạch cần được tập luyện riêng biệt với sức mạnh. Người tập sức mạnh 3–4 lần/tuần mà không làm cardio thường có VO2max thấp — giới hạn khả năng tổng thể và tốc độ phục hồi.',
      'Tâm lý ngày nghỉ: nhiều người cảm thấy tội lỗi hoặc không yên khi nghỉ hoàn toàn. Bài 30 phút cardio nhẹ giải quyết tâm lý này mà không gây hại cho phục hồi — win-win.',
      'Phân bổ tuần lý tưởng: Thứ 2, 4, 6: Full Body 20 phút (hoặc chia theo nhóm cơ). Thứ 3, 5: Cardio 30 phút. Thứ 7: tuỳ chọn — cardio nhẹ hoặc nghỉ. Chủ nhật: nghỉ hoàn toàn. Tổng: 5 buổi/tuần, không buổi nào quá 30 phút.',
      'Low-impact là ưu điểm: bài 30 phút không nhảy mạnh hoặc chạy — tốt cho người thừa cân, có vấn đề khớp gối/cổ chân, hoặc đang phục hồi sau chấn thương nhẹ. Cardio trong nhà loại bỏ rào cản thời tiết.',
    ],
    points: [
      { icon: '🔄', label: 'Active > Passive Recovery', note: 'Cardio nhẹ giúp cơ hồi phục nhanh hơn nghỉ hoàn toàn' },
      { icon: '💓', label: 'Zone 2: 55–65% HRmax', note: 'Thoải mái, có thể nói chuyện — không thở hổn hển' },
      { icon: '🗓️', label: 'Thứ 3 & 5 Trong Tuần', note: 'Giữa 2 ngày tập nặng — phân bổ lý tưởng' },
      { icon: '🦴', label: 'Low Impact Trong Nhà', note: 'Không tải khớp — tốt cho người đang phục hồi chấn thương' },
    ],
  },
];

function SituationModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const s = SITUATIONS[idx];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${s.rgb},0.28)`, boxShadow: `0 0 80px rgba(${s.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={s.img} alt={s.situation} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${s.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${s.rgb},0.18)`, border: `2px solid rgba(${s.rgb},0.45)` }}>{s.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${s.rgb},0.6)` }}>Tình huống</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: s.color }}>{s.icon} {s.situation}</h2>
          <p className="text-base font-semibold mb-5" style={{ color: `rgba(${s.rgb},0.8)` }}>→ {s.recommend}</p>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: s.color, background: `rgba(${s.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{s.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {s.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${s.rgb},0.14)`, color: s.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {s.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${s.rgb},0.06)`, border: `1px solid rgba(${s.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? s.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${s.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${s.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {SITUATIONS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? s.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${s.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${s.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StepModal({ wi, si, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const wo = WORKOUTS[wi];
  const step = wo.steps[si];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${wo.rgb},0.28)`, boxShadow: `0 0 80px rgba(${wo.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={step.img} alt={step.name} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${wo.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${wo.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${wo.rgb},0.18)`, border: `2px solid rgba(${wo.rgb},0.45)` }}>{step.icon}</div>
          <div className="absolute bottom-5 left-24">
            <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ color: wo.color, background: `rgba(${wo.rgb},0.2)` }}>{step.dur}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${wo.rgb},0.6)` }}>{wo.dur} — {wo.label}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: wo.color }}>{step.icon} {step.name}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: wo.color, background: `rgba(${wo.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{step.keyFact}</p>
          </div>
          <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: `rgba(${wo.rgb},0.08)`, border: `1px solid rgba(${wo.rgb},0.18)` }}>
            <strong style={{ color: wo.color }}>Cách thực hiện: </strong>
            <span style={{ color: 'rgba(209,213,219,0.85)' }}>{step.desc}</span>
          </div>
          <ul className="space-y-3 mb-8">
            {step.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${wo.rgb},0.14)`, color: wo.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {step.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${wo.rgb},0.06)`, border: `1px solid rgba(${wo.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? wo.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${wo.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${wo.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{si + 1} / {wo.steps.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? wo.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${wo.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${wo.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

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

export default function ToolsQuickWorkoutsPage() {
  const { t: tT } = useTranslation('tools');
  const [open, setOpen] = useState(0);
  const [stepModal, setStepModal] = useState(null); // { wi, si }
  const [sitModal, setSitModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-qw-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fQwOrbitSpin { to { --f-qw-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-qw-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fQwOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>⚡</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('quick_workouts.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('quick_workouts.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('quick_workouts.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop" alt="Quick workouts" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('quick_workouts.img_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Workout selector */}
      <RevealBlock delay={0} className="mb-4">
        <div className="flex gap-2 flex-wrap mb-6">
          {WORKOUTS.map((w, i) => (
            <button key={i} onClick={() => setOpen(i)}
              className="px-4 py-2 rounded-full text-lg font-bold border transition-all"
              style={{ borderColor: open === i ? w.color : 'rgba(255,255,255,0.1)', background: open === i ? `${w.color}20` : 'transparent', color: open === i ? w.color : '#999' }}>
              {w.icon} {w.dur}
            </button>
          ))}
        </div>
      </RevealBlock>

      {/* Workout detail */}
      {WORKOUTS.map((w, i) => open === i && (
        <RevealBlock key={i} delay={0} className="mb-12">
          <div className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${w.color}30` }}>
            <div className="p-5 border-b border-border" style={{ background: `${w.color}08` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{w.icon}</span>
                <div>
                  <div className="font-black text-2xl text-text">{w.dur} — {w.label}</div>
                  <div className="text-base text-muted mt-0.5">Mục tiêu: {w.goal}</div>
                </div>
              </div>
              <div className="text-base text-muted p-3 rounded-xl border" style={{ borderColor: `${w.color}20`, background: `${w.color}08` }}>
                <strong style={{ color: w.color }}>Phù hợp cho:</strong> {w.who}
              </div>
            </div>
            <div className="p-5 space-y-4">
              {w.steps.map((step, j) => (
                <div key={j} className="flex gap-4 rounded-2xl p-3 transition-colors duration-200 cursor-pointer group"
                  style={{ background: stepModal && stepModal.wi === i && stepModal.si === j ? `rgba(${w.rgb},0.08)` : 'transparent', border: `1px solid ${stepModal && stepModal.wi === i && stepModal.si === j ? `rgba(${w.rgb},0.3)` : 'transparent'}` }}
                  onClick={() => setStepModal({ wi: i, si: j })}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-black" style={{ background: `${w.color}20`, color: w.color }}>{j + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-text text-lg">{step.icon} {step.name}</span>
                      <span className="text-base px-2 py-0.5 rounded-full font-bold" style={{ color: w.color, background: `${w.color}15` }}>{step.dur}</span>
                    </div>
                    <p className="text-base text-muted">{step.desc}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setStepModal({ wi: i, si: j }); }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 shrink-0 self-start mt-1 opacity-0 group-hover:opacity-100"
                    style={{ color: w.color, background: `rgba(${w.rgb},0.1)`, border: `1px solid rgba(${w.rgb},0.25)` }}>
                    Chi tiết →
                  </button>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="p-3 rounded-xl text-lg" style={{ background: `${w.color}10`, borderLeft: `3px solid ${w.color}` }}>
                <strong style={{ color: w.color }}>💡 Tip tăng tiến:</strong> <span className="text-muted">{w.tip}</span>
              </div>
            </div>
          </div>
        </RevealBlock>
      ))}

      {/* When to use */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Chọn Bài Tập Thế Nào?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SITUATIONS.map((s, i) => (
            <div key={i}
              className="rounded-xl border p-4 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
              style={{ borderColor: sitModal === i ? `rgba(${s.rgb},0.5)` : 'var(--border)', background: sitModal === i ? `rgba(${s.rgb},0.07)` : 'var(--surface)' }}
              onClick={() => setSitModal(i)}>
              <div className="flex items-start justify-between gap-2">
                <div className="text-2xl mb-2">{s.icon}</div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: s.color, background: `rgba(${s.rgb},0.1)`, border: `1px solid rgba(${s.rgb},0.25)` }}>Chi tiết →</span>
              </div>
              <div className="text-sm text-muted mb-1">Tình huống: {s.situation}</div>
              <div className="text-base font-bold" style={{ color: s.color }}>→ {s.recommend}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

      {stepModal !== null && (() => {
        const { wi, si } = stepModal;
        const wo = WORKOUTS[wi];
        return (
          <StepModal
            wi={wi} si={si}
            onClose={() => setStepModal(null)}
            onPrev={() => setStepModal({ wi, si: si - 1 })}
            onNext={() => setStepModal({ wi, si: si + 1 })}
            hasPrev={si > 0}
            hasNext={si < wo.steps.length - 1}
          />
        );
      })()}
      {sitModal !== null && (
        <SituationModal
          idx={sitModal}
          onClose={() => setSitModal(null)}
          onPrev={() => setSitModal(i => Math.max(0, i - 1))}
          onNext={() => setSitModal(i => Math.min(SITUATIONS.length - 1, i + 1))}
          hasPrev={sitModal > 0}
          hasNext={sitModal < SITUATIONS.length - 1}
        />
      )}
    </div>
  );
}
