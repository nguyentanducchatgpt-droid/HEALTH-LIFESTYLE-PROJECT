import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/* ─── Phase image/color config ────────────────────────── */
const PHASE_CFG = [
  { accent:'text-green-400',  border:'border-green-500/30',  bg:'bg-green-500/5',  dot:'bg-green-500 border-green-500',  bar:'from-green-500/70',  img:'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=70' },
  { accent:'text-lime-400',   border:'border-lime-500/30',   bg:'bg-lime-500/5',   dot:'bg-lime-500 border-lime-500',    bar:'from-lime-500/70',   img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70' },
  { accent:'text-purple-400', border:'border-purple-500/30', bg:'bg-purple-500/5', dot:'bg-purple-500 border-purple-500',bar:'from-purple-500/70',  img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=70' },
];

const DAY_CFG = {
  green:  { bg:'bg-green-500/8  border-green-500/25  text-green-400',  dot:'bg-green-400'  },
  blue:   { bg:'bg-blue-500/8   border-blue-500/25   text-blue-400',   dot:'bg-blue-400'   },
  teal:   { bg:'bg-teal-500/8   border-teal-500/25   text-teal-400',   dot:'bg-teal-400'   },
  purple: { bg:'bg-purple-500/8 border-purple-500/25 text-purple-400', dot:'bg-purple-400' },
};

/* ─── Tab definitions (5 tabs) ───────────────────────── */
const TABS = [
  {
    id: 'roadmap',
    icon: '🗓️',
    activeColor: 'text-green-400',
    activeBorder:'border-green-500/50',
    bar:         'bg-green-500',
    num:         'bg-green-500/15 border-green-500/40 text-green-400',
  },
  {
    id: 'daily',
    icon: '⏱️',
    activeColor: 'text-accent',
    activeBorder:'border-accent/50',
    bar:         'bg-accent',
    num:         'bg-accent/15 border-accent/40 text-accent',
  },
  {
    id: 'weekly',
    icon: '📅',
    activeColor: 'text-blue-400',
    activeBorder:'border-blue-500/50',
    bar:         'bg-blue-500',
    num:         'bg-blue-500/15 border-blue-500/40 text-blue-400',
  },
  {
    id: 'tips',
    icon: '💡',
    activeColor: 'text-yellow-400',
    activeBorder:'border-yellow-500/50',
    bar:         'bg-yellow-500',
    num:         'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
  },
  {
    id: 'progress',
    icon: '📈',
    activeColor: 'text-purple-400',
    activeBorder:'border-purple-500/50',
    bar:         'bg-purple-500',
    num:         'bg-purple-500/15 border-purple-500/40 text-purple-400',
  },
];

export default function Program() {
  const { t } = useTranslation();
  const phases       = t('program.phases',        { returnObjects: true });
  const dailyBlocks  = t('program.daily_blocks',  { returnObjects: true });
  const weeklyDays   = t('program.weekly_days',   { returnObjects: true });
  const tips         = t('program.tips',          { returnObjects: true });
  const progressRows = t('program.progress_rows', { returnObjects: true });

  const tabLabels = [
    t('program.roadmap_title'),
    t('program.daily_title'),
    t('program.weekly_title'),
    t('program.tips_title'),
    t('program.progress_title'),
  ];

  const [activeTab, setActiveTab] = useState(0);
  const tab = TABS[activeTab];

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 mb-10 overflow-hidden rounded-b-3xl" style={{ minHeight: 280 }}>
        <img
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=65"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.10 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-14 pb-12">
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            12 {t('program.phases_label') || 'tuần · 3 giai đoạn'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight mb-3">{t('program.title')}</h1>
          <p className="text-muted text-base leading-relaxed max-w-xl">{t('program.subtitle')}</p>
          <div className="flex flex-wrap gap-3 mt-7">
            {[{l:'12',s:'tuần'},{l:'3',s:'giai đoạn'},{l:'6',s:'trụ cột'},{l:'20+',s:'phút/ngày'}].map(s=>(
              <div key={s.l} className="flex items-baseline gap-1.5 bg-surface/80 border border-border backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-gradient font-extrabold text-lg">{s.l}</span>
                <span className="text-muted text-xs">{s.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab strip ─────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-border/60 -mx-4 md:-mx-8 px-4 md:px-8 mb-10">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex" style={{ width: 'max-content', minWidth: '100%' }}>
            {TABS.map((t_, i) => {
              const active = activeTab === i;
              return (
                <button
                  key={t_.id}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`relative flex items-center gap-2 px-4 md:px-5 py-4 text-xs font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${
                    active
                      ? `${t_.activeColor} border-current`
                      : 'text-muted border-transparent hover:text-text hover:border-border'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 transition-all duration-200 ${
                    active ? t_.num : 'bg-surface border-border text-muted/50'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-sm">{t_.icon}</span>
                  <span className="hidden sm:inline">{tabLabels[i]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────── */}
      <div key={activeTab} className="animate-fade-in-up min-h-[400px]">

        {/* ─ Tab 0: Roadmap ─────────────────────────────── */}
        {activeTab === 0 && (
          <div>
            <div className="relative">
              <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-green-500/40 via-lime-500/40 to-purple-500/40" />
              <div className="space-y-6">
                {Array.isArray(phases) && phases.map((phase, i) => {
                  const cfg = PHASE_CFG[i] || PHASE_CFG[0];
                  return (
                    <div key={i} className="flex gap-5">
                      <div className={`w-11 h-11 shrink-0 rounded-full border-2 ${cfg.dot} flex items-center justify-center font-bold text-white text-sm z-10 shadow-lg`}>
                        {i + 1}
                      </div>
                      <div className={`flex-1 border ${cfg.border} ${cfg.bg} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up`} style={{ animationDelay:`${i*120}ms` }}>
                        <div className="relative h-32 overflow-hidden">
                          <img src={cfg.img} alt={phase.name} className="w-full h-full object-cover" loading="lazy" />
                          <div className={`absolute inset-0 bg-gradient-to-r ${cfg.bar} to-transparent opacity-70`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.accent} opacity-80 block mb-0.5`}>{phase.weeks}</span>
                              <h3 className="font-bold text-lg text-white leading-tight">{phase.name}</h3>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full bg-black/30 border border-white/10 font-semibold ${cfg.accent}`}>{phase.tag}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <p className={`text-sm ${cfg.accent} font-medium mb-4 flex items-center gap-2`}><span>🎯</span>{phase.goal}</p>
                          <ul className="space-y-2.5">
                            {Array.isArray(phase.items) && phase.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-sm text-muted group/item">
                                <span className={`w-4 h-4 rounded-full border ${cfg.border} text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${cfg.accent}`}>✓</span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─ Tab 1: Daily Framework ─────────────────────── */}
        {activeTab === 1 && (
          <div>
            <div className="flex h-2.5 rounded-full overflow-hidden mb-8 bg-border/30">
              {[{f:1,c:'bg-green-500/60'},{f:3,c:'bg-accent/60'},{f:2,c:'bg-teal-500/60'},{f:1,c:'bg-purple-500/60'}].map((seg,i)=>(
                <div key={i} className={`${seg.c} hover:brightness-125 transition-all duration-300`} style={{flex:seg.f}} />
              ))}
            </div>
            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 pointer-events-none" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.isArray(dailyBlocks) && dailyBlocks.map((block, i) => (
                  <div key={i} className="relative bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.07)] transition-all duration-300 group animate-fade-in-up" style={{animationDelay:`${i*100}ms`}}>
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/30">{String(i+1).padStart(2,'0')}</span>
                    <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">{block.time}</p>
                    <h3 className="font-bold text-sm text-text mb-1.5">{block.name}</h3>
                    <p className="text-xs text-muted leading-relaxed">{block.desc}</p>
                    {i < 3 && <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border text-lg z-10">›</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─ Tab 2: Weekly Rhythm ───────────────────────── */}
        {activeTab === 2 && (
          <div className="space-y-3">
            {Array.isArray(weeklyDays) && weeklyDays.map((day, i) => {
              const cfg = DAY_CFG[day.color] || DAY_CFG.green;
              return (
                <div key={i} className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:border-border-bright transition-all duration-200 group animate-fade-in-up" style={{animationDelay:`${i*80}ms`}}>
                  <div className={`w-28 shrink-0 text-center px-3 py-2 rounded-xl border text-xs font-bold leading-tight ${cfg.bg}`}>{day.days}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text text-sm">{day.type}</h3>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{day.desc}</p>
                  </div>
                  <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              );
            })}
          </div>
        )}

        {/* ─ Tab 3: Success Tips ────────────────────────── */}
        {activeTab === 3 && (
          <div className="relative overflow-hidden rounded-3xl border border-accent/15">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal-500/4 pointer-events-none" />
            <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.isArray(tips) && tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 group animate-fade-in-up" style={{animationDelay:`${i*80}ms`}}>
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">{tip.icon}</span>
                    <div>
                      <h3 className="font-bold text-text text-sm mb-1 group-hover:text-accent transition-colors duration-200">{tip.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─ Tab 4: Progress Test ───────────────────────── */}
        {activeTab === 4 && (
          <div>
            <p className="text-muted text-xs mb-5">{t('program.progress_note')}</p>
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-purple-500/60 via-purple-500/20 to-transparent" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Chỉ số</th>
                      <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Bài test</th>
                      <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">Tuần 4</th>
                      <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">Tuần 12</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(progressRows) && progressRows.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-purple-500/3 transition-colors duration-150 last:border-0">
                        <td className="px-5 py-3 font-semibold text-text">{row.metric}</td>
                        <td className="px-5 py-3 text-muted leading-relaxed">{row.test}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block text-xs font-semibold text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block text-xs font-semibold text-purple-400 bg-purple-500/8 border border-purple-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab nav: Prev / Next ─────────────────────── */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab(i => Math.max(0, i - 1))}
            disabled={activeTab === 0}
            className="flex items-center gap-2 text-xs font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border disabled:hover:bg-transparent disabled:hover:border-transparent"
          >
            ← {activeTab > 0 ? tabLabels[activeTab - 1] : ''}
          </button>
          <div className="flex items-center gap-1.5">
            {TABS.map((_, i) => (
              <button key={i} type="button" onClick={() => setActiveTab(i)}
                className={`rounded-full transition-all duration-300 ${activeTab === i ? `w-4 h-1.5 ${tab.bar}` : 'w-1.5 h-1.5 bg-border hover:bg-muted'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setActiveTab(i => Math.min(TABS.length - 1, i + 1))}
            disabled={activeTab === TABS.length - 1}
            className="flex items-center gap-2 text-xs font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border disabled:hover:bg-transparent disabled:hover:border-transparent"
          >
            {activeTab < TABS.length - 1 ? tabLabels[activeTab + 1] : ''} →
          </button>
        </div>
      </div>

      {/* ── Sample Programs CTA ───────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-pink-500/4 mt-10 mb-6 group hover:border-pink-500/35 transition-all duration-300">
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/6 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl shrink-0">🗂️</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text mb-1">{t('nav.sample_programs') || 'Lộ trình mẫu'}</h3>
            <p className="text-xs text-muted leading-relaxed">
              6 mục tiêu × 24 tuần — Chọn lộ trình phù hợp với bạn: Người mới, Siêu bận, Giảm mỡ, Tăng cơ, Sức bền, Nâng cao.
            </p>
          </div>
          <Link
            to="/sample-programs"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-pink-500 hover:bg-pink-400 text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_20px_rgba(236,72,153,0.20)] hover:shadow-[0_0_30px_rgba(236,72,153,0.35)] hover:-translate-y-0.5"
          >
            Khám phá ngay →
          </Link>
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/20 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="relative p-8 md:p-12 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-3">{t('program.cta_title')}</h2>
          <p className="text-muted text-sm leading-relaxed max-w-md mx-auto mb-8">{t('program.cta_text')}</p>
          <Link
            to="/pillar/a"
            className="btn-shimmer inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5"
          >
            {t('program.cta_btn')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
