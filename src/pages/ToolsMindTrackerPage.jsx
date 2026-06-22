import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'f-mt-orbit-kf';
const ORBIT_CLASS = 'f-mt-orbit-ring';
const LS_KEY = 'healthapp_f_mind';

const MOODS = [
  { icon: '😤', label: 'Căng thẳng', val: 'stressed', color: '#ef4444' },
  { icon: '😞', label: 'Mệt mỏi', val: 'tired', color: '#f59e0b' },
  { icon: '😐', label: 'Bình thường', val: 'neutral', color: '#6366f1' },
  { icon: '😊', label: 'Vui vẻ', val: 'happy', color: '#22c55e' },
  { icon: '🤩', label: 'Tuyệt vời', val: 'great', color: '#14b8a6' },
];

const CALM_OPTIONS = [
  {
    label: 'Thở sâu / Box breathing', icon: '🌬️', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box breathing (4-4-4-4) kích hoạt hệ thần kinh phó giao cảm trong 90 giây — giảm cortisol, hạ nhịp tim, tắt phản ứng "fight or flight". Navy SEAL sử dụng kỹ thuật này trước nhiệm vụ áp lực cao để duy trì bình tĩnh và rõ ràng trong tư duy.',
    details: [
      'Cơ chế sinh lý: hít thở chậm kích thích dây thần kinh phế vị (vagus nerve) — kết nối não với tim, phổi, ruột. Kích thích vagus nerve tăng HRV (heart rate variability), tín hiệu hệ phó giao cảm đang active và cơ thể ở trạng thái "rest & digest" thay vì "fight or flight".',
      'Box breathing 4-4-4-4: Hít vào 4 giây → Nín thở 4 giây → Thở ra 4 giây → Nín 4 giây → Lặp lại. 5 chu kỳ = ~2 phút là đủ để giảm cortisol đo được. Bắt đầu với 3-3-3-3 nếu chưa quen nín thở.',
      '4-7-8 breathing (Dr. Andrew Weil): Hít 4 giây → Nín 7 giây → Thở ra 8 giây. Nín thở lâu hơn tăng CO2 nhẹ → giãn mạch máu → thư giãn sâu hơn. Đặc biệt tốt trước khi ngủ.',
      'Physiological sigh (Andrew Huberman): Hít vào mũi → Hít thêm 1 hơi ngắn (double inhale) → Thở ra dài qua miệng. 1–3 lần đủ giảm lo âu ngay lập tức — đây là phản xạ tự nhiên não dùng để reset hệ thần kinh khi bị overwhelm.',
      'Thời điểm tốt nhất: trước cuộc họp áp lực, sau tin xấu, khi bắt đầu cảm thấy overwhelmed, trước khi ngủ. Hiệu quả nhất khi thực hành đều đặn hằng ngày — não "học" liên kết kỹ thuật này với bình tĩnh qua điều kiện hóa Pavlov.',
      'Tích hợp vào routine: đặt reminder 3 lần/ngày (sáng thức dậy, sau bữa trưa, trước ngủ). Mỗi lần 2–3 phút. Sau 2 tuần thực hành nhất quán, hệ thần kinh phản ứng nhanh hơn với kỹ thuật này nhờ neuroplasticity.',
    ],
    points: [
      { icon: '⏱️', label: 'Hiệu Quả Trong 90 Giây', note: 'Vagus nerve kích hoạt phó giao cảm — giảm cortisol đo được' },
      { icon: '🔢', label: 'Box: 4-4-4-4', note: 'Navy SEAL dùng trước nhiệm vụ áp lực cao — đơn giản và hiệu quả' },
      { icon: '😮‍💨', label: 'Physiological Sigh', note: 'Double inhale + thở ra dài — reset nhanh nhất, chỉ 1–3 lần' },
      { icon: '🧠', label: 'Neuroplasticity 2 Tuần', note: 'Luyện đều đặn — não học phản xạ bình tĩnh tự động hơn' },
    ],
  },
  {
    label: 'Thiền 5–10 phút', icon: '🧘', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 8 tuần thiền mindfulness 10 phút/ngày thay đổi vật lý não — tăng grey matter ở prefrontal cortex (ra quyết định, tự kiểm soát) và giảm kích thước amygdala (trung tâm sợ hãi/lo âu). Nghiên cứu của Sara Lazar, ĐH Harvard, 2011.',
    details: [
      'Mindfulness meditation là gì: chú ý có chủ đích vào khoảnh khắc hiện tại, không phán xét. Không phải làm trống đầu — mà là nhận ra khi tâm trí lạc và nhẹ nhàng kéo lại. Mỗi lần kéo lại là 1 "mental rep" — như tập tạ cho não.',
      'Hướng dẫn 5 phút cho người mới: Ngồi thoải mái, nhắm mắt. Chú ý hơi thở (cảm giác không khí vào/ra). Khi tâm trí lạc (suy nghĩ xuất hiện) — nhận ra, không phán xét, kéo lại hơi thở. Lặp lại. Không có thiền "thất bại".',
      'Thay đổi não sau 8 tuần: prefrontal cortex dày hơn → quyết định tốt hơn, ít impulsive; amygdala nhỏ hơn → ít phản ứng quá mức với stress; insula nhạy hơn → body awareness tốt hơn — đo bằng MRI (Harvard, 2011).',
      'Thiền và sleep quality: 10 phút thiền trước ngủ giảm pre-sleep cognitive arousal (không tắt được não) — nguyên nhân #1 của insomnia theo National Sleep Foundation. Kết quả: ngủ nhanh hơn ~10 phút và deep sleep tăng đáng kể.',
      'App hỗ trợ: Headspace, Calm, Insight Timer (miễn phí), YouTube "guided meditation tiếng Việt" cho người mới. Bắt đầu với guided meditation dễ hơn — giọng hướng dẫn ngăn tâm trí lạc đi và giữ nhịp thở.',
      'Misconceptions: Thiền không cần ngồi kiết già — ngồi ghế, nằm (nếu không ngủ), đi bộ đều được. Không cần im lặng hoàn toàn. Không cần "đạt trạng thái đặc biệt" — chỉ cần ngồi và quan sát. 5 phút mỗi ngày > 30 phút mỗi tuần.',
    ],
    points: [
      { icon: '🧬', label: 'Thay Đổi Não 8 Tuần', note: 'Grey matter tăng ở PFC — ĐH Harvard 2011 (Sara Lazar)' },
      { icon: '😌', label: 'Amygdala Thu Nhỏ', note: 'Giảm phản ứng sợ hãi/lo âu quá mức theo thời gian' },
      { icon: '😴', label: 'Trước Ngủ: -10 Phút', note: 'Giảm cognitive arousal → ngủ nhanh và sâu hơn' },
      { icon: '🔄', label: '"Mental Rep" = Tập Tạ Não', note: 'Mỗi lần kéo tâm trí lại = 1 rep — không có thiền thất bại' },
    ],
  },
  {
    label: 'Đi bộ chậm / mindful walk', icon: '🚶', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mindful walking kết hợp lợi ích của thiền định và vận động. Nghiên cứu 2019 (Journal of Health Psychology): 10 phút mindful walk giảm cortisol 12% hơn đi bộ thường, và 23% hơn ngồi trong phòng yên tĩnh.',
    details: [
      'Hướng dẫn mindful walk: Đi chậm hơn 30% so với tốc độ thường. Chú ý: bàn chân chạm đất (heel → ball → toes), cảm giác không khí trên da, âm thanh xung quanh. Khi tâm trí lạc vào suy nghĩ, kéo chú ý về bước chân — không phán xét.',
      '"Green exercise" bonus: đi bộ trong công viên, cây xanh, gần nước giảm cortisol 16% hơn đi bộ trên phố. Tiếp xúc thiên nhiên kích hoạt "awe response" — trạng thái ngạc nhiên làm nhỏ self-referential thinking (ngừng nghĩ quá nhiều về bản thân).',
      'Rumination buster: 20–30 phút đi bộ trong thiên nhiên giảm activity ở vùng não liên quan đến suy nghĩ tiêu cực lặp lại so với đi bộ đô thị — đo bằng fMRI tại Stanford (2015). Thiên nhiên "tắt" vòng lặp lo âu.',
      'Kết hợp với hơi thở 4-4: hít vào 4 bước, thở ra 4 bước. Đồng bộ hơi thở và bước chân tạo coherence giữa hệ hô hấp và tim mạch — tăng HRV và cảm giác dễ chịu sâu hơn so với đi bộ thường.',
      'Phone-free là bắt buộc: check điện thoại khi đi bộ hủy toàn bộ lợi ích mindfulness. Tai nghe/podcast tốt hơn không đi, nhưng không có gì tốt hơn đi trong im lặng. Thỏa hiệp: 5 phút đầu có điện thoại, 15 phút sau không.',
      'Morning walk đặc biệt: 10–20 phút trong vòng 1 giờ đầu sau thức dậy = ánh sáng mặt trời (reset circadian) + vận động (cortisol tốt buổi sáng) + mindfulness (set tone ngày mới). 1 thói quen, 3 lợi ích.',
    ],
    points: [
      { icon: '🌿', label: 'Thiên Nhiên -16% Cortisol', note: 'Green exercise giảm stress nhiều hơn đi bộ trong phố' },
      { icon: '🧠', label: 'Chống Rumination', note: '20–30 phút giảm suy nghĩ tiêu cực lặp lại — Stanford 2015' },
      { icon: '🌬️', label: 'Hơi Thở 4-4 Bước', note: 'Đồng bộ nhịp thở + bước chân tăng HRV và thư giãn sâu' },
      { icon: '☀️', label: 'Morning Walk 3-in-1', note: 'Reset circadian + cortisol tốt + mindfulness trong 1 thói quen' },
    ],
  },
  {
    label: 'Viết nhật ký', icon: '📝', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Journaling là một trong số ít thực hành tâm lý được chứng minh qua RCT. James Pennebaker (ĐH Texas) cho thấy viết về cảm xúc khó khăn 20 phút/ngày × 3–4 ngày liên tiếp cải thiện sức khỏe thể chất, tăng T-lymphocytes, và giảm triệu chứng trầm cảm.',
    details: [
      'Cơ chế tác động: viết buộc não chuyển cảm xúc từ amygdala (hệ limbic, cảm xúc thô) sang prefrontal cortex (ngôn ngữ, lý luận). "Affect labeling" — đặt tên cho cảm xúc — giảm hoạt động amygdala đo được bằng fMRI.',
      'Expressive writing vs. gratitude journal: expressive writing (viết về điều khó khăn, cảm xúc tiêu cực) hiệu quả nhất cho người stress cao và trauma chưa xử lý. Gratitude journal (3 điều biết ơn) tốt nhất cho wellbeing hằng ngày. Kết hợp cả hai là tối ưu.',
      '3 câu hỏi tối thiểu: (1) Điều gì làm tôi căng thẳng nhất hôm nay? (2) Điều gì tôi biết ơn? (3) Ngày mai tôi muốn cảm thấy thế nào? 5 phút mỗi tối — consistency quan trọng hơn depth.',
      'Brain dump technique: khi overwhelmed, viết stream-of-consciousness 5 phút không dừng, không chỉnh sửa, không phán xét. Mục tiêu là "externalize" những gì đang chiếm working memory, giải phóng cognitive load.',
      'Morning pages (Julia Cameron): viết 3 trang A4 ngay khi thức dậy, trước coffee. Không cần hay — chỉ cần viết. Giúp process giấc mơ, set intention, và dọn dẹp tinh thần trước khi ngày bắt đầu.',
      'Vật lý vs. digital: viết tay kích hoạt nhiều vùng não hơn gõ phím — motor memory + ngôn ngữ + cảm xúc kết hợp. Tốc độ viết tay chậm hơn buộc não xử lý và filter ý tưởng sâu hơn. Sổ tay đơn giản là đủ.',
    ],
    points: [
      { icon: '🔬', label: 'RCT-Proven', note: 'Cải thiện sức khỏe thể chất + tăng T-lymphocytes — Pennebaker' },
      { icon: '🧠', label: 'Affect Labeling', note: 'Đặt tên cảm xúc → giảm hoạt động amygdala đo được bằng fMRI' },
      { icon: '🙏', label: 'Gratitude + Expressive', note: 'Kết hợp 2 loại: tối ưu cho wellbeing và stress relief' },
      { icon: '✍️', label: 'Viết Tay > Gõ Phím', note: 'Kích hoạt nhiều vùng não hơn — motor + ngôn ngữ + cảm xúc' },
    ],
  },
  {
    label: 'Không dùng điện thoại 30 phút', icon: '📵', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người dùng smartphone trung bình kiểm tra điện thoại 96 lần/ngày (Asurion 2019). Mỗi ngắt quãng = 23 phút để lấy lại deep focus hoàn toàn (Gloria Mark, UCI). 30 phút không điện thoại là "minimum viable break" để hệ thần kinh reset khỏi dopamine loop.',
    details: [
      'Dopamine loop: notification → micro-spike dopamine → check điện thoại → spike lớn hơn nếu có gì mới → hoặc drop nếu không → check lại. Não bị condition như slot machine. 30 phút offline phá vỡ cycle này và reset baseline dopamine tự nhiên.',
      'Default Mode Network (DMN): khi không có input bên ngoài, não chuyển sang DMN — liên quan đến sáng tạo, xử lý cảm xúc, và kết nối ý tưởng. Smartphones liên tục ngăn DMN hoạt động. 30 phút không điện thoại = não được "thở".',
      'Paradox của "just checking": điện thoại để mặt trên bàn (không dùng) vẫn giảm cognitive capacity 10–20% do "brain drain" — một phần attention luôn bị thu hút (Adrian Ward, UT Austin 2017). Để điện thoại ở phòng khác.',
      'Buổi sáng không điện thoại: tránh check 30–60 phút đầu sau thức dậy là thực hành hiệu quả nhất. Ngay khi check, amygdala bị kích hoạt (emails, news) → cortisol tăng → stress mode từ đầu ngày thay vì intention-setting mode.',
      'Trước ngủ: blue light ức chế melatonin 2–3 giờ. Nhưng quan trọng hơn là mental stimulation (scroll social, chat) giữ hệ thần kinh trong arousal state. Tắt điện thoại 30–60 phút trước ngủ = deep sleep tăng rõ rệt.',
      'Thực hành từng bước: (1) Airplane mode khi ăn tối; (2) Không điện thoại trong phòng ngủ; (3) Physical book thay phone buổi sáng. Mỗi thay đổi nhỏ cộng dồn thành thói quen bền vững hơn quy tắc tuyệt đối.',
    ],
    points: [
      { icon: '🎰', label: 'Dopamine Loop Reset', note: '30 phút offline phá vỡ slot machine cycle của notifications' },
      { icon: '💡', label: 'Default Mode Network', note: 'Não cần offline để sáng tạo và xử lý cảm xúc sâu' },
      { icon: '👁️', label: 'Phone Trên Bàn = -20% Não', note: 'Chỉ nhìn thấy điện thoại đã giảm cognitive capacity (Ward 2017)' },
      { icon: '🌙', label: 'Tắt 30 Phút Trước Ngủ', note: 'Mental stimulation — không phải chỉ blue light — mới là vấn đề' },
    ],
  },
  {
    label: 'Nghỉ ngơi không làm gì', icon: '😌', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Doing nothing" là kỹ thuật phục hồi bị đánh giá thấp nhất. Mary Helen Immordino-Yang (USC) cho thấy thời gian nghỉ ngơi không có mục đích là khi não xử lý kinh nghiệm, consolidate memory, và phát triển moral reasoning — không thể xảy ra trong khi làm việc liên tục.',
    details: [
      'Productive rest ≠ lazy: nghỉ ngơi không làm gì là khi default mode network (DMN) xử lý thông tin đã học, kết nối ý tưởng tưởng không liên quan, và tạo insight mới. Nhiều "eureka moments" xảy ra khi tắm, đi dạo, hoặc nằm không làm gì.',
      'Ultradian rest: sau mỗi 90 phút tập trung, não cần 15–20 phút nghỉ thực sự (không phải scroll điện thoại). Bỏ qua nhu cầu này → cognitive fatigue tích lũy → hiệu suất giảm dần. 4 chu kỳ 90+20 phút > 8 giờ liên tục.',
      'Non-sleep deep rest (NSDR): nằm xuống, nhắm mắt, không ngủ, không làm gì 10–20 phút. Nghiên cứu Huberman Lab: NSDR tăng dopamine 65% sau deep work session và accelerate skill learning khi thực hành ngay sau. Nap <20 phút tương tự.',
      'Guilt về nghỉ ngơi: nhiều người cảm thấy tội lỗi khi không làm gì — kết quả của "toxic productivity". Nhắc nhở: recovery là phần của performance, không phải đối lập. Cơ bắp cần ngày nghỉ; não cũng vậy.',
      'Staring into space: nhìn ra cửa sổ, ngồi trong vườn, ngắm trời — đây là nghỉ ngơi hiệu quả cao. Ánh sáng tự nhiên + không có task = DMN thoải mái nhất. Tiếng chim và gió giảm cortisol đo được hơn ngồi trong phòng im lặng.',
      'Lên lịch nghỉ ngơi: người perfectionist cần "scheduled idle time" trong lịch để thực sự cho phép bản thân nghỉ. Đặt "nghỉ 20 phút" như một meeting quan trọng — không được reschedule. Cấu trúc giúp người luôn bận tâm học cách nghỉ.',
    ],
    points: [
      { icon: '💡', label: 'DMN = Xử Lý Ngầm', note: 'Insight và sáng tạo xảy ra lúc nghỉ — không phải lúc làm việc' },
      { icon: '⚡', label: 'NSDR +65% Dopamine', note: 'Nằm không ngủ 10–20 phút sau deep work = phục hồi nhanh nhất' },
      { icon: '🔄', label: 'Ultradian 90+20 Phút', note: '4 chu kỳ nghỉ đúng cách > 8 giờ liên tục không nghỉ' },
      { icon: '🌿', label: 'Nhìn Thiên Nhiên = Nghỉ Thật', note: 'Cây xanh + tiếng chim giảm cortisol tốt hơn phòng im lặng' },
    ],
  },
];

const JOURNAL_QS = [
  'Điều gì làm bạn căng thẳng nhất hôm nay?',
  'Điều gì bạn biết ơn hôm nay?',
  'Ngày mai bạn muốn cảm thấy thế nào?',
];

function CalmModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = CALM_OPTIONS[idx];
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
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Thực hành {idx + 1}/{CALM_OPTIONS.length}</p>
          <h2 className="font-bold text-xl md:text-2xl mb-5 leading-snug" style={{ color: item.color }}>{item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
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
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {CALM_OPTIONS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

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

export default function ToolsMindTrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || { stress: 5, mood: '', calm: [], journal: {} }; } catch { return { stress: 5, mood: '', calm: [], journal: {} }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });
  const [calmModal, setCalmModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMtOrbitSpin { to { --f-mt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMtOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const update = (key, val) => {
    const next = { ...data, [key]: val };
    setData(next);
    const all = { ...history, [today]: next };
    setHistory(all);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const toggleCalm = (val) => {
    const next = data.calm.includes(val) ? data.calm.filter(c => c !== val) : [...data.calm, val];
    update('calm', next);
  };

  const updateJournal = (qi, val) => {
    update('journal', { ...data.journal, [qi]: val });
  };

  const stressColor = data.stress <= 3 ? '#22c55e' : data.stress <= 6 ? '#f59e0b' : '#ef4444';
  const stressLabel = data.stress <= 3 ? 'Thấp — tốt' : data.stress <= 6 ? 'Vừa — chú ý' : 'Cao — cần giảm tải';

  const last7 = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🧘</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Mind &amp; Calm Tracker</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Stress · Mood · Calm practice · Journaling
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi stress, tâm trạng và thực hành calm mỗi ngày. Nhận ra dấu hiệu cần giảm tải trước khi kiệt sức — không cần chờ đến khi vỡ vụn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop" alt="Mind tracker" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            nhận ra → điều chỉnh → bền vững
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Today */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Ghi Tâm Trí Hôm Nay</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-6">

          {/* Stress slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-lg font-medium text-text">🌡️ Mức stress hôm nay</label>
              <span className="text-lg font-bold" style={{ color: stressColor }}>{data.stress}/10 — {stressLabel}</span>
            </div>
            <input type="range" min="1" max="10" value={data.stress} onChange={e => update('stress', +e.target.value)}
              className="w-full" style={{ accentColor: stressColor }} />
            <div className="flex justify-between text-base text-muted mt-1"><span>1 Bình thản</span><span>5 Vừa</span><span>10 Quá tải</span></div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-lg font-medium text-text block mb-3">🎭 Tâm trạng chủ đạo hôm nay</label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button key={m.val} onClick={() => update('mood', m.val)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all text-base"
                  style={{ borderColor: data.mood === m.val ? m.color : 'rgba(255,255,255,0.08)', background: data.mood === m.val ? `${m.color}20` : 'transparent' }}>
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-muted">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calm practice */}
          <div>
            <label className="text-lg font-medium text-text block mb-3">🌿 Thực hành calm hôm nay (chọn tất cả đã làm)</label>
            <div className="grid grid-cols-2 gap-2">
              {CALM_OPTIONS.map((c, i) => {
                const checked = data.calm.includes(i);
                return (
                  <div key={i} className="group relative flex items-center gap-2 p-3 rounded-xl border transition-all text-base"
                    style={{ borderColor: calmModal === i ? `rgba(${c.rgb},0.5)` : checked ? `rgba(${c.rgb},0.4)` : 'rgba(255,255,255,0.08)', background: checked ? `rgba(${c.rgb},0.09)` : 'transparent' }}>
                    <button onClick={() => toggleCalm(i)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                      <span className="text-lg shrink-0">{c.icon}</span>
                      <span className={`text-sm leading-snug ${checked ? 'text-text' : 'text-muted'}`}>{c.label}</span>
                    </button>
                    <button onClick={() => setCalmModal(i)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      style={{ color: c.color, background: `rgba(${c.rgb},0.12)`, border: `1px solid rgba(${c.rgb},0.3)` }}>
                      Chi tiết →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Journaling */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nhật Ký 3 Câu</h2>
        <p className="text-muted text-lg mb-6">3 câu hỏi đơn giản, 3–5 phút, giúp bạn xử lý cảm xúc và đặt ý định cho ngày mai.</p>
        <div className="space-y-4">
          {JOURNAL_QS.map((q, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <label className="text-lg font-medium text-text block mb-2">{i + 1}. {q}</label>
              <textarea value={data.journal[i] ?? ''} onChange={e => updateJournal(i, e.target.value)}
                rows={2} placeholder="Nhập suy nghĩ của bạn..." className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day trend */}
      {last7.length > 1 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Xu Hướng 7 Ngày</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-base text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Ngày</th>
                  <th className="text-center py-2 font-medium">Stress</th>
                  <th className="text-center py-2 font-medium">Mood</th>
                  <th className="text-center py-2 font-medium">Calm</th>
                </tr>
              </thead>
              <tbody>
                {last7.map(([date, d]) => {
                  const moodObj = MOODS.find(m => m.val === d.mood);
                  const sc = (d.stress || 0) <= 3 ? '#22c55e' : (d.stress || 0) <= 6 ? '#f59e0b' : '#ef4444';
                  return (
                    <tr key={date} className="border-b border-border/50">
                      <td className="py-2 text-muted">{date.slice(5)}</td>
                      <td className="py-2 text-center"><span style={{ color: sc }}>{d.stress || '–'}/10</span></td>
                      <td className="py-2 text-center">{moodObj ? moodObj.icon : '–'}</td>
                      <td className="py-2 text-center text-muted">{(d.calm || []).length} mục</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      {/* Tips */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>💡 Dấu Hiệu Cần Giảm Tải</h3>
          <ul className="space-y-2 text-lg text-muted">
            {['Stress ≥ 7 trong 3 ngày liên tiếp', 'Mệt mỏi/căng thẳng là mood chủ đạo cả tuần', 'Không thực hành calm nào trong 3 ngày', 'Không ngủ được dù mệt', 'Không muốn nói chuyện với ai'].map((tip, i) => (
              <li key={i} className="flex gap-2"><span style={{ color: COLOR }}>⚠</span>{tip}</li>
            ))}
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {calmModal !== null && (
        <CalmModal
          idx={calmModal}
          onClose={() => setCalmModal(null)}
          onPrev={() => setCalmModal(i => Math.max(0, i - 1))}
          onNext={() => setCalmModal(i => Math.min(CALM_OPTIONS.length - 1, i + 1))}
          hasPrev={calmModal > 0}
          hasNext={calmModal < CALM_OPTIONS.length - 1}
        />
      )}
    </div>
  );
}
