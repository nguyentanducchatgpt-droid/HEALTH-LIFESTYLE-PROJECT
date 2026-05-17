import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import LocalVideoCard from '../components/LocalVideoCard';

const LOCAL_VIDEOS = ['SQUAT', 'PUSH', 'PULL', 'HINGE', 'CORE', 'BREATH'];

const ACCENT_MAP = {
  SQUAT: 'text-green-400',
  PUSH:  'text-lime-400',
  PULL:  'text-teal-400',
  HINGE: 'text-blue-400',
  CORE:  'text-orange-400',
  BREATH:'text-purple-400',
};

function VideoModal({ src, title, onClose }) {
  const videoRef = useRef(null);
  const base     = import.meta.env.BASE_URL;
  const videoSrc = `${base}videos/${src}.mp4`;

  useEffect(() => {
    const el = videoRef.current;
    if (el) { el.load(); el.play().catch(() => {}); }

    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-sm animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-sm"
        >
          <span className="text-xs">ESC</span>
          <span className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors duration-200">
            ✕
          </span>
        </button>

        {/* Video */}
        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
          <video
            ref={videoRef}
            className="w-full aspect-[9/16] object-cover"
            controls
            playsInline
            src={videoSrc}
          />
        </div>

        {/* Title bar */}
        <div className="mt-3 flex items-center gap-2 px-1">
          <span className={`text-base ${ACCENT_MAP[src] || 'text-accent'}`}>▶</span>
          <p className={`font-semibold text-sm ${ACCENT_MAP[src] || 'text-accent'}`}>{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoLibrary() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(null); // { src, title }

  const openVideo  = useCallback((src, title) => setPlaying({ src, title }), []);
  const closeVideo = useCallback(() => setPlaying(null), []);

  return (
    <>
      {playing && (
        <VideoModal src={playing.src} title={playing.title} onClose={closeVideo} />
      )}

      <div className="max-w-5xl mx-auto">
        {/* ── Header ────────────────────────────────── */}
        <div className="mb-14 relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
              {LOCAL_VIDEOS.length} {t('video.local_section')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">{t('video.title')}</h1>
            <p className="text-muted text-base leading-relaxed max-w-lg">{t('video.subtitle')}</p>
          </div>
        </div>

        {/* ── Click-to-play hint ────────────────────── */}
        <div className="flex items-center gap-2 mb-8 text-muted text-xs">
          <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M8 5v14l11-7z"/></svg>
          </span>
          <span>{t('video.click_to_play') || 'Nhấn vào video để xem'}</span>
        </div>

        {/* ── Video grid ───────────────────────────── */}
        <section className="mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {LOCAL_VIDEOS.map((key, i) => (
              <div key={key} className="animate-fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
                <LocalVideoCard
                  src={key}
                  title={t(`video.${key}`)}
                  index={i}
                  onPlay={openVideo}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── YouTube placeholder ───────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-text">{t('video.youtube_section')}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="py-14 bg-surface border border-border rounded-2xl text-center">
            <span className="text-4xl block mb-3 opacity-40">📺</span>
            <p className="text-muted text-sm">{t('video.youtube_placeholder')}</p>
          </div>
        </section>
      </div>
    </>
  );
}
