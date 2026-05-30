import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const NAV_COL = [
  { to:'/',              key:'nav.home'    },
  { to:'/pillars',       key:'nav.pillars' },
  { to:'/program',       key:'nav.program' },
  { to:'/videos',        key:'nav.videos'  },
];
const NAV_COL2 = [
  { to:'/contact',       key:'nav.contact' },
  { to:'/donate',        key:'nav.donate'  },
];

const PILLARS_QUICK = [
  { to:'/pillar/a', label:'Vận Động & Tập Luyện',  color:'#22c55e' },
  { to:'/pillar/b', label:'Dinh Dưỡng & Thực Đơn', color:'#84cc16' },
  { to:'/pillar/c', label:'Lối Sống Khỏe',          color:'#14b8a6' },
  { to:'/pillar/d', label:'Tâm Trí An Nhiên',       color:'#a855f7' },
  { to:'/pillar/e', label:'Kiến Thức Sức Khỏe',    color:'#3b82f6' },
  { to:'/pillar/f', label:'Công Cụ & Tài Nguyên',  color:'#f97316' },
];

export default function Layout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10 md:px-8">
        {children}
      </main>

      <footer className="relative mt-10 border-t border-border/40">
        {/* top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

        {/* ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-green-500/4 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-8">

          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

            {/* Col 1 — Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                <span className="text-2xl">🌿</span>
                <div>
                  <span className="font-bold text-text text-base">{t('brand.part1')}</span>
                  <span className="text-accent font-bold text-base"> & </span>
                  <span className="font-bold text-text text-base">{t('brand.part2')}</span>
                </div>
              </Link>
              <p className="text-muted text-xs leading-relaxed mb-5 max-w-[220px]">
                Hệ sinh thái sống khỏe khoa học, đơn giản, dễ áp dụng mỗi ngày — hoàn toàn miễn phí.
              </p>
              {/* contact quick */}
              <div className="flex flex-col gap-2">
                <a href="mailto:nguyentanducchatgpt@gmail.com"
                   className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors duration-150 group/c">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/4 group-hover/c:bg-accent/10 transition-colors duration-150 text-sm">✉️</span>
                  nguyentanducchatgpt@gmail.com
                </a>
                <div className="inline-flex items-center gap-2 text-xs text-muted">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/4 text-sm">📱</span>
                  Zalo: 0913723667
                </div>
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4">Điều Hướng</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {[...NAV_COL, ...NAV_COL2].map(({ to, key }) => (
                  <Link key={to} to={to}
                    className="text-xs text-muted hover:text-accent transition-colors duration-150 flex items-center gap-1.5 group/n">
                    <span className="w-1 h-1 rounded-full bg-border group-hover/n:bg-accent transition-colors duration-150 shrink-0" />
                    {t(key)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Col 3 — 6 Pillars */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4">6 Trụ Cột</p>
              <div className="flex flex-col gap-2">
                {PILLARS_QUICK.map(p => (
                  <Link key={p.to} to={p.to}
                    className="text-xs text-muted hover:text-text transition-colors duration-150 flex items-center gap-2 group/p">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-150 group-hover/p:scale-125" style={{ background: p.color }} />
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted/60 text-xs">{t('footer.copyright')}</p>
            <p className="text-muted/40 text-xs text-center sm:text-right whitespace-nowrap">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
