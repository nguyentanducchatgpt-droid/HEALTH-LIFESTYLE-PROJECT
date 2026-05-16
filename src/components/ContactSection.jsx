import { useTranslation } from 'react-i18next';

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');
  const zalo = t('contact.zalo');

  return (
    <section id="contact" className="py-16 border-t border-border">
      <h2 className="text-2xl font-bold text-center mb-10">{t('contact.title')}</h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 bg-surface border border-border hover:border-accent rounded-xl px-6 py-4 transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
        >
          <span className="text-3xl">✉️</span>
          <div>
            <p className="text-xs text-muted">{t('contact.email_label')}</p>
            <p className="text-sm font-medium text-text group-hover:text-accent transition-colors break-all">
              {email}
            </p>
          </div>
        </a>

        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-surface border border-border hover:border-accent rounded-xl px-6 py-4 transition-all hover:-translate-y-0.5 group w-full sm:w-auto"
        >
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-xs text-muted">{t('contact.zalo_label')}</p>
            <p className="text-sm font-medium text-text group-hover:text-accent transition-colors">
              {zalo}
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
