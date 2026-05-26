import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Orbit-ring CSS ─── */
function useOrbitRing() {
  useEffect(() => {
    if (document.getElementById('gp-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 'gp-orbit-kf';
    s.textContent = `
      @property --gp-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes gpSpin { to { --gp-angle: 360deg; } }
      .gp-orbit-ring {
        background: conic-gradient(
          from var(--gp-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(132,204,22,0.75) 99deg,
          rgba(132,204,22,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: gpSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);
}

/* ─── RevealBlock ─── */
function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── B0 helpers ─── */
const ACT_MULT = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
const GOAL_KEY_MAP = { loss: 'loss', recomp: 'recomp', gain: 'gain' };
function computeStats(inp, goalOverride) {
  const w = Number(inp.weight || inp.w) || 65;
  const h = Number(inp.height || inp.h) || 170;
  const a = ACT_MULT[inp.activityKey] || Number(inp.a) || 1.55;
  const age = Number(inp.age) || 30;
  const bmr = (inp.sex || inp.sx || 'male') === 'female'
    ? 10 * w + 6.25 * h - 5 * age - 161
    : 10 * w + 6.25 * h - 5 * age + 5;
  const tdee = Math.round(bmr * a);
  const g = goalOverride || GOAL_KEY_MAP[inp.goalKey] || inp.goal || 'recomp';
  const kcalMap = {
    healthy: Math.round(tdee * 0.97),
    loss: Math.round(tdee * 0.82),
    gain: Math.round(tdee * 1.08),
    recomp: Math.round(tdee * 0.97),
    endurance: tdee,
    recovery: Math.round(tdee * 0.97),
    busy: Math.round(tdee * 0.97),
  };
  const protMap = {
    healthy: 1.4,
    loss: 2.0,
    gain: 2.0,
    recomp: 1.8,
    endurance: 1.7,
    recovery: 1.5,
    busy: 1.5,
  };
  const targetKcal = kcalMap[g] || tdee;
  const proteinG = Math.round(w * (protMap[g] || 1.6));
  const fatG = Math.round(targetKcal * 0.27 / 9);
  const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
  const waterMl = Math.round(w * 35);
  return { w, h, a, age, bmr: Math.round(bmr), tdee, targetKcal, proteinG, fatG, carbG, waterMl };
}

/* ─── Data ─── */
const GOALS = [
  {
    id: 'healthy',
    label: 'Sống Khỏe Nền',
    emoji: '🌱',
    color: '#22c55e', rgb: '34,197,94',
    tag: 'Mới bắt đầu · Dễ duy trì',
    tagline: 'Ăn đủ, đều, đúng — không đếm calo phức tạp',
    who: 'Người mới bắt đầu, người ít vận động, người muốn ăn uống tốt hơn mà chưa muốn đếm calo phức tạp. Đây là track nền của dự án.',
    kcalRule: 'TDEE hoặc TDEE – 5%',
    proteinRule: '1.2–1.6g/kg/ngày',
    fatRule: '25–30% tổng kcal',
    carbRule: 'Phần còn lại, ưu tiên carb tốt',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: 'Yến mạch + sữa không đường + chuối nhỏ + 1–2 trứng luộc', note: 'Protein + carb no lâu' },
      { t: 'Trưa', food: 'Cơm vừa + cá/gà/thịt nạc/đậu hũ + rau luộc/xào ít dầu + canh', note: '½ rau · ¼ đạm · ¼ tinh bột' },
      { t: 'Xế', food: 'Sữa chua không đường + trái cây', note: 'Snack nhẹ, không đường thêm' },
      { t: 'Tối', food: 'Ức gà/cá/đậu hũ + rau nhiều + khoai lang hoặc cơm ít', note: 'Giảm carb nhẹ so với trưa' },
    ],
    signs: ['Không quá đói vào buổi tối', 'Đi tiêu đều hơn', 'Năng lượng ổn định hơn', 'Vòng eo không tăng', 'Tập luyện dễ vào nhịp hơn'],
    tips: ['Ưu tiên "ăn đủ bữa" — không bỏ sáng', 'Mỗi bữa có đạm + rau là đủ', 'Giảm nước ngọt trước, đếm calo sau'],
    adjustments: [
      { situation: 'Hay đói trước bữa tối', fix: 'Tăng protein bữa trưa hoặc thêm snack xế' },
      { situation: 'Cân tăng nhẹ', fix: 'Kiểm tra khẩu phần tinh bột — vẫn giữ rau và đạm' },
    ],
    weekPlan: [
      { day: 'T2–T5', guide: '3 bữa chính theo đĩa ăn, snack lành mạnh' },
      { day: 'T6–T7', guide: 'Linh hoạt 1 bữa yêu thích — không biến thành xả cả ngày' },
      { day: 'CN', guide: 'Meal prep — chuẩn bị protein/rau/carb cho tuần sau' },
    ],
  },
  {
    id: 'loss',
    label: 'Giảm Mỡ',
    emoji: '🔥',
    color: '#f97316', rgb: '249,115,22',
    tag: 'Thâm hụt thông minh',
    tagline: 'Không đói, không mất cơ — giảm mỡ bền vững',
    who: 'Người muốn giảm mỡ thể người, giảm cân thật sự chứ không chỉ giảm nước. Nguyên tắc: thâm hụt thông minh + đủ protein + nhiều rau + giữ sức tập.',
    kcalRule: 'TDEE × 0.80–0.90 (hoặc TDEE – 300 đến 500 kcal)',
    proteinRule: '1.6–2.2g/kg/ngày (cao hơn bình thường)',
    fatRule: '20–28% tổng kcal — không lạm dụng đồ chiên',
    carbRule: 'Vừa phải, ưu tiên quanh buổi tập',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: '2 trứng + 1 lát bánh mì nguyên cám hoặc khoai lang + dưa leo/cà chua', note: 'Protein ngay buổi sáng' },
      { t: 'Trưa', food: '½–1 chén cơm + 150g cá/gà/thịt nạc/đậu hũ + 2 phần rau + canh', note: 'Rau chiếm ½ đĩa' },
      { t: 'Xế', food: 'Sữa chua Hy Lạp/sữa không đường + 1 quả táo/ổi', note: 'Ngăn đói trước bữa tối' },
      { t: 'Tối', food: 'Cá hấp/gà áp chảo/đậu hũ sốt cà + rau luộc/salad lớn + ít cơm hoặc khoai', note: 'Giảm tinh bột nếu không tập tối' },
    ],
    signs: ['Cân giảm 0.3–0.7kg/tuần là lý tưởng', 'Không cảm thấy quá kiệt sức', 'Sức tập không tụt đáng kể', 'Vòng eo giảm nhất quán'],
    tips: ['Tuần 1–2: TDEE – 10% (nhẹ trước)', 'Protein cao = no lâu + giữ cơ', 'Nếu đói tối: thêm protein nhỏ, không thêm tinh bột'],
    adjustments: [
      { situation: 'Cân không giảm sau 2 tuần', fix: 'Giảm 100–150 kcal từ carb/fat' },
      { situation: 'Quá đói, mệt, tập yếu', fix: 'Tăng rau + protein, thêm carb quanh tập' },
      { situation: 'Cân giảm quá nhanh (>1kg/tuần)', fix: 'Tăng 100–200 kcal — không muốn mất cơ' },
      { situation: 'Eo giảm nhưng cân đứng', fix: 'Giữ nguyên — có thể đang recomp' },
    ],
    weekPlan: [
      { day: 'T2', guide: 'Protein cao, carb vừa quanh buổi tập' },
      { day: 'T3', guide: 'Rau nhiều, carb vừa' },
      { day: 'T4', guide: 'Ngày tập nặng: thêm carb trước/sau tập' },
      { day: 'T5', guide: 'Giữ thâm hụt, snack protein' },
      { day: 'T6', guide: 'Full body: carb vừa-cao' },
      { day: 'T7', guide: 'Nếu đi bộ/đạp xe: carb vừa, không cắt quá thấp' },
      { day: 'CN', guide: 'Recovery: rau nhiều, protein đủ, carb thấp-vừa' },
    ],
  },
  {
    id: 'gain',
    label: 'Tăng Cơ',
    emoji: '💪',
    color: '#84cc16', rgb: '132,204,22',
    tag: 'Lean bulk',
    tagline: 'Dư kcal nhẹ + protein cao + tập kháng lực',
    who: 'Người muốn tăng khối cơ chứ không "bulk bẩn". Cần kết hợp 3 yếu tố: tập kháng lực + đủ protein + dư năng lượng nhẹ.',
    kcalRule: 'TDEE × 1.05–1.10 (hoặc TDEE + 150 đến 300 kcal)',
    proteinRule: '1.6–2.2g/kg/ngày',
    fatRule: '20–30% kcal',
    carbRule: 'Cao hơn track giảm mỡ — carb trước/sau tập quan trọng',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: 'Yến mạch + sữa + chuối + whey hoặc 2–3 trứng', note: 'Bắt đầu ngày với đủ kcal' },
      { t: 'Trưa', food: 'Cơm + thịt bò/gà/cá/đậu hũ + rau + canh', note: 'Bữa lớn nhất ngày' },
      { t: 'Pre-workout', food: 'Chuối + bánh mì/yến mạch/bánh gạo + cà phê nếu hợp', note: '30–60 phút trước tập' },
      { t: 'Sau tập/Tối', food: 'Cơm/khoai/mì nguyên cám + 150–200g protein + rau', note: 'Cửa sổ protein sau tập 45–60 phút' },
      { t: 'Trước ngủ', food: 'Sữa chua Hy Lạp/sữa tươi không đường/phô mai tươi', note: 'Casein chậm tiêu — nuôi cơ cả đêm' },
    ],
    signs: ['Cân tăng 0.3–0.5kg/tuần', 'Sức tập tăng đều', 'Không tăng mỡ bụng đáng kể', 'Hồi phục tốt giữa các buổi'],
    tips: ['Không bulk bẩn — đồ chiên/ngọt tăng mỡ nhanh hơn tăng cơ', 'Protein đều 4–5 bữa mỗi bữa 25–40g', 'Carb trước tập = năng lượng để tập tốt hơn'],
    adjustments: [
      { situation: 'Không tăng cân sau 2 tuần', fix: 'Thêm 150 kcal/ngày từ carb' },
      { situation: 'Tăng cân quá nhanh, bụng to rõ', fix: 'Giảm 100–150 kcal' },
      { situation: 'Tập yếu, khó tăng tạ', fix: 'Tăng carb trước/sau tập' },
      { situation: 'Ăn mãi không đủ kcal', fix: 'Thêm smoothie: sữa + chuối + yến mạch + bơ đậu phộng' },
    ],
    weekPlan: [
      { day: 'T2', guide: 'Dư kcal nhẹ, carb trước/sau tập' },
      { day: 'T3', guide: 'Protein đều 4 bữa' },
      { day: 'T4', guide: 'Ngày tập nặng: tăng carb' },
      { day: 'T5', guide: 'Giữ kcal, không bỏ bữa' },
      { day: 'T6', guide: 'Full body: bữa sau tập lớn hơn' },
      { day: 'T7', guide: 'Nếu cardio dài: thêm carb' },
      { day: 'CN', guide: 'Vẫn đủ protein, kcal không tụt quá thấp' },
    ],
  },
  {
    id: 'recomp',
    label: 'Recomp',
    emoji: '⚖️',
    color: '#06b6d4', rgb: '6,182,212',
    tag: 'Vừa gọn vừa khỏe',
    tagline: 'Tăng cơ nhẹ và giảm mỡ nhẹ cùng lúc — không cần chọn',
    who: 'Cân không quá cao nhưng mỡ bụng nhiều. Muốn người gọn hơn mà không muốn "ăn kiêng". Mới tập hoặc quay lại tập sau nghỉ.',
    kcalRule: 'Ăn quanh TDEE. Ngày tập: TDEE. Ngày nghỉ: TDEE – 5–10%',
    proteinRule: '1.6–2.0g/kg/ngày (gần như track giảm mỡ)',
    fatRule: '25–30% kcal, ổn định',
    carbRule: 'Cao hơn ngày strength, thấp hơn nhẹ ngày nghỉ',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: 'Trứng + bánh mì nguyên cám + trái cây', note: 'Bắt đầu đều, ổn định' },
      { t: 'Trưa', food: 'Cơm vừa + gà/cá/đậu hũ + rau nhiều', note: 'Protein cao, không thiếu rau' },
      { t: 'Trước tập', food: 'Chuối hoặc khoai nhỏ', note: 'Fuel cho buổi tập' },
      { t: 'Tối (sau tập)', food: 'Protein nạc + cơm/khoai + rau', note: 'Ngày nghỉ: giảm nhẹ tinh bột ở bữa này' },
    ],
    signs: ['Eo giảm dù cân đứng = tiến bộ', 'Sức tập tăng', 'Ảnh trước/sau thay đổi rõ hơn cân', 'Cảm giác năng lượng tốt hơn'],
    tips: ['Cân có thể không đổi nhiều — đừng nản', 'Theo dõi vòng eo + ảnh + sức tập, không chỉ nhìn cân', 'Tập kháng lực ít nhất 3x/tuần là bắt buộc'],
    adjustments: [
      { situation: 'Eo giảm, cân đứng', fix: 'Tốt — đang recomp. Giữ nguyên kế hoạch' },
      { situation: 'Eo tăng nhẹ khi tăng carb', fix: 'Surplus quá cao — giảm carb/fat nhẹ' },
      { situation: 'Người mệt, không tiến bộ', fix: 'Xem lại ngủ, nước, tổng kcal' },
    ],
    weekPlan: [
      { day: 'Ngày tập', guide: 'Ăn quanh TDEE, carb cao hơn quanh tập' },
      { day: 'Ngày nghỉ', guide: 'TDEE – 5–10%, protein giữ nguyên, giảm nhẹ tinh bột' },
    ],
  },
  {
    id: 'endurance',
    label: 'Sức Bền',
    emoji: '🚴',
    color: '#8b5cf6', rgb: '139,92,246',
    tag: 'Chạy · Đạp · Bơi',
    tagline: 'Carb là nhiên liệu — ăn đủ để tập tốt và phục hồi nhanh',
    who: 'Người tập sức bền: chạy bộ, đạp xe, bơi, cardio dài. Carb là nhiên liệu chính cho buổi tập. Thiếu carb = tụt pace, đuối sức, tập không hiệu quả.',
    kcalRule: 'Linh hoạt theo ngày: tập dài TDEE+100→300, tập vừa TDEE, recovery TDEE–100→200',
    proteinRule: '1.4–2.0g/kg/ngày tùy cường độ',
    fatRule: '20–28% kcal, ưu tiên không bão hòa',
    carbRule: 'Cao khi tập dài — ngày dài 5–8g/kg, ngày rất dài 8–10g/kg',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Trước tập (1–2h)', food: '1 chuối + 1 lát bánh mì hoặc bánh gạo', note: 'Carb dễ tiêu, không quá nặng bụng' },
      { t: 'Sau tập', food: 'Smoothie: sữa + chuối + yến mạch + whey hoặc sữa chua', note: 'Phục hồi nhanh: protein + carb' },
      { t: 'Trưa', food: 'Phở/bún/cơm + thêm thịt/cá/trứng/đậu + rau', note: 'Bữa chính lớn hơn ngày thường' },
      { t: 'Xế', food: 'Trái cây + sữa chua', note: 'Bù điện giải nhẹ' },
      { t: 'Tối', food: 'Cá/gà/đậu hũ + khoai/cơm + salad/rau', note: 'Phục hồi trước hôm sau' },
    ],
    signs: ['Pace tập ổn định hoặc cải thiện', 'Không đuối sức giữa buổi', 'Hồi phục tốt hôm sau', 'Không thèm ngọt quá mức sau tập'],
    tips: ['Không sợ carb — carb = nhiên liệu', 'Tập trên 60–90 phút: nạp 30–60g carb/giờ trong tập', 'Sau tập dài: protein + carb trong vòng 45 phút'],
    adjustments: [
      { situation: 'Tụt pace, đuối giữa buổi', fix: 'Thiếu carb — tăng carb trước tập và trong tập' },
      { situation: 'Đau nhức kéo dài', fix: 'Tăng ngày recovery, không siết ăn' },
      { situation: 'Chỉ uống nước lọc khi tập dài', fix: 'Thêm điện giải — mất nhiều mồ hôi = mất natri/kali' },
    ],
    weekPlan: [
      { day: 'T2', guide: 'Carb vừa-cao nếu có cardio' },
      { day: 'T3', guide: 'Carb vừa, protein đều' },
      { day: 'T4', guide: 'Interval/tập nặng: carb cao' },
      { day: 'T5', guide: 'Carb vừa, rau nhiều' },
      { day: 'T6', guide: 'Tập phối hợp: carb cao' },
      { day: 'T7', guide: 'Long run/long ride: carb cao + nước/điện giải' },
      { day: 'CN', guide: 'Recovery: protein đủ, carb vừa, rau nhiều' },
    ],
  },
  {
    id: 'recovery',
    label: 'Phục Hồi',
    emoji: '😌',
    color: '#a855f7', rgb: '168,85,247',
    tag: 'Stress · Ngủ kém · Deload',
    tagline: 'Không siết — ăn đúng giờ, dễ tiêu, ngủ tốt hơn',
    who: 'Người stress cao, ngủ kém, mệt mỏi kéo dài sau tập, đang trong tuần deload hoặc trung niên cần phục hồi kỹ hơn.',
    kcalRule: 'TDEE hoặc TDEE – 5% — không siết mạnh khi cơ thể đang stress',
    proteinRule: '1.4–1.6g/kg/ngày — ưu tiên đạm dễ tiêu',
    fatRule: '25–30% kcal — ưu tiên omega-3',
    carbRule: 'Vừa phải, carb tối nhẹ có thể giúp ngủ tốt hơn',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: 'Cháo yến mạch hoặc bánh mì nguyên cám + trứng + trái cây', note: 'Nhẹ bụng, ấm người' },
      { t: 'Trưa', food: 'Cơm + cá/đậu hũ/thịt nạc + rau + canh', note: 'Đủ chất, không quá nặng' },
      { t: 'Xế', food: 'Sữa chua không đường + hạt hoặc trái cây', note: 'Ổn định đường huyết' },
      { t: 'Tối', food: 'Cá/đậu hũ/gà + rau mềm + cơm/khoai lượng vừa', note: 'Carb tối vừa phải — hỗ trợ tổng hợp serotonin' },
      { t: 'Trước ngủ nếu đói', food: 'Sữa ấm không đường hoặc sữa chua nhỏ', note: 'Tryptophan → serotonin → melatonin' },
    ],
    signs: ['Ngủ sâu hơn sau 1–2 tuần', 'Giảm đau nhức kéo dài', 'Năng lượng buổi sáng tốt hơn', 'Giảm thèm ngọt buổi tối'],
    tips: ['Không siết calo khi đang recovery', 'Giảm caffeine muộn (sau 14h)', 'Bữa tối ít dầu mỡ + rau mềm dễ tiêu'],
    adjustments: [
      { situation: 'Vẫn ngủ kém dù ăn tốt', fix: 'Xem lại caffeine, ánh sáng xanh, giờ ngủ' },
      { situation: 'Đau nhức không giảm', fix: 'Tăng omega-3 (cá hồi, hạt chia), giảm tập volume' },
    ],
    weekPlan: [
      { day: 'Mỗi ngày', guide: 'Ăn đúng giờ — không bỏ bữa, không để đói quá lâu' },
      { day: 'Buổi tối', guide: 'Tối dễ tiêu: ít dầu, rau mềm, protein nhẹ' },
      { day: 'Trước ngủ', guide: 'Nếu đói: sữa ấm hoặc sữa chua nhỏ' },
    ],
  },
  {
    id: 'busy',
    label: 'Người Bận',
    emoji: '⏰',
    color: '#eab308', rgb: '234,179,8',
    tag: 'Ăn ngoài · Ít thời gian',
    tagline: 'Quy tắc 3 chọn — không cần hoàn hảo, chỉ cần đủ',
    who: 'Người bận rộn, hay ăn ngoài, ít thời gian chuẩn bị. Nguyên tắc: không cần hoàn hảo, chỉ cần chọn đủ 3 nhóm: 1 protein + 1 rau/canh + 1 carb thông minh.',
    kcalRule: 'TDEE – 5% hoặc TDEE (dễ duy trì là trên hết)',
    proteinRule: '1.2–1.6g/kg/ngày — không cần đếm chính xác',
    fatRule: 'Tự nhiên từ thực phẩm, không cần tính',
    carbRule: 'Carb thông minh khi ăn ngoài: cơm/phở/bún thay bánh chiên',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=70&auto=format&fit=crop',
    meals: [
      { t: 'Sáng', food: 'Bánh mì trứng + rau/dưa leo, hạn chế pate/mayo | Yến mạch chuẩn bị sẵn', note: '< 5 phút chuẩn bị' },
      { t: 'Trưa', food: 'Cơm văn phòng: 1 món đạm nạc + 2 món rau + cơm vừa phần', note: 'Quy tắc 3 chọn tại quán' },
      { t: 'Xế', food: 'Trái cây hoặc sữa chua (mua sẵn)', note: 'Mang theo hoặc mua tiện lợi' },
      { t: 'Tối', food: 'Cơm + cá/gà/đậu hũ + canh rau (nếu ăn nhà) | Phở/bún ít bún thêm thịt (nếu ăn ngoài)', note: 'Ăn ngoài: gọi nước dùng trong, thêm rau' },
    ],
    signs: ['Giảm tần suất đồ chiên/ngọt', 'Ăn đúng 3 bữa chính/ngày', 'Không bỏ bữa rồi ăn bù quá nhiều', 'Cơ thể ổn định hơn mà không cần nỗ lực nhiều'],
    tips: ['Không tìm món hoàn hảo — nâng cấp món có sẵn', 'Cơm gà: bỏ da, bớt nước sốt, thêm rau', 'Phở: thêm thịt nạc, nhiều rau, không quẩy, ít nước béo'],
    adjustments: [
      { situation: 'Hay bỏ bữa sáng', fix: 'Chuẩn bị yến mạch sẵn tối hôm trước' },
      { situation: 'Hay ăn đồ chiên khi bận', fix: 'Luộc trứng sẵn + mang trái cây theo' },
    ],
    weekPlan: [
      { day: 'Mỗi ngày', guide: '3 bữa chính theo quy tắc 3 chọn' },
      { day: 'CN', guide: 'Meal prep 60–90 phút: luộc trứng, áp chảo gà, hấp khoai, rửa rau' },
    ],
  },
];

const QUICK_COMBOS = [
  { goal: 'Giảm mỡ', emoji: '🔥', combo: 'Trứng + sữa chua + trái cây; Cơm ít + gà + rau; Phở thêm thịt ít béo' },
  { goal: 'Tăng cơ', emoji: '💪', combo: 'Cơm + thịt/cá + trứng; Smoothie sữa + chuối + yến mạch; Bánh mì + trứng + sữa' },
  { goal: 'Sức bền', emoji: '🚴', combo: 'Chuối + bánh mì trước tập; Cơm/phở sau tập; Nước + điện giải khi tập dài' },
  { goal: 'Duy trì', emoji: '⚖️', combo: 'Cơm nhà ½ rau–¼ protein–¼ tinh bột; Snack trái cây/sữa chua' },
  { goal: 'Phục hồi', emoji: '😌', combo: 'Cháo/yến mạch/súp + protein mềm; Bữa tối ít dầu dễ tiêu' },
];

const ADJUST_SIGNALS = [
  { icon: '⚖️', trigger: 'Theo cân nặng', items: [
    'Giảm mỡ — 2 tuần không giảm cân/eo: giảm 100–150 kcal',
    'Tăng cơ — 2 tuần không tăng cân/sức: tăng 150 kcal',
    'Duy trì — cân dao động 1–2kg và eo ổn: giữ nguyên',
  ]},
  { icon: '📏', trigger: 'Theo vòng eo', items: [
    'Eo giảm, cân đứng → tốt, có thể đang recomp',
    'Eo tăng khi bulk → surplus quá cao, giảm carb/fat nhẹ',
    'Eo không đổi, người mệt → xem lại ngủ, nước, tổng kcal',
  ]},
  { icon: '🏋️', trigger: 'Theo hiệu suất tập', items: [
    'Tập yếu, chóng mệt → thiếu carb/nước/ngủ',
    'Tập khỏe, hồi phục tốt → giữ kế hoạch',
    'Đau mỏi kéo dài → tăng recovery, không siết ăn',
  ]},
  { icon: '😋', trigger: 'Theo cảm giác đói', items: [
    'Đói nhẹ trước bữa → bình thường',
    'Đói dữ dội buổi tối → protein/rau bữa sáng-trưa thiếu',
    'Thèm ngọt liên tục → kiểm tra ngủ, stress, carb bữa chính',
  ]},
];

const FIVE_QUESTIONS = [
  { n: 1, icon: '🎯', q: 'Bạn muốn gì?', detail: 'Giảm mỡ, tăng cơ, duy trì sức khỏe, tập sức bền hay đơn giản là ăn uống tốt hơn?' },
  { n: 2, icon: '⚡', q: 'Nhu cầu năng lượng?', detail: 'TDEE của bạn là bao nhiêu? Bao nhiêu kcal mỗi ngày để đạt mục tiêu?' },
  { n: 3, icon: '🥩', q: 'Protein–Carb–Fat ưu tiên thế nào?', detail: 'Mục tiêu khác nhau → tỷ lệ macro khác nhau. Protein luôn là nền tảng.' },
  { n: 4, icon: '🍽️', q: 'Mỗi bữa chia ra sao?', detail: 'Số bữa, thời điểm ăn, khung đĩa ăn theo mục tiêu — không phải ai cũng cần 3 bữa chính.' },
  { n: 5, icon: '📊', q: 'Sau 1–2 tuần điều chỉnh bằng dấu hiệu gì?', detail: 'Theo cân nặng, vòng eo, sức tập hay cảm giác đói? Biết cách đọc tín hiệu cơ thể.' },
];

/* ─── Animated macro bar ─── */
function MacroBar({ label, value, max, color, unit = 'g' }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setWidth(Math.min(100, max > 0 ? Math.round((value / max) * 100) : 50));
    }, 80);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span className="font-semibold" style={{ color }}>{value}{unit}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function NutritionGoalPlanPage() {
  useOrbitRing();

  const [b0, setB0] = useState({ w: 65, h: 170, a: 1.55, sx: 'male', goal: 'recomp', age: 30 });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('healthapp_b0_inputs');
      if (raw) setB0(p => ({ ...p, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  const [calcGoal, setCalcGoal] = useState('healthy');
  const [selectedGoal, setSelectedGoal] = useState('healthy');
  const [openSignal, setOpenSignal] = useState(null);

  const calcStats = computeStats(b0, calcGoal);
  const goalData = GOALS.find(g => g.id === selectedGoal);
  const detailStats = computeStats(b0, selectedGoal);

  const toggleSignal = (i) => setOpenSignal(prev => prev === i ? null : i);

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#f5f5f5' }}>
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

        {/* ── Breadcrumb ── */}
        <Link
          to="/pillar/b"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
          style={{ color: '#84cc16' }}
        >
          <span>←</span>
          <span>Dinh Dưỡng</span>
        </Link>

        {/* ── Section 1: Hero ── */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div
            className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(132,204,22,0.05)' }}
          />
          <div
            className="w-20 h-20 rounded-3xl text-5xl shrink-0 flex items-center justify-center border animate-float"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(132,204,22,0.2)' }}
          >
            🎯
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up" style={{ color: '#f5f5f5' }}>
              Meal Plan Theo Mục Tiêu
            </h1>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(132,204,22,0.10)', borderColor: 'rgba(132,204,22,0.20)' }}
            >
              Cá nhân hóa · 7 hướng · Công thức tính toán
            </span>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#9ca3af' }}>
              Không phải ai cũng cần cùng một chế độ ăn. Chọn mục tiêu — nhận công thức, thực đơn mẫu và cách điều chỉnh riêng cho bạn.
            </p>
          </div>
        </div>

        {/* ── Hero image orbit ring ── */}
        <div className="gp-orbit-ring rounded-3xl p-[1.5px] mb-8">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop"
              alt="Meal plan theo mục tiêu"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }}
            />
            <div
              className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(10,10,10,0.6)', borderColor: 'rgba(132,204,22,0.2)' }}
            >
              7 Mục Tiêu Dinh Dưỡng
            </div>
          </div>
        </div>

        {/* ── 4 stat badges ── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: '7 Mục Tiêu', sub: 'cá nhân hóa' },
            { label: '5 Câu Hỏi', sub: 'khung quyết định' },
            { label: '12 Quy Tắc Chỉnh', sub: 'điều chỉnh linh hoạt' },
            { label: '1 Hệ Thống', sub: 'thực tế, duy trì được' },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center px-5 py-3 rounded-2xl border"
              style={{ background: 'rgba(132,204,22,0.06)', borderColor: 'rgba(132,204,22,0.15)' }}
            >
              <span className="text-lg font-bold" style={{ color: '#84cc16' }}>{s.label}</span>
              <span className="text-xs" style={{ color: '#6b7280' }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)' }} />

        {/* ── Section 2: 5 Questions Framework ── */}
        <RevealBlock className="mb-14">
          <div className="mb-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border inline-block mb-4"
              style={{ color: '#84cc16', background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.18)' }}
            >
              Bước 0 — Trước khi chọn mục tiêu
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f5f5f5' }}>
            5 Câu Hỏi Để Chọn Đúng Hướng
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#9ca3af' }}>
            Trả lời 5 câu hỏi này trước khi chọn track. Càng rõ câu trả lời, kế hoạch càng chính xác.
          </p>

          {/* Desktop: horizontal steps | Mobile: vertical */}
          <div className="hidden md:flex gap-0 items-stretch">
            {FIVE_QUESTIONS.map((q, i) => (
              <div key={q.n} className="flex-1 relative">
                {/* connector line */}
                {i < FIVE_QUESTIONS.length - 1 && (
                  <div
                    className="absolute top-8 right-0 w-1/2 h-px z-10"
                    style={{ background: 'rgba(132,204,22,0.3)', transform: 'translateY(-50%)' }}
                  />
                )}
                {i > 0 && (
                  <div
                    className="absolute top-8 left-0 w-1/2 h-px z-10"
                    style={{ background: 'rgba(132,204,22,0.3)', transform: 'translateY(-50%)' }}
                  />
                )}
                <div className="flex flex-col items-center px-2 relative z-20">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border mb-3 shrink-0"
                    style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.2)' }}
                  >
                    {q.icon}
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-3"
                    style={{ background: '#84cc16', color: '#000' }}
                  >
                    {q.n}
                  </div>
                  <p className="text-xs font-bold text-center mb-1" style={{ color: '#f5f5f5' }}>{q.q}</p>
                  <p className="text-xs text-center leading-relaxed" style={{ color: '#6b7280' }}>{q.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical list */}
          <div className="flex flex-col gap-4 md:hidden">
            {FIVE_QUESTIONS.map(q => (
              <div
                key={q.n}
                className="flex items-start gap-4 rounded-2xl border p-4"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                  style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.2)' }}
                >
                  {q.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: '#84cc16', color: '#000' }}
                    >
                      {q.n}
                    </span>
                    <span className="text-sm font-bold" style={{ color: '#f5f5f5' }}>{q.q}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{q.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── Section 3: TDEE + Goal Macro Calculator ── */}
        <RevealBlock className="mb-14">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Tính Macro Theo Mục Tiêu</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Dựa trên dữ liệu của bạn từ B0 ({b0.w}kg · {b0.h}cm · {b0.age} tuổi · {b0.sx === 'female' ? 'nữ' : 'nam'}). Chọn mục tiêu để xem macro phù hợp.
          </p>

          {/* Goal selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setCalcGoal(g.id)}
                className="px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-200"
                style={{
                  background: calcGoal === g.id ? `rgba(${g.rgb},0.15)` : 'rgba(255,255,255,0.04)',
                  borderColor: calcGoal === g.id ? g.color : 'rgba(255,255,255,0.1)',
                  color: calcGoal === g.id ? g.color : '#9ca3af',
                  boxShadow: calcGoal === g.id ? `0 0 10px rgba(${g.rgb},0.2)` : 'none',
                }}
              >
                {g.emoji} {g.label}
              </button>
            ))}
          </div>

          {/* Macro cards */}
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: `rgba(${GOALS.find(g => g.id === calcGoal)?.rgb || '132,204,22'},0.2)` }}
          >
            {/* Formula note */}
            <div
              className="rounded-xl px-4 py-3 mb-5 text-xs leading-relaxed border-l-4"
              style={{ background: 'rgba(132,204,22,0.06)', borderLeftColor: '#84cc16', color: '#9ca3af' }}
            >
              <span className="font-bold" style={{ color: '#84cc16' }}>Công thức: </span>
              BMR (Mifflin-St Jeor) × hệ số hoạt động × hệ số mục tiêu
              <br />
              <span className="font-mono text-xs mt-1 block" style={{ color: '#6b7280' }}>
                {b0.sx === 'female'
                  ? `BMR = 10×${b0.w} + 6.25×${b0.h} − 5×${b0.age} − 161 = ${calcStats.bmr} kcal`
                  : `BMR = 10×${b0.w} + 6.25×${b0.h} − 5×${b0.age} + 5 = ${calcStats.bmr} kcal`}
              </span>
              <span className="font-mono text-xs block" style={{ color: '#6b7280' }}>
                TDEE = {calcStats.bmr} × {b0.a} = {calcStats.tdee} kcal → Mục tiêu: {calcStats.targetKcal} kcal/ngày
              </span>
            </div>

            {/* 4 macro cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6" key={calcGoal}>
              {[
                { label: 'Calo mục tiêu', value: calcStats.targetKcal, unit: 'kcal', color: GOALS.find(g => g.id === calcGoal)?.color || '#84cc16', max: calcStats.tdee * 1.2 },
                { label: 'Protein', value: calcStats.proteinG, unit: 'g', color: '#22c55e', max: Math.round(b0.w * 2.5) },
                { label: 'Carb', value: calcStats.carbG, unit: 'g', color: '#f97316', max: Math.round(calcStats.targetKcal * 0.55 / 4) },
                { label: 'Fat', value: calcStats.fatG, unit: 'g', color: '#06b6d4', max: Math.round(calcStats.targetKcal * 0.35 / 9) },
              ].map(m => (
                <div
                  key={m.label}
                  className="rounded-xl border p-3 flex flex-col items-center"
                  style={{ background: `rgba(${m.color === '#22c55e' ? '34,197,94' : m.color === '#f97316' ? '249,115,22' : m.color === '#06b6d4' ? '6,182,212' : GOALS.find(g => g.id === calcGoal)?.rgb || '132,204,22'},0.06)`, borderColor: `${m.color}28` }}
                >
                  <span className="text-xl font-bold mb-0.5" style={{ color: m.color }}>{m.value}</span>
                  <span className="text-xs font-semibold mb-2" style={{ color: m.color }}>{m.unit}</span>
                  <span className="text-xs text-center leading-tight" style={{ color: '#6b7280' }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <div key={`bars-${calcGoal}`}>
              <MacroBar label="Protein" value={calcStats.proteinG} max={Math.round(b0.w * 2.2)} color="#22c55e" />
              <MacroBar label="Carbohydrate" value={calcStats.carbG} max={Math.round(calcStats.targetKcal * 0.55 / 4)} color="#f97316" />
              <MacroBar label="Chất béo" value={calcStats.fatG} max={Math.round(calcStats.targetKcal * 0.35 / 9)} color="#06b6d4" />
              <MacroBar label="Nước" value={calcStats.waterMl} max={3000} color="#84cc16" unit="ml" />
            </div>
          </div>
        </RevealBlock>

        {/* ── Section 4: Goal Profile Selector ── */}
        <RevealBlock className="mb-14">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>7 Hồ Sơ Mục Tiêu</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Chọn mục tiêu phù hợp để xem thực đơn mẫu, tips và lịch tuần chi tiết.
          </p>

          {/* Goal cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {GOALS.map(g => {
              const active = selectedGoal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className="flex flex-col items-center gap-1 rounded-2xl border p-4 transition-all duration-250 text-center"
                  style={{
                    background: active ? `rgba(${g.rgb},0.12)` : 'rgba(255,255,255,0.03)',
                    borderColor: active ? g.color : 'rgba(255,255,255,0.08)',
                    borderWidth: active ? 2 : 1,
                    boxShadow: active ? `0 0 16px rgba(${g.rgb},0.2)` : 'none',
                  }}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="text-xs font-bold leading-tight" style={{ color: active ? g.color : '#f5f5f5' }}>{g.label}</span>
                  <span
                    className="text-[10px] leading-tight px-2 py-0.5 rounded-full border mt-1"
                    style={{
                      color: active ? g.color : '#6b7280',
                      background: active ? `rgba(${g.rgb},0.12)` : 'transparent',
                      borderColor: active ? `rgba(${g.rgb},0.3)` : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    {g.tag.split(' · ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Goal detail panel */}
          {goalData && (
            <div
              key={selectedGoal}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: `rgba(${goalData.rgb},0.25)`, background: 'rgba(255,255,255,0.02)' }}
            >
              {/* Header */}
              <div
                className="p-6 border-b"
                style={{ background: `rgba(${goalData.rgb},0.08)`, borderColor: `rgba(${goalData.rgb},0.18)` }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0">{goalData.emoji}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-bold" style={{ color: goalData.color }}>{goalData.label}</h3>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full border"
                        style={{ color: goalData.color, background: `rgba(${goalData.rgb},0.12)`, borderColor: `rgba(${goalData.rgb},0.3)` }}
                      >
                        {goalData.tag}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#f5f5f5' }}>{goalData.tagline}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{goalData.who}</p>
                  </div>
                </div>
              </div>

              {/* Goal image */}
              <div className="relative h-44 md:h-56 overflow-hidden">
                <img src={goalData.image} alt={goalData.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)' }} />
                <div
                  className="absolute bottom-4 left-5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ color: goalData.color, background: 'rgba(10,10,10,0.65)', borderColor: `rgba(${goalData.rgb},0.3)` }}
                >
                  {goalData.kcalRule}
                </div>
              </div>

              <div className="p-6">
                {/* Personalized macro block */}
                <div
                  className="rounded-xl border p-4 mb-6"
                  style={{ background: `rgba(${goalData.rgb},0.06)`, borderColor: `rgba(${goalData.rgb},0.18)` }}
                >
                  <h4 className="text-sm font-bold mb-3" style={{ color: goalData.color }}>Macro cá nhân hóa cho bạn ({b0.w}kg)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4" key={`detail-${selectedGoal}`}>
                    {[
                      { label: 'Mục tiêu/ngày', value: detailStats.targetKcal, unit: 'kcal', color: goalData.color },
                      { label: 'Protein', value: detailStats.proteinG, unit: 'g', color: '#22c55e' },
                      { label: 'Carb', value: detailStats.carbG, unit: 'g', color: '#f97316' },
                      { label: 'Fat', value: detailStats.fatG, unit: 'g', color: '#06b6d4' },
                    ].map(m => (
                      <div key={m.label} className="flex flex-col items-center">
                        <span className="text-lg font-bold" style={{ color: m.color }}>{m.value}<span className="text-xs ml-0.5">{m.unit}</span></span>
                        <span className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-6" key={`pbars-${selectedGoal}`}>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#6b7280' }}>Protein/ngày: {goalData.proteinRule}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>Fat/ngày: {goalData.fatRule}</div>
                    </div>
                    <div>
                      <div className="text-xs mb-1" style={{ color: '#6b7280' }}>Carb/ngày: {goalData.carbRule}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>Nước: {detailStats.waterMl}ml/ngày</div>
                    </div>
                  </div>
                </div>

                {/* Meal structure */}
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Thực đơn mẫu</h4>
                <div className="space-y-2 mb-6">
                  {goalData.meals.map((meal, mi) => (
                    <div
                      key={mi}
                      className="flex items-start gap-3 rounded-xl border p-3"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                    >
                      <span
                        className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg mt-0.5"
                        style={{ background: `rgba(${goalData.rgb},0.12)`, color: goalData.color, minWidth: 52, textAlign: 'center' }}
                      >
                        {meal.t}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm leading-snug mb-1" style={{ color: '#d1d5db' }}>{meal.food}</p>
                        <span className="text-xs italic" style={{ color: '#6b7280' }}>{meal.note}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress signs */}
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Dấu hiệu đang đi đúng hướng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {goalData.signs.map((sign, si) => (
                    <div key={si} className="flex items-start gap-2">
                      <span className="shrink-0 text-sm mt-0.5" style={{ color: '#22c55e' }}>✓</span>
                      <span className="text-sm" style={{ color: '#d1d5db' }}>{sign}</span>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Tips quan trọng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {goalData.tips.map((tip, ti) => (
                    <div
                      key={ti}
                      className="rounded-xl border p-3"
                      style={{ background: `rgba(${goalData.rgb},0.06)`, borderColor: `rgba(${goalData.rgb},0.18)` }}
                    >
                      <span className="text-xs leading-relaxed" style={{ color: '#d1d5db' }}>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Weekly schedule */}
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Khung tuần</h4>
                <div className="rounded-xl border overflow-hidden mb-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {goalData.weekPlan.map((row, ri) => (
                    <div
                      key={ri}
                      className="flex items-start gap-4 p-3 border-b last:border-b-0"
                      style={{ borderColor: 'rgba(255,255,255,0.06)', background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                    >
                      <span
                        className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: `rgba(${goalData.rgb},0.12)`, color: goalData.color, minWidth: 60, textAlign: 'center' }}
                      >
                        {row.day}
                      </span>
                      <span className="text-sm" style={{ color: '#d1d5db' }}>{row.guide}</span>
                    </div>
                  ))}
                </div>

                {/* Adjustment rules */}
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Quy tắc điều chỉnh</h4>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="grid grid-cols-2 text-xs font-bold px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280', background: 'rgba(255,255,255,0.04)' }}>
                    <span>Tình huống</span>
                    <span>Điều chỉnh</span>
                  </div>
                  {goalData.adjustments.map((adj, ai) => (
                    <div
                      key={ai}
                      className="grid grid-cols-2 gap-4 px-3 py-3 border-b last:border-b-0 text-sm"
                      style={{ borderColor: 'rgba(255,255,255,0.05)', background: ai % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                    >
                      <span style={{ color: '#9ca3af' }}>{adj.situation}</span>
                      <span style={{ color: goalData.color }}>{adj.fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ── Section 5: Universal Plate Reminder ── */}
        <RevealBlock className="mb-14">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Công Thức Đĩa Ăn Mọi Mục Tiêu</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9ca3af' }}>
            Dù theo mục tiêu nào, mỗi bữa chính vẫn bám theo khung đĩa ăn này.
          </p>

          <div
            className="rounded-2xl border p-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* SVG pie */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <svg viewBox="0 0 220 220" width="200" height="200">
                  {/* ½ rau — top half: 270deg to 90deg (going clockwise) */}
                  <path d="M110,110 L110,20 A90,90 0 1,1 20,110 Z" fill="#22c55e" opacity="0.85" />
                  {/* ¼ protein — bottom-left quarter: 90deg to 180deg */}
                  <path d="M110,110 L20,110 A90,90 0 0,1 110,200 Z" fill="#84cc16" opacity="0.85" />
                  {/* ¼ carb — bottom-right quarter: 0 to 90deg (bottom-right) */}
                  <path d="M110,110 L110,200 A90,90 0 0,1 200,110 Z" fill="#f97316" opacity="0.85" />
                  {/* fat sliver chip hint */}
                  <path d="M110,110 L200,110 A90,90 0 0,1 173,47 Z" fill="#eab308" opacity="0.7" />
                  {/* Center circle */}
                  <circle cx="110" cy="110" r="38" fill="#0a0a0a" />
                  <text x="110" y="107" textAnchor="middle" fill="#f5f5f5" fontSize="11" fontWeight="bold">Đĩa</text>
                  <text x="110" y="121" textAnchor="middle" fill="#9ca3af" fontSize="9">chuẩn</text>
                </svg>
                <div
                  className="text-xs text-center px-3 py-2 rounded-xl border"
                  style={{ color: '#9ca3af', borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', maxWidth: 200 }}
                >
                  WHO: ≥400g rau mỗi ngày để giảm nguy cơ bệnh mãn tính
                </div>
              </div>

              {/* Legend + hand portions */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: '🥦', color: '#22c55e', label: '½ Rau', sub: 'Rau củ quả đa màu sắc' },
                    { icon: '🥩', color: '#84cc16', label: '¼ Đạm', sub: 'Thịt/cá/trứng/đậu' },
                    { icon: '🍚', color: '#f97316', label: '¼ Tinh bột', sub: 'Cơm/khoai/yến mạch' },
                    { icon: '🥑', color: '#eab308', label: 'Chất béo tốt', sub: 'Dầu/hạt/bơ — nhỏ' },
                  ].map(seg => (
                    <div
                      key={seg.label}
                      className="rounded-xl border p-3 flex items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: `${seg.color}22` }}
                    >
                      <span className="text-2xl">{seg.icon}</span>
                      <div>
                        <div className="text-sm font-bold" style={{ color: seg.color }}>{seg.label}</div>
                        <div className="text-xs" style={{ color: '#6b7280' }}>{seg.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl border-l-4 px-4 py-3 text-sm leading-relaxed"
                  style={{ background: 'rgba(132,204,22,0.06)', borderLeftColor: '#84cc16', color: '#d1d5db' }}
                >
                  <span className="font-semibold" style={{ color: '#84cc16' }}>Ghi nhớ: </span>
                  Không cân đo chính xác — dùng bàn tay làm đơn vị. Mỗi người có bàn tay tỷ lệ với cơ thể, nên đây là thước đo cá nhân hóa tự nhiên nhất.
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── Section 6: Quick Combo Table ── */}
        <RevealBlock className="mb-14">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Combo Nhanh Theo Mục Tiêu</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Không có thời gian lên kế hoạch? Dùng combo gợi ý này ngay.</p>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-12 px-4 py-3 border-b text-xs font-bold uppercase tracking-widest"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)', color: '#6b7280' }}
            >
              <span className="col-span-3">Mục tiêu</span>
              <span className="col-span-9">Combo gợi ý</span>
            </div>
            {QUICK_COMBOS.map((row, ri) => (
              <div
                key={ri}
                className="grid grid-cols-12 px-4 py-4 border-b last:border-b-0 items-start gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
              >
                <div className="col-span-3 flex items-center gap-2">
                  <span className="text-xl">{row.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>{row.goal}</span>
                </div>
                <div className="col-span-9">
                  {row.combo.split('; ').map((c, ci) => (
                    <div key={ci} className="flex items-start gap-2 mb-1 last:mb-0">
                      <span className="shrink-0 mt-0.5" style={{ color: '#84cc16', fontSize: 12 }}>·</span>
                      <span className="text-sm" style={{ color: '#d1d5db' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── Section 7: Adjustment Signals Accordion ── */}
        <RevealBlock className="mb-14">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Tín Hiệu Điều Chỉnh Phổ Quát</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Áp dụng cho mọi mục tiêu — đọc đúng tín hiệu cơ thể để điều chỉnh kịp thời.
          </p>
          <div className="space-y-3">
            {ADJUST_SIGNALS.map((sig, i) => {
              const open = openSignal === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: open ? 'rgba(132,204,22,0.3)' : 'rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => toggleSignal(i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sig.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: open ? '#84cc16' : '#f5f5f5' }}>
                        {sig.trigger}
                      </span>
                    </div>
                    <span
                      className="text-base transition-transform duration-300"
                      style={{ color: '#84cc16', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}
                    >
                      ↓
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(132,204,22,0.15)' }}>
                      <ul className="space-y-2 mt-4">
                        {sig.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 text-sm" style={{ color: '#84cc16' }}>→</span>
                            <span className="text-sm" style={{ color: '#d1d5db' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealBlock>

        {/* ── Section 8: Safety note + CTA ── */}
        <RevealBlock className="mb-4">
          <div
            className="rounded-2xl border p-5 mb-8"
            style={{ background: 'rgba(132,204,22,0.04)', borderColor: 'rgba(132,204,22,0.15)' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#84cc16' }}>Lưu ý an toàn</p>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  Các công thức và thực đơn trên mang tính tham khảo, dựa trên dữ liệu bạn nhập. Nếu có bệnh nền, đang dùng thuốc, mang thai hoặc có nhu cầu đặc biệt, hãy tham khảo chuyên gia dinh dưỡng hoặc bác sĩ trước khi thay đổi chế độ ăn.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              to="/pillar/b"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
              style={{ background: 'rgba(132,204,22,0.12)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.3)' }}
            >
              ← Quay lại Dinh Dưỡng
            </Link>
            <Link
              to="/pillar/b/7day"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
              style={{ background: '#84cc16', color: '#000' }}
            >
              Xem Meal Plan 7 Ngày →
            </Link>
          </div>
        </RevealBlock>

      </div>
    </div>
  );
}
