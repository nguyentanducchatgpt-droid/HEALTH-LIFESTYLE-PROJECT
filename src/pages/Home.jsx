import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PillarCard from '../components/PillarCard';
import ContactSection from '../components/ContactSection';
import DonateSection from '../components/DonateSection';

const PILLARS = ['pillarA', 'pillarB', 'pillarC', 'pillarD', 'pillarE', 'pillarF'];

export default function Home() {
  const { t } = useTranslation();
  const stats = t('home.stats', { returnObjects: true });

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-green-500/6 rounded-full blur-[100px] animate-orb-float" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] animate-orb-float-delay" />
        </div>
        {/* Grid dot overlay */}
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-40" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            Khoa học · Đơn giản · Hiệu quả
          </div>

          {/* Icon */}
          <div className="text-6xl md:text-7xl mb-6 animate-float">🌿</div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight animate-fade-in-up">
            <span className="text-text">{t('hero.title')}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base md:text-lg max-w-xl mx-auto leading-relaxed text-muted/80 animate-fade-in-up stagger-2">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up stagger-3">
            <a
              href="#pillars"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
            >
              {t('hero.cta')}
              <span>↓</span>
            </a>
            <Link
              to="/program"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-accent/40 hover:border-accent text-accent hover:bg-accent/8 font-semibold rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5"
            >
              {t('nav.program')}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────── */}
      {Array.isArray(stats) && (
        <div className="grid grid-cols-3 gap-3 mb-14 animate-fade-in-up stagger-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative bg-surface border border-border rounded-2xl p-5 text-center overflow-hidden group hover:border-accent/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="text-gradient font-extrabold text-2xl md:text-3xl">{stat.value}</p>
              <p className="text-muted text-xs mt-1.5 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Safety note ───────────────────────────────── */}
      <div className="flex items-start gap-3 bg-yellow-500/6 border border-yellow-500/20 rounded-2xl p-4 mb-14">
        <span className="text-yellow-400 text-lg shrink-0 mt-0.5">⚠️</span>
        <p className="text-yellow-300/80 text-sm leading-relaxed">{t('common.safety_note').replace('⚠️ ', '')}</p>
      </div>

      {/* ── 6 Pillars ─────────────────────────────────── */}
      <section id="pillars" className="mb-20 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text">{t('hero.pillars_title')}</h2>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((key, i) => (
            <PillarCard key={key} pillarKey={key} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── Quote block ───────────────────────────────── */}
      <div className="relative mb-20 overflow-hidden rounded-3xl">
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

      <ContactSection />
      <DonateSection />
    </div>
  );
}
