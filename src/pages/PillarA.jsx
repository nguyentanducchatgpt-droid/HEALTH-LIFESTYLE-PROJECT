import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// ─── Tab data ───────────────────────────────────────────────────────────────────

const TABS = [
  {
    n: '01',
    path: '/pillar/a/movements',
    title: '6 Mẫu Vận Động Nền Tảng',
    sub: 'Khởi Động & Giãn Cơ Sau Tập',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=65',
    longDesc: 'Học 6 mẫu chuyển động cơ bản — nền tảng của mọi chương trình tập luyện hiệu quả. Mỗi bài tập có video minh họa chi tiết, từ tư thế chuẩn đến biến thể nâng cao. Kết hợp khởi động 5–8 phút và giãn cơ sau tập, bạn có một buổi hoàn chỉnh và an toàn.',
    highlights: [
      { icon: '🎬', title: 'Video HD từng bài', desc: 'Xem rõ góc độ, kỹ thuật và cue vận động chuẩn' },
      { icon: '📊', title: '3 cấp độ/bài tập',  desc: 'Từ cơ bản đến nâng cao — tiến bộ từng bước rõ ràng' },
      { icon: '🔥', title: 'Khởi động chuẩn khoa học', desc: 'Giảm nguy cơ chấn thương và tăng hiệu suất 15–20%' },
    ],
    quote: 'Thành thạo 6 mẫu chuyển động cơ bản — bạn có nền tảng cho 95% mọi bài tập trong cuộc đời.',
    quoteContext: 'Nguyên lý sinh cơ học hiện đại',
    details: [
      { icon: '🦴', title: 'Tại sao chỉ 6 mẫu?', body: 'Các nhà sinh cơ học phân tích hàng nghìn bài tập và tìm thấy chúng đều là biến thể của 6 mẫu cơ bản. Thành thạo 6 mẫu = nền tảng vĩnh cửu cho mọi chương trình.' },
      { icon: '🔄', title: 'Biến thể không giới hạn', body: 'Mỗi mẫu có 5–10+ biến thể từ siêu dễ đến nâng cao. Squat vào ghế → Pistol squat. Không cần thiết bị — tư thế đúng là tất cả.' },
      { icon: '⚖️', title: 'Cân bằng cơ thể toàn diện', body: 'Push + Pull cân bằng cơ trước/sau. Squat + Hinge phát triển toàn hạ bộ. Core ổn định cột sống. Breath kiểm soát toàn bộ hệ thống — đây là vòng lặp hoàn hảo.' },
    ],
    tabStats: [{ n: '6', label: 'Bài tập' }, { n: '3×', label: 'Cấp độ/bài' }, { n: '15\'', label: 'Khởi + Giãn' }],
    previewItems: ['Squat', 'Hinge', 'Push-up', 'Pull/Row', 'Core', 'Thở & Tim mạch', 'Khởi động 5–8\'', 'Giãn cơ 5–10\''],
    cta: 'Học động tác',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.18)',
    text:  'text-green-400',
    badge: 'bg-green-500/8 border-green-500/20 text-green-400',
    dot:   'bg-green-400',
    chip:  'bg-green-500/10 border-green-500/20 text-green-300',
    border:'border-green-500/30',
    accentBg: 'bg-green-500/8',
    tabBg:    'bg-green-500/5',
    bar:   'from-green-500/80 to-transparent',
  },
  {
    n: '02',
    path: '/pillar/a/framework',
    title: 'Khung Ngày Tập 20–40 Phút',
    sub: 'Chọn Khung Thời Gian Luyện Tập',
    icon: '⏱️',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=65',
    longDesc: 'Buổi tập không cần dài — cần đúng cấu trúc. 4 khối thời gian trong ngày (Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm) cho phép tập có mục đích trong bất kỳ thời lượng nào. Chọn khung phù hợp — mỗi phút đều có kế hoạch rõ ràng.',
    highlights: [
      { icon: '⚡', title: '4 khối thời gian chuẩn', desc: 'Cấu trúc khoa học cho mỗi buổi tập' },
      { icon: '📐', title: '8 mức: 20–180 phút',      desc: 'Từ siêu bận đến chuyên sâu — đều có lịch' },
      { icon: '💡', title: 'Chi tiết từng phút',       desc: 'Biết chính xác làm gì trong mỗi khoảng thời gian' },
    ],
    quote: 'Cấu trúc tốt quan trọng hơn thời gian dài. 20 phút có kế hoạch hiệu quả hơn 1 giờ tự do.',
    quoteContext: 'Khoa học hành vi tập luyện',
    details: [
      { icon: '🧠', title: 'Não bộ cần cấu trúc', body: 'Giảm quyết định trong buổi tập giúp tập trung vào chất lượng động tác, không phải "tập gì tiếp theo". Cấu trúc rõ ràng = ít burnout hơn và nhất quán hơn theo thời gian.' },
      { icon: '⚡', title: '4 khối — một cấu trúc vạn năng', body: 'Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm. Buổi 20 phút hay 180 phút đều dùng cùng cấu trúc này, chỉ thay đổi tỉ lệ thời gian giữa các khối.' },
      { icon: '🌙', title: 'Tĩnh tâm 5 phút — không phải xa xỉ', body: '5 phút thở có kiểm soát sau tập giảm cortisol 15% và cải thiện giấc ngủ đêm. Đây là đầu tư nhỏ nhất với lợi ích phục hồi lớn nhất trong ngày.' },
    ],
    tabStats: [{ n: '4', label: 'Khối/ngày' }, { n: '8', label: 'Mức thời gian' }, { n: '20\'', label: 'Tối thiểu' }],
    previewItems: ['Khởi động 5\'', 'Sức mạnh 10–20\'', 'Tim mạch 15–35\'', 'Giãn cơ 5–10\'', 'Tĩnh tâm 5\'', '7 kcal/phút max'],
    cta: 'Xây khung ngày',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.18)',
    text:  'text-orange-400',
    badge: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
    dot:   'bg-orange-400',
    chip:  'bg-orange-500/10 border-orange-500/20 text-orange-300',
    border:'border-orange-500/30',
    accentBg: 'bg-orange-500/8',
    tabBg:    'bg-orange-500/5',
    bar:   'from-orange-500/80 to-transparent',
  },
  {
    n: '03',
    path: '/pillar/a/weekly',
    title: 'Nhịp Tuần Gợi Ý',
    sub: 'Buổi Tập Theo Mục Tiêu',
    icon: '📅',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=65',
    longDesc: 'Thể lực được xây qua tuần, không phải qua ngày. 3 giai đoạn nhịp tuần (Bắt đầu → Xây nền → Nâng cao) giúp cơ thể thích nghi từng bước mà không burnout. 6 lộ trình theo mục tiêu giúp bạn chọn đúng nhịp cho hoàn cảnh cụ thể của mình.',
    highlights: [
      { icon: '🗓', title: '3 giai đoạn nhịp tuần', desc: 'Tiến bộ từng bước, không burnout' },
      { icon: '🎯', title: '6 lộ trình theo mục tiêu', desc: 'Từ siêu bận đến vận động viên chuyên sâu' },
      { icon: '😴', title: 'Nghỉ đúng cách',          desc: 'Phục hồi là phần thiết yếu, không phải lười biếng' },
    ],
    quote: 'Cơ thể phát triển trong thời gian nghỉ ngơi — không phải trong buổi tập. Nhịp tuần là nghệ thuật biết lúc nào dừng.',
    quoteContext: 'Sinh lý học tập luyện',
    details: [
      { icon: '🔬', title: 'Cửa sổ phục hồi 48–72 giờ', body: 'Cơ bắp cần 48–72 giờ để sửa chữa vi chấn thương và tăng trưởng. Thiết kế nhịp tuần đúng tạo đủ khoảng cách giữa các buổi cùng nhóm cơ — đây là nền tảng của progressive overload.' },
      { icon: '📈', title: '3 giai đoạn thích nghi dần', body: 'Giai đoạn 1 (tuần 1–2): 3 buổi/tuần — cơ thể học nhận diện tải. Giai đoạn 2 (tuần 3–6): 4 buổi — xây nền sức mạnh. Giai đoạn 3 (tuần 7+): 5–6 buổi — cá nhân hóa theo mục tiêu.' },
      { icon: '🎯', title: 'Chọn nhịp bền vững, không phải lý tưởng', body: '6 lộ trình từ 2 buổi/tuần (siêu bận) đến 6 buổi/tuần (vận động viên). Nhịp tốt nhất không phải nhịp cao nhất — là nhịp bạn duy trì được 12 tuần liên tục.' },
    ],
    tabStats: [{ n: '3', label: 'Giai đoạn' }, { n: '6', label: 'Lộ trình' }, { n: '7', label: 'Ngày/tuần' }],
    previewItems: ['Sức mạnh T2/T4/T6', 'Cardio T3/T5', 'Phục hồi T7', 'Người mới', 'Giảm mỡ', 'Tăng cơ', 'Sức bền', 'Nâng cao'],
    cta: 'Lên lịch tuần',
    color: '#14b8a6',
    glow: 'rgba(20,184,166,0.18)',
    text:  'text-teal-400',
    badge: 'bg-teal-500/8 border-teal-500/20 text-teal-400',
    dot:   'bg-teal-400',
    chip:  'bg-teal-500/10 border-teal-500/20 text-teal-300',
    border:'border-teal-500/30',
    accentBg: 'bg-teal-500/8',
    tabBg:    'bg-teal-500/5',
    bar:   'from-teal-500/80 to-transparent',
  },
  {
    n: '04',
    path: '/pillar/a/progress',
    title: 'Bậc Thang Tiến Bộ',
    sub: 'Kiểm Tra Tiến Bộ Hàng Tháng',
    icon: '🏆',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65',
    longDesc: 'Tiến bộ mà không đo được thì không bền vững. Bậc thang tiến bộ cho bạn thấy rõ đang ở đâu và cần làm gì tiếp theo. Kết hợp test 3 kỳ (Tuần 4, 8, 12) và radar chart 4 chiều, bạn có bức tranh toàn diện về sức khỏe thể chất.',
    highlights: [
      { icon: '🪜', title: 'Bậc thang rõ ràng',     desc: 'Biết chính xác bước tiếp theo trong hành trình' },
      { icon: '🎯', title: 'Test định kỳ 3 kỳ',     desc: 'Kiểm tra tuần 4, tuần 8 và tuần 12' },
      { icon: '📊', title: 'Radar chart 4 chiều',   desc: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi' },
    ],
    quote: 'Những gì không đo được thì không cải thiện được. Tiến bộ nhỏ, đo được, nhất quán — đó là công thức thật sự.',
    quoteContext: 'Nguyên lý quản lý hiệu suất',
    details: [
      { icon: '📋', title: 'Test công bằng — không phải ngẫu hứng', body: '3 kỳ test (Tuần 4, 8, 12) được lên kế hoạch khi cơ thể đã phục hồi hoàn toàn — không phải sau buổi tập nặng. Điều kiện test nhất quán cho kết quả đáng tin cậy.' },
      { icon: '🕸️', title: 'Radar chart 4 chiều — thấy điểm yếu ẩn', body: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi. Nhiều người mạnh về sức mạnh nhưng kém linh hoạt — đây là nguy cơ chấn thương ẩn mà chỉ nhìn một chỉ số không thấy được.' },
      { icon: '🪜', title: '5 bậc — biết rõ vị trí và đích đến', body: 'Bậc 1 (Hoạt động cơ bản) đến Bậc 5 (Vận động viên). Mỗi bậc có tiêu chí rõ ràng: bài tập nào, reps/sets bao nhiêu, thời gian phục hồi. Không còn cảm giác "không biết tập đến đâu rồi".' },
    ],
    tabStats: [{ n: '6', label: 'Lộ trình' }, { n: '5', label: 'Bậc/lộ trình' }, { n: '4', label: 'Chiều đánh giá' }],
    previewItems: ['Tuần 4 test', 'Tuần 8 test', 'Tuần 12 test', 'Radar chart', '6 mục tiêu cá nhân', 'Điểm A/B/C/D', 'Coach notes'],
    cta: 'Theo dõi tiến bộ',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.18)',
    text:  'text-purple-400',
    badge: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
    dot:   'bg-purple-400',
    chip:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    border:'border-purple-500/30',
    accentBg: 'bg-purple-500/8',
    tabBg:    'bg-purple-500/5',
    bar:   'from-purple-500/80 to-transparent',
  },
];

const PRINCIPLES = [
  {
    icon: '🎯',
    title: 'Kỹ thuật đúng là nền tảng',
    body: 'Học đúng từ đầu tiết kiệm hàng năm tập sai. 6 mẫu vận động cơ bản bao phủ 95% mọi bài tập bạn cần trong cuộc đời — không cần thiết bị phức tạp.',
  },
  {
    icon: '🔁',
    title: 'Nhất quán quan trọng hơn cường độ',
    body: 'Não bộ xây thói quen qua lặp lại đều đặn. 3 buổi/tuần duy trì 12 tuần tốt hơn 7 buổi/tuần rồi burnout sau 3 tuần — cơ thể cần thời gian thích nghi.',
  },
  {
    icon: '📊',
    title: 'Đo để không lạc hướng',
    body: 'Tiến bộ mà không thấy được thì dễ nản lòng. Mốc rõ ràng mỗi 4 tuần cho bạn biết chính xác mình đang ở đâu và cần điều chỉnh gì tiếp theo.',
  },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedStat({ n, label, color }) {
  const numericPart = parseFloat(n.replace(/[^0-9.]/g, ''));
  const suffix = n.replace(/[0-9.]/g, '');
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!numericPart) return;
    let raf;
    const t0 = performance.now();
    const delay = setTimeout(() => {
      const tick = (now) => {
        const p = Math.min((now - t0) / 900, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * numericPart));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 350);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, []); // runs on mount — TabPanel remounts on every tab switch

  const display = numericPart > 0 ? `${val}${suffix}` : n;
  return (
    <div className="bg-bg/85 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
      <div className="text-lg font-black leading-none mb-0.5" style={{ color }}>{display}</div>
      <div className="text-[9px] text-muted leading-snug">{label}</div>
    </div>
  );
}

// ─── Tab content panel ──────────────────────────────────────────────────────────

function TabPanel({ tab }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border ${tab.border}`} style={{ background: `${tab.color}03` }}>
      {/* Top accent gradient line */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${tab.color}ee, ${tab.color}40, transparent)` }} />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={tab.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.05 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/60 to-bg/95" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: tab.glow }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: `${tab.color}06` }} />
      </div>

      {/* ── QUOTE BLOCK (full width) ── */}
      <div className="relative z-10 px-7 md:px-10 pt-8 pb-6 border-b" style={{ borderColor: `${tab.color}18` }}>
        <div className="flex items-start gap-4">
          <span className="text-5xl font-black leading-[0.7] shrink-0 select-none" style={{ color: `${tab.color}40` }}>"</span>
          <div>
            <p className="text-base md:text-lg font-semibold text-text/90 leading-relaxed italic mb-2">{tab.quote}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${tab.color}80` }}>— {tab.quoteContext}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="relative z-10 p-7 md:p-10 grid md:grid-cols-[58%_42%] gap-8 md:gap-10">
        {/* ── LEFT ── */}
        <div className="flex flex-col">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 border text-[10px] font-bold px-3 py-1.5 rounded-full mb-5 self-start ${tab.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
            {tab.n} / 04 · {tab.sub}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-text leading-tight mb-2">{tab.title}</h2>
          <p className={`text-xs font-bold ${tab.text} mb-4 opacity-80`}>{tab.sub}</p>
          <p className="text-muted text-sm leading-relaxed mb-7">{tab.longDesc}</p>

          {/* Highlights — staggered fade in */}
          <div className="space-y-3 mb-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted/60 mb-2">Điểm nổi bật</p>
            {tab.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 group animate-fade-in-up"
                style={{ animationDelay: `${i * 70 + 80}ms`, animationFillMode: 'both' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${tab.color}10`, borderColor: `${tab.color}25` }}
                >
                  {h.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-text leading-tight">{h.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, ${tab.color}20, transparent)` }} />

          {/* Details — staggered, with colored left border */}
          <div className="space-y-4 mb-8">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted/60 mb-2">Hiểu sâu hơn</p>
            {tab.details.map((d, i) => (
              <div
                key={i}
                className="flex gap-3.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 90 + 280}ms`, animationFillMode: 'both' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border mt-0.5"
                  style={{ background: `${tab.color}08`, borderColor: `${tab.color}20` }}
                >
                  {d.icon}
                </div>
                <div className="flex-1 pl-3 border-l" style={{ borderColor: `${tab.color}25` }}>
                  <p className="text-xs font-bold text-text/90 leading-tight mb-1">{d.title}</p>
                  <p className="text-[11px] text-muted leading-relaxed">{d.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="mt-auto">
            <Link
              to={tab.path}
              className="inline-flex items-center gap-2.5 font-bold text-sm px-7 py-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 group"
              style={{ background: `${tab.color}12`, borderColor: `${tab.color}40`, color: tab.color }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${tab.glow}`; e.currentTarget.style.background = `${tab.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = `${tab.color}12`; }}
            >
              {tab.cta}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex flex-col gap-5">
          {/* Hero image with animated stats */}
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={tab.img} alt={tab.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tab.color}0a, transparent 60%)` }} />

            {/* Tab number watermark */}
            <div className="absolute top-3 right-4 font-black text-6xl leading-none select-none pointer-events-none" style={{ color: `${tab.color}15` }}>{tab.n}</div>

            {/* Animated stats overlay */}
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
              {tab.tabStats.map((s, i) => (
                <AnimatedStat key={i} n={s.n} label={s.label} color={tab.color} />
              ))}
            </div>
          </div>

          {/* Content chips */}
          <div>
            <p className="text-[9px] font-bold text-muted/60 uppercase tracking-widest mb-2">Nội dung bên trong</p>
            <div className="flex flex-wrap gap-1.5">
              {tab.previewItems.map(item => (
                <span key={item} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${tab.chip}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarA', { returnObjects: true });

  const [activeTab, setActiveTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const tabBarRef = useRef(null);
  const journeyRef = useRef(null);
  const stepRefs = useRef([]);
  const [jets, setJets] = useState([]);

  // Inject water-jet keyframe once
  useEffect(() => {
    const id = 'wj-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes wjFly {
        0%   { transform: translate(0px, var(--wy,0px)) scale(1);    opacity: 0.95; }
        38%  { transform: translate(calc(var(--wx)*0.38), calc(var(--wy,0px) + var(--wa,-18px))) scale(0.72); opacity: 0.85; }
        100% { transform: translate(var(--wx), var(--wy,0px)) scale(0.1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  // Inject orbit-border keyframe once
  useEffect(() => {
    const id = 'pa-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pa-orbit-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes paOrbitSpin {
        to { --pa-orbit-angle: 360deg; }
      }
      .pa-orbit-ring {
        background: conic-gradient(
          from var(--pa-orbit-angle),
          transparent 0deg,
          transparent 55deg,
          rgba(34,197,94,0.0) 65deg,
          rgba(34,197,94,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg,
          rgba(34,197,94,0.75) 99deg,
          rgba(34,197,94,0.0) 115deg,
          transparent 125deg,
          transparent 360deg
        );
        animation: paOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

  const fireJet = useCallback((fromIdx, toIdx) => {
    const fromEl = stepRefs.current[fromIdx];
    const toEl   = stepRefs.current[toIdx];
    const cnt    = journeyRef.current;
    if (!fromEl || !toEl || !cnt) return;

    const fR = fromEl.getBoundingClientRect();
    const tR = toEl.getBoundingClientRect();
    const cR = cnt.getBoundingClientRect();

    const ox = fR.left + fR.width  / 2 - cR.left;
    const oy = fR.top  + 18         - cR.top;   // 18 = half of 36px circle
    const dx = tR.left + tR.width  / 2 - cR.left - ox;

    const batch = Date.now();
    const color = TABS[fromIdx].color;

    const newJets = Array.from({ length: 14 }, (_, k) => ({
      id:    `${batch}-${k}`,
      ox,    oy,    dx,
      arc:   -(6 + Math.random() * 30),
      ys:    (Math.random() - 0.5) * 20,
      color,
      size:  2.5 + Math.random() * 4,
      delay: k * 22,
      dur:   340 + Math.random() * 210,
    }));

    setJets(prev => [...prev, ...newJets]);
    setTimeout(() => setJets(prev => prev.filter(j => !j.id.startsWith(String(batch)))), 950);
  }, []);

  // Cooldown ref — prevent refiring same step within 550ms
  const hoverCooldown = useRef({});
  const fireJetOnHover = useCallback((i) => {
    if (i >= TABS.length - 1) return; // last step has no next
    const now = Date.now();
    if (hoverCooldown.current[i] && now - hoverCooldown.current[i] < 550) return;
    hoverCooldown.current[i] = now;
    fireJet(i, i + 1);
  }, [fireJet]);

  const switchTab = useCallback((i) => {
    if (i === activeTab) return;
    setActiveTab(i);
    setTabKey(k => k + 1);
  }, [activeTab]);

  // Keep active tab card visible on mobile when switching (skip on initial mount)
  const didMountTab = useRef(false);
  useEffect(() => {
    if (!didMountTab.current) { didMountTab.current = true; return; }
    const bar = tabBarRef.current;
    if (!bar) return;
    const btn = bar.children[activeTab];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-sm">{tCommon('common.loading')}</span>
      </div>
    );
  }

  const tab = TABS[activeTab];

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── HERO ────────────────────────────────────────────────────────────────── */}

      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/pillars"
          className="inline-flex items-center gap-2 text-muted hover:text-accent text-sm transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          6 Trụ Cột
        </Link>
      </div>

      {/* Icon + Title */}
      <div className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-5xl bg-surface border border-accent/20 shrink-0 animate-float">
            🏃
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
              {pillar.title}
            </h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mt-3 mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              {pillar.subtitle}
            </span>
            <p className="text-muted text-base leading-relaxed max-w-2xl">
              {pillar.description}
            </p>
          </div>
        </div>
      </div>

      {/* Wide image with orbit glow border */}
      <div className="pa-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=70"
            alt="exercise training"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-accent text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-accent/20">
              Luyện Tập Hằng Ngày
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ── NARRATIVE INTRO ────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-14">

        {/* Opening statement */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl font-semibold text-text/85 leading-relaxed mb-3">
            Tập luyện hiệu quả không phải là tập <em>nhiều hơn</em> —<br className="hidden md:block" />
            mà là tập <span className="text-accent font-bold not-italic">đúng hơn</span>.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            4 chủ đề dưới đây được sắp xếp theo thứ tự logic: từ kỹ thuật nền tảng,
            xây cấu trúc buổi tập, tổ chức nhịp tuần, cho đến đo lường và điều chỉnh tiến bộ.
            Mỗi bước chuẩn bị cho bước tiếp theo.
          </p>
        </div>

        {/* 3 core principles */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-2xl border border-border/40 bg-surface/20 hover:bg-surface/35 hover:border-border/60 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <span className="text-2xl shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">{p.icon}</span>
              <div>
                <p className="text-sm font-bold text-text mb-1.5">{p.title}</p>
                <p className="text-[11px] text-muted leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4-step journey flow */}
        <div className="relative" ref={journeyRef}>
          <p className="text-center text-[9px] font-bold text-muted/50 uppercase tracking-[0.25em] mb-5">Hành trình 4 bước</p>

          {/* Particle overlay */}
          <div className="absolute inset-0 pointer-events-none z-30" style={{ overflow: 'visible' }}>
            {jets.map(j => (
              <div
                key={j.id}
                className="absolute rounded-full"
                style={{
                  left:  j.ox + j.ys * 0.25,
                  top:   j.oy + j.ys * 0.6,
                  width:  j.size,
                  height: j.size,
                  background: j.color,
                  boxShadow: `0 0 ${j.size * 2}px ${j.color}`,
                  animationName: 'wjFly',
                  animationDuration: `${j.dur}ms`,
                  animationDelay: `${j.delay}ms`,
                  animationTimingFunction: 'ease-in',
                  animationFillMode: 'both',
                  '--wx': `${j.dx}px`,
                  '--wy': `${j.ys * 0.4}px`,
                  '--wa': `${j.arc}px`,
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABS.map((t, i) => (
              <div
                key={t.n}
                ref={el => { stepRefs.current[i] = el; }}
                onMouseEnter={() => fireJetOnHover(i)}
                className="group relative flex flex-col items-center text-center p-4"
              >
                {/* Step circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border mb-3 transition-all duration-300 group-hover:scale-110 relative z-10"
                  style={{ background: `${t.color}12`, borderColor: `${t.color}40`, color: t.color }}
                >
                  {i + 1}
                </div>

                {/* Icon */}
                <span className="text-xl mb-2">{t.icon}</span>

                {/* Title */}
                <p className="text-[11px] font-bold text-text/80 group-hover:text-text leading-snug mb-1 transition-colors">{t.title}</p>

                {/* Sub in tab color */}
                <p className="text-[9px] leading-tight" style={{ color: `${t.color}80` }}>
                  {t.sub.length > 22 ? t.sub.slice(0, 22) + '…' : t.sub}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] text-muted/40 mt-5">
            Chọn bất kỳ chủ đề nào bên dưới để bắt đầu khám phá →
          </p>
        </div>

      </RevealBlock>

      {/* ── TAB NAVIGATION ──────────────────────────────────────────────────────── */}
      <div id="tab-section" className="scroll-mt-4">
      <RevealBlock className="mb-0">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-[0.25em] whitespace-nowrap">4 chủ đề luyện tập</p>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Tab cards */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-4">
          <div ref={tabBarRef} className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4">
            {TABS.map((t, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={t.n}
                  type="button"
                  onClick={() => switchTab(i)}
                  className={`relative group flex flex-col p-4 md:p-5 rounded-2xl border text-left transition-all duration-300 focus:outline-none shrink-0 md:shrink w-44 md:w-auto
                    ${!isActive ? 'border-border/40 bg-surface/20 hover:border-border/70 hover:bg-surface/40 hover:-translate-y-0.5' : ''}`}
                  style={isActive ? {
                    borderColor: `${t.color}45`,
                    background: `${t.color}07`,
                    boxShadow: `0 4px 28px ${t.glow}, inset 0 1px 0 ${t.color}15`,
                  } : undefined}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[9px] font-black transition-colors" style={{ color: isActive ? t.color : '#6b7280' }}>{t.n} /04</span>
                    {isActive && <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: t.color }} />}
                  </div>
                  <div
                    className="text-2xl mb-3 transition-all duration-200 group-hover:scale-105 w-fit"
                    style={isActive ? { filter: `drop-shadow(0 0 8px ${t.color}80)` } : undefined}
                  >
                    {t.icon}
                  </div>
                  <p className={`text-xs font-bold leading-snug mb-1 transition-colors ${isActive ? 'text-text' : 'text-muted group-hover:text-text/70'}`}>
                    {t.title}
                  </p>
                  <p className="text-[9px] leading-tight transition-all duration-300 line-clamp-1"
                    style={{ color: isActive ? `${t.color}cc` : 'transparent' }}>
                    {t.sub}
                  </p>
                  <div className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full transition-all duration-300"
                    style={{ background: isActive ? t.color : 'transparent' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab panel — re-mounts on tab switch to re-trigger animation */}
        <div key={tabKey} className="animate-fade-in-up">
          <TabPanel tab={tab} />
        </div>
      </RevealBlock>
      </div>{/* /tab-section */}

      {/* ── GUIDE: Bắt đầu từ đâu? ─────────────────────────────────────────────── */}
      <RevealBlock className="mt-10 mb-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/[0.015] p-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">Bắt đầu từ đâu?</p>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { who: '🌱 Mới hoàn toàn',       where: 'Bắt đầu với', tab: TABS[0] },
              { who: '⏱ Có nền, cần cấu trúc', where: 'Đi thẳng đến', tab: TABS[1] },
              { who: '📅 Cần tổ chức tuần',     where: 'Khám phá',    tab: TABS[2] },
              { who: '🏆 Muốn đo tiến bộ',      where: 'Thử ngay',    tab: TABS[3] },
            ].map((item, i) => (
              <button
                key={item.who}
                onClick={() => { switchTab(i); tabBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border transition-all duration-200 group hover:bg-white/[0.03] text-left w-full"
              >
                <span className="text-sm font-medium text-muted min-w-[140px] shrink-0">{item.who}</span>
                <span className="text-[11px] text-muted/50 shrink-0 hidden md:block">{item.where}</span>
                <span className={`text-[11px] font-bold flex-1 truncate ${item.tab.text}`}>{item.tab.title}</span>
                <span className="text-muted group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </button>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── SAFETY callout ──────────────────────────────────────────────────────── */}
      {pillar.sections && Array.isArray(pillar.sections) && pillar.sections[5] && (
        <RevealBlock className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-yellow-400 text-base">{pillar.sections[5].title}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {Array.isArray(pillar.sections[5].items) && pillar.sections[5].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-yellow-300/70">
                    <span className="text-yellow-400/60 mt-0.5 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/program" className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/4 p-6 hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🗓️</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình 12 Tuần</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">Khung ngày chuẩn, nhịp tuần gợi ý, bộ test tiến bộ theo giai đoạn.</p>
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-2.5 transition-all">Xem lộ trình <span>→</span></span>
            </div>
          </Link>
          <Link to="/sample-programs" className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/4 p-6 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-black text-text text-base mb-1">Lộ Trình Mẫu</h3>
              <p className="text-muted text-xs leading-relaxed mb-4">6 mục tiêu × 24 tuần — tìm lộ trình phù hợp nhất với bạn.</p>
              <span className="inline-flex items-center gap-1.5 text-pink-400 text-xs font-bold group-hover:gap-2.5 transition-all">Khám phá <span>→</span></span>
            </div>
          </Link>
        </div>
      </RevealBlock>

    </div>
  );
}
