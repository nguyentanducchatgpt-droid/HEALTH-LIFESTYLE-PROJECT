import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'f-cl-orbit-kf';
const ORBIT_CLASS = 'f-cl-orbit-ring';

const CAT_COLORS = {
  A: { color: '#22c55e', rgb: '34,197,94' },
  B: { color: '#84cc16', rgb: '132,204,22' },
  C: { color: '#14b8a6', rgb: '20,184,166' },
  D: { color: '#a855f7', rgb: '168,85,247' },
};

const DAILY_ITEMS = [
  {
    label: 'Vận động ít nhất 10 phút', icon: '🏃', cat: 'A',
    tip: 'Bất kỳ: đi bộ, tập, leo cầu thang đều tính',
    img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị 150–300 phút/tuần — nhưng nghiên cứu JAMA 2019 trên 120,000 người cho thấy 10 phút vận động/ngày đã giảm nguy cơ tử vong sớm 15%. Bắt đầu từ 10 phút là ngưỡng thực tế và có bằng chứng khoa học nhất.',
    details: [
      '10 phút vận động liên tục đủ kích hoạt hệ tim mạch, giải phóng endorphin và cải thiện tâm trạng ngay lập tức. Không cần phòng gym, không cần quần áo thể thao đặc biệt — chỉ cần di chuyển.',
      'Tất cả đều tính: đi bộ nhanh, leo cầu thang, đạp xe, bơi lội, nhảy dây, yoga, múa, chơi với con — bất kỳ hoạt động nào làm bạn thở nhanh hơn một chút là đủ điều kiện.',
      'Thời điểm tốt nhất là thời điểm bạn thực sự làm được. Sáng sớm đặt tông tích cực cho cả ngày; buổi tối xả stress sau giờ làm. Không có "thời điểm hoàn hảo" — cái tốt nhất là cái bạn duy trì được.',
      'Tích lũy được: 3 lần × 10 phút = 30 phút, tương đương về lợi ích tim mạch với 1 lần × 30 phút liên tục theo nghiên cứu của ACSM (American College of Sports Medicine).',
      'Nếu không muốn tập: cam kết chỉ 2 phút. Khi đã bắt đầu, 90% người tiếp tục quá 10 phút nhờ quán tính. "2-minute rule" là công cụ mạnh nhất chống lại sự trì hoãn.',
      'Habit stack: gắn vận động với hành vi đã có sẵn — sau ăn sáng, trước khi tắm, khi chờ con đi học về. Không cần thêm thời gian riêng — chỉ cần ghép vào lịch có sẵn.',
    ],
    points: [
      { icon: '⏱️', label: '10 Phút Là Đủ', note: 'Khoa học xác nhận: ngay 10 phút/ngày đã có lợi ích rõ ràng' },
      { icon: '🎯', label: 'Mọi Hoạt Động Tính', note: 'Đi bộ, leo cầu thang, đạp xe — không bắt buộc phải đến gym' },
      { icon: '🧠', label: 'Cải Thiện Tâm Trạng', note: 'Endorphin và serotonin tăng trong vòng 5 phút đầu' },
      { icon: '📈', label: 'Tích Lũy Hiệu Quả', note: '3 × 10 phút = 30 phút — lợi ích tim mạch tương đương' },
    ],
  },
  {
    label: 'Ăn đủ 1 nguồn đạm mỗi bữa chính', icon: '🥩', cat: 'B',
    tip: 'Thịt/cá/trứng/đậu phụ — chọn 1 nguồn là đủ',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient duy nhất không thể tích trữ trong cơ thể — cần nạp đều qua từng bữa. Nghiên cứu cho thấy 20–30g protein/bữa là ngưỡng tối ưu cho tổng hợp cơ, no lâu và kiểm soát đường huyết ổn định.',
    details: [
      'Mỗi bữa chính nên có 1 nguồn đạm rõ ràng: ức gà (25g/100g), cá hồi (20g/100g), trứng (6g/quả), thịt bò (25g/100g), đậu phụ cứng (8g/100g), đậu lăng nấu chín (9g/100g).',
      'Protein giúp no lâu hơn carb và fat nhờ tác động nhiệt sinh (thermic effect) cao nhất: cơ thể đốt 20–30% calo từ protein chỉ để tiêu hóa nó — giúp kiểm soát cân nặng tự nhiên.',
      'Đạm thực vật và động vật đều có giá trị — quan trọng là đa dạng trong tuần. Kết hợp 2 nguồn thực vật (gạo + đậu) cho amino acid profile đầy đủ tương đương thịt.',
      'Phân bổ protein đều 3 bữa (sáng/trưa/tối) tối ưu hơn dồn vào buổi tối cho tổng hợp cơ và phục hồi — theo protein timing research của Stuart Phillips, ĐH McMaster.',
      'Dấu hiệu thiếu đạm mãn tính: mệt mỏi dai dẳng, tóc và móng yếu dễ gãy, vết thương lành chậm, thường xuyên thèm đồ ngọt sau bữa ăn (cơ thể tìm năng lượng nhanh thay thế).',
      'Quy tắc đơn giản: nhìn vào đĩa ăn — nếu không thấy nguồn đạm rõ ràng, thêm 1 quả trứng hoặc 1 hộp sữa chua Hy Lạp nguyên chất. Dễ thực hiện nhất, tác động ngay lập tức.',
    ],
    points: [
      { icon: '🥚', label: '20–30g / Bữa', note: 'Ngưỡng tối ưu để tổng hợp cơ và duy trì no lâu' },
      { icon: '🐟', label: 'Đa Dạng Nguồn', note: 'Thịt/cá/trứng/đậu — đổi xoay để đủ amino acid' },
      { icon: '⏰', label: 'Chia Đều 3 Bữa', note: 'Không dồn buổi tối — cơ thể hấp thu và sử dụng tốt hơn' },
      { icon: '💪', label: 'Giữ Khối Cơ', note: 'Đặc biệt quan trọng sau 30 tuổi khi cơ tự thoái hóa ~1%/năm' },
    ],
  },
  {
    label: 'Ăn ít nhất 2 phần rau/trái cây', icon: '🥗', cat: 'B',
    tip: '1 nắm tay = 1 phần. Ăn đa màu sắc càng tốt',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị ≥5 phần (400g) rau quả/ngày. 2 phần là ngưỡng khởi đầu thực tế — mỗi phần thêm vào giảm 4% nguy cơ tim mạch và 3% nguy cơ ung thư theo phân tích 95 nghiên cứu (2019).',
    details: [
      '1 phần = 1 nắm tay của bạn (~80g): 1 quả chuối vừa, 1 nắm rau cải, 3 muỗng canh rau nấu chín, 1 bát salad nhỏ, hoặc 1 ly nước ép nguyên chất không đường.',
      'Màu sắc = vi chất khác nhau: đỏ (lycopene — tim mạch), cam/vàng (beta-carotene — mắt), xanh lá (chlorophyll — gan), tím (anthocyanin — não và nhận thức), trắng (allicin — miễn dịch). Ăn đa màu = đa vi chất.',
      'Rau sống và rau nấu có lợi ích khác nhau: cà chua nấu chín có lycopene cao hơn sống; súp lơ sống có glucosinolate cao hơn luộc. Lý tưởng là kết hợp cả hai trong ngày.',
      'Fiber từ rau quả nuôi vi khuẩn đường ruột có lợi (prebiotics), giảm LDL cholesterol, làm chậm hấp thu đường, tạo cảm giác no lâu. Không có supplement nào thay thế được rau thật nguyên dạng.',
      'Mẹo tăng lượng rau dễ nhất: thêm 1 nắm rau vào bất kỳ bữa nào; trái cây làm snack thay đồ ngọt; sinh tố rau/quả buổi sáng không cần chế biến phức tạp.',
      'Rau đông lạnh không kém tươi về dinh dưỡng — thường được đông lạnh ngay sau thu hoạch khi dưỡng chất cao nhất. Tiện lợi hơn, ít lãng phí hơn, và sẵn có quanh năm.',
    ],
    points: [
      { icon: '🥦', label: '1 Nắm Tay = 1 Phần', note: '~80g — không cần cân đo, chỉ cần ước lượng bằng tay' },
      { icon: '🌈', label: 'Ăn Đa Màu Sắc', note: 'Mỗi màu = phytochemical và vi chất bảo vệ khác nhau' },
      { icon: '🦠', label: 'Nuôi Đường Ruột', note: 'Fiber là thức ăn của vi khuẩn có lợi — không supplement thay được' },
      { icon: '❄️', label: 'Đông Lạnh Vẫn Tốt', note: 'Rau đông lạnh dinh dưỡng ngang tươi — tiện và ít lãng phí hơn' },
    ],
  },
  {
    label: 'Uống đủ nước (cân nặng × 35 ml)', icon: '💧', cat: 'C',
    tip: '70 kg → 2,450 ml. Tốt nhất chia đều cả ngày',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất nước chỉ 1–2% trọng lượng cơ thể giảm hiệu suất nhận thức 10–15% và hiệu suất thể chất 20–30%. Khát nước là dấu hiệu đã mất nước nhẹ rồi — không nên đợi đến lúc khát mới uống.',
    details: [
      'Công thức cá nhân hóa: cân nặng (kg) × 35 ml = lượng nước cơ bản/ngày. 60kg → 2,100 ml; 70kg → 2,450 ml; 80kg → 2,800 ml. Tăng thêm ~500 ml/giờ vận động mạnh hoặc khi trời nóng.',
      'Nước lọc là tốt nhất. Trà xanh không đường, cà phê (vừa phải), và soup cũng tính vào tổng. Nước ngọt, nước ép có đường KHÔNG tính — chứa calo rỗng và không hydrate hiệu quả.',
      'Chia đều cả ngày tốt hơn uống dồn: 1 ly khi thức dậy, 1 ly trước mỗi bữa ăn, 1 ly mỗi 2 tiếng trong giờ làm, 1 ly nhỏ trước ngủ (không quá nhiều để tránh thức đêm).',
      'Nước tiểu là thước đo tốt nhất và dễ nhất: Vàng nhạt như nước rơm = đủ nước. Trong suốt = có thể uống quá nhiều. Vàng đậm hoặc cam = cần uống thêm ngay.',
      'Uống quá nhiều (>4L/ngày với người ít vận động) có thể gây hạ natri máu (hyponatremia) — hiếm nhưng nguy hiểm. Mục tiêu là "uống đủ", không phải "uống càng nhiều càng tốt".',
      'Nhu cầu tăng khi: sốt (+500ml), ăn nhiều muối hoặc protein cao, đang cho con bú (+700ml), mang thai (+300ml), ngồi điều hòa lạnh nhiều giờ (không khí khô hút ẩm qua da và hơi thở).',
    ],
    points: [
      { icon: '📐', label: 'Công Thức Cá Nhân', note: 'Cân nặng (kg) × 35 ml = mục tiêu hàng ngày của riêng bạn' },
      { icon: '🌡️', label: 'Quan Sát Nước Tiểu', note: 'Vàng nhạt = đủ. Vàng đậm = cần uống thêm ngay' },
      { icon: '⏰', label: 'Chia Đều Cả Ngày', note: 'Uống dồn kém hiệu quả — thận chỉ xử lý ~1L/giờ' },
      { icon: '🚫', label: 'Không Đợi Khát', note: 'Cảm giác khát = đã mất nước nhẹ rồi — uống trước khi khát' },
    ],
  },
  {
    label: 'Chuẩn bị ngủ sớm hơn tối qua', icon: '😴', cat: 'C',
    tip: 'Tắt màn hình 30 phút trước khi ngủ',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thêm 30 phút ngủ/đêm (từ 6.5h → 7h) giảm 24% nguy cơ bệnh tim và 14% nguy cơ tiểu đường theo nghiên cứu 500,000 người UK Biobank. Không cần ngủ hoàn hảo — chỉ cần tiến bộ từng ngày một chút.',
    details: [
      'Mục tiêu không phải "ngủ sớm hơn 1 tiếng ngay" mà là "sớm hơn hôm qua 15–30 phút". Thay đổi đột ngột phá vỡ circadian rhythm. Tiến từ từ 15 phút/ngày hiệu quả và bền vững hơn.',
      'Chuẩn bị môi trường ngủ: tắt đèn lớn → đèn nhỏ 60 phút trước; nhiệt độ phòng 18–20°C; điện thoại cách xa giường; phòng tối nhất có thể (kể cả đèn ngủ nhỏ ảnh hưởng melatonin).',
      '"Không xem điện thoại 30 phút trước ngủ" là quy tắc đơn giản nhất có tác động lớn nhất. Ánh sáng xanh từ màn hình ức chế melatonin (hormone ngủ) hiệu quả như ánh sáng ban ngày.',
      'Wind-down routine 20–30 phút: tắm nước ấm (hạ nhiệt độ cơ thể sau đó kích thích buồn ngủ), đọc sách giấy, nghe nhạc nhẹ, thở chậm. Cùng một routine mỗi đêm → não liên kết routine với ngủ.',
      'Giờ thức dậy cố định quan trọng hơn giờ ngủ: giữ giờ thức cố định kể cả cuối tuần điều chỉnh đồng hồ sinh học. Khi giờ thức cố định, buồn ngủ tự đến đúng giờ sau vài tuần.',
      'Nếu không ngủ được sau 20 phút: dậy ra, đọc sách giấy trong ánh đèn mờ đến khi buồn ngủ thật sự rồi mới nằm lại. Nằm trên giường mà không ngủ được tạo liên kết "giường = lo lắng".',
    ],
    points: [
      { icon: '📅', label: 'Tiến Từng Bước Nhỏ', note: 'Sớm hơn 15 phút mỗi ngày — không nhảy 1 tiếng ngay' },
      { icon: '📵', label: 'Không Điện Thoại 30p', note: 'Ánh sáng xanh ức chế melatonin như ánh mặt trời ban ngày' },
      { icon: '🌡️', label: 'Phòng Mát 18–20°C', note: 'Nhiệt độ là yếu tố môi trường tác động nhất đến chất lượng ngủ' },
      { icon: '⏰', label: 'Giờ Thức Cố Định', note: 'Quan trọng hơn giờ ngủ — kể cả thứ 7 và chủ nhật' },
    ],
  },
  {
    label: 'Dành 3–5 phút thở/chậm lại', icon: '🧘', cat: 'D',
    tip: 'Box breathing 4-4-4-4 hoặc đơn giản là ngồi yên',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở chậm và sâu kích hoạt hệ thần kinh phó giao cảm (rest-and-digest) trong vòng 60–90 giây — phản ứng ngược hoàn toàn với stress. 5 phút thở có chủ đích/ngày giảm cortisol 15–20% sau 4 tuần nhất quán.',
    details: [
      'Box breathing (4-4-4-4): hít vào 4 giây, nín thở 4 giây, thở ra 4 giây, nín thở 4 giây. Lặp 4–6 lần = 1.5–2.5 phút. Kỹ thuật này được Navy SEALs dùng để giữ bình tĩnh trong tình huống áp lực cực cao.',
      '4-7-8 breathing (cho giấc ngủ): hít 4 giây, nín 7 giây, thở ra chậm 8 giây. Tỷ lệ thở ra dài hơn hít vào kích hoạt phản ứng thư giãn mạnh hơn — phù hợp nhất như phần wind-down trước ngủ.',
      'Thở bụng đúng cách: đặt 1 tay lên bụng, 1 tay lên ngực. Hít vào để bụng phình ra, ngực ít di chuyển. Đây là cách thở tự nhiên của trẻ sơ sinh — nhiều người lớn thở ngực nông mà không biết.',
      'Nhất quán quan trọng hơn thời lượng: 5 phút/ngày mỗi ngày hiệu quả hơn 30 phút/tuần vào cuối tuần. Não học nhận ra tín hiệu thư giãn tốt hơn khi được luyện tập đều đặn.',
      'Thời điểm hiệu quả: ngay sau thức dậy trước điện thoại, trước bữa ăn để ăn chậm và tiêu hóa tốt hơn, khi nhận ra stress đang tăng, và như phần wind-down trước khi ngủ.',
      'Đơn giản nhất: ngồi thẳng lưng, nhắm mắt, tập trung vào hơi thở — không cần kỹ thuật đặc biệt. Khi tâm trí phân tâm, nhẹ nhàng đưa về hơi thở. Đây là nền tảng của mọi thực hành thiền định.',
    ],
    points: [
      { icon: '📦', label: 'Box Breathing 4-4-4-4', note: 'Navy SEALs dùng trong tình huống áp lực — bạn cũng dùng được' },
      { icon: '🫁', label: 'Thở Bụng Đúng Cách', note: 'Bụng phình ra khi hít vào — cách thở tự nhiên nhiều người quên' },
      { icon: '⏱️', label: '5 Phút Mỗi Ngày', note: 'Nhất quán quan trọng hơn thời lượng — tích lũy sau 4 tuần' },
      { icon: '🧘', label: 'Bất Kỳ Lúc Nào', note: 'Trước ăn, sau thức dậy, khi stress — không cần thời gian riêng' },
    ],
  },
];

const WEEKLY_TARGETS = [
  {
    label: 'Buổi tập sức mạnh', target: '2–4 buổi', icon: '💪', unit: 'buổi',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '2–4 buổi tập sức mạnh/tuần là ngưỡng tối ưu theo nghiên cứu: đủ để tạo thích nghi cơ học (hypertrophy, sức mạnh) mà không gây overtraining. Dưới 2 buổi thường không đủ kích thích, trên 5 buổi cùng nhóm cơ không có ngày nghỉ gây giảm hiệu quả.',
    details: [
      'Nguyên tắc overload tiệm tiến: cơ thích nghi và phát triển khi bị kích thích vượt ngưỡng hiện tại. Mỗi tuần tăng nhẹ — thêm 1 rep, thêm 1–2kg, hoặc giảm thời gian nghỉ. Không có overload = không có tiến bộ.',
      'Thời điểm tập tốt nhất: chiều muộn (4–7h PM) khi nhiệt độ cơ thể cao nhất, testosterone và cortisol ở mức cân bằng tốt. Buổi sáng cũng ổn — quan trọng là nhất quán hơn là thời điểm hoàn hảo.',
      'Compound movements trước isolation: Squat, deadlift, push-up, row là bài tập đa khớp kích hoạt nhiều nhóm cơ cùng lúc — thực hiện đầu buổi khi năng lượng cao nhất. Curl bắp tay, leg extension là isolation — làm sau.',
      'Rest days giữa các buổi: cơ phát triển trong thời gian nghỉ, không phải lúc tập. 48 giờ nghỉ giữa 2 buổi tập cùng nhóm cơ là tối thiểu. Tập full body: 3 ngày/tuần xen kẽ. Tập split: 4–5 ngày với mỗi nhóm cơ 2×/tuần.',
      'Dấu hiệu tập đủ: cơ mỏi rõ ràng cuối buổi nhưng không kiệt sức, đau nhức nhẹ 24–48h sau (DOMS bình thường), và thấy tiến bộ (dù nhỏ) mỗi 1–2 tuần. Không tiến bộ sau 3 tuần = cần tăng kích thích hoặc kiểm tra dinh dưỡng/ngủ.',
      'Người mới bắt đầu từ 2 buổi/tuần: full body workout 2×/tuần đủ tạo kết quả ấn tượng trong 8–12 tuần đầu vì novice advantage. Tăng lên 3 buổi sau 2 tháng. Không cần tập nhiều hơn 4 buổi trong năm đầu tiên.',
    ],
    points: [
      { icon: '📈', label: 'Overload Tiệm Tiến', note: 'Tăng nhẹ mỗi tuần — không tăng = không tiến bộ' },
      { icon: '💤', label: '48h Nghỉ Giữa Buổi', note: 'Cơ lớn trong thời gian nghỉ — không phải lúc tập' },
      { icon: '🏋️', label: 'Compound Trước Isolation', note: 'Squat/push-up đầu buổi khi năng lượng cao nhất' },
      { icon: '🌱', label: 'Bắt Đầu Từ 2 Buổi', note: 'Novice advantage: kết quả ấn tượng chỉ với 2×/tuần' },
    ],
  },
  {
    label: 'Buổi cardio/đi bộ dài', target: '2–5 buổi', icon: '🚶', unit: 'buổi',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cardio Zone 2 (có thể nói chuyện nhưng hơi khó thở) là cách tốt nhất để tăng sức bền tim mạch, đốt mỡ, và cải thiện trao đổi chất. Đi bộ nhanh 30–60 phút đạt Zone 2 mà không tải nặng lên khớp như chạy bộ.',
    details: [
      'Zone 2 là gì: 60–70% nhịp tim tối đa (HRmax = 220 - tuổi). Ví dụ: 35 tuổi → HRmax = 185 → Zone 2 = 111–130 bpm. Cảm giác: thở hơi nhanh, có thể nói chuyện nhưng không thể hát. Test đơn giản nhất.',
      'Tại sao Zone 2 tốt nhất: kích hoạt ty thể (mitochondria) trong cơ chuyển hóa mỡ thành năng lượng. Đây là nền tảng của mọi vận động viên chuyên nghiệp — họ dành 80% thời gian tập ở Zone 2.',
      'Đi bộ vs chạy bộ: đi bộ nhanh tạo ít tác động lên khớp gối và cổ chân hơn chạy bộ tới 3 lần. Cho người thừa cân, người mới, hoặc người có vấn đề khớp — đi bộ nhanh là lựa chọn cardio lý tưởng.',
      'NEAT (Non-Exercise Activity Thermogenesis): các hoạt động trong ngày (đi lại, leo cầu thang, đứng) đốt 15–50% tổng calo hàng ngày — nhiều hơn 1 buổi tập gym. Tăng bước chân trong ngày đóng góp vào mục tiêu cardio.',
      'Kết hợp sức mạnh và cardio: tập sức mạnh ngày chẵn (Thứ 2, 4, 6), đi bộ dài ngày lẻ (Thứ 3, 5, 7). Hoặc cardio Zone 2 30 phút SAU tập sức mạnh (glycogen đã cạn → đốt mỡ hiệu quả hơn).',
      'Đo tiến bộ: sau 4–8 tuần đi bộ nhất quán, cùng tốc độ nhưng nhịp tim thấp hơn = tim khỏe mạnh hơn. Hoặc: cùng nhịp tim nhưng tốc độ cao hơn. Đây là cải thiện thực sự của aerobic fitness.',
    ],
    points: [
      { icon: '💓', label: 'Zone 2: 60–70% HRmax', note: 'Có thể nói chuyện nhưng không thể hát — đúng cường độ' },
      { icon: '🏃', label: 'Đi Bộ Tốt Như Chạy', note: '3x ít tải khớp hơn chạy — phù hợp mọi người' },
      { icon: '⚡', label: 'NEAT Quan Trọng', note: 'Bước chân cả ngày đốt nhiều calo hơn 1 buổi gym' },
      { icon: '📉', label: 'Nhịp Tim Thấp Hơn Theo Tuần', note: 'Cùng tốc độ, nhịp tim giảm = tim đang khỏe lên' },
    ],
  },
  {
    label: 'Ngày ăn đủ rau', target: '≥ 5 ngày', icon: '🥦', unit: 'ngày',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị ít nhất 400g rau và trái cây/ngày (5 phần). Người Việt Nam trung bình chỉ đạt 60–70% mức này. Rau xanh là thực phẩm duy nhất có mật độ dinh dưỡng cao (vitamins, minerals, fiber, phytochemicals) với mật độ calo thấp — không thể thay thế bằng bất kỳ supplement nào.',
    details: [
      'Tại sao 5 ngày/tuần thay vì 7 ngày: mục tiêu thực tế hơn để duy trì lâu dài. Ăn đủ rau 5 ngày và thực sự duy trì 52 tuần hiệu quả hơn ăn "hoàn hảo" 7 ngày rồi bỏ sau 2 tuần.',
      'Fiber là lý do số 1: 25–38g chất xơ/ngày giảm nguy cơ ung thư đại trực tràng 17%, bệnh tim 24%, và tiểu đường type 2 18%. Rau xanh là nguồn fiber dễ tiếp cận nhất — 100g rau xanh cung cấp 2–4g fiber.',
      'Đa dạng màu sắc = đa dạng phytochemicals: xanh lá (chlorophyll, folate), đỏ/cam (lycopene, beta-carotene), tím (anthocyanins), trắng/vàng (quercetin, allicin). Mỗi màu bảo vệ các cơ quan khác nhau — không có loại rau nào "tốt nhất".',
      'Rau nấu chín vs sống: một số chất dinh dưỡng tăng khi nấu (lycopene trong cà chua, beta-carotene trong cà rốt), một số giảm (vitamin C, folate). Nguyên tắc thực tế: đa dạng cả sống lẫn chín — không cần phân tích quá nhiều.',
      'Cách dễ nhất để ăn đủ rau: thêm rau vào bất kỳ bữa nào đã có sẵn. Trứng chiên thêm cải, phở thêm rau sống, cơm trắng thêm canh rau. Không cần nấu món rau riêng nếu là rào cản.',
      'Rau đông lạnh hoàn toàn hợp lệ: được đông lạnh ngay sau thu hoạch ở đỉnh điểm dinh dưỡng — thường giữ được nhiều vitamin hơn rau tươi đã để qua nhiều ngày. Tiện lợi và rẻ hơn.',
    ],
    points: [
      { icon: '🌈', label: 'Ăn Đủ Màu Sắc', note: 'Mỗi màu rau bảo vệ cơ quan khác nhau — đa dạng là chìa khóa' },
      { icon: '🧵', label: '25–38g Fiber/Ngày', note: 'Rau xanh là nguồn fiber tốt nhất — giảm nguy cơ ung thư 17%' },
      { icon: '❄️', label: 'Rau Đông Lạnh Cũng Tốt', note: 'Đông lạnh ngay sau thu hoạch — thường tốt hơn rau để lâu ngày' },
      { icon: '➕', label: 'Thêm Vào Bữa Có Sẵn', note: 'Không cần nấu riêng — thêm vào trứng, phở, cơm đang có' },
    ],
  },
  {
    label: 'Ngày ngủ ≥ 7 tiếng', target: '≥ 4 ngày', icon: '😴', unit: 'ngày',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngủ đủ 7–9 tiếng/đêm ít nhất 4 ngày/tuần là ngưỡng tối thiểu để ngăn tích lũy "sleep debt". Ngủ không đủ tích lũy — ảnh hưởng đến hormone, trao đổi chất, nhận thức, và hệ miễn dịch theo cách cộng dồn không hồi phục hoàn toàn chỉ bằng ngủ bù.',
    details: [
      'Sleep debt (nợ ngủ) là có thật: mỗi đêm ngủ thiếu 1 tiếng tích lũy thâm hụt chức năng nhận thức. Sau 1 tuần ngủ 6 tiếng/đêm, hiệu suất nhận thức giảm tương đương như thức 24 tiếng liên tục — nhưng người đó cảm thấy bình thường.',
      'Hormone bị ảnh hưởng: leptin (hormone no) giảm 18%, ghrelin (hormone đói) tăng 24% sau chỉ 2 đêm ngủ <6 tiếng. Kết quả: ăn thêm 300–500 kcal/ngày mà không hay. Đây là lý do số 1 nhiều người thất bại khi ăn kiêng nhưng thiếu ngủ.',
      'Giấc ngủ và cơ bắp: 70% GH (growth hormone) được tiết ra trong giai đoạn ngủ sâu (slow-wave sleep). Thiếu ngủ = thiếu GH = cơ phục hồi kém sau tập, tổng hợp protein cơ giảm 18–25%. Tập gym mà ngủ kém = lãng phí.',
      'Circadian rhythm: đồng hồ sinh học điều chỉnh hơn 20,000 gene. Ngủ sai giờ (ngủ ngày, thức khuya bất quy tắc) phá vỡ rhythm này — ngay cả khi tổng số giờ ngủ đủ. Nhất quán giờ ngủ/thức là yếu tố quan trọng nhất.',
      'Melatonin tự nhiên: ánh sáng xanh (màn hình) ức chế melatonin hiệu quả như ánh sáng ban ngày. Tắt màn hình 30–60 phút trước ngủ, hoặc dùng chế độ night mode và giảm độ sáng. Đây là can thiệp đơn giản nhất có tác động lớn nhất.',
      'Nếu không thể ngủ đủ mọi đêm: 4 đêm ≥ 7 tiếng/tuần vẫn đủ để duy trì chức năng tốt. Ưu tiên "không bỏ" hơn là "hoàn hảo". Nếu có 3 ngày ngủ ít (deadline, con ốm), bù bằng ngủ trưa 20 phút trong ngày đó.',
    ],
    points: [
      { icon: '💸', label: 'Sleep Debt Tích Lũy', note: 'Mỗi đêm thiếu 1 tiếng cộng dồn — không hồi phục bằng ngủ bù' },
      { icon: '🍔', label: 'Thiếu Ngủ = Đói Hơn', note: 'Leptin -18%, Ghrelin +24% → +300–500 kcal/ngày' },
      { icon: '💪', label: 'GH Tiết Ban Đêm', note: '70% tăng trưởng cơ xảy ra khi ngủ — tập mà thiếu ngủ = lãng phí' },
      { icon: '⏰', label: 'Nhất Quán Giờ Thức', note: 'Cố định giờ dậy kể cả cuối tuần — quan trọng hơn giờ ngủ' },
    ],
  },
  {
    label: 'Ngày có calm practice', target: '≥ 4 ngày', icon: '🧘', unit: 'ngày',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Calm practice (thực hành bình tâm) — bất kỳ hoạt động nào có chủ đích làm chậm hệ thần kinh: thở, thiền, đi bộ không điện thoại, viết nhật ký, đọc sách giấy. 5–10 phút/ngày × 4 ngày/tuần nhất quán giảm cortisol đo được và tăng HRV sau 4 tuần.',
    details: [
      'Định nghĩa rộng của calm practice: không nhất thiết phải ngồi thiền theo kiểu truyền thống. Bất kỳ hoạt động nào kích hoạt hệ thần kinh phó giao cảm có chủ đích — thở chậm, thiền, yoga, đi bộ trong thiên nhiên không xem điện thoại, tắm nước ấm có ý thức.',
      'Chronically elevated cortisol: stress kéo dài (không có calm practice) giữ cortisol cao liên tục — gây tích trữ mỡ bụng, giảm testosterone, suy giảm miễn dịch, và làm mòn hippocampus (trí nhớ). Calm practice là "hạ cortisol theo lịch".',
      'HRV (Heart Rate Variability) là chỉ số đo được: calm practice tăng HRV — khoảng dao động nhịp tim giữa các nhịp đập. HRV cao = hệ thần kinh linh hoạt, phục hồi tốt, stress thấp. Đo bằng nhiều smartwatch/app miễn phí.',
      'Thiền 5 phút đủ: nghiên cứu Harvard cho thấy 8 tuần thiền 27 phút/ngày thay đổi cấu trúc não (amygdala nhỏ lại, cortex trước lớn hơn). Nhưng ngay cả 5 phút/ngày cũng đủ để giảm stress và cải thiện tập trung nếu nhất quán.',
      'Đi bộ không điện thoại: Default Mode Network (mạng lưới não khi không tập trung vào nhiệm vụ cụ thể) cần thời gian "offline" để xử lý thông tin, tổng hợp ký ức, và sáng tạo. Scroll điện thoại chiếm mất thời gian DMN quan trọng này.',
      'Xây dựng thói quen: gắn calm practice với anchor habit đã có (sau cà phê sáng, trước bữa tối, sau đánh răng tối). 5 phút đủ để bắt đầu. Không cần app, không cần hướng dẫn viên — chỉ cần ngồi yên và chú ý vào hơi thở.',
    ],
    points: [
      { icon: '🌊', label: 'Bất Kỳ Hoạt Động Nào', note: 'Thở, thiền, đi bộ — miễn là có chủ đích và tắt điện thoại' },
      { icon: '📊', label: 'Đo Bằng HRV', note: 'Smartwatch đo được — HRV tăng sau 4 tuần nhất quán' },
      { icon: '🧠', label: 'Hạ Cortisol Mãn Tính', note: 'Cortisol cao liên tục = mỡ bụng + suy giảm miễn dịch' },
      { icon: '⚓', label: 'Gắn Với Anchor Habit', note: 'Sau cà phê sáng hoặc trước ngủ — giảm ma sát quyết định' },
    ],
  },
  {
    label: 'Ngày ghi nhật ký', target: '≥ 5 ngày', icon: '📝', unit: 'ngày',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Journaling (ghi nhật ký) là công cụ tâm lý được nghiên cứu nhiều nhất với chi phí bằng 0. 15–20 phút viết về cảm xúc và suy nghĩ × 3–5 ngày/tuần cải thiện sức khỏe tâm thần, giảm triệu chứng lo âu và trầm cảm, và tăng khả năng xử lý stress theo nghiên cứu của James Pennebaker (UT Austin).',
    details: [
      'Expressive writing (viết biểu đạt): viết về cảm xúc và suy nghĩ (không chỉ sự kiện) giúp não "mã hóa" và xử lý trải nghiệm khó khăn. Prefrontal cortex (lý trí) kiểm soát amygdala (cảm xúc) tốt hơn khi được luyện tập qua viết.',
      'Nhật ký biết ơn (gratitude journaling): viết 3 điều biết ơn mỗi ngày trong 3 tuần tăng mức độ hạnh phúc 25% và giảm triệu chứng trầm cảm 23% (nghiên cứu Martin Seligman). Não tìm kiếm những gì nó tập trung vào — viết biết ơn thay đổi bộ lọc chú ý.',
      'Morning Pages (Julia Cameron): 3 trang viết tay ngay sau khi thức dậy, không lọc, không chỉnh sửa. Mục tiêu là "xả" các suy nghĩ lặp đi lặp lại ra khỏi đầu để não sạch hơn cho ngày mới. Không cần hay, không cần đọc lại.',
      'Nhật ký tập luyện: ghi lại workout mỗi buổi tạo accountability và dễ theo dõi overload tiệm tiến. Người ghi nhật ký tập luyện đạt mục tiêu fitness nhanh hơn 40% theo nghiên cứu 2019 (Journal of Medical Internet Research).',
      'Ghi 1 dòng cũng đủ: không cần viết cả trang mỗi ngày. "Hôm nay tôi cảm thấy..." + 1–2 câu là đủ để kích hoạt lợi ích tâm lý. Bắt đầu nhỏ → duy trì lâu dài quan trọng hơn viết nhiều nhưng không nhất quán.',
      'Kỹ thuật review: cuối tuần đọc lại nhật ký tuần đó trong 5 phút. Nhận ra pattern (ngày nào tâm trạng tốt/tệ, tại sao), điều chỉnh tuần sau. Đây là cơ chế feedback loop mạnh nhất để cải thiện chất lượng cuộc sống.',
    ],
    points: [
      { icon: '🧠', label: 'Prefrontal Kiểm Soát Amygdala', note: 'Viết về cảm xúc giúp lý trí điều tiết cảm xúc tốt hơn' },
      { icon: '🙏', label: 'Biết Ơn 3 Điều/Ngày', note: '+25% hạnh phúc sau 3 tuần — thay đổi bộ lọc chú ý của não' },
      { icon: '1️⃣', label: '1 Dòng Cũng Đủ', note: 'Nhất quán quan trọng hơn độ dài — bắt đầu thật nhỏ' },
      { icon: '🔄', label: 'Review Cuối Tuần', note: 'Đọc lại 5 phút → nhận ra pattern → điều chỉnh tuần sau' },
    ],
  },
];

const REVIEW_QS = [
  'Điều gì hoạt động tốt tuần này?',
  'Điều gì khó nhất và vì sao?',
  'Tuần sau cần thay đổi gì?',
  'Mức năng lượng tổng thể tuần này (1–10)?',
];

const LS_DAILY = 'healthapp_f_daily';
const LS_WEEKLY = 'healthapp_f_weekly';
const LS_REVIEW = 'healthapp_f_review';

function WeeklyModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = WEEKLY_TARGETS[idx];
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
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Mục tiêu hàng tuần</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.icon} {item.label}</h2>
          <p className="text-sm font-semibold mb-5" style={{ color: `rgba(${item.rgb},0.7)` }}>Mục tiêu: {item.target}</p>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
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
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {WEEKLY_TARGETS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function DailyCard({ item, idx, checked, onToggle, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const { color, rgb } = CAT_COLORS[item.cat];
  const isDone = checked.includes(idx);
  return (
    <div className="flex items-stretch rounded-2xl border bg-surface overflow-hidden transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${rgb},0.45)` : isDone ? `rgba(${rgb},0.3)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 18px rgba(${rgb},0.1)` : 'none' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Checkbox zone */}
      <button onClick={() => onToggle(idx)}
        className="flex items-center justify-center px-4 shrink-0 border-r border-white/5 transition-colors"
        style={{ background: isDone ? `rgba(${rgb},0.1)` : 'transparent' }}>
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={isDone ? { background: color, borderColor: color } : { borderColor: 'rgba(255,255,255,0.25)' }}>
          {isDone && <span className="text-white text-[10px] font-black leading-none">✓</span>}
        </div>
      </button>
      {/* Content zone — click opens modal */}
      <button onClick={() => onOpen(idx)} className="flex-1 flex items-center gap-3 py-3 px-4 text-left cursor-pointer">
        <span className="text-xl shrink-0">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>{item.label}</span>
          <p className="text-xs text-muted mt-0.5 truncate">{item.tip}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ color: '#0a0a0a', background: color }}>{item.cat}</span>
          <span className="text-[10px]" style={{ color: `rgba(${rgb},0.5)` }}>Chi tiết →</span>
        </div>
      </button>
    </div>
  );
}

function DailyModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { color, rgb } = CAT_COLORS[item.cat];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#0a0a0a', background: color }}>Trụ Cột {item.cat}</span>
          </div>
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color }}>{item.label}</h2>

          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: color, background: `rgba(${rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
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
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
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

export default function ToolsChecklistPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [daily, setDaily] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(LS_DAILY) || '{}'); return s[today] || []; } catch { return []; }
  });
  const [weekly, setWeekly] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_WEEKLY) || '{}'); } catch { return {}; }
  });
  const [review, setReview] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_REVIEW) || '{}'); } catch { return {}; }
  });
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dailyModal, setDailyModal] = useState(null);
  const [weeklyModal, setWeeklyModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-cl-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fClOrbitSpin { to { --f-cl-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-cl-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fClOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const toggleDaily = (idx) => {
    const next = daily.includes(idx) ? daily.filter(i => i !== idx) : [...daily, idx];
    setDaily(next);
    const all = JSON.parse(localStorage.getItem(LS_DAILY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_DAILY, JSON.stringify(all));
  };

  const setWeeklyVal = (idx, val) => {
    const n = { ...weekly, [idx]: val };
    setWeekly(n);
    localStorage.setItem(LS_WEEKLY, JSON.stringify(n));
  };

  const setReviewVal = (idx, val) => {
    const n = { ...review, [idx]: val };
    setReview(n);
    localStorage.setItem(LS_REVIEW, JSON.stringify(n));
  };

  const dailyPct = Math.round((daily.length / DAILY_ITEMS.length) * 100);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Checklist Ngày &amp; Tuần</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            6 mục hàng ngày · 6 chỉ tiêu hàng tuần · Review cuối tuần
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Checklist tối giản giúp bạn duy trì 6 hành vi quan trọng nhất mỗi ngày. Mỗi tick là một bước nhỏ xây dựng thói quen bền vững.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Checklist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            6 hành vi · mỗi ngày · không quá 5 phút để tick
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Daily checklist */}
      <RevealBlock delay={0} className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Checklist Hôm Nay</h2>
          <span className="text-lg font-bold" style={{ color: COLOR }}>{daily.length}/{DAILY_ITEMS.length} mục</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-border mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dailyPct}%`, background: COLOR }} />
        </div>
        <div className="space-y-2">
          {DAILY_ITEMS.map((item, i) => (
            <DailyCard key={i} item={item} idx={i} checked={daily} onToggle={toggleDaily} onOpen={setDailyModal} />
          ))}
        </div>
        {daily.length === DAILY_ITEMS.length && (
          <div className="mt-4 p-4 rounded-2xl text-center" style={{ background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.3)` }}>
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-bold text-lg" style={{ color: COLOR }}>Hoàn thành checklist ngày hôm nay! Tuyệt vời.</div>
          </div>
        )}
      </RevealBlock>

      {/* Weekly tracker */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Tracker Hàng Tuần</h2>
        <p className="text-muted text-lg mb-6">Nhập số liệu thực tế tuần này. Không cần hoàn hảo — chỉ cần trung thực.</p>
        <div className="space-y-3">
          {WEEKLY_TARGETS.map((item, i) => (
            <div key={i} className="rounded-2xl border bg-surface p-4 transition-colors duration-200 group"
              style={{ borderColor: weeklyModal === i ? `rgba(${item.rgb},0.45)` : 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setWeeklyModal(i)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-200 hover:scale-110"
                  style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
                  {item.icon}
                </button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setWeeklyModal(i)}>
                  <div className="text-base font-medium text-text leading-tight">{item.label}</div>
                  <div className="text-xs text-muted">Mục tiêu: {item.target}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number" min="0" max="7"
                    value={weekly[i] ?? ''}
                    onChange={e => setWeeklyVal(i, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder="0"
                    className="w-16 text-center px-2 py-1.5 rounded-xl text-lg font-bold border bg-transparent"
                    style={{ borderColor: `rgba(${item.rgb},0.3)`, color: item.color }}
                  />
                  <button onClick={() => setWeeklyModal(i)}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 opacity-0 group-hover:opacity-100 shrink-0"
                    style={{ color: item.color, background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
                    Chi tiết →
                  </button>
                </div>
              </div>
              <div className="text-xs text-muted text-right">{item.unit} đã thực hiện</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Weekly review */}
      <RevealBlock delay={2} className="mb-12">
        <button onClick={() => setReviewOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:bg-white/5 transition-colors">
          <div>
            <div className="font-bold text-text text-left">Review Cuối Tuần</div>
            <div className="text-base text-muted mt-0.5">4 câu hỏi · ~5 phút · cải thiện tuần sau</div>
          </div>
          <span className="text-muted">{reviewOpen ? '▲' : '▼'}</span>
        </button>
        {reviewOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-surface p-5 space-y-4">
            {REVIEW_QS.map((q, i) => (
              <div key={i}>
                <label className="text-lg font-medium text-text block mb-2">{i + 1}. {q}</label>
                <textarea
                  value={review[i] ?? ''}
                  onChange={e => setReviewVal(i, e.target.value)}
                  rows={2}
                  placeholder="Nhập câu trả lời..."
                  className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }}
                />
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* Tips */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3" style={{ color: COLOR }}>💡 Tips Sử Dụng Checklist</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Tick checklist vào buổi tối trước khi ngủ, không cần tick ngay khi làm</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Mục tiêu là ≥ 5/6 mỗi ngày. 6/6 mỗi ngày là không thực tế lâu dài</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Nếu liên tục bỏ 1 mục — đó là tín hiệu cần điều chỉnh, không phải thất bại</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Review tuần là thời điểm để học hỏi, không phải để chỉ trích bản thân</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {dailyModal !== null && (
        <DailyModal
          item={DAILY_ITEMS[dailyModal]}
          idx={dailyModal}
          total={DAILY_ITEMS.length}
          onClose={() => setDailyModal(null)}
          onPrev={() => setDailyModal(i => Math.max(0, i - 1))}
          onNext={() => setDailyModal(i => Math.min(DAILY_ITEMS.length - 1, i + 1))}
          hasPrev={dailyModal > 0}
          hasNext={dailyModal < DAILY_ITEMS.length - 1}
        />
      )}
      {weeklyModal !== null && (
        <WeeklyModal
          idx={weeklyModal}
          onClose={() => setWeeklyModal(null)}
          onPrev={() => setWeeklyModal(i => Math.max(0, i - 1))}
          onNext={() => setWeeklyModal(i => Math.min(WEEKLY_TARGETS.length - 1, i + 1))}
          hasPrev={weeklyModal > 0}
          hasNext={weeklyModal < WEEKLY_TARGETS.length - 1}
        />
      )}
    </div>
  );
}
