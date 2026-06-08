import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ── Scroll reveal ─────────────────────────────────────────────────────────────
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
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(22px)', transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);


export default function Contact() {
  const { t } = useTranslation();
  const email      = t('contact.email');
  const zalo       = t('contact.zalo');
  const topics     = t('contact.topics', { returnObjects: true });
  const faqPreview = t('contact.faq_preview', { returnObjects: true });

  // Mouse tracking for hero glow
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const handleMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  // CSS injection
  useEffect(() => {
    const id = 'ct2-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes ct2Reveal { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:none; } }
      @keyframes ct2Sub    { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
      @keyframes ct2Line   { from { transform:scaleX(0); opacity:0; } to { transform:scaleX(1); opacity:1; } }
      @keyframes ct2Float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      @keyframes ct2Float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-11px) rotate(4deg)} }
      @keyframes ct2Float3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(-3deg)} }
      @keyframes ct2GlowDrift { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-18px) scale(1.12)} }
      @keyframes ct2Shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes ct2TagPop { from{opacity:0;transform:scale(0.8) translateY(6px)} to{opacity:1;transform:none} }
      @keyframes ct2StatUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
      @property --ct2-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      @keyframes ct2Spin { to { --ct2-angle:360deg; } }
      .ct2-orbit {
        background: conic-gradient(
          from var(--ct2-angle),
          transparent 0deg, transparent 55deg,
          rgba(34,197,94,0) 65deg, rgba(34,197,94,0.75) 85deg,
          rgba(255,255,255,0.95) 92deg, rgba(34,197,94,0.75) 99deg,
          rgba(34,197,94,0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: ct2Spin 4s linear infinite;
      }
      .ct2-title   { animation: ct2Reveal 0.72s cubic-bezier(0.25,0.46,0.45,0.94) 0.08s both; }
      .ct2-sub     { animation: ct2Sub    0.6s ease 0.28s both; }
      .ct2-line    { animation: ct2Line   0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.45s both; transform-origin:center; }
      .ct2-glow-a  { animation: ct2GlowDrift 8s ease-in-out infinite; }
      .ct2-glow-b  { animation: ct2GlowDrift 10s ease-in-out 2.5s infinite reverse; }
      .ct2-float   { animation: ct2Float  4.5s ease-in-out infinite; }
      .ct2-float-2 { animation: ct2Float2 5.5s ease-in-out 1.3s infinite; }
      .ct2-float-3 { animation: ct2Float3 6s ease-in-out 0.7s infinite; }
      .ct2-shimmer-line {
        background: linear-gradient(90deg,transparent 0%,rgba(34,197,94,0.55) 30%,rgba(255,255,255,0.9) 50%,rgba(20,184,166,0.55) 70%,transparent 100%);
        background-size:200% 100%;
        animation: ct2Shimmer 2.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative rounded-3xl overflow-hidden mb-12 cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouse({ x: 0.5, y: 0.5 })}
      >
        {/* Background image */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=70&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg/80" />
        </div>

        {/* Mouse-tracking glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none blur-[90px] transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(20,184,166,0.07) 60%, transparent 100%)',
            left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%`,
            transform: 'translate(-50%,-50%)',
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-accent/6 rounded-full blur-[80px] ct2-glow-a pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-teal-500/5 rounded-full blur-[60px] ct2-glow-b pointer-events-none" />

        {/* Floating tags */}
        <div className="absolute top-8 left-8 ct2-float opacity-60 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-accent/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {t('contact.floating_connect')}
          </span>
        </div>
        <div className="absolute top-12 right-10 ct2-float-2 opacity-50 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-teal-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> {t('contact.floating_response')}
          </span>
        </div>
        <div className="absolute bottom-10 right-16 ct2-float-3 opacity-45 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {t('contact.floating_free')}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 py-16 md:py-20 px-6 md:px-12 text-center">
          {/* Role badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent text-base font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 ct2-sub">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('contact.bio_role')}
          </div>

          {/* Title */}
          <h1
            className="ct2-title font-bold mb-5 leading-tight"
            style={{
              fontSize: 'clamp(2.4rem,5.5vw,3.8rem)',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 30%, #86efac 60%, #5eead4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {t('contact.title')}
          </h1>

          {/* Shimmer underline */}
          <div className="flex justify-center mb-5">
            <div className="ct2-line h-0.5 rounded-full w-24" style={{ background: 'linear-gradient(90deg, transparent, #22c55e, #14b8a6, transparent)' }} />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 h-0.5 w-16 rounded-full ct2-shimmer-line" style={{ marginTop: '-1.4rem' }} />

          {/* Subtitle */}
          <p className="ct2-sub text-muted text-lg md:text-lg leading-relaxed max-w-lg mx-auto">
            {t('contact.intro')}
          </p>
        </div>
      </section>

      {/* ── AUTHOR CARD ───────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-8">
        <div className="relative rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-500 group">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=70&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-surface/80" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-teal-500/3" />
          </div>

          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-7 items-start">
            {/* Avatar with orbit ring */}
            <div className="shrink-0 relative">
              <div className="ct2-orbit rounded-[22px] p-[1.5px]">
                <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-accent/20 via-surface to-teal-500/20 border border-accent/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.18)] overflow-hidden">
                  <span className="text-3xl font-black text-accent tracking-tight">ND</span>
                </div>
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-accent border-3 border-bg flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-bg" />
              </span>
              {/* Glow */}
              <div className="absolute inset-0 rounded-[22px] bg-accent/10 blur-xl -z-10" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-lg font-black text-text">{t('contact.bio_name')}</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5">Creator</span>
              </div>
              <p className="text-accent text-base font-semibold mb-4">{t('contact.bio_role')}</p>

              <h3 className="text-lg font-bold text-text mb-2">{t('contact.story_title')}</h3>
              <p className="text-muted text-lg leading-relaxed mb-5">{t('contact.story_text')}</p>

              <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-full px-4 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-accent text-base font-semibold">{t('contact.mission')}</span>
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── STATS ROW ─────────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { val: 24, suffix: 'h', label: t('contact.stat_response'), color: '#22c55e' },
            { val: 100, suffix: '%', label: t('contact.stat_free'), color: '#14b8a6' },
            { val: 6, suffix: '+', label: t('contact.stat_years'), color: '#a855f7' },
          ].map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-border bg-surface/60 p-4 text-center overflow-hidden group hover:border-opacity-50 transition-all duration-300 hover:-translate-y-0.5"
              style={{ '--sc': s.color }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}10 0%, transparent 70%)` }} />
              <div className="text-3xl font-black mb-0.5" style={{ color: s.color }}>
                <AnimatedCounter target={s.val} suffix={s.suffix} duration={1200 + i * 200} />
              </div>
              <div className="text-[11px] text-muted leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── CONTACT CARDS ─────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="group relative rounded-3xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(34,197,94,0.16)] block"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=70&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-400"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface" />
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/60 transition-all duration-500" />

            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent group-hover:bg-accent/18 group-hover:border-accent/50 transition-all duration-300 shrink-0 p-3">
                  <IconMail />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[11px] text-muted font-bold uppercase tracking-widest mb-1">{t('contact.email_label')}</p>
                  <p className="text-lg font-bold text-text group-hover:text-accent transition-colors duration-200 truncate">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse shrink-0" />
                <span className="flex items-center gap-1.5 text-base text-muted">
                  <IconClock />{t('contact.email_response')}
                </span>
              </div>
            </div>
          </a>

          {/* Zalo */}
          <a
            href={`https://zalo.me/${zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-3xl overflow-hidden border border-border hover:border-blue-500/50 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(59,130,246,0.16)] block"
          >
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&q=70&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-400"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/60 transition-all duration-500" />

            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/18 group-hover:border-blue-500/50 transition-all duration-300 shrink-0 p-3">
                  <IconChat />
                </div>
                <div className="pt-0.5">
                  <p className="text-[11px] text-muted font-bold uppercase tracking-widest mb-1">{t('contact.zalo_label')}</p>
                  <p className="text-lg font-bold text-text group-hover:text-blue-400 transition-colors duration-200">{t('contact.zalo_direct')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border/40">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-glow-pulse shrink-0" />
                <span className="flex items-center gap-1.5 text-base text-muted">
                  <IconClock />{t('contact.zalo_avail')}
                </span>
              </div>
            </div>
          </a>

        </div>
      </RevealBlock>

      {/* ── TOPICS ────────────────────────────────────────────────────────────── */}
      {Array.isArray(topics) && (
        <RevealBlock className="mb-10">
          <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">{t('contact.topics_title')}</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-surface border border-border hover:border-accent/35 hover:bg-accent/5 rounded-full px-4 py-2 text-base text-muted hover:text-text transition-all duration-200 cursor-default group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="w-1 h-1 rounded-full bg-accent/50 group-hover:bg-accent shrink-0 transition-colors duration-200" />
                {topic}
              </span>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── FAQ TEASER → /faq ─────────────────────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <div className="relative rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-400 group">
          {/* BG */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1000&q=65&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-surface/80" />
            <div className="absolute inset-0 bg-gradient-to-br from-accent/3 to-teal-500/3" />
          </div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Left */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 bg-accent/8 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                  <span className="w-1 h-1 rounded-full bg-accent" /> {t('contact.faq_teaser_badge')}
                </div>
                <h3 className="text-xl font-black text-text mb-2">{t('contact.faq_teaser_title')}</h3>
                <p className="text-muted text-lg leading-relaxed mb-4">{t('contact.faq_teaser_desc')}</p>

                {/* Preview questions */}
                <div className="space-y-2 mb-5">
                  {Array.isArray(faqPreview) && faqPreview.map((q, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-surface border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                      </span>
                      <span className="text-base text-muted">{q}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/faq"
                  className="inline-flex items-center gap-2 bg-accent/10 hover:bg-accent/18 border border-accent/30 hover:border-accent/60 text-accent text-lg font-bold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 group/link"
                >
                  {t('contact.faq_teaser_cta')}
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200"><IconArrow /></span>
                </Link>
              </div>

              {/* Right: stat */}
              <div className="flex flex-col items-center justify-center gap-1 shrink-0 bg-accent/5 border border-accent/15 rounded-2xl px-8 py-6 md:py-8">
                <span className="text-5xl font-black text-accent">26+</span>
                <span className="text-base text-muted text-center">{t('contact.faq_stat_label1')}<br/>{t('contact.faq_stat_label2')}</span>
              </div>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── CLOSING CTA ───────────────────────────────────────────────────────── */}
      <RevealBlock>
        <div className="relative rounded-3xl overflow-hidden">
          {/* BG image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=70&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-[0.10]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-bg/90 via-bg/75 to-bg/90" />
          </div>

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/8 rounded-full blur-[60px]" />
          </div>

          <div className="relative border border-accent/18 rounded-3xl p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-teal-500/15 border border-accent/30 mb-5 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6 text-accent">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-text mb-2">{t('contact.bio_name')}</h3>
            <p className="text-accent text-base font-bold uppercase tracking-widest mb-4">{t('contact.bio_role')}</p>

            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mb-5 max-w-xs mx-auto" />

            <p className="text-muted/90 text-lg md:text-lg leading-relaxed italic max-w-md mx-auto mb-6">
              "{t('contact.cta')}"
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 bg-accent text-bg text-lg font-bold px-6 py-2.5 rounded-full hover:bg-accent/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(34,197,94,0.35)]"
              >
                <IconMail /> {t('contact.email_label')}
              </a>
              <a
                href={`https://zalo.me/${zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-surface border border-blue-500/30 text-blue-400 text-lg font-bold px-6 py-2.5 rounded-full hover:border-blue-500/60 hover:bg-blue-500/8 transition-all duration-200 hover:-translate-y-0.5"
              >
                <IconChat /> Zalo
              </a>
            </div>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
