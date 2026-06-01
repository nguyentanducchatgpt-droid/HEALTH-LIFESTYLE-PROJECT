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

  useEffect(() => {
    const id = 'vl-header-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes vlLabelIn {
        from { opacity:0; transform:translateX(-14px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes vlTitleIn {
        from { opacity:0; transform:translateY(26px) scale(0.95); filter:blur(6px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes vlSubIn {
        from { opacity:0; transform:translateX(-10px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes vlLineGrow {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes vlDotPulse {
        0%,100% { transform:scale(1);    opacity:0.7; }
        50%     { transform:scale(1.35); opacity:1; }
      }
      @keyframes vlGlowDrift {
        0%,100% { transform:translateX(0)    translateY(0);    opacity:0.35; }
        40%     { transform:translateX(28px) translateY(-18px); opacity:0.6; }
        70%     { transform:translateX(-18px) translateY(12px); opacity:0.42; }
      }
      .vl-label  { animation:vlLabelIn  0.5s ease both; }
      .vl-title  { animation:vlTitleIn  0.7s cubic-bezier(0.25,0.46,0.45,0.94) both 0.1s; }
      .vl-line   { transform-origin:left; animation:vlLineGrow 0.9s ease both 0.3s; }
      .vl-sub    { animation:vlSubIn    0.6s ease both 0.38s; }
      .vl-dot    { animation:vlDotPulse 2.8s ease-in-out infinite; }
      .vl-dot:nth-child(2){ animation-delay:0.4s; }
      .vl-dot:nth-child(3){ animation-delay:0.8s; }
      .vl-glow   { animation:vlGlowDrift 9s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }, []);

  const openVideo  = useCallback((src, title) => setPlaying({ src, title }), []);
  const closeVideo = useCallback(() => setPlaying(null), []);

  return (
    <>
      {playing && (
        <VideoModal src={playing.src} title={playing.title} onClose={closeVideo} />
      )}

      <div className="max-w-5xl mx-auto">
        {/* ── Header ────────────────────────────────── */}
        <div className="mb-12 relative">
          {/* Drifting glow blobs */}
          <div className="vl-glow absolute -top-8 -left-12 w-80 h-80 bg-accent/6 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute top-0 left-1/2 w-64 h-48 bg-teal-500/4 rounded-full blur-[70px] pointer-events-none" />

          <div className="relative">
            {/* Label row */}
            <div className="vl-label flex items-center gap-2.5 mb-6">
              {/* Pulsing dots */}
              <span className="vl-dot w-2 h-2 rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 6px rgba(34,197,94,0.7)' }} />
              <span className="vl-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 5px rgba(94,234,212,0.6)' }} />
              <span className="vl-dot w-1 h-1 rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 4px rgba(168,85,247,0.5)' }} />
              <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-muted/60 ml-1">
                Hướng Dẫn Bài Tập
              </span>
            </div>

            {/* Title */}
            <h1 className="vl-title font-black leading-tight tracking-tight mb-5" style={{ fontSize:'clamp(2.6rem,5.5vw,4rem)' }}>
              <span className="text-text">Thư Viện </span>
              <span style={{
                background:'linear-gradient(135deg,#22c55e 0%,#5eead4 50%,#a855f7 100%)',
                WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>Video</span>
            </h1>

            {/* Animated underline */}
            <div className="vl-line mb-6 h-[2.5px] w-20 rounded-full"
              style={{ background:'linear-gradient(90deg,#22c55e,#5eead4,#a855f7)' }} />

            {/* Subtitle */}
            <p className="vl-sub text-muted/75 text-sm md:text-base leading-relaxed max-w-md mb-7">
              {t('video.subtitle')}
            </p>

            {/* Play hint — styled pill */}
            <div className="vl-sub inline-flex items-center gap-2.5 border rounded-full px-4 py-2 cursor-default"
              style={{ borderColor:'rgba(34,197,94,0.18)', background:'rgba(34,197,94,0.05)' }}>
              <span className="w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-accent"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span className="text-xs text-muted/70">{t('video.click_to_play') || 'Nhấn vào video để xem'}</span>
            </div>
          </div>
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
