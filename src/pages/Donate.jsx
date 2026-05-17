import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Donate() {
  const { t } = useTranslation();
  const impactItems  = t('donate.impact_items',  { returnObjects: true });
  const impactStats  = t('donate.impact_stats',  { returnObjects: true });
  const uses         = t('donate.uses',          { returnObjects: true });
  const faq          = t('donate.faq',           { returnObjects: true });
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative py-20 text-center overflow-hidden mb-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] animate-orb-float" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-accent/4 rounded-full blur-[80px] animate-orb-float-delay" />
        </div>
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />

        <div className="relative z-10">
          <div className="text-6xl md:text-7xl mb-6 animate-float">🙏</div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 animate-fade-in-up">
            {t('donate.title')}
          </h1>
          <div className="mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full mb-4" />
          <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed animate-fade-in-up stagger-2">
            {t('donate.subtitle')}
          </p>
        </div>
      </section>

      {/* ── Impact stats ─────────────────────────────── */}
      {Array.isArray(impactStats) && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {impactStats.map((stat, i) => (
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

      {/* ── Two-column: Impact + Bank/QR ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Impact list */}
        <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent pointer-events-none" />
          <h3 className="relative text-sm font-bold text-text mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-xs shrink-0">✦</span>
            {t('donate.impact_title')}
          </h3>
          <ul className="relative space-y-4">
            {Array.isArray(impactItems) && impactItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted leading-relaxed group/item">
                <span className="w-6 h-6 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-0.5 group-hover/item:bg-accent/20 transition-colors">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bank / QR info */}
        <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/3 to-transparent pointer-events-none" />
          <h3 className="relative text-sm font-bold text-text flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs shrink-0">◈</span>
            {t('donate.bank_title')}
          </h3>

          {/* QR placeholder */}
          <div className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-accent/30 rounded-2xl p-8 transition-colors duration-300 min-h-[160px]">
            <div className="w-20 h-20 rounded-2xl bg-white/4 border border-border flex items-center justify-center mb-3">
              <span className="text-4xl opacity-20">📱</span>
            </div>
            <p className="text-xs text-muted/50 text-center leading-relaxed">{t('donate.qr_placeholder')}</p>
          </div>

          {/* Bank info */}
          <div className="relative rounded-xl bg-bg border border-border p-4">
            <p className="text-xs text-muted/60 text-center leading-relaxed">{t('donate.bank_placeholder')}</p>
          </div>
        </div>
      </div>

      {/* ── How funds are used ───────────────────────── */}
      {Array.isArray(uses) && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6">{t('donate.uses_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {uses.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 bg-surface border border-border hover:border-accent/30 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(34,197,94,0.06)]"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/8 border border-accent/15 flex items-center justify-center text-2xl shrink-0 group-hover:bg-accent/12 group-hover:border-accent/25 transition-all duration-200">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-text mb-1.5">{item.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ ──────────────────────────────────────── */}
      {Array.isArray(faq) && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6">{t('donate.faq_title')}</h2>
          <div className="space-y-2">
            {faq.map((item, i) => (
              <div
                key={i}
                className="bg-surface border border-border hover:border-accent/25 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/2 transition-colors duration-150"
                >
                  <span className="text-sm font-semibold text-text">{item.q}</span>
                  <span
                    className={`text-muted text-[10px] transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-180 text-accent' : ''}`}
                  >
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-border mb-3" />
                    <p className="text-sm text-muted leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Thanks banner ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-teal-500/6 to-accent/8 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="relative border border-accent/20 rounded-2xl px-6 py-8 text-center">
          <div className="text-3xl mb-3 animate-float">💚</div>
          <p className="text-text text-lg font-bold mb-2">{t('donate.thanks')}</p>
          <p className="text-muted/70 text-sm leading-relaxed max-w-sm mx-auto">{t('donate.thanks_note')}</p>
        </div>
      </div>
    </div>
  );
}
