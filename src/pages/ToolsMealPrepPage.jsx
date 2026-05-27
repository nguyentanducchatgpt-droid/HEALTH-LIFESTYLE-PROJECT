import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'f-mprep-orbit-kf';
const ORBIT_CLASS = 'f-mprep-orbit-ring';

const PREP_TEMPLATE = [
  { component: 'Tinh bột', icon: '🍚', color: '#f59e0b', options: ['Cơm gạo lứt 4–5 phần', 'Khoai lang luộc 4–5 củ nhỏ', 'Bánh mì nguyên cám (để sẵn)', 'Yến mạch (chuẩn bị trước)'], tip: 'Nấu 1 nồi cơm, phân chia ngay vào hộp.' },
  { component: 'Đạm', icon: '🥩', color: '#ef4444', options: ['Thịt gà ức luộc/áp chảo 400–500g', 'Cá hồi/cá basa áp chảo', 'Trứng luộc 8–10 quả', 'Đậu phụ chiên hoặc nướng'], tip: 'Làm 2–3 nguồn đạm khác nhau để không ngán.' },
  { component: 'Rau', icon: '🥦', color: '#22c55e', options: ['Súp lơ/bông cải xanh 1 bó', 'Cà rốt thái miếng 3–4 củ', 'Đậu que xào tỏi', 'Rau muống/cải xào'], tip: 'Luộc rau để ráo nước trước khi cho vào hộp.' },
  { component: 'Chất béo lành mạnh', icon: '🥑', color: '#14b8a6', options: ['Bơ tươi ½–1 quả/ngày', 'Hạt điều/óc chó 30g/ngày', 'Dầu ô liu dùng khi ăn', 'Cá béo (omega-3)'], tip: 'Không cần chuẩn bị trước — lấy trực tiếp khi ăn.' },
  { component: 'Gia vị & Nước chấm', icon: '🧂', color: '#6366f1', options: ['Nước mắm pha sẵn nhạt', 'Muối tiêu chanh', 'Sốt cà chua nấu sẵn', 'Tương ớt/mù tạt nhỏ'], tip: 'Chuẩn bị gia vị đa dạng giúp đổi vị mà không ngán.' },
];

const SCHEDULE = [
  { step: 1, time: '0–5 phút', action: 'Chuẩn bị', desc: 'Rã đông thịt (nếu cần), vo gạo/nấu cơm, bật bếp, lấy rau ra.' },
  { step: 2, time: '5–15 phút', action: 'Nấu đạm', desc: 'Luộc gà hoặc áp chảo cá. Song song luộc trứng 8–10 phút.' },
  { step: 3, time: '15–25 phút', action: 'Xào rau', desc: 'Xào 2 loại rau khác nhau. Luộc thêm 1 loại nếu muốn.' },
  { step: 4, time: '25–35 phút', action: 'Phân chia', desc: 'Chia tinh bột, đạm, rau vào hộp. Cân bằng theo đĩa ăn chuẩn.' },
  { step: 5, time: '35–45 phút', action: 'Bảo quản', desc: 'Để nguội trước khi đậy nắp. Tủ lạnh 3 ngày, tủ đông 1 tuần.' },
];

const TIPS = [
  { icon: '🌈', tip: 'Đa dạng màu sắc = đa dạng dinh dưỡng. Mỗi tuần thay 1 loại rau.' },
  { icon: '🧊', tip: 'Cơm gạo lứt để tủ lạnh qua đêm = tăng tinh bột kháng (tốt hơn cho đường huyết).' },
  { icon: '🔄', tip: 'Làm 2 loại đạm khác nhau: 1 kiểu đậm đà + 1 kiểu nhẹ nhàng hơn.' },
  { icon: '📦', tip: 'Hộp thủy tinh tốt hơn hộp nhựa — không mùi, gia nhiệt được trực tiếp.' },
  { icon: '🧂', tip: 'Nêm gia vị sau khi hâm nóng, không cần cho vào hộp — giữ tươi hơn.' },
  { icon: '⏰', tip: 'Meal prep tốt nhất vào tối Chủ nhật — fresh cho thứ 2–4.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function ToolsMealPrepPage() {
  const [openComp, setOpenComp] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mprep-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMprepOrbitSpin { to { --f-mprep-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mprep-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMprepOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🥡</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Meal Prep 3 Ngày</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            30–45 phút · 5 thành phần · Không ngán
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Một lần nấu cho 2–3 ngày. Cấu trúc đĩa ăn nhất quán nhưng đổi vị linh hoạt. Giải pháp thực tế cho người bận mà vẫn muốn ăn lành mạnh.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop" alt="Meal prep" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            1 lần nấu · 3 ngày không lo ăn gì
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* 5 components */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>5 Thành Phần Cơ Bản</h2>
        <p className="text-muted text-sm mb-6">Chuẩn bị đủ 5 thành phần này — bạn có thể lắp ráp thành bất kỳ bữa ăn nào mà không ngán.</p>
        <div className="space-y-3">
          {PREP_TEMPLATE.map((comp, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenComp(openComp === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-2xl">{comp.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-text">{comp.component}</div>
                  <div className="text-xs text-muted">{comp.options[0]} và thêm...</div>
                </div>
                <span className="text-muted">{openComp === i ? '▲' : '▼'}</span>
              </button>
              {openComp === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <ul className="space-y-1 mb-3">
                    {comp.options.map((opt, j) => (
                      <li key={j} className="flex gap-2 text-sm text-muted"><span style={{ color: comp.color }}>→</span>{opt}</li>
                    ))}
                  </ul>
                  <div className="p-3 rounded-xl text-xs" style={{ background: `${comp.color}10`, borderLeft: `2px solid ${comp.color}` }}>
                    <strong style={{ color: comp.color }}>Tip:</strong> {comp.tip}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Schedule */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Lịch Nấu 45 Phút</h2>
        <p className="text-muted text-sm mb-6">Làm song song đúng thứ tự để tiết kiệm thời gian tối đa.</p>
        <div className="space-y-3">
          {SCHEDULE.map(s => (
            <div key={s.step} className="flex gap-4 items-start p-4 rounded-2xl border border-border bg-surface">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm" style={{ background: `rgba(${RGB},0.15)`, color: COLOR }}>{s.step}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text text-sm">{s.action}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: COLOR, background: `rgba(${RGB},0.1)` }}>{s.time}</span>
                </div>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Tips */}
      <RevealBlock delay={2} className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>Tips Không Ngán</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <span className="text-xl block mb-2">{t.icon}</span>
              <p className="text-sm text-muted">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
