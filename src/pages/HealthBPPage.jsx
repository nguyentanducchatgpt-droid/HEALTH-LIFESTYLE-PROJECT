import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-bp-orbit-kf';
const ORBIT_CLASS = 'e-bp-orbit-ring';
const ORBIT_PROP = '--e-bp-orbit-angle';

const BP_CATS = [
  {
    label: 'Bình thường', sys: '< 120', dia: '< 80', color: '#22c55e', rgb: '34,197,94', bg: '#22c55e18',
    action: 'Duy trì lối sống lành mạnh, tái khám hàng năm.',
    icon: '💚',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    keyFact: '💡 Huyết áp tối ưu thực sự là < 115/75 mmHg. Mỗi 20 mmHg tâm thu tăng = nguy cơ bệnh tim mạch tăng gấp đôi theo dữ liệu Framingham Heart Study.',
    detail: 'Duy trì huyết áp bình thường là thành tích quan trọng — nhiều người không biết mình đã có tăng huyết áp âm thầm trong nhiều năm mà không có triệu chứng.',
    details: [
      'HA < 120/80 mmHg ở người lớn được AHA 2017 phân loại là "Normal" — đây là ngưỡng bảo vệ tim mạch tối ưu theo bằng chứng hiện tại.',
      'Mỗi năm nên đo HA ít nhất 1 lần, dù không có triệu chứng — tăng HA thường không có dấu hiệu cảnh báo cho đến khi xảy ra biến chứng.',
      'Giữ HA trong ngưỡng bình thường làm giảm nguy cơ đột quỵ 35–40% và giảm nguy cơ nhồi máu cơ tim 20–25% so với người có HA tăng.',
      'Yếu tố duy trì HA bình thường: cân nặng hợp lý, ăn ít muối (< 5g/ngày), vận động đều, không hút thuốc, hạn chế rượu bia.',
      'Huyết áp dao động trong ngày là bình thường: cao hơn vào buổi sáng sớm (morning surge), thấp hơn ban đêm — đo lúc thức nhưng chưa ăn cho kết quả chuẩn nhất.',
      'Người dưới 40 tuổi, không có yếu tố nguy cơ: đo HA mỗi 1–2 năm là đủ. Người ≥ 40 tuổi hoặc có nguy cơ: nên đo mỗi 3–6 tháng.',
    ],
    points: [
      { icon: '📅', label: 'Tái khám hàng năm', note: 'Ngay cả khi không có triệu chứng' },
      { icon: '🧂', label: 'Muối < 5g/ngày', note: '1 muỗng cà phê — giảm 5 mmHg' },
      { icon: '🏃', label: '150 phút/tuần vận động', note: 'Giảm HA 5–8 mmHg' },
      { icon: '⚖️', label: 'BMI 18.5–24.9', note: 'Giảm 1kg → HA giảm ~1 mmHg' },
    ],
  },
  {
    label: 'Tiền tăng huyết áp', sys: '120–129', dia: '< 80', color: '#eab308', rgb: '234,179,8', bg: '#eab30818',
    action: 'Điều chỉnh chế độ ăn, giảm muối, tăng vận động.',
    icon: '⚡',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '💡 Người ở mức "Elevated" (120–129/<80) có nguy cơ phát triển tăng huyết áp thực sự cao hơn 2 lần trong 4 năm tới — đây là cơ hội vàng để can thiệp trước khi cần thuốc.',
    detail: 'Giai đoạn tiền tăng huyết áp là "cửa sổ cơ hội" — thay đổi lối sống ở bước này có thể đưa HA về ngưỡng bình thường mà không cần can thiệp thuốc.',
    details: [
      'Phân loại AHA 2017: tâm thu 120–129 mmHg VÀ tâm trương < 80 mmHg = "Elevated". Đây chưa phải tăng huyết áp nhưng cần hành động.',
      'Nguy cơ: trong 4 năm, khoảng 40–50% người ở mức này sẽ phát triển thành tăng HA thực sự nếu không thay đổi lối sống.',
      'Mục tiêu can thiệp: đưa HA xuống < 120/80 mmHg thông qua lối sống — không cần thuốc ở giai đoạn này trừ khi có bệnh nền đặc biệt.',
      'DASH diet (Dietary Approaches to Stop Hypertension): giảm HA 8–14 mmHg — hiệu quả tương đương một viên thuốc huyết áp nhẹ.',
      'Cắt giảm natri từ 3.5g xuống 1.5g/ngày giảm được 5–6 mmHg HA tâm thu — đọc nhãn thực phẩm đóng gói là bước quan trọng.',
      'Tái đánh giá sau 3 tháng thay đổi lối sống: nếu HA không về bình thường, cần kiểm tra thêm yếu tố nguy cơ tim mạch toàn diện (lipid, đường huyết).',
    ],
    points: [
      { icon: '🥗', label: 'DASH diet', note: 'Giảm 8–14 mmHg không cần thuốc' },
      { icon: '🧂', label: 'Cắt giảm muối tích cực', note: 'Từ 3.5g → 1.5g/ngày' },
      { icon: '🏋️', label: 'Tăng vận động', note: '150 phút/tuần aerobic' },
      { icon: '📊', label: 'Theo dõi 3 tháng', note: 'Đánh giá lại sau thay đổi lối sống' },
    ],
  },
  {
    label: 'Tăng HA độ 1', sys: '130–139', dia: '80–89', color: '#f97316', rgb: '249,115,22', bg: '#f9731618',
    action: 'Thay đổi lối sống 3–6 tháng; cân nhắc thuốc nếu có nguy cơ.',
    icon: '📈',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 Tăng HA độ 1 tăng nguy cơ đột quỵ 35% và nhồi máu cơ tim 25%. Nếu có thêm tiểu đường, bệnh thận mạn, hoặc bệnh tim mạch — nên bắt đầu thuốc ngay, không chờ 3–6 tháng.',
    detail: 'Ở giai đoạn này, quyết định dùng thuốc hay không phụ thuộc vào nguy cơ tim mạch tổng thể, không chỉ riêng con số huyết áp.',
    details: [
      'AHA khuyến cáo: tăng HA độ 1 (130–139/80–89) — nếu nguy cơ tim mạch 10 năm < 10%: thử lối sống 3–6 tháng trước. Nếu ≥ 10%: bắt đầu thuốc ngay.',
      'Tính nguy cơ tim mạch 10 năm bằng thang điểm Pooled Cohort Equations (tính trực tuyến miễn phí trên các trang tim mạch): dựa trên tuổi, giới, cholesterol, đái tháo đường, hút thuốc.',
      'Nhóm cần thuốc ngay dù HA chỉ 130–139/80–89: có bệnh tim mạch đã xác định (tiền sử đột quỵ, NMCT), đái tháo đường, bệnh thận mạn (eGFR < 60).',
      'Thuốc hàng đầu cho tăng HA không biến chứng: thiazide, ACE inhibitor, ARB, hoặc calcium channel blocker — bác sĩ chọn dựa trên profile cá nhân.',
      'Kết hợp thuốc + lối sống hiệu quả hơn đơn độc: thuốc giảm 10–15 mmHg + DASH + giảm muối + vận động có thể đưa HA về < 130/80.',
      'Tái khám sau 1 tháng bắt đầu thuốc để đánh giá hiệu quả và tác dụng phụ. Không tự điều chỉnh liều mà không có bác sĩ hướng dẫn.',
    ],
    points: [
      { icon: '🏥', label: 'Đánh giá nguy cơ 10 năm', note: 'Quyết định có dùng thuốc hay không' },
      { icon: '💊', label: 'Thuốc nếu nguy cơ cao', note: 'Tiểu đường, thận mạn → thuốc ngay' },
      { icon: '🔄', label: 'Kết hợp thuốc + lối sống', note: 'Hiệu quả hơn đơn độc mỗi thứ' },
      { icon: '📅', label: 'Tái khám sau 1 tháng', note: 'Kiểm tra hiệu quả và tác dụng phụ' },
    ],
  },
  {
    label: 'Tăng HA độ 2', sys: '≥ 140', dia: '≥ 90', color: '#ef4444', rgb: '239,68,68', bg: '#ef444418',
    action: 'Bắt đầu dùng thuốc + thay đổi lối sống, tái khám trong 1 tháng.',
    icon: '🚨',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💡 Ở mức ≥ 140/90 mmHg, phần lớn hướng dẫn khuyến cáo phối hợp 2 loại thuốc ngay từ đầu — 1 thuốc thường không đủ kiểm soát HA đến mục tiêu < 130/80.',
    detail: 'Tăng HA độ 2 là ngưỡng cần can thiệp y tế tích cực ngay — thay đổi lối sống đơn thuần không đủ nhanh để bảo vệ cơ quan đích.',
    details: [
      'Ở mức ≥ 140/90 mmHg, nguy cơ tổn thương cơ quan đích (tim, não, thận, mắt, mạch máu) tăng theo cấp số nhân — cần hạ HA nhanh nhưng có kiểm soát.',
      'Phối hợp 2 thuốc thường được khuyến cáo ngay từ đầu thay vì đơn trị liệu — thường là ACE inhibitor/ARB + thiazide hoặc calcium channel blocker.',
      'Mục tiêu HA ở người có bệnh nền: < 130/80 (tiểu đường, bệnh thận), < 125/75 (protein niệu cao). Không phải một mục tiêu cho tất cả.',
      'Tổn thương cơ quan đích cần kiểm tra định kỳ: ECG (tim), creatinine + eGFR (thận), soi đáy mắt (võng mạc), siêu âm tim (nếu có triệu chứng).',
      'Tránh hạ HA quá nhanh: người cao tuổi, xơ vữa nặng — hạ HA đột ngột có thể gây thiếu máu não (chóng mặt, ngất, đột quỵ do giảm tưới máu).',
      'Theo dõi tại nhà 2 lần/ngày (sáng + tối) và ghi lại nhật ký: cung cấp thông tin quan trọng cho bác sĩ điều chỉnh thuốc hiệu quả hơn đo tại phòng khám.',
    ],
    points: [
      { icon: '💊', label: 'Phối hợp 2 thuốc', note: '1 thuốc thường không đủ ở mức này' },
      { icon: '🫀', label: 'Kiểm tra cơ quan đích', note: 'Tim, thận, mắt, não' },
      { icon: '📉', label: 'Hạ từ từ', note: 'Không hạ đột ngột ở người cao tuổi' },
      { icon: '📓', label: 'Nhật ký sáng + tối', note: 'Dữ liệu thực hơn đo tại phòng khám' },
    ],
  },
  {
    label: 'Khủng hoảng HA', sys: '> 180', dia: '> 120', color: '#ef4444', rgb: '239,68,68', bg: '#ef444430',
    action: 'Đến cấp cứu ngay nếu có triệu chứng (đau đầu dữ dội, mờ mắt, đau ngực).',
    icon: '🆘',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=800&q=80',
    keyFact: '💡 Hypertensive emergency (>180/120 + tổn thương cơ quan) đòi hỏi hạ HA bằng thuốc truyền tĩnh mạch tại ICU — không phải uống thêm thuốc tại nhà. Gọi 115 ngay.',
    detail: 'Khủng hoảng huyết áp là cấp cứu nội khoa thực sự — tổn thương não, tim, thận có thể xảy ra trong vài giờ nếu không điều trị.',
    details: [
      'Phân biệt 2 loại: Hypertensive urgency (>180/120, không có triệu chứng tổn thương cơ quan) — có thể kiểm soát trong 24–48h. Hypertensive emergency (>180/120 + triệu chứng) — cần ICU ngay.',
      'Triệu chứng của hypertensive emergency: đau đầu dữ dội (thunderclap headache), mờ mắt hoặc mất thị lực đột ngột, đau ngực, khó thở, lú lẫn, yếu liệt tay chân một bên, nói khó.',
      'KHÔNG tự uống thêm thuốc huyết áp tại nhà khi HA > 180/120 kèm triệu chứng — thuốc uống tác dụng chậm và không kiểm soát được tốc độ hạ HA.',
      'Tại ICU: thuốc hạ HA truyền tĩnh mạch (labetalol, nicardipine, sodium nitroprusside) cho phép điều chỉnh chính xác tốc độ hạ HA từng phút.',
      'Mục tiêu hạ HA trong khủng hoảng: giảm không quá 25% trong giờ đầu — hạ quá nhanh gây đột quỵ do thiếu máu não (ischemic stroke) do mạch não đã thích nghi với HA cao.',
      'Sau khi ổn định: tìm nguyên nhân thứ phát (hẹp động mạch thận, u tủy thượng thận, hội chứng Cushing) — 5–10% tăng HA có nguyên nhân có thể điều trị triệt để.',
    ],
    points: [
      { icon: '🚑', label: 'Gọi 115 ngay', note: 'Không tự lái xe khi HA > 180/120 + triệu chứng' },
      { icon: '🏥', label: 'Điều trị tại ICU', note: 'Thuốc truyền tĩnh mạch — không uống tại nhà' },
      { icon: '📉', label: 'Hạ chậm có kiểm soát', note: 'Không quá 25% trong giờ đầu' },
      { icon: '🔬', label: 'Tìm nguyên nhân thứ phát', note: 'Sau ổn định — 5-10% có nguyên nhân chữa được' },
    ],
  },
];

const STEPS = [
  {
    num: '1', icon: '🪑', title: 'Nghỉ ngơi 5 phút', desc: 'Ngồi yên, không nói chuyện, tư thế thoải mái trước khi đo.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    keyFact: '💡 Không nghỉ ngơi trước khi đo có thể làm HA cao hơn thực tế 10–20 mmHg — đủ để bị chẩn đoán nhầm là tăng huyết áp.',
    detail: 'Nghỉ ngơi 5 phút trước khi đo là bước quan trọng nhất thường bị bỏ qua — cơ thể cần thời gian để đưa hệ thần kinh giao cảm về trạng thái nghỉ.',
    details: [
      'Khi vừa đi bộ, leo cầu thang, hoặc hoạt động thể lực, hệ thần kinh giao cảm tăng cường → tim đập nhanh hơn, mạch máu co lại → HA tăng giả tạo 10–20 mmHg.',
      'Nói chuyện trong khi đo cũng làm tăng HA 5–10 mmHg — không chỉ hoạt động thể chất mà cả kích thích tâm lý cũng ảnh hưởng.',
      '"White coat hypertension" (tăng HA áo choàng trắng): HA tăng khi gặp bác sĩ do lo lắng — chiếm 15–30% ca tăng HA được ghi nhận tại phòng khám.',
      'Giải pháp cho white coat hypertension: đo HA tại nhà (HBPM — Home Blood Pressure Monitoring) cho kết quả phản ánh thực tế hơn.',
      'Không nói chuyện điện thoại, không xem tin tức căng thẳng trong 5 phút trước đo. Ngồi im, thở đều, thư giãn cơ bắp.',
      'Nếu không có đủ 5 phút, tối thiểu cần 2–3 phút — đủ để nhịp tim bắt đầu ổn định về baseline.',
    ],
    points: [
      { icon: '⏱️', label: '5 phút tối thiểu', note: 'Không đo ngay sau hoạt động' },
      { icon: '🤫', label: 'Không nói chuyện', note: 'Tăng thêm 5–10 mmHg nếu nói' },
      { icon: '🏠', label: 'Đo tại nhà tốt hơn', note: 'Tránh white coat hypertension' },
      { icon: '😌', label: 'Thư giãn tâm lý', note: 'Lo lắng → HA giả tạo tăng cao' },
    ],
  },
  {
    num: '2', icon: '☕', title: 'Tránh cà phê & thuốc lá', desc: 'Không dùng cà phê, thuốc lá, rượu 30 phút trước khi đo.',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    keyFact: '💡 Caffeine làm tăng HA tạm thời 5–10 mmHg trong 30–60 phút. Nicotine từ thuốc lá làm tăng HA 5–10 mmHg và kéo dài 15–30 phút sau mỗi điếu.',
    detail: 'Các chất kích thích tác động trực tiếp lên hệ tim mạch và thần kinh tự chủ — đo HA sau dùng cà phê hoặc thuốc lá cho kết quả không phản ánh thực trạng.',
    details: [
      'Caffeine ức chế adenosine (chất giãn mạch) và kích thích giải phóng adrenaline → co mạch, tăng nhịp tim, tăng HA tạm thời 5–10 mmHg trong 30–60 phút.',
      'Nicotine kích thích hệ thần kinh giao cảm và giải phóng catecholamine → co mạch mạnh, tăng HA 5–10 mmHg và nhịp tim 10–20 bpm sau mỗi điếu thuốc.',
      'Rượu: liều thấp có thể hạ HA tạm thời, nhưng uống nhiều (>2 ly/ngày) làm tăng HA mạn tính 3–4 mmHg và tăng nguy cơ loạn nhịp.',
      'Không chỉ cà phê — tất cả nguồn caffeine: trà đậm, nước tăng lực, socola đậm đều cần tránh 30 phút trước đo.',
      'Nếu bạn uống cà phê hàng ngày và muốn đo HA chính xác: đo vào buổi sáng sớm TRƯỚC khi uống cà phê, sau khi thức 15 phút và nghỉ ngơi.',
      'Người đang cai thuốc lá: HA thường giảm trong vài tuần đầu sau khi ngừng hoàn toàn — đây là một trong những thay đổi lối sống hiệu quả nhất.',
    ],
    points: [
      { icon: '☕', label: 'Cà phê: chờ 30–60 phút', note: 'Caffeine tăng HA 5–10 mmHg tạm thời' },
      { icon: '🚬', label: 'Thuốc lá: chờ 30 phút', note: 'Nicotine co mạch, tăng nhịp tim' },
      { icon: '🍺', label: 'Rượu bia: chờ ít nhất 1h', note: 'Ảnh hưởng HA phức tạp cả ngắn và dài' },
      { icon: '🌅', label: 'Đo sáng sớm', note: 'Trước ăn, trước cà phê — chuẩn nhất' },
    ],
  },
  {
    num: '3', icon: '🪑', title: 'Tư thế chuẩn', desc: 'Ngồi ngay lưng, hai chân chạm đất, tay đặt bằng tim trên bàn.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 Tư thế tay thấp hơn tim làm HA cao hơn thực tế 5–10 mmHg. Bắt chéo chân khi đo làm HA tâm thu tăng thêm 2–8 mmHg.',
    detail: 'Tư thế đo quyết định đến 10–15 mmHg trong kết quả — sai tư thế là nguồn sai số phổ biến nhất khi đo HA tại nhà.',
    details: [
      'Nguyên tắc vật lý: tay ở vị trí thấp hơn tim → cột máu từ tim xuống tay tạo áp lực thủy tĩnh thêm → máy đo ghi nhận HA cao hơn thực tế 5–10 mmHg.',
      'Ngược lại: tay giơ cao hơn tim → áp lực giảm → HA đọc thấp hơn thực. Tay phải ngang tim — đặt trên bàn, không cầm trên không hay để thõng xuống.',
      'Bắt chéo chân: làm tăng áp lực trong ổ bụng và tĩnh mạch chi dưới → tăng lượng máu hồi về tim → tăng cardiac output → tăng HA 2–8 mmHg.',
      'Lưng không tựa vào ghế: cơ lưng phải hoạt động để giữ thẳng → tăng trương lực cơ → kích thích hệ giao cảm → HA tăng 5–6 mmHg.',
      'Băng quấn ở tay nào? Khuyến cáo đo ở tay không thuận (thường là tay trái) để thuận tiện. Lần đầu nên đo cả 2 tay — nếu chênh >10 mmHg cần đánh giá thêm.',
      'Tư thế nằm vs ngồi: kết quả có thể khác nhau 5–10 mmHg — luôn ghi chú tư thế khi theo dõi dài hạn để so sánh nhất quán.',
    ],
    points: [
      { icon: '💪', label: 'Tay ngang tim', note: 'Thấp hơn → +5–10 mmHg sai số' },
      { icon: '🦵', label: 'Không bắt chéo chân', note: 'Tăng áp lực ổ bụng +2–8 mmHg' },
      { icon: '🪑', label: 'Lưng tựa ghế', note: 'Cơ lưng gắng sức → HA tăng giả' },
      { icon: '🔄', label: 'Đo cả 2 tay lần đầu', note: 'Chênh >10 mmHg cần đánh giá' },
    ],
  },
  {
    num: '4', icon: '💪', title: 'Băng quấn đúng cỡ', desc: 'Băng quấn ôm sát, cách nếp khuỷu tay 2–3cm. Không quấn lên áo.',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80',
    keyFact: '💡 Băng quấn quá nhỏ (vòng cánh tay lớn hơn cỡ) làm HA đọc cao hơn thực tế 5–8 mmHg. Quấn lên áo quần dày làm tăng thêm 10–50 mmHg.',
    detail: 'Cỡ băng quấn và cách quấn ảnh hưởng đến kết quả nhiều hơn hầu hết mọi người nghĩ — đây là nguồn sai số phổ biến nhất trong đo HA tại nhà.',
    details: [
      'Cỡ băng quấn chuẩn cho người lớn: vòng cánh tay 22–32cm (cỡ "standard"). Cánh tay to hơn cần cỡ "large" (32–42cm). Dùng sai cỡ → sai số đến 5–8 mmHg.',
      'Kiểm tra cỡ: đặt 2 ngón tay vào trong băng quấn sau khi quấn — nếu quá chật hoặc quá lỏng đều không chuẩn. Băng phải ôm sát nhưng không thắt.',
      'Quấn lên áo dày: vải tạo thêm lực cản → áp lực cần cao hơn để bóp mạch → máy đọc HA cao hơn thực tế, sai số có thể đến 10–50 mmHg tùy độ dày áo.',
      'Vị trí chuẩn: mép dưới băng quấn cách nếp khuỷu tay (cubital fossa) 2–3cm. Ống cảm biến (artery marker) nằm ngay trên động mạch cánh tay.',
      'Ống nghe hay đồng hồ: không nên đặt ống nghe dưới băng quấn — đặt trên nếp khuỷu tay sau khi quấn xong.',
      'Máy đo cổ tay: tiện lợi nhưng kém chính xác hơn máy đo bắp tay, đặc biệt ở người cao tuổi có mạch xơ cứng. Cũng cần đặt ngang tim khi dùng.',
    ],
    points: [
      { icon: '📏', label: 'Đo vòng cánh tay trước', note: '22–32cm = cỡ standard, >32cm = large' },
      { icon: '🧥', label: 'Không quấn lên áo dày', note: 'Sai số đến 10–50 mmHg' },
      { icon: '📍', label: 'Cách khuỷu tay 2–3cm', note: 'Marker mạch ngay trên động mạch' },
      { icon: '⌚', label: 'Cổ tay kém chính xác hơn', note: 'Bắp tay = chuẩn hơn cho theo dõi' },
    ],
  },
  {
    num: '5', icon: '🔁', title: 'Đo 2 lần liên tiếp', desc: 'Nghỉ 1–2 phút giữa 2 lần đo. Ghi lại trị số trung bình.',
    img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80',
    keyFact: '💡 Lần đo đầu tiên thường cao hơn 5–10 mmHg so với lần thứ hai do phản ứng cảnh báo (alerting response). Luôn lấy trung bình ít nhất 2 lần.',
    detail: 'Đo một lần duy nhất không đủ đáng tin cậy để đưa ra quyết định lâm sàng — biến thiên tự nhiên của HA đòi hỏi ít nhất 2–3 lần đo để có giá trị đại diện.',
    details: [
      '"Alerting response": lần đo đầu tiên kích hoạt phản ứng cảnh giác nhẹ (orientating reflex) → hệ giao cảm tăng nhẹ → HA cao hơn 5–10 mmHg so với lần thứ hai.',
      'Cần nghỉ 1–2 phút giữa các lần đo để: (1) mạch máu phục hồi sau khi bị bóp; (2) hệ thần kinh trở về trạng thái cơ sở.',
      'Theo khuyến cáo AHA: đo ít nhất 2 lần mỗi buổi (sáng + tối), ghi lại cả hai và tính trung bình, trong ít nhất 7 ngày liên tiếp trước khi kết luận.',
      'HA biến thiên tự nhiên trong ngày: cao nhất vào sáng sớm (6–10h sáng — morning surge), thấp nhất lúc ngủ. Người bị tăng HA không có "nocturnal dipping" (HA không giảm ban đêm) có nguy cơ cao hơn.',
      'Sổ nhật ký HA: ghi ngày, giờ, lần đo 1, lần đo 2, trung bình, nhịp tim, ghi chú (uống thuốc lúc nào, trạng thái tâm lý) — bác sĩ sẽ dùng dữ liệu này để điều chỉnh điều trị.',
      'Một lần đo cao tại phòng khám không đủ để chẩn đoán tăng HA — cần đo nhiều lần ở nhiều thời điểm khác nhau, hoặc đeo Holter HA 24h (ABPM) để xác nhận.',
    ],
    points: [
      { icon: '⏳', label: 'Nghỉ 1–2 phút giữa lần đo', note: 'Mạch cần phục hồi sau bóp' },
      { icon: '📊', label: 'Lấy trung bình 2 lần', note: 'Lần 1 thường cao hơn do alerting' },
      { icon: '📓', label: 'Nhật ký 7 ngày', note: 'AHA khuyến cáo trước khi kết luận' },
      { icon: '🏥', label: '1 lần cao chưa = tăng HA', note: 'Cần nhiều lần xác nhận chẩn đoán' },
    ],
  },
];

const LIFESTYLE = [
  {
    icon: '🧂', title: 'Giảm muối', desc: '< 5g muối/ngày (1 muỗng cà phê). Tránh đồ đóng hộp, mì gói.',
    img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80',
    keyFact: '💡 Giảm muối từ 9g xuống 5g/ngày có thể giảm HA tâm thu 4–5 mmHg ở người bình thường và 5–7 mmHg ở người tăng HA — hiệu quả tương đương một nửa liều thuốc huyết áp nhẹ.',
    detail: '75–80% lượng muối chúng ta ăn đến từ thực phẩm chế biến sẵn, không phải từ muối nêm khi nấu — đọc nhãn dinh dưỡng là kỹ năng quan trọng nhất để giảm muối hiệu quả.',
    details: [
      'Ngưỡng WHO: < 5g muối/ngày (tương đương < 2g natri). Người Việt Nam trung bình ăn 9–12g/ngày — gấp đôi mức khuyến cáo.',
      'Nguồn muối ẩn phổ biến nhất: nước mắm (1 muỗng canh = 1.4g natri), tương, xì dầu, mì gói (1 gói = 1.5–2g natri), bánh mì, phô mai, đồ hộp.',
      'Cách đọc nhãn: tìm "Sodium" hoặc "Na" trên bao bì. < 120mg/100g = ít muối; > 600mg/100g = nhiều muối. Chú ý khẩu phần ăn (serving size).',
      'Chiến lược giảm từ từ: giảm 25% lượng muối mỗi 2 tuần — khẩu vị thích nghi dần, sau 6–8 tuần không còn thấy nhạt. Tăng đột ngột sẽ thất bại vì khó chịu.',
      'Thay thế hương vị: tỏi, gừng, chanh, ớt, herbs tươi (húng quế, ngò, thì là) — tăng hương vị mà không cần thêm muối. Kali trong rau quả còn đối kháng tác dụng của natri.',
      'DASH diet + giảm natri kết hợp: giảm HA 8–14 mmHg — hiệu quả nhất trong các can thiệp lối sống đơn lẻ theo meta-analysis.',
    ],
    points: [
      { icon: '📏', label: '< 5g muối/ngày', note: '1 muỗng cà phê = ~5g — mức mục tiêu' },
      { icon: '🏷️', label: 'Đọc nhãn Sodium', note: '>600mg/100g = sản phẩm nhiều muối' },
      { icon: '📉', label: 'Giảm từ từ 25%/2 tuần', note: 'Khẩu vị thích nghi — không bỏ đột ngột' },
      { icon: '🍋', label: 'Thay bằng herbs & chanh', note: 'Kali trong rau đối kháng natri' },
    ],
  },
  {
    icon: '🥦', title: 'Ăn nhiều rau quả', desc: 'DASH diet: rau, trái cây, ngũ cốc nguyên hạt, sữa ít béo.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '💡 DASH diet (Dietary Approaches to Stop Hypertension) giảm HA tâm thu 8–14 mmHg trong 2 tuần — nhanh hơn và mạnh hơn hầu hết các can thiệp lối sống đơn lẻ khác.',
    detail: 'DASH không chỉ là "ăn nhiều rau" — đây là hệ thống dinh dưỡng toàn diện được thiết kế để tác động lên nhiều cơ chế điều hòa huyết áp cùng lúc.',
    details: [
      'DASH diet nguyên tắc: 4–5 khẩu phần rau/ngày, 4–5 khẩu phần trái cây/ngày, 6–8 khẩu phần ngũ cốc nguyên hạt, 2–3 khẩu phần sữa ít béo, ≤6oz thịt nạc/ngày.',
      'Cơ chế: DASH tăng kali, magiê, canxi (3 khoáng chất giãn mạch) trong khi giảm natri, chất béo bão hòa, cholesterol — tấn công nhiều con đường gây tăng HA cùng lúc.',
      'Kali đặc biệt quan trọng: đối kháng trực tiếp tác dụng co mạch của natri, kích thích thận đào thải natri. Nguồn tốt: chuối, khoai lang, bơ, đậu đen, rau bina.',
      'Magiê giãn cơ trơn thành mạch: thiếu magiê liên quan đến co thắt mạch và tăng HA. Nguồn: hạt bí, hạnh nhân, đậu phụ, ngũ cốc nguyên hạt.',
      'Fiber từ rau và ngũ cốc nguyên hạt giảm hấp thu cholesterol, giảm viêm mạn tính — cả hai đều liên quan đến sức khỏe mạch máu lâu dài.',
      'DASH + giảm natri (Low Sodium DASH): giảm HA tâm thu 11–16 mmHg — tốt nhất trong tất cả các can thiệp dinh dưỡng theo NEJM 2001.',
    ],
    points: [
      { icon: '🍌', label: 'Kali — đối kháng natri', note: 'Chuối, khoai lang, bơ, đậu đen' },
      { icon: '🥜', label: 'Magiê — giãn mạch', note: 'Hạt bí, hạnh nhân, ngũ cốc nguyên hạt' },
      { icon: '📉', label: 'DASH giảm 8–14 mmHg', note: 'Kết quả thấy sau 2 tuần' },
      { icon: '🔗', label: 'DASH + ít muối', note: 'Giảm 11–16 mmHg — mạnh nhất' },
    ],
  },
  {
    icon: '🏃', title: 'Vận động đều', desc: '150 phút/tuần cường độ vừa (đi bộ nhanh, bơi lội, đạp xe).',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    keyFact: '💡 Tập aerobic đều đặn giảm HA tâm thu 5–8 mmHg ở người tăng HA. Chỉ cần 30 phút đi bộ nhanh, 5 ngày/tuần — không cần phòng gym hay thiết bị đặc biệt.',
    detail: 'Vận động là "thuốc" không cần đơn — cơ chế sinh lý trực tiếp làm giảm huyết áp thông qua nhiều con đường khác nhau, không chỉ giảm cân.',
    details: [
      'Cơ chế ngay lập tức: sau 1 buổi tập aerobic, HA giảm 5–7 mmHg trong 4–12 giờ tiếp theo (post-exercise hypotension) — người tăng HA nên tận dụng tập vào buổi sáng.',
      'Cơ chế dài hạn: tập đều đặn → tim khỏe hơn (giảm nhịp tim lúc nghỉ) → giảm cardiac output → giảm HA cơ bản. Giảm cứng mạch (arterial stiffness) theo tuổi tác.',
      'Vận động kháng lực (tập tạ): cũng giảm HA 2–4 mmHg khi tập đều đặn — kết hợp aerobic + tập tạ hiệu quả hơn chỉ làm 1 loại.',
      'Cường độ tối ưu: vừa phải — có thể nói chuyện ngắn nhưng không thể hát (khoảng 50–70% nhịp tim tối đa). Cường độ quá cao có thể tăng HA tạm thời trong khi tập.',
      'Không cần liên tục: 3 buổi × 10 phút = 30 phút cũng hiệu quả tương đương 1 buổi 30 phút liên tục theo nghiên cứu. Phù hợp cho người bận rộn.',
      'Thận trọng với người HA > 180/110: cần kiểm soát HA trước bằng thuốc trước khi bắt đầu chương trình tập luyện cường độ cao — tập nhẹ (đi bộ) vẫn an toàn.',
    ],
    points: [
      { icon: '⚡', label: 'Giảm HA ngay sau tập', note: 'Post-exercise hypotension 4–12h' },
      { icon: '🏋️', label: 'Kết hợp aerobic + tạ', note: 'Hiệu quả hơn chỉ làm 1 loại' },
      { icon: '⏱️', label: '3 × 10 phút = 30 phút', note: 'Chia nhỏ cũng hiệu quả tương đương' },
      { icon: '⚠️', label: 'HA > 180: cần kiểm soát trước', note: 'Dùng thuốc ổn định rồi mới tăng cường độ' },
    ],
  },
  {
    icon: '⚖️', title: 'Giữ cân nặng hợp lý', desc: 'Giảm 1kg → HA giảm ~1 mmHg. Mục tiêu BMI 18.5–24.9.',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    keyFact: '💡 Giảm 5–10% cân nặng ở người thừa cân béo phì có thể giảm HA 5–20 mmHg — một trong những can thiệp lối sống mạnh nhất, đặc biệt với người béo bụng.',
    detail: 'Béo phì tăng HA qua nhiều cơ chế: tăng thể tích máu tuần hoàn, kháng insulin, tăng hoạt động hệ renin-angiotensin, tăng áp lực cơ học lên thận.',
    details: [
      'Cơ chế béo phì → tăng HA: mô mỡ (đặc biệt mỡ nội tạng) tiết adipokine làm tăng hoạt động hệ giao cảm và hệ renin-angiotensin-aldosterone → co mạch, giữ natri → tăng HA.',
      'Mỡ bụng (waist circumference) quan trọng hơn BMI: nam > 90cm, nữ > 80cm (tiêu chuẩn châu Á) là nguy cơ tim mạch chuyển hóa cao — dù BMI còn trong giới hạn.',
      'Mỗi 1kg giảm = giảm ~1 mmHg HA tâm thu theo bằng chứng tổng hợp. Người thừa cân giảm 5–10% cân nặng → giảm HA 5–20 mmHg.',
      'Không cần giảm về cân nặng lý tưởng: chỉ cần giảm 3–5% cân nặng ban đầu đã mang lại lợi ích tim mạch đáng kể — mục tiêu khả thi hơn và dễ duy trì hơn.',
      'Kết hợp giảm cân + giảm muối + DASH diet: hiệu quả cộng hưởng, không chỉ cộng gộp — có thể giảm HA 15–20 mmHg mà không cần thuốc ở người tăng HA nhẹ-vừa.',
      'Tránh giảm cân cực đoan: yo-yo effect (giảm rồi tăng lại) làm tổn thương thành mạch và gây dao động HA có hại. Giảm chậm 0.5–1kg/tuần và duy trì dài hạn.',
    ],
    points: [
      { icon: '📏', label: 'Đo vòng bụng', note: 'Nam <90cm, nữ <80cm (châu Á)' },
      { icon: '📉', label: 'Giảm 5–10% = hiệu quả lớn', note: 'Không cần về cân nặng lý tưởng' },
      { icon: '🔗', label: 'Kết hợp DASH + muối ít', note: 'Hiệu quả cộng hưởng, không chỉ cộng' },
      { icon: '⚠️', label: 'Tránh yo-yo diet', note: 'Dao động cân gây hại thành mạch' },
    ],
  },
  {
    icon: '🚭', title: 'Không hút thuốc', desc: 'Bỏ thuốc lá → HA giảm ngay trong vài tuần đầu.',
    img: 'https://images.unsplash.com/photo-1528475979590-4e47a83f79f5?w=800&q=80',
    keyFact: '💡 Mỗi điếu thuốc lá làm tăng HA tạm thời 5–10 mmHg trong 15–30 phút. Người hút 1 gói/ngày trải qua hàng chục đợt tăng HA như vậy mỗi ngày — tổng thiệt hại tích lũy rất lớn.',
    detail: 'Thuốc lá không chỉ tăng HA — nicotine và các chất độc hại trong khói thuốc tấn công trực tiếp thành mạch máu, gây xơ vữa, giảm đàn hồi và tăng cục máu đông.',
    details: [
      'Nicotine kích thích hạch giao cảm và tủy thượng thận → giải phóng adrenaline, noradrenaline → co mạch, tăng nhịp tim, tăng HA 5–10 mmHg mỗi điếu thuốc.',
      'Carbon monoxide (CO) trong khói thuốc gắn hemoglobin thay oxy → tim phải bơm mạnh hơn để cung cấp đủ oxy → tăng cardiac output → tăng HA.',
      'Tổn thương nội mạc mạch (endothelium): khói thuốc giảm NO (nitric oxide — chất giãn mạch tự nhiên), tăng endothelin (co mạch) → mất cân bằng vận mạch → co mạch mạn tính.',
      'Xơ vữa động mạch: thuốc lá tăng LDL, giảm HDL, tăng viêm, tăng kết dính tiểu cầu → mảng bám hình thành nhanh hơn, dễ vỡ hơn.',
      'Bỏ thuốc lá 20 phút: nhịp tim và HA bắt đầu giảm. 1 tuần: cải thiện tuần hoàn. 1 năm: nguy cơ bệnh mạch vành giảm 50%. 5 năm: nguy cơ đột quỵ về gần bằng người không hút.',
      'Hỗ trợ cai thuốc: nicotine replacement (patch, gum), varenicline (Champix), bupropion — tỷ lệ thành công tăng gấp 2–3 lần so với tự cai không hỗ trợ.',
    ],
    points: [
      { icon: '⚡', label: '+5–10 mmHg/điếu', note: 'Kéo dài 15–30 phút mỗi lần' },
      { icon: '🩺', label: 'Bỏ 20 phút: HA giảm ngay', note: 'Tim bắt đầu phục hồi từ phút đầu tiên' },
      { icon: '📅', label: '1 năm: tim mạch giảm 50%', note: 'Nguy cơ bệnh mạch vành' },
      { icon: '💊', label: 'Hỗ trợ cai thuốc hiệu quả', note: 'Patch/gum/Champix tăng tỷ lệ thành công 2–3x' },
    ],
  },
  {
    icon: '🧘', title: 'Kiểm soát stress', desc: 'Thở sâu, thiền, yoga → giảm hệ thần kinh giao cảm.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    keyFact: '💡 Stress mạn tính kích hoạt hệ thần kinh giao cảm liên tục → tăng cortisol, giữ natri, co mạch → tăng HA. Thiền định đều đặn giảm HA tâm thu 4–5 mmHg theo meta-analysis.',
    detail: 'Stress không chỉ làm HA tăng tức thời — stress mạn tính dẫn đến hành vi có hại (ăn nhiều, uống rượu, ít vận động) và thay đổi sinh lý lâu dài gây tăng HA thực sự.',
    details: [
      'Cơ chế stress → tăng HA: kích hoạt trục HPA (hypothalamic-pituitary-adrenal) → cortisol tăng → giữ natri, nước → tăng thể tích máu. Đồng thời kích hoạt hệ giao cảm → noradrenaline → co mạch.',
      'Stress mạn tính vs cấp tính: stress cấp (deadline, tranh luận) → tăng HA tạm thời, phục hồi sau vài giờ. Stress mạn (công việc áp lực kéo dài, quan hệ căng thẳng) → tăng HA cơ bản.',
      'Thiền chánh niệm (mindfulness): 8 tuần MBSR (Mindfulness-Based Stress Reduction) giảm HA tâm thu 4.7 mmHg, tâm trương 3.2 mmHg theo meta-analysis 2019.',
      'Thở bụng 4-7-8 (hít 4s, nín 7s, thở ra 8s): kích hoạt hệ thần kinh phó giao cảm (vagus nerve) → giảm nhịp tim và HA trong 5–10 phút thực hành.',
      'Yoga kết hợp vận động + hơi thở + thiền: giảm HA tâm thu 5 mmHg, tâm trương 3.9 mmHg theo review Cochrane 2014. Phù hợp với người cao tuổi và người ít vận động.',
      'Ngủ đủ giấc là kiểm soát stress quan trọng: ngủ < 6h/đêm tăng nguy cơ tăng HA 20–32%. Sleep apnea (ngưng thở khi ngủ) là nguyên nhân tăng HA thứ phát phổ biến — cần điều trị đặc hiệu.',
    ],
    points: [
      { icon: '🫁', label: 'Thở 4-7-8', note: 'Kích hoạt vagus nerve — giảm HA trong phút' },
      { icon: '🧘', label: 'Thiền 8 tuần MBSR', note: 'Giảm 4.7/3.2 mmHg theo meta-analysis' },
      { icon: '😴', label: 'Ngủ ≥ 7 giờ', note: '<6h/đêm → nguy cơ tăng HA +20–32%' },
      { icon: '😴', label: 'Tầm soát sleep apnea', note: 'Ngáy to + buồn ngủ ban ngày → cần kiểm tra' },
    ],
  },
];

function BPModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
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
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
            <h2 className="font-bold text-2xl md:text-3xl" style={{ color: item.color }}>{item.label}</h2>
          </div>
          <p className="font-semibold text-base mb-2 pl-6" style={{ color: `rgba(${item.rgb},0.7)` }}>
            Tâm thu: {item.sys} &nbsp;·&nbsp; Tâm trương: {item.dia}
          </p>
          <div className="rounded-2xl px-4 py-3 mb-6 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}` }}>
            {item.keyFact}
          </div>
          <p className="text-muted text-base leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
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
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function BPEntryModal({ entry, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const cls = entry.sys > 180 || entry.dia > 120 ? BP_CATS[4]
    : entry.sys >= 140 || entry.dia >= 90 ? BP_CATS[3]
    : entry.sys >= 130 || entry.dia >= 80 ? BP_CATS[2]
    : entry.sys >= 120 ? BP_CATS[1]
    : BP_CATS[0];

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
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${cls.rgb},0.30)`, boxShadow: `0 0 80px rgba(${cls.rgb},0.18)` }}
        onClick={e => e.stopPropagation()}>

        {/* Reading hero */}
        <div className="relative rounded-t-3xl overflow-hidden shrink-0 py-10 flex flex-col items-center justify-center"
          style={{ background: `rgba(${cls.rgb},0.07)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${cls.color}, transparent)` }} />
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-black" style={{ fontSize: '3.5rem', lineHeight: 1, color: cls.color }}>{entry.sys}/{entry.dia}</span>
            <span className="text-lg font-bold text-muted">mmHg</span>
          </div>
          {entry.pulse && <span className="text-base text-muted mb-1">♥ {entry.pulse} bpm</span>}
          <span className="text-sm text-muted opacity-60">{entry.date} · {entry.time}</span>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6">
          {/* Classification badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cls.color }} />
            <span className="font-bold text-xl" style={{ color: cls.color }}>{cls.label}</span>
            <span className="ml-auto text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest"
              style={{ background: `rgba(${cls.rgb},0.12)`, color: cls.color }}>
              Tâm thu {cls.sys} · Tâm trương {cls.dia}
            </span>
          </div>

          {/* Key fact */}
          <div className="rounded-2xl px-4 py-3 mb-5 text-sm leading-relaxed" style={{ background: `rgba(${cls.rgb},0.08)`, borderLeft: `3px solid ${cls.color}` }}>
            {cls.keyFact}
          </div>

          {/* Recommended action */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: cls.color }}>Khuyến nghị</p>
            <p className="text-base text-muted leading-relaxed">{cls.action}</p>
          </div>

          {/* 3 key details */}
          <ul className="space-y-3 mb-5">
            {cls.details.slice(0, 3).map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${cls.rgb},0.14)`, color: cls.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* 2-col key points */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {cls.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2 rounded-2xl p-3"
                style={{ background: `rgba(${cls.rgb},0.06)`, border: `1px solid rgba(${cls.rgb},0.14)` }}>
                <span className="text-xl shrink-0">{pt.icon}</span>
                <div>
                  <p className="font-bold text-xs text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? cls.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${cls.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${cls.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? cls.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${cls.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${cls.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
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
      const el = document.getElementById(`reveal-bp-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      id={`reveal-bp-${delay}`}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s`,
      }}
    >
      {children}
    </div>
  );
}

function BPJournal() {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_bp_journal') || '[]'); }
    catch { return []; }
  });
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');
  const [entryModal, setEntryModal] = useState(null);

  function addEntry() {
    if (!sys || !dia) return;
    const now = new Date();
    const entry = { sys: +sys, dia: +dia, pulse: +pulse || null, date: now.toLocaleDateString('vi-VN'), time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    const updated = [entry, ...entries].slice(0, 14);
    setEntries(updated);
    localStorage.setItem('healthapp_bp_journal', JSON.stringify(updated));
    setSys(''); setDia(''); setPulse('');
  }

  function getColor(s, d) {
    if (s > 180 || d > 120) return '#7f1d1d';
    if (s >= 140 || d >= 90) return '#ef4444';
    if (s >= 130 || d >= 80) return '#f97316';
    if (s >= 120) return '#eab308';
    return '#22c55e';
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold text-text mb-4" style={{ color: COLOR }}>Nhật Ký Huyết Áp 7 Ngày</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={sys} onChange={e => setSys(e.target.value)} placeholder="Tâm thu (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={dia} onChange={e => setDia(e.target.value)} placeholder="Tâm trương (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={pulse} onChange={e => setPulse(e.target.value)} placeholder="Nhịp tim (bpm)" type="number" className="flex-1 min-w-[100px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <button onClick={addEntry} className="px-4 py-2 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>+ Thêm</button>
      </div>
      {entries.length === 0 && <p className="text-muted text-lg text-center py-6">Chưa có dữ liệu. Thêm lần đo đầu tiên.</p>}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((e, i) => (
          <div key={i}
            onClick={() => setEntryModal(i)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 border border-border cursor-pointer hover:border-opacity-60 transition-colors"
            style={{ '--hover-color': getColor(e.sys, e.dia) }}
            onMouseEnter={el => el.currentTarget.style.borderColor = getColor(e.sys, e.dia) + '66'}
            onMouseLeave={el => el.currentTarget.style.borderColor = ''}>
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(e.sys, e.dia) }} />
            <span className="font-bold text-lg" style={{ color: getColor(e.sys, e.dia) }}>{e.sys}/{e.dia}</span>
            {e.pulse && <span className="text-base text-muted">♥ {e.pulse} bpm</span>}
            <span className="text-base text-muted ml-auto">{e.date} {e.time}</span>
            <span className="text-muted text-sm shrink-0">→</span>
          </div>
        ))}
      </div>
      {entryModal !== null && entries[entryModal] && (
        <BPEntryModal
          entry={entries[entryModal]}
          idx={entryModal}
          total={entries.length}
          onClose={() => setEntryModal(null)}
          onPrev={() => setEntryModal(i => Math.max(0, i - 1))}
          onNext={() => setEntryModal(i => Math.min(entries.length - 1, i + 1))}
          hasPrev={entryModal > 0}
          hasNext={entryModal < entries.length - 1}
        />
      )}
    </div>
  );
}

export default function HealthBPPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [bpModal, setBpModal] = useState(null);
  const [stepModal, setStepModal] = useState(null);
  const [lifestyleModal, setLifestyleModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBpOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eBpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        ← Kiến Thức Sức Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>
          🫀
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Huyết Áp</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Chỉ số sinh tồn · Theo dõi thường xuyên
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Huyết áp là áp lực máu tác động lên thành mạch. Tăng huyết áp không triệu chứng thường trực — được gọi là "kẻ giết người thầm lặng" — và là nguyên nhân hàng đầu của đột quỵ, nhồi máu cơ tim.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&auto=format&fit=crop" alt="Đo huyết áp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Đo đúng cách · Đọc đúng số
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Personalized banner */}
      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — Nên đo huyết áp {b0.age >= 40 ? 'mỗi 3–6 tháng' : 'mỗi năm'} và theo dõi hàng ngày nếu có nguy cơ.</p>
          </div>
        </RevealBlock>
      )}

      {/* Classification */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại Huyết Áp (AHA 2017)</h2>
        <p className="text-muted text-lg mb-6">Đơn vị mmHg. Áp dụng cho người lớn ≥ 18 tuổi, không dùng thuốc huyết áp.</p>
        <div className="space-y-3">
          {BP_CATS.map((c, i) => (
            <div key={i}
              onClick={() => setBpModal(i)}
              className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer transition-colors"
              style={{ background: c.bg, borderColor: `rgba(${c.rgb},0.25)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.25)`}
            >
              <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="font-bold text-lg text-text">{c.label}</span>
              </div>
              <div className="flex gap-4 text-base text-muted sm:w-40 shrink-0">
                <span>Tâm thu: <strong className="text-text">{c.sys}</strong></span>
                <span>Tâm trương: <strong className="text-text">{c.dia}</strong></span>
              </div>
              <p className="text-base text-muted flex-1">{c.action}</p>
              <span className="text-muted text-base shrink-0">→</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border p-4 text-lg" style={{ borderColor: `rgba(239,68,68,0.3)`, background: 'rgba(239,68,68,0.06)' }}>
          <span className="font-bold text-red-400">⚠ Khẩn cấp:</span> <span className="text-muted">HA &gt; 180/120 mmHg kèm đau đầu dữ dội, mờ mắt, đau ngực, khó thở, tê liệt → <strong className="text-text">Gọi 115 hoặc vào cấp cứu ngay.</strong></span>
        </div>
      </RevealBlock>

      {/* Measurement technique */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kỹ Thuật Đo Đúng Chuẩn</h2>
        <p className="text-muted text-lg mb-6">Sai kỹ thuật có thể khiến kết quả lệch 10–20 mmHg.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {STEPS.map((s, i) => (
            <div key={i}
              onClick={() => setStepModal(i)}
              className="rounded-2xl border border-border bg-surface p-4 flex gap-4 cursor-pointer hover:border-red-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl font-bold text-xl flex items-center justify-center shrink-0" style={{ background: `rgba(${RGB},0.12)`, color: COLOR }}>{s.num}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-text mb-1">{s.title}</div>
                <div className="text-base text-muted">{s.desc}</div>
              </div>
              <span className="text-muted text-base self-center shrink-0">→</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-lg text-muted">
          <strong className="text-text">Nên đo lúc nào?</strong> Buổi sáng (sau khi thức, trước khi ăn, trước khi uống thuốc) và buổi tối (trước khi ngủ). Ghi lại cả hai lần để có xu hướng chính xác hơn.
        </div>
      </RevealBlock>

      {/* Lifestyle */}
      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lối Sống Kiểm Soát Huyết Áp</h2>
        <p className="text-muted text-lg mb-6">Thay đổi lối sống có thể giảm HA 5–20 mmHg mà không cần thuốc.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {LIFESTYLE.map((l, i) => (
            <div key={i}
              onClick={() => setLifestyleModal(i)}
              className="rounded-2xl border border-border bg-surface p-4 flex gap-3 cursor-pointer hover:border-red-500/40 transition-colors">
              <span className="text-3xl shrink-0">{l.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-lg text-text mb-1">{l.title}</div>
                <div className="text-base text-muted">{l.desc}</div>
              </div>
              <span className="text-muted text-base self-center shrink-0">→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Journal */}
      <RevealBlock delay={4} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Ghi Nhật Ký Huyết Áp</h2>
        <BPJournal />
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        ← Quay lại Kiến Thức Sức Khỏe
      </Link>

      {bpModal !== null && (
        <BPModal
          item={BP_CATS[bpModal]}
          idx={bpModal}
          total={BP_CATS.length}
          onClose={() => setBpModal(null)}
          onPrev={() => setBpModal(i => Math.max(0, i - 1))}
          onNext={() => setBpModal(i => Math.min(BP_CATS.length - 1, i + 1))}
          hasPrev={bpModal > 0}
          hasNext={bpModal < BP_CATS.length - 1}
        />
      )}
      {stepModal !== null && (
        <BPModal
          item={{ ...STEPS[stepModal], label: STEPS[stepModal].title, color: COLOR, rgb: RGB }}
          idx={stepModal}
          total={STEPS.length}
          onClose={() => setStepModal(null)}
          onPrev={() => setStepModal(i => Math.max(0, i - 1))}
          onNext={() => setStepModal(i => Math.min(STEPS.length - 1, i + 1))}
          hasPrev={stepModal > 0}
          hasNext={stepModal < STEPS.length - 1}
        />
      )}
      {lifestyleModal !== null && (
        <BPModal
          item={{ ...LIFESTYLE[lifestyleModal], label: LIFESTYLE[lifestyleModal].title, color: COLOR, rgb: RGB }}
          idx={lifestyleModal}
          total={LIFESTYLE.length}
          onClose={() => setLifestyleModal(null)}
          onPrev={() => setLifestyleModal(i => Math.max(0, i - 1))}
          onNext={() => setLifestyleModal(i => Math.min(LIFESTYLE.length - 1, i + 1))}
          hasPrev={lifestyleModal > 0}
          hasNext={lifestyleModal < LIFESTYLE.length - 1}
        />
      )}
    </div>
  );
}
