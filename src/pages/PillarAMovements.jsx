import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ─── Style & image config ───────────────────────────────────────────────────────

const MS = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  ring:'ring-green-500/40',  glow:'rgba(34,197,94,0.3)',   overlay:'from-green-950/90 via-green-900/60 to-transparent'  },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/10',   border:'border-lime-500/30',   bar:'bg-lime-500',   ring:'ring-lime-500/40',   glow:'rgba(163,230,53,0.3)',  overlay:'from-lime-950/90 via-lime-900/60 to-transparent'   },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   ring:'ring-blue-500/40',   glow:'rgba(59,130,246,0.3)',  overlay:'from-blue-950/90 via-blue-900/60 to-transparent'   },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   ring:'ring-teal-500/40',   glow:'rgba(20,184,166,0.3)',  overlay:'from-teal-950/90 via-teal-900/60 to-transparent'   },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', ring:'ring-purple-500/40', glow:'rgba(168,85,247,0.3)',  overlay:'from-purple-950/90 via-purple-900/60 to-transparent' },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', ring:'ring-orange-500/40', glow:'rgba(249,115,22,0.3)',  overlay:'from-orange-950/90 via-orange-900/60 to-transparent' },
};

const WARMUP_IMGS = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=70',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=70',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=70',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=70',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&q=70',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=70',
];

const COOLDOWN_IMGS = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=70',
  'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&q=70',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=70',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70',
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=70',
];

const WARMUP_TAB_META = [
  {
    key: 'warmup',
    label: 'Khởi Động Chuẩn',
    icon: '🔥',
    color: 'orange',
    duration: '5–8 phút',
    headerImg: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=70',
    desc: 'Tăng nhiệt cơ thể, bôi trơn khớp, kích hoạt hệ thần kinh trước khi tập',
    tip: 'Không bỏ qua dù đang vội — 5 phút này giảm đáng kể nguy cơ chấn thương và cải thiện hiệu suất tập 15–20%. Cơ thể cần đạt 38°C để co bóp tối ưu.',
    science: 'Nhiệt độ cơ tăng 1°C → tăng 2–5% lực cơ và tốc độ dẫn truyền thần kinh',
    fallbackSteps: [
      { exercise: 'Thở cơ hoành',    how: 'Tay đặt lên bụng, bụng phồng khi hít vào, thở ra chậm qua miệng', duration: '4–6 nhịp' },
      { exercise: 'Đi bộ tại chỗ',   how: 'Nâng gối vừa phải, vai thả lỏng, nhịp nhàng đều đặn',              duration: '60 giây'  },
      { exercise: 'Xoay vai',         how: 'Xoay chậm về phía sau, không rút cổ, cảm nhận sự giãn ra',         duration: '10 vòng'  },
      { exercise: 'Ép bờ vai',        how: 'Kéo nhẹ hai vai về sau, mở ngực, giữ 1–2 giây mỗi lần',            duration: '10 lần'   },
      { exercise: 'Gập hông cơ bản',  how: 'Đẩy hông ra sau, lưng thẳng, gối hơi chùng — không cúi bằng lưng', duration: '8 lần'    },
      { exercise: 'Ngồi xuống ghế',   how: 'Ngồi xuống rồi đứng lên kiểm soát, không "rơi" xuống ghế',          duration: '8 lần'    },
    ],
  },
  {
    key: 'cooldown',
    label: 'Giãn Cơ Sau Tập',
    icon: '🧘',
    color: 'teal',
    duration: '5–10 phút',
    headerImg: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=70',
    desc: 'Phục hồi nhịp tim, tăng linh hoạt khớp, giảm đau cơ ngày hôm sau',
    tip: 'Giữ mỗi động tác ≥ 20–30 giây để cơ thực sự được kéo giãn. Không nín thở — thở đều đặn giúp cơ mềm hơn. Cảm giác căng nhẹ là bình thường, đau nhói là dừng ngay.',
    science: 'Giãn cơ tĩnh sau tập giảm đau DOMS 20–30% và cải thiện linh hoạt dài hạn',
    fallbackSteps: [
      { exercise: 'Giãn gấp hông', how: 'Quỳ một chân, đẩy hông nhẹ về trước — cảm nhận căng trước đùi',  duration: '30 giây/bên' },
      { exercise: 'Giãn đùi sau',  how: 'Duỗi một chân, gập người nhẹ, lưng không gù quá mức',              duration: '30 giây/bên' },
      { exercise: 'Mở ngực',       how: 'Dan hai tay sau lưng hoặc chống tay vào cửa, ngực mở ra trước',     duration: '30 giây'     },
      { exercise: 'Tư thế em bé',  how: 'Ngồi về gót, vươn tay ra trước, thở chậm, cảm nhận lưng giãn',     duration: '30–60 giây'  },
      { exercise: 'Thở chậm',      how: 'Hít vào 4 giây, thở ra 6 giây — chú ý bụng phồng xẹp',             duration: '4–6 nhịp'    },
    ],
  },
];

const LEVEL_COLORS = [
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
];

const MOVE_VIDEO = { squat:'SQUAT', hinge:'HINGE', push:'PUSH', pull:'PULL', core:'CORE', breath:'BREATH' };

// ─── Click-to-play video ────────────────────────────────────────────────────────

function MovementVideoPlayer({ videoKey, s }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const src = `${import.meta.env.BASE_URL}videos/${videoKey}.mp4`;

  const handlePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    el.play().catch(() => {});
    setPlaying(true);
  };

  if (error) {
    return (
      <div className={`rounded-2xl border ${s.border} bg-surface flex items-center justify-center`} style={{ aspectRatio: '9/16' }}>
        <p className="text-base text-muted text-center px-4">Video không tải được.<br />Kiểm tra kết nối.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black cursor-pointer" style={{ aspectRatio: '9/16' }} onClick={!playing ? handlePlay : undefined}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        loop
        controls={playing}
        preload="metadata"
        src={src}
        onError={() => setError(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${s.border} shadow-lg`}
            style={{ background: 'rgba(0,0,0,0.55)', boxShadow: `0 0 28px ${s.glow}` }}>
            <svg className={`w-7 h-7 ${s.text} ml-1`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className={`mt-3 text-base font-semibold ${s.text}`}
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Nhấn để xem</span>
        </div>
      )}
    </div>
  );
}

// ─── Page component ─────────────────────────────────────────────────────────────

export default function PillarAMovements() {
  const { t: tPillars } = useTranslation('pillars');

  const movementsDetail = tPillars('pillarA.movements_detail', { returnObjects: true });
  const warmupI18n      = tPillars('pillarA.warmup',           { returnObjects: true });
  const cooldownI18n    = tPillars('pillarA.cooldown',         { returnObjects: true });

  const [activeMove,   setActiveMove]   = useState(0);
  const [activeWarmup, setActiveWarmup] = useState('warmup');

  const currentMove = Array.isArray(movementsDetail) ? movementsDetail[activeMove] : null;

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=50',
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=50',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=50',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.13 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-green-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          <nav className="flex items-center gap-1.5 text-base text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">Vận Động & Tập Luyện</Link>
            <span className="text-border/60">/</span>
            <span className="text-green-400 font-medium">Vận Động & Khởi Động</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-500/8 border border-green-500/20 text-green-400 text-base font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            1 / 4 · Vận Động & Khởi Động
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-3">
            6 Mẫu Vận Động Nền Tảng &amp;<br />
            <span className="text-green-400">Khởi Động & Giãn Cơ Sau Tập</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-xl">
            Học 6 chuyển động nền tảng với video minh họa chi tiết, khởi động chuẩn trước khi tập
            và giãn cơ đúng cách để tối ưu phục hồi.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '6', label: 'Mẫu vận động cơ bản' },
              { n: '6', label: 'Video hướng dẫn HD' },
              { n: '3', label: 'Cấp độ mỗi bài tập' },
              { n: '15', label: 'Phút khởi động + giãn cơ' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-green-400 font-extrabold text-lg leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6 Movements section ────────────────────────────────────────────────── */}
      {Array.isArray(movementsDetail) && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-lg font-black flex items-center justify-center shrink-0">⚡</span>
            <h2 className="text-3xl font-black text-text">6 Mẫu Vận Động Nền Tảng</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <p className="text-muted text-lg mb-6">Chọn bài tập để xem video minh họa và hướng dẫn chi tiết</p>

          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap pb-0.5">
              {movementsDetail.map((m, i) => {
                const s = MS[m.color] || MS.green;
                const isActive = activeMove === i;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMove(i)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-lg font-bold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                      isActive
                        ? `${s.bg} ${s.text} border ${s.border}`
                        : 'text-muted border border-transparent hover:border-border hover:text-text hover:bg-white/4'
                    }`}
                  >
                    <span className="text-lg leading-none">{m.icon}</span>
                    <span>{m.name}</span>
                    {isActive && <span className={`absolute bottom-0 inset-x-3 h-0.5 ${s.bar} rounded-full`} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          {currentMove && (() => {
            const s   = MS[currentMove.color] || MS.green;
            const vid = MOVE_VIDEO[currentMove.id];
            return (
              <div key={currentMove.id} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
                <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.5)')}, transparent)` }} />
                <div className="p-5 md:p-6">
                  <div className="grid md:grid-cols-[300px_1fr] gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl shrink-0`}>{currentMove.icon}</div>
                        <div>
                          <h3 className={`font-black text-lg ${s.text}`}>{currentMove.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${s.bg} ${s.border} ${s.text}`}>{currentMove.prescription}</span>
                        </div>
                      </div>
                      {vid && <MovementVideoPlayer key={vid} videoKey={vid} s={s} />}
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">🎯 Mục tiêu</p>
                        <p className="text-base text-text leading-relaxed">{currentMove.goal}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Bài cơ bản</p>
                        <p className={`font-bold ${s.text} mb-2`}>{currentMove.basic}</p>
                        <p className="text-base text-muted leading-relaxed">{currentMove.basic_how}</p>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                        <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">💡 Cue kỹ thuật</p>
                        <p className={`text-lg font-bold ${s.text} leading-relaxed`}>{currentMove.cue}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Cấp độ tiến bộ</p>
                        <div className="space-y-2">
                          {Array.isArray(currentMove.levels) && currentMove.levels.map((lvl, li) => (
                            <div key={li} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${LEVEL_COLORS[li % 3]}`}>{lvl.label}</span>
                              <span className="text-lg text-text">{lvl.exercise}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-yellow-400/80 uppercase tracking-wider mb-2">⚠ Lỗi thường gặp</p>
                        <p className="text-base text-yellow-300/70 leading-relaxed">{currentMove.errors}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {/* ── Warmup & cooldown tabs ──────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-7">
          <span className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-lg font-black flex items-center justify-center shrink-0">🔥</span>
          <h2 className="text-3xl font-black text-text">Khởi Động & Giãn Cơ Sau Tập</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* Pill switcher */}
        <div className="flex gap-1.5 p-1.5 bg-surface rounded-2xl border border-border w-fit mb-6">
          {WARMUP_TAB_META.map(tab => {
            const isActive = activeWarmup === tab.key;
            const s = MS[tab.color];
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveWarmup(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all duration-250 focus:outline-none ${
                  isActive
                    ? `${s.bg} ${s.text} border ${s.border} shadow-sm`
                    : 'text-muted hover:text-text'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${
                  isActive ? `${s.bg} ${s.border} ${s.text}` : 'bg-bg border-border/50 text-muted'
                }`}>
                  {tab.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active tab panel */}
        {(() => {
          const tab       = WARMUP_TAB_META.find(t => t.key === activeWarmup) || WARMUP_TAB_META[0];
          const s         = MS[tab.color];
          const i18nList  = tab.key === 'warmup' ? warmupI18n : cooldownI18n;
          const exercises = Array.isArray(i18nList) && i18nList.length > 0 ? i18nList : tab.fallbackSteps;
          const imgs      = tab.key === 'warmup' ? WARMUP_IMGS : COOLDOWN_IMGS;
          return (
            <div key={tab.key} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.7)')}, transparent)` }} />

              {/* Header image */}
              <div className="relative h-48 overflow-hidden">
                <img src={tab.headerImg} alt="" className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/20" />

                <div className="absolute top-3 right-4 max-w-[220px]">
                  <div className="glass border border-white/10 rounded-xl px-3 py-2">
                    <p className="text-[9px] text-white/55 leading-snug">🔬 {tab.science}</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-4xl">{tab.icon}</span>
                    <h3 className={`font-black text-2xl ${s.text}`}>{tab.label}</h3>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.bg} ${s.border} ${s.text}`}>{tab.duration}</span>
                  </div>
                  <p className="text-white/60 text-base leading-relaxed max-w-md">{tab.desc}</p>
                </div>
              </div>

              {/* Exercise list */}
              <div className="p-5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">Trình tự thực hiện</p>
                <div className="space-y-2">
                  {exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-0 bg-bg/60 border border-border/40 rounded-xl overflow-hidden transition-all duration-200 hover:bg-bg/80"
                    >
                      <div className="w-16 h-16 shrink-0 overflow-hidden">
                        <img
                          src={imgs[i] || imgs[imgs.length - 1]}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                          style={{ opacity: 0.65 }}
                        />
                      </div>
                      <span className={`w-6 h-6 rounded-full ${s.bg} border ${s.border} ${s.text} text-[10px] font-black flex items-center justify-center shrink-0 mx-3`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0 py-3 pr-2">
                        <p className="text-base font-semibold text-text">{ex.exercise}</p>
                        <p className="text-[10px] text-muted mt-0.5 leading-snug line-clamp-2">{ex.how}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border mr-3 whitespace-nowrap ${s.bg} ${s.border} ${s.text}`}>
                        {ex.duration}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4 mt-4">
                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                  <p className={`text-[10px] font-bold ${s.text} uppercase tracking-wider mb-2`}>💡 Ghi nhớ quan trọng</p>
                  <p className="text-base text-text/80 leading-relaxed">{tab.tip}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-4 mb-4">
        <div className="w-32 shrink-0" />
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-base bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-green-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <Link
          to="/pillar/a/framework"
          className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group"
        >
          <span>Khung Ngày & Thời Gian</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
