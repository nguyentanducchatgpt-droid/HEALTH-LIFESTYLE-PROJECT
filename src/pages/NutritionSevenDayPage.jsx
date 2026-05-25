import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Orbit-ring CSS ─── */
function useOrbitRing() {
  useEffect(() => {
    if (document.getElementById('s7d-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 's7d-orbit-kf';
    s.textContent = `
      @property --s7d-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes s7dSpin { to { --s7d-angle: 360deg; } }
      .s7d-orbit-ring {
        background: conic-gradient(
          from var(--s7d-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(132,204,22,0.75) 99deg,
          rgba(132,204,22,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: s7dSpin 3.5s linear infinite;
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
function computeStats(inp) {
  const w = Number(inp.w) || 65;
  const h = Number(inp.h) || 170;
  const a = Number(inp.a) || 1.55;
  const bmr = (inp.sx || 'male') === 'female'
    ? 10 * w + 6.25 * h - 5 * 30 - 161
    : 10 * w + 6.25 * h - 5 * 30 + 5;
  const tdee = bmr * a;
  const goal = inp.goal || 'healthy';
  const targetKcal = goal === 'loss' ? tdee * 0.82 : goal === 'gain' ? tdee * 1.08 : tdee * 0.97;
  const proteinG = w * (goal === 'loss' || goal === 'gain' ? 2.0 : 1.4);
  const fatG = (targetKcal * 0.28) / 9;
  const carbG = (targetKcal - proteinG * 4 - fatG * 9) / 4;
  const waterMl = w * 35;
  return {
    w, h, a,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal),
    proteinG: Math.round(proteinG),
    fatG: Math.round(fatG),
    carbG: Math.round(carbG),
    waterMl: Math.round(waterMl),
    goal,
  };
}

/* ─── Data ─── */
const DAYS = [
  {
    n: 1,
    theme: 'Bắt Đầu Nhẹ, Ăn Đủ Đạm',
    emoji: '🌱',
    color: '#22c55e', rgb: '34,197,94',
    tag: 'Ngày khởi động',
    note: 'Ưu tiên "ăn đủ bữa" trước. Người mới không cần cắt cơm. Chỉ cần giảm đồ uống ngọt và thêm rau vào bữa chính.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: '2 trứng luộc/ốp la ít dầu + 1 lát bánh mì nguyên cám hoặc ½ chén cơm + dưa leo/cà chua', kcal: 320, protein: 18, carb: 28, fat: 10 },
      { time: 'Phụ sáng', icon: '🍌', food: '1 quả chuối hoặc 1 quả táo', kcal: 80, protein: 1, carb: 20, fat: 0 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm vừa phần + ức gà/cá kho/thịt nạc + 1 tô canh rau + rau luộc', kcal: 480, protein: 32, carb: 52, fat: 10 },
      { time: 'Phụ chiều', icon: '🥛', food: 'Sữa chua không đường + ít hạt hoặc trái cây', kcal: 150, protein: 8, carb: 15, fat: 5 },
      { time: 'Tối', icon: '🌙', food: 'Đậu hũ sốt cà chua hoặc cá hấp + rau xào ít dầu + ½–1 chén cơm', kcal: 380, protein: 22, carb: 40, fat: 8 },
    ],
    tips: ['Đây là ngày dễ nhất để bắt đầu', 'Đừng lo ngại cơm — tinh bột cần thiết cho não', 'Mục tiêu: 3 bữa đúng giờ, có rau, có đạm'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 2,
    theme: 'Bữa Sáng No Lâu',
    emoji: '⚡',
    color: '#84cc16', rgb: '132,204,22',
    tag: 'Sáng chắc bụng',
    note: 'Ngày này phù hợp người bận. Nếu ăn ngoài, chọn món có đủ 3 phần: đạm + rau + tinh bột. Không gọi thêm nước ngọt.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Yến mạch nấu sữa không đường + chuối + 1 thìa nhỏ bơ đậu phộng hoặc hạt', kcal: 370, protein: 14, carb: 55, fat: 9 },
      { time: 'Phụ sáng', icon: '🥛', food: '1 ly sữa không đường hoặc sữa đậu nành không đường', kcal: 90, protein: 7, carb: 8, fat: 3 },
      { time: 'Trưa', icon: '☀️', food: 'Bún/phở/miến gà, thêm rau, thêm thịt, hạn chế nước béo', kcal: 450, protein: 28, carb: 55, fat: 8 },
      { time: 'Phụ chiều', icon: '🍊', food: '1 quả cam/ổi/táo', kcal: 70, protein: 1, carb: 17, fat: 0 },
      { time: 'Tối', icon: '🌙', food: 'Thịt nạc heo/gà áp chảo + salad lớn + khoai lang hoặc cơm ít', kcal: 400, protein: 30, carb: 38, fat: 10 },
    ],
    tips: ['Yến mạch no lâu 3–4 giờ nhờ beta-glucan', 'Sữa đậu nành buổi sáng = đạm + năng lượng không đường', 'Phở có thể khỏe nếu thêm thịt và rau'],
    image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 3,
    theme: 'Ăn Ngoài Vẫn Khỏe',
    emoji: '🏙️',
    color: '#06b6d4', rgb: '6,182,212',
    tag: 'Linh hoạt ngày bận',
    note: 'Quy tắc ăn ngoài: đừng tìm món hoàn hảo, hãy nâng cấp món đang có. Thêm rau, bớt nước sốt, bớt đồ chiên, không uống nước ngọt.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Bánh mì trứng + thêm rau/dưa leo, hạn chế pate/mayo nếu đang giảm mỡ', kcal: 310, protein: 16, carb: 35, fat: 9 },
      { time: 'Phụ sáng', icon: '☕', food: 'Cà phê không đường hoặc ít đường + 1 trái cây', kcal: 80, protein: 1, carb: 18, fat: 0 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm văn phòng: chọn 1 món đạm nạc + 2 món rau + cơm vừa phần', kcal: 490, protein: 30, carb: 55, fat: 10 },
      { time: 'Phụ chiều', icon: '🥛', food: 'Sữa chua Hy Lạp/sữa chua không đường hoặc 1 ly sữa đậu nành', kcal: 120, protein: 10, carb: 12, fat: 3 },
      { time: 'Tối', icon: '🌙', food: 'Canh rau + cá/thịt nạc/đậu hũ + cơm vừa hoặc khoai', kcal: 390, protein: 26, carb: 42, fat: 8 },
    ],
    tips: ['Cơm văn phòng: gọi thêm đậu hũ/trứng nếu thiếu đạm', 'Tránh combo: chiên + cơm nhiều + nước ngọt', 'Mang theo bình nước để không mua đồ uống ngọt'],
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 4,
    theme: 'Ngày Nhiều Rau, Nhẹ Bụng',
    emoji: '🥗',
    color: '#10b981', rgb: '16,185,129',
    tag: 'Tăng chất xơ',
    note: 'Ngày này giúp tăng chất xơ. Nếu dễ đói buổi tối, tăng thêm đạm trước, không tăng bánh kẹo.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Sữa chua không đường + yến mạch + trái cây + hạt', kcal: 300, protein: 12, carb: 45, fat: 7 },
      { time: 'Phụ sáng', icon: '🥚', food: '1 quả trứng luộc hoặc 1 ly sữa', kcal: 80, protein: 7, carb: 2, fat: 5 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm + cá kho/cá hấp + canh chua/canh rau + rau luộc', kcal: 460, protein: 28, carb: 52, fat: 8 },
      { time: 'Phụ chiều', icon: '🍈', food: 'Ổi/táo/thanh long', kcal: 70, protein: 1, carb: 16, fat: 0 },
      { time: 'Tối', icon: '🌙', food: 'Salad lớn: rau xanh + trứng/gà/đậu hũ + khoai lang hoặc bắp', kcal: 380, protein: 22, carb: 40, fat: 9 },
    ],
    tips: ['WHO khuyến nghị ≥400g rau/ngày', 'Canh chua cá là nguồn protein + rau + vi chất hoàn hảo', 'Salad tối nhẹ bụng giúp ngủ ngon hơn'],
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 5,
    theme: 'Ngày Tập Luyện Nhiều Hơn',
    emoji: '💪',
    color: '#f97316', rgb: '249,115,22',
    tag: 'Tập + nạp đúng',
    note: 'Nếu có tập sức mạnh/cardio, không nên nhịn tinh bột hoàn toàn. Tinh bột đúng lúc giúp có năng lượng tập và giảm cảm giác thèm ăn sau đó.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Cơm nhỏ hoặc bánh mì nguyên cám + trứng + rau', kcal: 330, protein: 18, carb: 38, fat: 8 },
      { time: 'Trước tập', icon: '⚡', food: '1 chuối hoặc 1 củ khoai nhỏ (30–45 phút trước)', kcal: 90, protein: 1, carb: 22, fat: 0 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm + gà/cá/thịt nạc + rau xào ít dầu + canh', kcal: 500, protein: 34, carb: 55, fat: 10 },
      { time: 'Phụ chiều', icon: '🥛', food: 'Sữa chua + trái cây hoặc sữa tươi không đường', kcal: 160, protein: 9, carb: 22, fat: 4 },
      { time: 'Tối (sau tập)', icon: '🌙', food: 'Tôm/cá/gà + rau nhiều + cơm/khoai vừa phần', kcal: 440, protein: 35, carb: 42, fat: 8 },
    ],
    tips: ['Không tập bụng đói hoàn toàn — ít nhất ăn nhẹ 30–45 phút trước', 'Sau tập 45–60 phút: ăn bữa có đạm ngay', 'Carb pre-workout: chuối, khoai, bánh mì — không cần phức tạp'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 6,
    theme: 'Meal Prep Cuối Tuần',
    emoji: '📦',
    color: '#a855f7', rgb: '168,85,247',
    tag: 'Chuẩn bị sẵn',
    note: 'Chuẩn bị trước cho 2–3 ngày: luộc trứng, rửa rau, nướng/áp chảo gà/cá, hấp khoai, nấu sẵn gạo lứt/cơm trắng vừa phần.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Bún/phở gà/bò nạc, thêm rau, không cần uống hết nước béo', kcal: 400, protein: 25, carb: 52, fat: 8 },
      { time: 'Phụ sáng', icon: '🍑', food: 'Trái cây (chuối, ổi, cam...)', kcal: 75, protein: 1, carb: 18, fat: 0 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm nhà: thịt/cá/đậu hũ + 2 loại rau + canh', kcal: 480, protein: 30, carb: 52, fat: 10 },
      { time: 'Phụ chiều', icon: '🥜', food: 'Hạt + sữa chua hoặc sữa không đường', kcal: 170, protein: 8, carb: 16, fat: 8 },
      { time: 'Tối', icon: '🌙', food: 'Lẩu rau/nấm/đậu hũ/thịt nạc/cá, hạn chế viên thả lẩu chế biến sẵn', kcal: 420, protein: 28, carb: 40, fat: 10 },
    ],
    tips: ['60–90 phút meal prep = 4–5 ngày ăn uống khỏe mạnh', 'Luộc 6–8 trứng, áp chảo 3–4 phần gà/cá, hấp 4–6 khoai lang', 'Lẩu cuối tuần = dinh dưỡng + xã hội — chọn nước lẩu trong'],
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=70&auto=format&fit=crop',
  },
  {
    n: 7,
    theme: 'Recovery, Ăn Dễ Tiêu',
    emoji: '😌',
    color: '#8b5cf6', rgb: '139,92,246',
    tag: 'Hồi phục & chuẩn bị',
    note: 'Đây là ngày "dễ tiêu – hồi phục – chuẩn bị tuần mới". Không cần ăn quá ít. Mục tiêu là ngủ tốt, bụng nhẹ, năng lượng ổn.',
    meals: [
      { time: 'Sáng', icon: '🌅', food: 'Cháo yến mạch/cháo thịt bằm/cháo cá + rau thơm', kcal: 290, protein: 14, carb: 42, fat: 6 },
      { time: 'Phụ sáng', icon: '🍊', food: '1 trái cây (cam, táo, ổi)', kcal: 70, protein: 1, carb: 16, fat: 0 },
      { time: 'Trưa', icon: '☀️', food: 'Cơm + cá/đậu hũ + canh rau + rau luộc', kcal: 430, protein: 26, carb: 50, fat: 8 },
      { time: 'Phụ chiều', icon: '🥛', food: 'Sữa chua không đường hoặc sữa đậu nành', kcal: 100, protein: 7, carb: 10, fat: 2 },
      { time: 'Tối', icon: '🌙', food: 'Trứng/đậu hũ/cá + nhiều rau + ít cơm hoặc khoai', kcal: 350, protein: 22, carb: 35, fat: 8 },
    ],
    tips: ['Cháo buổi sáng = nhẹ bụng + ấm người + dễ tiêu', 'Ngày recovery: ưu tiên rau canh, đạm dễ tiêu (cá, đậu hũ)', 'Ngủ sớm hơn 30 phút để reset hoàn toàn cho tuần mới'],
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70&auto=format&fit=crop',
  },
];

const SHOPPING_LIST = {
  protein: {
    label: 'Nhóm Đạm', color: '#84cc16', emoji: '🥩',
    items: ['Trứng: 10–14 quả', 'Ức gà hoặc đùi gà bỏ da: 500–700g', 'Cá (basa, thu, hồi, nục, rô phi): 400–600g', 'Thịt nạc heo/bò: 300–400g', 'Tôm: 200–300g', 'Đậu hũ: 400–600g', 'Sữa chua không đường: 5–7 hộp', 'Sữa tươi/sữa đậu nành không đường: 1L'],
  },
  carb: {
    label: 'Tinh Bột', color: '#f97316', emoji: '🌾',
    items: ['Gạo/cơm: 1–2kg', 'Khoai lang: 4–6 củ', 'Yến mạch: 500g', 'Bánh mì nguyên cám: 1 ổ', 'Bún/phở/miến: dùng linh hoạt', 'Bắp hoặc quinoa nếu có'],
  },
  veg: {
    label: 'Rau Củ', color: '#22c55e', emoji: '🥦',
    items: ['Rau cải, cải thìa, rau muống, bông cải: 1–2kg', 'Dưa leo, cà chua, xà lách: 500g', 'Bí đỏ, cà rốt, nấm: 400g', 'Rau thơm, hành, giá: 200g'],
  },
  fruit: {
    label: 'Trái Cây', color: '#eab308', emoji: '🍎',
    items: ['Chuối: 7–10 quả', 'Táo: 4–5 quả', 'Cam/quýt: 4–5 quả', 'Ổi: 3–4 quả', 'Thanh long/đu đủ: 1–2 quả'],
  },
  fat: {
    label: 'Chất Béo Tốt', color: '#06b6d4', emoji: '🥑',
    items: ['Hạt điều/hạnh nhân/đậu phộng: 150–200g', 'Dầu olive hoặc dầu ăn lượng nhỏ', 'Bơ đậu phộng ít đường: 1 hũ nhỏ', 'Mè/vừng: 50g'],
  },
};

const MEAL_PREP_STEPS = [
  { n: 1, icon: '🥚', title: 'Luộc trứng', time: '12 phút', desc: 'Luộc 6–8 quả trứng, để nguội, bảo quản vỏ nguyên trong tủ lạnh 5–7 ngày', color: '#84cc16' },
  { n: 2, icon: '🍠', title: 'Hấp khoai lang', time: '20 phút', desc: '4–6 củ nhỏ, hấp chín, bảo quản 4–5 ngày trong hộp kín', color: '#f97316' },
  { n: 3, icon: '🍗', title: 'Nướng/áp chảo gà-cá', time: '25 phút', desc: '3–4 phần gà/cá, ướp muối tiêu tỏi, nướng 180°C 20 phút hoặc áp chảo', color: '#22c55e' },
  { n: 4, icon: '🥗', title: 'Rửa sẵn rau', time: '10 phút', desc: 'Rửa sạch, để ráo, bọc giấy ẩm trong hộp — dùng được 3–4 ngày', color: '#10b981' },
  { n: 5, icon: '🍚', title: 'Nấu cơm/gạo lứt', time: '30 phút', desc: '2–3 phần cơm, chia hộp nhỏ, bảo quản tủ lạnh 3–4 ngày', color: '#8b5cf6' },
  { n: 6, icon: '🫙', title: 'Chuẩn bị snack', time: '5 phút', desc: '3 hộp snack: trái cây + sữa chua/hạt — sẵn sàng lấy đi', color: '#06b6d4' },
];

const CHECKLIST = [
  { icon: '🥩', text: 'Có ít nhất 2 bữa chính đủ đạm (20g+/bữa)', color: '#84cc16' },
  { icon: '🥦', text: 'Có rau trong ít nhất 2 bữa', color: '#22c55e' },
  { icon: '🍊', text: 'Có 1–2 phần trái cây', color: '#f97316' },
  { icon: '💧', text: 'Uống nước thay phần lớn đồ ngọt', color: '#06b6d4' },
  { icon: '🚫', text: 'Không bỏ bữa rồi ăn bù quá nhiều', color: '#ef4444' },
];

const OFF_PLAN = [
  {
    title: 'Lỡ ăn nhiều vào buổi trưa',
    icon: '🍱',
    color: '#f97316',
    rules: ['Không nhịn tối', 'Bữa tối: đạm vừa đủ (cá/gà/trứng/đậu hũ) + rau nhiều + giảm tinh bột còn ½ phần', 'Uống nước, đi bộ nhẹ 10–15 phút nếu phù hợp'],
  },
  {
    title: 'Lỡ uống trà sữa / nước ngọt',
    icon: '🧋',
    color: '#8b5cf6',
    rules: ['Không cần "phạt" bằng nhịn ăn', 'Không uống thêm đồ ngọt trong ngày', 'Bữa kế tiếp ăn theo đĩa chuẩn', 'Ngủ đúng giờ'],
  },
  {
    title: 'Đi tiệc / ăn hàng',
    icon: '🎉',
    color: '#22c55e',
    rules: ['Ăn đạm trước', 'Gắp rau/canh', 'Chọn 1 món tinh bột yêu thích', 'Đồ chiên/ngọt: ăn ít, không ăn theo cảm xúc', 'Không tự trách — hôm sau quay lại plan'],
  },
];

/* ─── Animated progress bar ─── */
function MacroBar({ label, value, max, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      setWidth(Math.min(100, max > 0 ? Math.round((value / max) * 100) : 0));
    }, 120);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1" style={{ color: '#9ca3af' }}>
        <span>{label}</span>
        <span style={{ color }}>{value}g / {max}g</span>
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

/* ─── Weekly bar chart (SVG) ─── */
function WeeklyChart({ targetKcal }) {
  const maxKcal = Math.max(...DAYS.map(d => d.meals.reduce((s, m) => s + m.kcal, 0)), targetKcal + 200);
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 560 200`} className="w-full" style={{ minWidth: 320 }}>
        {/* Reference line */}
        {targetKcal > 0 && (
          <>
            <line
              x1="8" y1={190 - (targetKcal / maxKcal) * 170}
              x2="552" y2={190 - (targetKcal / maxKcal) * 170}
              stroke="#84cc16" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"
            />
            <text x="556" y={190 - (targetKcal / maxKcal) * 170 - 4} fill="#84cc16" fontSize="9" textAnchor="end" opacity="0.8">
              {targetKcal} kcal
            </text>
          </>
        )}
        {DAYS.map((d, i) => {
          const total = d.meals.reduce((s, m) => s + m.kcal, 0);
          const barH = (total / maxKcal) * 170;
          const x = 8 + i * 78;
          const y = 190 - barH;
          return (
            <g key={d.n}>
              <rect x={x} y={y} width={52} height={barH} rx="6" fill={d.color} opacity="0.85" />
              <text x={x + 26} y={y - 5} fill={d.color} fontSize="10" textAnchor="middle">{total}</text>
              <text x={x + 26} y={198} fill="#6b7280" fontSize="11" textAnchor="middle">N{d.n}</text>
              <text x={x + 26} y={208} fill="#6b7280" fontSize="14" textAnchor="middle">{d.emoji}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Main Page ─── */
export default function NutritionSevenDayPage() {
  useOrbitRing();

  const [b0Raw, setB0Raw] = useState({ w: 65, h: 170, a: 1.55, sx: 'male', goal: 'healthy' });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('healthapp_b0_inputs');
      if (raw) setB0Raw(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, []);
  const stats = computeStats(b0Raw);

  const [activeDay, setActiveDay] = useState(0);
  const day = DAYS[activeDay];
  const dayTotal = {
    kcal: day.meals.reduce((s, m) => s + m.kcal, 0),
    protein: day.meals.reduce((s, m) => s + m.protein, 0),
    carb: day.meals.reduce((s, m) => s + m.carb, 0),
    fat: day.meals.reduce((s, m) => s + m.fat, 0),
  };

  // Shopping checkboxes: key = `cat-idx`
  const [shopChecked, setShopChecked] = useState({});
  const toggleShop = (key) => setShopChecked(prev => ({ ...prev, [key]: !prev[key] }));

  const copyShoppingList = () => {
    const lines = ['DANH SÁCH MUA SẮM 7 NGÀY\n'];
    Object.values(SHOPPING_LIST).forEach(cat => {
      lines.push(`\n${cat.emoji} ${cat.label}`);
      cat.items.forEach(item => lines.push(`  - ${item}`));
    });
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  // Daily checklist
  const [checkDone, setCheckDone] = useState({});
  const toggleCheck = (i) => setCheckDone(prev => ({ ...prev, [i]: !prev[i] }));
  const checkedCount = CHECKLIST.filter((_, i) => checkDone[i]).length;

  // Accordion off-plan
  const [openAccordion, setOpenAccordion] = useState(null);
  const toggleAccordion = (i) => setOpenAccordion(prev => prev === i ? null : i);

  const goalLabel = stats.goal === 'loss' ? 'giảm mỡ' : stats.goal === 'gain' ? 'tăng cơ' : 'duy trì';

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

        {/* ── Hero ── */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div
            className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(132,204,22,0.05)' }}
          />
          <div
            className="w-20 h-20 rounded-3xl text-5xl shrink-0 flex items-center justify-center border animate-float"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(132,204,22,0.2)' }}
          >
            🗓️
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up" style={{ color: '#f5f5f5' }}>
              Meal Plan 7 Ngày — Bản Nền Cho Người Mới Sống Khỏe
            </h1>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(132,204,22,0.10)', borderColor: 'rgba(132,204,22,0.20)' }}
            >
              Mẫu thực đơn · 7 ngày · Bắt đầu dễ dàng
            </span>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#9ca3af' }}>
              Bảy ngày thực đơn linh hoạt, thực tế — thiết kế để bắt đầu ngay hôm nay mà không cần đếm calo phức tạp. Mỗi ngày có chủ đề, bữa ăn mẫu, tips và gợi ý mua sắm tuần.
            </p>
          </div>
        </div>

        {/* ── Hero image with orbit ring ── */}
        <div className="s7d-orbit-ring rounded-3xl p-[1.5px] mb-8">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80&auto=format&fit=crop"
              alt="Meal plan 7 ngày"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }} />
            <div
              className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(10,10,10,0.6)', borderColor: 'rgba(132,204,22,0.2)' }}
            >
              7 Ngày Thực Đơn
            </div>
          </div>
        </div>

        {/* ── 4 stat badges ── */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: '7 Ngày', sub: 'thực đơn mẫu' },
            { label: '35 Bữa', sub: 'bữa ăn cụ thể' },
            { label: '5 Nhóm TP', sub: 'dinh dưỡng' },
            { label: '1 Mục Tiêu', sub: 'sống khỏe' },
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

        {/* ── Section 2: Personalized Banner ── */}
        <RevealBlock className="mb-12">
          <div
            className="rounded-2xl border p-6"
            style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.18)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">📊</span>
              <h2 className="text-lg font-bold" style={{ color: '#84cc16' }}>Dữ Liệu Của Bạn</h2>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#9ca3af' }}>
              Dựa trên dữ liệu của bạn ({stats.w}kg · {stats.h}cm · {goalLabel}), mỗi ngày bạn cần khoảng{' '}
              <span className="font-bold" style={{ color: '#84cc16' }}>{stats.targetKcal} kcal</span>.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { label: `${stats.targetKcal} kcal`, sub: 'Mục tiêu/ngày', color: '#84cc16' },
                { label: `${stats.proteinG}g`, sub: 'Đạm', color: '#22c55e' },
                { label: `${stats.carbG}g`, sub: 'Tinh bột', color: '#f97316' },
                { label: `${stats.fatG}g`, sub: 'Chất béo', color: '#06b6d4' },
              ].map(b => (
                <div
                  key={b.sub}
                  className="flex flex-col items-center px-4 py-2 rounded-xl border"
                  style={{ background: `rgba(${b.color === '#84cc16' ? '132,204,22' : b.color === '#22c55e' ? '34,197,94' : b.color === '#f97316' ? '249,115,22' : '6,182,212'},0.08)`, borderColor: `${b.color}30` }}
                >
                  <span className="text-base font-bold" style={{ color: b.color }}>{b.label}</span>
                  <span className="text-xs" style={{ color: '#6b7280' }}>{b.sub}</span>
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: '#6b7280' }}>
              Các bữa ăn mẫu dưới đây được thiết kế cho ~1,400–1,700 kcal/ngày. Điều chỉnh khẩu phần theo nhu cầu của bạn.
            </p>
          </div>
        </RevealBlock>

        {/* ── Section 3: 7-Day Interactive Calendar ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#f5f5f5' }}>
            Thực Đơn 7 Ngày
          </h2>

          {/* Day selector row */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
            {DAYS.map((d, i) => {
              const active = activeDay === i;
              return (
                <button
                  key={d.n}
                  onClick={() => setActiveDay(i)}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl border transition-all duration-300 shrink-0 min-w-[80px]"
                  style={{
                    background: active ? `rgba(${d.rgb},0.14)` : 'rgba(255,255,255,0.04)',
                    borderColor: active ? d.color : 'rgba(255,255,255,0.08)',
                    borderLeftWidth: active ? 3 : 1,
                    boxShadow: active ? `0 0 12px rgba(${d.rgb},0.25)` : 'none',
                  }}
                >
                  <span className="text-xl">{d.emoji}</span>
                  <span className="text-xs font-bold mt-1" style={{ color: active ? d.color : '#9ca3af' }}>N{d.n}</span>
                  <span className="text-[10px] text-center leading-tight mt-0.5" style={{ color: active ? d.color : '#6b7280', maxWidth: 72 }}>
                    {d.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day detail card */}
          <div
            key={activeDay}
            className="rounded-2xl border overflow-hidden transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: `rgba(${day.rgb},0.22)` }}
          >
            {/* Day header */}
            <div
              className="p-5 border-b"
              style={{ background: `rgba(${day.rgb},0.07)`, borderColor: `rgba(${day.rgb},0.15)` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{day.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold" style={{ color: day.color }}>Ngày {day.n}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: day.color, background: `rgba(${day.rgb},0.12)`, borderColor: `rgba(${day.rgb},0.25)` }}
                    >
                      {day.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#f5f5f5' }}>{day.theme}</h3>
                </div>
              </div>
            </div>

            {/* Day image */}
            <div className="relative h-40 md:h-52 overflow-hidden">
              <img src={day.image} alt={day.theme} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)' }} />
            </div>

            <div className="p-5">
              {/* Ghi chú callout */}
              <div
                className="rounded-xl p-4 mb-5 border-l-4 text-sm leading-relaxed"
                style={{ background: `rgba(${day.rgb},0.06)`, borderLeftColor: day.color, color: '#d1d5db' }}
              >
                <span className="font-semibold" style={{ color: day.color }}>Ghi chú ngày {day.n}: </span>
                {day.note}
              </div>

              {/* Meal timeline */}
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Thực đơn</h4>
              <div className="space-y-2 mb-5">
                {day.meals.map((meal, mi) => (
                  <div
                    key={mi}
                    className="flex items-start gap-3 rounded-xl p-3 border"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    <div className="shrink-0 w-20 pt-0.5">
                      <span className="text-xs font-semibold" style={{ color: day.color }}>{meal.time}</span>
                    </div>
                    <span className="text-lg shrink-0">{meal.icon}</span>
                    <p className="text-sm flex-1 leading-snug" style={{ color: '#d1d5db' }}>{meal.food}</p>
                    <span
                      className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `rgba(${day.rgb},0.15)`, color: day.color }}
                    >
                      {meal.kcal} kcal
                    </span>
                  </div>
                ))}
              </div>

              {/* Macro summary */}
              <div
                className="rounded-xl p-4 mb-5 border"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>Tổng ngày</span>
                  <span className="text-base font-bold" style={{ color: day.color }}>{dayTotal.kcal} kcal</span>
                </div>
                <MacroBar label="Đạm" value={dayTotal.protein} max={stats.proteinG} color="#22c55e" />
                <MacroBar label="Tinh bột" value={dayTotal.carb} max={stats.carbG} color="#f97316" />
                <MacroBar label="Chất béo" value={dayTotal.fat} max={stats.fatG} color="#06b6d4" />
              </div>

              {/* Tips */}
              <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Tips ngày {day.n}</h4>
              <div className="space-y-2">
                {day.tips.map((tip, ti) => (
                  <div key={ti} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-sm" style={{ color: day.color }}>✓</span>
                    <span className="text-sm" style={{ color: '#d1d5db' }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── Section 4: Weekly chart ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Tổng Quan Calo 7 Ngày</h2>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
            Cột = kcal ước tính mỗi ngày. Đường đứt = mục tiêu của bạn ({stats.targetKcal} kcal).
          </p>
          <div
            className="rounded-2xl border p-4"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <WeeklyChart targetKcal={stats.targetKcal} />
          </div>
        </RevealBlock>

        {/* ── Section 5: Shopping list ── */}
        <RevealBlock className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold" style={{ color: '#f5f5f5' }}>Danh Sách Mua Sắm</h2>
            <button
              onClick={copyShoppingList}
              className="text-sm px-4 py-2 rounded-xl border transition-all duration-200 font-semibold"
              style={{ color: '#84cc16', borderColor: 'rgba(132,204,22,0.3)', background: 'rgba(132,204,22,0.08)' }}
            >
              Sao chép danh sách
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(SHOPPING_LIST).map(([catKey, cat]) => (
              <div
                key={catKey}
                className="rounded-2xl border p-4"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</span>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => {
                    const key = `${catKey}-${idx}`;
                    const checked = !!shopChecked[key];
                    return (
                      <label key={key} className="flex items-start gap-2 cursor-pointer group">
                        <div
                          className="shrink-0 w-4 h-4 mt-0.5 rounded border transition-all duration-200 flex items-center justify-center"
                          style={{
                            borderColor: checked ? cat.color : 'rgba(255,255,255,0.2)',
                            background: checked ? cat.color : 'transparent',
                          }}
                          onClick={() => toggleShop(key)}
                        >
                          {checked && <span className="text-[9px] text-black font-bold">✓</span>}
                        </div>
                        <span
                          className="text-xs leading-snug transition-colors duration-200"
                          style={{ color: checked ? '#4b5563' : '#d1d5db', textDecoration: checked ? 'line-through' : 'none' }}
                          onClick={() => toggleShop(key)}
                        >
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── Section 6: Meal Prep guide ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Meal Prep 60–90 Phút</h2>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Chuẩn bị trước một lần, ăn khỏe cả tuần.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MEAL_PREP_STEPS.map((step, si) => (
              <div
                key={step.n}
                className="rounded-2xl border p-4 relative"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {/* Connector dot */}
                <div
                  className="absolute -top-2 left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                  style={{ background: step.color, borderColor: '#0a0a0a', color: '#000' }}
                >
                  {step.n}
                </div>
                <div className="flex items-center gap-2 mb-2 mt-1">
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <span className="text-sm font-bold" style={{ color: '#f5f5f5' }}>{step.title}</span>
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${step.color}20`, color: step.color }}
                    >
                      {step.time}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* ── Section 7: Daily checklist ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Checklist Mỗi Ngày</h2>
          <div className="flex items-center gap-3 mb-6">
            <div className="text-sm font-semibold" style={{ color: checkedCount === CHECKLIST.length ? '#84cc16' : '#9ca3af' }}>
              {checkedCount}/{CHECKLIST.length} hoàn thành
            </div>
            <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(checkedCount / CHECKLIST.length) * 100}%`, background: '#84cc16' }}
              />
            </div>
          </div>
          {checkedCount === CHECKLIST.length && (
            <div
              className="rounded-2xl border p-4 mb-6 text-center text-sm font-semibold"
              style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.25)', color: '#84cc16' }}
            >
              Tuyệt vời! Bạn đã hoàn thành tất cả 5 mục hôm nay. Giữ vững nhé!
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHECKLIST.map((item, i) => {
              const done = !!checkDone[i];
              return (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200"
                  style={{
                    background: done ? `rgba(132,204,22,0.08)` : 'rgba(255,255,255,0.03)',
                    borderColor: done ? 'rgba(132,204,22,0.3)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: done ? '#84cc16' : 'rgba(255,255,255,0.2)',
                      background: done ? '#84cc16' : 'transparent',
                    }}
                  >
                    {done && <span className="text-xs font-bold text-black">✓</span>}
                  </div>
                  <span className="text-sm" style={{ color: done ? '#84cc16' : '#d1d5db' }}>{item.icon} {item.text}</span>
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* ── Section 8: Off-plan accordion ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f5f5f5' }}>Bữa Ăn Lỡ Tay — Xử Lý Thế Nào?</h2>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Lỡ kế hoạch không có nghĩa là thất bại. Đây là cách xử lý đúng.</p>
          <div className="space-y-3">
            {OFF_PLAN.map((item, i) => {
              const open = openAccordion === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{ borderColor: open ? `${item.color}40` : 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => toggleAccordion(i)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-sm" style={{ color: open ? item.color : '#f5f5f5' }}>{item.title}</span>
                    </div>
                    <span
                      className="text-lg transition-transform duration-300"
                      style={{ color: item.color, transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      ↓
                    </span>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: `${item.color}20` }}>
                      <ul className="space-y-2 mt-3">
                        {item.rules.map((rule, ri) => (
                          <li key={ri} className="flex items-start gap-2">
                            <span className="shrink-0 mt-0.5" style={{ color: item.color }}>→</span>
                            <span className="text-sm" style={{ color: '#d1d5db' }}>{rule}</span>
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

        {/* ── Section 9: Plate formula ── */}
        <RevealBlock className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#f5f5f5' }}>Công Thức Đĩa Ăn</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* SVG pie */}
            <div className="shrink-0">
              <svg viewBox="0 0 200 200" width="180" height="180">
                {/* ½ rau: 0–180deg */}
                <path d="M100,100 L100,10 A90,90 0 0,1 100,190 Z" fill="#22c55e" opacity="0.85" />
                {/* ¼ đạm: 180–270deg */}
                <path d="M100,100 L100,190 A90,90 0 0,1 10,100 Z" fill="#84cc16" opacity="0.85" />
                {/* ¼ tinh bột: 270–360deg */}
                <path d="M100,100 L10,100 A90,90 0 0,1 100,10 Z" fill="#f97316" opacity="0.85" />
                {/* Center */}
                <circle cx="100" cy="100" r="35" fill="#0a0a0a" />
                <text x="100" y="96" textAnchor="middle" fill="#f5f5f5" fontSize="11" fontWeight="bold">Đĩa</text>
                <text x="100" y="110" textAnchor="middle" fill="#9ca3af" fontSize="9">chuẩn</text>
                {/* Labels */}
                <text x="140" y="80" fill="#22c55e" fontSize="10" fontWeight="bold">½ Rau</text>
                <text x="38" y="160" fill="#84cc16" fontSize="10" fontWeight="bold">¼ Đạm</text>
                <text x="42" y="60" fill="#f97316" fontSize="10" fontWeight="bold">¼ Tinh bột</text>
              </svg>
            </div>
            <div className="flex-1">
              <blockquote
                className="text-base italic leading-relaxed mb-5 pl-4 border-l-4"
                style={{ color: '#d1d5db', borderLeftColor: '#84cc16' }}
              >
                "Một đĩa tốt không phải là đĩa ít nhất, mà là đĩa đủ đạm, đủ rau, đúng tinh bột và vừa chất béo."
              </blockquote>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '✋', label: 'Đạm', sub: '1 lòng bàn tay', color: '#84cc16' },
                  { icon: '👊', label: 'Tinh bột', sub: '1 nắm tay', color: '#f97316' },
                  { icon: '👐', label: 'Rau', sub: '2 lòng bàn tay', color: '#22c55e' },
                  { icon: '👍', label: 'Chất béo', sub: '1 ngón tay cái', color: '#eab308' },
                ].map(m => (
                  <div
                    key={m.label}
                    className="rounded-xl border p-3 flex items-center gap-3"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: m.color }}>{m.label}</div>
                      <div className="text-xs" style={{ color: '#6b7280' }}>{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── Section 10: Safety note + CTA ── */}
        <RevealBlock className="mb-12">
          <div
            className="rounded-2xl border p-5 mb-8"
            style={{ background: 'rgba(132,204,22,0.04)', borderColor: 'rgba(132,204,22,0.15)' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#84cc16' }}>Lưu ý an toàn</p>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
                  Thực đơn này mang tính tham khảo. Nếu bạn có bệnh nền, đang dùng thuốc hoặc có nhu cầu đặc biệt, hãy tham khảo chuyên gia dinh dưỡng hoặc bác sĩ trước khi thay đổi chế độ ăn.
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
              to="/pillar/b/meals"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
              style={{ background: '#84cc16', color: '#000' }}
            >
              Quy tắc bữa ăn →
            </Link>
          </div>
        </RevealBlock>

      </div>
    </div>
  );
}
