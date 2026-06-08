import { useRef, useEffect } from 'react';

const COLOR_MAP = {
  SQUAT: { ring: 'ring-green-500/50',  glow: 'shadow-green-500/20',  badge: 'bg-green-500/15 border-green-500/30 text-green-400',  dot: 'bg-green-500'  },
  PUSH:  { ring: 'ring-lime-500/50',   glow: 'shadow-lime-500/20',   badge: 'bg-lime-500/15 border-lime-500/30 text-lime-400',    dot: 'bg-lime-500'   },
  PULL:  { ring: 'ring-teal-500/50',   glow: 'shadow-teal-500/20',   badge: 'bg-teal-500/15 border-teal-500/30 text-teal-400',   dot: 'bg-teal-500'   },
  HINGE: { ring: 'ring-blue-500/50',   glow: 'shadow-blue-500/20',   badge: 'bg-blue-500/15 border-blue-500/30 text-blue-400',   dot: 'bg-blue-500'   },
  CORE:  { ring: 'ring-orange-500/50', glow: 'shadow-orange-500/20', badge: 'bg-orange-500/15 border-orange-500/30 text-orange-400', dot: 'bg-orange-500' },
  BREATH:{ ring: 'ring-purple-500/50', glow: 'shadow-purple-500/20', badge: 'bg-purple-500/15 border-purple-500/30 text-purple-400', dot: 'bg-purple-500' },
};

export default function LocalVideoCard({ src, title, index = 0, onPlay }) {
  const videoRef = useRef(null);
  const base     = import.meta.env.BASE_URL;
  const videoSrc = `${base}videos/${src}.mp4#t=0.5`;
  const c        = COLOR_MAP[src] || COLOR_MAP.SQUAT;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
  }, []);

  return (
    <button
      type="button"
      onClick={() => onPlay?.(src, title)}
      className={`group relative w-full rounded-2xl overflow-hidden bg-surface border border-border hover:ring-2 ${c.ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow} focus:outline-none`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          muted
          playsInline
          preload="metadata"
          src={videoSrc}
          aria-hidden="true"
        />

        {/* Dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
            <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Index badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Color dot bottom-right */}
        <div className={`absolute bottom-3 right-3 w-2 h-2 rounded-full ${c.dot} opacity-80`} />
      </div>

      {/* Title */}
      <div className="p-3.5">
        <p className="text-lg font-semibold text-text group-hover:text-accent transition-colors duration-200 leading-snug text-left">
          {title}
        </p>
      </div>
    </button>
  );
}
