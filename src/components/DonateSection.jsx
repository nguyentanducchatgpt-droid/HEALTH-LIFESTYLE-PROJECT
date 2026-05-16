import { useTranslation } from 'react-i18next';

export default function DonateSection() {
  const { t } = useTranslation();

  return (
    <section id="donate" className="py-16 border-t border-border">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">{t('donate.title')}</h2>
        <p className="text-muted text-sm mb-8 leading-relaxed">{t('donate.subtitle')}</p>

        <div className="bg-surface border border-border rounded-2xl p-10">
          <div className="text-6xl mb-5">🙏</div>
          <p className="text-muted text-sm leading-relaxed">{t('donate.placeholder')}</p>
          <p className="text-accent text-sm mt-4 font-semibold">{t('donate.thanks')}</p>
        </div>
      </div>
    </section>
  );
}
