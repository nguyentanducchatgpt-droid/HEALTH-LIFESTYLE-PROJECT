import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'c-neat-orbit-kf';

const NEAT_VS_TEE = [
  {
    component: 'BMR (nghỉ ngơi)', pct: '60–70%', desc: 'Năng lượng cơ thể dùng khi hoàn toàn nghỉ ngơi',
    color: '#6366f1', rgb: '99,102,241',
    icon: '🫀', title: 'BMR — Basal Metabolic Rate',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'BMR chiếm 60–70% tổng năng lượng tiêu thụ mỗi ngày — ngay cả khi bạn nằm yên cả ngày không làm gì. Não (20%), gan (25%), tim (15%) và thận liên tục đốt calo để duy trì sự sống. Không thể "tắt" BMR — đây là chi phí vận hành cơ bản của cơ thể.',
    detail: 'BMR phụ thuộc vào cân nặng, chiều cao, tuổi và giới tính — tính theo công thức Mifflin-St Jeor. Cơ bắp là mô "đắt" nhất: mỗi kg cơ bắp đốt ~13 kcal/ngày ngay cả khi nghỉ ngơi. Fat chỉ đốt ~4 kcal/kg/ngày — đây là lý do tăng cơ bắp là cách bền nhất để tăng BMR dài hạn.',
    details: [
      'Não tiêu thụ ~20% BMR dù chỉ chiếm 2% trọng lượng cơ thể — organ đắt đỏ nhất tính theo tỷ lệ. Gan ~25%, tim ~15%, thận ~10%. Cơ bắp ở trạng thái nghỉ chiếm ~20–25% — nhưng có thể tăng nhiều hơn khi tập.',
      'Công thức Mifflin-St Jeor (chính xác nhất hiện tại): Nam = 10×kg + 6.25×cm − 5×tuổi + 5. Nữ = 10×kg + 6.25×cm − 5×tuổi − 161. Kết quả × hệ số hoạt động = TDEE.',
      'Cơ bắp vs mỡ: 1 kg cơ bắp đốt ~13 kcal/ngày khi nghỉ, 1 kg mỡ chỉ đốt ~4 kcal/ngày. Người 70kg có 35% cơ = đốt ~700 kcal/ngày chỉ từ cơ bắp khi nghỉ ngơi.',
      'Lão hóa và BMR: BMR giảm ~1–2% mỗi thập niên sau tuổi 30 — chủ yếu do mất cơ (sarcopenia), không phải do lão hóa tế bào trực tiếp. Tập strength training duy trì cơ bắp = duy trì BMR cao khi già.',
      'Không thể tăng BMR nhanh: không có "thực phẩm tăng trao đổi chất" đáng kể. Cách tăng BMR thực sự duy nhất và bền vững là tăng khối lượng cơ bắp qua tập strength training và đủ protein.',
      'Thực tế với người 70kg, 30 tuổi, nam: BMR ~1.700 kcal/ngày. Ngay cả nằm cả ngày vẫn đốt 1.700 kcal. Mọi hoạt động thêm vào (TEF + Exercise + NEAT) đều cộng lên trên con số này.',
    ],
    points: [
      { icon: '🧠', label: 'Não tiêu 20% BMR', note: 'Chỉ 2% cân nặng nhưng ngốn 20% năng lượng nghỉ ngơi' },
      { icon: '💪', label: '1kg cơ = +13 kcal/ngày', note: 'Cơ bắp đốt 3× nhiều hơn mỡ khi nghỉ ngơi' },
      { icon: '📉', label: '-1–2% BMR mỗi thập niên', note: 'Do mất cơ (sarcopenia) — strength training ngăn chặn điều này' },
      { icon: '🔢', label: 'Mifflin-St Jeor formula', note: '10×kg + 6.25×cm − 5×tuổi ± 5(nam)/161(nữ)' },
    ],
  },
  {
    component: 'TEF (tiêu hóa)', pct: '8–10%', desc: 'Năng lượng tiêu hóa và hấp thụ thức ăn',
    color: '#8b5cf6', rgb: '139,92,246',
    icon: '🍽️', title: 'TEF — Thermic Effect of Food',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein có TEF 20–35% — ăn 100 kcal protein, cơ thể đốt 20–35 kcal chỉ để tiêu hóa nó. Carb chỉ 5–10%, Fat 0–3%. Đây là lý do tại sao bữa ăn nhiều protein no lâu hơn và hỗ trợ fat loss tốt hơn cùng lượng calo từ carb hay fat.',
    detail: 'TEF (Thermic Effect of Food) là năng lượng cơ thể dùng để tiêu hóa, hấp thụ, vận chuyển và chuyển hóa thức ăn. Trung bình 8–10% TDEE — nhưng con số này thay đổi đáng kể tùy loại macronutrient và thành phần bữa ăn.',
    details: [
      'TEF theo macronutrient: Protein 20–35%, Carbohydrate 5–10%, Fat 0–3%. Ăn 2.000 kcal toàn protein → chỉ hấp thụ ~1.300–1.600 kcal net. Ăn 2.000 kcal toàn fat → hấp thụ gần 2.000 kcal net.',
      'Protein TEF cao vì: chuỗi amino acid phức tạp cần nhiều enzyme và năng lượng để phân giải, vận chuyển và tổng hợp lại. Tiêu hóa protein là "công việc nặng" nhất của hệ tiêu hóa.',
      'Ứng dụng thực tế: tăng protein trong chế độ ăn không chỉ no lâu hơn (ức chế ghrelin) mà còn thực sự đốt nhiều calo hơn trong quá trình tiêu hóa — double benefit cho fat loss.',
      '"Meal frequency myth": ăn nhiều bữa nhỏ không tăng TEF so với ít bữa lớn cùng tổng lượng calo. TEF tỷ lệ với tổng lượng ăn, không phải số bữa. Ăn 3 bữa hay 6 bữa cùng macro = TEF như nhau.',
      'Thực phẩm có TEF cao nhất: thịt nạc (gà, bò), cá, trứng, đậu hũ, sữa chua Hy Lạp — protein nguồn tốt. Rau củ có chất xơ cao cũng có TEF cao hơn carb tinh chế vì cần nhiều năng lượng xử lý hơn.',
      'Tổng TEF với 2.000 kcal/ngày: trung bình 160–200 kcal/ngày bị đốt qua TEF. Với chế độ ăn cao protein (30–35% macro), TEF có thể đạt 200–250 kcal/ngày — tương đương 20–25 phút đi bộ.',
    ],
    points: [
      { icon: '🥩', label: 'Protein TEF 20–35%', note: '100 kcal protein → chỉ hấp thụ 65–80 kcal net sau tiêu hóa' },
      { icon: '⚖️', label: 'Fat TEF chỉ 0–3%', note: 'Fat tiêu hóa dễ nhất — gần như không tốn năng lượng để hấp thụ' },
      { icon: '📊', label: 'Meal frequency không quan trọng', note: 'TEF theo tổng lượng ăn — 3 bữa hay 6 bữa TEF như nhau' },
      { icon: '💡', label: 'Double benefit của protein', note: 'No lâu hơn + đốt nhiều calo hơn khi tiêu hóa — fat loss tối ưu' },
    ],
  },
  {
    component: 'Exercise (tập gym)', pct: '5–10%', desc: 'Buổi tập 45–60 phút tại phòng gym',
    color: '#a78bfa', rgb: '167,139,250',
    icon: '🏋️', title: 'Exercise — Tập Luyện Có Chủ Đích',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Buổi tập gym 45–60 phút chỉ chiếm 5–10% TDEE — ít hơn nhiều người nghĩ. Tuy nhiên tác dụng gián tiếp (tăng BMR qua muscle gain, cải thiện insulin sensitivity, EPOC afterburn) thường lớn hơn lượng calo đốt trực tiếp trong buổi tập.',
    detail: 'Nhiều người overestimate lượng calo đốt khi tập và sau đó "bù lại" bằng ăn nhiều hơn (compensation effect). Cardio đốt calo trực tiếp nhưng có thể giảm NEAT trong phần còn lại của ngày. Strength training đốt ít hơn trong buổi tập nhưng tăng BMR dài hạn.',
    details: [
      'Con số thực tế: người 70kg chạy bộ 30 phút đốt ~300 kcal. Một Big Mac = 550 kcal. "Chạy bộ 30 phút rồi ăn thêm 1 cái bánh mì thịt" = đã bù lại (và hơn). Exercise đốt ít calo trực tiếp hơn nhiều người nghĩ.',
      'Cardio vs Strength — trực tiếp: Cardio đốt nhiều calo hơn trong buổi tập (400–600 kcal/giờ vs 200–400 kcal/giờ). Strength training đốt ít hơn nhưng tăng cơ bắp → tăng BMR dài hạn → lợi ích kéo dài 24/7.',
      'EPOC (Excess Post-exercise Oxygen Consumption): sau buổi tập strength training hoặc HIIT, cơ thể tiếp tục đốt thêm 50–200 kcal trong 12–24 giờ tiếp theo để phục hồi. Cardio nhẹ ít có EPOC đáng kể.',
      'Compensation effect: một số người giảm NEAT sau khi tập (ngồi nhiều hơn vì mệt, chọn thang máy hơn cầu thang) — làm giảm hiệu quả tổng thể. Tập gym không phải "giấy phép" để ngồi suốt phần còn lại của ngày.',
      'Muscle gain = BMR tăng: mỗi kg cơ bắp tăng thêm do strength training đốt thêm ~13 kcal/ngày khi nghỉ. Tăng 5kg cơ = +65 kcal/ngày BMR — lợi ích nhỏ nhưng cộng dồn đáng kể sau nhiều năm tập luyện.',
      'Chiến lược tối ưu: Strength training 3–4 lần/tuần (tăng BMR) + Cardio vừa phải (sức khỏe tim mạch) + duy trì NEAT cao (đốt nhiều nhất tổng thể). Ba thành phần bổ trợ nhau, không thay thế nhau.',
    ],
    points: [
      { icon: '📉', label: 'Chỉ 5–10% TDEE', note: '30 phút chạy ~300 kcal — ít hơn hầu hết mọi người tưởng' },
      { icon: '⚡', label: 'EPOC afterburn', note: 'Strength + HIIT: đốt thêm 50–200 kcal trong 12–24h sau tập' },
      { icon: '⚠️', label: 'Compensation effect', note: 'Tập rồi ngồi nhiều hơn → NEAT giảm → hiệu quả tổng bị trừ' },
      { icon: '🎯', label: 'Strength tăng BMR dài hạn', note: '+1kg cơ = +13 kcal/ngày khi nghỉ — lợi ích 24/7 mãi mãi' },
    ],
  },
  {
    component: 'NEAT (vận động trong ngày)', pct: '15–30%', desc: 'Đi bộ, đứng dậy, làm việc nhà, di chuyển',
    color: COLOR, rgb: RGB,
    icon: '🚶', title: 'NEAT — Non-Exercise Activity Thermogenesis',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'NEAT chiếm 15–30% TDEE và là thành phần dễ thay đổi nhất — có thể biến đổi 500–700 kcal/ngày giữa người năng động và người ngồi nhiều. Đây là "biến số ẩn" giải thích tại sao hai người cùng cân nặng, ăn giống nhau nhưng có kết quả cơ thể rất khác nhau.',
    detail: 'NEAT bao gồm mọi vận động không phải tập thể dục có chủ đích: đi bộ, đứng dậy, lên cầu thang, làm việc nhà, fidgeting. Nghiên cứu của James Levine (Mayo Clinic) cho thấy NEAT giải thích phần lớn sự khác biệt về cân nặng giữa các cá nhân — không phải gen hay trao đổi chất.',
    details: [
      'Nghiên cứu Levine 1999 (Mayo Clinic): 16 người không béo phì ăn thêm 1.000 kcal/ngày trong 8 tuần. Người tăng cân ít nhất (2kg) có NEAT tăng ~690 kcal/ngày tự nhiên. Người tăng nhiều nhất (8kg) gần như không tăng NEAT. NEAT là "defense mechanism" chống tích mỡ.',
      '500–700 kcal difference: người ngồi bàn giấy 8 tiếng có NEAT ~300 kcal/ngày. Người làm việc di chuyển nhiều có NEAT ~1.000 kcal/ngày. Sự chênh lệch này lớn hơn cả một buổi tập gym.',
      'NEAT adaptation khi diet: khi cắt giảm calo, cơ thể thường tự động giảm NEAT — bớt fidgeting, ngồi nhiều hơn, di chuyển ít hơn. Đây là lý do plateau trong quá trình giảm cân và cần duy trì NEAT có ý thức.',
      'Fidgeting (đung đưa tay chân) có thể đốt thêm 20–350 kcal/ngày — biên độ lớn tùy người. Người hay bồn chồn, không ngồi yên tự nhiên có NEAT cao hơn đáng kể mà không cần "tập thể dục" gì.',
      'Không thể bù NEAT bằng gym: 1 giờ gym 3 lần/tuần = ~900 kcal/tuần từ exercise. Đi bộ thêm 3.000 bước mỗi ngày (30 phút) = ~210 kcal/ngày × 7 = 1.470 kcal/tuần — nhiều hơn cả gym, không cần thay đồ.',
      'Tăng NEAT thực tế: đi cầu thang thay thang máy, đứng trong cuộc họp, đi bộ khi gọi điện, làm việc đứng 2 giờ/ngày, đi bộ sau bữa ăn 10 phút. Mỗi thứ nhỏ nhưng tổng hợp lại chiếm 15–30% năng lượng tiêu thụ cả ngày.',
    ],
    points: [
      { icon: '🔍', label: 'Biến số ẩn số 1', note: '500–700 kcal/ngày chênh lệch giữa người năng động và ngồi nhiều' },
      { icon: '🧬', label: 'NEAT tự điều chỉnh', note: 'Ăn ít → cơ thể tự giảm NEAT — cần duy trì có ý thức khi diet' },
      { icon: '🚫', label: 'Gym không bù được NEAT', note: 'Đi bộ 3.000 bước/ngày = nhiều hơn 3 buổi gym/tuần về tổng calo' },
      { icon: '💡', label: 'Fidgeting đốt 20–350 kcal', note: 'Đung đưa chân/tay tự nhiên — người hay bồn chồn có lợi thế NEAT' },
    ],
  },
];

const NEAT_ACTIVITIES = [
  {
    activity: 'Đứng làm việc 4 tiếng', kcal: '+50–100', icon: '🧍',
    color: '#0ea5e9', rgb: '14,165,233',
    title: 'Đứng Làm Việc 4 Tiếng',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đứng thay vì ngồi 4 tiếng/ngày chỉ đốt thêm 50–100 kcal — nhỏ về calo, nhưng lợi ích thực sự là cải thiện đường huyết sau bữa ăn và giảm nguy cơ tim mạch. "Sitting is the new smoking" không phải vì kcal mà vì tác động lên chuyển hóa khi ngồi liên tục.',
    detail: 'Ngồi liên tục >8 giờ/ngày tăng nguy cơ bệnh tim, tiểu đường và tử vong sớm ngay cả ở người tập gym đều đặn. Đứng xen kẽ mỗi 45–60 phút "tắt" quá trình tích lũy tiêu cực này, cải thiện lưu thông máu và giữ cơ bắp chân hoạt động nhẹ.',
    details: [
      'Kcal thực tế: đứng đốt ~80–100 kcal/giờ so với ngồi ~65–75 kcal/giờ — chênh lệch chỉ 15–25 kcal/giờ. 4 tiếng đứng = +60–100 kcal/ngày. Không ấn tượng về mặt năng lượng nhưng tác động chuyển hóa lớn hơn nhiều.',
      'Glucose & insulin: đứng dậy sau bữa ăn kích hoạt cơ bắp chân hấp thụ glucose từ máu trực tiếp — giảm post-prandial glucose spike 30–35%. Ngồi yên sau bữa ăn để insulin làm toàn bộ công việc này kém hiệu quả và gây tích lũy glucose trong mỡ nội tạng.',
      'Lipoprotein lipase (LPL): enzyme quan trọng để đốt mỡ trong cơ bắp. Ngồi liên tục tắt LPL trong cơ bắp chân — đứng dậy tái kích hoạt nó ngay trong vòng vài phút. Đây là cơ chế giải thích tại sao ngồi nhiều liên quan đến mỡ nội tạng cao.',
      'Thực hiện thế nào: không cần standing desk đắt tiền — stack sách/thùng để nâng màn hình, dùng bàn bếp cao, đứng khi họp hoặc gọi điện. Timer 45 phút nhắc đứng dậy hiệu quả hơn cố gắng đứng liên tục.',
      'Đứng xen kẽ tốt hơn đứng liên tục: đứng 5 phút mỗi 25–30 phút hiệu quả hơn đứng 2 tiếng liên tục rồi ngồi 6 tiếng. Đứng lâu liên tục gây mỏi chân, đau lưng dưới và giảm năng suất — mục tiêu là xen kẽ, không phải thay thế hoàn toàn.',
      'Kết hợp: đứng dậy khi nghe nhạc, nghe podcast, xem video ngắn — thay đổi tư thế kết hợp với hoạt động không cần ngồi. Mỗi lần đứng dậy lấy nước (~1 phút) × 10 lần/ngày = 10 phút đứng thêm không tốn công sức.',
    ],
    points: [
      { icon: '📊', label: '+50–100 kcal/4h', note: 'Nhỏ về kcal nhưng tác động chuyển hóa lớn hơn nhiều' },
      { icon: '🩺', label: 'Giảm glucose spike', note: 'Đứng sau bữa ăn giảm đường huyết 30–35% — cơ bắp hấp thụ glucose' },
      { icon: '🔥', label: 'Tái kích hoạt LPL', note: 'Lipoprotein lipase — enzyme đốt mỡ — tắt khi ngồi, bật khi đứng' },
      { icon: '⏰', label: 'Xen kẽ > liên tục', note: '5 phút mỗi 30 phút hiệu quả hơn đứng 2 giờ rồi ngồi cả ngày' },
    ],
  },
  {
    activity: 'Đi bộ 10.000 bước', kcal: '+300–400', icon: '🚶',
    color: '#10b981', rgb: '16,185,129',
    title: 'Đi Bộ 10.000 Bước',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '10.000 bước (~7–8km) đốt 300–400 kcal — lớn nhất trong NEAT phổ biến. Nhưng con số "10.000" đến từ chiến dịch marketing của Yamasa (Nhật Bản, 1964), không phải khoa học. Nghiên cứu hiện đại cho thấy lợi ích sức khỏe plateau ở 7.000–8.000 bước và tăng ít hơn sau đó.',
    detail: 'Không cần đạt 10.000 bước trong 1 lần liên tục — tích lũy rải rác trong ngày (đi lấy nước, leo cầu thang, đậu xe xa hơn) có hiệu quả NEAT tương tự. "Bộ đi tích lũy" vs "đi bộ 1 lần dài" về kcal và sức khỏe là như nhau.',
    details: [
      'Nguồn gốc 10.000 bước: thiết bị đếm bước "Manpo-kei" (万歩計 = "10.000 bước") được Yamasa tung ra thị trường để kỷ niệm Thế vận hội Tokyo 1964. Con số 10.000 được chọn vì tính dễ nhớ và marketing, không phải từ nghiên cứu y khoa.',
      'Nghiên cứu Lee et al. 2019 (JAMA): theo dõi 16.741 phụ nữ cao tuổi cho thấy lợi ích tử vong giảm dần sau 7.500 bước — không tăng đáng kể sau đó. 7.000–8.000 bước có thể là ngưỡng thực tế hơn cho lợi ích sức khỏe tối ưu.',
      'Kcal per step: trung bình ~0.04 kcal/bước (phụ thuộc cân nặng và tốc độ). 10.000 bước × 0.04 = ~400 kcal. Người 80kg đốt nhiều hơn, người 50kg đốt ít hơn. Tốc độ nhanh hơn cùng số bước đốt nhiều kcal hơn.',
      'Tích lũy bước rải rác: 1.000 bước đi bộ đến chỗ làm + 500 bước đi lấy cà phê + 2.000 bước giờ nghỉ trưa + 1.500 bước sau tan làm = 5.000 bước không cần "đi bộ tập thể dục". Thêm 3.000 bước là cầu thang và các chuyển dịch nhỏ.',
      'Beyond kcal: đi bộ 30+ phút liên tục kích hoạt thêm fat oxidation và dopamine/serotonin — không chỉ là NEAT. Đi bộ ngoài trời thêm vitamin D, ánh sáng circadian reset và "visual novelty" cho não. Kcal là lợi ích nhỏ nhất.',
      'Tracking thực tế: smartphone đếm bước khá chính xác (sai số ~5–10%). Không cần mua thiết bị riêng. Để điện thoại trong túi khi đi bộ để đếm đúng — không để trong túi xách hay ba lô.',
    ],
    points: [
      { icon: '📜', label: 'Marketing, không phải khoa học', note: '"10.000" từ Yamasa 1964 — 7.000–8.000 đủ cho lợi ích tối ưu' },
      { icon: '🧮', label: '~0.04 kcal/bước', note: 'Người 70kg × 10.000 bước ≈ 400 kcal — tùy cân nặng và tốc độ' },
      { icon: '🧩', label: 'Tích lũy rải rác = như nhau', note: 'Không cần đi liên tục — bước tích lũy suốt ngày hiệu quả tương đương' },
      { icon: '🧠', label: 'Dopamine + ánh sáng', note: 'Lợi ích thần kinh và circadian lớn hơn kcal đốt trực tiếp' },
    ],
  },
  {
    activity: 'Đi cầu thang 10 phút', kcal: '+60–80', icon: '🪜',
    color: '#f97316', rgb: '249,115,22',
    title: 'Leo Cầu Thang 10 Phút',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Leo cầu thang đốt ~8–10 kcal/phút — gấp 8–10 lần đi bộ bằng phẳng (~3–4 kcal/phút). 10 phút cầu thang = tương đương 20–25 phút đi bộ về kcal. Cường độ vừa phải cũng tạo EPOC nhỏ — tiếp tục đốt thêm 15–30 phút sau khi dừng.',
    detail: 'Cầu thang thay thang máy là "habit swap" hiệu quả nhất: không tốn thêm thời gian (thang máy thường chờ lâu hơn leo 1–2 tầng), tăng NEAT đáng kể và tốt hơn cho tim mạch. Hai lần leo cầu thang mỗi ngày trong 1 năm = giảm ~1–2 kg mỡ không cần thay đổi gì khác.',
    details: [
      'Kcal/phút so sánh: đi bộ bằng phẳng ~3–4 kcal/phút, leo cầu thang ~8–10 kcal/phút, chạy bộ nhẹ ~10–12 kcal/phút. Leo cầu thang nằm giữa đi bộ và chạy bộ về cường độ — hiệu quả hơn nhiều so với bước đi bằng.',
      'Cơ bắp sử dụng: leo cầu thang kích hoạt quadriceps (cơ tứ đầu đùi), glutes (mông), hamstrings (đùi sau), calf (bắp chân) và cơ bụng để giữ thăng bằng — gần như full lower body workout ở cường độ thấp-vừa.',
      'EPOC (afterburn) nhỏ: cầu thang đủ cường độ để tạo EPOC nhỏ — cơ thể tiếp tục đốt thêm 10–30 kcal trong 15–30 phút sau khi dừng để phục hồi nhịp tim và oxy. Đi bộ bằng không có hiệu ứng này.',
      'Thực hiện thế nào: 1–2 tầng × 2–3 lần/ngày = ~5–10 phút leo cầu thang = 40–80 kcal thêm. Không cần leo liên tục — chia nhỏ trong ngày vẫn hiệu quả. Nếu làm việc tầng 10, leo đến tầng 5 và đi thang máy nốt cũng được.',
      'Lợi ích tim mạch: nghiên cứu Harvard Alumni cho thấy leo cầu thang thường xuyên giảm nguy cơ tử vong tim mạch 20–30% — hiệu quả hơn nhiều so với kcal đốt gợi ý. Tim mạch được cải thiện ngay cả khi cường độ thấp nếu thực hiện đều đặn.',
      'Làm quen dần nếu khó thở: nếu leo 2 tầng đã mệt, đó là tín hiệu tim mạch đang yếu — càng cần leo cầu thang hơn. Bắt đầu với 1 tầng × 3 lần/ngày, tăng dần. Khó thở sẽ giảm trong 2–4 tuần.',
    ],
    points: [
      { icon: '⚡', label: '8–10x so với đi bằng', note: 'Cùng thời gian, leo cầu thang đốt nhiều kcal hơn đi bộ 8–10 lần' },
      { icon: '🦵', label: 'Full lower body', note: 'Quad + glutes + hamstring + calf — gần như tập chân cường độ nhẹ' },
      { icon: '⏱️', label: 'Không tốn thêm thời gian', note: 'Thang máy chờ lâu hơn leo 1–2 tầng — thực ra còn nhanh hơn' },
      { icon: '❤️', label: '-20–30% nguy cơ tim mạch', note: 'Harvard Alumni Study — hiệu quả hơn nhiều so với kcal đốt gợi ý' },
    ],
  },
  {
    activity: 'Dọn nhà 30 phút', kcal: '+80–120', icon: '🧹',
    color: '#f59e0b', rgb: '245,158,11',
    title: 'Dọn Nhà 30 Phút',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dọn nhà 30 phút đốt 80–120 kcal — tương đương đi bộ 25–35 phút. Quan trọng hơn, dọn nhà kết hợp nhiều chuyển động: cúi nhặt, đứng dậy, duỗi người, di chuyển đồ — NEAT "có chất lượng" hơn chỉ đi bộ về đa dạng chuyển động.',
    detail: '"Domestic NEAT" — năng lượng đốt qua các hoạt động nhà — hay bị underestimate vì không mang tính "tập luyện". Người làm nội trợ nhiều thường có NEAT cao hơn người tập gym nhưng ít di chuyển trong ngày. NEAT không phân biệt nguồn gốc.',
    details: [
      'Kcal theo hoạt động cụ thể (người 70kg): Lau sàn/hút bụi: 4–5 kcal/phút, Nấu ăn đứng: 2–3 kcal/phút, Giặt và phơi quần áo: 2–3 kcal/phút, Dọn nhà bếp: 3–4 kcal/phút, Cắt cỏ/làm vườn: 5–6 kcal/phút.',
      'MET (Metabolic Equivalent of Task): lau sàn MET ~3.5, hút bụi MET ~3.3, nấu ăn MET ~2.5. Để so sánh: đi bộ nhẹ MET ~3.0, yoga MET ~2.5. Dọn nhà năng động ngang bằng các bài tập nhẹ.',
      'Lợi ích kép: vừa tăng NEAT vừa làm việc nhà xong. "Productive movement" — chuyển động có mục đích kép — tăng cả NEAT lẫn cảm giác hoàn thành. Nghiên cứu cho thấy nhà gọn gàng cũng giảm cortisol và tăng tập trung.',
      'Batch housework: gom các việc nhà vào 1–2 phiên dài hơn thay vì làm lẻ tẻ từng thứ. 30 phút dọn nhà tích cực > 6 lần làm mỗi thứ 5 phút rải rác về kcal, vì cơ thể cần "warm up" trước khi đốt calo hiệu quả.',
      'Cường độ quan trọng hơn thời gian: lau sàn kỹ với lực mạnh hơn tốt hơn lau nhẹ lâu hơn về kcal. Thêm âm nhạc nhanh để tăng tốc độ di chuyển khi dọn nhà — nghiên cứu cho thấy nhạc tempo cao tăng cường độ hoạt động tự nhiên.',
      'Domestic NEAT tổng tháng: 30 phút dọn nhà × 20 ngày/tháng = 1.600–2.400 kcal/tháng — tương đương 4–6 buổi gym. Người xem nhà cửa là "bài tập" thực sự đang làm đúng.',
    ],
    points: [
      { icon: '🔄', label: 'Đa dạng chuyển động', note: 'Cúi + duỗi + di chuyển đồ — NEAT có chất lượng hơn chỉ đi bộ' },
      { icon: '📊', label: 'MET 3–4.5', note: 'Ngang bằng đi bộ nhẹ về cường độ chuyển hóa' },
      { icon: '✅', label: 'Lợi ích kép', note: 'Tăng NEAT + nhà gọn gàng + giảm cortisol — 1 hoạt động 3 lợi ích' },
      { icon: '🎵', label: 'Nhạc nhanh tăng cường độ', note: 'Tempo cao → chuyển động nhanh hơn tự nhiên → kcal cao hơn' },
    ],
  },
  {
    activity: 'Đi bộ sau 3 bữa ăn (5+10+15p)', kcal: '+80–120', icon: '🍽️',
    color: '#84cc16', rgb: '132,204,22',
    title: 'Đi Bộ Sau 3 Bữa Ăn',
    img: 'https://images.unsplash.com/photo-1499803270242-467f7b8cffcd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đi bộ nhẹ 10–15 phút sau bữa ăn giảm glucose peak 30–50% — lợi ích lớn hơn nhiều so với 80–120 kcal đốt được. Cơ bắp hoạt động hấp thụ glucose trực tiếp mà không cần insulin (GLUT4 mechanism) — giảm spike đường huyết hiệu quả nhất và cải thiện insulin sensitivity dài hạn.',
    detail: 'Sau bữa ăn 15–30 phút là "thời điểm vàng" để vận động nhẹ: glucose từ thức ăn đang đổ vào máu và cơ bắp đang cần nhiên liệu nhất. 3 lần đi bộ nhỏ (5+10+15 phút) phân phối lợi ích đều nhau trong ngày thay vì 1 buổi tập dài.',
    details: [
      'GLUT4 mechanism: khi cơ bắp co rút khi đi bộ, GLUT4 protein di chuyển lên bề mặt tế bào cơ và hấp thụ glucose từ máu trực tiếp — không cần insulin. Cơ chế này đặc biệt quan trọng với người kháng insulin hoặc tiểu đường type 2.',
      'Glucose peak reduction: nghiên cứu DiPietro et al. (Diabetes Care, 2013): 15 phút đi bộ nhẹ sau mỗi bữa ăn giảm glucose peak tốt hơn 1 lần đi bộ 45 phút vào buổi sáng — mặc dù tổng thời gian tương đương. Timing quan trọng hơn duration.',
      'Sau bữa sáng (5 phút): buổi sáng insulin sensitivity tự nhiên cao nhất — 5 phút đi bộ nhẹ đủ để tận dụng thời điểm này và kết hợp với lấy ánh sáng sáng sớm.',
      'Sau bữa trưa (10 phút): đây là bữa ăn thường có nhiều carb nhất — 10 phút đi bộ sau trưa cũng giảm "buồn ngủ sau ăn" do ổn định đường huyết và giảm adenosine tích lũy.',
      'Sau bữa tối (15 phút): bữa tối gần với giờ ngủ — đường huyết cao trước ngủ ảnh hưởng đến sleep quality. 15 phút đi bộ nhẹ sau tối giúp glucose ổn định hơn trước khi ngủ và cải thiện giấc ngủ.',
      'Ai nên đặc biệt chú ý: người tiền đái tháo đường, kháng insulin, hay buồn ngủ sau ăn, hoặc muốn giảm mỡ bụng. Post-meal walking là can thiệp đơn giản và hiệu quả nhất cho nhóm này, theo nhiều hướng dẫn y khoa hiện đại.',
    ],
    points: [
      { icon: '🩸', label: 'Glucose peak -30–50%', note: 'Cơ bắp hấp thụ glucose trực tiếp khi di chuyển — không cần insulin' },
      { icon: '⏰', label: 'Thời điểm vàng 15–30 phút sau ăn', note: 'Glucose đang vào máu — vận động ngay khi cơ thể cần nhiên liệu nhất' },
      { icon: '🔬', label: 'GLUT4 mechanism', note: 'Protein GLUT4 bề mặt tế bào cơ hút glucose trực tiếp khi co rút' },
      { icon: '🌙', label: 'Bữa tối + 15 phút = ngủ tốt hơn', note: 'Glucose ổn định trước ngủ → ít gián đoạn giấc ngủ hơn' },
    ],
  },
  {
    activity: 'Fidgeting/đung đưa chân', kcal: '+20–50', icon: '💫',
    color: '#8b5cf6', rgb: '139,92,246',
    title: 'Fidgeting — Vận Động Bồn Chồn',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Fidgeting (đung đưa chân, gõ ngón tay, thay đổi tư thế liên tục) đốt 20–350 kcal/ngày — biên độ cực lớn tùy người. Nghiên cứu Levine (Mayo Clinic) cho thấy người hay fidget tự nhiên ít có xu hướng béo phì hơn và NEAT cao hơn đáng kể so với người ngồi yên hoàn toàn.',
    detail: 'Fidgeting không phải thói quen xấu về mặt sinh lý — nó là tín hiệu NEAT tự nhiên mà cơ thể tự điều chỉnh. Người bị ép phải "ngồi yên" trong thời gian dài thực ra đang ức chế một cơ chế điều tiết năng lượng tự nhiên. Không thể "học" fidgeting — nhưng có thể tạo điều kiện cho nó.',
    details: [
      'Nghiên cứu Levine 1999 (Science): 16 người được cho ăn thêm 1.000 kcal/ngày trong 8 tuần. Người tăng cân ít nhất tự nhiên tăng fidgeting nhiều hơn để "phóng thích" năng lượng dư. Người ngồi yên hoàn toàn tích trữ nhiều mỡ hơn. NEAT — bao gồm fidgeting — là hệ thống kiểm soát cân nặng tự nhiên.',
      'Biên độ 20–350 kcal: người hay bồn chồn, đung đưa chân, thay đổi tư thế liên tục có thể đốt thêm ~300–350 kcal/ngày. Người ngồi yên hoàn toàn chỉ có ~20–50 kcal từ các chuyển động không thể tránh. Đây là 1 trong những yếu tố tạo ra "NEAT gap" giữa người dễ tăng và khó tăng cân.',
      'Không thể "học" fidgeting một cách nhân tạo: fidgeting là phản xạ tự động của hệ thần kinh, không thể fake liên tục. Cố ý đung đưa chân khi nhớ không giống với fidgeting tự nhiên. Tuy nhiên có thể tạo điều kiện cho nó.',
      'Fidget tools có tác dụng không? Fidget spinner, fidget cube, bóng bóp tay: có tác dụng nhỏ (~20–40 kcal/ngày) và chủ yếu giúp tập trung hơn là đốt calo. Under-desk elliptical hoặc bàn pedal hiệu quả hơn về kcal (~50–100 kcal/giờ).',
      'Under-desk elliptical: thiết bị đạp nhẹ dưới bàn khi ngồi làm việc — tốc độ chậm (20–30 rpm) đủ để đốt 50–80 kcal/giờ mà không ảnh hưởng đến công việc yêu cầu ngồi yên. Hiệu quả hơn nhiều so với fidget thông thường.',
      'Body signal — không phải bad habit: nếu bạn hay bồn chồn, không thể ngồi yên — đó là cơ thể cần vận động hơn. Đứng dậy, đi bộ ngắn, hay chuyển sang môi trường năng động hơn có thể giải quyết gốc rễ hơn là ép bản thân ngồi yên.',
    ],
    points: [
      { icon: '📊', label: '20–350 kcal/ngày', note: 'Biên độ lớn nhất trong NEAT — tùy mức độ bồn chồn tự nhiên' },
      { icon: '🔬', label: 'Levine 1999 — Mayo Clinic', note: 'NEAT tự tăng khi ăn dư là cơ chế chống tích mỡ tự nhiên' },
      { icon: '🚫', label: 'Không thể fake được', note: 'Fidgeting là reflex thần kinh — không giả lập liên tục được' },
      { icon: '⚙️', label: 'Under-desk elliptical', note: '+50–80 kcal/giờ khi làm việc — hiệu quả hơn fidget tools thông thường' },
    ],
  },
];

const OFFICE_HACKS = [
  { hack: 'Timer 45 phút', detail: 'Dùng app hoặc đồng hồ. Sau 45 phút: đứng dậy, đi lấy nước, xoay vai 30 giây rồi ngồi lại.' },
  { hack: 'Bình nước 0.5L', detail: 'Đặt bình nước nhỏ (không phải 1.5L) để phải đứng dậy đổ thêm nước thường xuyên hơn.' },
  { hack: 'Họp đứng hoặc đi bộ', detail: 'Cuộc họp 1-1 hoặc cuộc gọi điện thoại: đứng dậy hoặc đi bộ chậm thay vì ngồi.' },
  { hack: 'Printer ở tầng khác', detail: 'Nếu có thể, đặt máy in, máy pha cà phê ở chỗ cần đi bộ thêm.' },
  { hack: 'Cầu thang thay thang máy', detail: 'Chỉ cần 1–2 tầng, 2–3 lần/ngày. Nhỏ nhưng tích lũy đáng kể.' },
  { hack: 'Lunch walk 10 phút', detail: 'Đi bộ 10 phút sau ăn trưa. Tỉnh táo + ổn định đường huyết + tăng NEAT.' },
];

const STEP_GOALS = [
  { profile: 'Ít vận động (dưới 3.000 bước)', goal: 'Tăng 1.000 bước so với nền', tip: 'Đừng nhảy ngay lên 10.000. Tăng dần.' },
  { profile: 'Trung bình (3.000–6.000)', goal: 'Tăng 1.000–2.000 bước/tuần', tip: 'Thêm 1 lần đi bộ 10 phút mỗi ngày.' },
  { profile: 'Cơ bản (6.000–8.000)', goal: 'Duy trì + tăng lên 8.000–10.000', tip: 'Thêm bước sau bữa tối.' },
  { profile: 'Tốt (8.000–10.000+)', goal: 'Duy trì + tối ưu chất lượng', tip: 'Tập trung phân bổ đều trong ngày.' },
];

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

function NeatModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <div className="absolute bottom-5 right-6 text-2xl font-black tabular-nums"
            style={{ color: item.color, textShadow: `0 0 20px rgba(${item.rgb},0.6)` }}>{item.pct}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.title}</h2>
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

export default function LifestyleNeatPage() {
  const [checks, setChecks] = useState({});
  const [teeIdx, setTeeIdx] = useState(null);
  const [activityIdx, setActivityIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-neat-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cNeatSpin { to { --c-neat-angle: 360deg; } }
      .c-neat-ring {
        background: conic-gradient(from var(--c-neat-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cNeatSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const checkCount = [0,1,2,3,4].filter(i => checks[i]).length;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-emerald-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🚶
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">NEAT & Chống Ngồi Lâu</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C3 — Non-Exercise Activity Thermogenesis
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            NEAT là toàn bộ vận động ngoài buổi tập: đi bộ, đứng dậy, làm việc nhà, di chuyển trong ngày. Với người bận rộn, NEAT có thể quan trọng không kém buổi tập gym.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-neat-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop"
              alt="NEAT đi bộ" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Đi bộ · Đứng dậy · Vận động rải rác
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* NEAT vs TEE */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Chiếm Bao Nhiêu Trong Ngày?</h2>
        <p className="text-muted text-lg mb-6">Tổng năng lượng tiêu thụ trong ngày (TDEE) gồm 4 thành phần chính.</p>
        <div className="space-y-3">
          {NEAT_VS_TEE.map((item, i) => (
            <div key={i}
              className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.2)` }}
              onClick={() => setTeeIdx(i)}>
              <div className="w-16 text-center shrink-0">
                <div className="text-xl font-bold" style={{ color: item.color }}>{item.pct}</div>
              </div>
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{item.component}</div>
                <div className="text-muted text-sm">{item.desc}</div>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.07)`, border: `1px solid rgba(${RGB},0.2)` }}>
          <p className="text-lg text-muted"><strong style={{ color: COLOR }}>Điểm mấu chốt:</strong> Buổi tập gym chỉ chiếm 5–10% tổng năng lượng. NEAT chiếm 15–30%. Người năng động (đi lại nhiều) có NEAT cao hơn người ngồi nhiều tới 500–700 kcal/ngày.</p>
        </div>
      </RevealBlock>

      {/* NEAT activities */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Tiêu Thụ Bao Nhiêu kcal?</h2>
        <p className="text-muted text-lg mb-6">Các hoạt động NEAT phổ biến và năng lượng tiêu thụ ước tính.</p>
        <div className="grid gap-3">
          {NEAT_ACTIVITIES.map((a, i) => (
            <div key={i}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${a.rgb},0.05)`, border: `1px solid rgba(${a.rgb},0.18)` }}
              onClick={() => setActivityIdx(i)}>
              <span className="text-2xl shrink-0">{a.icon}</span>
              <span className="text-base font-semibold text-text flex-1">{a.activity}</span>
              <span className="text-base font-bold tabular-nums shrink-0" style={{ color: a.color }}>{a.kcal} kcal</span>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: a.color, background: `rgba(${a.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 2-minute rule */}
      <RevealBlock className="mb-12">
        <div className="p-6 rounded-2xl" style={{ background: `rgba(${RGB},0.08)`, border: `1px solid rgba(${RGB},0.25)` }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR }}>⏱ Quy Tắc Đứng Dậy 2 Phút</h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Ngồi liên tục hơn 90 phút làm giảm lưu thông máu, tăng căng cơ và giảm trao đổi chất. Nghiên cứu cho thấy ngắt quãng mỗi 45–60 phút có hiệu quả hơn tập gym 1 tiếng nếu phần còn lại của ngày bạn ngồi hoàn toàn.
          </p>
          <div className="grid gap-2">
            {['Đứng dậy và đi lấy nước', 'Xoay vai × 10 + xoay cổ × 8', 'Vươn người lên trần + bend forward', 'Đi bộ 1 vòng quanh bàn làm việc', 'Calf raise × 15 khi đứng chờ'].map((action, i) => (
              <div key={i} className="flex items-center gap-2 text-lg">
                <span style={{ color: COLOR }}>→</span>
                <span className="text-muted">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Office hacks */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>6 Cách Tăng NEAT Cho Dân Văn Phòng</h2>
        <div className="grid gap-3">
          {OFFICE_HACKS.map((h, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="font-semibold text-text text-lg mb-1">{h.hack}</div>
              <p className="text-muted text-base leading-relaxed">{h.detail}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Step goals */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mục Tiêu Bước Theo Cấp Độ</h2>
        <p className="text-muted text-lg mb-6">Không ép tất cả lên 10.000 bước. Tăng từ nền hiện tại, không nhảy vọt.</p>
        <div className="space-y-3">
          {STEP_GOALS.map((g, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text text-lg">{g.profile}</span>
                <span className="text-base font-bold" style={{ color: COLOR }}>{g.goal}</span>
              </div>
              <p className="text-base text-muted">{g.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily NEAT checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>NEAT Checklist Hằng Ngày</h2>
        <div className="space-y-3 mb-4">
          {['Đứng dậy sau mỗi 45–60 phút ngồi ít nhất 1 lần', 'Đi bộ sau ít nhất 1 bữa ăn hôm nay', 'Đạt mục tiêu bước cá nhân', 'Có ít nhất 1 lần vận động ngắn trong giờ làm việc', 'Không ngồi liên tục hơn 90 phút'].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                style={{ background: checks[i] ? COLOR : 'transparent', borderColor: COLOR }}>
                {checks[i] && <span className="text-black text-base font-bold">✓</span>}
              </div>
              <span className="text-lg text-muted group-hover:text-text transition-colors">{item}</span>
            </label>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: `rgba(${RGB},0.15)` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${checkCount / 5 * 100}%`, background: COLOR }} />
        </div>
        <p className="text-base text-muted">{checkCount}/5 — {checkCount >= 4 ? 'Xuất sắc! NEAT cao nhất trong ngày' : checkCount >= 3 ? 'Tốt' : 'Đang xây dựng thói quen'}</p>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/morning" className="text-muted hover:text-emerald-400 transition-colors text-lg">← Routine Sáng</Link>
        <Link to="/pillar/c/recovery" className="text-lg font-semibold" style={{ color: COLOR }}>Phục Hồi →</Link>
      </div>

      {/* ── NEAT activities modal — outside all RevealBlocks ── */}
      {activityIdx !== null && (
        <NeatModal
          item={NEAT_ACTIVITIES[activityIdx]}
          idx={activityIdx}
          total={NEAT_ACTIVITIES.length}
          onClose={() => setActivityIdx(null)}
          onPrev={() => setActivityIdx(i => Math.max(0, i - 1))}
          onNext={() => setActivityIdx(i => Math.min(NEAT_ACTIVITIES.length - 1, i + 1))}
          hasPrev={activityIdx > 0}
          hasNext={activityIdx < NEAT_ACTIVITIES.length - 1}
        />
      )}

      {/* ── TDEE components modal — outside all RevealBlocks ── */}
      {teeIdx !== null && (
        <NeatModal
          item={NEAT_VS_TEE[teeIdx]}
          idx={teeIdx}
          total={NEAT_VS_TEE.length}
          onClose={() => setTeeIdx(null)}
          onPrev={() => setTeeIdx(i => Math.max(0, i - 1))}
          onNext={() => setTeeIdx(i => Math.min(NEAT_VS_TEE.length - 1, i + 1))}
          hasPrev={teeIdx > 0}
          hasNext={teeIdx < NEAT_VS_TEE.length - 1}
        />
      )}
    </div>
  );
}
