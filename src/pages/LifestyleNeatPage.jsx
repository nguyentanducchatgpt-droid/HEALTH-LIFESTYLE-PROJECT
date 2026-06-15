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
  { activity: 'Đứng làm việc 4 tiếng', kcal: '+50–100', icon: '🧍' },
  { activity: 'Đi bộ 10.000 bước', kcal: '+300–400', icon: '🚶' },
  { activity: 'Đi cầu thang 10 phút', kcal: '+60–80', icon: '🪜' },
  { activity: 'Dọn nhà 30 phút', kcal: '+80–120', icon: '🧹' },
  { activity: 'Đi bộ sau 3 bữa ăn (5+10+15p)', kcal: '+80–120', icon: '🍽️' },
  { activity: 'Fidgeting/đung đưa chân', kcal: '+20–50', icon: '💫' },
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
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{a.icon}</span>
                <span className="text-lg font-semibold text-text">{a.activity}</span>
              </div>
              <span className="text-lg font-bold tabular-nums" style={{ color: COLOR }}>{a.kcal} kcal</span>
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
