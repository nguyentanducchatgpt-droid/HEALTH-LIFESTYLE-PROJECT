import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#8b5cf6';
const RGB = '139,92,246';
const ORBIT_ID = 'e-lipids-orbit-kf';
const ORBIT_CLASS = 'e-lipids-orbit-ring';
const ORBIT_PROP = '--e-lipids-orbit-angle';

const LIPID_PANEL = [
  {
    icon: '🩺', label: 'Cholesterol Toàn Phần', range: '< 200 mg/dL',
    color: '#8b5cf6', rgb: '139,92,246', unit: 'mg/dL',
    desc: 'Tổng lượng cholesterol trong máu. Tự nó không đủ để đánh giá nguy cơ — cần xem cùng với LDL/HDL.',
    levels: [
      { label: 'Tối ưu', range: '< 170', color: '#22c55e' },
      { label: 'Chấp nhận được', range: '170–199', color: '#eab308' },
      { label: 'Cao — Cần theo dõi', range: '200–239', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 240', color: '#ef4444' },
    ],
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    keyFact: '💡 Cholesterol toàn phần < 200 mg/dL không đảm bảo an toàn tim mạch nếu LDL cao và HDL thấp. Tỷ lệ Total/HDL quan trọng hơn: < 3.5 = lý tưởng; > 5.0 = nguy cơ tăng. Người TC 210 nhưng HDL 80 (tỷ lệ 2.6) an toàn hơn người TC 185 nhưng HDL 25 (tỷ lệ 7.4).',
    detail: 'Cholesterol toàn phần chỉ là điểm khởi đầu — bản thân nó không tiên đoán tốt nguy cơ tim mạch bằng LDL-C riêng lẻ hay tỷ lệ LDL/HDL. Cần xem toàn bộ bảng lipid cùng các yếu tố nguy cơ khác.',
    details: [
      'Cholesterol là lipid thiết yếu: cấu trúc màng tế bào, tổng hợp hormone steroid (cortisol, testosterone, estrogen), vitamin D, và acid mật. Cơ thể tự tổng hợp 75% tại gan — chỉ 25% từ thực phẩm.',
      'Phân loại AHA: < 170 mg/dL (tối ưu); 170–199 (chấp nhận được); 200–239 (cao ranh giới — cần đánh giá toàn diện); ≥ 240 mg/dL (cao — tăng gấp đôi nguy cơ tim mạch so với < 200).',
      'Tỷ lệ Total/HDL: < 3.5 lý tưởng; 3.5–5.0 bình thường; > 5.0 nguy cơ tăng; > 6.0 nguy cơ cao. Đây là chỉ số dự đoán tốt hơn TC đơn lẻ.',
      'Các yếu tố tăng cholesterol thứ phát: suy giáp, suy thận mạn, hội chứng thận hư, tiểu đường, thuốc (steroid, lợi tiểu). Cần loại trừ trước khi kết luận là rối loạn lipid nguyên phát.',
      'Xét nghiệm lúc đói 9–12h cho bảng lipid đầy đủ. TC và HDL có thể đo không nhịn ăn — nhưng thực hành lâm sàng thường nhịn đói để lấy đủ bộ gồm cả TG.',
      'Cholesterol dao động theo mùa: cao hơn mùa đông 5–10 mg/dL do ít vận động và chế độ ăn thay đổi. Một lần đo không đủ đại diện — cần xu hướng qua nhiều lần.',
    ],
    points: [
      { icon: '⚖️', label: 'TC/HDL quan trọng hơn TC đơn', note: 'Mục tiêu tỷ lệ < 3.5 là lý tưởng' },
      { icon: '🏭', label: '75% do gan tổng hợp', note: 'Chế độ ăn chỉ ảnh hưởng 25% cholesterol máu' },
      { icon: '📅', label: 'Đo xu hướng dài hạn', note: 'Một lần đo không đủ — so sánh theo thời gian' },
      { icon: '💊', label: 'Kiểm tra thuốc đang dùng', note: 'Steroid, lợi tiểu có thể tăng cholesterol' },
    ],
  },
  {
    icon: '⚠️', label: 'LDL-C — Cholesterol "Xấu"', range: '< 100 mg/dL',
    color: '#ef4444', rgb: '239,68,68', unit: 'mg/dL',
    desc: 'Lipoprotein tỉ trọng thấp — vận chuyển cholesterol đến mô, có thể tích tụ trong thành mạch gây xơ vữa.',
    levels: [
      { label: 'Tối ưu', range: '< 100', color: '#22c55e' },
      { label: 'Gần tối ưu', range: '100–129', color: '#84cc16' },
      { label: 'Cao ranh giới', range: '130–159', color: '#eab308' },
      { label: 'Cao', range: '160–189', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 190', color: '#ef4444' },
    ],
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 LDL-C là mục tiêu điều trị chính. Nghiên cứu CTT: mỗi 38.7 mg/dL giảm LDL-C → giảm 22% biến cố tim mạch lớn. Mục tiêu theo nguy cơ: nguy cơ rất cao (tiền sử nhồi máu) → < 55 mg/dL; nguy cơ cao → < 70 mg/dL; nguy cơ trung bình → < 100 mg/dL.',
    detail: 'LDL không xấu về bản chất — vấn đề xảy ra khi LDL quá cao, bị oxy hóa và tích lũy trong lớp nội mạc động mạch, khởi phát chuỗi phản ứng viêm dẫn đến mảng xơ vữa và hẹp lòng mạch.',
    details: [
      'Cơ chế gây hại: LDL-C đi vào lớp dưới nội mạc → bị oxy hóa (oxLDL) → đại thực bào nuốt oxLDL → trở thành "foam cells" (tế bào bọt) → tích lũy thành mảng xơ vữa → hẹp lòng mạch → nhồi máu cơ tim / đột quỵ.',
      'Mục tiêu LDL-C theo nhóm nguy cơ (ESC/EAS 2019): nguy cơ rất cao → < 55 mg/dL; nguy cơ cao (tiểu đường có tổn thương cơ quan, THA nặng) → < 70 mg/dL; nguy cơ trung bình → < 100 mg/dL; nguy cơ thấp → < 116 mg/dL.',
      'LDL tính qua công thức Friedewald: LDL = TC - HDL - TG/5 (mg/dL). Không chính xác khi TG > 400 mg/dL. Phòng xét nghiệm hiện đại đo trực tiếp — chính xác hơn.',
      'Small dense LDL (sdLDL): phân nhóm LDL nhỏ đặc nguy hiểm hơn vì dễ xâm nhập thành mạch. Thường cao ở người TG cao + HDL thấp. Xét nghiệm LDL thường không phân biệt sdLDL.',
      'Statin giảm LDL 30–55% tùy loại/liều, được chứng minh giảm tử vong tim mạch. Tác dụng phụ đau cơ phổ biến nhưng thường nhẹ; tiêu cơ vân (rhabdomyolysis) hiếm < 0.1%.',
      'Thay đổi lối sống giảm LDL 10–20%: giảm SFA < 7% tổng calo, tăng chất xơ hòa tan 10–25g/ngày, phytosterol 2g/ngày, giảm cân nếu thừa cân. Hiệu quả bổ sung khi kết hợp với statin.',
    ],
    points: [
      { icon: '🎯', label: 'Mục tiêu tùy nguy cơ', note: '< 55 (rất cao) đến < 116 mg/dL (thấp)' },
      { icon: '🔬', label: 'sdLDL nguy hiểm hơn', note: 'LDL nhỏ đặc → dễ xâm nhập thành mạch' },
      { icon: '💊', label: 'Statin giảm 30–55% LDL', note: 'Giảm 22% biến cố/38.7 mg/dL giảm' },
      { icon: '🥗', label: 'Lối sống giảm 10–20%', note: 'Chất xơ + ít SFA + phytosterol' },
    ],
  },
  {
    icon: '🛡️', label: 'HDL-C — Cholesterol "Tốt"', range: '≥ 60 mg/dL',
    color: '#22c55e', rgb: '34,197,94', unit: 'mg/dL',
    desc: 'Lipoprotein tỉ trọng cao — thu gom cholesterol dư thừa từ mô và đưa về gan để xử lý. HDL càng cao càng tốt.',
    levels: [
      { label: 'Nguy cơ cao (thấp)', range: '< 40 (nam) / < 50 (nữ)', color: '#ef4444' },
      { label: 'Bình thường', range: '40–59', color: '#eab308' },
      { label: 'Bảo vệ tim mạch', range: '≥ 60', color: '#22c55e' },
    ],
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '💡 HDL-C thấp (< 40 nam, < 50 nữ) là yếu tố nguy cơ tim mạch độc lập — ngay cả khi LDL bình thường. Cách tăng HDL hiệu quả nhất: vận động aerobic 150 phút/tuần (+3–9 mg/dL), bỏ thuốc lá (+4–10 mg/dL). Thuốc tăng HDL trong thử nghiệm lâm sàng thất bại — chức năng HDL quan trọng hơn số lượng.',
    detail: 'HDL thực hiện "vận chuyển cholesterol ngược" (reverse cholesterol transport) — thu gom cholesterol từ mảng xơ vữa và tế bào ngoại biên, đưa về gan phân giải. Đây là cơ chế bảo vệ tim mạch cốt lõi.',
    details: [
      'Cơ chế bảo vệ của HDL: (1) Reverse cholesterol transport — thu gom cholesterol từ mảng xơ vữa về gan; (2) Chống oxy hóa — ngăn LDL bị oxy hóa; (3) Chống viêm — ức chế cytokines; (4) Chống kết tập tiểu cầu — giảm nguy cơ huyết khối.',
      'Phụ nữ thường có HDL cao hơn nam 10 mg/dL — estrogen tăng sản xuất HDL. Sau mãn kinh HDL giảm, LDL tăng → nguy cơ tim mạch tăng nhanh và tiệm cận với nam giới.',
      'Nguyên nhân HDL thấp: hút thuốc lá (giảm 4–10 mg/dL), béo phì bụng, không vận động, carb tinh chế nhiều, tiểu đường type 2, TG cao, thuốc beta-blocker và steroid.',
      'Cách tăng HDL: vận động aerobic 150 phút/tuần (+3–9 mg/dL); bỏ thuốc lá (+4–10 mg/dL); giảm cân — mỗi 3kg giảm → HDL tăng ~1 mg/dL; rượu vừa phải cũng tăng HDL nhưng nguy cơ khác vượt qua lợi ích.',
      '"Paradox of HDL": thuốc tăng HDL mạnh (CETP inhibitor như torcetrapib) trong thử nghiệm không giảm biến cố tim mạch dù HDL tăng 70%. Chức năng thu gom cholesterol của HDL quan trọng hơn nồng độ HDL.',
      'HDL > 100 mg/dL không phải "càng cao càng tốt": đột biến gene gây HDL rất cao có thể mất chức năng. Mức lý tưởng thực tế: 60–90 mg/dL.',
    ],
    points: [
      { icon: '🏃', label: 'Vận động: +3–9 mg/dL HDL', note: '150 phút aerobic/tuần — hiệu quả nhất' },
      { icon: '🚬', label: 'Bỏ thuốc lá: +4–10 mg/dL', note: 'Hiệu quả nhanh trong 2–4 tuần' },
      { icon: '🔬', label: 'Chức năng > số lượng HDL', note: 'Thuốc tăng HDL thất bại — vận động không' },
      { icon: '⚖️', label: '3kg giảm → +1 mg/dL HDL', note: 'Giảm cân bền vững, từng bước' },
    ],
  },
  {
    icon: '🔬', label: 'Triglycerides', range: '< 150 mg/dL',
    color: '#f97316', rgb: '249,115,22', unit: 'mg/dL',
    desc: 'Chất béo trong máu. Cao do ăn nhiều carb tinh chế, đường, rượu, và ít vận động.',
    levels: [
      { label: 'Bình thường', range: '< 150', color: '#22c55e' },
      { label: 'Cao ranh giới', range: '150–199', color: '#eab308' },
      { label: 'Cao', range: '200–499', color: '#f97316' },
      { label: 'Rất cao', range: '≥ 500', color: '#ef4444' },
    ],
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    keyFact: '💡 TG ≥ 500 mg/dL là ngưỡng cấp cứu — nguy cơ viêm tụy cấp tăng đột biến. TG rất nhạy với chế độ ăn: giảm đường tinh chế + bỏ rượu bia có thể giảm TG 30–50% trong 4 tuần. Omega-3 liều cao (2–4g EPA+DHA/ngày) giảm TG thêm 20–45%.',
    detail: 'Triglycerides là dạng lưu trữ năng lượng chính trong mỡ cơ thể. TG máu cao phản ánh cơ thể đang nhận nhiều năng lượng từ đường, tinh bột và rượu hơn mức tiêu thụ — không nhất thiết từ chất béo khẩu phần.',
    details: [
      'Nguồn TG trong máu: (1) Carb dư thừa → gan chuyển thành TG đóng gói vào VLDL; (2) Rượu → ưu tiên chuyển hóa ethanol → tích lũy TG; (3) Mỡ thực phẩm → chylomicrons hấp thu từ ruột. TG sau ăn tăng mạnh — cần nhịn ăn 9–12h mới đo chính xác.',
      'TG cao và HDL thấp thường đi cùng: VLDL trao đổi với HDL → HDL mất lipid, trở nên nhỏ hơn và bị thận bài tiết nhanh → HDL giảm. Đây là "hội chứng chuyển hóa" lipid điển hình ở người ít vận động + ăn nhiều đường.',
      'Viêm tụy cấp do TG: khi TG > 500 mg/dL, lipase tụy thủy phân TG trong mao mạch tụy → acid béo tự do gây độc → viêm tụy. TG > 1000 mg/dL nguy cơ rất cao. Điều trị: insulin truyền TM + nhịn ăn + fibrate.',
      'Nguyên nhân thứ phát cần loại trừ: tiểu đường kém kiểm soát, suy giáp, suy thận, thuốc (corticoid, retinoid, beta-blocker, tamoxifen). Điều trị nguyên nhân thường cải thiện TG đáng kể.',
      'Thay đổi lối sống hiệu quả nhất: giảm đường đơn + tinh bột trắng; bỏ rượu hoàn toàn; omega-3 liều cao (2–4g EPA+DHA/ngày) giảm TG 20–45%; vận động aerobic; giảm cân.',
      'Fibrate (fenofibrate, gemfibrozil) giảm TG 30–50% và tăng HDL 10–20% — chỉ định khi TG > 500 mg/dL để phòng viêm tụy, hoặc > 200 mg/dL ở người nguy cơ tim mạch cao đang dùng statin.',
    ],
    points: [
      { icon: '🍚', label: 'Giảm đường + carb tinh chế', note: 'Nguyên nhân hàng đầu TG cao ở người trẻ' },
      { icon: '🐟', label: 'Omega-3 giảm TG 20–45%', note: '2–4g EPA+DHA/ngày — tương đương thuốc' },
      { icon: '🍺', label: 'Bỏ rượu bia', note: 'TG rất nhạy với alcohol — giảm nhanh khi bỏ' },
      { icon: '🚨', label: 'TG ≥ 500: nguy cơ viêm tụy', note: 'Cần điều trị thuốc khẩn cấp' },
    ],
  },
];

const FOOD_HELP = [
  {
    icon: '🐟', label: 'Cá béo (cá hồi, cá ngừ)', range: 'Omega-3',
    color: '#3b82f6', rgb: '59,130,246',
    effect: 'Omega-3 → giảm TG, tăng HDL',
    img: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80',
    keyFact: '💡 Omega-3 (EPA+DHA) từ cá béo ở liều 2–4g/ngày giảm Triglycerides 20–45% — hiệu quả tương đương thuốc. AHA khuyến nghị ăn cá 2 lần/tuần. Nghiên cứu REDUCE-IT (NEJM 2018): EPA tinh khiết 4g/ngày giảm 25% biến cố tim mạch lớn ở người TG cao đang dùng statin.',
    detail: 'Cá béo là nguồn EPA và DHA tự nhiên tốt nhất — hấp thu hiệu quả hơn ALA từ thực vật (hạt chia, hạt lanh) vì không cần qua bước chuyển đổi kém hiệu quả (< 15%) trong cơ thể.',
    details: [
      'EPA và DHA là omega-3 chuỗi dài từ cá béo. Nguồn tốt nhất: cá hồi (2.2g/100g), cá thu (2g/100g), cá sardine (1.5g/100g), cá ngừ vây xanh (1.5g/100g). ALA từ hạt chia/lanh chỉ chuyển đổi 5–15% thành EPA/DHA.',
      'Cơ chế giảm TG: EPA/DHA ức chế enzyme tổng hợp TG trong gan (DGAT) và tăng beta-oxidation acid béo → gan sản xuất ít VLDL → TG máu giảm 20–45% với liều 2–4g/ngày.',
      'Icosapent ethyl (Vascepa — EPA tinh khiết 4g/ngày): REDUCE-IT (NEJM 2018) — giảm 25% biến cố tim mạch lớn ở người TG 135–499 đang dùng statin. Tác dụng ngoài việc chỉ giảm TG.',
      'Ăn cá 2 lần/tuần (150–200g/lần): cung cấp 500–1000mg EPA+DHA/ngày — mức khuyến nghị AHA phòng ngừa tiên phát. Phương pháp tốt nhất: hấp, nướng, áp chảo — tránh chiên phá hủy omega-3.',
      'Cá hồi nuôi và tự nhiên đều giàu omega-3 — cá hồi nuôi theo tiêu chuẩn an toàn và hàm lượng omega-3 tương đương. Lưu ý thủy ngân: cá ngừ đại dương (bigeye tuna) — hạn chế với phụ nữ mang thai.',
      'Dầu cá bổ sung khi không ăn đủ: 1–2 viên/ngày (500mg–1g EPA+DHA/viên). Chọn sản phẩm có chứng nhận IFOS (International Fish Oil Standards) để đảm bảo độ tinh khiết.',
    ],
    points: [
      { icon: '📉', label: 'TG giảm 20–45%', note: '2–4g EPA+DHA/ngày — tương đương thuốc' },
      { icon: '🍽️', label: '2 lần/tuần là đủ', note: '150–200g/lần — hấp hoặc nướng' },
      { icon: '💊', label: 'Fish oil khi không ăn đủ cá', note: 'Chọn sản phẩm IFOS-certified' },
      { icon: '❤️', label: 'REDUCE-IT: -25% biến cố TM', note: 'EPA 4g/ngày + statin ở người TG cao' },
    ],
  },
  {
    icon: '🥑', label: 'Bơ, dầu ô liu', range: 'Béo không bão hòa đơn',
    color: '#84cc16', rgb: '132,204,22',
    effect: 'Chất béo không bão hòa đơn → giảm LDL',
    img: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80',
    keyFact: '💡 Dầu ô liu extra virgin (EVOO) chứa 70–80% oleic acid (MUFA) + polyphenols chống viêm. Nghiên cứu PREDIMED (NEJM 2013): chế độ ăn Mediterranean + EVOO giảm 30% biến cố tim mạch lớn — bằng chứng mạnh nhất cho loại chất béo lành mạnh.',
    detail: 'MUFA trong bơ và dầu ô liu hạ LDL mà không làm giảm HDL — khác với chế độ ăn ít béo thông thường làm giảm cả hai. EVOO còn có tác dụng chống viêm độc lập qua polyphenols.',
    details: [
      'Cơ chế hạ LDL của MUFA: khi thay thế SFA bằng MUFA, LDL receptor trên tế bào gan hoạt động tốt hơn → thu hồi nhiều LDL từ máu → LDL giảm. Khác với ít béo (giảm cả LDL lẫn HDL).',
      'Bơ (avocado): 1 quả (150g) chứa 22g MUFA, 10g chất xơ, 975mg kali, vitamin E, B6. Nghiên cứu Penn State (JAHA 2015): 1 quả bơ/ngày thay carb tinh chế giảm LDL 13.5 mg/dL và cải thiện tỷ lệ TC/HDL.',
      'Dầu ô liu extra virgin (EVOO) vs. tinh lọc: EVOO giữ nguyên polyphenols (oleocanthal — kháng viêm tương tự ibuprofen; hydroxytyrosol — chống oxy hóa). Nhận biết EVOO thật: vị hơi cay/đắng ở cuống họng.',
      'Nhiệt độ dùng EVOO: điểm khói 190–210°C — đủ để xào ở lửa vừa. Tốt nhất dùng EVOO cho salad và nấu nhẹ. Chiên sâu > 180°C dùng dầu bơ (điểm khói ~270°C) hoặc dầu hướng dương cao oleic.',
      'Dầu thực vật cao MUFA khác: dầu bơ (avocado oil — 70% MUFA), dầu hạt cải/canola (62% MUFA, 31% PUFA), dầu hướng dương cao oleic (80% MUFA). Tránh dầu cọ (SFA cao) và dầu hydro hóa (trans fat).',
      'Lưu ý calo: bơ và dầu ô liu đậm đặc calo (9kcal/g). 1 muỗng canh dầu = 120kcal; ¼ quả bơ = 80kcal. Thay thế chứ không cộng thêm — tổng calo vẫn phải trong ngưỡng.',
    ],
    points: [
      { icon: '🫒', label: 'EVOO: polyphenols kháng viêm', note: 'Chọn extra virgin — vị cay nhẹ cuống họng' },
      { icon: '📉', label: 'Bơ 1 quả/ngày → LDL -13.5', note: 'Thay thế carb tinh chế — không cộng thêm' },
      { icon: '🔥', label: 'EVOO xào vừa được', note: 'Điểm khói 190–210°C, không chiên sâu' },
      { icon: '🥗', label: 'PREDIMED: -30% biến cố TM', note: 'Mediterranean + EVOO — bằng chứng mạnh nhất' },
    ],
  },
  {
    icon: '🌰', label: 'Các loại hạt (óc chó, hạnh nhân)', range: 'Omega-3 + Phytosterol',
    color: '#f97316', rgb: '249,115,22',
    effect: 'Omega-3, chất xơ → giảm LDL',
    img: 'https://images.unsplash.com/photo-1508061942072-a1a27b7f1c53?w=800&q=80',
    keyFact: '💡 Meta-analysis (BMJ 2016, 61 nghiên cứu): ăn 28g hạt/ngày (1 nắm nhỏ) giảm LDL-C 4.8 mg/dL và TG 2.2 mg/dL, không tăng cân nếu thay thế thực phẩm khác. Óc chó dẫn đầu nhờ hàm lượng ALA omega-3 cao nhất (2.5g/28g).',
    detail: 'Các loại hạt kết hợp hoàn hảo nhiều cơ chế: MUFA/PUFA hạ LDL, chất xơ hòa tan ngăn hấp thu cholesterol, phytosterol cạnh tranh với cholesterol tại ruột, và arginine tăng NO giãn mạch.',
    details: [
      'Óc chó (walnut): 28g chứa 2.5g ALA omega-3 (nhiều nhất trong các loại hạt), 18g PUFA+MUFA, 2g chất xơ, 4g protein. AHA đặc biệt khuyến nghị óc chó cho sức khỏe tim mạch.',
      'Hạnh nhân (almond): 28g chứa 13g MUFA, 3.5g chất xơ, 76mg magie, 7.6mg vitamin E. Nghiên cứu cho thấy 1.5oz/ngày giảm LDL 5–10% và nguy cơ bệnh tim mạch vành.',
      'Cơ chế giảm cholesterol: (1) MUFA/PUFA thay thế SFA; (2) Phytosterol (50–200mg/28g) cạnh tranh với cholesterol tại receptor ruột → giảm hấp thu cholesterol 5–15%; (3) Chất xơ gắn acid mật → buộc gan lấy thêm cholesterol.',
      'Không gây tăng cân nếu ăn đúng: nghiên cứu Harvard 30 năm > 100,000 người — ăn hạt mỗi ngày liên quan đến cân nặng thấp hơn. Hạt tạo no tốt và 20–30% calo không được hấp thu do chất xơ.',
      'Cách ăn: sống hoặc rang khô không muối là tốt nhất. Kết hợp vào salad, yogurt, hoặc thay snack chế biến. Nhiều loại hạt Việt Nam cũng tốt: hạt điều, hạt bí ngô, hạt hướng dương.',
      'Dị ứng hạt: phổ biến với hạnh nhân, óc chó, đậu phộng (lạc — kỹ thuật là legume). Nếu có tiền sử dị ứng, tham khảo bác sĩ về xét nghiệm dị ứng trước khi tăng lượng ăn.',
    ],
    points: [
      { icon: '🥜', label: '28g/ngày — 1 nắm nhỏ', note: 'LDL -4.8, TG -2.2 mg/dL' },
      { icon: '🫚', label: 'Óc chó: ALA cao nhất', note: '2.5g ALA omega-3/28g' },
      { icon: '🚫', label: 'Không muối, không chiên dầu', note: 'Hạt sống/rang khô — giữ nguyên lợi ích' },
      { icon: '🧩', label: 'Phytosterol giảm hấp thu', note: 'Cạnh tranh cholesterol tại receptor ruột' },
    ],
  },
  {
    icon: '🫘', label: 'Đậu các loại', range: 'Chất xơ hòa tan',
    color: '#22c55e', rgb: '34,197,94',
    effect: 'Chất xơ hòa tan → giảm hấp thu cholesterol',
    img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
    keyFact: '💡 Meta-analysis (CMAJ 2014, 26 nghiên cứu): 1 khẩu phần đậu/ngày (130g nấu chín) giảm LDL-C 5% (~6 mg/dL). Cơ chế: beta-glucan + pectin tạo gel trong ruột, gắn acid mật → gan phải dùng cholesterol từ máu để tổng hợp acid mật mới → LDL giảm.',
    detail: 'Đậu kết hợp được chất xơ hòa tan cao + protein thực vật + GI thấp + phytosterol — một gói toàn diện bảo vệ tim mạch và kiểm soát đường huyết cùng lúc.',
    details: [
      'Hàm lượng chất xơ/100g đậu nấu chín: đậu đen (8.7g), đậu xanh (7.6g), đậu lăng (8g), chickpea (7.6g), đậu nành (6g). Mục tiêu 25–30g chất xơ/ngày — 1 khẩu phần đậu đóng góp 25–35%.',
      'Cơ chế: (1) Beta-glucan + pectin tạo gel nhớt → làm chậm hấp thu cholesterol và acid mật; (2) Acid mật bị gắn → bài xuất theo phân → gan lấy LDL từ máu tổng hợp acid mật mới; (3) Propionate từ lên men → ức chế tổng hợp cholesterol ở gan.',
      'Đậu và đường huyết: GI đậu 20–40 (rất thấp) — đặc biệt có lợi cho người tiền tiểu đường/kháng insulin kết hợp với rối loạn lipid. Một thực phẩm giải quyết cả hai vấn đề cùng lúc.',
      'Đậu phụ (tofu) và edamame: nguồn protein đậu nành tốt. Đậu phụ 100g chứa 8g protein, 2g PUFA, ít calo. FDA công nhận 25g protein đậu nành/ngày hỗ trợ giảm nguy cơ tim mạch.',
      'Flatulence (đầy bụng): do oligosaccharides (raffinose, stachyose) không tiêu hóa → vi khuẩn lên men → khí. Cải thiện bằng: ngâm và thay nước trước nấu, bắt đầu từ lượng nhỏ tăng dần, hoặc dùng đậu hộp đã rửa.',
      'Thực tế Việt Nam: chè đậu xanh, đậu đen, đậu đỏ (không ít đường), canh đậu hũ, đậu hũ kho — tất cả là nguồn đậu tốt. Mục tiêu 3–5 khẩu phần/tuần thay vì mỗi ngày cho người mới bắt đầu.',
    ],
    points: [
      { icon: '📉', label: '1 khẩu phần/ngày → LDL -5%', note: '130g đậu nấu chín — đơn giản, hiệu quả' },
      { icon: '🔄', label: 'Acid mật bẫy → LDL giảm', note: 'Beta-glucan gắn acid mật — gan dùng LDL bù lại' },
      { icon: '🩸', label: 'GI 20–40 — tốt cho đường huyết', note: 'Kép lợi: giảm LDL + ổn định đường huyết' },
      { icon: '💨', label: 'Ngâm + rửa giảm đầy bụng', note: 'Oligosaccharides tan trong nước khi rửa' },
    ],
  },
  {
    icon: '🥦', label: 'Rau xanh đậm', range: 'Phytosterol + Nitrat',
    color: '#10b981', rgb: '16,185,129',
    effect: 'Chất xơ, sterol thực vật → cải thiện lipid',
    img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800&q=80',
    keyFact: '💡 Rau xanh đậm chứa phytosterol cạnh tranh tại receptor hấp thu cholesterol ở ruột — 2g phytosterol/ngày giảm LDL 8–10%. Ngoài ra, nitrat trong rau lá xanh → nitric oxide → giãn mạch, hạ huyết áp 3–5 mmHg — bonus bảo vệ tim mạch ngoài lipid.',
    detail: 'Rau xanh đậm (cải xanh, rau bó xôi, bông cải, rau muống, kale) không chỉ cung cấp chất xơ và vi chất — chúng bảo vệ tim mạch qua nhiều cơ chế song song: giảm hấp thu cholesterol, chống oxy hóa LDL, và giãn mạch.',
    details: [
      'Phytosterol trong rau xanh: beta-sitosterol, campesterol, stigmasterol — cấu trúc tương tự cholesterol, cạnh tranh tại NPC1L1 receptor ở ruột → giảm hấp thu cholesterol 30–50% khi đủ lượng. Bông cải: 39mg/100g; kale: 31mg/100g; rau bó xôi: 30mg/100g.',
      'Nitrat → NO: vi khuẩn miệng chuyển nitrat → nitrit → NO (nitric oxide) khi nuốt → NO giãn cơ trơn mạch máu → hạ HA 3–5 mmHg. Nguồn nitrat cao: rau bó xôi, củ dền, cải xanh, cải rocket.',
      'Carotenoids (lutein, beta-carotene): chất chống oxy hóa ngăn LDL bị oxy hóa — bước đầu tiên gây xơ vữa. Lutein đặc biệt tập trung trong LDL, bảo vệ LDL tại "mặt trận".',
      'Acid folic trong rau xanh: cải thiện chuyển hóa homocysteine — homocysteine cao gây tổn thương nội mạc mạch máu độc lập với lipid. Nguồn folate tốt: rau bó xôi, cải chíp, măng tây.',
      'Không cần "siêu rau": rau muống, cải bó xôi, bông cải xanh, rau lang, cải thìa — tất cả đều có lợi ích. Đa dạng loại rau mỗi tuần tốt hơn ăn mỗi một loại. Mục tiêu 400–500g rau/ngày (WHO).',
      'Phần lớn người Việt chỉ ăn 200–250g rau/ngày — chỉ đạt 50–60% khuyến nghị. Đơn giản tăng rau: thêm 1 bát rau luộc vào mỗi bữa ăn chiều, hoặc ăn salad vào bữa trưa.',
    ],
    points: [
      { icon: '🌿', label: 'Phytosterol giảm hấp thu', note: '2g/ngày → LDL giảm 8–10%' },
      { icon: '💨', label: 'Nitrat → NO → giãn mạch', note: 'Hạ HA 3–5 mmHg — bonus ngoài lipid' },
      { icon: '🛡️', label: 'Carotenoid bảo vệ LDL', note: 'Ngăn LDL bị oxy hóa — nguồn gốc xơ vữa' },
      { icon: '🥗', label: 'Mục tiêu 400–500g rau/ngày', note: 'Đa dạng loại rau — không cần "siêu rau"' },
    ],
  },
  {
    icon: '🫐', label: 'Quả mọng (blueberry, dâu tây)', range: 'Polyphenols',
    color: '#8b5cf6', rgb: '139,92,246',
    effect: 'Polyphenols → chống oxy hóa LDL',
    img: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&q=80',
    keyFact: '💡 Anthocyanins trong quả mọng ức chế oxy hóa LDL — bước đầu tiên của xơ vữa động mạch. Nghiên cứu Harvard 18 năm, 93,600 phụ nữ: ăn ≥ 3 khẩu phần blueberry/dâu tây mỗi tuần giảm 32% nguy cơ nhồi máu cơ tim.',
    detail: 'Quả mọng không giảm LDL trực tiếp nhiều — nhưng ngăn LDL bị oxy hóa (oxLDL), và chính oxLDL mới là dạng kích hoạt xơ vữa. Bảo vệ chất lượng LDL có thể quan trọng hơn chỉ giảm số lượng LDL.',
    details: [
      'Anthocyanins: sắc tố flavonoid tạo màu đỏ-xanh-tím trong blueberry, dâu tây, nho đen, mâm xôi, anh đào. Hấp thu vào máu trong 1–2 giờ sau ăn, gắn với LDL và nội mạc mạch máu → bảo vệ khỏi oxy hóa.',
      'Cơ chế bảo vệ: (1) Ức chế LDL bị oxy hóa; (2) Giảm adhesion molecules (ICAM-1, VCAM-1) → giảm bạch cầu bám vào thành mạch; (3) Tăng NO production → giãn mạch; (4) Giảm platelet aggregation nhẹ.',
      'Blueberry (1 cup/150g/ngày trong 6 tháng, Am J Clin Nutr 2019): giảm 12–15% nguy cơ bệnh tim mạch ở người béo phì có hội chứng chuyển hóa. Cơ chế: cải thiện chức năng mạch máu và giảm LDL nhẹ.',
      'Dâu tây: giàu vitamin C (58mg/100g), ellagic acid, fisetin (flavonoid kháng viêm). Nghiên cứu cho thấy 8 quả dâu/ngày cải thiện chức năng mạch máu ở người rối loạn cholesterol.',
      'Quả mọng Việt Nam: dâu ta (mulberry), chanh leo, dâu rừng, mâm xôi — tất cả đều chứa anthocyanins cao. Dâu ta (dâu tằm) có hàm lượng anthocyanin rất cao, dễ tìm và rẻ hơn blueberry nhập khẩu.',
      'Tươi vs. đông lạnh: quả mọng đông lạnh ngay sau thu hoạch giữ gần như toàn bộ anthocyanins — thực ra thường nhiều polyphenol hơn quả tươi bán lâu ngày. Sinh tố, nước ép, mứt ít đường cũng có lợi ích nhưng kém hơn ăn trực tiếp.',
    ],
    points: [
      { icon: '🔵', label: 'Anthocyanin bảo vệ LDL', note: 'Ngăn LDL bị oxy hóa — nguồn gốc xơ vữa' },
      { icon: '❤️', label: 'Harvard 18 năm: -32% NMCT', note: '≥ 3 khẩu phần/tuần blueberry/dâu' },
      { icon: '🧊', label: 'Đông lạnh = tươi về dinh dưỡng', note: 'Đôi khi nhiều polyphenol hơn tươi bán lâu' },
      { icon: '🌸', label: 'Dâu ta, mâm xôi cũng tốt', note: 'Anthocyanin cao — dễ tìm ở Việt Nam' },
    ],
  },
];

const FOOD_AVOID = [
  {
    icon: '🧈', label: 'Bơ động vật, mỡ lợn', range: 'Chất béo bão hòa',
    color: '#ef4444', rgb: '239,68,68',
    reason: 'Chất béo bão hòa → tăng LDL',
    img: 'https://images.unsplash.com/photo-1557093793-e196ae071479?w=800&q=80',
    keyFact: '💡 Mỗi 1% năng lượng từ chất béo bão hòa (SFA) tăng thêm → LDL-C tăng ~1.5–2 mg/dL. WHO khuyến nghị SFA < 10% tổng calo (~22g/ngày). Người Việt trung bình tiêu thụ 10–12% từ SFA — giảm về 7% giúp hạ LDL thêm 7–10 mg/dL mà không cần thuốc.',
    detail: 'SFA không gây hại ngay lập tức — nhưng tiêu thụ hàng ngày trong nhiều năm làm tăng LDL mạn tính và dần dần xây dựng mảng xơ vữa. Thay đổi lối sống cần duy trì lâu dài mới thấy lợi ích rõ.',
    details: [
      'Cơ chế: SFA (lauric, myristic, palmitic acid) downregulate LDL receptor trên gan → gan thu hồi ít LDL từ máu → LDL tích lũy. Stearic acid (trong chocolate đen) là ngoại lệ — ít ảnh hưởng LDL hơn.',
      'Nguồn SFA phổ biến ở Việt Nam: mỡ lợn, bơ động vật (butter), thịt đỏ mỡ (ba chỉ, nạc vai), da gà, nước cốt dừa và dầu dừa, dầu cọ (trong nhiều snack, bánh kẹo), phô mai béo.',
      'Dầu dừa và dầu cọ: tuy nguồn gốc thực vật nhưng SFA rất cao (dầu dừa 87%, dầu cọ 49%). Dầu dừa chủ yếu là lauric acid — tăng cả LDL lẫn HDL. AHA không khuyến nghị dầu dừa như "healthy fat".',
      'Hạn chế đến đâu: WHO < 10% tổng calo từ SFA (~20–22g/2000kcal). AHA khuyến nghị chặt hơn: < 5–6% (11–13g/ngày) cho người nguy cơ tim mạch. Không cần bằng không — hạn chế là đủ.',
      'Thực tế thay thế: nấu bằng dầu thực vật (ô liu, hạt cải) thay mỡ lợn/bơ; ăn thịt nạc (ức gà, thăn lợn) thay ba chỉ; giảm món rán, kho đặc mỡ; đọc nhãn tránh sản phẩm > 5g SFA/100g.',
      'SFA tự nhiên vs. chế biến: SFA trong thịt nạc và sữa nguyên chất ít nguy hiểm hơn SFA trong thực phẩm chế biến kết hợp với đường và muối. Ưu tiên giảm thực phẩm chế biến trước.',
    ],
    points: [
      { icon: '📉', label: '1% SFA thêm → LDL +2 mg/dL', note: 'Tác động dài hạn — âm thầm nhưng đáng kể' },
      { icon: '🥥', label: 'Dầu dừa/cọ: không phải healthy', note: 'SFA cao — AHA không khuyến nghị' },
      { icon: '🍗', label: 'Bỏ da gà, chọn thịt nạc', note: 'Đơn giản nhất để giảm SFA mỗi ngày' },
      { icon: '🍳', label: 'Thay mỡ/bơ bằng dầu thực vật', note: 'Dầu ô liu, hạt cải — thay thế trực tiếp' },
    ],
  },
  {
    icon: '🍟', label: 'Đồ chiên rán, fast food', range: 'Trans fat',
    color: '#f97316', rgb: '249,115,22',
    reason: 'Trans fat → tăng LDL, giảm HDL',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f55f1e4f?w=800&q=80',
    keyFact: '💡 Trans fat là loại chất béo nguy hiểm nhất: tăng LDL VÀ giảm HDL cùng lúc — tác hại gấp đôi so với SFA. WHO ước tính trans fat gây 500,000 ca tử vong tim mạch/năm toàn cầu và đặt mục tiêu loại bỏ hoàn toàn trans fat công nghiệp (REPLACE initiative).',
    detail: 'Trans fat công nghiệp hình thành khi dầu thực vật bị hydro hóa một phần (partially hydrogenated oils/PHO) để tạo chất béo đặc hơn, bền hơn, rẻ hơn — phổ biến trong bánh nướng công nghiệp, snack, và dầu chiên dùng nhiều lần.',
    details: [
      'Nguồn trans fat: (1) Công nghiệp (nguy hiểm hơn): dầu hydro hóa một phần (PHO) trong bánh quy, cracker, bơ thực vật rẻ, dầu chiên thương mại tái dùng; (2) Tự nhiên (ít hại hơn): CLA trong thịt bò/sữa — hàm lượng thấp.',
      'Tác hại kép: trans fat (1) Tăng LDL; (2) Giảm HDL; (3) Tăng TG; (4) Gây viêm — tăng CRP và IL-6; (5) Rối loạn chức năng nội mạc. Một loại chất béo "đánh" vào tất cả yếu tố nguy cơ tim mạch cùng lúc.',
      'Chiên rán nhiều lần: dầu thực vật không bão hòa khi đun > 180°C nhiều lần → hình thành trans fat và sản phẩm oxy hóa độc hại. Dầu chiên tại hàng quán (bánh rán, nem rán, gà rán) thường tái dùng nhiều lần.',
      'Đọc nhãn: tìm "partially hydrogenated" hoặc "dầu hydro hóa một phần" trong thành phần → có trans fat. Nhãn ghi "0g trans fat" có thể chứa đến 0.5g/khẩu phần — đọc thành phần mới chính xác.',
      'Fast food điển hình: 1000–1500kcal, 20–30g SFA, 2–5g trans fat, 1000–1500mg natri, 50–80g đường. Ăn thường xuyên (> 3 lần/tuần) tích lũy tác hại rất nhanh.',
      'Thay thế: tự nấu thay ăn ngoài; nếu chiên, dùng dầu có điểm khói cao (dầu bơ, dầu hướng dương cao oleic) và không tái dùng dầu đã chiên; chọn snack từ hạt, rau quả thay bánh quy/snack đóng gói.',
    ],
    points: [
      { icon: '💀', label: 'Tác hại kép: LDL↑ + HDL↓', note: 'Nguy hiểm nhất trong các loại chất béo' },
      { icon: '📋', label: 'Tìm "partially hydrogenated"', note: 'Trong danh sách thành phần trên nhãn' },
      { icon: '🔥', label: 'Không tái dùng dầu chiên', note: 'Nhiệt cao nhiều lần → tạo trans fat mới' },
      { icon: '🌍', label: 'WHO: 500,000 ca tử vong/năm', note: 'Mục tiêu loại bỏ trans fat công nghiệp' },
    ],
  },
  {
    icon: '🍰', label: 'Bánh ngọt, đồ ngọt', range: 'Đường tinh chế',
    color: '#eab308', rgb: '234,179,8',
    reason: 'Đường tinh chế → tăng TG',
    img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
    keyFact: '💡 Fructose (50% trong sucrose, 55% trong HFCS) được chuyển hóa hoàn toàn ở gan thành TG. Uống 1 lon nước ngọt/ngày (38g fructose) liên tục 10 tuần → TG tăng 32%. Đường tinh chế là nguyên nhân hàng đầu TG cao ở người trẻ, ít vận động.',
    detail: 'Khác với SFA tác động chủ yếu lên LDL/HDL, đường tinh chế ảnh hưởng mạnh nhất lên Triglycerides — và TG cao kết hợp HDL thấp là "hội chứng chuyển hóa" phổ biến ở người ít vận động, ăn nhiều đường.',
    details: [
      'Cơ chế: đường đơn dư thừa → gan chuyển thành TG qua de novo lipogenesis (DNL) → VLDL tăng → TG máu tăng. Fructose đặc biệt "béo gan" vì gan không có giới hạn hấp thu fructose như glucose.',
      'Fructose vs. glucose: glucose phân phối đến mô, cần insulin. Fructose đi thẳng vào gan và gần 100% chuyển hóa tại đây → dễ thành TG hơn glucose. Đây là lý do nước ngọt (fructose cao) nguy hiểm hơn cơm (glucose).',
      'Nguồn đường ẩn: nước ngọt (36–40g/330ml), nước tăng lực (27g/250ml), nước ép hộp (20–25g/250ml), yogurt có đường (10–20g/hộp), sốt cà chua (4g/muỗng canh), bánh mì công nghiệp.',
      'Bánh ngọt nguy hiểm kép: đường + SFA + đôi khi trans fat → tấn công lipid ở 3 mặt cùng lúc (TG tăng, LDL tăng, HDL giảm). Một miếng bánh công nghiệp có thể chứa 15g đường + 10g SFA + 1–2g trans fat.',
      'WHO khuyến nghị < 10% tổng calo từ đường thêm (< 50g/ngày với 2000kcal), lý tưởng < 5% (< 25g). Đường trong trái cây nguyên vẹn ít ảnh hưởng do đi kèm chất xơ làm chậm hấp thu.',
      'Thay thế thực tế: trái cây tươi thay snack ngọt; nước lọc/trà xanh không đường thay nước ngọt; yogurt không đường + mật ong nhỏ + trái cây; tự làm bánh ít đường thay bánh mua sẵn.',
    ],
    points: [
      { icon: '🧃', label: '1 lon nước ngọt/ngày → TG +32%', note: 'Sau 10 tuần liên tục' },
      { icon: '🍇', label: 'Fructose → TG nhanh nhất', note: '100% chuyển hóa tại gan — không giới hạn' },
      { icon: '🔍', label: 'Đọc nhãn: đường ẩn khắp nơi', note: 'Sốt, bánh mì, yogurt — cộng dồn nhiều' },
      { icon: '🎯', label: 'Mục tiêu < 25g đường thêm/ngày', note: 'WHO lý tưởng < 5% tổng calo' },
    ],
  },
  {
    icon: '🍺', label: 'Rượu bia', range: 'Calo rỗng + TG',
    color: '#f59e0b', rgb: '245,158,11',
    reason: 'Tăng TG, calo rỗng',
    img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
    keyFact: '💡 Ethanol → acetyl-CoA ở gan → ức chế đốt acid béo → acid béo tích lũy thành TG. Uống 2–3 đơn vị rượu/ngày liên tục có thể tăng TG 50–100%. Người có TG > 150 mg/dL cần tránh hoàn toàn rượu bia — đây là khuyến nghị AHA.',
    detail: 'Quan hệ rượu-lipid không đơn giản: rượu vừa phải tăng HDL nhưng cũng tăng TG và thêm calo rỗng. Net effect phụ thuộc vào lượng uống — với người đã có TG cao, không có lượng rượu "an toàn".',
    details: [
      'Cơ chế tăng TG: (1) Ethanol → acetaldehyde → acetyl-CoA; (2) NADH tăng → ức chế beta-oxidation (đốt acid béo) → acid béo tích lũy; (3) Gan chuyển acid béo thừa thành TG đóng gói vào VLDL; (4) 7kcal/g ethanol — calo rỗng không dinh dưỡng.',
      'TG nhạy nhất với rượu: chỉ 2–3 ngày uống nhiều → TG tăng đáng kể. Người TG > 150 mg/dL cần tránh hoàn toàn. Người TG bình thường giới hạn ≤ 1 đv/ngày (nữ), ≤ 2 đv/ngày (nam).',
      'Nghịch lý HDL: ethanol tăng ApoA-1 và LCAT → HDL tăng 4–10 mg/dL. Tuy nhiên thuốc tăng HDL trong thử nghiệm thất bại → HDL từ rượu có thể không bảo vệ tim mạch như HDL từ vận động.',
      'Bia và béo bụng: bia cung cấp maltose + ethanol — cả hai kích thích tổng hợp TG tại gan. "Bụng bia" (central adiposity) làm tăng kháng insulin và rối loạn lipid — vòng lặp nguy hiểm.',
      'WHO và IARC: không có lượng rượu "an toàn" về ung thư và sức khỏe tổng thể. AHA: nếu uống, giới hạn ≤ 1 đv/ngày (nữ) và ≤ 2 đv/ngày (nam); 1 đv = 150ml rượu vang = 350ml bia = 45ml rượu mạnh.',
      'Khi TG > 500: cần bỏ rượu hoàn toàn ngay lập tức — đây là một trong các biện pháp cấp thiết nhất cùng với nhịn ăn tạm thời và điều trị bằng fibrate để ngăn viêm tụy cấp.',
    ],
    points: [
      { icon: '📈', label: 'TG nhạy nhất với rượu', note: '2–3 ngày uống nhiều → TG tăng rõ' },
      { icon: '🚫', label: 'TG > 150: tránh hoàn toàn', note: 'Không có lượng rượu an toàn với TG cao' },
      { icon: '🍷', label: 'HDL tăng nhưng không bảo vệ', note: 'HDL từ rượu ≠ HDL từ vận động' },
      { icon: '⚖️', label: '1 đv/ngày: giới hạn tối đa', note: 'Nếu uống — dừng ngay nếu TG đang cao' },
    ],
  },
];

function LipidModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
            <span className="ml-auto font-mono font-bold text-sm px-3 py-1 rounded-full shrink-0"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>{item.range}</span>
          </div>
          <div className="rounded-2xl px-4 py-3 mb-5 mt-4 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.85)' }}>
            {item.keyFact}
          </div>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(209,213,219,0.9)' }}>{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
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
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
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
      const el = document.getElementById(`reveal-lip-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-lip-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthLipidsPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [lipidModal, setLipidModal] = useState(null);
  const [foodHelpModal, setFoodHelpModal] = useState(null);
  const [foodAvoidModal, setFoodAvoidModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eLipidsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eLipidsOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🩸</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Mỡ Máu</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Bảng lipid máu · Tim mạch
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Rối loạn mỡ máu (dyslipidemia) là yếu tố nguy cơ hàng đầu của bệnh tim mạch và đột quỵ. Hầu hết trường hợp không có triệu chứng — chỉ phát hiện qua xét nghiệm máu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80&auto=format&fit=crop" alt="Mỡ máu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Hiểu bảng lipid máu của bạn
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age >= 35 ? 'Nên xét nghiệm bảng lipid máu đầy đủ hàng năm.' : 'Xét nghiệm mỗi 5 năm nếu không có yếu tố nguy cơ.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Bảng Lipid Máu</h2>
        <p className="text-muted text-lg mb-6">Nhấn vào từng chỉ số để xem chi tiết. Xét nghiệm sau nhịn ăn 9–12 tiếng để có kết quả chính xác nhất.</p>
        <div className="space-y-3">
          {LIPID_PANEL.map((panel, i) => (
            <div key={i}
              onClick={() => setLipidModal(i)}
              className="rounded-2xl border p-4 flex items-center gap-4 cursor-pointer transition-colors"
              style={{ background: `rgba(${panel.rgb},0.04)`, borderColor: `rgba(${panel.rgb},0.22)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${panel.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${panel.rgb},0.22)`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `rgba(${panel.rgb},0.12)`, border: `1px solid rgba(${panel.rgb},0.25)` }}>
                {panel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-text leading-tight">{panel.label}</p>
                <p className="text-sm text-muted mt-0.5 line-clamp-1">{panel.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-sm px-2 py-1 rounded-lg" style={{ color: panel.color, background: `rgba(${panel.rgb},0.1)` }}>{panel.range}</span>
              </div>
              <span className="text-muted text-sm shrink-0">→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thực Phẩm Tốt Cho Mỡ Máu</h2>
        <p className="text-muted text-lg mb-5">Chế độ ăn đúng có thể giảm LDL 15–20% trong 6–12 tuần.</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {FOOD_HELP.map((f, i) => (
            <div key={i}
              onClick={() => setFoodHelpModal(i)}
              className="rounded-2xl border border-border bg-surface p-4 flex gap-3 cursor-pointer transition-colors"
              style={{ borderColor: `rgba(${f.rgb},0.22)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${f.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${f.rgb},0.22)`}>
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: f.color }}>{f.label}</div>
                <div className="text-base text-muted">{f.effect}</div>
              </div>
              <span className="text-muted text-sm shrink-0 self-center">→</span>
            </div>
          ))}
        </div>
        <h3 className="font-bold text-text mb-3">Nên Hạn Chế</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {FOOD_AVOID.map((f, i) => (
            <div key={i}
              onClick={() => setFoodAvoidModal(i)}
              className="rounded-2xl border border-border bg-surface p-4 flex gap-3 cursor-pointer transition-colors"
              style={{ borderColor: `rgba(${f.rgb},0.22)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${f.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${f.rgb},0.22)`}>
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-0.5" style={{ color: f.color }}>{f.label}</div>
                <div className="text-base text-muted">{f.reason}</div>
              </div>
              <span className="text-muted text-sm shrink-0 self-center">→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text">Tần Suất Xét Nghiệm</h3>
          <div className="text-lg text-muted space-y-2">
            <p>• <strong className="text-text">Người bình thường &lt; 35 tuổi:</strong> Mỗi 5 năm nếu không có yếu tố nguy cơ</p>
            <p>• <strong className="text-text">35–65 tuổi:</strong> Mỗi 1–2 năm</p>
            <p>• <strong className="text-text">Có nguy cơ tim mạch, tiểu đường, hút thuốc:</strong> Hàng năm</p>
            <p>• <strong className="text-text">Đang điều trị mỡ máu:</strong> Mỗi 3–6 tháng để đánh giá đáp ứng thuốc</p>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {lipidModal !== null && (
        <LipidModal
          item={LIPID_PANEL[lipidModal]}
          idx={lipidModal}
          total={LIPID_PANEL.length}
          onClose={() => setLipidModal(null)}
          onPrev={() => setLipidModal(i => Math.max(0, i - 1))}
          onNext={() => setLipidModal(i => Math.min(LIPID_PANEL.length - 1, i + 1))}
          hasPrev={lipidModal > 0}
          hasNext={lipidModal < LIPID_PANEL.length - 1}
        />
      )}
      {foodHelpModal !== null && (
        <LipidModal
          item={FOOD_HELP[foodHelpModal]}
          idx={foodHelpModal}
          total={FOOD_HELP.length}
          onClose={() => setFoodHelpModal(null)}
          onPrev={() => setFoodHelpModal(i => Math.max(0, i - 1))}
          onNext={() => setFoodHelpModal(i => Math.min(FOOD_HELP.length - 1, i + 1))}
          hasPrev={foodHelpModal > 0}
          hasNext={foodHelpModal < FOOD_HELP.length - 1}
        />
      )}
      {foodAvoidModal !== null && (
        <LipidModal
          item={FOOD_AVOID[foodAvoidModal]}
          idx={foodAvoidModal}
          total={FOOD_AVOID.length}
          onClose={() => setFoodAvoidModal(null)}
          onPrev={() => setFoodAvoidModal(i => Math.max(0, i - 1))}
          onNext={() => setFoodAvoidModal(i => Math.min(FOOD_AVOID.length - 1, i + 1))}
          hasPrev={foodAvoidModal > 0}
          hasNext={foodAvoidModal < FOOD_AVOID.length - 1}
        />
      )}
    </div>
  );
}
