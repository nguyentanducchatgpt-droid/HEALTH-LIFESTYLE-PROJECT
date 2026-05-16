export default function LocalVideoCard({ src, title, description }) {
  const base = import.meta.env.BASE_URL;
  const videoSrc = `${base}videos/${src}.mp4`;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
      <video
        className="w-full aspect-video object-cover bg-black"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        src={videoSrc}
        aria-label={title}
      />
      <div className="p-4">
        <h3 className="font-semibold text-text text-sm">{title}</h3>
        {description && (
          <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
