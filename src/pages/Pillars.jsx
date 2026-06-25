import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/* ── Helper: auto-derive 4 key points from section items ── */
function makePoints(items) {
  const icons = ['📌', '✅', '🎯', '💡'];
  return (items || []).slice(0, 4).map((item, i) => {
    const match = item.match(/^(.+?)\s*[—–]\s*(.+)$/);
    if (match) return { icon: icons[i], label: match[1].trim(), note: match[2].trim() };
    const words = item.split(' ');
    const cut = Math.min(Math.ceil(words.length / 2), 5);
    return { icon: icons[i], label: words.slice(0, cut).join(' '), note: words.slice(cut).join(' ') || '—' };
  });
}

/* ── Section detail modal ── */
function SectionModal({ section, meta, pillarTitle, pillarIcon, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const rgb = meta.rgb;
  const color = meta.accent;
  const img = meta.image;
  const points = makePoints(section.items);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={img} alt={section.title} className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.4)` }}>
              {pillarIcon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{pillarTitle}</p>
              <h2 className="font-bold text-white text-lg leading-tight max-w-xs">{section.title}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        {/* Content */}
        <div className="p-5 md:p-7">
          {/* All items as numbered list */}
          <ul className="space-y-2.5 mb-5">
            {(section.items || []).map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          {/* Quick link */}
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${rgb},0.5)` }}>{t('modal.explore_detail')}</p>
            <div className="flex flex-wrap gap-2">
              <Link to={`/pillar/${meta.id}`} onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                style={{ color, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.22)` }}>
                <span>{pillarIcon}</span> {pillarTitle} →
              </Link>
            </div>
          </div>
          {/* Key points */}
          <div className="grid grid-cols-2 gap-2.5">
            {points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{t('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Per-pillar metadata ──────────────────────────────────────────── */
const PILLAR_META = [
  {
    key: 'pillarA', id: 'a', label: 'A',
    textColor: 'text-green-400',  activeBg: 'bg-green-500/15', border: 'border-green-500/40',
    bar: 'from-green-500 to-emerald-400', glow: 'shadow-green-500/20',
    btnBg: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/40 text-green-400',
    badgeBg: 'bg-green-500/10 border-green-500/25 text-green-400',
    imgOverlay: 'from-green-950/60',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1000&q=75',
    imgAlt: 'Người đang tập thể dục',
    accent: '#22c55e', rgb: '34,197,94',
  },
  {
    key: 'pillarB', id: 'b', label: 'B',
    textColor: 'text-lime-400',   activeBg: 'bg-lime-500/15',   border: 'border-lime-500/40',
    bar: 'from-lime-500 to-green-400',    glow: 'shadow-lime-500/20',
    btnBg: 'bg-lime-500/10 hover:bg-lime-500/20 border-lime-500/40 text-lime-400',
    badgeBg: 'bg-lime-500/10 border-lime-500/25 text-lime-400',
    imgOverlay: 'from-lime-950/60',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=75',
    imgAlt: 'Thực phẩm lành mạnh đa dạng màu sắc',
    accent: '#84cc16', rgb: '132,204,22',
  },
  {
    key: 'pillarC', id: 'c', label: 'C',
    textColor: 'text-teal-400',   activeBg: 'bg-teal-500/15',   border: 'border-teal-500/40',
    bar: 'from-teal-500 to-cyan-400',     glow: 'shadow-teal-500/20',
    btnBg: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/40 text-teal-400',
    badgeBg: 'bg-teal-500/10 border-teal-500/25 text-teal-400',
    imgOverlay: 'from-teal-950/60',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&q=75',
    imgAlt: 'Thiền định buổi sáng yên bình',
    accent: '#14b8a6', rgb: '20,184,166',
  },
  {
    key: 'pillarD', id: 'd', label: 'D',
    textColor: 'text-purple-400', activeBg: 'bg-purple-500/15', border: 'border-purple-500/40',
    bar: 'from-purple-500 to-violet-400', glow: 'shadow-purple-500/20',
    btnBg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/40 text-purple-400',
    badgeBg: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
    imgOverlay: 'from-purple-950/60',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1000&q=75',
    imgAlt: 'Thiền định tâm trí bình an',
    accent: '#a855f7', rgb: '168,85,247',
  },
  {
    key: 'pillarE', id: 'e', label: 'E',
    textColor: 'text-blue-400',   activeBg: 'bg-blue-500/15',   border: 'border-blue-500/40',
    bar: 'from-blue-500 to-cyan-400',     glow: 'shadow-blue-500/20',
    btnBg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/40 text-blue-400',
    badgeBg: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    imgOverlay: 'from-blue-950/60',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1000&q=75',
    imgAlt: 'Kiến thức sức khỏe y khoa',
    accent: '#3b82f6', rgb: '59,130,246',
  },
  {
    key: 'pillarF', id: 'f', label: 'F',
    textColor: 'text-orange-400', activeBg: 'bg-orange-500/15', border: 'border-orange-500/40',
    bar: 'from-orange-500 to-amber-400',  glow: 'shadow-orange-500/20',
    btnBg: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/40 text-orange-400',
    badgeBg: 'bg-orange-500/10 border-orange-500/25 text-orange-400',
    imgOverlay: 'from-orange-950/60',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1000&q=75',
    imgAlt: 'Công cụ theo dõi sức khỏe và lập kế hoạch',
    accent: '#f97316', rgb: '249,115,22',
  },
];

const SECTION_ICONS = ['📌', '🥗', '⏰', '🎯', '💡', '📊', '🔑', '⚡'];

export default function Pillars() {
  const { t }           = useTranslation();
  const { t: tPillars } = useTranslation('pillars');
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  const pillars = PILLAR_META.map(meta => ({
    meta,
    data: tPillars(meta.key, { returnObjects: true }),
  }));

  const { meta: m, data: p } = pillars[activeTab];
  const sections = Array.isArray(p?.sections) ? p.sections : [];

  useEffect(() => {
    const id = 'pll-header-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes pllReveal {
        from { opacity:0; transform: translateY(22px) scale(0.96); filter: blur(6px); }
        to   { opacity:1; transform: translateY(0)    scale(1);    filter: blur(0);  }
      }
      @keyframes pllLineGrow {
        from { transform: scaleX(0); opacity:0; }
        to   { transform: scaleX(1); opacity:1; }
      }
      @keyframes pllBadgePop {
        from { opacity:0; transform: scale(0.75) translateY(10px); }
        to   { opacity:1; transform: scale(1)    translateY(0); }
      }
      @keyframes pllGlowDrift {
        0%,100% { transform: translateX(0)   translateY(0)   scale(1);   }
        33%     { transform: translateX(30px) translateY(-20px) scale(1.08); }
        66%     { transform: translateX(-20px) translateY(15px) scale(0.94); }
      }
      .pll-title {
        animation: pllReveal 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both;
      }
      .pll-line {
        transform-origin: center;
        animation: pllLineGrow 0.9s cubic-bezier(0.25,0.46,0.45,0.94) both;
        animation-delay: 0.35s;
      }
      .pll-badge {
        animation: pllBadgePop 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        animation-delay: 0.6s;
      }
      .pll-glow-a {
        animation: pllGlowDrift 9s ease-in-out infinite;
      }
      .pll-glow-b {
        animation: pllGlowDrift 12s ease-in-out infinite reverse;
        animation-delay: -4s;
      }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Page Header ───────────────────────────────── */}
      <div className="text-center mb-10 relative">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="pll-glow-a absolute top-0 left-1/4 w-[500px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
          <div className="pll-glow-b absolute top-0 right-1/4 w-[360px] h-[240px] bg-green-400/3 rounded-full blur-[80px]" />
        </div>
        <div className="relative">
          {/* Title */}
          <h1 className="pll-title text-4xl md:text-6xl font-black tracking-tight text-text mb-4">
            {(() => {
              const title = t('hero.pillars_title');
              const idx = title.lastIndexOf('360');
              if (idx === -1) return title;
              return <>{title.slice(0, idx)}<span className="sk360-num">360</span></>;
            })()}
          </h1>

          {/* Gradient underline */}
          <div className="pll-line mx-auto mb-5 h-[3px] w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg, #22c55e, #5eead4, #a855f7)' }} />

          {/* Badge (moved here from top) */}
          <span className="pll-badge inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-base font-semibold px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('hero.badge')}
          </span>
        </div>
      </div>

      {/* ── Tab Strip ─────────────────────────────────── */}
      <div className="relative mb-6">
        {/* Scrollable tab row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {pillars.map(({ meta, data }, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={meta.key}
                onClick={() => setActiveTab(i)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-lg font-semibold whitespace-nowrap shrink-0 transition-all duration-250 border ${
                  isActive
                    ? `${meta.activeBg} ${meta.border} ${meta.textColor} shadow-lg ${meta.glow}`
                    : 'bg-surface border-border text-muted hover:text-text hover:border-border-bright hover:bg-white/3'
                }`}
              >
                {/* Active gradient underline */}
                {isActive && (
                  <span className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${meta.bar} opacity-80`} />
                )}
                <span className="text-lg">{data?.icon}</span>
                <span className="hidden sm:inline">{data?.title}</span>
                <span className="sm:hidden font-black">{meta.label}</span>
                {isActive && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full shrink-0 bg-gradient-to-r ${meta.bar}`} />
                )}
              </button>
            );
          })}
        </div>
        {/* Fade edge for scroll hint */}
        <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-bg to-transparent pointer-events-none sm:hidden" />
      </div>

      {/* ── Tab Panel ─────────────────────────────────── */}
      <div
        key={activeTab}
        className="animate-fade-in-up"
      >
        {/* ── Hero split: Image + Intro ───────────────── */}
        <div className={`relative rounded-3xl overflow-hidden border ${m.border} mb-5`}>
          {/* Gradient top bar */}
          <div className={`h-[3px] bg-gradient-to-r ${m.bar}`} />

          <div className="grid md:grid-cols-5 min-h-[340px]">
            {/* Image — left 2/5 */}
            <div className="relative md:col-span-2 h-56 md:h-auto overflow-hidden">
              <img
                src={m.image}
                alt={m.imgAlt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${m.imgOverlay} via-transparent md:bg-gradient-to-r`} />
              {/* Pillar badge on image */}
              <div className="absolute top-4 left-4">
                <span className={`text-base font-black tracking-[0.15em] uppercase px-3 py-1.5 rounded-xl backdrop-blur-sm bg-black/50 border ${m.border} ${m.textColor}`}>
                  {t('pillars_page.pillar_badge')} {m.label}
                </span>
              </div>
            </div>

            {/* Content — right 3/5 */}
            <div className="md:col-span-3 p-6 md:p-8 flex flex-col gap-4 bg-surface">
              {/* Icon + title */}
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl text-4xl flex items-center justify-center shrink-0 ${m.activeBg} border ${m.border}`}>
                  {p?.icon}
                </div>
                <div className="min-w-0">
                  <h2 className={`text-3xl md:text-4xl font-black text-text leading-tight`}>
                    {p?.title}
                  </h2>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest mt-1 px-2.5 py-0.5 rounded-full border ${m.badgeBg}`}>
                    {p?.subtitle}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted text-lg md:text-lg leading-relaxed">
                {p?.description}
              </p>

              {/* Key highlights — first 4 items from first section */}
              {sections[0]?.items?.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  {sections[0].items.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 ${m.activeBg} border ${m.border} ${m.textColor}`}>
                        {i + 1}
                      </span>
                      <span className="text-lg text-muted/90 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA row */}
              <div className="flex items-center gap-3 pt-2 mt-auto">
                <Link
                  to={`/pillar/${m.id}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-lg font-semibold transition-all duration-200 ${m.btnBg}`}
                >
                  {t('pillars_page.view_all')}
                  <span>→</span>
                </Link>
                <span className={`text-base ${m.textColor} opacity-60`}>
                  {sections.length} {t('pillars_page.topics')} · {sections.reduce((acc, s) => acc + (s.items?.length || 0), 0)} {t('pillars_page.items')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sections Grid ─────────────────────────────── */}
        {sections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {sections.map((section, i) => (
              <div
                key={i}
                className={`bg-surface border border-border hover:${m.border} rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer hover:-translate-y-0.5 hover:shadow-lg`}
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => setActiveSection({ section, idx: i })}
              >
                {/* Section top bar */}
                <div className={`h-[2px] bg-gradient-to-r ${m.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="p-5">
                  {/* Section header */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className={`w-7 h-7 rounded-xl text-lg flex items-center justify-center shrink-0 ${m.activeBg} border ${m.border}`}>
                      {SECTION_ICONS[i % SECTION_ICONS.length]}
                    </span>
                    <h3 className="font-bold text-text text-lg leading-snug">{section.title}</h3>
                  </div>

                  {/* Section items */}
                  <ul className="space-y-2">
                    {(section.items || []).slice(0, 4).map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-base text-muted hover:text-text transition-colors duration-150">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black shrink-0 mt-0.5 ${m.activeBg} ${m.textColor}`}>
                          ✓
                        </span>
                        <span className="leading-relaxed line-clamp-2">{item}</span>
                      </li>
                    ))}
                    {section.items?.length > 4 && (
                      <li className={`text-base ${m.textColor} pl-6 opacity-70`}>
                        +{section.items.length - 4} {t('pillars_page.more_items')}
                      </li>
                    )}
                  </ul>
                  <div className={`mt-3 pt-3 border-t border-border/40 flex items-center justify-between`}>
                    <span className="text-[10px] text-muted/50 uppercase tracking-wider">{section.items?.length || 0} {t('pillars_page.section_items')}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${m.textColor}`}>
                      {t('pillars_page.section_view_detail')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────── */}
        <div className={`relative rounded-2xl overflow-hidden border ${m.border} p-6 mb-4`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${m.activeBg} opacity-40 pointer-events-none`} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-text text-lg">{t('pillars_page.cta_start')} {p?.title}?</p>
              <p className="text-muted text-lg mt-0.5">{t('pillars_page.cta_detail')}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/pillar/${m.id}`}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-lg font-bold border transition-all duration-200 ${m.btnBg}`}
              >
                {t('pillars_page.view_detail')}
              </Link>
              <Link
                to="/program"
                className="text-base text-muted hover:text-accent transition-colors duration-150 underline underline-offset-2"
              >
                {t('pillars_page.roadmap_12w')}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Other Pillars Quick Nav ────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className="text-base text-muted self-center mr-1">{t('pillars_page.other_pillars')}</span>
          {pillars.filter((_, i) => i !== activeTab).map(({ meta, data }, i) => (
            <button
              key={meta.key}
              onClick={() => setActiveTab(PILLAR_META.indexOf(meta))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-base font-medium border bg-surface border-border text-muted hover:${meta.border} hover:${meta.textColor} transition-all duration-200`}
            >
              <span>{data?.icon}</span>
              <span className="hidden sm:inline">{data?.title}</span>
              <span className="sm:hidden">{meta.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeSection && (
        <SectionModal
          section={activeSection.section}
          meta={m}
          pillarTitle={p?.title || ''}
          pillarIcon={p?.icon || ''}
          onClose={() => setActiveSection(null)}
        />
      )}
    </div>
  );
}
