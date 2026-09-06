import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'f-hs-orbit-kf';
const ORBIT_CLASS = 'f-hs-orbit-ring';
const LS_KEY = 'healthapp_f_score_today';
const LS_HIST = 'healthapp_f_score_hist';

const SCORE_ITEMS = [
  {
    key: 'workout', label: 'Vận động/tập luyện', max: 25, icon: '🏋️',
    desc: '25đ: tập ≥30ph sức mạnh · 15đ: tập 10–29ph · 5đ: vận động nhẹ',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tập luyện sức mạnh ≥30 phút/ngày × 3–4 ngày/tuần là can thiệp đơn lẻ có tác động rộng nhất đến sức khỏe toàn diện: tăng muscle mass, cải thiện insulin sensitivity, tăng bone density, giảm tử vong sớm 23%, và cải thiện cognitive function — không có thuốc nào làm được tất cả điều này cùng lúc.',
    details: [
      'Tại sao sức mạnh quan trọng hơn cardio cho sức khỏe dài hạn: muscle mass là "ngân hàng metabolic" — 1kg cơ đốt thêm 13–15 kcal/ngày. Sau 30 tuổi, mất ~3–5% cơ mỗi thập kỷ nếu không tập. Sarcopenia (mất cơ tuổi già) là yếu tố độc lập dự báo tử vong, ngã, và mất độc lập.',
      '30 phút là ngưỡng: dưới 20 phút, cơ thể chủ yếu dùng glycogen (carb). Từ 20–30 phút trở đi, fatty acid mobilization tăng và hormonal response (growth hormone, testosterone) mới đủ mạnh để kích thích muscle protein synthesis.',
      'Progressive overload là nguyên tắc cốt lõi: cơ bắp chỉ phát triển khi chịu tải lớn hơn hôm qua. Tập cùng một bài với cùng tạ mỗi ngày → không có kết quả sau 4–6 tuần. Tăng 1 rep hoặc 1kg mỗi tuần là đủ để duy trì stimulus.',
      'Compound movements > isolation: squat, deadlift, bench press, row, overhead press kích hoạt nhiều muscle group cùng lúc → thời gian hiệu quả cao hơn, hormonal response mạnh hơn. Không cần thiết bị phức tạp — bodyweight (push-up, squat, pull-up) đủ để bắt đầu.',
      'Recovery là phần của tập: cơ không phát triển khi tập mà khi nghỉ. Cần 48h giữa các buổi tập cùng nhóm cơ. Không đủ sleep → growth hormone không tiết đủ → muscle protein synthesis kém → tập vất vả mà không có kết quả.',
      'Tần suất tối ưu: 3–4 buổi/tuần full-body hoặc upper/lower split. 2 buổi/tuần vẫn duy trì được muscle mass. 5+ buổi/tuần không tăng thêm lợi ích đáng kể cho người mới và trung cấp, tăng nguy cơ overtraining.',
    ],
    points: [
      { icon: '💪', label: '-23% Tử Vong Sớm', note: 'Tập sức mạnh 3–4x/tuần — lợi ích rộng nhất trong tất cả can thiệp' },
      { icon: '⏱️', label: '30 Phút = Ngưỡng', note: 'Dưới 20 phút chưa đủ kích hoạt hormonal response tối ưu' },
      { icon: '📈', label: 'Progressive Overload', note: 'Tăng 1 rep hoặc 1kg/tuần — nguyên tắc không thể bỏ' },
      { icon: '😴', label: 'Sleep = Recovery = Kết Quả', note: 'GH tiết khi ngủ sâu — tập mà không ngủ đủ = tập vô ích' },
    ],
  },
  {
    key: 'neat', label: 'Đi bộ/NEAT', max: 15, icon: '🚶',
    desc: '15đ: ≥8,000 bước · 10đ: 5,000–7,999 · 5đ: 3,000–4,999',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'NEAT (Non-Exercise Activity Thermogenesis) — tất cả vận động không phải tập gym — chiếm 15–50% tổng calo đốt mỗi ngày tùy lifestyle. Sự chênh lệch NEAT giữa người "năng động" và "ít vận động" có thể lên đến 2,000 kcal/ngày dù cùng trọng lượng.',
    details: [
      'NEAT bao gồm gì: đi lại trong nhà, gõ bàn phím, đứng, nấu ăn, dọn dẹp, cử động tay chân khi ngồi, leo cầu thang. Tổng cộng những điều nhỏ này quan trọng không kém tập gym — người gầy tự nhiên thường có NEAT cao không phải vì không ăn mà vì cử động nhiều hơn.',
      'Active couch potato syndrome: người tập gym 1 giờ/ngày nhưng ngồi 9 giờ còn lại có metabolic profile gần giống người không tập. LPL (lipoprotein lipase) — enzyme đốt mỡ máu — ngừng hoạt động trong 9 giờ ngồi đó. 1 giờ tập không "xóa" 9 giờ ngồi.',
      'Bước chân và thực tế: 7,000–8,000 bước/ngày giảm tử vong sớm 50–65% so với <4,000 bước (JAMA 2021). Con số 10,000 là marketing từ 1964 — không có nghiên cứu gốc. Sweet spot thực tế là 7,500–8,000.',
      'Sitting breaks quan trọng hơn tổng số bước: đứng dậy 2–3 phút mỗi 30–45 phút phục hồi LPL và insulin sensitivity. Không cần thêm vào tổng bước — chỉ cần ngắt quãng ngồi liên tục. Timer trên điện thoại đủ để thực hành.',
      'Zone 2 walking: đi nhanh đủ để nhịp tim đạt 60–70% max HR (nói chuyện được nhưng hơi thở nhanh hơn) là dạng aerobic tốt nhất cho mitochondrial health và longevity. 20–30 phút zone 2 walking mỗi ngày = foundation cardiovascular health.',
      'Tích hợp mà không thay đổi lịch: đỗ xe xa 200m (+500 bước), leo cầu thang (+100–200 bước/tầng), đứng khi gọi điện, đi bộ lúc ăn trưa (+1,500 bước). Những thay đổi nhỏ này cộng lại 3,000–4,000 bước/ngày mà không cần thêm thời gian.',
    ],
    points: [
      { icon: '🔥', label: 'NEAT = 15–50% Calo/Ngày', note: 'Quan trọng không kém tập gym — bị đánh giá thấp nhất' },
      { icon: '⏱️', label: 'Break 2–3 Phút/30 Phút', note: 'Phục hồi LPL — ngồi liên tục triệt tiêu lợi ích của buổi tập' },
      { icon: '🎯', label: '7,500–8,000 Sweet Spot', note: '50–65% giảm tử vong sớm — không cần đúng 10,000' },
      { icon: '🚀', label: 'Zone 2 Walking', note: '20–30 phút tim 60–70% max HR = foundation tốt nhất' },
    ],
  },
  {
    key: 'nutrition', label: 'Dinh dưỡng cơ bản', max: 20, icon: '🍽️',
    desc: '20đ: đủ đạm + rau + không snack tệ · 12đ: 2/3 tiêu chí · 5đ: 1/3',
    color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ba tiêu chí chấm điểm dinh dưỡng cơ bản (đủ protein + đủ rau/fiber + không siêu chế biến) là nền tảng đủ để 80% người cải thiện sức khỏe — không cần đếm calo hay follow chế độ ăn phức tạp. Protein và fiber là hai "pillars" quan trọng nhất, được hỗ trợ bởi nhiều nghiên cứu nhất.',
    details: [
      'Protein tối thiểu: 1.6g/kg thể trọng/ngày để maintain muscle mass. Người tập luyện: 2.0g/kg. Ưu tiên protein từ thực phẩm nguyên thể: thịt nạc, cá, trứng, đậu hũ, legumes. Protein cũng là macronutrient no lâu nhất — tăng protein thường giảm tự nhiên calo tổng mà không cần cố.',
      'Rau và fiber: 30g fiber/ngày là mục tiêu (người Việt trung bình ~15g). Fiber nuôi gut microbiome → sản xuất short-chain fatty acids → giảm viêm, tăng insulin sensitivity, cải thiện mood (70% serotonin được tổng hợp ở ruột). Ăn đa dạng loại rau > ăn nhiều 1 loại.',
      'Siêu chế biến (ultra-processed food — UPF): thực phẩm có >5 thành phần không nhận ra được, đặc biệt là emulsifiers, preservatives, artificial flavors. UPF chiếm 60% calo trong chế độ ăn hiện đại và liên quan đến tăng nguy cơ tim mạch, béo phì, và depression độc lập với calo.',
      'Meal timing đơn giản: không bỏ bữa sáng hoặc ăn sáng đủ protein (≥20g) — giảm cravings cả ngày và ổn định blood sugar. Ăn tối cách ngủ ít nhất 2h để hệ tiêu hóa có thời gian và không ảnh hưởng sleep quality.',
      'Hydration và dinh dưỡng: nhiều người nhầm khát với đói — uống 1 ly nước trước bữa ăn giảm calo tiêu thụ ~13% và hỗ trợ digestion. Dehydration chỉ 2% đã giảm cognitive performance 10–15% và tăng cảm giác mệt mỏi.',
      'Tính thực tế: không cần ăn hoàn hảo 100%. 80/20 rule (80% thực phẩm nguyên thể, 20% thoải mái) đủ để duy trì sức khỏe tốt dài hạn. Stress về thực phẩm ("orthorexia") gây hại sức khỏe nhiều hơn việc ăn không hoàn hảo đôi khi.',
    ],
    points: [
      { icon: '🥩', label: 'Protein 1.6–2.0g/kg', note: 'Ưu tiên nhất — no lâu + giữ cơ + ổn định blood sugar' },
      { icon: '🥦', label: 'Fiber 30g/Ngày', note: 'Nuôi gut microbiome → serotonin → mood và viêm giảm' },
      { icon: '🚫', label: 'Tránh UPF', note: 'Siêu chế biến >5 thành phần lạ — liên quan depression và tim mạch' },
      { icon: '⚖️', label: '80/20 Rule', note: 'Không cần hoàn hảo — consistency quan trọng hơn perfection' },
    ],
  },
  {
    key: 'water', label: 'Uống nước', max: 10, icon: '💧',
    desc: '10đ: ≥ nhu cầu cá nhân · 5đ: uống bình thường · 0đ: ít hơn nhiều',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nước chiếm 60% trọng lượng cơ thể và tham gia vào mọi phản ứng sinh hóa. Dehydration chỉ 2% thể trọng đã giảm cognitive performance 10–15%, tăng mệt mỏi 21%, và tăng nhận cảm đau đớn. Con số "8 ly/ngày" là myth — nhu cầu cá nhân khác nhau đáng kể.',
    details: [
      'Nhu cầu cá nhân thực tế: 35ml × kg thể trọng = baseline. 70kg → 2,450ml. Tập gym +500–750ml. Thời tiết nóng/lạnh khô +250–500ml. Uống nhiều rau quả → trừ ~300–500ml. Màu nước tiểu là indicator đơn giản nhất: vàng nhạt như nước chanh loãng = đủ; vàng đậm = thiếu.',
      'Dehydration cognitive effects: vùng não nhạy cảm nhất với mất nước là anterior cingulate cortex (attention, error detection) và hippocampus (memory). Giải thích vì sao khi thiếu nước khó tập trung, hay nhầm lẫn, và mood xấu mà không biết lý do.',
      'Khát ≠ đủ signal: cảm giác khát xuất hiện khi đã mất ~1–2% nước — lúc này cognitive performance đã giảm. Người cao tuổi có cảm giác khát kém hơn → dễ mất nước mà không hay. Uống theo lịch (mỗi giờ) tốt hơn chỉ uống khi khát.',
      'Nước vs. đồ uống khác: cà phê và trà không mất nước như nhiều người nghĩ — lợi tiểu nhẹ nhưng lượng nước trong thức uống vẫn net positive. Nước lọc vẫn là tốt nhất vì không có calories hoặc additives. Nước ép trái cây có đường → không tính là hydration tốt.',
      'Timing quan trọng: 1 ly 500ml ngay khi thức dậy bù nước mất trong giấc ngủ (~400–500ml hơi thở) và tăng alertness buổi sáng nhanh hơn coffee. 1 ly trước mỗi bữa ăn → giảm calo intake và hỗ trợ tiêu hóa. Dừng uống nhiều 1–2h trước ngủ.',
      'Electrolytes khi tập nặng: uống nước thuần >2 lít trong 1–2 giờ mà không bổ sung electrolytes (sodium, potassium) → hyponatremia (hạ natri máu) — nguy hiểm hơn dehydration. Sau tập >60 phút: nước + ít muối (pinch of salt) hoặc đồ uống thể thao loãng.',
    ],
    points: [
      { icon: '🧠', label: '-2% = -15% Cognitive', note: 'Dehydration nhẹ đã giảm attention, memory, mood rõ rệt' },
      { icon: '📏', label: '35ml × kg Thể Trọng', note: 'Nhu cầu cá nhân — màu nước tiểu là cách check đơn giản nhất' },
      { icon: '⏰', label: 'Uống Theo Lịch', note: 'Khát = đã thiếu — đừng chờ khát mới uống' },
      { icon: '🌅', label: '500ml Ngay Khi Thức Dậy', note: 'Bù nước đêm + tăng alertness buổi sáng nhanh hơn coffee' },
    ],
  },
  {
    key: 'sleep', label: 'Ngủ/phục hồi', max: 15, icon: '😴',
    desc: '15đ: ngủ ≥7h, chất lượng tốt · 8đ: 6–7h · 3đ: < 6h',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngủ là can thiệp phục hồi mạnh nhất tồn tại — free, không cần thiết bị, không tác dụng phụ. Trong 7–9 giờ ngủ: não dọn dẹp amyloid plaques (liên quan Alzheimer), cơ phục hồi và phát triển, hệ miễn dịch hoạt động tối đa, và emotional memory được xử lý. Không có supplement nào thay thế được.',
    details: [
      'Chu kỳ ngủ 90 phút: NREM (3 giai đoạn, deep sleep dominates nửa đầu đêm) + REM (dream, memory consolidation dominates nửa sau). 7.5h = 5 chu kỳ đầy đủ. Đi ngủ muộn → mất deep sleep; dậy sớm → mất REM. Cả hai đều quan trọng với vai trò khác nhau.',
      'Glymphatic system: não có hệ thống dọn dẹp riêng chỉ hoạt động khi ngủ sâu. CSF (cerebrospinal fluid) chảy qua và rửa amyloid beta và tau proteins — các chất tích lũy gây Alzheimer. Ngủ <6h mãn tính → amyloid tích lũy → dài hạn là nguy cơ thực sự.',
      'Growth hormone và recovery: 70–80% tổng growth hormone tiết trong ngày xảy ra trong 1–2 giờ đầu của deep sleep. Thiếu deep sleep → cơ không phục hồi sau tập → tập nhiều mà ít kết quả; trẻ em không tăng trưởng đủ; người lớn lão hóa nhanh hơn.',
      'Sleep và weight: thiếu ngủ tăng ghrelin (hunger hormone) +24% và giảm leptin (satiety hormone) → ăn thêm 300–500 kcal/ngày mà không nhận ra. Nghịch lý: nhiều người cố ăn kiêng mà không cải thiện ngủ → diet không hiệu quả dù cố gắng.',
      'Consistency quan trọng hơn duration: ngủ cùng giờ 7 ngày/tuần (kể cả cuối tuần) quan trọng hơn ngủ dài ngày nghỉ. Social jetlag (sai lệch giờ ngủ cuối tuần) liên quan đến tăng nguy cơ metabolic disorders và tim mạch.',
      'Cải thiện ngay tối nay: phòng mát 18–20°C; tối hoàn toàn (blackout curtain/eye mask); yên tĩnh hoặc white noise; không điện thoại 30 phút trước ngủ; tắm nước ấm 1–2h trước ngủ (hạ core temperature → ngủ nhanh). 5 điều này tốt hơn bất kỳ thuốc ngủ nào.',
    ],
    points: [
      { icon: '🧹', label: 'Glymphatic = Dọn Não', note: 'Rửa amyloid beta khi ngủ sâu — chỉ hoạt động khi ngủ' },
      { icon: '💪', label: 'GH Tiết 70–80% Khi Ngủ', note: 'Thiếu deep sleep → tập gym mà cơ không phát triển' },
      { icon: '🍽️', label: 'Thiếu Ngủ = +300–500 kcal', note: 'Ghrelin tăng, leptin giảm — ăn nhiều hơn mà không biết' },
      { icon: '🔄', label: 'Cùng Giờ 7 Ngày/Tuần', note: 'Consistency quan trọng hơn ngủ dài — chống social jetlag' },
    ],
  },
  {
    key: 'mind', label: 'Tâm trí/calm practice', max: 10, icon: '🧘',
    desc: '10đ: thực hành calm ≥5ph · 5đ: ý thức được stress · 0đ: không chú ý',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress mạn tính là yếu tố nguy cơ độc lập của hầu hết bệnh mạn tính (tim mạch, tiểu đường, ung thư, Alzheimer) — không phải chỉ là "vấn đề tâm lý". 5 phút thực hành calm mỗi ngày (thở, thiền, đi bộ chánh niệm) kích hoạt hệ phó giao cảm và bắt đầu counter-balance tác động của cortisol.',
    details: [
      'Stress mạn tính vs. cấp tính: stress cấp (có nguyên nhân, có điểm dừng) có lợi — tăng focus, performance, và resilience. Stress mạn tính (liên tục, không có điểm dừng) phá hủy: cortisol cao dài hạn tăng visceral fat, giảm immune function, phá hippocampus, tăng huyết áp.',
      'Tại sao 5 phút là đủ để đếm: nghiên cứu neuroplasticity cho thấy 5 phút mindfulness/ngày đủ để bắt đầu thay đổi HRV và autonomic balance trong 4–6 tuần. Không cần đạt trạng thái zen — chỉ cần consistent repetition để build neural pathway.',
      '"Ý thức được stress" (5 điểm): nhận ra mình đang stress là bước đầu tiên và quan trọng. Nhiều người trong chronic stress mode nhưng không nhận ra vì đã quen. Đặt tên cho stress — "tôi đang stressed vì X" — kích hoạt prefrontal cortex và giảm amygdala reactivity.',
      'Heart Rate Variability (HRV): biến thiên nhịp tim là biofeedback tốt nhất về trạng thái hệ thần kinh tự chủ. HRV cao = phó giao cảm mạnh = phục hồi tốt. Calm practice tăng HRV đo được sau 4–8 tuần thực hành đều đặn.',
      'Stack với thói quen có sẵn: thở sâu 3 lần ngay sau đánh răng sáng + 2 phút scan cơ thể trước ngủ = 5+ phút tổng cộng. Không cần thêm thời gian vào lịch — chỉ cần gắn vào những gì đã làm hằng ngày.',
      'Long-term brain changes: 8 tuần thiền 10 phút/ngày thay đổi vật lý não (Harvard, 2011): prefrontal cortex dày hơn (quyết định tốt hơn), amygdala nhỏ hơn (ít lo âu hơn), insula nhạy hơn (body awareness tốt hơn). Điều này xảy ra ngay cả với người bắt đầu ở tuổi 50+.',
    ],
    points: [
      { icon: '🔬', label: 'Stress Mạn Tính = Bệnh Thật', note: 'Yếu tố nguy cơ độc lập của tim mạch, tiểu đường, ung thư' },
      { icon: '⏱️', label: '5 Phút Đủ Để Bắt Đầu', note: 'Neuroplasticity sau 4–6 tuần — consistency > duration' },
      { icon: '📊', label: 'HRV = Biofeedback Tốt Nhất', note: 'Calm practice tăng HRV đo được — hệ phó giao cảm mạnh hơn' },
      { icon: '🧬', label: 'Não Thay Đổi 8 Tuần', note: 'PFC dày, amygdala nhỏ — Harvard 2011, ngay cả người >50 tuổi' },
    ],
  },
  {
    key: 'journal', label: 'Ghi nhật ký', max: 5, icon: '📝',
    desc: '5đ: ghi nhật ký ngày hôm nay · 0đ: không',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 điểm nhỏ cho nhật ký nhưng tác động lớn không tương xứng. James Pennebaker (ĐH Texas): 20 phút viết cảm xúc × 3–4 ngày cải thiện sức khỏe thể chất, tăng T-lymphocytes, và giảm trầm cảm — hiệu quả kéo dài 6 tháng sau. Daily journaling giúp track patterns mà não không thể nhớ chính xác.',
    details: [
      'Tại sao chỉ 5 điểm: nhật ký không phải trụ cột sức khỏe chính như vận động hay ngủ — nhưng là "connective tissue" giúp bạn nhận ra patterns của các trụ cột khác. "Tuần này tôi ít ngủ + ít tập + mood thấp → xem lại nhật ký thấy nguyên nhân là do..." Không ghi = không có dữ liệu để cải thiện.',
      'Minimum viable journaling: không cần viết dài. 3 câu tối thiểu (stress hôm nay + điều biết ơn + ý định ngày mai) đủ để tạo reflection habit. Consistency quan trọng hơn depth — 2 phút mỗi tối > 20 phút mỗi tuần.',
      'Journaling và health score: ghi nhật ký health score mỗi ngày (như bạn đang làm) tạo accountability loop. Ngày nào không muốn ghi = ngày đó thường điểm thấp nhất. Nhận ra điều này → động lực làm ít nhất 1 điều để điểm cao hơn.',
      'Pattern recognition sau 7–14 ngày: đọc lại nhật ký 2 tuần cho thấy: ngày nào điểm cao nhất? Thứ mấy hay có điểm thấp? Trigger nào (stress, ăn uống, social event) ảnh hưởng nhiều nhất? Dữ liệu cá nhân này không có trong bất kỳ nghiên cứu nào — đây là nghiên cứu về chính bạn.',
      'Viết tay vs. digital: viết tay kích hoạt nhiều neural circuit hơn gõ phím. Tốc độ chậm hơn buộc não xử lý và filter ý tưởng sâu hơn. Nhưng digital (app) tốt hơn không viết — chọn cái bạn sẽ thực sự dùng.',
      'Compound effect: người ghi nhật ký sức khỏe 90 ngày liên tục có điểm sức khỏe tổng thể cao hơn 40% so với điểm ban đầu (theo các app tracking). Không phải vì nhật ký magic — mà vì awareness → decision → behavior change. Bạn cải thiện thứ bạn đo.',
    ],
    points: [
      { icon: '🔍', label: 'Pattern Recognition', note: '2 tuần dữ liệu = bức tranh về trigger và peak performance' },
      { icon: '📈', label: 'Điểm +40% Sau 90 Ngày', note: 'Awareness → decisions tốt hơn — ghi nhật ký tracking' },
      { icon: '⏱️', label: '3 Câu × 2 Phút/Tối', note: 'Minimum viable — consistency quan trọng hơn depth' },
      { icon: '🔗', label: 'Connective Tissue', note: 'Liên kết tất cả trụ cột — giúp thấy why, không chỉ what' },
    ],
  },
];

const SCORE_LEVELS = [
  { min: 90, label: 'Xuất sắc', color: '#22c55e', msg: 'Bạn đang vận hành ở mức tối ưu. Duy trì nhất quán.' },
  { min: 75, label: 'Tốt', color: '#84cc16', msg: 'Tốt. Tinh chỉnh 1–2 điểm yếu để lên xuất sắc.' },
  { min: 55, label: 'Ổn định', color: '#f59e0b', msg: 'Nền tảng tốt. Chọn 1 điểm yếu để cải thiện tuần này.' },
  { min: 35, label: 'Cần cải thiện', color: '#ef4444', msg: 'Hãy tập trung vào 2 trụ cột cơ bản nhất: vận động + ngủ.' },
  { min: 0, label: 'Bắt đầu lại', color: '#7c3aed', msg: 'Hôm nay là ngày mới. Chỉ cần tick 1 mục nhỏ là đủ để bắt đầu.' },
];

function ScoreModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = SCORE_ITEMS[idx];
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
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: `rgba(${item.rgb},0.7)` }}>Nhóm {idx + 1}/{SCORE_ITEMS.length}</div>
              <div className="text-base font-bold" style={{ color: item.color }}>{item.max} điểm tối đa</div>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.label}</h2>
          <p className="text-sm mb-5" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.desc}</p>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {SCORE_ITEMS.length}</span>
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

export default function ToolsHealthScorePage() {
  const { t: tT } = useTranslation('tools');
  const today = new Date().toISOString().slice(0, 10);
  const [scores, setScores] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || {}; } catch { return {}; }
  });
  const [hist, setHist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
  });
  const [openItem, setOpenItem] = useState(null);
  const [scoreModal, setScoreModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-hs-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fHsOrbitSpin { to { --f-hs-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-hs-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fHsOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const setScore = (key, val) => {
    const next = { ...scores, [key]: Math.min(+val, SCORE_ITEMS.find(i => i.key === key).max) };
    setScores(next);
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const total = SCORE_ITEMS.reduce((s, i) => s + (scores[i.key] || 0), 0);
  const maxTotal = SCORE_ITEMS.reduce((s, i) => s + i.max, 0);
  const pct = Math.round((total / maxTotal) * 100);
  const level = SCORE_LEVELS.find(l => total >= l.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];

  const saveToHistory = () => {
    const entry = { date: today, total, pct, scores: { ...scores } };
    const next = [entry, ...hist.filter(h => h.date !== today)].slice(0, 30);
    setHist(next);
    localStorage.setItem(LS_HIST, JSON.stringify(next));
  };

  const last7hist = hist.slice(0, 7);
  const avg7 = last7hist.length ? Math.round(last7hist.reduce((s, h) => s + h.pct, 0) / last7hist.length) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💯</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('health_score.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('health_score.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('health_score.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop" alt="Health score" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('health_score.img_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Score display */}
      <RevealBlock delay={0} className="mb-8">
        <div className="rounded-2xl border p-6 text-center" style={{ borderColor: `${level.color}30`, background: `${level.color}08` }}>
          <div className="text-7xl font-black mb-2" style={{ color: level.color }}>{total}</div>
          <div className="text-xl font-bold mb-1" style={{ color: level.color }}>{level.label}</div>
          <div className="text-lg text-muted mb-4">{level.msg}</div>
          <div className="h-3 rounded-full bg-border overflow-hidden mx-auto max-w-sm">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: level.color }} />
          </div>
          <div className="text-base text-muted mt-2">{total}/{maxTotal} điểm · {pct}%</div>
        </div>
      </RevealBlock>

      {/* Score inputs */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Chấm Điểm Hôm Nay</h2>
        <div className="space-y-3">
          {SCORE_ITEMS.map((item, i) => (
            <div key={item.key} className="rounded-2xl border bg-surface overflow-hidden transition-colors"
              style={{ borderColor: scoreModal === i ? `rgba(${item.rgb},0.4)` : 'var(--border)' }}>
              <div className="group flex items-center gap-3 p-4">
                <button onClick={() => setOpenItem(openItem === i ? null : i)} className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity min-w-0">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-lg font-medium text-text leading-snug">{item.label}</div>
                    <div className="text-base text-muted">{scores[item.key] || 0}/{item.max} điểm</div>
                  </div>
                </button>
                <div className="w-20 h-2 rounded-full bg-border overflow-hidden shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${((scores[item.key] || 0) / item.max) * 100}%`, background: item.color }} />
                </div>
                <button onClick={() => setScoreModal(i)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: item.color, background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
                  Chi tiết →
                </button>
                <button onClick={() => setOpenItem(openItem === i ? null : i)} className="text-muted text-lg shrink-0 hover:text-text transition-colors">
                  {openItem === i ? '▲' : '▼'}
                </button>
              </div>
              {openItem === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <p className="text-base text-muted mb-3">{item.desc}</p>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max={item.max} value={scores[item.key] || 0}
                      onChange={e => setScore(item.key, e.target.value)}
                      className="flex-1" style={{ accentColor: item.color }} />
                    <span className="text-lg font-bold w-16 text-right" style={{ color: item.color }}>{scores[item.key] || 0}/{item.max}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={saveToHistory} className="w-full mt-4 py-3 rounded-xl font-bold text-lg text-white" style={{ background: COLOR }}>
          💾 Lưu điểm hôm nay vào lịch sử
        </button>
      </RevealBlock>

      {/* History */}
      {last7hist.length > 0 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lịch Sử Điểm</h2>
          {avg7 && <p className="text-muted text-lg mb-4">Điểm trung bình 7 ngày: <strong style={{ color: COLOR }}>{avg7}%</strong></p>}
          <div className="space-y-2">
            {last7hist.map(h => {
              const lv = SCORE_LEVELS.find(l => h.total >= l.min) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
              return (
                <div key={h.date} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                  <span className="text-base text-muted w-16">{h.date.slice(5)}</span>
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${h.pct}%`, background: lv.color }} />
                  </div>
                  <span className="text-lg font-bold w-16 text-right" style={{ color: lv.color }}>{h.total}đ</span>
                  <span className="text-base text-muted">{lv.label}</span>
                </div>
              );
            })}
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

      {scoreModal !== null && (
        <ScoreModal
          idx={scoreModal}
          onClose={() => setScoreModal(null)}
          onPrev={() => setScoreModal(i => Math.max(0, i - 1))}
          onNext={() => setScoreModal(i => Math.min(SCORE_ITEMS.length - 1, i + 1))}
          hasPrev={scoreModal > 0}
          hasNext={scoreModal < SCORE_ITEMS.length - 1}
        />
      )}
    </div>
  );
}
