import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL = '#14b8a6';
const TEAL_RGB = '20,184,166';
const ORBIT_ID = 'pc3-orbit-kf';

const TABS = [
  { id: 'c0', label: 'Đánh Giá',    color: '#14b8a6', rgb: '20,184,166',   icon: '📋', frame: 'pc3-frame-0' },
  { id: 'c1', label: 'Giấc Ngủ',    color: '#14b8a6', rgb: '20,184,166',   icon: '😴', frame: 'pc3-frame-1' },
  { id: 'c2', label: 'Nhịp Sinh Học',color: '#06b6d4', rgb: '6,182,212',   icon: '☀️', frame: 'pc3-frame-2' },
  { id: 'c3', label: 'NEAT',         color: '#10b981', rgb: '16,185,129',  icon: '🚶', frame: 'pc3-frame-3' },
  { id: 'c4', label: 'Phục Hồi',    color: '#a78bfa', rgb: '167,139,250', icon: '🔄', frame: 'pc3-frame-4' },
  { id: 'c5', label: 'Deload',       color: '#f97316', rgb: '249,115,22',  icon: '⚡', frame: 'pc3-frame-5' },
  { id: 'c6', label: 'Thở',          color: '#0ea5e9', rgb: '14,165,233',  icon: '🌬️', frame: 'pc3-frame-6' },
  { id: 'c7', label: 'Môi Trường',   color: '#f43f5e', rgb: '244,63,94',   icon: '🏠', frame: 'pc3-frame-7' },
];

// ─── Tab content data ─────────────────────────────────────────────────────────

const C0_ITEMS = [
  { icon: '😴', label: 'Giấc ngủ', desc: 'Giờ ngủ, giờ thức, số giờ, chất lượng ngủ' },
  { icon: '⚡', label: 'Năng lượng', desc: 'Khi nào tỉnh nhất, khi nào dễ mệt nhất' },
  { icon: '🚶', label: 'Vận động trong ngày', desc: 'Số bước, thời gian ngồi, di chuyển nhẹ' },
  { icon: '🔄', label: 'Phục hồi', desc: 'Đau mỏi vai gáy, lưng, gối; dấu hiệu quá tải' },
  { icon: '📱', label: 'Thói quen tối', desc: 'Màn hình, giờ ăn, phòng ngủ, công việc' },
];

const C0_SCORE = [
  { label: 'Ngủ ≥ 7 giờ hoặc cải thiện', pts: 20 },
  { label: 'Giờ ngủ tương đối ổn định', pts: 15 },
  { label: 'Có ánh sáng/vận động sáng', pts: 15 },
  { label: 'Số bước / NEAT đạt mục tiêu', pts: 15 },
  { label: 'Không ngồi quá lâu liên tục', pts: 10 },
  { label: 'Có phục hồi/mobility/thở', pts: 15 },
  { label: 'Giảm màn hình/caffeine tối', pts: 10 },
];

const C1_STEPS = [
  { step: '1', title: 'Cố định khung giờ ngủ – thức', desc: 'Không cần tuyệt đối chính xác, nhưng nên giữ lệch không quá 60 phút giữa các ngày, kể cả cuối tuần.', icon: '🕙' },
  { step: '2', title: 'Giảm ánh sáng mạnh buổi tối', desc: 'Tắt bớt đèn, giảm màn hình từ 21–22h. Ánh sáng mạnh ban đêm ức chế melatonin tự nhiên.', icon: '💡' },
  { step: '3', title: 'Giảm kích thích cơ thể', desc: 'Tránh caffeine sau 14–15h, tránh tập quá nặng sát giờ ngủ, tránh làm việc căng ngay trước ngủ.', icon: '☕' },
  { step: '4', title: 'Tối ưu phòng ngủ', desc: 'Phòng tối, mát (~18–21°C), yên tĩnh. Giường dùng chủ yếu để ngủ, không làm việc hay xem video trên giường.', icon: '🛏️' },
];

const C1_CHECKLIST = [
  'Giảm màn hình trước ngủ 30+ phút',
  'Không uống caffeine sau 15h',
  'Có routine tối 5–30 phút',
  'Lên giường trong khung giờ dự kiến',
  'Ngủ đủ hoặc tốt hơn hôm qua',
];

const C2_MORNING_5 = [
  { time: '1 phút', action: 'Uống 1 ly nước' },
  { time: '2 phút', action: 'Mở rèm / ra ngoài trời lấy ánh sáng' },
  { time: '1 phút', action: 'Đi bộ nhẹ tại chỗ + xoay vai, xoay hông' },
  { time: '1 phút', action: 'Hít thở sâu 4–6 nhịp' },
];

const C2_MORNING_10 = [
  { time: '2 phút', action: 'Uống nước, mở cửa, tiếp xúc ánh sáng tự nhiên' },
  { time: '3 phút', action: 'Đi bộ nhẹ trong nhà hoặc ra ngoài' },
  { time: '3 phút', action: 'Mobility: cổ vai gáy, xoay hông, vươn người' },
  { time: '2 phút', action: 'Thở chậm + xác định 1 việc chính trong ngày' },
];

const C2_ENERGY_TIPS = [
  { icon: '☀️', title: 'Ánh sáng sáng', desc: 'Ra ánh sáng tự nhiên 3–5 phút sau khi thức. Báo hiệu cho cơ thể bắt đầu ngày mới.' },
  { icon: '💧', title: 'Uống nước đầu ngày', desc: 'Uống 200–300ml nước ngay khi thức. Cơ thể mất nước sau 7–9 giờ ngủ không có nước.' },
  { icon: '🍽️', title: 'Bữa đầu có đạm', desc: 'Protein buổi sáng giúp ổn định đường huyết, tránh tụt năng lượng buổi chiều.' },
  { icon: '🚶', title: 'Đi bộ sau ăn', desc: '5–10 phút đi bộ sau bữa trưa giúp tỉnh táo, tránh buồn ngủ sau ăn và ổn định đường huyết.' },
  { icon: '☕', title: 'Caffeine thông minh', desc: 'Không uống caffeine khi chưa uống nước và ăn nhẹ. Tránh caffeine sau 15h với người khó ngủ.' },
];

const C3_LEVELS = [
  { level: 'Mới bắt đầu', steps: '+1.000–2.000 bước so với nền', color: '#10b981' },
  { level: 'Cơ bản', steps: '6.000–8.000 bước/ngày', color: '#059669' },
  { level: 'Khỏe hơn', steps: '8.000–10.000 bước/ngày', color: '#047857' },
  { level: 'Tập nhiều', steps: 'Cá nhân hóa theo phục hồi', color: '#065f46' },
];

const C3_IDEAS = [
  'Đi cầu thang thay vì thang máy 1–2 tầng',
  'Gửi xe xa hơn một chút khi đi làm',
  'Nghe điện thoại khi đứng hoặc đi lại',
  'Họp ngắn thực hiện khi đi bộ',
  'Đặt bình nước xa bàn để phải đứng dậy',
  'Đi bộ 5 phút trước khi vào nhà sau công việc',
  'Dọn nhà 10 phút — cũng là vận động!',
  'Đi bộ sau ít nhất 1 bữa ăn/ngày',
];

const C4_ROUTINE = [
  { exercise: 'Thở cơ hoành', duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng' },
  { exercise: 'Shoulder roll', duration: '1 phút', note: 'Xoay vai trước và sau' },
  { exercise: 'Thoracic twist', duration: '1 phút', note: 'Xoay lưng ngực từng bên' },
  { exercise: 'Hip flexor stretch', duration: '1 phút × 2', note: 'Giãn gấp hông từng bên' },
  { exercise: 'Hamstring stretch', duration: '1 phút × 2', note: 'Giãn đùi sau từng bên' },
  { exercise: 'Child pose + thở', duration: '2 phút', note: 'Thư giãn hoàn toàn' },
  { exercise: 'Đi bộ nhẹ', duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng' },
];

const C4_ZONES = [
  { zone: 'Cổ vai gáy', icon: '🦴', exercises: ['Chin tuck 10 lần', 'Shoulder roll', 'Doorway stretch', 'Scapular squeeze', 'Thoracic twist'] },
  { zone: 'Lưng', icon: '🫀', exercises: ['Dead bug 10 lần', 'Bird-dog 10 lần', 'Glute bridge 15 lần', 'Child pose 1 phút', 'Hip flexor stretch'] },
  { zone: 'Gối', icon: '🦵', exercises: ['Sit-to-stand 10 lần', 'Glute bridge 15 lần', 'Calf raise 15 lần', 'Split squat bám tường (nhẹ)', 'Hamstring stretch'] },
];

const C5_SIGNALS = [
  'Ngủ kém 2–3 đêm liên tiếp',
  'Tập bài quen nhưng thấy rất nặng',
  'Đau mỏi cơ kéo dài không phục hồi',
  'Nhịp tim nghỉ cao hơn bình thường',
  'Mất động lực, cáu gắt, uể oải',
  'Đau khớp hoặc đau tăng dần',
  'Hiệu suất giảm liên tục nhiều buổi',
];

const C5_METHODS = [
  { icon: '📉', title: 'Giảm số hiệp', desc: 'Ví dụ: 4 hiệp → 2–3 hiệp. Giữ nguyên cường độ.' },
  { icon: '🏋️', title: 'Giảm mức tạ', desc: 'Giảm 10–20% trọng lượng so với tuần trước.' },
  { icon: '🏃', title: 'Giảm thời lượng cardio', desc: '45 phút → 25–30 phút. Hoặc chuyển sang Zone 1–2.' },
  { icon: '🚶', title: 'Giảm cường độ', desc: 'Chạy nhanh → đi bộ nhanh, đạp xe nhẹ, bơi nhẹ.' },
];

const C6_TECHNIQUES = [
  { name: 'Thở cơ hoành', steps: 'Tay lên bụng • Hít mũi → bụng phồng • Thở miệng chậm • Ngực ít nâng', time: '1–3 phút', use: 'Trước ngủ, sau tập, khi căng thẳng' },
  { name: 'Box breathing', steps: 'Hít 4 giây • Giữ 4 giây • Thở 4 giây • Giữ 4 giây • Lặp 4 vòng', time: '4 vòng', use: 'Trước tập, lúc stress, trước ngủ' },
  { name: 'Thở ra dài hơn', steps: 'Hít 4 giây • Thở ra 6 giây • Lặp 6–10 vòng', time: '2–3 phút', use: 'Khó ngủ, tim đập nhanh, sau ngày mệt' },
];

const C7_AREAS = [
  { area: 'Buổi sáng', icon: '🌅', tips: ['Đặt bình nước trên bàn đầu giường', 'Để giày đi bộ ở cửa', 'Chuẩn bị đồ tập từ tối hôm trước', 'Đặt điện thoại xa giường', 'Mở rèm dễ dàng'] },
  { area: 'Làm việc', icon: '💼', tips: ['Đặt bình nước xa bàn để buộc phải đứng dậy', 'Dùng timer 45–60 phút', 'Để dây kháng lực nhỏ ở bàn', 'Tạo góc đứng làm việc 10–15 phút', 'Đặt nhắc "đi bộ 2 phút"'] },
  { area: 'Buổi tối', icon: '🌙', tips: ['Giảm đèn sau 21–22h', 'Sạc điện thoại ngoài phòng ngủ', 'Để sách giấy cạnh giường', 'Chuẩn bị quần áo ngày mai', 'Viết 3 việc ngày mai'] },
];

// ─── RevealBlock ───────────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

// ─── TeaserCard ───────────────────────────────────────────────────────────────

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features = [], stats = [], image, imageAlt, cta }) {
  return (
    <Link to={to} className="group relative flex flex-col md:flex-row rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ '--tc': color }}>
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between" style={{ minWidth: 0 }}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{category}</span>
          </div>
          <h3 className="text-lg font-bold text-text mb-1 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-xs font-semibold mb-2" style={{ color }}>{accent}</p>
          <p className="text-muted text-sm leading-relaxed mb-4">{desc}</p>
          <ul className="space-y-1 mb-4">
            {features.map((f, i) => (
              <li key={i} className="text-xs text-muted flex items-center gap-2">
                <span style={{ color }}>✦</span>{f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-4 mt-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold" style={{ color }}>{s.v}</div>
              <div className="text-xs text-muted">{s.l}</div>
            </div>
          ))}
          <span className="ml-auto text-xs font-semibold" style={{ color }}>{cta}</span>
        </div>
      </div>
      {image && (
        <div className="md:w-44 h-36 md:h-auto relative shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--color-surface), transparent)' }} />
        </div>
      )}
    </Link>
  );
}

function TeaserSection({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-base font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        {title}
        <span className="h-px flex-1 bg-border" />
      </h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PillarC() {
  const [activeTab, setActiveTab] = useState('c1');
  const [sleepChecks, setSleepChecks] = useState({});
  const [neatChecks, setNeatChecks] = useState({});
  const [openZone, setOpenZone] = useState(null);
  const [morningMode, setMorningMode] = useState('5');
  const [breathMode, setBreathMode] = useState(0);
  const tabBarRef = useRef(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pc3-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pc3OrbitSpin { to { --pc3-orbit-angle: 360deg; } }
      .pc3-orbit-ring {
        background: conic-gradient(from var(--pc3-orbit-angle),transparent 0deg,transparent 55deg,rgba(20,184,166,0) 65deg,rgba(20,184,166,0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(20,184,166,0.75) 99deg,rgba(20,184,166,0) 115deg,transparent 125deg,transparent 360deg);
        animation: pc3OrbitSpin 3.5s linear infinite;
      }
      ${TABS.map((t, i) => `
        @property --pc3f${i}-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes pc3f${i}Spin { to { --pc3f${i}-angle: 360deg; } }
        .${t.frame} {
          background: conic-gradient(from var(--pc3f${i}-angle),transparent 0deg,transparent 75deg,rgba(${t.rgb},0) 82deg,rgba(${t.rgb},0.6) 90deg,rgba(${t.rgb},0.6) 96deg,rgba(${t.rgb},0) 104deg,transparent 111deg,transparent 360deg);
          animation: pc3f${i}Spin 4s linear infinite;
          border-radius: 1rem; padding: 1.5px;
        }
      `).join('')}
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const tab = TABS.find(t => t.id === activeTab) || TABS[1];
  const sleepProgress = C1_CHECKLIST.filter((_, i) => sleepChecks[i]).length;
  const neatProgress = [0, 1, 2, 3].filter(i => neatChecks[i]).length;

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (tabBarRef.current) {
      const idx = TABS.findIndex(t => t.id === id);
      const btn = tabBarRef.current.children[idx];
      if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-teal-400 transition-colors">
        ← 6 Trụ Cột
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: `rgba(${TEAL_RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
          🌿
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            Lối Sống Khỏe
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: TEAL, background: `rgba(${TEAL_RGB},0.1)`, border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
            Trụ Cột C — Lifestyle
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Ngủ tốt hơn, sống có nhịp hơn, phục hồi tốt hơn. Trụ cột C là hệ điều hành của cơ thể — nền sinh hoạt giúp Trụ cột A và B hoạt động bền vững trong đời thật.
          </p>
        </div>
      </div>

      {/* Hero stats with tooltips */}
      <RevealBlock className="flex flex-wrap gap-6 mb-10">
        {[
          { v: '7–9h', l: 'Ngủ mỗi đêm', tip: 'Người lớn cần 7–9 giờ ngủ để phục hồi tối ưu. Ngủ kém làm giảm hiệu quả tập luyện và kiểm soát ăn uống.' },
          { v: '300+', l: 'kcal NEAT/ngày', tip: 'NEAT (Non-Exercise Activity Thermogenesis) có thể đốt 300–500 kcal/ngày mà không cần tập gym.' },
          { v: '8 module', l: 'Lối sống C0–C7', tip: '8 module từ đánh giá ban đầu đến thiết kế môi trường, bao phủ toàn bộ nhịp sống 24h.' },
          { v: '1%', l: 'Cải thiện mỗi ngày', tip: 'Triết lý cốt lõi: không cần hoàn hảo ngay. Sửa 1% mỗi ngày đúng chỗ tạo nên sự thay đổi bền vững.' },
        ].map((s, i) => (
          <div key={i} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
              opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100
              -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={`hero-c3-${i}`} color={TEAL} />
            </div>
            <div className="text-center px-4 py-2 rounded-xl cursor-default"
              style={{ background: `rgba(${TEAL_RGB},0.06)`, border: `1px solid rgba(${TEAL_RGB},0.15)` }}>
              <div className="text-2xl font-bold" style={{ color: TEAL }}>{s.v}</div>
              <div className="text-xs text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </RevealBlock>

      {/* Hero image */}
      <RevealBlock className="mb-12">
        <div className="pc3-orbit-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop"
              alt="Lối sống khỏe" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: TEAL, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
                Ngủ · Nhịp sống · Phục hồi
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Tab bar */}
      <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-2 mb-8"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-border)' }}>
        <div ref={tabBarRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => handleTabClick(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold shrink-0 transition-all duration-200"
              style={activeTab === t.id
                ? { background: `rgba(${t.rgb},0.15)`, color: t.color, border: `1px solid rgba(${t.rgb},0.35)` }
                : { color: 'var(--color-muted)', border: '1px solid transparent' }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="mb-12">
        {/* C0 — Đánh Giá */}
        {activeTab === 'c0' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: TEAL }}>Đánh Giá Lối Sống Ban Đầu</h2>
                <p className="text-muted text-sm mb-6">Biết điểm xuất phát trước khi thay đổi. Không đánh giá để phán xét — đánh giá để chọn điểm bắt đầu đúng nhất.</p>
                <div className="grid gap-3 mb-6">
                  {C0_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.05)`, border: `1px solid rgba(${TEAL_RGB},0.1)` }}>
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-sm">{item.label}</div>
                        <div className="text-muted text-xs mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: TEAL }}>Lifestyle Score — 100 điểm</h3>
                <div className="space-y-2 mb-6">
                  {C0_SCORE.map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{row.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: TEAL }}>{row.pts} đ</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.08)`, border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: TEAL }}>Chọn track phù hợp với bạn:</p>
                  <div className="grid gap-2">
                    {[
                      { t: 'Track Cơ Bản', d: 'Ngủ muộn, mệt mỏi, ít vận động' },
                      { t: 'Track Bận Rộn', d: 'Thiếu thời gian, làm việc nhiều, ngồi lâu' },
                      { t: 'Track Tập Nhiều', d: 'Gym/chạy/đạp/bơi nhiều, cần phục hồi tốt hơn' },
                    ].map((tr, i) => (
                      <div key={i} className="p-2 rounded-lg text-sm" style={{ background: `rgba(${TEAL_RGB},0.05)` }}>
                        <span className="font-semibold text-text">{tr.t}</span>
                        <span className="text-muted"> — {tr.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link to="/pillar/c/assessment" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: TEAL }}>
              Xem đánh giá đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C1 — Giấc Ngủ */}
        {activeTab === 'c1' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: TEAL }}>Vệ Sinh Giấc Ngủ 4 Bước</h2>
                <p className="text-muted text-sm mb-6">Ngủ không phải là "thời gian chết". Ngủ là lúc cơ thể sửa chữa cơ bắp, cân bằng hormone và phục hồi tâm lý.</p>
                <div className="grid gap-3 mb-8">
                  {C1_STEPS.map((s) => (
                    <div key={s.step} className="flex gap-4 p-4 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.05)`, border: `1px solid rgba(${TEAL_RGB},0.1)` }}>
                      <span className="text-2xl shrink-0">{s.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-sm">Bước {s.step}: {s.title}</div>
                        <div className="text-muted text-xs mt-1 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: TEAL }}>Checklist Ngủ Hằng Ngày</h3>
                <div className="space-y-2 mb-4">
                  {C1_CHECKLIST.map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => setSleepChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                        style={{ background: sleepChecks[i] ? TEAL : 'transparent', borderColor: TEAL }}>
                        {sleepChecks[i] && <span className="text-black text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-sm text-muted group-hover:text-text transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: `rgba(${TEAL_RGB},0.15)` }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sleepProgress / C1_CHECKLIST.length * 100}%`, background: TEAL }} />
                </div>
                <p className="text-xs text-muted">{sleepProgress}/{C1_CHECKLIST.length} — {sleepProgress >= 4 ? 'Tốt lắm!' : sleepProgress >= 3 ? 'Đạt mức tốt' : 'Đang xây dựng thói quen'}</p>
              </div>
            </div>
            <Link to="/pillar/c/sleep" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: TEAL }}>
              Xem khoa học giấc ngủ đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C2 — Nhịp Sinh Học */}
        {activeTab === 'c2' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#06b6d4' }}>Nhịp Sinh Học & Năng Lượng</h2>
                <p className="text-muted text-sm mb-6">Năng lượng không chỉ đến từ cà phê. Năng lượng đến từ ánh sáng, nước, vận động nhẹ, bữa ăn và nhịp làm việc đúng.</p>
                <div className="flex gap-2 mb-5">
                  {['5', '10'].map(m => (
                    <button key={m} onClick={() => setMorningMode(m)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
                      style={morningMode === m
                        ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }
                        : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      Routine sáng {m} phút
                    </button>
                  ))}
                </div>
                <div className="space-y-2 mb-7">
                  {(morningMode === '5' ? C2_MORNING_5 : C2_MORNING_10).map((row, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)' }}>
                      <span className="text-xs font-bold tabular-nums w-12 shrink-0" style={{ color: '#06b6d4' }}>{row.time}</span>
                      <span className="text-sm text-text">{row.action}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#06b6d4' }}>5 Yếu Tố Tạo Năng Lượng</h3>
                <div className="grid gap-2">
                  {C2_ENERGY_TIPS.map((t, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.04)' }}>
                      <span className="text-xl shrink-0">{t.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-sm">{t.title}</div>
                        <div className="text-muted text-xs mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/circadian" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#06b6d4' }}>
              Xem nhịp sinh học đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C3 — NEAT */}
        {activeTab === 'c3' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#10b981' }}>NEAT & Chống Ngồi Lâu</h2>
                <p className="text-muted text-sm mb-6">NEAT là toàn bộ vận động ngoài buổi tập: đi bộ, đứng lên, làm việc nhà. Với người bận rộn, NEAT quan trọng không kém buổi tập gym.</p>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#10b981' }}>Mục tiêu bước theo cấp độ</h3>
                <div className="grid gap-2 mb-6">
                  {C3_LEVELS.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <span className="text-sm font-semibold text-text">{l.level}</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: '#10b981' }}>{l.steps}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: '#10b981' }}>⏱ Quy tắc đứng dậy 2 phút</p>
                  <p className="text-xs text-muted">Mỗi 45–60 phút ngồi, đứng dậy 2 phút. Đi lấy nước, xoay vai, vươn người, calf raise. <strong>Đừng đợi đau mới đứng dậy.</strong></p>
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#10b981' }}>NEAT Checklist</h3>
                <div className="space-y-2 mb-4">
                  {['Đứng dậy sau mỗi 45–60 phút ngồi', 'Đi bộ sau ít nhất 1 bữa ăn', 'Đạt mục tiêu bước cá nhân', 'Có 1–2 lần vận động ngắn trong giờ làm'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => setNeatChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                        style={{ background: neatChecks[i] ? '#10b981' : 'transparent', borderColor: '#10b981' }}>
                        {neatChecks[i] && <span className="text-black text-xs font-bold">✓</span>}
                      </div>
                      <span className="text-sm text-muted group-hover:text-text transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${neatProgress / 4 * 100}%`, background: '#10b981' }} />
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#10b981' }}>Ý tưởng tăng NEAT</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {C3_IDEAS.map((idea, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.04)' }}>
                      <span style={{ color: '#10b981' }}>→</span>{idea}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/neat" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#10b981' }}>
              Xem hướng dẫn NEAT đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C4 — Phục Hồi */}
        {activeTab === 'c4' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#a78bfa' }}>Phục Hồi Chủ Động</h2>
                <p className="text-muted text-sm mb-6">Ngày phục hồi là một phần của chương trình, không phải ngày thất bại. Phục hồi bằng hành động nhẹ, không chỉ nằm nghỉ.</p>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#a78bfa' }}>Routine Phục Hồi 10 Phút</h3>
                <div className="space-y-2 mb-6">
                  {C4_ROUTINE.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)' }}>
                      <span className="text-xs font-bold tabular-nums w-20 shrink-0" style={{ color: '#a78bfa' }}>{r.duration}</span>
                      <div>
                        <div className="text-sm font-semibold text-text">{r.exercise}</div>
                        <div className="text-xs text-muted">{r.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#a78bfa' }}>Phục Hồi Theo Vùng Đau Mỏi</h3>
                <div className="space-y-2">
                  {C4_ZONES.map((z, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(167,139,250,0.15)' }}>
                      <button onClick={() => setOpenZone(openZone === i ? null : i)}
                        className="w-full flex items-center justify-between p-3 text-left" style={{ background: 'rgba(167,139,250,0.06)' }}>
                        <span className="flex items-center gap-2 font-semibold text-sm text-text">
                          <span>{z.icon}</span>{z.zone}
                        </span>
                        <span style={{ color: '#a78bfa' }}>{openZone === i ? '▲' : '▼'}</span>
                      </button>
                      {openZone === i && (
                        <div className="p-3 space-y-1">
                          {z.exercises.map((ex, j) => (
                            <div key={j} className="text-xs text-muted flex items-center gap-2">
                              <span style={{ color: '#a78bfa' }}>•</span>{ex}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/recovery" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#a78bfa' }}>
              Xem phục hồi chủ động đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C5 — Deload */}
        {activeTab === 'c5' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#f97316' }}>Deload & Quản Lý Tải</h2>
                <p className="text-muted text-sm mb-6">Deload là giảm tải có kế hoạch. Không phải lùi bước — mà là chiến lược để đi xa hơn về lâu dài.</p>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: '#f97316' }}>🚨 Dấu hiệu cần deload</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {C5_SIGNALS.map((s, i) => (
                      <div key={i} className="text-xs text-muted flex items-center gap-2">
                        <span style={{ color: '#f97316' }}>!</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#f97316' }}>4 Cách Deload</h3>
                <div className="grid gap-3 mb-6">
                  {C5_METHODS.map((m, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)' }}>
                      <span className="text-2xl shrink-0">{m.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-sm">{m.title}</div>
                        <div className="text-muted text-xs mt-0.5">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#f97316' }}>Lịch Deload Theo Trình Độ</h3>
                <div className="space-y-2">
                  {[
                    { level: 'Người mới', freq: 'Mỗi 6–8 tuần hoặc khi có dấu hiệu mệt' },
                    { level: 'Trung bình', freq: 'Mỗi 4–6 tuần, giảm 10–20% volume' },
                    { level: 'Tập nhiều', freq: 'Mỗi 4–5 tuần, giảm 30–40% volume' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg" style={{ background: 'rgba(249,115,22,0.04)' }}>
                      <span className="font-semibold text-text">{row.level}</span>
                      <span className="text-muted text-xs text-right">{row.freq}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/deload" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#f97316' }}>
              Xem hướng dẫn deload đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C6 — Thở */}
        {activeTab === 'c6' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#0ea5e9' }}>Thở & Hạ Nhịp Cơ Thể</h2>
                <p className="text-muted text-sm mb-6">Thở đúng cách là công cụ điều hòa cơ thể, hỗ trợ phục hồi sau tập và giúp ngủ sâu hơn.</p>
                <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
                  {C6_TECHNIQUES.map((t, i) => (
                    <button key={i} onClick={() => setBreathMode(i)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold shrink-0 transition-all"
                      style={breathMode === i
                        ? { background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }
                        : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      {t.name}
                    </button>
                  ))}
                </div>
                {C6_TECHNIQUES[breathMode] && (
                  <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                    <h3 className="font-bold text-text mb-3">{C6_TECHNIQUES[breathMode].name}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {C6_TECHNIQUES[breathMode].steps.split(' • ').map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: '#0ea5e9', color: 'black' }}>{i + 1}</span>
                          <span className="text-text">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs text-muted mt-3 flex-wrap">
                      <span>⏱ {C6_TECHNIQUES[breathMode].time}</span>
                      <span>• {C6_TECHNIQUES[breathMode].use}</span>
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-sm mb-3" style={{ color: '#0ea5e9' }}>Protocol theo tình huống</h3>
                <div className="space-y-2">
                  {[
                    ['Trước tập', '4–6 nhịp thở cơ hoành'],
                    ['Sau tập', 'Hít 4 giây, thở 6 giây × 6–8 vòng'],
                    ['Trước ngủ', 'Thở cơ hoành 3 phút'],
                    ['Căng thẳng giữa ngày', 'Box breathing 4 vòng'],
                    ['Khó ngủ', 'Thở ra dài hơn hít vào × 8–10 vòng'],
                  ].map(([s, b], i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-2 border-b" style={{ borderColor: 'rgba(14,165,233,0.08)' }}>
                      <span className="text-muted">{s}</span>
                      <span className="font-semibold text-xs text-right" style={{ color: '#0ea5e9' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/breathing" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#0ea5e9' }}>
              Xem kỹ thuật thở đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C7 — Môi Trường */}
        {activeTab === 'c7' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-xl font-bold mb-1" style={{ color: '#f43f5e' }}>Thiết Kế Môi Trường & Thói Quen</h2>
                <p className="text-muted text-sm mb-6">Đừng chỉ dựa vào ý chí. Hãy thiết kế môi trường để hành vi tốt xảy ra dễ hơn, tự nhiên hơn mỗi ngày.</p>
                <div className="space-y-4 mb-6">
                  {C7_AREAS.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{a.icon}</span>
                        <span className="font-bold text-sm" style={{ color: '#f43f5e' }}>{a.area}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {a.tips.map((tip, j) => (
                          <li key={j} className="text-xs text-muted flex items-center gap-2">
                            <span style={{ color: '#f43f5e' }}>→</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: '#f43f5e' }}>Quy tắc "Ngày Fail"</p>
                  <p className="text-xs text-muted leading-relaxed">Khi lỡ một ngày: không tự trách, không bỏ luôn. Quay lại bằng hành động nhỏ nhất: uống nước, đi bộ 5 phút, ngủ sớm hơn 15 phút.</p>
                  <p className="text-xs font-semibold mt-2" style={{ color: '#f43f5e' }}>Một ngày lệch nhịp không phá hỏng hành trình.</p>
                </div>
              </div>
            </div>
            <Link to="/pillar/c/environment" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#f43f5e' }}>
              Xem thiết kế môi trường đầy đủ →
            </Link>
          </RevealBlock>
        )}
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Sub-pages Teaser Grid */}
      <RevealBlock className="mb-6">
        <h2 className="text-2xl font-bold text-text mb-1">Khám Phá Sâu</h2>
        <p className="text-muted text-sm">12 chủ đề chuyên sâu về lối sống khỏe — từ khoa học giấc ngủ đến thiết kế môi trường sống.</p>
      </RevealBlock>

      <TeaserSection title="Nền Tảng & Giấc Ngủ">
        <TeaserCard
          to="/pillar/c/assessment" color={TEAL} rgb={TEAL_RGB}
          icon="📋" category="Đánh Giá" title="Đánh Giá Lối Sống Ban Đầu"
          accent="Lifestyle Score · 3 Track" desc="Biết điểm xuất phát trước khi thay đổi. Tự đánh giá 5 lĩnh vực: giấc ngủ, năng lượng, vận động, phục hồi và thói quen tối."
          features={['Lifestyle Score 100 điểm', 'Chọn Track phù hợp', 'Baseline Form 7 ngày']}
          stats={[{v:'5',l:'Lĩnh vực'},{v:'3',l:'Track'}]}
          image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70"
          imageAlt="Đánh giá lối sống" cta="Đánh giá ngay →" />
        <TeaserCard
          to="/pillar/c/sleep" color={TEAL} rgb={TEAL_RGB}
          icon="😴" category="Giấc Ngủ" title="Khoa Học Giấc Ngủ"
          accent="C1 · Vệ sinh giấc ngủ · 4 bước" desc="Module quan trọng nhất của Trụ cột C. Hiểu đúng về giấc ngủ và xây nền phục hồi vững chắc cho cơ thể."
          features={['4 bước vệ sinh giấc ngủ', 'Xử lý 3 tình huống thường gặp', 'Checklist 5 mục hằng ngày']}
          stats={[{v:'7–9h',l:'Giờ ngủ'},{v:'4',l:'Bước'}]}
          image="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&q=70"
          imageAlt="Giấc ngủ" cta="Ngủ tốt hơn →" />
        <TeaserCard
          to="/pillar/c/sleep-routine" color={TEAL} rgb={TEAL_RGB}
          icon="🌙" category="Giấc Ngủ" title="Routine Trước Ngủ 30–60 Phút"
          accent="C1 · Chuẩn bị ngủ · Reset 7 ngày" desc="Xây dựng routine chuyển cơ thể từ chế độ làm việc sang phục hồi. Phiên bản 10 và 60 phút phù hợp mọi lịch trình."
          features={['Routine 60 phút đầy đủ', 'Routine 10 phút rút gọn', 'Sửa ngủ muộn trong 7 ngày']}
          stats={[{v:'10–60',l:'Phút'},{v:'7',l:'Ngày reset'}]}
          image="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70"
          imageAlt="Routine ngủ" cta="Xây routine →" />
        <TeaserCard
          to="/pillar/c/circadian" color="#06b6d4" rgb="6,182,212"
          icon="☀️" category="Nhịp Sinh Học" title="Nhịp Sinh Học & Năng Lượng"
          accent="C2 · Tạo năng lượng ổn định" desc="Hiểu nhịp sinh học để tối ưu năng lượng 24h. Buổi sáng bật cơ thể lên đúng cách, buổi tối hạ xuống nhẹ nhàng."
          features={['Bản đồ năng lượng 7 ngày', 'Quy tắc ánh sáng sáng/tối', 'Caffeine thông minh']}
          stats={[{v:'5',l:'Yếu tố'},{v:'24h',l:'Chu kỳ'}]}
          image="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=70"
          imageAlt="Nhịp sinh học" cta="Tối ưu năng lượng →" />
      </TeaserSection>

      <TeaserSection title="Vận Động & Phục Hồi">
        <TeaserCard
          to="/pillar/c/morning" color="#06b6d4" rgb="6,182,212"
          icon="🌅" category="Routine Sáng" title="Routine Buổi Sáng"
          accent="C2 · 5 / 10 / 20 phút" desc="Bắt đầu ngày đúng cách để có năng lượng suốt ngày. 3 phiên bản phù hợp mọi lịch trình từ bận rộn đến rảnh rang."
          features={['Routine sáng 5 phút cơ bản', 'Routine 10 phút đầy đủ', 'Routine 20 phút nâng cao']}
          stats={[{v:'3',l:'Phiên bản'},{v:'5+',l:'Phút'}]}
          image="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=70"
          imageAlt="Routine sáng" cta="Bắt đầu ngày →" />
        <TeaserCard
          to="/pillar/c/neat" color="#10b981" rgb="16,185,129"
          icon="🚶" category="NEAT" title="NEAT & Chống Ngồi Lâu"
          accent="C3 · Vận động trong đời sống" desc="Tăng hoạt động không cần buổi tập gym. Với người bận rộn, NEAT có thể quan trọng không kém gym."
          features={['Mục tiêu bước theo cấp độ', 'Quy tắc đứng dậy 2 phút', 'NEAT cho dân văn phòng']}
          stats={[{v:'300+',l:'kcal NEAT'},{v:'2',l:'Phút mỗi giờ'}]}
          image="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70"
          imageAlt="NEAT đi bộ" cta="Tăng NEAT →" />
        <TeaserCard
          to="/pillar/c/recovery" color="#a78bfa" rgb="167,139,250"
          icon="🔄" category="Phục Hồi" title="Phục Hồi Chủ Động"
          accent="C4 · Active recovery" desc="Phục hồi không chỉ là nằm nghỉ. Học cách phục hồi bằng hành động nhẹ: mobility, giãn cơ, thở, foam rolling."
          features={['Routine phục hồi 10 phút', 'Phục hồi theo vùng đau mỏi', 'Active recovery theo mục tiêu']}
          stats={[{v:'10',l:'Phút'},{v:'3',l:'Vùng cơ thể'}]}
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70"
          imageAlt="Phục hồi" cta="Phục hồi tốt hơn →" />
        <TeaserCard
          to="/pillar/c/deload" color="#f97316" rgb="249,115,22"
          icon="⚡" category="Deload" title="Deload & Quản Lý Tải"
          accent="C5 · Giảm tải có kế hoạch" desc="Người khỏe biết lúc nào nên đẩy, lúc nào nên giữ, lúc nào nên lùi một bước để đi xa hơn."
          features={['7 dấu hiệu cần deload', '4 cách thực hiện deload', 'Lịch deload theo trình độ']}
          stats={[{v:'4–6',l:'Tuần/lần'},{v:'4',l:'Cách deload'}]}
          image="https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=600&q=70"
          imageAlt="Deload" cta="Deload đúng cách →" />
      </TeaserSection>

      <TeaserSection title="Kỹ Năng & Công Cụ">
        <TeaserCard
          to="/pillar/c/breathing" color="#0ea5e9" rgb="14,165,233"
          icon="🌬️" category="Thở" title="Kỹ Thuật Thở & Hạ Nhịp"
          accent="C6 · 3 kỹ thuật cốt lõi" desc="Thở đúng cách điều hòa hệ thần kinh, hỗ trợ phục hồi và cải thiện chất lượng giấc ngủ."
          features={['Thở cơ hoành', 'Box breathing', 'Protocol theo 5 tình huống']}
          stats={[{v:'3',l:'Kỹ thuật'},{v:'1–3',l:'Phút'}]}
          image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70"
          imageAlt="Thở" cta="Thở đúng cách →" />
        <TeaserCard
          to="/pillar/c/environment" color="#f43f5e" rgb="244,63,94"
          icon="🏠" category="Môi Trường" title="Thiết Kế Môi Trường Sống"
          accent="C7 · Giảm phụ thuộc ý chí" desc="Muốn thay đổi hành vi bền vững, hãy thiết kế lại môi trường. Không cần ý chí mạnh, chỉ cần môi trường đúng."
          features={['Môi trường buổi sáng', 'Môi trường làm việc', 'Môi trường buổi tối']}
          stats={[{v:'3',l:'Không gian'},{v:'15+',l:'Gợi ý'}]}
          image="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=70"
          imageAlt="Môi trường sống" cta="Thiết kế ngay →" />
        <TeaserCard
          to="/pillar/c/checklist" color={TEAL} rgb={TEAL_RGB}
          icon="✅" category="Theo Dõi" title="Checklist & Theo Dõi Lối Sống"
          accent="C8 · Daily + Weekly tracking" desc="Theo dõi đủ để nhận xu hướng, không quá nhiều để trở thành áp lực. Daily checklist 7 mục và weekly review."
          features={['Daily Lifestyle Checklist 7 mục', 'Weekly review 5 câu hỏi', 'Red flags an toàn']}
          stats={[{v:'7',l:'Mục/ngày'},{v:'5',l:'Câu/tuần'}]}
          image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70"
          imageAlt="Checklist" cta="Bắt đầu theo dõi →" />
        <TeaserCard
          to="/pillar/c/roadmap" color={TEAL} rgb={TEAL_RGB}
          icon="🗺️" category="Lộ Trình" title="Lộ Trình 12 Tuần Lối Sống"
          accent="Tuần 1–12 · 3 giai đoạn" desc="Từ nhận diện nhịp sống đến cá nhân hóa hoàn toàn. 12 tuần xây dựng lối sống khỏe bền vững từng bước."
          features={['Tuần 1–2: Nhận diện nhịp sống', 'Tuần 3–6: Xây routine cơ bản', 'Tuần 7–12: Cá nhân hóa']}
          stats={[{v:'12',l:'Tuần'},{v:'3',l:'Giai đoạn'}]}
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70"
          imageAlt="Lộ trình" cta="Xem lộ trình →" />
      </TeaserSection>

      {/* Core message */}
      <RevealBlock className="mt-4 mb-12">
        <div className="rounded-2xl p-6 text-center" style={{ background: `rgba(${TEAL_RGB},0.06)`, border: `1px solid rgba(${TEAL_RGB},0.15)` }}>
          <div className="text-3xl mb-3">🌿</div>
          <blockquote className="text-lg font-bold text-text leading-relaxed mb-2">
            "Không cần sống hoàn hảo. Chỉ cần sống có nhịp, có hồi phục, có quay lại."
          </blockquote>
          <p className="text-muted text-sm">— Triết lý Trụ cột C</p>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border">
        <Link to="/pillars" className="text-muted hover:text-teal-400 transition-colors text-sm">← Về 6 Trụ Cột</Link>
      </div>
    </div>
  );
}
