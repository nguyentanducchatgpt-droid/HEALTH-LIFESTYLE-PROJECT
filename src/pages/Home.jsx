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
  '10 phút mỗi ngày là điểm khởi đầu hoàn hảo. Nhất quán mỗi ngày hiệu quả hơn tập luyện cường độ cao nhưng bỏ giữa chừng.',
  'Hệ thống Sống Khỏe 360° bao phủ toàn diện 6 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ — phù hợp mọi lứa tuổi.',
  'Hành trình 3 cấp độ: 7 ngày khởi động → 12 tuần xây nền → 24 tuần nâng cao. Từng bước rõ ràng, không bao giờ cảm thấy choáng ngợp.',
];
const STAT_COLORS = ['#22c55e', '#14b8a6', '#a855f7'];
const STAT_RGBS   = ['34,197,94', '20,184,166', '168,85,247'];

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
  const stats        = t('home.stats', { returnObjects: true });
  const heroRef      = useRef(null);
  const [mousePos,   setMousePos]   = useState({ x: 0.5, y: 0.5 });
  const [hoveredStat, setHoveredStat] = useState(null);

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
      @keyframes htScan { 0%{top:0%;opacity:0} 8%{opacity:1} 92%{opacity:0.6} 100%{top:100%;opacity:0} }
      @keyframes htBtnSweep { 0%{transform:translateX(-130%) skewX(-14deg)} 100%{transform:translateX(260%) skewX(-14deg)} }
      @keyframes htScrollBall { 0%,100%{transform:translateY(-3px);opacity:0.15} 55%{transform:translateY(9px);opacity:0.9} }
      @keyframes htRingPulse { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.18)} }
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
      .ht-icon-ring { animation: htRingPulse 3s ease-in-out infinite; }
      .ht-scan { animation: htScan 8s ease-in-out infinite 1s; }
      .ht-btn-sweep { background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.28) 50%,transparent 100%); animation: htBtnSweep 3.2s ease-in-out infinite; }
      .ht-scroll-ball { animation: htScrollBall 1.8s ease-in-out infinite; }
      .ht-btn-primary { box-shadow:0 0 32px rgba(34,197,94,0.28),0 4px 20px rgba(0,0,0,0.4); transition:box-shadow 0.25s,transform 0.2s; }
      .ht-btn-primary:hover { box-shadow:0 0 55px rgba(34,197,94,0.48),0 8px 28px rgba(0,0,0,0.5); transform:translateY(-2px); }
      .ht-btn-outline { border:1px solid rgba(34,197,94,0.32); color:#22c55e; background:rgba(34,197,94,0.04); transition:border-color 0.2s,background 0.2s,transform 0.2s,box-shadow 0.2s; }
      .ht-btn-outline:hover { border-color:rgba(34,197,94,0.65); background:rgba(34,197,94,0.1); transform:translateY(-2px); box-shadow:0 0 22px rgba(34,197,94,0.14); }
      .ht-btn-arrow { display:inline-block; transition:transform 0.2s; }
      .ht-btn-outline:hover .ht-btn-arrow { transform:translateX(4px); }
    `;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────── */}
      <section ref={heroRef} className="relative -mx-4 md:-mx-8 mb-16 overflow-hidden" style={{ minHeight: '700px' }}>
        {/* BG image */}
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=70" alt=""
          className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/15 via-bg/45 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 via-transparent to-bg/80 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-18 pointer-events-none" />

        {/* Mouse-tracking ambient glows */}
        <div className="absolute w-[820px] h-[820px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 65%)',
            filter: 'blur(140px)',
            top: `calc(${mousePos.y * 100}% - 410px)`,
            left: `calc(${mousePos.x * 100}% - 410px)`,
            transition: 'top 0.9s cubic-bezier(0.2,0,0.2,1), left 0.9s cubic-bezier(0.2,0,0.2,1)',
          }} />
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 65%)',
            filter: 'blur(110px)',
            top: `calc(${(1 - mousePos.y) * 75 + 12}% - 250px)`,
            left: `calc(${(1 - mousePos.x) * 75 + 12}% - 250px)`,
            transition: 'top 1.3s cubic-bezier(0.2,0,0.2,1), left 1.3s cubic-bezier(0.2,0,0.2,1)',
          }} />

        {/* Scan line */}
        <div className="ht-scan absolute w-full h-[1px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(34,197,94,0.13) 25%,rgba(34,197,94,0.22) 50%,rgba(34,197,94,0.13) 75%,transparent 100%)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 pt-24 pb-28">

          {/* Icon with ambient glow ring */}
          <div className="relative mb-5">
            <div className="ht-icon-ring absolute inset-0 rounded-full pointer-events-none"
              style={{ background: 'rgba(34,197,94,0.1)', filter: 'blur(24px)', transform: 'scale(2.8)' }} />
            <div className="ht-icon relative z-10 select-none">
              <img src="/logo.png" alt="" className="h-16 w-16 md:h-20 md:w-20" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-3">
            <span className="ht-part1">Sức Khỏe</span>
            <span className="ht-amp"> &amp; </span>
            <span className="ht-part2">Đời Sống</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.52)' }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#pillars"
              className="ht-btn-primary relative overflow-hidden inline-flex items-center justify-center gap-2 px-9 py-3.5 bg-accent text-bg font-bold rounded-xl text-sm cursor-pointer">
              <span className="ht-btn-sweep absolute inset-0 pointer-events-none" />
              <span className="relative z-10">{t('hero.cta')}</span>
              <span className="relative z-10 text-base">↓</span>
            </a>
            <Link to="/program"
              className="ht-btn-outline inline-flex items-center justify-center gap-2 px-9 py-3.5 font-semibold rounded-xl text-sm">
              {t('nav.program')} <span className="ht-btn-arrow">→</span>
            </Link>
          </div>

          {/* Stats row */}
          {Array.isArray(stats) && (
            <div className="mt-14 w-full max-w-3xl mx-auto">
              <div className="flex items-stretch rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.052)' }}>
                {stats.map((stat, i) => {
                  const active = hoveredStat === i;
                  const color  = STAT_COLORS[i];
                  const rgb    = STAT_RGBS[i];
                  return (
                    <div key={i}
                      className="group/hstat relative flex-1 text-center px-4 py-5 cursor-default overflow-hidden"
                      style={{ transition: 'background 0.3s' }}
                      onMouseEnter={() => setHoveredStat(i)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      {/* Radial hover bg */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 50% 80%, rgba(${rgb},0.11) 0%, transparent 72%)`,
                          opacity: active ? 1 : 0,
                          transition: 'opacity 0.3s',
                        }} />

                      {/* Vertical divider */}
                      {i > 0 && (
                        <div className="absolute left-0 top-[20%] bottom-[20%] w-px pointer-events-none"
                          style={{
                            background: active ? `rgba(${rgb},0.3)` : 'rgba(255,255,255,0.07)',
                            transition: 'background 0.3s',
                          }} />
                      )}

                      {/* Bottom sweep bar */}
                      <div className="absolute bottom-0 left-0 h-[2px] pointer-events-none rounded-full"
                        style={{
                          width: active ? '100%' : '0%',
                          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                          transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
                        }} />

                      {/* ThoughtBubble tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/hstat:opacity-100 scale-90 group-hover/hstat:scale-100 -translate-y-1 group-hover/hstat:translate-y-0 transition-all duration-200 origin-bottom">
                        <ThoughtBubble text={STAT_TIPS[i]} idx={`h${i}`} color={color} />
                      </div>

                      {/* Value */}
                      <p className="font-extrabold text-base md:text-lg leading-none mb-1.5 transition-all duration-250 whitespace-nowrap"
                        style={{
                          color: active ? color : 'rgba(255,255,255,0.9)',
                          filter: active ? `drop-shadow(0 0 10px rgba(${rgb},0.55))` : 'none',
                          transform: active ? 'scale(1.07)' : 'scale(1)',
                          display: 'block',
                        }}>
                        {stat.value}
                      </p>

                      {/* Label */}
                      <p className="text-[11px] leading-snug transition-colors duration-250"
                        style={{ color: active ? `rgba(${rgb},0.75)` : 'rgba(255,255,255,0.36)' }}>
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scroll indicator */}
          <div className="mt-10 flex flex-col items-center opacity-30 select-none">
            <div className="w-[1.5px] h-5 rounded-full overflow-hidden relative" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <div className="ht-scroll-ball absolute top-0 inset-x-0 h-2.5 rounded-full bg-accent" />
            </div>
          </div>
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

      {/* ── Closing — Quote + CTA (merged) ────────────── */}
      <RevealBlock className="mb-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/7 via-transparent to-purple-500/4 pointer-events-none" />
          <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
          <div className="absolute top-0 left-1/3 w-[400px] h-[300px] bg-green-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-teal-500/4 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative border border-accent/12 rounded-3xl px-8 py-12 md:py-16 text-center">
            {/* Quote */}
            <div className="mb-10">
              <span className="text-6xl leading-none select-none font-serif" style={{ color: 'rgba(34,197,94,0.18)' }}>"</span>
              <p className="text-text text-2xl md:text-3xl font-semibold leading-relaxed -mt-3 max-w-2xl mx-auto">
                {t('home.quote')}
              </p>
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent/40" />
                <p className="text-muted/70 text-xs font-medium tracking-wide">{t('home.quote_author')}</p>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent/40" />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-10 max-w-xs mx-auto" />

            {/* CTA */}
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-5">Bắt Đầu Ngay Hôm Nay</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/program"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg font-bold rounded-xl transition-all duration-200 text-sm shadow-[0_0_28px_rgba(34,197,94,0.28)] hover:shadow-[0_0_42px_rgba(34,197,94,0.45)] hover:-translate-y-0.5"
              >
                🌿 Xem Hành Trình
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border hover:border-accent/40 text-muted hover:text-accent rounded-xl transition-all duration-200 text-sm"
              >
                ✉️ {t('nav.contact')}
              </Link>
            </div>
          </div>
        </div>
      </RevealBlock>
    </div>
  );
}
