import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const email  = t('contact.email');
  const zalo   = t('contact.zalo');
  const topics = t('contact.topics', { returnObjects: true });
  const faq    = t('contact.faq',    { returnObjects: true });
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative py-20 text-center overflow-hidden mb-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-orb-float" />
          <div className="absolute top-1/4 right-1/3 w-[250px] h-[250px] bg-teal-500/4 rounded-full blur-[80px] animate-orb-float-delay" />
        </div>
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />

        <div className="relative z-10">
          {/* Avatar */}
          <div className="mx-auto mb-7 relative w-24 h-24">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/25 to-teal-500/20 border border-accent/40 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.15)]">
              <span className="text-accent font-bold text-3xl tracking-tight">ND</span>
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent border-4 border-bg animate-glow-pulse" />
          </div>

          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('contact.bio_role')}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 animate-fade-in-up">
            {t('contact.title')}
          </h1>
          <div className="mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full mb-4" />
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed animate-fade-in-up stagger-2">
            {t('contact.intro')}
          </p>
        </div>
      </section>

      {/* ── Author story ────────────────────────────── */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-6 md:p-8 mb-6 group hover:border-accent/25 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-teal-500/3 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-teal-500/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-xl shrink-0">
            ND
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-text mb-1">{t('contact.bio_name')}</h2>
            <p className="text-accent text-xs font-semibold mb-3">{t('contact.bio_role')}</p>
            <h3 className="text-sm font-bold text-text mb-2">{t('contact.story_title')}</h3>
            <p className="text-muted text-sm leading-relaxed mb-4">{t('contact.story_text')}</p>
            <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-accent text-xs font-medium">{t('contact.mission')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact method cards ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <a
          href={`mailto:${email}`}
          className="group relative overflow-hidden flex flex-col gap-3 bg-surface border border-border hover:border-accent/50 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(34,197,94,0.14)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/0 to-transparent group-hover:via-accent/50 transition-all duration-500" />
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl group-hover:bg-accent/15 group-hover:border-accent/40 transition-all duration-200 shrink-0">
              ✉️
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-bg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">{t('contact.email_label')}</p>
              <p className="text-sm font-bold text-text group-hover:text-accent transition-colors truncate">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse shrink-0" />
            <span className="text-xs text-muted">{t('contact.email_response')}</span>
          </div>
        </a>

        <a
          href={`https://zalo.me/${zalo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex flex-col gap-3 bg-surface border border-border hover:border-blue-500/50 rounded-2xl px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(59,130,246,0.14)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-500/50 transition-all duration-500" />
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:bg-blue-500/15 group-hover:border-blue-500/40 transition-all duration-200 shrink-0">
              💬
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 border-2 border-bg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-0.5">{t('contact.zalo_label')}</p>
              <p className="text-sm font-bold text-text group-hover:text-blue-400 transition-colors">{zalo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-border/50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-glow-pulse shrink-0" />
            <span className="text-xs text-muted">{t('contact.zalo_avail')}</span>
          </div>
        </a>
      </div>

      {/* ── Topics ───────────────────────────────────── */}
      {Array.isArray(topics) && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider mb-4">{t('contact.topics_title')}</h2>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-surface border border-border hover:border-accent/35 hover:bg-accent/4 rounded-full px-4 py-1.5 text-xs text-muted hover:text-text transition-all duration-200 cursor-default"
              >
                <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ ──────────────────────────────────────── */}
      {Array.isArray(faq) && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6">{t('contact.faq_title')}</h2>
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

      {/* ── Closing CTA ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/8 via-transparent to-teal-500/6 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="relative border border-accent/20 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">💌</p>
          <p className="text-text text-sm font-semibold mb-2">{t('contact.bio_name')}</p>
          <p className="text-muted/80 text-sm leading-relaxed italic max-w-sm mx-auto">{t('contact.cta')}</p>
        </div>
      </div>
    </div>
  );
}
