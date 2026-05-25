import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

const TEAL = '#06b6d4';
const LIME = '#84cc16';
const LS_INPUTS = 'healthapp_b0_inputs';

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Ít vận động', mult: 1.2 },
  { key: 'light', label: 'Nhẹ', mult: 1.375 },
  { key: 'moderate', label: 'Vừa phải', mult: 1.55 },
  { key: 'active', label: 'Năng động', mult: 1.725 },
  { key: 'veryactive', label: 'Rất năng động', mult: 1.9 },
];

const GOAL_MODIFIERS = [
  { key: 'loss', label: 'Giảm mỡ', delta: -400, proteinMult: 2.0 },
  { key: 'recomp', label: 'Tái tổ hợp', delta: 0, proteinMult: 1.8 },
  { key: 'gain', label: 'Tăng cơ', delta: 300, proteinMult: 1.8 },
  { key: 'endure', label: 'Sức bền', delta: 200, proteinMult: 1.6 },
];

function computeStats(inp) {
  const w = Number(inp.weight) || 70, h = Number(inp.height) || 170,
    a = Number(inp.age) || 30, s = inp.sex || 'male';
  const act = ACTIVITY_LEVELS.find(x => x.key === inp.activityKey) || ACTIVITY_LEVELS[2];
  const gm = GOAL_MODIFIERS.find(x => x.key === inp.goalKey) || GOAL_MODIFIERS[1];
  const bmr = Math.round(s === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161);
  const tdee = Math.round(bmr * act.mult);
  const targetKcal = Math.max(1200, tdee + gm.delta);
  const proteinG = Math.round(w * gm.proteinMult);
  const fatG = Math.round(targetKcal * 0.25 / 9);
  const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
  const waterMl = Math.round(w * 35);
  const bmi = (w * 10000 / (h * h)).toFixed(1);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = carbG * 4;
  const proteinPct = Math.round(proteinKcal / targetKcal * 100);
  const fatPct = Math.round(fatKcal / targetKcal * 100);
  const carbPct = 100 - proteinPct - fatPct;
  return { w, h, a, s, act, gm, bmr, tdee, targetKcal, proteinG, fatG, carbG, waterMl, bmi, proteinKcal, fatKcal, carbKcal, proteinPct, fatPct, carbPct };
}

const FOOD_DB = [
  { name: 'Ức gà (chín)', cat: 'Protein', kcal: 165, protein: 31, carb: 0, fat: 3.6, fiber: 0, portion: '100g', emoji: '🍗' },
  { name: 'Trứng gà', cat: 'Protein', kcal: 155, protein: 13, carb: 1, fat: 11, fiber: 0, portion: '1 quả (50g)', emoji: '🥚' },
  { name: 'Cá hồi', cat: 'Protein', kcal: 208, protein: 20, carb: 0, fat: 13, fiber: 0, portion: '100g', emoji: '🐟' },
  { name: 'Đậu hũ', cat: 'Protein', kcal: 76, protein: 8, carb: 2, fat: 4.5, fiber: 0.3, portion: '100g', emoji: '🫘' },
  { name: 'Sữa chua Hy Lạp', cat: 'Protein', kcal: 100, protein: 10, carb: 4, fat: 0.7, fiber: 0, portion: '100g', emoji: '🥛' },
  { name: 'Cơm trắng (chín)', cat: 'Carb', kcal: 130, protein: 2.7, carb: 28, fat: 0.3, fiber: 0.4, portion: '100g', emoji: '🍚' },
  { name: 'Khoai lang', cat: 'Carb', kcal: 86, protein: 1.6, carb: 20, fat: 0.1, fiber: 3, portion: '100g', emoji: '🍠' },
  { name: 'Yến mạch', cat: 'Carb', kcal: 389, protein: 17, carb: 66, fat: 7, fiber: 10, portion: '100g khô', emoji: '🌾' },
  { name: 'Chuối', cat: 'Carb', kcal: 89, protein: 1.1, carb: 23, fat: 0.3, fiber: 2.6, portion: '1 quả (100g)', emoji: '🍌' },
  { name: 'Rau bina', cat: 'Rau', kcal: 23, protein: 2.9, carb: 3.6, fat: 0.4, fiber: 2.2, portion: '100g', emoji: '🥬' },
  { name: 'Bông cải xanh', cat: 'Rau', kcal: 34, protein: 2.8, carb: 7, fat: 0.4, fiber: 2.6, portion: '100g', emoji: '🥦' },
  { name: 'Dưa leo', cat: 'Rau', kcal: 16, protein: 0.7, carb: 3.6, fat: 0.1, fiber: 0.5, portion: '100g', emoji: '🥒' },
  { name: 'Dầu olive', cat: 'Chất béo', kcal: 884, protein: 0, carb: 0, fat: 100, fiber: 0, portion: '1 tbsp (14g)', emoji: '🫒' },
  { name: 'Hạt hạnh nhân', cat: 'Chất béo', kcal: 579, protein: 21, carb: 22, fat: 50, fiber: 12, portion: '28g', emoji: '🌰' },
  { name: 'Bơ (avocado)', cat: 'Chất béo', kcal: 160, protein: 2, carb: 9, fat: 15, fiber: 7, portion: '100g', emoji: '🥑' },
];

const DATABASES = [
  {
    id: 'profile', label: 'Nutrition Profile', emoji: '👤', color: '#22c55e',
    desc: 'Lưu thông tin cá nhân và chỉ số tính toán của mỗi người dùng',
    notion: 'Users Database',
    gsheet: 'Sheet: Profile',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70&auto=format&fit=crop',
    fields: [
      { name: 'Name', type: 'Text', icon: '📝', desc: 'Tên người dùng', example: 'Nguyễn Văn A' },
      { name: 'Sex', type: 'Select', icon: '⚥', desc: 'Nam/Nữ', example: 'Nam' },
      { name: 'Age', type: 'Number', icon: '🎂', desc: 'Tuổi', example: '30' },
      { name: 'Weight_kg', type: 'Number', icon: '⚖️', desc: 'Cân nặng (kg)', example: '70' },
      { name: 'Height_cm', type: 'Number', icon: '📏', desc: 'Chiều cao (cm)', example: '170' },
      { name: 'Activity', type: 'Select', icon: '🏃', desc: 'Mức vận động', example: 'Vừa phải (×1.55)' },
      { name: 'Goal', type: 'Select', icon: '🎯', desc: 'Mục tiêu', example: 'Giảm mỡ' },
      { name: 'BMI', type: 'Formula', icon: '📊', desc: 'Chỉ số BMI', formula: '=Weight/(Height/100)^2', example: '24.2' },
      { name: 'BMR_kcal', type: 'Formula', icon: '🔥', desc: 'Chuyển hóa cơ bản', formula: '=IF(Sex="Nam",10*W+6.25*H-5*A+5,10*W+6.25*H-5*A-161)', example: '1,629' },
      { name: 'TDEE_kcal', type: 'Formula', icon: '⚡', desc: 'Tổng calo tiêu hao', formula: '=BMR*ActivityFactor', example: '2,810' },
      { name: 'Target_kcal', type: 'Formula', icon: '🎯', desc: 'Calo mục tiêu/ngày', formula: '=TDEE+GoalDelta', example: '2,410' },
      { name: 'Protein_g', type: 'Formula', icon: '💪', desc: 'Protein mục tiêu (g)', formula: '=Weight*ProteinFactor', example: '140' },
      { name: 'Fat_g', type: 'Formula', icon: '🫒', desc: 'Chất béo (g)', formula: '=(Target*0.25)/9', example: '67' },
      { name: 'Carb_g', type: 'Formula', icon: '🌾', desc: 'Carbohydrate (g)', formula: '=(Target-Protein*4-Fat*9)/4', example: '270' },
      { name: 'Water_ml', type: 'Formula', icon: '💧', desc: 'Nước cần uống (ml)', formula: '=Weight*35', example: '2,450' },
    ],
  },
  {
    id: 'meals', label: 'Meal Library', emoji: '🍽️', color: '#84cc16',
    desc: 'Thư viện thực phẩm với giá trị dinh dưỡng trên 100g — dùng để tra cứu và tính khẩu phần',
    notion: 'Foods Database',
    gsheet: 'Sheet: FoodDB',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=70&auto=format&fit=crop',
    fields: [
      { name: 'FoodName', type: 'Text', icon: '🥘', desc: 'Tên thực phẩm', example: 'Ức gà (chín)' },
      { name: 'Category', type: 'Select', icon: '🏷️', desc: 'Nhóm thực phẩm', example: 'Protein' },
      { name: 'Kcal_100g', type: 'Number', icon: '🔥', desc: 'Calo / 100g', example: '165' },
      { name: 'Protein_100g', type: 'Number', icon: '💪', desc: 'Protein (g) / 100g', example: '31' },
      { name: 'Carb_100g', type: 'Number', icon: '🌾', desc: 'Carb (g) / 100g', example: '0' },
      { name: 'Fat_100g', type: 'Number', icon: '🫒', desc: 'Fat (g) / 100g', example: '3.6' },
      { name: 'Fiber_100g', type: 'Number', icon: '🥦', desc: 'Chất xơ (g) / 100g', example: '0' },
      { name: 'Portion', type: 'Text', icon: '📐', desc: 'Khẩu phần chuẩn', example: '100g' },
      { name: 'AmountFor_G', type: 'Formula', icon: '🧮', desc: 'Lượng cần để đạt Xg protein', formula: '=(TargetProtein/Protein_100g)*100', example: '129g cho 40g protein' },
    ],
  },
  {
    id: 'daily', label: 'Daily Nutrition Log', emoji: '📅', color: '#06b6d4',
    desc: 'Nhật ký dinh dưỡng hằng ngày — ghi lại thực tế ăn uống, điểm tuân thủ và ghi chú',
    notion: 'Daily Log Database',
    gsheet: 'Sheet: DailyLog',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70&auto=format&fit=crop',
    fields: [
      { name: 'Date', type: 'Date', icon: '📆', desc: 'Ngày', example: '2025-01-15' },
      { name: 'DayType', type: 'Select', icon: '🏋️', desc: 'Loại ngày tập', example: 'Ngày tập nặng' },
      { name: 'Breakfast', type: 'Text', icon: '🌅', desc: 'Bữa sáng', example: 'Trứng + yến mạch + chuối' },
      { name: 'Lunch', type: 'Text', icon: '☀️', desc: 'Bữa trưa', example: 'Cơm + gà + rau luộc' },
      { name: 'Dinner', type: 'Text', icon: '🌙', desc: 'Bữa tối', example: 'Cá + rau + khoai' },
      { name: 'Snack', type: 'Text', icon: '🍌', desc: 'Snack', example: 'Sữa chua + trái cây' },
      { name: 'Protein_ok', type: 'Checkbox', icon: '✅', desc: 'Đủ protein?', example: 'TRUE' },
      { name: 'Veg_ok', type: 'Checkbox', icon: '✅', desc: 'Đủ rau?', example: 'TRUE' },
      { name: 'Water_ok', type: 'Checkbox', icon: '✅', desc: 'Đủ nước?', example: 'TRUE' },
      { name: 'No_Junk', type: 'Checkbox', icon: '✅', desc: 'Kiểm soát đồ ngọt?', example: 'TRUE' },
      { name: 'PrePost_Workout', type: 'Checkbox', icon: '✅', desc: 'Bữa trước/sau tập?', example: 'TRUE' },
      { name: 'Hunger_1_10', type: 'Number', icon: '😋', desc: 'Mức đói cuối ngày (1–10)', example: '4' },
      { name: 'Energy_1_10', type: 'Number', icon: '⚡', desc: 'Năng lượng (1–10)', example: '7' },
      { name: 'Notes', type: 'Text', icon: '📝', desc: 'Ghi chú / bữa lỡ tay', example: 'Ăn tiệc trưa, bữa tối bù rau' },
      { name: 'NutritionScore', type: 'Formula', icon: '🏆', desc: 'Điểm tuân thủ (0–100)', formula: '=Protein*30+Veg*25+Water*20+NoJunk*15+PrePost*10', example: '85' },
    ],
  },
  {
    id: 'weekly', label: 'Weekly Nutrition Review', emoji: '📊', color: '#a855f7',
    desc: 'Tổng kết tuần — đo tiến độ, xem xu hướng và đặt điều chỉnh cho tuần sau',
    notion: 'Weekly Review Database',
    gsheet: 'Sheet: WeeklyReview',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=70&auto=format&fit=crop',
    fields: [
      { name: 'WeekNo', type: 'Number', icon: '📅', desc: 'Tuần số', example: '5' },
      { name: 'WeekStart', type: 'Date', icon: '📆', desc: 'Ngày bắt đầu tuần', example: '2025-01-13' },
      { name: 'AvgWeight_kg', type: 'Number', icon: '⚖️', desc: 'Cân nặng TB (kg)', example: '70.2' },
      { name: 'Waist_cm', type: 'Number', icon: '📏', desc: 'Vòng eo (cm)', example: '82' },
      { name: 'ProteinDays', type: 'Number', icon: '💪', desc: 'Số ngày đủ protein', example: '6' },
      { name: 'VegDays', type: 'Number', icon: '🥦', desc: 'Số ngày đủ rau', example: '5' },
      { name: 'WorkoutDays', type: 'Number', icon: '🏋️', desc: 'Số buổi tập', example: '4' },
      { name: 'AvgSteps', type: 'Number', icon: '👟', desc: 'Bước đi TB/ngày', example: '9,800' },
      { name: 'AvgSleepHrs', type: 'Number', icon: '😴', desc: 'Ngủ TB (giờ)', example: '7.2' },
      { name: 'AvgScore', type: 'Formula', icon: '🏆', desc: 'Điểm TB tuần', formula: '=AVERAGE(DailyScores)', example: '78' },
      { name: 'WeightChange', type: 'Formula', icon: '📉', desc: 'Thay đổi cân nặng', formula: '=AvgWeight-PrevWeekAvgWeight', example: '-0.3kg' },
      { name: 'MainIssue', type: 'Text', icon: '⚠️', desc: 'Vấn đề chính tuần này', example: 'Bỏ protein bữa sáng 3 ngày' },
      { name: 'Adjustment', type: 'Text', icon: '🔧', desc: 'Điều chỉnh tuần sau', example: 'Chuẩn bị trứng luộc sẵn' },
    ],
  },
];

const GSHEET_FORMULAS = [
  { label: 'BMI', desc: 'Cân nặng / (Chiều cao m)²', formula: '=B5/(B4/100)^2', example: '24.2', color: '#22c55e' },
  { label: 'BMR (Nam)', desc: 'Mifflin-St Jeor', formula: '=10*B5+6.25*B4-5*B3+5', example: '1,629 kcal', color: '#06b6d4' },
  { label: 'BMR (Nữ)', desc: 'Mifflin-St Jeor', formula: '=10*B5+6.25*B4-5*B3-161', example: '1,468 kcal', color: '#a855f7' },
  { label: 'TDEE', desc: 'BMR × hệ số hoạt động', formula: '=B10*B6', example: '2,810 kcal', color: '#f59e0b' },
  { label: 'Protein (g)', desc: 'Cân nặng × hệ số mục tiêu', formula: '=B5*2', example: '140g', color: '#ef4444' },
  { label: 'Fat (g)', desc: '25% calo ÷ 9 kcal/g', formula: '=(B12*0.25)/9', example: '67g', color: '#84cc16' },
  { label: 'Carb (g)', desc: 'Calo còn lại ÷ 4', formula: '=(B12-B14*4-B15*9)/4', example: '270g', color: '#06b6d4' },
  { label: 'Nước (ml)', desc: 'Cân nặng × 35ml', formula: '=B5*35', example: '2,450ml', color: '#3b82f6' },
  { label: 'Khẩu phần thực phẩm (g)', desc: 'Lượng để đạt macro mục tiêu', formula: '=(TargetProtein/ProteinPer100g)*100', example: '129g ức gà', color: '#84cc16' },
  { label: 'Nutrition Score', desc: 'Tổng điểm tuân thủ/100', formula: '=C2*30+D2*25+E2*20+F2*15+G2*10', example: '85/100', color: '#a855f7' },
];

const NOTION_FORMULAS = [
  { prop: 'BMR', formula: `if(prop("Sex") == "Nam", 10*prop("Weight") + 6.25*prop("Height") - 5*prop("Age") + 5, 10*prop("Weight") + 6.25*prop("Height") - 5*prop("Age") - 161)` },
  { prop: 'TDEE', formula: `prop("BMR") * prop("ActivityFactor")` },
  { prop: 'Protein_g', formula: `prop("Weight") * 2` },
  { prop: 'Fat_g', formula: `(prop("TargetKcal") * 0.25) / 9` },
  { prop: 'Carb_g', formula: `(prop("TargetKcal") - prop("Protein_g") * 4 - prop("Fat_g") * 9) / 4` },
  { prop: 'NutritionScore', formula: `toNumber(prop("Protein_ok")) * 30 + toNumber(prop("Veg_ok")) * 25 + toNumber(prop("Water_ok")) * 20 + toNumber(prop("No_Junk")) * 15 + toNumber(prop("PrePost")) * 10` },
];

const SCORE_CRITERIA = [
  { key: 'protein', label: 'Đủ protein hôm nay', points: 30, icon: '💪', color: '#22c55e', tip: '≥ 1g/kg cân nặng (beginner) hoặc 1.6–2g/kg (tập luyện)' },
  { key: 'veg', label: 'Đủ rau/chất xơ', points: 25, icon: '🥦', color: '#84cc16', tip: 'Ít nhất 2 bữa chính có rau (≥ 1 nắm tay/bữa)' },
  { key: 'water', label: 'Uống đủ nước', points: 20, icon: '💧', color: '#06b6d4', tip: '≥ 2.5L/ngày (dựa theo cân nặng × 35ml)' },
  { key: 'junk', label: 'Kiểm soát đồ ngọt', points: 15, icon: '🚫', color: '#f59e0b', tip: 'Không uống nước ngọt, hạn chế bánh kẹo ngoài bữa chính' },
  { key: 'workout', label: 'Bữa trước/sau tập', points: 10, icon: '🏋️', color: '#a855f7', tip: 'Có bữa pre-workout và post-workout nếu có tập hôm nay' },
];

const TYPE_BADGE = {
  Text: 'bg-blue-900/40 text-blue-300 border-blue-700/40',
  Number: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  Select: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  Checkbox: 'bg-green-900/40 text-green-300 border-green-700/40',
  Date: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/40',
  Formula: 'bg-orange-900/40 text-orange-300 border-orange-700/40',
};

function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

function MacroBar({ s, height = 28 }) {
  return (
    <svg width="100%" height={height} style={{ overflow: 'visible' }}>
      <rect x="0" y="0" width={`${s.proteinPct}%`} height={height} rx="4" fill="#22c55e" />
      <rect x={`${s.proteinPct}%`} y="0" width={`${s.fatPct}%`} height={height} fill="#f59e0b" />
      <rect x={`${s.proteinPct + s.fatPct}%`} y="0" width={`${s.carbPct}%`} height={height} rx="4" fill="#06b6d4" />
    </svg>
  );
}

function ScoreRing({ score }) {
  const r = 40, circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#1f2937" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="#06b6d4" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="50" y="55" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{score}</text>
    </svg>
  );
}

function DataFlowDiagram() {
  return (
    <svg viewBox="0 0 520 220" width="100%" style={{ overflow: 'visible' }}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#4b5563" />
        </marker>
        <marker id="arr-teal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" />
        </marker>
      </defs>
      <rect x="10" y="80" width="110" height="52" rx="10" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
      <text x="65" y="101" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="700">👤 Profile</text>
      <text x="65" y="117" textAnchor="middle" fill="#6b7280" fontSize="8.5">BMR · TDEE · Macro</text>
      <text x="65" y="129" textAnchor="middle" fill="#6b7280" fontSize="8">targets</text>

      <rect x="200" y="10" width="110" height="52" rx="10" fill="#0f172a" stroke="#84cc16" strokeWidth="1.5" />
      <text x="255" y="31" textAnchor="middle" fill="#84cc16" fontSize="10" fontWeight="700">🍽️ FoodDB</text>
      <text x="255" y="47" textAnchor="middle" fill="#6b7280" fontSize="8.5">Thực phẩm · Kcal</text>
      <text x="255" y="59" textAnchor="middle" fill="#6b7280" fontSize="8">Macro per 100g</text>

      <rect x="200" y="80" width="120" height="52" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
      <text x="260" y="101" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="700">📅 Daily Log</text>
      <text x="260" y="117" textAnchor="middle" fill="#6b7280" fontSize="8.5">Bữa ăn thực tế</text>
      <text x="260" y="129" textAnchor="middle" fill="#6b7280" fontSize="8">Score · Ghi chú</text>

      <rect x="390" y="80" width="120" height="52" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
      <text x="450" y="101" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="700">📊 Weekly Review</text>
      <text x="450" y="117" textAnchor="middle" fill="#6b7280" fontSize="8.5">Tổng kết tuần</text>
      <text x="450" y="129" textAnchor="middle" fill="#6b7280" fontSize="8">Xu hướng · Điều chỉnh</text>

      <line x1="120" y1="106" x2="198" y2="106" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#arr)" />
      <line x1="255" y1="62" x2="255" y2="78" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#arr)" />
      <line x1="320" y1="106" x2="388" y2="106" stroke="#4b5563" strokeWidth="1.5" markerEnd="url(#arr)" />
      <path d="M 450 80 Q 450 160 260 170 Q 80 170 65 134" stroke="#06b6d4" strokeWidth="1.5" fill="none" strokeDasharray="5 3" markerEnd="url(#arr-teal)" />
      <text x="255" y="185" textAnchor="middle" fill="#06b6d4" fontSize="8" opacity="0.7">feedback loop</text>

      <text x="157" y="100" textAnchor="middle" fill="#6b7280" fontSize="8">targets</text>
      <text x="255" y="75" textAnchor="middle" fill="#6b7280" fontSize="8">lookup</text>
      <text x="352" y="100" textAnchor="middle" fill="#6b7280" fontSize="8">aggregates</text>
    </svg>
  );
}

export default function NutritionDataPage() {
  const [inputs, setInputs] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_INPUTS);
      return raw ? JSON.parse(raw) : { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp' };
    } catch {
      return { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp' };
    }
  });
  const s = computeStats(inputs);

  const [activeDb, setActiveDb] = useState('profile');
  const [foodCat, setFoodCat] = useState('Protein');
  const [selectedFoodIdx, setSelectedFoodIdx] = useState(0);
  const [targetProtein, setTargetProtein] = useState(30);
  const [scoreChecks, setScoreChecks] = useState({ protein: false, veg: false, water: false, junk: false, workout: false });
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedNotion, setCopiedNotion] = useState(null);

  const score = SCORE_CRITERIA.reduce((acc, c) => acc + (scoreChecks[c.key] ? c.points : 0), 0);
  const scoreLevel = score >= 80 ? 'Xuất sắc' : score >= 50 ? 'Tốt' : 'Cần cải thiện';
  const scoreLevelColor = score >= 80 ? '#22c55e' : score >= 50 ? '#06b6d4' : '#f59e0b';

  const filteredFoods = FOOD_DB.filter(f => f.cat === foodCat);
  const selectedFood = filteredFoods[selectedFoodIdx] || FOOD_DB[0];
  const gramsNeeded = selectedFood.protein > 0 ? Math.round((targetProtein / selectedFood.protein) * 100) : 0;
  const kcalResult = Math.round((gramsNeeded / 100) * selectedFood.kcal);

  const activeDbData = DATABASES.find(d => d.id === activeDb) || DATABASES[0];

  const handleCopy = useCallback((formula, idx) => {
    navigator.clipboard.writeText(formula);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const handleCopyNotion = useCallback((formula, idx) => {
    navigator.clipboard.writeText(formula);
    setCopiedNotion(idx);
    setTimeout(() => setCopiedNotion(null), 1500);
  }, []);

  useEffect(() => {
    if (document.getElementById('nd-page-kf')) return;
    const s = document.createElement('style');
    s.id = 'nd-page-kf';
    s.textContent = `
      @property --nd-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes ndOrbitSpin { to { --nd-angle: 360deg; } }
      .nd-orbit-ring {
        background: conic-gradient(from var(--nd-angle), transparent 0deg, transparent 55deg, rgba(6,182,212,0.0) 65deg, rgba(6,182,212,0.75) 85deg, rgba(255,255,255,0.9) 92deg, rgba(6,182,212,0.75) 99deg, rgba(6,182,212,0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: ndOrbitSpin 3.5s linear infinite;
      }
      @keyframes ndFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      .nd-float { animation: ndFloat 3.5s ease-in-out infinite; }
      @keyframes ndShimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
      .nd-shimmer { background: linear-gradient(90deg, #06b6d4, #84cc16, #06b6d4); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: ndShimmer 3s linear infinite; }
      @keyframes ndFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .nd-fade-in-up { animation: ndFadeUp 0.6s ease forwards; }
      @keyframes ndPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      .nd-pulse { animation: ndPulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }, []);

  const cats = ['Protein', 'Carb', 'Rau', 'Chất béo'];
  const catColors = { Protein: '#22c55e', Carb: '#06b6d4', Rau: '#84cc16', 'Chất béo': '#f59e0b' };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">

      {/* Breadcrumb */}
      <div className="mb-8">
        <Link to="/pillar/b" className="text-sm text-muted hover:text-cyan-400 transition-colors">
          ← Dinh Dưỡng
        </Link>
      </div>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border border-cyan-400/20 shrink-0 nd-float flex items-center justify-center">
          🗄️
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight nd-fade-in-up">
            Cấu Trúc <span className="nd-shimmer">Dữ Liệu</span>
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mt-3 mb-4 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
            Nutrition Database Architecture
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            4 cơ sở dữ liệu liên kết — từ hồ sơ cá nhân, thư viện thực phẩm đến nhật ký hằng ngày và tổng kết tuần. Công thức tính macro, điểm tuân thủ và template Notion/Google Sheet.
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="nd-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70&auto=format&fit=crop"
            alt="Data architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-cyan-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-cyan-400/20">
            Database Architecture
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Personalized summary bar */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-cyan-400/20 bg-surface p-5">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Chỉ số của bạn</span>
            <span className="text-xs text-muted">({s.w}kg · {s.h}cm · {s.a}t · {s.s === 'male' ? 'Nam' : 'Nữ'} · {s.act.label} · {s.gm.label})</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'BMR', val: `${s.bmr.toLocaleString()} kcal`, tip: 'Calo cơ bản khi nghỉ ngơi hoàn toàn (Mifflin-St Jeor)', color: '#06b6d4' },
              { label: 'Mục tiêu/ngày', val: `${s.targetKcal.toLocaleString()} kcal`, tip: `TDEE ${s.tdee.toLocaleString()} + delta ${s.gm.delta > 0 ? '+' : ''}${s.gm.delta}`, color: '#84cc16' },
              { label: 'Protein', val: `${s.proteinG}g`, tip: `${s.w}kg × ${s.gm.proteinMult}g/kg = ${s.proteinG}g/ngày`, color: '#22c55e' },
              { label: 'Nước', val: `${(s.waterMl / 1000).toFixed(1)}L`, tip: `${s.w}kg × 35ml = ${s.waterMl}ml/ngày`, color: '#3b82f6' },
            ].map((item, i) => (
              <div key={i} className="group/stat relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={item.tip} idx={`ndbar-${i}`} color={item.color} />
                </div>
                <div className="rounded-xl bg-bg border border-border p-3 text-center cursor-default">
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.val}</div>
                  <div className="text-xs text-muted mt-0.5">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Protein {s.proteinPct}%</span>
              <span>Fat {s.fatPct}%</span>
              <span>Carb {s.carbPct}%</span>
            </div>
            <MacroBar s={s} height={20} />
          </div>
          <div className="flex gap-4 text-xs text-muted mt-2">
            <span><span className="inline-block w-2 h-2 rounded bg-green-500 mr-1" />P: {s.proteinG}g</span>
            <span><span className="inline-block w-2 h-2 rounded bg-yellow-500 mr-1" />F: {s.fatG}g</span>
            <span><span className="inline-block w-2 h-2 rounded bg-cyan-500 mr-1" />C: {s.carbG}g</span>
          </div>
        </div>
      </RevealBlock>

      {/* Section 1: Data Architecture */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Kiến Trúc Dữ Liệu</h2>
        <p className="text-muted text-sm mb-6">4 cơ sở dữ liệu liên kết — click để xem chi tiết từng database.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {DATABASES.map(db => (
            <button
              key={db.id}
              onClick={() => setActiveDb(db.id)}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 ${activeDb === db.id ? 'border-opacity-80 scale-[1.02]' : 'border-border bg-surface hover:border-opacity-40'}`}
              style={{
                borderColor: activeDb === db.id ? db.color : undefined,
                background: activeDb === db.id ? `${db.color}10` : undefined,
              }}
            >
              <div className="text-2xl mb-2">{db.emoji}</div>
              <div className="text-xs font-bold" style={{ color: db.color }}>{db.label}</div>
              <div className="text-xs text-muted mt-1 leading-snug">{db.fields.length} fields</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Data Flow Diagram</h3>
          <DataFlowDiagram />
        </div>
      </RevealBlock>

      {/* Section 2: Database Detail */}
      <RevealBlock className="mb-12">
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${activeDbData.color}40` }}>
          <div className="relative h-32 overflow-hidden">
            <img src={activeDbData.image} alt={activeDbData.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/90 to-bg/40" />
            <div className="absolute inset-0 flex items-center px-6 gap-4">
              <span className="text-3xl">{activeDbData.emoji}</span>
              <div>
                <div className="text-lg font-bold text-text">{activeDbData.label}</div>
                <div className="text-xs text-muted">{activeDbData.notion} · {activeDbData.gsheet}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full border font-medium" style={{ color: activeDbData.color, borderColor: `${activeDbData.color}40`, background: `${activeDbData.color}15` }}>
                  Notion
                </span>
                <span className="text-xs px-2 py-1 rounded-full border border-border text-muted bg-surface">
                  Google Sheet
                </span>
              </div>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm text-muted mb-5">{activeDbData.desc}</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted font-semibold uppercase tracking-wider pb-3 pr-4">Field</th>
                    <th className="text-left text-xs text-muted font-semibold uppercase tracking-wider pb-3 pr-4">Type</th>
                    <th className="text-left text-xs text-muted font-semibold uppercase tracking-wider pb-3 pr-4">Description</th>
                    <th className="text-left text-xs text-muted font-semibold uppercase tracking-wider pb-3">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDbData.fields.map((f, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span>{f.icon}</span>
                          <span className="font-mono text-xs text-text font-medium">{f.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${TYPE_BADGE[f.type] || 'bg-surface text-muted border-border'}`}>
                          {f.type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-muted text-xs leading-relaxed">
                        {f.desc}
                        {f.formula && (
                          <div className="font-mono text-orange-400 text-[10px] mt-0.5 opacity-70">{f.formula}</div>
                        )}
                      </td>
                      <td className="py-2.5 text-xs text-text/60 font-mono">{f.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Section 3: Google Sheet Formulas */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Google Sheet Formulas</h2>
        <p className="text-muted text-sm mb-6">Copy công thức vào Google Sheet — thay ô tham chiếu theo layout của bạn.</p>

        <div className="grid md:grid-cols-2 gap-3">
          {GSHEET_FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4 hover:border-opacity-60 transition-all"
              style={{ borderColor: `${f.color}30` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-sm font-bold text-text">{f.label}</div>
                  <div className="text-xs text-muted">{f.desc}</div>
                </div>
                <button
                  onClick={() => handleCopy(f.formula, i)}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-lg border transition-all duration-150"
                  style={{
                    color: copiedIdx === i ? '#22c55e' : f.color,
                    borderColor: copiedIdx === i ? '#22c55e40' : `${f.color}40`,
                    background: copiedIdx === i ? '#22c55e15' : `${f.color}10`,
                  }}
                >
                  {copiedIdx === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-xs bg-bg rounded-lg px-3 py-2 border border-border text-text/80 mb-2">
                {f.formula}
              </div>
              <div className="text-xs text-muted">
                Ví dụ kết quả: <span className="font-semibold" style={{ color: f.color }}>{f.example}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Ví dụ với số liệu của bạn</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-muted text-xs">BMR:</span> <span className="text-cyan-400 font-bold">{s.bmr.toLocaleString()} kcal</span></div>
            <div><span className="text-muted text-xs">TDEE:</span> <span className="text-cyan-400 font-bold">{s.tdee.toLocaleString()} kcal</span></div>
            <div><span className="text-muted text-xs">Mục tiêu:</span> <span className="text-cyan-400 font-bold">{s.targetKcal.toLocaleString()} kcal</span></div>
            <div><span className="text-muted text-xs">BMI:</span> <span className="text-cyan-400 font-bold">{s.bmi}</span></div>
          </div>
        </div>
      </RevealBlock>

      {/* Section 4: Notion Formulas */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Notion Database Formulas</h2>
        <p className="text-muted text-sm mb-6">Dán vào property Formula trong Notion database.</p>

        <div className="space-y-3">
          {NOTION_FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-text">{f.prop}</span>
                <button
                  onClick={() => handleCopyNotion(f.formula, i)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-lime-500/30 text-lime-400 bg-lime-500/10 transition-all duration-150 hover:bg-lime-500/20"
                >
                  {copiedNotion === i ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="font-mono text-xs bg-bg rounded-lg px-3 py-2.5 border border-border text-lime-300/80 whitespace-pre-wrap break-all">
                {f.formula}
              </pre>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Section 5: Food Library + Calculator */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Thư Viện Thực Phẩm</h2>
        <p className="text-muted text-sm mb-6">15 thực phẩm Việt Nam phổ biến — dinh dưỡng trên khẩu phần chuẩn.</p>

        <div className="flex gap-2 mb-5 flex-wrap">
          {cats.map(cat => (
            <button
              key={cat}
              onClick={() => { setFoodCat(cat); setSelectedFoodIdx(0); }}
              className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150"
              style={{
                color: foodCat === cat ? catColors[cat] : undefined,
                borderColor: foodCat === cat ? `${catColors[cat]}60` : undefined,
                background: foodCat === cat ? `${catColors[cat]}15` : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {filteredFoods.map((food, i) => (
            <button
              key={i}
              onClick={() => setSelectedFoodIdx(i)}
              className={`rounded-xl border p-4 text-left transition-all duration-150 ${selectedFoodIdx === i ? 'scale-[1.02]' : 'border-border bg-surface hover:border-lime-500/30'}`}
              style={selectedFoodIdx === i ? { borderColor: `${catColors[foodCat]}60`, background: `${catColors[foodCat]}10` } : {}}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{food.emoji}</span>
                <div>
                  <div className="text-sm font-semibold text-text">{food.name}</div>
                  <div className="text-xs text-muted">{food.portion}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center"><div className="font-bold text-orange-400">{food.kcal}</div><div className="text-muted">kcal</div></div>
                <div className="text-center"><div className="font-bold text-green-400">{food.protein}g</div><div className="text-muted">P</div></div>
                <div className="text-center"><div className="font-bold text-cyan-400">{food.carb}g</div><div className="text-muted">C</div></div>
              </div>
            </button>
          ))}
        </div>

        {/* Food Calculator */}
        <div className="rounded-2xl border border-lime-500/30 bg-surface p-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-lime-400 mb-4">Máy Tính Khẩu Phần</h3>
          <div className="flex flex-col md:flex-row gap-5 items-start">
            <div className="flex-1">
              <label className="text-xs text-muted mb-1.5 block">Chọn thực phẩm</label>
              <select
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-lime-500/50"
                value={selectedFoodIdx}
                onChange={e => setSelectedFoodIdx(Number(e.target.value))}
              >
                {filteredFoods.map((f, i) => (
                  <option key={i} value={i}>{f.emoji} {f.name}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-44">
              <label className="text-xs text-muted mb-1.5 block">Mục tiêu protein (g)</label>
              <input
                type="number"
                min={1}
                max={300}
                value={targetProtein}
                onChange={e => setTargetProtein(Number(e.target.value) || 1)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-lime-500/50"
              />
            </div>
            <div className="w-full md:w-56 rounded-xl border border-lime-500/30 bg-lime-500/5 p-4">
              <div className="text-xs text-muted mb-1">Cần ăn</div>
              <div className="text-2xl font-bold text-lime-400">{gramsNeeded}g</div>
              <div className="text-xs text-muted">{selectedFood.name}</div>
              <div className="text-xs text-muted mt-1">
                = {kcalResult} kcal · {targetProtein}g protein
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted font-mono bg-bg rounded-lg px-3 py-2 border border-border">
            = ({targetProtein} / {selectedFood.protein}) × 100 = {gramsNeeded}g
          </div>
        </div>
      </RevealBlock>

      {/* Section 6: Nutrition Score Calculator */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Nutrition Score Calculator</h2>
        <p className="text-muted text-sm mb-6">Tích các tiêu chí bạn đã đạt hôm nay để xem điểm tuân thủ.</p>

        <div className="rounded-2xl border border-cyan-400/20 bg-surface p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-3">
              {SCORE_CRITERIA.map(c => (
                <label key={c.key} className="flex items-start gap-3 cursor-pointer group/crit">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={scoreChecks[c.key]}
                      onChange={e => setScoreChecks(prev => ({ ...prev, [c.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div
                      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150"
                      style={{
                        borderColor: scoreChecks[c.key] ? c.color : '#374151',
                        background: scoreChecks[c.key] ? `${c.color}20` : 'transparent',
                      }}
                    >
                      {scoreChecks[c.key] && <span style={{ color: c.color, fontSize: 12 }}>✓</span>}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span className={`text-sm font-medium transition-colors ${scoreChecks[c.key] ? 'text-text' : 'text-muted'}`}>{c.label}</span>
                      <span className="text-xs font-bold rounded-full px-1.5 py-0.5" style={{ color: c.color, background: `${c.color}15` }}>+{c.points}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5">{c.tip}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3">
              <ScoreRing score={score} />
              <div className="text-sm font-bold" style={{ color: scoreLevelColor }}>{scoreLevel}</div>
              <div className="text-xs text-muted text-center">
                {score === 100 ? 'Hoàn hảo! Duy trì nhé.' : score >= 80 ? 'Rất tốt hôm nay.' : score >= 50 ? 'Hãy cải thiện thêm.' : 'Cần chú ý hơn.'}
              </div>
              <div className="text-xs text-muted text-center mt-1">
                Formula: <span className="font-mono text-cyan-400">{score}/100</span>
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Section 7: Daily Log Template */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-2">Daily Log Template</h2>
        <p className="text-muted text-sm mb-6">Mẫu nhật ký một ngày điển hình.</p>

        <div className="rounded-2xl border border-cyan-400/20 bg-surface overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-xs text-muted ml-2">Daily Nutrition Log — 2025-01-15</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-muted font-semibold px-4 py-2.5 uppercase tracking-wider">Field</th>
                  <th className="text-left text-muted font-semibold px-4 py-2.5 uppercase tracking-wider">Value</th>
                  <th className="text-left text-muted font-semibold px-4 py-2.5 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { field: '📆 Date', val: '2025-01-15 (Thứ 4)', note: 'Ngày tập vừa' },
                  { field: '🌅 Breakfast', val: '3 trứng luộc + 60g yến mạch + chuối', note: '~550 kcal · 35g P' },
                  { field: '☀️ Lunch', val: '150g ức gà + 200g cơm + rau muống', note: '~580 kcal · 47g P' },
                  { field: '🌙 Dinner', val: '150g cá hồi + khoai lang + rau bina', note: '~490 kcal · 32g P' },
                  { field: '🍌 Snack', val: '100g sữa chua Hy Lạp + 30g hạnh nhân', note: '~273 kcal · 17g P' },
                  { field: '✅ Protein_ok', val: 'TRUE', note: `131g / ${s.proteinG}g mục tiêu` },
                  { field: '✅ Veg_ok', val: 'TRUE', note: '3 bữa đều có rau' },
                  { field: '✅ Water_ok', val: 'TRUE', note: `${(s.waterMl / 1000).toFixed(1)}L đạt` },
                  { field: '✅ No_Junk', val: 'TRUE', note: 'Không nước ngọt' },
                  { field: '🏋️ PrePost', val: 'TRUE', note: 'Cơm gà trước, sữa chua sau' },
                  { field: '🏆 NutritionScore', val: `${Math.round(1*30+1*25+1*20+1*15+1*10)}/100`, note: 'Xuất sắc hôm nay' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border/40 ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                    <td className="px-4 py-2.5 font-mono text-text/70 whitespace-nowrap">{row.field}</td>
                    <td className="px-4 py-2.5 text-text font-medium">{row.val}</td>
                    <td className="px-4 py-2.5 text-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </RevealBlock>

      {/* Section 8: Safety Note */}
      <RevealBlock>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <div className="flex gap-3 items-start">
            <span className="text-xl shrink-0 nd-pulse">⚠️</span>
            <div>
              <div className="text-sm font-bold text-yellow-400 mb-1">Lưu ý quan trọng</div>
              <div className="text-xs text-muted leading-relaxed">
                Các công thức tính macro (Mifflin-St Jeor, TDEE, phân chia macro) là ước tính khoa học — không thay thế tư vấn từ chuyên gia dinh dưỡng. Số liệu cá nhân hóa dựa trên dữ liệu bạn nhập ở trang B0. Để đạt kết quả tốt nhất, theo dõi thực tế 4–6 tuần và điều chỉnh theo phản hồi cơ thể.
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
