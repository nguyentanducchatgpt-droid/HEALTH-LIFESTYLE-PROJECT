import { useState } from 'react';

const S = {
  green:  { text:'text-green-400',  bg:'bg-green-500/12',  border:'border-green-500/30',  bar:'bg-green-500',  ring:'ring-green-500/40',  glow:'rgba(34,197,94,0.25)',   hex:'#22c55e', dot:'bg-green-400'  },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/12',   border:'border-lime-500/30',   bar:'bg-lime-500',   ring:'ring-lime-500/40',   glow:'rgba(163,230,53,0.25)',  hex:'#a3e635', dot:'bg-lime-400'   },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/12',   border:'border-teal-500/30',   bar:'bg-teal-500',   ring:'ring-teal-500/40',   glow:'rgba(20,184,166,0.25)',  hex:'#14b8a6', dot:'bg-teal-400'   },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/12',   border:'border-blue-500/30',   bar:'bg-blue-500',   ring:'ring-blue-500/40',   glow:'rgba(59,130,246,0.25)',  hex:'#3b82f6', dot:'bg-blue-400'   },
  purple: { text:'text-purple-400', bg:'bg-purple-500/12', border:'border-purple-500/30', bar:'bg-purple-500', ring:'ring-purple-500/40', glow:'rgba(168,85,247,0.25)',  hex:'#a855f7', dot:'bg-purple-400' },
  orange: { text:'text-orange-400', bg:'bg-orange-500/12', border:'border-orange-500/30', bar:'bg-orange-500', ring:'ring-orange-500/40', glow:'rgba(249,115,22,0.25)',  hex:'#f97316', dot:'bg-orange-400' },
  gray:   { text:'text-muted',      bg:'bg-surface',       border:'border-border',        bar:'bg-muted/40',   ring:'ring-muted/20',     glow:'rgba(100,100,100,0.15)', hex:'#6b7280', dot:'bg-muted/50'   },
  yellow: { text:'text-yellow-400', bg:'bg-yellow-500/12', border:'border-yellow-500/30', bar:'bg-yellow-500', ring:'ring-yellow-500/40', glow:'rgba(234,179,8,0.25)',   hex:'#eab308', dot:'bg-yellow-400' },
};

const TYPE_IMG = {
  strength: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=65',
  cardio:   'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=65',
  hiit:     'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=65',
  mobility: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=65',
  recovery: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=65',
  rest:     'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=65',
};

const PHASES = [
  {
    id: 0,
    label: 'Nền Tảng',
    sub: 'Tuần 1–4',
    icon: '🌱',
    color: 'green',
    sessions: 3,
    volume: 60,
    intensity: 'RPE 5–6',
    focus: 'Học form đúng · Xây thói quen · Tập đều hơn tập nhiều',
    tip: 'Ưu tiên CHẤT LƯỢNG hơn số lượng — 1 buổi tập đúng form tốt hơn 3 buổi tập sai. Cơ thể cần 4–6 tuần để thần kinh cơ học cách điều phối.',
    days: [
      {
        day: 'T2', label: 'Thứ 2', type: 'Strength A', icon: '🏋️', color: 'green', imgType: 'strength',
        duration: '20–25\'', intensity: 'RPE 5–6',
        exercises: ['Squat to chair 3×10', 'Wall push-up 3×10', 'Glute bridge 3×12', 'Dead bug 3×8 mỗi bên'],
        tip: 'Focus vào hông xuống thẳng — chưa cần sâu, chỉ cần đúng.',
      },
      {
        day: 'T3', label: 'Thứ 3', type: 'Cardio nhẹ', icon: '🚶', color: 'teal', imgType: 'cardio',
        duration: '20–25\'', intensity: 'Zone 2',
        exercises: ['Đi bộ nhanh 20–25\'', 'Còn nói được câu ngắn = đúng nhịp', 'Kết thúc: giãn bắp chân, đùi'],
        tip: 'Nếu thở dốc không nói được → đi chậm lại. Zone 2 mới đốt mỡ hiệu quả.',
      },
      {
        day: 'T4', label: 'Thứ 4', type: 'Strength B', icon: '🏋️', color: 'green', imgType: 'strength',
        duration: '20–25\'', intensity: 'RPE 5–6',
        exercises: ['Hip hinge 3×12 (tập deadlift nhẹ)', 'Towel row 3×10', 'Bird-dog 3×8/bên', 'Calf raise 3×15'],
        tip: 'Hip hinge: lưng thẳng, hông đẩy ra sau, gối hơi cong — không gập lưng.',
      },
      {
        day: 'T5', label: 'Thứ 5', type: 'Mobility', icon: '🧘', color: 'purple', imgType: 'mobility',
        duration: '15–20\'', intensity: 'Nhẹ nhàng',
        exercises: ['Giãn hông 90/90 2\'', 'Pigeon pose 1\'/bên', 'Thoracic rotation 10 lần', 'Calf stretch 30s/bên'],
        tip: 'Giữ mỗi tư thế ≥ 30s, thở đều, không gắng sức. Ngày này phục hồi.',
      },
      {
        day: 'T6', label: 'Thứ 6', type: 'Strength C', icon: '🏋️', color: 'green', imgType: 'strength',
        duration: '20–25\'', intensity: 'RPE 5–6',
        exercises: ['Sit-to-stand 3×10', 'Scapular squeeze 3×12', 'Glute bridge march 3×10', 'Plank gối 3×20s'],
        tip: 'Plank: đừng nín thở — thở nhịp nhàng, giữ bụng căng, không trễ hông.',
      },
      {
        day: 'T7', label: 'Thứ 7', type: 'Cardio', icon: '🌳', color: 'teal', imgType: 'cardio',
        duration: '25–30\'', intensity: 'Zone 2',
        exercises: ['Đi bộ ngoài trời 25–30\'', 'Tốc độ thoải mái, nghe podcast/nhạc', 'Ghi nhật ký: cảm giác tuần này'],
        tip: 'Đi bộ ngoài trời giúp tinh thần khỏe hơn trong nhà. Ánh sáng tự nhiên reset đồng hồ sinh học.',
      },
      {
        day: 'CN', label: 'Chủ Nhật', type: 'Nghỉ ngơi', icon: '💆', color: 'gray', imgType: 'rest',
        duration: 'Tự do', intensity: '—',
        exercises: ['Review tuần vừa qua 5 phút', 'Chuẩn bị lịch tuần sau', 'Ngủ đủ 7–8 tiếng tối nay', 'Ăn uống lành mạnh, hydrate tốt'],
        tip: 'Cơ phát triển trong lúc nghỉ, không phải lúc tập. Ngày này quan trọng như ngày tập.',
      },
    ],
  },
  {
    id: 1,
    label: 'Xây Nền',
    sub: 'Tuần 5–8',
    icon: '📈',
    color: 'lime',
    sessions: 4,
    volume: 75,
    intensity: 'RPE 6–7',
    focus: 'Progressive overload · Tăng thể tích từ từ · Giới thiệu dụng cụ nhẹ',
    tip: 'Quy tắc 2 lần: nếu bài tập cảm thấy quá dễ 2 buổi liên tiếp → tăng tải 5–10% hoặc thêm 1–2 reps. Đừng tăng đột ngột.',
    days: [
      {
        day: 'T2', label: 'Thứ 2', type: 'Strength A', icon: '🏋️', color: 'lime', imgType: 'strength',
        duration: '25–30\'', intensity: 'RPE 6',
        exercises: ['Goblet squat 3×10 (tạ nhẹ)', 'Push-up chuẩn 3×8–10', 'Band row 3×12', 'Plank 3×25–30s'],
        tip: 'Goblet squat: giữ tạ sát ngực, khuỷu tay trong track — hông xuống giữa 2 gót.',
      },
      {
        day: 'T3', label: 'Thứ 3', type: 'Cardio Z2', icon: '🏃', color: 'blue', imgType: 'cardio',
        duration: '30\'', intensity: 'Zone 2',
        exercises: ['Đi bộ nhanh/đạp xe 30\'', 'Nhịp tim 120–140 bpm (hoặc còn nói được)', 'Kết thúc: 5\' giãn cơ'],
        tip: 'Nếu có đồng hồ: giữ nhịp tim 60–70% max HR. Không có? Kiểm tra bằng "talk test".',
      },
      {
        day: 'T4', label: 'Thứ 4', type: 'Strength B', icon: '🏋️', color: 'lime', imgType: 'strength',
        duration: '25–30\'', intensity: 'RPE 6',
        exercises: ['Romanian DL 3×10 (tạ/dây)', 'Split squat 3×8/chân', 'Dead bug 3×10', 'Hip thrust 3×12'],
        tip: 'RDL: cảm nhận kéo căng hamstring (sau đùi) — nếu không cảm thấy, chưa đủ sâu.',
      },
      {
        day: 'T5', label: 'Thứ 5', type: 'Active Recovery', icon: '🌿', color: 'teal', imgType: 'mobility',
        duration: '15–20\'', intensity: 'Nhẹ',
        exercises: ['Giãn toàn thân 10–15\'', 'Đi bộ nhẹ 10\' (không bắt buộc)', 'Foam roll nếu có: đùi, lưng, bắp chân'],
        tip: 'Active recovery giảm đau cơ DOMS nhanh hơn nghỉ hoàn toàn — máu lưu thông tốt hơn.',
      },
      {
        day: 'T6', label: 'Thứ 6', type: 'Strength + Circuit', icon: '⚡', color: 'orange', imgType: 'hiit',
        duration: '30–35\'', intensity: 'RPE 6–7',
        exercises: ['Squat → Push-up → Row circuit 3 vòng', 'Mỗi bài 10 reps, nghỉ 30s giữa vòng', 'Core: plank 30s + bird-dog 8/bên', 'Finisher: 2\' đi bộ tại chỗ'],
        tip: 'Circuit training tăng nhịp tim và đốt calo hiệu quả. Ưu tiên form dù mệt.',
      },
      {
        day: 'T7', label: 'Thứ 7', type: 'Cardio dài', icon: '🚴', color: 'blue', imgType: 'cardio',
        duration: '35–40\'', intensity: 'Zone 2',
        exercises: ['Đi bộ nhanh hoặc đạp xe 35–40\'', 'Tăng thêm 5\' so với tuần trước', 'Kết thúc: ghi nhật ký tiến bộ'],
        tip: 'Tăng 5 phút/tuần là ngưỡng an toàn tránh chấn thương. Đừng tăng đột ngột 15–20\'.',
      },
      {
        day: 'CN', label: 'Chủ Nhật', type: 'Nghỉ + Meal Prep', icon: '🍳', color: 'gray', imgType: 'rest',
        duration: 'Tự do', intensity: '—',
        exercises: ['Meal prep 2–3 bữa cho tuần sau', 'Review cân nặng / vòng eo sáng sớm', 'Lên lịch tập tuần sau', 'Ngủ đủ giấc — quan trọng như tập'],
        tip: 'Meal prep cuối tuần là "bí quyết" của người giảm mỡ thành công — giảm quyết định bốc đồng.',
      },
    ],
  },
  {
    id: 2,
    label: 'Cá Nhân Hóa',
    sub: 'Tuần 9–12',
    icon: '🎯',
    color: 'purple',
    sessions: 4,
    volume: 88,
    intensity: 'RPE 7–8',
    focus: 'Upper/Lower split · Tăng cường độ · Theo dõi & điều chỉnh linh hoạt',
    tip: 'Tự lắng nghe cơ thể: HRV thấp + ngủ kém + tâm trạng xấu → giảm cường độ hoặc nghỉ thêm 1 ngày. Overtrain không giúp bạn tiến nhanh hơn — nó kéo bạn lùi.',
    days: [
      {
        day: 'T2', label: 'Thứ 2', type: 'Upper A', icon: '💪', color: 'purple', imgType: 'strength',
        duration: '35–40\'', intensity: 'RPE 7',
        exercises: ['Bench press / Push-up nâng cao 4×8–10', 'Dumbbell row 4×10', 'OHP 3×10', 'Face pull / band 3×15'],
        tip: 'Upper A focus ngực + lưng. Kết thúc với 1 bài cô lập: curl hoặc tricep dip.',
      },
      {
        day: 'T3', label: 'Thứ 3', type: 'Lower A', icon: '🦵', color: 'blue', imgType: 'strength',
        duration: '35–40\'', intensity: 'RPE 7',
        exercises: ['Squat 4×8–10 (nâng tải)', 'Romanian DL 3×10', 'Hip thrust 3×12', 'Calf raise 3×15'],
        tip: 'Squat sâu = hamstring + glute kích hoạt tốt hơn. Đừng dừng lại khi đùi song song.',
      },
      {
        day: 'T4', label: 'Thứ 4', type: 'Interval Cardio', icon: '⚡', color: 'orange', imgType: 'hiit',
        duration: '30–35\'', intensity: 'Zone 3–4',
        exercises: ['Warm-up 5\' chậm', '5 vòng: 2\' nhanh + 2\' chậm', 'Cool-down 5\' + giãn cơ 5\'', 'Option: thêm core 5\' cuối'],
        tip: 'Interval tăng VO₂max và đốt mỡ hiệu quả sau khi tập. Ngày này không nên bỏ.',
      },
      {
        day: 'T5', label: 'Thứ 5', type: 'Upper B', icon: '💪', color: 'purple', imgType: 'strength',
        duration: '35–40\'', intensity: 'RPE 7–8',
        exercises: ['Incline push / chest fly 3×10', 'Pull-up / lat pulldown 4×6–8', 'Lateral raise 3×12', 'Tricep dip / pushdown 3×12'],
        tip: 'Pull-up: nếu chưa làm được, dùng band hỗ trợ hoặc lat pulldown — đừng nhảy lên.',
      },
      {
        day: 'T6', label: 'Thứ 6', type: 'Lower B + Core', icon: '🦵', color: 'blue', imgType: 'strength',
        duration: '35–40\'', intensity: 'RPE 7–8',
        exercises: ['Deadlift 4×6–8', 'Walking lunge 3×10/chân', 'Nordic curl / leg curl 3×8', 'Plank + side plank 30s/bên'],
        tip: 'Deadlift là "bài vua" — tập đúng sẽ kiểm tra toàn bộ chuỗi sau cơ thể. Không bao giờ tập khi lưng đang đau.',
      },
      {
        day: 'T7', label: 'Thứ 7', type: 'Long Cardio + Mobility', icon: '🏃', color: 'teal', imgType: 'cardio',
        duration: '45–55\'', intensity: 'Zone 2 + Stretch',
        exercises: ['Zone 2 cardio 35–40\' (đi bộ nhanh / đạp / bơi)', 'Mobility toàn thân 10–15\'', 'Focus: hông, đùi sau, lưng dưới, vai'],
        tip: 'Buổi dài cuối tuần xây nền aerobic bền vững — quan trọng như buổi strength.',
      },
      {
        day: 'CN', label: 'Chủ Nhật', type: 'Nghỉ chủ động', icon: '💆', color: 'gray', imgType: 'recovery',
        duration: '10–15\'', intensity: '—',
        exercises: ['Mobility nhẹ 10–15\' nếu muốn', 'Đi bộ chậm < 20\'', 'Review tiến bộ tuần: vòng eo, số reps, cảm giác', 'Ngủ + nghỉ ngơi = đầu tư cho tuần sau'],
        tip: 'Giai đoạn này cơ thể bạn đang tái tạo nhiều — nghỉ đủ là bắt buộc, không phải lười biếng.',
      },
    ],
  },
];

const STAT_ICONS = { sessions: '🏋️', volume: '📊', intensity: '⚡', focus: '🎯' };

export default function WeeklyRhythm() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeDay,   setActiveDay]   = useState(null);

  const phase = PHASES[activePhase];
  const ps    = S[phase.color];

  return (
    <section className="mb-16">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-text flex items-center gap-3">
            <span>📅</span> Nhịp Tuần Gợi Ý
          </h2>
          <p className="text-muted text-sm mt-1">
            Cấu trúc tuần theo từng giai đoạn — click vào ngày để xem chi tiết bài tập
          </p>
        </div>
      </div>

      {/* ── Phase selector ─────────────────────────────────────────────── */}
      <div className="flex gap-2 p-1.5 bg-surface border border-border rounded-2xl w-fit mb-8 flex-wrap">
        {PHASES.map((ph) => {
          const cs      = S[ph.color];
          const isActive = activePhase === ph.id;
          return (
            <button
              key={ph.id}
              onClick={() => { setActivePhase(ph.id); setActiveDay(null); }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive
                  ? `${cs.bg} ${cs.text} border ${cs.border}`
                  : 'text-muted hover:text-text hover:bg-white/4 border border-transparent'
              }`}
              style={isActive ? { boxShadow: `0 2px 16px ${cs.glow}` } : undefined}
            >
              <span className="text-base">{ph.icon}</span>
              <span>{ph.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ml-0.5 ${
                isActive
                  ? 'bg-white/10 border-white/20 text-white/70'
                  : 'bg-bg border-border/60 text-muted/60'
              }`}>{ph.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Phase stats bar ─────────────────────────────────────────────── */}
      <div
        key={activePhase}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in-up"
      >
        {[
          { icon: STAT_ICONS.sessions,  label: 'Buổi strength/tuần', value: `${phase.sessions} buổi` },
          { icon: STAT_ICONS.volume,    label: 'Thể tích',            value: `${phase.volume}%` },
          { icon: STAT_ICONS.intensity, label: 'Cường độ',            value: phase.intensity },
          { icon: STAT_ICONS.focus,     label: 'Focus',               value: phase.focus.split('·')[0].trim() },
        ].map((stat, i) => (
          <div key={i} className={`glass rounded-xl border ${ps.border} px-4 py-3 flex items-center gap-3`}>
            <span className="text-xl shrink-0">{stat.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted/70 truncate">{stat.label}</p>
              <p className={`text-sm font-black ${ps.text} truncate`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Week color strip ────────────────────────────────────────────── */}
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mb-6">
        {phase.days.map((d, i) => {
          const ds = S[d.color];
          return (
            <div
              key={i}
              onClick={() => setActiveDay(activeDay === i ? null : i)}
              className={`${ds.bar} flex-1 rounded-full cursor-pointer transition-all duration-200 hover:brightness-125 hover:scale-y-125`}
              title={`${d.label}: ${d.type}`}
            />
          );
        })}
      </div>

      {/* ── 7-day grid ─────────────────────────────────────────────────── */}
      <div key={activePhase} className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-6 animate-fade-in-up">
        {phase.days.map((d, i) => {
          const ds       = S[d.color];
          const expanded = activeDay === i;
          const img      = TYPE_IMG[d.imgType] || TYPE_IMG.rest;

          return (
            <div
              key={i}
              onClick={() => setActiveDay(expanded ? null : i)}
              className={`group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-250 ${
                expanded
                  ? `${ds.border} ${ds.bg} ring-1 ${ds.ring}`
                  : 'border-border hover:border-white/20 bg-surface/50 hover:bg-surface'
              }`}
              style={{ boxShadow: expanded ? `0 6px 24px ${ds.glow}` : undefined }}
            >
              {/* Image backdrop */}
              <div className="h-16 sm:h-20 relative overflow-hidden">
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: expanded ? 0.32 : 0.18 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  d.color === 'gray'
                    ? 'from-surface/95 via-surface/60 to-transparent'
                    : `from-bg/95 via-bg/50 to-transparent`
                }`} />
                {/* Day label */}
                <div className="absolute top-1.5 left-0 right-0 flex justify-center">
                  <span className="text-[9px] font-black text-white/60">{d.day}</span>
                </div>
                {/* Icon */}
                <div className="absolute bottom-1.5 left-0 right-0 flex justify-center">
                  <span className="text-lg sm:text-xl drop-shadow-lg">{d.icon}</span>
                </div>
              </div>

              {/* Card body */}
              <div className="px-1.5 pb-2 pt-1 text-center">
                <p className={`text-[10px] font-black leading-tight ${expanded ? ds.text : 'text-text/80'}`}>
                  {d.type}
                </p>
                <p className="text-[9px] text-muted/60 mt-0.5 hidden sm:block">{d.duration}</p>
                {/* Expand indicator */}
                <div className={`mt-1.5 mx-auto w-4 h-0.5 rounded-full transition-all duration-200 ${
                  expanded ? `${ds.bar} opacity-70` : 'bg-muted/20'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Day detail panel ────────────────────────────────────────────── */}
      {activeDay !== null && (() => {
        const d  = phase.days[activeDay];
        const ds = S[d.color];
        const img = TYPE_IMG[d.imgType] || TYPE_IMG.rest;
        return (
          <div
            key={`${activePhase}-${activeDay}`}
            className={`relative overflow-hidden rounded-2xl border ${ds.border} mb-6 animate-fade-in-up`}
            style={{ boxShadow: `0 8px 32px ${ds.glow}` }}
          >
            {/* Header image strip */}
            <div className="relative h-28 sm:h-32 overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.3 }} />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/60 to-transparent" />
              <div className="absolute inset-0 flex items-center px-5 gap-4">
                <span className="text-4xl drop-shadow-2xl">{d.icon}</span>
                <div>
                  <p className="text-[10px] text-muted/60 mb-0.5">{d.label} · {phase.label}</p>
                  <h3 className={`text-xl font-black ${ds.text}`}>{d.type}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ds.bg} ${ds.border} ${ds.text} font-bold`}>
                      ⏱ {d.duration}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ds.bg} ${ds.border} ${ds.text} font-bold`}>
                      ⚡ {d.intensity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercises list */}
            <div className="p-5 grid sm:grid-cols-2 gap-2">
              {d.exercises.map((ex, j) => (
                <div
                  key={j}
                  className="flex items-start gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3"
                >
                  <span className={`shrink-0 w-5 h-5 rounded-full ${ds.bg} border ${ds.border} ${ds.text} text-[10px] font-black flex items-center justify-center mt-0.5`}>
                    {j + 1}
                  </span>
                  <p className="text-xs text-text/90 leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>

            {/* Tip callout */}
            <div className={`mx-5 mb-5 flex gap-3 items-start rounded-xl border ${ds.border} ${ds.bg} px-4 py-3`}>
              <span className="text-sm shrink-0 mt-0.5">💡</span>
              <p className={`text-xs ${ds.text} leading-relaxed`}>{d.tip}</p>
            </div>
          </div>
        );
      })()}

      {/* ── Phase focus strip ───────────────────────────────────────────── */}
      <div className={`flex flex-wrap gap-2 mb-5`}>
        {phase.focus.split('·').map((f, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${ps.bg} ${ps.border} ${ps.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ps.dot}`} />
            {f.trim()}
          </span>
        ))}
      </div>

      {/* ── Phase tip callout ───────────────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-2xl border ${ps.border} ${ps.bg} p-5`}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10"
          style={{ background: ps.hex }} />
        <div className="relative flex gap-3">
          <span className="text-xl shrink-0">{phase.icon}</span>
          <div>
            <p className={`text-xs font-black ${ps.text} mb-1`}>Lời khuyên giai đoạn {phase.sub}</p>
            <p className="text-sm text-muted/90 leading-relaxed">{phase.tip}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
