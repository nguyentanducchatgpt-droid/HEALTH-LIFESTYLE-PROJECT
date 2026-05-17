import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SECTION_ACCENT = [
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'text-sky-400 bg-sky-500/10 border-sky-500/30',
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
];

const HEALTH_METRICS = [
  {
    label:  'Chỉ số khối cơ thể',
    value:  '18.5 – 24.9',
    unit:   'BMI',
    status: 'Bình thường',
  },
  {
    label:  'Nguy cơ tim mạch',
    value:  '<90 cm (nam)  <80 cm (nữ)',
    unit:   'Vòng eo',
    status: 'Thấp',
  },
  {
    label:  'mmHg',
    value:  '90–120 / 60–80',
    unit:   'Huyết áp',
    status: 'Bình thường',
  },
  {
    label:  '<100 mg/dL',
    value:  '3.9–5.6 mmol/L',
    unit:   'Đường huyết đói',
    status: 'Bình thường',
  },
  {
    label:  'VĐV: 40–60 bpm',
    value:  '60–100 bpm',
    unit:   'Nhịp tim nghỉ',
    status: 'Bình thường',
  },
];

const WARNING_SIGNS = [
  'Đau sắc nét, đột ngột (không phải mỏi cơ bình thường)',
  'Tê bì hoặc yếu cơ đột ngột ở tay/chân',
  'Đau ngực hoặc cảm giác đè nặng khi vận động',
  'Chóng mặt, mất thăng bằng, nhìn mờ',
  'Khó thở không tương xứng với cường độ tập',
];

const PREVENTION_HABITS = [
  'Vận động 150 phút/tuần theo khuyến nghị WHO',
  'Ăn đa dạng, đủ vi chất, ít thực phẩm chế biến',
  'Ngủ 7–9h/đêm — thiếu ngủ tăng nguy cơ bệnh mãn tính',
  'Quản lý stress: thiền, tập luyện, kết nối xã hội',
  'Khám sức khỏe định kỳ 1 lần/năm',
];

export default function PillarE() {
  const { t }           = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar = tPillars('pillarE', { returnObjects: true });

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-blue-400 text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {t('back')}
        </Link>
      </div>

      {/* Hero */}
      <div className="mb-14 relative">
        <div className="absolute -top-8 -left-8 w-56 h-56 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-0 w-40 h-40 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-blue-500/30 mb-6 animate-fade-in">
            {pillar.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            {pillar.title}
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mt-3 mb-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            {pillar.subtitle}
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{pillar.description}</p>
        </div>
      </div>

      {/* Contextual image */}
      <div className="relative rounded-3xl overflow-hidden mb-14 border border-blue-500/20">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=70"
          alt="Health knowledge"
          className="w-full h-64 md:h-80 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-blue-300 text-sm font-medium">
            Hiểu cơ thể là bước đầu tiên để bảo vệ sức khỏe
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-12" />

      {/* Health Metrics Cards */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Chỉ Số Sức Khỏe Tham Chiếu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_METRICS.map((metric, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
                {metric.unit}
              </p>
              <p className="text-blue-400 font-bold text-lg leading-tight mb-1">
                {metric.value}
              </p>
              <p className="text-muted text-xs mb-3">{metric.label}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                <span className="text-green-400 text-xs font-semibold">{metric.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stop Training Warning */}
      <div className="bg-red-500/6 border border-red-500/20 rounded-2xl p-6 mb-12">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl shrink-0">
            ⛔
          </div>
          <div>
            <h2 className="font-bold text-red-400 text-lg leading-snug">
              DỪNG TẬP NGAY – Đến Gặp Bác Sĩ
            </h2>
            <p className="text-red-400/60 text-xs mt-0.5">
              Khi xuất hiện bất kỳ dấu hiệu nào dưới đây
            </p>
          </div>
        </div>
        <ul className="space-y-3 mb-5">
          {WARNING_SIGNS.map((sign, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-red-300/80">
              <span className="text-base shrink-0 mt-0.5">🔴</span>
              <span className="leading-relaxed">{sign}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-red-500/15 pt-4">
          <p className="text-red-300 text-sm font-semibold">
            → Gặp bác sĩ trước khi tiếp tục tập luyện
          </p>
        </div>
      </div>

      {/* Prevention Habits Checklist */}
      <div className="mb-12">
        <div className="bg-surface border border-blue-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-text mb-1 flex items-center gap-2">
            <span>✅</span> Thói Quen Phòng Bệnh Chủ Động
          </h2>
          <p className="text-muted text-xs mb-5">
            Phòng bệnh hơn chữa bệnh — xây từng thói quen nhỏ mỗi ngày
          </p>
          <ul className="space-y-3">
            {PREVENTION_HABITS.map((habit, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted hover:text-text transition-colors duration-150 group/item">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-200">
                  ✓
                </span>
                <span className="leading-relaxed">{habit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

      {/* Standard sections from i18n */}
      {Array.isArray(pillar.sections) && (
        <div className="space-y-5 mb-16">
          {pillar.sections.map((section, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-[2px] bg-gradient-to-r from-blue-500/50 via-blue-500/20 to-transparent" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${
                      SECTION_ACCENT[i % SECTION_ACCENT.length]
                    }`}
                  >
                    {i + 1}
                  </span>
                  <h2 className="font-bold text-text text-base">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {Array.isArray(section.items) &&
                    section.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm text-muted hover:text-text transition-colors duration-150 group/item"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-blue-500 group-hover/item:text-white transition-all duration-200">
                          ✓
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
