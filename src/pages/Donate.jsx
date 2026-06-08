import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

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

// ── Images per "uses" category ────────────────────────────────────────────────
const USES_IMAGES = [
  'https://images.unsplash.com/photo-1574607383476-f517f562d7a7?w=500&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&q=70&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=70&auto=format&fit=crop',
];

const IMPACT_ICONS = ['💚', '🎬', '📚', '🌐', '🏃'];

export default function Donate() {
  const { t } = useTranslation();
  const impactChain = t('donate.impact_chain', { returnObjects: true });
  const impactItems = t('donate.impact_items', { returnObjects: true });
  const impactStats = t('donate.impact_stats', { returnObjects: true });
  const uses        = t('donate.uses',         { returnObjects: true });
  const faq         = t('donate.faq',          { returnObjects: true });
  const [openFaq, setOpenFaq] = useState(null);

  // Mouse tracking for hero
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const handleMouseMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  // CSS injection
  useEffect(() => {
    const id = 'dn2-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes dn2Reveal { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
      @keyframes dn2Sub    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
      @keyframes dn2Line   { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
      @keyframes dn2Float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      @keyframes dn2Float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-11px) rotate(4deg)} }
      @keyframes dn2Float3 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-7px) rotate(-3deg)} }
      @keyframes dn2GlowA  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.1)} }
      @keyframes dn2GlowB  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,15px) scale(1.08)} }
      @keyframes dn2Shimmer{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes dn2HeartBeat { 0%,100%{transform:scale(1)} 15%{transform:scale(1.18)} 30%{transform:scale(1)} 45%{transform:scale(1.1)} 60%{transform:scale(1)} }
      @keyframes dn2ChainIn { from{opacity:0;transform:scale(0.85) translateY(10px)} to{opacity:1;transform:none} }
      @property --dn2-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      @keyframes dn2Spin { to { --dn2-angle: 360deg; } }
      .dn2-orbit {
        background: conic-gradient(
          from var(--dn2-angle),
          transparent 0deg, transparent 55deg,
          rgba(245,158,11,0) 65deg, rgba(245,158,11,0.7) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(245,158,11,0.7) 99deg,
          rgba(245,158,11,0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dn2Spin 5s linear infinite;
      }
      .dn2-title   { animation: dn2Reveal 0.72s cubic-bezier(0.25,0.46,0.45,0.94) 0.1s both; }
      .dn2-sub     { animation: dn2Sub    0.6s ease 0.3s both; }
      .dn2-line    { animation: dn2Line   0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s both; transform-origin:center; }
      .dn2-glow-a  { animation: dn2GlowA 8s ease-in-out infinite; }
      .dn2-glow-b  { animation: dn2GlowB 10s ease-in-out 2s infinite; }
      .dn2-float   { animation: dn2Float  4.2s ease-in-out infinite; }
      .dn2-float-2 { animation: dn2Float2 5.8s ease-in-out 1.5s infinite; }
      .dn2-float-3 { animation: dn2Float3 6.5s ease-in-out 0.8s infinite; }
      .dn2-heart   { animation: dn2HeartBeat 2.2s ease-in-out infinite; }
      .dn2-shimmer-line {
        background: linear-gradient(90deg,transparent 0%,rgba(245,158,11,0.55) 28%,rgba(255,255,255,0.88) 50%,rgba(34,197,94,0.55) 72%,transparent 100%);
        background-size:200% 100%;
        animation: dn2Shimmer 3s ease-in-out infinite;
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
        {/* BG image */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=70&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-[0.09]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg/85" />
        </div>

        {/* Mouse glow — warm amber */}
        <div
          className="absolute w-[480px] h-[480px] rounded-full pointer-events-none blur-[90px] transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.13) 0%, rgba(34,197,94,0.07) 60%, transparent 100%)',
            left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%`,
            transform: 'translate(-50%,-50%)',
          }}
        />

        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-amber-500/6 rounded-full blur-[80px] dn2-glow-a pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-accent/5 rounded-full blur-[60px] dn2-glow-b pointer-events-none" />

        {/* Floating tags */}
        <div className="absolute top-8 left-8 dn2-float opacity-55 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-amber-500/25 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {t('donate.floating_transparent')}
          </span>
        </div>
        <div className="absolute top-12 right-10 dn2-float-2 opacity-50 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-accent/25 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {t('donate.floating_free_tag')}
          </span>
        </div>
        <div className="absolute bottom-10 left-16 dn2-float-3 opacity-45 pointer-events-none hidden md:block">
          <span className="flex items-center gap-1.5 bg-surface/70 border border-teal-500/25 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-teal-400">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> {t('donate.floating_community')}
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 py-16 md:py-20 px-6 md:px-12 text-center">
          {/* Heartbeat icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-accent/15 border border-amber-500/30 mb-6 shadow-[0_0_35px_rgba(245,158,11,0.2)] dn2-heart">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-amber-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-base font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 dn2-sub">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-glow-pulse" />
            Ủng Hộ Tác Giả
          </div>

          {/* Title */}
          <h1
            className="dn2-title font-bold mb-5 leading-tight"
            style={{
              fontSize: 'clamp(2.2rem,5vw,3.6rem)',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 25%, #ffffff 50%, #86efac 75%, #5eead4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {t('donate.title')}
          </h1>

          {/* Shimmer underline */}
          <div className="flex justify-center mb-5 relative">
            <div className="dn2-line h-0.5 rounded-full w-24" style={{ background: 'linear-gradient(90deg,transparent,#f59e0b,#22c55e,transparent)' }} />
            <div className="absolute top-0 h-0.5 w-16 rounded-full dn2-shimmer-line" />
          </div>

          <p className="dn2-sub text-muted text-lg md:text-lg leading-relaxed max-w-lg mx-auto">
            {t('donate.subtitle')}
          </p>
        </div>
      </section>

      {/* ── IMPACT CHAIN ──────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-10">
        <p className="text-[11px] font-bold text-muted uppercase tracking-widest text-center mb-5">{t('donate.impact_journey')}</p>
        <div className="flex flex-wrap items-center justify-center gap-0">
          {Array.isArray(impactChain) && impactChain.map((label, i) => (
            <div key={i} className="flex items-center gap-0" style={{ animation: `dn2ChainIn 0.5s ease ${i * 100}ms both` }}>
              <div className="flex flex-col items-center px-3 md:px-4 py-3 rounded-2xl hover:bg-white/3 transition-colors duration-200 cursor-default group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-2 border transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    background: i === 0
                      ? 'rgba(245,158,11,0.12)' : i === impactChain.length - 1
                      ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                    borderColor: i === 0
                      ? 'rgba(245,158,11,0.3)' : i === impactChain.length - 1
                      ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  {IMPACT_ICONS[i] || '•'}
                </div>
                <span className="text-[10px] text-muted text-center leading-snug max-w-[70px]">{label}</span>
              </div>
              {i < impactChain.length - 1 && (
                <svg className="w-4 h-4 text-border shrink-0 mx-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── STATS ROW ─────────────────────────────────────────────────────────── */}
      {Array.isArray(impactStats) && (
        <RevealBlock className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            {impactStats.map((stat, i) => {
              const colors = ['#f59e0b', '#22c55e', '#14b8a6'];
              const c = colors[i % colors.length];
              return (
                <div
                  key={i}
                  className="relative rounded-2xl border border-border bg-surface/60 p-5 text-center overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${c}14 0%, transparent 70%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${c}60, transparent)` }} />
                  <p className="font-extrabold text-3xl md:text-4xl mb-1" style={{ color: c }}>{stat.value}</p>
                  <p className="text-muted text-base leading-snug">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </RevealBlock>
      )}

      {/* ── IMPACT LIST + BANK CARD ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        {/* Impact list */}
        <RevealBlock delay={0}>
          <div className="relative rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-400 group h-full">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=70&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/95 to-surface" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/4 to-transparent" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="relative p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-accent/12 border border-accent/25 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-accent">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text">{t('donate.impact_title')}</h3>
              </div>

              <ul className="space-y-3">
                {Array.isArray(impactItems) && impactItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg text-muted leading-relaxed group/item">
                    <span
                      className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-all duration-200 group-hover/item:scale-110"
                      style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)', color: '#22c55e' }}
                    >
                      {i + 1}
                    </span>
                    <span className="group-hover/item:text-text/80 transition-colors duration-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealBlock>

        {/* Bank / QR */}
        <RevealBlock delay={100}>
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 hover:border-amber-500/40 transition-all duration-400 group h-full">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface to-surface" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/4 to-teal-500/3" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            <div className="relative p-6 flex flex-col h-full gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-amber-400">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <path d="M2 10h20"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-text">{t('donate.bank_title')}</h3>
              </div>

              {/* QR placeholder — styled */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                {/* Orbit ring around QR placeholder */}
                <div className="dn2-orbit rounded-2xl p-[1.5px]">
                  <div className="w-32 h-32 rounded-[14px] bg-surface border border-border/50 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                    {/* Fake QR dots */}
                    <div className="grid grid-cols-5 gap-1 opacity-20">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${[0,1,2,5,10,14,15,16,17,18,20,21,24].includes(i) ? 'bg-amber-400' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <span className="absolute bottom-2 text-[9px] text-muted/50 font-bold uppercase tracking-widest">{t('donate.qr_updating')}</span>
                  </div>
                </div>

                {/* Bank info */}
                <div className="w-full rounded-2xl border border-dashed border-amber-500/20 bg-amber-500/4 p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-glow-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{t('donate.qr_updating')}</span>
                  </div>
                  <p className="text-base text-muted/60 leading-relaxed">{t('donate.bank_placeholder')}</p>
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>
      </div>

      {/* ── HOW FUNDS ARE USED ────────────────────────────────────────────────── */}
      {Array.isArray(uses) && (
        <RevealBlock className="mb-10">
          <h2 className="text-xl font-black text-text mb-1">{t('donate.uses_title')}</h2>
          <p className="text-muted text-base mb-6">{t('donate.uses_subtitle')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uses.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(34,197,94,0.1)]"
              >
                {/* Image */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={USES_IMAGES[i] || USES_IMAGES[0]}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface" />
                  {/* Icon overlay */}
                  <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-surface/80 border border-border backdrop-blur-sm flex items-center justify-center text-2xl shadow-sm">
                    {item.icon}
                  </div>
                </div>

                {/* Text */}
                <div className="p-4 pt-2">
                  <p className="text-lg font-bold text-text mb-1.5">{item.title}</p>
                  <p className="text-base text-muted leading-relaxed">{item.desc}</p>
                </div>

                {/* Hover shimmer top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/50 transition-all duration-500" />
              </div>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── FAQ ACCORDION ─────────────────────────────────────────────────────── */}
      {Array.isArray(faq) && (
        <RevealBlock className="mb-10">
          <h2 className="text-xl font-black text-text mb-1">{t('donate.faq_title')}</h2>
          <p className="text-muted text-base mb-6">{t('donate.faq_subtitle')}</p>

          <div className="space-y-2">
            {faq.map((item, i) => (
              <div
                key={i}
                className="group bg-surface border border-border hover:border-accent/25 rounded-2xl overflow-hidden transition-all duration-250"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/2 transition-colors duration-150"
                >
                  <span
                    className="w-6 h-6 rounded-lg border flex items-center justify-center text-[11px] font-black shrink-0 transition-all duration-200"
                    style={{
                      background: openFaq === i ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: openFaq === i ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)',
                      color: openFaq === i ? '#f59e0b' : '#64748b',
                    }}
                  >
                    {openFaq === i ? '−' : '+'}
                  </span>
                  <span className="flex-1 text-lg font-semibold text-text">{item.q}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pl-[3.75rem]">
                    <p className="text-lg text-muted leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </RevealBlock>
      )}

      {/* ── CLOSING THANKS BANNER ─────────────────────────────────────────────── */}
      <RevealBlock>
        <div className="relative rounded-3xl overflow-hidden">
          {/* BG */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=70&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-[0.10]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-bg/90 via-bg/80 to-bg/90" />
          </div>

          {/* Warm glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/8 rounded-full blur-[60px]" />
          </div>

          <div className="relative border border-amber-500/20 rounded-3xl p-8 md:p-12 text-center">
            {/* Heartbeat */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-accent/15 border border-amber-500/25 mb-5 shadow-[0_0_30px_rgba(245,158,11,0.18)] dn2-heart">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-amber-400">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-text mb-3">{t('donate.thanks')}</h3>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-4 max-w-xs mx-auto" />
            <p className="text-muted/80 text-lg leading-relaxed max-w-md mx-auto mb-6">{t('donate.thanks_note')}</p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: '🛡️', text: t('donate.trust_transparent') },
                { icon: '🆓', text: t('donate.trust_free') },
                { icon: '💚', text: t('donate.trust_community') },
              ].map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-surface/60 border border-border/50 rounded-full px-4 py-2 text-base text-muted backdrop-blur-sm"
                >
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
