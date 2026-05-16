import { useTranslation } from 'react-i18next';

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');
  const zalo  = t('contact.zalo');

  return (
    <section id="contact" className="py-16">
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-text">{t('contact.title')}</h2>
        <div className="mt-2 mx-auto w-12 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto">
        <a
          href={`mailto:${email}`}
          className="group flex items-center gap-4 bg-surface border border-border hover:border-accent/40 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)] flex-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/8 border border-accent/20 flex items-center justify-center text-2xl shrink-0 group-hover:bg-accent/12 transition-colors">
            ✉️
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted font-medium mb-0.5">{t('contact.email_label')}</p>
            <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors truncate">
              {email}
            </p>
          </div>
        </a>

        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 bg-surface border border-border hover:border-blue-500/40 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] flex-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/8 border border-blue-500/20 flex items-center justify-center text-2xl shrink-0 group-hover:bg-blue-500/12 transition-colors">
            💬
          </div>
          <div>
            <p className="text-xs text-muted font-medium mb-0.5">{t('contact.zalo_label')}</p>
            <p className="text-sm font-semibold text-text group-hover:text-blue-400 transition-colors">
              {zalo}
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
