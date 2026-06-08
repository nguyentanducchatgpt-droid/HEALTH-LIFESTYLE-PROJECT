import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Orbit-ring CSS ─── */
function useOrbitRing() {
  useEffect(() => {
    if (document.getElementById('ap-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 'ap-orbit-kf';
    s.textContent = `
      @property --ap-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes apSpin { to { --ap-angle: 360deg; } }
      .ap-orbit-ring {
        background: conic-gradient(
          from var(--ap-angle),
          transparent 0deg, transparent 55deg,
          rgba(132,204,22,0.0) 65deg, rgba(132,204,22,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(132,204,22,0.75) 99deg,
          rgba(132,204,22,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: apSpin 3.5s linear infinite;
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

/* ─── Constants ─── */
const DAY_TYPES = [
  {
    id: 'veryHeavy',
    label: 'Ngày Rất Nặng',
    sublabel: 'Double / Triple Session',
    emoji: '🔥',
    color: '#ef4444', rgb: '239,68,68',
    tag: '2–3 buổi/ngày',
    desc: 'Đạp xe 60–90 phút + Gym 45–60 phút + Bơi kỹ thuật/aerobic',
    goals: [
      'Không để thiếu carb',
      'Bảo vệ cơ bằng đủ protein',
      'Bù nước + điện giải',
      'Ăn nhanh sau buổi đầu để còn NL cho buổi sau',
    ],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70',
    note: 'Carb 5–8g/kg/ngày khi tập 2–3h. Ngày tập 3–6h liên tiếp: có thể cần 8–10g/kg.',
  },
  {
    id: 'heavy',
    label: 'Ngày Nặng Vừa',
    sublabel: 'Strength + Swim/Run',
    emoji: '💪',
    color: '#f97316', rgb: '249,115,22',
    tag: 'Gym + 1 cardio',
    desc: 'Gym lower/full body buổi sáng + Bơi 45–60 phút hoặc chạy nhẹ 40 phút chiều',
    goals: [
      'Carb cao vẫn cần, nhất là gym chân',
      'Protein đều các bữa',
      'Bổ sung điện giải nếu đổ mồ hôi',
      'Ngủ đủ để phục hồi',
    ],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70',
    note: 'Ngày này carb vẫn cao — gym chân hoặc chạy tiêu tốn glycogen đáng kể.',
  },
  {
    id: 'endurance',
    label: 'Ngày Sức Bền Dài',
    sublabel: 'Long Ride / Long Run',
    emoji: '🚴',
    color: '#8b5cf6', rgb: '139,92,246',
    tag: '2–4 giờ liên tục',
    desc: 'Đạp xe 2–4 giờ / Chạy dài 75–120 phút / Bơi nhẹ hoặc mobility sau đó',
    goals: [
      'Carb cycling cao nhất trong tuần',
      'Nạp carb trong buổi 45–75g/giờ',
      'Điện giải liên tục (sodium 500–700mg/L)',
      'Bữa sau trong 60 phút: protein + carb',
    ],
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70',
    note: 'Trên 90 phút → nạp carb trong tập. Tập ruột tốt: 60–90g/giờ. Mới bắt đầu: 30–45g/giờ.',
  },
  {
    id: 'recovery',
    label: 'Ngày Hồi Phục',
    sublabel: 'Recovery Day',
    emoji: '😌',
    color: '#22c55e', rgb: '34,197,94',
    tag: 'Đi bộ · Zone 1–2 · Mobility',
    desc: 'Đi bộ / Đạp Zone 1–2 / Bơi thả lỏng / Mobility / Không gym nặng',
    goals: [
      'Giảm carb nhẹ vì tải tập thấp',
      'Protein KHÔNG giảm — cơ đang sửa chữa',
      'Omega-3, rau xanh, nước nhiều',
      'Ngủ đủ 7–9h — đây là lúc thực sự hồi phục',
    ],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70',
    note: 'Ngày hồi phục không phải "ngày ăn kiêng". Đây là ngày cơ thể sửa chữa và nạp lại glycogen.',
  },
];

const SPORT_FUELING = [
  {
    id: 'cycling',
    sport: 'Đạp Xe',
    emoji: '🚴',
    color: '#f97316',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70',
    sessions: [
      { dur: 'Dưới 60 phút', carb: 'Nước là chính. Sáng sớm chưa ăn: 1 chuối hoặc 1 lát bánh mì mật ong', inSession: 'Nước thôi', after: 'Ăn sáng đủ carb + protein' },
      { dur: '60–120 phút', carb: 'Ăn nhẹ 30–45 phút trước', inSession: '30–45g carb/giờ. 500–750ml nước/giờ', after: 'Protein 25–35g + Carb 60–80g trong 60 phút' },
      { dur: 'Trên 2 giờ', carb: 'Bữa nhẹ có carb + protein 60–90 phút trước', inSession: '45–75g carb/giờ (tinh ruột: 60–90g/giờ). Điện giải liên tục', after: 'Bữa lớn trong 60 phút: cơm + protein + rau. Bù nước 1.5× lượng mất' },
    ],
    tips: ['Cơm nắm là option tuyệt vời cho đạp dài — dễ mang, no lâu', 'Glucose + fructose phối hợp giúp hấp thu tốt hơn ở mức carb cao', 'Cân trước/sau để tính lượng mồ hôi mất'],
  },
  {
    id: 'running',
    sport: 'Chạy Bộ',
    emoji: '🏃',
    color: '#22c55e',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70',
    sessions: [
      { dur: 'Chạy nhẹ < 45 phút', carb: 'Không cần ăn nếu chạy sáng nhẹ', inSession: 'Nước là chính', after: 'Bữa sáng bình thường trong 30–60 phút' },
      { dur: '45–90 phút', carb: 'Bánh mì trắng + mật ong hoặc chuối (30–60 phút trước). Tránh đồ chiên, nhiều xơ', inSession: '20–40g carb nếu cường độ vừa–cao', after: 'Protein 25–35g + Carb 60–100g' },
      { dur: 'Trên 90 phút', carb: 'Carb nhẹ dễ tiêu 60–90 phút trước. Cháo loãng hoặc sữa chua ít béo', inSession: '30–60g carb/giờ (uống từng ngụm nhỏ). Mới: bắt đầu 20–30g/giờ rồi tăng dần', after: 'Ưu tiên ăn trong 45 phút: protein 25–40g + carb' },
    ],
    tips: ['Chạy dễ gây khó chịu tiêu hóa hơn đạp — bữa trước phải nhẹ hơn', 'Tránh thực phẩm nhiều xơ/béo trong 2 giờ trước chạy dài', 'Nếu hay đau bụng khi chạy: giảm carb trong tập xuống 15–20g/giờ trước'],
  },
  {
    id: 'swimming',
    sport: 'Bơi Lội',
    emoji: '🏊',
    color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=70',
    sessions: [
      { dur: 'Bơi kỹ thuật < 60 phút', carb: 'Bánh mì + trứng hoặc chuối + sữa chua (60–90 phút trước)', inSession: 'Nước (khó nạp carb trong nước)', after: 'Protein 25–35g + Carb 60–100g' },
      { dur: 'Bơi thể lực 60–90 phút', carb: 'Cơm nhỏ + cá/thịt nạc hoặc yến mạch + sữa', inSession: 'Nước điện giải nhẹ giữa hiệp nếu có', after: 'Protein 30–40g + Carb 80–120g (nếu còn buổi tập khác)' },
    ],
    tips: ['Không cảm nhận mồ hôi khi bơi nhưng vẫn mất nước — uống đủ', 'Điện giải quan trọng nếu bơi nóng (hồ nóng) hoặc bơi liên tục dài', 'Ăn nhẹ 60–90 phút trước bơi để không nặng bụng'],
  },
  {
    id: 'gym',
    sport: 'Gym',
    emoji: '🏋️',
    color: '#84cc16',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70',
    sessions: [
      { dur: 'Gym nhẹ–vừa < 60 phút', carb: 'Bánh mì + trứng hoặc chuối + sữa (1–2 giờ trước)', inSession: 'Nước là chính', after: 'Protein 25–35g + Carb 60g trong 60 phút' },
      { dur: 'Gym nặng 60–90 phút', carb: 'Cơm + ức gà/cá + rau (2–3 giờ trước) hoặc yến mạch + whey/sữa (60–90 phút trước)', inSession: 'Nước. Carb nhẹ nếu tập dài 80+ phút', after: 'Protein 30–40g + Carb 80–120g. Không để bữa sau gym nghèo năng lượng nếu mục tiêu tăng cơ' },
    ],
    tips: ['Gym cần cả carb lẫn protein — không chỉ protein shake là đủ', 'Ngày gym chân tiêu tốn carb nhiều nhất — đừng cắt tinh bột ngày này', 'Trước ngủ sau gym nặng: sữa chua Hy Lạp hoặc sữa để nuôi cơ ban đêm'],
  },
];

const WATER_RULES = [
  { session: 'Dưới 60 phút', amount: '300–600ml', pct: 30, note: 'Nước lọc là chính' },
  { session: '60–120 phút', amount: '500–750ml/giờ', pct: 60, note: 'Thêm điện giải nhẹ nếu đổ mồ hôi nhiều' },
  { session: 'Trên 2 giờ', amount: '500–1.000ml/giờ', pct: 100, note: 'Điện giải bắt buộc. Sodium ~500–700mg/L' },
];

const SEVEN_DAYS = [
  { n: 1, label: 'Đạp + Gym Upper + Bơi', type: 'veryHeavy', kcal: '3.000–3.200', emoji: '🔥',
    meals: [
      { t: 'Trước đạp xe', food: '1 chuối + 1 lát bánh mì mật ong + 400–500ml nước' },
      { t: 'Sau đạp / Sáng', food: 'Yến mạch 80g + sữa 300ml + 2 trứng + 1 quả chuối/xoài + sữa chua' },
      { t: 'Trưa', food: 'Cơm 2–2.5 chén + ức gà/cá 180g + rau luộc/salad + dầu olive + 1 cam' },
      { t: 'Trước gym/bơi', food: 'Bánh mì nguyên cám 2 lát + bơ đậu phộng/trứng + 300–500ml nước' },
      { t: 'Tối', food: 'Cơm/khoai lang/mì gạo + thịt bò nạc/cá/đậu hũ 180–220g + canh rau + trái cây' },
      { t: 'Trước ngủ', food: 'Sữa chua Hy Lạp hoặc 250ml sữa + ít hạt nếu còn đói' },
    ],
  },
  { n: 2, label: 'Gym Lower + Bơi', type: 'heavy', kcal: '2.800–3.000', emoji: '💪',
    meals: [
      { t: 'Sáng', food: 'Cơm hoặc bánh mì + 2 trứng + 100g thịt nạc/cá + rau xanh + 1 ly sữa' },
      { t: 'Trước gym', food: '1 chuối + 1 hũ sữa chua + cà phê nếu quen' },
      { t: 'Sau gym / Trưa', food: 'Cơm 2 chén + thịt/cá/đậu hũ 200g + rau 2 nắm + canh + 1 trái cây' },
      { t: 'Trước bơi', food: 'Khoai lang 200g hoặc bánh mì + mật ong + 400ml nước' },
      { t: 'Tối', food: 'Bún/phở/cơm + đạm nạc 180g + rau/canh nhiều + 1 phần trái cây' },
      { t: 'Trước ngủ', food: 'Sữa hoặc đậu hũ non' },
    ],
  },
  { n: 3, label: 'Chạy Interval + Gym Push', type: 'veryHeavy', kcal: '3.000', emoji: '🏃',
    meals: [
      { t: 'Trước chạy', food: '1 chuối + 1 lát bánh mì trắng/mật ong + nước' },
      { t: 'Sau chạy', food: 'Cháo yến mạch hoặc cơm + 2 trứng + sữa/sữa chua + trái cây' },
      { t: 'Trưa', food: 'Cơm 2–2.5 chén + cá/ức gà/thịt bò nạc 180–220g + rau xanh + canh' },
      { t: 'Trước gym', food: 'Sữa chua + granola hoặc bánh mì + trứng' },
      { t: 'Tối', food: 'Cơm/khoai/mì Ý + đạm 180–200g + rau/canh + chuối/cam nếu còn mệt' },
    ],
  },
  { n: 4, label: 'Bơi Kỹ Thuật + Chạy Zone 2', type: 'heavy', kcal: '2.700–2.900', emoji: '🏊',
    meals: [
      { t: 'Sáng', food: 'Bánh mì nguyên cám + trứng/ức gà/cá ngừ + rau + sữa' },
      { t: 'Bữa phụ', food: 'Trái cây + sữa chua + ít hạt' },
      { t: 'Trưa', food: 'Cơm 1.5–2 chén + đậu hũ/cá/thịt nạc 180g + rau/canh + trái cây' },
      { t: 'Trước chạy nhẹ', food: 'Chuối hoặc khoai nhỏ + nước' },
      { t: 'Tối', food: 'Cơm vừa + cá hoặc đậu hũ + rau nhiều + canh + sữa chua' },
    ],
  },
  { n: 5, label: 'Đạp Tempo + Gym Pull', type: 'veryHeavy', kcal: '3.000–3.200', emoji: '🚴',
    meals: [
      { t: 'Trước đạp', food: 'Chuối + bánh mì mật ong + nước/điện giải nếu nóng' },
      { t: 'Trong đạp >75 phút', food: '30–60g carb/giờ + 500–750ml nước/giờ' },
      { t: 'Sau đạp', food: 'Cơm/yến mạch + sữa + trứng hoặc thịt nạc + trái cây' },
      { t: 'Trưa', food: 'Cơm 2–2.5 chén + thịt bò/cá/gà 200g + rau + canh' },
      { t: 'Trước gym', food: 'Bánh mì + trứng hoặc sữa chua + chuối' },
      { t: 'Tối', food: 'Mì gạo/cơm/khoai + đạm 200g + rau/canh + trái cây' },
    ],
  },
  { n: 6, label: 'Long Ride hoặc Long Run', type: 'endurance', kcal: '3.200–3.500', emoji: '🏅',
    inSessionNote: '45–75g carb/giờ + 500–900ml nước/giờ + điện giải nếu nóng',
    meals: [
      { t: 'Trước buổi dài (2–3h)', food: 'Cơm nhỏ hoặc bánh mì + trứng/thịt nạc vừa + chuối + 500ml nước' },
      { t: 'Trong buổi dài', food: '45–75g carb/giờ + 500–900ml nước/giờ + điện giải nếu nóng', highlight: true },
      { t: 'Sau buổi dài (trong 1h)', food: 'Cơm + gà/cá + canh + trái cây HOẶC sinh tố sữa + chuối + yến mạch' },
      { t: 'Tối', food: 'Cơm/khoai/mì + đạm nạc + rau/canh (thêm muối vừa nếu mồ hôi nhiều)' },
    ],
  },
  { n: 7, label: 'Recovery / Mobility / Bơi Nhẹ', type: 'recovery', kcal: '2.400–2.700', emoji: '😌',
    meals: [
      { t: 'Sáng', food: 'Trứng + bánh mì hoặc cơm + rau + trái cây' },
      { t: 'Trưa', food: 'Cơm vừa + cá/đậu hũ/thịt nạc + nhiều rau + canh' },
      { t: 'Bữa phụ', food: 'Sữa chua + trái cây + ít hạt' },
      { t: 'Tối', food: 'Đạm 180–200g + rau nhiều + cơm/khoai/bún vừa phần' },
      { t: 'Trước ngủ', food: 'Sữa ấm nếu đói (không bắt buộc)' },
    ],
  },
];

const ADJUSTMENT_RULES = [
  {
    goal: 'Giảm mỡ + vẫn tập nhiều',
    emoji: '🔥',
    color: '#f97316',
    rules: [
      'Không cắt quá sâu — giảm 200–300 kcal/ngày so với duy trì',
      'Giữ protein 1.8–2.2g/kg',
      'Giữ carb quanh buổi tập, KHÔNG cắt ngày long ride/run',
      'Giảm chủ yếu từ đồ ngọt, đồ chiên, snack thừa, rượu bia',
    ],
    warning: 'Dấu hiệu cắt quá sâu: nhịp tim nghỉ tăng, ngủ kém, tập tụt lực, đói nhiều đêm, dễ cáu, đau nhức kéo dài',
  },
  {
    goal: 'Tăng cơ',
    emoji: '💪',
    color: '#84cc16',
    rules: [
      'Tăng 200–300 kcal/ngày',
      'Protein 1.8–2.2g/kg',
      'Không bulk bẩn — tăng từ cơm/khoai/yến mạch/sữa, không từ đồ chiên',
      'Theo dõi vòng eo — nếu tăng nhanh, cắt nhẹ surplus',
    ],
    warning: 'Theo dõi: cân tăng 0.3–0.5kg/tuần + sức tập tăng = đang đúng hướng',
  },
  {
    goal: 'Duy trì + tối ưu hiệu suất',
    emoji: '⚖️',
    color: '#06b6d4',
    rules: [
      'Ăn quanh TDEE — carb cycling theo ngày tập',
      'Protein đều mọi ngày, không bỏ ngày recovery',
      'Carb cao ngày nặng, thấp hơn ngày nhẹ',
      'Rau và nước không thay đổi theo tải tập',
    ],
    warning: 'Tín hiệu tốt: pace ổn/cải thiện, hồi phục tốt, không thèm ngọt nhiều, ngủ sâu',
  },
];

const MEAL_PREP_ADVANCED = [
  { day: 'Chủ nhật', icon: '📦', color: '#a855f7',
    tasks: ['Nấu ức gà/thịt nạc/cá cho 3–4 ngày', 'Luộc 8–10 trứng', 'Nấu 3–4 phần cơm/gạo lứt', 'Hấp khoai lang 4–5 củ', 'Rửa rau, chia theo ngày', 'Chuẩn bị trái cây đã cắt', 'Chia snack buổi tập (chuối + sữa chua/hạt)'],
  },
  { day: 'Thứ tư', icon: '🔄', color: '#06b6d4',
    tasks: ['Bổ sung đạm tươi (cá/thịt mới)', 'Thay đổi món để không ngán', 'Chuẩn bị đồ cho long ride/run cuối tuần', 'Bổ sung carb (nấu thêm cơm/khoai)'],
  },
];

const UNDER_FUELING_SIGNS = [
  { icon: '💨', sign: 'Tập hụt hơi', desc: 'Khó thở sớm hơn bình thường, cảm giác không đủ sức' },
  { icon: '📉', sign: 'Tụt pace', desc: 'Tốc độ chạy/đạp giảm dù không tập nặng hơn' },
  { icon: '🏋️', sign: 'Gym không tăng lực', desc: 'Tạ dậm chân tại chỗ hoặc giảm, không thể PB' },
  { icon: '🍬', sign: 'Thèm ngọt tối', desc: 'Cơn thèm mạnh sau 8pm — dấu hiệu thiếu carb cả ngày' },
  { icon: '😴', sign: 'Ngủ kém', desc: 'Khó ngủ, ngủ không sâu, thức giữa đêm dù mệt' },
  { icon: '🤕', sign: 'Đau nhức kéo dài', desc: 'Cơ không phục hồi đủ, đau cơ qua 48–72h vẫn còn' },
  { icon: '🚪', sign: 'Dễ bỏ cuộc', desc: 'Giảm động lực tập, hay bỏ buổi — não thiếu glucose' },
];

const DAY_TYPE_META = {
  veryHeavy: { color: '#ef4444', label: 'Rất Nặng' },
  heavy: { color: '#f97316', label: 'Nặng Vừa' },
  endurance: { color: '#8b5cf6', label: 'Sức Bền' },
  recovery: { color: '#22c55e', label: 'Hồi Phục' },
};

/* ─── Advanced macro calculator ─── */
function computeAdvancedMacros(w) {
  const wn = Number(w) || 77;
  return {
    veryHeavy:  { kcal: [Math.round(wn*39), Math.round(wn*43)], protein: [Math.round(wn*2.0), Math.round(wn*2.2)], carb: [Math.round(wn*5.0), Math.round(wn*6.0)], fat: [Math.round(wn*1.05), Math.round(wn*1.3)], water: '3–4.5L' },
    heavy:      { kcal: [Math.round(wn*35), Math.round(wn*39)], protein: [Math.round(wn*2.0), Math.round(wn*2.1)], carb: [Math.round(wn*4.2), Math.round(wn*5.2)], fat: [Math.round(wn*0.97), Math.round(wn*1.23)], water: '2.5–3.5L' },
    endurance:  { kcal: [Math.round(wn*39), Math.round(wn*45)], protein: [Math.round(wn*1.8), Math.round(wn*2.1)], carb: [Math.round(wn*5.6), Math.round(wn*7.1)], fat: [Math.round(wn*0.91), Math.round(wn*1.23)], water: '3–5L+' },
    recovery:   { kcal: [Math.round(wn*30), Math.round(wn*34)], protein: [Math.round(wn*1.95), Math.round(wn*2.1)], carb: [Math.round(wn*2.9), Math.round(wn*3.9)], fat: [Math.round(wn*1.04), Math.round(wn*1.23)], water: '2.5–3L' },
  };
}

/* ─── Carb SVG Bar Chart ─── */
function CarbCyclingChart({ macros }) {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = [
    { id: 'veryHeavy', label: 'Ngày Rất Nặng', color: '#ef4444', midCarb: Math.round((macros.veryHeavy.carb[0] + macros.veryHeavy.carb[1]) / 2) },
    { id: 'endurance', label: 'Sức Bền Dài', color: '#8b5cf6', midCarb: Math.round((macros.endurance.carb[0] + macros.endurance.carb[1]) / 2) },
    { id: 'heavy', label: 'Nặng Vừa', color: '#f97316', midCarb: Math.round((macros.heavy.carb[0] + macros.heavy.carb[1]) / 2) },
    { id: 'recovery', label: 'Hồi Phục', color: '#22c55e', midCarb: Math.round((macros.recovery.carb[0] + macros.recovery.carb[1]) / 2) },
  ];
  const maxCarb = Math.max(...items.map(i => i.midCarb));
  const baselineCarb = Math.round((macros.heavy.carb[0] + macros.recovery.carb[1]) / 2);

  return (
    <div ref={ref} className="w-full">
      <svg viewBox={`0 0 560 ${items.length * 56 + 40}`} style={{ overflow: 'visible', width: '100%', height: 'auto' }}>
        {/* Baseline reference */}
        {(() => {
          const bx = 140 + (baselineCarb / maxCarb) * 360;
          return (
            <>
              <line x1={bx} y1={10} x2={bx} y2={items.length * 56 + 20} stroke="#6b7280" strokeWidth="1" strokeDasharray="4,3" />
              <text x={bx + 6} y={18} fill="#9ca3af" fontSize="11">duy trì baseline</text>
            </>
          );
        })()}
        {items.map((item, i) => {
          const barW = animated ? (item.midCarb / maxCarb) * 360 : 0;
          const y = i * 56 + 30;
          return (
            <g key={item.id}>
              <text x={130} y={y + 8} fill="#e5e7eb" fontSize="12" textAnchor="end">{item.label}</text>
              <rect x={140} y={y} width={barW} height={28} rx={6}
                fill={item.color} opacity={0.8}
                style={{ transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)', transitionDelay: `${i * 0.12}s` }}
              />
              <text x={140 + barW + 8} y={y + 18} fill={item.color} fontSize="12" fontWeight="bold"
                style={{ transition: 'x 0.8s', transitionDelay: `${i * 0.12}s` }}>
                {item.midCarb}g
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Main Page ─── */
export default function NutritionAdvancedPlanPage() {
  useOrbitRing();

  const [b0, setB0] = useState({ w: 77, h: 175, a: 1.9, sx: 'male', age: 35 });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('healthapp_b0_inputs');
      if (raw) setB0(p => ({ ...p, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  const macros = computeAdvancedMacros(b0.w);
  const [selectedDayType, setSelectedDayType] = useState('veryHeavy');
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeSport, setActiveSport] = useState('cycling');
  const [selectedWeekDay, setSelectedWeekDay] = useState(0);
  const [mealPrepChecks, setMealPrepChecks] = useState({});
  const [expandedAdj, setExpandedAdj] = useState(null);

  const activeMacro = macros[selectedDayType];
  const activeDayType = DAY_TYPES.find(d => d.id === selectedDayType);
  const activeSportData = SPORT_FUELING.find(s => s.id === activeSport);
  const currentDay = SEVEN_DAYS[selectedWeekDay];

  const toggleCheck = (key) => setMealPrepChecks(p => ({ ...p, [key]: !p[key] }));

  const waterMin = Math.round(b0.w * 35);
  const waterMax = Math.round(b0.w * 45);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb] pt-28 md:pt-32 pb-24">
      <div className="px-4 md:px-6 max-w-4xl mx-auto">

        {/* ── Breadcrumb ── */}
        <Link to="/pillar/b" className="inline-flex items-center gap-2 text-lg text-[#84cc16] hover:opacity-80 transition-opacity mb-8">
          ← Dinh Dưỡng
        </Link>

        {/* ── SECTION 1: Hero ── */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(132,204,22,0.05)' }} />
          <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 border"
            style={{ background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.2)', animation: 'float 3s ease-in-out infinite' }}>
            ⚡
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: '#e5e7eb', animation: 'fadeInUp 0.6s ease both' }}>
              Plan Nâng Cao Cho Người Tập Nhiều
            </h1>
            <div className="text-lg font-semibold mt-1 mb-2" style={{ color: '#84cc16' }}>
              Đạp Xe · Gym · Bơi · Chạy Bộ
            </div>
            <span className="inline-block text-base font-bold uppercase tracking-widest mt-1 mb-4 px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(132,204,22,0.1)', borderColor: 'rgba(132,204,22,0.2)' }}>
              Periodized nutrition · 4 loại ngày · 4 môn thể thao
            </span>
            <p className="text-[#9ca3af] text-lg leading-relaxed max-w-2xl">
              Người tập nhiều không ăn theo kiểu "ăn ít cho nhanh gọn". Nguyên tắc: ăn để tập tốt — phục hồi tốt — duy trì lâu dài.
            </p>
          </div>
        </div>

        {/* Hero image orbit ring */}
        <div className="ap-orbit-ring rounded-3xl p-[1.5px] mb-6">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80"
              alt="Advanced training nutrition"
              className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }} />
            <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(10,10,10,0.6)', borderColor: 'rgba(132,204,22,0.2)' }}>
              Advanced Athletic Nutrition
            </span>
          </div>
        </div>

        {/* Stat badges */}
        <div className="flex flex-wrap gap-3 mb-10">
          {['4 Loại Ngày', '4 Môn Thể Thao', '7 Ngày Mẫu', 'Personalized Macros'].map(s => (
            <span key={s} className="text-base font-bold px-4 py-2 rounded-full border"
              style={{ color: '#84cc16', background: 'rgba(132,204,22,0.08)', borderColor: 'rgba(132,204,22,0.25)' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(75,85,99,0.5), transparent)' }} />

        {/* ── SECTION 2: Under-fueling warning ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⚠️</span>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#ef4444' }}>Thiếu năng lượng dẫn đến...</h2>
              <p className="text-lg text-[#9ca3af] mt-0.5">7 dấu hiệu phổ biến nhất khi ăn không đủ so với tải tập</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {UNDER_FUELING_SIGNS.map((item, i) => (
              <div key={i} className="rounded-2xl p-4 flex items-start gap-3 border"
                style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
                <span className="text-3xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="font-semibold text-lg" style={{ color: '#fca5a5' }}>{item.sign}</div>
                  <div className="text-base text-[#9ca3af] mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl p-4 border flex items-start gap-3"
            style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.25)' }}>
            <span className="text-xl shrink-0">💡</span>
            <p className="text-lg text-[#fca5a5] leading-relaxed">
              Quy tắc đơn giản: nếu bạn liên tục mệt hơn tuần trước, không tiến bộ, hoặc thèm ngọt vào buổi tối — ăn thêm carb trước tiên, không phải cắt thêm.
            </p>
          </div>
        </RevealBlock>

        {/* ── SECTION 3: Personalized Macro Calculator ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🧮</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">Macro Cá Nhân Hóa</h2>
          </div>
          <p className="text-lg text-[#9ca3af] mb-6">
            Dựa trên cân nặng của bạn: <span className="font-bold" style={{ color: '#84cc16' }}>{b0.w}kg</span>
            {' '}· Chiều cao: <span className="font-bold" style={{ color: '#84cc16' }}>{b0.h}cm</span>
            {' '}· {b0.sx === 'female' ? 'Nữ' : 'Nam'} {b0.age} tuổi
          </p>

          {/* Day type selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {DAY_TYPES.map(dt => (
              <button key={dt.id}
                onClick={() => setSelectedDayType(dt.id)}
                className="rounded-2xl p-3 border text-left transition-all duration-200"
                style={{
                  background: selectedDayType === dt.id ? `rgba(${dt.rgb},0.15)` : 'rgba(255,255,255,0.03)',
                  borderColor: selectedDayType === dt.id ? `rgba(${dt.rgb},0.5)` : 'rgba(255,255,255,0.08)',
                  boxShadow: selectedDayType === dt.id ? `0 0 12px rgba(${dt.rgb},0.2)` : 'none',
                }}>
                <div className="text-2xl mb-1">{dt.emoji}</div>
                <div className="text-base font-bold" style={{ color: dt.color }}>{dt.label}</div>
                <div className="text-base text-[#6b7280] mt-0.5">{dt.tag}</div>
              </button>
            ))}
          </div>

          {/* Macro cards */}
          <div key={`${selectedDayType}-${b0.w}`} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Calo', value: `${activeMacro.kcal[0]}–${activeMacro.kcal[1]}`, unit: 'kcal', icon: '🔥', color: activeDayType.color },
              { label: 'Protein', value: `${activeMacro.protein[0]}–${activeMacro.protein[1]}`, unit: 'g', icon: '🥩', color: '#84cc16' },
              { label: 'Carb', value: `${activeMacro.carb[0]}–${activeMacro.carb[1]}`, unit: 'g', icon: '🌾', color: '#f59e0b' },
              { label: 'Fat', value: `${activeMacro.fat[0]}–${activeMacro.fat[1]}`, unit: 'g', icon: '🫒', color: '#06b6d4' },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl p-4 border text-center"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="text-xl font-bold" style={{ color: card.color }}>{card.value}</div>
                <div className="text-base text-[#6b7280]">{card.unit}/ngày</div>
                <div className="text-base font-medium text-[#9ca3af] mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Water card */}
          <div className="rounded-2xl p-4 border flex items-center gap-4"
            style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.2)' }}>
            <span className="text-3xl">💧</span>
            <div>
              <div className="font-bold" style={{ color: '#06b6d4' }}>Nước: {activeMacro.water}</div>
              <div className="text-base text-[#9ca3af] mt-0.5">Ngày {activeDayType.label.toLowerCase()} · Tổng ngày: {waterMin}–{waterMax}ml cơ bản</div>
            </div>
          </div>

          <div className="mt-3 text-base text-[#6b7280] bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
            <span className="text-[#84cc16] font-semibold">Công thức: </span>
            Protein/ngày = cân nặng × 1.8–2.2g | Carb theo loại ngày 3–8g/kg | Nước cơ bản: {b0.w}kg × 35–45ml = {waterMin}–{waterMax}ml
          </div>
        </RevealBlock>

        {/* ── SECTION 4: 4-Day Type Cards ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📅</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">4 Loại Ngày Tập</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAY_TYPES.map(dt => {
              const m = macros[dt.id];
              const isOpen = expandedDay === dt.id;
              return (
                <div key={dt.id} className="rounded-3xl border overflow-hidden transition-all duration-300"
                  style={{ borderColor: isOpen ? `rgba(${dt.rgb},0.4)` : 'rgba(255,255,255,0.08)', background: isOpen ? `rgba(${dt.rgb},0.06)` : 'rgba(255,255,255,0.02)' }}>
                  <button className="w-full text-left p-5" onClick={() => setExpandedDay(isOpen ? null : dt.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{dt.emoji}</span>
                        <div>
                          <div className="font-bold text-lg" style={{ color: dt.color }}>{dt.label}</div>
                          <div className="text-base text-[#9ca3af]">{dt.sublabel}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base px-2 py-1 rounded-full border font-semibold"
                          style={{ color: dt.color, borderColor: `rgba(${dt.rgb},0.3)`, background: `rgba(${dt.rgb},0.1)` }}>
                          {dt.tag}
                        </span>
                        <span className="text-[#6b7280] text-xl">{isOpen ? '▲' : '▼'}</span>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      {/* Image */}
                      <div className="rounded-2xl overflow-hidden h-36 mb-4 relative">
                        <img src={dt.image} alt={dt.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(10,10,10,0.8), transparent)` }} />
                      </div>
                      {/* Description */}
                      <p className="text-lg text-[#9ca3af] mb-4 leading-relaxed">{dt.desc}</p>
                      {/* Goals */}
                      <div className="mb-4">
                        <div className="text-base font-bold uppercase tracking-wider mb-2" style={{ color: dt.color }}>Mục tiêu dinh dưỡng</div>
                        <ul className="space-y-1">
                          {dt.goals.map((g, i) => (
                            <li key={i} className="flex items-start gap-2 text-lg text-[#d1d5db]">
                              <span style={{ color: dt.color }} className="mt-0.5 shrink-0">✓</span>
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Macro table */}
                      <div className="rounded-xl overflow-hidden border mb-4" style={{ borderColor: `rgba(${dt.rgb},0.2)` }}>
                        <div className="grid grid-cols-4 text-center text-base">
                          {[
                            { l: 'Calo', v: `${m.kcal[0]}–${m.kcal[1]}`, u: 'kcal' },
                            { l: 'Protein', v: `${m.protein[0]}–${m.protein[1]}`, u: 'g' },
                            { l: 'Carb', v: `${m.carb[0]}–${m.carb[1]}`, u: 'g' },
                            { l: 'Fat', v: `${m.fat[0]}–${m.fat[1]}`, u: 'g' },
                          ].map((cell, i) => (
                            <div key={i} className="py-3 px-1 border-r last:border-r-0" style={{ borderColor: `rgba(${dt.rgb},0.15)`, background: `rgba(${dt.rgb},0.05)` }}>
                              <div className="font-bold" style={{ color: dt.color }}>{cell.v}</div>
                              <div className="text-[#6b7280]">{cell.u}</div>
                              <div className="text-[#9ca3af] mt-0.5">{cell.l}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Note */}
                      <div className="text-base rounded-xl px-3 py-2 border leading-relaxed"
                        style={{ color: dt.color, background: `rgba(${dt.rgb},0.08)`, borderColor: `rgba(${dt.rgb},0.2)` }}>
                        📌 {dt.note}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealBlock>

        {/* ── SECTION 5: Daily Timeline ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⏰</span>
            <div>
              <h2 className="text-3xl font-bold text-[#e5e7eb]">Lịch Ăn Ngày 2 Buổi</h2>
              <p className="text-lg text-[#9ca3af] mt-0.5">Timeline từ 05:30 → 21:30 cho ngày đạp + gym/bơi</p>
            </div>
          </div>
          <div className="relative">
            {/* Vertical line desktop */}
            <div className="hidden md:block absolute left-[120px] top-0 bottom-0 w-px" style={{ background: 'rgba(132,204,22,0.2)' }} />
            <div className="space-y-4">
              {[
                { time: '05:30', goal: 'Trước buổi sáng (đạp/chạy)', food: '1 chuối + 1 lát bánh mì mật ong + 400ml nước', color: '#f97316', icon: '🌅' },
                { time: '07:30', goal: 'Bữa sáng / sau buổi đầu', food: 'Yến mạch 80g + sữa 300ml + 2 trứng + 1 chuối + sữa chua', color: '#84cc16', icon: '🥣' },
                { time: '10:00', goal: 'Bữa phụ sáng', food: 'Trái cây + sữa chua + ít hạt hỗn hợp', color: '#06b6d4', icon: '🍎' },
                { time: '12:30', goal: 'Bữa trưa chính', food: 'Cơm 2–2.5 chén + ức gà/cá 180g + rau luộc/salad + dầu olive', color: '#84cc16', icon: '🍽️' },
                { time: '15:30', goal: 'Trước gym/bơi', food: 'Bánh mì nguyên cám 2 lát + bơ đậu phộng/trứng + 400ml nước', color: '#f97316', icon: '⚡' },
                { time: '18:30', goal: 'Bữa tối (sau tập)', food: 'Cơm/khoai lang/mì gạo + thịt bò nạc/cá/đậu hũ 180–220g + canh rau + trái cây', color: '#84cc16', icon: '🌙' },
                { time: '21:00', goal: 'Trước ngủ (tùy chọn)', food: 'Sữa chua Hy Lạp hoặc 250ml sữa + ít hạt', color: '#8b5cf6', icon: '🌛' },
              ].map((slot, i) => (
                <div key={i} className="flex items-start gap-0 md:gap-0">
                  {/* Time bubble */}
                  <div className="hidden md:flex w-[112px] justify-end pr-4 pt-1 shrink-0">
                    <span className="text-base font-bold px-2 py-1 rounded-full"
                      style={{ color: slot.color, background: `rgba(132,204,22,0.08)`, border: `1px solid rgba(132,204,22,0.15)` }}>
                      {slot.time}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="hidden md:flex flex-col items-center mt-1 shrink-0">
                    <div className="w-3 h-3 rounded-full border-2" style={{ background: slot.color, borderColor: '#0a0a0a' }} />
                  </div>
                  {/* Card */}
                  <div className="md:ml-4 flex-1 rounded-2xl p-4 border"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{slot.icon}</span>
                      <span className="text-base font-bold md:hidden" style={{ color: slot.color }}>{slot.time}</span>
                      <span className="text-lg font-semibold" style={{ color: slot.color }}>{slot.goal}</span>
                    </div>
                    <p className="text-lg text-[#9ca3af] leading-relaxed">{slot.food}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 6: Fueling Per Sport ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎯</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">Nạp Năng Lượng Theo Môn</h2>
          </div>

          {/* Sport tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {SPORT_FUELING.map(sp => (
              <button key={sp.id}
                onClick={() => setActiveSport(sp.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-lg font-bold whitespace-nowrap transition-all duration-200 shrink-0"
                style={{
                  color: activeSport === sp.id ? sp.color : '#9ca3af',
                  borderColor: activeSport === sp.id ? sp.color : 'rgba(255,255,255,0.08)',
                  background: activeSport === sp.id ? `rgba(132,204,22,0.06)` : 'transparent',
                }}>
                <span>{sp.emoji}</span> {sp.sport}
              </button>
            ))}
          </div>

          {/* Sport content */}
          {activeSportData && (
            <div key={activeSport} className="transition-all duration-300">
              {/* Banner */}
              <div className="rounded-2xl overflow-hidden h-40 mb-5 relative">
                <img src={activeSportData.image} alt={activeSportData.sport} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.85), transparent)' }} />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-3xl">{activeSportData.emoji}</span>
                  <span className="font-bold text-xl text-white">{activeSportData.sport}</span>
                </div>
              </div>

              {/* Session cards */}
              <div className="space-y-3 mb-5">
                {activeSportData.sessions.map((sess, i) => (
                  <div key={i} className="rounded-2xl border overflow-hidden"
                    style={{ borderColor: `rgba(255,255,255,0.08)`, background: 'rgba(255,255,255,0.02)' }}>
                    <div className="px-4 py-2.5 border-b text-lg font-bold"
                      style={{ color: activeSportData.color, borderColor: 'rgba(255,255,255,0.06)', background: `rgba(132,204,22,0.04)` }}>
                      ⏱ {sess.dur}
                    </div>
                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                      {[
                        { l: 'Trước tập', v: sess.carb, icon: '⬆️' },
                        { l: 'Trong tập', v: sess.inSession, icon: '⚡' },
                        { l: 'Sau tập', v: sess.after, icon: '✅' },
                      ].map((cell, j) => (
                        <div key={j} className="p-4">
                          <div className="text-base font-semibold mb-1" style={{ color: activeSportData.color }}>
                            {cell.icon} {cell.l}
                          </div>
                          <div className="text-lg text-[#d1d5db] leading-relaxed">{cell.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="rounded-2xl p-4 border" style={{ background: `rgba(132,204,22,0.04)`, borderColor: 'rgba(132,204,22,0.15)' }}>
                <div className="text-base font-bold uppercase tracking-wider mb-3" style={{ color: '#84cc16' }}>
                  💡 Tips Quan Trọng
                </div>
                <ul className="space-y-2">
                  {activeSportData.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-lg text-[#d1d5db]">
                      <span style={{ color: '#84cc16' }} className="shrink-0 mt-0.5">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ── SECTION 7: Water & Electrolytes ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">💧</span>
            <div>
              <h2 className="text-3xl font-bold text-[#e5e7eb]">Nước & Điện Giải</h2>
              <p className="text-lg text-[#9ca3af] mt-0.5">Dựa trên cân nặng {b0.w}kg → cơ bản {waterMin}–{waterMax}ml/ngày</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {WATER_RULES.map((row, i) => (
              <div key={i} className="rounded-2xl p-4 border" style={{ background: 'rgba(6,182,212,0.04)', borderColor: 'rgba(6,182,212,0.15)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-[#e5e7eb]">{row.session}</span>
                  <span className="text-lg font-bold" style={{ color: '#06b6d4' }}>{row.amount}</span>
                </div>
                {/* Visual bar */}
                <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${row.pct}%`, background: 'linear-gradient(to right, #06b6d4, #84cc16)' }} />
                </div>
                <p className="text-base text-[#9ca3af]">{row.note}</p>
              </div>
            ))}
          </div>

          {/* Electrolyte callout */}
          <div className="rounded-2xl p-5 border mb-4" style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
            <div className="font-bold mb-2" style={{ color: '#f97316' }}>⚡ Cần bổ sung điện giải khi:</div>
            <ul className="space-y-1 text-lg text-[#d1d5db]">
              {['Tập trên 60–90 phút liên tục', 'Tập trong điều kiện nóng/ẩm cao', 'Thấy vệt muối trắng trên áo sau tập', 'Chuột rút trong hoặc sau tập', 'Đạp xe / chạy dài trên 2 giờ'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span style={{ color: '#f97316' }}>•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl px-4 py-3 border text-lg" style={{ background: 'rgba(6,182,212,0.06)', borderColor: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>
            <span className="font-bold">Công thức: </span>
            35–45ml/kg/ngày cơ bản + bù mồ hôi (∼500–1.000ml/giờ tập nặng) → Bạn ({b0.w}kg): {waterMin}–{waterMax}ml/ngày + lượng tập
          </div>
        </RevealBlock>

        {/* ── SECTION 8: 7-Day Plan ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📆</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">Thực Đơn 7 Ngày Mẫu</h2>
          </div>

          {/* Day buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {SEVEN_DAYS.map((d, i) => {
              const meta = DAY_TYPE_META[d.type];
              return (
                <button key={i}
                  onClick={() => setSelectedWeekDay(i)}
                  className="flex flex-col items-center px-4 py-3 rounded-2xl border transition-all duration-200 shrink-0 min-w-[72px]"
                  style={{
                    borderColor: selectedWeekDay === i ? meta.color : 'rgba(255,255,255,0.08)',
                    background: selectedWeekDay === i ? `rgba(132,204,22,0.06)` : 'transparent',
                  }}>
                  <span className="text-2xl">{d.emoji}</span>
                  <span className="text-base font-bold mt-1" style={{ color: selectedWeekDay === i ? meta.color : '#9ca3af' }}>
                    T{d.n}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day detail */}
          {currentDay && (
            <div key={selectedWeekDay} className="transition-all duration-300">
              <div className="flex items-start gap-4 mb-5">
                <span className="text-5xl">{currentDay.emoji}</span>
                <div>
                  <h3 className="text-2xl font-bold text-[#e5e7eb]">{currentDay.label}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-base font-bold px-3 py-1 rounded-full border"
                      style={{
                        color: DAY_TYPE_META[currentDay.type].color,
                        borderColor: `${DAY_TYPE_META[currentDay.type].color}40`,
                        background: `${DAY_TYPE_META[currentDay.type].color}15`,
                      }}>
                      {DAY_TYPE_META[currentDay.type].label}
                    </span>
                    <span className="text-base font-bold px-3 py-1 rounded-full border"
                      style={{ color: '#84cc16', borderColor: 'rgba(132,204,22,0.3)', background: 'rgba(132,204,22,0.08)' }}>
                      🔥 {currentDay.kcal} kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* In-session note for day 6 */}
              {currentDay.inSessionNote && (
                <div className="mb-4 rounded-2xl p-4 border flex items-start gap-3"
                  style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.3)' }}>
                  <span className="text-2xl">🚴</span>
                  <div>
                    <div className="text-base font-bold uppercase tracking-wider mb-1" style={{ color: '#8b5cf6' }}>
                      Nạp Carb Trong Tập — Quan Trọng
                    </div>
                    <p className="text-lg text-[#d1d5db]">{currentDay.inSessionNote}</p>
                  </div>
                </div>
              )}

              {/* Meal list */}
              <div className="space-y-2">
                {currentDay.meals.map((meal, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl px-4 py-3 border transition-colors"
                    style={{
                      background: meal.highlight ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                      borderColor: meal.highlight ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.06)',
                    }}>
                    <span className="text-base font-bold px-2 py-1 rounded-full shrink-0 mt-0.5"
                      style={{
                        color: DAY_TYPE_META[currentDay.type].color,
                        background: `${DAY_TYPE_META[currentDay.type].color}15`,
                      }}>
                      {meal.t}
                    </span>
                    <p className="text-lg text-[#d1d5db] leading-relaxed">{meal.food}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </RevealBlock>

        {/* ── SECTION 9: Carb Cycling Chart ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="text-3xl font-bold text-[#e5e7eb]">Carb Cycling Theo Ngày</h2>
              <p className="text-lg text-[#9ca3af] mt-0.5">Cá nhân hóa cho {b0.w}kg — giá trị trung bình mỗi loại ngày</p>
            </div>
          </div>
          <div className="rounded-3xl p-6 border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}>
            <CarbCyclingChart macros={macros} />
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              {DAY_TYPES.map(dt => (
                <div key={dt.id} className="flex items-center gap-2 text-base">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: dt.color }} />
                  <span className="text-[#9ca3af]">{dt.label}</span>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 10: Meal Prep ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🗂️</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">Meal Prep Cho Người Tập Nhiều</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {MEAL_PREP_ADVANCED.map((prep, pi) => (
              <div key={pi} className="rounded-3xl p-5 border" style={{ borderColor: `${prep.color}30`, background: `${prep.color}08` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{prep.icon}</span>
                  <div>
                    <div className="font-bold" style={{ color: prep.color }}>{prep.day}</div>
                    <div className="text-base text-[#6b7280]">{prep.tasks.length} công việc</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {prep.tasks.map((task, ti) => {
                    const key = `${pi}-${ti}`;
                    const checked = !!mealPrepChecks[key];
                    return (
                      <li key={ti} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCheck(key)}>
                        <div className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all"
                          style={{
                            borderColor: checked ? prep.color : 'rgba(255,255,255,0.2)',
                            background: checked ? prep.color : 'transparent',
                          }}>
                          {checked && <span className="text-white text-base font-bold">✓</span>}
                        </div>
                        <span className="text-lg transition-colors" style={{ color: checked ? '#6b7280' : '#d1d5db', textDecoration: checked ? 'line-through' : 'none' }}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Bộ thực phẩm nền */}
          <div className="rounded-3xl p-5 border" style={{ background: 'rgba(132,204,22,0.04)', borderColor: 'rgba(132,204,22,0.15)' }}>
            <div className="text-lg font-bold uppercase tracking-wider mb-4" style={{ color: '#84cc16' }}>
              📦 Bộ Thực Phẩm Nền
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { group: 'Carb', color: '#f59e0b', items: ['Cơm/gạo lứt', 'Khoai lang', 'Yến mạch', 'Bánh mì nguyên cám', 'Mì gạo/Ý'] },
                { group: 'Protein', color: '#ef4444', items: ['Ức gà', 'Cá hồi/cá ngừ', 'Trứng', 'Đậu hũ', 'Thịt bò nạc'] },
                { group: 'Chất béo', color: '#06b6d4', items: ['Dầu olive', 'Bơ đậu phộng', 'Hạt hỗn hợp', 'Bơ (avocado)', 'Sữa chua Hy Lạp'] },
                { group: 'Rau & Trái cây', color: '#84cc16', items: ['Bông cải xanh', 'Cải bó xôi', 'Chuối', 'Cam/Kiwi', 'Cà chua'] },
              ].map((g, i) => (
                <div key={i}>
                  <div className="text-base font-bold mb-2 uppercase tracking-wider" style={{ color: g.color }}>{g.group}</div>
                  <ul className="space-y-1">
                    {g.items.map((item, j) => (
                      <li key={j} className="text-base text-[#9ca3af] flex items-center gap-1.5">
                        <span style={{ color: g.color }} className="shrink-0">·</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── SECTION 11: Adjustment Rules ── */}
        <RevealBlock className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎚️</span>
            <h2 className="text-3xl font-bold text-[#e5e7eb]">Điều Chỉnh Theo Mục Tiêu</h2>
          </div>
          <div className="space-y-3">
            {ADJUSTMENT_RULES.map((adj, i) => {
              const isOpen = expandedAdj === i;
              return (
                <div key={i} className="rounded-3xl border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isOpen ? `${adj.color}50` : 'rgba(255,255,255,0.08)',
                    background: isOpen ? `${adj.color}08` : 'rgba(255,255,255,0.02)',
                  }}>
                  <button className="w-full flex items-center justify-between p-5" onClick={() => setExpandedAdj(isOpen ? null : i)}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{adj.emoji}</span>
                      <span className="font-bold text-lg text-[#e5e7eb]">{adj.goal}</span>
                    </div>
                    <span className="text-[#6b7280]">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <ul className="space-y-2 mb-4">
                        {adj.rules.map((rule, j) => (
                          <li key={j} className="flex items-start gap-2 text-lg text-[#d1d5db]">
                            <span style={{ color: adj.color }} className="shrink-0 mt-0.5 font-bold">✓</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                      <div className="rounded-2xl px-4 py-3 border text-lg leading-relaxed"
                        style={{ color: adj.color, background: `${adj.color}10`, borderColor: `${adj.color}30` }}>
                        💡 {adj.warning}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealBlock>

        {/* ── SECTION 12: Safety + CTA ── */}
        <RevealBlock>
          <div className="rounded-3xl p-8 border text-center mb-8" style={{ background: 'rgba(132,204,22,0.05)', borderColor: 'rgba(132,204,22,0.2)' }}>
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-3 text-[#e5e7eb]">Lưu ý an toàn</h3>
            <p className="text-lg text-[#9ca3af] leading-relaxed max-w-xl mx-auto mb-6">
              Plan này dựa trên khung dinh dưỡng thể thao khoa học cho người tập đa môn cường độ cao.
              Cơ thể mỗi người khác nhau — theo dõi phản ứng 2–4 tuần trước khi điều chỉnh lớn.
              Nếu có vấn đề sức khỏe nền, hãy tham khảo chuyên gia dinh dưỡng thể thao.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/pillar/b"
                className="px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-200 border"
                style={{ color: '#84cc16', borderColor: 'rgba(132,204,22,0.4)', background: 'rgba(132,204,22,0.08)' }}>
                ← Về Dinh Dưỡng
              </Link>
              <Link to="/pillar/b/7day"
                className="px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-200"
                style={{ background: '#84cc16', color: '#0a0a0a' }}>
                Xem Thực Đơn 7 Ngày Cơ Bản →
              </Link>
            </div>
          </div>
        </RevealBlock>

      </div>
    </div>
  );
}
