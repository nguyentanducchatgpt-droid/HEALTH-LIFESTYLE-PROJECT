import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── Constants ────────────────────────────────────────────────────────────────

const LIME = '#84cc16';
const LS_INPUTS = 'healthapp_b0_inputs';
const LS_CHECKS = 'healthapp_roadmap_checks';

const ACTIVITY_LEVELS = [
  { key: 'sedentary',  label: 'Ít vận động', sub: 'Ngồi nhiều, không tập', mult: 1.2   },
  { key: 'light',      label: 'Nhẹ',         sub: '1–2 ngày/tuần',        mult: 1.375 },
  { key: 'moderate',   label: 'Vừa phải',    sub: '3–5 ngày/tuần',        mult: 1.55  },
  { key: 'active',     label: 'Năng động',   sub: '6–7 ngày/tuần',        mult: 1.725 },
  { key: 'very_active', label: 'Rất năng động',sub: 'Tập 2 lần/ngày',      mult: 1.9   },
];

const GOAL_MODIFIERS = [
  { key: 'loss',   label: 'Giảm mỡ',   emoji: '🔥', delta: -400 },
  { key: 'recomp', label: 'Tái tổ hợp', emoji: '⚖️', delta:    0 },
  { key: 'gain',   label: 'Tăng cơ',   emoji: '💪', delta:  300 },
];

// ─── Stats computation (mirrors PillarB useMemo) ──────────────────────────────

function computeStats({ weight, height, age, sex, activityKey, goalKey }) {
  const activity = ACTIVITY_LEVELS.find(a => a.key === activityKey) || ACTIVITY_LEVELS[2];
  const bmr = Math.round(sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161);
  const tdee = Math.round(bmr * activity.mult);
  const goal = GOAL_MODIFIERS.find(g => g.key === goalKey) || GOAL_MODIFIERS[1];
  const targetKcal = tdee + goal.delta;
  const proteinG = Math.round(weight * (goalKey === 'loss' ? 2.0 : 1.8));
  const fatG = Math.round(targetKcal * 0.25 / 9);
  const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
  const waterMl = Math.round(weight * 35);
  const fiberG = sex === 'male' ? 38 : 25;
  const proteinPct = Math.round(proteinG * 4 / targetKcal * 100);
  const fatPct = Math.round(fatG * 9 / targetKcal * 100);
  const carbPct = 100 - proteinPct - fatPct;
  const mealsPerDay = 3;
  const perMealProteinG = Math.round(proteinG / mealsPerDay);
  const perMealCarbG = Math.round(carbG / mealsPerDay);
  const perMealKcal = Math.round(targetKcal / mealsPerDay);
  const chickenG = Math.round(perMealProteinG / 0.31);
  const riceG = Math.round(perMealCarbG / 0.28);
  const weeklyKcalDelta = goal.delta * 7;
  const kgPerWeek = parseFloat((Math.abs(weeklyKcalDelta) / 7700).toFixed(2));
  const weeksTo5kg = kgPerWeek > 0 ? Math.round(5 / kgPerWeek) : null;
  const weeklyProteinG = proteinG * 7;
  const trainingDays = activityKey === 'sedentary' ? 0 : activityKey === 'light' ? 2 : activityKey === 'moderate' ? 3 : activityKey === 'active' ? 5 : 6;
  const restDays = 7 - trainingDays;
  const trainingDayKcal = Math.round(targetKcal + (trainingDays > 0 ? 100 : 0));
  const restDayKcal = Math.round(targetKcal - (trainingDays > 0 ? 100 : 0));
  const trainingDayCarb = Math.round(carbG * 1.2);
  const restDayCarb = Math.round(carbG * 0.8);
  const heavyDayCarbG = Math.round(carbG * 1.4);
  const lightDayCarbG = Math.round(carbG * 0.6);
  const preWorkoutCarbG = Math.round(carbG * 0.15);
  const postWorkoutProteinG = Math.round(weight * 0.3);
  const postWorkoutCarbG = Math.round(weight * 0.5);
  return {
    weight, height, age, sex, activityKey, goalKey,
    bmr, tdee, activity, goal, targetKcal,
    proteinG, fatG, carbG, waterMl, fiberG, proteinPct, fatPct, carbPct,
    mealsPerDay, perMealProteinG, perMealCarbG, perMealKcal, chickenG, riceG,
    weeklyKcalDelta, kgPerWeek, weeksTo5kg, weeklyProteinG,
    trainingDays, restDays, trainingDayKcal, restDayKcal,
    trainingDayCarb, restDayCarb, heavyDayCarbG, lightDayCarbG,
    preWorkoutCarbG, postWorkoutProteinG, postWorkoutCarbG,
  };
}

// ─── Roadmap phase data ───────────────────────────────────────────────────────

const ROADMAP_PHASES = [
  {
    phase: 1, weeks: '1–2', weekCount: 2, label: 'Xây Nền', emoji: '🌱',
    color: '#22c55e', rgb: '34,197,94',
    goal: 'Tạo thói quen ăn uống cơ bản — không cần đếm calo ngay từ đầu. Mục tiêu là tính nhất quán, không phải hoàn hảo.',
    actions: [
      'Mỗi bữa có ít nhất 1 nguồn đạm (thịt, cá, trứng, đậu hũ)',
      'Thêm rau/canh vào ít nhất 2/3 bữa chính mỗi ngày',
      'Uống 6–8 ly nước (250ml/ly) mỗi ngày',
      'Giảm nước ngọt, trà sữa — thay bằng trà không đường hoặc nước lọc',
      'Không bỏ bữa rồi ăn bù quá nhiều ở bữa sau',
    ],
    checkpoints: ['Hình thành nhịp ăn 3 bữa ổn định', 'Thấy ít thèm ăn vặt hơn', 'Năng lượng ban ngày cải thiện nhẹ'],
    outcome: 'Thói quen nền được hình thành. Cơ thể bắt đầu quen với nhịp ăn ổn định và ít đường lỏng hơn.',
    kcalMult: 0.95, compliance: 62,
    formula: s => `Protein/bữa ≈ ${s.perMealProteinG}g · Nước ≥ ${Math.round(s.waterMl/250)} ly · ${s.mealsPerDay} bữa/ngày`,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '1', title: 'Thiết Lập Nhịp Ăn', icon: '📅', focus: 'Ăn 3 bữa đều giờ · Thêm đạm vào mỗi bữa · Giảm 1 ly nước ngọt/ngày', tip: 'Đặt báo nhắc ăn trên điện thoại nếu hay bỏ bữa.' },
      { week: '2', title: 'Loại Bỏ Thói Quen Xấu', icon: '🚫', focus: 'Không nước ngọt · Giảm đồ chiên · Thêm rau vào ít nhất 2 bữa', tip: 'Chuẩn bị sẵn 1 bình nước 500ml để bàn làm việc.' },
    ],
    grocery: ['Ức gà / cá hồi / trứng gà', 'Rau cải / bông cải / bí xanh', 'Cơm gạo lứt / khoai lang', 'Dầu ô liu / dầu gạo', 'Sữa chua không đường'],
    mistakes: ['Bỏ bữa sáng để "tiết kiệm calo"', 'Uống nước trái cây thay nước lọc (nhiều đường hơn tưởng)', 'Ăn rất ít rồi nổi cơn thèm dữ dội về đêm'],
    science: '21 ngày đầu là cửa ải khó nhất. Nghiên cứu của Phillippa Lally (UCL) cho thấy trung bình 66 ngày để thói quen tự động hóa — nhưng 21 ngày đầu tạo ra "cú hích" quyết định. Vượt qua giai đoạn này, mọi thứ sẽ nhẹ nhàng hơn đáng kể.',
    mealPlan: [
      { label: 'Sáng', time: '7:00', icon: '🌅', color: '#f59e0b', items: ['2 trứng luộc', 'Bánh mì ngũ cốc 2 lát', '1 ly sữa ít béo 200ml'], macro: '~25g P · ~40g C · ~15g F', note: 'Đơn giản, đủ đạm, không bỏ bữa' },
      { label: 'Trưa', time: '12:00', icon: '☀️', color: '#22c55e', items: ['Cơm 1 chén vừa', 'Ức gà luộc 100g', 'Canh rau cải', '1 quả chuối'], macro: '~35g P · ~65g C · ~8g F', note: 'Đĩa ăn cơ bản: đạm + rau + tinh bột' },
      { label: 'Snack', time: '15:00', icon: '🍎', color: '#06b6d4', items: ['Sữa chua không đường 100g', 'Hoặc 1 nắm hạt hỗn hợp 20g'], macro: '~10g P · ~12g C · ~8g F', note: 'Phòng thèm buổi chiều' },
      { label: 'Tối', time: '18:30', icon: '🌙', color: '#a855f7', items: ['Cơm 1 chén nhỏ', 'Cá hấp gừng 120g', 'Rau xào tỏi 1 đĩa'], macro: '~32g P · ~45g C · ~10g F', note: 'Bữa tối nhẹ hơn bữa trưa' },
    ],
  },
  {
    phase: 2, weeks: '3–4', weekCount: 2, label: 'Chuẩn Hóa', emoji: '📐',
    color: '#06b6d4', rgb: '6,182,212',
    goal: 'Áp dụng đĩa ăn ½–¼–¼ và nhận thức khẩu phần bằng mắt/tay mà không cần cân thực phẩm.',
    actions: [
      'Áp dụng đĩa ½ rau / ¼ đạm / ¼ tinh bột mỗi bữa chính',
      'Bắt đầu meal prep 1 lần/tuần (đạm + tinh bột sẵn 3 ngày)',
      'Theo dõi protein hàng ngày bằng app hoặc ghi chú đơn giản',
      'Học đọc nhãn dinh dưỡng — tìm mục "Protein" và "Calories"',
      'Ưu tiên thực phẩm chế biến tối thiểu, ít thành phần',
    ],
    checkpoints: ['Cân nặng bắt đầu ổn định', 'Nhận ra khẩu phần đúng bằng mắt', 'Tiêu hóa cải thiện rõ rệt'],
    outcome: 'Kiểm soát khẩu phần mà không cần cân đo. Bắt đầu thấy thay đổi về năng lượng và cơ thể.',
    kcalMult: 1.0, compliance: 71,
    formula: s => `Mục tiêu: ${s.proteinG}g protein · ${s.targetKcal.toLocaleString()} kcal · Đĩa ½-¼-¼ mỗi bữa`,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '3', title: 'Đĩa Ăn Cân Bằng', icon: '🍽️', focus: 'Áp dụng ½ rau – ¼ đạm – ¼ tinh bột · Không thêm sốt nhiều dầu', tip: 'Dùng đĩa nhỏ hơn giúp giảm khẩu phần tự nhiên 20%.' },
      { week: '4', title: 'Meal Prep Lần Đầu', icon: '📦', focus: 'Nấu đạm 2–3 ngày · Chuẩn bị rau sẵn · Chia khẩu phần vào hộp', tip: 'Chủ nhật nấu 1 nồi thịt kho + 1 nồi cơm = sẵn ăn cả tuần.' },
    ],
    grocery: ['Đùi gà / thịt bò nạc / cá basa', 'Cải thìa / rau muống / giá đỗ', 'Gạo lứt / mì ý nguyên cám / khoai tây', 'Nước mắm / tương hoisin ít muối', 'Hộp đựng thực phẩm cho meal prep'],
    mistakes: ['Meal prep quá phức tạp → bỏ sau 1 lần đầu', 'Chỉ ăn rau → thiếu protein → mất cơ', 'Không đo lường nhưng nhẩm sai → vẫn thừa calo 20–30%'],
    science: 'Phương pháp đĩa ăn (Plate Method) của Harvard School of Public Health cho thấy không cần cân đo vẫn đạt 85% chính xác macro khi áp dụng đúng tỉ lệ. Kết hợp với meal prep 1 lần/tuần giảm "food decision fatigue" — lý do lớn khiến người ta ăn sai vào buổi tối.',
    mealPlan: [
      { label: 'Sáng', time: '7:00', icon: '🌅', color: '#f59e0b', items: ['Yến mạch 50g nấu sữa', '1 trứng nguyên quả + 2 lòng trắng', '½ quả bơ'], macro: '~28g P · ~45g C · ~18g F', note: 'Protein + healthy fat + carb chậm' },
      { label: 'Trưa', time: '12:00', icon: '☀️', color: '#22c55e', items: ['½ đĩa rau xào tỏi', '¼ đĩa ức gà 130g', '¼ đĩa cơm gạo lứt'], macro: '~38g P · ~55g C · ~10g F', note: 'Đĩa ½-¼-¼ đầy đủ và dễ nhận ra' },
      { label: 'Snack', time: '10:30', icon: '☕', color: '#06b6d4', items: ['Cà phê đen / trà xanh', '1 nắm hạt óc chó 20g'], macro: '~4g P · ~4g C · ~13g F', note: 'Giữa sáng để không đói đến trưa' },
      { label: 'Tối', time: '18:30', icon: '🌙', color: '#a855f7', items: ['Salad rau trộn lớn', 'Cá salmon áp chảo 120g', 'Khoai lang hấp 100g'], macro: '~35g P · ~50g C · ~14g F', note: 'Nhiều rau hơn, tinh bột vừa phải' },
    ],
  },
  {
    phase: 3, weeks: '5–8', weekCount: 4, label: 'Cá Nhân Hóa', emoji: '🎯',
    color: '#f59e0b', rgb: '245,158,11',
    goal: 'Điều chỉnh macro theo mục tiêu cụ thể, lịch tập, và phản hồi của cơ thể trong 4 tuần đo lường thực tế.',
    actions: [
      'Tính và theo dõi macro (P/C/F) hàng ngày qua app hoặc bảng tính',
      'Điều chỉnh calo theo ngày tập nặng/nhẹ/nghỉ',
      'Xây bữa pre/post workout phù hợp với lịch tập',
      'Meal prep 2 lần/tuần để tiết kiệm thời gian và đảm bảo đủ macro',
      'Đánh giá lại sau 2 tuần — điều chỉnh ±100–200 kcal nếu cần',
    ],
    checkpoints: ['Cơ thể thay đổi rõ theo mục tiêu', 'Macro được tối ưu từng loại ngày', 'Không còn lo lắng "ăn gì hôm nay"'],
    outcome: 'Đây là giai đoạn chuyển hóa quan trọng nhất. Kết quả rõ rệt về hình thể và hiệu suất tập luyện.',
    kcalMult: 1.0, compliance: 80,
    formula: s => `Ngày tập: ${s.trainingDayKcal.toLocaleString()} kcal · Ngày nghỉ: ${s.restDayKcal.toLocaleString()} kcal · Protein: ${s.proteinG}g cố định`,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '5', title: 'Bắt Đầu Đếm Macro', icon: '📊', focus: 'Cài app theo dõi · Nhập mục tiêu P/C/F · Ghi lại 3 ngày đầu không thay đổi gì', tip: 'Không cần 100% chính xác — sai 10% vẫn tốt hơn không đếm.' },
      { week: '6', title: 'Ngày Tập vs Ngày Nghỉ', icon: '⚖️', focus: 'Ngày tập thêm tinh bột · Ngày nghỉ giảm tinh bột · Protein giữ cố định mọi ngày', tip: 'Khác biệt nhỏ nhưng hiệu quả rõ sau 3–4 tuần kiên trì.' },
      { week: '7', title: 'Pre & Post Workout', icon: '🏋️', focus: 'Ăn carb trước tập 30–60 phút · Ăn protein sau tập trong 30 phút · Không tập bụng đói', tip: 'Chuối + sữa chua là pre-workout đơn giản và hiệu quả nhất.' },
      { week: '8', title: 'Đánh Giá & Điều Chỉnh', icon: '🔄', focus: 'Cân lại · So sánh với tuần 5 · Điều chỉnh ±150 kcal nếu không có kết quả', tip: 'Chụp ảnh cơ thể cùng góc mỗi 4 tuần để so sánh trực quan hơn cân nặng.' },
    ],
    grocery: ['Thịt bò nạc / ức gà / cá hồi tươi', 'Bơ đậu phộng / hạt hạnh nhân / trứng', 'Yến mạch / gạo lứt / khoai lang', 'Rau màu xanh đậm (spinach, cải xoăn)', 'Protein powder nếu thiếu protein từ thực phẩm'],
    mistakes: ['Theo dõi macro 100% → kiệt sức → bỏ luôn sau 2 tuần', 'Ăn thứ không ngon nhưng "sạch" → không bền vững', 'Không điều chỉnh sau 4 tuần dù không có kết quả'],
    science: 'Carb timing và protein distribution tối ưu khi ăn 30–40g protein mỗi bữa, tối đa hóa protein synthesis (MPS). Nghiên cứu trên Journal of Nutrition cho thấy ngày tập thêm 20–30g carb so với ngày nghỉ cải thiện hiệu suất 8–12% và phục hồi nhanh hơn 18%.',
    mealPlan: [
      { label: 'Sáng', time: '7:00', icon: '🌅', color: '#f59e0b', items: ['Yến mạch 60g + protein powder 1 scoop', '1 quả chuối', 'Cà phê đen'], macro: '~35g P · ~65g C · ~8g F', note: 'Carb cao sáng ngày tập cho năng lượng' },
      { label: 'Pre-Workout', time: '11:30', icon: '⚡', color: '#22c55e', items: ['Chuối 1 quả', 'Sữa chua Hy Lạp 150g', '(30 phút trước tập)'], macro: '~18g P · ~35g C · ~0g F', note: 'Carb + protein nhẹ = năng lượng tập tối ưu' },
      { label: 'Post-Workout', time: '14:00', icon: '💪', color: '#06b6d4', items: ['Cơm 1.5 chén (carb cao)', 'Ức gà 150g', 'Rau xào tỏi'], macro: '~45g P · ~75g C · ~8g F', note: '30 phút sau tập: ưu tiên protein + carb nhanh' },
      { label: 'Tối', time: '19:00', icon: '🌙', color: '#a855f7', items: ['Salad nhiều rau', 'Cá hồi 120g + 2 trứng', 'Ít hoặc không cơm'], macro: '~48g P · ~20g C · ~18g F', note: 'Bữa tối nhẹ carb, cao protein, nhiều rau' },
    ],
  },
  {
    phase: 4, weeks: '9–12', weekCount: 4, label: 'Tối Ưu & Duy Trì', emoji: '🏆',
    color: '#a855f7', rgb: '168,85,247',
    goal: 'Tối ưu hóa chiến lược carb cycling và xây dựng thói quen bền vững sẵn sàng cho giai đoạn tiếp theo.',
    actions: [
      'Áp dụng carb cycling: cao ngày tập nặng, thấp ngày nghỉ',
      'Theo dõi body composition (cân Inbody nếu có) mỗi 4 tuần',
      'Điều chỉnh kế hoạch theo kết quả 4–6 tuần qua',
      'Thực hành 80/20 rule: 80% đúng nền, 20% linh hoạt',
      'Chuẩn bị chiến lược cho giai đoạn tiếp theo (tuần 13+)',
    ],
    checkpoints: ['Đạt hoặc gần đạt mục tiêu ban đầu', 'Thói quen được tự động hóa', 'Sẵn sàng cho phase nâng cao'],
    outcome: 'Hoàn thành 12 tuần. Cơ thể và thói quen sẵn sàng cho giai đoạn nâng cao hơn nếu muốn tiếp tục.',
    kcalMult: 1.02, compliance: 86,
    formula: s => `Carb cycling: ${s.heavyDayCarbG}g nặng / ${s.lightDayCarbG}g nghỉ · ${(s.proteinG/s.weight).toFixed(1)}g protein/kg`,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '9', title: 'Carb Cycling Chính Thức', icon: '🔄', focus: 'Ngày nặng: thêm ~50g carb · Ngày nghỉ: giảm ~50g carb · Protein không đổi', tip: 'Ngày carb cao: tập nhóm cơ lớn (chân, lưng). Ngày carb thấp: cardio nhẹ hoặc nghỉ hoàn toàn.' },
      { week: '10', title: 'Tối Ưu Hiệu Suất', icon: '⚡', focus: 'Tăng tải tập 5–10% · Đảm bảo ngủ ≥7h · Creatine nếu phù hợp', tip: 'Creatine monohydrate 3–5g/ngày — an toàn, hiệu quả nhất cho sức mạnh.' },
      { week: '11', title: 'Đánh Giá Hình Thể', icon: '📏', focus: 'Đo vòng eo/hông/đùi · Chụp ảnh so sánh · Cập nhật TDEE nếu cân nặng thay đổi ≥2kg', tip: 'Cân nặng không phải thước đo duy nhất — số đo và ảnh quan trọng không kém.' },
      { week: '12', title: 'Chuẩn Bị Giai Đoạn 2', icon: '🚀', focus: 'Ghi lại những gì hiệu quả · Xác định mục tiêu mới · Lên kế hoạch cho tuần 13+', tip: 'Tăng/giảm mục tiêu kcal 100–200 tùy kết quả 12 tuần thực tế của bạn.' },
    ],
    grocery: ['Đa dạng protein: cá ngừ / tôm / squid / đậu lăng', 'Đậu đen / đậu nành (protein thực vật)', 'Quinoa / bulgur / lúa mạch', 'Berries: việt quất / dâu / raspberry (thấp đường, cao antioxidant)', 'Trứng omega-3 / phô mai ít béo'],
    mistakes: ['Carb cycle quá khắc nghiệt → mệt mỏi mãn tính → bỏ', 'Không theo dõi tiến độ → không biết điều chỉnh gì', 'Hoàn thành 12 tuần rồi quay về thói quen cũ hoàn toàn'],
    science: 'Carb cycling khai thác cơ chế insulin sensitivity. Sau buổi tập, cơ nhạy với insulin hơn 300%, hấp thụ glucose hiệu quả hơn mà không tích trữ mỡ. Journal of the International Society of Sports Nutrition: carb cycling duy trì lean mass tốt hơn 15% so với low-carb cố định khi cắt giảm calo.',
    mealPlan: [
      { label: 'Sáng (High-Carb)', time: '7:00', icon: '🌅', color: '#f59e0b', items: ['Yến mạch 80g + mật ong 1 thìa', '3 lòng trắng + 1 trứng nguyên', 'Chuối 1 quả'], macro: '~32g P · ~85g C · ~10g F', note: 'High-carb day: ăn nhiều tinh bột buổi sáng' },
      { label: 'Pre-Workout', time: '12:00', icon: '⚡', color: '#22c55e', items: ['Cơm 2 chén', 'Thịt bò xào nạc 100g', '(60 phút trước tập nặng)'], macro: '~28g P · ~80g C · ~8g F', note: 'Nạp carb đỉnh điểm trước tập nặng' },
      { label: 'Post-Workout', time: '15:30', icon: '💪', color: '#06b6d4', items: ['Protein shake 40g whey', 'Chuối 2 quả', 'Bánh rice cake 3 cái'], macro: '~42g P · ~60g C · ~3g F', note: 'Nạp nhanh: đơn giản, hiệu quả, dễ tiêu' },
      { label: 'Tối', time: '19:00', icon: '🌙', color: '#a855f7', items: ['Ức gà / cá hồi 150g', 'Khoai lang 100g', 'Broccoli hấp 200g'], macro: '~45g P · ~40g C · ~10g F', note: 'Duy trì protein, giảm dần carb buổi tối' },
    ],
  },
  {
    phase: 5, weeks: '13–18', weekCount: 6, label: 'Nâng Tầm', emoji: '⚡',
    color: '#ec4899', rgb: '236,72,153',
    goal: 'Tối ưu hiệu suất vận động và bắt đầu tư duy dinh dưỡng theo tiêu chuẩn vận động viên nghiệp dư có mục tiêu cụ thể.',
    actions: [
      'Cập nhật TDEE sau mỗi 4 tuần (cân nặng thay đổi → TDEE thay đổi)',
      'Áp dụng periodized nutrition theo chu kỳ tập mesocycle 4–6 tuần',
      'Pre/post workout protocol cố định mỗi buổi tập',
      'Xem xét supplement phù hợp (creatine monohydrate, omega-3, vitamin D)',
      'Theo dõi biến thể thể thao: sức mạnh 1RM, sức bền, thời gian phục hồi',
    ],
    checkpoints: ['Hiệu suất tập vượt đỉnh cũ trước đó', 'Recovery time rút ngắn rõ rệt', 'Cơ thể vận hành ở trạng thái tối ưu'],
    outcome: 'Dinh dưỡng trở thành công cụ hiệu suất. Cơ thể đang ở trạng thái tốt nhất từ trước đến nay.',
    kcalMult: 1.04, compliance: 88,
    formula: s => `TDEE cập nhật định kỳ · Pre: ${s.preWorkoutCarbG}g carb · Post: ${s.postWorkoutProteinG}g P + ${s.postWorkoutCarbG}g C`,
    image: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '13–14', title: 'Cập Nhật TDEE', icon: '📈', focus: 'Cân lại · Tính TDEE mới · Điều chỉnh target kcal · Cập nhật bảng macro', tip: 'Cứ giảm 1kg, TDEE giảm ~8–10 kcal → phải điều chỉnh để không plateau.' },
      { week: '15–16', title: 'Periodized Nutrition', icon: '📉', focus: 'Tuần tập nặng: +150 kcal · Tuần deload: -100 kcal · Protein luôn ≥ 1.8g/kg', tip: 'Deload tuần 16 là bắt buộc — cơ thể cần nghỉ để phát triển tiếp theo.' },
      { week: '17–18', title: 'Tối Ưu Supplement', icon: '💊', focus: 'Creatine 5g/ngày · Omega-3 2g/ngày · Vitamin D3 1000–2000IU · Magnesium 300mg tối', tip: 'Supplement chỉ là 5–10% kết quả. Nền tảng dinh dưỡng vẫn là quan trọng nhất.' },
    ],
    grocery: ['Thịt đỏ nạc 1–2 lần/tuần (sắt + kẽm + B12)', 'Sữa / phô mai ít béo / kefir', 'Củ cải / bí ngô / ớt chuông / cà rốt', 'Hạt chia / flaxseed (omega-3 thực vật)', 'Cá béo: cá thu / cá mòi / cá hồi'],
    mistakes: ['Thay đổi supplement liên tục mà không đo kết quả', 'Bỏ deload vì "tốn thời gian" → overtraining và chấn thương', 'Tin tưởng marketing supplement hơn bằng chứng khoa học'],
    science: 'Block periodization phát triển từ thể thao Olympic. Nghiên cứu so sánh giữa undulating periodization và block periodization cho thấy sức mạnh tăng 30–40% so với tập đều đặn không có chu kỳ sau 12 tuần. Cơ thể cần stress + recovery xen kẽ theo chu kỳ để phát triển tối đa.',
    mealPlan: [
      { label: 'Sáng', time: '6:30', icon: '🌅', color: '#f59e0b', items: ['Protein oats: yến mạch + whey + hạt chia', '3 trứng nguyên quả', 'Dâu tây / việt quất 100g'], macro: '~45g P · ~65g C · ~18g F', note: 'Dense nutrition cho ngày tập sáng sớm' },
      { label: 'Pre-Workout', time: '9:30', icon: '⚡', color: '#22c55e', items: ['Chuối 1 quả + peanut butter 2 thìa', 'Creatine 5g pha nước', 'Caffeine nếu cần (cà phê / trà)'], macro: '~8g P · ~32g C · ~10g F', note: 'Protocol cố định — cùng thứ mỗi buổi tập' },
      { label: 'Post-Workout', time: '12:00', icon: '💪', color: '#06b6d4', items: ['Cơm gạo trắng 2 chén (GI cao = nạp nhanh)', 'Ức gà 160g / protein shake', 'Cà rốt / bông cải hấp'], macro: '~50g P · ~90g C · ~8g F', note: 'Anabolic window: protein + fast carb trong 30 phút sau tập' },
      { label: 'Tối', time: '19:00', icon: '🌙', color: '#a855f7', items: ['Thịt bò nạc / cá ngừ 150g', 'Salad quinoa + rau nhiều màu', 'Omega-3 2g + Magnesium 300mg'], macro: '~48g P · ~35g C · ~16g F', note: 'Bữa tối chất lượng cao + supplement buổi tối' },
    ],
  },
  {
    phase: 6, weeks: '19–24', weekCount: 6, label: 'Bền Vững Trọn Đời', emoji: '🌟',
    color: '#84cc16', rgb: '132,204,22',
    goal: 'Tích hợp dinh dưỡng vào lối sống như một bản năng tự nhiên — không còn cần "cố gắng" hay cảm giác đang "kiêng ăn".',
    actions: [
      'Check-in dinh dưỡng định kỳ mỗi tuần, điều chỉnh khi có thay đổi lớn',
      'Áp dụng intuitive eating có chọn lọc — tin tưởng tín hiệu cơ thể',
      'Huấn luyện 80/20 rule tự động — không cần theo dõi từng bữa',
      'Duy trì tư duy "đều quan trọng hơn hoàn hảo" mọi ngày',
      'Lan tỏa thói quen tốt trong gia đình và cộng đồng xung quanh',
    ],
    checkpoints: ['Không còn cảm giác "đang kiêng ăn"', 'Dinh dưỡng trở thành bản năng', 'Kết quả duy trì tự nhiên không cần nỗ lực'],
    outcome: 'Dinh dưỡng không còn là gánh nặng — là một phần tự nhiên, bền vững của cuộc sống khỏe mạnh.',
    kcalMult: 1.0, compliance: 91,
    formula: s => `80% ăn đúng nền + 20% linh hoạt · Protein tuần: ${s.weeklyProteinG}g · Cân nặng ±1kg ổn định`,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=75&auto=format&fit=crop',
    weekBreakdown: [
      { week: '19–20', title: 'Intuitive Eating', icon: '🧠', focus: 'Ăn khi đói thật sự · Dừng khi 80% no · Không theo dõi calo hàng ngày', tip: 'Vẫn track protein 3–4 ngày/tuần để đảm bảo không thiếu hụt.' },
      { week: '21–22', title: '80/20 Rule Tự Động', icon: '⚖️', focus: '80% bữa ăn đúng nền · 20% linh hoạt không tội lỗi · Không "bù lại" bữa sau', tip: 'Hình dung: 17/21 bữa mỗi tuần đúng nền = thành công hoàn toàn.' },
      { week: '23–24', title: 'Lifestyle Integration', icon: '🌱', focus: 'Chia sẻ thói quen với gia đình · Nấu ăn lành mạnh cùng nhau · Là hình mẫu cho người thân', tip: 'Môi trường ăn uống lành mạnh quan trọng hơn ý chí cá nhân bất kỳ.' },
    ],
    grocery: ['Không còn danh sách cố định — mua theo mùa', 'Ưu tiên thực phẩm địa phương, tươi nhất có thể', 'Đa dạng màu sắc trong rổ rau mỗi tuần', 'Gia vị phong phú để nấu ngon mà không cần nhiều dầu mỡ', 'Thực phẩm cả gia đình đều thích'],
    mistakes: ['Quay về lối ăn cũ sau khi "xong 24 tuần"', 'Không duy trì kiểm tra tối thiểu → drift dần theo năm tháng', 'Áp đặt thói quen ăn lành mạnh lên người khác → gây phản tác dụng'],
    science: 'Nghiên cứu dài hạn (>2 năm, n=8000+) cho thấy người áp dụng mindful eating kết hợp 80/20 rule duy trì kết quả tốt hơn 3× so với người theo chế độ kiêng nghiêm ngặt. "Compliance beats perfection" — tính nhất quán 80% trong 5 năm tạo ra kết quả tốt hơn hoàn hảo 100% trong 3 tháng.',
    mealPlan: [
      { label: 'Sáng', time: 'Tùy thích', icon: '🌅', color: '#f59e0b', items: ['Bất kỳ bữa có ≥20g protein', 'Rau hoặc trái cây 1 phần', 'Carb phù hợp mức vận động hôm đó'], macro: 'Theo bản năng ±', note: 'Nguyên tắc, không phải công thức cứng nhắc' },
      { label: 'Trưa', time: 'Bất kỳ', icon: '☀️', color: '#22c55e', items: ['½ đĩa rau (cảm giác, không cân)', '¼ đĩa đạm (cảm giác)', '¼ đĩa tinh bột (cảm giác)'], macro: 'Theo bản năng', note: '5 năm thực hành tạo bản năng ăn đúng' },
      { label: 'Tối gia đình', time: 'Cùng gia đình', icon: '🌙', color: '#a855f7', items: ['Bữa ăn gia đình thông thường', 'Chú ý: có rau + đạm là đủ', 'Thưởng thức không cảm giác tội lỗi'], macro: 'Linh hoạt', note: '20% linh hoạt — không phá hỏng 80% còn lại' },
      { label: 'Xã hội', time: 'Cuối tuần', icon: '🎉', color: '#06b6d4', items: ['Ăn ngoài / tiệc tùng thoải mái', 'Quay lại nền ngay bữa tiếp theo', 'Không tự phán xét bản thân'], macro: 'Tận hưởng', note: 'Bền vững = có thể sống được lâu dài với niềm vui' },
    ],
  },
];

const FAQS = [
  { q: 'Tôi có cần theo cả 24 tuần không?', a: '12 tuần đầu (phase 1–4) là đủ cho hầu hết mọi người. 24 tuần (phase 5–6) dành cho ai muốn tối ưu hơn nữa hoặc có mục tiêu thể thao cụ thể. Bắt đầu với 12 tuần, đánh giá kết quả thực tế, rồi quyết định tiếp tục hay không.' },
  { q: 'Nếu tôi bỏ lỡ một tuần thì sao?', a: 'Tiếp tục phase đó, đừng bỏ qua hoặc nhảy sang phase tiếp theo. Không cần "bù lại" — chỉ cần quay về kế hoạch ngay bữa tiếp theo. Một tuần lỡ không phá hỏng 11 tuần đã làm tốt.' },
  { q: 'Tôi có thể thay đổi thứ tự các phase không?', a: 'Không khuyến khích. Mỗi phase xây trên nền của phase trước. Nhảy thẳng vào carb cycling (phase 4) mà chưa có thói quen cơ bản (phase 1–2) thường thất bại trong 2–3 tuần.' },
  { q: 'Con số macro/kcal của tôi có chính xác 100% không?', a: 'Không có công thức nào chính xác 100%. Đây là ước tính dựa trên Mifflin-St Jeor — chính xác ±10–15% cho phần lớn người. Sau 2–4 tuần theo dõi và quan sát cơ thể, bạn sẽ biết cần điều chỉnh tăng hay giảm.' },
  { q: 'Tôi phải cân thực phẩm không?', a: 'Phase 1–2: không cần. Phase 3–4: nên cân vài lần để hiệu chỉnh mắt nhận biết khẩu phần. Phase 5–6: chỉ cân khi cần kiểm tra. Mục tiêu cuối cùng là ăn đúng mà không cần cân đo.' },
  { q: 'Nếu cân nặng không thay đổi sau 2 tuần?', a: 'Giảm 150–200 kcal/ngày hoặc tăng thêm hoạt động thể chất. Cân nặng không nhất thiết phải thay đổi mỗi tuần — đo thêm vòng eo và chụp ảnh cơ thể để có đánh giá toàn diện hơn.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: `opacity 0.55s ${delay}ms, transform 0.55s ${delay}ms` }}>
      {children}
    </div>
  );
}

function MacroDonut({ s }) {
  const segs = [
    { label: 'Protein', pct: s.proteinPct, color: '#84cc16', g: s.proteinG },
    { label: 'Carb',    pct: s.carbPct,    color: '#06b6d4', g: s.carbG    },
    { label: 'Fat',     pct: s.fatPct,     color: '#f59e0b', g: s.fatG     },
  ];
  const R = 48, CX = 64, CY = 64;
  let angle = -90;
  const arcs = segs.map(seg => {
    const startA = angle;
    const sweep = Math.max(seg.pct * 3.6, 1);
    angle += seg.pct * 3.6;
    const toR = a => a * Math.PI / 180;
    const x1 = CX + R * Math.cos(toR(startA));
    const y1 = CY + R * Math.sin(toR(startA));
    const x2 = CX + R * Math.cos(toR(startA + sweep));
    const y2 = CY + R * Math.sin(toR(startA + sweep));
    return { ...seg, d: `M ${CX} ${CY} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z` };
  });
  return (
    <div className="flex items-center gap-5">
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ overflow: 'visible', flexShrink: 0 }}>
        <circle cx={CX} cy={CY} r={R + 5} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {arcs.map((a, i) => <path key={i} d={a.d} fill={`${a.color}20`} stroke={a.color} strokeWidth="2.5" />)}
        <circle cx={CX} cy={CY} r={32} fill="#0a0a0a" />
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.85)">{(s.targetKcal / 1000).toFixed(1)}k</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="8" fill="#6b7280">kcal/ngày</text>
      </svg>
      <div className="space-y-2">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} />
            <span className="text-[11px] font-bold" style={{ color: a.color }}>{a.label}</span>
            <span className="text-[11px] text-muted">{a.g}g</span>
            <span className="text-[10px] text-muted/50">({a.pct}%)</span>
          </div>
        ))}
        <div className="pt-1 border-t border-border/15">
          <p className="text-[9px] text-muted/40">BMR {s.bmr.toLocaleString()} kcal · TDEE {s.tdee.toLocaleString()} kcal</p>
        </div>
      </div>
    </div>
  );
}

function ComplianceChart({ showAll, activePhase }) {
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const totalWeeks = phases.reduce((a, p) => a + p.weekCount, 0);
  const W = 560, H = 150, PL = 32, PR = 14, PT = 16, PB = 36;
  const cW = W - PL - PR, cH = H - PT - PB;

  const points = [];
  let wCursor = 0;
  phases.forEach(ph => {
    for (let w = 1; w <= ph.weekCount; w++) {
      wCursor++;
      const t = wCursor / totalWeeks;
      const c = 50 + 42 / (1 + Math.exp(-9 * (t - 0.35)));
      points.push({ w: wCursor, c, color: ph.color });
    }
  });

  const xOf = w => PL + (w / totalWeeks) * cW;
  const yOf = c => PT + cH * (1 - (c - 46) / 52);
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xOf(p.w)} ${yOf(p.c)}`).join(' ');

  // Active phase range
  let xScan = 0;
  const phaseRanges = phases.map(ph => {
    const start = xScan;
    xScan += ph.weekCount;
    return { start, end: xScan };
  });
  const activeRange = phaseRanges[Math.min(activePhase, phaseRanges.length - 1)];

  let xScan2 = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="nr-comp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#84cc16" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.01" />
        </linearGradient>
        <clipPath id="nr-comp-clip">
          <rect x={PL} y={PT} width={cW} height={cH} />
        </clipPath>
      </defs>

      {/* Active phase highlight */}
      {activeRange && (
        <rect x={xOf(activeRange.start)} y={PT} width={xOf(activeRange.end) - xOf(activeRange.start)} height={cH}
          fill={`${ROADMAP_PHASES[Math.min(activePhase, phases.length-1)].color}10`} rx="2" />
      )}

      {/* Grid lines */}
      {[60, 70, 80, 90].map(c => (
        <g key={c}>
          <line x1={PL} y1={yOf(c)} x2={W - PR} y2={yOf(c)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PL - 4} y={yOf(c) + 3} textAnchor="end" fontSize="7.5" fill="#4b5563">{c}%</text>
        </g>
      ))}

      {/* Fill */}
      <path d={`${pathD} L ${xOf(totalWeeks)} ${PT + cH} L ${PL} ${PT + cH} Z`} fill="url(#nr-comp-grad)" clipPath="url(#nr-comp-clip)" />
      <path d={pathD} fill="none" stroke="url(#nr-comp-line)" strokeWidth="2.5" strokeLinejoin="round" clipPath="url(#nr-comp-clip)" />

      {/* Phase separators + labels */}
      {phases.map(ph => {
        const midW = xScan2 + ph.weekCount / 2;
        const borderX = xOf(xScan2 + ph.weekCount);
        const labelX = xOf(midW);
        xScan2 += ph.weekCount;
        return (
          <g key={ph.phase}>
            {xScan2 < totalWeeks && (
              <line x1={borderX} y1={PT} x2={borderX} y2={PT + cH} stroke={ph.color} strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
            )}
            <text x={labelX} y={PT + cH + 18} textAnchor="middle" fontSize="9" fill={`${ph.color}cc`}>{ph.emoji} {ph.label}</text>
            <text x={labelX} y={PT + cH + 30} textAnchor="middle" fontSize="7" fill="#6b7280">T{ph.weeks}</text>
          </g>
        );
      })}

      {/* Milestone dots */}
      {points.filter(p => [2, 4, 8, 12, 18, 24].includes(p.w) && p.w <= totalWeeks).map(p => (
        <g key={p.w}>
          <circle cx={xOf(p.w)} cy={yOf(p.c)} r="5" fill={p.color} opacity="0.2" />
          <circle cx={xOf(p.w)} cy={yOf(p.c)} r="3" fill={p.color} />
          <text x={xOf(p.w)} y={yOf(p.c) - 8} textAnchor="middle" fontSize="7.5" fontWeight="600" fill={p.color}>{Math.round(p.c)}%</text>
        </g>
      ))}

      <text x={W - PR} y={PT - 4} textAnchor="end" fontSize="7.5" fill="#4b5563">% Tuân thủ</text>
    </svg>
  );
}

function CalorieChart({ s, showAll, activePhase, onSelect }) {
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const W = 560, H = 110, PL = 40, PR = 14, PT = 12, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;
  const totalWeeks = phases.reduce((a, p) => a + p.weekCount, 0);
  const kcals = phases.map(p => Math.round(s.targetKcal * p.kcalMult));
  const maxK = Math.max(...kcals, s.tdee) * 1.08;
  const minK = Math.min(...kcals, s.tdee) * 0.92;
  const yOf = k => PT + cH * (1 - (k - minK) / (maxK - minK));
  const tdeeY = yOf(s.tdee);
  let xScan = PL;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible', cursor: 'pointer' }}>
      <line x1={PL} y1={tdeeY} x2={W - PR} y2={tdeeY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="5 4" />
      <text x={PL - 3} y={tdeeY + 3} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.3)">TDEE</text>
      {phases.map((ph, i) => {
        const barW = (ph.weekCount / totalWeeks) * cW - 4;
        const kcal = kcals[i];
        const bY = yOf(kcal);
        const bH = PT + cH - bY;
        const x = xScan + 2;
        xScan += (ph.weekCount / totalWeeks) * cW;
        const isActive = i === Math.min(activePhase, phases.length - 1);
        return (
          <g key={ph.phase} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
            <rect x={x} y={bY} width={barW} height={bH} fill={`${ph.color}${isActive ? '28' : '12'}`} rx="4" />
            {isActive && <rect x={x} y={bY} width={barW} height={3.5} fill={ph.color} rx="2" />}
            <text x={x + barW / 2} y={bY - 6} textAnchor="middle" fontSize="8.5" fontWeight={isActive ? '700' : '500'} fill={`${ph.color}${isActive ? 'ee' : '88'}`}>
              {(kcal / 1000).toFixed(1)}k
            </text>
            <text x={x + barW / 2} y={PT + cH + 18} textAnchor="middle" fontSize="8" fill={isActive ? ph.color : '#6b7280'}>{ph.emoji}</text>
          </g>
        );
      })}
      <text x={PL - 3} y={PT + cH / 2} textAnchor="end" fontSize="7" fill="#4b5563">kcal</text>
    </svg>
  );
}

function ChecklistItem({ id, text, checked, onToggle, color = LIME }) {
  return (
    <button onClick={() => onToggle(id)} className="flex items-start gap-2.5 w-full text-left group py-1">
      <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
        style={checked ? { background: color, borderColor: color } : { borderColor: `${color}50`, background: 'transparent' }}>
        {checked && <svg viewBox="0 0 10 8" fill="none" width="9" height="9"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className={`text-[10px] leading-relaxed transition-colors duration-200 ${checked ? 'line-through opacity-40' : 'text-muted group-hover:text-text/80'}`}>{text}</span>
    </button>
  );
}

function InputPanel({ inputs, setInputs, s, open, setOpen }) {
  const act = ACTIVITY_LEVELS.find(a => a.key === inputs.activityKey) || ACTIVITY_LEVELS[2];
  const goal = GOAL_MODIFIERS.find(g => g.key === inputs.goalKey) || GOAL_MODIFIERS[1];
  const numFld = (label, key, min, max, unit) => (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-bold text-muted uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-1.5 rounded-lg border border-border/25 bg-surface/20 px-2.5 py-1.5">
        <input type="number" min={min} max={max} value={inputs[key]}
          onChange={e => setInputs(p => ({ ...p, [key]: +e.target.value }))}
          className="w-14 bg-transparent text-[11px] font-bold text-text outline-none" />
        <span className="text-[9px] text-muted/60">{unit}</span>
      </div>
    </div>
  );
  return (
    <div className="rounded-2xl border border-lime-500/20 bg-lime-500/4 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-lime-500/5 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-base">⚙️</span>
          <div className="text-left">
            <p className="text-xs font-bold text-lime-400">Thông Số Cá Nhân</p>
            <p className="text-[9px] text-muted mt-0.5">{inputs.weight}kg · {inputs.height}cm · {inputs.age}t · {inputs.sex === 'male' ? 'Nam' : 'Nữ'} · {act.label} · {goal.label} — <span className="text-lime-400 font-semibold">{s.targetKcal.toLocaleString()} kcal</span></p>
          </div>
        </div>
        <span className="text-muted/60 text-xs transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-lime-500/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {numFld('Cân nặng', 'weight', 30, 200, 'kg')}
            {numFld('Chiều cao', 'height', 100, 230, 'cm')}
            {numFld('Tuổi', 'age', 12, 80, 'tuổi')}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Giới tính</label>
              <div className="flex gap-1.5">
                {['male', 'female'].map(v => (
                  <button key={v} onClick={() => setInputs(p => ({ ...p, sex: v }))}
                    className="flex-1 rounded-lg border text-[9px] font-bold py-1.5 transition-all"
                    style={inputs.sex === v ? { borderColor: LIME, background: `${LIME}18`, color: LIME } : { borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }}>
                    {v === 'male' ? '♂ Nam' : '♀ Nữ'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Mức vận động</p>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_LEVELS.map(a => (
                <button key={a.key} onClick={() => setInputs(p => ({ ...p, activityKey: a.key }))}
                  className="px-2.5 py-1 rounded-lg border text-[9px] font-bold transition-all"
                  style={inputs.activityKey === a.key ? { borderColor: LIME, background: `${LIME}18`, color: LIME } : { borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Mục tiêu</p>
            <div className="flex gap-2">
              {GOAL_MODIFIERS.map(g => (
                <button key={g.key} onClick={() => setInputs(p => ({ ...p, goalKey: g.key }))}
                  className="flex-1 px-2 py-2 rounded-xl border text-[9px] font-bold text-center transition-all"
                  style={inputs.goalKey === g.key ? { borderColor: LIME, background: `${LIME}18`, color: LIME } : { borderColor: 'rgba(255,255,255,0.1)', color: '#6b7280' }}>
                  <div className="text-base mb-0.5">{g.emoji}</div>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseCard({ ph, s, checks, onCheck, mealPlan }) {
  const [tab, setTab] = useState('actions');
  const tabs = [
    { id: 'actions', label: '📋 Hành Động' },
    { id: 'meals', label: '🍽️ Thực Đơn' },
    { id: 'weeks', label: '📅 Lịch Tuần' },
    { id: 'science', label: '🔬 Khoa Học' },
  ];
  return (
    <div className="rounded-3xl border overflow-hidden" style={{ borderColor: `${ph.color}20`, background: `${ph.color}05` }}>
      {/* Phase image banner */}
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img src={ph.image} alt={ph.label} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${ph.color}60 0%, rgba(10,10,10,0.8) 60%, rgba(10,10,10,0.95) 100%)` }} />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="flex items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: ph.color }}>Giai Đoạn {ph.phase} · Tuần {ph.weeks}</span>
                <span className="text-[8px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${ph.color}30`, color: ph.color, background: 'rgba(10,10,10,0.5)' }}>
                  ~{ph.compliance}% tuân thủ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{ph.emoji}</span>
                <h2 className="text-2xl font-black text-white">{ph.label}</h2>
              </div>
            </div>
            <div className="ml-auto text-right hidden md:block">
              <p className="text-[9px] text-white/50 mb-0.5">Calo mục tiêu</p>
              <p className="text-lg font-black" style={{ color: ph.color }}>{Math.round(s.targetKcal * ph.kcalMult).toLocaleString()}</p>
              <p className="text-[8px] text-white/40">kcal/ngày</p>
            </div>
          </div>
          <p className="text-[10px] text-white/65 leading-relaxed mt-2 max-w-lg">{ph.goal}</p>
        </div>
      </div>

      {/* Personalized formula strip */}
      <div className="px-5 py-2.5 border-b" style={{ borderColor: `${ph.color}15`, background: `${ph.color}08` }}>
        <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: ph.color }}>Công Thức Cá Nhân Hóa</p>
        <p className="text-[10px] text-text font-mono">{ph.formula(s)}</p>
      </div>

      {/* Tab nav */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: `${ph.color}15` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-[9px] font-bold whitespace-nowrap transition-all border-b-2"
            style={tab === t.id
              ? { borderColor: ph.color, color: ph.color, background: `${ph.color}08` }
              : { borderColor: 'transparent', color: '#6b7280' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {tab === 'actions' && (
          <div className="grid md:grid-cols-2 gap-5">
            {/* Actions + checklist */}
            <div>
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-3">5 Hành Động Chính</p>
              <div className="space-y-1.5">
                {ph.actions.map((a, i) => (
                  <ChecklistItem key={i} id={`ph${ph.phase}-a${i}`} text={a} checked={!!checks[`ph${ph.phase}-a${i}`]} onToggle={onCheck} color={ph.color} />
                ))}
              </div>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: `${ph.color}15` }}>
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Mốc Kiểm Tra</p>
                <div className="space-y-2">
                  {ph.checkpoints.map((cp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: `${ph.color}40`, background: `${ph.color}10` }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: ph.color }} />
                      </div>
                      <p className="text-[10px] text-muted leading-relaxed">{cp}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-xl p-3 border" style={{ borderColor: `${ph.color}20`, background: `${ph.color}06` }}>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: ph.color }}>Kết Quả Kỳ Vọng</p>
                <p className="text-[10px] text-muted leading-relaxed">{ph.outcome}</p>
              </div>
            </div>

            {/* Grocery + mistakes */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">🛒 Danh Sách Thực Phẩm</p>
                <div className="space-y-1.5">
                  {ph.grocery.map((g, i) => (
                    <ChecklistItem key={i} id={`ph${ph.phase}-g${i}`} text={g} checked={!!checks[`ph${ph.phase}-g${i}`]} onToggle={onCheck} color={ph.color} />
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-3 border border-red-500/15 bg-red-500/5">
                <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider mb-2">⚠️ Sai Lầm Phổ Biến</p>
                {ph.mistakes.map((m, i) => (
                  <div key={i} className="flex items-start gap-1.5 mb-1.5 last:mb-0">
                    <span className="text-red-400 text-[9px] mt-0.5">✕</span>
                    <p className="text-[10px] text-muted/80 leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'meals' && (
          <div>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-4">Thực Đơn Mẫu Giai Đoạn {ph.phase}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {mealPlan.map((meal, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ borderColor: `${meal.color}20`, background: `${meal.color}06` }}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xl">{meal.icon}</span>
                    <div>
                      <p className="text-[11px] font-bold" style={{ color: meal.color }}>{meal.label}</p>
                      <p className="text-[9px] text-muted">{meal.time}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-[8px] font-mono text-muted/60">{meal.macro}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-2.5">
                    {meal.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[10px] text-muted">
                        <span className="text-[8px] mt-1" style={{ color: `${meal.color}80` }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[9px] text-muted/60 italic border-t pt-2" style={{ borderColor: `${meal.color}15` }}>{meal.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl p-3 border border-border/20 bg-surface/5">
              <p className="text-[9px] text-muted/50">💡 Thực đơn mẫu — có thể thay thế nguyên liệu tương đương. Ưu tiên thực phẩm tươi, ít chế biến. Macro trên là ước tính, điều chỉnh theo cân nặng và kết quả thực tế.</p>
            </div>
          </div>
        )}

        {tab === 'weeks' && (
          <div>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-4">Kế Hoạch Từng Tuần</p>
            <div className="space-y-3">
              {ph.weekBreakdown.map((wk, i) => (
                <div key={i} className="rounded-2xl border p-4" style={{ borderColor: `${ph.color}18`, background: `${ph.color}05` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0" style={{ background: `${ph.color}15`, border: `1px solid ${ph.color}30` }}>
                      {wk.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: ph.color }}>Tuần {wk.week}</p>
                        <p className="text-[11px] font-bold text-text">{wk.title}</p>
                      </div>
                      <p className="text-[10px] text-muted leading-relaxed mb-2">{wk.focus}</p>
                      <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${ph.color}08` }}>
                        <span className="text-[9px]" style={{ color: ph.color }}>💡</span>
                        <p className="text-[9px] text-muted/80">{wk.tip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'science' && (
          <div className="space-y-4">
            <div className="rounded-2xl border p-4" style={{ borderColor: `${ph.color}20`, background: `${ph.color}06` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🔬</span>
                <p className="text-[11px] font-bold text-text">Cơ Sở Khoa Học</p>
              </div>
              <p className="text-[10px] text-muted leading-relaxed">{ph.science}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border p-3.5 text-center" style={{ borderColor: `${ph.color}18`, background: `${ph.color}06` }}>
                <p className="text-2xl font-black" style={{ color: ph.color }}>{ph.compliance}%</p>
                <p className="text-[9px] text-muted mt-1">Tỷ lệ tuân thủ<br />dự kiến cuối giai đoạn</p>
              </div>
              <div className="rounded-xl border p-3.5 text-center" style={{ borderColor: `${ph.color}18`, background: `${ph.color}06` }}>
                <p className="text-2xl font-black" style={{ color: ph.color }}>{ph.weekCount}</p>
                <p className="text-[9px] text-muted mt-1">Tuần<br />trong giai đoạn này</p>
              </div>
              <div className="rounded-xl border p-3.5 text-center" style={{ borderColor: `${ph.color}18`, background: `${ph.color}06` }}>
                <p className="text-xl font-black" style={{ color: ph.color }}>{Math.round(s.targetKcal * ph.kcalMult).toLocaleString()}</p>
                <p className="text-[9px] text-muted mt-1">kcal/ngày<br />mục tiêu của bạn</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneTimeline({ showAll }) {
  const milestones = showAll ? [
    { w: 2, label: 'Kiểm tra đầu tiên', icon: '📋', color: '#22c55e', desc: 'Đánh giá thói quen nền' },
    { w: 4, label: 'Chuẩn hóa xong', icon: '📐', color: '#06b6d4', desc: 'Meal prep chạy ổn' },
    { w: 8, label: 'Đánh giá hình thể', icon: '📏', color: '#f59e0b', desc: 'Chụp ảnh, đo số đo' },
    { w: 12, label: 'Hoàn thành 12 tuần', icon: '🏆', color: '#a855f7', desc: 'Milestone quan trọng' },
    { w: 18, label: 'Advanced check', icon: '⚡', color: '#ec4899', desc: 'Nâng tầm hiệu suất' },
    { w: 24, label: 'Lifestyle locked', icon: '🌟', color: '#84cc16', desc: 'Bền vững trọn đời' },
  ] : [
    { w: 2, label: 'Kiểm tra đầu tiên', icon: '📋', color: '#22c55e', desc: 'Đánh giá thói quen nền' },
    { w: 4, label: 'Chuẩn hóa xong', icon: '📐', color: '#06b6d4', desc: 'Meal prep chạy ổn' },
    { w: 8, label: 'Đánh giá hình thể', icon: '📏', color: '#f59e0b', desc: 'Chụp ảnh, đo số đo' },
    { w: 12, label: 'Hoàn thành!', icon: '🏆', color: '#a855f7', desc: 'Thói quen được tự động hóa' },
  ];
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex gap-0 min-w-max mx-auto px-4" style={{ width: 'max-content' }}>
        {milestones.map((m, i) => (
          <div key={m.w} className="flex items-center">
            <div className="flex flex-col items-center w-32">
              <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base mb-2 relative z-10" style={{ borderColor: m.color, background: `${m.color}15` }}>
                {m.icon}
              </div>
              <p className="text-[10px] font-bold text-center" style={{ color: m.color }}>Tuần {m.w}</p>
              <p className="text-[9px] text-center text-muted leading-tight mt-0.5">{m.label}</p>
              <p className="text-[8px] text-center text-muted/50 mt-0.5">{m.desc}</p>
            </div>
            {i < milestones.length - 1 && (
              <div className="w-8 h-px shrink-0" style={{ background: `linear-gradient(90deg, ${m.color}60, ${milestones[i+1].color}60)` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(-1);
  return (
    <div className="space-y-2">
      {FAQS.map((faq, i) => (
        <div key={i} className="rounded-2xl border border-border/20 overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/20 transition-colors text-left gap-4">
            <p className="text-[11px] font-bold text-text">{faq.q}</p>
            <span className="text-muted/60 shrink-0 text-sm transition-transform duration-300" style={{ transform: open === i ? 'rotate(180deg)' : 'none' }}>▼</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 pt-0 border-t border-border/10">
              <p className="text-[10px] text-muted leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEFAULT_INPUTS = { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp' };

export default function NutritionRoadmapPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [showAll, setShowAll] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [inputOpen, setInputOpen] = useState(false);
  const [checks, setChecks] = useState({});
  const [scrolled, setScrolled] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_INPUTS);
      if (saved) setInputs(p => ({ ...DEFAULT_INPUTS, ...JSON.parse(saved) }));
      const savedChecks = localStorage.getItem(LS_CHECKS);
      if (savedChecks) setChecks(JSON.parse(savedChecks));
    } catch {}
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_INPUTS, JSON.stringify(inputs)); } catch {}
  }, [inputs]);

  // Inject CSS keyframes
  useEffect(() => {
    const id = 'nr-page-kf';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes nrFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      @keyframes nrPulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.08)} }
      @keyframes nrShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @property --nr-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      @keyframes nrSpin { to { --nr-angle: 360deg; } }
      .nr-orbit-ring {
        background: conic-gradient(from var(--nr-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0) 65deg, rgba(132,204,22,.75) 85deg,
          rgba(255,255,255,.95) 92deg, rgba(132,204,22,.75) 99deg,
          rgba(132,204,22,0) 115deg, transparent 125deg, transparent 360deg);
        animation: nrSpin 3.5s linear infinite;
      }
      .nr-float { animation: nrFloat 3.5s ease-in-out infinite; }
      .nr-pulse { animation: nrPulse 2.5s ease-in-out infinite; }
      .nr-shimmer-text {
        background: linear-gradient(90deg, #84cc16 0%, #ffffff 40%, #84cc16 60%, #22c55e 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: nrShimmer 3s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const s = useMemo(() => computeStats(inputs), [inputs]);
  const phases = showAll ? ROADMAP_PHASES : ROADMAP_PHASES.slice(0, 4);
  const clampedActive = Math.min(activePhase, phases.length - 1);
  const currentPhase = phases[clampedActive];

  const handleCheck = id => {
    const next = { ...checks, [id]: !checks[id] };
    setChecks(next);
    try { localStorage.setItem(LS_CHECKS, JSON.stringify(next)); } catch {}
  };

  const totalChecked = ROADMAP_PHASES.reduce((acc, ph) => {
    const aChecked = ph.actions.filter((_, i) => checks[`ph${ph.phase}-a${i}`]).length;
    return acc + aChecked;
  }, 0);
  const totalActions = ROADMAP_PHASES.reduce((acc, ph) => acc + ph.actions.length, 0);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sticky top bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-border/20 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pillar/b" className="flex items-center gap-1.5 text-[10px] font-bold text-muted hover:text-lime-400 transition-colors">
            <span>←</span>
            <span>Dinh Dưỡng & Thực Đơn</span>
          </Link>
          {scrolled && (
            <p className="text-[10px] font-bold text-lime-400">Lộ Trình {showAll ? '24' : '12'} Tuần</p>
          )}
          <div className="text-[9px] text-muted/60">
            {totalChecked}/{totalActions} hành động ✓
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=80&auto=format&fit=crop"
          alt="Nutrition roadmap"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.85) 60%, #0a0a0a 100%)' }} />

        {/* Floating orbs */}
        <div className="absolute top-16 left-8 w-56 h-56 rounded-full blur-[100px] pointer-events-none nr-pulse" style={{ background: 'rgba(132,204,22,0.12)' }} />
        <div className="absolute top-8 right-16 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{ background: 'rgba(6,182,212,0.08)', animationDelay: '1.2s' }} />

        <div className="relative pt-20 pb-14 px-4 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[9px] text-muted/60 mb-6">
            <Link to="/" className="hover:text-muted transition-colors">Trang Chủ</Link>
            <span>/</span>
            <Link to="/pillar/b" className="hover:text-lime-400 transition-colors">Dinh Dưỡng</Link>
            <span>/</span>
            <span className="text-lime-400">Lộ Trình</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/25 bg-lime-500/8 mb-4">
                <span className="nr-pulse w-1.5 h-1.5 rounded-full bg-lime-400 inline-block" />
                <span className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.2em]">Cá Nhân Hóa Theo B0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-3">
                <span className="nr-shimmer-text">Lộ Trình</span>
                <br />
                <span className="text-text">Dinh Dưỡng</span>
              </h1>
              <p className="text-sm text-muted leading-relaxed max-w-lg">
                12 & 24 tuần có cấu trúc — từ thói quen cơ bản đến tối ưu hiệu suất. Mọi con số được tính toán theo thông số cá nhân của bạn.
              </p>

              {/* Animated stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                {[
                  { label: 'Giai đoạn', value: showAll ? '6' : '4', color: '#22c55e' },
                  { label: 'Tuần', value: showAll ? '24' : '12', color: '#06b6d4' },
                  { label: 'TDEE', value: `${(s.tdee/1000).toFixed(1)}k`, color: '#f59e0b' },
                  { label: 'Protein/ngày', value: `${s.proteinG}g`, color: '#a855f7' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[9px] text-muted uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Macro donut */}
            <div className="nr-float rounded-3xl border border-lime-500/15 bg-surface/20 backdrop-blur-sm p-5">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-3">Phân Phối Macro</p>
              <MacroDonut s={s} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Input panel */}
        <RevealBlock>
          <InputPanel inputs={inputs} setInputs={setInputs} s={s} open={inputOpen} setOpen={setInputOpen} />
        </RevealBlock>

        {/* Progress overview */}
        {totalChecked > 0 && (
          <RevealBlock>
            <div className="rounded-2xl border border-lime-500/20 bg-lime-500/5 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-lime-400">Tiến Độ Cá Nhân</p>
                <p className="text-[10px] text-muted">{totalChecked}/{totalActions} hành động đã thực hiện</p>
              </div>
              <div className="h-2 rounded-full bg-surface/30 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(totalChecked / totalActions) * 100}%`, background: 'linear-gradient(90deg, #22c55e, #84cc16)' }} />
              </div>
              <p className="text-[9px] text-muted/50 mt-1.5">{Math.round((totalChecked / totalActions) * 100)}% hoàn thành — tiếp tục dánh dấu hành động đã làm để theo dõi tiến độ</p>
            </div>
          </RevealBlock>
        )}

        {/* Charts section */}
        <RevealBlock>
          <div className="rounded-3xl border border-border/20 bg-surface/5 p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-bold text-text">Biểu Đồ Tổng Quan</h2>
                <p className="text-[9px] text-muted mt-0.5">Dựa trên TDEE {s.tdee.toLocaleString()} kcal · Mục tiêu {s.targetKcal.toLocaleString()} kcal</p>
              </div>
              {/* 12/24 toggle */}
              <div className="inline-flex rounded-xl border border-border/30 bg-surface/20 p-1 gap-1">
                {[false, true].map(all => (
                  <button key={`${all}`} type="button"
                    onClick={() => { setShowAll(all); setActivePhase(0); }}
                    className="px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-200"
                    style={showAll === all ? { background: LIME, color: '#0a0a0a' } : { color: '#9ca3af' }}>
                    {all ? '24 Tuần' : '12 Tuần'}
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance S-curve */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-text">Đường Tuân Thủ Kế Hoạch (S-Curve)</p>
                <span className="text-[8px] text-muted/50 border border-border/20 px-2 py-0.5 rounded-full">Dự kiến</span>
              </div>
              <p className="text-[9px] text-muted mb-3">Tỷ lệ thực hiện đúng kế hoạch tăng dần theo S-curve khi thói quen được hình thành. Chọn giai đoạn để xem chi tiết.</p>
              <ComplianceChart showAll={showAll} activePhase={clampedActive} />
            </div>

            {/* Calorie bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-text">Calo Mục Tiêu Theo Giai Đoạn (click để chọn)</p>
              </div>
              <CalorieChart s={s} showAll={showAll} activePhase={clampedActive} onSelect={setActivePhase} />
            </div>
          </div>
        </RevealBlock>

        {/* Phase selector tabs */}
        <RevealBlock>
          <div>
            <p className="text-[9px] font-bold text-muted uppercase tracking-[0.2em] mb-3">Chọn Giai Đoạn</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {phases.map((ph, i) => (
                <button key={ph.phase} type="button" onClick={() => setActivePhase(i)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[9px] font-bold transition-all duration-200"
                  style={clampedActive === i
                    ? { borderColor: ph.color, background: `${ph.color}18`, color: ph.color, boxShadow: `0 0 12px ${ph.color}25` }
                    : { borderColor: 'rgba(255,255,255,0.08)', background: 'transparent', color: '#6b7280' }}>
                  <span className="text-sm">{ph.emoji}</span>
                  <span>P{ph.phase}: {ph.label}</span>
                  <span className="text-[8px] opacity-60">T{ph.weeks}</span>
                </button>
              ))}
            </div>

            {/* Active phase card */}
            <PhaseCard
              key={currentPhase.phase}
              ph={currentPhase}
              s={s}
              checks={checks}
              onCheck={handleCheck}
              mealPlan={currentPhase.mealPlan}
            />
          </div>
        </RevealBlock>

        {/* Milestone timeline */}
        <RevealBlock>
          <div className="rounded-3xl border border-border/20 bg-surface/5 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center">
                <span className="text-sm">🗺️</span>
              </div>
              <div>
                <p className="text-xs font-bold text-text">Mốc Quan Trọng — {showAll ? '24' : '12'} Tuần</p>
                <p className="text-[9px] text-muted">Các điểm đánh giá và kiểm tra trong lộ trình</p>
              </div>
            </div>
            <MilestoneTimeline showAll={showAll} />
          </div>
        </RevealBlock>

        {/* Science callout */}
        <RevealBlock>
          <div className="nr-orbit-ring rounded-3xl p-[1.5px]">
            <div className="rounded-3xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&q=75&auto=format&fit=crop" alt="Science nutrition" className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/60 to-bg/10" />
              <div className="absolute inset-0 flex flex-col justify-center px-8 py-6 max-w-2xl">
                <p className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.2em] mb-2">Dựa Trên Bằng Chứng Khoa Học</p>
                <h3 className="text-lg font-black text-text mb-2">Tại Sao 12–24 Tuần?</h3>
                <p className="text-[10px] text-muted leading-relaxed">
                  Nghiên cứu cho thấy cần ít nhất 8–12 tuần để tạo thay đổi thực sự về composition, và 20–24 tuần để thói quen được tự động hóa hoàn toàn. Lộ trình phân chia giai đoạn giúp não bộ thích nghi dần thay vì bị "shock change" — lý do chính khiến hầu hết chế độ ăn kiêng thất bại.
                </p>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* FAQ */}
        <RevealBlock>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">Câu Hỏi Thường Gặp</p>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <FAQSection />
          </div>
        </RevealBlock>

        {/* CTA footer */}
        <RevealBlock>
          <div className="rounded-3xl border border-lime-500/20 bg-lime-500/5 p-8 text-center">
            <p className="text-2xl mb-2">🌱</p>
            <h3 className="text-lg font-black text-text mb-2">Bắt Đầu Từ Giai Đoạn 1</h3>
            <p className="text-[10px] text-muted leading-relaxed max-w-md mx-auto mb-5">
              Đừng đợi điều kiện hoàn hảo. Một bữa ăn có đạm hơn hôm nay — đó là bước đầu của 24 tuần thay đổi thực sự.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pillar/b"
                className="px-5 py-2.5 rounded-xl border border-lime-500/30 bg-lime-500/10 text-[10px] font-bold text-lime-400 hover:bg-lime-500/20 transition-all">
                ← Về Dinh Dưỡng & Thực Đơn
              </Link>
              <button onClick={() => { setActivePhase(0); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                className="px-5 py-2.5 rounded-xl text-[10px] font-bold text-bg hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #22c55e, #84cc16)' }}>
                Bắt Đầu Phase 1 →
              </button>
            </div>
          </div>
        </RevealBlock>

        <div className="h-8" />
      </div>
    </div>
  );
}
