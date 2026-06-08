import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function YoutubeEmbed({ videoId, title }) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: '200px' }
    );
    const el = containerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="bg-surface border border-border rounded-xl flex items-center justify-center aspect-video">
        <div className="text-center px-6">
          <div className="text-6xl mb-3">▶️</div>
          <p className="text-muted text-lg">{t('video.youtube_placeholder')}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-surface border border-border rounded-xl overflow-hidden aspect-video">
      {loaded ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${/^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : ''}?rel=0&modestbranding=1`}
          title={title || 'YouTube video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-surface">
          <div className="text-5xl animate-pulse">⏳</div>
        </div>
      )}
    </div>
  );
}
