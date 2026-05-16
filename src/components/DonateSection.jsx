import { useTranslation } from 'react-i18next';

export default function DonateSection() {
  const { t } = useTranslation();

  return (
    <section id="donate" className="py-16">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-3">{t('donate.title')}</h2>
        <div className="mt-2 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full mb-6" />
        <p className="text-muted text-sm mb-10 leading-relaxed max-w-sm mx-auto">{t('donate.subtitle')}</p>

        <div className="relative overflow-hidden bg-surface border border-border rounded-3xl p-10 md:p-14">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-teal-500/3 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />

          <div className="relative">
            <div className="text-6xl mb-6 animate-float">🙏</div>
            <p className="text-muted text-sm leading-relaxed mb-4">{t('donate.placeholder')}</p>
            <p className="text-accent text-sm font-semibold">{t('donate.thanks')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
