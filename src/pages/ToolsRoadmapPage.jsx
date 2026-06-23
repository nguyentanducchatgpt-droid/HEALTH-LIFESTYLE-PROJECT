import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'f-rm-orbit-kf';
const ORBIT_CLASS = 'f-rm-orbit-ring';

const PHASES = [
  {
    phase: 1, weeks: 'Tuần 1–2', title: 'Nền Tảng — Làm Quen Công Cụ', color: '#3b82f6', rgb: '59,130,246',
    focus: 'Chọn 1–2 công cụ để bắt đầu, không cần dùng hết ngay.',
    goals: [
      'Bắt đầu Checklist 6 mục hàng ngày — mục tiêu ≥ 4/6 mỗi ngày',
      'Đo baseline: cân nặng, vòng eo, sit-to-stand, plank, giấc ngủ',
      'Ghi nhật ký tập luyện ít nhất 2 buổi đầu tiên',
      'Đặt giờ ngủ cố định và thực hành 1 lần/ngày',
      'Khám phá các module trong Pillar F',
    ],
    milestone: 'Hoàn thành baseline test + 10 ngày checklist liên tục',
    tools: ['Checklist Ngày & Tuần', 'Nhật Ký Tập', 'Bộ Test Baseline'],
    img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop',
    keyFact: '2 tuần đầu là giai đoạn quan trọng nhất — không phải vì kết quả mà vì đây là lúc bạn xây dựng identity mới: "Tôi là người theo dõi sức khỏe của mình." Mỗi lần tick checklist là một phiếu bầu cho phiên bản mới. Đo baseline ngay từ đầu cho bạn dữ liệu để nhìn lại tiến bộ 4 tuần sau.',
    details: [
      'Tại sao bắt đầu với 1–2 công cụ: motivation ban đầu đủ để làm nhiều thứ cùng lúc, nhưng willpower có hạn. Bắt đầu ít → thành công sớm → confidence → tự nhiên mở rộng. Bắt đầu quá nhiều → overwhelmed → bỏ hoàn toàn. Chọn 1 công cụ quan trọng nhất với bạn.',
      'Checklist ≥ 4/6 mỗi ngày: không phải 6/6 — mức 4/6 đủ để duy trì consistency mà không tạo áp lực perfectionism. Perfectionism là kẻ thù của consistency dài hạn. 80% ngày đạt 4/6 tốt hơn nhiều so với 30% ngày đạt 6/6.',
      'Đo baseline — tại sao quan trọng: bạn không thể biết mình đã tiến bộ bao nhiêu nếu không biết điểm xuất phát. Baseline không phải để so sánh với người khác — chỉ để so sánh với chính bạn 4 và 12 tuần sau. Không phán xét kết quả baseline.',
      'Giờ ngủ cố định từ tuần 1: circadian rhythm điều chỉnh chậm — cần ít nhất 1–2 tuần để thiết lập lại. Bắt đầu ngay từ tuần 1 có nghĩa là đến tuần 3–4 bạn đã có rhythm tốt hơn, ngủ sâu hơn, và recovery tốt hơn cho các buổi tập.',
      'Khám phá Pillar F — không phải đọc hết: dành 5–10 phút mỗi ngày để nhìn qua 1 module. Mục tiêu là quen mặt với các công cụ, biết cái gì tồn tại. Khi cần (tuần 3–6), bạn đã biết phải dùng gì.',
      'Milestone quan trọng: 10 ngày checklist liên tục đủ để hình thành habit loop. Nghiên cứu của Phillippa Lally (UCL) cho thấy trung bình 66 ngày để habit tự động hóa — nhưng 10 ngày liên tục là checkpoint quan trọng đầu tiên.',
    ],
    points: [
      { icon: '🎯', label: 'Bắt Đầu Với 1–2 Công Cụ', note: 'Ít → thành công → confidence → mở rộng tự nhiên' },
      { icon: '📏', label: 'Đo Baseline Ngay', note: 'Điểm xuất phát để so sánh với chính bạn 4 tuần sau' },
      { icon: '✅', label: 'Mục Tiêu 4/6 Checklist', note: 'Tránh perfectionism — 80% ngày đạt 4/6 > 30% ngày đạt 6/6' },
      { icon: '🌙', label: 'Giờ Ngủ Cố Định', note: 'Circadian rhythm cần 1–2 tuần thiết lập — bắt đầu ngay' },
    ],
  },
  {
    phase: 2, weeks: 'Tuần 3–6', title: 'Theo Dõi — Đo Tiến Bộ', color: '#22c55e', rgb: '34,197,94',
    focus: 'Mở rộng sang thêm 2–3 module. Bắt đầu thấy pattern rõ ràng hơn.',
    goals: [
      'Thêm Lifestyle Tracker: theo dõi ngủ và bước chân hàng ngày',
      'Thêm Mind Tracker: ghi stress và mood 5 ngày/tuần',
      'Làm đầy đủ Template Thực Đơn ít nhất 3 ngày/tuần',
      'Chấm điểm Health Score 3–4 ngày/tuần',
      'Thực hiện Weekly Review cuối mỗi tuần',
    ],
    milestone: 'Test 4 tuần + So sánh với baseline + Review cuối tuần 4',
    tools: ['Lifestyle Tracker', 'Mind Tracker', 'Template Thực Đơn', 'Daily Health Score'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuần 3–6 là giai đoạn bạn bắt đầu thấy pattern: ngày ngủ ít → mood thấp → ăn tệ → tập kém. Khi có đủ dữ liệu từ nhiều tracker, bạn có thể thấy connection giữa các yếu tố. Đây là thời điểm từ "tôi cố gắng" chuyển sang "tôi hiểu cơ thể mình".',
    details: [
      'Tại sao mở rộng sang tuần 3–6: bạn đã có habit loop cơ bản từ 2 tuần đầu. Thêm 2–3 công cụ không còn overwhelm nữa vì checklist đã chạy tự động. Timing quan trọng — không thêm quá sớm (tuần 1–2) và không chờ quá muộn.',
      'Lifestyle Tracker — giá trị thật: theo dõi ngủ và bước chân không chỉ để ghi số. Khi bạn biết mình ngủ trung bình 6h (không phải 7h như nghĩ), hoặc chỉ 4000 bước/ngày (không phải 8000 như tưởng) — đây là data shock tích cực, thúc đẩy thay đổi thực sự.',
      'Mind Tracker — stress và mood: 5 ngày/tuần đủ để thấy pattern mà không tạo gánh nặng. Hỏi đơn giản: 1–10 stress, 1–10 mood, 1–10 energy. Sau 2 tuần, bạn sẽ thấy pattern ngày nào tốt và ngày nào khó — và correlate với ngủ, ăn, tập.',
      'Template Thực Đơn 3 ngày/tuần: không phải lập kế hoạch ăn toàn bộ tuần ngay. Bắt đầu với 3 ngày — đủ để thấy macro balance và tìm ra bữa ăn nào dễ maintain nhất. Những bữa đó trở thành foundation.',
      'Weekly Review cuối tuần: dành 10–15 phút nhìn lại 7 ngày. Câu hỏi: điều gì hoạt động? Điều gì không? Tuần sau sẽ khác gì? Review tạo closure tâm lý cho tuần cũ và intention cho tuần mới — giúp tránh "drift" vô thức.',
      'Test 4 tuần — milestone quan trọng: đây là lần đầu bạn so sánh số liệu với baseline. Ngay cả thay đổi nhỏ (plank tăng 15 giây, ngủ sâu hơn, bước chân tăng 1000/ngày) cũng là bằng chứng thực sự rằng hệ thống đang hoạt động.',
    ],
    points: [
      { icon: '📊', label: 'Thấy Pattern Rõ Ràng', note: 'Ngủ ít → mood thấp → ăn tệ — dữ liệu kết nối mọi thứ' },
      { icon: '😴', label: 'Lifestyle Tracker', note: 'Data shock tích cực: ngủ/bước thật sự vs. bạn nghĩ' },
      { icon: '🧘', label: 'Mind Tracker 5 Ngày', note: '1–10 stress/mood/energy — pattern xuất hiện sau 2 tuần' },
      { icon: '📋', label: 'Test 4 Tuần', note: 'Bằng chứng đầu tiên hệ thống đang hoạt động với bạn' },
    ],
  },
  {
    phase: 3, weeks: 'Tuần 7–10', title: 'Cá Nhân Hóa — Tối Ưu Theo Mình', color: '#f59e0b', rgb: '245,158,11',
    focus: 'Điều chỉnh dựa trên dữ liệu. Không cần làm tất cả — làm đúng cái phù hợp với bạn.',
    goals: [
      'Dựa vào kết quả test 4 tuần: tập trung cải thiện 2 chỉ số yếu nhất',
      'Thử Meal Prep 3 ngày ít nhất 1 lần/tuần',
      'Sử dụng Reset Protocol khi lỡ nhịp',
      'Tùy chỉnh checklist theo thói quen thực tế của bạn',
      'Đặt mục tiêu cụ thể cho 4 tuần tiếp theo dựa trên dữ liệu',
    ],
    milestone: 'Test 8 tuần + Ít nhất 1 chỉ số cải thiện rõ rệt so với baseline',
    tools: ['Meal Prep 3 Ngày', 'Reset Protocol', 'Thư Viện Bài Nhanh'],
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đến tuần 7–10, bạn có đủ dữ liệu để biết hệ thống nào hoạt động với mình. Đây là thời điểm cá nhân hóa — không phải làm tất cả, mà làm đúng cái phù hợp. Người A cần tập trung vào ngủ, người B vào dinh dưỡng, người C vào stress. Dữ liệu của bạn sẽ chỉ ra.',
    details: [
      'Chọn 2 chỉ số yếu nhất: sau 4 tuần dữ liệu, bạn có thể thấy rõ mình đang "leak" ở đâu — ngủ kém? Ít vận động? Stress cao? Tập trung nguồn lực vào 2 điểm yếu quan trọng nhất thay vì cải thiện đều tất cả là chiến lược hiệu quả hơn nhiều.',
      'Meal Prep 3 ngày: lợi ích thực sự không phải tiết kiệm thời gian (mặc dù có) — mà là giảm decision fatigue. Khi bữa ăn đã được chuẩn bị sẵn, bạn không cần nghĩ "ăn gì?" vào lúc đói và mệt — thời điểm dễ đưa ra quyết định tệ nhất.',
      'Reset Protocol khi lỡ nhịp: đến tuần 7–10, bạn chắc chắn đã lỡ nhịp ít nhất 1–2 lần. Biết cách dùng Reset Protocol là kỹ năng quan trọng hơn là không bao giờ lỡ nhịp. Người dùng protocol đúng cách recover trong 1–2 ngày; người không biết có thể mất cả tuần hoặc bỏ hẳn.',
      'Tùy chỉnh checklist: checklist mẫu không phải checklist hoàn hảo cho bạn. Sau 6 tuần, bạn biết mục nào thực sự quan trọng với bạn và mục nào chỉ tick cho có. Xóa cái không phù hợp, thêm cái quan trọng hơn với lifestyle của bạn.',
      'Đặt mục tiêu SMART cho 4 tuần tiếp theo: không phải "tôi sẽ khỏe hơn" mà là "tôi sẽ tăng plank từ 45s lên 75s" hoặc "tôi sẽ ngủ ≥7h ít nhất 5 ngày/tuần". Mục tiêu cụ thể có thể đo được → track được → celebrate được.',
      'Test 8 tuần là checkpoint tâm lý quan trọng: bạn đã đầu tư 8 tuần. Nhìn lại số liệu — ngay cả 1 chỉ số cải thiện rõ rệt cũng là bằng chứng mạnh mẽ. Điều này tạo momentum để tiếp tục 4 tuần cuối mà không cần motivation ngoài.',
    ],
    points: [
      { icon: '🎯', label: 'Tập Trung 2 Điểm Yếu', note: 'Nguồn lực có hạn — cải thiện 2 chỗ yếu nhất hiệu quả hơn' },
      { icon: '🥡', label: 'Meal Prep Giảm Quyết Định', note: 'Bữa đã sẵn → không cần nghĩ khi đói và mệt' },
      { icon: '🔄', label: 'Reset Protocol Khi Lỡ', note: 'Kỹ năng quan trọng hơn không bao giờ lỡ nhịp' },
      { icon: '📐', label: 'Tùy Chỉnh Checklist', note: 'Xóa cái không phù hợp — giữ cái thực sự quan trọng với bạn' },
    ],
  },
  {
    phase: 4, weeks: 'Tuần 11–12+', title: 'Tự Vận Hành — Bền Vững Dài Hạn', color: '#a855f7', rgb: '168,85,247',
    focus: 'Bạn không cần ai nhắc nữa. Hệ thống này đã trở thành của bạn.',
    goals: [
      'Làm Test 12 tuần và so sánh với baseline',
      'Đơn giản hóa routine — giữ lại những gì hoạt động tốt nhất với bạn',
      'Lên kế hoạch cho chu kỳ 12 tuần tiếp theo với mục tiêu mới',
      'Chia sẻ kiến thức và cách tiếp cận với người thân',
      'Review toàn bộ Health Score trend trong 12 tuần qua',
    ],
    milestone: 'Test 12 tuần + Xác định mục tiêu chu kỳ tiếp theo',
    tools: ['Tất cả công cụ', 'Lộ Trình mới'],
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đến tuần 12, mục tiêu không phải "hoàn thành 12 tuần" mà là "tôi sẽ làm gì trong 12 tuần tiếp theo?" Đây là dấu hiệu của identity shift thực sự — từ người đang cố gắng sống khỏe sang người sống khỏe là bản thể tự nhiên. Giai đoạn này không kết thúc — nó restart ở level cao hơn.',
    details: [
      'Test 12 tuần — so sánh với baseline: đây là khoảnh khắc bạn sẽ nhớ mãi. Không phải vì số liệu (mặc dù số liệu quan trọng), mà vì bạn thấy được hành trình. Plank tăng từ 20s lên 90s. Ngủ trung bình tăng từ 5.5h lên 7h. Những con số này là bằng chứng về capacity của bạn.',
      'Đơn giản hóa là tốt, không phải lười: đến tuần 12, nhiều thứ đã tự động hóa. Bạn không cần theo dõi mọi thứ nữa — chỉ những thứ thực sự cần. Đơn giản hóa routine là dấu hiệu maturity, không phải bỏ cuộc. Keep what works, drop what doesn\'t.',
      'Lên kế hoạch chu kỳ tiếp theo ngay từ tuần 12: đừng đợi xong mới nghĩ tiếp. Tuần 12 bạn còn momentum và clarity — đây là thời điểm tốt nhất để đặt mục tiêu cho 12 tuần sau. Mục tiêu mới nên harder hơn nhưng realistic dựa trên dữ liệu 12 tuần vừa qua.',
      'Chia sẻ với người thân: teaching is the best learning. Khi bạn giải thích lý do tại sao ngủ đủ giấc quan trọng cho người thân, bạn tự consolidate kiến thức của mình. Hơn nữa, có accountability partner ở nhà làm cho routine bền vững hơn nhiều.',
      'Review Health Score trend 12 tuần: không chỉ nhìn điểm số, mà nhìn pattern. Tuần nào điểm cao nhất? Điều gì xảy ra tuần đó? Tuần nào điểm thấp nhất? Điều gì correlate? Insights từ trend 12 tuần giúp thiết kế chu kỳ tiếp theo thông minh hơn.',
      'Identity shift — dấu hiệu thành công: bạn không còn nghĩ "tôi phải tập" mà nghĩ "tôi muốn tập". Không còn "tôi nên ngủ sớm" mà là "tôi thích ngủ sớm". Khi lối sống khỏe trở thành who you are thay vì what you do — đó là thành công thực sự của 12 tuần.',
    ],
    points: [
      { icon: '📊', label: 'Test 12 Tuần vs Baseline', note: 'Bằng chứng hành trình — số liệu về capacity thực sự của bạn' },
      { icon: '✂️', label: 'Đơn Giản Hóa Là Tốt', note: 'Giữ cái hoạt động, bỏ cái không — đây là maturity' },
      { icon: '🔮', label: 'Lập Kế Hoạch Ngay Tuần 12', note: 'Momentum đang cao — đây là thời điểm tốt nhất để set goal mới' },
      { icon: '🔄', label: 'Restart Ở Level Cao Hơn', note: 'Không kết thúc — chu kỳ 12 tuần tiếp theo với baseline mới' },
    ],
  },
];

const ALL_TOOLS = [
  { to: '/pillar/f/checklist', icon: '✅', title: 'Checklist Ngày & Tuần', color: '#f97316' },
  { to: '/pillar/f/workout-log', icon: '🏋️', title: 'Nhật Ký Tập Luyện', color: '#22c55e' },
  { to: '/pillar/f/meal-plan', icon: '🍽️', title: 'Template Thực Đơn', color: '#84cc16' },
  { to: '/pillar/f/lifestyle-tracker', icon: '💤', title: 'Lifestyle Tracker', color: '#14b8a6' },
  { to: '/pillar/f/mind-tracker', icon: '🧘', title: 'Mind & Calm Tracker', color: '#a855f7' },
  { to: '/pillar/f/health-score', icon: '💯', title: 'Daily Health Score', color: '#f97316' },
  { to: '/pillar/f/quick-workouts', icon: '⚡', title: 'Thư Viện Bài Nhanh', color: '#22c55e' },
  { to: '/pillar/f/meal-prep', icon: '🥡', title: 'Meal Prep 3 Ngày', color: '#84cc16' },
  { to: '/pillar/f/reset-protocol', icon: '🔄', title: 'Reset Protocol', color: '#0ea5e9' },
  { to: '/pillar/f/progress-test', icon: '📈', title: 'Bộ Test Tiến Bộ 4 Tuần', color: '#ef4444' },
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

function PhaseModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const ph = PHASES[idx];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${ph.rgb},0.28)`, boxShadow: `0 0 80px rgba(${ph.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={ph.img} alt={ph.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${ph.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${ph.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl"
              style={{ background: `rgba(${ph.rgb},0.18)`, border: `2px solid rgba(${ph.rgb},0.45)`, color: ph.color }}>P{ph.phase}</div>
            <span className="text-sm font-bold" style={{ color: `rgba(${ph.rgb},0.8)` }}>{ph.weeks}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${ph.rgb},0.6)` }}>Giai Đoạn {ph.phase} / {PHASES.length} — {ph.weeks}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: ph.color }}>{ph.title}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: ph.color, background: `rgba(${ph.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{ph.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {ph.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${ph.rgb},0.14)`, color: ph.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ph.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${ph.rgb},0.06)`, border: `1px solid rgba(${ph.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mb-6 text-sm" style={{ borderLeft: `2px solid ${ph.color}`, background: `rgba(${ph.rgb},0.08)` }}>
            <strong style={{ color: ph.color }}>🏆 Milestone: </strong>
            <span style={{ color: 'rgba(209,213,219,0.85)' }}>{ph.milestone}</span>
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? ph.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${ph.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${ph.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Giai đoạn {ph.phase} / {PHASES.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? ph.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${ph.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${ph.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ToolsRoadmapPage() {
  const [openPhase, setOpenPhase] = useState(0);
  const [phaseModal, setPhaseModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-rm-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fRmOrbitSpin { to { --f-rm-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-rm-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fRmOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Lộ Trình 12 Tuần</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            4 giai đoạn · Làm quen → Tối ưu → Tự vận hành
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Hệ thống dẫn dắt từ việc làm quen công cụ, đo tiến bộ, cá nhân hóa theo mình, đến tự vận hành không cần ai nhắc. 12 tuần xây dựng lối sống chủ động.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Roadmap" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            12 tuần · từ công cụ → thói quen → tự vận hành
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Phases */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lộ Trình 4 Giai Đoạn</h2>
        <p className="text-muted text-lg mb-6">Nhấn để xem mục tiêu. Hover → <span style={{ color: COLOR }}>Chi tiết</span> để xem phân tích chuyên sâu.</p>
        <div className="space-y-3">
          {PHASES.map((ph, i) => (
            <div key={i} className="rounded-2xl overflow-hidden group"
              style={{ border: `1px solid ${phaseModal === i ? `rgba(${ph.rgb},0.45)` : 'var(--border)'}`, background: 'var(--surface)', transition: 'border-color 0.2s' }}>
              <div className="flex items-center">
                <button onClick={() => setOpenPhase(openPhase === i ? null : i)} className="flex-1 p-4 text-left hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0" style={{ background: `${ph.color}20`, color: ph.color }}>P{ph.phase}</div>
                    <div className="flex-1">
                      <div className="font-bold text-text">{ph.title}</div>
                      <div className="text-base text-muted mt-0.5">{ph.weeks}</div>
                    </div>
                    <span className="text-muted">{openPhase === i ? '▲' : '▼'}</span>
                  </div>
                </button>
                <button onClick={() => setPhaseModal(i)}
                  className="shrink-0 mr-3 text-xs font-bold px-3 py-1.5 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ color: ph.color, borderColor: `rgba(${ph.rgb},0.35)`, background: `rgba(${ph.rgb},0.08)` }}>
                  Chi tiết →
                </button>
              </div>
              {openPhase === i && (
                <div className="px-4 pb-5 border-t border-border pt-4 space-y-4">
                  <p className="text-lg text-muted italic">{ph.focus}</p>
                  <div>
                    <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: ph.color }}>Mục Tiêu</div>
                    <ul className="space-y-1.5">
                      {ph.goals.map((g, j) => (
                        <li key={j} className="flex gap-2 text-lg text-muted">
                          <span style={{ color: ph.color }} className="shrink-0">→</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: ph.color }}>Công Cụ Cần Dùng</div>
                    <div className="flex flex-wrap gap-2">
                      {ph.tools.map((t, j) => (
                        <span key={j} className="text-base px-3 py-1 rounded-full border" style={{ color: ph.color, borderColor: `${ph.color}30`, background: `${ph.color}10` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl p-3 border-l-2 text-lg" style={{ borderColor: ph.color, background: `${ph.color}10` }}>
                    <strong style={{ color: ph.color }}>Milestone: </strong><span className="text-muted">{ph.milestone}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* All tools */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Tất Cả Công Cụ</h2>
        <p className="text-muted text-lg mb-6">Truy cập nhanh mọi công cụ trong Pillar F.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ALL_TOOLS.map((t, i) => (
            <Link key={i} to={t.to} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:border-purple-500/30 transition-colors group">
              <span className="text-2xl">{t.icon}</span>
              <span className="text-lg font-medium text-text group-hover:text-white transition-colors">{t.title}</span>
              <span className="ml-auto text-muted group-hover:text-text transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>
      </RevealBlock>

      {/* CTA */}
      <RevealBlock delay={2} className="mb-10">
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-bold text-text mb-2">Bắt Đầu Giai Đoạn 1 Ngay Hôm Nay</h3>
          <p className="text-lg text-muted mb-4">Chỉ cần 1 hành động: mở Checklist và tick xong ngày hôm nay.</p>
          <Link to="/pillar/f/checklist" className="inline-block px-6 py-2.5 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>
            Mở Checklist →
          </Link>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Lộ trình mang tính hướng dẫn. Điều chỉnh tùy theo nhịp sống và mục tiêu cá nhân của bạn.</p>
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {phaseModal !== null && (
        <PhaseModal
          idx={phaseModal}
          onClose={() => setPhaseModal(null)}
          onPrev={() => setPhaseModal(i => Math.max(0, i - 1))}
          onNext={() => setPhaseModal(i => Math.min(PHASES.length - 1, i + 1))}
          hasPrev={phaseModal > 0}
          hasNext={phaseModal < PHASES.length - 1}
        />
      )}
    </div>
  );
}
