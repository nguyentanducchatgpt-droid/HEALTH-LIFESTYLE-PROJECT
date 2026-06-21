import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'e-checkup-orbit-kf';
const ORBIT_CLASS = 'e-checkup-orbit-ring';
const ORBIT_PROP = '--e-checkup-orbit-angle';

const BASIC_PACKAGE = [
  {
    num: '01', icon: '🏥', title: 'Khám lâm sàng toàn diện', freq: 'Hàng năm',
    subtitle: 'Chiều cao · Cân nặng · Huyết áp · Nhịp tim',
    color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '🏥 Khám lâm sàng là nền tảng của mọi gói khám định kỳ — bác sĩ thu thập dữ liệu cơ bản và tạo baseline để so sánh qua các năm. Nhiều bất thường (huyết áp cao, nhịp tim không đều, khối u bề mặt) chỉ phát hiện được qua thăm khám trực tiếp mà xét nghiệm máu không thể phát hiện.',
    details: [
      'Đo sinh hiệu (vital signs) — 4 chỉ số cơ bản nhất: Huyết áp: ngưỡng bình thường < 120/80 mmHg; ≥ 130/80 là tăng HA cần theo dõi. Nhịp tim: 60–100 lần/phút; < 60 ở người không tập thể thao cần đánh giá thêm; > 100 lúc nghỉ cần xem xét nguyên nhân. Nhịp thở: bình thường 12–20 lần/phút. SpO2 (bão hòa oxy): ≥ 95% bình thường, < 92% cần xử trí ngay. Nhiệt độ: 36.5–37.5°C. 4 sinh hiệu này cho bức tranh nhanh về trạng thái sinh lý hiện tại.',
      'Đo chiều cao và cân nặng — BMI và ý nghĩa lâm sàng: BMI = cân(kg)/chiều cao(m)². Phân loại người châu Á: Gầy < 18.5; Bình thường 18.5–22.9; Thừa cân 23–24.9; Béo phì độ 1: 25–29.9; Béo phì độ 2: ≥ 30. Giới hạn: BMI không phân biệt cơ và mỡ. Đo kết hợp vòng eo cho bức tranh đầy đủ hơn. Theo dõi xu hướng BMI theo năm quan trọng hơn con số tuyệt đối — tăng > 2 đơn vị BMI/năm là tín hiệu cần chú ý.',
      'Khám thực thể toàn thân (Physical examination): đầu – mặt – cổ: hạch cổ, tuyến giáp, mắt – tai – mũi – họng. Ngực – tim – phổi: nghe tim (phát hiện tiếng thổi bất thường), nghe phổi (ran, khò khè), gõ phổi. Bụng: sờ gan – lách – thận – thành bụng (khối u, đau khu trú). Da – cơ xương khớp: nốt da bất thường, khớp sưng viêm, biên độ vận động. Thần kinh: phản xạ cơ bản, thăng bằng. Bác sĩ có kinh nghiệm phát hiện rất nhiều thông tin qua thăm khám mà máy móc không thể thay thế.',
      'Đo nhãn áp và thị lực trong khám lâm sàng tổng quát: tăng nhãn áp (glaucoma): > 21 mmHg — thường không có triệu chứng cho đến khi mất thị lực vĩnh viễn. Là nguyên nhân mù lòa phòng ngừa được hàng đầu thế giới. Kiểm tra thị lực 1–2 lần/năm từ 40 tuổi. Cận thị tăng tiến nhanh ở trẻ em và người trẻ: cần theo dõi và can thiệp sớm.',
      'Khám da toàn thân — phát hiện sớm ung thư da: quy tắc ABCDE để phát hiện melanoma: Asymmetry (bất đối xứng), Border (bờ không đều), Color (nhiều màu), Diameter (> 6mm), Evolution (thay đổi theo thời gian). Bác sĩ cần kiểm tra toàn thân, kể cả vùng khó nhìn thấy như lưng, da đầu, giữa ngón chân. Người có nhiều nốt ruồi (> 50), tiền sử cháy nắng nặng, hoặc da trắng cần khám da 6 tháng/lần.',
      'Chuẩn bị để khám lâm sàng hiệu quả: liệt kê triệu chứng mới xuất hiện từ lần khám trước — ghi chú trước vì dễ quên khi gặp bác sĩ. Mang theo: danh sách thuốc/thực phẩm bổ sung đang dùng (kể cả liều), kết quả xét nghiệm cũ, hồ sơ tiêm vaccine, tiền sử gia đình (bố/mẹ/anh chị em mắc bệnh gì). Đặt câu hỏi cụ thể: "Chỉ số này có bình thường không? So với năm ngoái thế nào? Tôi cần làm gì với kết quả này?" Yêu cầu bản copy kết quả để lưu hồ sơ cá nhân.',
    ],
    points: [
      { icon: '📊', label: 'Baseline năm 1 quan trọng nhất — để so sánh mọi năm sau', note: 'Xu hướng theo năm có giá trị hơn con số tuyệt đối bất kỳ năm nào' },
      { icon: '🩺', label: 'Khám thực thể phát hiện điều xét nghiệm máu không thấy được', note: 'Tiếng thổi tim, hạch cổ, khối u bề mặt — chỉ tay bác sĩ mới phát hiện' },
      { icon: '📋', label: 'Mang danh sách câu hỏi + thuốc đang dùng + kết quả cũ', note: 'Bác sĩ cần 3 thứ này để đưa ra khuyến nghị cá nhân hóa cho bạn' },
      { icon: '📁', label: 'Lưu tất cả kết quả vào hồ sơ cá nhân — đừng vứt phiếu khám', note: 'So sánh HA, cân nặng, xét nghiệm máu qua các năm: thông tin vô giá' },
    ],
  },
  {
    num: '02', icon: '🩸', title: 'Xét nghiệm máu cơ bản: CBC', freq: 'Hàng năm',
    subtitle: 'Huyết đồ toàn phần · Complete Blood Count',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    keyFact: '🩸 CBC (Complete Blood Count — Huyết đồ toàn phần) là xét nghiệm máu đơn giản nhất nhưng cho thông tin nhiều nhất về tình trạng sức khỏe tổng thể. Một ống máu 5ml có thể phát hiện: thiếu máu, nhiễm trùng, rối loạn đông máu, bệnh bạch cầu, và nhiều hơn nữa.',
    details: [
      'Các chỉ số chính trong CBC và ý nghĩa: RBC (Red Blood Cells — Hồng cầu): bình thường nam 4.5–5.9 ×10¹²/L, nữ 4.0–5.2 ×10¹²/L. Thấp → thiếu máu; Cao → mất nước hoặc đa hồng cầu. Hemoglobin (Hb): nam ≥ 130 g/L, nữ ≥ 120 g/L. Hematocrit (Hct): % thể tích hồng cầu trong máu. MCV (Mean Corpuscular Volume): kích thước trung bình hồng cầu — thấp = thiếu máu thiếu sắt; cao = thiếu B12/folate. Reticulocyte count: đánh giá tủy xương đang sản xuất hồng cầu tích cực hay không.',
      'WBC (White Blood Cells — Bạch cầu) — hệ miễn dịch của bạn: bình thường 4.0–10.0 ×10⁹/L. Cao (> 11.0): nhiễm trùng vi khuẩn, viêm, stress sinh lý, dùng corticosteroid, hoặc hiếm gặp là bệnh bạch cầu. Thấp (< 4.0): nhiễm virus (kể cả HIV), suy tủy, dùng thuốc ức chế miễn dịch. Công thức bạch cầu (Differential): Neutrophil tăng → nhiễm khuẩn; Lymphocyte tăng → nhiễm virus; Eosinophil tăng → dị ứng hoặc ký sinh trùng; Monocyte tăng → nhiễm trùng mãn tính.',
      'Tiểu cầu (Platelet/PLT) — đông máu: bình thường 150–400 ×10⁹/L. Thấp (< 150.000/μL — Thrombocytopenia): tăng nguy cơ chảy máu, có thể do: xuất huyết giảm tiểu cầu tự miễn (ITP), nhiễm virus (sốt xuất huyết!), thuốc, hoặc rối loạn tủy xương. Cao (> 400.000/μL — Thrombocytosis): tăng nguy cơ huyết khối, thường do viêm hoặc thiếu sắt; hiếm khi do bệnh tăng sinh tủy. Sốt xuất huyết Dengue: tiểu cầu < 100.000 là dấu hiệu nguy hiểm cần nhập viện.',
      'Phân tích thiếu máu qua CBC: thiếu máu thiếu sắt (IDA — phổ biến nhất, đặc biệt phụ nữ): Hb thấp + MCV thấp + MCH thấp + ferritin thấp (xét nghiệm bổ sung). Thiếu máu thiếu B12/folate: Hb thấp + MCV cao + hypersegmented neutrophils. Thiếu máu bệnh mãn tính: Hb thấp nhẹ, MCV thường bình thường, ferritin bình thường–cao. Thiếu máu tán huyết: Hb thấp + reticulocyte cao + bilirubin tăng. Phân loại đúng → điều trị đúng: uống sắt không giúp ích gì nếu nguyên nhân là thiếu B12.',
      'Khi nào kết quả CBC cần hành động ngay: Hb < 80 g/L (8 g/dL): thiếu máu nặng — cần xác định nguyên nhân ngay. Tiểu cầu < 50.000/μL: nguy cơ chảy máu nghiêm trọng. WBC > 30.000: cần loại trừ bệnh bạch cầu. Blast cells (tế bào non) xuất hiện trong máu ngoại vi: bất kỳ số lượng nào đều bất thường — nghi ngờ bệnh bạch cầu cấp. Pancytopenia (giảm cả 3 dòng tế bào): có thể suy tủy, cần chuyên khoa huyết học ngay.',
      'CBC và phát hiện sớm: ung thư máu phát hiện sớm qua bất thường CBC bất ngờ: CLL (bệnh bạch cầu lympho mãn) thường phát hiện tình cờ qua CBC định kỳ — lymphocyte rất cao. Đa u tủy (Multiple Myeloma): thiếu máu + protein niệu + tăng creatinine. Lymphoma: bạch cầu bất thường + hạch to. Những bệnh này phát hiện sớm qua khám định kỳ có tiên lượng tốt hơn nhiều so với phát hiện khi đã có triệu chứng.',
    ],
    points: [
      { icon: '🧪', label: '5ml máu phát hiện: thiếu máu, nhiễm trùng, rối loạn đông máu', note: 'CBC là xét nghiệm đơn giản nhất nhưng thông tin nhiều nhất' },
      { icon: '⚡', label: 'Sốt xuất huyết: tiểu cầu < 100.000 = dấu hiệu nguy hiểm', note: 'Không cần đợi triệu chứng nặng — CBC ngay khi sốt > 2 ngày' },
      { icon: '🔍', label: 'MCV thấp = thiếu sắt; MCV cao = thiếu B12 — phân loại trước khi điều trị', note: 'Uống sắt khi thiếu B12 không hiệu quả và có thể có hại' },
      { icon: '🎯', label: 'CLL, lymphoma thường phát hiện tình cờ qua CBC định kỳ', note: 'Phát hiện sớm giai đoạn 1: tiên lượng tốt hơn nhiều' },
    ],
  },
  {
    num: '03', icon: '🧪', title: 'Sinh hóa máu toàn diện', freq: 'Hàng năm',
    subtitle: 'Glucose đói · HbA1c · Bộ lipid (Cholesterol, LDL, HDL, TG)',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1588776814546-ec7e32bef62b?w=800&q=80',
    keyFact: '🧪 Sinh hóa máu toàn diện là "bảng điều khiển" sức khỏe tim mạch và chuyển hóa. Đây là bộ xét nghiệm phát hiện tiền tiểu đường, rối loạn lipid, và nguy cơ tim mạch — thường 10–20 năm trước khi xuất hiện biến chứng. Cơ hội vàng để can thiệp bằng lối sống thay vì thuốc.',
    details: [
      'Glucose đói và HbA1c — phát hiện tiền tiểu đường: Glucose đói (nhịn ăn 8h): Bình thường < 100 mg/dL; Tiền ĐTĐ 100–125; ĐTĐ ≥ 126 mg/dL (2 lần đo). HbA1c: Bình thường < 5.7%; Tiền ĐTĐ 5.7–6.4%; ĐTĐ ≥ 6.5%. HbA1c phản ánh trung bình đường huyết 2–3 tháng — không bị ảnh hưởng bởi bữa ăn hôm đo. Tại VN: ước tính 14–20% người trưởng thành có tiền ĐTĐ, 80% không biết. Phát hiện và can thiệp lối sống ở giai đoạn tiền ĐTĐ: giảm 58% nguy cơ tiến triển.',
      'Bộ lipid (Lipid Panel) toàn diện: Total Cholesterol: bình thường < 200 mg/dL; ranh giới 200–239; cao ≥ 240 mg/dL. LDL ("bad" cholesterol): mục tiêu < 100 mg/dL (nguy cơ thấp); < 70 mg/dL (nguy cơ cao hoặc đã có bệnh tim mạch). HDL ("good" cholesterol): nam ≥ 40, nữ ≥ 50 mg/dL — cao hơn tốt hơn. Triglyceride (TG): bình thường < 150 mg/dL; cao ≥ 200 mg/dL (liên quan bia rượu, carb, béo phì). Non-HDL cholesterol = Total - HDL: ngày càng được ưa dùng hơn LDL để dự đoán nguy cơ tim mạch.',
      'Các xét nghiệm sinh hóa khác cần làm định kỳ: CRP siêu nhạy (hs-CRP): marker viêm mãn tính — dự đoán nguy cơ tim mạch độc lập với cholesterol. < 1.0: nguy cơ thấp; 1.0–3.0: trung bình; > 3.0: cao. Homocysteine: nguy cơ tim mạch, liên quan thiếu B6/B9/B12. Uric acid: gout + nguy cơ bệnh thận và tim mạch. Insulin đói: phát hiện kháng insulin sớm hơn glucose đói bất thường. TSH (tuyến giáp): suy giáp gây mệt mỏi, tăng cân, rối loạn lipid — dễ nhầm với "lối sống lười biếng".',
      'Đọc kết quả lipid đúng cách — tỷ lệ quan trọng hơn con số: Tỷ lệ Total/HDL: < 4 là lý tưởng; > 5 tăng nguy cơ. Tỷ lệ LDL/HDL: < 2.5 lý tưởng; > 3.5 cần can thiệp. Tỷ lệ TG/HDL: < 2 là dấu hiệu tốt về độ nhạy insulin; > 3 gợi ý kháng insulin. Người có LDL "cao" nhưng HDL rất cao và TG thấp (pattern A): hạt LDL lớn, ít xơ vữa. Người có LDL "bình thường" nhưng HDL thấp và TG cao (pattern B): hạt LDL nhỏ đặc, xơ vữa mạch cao hơn thực tế.',
      'Can thiệp không dùng thuốc hiệu quả đến đâu: Giảm cân 5–10%: giảm LDL 10–15 mg/dL, giảm TG 20–30%. Vận động aerobic 30 phút/ngày × 5 ngày: tăng HDL 5–10%, giảm TG 20–30%, giảm LDL nhẹ. Chế độ ăn Địa Trung Hải: giảm LDL 10–20%, tăng HDL 5%. Giảm carb tinh luyện + đường: giảm TG 20–50% (hiệu quả nhất với TG cao). Dầu cá (Omega-3): giảm TG 20–30% ở liều điều trị (2–4g EPA+DHA/ngày). Hạn chế rượu bia: giảm TG đáng kể. Can thiệp 3–6 tháng trước khi xem xét statin.',
      'Tần suất xét nghiệm tùy theo kết quả: Kết quả bình thường + nguy cơ thấp: mỗi 5 năm (< 40 tuổi không có yếu tố nguy cơ). Tiền ĐTĐ hoặc lipid ranh giới: mỗi 1–2 năm + can thiệp lối sống. Đang điều trị rối loạn lipid: mỗi 3–6 tháng để đánh giá đáp ứng. Gia đình có tiền sử tim mạch sớm (< 55 tuổi ở nam, < 65 ở nữ): xét nghiệm từ 20 tuổi. Tại VN: xét nghiệm lipid có sẵn ở hầu hết phòng khám, chi phí ~150.000–300.000 VNĐ.',
    ],
    points: [
      { icon: '🎯', label: 'HbA1c phát hiện tiền ĐTĐ không cần nhịn ăn — chính xác hơn', note: 'Tiền ĐTĐ can thiệp lối sống sớm: giảm 58% nguy cơ tiến triển' },
      { icon: '📊', label: 'Tỷ lệ TG/HDL < 2: dấu hiệu nhạy insulin tốt — quan trọng hơn LDL', note: 'Tỷ lệ quan trọng hơn từng con số riêng lẻ' },
      { icon: '🥗', label: 'Giảm carb tinh + đường giảm TG 20–50% — hiệu quả nhất', note: 'Omega-3 2–4g/ngày giảm TG 20–30% — dùng 3–6 tháng trước khi nghĩ đến thuốc' },
      { icon: '🔬', label: 'hs-CRP và Homocysteine: nguy cơ tim mạch ngoài cholesterol', note: 'Nhiều nhồi máu cơ tim xảy ra ở người có LDL "bình thường"' },
    ],
  },
  {
    num: '04', icon: '🫘', title: 'Chức năng gan', freq: 'Hàng năm',
    subtitle: 'AST · ALT · GGT · Bilirubin',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    keyFact: '🫘 Gan là cơ quan duy nhất có thể tự tái tạo — nhưng tổn thương mãn tính âm thầm (viêm gan B/C, gan nhiễm mỡ, rượu) tích lũy trong nhiều năm mà không có triệu chứng cho đến khi xơ gan hoặc ung thư gan. Xét nghiệm men gan hàng năm là cách duy nhất phát hiện tổn thương này trước khi không thể phục hồi.',
    details: [
      'Các enzym gan và ý nghĩa: ALT (Alanine Aminotransferase): enzyme chủ yếu trong tế bào gan — tăng đặc hiệu cho tổn thương tế bào gan. Ngưỡng bình thường: nam < 40 U/L, nữ < 35 U/L (mới hơn). Tăng nhẹ (1–3× ULN — Upper Limit of Normal): NAFLD, thuốc, rượu nhẹ. Tăng vừa (3–10×): viêm gan virus hoạt động, thuốc độc gan. Tăng nặng (> 10×): viêm gan cấp nặng, tổn thương gan do thuốc cấp. AST (Aspartate Aminotransferase): ít đặc hiệu hơn — có ở tim, cơ, thận. AST/ALT > 2: gợi ý bệnh gan do rượu. GGT: nhạy với rượu và tắc mật — tăng khi uống rượu kể cả không có tổn thương gan rõ ràng.',
      'NAFLD (Gan nhiễm mỡ không do rượu) — dịch bệnh thầm lặng: NAFLD ảnh hưởng 25–30% dân số toàn cầu; tại VN có thể 20–25%. Phổ bệnh: Gan nhiễm mỡ đơn thuần → NASH (viêm gan nhiễm mỡ) → Xơ gan → Ung thư gan. Đặc biệt: khoảng 30–40% NAFLD có men gan bình thường — ALT không đủ để loại trừ. Siêu âm gan là bổ sung cần thiết. Nguy cơ: béo phì (đặc biệt mỡ nội tạng), tiểu đường type 2, rối loạn lipid, hội chứng chuyển hóa. Điều trị duy nhất được chứng minh: giảm 7–10% cân nặng.',
      'Viêm gan B và C — "kẻ giết người thầm lặng": Viêm gan B (HBV): Việt Nam là nước có tỷ lệ nhiễm HBV cao nhất thế giới (8–15% dân số). Phần lớn không biết mình bị nhiễm. Viêm gan B mãn tính → xơ gan (20–30% trong 20 năm) → ung thư gan. Viêm gan C (HCV): tỷ lệ thấp hơn nhưng 80% trở thành mãn tính. Hiện đã có thuốc uống điều trị khỏi hoàn toàn HCV trong 8–12 tuần (DAA). Cả hai: cần xét nghiệm HBsAg + Anti-HCV ít nhất 1 lần trong đời, hoặc hàng năm nếu có nguy cơ.',
      'Bilirubin và chức năng gan: Bilirubin toàn phần (Total Bilirubin): < 1.2 mg/dL. Tăng → vàng da vàng mắt. Bilirubin trực tiếp (Direct/Conjugated): tắc mật, viêm gan, xơ gan. Bilirubin gián tiếp (Indirect/Unconjugated): tan huyết, hội chứng Gilbert (lành tính). Hội chứng Gilbert: 5–10% dân số, bilirubin gián tiếp tăng nhẹ (thường < 3 mg/dL) khi nhịn ăn hoặc stress — hoàn toàn lành tính, không cần điều trị. Alkaline Phosphatase (ALP): tăng khi tắc mật, bệnh xương, hoặc phụ nữ mang thai.',
      'Thuốc và gan — tương tác cần biết: Paracetamol (Acetaminophen): > 4g/ngày ở người khỏe mạnh, > 2g/ngày ở người uống rượu hoặc suy gan — có thể gây hoại tử gan cấp tính. Nguyên nhân số 1 gây suy gan cấp do thuốc. NSAID (Ibuprofen, Diclofenac): ít gặp hơn nhưng có thể gây tổn thương gan. Statin: tăng men gan nhẹ (< 3× ULN) ở 1–3% người dùng, thường tự hồi phục — không cần ngừng thuốc nếu không có triệu chứng. Thực phẩm bổ sung (herbal supplements): một trong những nguyên nhân tăng hàng đầu của DILI (Drug-Induced Liver Injury) — không phải "tự nhiên" là an toàn.',
      'Khi nào cần siêu âm và sinh thiết gan thêm: ALT > 3× ULN kéo dài > 6 tháng: cần siêu âm + đánh giá toàn diện. Siêu âm gan: phát hiện gan nhiễm mỡ, u gan, xơ gan, sỏi mật. FibroScan (Fibroscan/LSM): đo độ cứng gan không xâm lấn — tương đương sinh thiết trong đánh giá xơ hóa. Được dùng rộng rãi cho bệnh nhân HBV/HCV/NAFLD. AFP (Alpha-Fetoprotein): marker ung thư gan — theo dõi 6 tháng/lần ở bệnh nhân xơ gan + siêu âm định kỳ.',
    ],
    points: [
      { icon: '🇻🇳', label: 'VN: 8–15% dân số nhiễm HBV — đa số không biết', note: 'Xét nghiệm HBsAg ít nhất 1 lần trong đời — nếu âm tính, tiêm vaccine' },
      { icon: '⚠️', label: 'NAFLD: 25–30% dân số, 30–40% có men gan bình thường', note: 'Siêu âm gan bổ sung cho ALT — không thể chỉ dựa vào xét nghiệm máu' },
      { icon: '💊', label: 'Paracetamol > 4g/ngày: nguyên nhân số 1 suy gan cấp do thuốc', note: 'Thuốc bổ thảo dược không phải "an toàn" — nhiều loại độc gan nặng' },
      { icon: '💊', label: 'Viêm gan C: thuốc uống 8–12 tuần điều trị khỏi hoàn toàn', note: 'Anti-HCV 1 lần trong đời để không bỏ lỡ cơ hội điều trị khỏi' },
    ],
  },
  {
    num: '05', icon: '💧', title: 'Chức năng thận', freq: 'Hàng năm',
    subtitle: 'Creatinine · Ure · eGFR · Acid uric',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    keyFact: '💧 Bệnh thận mãn tính (CKD) ảnh hưởng 10–15% dân số toàn cầu và thường không có triệu chứng cho đến khi chức năng thận giảm > 60–70%. Một khi eGFR giảm dưới 30, phần lớn không thể phục hồi — mục tiêu là phát hiện và làm chậm tiến triển từ sớm, không phải chờ suy thận.',
    details: [
      'eGFR — thước đo chức năng thận quan trọng nhất: eGFR (estimated Glomerular Filtration Rate) = tốc độ lọc cầu thận ước tính, tính từ creatinine máu + tuổi + giới tính. Phân loại CKD theo eGFR: G1 (≥ 90) + có tổn thương thận: theo dõi. G2 (60–89): nhẹ. G3a (45–59) và G3b (30–44): trung bình. G4 (15–29): nặng — chuẩn bị thay thế thận. G5 (< 15): suy thận — lọc máu hoặc ghép thận. Creatinine đơn thuần ít hữu ích vì phụ thuộc khối cơ — eGFR chuẩn hóa theo tuổi và giới tính tốt hơn.',
      'Creatinine và BUN (Ure) máu: Creatinine: sản phẩm thoái hóa creatine từ cơ → thận lọc ra ngoài. Tăng khi thận giảm lọc. Bình thường: nam 0.7–1.2 mg/dL, nữ 0.5–1.0 mg/dL. BUN (Blood Urea Nitrogen) / Ure: sản phẩm thoái hóa protein → gan → ure → thận lọc. Tỷ lệ BUN/Creatinine: 10–20 bình thường. > 20: tăng catabolism protein (xuất huyết tiêu hóa, suy tim, mất nước) hoặc uống quá nhiều protein. < 10: bệnh gan nặng, suy dinh dưỡng. Cystatin C: marker chính xác hơn creatinine, không phụ thuộc khối cơ — đặc biệt hữu ích ở người cao tuổi, người gầy.',
      'Acid uric — không chỉ là gout: Bình thường: nam < 420 μmol/L (7.0 mg/dL), nữ < 360 μmol/L (6.0 mg/dL). Tăng acid uric (Hyperuricemia): Gout: viêm khớp cấp do tinh thể urat lắng đọng — ngón cái, mắt cá, đầu gối (cơn đau dữ dội đột ngột, thường đêm khuya). Sỏi thận (Nephrolithiasis): acid uric và calcium oxalate. Bệnh thận do acid uric mãn tính. Nguy cơ tim mạch độc lập. Nguyên nhân tăng: thực phẩm purin cao (thịt đỏ, hải sản, nội tạng), bia (fructose + purin), mất nước, thuốc lợi tiểu, béo phì. Không uống bia khi có gout — bia rất nguy hiểm cho gout.',
      'Yếu tố gây tổn thương thận cần biết và tránh: NSAID (Ibuprofen, Naproxen, Diclofenac): dùng mãn tính hoặc liều cao → co mạch thận → suy thận cấp, đặc biệt nguy hiểm khi mất nước hoặc đã có CKD. Thuốc cản quang (contrast agents): dùng trong CT có cản quang → Contrast-Induced Nephropathy — cần thông báo cho bác sĩ về chức năng thận trước khi làm CT cản quang. Tăng HA không kiểm soát: nguyên nhân số 2 gây suy thận mãn (sau tiểu đường). Tiểu đường không kiểm soát: nguyên nhân số 1. Mất nước nặng và kéo dài. Nhiễm trùng huyết.',
      'Protein niệu (Proteinuria) — dấu hiệu sớm tổn thương thận: thận khỏe mạnh giữ protein trong máu — protein trong nước tiểu là dấu hiệu tổn thương cầu thận. Microalbuminuria (30–300 mg/ngày): tổn thương sớm — quan trọng trong theo dõi bệnh nhân tiểu đường và tăng HA. Macroalbuminuria (> 300 mg/ngày): tổn thương tiến triển. Tỷ lệ albumin/creatinine nước tiểu (ACR): < 30 mg/g bình thường. Xét nghiệm này KHÔNG có trong tổng phân tích nước tiểu thông thường — cần yêu cầu riêng nếu có tiểu đường hoặc tăng HA. Phát hiện microalbuminuria sớm → can thiệp RAAS inhibitor (ACE inhibitor hoặc ARB) → làm chậm tiến triển CKD.',
      'Tần suất xét nghiệm theo nguy cơ: Khỏe mạnh, không yếu tố nguy cơ: hàng năm đủ. Tiểu đường type 2: creatinine + eGFR + ACR mỗi 6 tháng (nếu ACR bất thường) đến mỗi năm (nếu bình thường). Tăng HA: mỗi năm + ACR. CKD đã chẩn đoán G3+: mỗi 3–6 tháng với chuyên khoa thận. Dùng NSAID mãn tính: cần kiểm tra creatinine mỗi 3–6 tháng. Tại VN: creatinine + ure + acid uric có trong hầu hết gói khám tổng quát; eGFR thường được tính tự động từ creatinine.',
    ],
    points: [
      { icon: '📊', label: 'eGFR < 60: CKD giai đoạn 3 — cần theo dõi chuyên khoa thận', note: 'Creatinine bình thường không có nghĩa thận bình thường — cần eGFR' },
      { icon: '🍺', label: 'Gout: không uống bia — bia chứa cả fructose lẫn purin, kép độc', note: 'NSAID mãn tính + mất nước: combo nguy hiểm nhất cho thận' },
      { icon: '🔬', label: 'Microalbuminuria: dấu hiệu sớm nhất tổn thương thận — không thấy trong TPNƯỚC TIỂU thường', note: 'Tiểu đường + tăng HA: yêu cầu xét nghiệm ACR riêng mỗi năm' },
      { icon: '⚠️', label: 'CT cản quang + thận yếu: báo bác sĩ trước — nguy cơ suy thận cấp', note: 'Tăng HA không kiểm soát: nguyên nhân số 2 suy thận mãn' },
    ],
  },
  {
    num: '06', icon: '🔬', title: 'Tổng phân tích nước tiểu', freq: 'Hàng năm',
    subtitle: 'Urinalysis · Phát hiện sớm thận, tiểu đường, nhiễm trùng',
    color: '#eab308', rgb: '234,179,8',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '🔬 Tổng phân tích nước tiểu (Urinalysis) là một trong những xét nghiệm rẻ nhất (~30.000–80.000 VNĐ) nhưng cho lượng thông tin đáng ngạc nhiên: phát hiện tiểu đường, bệnh thận, nhiễm trùng tiết niệu, sỏi thận, và thậm chí ung thư bàng quang — tất cả từ một mẫu nước tiểu.',
    details: [
      'Các thông số trong Urinalysis và ý nghĩa: Màu sắc: vàng nhạt bình thường; đậm = mất nước; đỏ/nâu = máu, thực phẩm (củ dền), myoglobin (tiêu cơ vân). Độ trong: đục → nhiễm khuẩn hoặc tinh thể. pH: 4.5–8.5 bình thường; acid (< 5.5) → gout, nhiễm toan; kiềm (> 7.5) → nhiễm khuẩn Proteus, dùng bicarb. Tỷ trọng (Specific Gravity): 1.005–1.030; thấp → uống nhiều nước hoặc đái tháo nhạt; cao → mất nước. Protein: bình thường âm tính; dương tính → bệnh thận, sốt, vận động cường độ cao. Glucose: bình thường âm tính; dương tính → tiểu đường hoặc ngưỡng thận thấp.',
      'Phát hiện máu trong nước tiểu (Hematuria): Microscopic hematuria (chỉ thấy dưới kính hiển vi): > 3 hồng cầu/HPF. Macroscopic hematuria: nước tiểu màu đỏ/nâu nhìn thấy bằng mắt. Nguyên nhân lành tính: vận động cường độ cao, kinh nguyệt ô nhiễm mẫu, sỏi thận nhỏ. Nguyên nhân cần loại trừ ngay: ung thư bàng quang (đặc biệt ở người hút thuốc > 40 tuổi), ung thư thận, viêm cầu thận. Quy tắc: bất kỳ hematuria không giải thích được ở người > 40 tuổi → nội soi bàng quang (cystoscopy) để loại trừ ung thư. Đừng bỏ qua "tiểu ra máu 1 lần rồi hết".',
      'Bạch cầu và vi khuẩn — nhiễm trùng tiết niệu: Nitrite: dương tính = vi khuẩn gram âm (E. coli) đang có mặt. Leukocyte Esterase: dương tính = bạch cầu → viêm. Nhiễm trùng tiết niệu (UTI): nữ nhiều hơn nam (50% phụ nữ có ít nhất 1 lần UTI trong đời). Viêm bàng quang (Cystitis): tiểu buốt, tiểu rắt, tiểu đục — thường do E. coli. Viêm thận bể thận (Pyelonephritis): sốt cao + đau lưng + WBC trong nước tiểu — cần kháng sinh tích cực. Asymptomatic bacteriuria: vi khuẩn trong nước tiểu nhưng không có triệu chứng — chỉ điều trị ở phụ nữ mang thai, không điều trị ở người bình thường (kháng sinh gây kháng thuốc).',
      'Ketone và Bilirubin trong nước tiểu: Ketone: dương tính khi đói kéo dài, nhịn ăn, tiểu đường type 1 không kiểm soát (DKA), chế độ keto. Bilirubin: bình thường âm; dương tính → tắc mật hoặc bệnh gan nặng. Urobilinogen: tăng trong tan huyết và bệnh gan. Cặn nước tiểu (Urine sediment) dưới kính hiển vi: Trụ (Cast): trụ hồng cầu → viêm cầu thận; trụ bạch cầu → viêm thận bể thận; trụ mỡ → hội chứng thận hư. Tinh thể: Oxalate → sỏi Ca-oxalate; Struvite → sỏi nhiễm khuẩn; Acid uric → sỏi acid uric.',
      'Thu mẫu nước tiểu đúng cách — quan trọng hơn mọi người nghĩ: mẫu nước tiểu giữa dòng (midstream clean-catch): vệ sinh vùng sinh dục trước, bỏ phần nước tiểu đầu và cuối, chỉ lấy phần giữa. Tại sao: phần đầu cuốn vi khuẩn từ niệu đạo → dương tính giả. Thời điểm: nước tiểu buổi sáng đầu tiên (đậm đặc nhất, phát hiện protein/glucose tốt nhất). Phân tích ngay trong 1–2 giờ hoặc bảo quản lạnh. Phụ nữ trong kỳ kinh: cần ghi chú (có thể ô nhiễm máu).',
      'Khi nào cần làm thêm: Protein dương tính mạnh (≥ 2+) → ACR (albumin/creatinine ratio) định lượng chính xác. Blood dương tính không rõ nguyên nhân > 40 tuổi → CT niệu + nội soi bàng quang. Nước tiểu cấy (Urine Culture) khi nghi UTI: xác định vi khuẩn gây bệnh + kháng sinh đồ (không điều trị theo kinh nghiệm nếu có thể). UTI tái phát (> 3 lần/năm) → tìm nguyên nhân: sỏi, bất thường giải phẫu, suy giảm miễn dịch. Glucose niệu ở người không có tiểu đường → ngưỡng thận thấp (renal glycosuria) — lành tính nhưng cần phân biệt với tiểu đường.',
    ],
    points: [
      { icon: '💰', label: 'Rẻ nhất (30–80k VNĐ) nhưng thông tin nhiều nhất — không bỏ qua', note: 'Phát hiện tiểu đường, bệnh thận, UTI, ung thư bàng quang từ 1 mẫu' },
      { icon: '🚨', label: 'Tiểu ra máu 1 lần rồi hết: không bỏ qua — cystoscopy nếu > 40 tuổi', note: 'Ung thư bàng quang: triệu chứng đầu tiên thường chỉ là tiểu ra máu không đau' },
      { icon: '🧫', label: 'Mẫu giữa dòng sau vệ sinh: tránh dương tính giả từ vi khuẩn niệu đạo', note: 'Phụ nữ trong kỳ kinh: ghi chú để tránh nhầm máu kinh với hematuria' },
      { icon: '🔬', label: 'Trụ hồng cầu dưới kính hiển vi: dấu hiệu viêm cầu thận — cần chuyên khoa', note: 'Sediment microscopy quan trọng hơn que nhúng — yêu cầu làm thêm nếu cần' },
    ],
  },
  {
    num: '07', icon: '❤️', title: 'Điện tâm đồ (ECG)', freq: 'Hàng năm (từ 35 tuổi)',
    subtitle: 'Electrocardiogram · Đánh giá điện học tim',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
    keyFact: '❤️ ECG ghi lại hoạt động điện của tim trong 10 giây — và trong 10 giây đó có thể phát hiện nhồi máu cơ tim cũ không triệu chứng, rối loạn nhịp tim tiềm ẩn, phì đại tâm thất, và các bất thường dẫn truyền. Nhiều người sống với rung nhĩ hoặc blốc tim độ 1 mà không biết cho đến khi làm ECG.',
    details: [
      'ECG ghi lại điều gì — 12 chuyển đạo nhìn tim từ 12 góc: ECG chuẩn 12 chuyển đạo ghi hoạt động điện từ 12 hướng khác nhau của tim. Sóng P: khử cực nhĩ (nhĩ co). Phức hợp QRS: khử cực thất (tâm thất co). Sóng T: tái cực thất (tâm thất nghỉ). ST segment: bình thường đẳng điện — tăng hoặc hạ ST là dấu hiệu thiếu máu cơ tim/nhồi máu. QTc interval: kéo dài → tăng nguy cơ rối loạn nhịp nguy hiểm (torsade de pointes). PR interval: kéo dài → blốc nhĩ thất. QRS rộng: blốc nhánh hoặc dẫn truyền bất thường.',
      'Rối loạn nhịp tim phát hiện qua ECG: Rung nhĩ (Atrial Fibrillation — AF): nhịp hoàn toàn không đều, không có sóng P rõ ràng. Nguy hiểm: huyết khối trong nhĩ trái → đột quỵ. Tỷ lệ đột quỵ tăng 5× ở bệnh nhân AF không điều trị chống đông. Tại VN có hàng triệu người AF không biết. Flutter nhĩ: nhịp nhĩ nhanh đều ~300 lần/phút, thất dẫn truyền thường 2:1 (150 lần/phút). Block nhĩ thất (AV block): độ 1 (PR > 200ms) — lành tính; độ 2 Mobitz II và độ 3 (complete heart block) — nguy hiểm, cần máy tạo nhịp. Hội chứng Wolff-Parkinson-White (WPW): đường dẫn truyền phụ — nguy cơ nhịp nhanh kịch phát.',
      'Phát hiện nhồi máu cơ tim cũ qua ECG: Q wave bất thường (pathological Q wave): rộng > 40ms, sâu > 1/4 chiều cao R trong cùng chuyển đạo → dấu hiệu nhồi máu cơ tim cũ. Nhiều người trải qua "silent MI" (nhồi máu cơ tim thầm lặng) mà không biết — chỉ phát hiện tình cờ qua ECG định kỳ. Tỷ lệ silent MI: ~45% tất cả nhồi máu cơ tim. Ý nghĩa: dù không có triệu chứng, nguy cơ tim mạch tương lai tăng cao — cần quản lý tích cực hơn.',
      'LVH (Phì đại tâm thất trái) — hậu quả của tăng HA lâu dài: LVH trên ECG (Sokolow-Lyon criteria: S V1 + R V5/V6 > 35mm): chứng tỏ tăng HA đã ảnh hưởng cơ tim. LVH là yếu tố nguy cơ độc lập cho: suy tim, rối loạn nhịp, đột quỵ, tử vong tim mạch. Phát hiện LVH → kiểm tra và kiểm soát HA tích cực hơn. Siêu âm tim (Echocardiogram) chính xác hơn ECG để đánh giá LVH và chức năng tim.',
      'ECG gắng sức (Stress ECG / Treadmill Test): ECG nghỉ ngơi bình thường không loại trừ bệnh tim mạch vành. Stress ECG phát hiện thiếu máu cơ tim tiềm ẩn khi gắng sức: bệnh nhân chạy trên máy chạy bộ với cường độ tăng dần; nếu có hẹp động mạch vành > 50–70%, sẽ xuất hiện ST hạ hoặc đau ngực. Chỉ định: đau ngực không rõ nguyên nhân, nguy cơ tim mạch cao trung bình (50–70 tuổi, nhiều yếu tố nguy cơ), trước khi bắt đầu chương trình tập luyện cường độ cao. CT Coronary Angiography (CTA): chính xác hơn stress ECG, không xâm lấn — đang thay thế dần cho đối tượng nguy cơ trung bình.',
      'Holter ECG 24–48h — khi ECG tĩnh không đủ: ECG chuẩn chỉ ghi 10 giây — nhiều rối loạn nhịp xuất hiện không liên tục. Holter ECG ghi liên tục 24–48h trong khi bệnh nhân sinh hoạt bình thường. Chỉ định: hồi hộp đánh trống ngực, ngất không rõ nguyên nhân, chóng mặt thoáng qua, đánh giá AF không liên tục. Event recorder 30 ngày: dùng khi triệu chứng rất hiếm. Wearable ECG (Apple Watch ECG, KardiaMobile): phát hiện AF liên tục — đã cứu nhiều mạng người bằng cách phát hiện AF trước đột quỵ.',
    ],
    points: [
      { icon: '🫀', label: 'Rung nhĩ: đột quỵ tăng 5× — nhiều người không biết mình bị AF', note: 'Apple Watch ECG phát hiện AF liên tục — wearable cứu mạng thực sự' },
      { icon: '😶', label: '45% nhồi máu cơ tim không có triệu chứng — chỉ thấy qua ECG định kỳ', note: 'Q wave bất thường: dấu hiệu nhồi máu cũ — cần quản lý nguy cơ tích cực hơn' },
      { icon: '📏', label: 'LVH trên ECG: bằng chứng tăng HA đã ảnh hưởng cơ tim', note: 'Siêu âm tim chính xác hơn ECG để đánh giá LVH và chức năng tim' },
      { icon: '🏃', label: 'Stress ECG trước khi tập luyện cường độ cao từ 50 tuổi', note: 'Holter 24–48h khi hồi hộp thoáng qua không bắt được bằng ECG tĩnh' },
    ],
  },
  {
    num: '08', icon: '🔊', title: 'Siêu âm bụng tổng quát', freq: 'Hàng năm',
    subtitle: 'Gan · Mật · Tụy · Lách · Thận · Bàng quang',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    keyFact: '🔊 Siêu âm bụng là "mắt" nhìn vào các cơ quan bụng mà xét nghiệm máu không thể thấy được. Gan nhiễm mỡ, sỏi mật không triệu chứng, u thận giai đoạn sớm, phình động mạch chủ bụng — tất cả đều phát hiện được qua siêu âm 15–20 phút, không đau, không xâm lấn, không bức xạ.',
    details: [
      'Đánh giá gan qua siêu âm: Gan nhiễm mỡ (Fatty Liver/Hepatic Steatosis): âm vang tăng ("sáng" hơn bình thường), ranh giới thoái hóa. Phân độ: độ 1 (nhẹ), độ 2 (vừa), độ 3 (nặng). Xơ gan (Cirrhosis): bề mặt gan gồ ghề, cạnh gan không đều, nhu mô không đồng nhất, tĩnh mạch cửa giãn. U gan: u đặc (cần phân biệt lành/ác tính), u nang đơn giản (thường lành tính), HCC (hepatocellular carcinoma — ung thư tế bào gan). Kích thước gan: gan to → viêm, xung huyết, u lympho; gan nhỏ → xơ gan tiến triển.',
      'Túi mật và đường mật: Sỏi túi mật (Cholelithiasis): Việt Nam có tỷ lệ cao (10–15% người trưởng thành). Siêu âm phát hiện 95–98% sỏi túi mật. Sỏi nhỏ < 3mm có thể bỏ sót nếu kỹ thuật viên không kinh nghiệm. Nhiều người có sỏi không triệu chứng ("sỏi câm") — xử trí tùy thuộc triệu chứng, kích thước sỏi, và nguy cơ viêm. Polyp túi mật: < 6mm thường lành tính → theo dõi; > 10mm → xem xét cắt túi mật (nguy cơ ung thư). Túi mật thành dày → viêm túi mật (Cholecystitis). Đường mật giãn → tắc mật (sỏi, u, ký sinh trùng).',
      'Thận và đường tiết niệu: Sỏi thận (Nephrolithiasis): siêu âm phát hiện tốt sỏi > 5mm; CT niệu (không cản quang) chính xác hơn cho sỏi nhỏ. Tỷ lệ tái phát sỏi thận: 50% trong 10 năm nếu không điều trị nguyên nhân. U nang thận đơn giản (Simple Renal Cyst): rất phổ biến (> 40 tuổi: 25% có ít nhất 1 u nang), thường lành tính. Phân loại Bosniak: BK1–2 lành tính, BK3–4 cần sinh thiết/phẫu thuật. U thận (Renal Cell Carcinoma — RCC): 25–30% phát hiện tình cờ qua siêu âm định kỳ — giai đoạn sớm, có thể cắt bỏ. Thận teo nhỏ, ứ nước thận: dấu hiệu bệnh thận mãn tính hoặc tắc nghẽn.',
      'Phình động mạch chủ bụng (AAA) — "quả bom hẹn giờ": AAA = phình > 3cm đường kính động mạch chủ bụng. Vỡ AAA: tử vong 80–90%. Nhưng AAA phát hiện sớm và mổ chương trình: tử vong < 5%. Khuyến nghị tầm soát AAA: nam 65–75 tuổi từng hút thuốc — siêu âm 1 lần. Nguy cơ cao (hút thuốc + tăng HA + tiền sử gia đình): nam từ 55 tuổi. AAA nhỏ (3–5.4cm): theo dõi siêu âm 6–12 tháng/lần. AAA ≥ 5.5cm hoặc tăng nhanh > 1cm/năm: mổ ngay.',
      'Chuẩn bị trước siêu âm bụng: nhịn ăn ít nhất 4–6 giờ (lý tưởng là qua đêm). Tại sao: thức ăn gây đầy hơi và làm túi mật co → khó nhìn. Uống nhiều nước (không nước ngọt, không cà phê) để bàng quang đầy (nhìn bàng quang, tử cung, tuyến tiền liệt rõ hơn). Trang phục thoải mái, không có đai kim loại ở bụng. Nếu đang uống thuốc: uống với ít nước, không nhịn thuốc trừ khi bác sĩ yêu cầu. Siêu âm bụng phụ thuộc nhiều vào kỹ năng người thực hiện — chọn cơ sở uy tín.',
      'Hạn chế của siêu âm và khi cần CT/MRI: siêu âm hạn chế bởi hơi ruột (khí che khuẩn trường) và béo phì. CT bụng (không và có cản quang): toàn diện hơn, phát hiện bệnh lý phức tạp hơn, nhưng có bức xạ và chi phí cao hơn. MRI bụng: không bức xạ, độ phân giải mô mềm cao — lý tưởng cho gan, tụy, đường mật; đắt hơn nhiều. MRCP (MR Cholangiopancreatography): hình ảnh đường mật và ống tụy không xâm lấn. ERCP (nội soi): vừa chẩn đoán vừa điều trị (lấy sỏi ống mật chủ).',
    ],
    points: [
      { icon: '🔍', label: 'Phát hiện u thận giai đoạn sớm tình cờ — 25–30% trường hợp RCC', note: 'Giai đoạn 1 cắt bỏ: tỷ lệ sống 5 năm > 90% vs giai đoạn 4: 12%' },
      { icon: '💣', label: 'AAA ≥ 5.5cm: vỡ tử vong 80% — phát hiện sớm mổ chương trình an toàn', note: 'Nam 65–75t hút thuốc: siêu âm 1 lần để tầm soát AAA' },
      { icon: '🫘', label: 'Sỏi túi mật: 10–15% người VN — 95% phát hiện bằng siêu âm', note: 'Polyp > 10mm: xem xét cắt túi mật để phòng ung thư' },
      { icon: '🍽️', label: 'Nhịn ăn 6h trước và uống đủ nước: hình ảnh rõ hơn nhiều', note: 'Siêu âm phụ thuộc kỹ năng kỹ thuật viên — chọn cơ sở uy tín' },
    ],
  },
  {
    num: '09', icon: '🫁', title: 'X-quang ngực thẳng', freq: 'Mỗi 2 năm',
    subtitle: 'Tim · Phổi · Lồng ngực · Cột sống ngực',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    keyFact: '🫁 X-quang ngực là xét nghiệm hình ảnh đơn giản nhất cho lồng ngực — một tấm phim cho phép nhìn thấy phổi, tim, xương sườn, và trung thất cùng lúc. Không lý tưởng cho ung thư phổi sớm (CT liều thấp tốt hơn nhiều), nhưng vẫn là sàng lọc ban đầu giá trị cho lao phổi, viêm phổi, tràn dịch màng phổi, và tim to.',
    details: [
      'Đọc kết quả X-quang ngực — những gì bác sĩ tìm kiếm: Tim: bình thường < 50% chiều ngang lồng ngực (chỉ số tim ngực CTR < 0.5). Tim to → suy tim, bệnh cơ tim, tràn dịch màng ngoài tim. Phổi: nhu mô phổi đồng nhất, không có đám mờ, không có nốt. Màng phổi: bình thường không thấy đường viền rõ ràng; tràn dịch màng phổi → đường mờ ở đáy; tràn khí màng phổi → đường phổi xẹp. Rốn phổi: hạch rốn phổi to → lao, lymphoma, sarcoidosis, ung thư phổi. Trung thất: u trung thất, phình động mạch chủ. Xương sườn, cột sống: gãy xương, tổn thương xương.',
      'Lao phổi — bệnh vẫn còn phổ biến tại Việt Nam: VN vẫn trong top 30 nước có gánh nặng lao cao nhất thế giới. X-quang điển hình lao: đám mờ thùy trên, hang (cavitation), nốt nhỏ rải rác, xơ hóa. Lao tiềm ẩn (LTBI): vi khuẩn lao trong cơ thể không hoạt động, X-quang bình thường — cần test Mantoux hoặc IGRA để phát hiện. Nguy cơ tái hoạt: suy giảm miễn dịch (HIV, corticosteroid, thuốc sinh học), tiểu đường, suy dinh dưỡng. Tiếp xúc người bệnh lao mở → cần kiểm tra X-quang + Mantoux/IGRA.',
      'Giới hạn của X-quang ngực trong tầm soát ung thư phổi: X-quang ngực KHÔNG được chứng minh giảm tử vong do ung thư phổi (RCT PLCO 2011). Lý do: không phát hiện được nốt < 5–8mm, không phân biệt được nốt lành/ác tính rõ ràng. CT liều thấp hàng năm (LDCT): giảm 20–33% tử vong ung thư phổi trong NLST và NELSON — tiêu chuẩn vàng cho tầm soát ung thư phổi. Đối tượng: 50–80 tuổi, ≥ 20 pack-years hút thuốc, đang hút hoặc bỏ < 15 năm. X-quang vẫn có giá trị như công cụ ban đầu nhanh, rẻ, ít phóng xạ — nhưng không nên là tầm soát ung thư phổi chính thức.',
      'Liều phóng xạ — bao nhiêu là an toàn: X-quang ngực: ~0.1 mSv (tương đương tự nhiên 10 ngày). CT ngực thường: ~7 mSv (= 70 X-quang ngực). LDCT liều thấp: 1–2 mSv (= 10–20 X-quang ngực). Phông nền bức xạ tự nhiên VN: ~2–3 mSv/năm. Ngưỡng tăng nguy cơ ung thư: ước tính > 100 mSv tích lũy. Kết luận: X-quang ngực 1–2 lần/năm hoàn toàn an toàn về phóng xạ. CT cần có chỉ định rõ ràng, không làm tùy tiện nhiều lần.',
      'Chụp X-quang đúng kỹ thuật: thở sâu và nín thở khi chụp — phổi căng ra cho hình ảnh rõ hơn. Tư thế PA (Posteroanterior): đứng quay lưng vào bóng đèn X-quang — ít phóng xạ cho tim hơn. Tư thế AP: nằm ngửa hoặc ngồi (dùng khi bệnh nhân không đứng được) — kém chất lượng hơn. Báo cáo X-quang: bác sĩ chẩn đoán hình ảnh đọc kết quả, không phải y tá hay kỹ thuật viên. Nếu thấy nốt bất thường → CT ngực để đánh giá kỹ hơn.',
      'COVID-19 và hậu COVID — thay đổi nhận thức về X-quang phổi: COVID-19 gây viêm phổi kiểu ground-glass opacity (GGO) — X-quang thấy đám mờ hai bên. Hậu COVID: nhiều người có thay đổi phổi kéo dài (fibrosislike changes) sau COVID nặng — cần theo dõi X-quang và CT. Viêm phổi COVID vs viêm phổi vi khuẩn: X-quang không phân biệt được rõ ràng — cần lâm sàng + xét nghiệm. Ý nghĩa cho tầm soát: những người từng bị COVID nặng (nhập viện, thở oxy) nên chụp X-quang ngực 3–6 tháng sau hồi phục để đánh giá tổn thương tồn lưu.',
    ],
    points: [
      { icon: '🫀', label: 'Tim > 50% chiều ngang ngực: gợi ý suy tim — siêu âm tim xác nhận', note: 'Tràn dịch màng phổi, tràn khí: phát hiện ngay bằng X-quang' },
      { icon: '🦠', label: 'VN top 30 gánh nặng lao — X-quang phổi phát hiện lao hoạt động', note: 'Tiếp xúc người bệnh lao: X-quang + Mantoux/IGRA để tầm soát' },
      { icon: '⚠️', label: 'X-quang KHÔNG thay thế LDCT trong tầm soát ung thư phổi', note: 'LDCT hàng năm cho người hút thuốc 50–80t: giảm 20–33% tử vong' },
      { icon: '☢️', label: 'Liều phóng xạ 0.1 mSv = 10 ngày phông tự nhiên — hoàn toàn an toàn', note: 'CT ngực 7 mSv — cần chỉ định rõ ràng, không làm tùy tiện' },
    ],
  },
  {
    num: '10', icon: '👁️', title: 'Khám mắt', freq: 'Mỗi 2 năm',
    subtitle: 'Thị lực · Nhãn áp · Đáy mắt · Glaucoma',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1574170609431-1d71e9c9bb6e?w=800&q=80',
    keyFact: '👁️ Glaucoma (Tăng nhãn áp) là nguyên nhân mù lòa không thể phục hồi phổ biến thứ 2 thế giới — và 50% người bệnh không biết mình bị. Một khi mù do glaucoma, thị lực không thể phục hồi. Nhưng nếu phát hiện và điều trị sớm, hầu hết không tiến triển đến mù. Khám nhãn áp định kỳ là biện pháp bảo vệ thị lực đơn giản và hiệu quả nhất.',
    details: [
      'Glaucoma — kẻ giết thị lực thầm lặng: Glaucoma thường không có triệu chứng cho đến khi mất > 40% sợi thần kinh. Glaucoma góc mở (Open-angle): phổ biến nhất (90%), tiến triển chậm, mất thị lực ngoại vi âm thầm. Nhãn áp > 21 mmHg là yếu tố nguy cơ chính — nhưng 30–40% glaucoma có nhãn áp bình thường (normal-tension glaucoma). Khi mất thị lực do glaucoma: không thể phục hồi. Điều trị sớm (thuốc nhỏ mắt, laser, phẫu thuật): ngăn hoặc làm chậm tiến triển, bảo vệ thị lực còn lại. Tầm soát glaucoma từ 40 tuổi; sớm hơn nếu: gia đình có glaucoma, cận thị nặng, đái tháo đường, dùng corticosteroid kéo dài.',
      'Đáy mắt và bệnh võng mạc tiểu đường: soi đáy mắt (fundoscopy) là bắt buộc với bệnh nhân tiểu đường. Diabetic Retinopathy (DR): mạch máu nhỏ võng mạc bị tổn thương do đường huyết cao mãn tính → vi phình mạch, xuất huyết, phù hoàng điểm, tân mạch (PDR). Nguyên nhân mù lòa số 1 ở người < 60 tuổi. Phát hiện sớm: tiêm anti-VEGF hoặc laser ngăn tiến triển hiệu quả > 90%. ĐTĐ type 2: khám đáy mắt ngay khi chẩn đoán, sau đó hàng năm. ĐTĐ type 1: khám sau 5 năm mắc bệnh, sau đó hàng năm.',
      'Thoái hóa điểm vàng tuổi già (AMD): AMD là nguyên nhân mù lòa số 1 ở người > 60 tuổi tại các nước phát triển. AMD khô (dry AMD): tiến triển chậm, drusen (đốm vàng) ở điểm vàng — hiện chưa có điều trị hiệu quả cao. AMD ướt (wet AMD): tân mạch choroidal → xuất huyết đột ngột → mù trung tâm nhanh. Điều trị kịp thời anti-VEGF (Ranibizumab, Bevacizumab): bảo vệ thị lực ở 90%+ bệnh nhân. Nguy cơ AMD: tuổi > 60, hút thuốc (nhân đôi nguy cơ), tiếp xúc UV, béo phì. Phát hiện qua OCT (Optical Coherence Tomography) — chính xác nhất.',
      'Tật khúc xạ và điều chỉnh thị lực: Cận thị (Myopia): độ cận > -6D là "high myopia" — tăng nguy cơ bong võng mạc, glaucoma, AMD. Tỷ lệ cận thị ở trẻ em VN tăng nhanh (40–60% học sinh thành thị). Kiểm soát cận thị ở trẻ: dành ≥ 2h/ngày ngoài trời, atropine 0.01% nhỏ mắt, kính orthokeratology. Lão thị (Presbyopia): từ 40–45 tuổi, thủy tinh thể cứng dần → khó nhìn gần. Bình thường — cần kính đọc sách hoặc kính đa tròng. Đục thủy tinh thể (Cataract): rất phổ biến > 60 tuổi, điều trị phẫu thuật phaco an toàn và hiệu quả.',
      'Khám mắt toàn diện bao gồm gì: Đo thị lực (Visual Acuity): bảng chữ Snellen từ 6 mét. 20/20 = thị lực bình thường. Đo nhãn áp (Tonometry): Non-contact (khí thổi) — sàng lọc ban đầu; Goldmann applanation — tiêu chuẩn vàng. Soi đáy mắt (Fundoscopy): nhỏ thuốc giãn đồng tử cho hình ảnh đáy mắt đầy đủ (mất 20–30 phút để giãn đồng tử). Kiểm tra thị trường (Visual Field Test): quan trọng trong theo dõi glaucoma. OCT: chụp cắt lớp võng mạc và gai thị — phát hiện AMD, bệnh võng mạc tiểu đường, glaucoma sớm với độ chính xác cao.',
      'Tần suất khám và ưu tiên: Không có yếu tố nguy cơ: 2 năm/lần từ 40 tuổi; hàng năm từ 60 tuổi. Đái tháo đường: hàng năm (bất kể tuổi). Gia đình có glaucoma: hàng năm từ 35–40 tuổi. Cận thị > -6D: hàng năm (nguy cơ bong võng mạc). Dùng Hydroxychloroquine (Plaquenil): khám đáy mắt hàng năm (độc tính võng mạc). Triệu chứng cần khám ngay (không đợi định kỳ): mất thị lực đột ngột, nhìn thấy mạng nhện/đốm đen (floaters tăng đột ngột + photopsia → bong võng mạc), đau mắt đỏ dữ dội (góc đóng cấp).',
    ],
    points: [
      { icon: '👁️', label: 'Glaucoma: 50% không biết — không triệu chứng đến khi mất > 40% sợi tk', note: 'Mù do glaucoma: không thể phục hồi. Phát hiện sớm: bảo vệ được' },
      { icon: '🩸', label: 'Tiểu đường: khám đáy mắt ngay khi chẩn đoán, sau đó hàng năm', note: 'Anti-VEGF kịp thời ngăn mù do DR > 90% — nhưng cần phát hiện sớm' },
      { icon: '⚠️', label: 'Floaters tăng đột ngột + ánh sáng chớp: khám NGAY — bong võng mạc', note: 'Bong võng mạc: cấp cứu nhãn khoa — trễ > 24h mất thị lực vĩnh viễn' },
      { icon: '🧒', label: 'Cận thị > -6D: nguy cơ bong võng mạc, glaucoma — khám hàng năm', note: 'Trẻ em: 2h/ngày ngoài trời giảm 50% nguy cơ tiến triển cận thị' },
    ],
  },
  {
    num: '11', icon: '🦷', title: 'Khám nha khoa', freq: 'Mỗi 6 tháng',
    subtitle: 'Tầm soát · Lấy cao răng · X-quang nha khoa',
    color: '#ec4899', rgb: '236,72,153',
    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    keyFact: '🦷 Sức khỏe miệng liên quan mật thiết đến sức khỏe toàn thân — không chỉ là thẩm mỹ. Viêm nha chu (periodontitis) là nhiễm trùng mãn tính gây viêm toàn thân, liên quan đến tăng nguy cơ tim mạch, biến chứng tiểu đường, và sinh non. Vi khuẩn miệng có thể theo máu đến tim (viêm nội tâm mạc nhiễm khuẩn). Khám nha khoa 6 tháng/lần là đầu tư sức khỏe toàn thân, không chỉ răng.',
    details: [
      'Mối liên hệ miệng – tim mạch: Periodontitis → viêm toàn thân (systemic inflammation): tăng CRP, IL-6, TNF-α → xúc tiến xơ vữa động mạch. Meta-analysis (Humphrey, 2008): viêm nha chu tăng 19% nguy cơ tim mạch; tăng 44% nguy cơ đột quỵ. Vi khuẩn từ túi nha chu (Porphyromonas gingivalis, Streptococcus mutans) phát hiện trong mảng xơ vữa động mạch. Điều trị viêm nha chu cải thiện chức năng nội mô mạch máu. Với bệnh nhân van tim nhân tạo hoặc một số bệnh tim bẩm sinh: cần dự phòng kháng sinh trước thủ thuật nha khoa (antibiotic prophylaxis) để ngăn viêm nội tâm mạc.',
      'Tiểu đường và miệng — mối quan hệ hai chiều: Tiểu đường → viêm nha chu: đường huyết cao giảm miễn dịch → dễ nhiễm trùng nướu hơn. Viêm nha chu → kiểm soát đường huyết kém hơn: viêm mãn tính gây kháng insulin. Điều trị viêm nha chu ở bệnh nhân ĐTĐ: giảm HbA1c 0.4–0.5% — tương đương một số thuốc hạ đường huyết. Bệnh nhân ĐTĐ: khám nha khoa hàng năm tối thiểu; nhiều bác sĩ khuyên 3–4 tháng/lần. Khô miệng (Xerostomia) do thuốc tiểu đường và tăng HA: tăng nguy cơ sâu răng và nhiễm nấm Candida.',
      'Sâu răng (Dental Caries) — bệnh nhiễm trùng mãn tính phổ biến nhất: Streptococcus mutans + đường → acid → mất khoáng men răng → sâu răng. Giai đoạn: mất khoáng (reversible với fluoride) → sâu men (nông, có thể trám) → sâu ngà (đau khi ăn lạnh/ngọt) → viêm tủy (đau tự phát, dữ dội) → hoại tử tủy → áp xe chân răng. Fluoride: cơ chế bảo vệ men răng, có trong nước máy (ở nhiều nước) và kem đánh răng — hiệu quả cao nhất nếu dùng đúng cách ngay từ nhỏ. Sealant: trám bít rãnh mặt nhai ở trẻ em — giảm 80% sâu răng hàm.',
      'Lấy cao răng (Scaling) — tại sao cần mỗi 6 tháng: Plaque (mảng bám): màng vi khuẩn bám lên răng, có thể loại bỏ bằng chải răng và chỉ nha khoa. Nếu không loại bỏ trong 24–72h: khoáng hóa thành calculus (cao răng). Cao răng: chỉ bác sĩ nha khoa mới lấy được — không thể chải bỏ. Cao răng dưới nướu (subgingival calculus): gây viêm nha chu tiến triển → mất xương ổ răng → lung lay và mất răng. Lấy cao răng 6 tháng/lần: ngăn tích tụ cao và viêm nha chu tiến triển. Người có viêm nha chu nặng: cần SRP (scaling and root planing) và theo dõi mỗi 3–4 tháng.',
      'X-quang nha khoa định kỳ — phát hiện những gì không thấy bằng mắt: X-quang cánh cắn (Bitewing X-ray): phát hiện sâu răng giữa các răng (interproximal caries) — không thể thấy khi thăm khám bằng mắt. Mỗi 1–2 năm ở người nguy cơ trung bình. X-quang toàn hàm (OPG/Panoramic): nhìn toàn bộ hàm trên và hàm dưới, khớp thái dương hàm, xương hàm, răng khôn. X-quang quanh chóp (Periapical): đánh giá chóp răng — áp xe, tiêu xương quanh chóp, cần chữa tủy. CBCT (Cone Beam CT): 3D, dùng trong cấy ghép implant, chỉnh nha phức tạp, u xương hàm. Liều X-quang nha khoa rất thấp: bitewing hai bên < 0.005 mSv — không đáng kể so với phông tự nhiên.',
      'Chăm sóc răng miệng tại nhà — bằng chứng cập nhật: Chải răng: 2 lần/ngày, 2 phút, bàn chải mềm, kỹ thuật Bass (45° vào đường nướu). Kem đánh răng fluoride 1.000–1.450 ppm: không nhổ ngay sau chải (giảm hiệu quả fluoride — chỉ nhổ bọt, không súc miệng ngay). Chỉ nha khoa: 1 lần/ngày trước khi chải tối — loại bỏ mảng bám giữa các răng mà bàn chải không tới được. Máy tăm nước (Water Flosser/Oral-B Waterpik): bổ trợ cho chỉ nha khoa, đặc biệt hữu ích cho người đeo implant, niềng, cầu răng. Nước súc miệng fluoride: thêm lớp bảo vệ, dùng khác giờ với chải răng. Đường: hạn chế tần suất ăn đường và đồ uống có acid (nước ngọt, nước ép) — pH thấp gây mất khoáng men.',
    ],
    points: [
      { icon: '❤️', label: 'Viêm nha chu tăng 19% nguy cơ tim mạch, 44% đột quỵ', note: 'Điều trị nha chu cải thiện HbA1c 0.4–0.5% ở người tiểu đường' },
      { icon: '🦠', label: 'Cao răng chỉ bác sĩ lấy được — tích tụ 6 tháng gây viêm nha chu', note: 'Viêm nha chu nặng: mất xương ổ, lung lay răng, mất răng — không phục hồi' },
      { icon: '🪥', label: 'Không súc miệng ngay sau chải — để fluoride bám vào men', note: 'Chỉ nha khoa 1 lần/ngày: loại 40% mảng bám bàn chải không tới được' },
      { icon: '📸', label: 'X-quang cánh cắn: phát hiện sâu giữa răng khuất — không thấy bằng mắt', note: 'Liều X-quang nha khoa < 0.005 mSv — không đáng kể, làm hàng năm an toàn' },
    ],
  },
];

const EXTENDED_PACKAGES = [
  {
    title: 'Có nguy cơ tim mạch',
    icon: '❤️',
    color: '#ef4444',
    triggers: 'Hút thuốc, HA cao, tiểu đường, mỡ máu cao, béo phì, gia đình có tiền sử',
    tests: ['Siêu âm tim (Echocardiography)', 'Test gắng sức (Stress ECG)', 'CRP siêu nhạy', 'Homocysteine'],
  },
  {
    title: 'Phụ nữ > 40 tuổi',
    icon: '🌸',
    color: '#ec4899',
    triggers: 'Mọi phụ nữ từ 40 tuổi, hoặc sớm hơn nếu có yếu tố nguy cơ',
    tests: ['Siêu âm vú (mỗi năm)', 'Mamogram (mỗi 1–2 năm từ 40–45)', 'Pap smear hoặc HPV test (mỗi 3–5 năm)', 'DEXA scan (loãng xương từ 50 tuổi hoặc mãn kinh)'],
  },
  {
    title: 'Nam giới > 40 tuổi',
    icon: '💙',
    color: '#3b82f6',
    triggers: 'Mọi nam giới từ 40 tuổi, hoặc sớm hơn nếu có tiền sử gia đình',
    tests: ['PSA (kháng nguyên đặc hiệu tiền liệt tuyến)', 'Testosterone (nếu có triệu chứng)', 'Siêu âm tiền liệt tuyến nếu PSA bất thường'],
  },
  {
    title: 'Tiền sử gia đình ung thư',
    icon: '🧬',
    color: '#8b5cf6',
    triggers: 'Ba/mẹ/anh/chị/em ruột mắc ung thư đại tràng, vú, buồng trứng, dạ dày',
    tests: ['Nội soi đại tràng từ 40 tuổi (hoặc sớm hơn 10 năm so với người thân mắc bệnh)', 'Xét nghiệm gen BRCA (nếu nguy cơ cao)', 'Nội soi dạ dày nếu tiền sử gia đình'],
  },
];

function CheckupCard({ item, idx, checked, onToggle, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isDone = checked.includes(idx);
  return (
    <div
      className="flex items-stretch rounded-2xl border bg-surface overflow-hidden transition-all duration-200"
      style={{
        borderColor: hovered ? `rgba(${item.rgb},0.45)` : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? `0 0 18px rgba(${item.rgb},0.1)` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onToggle(idx)}
        className="flex items-center justify-center px-4 shrink-0 border-r border-white/5 transition-colors"
        style={{ background: isDone ? `rgba(${item.rgb},0.1)` : 'transparent' }}
        title="Đánh dấu hoàn thành"
      >
        <div
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={isDone ? { background: item.color, borderColor: item.color } : { borderColor: 'rgba(255,255,255,0.25)' }}
        >
          {isDone && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
        </div>
      </button>
      <button
        onClick={() => onOpen(idx)}
        className="flex-1 flex items-center gap-3 py-3 px-4 text-left cursor-pointer"
      >
        <span className="text-xl shrink-0">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>{item.title}</span>
          <p className="text-xs text-muted mt-0.5 truncate">{item.subtitle}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: item.color, background: `rgba(${item.rgb},0.12)` }}>{item.freq}</span>
          <span className="text-[10px]" style={{ color: `rgba(${item.rgb},0.5)` }}>Chi tiết →</span>
        </div>
      </button>
    </div>
  );
}

function CheckupModal({ item, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: item.color, background: `rgba(${item.rgb},0.18)`, border: `1px solid rgba(${item.rgb},0.3)` }}>
              Mục {item.num}/{String(total).padStart(2, '0')}
            </span>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.title}</h2>
          <p className="font-semibold text-sm mb-3" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.subtitle}</p>
          <span className="inline-block text-xs font-bold px-2 py-1 rounded-full mb-6" style={{ color: item.color, background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.2)` }}>{item.freq}</span>

          <div className="mb-6 pl-4 border-l-2 py-1" style={{ borderColor: item.color }}>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: 'rgba(255,255,255,0.5)' }}>Nhấn ESC hoặc click bên ngoài để đóng</p>
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
      const el = document.getElementById(`reveal-cu-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-cu-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthCheckupPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [checked, setChecked] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_checkup_done') || '[]'); } catch { return []; } });
  const [openExtended, setOpenExtended] = useState(null);
  const [checkupModal, setCheckupModal] = useState(null);

  function toggle(i) {
    const updated = checked.includes(i) ? checked.filter(c => c !== i) : [...checked, i];
    setChecked(updated);
    localStorage.setItem('healthapp_checkup_done', JSON.stringify(updated));
  }

  const doneCount = checked.filter(c => c < BASIC_PACKAGE.length).length;
  const pct = Math.round((doneCount / BASIC_PACKAGE.length) * 100);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eCheckupOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eCheckupOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🏥</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Khám Định Kỳ</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Tầm soát · Phát hiện sớm
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Phát hiện sớm bệnh ở giai đoạn chưa có triệu chứng là một trong những can thiệp y tế hiệu quả nhất. Tỷ lệ sống sót của ung thư phát hiện giai đoạn 1 cao hơn 5–10 lần so với giai đoạn muộn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop" alt="Khám định kỳ" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Phát hiện sớm · Điều trị hiệu quả hơn
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · Nên khám định kỳ {b0.age >= 40 ? 'mỗi 6–12 tháng với gói cơ bản và mở rộng phù hợp tuổi.' : 'hàng năm với gói cơ bản.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Gói Khám Cơ Bản Hàng Năm</h2>
          <span className="text-lg font-bold" style={{ color: COLOR }}>{doneCount}/{BASIC_PACKAGE.length}</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COLOR }} />
        </div>
        <div className="space-y-2">
          {BASIC_PACKAGE.map((item, i) => (
            <CheckupCard key={i} item={item} idx={i} checked={checked} onToggle={toggle} onOpen={setCheckupModal} />
          ))}
        </div>
        <p className="text-base text-muted mt-3">Nhấn để đánh dấu đã hoàn thành. Dữ liệu lưu trong thiết bị.</p>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Gói Mở Rộng Theo Nguy Cơ</h2>
        <p className="text-muted text-lg mb-6">Trao đổi với bác sĩ về gói khám phù hợp với hồ sơ nguy cơ cá nhân của bạn.</p>
        <div className="space-y-3">
          {EXTENDED_PACKAGES.map((pkg, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenExtended(openExtended === i ? null : i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-2xl">{pkg.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-lg text-text">{pkg.title}</div>
                </div>
                <span className="text-muted">{openExtended === i ? '▲' : '▼'}</span>
              </button>
              {openExtended === i && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <p className="text-base text-muted"><strong style={{ color: pkg.color }}>Áp dụng khi: </strong>{pkg.triggers}</p>
                  <ul className="space-y-1">
                    {pkg.tests.map((t, j) => (
                      <li key={j} className="flex gap-2 text-lg text-muted">
                        <span style={{ color: pkg.color }} className="shrink-0">+</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Chuẩn Bị Trước Khi Đi Khám</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li>• Nhịn ăn 8–12 tiếng (chỉ uống nước lọc) cho các xét nghiệm máu yêu cầu đói</li>
            <li>• Mang theo hồ sơ bệnh án cũ, toa thuốc đang dùng</li>
            <li>• Liệt kê trước các câu hỏi muốn hỏi bác sĩ</li>
            <li>• Ghi lại kết quả vào hồ sơ cá nhân để theo dõi xu hướng theo năm</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {checkupModal !== null && (
        <CheckupModal
          item={BASIC_PACKAGE[checkupModal]}
          total={BASIC_PACKAGE.length}
          onClose={() => setCheckupModal(null)}
          onPrev={() => setCheckupModal(i => Math.max(0, i - 1))}
          onNext={() => setCheckupModal(i => Math.min(BASIC_PACKAGE.length - 1, i + 1))}
          hasPrev={checkupModal > 0}
          hasNext={checkupModal < BASIC_PACKAGE.length - 1}
        />
      )}
    </div>
  );
}
