import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GOAL_TYPES, PROGRAM_PHASES, WEEKLY_SCHEDULE } from '../data/programData';

/* ─── Rich goal card config ── hero images + gradient overlays ── */
const GOAL_CARDS = {
  beginner:  {
    heroImg: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=75',
    overlay:  'from-green-950/90 via-green-900/70 to-transparent',
    glowColor:'rgba(34,197,94,0.35)',
    tag:      '0–3 tháng',
    badge:    'Dễ bắt đầu',
  },
  busy:      {
    heroImg: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?w=900&q=75',
    overlay:  'from-yellow-950/90 via-yellow-900/70 to-transparent',
    glowColor:'rgba(234,179,8,0.35)',
    tag:      'Mọi lịch trình',
    badge:    'Linh hoạt nhất',
  },
  fatloss:   {
    heroImg: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&q=75',
    overlay:  'from-orange-950/90 via-orange-900/70 to-transparent',
    glowColor:'rgba(249,115,22,0.35)',
    tag:      'Thừa cân nhẹ',
    badge:    'Phổ biến nhất',
  },
  muscle:    {
    heroImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=75',
    overlay:  'from-blue-950/90 via-blue-900/70 to-transparent',
    glowColor:'rgba(59,130,246,0.35)',
    tag:      'Có tạ / dây',
    badge:    'Tăng cơ',
  },
  endurance: {
    heroImg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&q=75',
    overlay:  'from-teal-950/90 via-teal-900/70 to-transparent',
    glowColor:'rgba(20,184,166,0.35)',
    tag:      'Tim phổi khỏe',
    badge:    'Cardio Zone 2',
  },
  advanced:  {
    heroImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=75',
    overlay:  'from-purple-950/90 via-purple-900/70 to-transparent',
    glowColor:'rgba(168,85,247,0.35)',
    tag:      'Nền thể lực tốt',
    badge:    'Đa môn',
  },
};

/* ─── Phase color palette ── */
const PHASE_COLORS = [
  { bar:'bg-green-500',  text:'text-green-400',  glow:'shadow-green-500/30' },
  { bar:'bg-lime-500',   text:'text-lime-400',   glow:'shadow-lime-500/30'  },
  { bar:'bg-teal-500',   text:'text-teal-400',   glow:'shadow-teal-500/30'  },
  { bar:'bg-blue-500',   text:'text-blue-400',   glow:'shadow-blue-500/30'  },
  { bar:'bg-purple-500', text:'text-purple-400', glow:'shadow-purple-500/30'},
  { bar:'bg-pink-500',   text:'text-pink-400',   glow:'shadow-pink-500/30'  },
];

const PHASE_COLORS_HEX = [
  { hex: '#22c55e', rgb: '34,197,94'   },
  { hex: '#84cc16', rgb: '132,204,22'  },
  { hex: '#14b8a6', rgb: '20,184,166'  },
  { hex: '#3b82f6', rgb: '59,130,246'  },
  { hex: '#a855f7', rgb: '168,85,247'  },
  { hex: '#ec4899', rgb: '236,72,153'  },
];

/* ─── Day schedule images ── */
const SCHEDULE_IMAGES = {
  '🏋️': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=65',
  '🚶': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=65',
  '🧘': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=65',
  '🏃': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=65',
  '🚴': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&q=65',
  '💪': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=65',
  '🦵': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=65',
  '⚡': 'https://images.unsplash.com/photo-1549476464-37392f717541?w=300&q=65',
  '💆': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=65',
  '🌿': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=65',
  '🌳': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=65',
  '🔥': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=65',
};

const WEEKS = Array.from({ length: 24 }, (_, i) => i + 1);

/* ── useInView hook ── */
function useInView(threshold = 0.15) {
  const ref  = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── useCountUp hook ── */
function useCountUp(target, duration = 1000, enabled = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!enabled || typeof target !== 'number') return;
    let frame; let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setVal(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);
  return val;
}

/* ─────────────────────────────────────────────── */
/*  DailyBlockModal                                */
/* ─────────────────────────────────────────────── */
function DailyBlockModal({ block, onClose }) {
  const { t } = useTranslation();
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${block.rgb},0.28)`, boxShadow: `0 0 80px rgba(${block.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={block.img} alt={block.name} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${block.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${block.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${block.rgb},0.18)`, border: `2px solid rgba(${block.rgb},0.4)` }}>
              {block.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: block.color }}>{block.time || t('modal.chi_tiet') || 'CHI TIẾT'}</p>
              <h2 className="font-bold text-white text-lg leading-tight max-w-xs">{block.name}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-5 md:p-7">
          <ul className="space-y-2.5 mb-5">
            {block.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${block.rgb},0.14)`, color: block.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${block.rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${block.rgb},0.5)` }}>{t('modal.explore_detail')}</p>
            <div className="flex flex-wrap gap-2">
              {block.links.map((lk, li) => (
                <Link key={li} to={lk.to} onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                  style={{ color: block.color, background: `rgba(${block.rgb},0.1)`, border: `1px solid rgba(${block.rgb},0.22)` }}>
                  <span>{lk.icon}</span> {lk.label} →
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {block.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${block.rgb},0.06)`, border: `1px solid rgba(${block.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{t('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*  ProgramDetail full-bleed immersive card        */
/* ─────────────────────────────────────────────── */
function ProgramDetail({ goalId, weeks }) {
  const goal    = GOAL_TYPES.find(g => g.id === goalId);
  const card    = GOAL_CARDS[goalId];
  const phases  = PROGRAM_PHASES[goalId] || [];
  const sched   = WEEKLY_SCHEDULE[goalId] || [];

  const activePhs = phases.filter(p => p.range[0] <= weeks);
  const curPhase  = activePhs[activePhs.length - 1];

  const [activeItem, setActiveItem] = useState(null);
  const { t: tP } = useTranslation('programs');

  if (!goal || !curPhase) return null;

  const phIdx = activePhs.length - 1;
  const pCol  = PHASE_COLORS[phIdx] || PHASE_COLORS[0];
  const phHex = PHASE_COLORS_HEX[phIdx] || PHASE_COLORS_HEX[0];

  // Translated phase data with fallback to source data
  const phArrRaw   = tP(`phases.${goalId}`, { returnObjects: true });
  const phArr      = Array.isArray(phArrRaw) ? phArrRaw : [];
  const phTrans    = phArr[phIdx] || {};
  const pName      = phTrans.name      || curPhase.name;
  const pDesc      = phTrans.desc      || curPhase.desc;
  const pFocus     = phTrans.focus     || curPhase.focus;
  const pNutrition = phTrans.nutrition || curPhase.nutrition;
  const pMilestone = phTrans.milestone || curPhase.milestone;
  const phNames    = phArr.map(p => p.name || '');

  const schedArrRaw = tP(`schedule.${goalId}`, { returnObjects: true });
  const schedArr    = Array.isArray(schedArrRaw) ? schedArrRaw : [];

  const LINK_LABEL_MAP = {
    '/pillar/a/movements': 'link_movements',
    '/pillar/c':           'link_lifestyle',
    '/pillar/a/recovery':  'link_recovery',
    '/pillar/d':           'link_mind',
    '/pillar/a':           'exercise_link_label',
    '/pillar/a/framework': 'link_framework',
    '/pillar/b':           'link_nutrition_short',
  };

  const gtRaw  = tP(`goal_types.${goalId}`, { returnObjects: true });
  const gTitle = (gtRaw && typeof gtRaw === 'object' && gtRaw.title) ? gtRaw.title : goal.title;

  return (
    <>
    <div className="animate-fade-in-up">
      {/* ── Immersive header card ── */}
      <div className="relative overflow-hidden rounded-3xl mb-6 group">
        <img
          src={curPhase.image || goal.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ opacity: 0.25 }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${card?.overlay || 'from-bg to-transparent'} pointer-events-none`} />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />

        {/* Glow orb */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[80px] pointer-events-none"
          style={{ background: card?.glowColor || 'rgba(34,197,94,0.2)' }}
        />

        <div className="relative p-6 md:p-10 flex flex-col md:flex-row gap-6 md:items-end">
          {/* Left */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${goal.badge} uppercase tracking-wider`}>
                {goal.icon} {gTitle}
              </span>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60">
                {curPhase.intensity}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${pCol.bar} text-bg`}>
                {curPhase.tag}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
              {weeks} {tP('ui.week_label')} · {pName}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg">{pDesc}</p>
          </div>

          {/* Right: week position */}
          <div className="shrink-0 text-right">
            <div className="text-white/30 text-base mb-1 uppercase tracking-widest">{tP('ui.current_week')}</div>
            <div className={`text-6xl font-black ${goal.text}`}>{weeks}</div>
            <div className="text-white/40 text-base">/ 24</div>
          </div>
        </div>

        {/* Phase progress bar */}
        <div className="px-6 md:px-10 pb-6">
          <div className="flex gap-1 mb-2">
            {phases.map((ph, i) => {
              const pct = Math.min(100, Math.max(0,
                i < phIdx ? 100 :
                i === phIdx ? Math.round(((weeks - ph.range[0]) / (ph.range[1] - ph.range[0] + 1)) * 100) :
                0
              ));
              const isActive = i <= phIdx;
              return (
                <div key={i} className="flex-1 group/ph relative">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isActive ? PHASE_COLORS[i].bar : ''}`}
                      style={{ width: `${pct}%`, transitionDelay: `${i * 100}ms` }}
                    />
                  </div>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/ph:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-black/80 border border-white/10 rounded-lg px-2 py-0.5 text-[9px] text-white z-10 pointer-events-none">
                    {ph.icon} {phNames[i] || ph.name}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-white/30">
            <span>T1</span>
            <span>T{Math.round(24/3)}</span>
            <span>T{Math.round(24*2/3)}</span>
            <span>T24</span>
          </div>
        </div>
      </div>

      {/* ── Phase detail grid ── */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Focus card */}
        <div className={`md:col-span-2 relative overflow-hidden rounded-2xl border ${goal.border} ${goal.bg} p-5`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-3 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl ${goal.bg} border ${goal.border} flex items-center justify-center text-2xl`}>
              {curPhase.icon}
            </div>
            <div>
              <h3 className={`font-bold ${goal.text}`}>{pName}</h3>
              <p className="text-[11px] text-muted">{tP('ui.week_label')} {curPhase.range[0]}–{Math.min(curPhase.range[1], weeks)}</p>
            </div>
          </div>
          <div className="bg-bg/60 rounded-xl p-4 border border-border/40 cursor-pointer hover:border-white/20 transition-colors duration-200"
            onClick={() => setActiveItem({
              icon: curPhase.icon, name: `${pName} — ${tP('ui.focus_modal_title')}`, time: curPhase.intensity,
              color: phHex.hex, rgb: phHex.rgb,
              img: curPhase.image || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
              details: [pFocus, pDesc, tP('ui.phase_tag_detail', { tag: curPhase.tag, start: curPhase.range[0], end: curPhase.range[1] })],
              points: [
                { icon:'🎯', label: tP('ui.intensity_label'), note: curPhase.intensity },
                { icon:'📅', label: tP('ui.phase_label'), note: tP('ui.phase_weeks', { start: curPhase.range[0], end: curPhase.range[1] }) },
                { icon:'🏷️', label: tP('ui.category_label'), note: curPhase.tag },
                { icon:'📈', label: tP('ui.progress_label'), note: tP('ui.progress_note') },
              ],
              links: [{ icon:'🏋️', label: tP('ui.exercise_link_label'), to:'/pillar/a' }],
            })}>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">🏋️ {tP('ui.focus_label')}</p>
            <p className="text-lg text-text leading-relaxed">{pFocus}</p>
          </div>
        </div>

        {/* Nutrition + milestone stacked */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-border bg-surface p-4 cursor-pointer hover:border-white/20 transition-colors duration-200"
            onClick={() => setActiveItem({
              icon: '🥗', name: `${pName} — ${tP('ui.nutrition_modal_title')}`, time: tP('ui.nutrition_modal_time'),
              color: '#84cc16', rgb: '132,204,22',
              img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
              details: [
                pNutrition,
                tP('ui.water_note'),
                tP('ui.meal_timing_note'),
              ],
              points: [
                { icon:'🍽️', label: tP('ui.plate_label'), note: tP('ui.plate_note') },
                { icon:'💧', label: tP('ui.water_label'), note: tP('ui.water_note_short') },
                { icon:'⏰', label: tP('ui.meal_time_label'), note: tP('ui.meal_time_note') },
                { icon:'🥩', label: tP('ui.protein_label'), note: tP('ui.protein_note') },
              ],
              links: [{ icon:'🥗', label: tP('ui.nutrition_link_label'), to:'/pillar/b' }],
            })}>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">🥗 {tP('ui.nutrition_label')}</p>
            <p className="text-base text-text leading-relaxed">{pNutrition}</p>
          </div>
          <div className={`rounded-2xl border ${goal.border} bg-surface p-4 cursor-pointer hover:border-white/20 transition-colors duration-200`}
            onClick={() => setActiveItem({
              icon: '🏁', name: `${pName} — ${tP('ui.milestone_modal_title')}`, time: tP('ui.milestone_modal_time'),
              color: phHex.hex, rgb: phHex.rgb,
              img: curPhase.image || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
              details: [
                pMilestone,
                tP('ui.progress_eval'),
                tP('ui.if_achieve_early', { week: curPhase.range[1] }),
              ],
              points: [
                { icon:'✅', label: tP('ui.complete_label'), note: tP('ui.complete_note') },
                { icon:'📊', label: tP('ui.measure_label'), note: tP('ui.measure_note') },
                { icon:'🔄', label: tP('ui.adjust_label'), note: tP('ui.adjust_note') },
                { icon:'🏆', label: tP('ui.reward_label'), note: tP('ui.reward_note') },
              ],
              links: [{ icon:'📋', label: tP('ui.tools_link_label'), to:'/pillar/f' }],
            })}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${goal.text}`}>🏁 {tP('ui.milestone_label')}</p>
            <p className="text-base text-text leading-relaxed">{pMilestone}</p>
          </div>
        </div>
      </div>

      {/* ── Weekly schedule ── */}
      <div>
        <h3 className="text-base font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-px h-4 bg-border" />
          {tP('ui.weekly_schedule')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {sched.map((s, i) => {
            const img = SCHEDULE_IMAGES[s.icon];
            const sTrans = schedArr[i] || {};
            const sType   = sTrans.type   || s.type;
            const sDetail = sTrans.detail || s.detail;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border hover:border-border-bright bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => s.details && setActiveItem({
                  icon: s.icon, name: sType, time: tP(`days.${s.day}`) || s.day,
                  color: s.c.hex, rgb: s.c.rgb,
                  img: s.img || SCHEDULE_IMAGES[s.icon] || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
                  details: sTrans.details || s.details,
                  points: sTrans.points || s.points,
                  links: (s.links || []).map(lk => ({
                    ...lk,
                    label: lk.to in LINK_LABEL_MAP ? (tP(`ui.${LINK_LABEL_MAP[lk.to]}`) || lk.label) : lk.label,
                  })),
                })}
              >
                {/* Image thumb */}
                {img && (
                  <div className="relative h-20 overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className={`absolute bottom-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${s.c.bg}`}>
                      {s.day}
                    </div>
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${s.c.dot}`} />
                  </div>
                )}
                {!img && (
                  <div className={`h-20 flex items-center justify-center ${s.c.bg} border-b border-border/50`}>
                    <span className="text-4xl">{s.icon}</span>
                  </div>
                )}
                {/* Text */}
                <div className="p-3">
                  <p className="text-base font-semibold text-text leading-tight mb-1 group-hover:text-accent transition-colors duration-200">{sType}</p>
                  <p className="text-[10px] text-muted leading-snug">{sDetail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    {activeItem && <DailyBlockModal block={activeItem} onClose={() => setActiveItem(null)} />}
    </>
  );
}

/* ─────────────────────────────────────────────── */
/*  Main page                                       */
/* ─────────────────────────────────────────────── */
export default function SamplePrograms() {
  const { t }              = useTranslation();
  const { t: tP }          = useTranslation('programs');
  const [goalType,     setGoalType]     = useState(null);
  const [weekDuration, setWeekDuration] = useState(null);
  const [hoveredWeek,  setHoveredWeek]  = useState(null);

  const [heroRef,  heroInView]  = useInView(0.1);
  const [step1Ref, step1InView] = useInView(0.15);
  const step2Ref = useRef(null);

  const selectedGoal = GOAL_TYPES.find(g => g.id === goalType);
  const selectedCard = goalType ? GOAL_CARDS[goalType] : null;

  /* Auto-scroll to week selector when goal is picked */
  useEffect(() => {
    if (goalType && step2Ref.current) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [goalType]);

  /* Get phase name for a given week */
  const getPhaseFor = (gId, w) => {
    const phs = PROGRAM_PHASES[gId] || [];
    return phs.find(p => p.range[0] <= w && w <= p.range[1]);
  };

  /* Translated phase names for the current goal */
  const tPhasesForGoal = (() => {
    if (!goalType) return [];
    const r = tP(`phases.${goalType}`, { returnObjects: true });
    return Array.isArray(r) ? r : [];
  })();

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ════════════════════════════════════════════ */}
      {/* HERO — cinematic redesign                   */}
      {/* ════════════════════════════════════════════ */}
      {(() => {
        /* inject keyframe CSS once */
        if (typeof document !== 'undefined' && !document.getElementById('sp-hero-kf')) {
          const s = document.createElement('style'); s.id = 'sp-hero-kf';
          s.textContent = `
            @property --sp-orbit-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
            @keyframes spOrbitSpin { to { --sp-orbit-angle:360deg; } }
            .sp-orbit-ring {
              background: conic-gradient(from var(--sp-orbit-angle),
                transparent 0deg, transparent 60deg,
                rgba(34,197,94,0) 70deg, rgba(34,197,94,0.7) 88deg,
                rgba(255,255,255,0.85) 94deg, rgba(34,197,94,0.7) 100deg,
                rgba(34,197,94,0) 115deg, transparent 125deg, transparent 360deg);
              animation: spOrbitSpin 3.5s linear infinite;
              border-radius:9999px; padding:1.5px;
            }
            @keyframes spBadgeIn { from{opacity:0;transform:translateY(-10px) scale(0.9)} to{opacity:1;transform:none} }
            @keyframes spTitleL1  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:none} }
            @keyframes spTitleL2  { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:none} }
            @keyframes spSubIn    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
            @keyframes spStatPop  { from{opacity:0;transform:scale(0.82) translateY(8px)} to{opacity:1;transform:none} }
            @keyframes spPillSlide{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
            @keyframes spGlowFloat{ 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.55;transform:scale(1.15)} }
            @keyframes spScrollBob{ 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(5px)} }
            .sp-badge-in  { animation:spBadgeIn  .55s cubic-bezier(.25,.46,.45,.94) both .05s; }
            .sp-title-l1  { animation:spTitleL1  .65s cubic-bezier(.25,.46,.45,.94) both .18s; }
            .sp-title-l2  { animation:spTitleL2  .65s cubic-bezier(.25,.46,.45,.94) both .32s; }
            .sp-sub-in    { animation:spSubIn    .55s ease both .48s; }
            .sp-stat-pop  { animation:spStatPop  .55s cubic-bezier(.34,1.56,.64,1) both; }
            .sp-pill-slide{ animation:spPillSlide .4s ease both; }
            .sp-glow-a    { animation:spGlowFloat 8s ease-in-out infinite; }
            .sp-glow-b    { animation:spGlowFloat 11s ease-in-out infinite reverse; animation-delay:-4s; }
            .sp-scroll-bob{ animation:spScrollBob 2s ease-in-out infinite; }
          `;
          document.head.appendChild(s);
        }

        /* stat counter component */
        function StatCounter({ target, suffix = '', enabled }) {
          const n = useCountUp(target, 900, enabled);
          return <>{n}{suffix}</>;
        }

        const STATS = [
          { icon:'🎯', num:6,   suf:'',  label: tP('hero.stats.goals'),     c:'#22c55e', rgb:'34,197,94'   },
          { icon:'📅', num:24,  suf:'',  label: tP('hero.stats.weeks'),     c:'#84cc16', rgb:'132,204,22'  },
          { icon:'📋', num:6,   suf:'',  label: tP('hero.stats.schedules'), c:'#14b8a6', rgb:'20,184,166'  },
          { icon:'⏱️', num:10, suf:'+', label: tP('hero.stats.min_day'),   c:'#a855f7', rgb:'168,85,247'  },
        ];

        const BG_IMGS = [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=55',
          'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=55',
          'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=55',
        ];

        return (
          <div
            ref={heroRef}
            className="relative -mx-4 md:-mx-8 overflow-hidden mb-16 rounded-b-3xl"
            style={{ minHeight: 500 }}
          >
            {/* ── layered background ── */}
            <div className="absolute inset-0 flex">
              {BG_IMGS.map((src, i) => (
                <div key={i} className="flex-1 relative overflow-hidden">
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover"
                    style={{ opacity: i === 1 ? 0.22 : 0.13, transform: i === 1 ? 'scale(1.06)' : 'none' }} />
                  {/* vertical separator */}
                  {i < 2 && <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />}
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/65 to-bg pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg pointer-events-none" />
            <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />

            {/* ── ambient glows ── */}
            <div className="sp-glow-a absolute top-[15%] left-[28%] w-[420px] h-[340px] bg-accent/7 rounded-full blur-[110px] pointer-events-none" />
            <div className="sp-glow-b absolute bottom-[5%] right-[22%] w-[300px] h-[240px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background:'linear-gradient(90deg,transparent,rgba(34,197,94,0.45),rgba(132,204,22,0.3),transparent)' }} />

            <div className={`relative z-10 px-4 md:px-10 pt-16 pb-20 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

              {/* ── orbit badge ── */}
              <div className="sp-badge-in inline-block mb-7">
                <div className="sp-orbit-ring inline-block">
                  <div className="flex items-center gap-2 bg-bg/90 text-accent text-sm font-bold px-4 py-2 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" style={{ boxShadow:'0 0 6px #22c55e' }} />
                    {t('nav.sample_programs') || 'Lộ Trình Mẫu'}
                  </div>
                </div>
              </div>

              {/* ── title ── */}
              <h1 className="font-black leading-[1.05] tracking-tight mb-5" style={{ fontSize:'clamp(2.6rem,5.5vw,4.2rem)' }}>
                <span className="sp-title-l1 block text-text">{tP('hero.title_line1')}</span>
                <span className="sp-title-l2 block"
                  style={{ background:'linear-gradient(110deg,#22c55e 0%,#5eead4 45%,#a78bfa 85%)',
                    WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  {tP('hero.title_line2')}
                </span>
              </h1>

              {/* gradient divider */}
              <div className="sp-sub-in mb-5 h-[2px] w-20 rounded-full"
                style={{ background:'linear-gradient(90deg,#22c55e,#5eead4,#a855f7)' }} />

              {/* ── subtitle ── */}
              <p className="sp-sub-in text-muted/80 text-lg leading-relaxed max-w-[460px] mb-8"
                style={{ animationDelay:'.52s' }}>
                {tP('hero.subtitle')}
              </p>

              {/* ── stat cards with counter animation ── */}
              <div className="flex flex-wrap gap-3 mb-7">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className="sp-stat-pop group relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-default"
                    style={{
                      animationDelay:`${0.6 + i * 0.1}s`,
                      background:`rgba(${s.rgb},0.06)`,
                      borderColor:`rgba(${s.rgb},0.22)`,
                    }}
                  >
                    {/* hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      style={{ background:`radial-gradient(circle at center,rgba(${s.rgb},0.14),transparent 70%)` }} />
                    {/* icon ring */}
                    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background:`rgba(${s.rgb},0.12)`, border:`1px solid rgba(${s.rgb},0.25)` }}>
                      <span className="text-lg">{s.icon}</span>
                    </div>
                    <div className="relative">
                      <div className="font-black text-xl leading-none" style={{ color: s.c }}>
                        <StatCounter target={s.num} suffix={s.suf} enabled={heroInView} />
                      </div>
                      <div className="text-[10px] text-muted/70 uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── goal preview pill strip ── */}
              <div className="sp-sub-in overflow-x-auto scrollbar-hide -mx-1 px-1"
                style={{ animationDelay:'.85s' }}>
                <div className="flex gap-2 pb-1" style={{ width:'max-content' }}>
                  {GOAL_TYPES.map((g, i) => (
                    <button
                      key={g.id}
                      onClick={() => { setGoalType(g.id); setWeekDuration(null); }}
                      className="sp-pill-slide flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
                      style={{
                        animationDelay:`${0.9 + i * 0.07}s`,
                        background: goalType === g.id ? g.bg.replace('/8','') : `rgba(255,255,255,0.03)`,
                        borderColor: goalType === g.id ? undefined : 'rgba(255,255,255,0.08)',
                      }}
                      data-goal={g.id}
                    >
                      <span>{g.icon}</span>
                      <span className={goalType === g.id ? g.text : 'text-muted'}>{tP(`goal_types.${g.id}.title`)}</span>
                      <span className="text-[10px] text-muted/50">{g.rpe}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── scroll hint ── */}
            <div className="sp-scroll-bob absolute bottom-5 left-1/2 flex flex-col items-center gap-1 text-muted/35 text-[10px] uppercase tracking-widest pointer-events-none">
              <span>{tP('hero.scroll_hint')}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════ */}
      {/* STEP 1 — Goal selector                      */}
      {/* ════════════════════════════════════════════ */}
      <section ref={step1Ref} className="mb-16">
        <div className={`transition-all duration-700 ${step1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-lg font-black flex items-center justify-center">1</span>
              <h2 className="text-2xl font-bold text-text">{tP('hero.step1_heading')}</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>

          {/* Goal cards — 2×3 grid on desktop, 2-col on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GOAL_TYPES.map((g, i) => {
              const card = GOAL_CARDS[g.id];
              const isSelected = goalType === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => { setGoalType(g.id); setWeekDuration(null); }}
                  className={`group relative overflow-hidden rounded-3xl aspect-[4/3] text-left transition-all duration-400 focus:outline-none ${
                    isSelected
                      ? `ring-2 ${g.ring} scale-[1.02] shadow-2xl`
                      : 'hover:scale-[1.02] hover:shadow-2xl hover:ring-1 hover:ring-white/10'
                  }`}
                  style={{
                    animationDelay: `${i * 80}ms`,
                    boxShadow: isSelected ? `0 20px 60px ${card?.glowColor || 'rgba(34,197,94,0.2)'}` : undefined,
                  }}
                >
                  {/* Background image */}
                  <img
                    src={card?.heroImg}
                    alt={g.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.08]"
                    loading={i < 3 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${card?.overlay || 'from-black/80 to-transparent'}`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                  {/* Top badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white/80`}>
                      {tP(`goal_cards.${g.id}.tag`)}
                    </span>
                  </div>

                  {/* Popular badge */}
                  {card?.badge && (
                    <div className="absolute top-3 right-3">
                      {isSelected ? (
                        <span className={`w-6 h-6 rounded-full ${g.bar} flex items-center justify-center shadow-lg`}>
                          <span className="text-bg text-[10px] font-black">✓</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/60 border border-white/10">
                          {tP(`goal_cards.${g.id}.badge`)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-300 inline-block">{g.icon}</p>
                        <h3 className="font-black text-xl text-white leading-tight">{tP(`goal_types.${g.id}.title`)}</h3>
                        <p className="text-base text-white/60 mt-0.5">{tP(`goal_types.${g.id}.subtitle`)}</p>
                      </div>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? `${g.bar} shadow-lg`
                          : 'bg-white/10 border border-white/20 group-hover:bg-white/20'
                      }`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Selected glow border */}
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-3xl border-2 ${g.border} pointer-events-none`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ */}
      {/* STEP 2 — Week duration                      */}
      {/* ════════════════════════════════════════════ */}
      {goalType && (
        <section
          ref={step2Ref}
          className="mb-16 animate-fade-in-up"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full border text-lg font-black flex items-center justify-center ${selectedGoal?.bg} ${selectedGoal?.border} ${selectedGoal?.text}`}>2</span>
              <h2 className="text-2xl font-bold text-text">{tP('ui.step2_heading')}</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            {weekDuration && (
              <span className={`text-lg font-bold ${selectedGoal?.text}`}>{tP('ui.weeks_selected', { count: weekDuration })}</span>
            )}
          </div>

          {/* Selected goal summary card */}
          <div className={`relative overflow-hidden rounded-2xl border ${selectedGoal?.border} ${selectedGoal?.bg} p-4 mb-6 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border ${selectedGoal?.border}`}>
              <img src={selectedCard?.heroImg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-lg ${selectedGoal?.text}`}>{selectedGoal?.icon} {goalType ? tP(`goal_types.${goalType}.title`) : ''}</p>
              <p className="text-base text-muted">{goalType ? tP(`goal_types.${goalType}.subtitle`) : ''} · {selectedGoal?.rpe}</p>
            </div>
            <button
              type="button"
              onClick={() => { setGoalType(null); setWeekDuration(null); }}
              className="shrink-0 text-base text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border hover:border-border-bright transition-colors duration-150"
            >
              {tP('ui.change_btn')}
            </button>
          </div>

          {/* Week grid — 6×4 */}
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-4">
            {WEEKS.map(w => {
              const isActive  = weekDuration === w;
              const ph        = getPhaseFor(goalType, w);
              const phIdx     = (PROGRAM_PHASES[goalType] || []).findIndex(p => p === ph);
              const isHovered = hoveredWeek === w;

              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeekDuration(w)}
                  onMouseEnter={() => setHoveredWeek(w)}
                  onMouseLeave={() => setHoveredWeek(null)}
                  className={`relative group aspect-square rounded-xl text-base font-bold transition-all duration-200 border flex flex-col items-center justify-center overflow-hidden ${
                    isActive
                      ? `${selectedGoal?.bg} ${selectedGoal?.border} ${selectedGoal?.text} ring-2 ${selectedGoal?.ring} shadow-lg scale-[1.08]`
                      : `bg-surface border-border text-muted hover:border-border-bright hover:text-text hover:scale-[1.05]`
                  }`}
                  style={{
                    boxShadow: isActive ? `0 8px 24px ${selectedCard?.glowColor || 'rgba(34,197,94,0.2)'}` : undefined,
                  }}
                >
                  {/* Phase color strip at bottom */}
                  {ph && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${PHASE_COLORS[phIdx]?.bar || 'bg-border'} transition-all duration-200 ${isHovered || isActive ? 'opacity-100' : 'opacity-30'}`}
                    />
                  )}

                  <span className="text-lg font-black leading-none">{w}</span>
                  <span className={`text-[8px] font-normal leading-none mt-0.5 ${isActive ? selectedGoal?.text : 'text-muted/40'}`}>T</span>

                  {/* Tooltip on hover */}
                  {ph && (isHovered && !isActive) && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-surface border border-border rounded-lg px-2 py-1 text-[9px] font-semibold text-text shadow-xl pointer-events-none">
                      {ph.icon} {tPhasesForGoal[phIdx]?.name || ph.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Phase legend */}
          <div className="flex flex-wrap gap-3">
            {(PROGRAM_PHASES[goalType] || []).map((ph, i) => {
              const pCol = PHASE_COLORS[i] || PHASE_COLORS[0];
              return (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted">
                  <div className={`w-2 h-2 rounded-full ${pCol.bar}`} />
                  <span className="font-medium">{ph.icon} T{ph.range[0]}–{ph.range[1]}</span>
                  <span className={pCol.text}>{tPhasesForGoal[i]?.name || ph.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* STEP 3 — Program detail                     */}
      {/* ════════════════════════════════════════════ */}
      {goalType && weekDuration && (
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 rounded-full border text-lg font-black flex items-center justify-center ${selectedGoal?.bg} ${selectedGoal?.border} ${selectedGoal?.text}`}>3</span>
              <h2 className="text-2xl font-bold text-text">{tP('ui.step3_heading')}</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <ProgramDetail key={`${goalType}-${weekDuration}`} goalId={goalType} weeks={weekDuration} />
        </section>
      )}

      {/* Empty state */}
      {!goalType && (
        <div className="py-20 text-center">
          <div className="text-6xl mb-4 opacity-30">🗂️</div>
          <p className="text-muted text-lg">{tP('ui.empty_goal')}</p>
        </div>
      )}
      {goalType && !weekDuration && (
        <div className="py-16 text-center">
          <div className={`text-6xl mb-4 ${selectedGoal?.text}`}>{selectedGoal?.icon}</div>
          <p className="text-muted text-lg">{tP('ui.empty_weeks')}</p>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* CTA / Back to Program                       */}
      {/* ════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/20 mt-4 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="text-6xl shrink-0">🚀</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-text mb-2">{tP('cta.heading')}</h2>
            <p className="text-muted text-lg leading-relaxed">{tP('cta.desc')}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/program"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-accent/30 text-text text-lg font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              {tP('cta.btn_program')}
            </Link>
            <Link
              to="/pillar/a"
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-lg shadow-[0_0_24px_rgba(34,197,94,0.20)] hover:shadow-[0_0_36px_rgba(34,197,94,0.35)] hover:-translate-y-0.5"
            >
              {tP('cta.btn_start')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
