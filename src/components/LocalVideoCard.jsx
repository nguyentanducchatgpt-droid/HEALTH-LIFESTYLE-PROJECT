export default function LocalVideoCard({ src, title, description }) {
  const base = import.meta.env.BASE_URL;
  const videoSrc = `${base}videos/${src}.mp4`;

  return (
    <div className="group bg-surface border border-border hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(34,197,94,0.08)]">
      <div className="relative overflow-hidden">
        <video
          className="w-full aspect-[9/16] object-cover bg-black transition-transform duration-500 group-hover:scale-[1.02]"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src={videoSrc}
          aria-label={title}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text text-sm group-hover:text-accent transition-colors duration-200">{title}</h3>
        {description && (
          <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
