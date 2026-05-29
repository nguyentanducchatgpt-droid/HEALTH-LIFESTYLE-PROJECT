import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PillarCard from '../components/PillarCard';
import ThoughtBubble from '../components/ThoughtBubble';

const PILLARS = ['pillarA', 'pillarB', 'pillarC', 'pillarD', 'pillarE', 'pillarF'];

const PILLAR_IMAGES = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=70',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=70',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70',
];

const PILLAR_COLORS = ['green', 'lime', 'teal', 'purple', 'blue', 'orange'];
const PILLAR_ROUTES = ['/pillar/a', '/pillar/b', '/pillar/c', '/pillar/d', '/pillar/e', '/pillar/f'];
const PILLAR_ICONS  = ['🏃', '🥗', '🌿', '🧘', '📚', '🛠️'];

const HOME_STAT_TOOLTIPS = [
  '10 phút/ngày đủ để bắt đầu xây thói quen. Não cần tính nhất quán, không phải thời gian dài — 10 phút × 30 ngày hiệu quả hơn 3 giờ × 1 lần/tuần.',
  '6 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ. Hệ thống toàn diện đảm bảo không bỏ sót bất kỳ góc độ nào của sức khỏe.',
  '12 tuần là đủ để xây nền thói quen bền vững — từ người chưa tập đến duy trì đều đặn. Chia 3 giai đoạn: Khởi Động · Tăng Nền · Cá Nhân Hóa.',
];

export default function Home() {
  const { t }      = useTranslation();
  const { t: tP }  = useTranslation('pillars');
  const stats      = t('home.stats', { returnObjects: true });
  const pillarKeys = ['pillarA', 'pillarB', 'pillarC', 'pillarD', 'pillarE', 'pillarF'];

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative -mx-4 md:-mx-8 mb-16 overflow-hidden" style={{ minHeight: '560px' }}>
        {/* Full-bleed hero image */}
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=70"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.12 }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/30 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-bg/60 pointer-events-none" />
        {/* Grid dots */}
        <div className="absolute inset-0 grid-dots opacity-30 pointer-events-none" />
        {/* Green orbs */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 pt-20 pb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('hero.badge')}
          </div>

          {/* Icon + Heading */}
          <div className="text-5xl md:text-6xl mb-5 animate-float">🌿</div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight animate-fade-in-up">
            <span className="text-text">{t('hero.title')}</span>
          </h1>
          <p className="mt-5 text-base md:text-lg max-w-xl mx-auto leading-relaxed text-muted/80 animate-fade-in-up stagger-2">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up stagger-3">
            <a
              href="#pillars"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
            >
              {t('hero.cta')} <span>↓</span>
            </a>
            <Link
              to="/program"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-accent/40 hover:border-accent text-accent hover:bg-accent/8 font-semibold rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5"
            >
              {t('nav.program')} <span>→</span>
            </Link>
          </div>

          {/* Stats row — inside hero, bottom */}
          {Array.isArray(stats) && (
            <div className="mt-14 grid grid-cols-3 gap-4 w-full max-w-2xl">
              {stats.map((stat, i) => (
                <div key={i} className="group/hstat relative text-center">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/hstat:opacity-100 scale-90 group-hover/hstat:scale-100 -translate-y-1 group-hover/hstat:translate-y-0 transition-all duration-200 origin-bottom">
                    <ThoughtBubble text={HOME_STAT_TOOLTIPS[i]} idx={`h${i}`} color="#22c55e" />
                  </div>
                  <p className="text-gradient font-extrabold text-xl md:text-2xl cursor-default">{stat.value}</p>
                  <p className="text-muted text-[11px] mt-1 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Visual image strip (6 pillar thumbnails) ── */}
      <div className="overflow-x-auto scrollbar-hide mb-16 -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
          {pillarKeys.map((key, i) => {
            const p = tP(key, { returnObjects: true });
            const colorMap = { green: '#22c55e', lime: '#84cc16', teal: '#14b8a6', purple: '#a855f7', blue: '#3b82f6', orange: '#f97316' };
            const color = colorMap[p?.color] || '#22c55e';
            return (
              <Link
                key={key}
                to={PILLAR_ROUTES[i]}
                className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer"
                style={{ width: '180px', height: '220px' }}
              >
                <img
                  src={PILLAR_IMAGES[i]}
                  alt={p?.title || key}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-xl mb-1">{PILLAR_ICONS[i]}</div>
                  <p className="text-white text-xs font-bold leading-snug">{p?.title || key}</p>
                </div>
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 6 Pillars grid ───────────────────────────── */}
      <section id="pillars" className="mb-20 scroll-mt-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text">
            {(() => {
              const title = t('hero.pillars_title');
              const idx = title.lastIndexOf('360');
              if (idx === -1) return title;
              return <>{title.slice(0, idx)}<span className="sk360-num">360</span></>;
            })()}
          </h2>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((key, i) => (
            <PillarCard key={key} pillarKey={key} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── Quote block ───────────────────────────────── */}
      <div className="relative mb-12 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="relative border border-accent/15 rounded-3xl p-10 md:p-14 text-center">
          <span className="text-4xl text-accent/30 font-serif leading-none select-none">"</span>
          <p className="text-text text-xl md:text-2xl font-medium leading-relaxed -mt-4">
            {t('home.quote')}
          </p>
          <p className="text-muted text-sm mt-5 font-medium">{t('home.quote_author')}</p>
        </div>
      </div>

      {/* ── Compact contact CTA ──────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-10 mb-6">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm"
        >
          ✉️ {t('nav.contact')}
        </Link>
        <Link
          to="/donate"
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm"
        >
          🙏 {t('nav.donate')}
        </Link>
      </div>
    </div>
  );
}
