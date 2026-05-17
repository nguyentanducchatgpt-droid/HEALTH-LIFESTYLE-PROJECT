import { useTranslation } from 'react-i18next';

export default function ContactSection() {
  const { t } = useTranslation();
  const email = t('contact.email');
  const zalo  = t('contact.zalo');

  return (
    <section id="contact" className="py-16">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-16" />

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text">{t('contact.title')}</h2>
        <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        <p className="mt-4 text-muted text-sm max-w-md mx-auto leading-relaxed">{t('contact.intro')}</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Author card */}
        <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          {/* Avatar initials */}
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-teal-500/20 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="text-accent font-bold text-base tracking-tight">ND</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-bg" />
          </div>
          <div className="relative min-w-0">
            <p className="font-bold text-text text-sm">{t('contact.bio_name')}</p>
            <p className="text-accent text-xs font-semibold mt-0.5">{t('contact.bio_role')}</p>
            <p className="text-muted text-xs mt-1.5 leading-relaxed">{t('contact.bio_desc')}</p>
          </div>
        </div>

        {/* Contact cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="group relative overflow-hidden flex flex-col gap-3 bg-surface border border-border hover:border-accent/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(34,197,94,0.12)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/40 transition-all duration-300" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-lg shrink-0 group-hover:bg-accent/15 group-hover:border-accent/40 transition-all duration-200">
                ✉️
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted font-medium">{t('contact.email_label')}</p>
                <p className="text-xs font-semibold text-text group-hover:text-accent transition-colors truncate mt-0.5">
                  {email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse shrink-0" />
              <span className="text-xs text-muted">{t('contact.email_response')}</span>
            </div>
          </a>

          {/* Zalo */}
          <a
            href={`https://zalo.me/${zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden flex flex-col gap-3 bg-surface border border-border hover:border-blue-500/50 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/40 transition-all duration-300" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shrink-0 group-hover:bg-blue-500/15 group-hover:border-blue-500/40 transition-all duration-200">
                💬
              </div>
              <div>
                <p className="text-xs text-muted font-medium">{t('contact.zalo_label')}</p>
                <p className="text-sm font-semibold text-text group-hover:text-blue-400 transition-colors mt-0.5">
                  {zalo}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-glow-pulse shrink-0" />
              <span className="text-xs text-muted">{t('contact.zalo_avail')}</span>
            </div>
          </a>
        </div>

        {/* CTA closing */}
        <p className="text-center text-muted/70 text-xs leading-relaxed pt-2 italic px-4">
          {t('contact.cta')}
        </p>
      </div>
    </section>
  );
}
