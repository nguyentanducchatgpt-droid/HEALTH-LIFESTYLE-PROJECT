import { useTranslation } from 'react-i18next';
import LocalVideoCard from '../components/LocalVideoCard';
import YoutubeEmbed from '../components/YoutubeEmbed';

const LOCAL_VIDEOS = [
  'SQUAT',
  'PUSH',
  'PULL',
  'HINGE',
  'CORE',
  'BREATH',
];

// Add YouTube video IDs here when available. null = show placeholder.
const YOUTUBE_VIDEOS = [
  { id: null, title: 'YouTube Tutorial 1' },
  { id: null, title: 'YouTube Tutorial 2' },
];

export default function VideoLibrary() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-text">{t('video.title')}</h1>
      <p className="text-muted text-sm mb-12">
        {t('video.subtitle')}
      </p>

      {/* Local exercise videos */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-accent mb-6">
          {t('video.local_section')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCAL_VIDEOS.map((key) => (
            <LocalVideoCard
              key={key}
              src={key}
              title={t(`video.${key}`)}
            />
          ))}
        </div>
      </section>

      {/* YouTube videos */}
      <section>
        <h2 className="text-xl font-semibold text-accent mb-6">
          {t('video.youtube_section')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {YOUTUBE_VIDEOS.map((video) => (
            <YoutubeEmbed key={video.title} videoId={video.id} title={video.title} />
          ))}
        </div>
      </section>
    </div>
  );
}
