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
  {
    icon: '😴', title: 'Mệt mỏi kéo dài', desc: 'Sau 7–9h ngủ vẫn thức dậy không sảng khoái, cảm giác nặng nề suốt ngày.', severity: 'cao',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mệt mỏi không cải thiện sau ngủ đủ giấc là dấu hiệu rõ ràng nhất của overtraining. Đây không phải "lười biếng" hay thiếu caffeine — mà là HPA axis (trục hạ đồi-tuyến yên-thượng thận) đang bị overloaded, cortisol mãn tính cao và adenosine tích lũy quá mức trong não. Ngủ 9–10h mà vẫn mệt = cơ thể đang trong debt quá sâu để ngủ bù được.',
    detail: 'Mệt mỏi kéo dài khác hoàn toàn với mệt sau 1 buổi tập. Mệt bình thường biến mất sau 24–48h nghỉ. Mệt mỏi overtraining kéo dài nhiều ngày dù nghỉ và ngủ đủ — đây là tín hiệu hệ thống đang bị tổn thương, không phải cơ bắp đơn thuần.',
    details: [
      'Adenosine và sleep pressure: adenosine là "hóa chất buồn ngủ" tích lũy khi thức. Ngủ giải phóng adenosine. Nhưng khi CNS bị overtrained, adenosine clearance kém ngay cả khi ngủ đủ — não không "flush" được waste products qua glymphatic system hiệu quả. Kết quả: ngủ đủ 8h nhưng sáng dậy vẫn mơ màng như ngủ 5h.',
      'Cortisol diurnal rhythm bị phá vỡ: bình thường cortisol peak sáng sớm (giúp thức dậy tỉnh táo) và thấp buổi tối (giúp ngủ). Overtraining làm cortisol tối vẫn cao (khó ngủ sâu) và cortisol sáng giảm thấp (thức dậy uể oải). Cả hai đầu bị đảo lộn — giải thích vì sao ngủ nhiều mà vẫn không refreshed.',
      'Mitochondrial dysfunction: tập cường độ cao liên tục tạo reactive oxygen species (ROS) quá mức. ROS tổn thương mitochondria — nhà máy năng lượng của tế bào. Khi mitochondria kém hiệu quả, ATP sản xuất ít hơn dù cơ thể cần nhiều hơn → mệt mỏi tế bào, không chỉ mệt cơ bắp bề mặt.',
      'Cách phân biệt với thiếu sắt/vitamin: overtraining fatigue thường đi kèm với các triệu chứng khác (sụt giảm hiệu suất, cáu bẳn, nhịp tim cao hơn). Thiếu sắt/B12 thường là mệt đơn thuần, không kèm mood và performance drop. Xét nghiệm máu cơ bản (CBC, ferritin, vitamin D, B12) loại trừ nguyên nhân y tế trước khi kết luận là overtraining.',
      'Functional overreaching vs overtraining syndrome: có 3 cấp độ. Non-functional overreaching: phục hồi trong 2–4 tuần deload. Overtraining syndrome (OTS): phục hồi 3–6 tháng, cần chuyên gia thể thao. Dấu hiệu OTS nặng: mệt mỏi > 2 tháng không cải thiện + depression + sụt hiệu suất >10%. Bắt đầu deload ngay ở giai đoạn đầu — đừng chờ đến OTS.',
      'Recovery protocol khi mệt mỏi kéo dài: không chỉ "nghỉ thêm". Cần giải quyết đồng thời: deload 1–2 tuần (giảm volume 50%), tăng protein (2g/kg), ưu tiên ngủ 8–9h, giảm stress ngoài gym, tăng omega-3 (giảm viêm hệ thống). Đơn thuần nghỉ ngơi mà không điều chỉnh dinh dưỡng recovery chậm hơn 2–3 tuần.',
    ],
    points: [
      { icon: '🧠', label: 'Glymphatic system kém hoạt động', note: 'Não không "flush" được adenosine khi CNS overtrained — ngủ đủ mà vẫn mơ màng' },
      { icon: '📊', label: 'Cortisol rhythm bị đảo lộn', note: 'Cao tối (khó ngủ sâu) + thấp sáng (dậy uể oải) — cả hai đầu đều bị ảnh hưởng' },
      { icon: '⚡', label: 'Mitochondria tổn thương', note: 'ROS quá mức → nhà máy ATP kém hiệu quả → mệt mỏi tế bào toàn thân' },
      { icon: '🚨', label: '> 2 tháng = OTS, cần chuyên gia', note: 'Overtraining syndrome cần 3–6 tháng phục hồi — deload sớm ở giai đoạn đầu' },
    ],
  },
  {
    icon: '📉', title: 'Hiệu suất sụt giảm', desc: 'Cân nặng quen thuộc trở nên khó hơn, cardio cùng pace mà tim đập nhanh hơn.', severity: 'cao',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hiệu suất sụt giảm là dấu hiệu khách quan nhất của overtraining — không thể "fake" được. Khi cân nặng quen thuộc cảm thấy nặng hơn, tốc độ chạy giảm hoặc nhịp tim cao hơn ở cùng pace, hệ thần kinh trung ương đang không thể recruit đủ motor unit. Đây không phải "ngày tệ" ngẫu nhiên — mà là pattern kéo dài 5–7 ngày trở lên.',
    detail: 'Performance drop là "lie detector" của overtraining. Cảm giác mệt có thể bị che giấu bằng pre-workout, caffeine hay adrenaline buổi tập đầu tiên. Nhưng numbers không nói dối — nếu 1RM giảm, pace giảm hoặc RPE tăng liên tục trong 1–2 tuần, cơ thể đang nói rõ: cần deload.',
    details: [
      'Motor unit recruitment và CNS fatigue: sức mạnh tối đa phụ thuộc vào não có thể "bật" bao nhiêu motor unit cùng lúc (motor unit recruitment) và chúng fire nhanh thế nào (rate coding). CNS fatigue làm cả hai giảm — ít sợi cơ tham gia hơn, tốc độ thần kinh chậm hơn. Kết quả trực tiếp: cân nặng cũ cảm thấy nặng hơn dù cơ bắp không thay đổi.',
      'Cardiac drift và overtraining: nhịp tim cao hơn ở cùng pace/intensity là dấu hiệu tim phải làm việc nhiều hơn để duy trì cùng output. Stroke volume (lượng máu mỗi nhịp bơm) giảm khi overloaded → nhịp tim compensate bằng cách tăng frequency. Điều này có thể đo được: đo nhịp tim khi chạy pace quen thuộc — nếu cao hơn baseline 10+ bpm, đây là dấu hiệu rõ ràng.',
      'Velocity-based training (VBT) phát hiện sớm: trong strength training, bar speed (tốc độ thanh tạ) là chỉ số nhạy hơn 1RM để phát hiện fatigue sớm. Khi bar speed giảm 15–20% ở cùng load, CNS đang báo hiệu cần nghỉ — ngay cả khi bạn vẫn complete được rep. Không có VBT? Quan sát thời gian lift — nếu lâu hơn bình thường rõ rệt, đây là proxy tốt.',
      'Psychological performance indicators: motivation trước buổi tập giảm, concentration trong khi tập kém, reaction time chậm hơn. Đây là CNS performance, không phải muscle performance — và thường xuất hiện trước khi strength/endurance metrics giảm. "Không muốn tập" kéo dài + hiệu suất giảm = đủ điều kiện deload.',
      'Tại sao không phải "ngày tệ": 1 ngày hiệu suất kém có thể do thiếu ngủ đêm trước, ăn kém, stress công việc. Pattern kéo dài 5–7 ngày với nhiều buổi tập liên tiếp = overtraining signal, không phải ngẫu nhiên. Cách kiểm tra: ghi lại performance data mỗi buổi tập — trendline xuống dốc liên tục là tín hiệu rõ ràng.',
      'Recovery timeline sau deload: hiệu suất thường bắt đầu cải thiện trong tuần deload và đạt đỉnh mới trong 1–2 tuần đầu sau khi training trở lại. Đây là "deload effect" được ghi nhận rộng rãi — nhiều vận động viên phá record cá nhân ngay sau tuần deload vì supercompensation đạt đỉnh.',
    ],
    points: [
      { icon: '🏋️', label: 'Cân cũ cảm thấy nặng hơn', note: 'CNS không recruit đủ motor unit — sợi cơ không thay đổi, nhưng não bật ít sợi hơn' },
      { icon: '💓', label: 'Nhịp tim cao hơn cùng pace', note: 'Stroke volume giảm → tim compensate bằng tần số — đo được, không thể fake' },
      { icon: '📅', label: 'Pattern 5–7 ngày, không phải 1 ngày', note: '1 ngày tệ = random. 5–7 ngày liên tiếp kém = overtraining signal rõ ràng' },
      { icon: '📈', label: 'PR sau deload là phổ biến', note: 'Supercompensation peak ngay sau deload — nhiều người phá record cá nhân lúc này' },
    ],
  },
  {
    icon: '😤', title: 'Cáu bẳn, mất động lực', desc: 'Không muốn đến phòng tập, mọi thứ đều khó chịu, cảm xúc thất thường.', severity: 'trung bình',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cáu bẳn và mất động lực khi overtrained không phải vấn đề tâm lý hay "mindset yếu" — đây là triệu chứng sinh hóa. Dopamine và serotonin — hai neurotransmitter quyết định motivation và mood — đều bị depleted bởi tập luyện cường độ cao kéo dài. Khi dopamine giảm thấp, não không tạo ra được "reward signal" từ việc tập luyện nữa, dẫn đến mất hoàn toàn động lực.',
    detail: 'Trong thể thao học, mood disturbance (rối loạn tâm trạng) là một trong những chỉ số quan trọng nhất để đánh giá overtraining — và được đo bằng bộ công cụ POMS (Profile of Mood States). Khi "Total Mood Disturbance" tăng cao, đây là dấu hiệu hệ thần kinh đang bị stress quá mức, cần can thiệp ngay.',
    details: [
      'Dopamine depletion và motivation: dopamine là neurotransmitter của "wanting" và "pursuing" — không phải pleasure trực tiếp mà là động lực để hành động hướng đến reward. Tập luyện nặng liên tục làm cạn kiệt dopamine precursors (tyrosine) và receptor sensitivity giảm. Kết quả: phòng tập không còn hấp dẫn, không còn thích thú khi plan buổi tập tiếp theo.',
      'Serotonin và mood regulation: serotonin điều chỉnh mood, irritability và impulse control. Exercise-induced serotonin synthesis tăng ngắn hạn sau mỗi buổi tập — đây là "runner\'s high". Nhưng khi overtrained, long-term serotonin depletion xảy ra — giải thích vì sao người overtrained thường irritable (cáu bẳn) và emotionally labile (cảm xúc không ổn định) ngay cả khi không liên quan đến tập luyện.',
      'HPA axis dysregulation và emotional reactivity: cortisol mãn tính cao ảnh hưởng đến amygdala (vùng não xử lý cảm xúc) — làm tăng emotional reactivity và giảm rational thinking. Người overtrained thường overreact với stress nhỏ, khó kiểm soát cảm xúc và có cảm giác "mọi thứ đều quá sức". Đây không phải yếu đuối — đây là amygdala bị cortisol "kích hoạt quá mức".',
      'Anhedonia training: khi mất hoàn toàn niềm vui từ tập luyện — thứ trước đây bạn yêu thích — đây là dấu hiệu anhedonia (mất khả năng trải nghiệm pleasure). Anhedonia từ overtraining là tạm thời và phục hồi được với deload. Nhưng nếu kéo dài > 1 tháng sau deload, cần đánh giá với chuyên gia tâm lý vì có thể là overtraining syndrome nặng hoặc depression thực sự.',
      'Phân biệt với plateau và burnout: plateau = hiệu suất không tăng nhưng mood bình thường. Burnout = mất motivation với mọi khía cạnh của cuộc sống, không chỉ tập luyện. Overtraining mood disturbance = cụ thể với tập luyện + có các triệu chứng thể chất đi kèm (mệt mỏi, hiệu suất giảm). Ba loại cần can thiệp khác nhau.',
      'Recovery của neurotransmitter: dopamine và serotonin cần 1–3 tuần để tái tổng hợp về baseline sau overtraining. Deload + đủ protein (tyrosine, tryptophan là precursors) + ngủ đủ + giảm stress ngoài gym = đẩy nhanh quá trình này. Supplement tryptophan (500mg trước ngủ) có thể hỗ trợ serotonin synthesis trong giai đoạn recovery.',
    ],
    points: [
      { icon: '🔋', label: 'Dopamine depleted = motivation biến mất', note: 'Không phải mindset yếu — là neurotransmitter cạn. Phòng tập mất hấp dẫn = tín hiệu sinh hóa' },
      { icon: '😠', label: 'Serotonin thấp = cáu bẳn tăng', note: 'Long-term serotonin depletion → irritability và emotional instability ngay cả ngoài gym' },
      { icon: '🧪', label: 'POMS đo mood trong thể thao', note: 'Profile of Mood States — chỉ số khoa học chính để đánh giá overtraining' },
      { icon: '⏳', label: '1–3 tuần deload tái tổng hợp', note: 'Neurotransmitter phục hồi với deload + protein đủ + ngủ đủ + giảm stress' },
    ],
  },
  {
    icon: '🤕', title: 'Đau nhức lan rộng', desc: 'Khớp, gân, cơ đau không rõ vị trí. Đau kéo dài hơn 48h sau buổi tập.', severity: 'cao',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đau nhức lan rộng không rõ vị trí (diffuse musculoskeletal pain) khác với DOMS bình thường. DOMS có vị trí rõ ràng (cơ vừa tập), peak 24–48h và biến mất sau 72h. Đau overtraining lan sang nhiều vùng không liên quan đến buổi tập gần nhất, kéo dài > 48–72h và không giảm dù nghỉ. Đây là dấu hiệu viêm hệ thống (systemic inflammation) — không còn là vấn đề của 1 nhóm cơ.',
    detail: 'Khi cơ thể không kịp repair micro-tears từ buổi tập trước, buổi tập tiếp theo tạo thêm damage lên mô chưa lành. Tích lũy qua nhiều tuần, viêm cục bộ chuyển thành viêm hệ thống — cytokines pro-inflammatory (IL-6, TNF-α) tăng cao trong máu, ảnh hưởng đến toàn thân chứ không chỉ cơ bắp.',
    details: [
      'DOMS vs overtraining pain: DOMS (Delayed Onset Muscle Soreness) là đau bình thường 24–72h sau khi tập nhóm cơ mới hoặc tập nặng hơn thường. Đặc điểm: đau ở đúng cơ vừa tập, tender khi chạm, biến mất sau 72h. Overtraining pain: đau nhiều vùng cùng lúc (cổ, vai, lưng, gối — không liên quan logic), kéo dài > 72h và không phụ thuộc buổi tập nào.',
      'Systemic inflammation markers: IL-6 (interleukin-6), CRP (C-reactive protein) và TNF-α tăng cao trong overtraining. Những cytokines này gây: đau nhức toàn thân (như triệu chứng cúm), mệt mỏi, giảm appetite và mood thấp. Đây là lý do người overtrained đôi khi cảm thấy "như bị cảm cúm" — phản ứng viêm tương tự.',
      'Connective tissue breakdown: collagen trong gân, dây chằng và sụn không kịp repair → breakdown vượt synthesis. Cơ thể phát tín hiệu đau để ngăn tổn thương thêm — nhưng nhiều người ignore và tập tiếp. Điểm quan trọng: đau ở gân/khớp (không phải cơ) cần thời gian phục hồi dài hơn nhiều và không nên bị ignore.',
      'Pain threshold thay đổi: nghiên cứu cho thấy overtraining làm thay đổi pain threshold — một số người trở nên hypersensitive (đau nhiều hơn với cùng kích thích), một số khác trở nên hyposensitive (ngưỡng đau tăng vì cơ thể adapt). Hypersensitivity rõ ràng hơn ở overtraining syndrome — đau lan rộng với kích thích nhỏ.',
      'Khi đau nhức kèm sưng hoặc yếu cơ đột ngột: đây là dấu hiệu có thể có tổn thương cấu trúc thực sự (stress fracture, partial tendon tear). Không tự chẩn đoán là overtraining — cần X-ray hoặc MRI loại trừ chấn thương thực sự trước. Đặc biệt nếu đau tập trung 1 điểm và tăng khi tải lực.',
      'Anti-inflammatory protocol khi deload: omega-3 (EPA/DHA 2–4g/ngày) giảm systemic inflammation. Tart cherry juice (480ml/ngày) chứa anthocyanins giảm IL-6. Curcumin (500–1000mg/ngày) ức chế NF-κB pathway. Những can thiệp dinh dưỡng này cộng với deload đẩy nhanh phục hồi viêm hệ thống nhanh hơn rest đơn thuần.',
    ],
    points: [
      { icon: '🌐', label: 'Viêm hệ thống, không cục bộ', note: 'IL-6, CRP tăng cao → đau "như cúm" toàn thân — không phải cơ bắp đơn thuần' },
      { icon: '⏱️', label: 'DOMS biến mất sau 72h, không phải này', note: 'Đau > 72h và lan nhiều vùng = overtraining signal, không phải DOMS bình thường' },
      { icon: '🔬', label: 'Đau gân/khớp nghiêm trọng hơn cơ', note: 'Connective tissue breakdown → không ignore đau gân/khớp, phục hồi chậm hơn 3–5× cơ' },
      { icon: '🐟', label: 'Omega-3 + tart cherry hỗ trợ phục hồi', note: '2–4g EPA/DHA/ngày + anthocyanins → giảm IL-6 và systemic inflammation nhanh hơn' },
    ],
  },
  {
    icon: '🛌', title: 'Ngủ không ngon', desc: 'Khó ngủ, ngủ chập chờn hoặc ngủ quá nhiều nhưng vẫn mệt.', severity: 'trung bình',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Overtraining phá vỡ sleep architecture theo cả hai hướng: khó ngủ (cortisol tối cao → melatonin bị ức chế) và ngủ nhiều nhưng vẫn mệt (N3 deep sleep bị giảm chất lượng dù thời gian đủ). Đây là vòng lặp nguy hiểm: tập quá nặng → cortisol cao → ngủ kém → recovery kém → buổi tập hôm sau cần cố gắng nhiều hơn → cortisol càng cao hơn.',
    detail: 'Sleep quality là chỉ số recovery quan trọng nhất — và cũng là thứ bị ảnh hưởng sớm nhất bởi overtraining. Nhiều elite athlete dùng HRV (Heart Rate Variability) đo sáng sớm như proxy cho sleep quality và CNS recovery state để quyết định training load ngày hôm đó.',
    details: [
      'Cortisol và melatonin inverse relationship: cortisol và melatonin hoạt động đối lập nhau theo nhịp sinh học. Khi cortisol cao (sáng), melatonin thấp — tỉnh táo. Khi melatonin cao (tối), cortisol thấp — buồn ngủ. Overtraining giữ cortisol cao suốt ngày kể cả buổi tối → ức chế melatonin production → khó đi vào giấc ngủ, ngủ chập chờn.',
      'N3 deep sleep suppression: cortisol cao ức chế slow-wave sleep (N3) — giai đoạn phục hồi thể chất chính. Người có thể ngủ 9h nhưng phần lớn là light sleep (N1, N2) — không có đủ N3 để tiết GH và repair mô. Đây là lý do ngủ nhiều mà vẫn mệt khi overtrained: quantity OK nhưng quality rất kém.',
      'Sympathetic nervous system activation lúc ngủ: bình thường khi ngủ, hệ thần kinh phó giao cảm dominant (rest & digest). Khi overtrained, hệ giao cảm vẫn active → nhịp tim khi ngủ cao hơn bình thường, HRV thấp, không vào được deep sleep ổn định. Người có wearable (Whoop, Garmin, Oura) có thể thấy rõ: resting HR cao hơn 3–5 bpm và HRV thấp hơn baseline.',
      'Ngủ quá nhiều (hypersomnia) cũng là dấu hiệu: cơ thể cố gắng compensate bằng cách tăng nhu cầu ngủ. Nhưng khi ngủ quality kém (ít N3), ngủ 10–11h vẫn không refreshed. Hypersomnia + vẫn mệt = dấu hiệu nặng hơn insomnia đơn thuần — hệ thống phục hồi bị tổn thương sâu.',
      'Sleep restriction và performance decline: mỗi đêm ngủ dưới 7h trong overtraining context làm giảm reaction time, tăng cortisol thêm, giảm testosterone và IGF-1 production đêm. Vòng lặp này tự gia cố — sleep debt + overtraining = hole ngày càng sâu hơn.',
      'Sleep hygiene cho giai đoạn deload: nhiệt độ phòng 18–19°C, tối hoàn toàn, không screen 1h trước ngủ. Tắm nước ấm 1–2h trước ngủ (paradox: nước ấm làm giãn mạch, nhiệt thoát qua da, core temperature giảm → trigger sleep onset). Magnesium glycinate 200–400mg trước ngủ hỗ trợ GABA và giảm cortisol tối.',
    ],
    points: [
      { icon: '🔄', label: 'Vòng lặp: overtrain → cortisol cao → ngủ kém → recovery kém', note: 'Phá vỡ vòng lặp bằng deload — không thể break bằng cách cố ngủ nhiều hơn' },
      { icon: '💤', label: 'N3 deep sleep bị suppressed', note: 'Ngủ 9h mà thiếu N3 = không tiết đủ GH, không repair mô — quantity không thay quality' },
      { icon: '📱', label: 'HRV sáng sớm = chỉ số recovery', note: 'HRV thấp hơn baseline + RHR cao hơn = CNS chưa recovered. Wearable phát hiện sớm' },
      { icon: '🛁', label: 'Tắm ấm 1–2h trước ngủ', note: 'Giãn mạch → nhiệt thoát → core temp giảm → trigger sleep onset. Nghịch lý nhưng hiệu quả' },
    ],
  },
  {
    icon: '🤒', title: 'Hay ốm vặt', desc: 'Hệ miễn dịch suy yếu: cảm cúm, viêm họng xuất hiện thường xuyên hơn bình thường.', severity: 'trung bình',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tập luyện vừa phải (moderate) tăng cường miễn dịch. Nhưng tập quá nặng liên tục tạo ra "open window" — một khoảng thời gian sau mỗi buổi tập nặng khi hệ miễn dịch bị suppressed tạm thời 3–72h. Khi open window xảy ra quá thường xuyên (tập quá nhiều buổi/tuần) và kết hợp với cortisol mãn tính cao (ức chế immune cells), nguy cơ nhiễm trùng đường hô hấp trên tăng 2–6 lần so với người không tập.',
    detail: 'J-curve relationship giữa tập luyện và miễn dịch: người không tập (ít hoạt động thể chất) có immune function thấp. Người tập vừa phải (moderate) có immune function cao nhất. Người tập quá nặng liên tục (overtrained) có immune function thậm chí thấp hơn người không tập. Deload đưa bạn trở lại điểm "moderate" trên J-curve.',
    details: [
      'Open window hypothesis: sau mỗi buổi tập cường độ cao (>75% VO2max, >60 phút), các immune markers bị suppressed: IgA (secretory immunoglobulin ở niêm mạc mũi/họng giảm), NK cells (natural killer cells giảm activity), neutrophil function giảm. Window này kéo dài 3–72h. Người tập 6–7 ngày/tuần nặng = immune suppression gần như liên tục.',
      'Cortisol và lymphocyte suppression: cortisol mãn tính cao ức chế trực tiếp lymphocyte proliferation và NK cell cytotoxicity. IgA secretory ở niêm mạc đường hô hấp — tuyến phòng thủ đầu tiên chống virus — bị giảm đặc biệt rõ rệt. Đây là lý do vận động viên marathon và triathlon hay bị URTI (upper respiratory tract infection) ngay sau race.',
      'Glutamine depletion: glutamine là nhiên liệu chính của immune cells (lymphocytes, macrophages). Tập luyện nặng tiêu thụ glutamine cơ bắp nhanh — nếu không bổ sung đủ từ chế độ ăn, immune cells "thiếu xăng". Protein thấp trong chế độ ăn + tập nặng = double hit cho glutamine pool và immune function.',
      'Dấu hiệu nhận biết: ốm vặt 1–2 lần/tháng (cảm cúm nhẹ, viêm họng, loét miệng), vết thương lành chậm hơn bình thường, dị ứng trở nên tệ hơn. Không phải coincidence — đây là immune suppression pattern của overtraining.',
      'Tập khi đang ốm: nếu đang ốm nhẹ (triệu chứng trên cổ: sổ mũi, đau họng nhẹ, không sốt), có thể tập nhẹ theo "neck rule". Nếu sốt, mệt toàn thân, đau cơ khớp (triệu chứng dưới cổ) — không tập. Tập khi sốt tăng tải cho tim và có thể gây myocarditis (viêm cơ tim) trong trường hợp hiếm gặp với virus nhất định.',
      'Phục hồi miễn dịch với deload: IgA secretory phục hồi trong 24–48h sau khi giảm training load. NK cell activity phục hồi trong 48–72h. Cortisol giảm dần trong 5–7 ngày deload. Vitamin D (1000–2000 IU/ngày nếu thiếu), zinc (15–30mg/ngày) và probiotics hỗ trợ immune recovery trong giai đoạn deload.',
    ],
    points: [
      { icon: '📉', label: 'J-curve: overtrain < không tập về miễn dịch', note: 'Tập quá nhiều có immune function thấp hơn người không tập — không phải myth' },
      { icon: '🪟', label: 'Open window 3–72h sau tập nặng', note: 'IgA niêm mạc giảm, NK cells giảm — immune suppression mỗi buổi tập, stack qua nhiều ngày' },
      { icon: '⛽', label: 'Glutamine cạn = immune cells thiếu nhiên liệu', note: 'Protein thấp + tập nặng = double depletion. Ăn đủ protein bảo vệ immune function' },
      { icon: '🌡️', label: 'Sốt + mệt toàn thân = không tập', note: '"Neck rule": triệu chứng dưới cổ → không tập. Myocarditis risk dù hiếm gặp' },
    ],
  },
  {
    icon: '🫀', title: 'Nhịp tim nghỉ tăng', desc: 'Sáng ngủ dậy đo nhịp tim cao hơn baseline 5–7 bpm trong 2–3 ngày liên tiếp.', severity: 'cao',
    color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Resting heart rate (RHR) sáng sớm là biomarker đơn giản, miễn phí và khách quan nhất để theo dõi overtraining. Khi RHR cao hơn baseline cá nhân 5–7 bpm liên tiếp 2–3 ngày, đây là dấu hiệu hệ thần kinh giao cảm đang overactivated — tim phải đập nhanh hơn vì stroke volume giảm (tim bơm ít máu hơn mỗi nhịp do cardiac fatigue) hoặc vì cortisol/catecholamine cao duy trì heart rate cao.',
    detail: 'Nhiều elite athlete và coach chuyên nghiệp dùng RHR sáng sớm như "traffic light" hàng ngày: xanh (RHR bình thường) = tập như kế hoạch, vàng (RHR +3–5 bpm) = giảm intensity, đỏ (RHR +7+ bpm hoặc 2–3 ngày liên tiếp tăng) = active recovery hoặc nghỉ hoàn toàn.',
    details: [
      'Cách đo RHR đúng: đo ngay khi thức dậy, trước khi ra khỏi giường, sau khi nằm yên 2–3 phút. Đo bằng ngón tay ở cổ tay hoặc cổ trong 60 giây. Smartwatch có thể đo overnight RHR (trung bình khi ngủ) — chính xác hơn. Cần 2–4 tuần dữ liệu để xác định "baseline" cá nhân vì RHR khác nhau đáng kể giữa người (40–80 bpm đều có thể là bình thường).',
      'Tại sao RHR tăng khi overtrained: (1) Sympathetic nervous system overactivation — adrenaline và noradrenaline cao → chronotropic effect (tăng nhịp tim). (2) Stroke volume giảm do cardiac fatigue — tim compensate bằng cách tăng nhịp để duy trì cardiac output. (3) Dehydration và electrolyte imbalance giảm blood volume → HR tăng để compensate.',
      'HRV là chỉ số tinh tế hơn RHR: Heart Rate Variability đo sự biến thiên giữa các nhịp tim (không phải nhịp tim trung bình). HRV cao = hệ thần kinh phó giao cảm dominant = body recovered. HRV thấp = giao cảm dominant = stress cao. HRV thay đổi trước RHR khi bắt đầu overtraining — phát hiện sớm hơn 1–3 ngày.',
      'Cardiac adaptation vs cardiac fatigue: tim người tập đều (athlete\'s heart) thường có RHR thấp hơn người bình thường (45–55 bpm) vì stroke volume lớn hơn — đây là adaptation tốt. Nhưng khi overtrained, ngay cả athlete có thể thấy RHR tăng 10–15 bpm so với baseline của họ. Không so sánh với người khác — so sánh với baseline CỦA BẠN.',
      'RHR trend quan trọng hơn single reading: 1 ngày RHR cao có thể do nhiều lý do (caffeine, căng thẳng, ngủ ít). Pattern tăng dần 3–5 ngày liên tiếp = overtraining signal. Tracking app (Whoop, Garmin Connect, Apple Health) tự động tính trend này — không cần tự nhớ.',
      'Protocol khi RHR + 5–7 bpm liên tiếp: ngày đầu giảm intensity 40–50% (hoặc rest hoàn toàn). Ngày 2: đánh giá lại RHR buổi sáng. Nếu vẫn cao → active recovery nhẹ, không tập. Ngày 3: nếu RHR về gần baseline → có thể tập nhẹ. Nếu vẫn cao sau 3 ngày → trigger protocol deload 1 tuần đầy đủ.',
    ],
    points: [
      { icon: '🚦', label: '+5 bpm = vàng, +7 bpm 2–3 ngày = đỏ', note: 'Traffic light system: giảm intensity hoặc rest hoàn toàn tùy mức tăng' },
      { icon: '📊', label: 'HRV phát hiện sớm hơn RHR 1–3 ngày', note: 'Biến thiên giữa nhịp tim — thay đổi trước khi RHR tăng đo được' },
      { icon: '📱', label: 'Đo ngay khi thức dậy, trước khi dậy giường', note: 'Nằm yên 2–3 phút sau khi tỉnh, đo 60 giây — quy trình chuẩn mỗi sáng' },
      { icon: '📈', label: 'Trend 3–5 ngày, không phải 1 ngày', note: 'Single reading nhiễu, pattern liên tiếp = overtraining signal đáng tin cậy' },
    ],
  },
];

const METHODS = [
  {
    id: 'volume', icon: '🔽', color: '#f97316', rgb: '249,115,22',
    title: 'Giảm Volume (Phổ biến nhất)',
    desc: 'Giữ nguyên cường độ, giảm 40–60% tổng khối lượng tập.',
    best: 'Người tập sức mạnh, powerlifter',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm volume là phương pháp deload được nghiên cứu nhiều nhất và hiệu quả nhất cho hầu hết mọi người. Lý do: cường độ (tạ nặng) là tín hiệu chính để duy trì strength và neural adaptations — giảm volume nhưng giữ cường độ = duy trì stimulus đủ để không mất gains, đồng thời giảm fatigue đủ để supercompensation xảy ra. Đây là "minimum effective dose" của deload.',
    detail: 'Nguyên tắc cốt lõi: giảm 40–60% total tonnage (tổng khối lượng = sets × reps × weight), giữ nguyên hoặc gần nguyên intensity (% 1RM). Ví dụ: thay vì 4 sets × 8 reps × 100kg = 3200kg, làm 2 sets × 5 reps × 100kg = 1000kg. Cùng tạ nặng, bằng 31% volume.',
    details: [
      'Tại sao giữ cường độ quan trọng: strength là neural adaptation — não học cách recruit motor units hiệu quả hơn. Giảm tạ nhiều (xuống 50–60% 1RM) làm mất neural stimulus → strength giảm nhanh hơn. Giữ nguyên tạ nặng nhưng giảm sets/reps = CNS và cơ bắp vẫn nhận "reminder signal" mà không bị fatigue thêm.',
      'Cách tính volume cut: nếu bình thường làm 4 sets × 10 reps cho mỗi bài → deload còn 2 sets × 6–8 reps. Nếu bình thường 5 bài/buổi → deload còn 3 bài (bỏ bài phụ, giữ compound chính). Tổng tonnage giảm 40–60% nhưng pattern movement và load quen thuộc được duy trì.',
      'Compound over accessory: trong tuần deload giảm volume, ưu tiên compound movements (squat, deadlift, bench, row) và bỏ hoặc giảm mạnh accessory/isolation. Compound movements duy trì neural pattern và recruit nhiều motor unit hơn accessory — hiệu quả hơn nhiều với ít sets hơn.',
      'RPE target trong deload: aim cho RPE 6–7 (thay vì RPE 8–9.5 khi tập thường). Cảm giác "quá dễ" là bình thường và đúng. Nếu vẫn thấy nặng ở RPE 7–8 với volume deload, đó là dấu hiệu cần giảm tạ thêm hoặc cần nghỉ dài hơn.',
      'Duration: 1 tuần deload giảm volume thường đủ cho hầu hết. Sau mesocycle 4–6 tuần, 1 tuần volume deload = sufficient. Sau mesocycle dài hơn (8–12 tuần) hoặc khi overreaching nặng, 1.5–2 tuần. Trở lại volume bình thường từ từ — không nhảy thẳng lên training max ngay tuần đầu.',
      'Kết hợp với technique work: ít volume → có thêm thời gian và energy để focus vào form. Sử dụng buổi deload để slow down, ghi lại video, phát hiện và sửa technical issues sẽ mang lại lợi ích dài hạn. Nhiều người cải thiện technique đáng kể trong tuần deload vì không còn lo "cố hoàn thành số reps".',
    ],
    points: [
      { icon: '💪', label: 'Giữ tạ = giữ neural adaptations', note: 'Cường độ duy trì strength gains — không giảm tạ, chỉ giảm sets và reps' },
      { icon: '📐', label: 'Giảm 40–60% tổng tonnage', note: '4×10 → 2×6 — cùng load, bằng ~30% volume. Cảm giác "quá dễ" là đúng' },
      { icon: '🏋️', label: 'Bỏ accessory, giữ compound', note: 'Compound movements duy trì motor pattern hiệu quả nhất với ít sets nhất' },
      { icon: '🎥', label: 'Dùng deload để sửa technique', note: 'Ít fatigue + ít sets = cơ hội ghi video và focus form — đầu tư dài hạn' },
    ],
  },
  {
    id: 'intensity', icon: '🎯', color: '#06b6d4', rgb: '6,182,212',
    title: 'Giảm Intensity',
    desc: 'Giữ nguyên volume, giảm tạ xuống 50–60% 1RM.',
    best: 'Người tập hypertrophy, bodybuilder',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm intensity (tạ nhẹ hơn) phù hợp nhất cho hypertrophy training, nơi volume cao là driver chính của muscle growth. Giảm tạ xuống 50–60% 1RM trong khi giữ số set và rep cho phép hệ thần kinh và gân nghỉ ngơi (không còn phải chịu peak load) trong khi cơ bắp vẫn được kích thích đủ để duy trì gains.',
    detail: 'Nguyên tắc: giữ nguyên 4 sets × 10–12 reps, nhưng giảm tạ từ 80% 1RM xuống còn 50–60% 1RM. Volume (sets × reps) không đổi nhưng mechanical load giảm đáng kể. Phù hợp cho bodybuilder và hypertrophy trainees vì volume là stimulus chính, không phải load tuyệt đối.',
    details: [
      'Tại sao bodybuilder benefit nhiều hơn: trong hypertrophy training, muscle tension over time và metabolic stress quan trọng hơn peak force. Tạ 50–60% vẫn tạo đủ mechanical tension ở sets cao (10–15 reps) và metabolic stress (pump) để duy trì hypertrophy signal, trong khi giảm đáng kể joint và tendon stress.',
      '50–60% 1RM là vùng đặc biệt: ở 50–60% 1RM với sets 10–15 reps, cơ bắp vẫn phải recruit type II fibers ở cuối sets (muscle fiber recruitment theo nguyên tắc Henneman\'s size principle — fiber lớn được recruit sau khi fiber nhỏ đã mệt). Đủ stimulus nhưng không overload CNS.',
      'Pump và blood flow: tạ nhẹ + reps cao = tăng blood flow và pump tốt hơn so với tạ nặng ít reps. Pump (cell swelling) là tín hiệu anabolic thực sự — tăng protein synthesis ngắn hạn và mTOR activation. Deload giảm intensity với reps cao không hoàn toàn mất hypertrophy stimulus.',
      'Technique refinement ở tốc độ chậm: tạ nhẹ + reps kiểm soát chậm (tempo 3–1–3: 3s xuống, 1s pause, 3s lên) = time under tension cao mà không có joint stress. Đây là cơ hội tốt để groove movement patterns sâu hơn, đặc biệt cho những bài có kỹ thuật phức tạp.',
      'Khi nào KHÔNG nên giảm intensity: powerlifter và strength athletes cần duy trì neural pattern ở tạ nặng — giảm tạ nhiều sẽ mất specificity. Với họ, giảm volume tốt hơn. Giảm intensity phù hợp nhất khi primary goal là muscle size, không phải max strength.',
      'Returning từ intensity deload: sau 1 tuần deload intensity, không tăng tạ đột ngột về training max. Tuần 1 trở lại: 70–75% 1RM. Tuần 2: 80–85%. Tuần 3: trở lại bình thường. Gân và connective tissue cần "ramp up" gradual hơn cơ bắp sau thời gian tạ nhẹ.',
    ],
    points: [
      { icon: '📊', label: 'Volume không đổi, load giảm 40–50%', note: 'Sets × reps như cũ — tạ từ 80% → 50–60% 1RM. Neural và gân được nghỉ' },
      { icon: '🩸', label: 'Pump duy trì hypertrophy signal', note: 'Cell swelling và metabolic stress vẫn xảy ra ở tạ nhẹ + reps cao' },
      { icon: '🐌', label: 'Tempo chậm 3–1–3', note: 'Time under tension cao không cần tạ nặng — groove technique + duy trì stimulus' },
      { icon: '🚫', label: 'Không phù hợp cho powerlifter', note: 'Strength athletes cần giữ neural pattern ở tạ nặng — dùng volume deload thay thế' },
    ],
  },
  {
    id: 'frequency', icon: '📅', color: '#10b981', rgb: '16,185,129',
    title: 'Giảm Tần Suất',
    desc: 'Giảm số buổi tập trong tuần, duy trì cường độ và volume mỗi buổi.',
    best: 'Người tập 4–6 ngày/tuần',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm tần suất là lựa chọn tốt nhất cho người tập 5–6 ngày/tuần — vì tăng số ngày nghỉ giữa các buổi cho phép recovery hoàn toàn hơn mà không cần thay đổi gì trong các buổi tập còn lại. Psychologically, giữ nguyên intensity và volume mỗi buổi giúp nhiều người không cảm thấy "mất đà" hay "tập yếu đi" trong tuần deload.',
    detail: 'Thay vì 5 buổi/tuần (push/pull/legs/upper/lower), giảm xuống 3 buổi full-body hoặc 3 buổi compound-focused. Mỗi buổi vẫn có quality cao — không giảm tạ, không giảm sets nhiều. Chỉ có ít buổi tập hơn và nhiều ngày nghỉ hơn.',
    details: [
      'Tại sao hiệu quả cho người tập nhiều ngày: người tập 5–6 ngày/tuần thường có cumulative fatigue cao hơn từ frequency — mỗi buổi thêm là thêm 1 round của CNS stress, tendon loading và systemic inflammation. Giảm từ 5 → 3 buổi giảm 40% total stress ngay cả khi mỗi buổi không thay đổi.',
      'Full-body trong deload frequency: chuyển từ split routine (ngực thứ 2, lưng thứ 4...) sang full-body 3 buổi/tuần trong tuần deload. Full-body với compound chính (squat, press, pull) × 2–3 sets mỗi bài = kích thích tất cả muscle groups nhưng không chuyên biệt hóa quá mức. Maintenance với minimum sets.',
      'Ngày nghỉ thêm = active recovery: những ngày không tập không phải ngày nằm im. Đi bộ 20–30 phút, mobility 10 phút, foam rolling — những hoạt động này tăng lưu thông máu đến muscle và connective tissue đang phục hồi mà không tạo thêm training stress.',
      'Psychological benefit của giữ nguyên intensity: nhiều người cảm thấy "yếu" khi dùng tạ nhẹ hơn (giảm intensity). Giảm frequency cho phép họ bước vào phòng tập với tạ quen thuộc — cảm giác familiar và confident được duy trì trong tuần deload, quan trọng cho tâm lý dài hạn.',
      'Thứ tự các ngày: với 3 buổi full-body, để 1–2 ngày nghỉ giữa mỗi buổi: Thứ 2 / Thứ 4 / Thứ 6. Không tập 2 ngày liên tiếp ngay cả trong deload — mục tiêu là recovery, không phải training density.',
      'Kết hợp với giảm volume nhẹ: giảm tần suất thường kết hợp với giảm nhẹ volume (bỏ 1 set phụ mỗi bài). Không nhất thiết phải strict — linh hoạt là key. Cảm thấy tốt trong buổi full-body deload? Có thể thêm 1 set. Cảm thấy mệt? Bỏ bài cuối và ra về.',
    ],
    points: [
      { icon: '📆', label: '5–6 buổi → 3 buổi full-body', note: 'Giảm 40% total frequency = giảm 40% cumulative stress mà không đổi gì trong buổi tập' },
      { icon: '💚', label: 'Tâm lý tốt hơn: tạ không đổi', note: 'Không cảm thấy "yếu đi" — tạ quen thuộc, chỉ có ít buổi hơn' },
      { icon: '🚶', label: 'Ngày nghỉ = active recovery', note: '20–30 phút đi bộ + mobility — tăng lưu thông không tạo training stress' },
      { icon: '📅', label: 'T2/T4/T6 — không liên tiếp', note: 'Ít nhất 1 ngày nghỉ giữa mỗi buổi, ngay cả trong deload' },
    ],
  },
  {
    id: 'active', icon: '🚶', color: '#a78bfa', rgb: '167,139,250',
    title: 'Active Deload',
    desc: 'Thay thế buổi tập bằng hoạt động nhẹ nhàng, vui vẻ.',
    best: 'Người tập cardio nhiều, cần phục hồi tâm lý',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active deload là phương pháp cần thiết nhất khi overtraining đã ảnh hưởng đến tâm lý — mất motivation, chán ghét phòng tập, cảm thấy "bị bắt buộc phải tập". Một tuần hoàn toàn không tập (có thể kể cả weights) nhưng vẫn vận động nhẹ nhàng qua các hoạt động yêu thích giúp "rekindle" mối quan hệ với vận động và cho CNS phục hồi hoàn toàn.',
    detail: 'Active deload không có structure cứng nhắc — không có sets, reps hay progressive overload. Chỉ có hoạt động vui vẻ: bơi, đạp xe leisurely, leo núi nhẹ, yoga, đi bộ khám phá. Mục tiêu là duy trì vận động cơ thể (không nằm yên hoàn toàn) trong khi cho tâm lý và CNS nghỉ ngơi hoàn toàn khỏi structured training.',
    details: [
      'Khi nào active deload thực sự cần thiết: (1) mất hoàn toàn motivation với tập luyện có cấu trúc, (2) cảm giác "burnout" với gym environment, (3) dopamine depletion nặng — phòng tập không còn hấp dẫn dù biết cần tập, (4) psychological overtraining (không chỉ physical). Trong những trường hợp này, standard deload với vẫn phải vào phòng tập không đủ — cần detach hoàn toàn.',
      'Zone 1–2 là cường độ phù hợp: bơi nhẹ, đạp xe không cần đến 60% max HR, yoga nhẹ nhàng, đi bộ trong thiên nhiên. Không phải: HIIT bơi, đạp xe leo đồi, yoga hot vất vả. Mục tiêu là movement for joy, không phải movement for performance. Bất kỳ hoạt động nào khiến bạn cảm thấy vui vẻ và không áp lực đều phù hợp.',
      'Thiên nhiên và phục hồi tâm lý: các hoạt động ngoài trời (đi bộ rừng, leo núi nhẹ, đạp xe đường quê) có lợi ích bổ sung qua Attention Restoration Theory. Thiên nhiên kích hoạt "soft fascination" — não được nghỉ ngơi khỏi directed attention mà công việc và structured training đều đòi hỏi. 90 phút đi bộ rừng = giảm rumination và prefrontal cortex overload đo được trên fMRI.',
      'Play element: thể thao giải trí (bóng rổ casual, tennis nhẹ, ném frisbee) có yếu tố play — tự phát, xã hội và không có áp lực. Play kích hoạt dopamine theo cách khác với structured training — reward đến từ enjoyment và social connection, không phải performance. Đây là cách tái nạp dopamine nhanh nhất khi bị depletion từ overtraining.',
      'Duration và intensity guidance: 20–45 phút mỗi activity, không quá 60 phút. Nếu muốn làm gì đó cảm giác như "workout" — yoga nhẹ hoặc đi bộ nhanh — giữ HR dưới 120 bpm và cảm giác effort không quá 5/10. Không cần track, không cần hit target. Kết thúc khi muốn.',
      'Trở lại sau active deload: active deload thường cần 1–2 tuần (dài hơn standard deload). Sau đó trở lại với volume và intensity thấp hơn bình thường (50–60%), tăng dần trong 2–3 tuần. Không rush — burnout recovery cần thời gian. Nếu sau 2 tuần active deload vẫn không thấy muốn quay lại, đó là dấu hiệu cần xem xét lại toàn bộ training approach.',
    ],
    points: [
      { icon: '🧠', label: 'Cho tâm lý nghỉ ngơi hoàn toàn', note: 'Không vào phòng tập, không track, không target — chỉ movement for joy' },
      { icon: '🌳', label: 'Thiên nhiên recharge dopamine', note: 'Soft fascination của rừng/thiên nhiên giảm rumination và prefrontal overload' },
      { icon: '🎮', label: 'Play kích hoạt dopamine khác', note: 'Thể thao giải trí + social = dopamine từ enjoyment, không phải performance' },
      { icon: '⏳', label: '1–2 tuần, trở lại từ từ', note: 'Burnout cần thời gian dài hơn standard deload — không rush, tăng dần 2–3 tuần' },
    ],
  },
];

const FREQUENCY = [
  {
    icon: '🌱', level: 'Mới bắt đầu', tag: '< 1 năm', freq: 'Mỗi 8–10 tuần', duration: '1 tuần',
    note: 'Cơ thể vẫn đang thích nghi, ít cần deload',
    color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Người Mới — Tại Sao Ít Cần Deload Hơn',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người mới bắt đầu tập (< 1 năm) có cơ chế phục hồi thuận lợi hơn người nâng cao — cơ thể vẫn đang trong giai đoạn "novice gains", mỗi buổi tập đều trigger adaptation mạnh với stress thấp hơn. Thêm vào đó, SRA cycle (Stimulus–Recovery–Adaptation) của người mới ngắn hơn vì chưa đẩy cơ thể đến giới hạn thực sự. Deload quá sớm với người mới có thể làm gián đoạn momentum và làm chậm tiến bộ.',
    detail: 'Ở giai đoạn mới bắt đầu, mỗi bước nhỏ đều là lãnh thổ mới với cơ thể — cơ bắp, hệ thần kinh và kết nối thần kinh-cơ đều đang cải thiện nhanh chóng. Deload sau 8–10 tuần vẫn cần thiết để "lock in" những adaptation này và tránh chấn thương do technique còn đang hoàn thiện.',
    details: [
      'Novice gains và SRA cycle ngắn: người mới có thể phục hồi và adapt sau mỗi buổi tập đơn lẻ — không cần tích lũy nhiều tuần mới thấy adaptation như người nâng cao. SRA cycle của người mới thường chỉ 24–48h cho cơ bắp nhỏ, 48–72h cho nhóm cơ lớn. Điều này có nghĩa là mỗi buổi tập là một "mini supercompensation" — deload không cần thiết sớm.',
      'Neural adaptation chiếm ưu thế: 60–80% tiến bộ sức mạnh trong 3–6 tháng đầu đến từ cải thiện neural (não học cách recruit nhiều motor unit hơn, cải thiện coordination) chứ không phải từ muscle hypertrophy thực sự. Neural adaptation không gây CNS fatigue nặng bằng strength training nặng sau này — người mới "ít bị burn out hơn" về mặt thần kinh.',
      'Tại sao cần deload sau 8–10 tuần dù ít stress: dù ít cần hơn, deload vẫn có giá trị. Gân và dây chằng thích nghi chậm hơn cơ bắp ngay cả ở người mới — 8–10 tuần tập nhất quán tạo đủ cumulative tendon stress để cần 1 tuần giảm tải. Thứ hai, deload là cơ hội để consolidate technique — tập nhẹ hơn cho phép focus vào form thay vì chỉ tập trung vào load.',
      'Red flags người mới hay bỏ qua: DOMS (đau cơ khởi phát muộn) quá nặng liên tục — nếu sau 4–5 tuần vẫn DOMS nặng sau mỗi buổi, cơ thể chưa adapted đủ và deload có thể cần sớm hơn. Joint pain (đau khớp thực sự, không phải cơ đau) là tín hiệu cần deload ngay — người mới thường khó phân biệt muscle soreness và joint pain.',
      'Cấu trúc deload lý tưởng cho người mới: giảm 30–40% volume (thay vì 50% của người nâng cao) và giữ nguyên tạ. Người mới thường sợ "mất đà" nếu giảm quá nhiều — giảm nhẹ hơn nhưng vẫn deload là compromise tốt. 1 tuần deload với 60% volume thông thường là đủ để phục hồi hoàn toàn.',
      'Sau deload đầu tiên: nhiều người mới ngạc nhiên khi thấy hiệu suất tăng ngay sau tuần deload đầu tiên — đây là lần đầu họ trải nghiệm "deload effect". Sử dụng trải nghiệm này để hiểu giá trị của recovery và xây dựng thói quen deload có kế hoạch từ sớm trong hành trình tập luyện.',
    ],
    points: [
      { icon: '⚡', label: 'Phục hồi 24–72h mỗi buổi', note: 'SRA cycle ngắn — mỗi buổi tập là mini supercompensation riêng biệt' },
      { icon: '🧠', label: '60–80% gains là neural', note: 'Não học cách recruit cơ hiệu quả hơn — ít CNS fatigue hơn người nâng cao' },
      { icon: '🦴', label: 'Gân vẫn cần nghỉ sau 8–10 tuần', note: 'Gân thích nghi chậm hơn cơ ngay cả với người mới — cumulative stress tích lũy' },
      { icon: '📐', label: 'Deload = cơ hội luyện kỹ thuật', note: 'Tập nhẹ hơn → focus vào form → kỹ thuật tốt hơn → ít chấn thương' },
    ],
  },
  {
    icon: '📈', level: 'Trung cấp', tag: '1–3 năm', freq: 'Mỗi 6–8 tuần', duration: '1 tuần',
    note: 'Bắt đầu cảm nhận được dấu hiệu rõ ràng hơn',
    color: '#3b82f6', rgb: '59,130,246',
    modalTitle: 'Trung Cấp — Giai Đoạn Deload Bắt Đầu Quan Trọng',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ở giai đoạn trung cấp (1–3 năm), novice gains đã đạt đỉnh và cơ thể cần stress cao hơn để tiếp tục adapt — đồng nghĩa với recovery demand cũng cao hơn. SRA cycle dài ra (cơ bắp cần 48–96h thay vì 24–48h) và CNS fatigue bắt đầu tích lũy theo mesocycle. Đây là giai đoạn deload chuyển từ "nên có" sang "cần phải có" để duy trì progressive overload liên tục.',
    detail: 'Người trung cấp thường gặp "intermediate plateau" — cảm giác tiến bộ chậm lại hoặc dừng hẳn dù vẫn tập chăm chỉ. Một trong những nguyên nhân phổ biến nhất là thiếu deload có kế hoạch, khiến cumulative fatigue che khuất fitness gains thực sự.',
    details: [
      'SRA cycle dài hơn và mesocycle planning: người trung cấp không thể recovery và adapt sau mỗi buổi tập đơn lẻ nữa — adaptation xảy ra theo mesocycle (4–8 tuần). Mỗi mesocycle tích lũy stress, tuần deload cuối mesocycle là lúc supercompensation thực sự xảy ra. Không deload = không tận dụng được supercompensation của cả mesocycle.',
      'Fatigue accumulation và performance metrics: người trung cấp có thể đo được fatigue qua performance — nếu 5RM hoặc AMRAP reps giảm so với 2 tuần trước dù dinh dưỡng và ngủ tốt, đó là cumulative fatigue cần deload. Theo dõi training log là công cụ quan trọng nhất để timing deload chính xác.',
      'Mức độ deload phù hợp (6–8 tuần, giảm 40–50% volume): chu kỳ 6–8 tuần cân bằng giữa đủ thời gian để build fitness và đủ sớm để tránh overtraining. Giảm 40–50% volume (giữ nguyên intensity) là standard — người trung cấp đã quen với tạ nặng hơn và cần đủ stimulus để duy trì neural adaptations trong tuần deload.',
      'Intermediate plateau và deload: nếu đang gặp plateau kéo dài 3–4 tuần, xem xét deload ngay cả khi chưa đến 6 tuần. Plateau thường là dấu hiệu cumulative fatigue đã đạt điểm tới hạn — cơ thể không thể express fitness gains vì quá mệt. Sau 1 tuần deload, nhiều người trung cấp thấy weights "cảm thấy nhẹ hơn" và break through plateau.',
      'Autoregulation cho người trung cấp: không phải lúc nào cũng cứng nhắc 6–8 tuần. Nếu tuần 5 mà resting HR cao hơn baseline, motivation giảm mạnh, performance đột ngột giảm — deload sớm hơn. Autoregulation (điều chỉnh dựa trên signals của cơ thể) trở nên quan trọng hơn khi mức tập tăng lên.',
      'Nutrition và sleep trong deload trung cấp: người trung cấp thường cần protein cao hơn để hỗ trợ recovery (1.6–2.0g/kg). Trong tuần deload, giữ nguyên protein nhưng có thể giảm carb 10–15% nếu cảm thấy bloated. Sleep quality cải thiện rõ rệt trong tuần deload — sử dụng tuần này để tối ưu sleep routine.',
    ],
    points: [
      { icon: '📊', label: 'Mesocycle 6–8 tuần + 1 tuần deload', note: 'SRA cycle dài — adaptation xảy ra theo mesocycle, không phải từng buổi' },
      { icon: '📉', label: 'Performance giảm = cần deload', note: 'Theo dõi 5RM/AMRAP — giảm 2 tuần liên tiếp dù ngủ/ăn tốt → deload ngay' },
      { icon: '🔓', label: 'Deload phá plateau trung cấp', note: 'Plateau thường là cumulative fatigue che gains — deload để express fitness thực sự' },
      { icon: '🎯', label: 'Autoregulate theo signals cơ thể', note: 'Không cứng nhắc 6–8 tuần — RHR cao + motivation giảm = deload sớm hơn' },
    ],
  },
  {
    icon: '🏋️', level: 'Nâng cao', tag: '3–5 năm', freq: 'Mỗi 4–6 tuần', duration: '1–2 tuần',
    note: 'Mỗi mesocycle nên kết thúc bằng deload',
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Nâng Cao — Mỗi Mesocycle Kết Thúc Bằng Deload',
    img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người tập nâng cao (3–5 năm) đang hoạt động gần giới hạn của potential — mỗi % tăng sức mạnh hay cơ bắp đòi hỏi stress cực kỳ lớn và recovery tương xứng. Mesocycle 4–6 tuần với deload bắt buộc cuối mỗi mesocycle không còn là tùy chọn — đây là cấu trúc training duy nhất cho phép người nâng cao tiếp tục tiến bộ bền vững mà không rơi vào OTS (Overtraining Syndrome).',
    detail: 'Ở trình độ nâng cao, cơ thể đã thích nghi với hầu hết dạng stress thông thường. Để tiếp tục progress, phải liên tục tăng volume, intensity hoặc frequency — tất cả đều đòi hỏi recovery cao hơn. Periodization (lên kế hoạch training theo chu kỳ) trở thành kỹ năng quan trọng nhất.',
    details: [
      'Periodization bắt buộc: người nâng cao không thể "wing it" — training cần được lên kế hoạch theo macrocycle (năm), mesocycle (4–8 tuần) và microcycle (tuần). Deload là ranh giới tự nhiên giữa các mesocycle. Các model phổ biến: Block Periodization (accumulation → intensification → realization + deload), DUP (Daily Undulating Periodization với deload tuần 5), và 5/3/1 với deload tuần 4.',
      'Volume landmarks và MRV: người nâng cao cần hiểu Maximum Recoverable Volume (MRV) của từng nhóm cơ — lượng volume tối đa cơ thể có thể recover từ trong 1 tuần. Mỗi mesocycle nên bắt đầu từ MEV (Minimum Effective Volume) và tăng dần đến gần MRV trước khi deload. Tập vượt MRV = diminishing returns và accumulated fatigue không sustainable.',
      'Giảm volume 50% + giữ nguyên intensity: người nâng cao cần giữ tạ nặng trong deload vì neural adaptations (strength = neural skill) decay nhanh hơn hypertrophy nếu không được stimulate. Giảm volume (sets × reps) 50% nhưng giữ %1RM thì đủ stimulus để duy trì neural adaptations trong khi cho phép recovery hoàn toàn.',
      'Peaking và competition prep: người nâng cao thi đấu (powerlifting, weightlifting, CrossFit) cần "peak" trước competition — 1–2 tuần giảm volume đột ngột trước ngày thi để supercompensation xảy ra đúng ngày. Đây là ứng dụng nâng cao của deload principle. Peak quá sớm hay quá muộn đều làm mất hiệu quả.',
      'Joint và tendon accumulation sau nhiều năm: sau 3–5 năm tập cường độ cao, cumulative wear trên gân và khớp là thực tế. Người nâng cao thường cảm thấy "chronic tightness" ở vai, hông, đầu gối. Deload 1–2 tuần mỗi 4–6 tuần là cơ hội để những inflammation mãn tính nhỏ có thời gian giải quyết. Bỏ qua deload ở giai đoạn này = tăng tốc mài mòn khớp.',
      'Quản lý fatigue như asset: người nâng cao học cách quản lý fatigue như một tài nguyên — biết khi nào nên "push through" và khi nào cần pull back. Không phải mọi fatigue đều xấu; functional overreaching (cố ý đẩy past MRV ngắn hạn) theo sau bởi deload đủ dài có thể tạo supercompensation lớn hơn bình thường. Đây là kỹ thuật advanced dùng trong peaking.',
    ],
    points: [
      { icon: '📋', label: 'Deload = kết thúc mỗi mesocycle', note: 'Block / DUP / 5/3/1 — tất cả đều có deload có kế hoạch sau 4–6 tuần' },
      { icon: '📊', label: 'Tập đến MRV rồi mới deload', note: 'MEV → MRV theo mesocycle — deload reset để bắt đầu MEV cao hơn ở mesocycle tiếp' },
      { icon: '💪', label: 'Giữ intensity, giảm volume 50%', note: 'Tạ nặng duy trì neural adaptations — chỉ giảm số sets, không giảm tạ' },
      { icon: '🏆', label: 'Peaking cho thi đấu', note: '1–2 tuần giảm volume đột ngột trước competition = supercompensation đúng ngày thi' },
    ],
  },
  {
    icon: '👑', level: 'Elite', tag: '> 5 năm', freq: 'Mỗi 3–4 tuần', duration: '1–2 tuần',
    note: 'Deload là phần không thể thiếu của lập kế hoạch',
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Elite — Deload Là Một Phần Của Kế Hoạch Năm',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vận động viên elite (> 5 năm tập nghiêm túc) không coi deload là "break" hay "nghỉ ngơi" — họ coi đó là một pha training có mục đích rõ ràng trong macrocycle năm. Với training volume và intensity ở mức elite, CNS fatigue tích lũy nhanh đến mức deload mỗi 3–4 tuần không phải là xa xỉ mà là tối thiểu cần thiết để duy trì khả năng thích nghi.',
    detail: 'Ở mức elite, cơ thể đang hoạt động ở 90–95% genetic potential. Mỗi tuần tập thêm ở cường độ full đều có diminishing returns cao và injury risk tăng theo hàm mũ. Quản lý training như một doanh nghiệp — mỗi quyết định đều có ROI (return on investment) và deload có ROI cao nhất trong dài hạn.',
    details: [
      'Annual periodization và macrocycle: vận động viên elite lập kế hoạch training theo năm, không theo tuần. Macrocycle thường chia thành: Preparatory period (general + specific prep), Competitive period (pre-comp + competition peak), Transition period (active recovery sau season). Deload được lên kế hoạch tại ranh giới của mỗi block — không reactive, hoàn toàn proactive.',
      'Tần suất deload 3–4 tuần — tại sao? Ở mức training elite, volume và intensity đủ cao để MRV đạt sau chỉ 3–4 tuần. Tiếp tục tập quá MRV thêm 1–2 tuần nữa không thêm adaptation — chỉ thêm fatigue và injury risk. Deload ngắn hơn nhưng thường xuyên hơn là chiến lược tối ưu.',
      'HRV monitoring và biofeedback: elite athletes hầu hết theo dõi HRV (Heart Rate Variability) hằng ngày. HRV là proxy gián tiếp của ANS (Autonomic Nervous System) balance và CNS recovery. HRV thấp hơn baseline 5–7 ngày liên tiếp = cơ thể báo hiệu cần deload ngay cả khi chưa đến 3–4 tuần. Công nghệ như Whoop, Garmin HRV4Training làm điều này tự động.',
      'Deload chủ động vs thụ động: elite athletes dùng deload "chủ động" — không chỉ giảm volume mà thay đổi hoàn toàn stimulus. Ví dụ: powerlifter deload bằng 1 tuần bơi và yoga; sprinter deload bằng 1 tuần đạp xe nhẹ. "Cross-training deload" duy trì cardiovascular conditioning và mental freshness trong khi cho hệ thống chính (sức mạnh/tốc độ) phục hồi hoàn toàn.',
      'Psychological fatigue và motivation: ở mức elite, tập luyện là nghề nghiệp — không phải sở thích. Motivation intrinsic (yêu tập luyện) có thể bị xói mòn bởi áp lực competition, expectation và monotony của training. Deload giữ cho tập luyện có cảm giác "thú vị" — tuần nhẹ nhàng, thay đổi routine, nhắc nhở bản thân tại sao bắt đầu. Psychological freshness dẫn đến physical performance tốt hơn.',
      'Long-term athlete longevity: elite athletes dài hạn nhất (vẫn thi đấu ở tuổi 35–40+) đều có một điểm chung — họ deload đều đặn và không cố gắng "train through" mọi injury hay fatigue. Mỗi injury lớn mất 6–12 tuần recovery. Deload 1 tuần mỗi 3–4 tuần = đầu tư vào career longevity. Những athlete coi deload là điểm yếu thường có career ngắn hơn đáng kể.',
    ],
    points: [
      { icon: '📅', label: 'Lập kế hoạch deload cho cả năm', note: 'Proactive, không reactive — deload nằm trong macrocycle từ đầu mùa' },
      { icon: '📡', label: 'HRV monitoring hằng ngày', note: 'Whoop/Garmin theo dõi ANS balance — HRV thấp 5–7 ngày = deload ngay' },
      { icon: '🔄', label: 'Cross-training deload', note: 'Thay toàn bộ stimulus — powerlifter bơi, sprinter đạp xe — mental freshness' },
      { icon: '⏳', label: 'Longevity = deload nhất quán', note: 'Elite dài hạn (35–40+) luôn deload — mỗi injury lớn mất 6–12 tuần' },
    ],
  },
];

const DELOAD_WEEK = [
  {
    day: 'Thứ 2', icon: '🏋️', type: 'Tập giảm volume', detail: 'Upper body: giảm 50% set, giữ tạ', intensity: 'light',
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Thứ 2 — Upper Body Giảm Volume',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngày đầu tuần deload vẫn tập với tạ quen thuộc — chỉ giảm 50% số sets. Đây là quyết định khoa học: giữ nguyên intensity (% 1RM) duy trì neural adaptations trong khi giảm volume cho phép recovery. Nhiều người sợ "mất sức" khi deload — thực tế ngược lại: neural drive được bảo toàn hoàn toàn, muscle memory không bị ảnh hưởng.',
    detail: 'Upper body deload ngày Thứ 2 giúp thiết lập tone cho cả tuần. Bắt đầu bằng bài tập quen thuộc với tạ không đổi tạo cảm giác an tâm tâm lý, trong khi volume giảm 50% tạo không gian để CNS và cơ bắp phục hồi thực sự.',
    details: [
      'Tại sao giữ nguyên tạ: sức mạnh (strength) là neural skill — não và hệ thần kinh học cách recruit motor units hiệu quả. Nếu giảm tạ xuống 50–60%, neural stimulus không đủ và motor pattern bị "mờ" sau vài buổi không tập nặng. Giữ tạ quen thuộc = duy trì neural groove trong khi cho cơ bắp nghỉ ngơi.',
      'Giảm 50% sets — không phải reps: cơ chế recovery tốt nhất là giảm total sets (volume) chứ không giảm reps hay tạ. Ví dụ: nếu thường tập 4 sets × 8 reps bench press @ 80kg, deload = 2 sets × 8 reps @ 80kg. Tổng tonnage giảm 50%, nhưng mỗi set vẫn có chất lượng cao.',
      'Bài tập upper body ưu tiên trong deload: compound movements (bench press, overhead press, row, pull-up) vẫn được thực hiện với tạ quen thuộc. Cắt bỏ các isolation exercises (curls, lateral raises, tricep pushdowns) — đây là "trim fat" không cần thiết. Mục tiêu: giữ stimulus cho movement pattern chính, loại bỏ volume phụ.',
      'Thứ tự bài tập trong buổi deload: giữ nguyên thứ tự thường lệ. Warm-up bình thường (5–10 phút). Thực hiện main compound movements với 50% sets. Kết thúc sau 30–40 phút thay vì 60–90 phút thường lệ. Không cố "thêm 1 set nữa" — discipline trong deload cũng quan trọng như discipline tập nặng.',
      'RPE trong deload: tập đến RPE 6–7/10 (có thể làm thêm 3–4 reps nếu cần), không phải RPE 9–10 như thường. Cảm giác "dễ hơn bình thường" là hoàn toàn đúng và bình thường trong deload. Nếu cảm thấy "quá dễ" — đó là dấu hiệu tốt: cơ thể đang bắt đầu recover.',
      'Dinh dưỡng Thứ 2: protein giữ nguyên (2g/kg) để hỗ trợ muscle protein synthesis. Carb có thể giảm nhẹ (10–15%) vì energy expenditure thấp hơn. Pre-workout nutrition bình thường — không cần thay đổi timing. Hydration quan trọng: uống 35ml/kg để hỗ trợ joint lubrication trong tuần giảm tải.',
    ],
    points: [
      { icon: '🧠', label: 'Giữ tạ = giữ neural adaptations', note: 'Strength là neural skill — giảm tạ làm "mờ" motor pattern, giữ tạ bảo toàn hoàn toàn' },
      { icon: '✂️', label: 'Cắt sets, không cắt tạ', note: '4 sets → 2 sets @ cùng tạ — giảm 50% tonnage, giữ 100% quality per set' },
      { icon: '🎯', label: 'Chỉ compound, bỏ isolation', note: 'Bench/Row/OHP giữ nguyên — cắt curls, lateral raises, pushdowns' },
      { icon: '⏱️', label: '30–40 phút thay vì 60–90 phút', note: 'Buổi ngắn hơn, chất lượng cao hơn — không cố thêm sets vì "còn sức"' },
    ],
  },
  {
    day: 'Thứ 3', icon: '🚶', type: 'Active recovery', detail: 'Đi bộ 30 phút + foam rolling', intensity: 'very-light',
    color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Thứ 3 — Active Recovery Tối Ưu',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active recovery (phục hồi tích cực) nhanh hơn passive rest (nằm nghỉ hoàn toàn) vì vận động nhẹ tăng lưu thông máu — đưa oxygen và nutrients đến cơ bắp đang repair, đồng thời flush lactate và metabolic waste sản phẩm tích lũy từ buổi tập hôm qua. Đi bộ 30 phút + foam rolling là combination hiệu quả nhất, chi phí thấp nhất.',
    detail: 'Ngày giữa tuần deload không phải ngày "không làm gì" — mà là ngày recovery có chủ đích. Đi bộ nhẹ giữ cardiovascular system hoạt động ở Zone 1 trong khi foam rolling giải quyết myofascial tension tích lũy từ nhiều tuần tập.',
    details: [
      'Cơ chế tăng lưu thông máu: khi đi bộ nhẹ ở Zone 1 (50–60% max HR, có thể trò chuyện bình thường), cơ tim bơm nhiều máu hơn đến peripheral muscles mà không tạo thêm training stress. Tăng lưu thông máu = tăng delivery của amino acids, glycogen và growth factors đến cơ bắp đang repair, đồng thời loại bỏ inflammation mediators nhanh hơn.',
      'Foam rolling và fascia: cơ bắp được bọc bởi fascia (màng liên kết). Sau nhiều tuần tập cường độ cao, fascia có thể trở nên "sticky" — các lớp trượt lên nhau không còn trơn tru, tạo cảm giác tight và restricted movement. Foam rolling tạo áp lực lên trigger points (điểm căng cứng) giải phóng myofascial tension và cải thiện range of motion.',
      'Thứ tự tối ưu: đi bộ 20–30 phút trước → tăng nhiệt độ cơ → foam rolling sau khi cơ đã ấm hiệu quả hơn 30–40%. Foam rolling "lạnh" (trước khi cơ ấm) kém hiệu quả hơn và có thể gây khó chịu. Lý tưởng: đi bộ → foam rolling toàn thân 10–15 phút → static stretching nhẹ nếu còn thời gian.',
      'Zone 1 — cách kiểm soát cường độ: mục tiêu là HR 95–115 bpm (tùy tuổi và fitness). Test đơn giản: nếu có thể nói chuyện bình thường và không thở dốc → đúng Zone 1. Nếu thở dốc hay không nói được câu dài → đang vào Zone 2, cần chậm lại. Ngày active recovery không phải ngày cardio — không cần push.',
      'Foam rolling protocol cho deload: 45–60 giây mỗi vùng, tập trung vào các nhóm cơ đã tập ngày Thứ 2 (lats, chest, shoulders, triceps). Thêm: thoracic spine mobilization (foam roll dọc cột sống), hip flexors, IT band nếu có tension. Áp lực vừa phải — nếu đau quá 7/10, nhấc bớt trọng lượng cơ thể bằng tay.',
      'Lợi ích tâm lý của active recovery: đi bộ ngoài trời tăng serotonin và endorphin nhẹ — giúp mood trong tuần deload khi thiếu dopamine từ intense training. Đặc biệt hiệu quả nếu đi bộ trong thiên nhiên (công viên, ven hồ) — "green exercise" có lợi ích tâm lý bổ sung qua Attention Restoration Theory.',
    ],
    points: [
      { icon: '🩸', label: 'Tăng lưu thông máu đến cơ', note: 'Zone 1 đẩy oxygen/nutrients đến cơ repair, flush lactate và metabolic waste' },
      { icon: '🔧', label: 'Foam rolling giải phóng fascia', note: 'Cơ ấm trước → foam rolling sau — hiệu quả hơn 30–40% so với foam roll lạnh' },
      { icon: '💬', label: 'Test Zone 1: vẫn nói chuyện được', note: '95–115 bpm, không thở dốc — không phải cardio workout, là recovery' },
      { icon: '🌿', label: 'Đi bộ ngoài trời tăng serotonin', note: 'Green exercise bù đắp dopamine thiếu hụt khi không tập nặng trong deload' },
    ],
  },
  {
    day: 'Thứ 4', icon: '🦵', type: 'Tập giảm volume', detail: 'Lower body: giảm 50% set, giữ tạ', intensity: 'light',
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Thứ 4 — Lower Body Giảm Volume',
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Lower body deload giữa tuần đặc biệt quan trọng vì nhóm cơ chân (quads, hamstrings, glutes, calves) có volume cơ bắp lớn nhất và đóng góp nhiều nhất vào systemic fatigue. Tập lower body với volume cao nhất trong mesocycle cũng tạo CNS fatigue nhiều nhất — deload lower body đúng cách cho CNS thời gian phục hồi mà vẫn duy trì strength patterns.',
    detail: 'Squat, deadlift, hip hinge là những bài tập đòi hỏi CNS nhiều nhất trong toàn bộ training. Giảm 50% sets ngày Thứ 4 trong khi giữ nguyên tạ là cách cân bằng hoàn hảo giữa duy trì strength patterns và cho phép systemic recovery.',
    details: [
      'Tại sao lower body tạo nhiều CNS fatigue hơn upper body: squat và deadlift activate nhiều nhóm cơ lớn đồng thời (total body recruitment), đòi hỏi CNS phải coordinate phức tạp hơn. Nghiên cứu cho thấy 5 sets deadlift nặng gây CNS fatigue tương đương 10 sets upper body isolation. Deload lower body đúng cách = recovery hệ thần kinh nhanh hơn đáng kể.',
      'Bài tập lower body trong deload: giữ nguyên main compounds (squat, Romanian deadlift hoặc leg press). Bỏ accessory (leg extension, leg curl, calf raises, lunges). Không thực hiện conventional deadlift nặng trong tuần deload — thay bằng RDL hoặc trap bar deadlift ở 60% intensity nếu muốn giữ movement pattern. Squat giữ nguyên tạ, giảm 50% sets.',
      'Joint care cho gối và hông: lower body deload là cơ hội để chú ý đến knee và hip joint. Trước buổi tập, thực hiện 5–10 phút dynamic warm-up: leg swings, hip circles, bodyweight squats. Sau buổi tập, 5 phút hip flexor stretching và calf stretching — các nhóm này thường tight nhất sau nhiều tuần squat và deadlift.',
      'Tempo chậm hơn trong deload squat: deload là cơ hội tuyệt vời để tập với tempo chậm hơn thường (3–4 giây eccentric thay vì 1–2 giây). Eccentric chậm với tạ bình thường nhưng ít sets = tăng time under tension mà không tăng volume. Lợi ích: cải thiện tendon health (gân thích nghi tốt với slow eccentric loading), reinforce good squat mechanics.',
      'Đau gối mãn tính và lower body deload: nếu có "runner\'s knee" hay patellar tendinopathy, ngày deload lower body là ngày để thực hiện "eccentric rehab protocol" — slow bodyweight leg extension hoặc decline squat bodyweight. Eccentric protocol là bằng chứng mạnh nhất cho tendinopathy management — deload week cho thời gian và điều kiện lý tưởng để làm điều này.',
      'Hệ thống năng lượng và lower body: squats và deadlift chủ yếu dùng phosphocreatine và glycolytic system. Trong tuần deload, glycogen stores được replenish hoàn toàn (không bị depleted bởi HIIT hay MetCon). Sau 1 tuần deload, glycogen ở cơ chân thường đạt mức peak — đây là một phần lý do performance tăng mạnh ngay sau deload.',
    ],
    points: [
      { icon: '🧠', label: 'Lower body = CNS fatigue cao nhất', note: '5 sets deadlift = CNS fatigue tương đương 10 sets upper body isolation' },
      { icon: '🏋️', label: 'Chỉ main compounds, bỏ accessory', note: 'Squat/RDL giữ tạ — bỏ leg extension, leg curl, lunges, calf raises' },
      { icon: '🐢', label: 'Tempo chậm hơn — 3–4s eccentric', note: 'Slow eccentric cải thiện tendon health + reinforce mechanics trong khi giảm volume' },
      { icon: '⚡', label: 'Glycogen peak sau deload', note: 'Lower body glycogen được refill hoàn toàn — 1 lý do hiệu suất tăng mạnh sau deload' },
    ],
  },
  {
    day: 'Thứ 5', icon: '🛋️', type: 'Nghỉ hoàn toàn', detail: 'Stretching nhẹ, đi dạo 20 phút', intensity: 'rest',
    color: '#6b7280', rgb: '107,114,128',
    modalTitle: 'Thứ 5 — Ngày Nghỉ Có Mục Đích',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngày nghỉ hoàn toàn giữa tuần không phải "lãng phí" — đây là ngày CNS phục hồi sâu nhất. Sau 3 ngày liên tiếp (Thứ 2 tập upper, Thứ 3 active recovery, Thứ 4 tập lower), hệ thần kinh cần một ngày không có training stimulus để reboot hoàn toàn. Stretching nhẹ và đi dạo 20 phút giữ lưu thông máu mà không tạo thêm bất kỳ stress nào.',
    detail: 'Ngày nghỉ có mục đích khác ngày "nằm một chỗ xem phim". Stretching nhẹ duy trì range of motion, đi dạo 20 phút giữ cardiovascular rhythm. Toàn bộ phục hồi diễn ra trong nghỉ ngơi — không phải trong lúc tập.',
    details: [
      'Mẫu giấc ngủ và CNS recovery: ngày nghỉ giữa tuần là ngày cơ thể tận dụng sleep tối ưu nhất cho recovery. Deep sleep (N3) tăng secretion của Growth Hormone, consolidates motor memories từ 3 ngày tập vừa rồi, và glymphatic system hoạt động mạnh nhất để clear metabolic waste. Ưu tiên ngủ 8–9h đêm Thứ 4 sang Thứ 5.',
      'Static stretching — khi nào phù hợp: static stretching (giữ tư thế 30–60 giây) làm giảm muscle tension và tăng range of motion — nhưng không phù hợp trước tập (giảm explosive power). Ngày nghỉ là thời điểm lý tưởng: cơ bắp không cần contractile force, static stretching hoàn toàn có lợi. Focus: hip flexors, hamstrings, thoracic spine, chest/shoulder anterior.',
      'Đi dạo 20 phút — không hơn không kém: 20 phút đủ để maintain blood flow nhẹ và endorphin release mà không gây bất kỳ training stress nào. Tránh leo cầu thang nhiều, tránh đi bộ nhanh hay jogging — ngay cả "nhẹ" vẫn tạo stimulus cho cơ chân đang cần nghỉ sau Thứ 4. Cường độ mục tiêu: resting HR +5–10 bpm, không hơn.',
      'Không training bù: tâm lý "bù đắp" (tập thêm vì hôm qua không tập đủ) là kẻ thù của deload hiệu quả. Ngày nghỉ là ngày nghỉ — không cơ hội, không bù. Cơ thể không phân biệt được "tập vì bù" hay "tập bình thường" — nó chỉ nhận thêm stress. Resistance to rest là dấu hiệu tâm lý cần deload, không phải dấu hiệu cần tập thêm.',
      'Dinh dưỡng ngày nghỉ: nhiều người giảm ăn ngày không tập vì "không cần năng lượng" — đây là sai lầm trong deload. Protein vẫn 2g/kg để hỗ trợ muscle repair đang diễn ra. Carb có thể giảm 15–20% nhưng không giảm quá nhiều — cơ thể vẫn cần glycogen để repair. Fat giữ nguyên. Uống đủ nước — dehydration làm chậm recovery.',
      'Mental recovery: ngày nghỉ giữa tuần là cơ hội để "decompress" tâm lý. Đọc sách, thiền, massage, tắm nước ấm — tất cả đều hỗ trợ recovery thông qua giảm cortisol và tăng parasympathetic tone (rest-and-digest). Tắm nước ấm đặc biệt hiệu quả: nhiệt độ làm giãn cơ và giảm DOMS, trong khi relaxation response giảm cortisol đo được sau 20 phút.',
    ],
    points: [
      { icon: '🧠', label: 'CNS reboot hoàn toàn', note: 'Sau 3 ngày liên tiếp, hệ thần kinh cần 1 ngày không stimulus để phục hồi sâu' },
      { icon: '🌙', label: 'Deep sleep = Growth Hormone peak', note: 'Ngủ 8–9h đêm Thứ 4→5: GH secretion cao, glymphatic flush metabolic waste' },
      { icon: '🧘', label: 'Static stretch lý tưởng ngày nghỉ', note: 'Hip flexors, hamstrings, thoracic spine — static stretch không phù hợp trước tập, hoàn hảo ngày nghỉ' },
      { icon: '🚫', label: 'Không "tập bù" — rest là rest', note: 'Resistance to rest là tâm lý cần deload, không phải cần tập thêm' },
    ],
  },
  {
    day: 'Thứ 6', icon: '💫', type: 'Full-body nhẹ', detail: 'Compound movements @ 60% 1RM, 2×8', intensity: 'light',
    color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Thứ 6 — Full-Body Nhẹ Consolidate Tuần Deload',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Buổi full-body nhẹ cuối tuần (Thứ 6) là "maintenance dose" — đủ stimulus để duy trì mọi neural adaptations đã build trong mesocycle vừa rồi, nhưng không đủ để tạo thêm fatigue. 60% 1RM × 2 sets × 8 reps cho mỗi compound movement là threshold tối thiểu để "remind" cơ thần kinh của các movement patterns quan trọng trước khi bắt đầu mesocycle mới.',
    detail: 'Full-body nhẹ Thứ 6 có vai trò kép: duy trì neural adaptations VÀ tạo pump nhẹ để tăng lưu thông máu đến tất cả nhóm cơ trước 2 ngày nghỉ cuối tuần. Cảm giác sau buổi này nên là "refreshed" chứ không phải "sore".',
    details: [
      'Tại sao 60% 1RM là threshold quan trọng: 60% 1RM là minimum effective intensity để maintain strength adaptations — dưới mức này, neural drive không đủ để "reinforce" motor patterns. Tập 60% × 2×8 đảm bảo motor unit recruitment vẫn xảy ra ở mức đủ để không mất neural adaptations, trong khi metabolic stress và mechanical tension không đủ để gây soreness đáng kể.',
      'Chọn bài tập cho full-body deload: 3–4 compound movements đại diện cho tất cả movement patterns. Ví dụ: Squat (knee-dominant lower), Romanian Deadlift (hip-dominant lower), Bench Press (horizontal push), Barbell Row (horizontal pull). 4 bài × 2 sets × 8 reps = 64 total reps. Tổng buổi tập: 30–35 phút bao gồm warm-up.',
      'Movement pattern thinking trong deload: thay vì nghĩ "tập nhóm cơ nào", nghĩ theo movement patterns. Cần cover: push (horizontal + vertical), pull (horizontal + vertical), squat, hip hinge, carry (optional). Deload full-body đảm bảo mọi movement pattern đều được "touched" trước khi break cuối tuần.',
      'Không đến failure — dừng ở 2–3 reps in reserve: RIR (Reps In Reserve) mục tiêu là 3–4 reps. Ví dụ: nếu 60% 1RM của bench là 80kg, bạn có thể làm 8 reps thoải mái và cảm thấy có thể làm thêm 3–4 reps nữa. Dừng lại. Không "test" xem có thể làm được bao nhiêu. Discipline này là phần quan trọng nhất của deload.',
      'Timing và recovery: buổi tập Thứ 6 nên kết thúc ít nhất 48h trước buổi tập đầu mesocycle mới (thường Thứ 2 tuần sau). 48h đủ để giải quyết bất kỳ soreness nhỏ nào từ buổi full-body nhẹ và để bước vào tuần mới fresh hoàn toàn. Nếu bắt đầu lại vào Chủ nhật — cân nhắc chuyển full-body deload sang Thứ 5.',
      'Pump và feel-good chemistry: buổi tập nhẹ tạo muscle pump (tăng máu vào cơ tạm thời) và release endorphin/dopamine ở mức vừa đủ. Sau 4 ngày volume thấp, buổi Thứ 6 thường cảm thấy rất tốt — cơ bắp "đầy" và responsiveness cao hơn bình thường. Đây là tín hiệu sinh lý tích cực: cơ thể đang trong giai đoạn supercompensation.',
    ],
    points: [
      { icon: '🎯', label: '60% 1RM = minimum maintenance dose', note: 'Dưới 60% neural drive không đủ — motor patterns bắt đầu "mờ" sau 5–7 ngày không tập' },
      { icon: '📋', label: '4 movement patterns × 2 sets × 8 reps', note: 'Push, pull, squat, hinge — 30–35 phút bao gồm warm-up, không hơn' },
      { icon: '✋', label: 'Dừng ở RIR 3–4, không đến failure', note: 'Discipline trong deload = quan trọng như discipline tập nặng — đừng "test" sức' },
      { icon: '⚡', label: 'Pump = dấu hiệu supercompensation', note: 'Cơ bắp "đầy" và responsiveness cao sau deload = sinh lý học tích cực' },
    ],
  },
  {
    day: 'Thứ 7', icon: '🏄', type: 'Active leisure', detail: 'Bơi, leo núi, đạp xe → vui là chính', intensity: 'very-light',
    color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Thứ 7 — Active Leisure: Vận Động Vì Niềm Vui',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active leisure khác hoàn toàn với training — không có sets, reps, progressive overload hay performance target. Chỉ có hoạt động bạn thực sự thích và cảm thấy vui khi làm. Bơi, leo núi nhẹ, đạp xe leisurely — những hoạt động này kích hoạt dopamine thông qua intrinsic motivation (niềm vui thuần túy) thay vì extrinsic (đạt mục tiêu). Đây là cách nhanh nhất để "rekindle" tình yêu với vận động sau nhiều tuần tập nghiêm túc.',
    detail: 'Thứ 7 active leisure là khoảnh khắc trong tuần để nhớ tại sao bạn bắt đầu vận động. Không phải vì body composition hay performance — mà vì cơ thể muốn di chuyển và bạn cảm thấy tốt hơn khi làm vậy.',
    details: [
      'Intrinsic vs extrinsic motivation: sau nhiều tuần training với mục tiêu cụ thể (PR, competition, body composition), motivation có thể shift hoàn toàn sang extrinsic. Active leisure cung cấp dopamine thông qua intrinsic reward — làm gì đó vì bản thân nó thú vị, không phải vì kết quả. Điều này "resets" motivation system và giải thích tại sao nhiều người trở lại gym với energy cao hơn sau tuần deload có active leisure.',
      'Lựa chọn hoạt động phù hợp: bơi (Zone 1–2, không competitive), leo núi nhẹ (trail hiking, không phải technical climbing), đạp xe đường bằng, yoga nhẹ, kayak, volleyball bãi biển casual, nhảy zumba... Bất kỳ hoạt động nào mà khi kết thúc bạn cảm thấy "vui và refreshed" thay vì "mệt và sore" đều phù hợp. HR mục tiêu: dưới 130–140 bpm suốt session.',
      'Social bonus: active leisure thường có yếu tố xã hội — đạp xe với bạn bè, leo núi theo nhóm, bơi cùng gia đình. Social connection trong hoạt động thể chất tăng oxytocin và serotonin theo cơ chế riêng biệt, củng cố mood benefits của exercise. "Exercise is medicine, but exercise with friends is better medicine."',
      'Cross-training benefits: bơi sử dụng cơ ở góc độ và range of motion khác hoàn toàn với weight training. Đạp xe cải thiện cardiovascular efficiency mà không tạo impact stress cho gối. Leo núi nhẹ strengthen stabilizer muscles bị bỏ qua trong gym. Những activities này tạo balanced fitness tổng thể — không phải thay thế training, nhưng bổ sung những gì gym không cung cấp.',
      'Ánh sáng mặt trời và vitamin D: nhiều hoạt động active leisure diễn ra ngoài trời — đặc biệt Thứ 7. Ánh sáng mặt trời trigger serotonin synthesis trực tiếp, đồng thời UVB rays kích thích tổng hợp Vitamin D (quan trọng cho muscle function, bone density và mood regulation). 20–30 phút nắng trực tiếp trên da (không kem chống nắng) là đủ để trigger Vitamin D synthesis.',
      'Kết thúc tuần deload ở mức energy cao: active leisure Thứ 7 nên kết thúc với bạn cảm thấy có năng lượng cao, mentally fresh và "ready to train again". Nếu sau tuần deload bạn không cảm thấy muốn tập lại — deload chưa đủ dài hoặc có vấn đề khác (thiếu ngủ, nutrition kém, stress cao). Thông thường, sau Thứ 7 active leisure, cảm giác "không thể chờ đợi đến Thứ 2 để tập lại" là phản ứng bình thường và lành mạnh.',
    ],
    points: [
      { icon: '😊', label: 'Vui là chỉ số thành công duy nhất', note: 'Không sets/reps/targets — kết thúc cảm thấy "vui và refreshed" = thành công' },
      { icon: '🧪', label: 'Dopamine từ intrinsic motivation', note: 'Hoạt động vì thích (không vì PR) reset motivation system sau weeks of grind' },
      { icon: '🌞', label: '20–30 phút nắng = Vitamin D', note: 'UVB trigger tổng hợp D3, serotonin tăng trực tiếp — mood benefits ngoài trời > indoor' },
      { icon: '🤝', label: 'Xã hội tăng oxytocin + serotonin', note: 'Tập cùng người khác tạo social bond — "exercise with friends is better medicine"' },
    ],
  },
  {
    day: 'CN', icon: '🌙', type: 'Nghỉ hoàn toàn', detail: 'Ngủ đủ giấc, chuẩn bị tinh thần tuần mới', intensity: 'rest',
    color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Chủ Nhật — Nghỉ Ngơi & Chuẩn Bị Tinh Thần',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chủ nhật cuối tuần deload là ngày quan trọng nhất để mental preparation cho mesocycle mới. Nghỉ hoàn toàn, ngủ đủ giấc (8–9h) và dành thời gian để review training log, set goals mới cho mesocycle tiếp theo. Mindset entering a new mesocycle sau deload quyết định phần lớn chất lượng của mesocycle đó — arrive mentally prepared và physically fresh là combination tối ưu.',
    detail: 'Chủ nhật là ngày transition — kết thúc deload week và bắt đầu chuẩn bị tâm lý cho tuần tập mới. Không phải ngày tập, không phải ngày hoàn toàn idle — mà là ngày để "nạp tinh thần" có chủ đích.',
    details: [
      'Sleep Chủ nhật và hormone reset: ngủ đủ giấc đêm Thứ 7 sang Chủ nhật là quan trọng nhất của cả tuần deload. Sau 6 ngày recovery, cơ thể sẵn sàng cho deep sleep tối ưu — GH release đạt peak, testosterone synthesis diễn ra, cortisol được normalize hoàn toàn. Mục tiêu: 8–9h không alarm (nếu có thể), dậy khi tự nhiên thức giấc. Đây là dấu hiệu cơ thể đã recovered đủ.',
      'Review training log: trước khi bắt đầu mesocycle mới, dành 20–30 phút review log của mesocycle vừa kết thúc. Những câu hỏi cần trả lời: volume nào work tốt nhất? Bài tập nào cho progress nhiều nhất? Week nào cảm thấy tốt nhất? Điều gì nên làm khác đi? Insights từ review này trực tiếp inform programming của mesocycle mới.',
      'Goal setting cho mesocycle mới: sau review, set 1–3 goals cụ thể và measurable cho mesocycle tới. Không phải "tập chăm hơn" — mà là "Squat 5kg thêm vào tuần 6", "Tăng volume bench từ 12 lên 16 sets/tuần" hay "Maintain bodyweight trong khi tăng strength". Specific, Measurable, Achievable, Relevant, Time-bound (SMART) goals.',
      'Meal prep Chủ nhật: chuẩn bị thực phẩm cho tuần mới trong ngày nghỉ. Đặc biệt quan trọng là protein sources cho tuần tập mới — mesocycle đầu tiên sau deload thường cần protein cao để hỗ trợ supercompensation. Meal prep giảm friction của tuần tập: không cần suy nghĩ về ăn gì khi đang mệt sau tập.',
      'Visualization và mental rehearsal: trước khi ngủ đêm Chủ nhật, dành 5–10 phút visualization — hình dung cụ thể buổi tập Thứ 2 tới. Warm-up như thế nào, tạ sẽ tập, form của squat hay deadlift. Mental rehearsal kích hoạt cùng neural pathways như thực sự tập — giúp bắt đầu tuần mới với confidence cao hơn.',
      'Mindset shift: sau tuần deload, cơ thể và tâm trí nên ở trạng thái "hungry to train" — muốn tập lại sau 1 tuần nhẹ. Nếu cảm thấy lo lắng về việc "đã mất gains" hay "đã yếu đi" — nhắc nhở bản thân rằng deload effect thường cho performance tăng 3–8% ngay trong tuần đầu sau deload. Trust the process.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ tự nhiên — không alarm', note: 'Dậy khi tự nhiên tỉnh = cơ thể báo hiệu đã recovered đủ để bắt đầu lại' },
      { icon: '📓', label: 'Review log 20–30 phút', note: 'Volume/bài tập nào hiệu quả? Insights này define programming cho mesocycle mới' },
      { icon: '🎯', label: '1–3 SMART goals cho mesocycle mới', note: '"Squat +5kg tuần 6" > "tập chăm hơn" — cụ thể và đo được thúc đẩy hơn' },
      { icon: '🧘', label: 'Visualization trước ngủ = confidence', note: 'Hình dung buổi Thứ 2 kích hoạt neural pathways — bắt đầu tuần với sẵn sàng cao hơn' },
    ],
  },
];

const INTENSITY_COLOR = { light: '#f97316', 'very-light': '#10b981', rest: '#6b7280' };

export default function LifestyleDeloadPage() {
  const [methodIdx, setMethodIdx] = useState(null);
  const [frequencyIdx, setFrequencyIdx] = useState(null);
  const [deloadDayIdx, setDeloadDayIdx] = useState(null);
  const [whyIdx, setWhyIdx] = useState(null);
  const [signalIdx, setSignalIdx] = useState(null);

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
        <p className="text-muted text-lg mb-6">Khi nhận thấy 3+ dấu hiệu này, đừng "cố" — hãy deload có kế hoạch. Click để xem cơ chế chi tiết.</p>
        <div className="space-y-2">
          {SIGNALS.map((s, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${s.rgb},0.05)`, border: `1px solid rgba(${s.rgb},0.2)` }}
              onClick={() => setSignalIdx(i)}>
              <span className="text-3xl shrink-0">{s.icon}</span>
              <div className="flex-1">
                <div className="text-base font-semibold text-text">{s.title}</div>
                <div className="text-sm text-muted mt-0.5">{s.desc}</div>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: s.severity === 'cao' ? `rgba(${s.rgb},0.15)` : 'rgba(107,114,128,0.15)', color: s.severity === 'cao' ? s.color : '#9ca3af' }}>
                {s.severity === 'cao' ? '⚠️ Cao' : '⚡ TB'}
              </span>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: s.color, background: `rgba(${s.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 4 Methods */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Phương Pháp Deload</h2>
        <p className="text-muted text-lg mb-6">Chọn phương pháp phù hợp với mục tiêu và lịch tập của bạn. Click để xem hướng dẫn chi tiết.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METHODS.map((m, i) => (
            <div key={m.id}
              className="rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `rgba(${m.rgb},0.2)`, background: `rgba(${m.rgb},0.05)` }}
              onClick={() => setMethodIdx(i)}>
              <div className="text-4xl mb-3">{m.icon}</div>
              <div className="font-bold text-base mb-1" style={{ color: m.color }}>{m.title.split('(')[0].trim()}</div>
              <div className="text-sm text-muted mb-3 leading-relaxed">{m.desc}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ color: m.color, background: `rgba(${m.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Frequency by level */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tần Suất Deload Theo Trình Độ</h2>
        <p className="text-muted text-lg mb-6">Càng tập lâu năm, cơ thể càng cần deload thường xuyên hơn. Click để xem hướng dẫn chi tiết.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FREQUENCY.map((f, i) => (
            <div key={i}
              className="rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `rgba(${f.rgb},0.2)`, background: `rgba(${f.rgb},0.05)` }}
              onClick={() => setFrequencyIdx(i)}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-bold text-base mb-0.5" style={{ color: f.color }}>{f.level}</div>
              <div className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60" style={{ color: f.color }}>{f.tag}</div>
              <div className="text-sm text-muted mb-1"><span className="font-semibold text-text">Chu kỳ:</span> {f.freq}</div>
              <div className="text-sm text-muted mb-3"><span className="font-semibold text-text">Thời gian:</span> {f.duration}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ color: f.color, background: `rgba(${f.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sample deload week */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẫu Tuần Deload</h2>
        <p className="text-muted text-lg mb-6">Kế hoạch 7 ngày cho người tập 4–5 buổi/tuần (Giảm Volume). Click để xem lý do khoa học.</p>
        <div className="space-y-2">
          {DELOAD_WEEK.map((d, i) => (
            <div key={i}
              className="flex items-center gap-4 rounded-xl p-3 border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
              style={{ borderColor: `rgba(${d.rgb},0.2)`, background: `rgba(${d.rgb},0.04)` }}
              onClick={() => setDeloadDayIdx(i)}>
              <div className="w-16 text-base font-bold text-center shrink-0" style={{ color: d.color }}>{d.day}</div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: INTENSITY_COLOR[d.intensity] }} />
              <div className="flex-1">
                <div className="text-lg font-medium text-text">{d.type}</div>
                <div className="text-base text-muted">{d.detail}</div>
              </div>
              <div className="text-base px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${INTENSITY_COLOR[d.intensity]}20`, color: INTENSITY_COLOR[d.intensity] }}>
                {d.intensity === 'light' ? 'Nhẹ' : d.intensity === 'very-light' ? 'Rất nhẹ' : 'Nghỉ'}
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: d.color, background: `rgba(${d.rgb},0.12)` }}>→</span>
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

      {/* ── Deload day modal — outside all RevealBlocks ── */}
      {deloadDayIdx !== null && (
        <DeloadModal
          item={DELOAD_WEEK[deloadDayIdx]}
          idx={deloadDayIdx}
          total={DELOAD_WEEK.length}
          onClose={() => setDeloadDayIdx(null)}
          onPrev={() => setDeloadDayIdx(i => Math.max(0, i - 1))}
          onNext={() => setDeloadDayIdx(i => Math.min(DELOAD_WEEK.length - 1, i + 1))}
          hasPrev={deloadDayIdx > 0}
          hasNext={deloadDayIdx < DELOAD_WEEK.length - 1}
        />
      )}

      {/* ── Frequency modal — outside all RevealBlocks ── */}
      {frequencyIdx !== null && (
        <DeloadModal
          item={FREQUENCY[frequencyIdx]}
          idx={frequencyIdx}
          total={FREQUENCY.length}
          onClose={() => setFrequencyIdx(null)}
          onPrev={() => setFrequencyIdx(i => Math.max(0, i - 1))}
          onNext={() => setFrequencyIdx(i => Math.min(FREQUENCY.length - 1, i + 1))}
          hasPrev={frequencyIdx > 0}
          hasNext={frequencyIdx < FREQUENCY.length - 1}
        />
      )}

      {/* ── Methods modal — outside all RevealBlocks ── */}
      {methodIdx !== null && (
        <DeloadModal
          item={{ ...METHODS[methodIdx], modalTitle: METHODS[methodIdx].title }}
          idx={methodIdx}
          total={METHODS.length}
          onClose={() => setMethodIdx(null)}
          onPrev={() => setMethodIdx(i => Math.max(0, i - 1))}
          onNext={() => setMethodIdx(i => Math.min(METHODS.length - 1, i + 1))}
          hasPrev={methodIdx > 0}
          hasNext={methodIdx < METHODS.length - 1}
        />
      )}

      {/* ── Signals modal — outside all RevealBlocks ── */}
      {signalIdx !== null && (
        <DeloadModal
          item={{ ...SIGNALS[signalIdx], modalTitle: SIGNALS[signalIdx].title }}
          idx={signalIdx}
          total={SIGNALS.length}
          onClose={() => setSignalIdx(null)}
          onPrev={() => setSignalIdx(i => Math.max(0, i - 1))}
          onNext={() => setSignalIdx(i => Math.min(SIGNALS.length - 1, i + 1))}
          hasPrev={signalIdx > 0}
          hasNext={signalIdx < SIGNALS.length - 1}
        />
      )}

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
