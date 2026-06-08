import { useState } from 'react';

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.2)',   hex:'#22c55e', dot:'bg-green-400' },
  yellow: { text:'text-yellow-400', bg:'bg-yellow-500/10', border:'border-yellow-500/30', bar:'bg-yellow-500', glow:'rgba(234,179,8,0.2)',   hex:'#eab308', dot:'bg-yellow-400' },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.2)',  hex:'#f97316', dot:'bg-orange-400' },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   glow:'rgba(59,130,246,0.2)',  hex:'#3b82f6', dot:'bg-blue-400' },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   glow:'rgba(20,184,166,0.2)',  hex:'#14b8a6', dot:'bg-teal-400' },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.2)',  hex:'#a855f7', dot:'bg-purple-400' },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/10',   border:'border-lime-500/30',   bar:'bg-lime-500',   glow:'rgba(163,230,53,0.2)',  hex:'#a3e635', dot:'bg-lime-400' },
};

// ─── Goal data ────────────────────────────────────────────────────────────────
const GOAL_DATA = [
  {
    id:'busy', icon:'⚡', name:'Siêu Bận', color:'yellow',
    tagline:'Chắt chiu từng 10 phút — thắng bằng sự đều đặn',
    steps:[
      { n:1, title:'Khởi Động', period:'Ngày 1–14', stepColor:'green',
        badge:'🌱 Hạt Giống',
        target:'Hoàn thành 14/14 ngày dù chỉ 5 phút — không bỏ buổi nào',
        exercises:['Squat tường hoặc ghế 2×10','Push-up tường 2×8','Glute bridge 2×10','Plank gối 2×15s'],
        passWhen:'Cảm giác "nhẹ" — làm xong không thấy nặng nhọc',
        tip:'Cài báo thức cố định — không suy nghĩ, cứ làm. Não bộ tự động hóa sau 4–6 tuần.',
        unlocks:'Circuit 3 vòng' },
      { n:2, title:'Tăng Vòng', period:'Ngày 15–28', stepColor:'lime',
        badge:'🌿 Nảy Mầm',
        target:'Làm được 3 vòng × 4 bài liên tục trong 10 phút',
        exercises:['Circuit 3 vòng: Squat 10 → Push-up 8 → Glute bridge 10 → Plank 20s','Nghỉ 15–20s giữa bài, 30s giữa vòng'],
        passWhen:'3 vòng liên tục không cảm thấy muốn dừng',
        tip:'Thêm 1 vòng mỗi 2 tuần — đừng vội. 10 phút sẽ tự nhiên trở thành 12–15 phút.',
        unlocks:'Biến thể khó hơn' },
      { n:3, title:'Nâng Biến Thể', period:'Ngày 29–49', stepColor:'blue',
        badge:'⬆️ Leo Bậc',
        target:'Thay bài dễ bằng bài khó hơn — chỉ nâng 1 bài/tuần',
        exercises:['Squat sâu thay squat tường','Push-up gối thay push-up tường','Plank thẳng thay plank gối','Glute bridge + giữ 2s ở đỉnh'],
        passWhen:'Form chuẩn 2 tuần liên tiếp với biến thể mới',
        tip:'Không nâng cả 4 cùng lúc. 1 biến thể/tuần để cơ thể thích nghi.',
        unlocks:'Tạ tay nhẹ' },
      { n:4, title:'Thêm Tải', period:'Ngày 50–70', stepColor:'orange',
        badge:'💪 Vững Mạnh',
        target:'Dùng tạ 2–4kg hoặc band kháng lực cho squat và row',
        exercises:['Goblet squat 2–4kg × 3×10','Band row 3×12','Hip thrust với ghế 3×12','Dead bug 3×8/bên'],
        passWhen:'2 tuần với tải mới, form không giảm chất lượng',
        tip:'Bắt đầu tải nhẹ hơn bạn nghĩ — dễ tăng sau, khó sửa chấn thương.',
        unlocks:'Lịch 5 ngày/tuần' },
      { n:5, title:'Cá Nhân Hóa', period:'Ngày 71+', stepColor:'purple',
        badge:'🏆 Thành Thạo',
        target:'Thiết kế lịch tập riêng — chọn bài theo cơ thể mỗi ngày',
        exercises:['Chọn 3–4 bài theo cảm giác','Tăng giảm tải linh hoạt','Thêm 1 buổi cardio nhẹ cuối tuần','Duy trì > 60 ngày liên tiếp'],
        passWhen:'Duy trì > 60 ngày — thói quen thành bản sắc',
        tip:'Đây là điểm tập không còn là "phải làm" mà là "muốn làm". Bạn đã thắng.',
        unlocks:'Chương trình nâng cao tùy chọn' },
    ],
  },
  {
    id:'beginner', icon:'🌱', name:'Người Mới', color:'green',
    tagline:'Form đúng trước, tải trọng sau — 4 tuần đầu đầu tư hệ thần kinh',
    steps:[
      { n:1, title:'Form Nền Tảng', period:'Tuần 1–2', stepColor:'green',
        badge:'🌱 Khởi Đầu',
        target:'Học 5 mẫu đúng form — chưa cần tốc độ hay nhiều',
        exercises:['Squat to chair: hông chạm ghế, gối theo ngón','Wall push-up: thân thẳng, khuỷu 45°','Glute bridge: bóp mông ở đỉnh giữ 2s','Dead bug: lưng dán sàn hoàn toàn','Plank gối: thở bình thường'],
        passWhen:'Làm được 2×10 mỗi bài — form ổn định 2 buổi liên tiếp',
        tip:'Quay video ngắn bản thân rồi xem lại — cách nhanh nhất để tự nhận ra lỗi form.',
        unlocks:'3 hiệp' },
      { n:2, title:'Xây Volume', period:'Tuần 3–4', stepColor:'lime',
        badge:'📈 Tăng Dần',
        target:'Tăng từ 2 lên 3 hiệp khi form ổn định',
        exercises:['Squat to chair 3×10','Wall push-up 3×10','Glute bridge 3×12','Dead bug 3×8/bên','Plank gối 3×20–25s'],
        passWhen:'Nhịp tim về bình thường trong 2 phút sau khi xong 3 hiệp',
        tip:'Ghi nhật ký: số reps, mệt 1-10, điều cần cải thiện. Sau 4 tuần đọc lại.',
        unlocks:'Squat sâu hơn' },
      { n:3, title:'Nâng Biến Thể', period:'Tuần 5–6', stepColor:'blue',
        badge:'⬆️ Tiến Bộ',
        target:'Chuyển từng bài sang phiên bản khó hơn — 1 bài/tuần',
        exercises:['Squat sâu (đùi song song) thay squat tường','Push-up gối thay wall push-up','Hip thrust với ghế thay glute bridge','Plank thẳng 20–25s'],
        passWhen:'2 tuần với biến thể mới — cảm thấy kiểm soát được',
        tip:'Không nâng tất cả cùng lúc. Cơ thể cần 7–10 ngày thích nghi từng biến thể.',
        unlocks:'Tạ nhẹ 2–4kg' },
      { n:4, title:'Thêm Kháng Lực', period:'Tuần 7–8', stepColor:'orange',
        badge:'🏋️ Có Tải',
        target:'Thêm tạ 2–4kg hoặc band kháng lực',
        exercises:['Goblet squat 2–4kg × 3×10','Band row 3×12','Romanian DL với tạ 3×10','Hip thrust + tạ trên hông 3×12'],
        passWhen:'2 tuần với tải mới, form không giảm chất lượng',
        tip:'Bắt đầu nhẹ hơn bạn nghĩ là đủ. Dễ tăng sau, khó sửa chấn thương.',
        unlocks:'Upper/Lower split' },
      { n:5, title:'Split Training', period:'Tuần 9–12', stepColor:'teal',
        badge:'🎯 Chuyên Biệt',
        target:'Tách buổi upper body và lower body — 4 ngày/tuần',
        exercises:['Upper: Push + Row + Overhead + Face pull','Lower: Squat + RDL + Hip thrust + Calf raise','Core: Plank + Dead bug + Bird dog mỗi ngày'],
        passWhen:'Hoàn thành 12 tuần — đủ điều kiện vào Giảm Mỡ hoặc Tăng Cơ',
        tip:'Sau 12 tuần bạn đã xây nền tốt hơn 90% người bắt đầu. Tiếp tục chu kỳ mới.',
        unlocks:'Lộ trình Giảm Mỡ hoặc Tăng Cơ' },
    ],
  },
  {
    id:'fatloss', icon:'🔥', name:'Giảm Mỡ', color:'orange',
    tagline:'Thâm hụt 200–400 kcal/ngày + strength giữ cơ + Zone 2',
    steps:[
      { n:1, title:'Nền Tảng Cardio', period:'Tuần 1–4', stepColor:'teal',
        badge:'🚶 Bắt Đầu',
        target:'Zone 2 cardio 30\' × 2 buổi + strength 3×/tuần',
        exercises:['Đi bộ nhanh hoặc jogging Zone 2 30\'','3 buổi strength: squat + push + hinge + core','Nhịp tim 120–140 bpm suốt buổi cardio'],
        passWhen:'4 tuần — vòng eo giảm ≥ 2cm hoặc cân giảm 1.2–2kg',
        tip:'Đo vòng eo buổi sáng mỗi tuần. Cân dao động ±2kg/ngày — vòng eo mới phản ánh thật.',
        unlocks:'Cardio 35–40 phút' },
      { n:2, title:'Tăng Cardio', period:'Tuần 5–8', stepColor:'orange',
        badge:'🏃 Tăng Tốc',
        target:'Cardio tăng lên 35–40\'; thêm 2000–3000 bước NEAT/ngày',
        exercises:['Cardio Zone 2: 35–40\' × 3 buổi','Strength: tăng 1 hiệp hoặc tải +5%','NEAT: đi bộ cầu thang, đứng làm việc nhiều hơn'],
        passWhen:'Cùng nhịp tim nhưng tốc độ đi bộ/chạy nhanh hơn — fitness cải thiện',
        tip:'NEAT đốt 200–400 kcal/ngày. Đây là khoản đầu tư không cần tập thêm.',
        unlocks:'Interval training' },
      { n:3, title:'Thêm Interval', period:'Tuần 9–12', stepColor:'yellow',
        badge:'⚡ Đốt Mỡ',
        target:'1 buổi interval/tuần: 5 × 2\' nhanh + 2\' chậm',
        exercises:['LISS × 2: 40\' Zone 2','Interval × 1: 5×2\' nhanh + 2\' chậm','Strength × 3: progressive overload liên tục'],
        passWhen:'Vòng eo tổng giảm 3–5cm sau 12 tuần',
        tip:'Interval tạo EPOC (đốt mỡ sau tập) nhưng không thay thế Zone 2 — cần cả hai.',
        unlocks:'12-week body recomposition review' },
      { n:4, title:'Duy Trì Bền Vững', period:'Tuần 13+', stepColor:'green',
        badge:'🎯 Bền Vững',
        target:'Duy trì body composition mà không cần theo dõi calo mỗi ngày',
        exercises:['Tập theo cảm giác — không cần đếm calo','Strength 3×/tuần + cardio 2×/tuần','Theo dõi vòng eo hàng tháng, không hàng ngày'],
        passWhen:'Duy trì kết quả ≥ 3 tháng không yo-yo',
        tip:'Mục tiêu cuối: lối sống, không phải chế độ. Khi thức ăn không còn là kẻ thù.',
        unlocks:'Tự do với thực đơn — intuitive eating' },
    ],
  },
  {
    id:'muscle', icon:'💪', name:'Tăng Cơ', color:'blue',
    tagline:'Progressive overload là vua — protein 1.6g/kg — ngủ 7–8h',
    steps:[
      { n:1, title:'Form Compound', period:'Tuần 1–4', stepColor:'blue',
        badge:'🔨 Nền Móng',
        target:'Học form 4 compound lifts: squat, push, row, hinge ở RPE 7',
        exercises:['Squat 3×10 RPE 7 — gối theo ngón chân','Push-up nâng cao hoặc bench press 4×8','Dumbbell row 4×10 — lưng thẳng, kéo khuỷu về hông','Romanian DL 3×10 — cảm nhận chuỗi sau'],
        passWhen:'RPE 7 ổn định 2 buổi liên tiếp — form không thay đổi',
        tip:'Không tăng tải khi form chưa đẹp. Tải sai tư thế = tiến bộ âm.',
        unlocks:'4 hiệp compound' },
      { n:2, title:'Xây Volume', period:'Tuần 5–8', stepColor:'blue',
        badge:'📊 Tăng Thể Tích',
        target:'Tăng từ 3 lên 4 hiệp; thêm overhead press và hip thrust',
        exercises:['Compound: 4 hiệp × 8–10','Thêm: Overhead press + Face pull','Thêm: Hip thrust + Calf raise','Tăng tải +2.5kg/tuần khi form ổn định'],
        passWhen:'PR nhỏ mỗi tuần trong 8 tuần liên tiếp',
        tip:'"Quy tắc 2 lần": 2 buổi liên tiếp đủ 12 reps → tăng tải tuần sau.',
        unlocks:'Upper/Lower full split' },
      { n:3, title:'Upper/Lower Split', period:'Tuần 9–12', stepColor:'purple',
        badge:'⚖️ Cân Bằng',
        target:'Upper A/B và Lower A/B: 4 ngày/tuần — pull ≥ push',
        exercises:['Upper A: Chest + Back (push-row superset)','Upper B: Shoulder + Arms','Lower A: Quad dominant (squat biến thể)','Lower B: Hip dominant (deadlift biến thể)'],
        passWhen:'Test 12 tuần: push-up tăng ≥5 reps; squat cảm thấy nhẹ hơn',
        tip:'Kéo luôn phải ≥ đẩy để tránh mất cân bằng và chấn thương vai.',
        unlocks:'Mesocycle 2 — Periodization' },
      { n:4, title:'Periodization', period:'Tuần 13–24', stepColor:'purple',
        badge:'🗓️ Chu Kỳ Hóa',
        target:'Tăng load 3 tuần → deload 1 tuần. Theo dõi HRV.',
        exercises:['Mesocycle 3+1: 3 tuần tăng + 1 tuần deload 40%','Test PR cuối mỗi mesocycle','HRV thấp buổi sáng → giảm tải hôm đó'],
        passWhen:'Deadlift ≥ 1× trọng lượng cơ thể sau 6 tháng',
        tip:'Deload không phải nghỉ — cơ thể đang supercompensate và phát triển nhiều nhất.',
        unlocks:'Advanced hypertrophy program' },
    ],
  },
  {
    id:'endurance', icon:'🏃', name:'Sức Bền', color:'teal',
    tagline:'80% Zone 2 — xây nền trước, tốc độ đến sau',
    steps:[
      { n:1, title:'Xây Nền Zone 2', period:'Tuần 1–4', stepColor:'teal',
        badge:'🌊 Nền Tảng',
        target:'Zone 2 30\' × 3 buổi. Xen kẽ chạy 1\' + đi bộ 2\'',
        exercises:['Chạy/đi bộ xen kẽ 30\': chạy 1\' + đi 2\'','Strength tối thiểu 2×/tuần','Nhịp tim 120–135 bpm — còn nói chuyện thoải mái'],
        passWhen:'Đi bộ 3km liên tục không hụt hơi',
        tip:'Zone 2 buồn chán là dấu hiệu đang làm đúng. Đây là nền cho mọi sức bền.',
        unlocks:'Chạy liên tục 5–10 phút' },
      { n:2, title:'Chạy Liên Tục', period:'Tuần 5–8', stepColor:'green',
        badge:'🏃 Chạy Được',
        target:'Chạy bộ liên tục 5–10 phút Zone 2 không dừng',
        exercises:['Chạy liên tục 8–10\' Zone 2','Interval nhẹ × 1: 4 × 2\' nhanh + 2\' chậm','Long run cuối tuần: 40\' kết hợp chạy + đi'],
        passWhen:'Chạy 10 phút liên tục, nhịp tim ≤ 140 bpm',
        tip:'"Còn hát nhẹ được không?" — test đơn giản nhất cho Zone 2.',
        unlocks:'5km liên tục' },
      { n:3, title:'Mục Tiêu 5km', period:'Tuần 9–12', stepColor:'blue',
        badge:'5️⃣ 5km Goal',
        target:'Chạy 5km liên tục Zone 2 không dừng',
        exercises:['Long run cuối tuần: 50–60\' (chạy + đi)','Interval: 5×2\' Zone 3–4','Zone 2 runs: 20–25\' liên tục'],
        passWhen:'Hoàn thành 5km chạy liên tục dù chậm',
        tip:'5km là milestone tâm lý quan trọng nhất. Sau đó mọi thứ dễ hơn rất nhiều.',
        unlocks:'10km program' },
      { n:4, title:'Tempo & Race', period:'Tuần 13+', stepColor:'teal',
        badge:'🏅 Runner',
        target:'Tempo run 20\' Zone 3 + đăng ký sự kiện 5km',
        exercises:['Tempo run: 20\' Zone 3/tuần','Long run: 60–90\' Zone 2','Đăng ký sự kiện 5km hoặc 10km'],
        passWhen:'Hoàn thành sự kiện 5km — bất kể thời gian',
        tip:'Đăng ký race tạo commitment mạnh nhất. Bạn sẽ không bỏ tập khi đã đóng tiền đăng ký.',
        unlocks:'Half marathon journey' },
    ],
  },
  {
    id:'advanced', icon:'🏆', name:'Nâng Cao', color:'purple',
    tagline:'Periodization + đa môn + HRV tracking',
    steps:[
      { n:1, title:'Đa Môn Nền', period:'Tuần 1–4', stepColor:'purple',
        badge:'⚖️ Cân Bằng',
        target:'Gym 4× + cardio dài 2× + mobility 1× + theo dõi HRV',
        exercises:['Upper/Lower split 4×/tuần','Zone 2 cardio 40–50\' × 2','Mobility/yoga 1× cuối tuần','Theo dõi HRV buổi sáng hằng ngày'],
        passWhen:'Volume tổng ổn định 4 tuần — HRV không giảm liên tục',
        tip:'Học HRV ngay: HRV thấp = giảm tải hôm đó. Kỹ năng quan trọng nhất của vận động viên.',
        unlocks:'Brick training' },
      { n:2, title:'Brick Training', period:'Tuần 5–8', stepColor:'blue',
        badge:'🧱 Ghép Môn',
        target:'Tập 2 môn liên tiếp trong 1 buổi (đạp xe → chạy)',
        exercises:['Đạp xe Zone 2 40\' → chạy bộ 20\' (brick)','Upper gym + bơi 1×/tuần','Strength + cardio cùng buổi 1×/tuần'],
        passWhen:'Brick workout liên tục 4 tuần không cảm thấy overreach',
        tip:'Brick dạy cơ thể chuyển từ môn này sang môn khác — quan trọng cho triathlon.',
        unlocks:'Peak phase' },
      { n:3, title:'Peak & Taper', period:'Tuần 9–16', stepColor:'orange',
        badge:'🔥 Đỉnh Cao',
        target:'Peak load 2 tuần → taper 2 tuần → thi đấu',
        exercises:['Peak: 90% max volume × 2 tuần','Taper: giảm 30–40% volume × 1–2 tuần','Race day: warm-up đầy đủ, không thử tốc độ mới'],
        passWhen:'Hoàn thành sự kiện mục tiêu',
        tip:'Taper không phải nghỉ ngơi — cơ bắp đang supercompensate trong giai đoạn này.',
        unlocks:'Off-season recovery' },
      { n:4, title:'Recovery & Reset', period:'Sau race', stepColor:'teal',
        badge:'♻️ Phục Hồi',
        target:'Off-season 2–4 tuần, rồi bắt đầu chu kỳ mới',
        exercises:['Off-season: vận động nhẹ, không áp lực','Đánh giá điểm mạnh yếu chu kỳ vừa','Lên kế hoạch mục tiêu chu kỳ tiếp theo'],
        passWhen:'Cảm thấy muốn tập lại — dấu hiệu đã đủ nghỉ',
        tip:'Elite runners dành 8–12 tuần off-season mỗi năm. Đừng sợ nghỉ có kế hoạch.',
        unlocks:'New season goals' },
    ],
  },
];

// ─── Goal selector pill ────────────────────────────────────────────────────────
function GoalPill({ goal, active, onClick }) {
  const gc = C[goal.color] || C.green;
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-bold
        border transition-all duration-200 cursor-pointer shrink-0
        ${active
          ? `${gc.bg} ${gc.border} ${gc.text}`
          : 'bg-white/4 border-white/8 text-muted hover:border-white/16 hover:text-text'
        }
      `}
      style={active ? { boxShadow: `0 0 16px ${gc.glow}` } : {}}
    >
      <span>{goal.icon}</span>
      <span>{goal.name}</span>
    </button>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step, index, isActive, isMyLevel, isLast, onClick, onSetLevel, goalColor }) {
  const sc = C[step.stepColor] || C.green;
  const gc = C[goalColor] || C.green;

  return (
    <div
      className="relative flex flex-col"
      style={{ paddingTop: `${index * 28 + 16}px` }}
    >
      {/* Connector line to next step (hidden on last) */}
      {!isLast && (
        <div
          className="hidden md:block absolute top-0 right-0 w-px"
          style={{
            height: `${index * 28 + 16 + 8}px`,
            background: `linear-gradient(to bottom, transparent, ${sc.glow.replace('0.2', '0.4')})`,
          }}
        />
      )}

      <div
        onClick={onClick}
        className={`
          relative overflow-hidden rounded-xl border cursor-pointer
          transition-all duration-250 group
          ${isActive
            ? `${sc.bg} ${sc.border}`
            : isMyLevel
            ? 'bg-yellow-500/8 border-yellow-500/40'
            : 'bg-surface border-border hover:border-white/16 hover:bg-white/4'
          }
        `}
        style={isActive ? { boxShadow: `0 4px 24px ${sc.glow}` } : isMyLevel ? { boxShadow: '0 4px 24px rgba(234,179,8,0.25)' } : {}}
      >
        {/* My-level golden crown indicator */}
        {isMyLevel && (
          <div className="absolute top-1.5 right-1.5 text-[10px] bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-full px-1.5 py-0.5 font-bold leading-none">
            Tôi đây
          </div>
        )}

        <div className="p-3">
          {/* Step number + period */}
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-black border ${sc.border} ${sc.bg} ${sc.text}`}
            >
              {step.n}
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
              {step.period}
            </span>
          </div>

          {/* Title */}
          <p className={`font-black text-lg mb-1 transition-colors ${isActive ? sc.text : 'text-text group-hover:text-text'}`}>
            {step.title}
          </p>

          {/* Target (collapsed to 2 lines) */}
          <p className="text-[10px] text-muted leading-relaxed line-clamp-2">
            {step.target}
          </p>

          {/* Badge */}
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10px] text-muted/60">{step.badge}</span>
          </div>
        </div>

        {/* Active indicator line at bottom */}
        {isActive && <div className={`h-0.5 w-full ${sc.bar}`} />}
      </div>

      {/* "Tôi đang ở bước này" button — shown on hover or if active */}
      <button
        onClick={(e) => { e.stopPropagation(); onSetLevel(); }}
        className={`
          mt-1.5 w-full text-[10px] font-bold py-1 rounded-lg border cursor-pointer
          transition-all duration-200
          ${isMyLevel
            ? `${gc.bg} ${gc.border} ${gc.text}`
            : 'bg-transparent border-white/8 text-muted/50 hover:border-white/20 hover:text-muted'
          }
        `}
      >
        {isMyLevel ? 'Bước hiện tại' : 'Tôi đang ở đây'}
      </button>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({ step, goalColor }) {
  if (!step) return null;
  const sc = C[step.stepColor] || C.green;

  return (
    <div
      className={`mt-6 rounded-2xl border ${sc.border} ${sc.bg} p-5 animate-fade-in-up`}
      style={{ boxShadow: `0 8px 40px ${sc.glow}` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-black border ${sc.border} ${sc.text}`}>
          {step.n}
        </div>
        <div>
          <h3 className={`font-black text-lg ${sc.text}`}>{step.title}</h3>
          <p className="text-[10px] text-muted">{step.period}</p>
        </div>
        <span className={`ml-auto text-base font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
          {step.badge}
        </span>
      </div>

      {/* Target */}
      <div className="mb-4">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Mục tiêu bước này</p>
        <p className="text-lg text-text leading-relaxed">{step.target}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Exercises */}
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Bài tập</p>
          <ul className="space-y-1.5">
            {step.exercises.map((ex, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-text/80 leading-relaxed">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${sc.dot}`} />
                {ex}
              </li>
            ))}
          </ul>
        </div>

        {/* Pass criteria + tip */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">Vượt bước khi</p>
            <p className="text-base text-text/80 leading-relaxed">{step.passWhen}</p>
          </div>

          {/* Tip callout */}
          <div className={`rounded-xl border ${sc.border} ${sc.bg} p-3`}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: sc.hex.replace(')', '') }}>
              <span className={sc.text}>Mẹo huấn luyện viên</span>
            </p>
            <p className="text-[11px] text-muted leading-relaxed">{step.tip}</p>
          </div>

          {/* Unlocks */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted">Mở khóa:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.border} ${sc.text} ${sc.bg}`}>
              {step.unlocks}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProgressionStaircase() {
  const [activeGoal, setActiveGoal]   = useState(0);
  const [activeStep, setActiveStep]   = useState(null);
  const [myLevel, setMyLevel]         = useState(null); // { goalId, stepN }

  const goalData = GOAL_DATA[activeGoal];
  const gc = C[goalData.color] || C.green;

  // Reset active step when goal changes
  const handleGoalChange = (idx) => {
    setActiveGoal(idx);
    setActiveStep(null);
  };

  const handleStepClick = (stepN) => {
    setActiveStep(prev => prev === stepN ? null : stepN);
  };

  const handleSetLevel = (goalId, stepN) => {
    setMyLevel(prev =>
      prev && prev.goalId === goalId && prev.stepN === stepN ? null : { goalId, stepN }
    );
  };

  const activeStepData = goalData.steps.find(s => s.n === activeStep) || null;
  const myLevelForCurrentGoal = myLevel && myLevel.goalId === goalData.id ? myLevel : null;
  const myLevelStep = myLevelForCurrentGoal
    ? goalData.steps.find(s => s.n === myLevelForCurrentGoal.stepN)
    : null;
  const nextStep = myLevelStep
    ? goalData.steps.find(s => s.n === myLevelStep.n + 1)
    : null;

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black text-text mb-1.5 flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
            style={{ background: gc.glow, border: `1px solid ${gc.hex}40` }}
          >
            📈
          </span>
          Bậc Thang Tiến Bộ
        </h2>
        <p className="text-muted text-lg">Chọn mục tiêu — xem lộ trình từng bước — đánh dấu bước bạn đang ở</p>
      </div>

      {/* Goal selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {GOAL_DATA.map((goal, idx) => (
          <GoalPill
            key={goal.id}
            goal={goal}
            active={activeGoal === idx}
            onClick={() => handleGoalChange(idx)}
          />
        ))}
      </div>

      {/* Goal intro mini-card */}
      <div
        className={`mb-6 rounded-xl border ${gc.border} ${gc.bg} px-4 py-3 flex items-center gap-3`}
        style={{ boxShadow: `0 2px 20px ${gc.glow}` }}
      >
        <span className="text-3xl">{goalData.icon}</span>
        <div>
          <p className={`font-black text-lg ${gc.text}`}>{goalData.name}</p>
          <p className="text-[11px] text-muted leading-relaxed">{goalData.tagline}</p>
        </div>
      </div>

      {/* My level summary banner */}
      {myLevelStep && (
        <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/8 px-4 py-3 flex items-center gap-3 animate-fade-in-up">
          <span className="text-yellow-400 text-xl">⭐</span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-yellow-400">
              Bạn đang ở <span className="text-yellow-300">Bước {myLevelStep.n}: {myLevelStep.title}</span>
              {nextStep && (
                <span className="text-yellow-400/60"> — tiếp theo: {nextStep.title}</span>
              )}
              {!nextStep && (
                <span className="text-yellow-400/60"> — bạn đã hoàn thành lộ trình!</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setMyLevel(null)}
            className="text-[10px] text-yellow-400/60 hover:text-yellow-400 cursor-pointer transition-colors shrink-0"
          >
            Xóa
          </button>
        </div>
      )}

      {/* ── Staircase ── */}
      {/* Desktop: ascending columns, items-end aligns all cards to bottom */}
      <div className="hidden md:flex items-end gap-2">
        {goalData.steps.map((step, i) => (
          <div key={step.n} className="flex-1 min-w-0">
            <StepCard
              step={step}
              index={i}
              isActive={activeStep === step.n}
              isMyLevel={!!(myLevelForCurrentGoal && myLevelForCurrentGoal.stepN === step.n)}
              isLast={i === goalData.steps.length - 1}
              onClick={() => handleStepClick(step.n)}
              onSetLevel={() => handleSetLevel(goalData.id, step.n)}
              goalColor={goalData.color}
            />
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative">
        <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-white/10 via-white/6 to-transparent" />
        <div className="space-y-3 pl-10">
          {goalData.steps.map((step, i) => {
            const sc = C[step.stepColor] || C.green;
            const isActive = activeStep === step.n;
            const isMyLevel = !!(myLevelForCurrentGoal && myLevelForCurrentGoal.stepN === step.n);
            return (
              <div key={step.n} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[26px] w-4 h-4 rounded-full border-2 flex items-center justify-center top-4 transition-all duration-200 ${sc.dot} ${isActive ? 'scale-125' : 'scale-100'}`}
                  style={{ borderColor: sc.hex, background: isActive ? sc.hex : '#111' }}
                />
                <div
                  onClick={() => handleStepClick(step.n)}
                  className={`
                    relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-200
                    ${isActive ? `${sc.bg} ${sc.border}` : isMyLevel ? 'bg-yellow-500/8 border-yellow-500/40' : 'bg-surface border-border hover:border-white/16'}
                  `}
                  style={isActive ? { boxShadow: `0 4px 20px ${sc.glow}` } : {}}
                >
                  {isMyLevel && (
                    <div className="absolute top-2 right-2 text-[9px] bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-full px-1.5 py-0.5 font-bold">
                      Tôi đây
                    </div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
                        Bước {step.n}
                      </span>
                      <span className="text-[9px] text-muted">{step.period}</span>
                    </div>
                    <p className={`font-black text-lg mb-0.5 ${isActive ? sc.text : 'text-text'}`}>{step.title}</p>
                    <p className="text-[11px] text-muted leading-relaxed line-clamp-2">{step.target}</p>
                    {isActive && <div className={`mt-2 h-0.5 w-full ${sc.bar} rounded`} />}
                  </div>
                </div>

                {/* Set level button */}
                <button
                  onClick={() => handleSetLevel(goalData.id, step.n)}
                  className={`
                    mt-1 w-full text-[10px] font-bold py-1 rounded-lg border cursor-pointer transition-all duration-200
                    ${isMyLevel
                      ? `${gc.bg} ${gc.border} ${gc.text}`
                      : 'bg-transparent border-white/8 text-muted/50 hover:border-white/20 hover:text-muted'
                    }
                  `}
                >
                  {isMyLevel ? 'Bước hiện tại' : 'Tôi đang ở đây'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {activeStepData && (
        <DetailPanel step={activeStepData} goalColor={goalData.color} />
      )}
    </section>
  );
}
