import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

// strip thumbnails (horizontal scroll)
const STRIP_IMAGES = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&q=70',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=70',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70',
];
const PILLAR_ROUTES = ['/pillar/a','/pillar/b','/pillar/c','/pillar/d','/pillar/e','/pillar/f'];
const PILLAR_ICONS  = ['🏃','🥗','🌿','🧘','📚','🛠️'];

// rich card data with context-matched images
const PILLAR_DATA = [
  { key:'pillarA', route:'/pillar/a', color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700&q=75' },
  { key:'pillarB', route:'/pillar/b', color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=75' },
  { key:'pillarC', route:'/pillar/c', color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=75' },
  { key:'pillarD', route:'/pillar/d', color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=75' },
  { key:'pillarE', route:'/pillar/e', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&q=75' },
  { key:'pillarF', route:'/pillar/f', color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=700&q=75' },
];

const COLOR_MAP = { green:'#22c55e', lime:'#84cc16', teal:'#14b8a6', purple:'#a855f7', blue:'#3b82f6', orange:'#f97316' };

const STAT_TIPS = [
  '10 phút/ngày đủ để bắt đầu xây thói quen. Não cần tính nhất quán — 10 phút × 30 ngày hiệu quả hơn 3 giờ × 1 lần/tuần.',
  '6 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ. Hệ thống đảm bảo không bỏ sót góc độ nào.',
  '12 tuần đủ xây nền thói quen bền vững. 3 giai đoạn: Khởi Động → Tăng Nền → Cá Nhân Hóa.',
];

const JOURNEY_CARDS = [
  {
    id:'7d', num:'01', label:'7 Ngày Khởi Động', icon:'🌱',
    color:'#22c55e', rgb:'34,197,94', tag:'BẮT ĐẦU',
    img:'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=700&q=75',
    tagline:'Nhẹ nhàng · Từng bước · Không áp lực',
    desc:'Bắt đầu từ con số 0 — 20 phút mỗi ngày tích hợp đủ 4 trụ cột. Đơn giản đến mức không thể từ chối.',
    features:['Vận động 20 phút/ngày','Dinh dưỡng không kiêng cực đoan','Giấc ngủ & thói quen sáng','3 hơi thở sâu mỗi ngày'],
  },
  {
    id:'12w', num:'02', label:'12 Tuần Cơ Bản', icon:'📈',
    color:'#84cc16', rgb:'132,204,22', tag:'PHỔ BIẾN',
    img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=75',
    tagline:'Có cấu trúc · 3 giai đoạn · Thay đổi thật sự',
    desc:'Khởi Động → Xây Nền → Cá Nhân Hóa. 12 tuần đủ để não bộ hình thành thói quen bền vững vĩnh viễn.',
    features:['Khởi Động tuần 1–4','Xây Nền tuần 5–8','Cá Nhân Hóa tuần 9–12','Test tiến bộ tuần 4 & 12'],
  },
  {
    id:'24w', num:'03', label:'24 Tuần Nâng Cao', icon:'🎓',
    color:'#a855f7', rgb:'168,85,247', tag:'TOÀN DIỆN',
    img:'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=75',
    tagline:'6 giai đoạn · Carb cycling · Làm chủ hoàn toàn',
    desc:'Từ nền tảng đến làm chủ hệ thống sức khỏe cá nhân. 24 tuần biến thói quen thành bản sắc không thể đảo ngược.',
    features:['Nền tảng 12 tuần đầu','Tối ưu hóa 12 tuần sau','Carb cycling & supplement','Tự lập kế hoạch cá nhân'],
  },
];

const WHY_ITEMS = [
  { icon:'🧬', title:'Dựa Trên Khoa Học',     stat:'Evidence',  statSub:'Based',
    desc:'Tổng hợp từ nghiên cứu y khoa tin cậy — không phải mẹo vặt hay xu hướng nhất thời.',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=75' },
  { icon:'⚡', title:'Đơn Giản & Thực Chiến', stat:'10',        statSub:'phút/ngày',
    desc:'10 phút mỗi ngày là đủ để bắt đầu. Mọi hướng dẫn thiết kế riêng cho người bận rộn.',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=75' },
  { icon:'🎯', title:'Lộ Trình Rõ Ràng',      stat:'3',         statSub:'mốc tiến bộ',
    desc:'7 ngày → 12 tuần → 24 tuần. Từng bước nhỏ, không bao giờ cảm thấy choáng ngợp hay bỏ cuộc.',
    color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=75' },
  { icon:'🔄', title:'Toàn Diện 360°',        stat:'6',         statSub:'trụ cột',
    desc:'Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ — không bỏ sót bất kỳ góc độ nào.',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=75' },
];

const PILLARS_KEYS = ['pillarA','pillarB','pillarC','pillarD','pillarE','pillarF'];

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
          {PILLARS_KEYS.map((key, i) => {
            const p = tP(key, { returnObjects: true });
            const color = COLOR_MAP[p?.color] || '#22c55e';
            return (
              <Link key={key} to={PILLAR_ROUTES[i]} className="relative rounded-2xl overflow-hidden shrink-0 group cursor-pointer" style={{ width: '180px', height: '220px' }}>
                <img src={STRIP_IMAGES[i]} alt={p?.title || key} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
      <section className="mb-20">
        <RevealBlock className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Hành Trình Sống Khỏe</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text">Bắt Đầu Từ Đâu?</h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">Chọn hành trình phù hợp — từ 7 ngày thử thách đến 24 tuần làm chủ sức khỏe</p>
        </RevealBlock>

        <div className="flex flex-col gap-5">
          {JOURNEY_CARDS.map((j, idx) => (
            <RevealBlock key={j.id} delay={idx * 100}>
              <Link
                to="/program"
                className="group block rounded-2xl border overflow-hidden transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                style={{ borderColor: `rgba(${j.rgb},0.18)`, background: `rgba(${j.rgb},0.03)` }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* ── Image panel ── */}
                  <div className="relative md:w-[38%] shrink-0" style={{ minHeight: '220px' }}>
                    <img
                      src={j.img}
                      alt={j.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {/* gradients */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60 md:hidden" />
                    <div className="absolute inset-0 hidden md:block" style={{ background: `linear-gradient(to right, transparent 40%, rgba(${j.rgb},0.08) 100%), linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.5))` }} />
                    {/* color top line */}
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ background: `linear-gradient(90deg, ${j.color}, rgba(${j.rgb},0.4))` }} />
                    {/* big number watermark */}
                    <div className="absolute bottom-2 right-3 font-black leading-none select-none pointer-events-none" style={{ fontSize: '72px', color: `rgba(${j.rgb},0.18)` }}>{j.num}</div>
                    {/* tag badge */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] px-3 py-1 rounded-full backdrop-blur-sm" style={{ color: j.color, background: 'rgba(0,0,0,0.55)', border: `1px solid rgba(${j.rgb},0.5)` }}>{j.tag}</span>
                    </div>
                    {/* icon bottom-left mobile */}
                    <div className="absolute bottom-4 left-4 md:hidden text-3xl">{j.icon}</div>
                  </div>

                  {/* ── Content panel ── */}
                  <div className="flex-1 p-6 md:p-7 flex flex-col justify-center">
                    {/* icon + tagline */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="hidden md:block text-2xl">{j.icon}</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: j.color }}>{j.tagline}</p>
                    </div>
                    {/* title */}
                    <h3 className="font-bold text-text text-lg md:text-xl mb-2 leading-tight transition-colors duration-200" style={{ color: j.color }}>
                      {j.label}
                    </h3>
                    {/* description */}
                    <p className="text-sm text-muted leading-relaxed mb-5 max-w-xl">{j.desc}</p>
                    {/* feature checklist */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-6">
                      {j.features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-xs text-muted">
                          <span className="font-bold shrink-0" style={{ color: j.color }}>✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all duration-200" style={{ color: j.color }}>
                      Xem hành trình
                      <span className="group-hover:translate-x-1 transition-transform duration-200 text-base">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </RevealBlock>
          ))}
        </div>
      </section>

      {/* ── 6 Pillars — rich image cards ───────────────── */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLAR_DATA.map((pd, i) => {
            const p = tP(pd.key, { returnObjects: true });
            if (!p || typeof p !== 'object') return null;
            return (
              <RevealBlock key={pd.key} delay={i * 70}>
                <Link
                  to={pd.route}
                  className="block group rounded-2xl bg-surface border transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                  style={{ borderColor: `rgba(${pd.rgb},0.14)` }}
                >
                  {/* Image */}
                  <div className="relative rounded-t-2xl overflow-hidden" style={{ height: '176px' }}>
                    <img
                      src={pd.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
                    />
                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {/* hover overlay tint */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `linear-gradient(to top, rgba(${pd.rgb},0.25), transparent 60%)` }} />
                    {/* animated top line */}
                    <div className="absolute top-0 left-0 h-[2.5px] w-0 group-hover:w-full transition-all duration-500 ease-out rounded-t-2xl" style={{ background: pd.color }} />
                    {/* subtitle badge bottom-left */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ color: pd.color, background: 'rgba(0,0,0,0.55)', border: `1px solid rgba(${pd.rgb},0.45)` }}>
                        {p.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `rgba(${pd.rgb},0.12)`, border: `1px solid rgba(${pd.rgb},0.22)` }}
                      >
                        {p.icon}
                      </div>
                      <h3 className="font-bold text-sm leading-tight transition-colors duration-200" style={{ color: pd.color }}>
                        {p.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold transition-all duration-200 group-hover:gap-2.5" style={{ color: pd.color }}>
                      Tìm Hiểu Thêm
                      <span className="transition-transform duration-200 group-hover:translate-x-0.5 text-xs">→</span>
                    </div>
                  </div>
                </Link>
              </RevealBlock>
            );
          })}
        </div>
      </section>

      {/* ── Why section ────────────────────────────────── */}
      <section className="mb-20">
        <RevealBlock className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Tại Sao Chọn Chúng Tôi</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text">Khoa Học · Đơn Giản · Hiệu Quả</h2>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">Bốn nguyên tắc cốt lõi làm nền tảng cho mọi nội dung trên trang web này</p>
        </RevealBlock>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {WHY_ITEMS.map((item, i) => (
            <RevealBlock key={item.title} delay={i * 90}>
              <div
                className="group rounded-2xl border overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.4)]"
                style={{ borderColor: `rgba(${item.rgb},0.16)`, background: `rgba(${item.rgb},0.03)` }}
              >
                {/* Image strip */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    style={{ opacity: 0.45 }}
                  />
                  {/* dark + color gradient overlay */}
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.75) 30%, rgba(${item.rgb},0.25) 100%)` }} />
                  {/* hover tint */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: `rgba(${item.rgb},0.10)` }} />
                  {/* animated top line */}
                  <div className="absolute top-0 left-0 h-[2.5px] w-0 group-hover:w-full transition-all duration-500 ease-out" style={{ background: item.color }} />

                  {/* Big stat — top right */}
                  <div className="absolute top-5 right-5 text-right">
                    <div className="font-black leading-none" style={{ fontSize: '44px', color: item.color, textShadow: `0 0 30px rgba(${item.rgb},0.6)` }}>
                      {item.stat}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: `rgba(${item.rgb === '34,197,94' ? '255,255,255' : '255,255,255'},0.55)` }}>
                      {item.statSub}
                    </div>
                  </div>

                  {/* Icon badge — bottom left */}
                  <div
                    className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `rgba(${item.rgb},0.22)`, border: `1.5px solid rgba(${item.rgb},0.5)` }}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-sm mb-2 transition-colors duration-200" style={{ color: item.color }}>
                    {item.title}
                  </h3>
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

      {/* ── Final CTA ──────────────────────────────────── */}
      <RevealBlock className="mb-6">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/6 via-transparent to-purple-500/5 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative border border-border/50 rounded-3xl px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Sẵn Sàng Chưa?</p>
              <h2 className="text-xl md:text-2xl font-bold text-text mb-2">Hành Trình Bắt Đầu Từ Hôm Nay</h2>
              <p className="text-muted text-sm max-w-sm leading-relaxed">Mỗi thay đổi lớn đều bắt đầu từ một quyết định nhỏ. Bước đầu tiên luôn là dễ nhất.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/program"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_24px_rgba(34,197,94,0.25)] hover:shadow-[0_0_36px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 whitespace-nowrap">
                🌿 Bắt Đầu Hành Trình
              </Link>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm whitespace-nowrap">
                ✉️ {t('nav.contact')}
              </Link>
            </div>
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}
