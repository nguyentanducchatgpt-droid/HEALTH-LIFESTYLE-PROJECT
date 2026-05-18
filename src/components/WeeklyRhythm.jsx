import { useState, useEffect, useRef } from 'react';

/* ── Color palette ── */
const C = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  dot:'bg-green-400',  hex:'#22c55e', glow:'rgba(34,197,94,0.2)'   },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/10',   border:'border-lime-500/30',   bar:'bg-lime-500',   dot:'bg-lime-400',   hex:'#a3e635', glow:'rgba(163,230,53,0.2)'  },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   dot:'bg-teal-400',   hex:'#14b8a6', glow:'rgba(20,184,166,0.2)'  },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   dot:'bg-blue-400',   hex:'#3b82f6', glow:'rgba(59,130,246,0.2)'  },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', dot:'bg-purple-400', hex:'#a855f7', glow:'rgba(168,85,247,0.2)'  },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', dot:'bg-orange-400', hex:'#f97316', glow:'rgba(249,115,22,0.2)'  },
  gray:   { text:'text-muted',      bg:'bg-white/3',       border:'border-border',        bar:'bg-muted/30',   dot:'bg-muted/40',   hex:'#6b7280', glow:'rgba(100,100,100,0.1)' },
};

/* ── Day-type images ── */
const IMG = {
  strength: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=65',
  cardio:   'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=65',
  hiit:     'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&q=65',
  mobility: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=65',
  recovery: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=65',
  rest:     'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=65',
};

/* ── Weekly schedule data — 3 phases × 7 days ── */
const PHASES = [
  {
    id: 0, label: 'Nền Tảng', sub: 'Tuần 1–4', icon: '🌱', color: 'green',
    stats: [
      { label: 'Strength', value: '3 buổi/tuần',   icon: '🏋️' },
      { label: 'Cardio',   value: '2 buổi/tuần',   icon: '🚶' },
      { label: 'Cường độ', value: 'RPE 5–6',        icon: '⚡' },
      { label: 'Thể tích', value: '60% max',        icon: '📊' },
    ],
    focus: 'Học form đúng trước — tập đều hơn tập nhiều',
    tip: 'Cơ thể cần 4–6 tuần để thần kinh cơ học cách điều phối. 1 buổi đúng form tốt hơn 3 buổi sai tư thế.',
    days: [
      { day:'T2', type:'Strength A', icon:'🏋️', color:'green', img:'strength', duration:'20–25\'',
        exercises:['Squat to chair 3×10 — hông xuống thẳng, gối theo hướng ngón chân','Wall push-up 3×10 — giữ thân thẳng, không đổ hông','Glute bridge 3×12 — bóp mông ở đỉnh, giữ 2s','Dead bug 3×8/bên — lưng dán sàn, thở ra khi hạ tay/chân'],
        tip:'Squat: chưa cần xuống sâu — đúng form quan trọng hơn độ sâu.' },
      { day:'T3', type:'Cardio Zone 2', icon:'🏃', color:'teal', img:'cardio', duration:'20–25\'',
        exercises:['Đi bộ nhanh 20–25\' hoặc xen kẽ: đi bộ 2\' + chạy bộ nhẹ 1\' lặp 7–8 vòng','Chạy bộ lần đầu: giảm tốc ngay khi không còn nói được câu ngắn','Nhịp tim mục tiêu: 120–135 bpm — còn nói được = đúng Zone 2','Kết thúc: giãn bắp chân 30s/bên + đùi trước 30s/bên'],
        tip:'Zone 2 = "cardio nói chuyện được" — đây là ngưỡng đốt mỡ và xây nền sức bền tốt nhất. Đừng tập nhanh hơn ngưỡng này trong giai đoạn đầu.' },
      { day:'T4', type:'Strength B', icon:'🏋️', color:'green', img:'strength', duration:'20–25\'',
        exercises:['Hip hinge 3×12 — lưng thẳng, hông đẩy sau, không cúi đầu gối','Towel row 3×10 — khuỷu tay siết về phía hông, không nhún vai','Bird-dog 3×8/bên — duỗi tay và chân đối diện, giữ hông thẳng','Calf raise 3×15 — đứng chậm lên và xuống, giữ 1s ở đỉnh'],
        tip:'Hip hinge là nền tảng của deadlift — cảm nhận kéo căng sau đùi mới đúng.' },
      { day:'T5', type:'Mobility', icon:'🧘', color:'purple', img:'mobility', duration:'15–20\'',
        exercises:['Giãn hông 90/90: 1–2\'/bên — thở sâu, không ép gắng sức','Pigeon pose: 1\'/bên — cảm giác căng nhẹ là bình thường, đau nhói → dừng','Thoracic rotation: 10 lần/bên — xoay lưng trên, hông giữ nguyên','Calf stretch + ankle circle: 30s/bên'],
        tip:'Ngày mobility KHÔNG phải ngày nghỉ lười — đây là đầu tư phục hồi quan trọng.' },
      { day:'T6', type:'Strength C', icon:'🏋️', color:'green', img:'strength', duration:'20–25\'',
        exercises:['Sit-to-stand 3×10 — đứng lên ngồi xuống không dùng tay','Scapular squeeze 3×12 — kéo hai vai ra sau, giữ 2s','Glute bridge march 3×10 — giữ hông trên cao, nâng chân xen kẽ','Plank gối 3×20s — thở nhịp nhàng, không nín thở, không trễ hông'],
        tip:'Plank: focus vào bụng, không vào thời gian. 15s đúng tốt hơn 60s sai.' },
      { day:'T7', type:'Cardio + Thiên nhiên', icon:'🌳', color:'teal', img:'cardio', duration:'25–30\'',
        exercises:['Đi bộ ngoài trời 25–30\' (hoặc chạy nhẹ 15–20\' nếu đã quen ở T3) — không vừa tập vừa nhìn điện thoại','Cảnh vật xung quanh → kích thích thị giác → giảm stress hiệu quả','Sau tập: ghi 5 dòng nhật ký — cảm giác, điều cải thiện, điều cần duy trì'],
        tip:'Ánh sáng tự nhiên buổi sáng reset đồng hồ sinh học — giúp ngủ ngon hơn tối hôm đó. Chạy bộ ngoài trời tốt hơn máy chạy bộ về mặt tâm lý.' },
      { day:'CN', type:'Nghỉ ngơi', icon:'💆', color:'gray', img:'rest', duration:'Tự do',
        exercises:['Review: hoàn thành bao nhiêu buổi trong 7 ngày?','Chuẩn bị lịch + bữa ăn cho tuần sau (meal prep nhỏ)','Ngủ đủ 7–8 tiếng — đây LÀ buổi tập (cơ phục hồi trong giấc ngủ)','Uống đủ nước: 2–2.5L/ngày mục tiêu'],
        tip:'Cơ phát triển TRONG LÚC NGHỈ, không phải lúc tập. Đừng bỏ ngày này.' },
    ],
  },
  {
    id: 1, label: 'Xây Nền', sub: 'Tuần 5–8', icon: '📈', color: 'lime',
    stats: [
      { label: 'Strength', value: '4 buổi/tuần',   icon: '🏋️' },
      { label: 'Cardio',   value: '2 buổi/tuần',   icon: '🏃' },
      { label: 'Cường độ', value: 'RPE 6–7',        icon: '⚡' },
      { label: 'Thể tích', value: '75% max',        icon: '📊' },
    ],
    focus: 'Progressive overload — tăng đều đặn mỗi tuần 5–10%',
    tip: 'Quy tắc 2 lần: nếu bài tập dễ 2 buổi liên tiếp → tăng tải 5–10% hoặc thêm 1–2 reps. Không tăng đột ngột.',
    days: [
      { day:'T2', type:'Strength A', icon:'🏋️', color:'lime', img:'strength', duration:'25–30\'',
        exercises:['Goblet squat 3×10 (tạ nhẹ 4–8kg) — giữ tạ sát ngực, khuỷu tay vào trong','Push-up chuẩn 3×8–10 — thân thẳng như ván, không đổ hông xuống','Band row 3×12 — kéo khuỷu tay về phía hông, bóp lưng giữa 2s','Plank thẳng 3×25–30s — hông ngang vai, thở bình thường'],
        tip:'Goblet squat: hông xuống giữa 2 gót chân — cảm nhận kéo căng háng nội.' },
      { day:'T3', type:'Cardio Z2', icon:'🏃', color:'blue', img:'cardio', duration:'30\'',
        exercises:['Chạy bộ jogging, đi bộ nhanh, hoặc đạp xe 30\' liên tục','Chạy bộ: mục tiêu chạy liên tục 5–10 phút Zone 2, xen kẽ đi bộ khi cần','Nhịp tim: 120–140 bpm — nếu cao hơn → chậm lại','5\' warm-up chậm + 20\' Zone 2 chính + 5\' cool-down giãn cơ'],
        tip:'Tuần 5–8: nếu ở Tuần 1–4 chỉ đi bộ, đây là lúc thử chạy nhẹ xen kẽ. Cơ thể đã sẵn sàng hơn.' },
      { day:'T4', type:'Strength B', icon:'🏋️', color:'lime', img:'strength', duration:'25–30\'',
        exercises:['Romanian DL 3×10 (tạ/dây) — cảm nhận kéo căng sau đùi, lưng thẳng','Split squat 3×8/chân — gối sau gần sàn, trọng lượng vào chân trước','Dead bug 3×10 — lưng hoàn toàn dán sàn, di chuyển chậm từng bên','Hip thrust 3×12 — dùng ghế/sofa, bóp mông ở đỉnh, giữ 2s'],
        tip:'RDL: nếu không cảm nhận được sau đùi → nghĩa là chưa đủ sâu hoặc gối quá thẳng.' },
      { day:'T5', type:'Active Recovery', icon:'🌿', color:'teal', img:'recovery', duration:'15–20\'',
        exercises:['Giãn toàn thân nhẹ nhàng 10–15\' — không stretch đến mức đau','Đi bộ chậm 10\' tùy chọn — tăng lưu thông máu, giảm DOMS','Foam roll: đùi trước, đùi sau, lưng dưới — 30s–1\' mỗi vùng'],
        tip:'Active recovery giảm đau cơ DOMS 20–30% so với nghỉ hoàn toàn — máu lưu thông tốt hơn.' },
      { day:'T6', type:'Strength + Circuit', icon:'⚡', color:'orange', img:'hiit', duration:'30–35\'',
        exercises:['Circuit 3 vòng: Squat 10 → Push-up 8 → Row 10 — nghỉ 30s giữa vòng','Core finisher: Plank 30s + Side plank 20s/bên + Bird-dog 8/bên','2\' cool-down đi bộ tại chỗ + 5\' giãn cơ vai và hông'],
        tip:'Circuit tăng nhịp tim và đốt calo hiệu quả. Ưu tiên form đúng dù có mệt.' },
      { day:'T7', type:'Cardio dài', icon:'🏃', color:'blue', img:'cardio', duration:'35–40\'',
        exercises:['Chạy bộ jogging, đi bộ nhanh, hoặc đạp xe 35–40\' (tăng 5\' so với tuần trước)','Chạy bộ: xen kẽ chạy 3–5\' + đi bộ 1\' cho đến đủ thời gian','Nhịp tim giữ ổn định Zone 2 suốt buổi — không push nhanh','Kết thúc: ghi nhật ký tiến bộ — cân nặng, vòng eo, cảm giác năng lượng'],
        tip:'Buổi dài cuối tuần là nơi sức bền thật sự được xây dựng. Tăng 5 phút/tuần — đừng tăng đột ngột.' },
      { day:'CN', type:'Nghỉ + Meal Prep', icon:'🍳', color:'gray', img:'rest', duration:'Tự do',
        exercises:['Meal prep 2–3 bữa ăn đạm cho tuần sau (trứng luộc, thịt nạc, đậu hũ)','Review cân nặng sáng sớm + đo vòng eo (nếu theo dõi)','Lên lịch 4 buổi tập + 2 buổi cardio cho tuần sau','Ngủ đủ giấc — quan trọng ngang buổi tập nặng nhất'],
        tip:'Meal prep cuối tuần là bí quyết của người tập thành công — giảm quyết định bốc đồng.' },
    ],
  },
  {
    id: 2, label: 'Cá Nhân Hóa', sub: 'Tuần 9–12', icon: '🎯', color: 'purple',
    stats: [
      { label: 'Strength', value: '4 buổi/tuần',   icon: '🏋️' },
      { label: 'Cardio',   value: '2–3 buổi/tuần', icon: '🏃' },
      { label: 'Cường độ', value: 'RPE 7–8',        icon: '⚡' },
      { label: 'Thể tích', value: '85–90% max',     icon: '📊' },
    ],
    focus: 'Upper/Lower split — tăng cường độ có kiểm soát',
    tip: 'Giai đoạn này: tự lắng nghe cơ thể. HRV thấp + ngủ kém + tâm trạng xấu → giảm cường độ hoặc nghỉ thêm 1 ngày. Overtrain kéo bạn lùi.',
    days: [
      { day:'T2', type:'Upper A', icon:'💪', color:'purple', img:'strength', duration:'35–40\'',
        exercises:['Bench/Push-up nâng cao 4×8–10 — thân thẳng, khuỷu tay 45°','Dumbbell row 4×10 — lưng thẳng, kéo khuỷu về hông, không nhún vai','Overhead press 3×10 — đẩy thẳng lên trời, không ưỡn lưng','Face pull/Band pull-apart 3×15 — sức khỏe khớp vai, không bỏ bài này'],
        tip:'Upper A: chest + back là cặp đối kháng — kéo đủ bằng đẩy để tránh mất cân bằng vai.' },
      { day:'T3', type:'Lower A', icon:'🦵', color:'blue', img:'strength', duration:'35–40\'',
        exercises:['Squat 4×8–10 (tăng tải so với tuần trước) — sâu dưới đùi song song','Romanian DL 3×10 (tạ nặng hơn) — kiểm soát xuống 2–3s','Hip thrust 3×12 — thêm tạ lên hông nếu bodyweight quá dễ','Calf raise 3×15 + Plank 3×30s'],
        tip:'Squat sâu = glute và hamstring kích hoạt nhiều hơn. Đùi song song là tối thiểu.' },
      { day:'T4', type:'Interval Cardio', icon:'⚡', color:'orange', img:'hiit', duration:'30–35\'',
        exercises:['Warm-up: 5\' đi bộ hoặc chạy chậm Zone 1','Interval chính: 5 vòng × 2\' chạy bộ nhanh (Zone 3–4) + 2\' đi bộ hồi phục = 20\'','Thay thế: đạp xe interval cùng cấu trúc nếu đầu gối cần nghỉ','Cool-down: 5\' chạy/đi bộ chậm + giãn cơ toàn thân 5\''],
        tip:'Interval chạy bộ tăng VO₂max nhanh nhất. 2\' hồi phục = đi bộ — không ngồi xuống, tim cần giảm dần.' },
      { day:'T5', type:'Upper B', icon:'💪', color:'purple', img:'strength', duration:'35–40\'',
        exercises:['Incline push/Chest fly 3×10 — góc 30–45°, focus ngực trên','Pull-up/Lat pulldown 4×6–8 — kéo xương bả vai xuống trước khi kéo tay','Lateral raise 3×12 — tạ nhẹ, dừng ở ngang vai, không swing','Tricep dip/Pushdown 3×12 — khuỷu tay gần người, không mở rộng'],
        tip:'Pull-up: nếu chưa làm được → dùng band hỗ trợ hoặc lat pulldown. Đừng nhảy lên.' },
      { day:'T6', type:'Lower B + Core', icon:'🦵', color:'blue', img:'strength', duration:'35–40\'',
        exercises:['Deadlift 4×6–8 — "bài vua", kéo cả người lên bằng mông và đùi','Walking lunge 3×10/chân — bước dài, gối sau gần sàn, thân thẳng','Nordic curl/Leg curl 3×8 — eccentric hamstring, quan trọng cho đầu gối','Side plank 30s/bên + Dead bug 10 reps'],
        tip:'Deadlift: không bao giờ tập khi lưng đang đau. Kỹ thuật trước, tải trọng sau.' },
      { day:'T7', type:'Long Cardio + Mobility', icon:'🏃', color:'teal', img:'cardio', duration:'45–55\'',
        exercises:['Zone 2 cardio 35–40\': chạy bộ liên tục Zone 2, đi bộ nhanh, đạp xe, hoặc bơi lội','Chạy bộ: đây là buổi dài nhất tuần — mục tiêu chạy liên tục 20–25\' không dừng','Mobility toàn thân 10–15\': hông, đùi sau, lưng dưới, vai + cổ','Focus đặc biệt vào vùng cơ đang tight từ buổi strength trong tuần'],
        tip:'Giai đoạn 9–12: đây là tuần để thử chạy 20 phút liên tục. Nếu làm được — bạn đã sẵn sàng cho 5km.' },
      { day:'CN', type:'Nghỉ chủ động', icon:'💆', color:'gray', img:'recovery', duration:'10–15\'',
        exercises:['Mobility nhẹ 10–15\' tùy ý (không bắt buộc)','Review tiến bộ tuần: số reps, cân nặng tạ, vòng eo, cảm giác năng lượng','Test 4 tuần: vào Chủ Nhật tuần 12 — plank, squat, đi bộ 12\'','Lên kế hoạch chu kỳ tập tiếp theo dựa trên tiến bộ đã đạt'],
        tip:'Cơ thể đang tái tạo nhiều nhất giai đoạn này — nghỉ đủ là bắt buộc, không phải lười.' },
    ],
  },
];

/* ── Small fade hook to trigger CSS animation cleanly ── */
function useFadeKey(dep) {
  const [fadeKey, setFadeKey] = useState(0);
  const prev = useRef(dep);
  useEffect(() => {
    if (dep !== prev.current) {
      setFadeKey(k => k + 1);
      prev.current = dep;
    }
  }, [dep]);
  return fadeKey;
}

/* ── Main component ── */
export default function WeeklyRhythm() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay,   setActiveDay]   = useState(null);
  const fadeKey = useFadeKey(activePhase);

  const phase = PHASES[activePhase];
  const pc    = C[phase.color];

  function switchPhase(idx) {
    setActivePhase(idx);
    setActiveDay(null);
  }

  return (
    <section className="mb-16">

      {/* ── Header ── */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-text flex items-center gap-3 mb-1">
          <span>📅</span> Nhịp Tuần Gợi Ý
        </h2>
        <p className="text-muted text-sm">
          3 giai đoạn tiến bộ — chọn giai đoạn, click từng ngày để xem bài tập chi tiết
        </p>
      </div>

      {/* ── Phase tabs ── */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-surface border border-border rounded-2xl w-fit mb-8">
        {PHASES.map((ph) => {
          const cs       = C[ph.color];
          const isActive = activePhase === ph.id;
          return (
            <button
              key={ph.id}
              onClick={() => switchPhase(ph.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? `${cs.bg} ${cs.text} border ${cs.border}`
                  : 'text-muted hover:text-text hover:bg-white/4 border border-transparent'
              }`}
              style={isActive ? { boxShadow: `0 2px 20px ${cs.glow}` } : undefined}
            >
              <span className="text-base">{ph.icon}</span>
              <span>{ph.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                isActive
                  ? 'bg-white/10 border-white/20 text-white/60'
                  : 'bg-bg border-border/50 text-muted/50'
              }`}>{ph.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Phase content (single keyed wrapper — one key change → one remount) ── */}
      <div key={fadeKey} className="animate-fade-in-up">

        {/* ── Stats row (4 cards, current phase only) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {phase.stats.map((s, i) => (
            <div
              key={i}
              className={`relative overflow-hidden glass rounded-xl border ${pc.border} px-4 py-3 flex items-center gap-3`}
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ background: `radial-gradient(circle at 80% 50%, ${pc.hex}, transparent 70%)` }} />
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="min-w-0 relative">
                <p className="text-[10px] text-muted/70 truncate">{s.label}</p>
                <p className={`text-sm font-black ${pc.text} truncate`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Focus tag + week color strip ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${pc.bg} ${pc.border} ${pc.text} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
            {phase.focus}
          </span>
          <div className="flex gap-1 flex-1 h-2 rounded-full overflow-hidden">
            {phase.days.map((d, i) => {
              const dc = C[d.color];
              return (
                <button
                  key={i}
                  onClick={() => setActiveDay(activeDay === i ? null : i)}
                  className={`flex-1 ${dc.bar} rounded-full transition-all duration-200 hover:brightness-125 hover:scale-y-150 ${
                    activeDay === i ? 'brightness-150 scale-y-150' : ''
                  }`}
                  title={`${d.day}: ${d.type}`}
                />
              );
            })}
          </div>
        </div>

        {/* ── 7-day grid ── */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {phase.days.map((d, i) => {
            const dc       = C[d.color];
            const isActive = activeDay === i;
            return (
              <button
                key={i}
                onClick={() => setActiveDay(isActive ? null : i)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 text-left ${
                  isActive
                    ? `${dc.border} ${dc.bg}`
                    : 'border-border bg-surface/60 hover:border-white/15 hover:bg-surface'
                }`}
                style={isActive ? { boxShadow: `0 4px 20px ${dc.glow}` } : undefined}
              >
                {/* Day image backdrop */}
                <div className="relative h-14 sm:h-20 overflow-hidden rounded-t-2xl">
                  <img
                    src={IMG[d.img]}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ opacity: isActive ? 0.35 : 0.15 }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent" />
                  <span className="absolute top-1 left-0 right-0 text-center text-[9px] font-black text-white/50">
                    {d.day}
                  </span>
                  <span className="absolute bottom-1 left-0 right-0 text-center text-lg sm:text-xl leading-none">
                    {d.icon}
                  </span>
                </div>

                {/* Card label */}
                <div className="px-1 pb-2.5 pt-1.5 text-center">
                  <p className={`text-[9px] sm:text-[10px] font-black leading-tight line-clamp-2 ${
                    isActive ? dc.text : 'text-text/75'
                  }`}>
                    {d.type}
                  </p>
                  <p className="text-[8px] text-muted/50 mt-0.5">{d.duration}</p>
                </div>

                {/* Active indicator bar */}
                <div className={`h-0.5 rounded-full mx-2 mb-1.5 transition-all duration-200 ${
                  isActive ? dc.bar : 'bg-transparent'
                }`} />
              </button>
            );
          })}
        </div>

        {/* ── Day detail panel ── */}
        {activeDay !== null && (() => {
          const d  = phase.days[activeDay];
          const dc = C[d.color];
          return (
            <div
              className={`relative overflow-hidden rounded-2xl border ${dc.border} mb-6 animate-fade-in-up`}
              style={{ boxShadow: `0 8px 40px ${dc.glow}` }}
            >
              {/* Header banner */}
              <div className="relative h-24 sm:h-28 overflow-hidden">
                <img
                  src={IMG[d.img]}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.28 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/70 to-transparent" />
                <div className="absolute inset-0 flex items-center px-5 gap-4">
                  <span className="text-4xl shrink-0 drop-shadow-2xl">{d.icon}</span>
                  <div>
                    <p className="text-[10px] text-muted/60 mb-0.5">
                      {d.day} · {phase.label}
                    </p>
                    <h3 className={`text-lg sm:text-xl font-black ${dc.text}`}>{d.type}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${dc.bg} ${dc.border} ${dc.text}`}>
                        ⏱ {d.duration}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${dc.bg} ${dc.border} ${dc.text}`}>
                        ⚡ {d.intensity || phase.stats[2].value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise list */}
              <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-2">
                {d.exercises.map((ex, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3"
                  >
                    <span className={`shrink-0 w-5 h-5 rounded-full ${dc.bg} border ${dc.border} ${dc.text} text-[10px] font-black flex items-center justify-center mt-0.5`}>
                      {j + 1}
                    </span>
                    <p className="text-xs text-text/90 leading-relaxed">{ex}</p>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className={`mx-4 sm:mx-5 mb-4 sm:mb-5 flex gap-3 items-start rounded-xl border ${dc.border} ${dc.bg} px-4 py-3`}>
                <span className="text-sm shrink-0 mt-0.5">💡</span>
                <p className={`text-xs ${dc.text} leading-relaxed`}>{d.tip}</p>
              </div>
            </div>
          );
        })()}

        {/* ── Phase tip callout ── */}
        <div className={`relative overflow-hidden rounded-2xl border ${pc.border} ${pc.bg} p-5`}>
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-8 pointer-events-none"
            style={{ background: pc.hex }}
          />
          <div className="relative flex gap-3 items-start">
            <span className="text-2xl shrink-0">{phase.icon}</span>
            <div>
              <p className={`text-xs font-black ${pc.text} mb-1`}>
                Coach tip — {phase.sub}
              </p>
              <p className="text-sm text-muted/90 leading-relaxed">{phase.tip}</p>
            </div>
          </div>
        </div>

      </div>{/* end keyed fade wrapper */}
    </section>
  );
}
