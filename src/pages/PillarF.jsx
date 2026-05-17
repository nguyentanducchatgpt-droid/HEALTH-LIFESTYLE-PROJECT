import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LocalVideoCard from '../components/LocalVideoCard';

const SECTION_ACCENT = [
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'text-orange-300 bg-orange-500/10 border-orange-400/30',
  'text-yellow-300 bg-yellow-500/10 border-yellow-400/30',
];

export default function PillarF() {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');

  const pillar         = tPillars('pillarF',                 { returnObjects: true });
  const checklistItems = tPillars('pillarF.checklist_items', { returnObjects: true });
  const sections       = tPillars('pillarF.sections',        { returnObjects: true });
  const templateCards  = tPillars('pillarF.template_cards',  { returnObjects: true }) || [];
  const progressTests  = tPillars('pillarF.progress_tests',  { returnObjects: true }) || [];

  const [checked, setChecked] = useState({});

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('loading')}</span>
      </div>
    );
  }

  const items = Array.isArray(checklistItems) ? checklistItems : [];
  const doneCount = Object.values(checked).filter(Boolean).length;
  const allDone = items.length > 0 && doneCount === items.length;
  const anyChecked = doneCount > 0;

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  const reset  = () => setChecked({});

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('back')}
        </Link>
      </div>

      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-14 relative">
        <div className="absolute -top-8 -left-8 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-orange-500/20 mb-6 animate-fade-in">
            {pillar.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            {pillar.title}
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-orange-400 mt-3 mb-4 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
            {pillar.subtitle}
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">{pillar.description}</p>
        </div>
      </div>

      {/* ── Hero image ───────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-12 h-48 md:h-64">
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=70"
          alt="tools and resources"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/30 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="text-xs font-bold text-white/80 bg-orange-500/40 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-500/30">
            {tPillars('pillarF.image_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-12" />

      {/* ── Interactive Daily Checklist ──────────────── */}
      <div className="bg-surface border border-orange-500/20 rounded-2xl p-6 mb-8">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-text text-base flex items-center gap-2">
            {tPillars('pillarF.checklist_title')}
            <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
              {doneCount}/{items.length}
            </span>
          </h2>
          {anyChecked && (
            <button
              onClick={reset}
              className="text-xs text-muted hover:text-orange-400 transition-colors duration-200 px-3 py-1 border border-border hover:border-orange-500/30 rounded-lg"
            >
              {tPillars('pillarF.reset_btn')}
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-orange-500/10 rounded-full h-2 mb-5">
          <div
            className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${items.length > 0 ? (doneCount / items.length) * 100 : 0}%` }}
          />
        </div>

        {/* Items */}
        <ul className="space-y-2">
          {items.map((item, i) => {
            const isDone = Boolean(checked[i]);
            return (
              <li
                key={i}
                onClick={() => toggle(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                  isDone
                    ? 'bg-orange-500/8 border border-orange-500/20'
                    : 'bg-bg border border-border hover:border-orange-500/20 hover:bg-orange-500/5'
                }`}
              >
                {isDone ? (
                  <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
                    ✓
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                )}
                <span
                  className={`text-sm leading-relaxed transition-colors duration-200 ${
                    isDone ? 'line-through text-muted/50' : 'text-text'
                  }`}
                >
                  {item}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Completion message */}
        {allDone && (
          <div className="mt-5 flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl px-4 py-3">
            <span className="text-base">🎉</span>
            <p className="text-sm font-semibold text-orange-300">
              {tPillars('pillarF.all_done_msg')}
            </p>
          </div>
        )}
      </div>

      {/* ── Template Cards 2×2 ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {templateCards.map((card) => (
          <div
            key={card.title}
            className="bg-surface border border-border rounded-2xl p-5 hover:border-orange-500/30 transition-all duration-300 group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                {card.icon}
              </span>
              <div>
                <h3 className="font-bold text-text text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4-Week Progress Tests ────────────────────── */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
          <span className="text-2xl">📈</span>
          {tPillars('pillarF.progress_title')}
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-orange-500/60 via-orange-500/20 to-transparent" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">
                    {tPillars('pillarF.col_capability')}
                  </th>
                  <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">
                    {tPillars('pillarF.col_test')}
                  </th>
                  <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    {tPillars('pillarF.col_week1')}
                  </th>
                  <th className="text-center text-xs font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    {tPillars('pillarF.col_week4')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {progressTests.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 hover:bg-orange-500/3 transition-colors duration-150 last:border-0"
                  >
                    <td className="px-5 py-3">
                      <span className="font-semibold text-text">{row.capability}</span>
                    </td>
                    <td className="px-5 py-3 text-muted leading-relaxed">{row.test}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {row.week1}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block text-xs font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {row.week4}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Remaining Sections (from i18n) ──────────── */}
      {Array.isArray(sections) && (
        <div className="space-y-5 mb-16">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-[2px] bg-gradient-to-r from-orange-500/50 via-orange-500/20 to-transparent" />
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
                        <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all duration-200">
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
