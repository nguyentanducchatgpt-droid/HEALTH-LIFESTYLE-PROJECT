import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  {
    hack: 'Timer 45 phút', icon: '⏱️', color: '#f97316', rgb: '249,115,22',
    title: 'Timer 45 Phút — Ngắt Quãng Có Kỷ Luật',
    img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngồi liên tục >60 phút tắt LPL enzyme, tăng cortisol và làm cứng cột sống. Timer 45 phút là "minimum viable break" — đủ để vào deep focus mà không trả giá sinh lý cho ngồi dài. Khoa học nhận thức cho thấy nghỉ ngắn định kỳ không phá vỡ flow — ngược lại, giúp duy trì sự tập trung lâu dài hơn.',
    detail: '45 phút là điểm ngọt giữa Pomodoro (25 phút) và Ultradian rhythm (90 phút). Đủ để vào trạng thái tập trung sâu nhưng chưa đủ lâu để cơ thể bắt đầu trả giá sinh lý. Break 2 phút đứng dậy và đi là đủ — không cần ngủ hay rời khu vực làm việc.',
    detail_short: 'Dùng app hoặc đồng hồ. Sau 45 phút: đứng dậy, đi lấy nước, xoay vai 30 giây rồi ngồi lại.',
    details: [
      'LPL (Lipoprotein Lipase) enzyme bị ức chế sau 20–30 phút ngồi. Timer 45 phút đảm bảo LPL được tái kích hoạt ít nhất mỗi giờ — giữ cơ bắp trong trạng thái chuyển hóa active suốt ngày làm việc.',
      'Pomodoro Technique (Francesco Cirillo): 25 phút tập trung + 5 phút nghỉ. Timer 45 phút là biến thể dài hơn phù hợp với công việc cần deep focus. Cả hai đều ủng hộ ngắt quãng định kỳ thay vì làm liên tục.',
      'Ultradian rhythm: não tự nhiên có chu kỳ tập trung ~90–120 phút rồi cần nghỉ ngơi. Break 45 phút đảm bảo bạn nghỉ trước khi đến điểm suy giảm nhận thức — không phải sau khi đã mất tập trung.',
      'Break chất lượng vs break dài: nghiên cứu Microsoft Research cho thấy 10 phút nghỉ bao gồm thư giãn nhẹ hiệu quả hơn 20 phút nhìn điện thoại. Timer nhắc đứng dậy 2 phút thực chất > nhìn mạng xã hội 5 phút.',
      'App recommendations: Forest (gamification cây xanh), Be Focused (Pomodoro), hoặc đơn giản là tính năng timer mặc định của điện thoại. Quan trọng là timer phát tiếng — không dựa vào nhớ manual.',
      '"Never miss twice" rule: nếu bỏ lỡ 1 timer (đang họp, đang trong flow quan trọng), không sao — nhưng không để bỏ 2 lần liên tiếp. Tính liên tục quan trọng hơn độ chính xác tuyệt đối.',
    ],
    points: [
      { icon: '🔥', label: 'LPL reset mỗi 45 phút', note: 'Enzyme đốt mỡ không bị tắt quá lâu — chuyển hóa giữ ở mức active' },
      { icon: '🧠', label: 'Trước điểm suy giảm nhận thức', note: 'Break trước khi não đến ngưỡng — duy trì chất lượng focus lâu hơn' },
      { icon: '⏰', label: '2 phút là đủ', note: 'Đứng dậy + đi 20 bước đủ để reset sinh lý — không cần rời bàn lâu' },
      { icon: '📱', label: 'App > ý chí', note: 'Timer tự động thắng mọi cố gắng "nhớ" manual — dùng công nghệ' },
    ],
  },
  {
    hack: 'Bình nước 0.5L', icon: '🍶', color: '#0ea5e9', rgb: '14,165,233',
    title: 'Bình Nước 0.5L — NEAT Hack Kép',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bình nước nhỏ 0.5L thay vì 1.5L tạo ra 3× nhiều lần đứng dậy tự nhiên — không cần nhớ, không cần alarm. Mỗi lần đứng dậy đổ nước: 2 phút đứng + 20–40 bước + LPL reactivation. Nhân với 6–8 lần/ngày = 12–16 phút đứng và vài trăm bước hoàn toàn "miễn phí".',
    detail: 'Đây là "friction engineering" — thiết kế môi trường để hành vi tốt xảy ra tự động, không cần ý chí. Bình nhỏ tạo ra rào cản nhỏ (phải đứng dậy đổ thêm) biến thành lợi ích lớn (NEAT tăng, hydration đều đặn). Nguyên lý tương tự như thiết kế cầu thang đẹp hơn thang máy để khuyến khích leo cầu thang.',
    detail_short: 'Đặt bình nước nhỏ (không phải 1.5L) để phải đứng dậy đổ thêm nước thường xuyên hơn.',
    details: [
      'Toán học đơn giản: bình 1.5L → 1–2 lần đứng dậy/ngày. Bình 0.5L → 5–6 lần đứng dậy/ngày. Chênh lệch 4–5 lần × 2 phút đứng = 8–10 phút đứng thêm/ngày hoàn toàn tự động không cần nhớ.',
      'Vị trí bình chiến lược: đặt bình ở nơi cần đứng dậy và đi 10–20 bước (bếp, quầy pha cà phê, phòng khác) thay vì ngay cạnh bàn. Mỗi lần lấy nước = 20–40 bước + đứng dậy + LPL reset.',
      'Hydration đều đặn vs uống nhiều 1 lần: uống liên tục nhỏ giọt suốt ngày tốt hơn uống 500ml 1 lần về hấp thụ. Thận hấp thụ nước hiệu quả nhất khi nhận đều đặn — không bị overload 1 lần rồi bài tiết ngay.',
      'Thiếu nước 1–2% (500–1.000ml với người 70kg) đã đo được giảm nhận thức: tập trung, tốc độ xử lý, trí nhớ ngắn hạn đều giảm. Bình nhỏ = nhắc nhở hydration tự động, không cần app uống nước.',
      'Kết hợp micro-movement: mỗi lần đứng dậy đổ nước, thêm 5 calf raise hoặc xoay vai 5 vòng trước khi quay lại bàn. Lấy nước trở thành "movement trigger" — một hành động nhỏ kéo theo nhiều lợi ích.',
      'Cost-benefit: bình nước 0.5L giá ~50.000–200.000đ. Lợi ích: 8–12 phút đứng thêm/ngày × 250 ngày làm việc/năm = 33–50 giờ đứng/năm thêm, hoàn toàn không cần ý chí. ROI cực cao.',
    ],
    points: [
      { icon: '⚙️', label: 'Friction engineering', note: 'Thiết kế môi trường để hành vi tốt xảy ra tự động — không cần ý chí' },
      { icon: '💧', label: '6× đứng dậy/ngày', note: 'Bình 0.5L hết nhanh → đứng dậy 5–6 lần/ngày tự nhiên thay vì 1–2 lần' },
      { icon: '🧠', label: 'Hydration đều > nhiều 1 lần', note: 'Thận hấp thụ tốt hơn khi nhận liên tục — không bị overload rồi thải' },
      { icon: '🎯', label: 'Movement trigger', note: 'Kết hợp 5 calf raise mỗi lần lấy nước — biến thói quen nhỏ thành lớn' },
    ],
  },
  {
    hack: 'Họp đứng hoặc đi bộ', icon: '🗣️', color: '#10b981', rgb: '16,185,129',
    title: 'Walking Meeting — Họp Khi Di Chuyển',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Walking meetings đã được Jeff Bezos, Steve Jobs và Barack Obama sử dụng không phải vì trend — mà vì có bằng chứng: đi bộ tăng creative thinking lên 81% (Stanford, 2014), giảm độ dài meeting và tăng quyết đoán trong ra quyết định. Họp ngồi khuyến khích suy nghĩ thụ động; họp đứng/đi khuyến khích suy nghĩ nhanh hơn.',
    detail: 'Meeting 1-1 hoặc cuộc gọi điện thoại là thời điểm hoàn hảo để đứng dậy và đi — không cần nhìn màn hình, không cần ghi chú, chỉ cần lắng nghe và nói. "Walk and talk" biến thời gian meeting thành NEAT mà không ảnh hưởng chất lượng.',
    detail_short: 'Cuộc họp 1-1 hoặc cuộc gọi điện thoại: đứng dậy hoặc đi bộ chậm thay vì ngồi.',
    details: [
      'Stanford 2014 (Oppezzo & Schwartz): đi bộ tăng divergent thinking (sáng tạo, brainstorm) lên 81% so với ngồi. Convergent thinking (logic chặt chẽ) không bị ảnh hưởng — nghĩa là walking meetings tốt cho brainstorm và quyết định sáng tạo.',
      'Meeting ngắn hơn khi đứng: nghiên cứu của Washington University cho thấy stand-up meeting ngắn hơn 34% so với sit-down meeting về cùng chủ đề, mà không giảm chất lượng quyết định. Đứng = ít nói vòng vo hơn.',
      'Phone calls là cơ hội vàng: 80–90% cuộc gọi điện thoại không cần nhìn màn hình. Đứng dậy đi bộ trong khi nghe = thêm 200–500 bước/cuộc gọi 5–10 phút. Người hay gọi điện có thể thêm 1.000–2.000 bước/ngày chỉ từ phone walks.',
      'Setup walking meeting: thông báo trước "meeting này chúng ta sẽ đi bộ" — hầu hết mọi người phản ứng tích cực. Nếu cần ghi chú: dùng voice memo trên điện thoại hoặc ghi nhanh sau khi xong.',
      'Không phải tất cả meeting đều phù hợp: presentation với nhiều slides, meeting >4 người, hoặc cuộc họp nhạy cảm (feedback cá nhân) tốt hơn ngồi. Walking meeting phù hợp nhất cho 1-1 brainstorm, check-in nhanh và phone calls.',
      'NEAT tích lũy từ meetings: người có lịch họp nhiều thường than phiền không có thời gian vận động — nhưng nếu 50% meetings là standing/walking, NEAT tăng đáng kể mà không cần thêm thời gian.',
    ],
    points: [
      { icon: '🧠', label: 'Sáng tạo tăng 81%', note: 'Stanford 2014: đi bộ tăng divergent thinking gần gấp đôi so với ngồi' },
      { icon: '⏱️', label: 'Meeting ngắn hơn 34%', note: 'Stand-up meeting ngắn hơn và ít vòng vo hơn — hiệu quả hơn sit-down' },
      { icon: '📞', label: 'Phone calls = bước đi miễn phí', note: '5–10 phút phone walk = 200–500 bước không cần thêm thời gian' },
      { icon: '🚫', label: 'Không phải tất cả meeting', note: 'Phù hợp 1-1 + brainstorm + phone. Không dùng cho presentation hay feedback nhạy cảm' },
    ],
  },
  {
    hack: 'Printer ở tầng khác', icon: '🖨️', color: '#f59e0b', rgb: '245,158,11',
    title: 'Artificial Destinations — Tạo Lý Do Phải Di Chuyển',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Artificial destinations" — tạo ra các điểm đến nhân tạo đòi hỏi phải di chuyển — là chiến lược NEAT hiệu quả nhất cho văn phòng. Máy in ở tầng khác, cà phê ở tầng trên, gặp trực tiếp thay vì nhắn Slack. Mỗi "trip" 2–3 phút × 5–8 lần/ngày = 10–24 phút đi bộ và hàng trăm bước không cần thêm thời gian tập.',
    detail: 'Nguyên lý "friction by design" ngược lại — thay vì giảm ma sát cho hành vi xấu (lười vận động), tăng ma sát nhẹ để buộc vận động tốt xảy ra tự nhiên. Đặt mọi thứ cần dùng thường xuyên ở nơi đòi hỏi phải đứng dậy và đi.',
    detail_short: 'Nếu có thể, đặt máy in, máy pha cà phê ở chỗ cần đi bộ thêm.',
    details: [
      'Nguyên lý "Destination walking": mỗi lần đến một điểm đến có mục đích (lấy tài liệu, pha cà phê, gặp đồng nghiệp) bạn không ý thức rằng mình đang "tập thể dục" — đây là lý do hiệu quả hơn cố tình đi bộ thêm theo ý chí.',
      'Máy in tầng khác: mỗi lần in = leo/xuống 1 tầng + đi bộ đến máy in + về. Tổng ~3–5 phút và 100–200 bước. In 3–5 lần/ngày = 9–25 phút di chuyển thêm tự nhiên. Nếu không cần in thường, chọn máy in xa hơn trên cùng tầng.',
      'Cà phê ở tầng khác: pha cà phê/trà ở bếp tầng khác thay vì bếp ngay cạnh bàn. Trip 5–7 phút × 2 lần/ngày = 10–14 phút đi bộ thêm chỉ từ thói quen pha cà phê.',
      'Gặp trực tiếp thay vì nhắn tin: thay vì Slack/Zalo cho đồng nghiệp ngồi cách 10–20m, đứng dậy đến hỏi trực tiếp. Bonus: giao tiếp mặt đối mặt tốt hơn cho mối quan hệ và tránh hiểu nhầm. "Destination social" vừa NEAT vừa cải thiện team dynamics.',
      'Thiết kế lại workspace cá nhân: đặt sạc điện thoại ở xa bàn, tài liệu cần thường xuyên ở kệ đứng dậy mới lấy được, đặt mọi thứ "cần tìm" ở nơi đòi hỏi phải đứng dậy. Mỗi micro-trip là NEAT.',
      'Cộng dồn nghiêm túc: 8–10 artificial destinations × 3 phút mỗi trip = 24–30 phút đi bộ/ngày. Người làm văn phòng 8 giờ có thể dễ dàng thêm 2.000–3.000 bước/ngày chỉ bằng cách tái thiết kế môi trường — không cần thêm 1 phút "tập thể dục".',
    ],
    points: [
      { icon: '🗺️', label: 'Friction by design', note: 'Tăng ma sát nhẹ để buộc vận động xảy ra tự nhiên — không cần ý chí' },
      { icon: '📄', label: 'Mỗi print = 100–200 bước', note: 'Máy in tầng khác biến việc in tài liệu thành NEAT tự động' },
      { icon: '☕', label: 'Cà phê xa = thêm 10 phút/ngày', note: 'Bếp tầng trên thay vì tầng bạn — 2 lần pha cà phê = chuyến đi bộ miễn phí' },
      { icon: '💬', label: 'Gặp mặt > nhắn tin', note: 'Đến chỗ đồng nghiệp hỏi trực tiếp = NEAT + giao tiếp tốt hơn' },
    ],
  },
  {
    hack: 'Cầu thang thay thang máy', icon: '🪜', color: '#8b5cf6', rgb: '139,92,246',
    title: 'Cầu Thang — Habit Swap Hiệu Quả Nhất',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Leo cầu thang đốt ~8–10 kcal/phút so với đi bộ bằng ~3–4 kcal/phút. 1–2 tầng × 3 lần/ngày = ~5 phút leo cầu thang = ~40–50 kcal thêm/ngày. Nhân với 250 ngày làm việc = 10.000–12.500 kcal/năm — tương đương 1,4–1,8 kg mỡ mà không thêm 1 phút tập thể dục. Harvard Alumni Study: leo cầu thang đều giảm nguy cơ tử vong tim mạch 20–30%.',
    detail: '"Habit swap" là thay thế một hành vi trung tính (đi thang máy) bằng hành vi có lợi (leo cầu thang) trong cùng ngữ cảnh — không cần thêm thời gian hay ý chí mới. Đây là chiến lược thay đổi hành vi hiệu quả nhất vì không yêu cầu tạo thói quen mới từ đầu.',
    detail_short: 'Chỉ cần 1–2 tầng, 2–3 lần/ngày. Nhỏ nhưng tích lũy đáng kể.',
    details: [
      'Không tốn thêm thời gian: thang máy có thời gian chờ 30–90 giây + thời gian di chuyển. Leo 1–2 tầng cầu thang thường nhanh bằng hoặc nhanh hơn chờ thang máy. Đây không phải trade-off thời gian — đây là upgrade chất lượng cùng thời gian.',
      'Cơ học cầu thang: leo cầu thang kích hoạt full lower body — quadriceps, glutes, hamstrings, calves — và core để giữ thăng bằng. Cường độ vừa đủ để có EPOC nhỏ (afterburn 10–30 phút sau) mà đi bộ bằng không có.',
      'Tích lũy theo năm: 2 tầng × 3 lần/ngày × 250 ngày = 1.500 tầng/năm. Nghiên cứu tính ra 1.500 tầng/năm = giảm nguy cơ tử vong sớm ~15% — từ thay đổi 3 phút/ngày.',
      'Làm quen dần nếu khó thở: khó thở khi leo 2 tầng là tín hiệu tim mạch yếu — không phải lý do tránh, mà là lý do càng cần leo hơn. Bắt đầu 1 tầng × 1 lần/ngày. Khó thở sẽ giảm trong 2–4 tuần.',
      'Kết hợp với "artificial destination": nếu chọn máy in hoặc cà phê ở tầng khác, tự động leo cầu thang mỗi lần. Hai habit hacks kết hợp = tăng NEAT gấp đôi từ 1 quyết định thiết kế.',
      'Điều kiện không phù hợp: chấn thương đầu gối/hông, mang đồ nặng, late for meeting quan trọng — trong các trường hợp này, đi thang máy là hoàn toàn hợp lý. Mục tiêu là default habit, không phải quy tắc cứng.',
    ],
    points: [
      { icon: '⚡', label: '8–10 kcal/phút', note: 'Leo cầu thang đốt gấp 2.5–3× đi bộ bằng — hiệu quả nhất cho thời gian' },
      { icon: '⏰', label: 'Không tốn thêm thời gian', note: 'Leo 1–2 tầng thường nhanh bằng chờ thang máy — không có trade-off' },
      { icon: '📈', label: '1.500 tầng/năm = -15% tử vong sớm', note: 'Số liệu Harvard Alumni — 3 phút/ngày tích lũy thành lợi ích lớn sau nhiều năm' },
      { icon: '❤️', label: '-20–30% nguy cơ tim mạch', note: 'Harvard Alumni Study — hiệu quả lớn hơn nhiều so với kcal đốt gợi ý' },
    ],
  },
  {
    hack: 'Lunch walk 10 phút', icon: '🍽️', color: '#84cc16', rgb: '132,204,22',
    title: 'Lunch Walk 10 Phút — Cú Double Win Sau Ăn',
    img: 'https://images.unsplash.com/photo-1499803270242-467f7b8cffcd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đi bộ nhẹ 10–15 phút sau bữa trưa giảm glucose spike 30–50% (GLUT4 mechanism), giảm "buồn ngủ sau ăn" nhờ ổn định đường huyết và adenosine, đồng thời thêm 800–1.200 bước NEAT. Nghiên cứu DiPietro 2013 (Diabetes Care): 15 phút đi bộ sau ăn hiệu quả hơn 45 phút đi bộ 1 lần về glucose control 24 giờ.',
    detail: 'Bữa trưa là bữa ăn thường có nhiều carb nhất trong ngày — glucose spike sau trưa cao và kéo dài hơn. 10 phút đi bộ ngay sau khi ăn xong là can thiệp đơn giản nhất để kiểm soát glucose và chống buồn ngủ chiều.',
    detail_short: 'Đi bộ 10 phút sau ăn trưa. Tỉnh táo + ổn định đường huyết + tăng NEAT.',
    details: [
      'GLUT4 mechanism: cơ bắp co rút khi đi bộ kích hoạt protein GLUT4 trên bề mặt tế bào cơ, hút glucose từ máu trực tiếp không cần insulin. Đây là lý do tại sao đi bộ ngay sau ăn (khi glucose đang đổ vào máu) hiệu quả nhất cho glucose control.',
      '"Post-lunch dip" (buồn ngủ sau trưa) có 2 nguyên nhân: glucose spike → crash và adenosine tích lũy trong não buổi chiều. Đi bộ sau ăn giải quyết cả hai: ổn định glucose + tăng máu não rửa adenosine.',
      'DiPietro et al. (Diabetes Care, 2013): 3 lần đi bộ 15 phút sau mỗi bữa ăn kiểm soát glucose 24 giờ tốt hơn 1 lần đi bộ 45 phút buổi sáng — dù tổng thời gian như nhau. Timing sau ăn quan trọng hơn duration.',
      'Ánh sáng mặt trời + đi bộ: đi bộ ngoài trời sau trưa thêm vitamin D, ánh sáng giữa trưa reset circadian rhythm và "visual novelty" cho não — giảm monotony của ngày làm việc. Tất cả trong 10 phút.',
      'Khi nào đi: sau 10–20 phút kể từ khi ăn xong (không phải ngay khi đứng dậy khỏi bàn ăn). Glucose bắt đầu tăng sau ~15–20 phút — đây là thời điểm cơ bắp cần nhiên liệu nhất.',
      'Không có thời gian 10 phút? 5 phút đi bộ cũng có tác dụng đáng kể về glucose. Đi vòng quanh building 1 lần, đi bộ đến chỗ rửa tay xa, leo 2–3 tầng cầu thang — bất kỳ movement nào sau ăn đều tốt hơn ngồi ngay xuống ghế.',
    ],
    points: [
      { icon: '🩸', label: 'Glucose -30–50%', note: 'GLUT4 kích hoạt khi cơ co rút — hút glucose trực tiếp không cần insulin' },
      { icon: '😴', label: 'Chống buồn ngủ chiều', note: 'Ổn định glucose + rửa adenosine = tỉnh táo suốt chiều không cần cà phê' },
      { icon: '☀️', label: 'Ánh sáng + circadian reset', note: 'Đi bộ ngoài trời: vitamin D + nhịp circadian + vitamin tâm trạng' },
      { icon: '⏱️', label: '5 phút cũng có tác dụng', note: 'Không cần đủ 10 phút — bất kỳ movement nào sau ăn đều hơn ngồi ngay' },
    ],
  },
];

const BREAK_MOVES = [
  {
    action: 'Đứng dậy và đi lấy nước',
    icon: '💧', color: '#0ea5e9', rgb: '14,165,233',
    title: 'Đứng Dậy Lấy Nước',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Lấy nước" là NEAT hack kép: vừa ngắt quãng ngồi liên tục (reset LPL enzyme, tăng lưu thông) vừa đảm bảo hydration — thiếu nước 1% đã làm giảm nhận thức 5–10%. Đặt bình nhỏ 0.5L thay vì 1.5L để phải đứng dậy 3× nhiều hơn.',
    detail: 'Đứng dậy lấy nước là micro-habit dễ duy trì nhất vì có "reward" ngay lập tức (được uống nước). Mỗi lần đứng dậy ~2 phút kích hoạt LPL, tăng lưu thông máu và nhắc nhở hydration mà không cần app hay alarm.',
    details: [
      'LPL (Lipoprotein Lipase): enzyme đốt mỡ trong cơ bắp bị tắt sau 20–30 phút ngồi. Đứng dậy lấy nước tái kích hoạt LPL ngay lập tức trong vòng 1–2 phút. Làm điều này 6–8 lần/ngày = LPL hoạt động nhiều hơn đáng kể so với ngồi suốt rồi tập gym 1 tiếng.',
      'Hydration + nhận thức: thiếu nước nhẹ 1–2% (500–1.000ml với người 70kg) giảm sự tập trung, tốc độ xử lý và trí nhớ ngắn hạn có thể đo được. Uống nước đều đặn trong ngày hiệu quả hơn uống nhiều 1 lần.',
      '"Small bottle hack": đặt bình nước 300–500ml trên bàn thay vì bình 1.5L. Khi hết phải đứng dậy đổ thêm — tạo ra 4–6 lần đứng dậy tự nhiên mỗi ngày mà không cần nhớ hay đặt alarm.',
      'Vị trí bình nước chiến lược: đặt bình ở nơi cần đứng dậy và đi 10–20 bước (bếp, quầy pha cà phê, phòng khác) thay vì ngay cạnh bàn — mỗi lần lấy nước = 20–40 bước thêm.',
      'Cộng dồn trong ngày: đứng dậy lấy nước 6 lần × 2 phút = 12 phút đứng + đi bộ nhỏ thêm. Nhỏ nhưng tích lũy 300+ lần/năm — đáng kể về tổng NEAT và đặc biệt tốt cho LPL.',
      'Kết hợp lúc lấy nước: mỗi lần đứng dậy, thêm 5 calf raise hoặc xoay vai 5 vòng trước khi quay lại bàn. Biến lấy nước thành "micro-exercise trigger" — không tốn thêm thời gian.',
    ],
    points: [
      { icon: '🔥', label: 'Tái kích hoạt LPL', note: 'Enzyme đốt mỡ bị tắt sau 20–30 phút ngồi — đứng dậy bật lại' },
      { icon: '🧠', label: '-1% nước = -5–10% nhận thức', note: 'Lấy nước nhắc hydration đều đặn — hiệu quả hơn uống nhiều 1 lần' },
      { icon: '🍶', label: 'Bình nhỏ 0.5L', note: 'Hết sớm hơn → đứng dậy 3× nhiều hơn tự nhiên' },
      { icon: '🎯', label: 'Kết hợp micro-exercise', note: 'Thêm 5 calf raise mỗi lần lấy nước — không tốn thêm thời gian' },
    ],
  },
  {
    action: 'Xoay vai × 10 + xoay cổ × 8',
    icon: '🔄', color: '#f97316', rgb: '249,115,22',
    title: 'Xoay Vai × 10 + Xoay Cổ × 8',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vai và cổ là hai vùng căng cứng nhất sau 45–60 phút ngồi máy tính. Xoay vai 10 vòng ra sau bơm dịch khớp và counteract tư thế vai cúi về trước. Xoay cổ 8 vòng giảm căng cơ ức đòn chũm — nguyên nhân phổ biến nhất của đau đầu do căng thẳng (tension headache).',
    detail: 'Break 2 phút với mobility vai + cổ hiệu quả hơn đứng yên 2 phút hoặc đi bộ nhỏ 2 phút về tác động lên cột sống cổ và vai. Đây là micro-intervention tốt nhất cho dân văn phòng bị đau vai gáy mãn tính.',
    details: [
      'Cơ thang (trapezius) bị co cụm khi vai cúi về trước khi nhìn màn hình — co cứng gây đau vai gáy và nhức đầu. Xoay vai ra sau (backward roll) kéo giãn cơ ngực và kích hoạt rhomboids, counteract pattern này.',
      'Cơ ức đòn chũm (sternocleidomastoid — SCM): cơ cổ lớn nhất, bị căng khi đầu chìa về trước hoặc nghiêng. Căng SCM là nguyên nhân phổ biến nhất của tension headache (đau đầu do căng thẳng) — xoay cổ nhẹ và kéo giãn bên giảm căng hiệu quả.',
      'Thứ tự: xoay vai trước (warm up), sau đó xoay cổ. Xoay cổ khi cơ thang đang căng có thể gây khó chịu — giải phóng cơ thang trước bằng shoulder roll thì xoay cổ dễ dàng hơn.',
      'Kỹ thuật xoay cổ an toàn: xoay chậm, bán kính nhỏ đến vừa. Không gập cổ ra sau tối đa (gây áp lực lên đốt sống cổ). Nếu cảm thấy tiếng kêu lớn hoặc tê bì — giảm bán kính và đến gặp chuyên gia.',
      'Synovial fluid: khớp vai và cổ cần chuyển động để phân phối dịch khớp. Sau 45–60 phút bất động, dịch khớp giảm lưu thông — xoay tròn bơm dịch khớp trở lại đều khắp khớp, giảm cứng và tiếng kêu.',
      'Kết hợp với chin tuck: xoay vai → xoay cổ → chin tuck × 5 = 2 phút break hoàn chỉnh cho đầu/cổ/vai. Ba bài tập này bổ trợ nhau và cover toàn bộ vùng hay bị ảnh hưởng nhất khi làm việc máy tính.',
    ],
    points: [
      { icon: '💪', label: 'Counteract vai cúi về trước', note: 'Shoulder roll ra sau kéo giãn pectoralis + kích hoạt rhomboids' },
      { icon: '🧠', label: 'Giảm tension headache', note: 'Căng SCM là nguyên nhân #1 đau đầu văn phòng — xoay cổ giải phóng' },
      { icon: '💧', label: 'Bơm dịch khớp', note: 'Vai + cổ bất động 45–60 phút → synovial fluid ứ lại → xoay để reset' },
      { icon: '📋', label: 'Vai trước → cổ sau', note: 'Thứ tự đúng: giải phóng trapezius trước → xoay cổ dễ dàng hơn' },
    ],
  },
  {
    action: 'Vươn người lên trần + bend forward',
    icon: '🙆', color: '#10b981', rgb: '16,185,129',
    title: 'Vươn Người + Cúi Gập',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vươn người lên trần (spinal extension) + cúi gập người (spinal flexion) trong 30–60 giây counteract hoàn toàn tư thế ngồi gù. Hai chuyển động ngược chiều bơm dịch vào và ra khỏi đĩa đệm — giữ đĩa đệm khỏe mạnh và giảm nguy cơ lồi đĩa đệm dài hạn.',
    detail: 'Cột sống bị nén khi ngồi — đĩa đệm hấp thụ áp lực trọng lực và tư thế gù. Vươn người (extension) và cúi người (flexion) xen kẽ là cơ chế tự nhiên để "bơm" dinh dưỡng vào đĩa đệm, vì đĩa đệm không có mạch máu trực tiếp.',
    details: [
      'Disc hydration: đĩa đệm không có mạch máu — nhận dinh dưỡng và nước qua cơ chế khuếch tán áp suất. Khi ngồi liên tục, đĩa đệm bị nén → mất nước dần. Extension + flexion xen kẽ tạo áp suất âm "hút" dịch trở lại vào đĩa đệm.',
      'Vươn người lên trần: giơ cả hai tay lên cao hết mức, đứng trên đầu ngón chân nếu được, giữ 5–10 giây. Kéo giãn cột sống, cơ liên sườn, cơ bụng bị co cụm khi ngồi cúi. Mở lồng ngực = thở sâu hơn ngay lập tức.',
      'Bend forward: từ tư thế đứng, cúi người về phía trước để tay chạm đùi hoặc đất (tùy linh hoạt), giữ 15–20 giây. Kéo giãn lưng dưới (erector spinae), hamstring và giải phóng sacroiliac joint bị nén khi ngồi.',
      'Thoracic extension: trong khi vươn tay lên, cố gắng mở ngực về phía sau nhẹ (không quá mức). Đây là thoracic extension bổ trợ — counteract kyphosis (gù lưng trên) do ngồi máy tính.',
      'Ai đặc biệt cần: người ngồi >6 giờ/ngày, hay bị đau lưng dưới sau làm việc, hoặc cảm thấy lưng "cứng" khi đứng dậy sau ngồi lâu. Combo này 2 phút mỗi giờ có thể giảm đáng kể đau lưng mãn tính liên quan đến ngồi nhiều.',
      'Không cần không gian rộng: vươn người có thể thực hiện ngay cạnh bàn làm việc, trong thang máy, hoặc trong nhà vệ sinh. Bend forward cần đứng thẳng — làm được ở bất kỳ đâu có đủ không gian đứng.',
    ],
    points: [
      { icon: '💧', label: 'Bơm dịch vào đĩa đệm', note: 'Đĩa đệm không có mạch máu — extension + flexion = cơ chế tưới dưỡng' },
      { icon: '🫁', label: 'Mở ngực = thở sâu hơn', note: 'Vươn tay lên mở cơ liên sườn — dung tích hô hấp tăng ngay' },
      { icon: '🔄', label: '2 chiều đối lập', note: 'Extension → flexion xen kẽ — counteract hoàn toàn tư thế ngồi' },
      { icon: '🩺', label: 'Phòng lồi đĩa đệm', note: 'Disc hydration đều đặn = giảm nguy cơ dài hạn cho dân ngồi nhiều' },
    ],
  },
  {
    action: 'Đi bộ 1 vòng quanh bàn làm việc',
    icon: '🚶', color: '#f59e0b', rgb: '245,158,11',
    title: 'Đi Bộ 1 Vòng Quanh Bàn',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 20–50 bước đi bộ quanh bàn (~30 giây) đủ để tái kích hoạt LPL, tăng lưu thông máu lên não và xả nhẹ adenosine tích lũy. Dunstan et al. (Diabetes Care 2012) cho thấy ngắt quãng ngồi bằng đi bộ nhẹ 2 phút mỗi 20 phút giảm glucose và insulin postprandial hiệu quả hơn ngồi-đứng xen kẽ không di chuyển.',
    detail: 'Không cần đi xa hay rời khỏi khu vực làm việc. Đi 1 vòng quanh bàn, ra lấy tài liệu, đến chỗ đồng nghiệp hỏi thay vì nhắn tin — mọi "mini-trip" đều có tác dụng tương tự về NEAT và chuyển hóa.',
    details: [
      'LPL reactivation ngay lập tức: nghiên cứu cho thấy chỉ cần 2 phút đi bộ nhẹ đủ để đảo ngược sự ức chế LPL trong cơ bắp chân do ngồi. Không cần đạt nhịp tim cao hay đổ mồ hôi — chuyển động nhẹ là đủ.',
      'Adenosine buildup: adenosine tích lũy trong não khi ngồi tập trung lâu — gây cảm giác "đầu nặng" và muốn ngủ. Di chuyển nhẹ tăng lưu lượng máu não, giúp adenosine được "rửa trôi" nhanh hơn mà không cần cà phê.',
      'Dunstan Study (2012): người ngồi liên tục suốt ngày có glucose và insulin postprandial cao nhất. Người ngắt quãng bằng đi bộ nhẹ 2 phút mỗi 20 phút có glucose thấp hơn 24% và insulin thấp hơn 23% so với ngồi-đứng không di chuyển.',
      'Đi bộ vs đứng yên: đứng yên không di chuyển không có tác dụng tương tự như đi bộ về glucose và LPL. Cơ bắp cần co rút (chuyển động) để kích hoạt GLUT4 và LPL — đứng tĩnh chỉ tốt hơn ngồi ở khía cạnh tư thế, không phải chuyển hóa.',
      'Tận dụng phone call: khi nghe điện thoại hoặc tham gia meeting không cần nhìn màn hình, đứng dậy và đi bộ nhẹ. "Walk and talk" — thêm hàng trăm bước/ngày mà không ảnh hưởng đến công việc.',
      'Destination walking: thay vì nhắn Slack/Zalo cho đồng nghiệp gần, đứng dậy đến hỏi trực tiếp. Thay vì in tài liệu ở máy in gần, chọn máy in xa hơn. Tạo "artificial destinations" để tăng bước đi tự nhiên.',
    ],
    points: [
      { icon: '⚡', label: 'LPL bật lại sau 2 phút', note: 'Không cần cường độ cao — đi nhẹ đủ để tái kích hoạt enzyme đốt mỡ' },
      { icon: '🧠', label: 'Xả adenosine não', note: 'Di chuyển tăng máu não → adenosine rửa trôi → tỉnh táo hơn' },
      { icon: '📊', label: 'Glucose -24%, Insulin -23%', note: 'Dunstan 2012 — đi bộ nhẹ mỗi 20 phút hiệu quả hơn đứng không di chuyển' },
      { icon: '📞', label: 'Walk-and-talk', note: 'Meeting + phone call không cần màn hình — đứng dậy và đi khi nghe' },
    ],
  },
  {
    action: 'Calf raise × 15 khi đứng chờ',
    icon: '🦶', color: '#8b5cf6', rgb: '139,92,246',
    title: 'Calf Raise × 15',
    img: 'https://images.unsplash.com/photo-1434682966252-f8506a5a0f06?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Soleus (cơ dép bắp chân) là cơ có khả năng chuyển hóa cao nhất khi cơ thể ở trạng thái đứng hoặc ngồi. Nghiên cứu Mclaughlin et al. (iScience, 2022) gọi soleus là "sleeping giant of metabolism" — calf raise kích hoạt cơ này để tiêu thụ glucose và fatty acids ở mức cao mà không gây mệt.',
    detail: 'Soleus có đặc tính oxy hóa đặc biệt: không cần glycogen (đường dự trữ) để hoạt động — dùng trực tiếp glucose và fatty acids từ máu. Kiễng gót chân 15 lần trong 30 giây kích hoạt soleus ở mức metabolic rate cao gấp 3× so với nghỉ ngơi.',
    details: [
      'Soleus vs gastrocnemius: bắp chân gồm 2 cơ chính. Gastrocnemius (cơ to bên ngoài) dùng nhiều cho nhảy và chạy — chủ yếu glycolytic. Soleus (cơ dép bên dưới) là cơ chậm, oxy hóa cao, hoạt động tốt nhất ở cường độ thấp-vừa khi đứng.',
      'iScience 2022 (Mclaughlin, Hamilton): soleus pushup (SLR — Soleus Lengthening Reactivation) giảm postprandial glucose 52% và triglycerides 60% trong phòng thí nghiệm — mạnh hơn đáng kể so với đi bộ hoặc nhịn ăn gián đoạn.',
      'Calf raise vs soleus pushup: calf raise đứng (kiễng gót chân) kích hoạt cả gastrocnemius và soleus. Soleus pushup ngồi (gót chân xuống, nhón đầu ngón chân, giữ) kích hoạt soleus thuần túy — tốt hơn về chuyển hóa nhưng ít người biết đến.',
      'Khi nào làm: đứng chờ thang máy, chờ pha cà phê, chờ in tài liệu, đứng nấu ăn, đứng xếp hàng. Bất kỳ lúc đứng chờ > 30 giây đều là cơ hội calf raise. Không cần thay đổi gì — chỉ kiễng gót chân là xong.',
      '"Bơm tĩnh mạch" (venous pump): calf raise co cơ bắp chân đẩy máu từ tĩnh mạch chân lên tim — "bơm phụ" của hệ tuần hoàn. Ngồi/đứng lâu không di chuyển để máu ứ ở chân — calf raise chống lại điều này hiệu quả hơn đứng yên.',
      'Tích lũy 15 lần × 6 lần/ngày = 90 calf raise/ngày. Soleus hoạt động tích lũy như vậy có tác động đo được lên glucose và triglycerides cả ngày — không cần làm liên tục, chia nhỏ nhiều lần hiệu quả tương đương.',
    ],
    points: [
      { icon: '😴', label: '"Sleeping giant of metabolism"', note: 'Soleus — cơ bị bỏ quên nhất nhưng tiêu thụ glucose hiệu quả nhất' },
      { icon: '🩸', label: 'Glucose -52%, TG -60%', note: 'iScience 2022 — mạnh hơn đi bộ về postprandial blood markers' },
      { icon: '🫀', label: 'Venous pump bắp chân', note: 'Co bắp chân đẩy máu từ tĩnh mạch chân lên tim — chống ứ máu' },
      { icon: '⏳', label: 'Làm khi đứng chờ', note: 'Thang máy, cà phê, in tài liệu — bất kỳ chờ >30 giây nào đều dùng được' },
    ],
  },
];

const STEP_GOALS = [
  {
    profile: 'Ít vận động (dưới 3.000 bước)', goal: 'Tăng 1.000 bước so với nền', tip: 'Đừng nhảy ngay lên 10.000. Tăng dần.',
    icon: '🐢', color: '#f43f5e', rgb: '244,63,94',
    title: 'Dưới 3.000 Bước — Điểm Xuất Phát',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dưới 3.000 bước/ngày được phân loại là "sedentary lifestyle" — tương đương ngồi >10 giờ/ngày. Nghiên cứu cho thấy tăng chỉ 1.000 bước/ngày từ nền thấp giảm nguy cơ tử vong sớm ~10–15%. Không cần nhảy lên 10.000 — chỉ cần hơn ngày hôm qua một chút là đã có tác dụng đo được.',
    detail: 'Nhóm này thường là dân văn phòng ngồi 8–10 giờ, di chuyển bằng xe máy/ô tô và ít đi bộ trong nhà. Mục tiêu đầu tiên không phải là đạt số bước cao — mà là phá vỡ vòng lặp ngồi liên tục và bắt đầu xây dựng thói quen nhận thức về việc vận động.',
    details: [
      '"Sedentary paradox": nhiều người dưới 3.000 bước/ngày không cảm thấy mình "không vận động" vì họ bận rộn và mệt mỏi. Nhưng bận rộn ngồi bàn giấy = NEAT thấp — sự mệt mỏi là mental fatigue, không phải physical activity.',
      'Tăng 1.000 bước từ nền thấp có tác động lớn nhất: nghiên cứu cho thấy người từ 2.000 bước tăng lên 3.000 bước nhận được lợi ích sức khỏe tương đương người từ 8.000 lên 9.000 bước. Mỗi bước đầu tiên có giá trị cao nhất.',
      'Cách thực tế thêm 1.000 bước: đi bộ sau bữa tối 10 phút (~800–1.000 bước) hoặc đậu xe xa hơn 5 phút (~400 bước) + leo cầu thang thay thang máy 3 lần (~300 bước). Không cần thay đổi lịch trình lớn.',
      'Tracking quan trọng hơn target: với nhóm này, chỉ cần bắt đầu đo số bước bằng điện thoại là đã cải thiện. Biết được con số thực tế tạo ra "awareness effect" — tự nhiên bắt đầu tìm cách tăng thêm.',
      'Không tăng quá 500–1.000 bước/tuần: cơ thể chưa quen vận động cần thích nghi từ từ. Tăng đột ngột dẫn đến đau chân, mệt mỏi và bỏ cuộc. Nguyên tắc "10% rule": không tăng quá 10% tổng bước mỗi tuần.',
      'Timeline thực tế: từ 2.000 lên 5.000 bước/ngày đều đặn cần khoảng 4–8 tuần tăng dần. Đừng nhìn vào mục tiêu 10.000 — nhìn vào tuần tới cần đạt gì. Small wins tích lũy thành thay đổi lớn.',
    ],
    points: [
      { icon: '📉', label: 'Sedentary lifestyle', note: '<3.000 bước = ngồi >10h/ngày — nguy cơ cao nhất về tim mạch và chuyển hóa' },
      { icon: '📈', label: '+1.000 bước = -10–15% tử vong', note: 'Mỗi 1.000 bước thêm từ nền thấp có giá trị lớn nhất về sức khỏe' },
      { icon: '📱', label: 'Tracking trước target', note: 'Biết số bước thực tế tạo awareness — tự nhiên bắt đầu tìm cách tăng' },
      { icon: '🐢', label: 'Tăng 500–1.000 bước/tuần', note: '10% rule — không tăng đột ngột, cơ thể cần thích nghi từng bước nhỏ' },
    ],
  },
  {
    profile: 'Trung bình (3.000–6.000)', goal: 'Tăng 1.000–2.000 bước/tuần', tip: 'Thêm 1 lần đi bộ 10 phút mỗi ngày.',
    icon: '🚶', color: '#f59e0b', rgb: '245,158,11',
    title: '3.000–6.000 Bước — Xây Nền Vận Động',
    img: 'https://images.unsplash.com/photo-1499803270242-467f7b8cffcd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhóm 3.000–6.000 bước đã thoát khỏi "sedentary" nhưng chưa đạt ngưỡng lợi ích sức khỏe tối ưu. Nghiên cứu 2022 (The Lancet) cho thấy plateau lợi ích tử vong ở 7.000–8.000 bước — nhóm này cần thêm 1.000–2.000 bước/ngày để đến vùng hiệu quả cao nhất. Thêm 1 lần đi bộ 10 phút/ngày (~800–1.000 bước) là đủ để bắc cầu.',
    detail: 'Nhóm này thường đã có một số thói quen vận động nhẹ — đi bộ đến văn phòng, leo vài tầng cầu thang — nhưng chưa có "dedicated walk" nào. Thêm 1 lần đi bộ có mục đích 10 phút vào routine (sáng, sau ăn trưa, hoặc tối) là đủ để tăng lên nhóm "Cơ bản".',
    details: [
      'The Lancet 2022 (meta-analysis, 47.471 người): lợi ích giảm tử vong tăng mạnh từ 3.500–7.000 bước, plateau sau 7.000–8.000. Nhóm 3.000–6.000 đang ở "vùng dốc" — mỗi bước thêm có giá trị rất cao.',
      'Thêm 1 lần đi bộ 10 phút/ngày: tương đương ~800–1.000 bước và ~40–50 kcal. Nhỏ về kcal nhưng tác động lớn về NEAT, glucose control và lợi ích tim mạch dài hạn. Dễ dàng lồng vào routine hiện tại.',
      'Thời điểm tốt nhất: sau bữa trưa (glucose control), buổi tối trước khi xem TV (habit stacking), hoặc trước giờ làm sáng (cortisol thấp + ánh sáng sáng sớm). Không có thời điểm "tốt nhất" tuyệt đối — thời điểm bạn thực sự làm được là tốt nhất.',
      'Habit stacking: gắn đi bộ 10 phút vào thói quen đã có — "Sau khi ăn trưa xong, tôi đi bộ 10 phút". Không tạo thói quen mới từ đầu — gắn vào anchor habit có sẵn tăng tỷ lệ duy trì đáng kể.',
      'Progress tracking: ghi lại bước mỗi ngày trong 2 tuần đầu để thấy xu hướng. Sau khi đạt 5.000–6.000 bước đều đặn, tự nhiên muốn push lên 7.000–8.000 — momentum tự tạo ra motivation tiếp theo.',
      'Đừng để "bad day" phá vỡ streak: nếu một ngày chỉ đạt 2.000 bước (ốm, thời tiết xấu) — không sao. Chỉ cần không để 2 ngày xấu liên tiếp. "Never miss twice" rule giúp duy trì habit dài hạn.',
    ],
    points: [
      { icon: '📊', label: 'Vùng dốc cao nhất', note: 'Lancet 2022: mỗi bước từ 3.500–7.000 có giá trị sức khỏe lớn nhất' },
      { icon: '⏱️', label: '+10 phút/ngày là đủ', note: '1 lần đi bộ 10 phút = 800–1.000 bước — đủ để tăng lên nhóm tiếp theo' },
      { icon: '🔗', label: 'Habit stacking', note: 'Gắn vào sau bữa ăn hoặc anchor habit có sẵn — duy trì dễ hơn tạo mới' },
      { icon: '📅', label: 'Never miss twice', note: '1 ngày xấu không sao — không để 2 ngày liên tiếp phá streak' },
    ],
  },
  {
    profile: 'Cơ bản (6.000–8.000)', goal: 'Duy trì + tăng lên 8.000–10.000', tip: 'Thêm bước sau bữa tối.',
    icon: '🏃', color: '#0ea5e9', rgb: '14,165,233',
    title: '6.000–8.000 Bước — Ngưỡng Lợi Ích Tốt',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '6.000–8.000 bước/ngày đã nằm trong vùng lợi ích sức khỏe tốt theo nhiều nghiên cứu. Nghiên cứu Lee et al. (JAMA, 2019): lợi ích sức khỏe tối ưu ở 7.500 bước với phụ nữ cao tuổi — ít tăng thêm sau đó. Nhóm này chỉ cần thêm 1 buổi đi bộ tối ngắn để "seal the deal" — không cần thay đổi lớn.',
    detail: 'Ở mức này, bạn đã có thói quen vận động nhất định. Mục tiêu không phải chỉ tăng số bước mà còn tối ưu cách phân phối bước trong ngày — rải đều thay vì dồn vào 1 lần — để có lợi ích glucose và NEAT tốt hơn.',
    details: [
      'Lee et al. 2019 (JAMA Internal Medicine): 16.741 phụ nữ cao tuổi được theo dõi. Nhóm trung vị ~7.500 bước có tỷ lệ tử vong thấp nhất. Lợi ích tiếp tục tăng đến ~7.500 bước rồi plateau — sau đó không đáng kể. Nghiên cứu gần đây với người trẻ gợi ý ngưỡng có thể cao hơn (~8.000–10.000).',
      'Phân phối bước quan trọng hơn tổng: 8.000 bước rải đều cả ngày (mỗi giờ ~1.000 bước) tốt hơn 8.000 bước trong 1 buổi đi bộ 80 phút về glucose control và LPL. Cùng tổng bước, khác tác động sinh lý.',
      'Thêm bước sau bữa tối: 10–20 phút đi bộ tối (~1.000–1.500 bước) giúp glucose bữa tối ổn định hơn trước khi ngủ, cải thiện sleep quality và tạo thói quen tốt trước giờ nghỉ. Nhiều người thấy đây là thời gian dễ duy trì nhất.',
      'Đi bộ tối vs tối giản hóa: nếu không có thời gian đi bộ riêng, thêm bước bằng cách đậu xe xa 10 phút, xuống xe buýt 1 trạm sớm hơn, hoặc đi bộ trong khi gọi điện thoại tối. Không nhất thiết phải là "dedicated walk session".',
      'Milestone 8.000 bước: đây là ngưỡng mà nghiên cứu gần đây (2021–2022) đồng thuận là đủ cho lợi ích sức khỏe toàn diện — tim mạch, chuyển hóa, sức khỏe tâm thần. Nhóm này chỉ cần thêm ~500–1.000 bước để cross milestone quan trọng này.',
      'Chất lượng bước: ở mức này, bắt đầu chú ý đến "active minutes" — thời gian bước ở tốc độ >100 bước/phút (đi nhanh). 30 phút active minutes/ngày có lợi ích tim mạch đo được ngay cả khi tổng bước không tăng.',
    ],
    points: [
      { icon: '✅', label: 'Vùng lợi ích sức khỏe tốt', note: 'JAMA 2019: 7.500 bước là ngưỡng lợi ích tối ưu nhiều nghiên cứu xác nhận' },
      { icon: '⏰', label: 'Phân phối đều > dồn 1 lần', note: 'Rải bước cả ngày tốt hơn đi bộ 1 buổi dài về glucose và LPL' },
      { icon: '🌙', label: 'Đi bộ tối sau bữa ăn', note: 'Glucose ổn định + sleep quality tốt hơn + dễ duy trì habit' },
      { icon: '⚡', label: 'Active minutes >100 bước/phút', note: 'Chú ý chất lượng bước — 30 phút đi nhanh có lợi ích tim mạch thêm' },
    ],
  },
  {
    profile: 'Tốt (8.000–10.000+)', goal: 'Duy trì + tối ưu chất lượng', tip: 'Tập trung phân bổ đều trong ngày.',
    icon: '🌟', color: '#10b981', rgb: '16,185,129',
    title: '8.000–10.000+ Bước — Tối Ưu Hóa NEAT',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ở mức 8.000–10.000+ bước, mục tiêu chuyển từ "tăng số lượng" sang "tối ưu chất lượng và phân phối". Phân phối đều (rải bước mỗi giờ, không dồn vào 1 buổi) và tăng "active minutes" (bước nhanh >100 bước/phút) tạo ra lợi ích bổ sung mà chỉ tăng tổng bước không đạt được.',
    detail: 'Nhóm này đã có nền vận động tốt. Cải tiến tiếp theo không phải về số lượng mà về cách phân phối bước trong ngày, kết hợp với strength training, và tối ưu hóa sleep + recovery để NEAT bền vững dài hạn.',
    details: [
      'Quality over quantity ở ngưỡng này: tăng từ 10.000 lên 12.000 bước có tác dụng ít hơn nhiều so với cải thiện cách phân phối 10.000 bước đó. 10.000 bước rải đều 16 giờ thức (~625 bước/giờ) tốt hơn 10.000 bước trong 2 giờ tập gym + 14 giờ ngồi.',
      'Active minutes tracking: Google Fit, Apple Health, Garmin theo dõi "active minutes" (bước ở >100 bước/phút). Mục tiêu 150 phút active minutes/tuần (WHO) = ~21 phút/ngày đi nhanh. Ở nhóm này, focus vào active minutes thay vì chỉ tổng bước.',
      'Kết hợp với strength training: NEAT cao + strength training 3 lần/tuần = tổ hợp tốt nhất cho sức khỏe dài hạn. Strength training tăng BMR và cơ bắp; NEAT đảm bảo hoạt động nền đều đặn. Hai yếu tố bổ trợ nhau, không thay thế nhau.',
      'Zone 2 cardio: đi bộ nhanh hoặc đạp xe nhẹ ở 60–70% max heart rate (Zone 2) tối ưu hóa fat oxidation và mitochondrial health. 30–45 phút Zone 2 × 3–4 lần/tuần = lợi ích tim mạch và chuyển hóa cao nhất với thời gian phù hợp.',
      'Phân phối bước thực tế: đặt reminder đứng dậy mỗi 45–60 phút, đi bộ sau mỗi bữa ăn, và kết hợp "walking meetings". Thay vì 1 buổi đi bộ dài, chia thành 4–5 lần đi ngắn rải trong ngày.',
      'Bền vững dài hạn: ở mức này, nguy cơ lớn nhất là injury (overuse) hoặc burnout khi cố duy trì cao quá. Lắng nghe cơ thể, nghỉ ngơi đủ và không để theo dõi số bước trở thành áp lực. Consistency trong nhiều năm quan trọng hơn peak trong vài tháng.',
    ],
    points: [
      { icon: '📊', label: 'Phân phối > tổng số', note: '10.000 bước rải đều cả ngày tốt hơn dồn vào 2 giờ gym về NEAT và glucose' },
      { icon: '⚡', label: 'Active minutes (>100 b/phút)', note: 'WHO: 150 phút active minutes/tuần — focus vào chất lượng bước, không chỉ số' },
      { icon: '💪', label: 'NEAT + Strength = cặp đôi tối ưu', note: 'Strength tăng BMR; NEAT đảm bảo nền hoạt động — bổ trợ không thay thế' },
      { icon: '🌱', label: 'Consistency > peak', note: 'Duy trì đều 8.000–10.000 nhiều năm > 12.000 bước 3 tháng rồi bỏ' },
    ],
  },
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

const NEAT_DAILY_CHECKLIST = [
  {
    title: 'Đứng dậy sau mỗi 45–60 phút ngồi', pct: '1 lần',
    icon: '🪑', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 60 phút ngồi bất động, hoạt động lipoprotein lipase (LPL) — enzyme đốt mỡ chính trong cơ bắp — giảm 90%. Đứng dậy đi lại chỉ 2 phút kích hoạt lại LPL gần như tức thì.',
    detail: 'Ngồi liên tục hơn 60 phút là hành vi có hại riêng biệt — không thể bù đắp bằng tập gym 1 tiếng sau đó. Đứng dậy thường xuyên là can thiệp NEAT quan trọng nhất cho người ngồi văn phòng.',
    details: [
      'LPL (lipoprotein lipase) là enzyme chuyển triglyceride từ máu vào tế bào cơ để đốt làm năng lượng. Khi cơ bắp bất động, LPL "tắt" — mỡ lưu thông trong máu thay vì được đốt trong cơ.',
      'Quy tắc 45–60 phút: không phải 90 phút như nhiều người nghĩ. Tác động tiêu cực lên LPL và đường huyết bắt đầu rõ ràng sau 60 phút. 45 phút là ngưỡng an toàn phòng ngừa.',
      'Chỉ cần 2 phút đứng dậy: không cần bài tập, không cần thay đồ. Đứng lấy nước, đi vệ sinh, đứng tại chỗ, xoay vai — bất kỳ hoạt động đứng và di chuyển nào đều đủ để reset LPL.',
      'Công cụ: timer 50 phút (Pomodoro + đứng dậy), app nhắc nhở trên điện thoại/đồng hồ, hoặc đặt cốc nước nhỏ buộc phải đứng lấy nhiều lần.',
      'Sau bữa ăn quan trọng hơn: ngồi ngay sau ăn kéo dài đỉnh glucose sau ăn. 10 phút đứng hoặc đi nhẹ sau bữa trưa cải thiện insulin response tương đương 15–20 phút đi bộ riêng.',
      'Standing desk không đủ: đứng bất động cũng tệ nếu không xen kẽ. Cần cả hai: xen kẽ ngồi-đứng VÀ di chuyển nhỏ (lắc chân, squat nhỏ) khi đứng.',
    ],
    points: [
      { icon: '⏱️', label: 'Timer 45–50 phút', note: 'Pomodoro kết hợp đứng dậy' },
      { icon: '🔄', label: 'Ngồi ↔ Đứng', note: 'Xen kẽ, không chỉ standing desk' },
      { icon: '💧', label: 'Cốc nước nhỏ', note: 'Buộc đứng dậy tự nhiên hơn' },
      { icon: '🍽️', label: 'Quan trọng sau ăn', note: '10 phút = 15–20 phút đi bộ riêng' },
    ],
  },
  {
    title: 'Đi bộ sau ít nhất 1 bữa ăn hôm nay', pct: '10 phút',
    icon: '🚶', color: '#059669', rgb: '5,150,105',
    img: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Meta-analysis 2022 xác nhận: đi bộ 10 phút sau ăn giảm đỉnh glucose 30–50% — hiệu quả hơn đi bộ 30 phút xa bữa ăn về quản lý glucose postprandial.',
    detail: 'Cơ bắp đang co (đi bộ) hấp thu glucose qua GLUT-4 không cần insulin — giảm tải cho tuyến tụy và làm phẳng đường cong glucose sau ăn. Đây là can thiệp NEAT có bằng chứng khoa học mạnh nhất.',
    details: [
      'GLUT-4 cơ chế: khi cơ co, GLUT-4 transporter di chuyển lên bề mặt tế bào cơ và hấp thu glucose trực tiếp từ máu — hoàn toàn độc lập với insulin. Đây là lý do tập thể dục cải thiện đường huyết ngay cả ở người kháng insulin.',
      'Thời điểm tối ưu: bắt đầu trong vòng 15–30 phút sau kết thúc bữa ăn — trước khi đỉnh glucose đạt mức cao nhất (~45–60 phút sau ăn). Đợi hơn 1 giờ sau ăn ít hiệu quả hơn nhiều.',
      '"Ít nhất 1 bữa" thực tế nhất là bữa trưa: giờ nghỉ có sẵn, bữa trưa thường nhiều carb nhất trong ngày. 10 phút đi quanh văn phòng hoặc ra ngoài block đủ tạo ra sự khác biệt đo được.',
      'Tốc độ: không cần đi nhanh. Tốc độ thoải mái (~4–5 km/h) đã kích hoạt đủ GLUT-4 trong cơ chân. Đi nhanh hơn không tăng thêm đáng kể hiệu quả giảm glucose post-meal.',
      'Kết hợp được: vừa đi vừa nghe podcast, gọi điện cho gia đình, hoặc đi cùng đồng nghiệp. Biến walk sau ăn thành "thời gian thưởng" thay vì "phải làm".',
      'Tác động lâu dài: thực hiện đều đặn 3 tháng cải thiện HbA1c (đường huyết dài hạn) trung bình 0.5–1% — đáng kể cho người có nguy cơ tiểu đường type 2.',
    ],
    points: [
      { icon: '📉', label: 'Giảm 30–50% glucose', note: 'Trong 15–30p đầu sau ăn' },
      { icon: '🍱', label: 'Bữa trưa dễ nhất', note: 'Nhiều carb + có giờ nghỉ' },
      { icon: '🎧', label: 'Kết hợp podcast', note: 'Biến thành thời gian thưởng' },
      { icon: '📊', label: 'HbA1c -0.5–1%', note: 'Sau 3 tháng đều đặn' },
    ],
  },
  {
    title: 'Đạt mục tiêu bước cá nhân', pct: '7.000+',
    icon: '👟', color: '#34d399', rgb: '52,211,153',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mỗi 1.000 bước thêm/ngày liên kết với giảm 10–15% nguy cơ tử vong sớm — lợi ích tiếp tục đến ~8.000 bước/ngày. Con số "10.000 bước" là marketing từ 1965, không phải khoa học.',
    detail: 'Mục tiêu bước chân cá nhân hóa — quan trọng hơn con số tuyệt đối. Baseline của bạn quyết định mục tiêu hợp lý, và đạt mục tiêu đó đều đặn bền vững hơn thỉnh thoảng vượt xa rồi lại thấp.',
    details: [
      '"Mục tiêu cá nhân" quan trọng hơn 10.000 bước: nếu baseline 3.000 bước/ngày, mục tiêu 5.000 là phù hợp. Tăng 1.000–1.500 bước mỗi 2–3 tuần đến khi đạt 7.000–8.000 là lộ trình bền vững nhất.',
      'Cách thiết lập: theo dõi bước chân tự nhiên 7 ngày không cố gắng, tính trung bình, đặt mục tiêu = trung bình + 1.500 bước. Sau 3 tuần đạt đều đặn, tăng thêm 1.000.',
      'Tracking tạo tác động: chỉ cần đo (điện thoại, đồng hồ) làm tăng trung bình 26% số bước mà không thay đổi gì khác — phản hồi nhìn thấy được tạo ra động lực tự điều chỉnh hành vi.',
      'Chiến lược không cần thêm thời gian: cầu thang thay thang máy (+100–300 bước), gửi xe xa hơn (+400–600 bước), đi vệ sinh tầng khác (+100–200 bước), walking meeting (+500–1.000 bước).',
      '7.500 bước là ngưỡng plateau lợi ích: nghiên cứu Harvard 2019 trên 16.000+ người cho thấy lợi ích tử vong plateau ở ~7.500 bước. 10.000 không xấu nhưng không cần thiết phải đạt được mỗi ngày.',
      'Ngày ít bước (<50% mục tiêu): 5 phút micro-workout tại chỗ (squat, calf raise, marching) không thay thế được nhưng duy trì thói quen và giảm thiểu tác động tiêu cực của ngày ít vận động.',
    ],
    points: [
      { icon: '📊', label: 'Baseline +1.500 bước', note: 'Thực tế hơn nhảy lên 10.000 ngay' },
      { icon: '📱', label: 'Tracking +26%', note: 'Chỉ đo đã tự nhiên cải thiện' },
      { icon: '🪜', label: 'Cầu thang + xa hơn', note: '+500–800 bước không tốn thời gian' },
      { icon: '🎯', label: '7.500 bước', note: 'Ngưỡng plateau lợi ích sức khỏe' },
    ],
  },
  {
    title: 'Có ít nhất 1 lần vận động ngắn trong giờ làm', pct: '5 phút',
    icon: '💪', color: '#6ee7b7', rgb: '110,231,183',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Exercise snacking" — 4× micro-workout 5 phút phân bổ đều trong ngày cải thiện mood, energy và tập trung tốt hơn 1 buổi tập 20 phút liên tục (nghiên cứu 2022).',
    detail: 'Micro-workout 3–5 phút xen kẽ trong giờ làm — không cần thay đồ, không cần thiết bị. Đủ để kích hoạt tuần hoàn, tăng BDNF và dopamine, và tạo "break" chất lượng cho não.',
    details: [
      '"Exercise snacking": khái niệm vận động ngắn xen kẽ trong ngày. Nghiên cứu 2022 tại McMaster University cho thấy 3× 20-second "vigorous exercise snack" cải thiện cardiorespiratory fitness tương đương 30 phút tập liên tục.',
      'Không cần đồ gym: 10 squat, 10 push-up vào tường, 20 calf raise, 30 giây plank, hoặc vươn vai + xoay cổ 2 phút. Không gây đổ mồ hôi, không cần thay đồ, thực hiện được ngay tại bàn làm việc.',
      'Lợi ích nhận thức tức thì: 5 phút vận động nhẹ tăng BDNF và dopamine — cải thiện tập trung 1–2 giờ tiếp theo. "Break vận động" hiệu quả hơn "break xem điện thoại" về phục hồi chú ý.',
      'Thời điểm tốt nhất: sau 90 phút làm việc tập trung cao (khi não bắt đầu đuối), hoặc ngay sau cuộc họp căng thẳng để giải phóng cortisol tích lũy.',
      'Tích hợp vào timer: khi timer 45–50 phút báo đứng dậy, thay vì chỉ đứng lấy nước, làm 10 squat hoặc stretch 2 phút. Biến "break bắt buộc" thành "exercise snack". Không tốn thêm thời gian.',
      'Cộng dồn: 2 lần × 5 phút/ngày = 50 phút NEAT bổ sung/tuần — tương đương gần 1 buổi tập nhẹ thêm mỗi tuần từ những "snack" nhỏ trong giờ làm.',
    ],
    points: [
      { icon: '🍎', label: 'Exercise snacking', note: '4× 5 phút tốt hơn 1× 20 phút' },
      { icon: '🧠', label: 'BDNF + dopamine', note: 'Tập trung tốt hơn 1–2h sau' },
      { icon: '⏰', label: 'Sau 90 phút làm', note: 'Khi não đuối là hiệu quả nhất' },
      { icon: '📈', label: '50 phút NEAT/tuần', note: 'Từ 2× 5 phút mỗi ngày làm' },
    ],
  },
  {
    title: 'Không ngồi liên tục hơn 90 phút', pct: 'max 90p',
    icon: '⏱️', color: '#a7f3d0', rgb: '167,243,208',
    img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nghiên cứu trên 800.000 người: ngồi nhiều nhất (>8h/ngày) có nguy cơ tử vong cao hơn 73% so với nhóm ít ngồi — ngay cả sau khi điều chỉnh cho yếu tố tập luyện. Đây là nguy cơ độc lập.',
    detail: '90 phút là giới hạn cứng — sau đó tác động tiêu cực lên trao đổi chất, tuần hoàn và cơ xương khớp tích lũy nhanh. Ngay cả người tập gym đều đặn vẫn bị ảnh hưởng nếu ngồi liên tục.',
    details: [
      'Tại sao 90 phút là giới hạn: đây cũng là chu kỳ Ultradian rhythm — não làm việc theo chu kỳ 90 phút tập trung cao rồi cần nghỉ. Đứng dậy sau 90 phút vừa tốt cho sinh lý vừa phù hợp nhịp não.',
      'Tác động lên cột sống: sau 90 phút ngồi, đĩa đệm bị nén và mất nước dần. Không có mạch máu trực tiếp, đĩa đệm nhận dinh dưỡng qua cơ chế áp suất — di chuyển giúp "bơm" dịch vào đĩa đệm.',
      'Lưu thông máu chân: ngồi > 90 phút làm chậm máu tĩnh mạch ở chân, tăng nguy cơ huyết khối tĩnh mạch sâu (DVT) đặc biệt ở người có yếu tố nguy cơ. Đây là lý do khuyến cáo đứng dậy trên chuyến bay dài.',
      'Không giống nhau với "ngồi bao nhiêu tiếng mỗi ngày": người ngồi 8 tiếng chia nhỏ thành các đoạn 45–60 phút khác hoàn toàn về mặt sinh lý so với người ngồi 8 tiếng liên tục chỉ nghỉ ăn trưa.',
      'Giải pháp thực tế: timer 80 phút (để break trước khi đến 90 phút), standing desk xen kẽ 20–30 phút sau mỗi 60–70 phút ngồi, hoặc walking meeting để phá vỡ các block ngồi dài.',
      'Dấu hiệu đã ngồi quá lâu: cổ vai gáy căng, mắt mỏi, lưng dưới ê ẩm, khó tập trung — đây là tín hiệu cơ thể cần di chuyển, không phải "bình thường khi làm việc".',
    ],
    points: [
      { icon: '🧠', label: 'Ultradian 90 phút', note: 'Nhịp não + cơ thể đều cần break' },
      { icon: '🦴', label: 'Đĩa đệm mất nước', note: 'Di chuyển bơm dịch vào đĩa đệm' },
      { icon: '⚠️', label: 'Nguy cơ độc lập', note: 'Tập gym không bù được ngồi liên tục' },
      { icon: '⏰', label: 'Timer 80 phút', note: 'Break trước khi đến ngưỡng 90 phút' },
    ],
  },
];

export default function LifestyleNeatPage() {
  const { t: tPillars } = useTranslation('pillars');
  const hero = tPillars('pillarC.c_neat_hero', { returnObjects: true }) || {};
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_neat_daily_checks')) || {}; } catch { return {}; }
  });
  const [teeIdx, setTeeIdx] = useState(null);
  const [activityIdx, setActivityIdx] = useState(null);
  const [breakIdx, setBreakIdx] = useState(null);
  const [officeIdx, setOfficeIdx] = useState(null);
  const [stepIdx, setStepIdx] = useState(null);
  const [checklistModal, setChecklistModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('healthapp_neat_daily_checks', JSON.stringify(checks));
  }, [checks]);

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

  const trTee = tPillars('pillarC.c_neat_tee', { returnObjects: true });
  const neatVsTee = Array.isArray(trTee) ? NEAT_VS_TEE.map((it,i) => ({...it,...(trTee[i]||{})})) : NEAT_VS_TEE;
  const trAct = tPillars('pillarC.c_neat_activities', { returnObjects: true });
  const neatActivities = Array.isArray(trAct) ? NEAT_ACTIVITIES.map((it,i) => ({...it,...(trAct[i]||{})})) : NEAT_ACTIVITIES;
  const trOH = tPillars('pillarC.c_neat_office_hacks', { returnObjects: true });
  const officeHacks = Array.isArray(trOH) ? OFFICE_HACKS.map((it,i) => ({...it,...(trOH[i]||{})})) : OFFICE_HACKS;
  const trBM = tPillars('pillarC.c_neat_break_moves', { returnObjects: true });
  const breakMoves = Array.isArray(trBM) ? BREAK_MOVES.map((it,i) => ({...it,...(trBM[i]||{})})) : BREAK_MOVES;
  const trSG = tPillars('pillarC.c_neat_step_goals', { returnObjects: true });
  const stepGoals = Array.isArray(trSG) ? STEP_GOALS.map((it,i) => ({...it,...(trSG[i]||{})})) : STEP_GOALS;
  const trCL = tPillars('pillarC.c_neat_daily_checklist', { returnObjects: true });
  const neatChecklist = Array.isArray(trCL) ? NEAT_DAILY_CHECKLIST.map((it,i) => ({...it,...(trCL[i]||{})})) : NEAT_DAILY_CHECKLIST;
  const neatCaption = tPillars('pillarC.c_neat_caption') || 'Đi bộ · Đứng dậy · Vận động rải rác';
  const neatS1Title = tPillars('pillarC.c_neat_s1_title') || 'NEAT Chiếm Bao Nhiêu Trong Ngày?';
  const neatS1Sub = tPillars('pillarC.c_neat_s1_sub') || 'Tổng năng lượng tiêu thụ trong ngày (TDEE) gồm 4 thành phần chính.';
  const neatS1Keypoint = tPillars('pillarC.c_neat_s1_keypoint') || 'Điểm mấu chốt: Buổi tập gym chỉ chiếm 5–10% tổng năng lượng. NEAT chiếm 15–30%. Người năng động có NEAT cao hơn người ngồi nhiều tới 500–700 kcal/ngày.';
  const neatS2Title = tPillars('pillarC.c_neat_s2_title') || 'NEAT Tiêu Thụ Bao Nhiêu kcal?';
  const neatS2Sub = tPillars('pillarC.c_neat_s2_sub') || 'Các hoạt động NEAT phổ biến và năng lượng tiêu thụ ước tính.';
  const neatS3Title = tPillars('pillarC.c_neat_s3_title') || '⏱ Quy Tắc Đứng Dậy 2 Phút';
  const neatS3Text = tPillars('pillarC.c_neat_s3_text') || 'Ngồi liên tục hơn 90 phút làm giảm lưu thông máu, tăng căng cơ và giảm trao đổi chất.';
  const neatS4Title = tPillars('pillarC.c_neat_s4_title') || '6 Cách Tăng NEAT Cho Dân Văn Phòng';
  const neatS4Sub = tPillars('pillarC.c_neat_s4_sub') || 'Click vào từng mục để xem chiến lược chi tiết và bằng chứng khoa học.';
  const neatS5Title = tPillars('pillarC.c_neat_s5_title') || 'Mục Tiêu Bước Theo Cấp Độ';
  const neatS5Sub = tPillars('pillarC.c_neat_s5_sub') || 'Không ép tất cả lên 10.000 bước. Tăng từ nền hiện tại, không nhảy vọt.';
  const neatS6Title = tPillars('pillarC.c_neat_s6_title') || 'NEAT Checklist Hằng Ngày';
  const neatDetailLabel = tPillars('pillarC.c_neat_detail_label') || 'Chi tiết →';
  const neatDetailHover = tPillars('pillarC.c_neat_detail_hover') || 'Chi tiết';
  const neatCheckExcellent = tPillars('pillarC.c_neat_check_excellent') || 'Xuất sắc! NEAT cao nhất trong ngày';
  const neatCheckGood = tPillars('pillarC.c_neat_check_good') || 'Tốt';
  const neatCheckBuilding = tPillars('pillarC.c_neat_check_building') || 'Đang xây dựng thói quen';

  const checkCount = [0,1,2,3,4].filter(i => checks[i]).length;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-emerald-400 transition-colors">
        {hero.breadcrumb || '← Lối Sống Khỏe'}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🚶
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{hero.title || 'NEAT & Chống Ngồi Lâu'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            {hero.badge || 'C3 — Non-Exercise Activity Thermogenesis'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {hero.desc || 'NEAT là toàn bộ vận động ngoài buổi tập: đi bộ, đứng dậy, làm việc nhà, di chuyển trong ngày. Với người bận rộn, NEAT có thể quan trọng không kém buổi tập gym.'}
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
                {neatCaption}
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* NEAT vs TEE */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{neatS1Title}</h2>
        <p className="text-muted text-lg mb-6">{neatS1Sub}</p>
        <div className="space-y-3">
          {neatVsTee.map((item, i) => (
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
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>{neatDetailLabel}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.07)`, border: `1px solid rgba(${RGB},0.2)` }}>
          <p className="text-lg text-muted">{neatS1Keypoint}</p>
        </div>
      </RevealBlock>

      {/* NEAT activities */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{neatS2Title}</h2>
        <p className="text-muted text-lg mb-6">{neatS2Sub}</p>
        <div className="grid gap-3">
          {neatActivities.map((a, i) => (
            <div key={i}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${a.rgb},0.05)`, border: `1px solid rgba(${a.rgb},0.18)` }}
              onClick={() => setActivityIdx(i)}>
              <span className="text-2xl shrink-0">{a.icon}</span>
              <span className="text-base font-semibold text-text flex-1">{a.activity}</span>
              <span className="text-base font-bold tabular-nums shrink-0" style={{ color: a.color }}>{a.kcal} kcal</span>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: a.color, background: `rgba(${a.rgb},0.1)` }}>{neatDetailLabel}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 2-minute rule */}
      <RevealBlock className="mb-12">
        <div className="p-6 rounded-2xl" style={{ background: `rgba(${RGB},0.08)`, border: `1px solid rgba(${RGB},0.25)` }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLOR }}>{neatS3Title}</h2>
          <p className="text-muted text-lg leading-relaxed mb-4">{neatS3Text}</p>
          <div className="grid gap-2">
            {breakMoves.map((move, i) => (
              <div key={i}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                style={{ background: `rgba(${move.rgb},0.06)`, border: `1px solid rgba(${move.rgb},0.18)` }}
                onClick={() => setBreakIdx(i)}>
                <span className="text-xl shrink-0">{move.icon}</span>
                <span className="flex-1 text-base text-muted">{move.action}</span>
                <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                  style={{ color: move.color, background: `rgba(${move.rgb},0.1)` }}>{neatDetailLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Office hacks */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{neatS4Title}</h2>
        <p className="text-muted text-lg mb-6">{neatS4Sub}</p>
        <div className="grid gap-3">
          {officeHacks.map((h, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${h.rgb},0.05)`, border: `1px solid rgba(${h.rgb},0.18)` }}
              onClick={() => setOfficeIdx(i)}>
              <span className="text-2xl shrink-0">{h.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{h.hack}</div>
                <div className="text-muted text-sm mt-0.5">{h.detail_short}</div>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: h.color, background: `rgba(${h.rgb},0.1)` }}>{neatDetailLabel}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Step goals */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{neatS5Title}</h2>
        <p className="text-muted text-lg mb-6">{neatS5Sub}</p>
        <div className="space-y-3">
          {stepGoals.map((g, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${g.rgb},0.05)`, border: `1px solid rgba(${g.rgb},0.18)` }}
              onClick={() => setStepIdx(i)}>
              <span className="text-2xl shrink-0">{g.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{g.profile}</div>
                <div className="text-sm mt-0.5 font-medium" style={{ color: g.color }}>{g.goal}</div>
                <div className="text-xs text-muted mt-0.5">{g.tip}</div>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: g.color, background: `rgba(${g.rgb},0.1)` }}>{neatDetailLabel}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily NEAT checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{neatS6Title}</h2>
        <div className="space-y-1.5 mb-4">
          {neatChecklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl group transition-all"
              style={{
                border: '1px solid',
                borderColor: checks[i] ? `rgba(${item.rgb},0.35)` : checklistModal === i ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.05)',
                background: checks[i] ? `rgba(${item.rgb},0.07)` : 'transparent',
                transition: 'border-color 0.2s, background 0.2s',
              }}>
              {/* Checkbox */}
              <button onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                aria-label={checks[i] ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all"
                  style={{
                    borderColor: checks[i] ? item.color : 'rgba(255,255,255,0.25)',
                    background: checks[i] ? item.color : 'transparent',
                    boxShadow: checks[i] ? `0 0 8px rgba(${item.rgb},0.5)` : 'none',
                  }}>
                  {checks[i] && (
                    <svg viewBox="0 0 12 10" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5">
                      <path d="M1 5l3.5 3.5L11 1"/>
                    </svg>
                  )}
                </div>
              </button>
              {/* Label + detail trigger */}
              <button onClick={() => setChecklistModal(i)}
                className="flex-1 flex items-center justify-between py-2 pr-3 text-left group/label cursor-pointer">
                <span className={`flex items-center gap-2 text-lg transition-colors ${checks[i] ? 'text-text' : 'text-muted group-hover/label:text-text'}`}>
                  <span className="text-base">{item.icon}</span>
                  <span className={checks[i] ? 'line-through opacity-60' : ''}>{item.title}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover/label:opacity-100 transition-opacity shrink-0 ml-2" style={{ color: item.color }}>
                  {neatDetailHover}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                </span>
              </button>
            </div>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: `rgba(${RGB},0.15)` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${checkCount / 5 * 100}%`, background: COLOR }} />
        </div>
        <p className="text-base text-muted">{checkCount}/5 — {checkCount >= 4 ? neatCheckExcellent : checkCount >= 3 ? neatCheckGood : neatCheckBuilding}</p>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/morning" className="text-muted hover:text-emerald-400 transition-colors text-lg">{hero.nav_prev || '← Routine Sáng'}</Link>
        <Link to="/pillar/c/recovery" className="text-lg font-semibold" style={{ color: COLOR }}>{hero.nav_next || 'Phục Hồi →'}</Link>
      </div>

      {/* ── Step goals modal — outside all RevealBlocks ── */}
      {stepIdx !== null && (
        <NeatModal
          item={stepGoals[stepIdx]}
          idx={stepIdx}
          total={stepGoals.length}
          onClose={() => setStepIdx(null)}
          onPrev={() => setStepIdx(i => Math.max(0, i - 1))}
          onNext={() => setStepIdx(i => Math.min(stepGoals.length - 1, i + 1))}
          hasPrev={stepIdx > 0}
          hasNext={stepIdx < stepGoals.length - 1}
        />
      )}

      {/* ── Office hacks modal — outside all RevealBlocks ── */}
      {officeIdx !== null && (
        <NeatModal
          item={officeHacks[officeIdx]}
          idx={officeIdx}
          total={officeHacks.length}
          onClose={() => setOfficeIdx(null)}
          onPrev={() => setOfficeIdx(i => Math.max(0, i - 1))}
          onNext={() => setOfficeIdx(i => Math.min(officeHacks.length - 1, i + 1))}
          hasPrev={officeIdx > 0}
          hasNext={officeIdx < officeHacks.length - 1}
        />
      )}

      {/* ── Break moves modal — outside all RevealBlocks ── */}
      {breakIdx !== null && (
        <NeatModal
          item={breakMoves[breakIdx]}
          idx={breakIdx}
          total={breakMoves.length}
          onClose={() => setBreakIdx(null)}
          onPrev={() => setBreakIdx(i => Math.max(0, i - 1))}
          onNext={() => setBreakIdx(i => Math.min(breakMoves.length - 1, i + 1))}
          hasPrev={breakIdx > 0}
          hasNext={breakIdx < breakMoves.length - 1}
        />
      )}

      {/* ── NEAT activities modal — outside all RevealBlocks ── */}
      {activityIdx !== null && (
        <NeatModal
          item={neatActivities[activityIdx]}
          idx={activityIdx}
          total={neatActivities.length}
          onClose={() => setActivityIdx(null)}
          onPrev={() => setActivityIdx(i => Math.max(0, i - 1))}
          onNext={() => setActivityIdx(i => Math.min(neatActivities.length - 1, i + 1))}
          hasPrev={activityIdx > 0}
          hasNext={activityIdx < neatActivities.length - 1}
        />
      )}

      {/* ── Daily checklist modal ── */}
      {checklistModal !== null && (
        <NeatModal
          item={neatChecklist[checklistModal]}
          idx={checklistModal}
          total={neatChecklist.length}
          onClose={() => setChecklistModal(null)}
          onPrev={() => setChecklistModal(i => Math.max(0, i - 1))}
          onNext={() => setChecklistModal(i => Math.min(neatChecklist.length - 1, i + 1))}
          hasPrev={checklistModal > 0}
          hasNext={checklistModal < neatChecklist.length - 1}
        />
      )}

      {/* ── TDEE components modal — outside all RevealBlocks ── */}
      {teeIdx !== null && (
        <NeatModal
          item={neatVsTee[teeIdx]}
          idx={teeIdx}
          total={neatVsTee.length}
          onClose={() => setTeeIdx(null)}
          onPrev={() => setTeeIdx(i => Math.max(0, i - 1))}
          onNext={() => setTeeIdx(i => Math.min(neatVsTee.length - 1, i + 1))}
          hasPrev={teeIdx > 0}
          hasNext={teeIdx < neatVsTee.length - 1}
        />
      )}
    </div>
  );
}
