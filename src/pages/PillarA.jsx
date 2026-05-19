import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ─── Sub-section config ─────────────────────────────────────────────────────────

const SUB_SECTIONS = [
  {
    n: '01',
    path: '/pillar/a/movements',
    title: '6 Mẫu Vận Động Nền Tảng',
    sub: 'Khởi Động & Giãn Cơ Sau Tập',
    icon: '🏃',
    color: 'green',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=65',
    desc: 'Học 6 chuyển động nền tảng với video minh họa chi tiết, khởi động chuẩn và giãn cơ đúng cách sau mỗi buổi tập.',
    features: ['6 video HD từng bài', 'Khởi động 5–8 phút', 'Giãn cơ 5–10 phút'],
    cta: 'Học động tác',
    glow: 'rgba(34,197,94,0.18)',
    border: 'border-green-500/25 hover:border-green-500/50',
    badge: 'bg-green-500/8 border-green-500/20 text-green-400',
    dot:   'bg-green-400',
    text:  'text-green-400',
    chip:  'bg-green-500/10 border-green-500/20 text-green-300',
    bar:   'from-green-500/70 to-transparent',
  },
  {
    n: '02',
    path: '/pillar/a/framework',
    title: 'Khung Ngày Tập 20–40 Phút',
    sub: 'Chọn Khung Thời Gian Luyện Tập',
    icon: '⏱️',
    color: 'orange',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=65',
    desc: 'Khung ngày 4 khối thời gian chuẩn và 8 mức thời gian từ 20 đến 180 phút — tìm lịch phù hợp với cuộc sống.',
    features: ['4 khối trong ngày', '8 mức: 20–180 phút', 'Kế hoạch chi tiết'],
    cta: 'Xây khung ngày',
    glow: 'rgba(249,115,22,0.18)',
    border: 'border-orange-500/25 hover:border-orange-500/50',
    badge: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
    dot:   'bg-orange-400',
    text:  'text-orange-400',
    chip:  'bg-orange-500/10 border-orange-500/20 text-orange-300',
    bar:   'from-orange-500/70 to-transparent',
  },
  {
    n: '03',
    path: '/pillar/a/weekly',
    title: 'Nhịp Tuần Gợi Ý',
    sub: 'Buổi Tập Theo Mục Tiêu',
    icon: '📅',
    color: 'teal',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=65',
    desc: '3 giai đoạn nhịp tuần linh hoạt và 6 lộ trình cá nhân hóa từ người mới bắt đầu đến vận động viên.',
    features: ['3 giai đoạn × 7 ngày', '6 lộ trình mục tiêu', 'Lịch chi tiết mỗi ngày'],
    cta: 'Lên lịch tuần',
    glow: 'rgba(20,184,166,0.18)',
    border: 'border-teal-500/25 hover:border-teal-500/50',
    badge: 'bg-teal-500/8 border-teal-500/20 text-teal-400',
    dot:   'bg-teal-400',
    text:  'text-teal-400',
    chip:  'bg-teal-500/10 border-teal-500/20 text-teal-300',
    bar:   'from-teal-500/70 to-transparent',
  },
  {
    n: '04',
    path: '/pillar/a/progress',
    title: 'Bậc Thang Tiến Bộ',
    sub: 'Kiểm Tra Tiến Bộ Hàng Tháng',
    icon: '🏆',
    color: 'purple',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65',
    desc: '6 lộ trình theo mục tiêu với bậc thang cụ thể, kết hợp test kiểm tra định kỳ và radar chart theo dõi.',
    features: ['6 lộ trình mục tiêu', '4–5 bậc tiến bộ', 'Radar chart hàng tháng'],
    cta: 'Theo dõi tiến bộ',
    glow: 'rgba(168,85,247,0.18)',
    border: 'border-purple-500/25 hover:border-purple-500/50',
    badge: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
    dot:   'bg-purple-400',
    text:  'text-purple-400',
    chip:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    bar:   'from-purple-500/70 to-transparent',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarA', { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-16" style={{ minHeight: 460 }}>
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=50',
            'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=50',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=50',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.18 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/60 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-500/4 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-14 pb-12 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted hover:text-accent text-xs transition-colors mb-6 group">
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            Trang chủ
          </Link>
          <div className="flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse shrink-0" />
            🏃 Trụ Cột A — Vận Động &amp; Tập Luyện
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-text leading-[1.05] mb-4">
            Xây nền thể lực<br />
            <span className="text-gradient">từng ngày, từng bước</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl mb-8">{pillar.description}</p>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: '🏃', n: '6',    label: 'Bài tập nền tảng có video' },
              { icon: '⏱️', n: '8',    label: 'Mức khung thời gian'       },
              { icon: '📅', n: '3',    label: 'Giai đoạn nhịp tuần'       },
              { icon: '🏆', n: '3',    label: 'Kỳ kiểm tra tiến bộ'       },
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

      {/* ── Journey label ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <p className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">Chọn chủ đề để bắt đầu</p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* ── Flow indicator ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-1.5 mb-8 overflow-x-auto pb-1">
        {SUB_SECTIONS.map((sec, i) => (
          <div key={sec.n} className="flex items-center gap-1.5 shrink-0">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${sec.badge} text-[10px] font-bold whitespace-nowrap`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sec.dot} shrink-0`} />
              {sec.n} {sec.icon}
            </div>
            {i < SUB_SECTIONS.length - 1 && (
              <span className="text-border text-xs">→</span>
            )}
          </div>
        ))}
      </div>

      {/* ── Portal cards 2×2 ───────────────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-5 mb-16">
        {SUB_SECTIONS.map(sec => (
          <Link
            key={sec.n}
            to={sec.path}
            className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${sec.border}`}
            style={{ minHeight: 320 }}
          >
            {/* Glow on hover */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: `0 0 60px ${sec.glow}` }}
            />

            {/* Top accent gradient bar */}
            <div className={`h-0.5 w-full bg-gradient-to-r ${sec.bar}`} />

            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={sec.img}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ opacity: 0.14 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/50 via-transparent to-transparent" />
            </div>

            {/* Number badge — top right */}
            <div className="absolute top-4 right-4 w-11 h-11 rounded-2xl bg-bg/70 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <span className={`text-sm font-black ${sec.text}`}>{sec.n}</span>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 flex flex-col h-full" style={{ minHeight: 318 }}>
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-5 transition-all duration-300 group-hover:border-white/20`}>
                {sec.icon}
              </div>

              {/* Titles */}
              <h3 className="font-black text-lg text-text leading-tight mb-1">{sec.title}</h3>
              <p className={`text-xs font-semibold ${sec.text} mb-3`}>{sec.sub}</p>

              {/* Description */}
              <p className="text-muted text-xs leading-relaxed mb-5 flex-1">{sec.desc}</p>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {sec.features.map(f => (
                  <span key={f} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${sec.chip}`}>{f}</span>
                ))}
              </div>

              {/* CTA arrow */}
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${sec.text} group-hover:gap-2.5 transition-all duration-200`}>
                {sec.cta}
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Safety callout ─────────────────────────────────────────────────────── */}
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

      {/* ── CTA links ──────────────────────────────────────────────────────────── */}
      <section className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/program" className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/4 p-6 hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🗓️</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình 12 Tuần</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Khung ngày chuẩn, nhịp tuần gợi ý, bộ test tiến bộ theo giai đoạn.</p>
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-2.5 transition-all">Xem lộ trình <span>→</span></span>
            </div>
          </Link>
          <Link to="/sample-programs" className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/4 p-6 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình Mẫu</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">6 mục tiêu × 24 tuần — tìm lộ trình phù hợp nhất với bạn.</p>
              <span className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-bold group-hover:gap-2.5 transition-all">Khám phá <span>→</span></span>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
