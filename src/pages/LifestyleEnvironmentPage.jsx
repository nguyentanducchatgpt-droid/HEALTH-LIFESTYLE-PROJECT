import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f43f5e';
const RGB = '244,63,94';
const ORBIT_ID = 'c-environment-orbit-kf';
const ORBIT_PROP = '--c-env-angle';
const ORBIT_CLASS = 'c-env-orbit-ring';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const ENV_ZONES = [
  {
    id: 'morning',
    icon: '🌅',
    title: 'Môi Trường Buổi Sáng',
    subtitle: 'Thiết kế cho sự khởi động',
    color: '#f59e0b',
    items: [
      { icon: '💡', title: 'Ánh sáng ngay khi thức', desc: 'Mở rèm hoặc bật đèn sáng trắng (5000K+) trong 5 phút đầu. Ức chế melatonin, reset đồng hồ sinh học.' },
      { icon: '🌡️', title: 'Nhiệt độ mát', desc: 'Giữ phòng 18–20°C buổi sáng. Nhiệt độ thấp kích hoạt cortisol tích cực, tăng tỉnh táo.' },
      { icon: '📵', title: 'Phone-free 30 phút', desc: 'Để điện thoại ở phòng khác hoặc chế độ DND. Không email, không mạng xã hội — não bộ cần thời gian "warm up".' },
      { icon: '💧', title: 'Nước trên bàn đêm', desc: 'Đặt sẵn ly nước lớn bên giường. Uống ngay khi thức dậy — cơ thể mất 0.5–1L qua đêm.' },
      { icon: '🎵', title: 'Âm nhạc hoặc im lặng', desc: 'Tránh podcast/news ngay từ sáng — chúng kích thích hệ thống xử lý thông tin trước khi não sẵn sàng.' },
    ],
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Môi Trường Làm Việc',
    subtitle: 'Tối ưu cho tập trung & năng suất',
    color: '#0ea5e9',
    items: [
      { icon: '🖥️', title: 'Bàn làm việc ngăn nắp', desc: 'Dọn dẹp bàn trước mỗi phiên tập trung. Môi trường hỗn loạn → não luôn dùng tài nguyên để xử lý thứ không liên quan.' },
      { icon: '🌿', title: 'Cây xanh & thiên nhiên', desc: 'Ít nhất 1 cây nhỏ trên bàn hoặc tầm nhìn ra cây xanh. Giảm stress, tăng sáng tạo theo nghiên cứu.' },
      { icon: '🎧', title: 'Kiểm soát âm thanh', desc: 'Nút tai, headphone noise-cancelling hoặc white noise (mynoise.net). 60–70dB là ngưỡng tối ưu cho sáng tạo.' },
      { icon: '🌡️', title: 'Nhiệt độ 20–22°C', desc: 'Nhiệt độ phòng ảnh hưởng trực tiếp đến năng suất. Quá nóng hoặc quá lạnh đều giảm hiệu suất nhận thức.' },
      { icon: '⏰', title: 'Pomodoro vật lý', desc: 'Đồng hồ đếm ngược (không phải điện thoại). Giúp não "cam kết" với thời gian làm việc hơn timer trên screen.' },
    ],
  },
  {
    id: 'evening',
    icon: '🌙',
    title: 'Môi Trường Buổi Tối',
    subtitle: 'Thiết kế cho phục hồi & giấc ngủ',
    color: '#a855f7',
    items: [
      { icon: '🔅', title: 'Dim light sau 20:00', desc: 'Giảm độ sáng tất cả đèn và màn hình xuống 30–40% sau 8 giờ tối. Kích hoạt sản xuất melatonin tự nhiên.' },
      { icon: '🌡️', title: 'Làm mát phòng ngủ', desc: 'Nhiệt độ phòng ngủ lý tưởng: 16–19°C. Cơ thể cần giảm nhiệt độ lõi 1–2°C để đi vào giấc ngủ sâu.' },
      { icon: '📵', title: 'Blue light filter 21:00', desc: 'Bật Night Shift / f.lux trên tất cả thiết bị. Hoặc tốt hơn — không dùng màn hình sau 21:30.' },
      { icon: '🧴', title: 'Mùi hương thư giãn', desc: 'Lavender, chamomile hoặc sandalwood. Hệ khứu giác kết nối trực tiếp với limbic system — vùng não điều tiết cảm xúc và giấc ngủ.' },
      { icon: '📚', title: 'Sách thay điện thoại', desc: 'Để sách trên giường thay điện thoại. Đọc sách giả tưởng hoặc nhẹ nhàng — không sách phát triển bản thân trước ngủ.' },
    ],
  },
];

const QUICK_WINS = [
  { icon: '🔲', title: 'Cất điện thoại khỏi phòng ngủ', impact: 'Cao', time: '0 phút', cost: 'Miễn phí' },
  { icon: '💡', title: 'Đèn đọc sách warm white', impact: 'Cao', time: '5 phút', cost: '< 200k' },
  { icon: '🌿', title: 'Mua 1 cây trồng chậu nhỏ', impact: 'Trung bình', time: '15 phút', cost: '< 100k' },
  { icon: '🎧', title: 'Nút tai chống ồn', impact: 'Cao', time: '0 phút', cost: '< 50k' },
  { icon: '💧', title: 'Ly nước đặt sẵn bên giường', impact: 'Trung bình', time: '0 phút', cost: 'Miễn phí' },
  { icon: '📦', title: 'Hộp đựng dây cáp, đồ lặt vặt', impact: 'Trung bình', time: '30 phút', cost: '< 100k' },
  { icon: '🌡️', title: 'Máy đo nhiệt độ phòng ngủ', impact: 'Cao', time: '0 phút', cost: '< 200k' },
  { icon: '🔅', title: 'Cài Night Mode tự động 20:00', impact: 'Cao', time: '2 phút', cost: 'Miễn phí' },
];

const IMPACT_COLOR = { 'Cao': '#10b981', 'Trung bình': '#f59e0b' };

export default function LifestyleEnvironmentPage() {
  const [activeZone, setActiveZone] = useState('morning');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cEnvOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cEnvOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const zone = ENV_ZONES.find(z => z.id === activeZone);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🏠</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Thiết Kế Môi Trường</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C7 · Environment Design</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Hành vi tốt không chỉ từ ý chí mạnh — mà từ môi trường được thiết kế để làm cho hành vi tốt dễ hơn. Mỗi thay đổi nhỏ trong không gian sống là một "thiết kế hành vi" vô hình nhưng mạnh mẽ.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop" alt="Environment Design" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Môi trường quyết định hành vi · 3 không gian sống</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Core principle */}
      <RevealBlock className="mb-12">
        <div className="rounded-2xl p-5 border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
          <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Nguyên Tắc Cốt Lõi</div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '✅', title: 'Friction Design', desc: 'Giảm "ma sát" cho hành vi tốt (đặt thảm tập ngay trước giường), tăng ma sát cho hành vi xấu (cất TV vào tủ).' },
              { icon: '👁️', title: 'Visual Cues', desc: 'Những gì bạn thấy → bạn nghĩ đến → bạn làm. Để sách nơi dễ thấy, cất điện thoại khỏi tầm mắt.' },
              { icon: '🔄', title: 'Habit Stacking', desc: 'Ghép thói quen mới vào môi trường/thói quen cũ. "Sau khi pha cà phê, tôi ngồi thiền 5 phút trên ghế bếp."' },
            ].map(p => (
              <div key={p.title} className="rounded-xl p-4 bg-surface border border-border">
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-lg font-bold text-text mb-1">{p.title}</div>
                <div className="text-base text-muted leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* 3 Environment zones */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Không Gian Cần Thiết Kế</h2>
        <p className="text-muted text-lg mb-6">Tối ưu hóa từng giai đoạn trong ngày bắt đầu từ môi trường xung quanh bạn.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {ENV_ZONES.map(z => (
            <button key={z.id} onClick={() => setActiveZone(z.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium transition-all border ${activeZone === z.id ? 'text-white' : 'text-muted border-border hover:border-rose-500/30'}`} style={{ background: activeZone === z.id ? z.color : undefined, borderColor: activeZone === z.id ? z.color : undefined }}>
              <span>{z.icon}</span>{z.title.replace('Môi Trường ', '')}
            </button>
          ))}
        </div>

        {zone && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${zone.color}30`, background: `${zone.color}06` }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{zone.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{zone.title}</div>
                <div className="text-base font-bold uppercase tracking-widest mt-0.5" style={{ color: zone.color }}>{zone.subtitle}</div>
              </div>
            </div>
            <div className="space-y-3">
              {zone.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg hover:border-opacity-30 transition-colors">
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-lg font-bold text-text">{item.title}</div>
                    <div className="text-base text-muted leading-relaxed mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Quick wins table */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>8 Thay Đổi Nhanh, Tác Động Lớn</h2>
        <p className="text-muted text-lg mb-6">Bắt đầu với những gì dễ nhất — ngay hôm nay, không cần kế hoạch phức tạp.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-border">
                {['Thay Đổi', 'Tác Động', 'Thời Gian', 'Chi Phí'].map(h => (
                  <th key={h} className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUICK_WINS.map((w, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="mr-2">{w.icon}</span>
                    <span className="text-text font-medium">{w.title}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-base font-bold" style={{ background: `${IMPACT_COLOR[w.impact]}20`, color: IMPACT_COLOR[w.impact] }}>{w.impact}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted">{w.time}</td>
                  <td className="py-3 text-muted">{w.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* 30-day challenge */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thử Thách 30 Ngày</h2>
        <p className="text-muted text-lg mb-6">Thực hiện từng thay đổi theo tuần — không làm tất cả một lúc.</p>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { week: 'Tuần 1', focus: 'Phòng ngủ', changes: ['Cất điện thoại ra ngoài', 'Nhiệt độ 18°C', 'Rèm tối hoàn toàn'] },
            { week: 'Tuần 2', focus: 'Buổi sáng', changes: ['Ly nước bên giường', 'Đèn sáng 5 phút đầu', 'Không phone 30 phút'] },
            { week: 'Tuần 3', focus: 'Làm việc', changes: ['Dọn bàn mỗi sáng', 'Nút tai/headphone', 'Cây xanh trên bàn'] },
            { week: 'Tuần 4', focus: 'Buổi tối', changes: ['Night mode 20:00', 'Sách thay điện thoại', 'Mùi lavender'] },
          ].map(w => (
            <div key={w.week} className="rounded-xl border border-border bg-surface p-4">
              <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>{w.week}</div>
              <div className="text-lg font-bold text-text mb-3">{w.focus}</div>
              <ul className="space-y-1">
                {w.changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-muted"><span style={{ color: COLOR }}>→</span>{c}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Kỹ Thuật Thở
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/checklist" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Checklist Hằng Ngày
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
