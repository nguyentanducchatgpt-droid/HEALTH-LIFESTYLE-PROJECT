import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'c-deload-orbit-kf';
const ORBIT_PROP = '--c-deload-angle';
const ORBIT_CLASS = 'c-deload-orbit-ring';

const WHY_DELOAD = [
  {
    icon: '🔬', title: 'Siêu bù (Supercompensation)', desc: 'Sau stress → cơ thể phục hồi vượt mức cũ. Không có stress → không có lý do để mạnh hơn.',
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Siêu Bù — Cơ Chế Mạnh Hơn Sau Nghỉ',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Supercompensation là nền tảng sinh lý của mọi tiến bộ tập luyện. Sau mỗi buổi tập, cơ thể không chỉ phục hồi về mức ban đầu — mà phục hồi cao hơn baseline để chuẩn bị cho stress tương tự tiếp theo. Nếu bạn tập lại đúng vào đỉnh supercompensation, bạn train ở mức cao hơn và trigger được peak cao hơn nữa. Tập quá sớm (cơ chưa phục hồi) hoặc quá muộn (supercompensation đã qua đỉnh) đều làm mất cơ hội này.',
    detail: 'Supercompensation giải thích tại sao "nhiều hơn không phải lúc nào cũng tốt hơn". Tập liên tục không cho cơ thể thời gian để phục hồi vượt mức — kết quả là plateauing hoặc thậm chí regression. Deload có kế hoạch là công cụ để "reset" và tận dụng supercompensation đúng lúc.',
    details: [
      'Cơ chế GAS (General Adaptation Syndrome): Hans Selye mô tả 3 giai đoạn: Alarm (cơ thể nhận stress, hiệu suất giảm tạm thời), Resistance (cơ thể thích nghi, phục hồi và vượt baseline — đây là supercompensation), Exhaustion (stress kéo dài quá lâu không có recovery, cơ thể kiệt sức). Deload giữ bạn luôn ở giai đoạn Resistance, không để rơi vào Exhaustion.',
      'Cửa sổ supercompensation: sau 1 buổi tập, cơ thể đạt đỉnh supercompensation sau khoảng 24–72h (tùy cường độ, nhóm cơ và cá nhân). Đây là thời điểm lý tưởng để tập buổi tiếp theo. Tập quá sớm (dưới 24h) = cơ chưa đủ phục hồi. Tập sau 96h+ = supercompensation peak đã giảm xuống, mất lợi thế.',
      'Cumulative supercompensation: sau nhiều tuần tập nhất quán, mỗi chu kỳ supercompensation xây trên đỉnh của chu kỳ trước — đây là cách cơ bắp ngày càng to và mạnh hơn theo tháng và năm. Deload "lock in" gains của mesocycle vừa rồi và tạo nền mới cao hơn cho mesocycle tiếp theo.',
      'Tại sao cần deload sau mesocycle: sau 4–8 tuần tập tích lũy, mức stress cumulative quá cao để supercompensation xảy ra hoàn toàn. Deload 1 tuần giảm stress đủ để hệ thống phục hồi hoàn toàn — kết quả là supercompensation lớn nhất trong cả mesocycle xảy ra ngay sau tuần deload. Nhiều người thấy hiệu suất cao nhất của mình ngay sau khi deload.',
      'Không có stress = không có lý do để thích nghi: cơ thể rất "tiết kiệm" về năng lượng — nó chỉ xây dựng thêm cơ và sức mạnh khi có lý do (stress đủ lớn). Tập quá nhẹ, không tăng progressive overload = không có đủ stress để trigger supercompensation đáng kể. Deload phải theo sau những tuần tập đủ hard mới có ý nghĩa.',
      'Thực tế đo được: nghiên cứu trên vận động viên powerlifting cho thấy 1RM tăng trung bình 3–5% trong 2 tuần đầu sau deload so với cuối mesocycle — không phải vì họ "nghỉ ngơi thêm" mà vì supercompensation cuối cùng có đủ thời gian để hoàn thành. Đây là "deload effect" được đo bằng performance, không chỉ là cảm giác chủ quan.',
    ],
    points: [
      { icon: '📈', label: 'Peak sau 24–72h recovery', note: 'Tập đúng vào đỉnh supercompensation = cộng dồn gains theo từng chu kỳ' },
      { icon: '🔒', label: 'Deload "lock in" gains', note: 'Supercompensation lớn nhất xảy ra ngay sau tuần deload — hiệu suất đỉnh cao' },
      { icon: '⚡', label: '3–5% tăng 1RM sau deload', note: 'Đo được trên powerlifters — không chỉ cảm giác, là performance thực tế' },
      { icon: '😴', label: 'Stress → Rest → Mạnh hơn', note: 'GAS: Alarm → Resistance (supercompensation) → Exhaustion. Deload giữ ở Resistance' },
    ],
  },
  {
    icon: '🧠', title: 'Phục hồi hệ thần kinh', desc: 'CNS mệt mỏi không thể nhìn thấy như mệt cơ. Deload cho hệ thần kinh "reboot" hoàn toàn.',
    color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Phục Hồi CNS — Hệ Thần Kinh Cần Nghỉ Ngơi',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'CNS fatigue (mệt mỏi hệ thần kinh trung ương) là loại fatigue nguy hiểm nhất vì không thể nhìn thấy trực tiếp như cơ đau hay sưng. Người bị CNS fatigue nặng có thể vẫn bước vào phòng tập, nâng tạ với volume y cũ — nhưng motor unit recruitment giảm 15–30%, tốc độ dẫn truyền thần kinh chậm hơn và injury risk tăng đáng kể mà không hề biết.',
    detail: 'CNS không chỉ điều khiển cơ bắp — nó điều khiển mọi thứ: mood, motivation, sleep quality, immune function và cognitive performance. CNS fatigue từ tập luyện nặng cộng với stress công việc, thiếu ngủ và dinh dưỡng kém có thể "stack" và đạt điểm tới hạn — đây là lúc overtraining syndrome bắt đầu.',
    details: [
      'Motor unit recruitment và CNS: để nâng tạ nặng, não phải recruit nhiều motor unit (nhóm sợi cơ) cùng lúc với tần suất cao (rate coding). CNS fatigue làm giảm cả hai — ít motor unit được recruit hơn và chúng fire chậm hơn. Kết quả: cùng tạ nặng đó nhưng cơ thể phải "nỗ lực" nhiều hơn, recovery chậm hơn và injury risk tăng vì pattern movement bị ảnh hưởng.',
      'Neurotransmitter depletion: tập luyện cường độ cao kéo dài làm giảm dopamine, serotonin và norepinephrine — các neurotransmitter liên quan đến motivation, mood và focus. Đây là lý do người overtrained thường cảm thấy "không muốn tập" và cáu bẳn — không phải lười biếng, mà là neurotransmitter đã cạn và cần thời gian để hệ thống tổng hợp lại.',
      'HPA axis và cortisol: tập luyện stress → kích hoạt trục HPA (hypothalamic-pituitary-adrenal) → tiết cortisol. Cortisol ngắn hạn = bình thường và có ích. Cortisol mãn tính cao (do tập quá nhiều) = ức chế testosterone, GH, tiêu cơ, tăng fat storage bụng và giảm neuroplasticity. Deload hạ cortisol về baseline trong 5–7 ngày.',
      'Sleep và CNS recovery: deep sleep (N3) là giai đoạn CNS phục hồi nhiều nhất — myelin sheath (vỏ bọc dây thần kinh) được bảo trì, synaptic pruning diễn ra và protein waste products (adenosine, beta-amyloid) được loại bỏ qua glymphatic system. CNS fatigue thường đi kèm sleep quality kém — tạo vòng lặp xấu. Deload + ngủ đủ phá vỡ vòng lặp này.',
      'Resting heart rate (RHR) là chỉ số CNS: RHR cao hơn baseline 5–7 bpm trong 2–3 ngày liên tiếp là dấu hiệu CNS đang overloaded. HRV (Heart Rate Variability) thấp = CNS chưa recovery. Đây là 2 biomarker đơn giản nhất có thể theo dõi mà không cần lab test. Nhiều elite athlete dùng HRV sáng sớm để quyết định intensity của ngày hôm đó.',
      'CNS recovery timeline: cơ bắp recover trong 24–72h. CNS recover trong 48h–2 tuần tùy mức độ depletion. Đây là lý do "nghỉ 1–2 ngày" không đủ khi bị CNS fatigue nặng. Deload 1 tuần với volume giảm 50% cho CNS đủ thời gian để: tái tổng hợp neurotransmitter, normalize cortisol, cải thiện sleep quality và restore motor unit recruitment về baseline.',
    ],
    points: [
      { icon: '⚡', label: 'Motor unit recruitment giảm 15–30%', note: 'CNS fatigue = ít sợi cơ được recruit hơn — injury risk tăng mà không hay biết' },
      { icon: '🧪', label: 'Dopamine & serotonin cạn', note: '"Không muốn tập" = neurotransmitter thiếu, không phải lười — cần synthesis lại 5–7 ngày' },
      { icon: '📊', label: 'RHR +5–7 bpm = CNS báo động', note: 'Nhịp tim nghỉ cao hơn baseline liên tục là biomarker CNS overload đơn giản nhất' },
      { icon: '⏳', label: 'CNS cần 48h–2 tuần phục hồi', note: 'Cơ: 24–72h. CNS: 48h–14 ngày. Nghỉ 2 ngày không đủ khi CNS fatigue nặng' },
    ],
  },
  {
    icon: '🦴', title: 'Gân & khớp cần thời gian', desc: 'Gân và dây chằng phục hồi chậm hơn cơ 3–5 lần. Không deload = tích lũy vi chấn thương.',
    color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Gân & Khớp — Phục Hồi Chậm Nhưng Quan Trọng Nhất',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ bắp phục hồi trong 24–72h. Gân và dây chằng phục hồi trong 72h–6 tháng tùy mức độ tổn thương — chậm hơn 3–5 lần vì lưu thông máu đến gân rất kém (avascular tissue). Đây là lý do chấn thương gân thường xảy ra sau khi cơ bắp đã đủ mạnh để tạo lực vượt quá giới hạn của gân — gân "tụt lại phía sau" trong quá trình thích nghi.',
    detail: 'Vi chấn thương gân (micro-tears) tích lũy qua nhiều tuần tập không có deload — đến một điểm nào đó, collagen fiber breakdown vượt quá repair capacity và tendinopathy bắt đầu. Tendinopathy mãn tính có thể mất 3–6 tháng điều trị, so với 1 tuần deload phòng ngừa.',
    details: [
      'Tendon vascularity và healing: gân có lưu thông máu rất kém (hypovascular) — phần lớn dinh dưỡng được cung cấp qua synovial fluid (diffusion) chứ không phải mạch máu trực tiếp. Healing rate của gân chậm hơn cơ 3–5 lần vì thiếu oxygen và nutrients. Đây cũng là lý do tendon injury rất khó chữa và hay tái phát.',
      'Collagen turnover và deload: gân được làm từ collagen type I. Sau tập luyện, collagen breakdown và synthesis đều tăng — nhưng synthesis chậm hơn breakdown trong 24–36h đầu. Nếu tập lại trước khi synthesis hoàn tất, net collagen là âm theo thời gian → gân yếu dần. Deload cho đủ thời gian để collagen synthesis vượt breakdown.',
      'Cumulative tendon stress: mỗi buổi tập tạo ra micro-tears trong gân — đây là bình thường và cần thiết để tendon remodel mạnh hơn. Nhưng nếu stress đến nhanh hơn repair, vi chấn thương tích lũy → tendinopathy. Điểm quan trọng: gân không "đau" trong giai đoạn tích lũy ban đầu — đau chỉ xuất hiện khi đã có tổn thương đáng kể. Deload phòng ngừa trước khi đau.',
      'Khớp và synovial fluid: khớp cũng cần thời gian phục hồi — tập luyện nặng làm giảm viscosity của synovial fluid (dịch khớp) và tăng áp lực nội khớp. Cartilage (sụn khớp) không có mạch máu — hoàn toàn phụ thuộc vào diffusion từ synovial fluid. Deload cho synovial fluid thời gian để phục hồi composition và re-lubricate cartilage.',
      'Tendon-to-bone junction (enthesis): điểm gắn gân vào xương là vị trí chịu stress tập trung nhất và dễ bị injury nhất. Enthesopathy (viêm điểm bám gân) như "tennis elbow" (lateral epicondylitis), "jumper\'s knee" (patellar tendinopathy) đều bắt đầu ở đây. Deload đặc biệt quan trọng để bảo vệ điểm này — rest giảm stress concentration tại enthesis.',
      'Phục hồi sụn: cartilage không có nerve supply — không đau khi bị mài mòn ban đầu. Đến khi đau (bone-on-bone) thì đã quá muộn. Tập high-impact liên tục không deload tăng tốc mài mòn sụn khớp gối, hông và cột sống. Deload + low-impact active recovery giúp bơm dịch khớp và duy trì cartilage health mà không tạo thêm compression stress.',
    ],
    points: [
      { icon: '🐢', label: 'Gân phục hồi chậm hơn 3–5×', note: 'Avascular tissue — ít máu đến = healing chậm. Cơ to nhanh hơn gân → injury gap' },
      { icon: '⚠️', label: 'Tendinopathy = 3–6 tháng chữa', note: '1 tuần deload phòng ngừa vs 3–6 tháng điều trị — đầu tư rõ ràng' },
      { icon: '🔇', label: 'Gân không đau khi tích lũy', note: 'Vi chấn thương âm thầm — đau chỉ xuất hiện khi tổn thương đã đáng kể rồi' },
      { icon: '🦵', label: 'Điểm bám gân (enthesis) dễ bị nhất', note: 'Tennis elbow, jumper\'s knee đều bắt đầu ở đây — deload giảm stress concentration' },
    ],
  },
];

function DeloadModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = document.createElement('div');
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    const ref = { current: null };
    return () => ob.disconnect();
  }, []);
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

const SIGNALS = [
  { icon: '😴', title: 'Mệt mỏi kéo dài', desc: 'Sau 7–9h ngủ vẫn thức dậy không sảng khoái, cảm giác nặng nề suốt ngày.', severity: 'cao' },
  { icon: '📉', title: 'Hiệu suất sụt giảm', desc: 'Cân nặng quen thuộc trở nên khó hơn, cardio cùng pace mà tim đập nhanh hơn.', severity: 'cao' },
  { icon: '😤', title: 'Cáu bẳn, mất động lực', desc: 'Không muốn đến phòng tập, mọi thứ đều khó chịu, cảm xúc thất thường.', severity: 'trung bình' },
  { icon: '🤕', title: 'Đau nhức lan rộng', desc: 'Khớp, gân, cơ đau không rõ vị trí. Đau kéo dài hơn 48h sau buổi tập.', severity: 'cao' },
  { icon: '🛌', title: 'Ngủ không ngon', desc: 'Khó ngủ, ngủ chập chờn hoặc ngủ quá nhiều nhưng vẫn mệt.', severity: 'trung bình' },
  { icon: '🤒', title: 'Hay ốm vặt', desc: 'Hệ miễn dịch suy yếu: cảm cúm, viêm họng xuất hiện thường xuyên hơn bình thường.', severity: 'trung bình' },
  { icon: '🫀', title: 'Nhịp tim nghỉ tăng', desc: 'Sáng ngủ dậy đo nhịp tim cao hơn baseline 5–7 bpm trong 2–3 ngày liên tiếp.', severity: 'cao' },
];

const METHODS = [
  {
    id: 'volume',
    icon: '🔽',
    title: 'Giảm Volume (Phổ biến nhất)',
    desc: 'Giữ nguyên cường độ, giảm 40–60% tổng khối lượng tập.',
    howto: ['Giữ tạ nặng như thường', 'Giảm số set từ 4 → 2, số rep từ 12 → 8', 'Bỏ bớt 1–2 bài phụ', 'Thời gian tập ngắn hơn 30–40%'],
    best: 'Người tập sức mạnh, powerlifter',
    color: '#f97316',
  },
  {
    id: 'intensity',
    icon: '🎯',
    title: 'Giảm Intensity',
    desc: 'Giữ nguyên volume, giảm tạ xuống 50–60% 1RM.',
    howto: ['Số set và rep giữ nguyên', 'Giảm tạ xuống còn 50–60% max', 'Tập với tốc độ chậm hơn, kiểm soát nhiều hơn', 'Tập trung vào kỹ thuật'],
    best: 'Người tập hypertrophy, bodybuilder',
    color: '#06b6d4',
  },
  {
    id: 'frequency',
    icon: '📅',
    title: 'Giảm Tần Suất',
    desc: 'Giảm số buổi tập trong tuần, duy trì cường độ và volume mỗi buổi.',
    howto: ['Từ 5 buổi/tuần → 3 buổi', 'Mỗi buổi tập vẫn như thường', 'Ngày nghỉ thêm là active recovery', 'Tập full-body thay split routine'],
    best: 'Người tập 4–6 ngày/tuần',
    color: '#10b981',
  },
  {
    id: 'active',
    icon: '🚶',
    title: 'Active Deload',
    desc: 'Thay thế buổi tập bằng hoạt động nhẹ nhàng, vui vẻ.',
    howto: ['Bơi lội, đi bộ, yoga nhẹ', 'Không có mục tiêu hiệu suất', 'Chơi thể thao giải trí', 'Đi bộ trong thiên nhiên'],
    best: 'Người tập cardio nhiều, cần phục hồi tâm lý',
    color: '#a78bfa',
  },
];

const FREQUENCY = [
  { level: 'Mới bắt đầu (< 1 năm)', freq: 'Mỗi 8–10 tuần', duration: '1 tuần', note: 'Cơ thể vẫn đang thích nghi, ít cần deload' },
  { level: 'Trung cấp (1–3 năm)', freq: 'Mỗi 6–8 tuần', duration: '1 tuần', note: 'Bắt đầu cảm nhận được dấu hiệu rõ ràng hơn' },
  { level: 'Nâng cao (3–5 năm)', freq: 'Mỗi 4–6 tuần', duration: '1–2 tuần', note: 'Mỗi mesocycle nên kết thúc bằng deload' },
  { level: 'Elite (> 5 năm)', freq: 'Mỗi 3–4 tuần', duration: '1–2 tuần', note: 'Deload là phần không thể thiếu của lập kế hoạch' },
];

const DELOAD_WEEK = [
  { day: 'Thứ 2', type: 'Tập giảm volume', detail: 'Upper body: giảm 50% set, giữ tạ', intensity: 'light' },
  { day: 'Thứ 3', type: 'Active recovery', detail: 'Đi bộ 30 phút + foam rolling', intensity: 'very-light' },
  { day: 'Thứ 4', type: 'Tập giảm volume', detail: 'Lower body: giảm 50% set, giữ tạ', intensity: 'light' },
  { day: 'Thứ 5', type: 'Nghỉ hoàn toàn', detail: 'Stretching nhẹ, đi dạo 20 phút', intensity: 'rest' },
  { day: 'Thứ 6', type: 'Full-body nhẹ', detail: 'Compound movements @ 60% 1RM, 2×8', intensity: 'light' },
  { day: 'Thứ 7', type: 'Active leisure', detail: 'Bơi, leo núi, đạp xe → vui là chính', intensity: 'very-light' },
  { day: 'Chủ nhật', type: 'Nghỉ hoàn toàn', detail: 'Ngủ đủ giấc, chuẩn bị tinh thần tuần mới', intensity: 'rest' },
];

const INTENSITY_COLOR = { light: '#f97316', 'very-light': '#10b981', rest: '#6b7280' };

export default function LifestyleDeloadPage() {
  const [openSignal, setOpenSignal] = useState(null);
  const [openMethod, setOpenMethod] = useState('volume');
  const [whyIdx, setWhyIdx] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cDeloadOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cDeloadOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const activeMethod = METHODS.find(m => m.id === openMethod);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      {/* Breadcrumb */}
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>⚡</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Deload & Phục Hồi Chủ Động</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C5 · Deload</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Deload không phải lười biếng — đó là chiến lược. Những tuần giảm tải được lên kế hoạch chính là nơi bạn thực sự mạnh hơn, vì cơ thể có thời gian siêu bù để phát triển vượt mức ban đầu.</p>
        </div>
      </div>

      {/* Hero image */}
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop" alt="Deload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Deload = Đầu Tư Cho Tương Lai</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why deload */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Cần Deload?</h2>
        <p className="text-muted text-lg mb-6">Tập luyện = kích thích. Nghỉ ngơi = thích nghi. Thiếu nghỉ = không tiến bộ. Click để hiểu cơ chế khoa học.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WHY_DELOAD.map((item, i) => (
            <div key={i}
              className="rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `rgba(${item.rgb},0.2)`, background: `rgba(${item.rgb},0.04)` }}
              onClick={() => setWhyIdx(i)}>
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-lg font-bold text-text mb-2" style={{ color: item.color }}>{item.title}</div>
              <div className="text-base text-muted leading-relaxed mb-3">{item.desc}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ color: item.color, background: `rgba(${item.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7 Signals */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>7 Dấu Hiệu Cần Deload Ngay</h2>
        <p className="text-muted text-lg mb-6">Khi nhận thấy 3+ dấu hiệu này, đừng "cố" — hãy deload có kế hoạch.</p>
        <div className="space-y-2">
          {SIGNALS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden" style={{ borderColor: openSignal === i ? `rgba(${RGB},0.3)` : undefined }}>
              <button onClick={() => setOpenSignal(openSignal === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-3xl">{s.icon}</span>
                <span className="flex-1 text-lg font-medium text-text">{s.title}</span>
                <span className="text-base px-2 py-0.5 rounded-full font-bold" style={{ background: s.severity === 'cao' ? `rgba(${RGB},0.15)` : 'rgba(107,114,128,0.15)', color: s.severity === 'cao' ? COLOR : '#9ca3af' }}>
                  {s.severity === 'cao' ? '⚠️ Cao' : '⚡ TB'}
                </span>
                <span className="text-muted text-base">{openSignal === i ? '▲' : '▼'}</span>
              </button>
              {openSignal === i && (
                <div className="px-4 pb-4 pt-0">
                  <div className="ml-10 text-lg text-muted leading-relaxed border-t border-border pt-3">{s.desc}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 4 Methods */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Phương Pháp Deload</h2>
        <p className="text-muted text-lg mb-6">Chọn phương pháp phù hợp với mục tiêu và lịch tập của bạn.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => setOpenMethod(m.id)} className={`rounded-xl p-3 text-left transition-all border ${openMethod === m.id ? 'border-opacity-50' : 'border-border hover:border-opacity-30'}`} style={{ background: openMethod === m.id ? `rgba(${RGB},0.1)` : undefined, borderColor: openMethod === m.id ? COLOR : undefined }}>
              <div className="text-3xl mb-1">{m.icon}</div>
              <div className="text-base font-bold" style={{ color: openMethod === m.id ? COLOR : '#9ca3af' }}>{m.title.split('(')[0].trim()}</div>
            </button>
          ))}
        </div>
        {activeMethod && (
          <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{activeMethod.icon}</span>
              <div>
                <div className="text-lg font-bold text-text">{activeMethod.title}</div>
                <div className="text-lg text-muted">{activeMethod.desc}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Cách Thực Hiện</div>
                <ul className="space-y-1">
                  {activeMethod.howto.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-lg text-text"><span style={{ color: COLOR }}>→</span>{h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Phù Hợp Nhất Cho</div>
                <div className="rounded-xl p-3 text-lg text-muted" style={{ background: `rgba(${RGB},0.08)` }}>{activeMethod.best}</div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Frequency by level */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tần Suất Deload Theo Trình Độ</h2>
        <p className="text-muted text-lg mb-6">Càng tập lâu năm, cơ thể càng cần deload thường xuyên hơn.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">Trình Độ</th>
                <th className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">Chu Kỳ</th>
                <th className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">Thời Gian</th>
                <th className="text-left py-3 text-base font-bold uppercase tracking-widest text-muted">Ghi Chú</th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY.map((f, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 font-medium text-text">{f.level}</td>
                  <td className="py-3 pr-4" style={{ color: COLOR }}>{f.freq}</td>
                  <td className="py-3 pr-4 text-text">{f.duration}</td>
                  <td className="py-3 text-muted text-base">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* Sample deload week */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẫu Tuần Deload</h2>
        <p className="text-muted text-lg mb-6">Kế hoạch 7 ngày cho người tập 4–5 buổi/tuần (Giảm Volume).</p>
        <div className="space-y-2">
          {DELOAD_WEEK.map((d, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-3 border border-border bg-surface hover:border-opacity-30 transition-colors" style={{ borderColor: d.intensity !== 'rest' ? `rgba(${RGB},0.1)` : undefined }}>
              <div className="w-16 text-base font-bold text-center shrink-0" style={{ color: COLOR }}>{d.day}</div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: INTENSITY_COLOR[d.intensity] }} />
              <div className="flex-1">
                <div className="text-lg font-medium text-text">{d.type}</div>
                <div className="text-base text-muted">{d.detail}</div>
              </div>
              <div className="text-base px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${INTENSITY_COLOR[d.intensity]}20`, color: INTENSITY_COLOR[d.intensity] }}>
                {d.intensity === 'light' ? 'Nhẹ' : d.intensity === 'very-light' ? 'Rất nhẹ' : 'Nghỉ'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-4 text-lg text-muted border border-border" style={{ background: `rgba(${RGB},0.05)` }}>
          💡 <strong style={{ color: COLOR }}>Dinh dưỡng trong tuần deload:</strong> Giữ nguyên protein. Có thể giảm nhẹ carb nếu thấy khó chịu với việc ăn nhiều mà tập ít hơn. Không cần "ăn ít đi" — cơ thể đang sửa chữa và cần dưỡng chất.
        </div>
      </RevealBlock>

      {/* Key quote */}
      <RevealBlock className="mb-12">
        <blockquote className="rounded-2xl p-6 border-l-4 relative overflow-hidden" style={{ borderLeftColor: COLOR, background: `rgba(${RGB},0.05)` }}>
          <div className="text-5xl absolute right-6 top-4 opacity-10" style={{ color: COLOR }}>"</div>
          <p className="text-xl font-medium text-text leading-relaxed italic">"Người giỏi nhất không phải là người tập nhiều nhất — mà là người biết khi nào cần dừng để tăng tốc."</p>
          <cite className="text-base text-muted mt-3 block">— Nguyên tắc tập luyện dài hạn</cite>
        </blockquote>
      </RevealBlock>

      {/* Footer nav */}
      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/recovery" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Phục Hồi Chủ Động
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Kỹ Thuật Thở
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* ── Why deload modal — outside all RevealBlocks ── */}
      {whyIdx !== null && (
        <DeloadModal
          item={WHY_DELOAD[whyIdx]}
          idx={whyIdx}
          total={WHY_DELOAD.length}
          onClose={() => setWhyIdx(null)}
          onPrev={() => setWhyIdx(i => Math.max(0, i - 1))}
          onNext={() => setWhyIdx(i => Math.min(WHY_DELOAD.length - 1, i + 1))}
          hasPrev={whyIdx > 0}
          hasNext={whyIdx < WHY_DELOAD.length - 1}
        />
      )}
    </div>
  );
}
