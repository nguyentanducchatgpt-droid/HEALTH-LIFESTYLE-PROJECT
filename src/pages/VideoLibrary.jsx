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
          className="absolute -top-11 right-0 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 text-base"
        >
          <span className="text-sm">ESC</span>
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
          <span className={`text-lg ${ACCENT_MAP[src] || 'text-accent'}`}>▶</span>
          <p className={`font-semibold text-base ${ACCENT_MAP[src] || 'text-accent'}`}>{title}</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoLibrary() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(null); // { src, title }

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const headerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const r = headerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  useEffect(() => {
    const id = 'vl-header-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes vlLabelIn {
        from { opacity:0; transform:translateY(-10px) scale(0.9); }
        to   { opacity:1; transform:translateY(0)     scale(1); }
      }
      @keyframes vlTitleIn {
        from { opacity:0; transform:translateY(30px) scale(0.94); filter:blur(8px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes vlSubIn {
        from { opacity:0; transform:translateY(14px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes vlLineGrow {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes vlShimmer {
        0%   { background-position:200% center; }
        100% { background-position:-200% center; }
      }
      @keyframes vlDotPulse {
        0%,100% { transform:scale(1);    opacity:0.65; }
        50%     { transform:scale(1.5);  opacity:1; }
      }
      @keyframes vlGlowDrift {
        0%,100% { opacity:0.4; transform:scale(1); }
        50%     { opacity:0.7; transform:scale(1.15); }
      }
      @keyframes vlHintPop {
        from { opacity:0; transform:scale(0.85) translateY(8px); }
        to   { opacity:1; transform:scale(1) translateY(0); }
      }
      .vl-label  { animation:vlLabelIn  0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
      .vl-title  { animation:vlTitleIn  0.72s cubic-bezier(0.25,0.46,0.45,0.94) both 0.1s; }
      .vl-line   { transform-origin:center; animation:vlLineGrow 1s ease both 0.32s; }
      .vl-sub    { animation:vlSubIn    0.6s ease both 0.4s; }
      .vl-hint   { animation:vlHintPop  0.5s cubic-bezier(0.34,1.56,0.64,1) both 0.62s; }
      .vl-dot    { animation:vlDotPulse 2.6s ease-in-out infinite; }
      .vl-dot:nth-child(2){ animation-delay:0.5s; }
      .vl-dot:nth-child(3){ animation-delay:1s; }
      .vl-glow-a { animation:vlGlowDrift 8s ease-in-out infinite; }
      .vl-glow-b { animation:vlGlowDrift 11s ease-in-out infinite reverse; animation-delay:-4s; }
      .vl-word {
        display:inline-block;
        transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), text-shadow 0.25s ease;
      }
      .vl-word:hover { transform:scale(1.06) translateY(-3px); }
      .vl-underline-shimmer {
        background: linear-gradient(90deg, #22c55e 0%, #5eead4 30%, #ffffff 50%, #a855f7 70%, #22c55e 100%);
        background-size: 300% auto;
        animation: vlLineGrow 1s ease both 0.32s, vlShimmer 4s linear 1.3s infinite;
      }
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
        <div ref={headerRef} onMouseMove={handleMouseMove}
          className="mb-12 relative text-center overflow-hidden rounded-3xl py-14 px-6"
          style={{ background:'rgba(255,255,255,0.015)' }}>

          {/* Mouse-tracking glow */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{
            background:`radial-gradient(ellipse 520px 320px at ${mouse.x*100}% ${mouse.y*100}%, rgba(34,197,94,0.09), transparent 70%)`,
          }} />

          {/* Static ambient blobs */}
          <div className="vl-glow-a absolute top-1/4 left-1/4  w-72 h-56 bg-accent/5    rounded-full blur-[80px] pointer-events-none" />
          <div className="vl-glow-b absolute top-0   right-1/4 w-56 h-44 bg-purple-500/4 rounded-full blur-[70px] pointer-events-none" />

          {/* Subtle top border */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.25),rgba(168,85,247,0.2),transparent)' }} />

          <div className="relative">
            {/* Pulsing dots label */}
            <div className="vl-label inline-flex items-center gap-2 mb-6">
              <span className="vl-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 7px rgba(34,197,94,0.8)' }} />
              <span className="vl-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 6px rgba(94,234,212,0.7)' }} />
              <span className="vl-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 5px rgba(168,85,247,0.6)' }} />
              <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-muted/55 mx-2">
                {t('video.exercise_guide')}
              </span>
              <span className="vl-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 5px rgba(168,85,247,0.6)' }} />
              <span className="vl-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 6px rgba(94,234,212,0.7)' }} />
              <span className="vl-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 7px rgba(34,197,94,0.8)' }} />
            </div>

            {/* Title — each word lifts on hover */}
            <h1 className="vl-title font-black leading-tight tracking-tight mb-5 flex items-baseline justify-center flex-wrap gap-[0.22em]" style={{ fontSize:'clamp(2.8rem,6vw,4.2rem)' }}>
              {t('video.title').split(' ').map((word, i, arr) =>
                i < arr.length - 1
                  ? <span key={i} className="vl-word text-text cursor-default select-none">{word}</span>
                  : <span key={i} className="vl-word cursor-default select-none" style={{
                      background:'linear-gradient(135deg,#22c55e 0%,#5eead4 50%,#a855f7 100%)',
                      WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
                    }}>{word}</span>
              )}
            </h1>

            {/* Shimmer underline */}
            <div className="vl-underline-shimmer mx-auto mb-7 h-[2.5px] w-24 rounded-full" />

            {/* Subtitle */}
            <p className="vl-sub text-muted/70 text-base md:text-lg leading-relaxed max-w-sm mx-auto mb-8">
              {t('video.subtitle')}
            </p>

            {/* Play hint pill */}
            <div className="vl-hint inline-flex items-center gap-2.5 border rounded-full px-5 py-2.5 cursor-default
              transition-all duration-200 hover:border-accent/40 hover:bg-accent/8 group/hint"
              style={{ borderColor:'rgba(34,197,94,0.2)', background:'rgba(34,197,94,0.04)' }}>
              <span className="w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center shrink-0
                transition-colors duration-200 group-hover/hint:border-accent group-hover/hint:bg-accent/15">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-accent"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span className="text-sm text-muted/65 group-hover/hint:text-muted/90 transition-colors duration-200">
                {t('video.click_to_play') || 'Nhấn vào video để xem'}
              </span>
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
            <h2 className="text-xl font-bold text-text">{t('video.youtube_section')}</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          <div className="py-14 bg-surface border border-border rounded-2xl text-center">
            <span className="text-5xl block mb-3 opacity-40">📺</span>
            <p className="text-muted text-base">{t('video.youtube_placeholder')}</p>
          </div>
        </section>
      </div>
    </>
  );
}
