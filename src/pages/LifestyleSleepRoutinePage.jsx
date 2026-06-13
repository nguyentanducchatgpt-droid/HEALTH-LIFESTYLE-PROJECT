import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-sroutine-orbit-kf';

const ROUTINE_60 = [
  {
    time: 'Trước ngủ 60 phút', icon: '📋', action: 'Ngưng việc nặng, chốt công việc ngày mai',
    color: '#94a3b8', rgb: '148,163,184',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Quyết định ngưng làm việc ở phút 60 — không phải "khi xong việc" — là bước quan trọng nhất của routine. Não cần 45–60 phút để chuyển từ "mode làm việc" sang "mode ngủ" được.',
    detail: '"Khi nào xong thì thôi" là bẫy lớn nhất. Công việc không bao giờ thực sự xong — luôn có email tiếp theo, task tiếp theo. Đặt giờ "đóng ngày" cứng như một cuộc hẹn không thể thay đổi, không phải như một mục tiêu mơ hồ.',
    details: [
      'Não cần 45–60 phút "wind-down" để giảm cortisol và chuyển từ sóng beta (tập trung) sang alpha (thư giãn) trước khi vào giấc ngủ sâu được.',
      'Ngưng việc nặng không có nghĩa là dừng hoàn toàn — nhưng không bắt đầu task mới, không mở email, không vào cuộc họp sau giờ này.',
      'Chốt công việc ngày mai bằng cách viết 1–3 task quan trọng nhất sáng mai — não có thể "thả" chúng ra thay vì tiếp tục xử lý ngầm trong đêm.',
      'Kỹ thuật "concern dump": viết ra tất cả những điều đang lo lắng vào sổ — não sẽ dừng replay chúng khi biết chúng đã được ghi lại rõ ràng.',
      'Thông báo hệ thống (Slack, email, phone): bật chế độ "Không làm phiền" ngay lúc này — không phải 10 phút sau.',
      'Nhất quán về giờ đóng ngày quan trọng hơn bất kỳ biện pháp kỹ thuật nào — cơ thể bắt đầu chuẩn bị ngủ từ tín hiệu thời gian cố định.',
    ],
    points: [
      { icon: '🧠', label: 'Wind-down 45–60 phút', note: 'Não cần thời gian chuyển từ beta → alpha' },
      { icon: '✍️', label: 'Viết task ngày mai', note: 'Não thả ra thay vì xử lý ngầm suốt đêm' },
      { icon: '📵', label: 'Bật "Không làm phiền"', note: 'Ngay lúc này — không phải sau 10 phút' },
      { icon: '🕙', label: 'Giờ đóng ngày cứng', note: 'Như cuộc hẹn, không phải mục tiêu mơ hồ' },
    ],
  },
  {
    time: 'Trước ngủ 50 phút', icon: '📱', action: 'Kiểm tra tin nhắn lần cuối, sau đó đặt điện thoại đi',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Kiểm tra lần cuối" là khoảnh khắc quan trọng nhất — sau đó điện thoại phải ra khỏi tầm tay. Sạc điện thoại ngoài phòng ngủ là thay đổi vật lý đơn giản nhất để phá vỡ vòng xoáy "xem thêm 1 cái".',
    detail: 'Điện thoại trong phòng ngủ — dù màn hình tắt — tạo ra "kéo tâm lý" liên tục. Nghiên cứu cho thấy sự có mặt của điện thoại (ngay cả úp mặt xuống) vẫn làm giảm khả năng thư giãn và làm chậm quá trình chuyển sang trạng thái nghỉ ngơi.',
    details: [
      'Kiểm tra có chủ đích: mở, đọc, trả lời nếu cần thiết, đặt xuống — không scroll vô định sau khi đã kiểm tra.',
      'Không reply email/tin nhắn công việc sau thời điểm này — trả lời tạo ra kỳ vọng "sẵn sàng 24/7" và khó cắt về sau.',
      'Điện thoại ngoài phòng ngủ: dùng đồng hồ báo thức thông thường thay thế — loại bỏ hoàn toàn lý do "cần điện thoại để báo thức".',
      'Nếu phải giữ điện thoại trong phòng: úp mặt xuống, tắt toàn bộ thông báo âm thanh, đặt xa tầm tay từ giường.',
      'Ánh sáng xanh từ màn hình điện thoại (480nm) ức chế melatonin ngay cả khi xem dưới 10 phút — phút 50 là thời điểm muộn nhất nên cắt.',
      'Thay thế bằng: podcast nhẹ nhàng (không tin tức), nhạc ambient, hoặc đơn giản là im lặng — não cần ít kích thích hơn, không nhiều hơn.',
    ],
    points: [
      { icon: '🔌', label: 'Sạc ngoài phòng ngủ', note: 'Thay đổi vật lý đơn giản nhất — không cần ý chí' },
      { icon: '📵', label: 'Không reply công việc', note: 'Tạo ranh giới rõ ràng — bảo vệ thời gian nghỉ' },
      { icon: '💡', label: 'Ánh sáng 480nm', note: '<10 phút xem điện thoại đủ ức chế melatonin' },
      { icon: '🎵', label: 'Thay bằng âm thanh nhẹ', note: 'Podcast/nhạc ambient — ít kích thích hơn màn hình' },
    ],
  },
  {
    time: 'Trước ngủ 45 phút', icon: '💡', action: 'Giảm đèn phòng, bật đèn ngủ ấm',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm cường độ ánh sáng xuống <50 lux (tương đương ánh nến) trong 45 phút trước ngủ giúp tuyến tùng bắt đầu tiết melatonin — cơ thể không phân biệt được "đèn LED trắng" và "ban ngày".',
    detail: 'Hệ thống ánh sáng của con người tiến hóa trong môi trường không có điện. Lúc hoàng hôn, ánh sáng chuyển từ xanh (ban ngày) sang đỏ/cam (hoàng hôn) — tín hiệu cho cơ thể "sắp tối". Đèn phòng hiện đại (đặc biệt LED trắng) can thiệp hoàn toàn tín hiệu sinh học này.',
    details: [
      'Melanopsin trong võng mạc nhạy nhất với ánh sáng 480nm (xanh lam) — chính xác là bước sóng phổ biến nhất trong đèn LED trắng và màn hình hiện đại.',
      'Cơ thể cần ánh sáng giảm xuống <50 lux (ánh nến) trong ít nhất 30 phút trước ngủ để tuyến tùng bắt đầu tiết melatonin đủ nồng độ.',
      'Đèn ngủ ấm (2700K–3000K, màu cam/vàng) chứa ít ánh sáng 480nm hơn đèn trắng ban ngày (5000–6500K) — thay thế tốt và thực tế nhất.',
      'Đèn đỏ (<590nm) gần như không kích thích melanopsin — lý tưởng nhất cho phòng ngủ sau 21h nếu cần đèn để di chuyển.',
      'Phòng tắm thường có đèn rất trắng và sáng — thay bằng đèn nhỏ ấm hoặc đèn ngủ khi dùng phòng tắm sau 21h.',
      'Smart bulb có thể lập lịch tự động giảm về 2700K lúc 21h — đầu tư một lần, áp dụng mọi đêm không cần nhớ.',
    ],
    points: [
      { icon: '🕯️', label: '<50 lux (ánh nến)', note: 'Ngưỡng để tuyến tùng bắt đầu tiết melatonin' },
      { icon: '🟠', label: 'Đèn 2700–3000K', note: 'Màu cam/vàng ấm — ít ánh sáng 480nm nhất' },
      { icon: '🔴', label: 'Đèn đỏ <590nm', note: 'Gần như không ức chế melatonin — lý tưởng nhất' },
      { icon: '💡', label: 'Phòng tắm là điểm yếu', note: 'Đèn trắng sáng sau 21h — cần thay bằng đèn ấm' },
    ],
  },
  {
    time: 'Trước ngủ 40 phút', icon: '🚿', action: 'Tắm ấm hoặc rửa mặt, vệ sinh cá nhân',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tắm ấm 40–42°C trong 10 phút, 40–60 phút trước khi ngủ, giúp nhiệt độ lõi cơ thể giảm nhanh sau khi ra tắm — đẩy nhanh quá trình vào giấc ngủ sâu N3 đáng kể.',
    detail: 'Nghịch lý nhiệt: tắm nóng lại giúp ngủ mát hơn. Nước ấm làm giãn mạch máu ngoại vi → nhiệt tỏa ra qua da → nhiệt độ lõi cơ thể giảm sau khi ra tắm. Não đọc tín hiệu "nhiệt độ lõi giảm" = "đến giờ ngủ sâu". Không có bồn tắm? Ngâm chân 15 phút hiệu quả tương tự.',
    details: [
      'Nhiệt độ lõi cơ thể cần giảm 1–2°C để vào N3 (ngủ sâu) — tắm ấm đẩy nhanh quá trình này bằng cơ chế tỏa nhiệt qua da.',
      'Nhiệt độ nước lý tưởng: 40–42°C — đủ ấm để giãn mạch nhưng không nóng đến mức gây khó chịu kéo dài.',
      'Thời gian tối ưu: 10–15 phút tắm, 40–60 phút trước khi ngủ — để nhiệt độ lõi có thời gian giảm xuống mức tối ưu.',
      'Ngâm chân ấm 15 phút: chân có mật độ mạch máu cao — hiệu quả gần tương đương tắm toàn thân, dễ thực hiện hơn.',
      'Tránh tắm quá nóng (>43°C) ngay sát giờ ngủ: cơ thể cần thêm thời gian hạ nhiệt, có thể trì hoãn giấc ngủ thay vì cải thiện.',
      'Kết hợp với ánh sáng ấm trong phòng tắm — không bật đèn trắng sáng khi tắm để không phá vỡ tín hiệu melatonin đang hình thành.',
    ],
    points: [
      { icon: '🌡️', label: '40–42°C, 10–15 phút', note: 'Ngưỡng nhiệt độ và thời gian tối ưu để tỏa nhiệt' },
      { icon: '⏱️', label: '40–60 phút trước ngủ', note: 'Đủ thời gian để nhiệt độ lõi giảm tự nhiên' },
      { icon: '🦶', label: 'Ngâm chân thay thế', note: '15 phút — hiệu quả gần tương đương tắm toàn thân' },
      { icon: '❄️', label: 'Core temp giảm', note: 'Tín hiệu não nhận: "đến giờ vào ngủ sâu N3"' },
    ],
  },
  {
    time: 'Trước ngủ 30 phút', icon: '🧘', action: 'Giãn cơ nhẹ: cổ vai gáy, lưng, hông (5–10 phút)',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giãn cơ nhẹ 5–10 phút trước ngủ giảm cortisol, giải phóng căng thẳng tích lũy trong cơ sau ngày dài, và gửi tín hiệu "an toàn" lên hệ thần kinh — cho phép cơ thể chuyển sang chế độ phục hồi.',
    detail: 'Cơ bắp căng cứng (đặc biệt cổ, vai, lưng) là dấu hiệu hệ thần kinh giao cảm vẫn còn kích hoạt. Giãn cơ không phải chỉ thư giãn cơ bắp — nó kích hoạt hệ thần kinh phó giao cảm qua phản xạ cơ-não, làm nhịp tim chậm lại và chuẩn bị cơ thể cho giấc ngủ.',
    details: [
      'Cơ cổ vai gáy là vùng tích trữ căng thẳng nhiều nhất — ngồi máy tính cả ngày tạo ra co cứng mãn tính cần được giãn trước ngủ.',
      'Giãn cơ kích hoạt thụ thể cơ (Golgi tendon organs) → tín hiệu "an toàn" lên não → hệ thần kinh giao cảm giảm hoạt động tự nhiên.',
      'Không tập mạnh: mục tiêu là thư giãn, không phải workout. Giữ mỗi tư thế 30–60 giây, thở chậm — không kéo căng đến mức đau.',
      '5 bài cơ bản: chin tuck (cổ), shoulder roll (vai), thoracic twist (lưng trên), child pose (lưng dưới), legs up the wall (chân/hông).',
      'Kết hợp thở chậm trong khi giãn cơ — thở ra dài hơn thở vào (4 giây hít / 6–8 giây thở) tăng hiệu quả thư giãn rõ rệt.',
      'Đặc biệt hiệu quả cho người tập nặng — giúp cortisol sau tập giảm nhanh hơn và cơ phục hồi tốt hơn trong giai đoạn N3.',
    ],
    points: [
      { icon: '🦴', label: 'Cổ vai gáy trước tiên', note: 'Vùng tích lũy căng thẳng nhiều nhất trong ngày' },
      { icon: '⚡', label: 'Golgi tendon reflex', note: 'Thư giãn cơ → tín hiệu an toàn → giao cảm giảm' },
      { icon: '🧘', label: '5 bài cơ bản', note: 'Chin tuck / shoulder roll / twist / child pose / legs up' },
      { icon: '🌬️', label: 'Thở 4–6–8 khi giãn', note: 'Thở ra dài hơn — tăng hiệu quả phó giao cảm' },
    ],
  },
  {
    time: 'Trước ngủ 20 phút', icon: '📚', action: 'Đọc sách giấy hoặc nghe nhạc nhẹ',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đọc sách giấy 20 phút trước ngủ giảm mức stress 68% (University of Sussex 2009) — hiệu quả hơn nghe nhạc (61%), uống trà (54%), và đi bộ (42%). Não "thoát" khỏi vấn đề thực tế khi đắm chìm vào câu chuyện.',
    detail: 'Sách giấy hoàn hảo cho phút này vì 3 lý do: không có ánh sáng xanh, không có thông báo, và nội dung có cấu trúc tuyến tính (không phải scroll vô tận). Não được kích thích nhẹ nhàng bởi câu chuyện thay vì bị kéo căng bởi thông tin thực tế.',
    details: [
      'University of Sussex (2009): chỉ 6 phút đọc sách giảm nhịp tim, căng cơ và mức stress 68% — nhanh hơn bất kỳ phương pháp thư giãn nào khác được kiểm tra.',
      'Sách giấy vs. e-reader: sách giấy không có ánh sáng tự phát, không có thông báo, không có "next content" gợi ý — ít kích thích não hơn hoàn toàn.',
      'Nội dung lý tưởng: tiểu thuyết nhẹ, phi hư cấu thú vị nhưng không căng thẳng — tránh sách nghề nghiệp, tin tức, nội dung kích thích tư duy nặng.',
      'Nghe nhạc nhẹ (60–80 BPM, không lời hoặc lời nhẹ nhàng) đồng bộ nhịp tim với nhịp nhạc — giảm nhịp tim tự nhiên theo cơ chế entrainment.',
      'Podcast nhẹ nhàng là lựa chọn tốt nếu không muốn đọc — tránh podcast nghề nghiệp, tin tức, nội dung gây tranh cãi.',
      'Không đọc trên điện thoại/tablet — ngay cả với chế độ night mode, não vẫn phản xạ "scroll", "swipe", "check" từ thói quen đã hình thành.',
    ],
    points: [
      { icon: '📖', label: 'Giảm stress 68%', note: 'University of Sussex — chỉ sau 6 phút đọc sách' },
      { icon: '🎵', label: '60–80 BPM', note: 'Nhịp nhạc đồng bộ nhịp tim — entrainment effect' },
      { icon: '🚫', label: 'Không e-reader/phone', note: 'Ánh sáng xanh + thông báo phá vỡ toàn bộ hiệu quả' },
      { icon: '📗', label: 'Tiểu thuyết nhẹ', note: 'Tránh sách nghề nghiệp — não "thoát" khỏi lo lắng' },
    ],
  },
  {
    time: 'Trước ngủ 10 phút', icon: '🌬️', action: 'Thở chậm cơ hoành 3–5 phút',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở ra dài hơn thở vào (tỉ lệ 1:2, ví dụ hít 4 giây — thở 8 giây) kích hoạt dây thần kinh phế vị và hạ nhịp tim trong 60–90 giây — phương pháp duy nhất có thể can thiệp trực tiếp vào hệ thần kinh tự chủ theo ý chí.',
    detail: 'Hơi thở là cầu nối duy nhất giữa hệ thần kinh tự chủ (thường hoạt động ngoài ý chí) và ý thức. Khi thở ra chậm và dài, dây thần kinh phế vị (vagus nerve) được kích hoạt → nhịp tim chậm lại → huyết áp giảm → cortisol giảm → cơ thể chuyển sang chế độ phục hồi.',
    details: [
      'Hệ thần kinh phó giao cảm được kích hoạt chủ yếu qua thở ra — thở vào kích hoạt giao cảm nhẹ, thở ra kích hoạt phó giao cảm mạnh.',
      'Tỉ lệ thở tối ưu trước ngủ: hít 4 giây → giữ 4 giây (tùy chọn) → thở ra 6–8 giây — thở ra ít nhất gấp đôi thở vào.',
      'Thở cơ hoành (bụng phồng ra khi hít, không phải ngực) tối đa hóa thể tích khí mỗi nhịp → ít nhịp hơn → nhịp tim chậm hơn tự nhiên.',
      'Phương pháp 4-7-8 (hít 4, giữ 7, thở 8): hiệu quả nhanh nhưng khó với người mới — bắt đầu bằng 4-0-6 đơn giản hơn.',
      'Box breathing (4-4-4-4): tốt cho ban ngày và giảm căng thẳng — nhưng 4-6-8 tốt hơn cho trước ngủ vì thở ra dài hơn rõ rệt.',
      'Chỉ cần 3–5 phút để hệ thần kinh phó giao cảm chiếm ưu thế — ngắn nhất trong tất cả các kỹ thuật thư giãn có bằng chứng khoa học.',
    ],
    points: [
      { icon: '🫁', label: 'Thở cơ hoành', note: 'Bụng phồng ra khi hít — không phải ngực' },
      { icon: '⚖️', label: 'Tỉ lệ 1:2', note: 'Thở ra ≥ 2× thở vào — kích hoạt phó giao cảm mạnh' },
      { icon: '⚡', label: 'Vagus nerve', note: 'Nhịp tim chậm trong 60–90 giây sau khi bắt đầu' },
      { icon: '⏱️', label: 'Chỉ 3–5 phút', note: 'Đủ để hệ thần kinh chuyển sang rest-and-digest' },
    ],
  },
  {
    time: 'Lên giường', icon: '😴', action: 'Không lướt điện thoại, nhắm mắt thư giãn',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giường chỉ dùng để ngủ — nguyên tắc "stimulus control" của CBT-I (Cognitive Behavioral Therapy for Insomnia). Mỗi lần làm việc hoặc xem phim trên giường huấn luyện não liên kết "giường = tỉnh táo".',
    detail: 'Stimulus control là nền tảng của CBT-I — phương pháp được FDA và các cơ quan y tế toàn cầu khuyến nghị là điều trị đầu tay cho mất ngủ mãn tính (hiệu quả hơn thuốc ngủ dài hạn). Giường = duy nhất ngủ là quy tắc không thể phá vỡ.',
    details: [
      'Stimulus control: não học bằng liên kết Pavlov — làm việc, xem phim trên giường = giường trở thành tín hiệu "tỉnh táo, hoạt động".',
      'Nếu nằm >20 phút không ngủ được: dậy nhẹ nhàng, ngồi ra ghế đọc sách trong ánh sáng ấm cho đến khi buồn ngủ — không nằm cố.',
      'Không nhìn đồng hồ liên tục: lo lắng về giờ giấc kích hoạt cortisol → càng khó ngủ. Úp đồng hồ lại hoặc xoay đi xa.',
      'Progressive Muscle Relaxation (PMR): căng từng nhóm cơ 5 giây rồi thả → từ bàn chân lên đến mặt — hiệu quả với người khó thư giãn.',
      'Guided imagery: tưởng tượng một nơi yên tĩnh quen thuộc với chi tiết cụ thể — giữ tâm trí bận rộn nhẹ nhàng thay vì để nó lo lắng.',
      'Body scan: tập trung lần lượt vào từng phần cơ thể từ bàn chân lên đầu, nhận biết cảm giác mà không phán xét — thiền mindfulness đơn giản.',
    ],
    points: [
      { icon: '🛏️', label: 'Giường = chỉ ngủ', note: 'Stimulus control — nguyên tắc CBT-I số 1' },
      { icon: '🕐', label: 'Không xem giờ', note: 'Nhìn đồng hồ → lo lắng → cortisol → tỉnh hơn' },
      { icon: '💪', label: 'PMR', note: 'Căng-thả từng cơ — từ bàn chân lên mặt' },
      { icon: '🌄', label: 'Guided imagery', note: 'Tưởng tượng nơi yên bình — giữ tâm trí nhẹ nhàng' },
    ],
  },
];

const ROUTINE_10 = [
  {
    step: 1, duration: '1 phút', icon: '📵',
    action: 'Tắt màn hình và đặt điện thoại ra xa',
    label: 'Tắt màn hình & đặt điện thoại ra xa',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đặt điện thoại ra ngoài tầm tay (không chỉ úp mặt xuống) loại bỏ hoàn toàn lực kéo tâm lý — não ngừng "chờ thông báo" và bắt đầu thư giãn thực sự.',
    detail: 'Hành động vật lý đơn giản nhất nhưng có tác động lớn nhất trong routine 10 phút. Điện thoại trong tầm tay tạo ra "kéo nhận thức" liên tục — não dành một phần năng lực để theo dõi thiết bị, ngay cả khi màn hình tắt. Bước 1 này đặt ranh giới cứng cho toàn bộ routine.',
    details: [
      'Đặt điện thoại vào ngăn kéo, để ngoài cửa phòng, hoặc sạc ở phòng khác — xa tầm tay là tiêu chuẩn, không phải úp mặt xuống.',
      'Nghiên cứu University of Texas (2017): điện thoại trên bàn — dù màn hình tắt — làm giảm khả năng nhận thức đáng kể do "brain drain" hiệu ứng.',
      'Bật chế độ "Không làm phiền" trước khi đặt đi: loại bỏ cả âm thanh và rung — não không còn lý do để "vẫn nghe ngóng".',
      'Thay thế bằng đồng hồ báo thức thông thường nếu lo quên báo thức — đây là lý do phổ biến nhất giữ điện thoại trong phòng ngủ.',
      'Nếu cần điện thoại cho âm thanh (podcast/nhạc): bật trước, đặt màn hình úp và xa — không để trong tầm với khi nằm xuống.',
      'Sau 7–14 ngày làm quen, hành động đặt điện thoại ra xa trở thành tín hiệu Pavlov "bắt đầu routine ngủ" — cơ thể tự nhiên chuyển sang chế độ thư giãn.',
    ],
    points: [
      { icon: '🧠', label: 'Brain drain effect', note: 'Điện thoại trên bàn → giảm khả năng nhận thức' },
      { icon: '🔇', label: 'Bật "Không làm phiền"', note: 'Loại bỏ cả âm thanh + rung — não ngừng ngóng đợi' },
      { icon: '⏰', label: 'Dùng đồng hồ thường', note: 'Loại bỏ lý do số 1 giữ điện thoại trong phòng ngủ' },
      { icon: '🔔', label: 'Tín hiệu Pavlov', note: 'Sau 7–14 ngày → hành động này = báo hiệu ngủ tự động' },
    ],
  },
  {
    step: 2, duration: '2 phút', icon: '💫',
    action: 'Giãn cổ vai gáy nhẹ (xoay đầu, shoulder roll)',
    label: 'Giãn cổ vai gáy nhẹ',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ cổ vai gáy là vùng tích lũy căng thẳng nhiều nhất sau ngày làm việc với màn hình. Chỉ 2 phút xoay và thả nhẹ giải phóng co cứng, kích hoạt hệ thần kinh phó giao cảm và báo hiệu cơ thể "an toàn để nghỉ ngơi".',
    detail: 'Sau 8–10 tiếng nhìn màn hình, cơ cổ và vai gáy duy trì co cứng isometric (co mà không chuyển động) liên tục. Đây là nguồn cortisol và căng thẳng tích lũy lớn nhất trong cơ thể. Giãn nhẹ 2 phút không cần chuyên sâu — chỉ cần đủ để gửi tín hiệu "thả ra" lên não.',
    details: [
      'Chin tuck (gập cằm vào): giữ 3–5 giây × 5 lần — giải phóng cơ dưới chẩm (suboccipital muscles) thường căng nhất khi nhìn màn hình.',
      'Xoay đầu chậm: trái 5 giây → trung tâm → phải 5 giây → lặp lại 3–4 lần. Không giật mạnh — giữ chậm và thở ra khi xoay.',
      'Shoulder roll: 5 vòng ra trước, 5 vòng ra sau — vai nâng lên tai khi hít vào, thả xuống khi thở ra.',
      'Ear-to-shoulder stretch: nghiêng đầu sang phải, giữ 20–30 giây (tay phải nhẹ nhàng kéo thêm), lặp lại bên trái.',
      'Không làm khi có chấn thương cổ cấp tính — chỉ xoay trong phạm vi thoải mái, không cố ép qua điểm đau.',
      'Kết hợp thở chậm trong khi giãn: thở ra khi xoay ra ngoài, hít vào khi trở về trung tâm — tăng hiệu quả thư giãn cơ-thần kinh.',
    ],
    points: [
      { icon: '🖥️', label: 'Isometric tension', note: '8–10h màn hình = cổ co cứng liên tục mà không biết' },
      { icon: '🔄', label: 'Chin tuck × 5', note: 'Giải phóng suboccipital — nhóm cơ căng nhất' },
      { icon: '💫', label: 'Shoulder roll × 10', note: 'Ra trước 5 + ra sau 5 — thả vai xuống khi thở ra' },
      { icon: '🌬️', label: 'Thở đồng bộ', note: 'Thở ra khi xoay ra ngoài — tăng hiệu quả thư giãn' },
    ],
  },
  {
    step: 3, duration: '2 phút', icon: '🧘',
    action: 'Child pose + vươn người (kéo căng lưng)',
    label: 'Child pose + vươn người',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Child pose (tư thế em bé) là một trong số ít tư thế yoga được chứng minh kích hoạt hệ phó giao cảm (rest-and-digest) trong vòng 60–90 giây — gập người về trước làm chậm nhịp tim và hạ huyết áp.',
    detail: 'Child pose kết hợp 3 tác động cùng lúc: kéo căng lưng dưới và hông (vùng tích lũy căng thẳng thứ 2 sau cổ vai), kích thích áp suất nhẹ vào bụng giúp kích hoạt dây thần kinh phế vị, và tư thế cúi đầu tạo phản xạ làm chậm nhịp tim. Đây là lý do nhiều người tự nhiên cảm thấy buồn ngủ sau tư thế này.',
    details: [
      'Child pose: quỳ gối, ngồi xuống gót chân, cúi người về trước, hai tay duỗi thẳng — giữ 60–90 giây, thở chậm và đều.',
      'Áp lực nhẹ lên bụng trong child pose kích thích vagus nerve qua cơ chế baroreceptor — làm chậm nhịp tim trong 30–60 giây.',
      'Vươn người (cat-cow stretch): 4 điểm chống (tay và gối), cong lưng lên hít vào, võng lưng xuống thở ra — lặp 5–6 lần chậm rãi.',
      'Thoracic extension: ngồi trên gót chân, hai tay đan sau đầu, ngửa người ra sau nhẹ — 15–20 giây, mở ngực sau ngày co cụm.',
      'Nếu không quen: đơn giản nhất là nằm ngửa, co gối vào ngực và giữ 1 phút — hiệu quả tương tự, không cần điều kiện linh hoạt.',
      'Kết thúc bằng ngồi thẳng lưng, tay đặt lên đùi, mắt nhắm 10 giây — chuyển nhịp sang bước thở chậm tiếp theo.',
    ],
    points: [
      { icon: '🧘', label: 'Child pose 60–90 giây', note: 'Kích hoạt phó giao cảm — nhịp tim chậm lại' },
      { icon: '⚡', label: 'Vagus nerve qua bụng', note: 'Áp lực nhẹ → baroreceptor → tim chậm hơn' },
      { icon: '🐱', label: 'Cat-cow × 5–6 lần', note: 'Đồng bộ thở với cử động — kéo căng cột sống' },
      { icon: '🛋️', label: 'Thay thế dễ hơn', note: 'Nằm ngửa co gối vào ngực 1 phút — hiệu quả tương tự' },
    ],
  },
  {
    step: 4, duration: '2 phút', icon: '🌬️',
    action: 'Thở chậm: hít 4 giây, thở 6 giây × 5–6 vòng',
    label: 'Thở chậm cơ hoành 4–6',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1474418397713-003ec9f4dafd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hít 4 giây – thở ra 6 giây tạo ra tỉ lệ I:E = 1:1.5 — ngưỡng tối thiểu để kích hoạt phó giao cảm. Chỉ 5–6 vòng thở (khoảng 50–60 giây) đủ để nhịp tim chậm lại và cortisol giảm đáng kể.',
    detail: 'Thở là công cụ duy nhất có thể can thiệp trực tiếp vào hệ thần kinh tự chủ theo ý chí. Thở ra dài hơn thở vào = kích hoạt hệ phó giao cảm. Tỉ lệ 4:6 là đơn giản nhất cho người mới — dễ đếm, dễ nhớ, và đủ hiệu quả trong routine 10 phút.',
    details: [
      'Hít vào 4 giây qua mũi, bụng phồng ra (thở cơ hoành, không phải ngực) — thở ra 6 giây qua miệng hoặc mũi, bụng xẹp xuống từ từ.',
      'Thở cơ hoành: đặt tay lên bụng để kiểm tra — bụng phải phồng ra khi hít vào. Nếu ngực phồng, thở chưa đúng cơ hoành.',
      'I:E ratio 1:1.5 (4:6) là ngưỡng tối thiểu kích hoạt phó giao cảm — tỉ lệ 1:2 (4:8) mạnh hơn nhưng khó hơn cho người mới.',
      '5–6 vòng thở đủ thay đổi HRV (Heart Rate Variability) đáng kể — chỉ số đo độ cân bằng hệ thần kinh tự chủ.',
      'Đếm nhẩm hoặc dùng ngón tay để đếm giây — không cần app hay timer, giữ não ở mức kích thích tối thiểu.',
      'Nếu 4:6 quá dễ sau vài ngày: thử 4:8 hoặc 4-4-8 (hít 4, giữ 4, thở 8) — tăng dần tỉ lệ thở ra để kích hoạt phó giao cảm mạnh hơn.',
    ],
    points: [
      { icon: '🫁', label: 'Bụng phồng khi hít', note: 'Thở cơ hoành — không phải ngực phồng' },
      { icon: '⚖️', label: 'Tỉ lệ 4:6 (I:E 1:1.5)', note: 'Ngưỡng tối thiểu kích hoạt phó giao cảm' },
      { icon: '❤️', label: 'HRV tăng sau 5–6 vòng', note: 'Hệ thần kinh tự chủ cân bằng — ngủ sâu hơn' },
      { icon: '📈', label: 'Nâng dần lên 4:8', note: 'Sau quen với 4:6 — tăng thở ra dài hơn' },
    ],
  },
  {
    step: 5, duration: '1 phút', icon: '✍️',
    action: 'Viết 1 dòng: "Việc quan trọng nhất ngày mai là..."',
    label: 'Viết task quan trọng nhất ngày mai',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Viết ra 1 task quan trọng nhất ngày mai "offload" não khỏi nhiệm vụ ghi nhớ — nghiên cứu Baylor University (2018): viết to-do list trước ngủ giúp vào giấc nhanh hơn 9 phút so với viết nhật ký về ngày đã qua.',
    detail: 'Não liên tục "rehearse" các task chưa hoàn thành khi ngủ (Zeigarnik effect) — đây là nguyên nhân chính của mind chatter khi nằm xuống. Viết ra giải phóng não khỏi nhiệm vụ "đừng quên" — não có thể thực sự tắt máy thay vì chạy nền.',
    details: [
      'Zeigarnik effect: não ưu tiên ghi nhớ và rehearse các task chưa hoàn thành — viết ra "đóng vòng lặp" và cho phép não buông bỏ.',
      'Chỉ viết 1 task — không phải danh sách dài. Một task cụ thể, có thể hành động được, cho ngày mai. Không cần hoàn chỉnh.',
      'Baylor University (2018): viết to-do list cụ thể cho ngày mai (không phải journal về hôm nay) giúp vào giấc nhanh hơn 9 phút.',
      'To-do list càng cụ thể càng tốt: "Gọi điện cho A lúc 9h" tốt hơn "xử lý công việc" — não cần sự rõ ràng để "đóng tab".',
      'Dùng sổ tay giấy và bút — không phải app điện thoại. Hành động vật lý viết tay kích hoạt vùng não khác, có hiệu quả "đóng cửa ngày" mạnh hơn.',
      'Tùy chọn: thêm 1 dòng nhanh về điều tốt nhất trong ngày hôm nay — kết hợp gratitude nhẹ để chuyển não sang cảm xúc tích cực trước ngủ.',
    ],
    points: [
      { icon: '🧠', label: 'Zeigarnik effect', note: 'Não rehearse task chưa xong — viết ra để buông bỏ' },
      { icon: '📝', label: 'Chỉ 1 task cụ thể', note: 'Có thể hành động được — không phải danh sách chung' },
      { icon: '⏱️', label: 'Vào giấc nhanh hơn 9 phút', note: 'Baylor 2018 — to-do list > journal về ngày đã qua' },
      { icon: '📓', label: 'Sổ giấy + bút', note: 'Không phải app — hành động vật lý "đóng cửa ngày"' },
    ],
  },
  {
    step: 6, duration: '2 phút', icon: '😴',
    action: 'Lên giường, nhắm mắt, tiếp tục thở chậm',
    label: 'Lên giường, nhắm mắt, thở chậm',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Lên giường sau khi đã hoàn thành 5 bước trước = não nhận tín hiệu "tất cả đã xong, đến giờ ngủ". Tiếp tục thở chậm 2 phút cuối này củng cố phó giao cảm và đóng vòng conditioning toàn bộ routine.',
    detail: 'Bước 6 là bước chuyển tiếp từ routine sang ngủ thực sự. Thở chậm tiếp tục duy trì trạng thái phó giao cảm đã xây dựng từ bước 4 — không để não "bật lại" bằng cách nằm xuống và bắt đầu nghĩ. Mắt nhắm + thở chậm + giường = 3 tín hiệu ngủ đồng thời.',
    details: [
      'Lên giường ngay sau bước 5 — không dừng lại kiểm tra điện thoại, không mở TV, không làm thêm bất kỳ điều gì ngoài routine.',
      'Tiếp tục thở 4:6 (hít 4, thở 6) thêm 5–8 vòng — duy trì trạng thái phó giao cảm mà bước 4 đã tạo ra.',
      'Nếu có suy nghĩ xuất hiện: nhận biết ("ah, tôi đang nghĩ về X"), không phán xét, nhẹ nhàng đưa sự chú ý về hơi thở.',
      'Body scan nhẹ: từ bàn chân lên đầu, để ý xem vùng nào còn căng, thở ra và "thả" vùng đó — không ép, chỉ quan sát và thả.',
      'Không nhìn đồng hồ: kiểm tra giờ kích hoạt lo lắng → cortisol → khó ngủ hơn. Tin tưởng vào routine — thả ra và để cơ thể làm việc.',
      'Sau 14–21 ngày lặp lại đủ 6 bước, cơ thể sẽ bắt đầu cảm thấy buồn ngủ ngay từ bước 1 — đây là dấu hiệu conditioning thành công.',
    ],
    points: [
      { icon: '🛏️', label: 'Giường = chỉ ngủ', note: 'Stimulus control — không làm gì khác sau khi lên giường' },
      { icon: '🌬️', label: 'Thêm 5–8 vòng thở', note: 'Duy trì phó giao cảm từ bước 4 — không để gián đoạn' },
      { icon: '🧘', label: 'Body scan nhẹ', note: 'Quan sát → thả từng vùng căng — từ chân lên đầu' },
      { icon: '🔔', label: 'Tín hiệu conditioning', note: 'Sau 14–21 ngày → buồn ngủ ngay từ bước 1' },
    ],
  },
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

function WhyRoutineModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total ?? WHY_ROUTINE.length}</span>
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
  const [routine60Idx, setRoutine60Idx] = useState(null);
  const [routine10Idx, setRoutine10Idx] = useState(null);

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
              <div key={i}
                className="flex gap-4 items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `rgba(${row.rgb},0.05)`, border: `1px solid rgba(${row.rgb},0.15)` }}
                onClick={() => setRoutine10Idx(i)}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{ background: row.color, color: 'black' }}>{row.step}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold" style={{ color: row.color }}>{row.action}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums shrink-0" style={{ color: row.color }}>{row.duration}</div>
                <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                  style={{ color: row.color, background: `rgba(${row.rgb},0.1)` }}>→</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {ROUTINE_60.map((row, i) => (
              <div key={i}
                className="flex gap-4 items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `rgba(${row.rgb},0.05)`, border: `1px solid rgba(${row.rgb},0.15)` }}
                onClick={() => setRoutine60Idx(i)}>
                <span className="text-2xl shrink-0">{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold tabular-nums mb-0.5" style={{ color: row.color }}>{row.time}</div>
                  <div className="text-base text-text">{row.action}</div>
                </div>
                <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                  style={{ color: row.color, background: `rgba(${row.rgb},0.1)` }}>→</span>
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

      {/* ── Why routine modal ── */}
      {routineIdx !== null && (
        <WhyRoutineModal
          item={WHY_ROUTINE[routineIdx]}
          idx={routineIdx}
          total={WHY_ROUTINE.length}
          onClose={() => setRoutineIdx(null)}
          onPrev={() => setRoutineIdx(i => Math.max(0, i - 1))}
          onNext={() => setRoutineIdx(i => Math.min(WHY_ROUTINE.length - 1, i + 1))}
          hasPrev={routineIdx > 0}
          hasNext={routineIdx < WHY_ROUTINE.length - 1}
        />
      )}

      {/* ── Routine 10 timeline modal ── */}
      {routine10Idx !== null && (
        <WhyRoutineModal
          item={ROUTINE_10[routine10Idx]}
          idx={routine10Idx}
          total={ROUTINE_10.length}
          onClose={() => setRoutine10Idx(null)}
          onPrev={() => setRoutine10Idx(i => Math.max(0, i - 1))}
          onNext={() => setRoutine10Idx(i => Math.min(ROUTINE_10.length - 1, i + 1))}
          hasPrev={routine10Idx > 0}
          hasNext={routine10Idx < ROUTINE_10.length - 1}
        />
      )}

      {/* ── Routine 60 timeline modal — outside all RevealBlocks so position:fixed works ── */}
      {routine60Idx !== null && (
        <WhyRoutineModal
          item={ROUTINE_60[routine60Idx]}
          idx={routine60Idx}
          total={ROUTINE_60.length}
          onClose={() => setRoutine60Idx(null)}
          onPrev={() => setRoutine60Idx(i => Math.max(0, i - 1))}
          onNext={() => setRoutine60Idx(i => Math.min(ROUTINE_60.length - 1, i + 1))}
          hasPrev={routine60Idx > 0}
          hasNext={routine60Idx < ROUTINE_60.length - 1}
        />
      )}
    </div>
  );
}
