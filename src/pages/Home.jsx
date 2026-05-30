import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PillarCard from '../components/PillarCard';
import ThoughtBubble from '../components/ThoughtBubble';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(22px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const PILLAR_IMAGES = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=70',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=70',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70',
];
const COLOR_MAP = { green:'#22c55e', lime:'#84cc16', teal:'#14b8a6', purple:'#a855f7', blue:'#3b82f6', orange:'#f97316' };
const PILLAR_ROUTES = ['/pillar/a','/pillar/b','/pillar/c','/pillar/d','/pillar/e','/pillar/f'];
const PILLAR_ICONS  = ['🏃','🥗','🌿','🧘','📚','🛠️'];

const STAT_TIPS = [
  '10 phút/ngày đủ để bắt đầu xây thói quen. Não cần tính nhất quán — 10 phút × 30 ngày hiệu quả hơn 3 giờ × 1 lần/tuần.',
  '6 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ. Hệ thống đảm bảo không bỏ sót góc độ nào.',
  '12 tuần đủ xây nền thói quen bền vững. 3 giai đoạn: Khởi Động → Tăng Nền → Cá Nhân Hóa.',
];

const JOURNEY_CARDS = [
  { id:'7d',  label:'7 Ngày Khởi Động',  icon:'🌱', color:'#22c55e', rgb:'34,197,94',   tag:'BẮT ĐẦU',   desc:'4 trụ cột/ngày · 20 phút · từng bước nhỏ xây thói quen đầu tiên' },
  { id:'12w', label:'12 Tuần Cơ Bản',   icon:'📈', color:'#84cc16', rgb:'132,204,22',  tag:'PHỔ BIẾN',  desc:'3 giai đoạn: Khởi Động → Xây Nền → Cá Nhân Hóa thói quen bền vững' },
  { id:'24w', label:'24 Tuần Nâng Cao', icon:'🎓', color:'#a855f7', rgb:'168,85,247',  tag:'TOÀN DIỆN', desc:'6 giai đoạn · carb cycling · supplement · làm chủ sức khỏe hoàn toàn' },
];

const WHY_ITEMS = [
  { icon:'🧬', title:'Dựa Trên Khoa Học',     desc:'Tổng hợp từ nghiên cứu y khoa tin cậy — không phải mẹo vặt hay xu hướng nhất thời',                   color:'#22c55e', rgb:'34,197,94'   },
  { icon:'⚡', title:'Đơn Giản & Thực Chiến', desc:'10 phút/ngày là đủ để bắt đầu. Mọi hướng dẫn thiết kế cho người bận rộn trong thực tế',                color:'#84cc16', rgb:'132,204,22'  },
  { icon:'🎯', title:'Lộ Trình Rõ Ràng',      desc:'7 ngày → 12 tuần → 24 tuần. Từng bước nhỏ, không bao giờ cảm thấy choáng ngợp hay bỏ cuộc',           color:'#14b8a6', rgb:'20,184,166'  },
  { icon:'🔄', title:'Toàn Diện 360°',        desc:'Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ — không bỏ sót bất kỳ góc độ nào', color:'#a855f7', rgb:'168,85,247'  },
];

const PILLARS = ['pillarA','pillarB','pillarC','pillarD','pillarE','pillarF'];

export default function Home() {
  const { t }     = useTranslation();
  const { t: tP } = useTranslation('pillars');
  const stats     = t('home.stats', { returnObjects: true });

  useEffect(() => {
    const id = 'home-title-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes htShimmer1 { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes htShimmer2 { 0%{background-position:-200% center} 100%{background-position:200% center} }
      @keyframes htAmpPulse {
        0%,100%{filter:drop-shadow(0 0 8px rgba(34,197,94,0.9));opacity:1}
        50%{filter:drop-shadow(0 0 22px rgba(34,197,94,1));opacity:0.75}
      }
      @keyframes htFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
      @keyframes htBadge { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.35)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,0)} }
      .ht-part1 {
        background: linear-gradient(110deg,#22c55e 0%,#86efac 28%,#ffffff 50%,#86efac 72%,#22c55e 100%);
        background-size: 300% 100%;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        animation: htShimmer1 5s linear infinite;
      }
      .ht-part2 {
        background: linear-gradient(110deg,#0d9488 0%,#5eead4 28%,#ffffff 50%,#5eead4 72%,#14b8a6 100%);
        background-size: 300% 100%;
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        animation: htShimmer2 6s linear infinite;
      }
      .ht-amp { -webkit-text-fill-color:#22c55e; color:#22c55e; animation: htAmpPulse 2.5s ease-in-out infinite; display:inline-block; }
      .ht-icon { animation: htFloat 3.2s ease-in-out infinite; display:inline-block; }
      .ht-badge { animation: htBadge 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }, []);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative -mx-4 md:-mx-8 mb-16 overflow-hidden" style={{ minHeight: '620px' }}>
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=70" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.10 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/30 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-25 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-green-500/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 pt-20 pb-24">
          <div className="ht-badge inline-flex items-center gap-2 bg-accent/8 border border-accent/20 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-glow-pulse" />
            {t('hero.badge')}
          </div>

          <div className="ht-icon text-5xl md:text-6xl mb-5">🌿</div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight animate-fade-in-up mb-3">
            <span className="ht-part1">Sức Khỏe</span>
            <span className="ht-amp"> &amp; </span>
            <span className="ht-part2">Đời Sống</span>
          </h1>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50 mb-4">
            <span className="inline-block w-8 h-px bg-gradient-to-r from-transparent to-border" />
            healthandlifestyle.io.vn
            <span className="inline-block w-8 h-px bg-gradient-to-l from-transparent to-border" />
          </div>

          <p className="mt-1 text-base md:text-lg max-w-xl mx-auto leading-relaxed text-muted/80 animate-fade-in-up stagger-2">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up stagger-3">
            <a href="#pillars" className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:-translate-y-0.5">
              {t('hero.cta')} <span>↓</span>
            </a>
            <Link to="/program" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-accent/40 hover:border-accent text-accent hover:bg-accent/8 font-semibold rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5">
              {t('nav.program')} <span>→</span>
            </Link>
          </div>

          {Array.isArray(stats) && (
            <div className="mt-14 grid grid-cols-3 gap-4 w-full max-w-2xl">
              {stats.map((stat, i) => (
                <div key={i} className="group/hstat relative text-center">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/hstat:opacity-100 scale-90 group-hover/hstat:scale-100 -translate-y-1 group-hover/hstat:translate-y-0 transition-all duration-200 origin-bottom">
                    <ThoughtBubble text={STAT_TIPS[i]} idx={`h${i}`} color="#22c55e" />
                  </div>
                  <p className="text-gradient font-extrabold text-xl md:text-2xl cursor-default">{stat.value}</p>
                  <p className="text-muted text-[11px] mt-1 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Visual image strip ─────────────────────────── */}
      <div className="overflow-x-auto scrollbar-hide mb-16 -mx-4 md:-mx-8 px-4 md:px-8">
        <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
          {PILLARS.map((key, i) => {
            const p = tP(key, { returnObjects: true });
            const color = COLOR_MAP[p?.color] || '#22c55e';
            return (
              <Link key={key} to={PILLAR_ROUTES[i]} className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer" style={{ width: '180px', height: '220px' }}>
                <img src={PILLAR_IMAGES[i]} alt={p?.title || key} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-xl mb-1">{PILLAR_ICONS[i]}</div>
                  <p className="text-white text-xs font-bold leading-snug">{p?.title || key}</p>
                </div>
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Journey teaser ─────────────────────────────── */}
      <RevealBlock className="mb-16">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Hành Trình Sống Khỏe</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text">Bắt Đầu Từ Đâu?</h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">Chọn hành trình phù hợp — từ 7 ngày thử thách đến 24 tuần làm chủ sức khỏe</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {JOURNEY_CARDS.map((j, idx) => (
            <Link key={j.id} to="/program"
              className="block relative rounded-2xl border p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ borderColor: `rgba(${j.rgb},0.20)`, background: `rgba(${j.rgb},0.04)`, transitionDelay: `${idx * 60}ms` }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse at top left, rgba(${j.rgb},0.12), transparent 65%)` }} />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{j.icon}</span>
                  <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full border" style={{ color: j.color, borderColor: `rgba(${j.rgb},0.35)`, background: `rgba(${j.rgb},0.1)` }}>{j.tag}</span>
                </div>
                <h3 className="font-bold text-text text-sm mb-1.5">{j.label}</h3>
                <p className="text-xs text-muted leading-relaxed">{j.desc}</p>
                <div className="mt-4 text-[11px] font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: j.color }}>Xem chi tiết <span>→</span></div>
              </div>
            </Link>
          ))}
        </div>
      </RevealBlock>

      {/* ── 6 Pillars grid ─────────────────────────────── */}
      <section id="pillars" className="mb-20 scroll-mt-20">
        <RevealBlock className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text">
            {(() => {
              const title = t('hero.pillars_title');
              const idx = title.lastIndexOf('360');
              if (idx === -1) return title;
              return <>{title.slice(0, idx)}<span className="sk360-num">360</span></>;
            })()}
          </h2>
          <div className="mt-3 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          <p className="text-muted text-sm mt-3 max-w-lg mx-auto">Hệ thống sức khỏe toàn diện — mỗi trụ cột là một góc độ không thể thiếu cho cuộc sống khỏe mạnh</p>
        </RevealBlock>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PILLARS.map((key, i) => (
            <PillarCard key={key} pillarKey={key} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ── Why section ────────────────────────────────── */}
      <section className="mb-16">
        <RevealBlock className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Tại Sao Chọn Chúng Tôi</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text">Khoa Học · Đơn Giản · Hiệu Quả</h2>
        </RevealBlock>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WHY_ITEMS.map((item, i) => (
            <RevealBlock key={item.title} delay={i * 90} className="rounded-2xl border border-border bg-surface p-5 transition-all duration-300 group cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{ background: `rgba(${item.rgb},0.10)`, border: `1px solid rgba(${item.rgb},0.20)` }}>{item.icon}</div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: item.color }}>{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── Quote ──────────────────────────────────────── */}
      <RevealBlock className="mb-12">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-teal-500/5 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
          <div className="relative border border-accent/15 rounded-3xl p-10 md:p-14 text-center">
            <span className="text-5xl text-accent/20 font-serif leading-none select-none block mb-2">"</span>
            <p className="text-text text-xl md:text-2xl font-medium leading-relaxed">{t('home.quote')}</p>
            <p className="text-muted text-sm mt-5 font-medium">{t('home.quote_author')}</p>
            <div className="mt-8 flex justify-center">
              <Link to="/program" className="inline-flex items-center gap-2 px-7 py-3 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:-translate-y-0.5">
                Bắt Đầu Hành Trình →
              </Link>
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── Footer CTA ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-10 mb-6">
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm">
          ✉️ {t('nav.contact')}
        </Link>
        <Link to="/donate" className="inline-flex items-center gap-2 px-6 py-2.5 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm">
          🙏 {t('nav.donate')}
        </Link>
      </div>
    </div>
  );
}
