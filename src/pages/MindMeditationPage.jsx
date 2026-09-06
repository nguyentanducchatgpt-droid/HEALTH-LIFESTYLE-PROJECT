import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#d946ef';
const RGB = '217,70,239';
const ORBIT_ID = 'd-meditation-orbit-kf';
const ORBIT_PROP = '--d-med-angle';
const ORBIT_CLASS = 'd-med-orbit-ring';

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

const MYTHS = [
  { myth: 'Phải không suy nghĩ gì', truth: 'Thiền là nhận ra mình đang suy nghĩ và quay lại nhẹ nhàng — không phải xóa sạch tư duy' },
  { myth: 'Cần ngồi 30–60 phút', truth: '3 phút mỗi ngày đã có tác dụng. Nhất quán quan trọng hơn thời lượng dài' },
  { myth: 'Phải ngồi hoa sen', truth: 'Ngồi ghế, nằm, đứng, đi bộ đều thiền được — miễn là thoải mái và tỉnh táo' },
  { myth: 'Thiền = tâm linh/tôn giáo', truth: 'Thiền chánh niệm là kỹ năng nhận thức khoa học, không gắn với bất kỳ tín ngưỡng nào' },
];

const MYTH_MODALS = [
  {
    icon: '🧠', color: COLOR, rgb: RGB,
    modalTitle: 'Hiểu Lầm #1 — Thiền Không Phải "Tắt Não"',
    img: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hiểu lầm này là nguyên nhân #1 khiến người mới bỏ thiền sau 1–2 buổi. Sự thật: não tạo ra hàng nghìn suy nghĩ mỗi ngày — không có cách nào "tắt" chúng. Mục tiêu thiền không phải không có suy nghĩ mà là thay đổi mối quan hệ với chúng.',
    detail: '"Thiền mình đầy suy nghĩ — có lẽ mình thiền sai." → Không, đó là thiền đúng. Nhận ra mình đang suy nghĩ và nhẹ nhàng quay lại điểm tập trung là bài tập thực sự. Mỗi lần "trở về" đó là một rep luyện tập metacognition — tương đương một repetition trong phòng tập.',
    details: [
      'Default Mode Network (DMN): fMRI cho thấy DMN hoạt động suốt 24/7 — kể cả khi ngủ. DMN tạo ra dòng suy nghĩ liên tục về quá khứ, tương lai, "what-ifs". Thiền không tắt DMN — nó huấn luyện PFC kiểm soát sự chuyển dịch attention giữa DMN và present moment.',
      '"Rep" của thiền = nhận ra và trở về: Nếu thiền 5 phút và tâm lang thang 20 lần → bạn đã thực hành 20 reps metacognition. Người thiền lâu năm không "ít suy nghĩ hơn" — họ nhận ra nhanh hơn khi tâm lang thang và trở về dễ dàng hơn.',
      'Khoa học về metacognition: "Nhận ra mình đang suy nghĩ" kích hoạt PFC và giảm amygdala hoạt động. fMRI thiền định viên thấy activity shift từ DMN sang insula và ACC — các vùng liên quan đến present-moment awareness và emotional regulation.',
      'Suy nghĩ trong thiền thực ra có ích: Suy nghĩ trong thiền thường là "open loops" (việc chưa hoàn thành) mà não đang xử lý. Để chúng "nổi lên" và pass qua mà không níu kéo là một dạng processing healthy — nhiều người cảm thấy "nhẹ hơn" sau thiền chính vì lý do này.',
      'Kỳ vọng đúng: Buổi thiền "đầy suy nghĩ" không phải buổi thiền tệ. Buổi thiền không có giá trị là buổi bạn không ngồi xuống. Ngồi xuống với đầy suy nghĩ vẫn tốt hơn không thiền gì — và đây là lý do hầu hết mọi người giỏi thiền hơn người không thực hành.',
      'Tiến trình thực sự: Sau 2–4 tuần nhất quán, không phải suy nghĩ ít hơn — mà gap giữa "bị cuốn vào suy nghĩ" và "nhận ra" ngắn dần. Từ 2 phút → 1 phút → 30 giây → gần như ngay lập tức. Đây là thước đo tiến trình thực sự của thiền chánh niệm.',
    ],
    points: [
      { icon: '🌐', label: 'Default Mode Network', note: 'Não tạo suy nghĩ 24/7 — không thể tắt được' },
      { icon: '🔄', label: 'Mỗi "Trở Về" = 1 Rep', note: '20 lần phân tâm = 20 lần luyện metacognition' },
      { icon: '📉', label: 'Gap Ngắn Dần', note: '"Bị cuốn → nhận ra" từ 2 phút → gần như ngay lập tức' },
      { icon: '✅', label: 'Ngồi Xuống Là Đủ', note: 'Đầy suy nghĩ vẫn tốt hơn không thiền gì' },
    ],
  },
  {
    icon: '⏱️', color: COLOR, rgb: RGB,
    modalTitle: 'Hiểu Lầm #2 — 3 Phút Mỗi Ngày Đủ Tác Dụng',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Zeidan et al. (2010, Journal of Pain): chỉ 3 ngày thiền ngắn (20 phút/ngày, tổng 1 giờ) giảm pain ratings 57% và emotional response 40%. Nhất quán mỗi ngày — dù chỉ 3 phút — tạo neuroplastic changes đo được nhanh hơn sessions dài nhưng không đều.',
    detail: 'Nguồn gốc hiểu lầm "cần 30–60 phút" thường đến từ hình ảnh thiền định viên ngồi hàng giờ trong phim ảnh hay tôn giáo. Nhưng đó là thiền định nâng cao với mục đích khác. Với sức khỏe và giảm stress, 3–10 phút nhất quán mỗi ngày đủ để thấy thay đổi trong 8 tuần.',
    details: [
      'Minimum effective dose (Sara Lazar, Harvard): 8 tuần thiền 27 phút/ngày → dày hơn đáng kể ở insula và sensory cortices trên MRI. Nhưng hiệu quả có thể bắt đầu với ít hơn nhiều — ngưỡng tối thiểu có bằng chứng cho người mới là 3–5 phút/ngày.',
      'Consistency > Duration: nghiên cứu so sánh 5 phút/ngày × 7 ngày vs 35 phút × 1 lần/tuần — nhóm đầu có cải thiện tốt hơn về stress và attention. Não học qua repetition (lặp lại), không phải qua marathon sessions hiếm gặp.',
      '"Micro-meditation" 60 giây đo được: EEG đo được shift từ beta waves (active thinking, stress) sang alpha waves (relaxed alertness) sau chỉ 60 giây mindful breathing. Không phải placebo — brain state thực sự thay đổi.',
      'Neuroplasticity qua repetition (Hebb\'s Law): "Neurons that fire together, wire together." 3 phút/ngày = 21 phút/tuần = 84 phút/tháng repeated practice. 30 phút × 1 lần/tuần = chỉ 30 phút/tháng với ít repetition cycles hơn nhiều.',
      'Barrier thấp = compliance cao hơn: Rào cản "30 phút" là lý do phần lớn người không bắt đầu hoặc bỏ cuộc sau 1–2 tuần. "3 phút" loại bỏ gần như mọi excuse. Khi compliance cao → tổng thời gian thiền trong năm thực ra nhiều hơn hẳn người cố 30 phút/ngày nhưng hay bỏ.',
      '"Snowball effect" của thói quen: 3 phút tạo thói quen. Thói quen tạo cảm giác muốn thiền hơn. Muốn thiền → tự nhiên kéo dài thời gian theo thời gian. Nhiều người bắt đầu với 3 phút và sau 2–3 tháng tự nhiên ngồi 10–15 phút mà không cảm thấy như "cực hình".',
    ],
    points: [
      { icon: '🔬', label: 'Zeidan 2010', note: 'Tổng 1 giờ → giảm pain 57%, emotion 40%' },
      { icon: '🔄', label: 'Consistency > Duration', note: '5 phút × 7 ngày > 35 phút × 1 lần/tuần' },
      { icon: '⚡', label: '60 Giây Đo Được', note: 'EEG: beta → alpha shift sau 1 phút thở' },
      { icon: '🎯', label: 'Barrier Thấp', note: 'Ít excuse → compliance cao → tổng thời gian nhiều hơn' },
    ],
  },
  {
    icon: '🪑', color: COLOR, rgb: RGB,
    modalTitle: 'Hiểu Lầm #3 — Tư Thế Không Phải Yếu Tố Khoa Học',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mindfulness không yêu cầu tư thế cụ thể — chỉ cần 2 điều: thoải mái đủ để không bị phân tâm bởi đau thể chất, và tỉnh táo đủ để không ngủ. Ngồi ghế, nằm, đứng, đi bộ đều là valid meditation practices có bằng chứng khoa học.',
    detail: 'Ngồi hoa sen (padmasana) có nguồn gốc văn hóa từ yoga và thiền định Hindu/Buddhist với ý nghĩa tâm linh cụ thể. Trong MBSR và mindfulness lâm sàng hiện đại, tư thế không phải biến số nghiên cứu — attention và awareness mới là yếu tố quyết định hiệu quả.',
    details: [
      'Nguồn gốc văn hóa vs khoa học: lotus position (padmasana) xuất phát từ Hatha Yoga với ý nghĩa ổn định năng lượng và mở chakra — những khái niệm không có trong MBSR khoa học. Jon Kabat-Zinn phát triển MBSR dùng ghế thông thường từ ngày đầu, không có yêu cầu về tư thế yoga.',
      '2 tiêu chí tư thế thiền "đúng": (1) đủ thoải mái để không bị phân tâm bởi đau hay khó chịu thể chất, (2) đủ tỉnh táo để không ngủ quên. Ngồi ghế đáp ứng cả 2 cho phần lớn mọi người — và hoàn toàn valid theo khoa học thiền định.',
      'Walking meditation (thiền đi bộ): kinhin (Zen) và walking meditation (Theravada) là các dạng được nghiên cứu kỹ. Chú ý đến cảm giác chân chạm đất, nhịp thở và cảm giác cơ thể trong khi đi — tất cả là valid mindfulness practice với RCT backing.',
      'Body scan nằm (Jon Kabat-Zinn): Body scan và yoga nidra đều thực hành nằm ngửa. RCT về body scan cho thấy giảm đau mãn tính, cải thiện sleep quality và giảm anxiety — tất cả trong tư thế nằm. fMRI studies cũng thực hiện trong khi nằm trong máy.',
      'Thiền đứng: Zhan Zhuang (站桩) trong Qigong và nhiều truyền thống thiền Đông Á dạy đứng 5–20 phút với chú ý vào cảm giác cơ thể và hơi thở. Đặc biệt tốt cho người đau lưng hoặc không thoải mái khi ngồi lâu.',
      'Micro-mindfulness không cần tư thế: bất kỳ hoạt động nào làm với toàn bộ chú ý đều là mindfulness — ăn sáng không nhìn điện thoại, rửa chén với chú ý vào cảm giác nước. Không cần cushion, không cần tư thế đặc biệt, không cần phòng yên tĩnh riêng.',
    ],
    points: [
      { icon: '🪑', label: 'Ghế Là Đủ', note: 'MBSR dùng ghế từ đầu — không có yêu cầu yoga' },
      { icon: '🚶', label: 'Walking Meditation', note: 'Thiền đi bộ có RCT backing — valid như ngồi' },
      { icon: '😌', label: 'Nằm — Body Scan', note: 'Giảm đau mãn tính, cải thiện ngủ — tư thế nằm' },
      { icon: '✅', label: '2 Tiêu Chí Đủ', note: 'Thoải mái (không đau) + tỉnh táo (không ngủ)' },
    ],
  },
  {
    icon: '🔬', color: COLOR, rgb: RGB,
    modalTitle: 'Hiểu Lầm #4 — Mindfulness Là Khoa Học, Không Phải Tôn Giáo',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mindfulness-Based Stress Reduction (MBSR) được phát triển tại University of Massachusetts Medical School năm 1979 — hoàn toàn secular (không tôn giáo). Ngày nay có > 3,000 RCTs về mindfulness, được đăng trong NEJM, JAMA và Lancet, được NHS UK khuyến nghị lâm sàng.',
    detail: 'Jon Kabat-Zinn (PhD sinh học phân tử) định nghĩa mindfulness là: "paying attention on purpose, in the present moment, non-judgmentally" — không có yếu tố tôn giáo nào. Ông trích xuất cơ chế tâm lý từ thiền Phật giáo nhưng loại bỏ hoàn toàn khung tôn giáo để áp dụng trong y học.',
    details: [
      'Lịch sử MBSR: Jon Kabat-Zinn phát triển MBSR năm 1979 như chương trình clinical cho bệnh nhân đau mãn tính không đáp ứng với điều trị y tế thông thường tại UMass Medical School. Không có yếu tố tôn giáo trong protocol 8 tuần — hoàn toàn secular và có thể áp dụng cho bất kỳ ai.',
      'Clinical adoption: MBSR và Mindfulness-Based Cognitive Therapy (MBCT) được tích hợp vào NHS (UK), hệ thống y tế Mỹ, Canada và nhiều nước châu Âu. NICE UK khuyến nghị MBCT cho điều trị trầm cảm tái phát. Không một hội đồng y tế nào yêu cầu tín ngưỡng để tham gia chương trình.',
      'Neuroscience evidence: fMRI và EEG đo được các thay đổi não bộ khách quan từ thiền chánh niệm — cortical thickening (Sara Lazar, Harvard), amygdala volume reduction, hippocampus density increase. Những thay đổi này là biological outcomes đo được, không liên quan đến tín ngưỡng.',
      'Ứng dụng corporate và thể thao: Google (Search Inside Yourself program), Apple, Nike, Goldman Sachs đều có chương trình mindfulness cho nhân viên. Các đội tuyển NBA, NFL sử dụng mindfulness coaching. Không phải vì "tâm linh" — vì performance outcomes và stress management có thể đo được.',
      'Phân biệt meditation (rộng) và mindfulness (cụ thể): "Thiền" là umbrella term cho nhiều practices, bao gồm concentration meditation, loving-kindness meditation, và các dạng có yếu tố tôn giáo cụ thể. Mindfulness chánh niệm là một dạng được định nghĩa rõ ràng trong khoa học — tách biệt khỏi bất kỳ tín ngưỡng nào.',
      'Không cần "tin" gì để có tác dụng: Mindfulness hoạt động qua cơ chế sinh lý — thay đổi neural pathways qua repetition (neuroplasticity). Như tập thể dục: bạn không cần tin vào điều gì về triết học để cơ bắp phát triển. Tương tự, không cần tín ngưỡng để attention networks trong não thay đổi qua thực hành.',
    ],
    points: [
      { icon: '🏥', label: 'MBSR 1979', note: 'UMass Medical School — secular, clinical từ đầu' },
      { icon: '📊', label: '> 3,000 RCTs', note: 'Đăng trong NEJM, JAMA, Lancet — evidence-based' },
      { icon: '🧪', label: 'Não Thay Đổi Đo Được', note: 'fMRI/EEG — biological outcome, không liên quan tín ngưỡng' },
      { icon: '🏢', label: 'Google & NHS Dùng', note: 'Không vì "tâm linh" — vì outcome thực tế đo được' },
    ],
  },
];

function CardModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, total, idx }) {
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
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-xl px-4 py-3 mb-5 text-base font-medium leading-relaxed"
            style={{ background: `rgba(${item.rgb},0.1)`, borderLeft: `3px solid ${item.color}`, color: `rgba(${item.rgb},0.9)` }}>
            💡 {item.keyFact}
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

const PRACTICE_TYPES = [
  {
    id: '3min',
    icon: '⏱️',
    title: 'Thiền 3 Phút',
    subtitle: 'Dành cho người mới — bắt đầu từ đây',
    color: COLOR,
    steps: [
      { time: '1 phút', desc: 'Ngồi thoải mái, nhắm mắt hoặc nhìn xuống. Cảm nhận hơi thở vào và ra.' },
      { time: '1 phút', desc: 'Khi suy nghĩ xuất hiện — nói thầm "biết rồi" và quay lại hơi thở. Không tự trách.' },
      { time: '1 phút', desc: 'Quan sát cảm giác ở mũi, ngực, hoặc bụng khi thở. Kết thúc nhẹ nhàng.' },
    ],
    tip: 'Mỗi lần quay lại hơi thở là một lần "tập tạ" cho tâm trí.',
  },
  {
    id: '5min',
    icon: '🌙',
    title: 'Thiền 5 Phút Trước Ngủ',
    subtitle: 'Thư giãn sâu — chuyển sang trạng thái ngủ',
    color: '#8b5cf6',
    steps: [
      { time: '1 phút', desc: 'Thở chậm, sâu — bụng phồng khi hít, xẹp khi thở ra.' },
      { time: '2 phút', desc: 'Scan cơ thể: trán → vai → ngực → bụng → chân. Mỗi vùng thả lỏng khi thở ra.' },
      { time: '1 phút', desc: 'Thả lỏng bất kỳ vùng nào còn căng. Đặc biệt: hàm, vai, bàn tay.' },
      { time: '1 phút', desc: 'Tự nhắc: "Hôm nay đủ rồi. Ngày mai làm tiếp. Mình cho phép mình nghỉ."' },
    ],
    tip: 'Không cần hoàn thành "hoàn hảo" — cứ thư giãn và ngủ là thành công.',
  },
  {
    id: 'walking',
    icon: '🚶',
    title: 'Thiền Đi Bộ',
    subtitle: 'Cho người khó ngồi yên — thiền động',
    color: '#10b981',
    steps: [
      { time: 'Bắt đầu', desc: 'Đi bộ chậm hơn bình thường, không đội tai nghe, không nhìn điện thoại.' },
      { time: 'Trong khi đi', desc: 'Cảm nhận bàn chân chạm đất từng bước. Để ý trọng lượng cơ thể chuyển dịch.' },
      { time: 'Quan sát', desc: 'Nhìn ánh sáng, cây cối, mây trời. Nghe âm thanh xung quanh không phán xét.' },
      { time: 'Khi phân tâm', desc: 'Quay lại cảm giác bàn chân chạm đất. Thở đều, không đếm thành tích.' },
    ],
    tip: '5–10 phút đủ. Có thể làm trong giờ nghỉ trưa hoặc sau bữa ăn.',
  },
  {
    id: 'eating',
    icon: '🍽️',
    title: 'Chánh Niệm Khi Ăn',
    subtitle: 'Kết nối với Trụ Cột B — nhận biết no-đói',
    color: '#f59e0b',
    steps: [
      { time: 'Trước ăn', desc: 'Tắt màn hình. Quan sát đĩa thức ăn 5 giây trước khi bắt đầu ăn.' },
      { time: 'Khi ăn', desc: 'Nhai kỹ hơn, chậm hơn. Cảm nhận hương vị, kết cấu của từng miếng.' },
      { time: 'Giữa bữa', desc: 'Đặt đũa/thìa xuống một lần. Cảm nhận: đã no chưa? Còn đói thật không?' },
      { time: 'Trước khi lấy thêm', desc: 'Dừng 10 giây. Hỏi: "Mình lấy thêm vì đói hay vì thói quen?"' },
    ],
    tip: 'Ăn chậm 20 phút để não nhận tín hiệu no. Giảm ăn quá mức không cần kiêng khem.',
  },
];

const PRACTICE_MODALS = [
  {
    icon: '⏱️', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Thiền 3 Phút — Bài Tập Tâm Trí Cho Người Mới',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Zeidan et al. (2010, Journal of Pain): chỉ 3 buổi × 20 phút = tổng 60 phút → giảm pain rating 57%, giảm emotional response 40%. Nhưng quan trọng hơn: consistency mỗi ngày (dù 3 phút) tạo neuroplastic changes nhanh hơn sessions dài nhưng không đều.',
    detail: 'Thiền 3 phút là minimum effective dose cho người mới — rào cản đủ thấp để không có excuse, nhưng đủ để luyện attention muscle. Mỗi lần nhận ra mình đang suy nghĩ và nhẹ nhàng quay lại hơi thở = 1 rep metacognition. 3 phút × 20 lần phân tâm = 20 reps/session.',
    details: [
      'Bước 1 — Thiết lập tư thế: Ngồi thoải mái, lưng thẳng nhẹ (không cứng), tay để thoải mái trên đùi. Mắt nhắm nhẹ hoặc nhìn xuống 45°. Mục tiêu: đủ thoải mái để không bị đau phân tâm, đủ tỉnh táo để không ngủ.',
      'Bước 2 — Neo attention vào hơi thở: Chú ý đến điểm hơi thở dễ cảm nhận nhất — thường là mũi (cảm giác không khí vào/ra) hoặc bụng (phồng/xẹp). Không cần kiểm soát hơi thở, chỉ quan sát như quan sát sóng biển.',
      'Bước 3 — Thực hành metacognition: Khi nhận ra tâm đang lang thang (suy nghĩ về việc cần làm, lo lắng, plan...), không tự trách. Nói thầm "biết rồi" và nhẹ nhàng quay lại hơi thở. Đây là moment quan trọng nhất — không phải khi tâm yên.',
      'Vì sao "không tự trách" quan trọng: Self-criticism khi phân tâm kích hoạt sympathetic nervous system và cortisol — phản tác dụng với mục tiêu thiền. Thái độ non-judgmental là yếu tố quyết định trong tất cả RCT về mindfulness. Treat tâm phân tâm như treat một đứa trẻ tò mò — nhẹ nhàng.',
      'Tiến trình 4 tuần: Tuần 1: 20–30 lần phân tâm/3 phút — bình thường. Tuần 2: bắt đầu nhận ra nhanh hơn. Tuần 3–4: gap "bị cuốn → nhận ra" ngắn lại đáng kể. Sau 8 tuần: nhiều người tự nhiên tăng lên 5–10 phút vì muốn thiền hơn.',
      'Thời điểm tốt nhất: Sáng sớm ngay sau thức dậy (não ở trạng thái theta-alpha dễ tập trung) hoặc trước khi bắt đầu công việc. Tránh sau bữa ăn nặng (ngủ gật) và tránh cuối ngày khi quá mệt.',
    ],
    points: [
      { icon: '🎯', label: 'Minimum Effective Dose', note: '3 phút đủ để tạo thói quen và thấy hiệu quả' },
      { icon: '🔄', label: '1 Phân Tâm = 1 Rep', note: 'Nhận ra và quay lại = luyện metacognition' },
      { icon: '😌', label: 'Non-Judgmental', note: 'Không tự trách = yếu tố quyết định hiệu quả' },
      { icon: '📈', label: 'Tự Tăng Sau 8 Tuần', note: 'Nhiều người tự nhiên muốn thiền lâu hơn' },
    ],
  },
  {
    icon: '🌙', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Thiền 5 Phút Trước Ngủ — Wind-Down Protocol',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sleep Science: cortisol (stress hormone) cần giảm để melatonin tăng. Diaphragmatic breathing kích hoạt parasympathetic NS (rest-and-digest) trong vòng 90 giây, giảm heart rate và cortisol — tạo điều kiện sinh lý cho sleep onset.',
    detail: 'Thiền trước ngủ không phải là "cố ngủ" — mà là tạo điều kiện sinh lý để ngủ tự nhiên. Body scan + slow breathing chuyển cơ thể từ sympathetic (fight-or-flight) sang parasympathetic (rest-and-digest) mode trong 5 phút.',
    details: [
      'Sinh lý học sleep onset: Để ngủ được, cơ thể cần: (1) nhiệt độ cơ thể giảm 0.5–1°C, (2) cortisol xuống thấp, (3) melatonin tăng. Stress và screen time trước ngủ duy trì cortisol cao và suppress melatonin. Thiền 5 phút can thiệp vào cả 3 cơ chế.',
      'Phút 1 — Diaphragmatic breathing: Thở bụng sâu (bụng phồng khi hít vào) kích hoạt vagus nerve → parasympathetic response trong 60–90 giây. Heart rate variability (HRV) tăng — dấu hiệu tốt cho sleep quality. Đây là bước nhanh nhất để shift từ stress sang relax.',
      'Phút 2–3 — Body scan: Chú ý lần lượt từng vùng cơ thể (trán → vai → ngực → bụng → chân) và thả lỏng khi thở ra. Tìm vùng đang giữ tension mà bạn không nhận ra. Hầu hết mọi người thấy hàm, vai và bàn tay đang căng mà không biết.',
      'Phút 4 — Progressive relaxation: Tập trung vào vùng còn căng. Nếu vai căng: hít vào → căng vai nhẹ → thở ra → thả lỏng. Progressive muscle relaxation (PMR) là kỹ thuật lâm sàng được nghiên cứu kỹ cho insomnia.',
      'Phút 5 — Cognitive wind-down: Tự nhắc nhở những điều đã làm được hôm nay (thay vì nghĩ về việc chưa xong). Câu mantra: "Hôm nay đủ rồi. Ngày mai làm tiếp. Mình cho phép mình nghỉ ngơi." — chuyển từ planning mode sang rest mode.',
      'Không cần "tắt não" để ngủ: Không phải xóa hết suy nghĩ — chỉ cần cơ thể đủ thư giãn về sinh lý. Ngay cả khi tâm vẫn hoạt động, nếu cơ thể đủ thư giãn, sleep onset sẽ đến. Nhiều người thấy ngủ giữa chừng khi đang body scan.',
    ],
    points: [
      { icon: '🧬', label: 'Cortisol → Melatonin', note: 'Thiền 5 phút shift hormonal balance cho ngủ' },
      { icon: '🫀', label: 'HRV Tăng', note: 'Diaphragmatic breathing cải thiện heart rate variability' },
      { icon: '💪', label: 'Body Scan + PMR', note: 'Kỹ thuật lâm sàng cho insomnia — có RCT backing' },
      { icon: '🌙', label: 'Ngủ Trong Khi Scan', note: 'Nhiều người tự nhiên ngủ trước khi xong 5 phút' },
    ],
  },
  {
    icon: '🚶', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Thiền Đi Bộ — Mindfulness Trong Chuyển Động',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Kinhin (Zen walking meditation) và Theravada walking meditation đều có RCT backing cho anxiety, depression và chronic pain. Đặc biệt hiệu quả cho người ADHD và người không thể ngồi yên — kết hợp NEAT (Non-Exercise Activity Thermogenesis) với mindfulness.',
    detail: 'Thiền đi bộ giải quyết vấn đề phổ biến nhất: "Mình không thể ngồi yên." Thay vì ngồi và quan sát hơi thở, bạn đi bộ và quan sát cảm giác bàn chân. Neo attention vào kinesthetic sensation — cơ chế tương tự nhưng phù hợp hơn cho người kinesthetic dominant.',
    details: [
      'Tại sao kinesthetic anchor hiệu quả: Không phải ai cũng dễ neo attention vào hơi thở (nhiều người lo lắng khi chú ý quá nhiều vào hô hấp). Cảm giác bàn chân chạm đất là anchor mạnh hơn cho nhiều người — cụ thể, liên tục thay đổi, dễ cảm nhận.',
      'Cách thực hành: Đi chậm hơn bình thường khoảng 30–50%. Chú ý trình tự: gót chân chạm → lòng bàn chân → đầu ngón → nhấc lên. Cảm nhận trọng lượng cơ thể chuyển từ chân này sang chân kia. Không cần đếm bước.',
      'Mắt và tai trong thiền đi bộ: Mắt nhìn về phía trước tự nhiên (không nhìn điện thoại). Tai để mở — nghe âm thanh xung quanh mà không cần xác định nguồn gốc hay phán xét. Chỉ nghe như nghe nhạc không lời.',
      'Khi phân tâm: Quay lại cảm giác bàn chân chạm đất — đây là "hơi thở" của thiền đi bộ. Không cần đứng lại hay dừng bước. Nhận ra → quay lại → tiếp tục. Cùng cơ chế với thiền ngồi, chỉ khác anchor.',
      'Thời gian và địa điểm: 5–10 phút đủ. Tốt nhất: giờ nghỉ trưa (outdoor nếu có thể), sau bữa ăn (hỗ trợ tiêu hóa), hoặc commute đi bộ. Không cần địa điểm đặc biệt — hành lang, công viên, ngay cả siêu thị đều được.',
      'Lợi ích kép: Walking 10k steps/ngày + mindfulness = NEAT + attention training đồng thời. Đi bộ sau bữa ăn giảm blood glucose spike 30%. Kết hợp mindfulness làm giảm stress eating và tăng awareness về no-đói — kết nối tự nhiên với Trụ Cột B.',
    ],
    points: [
      { icon: '🦶', label: 'Kinesthetic Anchor', note: 'Bàn chân chạm đất — dễ hơn hơi thở cho nhiều người' },
      { icon: '🏃', label: 'Tốt Cho ADHD', note: 'Chuyển động giúp người không thể ngồi yên thiền được' },
      { icon: '🌿', label: '5–10 Phút Đủ', note: 'Giờ nghỉ trưa, sau ăn, hoặc commute đi bộ' },
      { icon: '🔥', label: 'NEAT + Mindfulness', note: 'Đốt calo + giảm stress đồng thời — lợi ích kép' },
    ],
  },
  {
    icon: '🍽️', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Chánh Niệm Khi Ăn — Kết Nối Với Trụ Cột B',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gut-brain axis: não nhận tín hiệu no từ ruột sau 15–20 phút. Ăn nhanh → ăn quá mức trước khi não "biết" đã no. Mindful eating giảm binge eating 40–60% trong các RCT (Katterman meta-analysis 2014).',
    detail: 'Chánh niệm khi ăn không phải về "kiêng khem" hay "ăn ít" — mà về ăn đúng lượng cơ thể cần bằng cách reconnect với hunger/satiety signals. Hầu hết người ăn quá nhanh, vừa ăn vừa xem điện thoại — mất kết nối hoàn toàn với interoception.',
    details: [
      'Interoception là gì: Khả năng nhận biết cảm giác bên trong cơ thể — đói, no, khát, mệt. Người thường xuyên ăn trước màn hình hoặc ăn vội dần mất interoceptive accuracy — không còn phân biệt được đói thật sự vs đói cảm xúc, no vs cần ăn thêm vì thói quen.',
      'Tắt màn hình — can thiệp đơn giản nhất: Ăn có màn hình tăng lượng ăn 20–35% theo meta-analysis. Não không process taste và satiety signals đúng khi đang xử lý visual/auditory input từ screen. "Không nhìn màn hình" là can thiệp có effect size lớn nhất và đơn giản nhất.',
      'Nhai kỹ — khoa học tiêu hóa: Nhai kỹ (20–30 lần/miếng) tăng tiết amylase (tiêu hóa carb), tăng diện tích tiếp xúc enzyme, giảm bloating và khó tiêu. Đồng thời làm chậm tốc độ ăn để não kịp nhận tín hiệu no. Không cần đếm — chỉ cần nhai đến khi mịn.',
      'Hunger scale 1–10: Trước ăn: đánh giá độ đói 1–10. Giữa bữa: kiểm tra lại. Ngừng khi đạt 6–7 (no vừa, không đầy). Lý tưởng bắt đầu ăn khi đói ở mức 3–4. Ăn khi đói 1–2 → ăn quá nhiều vì mất kiểm soát.',
      '"Dừng giữa bữa" — cơ chế sinh lý: Đặt đũa xuống 1–2 lần giữa bữa → cho phép "catch up" giữa tốc độ ăn và tín hiệu no. Đây là kỹ thuật trong Hara Hachi Bu (腹八分目) của Okinawa — nguyên tắc ăn đến 80% no. Okinawa là một trong những blue zones có tuổi thọ cao nhất.',
      'Mindful eating vs dietary restriction: Mindful eating không phải kiêng khem — không có "thực phẩm cấm". Mục tiêu là tăng pleasure từ ít thức ăn hơn (ăn chậm + chú ý → satisfaction cao hơn) và giảm ăn do stress/boredom/habit.',
    ],
    points: [
      { icon: '🧠', label: 'Gut-Brain Axis', note: 'Tín hiệu no mất 15–20 phút — ăn chậm để não kịp nhận' },
      { icon: '📵', label: 'Tắt Màn Hình', note: 'Ăn có screen tăng lượng ăn 20–35%' },
      { icon: '⚖️', label: 'Hunger Scale 1–10', note: 'Bắt đầu ăn ở 3–4, dừng ở 6–7 (Hara Hachi Bu)' },
      { icon: '📉', label: 'Giảm Binge 40–60%', note: 'Meta-analysis Katterman 2014 — evidence-based' },
    ],
  },
];

// Simple meditation timer
function MeditationTimer({ color }) {
  const [duration, setDuration] = useState(3);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(180);
  const [done, setDone] = useState(false);
  const iRef = useRef(null);

  const start = () => {
    setDone(false);
    const total = duration * 60;
    setRemaining(total);
    setRunning(true);
    iRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(iRef.current); setRunning(false); setDone(true); return 0; }
        return r - 1;
      });
    }, 1000);
  };
  const stop = () => { clearInterval(iRef.current); setRunning(false); setRemaining(duration * 60); setDone(false); };
  useEffect(() => () => clearInterval(iRef.current), []);

  const total = duration * 60;
  const pct = ((total - remaining) / total) * 100;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="rounded-2xl border border-border bg-bg p-5 flex flex-col items-center gap-4 max-w-xs mx-auto">
      <div className="text-base font-bold uppercase tracking-widest text-muted">Meditation Timer</div>
      {!running && !done && (
        <div className="flex gap-2">
          {[3, 5, 10].map(d => (
            <button key={d} onClick={() => setDuration(d)} className={`px-3 py-1.5 rounded-full text-base font-bold transition-all border ${duration === d ? 'text-white' : 'text-muted border-border'}`} style={{ background: duration === d ? color : undefined, borderColor: duration === d ? color : undefined }}>
              {d} ph
            </button>
          ))}
        </div>
      )}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" opacity="0.15" />
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center">
          {done ? (
            <div className="text-4xl">🎉</div>
          ) : (
            <>
              <div className="text-3xl font-bold text-text">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</div>
              <div className="text-base text-muted">{running ? 'thiền...' : `${duration} phút`}</div>
            </>
          )}
        </div>
      </div>
      {done ? (
        <div className="text-lg font-bold text-center" style={{ color }}>Hoàn thành! 🧘</div>
      ) : (
        <button onClick={running ? stop : start} className="px-5 py-2 rounded-full text-lg font-bold" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
          {running ? 'Dừng' : 'Bắt đầu'}
        </button>
      )}
    </div>
  );
}

export default function MindMeditationPage() {
  const { t: tM } = useTranslation('mind');
  const [active, setActive] = useState('3min');
  const [mythModal, setMythModal] = useState(null);
  const [practiceModal, setPracticeModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dMedOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dMedOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const practiceIdx = PRACTICE_TYPES.findIndex(p => p.id === active);
  const practice = PRACTICE_TYPES.find(p => p.id === active);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {tM('breadcrumb')}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🧘</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tM('meditation.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>{tM('meditation.badge')}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tM('meditation.desc')}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop" alt="Meditation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>{tM('meditation.img_caption')}</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Myths */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Hiểu Đúng Về Thiền</h2>
        <p className="text-muted text-lg mb-6">4 hiểu lầm phổ biến khiến người mới bỏ cuộc trước khi bắt đầu.</p>
        <div className="space-y-3">
          {MYTHS.map((m, i) => (
            <div key={i} className="group/myth rounded-xl border border-border bg-surface p-4 grid md:grid-cols-2 gap-3 cursor-pointer" onClick={() => setMythModal(i)}>
              <div className="flex items-start gap-2"><span className="text-red-400 text-lg shrink-0">✗</span><div className="text-lg text-muted line-through">{m.myth}</div></div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2"><span className="text-lg shrink-0" style={{ color: COLOR }}>✓</span><div className="text-lg text-text">{m.truth}</div></div>
                <span className="shrink-0 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/myth:opacity-100 transition-opacity"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Practice types */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kiểu Thiền Cốt Lõi</h2>
        <p className="text-muted text-lg mb-6">Chọn kiểu phù hợp với hoàn cảnh và sở thích của bạn.</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {PRACTICE_TYPES.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-base font-medium transition-all border ${active === p.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: active === p.id ? p.color : undefined, borderColor: active === p.id ? p.color : undefined }}>
              {p.icon} {p.title}
            </button>
          ))}
        </div>
        {practice && (
          <div className="group/practice rounded-2xl border p-5 md:p-6 cursor-pointer" style={{ borderColor: `${practice.color}30`, background: `${practice.color}06` }} onClick={() => setPracticeModal(practiceIdx)}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{practice.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xl font-bold text-text">{practice.title}</div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/practice:opacity-100 transition-opacity"
                    style={{ color: practice.color, borderColor: `rgba(${PRACTICE_MODALS[practiceIdx].rgb},0.35)`, background: `rgba(${PRACTICE_MODALS[practiceIdx].rgb},0.08)` }}>chi tiết →</span>
                </div>
                <div className="text-base font-bold uppercase tracking-widest mt-0.5" style={{ color: practice.color }}>{practice.subtitle}</div>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {practice.steps.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg">
                  <span className="text-base font-bold shrink-0 mt-0.5 min-w-[55px]" style={{ color: practice.color }}>{s.time}</span>
                  <span className="text-lg text-text leading-relaxed">{s.desc}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 text-base" style={{ background: `${practice.color}10` }}>
              💡 <strong style={{ color: practice.color }}>Mẹo:</strong> <span className="text-muted">{practice.tip}</span>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Meditation Timer</h2>
        <p className="text-muted text-lg mb-6">Thực hành ngay — chọn thời lượng và bắt đầu thiền.</p>
        <MeditationTimer color={COLOR} />
      </RevealBlock>

      {/* Week plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lộ Trình Tăng Dần</h2>
        <p className="text-muted text-lg mb-6">Bắt đầu từ 3 phút, tăng dần trong 7 ngày.</p>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {[
            { day: 'T2', mins: 3 }, { day: 'T3', mins: 3 }, { day: 'T4', mins: 4 },
            { day: 'T5', mins: 5 }, { day: 'T6', mins: 5 }, { day: 'T7', mins: 7 }, { day: 'CN', mins: 10 },
          ].map(d => (
            <div key={d.day} className="rounded-xl border border-border bg-surface p-3 text-center">
              <div className="text-base font-bold" style={{ color: COLOR }}>{d.day}</div>
              <div className="text-xl font-bold text-text mt-1">{d.mins}</div>
              <div className="text-base text-muted">phút</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Kỹ Thuật Thở
        </Link>
        <Link to="/pillar/d" className="text-lg text-muted hover:text-purple-400 transition-colors text-center">{tM('breadcrumb')} →</Link>
        <Link to="/pillar/d/body-scan" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Body Scan
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {mythModal !== null && (
        <CardModal
          item={MYTH_MODALS[mythModal]}
          onClose={() => setMythModal(null)}
          onPrev={() => setMythModal(i => Math.max(0, i - 1))}
          onNext={() => setMythModal(i => Math.min(MYTH_MODALS.length - 1, i + 1))}
          hasPrev={mythModal > 0}
          hasNext={mythModal < MYTH_MODALS.length - 1}
          total={MYTH_MODALS.length}
          idx={mythModal}
        />
      )}
      {practiceModal !== null && (
        <CardModal
          item={PRACTICE_MODALS[practiceModal]}
          onClose={() => setPracticeModal(null)}
          onPrev={() => setPracticeModal(i => Math.max(0, i - 1))}
          onNext={() => setPracticeModal(i => Math.min(PRACTICE_MODALS.length - 1, i + 1))}
          hasPrev={practiceModal > 0}
          hasNext={practiceModal < PRACTICE_MODALS.length - 1}
          total={PRACTICE_MODALS.length}
          idx={practiceModal}
        />
      )}
    </div>
  );
}
