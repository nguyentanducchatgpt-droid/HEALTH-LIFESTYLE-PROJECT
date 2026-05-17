import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PILLAR_META = [
  { key: 'pillarA', id: 'a', label: 'A', color: 'green',  textColor: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  gradFrom: 'from-green-500/12',  bar: 'bg-green-500',  hoverBorder: 'hover:border-green-500/50',  btnBg: 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30' },
  { key: 'pillarB', id: 'b', label: 'B', color: 'lime',   textColor: 'text-lime-400',   bg: 'bg-lime-500/10',   border: 'border-lime-500/30',   gradFrom: 'from-lime-500/12',   bar: 'bg-lime-500',   hoverBorder: 'hover:border-lime-500/50',   btnBg: 'bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 border-lime-500/30' },
  { key: 'pillarC', id: 'c', label: 'C', color: 'teal',   textColor: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   gradFrom: 'from-teal-500/12',   bar: 'bg-teal-500',   hoverBorder: 'hover:border-teal-500/50',   btnBg: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { key: 'pillarD', id: 'd', label: 'D', color: 'purple', textColor: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', gradFrom: 'from-purple-500/12', bar: 'bg-purple-500', hoverBorder: 'hover:border-purple-500/50', btnBg: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { key: 'pillarE', id: 'e', label: 'E', color: 'blue',   textColor: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   gradFrom: 'from-blue-500/12',   bar: 'bg-blue-500',   hoverBorder: 'hover:border-blue-500/50',   btnBg: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { key: 'pillarF', id: 'f', label: 'F', color: 'orange', textColor: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', gradFrom: 'from-orange-500/12', bar: 'bg-orange-500', hoverBorder: 'hover:border-orange-500/50', btnBg: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30' },
];

const CONNECTIONS = [
  { icon: '🏃', title: 'Vận động', desc: 'Nền tảng thể chất — tăng trao đổi chất, cải thiện tâm trạng', color: 'text-green-400' },
  { icon: '🥗', title: 'Dinh dưỡng', desc: 'Nhiên liệu cho cơ thể & não bộ — hỗ trợ mọi trụ cột khác', color: 'text-lime-400' },
  { icon: '🌿', title: 'Lối sống', desc: 'Giấc ngủ & phục hồi — tái tạo năng lượng sau vận động', color: 'text-teal-400' },
  { icon: '🧘', title: 'Tâm trí', desc: 'Quản lý stress — kỷ luật giúp duy trì các trụ cột khác', color: 'text-purple-400' },
  { icon: '📚', title: 'Kiến thức', desc: 'Hiểu biết — ra quyết định đúng về sức khỏe', color: 'text-blue-400' },
  { icon: '🛠️', title: 'Công cụ', desc: 'Hệ thống hóa — theo dõi tiến bộ & duy trì bền vững', color: 'text-orange-400' },
];

function PillarHubCard({ meta, pillar, featured = false }) {
  const sections = Array.isArray(pillar?.sections) ? pillar.sections : [];
  const previewItems = sections[0]?.items?.slice(0, 3) || [];
  const { t: tCommon } = useTranslation();

  return (
    <Link
      to={`/pillar/${meta.id}`}
      className={`group relative bg-surface border ${meta.border} ${meta.hoverBorder} rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-2xl flex flex-col`}
    >
      {/* Gradient overlay top */}
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`} />

      {/* Animated top bar */}
      <div className={`h-[3px] w-0 group-hover:w-full transition-all duration-600 ease-out ${meta.bar}`} />

      <div className={`relative flex flex-col gap-4 p-6 ${featured ? 'md:p-8' : ''} flex-1`}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className={`flex items-center justify-center w-14 h-14 rounded-2xl text-3xl ${meta.bg} border ${meta.border} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            {pillar?.icon}
          </div>
          <span className={`text-xs font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full border ${meta.bg} ${meta.border} ${meta.textColor} shrink-0`}>
            TRỤ CỘT {meta.label}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className={`font-bold text-text ${featured ? 'text-xl md:text-2xl' : 'text-lg'} leading-tight group-hover:${meta.textColor.replace('text-', 'text-')} transition-colors duration-200`}>
            {pillar?.title}
          </h3>
          <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded-md ${meta.bg} ${meta.textColor}`}>
            {pillar?.subtitle}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed">{pillar?.description}</p>

        {/* Preview items */}
        {previewItems.length > 0 && (
          <ul className="space-y-2 flex-1">
            {previewItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted/80">
                <span className={`w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold ${meta.bg} ${meta.textColor}`}>
                  {i + 1}
                </span>
                <span className="leading-relaxed line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className={`mt-auto flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200 w-fit ${meta.btnBg}`}>
          {tCommon('common.learn_more')}
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </div>
      </div>
    </Link>
  );
}

export default function Pillars() {
  const { t }           = useTranslation();
  const { t: tPillars } = useTranslation('pillars');
  const [hovered, setHovered] = useState(null);

  const pillars = PILLAR_META.map(meta => ({
    meta,
    data: tPillars(meta.key, { returnObjects: true }),
  }));

  return (
    <div className="max-w-6xl mx-auto">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative text-center py-16 md:py-20 mb-6 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-green-500/6 rounded-full blur-[120px] animate-orb-float" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] animate-orb-float-delay" />
          <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 grid-dots pointer-events-none opacity-30" />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('hero.badge')}
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-4 animate-fade-in-up">
            <span className="text-gradient">{t('hero.pillars_title')}</span>
          </h1>

          <p className="text-base md:text-lg text-muted/80 max-w-lg mx-auto leading-relaxed animate-fade-in-up stagger-2">
            {t('hero.subtitle')}
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-in-up stagger-3">
            {[
              { icon: '🏃', label: '6 trụ cột', sub: 'Toàn diện & có hệ thống' },
              { icon: '📅', label: '12 tuần',   sub: 'Lộ trình từ mới → nâng cao' },
              { icon: '⏱️', label: '10 phút',   sub: 'Đủ để bắt đầu mỗi ngày' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-5 py-3 hover:border-accent/30 transition-all duration-300">
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <p className="text-text font-bold text-sm">{s.label}</p>
                  <p className="text-muted text-xs">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Grid ────────────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Khám Phá 6 Trụ Cột</h2>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          <p className="text-muted text-sm mt-3 max-w-md mx-auto">Chọn trụ cột bạn muốn tìm hiểu sâu hơn — mỗi trụ cột có hướng dẫn chi tiết, bài tập, và công cụ thực hành</p>
        </div>

        {/* Bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {/* Row 1: A (featured, 2-col) + B */}
          <div className="md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <PillarHubCard meta={pillars[0].meta} pillar={pillars[0].data} featured />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <PillarHubCard meta={pillars[1].meta} pillar={pillars[1].data} />
          </div>

          {/* Row 2: C + D + E */}
          {pillars.slice(2, 5).map(({ meta, data }, i) => (
            <div key={meta.key} className="animate-fade-in-up" style={{ animationDelay: `${(i + 2) * 80}ms` }}>
              <PillarHubCard meta={meta} pillar={data} />
            </div>
          ))}

          {/* Row 3: F (featured, full width) */}
          <div className="md:col-span-3 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="group relative bg-surface border border-orange-500/30 hover:border-orange-500/50 rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/8 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
              <div className="h-[3px] w-0 group-hover:w-full transition-all duration-600 bg-gradient-to-r from-orange-500 to-amber-400" />
              <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
                {/* Left */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-2xl text-4xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {pillars[5].data?.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                      TRỤ CỘT F
                    </span>
                    <h3 className="text-xl font-bold text-text mt-2">{pillars[5].data?.title}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">{pillars[5].data?.subtitle}</span>
                  </div>
                </div>

                {/* Center: description + items */}
                <div className="flex-1">
                  <p className="text-sm text-muted leading-relaxed mb-4">{pillars[5].data?.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(pillars[5].data?.sections?.[0]?.items || []).slice(0, 6).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted/80">
                        <span className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold bg-orange-500/10 text-orange-400">{i + 1}</span>
                        <span className="leading-relaxed line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CTA */}
                <Link
                  to="/pillar/f"
                  className="shrink-0 flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30 transition-all duration-200"
                >
                  Xem chi tiết
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How They Connect ──────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Hệ Sinh Thái Sống Khỏe</h2>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          <p className="text-muted text-sm mt-3 max-w-md mx-auto">
            6 trụ cột không hoạt động độc lập — chúng hỗ trợ và khuếch đại lẫn nhau để tạo thành một hệ thống sống khỏe bền vững
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CONNECTIONS.map((c, i) => (
            <div
              key={i}
              className="relative bg-surface border border-border rounded-2xl p-5 hover:border-accent/20 transition-all duration-300 group animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <span className="text-2xl mb-3 block">{c.icon}</span>
                <h4 className={`font-bold text-sm mb-1.5 ${c.color}`}>{c.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{c.desc}</p>
                {/* Connector dot */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-40 ${c.color.replace('text-', 'bg-')}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="mt-6 bg-surface border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {PILLAR_META.map((m, i) => (
              <div key={m.key} className="flex items-center gap-3 md:gap-2 md:flex-col">
                <Link
                  to={`/pillar/${m.id}`}
                  className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center ${m.bg} border ${m.border} hover:scale-110 transition-transform duration-200`}
                >
                  {pillars[i].data?.icon}
                </Link>
                <span className={`text-xs font-bold ${m.textColor} md:text-center`}>{m.label}</span>
                {i < 5 && (
                  <span className="text-border text-lg hidden md:block">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-5 italic">
            Bắt đầu từ bất kỳ trụ cột nào — mỗi bước nhỏ đều kéo theo sự cải thiện ở các trụ cột khác
          </p>
        </div>
      </section>

      {/* ── Quick Stats ───────────────────────────────── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { val: '6',      label: 'Trụ cột toàn diện', icon: '🏛️' },
            { val: '40+',    label: 'Bài tập thực hành',  icon: '💪' },
            { val: '12 tuần', label: 'Lộ trình có cấu trúc', icon: '📅' },
            { val: '3 ngôn ngữ', label: 'VI · EN · DE',  icon: '🌍' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="text-2xl mb-2 group-hover:animate-float">{s.icon}</div>
              <p className="text-gradient font-extrabold text-xl md:text-2xl">{s.val}</p>
              <p className="text-muted text-xs mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────── */}
      <section className="mb-8">
        <div className="relative rounded-3xl overflow-hidden border border-accent/15">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5" />
          <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
          <div className="relative p-8 md:p-12 text-center">
            <p className="text-3xl md:text-4xl font-bold text-text mb-3">
              Bắt Đầu Hành Trình
            </p>
            <p className="text-muted text-sm md:text-base mb-8 max-w-md mx-auto">
              Chọn 1 trụ cột để bắt đầu hôm nay. Không cần hoàn hảo — chỉ cần nhất quán.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/pillar/a"
                className="btn-shimmer inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)]"
              >
                🏃 Bắt Đầu Với Vận Động
              </Link>
              <Link
                to="/program"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-accent/40 hover:border-accent text-accent hover:bg-accent/8 font-semibold rounded-xl transition-all duration-200 text-sm"
              >
                📅 Xem Lộ Trình 12 Tuần →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
