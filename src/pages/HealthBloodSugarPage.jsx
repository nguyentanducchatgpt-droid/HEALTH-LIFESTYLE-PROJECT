import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#f59e0b';
const RGB = '245,158,11';
const ORBIT_ID = 'e-bs-orbit-kf';
const ORBIT_CLASS = 'e-bs-orbit-ring';
const ORBIT_PROP = '--e-bs-orbit-angle';

const BS_CATS = [
  {
    label: 'Hạ đường huyết', range: '< 70 mg/dL', color: '#3b82f6', rgb: '59,130,246', bg: '#3b82f618',
    icon: '🆘', note: 'Ăn ngay 15g carb nhanh (kẹo, nước cam). Đo lại sau 15 phút.',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '💡 Quy tắc 15-15: ăn 15g carb nhanh → chờ 15 phút → đo lại. Nếu vẫn < 70 mg/dL, lặp lại. Hạ đường huyết nặng (< 50 mg/dL) gây tổn thương não không hồi phục trong 5–10 phút.',
    detail: 'Hạ đường huyết là tình trạng cấp cứu chuyển hóa — não không dự trữ glucose và phụ thuộc hoàn toàn vào đường huyết để hoạt động.',
    details: [
      'Triệu chứng sớm (đường huyết 60–70 mg/dL): run tay, vã mồ hôi, đói cồn cào, tim đập nhanh, lo âu, xanh xao — đây là giai đoạn có thể tự xử trí.',
      'Triệu chứng nặng (< 54 mg/dL): lú lẫn, nói ngọng, thị lực mờ, yếu cơ, mất phối hợp động tác — cần người hỗ trợ ngay, không được lái xe.',
      'Cấp cứu (< 40 mg/dL hoặc mất ý thức): tiêm glucagon 1mg IM/SC (nếu có sẵn bộ kit) hoặc glucose 40% truyền tĩnh mạch. Gọi 115 ngay và KHÔNG cho uống bất cứ thứ gì.',
      'Quy tắc 15-15 cho trường hợp nhẹ: 4 viên glucose/kẹo, 150ml nước cam, 1 muỗng canh mật ong, hoặc 15ml đường cát pha nước — tất cả đều cho 15g carb nhanh.',
      'Hạ đường huyết tái phát cần điều tra: liều insulin sai, bỏ bữa, vận động không dự tính, rượu bia, thuốc interfere — báo bác sĩ để điều chỉnh phác đồ.',
      'Người thân cần biết: vị trí bộ glucagon, cách tiêm, và số 115. Người bệnh tiểu đường dùng insulin nên luôn mang theo nguồn carb nhanh bên mình.',
    ],
    points: [
      { icon: '🍬', label: 'Quy tắc 15-15', note: '15g carb → chờ 15 phút → đo lại' },
      { icon: '🚫', label: 'Không cho uống khi mê', note: 'Nguy cơ sặc — tiêm glucagon hoặc gọi 115' },
      { icon: '💉', label: 'Glucagon kit', note: 'Người thân cần biết cách dùng' },
      { icon: '📞', label: '< 40 mg/dL: gọi 115', note: 'Không chờ xem tình trạng cải thiện' },
    ],
  },
  {
    label: 'Bình thường (đói)', range: '70–99 mg/dL', color: '#22c55e', rgb: '34,197,94', bg: '#22c55e18',
    icon: '✅', note: 'Lý tưởng. Duy trì chế độ ăn cân bằng và vận động đều.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '💡 Đường huyết đói tối ưu thực sự là 80–90 mg/dL. Người duy trì được ngưỡng này kết hợp với HbA1c < 5.7% có nguy cơ tiểu đường type 2 thấp nhất trong vòng 10 năm tới.',
    detail: 'Đường huyết bình thường phản ánh bộ ba hoạt động tốt: tụy tiết insulin đúng lượng, gan không xuất glucose quá mức, và tế bào nhạy cảm với insulin.',
    details: [
      'Đường huyết đói 70–99 mg/dL theo ADA 2023 và WHO — đây là ngưỡng được xác lập từ dữ liệu dịch tễ học của hàng triệu người theo dõi nhiều thập kỷ.',
      'Cơ chế duy trì đường huyết: ban đêm nhịn ăn, gan giải phóng glucose qua glycogenolysis và gluconeogenesis. Insulin từ tụy ức chế quá trình này để giữ ổn định.',
      'Yếu tố duy trì: cân nặng hợp lý (BMI 18.5–24.9), vận động đều (150 phút/tuần), ăn ít đường đơn và tinh bột trắng, ngủ đủ 7–9 tiếng.',
      'Xét nghiệm định kỳ: người < 45 tuổi không có yếu tố nguy cơ xét nghiệm mỗi 3 năm. Người ≥ 45 tuổi hoặc có yếu tố nguy cơ (thừa cân, gia đình có tiểu đường) xét nghiệm mỗi năm.',
      'Không tự mãn với "bình thường": đường huyết đói 95–99 mg/dL tuy trong ngưỡng nhưng nguy cơ tiến triển thành tiền tiểu đường cao hơn người có 75–85 mg/dL.',
      'Giữ ngưỡng bình thường sau 40 tuổi cần nỗ lực tích cực hơn — kháng insulin tăng dần theo tuổi dù cân nặng không đổi. Thói quen tốt từ sớm là đầu tư tốt nhất.',
    ],
    points: [
      { icon: '🎯', label: 'Mục tiêu lý tưởng', note: '80–90 mg/dL — tối ưu hơn "đủ bình thường"' },
      { icon: '📅', label: 'Xét nghiệm mỗi 3 năm', note: 'Nếu < 45 tuổi, không có nguy cơ' },
      { icon: '⚖️', label: 'BMI 18.5–24.9', note: 'Cân nặng hợp lý bảo vệ nhạy cảm insulin' },
      { icon: '🏃', label: '150 phút/tuần', note: 'Vận động tăng glucose uptake ở cơ' },
    ],
  },
  {
    label: 'Tiền tiểu đường (đói)', range: '100–125 mg/dL', color: '#f97316', rgb: '249,115,22', bg: '#f9731618',
    icon: '⚠️', note: 'Nguy cơ cao. Thay đổi lối sống ngay để ngăn chặn tiến triển.',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    keyFact: '💡 Nghiên cứu DPP (Diabetes Prevention Program) của NIH: thay đổi lối sống (giảm 7% cân nặng + 150 phút/tuần vận động) giảm 58% nguy cơ tiến triển thành tiểu đường type 2 — hiệu quả gấp đôi so với dùng metformin đơn thuần.',
    detail: 'Tiền tiểu đường là giai đoạn đảo ngược được — đây là cơ hội vàng để can thiệp trước khi tổn thương cơ quan bắt đầu tích lũy.',
    details: [
      'Tiền tiểu đường ảnh hưởng 1 trong 3 người trưởng thành tại nhiều quốc gia châu Á — phần lớn không có triệu chứng và không biết mình đang ở giai đoạn này.',
      'Cơ chế: tế bào cơ và gan đã kháng insulin (insulin resistance), tụy phải tiết nhiều insulin hơn để đạt cùng hiệu quả → theo thời gian tế bào beta tụy "kiệt sức" → đường huyết tăng dần.',
      'Mục tiêu can thiệp: giảm 5–7% cân nặng (người 70kg cần giảm 3.5–5kg) + 150 phút vận động cường độ vừa/tuần → đây là phác đồ DPP có bằng chứng mạnh nhất.',
      'Chế độ ăn hiệu quả nhất: giảm đường đơn và tinh bột trắng, tăng chất xơ (≥25g/ngày), ưu tiên GI thấp (gạo lứt, khoai lang, đậu các loại, rau xanh).',
      'Đi bộ 10–15 phút sau bữa ăn: giảm đường huyết sau ăn 22–34% theo nghiên cứu — cơ bắp hoạt động hấp thu glucose không cần insulin, đặc biệt hiệu quả với tiền tiểu đường.',
      'Theo dõi: xét nghiệm lại sau 3–6 tháng thay đổi lối sống. Nếu không cải thiện sau 1 năm, bác sĩ có thể xem xét metformin như biện pháp dự phòng bổ sung.',
    ],
    points: [
      { icon: '🔄', label: 'Còn đảo ngược được', note: 'Tiền ĐTĐ không tất yếu thành ĐTĐ' },
      { icon: '⚖️', label: 'Giảm 7% cân nặng', note: 'Yếu tố can thiệp hiệu quả nhất' },
      { icon: '🚶', label: '10–15 phút sau ăn', note: 'Giảm đường huyết sau ăn 22–34%' },
      { icon: '📅', label: 'Tái xét nghiệm 3–6 tháng', note: 'Đánh giá hiệu quả can thiệp lối sống' },
    ],
  },
  {
    label: 'Tiểu đường (đói)', range: '≥ 126 mg/dL', color: '#ef4444', rgb: '239,68,68', bg: '#ef444418',
    icon: '🏥', note: 'Cần xét nghiệm xác nhận và gặp bác sĩ trong vòng 1 tuần.',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💡 Tiêu chuẩn chẩn đoán ADA 2023: cần 2 kết quả đường huyết đói ≥ 126 mg/dL vào 2 ngày khác nhau để xác nhận — hoặc 1 kết quả cộng với triệu chứng điển hình (khát nhiều, tiểu nhiều, sụt cân không rõ lý do).',
    detail: 'Tiểu đường type 2 là bệnh mạn tính có thể kiểm soát tốt — mục tiêu điều trị không phải chữa khỏi mà là ngăn biến chứng và duy trì chất lượng sống.',
    details: [
      'Tiêu chuẩn chẩn đoán (ADA 2023): đường huyết đói ≥ 126 mg/dL (≥ 7.0 mmol/L) trong 2 lần đo riêng biệt, HOẶC đường huyết bất kỳ ≥ 200 mg/dL + triệu chứng, HOẶC HbA1c ≥ 6.5%.',
      'Xét nghiệm xác nhận quan trọng vì: stress, bệnh cấp tính, steroid, thuốc có thể làm tăng đường huyết tạm thời — 1 lần cao chưa đủ để chẩn đoán (trừ khi có triệu chứng điển hình).',
      'Biến chứng mạch máu nhỏ (microvascular): bệnh võng mạc tiểu đường (nguy cơ mù), bệnh thận tiểu đường (tiến triển thành suy thận), bệnh thần kinh ngoại biên (tê bì, đau chân).',
      'Biến chứng mạch máu lớn (macrovascular): nguy cơ nhồi máu cơ tim và đột quỵ cao gấp 2–4 lần so với người không tiểu đường — kiểm soát HA và lipid máu quan trọng không kém kiểm soát đường huyết.',
      'Mục tiêu điều trị (ADA 2023): HbA1c < 7% cho hầu hết người lớn; đường huyết đói 80–130 mg/dL; sau ăn 2h < 180 mg/dL — cá nhân hóa theo tuổi, nguy cơ hạ đường huyết, và bệnh đồng mắc.',
      'Điều trị toàn diện: kiểm soát đường huyết (metformin, insulin, GLP-1 agonist) + huyết áp (ACE inhibitor bảo vệ thận) + lipid (statin) + aspirin (nếu có nguy cơ tim mạch) + thay đổi lối sống.',
    ],
    points: [
      { icon: '🔬', label: 'Cần xác nhận 2 lần', note: 'Trừ khi có triệu chứng điển hình' },
      { icon: '👁️', label: 'Khám mắt hàng năm', note: 'Phát hiện sớm bệnh võng mạc' },
      { icon: '🫘', label: 'Xét nghiệm thận', note: 'Creatinine + microalbumin niệu mỗi năm' },
      { icon: '🎯', label: 'HbA1c mục tiêu < 7%', note: 'Giảm biến chứng mạch máu nhỏ 25–35%' },
    ],
  },
  {
    label: 'Sau ăn 2h — Bình thường', range: '< 140 mg/dL', color: '#22c55e', rgb: '34,197,94', bg: '#22c55e18',
    icon: '🍽️', note: 'Phản ứng đường huyết tốt sau bữa ăn.',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    keyFact: '💡 Đường huyết sau ăn < 140 mg/dL cho thấy tụy tiết đủ insulin và tế bào đáp ứng tốt với insulin — đây là dấu hiệu độ nhạy insulin tốt, khác với người tiền tiểu đường dù đường đói vẫn bình thường.',
    detail: 'Xét nghiệm đường huyết sau ăn (postprandial) phát hiện vấn đề sớm hơn đường đói — nhiều người có đường đói bình thường nhưng đường sau ăn đã bắt đầu tăng cao bất thường.',
    details: [
      'Test dung nạp glucose (OGTT) chuẩn: uống 75g glucose pha trong 250ml nước, đo sau đúng 2 giờ. Xét nghiệm đường huyết sau bữa ăn thông thường ít chuẩn hóa hơn nhưng vẫn hữu ích.',
      'Cơ chế đường huyết sau ăn: carb → glucose vào máu → tụy tiết insulin → tế bào hấp thu glucose. Phản ứng đỉnh thường ở 30–60 phút, trở về bình thường sau 2h ở người khỏe mạnh.',
      'Glycemic Index (GI) và Glycemic Load (GL): thực phẩm GI thấp (đậu, ngũ cốc nguyên hạt, rau) làm đường huyết tăng chậm và ít hơn — phù hợp để duy trì phản ứng sau ăn < 140 mg/dL.',
      'Protein và chất béo lành mạnh làm chậm tiêu hóa carb → giảm tốc độ tăng đường huyết sau ăn. Ăn salad trước, protein + rau trước cơm là chiến lược food sequencing hiệu quả.',
      'Đi bộ 10–15 phút sau bữa ăn: cơ bắp hấp thu glucose độc lập với insulin (GLUT4 transporter) → giảm đỉnh đường huyết sau ăn 20–30% mà không cần thay đổi gì khác.',
      'CGM (Continuous Glucose Monitor): thiết bị theo dõi đường huyết liên tục 24/7 giúp thấy rõ phản ứng sau từng bữa ăn — ngày càng phổ biến dù chưa được chỉ định tiểu đường.',
    ],
    points: [
      { icon: '📈', label: 'Đỉnh ở 30–60 phút', note: 'Trở về bình thường sau 2h — dấu hiệu tốt' },
      { icon: '🥗', label: 'Ưu tiên GI thấp', note: 'Đậu, ngũ cốc nguyên hạt, rau xanh' },
      { icon: '🍽️', label: 'Food sequencing', note: 'Rau → protein → carb: giảm đỉnh đường' },
      { icon: '🚶', label: '10–15 phút sau ăn', note: 'Giảm đường huyết sau ăn 20–30%' },
    ],
  },
  {
    label: 'Sau ăn 2h — Tiền ĐTĐ', range: '140–199 mg/dL', color: '#f97316', rgb: '249,115,22', bg: '#f9731618',
    icon: '📊', note: 'Cơ thể gặp khó khăn trong việc xử lý đường từ bữa ăn.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 Đường huyết sau ăn 140–199 mg/dL là "Impaired Glucose Tolerance" (IGT) — nguy cơ tiến triển thành tiểu đường cao hơn 2–3 lần so với người < 140 mg/dL, ngay cả khi đường đói vẫn bình thường.',
    detail: 'IGT thường xuất hiện trước rối loạn đường đói nhiều năm — đây là dấu hiệu sớm nhất của kháng insulin, phát hiện khi còn nhiều thời gian can thiệp.',
    details: [
      'Cơ chế IGT: sau bữa ăn carb, tụy tiết insulin nhưng tế bào cơ phản ứng chậm hơn (kháng insulin) → glucose ở lại trong máu lâu hơn → đường sau ăn cao hơn 140 mg/dL.',
      'IGT kết hợp đường đói bình thường rất phổ biến ở người thừa cân BMI > 25, đặc biệt người béo bụng — tụy vẫn còn bù được ở trạng thái đói nhưng sau tải carb thì không đủ.',
      'Chiến lược giảm đường huyết sau ăn: (1) giảm lượng carb mỗi bữa; (2) chọn GI thấp; (3) ăn chậm, nhai kỹ; (4) kết hợp protein + chất xơ + chất béo lành mạnh với carb; (5) đi bộ sau ăn.',
      'Bữa ăn thử nghiệm: thay 1 chén cơm (180g) bằng ½ chén cơm + ½ chén khoai lang → đường sau ăn thường giảm 20–40 mg/dL. Nhỏ nhưng đủ để ra khỏi ngưỡng 140.',
      'Không nhịn ăn hoàn toàn: bỏ bữa → ăn bù nhiều vào bữa sau → đỉnh đường cao hơn. Chia nhỏ bữa ăn (3 bữa chính + 1–2 bữa phụ nhỏ) ổn định đường huyết hơn.',
      'Theo dõi 3 tháng và xét nghiệm lại — nếu cải thiện về < 140 mg/dL: duy trì lối sống. Nếu không cải thiện: gặp bác sĩ để đánh giá toàn diện và xem xét can thiệp thêm.',
    ],
    points: [
      { icon: '🍽️', label: 'Giảm carb mỗi bữa', note: 'Chia nhỏ + GI thấp hơn' },
      { icon: '🚶', label: 'Đi bộ sau ăn', note: 'Can thiệp đơn giản, hiệu quả cao nhất' },
      { icon: '⏰', label: 'Không bỏ bữa', note: 'Ăn bù bữa sau → đỉnh đường càng cao' },
      { icon: '📅', label: 'Xét nghiệm lại 3 tháng', note: 'Đánh giá hiệu quả can thiệp lối sống' },
    ],
  },
  {
    label: 'Sau ăn 2h — Tiểu đường', range: '≥ 200 mg/dL', color: '#ef4444', rgb: '239,68,68', bg: '#ef444418',
    icon: '🚨', note: 'Cần theo dõi chặt chẽ và điều trị.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    keyFact: '💡 Theo ADA 2023: đường huyết bất kỳ ≥ 200 mg/dL + triệu chứng điển hình (khát nhiều, tiểu nhiều, sụt cân) = đủ tiêu chuẩn chẩn đoán tiểu đường — không cần xét nghiệm nhịn đói thêm.',
    detail: 'Đường huyết sau ăn ≥ 200 mg/dL cho thấy tụy không còn đủ khả năng kiểm soát glucose từ bữa ăn — cần đánh giá toàn diện và bắt đầu điều trị.',
    details: [
      'Đường huyết sau ăn ≥ 200 mg/dL kết hợp triệu chứng (khát nhiều, tiểu nhiều, sụt cân, mệt mỏi, nhìn mờ) là tiêu chuẩn chẩn đoán tiểu đường theo ADA — xác nhận ngay bằng đường đói hoặc HbA1c.',
      'Triệu chứng "3P" của tiểu đường: Polydipsia (khát nhiều) + Polyuria (tiểu nhiều) + Polyphagia (ăn nhiều nhưng vẫn sụt cân) — xuất hiện khi đường huyết > 180 mg/dL liên tục.',
      'Đường thận (glycosuria): khi đường huyết > 180 mg/dL, thận không tái hấp thu kịp → đường tràn ra nước tiểu → kéo nước theo → tiểu nhiều → mất nước → khát nhiều. Vòng lặp "osmotic diuresis".',
      'Nguy cơ DKA (Diabetic Ketoacidosis) ở tiểu đường type 1: đường ≥ 250 mg/dL + thiếu insulin → cơ thể đốt mỡ thay glucose → ketone tích lũy → nhiễm toan ceton — cấp cứu nội khoa.',
      'Mục tiêu đường sau ăn khi điều trị tiểu đường: < 180 mg/dL theo ADA (mục tiêu chung); < 140 mg/dL nếu có thể không gây hạ đường huyết (mục tiêu chặt hơn).',
      'Cần gặp bác sĩ sớm: điều trị sớm bảo vệ tế bào beta tụy còn sót lại, trì hoãn biến chứng. Không tự điều trị bằng thảo dược hay chế độ ăn mà không có giám sát y tế.',
    ],
    points: [
      { icon: '🏥', label: 'Gặp bác sĩ trong 1 tuần', note: 'Chẩn đoán xác nhận + bắt đầu điều trị' },
      { icon: '⚡', label: 'Triệu chứng 3P', note: 'Khát + tiểu nhiều + sụt cân = cần khám ngay' },
      { icon: '🎯', label: 'Mục tiêu < 180 mg/dL', note: 'Sau khi điều trị ổn định' },
      { icon: '🚫', label: 'Không tự điều trị', note: 'Thảo dược không thay thế thuốc tiểu đường' },
    ],
  },
];

const HBAC_CATS = [
  { label: 'Bình thường', range: '< 5.7%', color: '#22c55e', note: 'Kiểm soát tốt trong 3 tháng qua.' },
  { label: 'Tiền tiểu đường', range: '5.7–6.4%', color: '#f97316', note: 'Đường huyết cao hơn bình thường liên tục.' },
  { label: 'Tiểu đường', range: '≥ 6.5%', color: '#ef4444', note: 'Đáp ứng tiêu chí chẩn đoán tiểu đường type 2.' },
  { label: 'Mục tiêu điều trị ĐTĐ', range: '< 7%', color: '#3b82f6', note: 'Nếu bạn đang điều trị, đây là đích cần đạt.' },
];

const DIET_TIPS = [
  { icon: '🥗', tip: 'Ưu tiên rau xanh, đậu, ngũ cốc nguyên hạt — GI thấp, tăng đường chậm hơn.' },
  { icon: '🍚', tip: 'Ăn cơm trắng ít hơn, thay bằng gạo lứt, khoai lang, bún gạo lứt.' },
  { icon: '🥩', tip: 'Kết hợp protein + chất xơ trong mỗi bữa ăn để làm chậm hấp thu đường.' },
  { icon: '🚶', tip: 'Đi bộ 10–15 phút sau bữa ăn giúp giảm đường huyết sau ăn hiệu quả.' },
  { icon: '💧', tip: 'Uống đủ nước (30–35ml/kg/ngày) — mất nước làm tăng nồng độ đường huyết.' },
  { icon: '😴', tip: 'Ngủ đủ 7–9 tiếng. Thiếu ngủ làm tăng insulin resistance trong vài ngày.' },
];

function BSModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
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
            <span className="ml-auto font-mono font-bold text-base px-3 py-1 rounded-full"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>{item.range}</span>
          </div>
          <div className="rounded-2xl px-4 py-3 mb-5 mt-4 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}` }}>
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

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-bs-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-bs-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function BSCalculator() {
  const [fasting, setFasting] = useState('');
  const [postMeal, setPostMeal] = useState('');
  const [hba1c, setHba1c] = useState('');
  const [result, setResult] = useState(null);

  function analyze() {
    const f = parseFloat(fasting);
    const p = parseFloat(postMeal);
    const h = parseFloat(hba1c);
    const findings = [];
    if (!isNaN(f)) {
      if (f < 70) findings.push({ label: 'Đường huyết đói', status: 'Hạ đường huyết', color: '#3b82f6', action: 'Ăn ngay 15g carb nhanh.' });
      else if (f <= 99) findings.push({ label: 'Đường huyết đói', status: 'Bình thường', color: '#22c55e', action: 'Tiếp tục duy trì lối sống lành mạnh.' });
      else if (f <= 125) findings.push({ label: 'Đường huyết đói', status: 'Tiền tiểu đường', color: '#f97316', action: 'Thay đổi lối sống ngay, tái khám sau 3–6 tháng.' });
      else findings.push({ label: 'Đường huyết đói', status: 'Tiểu đường (nghi ngờ)', color: '#ef4444', action: 'Gặp bác sĩ trong tuần để xác nhận.' });
    }
    if (!isNaN(p)) {
      if (p < 140) findings.push({ label: 'Sau ăn 2h', status: 'Bình thường', color: '#22c55e', action: 'Phản ứng đường huyết tốt.' });
      else if (p <= 199) findings.push({ label: 'Sau ăn 2h', status: 'Tiền tiểu đường', color: '#f97316', action: 'Điều chỉnh bữa ăn, tăng vận động.' });
      else findings.push({ label: 'Sau ăn 2h', status: 'Tiểu đường (nghi ngờ)', color: '#ef4444', action: 'Cần theo dõi và điều trị.' });
    }
    if (!isNaN(h)) {
      if (h < 5.7) findings.push({ label: 'HbA1c', status: 'Bình thường', color: '#22c55e', action: 'Kiểm soát tốt trong 3 tháng qua.' });
      else if (h < 6.5) findings.push({ label: 'HbA1c', status: 'Tiền tiểu đường', color: '#f97316', action: 'Cần can thiệp lối sống tích cực.' });
      else findings.push({ label: 'HbA1c', status: 'Tiểu đường', color: '#ef4444', action: 'Cần điều trị và theo dõi chặt chẽ.' });
    }
    setResult(findings);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold mb-4" style={{ color: COLOR }}>Phân Tích Đường Huyết</h3>
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-base text-muted mb-1 block">Đường huyết đói (mg/dL)</label>
          <input value={fasting} onChange={e => setFasting(e.target.value)} type="number" placeholder="vd: 95" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
        <div>
          <label className="text-base text-muted mb-1 block">Sau ăn 2h (mg/dL)</label>
          <input value={postMeal} onChange={e => setPostMeal(e.target.value)} type="number" placeholder="vd: 130" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
        <div>
          <label className="text-base text-muted mb-1 block">HbA1c (%)</label>
          <input value={hba1c} onChange={e => setHba1c(e.target.value)} type="number" step="0.1" placeholder="vd: 5.8" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text" />
        </div>
      </div>
      <button onClick={analyze} className="px-5 py-2 rounded-xl text-lg font-bold text-white mb-4" style={{ background: COLOR }}>Phân Tích</button>
      {result && result.length === 0 && <p className="text-muted text-lg">Nhập ít nhất một chỉ số để phân tích.</p>}
      {result && result.length > 0 && (
        <div className="space-y-2">
          {result.map((r, i) => (
            <div key={i} className="rounded-xl border border-border p-3 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: r.color }} />
              <div>
                <div className="text-base text-muted">{r.label}</div>
                <div className="font-bold text-lg" style={{ color: r.color }}>{r.status}</div>
                <div className="text-base text-muted mt-1">{r.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HealthBloodSugarPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [bsModal, setBsModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eBsOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🍬</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Đường Huyết</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Chỉ số chuyển hóa · Tiểu đường type 2
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đường huyết (glucose máu) cho biết cơ thể xử lý năng lượng từ thức ăn như thế nào. Mất kiểm soát đường huyết kéo dài gây tổn thương thần kinh, thận, mắt và mạch máu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop" alt="Đường huyết" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Kiểm soát từ bữa ăn hàng ngày
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age >= 45 ? 'Nên xét nghiệm đường huyết đói và HbA1c hàng năm.' : 'Xét nghiệm mỗi 3 năm nếu không có yếu tố nguy cơ.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại Đường Huyết</h2>
        <p className="text-muted text-lg mb-6">Xét nghiệm sau nhịn ăn ít nhất 8 tiếng hoặc 2 giờ sau bữa ăn (test dung nạp glucose).</p>
        <div className="space-y-2">
          {BS_CATS.map((c, i) => (
            <div key={i}
              onClick={() => setBsModal(i)}
              className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer transition-colors"
              style={{ background: c.bg, borderColor: `rgba(${c.rgb},0.22)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.22)`}>
              <div className="flex items-center gap-2 sm:w-56 shrink-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-lg font-bold text-text">{c.label}</span>
              </div>
              <span className="font-mono text-lg font-bold sm:w-32 shrink-0" style={{ color: c.color }}>{c.range}</span>
              <p className="text-base text-muted flex-1">{c.note}</p>
              <span className="text-muted text-base shrink-0">→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>HbA1c — Đường Huyết Trung Bình 3 Tháng</h2>
        <p className="text-muted text-lg mb-6">HbA1c đo lượng glucose gắn vào hemoglobin, phản ánh kiểm soát đường huyết trong 2–3 tháng qua. Không bị ảnh hưởng bởi ăn uống ngay trước đó.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {HBAC_CATS.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                <span className="font-bold text-lg text-text">{c.label}</span>
                <span className="ml-auto font-mono text-lg font-bold" style={{ color: c.color }}>{c.range}</span>
              </div>
              <p className="text-base text-muted">{c.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Phân Tích Chỉ Số Của Bạn</h2>
        <BSCalculator />
      </RevealBlock>

      <RevealBlock delay={4} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kiểm Soát Đường Huyết Bằng Lối Sống</h2>
        <p className="text-muted text-lg mb-6">Thay đổi lối sống có thể ngăn 58% trường hợp tiền tiểu đường không tiến triển thành tiểu đường type 2 (theo nghiên cứu DPP của NIH).</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {DIET_TIPS.map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3 hover:border-amber-500/30 transition-colors">
              <span className="text-3xl">{t.icon}</span>
              <p className="text-lg text-muted">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={5} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Khi Nào Cần Gặp Bác Sĩ?</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Đường huyết đói ≥ 126 mg/dL trong 2 lần đo riêng biệt</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> HbA1c ≥ 6.5% xác nhận bởi xét nghiệm</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Triệu chứng: khát nước nhiều, tiểu nhiều, mệt mỏi không rõ nguyên nhân, nhìn mờ</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span> Hạ đường huyết tái phát (&lt; 70 mg/dL) kèm chóng mặt, run tay</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {bsModal !== null && (
        <BSModal
          item={BS_CATS[bsModal]}
          idx={bsModal}
          total={BS_CATS.length}
          onClose={() => setBsModal(null)}
          onPrev={() => setBsModal(i => Math.max(0, i - 1))}
          onNext={() => setBsModal(i => Math.min(BS_CATS.length - 1, i + 1))}
          hasPrev={bsModal > 0}
          hasNext={bsModal < BS_CATS.length - 1}
        />
      )}
    </div>
  );
}
