import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SECTION_ACCENT = [
  'text-lime-400 bg-lime-500/10 border-lime-500/30',
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
];

const MACROS = [
  {
    emoji: '🥩',
    title: 'Protein',
    dose: '1.6–2g / kg cân nặng',
    desc: 'Xây cơ & phục hồi',
    color: 'text-lime-400 bg-lime-500/10 border-lime-500/30',
  },
  {
    emoji: '🌾',
    title: 'Tinh bột',
    dose: '~45–65% tổng calo',
    desc: 'Năng lượng chính',
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  },
  {
    emoji: '🫒',
    title: 'Chất béo',
    dose: '0.8–1g / kg',
    desc: 'Hormone & hấp thu',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  },
];

const PLATE_BARS = [
  { label: 'Rau củ', pct: 50, bg: 'bg-green-500', text: 'text-green-400' },
  { label: 'Đạm', pct: 25, bg: 'bg-lime-500', text: 'text-lime-400' },
  { label: 'Tinh bột', pct: 25, bg: 'bg-orange-500', text: 'text-orange-400' },
];

export default function PillarB() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarB', { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-muted text-sm">
          <span className="animate-spin">⟳</span>
          {tCommon('loading')}
        </div>
      </div>
    );
  }

  const sections = tPillars('pillarB.sections', { returnObjects: true });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-lime-400 text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('back')}
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-lime-500/20 shrink-0 animate-float">
            🥗
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
              {tPillars('pillarB.title')}
            </h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-lime-400 mt-3 mb-4 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full">
              {tPillars('pillarB.subtitle')}
            </span>
            <p className="text-muted text-base leading-relaxed max-w-2xl">
              {tPillars('pillarB.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Contextual image */}
      <div className="relative rounded-3xl overflow-hidden mb-12 h-52 md:h-64">
        <img
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=70"
          alt="nutrition"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className="text-lime-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-lime-500/20">
            Dinh Dưỡng Khoa Học
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Macro Nutrient Cards */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs flex items-center justify-center font-bold">★</span>
          Đa Lượng Dinh Dưỡng
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MACROS.map((m) => (
            <div
              key={m.title}
              className={`bg-surface border rounded-2xl p-5 text-center transition-all duration-300 hover:border-border-bright ${m.color}`}
            >
              <div className="text-4xl mb-3">{m.emoji}</div>
              <div className="font-bold text-text text-base mb-1">{m.title}</div>
              <div className="text-sm font-semibold mb-2">{m.dose}</div>
              <div className="text-xs text-muted">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Plate Method */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-10 transition-all duration-300 hover:border-border-bright">
        <h2 className="text-base font-bold text-text mb-5">🍽️ Đĩa Ăn Chuẩn</h2>
        <div className="space-y-3">
          {PLATE_BARS.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <div className={`w-24 text-xs font-semibold shrink-0 ${bar.text}`}>{bar.label}</div>
              <div className="flex-1 bg-border rounded-full h-5 overflow-hidden">
                <div
                  className={`${bar.bg} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                  style={{ width: `${bar.pct}%` }}
                >
                  <span className="text-white text-[10px] font-bold">{bar.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          Chia đĩa ăn theo tỷ lệ: ½ rau củ · ¼ đạm · ¼ tinh bột — không cần cân đo chính xác.
        </p>
      </div>

      {/* Pre/Post Workout Callout */}
      <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-2xl p-5 mb-10">
        <h2 className="text-base font-bold text-yellow-400 mb-4">⚡ Dinh Dưỡng Quanh Buổi Tập</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface/60 border border-border rounded-xl p-4">
            <div className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">Trước tập (1–2h)</div>
            <ul className="space-y-1.5 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">·</span>Bữa nhẹ carb + protein</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">·</span>Chuối + sữa, bánh + trứng</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">·</span>Không tập bụng rỗng (cường độ cao)</li>
              <li className="flex items-start gap-2"><span className="text-yellow-400 mt-0.5">·</span>Uống 300–500ml nước</li>
            </ul>
          </div>
          <div className="bg-surface/60 border border-border rounded-xl p-4">
            <div className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-2">Sau tập (30–60 phút)</div>
            <ul className="space-y-1.5 text-sm text-muted">
              <li className="flex items-start gap-2"><span className="text-lime-400 mt-0.5">·</span>Bổ sung protein phục hồi cơ</li>
              <li className="flex items-start gap-2"><span className="text-lime-400 mt-0.5">·</span>Thêm carb nếu tập nặng</li>
              <li className="flex items-start gap-2"><span className="text-lime-400 mt-0.5">·</span>Bù nước + điện giải</li>
              <li className="flex items-start gap-2"><span className="text-lime-400 mt-0.5">·</span>Tránh ăn quá no ngay sau tập</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Standard Sections from i18n */}
      {Array.isArray(sections) && sections.length > 0 && (
        <div className="space-y-5 mb-16">
          {sections.map((section, i) => {
            const accentClass = SECTION_ACCENT[i % SECTION_ACCENT.length];
            return (
              <div
                key={i}
                className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-border-bright group animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-[2px] bg-gradient-to-r from-lime-500/50 via-lime-500/20 to-transparent" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${accentClass}`}>
                      {i + 1}
                    </span>
                    <h2 className="font-bold text-text text-base">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {Array.isArray(section.items) && section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted group/item hover:text-text transition-colors duration-150"
                      >
                        <span className="w-5 h-5 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-lime-500 group-hover/item:text-bg transition-all duration-200">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom note */}
      <div className="border border-lime-500/20 bg-lime-500/5 rounded-2xl p-5 text-sm text-muted text-center">
        <span className="text-lime-400 font-semibold">Lưu ý:</span> Thông tin dinh dưỡng mang tính tham khảo. Hãy điều chỉnh theo cơ địa và tham khảo chuyên gia nếu có bệnh lý nền.
      </div>
    </div>
  );
}
