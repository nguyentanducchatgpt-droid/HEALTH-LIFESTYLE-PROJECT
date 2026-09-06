import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'f-mp-orbit-kf';
const ORBIT_CLASS = 'f-mp-orbit-ring';
const LS_KEY = 'healthapp_f_meal';

const EATING_RULES = [
  {
    num: '01', icon: '🥩', color: '#f97316', rgb: '249,115,22',
    rule: 'Ăn đủ đạm mỗi bữa — đây là ưu tiên số 1',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient có thermic effect cao nhất (20–30% calo tiêu hóa), satiety index cao nhất, và là nền tảng duy nhất để xây và giữ khối cơ. Không có quy tắc dinh dưỡng nào mang lại ROI cao hơn: 1 thay đổi đơn giản → ảnh hưởng đến tất cả mục tiêu sức khỏe.',
    details: [
      'Protein kích hoạt peptide no (PYY, GLP-1) mạnh hơn carb và fat — bữa ăn đủ đạm giữ no 30–40% lâu hơn, tự nhiên giảm total calorie intake mà không cần đếm calo hay nhịn ăn.',
      'Thermic effect of food: cơ thể đốt 20–30 kcal để tiêu hóa 100 kcal từ protein, so với 5–10 kcal từ carb và 0–3 kcal từ fat. Ăn protein nhiều hơn literally tăng trao đổi chất.',
      'Sau 30 tuổi, cơ thể mất ~1% khối cơ mỗi năm (sarcopenia) nếu không có stimulation từ tập luyện và protein đủ. Ưu tiên protein từ bây giờ là đầu tư cho khả năng vận động và sức khỏe metabolic 20–30 năm sau.',
      'Nguồn đạm nhanh nhất: trứng (6g/quả, 5 phút nấu), đậu phụ cứng (8g/100g, ăn sống được), sữa chua Hy Lạp (10g/100g, không cần nấu), cá mòi hộp (20g/hộp, mở ra ăn ngay).',
      'Dấu hiệu thiếu đạm: mệt mỏi dù ngủ đủ, tóc rụng nhiều, vết thương lành chậm, thèm đồ ngọt sau bữa ăn, giảm cân nhưng không giảm mỡ (giảm cơ). Phổ biến hơn nhiều người nghĩ — đặc biệt ở người ăn kiêng.',
      'Ưu tiên số 1 không có nghĩa là bỏ qua mọi thứ khác — nghĩa là khi chỉ có thể thay đổi 1 thứ, thay đổi protein. Khi đã đủ protein, mọi quy tắc khác sẽ dễ follow hơn tự nhiên.',
    ],
    points: [
      { icon: '🔥', label: 'Thermic Effect 20–30%', note: 'Tự đốt calo khi tiêu hóa — trao đổi chất tăng' },
      { icon: '⏱️', label: 'No Lâu Hơn 30–40%', note: 'PYY và GLP-1 kích hoạt mạnh — giảm calo tự nhiên' },
      { icon: '💪', label: 'Chống Sarcopenia', note: 'Mất 1%/năm sau 30 tuổi — protein là bảo hiểm dài hạn' },
      { icon: '🥚', label: 'Nguồn Nhanh 5 Phút', note: 'Trứng/đậu phụ/sữa chua — không cần nấu phức tạp' },
    ],
  },
  {
    num: '02', icon: '🥦', color: '#22c55e', rgb: '34,197,94',
    rule: 'Ăn rau trước → no nhanh hơn, ít calo hơn',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thứ tự ăn ảnh hưởng trực tiếp đến đường huyết và lượng thức ăn tiêu thụ. Nghiên cứu của Cornell University: ăn rau trước giảm tổng lượng thức ăn 20% và giảm đường huyết sau ăn 37% so với ăn tinh bột trước. Thứ tự: rau → đạm → tinh bột.',
    details: [
      'Cơ chế đường huyết: fiber trong rau tạo lớp gel trong dạ dày làm chậm hấp thu glucose từ tinh bột ăn sau. Kết quả: đường huyết tăng từ từ, đỉnh thấp hơn, không có spike → không có crash → không có cơn thèm ăn cấp tính sau đó.',
      'Cơ chế no: dạ dày có thể tích hữu hạn. Rau có mật độ calo rất thấp (15–35 kcal/100g) nhưng thể tích lớn — chiếm không gian trong dạ dày, kích hoạt stretch receptors báo hiệu no sớm hơn.',
      'Thứ tự lý tưởng: canh/soup (hydration + khởi động dạ dày) → rau (fiber + no) → đạm (protein + tiếp tục no) → tinh bột cuối cùng (calo dày đặc nhưng bạn đã no 70–80% rồi). Đây là cách ăn truyền thống Nhật Bản.',
      'Áp dụng thực tế với bữa ăn Việt: ăn canh rau trước, sau đó rau xào hoặc rau luộc, rồi mới gắp thịt/cá, cuối cùng mới ăn cơm. Không cần thay đổi món — chỉ thay đổi thứ tự gắp.',
      'Thứ tự ăn quan trọng hơn thành phần bữa ăn trong ngắn hạn: cùng bữa cơm thịt rau, ăn rau trước vs ăn cơm trước có thể chênh lệch đến 200–300 kcal tiêu thụ và đường huyết peak khác nhau 30–40%.',
      'Thói quen đơn giản nhất để bắt đầu: ngay bây giờ, với bữa tiếp theo, gắp rau đầu tiên. Không cần thay đổi gì khác. Làm 21 ngày liên tiếp để tự động hóa.',
    ],
    points: [
      { icon: '📉', label: 'Đường Huyết Giảm 37%', note: 'Cornell: rau trước → glucose spike thấp hơn đáng kể' },
      { icon: '🫙', label: 'Chiếm Không Gian Dạ Dày', note: 'Ít calo nhưng thể tích lớn — no sớm hơn tự nhiên' },
      { icon: '🍱', label: 'Thứ Tự: Canh→Rau→Đạm→Tinh Bột', note: 'Truyền thống Nhật — được khoa học xác nhận' },
      { icon: '🔄', label: '21 Ngày Tự Động Hóa', note: 'Chỉ thay đổi thứ tự gắp — dễ nhất trong 5 quy tắc' },
    ],
  },
  {
    num: '03', icon: '⏰', color: '#f59e0b', rgb: '245,158,11',
    rule: 'Không bỏ bữa — đói sẽ ăn bù nhiều hơn',
    img: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bỏ bữa không giảm tổng calo tiêu thụ trong ngày — nghiên cứu University of Illinois: bỏ bữa sáng dẫn đến ăn nhiều hơn 400–600 kcal trong các bữa còn lại, net result = tương đương hoặc nhiều hơn so với không bỏ bữa. Cơ thể tự compensate bằng cơn đói cấp tính.',
    details: [
      'Ghrelin (hormone đói) tăng dần theo giờ không ăn — sau 5–6 giờ đói đỉnh điểm, quyết định ăn gì và ăn bao nhiêu bị ghrelin kiểm soát, không phải lý trí. "Đói cấp độ 8–9 không ai ăn salad" là sự thật sinh học.',
      'Bỏ bữa → đói cấp tính → ăn nhanh hơn → não nhận tín hiệu no sau 20 phút → đã ăn quá nhiều rồi. Tốc độ ăn khi đói tăng 40–60% so với khi không quá đói, kéo theo lượng thức ăn nạp trước khi não "ngắt".',
      'Bỏ bữa kéo dài cortisol cao: không ăn trong >4 giờ khiến cortisol tăng để duy trì đường huyết qua gluconeogenesis. Cortisol cao → insulin resistance → cơ thể ưu tiên tích trữ mỡ bụng.',
      'Intermittent fasting (IF) khác với bỏ bữa ngẫu nhiên: IF có kế hoạch rõ ràng, cơ thể thích ứng qua nhiều tuần. Bỏ bữa ngẫu nhiên vì bận/quên là cortisol spike không có benefit của IF có cấu trúc.',
      'Bữa ăn đơn giản vẫn tốt hơn bỏ: 1 quả chuối + 1 hộp sữa chua = 5 phút, 200–250 kcal, đủ protein và fiber để ngăn ghrelin spike. Không cần bữa ăn hoàn hảo — chỉ cần không bỏ hoàn toàn.',
      'Meal prep giải quyết vấn đề "không có thời gian": chuẩn bị 3 bữa cho ngày hôm sau trong 20 phút tối hôm trước. Người bận nhất cũng có 20 phút tối — đây là ROI tốt nhất trong thời gian nấu ăn.',
    ],
    points: [
      { icon: '⚡', label: 'Bù 400–600 kcal Tự Động', note: 'Illinois: bỏ bữa sáng → ăn nhiều hơn trong ngày' },
      { icon: '🧠', label: 'Ghrelin Kiểm Soát Quyết Định', note: 'Đói 8–9/10 không ai chọn salad — sinh học thắng lý trí' },
      { icon: '📈', label: 'Cortisol Tăng Sau 4h Nhịn', note: 'Insulin resistance → tích mỡ bụng — ngược mục tiêu' },
      { icon: '🍌', label: 'Bữa Đơn Giản Vẫn Tốt', note: 'Chuối + sữa chua = 5 phút, đủ ngăn ghrelin spike' },
    ],
  },
  {
    num: '04', icon: '🚫', color: '#ef4444', rgb: '239,68,68',
    rule: 'Hạn chế thực phẩm siêu chế biến, không cần loại bỏ hoàn toàn',
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ultra-processed food (UPF) chiếm >50% lượng calo trung bình của người Việt thành thị. Nghiên cứu Cell Metabolism 2019: diet UPF khiến người ăn thêm 500 kcal/ngày tự động so với whole food — không phải thiếu willpower, mà thiếu satiety signal do UPF bypass cơ chế no tự nhiên.',
    details: [
      'NOVA classification: Group 4 (UPF) = thực phẩm có ≥5 ingredients, chứa emulsifier/stabilizer/flavor enhancer/colorant. Ví dụ phổ biến: mì ăn liền, bánh ngọt đóng gói, xúc xích, nước ngọt, snack mặn, sữa chua có đường nhiều.',
      'Tại sao UPF khó dừng: được thiết kế để kích thích dopamine tối đa qua "bliss point" (tỷ lệ đường/muối/fat tối ưu), texture được tối ưu để "vanish" trong miệng (giảm chewing time → giảm satiety signal), và mùi nhân tạo kích thích ăn thêm.',
      '"Hạn chế không loại bỏ" là chiến lược bền vững hơn: cấm hoàn toàn dẫn đến rebound (ăn nhiều hơn sau khi "phá lệ"). 80/20 rule — 80% whole food, 20% UPF — giảm harm trong khi vẫn sống bình thường.',
      'Thay thế dần thay vì cắt đột ngột: thay nước ngọt bằng nước lọc + lát chanh; mì gói → cháo + trứng; snack mặn → hạt điều/chuối. Mỗi lần thay thế 1 item là tiến bộ thực sự.',
      'Đọc nhãn 3 tiêu chí: (1) >5 ingredients? (2) Có tên chất hóa học không nhận ra? (3) Added sugar trong top 3 ingredients? Nếu 2/3 = UPF. Không cần học thuộc — chỉ cần kiểm tra 3 điều này.',
      'UPF và đường ruột: emulsifier trong UPF phá vỡ lớp mucus bảo vệ ruột, gây viêm mãn tính nhẹ và giảm đa dạng vi khuẩn có lợi. Tác động tích lũy theo năm — không thấy ngay nhưng là một trong những nguyên nhân chính của metabolic syndrome.',
    ],
    points: [
      { icon: '🧪', label: '+500 kcal/Ngày Tự Động', note: 'UPF bypass cơ chế no — không phải thiếu willpower' },
      { icon: '🎯', label: '80/20 Rule', note: '80% whole food + 20% UPF — bền vững hơn cấm hoàn toàn' },
      { icon: '📋', label: '3 Tiêu Chí Đọc Nhãn', note: '>5 ingredients, chất hóa học, sugar top 3 = UPF' },
      { icon: '🔄', label: 'Thay Thế Dần', note: 'Mỗi item thay được là tiến bộ — không cần hoàn hảo ngay' },
    ],
  },
  {
    num: '05', icon: '💧', color: '#3b82f6', rgb: '59,130,246',
    rule: 'Uống nước thay vì nước ngọt, cà phê sữa nhiều đường',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Liquid calories là loại calo dễ bị undercount nhất — không kích hoạt satiety signal như solid food. 1 lon Coca-Cola = 140 kcal, 1 ly cà phê sữa đá = 200–350 kcal, 1 ly trà sữa = 300–600 kcal. Người thay thế liquid calories bằng nước giảm trung bình 200–300 kcal/ngày mà không cảm thấy đói hơn.',
    details: [
      'Liquid calories không gây no: dạ dày xử lý liquid nhanh hơn solid, ít kích hoạt stretch receptors, và ít kích hoạt gut peptide no (CCK, PYY). Uống 350 kcal từ nước ngọt ≠ ăn 350 kcal từ cơm về cảm giác no.',
      'Nước ngọt và insulin: fructose từ HFCS (high-fructose corn syrup) trong nước ngọt được xử lý trực tiếp bởi gan, không qua insulin như glucose. Kết quả: không gây no, không giảm ghrelin, chuyển hóa thành triglyceride và mỡ gan.',
      'Cà phê sữa đá Việt Nam: một ly trung bình chứa 3–4 muỗng cà phê đường cộng sữa đặc — 200–350 kcal, 40–60g đường. 2 ly/ngày = 400–700 kcal chỉ từ đồ uống. Thay bằng cà phê đen hoặc cà phê sữa ít đường = tiết kiệm 300–600 kcal.',
      'Trà sữa: 300–600 kcal/ly tùy size và topping. Nếu uống 3 lần/tuần = 900–1,800 kcal "ẩn" mỗi tuần — tương đương 1–2 ngày ăn uống. Không cần bỏ hoàn toàn, nhưng cần biết để tính vào.',
      'Alternatives không nhàm: sparkling water (nước có gas) + lát chanh/bạc hà; trà xanh/đen không đường; nước dừa tươi (ít đường hơn nước dừa đóng hộp); café đen espresso (0 calo). Variety làm dễ duy trì hơn.',
      'Thay thế từng bước: tuần 1 thay 1 ly nước ngọt/ngày bằng nước lọc; tuần 2 giảm lượng đường trong cà phê 50%; tuần 3 thay 1 ly trà sữa/tuần bằng trà không đường. Progress không phải perfection.',
    ],
    points: [
      { icon: '🧮', label: '200–300 kcal/Ngày Giảm', note: 'Thay nước ngọt → không đói hơn, ít calo hơn đáng kể' },
      { icon: '🚫', label: 'Liquid Calories Không Gây No', note: 'Dạ dày không "đọc" liquid như solid — dễ overconsume' },
      { icon: '🍋', label: 'Alternatives Ngon Hơn', note: 'Sparkling water + chanh, trà xanh, nước dừa tươi' },
      { icon: '📅', label: 'Giảm Từng Tuần', note: 'Thay 1 item/tuần — bền vững hơn cắt đột ngột' },
    ],
  },
];

const PLATE_SECTIONS = [
  { pct: 50, label: '½ Rau & Trái Cây', color: '#22c55e', desc: 'Rau lá xanh, cà chua, cà rốt, bông cải, dưa leo, chuối, cam' },
  { pct: 25, label: '¼ Đạm', color: '#f59e0b', desc: 'Thịt gà, cá, trứng, đậu phụ, tôm, thịt heo nạc' },
  { pct: 25, label: '¼ Tinh Bột', color: '#84cc16', desc: 'Cơm gạo lứt, khoai lang, bánh mì nguyên cám, ngô' },
];

const MEAL_IDEAS = [
  {
    meal: 'Sáng', icon: '🌅', color: '#f59e0b', rgb: '245,158,11',
    options: ['Cơm + trứng + rau luộc', 'Bánh mì nguyên cám + trứng ốp la', 'Yến mạch + sữa chua + trái cây', 'Phở gà ít mỡ + rau thơm'],
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa sáng quyết định hơn 30% chất lượng năng lượng cả ngày. Nghiên cứu của Harvard T.H. Chan cho thấy người ăn sáng đều có cortisol thấp hơn vào buổi chiều, kiểm soát cơn thèm đường tốt hơn, và năng suất nhận thức buổi sáng tăng 15–20%.',
    details: [
      'Protein bữa sáng là yếu tố quan trọng nhất: 20–30g protein (trứng, thịt gà, cá, đậu phụ) trong vòng 2 giờ sau khi thức dậy giúp ổn định đường huyết đến bữa trưa, giảm cảm giác thèm ăn buổi chiều.',
      'Cơm + trứng + rau luộc là bữa sáng truyền thống Việt hoàn hảo về dinh dưỡng: tinh bột phức + protein chất lượng cao + fiber. Tỷ lệ macro gần lý tưởng mà không cần tính toán phức tạp.',
      'Yến mạch (oats) là lựa chọn tốt cho người bận: beta-glucan trong yến mạch là soluble fiber làm chậm tiêu hóa, ổn định đường huyết 3–4 giờ. Thêm protein (sữa chua, protein powder) để tăng satiety.',
      'Tránh bữa sáng thuần carb (bánh ngọt, xôi ngọt, phở chỉ nước): đường huyết tăng nhanh → insulin spike → đường huyết giảm → buồn ngủ, mệt mỏi lúc 10h sáng — vòng lặp làm giảm năng suất.',
      'Không bỏ bữa sáng vì "không đói": cortisol buổi sáng tự nhiên cao — cơ thể cần fuel để convert cortisol thành năng lượng. Bỏ bữa làm cortisol tích lũy, gây căng thẳng và cravings mạnh hơn sau.',
      'Thời điểm lý tưởng: 30–60 phút sau khi thức dậy, trước khi caffeine (café làm mờ tín hiệu đói). Nếu không có thời gian, 1 quả trứng + 1 ly sữa tươi = 5 phút, đủ để không bỏ bữa hoàn toàn.',
    ],
    points: [
      { icon: '🥚', label: '20–30g Protein', note: 'Ổn định đường huyết 4h — giảm thèm ăn buổi chiều' },
      { icon: '⏰', label: '30–60 Phút Sau Thức Dậy', note: 'Trước caffeine để tín hiệu đói rõ ràng hơn' },
      { icon: '🚫', label: 'Tránh Thuần Carb', note: 'Bánh ngọt/xôi → insulin spike → buồn ngủ lúc 10h' },
      { icon: '🧠', label: 'Năng Suất +15–20%', note: 'Harvard: ăn sáng đủ đạm cải thiện nhận thức buổi sáng' },
    ],
  },
  {
    meal: 'Trưa', icon: '☀️', color: '#22c55e', rgb: '34,197,94',
    options: ['Cơm gạo lứt + cá hấp + canh rau', 'Bún gà + rau sống', 'Cơm + thịt heo luộc + dưa cải', 'Salad + đậu phụ + bánh mì'],
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa trưa là bữa quan trọng nhất để nạp năng lượng cho hiệu suất buổi chiều. Nên chiếm 35–40% tổng lượng calo ngày. Một bữa trưa đủ đạm + rau + tinh bột vừa phải giúp duy trì tập trung đến 17–18h mà không cần coffee bổ sung.',
    details: [
      'Cơm gạo lứt + cá hấp + canh rau là bữa trưa Việt lý tưởng: GI thấp hơn gạo trắng 35% (ổn định đường huyết), omega-3 từ cá hỗ trợ não bộ, canh rau cung cấp fiber và vi khoáng. Đủ macro cho 4–5 giờ tiếp theo.',
      'Post-lunch dip (buồn ngủ sau ăn trưa): xảy ra tự nhiên do circadian rhythm, không chỉ do ăn nhiều. Giảm thiểu bằng cách kiểm soát phần tinh bột (không quá ¼ đĩa), không uống rượu bia, đi bộ nhẹ 10 phút sau ăn.',
      'Ăn trưa chậm 15–20 phút: nhịp ăn chậm cho não 20 phút để nhận tín hiệu no từ leptin. Đặt đũa xuống giữa các miếng, nhai 20–30 lần, không dùng điện thoại khi ăn — những thay đổi nhỏ này giảm lượng ăn 15–20%.',
      'Salad + đạm là lựa chọn tốt cho người bận hoặc muốn giảm cân: thêm nguồn đạm (trứng luộc, đậu phụ, tôm) vào salad để đủ satiety. Chỉ rau không đủ — sẽ đói lại sau 1–2 giờ và dễ ăn vặt.',
      'Cân nhắc meal prep: nấu cơm + protein + rau cho 2 ngày vào tối hôm trước. Tiết kiệm 15–20 phút/ngày và tránh tình trạng bữa trưa random do thiếu chuẩn bị — thường dẫn đến lựa chọn kém hơn.',
      'Nếu không ăn được bữa trưa đúng giờ: protein snack (30–40g) lúc 11h để tránh hypoglycemia, sau đó ăn trưa muộn nhẹ hơn. Tốt hơn nhiều so với bỏ hoàn toàn rồi ăn bù vào buổi tối.',
    ],
    points: [
      { icon: '🍚', label: '35–40% Calo Ngày', note: 'Bữa trưa quan trọng nhất — không nên ăn nhẹ' },
      { icon: '🚶', label: 'Đi Bộ 10 Phút Sau', note: 'Giảm post-lunch dip, ổn định đường huyết sau ăn' },
      { icon: '⏱️', label: 'Ăn Chậm 20 Phút', note: 'Cho leptin thời gian gửi tín hiệu no — giảm 15–20% lượng ăn' },
      { icon: '🥗', label: 'Đạm + Rau + Ít Tinh Bột', note: 'Duy trì tập trung đến 17h mà không cần thêm coffee' },
    ],
  },
  {
    meal: 'Tối', icon: '🌙', color: '#6366f1', rgb: '99,102,241',
    options: ['Cơm + canh chua cá + rau muống', 'Súp gà + bánh mì ít', 'Đậu phụ sốt cà chua + cơm', 'Thịt bò xào rau củ + ít cơm'],
    img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa tối nên nhẹ hơn bữa trưa 20–30% về calo — không phải vì sẽ "tích mỡ" mà vì hoạt động buổi tối ít hơn và cơ thể cần điều kiện để bước vào giấc ngủ. Ăn tối quá no → cortisol tăng → khó ngủ → thiếu ngủ → tăng cân ngày hôm sau là chuỗi nhân quả thực tế.',
    details: [
      'Timing bữa tối: lý tưởng là 3 giờ trước khi ngủ. Nếu ngủ lúc 22h, ăn tối lúc 19h. Dạ dày rỗng khi ngủ cải thiện chất lượng giấc ngủ rõ rệt — không gián đoạn do tiêu hóa và không bị acid reflux.',
      'Protein tối quan trọng cho recovery: casein protein (từ sữa, phô mai, thịt chậm tiêu) cung cấp amino acid suốt đêm cho muscle protein synthesis. Bữa tối có cá, thịt gà, hoặc đậu phụ giúp phục hồi cơ sau tập hiệu quả hơn.',
      'Giảm tinh bột bữa tối không cần quá nghiêm ngặt: nếu bữa sáng và trưa đã có đủ tinh bột phức, bữa tối có thể ít tinh bột hơn (½ phần thay ¼ đĩa). Nhưng không cần loại bỏ hoàn toàn — gây lo lắng và khó duy trì.',
      'Canh chua cá là bữa tối Việt tuyệt vời: cá (protein), cà chua/thơm (vitamin C, lycopene), rau (fiber), nước canh (hydration). Ít calo nhưng no và đủ dinh dưỡng. Acid trong canh chua giúp tiêu hóa tốt hơn.',
      'Không ăn khuya (sau 21h): insulin sensitivity giảm đáng kể vào ban đêm — cùng lượng carb ăn lúc 21h sẽ gây phản ứng đường huyết mạnh hơn 40% so với ăn lúc 12h. Không phải mê tín — đây là chronobiology.',
      'Nếu đói khuya: protein snack nhỏ (sữa chua 100g, phô mai 1 miếng, hoặc 1 quả trứng) tốt hơn nhiều so với carb khuya (bánh, cơm, mì). Protein không gây insulin spike mạnh và giúp no đến sáng.',
    ],
    points: [
      { icon: '⏰', label: '3 Giờ Trước Khi Ngủ', note: 'Dạ dày rỗng → ngủ ngon hơn, ít gián đoạn' },
      { icon: '🐟', label: 'Casein Protein', note: 'Cá/thịt buổi tối → amino acid suốt đêm cho phục hồi cơ' },
      { icon: '🌙', label: 'Nhẹ Hơn Bữa Trưa', note: 'Ít tinh bột hơn OK, nhưng không cần loại bỏ hoàn toàn' },
      { icon: '🚫', label: 'Không Ăn Sau 21h', note: 'Insulin sensitivity giảm 40% — không phải mê tín' },
    ],
  },
  {
    meal: 'Snack', icon: '🍌', color: '#14b8a6', rgb: '20,184,166',
    options: ['Hạt điều/óc chó 30g', 'Trái cây tươi 1 phần', 'Sữa chua không đường', 'Trứng luộc 1–2 quả'],
    img: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Snack thông minh = ngăn cơn đói cấp độ 8–9/10 (dẫn đến ăn quá nhiều trong bữa chính tiếp theo). Mục tiêu không phải "ăn ít" mà là "không bao giờ quá đói". 150–200 kcal từ protein + fiber giữa các bữa chính là chiến lược ăn uống hiệu quả hơn cố gắng nhịn.',
    details: [
      'Thời điểm tốt nhất cho snack: khi đói nhẹ 3/10, không phải khi buồn (emotional eating) hoặc vì thói quen. Hỏi bản thân "Mình có đói không?" trước khi ăn — nếu câu trả lời là "không chắc", uống nước trước và đợi 10 phút.',
      'Hạt điều/óc chó 30g là snack lý tưởng: healthy fat + protein + fiber trong một gói nhỏ. Nghiên cứu cho thấy người ăn nuts đều đặn có BMI thấp hơn, không phải cao hơn — nhờ satiety index cao và không dẫn đến overeating.',
      'Sữa chua không đường (Greek yogurt): 15g protein/100g, probiotic tốt cho đường ruột, calcium. Tránh sữa chua có đường (thường 15–20g added sugar) — chọn sữa chua trắng nguyên chất và thêm trái cây tươi nếu muốn ngọt.',
      'Trái cây không béo hóa: đường trong trái cây (fructose) đi kèm với fiber, vitamin, và nước — khác hoàn toàn với added sugar. Cần ăn rất nhiều (>500g trái cây/ngày) mới có tác động tiêu cực đến cân nặng với người bình thường.',
      'Snack không phải là bữa chính nhỏ hơn: cần đơn giản, ít chuẩn bị, portable. Nếu snack mất 20 phút chuẩn bị, bạn sẽ bỏ qua và ăn đồ random có sẵn thay thế. Chuẩn bị snack sẵn từ đêm hôm trước.',
      'Tránh snack "giả lành mạnh": granola bar (thường 20–30g đường), smoothie đóng chai (nhiều fructose), cracker nguyên cám (ít fiber thực). Đọc nhãn: >10g added sugar là red flag, protein <5g là không đủ để làm snack đúng nghĩa.',
    ],
    points: [
      { icon: '🎯', label: 'Ngăn Đói Cấp Độ 8–9', note: 'Snack đúng lúc → không ăn quá nhiều bữa chính sau' },
      { icon: '🥜', label: 'Hạt: Fat + Protein', note: 'Satiety index cao — người ăn hạt đều có BMI thấp hơn' },
      { icon: '🧪', label: 'Đọc Nhãn', note: '>10g added sugar = không phải snack lành mạnh' },
      { icon: '🍓', label: 'Trái Cây Không Béo Hóa', note: 'Fructose + fiber + nước = khác hoàn toàn added sugar' },
    ],
  },
];

const NUTRITION_FIELDS = [
  {
    key: 'protein', label: 'Đạm đủ không?', icon: '🥩', placeholder: 'vd: 3 bữa có đạm',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient duy nhất cơ thể không thể tích trữ — cần nạp đều qua từng bữa. Nghiên cứu Stuart Phillips (McMaster University) xác nhận: 3 bữa mỗi ngày có ≥20g protein tốt hơn dồn tất cả vào 1–2 bữa cho tổng hợp cơ và kiểm soát cân nặng.',
    details: [
      'Mục tiêu protein hằng ngày phụ thuộc vào cân nặng và mục tiêu: duy trì sức khỏe = 1.2–1.6g/kg; xây cơ = 1.6–2.0g/kg; giảm mỡ giữ cơ = 2.0–2.4g/kg. Người 60kg không tập = 72–96g/ngày. Người 70kg tập 3–4 buổi/tuần = 112–140g/ngày.',
      'Dấu hiệu thiếu đạm mãn tính: mệt mỏi dai dẳng dù ngủ đủ giấc, tóc và móng yếu dễ gãy, hồi phục sau tập chậm hơn bình thường, hay thèm đồ ngọt sau bữa ăn, vết thương lành chậm.',
      'Nguồn đạm tốt nhất cho người Việt: ức gà (~25g/100g), cá hồi/cá thu (~20g/100g), trứng (~6g/quả), tôm (~20g/100g), thịt heo nạc (~22g/100g), đậu phụ cứng (~8g/100g), sữa chua Hy Lạp (~10g/100g).',
      'Protein bữa sáng quan trọng nhất: 30g protein trước 9h sáng giảm total calorie intake cả ngày trung bình 400 kcal theo nghiên cứu của University of Missouri. Cơ chế: ổn định ghrelin (hormone đói) suốt buổi sáng.',
      'Protein synthesis window: không phải chỉ 30 phút sau tập như nhiều người nghĩ — muscle protein synthesis tăng trong 24–48 giờ sau tập. Quan trọng hơn là có đủ protein trong toàn bộ ngày, không chỉ ngay sau tập.',
      'Cách kiểm tra nhanh: nhìn vào bữa ăn — có nguồn đạm rõ ràng (thịt/cá/trứng/đậu) không? Nếu có ở cả 3 bữa chính = protein likely đủ. Ghi nhật ký "3/3 bữa có đạm" hoặc "2/3" là cách đơn giản nhất.',
    ],
    points: [
      { icon: '🎯', label: '1.6–2.0g / kg Cân Nặng', note: 'Mục tiêu cơ bản — tăng lên 2.4g khi giảm mỡ' },
      { icon: '🍳', label: '3 Bữa Đều Có Đạm', note: 'Phân bổ đều tốt hơn dồn vào 1–2 bữa' },
      { icon: '⚡', label: 'Bữa Sáng 30g', note: 'Giảm total calo cả ngày trung bình 400 kcal' },
      { icon: '🔄', label: 'Window 24–48h', note: 'Không phải chỉ 30 phút sau tập — ăn đủ cả ngày' },
    ],
  },
  {
    key: 'veg', label: 'Rau hôm nay?', icon: '🥗', placeholder: 'vd: 2 phần rau xào + canh',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị ≥400g rau quả/ngày (≥5 phần). Phân tích 95 nghiên cứu với 2 triệu người (2019) cho thấy mỗi phần rau/quả thêm vào giảm 4% nguy cơ tim mạch và 3% nguy cơ ung thư. 2 phần/ngày là ngưỡng khởi đầu thực tế — hơn là tốt hơn.',
    details: [
      '1 phần rau = 1 nắm tay của bạn (~80g): 1 bát rau cải luộc, 1 bắp ngô, 1 nắm rau sống, 3 muỗng canh rau nấu chín, hoặc 1 trái cà chua lớn. Không cần cân — dùng tay ước lượng là đủ.',
      'Ăn đa màu = đa vi chất bảo vệ: đỏ/cam (lycopene, beta-carotene — tim, mắt), xanh lá (chlorophyll, folate — gan, tế bào), tím (anthocyanin — não, nhận thức), trắng/vàng (quercetin, allicin — miễn dịch). Không một màu nào đủ tất cả.',
      'Rau đông lạnh dinh dưỡng ngang tươi: thường được đông lạnh trong vòng 4 giờ sau thu hoạch — giữ vitamin tốt hơn rau "tươi" để trong tủ lạnh 3–4 ngày. Tiện lợi, ít lãng phí, và rẻ hơn.',
      'Fiber từ rau là prebiotics: nuôi vi khuẩn đường ruột có lợi (Bifidobacterium, Lactobacillus), giảm LDL cholesterol, làm chậm hấp thu đường, tăng cảm giác no. Supplement fiber không thay thế được rau thật nguyên dạng.',
      'Mẹo tăng lượng rau dễ nhất: thêm 1 nắm rau vào bất kỳ món nào đang nấu (canh, xào, mì, phở); rau làm snack thay đồ ngọt; xay sinh tố rau + quả buổi sáng — không cần nấu, nhanh, và dễ đạt 2 phần.',
      'Rau nào cũng tốt: không có rau xấu. Cải bắp, cà rốt, bí đao, mướp — rau Việt rẻ và sẵn có đều giàu dinh dưỡng. Đừng chỉ đuổi theo "superfoods" nhập khẩu khi rau địa phương đủ chất và tươi hơn.',
    ],
    points: [
      { icon: '✊', label: '1 Nắm Tay = 1 Phần', note: '~80g — không cần cân, ước lượng bằng tay' },
      { icon: '🌈', label: 'Ăn Đa Màu', note: 'Mỗi màu = phytochemical bảo vệ khác nhau' },
      { icon: '❄️', label: 'Đông Lạnh Vẫn Tốt', note: 'Đông lạnh ngay sau thu hoạch — vitamin giữ tốt hơn tươi để lâu' },
      { icon: '🦠', label: 'Nuôi Đường Ruột', note: 'Fiber = prebiotics — không supplement nào thay được' },
    ],
  },
  {
    key: 'water', label: 'Nước (ml)', icon: '💧', placeholder: 'vd: 2000',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất 1–2% nước cơ thể đã giảm hiệu suất nhận thức 10–15% và sức mạnh thể chất 5–8%. Đa số người mãn tính thiếu nước nhẹ mà không biết — khát nước là tín hiệu muộn, không phải tín hiệu sớm. Công thức đơn giản: cân nặng (kg) × 35ml = lượng nước tối thiểu.',
    details: [
      'Công thức cá nhân hóa: cân nặng × 35ml/ngày. Người 60kg = 2,100ml; người 70kg = 2,450ml; người 80kg = 2,800ml. Tăng thêm 500ml cho mỗi giờ tập luyện cường độ vừa, hoặc nếu ở môi trường nóng/điều hòa nhiều.',
      'Nước trong thực phẩm tính vào: rau củ (85–95% nước), canh súp (~90% nước), trái cây (~80–90% nước). Khoảng 20% lượng nước khuyến nghị đến từ thức ăn — còn lại cần uống chủ động.',
      'Màu nước tiểu là chỉ số hydration tốt nhất: vàng nhạt (lemonade) = đủ nước; vàng đậm (apple juice) = cần uống thêm; trong suốt = uống quá nhiều; cam/nâu = thiếu nước nghiêm trọng, cần uống ngay.',
      'Uống nước trước bữa ăn: 500ml nước 30 phút trước ăn giảm lượng thức ăn tiêu thụ 13% và tăng tốc độ trao đổi chất 24–30% trong 60 phút theo nghiên cứu của Brenda Davy (Virginia Tech). Đơn giản nhưng hiệu quả thực.',
      'Caffeine và alcohol gây mất nước: mỗi ly coffee mất thêm ~150ml nước; mỗi ly rượu bia mất thêm ~200–300ml. Không cần bỏ hoàn toàn — chỉ cần bổ sung thêm nước lọc tương ứng.',
      'Habit uống nước: đặt chai nước 500ml trên bàn làm việc và đặt mục tiêu uống hết trước giờ ăn trưa. Tái nạp 1 chai sau trưa, hết trước tối. Hệ thống chai > nhớ uống từng ngụm ngẫu nhiên.',
    ],
    points: [
      { icon: '📐', label: 'Cân Nặng × 35ml', note: '70kg → 2,450ml — điểm khởi đầu cá nhân hóa' },
      { icon: '🟡', label: 'Kiểm Tra Màu Tiểu', note: 'Vàng nhạt = đủ nước — chỉ số chính xác nhất' },
      { icon: '🥤', label: '500ml Trước Bữa Ăn', note: 'Giảm 13% lượng ăn + tăng 30% trao đổi chất' },
      { icon: '☕', label: 'Bù Nước Sau Caffeine', note: '+150ml/ly coffee — không cần bỏ, chỉ cần bù' },
    ],
  },
  {
    key: 'mood', label: 'Cảm giác sau ăn', icon: '😊', placeholder: 'vd: no vừa, không buồn ngủ',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cảm giác sau ăn là biofeedback tốt nhất về chất lượng bữa ăn. Không ai biết cơ thể bạn tốt hơn bạn — theo dõi 2 tuần sẽ cho thấy pattern rõ ràng: món nào gây buồn ngủ, đầy bụng, hay ngược lại cho năng lượng tốt. Đây là nền tảng của intuitive eating dựa trên dữ liệu.',
    details: [
      'Cảm giác lý tưởng sau bữa ăn: no vừa (70–80%), không buồn ngủ, có năng lượng để tiếp tục làm việc, không đầy bụng hay khó chịu. Nếu bạn thường xuyên đạt 3–4/4 tiêu chí này = bữa ăn đang tốt.',
      'Buồn ngủ sau ăn trưa: xảy ra do tiêu hóa tập trung máu đến dạ dày + circadian dip tự nhiên. Giảm bằng: ít tinh bột hơn (~¼ đĩa thay ½), đi bộ 10 phút sau ăn, không uống rượu bia trưa.',
      'Đầy bụng/khó tiêu: thường do ăn quá nhanh (khí bị nuốt vào), ăn quá no (>80% fullness), hoặc không dung nạp một loại thực phẩm cụ thể. Theo dõi xem điều này xảy ra sau khi ăn món gì.',
      'Thèm ăn sau bữa chính (ngay sau ăn): thường do thiếu protein hoặc fiber — bữa ăn kết thúc bằng spike đường huyết rồi drop nhanh. Thêm đạm và rau vào bữa sau để so sánh kết quả.',
      'Post-meal energy crash (kiệt sức sau ăn): tín hiệu của glycemic load cao quá. Ghi lại: ăn gì → cảm giác thế nào sau 30 và 60 phút. Thay thế 1 phần tinh bột bằng rau hoặc đạm và quan sát sự thay đổi.',
      'Theo dõi mood sau ăn không cần phức tạp: chỉ cần ghi 1 từ hoặc emoji — "ok", "tốt", "đầy", "buồn ngủ". Sau 2 tuần, đọc lại — pattern bạn nhận ra sẽ tốt hơn bất kỳ chế độ ăn nào người khác thiết kế cho bạn.',
    ],
    points: [
      { icon: '🎯', label: 'No 70–80% = Lý Tưởng', note: 'Chưa no hoàn toàn — để 20% cho tiêu hóa thoải mái' },
      { icon: '😴', label: 'Buồn Ngủ = Tín Hiệu', note: 'Tinh bột quá nhiều hoặc ăn quá no — điều chỉnh được' },
      { icon: '📊', label: '2 Tuần Để Thấy Pattern', note: 'Ghi 1 từ/ngày — insight tốt hơn chế độ ăn bên ngoài' },
      { icon: '🔬', label: 'Biofeedback Tốt Nhất', note: 'Cơ thể bạn biết tốt nhất — chỉ cần lắng nghe và ghi lại' },
    ],
  },
];

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

function EatingRulesModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = EATING_RULES[idx];
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
          <img src={item.img} alt={item.rule} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-3xl font-black leading-none" style={{ color: item.color }}>{item.num}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Quy tắc {idx + 1}/{EATING_RULES.length}</p>
          <h2 className="font-bold text-xl md:text-2xl mb-5 leading-snug" style={{ color: item.color }}>{item.rule}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
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
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {EATING_RULES.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function NutritionFieldModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = NUTRITION_FIELDS[idx];
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
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Nhật ký {idx + 1}/{NUTRITION_FIELDS.length}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: item.color }}>{item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
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
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {NUTRITION_FIELDS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MealModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = MEAL_IDEAS[idx];
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
          <img src={item.img} alt={item.meal} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Bữa {idx + 1}/{MEAL_IDEAS.length}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: item.color }}>Bữa {item.meal}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `rgba(${item.rgb},0.6)` }}>Gợi ý bữa ăn</p>
            <div className="grid grid-cols-2 gap-2">
              {item.options.map((opt, oi) => (
                <div key={oi} className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm text-muted"
                  style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.12)` }}>
                  <span className="font-bold shrink-0" style={{ color: item.color }}>{oi + 1}.</span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>
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
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {MEAL_IDEAS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ToolsMealPlanPage() {
  const { t: tT } = useTranslation('tools');
  const today = new Date().toISOString().slice(0, 10);
  const [log, setLog] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || {}; } catch { return {}; }
  });
  const [openMeal, setOpenMeal] = useState(null);
  const [mealModal, setMealModal] = useState(null);
  const [nutritionModal, setNutritionModal] = useState(null);
  const [rulesModal, setRulesModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mp-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMpOrbitSpin { to { --f-mp-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mp-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const updateLog = (key, val) => {
    const next = { ...log, [key]: val };
    setLog(next);
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🍽️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('meal_plan.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('meal_plan.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('meal_plan.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop" alt="Meal plan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('meal_plan.img_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Plate model */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Mô Hình Đĩa Ăn Chuẩn</h2>
        <p className="text-muted text-lg mb-6">Áp dụng cho tất cả các bữa chính — không cần cân đo, chỉ cần nhìn đĩa.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {PLATE_SECTIONS.map((s, i) => (
            <div key={i} className="rounded-2xl border bg-surface p-5 text-center" style={{ borderColor: `${s.color}30` }}>
              <div className="text-5xl font-black mb-2" style={{ color: s.color }}>{s.pct}%</div>
              <div className="font-bold text-text mb-2 text-lg">{s.label}</div>
              <div className="text-base text-muted leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-2xl text-lg text-muted" style={{ background: `rgba(${RGB},0.05)`, borderLeft: `3px solid ${COLOR}` }}>
          <strong style={{ color: COLOR }}>Nguyên tắc vàng:</strong> Luôn ăn rau trước → đạm → tinh bột. Ăn chậm, nhai kỹ, dừng khi no 80%.
        </div>
      </RevealBlock>

      {/* Meal ideas */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Gợi Ý Bữa Ăn Việt</h2>
        <p className="text-muted text-lg mb-6">Click để xem gợi ý cho từng bữa. Ăn đa dạng, không ăn đi ăn lại 1 món.</p>
        <div className="space-y-3">
          {MEAL_IDEAS.map((m, i) => (
            <div key={i} className="rounded-2xl border bg-surface overflow-hidden group"
              style={{ borderColor: mealModal === i ? `rgba(${m.rgb},0.45)` : 'var(--border)' }}>
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setMealModal(i)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 cursor-pointer transition-all"
                  style={{ background: `rgba(${m.rgb},0.12)`, border: `1px solid rgba(${m.rgb},0.25)` }}>
                  {m.icon}
                </button>
                <button onClick={() => setOpenMeal(openMeal === i ? null : i)} className="flex-1 flex items-center gap-3 text-left">
                  <div className="flex-1">
                    <div className="font-bold text-text">Bữa {m.meal}</div>
                    <div className="text-base text-muted">4 gợi ý · nhấn để xem</div>
                  </div>
                  <span className="text-muted mr-1">{openMeal === i ? '▲' : '▼'}</span>
                </button>
                <button onClick={() => setMealModal(i)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ color: m.color, background: `rgba(${m.rgb},0.1)`, border: `1px solid rgba(${m.rgb},0.25)` }}>
                  Chi tiết →
                </button>
              </div>
              {openMeal === i && (
                <div className="px-4 pb-4 border-t border-border">
                  <ul className="mt-3 space-y-2">
                    {m.options.map((opt, j) => (
                      <li key={j} className="flex gap-2 text-lg text-muted">
                        <span style={{ color: m.color }}>→</span>{opt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily nutrition log */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nhật Ký Hôm Nay</h2>
        <p className="text-muted text-lg mb-6">Ghi nhanh — không cần hoàn hảo, chỉ cần ý thức về những gì đã ăn.</p>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          {NUTRITION_FIELDS.map((f, fi) => (
            <div key={f.key} className="rounded-xl border p-3 group"
              style={{ borderColor: nutritionModal === fi ? `rgba(${f.rgb},0.45)` : 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setNutritionModal(fi)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 cursor-pointer transition-all"
                  style={{ background: `rgba(${f.rgb},0.12)`, border: `1px solid rgba(${f.rgb},0.25)` }}>
                  {f.icon}
                </button>
                <label className="flex-1 text-base font-medium text-text cursor-pointer" onClick={() => setNutritionModal(fi)}>
                  {f.label}
                </label>
                <button onClick={() => setNutritionModal(fi)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ color: f.color, background: `rgba(${f.rgb},0.1)`, border: `1px solid rgba(${f.rgb},0.25)` }}>
                  Chi tiết →
                </button>
              </div>
              <input type="text" value={log[f.key] ?? ''} onChange={e => updateLog(f.key, e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder={f.placeholder} className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                style={{ borderColor: `rgba(${f.rgb},0.3)` }} />
            </div>
          ))}
          <div>
            <label className="text-lg font-medium text-text block mb-2">📝 Ghi chú bữa ăn ngày hôm nay</label>
            <textarea value={log.notes ?? ''} onChange={e => updateLog('notes', e.target.value)}
              rows={3} placeholder="Ăn gì, cảm giác thế nào, muốn điều chỉnh gì..." className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>
        </div>
      </RevealBlock>

      {/* Quick rules */}
      <RevealBlock delay={3} className="mb-10">
        <h3 className="font-bold mb-1" style={{ color: COLOR }}>⚡ 5 Quy Tắc Ăn Uống Quan Trọng Nhất</h3>
        <p className="text-sm text-muted mb-4">Click vào từng quy tắc để xem lý do khoa học và cách áp dụng.</p>
        <div className="space-y-2">
          {EATING_RULES.map((item, i) => (
            <div key={i}
              className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer group transition-all"
              style={{ background: rulesModal === i ? `rgba(${item.rgb},0.08)` : `rgba(${RGB},0.03)`, border: `1px solid ${rulesModal === i ? `rgba(${item.rgb},0.4)` : `rgba(${RGB},0.12)`}` }}
              onClick={() => setRulesModal(i)}>
              <span className="font-black text-base w-8 shrink-0 text-center" style={{ color: item.color }}>{item.num}</span>
              <span className="text-2xl shrink-0">{item.icon}</span>
              <span className="flex-1 text-base text-muted leading-snug">{item.rule}</span>
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: item.color }}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

      {mealModal !== null && (
        <MealModal
          idx={mealModal}
          onClose={() => setMealModal(null)}
          onPrev={() => setMealModal(i => Math.max(0, i - 1))}
          onNext={() => setMealModal(i => Math.min(MEAL_IDEAS.length - 1, i + 1))}
          hasPrev={mealModal > 0}
          hasNext={mealModal < MEAL_IDEAS.length - 1}
        />
      )}
      {nutritionModal !== null && (
        <NutritionFieldModal
          idx={nutritionModal}
          onClose={() => setNutritionModal(null)}
          onPrev={() => setNutritionModal(i => Math.max(0, i - 1))}
          onNext={() => setNutritionModal(i => Math.min(NUTRITION_FIELDS.length - 1, i + 1))}
          hasPrev={nutritionModal > 0}
          hasNext={nutritionModal < NUTRITION_FIELDS.length - 1}
        />
      )}
      {rulesModal !== null && (
        <EatingRulesModal
          idx={rulesModal}
          onClose={() => setRulesModal(null)}
          onPrev={() => setRulesModal(i => Math.max(0, i - 1))}
          onNext={() => setRulesModal(i => Math.min(EATING_RULES.length - 1, i + 1))}
          hasPrev={rulesModal > 0}
          hasNext={rulesModal < EATING_RULES.length - 1}
        />
      )}
    </div>
  );
}
