import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const NAV_COL = [
  { to:'/',              key:'nav.home'    },
  { to:'/pillars',       key:'nav.pillars' },
  { to:'/program',       key:'nav.program' },
  { to:'/videos',        key:'nav.videos'  },
  { to:'/faq',           key:'nav.faq'     },
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

  useEffect(() => {
    const id = 'ft-brand-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      .ft-wrap {
        position:relative; display:inline-block;
      }
      .ft-wrap::after {
        content:'';
        position:absolute; bottom:-3px; left:50%; right:50%;
        height:1.5px; border-radius:2px;
        background: linear-gradient(90deg, #22c55e, #5eead4, #22c55e);
        transition: left 0.4s cubic-bezier(0.25,0.46,0.45,0.94),
                    right 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .group:hover .ft-wrap::after { left:0; right:0; }
      .ft-p1 {
        background: linear-gradient(135deg, #22c55e 0%, #86efac 100%);
        -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
        transition: filter 0.25s;
      }
      .ft-p2 {
        background: linear-gradient(135deg, #14b8a6 0%, #5eead4 100%);
        -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
        transition: filter 0.25s;
      }
      .ft-amp {
        -webkit-text-fill-color:#4ade80; color:#4ade80;
        display:inline-block;
        transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
      }
      .group:hover .ft-p1 { filter: brightness(1.2); }
      .group:hover .ft-p2 { filter: brightness(1.2); }
      .group:hover .ft-amp { transform: scale(1.25) rotate(-8deg); }
    `;
    document.head.appendChild(s);
  }, []);

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

          {/* Brand + Nav row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">

            {/* Brand */}
            <div className="shrink-0">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                <img src="/logo.png" alt="" className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="ft-wrap font-bold text-lg">
                  <span className="ft-p1">{t('brand.part1')}</span>
                  <span className="ft-amp"> &amp; </span>
                  <span className="ft-p2">{t('brand.part2')}</span>
                </span>
              </Link>
              <p className="text-muted text-sm leading-relaxed max-w-[220px]">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Navigation — single row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {[...NAV_COL, ...NAV_COL2].map(({ to, key }) => (
                <Link key={to} to={to}
                  className="text-sm text-muted hover:text-accent transition-colors duration-150 flex items-center gap-1.5 group/n">
                  <span className="w-1 h-1 rounded-full bg-border group-hover/n:bg-accent transition-colors duration-150 shrink-0" />
                  {t(key)}
                </Link>
              ))}
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-muted/60 text-sm">{t('footer.copyright')}</p>
            <p className="text-muted/40 text-sm text-center sm:text-right whitespace-nowrap">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
