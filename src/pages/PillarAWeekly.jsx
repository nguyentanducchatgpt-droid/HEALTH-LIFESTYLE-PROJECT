import { Link } from 'react-router-dom';
import WeeklyRhythm from '../components/WeeklyRhythm';
import WorkoutPlans from '../components/WorkoutPlans';

export default function PillarAWeekly() {
  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=60"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.13 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-600/4 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">Vận Động & Tập Luyện</Link>
            <span className="text-border/60">/</span>
            <span className="text-teal-400 font-medium">Nhịp Tuần & Mục Tiêu</span>
          </nav>

          {/* Step badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/8 border border-teal-500/20 text-teal-400 text-sm font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shrink-0" />
            3 / 4 · Nhịp Tuần & Mục Tiêu
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text leading-tight mb-3">
            Nhịp Tuần Gợi Ý &amp;<br />
            <span className="text-teal-400">Buổi Tập Theo Mục Tiêu</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-xl">
            3 giai đoạn nhịp tuần linh hoạt kết hợp 6 lộ trình tập luyện được cá nhân hóa từ
            người mới bắt đầu đến vận động viên nâng cao.
          </p>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '3', label: 'Giai đoạn nhịp tuần' },
              { n: '7', label: 'Ngày / tuần có lịch' },
              { n: '6', label: 'Lộ trình mục tiêu' },
              { n: '24', label: 'Tuần chương trình mẫu' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-teal-400 font-extrabold text-base leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────────── */}
      <WeeklyRhythm />
      <WorkoutPlans />

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-8 mb-4">
        <Link
          to="/pillar/a/framework"
          className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Khung Ngày & Thời Gian</span>
        </Link>
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-sm bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-teal-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <Link
          to="/pillar/a/progress"
          className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group"
        >
          <span>Bậc Thang & Kiểm Tra</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
