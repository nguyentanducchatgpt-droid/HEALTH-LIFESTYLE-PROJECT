import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ── RevealBlock ──────────────────────────────────────────────────────────────
function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(22px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Pillar colours ───────────────────────────────────────────────────────────
const PC = {
  A: { c:'#22c55e', bg:'rgba(34,197,94,0.08)',   br:'rgba(34,197,94,0.22)',   t:'text-green-400',  l:'Vận Động',   icon:'🏃' },
  B: { c:'#84cc16', bg:'rgba(132,204,22,0.08)',  br:'rgba(132,204,22,0.22)',  t:'text-lime-400',   l:'Dinh Dưỡng', icon:'🥗' },
  C: { c:'#14b8a6', bg:'rgba(20,184,166,0.08)',  br:'rgba(20,184,166,0.22)',  t:'text-teal-400',   l:'Lối Sống',   icon:'🌿' },
  D: { c:'#a855f7', bg:'rgba(168,85,247,0.08)',  br:'rgba(168,85,247,0.22)',  t:'text-purple-400', l:'Tâm Trí',    icon:'🧘' },
  F: { c:'#f97316', bg:'rgba(249,115,22,0.08)',  br:'rgba(249,115,22,0.22)',  t:'text-orange-400', l:'Công Cụ',    icon:'🛠️' },
};

// ── 7-Day data ───────────────────────────────────────────────────────────────
const SEVEN_DAYS = [
  {
    n:1, theme:'Bắt Đầu Nhẹ — Đặt Nền Tảng', emoji:'🌱', tag:'Ngày Khởi Động',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70',
    A:{ title:'Học 6 Chuyển Động Cơ Bản', detail:'Squat · Hinge · Push · Pull · Core · Thở', time:'20 phút', note:'Form chuẩn trước khối lượng. Đừng lo về số lần — đó là mục tiêu duy nhất hôm nay.' },
    B:{ title:'Ăn Đủ 3 Bữa Có Đạm', detail:'2 trứng sáng · ức gà trưa · cá/đậu hũ tối', kcal:'~1,410 kcal', note:'Không cần cắt cơm. Thêm rau và giảm đồ ngọt là đủ cho ngày đầu.' },
    C:{ title:'Ngủ Trước 23h', detail:'Phòng tối + mát · Phone ra xa giường · 7–9h', note:'Quan trọng hơn bất kỳ bài tập nào — ưu tiên số 1.' },
    D:{ title:'3 Hơi Thở Sâu Khi Thức Dậy', detail:'Hít 4s · giữ 4s · thở ra 4s — lặp 3 lần', note:'30 giây cài "anchor" tốt cho cả ngày.' },
    checklist:['Tập 20 phút (6 động tác)','Đạm ở ≥2/3 bữa','Uống 1.8L nước','Ngủ trước 23h','3 hơi thở buổi sáng'],
  },
  {
    n:2, theme:'Đạm & Nước — Hai Ưu Tiên Đầu', emoji:'💧', tag:'Protein & Hydration',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=70',
    A:{ title:'Lặp 6 Động Tác + Tăng 1 Hiệp', detail:'Giữ nguyên bài · thêm 1 set mỗi động tác', time:'22 phút', note:'Não học qua lặp lại — đừng bỏ dù cảm thấy quá đơn giản.' },
    B:{ title:'Protein Mỗi Bữa Chính', detail:'Yến mạch + trứng · thịt cá rau · đậu hũ', kcal:'~1,380 kcal', note:'1 lòng bàn tay đạm/bữa — quy tắc đơn giản nhất để không thiếu đạm.' },
    C:{ title:'Morning Routine 10 Phút', detail:'Uống nước · 5\' ánh nắng · viết 1 mục tiêu ngày', note:'Anchor buổi sáng giúp não "bật chế độ làm việc" sớm hơn.' },
    D:{ title:'Nhật Ký 3 Dòng Tối', detail:'Tốt gì hôm nay · học được gì · ngày mai làm gì', note:'5 phút trước ngủ. Không cần hay, chỉ cần thật.' },
    checklist:['Đạm cả 3 bữa','Uống 2L nước','Morning routine 10\'','Nhật ký tối 3 dòng','Tập 22 phút'],
  },
  {
    n:3, theme:'Ăn Ngoài Thông Minh & Cardio Nhẹ', emoji:'🚶', tag:'Smart Eating + Walk',
    color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
    A:{ title:'Đi Bộ Nhanh 20 Phút', detail:'Cardio nhẹ · nhịp tim 100–120 · phục hồi cơ bắp', time:'20 phút', note:'Đi sau bữa trưa: giảm đường huyết 20–30%, tăng sức bền nền.' },
    B:{ title:'Xử Lý Bữa Ăn Ngoài', detail:'1 protein + 2 rau + tinh bột vừa = công thức ăn ngoài', kcal:'~1,450 kcal', note:'Không cần từ chối bữa xã giao — chỉ cần chiến lược đơn giản.' },
    C:{ title:'Không Phone 30\' Trước Ngủ', detail:'Thay bằng: đọc sách · thở · giãn cơ nhẹ', note:'Ánh sáng xanh ức chế melatonin — 1 thói quen nhỏ cải thiện sâu giấc.' },
    D:{ title:'Box Breathing 5 Phút', detail:'Hít 4 · giữ 4 · thở ra 4 · giữ 4 — lặp 5 vòng', note:'Dùng khi căng thẳng, trước cuộc họp, hoặc tối trước ngủ.' },
    checklist:['Đi bộ 20 phút','Bữa ngoài theo công thức','Không phone 30\' trước ngủ','Box breathing 5\'','Uống đủ nước'],
  },
  {
    n:4, theme:'Rau Xanh & Phục Hồi Tích Cực', emoji:'🥗', tag:'Greens & Recovery',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=70',
    A:{ title:'Phục Hồi Tích Cực 15 Phút', detail:'Giãn cơ · foam roll · yoga nhẹ · không tập nặng', time:'15 phút', note:'Phục hồi = tập luyện vô hình. Cơ lớn lúc nghỉ, không phải lúc tập.' },
    B:{ title:'Ngày Ưu Tiên Rau', detail:'Salad · canh rau · rau luộc nhiều hơn bình thường', kcal:'~1,300 kcal', note:'Chất xơ nuôi vi khuẩn đường ruột — hệ miễn dịch và tâm trạng đều hưởng lợi.' },
    C:{ title:'8.000 Bước + Ánh Nắng', detail:'Tổng 8k bước trong ngày · ra ngoài 5\' buổi sáng', note:'Không cần đi liên tục. Tổng bước cộng dồn suốt ngày là đủ.' },
    D:{ title:'Thiền 5 Phút', detail:'Ngồi · nhắm mắt · chú ý hơi thở · không phán xét', note:'Không cần "không suy nghĩ" — chỉ cần nhận ra và nhẹ nhàng quay lại hơi thở.' },
    checklist:['Giãn cơ 15 phút','Rau ở ≥2 bữa','8.000 bước','Thiền 5 phút','Ngủ 7–9h'],
  },
  {
    n:5, theme:'Ngày Tập Mạnh & Carb Nạp Năng Lượng', emoji:'💪', tag:'Strong Training Day',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70',
    A:{ title:'Tập Sức Mạnh Toàn Thân 30 Phút', detail:'3 set/bài · Squat + Lunge + Push + Row + Plank', time:'30 phút', note:'RPE 7/10 — cảm thấy mệt nhưng không kiệt sức. Đó là zone đúng.' },
    B:{ title:'Carb Trước + Đạm Sau Tập', detail:'Trước: chuối · Sau: cơm + ức gà · ~1,620 kcal', kcal:'~1,620 kcal', note:'Carb = nhiên liệu. Đạm = vật liệu xây cơ. Đừng bỏ bữa sau tập.' },
    C:{ title:'Tối Ưu Giấc Ngủ Hôm Nay', detail:'18–22°C · tối hoàn toàn · không caffeine sau 14h', note:'Giấc ngủ sau tập nặng = lúc cơ bắp tái tạo quan trọng nhất.' },
    D:{ title:'Đặt Ý Định Buổi Sáng', detail:'Viết 1 câu: "Hôm nay tôi sẽ ___" rồi đọc to', note:'Ý định rõ ràng → hành động nhất quán hơn ~35%.' },
    checklist:['Tập 30\' sức mạnh','Carb trước + đạm sau tập','Không caffeine sau 14h','Đặt ý định sáng','Ngủ 7–9h'],
  },
  {
    n:6, theme:'Chuẩn Bị Cho Tuần Mới', emoji:'🗂️', tag:'Meal Prep Weekend',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=70',
    A:{ title:'Yoga Nhẹ / Đi Bộ 30 Phút', detail:'Phục hồi tích cực · không tập nặng cuối tuần đầu', time:'30 phút', note:'Cuối tuần = nạp lại năng lượng. Đừng để áp lực tập làm tổn hại tinh thần.' },
    B:{ title:'Meal Prep 45 Phút', detail:'Nấu 2 loại đạm · rau đủ · tinh bột · chia hộp sẵn', kcal:'~1,495 kcal', note:'Meal prep giảm 60% quyết định ăn ngẫu hứng — thiết lập môi trường thắng.' },
    C:{ title:'Dọn Dẹp Không Gian', detail:'Bàn làm việc gọn · phòng ngủ sạch · tủ lạnh sắp xếp', note:'Không gian gọn gàng giảm cortisol 20% — ảnh hưởng trực tiếp ngủ và tập trung.' },
    D:{ title:'Tổng Kết Tuần 10 Phút', detail:'Làm tốt gì · chưa tốt gì · tuần tới cải thiện gì', note:'Weekly review = công cụ tăng trưởng nhanh nhất. Biến trải nghiệm thành bài học.' },
    checklist:['Meal prep 45 phút','Yoga/đi bộ 30\'','Dọn dẹp không gian','Tổng kết tuần 10\'','Plan thực đơn tuần mới'],
  },
  {
    n:7, theme:'Phục Hồi Hoàn Toàn & Nhìn Lại', emoji:'🌿', tag:'Rest & Reflect',
    color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=70',
    A:{ title:'Nghỉ Ngơi Hoàn Toàn', detail:'Rest day · đi bộ nhẹ nếu muốn · tập trung phục hồi', time:'Tùy chọn', note:'Rest day không phải thua. Cơ thể đang xây sức mạnh từ tuần tập vừa rồi.' },
    B:{ title:'Ăn Nhẹ Dễ Tiêu', detail:'Canh rau · cháo/soup · trái cây · ~1,240 kcal', kcal:'~1,240 kcal', note:'Để hệ tiêu hóa nghỉ ngơi 1 ngày — ít chế biến, nhiều rau quả, đủ nước.' },
    C:{ title:'Lên Kế Hoạch Tuần Mới', detail:'Đặt lịch tập · chuẩn bị thực đơn · xem lại mục tiêu', note:'Chuẩn bị = chiến thắng 80% — không cần ngẫu hứng mỗi ngày.' },
    D:{ title:'Tổng Kết 7 Ngày Đầu', detail:'3 điều làm được · 1 cần cải thiện · 1 cam kết tiếp', note:'Nhìn lại để học và tiếp tục với nhiều thông tin hơn — không phải để chỉ trích.' },
    checklist:['Nghỉ / đi bộ nhẹ','Ăn nhẹ dễ tiêu','Lên kế hoạch tuần tới','Nhật ký tổng kết 7 ngày','Ngủ sớm trước 22h30'],
  },
];

// ── 12-Week phases ───────────────────────────────────────────────────────────
const TWELVE_PHASES = [
  {
    id:1, weeks:'Tuần 1–4', tag:'FOUNDATION', name:'Khởi Động Nền Tảng', emoji:'🌱',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=70',
    goal:'Hình thành 5 thói quen cốt lõi — tập 3×/tuần, đĩa ăn chuẩn, ngủ trước 23h, thở sâu sáng, ghi nhật ký',
    pillars:{
      A:'6 mẫu vận động · form trước volume · 3×/tuần 20–25\' · khởi động + giãn cơ bắt buộc',
      B:'Đĩa ăn ½ rau ¼ đạm ¼ tinh bột · 1 lòng bàn tay đạm/bữa · giảm đồ ngọt · uống 1.8–2L/ngày',
      C:'Ngủ trước 23h · không phone 30\' trước ngủ · 7.500–8.000 bước/ngày',
      D:'3 hơi thở sâu sáng · nhật ký 3 dòng tối · box breathing khi căng thẳng',
      F:'Daily Checklist mỗi ngày · Workout Log mỗi buổi · Baseline Test tuần 1',
    },
    kpis:['Tập đủ 12 buổi trong 4 tuần','Thành thạo tư thế 6 động tác','Ngủ trước 23h ≥5/7 ngày','Ghi nhật ký ≥5/7 ngày','Daily Checklist ≥4/6 items/ngày'],
    milestones:['12 buổi tập hoàn thành','Biết tên + tư thế 6 bài tập','Ngủ đúng giờ 5 ngày liên tiếp','Ghi nhật ký 5 ngày liên tiếp'],
    note:'Không tăng cường độ trong 4 tuần này. Mục tiêu là xây thói quen, không phải kết quả ngay lập tức.',
  },
  {
    id:2, weeks:'Tuần 5–8', tag:'BUILD BASE', name:'Xây Dựng Cơ Sở', emoji:'📈',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70',
    goal:'Tăng khối lượng tập dần dần, hiểu TDEE cá nhân, ổn định giấc ngủ, thiền ngắn mỗi ngày',
    pillars:{
      A:'Tăng 1 set/tuần · biến thể khó hơn · thêm 2 cardio nhẹ/tuần 20–30\' · ghi RPE mỗi buổi',
      B:'Tính TDEE với B0 calculator · chia macro P/C/F · meal prep 1×/tuần · tracking 3–4 ngày/tuần',
      C:'Ngủ ±15\' cố định · ánh nắng sáng 5\' · NEAT 8.000–10.000 bước · caffeine trước 14h',
      D:'Thiền 3\'/ngày · box breathing khi căng thẳng · brain dump cuối tuần · giảm màn hình tối',
      F:'Lifestyle Tracker · Workout Log RPE · Meal Plan Template · Test tiến bộ tuần 8',
    },
    kpis:['Tập 4×/tuần 25–30\'','Biết TDEE + protein target cá nhân','Thiền 3\' ≥5/7 ngày','Test tuần 8: cải thiện ≥2/6 chỉ số','Meal prep 1×/tuần ổn định'],
    milestones:['Test tiến bộ tuần 8','Hiểu TDEE cá nhân','Thiền 3\' liên tiếp 7 ngày','Cardio nhẹ 2×/tuần ổn định'],
    note:'Tăng không quá 10% volume/tuần. Nếu đau hoặc mệt quá — giảm 20% và phục hồi 1 tuần.',
  },
  {
    id:3, weeks:'Tuần 9–12', tag:'PERSONALIZE', name:'Cá Nhân Hóa & Hoàn Thiện', emoji:'🎯',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70',
    goal:'Chọn hướng phát triển cá nhân, tối ưu bằng dữ liệu 8 tuần, tự thiết kế kế hoạch 12 tuần tiếp',
    pillars:{
      A:'Chọn hướng: Sức mạnh/Cơ bắp/Sức bền · chương trình cá nhân hóa · kiểm soát RPE 7–8',
      B:'Điều chỉnh kcal theo mục tiêu · carb timing trước/sau tập · supplement nếu cần (Whey/Creatine)',
      C:'Ngủ ±10\' cố định · active recovery 10\'/ngày · thiết kế phòng ngủ tối ưu',
      D:'Thiền 5–10\' · journaling 2 phong cách · gentle discipline · digital detox 1×/tuần',
      F:'Daily Health Score · Mind Tracker · Reset Protocol · tự thiết kế 12 tuần tiếp theo',
    },
    kpis:['Chọn 1 hướng mục tiêu rõ ràng','Tự lên kế hoạch tuần tập','Test tuần 12 vs baseline','Calm Score tăng ≥10 điểm','Checklist ≥4/6 items/ngày ổn định'],
    milestones:['Test cuối tuần 12 hoàn thành','Tự thiết kế program 12 tuần tiếp','Lối sống ổn định ≥4 tuần liên tiếp','Calm Score tăng ≥10 từ baseline'],
    note:'Tuần 9–12: bạn trở thành người tự quản lý sức khỏe. Dữ liệu 8 tuần qua là chìa khóa cá nhân hóa.',
  },
];

// ── 24-Week = 12-week + 3 advanced phases ───────────────────────────────────
const ADV_PHASES = [
  {
    id:4, weeks:'Tuần 13–16', tag:'ADVANCED', name:'Nâng Cao & Carb Cycling', emoji:'⚡',
    color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=70',
    goal:'Tối ưu thành phần cơ thể bằng carb cycling, kỹ thuật tập nâng cao, digital detox thực sự',
    pillars:{
      A:'Periodized training: Hypertrophy → Strength block · Tempo reps · Pause reps · Deload định kỳ',
      B:'Carb cycling: ngày tập nặng/nhẹ/nghỉ · Pre-workout carb · Post-workout protein window · Hydration+',
      C:'Môi trường ngủ chuẩn (18°C, tối, yên) · NEAT + LISS kết hợp · Screen time hard limit',
      D:'Digital detox 1 ngày/tuần · Body scan 1×/tuần · Journaling nâng cao · Breathwork advanced',
      F:'Health Score ≥70/ngày · 30-day trend analysis · Reset protocol hoàn thiện',
    },
    kpis:['Carb cycling ổn định ≥3 tuần','Digital detox thành thói quen tuần','Health Score ≥70/ngày','Test tuần 16: body comp cải thiện','Calm Score ≥70/100'],
    milestones:['Test tiến bộ tuần 16','Carb cycling tự tin không cần nhắc','Digital detox 1 ngày/tuần đều đặn','Calm Score ≥70'],
    note:'Phase 4 yêu cầu nền tảng vững từ 12 tuần đầu. Không bỏ qua phase 1–3.',
  },
  {
    id:5, weeks:'Tuần 17–20', tag:'OPTIMIZE', name:'Tối Ưu Hóa Toàn Diện', emoji:'🔬',
    color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70',
    goal:'Tối ưu từng pillar theo dữ liệu cá nhân, supplement protocol, chronotype optimization',
    pillars:{
      A:'Peak strength block · 1RM testing (tùy chọn) · Mobility deep work · Injury prevention protocol',
      B:'Electrolyte protocol · Creatine + Omega-3 + VitD + Mg · Advanced meal timing · Fat quality',
      C:'Chronotype optimization · Peak performance window · Advanced sleep hygiene · Sauna/cold (nếu có)',
      D:'Thiền 10\'/ngày · Body scan sâu · Advanced journaling: future self · Breathwork Wim Hof cơ bản',
      F:'Health Score ≥80/ngày · Plateau identification + fix · 30-day trend deep dive · Self-coaching',
    },
    kpis:['Supplement protocol ổn định 4 tuần','Chronotype + peak window xác định','Thiền 10\' đều đặn','Health Score ≥80/ngày','Test tuần 20: benchmark mới'],
    milestones:['Test tiến bộ tuần 20','Supplement protocol ổn định','Peak performance window tìm ra','Thiền 10\' liên tiếp 14 ngày'],
    note:'Supplement = 5–10% kết quả. Basics (tập + ăn + ngủ) vẫn là 90%. Đừng bỏ nền tảng.',
  },
  {
    id:6, weeks:'Tuần 21–24', tag:'MASTERY', name:'Làm Chủ & Thiết Kế Hệ Thống', emoji:'🎓',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=70',
    goal:'Tự thiết kế hệ thống sức khỏe hoàn chỉnh, 80/20 mastery, truyền kiến thức cho người thân',
    pillars:{
      A:'Tự thiết kế 6-tháng program · Self-coaching · Phase cycling tự main không cần hướng dẫn',
      B:'Intuitive eating + 80/20 rule · Recover tốt sau du lịch/hội họp · Family meal integration',
      C:'Lối sống tự vận hành · Tự assess và điều chỉnh · Zero willpower dependency',
      D:'Mental wellness stack cá nhân · Dạy người thân ≥3 thói quen · Long-term peace & resilience',
      F:'Tracking tối giản · Chỉ dùng tools thực sự có giá trị · Tự coach với data 6 tháng tới',
    },
    kpis:['Self-designed 6-month program hoàn chỉnh','80/20: biết 20% thói quen tạo 80% kết quả','Dạy ≥1 người thân ≥3 thói quen','Test tuần 24 vs baseline ngày 1','Hệ thống tự vận hành không cần nhắc nhở'],
    milestones:['Test cuối tuần 24 toàn diện vs ngày 1','Program 6 tháng tiếp theo hoàn chỉnh','Dạy được người thân ≥3 thói quen','Viết "Hành Trình Của Tôi" 1 trang'],
    note:'Sau 24 tuần, bạn không còn "cố gắng khỏe" — bạn đã trở thành người sống khỏe. Đó là sự khác biệt.',
  },
];

const TWENTY_FOUR_PHASES = [...TWELVE_PHASES, ...ADV_PHASES];

// ── Daily framework ──────────────────────────────────────────────────────────
const DAILY_BLOCKS = [
  { time:'5 phút',     name:'Khởi Động',          desc:'Khớp linh hoạt · nâng nhiệt cơ thể',     icon:'🔥', color:'#22c55e' },
  { time:'10–20 phút', name:'Vận Động Chính',      desc:'Sức mạnh hoặc cardio theo lịch',          icon:'💪', color:'#84cc16' },
  { time:'5–10 phút',  name:'Giãn Cơ & Hạ Nhiệt', desc:'Kéo giãn · hạ nhịp tim · thư giãn cơ',  icon:'🧘', color:'#14b8a6' },
  { time:'5 phút',     name:'Mind Reset',          desc:'Thở sâu hoặc thiền ngắn · đặt ý định',   icon:'🌿', color:'#a855f7' },
];

const WEEKLY_RHYTHM = [
  { days:'T2 · T4 · T6', type:'Sức Mạnh',         desc:'Squat · Hinge · Push · Pull · Core — 20–30\'',         color:'green'  },
  { days:'T3 · T5',      type:'Cardio Nhẹ',        desc:'Đi bộ nhanh · đạp xe · leo cầu thang — 20–30\'',      color:'blue'   },
  { days:'T7',           type:'Phục Hồi Tích Cực', desc:'Giãn cơ · yoga · đi bộ thư giãn · massage',           color:'teal'   },
  { days:'CN',           type:'Nghỉ Ngơi',         desc:'Phục hồi hoàn toàn hoặc vận động nhẹ tùy thích',      color:'purple' },
];

const DAY_CLS = { green:'bg-green-500/8 border-green-500/25 text-green-400', blue:'bg-blue-500/8 border-blue-500/25 text-blue-400', teal:'bg-teal-500/8 border-teal-500/25 text-teal-400', purple:'bg-purple-500/8 border-purple-500/25 text-purple-400' };
const DAY_DOT = { green:'bg-green-400', blue:'bg-blue-400', teal:'bg-teal-400', purple:'bg-purple-400' };

const SUCCESS_TIPS = [
  { icon:'🔁', title:'Nhất Quán Hơn Cường Độ',     desc:'3–5 buổi/tuần đều đặn quan trọng hơn 1 buổi kiệt sức. 20 phút mỗi ngày thắng 2 giờ mỗi tháng.' },
  { icon:'📈', title:'Tăng Tải Từ Từ',              desc:'Tăng không quá 10% volume/tuần. Quy tắc này ngăn chấn thương và burnout về lâu dài.' },
  { icon:'😴', title:'Ngủ Là Thuốc Phục Hồi',       desc:'7–9h mỗi đêm. Cơ lớn lúc ngủ, không phải lúc tập. Thiếu ngủ giảm hiệu suất 20–30%.' },
  { icon:'🥗', title:'Đạm Đủ Mỗi Ngày',             desc:'1.6–2g protein/kg cân nặng. Ưu tiên thực phẩm nguyên chất: trứng, thịt nạc, đậu hũ, sữa chua Hy Lạp.' },
  { icon:'📓', title:'Ghi Nhật Ký Tập',              desc:'5 phút/buổi: ghi số set, số lần, cảm giác. Nhật ký cho bạn thấy tiến bộ mà mắt thường không thấy.' },
  { icon:'🧠', title:'Kiên Nhẫn Với Kết Quả',       desc:'Kết quả thực sự đến sau 4–8 tuần nhất quán. Những tuần đầu là não đang học — không phải lười biếng.' },
];

const PROGRESS_ROWS = [
  { metric:'Sức Bền Tim Mạch',   test:'Đi bộ nhanh 6 phút',            unit:'m'         },
  { metric:'Sức Mạnh Thân Trên', test:'Push-up tối đa liên tiếp',       unit:'lần'       },
  { metric:'Sức Mạnh Hạ Chi',    test:'Đứng lên ngồi xuống 1 phút',    unit:'lần'       },
  { metric:'Linh Hoạt',          test:'Cúi chạm ngón chân',             unit:'Không/Có'  },
  { metric:'Cân Nặng',           test:'Cân buổi sáng chưa ăn',          unit:'kg'        },
  { metric:'Vòng Eo',            test:'Đo sau thở ra tự nhiên',         unit:'cm'        },
  { metric:'Nhịp Tim Lúc Nghỉ',  test:'Sau nằm yên 5 phút',            unit:'bpm'       },
  { metric:'Chất Lượng Ngủ',     test:'Tự đánh giá 1–10',              unit:'điểm'      },
];

// ── Journey config ───────────────────────────────────────────────────────────
const JOURNEYS = [
  { id:'7d',  label:'7 Ngày Khởi Động', sub:'Tuần đầu tiên', icon:'🌱', color:'#22c55e', rgb:'34,197,94',   desc:'Bắt đầu nhẹ nhàng với 7 ngày đầu tiên. Mỗi ngày tích hợp đủ 4 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí.' },
  { id:'12w', label:'12 Tuần Cơ Bản',  sub:'Chương trình nền tảng', icon:'📈', color:'#84cc16', rgb:'132,204,22', desc:'3 giai đoạn 12 tuần: Khởi Động → Xây Nền → Cá Nhân Hóa. Đủ thời gian để thay đổi thói quen não bộ vĩnh viễn.' },
  { id:'24w', label:'24 Tuần Nâng Cao', sub:'Chương trình toàn diện', icon:'🎓', color:'#a855f7', rgb:'168,85,247', desc:'6 giai đoạn 24 tuần: từ người mới đến làm chủ hoàn toàn hệ thống sức khỏe cá nhân. Carb cycling + supplement + mastery.' },
];

const SUB_TABS_12W = [
  { id:'phases', label:'Lộ Trình', icon:'🗓️' },
  { id:'daily',  label:'Khung Ngày', icon:'⏱️' },
  { id:'weekly', label:'Nhịp Tuần', icon:'📅' },
  { id:'tips',   label:'Nguyên Tắc', icon:'💡' },
  { id:'test',   label:'Bài Test', icon:'📈' },
];

// ── PillarRow ────────────────────────────────────────────────────────────────
function PillarRow({ id, text }) {
  const p = PC[id];
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: p.bg, border: `1px solid ${p.br}` }}>
      <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: p.c }}>{p.l}</span>
        <p className="text-base text-muted leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ── PhaseCard ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, idx, expanded, onToggle }) {
  const { t } = useTranslation();
  const isEven = idx % 2 === 0;
  return (
    <RevealBlock delay={idx * 80} className="flex gap-4 md:gap-6">
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <button
          onClick={onToggle}
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-white text-lg z-10 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{ background: phase.color, borderColor: phase.color }}
        >
          {phase.emoji}
        </button>
        {idx < 2 && <div className="flex-1 w-px mt-2" style={{ background: `rgba(${phase.rgb},0.25)` }} />}
      </div>

      {/* Card */}
      <div className="flex-1 mb-6">
        <button
          onClick={onToggle}
          className="w-full text-left border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
          style={{ borderColor: `rgba(${phase.rgb},0.3)`, background: `rgba(${phase.rgb},0.04)` }}
        >
          {/* Image header */}
          <div className="relative h-28 md:h-36 overflow-hidden">
            <img src={phase.img} alt={phase.name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(${phase.rgb},0.75) 0%, transparent 60%)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-0.5" style={{ color: phase.color }}>{phase.weeks}</span>
                <h3 className="font-bold text-lg md:text-xl text-white leading-tight">{phase.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base px-2.5 py-1 rounded-full bg-black/30 border border-white/10 font-semibold" style={{ color: phase.color }}>{phase.tag}</span>
                <span className="text-white/70 text-lg transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
            </div>
          </div>
          {/* Goal line */}
          <div className="px-5 py-3 flex items-start gap-2 border-b" style={{ borderColor: `rgba(${phase.rgb},0.15)` }}>
            <span className="text-lg">🎯</span>
            <p className="text-base leading-relaxed" style={{ color: phase.color }}>{phase.goal}</p>
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="border border-t-0 rounded-b-2xl overflow-hidden animate-fade-in-up" style={{ borderColor: `rgba(${phase.rgb},0.2)` }}>
            <div className="p-5 space-y-4">
              {/* Pillar grid */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.pillar_section_header', 'Nội Dung Theo Trụ Cột')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(phase.pillars).map(([k,v]) => <PillarRow key={k} id={k} text={v} />)}
                </div>
              </div>
              {/* KPIs */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.kpi_section_header', 'Chỉ Số Mục Tiêu')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {phase.kpis.map((kpi, i) => (
                    <div key={i} className="flex items-start gap-2 text-base text-muted">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: phase.color }} />
                      <span>{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Milestones */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.milestone_header', 'Cột Mốc Giai Đoạn')}</h4>
                <div className="flex flex-wrap gap-2">
                  {phase.milestones.map((m, i) => (
                    <span key={i} className="text-base px-3 py-1.5 rounded-full border font-medium" style={{ color: phase.color, borderColor: `rgba(${phase.rgb},0.3)`, background: `rgba(${phase.rgb},0.08)` }}>
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>
              {/* Note */}
              <div className="text-base text-muted/70 italic p-3 rounded-xl border" style={{ borderColor: `rgba(${phase.rgb},0.15)`, background: `rgba(${phase.rgb},0.04)` }}>
                💬 {phase.note}
              </div>
            </div>
          </div>
        )}
      </div>
    </RevealBlock>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Program() {
  const { t, i18n } = useTranslation();
  const [journey, setJourney] = useState('7d');
  const [activeDay, setActiveDay] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [subTab, setSubTab] = useState('phases');

  // Translated data — fall back to hardcoded Vietnamese constants if key missing
  const tJourneys = t('program.journeys', { returnObjects: true });
  const localJourneys = Array.isArray(tJourneys) ? tJourneys.map((j, i) => ({ ...JOURNEYS[i], ...j })) : JOURNEYS;
  const tSevenDays = t('program.seven_days', { returnObjects: true });
  const localSevenDays = Array.isArray(tSevenDays) ? tSevenDays.map((d, i) => ({ ...SEVEN_DAYS[i], ...d })) : SEVEN_DAYS;
  const tPillarLabels = t('program.pillar_labels', { returnObjects: true });
  const localPC = (tPillarLabels && typeof tPillarLabels === 'object' && !Array.isArray(tPillarLabels))
    ? Object.fromEntries(Object.entries(PC).map(([k, v]) => [k, { ...v, l: tPillarLabels[k] || v.l }]))
    : PC;
  const tQuickLinks = t('program.quick_links', { returnObjects: true });
  const localQuickLinks = Array.isArray(tQuickLinks) ? tQuickLinks : null;
  const localSubTabs = [
    { id:'phases', label: t('program.sub_tab_phases', 'Lộ Trình'),  icon:'🗓️' },
    { id:'daily',  label: t('program.sub_tab_daily',  'Khung Ngày'), icon:'⏱️' },
    { id:'weekly', label: t('program.sub_tab_weekly', 'Nhịp Tuần'), icon:'📅' },
    { id:'tips',   label: t('program.sub_tab_tips',   'Nguyên Tắc'), icon:'💡' },
    { id:'test',   label: t('program.sub_tab_test',   'Bài Test'),  icon:'📈' },
  ];

  const phases12 = journey === '12w' ? TWELVE_PHASES : TWENTY_FOUR_PHASES;

  useEffect(() => {
    const id = 'pg-hero-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes pgLabelIn {
        from { opacity:0; letter-spacing:0.35em; transform:translateY(-8px); }
        to   { opacity:1; letter-spacing:0.22em; transform:translateY(0); }
      }
      @keyframes pgTitleIn {
        from { opacity:0; transform:translateY(30px) scale(0.96); filter:blur(8px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes pgSubIn {
        from { opacity:0; transform:translateX(-16px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes pgLineGrow {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes pgStatPop {
        from { opacity:0; transform:scale(0.8) translateY(10px); }
        to   { opacity:1; transform:scale(1)   translateY(0); }
      }
      @keyframes pgGlowPulse {
        0%,100% { opacity:0.35; transform:scale(1); }
        50%     { opacity:0.65; transform:scale(1.18); }
      }
      .pg-label    { animation:pgLabelIn 0.55s ease both; }
      .pg-title    { animation:pgTitleIn 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both 0.1s; }
      .pg-sub      { animation:pgSubIn  0.6s ease both 0.3s; }
      .pg-divider  { transform-origin:left; animation:pgLineGrow 0.9s ease both 0.28s; }
      .pg-stat     { animation:pgStatPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
      .pg-stat:nth-child(1){ animation-delay:0.5s; }
      .pg-stat:nth-child(2){ animation-delay:0.62s; }
      .pg-stat:nth-child(3){ animation-delay:0.74s; }
      .pg-stat:nth-child(4){ animation-delay:0.86s; }
      .pg-glow { animation:pgGlowPulse 7s ease-in-out infinite; }
      .pg-glow2{ animation:pgGlowPulse 10s ease-in-out infinite reverse; animation-delay:-3s; }
    `;
    document.head.appendChild(s);
  }, []);

  const heroStats = [
    { l:'12', s:'tuần', tip:'Chương trình 12 tuần: Khởi Động (1–4) → Xây Nền (5–8) → Cá Nhân Hóa (9–12). Đủ thời gian thay đổi thói quen não bộ.' },
    { l:'3',  s:'giai đoạn', tip:'3 giai đoạn thích nghi dần: G1 học kỹ thuật + xây thói quen, G2 tăng volume + sức bền, G3 cá nhân hóa mục tiêu.' },
    { l:'6',  s:'trụ cột', tip:'Phối hợp 6 trụ cột đồng thời: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ.' },
    { l:'20+',s:'phút/ngày', tip:'20 phút mỗi ngày là ngưỡng tối thiểu để tạo thay đổi. Cấu trúc 4 khối (Khởi → Chính → Giãn → Tĩnh) tối ưu mọi thời lượng.' },
  ];

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 mb-10 overflow-hidden rounded-b-3xl" style={{ minHeight: 300 }}>
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=65" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/55 to-bg pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        {/* Ambient glow blobs */}
        <div className="pg-glow  absolute top-1/4 left-1/5  w-[480px] h-[380px] bg-accent/6   rounded-full blur-[110px] pointer-events-none" />
        <div className="pg-glow2 absolute top-0   right-1/5 w-[320px] h-[280px] bg-purple-500/4 rounded-full blur-[90px]  pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-16 pb-14 flex flex-col items-center text-center">

          {/* Decorative trio — mirrors the 3 journey colors */}
          <div className="pg-label flex items-center gap-2.5 mb-7">
            {[['#22c55e','34,197,94'],['#5eead4','94,234,212'],['#a855f7','168,85,247']].map(([c,r],i) => (
              <span key={i}
                className="rounded-full"
                style={{ width: 6+i*3, height: 6+i*3, background:`radial-gradient(circle, rgba(${r},0.9), rgba(${r},0.4))`, boxShadow:`0 0 8px rgba(${r},0.6)` }}
              />
            ))}
            <div className="h-px w-12 rounded-full mx-1" style={{ background:'linear-gradient(90deg,rgba(94,234,212,0.4),rgba(168,85,247,0.4))' }} />
            {[['#a855f7','168,85,247'],['#5eead4','94,234,212'],['#22c55e','34,197,94']].map(([c,r],i) => (
              <span key={i}
                className="rounded-full"
                style={{ width: 12-i*3, height: 12-i*3, background:`radial-gradient(circle, rgba(${r},0.9), rgba(${r},0.4))`, boxShadow:`0 0 8px rgba(${r},0.6)` }}
              />
            ))}
          </div>

          {/* Title */}
          <h1 className="pg-title font-black leading-[1.05] tracking-tight mb-6" style={{ fontSize:'clamp(2.8rem,6vw,4.5rem)' }}>
            <span style={{
              background:'linear-gradient(135deg, #f0fdf4 0%, #ffffff 30%, #86efac 60%, #5eead4 85%, #c4b5fd 100%)',
              WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              {t('program.hero_title')}
            </span>
          </h1>

          {/* Gradient underline */}
          <div className="pg-divider mb-7 h-[2.5px] w-28 rounded-full"
            style={{ background:'linear-gradient(90deg,#22c55e,#5eead4,#a855f7)' }} />

          {/* Subtitle */}
          <p className="pg-sub text-muted/75 text-lg md:text-lg leading-relaxed max-w-[440px] mb-4">
            {t('program.hero_sub')}
          </p>
          <div className="pg-sub flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
            {[['🌱', t('program.j7d'), '#22c55e'],['📈', t('program.j12w'), '#84cc16'],['🎓', t('program.j24w'), '#a855f7']].map(([icon,label,color]) => (
              <span key={label} className="flex items-center gap-1.5 text-base font-semibold" style={{ color }}>
                <span>{icon}</span>{label}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── Journey Mode Selector ─────────────────────────────── */}
      <RevealBlock className="mb-10">
        <h2 className="text-base font-bold uppercase tracking-widest text-muted mb-4 text-center">{t('program.choose')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {localJourneys.map(j => {
            const active = journey === j.id;
            return (
              <button
                key={j.id}
                onClick={() => { setJourney(j.id); setExpandedPhase(0); setSubTab('phases'); }}
                className="relative text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{ borderColor: active ? `rgba(${j.rgb},0.55)` : 'rgba(255,255,255,0.06)', background: active ? `rgba(${j.rgb},0.07)` : 'rgba(255,255,255,0.02)' }}
              >
                {active && <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, rgba(${j.rgb},0.25), transparent 70%)` }} />}
                <div className="relative">
                  <span className="text-4xl block mb-2">{j.icon}</span>
                  <div className="font-bold text-lg text-text leading-tight mb-0.5">{j.label}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: j.color }}>{j.sub}</div>
                  <p className="text-base text-muted leading-relaxed">{j.desc}</p>
                  {active && <div className="absolute top-0 right-0 w-2 h-2 rounded-full" style={{ background: j.color }} />}
                </div>
              </button>
            );
          })}
        </div>
      </RevealBlock>

      {/* ─────────────────────────────────────────────────────────
          ── 7-DAY JOURNEY ─────────────────────────────────────
          ───────────────────────────────────────────────────── */}
      {journey === '7d' && (
        <div key="7d">
          {/* Day picker */}
          <RevealBlock className="mb-6">
            <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="flex gap-2 pb-1" style={{ width:'max-content', minWidth:'100%' }}>
                {localSevenDays.map((d, i) => {
                  const active = activeDay === i;
                  return (
                    <button key={d.n} onClick={() => setActiveDay(i)}
                      className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer shrink-0"
                      style={{ borderColor: active ? `rgba(${d.rgb},0.5)` : 'rgba(255,255,255,0.07)', background: active ? `rgba(${d.rgb},0.1)` : 'transparent', minWidth: 64 }}
                    >
                      <span className="text-2xl">{d.emoji}</span>
                      <span className="text-[10px] font-bold" style={{ color: active ? d.color : undefined }}>{t('program.day_prefix', 'N')}{d.n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealBlock>

          {/* Day content */}
          {(() => {
            const day = localSevenDays[activeDay];
            return (
              <div key={activeDay} className="animate-fade-in-up">
                {/* Day header */}
                <RevealBlock className="mb-6">
                  <div className="relative rounded-3xl overflow-hidden h-44 md:h-56">
                    <img src={day.img} alt={day.theme} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: day.color }}>{t('program.day_of_7_label', { n: day.n, defaultValue: `Ngày ${day.n} của 7` })}</div>
                        <h2 className="font-bold text-2xl md:text-3xl text-text leading-tight">{day.theme}</h2>
                      </div>
                      <span className="text-base px-3 py-1.5 rounded-full bg-bg/60 border font-bold" style={{ color: day.color, borderColor: `rgba(${day.rgb},0.3)` }}>{day.tag}</span>
                    </div>
                  </div>
                </RevealBlock>

                {/* 4-pillar cards */}
                <RevealBlock delay={80} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {(['A','B','C','D']).map(pid => {
                    const p = localPC[pid];
                    const info = day[pid];
                    return (
                      <div key={pid} className="rounded-2xl p-4 border" style={{ background: p.bg, borderColor: p.br }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{p.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p.c }}>{p.l}</span>
                          {(info.time || info.kcal) && (
                            <span className="ml-auto text-[10px] text-muted/60 font-medium">{info.time || info.kcal}</span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-text mb-1 leading-snug">{info.title}</h3>
                        <p className="text-base text-muted mb-2 leading-relaxed">{info.detail}</p>
                        <p className="text-[11px] italic text-muted/60 leading-relaxed border-t pt-2" style={{ borderColor: p.br }}>💬 {info.note}</p>
                      </div>
                    );
                  })}
                </RevealBlock>

                {/* Daily checklist */}
                <RevealBlock delay={160} className="rounded-2xl border p-5 mb-6" style={{ borderColor: `rgba(${day.rgb},0.25)`, background: `rgba(${day.rgb},0.04)` }}>
                  <h3 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: day.color }}>✅ {t('program.checklist_day_label', { n: day.n, defaultValue: `Checklist Ngày ${day.n}` })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {day.checklist.map((item,i) => (
                      <div key={i} className="flex items-center gap-2.5 text-lg text-muted">
                        <span className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center" style={{ borderColor: `rgba(${day.rgb},0.4)` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: day.color }} />
                        </span>
                        <span className="text-base leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </RevealBlock>

                {/* Day navigation */}
                <div className="flex items-center justify-between mb-10">
                  <button onClick={() => setActiveDay(d => Math.max(0,d-1))} disabled={activeDay===0}
                    className="flex items-center gap-2 text-base font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border">
                    {t('program.prev_day', '← Ngày trước')}
                  </button>
                  <div className="flex gap-1">
                    {localSevenDays.map((_,i) => (
                      <button key={i} onClick={() => setActiveDay(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: activeDay===i?16:6, height:6, background: activeDay===i ? localSevenDays[activeDay].color : 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                  <button onClick={() => setActiveDay(d => Math.min(6,d+1))} disabled={activeDay===6}
                    className="flex items-center gap-2 text-base font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border">
                    {t('program.next_day', 'Ngày tiếp →')}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 7-day philosophy note */}
          <RevealBlock className="rounded-2xl border border-accent/15 p-5 bg-accent/4 mb-8">
            <p className="text-base text-muted leading-relaxed text-center">
              💡 <strong className="text-text">{t('program.philosophy_7d_strong', '7 ngày này là nền tảng')}</strong> {t('program.philosophy_7d_body', '— không phải để "thay đổi cơ thể" mà để')}
              <strong className="text-accent"> {t('program.philosophy_7d_habit', 'hình thành 4 thói quen đầu tiên')}</strong>.
              {' '}{t('program.philosophy_7d_suffix', 'Hoàn thành 7 ngày → bắt đầu')} <button onClick={() => setJourney('12w')} className="text-lime-400 underline cursor-pointer hover:no-underline">{t('program.link_12w_text', '12 tuần cơ bản')}</button>.
            </p>
          </RevealBlock>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          ── 12-WEEK / 24-WEEK JOURNEY ─────────────────────────
          ───────────────────────────────────────────────────── */}
      {(journey === '12w' || journey === '24w') && (
        <div key={journey}>
          {/* Sub-tab strip */}
          <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-border/60 -mx-4 md:-mx-8 px-4 md:px-8 mb-8">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex" style={{ width:'max-content', minWidth:'100%' }}>
                {localSubTabs.map(tab => {
                  const active = subTab === tab.id;
                  const jColor = journey === '12w' ? '#84cc16' : '#a855f7';
                  return (
                    <button key={tab.id} onClick={() => setSubTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 md:px-5 py-4 text-lg font-semibold whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer ${
                        active ? 'border-current' : 'text-muted border-transparent hover:text-text hover:border-border'
                      }`}
                      style={active ? { color: jColor } : {}}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div key={subTab} className="animate-fade-in-up min-h-[400px]">

            {/* ── Phases tab ───────────────── */}
            {subTab === 'phases' && (
              <div>
                <RevealBlock className="mb-6 text-center">
                  <p className="text-lg text-muted">
                    {journey === '12w' ? t('program.phases_intro_12w') : t('program.phases_intro_24w')}
                  </p>
                </RevealBlock>
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-px" style={{ background: journey==='12w' ? 'linear-gradient(to bottom, #22c55e, #84cc16, #a855f7)' : 'linear-gradient(to bottom, #22c55e, #84cc16, #a855f7, #f97316, #3b82f6, #a855f7)' }} />
                  {phases12.map((phase,i) => (
                    <PhaseCard key={phase.id} phase={phase} idx={i} expanded={expandedPhase===i} onToggle={() => setExpandedPhase(expandedPhase===i ? -1 : i)} />
                  ))}
                </div>

                {journey === '12w' && (
                  <RevealBlock className="mt-6 p-4 rounded-2xl border border-purple-500/15 bg-purple-500/4 text-center">
                    <p className="text-base text-muted">
                      {t('program.upgrade_to_24w_cta', 'Muốn tiến xa hơn sau 12 tuần? →')}{' '}
                      <button onClick={() => setJourney('24w')} className="text-purple-400 underline hover:no-underline cursor-pointer">{t('program.see_24w_btn', 'Xem lộ trình 24 tuần nâng cao')}</button>
                    </p>
                  </RevealBlock>
                )}
              </div>
            )}

            {/* ── Daily framework tab ──────── */}
            {subTab === 'daily' && (
              <div>
                <div className="flex h-2.5 rounded-full overflow-hidden mb-8 bg-border/30">
                  {[{f:1,c:'bg-green-500/60'},{f:3,c:'bg-accent/60'},{f:2,c:'bg-teal-500/60'},{f:1,c:'bg-purple-500/60'}].map((seg,i) => (
                    <div key={i} className={`${seg.c} hover:brightness-125 transition-all duration-300`} style={{flex:seg.f}} />
                  ))}
                </div>
                <div className="relative">
                  <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 pointer-events-none" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DAILY_BLOCKS.map((block,i) => (
                      <RevealBlock key={i} delay={i*80} className="relative bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.07)] transition-all duration-300 group">
                        <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/30">{String(i+1).padStart(2,'0')}</span>
                        <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: block.color }}>{block.time}</p>
                        <h3 className="font-bold text-lg text-text mb-1.5">{block.name}</h3>
                        <p className="text-base text-muted leading-relaxed">{block.desc}</p>
                        {i < 3 && <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border text-xl z-10">›</span>}
                      </RevealBlock>
                    ))}
                  </div>
                </div>
                <RevealBlock delay={320} className="mt-8 p-5 rounded-2xl border border-accent/15 bg-accent/4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-accent mb-3">💡 {t('program.daily_principles_title', 'Nguyên Tắc Khung Ngày')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-muted">
                    {(() => {
                      const principles = t('program.daily_principles', { returnObjects: true });
                      const pArr = Array.isArray(principles) ? principles : [
                        "Không bỏ 5' khởi động — giảm 70% nguy cơ chấn thương",
                        "Mind Reset có thể thay bằng 5' đi bộ im lặng",
                        "Nếu chỉ có 20 phút: 5' khởi động + 10' chính + 5' giãn",
                        "Nếu có 40 phút: thêm Giãn cơ và Mind Reset đầy đủ"
                      ];
                      return pArr.map((p, i) => <p key={i}>• {p}</p>);
                    })()}
                  </div>
                </RevealBlock>
              </div>
            )}

            {/* ── Weekly rhythm tab ────────── */}
            {subTab === 'weekly' && (
              <div className="space-y-3">
                {WEEKLY_RHYTHM.map((day,i) => (
                  <RevealBlock key={i} delay={i*70} className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-border-bright transition-all duration-200 group">
                    <div className={`w-28 shrink-0 text-center px-3 py-2 rounded-xl border text-base font-bold leading-tight ${DAY_CLS[day.color]}`}>{day.days}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text text-lg">{day.type}</h3>
                      <p className="text-base text-muted mt-0.5 leading-relaxed">{day.desc}</p>
                    </div>
                    <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${DAY_DOT[day.color]} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  </RevealBlock>
                ))}
                <RevealBlock delay={320} className="p-5 rounded-2xl border border-blue-500/15 bg-blue-500/4 mt-4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-blue-400 mb-3">📌 {t('program.adjust_schedule_title', 'Điều Chỉnh Cho Lịch Của Bạn')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base text-muted">
                    {(() => {
                      const tips = t('program.adjust_tips', { returnObjects: true });
                      const tArr = Array.isArray(tips) ? tips : [
                        "Siêu bận: T2/T4/CN — 3 buổi/tuần là đủ ổn định",
                        "Shift làm việc: linh hoạt ngày, giữ đủ 3–4 buổi/tuần",
                        "Mới bắt đầu: 3 buổi/tuần, mỗi buổi 20–25 phút",
                        "Cardio nhẹ: đi bộ đến nơi làm = tích hợp NEAT tự nhiên"
                      ];
                      return tArr.map((tip, i) => <p key={i}>• {tip}</p>);
                    })()}
                  </div>
                </RevealBlock>
              </div>
            )}

            {/* ── Success tips tab ─────────── */}
            {subTab === 'tips' && (
              <div className="relative overflow-hidden rounded-3xl border border-accent/15">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal-500/4 pointer-events-none" />
                <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
                <div className="relative p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {SUCCESS_TIPS.map((tip,i) => (
                      <RevealBlock key={i} delay={i*60} className="flex items-start gap-3 group">
                        <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">{tip.icon}</span>
                        <div>
                          <h3 className="font-bold text-text text-lg mb-1 group-hover:text-accent transition-colors duration-200">{tip.title}</h3>
                          <p className="text-base text-muted leading-relaxed">{tip.desc}</p>
                        </div>
                      </RevealBlock>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Progress test tab ────────── */}
            {subTab === 'test' && (
              <div>
                <RevealBlock className="text-base text-muted mb-5 p-4 rounded-xl border border-purple-500/15 bg-purple-500/4">
                  <strong className="text-purple-400">📋 {t('program.test_guide', 'Test buổi sáng sau khi thức dậy, trước khi ăn. Ghi kết quả và so sánh qua các mốc để theo dõi tiến bộ thực sự.')}</strong>
                </RevealBlock>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-purple-500/60 via-purple-500/20 to-transparent" />
                  <div className="overflow-x-auto">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-base font-bold text-muted uppercase tracking-wider px-5 py-3">{t('program.test_metric_col', 'Chỉ Số')}</th>
                          <th className="text-left text-base font-bold text-muted uppercase tracking-wider px-5 py-3">{t('program.test_method_col', 'Bài Test')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_baseline_col', 'Baseline')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week4_col', 'Tuần 4')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week12_col', 'Tuần 12')}</th>
                          {journey === '24w' && <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week24_col', 'Tuần 24')}</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {PROGRESS_ROWS.map((row,i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-purple-500/3 transition-colors duration-150 last:border-0">
                            <td className="px-5 py-3 font-semibold text-text text-lg">{row.metric}</td>
                            <td className="px-5 py-3 text-muted text-base leading-relaxed">{row.test}</td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-teal-400 bg-teal-500/8 border border-teal-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-purple-400 bg-purple-500/8 border border-purple-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            {journey === '24w' && <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-orange-400 bg-orange-500/8 border border-orange-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <RevealBlock delay={200} className="mt-4 p-4 rounded-2xl border border-accent/15 bg-accent/4">
                  <p className="text-base text-muted">
                    🛠️ {t('program.test_tool_note', 'Dùng Công cụ Bài Test Tiến Bộ để lưu kết quả và so sánh qua các mốc tự động.')}
                  </p>
                </RevealBlock>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Cross-pillar quick links ───────────────────────────── */}
      <RevealBlock className="mt-12">
        <div className="border-t border-border/50 pt-10 mb-6">
          <h2 className="text-base font-bold uppercase tracking-widest text-muted mb-4 text-center">{t('program.deep_dive_title', 'Đi Sâu Vào Từng Trụ Cột')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { to:'/pillar/a',          icon:'🏃', color:'#22c55e' },
              { to:'/pillar/b/roadmap',  icon:'🥗', color:'#84cc16' },
              { to:'/pillar/b/7day',     icon:'📅', color:'#84cc16' },
              { to:'/pillar/c/roadmap',  icon:'🌿', color:'#14b8a6' },
              { to:'/pillar/d/roadmap',  icon:'🧘', color:'#a855f7' },
              { to:'/pillar/f/roadmap',  icon:'🛠️', color:'#f97316' },
            ].map((link, idx) => {
              const ql = localQuickLinks?.[idx];
              const label = ql?.label || ['Vận Động & Tập Luyện','Lộ Trình Dinh Dưỡng','Thực Đơn 7 Ngày','Lối Sống 12 Tuần','Tâm Trí 12 Tuần','Lộ Trình Công Cụ'][idx];
              const sub = ql?.sub || ['6 mẫu · Khung ngày · Lộ trình','12 tuần · Macro · Meal prep','Bữa ăn theo ngày · Shopping list','Ngủ · NEAT · Nhịp sinh học','Thiền · Thở · Journaling','Checklist · Tracker · Test'][idx];
              return (
                <Link key={link.to} to={link.to}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-surface hover:border-[var(--lc)] hover:-translate-y-0.5 transition-all duration-200 group"
                  style={{ '--lc': `rgba(${link.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')},0.35)` }}
                >
                  <span className="text-2xl shrink-0">{link.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-text text-base leading-snug">{label}</div>
                    <div className="text-[10px] text-muted mt-0.5 leading-relaxed">{sub}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* ── Sample programs CTA ───────────────────────────────── */}
      <RevealBlock className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-pink-500/4 mb-6 group hover:border-pink-500/35 transition-all duration-300">
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/6 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-3xl shrink-0">🗂️</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text mb-1">{t('program.sample_programs_banner_title', 'Lộ Trình Mẫu Theo Mục Tiêu')}</h3>
            <p className="text-base text-muted leading-relaxed">
              {t('program.sample_programs_banner_desc', '6 mục tiêu × 24 tuần — Chọn lộ trình phù hợp: Người mới · Siêu bận · Giảm mỡ · Tăng cơ · Sức bền · Nâng cao.')}
            </p>
          </div>
          <Link to="/sample-programs"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 text-base font-bold hover:bg-pink-500/20 transition-all duration-200">
            {t('program.sample_programs_cta', 'Xem lộ trình →')}
          </Link>
        </div>
      </RevealBlock>

    </div>
  );
}
