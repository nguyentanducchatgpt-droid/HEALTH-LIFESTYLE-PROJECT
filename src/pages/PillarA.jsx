import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from '../components/LocalVideoCard';

const SECTION_ACCENT = [
  'text-green-400 bg-green-500/10 border-green-500/30',
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-lime-400 bg-lime-500/10 border-lime-500/30',
];

const MOVE_STYLE = {
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  bar: 'from-green-500/60' },
  lime:   { text: 'text-lime-400',   bg: 'bg-lime-500/10',   border: 'border-lime-500/30',   bar: 'from-lime-500/60' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   bar: 'from-blue-500/60' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   bar: 'from-teal-500/60' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', bar: 'from-purple-500/60' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'from-orange-500/60' },
};

const PLAN_STYLE = {
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30' },
};

const LEVEL_COLORS = [
  'bg-green-500/10 text-green-400 border-green-500/30',
  'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'bg-purple-500/10 text-purple-400 border-purple-500/30',
];

export default function PillarA() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar          = tPillars('pillarA',                  { returnObjects: true });
  const movementsDetail = tPillars('pillarA.movements_detail', { returnObjects: true });
  const workoutPlans    = tPillars('pillarA.workout_plans',    { returnObjects: true });
  const progressTests   = tPillars('pillarA.progress_tests',  { returnObjects: true });
  const warmup          = tPillars('pillarA.warmup',           { returnObjects: true });
  const cooldown        = tPillars('pillarA.cooldown',         { returnObjects: true });

  const [activeMove, setActiveMove] = useState(0);
  const [activePlan, setActivePlan] = useState(0);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('common.loading')}</span>
      </div>
    );
  }

  const currentMove = Array.isArray(movementsDetail) ? movementsDetail[activeMove] : null;
  const currentPlan = Array.isArray(workoutPlans) ? workoutPlans[activePlan] : null;
  const ms = currentMove ? (MOVE_STYLE[currentMove.color] || MOVE_STYLE.green) : MOVE_STYLE.green;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors duration-200 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('common.back')}
        </Link>
      </div>

      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-14 relative">
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-border mb-6 animate-fade-in">
            {pillar.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            {pillar.title}
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mt-3 mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            {pillar.subtitle}
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{pillar.description}</p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12" />

      {/* ── Standard sections ───────────────────────── */}
      {Array.isArray(pillar.sections) && (
        <div className="space-y-5 mb-16">
          {pillar.sections.map((section, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-border-bright transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-[2px] bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border shrink-0 ${SECTION_ACCENT[i % SECTION_ACCENT.length]}`}>
                    {i + 1}
                  </span>
                  <h2 className="font-bold text-text text-base">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {Array.isArray(section.items) && section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted hover:text-text transition-colors duration-150 group/item">
                      <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-accent group-hover/item:text-bg transition-all duration-200">
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

      {/* ── Warm-up & Cool-down tables ──────────────── */}
      {Array.isArray(warmup) && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            {tPillars('pillarA.warmup_title')}
          </h2>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 w-1/4">Bài tập</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Cách làm</th>
                    <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 w-1/5">Thời lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {warmup.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/2 transition-colors duration-150 last:border-0">
                      <td className="px-5 py-3 font-semibold text-text">{row.exercise}</td>
                      <td className="px-5 py-3 text-muted leading-relaxed">{row.how}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full border border-accent/20 whitespace-nowrap">{row.duration}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {Array.isArray(cooldown) && (
            <div className="mt-4 bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-teal-500/60 via-teal-500/20 to-transparent" />
              <div className="px-5 py-3 border-b border-border/50">
                <h3 className="text-sm font-bold text-teal-400 flex items-center gap-2">
                  <span>🧘</span> {tPillars('pillarA.cooldown_title')}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {cooldown.map((row, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-white/2 transition-colors last:border-0">
                        <td className="px-5 py-3 font-semibold text-text w-1/4">{row.exercise}</td>
                        <td className="px-5 py-3 text-muted leading-relaxed">{row.how}</td>
                        <td className="px-5 py-3 text-right w-1/5">
                          <span className="inline-block bg-teal-500/10 text-teal-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-500/20 whitespace-nowrap">{row.duration}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 6 Movement Detail Cards ─────────────────── */}
      {Array.isArray(movementsDetail) && currentMove && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            {tPillars('pillarA.movements_title')}
          </h2>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {movementsDetail.map((m, i) => {
              const s = MOVE_STYLE[m.color] || MOVE_STYLE.green;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveMove(i)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    activeMove === i
                      ? `${s.bg} ${s.text} ${s.border}`
                      : 'bg-surface border-border text-muted hover:border-accent/30 hover:text-text'
                  }`}
                >
                  <span>{m.icon}</span>
                  {m.name}
                </button>
              );
            })}
          </div>

          {/* Active movement card */}
          <div className={`relative bg-surface border ${ms.border} rounded-2xl overflow-hidden`}>
            <div className={`h-[2px] bg-gradient-to-r ${ms.bar} to-transparent`} />
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl ${ms.bg} border ${ms.border} flex items-center justify-center text-3xl shrink-0`}>
                  {currentMove.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${ms.text}`}>{currentMove.name}</h3>
                  <p className="text-muted text-sm mt-1 leading-relaxed">{currentMove.goal}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Basic exercise + how */}
                <div className="space-y-4">
                  <div className={`${ms.bg} border ${ms.border} rounded-xl p-4`}>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Bài cơ bản</p>
                    <p className={`font-bold text-base ${ms.text} mb-1`}>{currentMove.basic}</p>
                    <p className="text-xs text-muted leading-relaxed mb-3">{currentMove.basic_how}</p>
                    <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full border border-accent/20">
                      {currentMove.prescription}
                    </span>
                  </div>

                  {/* Technique cue */}
                  <div className="bg-bg border border-border rounded-xl p-4">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">💡 Cue kỹ thuật</p>
                    <p className={`text-sm font-semibold ${ms.text} leading-relaxed`}>{currentMove.cue}</p>
                  </div>
                </div>

                {/* Progression levels + errors */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Cấp độ tiến bộ</p>
                    <div className="space-y-2">
                      {Array.isArray(currentMove.levels) && currentMove.levels.map((lvl, i) => (
                        <div key={i} className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${LEVEL_COLORS[i % LEVEL_COLORS.length]}`}>
                            {lvl.label}
                          </span>
                          <span className="text-sm text-text">{lvl.exercise}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-500/6 border border-yellow-500/20 rounded-xl p-4">
                    <p className="text-xs font-bold text-yellow-400/80 uppercase tracking-wider mb-1.5">⚠ Lỗi thường gặp</p>
                    <p className="text-xs text-yellow-300/70 leading-relaxed">{currentMove.errors}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Workout Plans ───────────────────────────── */}
      {Array.isArray(workoutPlans) && currentPlan && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            {tPillars('pillarA.plans_title')}
          </h2>

          {/* Plan tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {workoutPlans.map((plan, i) => {
              const s = PLAN_STYLE[plan.color] || PLAN_STYLE.green;
              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(i)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    activePlan === i
                      ? `${s.bg} ${s.text} ${s.border}`
                      : 'bg-surface border-border text-muted hover:border-accent/30 hover:text-text'
                  }`}
                >
                  {plan.name}
                  <span className={`${activePlan === i ? 'opacity-70' : 'opacity-50'} font-medium`}>· {plan.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Plan content */}
          {(() => {
            const ps = PLAN_STYLE[currentPlan.color] || PLAN_STYLE.green;
            return (
              <div className={`relative bg-surface border ${ps.border} rounded-2xl overflow-hidden`}>
                <div className={`h-[2px] bg-gradient-to-r from-${currentPlan.color}-500/60 to-transparent`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${ps.bg} ${ps.text} ${ps.border}`}>
                      {currentPlan.name} · {currentPlan.tag}
                    </span>
                  </div>

                  {currentPlan.type === 'blocks' && Array.isArray(currentPlan.blocks) && (
                    <div className="space-y-3">
                      {currentPlan.blocks.map((block, i) => (
                        <div key={i} className="flex gap-4 items-start bg-bg border border-border rounded-xl px-5 py-4">
                          <div className="shrink-0 text-right min-w-[64px]">
                            <span className={`text-xs font-bold ${ps.text}`}>{block.time}</span>
                          </div>
                          <div className="w-px bg-border self-stretch shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-0.5">{block.phase}</p>
                            <p className="text-sm text-text leading-relaxed">{block.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentPlan.type === 'exercises' && Array.isArray(currentPlan.exercises) && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left text-xs font-bold text-muted uppercase tracking-wider pb-3 pr-4">Bài tập</th>
                            <th className="text-right text-xs font-bold text-muted uppercase tracking-wider pb-3">Sets × Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentPlan.exercises.map((ex, i) => (
                            <tr key={i} className="border-b border-border/50 last:border-0">
                              <td className="py-3 pr-4 text-text">{ex.name}</td>
                              <td className="py-3 text-right">
                                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${ps.bg} ${ps.text} ${ps.border}`}>
                                  {ex.sets}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Progress Tests ──────────────────────────── */}
      {Array.isArray(progressTests) && (
        <div className="mb-14">
          <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {tPillars('pillarA.tests_title')}
          </h2>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 w-1/3">Năng lực</th>
                    <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Bài kiểm tra</th>
                  </tr>
                </thead>
                <tbody>
                  {progressTests.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/2 transition-colors last:border-0">
                      <td className="px-5 py-3">
                        <span className="font-semibold text-text">{row.capability}</span>
                      </td>
                      <td className="px-5 py-3 text-muted leading-relaxed">{row.test}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Videos ──────────────────────────────────── */}
      {Array.isArray(pillar.videos) && pillar.videos.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            <h2 className="text-lg font-bold text-text px-4">{tCommon('video.local_section')}</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillar.videos.map((videoKey) => (
              <LocalVideoCard key={videoKey} src={videoKey} title={tCommon(`video.${videoKey}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
