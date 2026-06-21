import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'e-sm-orbit-kf';
const ORBIT_CLASS = 'e-sm-orbit-ring';
const ORBIT_PROP = '--e-sm-orbit-angle';

const METRICS = [
  {
    num: '01', icon: '⚖️', label: 'Cân nặng', freq: 'Hàng tuần',
    when: 'Sáng, sau vệ sinh, trước ăn', tool: 'Cân sức khỏe',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&q=80',
    note: 'Cân cùng điều kiện mỗi lần. Dao động 1–2kg/ngày là bình thường do nước.',
    keyFact: '⚖️ Cân nặng là chỉ số dễ đo nhất nhưng cũng dễ hiểu sai nhất. Sự thay đổi thực sự của mỡ/cơ chỉ có thể thấy qua xu hướng 2–4 tuần, không phải từng ngày. Dao động 1–2kg trong ngày hoàn toàn bình thường do nước, thức ăn, và thời điểm đo.',
    details: [
      'Điều kiện đo chuẩn: luôn đo vào cùng thời điểm — tốt nhất là buổi sáng sau khi vệ sinh và trước khi ăn uống. Mặc cùng lượng quần áo (hoặc không mặc). Đứng trên cân với tư thế thẳng, phân bố đều trọng lượng. Đặt cân trên sàn cứng, phẳng — không đặt trên thảm (sai số cao). Đo 1 lần/tuần là đủ để theo dõi xu hướng mà không bị ám ảnh bởi dao động ngày.',
      'Tại sao cân nặng dao động mạnh trong ngày: nước chiếm 60% cơ thể — uống 500ml nước = tăng 0.5kg tức thì. Glycogen (đường dự trữ trong cơ) giữ 3–4g nước mỗi g glycogen: ăn nhiều carb → tăng cân tức thì do nước. Muối: ăn nhiều muối → giữ nước → tăng cân. Phụ nữ: chu kỳ kinh nguyệt gây giữ nước đến 2–3kg. Tất cả những dao động này không liên quan đến mỡ cơ thể thực sự.',
      'Cân nặng vs mỡ cơ thể — không phải lúc nào cũng cùng hướng: tập thể hình trong khi ăn đủ protein → cơ tăng, mỡ giảm, nhưng cân có thể không đổi hoặc tăng nhẹ (cơ nặng hơn mỡ). Người giảm ăn cực đoan → cân giảm nhanh nhưng mất cả cơ lẫn mỡ — không lý tưởng. Theo dõi đồng thời vòng eo/vòng hông/% mỡ cơ thể cho bức tranh đầy đủ hơn chỉ cân nặng.',
      'BMI — hữu ích nhưng có giới hạn: BMI = cân(kg) / chiều cao(m)². Phân loại WHO: gầy < 18.5, bình thường 18.5–24.9, thừa cân 25–29.9, béo phì ≥ 30. Giới hạn của BMI: không phân biệt cơ và mỡ (vận động viên có BMI cao nhưng % mỡ thấp), không cho biết phân bố mỡ (mỡ bụng nguy hiểm hơn mỡ đùi). Người châu Á: ngưỡng nguy cơ thực tế thấp hơn — thừa cân từ BMI > 23, béo phì từ BMI > 27.5.',
      'Mục tiêu cân nặng thực tế: giảm 0.5–1kg/tuần là tốc độ lành mạnh và bền vững — tương ứng thâm hụt 500–1.000 kcal/ngày. Nhanh hơn thường nghĩa là mất cơ và nước, không chỉ mỡ. Nghiên cứu cho thấy: những người giảm chậm (0.5–1kg/tuần) duy trì kết quả lâu hơn so với giảm nhanh. Weight set point theory: cơ thể có "điểm neo" cân nặng — tăng rồi giảm trong vòng 6 tháng có thể reset về mức cũ.',
      'Cân thông minh và app theo dõi: Xiaomi Mi Body Composition Scale, Withings Body+, Garmin Index S2 đo thêm % mỡ/cơ/nước qua điện trở sinh học (bioelectrical impedance). Độ chính xác: kém hơn DEXA scan nhưng đủ để theo dõi xu hướng. App: Apple Health, Google Fit, Happy Scale (iOS) — tự động tính đường xu hướng từ các điểm dữ liệu ngày, lọc bỏ nhiễu dao động. Lý tưởng: đo 3–7 ngày/tuần, để app tính xu hướng, không nhìn số hàng ngày.',
    ],
    points: [
      { icon: '📉', label: 'Xu hướng 2–4 tuần mới phản ánh thay đổi thực sự', note: 'Dao động 1–2kg/ngày là bình thường — đừng lo lắng từng ngày' },
      { icon: '🕐', label: 'Đo cùng thời điểm mỗi lần — sáng sau vệ sinh, trước ăn', note: 'Thay đổi giờ đo có thể sai lệch đến 2kg do nước và thức ăn' },
      { icon: '💪', label: 'Tập gym → cơ tăng, mỡ giảm, cân có thể không đổi', note: 'Đo vòng eo và % mỡ để có bức tranh đầy đủ hơn chỉ số cân' },
      { icon: '🎯', label: 'Mục tiêu lành mạnh: giảm 0.5–1kg/tuần', note: 'Nhanh hơn thường đồng nghĩa mất cơ — không bền vững' },
    ],
  },
  {
    num: '02', icon: '🩺', label: 'Huyết áp', freq: 'Hàng ngày (nếu có vấn đề) hoặc hàng tuần',
    when: 'Sáng và tối, sau nghỉ 5 phút', tool: 'Máy đo HA tự động',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    note: 'Ghi lại cả hai lần đo. Trung bình 7 ngày mới phản ánh đúng tình trạng.',
    keyFact: '🩺 Huyết áp cao là "kẻ giết người thầm lặng" — thường không có triệu chứng cho đến khi gây đột quỵ hoặc nhồi máu cơ tim. Theo dõi tại nhà chính xác hơn đo ở phòng khám (tránh "white coat hypertension") và giúp phát hiện sớm trước khi cần thuốc.',
    details: [
      'Đọc kết quả huyết áp đúng cách: huyết áp gồm 2 con số — tâm thu/tâm trương (systolic/diastolic). Ví dụ: 120/80 mmHg. Tâm thu (số trên): áp lực khi tim bơm máu. Tâm trương (số dưới): áp lực khi tim nghỉ. Phân loại AHA/ACC (2017): Bình thường < 120/80; Ngưỡng cao 120–129/<80; Tăng HA độ 1: 130–139/80–89; Tăng HA độ 2: ≥ 140/90; Khủng hoảng HA: > 180/120 (cần cấp cứu ngay).',
      'Kỹ thuật đo chuẩn — tại sao quan trọng: nghỉ ngơi yên tĩnh 5 phút trước khi đo (không tập thể dục, không uống cà phê 30 phút trước). Ngồi thẳng, lưng tựa, chân đặt phẳng xuống sàn (không bắt chéo chân). Cánh tay đặt ngang tầm tim — dùng bàn đỡ, không giữ bằng tay. Băng đo phải đúng kích cỡ (băng quá nhỏ → kết quả cao giả). Không nói chuyện khi đo. Đo 2 lần, cách nhau 1 phút — ghi cả hai, lấy trung bình.',
      'White coat hypertension và masked hypertension: white coat hypertension — HA bình thường ở nhà nhưng cao khi đến phòng khám do lo lắng. Tỷ lệ gặp: ~15–30% bệnh nhân. Giải pháp: theo dõi HA tại nhà. Masked hypertension — HA bình thường tại phòng khám nhưng cao ở nhà/nơi làm việc. Nguy hiểm vì không được phát hiện và điều trị. Theo dõi HA 24 giờ (ABPM) là tiêu chuẩn vàng để phân biệt.',
      'Yếu tố ảnh hưởng HA cần biết: muối — giảm 2.3g/ngày giảm HA tâm thu ~4–5 mmHg. Rượu bia — > 2 đơn vị/ngày tăng HA. Thuốc lá — hút 1 điếu tăng HA trong 30 phút. Cà phê — có thể tăng HA tạm thời 3–4 mmHg ở người nhạy cảm. Stress — tăng HA tạm thời (cortisol). Vận động đều đặn — giảm HA tâm thu 5–8 mmHg sau 8–12 tuần (hiệu quả tương đương thuốc nhẹ). Ngủ đủ giấc — thiếu ngủ tăng HA mãn tính.',
      'Huyết áp tư thế (orthostatic hypotension): đứng dậy đột ngột → HA giảm ≥ 20 mmHg tâm thu hoặc ≥ 10 mmHg tâm trương → chóng mặt, ngã. Gặp ở người cao tuổi, người dùng thuốc hạ áp, mất nước. Cách phát hiện: đo HA nằm sau nghỉ 5 phút, đứng dậy và đo lại sau 1 và 3 phút. Giải pháp: đứng dậy từ từ, uống đủ nước, mang vớ y tế nếu cần.',
      'Khi nào cần gặp bác sĩ: HA thường xuyên ≥ 130/80 mmHg trong 2 tuần. HA > 180/120 mmHg (khủng hoảng — gọi cấp cứu ngay kể cả không có triệu chứng). Huyết áp biến thiên nhiều (chênh lệch > 20 mmHg giữa 2 lần đo liên tiếp, không rõ nguyên nhân). Kết hợp với: đau đầu dữ dội, khó thở, đau ngực, mờ mắt, tê yếu tay chân — dấu hiệu biến chứng nghiêm trọng.',
    ],
    points: [
      { icon: '📊', label: 'Trung bình 7 ngày phản ánh HA thực hơn 1 lần đo', note: 'Ghi cả 2 lần đo (sáng + tối) — lấy trung bình để loại nhiễu' },
      { icon: '🪑', label: 'Ngồi nghỉ 5 phút trước khi đo — không cà phê/tập thể dục 30 phút', note: 'Sai kỹ thuật có thể gây sai số đến 10–15 mmHg' },
      { icon: '🏃', label: 'Vận động đều đặn giảm HA tâm thu 5–8 mmHg — bằng thuốc nhẹ', note: 'Giảm muối 2.3g/ngày giảm thêm 4–5 mmHg — can thiệp lối sống đủ mạnh' },
      { icon: '🚨', label: 'HA > 180/120: gọi cấp cứu ngay — dù không có triệu chứng', note: 'Nguy cơ đột quỵ và nhồi máu cơ tim cấp trong vòng giờ' },
    ],
  },
  {
    num: '03', icon: '🩸', label: 'Đường huyết', freq: 'Hàng ngày (tiểu đường) hoặc hàng tháng',
    when: 'Lúc đói và sau ăn 2h', tool: 'Máy đo đường huyết',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1588776814546-ec7e32bef62b?w=800&q=80',
    note: 'Theo dõi xu hướng quan trọng hơn một con số đơn lẻ.',
    keyFact: '🩸 Đường huyết không chỉ quan trọng với người tiểu đường — theo dõi đường huyết giúp tất cả mọi người hiểu cơ thể phản ứng với thức ăn như thế nào. Tiền tiểu đường (prediabetes) thường không có triệu chứng — phát hiện sớm qua xét nghiệm là cách duy nhất.',
    details: [
      'Ngưỡng đường huyết cần biết: đường huyết đói (nhịn ăn 8h): Bình thường < 100 mg/dL (< 5.6 mmol/L); Tiền tiểu đường 100–125 mg/dL; Tiểu đường ≥ 126 mg/dL (2 lần đo). Đường huyết sau ăn 2h: Bình thường < 140 mg/dL; Tiền tiểu đường 140–199 mg/dL; Tiểu đường ≥ 200 mg/dL. HbA1c (trung bình 2–3 tháng): Bình thường < 5.7%; Tiền tiểu đường 5.7–6.4%; Tiểu đường ≥ 6.5%.',
      'Cách đo đường huyết tại nhà: rửa tay sạch, lau khô — không dùng cồn (có thể gây sai số). Lấy máu từ đầu ngón tay (cạnh ngón, không phải đầu ngón — ít đau hơn). Giọt máu đầu tiên lau đi — giọt thứ hai dùng để đo (máu không bị pha loãng bởi dịch mô). Để máy và que thử ở nhiệt độ phòng (không bảo quản trong tủ lạnh). Ghi ngay giờ đo và tình trạng (đói/sau ăn). Hiệu chỉnh máy định kỳ.',
      'CGM (Continuous Glucose Monitor) — theo dõi liên tục: Freestyle Libre, Dexcom G7 — cảm biến dán vào cánh tay, đo đường huyết mô kẽ 24/7 qua NFC/Bluetooth. Lợi ích: thấy rõ cách từng bữa ăn, tập thể dục, stress, giấc ngủ ảnh hưởng đường huyết theo thời gian thực. Không cần chích ngón tay. Nhược điểm: đắt (~500.000–2.000.000 VNĐ/14 ngày), đo mô kẽ nên lag ~15 phút so với máu. Tại VN: có tại BV lớn và một số nhà thuốc chuyên khoa.',
      'Tiền tiểu đường — cơ hội vàng để đảo ngược: 96 triệu người Mỹ có tiền tiểu đường — 80% không biết. Tại VN: ước tính 14–20% người trưởng thành (8–12 triệu người). Tiền tiểu đường KHÔNG tự biến mất — 25–30% tiến triển thành tiểu đường trong 3–5 năm nếu không can thiệp. Nhưng: DPP (Diabetes Prevention Program): thay đổi lối sống (giảm 7% cân nặng + 150 phút/tuần vận động vừa) giảm 58% nguy cơ tiến triển — hiệu quả hơn cả Metformin (giảm 31%).',
      'Chỉ số GI (Glycemic Index) và GL (Glycemic Load): GI đo tốc độ tăng đường huyết sau ăn. Cùng lượng carb nhưng GI khác nhau. GI thấp (< 55): yến mạch, đậu, hầu hết rau, sữa chua. GI trung bình (55–70): gạo trắng, bánh mì trắng, khoai tây luộc. GI cao (> 70): bánh mì trắng, gạo nếp, đồ uống ngọt. GL = GI × gram carb / 100 — thực tế hơn GI. Cà rốt có GI cao nhưng GL thấp vì lượng carb ít trong một khẩu phần bình thường.',
      'Theo dõi HbA1c định kỳ — quan trọng hơn đường huyết tức thời: HbA1c đo % hemoglobin gắn đường — phản ánh đường huyết trung bình 2–3 tháng, không bị ảnh hưởng bởi bữa ăn hôm đó hay stress thoáng qua. Khuyến nghị xét nghiệm: người nguy cơ cao (thừa cân, gia đình có tiểu đường, tăng HA, lipid bất thường) từ 35 tuổi, mỗi 3 năm. Người đã có tiểu đường: HbA1c mỗi 3 tháng (nếu chưa kiểm soát tốt) hoặc mỗi 6 tháng (nếu ổn định).',
    ],
    points: [
      { icon: '📋', label: 'Tiền tiểu đường: 80% không biết — xét nghiệm mỗi 3 năm từ 35t', note: 'Thay đổi lối sống giảm 58% nguy cơ tiến triển — hiệu quả hơn thuốc' },
      { icon: '⏰', label: 'Đo đúng thời điểm: đói 8h và sau ăn 2h — 2 điểm đủ đánh giá', note: 'HbA1c mỗi 3–6 tháng phản ánh trung bình 3 tháng — chính xác hơn' },
      { icon: '🥗', label: 'GI thấp: yến mạch, đậu, rau xanh — ưu tiên để ổn định đường huyết', note: 'GL quan trọng hơn GI — xem xét cả lượng carb trong khẩu phần' },
      { icon: '📱', label: 'CGM (Freestyle Libre): theo dõi đường huyết 24/7 không cần chích', note: 'Thấy ngay cách từng bữa ăn và bài tập ảnh hưởng đường huyết' },
    ],
  },
  {
    num: '04', icon: '❤️', label: 'Nhịp tim nghỉ ngơi', freq: 'Hàng tuần',
    when: 'Ngay khi thức dậy, trước khi ra khỏi giường', tool: 'Đồng hồ thông minh hoặc đếm tay',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
    note: '60–100 lần/phút bình thường. Tập thể thao đều → nhịp tim nghỉ giảm.',
    keyFact: '❤️ Nhịp tim nghỉ ngơi (resting heart rate — RHR) là một trong những chỉ số đơn giản nhất nhưng phản ánh sức khỏe tim mạch tổng thể tốt nhất. Nghiên cứu HUNT: RHR tăng từ 70 lên 85 lần/phút tăng 18% nguy cơ tử vong tim mạch ở nam và 19% ở nữ. Vận động viên elite có RHR 40–50 lần/phút.',
    details: [
      'Ngưỡng bình thường và ý nghĩa: bình thường: 60–100 lần/phút. Nhịp tim chậm (bradycardia): < 60 lần/phút — thường gặp ở vận động viên và người tập thể thao đều đặn (lành mạnh). < 60 lần/phút ở người ít vận động + chóng mặt/ngất: cần kiểm tra. Nhịp tim nhanh (tachycardia): > 100 lần/phút lúc nghỉ — có thể do căng thẳng, thiếu nước, bệnh lý tuyến giáp, thiếu máu, hoặc bệnh tim. Mỗi 10 lần/phút giảm trong RHR = cải thiện thể lực tim mạch đáng kể.',
      'Cách đo thủ công: đặt 2 ngón tay (trỏ + giữa) lên cổ tay (mặt trong, phía ngón cái) hoặc cổ (động mạch cảnh, bên cạnh khí quản). Đếm số nhịp trong 60 giây (chính xác nhất) hoặc 30 giây × 2. Đo ngay khi thức dậy, trước khi ngồi dậy — đây là thời điểm RHR thực sự nhất. Không đo sau khi đi vệ sinh, uống cà phê, hoặc đã hoạt động — sẽ bị sai lệch cao hơn thực tế.',
      'RHR và fitness level: nghiên cứu Copenhagen Male Study (5.000 nam, 16 năm): RHR 71–80 lần/phút tăng 51% nguy cơ tử vong mọi nguyên nhân so với < 50 lần/phút. Tại sao tim khỏe có RHR thấp: tim mạnh bơm nhiều máu hơn mỗi nhịp (cardiac output cao → cần ít nhịp hơn để cung cấp đủ máu). Chạy bộ 30 phút/ngày × 12 tuần có thể giảm RHR 5–7 lần/phút. Tập HIIT hiệu quả hơn cardio nhẹ nhàng trong việc giảm RHR.',
      'HRV (Heart Rate Variability) — chỉ số tiên tiến hơn: HRV đo sự biến thiên khoảng cách giữa các nhịp tim (không phải RHR). HRV cao = hệ thần kinh tự chủ khỏe mạnh, cơ thể phục hồi tốt. HRV thấp = stress cao, mệt mỏi, nguy cơ bệnh lý. Đo được bằng: Apple Watch, Garmin, Whoop, Oura Ring. HRV thay đổi nhiều theo tuổi, trạng thái, và cá nhân — cần theo dõi xu hướng cá nhân, không so sánh với người khác.',
      'Nhịp tim tăng đột ngột — dấu hiệu cần chú ý: RHR tăng 5–7 lần/phút so với baseline có thể báo hiệu: đang ủ bệnh (trước khi triệu chứng xuất hiện 12–24h), cơ thể chưa phục hồi đủ sau tập luyện, mất nước nặng, hoặc nhiễm trùng. App Garmin/Whoop/Oura sử dụng thuật toán phát hiện "điểm bất thường" trong RHR và HRV để cảnh báo người dùng. Covid-19: nhiều người ghi nhận RHR tăng 5–10 lần/phút trước khi có triệu chứng.',
      'Nhịp tim mục tiêu khi tập thể dục: vùng nhịp tim = (220 - tuổi) × %: Vùng 1 (phục hồi, 50–60%): đi bộ nhẹ. Vùng 2 (aerobic cơ bản, 60–70%): nói chuyện được thoải mái — đây là vùng đốt mỡ và xây dựng nền aerobic. Vùng 3 (aerobic, 70–80%): nói chuyện khó. Vùng 4 (ngưỡng lactate, 80–90%): HIIT, chạy nhanh. Vùng 5 (tối đa, 90–100%): bùng nổ ngắn. Người mới bắt đầu: chủ yếu ở Vùng 2. Vận động viên: phối hợp nhiều vùng.',
    ],
    points: [
      { icon: '📉', label: 'Mỗi 10 lần/phút giảm trong RHR = cải thiện sức khỏe tim đáng kể', note: 'Vận động viên: RHR 40–50 lần/phút. Mục tiêu thực tế: giảm 5–10 lần/phút' },
      { icon: '🌅', label: 'Đo ngay khi thức dậy, trước khi đứng dậy — kết quả chuẩn nhất', note: 'Sau cà phê, đi vệ sinh, hay vận động: RHR tăng 5–20 lần/phút' },
      { icon: '📱', label: 'HRV: chỉ số tiên tiến hơn RHR — biến thiên cao = phục hồi tốt', note: 'Apple Watch, Garmin, Oura Ring đo HRV tự động mỗi đêm' },
      { icon: '🤒', label: 'RHR tăng 5–7 lần/phút đột ngột: cơ thể đang chống lại điều gì đó', note: 'Báo hiệu bệnh 12–24h trước khi triệu chứng xuất hiện — ngủ thêm, nghỉ tập' },
    ],
  },
  {
    num: '05', icon: '😴', label: 'Chất lượng giấc ngủ', freq: 'Hàng ngày',
    when: 'Ngay khi thức dậy', tool: 'App theo dõi giấc ngủ, nhật ký',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    note: 'Đánh giá: thời gian ngủ, số lần thức đêm, cảm giác khi dậy.',
    keyFact: '😴 Giấc ngủ không phải thời gian "không hoạt động" — não và cơ thể đang làm việc tích cực nhất: loại bỏ protein beta-amyloid (liên quan Alzheimer), củng cố ký ức, tái tạo tế bào cơ, cân bằng hormone. Matthew Walker: không có khía cạnh nào của sức khỏe mà thiếu ngủ không làm suy giảm.',
    details: [
      'Kiến trúc giấc ngủ — 4–6 chu kỳ mỗi đêm: mỗi chu kỳ ngủ 90 phút gồm: NREM Stage 1 (5–10 phút): ngủ nông, dễ thức. NREM Stage 2 (20–25 phút): ngủ nhẹ, nhiệt độ cơ thể giảm, nhịp tim chậm. NREM Stage 3 — Slow Wave Sleep/SWS (20–40 phút): ngủ sâu nhất, khó thức, hormone tăng trưởng (GH) tiết mạnh, tái tạo cơ và xương, hệ miễn dịch tái tạo. REM (20–25 phút): não hoạt động như khi thức, mắt di chuyển, củng cố ký ức cảm xúc, sáng tạo. SWS nhiều hơn ở nửa đêm đầu; REM nhiều hơn ở nửa đêm cuối — lý do không nên cắt ngắn giấc ngủ.',
      'Chỉ số chất lượng giấc ngủ cần theo dõi: Sleep Onset Latency (thời gian từ nằm xuống đến ngủ): bình thường 10–20 phút. < 5 phút: có thể thiếu ngủ nghiêm trọng. > 30 phút: có thể mất ngủ. WASO (Wake After Sleep Onset — thức sau khi đã ngủ): < 20 phút là bình thường. Sleep Efficiency = (thời gian ngủ thực) / (thời gian nằm trên giường) × 100%. > 85% là tốt. < 80%: xem xét liệu pháp CBT-I. Giấc ngủ phục hồi (Feeling refreshed?): cảm giác khi dậy là chỉ số chủ quan quan trọng nhất.',
      'Vệ sinh giấc ngủ (Sleep Hygiene): nhiệt độ phòng 18–19°C — nhiệt độ lõi cơ thể cần giảm 1–2°C để vào giấc ngủ sâu. Ánh sáng xanh (blue light) từ màn hình điện thoại/laptop ức chế melatonin: tắt màn hình 1h trước khi ngủ hoặc dùng chế độ Night Mode/filter xanh. Nhất quán giờ ngủ/thức kể cả cuối tuần — quan trọng hơn tổng giờ ngủ. Không uống cà phê sau 14h (caffeine half-life 5–6 giờ). Rượu — giúp ngủ nhanh hơn nhưng phá vỡ kiến trúc giấc ngủ, đặc biệt giảm REM và SWS.',
      'Công cụ theo dõi giấc ngủ: Oura Ring: sensor nhiệt độ, nhịp tim, SpO2, HRV — độ chính xác gần bằng PSG trong phòng lab. Apple Watch: sleep stages từ Series 4 trở lên với WatchOS 9. Garmin, Polar: tương tự Apple Watch. Google Nest Hub (thế hệ 2): radar Soli phát hiện chuyển động — theo dõi không cần đeo gì. Pillow, Sleep Cycle app: phân tích âm thanh (ngáy) và chuyển động qua microphone và accelerometer điện thoại. Giới hạn: thiết bị đeo tay kém hơn PSG trong phân loại sleep stages — nhưng đủ để theo dõi xu hướng.',
      'Mất ngủ mãn tính — CBT-I hiệu quả hơn thuốc ngủ: CBT-I (Cognitive Behavioral Therapy for Insomnia): liệu pháp hành vi nhận thức điều trị mất ngủ. Bao gồm: hạn chế thời gian nằm trên giường (sleep restriction), kiểm soát kích thích (không dùng giường cho việc khác), vệ sinh giấc ngủ, kỹ thuật thư giãn, tái cơ cấu nhận thức. Meta-analysis (2015): CBT-I hiệu quả dài hạn hơn thuốc ngủ (zolpidem, benzodiazepine) — và không có tác dụng phụ. Thời gian: 6–8 tuần. Có sẵn qua app: Sleepio, SleepStation (online CBT-I).',
      'Ngáy và Sleep Apnea — không chỉ gây phiền: ngủ ngáy đơn thuần (không kèm ngừng thở) có thể không nguy hiểm nhưng làm giảm chất lượng giấc ngủ của người ngủ cùng. Obstructive Sleep Apnea (OSA): ngừng thở trong khi ngủ, tỷ lệ gặp cao hơn ở người thừa cân, nam, > 40 tuổi. Hậu quả: buồn ngủ ban ngày, tăng HA, tăng nguy cơ tim mạch, giảm nhận thức. Chẩn đoán: đa ký giấc ngủ (polysomnography — PSG) hoặc home sleep test. Điều trị: CPAP, giảm cân, thay đổi tư thế ngủ, dụng cụ nha khoa.',
    ],
    points: [
      { icon: '🧠', label: 'Thiếu ngủ: giảm nhận thức, ký ức, miễn dịch, tăng nguy cơ béo phì', note: 'Ngủ < 6h/đêm mãn tính: nguy cơ tương đương say rượu nhẹ về nhận thức' },
      { icon: '🌡️', label: '18–19°C: nhiệt độ phòng tối ưu cho giấc ngủ sâu', note: 'Nhiệt độ lõi cơ thể cần giảm 1–2°C để vào SWS — phòng mát giúp điều này' },
      { icon: '⏰', label: 'Cố định giờ thức dậy mỗi ngày — quan trọng hơn giờ đi ngủ', note: 'Đồng hồ sinh học (circadian rhythm) đặt lại từ ánh sáng buổi sáng' },
      { icon: '💊', label: 'CBT-I hiệu quả lâu dài hơn thuốc ngủ — không gây phụ thuộc', note: 'Sleepio, SleepStation: CBT-I online 6–8 tuần — thay thế zolpidem' },
    ],
  },
  {
    num: '06', icon: '📏', label: 'Vòng eo', freq: 'Hàng tháng',
    when: 'Sáng, sau thở ra bình thường', tool: 'Thước dây',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    note: 'Đo ngang rốn. Nam: < 90cm; Nữ: < 80cm là mục tiêu sức khỏe.',
    keyFact: '📏 Vòng eo phản ánh mỡ nội tạng (visceral fat) — loại mỡ nguy hiểm nhất bao quanh các cơ quan bụng. Mỡ nội tạng tiết ra các cytokine gây viêm mãn tính, liên quan trực tiếp đến kháng insulin, tăng HA, và bệnh tim. Vòng eo quan trọng hơn cân nặng hay BMI trong dự đoán nguy cơ tim mạch.',
    details: [
      'Cách đo đúng: đứng thẳng, thở bình thường rồi thở ra hết — đo ở điểm trung điểm giữa xương sườn cuối cùng và mào chậu (thường ngang rốn). Thước dây phải nằm ngang, không nghiêng, không căng quá hoặc lỏng quá. Đo 2–3 lần và lấy trung bình. Thực hiện vào buổi sáng khi bụng chưa đầy thức ăn. Lưu ý: "đo bụng khi hít vào" là sai — sẽ cho số nhỏ hơn thực tế nhưng không có giá trị y tế.',
      'Ngưỡng nguy cơ theo WHO và IDF: Nguy cơ tăng (thừa cân bụng): Nam ≥ 94 cm; Nữ ≥ 80 cm. Nguy cơ cao (béo bụng): Nam ≥ 102 cm; Nữ ≥ 88 cm. Ngưỡng cho người châu Á (IDF): Nam ≥ 90 cm; Nữ ≥ 80 cm (thấp hơn vì người châu Á tích mỡ nội tạng nhiều hơn ở cùng mức BMI). Tỷ lệ vòng eo/chiều cao (WHtR): > 0.5 là ngưỡng nguy cơ — đơn giản và chính xác, phù hợp mọi nhóm dân tộc.',
      'Mỡ nội tạng vs mỡ dưới da: mỡ dưới da (subcutaneous fat): nằm dưới da, "cầm được", nguy cơ thấp hơn. Mỡ nội tạng (visceral fat): bao quanh gan, tụy, ruột, tim — nhìn thấy trên CT/MRI, tương quan cao với vòng eo lớn. Mỡ nội tạng tiết adipokines, cytokines gây viêm mãn tính (TNF-α, IL-6, resistin) → kháng insulin, tăng HA, rối loạn lipid. "Skinny fat" (gầy nhưng nhiều mỡ nội tạng): BMI bình thường nhưng vòng eo lớn — nguy cơ tim mạch cao tương đương người béo phì.',
      'Giảm mỡ bụng — điều gì thực sự hiệu quả: KHÔNG có cách giảm mỡ bụng cục bộ (spot reduction) — không tập bụng 1000 cái/ngày sẽ không giảm mỡ bụng riêng. Mỡ bụng giảm khi thâm hụt calo toàn thân: cardio zone 2 (150–200 phút/tuần) + tập sức mạnh. Mỡ nội tạng nhạy cảm với vận động hơn mỡ dưới da — người bắt đầu tập thường thấy vòng eo giảm trước khi cân nặng thay đổi nhiều. Giảm 500g mỡ nội tạng ≈ giảm 1–2 cm vòng eo (tương đương giảm 5 kg cân nặng mỡ tổng thể).',
      'Vòng eo/vòng hông (WHR) và WHtR: WHR (Waist-to-Hip Ratio) = vòng eo / vòng hông. Nguy cơ: Nam > 0.9; Nữ > 0.85. Phân loại hình dạng cơ thể: "Apple" (nhiều mỡ bụng) vs "Pear" (nhiều mỡ hông/đùi). Apple shape = nguy cơ tim mạch cao hơn. WHtR = vòng eo (cm) / chiều cao (cm). > 0.5 là nguy cơ. Ưu điểm: tính đến chiều cao — phù hợp mọi nhóm dân tộc hơn. Nghiên cứu (2023 Lancet) đề nghị dùng WHtR hoặc WHR thay BMI trong chẩn đoán béo phì lâm sàng.',
      'Tần suất và kỳ vọng đo: đo hàng tháng là đủ — mỡ bụng thay đổi chậm hơn cân nặng. Sau khi bắt đầu tập thể dục + ăn lành mạnh: kỳ vọng giảm 1–3 cm vòng eo sau 4–8 tuần. Kết hợp đo: vòng eo + vòng hông + vòng đùi + cánh tay — để theo dõi tái cơ cấu cơ thể toàn diện. Ghi nhớ: đo cùng điều kiện (sáng, bụng trống, cùng vị trí) — thay đổi vị trí đo 2cm có thể gây sai lệch đến 3–5 cm.',
    ],
    points: [
      { icon: '🎯', label: 'Nam < 90cm, Nữ < 80cm (ngưỡng châu Á) — quan trọng hơn BMI', note: 'WHtR > 0.5 = nguy cơ — đơn giản, phù hợp mọi chiều cao và dân tộc' },
      { icon: '🔥', label: 'Mỡ nội tạng nhạy với vận động — vòng eo giảm trước khi cân giảm', note: 'Zone 2 cardio 150–200 phút/tuần + tập sức mạnh là combo hiệu quả nhất' },
      { icon: '📊', label: '"Skinny fat": BMI bình thường nhưng vòng eo lớn — cũng nguy cơ cao', note: 'Không thể chỉ dựa vào cân nặng — cần đo vòng eo để phát hiện' },
      { icon: '📅', label: 'Đo 1 lần/tháng — mỡ bụng thay đổi chậm hơn nhiều so với cân nặng', note: 'Kỳ vọng thực tế: giảm 1–3cm sau 4–8 tuần tập đều + ăn lành mạnh' },
    ],
  },
  {
    num: '07', icon: '⚡', label: 'Mức năng lượng', freq: 'Hàng ngày',
    when: 'Giữa buổi sáng và chiều', tool: 'Thang điểm 1–10',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    note: 'Theo dõi bằng số hoặc emoji. Giúp phát hiện pattern liên quan ăn uống, ngủ nghỉ.',
    keyFact: '⚡ Mức năng lượng là chỉ số chủ quan nhưng phản ánh sự tổng hợp của nhiều yếu tố sinh học: chất lượng giấc ngủ, dinh dưỡng, hoạt động thể chất, stress, và sức khỏe tâm thần. Theo dõi đều đặn giúp bạn nhận ra pattern cá nhân — điều mà không có thiết bị nào làm thay được.',
    details: [
      'Tại sao năng lượng dao động trong ngày — circadian rhythm: cơ thể có nhịp năng lượng tự nhiên theo ngày. Đỉnh năng lượng 1: 9–11 giờ sáng (tốt nhất cho công việc đòi hỏi tập trung). Sụt năng lượng: 13–15 giờ (post-lunch dip — do nhịp sinh học, không chỉ vì ăn trưa; nhiều nền văn hóa có ngủ trưa vì lý do này). Đỉnh năng lượng 2: 15–17 giờ (tốt cho vận động thể chất — phản xạ và sức mạnh đạt đỉnh). Sụt năng lượng chiều tối: sau 20–21 giờ (cơ thể chuẩn bị ngủ). Biết nhịp cá nhân giúp sắp xếp công việc và tập thể dục vào thời điểm phù hợp.',
      'Hệ thống thang điểm 1–10 và cách dùng: 1–3: năng lượng rất thấp — khó hoàn thành công việc cơ bản, muốn nằm. 4–5: năng lượng thấp — hoàn thành được công việc routine nhưng không có hứng khởi, dễ trì hoãn. 6–7: năng lượng bình thường — productive, tập trung được, không cảm thấy mệt đặc biệt. 8–9: năng lượng cao — flow state dễ xuất hiện, cảm giác rõ ràng và có động lực. 10: cao nhất — hiếm gặp, thường gắn với ngủ đủ + dinh dưỡng tốt + không stress + vận động đều. Ghi chú kèm theo: ăn gì buổi sáng, ngủ bao nhiêu giờ, tập thể dục chưa.',
      'Pattern phổ biến và ý nghĩa của chúng: năng lượng thấp mãn tính (trung bình ≤ 5 trong 2+ tuần): có thể là thiếu ngủ mãn tính, thiếu sắt/B12/D3, suy giáp, trầm cảm, overtraining, hoặc stress quá mức. Năng lượng giảm sau ăn trưa mạnh (từ 7 xuống 3): có thể do bữa trưa nhiều carb tinh (đường huyết tăng rồi giảm đột ngột), ăn quá nhiều. Năng lượng cao sau tập thể dục (dù ban đầu không muốn tập): bằng chứng nhân quả tốt về lợi ích vận động cá nhân. Năng lượng thấp vào cuối tuần làm việc nhiều: tích lũy sleep debt.',
      'Tối ưu hóa năng lượng — bằng chứng khoa học: sáng sớm: tiếp xúc ánh sáng tự nhiên 15–20 phút ngay khi thức dậy (reset đồng hồ sinh học, tăng cortisol buổi sáng đúng lúc). Tập thể dục sáng: tăng năng lượng 3–4 giờ sau (endorphin, BDNF, serotonin). Bữa sáng protein + chất béo tốt: ổn định đường huyết, tránh spike rồi crash. Post-lunch dip: nếu có thể, 10–20 phút ngủ trưa (nap) tốt hơn cà phê — cải thiện alertness, tâm trạng, và hiệu suất. Cà phê: dùng sau 9–10 giờ sáng (sau cortisol đỉnh tự nhiên) để hiệu quả hơn.',
      'Năng lượng và sức khỏe tâm thần: mức năng lượng thấp là triệu chứng đầu tiên và kéo dài nhất của trầm cảm. PHQ-9 (bộ câu hỏi tầm soát trầm cảm): câu 4 hỏi về mệt mỏi/ít năng lượng. Theo dõi năng lượng đều đặn giúp nhận ra khi mức năng lượng giảm theo thời gian — phân biệt với stress thoáng qua. Burnout (kiệt sức): đặc trưng bởi năng lượng thấp mãn tính (≤ 4) ngay cả sau nghỉ ngơi. Khác với mệt mỏi thông thường (phục hồi sau ngủ). Anxiety: có thể gây năng lượng dao động cực đoan — cao bất thường rồi crash.',
      'App và công cụ theo dõi năng lượng: Daylio: nhật ký tâm trạng + hoạt động + năng lượng — tự động phát hiện pattern. Apple Health + Shortcuts: ghi năng lượng bằng shortcut 1 chạm. Notion/Google Sheets: tạo bảng tracking cá nhân. Whoop: tính "strain" và "recovery" dựa trên HRV/RHR — phản ánh gián tiếp mức năng lượng. Phương pháp đơn giản nhất: emoji check-in vào 2 thời điểm cố định (10h và 15h) — 😩😐😊😄 tương ứng 1–4. Nhìn lại theo tuần để thấy pattern.',
    ],
    points: [
      { icon: '⏰', label: 'Đỉnh năng lượng: 9–11h (não) và 15–17h (thể chất) — tận dụng nhịp cá nhân', note: 'Post-lunch dip 13–15h là sinh học — nap 10–20 phút tốt hơn cà phê' },
      { icon: '📋', label: 'Ghi chú kèm: ngủ bao nhiêu giờ, ăn gì, đã tập chưa — tìm pattern', note: 'Năng lượng là tổng hợp của ngủ + ăn + vận động + stress' },
      { icon: '⚠️', label: 'Năng lượng ≤ 5 mãn tính 2+ tuần: kiểm tra sắt, B12, D3, tuyến giáp', note: 'Burnout: năng lượng thấp ngay cả sau nghỉ ngơi — khác với mệt bình thường' },
      { icon: '☀️', label: 'Ánh sáng sáng 15–20 phút ngay khi thức: boost năng lượng cả ngày', note: 'Reset circadian rhythm, cortisol tự nhiên — hiệu quả hơn cà phê đầu ngày' },
    ],
  },
];

const DAILY_CHECK = [
  { q: 'Bạn ngủ bao nhiêu tiếng tối qua?', type: 'slider', min: 4, max: 10, unit: 'giờ', key: 'sleep' },
  { q: 'Đã uống đủ nước chưa? (khoảng 2L)', type: 'bool', key: 'water' },
  { q: 'Cảm thấy đau hoặc khó chịu bất thường không?', type: 'bool', key: 'pain', invert: true },
  { q: 'Tâm trạng hôm nay ra sao?', type: 'select', opts: ['Tệ', 'Bình thường', 'Tốt', 'Rất tốt'], key: 'mood' },
  { q: 'Đã vận động ít nhất 20 phút chưa?', type: 'bool', key: 'exercise' },
];

const PRINCIPLES = [
  {
    num: '01', icon: '🔄', title: 'Nhất Quán Về Điều Kiện Đo',
    subtitle: 'Cùng thời điểm · Cùng thiết bị · Cùng trạng thái',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    keyFact: '🔄 Tính nhất quán quan trọng hơn tần suất. Đo cân nặng 10 lần/tuần với điều kiện khác nhau mỗi lần ít có giá trị hơn đo 1 lần/tuần vào đúng điều kiện chuẩn. Biến thiên đo lường (measurement variability) là kẻ thù lớn nhất của việc theo dõi sức khỏe — nó tạo ra "nhiễu" che khuất tín hiệu thực.',
    details: [
      'Tại sao điều kiện đo quan trọng hơn số lần đo: mỗi chỉ số sức khỏe có "noise" tự nhiên do sinh lý học — cân nặng dao động 1–2kg/ngày do nước, glycogen, thức ăn; huyết áp dao động 10–20 mmHg tùy thời điểm, căng thẳng, và hoạt động gần đó. Nếu đo ở các điều kiện khác nhau, bạn đang đo "noise" chứ không phải tín hiệu thực. Chỉ khi kiểm soát điều kiện đo, sự thay đổi quan sát được mới phản ánh thay đổi thực sự của cơ thể.',
      'Chuẩn hóa từng chỉ số — cụ thể: Cân nặng: sáng, sau vệ sinh, trước ăn uống, cùng lượng quần áo (hoặc không mặc), cùng cân. Huyết áp: ngồi nghỉ 5 phút trước đo, sáng + tối, trước khi dùng thuốc (nếu có), không cà phê/tập thể dục 30 phút trước. Nhịp tim nghỉ: ngay khi thức dậy, chưa ra khỏi giường. Đường huyết: đói 8h (buổi sáng) và đúng 2h sau bữa ăn. Vòng eo: sáng, thở ra bình thường, cùng vị trí trên cơ thể, cùng thước dây.',
      'Thiết bị — chọn và dùng nhất quán: mỗi thiết bị có systematic error (sai số hệ thống) riêng. Nếu cân bạn luôn cho kết quả cao hơn 0.5kg so với thực tế — không quan trọng, miễn là bạn dùng cùng cân đó mỗi lần (xu hướng vẫn chính xác). Vấn đề phát sinh khi bạn đổi cân giữa chừng — lúc đó bạn không biết sự thay đổi là do cơ thể hay do thiết bị. Với huyết áp: cùng cánh tay (thường tay không thuận thấp hơn 5–10 mmHg), cùng vị trí băng quấn.',
      'Thời điểm đo — circadian rhythm ảnh hưởng mọi chỉ số: cơ thể có nhịp sinh học 24h ảnh hưởng đến tất cả chỉ số sinh lý. Huyết áp thấp nhất lúc 3–4h sáng, tăng dần và đạt đỉnh buổi sáng (morning surge) — lý do đột quỵ hay xảy ra buổi sáng. Cortisol cao nhất 8–9h sáng (ảnh hưởng đường huyết và huyết áp). Nhiệt độ cơ thể thấp nhất 4–6h sáng, cao nhất 17–19h. Nếu đo huyết áp sáng hôm nay và chiều hôm sau — chênh lệch có thể do thời điểm đo, không phải do sức khỏe.',
      'Tạo ritual (thói quen cố định): gắn việc đo với một hành động đã có sẵn mỗi ngày (habit stacking). Ví dụ: "Sau khi vệ sinh xong, tôi bước lên cân" — không cần nhớ, không cần nhắc nhở. "Trước khi pha cà phê sáng, tôi đo huyết áp 5 phút." Điều này vừa đảm bảo nhất quán thời điểm, vừa xây dựng thói quen bền vững. James Clear (Atomic Habits): thói quen mạnh nhất là thói quen được gắn với môi trường và hành động đã tồn tại.',
      'Ghi lại điều kiện bất thường: khi bạn phải đo trong điều kiện khác thường (đo trưa thay vì sáng, đo sau khi tập thể thao), hãy ghi chú rõ ràng thay vì bỏ qua dữ liệu. Điểm dữ liệu đó vẫn có thể hữu ích — nhưng cần được đánh dấu để không nhầm lẫn khi phân tích xu hướng. App như Cronometer, Samsung Health, Apple Health đều cho phép thêm ghi chú kèm theo mỗi lần đo.',
    ],
    points: [
      { icon: '📐', label: 'Cùng điều kiện mỗi lần > đo nhiều với điều kiện khác nhau', note: 'Noise ẩn dấu tín hiệu — kiểm soát điều kiện mới thấy thay đổi thực' },
      { icon: '⚙️', label: 'Cùng thiết bị: sai số hệ thống ổn định thì xu hướng vẫn đúng', note: 'Đổi thiết bị giữa chừng = không thể so sánh dữ liệu trước và sau' },
      { icon: '⏰', label: 'Circadian rhythm ảnh hưởng mọi chỉ số — giờ đo phải cố định', note: 'HA sáng vs chiều có thể chênh 10–20 mmHg mà không phải do bệnh' },
      { icon: '🔗', label: 'Habit stacking: gắn đo với hành động sáng cố định', note: '"Sau vệ sinh → bước lên cân" — tự động, không cần nhớ' },
    ],
  },
  {
    num: '02', icon: '✍️', title: 'Ghi Ngay, Không Trì Hoãn',
    subtitle: 'Bộ nhớ không đáng tin cậy · Ghi ngay lúc đo',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    keyFact: '✍️ Bộ nhớ con người không thiết kế để lưu trữ số liệu chính xác. Sau 20 phút, chúng ta quên 40% những gì vừa trải nghiệm (Ebbinghaus Forgetting Curve). Với chỉ số sức khỏe — số liệu bạn nhớ được sau vài giờ thường là con số "cảm giác đúng" chứ không phải con số thực, bị ảnh hưởng bởi kỳ vọng và cảm xúc hiện tại.',
    details: [
      'Forgetting Curve (Hermann Ebbinghaus, 1885): nghiên cứu kinh điển về trí nhớ: ngay sau khi học/quan sát = 100% nhớ. Sau 20 phút = nhớ 60%. Sau 1 giờ = nhớ 44%. Sau 1 ngày = nhớ 33%. Sau 1 tuần = nhớ 25%. Với chỉ số huyết áp hay đường huyết — bạn sẽ không nhớ chính xác 127/84 hay 132/86 sau vài giờ. Bạn sẽ nhớ "huyết áp hơi cao" — nhưng hơi cao là bao nhiêu thì không còn chắc chắn.',
      'Memory distortion — trí nhớ bị bóp méo: không chỉ là quên — chúng ta còn "nhớ sai". Nếu hôm nay bạn cảm thấy mệt, bạn có xu hướng nhớ lại huyết áp hôm trước là "cao hơn bình thường" dù thực ra bình thường. Confirmation bias (thiên kiến xác nhận): chúng ta nhớ những con số phù hợp với niềm tin hoặc cảm xúc hiện tại. Với theo dõi sức khỏe, điều này rất nguy hiểm — có thể dẫn đến lo lắng không cần thiết hoặc bỏ qua vấn đề thực sự.',
      'Ghi ngay — thiết lập quy trình cụ thể: đặt điện thoại cạnh cân và máy đo huyết áp — không thể đo xong mà không thấy điện thoại ngay. Dùng app tích hợp thiết bị Bluetooth (Omron Connect, Withings Health Mate, Xiaomi Mi Fit) — tự động sync dữ liệu khi đo xong, không cần nhập tay. Nếu không có thiết bị smart: dùng sticky note dán ở nơi đo — ghi vào tờ đó ngay lập tức, sau đó chuyển sang app/bảng tính vào cuối ngày.',
      'Hệ thống ghi chép tối giản — friction phải bằng 0: công thức thành công: mỗi giây thêm vào quy trình ghi chép = giảm 10% khả năng thực hiện dài hạn. Tốt nhất: thiết bị Bluetooth sync tự động → không cần làm gì. Tốt: shortcut trên màn hình chính điện thoại mở thẳng vào màn hình nhập liệu app sức khỏe. Không nên: "tôi sẽ nhập vào excel sau khi ăn sáng xong" — quá nhiều bước, quá nhiều cơ hội để quên hoặc trì hoãn. Apple Health Shortcut: tạo shortcut nhập cân nặng, huyết áp 1 chạm từ màn hình khóa.',
      'Paper backup — khi không có điện thoại: một cuốn sổ nhỏ hoặc notebook đặt cạnh cân và máy đo HA là backup tốt nhất. Ghi ngày + giờ + số liệu. Lợi ích của giấy: không cần mở khóa điện thoại, không có notification làm phân tâm, không lo hết pin. Nghiên cứu về note-taking: ghi tay giúp nhớ tốt hơn ghi điện thoại — nên ngay cả khi dùng app, việc nhìn và ghi số bằng tay một lần giúp bạn "thực sự thấy" số liệu đó, không chỉ tap vào ô.',
      'Xử lý dữ liệu bỏ lỡ: nếu quên ghi một ngày — không cố nhớ lại và điền vào. Ghi "không có dữ liệu" hoặc để trống — trung thực hơn. Khoảng trống trong dữ liệu không phải vấn đề — nó là thông tin (cho thấy những ngày nào bạn thường bỏ qua). Nếu bỏ lỡ nhiều ngày liên tục — không "bù lại" bằng cách đo nhiều lần trong ngày. Reset lại thói quen: xác định lý do bỏ lỡ (đi du lịch? bận rộn?) và tìm giải pháp cho lần tới.',
    ],
    points: [
      { icon: '🧠', label: 'Sau 1 giờ: nhớ chính xác 44% — sau 1 ngày chỉ còn 33%', note: 'Ebbinghaus Forgetting Curve: trí nhớ giảm theo hàm số mũ' },
      { icon: '📱', label: 'Thiết bị Bluetooth sync tự động = friction bằng 0', note: 'Omron Connect, Withings, Xiaomi Mi Fit tự ghi vào app khi đo' },
      { icon: '⚡', label: 'Shortcut 1 chạm từ màn hình khóa — tối giản quy trình ghi', note: 'Mỗi giây thêm vào quy trình = giảm 10% khả năng duy trì' },
      { icon: '📓', label: 'Sổ giấy cạnh thiết bị = backup hoàn hảo, không cần điện thoại', note: 'Ghi tay giúp bạn "thực sự thấy" số liệu — không chỉ tap blind' },
    ],
  },
  {
    num: '03', icon: '📈', title: 'Nhìn Xu Hướng 4–8 Tuần',
    subtitle: 'Không lo biến động ngày · Tín hiệu nằm trong xu hướng',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    keyFact: '📈 Mỗi điểm dữ liệu đơn lẻ là "điểm ồn" — xu hướng mới là "tín hiệu". Cân nặng tăng 0.8kg từ hôm qua đến hôm nay không có nghĩa lý gì — nhưng cân nặng tăng 0.8kg mỗi tuần trong 4 tuần liên tiếp là tín hiệu rõ ràng. Não người không giỏi nhìn xu hướng tự nhiên — chúng ta cần công cụ để lọc nhiễu.',
    details: [
      'Noise vs Signal — phân biệt hai loại thay đổi: "Noise" (nhiễu): thay đổi ngẫu nhiên, tạm thời, không liên quan đến sức khỏe thực sự. Ví dụ: cân tăng 1.5kg sau bữa tối muối nhiều (giữ nước). Huyết áp tăng 15 mmHg sau cuộc họp căng thẳng. Nhịp tim tăng 8 lần/phút sau 3 ly cà phê. "Signal" (tín hiệu): thay đổi có hệ thống, ổn định theo thời gian, phản ánh thay đổi thực sự. Ví dụ: cân tăng 0.5kg/tuần đều đặn trong 8 tuần. Huyết áp trung bình tăng 8 mmHg trong 4 tuần. Nhịp tim nghỉ giảm 7 lần/phút sau 12 tuần chạy bộ đều đặn.',
      'Thời gian cần thiết để thấy xu hướng rõ ràng: cân nặng: 2–4 tuần (dao động ngày che khuất xu hướng ngắn hơn). Huyết áp: 7–14 ngày (trung bình 7 ngày mới phản ánh đúng). Nhịp tim nghỉ: 4–8 tuần (tim mạch thích nghi chậm). Đường huyết (HbA1c): 8–12 tuần (phản ánh trung bình 2–3 tháng). Mức năng lượng: 2–4 tuần (nhận ra pattern theo tuần). Kết luận: với hầu hết chỉ số, bạn cần ít nhất 4 tuần dữ liệu để có bức tranh đáng tin cậy.',
      'Công cụ tính đường xu hướng: app Happy Scale (iOS): tự động tính đường xu hướng từ cân nặng, lọc bỏ dao động ngày — hiển thị "weighted moving average". Apple Health: biểu đồ tự động với đường trend. Google Sheets / Excel: hàm AVERAGE(rolling window) hoặc =TREND(). Withings / Garmin / Oura: dashboard tự động với trend analysis. Whoop: "strain vs recovery" trend theo tuần và tháng. Nguyên tắc: bất kỳ app nào hiển thị đường trend (không chỉ điểm dữ liệu) đều tốt hơn nhìn vào số liệu thô.',
      'Moving average — cách đơn giản nhất để lọc nhiễu: moving average 7 ngày cho cân nặng: (cân ngày 1 + 2 + 3 + 4 + 5 + 6 + 7) / 7. Hôm nay giá trị này thay đổi như thế nào so với tuần trước? Nếu tăng 0.1–0.2kg/tuần: trend nhẹ lên. Nếu giảm 0.2–0.5kg/tuần: đang giảm mỡ. Cách làm thủ công: tính trung bình 7 ngày cuối mỗi tuần và so sánh với tuần trước — 5 phút/tuần, không cần phần mềm phức tạp.',
      'Biến động bình thường — không nên lo lắng: cân nặng: dao động ±1.5kg trong ngày — bình thường. Huyết áp: ±10 mmHg tâm thu giữa 2 lần đo cách nhau 1h — bình thường. Nhịp tim: ±5–10 lần/phút tùy ngày — bình thường. Đường huyết sau ăn: tăng 40–60 mg/dL rồi về ngưỡng bình thường sau 2h — hoàn toàn sinh lý. Biến động không bình thường (cần chú ý): huyết áp thay đổi > 30 mmHg giữa 2 lần đo liên tiếp (5 phút cách nhau) không rõ lý do. Cân tăng > 2kg trong 1 ngày (phù nề bất thường). Nhịp tim tăng > 15 lần/phút so với baseline kéo dài > 2 ngày.',
      'Review định kỳ — lịch nhìn lại dữ liệu: hàng tuần (5 phút chủ nhật): nhìn 7 ngày vừa rồi — có gì bất thường không? Hàng tháng (15 phút): so sánh 4 tuần, trend đang đi hướng nào? Quý (30 phút): nhìn lại 3 tháng — mục tiêu đã đạt chưa? Cần điều chỉnh gì không? Review định kỳ biến dữ liệu thô thành insight hành động. Không review = data không có giá trị. Lập lịch cụ thể (ví dụ: tối chủ nhật sau bữa ăn) và giữ nguyên lịch đó.',
    ],
    points: [
      { icon: '📊', label: 'Cần 4+ tuần dữ liệu để thấy xu hướng đáng tin cậy', note: 'Ít hơn 4 tuần: không thể phân biệt noise với signal thực' },
      { icon: '📱', label: 'Happy Scale, Apple Health: tự tính moving average — lọc noise', note: 'Bất kỳ app nào hiển thị đường trend đều tốt hơn nhìn số lẻ' },
      { icon: '📅', label: 'Review hàng tuần 5 phút + hàng tháng 15 phút', note: 'Data không review = data không có giá trị — lập lịch cố định' },
      { icon: '✅', label: 'Biến động ngày ±1.5kg cân, ±10 mmHg HA — bình thường', note: 'Chỉ lo khi thay đổi hệ thống ổn định > 2–4 tuần liên tục' },
    ],
  },
  {
    num: '04', icon: '🧘', title: 'Không Ám Ảnh Với Số',
    subtitle: 'Nhận biết thay đổi · Không tối ưu hóa mỗi ngày',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    keyFact: '🧘 Theo dõi sức khỏe là công cụ — không phải mục tiêu. Khi việc theo dõi bắt đầu gây lo lắng, ám ảnh, hoặc ảnh hưởng tiêu cực đến hành vi (ăn ít hơn vì cân tăng, từ chối ăn với bạn bè, kiểm tra huyết áp 5 lần/ngày), đó là dấu hiệu cần dừng lại và đánh giá lại mối quan hệ của bạn với dữ liệu.',
    details: [
      'Mục đích đúng đắn của theo dõi sức khỏe: phát hiện xu hướng bất thường sớm để hành động kịp thời. Hiểu cơ thể phản ứng với thay đổi lối sống (thực phẩm, tập luyện, ngủ). Có dữ liệu khách quan để thảo luận với bác sĩ. Tạo động lực bằng cách thấy tiến bộ rõ ràng. KHÔNG phải: đạt điểm hoàn hảo mỗi ngày, so sánh với người khác, tối ưu hóa từng chi tiết. Nếu theo dõi không giúp bạn sống tốt hơn, bạn không cần làm điều đó.',
      'Orthorexia Nervosa và "quantified self" obsession: Orthorexia Nervosa: ám ảnh về ăn uống "hoàn hảo" — mở rộng ra là ám ảnh về các chỉ số sức khỏe "hoàn hảo". Quantified Self Obsession: hiện tượng ngày càng phổ biến với wearable — người dùng theo dõi mọi thứ, lo lắng khi thiếu dữ liệu, và cảm thấy tồi tệ khi số liệu không tốt. Nghiên cứu (Etkin, 2016): việc theo dõi quá chi tiết (tracking) có thể làm giảm intrinsic motivation — bạn bắt đầu tập thể dục vì số steps thay vì vì cảm giác tốt.',
      'Dấu hiệu cảnh báo — theo dõi đang trở nên không lành mạnh: kiểm tra cân nhiều hơn 1 lần/ngày và cảm thấy cần phải. Hủy kế hoạch ăn uống với bạn bè/gia đình vì lo ảnh hưởng đến chỉ số. Cảm thấy tội lỗi hoặc thất bại khi một ngày "không hoàn hảo" về số liệu. Lo lắng không ngủ được khi theo dõi thấy số bất thường nhỏ. Liên tục tra cứu ý nghĩa của từng thay đổi nhỏ. Mọi quyết định lối sống đều phải dựa vào số liệu thay vì cảm giác.',
      'Thiết lập ranh giới lành mạnh: chỉ đo tần suất cần thiết (cân 1×/tuần, huyết áp sáng + tối, không nhiều hơn). Không kiểm tra app nhiều lần trong ngày. Có ngày/tuần "nghỉ" không theo dõi hoàn toàn. Không chia sẻ số liệu sức khỏe cá nhân lên mạng xã hội để "thi đua". Nhớ rằng mục tiêu là sống tốt — không phải có số liệu đẹp. Nếu một chỉ số gây lo lắng liên tục, tạm dừng theo dõi chỉ số đó 2–4 tuần.',
      'Tiêu chuẩn "đủ tốt" thay vì "hoàn hảo": cân nặng trong vùng mục tiêu ±2kg = tốt, không cần điều chỉnh liên tục. Huyết áp trung bình tuần < 130/80 = tốt, không cần tối ưu hóa thêm. Ngủ 7+ tiếng 5/7 ngày trong tuần = tốt, không cần 8 giờ chính xác mỗi đêm. Nhịp tim nghỉ ổn định hoặc giảm nhẹ theo tháng = tốt. Nguyên tắc 80/20: nếu 80% ngày bạn đạt được mức "tốt", kết quả sức khỏe dài hạn sẽ tốt — không cần 100% mỗi ngày.',
      'Khi nào nên dừng hoặc giảm theo dõi: nếu theo dõi gây stress nhiều hơn lợi ích, hãy thử: dừng hoàn toàn 2 tuần và quan sát cảm giác. Nếu cảm thấy nhẹ nhõm — có thể bạn đang theo dõi quá nhiều, cần tìm mức cân bằng. Nếu cảm thấy lo lắng vì không có dữ liệu — đây cũng là tín hiệu cần chú ý (phụ thuộc vào số). Tham khảo chuyên gia tâm lý nếu ám ảnh với sức khỏe (health anxiety) ảnh hưởng đến cuộc sống hàng ngày. Bác sĩ chỉ cần xu hướng — không cần mỗi điểm dữ liệu.',
    ],
    points: [
      { icon: '🎯', label: 'Mục đích: phát hiện thay đổi bất thường, không phải điểm hoàn hảo', note: 'Theo dõi là công cụ phục vụ sức khỏe — không phải mục tiêu tự nó' },
      { icon: '⚠️', label: 'Đo cân > 1×/ngày + cảm thấy cần phải: dấu hiệu cảnh báo', note: 'Từ chối ăn với bạn bè vì lo chỉ số = theo dõi không còn lành mạnh' },
      { icon: '✅', label: '80/20: tốt 80% ngày = kết quả dài hạn tốt — không cần 100%', note: 'Cân ±2kg mục tiêu, HA < 130/80 trung bình tuần = đủ tốt' },
      { icon: '🛑', label: 'Dừng 2 tuần nếu theo dõi gây stress nhiều hơn lợi ích', note: 'Cảm thấy nhẹ nhõm khi không đo = dấu hiệu đang theo dõi quá nhiều' },
    ],
  },
];

function MetricCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>{item.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-bold text-sm text-text leading-snug">{item.label}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold transition-opacity duration-200"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
          </div>
          <div className="text-xs text-muted mb-2">{item.when} · {item.tool}</div>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `rgba(${item.rgb},0.1)`, color: item.color }}>🔁 {item.freq}</span>
        </div>
      </div>
      <p className="text-xs text-muted mt-3 leading-relaxed">{item.note}</p>
    </div>
  );
}

function MetricModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = e => {
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
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Chỉ số {item.num}/07</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-2 leading-snug" style={{ color: item.color }}>{item.label}</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>🔁 {item.freq}</span>
            <span className="text-xs px-3 py-1 rounded-full text-muted" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>⏰ {item.when}</span>
            <span className="text-xs px-3 py-1 rounded-full text-muted" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>🔧 {item.tool}</span>
          </div>
          <div className="rounded-2xl px-4 py-3 mb-6 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.88)' }}>
            {item.keyFact}
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-3"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-xs leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 07</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function PrincipleCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>{item.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-sm text-text leading-snug">{item.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold transition-opacity duration-200"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">{item.subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function PrincipleModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = e => {
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
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Nguyên tắc {item.num}/04</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.title}</h2>
          <p className="text-sm mb-5" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.subtitle}</p>
          <div className="rounded-2xl px-4 py-3 mb-6 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.88)' }}>
            {item.keyFact}
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-3"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-xs leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 04</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-sm-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-sm-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function DailyCheckForm() {
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);

  function set(key, val) {
    setAnswers(p => ({ ...p, [key]: val }));
  }

  function save() {
    const today = new Date().toLocaleDateString('vi-VN');
    const log = { date: today, ...answers };
    try {
      const history = JSON.parse(localStorage.getItem('healthapp_daily_check') || '[]');
      const filtered = history.filter(h => h.date !== today);
      localStorage.setItem('healthapp_daily_check', JSON.stringify([log, ...filtered].slice(0, 30)));
    } catch { }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div>
        <label className="text-lg text-text mb-1 block">Bạn ngủ bao nhiêu tiếng tối qua?</label>
        <div className="flex items-center gap-3">
          <input type="range" min={4} max={10} step={0.5} value={answers.sleep || 7} onChange={e => set('sleep', +e.target.value)} className="flex-1" />
          <span className="text-lg font-bold w-12 text-right" style={{ color: COLOR }}>{answers.sleep || 7} giờ</span>
        </div>
      </div>
      {[
        { q: 'Đã uống đủ nước chưa? (~2L)', key: 'water' },
        { q: 'Đã vận động ít nhất 20 phút?', key: 'exercise' },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-lg text-text">{item.q}</span>
          <div className="flex gap-2">
            {['Rồi', 'Chưa'].map(opt => (
              <button key={opt} onClick={() => set(item.key, opt === 'Rồi')}
                className="px-3 py-1 rounded-lg text-base font-bold border transition-colors"
                style={answers[item.key] === (opt === 'Rồi') ? { background: COLOR, color: 'white', borderColor: COLOR } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <label className="text-lg text-text mb-2 block">Tâm trạng hôm nay?</label>
        <div className="flex gap-2 flex-wrap">
          {['😞 Tệ', '😐 Bình thường', '😊 Tốt', '😄 Rất tốt'].map(opt => (
            <button key={opt} onClick={() => set('mood', opt)}
              className="px-3 py-1 rounded-lg text-base border transition-colors"
              style={answers.mood === opt ? { background: COLOR, color: 'white', borderColor: COLOR } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button onClick={save} className="w-full py-2 rounded-xl text-lg font-bold text-white transition-all" style={{ background: saved ? '#22c55e' : COLOR }}>
        {saved ? '✓ Đã lưu!' : 'Lưu Check-in Hôm Nay'}
      </button>
    </div>
  );
}

export default function HealthSelfMonitoringPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [metricModal, setMetricModal] = useState(null);
  const [principleModal, setPrincipleModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eSmOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eSmOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>📊</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Tự Theo Dõi Sức Khỏe</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Biometric tracking · Daily check-in
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi các chỉ số sức khỏe theo thời gian giúp bạn nhận ra pattern, phát hiện thay đổi sớm, và đưa ra quyết định lối sống dựa trên dữ liệu thực tế của cơ thể bạn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop" alt="Tự theo dõi" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Xu hướng quan trọng hơn một con số
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg · {b0.height}cm — Bắt đầu theo dõi cân nặng, huyết áp và vòng eo hàng tuần để có baseline cá nhân.</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>7 Chỉ Số Cần Theo Dõi</h2>
        <p className="text-muted text-lg mb-6">Không nhất thiết theo dõi tất cả mỗi ngày — mỗi chỉ số có tần suất phù hợp riêng. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {METRICS.map((m, i) => (
            <MetricCard key={i} item={m} onClick={() => setMetricModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Check-in Hằng Ngày</h2>
        <p className="text-muted text-lg mb-4">5 câu hỏi đơn giản, mỗi ngày 30 giây. Dữ liệu lưu trong thiết bị của bạn.</p>
        <DailyCheckForm />
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nguyên Tắc Theo Dõi Hiệu Quả</h2>
        <p className="text-muted text-lg mb-6">4 nguyên tắc cốt lõi để dữ liệu bạn thu thập thực sự có ý nghĩa. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PRINCIPLES.map((p, i) => (
            <PrincipleCard key={i} item={p} onClick={() => setPrincipleModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {metricModal !== null && (
        <MetricModal
          item={METRICS[metricModal]}
          onClose={() => setMetricModal(null)}
          onPrev={() => setMetricModal(i => Math.max(0, i - 1))}
          onNext={() => setMetricModal(i => Math.min(METRICS.length - 1, i + 1))}
          hasPrev={metricModal > 0}
          hasNext={metricModal < METRICS.length - 1}
        />
      )}

      {principleModal !== null && (
        <PrincipleModal
          item={PRINCIPLES[principleModal]}
          onClose={() => setPrincipleModal(null)}
          onPrev={() => setPrincipleModal(i => Math.max(0, i - 1))}
          onNext={() => setPrincipleModal(i => Math.min(PRINCIPLES.length - 1, i + 1))}
          hasPrev={principleModal > 0}
          hasNext={principleModal < PRINCIPLES.length - 1}
        />
      )}
    </div>
  );
}
