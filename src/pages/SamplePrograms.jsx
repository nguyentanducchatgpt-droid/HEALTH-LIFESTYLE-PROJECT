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

/* ── useInView hook for scroll-triggered animation ── */
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
  if (!goal || !curPhase) return null;

  const phIdx = activePhs.length - 1;
  const pCol  = PHASE_COLORS[phIdx] || PHASE_COLORS[0];

  return (
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
                {goal.icon} {goal.title}
              </span>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60">
                {curPhase.intensity}
              </span>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${pCol.bar} text-bg`}>
                {curPhase.tag}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {weeks} tuần · {curPhase.name}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-lg">{curPhase.desc}</p>
          </div>

          {/* Right: week position */}
          <div className="shrink-0 text-right">
            <div className="text-white/30 text-xs mb-1 uppercase tracking-widest">Tuần hiện tại</div>
            <div className={`text-6xl font-black ${goal.text}`}>{weeks}</div>
            <div className="text-white/40 text-xs">/ 24</div>
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
                    {ph.icon} {ph.name}
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
            <div className={`w-10 h-10 rounded-xl ${goal.bg} border ${goal.border} flex items-center justify-center text-xl`}>
              {curPhase.icon}
            </div>
            <div>
              <h3 className={`font-bold ${goal.text}`}>{curPhase.name}</h3>
              <p className="text-[11px] text-muted">Tuần {curPhase.range[0]}–{Math.min(curPhase.range[1], weeks)}</p>
            </div>
          </div>
          <div className="bg-bg/60 rounded-xl p-4 border border-border/40">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">🏋️ Tập trọng tâm</p>
            <p className="text-sm text-text leading-relaxed">{curPhase.focus}</p>
          </div>
        </div>

        {/* Nutrition + milestone stacked */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-border bg-surface p-4">
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">🥗 Dinh dưỡng</p>
            <p className="text-xs text-text leading-relaxed">{curPhase.nutrition}</p>
          </div>
          <div className={`rounded-2xl border ${goal.border} bg-surface p-4`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${goal.text}`}>🏁 Mốc đánh dấu</p>
            <p className="text-xs text-text leading-relaxed">{curPhase.milestone}</p>
          </div>
        </div>
      </div>

      {/* ── Weekly schedule ── */}
      <div>
        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-px h-4 bg-border" />
          Lịch mẫu 1 tuần
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {sched.map((s, i) => {
            const img = SCHEDULE_IMAGES[s.icon];
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border hover:border-border-bright bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
                style={{ animationDelay: `${i * 60}ms` }}
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
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                )}
                {/* Text */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-text leading-tight mb-1 group-hover:text-accent transition-colors duration-200">{s.type}</p>
                  <p className="text-[10px] text-muted leading-snug">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*  Main page                                       */
/* ─────────────────────────────────────────────── */
export default function SamplePrograms() {
  const { t }                = useTranslation();
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

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ════════════════════════════════════════════ */}
      {/* HERO                                         */}
      {/* ════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative -mx-4 md:-mx-8 overflow-hidden mb-16"
        style={{ minHeight: 440 }}
      >
        {/* Background mosaic of fitness images */}
        <div className="absolute inset-0 grid grid-cols-3 gap-0">
          {[
            'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=50',
            'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=50',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=50',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" style={{ opacity: 0.15 }} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/60 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />

        {/* Accent orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div
          className={`relative z-10 px-4 md:px-8 pt-16 pb-14 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('nav.sample_programs') || 'Lộ trình mẫu'}
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-text leading-[1.05] mb-4">
            Tìm lộ trình<br />
            <span className="text-gradient">phù hợp bạn</span>
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-lg mb-8">
            6 mục tiêu · 24 tuần · Mỗi lộ trình được xây dựng theo nguyên tắc:
            tập đúng form trước, tăng volume sau, cá nhân hóa theo tiến bộ.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon:'🎯', n:'6',  label:'Mục tiêu' },
              { icon:'📅', n:'24', label:'Tuần mẫu' },
              { icon:'📋', n:'6',  label:'Loại lịch' },
              { icon:'⏱️', n:'10+',label:'Phút/ngày' },
            ].map(s => (
              <div key={s.n} className="flex items-center gap-2.5 bg-surface/70 backdrop-blur-sm border border-border px-4 py-2.5 rounded-xl">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <span className="text-gradient font-extrabold text-base block leading-none">{s.n}</span>
                  <span className="text-muted text-[10px] leading-none">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted/40 text-[10px] uppercase tracking-widest animate-bounce">
            <span>Chọn mục tiêu</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* STEP 1 — Goal selector                      */}
      {/* ════════════════════════════════════════════ */}
      <section ref={step1Ref} className="mb-16">
        <div className={`transition-all duration-700 ${step1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-black flex items-center justify-center">1</span>
              <h2 className="text-xl font-bold text-text">Bạn muốn đạt được gì?</h2>
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
                      {card?.tag}
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
                          {card.badge}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300 inline-block">{g.icon}</p>
                        <h3 className="font-black text-lg text-white leading-tight">{g.title}</h3>
                        <p className="text-xs text-white/60 mt-0.5">{g.subtitle}</p>
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
              <span className={`w-8 h-8 rounded-full border text-sm font-black flex items-center justify-center ${selectedGoal?.bg} ${selectedGoal?.border} ${selectedGoal?.text}`}>2</span>
              <h2 className="text-xl font-bold text-text">Bạn có bao nhiêu tuần?</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            {weekDuration && (
              <span className={`text-sm font-bold ${selectedGoal?.text}`}>{weekDuration} tuần đã chọn</span>
            )}
          </div>

          {/* Selected goal summary card */}
          <div className={`relative overflow-hidden rounded-2xl border ${selectedGoal?.border} ${selectedGoal?.bg} p-4 mb-6 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 border ${selectedGoal?.border}`}>
              <img src={selectedCard?.heroImg} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${selectedGoal?.text}`}>{selectedGoal?.icon} {selectedGoal?.title}</p>
              <p className="text-xs text-muted">{selectedGoal?.subtitle} · {selectedGoal?.rpe}</p>
            </div>
            <button
              type="button"
              onClick={() => { setGoalType(null); setWeekDuration(null); }}
              className="shrink-0 text-xs text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border hover:border-border-bright transition-colors duration-150"
            >
              Đổi
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
                  className={`relative group aspect-square rounded-xl text-xs font-bold transition-all duration-200 border flex flex-col items-center justify-center overflow-hidden ${
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

                  <span className="text-sm font-black leading-none">{w}</span>
                  <span className={`text-[8px] font-normal leading-none mt-0.5 ${isActive ? selectedGoal?.text : 'text-muted/40'}`}>T</span>

                  {/* Tooltip on hover */}
                  {ph && (isHovered && !isActive) && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-surface border border-border rounded-lg px-2 py-1 text-[9px] font-semibold text-text shadow-xl pointer-events-none">
                      {ph.icon} {ph.name}
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
                  <span className={pCol.text}>{ph.name}</span>
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
              <span className={`w-8 h-8 rounded-full border text-sm font-black flex items-center justify-center ${selectedGoal?.bg} ${selectedGoal?.border} ${selectedGoal?.text}`}>3</span>
              <h2 className="text-xl font-bold text-text">Lộ trình của bạn</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          <ProgramDetail key={`${goalType}-${weekDuration}`} goalId={goalType} weeks={weekDuration} />
        </section>
      )}

      {/* Empty state */}
      {!goalType && (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4 opacity-30">🗂️</div>
          <p className="text-muted text-sm">Chọn mục tiêu ở trên để bắt đầu</p>
        </div>
      )}
      {goalType && !weekDuration && (
        <div className="py-16 text-center">
          <div className={`text-5xl mb-4 ${selectedGoal?.text}`}>{selectedGoal?.icon}</div>
          <p className="text-muted text-sm">Chọn số tuần để xem lộ trình chi tiết</p>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* CTA / Back to Program                       */}
      {/* ════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/20 mt-4 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="text-5xl shrink-0">🚀</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-text mb-2">Sẵn sàng bắt đầu?</h2>
            <p className="text-muted text-sm leading-relaxed">Xem lộ trình 12 tuần đầy đủ, khung ngày, nhịp tuần và bộ test tiến bộ.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/program"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface border border-border hover:border-accent/30 text-text text-sm font-medium rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              ← Lộ trình 12 tuần
            </Link>
            <Link
              to="/pillar/a"
              className="btn-shimmer inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_24px_rgba(34,197,94,0.20)] hover:shadow-[0_0_36px_rgba(34,197,94,0.35)] hover:-translate-y-0.5"
            >
              Bắt đầu tập →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
