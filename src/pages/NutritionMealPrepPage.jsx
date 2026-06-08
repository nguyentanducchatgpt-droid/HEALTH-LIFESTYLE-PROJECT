import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── orbit ring ── */
const ORBIT_ID = 'mp-orbit-kf';
const ORBIT_CSS = `
@property --mp-orbit-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@keyframes mpOrbitSpin{to{--mp-orbit-angle:360deg;}}
.mp-orbit-ring{
  background:conic-gradient(
    from var(--mp-orbit-angle),
    transparent 0deg,transparent 55deg,
    rgba(99,102,241,0.0) 65deg,rgba(99,102,241,0.75) 85deg,
    rgba(255,255,255,0.9) 92deg,rgba(99,102,241,0.75) 99deg,
    rgba(99,102,241,0.0) 115deg,transparent 125deg,transparent 360deg
  );
  animation:mpOrbitSpin 3.5s linear infinite;
}
@keyframes mpFadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
.mp-fade-up{animation:mpFadeUp .6s ease both}
@keyframes mpFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.mp-float{animation:mpFloat 3.2s ease-in-out infinite}
@keyframes mpTimerTick{0%{transform:scaleX(1)}50%{transform:scaleX(1.04)}100%{transform:scaleX(1)}}
.mp-tick{animation:mpTimerTick 1s ease-in-out infinite}
@keyframes mpSlideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.mp-slide-in{animation:mpSlideIn .4s ease both}
@keyframes mpCheckPop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
.mp-check-pop{animation:mpCheckPop .3s ease both}
`;

/* ── scroll reveal ── */
function RevealBlock({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── B0 personalized ── */
const B0_KEY = 'healthapp_b0_inputs';
const ACT_C = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
const GOAL_DELTA = { loss: -400, recomp: 0, gain: 300 };
const GOAL_BOX = { loss: 'lose', recomp: 'maintain', gain: 'gain' };
function calcB0(inp) {
  const w = +inp.weight || 70, h = +inp.height || 170, age = +inp.age || 30;
  const bmr = inp.sex === 'female' ? 10 * w + 6.25 * h - 5 * age - 161 : 10 * w + 6.25 * h - 5 * age + 5;
  const tdee = bmr * (ACT_C[inp.activityKey] || 1.55);
  const goalKey = inp.goalKey || 'recomp';
  const kcal = Math.round(tdee + (GOAL_DELTA[goalKey] ?? 0));
  return { w, kcal, protein: Math.round(w * (goalKey === 'loss' || goalKey === 'gain' ? 2.0 : 1.6)), goal: GOAL_BOX[goalKey] || 'maintain' };
}

/* ── timer steps ── */
const TIMER_STEPS = [
  { min: '0–3', label: 'Chuẩn Bị Nhanh', color: '#818cf8', icon: '🔪', tasks: ['Rửa tay, lấy 6 hộp đựng sạch', 'Bắc nồi luộc trứng', 'Bật nồi cơm (hoặc dùng cơm nấu sẵn)', 'Rửa nhanh rau củ dưới vòi'], tip: 'Mẹo: nấu cơm trước để tiết kiệm 10 phút.' },
  { min: '3–8', label: 'Ướp Đạm', color: '#a78bfa', icon: '🥩', tasks: ['Cắt gà thành miếng vừa ăn (3–4 cm)', 'Ướp: 1M nước tương ít muối + 1M chanh + 1m dầu olive + tỏi + tiêu', 'Trộn đều, để nghỉ 5 phút', 'Có thể thêm gừng nếu thích'], tip: 'Mẹo: ướp trong túi zip tiết kiệm bát đĩa.' },
  { min: '8–18', label: 'Nấu Đạm & Luộc Trứng', color: '#c084fc', icon: '🍳', tasks: ['Song song: áp chảo gà 8–10 phút (không cần nhiều dầu)', 'Luộc trứng 8–10 phút song song', 'Đảo đều mặt gà cho chín đều', 'Khi gà vừa chín, tắt bếp + đậy nắp 1–2 phút'], tip: 'Mẹo chống khô: thêm ít nước, đậy nắp cuối.' },
  { min: '18–24', label: 'Xử Lý Rau', color: '#e879f9', icon: '🥦', tasks: ['Bông cải: luộc/hấp 3–4 phút', 'Cà rốt: 4–5 phút', 'Cải thìa: 2–3 phút', 'Hoặc rau sống (dưa leo/cà chua) — nhanh nhất'], tip: 'Mẹo: dùng rau sống tiết kiệm 5 phút.' },
  { min: '24–27', label: 'Pha Sốt', color: '#f472b6', icon: '🧴', tasks: ['Sốt chanh tỏi: 2M chanh + 1M nước tương + tỏi + tiêu + 1m dầu mè', 'Sốt sữa chua: 4M sữa chua + chanh + tiêu + tỏi bột + muối', 'Sốt mè gừng: 1m dầu mè + nước tương + gừng + chanh + mè rang'], tip: 'Mẹo: làm 1 lọc sốt dùng cả 3 ngày.' },
  { min: '27–30', label: 'Chia Hộp & Ghi Nhãn', color: '#fb7185', icon: '📦', tasks: ['Chia đều: gà + cơm/khoai + rau vào 6 hộp', 'Sốt để lọ riêng (giữ rau giòn lâu hơn)', 'Dán nhãn Ngày 1 / Ngày 2 / Ngày 3', 'Để nguội → cho ngay vào tủ lạnh'], tip: 'Mẹo: ghi giờ nấu lên nhãn để kiểm soát an toàn.' },
];

/* ── box formulas ── */
const BOX_FORMULAS = {
  lose: { label: 'Giảm Mỡ', icon: '🔥', color: '#f43f5e', protein: '120–150g', carb: '½–1 chén', veg: '2–3 chén', fat: '1 muỗng cà phê', kcal: '450–550', notes: 'Tăng rau lên ½–⅔ hộp để no lâu. Hạn chế sốt nhiều đường/dầu. Snack: sữa chua, trứng, rau củ.' },
  maintain: { label: 'Sống Khỏe', icon: '🌿', color: '#22c55e', protein: '120g', carb: '1 chén', veg: '2 chén', fat: '1 muỗng cà phê', kcal: '550–650', notes: 'Cân đối. Mỗi bữa đủ 3 nhóm. Không cần cân đo quá kỹ, dùng bàn tay làm thước.' },
  gain: { label: 'Tăng Cơ', icon: '💪', color: '#a855f7', protein: '180–220g', carb: '1.5–2 chén', veg: '1–2 chén', fat: '1 muỗng canh', kcal: '700–850', notes: 'Tăng đạm và tinh bột. Thêm snack giàu protein. Sữa/whey sau tập nặng.' },
  athlete: { label: 'Tập Nhiều', icon: '⚡', color: '#f59e0b', protein: '200–250g', carb: '2 chén (ngày tập)', veg: '2 chén', fat: '1 muỗng canh', kcal: '800–950', notes: 'Tăng carb quanh buổi tập. Pre-workout: chuối + sữa. Post-workout: cơm + gà ngay.' },
};

/* ── 3-day meal plan ── */
const DAY_PLANS = [
  {
    label: 'Ngày 1', theme: 'Cơm Gà Rau Củ', icon: '🍚',
    meals: [
      { time: '🌅 Sáng', food: 'Yến mạch + sữa chua + chuối', alt: 'Hoặc: 2 trứng + 1 lát bánh mì + dưa leo', kcal: 380 },
      { time: '☀️ Trưa', food: 'Cơm + gà áp chảo chanh tỏi + bông cải + cà rốt', alt: 'Sốt chanh tỏi', kcal: 620 },
      { time: '⚡ Xế', food: 'Sữa chua không đường + 1 trái táo/ổi', alt: '10–15 hạt hạnh nhân tùy chọn', kcal: 180 },
      { time: '🌙 Tối', food: 'Gà xé + rau sống + khoai lang', alt: 'Thêm canh rau nếu muốn', kcal: 520 },
    ],
    total: 1700,
  },
  {
    label: 'Ngày 2', theme: 'Salad Gà Trứng', icon: '🥗',
    meals: [
      { time: '🌅 Sáng', food: '2 trứng luộc + 1 củ khoai lang + 1 ly sữa không đường', alt: '', kcal: 420 },
      { time: '☀️ Trưa', food: 'Salad gà + trứng luộc + dưa leo/cà chua/xà lách', alt: '½–1 chén cơm hoặc khoai tùy mục tiêu', kcal: 580 },
      { time: '⚡ Xế', food: 'Trái cây + 10–15 hạt hạnh nhân/điều', alt: '', kcal: 160 },
      { time: '🌙 Tối', food: 'Cơm/khoai + gà + rau xào', alt: 'Nếu tập tối: thêm 1 chuối trước tập 60 phút', kcal: 540 },
    ],
    total: 1700,
  },
  {
    label: 'Ngày 3', theme: 'Bún Gà Đổi Vị', icon: '🍜',
    meals: [
      { time: '🌅 Sáng', food: 'Overnight oats: yến mạch + sữa chua + trái cây', alt: 'Hoặc: bánh mì nguyên cám + trứng', kcal: 390 },
      { time: '☀️ Trưa', food: 'Bún gạo/gạo lứt + gà xé + rau sống + sốt chanh tỏi', alt: '', kcal: 600 },
      { time: '⚡ Xế', food: 'Sữa chua hoặc sữa tươi không đường', alt: '', kcal: 150 },
      { time: '🌙 Tối', food: 'Hộp còn lại: gà + rau + cơm/khoai', alt: 'Thêm đậu phụ hoặc canh nếu đói', kcal: 560 },
    ],
    total: 1700,
  },
];

/* ── rotation themes ── */
const ROTATION = [
  { week: 'Tuần 1', theme: 'Gà áp chảo — Cơm — Rau luộc', icon: '🍗', protein: 'Gà áp chảo chanh tỏi', carb: 'Cơm trắng / gạo lứt', veg: 'Bông cải + cà rốt + cải thìa', sauce: 'Sốt chanh tỏi', color: '#818cf8' },
  { week: 'Tuần 2', theme: 'Cá áp chảo — Khoai — Salad', icon: '🐟', protein: 'Cá áp chảo', carb: 'Khoai lang hấp', veg: 'Xà lách + dưa leo + cà chua', sauce: 'Sốt sữa chua', color: '#22c55e' },
  { week: 'Tuần 3', theme: 'Bò nạc — Nui — Rau xào', icon: '🥩', protein: 'Bò xào hành tây + nấm', carb: 'Nui nguyên cám hoặc cơm', veg: 'Rau củ xào tổng hợp', sauce: 'Sốt tiêu đen nhẹ', color: '#f59e0b' },
  { week: 'Tuần 4', theme: 'Đậu phụ/Trứng — Cơm — Canh rau', icon: '🥚', protein: 'Đậu phụ áp chảo + trứng luộc', carb: 'Cơm trắng', veg: 'Canh rau ngót / cải', sauce: 'Sốt mè gừng', color: '#f43f5e' },
];

/* ── sauces ── */
const SAUCES = [
  { name: 'Sốt Chanh Tỏi', icon: '🍋', kcal: 25, color: '#facc15', pairs: 'Gà, cá, salad, bún', recipe: ['2M nước cốt chanh', '1M nước tương ít muối', '1M nước lọc', 'Tỏi băm nhuyễn', 'Tiêu + ớt tùy khẩu vị', '1m dầu mè (tùy chọn)'] },
  { name: 'Sốt Sữa Chua', icon: '🥛', kcal: 40, color: '#38bdf8', pairs: 'Salad, gà, cá, khoai', recipe: ['4M sữa chua không đường', '1M nước cốt chanh', 'Tiêu xay', 'Tỏi bột hoặc tỏi băm rất nhuyễn', 'Ít muối', 'Rau mùi/ngò tùy chọn'] },
  { name: 'Sốt Mè Gừng', icon: '🌰', kcal: 35, color: '#fb923c', pairs: 'Cơm gà, rau luộc, đậu phụ', recipe: ['1m dầu mè rang', '1M nước tương ít muối', 'Gừng tươi băm nhỏ', 'Chanh tươi', '1–2M nước lọc', 'Mè rang để phủ lên'] },
];

/* ── ingredient sample for 3 days (from docx section 6 + 7) ── */
const SAMPLE_PROTEINS = [
  { name: 'Ức gà / Đùi gà bỏ da', qty: '600g', icon: '🍗', note: 'Dễ nấu, ngon, giá hợp lý — lựa chọn số 1' },
  { name: 'Cá basa / Cá thu / Cá nục', qty: '400–500g', icon: '🐟', note: 'Tùy ngân sách; cá hồi nếu muốn cao cấp hơn' },
  { name: 'Trứng gà', qty: '6 quả', icon: '🥚', note: 'Luộc sẵn, ăn kèm hoặc làm bữa phụ nhanh' },
  { name: 'Đậu phụ / Đậu hũ', qty: '3 miếng (300g)', icon: '🟨', note: 'Tốt cho người ăn chay hoặc muốn đổi vị' },
  { name: 'Thịt nạc heo / Bò nạc', qty: '300–400g', icon: '🥩', note: 'Chọn phần thăn hoặc mông để ít mỡ' },
];
const SAMPLE_CARBS = [
  { name: 'Gạo trắng / Gạo lứt', icon: '🍚', note: 'Nấu 1 nồi, dùng cả 3 ngày' },
  { name: 'Khoai lang', icon: '🍠', note: 'Hấp vi sóng 5 phút — nhanh nhất' },
  { name: 'Bún gạo', icon: '🍜', note: 'Ngâm nước sôi 5 phút là dùng được' },
  { name: 'Yến mạch', icon: '🥣', note: 'Bữa sáng nhanh, không cần nấu nhiều' },
  { name: 'Nui / Mì nguyên cám', icon: '🍝', note: 'Luộc trước, giữ tủ lạnh 3 ngày' },
  { name: 'Ngô / Bắp', icon: '🌽', note: 'Luộc 10 phút, dùng thay tinh bột buổi tối' },
];
const SAMPLE_VEGS = [
  { name: 'Bông cải xanh', icon: '🥦', cookTime: '3–4 phút', method: 'Luộc/hấp' },
  { name: 'Cà rốt', icon: '🥕', cookTime: '4–5 phút', method: 'Luộc/hấp' },
  { name: 'Bí đỏ', icon: '🎃', cookTime: '5–7 phút', method: 'Hấp/luộc' },
  { name: 'Đậu que', icon: '🫛', cookTime: '3–4 phút', method: 'Luộc/xào' },
  { name: 'Cải thìa', icon: '🥬', cookTime: '2–3 phút', method: 'Luộc/xào' },
  { name: 'Rau muống', icon: '🌿', cookTime: '2–3 phút', method: 'Luộc/xào' },
  { name: 'Dưa leo', icon: '🥒', cookTime: 'Không cần', method: 'Rau sống' },
  { name: 'Xà lách', icon: '🥗', cookTime: 'Không cần', method: 'Rau sống' },
  { name: 'Cà chua', icon: '🍅', cookTime: 'Không cần', method: 'Rau sống' },
  { name: 'Nấm các loại', icon: '🍄', cookTime: '3–5 phút', method: 'Xào/luộc' },
];
const SAMPLE_FATS = [
  { name: 'Dầu olive / Dầu mè', use: 'Nấu ăn và làm sốt' },
  { name: 'Mè rang', use: 'Rắc lên hộp, thêm hương vị' },
  { name: 'Bơ đậu phộng ít đường', use: 'Sốt bơ đậu phộng hoặc ăn kèm bánh mì sáng' },
  { name: 'Sốt sữa chua không đường', use: 'Làm sốt salad hoặc dipping' },
];
const SAMPLE_SNACKS = [
  { name: 'Sữa chua không đường', qty: '3–6 hộp', icon: '🥛' },
  { name: 'Trái cây: chuối, táo, cam, ổi', qty: '3–6 phần', icon: '🍎' },
  { name: 'Hạt: hạnh nhân, điều, óc chó', qty: '50–80g', icon: '🥜' },
  { name: 'Trứng luộc (nấu sẵn từ batch)', qty: '3–6 quả', icon: '🥚' },
  { name: 'Sữa tươi không đường', qty: '3 hộp', icon: '🍼' },
  { name: 'Whey protein (nếu tập nặng)', qty: 'Tùy nhu cầu', icon: '💊' },
];
/* Bộ nền cụ thể (công thức bản nền từ docx section 7) */
const BASE_PACK = [
  { group: 'Đạm', icon: '🍗', qty1: '600g ức gà + 3 trứng', qty2: '1.2kg gà + 6 trứng', note: 'Áp chảo gà 10 phút + luộc trứng song song' },
  { group: 'Tinh bột', icon: '🍚', qty1: '3 chén cơm chín hoặc 3 củ khoai lang', qty2: '6 chén cơm hoặc 6 củ khoai', note: 'Nấu cơm trước khi bắt đầu để tiết kiệm thời gian' },
  { group: 'Rau', icon: '🥦', qty1: '300g bông cải + 300g cà rốt + 300g cải thìa/dưa leo', qty2: 'Nhân đôi tất cả', note: 'Luộc/hấp bông cải + cà rốt; dưa leo để sống' },
  { group: 'Sốt', icon: '🧴', qty1: 'Chanh + tỏi + tiêu + nước tương ít muối + dầu olive/mè', qty2: 'Làm 2 lọ', note: 'Làm 1 lọ chanh tỏi để 5–7 ngày trong tủ lạnh' },
  { group: 'Snack', icon: '🍱', qty1: '3 hộp sữa chua không đường + 3 trái cây', qty2: '6 hộp sữa chua + 6 trái cây', note: 'Để sẵn ngoài tủ cho buổi sáng và xế' },
];

/* ── shopping list ── */
const SHOPPING = [
  { group: 'Đạm chính', items: [{ name: 'Ức gà hoặc đùi bỏ da', qty1: '600–750g', qty2: '1.2–1.5kg' }, { name: 'Trứng gà', qty1: '6 quả', qty2: '12 quả' }], color: '#f43f5e' },
  { group: 'Tinh bột', items: [{ name: 'Gạo/khoai lang/nui', qty1: '3–6 phần', qty2: '6–12 phần' }], color: '#fb923c' },
  { group: 'Rau xanh', items: [{ name: 'Rau nấu chín (bông cải/cải thìa)', qty1: '600–900g', qty2: '1.2–1.8kg' }, { name: 'Rau sống (xà lách/dưa leo)', qty1: '300–500g', qty2: '600g–1kg' }], color: '#4ade80' },
  { group: 'Trái cây & Snack', items: [{ name: 'Trái cây (chuối/táo/cam)', qty1: '3–6 phần', qty2: '6–12 phần' }, { name: 'Sữa chua không đường', qty1: '3 hộp', qty2: '6 hộp' }, { name: 'Hạt (hạnh nhân/điều)', qty1: '50–100g', qty2: '100–200g' }], color: '#a78bfa' },
  { group: 'Sốt & Gia vị', items: [{ name: 'Chanh/tỏi/gừng/tiêu', qty1: 'Vừa đủ', qty2: 'Nhân đôi' }, { name: 'Nước tương ít muối + dầu olive/mè', qty1: '1 chai', qty2: '1 chai' }], color: '#facc15' },
  { group: 'Dụng cụ', items: [{ name: 'Hộp đựng thực phẩm (thủy tinh/nhựa BPA-free)', qty1: '6 hộp', qty2: '12 hộp' }], color: '#38bdf8' },
];

/* ── safety rules ── */
const SAFETY = [
  { icon: '❄️', rule: 'Cho thức ăn vào tủ lạnh trong vòng 2 giờ sau khi nấu.' },
  { icon: '🗓️', rule: 'Ngăn mát giữ được 3–4 ngày. Cấp đông giữ 3–4 tháng.' },
  { icon: '📦', rule: 'Dùng hộp kín, sạch, ưu tiên thủy tinh hoặc nhựa BPA-free.' },
  { icon: '🔥', rule: 'Hâm nóng kỹ 70°C+ trước khi ăn. Không hâm đi hâm lại quá 2 lần.' },
  { icon: '🏷️', rule: 'Ghi ngày nấu lên hộp. Ưu tiên ăn hộp ghi ngày cũ trước.' },
  { icon: '🚫', rule: 'Không để thức ăn chín ở nhiệt độ phòng quá 2 giờ (nguy hiểm vi khuẩn).' },
];

/* ── rescue combos ── */
const RESCUE = [
  { label: 'Combo 1', items: ['Cơm nóng', 'Trứng ốp/luộc', 'Dưa leo/cà chua', 'Sữa chua'], time: '5 phút', color: '#818cf8' },
  { label: 'Combo 2', items: ['Khoai lang hấp vi sóng 5 phút', 'Cá hộp ngâm nước', 'Rau sống', 'Trái cây'], time: '5 phút', color: '#22c55e' },
  { label: 'Combo 3', items: ['Bánh mì nguyên cám', 'Trứng chiên/luộc', 'Sữa không đường', 'Táo hoặc chuối'], time: '5 phút', color: '#f59e0b' },
  { label: 'Combo 4', items: ['Bún/phở gói', 'Gà xé mua sẵn', 'Rau sống thái sẵn', 'Sốt chanh tỏi'], time: '5 phút', color: '#f43f5e' },
];

/* ── checklist groups ── */
const CHECKLIST_GROUPS = [
  { label: 'Trước Khi Nấu', items: ['Có hộp đựng sạch, đủ số lượng', 'Có 1–2 nguồn đạm (gà/cá/trứng/đậu)', 'Có 1–2 loại tinh bột', 'Có 2–3 loại rau', 'Có trái cây + snack lành mạnh', 'Có sốt/gia vị cơ bản', 'Có chỗ trong tủ lạnh'] },
  { label: 'Trong Khi Nấu', items: ['Nấu tinh bột trước (cơm/khoai)', 'Ướp đạm nhanh (5 phút)', 'Song song: nấu đạm + luộc trứng', 'Luộc/hấp/xào rau', 'Pha sốt để lọ riêng', 'Chia đều vào các hộp'] },
  { label: 'Sau Khi Nấu', items: ['Để nguội tương đối (không đậy nắp ngay)', 'Đóng hộp kín, ghi ngày + giờ', 'Cho ngay vào tủ lạnh trong 2 giờ', 'Sốt để lọ riêng trong ngăn mát', 'Bữa sáng chuẩn bị riêng (không cần hộp)'] },
];

/* ── main ── */
export default function NutritionMealPrepPage() {
  const C = '#6366f1';

  useEffect(() => {
    if (!document.getElementById(ORBIT_ID)) {
      const s = document.createElement('style'); s.id = ORBIT_ID; s.textContent = ORBIT_CSS;
      document.head.appendChild(s);
    }
    return () => { const s = document.getElementById(ORBIT_ID); if (s) s.remove(); };
  }, []);

  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem(B0_KEY)) || {}; } catch { return {}; } });
  const nut = b0.weight ? calcB0(b0) : null;

  /* timer */
  const [activeStep, setActiveStep] = useState(null);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => setElapsedMin(p => { if (p >= 30) { setTimerOn(false); return 30; } return p + 0.1; }), 100);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);
  const currentStepIdx = TIMER_STEPS.findIndex(s => {
    const [a, b] = s.min.split('–').map(Number);
    return elapsedMin >= a && elapsedMin < b;
  });

  /* day plan */
  const [activeDay, setActiveDay] = useState(0);

  /* box formula */
  const [activeBox, setActiveBox] = useState('maintain');

  /* rotation */
  const [activeWeek, setActiveWeek] = useState(0);

  /* sauce */
  const [activeSauce, setActiveSauce] = useState(0);

  /* shopping person */
  const [shopPerson, setShopPerson] = useState(1);

  /* ingredient sample selectors */
  const [selProteins, setSelProteins] = useState([0, 2]); // default: gà + trứng
  const [selCarbs, setSelCarbs] = useState([0, 1]);       // default: gạo + khoai
  const [selVegs, setSelVegs] = useState([0, 1, 4]);      // default: bông cải + cà rốt + cải thìa
  const toggleProtein = (i) => setSelProteins(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 2 ? [...p, i] : p);
  const toggleCarb = (i) => setSelCarbs(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 2 ? [...p, i] : p);
  const toggleVeg = (i) => setSelVegs(p => p.includes(i) ? p.filter(x => x !== i) : p.length < 3 ? [...p, i] : p);

  /* checklist */
  const [checkState, setCheckState] = useState({});
  const toggleCheck = (g, i) => setCheckState(p => ({ ...p, [`${g}-${i}`]: !p[`${g}-${i}`] }));
  const totalChecks = CHECKLIST_GROUPS.reduce((s, g) => s + g.items.length, 0);
  const doneChecks = Object.values(checkState).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

        {/* breadcrumb */}
        <Link to="/pillar/b" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-indigo-400 transition-colors mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Nutrition &amp; Meal Plans
        </Link>

        {/* hero */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center bg-surface border border-indigo-500/20 shrink-0 mp-float shadow-lg shadow-indigo-500/10">⏱️</div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight mp-fade-up">Meal Prep 30 Phút</h1>
            <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: C, background: 'rgba(99,102,241,.08)', borderColor: 'rgba(99,102,241,.2)' }}>Cho 3 Ngày · Thực Tế · Người Bận Rộn</span>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">Bộ meal-prep 30 phút — 1 lần nấu, 3 ngày ăn chủ động. Không cần là đầu bếp, không cần ăn kiêng cực đoan. Chỉ cần có sẵn đồ ăn tốt trong tủ lạnh để lựa chọn tốt hơn.</p>
          </div>
        </div>

        {/* wide hero image */}
        <RevealBlock className="mb-12">
          <div className="mp-orbit-ring rounded-3xl p-[1.5px]">
            <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
              <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop" alt="Meal prep containers" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
              {/* stat badges */}
              <div className="absolute bottom-4 left-6 flex gap-3">
                {[['30', 'Phút'], ['3', 'Ngày'], ['6', 'Hộp']].map(([v, l]) => (
                  <div key={l} className="text-center px-3 py-1.5 rounded-xl border backdrop-blur-sm" style={{ borderColor: 'rgba(99,102,241,.3)', background: 'rgba(0,0,0,.6)' }}>
                    <div className="text-xl font-black" style={{ color: C }}>{v}</div>
                    <div className="text-[9px] text-muted uppercase tracking-widest">{l}</div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 right-6">
                <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: C, background: 'rgba(0,0,0,.6)', borderColor: 'rgba(99,102,241,.2)' }}>1 Lần Nấu · 3 Ngày Ăn</span>
              </div>
            </div>
          </div>
        </RevealBlock>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

        {/* B0 banner */}
        {nut && (
          <RevealBlock className="mb-10">
            <div className="rounded-2xl border p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center" style={{ borderColor: 'rgba(99,102,241,.2)', background: 'rgba(99,102,241,.04)' }}>
              <div className="flex-1">
                <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: C }}>✦ Khẩu Phần Gợi Ý Cho Bạn (B0)</div>
                <p className="text-sm text-muted">Dựa trên {b0.weight}kg · {b0.height}cm · {b0.age} tuổi → Mục tiêu <strong style={{ color: C }}>{nut.kcal} kcal/ngày</strong> · Protein <strong style={{ color: C }}>{nut.protein}g/ngày</strong></p>
              </div>
              <div className="flex gap-3 shrink-0">
                {[{ k: 'Protein/hộp', v: `${Math.round(nut.protein / 3)}g` }, { k: 'Kcal/hộp', v: `${Math.round(nut.kcal / 4)}` }, { k: 'Hộp/ngày', v: nut.goal === 'gain' ? '5' : '4' }].map(s => (
                  <div key={s.k} className="text-center px-3 py-2 rounded-xl bg-surface border border-border">
                    <div className="text-lg font-black" style={{ color: C }}>{s.v}</div>
                    <div className="text-[9px] text-muted">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealBlock>
        )}

        {/* ── SECTION 1: Why & Goals ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>1. Tại Sao Meal Prep?</h2>
          <p className="text-muted text-base mb-6">Tinh thần cốt lõi: <em>không cần ăn hoàn hảo, chỉ cần có sẵn lựa chọn tốt hơn</em>.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-sm font-bold uppercase tracking-widest text-muted mb-3">Vấn Đề Meal Prep Giải Quyết</div>
              <div className="space-y-2">
                {['Không biết ăn gì → hộp sẵn trong tủ', 'Đói quá rồi ăn đại → đã có thức ăn lành mạnh', 'Bỏ bữa sáng → overnight oats chuẩn bị sẵn', 'Ăn thiếu protein → hộp nào cũng có đạm', 'Ít rau → ½ hộp là rau', 'Gọi đồ ăn ngoài quá nhiều → tủ đã có đủ dùng', 'Ăn theo cảm xúc tối về → có hộp tốt sẵn rồi'].map((p, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="shrink-0" style={{ color: C }}>→</span>
                    <span className="text-muted">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-sm font-bold uppercase tracking-widest text-muted mb-3">Cấu Trúc 1 Hộp Chuẩn</div>
              {/* visual box */}
              <div className="rounded-2xl overflow-hidden border border-border mb-3" style={{ height: 160 }}>
                <div className="flex h-full">
                  <div className="flex-1 flex items-center justify-center" style={{ background: 'rgba(74,222,128,.15)' }}>
                    <div className="text-center">
                      <div className="text-3xl mb-1">🥦</div>
                      <div className="text-[10px] font-bold text-green-400">½ Hộp</div>
                      <div className="text-[9px] text-muted">Rau</div>
                    </div>
                  </div>
                  <div className="flex flex-col" style={{ width: '50%' }}>
                    <div className="flex-1 flex items-center justify-center border-l border-b border-border" style={{ background: 'rgba(244,63,94,.12)' }}>
                      <div className="text-center">
                        <div className="text-2xl mb-1">🍗</div>
                        <div className="text-[10px] font-bold text-rose-400">¼ Hộp</div>
                        <div className="text-[9px] text-muted">Đạm</div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-l border-border" style={{ background: 'rgba(251,146,60,.12)' }}>
                      <div className="text-center">
                        <div className="text-2xl mb-1">🍚</div>
                        <div className="text-[10px] font-bold text-orange-400">¼ Hộp</div>
                        <div className="text-[9px] text-muted">Tinh bột</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted">+ 1 phần nhỏ fat tốt (dầu olive / mè / hạt) + sốt để riêng</p>
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 2: 30-min interactive timer ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>2. Timeline 30 Phút — Nấu Song Song</h2>
          <p className="text-muted text-base mb-5">Bí quyết nấu nhanh: làm nhiều việc cùng lúc. Click "Bắt đầu" để theo dõi từng giai đoạn hoặc click vào từng bước để xem chi tiết.</p>

          {/* timer bar */}
          <div className="rounded-2xl border border-border bg-surface p-5 mb-5">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => { setTimerOn(!timerOn); }} className="px-4 py-2 rounded-xl text-sm font-bold transition-all" style={{ background: timerOn ? 'rgba(244,63,94,.15)' : `rgba(99,102,241,.15)`, color: timerOn ? '#f43f5e' : C, border: `1px solid ${timerOn ? 'rgba(244,63,94,.3)' : 'rgba(99,102,241,.3)'}` }}>
                {timerOn ? '⏸ Tạm dừng' : elapsedMin > 0 ? '▶ Tiếp tục' : '▶ Bắt đầu'}
              </button>
              <button onClick={() => { setElapsedMin(0); setTimerOn(false); }} className="px-3 py-2 rounded-xl text-sm font-bold text-muted border border-border hover:border-indigo-500/30 transition-all">↺ Reset</button>
              <div className="flex-1 text-right">
                <span className="text-3xl font-black" style={{ color: C }}>{Math.floor(elapsedMin)}</span>
                <span className="text-base text-muted">/30 phút</span>
              </div>
            </div>
            {/* progress bar */}
            <div className="h-3 rounded-full bg-bg overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all duration-100" style={{ width: `${(elapsedMin / 30) * 100}%`, background: `linear-gradient(90deg, ${C}, #a78bfa, #e879f9)` }} />
            </div>
            {/* step markers */}
            <div className="relative h-8">
              {TIMER_STEPS.map((s, i) => {
                const [a, b] = s.min.split('–').map(Number);
                const left = (a / 30) * 100;
                const active = currentStepIdx === i && timerOn;
                return (
                  <div key={i} className="absolute top-0 flex flex-col items-center" style={{ left: `${left}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-2 h-2 rounded-full mb-0.5 transition-all" style={{ background: active ? s.color : (elapsedMin >= a ? s.color : '#374151'), transform: active ? 'scale(1.5)' : 'scale(1)' }} />
                    <span className="text-[8px] text-muted whitespace-nowrap">{s.min}m</span>
                  </div>
                );
              })}
            </div>
            {/* current step callout */}
            {timerOn && currentStepIdx >= 0 && (
              <div className="mt-3 p-3 rounded-xl border mp-slide-in" style={{ borderColor: `${TIMER_STEPS[currentStepIdx].color}40`, background: `${TIMER_STEPS[currentStepIdx].color}10` }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TIMER_STEPS[currentStepIdx].icon}</span>
                  <div>
                    <div className="text-base font-bold" style={{ color: TIMER_STEPS[currentStepIdx].color }}>{TIMER_STEPS[currentStepIdx].label}</div>
                    <div className="text-[10px] text-muted">{TIMER_STEPS[currentStepIdx].tip}</div>
                  </div>
                </div>
              </div>
            )}
            {elapsedMin >= 30 && !timerOn && (
              <div className="mt-3 p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-center">
                <div className="text-xl font-black" style={{ color: C }}>🎉 Xong! 30 phút — 6 hộp đã sẵn sàng!</div>
              </div>
            )}
          </div>

          {/* step detail cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIMER_STEPS.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(activeStep === i ? null : i)}
                className="text-left p-4 rounded-2xl border transition-all hover:shadow-lg"
                style={{ borderColor: activeStep === i ? s.color : 'transparent', background: activeStep === i ? `${s.color}10` : 'rgba(255,255,255,.03)', boxShadow: activeStep === i ? `0 4px 20px ${s.color}20` : 'none' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${s.color}20` }}>{s.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: s.color }}>Phút {s.min}</div>
                    <div className="text-base font-bold text-text">{s.label}</div>
                  </div>
                  <span className="text-sm text-muted">{activeStep === i ? '▲' : '▼'}</span>
                </div>
                {activeStep === i && (
                  <div className="space-y-1.5 mt-2 pt-2 border-t" style={{ borderColor: `${s.color}20` }}>
                    {s.tasks.map((t, j) => (
                      <div key={j} className="flex gap-2 text-sm">
                        <span style={{ color: s.color }} className="shrink-0">✓</span>
                        <span className="text-muted">{t}</span>
                      </div>
                    ))}
                    <div className="mt-2 text-[10px] px-2 py-1 rounded-lg" style={{ background: `${s.color}15`, color: s.color }}>💡 {s.tip}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </RevealBlock>

        {/* ── SECTION 3: Box formulas ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>3. Công Thức Hộp Theo Mục Tiêu</h2>
          <p className="text-muted text-base mb-5">Cùng một bộ nguyên liệu nhưng chia khẩu phần khác nhau tùy mục tiêu. Không cần cân gram — dùng bàn tay làm thước.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(BOX_FORMULAS).map(([k, v]) => (
              <button key={k} onClick={() => setActiveBox(k)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-bold transition-all"
                style={{ borderColor: activeBox === k ? v.color : 'transparent', background: activeBox === k ? `${v.color}15` : 'rgba(255,255,255,.04)', color: activeBox === k ? v.color : '#9ca3af' }}>
                <span>{v.icon}</span> {v.label}
              </button>
            ))}
          </div>

          {(() => {
            const b = BOX_FORMULAS[activeBox];
            return (
              <div key={activeBox} className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${b.color}30` }}>
                <div className="px-5 py-4 border-b border-border" style={{ background: `${b.color}08` }}>
                  <div className="text-xl font-black mb-1" style={{ color: b.color }}>{b.icon} {b.label}</div>
                  <div className="text-[10px] text-muted leading-relaxed">{b.notes}</div>
                </div>
                <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[['Đạm', b.protein, '🍗'], ['Tinh bột', b.carb, '🍚'], ['Rau', b.veg, '🥦'], ['Fat tốt', b.fat, '🫒'], ['Kcal/hộp', b.kcal, '🔥']].map(([label, val, icon]) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-bg border border-border">
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-base font-black" style={{ color: b.color }}>{val}</div>
                      <div className="text-[9px] text-muted uppercase tracking-widest">{label}</div>
                    </div>
                  ))}
                </div>
                {/* hand measure guide */}
                <div className="px-5 pb-4 border-t border-border pt-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Thước Đo Bàn Tay</div>
                  <div className="flex flex-wrap gap-2">
                    {[['✊ 1 nắm tay', 'Tinh bột (cơm/khoai)'], ['🖐 1 lòng bàn tay', 'Đạm (thịt/cá/đậu)'], ['👍 1 ngón cái', 'Fat (dầu/sốt)'], ['✌️ 2 nắm tay', 'Rau (1 bữa)']].map(([m, l]) => (
                      <div key={m} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg border border-border">
                        <span>{m}</span><span className="text-muted">= {l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* ── SECTION 4: 3-day meal plan ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>4. Thực Đơn 3 Ngày Từ 1 Lần Nấu</h2>
          <p className="text-muted text-base mb-5">Cùng một bộ nguyên liệu — ăn theo 3 kiểu khác nhau để không chán. Chìa khóa: đổi cách kết hợp, không đổi nguyên liệu.</p>

          <div className="flex gap-2 mb-4">
            {DAY_PLANS.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                className="flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold transition-all"
                style={{ borderColor: activeDay === i ? C : 'transparent', background: activeDay === i ? 'rgba(99,102,241,.12)' : 'rgba(255,255,255,.04)', color: activeDay === i ? C : '#9ca3af' }}>
                <span className="block text-lg mb-0.5">{d.icon}</span> {d.label}
              </button>
            ))}
          </div>

          {(() => {
            const day = DAY_PLANS[activeDay];
            return (
              <div key={activeDay} className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-5 py-3 border-b border-border flex items-center justify-between" style={{ background: 'rgba(99,102,241,.04)' }}>
                  <div>
                    <span className="text-xl font-black" style={{ color: C }}>{day.icon} {day.theme}</span>
                    <span className="text-sm text-muted ml-2">({day.label})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted">Tổng ngày</div>
                    <div className="text-xl font-black" style={{ color: C }}>~{day.total} kcal</div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {day.meals.map((m, i) => (
                    <div key={i} className="px-5 py-3 flex gap-4">
                      <div className="shrink-0 w-24">
                        <div className="text-sm font-bold mb-0.5" style={{ color: C }}>{m.time}</div>
                        <div className="text-[10px] font-bold text-muted">{m.kcal} kcal</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-base text-text mb-0.5">{m.food}</div>
                        {m.alt && <div className="text-[10px] text-muted italic">{m.alt}</div>}
                      </div>
                      {/* mini kcal bar */}
                      <div className="shrink-0 flex items-center">
                        <div className="w-16 h-1.5 rounded-full bg-surface border border-border overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(m.kcal / day.total) * 100}%`, background: C }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-border">
                  <div className="text-[10px] text-muted">💡 Bữa sáng không cần hộp — chuẩn bị nhanh hoặc overnight oats tối hôm trước.</div>
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* ── SECTION 5: Rotation themes ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>5. Công Thức Xoay Vòng — Không Bao Giờ Ngán</h2>
          <p className="text-muted text-base mb-5">4 tuần, 4 bộ nguyên liệu khác nhau. Mỗi tuần đổi protein chính + sốt chủ đạo — cảm giác mỗi tuần ăn một kiểu mới hoàn toàn.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {ROTATION.map((r, i) => (
              <button key={i} onClick={() => setActiveWeek(i)}
                className="p-3 rounded-xl border text-left transition-all"
                style={{ borderColor: activeWeek === i ? r.color : 'transparent', background: activeWeek === i ? `${r.color}15` : 'rgba(255,255,255,.04)' }}>
                <div className="text-3xl mb-1">{r.icon}</div>
                <div className="text-[10px] font-bold" style={{ color: r.color }}>{r.week}</div>
                <div className="text-[9px] text-muted leading-relaxed mt-0.5">{r.theme.split('—')[0]}</div>
              </button>
            ))}
          </div>

          {(() => {
            const r = ROTATION[activeWeek];
            return (
              <div key={activeWeek} className="rounded-2xl border bg-surface p-5" style={{ borderColor: `${r.color}30` }}>
                <div className="text-xl font-bold mb-4" style={{ color: r.color }}>{r.icon} {r.theme}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[['🍗 Đạm', r.protein], ['🍚 Tinh bột', r.carb], ['🥦 Rau', r.veg], ['🧴 Sốt', r.sauce]].map(([label, val]) => (
                    <div key={label} className="p-3 rounded-xl bg-bg border border-border">
                      <div className="text-[10px] font-bold mb-1" style={{ color: r.color }}>{label}</div>
                      <div className="text-sm text-muted">{val}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl border border-dashed text-sm text-muted" style={{ borderColor: `${r.color}30` }}>
                  <strong style={{ color: r.color }}>Chiến lược:</strong> Dùng cùng protein nhưng đổi cách ăn: ngày 1 cơm gà, ngày 2 salad gà, ngày 3 bún gà. Đổi sốt là đổi hương vị hoàn toàn.
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* ── SECTION 6: Sauces ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>6. 3 Công Thức Sốt Chuẩn</h2>
          <p className="text-muted text-base mb-5">Sốt là linh hồn của meal prep. Làm 1 lọc, dùng cả 3 ngày. Mỗi loại sốt phù hợp nhiều protein khác nhau.</p>

          <div className="flex gap-2 mb-4">
            {SAUCES.map((s, i) => (
              <button key={i} onClick={() => setActiveSauce(i)}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl border transition-all"
                style={{ borderColor: activeSauce === i ? s.color : 'transparent', background: activeSauce === i ? `${s.color}15` : 'rgba(255,255,255,.04)', color: activeSauce === i ? s.color : '#9ca3af' }}>
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {(() => {
            const s = SAUCES[activeSauce];
            return (
              <div key={activeSauce} className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${s.color}30` }}>
                <div className="px-5 py-4 border-b border-border flex items-center justify-between" style={{ background: `${s.color}08` }}>
                  <div>
                    <div className="text-xl font-black" style={{ color: s.color }}>{s.icon} {s.name}</div>
                    <div className="text-sm text-muted mt-0.5">Hợp với: {s.pairs}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black" style={{ color: s.color }}>{s.kcal}</div>
                    <div className="text-[9px] text-muted">kcal/serving</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Nguyên liệu & Cách làm</div>
                  <div className="space-y-2">
                    {s.recipe.map((r, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: `${s.color}20`, color: s.color }}>{i + 1}</span>
                        <span className="text-muted pt-0.5">{r}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl border text-sm" style={{ borderColor: `${s.color}25`, background: `${s.color}08` }}>
                    <strong style={{ color: s.color }}>💡 Mẹo:</strong> <span className="text-muted">Làm trước 1 lọc (100–150ml), bảo quản tủ lạnh 5–7 ngày. Để riêng khỏi hộp, rưới lúc ăn để rau giòn hơn.</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* ── SECTION 7: Beginner + Office versions ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>7. Phiên Bản Theo Lối Sống</h2>
          <p className="text-muted text-base mb-5">Meal prep không có một khuôn mẫu cứng nhắc. Tùy lối sống, tùy thời điểm tập — có phiên bản phù hợp cho bạn.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Người Không Biết Nấu', icon: '👤', color: '#818cf8',
                desc: 'Không cần áp chảo phức tạp. Quy tắc: không giỏi nấu thì giỏi ghép.',
                steps: ['Mua gà luộc xé hoặc cá hộp ngâm nước', 'Luộc trứng (8 phút)', 'Cơm nấu nồi cơm điện tự động', 'Rau luộc hoặc rau sống cắt sẵn', 'Ghép vào hộp: cơm + protein + rau'],
                boxes: ['Hộp 1: cơm + gà xé + rau + trứng', 'Hộp 2: khoai + trứng + salad + sữa chua', 'Hộp 3: cơm + cá + rau + trái cây'],
              },
              {
                title: 'Người Đi Làm Văn Phòng', icon: '💼', color: '#22c55e',
                desc: 'Ăn được ở công ty. Không mùi quá nặng. Không cần hâm nhiều.',
                steps: ['Tránh món xào/áp chảo nặng mùi', 'Ưu tiên gà/cá luộc hoặc áp chảo nhẹ', 'Sốt để riêng, rưới lúc ăn', 'Snack để ngăn kéo: hạt + sữa chua + trái cây', 'Hộp thủy tinh + nắp kín không mùi'],
                boxes: ['Hộp trưa: cơm + gà + bông cải + dưa leo + sốt riêng', 'Hộp trưa 2: khoai + trứng + salad + sữa chua', 'Snack: 1 trái cây + 1 hộp sữa chua + 1 nắm hạt'],
              },
              {
                title: 'Tập Buổi Sáng', icon: '🌅', color: '#f59e0b',
                desc: 'Ăn nhẹ trước tập, nạp ngay sau tập. Bữa trưa là hộp meal-prep chính.',
                steps: ['Trước tập: 1 chuối / 1 lát bánh mì / 1 ly sữa', 'Sau tập: hộp protein + carb (quan trọng nhất)', 'Hộp sau tập: cơm/khoai + gà/cá/trứng + rau + nước', 'Bữa trưa: hộp thứ 2 hoặc phần còn lại'],
                boxes: ['Hộp sau tập: cơm + 180–220g gà + rau', 'Hộp trưa: phần còn lại + trái cây'],
              },
              {
                title: 'Tập Buổi Tối', icon: '🌙', color: '#e879f9',
                desc: 'Nạp trước tập 60–90 phút. Sau tập: không nên chỉ ăn salad nếu tập nặng.',
                steps: ['Sáng: yến mạch/sữa chua/trứng từ hộp', 'Trưa: hộp meal-prep chính', 'Trước tập 60–90 phút: chuối + sữa chua hoặc khoai + trứng', 'Sau tập: hộp đạm + carb — không cắt tinh bột'],
                boxes: ['Pre-workout: chuối + sữa chua / bánh mì + trứng', 'Post-workout: cơm + gà + rau (hộp dự phòng)'],
              },
            ].map((v, i) => (
              <RevealBlock key={i} delay={i * 50} className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-4 py-3 border-b border-border" style={{ background: `${v.color}08` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{v.icon}</span>
                    <div>
                      <div className="text-base font-bold" style={{ color: v.color }}>{v.title}</div>
                      <div className="text-[10px] text-muted">{v.desc}</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  {v.steps.map((s, j) => (
                    <div key={j} className="flex gap-2 text-sm">
                      <span style={{ color: v.color }} className="shrink-0">•</span>
                      <span className="text-muted">{s}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border space-y-1">
                    {v.boxes.map((b, j) => (
                      <div key={j} className="text-[10px] px-2 py-1 rounded-lg" style={{ background: `${v.color}10`, color: v.color }}>📦 {b}</div>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            ))}
          </div>
        </RevealBlock>

        {/* ── SECTION 8: Shopping list ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>8. Danh Sách Mua Sắm</h2>
          <p className="text-muted text-base mb-5">Danh sách đầy đủ cho 1 lần đi chợ — nấu 1 lần, ăn 3 ngày.</p>

          <div className="flex gap-2 mb-4">
            {[1, 2].map(n => (
              <button key={n} onClick={() => setShopPerson(n)}
                className="px-4 py-2 rounded-xl border text-sm font-bold transition-all"
                style={{ borderColor: shopPerson === n ? C : 'transparent', background: shopPerson === n ? 'rgba(99,102,241,.12)' : 'rgba(255,255,255,.04)', color: shopPerson === n ? C : '#9ca3af' }}>
                {n === 1 ? '👤 1 Người' : '👫 2 Người'}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {SHOPPING.map((g, gi) => (
              <div key={gi} className="border-b border-border last:border-b-0">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: g.color, background: `${g.color}08` }}>{g.group}</div>
                {g.items.map((item, ii) => (
                  <div key={ii} className="px-4 py-2.5 flex items-center justify-between border-t border-border first:border-t-0 hover:bg-indigo-500/5 transition-colors">
                    <span className="text-sm text-text">{item.name}</span>
                    <span className="text-sm font-bold px-2 py-0.5 rounded-full" style={{ background: `${g.color}15`, color: g.color }}>
                      {shopPerson === 1 ? item.qty1 : item.qty2}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            <div className="px-4 py-3 border-t border-border" style={{ background: 'rgba(99,102,241,.04)' }}>
              <div className="text-sm text-muted">
                💰 <strong style={{ color: C }}>Chi phí ước tính:</strong> 150.000–250.000 VNĐ/người/3 ngày (tùy loại protein chọn). Bình quân <strong style={{ color: C }}>~70.000–90.000 VNĐ/ngày</strong> — thấp hơn ăn ngoài 1 bữa.
              </div>
            </div>
          </div>

          {/* ── Bộ nguyên liệu mẫu cho 3 ngày ── */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 whitespace-nowrap" style={{ color: C }}>Bộ Nguyên Liệu Mẫu Cho 3 Ngày</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            </div>
            <p className="text-sm text-muted mb-5">Tự chọn nguyên liệu phù hợp khẩu vị và ngân sách. Mỗi nhóm có giới hạn chọn (gợi ý từ tài liệu dự án).</p>

            {/* Bộ nền cụ thể */}
            <div className="rounded-2xl border mb-5 overflow-hidden" style={{ borderColor: 'rgba(99,102,241,.25)' }}>
              <div className="px-4 py-3 border-b border-border flex items-center gap-2" style={{ background: 'rgba(99,102,241,.06)' }}>
                <span className="text-lg">📦</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: C }}>Công Thức Bản Nền (1 người · 3 ngày)</div>
                  <div className="text-[9px] text-muted">3 ngày ăn khỏe: Gà áp chảo + trứng luộc + rau củ + cơm/khoai</div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {BASE_PACK.map((b, i) => (
                  <div key={i} className="grid grid-cols-12 gap-0 hover:bg-indigo-500/5 transition-colors">
                    <div className="col-span-1 flex items-center justify-center py-3 border-r border-border text-xl">{b.icon}</div>
                    <div className="col-span-2 flex items-center px-3 py-3 border-r border-border">
                      <span className="text-[10px] font-bold" style={{ color: C }}>{b.group}</span>
                    </div>
                    <div className="col-span-5 flex items-center px-3 py-3 border-r border-border">
                      <span className="text-[10px] text-text font-medium">{shopPerson === 1 ? b.qty1 : b.qty2}</span>
                    </div>
                    <div className="col-span-4 flex items-center px-3 py-3">
                      <span className="text-[9px] text-muted italic">{b.note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border" style={{ background: 'rgba(99,102,241,.04)' }}>
                <div className="text-[10px] text-muted">✅ <strong style={{ color: C }}>Thành phẩm sau 30 phút:</strong> 3 phần gà · 3 trứng luộc · 3 phần cơm/khoai · 3–6 phần rau · 1 lọ sốt · 3 snack</div>
              </div>
            </div>

            {/* Interactive selectors */}
            {/* Protein selector — chọn tối đa 2 */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ background: 'rgba(244,63,94,.05)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍗</span>
                  <div>
                    <div className="text-sm font-bold text-rose-400">Chọn Nguồn Đạm</div>
                    <div className="text-[9px] text-muted">Chọn tối đa 2 loại cho cả 3 ngày</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400">{selProteins.length}/2</span>
              </div>
              <div className="p-3 grid grid-cols-1 gap-2">
                {SAMPLE_PROTEINS.map((p, i) => {
                  const sel = selProteins.includes(i);
                  return (
                    <button key={i} onClick={() => toggleProtein(i)}
                      className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                      style={{ borderColor: sel ? '#f43f5e' : 'transparent', background: sel ? 'rgba(244,63,94,.08)' : 'rgba(255,255,255,.03)' }}>
                      <span className="text-2xl shrink-0">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: sel ? '#f43f5e' : '#d1d5db' }}>{p.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: sel ? 'rgba(244,63,94,.15)' : '#1f2937', color: sel ? '#f43f5e' : '#6b7280' }}>{p.qty}</span>
                        </div>
                        <div className="text-[9px] text-muted mt-0.5">{p.note}</div>
                      </div>
                      <div className="w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all"
                        style={{ background: sel ? '#f43f5e' : 'transparent', borderColor: sel ? '#f43f5e' : '#374151' }}>
                        {sel && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" /></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selProteins.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border" style={{ background: 'rgba(244,63,94,.04)' }}>
                  <div className="text-[10px]" style={{ color: '#f43f5e' }}>
                    ✓ Đã chọn: {selProteins.map(i => SAMPLE_PROTEINS[i].name).join(' + ')}
                  </div>
                </div>
              )}
            </div>

            {/* Carb selector — chọn tối đa 2 */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ background: 'rgba(251,146,60,.05)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍚</span>
                  <div>
                    <div className="text-sm font-bold text-orange-400">Chọn Tinh Bột</div>
                    <div className="text-[9px] text-muted">Chọn 1–2 loại, đổi vị mỗi ngày</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">{selCarbs.length}/2</span>
              </div>
              <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                {SAMPLE_CARBS.map((c, i) => {
                  const sel = selCarbs.includes(i);
                  return (
                    <button key={i} onClick={() => toggleCarb(i)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center"
                      style={{ borderColor: sel ? '#fb923c' : 'transparent', background: sel ? 'rgba(251,146,60,.1)' : 'rgba(255,255,255,.03)' }}>
                      <span className="text-3xl">{c.icon}</span>
                      <span className="text-[10px] font-semibold" style={{ color: sel ? '#fb923c' : '#d1d5db' }}>{c.name}</span>
                      <span className="text-[8px] text-muted">{c.note}</span>
                    </button>
                  );
                })}
              </div>
              {selCarbs.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border" style={{ background: 'rgba(251,146,60,.04)' }}>
                  <div className="text-[10px] text-orange-400">✓ Đã chọn: {selCarbs.map(i => SAMPLE_CARBS[i].name).join(' + ')}</div>
                </div>
              )}
            </div>

            {/* Veg selector — chọn tối đa 3 */}
            <div className="rounded-2xl border border-border bg-surface overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between" style={{ background: 'rgba(74,222,128,.05)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🥦</span>
                  <div>
                    <div className="text-sm font-bold text-green-400">Chọn Rau Củ</div>
                    <div className="text-[9px] text-muted">Chọn 3 loại để không ngán — đổi tuần sau</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">{selVegs.length}/3</span>
              </div>
              <div className="p-3 grid grid-cols-2 md:grid-cols-5 gap-2">
                {SAMPLE_VEGS.map((v, i) => {
                  const sel = selVegs.includes(i);
                  return (
                    <button key={i} onClick={() => toggleVeg(i)}
                      className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-center"
                      style={{ borderColor: sel ? '#4ade80' : 'transparent', background: sel ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.03)' }}>
                      <span className="text-3xl">{v.icon}</span>
                      <span className="text-[9px] font-semibold" style={{ color: sel ? '#4ade80' : '#d1d5db' }}>{v.name}</span>
                      <span className="text-[8px] text-muted">{v.method}</span>
                      <span className="text-[8px] px-1 py-0.5 rounded" style={{ background: v.cookTime === 'Không cần' ? 'rgba(74,222,128,.15)' : 'rgba(255,255,255,.05)', color: v.cookTime === 'Không cần' ? '#4ade80' : '#6b7280' }}>{v.cookTime}</span>
                    </button>
                  );
                })}
              </div>
              {selVegs.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border" style={{ background: 'rgba(74,222,128,.04)' }}>
                  <div className="text-[10px] text-green-400">✓ Đã chọn: {selVegs.map(i => SAMPLE_VEGS[i].name).join(' · ')}</div>
                </div>
              )}
            </div>

            {/* Fat & Snack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-4 py-3 border-b border-border" style={{ background: 'rgba(250,204,21,.05)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🫒</span>
                    <div className="text-sm font-bold text-yellow-400">Chất Béo Tốt & Sốt Nền</div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {SAMPLE_FATS.map((f, i) => (
                    <div key={i} className="flex gap-2.5 p-2 rounded-lg hover:bg-yellow-500/5 transition-colors">
                      <span className="text-yellow-400 shrink-0 text-base">•</span>
                      <div>
                        <div className="text-[10px] font-semibold text-text">{f.name}</div>
                        <div className="text-[9px] text-muted">{f.use}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                <div className="px-4 py-3 border-b border-border" style={{ background: 'rgba(167,139,250,.05)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍎</span>
                    <div className="text-sm font-bold text-violet-400">Snack Lành Mạnh</div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {SAMPLE_SNACKS.map((s, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-violet-500/5 transition-colors">
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div className="flex-1">
                        <div className="text-[10px] font-semibold text-text">{s.name}</div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(167,139,250,.15)', color: '#a78bfa' }}>{s.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selection summary */}
            {(selProteins.length > 0 || selVegs.length >= 3) && (
              <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'rgba(99,102,241,.3)', background: 'rgba(99,102,241,.04)' }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: C }}>📋 Tổng Hợp Lựa Chọn Của Bạn ({shopPerson === 1 ? '1 người' : '2 người'} · 3 ngày)</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: '🍗 Đạm', val: selProteins.length ? selProteins.map(i => SAMPLE_PROTEINS[i].name).join(' + ') : '— chưa chọn', color: '#f43f5e' },
                    { label: '🍚 Tinh bột', val: selCarbs.length ? selCarbs.map(i => SAMPLE_CARBS[i].name).join(' + ') : '— chưa chọn', color: '#fb923c' },
                    { label: '🥦 Rau', val: selVegs.length ? selVegs.map(i => SAMPLE_VEGS[i].name).join(' · ') : '— chưa chọn', color: '#4ade80' },
                    { label: '⏱️ Thời gian ước tính', val: selVegs.some(i => SAMPLE_VEGS[i].cookTime === 'Không cần') ? '25–28 phút' : '28–32 phút', color: C },
                  ].map(s => (
                    <div key={s.label} className="p-2.5 rounded-xl bg-surface border border-border">
                      <div className="text-[9px] font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
                      <div className="text-[9px] text-muted leading-relaxed">{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </RevealBlock>

        {/* ── SECTION 9: Food safety ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>9. An Toàn Thực Phẩm — Bắt Buộc</h2>
          <p className="text-muted text-base mb-5">Meal prep là nấu trước nhiều bữa — an toàn thực phẩm là không thể bỏ qua. Theo chuẩn USDA Food Safety.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAFETY.map((s, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl border border-border bg-surface hover:border-indigo-500/30 transition-colors">
                <span className="text-3xl shrink-0">{s.icon}</span>
                <p className="text-sm text-muted leading-relaxed">{s.rule}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl border border-dashed text-sm text-center text-muted" style={{ borderColor: 'rgba(99,102,241,.3)' }}>
            <strong style={{ color: C }}>USDA khuyến nghị:</strong> Thức ăn thừa giữ ngăn mát 3–4 ngày hoặc cấp đông 3–4 tháng. Thực phẩm dễ hỏng vào tủ lạnh trong vòng 2 giờ.
          </div>
        </RevealBlock>

        {/* ── SECTION 10: Rescue combos ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>10. Combo Cứu Nguy 5 Phút</h2>
          <p className="text-muted text-base mb-5">Khi không có 30 phút — dùng nguyên liệu sẵn có, ghép nhanh. <em>Bữa ăn 70% tốt vẫn hơn bỏ cuộc 100%</em>.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {RESCUE.map((r, i) => (
              <div key={i} className="rounded-2xl border bg-surface overflow-hidden" style={{ borderColor: `${r.color}25` }}>
                <div className="px-3 py-2 border-b border-border" style={{ background: `${r.color}10` }}>
                  <div className="text-sm font-bold" style={{ color: r.color }}>{r.label}</div>
                  <div className="text-[9px] text-muted">{r.time}</div>
                </div>
                <div className="p-3 space-y-1">
                  {r.items.map((item, j) => (
                    <div key={j} className="flex gap-1.5 text-[10px]">
                      <span style={{ color: r.color }} className="shrink-0">•</span>
                      <span className="text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── SECTION 11: Checklist ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ color: C }}>11. Checklist Meal Prep 30 Phút</h2>
          <p className="text-muted text-base mb-5">Tick vào từng mục để không bỏ sót bước nào. Lưu checklist, lần sau mở lại dùng tiếp.</p>

          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {/* progress */}
            <div className="px-5 py-4 border-b border-border" style={{ background: 'rgba(99,102,241,.04)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: C }}>Tiến độ: {doneChecks}/{totalChecks}</span>
                <span className="text-sm text-muted">{Math.round((doneChecks / totalChecks) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-bg overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(doneChecks / totalChecks) * 100}%`, background: `linear-gradient(90deg, ${C}, #a78bfa)` }} />
              </div>
              {doneChecks === totalChecks && (
                <div className="mt-2 text-center text-sm font-bold" style={{ color: C }}>🎉 Meal prep hoàn tất! Tủ lạnh đã sẵn sàng cho 3 ngày!</div>
              )}
            </div>

            {CHECKLIST_GROUPS.map((g, gi) => (
              <div key={gi} className="border-b border-border last:border-b-0">
                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted" style={{ background: 'rgba(255,255,255,.02)' }}>{g.label}</div>
                {g.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const done = checkState[key];
                  return (
                    <button key={ii} onClick={() => toggleCheck(gi, ii)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 border-t border-border first:border-t-0 text-left hover:bg-indigo-500/5 transition-all">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all"
                        style={{ background: done ? C : 'transparent', borderColor: done ? C : '#374151' }}>
                        {done && <svg width="10" height="10" viewBox="0 0 10 10" className="mp-check-pop"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                      </div>
                      <span className="text-sm" style={{ color: done ? '#6b7280' : '#d1d5db', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── core message ── */}
        <RevealBlock className="mb-12">
          <div className="rounded-2xl border p-6 text-center" style={{ borderColor: 'rgba(99,102,241,.3)', background: 'rgba(99,102,241,.04)' }}>
            <div className="text-sm font-bold uppercase tracking-widest text-muted mb-3">Thông Điệp Dự Án</div>
            <div className="text-3xl md:text-4xl font-black leading-relaxed" style={{ color: C }}>
              "Bạn không cần ăn kiêng cực đoan.<br />
              <span className="text-text">Bạn chỉ cần có sẵn</span> <span style={{ color: C }}>lựa chọn tốt hơn</span><br />
              <span className="text-text">trong tủ lạnh."</span>
            </div>
            <div className="mt-4 text-sm text-muted">1 lần meal prep 30 phút = 3 ngày ăn chủ động = hàng chục quyết định tốt hơn.</div>
          </div>
        </RevealBlock>

        {/* related */}
        <RevealBlock className="mb-8">
          <div className="text-sm font-bold uppercase tracking-widest text-muted mb-4">Khám Phá Thêm</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { to: '/pillar/b/template', icon: '📋', label: 'Template Meal Plan', color: '#f43f5e' },
              { to: '/pillar/b/checklist', icon: '✅', label: 'Checklist Hằng Ngày', color: '#10b981' },
              { to: '/pillar/b/7day', icon: '📅', label: 'Thực Đơn 7 Ngày', color: '#f97316' },
              { to: '/pillar/b/goal-plan', icon: '🎯', label: 'Goal-based Plan', color: '#a855f7' },
              { to: '/pillar/b/12week', icon: '🗓️', label: '12 Tuần Roadmap', color: '#14b8a6' },
              { to: '/pillar/b/formula', icon: '🔢', label: 'Công Thức Tính', color: '#06b6d4' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-surface hover:border-indigo-500/30 transition-all hover:-translate-y-0.5 text-sm font-semibold">
                <span className="text-xl">{l.icon}</span>
                <span style={{ color: l.color }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </RevealBlock>

        <div className="text-center">
          <Link to="/pillar/b" className="inline-flex items-center gap-2 text-sm text-muted hover:text-indigo-400 transition-colors">
            ← Quay lại Nutrition &amp; Meal Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
