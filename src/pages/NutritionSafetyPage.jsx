import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ── constants ── */
const C = '#0ea5e9';
const HEX_RGB = '14,165,233';

const CORE_PRINCIPLES = [
  { icon: '🚫', title: 'Không cực đoan', desc: 'Không nhịn đói kéo dài, không cắt hoàn toàn tinh bột, không "detox", không ép uống nước quá mức, không giảm cân cấp tốc.' },
  { icon: '🏥', title: 'Không thay thế bác sĩ', desc: 'Meal plan chỉ dành cho giáo dục sức khỏe phổ thông. Người có bệnh nền, đang dùng thuốc, mang thai, người cao tuổi yếu cần hỏi chuyên gia.' },
  { icon: '🎯', title: 'Cá nhân hóa theo người dùng', desc: 'Không có một thực đơn đúng cho tất cả. Phải xét tuổi, giới, cân nặng, mục tiêu, mức vận động, bệnh nền, thói quen ăn uống, khả năng tài chính.' },
  { icon: '📅', title: 'Ưu tiên duy trì lâu dài', desc: 'Meal plan an toàn là kế hoạch người dùng có thể làm được trong đời sống thật, không phải kế hoạch "đẹp trên giấy".' },
  { icon: '📊', title: 'Theo dõi phản hồi cơ thể', desc: 'Nếu bị chóng mặt, mệt lả, đau ngực, khó thở, hạ đường huyết, sụt cân nhanh bất thường — cần điều chỉnh hoặc đi khám ngay.' },
];

const TIERS = [
  {
    id: 'green', color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/30',
    label: 'Nhóm Xanh', sub: 'Dùng meal plan phổ thông',
    icon: '✅', badge: 'AN TOÀN',
    desc: 'Người trưởng thành không có bệnh nền nặng, không mang thai, không đang điều trị bệnh cấp tính, không có rối loạn ăn uống, không dị ứng thực phẩm nguy hiểm.',
    can: ['Đĩa ăn dự án', 'Meal plan 7 ngày', 'Meal plan giảm mỡ nhẹ', 'Meal plan tăng cơ cơ bản', 'Meal prep 3 ngày', 'Checklist nutrition hằng ngày'],
  },
  {
    id: 'yellow', color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30',
    label: 'Nhóm Vàng', sub: 'Cần điều chỉnh cẩn thận',
    icon: '⚠️', badge: 'THẬN TRỌNG',
    desc: 'Có ít nhất một yếu tố nguy cơ. Vẫn có thể dùng dự án nhưng phải có phiên bản điều chỉnh, không áp dụng máy móc công thức đại trà.',
    can: ['Tăng huyết áp', 'Đái tháo đường/tiền ĐTĐ', 'Rối loạn mỡ máu', 'Gout/tăng acid uric', 'Gan nhiễm mỡ', 'Viêm dạ dày, IBS', 'Trên 60 tuổi', 'Người tập nhiều'],
  },
  {
    id: 'red', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30',
    label: 'Nhóm Đỏ', sub: 'Không dùng meal plan tự động',
    icon: '🚨', badge: 'ĐI KHÁM TRƯỚC',
    desc: 'Cần đi khám hoặc có hướng dẫn cá nhân hóa từ chuyên gia trước khi áp dụng bất kỳ meal plan nào.',
    can: ['Bệnh thận mạn, đang lọc máu', 'Suy tim, bệnh mạch vành', 'Đái tháo đường dùng insulin', 'Phụ nữ mang thai/cho con bú', 'Trẻ em, thanh thiếu niên', 'Rối loạn ăn uống', 'Sụt cân nhanh không rõ nguyên nhân', 'Sau phẫu thuật, điều trị ung thư'],
  },
];

const MACRO_RULES = [
  {
    macro: 'Protein', icon: '🥩', color: '#f97316',
    safe: 'Mỗi bữa chính 1 nguồn đạm. Người tập nặng có thể dùng mức cao hơn.',
    caution: 'Người bệnh thận, suy thận, gout nặng hoặc có chỉ định hạn chế đạm — không tự áp dụng mức protein cao.',
    tip: '~1.6–2.2g/kg/ngày cho người tập nặng, ~1.0–1.2g/kg cho người ít vận động.',
  },
  {
    macro: 'Carbohydrate', icon: '🍚', color: '#eab308',
    safe: 'Không cắt sạch tinh bột. Carb là nguồn năng lượng chính cho người tập cardio.',
    caution: 'Người đái tháo đường: kiểm soát loại carb, lượng carb, thời điểm ăn và thuốc đang dùng — không tự áp dụng thực đơn carb cao.',
    tip: 'Tăng carb quanh buổi tập. Ưu tiên gạo, khoai, yến mạch, ngũ cốc nguyên hạt.',
  },
  {
    macro: 'Chất béo', icon: '🥑', color: '#10b981',
    safe: 'Không dùng chế độ "zero fat". Chất béo cần cho hormone và hấp thu vitamin tan trong dầu.',
    caution: 'Hạn chế đồ chiên ngập dầu, mỡ trans, bánh kẹo công nghiệp. Chất béo bão hòa < 10% tổng năng lượng.',
    tip: 'Ưu tiên cá béo, trứng, hạt, bơ, dầu olive/thực vật phù hợp.',
  },
];

const STORAGE_RULES = [
  {
    step: 'CLEAN', icon: '🫧', color: '#06b6d4', title: 'Làm Sạch',
    items: ['Rửa tay trước khi nấu', 'Rửa dao, thớt, hộp đựng', 'Rửa rau dưới vòi nước sạch', 'Không dùng khăn bẩn lau cả thịt sống và đồ chín'],
  },
  {
    step: 'SEPARATE', icon: '🔪', color: '#8b5cf6', title: 'Tách Sống/Chín',
    items: ['Thớt thịt sống riêng với rau ăn sống', 'Không để nước thịt sống chảy vào thức ăn đã nấu', 'Hộp đồ chín để riêng'],
  },
  {
    step: 'COOK', icon: '🍳', color: '#f97316', title: 'Nấu Chín',
    items: ['Thịt, cá, trứng, hải sản phải nấu chín phù hợp', 'Không meal-prep "nấu tái rồi để 3 ngày" với nhóm nguy cơ cao', 'Hâm lại kỹ trước khi ăn nếu món cần ăn nóng'],
  },
  {
    step: 'CHILL', icon: '❄️', color: '#0ea5e9', title: 'Làm Lạnh',
    items: ['Chia hộp nhỏ để nguội nhanh rồi cho vào tủ lạnh', 'Không để cơm, thịt, cá, trứng, sữa ngoài bàn cả buổi', 'Đồ ăn để ngoài tối đa 2 giờ'],
  },
];

const DANGER_SIGNS = [
  '😰 Đau ngực, tức ngực, đau lan tay/hàm/lưng',
  '🫁 Khó thở nhiều, khó thở khi nghỉ',
  '😵 Ngất, gần ngất, chóng mặt nặng',
  '💓 Hồi hộp trống ngực kéo dài',
  '🧠 Yếu liệt, nói khó, méo miệng',
  '🤢 Nôn ói kéo dài, tiêu chảy mất nước',
  '😨 Dị ứng nặng: phù môi/lưỡi, khó thở, mề đay toàn thân',
  '⚖️ Sụt cân nhanh không chủ ý',
  '😩 Mệt lả kéo dài sau khi giảm kcal',
  '🩸 Mất kinh/rối loạn kinh nguyệt sau ăn kiêng/tập nặng',
  '😟 Ám ảnh cân nặng, sợ ăn, ăn rồi tự gây nôn',
];

const DONT_DO = [
  { icon: '💊', text: 'Dùng lợi tiểu, thuốc xổ, trà giảm cân' },
  { icon: '🏋️', text: 'Tập nặng khi ăn quá ít' },
  { icon: '📦', text: 'Meal-prep quá 4 ngày trong tủ lạnh mà không đông lạnh' },
  { icon: '🌡️', text: 'Ăn đồ đã để ngoài nhiều giờ' },
  { icon: '🫀', text: 'Dùng thực đơn protein cao cho người bệnh thận' },
  { icon: '🩺', text: 'Dùng thực đơn carb cao cho người đái tháo đường mà không kiểm soát' },
  { icon: '🤥', text: 'Hứa hẹn chữa bệnh bằng thực phẩm' },
  { icon: '😰', text: 'Biến việc ăn uống thành nỗi sợ' },
  { icon: '🧃', text: 'Detox nước ép để giảm cân' },
  { icon: '🍗', text: 'Ăn toàn ức gà, rau luộc, khoai lang kéo dài' },
  { icon: '⚡', text: 'Cắt sạch tinh bột' },
  { icon: '💉', text: 'Uống thuốc giảm cân không rõ nguồn gốc' },
];

const GOOD_MESSAGES = [
  { bad: '"Ăn món này là tội lỗi."', good: '"Ăn đủ để sống khỏe."' },
  { bad: '"Muốn đẹp thì phải chịu đói."', good: '"Giảm mỡ là quá trình."' },
  { bad: '"Cắt sạch tinh bột."', good: '"Không cần hoàn hảo, cần đều."' },
  { bad: '"Không được ăn sau 18h."', good: '"80% nền tảng, 20% linh hoạt."' },
  { bad: '"Phải đốt hết kcal đã ăn."', good: '"Một bữa lệch không phá hỏng cả hành trình."' },
];

const DAILY_CHECKS = [
  'Hôm nay tôi có ăn đủ ít nhất 2–3 bữa chính không?',
  'Mỗi bữa chính có đạm không?',
  'Tôi có ăn rau/trái cây không?',
  'Tôi có uống đủ nước không?',
  'Tôi có bị chóng mặt, run tay, đói lả không?',
  'Tôi có tập tụt sức bất thường không?',
  'Tôi có ngủ quá kém không?',
  'Tôi có bị đau bụng, tiêu chảy, trào ngược nhiều hơn không?',
  'Tôi có đang quá ám ảnh kcal/cân nặng không?',
  'Tôi có cần điều chỉnh thay vì ép bản thân không?',
];

const WEEKLY_CHECKS = [
  'Cân nặng thay đổi có quá nhanh không?',
  'Vòng eo thay đổi thế nào?',
  'Sức tập tăng, giữ hay giảm?',
  'Mức đói từ 1–10?',
  'Giấc ngủ có xấu đi không?',
  'Tâm trạng có cáu gắt/mệt mỏi hơn không?',
  'Tiêu hóa có ổn không?',
  'Có bỏ bữa nhiều không?',
  'Có binge eating sau vài ngày ăn kiêng không?',
  'Có dấu hiệu cần chuyển nhóm vàng/đỏ không?',
];

const CONDITIONS = [
  {
    name: 'Tăng Huyết Áp', icon: '❤️', color: '#ef4444',
    rules: ['Giảm món quá mặn', 'Hạn chế đồ hộp, mì gói, snack, nước chấm nhiều', 'Không tự dùng nước điện giải nhiều natri hằng ngày', 'Theo dõi huyết áp khi thay đổi ăn uống/tập luyện'],
  },
  {
    name: 'Đái Tháo Đường', icon: '🩸', color: '#f97316',
    rules: ['Không bỏ bữa tùy tiện', 'Không cắt carb cực đoan khi đang dùng thuốc', 'Có kế hoạch carb quanh buổi tập', 'Theo dõi đường huyết theo hướng dẫn điều trị'],
  },
  {
    name: 'Bệnh Thận', icon: '🫁', color: '#8b5cf6',
    rules: ['Không tự áp dụng protein cao', 'Không dùng bột protein/supplement khoáng chất liều cao', 'Không dùng chế độ keto', 'Cá nhân hóa theo mức lọc cầu thận, kali, phospho'],
  },
  {
    name: 'Gout/Acid Uric', icon: '🦴', color: '#eab308',
    rules: ['Thận trọng với nội tạng', 'Hạn chế hải sản nhiều purine', 'Hạn chế bia rượu', 'Hạn chế nước ngọt/fructose cao', 'Tránh giảm cân quá nhanh'],
  },
  {
    name: 'Rối Loạn Tiêu Hóa', icon: '🫃', color: '#14b8a6',
    rules: ['Không ép ăn nhiều rau sống đột ngột', 'Không nhiều sữa nếu không dung nạp lactose', 'Không nhiều chất xơ đột ngột', 'Trào ngược, IBS, viêm dạ dày cần meal plan riêng'],
  },
];

/* ── helpers ── */
function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
      {icon && <span className="text-3xl">{icon}</span>}
      <span style={{ color: C }}>{children}</span>
    </h2>
  );
}

/* ── B0 banner ── */
function PersonalizedBanner() {
  const [data, setData] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('healthapp_b0_inputs');
      if (!raw) return;
      const b0 = JSON.parse(raw);
      const { weight = 70, height = 170, age = 30, sex = 'male', goal = 'maintain', activity = 1.55 } = b0;
      const bmr = sex === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
      const tdee = Math.round(bmr * activity);
      const goalMap = { cut: 0.85, maintain: 1, bulk: 1.10 };
      const kcal = Math.round(tdee * (goalMap[goal] ?? 1));
      const group = weight < 60 ? 'green' : weight < 90 ? 'green' : 'yellow';
      setData({ weight, height, age, sex, goal, kcal, group });
    } catch {}
  }, []);
  if (!data) return null;
  const tier = TIERS.find(t => t.id === data.group);
  return (
    <div className="mb-8 rounded-2xl p-5 border" style={{ borderColor: `rgba(${HEX_RGB},0.25)`, background: `rgba(${HEX_RGB},0.05)` }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">🧑‍⚕️</span>
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: C }}>Hồ sơ cá nhân của bạn</p>
          <p className="text-gray-300 text-sm">
            {data.weight} kg · {data.height} cm · {data.age} tuổi · {data.sex === 'male' ? 'Nam' : 'Nữ'} → TDEE-adjusted: <span className="font-bold text-white">{data.kcal} kcal</span>
          </p>
          <p className="text-xs mt-1" style={{ color: tier.color }}>
            {tier.icon} Phân tầng gợi ý: <strong>{tier.label}</strong> — {tier.sub}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── storage timer visual ── */
function StorageTimer() {
  const zones = [
    { label: '0–2h', color: '#22c55e', status: 'AN TOÀN', desc: 'Thức ăn vừa nấu xong, an toàn ở nhiệt độ phòng.' },
    { label: '2–4h', color: '#eab308', status: 'CẢNH BÁO', desc: 'Vi khuẩn bắt đầu sinh sôi. Nên cho vào tủ lạnh ngay.' },
    { label: '4–24h', color: '#ef4444', status: 'NGUY HIỂM', desc: 'Vùng nguy hiểm. Tủ lạnh ngăn mát hoặc bỏ đi.' },
    { label: '1–3 ngày', color: '#6366f1', status: 'TỦ LẠNH', desc: 'Bảo quản ngăn mát đúng cách — an toàn nhất.' },
    { label: '4 ngày+', color: '#0ea5e9', status: 'ĐÔNG LẠNH', desc: 'Nếu chưa ăn đến ngày 4, nên đông lạnh ngay.' },
  ];
  return (
    <div className="rounded-2xl p-6 border border-sky-500/20 bg-sky-500/5">
      <h3 className="text-lg font-bold text-white mb-4">⏱️ Vòng Đời An Toàn Thực Phẩm</h3>
      <div className="flex flex-col gap-3">
        {zones.map((z, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-24 text-xs font-mono font-bold shrink-0" style={{ color: z.color }}>{z.label}</div>
            <div className="flex-1 h-6 rounded-full relative overflow-hidden bg-white/5">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${[20,40,70,85,100][i]}%`, backgroundColor: z.color, opacity: 0.7 }} />
            </div>
            <div className="w-28 text-xs shrink-0">
              <span className="font-bold" style={{ color: z.color }}>{z.status}</span>
              <p className="text-gray-400 text-[10px] leading-tight mt-0.5 hidden md:block">{z.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">Nguồn: FoodSafety.gov & USDA FSIS — quy tắc 2 giờ + 3–4 ngày</p>
    </div>
  );
}

/* ── interactive daily checklist ── */
function DailyChecklist() {
  const [checked, setChecked] = useState({});
  const toggle = useCallback((i) => setChecked(p => ({ ...p, [i]: !p[i] })), []);
  const count = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((count / DAILY_CHECKS.length) * 100);
  return (
    <div className="rounded-2xl p-6 border border-sky-500/20 bg-sky-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">☀️ Checklist Hằng Ngày</h3>
        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${HEX_RGB},0.15)`, color: C }}>{count}/{DAILY_CHECKS.length} · {pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 mb-5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(to right, #0ea5e9, #38bdf8)` }} />
      </div>
      <div className="space-y-2">
        {DAILY_CHECKS.map((q, i) => (
          <label key={i} className="flex items-start gap-3 cursor-pointer group select-none">
            <div
              onClick={() => toggle(i)}
              className="w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all"
              style={{ borderColor: checked[i] ? C : 'rgba(255,255,255,0.2)', background: checked[i] ? C : 'transparent' }}
            >
              {checked[i] && <svg viewBox="0 0 10 8" className="w-3 h-3"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
            </div>
            <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? 'text-gray-400 line-through' : 'text-gray-300'}`}>{q}</span>
          </label>
        ))}
      </div>
      {pct === 100 && (
        <div className="mt-4 p-3 rounded-xl text-center text-sm font-bold" style={{ background: `rgba(${HEX_RGB},0.15)`, color: C }}>
          🎉 Tuyệt vời! Bạn đã hoàn thành tất cả kiểm tra hôm nay!
        </div>
      )}
    </div>
  );
}

/* ── weekly checklist ── */
function WeeklyChecklist() {
  const [ratings, setRatings] = useState({});
  const rate = (i, v) => setRatings(p => ({ ...p, [i]: p[i] === v ? null : v }));
  const bad = Object.values(ratings).filter(v => v === 'bad').length;
  return (
    <div className="rounded-2xl p-6 border border-sky-500/20 bg-sky-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">📅 Đánh Giá Hằng Tuần</h3>
        {bad >= 3 && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-500/20 text-red-400">⚠️ {bad} chỉ số xấu — giảm độ khó!</span>
        )}
      </div>
      <div className="space-y-3">
        {WEEKLY_CHECKS.map((q, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm text-gray-300 flex-1">{q}</span>
            <div className="flex gap-1 shrink-0">
              {[['good', '👍', '#22c55e'], ['ok', '😐', '#eab308'], ['bad', '👎', '#ef4444']].map(([v, lbl, col]) => (
                <button key={v} onClick={() => rate(i, v)}
                  className="w-8 h-8 rounded-lg text-sm transition-all"
                  style={{ background: ratings[i] === v ? `${col}30` : 'rgba(255,255,255,0.05)', border: `1px solid ${ratings[i] === v ? col : 'transparent'}` }}
                >{lbl}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {bad >= 3 && (
        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <span className="text-red-400 font-bold">Cần điều chỉnh:</span>
          <span className="text-gray-300"> {bad}+ chỉ số xấu liên tục → giảm độ khó meal plan, tăng kcal hoặc tham khảo chuyên gia.</span>
        </div>
      )}
    </div>
  );
}

/* ── main page ── */
export default function NutritionSafetyPage() {
  const [activeTier, setActiveTier] = useState('green');
  const [flipMsg, setFlipMsg] = useState(null);

  useEffect(() => {
    const id = 'sf-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --sf-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes sfOrbitSpin { to { --sf-orbit-angle: 360deg; } }
      .sf-orbit-ring {
        background: conic-gradient(
          from var(--sf-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${HEX_RGB},0.0) 65deg, rgba(${HEX_RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${HEX_RGB},0.75) 99deg,
          rgba(${HEX_RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: sfOrbitSpin 3.5s linear infinite;
      }
      @keyframes animFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      .animate-float { animation: animFloat 3s ease-in-out infinite; }
      @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .animate-fade-in-up { animation: fadeInUp .6s ease both; }
      @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(${HEX_RGB},0.4)} 50%{box-shadow:0 0 20px 6px rgba(${HEX_RGB},0.15)} }
      .animate-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const activeTierData = TIERS.find(t => t.id === activeTier);

  return (
    <main className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      {/* breadcrumb */}
      <Link to="/pillar/b" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-sky-400 transition-colors mb-8">
        ← Dinh dưỡng & Thực đơn
      </Link>

      {/* hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${HEX_RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shrink-0 animate-float border"
          style={{ background: '#0f172a', borderColor: `rgba(${HEX_RGB},0.2)` }}>🛡️</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in-up">Quy Tắc An Toàn</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: C, background: `rgba(${HEX_RGB},0.1)`, borderColor: `rgba(${HEX_RGB},0.2)` }}>
            Module XV · Safety Rules
          </span>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            Bộ quy tắc an toàn cho toàn bộ dự án Nutrition & Meal Plans — từ phân tầng người dùng, nguyên tắc dinh dưỡng đến bảo quản thực phẩm và dấu hiệu cần đi khám ngay.
          </p>
        </div>
      </div>

      {/* hero image */}
      <div className="sf-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
            alt="Safety" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: C, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${HEX_RGB},0.2)` }}>
              🛡️ An toàn là ưu tiên số 1
            </span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)' }} />

      {/* B0 banner */}
      <PersonalizedBanner />

      {/* core mantra */}
      <RevealBlock className="mb-12">
        <div className="rounded-3xl p-8 text-center border animate-pulse-glow" style={{ background: `rgba(${HEX_RGB},0.06)`, borderColor: `rgba(${HEX_RGB},0.2)` }}>
          <div className="text-4xl mb-4">💡</div>
          <blockquote className="text-xl md:text-2xl font-bold text-white leading-relaxed italic mb-3">
            "Ăn đủ, ăn thật, ăn phù hợp mục tiêu,<br />bảo quản đúng, không cực đoan,<br />theo dõi phản hồi cơ thể và đi khám khi có dấu hiệu nguy hiểm."
          </blockquote>
          <p className="text-sm" style={{ color: C }}>— Kim chỉ nam của dự án Nutrition & Meal Plans</p>
        </div>
      </RevealBlock>

      {/* 1. core principles */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="📌">5 Nguyên Tắc An Toàn Cốt Lõi</SectionTitle>
        <div className="space-y-4">
          {CORE_PRINCIPLES.map((p, i) => (
            <div key={i} className="flex gap-4 rounded-2xl p-5 border border-white/5 bg-white/[0.02] hover:border-sky-500/20 transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform" style={{ background: `rgba(${HEX_RGB},0.1)` }}>{p.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ background: `rgba(${HEX_RGB},0.15)`, color: C }}>{i + 1}</span>
                  <h3 className="font-bold text-white">{p.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 2. tiers */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🚦">Phân Tầng An Toàn Người Dùng</SectionTitle>
        <p className="text-gray-400 text-sm mb-6">Trước khi áp dụng meal plan, xác định bạn thuộc nhóm nào để chọn mức độ phù hợp.</p>
        <div className="flex gap-2 mb-6 flex-wrap">
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setActiveTier(t.id)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: activeTier === t.id ? t.color : 'rgba(255,255,255,0.05)',
                color: activeTier === t.id ? '#000' : t.color,
                border: `1px solid ${t.color}50`
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {activeTierData && (
          <div className={`rounded-2xl p-6 border ${activeTierData.bg} ${activeTierData.border} transition-all`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{activeTierData.icon}</span>
              <div>
                <h3 className="font-bold text-white text-lg">{activeTierData.label}</h3>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                  style={{ background: `${activeTierData.color}20`, color: activeTierData.color }}>{activeTierData.badge}</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{activeTierData.desc}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activeTierData.can.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <span style={{ color: activeTierData.color }}>•</span> {c}
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealBlock>

      {/* 3. energy rules */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="⚡">Quy Tắc An Toàn Năng Lượng</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { title: 'Giảm mỡ', icon: '📉', rule: 'Giảm 10–15% TDEE cho người mới. Tối đa 20% nếu vẫn đủ sức tập, ngủ tốt.', color: '#22c55e' },
            { title: 'Tăng cơ', icon: '📈', rule: 'Thặng dư nhẹ 5–10% TDEE. Không "bulk bẩn". Theo dõi vòng eo và sức mạnh.', color: '#f97316' },
            { title: 'Chỉ số theo dõi', icon: '📊', rule: 'Cân nặng 7 ngày, vòng eo, mức đói/no, năng lượng tập, giấc ngủ & tâm trạng.', color: C },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: item.color }}>{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.rule}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
          <p className="text-sm text-amber-300"><strong>📌 CDC/NIH:</strong> Giảm cân từ từ ~0.5–1 kg/tuần bền vững hơn giảm nhanh. Thường đạt được với mức âm khoảng 500 kcal/ngày.</p>
        </div>
      </RevealBlock>

      {/* 4. macro rules */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🔬">Quy Tắc An Toàn Macro</SectionTitle>
        <div className="space-y-4">
          {MACRO_RULES.map((m, i) => (
            <div key={i} className="rounded-2xl p-6 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="text-lg font-bold text-white">{m.macro}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl p-4 bg-green-500/5 border border-green-500/20">
                  <p className="text-xs font-bold text-green-400 mb-1">✅ Nguyên tắc dự án</p>
                  <p className="text-sm text-gray-300">{m.safe}</p>
                </div>
                <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/20">
                  <p className="text-xs font-bold text-red-400 mb-1">⚠️ Thận trọng với</p>
                  <p className="text-sm text-gray-300">{m.caution}</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl p-3 border" style={{ borderColor: `rgba(${HEX_RGB},0.2)`, background: `rgba(${HEX_RGB},0.05)` }}>
                <p className="text-xs" style={{ color: C }}>💡 {m.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 5. plate rule */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🍽️">Đĩa Ăn Dự Án — Công Cụ Mặc Định</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">Đĩa ăn dự án an toàn hơn việc bắt người mới cân đo mọi thứ. Đây là công cụ mặc định.</p>
            <div className="space-y-3">
              {[
                { pct: '1/2', label: 'Rau & củ', desc: 'Rau, củ, canh, salad, trái cây ít ngọt', color: '#22c55e' },
                { pct: '1/4', label: 'Đạm', desc: 'Cá, thịt nạc, trứng, đậu hũ, sữa chua', color: '#f97316' },
                { pct: '1/4', label: 'Tinh bột', desc: 'Cơm, khoai, bún, phở, mì, yến mạch', color: '#eab308' },
                { pct: '+', label: 'Chất béo tốt', desc: 'Lượng nhỏ: dầu olive, hạt, bơ', color: '#06b6d4' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-10 text-center font-bold text-sm" style={{ color: item.color }}>{item.pct}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: ['50%','25%','25%','10%'][i], backgroundColor: item.color }} />
                  </div>
                  <div className="w-40">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
            <h3 className="font-bold text-white mb-3">Điều chỉnh theo mục tiêu</h3>
            <div className="space-y-3">
              {[
                { goal: '🔻 Giảm mỡ', rule: 'Giữ 1/2 đĩa rau, đủ đạm, giảm nhẹ tinh bột/chất béo nếu tổng kcal cao.' },
                { goal: '💪 Tăng cơ', rule: 'Giữ rau, tăng đạm và thêm tinh bột quanh buổi tập.' },
                { goal: '🚴 Sức bền', rule: 'Không cắt carb; tăng carb trước/sau buổi tập dài.' },
                { goal: '⏰ Bận rộn', rule: '"Mỗi bữa có rau + đạm + tinh bột vừa đủ" — không cần cân đo.' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-3 bg-white/[0.02]">
                  <p className="text-sm font-bold text-white mb-1">{item.goal}</p>
                  <p className="text-xs text-gray-400">{item.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* 6. storage */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🧊">Quy Tắc An Toàn Meal-Prep & Bảo Quản</SectionTitle>
        <p className="text-gray-400 text-sm mb-6">4 nguyên tắc nền từ FoodSafety.gov: <strong className="text-white">Clean → Separate → Cook → Chill</strong></p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {STORAGE_RULES.map((r, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <span className="text-xs font-bold font-mono" style={{ color: r.color }}>{r.step}</span>
                  <h3 className="font-bold text-white">{r.title}</h3>
                </div>
              </div>
              <ul className="space-y-1">
                {r.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                    <span style={{ color: r.color }}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <StorageTimer />
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 border border-red-500/20 bg-red-500/5">
            <h4 className="font-bold text-red-400 mb-2">🚫 Bỏ ngay nếu:</h4>
            <div className="space-y-1">
              {['Mùi chua/lạ', 'Nhớt', 'Mốc', 'Hộp phồng', 'Cơm/sốt để ngoài lâu', 'Không nhớ nấu ngày nào'].map((s, i) => (
                <p key={i} className="text-xs text-gray-400 flex items-center gap-2"><span className="text-red-400">✕</span> {s}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-4 border border-sky-500/20 bg-sky-500/5">
            <h4 className="font-bold mb-2" style={{ color: C }}>📦 Quy tắc 3–4 ngày</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p>• <strong className="text-white">Tủ lạnh ngăn mát:</strong> tối đa 3 ngày — an toàn nhất</p>
              <p>• <strong className="text-white">Ngày 4:</strong> chỉ dùng nếu bảo quản tốt, không mùi/vị lạ</p>
              <p>• <strong className="text-white">5–7 ngày:</strong> nên chia phần đông lạnh</p>
              <p>• <strong className="text-white">Đông lạnh:</strong> giữ 3–4 tháng (USDA FSIS)</p>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* 7. conditions */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🏥">An Toàn Cho Bệnh Nền Thường Gặp</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONDITIONS.map((c, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="font-bold text-white">{c.name}</h3>
              </div>
              <ul className="space-y-1">
                {c.rules.map((r, j) => (
                  <li key={j} className="text-xs text-gray-400 flex items-start gap-2">
                    <span style={{ color: c.color }}>▸</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 8. exercise safety */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🏃">An Toàn Khi Kết Hợp Ăn & Tập</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {[
            { phase: '⚡ Trước tập', color: '#eab308', rules: ['Không tập nặng khi quá đói/chóng mặt/thiếu ngủ', 'Buổi tập dài nên có carb dễ tiêu', 'Không ăn quá no sát giờ tập'] },
            { phase: '🏋️ Trong tập', color: C, rules: ['Uống nước theo khát và thời lượng tập', 'Dừng ngay nếu đau ngực, khó thở bất thường, choáng'] },
            { phase: '🍽️ Sau tập', color: '#22c55e', rules: ['Có bữa gồm protein + carb', 'Không "tập xong nhịn luôn" như chiến lược giảm mỡ', 'Bổ sung điện giải nếu tập > 90 phút'] },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
              <h3 className="font-bold mb-3" style={{ color: p.color }}>{p.phase}</h3>
              <ul className="space-y-2">
                {p.rules.map((r, j) => (
                  <li key={j} className="text-xs text-gray-400 flex items-start gap-2"><span style={{ color: p.color }}>•</span>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
          <h4 className="font-bold text-amber-300 mb-2">⚠️ Dấu hiệu meal plan không đủ cho người tập nhiều:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Tập tụt sức liên tục', 'Đói cồn cào về đêm', 'Mất ngủ', 'Chuột rút nhiều', 'Cáu gắt dễ', 'Nhịp tim nghỉ tăng', 'Đau cơ kéo dài', 'Sụt cân quá nhanh', 'Thèm ngọt mất kiểm soát'].map((s, i) => (
              <p key={i} className="text-xs text-gray-400 flex items-center gap-1"><span className="text-amber-400">▸</span>{s}</p>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* 9. danger signs */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🚨">Dừng Ngay & Đi Khám Khi Có Dấu Hiệu</SectionTitle>
        <div className="rounded-3xl p-6 border border-red-500/30 bg-red-500/5">
          <p className="text-sm text-red-300 mb-4 font-semibold">Dừng meal plan/tập luyện và đến cơ sở y tế ngay nếu xuất hiện bất kỳ dấu hiệu nào dưới đây:</p>
          <div className="grid md:grid-cols-2 gap-3">
            {DANGER_SIGNS.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3 bg-red-500/10 border border-red-500/20">
                <span className="text-sm text-gray-200">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl p-4 bg-white/5 border border-white/10 text-center">
            <p className="text-sm text-gray-300">Nguồn: <span className="text-white font-semibold">American Heart Association · ADA · WHO</span></p>
          </div>
        </div>
      </RevealBlock>

      {/* 10. messaging */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="💬">Chống Rối Loạn Ăn Uống — Thông Điệp Đúng</SectionTitle>
        <p className="text-gray-400 text-sm mb-6">Dự án sống khỏe không được biến thành dự án ám ảnh hình thể. Nhấn vào thẻ để xem thông điệp tích cực thay thế.</p>
        <div className="space-y-3">
          {GOOD_MESSAGES.map((m, i) => (
            <div key={i}
              className="cursor-pointer rounded-2xl border overflow-hidden transition-all"
              style={{ borderColor: flipMsg === i ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.3)' }}
              onClick={() => setFlipMsg(flipMsg === i ? null : i)}>
              <div className={`p-4 transition-all ${flipMsg === i ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{flipMsg === i ? '✅' : '❌'}</span>
                  <p className="text-sm font-medium" style={{ color: flipMsg === i ? '#22c55e' : '#ef4444' }}>
                    {flipMsg === i ? m.good : m.bad}
                  </p>
                  <span className="ml-auto text-xs text-gray-500">{flipMsg === i ? 'ĐÚNG ↑' : 'SAI ↓'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 11. dont do */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="🚫">Bộ Quy Tắc "Không Làm" Của Dự Án</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {DONT_DO.map((d, i) => (
            <div key={i} className="rounded-2xl p-4 border border-red-500/20 bg-red-500/5 flex items-start gap-3 hover:border-red-500/40 transition-all">
              <span className="text-2xl">{d.icon}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 12. checklists */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="✅">Checklist Tự Kiểm Tra</SectionTitle>
        <div className="grid md:grid-cols-2 gap-6">
          <DailyChecklist />
          <WeeklyChecklist />
        </div>
      </RevealBlock>

      {/* 13. pre-meal-plan checklist */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="📋">Checklist Trước Khi Cấp Meal Plan</SectionTitle>
        <p className="text-gray-400 text-sm mb-4">Cần hỏi tối thiểu 13 thông tin trước khi đưa ra kế hoạch ăn uống cá nhân hóa:</p>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            ['👤', 'Tuổi, giới, chiều cao, cân nặng'],
            ['🎯', 'Mục tiêu: giảm mỡ, tăng cơ, duy trì, sức bền'],
            ['🏃', 'Mức vận động hiện tại'],
            ['🏥', 'Bệnh nền'],
            ['💊', 'Thuốc đang dùng'],
            ['🤧', 'Dị ứng thực phẩm'],
            ['🫃', 'Vấn đề tiêu hóa'],
            ['⏰', 'Lịch làm việc/ngủ'],
            ['👨‍🍳', 'Khả năng nấu ăn'],
            ['💰', 'Ngân sách'],
            ['🚫', 'Món không ăn được'],
            ['⚠️', 'Tiền sử rối loạn ăn uống hoặc ăn kiêng cực đoan'],
            ['🤰', 'Có đang mang thai/cho con bú không'],
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl p-3 border border-white/5 bg-white/[0.02]">
              <span className="text-xl">{icon}</span>
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl p-4 border border-amber-500/20 bg-amber-500/5">
          <p className="text-sm text-amber-300"><strong>⚠️ Quan trọng:</strong> Nếu thiếu thông tin bệnh nền, thuốc, dị ứng hoặc triệu chứng nguy hiểm — không nên đưa meal plan cá nhân hóa sâu.</p>
        </div>
      </RevealBlock>

      {/* 14. social content rules */}
      <RevealBlock className="mb-12">
        <SectionTitle icon="📱">Quy Tắc An Toàn Truyền Thông</SectionTitle>
        <p className="text-gray-400 text-sm mb-4">Mỗi video hoặc bài viết Nutrition nên có 3 lớp an toàn:</p>
        <div className="space-y-4">
          {[
            {
              layer: 'Lớp 1', icon: '📢', color: C, title: 'Câu Nhắc Phạm Vi',
              content: '"Đây là hướng dẫn phổ thông cho người khỏe mạnh. Nếu bạn có bệnh nền, đang dùng thuốc, mang thai hoặc có dị ứng thực phẩm, hãy hỏi bác sĩ/chuyên gia dinh dưỡng trước."',
            },
            {
              layer: 'Lớp 2', icon: '🚫', color: '#ef4444', title: 'Không Hứa Kết Quả Phi Thực Tế',
              content: 'Không nói: "Giảm 10 kg trong 2 tuần" · "Ăn món này hết mỡ bụng" · "Công thức này chữa tiểu đường" · "Detox gan/thận" · "Không cần tập vẫn giảm mỡ thần tốc"',
            },
            {
              layer: 'Lớp 3', icon: '🔄', color: '#22c55e', title: 'Luôn Có Phương Án Thay Thế',
              content: 'Không ăn sữa → sữa chua không lactose/đậu hũ/trứng · Không ăn thịt → đậu hũ, đậu lăng, tempeh · Không có thời gian → cơm + trứng + rau luộc + cá hộp ít muối',
            },
          ].map((l, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{l.icon}</span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: l.color }}>{l.layer}</span>
                <h3 className="font-bold text-white">{l.title}</h3>
              </div>
              <p className="text-sm text-gray-400 italic leading-relaxed">{l.content}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* closing CTA */}
      <RevealBlock>
        <div className="rounded-3xl p-8 border text-center" style={{ borderColor: `rgba(${HEX_RGB},0.25)`, background: `rgba(${HEX_RGB},0.05)` }}>
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold text-white mb-3">An Toàn Là Nền Tảng Của Mọi Kế Hoạch</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            Bộ quy tắc này nên được đặt ở đầu mọi tài liệu Nutrition, lặp lại trong template meal plan, checklist hằng ngày và video social để đảm bảo dự án không gây hại cho người dùng.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/pillar/b/checklist" className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ background: `rgba(${HEX_RGB},0.15)`, color: C, border: `1px solid rgba(${HEX_RGB},0.3)` }}>
              ✅ Checklist Dinh Dưỡng
            </Link>
            <Link to="/pillar/b/template" className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' }}>
              📋 Template Meal Plan
            </Link>
            <Link to="/pillar/b" className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-400 border border-white/10 hover:text-white transition-all">
              ← Về Dinh Dưỡng
            </Link>
          </div>
        </div>
      </RevealBlock>
    </main>
  );
}
