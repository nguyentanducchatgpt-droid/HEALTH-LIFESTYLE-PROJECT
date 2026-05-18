import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from '../components/LocalVideoCard';

// ─── Static config data ───────────────────────────────────────────────────────

const MOVE_IMG = {
  squat:  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=700&q=70',
  hinge:  'https://images.unsplash.com/photo-1517343985841-f8b2d55d5aa8?w=700&q=70',
  push:   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=70',
  pull:   'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=700&q=70',
  core:   'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=700&q=70',
  breath: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=70',
};

const MOVE_STYLE = {
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  bar: 'bg-green-500',  ring: 'ring-green-500/40',  glow: 'rgba(34,197,94,0.3)',   overlay: 'from-green-950/90 via-green-900/60 to-transparent' },
  lime:   { text: 'text-lime-400',   bg: 'bg-lime-500/10',   border: 'border-lime-500/30',   bar: 'bg-lime-500',   ring: 'ring-lime-500/40',   glow: 'rgba(163,230,53,0.3)',  overlay: 'from-lime-950/90 via-lime-900/60 to-transparent' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   bar: 'bg-blue-500',   ring: 'ring-blue-500/40',   glow: 'rgba(59,130,246,0.3)',  overlay: 'from-blue-950/90 via-blue-900/60 to-transparent' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   bar: 'bg-teal-500',   ring: 'ring-teal-500/40',   glow: 'rgba(20,184,166,0.3)',  overlay: 'from-teal-950/90 via-teal-900/60 to-transparent' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', bar: 'bg-purple-500', ring: 'ring-purple-500/40', glow: 'rgba(168,85,247,0.3)',  overlay: 'from-purple-950/90 via-purple-900/60 to-transparent' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500', ring: 'ring-orange-500/40', glow: 'rgba(249,115,22,0.3)',  overlay: 'from-orange-950/90 via-orange-900/60 to-transparent' },
};

const PLAN_STYLE = {
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500' },
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  bar: 'bg-green-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', bar: 'bg-purple-500' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   bar: 'bg-teal-500' },
};

const DAILY_BLOCKS = [
  {
    time: '5 phút', name: 'Khởi Động', desc: 'Vận động khớp, tăng nhiệt cơ thể', icon: '🔥', color: 'orange',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=65',
    goal: 'Tăng nhiệt cơ thể, bôi trơn khớp, kích hoạt hệ thần kinh — giảm nguy cơ chấn thương',
    steps: [
      { name: 'Thở cơ hoành',       how: 'Tay đặt lên bụng, bụng phồng khi hít vào, thở ra chậm qua miệng', duration: '4–6 nhịp' },
      { name: 'Đi bộ tại chỗ',      how: 'Nâng gối vừa phải, vai thả lỏng, nhịp nhàng đều đặn',              duration: '60 giây' },
      { name: 'Xoay vai',            how: 'Xoay chậm về phía sau, không rút cổ, cảm nhận sự giãn ra',         duration: '10 vòng' },
      { name: 'Ép bờ vai',           how: 'Kéo nhẹ hai vai về sau, mở ngực, giữ 1–2 giây mỗi lần',            duration: '10 lần' },
      { name: 'Gập hông cơ bản',     how: 'Đẩy hông ra sau, lưng thẳng, gối hơi chùng — không cúi bằng lưng', duration: '8 lần' },
      { name: 'Ngồi xuống ghế',      how: 'Ngồi xuống rồi đứng lên kiểm soát, không "rơi" xuống ghế',         duration: '8 lần' },
    ],
    tips: [
      'Không bỏ qua dù đang vội — 5 phút này giảm đáng kể nguy cơ chấn thương',
      'Cơ thể cần 3–5 phút để tăng nhiệt độ cơ lên mức an toàn (38°C)',
      'Thở sâu đầu tiên giúp "bật" hệ thần kinh phó giao cảm → cơ thả lỏng tốt hơn',
    ],
  },
  {
    time: '10–20 phút', name: 'Vận Động Chính', desc: 'Bài sức mạnh hoặc tim mạch', icon: '💪', color: 'green',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=65',
    goal: 'Kích thích cơ bắp & hệ tim mạch — đây là phần tạo ra sự thích nghi và tiến bộ',
    options: [
      {
        name: 'Sức Mạnh', icon: '🏋️', days: 'T2 · T4 · T6',
        exercises: [
          { name: 'Gập chân (Squat)',        sets: '2–3 × 10–12 lần' },
          { name: 'Chống đẩy (Push)',         sets: '2–3 × 8–12 lần'  },
          { name: 'Kéo dây / khăn (Pull)',    sets: '2–3 × 10–12 lần' },
          { name: 'Cầu mông / Gập hông',      sets: '2–3 × 12–15 lần' },
          { name: 'Tư thế ván (Core)',         sets: '2–3 × 20–40 giây'},
        ],
        note: 'Nghỉ 60–90 giây giữa các hiệp. Tăng tải ≤ 10%/tuần.',
      },
      {
        name: 'Tim Mạch', icon: '🚶', days: 'T3 · T5',
        exercises: [
          { name: 'Đi bộ nhanh ngoài trời',  sets: '15–20 phút' },
          { name: 'Đạp xe nhẹ',               sets: '15–20 phút' },
          { name: 'Leo cầu thang',             sets: '10–15 phút' },
          { name: 'Nhịp tim mục tiêu',         sets: '50–70% HRmax' },
        ],
        note: 'HRmax ≈ 220 − tuổi. Có thể nói chuyện được là đúng vùng.',
      },
    ],
    tips: [
      'Chất lượng > số lượng — form chuẩn trước, tăng tải sau',
      'Uống nước ngay khi khát, đừng chờ đến khi rất khát',
      'Nếu quá mệt sau bài: giảm 1 hiệp hoặc giảm tải — tiến bộ dần đều mới bền vững',
    ],
  },
  {
    time: '5–10 phút', name: 'Giãn Cơ & Hạ Nhiệt', desc: 'Kéo giãn, hạ nhiệt độ cơ thể', icon: '🧘', color: 'teal',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=65',
    goal: 'Phục hồi nhịp tim, tăng linh hoạt, giảm đau cơ hôm sau — không bỏ qua bước này',
    steps: [
      { name: 'Giãn gấp hông',   how: 'Quỳ một chân, đẩy hông nhẹ về trước — cảm nhận căng trước đùi',    duration: '30 giây/bên' },
      { name: 'Giãn đùi sau',    how: 'Duỗi một chân, gập người nhẹ, lưng không gù quá mức',               duration: '30 giây/bên' },
      { name: 'Mở ngực',         how: 'Dan hai tay sau lưng hoặc chống tay vào cửa, ngực mở ra trước',      duration: '30 giây'     },
      { name: 'Tư thế em bé',    how: 'Ngồi về gót, vươn tay ra trước, thở chậm, cảm nhận lưng giãn',      duration: '30–60 giây'  },
      { name: 'Thở chậm',        how: 'Hít vào 4 giây, thở ra 6 giây — chú ý bụng phồng xẹp',              duration: '4–6 nhịp'    },
    ],
    tips: [
      'Giữ mỗi động tác ≥ 20 giây để cơ thực sự được kéo giãn',
      'Không nín thở — thở đều đặn giúp cơ mềm và dễ giãn hơn',
      'Cảm giác căng nhẹ là bình thường — đau nhói là dừng ngay',
    ],
  },
  {
    time: '5 phút', name: 'Tĩnh Tâm', desc: 'Thở sâu, thiền ngắn hoặc đi dạo', icon: '🌿', color: 'purple',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=65',
    goal: 'Hạ cortisol, củng cố ký ức vận động, chuyển não từ chế độ "nỗ lực" sang "phục hồi"',
    steps: [
      { name: 'Ngồi/nằm thoải mái',  how: 'Đặt tay lên bụng, nhắm mắt nhẹ hoặc nhìn xuống',                                   duration: '30 giây'  },
      { name: 'Thở hộp (Box)',        how: 'Hít vào 4s → giữ 4s → thở ra 4s → giữ 4s — lặp 2–3 vòng',                          duration: '2–3 phút' },
      { name: 'Quét cơ thể',          how: 'Nhận biết từng vùng từ đầu đến chân — cảm nhận không phán xét',                      duration: '1 phút'   },
      { name: 'Ghi nhận tích cực',    how: 'Nghĩ đến 1 điều tốt trong buổi tập: đã hoàn thành, cảm thấy khỏe, bước tiến nào đó', duration: '30 giây'  },
      { name: 'Đặt ý định',           how: 'Quyết định 1 điều muốn làm tốt trong phần còn lại của ngày',                         duration: '30 giây'  },
    ],
    tips: [
      'Không cần "đầu óc trống rỗng" — chỉ cần quan sát, không phán xét',
      '5 phút thiền sau tập giúp cortisol giảm 15–20%',
      'Đây là lúc não bộ củng cố và ghi nhớ các vận động mới học — đừng lướt điện thoại ngay',
    ],
  },
];

const WEEKLY = [
  { days: 'T2 · T4 · T6', type: 'Sức Mạnh',   icon: '🏋️', color: 'green',  desc: 'Gập chân, Gập hông, Chống đẩy, Kéo, Cơ lõi — 20–30 phút',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=65' },
  { days: 'T3 · T5',       type: 'Tim Mạch',   icon: '🚶', color: 'blue',   desc: 'Đi bộ nhanh, đạp xe, leo cầu thang — 20–30 phút',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=65' },
  { days: 'Thứ 7',         type: 'Phục Hồi',   icon: '🌿', color: 'teal',   desc: 'Giãn cơ, yoga nhẹ, đi dạo thư giãn',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=65' },
  { days: 'Chủ Nhật',      type: 'Nghỉ Ngơi',  icon: '🌙', color: 'purple', desc: 'Nghỉ hoàn toàn hoặc vận động rất nhẹ theo sở thích',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=65' },
];

const PROG_STEPS = [
  { n: 1, label: 'Tăng số lần',  desc: 'Từ 8 → 12 lần/hiệp',            icon: '🔢' },
  { n: 2, label: 'Tăng số hiệp', desc: 'Từ 2 → 3 hiệp',                  icon: '📈' },
  { n: 3, label: 'Tăng độ khó',  desc: 'Phiên bản nâng cao hơn bài tập', icon: '⬆️' },
  { n: 4, label: 'Thêm tạ',      desc: 'Tạ tay hoặc dây kháng lực',      icon: '🏋️' },
  { n: 5, label: 'Giảm nghỉ',    desc: 'Tăng sức bền và mật độ',         icon: '⏱️' },
];

const PLAN_IMAGES = {
  busy:      'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?w=800&q=60',
  fat_loss:  'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=60',
  muscle:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=60',
  mobility:  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=60',
};

const LEVEL_COLORS = [
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
];

const MOVE_VIDEO = {
  squat:  'SQUAT',
  hinge:  'HINGE',
  push:   'PUSH',
  pull:   'PULL',
  core:   'CORE',
  breath: 'BREATH',
};

// ─── Video thumbnail player (click-to-play, no autoplay) ──────────────────────

function MovementVideoPlayer({ videoKey, s }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const src = `${import.meta.env.BASE_URL}videos/${videoKey}.mp4#t=0.5`;

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '9/16' }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
        src={src}
        controls={playing}
      />
      {!playing && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
          <button
            type="button"
            onClick={handlePlay}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 group focus:outline-none"
          >
            <div
              className={`w-16 h-16 rounded-full bg-white/10 border-2 ${s.border} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20`}
              style={{ boxShadow: `0 0 40px ${s.glow}` }}
            >
              <svg className={`w-7 h-7 ${s.text} ml-1`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-white/50 text-xs font-medium">Nhấn để xem</span>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar          = tPillars('pillarA',                  { returnObjects: true });
  const movementsDetail = tPillars('pillarA.movements_detail', { returnObjects: true });
  const workoutPlans    = tPillars('pillarA.workout_plans',    { returnObjects: true });
  const progressTests   = tPillars('pillarA.progress_tests',  { returnObjects: true });
  const warmup          = tPillars('pillarA.warmup',           { returnObjects: true });
  const cooldown        = tPillars('pillarA.cooldown',         { returnObjects: true });

  const [activeMove,  setActiveMove]  = useState(0);
  const [activePlan,  setActivePlan]  = useState(0);
  const [activeBlock, setActiveBlock] = useState(null);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('common.loading')}</span>
      </div>
    );
  }

  const currentMove = Array.isArray(movementsDetail) ? movementsDetail[activeMove] : null;
  const currentPlan = Array.isArray(workoutPlans)    ? workoutPlans[activePlan]    : null;

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── SECTION 1: IMMERSIVE HERO ───────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-16" style={{ minHeight: 460 }}>
        {/* Mosaic 3-image backdrop */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=50',
            'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=50',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=50',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/60 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />

        {/* Accent glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-500/4 rounded-full blur-[80px] pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 px-4 md:px-8 pt-14 pb-12 animate-fade-in-up">
          {/* Breadcrumb */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-accent text-xs transition-colors mb-6 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Trang chủ
          </Link>

          {/* Badge */}
          <div className="flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse shrink-0" />
            🏃 Trụ Cột A — Vận Động &amp; Tập Luyện
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black text-text leading-[1.05] mb-4">
            Xây nền thể lực<br />
            <span className="text-gradient">từng ngày, từng bước</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl mb-8">
            {pillar.description}
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '⚡', n: '6',          label: 'Chuyển động nền tảng' },
              { icon: '⏱️', n: '20–40 phút', label: 'Khung ngày lý tưởng' },
              { icon: '📅', n: '3–5x/tuần',  label: 'Tần suất gợi ý' },
              { icon: '🎯', n: '12 tuần',    label: 'Lộ trình chuẩn' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2.5 bg-surface/80 backdrop-blur-sm border border-border px-4 py-2.5 rounded-xl">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <span className="text-gradient font-extrabold text-sm block leading-none">{s.n}</span>
                  <span className="text-muted text-[10px] leading-none">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: DAILY FRAMEWORK ─────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-black flex items-center justify-center shrink-0">⏱</span>
          <h2 className="text-2xl font-black text-text">Khung Ngày Tập 20–40 Phút</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* ── 4 clickable phase cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DAILY_BLOCKS.map((b, i) => {
            const s        = MOVE_STYLE[b.color] || MOVE_STYLE.green;
            const isActive = activeBlock === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveBlock(isActive ? null : i)}
                className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-300 focus:outline-none ${
                  isActive ? `ring-2 ${s.ring} scale-[1.02]` : 'hover:scale-[1.02]'
                }`}
                style={{
                  aspectRatio: '3/4',
                  boxShadow: isActive ? `0 12px 40px ${s.glow}` : undefined,
                }}
              >
                <img
                  src={b.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                  style={{ opacity: isActive ? 0.3 : 0.22 }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${s.overlay} pointer-events-none`} />
                <div className="absolute inset-0 bg-gradient-to-b from-bg/50 to-transparent pointer-events-none" />

                {/* Step / checkmark */}
                <div className={`absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                  isActive ? `${s.bar} text-bg` : 'bg-white/10 border border-white/15 text-white/60'
                }`}>
                  {isActive ? '✓' : i + 1}
                </div>

                {/* Time badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
                    {b.time}
                  </span>
                </div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl transition-all duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {b.icon}
                  </span>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className={`font-black text-sm leading-tight mb-1 transition-colors ${isActive ? 'text-white' : 'text-white/90'}`}>
                    {b.name}
                  </h3>
                  <p className="text-white/50 text-[10px] leading-snug">{b.desc}</p>
                  {!isActive && (
                    <p className={`text-[9px] ${s.text} mt-1 opacity-60`}>Nhấn để xem chi tiết →</p>
                  )}
                </div>

                {/* Selected border */}
                {isActive && <div className={`absolute inset-0 rounded-2xl border-2 ${s.border} pointer-events-none`} />}
              </button>
            );
          })}
        </div>

        {/* ── Detail panel (slides in when a block is selected) ── */}
        {activeBlock !== null && (() => {
          const b = DAILY_BLOCKS[activeBlock];
          const s = MOVE_STYLE[b.color] || MOVE_STYLE.green;
          return (
            <div key={activeBlock} className={`mt-4 relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
              {/* Accent line */}
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.6)')}, transparent)` }} />

              <div className="p-5 md:p-6">
                {/* Detail header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl shrink-0`}>
                    {b.icon}
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${s.text}`}>{b.name}</h3>
                    <p className="text-muted text-xs leading-snug max-w-lg">{b.goal}</p>
                  </div>
                  <span className={`ml-auto shrink-0 text-[10px] font-bold px-3 py-1 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
                    {b.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveBlock(null)}
                    className="shrink-0 w-7 h-7 rounded-lg border border-border text-muted hover:text-text hover:border-border-bright transition-all flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* ── Block 2: two option columns ── */}
                {b.options ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4 mb-5">
                      {b.options.map((opt, oi) => (
                        <div key={oi} className={`rounded-2xl border ${s.border} ${s.bg} overflow-hidden`}>
                          <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                            <span className="text-lg">{opt.icon}</span>
                            <h4 className={`font-black text-sm ${s.text}`}>{opt.name}</h4>
                            <span className="ml-auto text-[10px] text-muted font-medium">{opt.days}</span>
                          </div>
                          <div className="p-3 space-y-2">
                            {opt.exercises.map((ex, ei) => (
                              <div key={ei} className="flex items-center justify-between bg-bg/70 border border-border/40 rounded-xl px-3 py-2.5 hover:border-border-bright transition-colors">
                                <span className="text-xs text-text">{ex.name}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${s.bg} ${s.border} ${s.text}`}>
                                  {ex.sets}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 pb-3">
                            <p className="text-[10px] text-muted/60 italic">{opt.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* ── Blocks 1, 3, 4: numbered step list ── */
                  <div className="space-y-2 mb-5">
                    {b.steps.map((step, si) => (
                      <div key={si} className="flex items-start gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3 hover:border-border-bright transition-colors duration-150">
                        <span className={`w-6 h-6 rounded-full ${s.bg} border ${s.border} ${s.text} text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>
                          {si + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text">{step.name}</p>
                          <p className="text-[10px] text-muted mt-0.5 leading-snug">{step.how}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap mt-0.5 ${s.bg} ${s.border} ${s.text}`}>
                          {step.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Tips callout ── */}
                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">💡 Lưu ý quan trọng</p>
                  <ul className="space-y-2">
                    {b.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-text/80 leading-relaxed">
                        <span className={`${s.text} shrink-0 mt-0.5 font-bold`}>·</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── SECTION 3: WEEKLY RHYTHM ────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-text mb-8 flex items-center gap-3">
          <span>📅</span> Nhịp Tuần Gợi Ý
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {WEEKLY.map((w, i) => {
            const s = MOVE_STYLE[w.color] || MOVE_STYLE.green;
            return (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border ${s.border} ${s.bg} p-4 hover:scale-[1.01] transition-all duration-300`}
              >
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <img
                    src={w.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                    style={{ opacity: 0.12 }}
                  />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{w.icon}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>
                      {w.days}
                    </span>
                  </div>
                  <h3 className={`font-black text-sm ${s.text} mb-1`}>{w.type}</h3>
                  <p className="text-muted text-[11px] leading-snug">{w.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-muted/50 text-xs mt-4 text-center">{tCommon('common.safety_note')}</p>
      </section>

      {/* ── SECTION 4: 6 MOVEMENTS — TAB + VIDEO ───────────────────────────── */}
      {Array.isArray(movementsDetail) && (
        <section className="mb-16">
          <h2 className="text-2xl font-black text-text mb-2">6 Mẫu Vận Động Nền Tảng</h2>
          <p className="text-muted text-sm mb-6">Chọn bài tập để xem video minh họa và hướng dẫn chi tiết</p>

          {/* ── Scrollable tab bar ── */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap pb-0.5">
              {movementsDetail.map((m, i) => {
                const s = MOVE_STYLE[m.color] || MOVE_STYLE.green;
                const isActive = activeMove === i;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMove(i)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                      isActive
                        ? `${s.bg} ${s.text} border ${s.border}`
                        : 'text-muted border border-transparent hover:border-border hover:text-text hover:bg-white/4'
                    }`}
                  >
                    <span className="text-base leading-none">{m.icon}</span>
                    <span>{m.name}</span>
                    {isActive && (
                      <span className={`absolute bottom-0 inset-x-3 h-0.5 ${s.bar} rounded-full`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab content ── */}
          {currentMove && (() => {
            const s   = MOVE_STYLE[currentMove.color] || MOVE_STYLE.green;
            const vid = MOVE_VIDEO[currentMove.id];
            return (
              <div
                key={currentMove.id}
                className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}
              >
                {/* Accent top bar */}
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.5)')}, transparent)` }} />

                <div className="p-5 md:p-6">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">

                    {/* ── LEFT: video + movement meta ── */}
                    <div className="space-y-4">
                      {/* Movement label row */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-xl shrink-0`}>
                          {currentMove.icon}
                        </div>
                        <div>
                          <h3 className={`font-black text-base ${s.text}`}>{currentMove.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${s.bg} ${s.border} ${s.text}`}>
                            {currentMove.prescription}
                          </span>
                        </div>
                      </div>

                      {/* Click-to-play video thumbnail */}
                      {vid && <MovementVideoPlayer key={vid} videoKey={vid} s={s} />}

                      {/* Goal box */}
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">🎯 Mục tiêu</p>
                        <p className="text-xs text-text leading-relaxed">{currentMove.goal}</p>
                      </div>
                    </div>

                    {/* ── RIGHT: instruction details ── */}
                    <div className="space-y-4">
                      {/* Basic exercise */}
                      <div className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Bài cơ bản</p>
                        <p className={`font-bold ${s.text} mb-2`}>{currentMove.basic}</p>
                        <p className="text-xs text-muted leading-relaxed">{currentMove.basic_how}</p>
                      </div>

                      {/* Technique cue */}
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">💡 Cue kỹ thuật</p>
                        <p className={`text-sm font-bold ${s.text} leading-relaxed`}>{currentMove.cue}</p>
                      </div>

                      {/* Progression levels */}
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Cấp độ tiến bộ</p>
                        <div className="space-y-2">
                          {Array.isArray(currentMove.levels) && currentMove.levels.map((lvl, li) => (
                            <div key={li} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${LEVEL_COLORS[li % 3]}`}>
                                {lvl.label}
                              </span>
                              <span className="text-sm text-text">{lvl.exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Common errors */}
                      <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-yellow-400/80 uppercase tracking-wider mb-2">⚠ Lỗi thường gặp</p>
                        <p className="text-xs text-yellow-300/70 leading-relaxed">{currentMove.errors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ── SECTION 5: WARM-UP & COOL-DOWN ─────────────────────────────────── */}
      {(Array.isArray(warmup) || Array.isArray(cooldown)) && (
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Warm-up */}
            {Array.isArray(warmup) && (
              <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/4">
                <div className="h-px bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent" />
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=40"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.06 }}
                  />
                </div>
                <div className="relative p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🔥</span>
                    <h3 className="font-bold text-orange-400 text-sm">{tPillars('pillarA.warmup_title')}</h3>
                    <span className="ml-auto text-[10px] text-muted whitespace-nowrap">5–8 phút</span>
                  </div>
                  <div className="space-y-2">
                    {warmup.map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3 hover:border-orange-500/20 transition-colors duration-150"
                      >
                        <span className="w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text">{row.exercise}</p>
                          <p className="text-[10px] text-muted truncate">{row.how}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 whitespace-nowrap">
                          {row.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Cool-down */}
            {Array.isArray(cooldown) && (
              <div className="relative overflow-hidden rounded-2xl border border-teal-500/20 bg-teal-500/4">
                <div className="h-px bg-gradient-to-r from-teal-500/60 via-teal-500/20 to-transparent" />
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=40"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.06 }}
                  />
                </div>
                <div className="relative p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🧘</span>
                    <h3 className="font-bold text-teal-400 text-sm">{tPillars('pillarA.cooldown_title')}</h3>
                    <span className="ml-auto text-[10px] text-muted whitespace-nowrap">4–6 phút</span>
                  </div>
                  <div className="space-y-2">
                    {cooldown.map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3 hover:border-teal-500/20 transition-colors duration-150"
                      >
                        <span className="w-6 h-6 rounded-full bg-teal-500/15 border border-teal-500/25 text-teal-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text">{row.exercise}</p>
                          <p className="text-[10px] text-muted truncate">{row.how}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 whitespace-nowrap">
                          {row.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SECTION 6: WORKOUT PLANS ────────────────────────────────────────── */}
      {Array.isArray(workoutPlans) && currentPlan && (
        <section className="mb-16">
          <h2 className="text-2xl font-black text-text mb-2 flex items-center gap-3">
            <span>📋</span> {tPillars('pillarA.plans_title')}
          </h2>
          <p className="text-muted text-sm mb-6">Chọn kế hoạch phù hợp với mục tiêu và thời gian của bạn</p>

          {/* Plan selector tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {workoutPlans.map((plan, i) => {
              const s = PLAN_STYLE[plan.color] || PLAN_STYLE.green;
              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(i)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    activePlan === i
                      ? `${s.bg} ${s.text} ${s.border}`
                      : 'bg-surface border-border text-muted hover:border-accent/30 hover:text-text'
                  }`}
                >
                  {plan.name}
                  <span className={`text-[10px] ${activePlan === i ? 'opacity-70' : 'opacity-40'}`}>
                    · {plan.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Plan detail card */}
          {(() => {
            const ps = PLAN_STYLE[currentPlan.color] || PLAN_STYLE.green;
            return (
              <div className={`relative overflow-hidden rounded-2xl border ${ps.border} animate-fade-in-up`}>
                {/* Image header strip */}
                <div className="relative h-24 overflow-hidden">
                  <img
                    src={PLAN_IMAGES[currentPlan.id] || PLAN_IMAGES.busy}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.25 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  <div className="absolute bottom-3 left-5 flex items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ps.bg} ${ps.text} ${ps.border}`}>
                      {currentPlan.name}
                    </span>
                    <span className="text-xs text-white/40">· {currentPlan.tag}</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Blocks type */}
                  {currentPlan.type === 'blocks' && Array.isArray(currentPlan.blocks) && (
                    <div className="space-y-3">
                      {currentPlan.blocks.map((block, i) => (
                        <div
                          key={i}
                          className="flex gap-4 items-start bg-bg border border-border rounded-xl px-5 py-4 hover:border-border-bright transition-colors"
                        >
                          <div className="shrink-0 text-right min-w-[60px]">
                            <span className={`text-xs font-black ${ps.text}`}>{block.time}</span>
                          </div>
                          <div className={`w-px self-stretch ${ps.bar} opacity-30 shrink-0`} />
                          <div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">{block.phase}</p>
                            <p className="text-sm text-text leading-relaxed">{block.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Exercises type */}
                  {currentPlan.type === 'exercises' && Array.isArray(currentPlan.exercises) && (
                    <div className="space-y-2">
                      {currentPlan.exercises.map((ex, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-bg border border-border rounded-xl px-4 py-3 hover:border-border-bright transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full ${ps.bg} border ${ps.border} ${ps.text} text-[10px] font-black flex items-center justify-center shrink-0`}>
                              {i + 1}
                            </span>
                            <span className="text-sm text-text">{ex.name}</span>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ps.bg} ${ps.text} ${ps.border} whitespace-nowrap`}>
                            {ex.sets}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ── SECTION 7: PROGRESSION STAIRCASE ───────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-2xl font-black text-text mb-2 flex items-center gap-3">
          <span>📈</span> Bậc Thang Tiến Bộ
        </h2>
        <p className="text-muted text-sm mb-8">Nguyên tắc vàng: chỉ thay đổi 1 biến mỗi lần — tránh chấn thương</p>

        <div className="relative">
          {/* Connecting line on mobile */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent md:hidden" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PROG_STEPS.map((step, i) => (
              <div
                key={i}
                className="group relative flex md:flex-col items-start md:items-center gap-3 bg-surface border border-border rounded-2xl p-4 hover:border-accent/30 hover:bg-accent/4 transition-all duration-200"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/25 text-accent font-black text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-text text-sm">{step.label}</p>
                  <p className="text-muted text-[11px] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: SAFETY PRINCIPLES ────────────────────────────────────── */}
      {pillar.sections && Array.isArray(pillar.sections) && pillar.sections[5] && (
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/4 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-yellow-400 text-base">{pillar.sections[5].title}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {Array.isArray(pillar.sections[5].items) && pillar.sections[5].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-300/70">
                    <span className="text-yellow-400/60 mt-0.5 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 9: PROGRESS TESTS ───────────────────────────────────────── */}
      {Array.isArray(progressTests) && (
        <section className="mb-16">
          <h2 className="text-2xl font-black text-text mb-6 flex items-center gap-3">
            <span>📊</span> {tPillars('pillarA.tests_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {progressTests.map((row, i) => {
              const colors = ['green', 'blue', 'purple', 'teal', 'orange'];
              const s = MOVE_STYLE[colors[i % 5]] || MOVE_STYLE.green;
              return (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl border ${s.border} ${s.bg} p-5 hover:scale-[1.01] transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${s.bar}`} />
                  </div>
                  <h3 className={`font-bold text-sm ${s.text} mb-2`}>{row.capability}</h3>
                  <p className="text-muted text-xs leading-relaxed">{row.test}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SECTION 11: CTA LINKS ───────────────────────────────────────────── */}
      <section className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* 12-week program card */}
          <Link
            to="/program"
            className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/4 p-6 hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🗓️</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình 12 Tuần</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">
                Khung ngày chuẩn, nhịp tuần gợi ý, bộ test tiến bộ theo giai đoạn.
              </p>
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-2.5 transition-all">
                Xem lộ trình <span>→</span>
              </span>
            </div>
          </Link>

          {/* Sample programs card */}
          <Link
            to="/sample-programs"
            className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/4 p-6 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình Mẫu</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">
                6 mục tiêu × 24 tuần — tìm lộ trình phù hợp nhất với bạn.
              </p>
              <span className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-bold group-hover:gap-2.5 transition-all">
                Khám phá <span>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
