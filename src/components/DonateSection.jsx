import { useTranslation } from 'react-i18next';

export default function DonateSection() {
  const { t } = useTranslation();
  const impactItems = t('donate.impact_items', { returnObjects: true });

  return (
    <section id="donate" className="py-16">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-5 animate-float">🙏</div>
        <h2 className="text-4xl md:text-5xl font-bold text-text">{t('donate.title')}</h2>
        <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        <p className="mt-4 text-muted text-lg max-w-md mx-auto leading-relaxed">{t('donate.subtitle')}</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Impact list */}
          <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-6">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-transparent pointer-events-none" />
            <h3 className="relative text-lg font-bold text-text mb-5 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-base">✦</span>
              {t('donate.impact_title')}
            </h3>
            <ul className="relative space-y-3.5">
              {Array.isArray(impactItems) && impactItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-muted leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-[10px] font-bold shrink-0 mt-0.5">
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
            <h3 className="relative text-lg font-bold text-text flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 text-base">◈</span>
              {t('donate.bank_title')}
            </h3>

            {/* QR placeholder */}
            <div className="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-accent/30 rounded-xl p-8 transition-colors duration-300 min-h-[140px]">
              <div className="text-6xl mb-3 opacity-20">📱</div>
              <p className="text-base text-muted/50 text-center leading-relaxed">{t('donate.qr_placeholder')}</p>
            </div>

            {/* Bank info placeholder */}
            <div className="relative rounded-xl bg-surface-2 border border-border p-4">
              <p className="text-base text-muted/60 text-center leading-relaxed">{t('donate.bank_placeholder')}</p>
            </div>
          </div>
        </div>

        {/* Thanks banner */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-teal-500/6 to-accent/8 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
          <div className="relative border border-accent/20 rounded-2xl px-6 py-5 text-center">
            <p className="text-text text-lg font-semibold mb-1.5">{t('donate.thanks')}</p>
            <p className="text-muted/70 text-base leading-relaxed max-w-sm mx-auto">{t('donate.thanks_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
