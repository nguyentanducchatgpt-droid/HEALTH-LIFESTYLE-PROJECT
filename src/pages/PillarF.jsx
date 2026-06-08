import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThoughtBubble from '../components/ThoughtBubble';

const COLOR = '#f97316';
const RGB = '249,115,22';

// --- Orbit ring CSS ---
const ORBIT_CSS = `
  @property --pf-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
  @keyframes pfOrbitSpin { to { --pf-orbit-angle: 360deg; } }
  .pf-orbit-ring {
    background: conic-gradient(
      from var(--pf-orbit-angle),
      transparent 0deg, transparent 55deg,
      rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
      rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
      rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
    );
    animation: pfOrbitSpin 3.5s linear infinite;
  }
  @keyframes pb-frame-f0 { 0%,100% { border-color: rgba(249,115,22,0.15); } 50% { border-color: rgba(249,115,22,0.45); } }
  @keyframes pb-frame-f1 { 0%,100% { border-color: rgba(249,115,22,0.15); } 50% { border-color: rgba(249,115,22,0.4); } }
  @keyframes pfTitleShimmer {
    0%   { background-position: -280% center; }
    100% { background-position: 280% center; }
  }
  @keyframes pfAmpFire {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(249,115,22,0.5)) drop-shadow(0 0 14px rgba(251,146,60,0.3)); transform: rotate(-3deg) scale(1); }
    50%       { filter: drop-shadow(0 0 20px rgba(249,115,22,1)) drop-shadow(0 0 36px rgba(253,186,116,0.6)); transform: rotate(3deg) scale(1.12); }
  }
  .pf-title-word {
    background: linear-gradient(90deg,
      #ffffff 0%, #ffffff 22%,
      #fdba74 36%, #f97316 48%, #fbbf24 57%, #fb923c 65%,
      #ffffff 80%, #ffffff 100%
    );
    background-size: 310% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
    animation: pfTitleShimmer 5.5s linear infinite;
  }
  .pf-title-amp {
    -webkit-text-fill-color: #fb923c; color: #fb923c;
    display: inline-block;
    animation: pfAmpFire 2s ease-in-out infinite;
  }
`;

const TABS = [
  { id: 'f0', label: 'Dashboard', icon: '📊', frame: 'pb-frame-f0' },
  { id: 'f1', label: 'Checklist', icon: '✅', frame: 'pb-frame-f1' },
  { id: 'f2', label: 'Nhật Ký Tập', icon: '🏋️', frame: 'pb-frame-f0' },
  { id: 'f3', label: 'Thực Đơn', icon: '🍽️', frame: 'pb-frame-f1' },
  { id: 'f4', label: 'Lifestyle', icon: '💤', frame: 'pb-frame-f0' },
  { id: 'f5', label: 'Tâm Trí', icon: '🧘', frame: 'pb-frame-f1' },
  { id: 'f6', label: 'Test 4 Tuần', icon: '📈', frame: 'pb-frame-f0' },
  { id: 'f7', label: 'Thư Viện', icon: '⚡', frame: 'pb-frame-f1' },
];

// --- Hero stats ---
const HERO_STATS = [
  { v: '8', l: 'Module', tip: 'Checklist, nhật ký tập, meal plan, lifestyle, tâm trí, test, thư viện, dashboard' },
  { v: '12', l: 'Tuần', tip: '12-week roadmap với 4 giai đoạn rõ ràng: nền tảng → đo tiến bộ → cá nhân hóa → tự vận hành' },
  { v: '100', l: 'Điểm/ngày', tip: 'Hệ thống Health Score 100 điểm: vận động 25đ, dinh dưỡng 20đ, nước 10đ, ngủ 15đ, NEAT 15đ, tâm trí 10đ, ghi nhật ký 5đ' },
  { v: '5', l: 'Phút/ngày', tip: 'Bài tập tối thiểu 5 phút/ngày đủ để duy trì chuỗi thói quen khi quá bận' },
];

// --- Daily checklist data ---
const DAILY_MIN = [
  { label: 'Vận động ít nhất 10 phút', icon: '🏃', cat: 'A' },
  { label: 'Ăn đủ 1 nguồn đạm mỗi bữa chính', icon: '🥩', cat: 'B' },
  { label: 'Ăn ít nhất 2 phần rau/trái cây', icon: '🥗', cat: 'B' },
  { label: 'Uống đủ nước theo nhu cầu cá nhân', icon: '💧', cat: 'C' },
  { label: 'Chuẩn bị/ngủ sớm hơn hôm qua', icon: '😴', cat: 'C' },
  { label: 'Dành 3–5 phút thở/chậm lại', icon: '🧘', cat: 'D' },
];

const CAT_COLORS = { A: '#22c55e', B: '#84cc16', C: '#14b8a6', D: '#a855f7', E: '#3b82f6', F: COLOR };

// --- Weekly checklist ---
const WEEKLY_ITEMS = [
  { label: 'Số buổi tập sức mạnh', target: '2–4 buổi', icon: '💪' },
  { label: 'Số buổi cardio/đi bộ dài', target: '2–5 buổi', icon: '🚶' },
  { label: 'Số ngày ăn đủ rau', target: '≥ 5 ngày', icon: '🥦' },
  { label: 'Số ngày ngủ tốt', target: '≥ 4 ngày', icon: '😴' },
  { label: 'Số ngày có thực hành calm', target: '≥ 4 ngày', icon: '🧘' },
  { label: 'Số ngày ghi nhật ký', target: '≥ 5 ngày', icon: '📝' },
];

// --- Health Score breakdown ---
const SCORE_ITEMS = [
  { label: 'Vận động/tập luyện', pts: 25, icon: '🏋️' },
  { label: 'Đi bộ/NEAT', pts: 15, icon: '🚶' },
  { label: 'Dinh dưỡng cơ bản', pts: 20, icon: '🍽️' },
  { label: 'Uống nước', pts: 10, icon: '💧' },
  { label: 'Ngủ/phục hồi', pts: 15, icon: '😴' },
  { label: 'Tâm trí/calm practice', pts: 10, icon: '🧘' },
  { label: 'Ghi nhật ký', pts: 5, icon: '📝' },
];

// --- Quick workouts ---
const QUICK_WO = [
  {
    dur: '5 phút', label: 'Reset Cơ Thể', color: '#22c55e',
    steps: ['1 phút thở chậm / thở cơ hoành', '1 phút xoay vai, mở ngực', '1 phút Cat-cow hoặc thoracic twist', '1 phút Hip hinge nhẹ hoặc squat ghế', '1 phút Child pose / thở chậm'],
    note: 'Mục tiêu: duy trì chuỗi thói quen, không phải đốt mỡ.',
  },
  {
    dur: '10 phút', label: 'Toàn Thân Người Mới', color: COLOR,
    steps: ['2 phút khởi động: đi bộ tại chỗ, xoay vai, squat ghế', '6 phút × 2 vòng: Squat 30s → Push-up gối 30s → Glute bridge 30s → Dead bug 30s', '2 phút giãn cơ + thở'],
    note: 'Phù hợp người mới, sáng sớm hoặc giờ nghỉ trưa.',
  },
  {
    dur: '20 phút', label: 'Full Body Chuẩn', color: '#ef4444',
    steps: ['4 phút khởi động', '12 phút × 3 vòng: Squat/Sit-to-stand → Push-up → Band row → Glute bridge → Plank/Dead bug', '4 phút cooldown giãn cơ'],
    note: 'Đủ để tạo hiệu quả rõ ràng nếu duy trì 3–4 lần/tuần.',
  },
];

// --- Test items ---
const TEST_ITEMS = [
  { label: 'Cân nặng', unit: 'kg', how: 'Cân buổi sáng, sau vệ sinh, trước ăn' },
  { label: 'Vòng eo', unit: 'cm', how: 'Đo ngang rốn sau khi thở ra nhẹ' },
  { label: 'Sit-to-stand 1 phút', unit: 'lần', how: 'Đứng lên ngồi xuống từ ghế, không dùng tay đỡ' },
  { label: 'Plank (gối hoặc thường)', unit: 'giây', how: 'Giữ tư thế plank đến khi không thể nữa' },
  { label: 'Đi bộ 6 phút', unit: 'm / cảm giác', how: 'Ghi quãng đường hoặc mức gắng sức (dễ/vừa/khó)' },
  { label: 'Giấc ngủ trung bình', unit: 'giờ/đêm', how: 'Trung bình 7 ngày qua' },
  { label: 'Stress tự chấm', unit: '/10', how: 'Mức stress cảm nhận trung bình tuần qua' },
  { label: 'Năng lượng tự chấm', unit: '/10', how: 'Mức năng lượng cảm nhận trung bình tuần qua' },
];

// --- Teaser sections ---
const TEASER_SECTIONS = [
  {
    title: 'Công Cụ Hằng Ngày',
    cards: [
      { to: '/pillar/f/checklist', icon: '✅', category: 'Hành Động', title: 'Checklist Ngày & Tuần', accent: 'Interactive · Lưu tiến độ', desc: 'Checklist tối giản 6 mục hàng ngày và checklist tuần theo dõi xu hướng. Mỗi tick là một bước tiến.', features: ['Checklist 6 mục hàng ngày', 'Tracker 6 chỉ tiêu hàng tuần', 'Review cuối tuần 4 câu hỏi'], stats: [{ v: '6', l: 'Mục/ngày' }, { v: '6', l: 'Chỉ tiêu tuần' }], image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', cta: 'Mở checklist →' },
      { to: '/pillar/f/workout-log', icon: '🏋️', category: 'Tập Luyện', title: 'Nhật Ký Tập Luyện', accent: 'RPE · Tăng tiến · Lưu lịch sử', desc: 'Ghi lại bài tập, thời lượng, cảm giác RPE. Theo dõi tăng tiến tuần sau. Không tập theo cảm hứng nữa.', features: ['Log bài tập + RPE 1–10', 'Template tăng tiến tuần sau', 'Lịch sử 30 ngày gần nhất'], stats: [{ v: 'RPE', l: '1–10' }, { v: '30', l: 'Ngày lưu' }], image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', cta: 'Ghi nhật ký →' },
      { to: '/pillar/f/meal-plan', icon: '🍽️', category: 'Dinh Dưỡng', title: 'Template Thực Đơn', accent: 'Đĩa ăn chuẩn · Ghi nhật ký ăn', desc: 'Template đĩa ăn lành mạnh theo tỷ lệ ½ rau – ¼ đạm – ¼ tinh bột. Nhật ký ăn uống đơn giản mỗi ngày.', features: ['Template đĩa ăn chuẩn', 'Nhật ký protein/rau/nước hàng ngày', 'Gợi ý bữa ăn Việt'], stats: [{ v: '3', l: 'Bữa/ngày' }, { v: '4', l: 'Tuần theo dõi' }], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', cta: 'Lên thực đơn →' },
    ],
  },
  {
    title: 'Theo Dõi & Đánh Giá',
    cards: [
      { to: '/pillar/f/lifestyle-tracker', icon: '💤', category: 'Lifestyle', title: 'Lifestyle Tracker', accent: 'Ngủ · Bước chân · Năng lượng', desc: 'Theo dõi giấc ngủ, số bước chân, và mức năng lượng hàng ngày. Tìm pattern ảnh hưởng đến cảm giác của bạn.', features: ['Sleep log + chất lượng giấc ngủ', 'Bước chân & NEAT tracker', 'Chỉ số năng lượng 1–10'], stats: [{ v: '3', l: 'Chỉ số' }, { v: '30', l: 'Ngày lưu' }], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', cta: 'Theo dõi lifestyle →' },
      { to: '/pillar/f/mind-tracker', icon: '🧘', category: 'Tâm Trí', title: 'Mind & Calm Tracker', accent: 'Stress · Mood · Journaling', desc: 'Theo dõi stress, tâm trạng và thực hành calm practice. Nhận ra ngày nào cần giảm tải trước khi kiệt sức.', features: ['Stress score hàng ngày', 'Mood tracker emoji', 'Journaling 3 câu hỏi'], stats: [{ v: '3', l: 'Chỉ số tâm trí' }, { v: '5', l: 'Phút/ngày' }], image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', cta: 'Theo dõi tâm trí →' },
      { to: '/pillar/f/health-score', icon: '💯', category: 'Điểm Số', title: 'Daily Health Score', accent: '100 điểm · 6 nhóm · Phân tích tuần', desc: 'Chấm điểm sức khỏe hàng ngày theo 6 nhóm hành vi. Xem xu hướng điểm trung bình tuần để tự điều chỉnh.', features: ['6 nhóm hành vi · 100 điểm', 'Lịch sử điểm 7 ngày', 'Quy tắc điều chỉnh theo điểm số'], stats: [{ v: '100', l: 'Điểm tối đa' }, { v: '6', l: 'Nhóm hành vi' }], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', cta: 'Chấm điểm →' },
    ],
  },
  {
    title: 'Thư Viện & Tài Nguyên',
    cards: [
      { to: '/pillar/f/quick-workouts', icon: '⚡', category: 'Bài Nhanh', title: 'Thư Viện Bài Nhanh', accent: '5 · 10 · 20 phút', desc: 'Bài tập 5–10–20 phút cho mọi tình huống. Quá bận, quá mệt, hay chỉ cần reset — luôn có lựa chọn phù hợp.', features: ['Bài 5 phút reset cơ thể', 'Bài 10 phút toàn thân người mới', 'Bài 20 phút full body chuẩn'], stats: [{ v: '3', l: 'Độ dài' }, { v: '5', l: 'Nhóm mục tiêu' }], image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', cta: 'Xem thư viện →' },
      { to: '/pillar/f/meal-prep', icon: '🥡', category: 'Bếp Núc', title: 'Meal Prep 3 Ngày', accent: '30–45 phút · Chuẩn bị sẵn', desc: 'Hướng dẫn meal prep đơn giản cho 2–3 ngày. Một lần nấu, nhiều ngày dùng. Cấu trúc đĩa ăn nhất quán mà không ngán.', features: ['Template 5 thành phần', 'Quy tắc 30–45 phút nấu', 'Tips đổi vị không ngán'], stats: [{ v: '3', l: 'Ngày prep' }, { v: '45', l: 'Phút nấu' }], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', cta: 'Bắt đầu meal prep →' },
      { to: '/pillar/f/reset-protocol', icon: '🔄', category: 'Recovery', title: 'Reset Protocol', accent: 'Sau lỡ nhịp · Quay lại nhanh', desc: 'Hệ thống reset sau ngày ăn lệch, tuần bỏ tập, hoặc giai đoạn stress cao. Không tự trách — chỉ cần quay lại đúng cách.', features: ['Reset sau 1 ngày ăn lệch', 'Reset sau 1 tuần bỏ tập', 'Reset sau stress/mất ngủ'], stats: [{ v: '4', l: 'Tình huống reset' }, { v: '1', l: 'Ngày quay lại' }], image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80', cta: 'Xem protocol →' },
    ],
  },
  {
    title: 'Lộ Trình & Test',
    cards: [
      { to: '/pillar/f/progress-test', icon: '📈', category: 'Đo Lường', title: 'Bộ Test Tiến Bộ 4 Tuần', accent: 'Thể lực · Vòng eo · Cảm giác', desc: 'Test 8 chỉ số mỗi 4 tuần để đo tiến bộ ngoài cân nặng. Plank, sit-to-stand, giấc ngủ, stress, năng lượng — toàn diện hơn.', features: ['8 chỉ số theo dõi toàn diện', 'Bảng so sánh tuần 0/4/8/12', 'Không đánh giá chỉ bằng cân nặng'], stats: [{ v: '8', l: 'Chỉ số test' }, { v: '4', l: 'Tuần/lần' }], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', cta: 'Bắt đầu test →' },
      { to: '/pillar/f/roadmap', icon: '🗺️', category: 'Lộ Trình', title: 'Lộ Trình 12 Tuần', accent: '4 giai đoạn · Tự vận hành', desc: 'Từ làm quen checklist → đo tiến bộ → cá nhân hóa theo mục tiêu → tự điều chỉnh không cần ai nhắc.', features: ['Tuần 1–2: nền tảng', 'Tuần 3–6: đo tiến bộ', 'Tuần 7–12: cá nhân hóa & tối ưu'], stats: [{ v: '12', l: 'Tuần' }, { v: '4', l: 'Giai đoạn' }], image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80', cta: 'Xem lộ trình →' },
    ],
  },
];

// --- RevealBlock ---
function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.08}s, transform 0.55s ease ${delay * 0.08}s` }}>
      {children}
    </div>
  );
}

// --- TeaserCard ---
function TeaserCard({ to, icon, category, title, accent, desc, features, stats, image, imageAlt, cta }) {
  return (
    <Link to={to} className="block rounded-3xl border border-border bg-surface overflow-hidden hover:border-orange-500/40 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: COLOR }}>{category}</span>
            </div>
            <h3 className="text-xl font-bold text-text mb-1 leading-tight">{title}</h3>
            <p className="text-sm text-muted mb-3">{accent}</p>
            <p className="text-base text-muted leading-relaxed mb-4">{desc}</p>
            <ul className="space-y-1 mb-5">
              {features.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted"><span style={{ color: COLOR }}>✦</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black" style={{ color: COLOR }}>{s.v}</div>
                  <div className="text-sm text-muted">{s.l}</div>
                </div>
              ))}
            </div>
            <span className="ml-auto text-base font-bold group-hover:translate-x-1 transition-transform" style={{ color: COLOR }}>{cta}</span>
          </div>
        </div>
        <div className="relative md:w-44 h-36 md:h-auto shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt || title} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/20 to-transparent md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-transparent md:hidden" />
        </div>
      </div>
    </Link>
  );
}

function TeaserSection({ title, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.07)` }}>{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// --- F0 Dashboard tab ---
function F0Dashboard() {
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_score_today') || '{}'); } catch { return {}; }
  });

  function setScore(key, val) {
    const u = { ...scores, [key]: val, date: new Date().toLocaleDateString('vi-VN') };
    setScores(u);
    localStorage.setItem('healthapp_f_score_today', JSON.stringify(u));
  }

  const total = SCORE_ITEMS.reduce((s, item) => s + (scores[item.label] || 0), 0);
  const level = total >= 80 ? { label: 'Ngày Rất Tốt 🔥', color: '#22c55e' } : total >= 60 ? { label: 'Ngày Ổn ✓', color: COLOR } : total >= 40 ? { label: 'Duy Trì Tối Thiểu', color: '#eab308' } : { label: 'Ngày Reset', color: '#ef4444' };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text">Health Score Hôm Nay</h3>
          <div className="text-right">
            <div className="text-4xl font-black" style={{ color: level.color }}>{total}</div>
            <div className="text-sm font-bold" style={{ color: level.color }}>{level.label}</div>
          </div>
        </div>
        <div className="w-full h-2 bg-bg rounded-full mb-5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${total}%`, background: level.color }} />
        </div>
        <div className="space-y-3">
          {SCORE_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-muted flex-1">{item.label}</span>
              <span className="text-sm text-muted w-8 text-right">{item.pts}đ</span>
              <div className="flex gap-1">
                {[0, Math.round(item.pts * 0.4), Math.round(item.pts * 0.7), item.pts].map((v, j) => (
                  <button key={j} onClick={() => setScore(item.label, v)}
                    className="px-2 py-0.5 rounded text-sm transition-colors"
                    style={(scores[item.label] || 0) >= v && v > 0 ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                    {j === 0 ? '0' : j === 1 ? '~' : j === 2 ? '+' : '✓'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/pillar/f/checklist" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-sm font-bold text-text">Checklist Ngày</div>
        </Link>
        <Link to="/pillar/f/workout-log" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">🏋️</div>
          <div className="text-sm font-bold text-text">Ghi Nhật Ký</div>
        </Link>
        <Link to="/pillar/f/health-score" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">💯</div>
          <div className="text-sm font-bold text-text">Lịch Sử Điểm</div>
        </Link>
        <Link to="/pillar/f/progress-test" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">📈</div>
          <div className="text-sm font-bold text-text">Test Tiến Bộ</div>
        </Link>
      </div>
    </div>
  );
}

// --- F1 Checklist tab ---
function F1Checklist() {
  const [checked, setChecked] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_daily') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return {};
      return s.items || {};
    } catch { return {}; }
  });
  const [weekView, setWeekView] = useState(false);
  const [weekData, setWeekData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_weekly') || '{}'); } catch { return {}; }
  });

  function toggle(i) {
    const u = { ...checked, [i]: !checked[i] };
    setChecked(u);
    localStorage.setItem('healthapp_f_daily', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), items: u }));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / DAILY_MIN.length) * 100);
  const msg = doneCount >= 5 ? '🔥 Ngày tốt!' : doneCount >= 3 ? '✓ Đạt mức duy trì' : '→ Cứ từng bước một';

  return (
    <div className="space-y-5">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setWeekView(false)} className="flex-1 py-2 rounded-xl text-base font-bold transition-colors" style={!weekView ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Hôm Nay</button>
        <button onClick={() => setWeekView(true)} className="flex-1 py-2 rounded-xl text-base font-bold transition-colors" style={weekView ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Tuần Này</button>
      </div>
      {!weekView ? (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COLOR }} />
            </div>
            <span className="text-base font-bold" style={{ color: COLOR }}>{doneCount}/{DAILY_MIN.length}</span>
          </div>
          <p className="text-sm text-muted mb-3">{msg} — Làm được 70% là thắng.</p>
          <div className="space-y-2">
            {DAILY_MIN.map((item, i) => (
              <button key={i} onClick={() => toggle(i)} className="w-full flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left hover:border-orange-500/30 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={checked[i] ? { background: CAT_COLORS[item.cat], borderColor: CAT_COLORS[item.cat] } : { borderColor: 'var(--border)' }}>
                  {checked[i] && <span className="text-white text-sm font-bold">✓</span>}
                </div>
                <span className="text-xl">{item.icon}</span>
                <span className={`text-base flex-1 ${checked[i] ? 'line-through text-muted' : 'text-text'}`}>{item.label}</span>
                <span className="text-sm px-1.5 py-0.5 rounded font-bold" style={{ background: `${CAT_COLORS[item.cat]}20`, color: CAT_COLORS[item.cat] }}>{item.cat}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {WEEKLY_ITEMS.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-base text-text">{item.label}</div>
                <div className="text-sm text-muted">{item.target}</div>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(d => (
                  <button key={d} onClick={() => {
                    const key = `${i}-${d}`;
                    const u = { ...weekData, [key]: !weekData[key] };
                    setWeekData(u);
                    localStorage.setItem('healthapp_f_weekly', JSON.stringify(u));
                  }} className="w-5 h-5 rounded transition-colors shrink-0"
                    style={weekData[`${i}-${d}`] ? { background: COLOR } : { background: 'var(--border)' }} />
                ))}
              </div>
            </div>
          ))}
          <p className="text-sm text-muted">Mỗi ô tương ứng 1 ngày trong tuần. Nhấn để tick.</p>
        </div>
      )}
    </div>
  );
}

// --- F2 Workout Log tab ---
function F2WorkoutLog() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_workout') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ exercise: '', duration: '', rpe: 5, feeling: '', next: '' });

  function add() {
    if (!form.exercise) return;
    const entry = { ...form, date: new Date().toLocaleDateString('vi-VN'), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    const u = [entry, ...entries].slice(0, 30);
    setEntries(u);
    localStorage.setItem('healthapp_f_workout', JSON.stringify(u));
    setForm({ exercise: '', duration: '', rpe: 5, feeling: '', next: '' });
  }

  const RPE_COLORS = { 1: '#22c55e', 2: '#22c55e', 3: '#84cc16', 4: '#84cc16', 5: '#eab308', 6: '#eab308', 7: '#f97316', 8: '#f97316', 9: '#ef4444', 10: '#ef4444' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
        <h3 className="font-bold text-text text-base">Ghi Buổi Tập Mới</h3>
        <input value={form.exercise} onChange={e => setForm(p => ({ ...p, exercise: e.target.value }))} placeholder="Bài tập (vd: Full body 20 phút)" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-base text-text placeholder-muted" />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Thời lượng (vd: 25 phút)" className="bg-bg border border-border rounded-xl px-3 py-2 text-base text-text placeholder-muted" />
          <input value={form.feeling} onChange={e => setForm(p => ({ ...p, feeling: e.target.value }))} placeholder="Cảm giác (vd: Hơi mệt)" className="bg-bg border border-border rounded-xl px-3 py-2 text-base text-text placeholder-muted" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted shrink-0">RPE: <strong style={{ color: RPE_COLORS[form.rpe] }}>{form.rpe}/10</strong></span>
          <input type="range" min={1} max={10} value={form.rpe} onChange={e => setForm(p => ({ ...p, rpe: +e.target.value }))} className="flex-1" />
        </div>
        <input value={form.next} onChange={e => setForm(p => ({ ...p, next: e.target.value }))} placeholder="Lần sau (vd: Tăng 2 lần squat)" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-base text-text placeholder-muted" />
        <button onClick={add} className="w-full py-2 rounded-xl text-base font-bold text-white" style={{ background: COLOR }}>+ Lưu Buổi Tập</button>
      </div>
      {entries.length === 0 && <p className="text-center text-muted text-base py-6">Chưa có nhật ký. Ghi buổi tập đầu tiên.</p>}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {entries.map((e, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: RPE_COLORS[e.rpe] }} />
              <span className="text-base font-bold text-text">{e.exercise}</span>
              <span className="ml-auto text-sm text-muted">{e.date}</span>
            </div>
            <div className="flex gap-3 text-sm text-muted">
              {e.duration && <span>⏱ {e.duration}</span>}
              <span>RPE <strong style={{ color: RPE_COLORS[e.rpe] }}>{e.rpe}</strong></span>
              {e.feeling && <span>💬 {e.feeling}</span>}
            </div>
            {e.next && <p className="text-sm text-muted mt-1">Lần sau: {e.next}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- F3 Meal Plan tab ---
function F3MealPlan() {
  const PLATE_PARTS = [
    { label: '½ đĩa — Rau, canh, salad, trái cây ít ngọt', color: '#22c55e', pct: 50 },
    { label: '¼ đĩa — Đạm: thịt, cá, trứng, đậu', color: '#f97316', pct: 25 },
    { label: '¼ đĩa — Tinh bột: cơm, bún, khoai, yến mạch', color: '#eab308', pct: 25 },
  ];
  const MEALS = [
    { meal: 'Sáng', formula: 'Đạm + tinh bột tốt + trái cây/rau', eg: 'Trứng + yến mạch + chuối' },
    { meal: 'Trưa', formula: '½ rau + ¼ đạm + ¼ tinh bột', eg: 'Cơm + cá + rau luộc' },
    { meal: 'Phụ', formula: 'Đạm nhẹ hoặc trái cây', eg: 'Sữa chua + trái cây' },
    { meal: 'Tối', formula: 'Đạm + rau nhiều + tinh bột vừa', eg: 'Gà/cá + salad + khoai' },
    { meal: 'Sau tập', formula: 'Đạm nhanh + carb dễ tiêu', eg: 'Sữa/whey + chuối' },
  ];
  const [log, setLog] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_meal') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return {};
      return s.data || {};
    } catch { return {}; }
  });

  function setVal(key, val) {
    const u = { ...log, [key]: val };
    setLog(u);
    localStorage.setItem('healthapp_f_meal', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="font-bold text-text mb-3">Template Đĩa Ăn Lành Mạnh</h3>
        <div className="space-y-2 mb-3">
          {PLATE_PARTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="rounded-full" style={{ width: `${p.pct * 2}px`, height: 8, background: p.color, minWidth: 20 }} />
              <span className="text-sm text-muted">{p.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted">+ Một lượng nhỏ chất béo tốt: dầu olive, bơ, các loại hạt.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="grid grid-cols-3 text-sm font-bold uppercase tracking-widest p-3 border-b border-border" style={{ color: COLOR }}>
          <span>Bữa</span><span>Công thức</span><span>Ví dụ</span>
        </div>
        {MEALS.map((m, i) => (
          <div key={i} className="grid grid-cols-3 p-3 border-b border-border/50 text-sm">
            <span className="font-bold text-text">{m.meal}</span>
            <span className="text-muted">{m.formula}</span>
            <span className="text-muted">{m.eg}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="font-bold text-text mb-3 text-base">Nhật Ký Dinh Dưỡng Hôm Nay</h3>
        <div className="space-y-2">
          {[['protein', 'Protein đủ?', '🥩'], ['veg', 'Rau đủ?', '🥦'], ['water', 'Nước đủ?', '💧'], ['sugar', 'Ít đồ ngọt?', '🍬']].map(([k, label, ic]) => (
            <div key={k} className="flex items-center gap-3">
              <span>{ic}</span>
              <span className="text-base text-text flex-1">{label}</span>
              <div className="flex gap-2">
                {['Có', 'Chưa'].map(opt => (
                  <button key={opt} onClick={() => setVal(k, opt)} className="px-3 py-1 rounded-lg text-sm font-bold border transition-colors"
                    style={log[k] === opt ? { background: COLOR, color: 'white', borderColor: COLOR } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- F4 Lifestyle tab ---
function F4Lifestyle() {
  const [data, setData] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_lifestyle') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return { sleep: 7, steps: 5000, energy: 7 };
      return s.data || { sleep: 7, steps: 5000, energy: 7 };
    } catch { return { sleep: 7, steps: 5000, energy: 7 }; }
  });

  function set(k, v) {
    const u = { ...data, [k]: v };
    setData(u);
    localStorage.setItem('healthapp_f_lifestyle', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  return (
    <div className="space-y-4">
      {[
        { key: 'sleep', icon: '😴', label: 'Giấc ngủ tối qua', min: 4, max: 10, step: 0.5, unit: 'giờ', good: v => v >= 7 ? '#22c55e' : v >= 6 ? '#eab308' : '#ef4444' },
        { key: 'steps', icon: '🚶', label: 'Số bước chân hôm nay', min: 1000, max: 15000, step: 500, unit: 'bước', good: v => v >= 8000 ? '#22c55e' : v >= 5000 ? '#eab308' : '#ef4444' },
        { key: 'energy', icon: '⚡', label: 'Mức năng lượng', min: 1, max: 10, step: 1, unit: '/10', good: v => v >= 7 ? '#22c55e' : v >= 5 ? '#eab308' : '#ef4444' },
      ].map(item => (
        <div key={item.key} className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-base text-text font-medium flex-1">{item.label}</span>
            <span className="text-2xl font-black" style={{ color: item.good(data[item.key]) }}>{data[item.key]}<span className="text-sm font-normal ml-0.5">{item.unit}</span></span>
          </div>
          <input type="range" min={item.min} max={item.max} step={item.step} value={data[item.key]} onChange={e => set(item.key, +e.target.value)} className="w-full" />
        </div>
      ))}
      <div className="rounded-2xl border p-3 text-sm text-muted" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.04)` }}>
        Dữ liệu lưu theo ngày trong thiết bị của bạn. <Link to="/pillar/f/lifestyle-tracker" className="underline" style={{ color: COLOR }}>Xem lịch sử →</Link>
      </div>
    </div>
  );
}

// --- F5 Mind Tracker tab ---
function F5MindTracker() {
  const MOODS = ['😞', '😐', '🙂', '😊', '🤩'];
  const [data, setData] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_mind') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return { stress: 5, mood: 2, calm: false, journal: '' };
      return s.data || { stress: 5, mood: 2, calm: false, journal: '' };
    } catch { return { stress: 5, mood: 2, calm: false, journal: '' }; }
  });

  function set(k, v) {
    const u = { ...data, [k]: v };
    setData(u);
    localStorage.setItem('healthapp_f_mind', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <span>😓</span>
          <span className="text-base text-text flex-1">Mức stress hôm nay</span>
          <span className="font-black" style={{ color: data.stress >= 7 ? '#ef4444' : data.stress >= 5 ? '#f97316' : '#22c55e' }}>{data.stress}/10</span>
        </div>
        <input type="range" min={1} max={10} value={data.stress} onChange={e => set('stress', +e.target.value)} className="w-full" />
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <span className="text-base text-text block mb-3">Tâm trạng hôm nay</span>
        <div className="flex gap-3 justify-center">
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => set('mood', i)}
              className="text-4xl transition-all duration-200"
              style={{ opacity: data.mood === i ? 1 : 0.35, transform: data.mood === i ? 'scale(1.3)' : 'scale(1)' }}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base text-text">Đã có calm practice hôm nay?</span>
          <button onClick={() => set('calm', !data.calm)} className="px-4 py-1.5 rounded-xl text-base font-bold transition-colors"
            style={data.calm ? { background: '#a855f7', color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
            {data.calm ? '✓ Đã làm' : 'Chưa'}
          </button>
        </div>
        <p className="text-sm text-muted">Thở chậm, thiền, đi bộ không điện thoại, journaling...</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        <span className="text-base text-text block mb-2">Ghi nhanh 1 dòng</span>
        <textarea value={data.journal} onChange={e => set('journal', e.target.value)} rows={2} placeholder="Hôm nay tôi cảm thấy... / Điều làm tôi khó tập trung là..." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-base text-text placeholder-muted resize-none" />
      </div>
    </div>
  );
}

// --- F6 Progress Test tab ---
function F6Test() {
  const [vals, setVals] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_f_test') || '{}'); } catch { return {}; } });
  const [saved, setSaved] = useState(false);

  function set(k, v) { setVals(p => ({ ...p, [k]: v })); }
  function save() {
    const entry = { ...vals, date: new Date().toLocaleDateString('vi-VN') };
    try {
      const hist = JSON.parse(localStorage.getItem('healthapp_f_test_hist') || '[]');
      const filtered = hist.filter(h => h.date !== entry.date);
      localStorage.setItem('healthapp_f_test_hist', JSON.stringify([entry, ...filtered].slice(0, 4)));
      localStorage.setItem('healthapp_f_test', JSON.stringify(vals));
    } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="text-base text-muted">Thực hiện test đầu vào và mỗi 4 tuần một lần để đo tiến bộ toàn diện.</p>
      <div className="space-y-2">
        {TEST_ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface p-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-base text-text font-medium">{item.label}</div>
              <div className="text-sm text-muted">{item.how}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input value={vals[item.label] || ''} onChange={e => set(item.label, e.target.value)} placeholder="0" className="w-16 bg-bg border border-border rounded-lg px-2 py-1 text-base text-text text-center" />
              <span className="text-sm text-muted w-16">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} className="w-full py-2 rounded-xl text-base font-bold text-white transition-all" style={{ background: saved ? '#22c55e' : COLOR }}>
        {saved ? '✓ Đã lưu!' : 'Lưu Kết Quả Test'}
      </button>
      <Link to="/pillar/f/progress-test" className="block text-center text-sm" style={{ color: COLOR }}>Xem bảng so sánh 4 tuần →</Link>
    </div>
  );
}

// --- F7 Quick Workouts tab ---
function F7QuickWorkouts() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      <p className="text-base text-muted">Nguyên tắc: Có 5 phút vẫn làm được. Không bỏ hẳn — chỉ cần chọn bản ngắn hơn.</p>
      {QUICK_WO.map((wo, i) => (
        <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors">
            <span className="font-black text-base w-16" style={{ color: wo.color }}>{wo.dur}</span>
            <span className="font-bold text-base text-text flex-1">{wo.label}</span>
            <span className="text-muted">{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
              <ol className="space-y-1">
                {wo.steps.map((s, j) => (
                  <li key={j} className="flex gap-2 text-base text-muted">
                    <span style={{ color: wo.color }} className="shrink-0 font-bold">{j + 1}.</span>{s}
                  </li>
                ))}
              </ol>
              <p className="text-sm text-muted border-l-2 pl-2 mt-2" style={{ borderColor: wo.color }}>{wo.note}</p>
            </div>
          )}
        </div>
      ))}
      <Link to="/pillar/f/quick-workouts" className="block text-center text-sm py-2" style={{ color: COLOR }}>Xem đầy đủ thư viện bài nhanh →</Link>
    </div>
  );
}

// --- Main component ---
export default function PillarF() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarF', { returnObjects: true });
  const [tab, setTab] = useState('f0');
  const tabBarRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pf-orbit-kf';
    style.textContent = ORBIT_CSS;
    document.head.appendChild(style);
    return () => document.getElementById('pf-orbit-kf')?.remove();
  }, []);

  const tabContent = { f0: <F0Dashboard />, f1: <F1Checklist />, f2: <F2WorkoutLog />, f3: <F3MealPlan />, f4: <F4Lifestyle />, f5: <F5MindTracker />, f6: <F6Test />, f7: <F7QuickWorkouts /> };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Sống Khỏe 360</Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🛠️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
            {pillar?.title || 'Công Cụ & Tài Nguyên'}
          </h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {pillar?.subtitle || 'Tools & Resources'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{pillar?.description || 'Biến mọi kiến thức A–E thành hành động cụ thể mỗi ngày.'}</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        {HERO_STATS.map((s, i) => (
          <div key={i} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={`hero-f-${i}`} color={COLOR} />
            </div>
            <div className="rounded-2xl border px-4 py-3 cursor-default" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
              <div className="text-3xl font-black" style={{ color: COLOR }}>{s.v}</div>
              <div className="text-sm text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Image */}
      <div className="pf-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Công cụ sống khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {pillar?.image_caption || 'Tools & Resources'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Sticky Tab Bar */}
      <div ref={tabBarRef} className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-3 mb-8 bg-bg/95 backdrop-blur border-b border-border">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-4xl mx-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all shrink-0"
              style={tab === t.id ? { background: COLOR, color: 'white' } : { color: 'var(--muted)', background: 'transparent' }}>
              <span>{t.icon}</span><span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <RevealBlock key={tab} delay={0} className="mb-14">
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `rgba(${RGB},0.15)`, animation: `pb-frame-f0 4s ease-in-out infinite` }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{TABS.find(t => t.id === tab)?.icon}</span>
            <h2 className="text-xl font-bold text-text">{TABS.find(t => t.id === tab)?.label}</h2>
          </div>
          {tabContent[tab]}
        </div>
      </RevealBlock>

      {/* Sub-page Teaser Grid */}
      <RevealBlock delay={1} className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">Công Cụ & Tài Nguyên Chi Tiết</h2>
        <p className="text-muted text-base mb-10">11 chuyên đề chuyên sâu để bạn xây hệ thống sống khỏe hoàn chỉnh.</p>
        {TEASER_SECTIONS.map((sec, i) => (
          <TeaserSection key={i} title={sec.title}>
            {sec.cards.map((card, j) => (
              <RevealBlock key={j} delay={j + 1}>
                <TeaserCard {...card} />
              </RevealBlock>
            ))}
          </TeaserSection>
        ))}
      </RevealBlock>

      {/* Bottom disclaimer */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
      <p className="text-sm text-muted text-center">Mọi dữ liệu được lưu cục bộ trong thiết bị của bạn, không gửi lên server. Công cụ không thay thế tư vấn y tế chuyên nghiệp.</p>
    </div>
  );
}
