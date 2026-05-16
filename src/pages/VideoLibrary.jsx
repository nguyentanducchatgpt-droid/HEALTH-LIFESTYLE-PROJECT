import { useTranslation } from 'react-i18next';
import LocalVideoCard from '../components/LocalVideoCard';
import YoutubeEmbed from '../components/YoutubeEmbed';

const LOCAL_VIDEOS = ['SQUAT', 'PUSH', 'PULL', 'HINGE', 'CORE', 'BREATH'];

const YOUTUBE_VIDEOS = [
  { id: null, title: 'YouTube Tutorial 1' },
  { id: null, title: 'YouTube Tutorial 2' },
];

export default function VideoLibrary() {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
          {LOCAL_VIDEOS.length} videos
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">{t('video.title')}</h1>
        <p className="text-muted text-base leading-relaxed max-w-xl">{t('video.subtitle')}</p>
      </div>

      {/* Local exercise videos */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-text">{t('video.local_section')}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          <span className="text-xs text-muted font-medium bg-surface border border-border px-3 py-1 rounded-full">
            {LOCAL_VIDEOS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {LOCAL_VIDEOS.map((key, i) => (
            <div key={key} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <LocalVideoCard
                src={key}
                title={t(`video.${key}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* YouTube videos */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-text">{t('video.youtube_section')}</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {YOUTUBE_VIDEOS.map((video) => (
            <YoutubeEmbed key={video.title} videoId={video.id} title={video.title} />
          ))}
        </div>
        {YOUTUBE_VIDEOS.every(v => !v.id) && (
          <div className="mt-4 text-center py-12 bg-surface border border-border rounded-2xl">
            <span className="text-3xl block mb-3">📺</span>
            <p className="text-muted text-sm">{t('video.youtube_placeholder')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
