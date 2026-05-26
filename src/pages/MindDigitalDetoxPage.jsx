import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'd-detox-orbit-kf';
const ORBIT_CLASS = 'd-detox-orbit-ring';
const PROP = '--d-detox-orbit-angle';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

const SYMPTOMS = [
  { icon: '📱', s: 'Cầm điện thoại lên không có lý do cụ thể' },
  { icon: '😤', s: 'Cảm thấy bực bội khi không có internet' },
  { icon: '😴', s: 'Lướt mạng trước khi ngủ dù biết là xấu' },
  { icon: '🫥', s: 'Khó tập trung hơn 15 phút liên tục' },
  { icon: '😟', s: 'So sánh bản thân với người khác trên mạng' },
  { icon: '⏰', s: 'Dành hơn 4 tiếng/ngày trên điện thoại' },
];

const RULES = [
  { icon: '🌅', t: 'No Phone Morning', d: 'Không chạm điện thoại 30 phút đầu sau khi thức dậy. Thay bằng uống nước, thở, vận động nhẹ.' },
  { icon: '🍽️', t: 'No Screen Meals', d: 'Ăn không nhìn màn hình. Tập trung vào đồ ăn, cảm giác no, kết nối với người cùng bàn.' },
  { icon: '🌙', t: 'Digital Sunset', d: 'Tắt tất cả màn hình 1 giờ trước khi ngủ. Thay bằng đọc sách, nhật ký, hoặc trò chuyện.' },
  { icon: '🔕', t: 'Notification Fasting', d: 'Tắt thông báo tất cả app không cần thiết. Chỉ để lại cuộc gọi và tin nhắn quan trọng.' },
  { icon: '📵', t: 'Phone-Free Zones', d: 'Phòng ngủ, bàn ăn, nhà vệ sinh = không có điện thoại. Thiết lập vùng không số hoá.' },
  { icon: '⏲️', t: 'Pomodoro cho Social Media', d: 'Dành tối đa 25 phút/phiên cho mạng xã hội. Đặt timer, hết giờ đóng app.' },
];

const LEVELS = [
  { l: 'Cấp 1', t: 'Nhẹ (7 ngày)', d: 'Tắt thông báo tất cả app, giới hạn social 30ph/ngày, no phone 1 giờ trước ngủ', color: '#10b981' },
  { l: 'Cấp 2', t: 'Vừa (14 ngày)', d: 'Thêm: no phone morning, phone-free meals, uninstall 2 app tốn thời gian nhất', color: '#f59e0b' },
  { l: 'Cấp 3', t: 'Mạnh (21 ngày)', d: 'Thêm: grayscale screen, social media chỉ 15ph/ngày vào 1 khung giờ cố định', color: '#ef4444' },
  { l: 'Duy Trì', t: 'Thường Trực', d: 'Chọn 3-4 quy tắc phù hợp nhất và duy trì lâu dài như một thói quen sống', color: '#a855f7' },
];

function ScreenTimeCalculator() {
  const [hours, setHours] = useState(4);
  const productivity = Math.round((hours * 0.4) * 10) / 10;
  const books = Math.round((hours * 0.5 * 365) / 6);
  const sleep = Math.round(hours * 0.3 * 60);

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}>
      <p className="text-sm font-semibold" style={{ color: COLOR }}>Bạn dùng điện thoại mấy tiếng mỗi ngày?</p>
      <div className="flex items-center gap-4">
        <input type="range" min={1} max={12} value={hours} onChange={e => setHours(+e.target.value)}
          className="flex-1 accent-sky-500" />
        <span className="text-2xl font-black" style={{ color: COLOR }}>{hours}h</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-surface border border-border p-3 text-center">
          <div className="text-xl font-black" style={{ color: '#ef4444' }}>{productivity}h</div>
          <div className="text-xs text-muted mt-1">Năng suất mất/ngày</div>
        </div>
        <div className="rounded-xl bg-surface border border-border p-3 text-center">
          <div className="text-xl font-black" style={{ color: '#10b981' }}>{books}</div>
          <div className="text-xs text-muted mt-1">Quyển sách/năm có thể đọc</div>
        </div>
        <div className="rounded-xl bg-surface border border-border p-3 text-center">
          <div className="text-xl font-black" style={{ color: '#f59e0b' }}>{sleep}ph</div>
          <div className="text-xs text-muted mt-1">Giấc ngủ bị ảnh hưởng/đêm</div>
        </div>
      </div>
      <p className="text-xs text-muted">* Ước tính dựa trên nghiên cứu về ảnh hưởng của screen time</p>
    </div>
  );
}

export default function MindDigitalDetoxPage() {
  const [checked, setChecked] = useState({});
  const toggle = k => setChecked(p => ({ ...p, [k]: !p[k] }));
  const score = Object.values(checked).filter(Boolean).length;

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dDetoxOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dDetoxOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>📵</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Digital Detox — Nghỉ Ngơi Số</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D5 · Quản Lý Thế Giới Số</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Não bộ cần thời gian không có kích thích để phục hồi và sáng tạo. Digital detox không phải từ bỏ công nghệ — mà là lấy lại quyền kiểm soát với nó.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop" alt="Digital Detox" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>7–21 ngày thử thách</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Bạn Có Đang Bị Nghiện Màn Hình?</h2>
        <p className="text-muted text-sm mb-6">Tick vào những dấu hiệu bạn nhận ra ở bản thân ({score}/6)</p>
        <div className="space-y-2">
          {SYMPTOMS.map((s, i) => (
            <button key={i} onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all"
              style={{ borderColor: checked[i] ? COLOR : '#333', background: checked[i] ? `${COLOR}10` : 'transparent' }}>
              <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: checked[i] ? COLOR : '#555', background: checked[i] ? COLOR : 'transparent' }}>
                {checked[i] && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm text-text">{s.s}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-4" style={{ background: score >= 4 ? '#ef444415' : score >= 2 ? '#f59e0b15' : '#10b98115', borderLeft: `3px solid ${score >= 4 ? '#ef4444' : score >= 2 ? '#f59e0b' : '#10b981'}` }}>
          <p className="text-sm font-semibold" style={{ color: score >= 4 ? '#ef4444' : score >= 2 ? '#f59e0b' : '#10b981' }}>
            {score >= 4 ? `${score}/6 — Cần digital detox ngay. Bắt đầu với cấp 2.` : score >= 2 ? `${score}/6 — Có dấu hiệu phụ thuộc. Thử cấp 1.` : `${score}/6 — Tốt! Duy trì thói quen lành mạnh.`}
          </p>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Tính Toán Screen Time</h2>
        <p className="text-muted text-sm mb-6">Hiểu rõ chi phí của việc dùng quá nhiều màn hình</p>
        <ScreenTimeCalculator />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>6 Quy Tắc Digital Detox</h2>
        <p className="text-muted text-sm mb-6">Chọn 2-3 quy tắc để bắt đầu, đừng làm tất cả cùng lúc</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RULES.map(r => (
            <div key={r.t} className="rounded-2xl border border-border bg-surface p-5 hover:border-sky-500/30 transition-colors">
              <div className="text-2xl mb-2">{r.icon}</div>
              <div className="font-bold text-text mb-2">{r.t}</div>
              <p className="text-sm text-muted leading-relaxed">{r.d}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Cấp Độ Detox</h2>
        <p className="text-muted text-sm mb-6">Tăng dần từ nhẹ đến mạnh theo tuần</p>
        <div className="space-y-3">
          {LEVELS.map(lv => (
            <div key={lv.l} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
              <div className="shrink-0">
                <span className="inline-block text-xs font-black uppercase px-3 py-1 rounded-full" style={{ background: `${lv.color}20`, color: lv.color }}>{lv.l}</span>
              </div>
              <div>
                <div className="font-semibold text-text mb-1">{lv.t}</div>
                <p className="text-sm text-muted">{lv.d}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <h3 className="font-bold text-text mb-3">Thay Thế Tốt Hơn</h3>
          <p className="text-sm text-muted mb-4">Khi muốn cầm điện thoại, thử những việc này thay thế:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Uống nước', 'Thở sâu 4-7-8', 'Đi bộ 5 phút', 'Kéo giãn', 'Viết 1 dòng nhật ký', 'Gọi điện cho bạn'].map(a => (
              <div key={a} className="rounded-xl bg-surface border border-border px-3 py-2 text-sm text-muted text-center">{a}</div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
