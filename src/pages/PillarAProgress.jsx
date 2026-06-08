import { Link } from 'react-router-dom';
import ProgressionStaircase from '../components/ProgressionStaircase';
import MonthlyProgressCheck from '../components/MonthlyProgressCheck';

export default function PillarAProgress() {
  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=60"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.13 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-purple-600/4 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">Vận Động & Tập Luyện</Link>
            <span className="text-border/60">/</span>
            <span className="text-purple-400 font-medium">Bậc Thang & Kiểm Tra</span>
          </nav>

          {/* Step badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/8 border border-purple-500/20 text-purple-400 text-sm font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            4 / 4 · Bậc Thang & Kiểm Tra
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-3">
            Bậc Thang Tiến Bộ &amp;<br />
            <span className="text-purple-400">Kiểm Tra Hàng Tháng</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl">
            6 lộ trình tiến bộ theo mục tiêu cá nhân, test kiểm tra định kỳ và radar chart trực quan
            để theo dõi sự phát triển toàn diện theo thời gian.
          </p>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '6', label: 'Lộ trình mục tiêu' },
              { n: '5', label: 'Bậc tiến bộ mỗi lộ trình' },
              { n: '3', label: 'Kỳ kiểm tra (T4/T8/T12)' },
              { n: '4', label: 'Bài test mỗi kỳ' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-purple-400 font-extrabold text-base leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────────── */}
      <ProgressionStaircase />
      <MonthlyProgressCheck />

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-8 mb-4">
        <Link
          to="/pillar/a/weekly"
          className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Nhịp Tuần & Mục Tiêu</span>
        </Link>
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-sm bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-purple-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <div className="w-32 shrink-0" />
      </div>
    </div>
  );
}
