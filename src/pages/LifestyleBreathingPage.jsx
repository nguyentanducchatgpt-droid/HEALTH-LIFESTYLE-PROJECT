import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'c-breathing-orbit-kf';
const ORBIT_PROP = '--c-breath-angle';
const ORBIT_CLASS = 'c-breath-orbit-ring';

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

const TECHNIQUES = [
  {
    id: 'diaphragm',
    icon: '🫁',
    title: 'Thở Cơ Hoành',
    subtitle: 'Diaphragmatic Breathing',
    color: '#0ea5e9',
    desc: 'Kỹ thuật thở cơ bản, kích hoạt hệ phó giao cảm, giảm cortisol ngay lập tức.',
    steps: [
      'Nằm ngửa hoặc ngồi thoải mái, một tay đặt lên bụng, tay kia lên ngực.',
      'Hít vào chậm qua mũi — bụng phồng lên, ngực gần như không động.',
      'Thở ra từ từ qua miệng (hoặc mũi) — bụng xẹp xuống.',
      'Thực hành 5–10 phút, nhịp thở khoảng 6–8 lần/phút.',
    ],
    benefits: ['Giảm căng thẳng trong 3 phút', 'Cải thiện hàm lượng O₂ máu', 'Tăng HRV (Heart Rate Variability)', 'Hỗ trợ giấc ngủ sâu hơn'],
    when: 'Mỗi sáng, trước khi ngủ, khi căng thẳng',
    duration: '5–10 phút',
  },
  {
    id: 'box',
    icon: '⬜',
    title: 'Box Breathing',
    subtitle: '4-4-4-4 Square Breath',
    color: '#a855f7',
    desc: 'Kỹ thuật của Navy SEALs. Cân bằng hệ thần kinh tự chủ, tăng khả năng tập trung dưới áp lực.',
    steps: [
      'Hít vào chậm đếm 4 giây (qua mũi).',
      'Giữ hơi thở đếm 4 giây (không gắng, thoải mái).',
      'Thở ra từ từ đếm 4 giây (qua miệng hoặc mũi).',
      'Giữ trống đếm 4 giây trước khi hít vào tiếp.',
    ],
    benefits: ['Reset hệ thần kinh trong 2 phút', 'Tăng khả năng chịu đựng áp lực', 'Cải thiện tập trung và ra quyết định', 'Giảm lo âu nhanh chóng'],
    when: 'Trước bài tập, cuộc họp quan trọng, khi lo lắng',
    duration: '4–8 vòng (2–4 phút)',
  },
  {
    id: 'exhale',
    icon: '🌊',
    title: 'Extended Exhale',
    subtitle: '4-8 Breathing',
    color: '#10b981',
    desc: 'Kéo dài thở ra gấp đôi hít vào. Kích hoạt trực tiếp dây thần kinh phế vị, giảm nhịp tim nhanh.',
    steps: [
      'Hít vào qua mũi đếm 4 giây.',
      'Thở ra qua miệng đếm 8 giây (thở ra như thổi nến xa, chậm và đều).',
      'Không cần giữ hơi — liên tục hít-thở theo nhịp 4-8.',
      'Thực hành 5–10 vòng.',
    ],
    benefits: ['Giảm nhịp tim trong 60 giây', 'Hiệu quả nhất khi lo âu cấp tính', 'Dễ thực hành ở mọi nơi', 'Chuẩn bị giấc ngủ tốt hơn Box Breathing'],
    when: 'Khi lo âu đột ngột, trước khi ngủ, sau tranh luận',
    duration: '5–10 vòng (2–3 phút)',
  },
];

const SCIENCE = [
  {
    icon: '🧠', title: 'Hệ phó giao cảm',
    desc: 'Thở chậm kích hoạt vagus nerve, chuyển cơ thể từ "fight-or-flight" sang "rest-and-digest" trong 90 giây.',
    color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Hệ Phó Giao Cảm — Nút Reset Của Cơ Thể',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vagus nerve (dây thần kinh phế vị) là "đường cao tốc" kết nối não với tim, phổi và các cơ quan tiêu hóa. Đây là dây thần kinh dài nhất trong cơ thể và là con đường chính để kích hoạt hệ phó giao cảm (parasympathetic nervous system — PNS). Mỗi lần thở ra chậm, bạn đang gửi tín hiệu trực tiếp qua vagus nerve đến não: "mọi thứ an toàn, hãy thư giãn". Phản ứng này xảy ra trong 90 giây.',
    detail: 'Hệ thần kinh tự chủ gồm 2 nhánh đối lập: giao cảm (sympathetic — fight-or-flight) và phó giao cảm (parasympathetic — rest-and-digest). Hiện đại hóa khiến nhiều người sống chủ yếu trong trạng thái giao cảm — email, deadline, traffic. Thở chậm có chủ đích là phím tắt duy nhất để chuyển sang PNS trong vài giây.',
    details: [
      'Vagus nerve và baroreceptor reflex: khi bạn hít vào, áp lực trong lồng ngực tăng và tim đập nhanh hơn nhẹ. Khi thở ra, áp lực giảm và tim chậm lại — đây là sinus arrhythmia bình thường. Khi thở ra kéo dài (gấp đôi hít vào), phản ứng này được khuếch đại: baroreceptors trong động mạch chủ detect áp suất thấp → gửi tín hiệu đến nucleus tractus solitarius → kích hoạt vagus nerve → nhịp tim giảm, cơ bắp giãn, cortisol giảm.',
      'Acetylcholine và trạng thái calm: vagus nerve hoạt động qua neurotransmitter acetylcholine. Khi được kích hoạt, acetylcholine được release tại tim (giảm nhịp tim), phổi (giãn phế quản), và cơ quan tiêu hóa (tăng nhu động ruột). Đây là lý do tại sao trạng thái "rest-and-digest" bao gồm: thư giãn, tiêu hóa tốt hơn và cảm giác "an toàn" toàn thân.',
      'Polyvagal Theory và social engagement: Stephen Porges (Polyvagal Theory) chỉ ra vagus nerve có 2 đường: ventral vagal (myelinated) liên quan đến social engagement và safety, dorsal vagal (unmyelinated) liên quan đến shutdown/freeze. Thở chậm kích hoạt ventral vagal pathway — trạng thái tốt nhất cho cognitive function, creativity và social connection.',
      '90 giây là đủ để shift: nghiên cứu đo cortisol và heart rate cho thấy chỉ cần 5–6 hơi thở chậm (khoảng 90 giây ở nhịp 6 lần/phút) là đủ để đo được sự thay đổi trong ANS balance. Không cần 10–20 phút thiền — 90 giây thở có chủ đích đủ để interrupt một stress response đang leo thang.',
      'Vagal tone và sức khỏe dài hạn: "vagal tone" cao (vagus nerve hoạt động hiệu quả) liên quan đến: ít viêm hệ thống, immune function tốt hơn, tốt hơn trong emotional regulation, và thậm chí reduced risk of cardiovascular disease. Thực hành thở chậm đều đặn (không chỉ khi căng thẳng) theo thời gian tăng vagal tone nền.',
      'Biohacking vagus nerve đơn giản nhất: ngoài thở, các cách kích hoạt vagus nerve khác bao gồm: hát/ngân nga (vibration kích thích vagal branches ở cổ họng), nước lạnh vào mặt/cổ (diving reflex), và cười thật sự. Nhưng thở chậm là phương pháp duy nhất có thể thực hành bất cứ đâu, bất cứ lúc nào mà không ai biết bạn đang làm gì.',
    ],
    points: [
      { icon: '⚡', label: 'Shift PNS trong 90 giây', note: '5–6 hơi thở chậm = đủ để interrupt stress response đang leo thang' },
      { icon: '🧬', label: 'Acetylcholine = calm neurotransmitter', note: 'Vagus nerve release acetylcholine → tim chậm, cơ giãn, tiêu hóa tốt hơn' },
      { icon: '🤝', label: 'Ventral vagal = social & safe', note: 'Kích hoạt đúng pathway → creativity, connection, cognitive performance tăng' },
      { icon: '📈', label: 'Vagal tone tăng theo thời gian', note: 'Thực hành đều đặn → immune tốt hơn, ít viêm, emotional regulation cải thiện' },
    ],
  },
  {
    icon: '❤️', title: 'HRV & Sức khỏe tim',
    desc: 'Thở có nhịp 6 lần/phút tối ưu hoá HRV — chỉ số vàng về khả năng phục hồi và căng thẳng.',
    color: '#f43f5e', rgb: '244,63,94',
    modalTitle: 'HRV — Chỉ Số Vàng Về Phục Hồi Và Căng Thẳng',
    img: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&q=80&auto=format&fit=crop',
    keyFact: 'HRV (Heart Rate Variability — biến thiên nhịp tim) không phải là nhịp tim trung bình, mà là sự biến thiên về thời gian giữa các nhịp đập liên tiếp. Tim khỏe mạnh KHÔNG đập đều đặn như đồng hồ — nó đập với nhịp điệu linh hoạt theo từng hơi thở và điều kiện. HRV cao = hệ thần kinh tự chủ linh hoạt và khỏe mạnh. HRV thấp = cơ thể đang stressed hoặc overloaded.',
    detail: 'Nhịp thở 6 lần/phút (5 giây hít vào, 5 giây thở ra) là "resonance frequency" của hầu hết người trưởng thành — tần số tại đó oscillation hô hấp và oscillation tim đồng bộ hoàn toàn, tạo ra HRV peak. Đây là trạng thái "cardiac coherence" được nghiên cứu bởi HeartMath Institute.',
    details: [
      'Respiratory sinus arrhythmia (RSA): khi hít vào, nhịp tim tăng nhẹ (sympathetic activation). Khi thở ra, nhịp tim giảm nhẹ (parasympathetic activation). Biên độ của oscillation này chính là RSA — và RSA là thành phần lớn nhất của HRV. Thở chậm 6 lần/phút tối đa hóa RSA vì mỗi chu kỳ hít-thở đủ dài để tim đạt peak và valley của oscillation trước khi chu kỳ tiếp theo.',
      'Resonance frequency breathing: mỗi người có "resonance frequency" hơi khác nhau (thường 4.5–7 lần/phút). Khi thở đúng frequency này, baroreflex và RSA oscillations đồng bộ — tạo ra amplification (cộng hưởng). HRV trong trạng thái resonance cao gấp 2–6 lần HRV bình thường. HeartMath Institute gọi đây là "cardiac coherence".',
      'HRV như biomarker phục hồi: các ứng dụng như Whoop, Garmin, Apple Watch đo HRV vào ban đêm và sáng sớm để estimate recovery readiness. HRV giảm sau đêm = cơ thể vẫn đang phục hồi (stress cao, bệnh, alcohol, overtraining). HRV cao = cơ thể fresh và sẵn sàng cho training. Đây là công cụ đơn giản nhất để autoregulate training intensity.',
      'Biofeedback HRV và ứng dụng: các app như Elite HRV, HeartMath Inner Balance, hoặc Polar cho phép xem real-time HRV biofeedback khi thở. Việc thấy HRV tăng khi thở đúng cách có tác dụng reinforcement mạnh — não học cách "tìm" trạng thái coherence nhanh hơn theo thời gian. Sau 4–8 tuần thực hành, baseline HRV tăng đo được.',
      'HRV và mental health: HRV thấp mãn tính liên quan đến: depression, anxiety disorder, PTSD và burnout. Ngược lại, người có HRV cao có khả năng emotion regulation tốt hơn, cognitive flexibility cao hơn và resilience trước stress. Cải thiện HRV qua thở không chỉ tốt cho tim — mà còn là can thiệp có bằng chứng cho mental health.',
      'Thực hành: 5 phút mỗi ngày đủ để tăng HRV baseline trong 4–8 tuần nếu nhất quán. Thời điểm tốt nhất: sáng sớm sau thức dậy (khi HRV tự nhiên ở trạng thái daily reset) hoặc 10 phút trước khi ngủ. Sử dụng app có timer hoặc audio guide để giữ nhịp 6 lần/phút chính xác — não cần một vài tuần để internalize nhịp này tự nhiên.',
    ],
    points: [
      { icon: '📊', label: 'HRV cao = hệ thần kinh linh hoạt', note: 'Tim khỏe mạnh KHÔNG đập đều — biến thiên cao = adaptability tốt' },
      { icon: '🎯', label: '6 lần/phút = resonance frequency', note: 'RSA và baroreflex đồng bộ → HRV peak, cardiac coherence đo được' },
      { icon: '⌚', label: 'HRV sáng = recovery readiness', note: 'Whoop/Garmin đo HRV đêm → báo cơ thể có sẵn sàng tập nặng hôm nay không' },
      { icon: '🧠', label: 'HRV cao = mental health tốt hơn', note: 'Emotion regulation, cognitive flexibility, resilience — tất cả tương quan với HRV cao' },
    ],
  },
  {
    icon: '🧘', title: 'CO₂ & Trạng thái bình tĩnh',
    desc: 'Không phải O₂ mà CO₂ mới là tín hiệu thở. Thở quá nhanh → thiếu CO₂ → lo âu, chóng mặt.',
    color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'CO₂ — Tín Hiệu Thở Thực Sự Của Cơ Thể',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hầu hết mọi người nghĩ cơ thể thở vì cần thêm O₂ — nhưng thực ra não trigger thở chủ yếu vì cần thải CO₂. Chemoreceptors trong brainstem đo nồng độ CO₂ trong máu, không phải O₂. Khi CO₂ tăng → bạn cảm thấy "cần thở". Khi CO₂ quá thấp (do thở quá nhanh) → chemoreceptors bị confuse → mạch máu não co lại → lo âu, chóng mặt, ngón tay tê.',
    detail: 'Hyperventilation (thở nhanh) không phải thở nhiều O₂ hơn — mà là thải CO₂ quá nhiều và quá nhanh. Nghịch lý: thở nhanh khi lo âu làm CO₂ giảm, khiến cảm giác lo âu và chóng mặt tăng nặng hơn — tạo vòng lặp feedback dương tính. Thở chậm phá vỡ vòng lặp này.',
    details: [
      'Bohr effect và oxygen delivery: CO₂ không chỉ là waste product — nó đóng vai trò quan trọng trong việc O₂ được "nhả" từ hemoglobin vào tế bào (Bohr effect). CO₂ thấp → hemoglobin giữ O₂ chặt hơn → ít O₂ được deliver đến não và cơ bắp dù máu có đủ O₂. Đây là lý do hyperventilation có thể gây choáng ngay cả khi SpO₂ đo được là 99%.',
      'CO₂ tolerance và lo âu: người có CO₂ tolerance thấp sẽ cảm thấy "panic" khi CO₂ tăng nhẹ — ngay cả khi nồng độ CO₂ vẫn trong ngưỡng bình thường. Nhiều người có anxiety disorder thực chất có CO₂ hypersensitivity — não của họ "overreact" với CO₂ tăng nhẹ. Tập thở chậm tăng CO₂ tolerance theo thời gian: brainstem học cách không panic khi CO₂ tăng nhẹ.',
      'Nasal breathing và CO₂: thở mũi tự nhiên chậm hơn thở miệng và có nitric oxide (NO) được tạo ra trong xoang mũi. NO tăng khả năng hấp thu O₂ lên 10–15% và giúp giãn mạch máu. Người thở mũi thường có CO₂ tolerance cao hơn và HRV tốt hơn người thở miệng mãn tính. Đây là lý do "mouth tape" trending trong biohacking community.',
      'Cyclic sighing và CO₂ reset: một "physiological sigh" (hít vào 2 lần ngắn liên tiếp, rồi thở ra dài) là cách nhanh nhất để tái mở các alveoli (túi phổi) bị xẹp và normalize CO₂. Stanford lab (Andrew Huberman) cho thấy 1–5 phút cyclic sighing giảm stress nhanh hơn và hiệu quả hơn bất kỳ kỹ thuật thở nào khác đo bằng self-report và physiology.',
      'CO₂ tolerance test (BOLT score): thở bình thường, thở ra hết, bịt mũi và đo thời gian đến khi có urge to breathe đầu tiên (không phải đến khi không thể nhịn được). BOLT score < 10 giây = CO₂ tolerance rất thấp, thường thở miệng và lo âu cao. 20–40 giây = khỏe mạnh. > 40 giây = athletic level. Tăng BOLT score theo thời gian bằng nasal breathing và thở chậm.',
      'Practical: khi cảm thấy lo âu hoặc chóng mặt đột ngột, KHÔNG thở nhanh hơn. Thay vào đó: nhịn thở nhẹ 2–3 giây, rồi thở ra chậm, rồi hít vào chậm. Vài chu kỳ là đủ để CO₂ normalize và cảm giác panic giảm. Đây là kỹ thuật đơn giản nhất nhưng phản trực giác nhất — bản năng nói "thở nhiều hơn" nhưng khoa học nói "thở ít hơn, chậm hơn".',
    ],
    points: [
      { icon: '⚗️', label: 'Não đo CO₂, không đo O₂', note: 'Chemoreceptors brainstem trigger thở khi CO₂ tăng — thở nhanh hạ CO₂ → confuse' },
      { icon: '🔄', label: 'Bohr effect: CO₂ thấp = ít O₂ vào tế bào', note: 'Hemoglobin giữ O₂ chặt hơn khi CO₂ thấp — hyperventilation tự mâu thuẫn' },
      { icon: '👃', label: 'Nasal breathing tăng CO₂ tolerance', note: 'Mũi tạo NO, chậm hơn miệng — BOLT score tăng theo tháng thực hành' },
      { icon: '🆘', label: 'Panic attack: nhịn thở 2–3s, rồi thở chậm', note: 'Phản trực giác nhưng đúng — thở chậm hơn phá vỡ CO₂ panic loop' },
    ],
  },
  {
    icon: '💪', title: 'Hiệu suất thể thao',
    desc: 'Thở đúng tư thế (cơ hoành) trong tập luyện tăng sức bền, giảm mệt cơ phụ (cổ, vai).',
    color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Thở & Thể Thao — Tối Ưu Hiệu Suất Từ Hơi Thở',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hầu hết người tập gym không được dạy cách thở đúng trong khi tập — và đây là một trong những điểm cải thiện performance dễ nhất nhưng hay bị bỏ qua nhất. Thở cơ hoành (diaphragmatic breathing) trong tập luyện tăng intra-abdominal pressure, ổn định cột sống, giảm mệt cơ phụ và cải thiện O₂ delivery đến cơ bắp đang làm việc. Đây không chỉ là vấn đề kỹ thuật — mà là safety và performance cùng lúc.',
    detail: 'Cơ phụ thở (sternocleidomastoid ở cổ, scalenes ở vai, pectoralis minor ở ngực trên) chỉ nên được dùng khi gắng sức cao. Người thở ngực thường xuyên (không phải cơ hoành) đang sử dụng cơ phụ cho mọi hơi thở — gây mệt mỏi mãn tính ở cổ, vai và làm giảm O₂ efficiency.',
    details: [
      'IAP (Intra-Abdominal Pressure) và core stability: khi hít vào sâu bằng cơ hoành trước một rep nặng, áp lực trong khoang bụng tăng tạo "natural weight belt" — bảo vệ cột sống thắt lưng. Đây là Valsalva maneuver có kiểm soát. Powerlifters thở vào sâu, brace core (không phải hít vào và thở ra trong rep) để duy trì IAP cao suốt lift. Giải thích tại sao belt tập không phải crutch — nó nhắc cơ thể tạo IAP đúng.',
      'Breathing pattern và chấn thương vai: "upper chest breathing" gây chronic activation của scalenes và sternocleidomastoid — các cơ này kéo đầu tiến ra trước (forward head posture) và nhô vai lên. Forward head posture + shoulder elevation = rotator cuff impingement risk. Nhiều vận động viên bị chấn thương vai mãn tính thực chất có breathing dysfunction là nguyên nhân gốc rễ, không phải chỉ là vấn đề mobility.',
      'Nasal breathing trong endurance training: Buteyko method và các nghiên cứu gần đây khuyến nghị nasal-only breathing ở Zone 2 (có thể nói chuyện). Nasal breathing tạo more CO₂ tolerance, tốt hơn cho Bohr effect (O₂ delivery), và tăng nitric oxide. Vận động viên elite (đặc biệt runners và cyclists) thường có thể nasal breathe ở pace mà người bình thường phải mouth breathe.',
      'Thở trong lifting — quy tắc cơ bản: hít vào (bằng mũi, cơ hoành) trong phase eccentric (hạ tạ) hoặc trước rep nặng. Thở ra trong phase concentric (lift tạ) — đặc biệt ở điểm khó nhất của movement. KHÔNG nín thở toàn bộ trong các reps trung bình (chỉ Valsalva ngắn cho 1RM hoặc near-max). Thở đúng phase giữ IAP ổn định và tránh tăng huyết áp đột ngột.',
      'Breathing và fatigue threshold: nghiên cứu cho thấy mệt cơ hô hấp (respiratory muscle fatigue) xảy ra trước mệt cơ vận động ở nhiều người. Khi cơ thở mệt, não tự động giảm blood flow đến cơ chân/tay để ưu tiên cơ thở — đây là "metaboreflex" bảo vệ hô hấp. Cải thiện breathing mechanics qua thở cơ hoành giảm metabolic cost của mỗi hơi thở → cơ vận động được cung cấp máu lâu hơn trước khi metaboreflex kicks in.',
      'Post-workout breathing protocol: sau tập nặng, 3–5 phút thở cơ hoành chậm (6 lần/phút) giúp chuyển nhanh từ sympathetic (giao cảm tập luyện) sang parasympathetic (phục hồi). Cortisol giảm nhanh hơn, nhịp tim về baseline nhanh hơn và protein synthesis khởi động sớm hơn. Đây là "cooldown" thực sự hiệu quả hơn chỉ đi bộ 5 phút trên treadmill.',
    ],
    points: [
      { icon: '🛡️', label: 'IAP = natural weight belt', note: 'Hít sâu cơ hoành + brace trước rep nặng → áp lực bụng bảo vệ cột sống' },
      { icon: '🦷', label: 'Thở ngực → chấn thương vai mãn tính', note: 'Scalenes/SCM tight → forward head + shoulder elevation → rotator cuff impingement' },
      { icon: '🏃', label: 'Nasal Zone 2 tăng endurance', note: 'CO₂ tolerance cao + Bohr effect + NO tổng hợp → O₂ delivery hiệu quả hơn' },
      { icon: '⏬', label: '3–5 phút thở chậm sau tập', note: 'PNS activation nhanh hơn → cortisol giảm → protein synthesis sớm hơn' },
    ],
  },
];

function BreathingModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

// Box breathing animation component
function BoxBreathingTimer() {
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold1, exhale, hold2
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);
  const phaseRef = useRef('idle');
  const countRef = useRef(0);

  const PHASES = [
    { key: 'inhale', label: 'Hít vào', duration: 4, color: '#0ea5e9' },
    { key: 'hold1', label: 'Giữ', duration: 4, color: '#a855f7' },
    { key: 'exhale', label: 'Thở ra', duration: 4, color: '#10b981' },
    { key: 'hold2', label: 'Giữ trống', duration: 4, color: '#f97316' },
  ];

  const startStop = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
      setPhase('idle');
      setCount(0);
      setCycles(0);
      phaseRef.current = 'idle';
    } else {
      setRunning(true);
      setPhase('inhale');
      setCount(4);
      phaseRef.current = 'inhale';
      countRef.current = 4;
      let phaseIdx = 0;
      intervalRef.current = setInterval(() => {
        countRef.current -= 1;
        if (countRef.current <= 0) {
          phaseIdx = (phaseIdx + 1) % 4;
          if (phaseIdx === 0) setCycles(c => c + 1);
          const nextPhase = PHASES[phaseIdx];
          phaseRef.current = nextPhase.key;
          setPhase(nextPhase.key);
          countRef.current = nextPhase.duration;
          setCount(nextPhase.duration);
        } else {
          setCount(countRef.current);
        }
      }, 1000);
    }
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const currentPhase = PHASES.find(p => p.key === phase) || PHASES[0];
  const progress = phase !== 'idle' ? ((currentPhase.duration - count) / currentPhase.duration) * 100 : 0;
  const circleSize = phase === 'inhale' ? 1.15 : phase === 'hold1' ? 1.15 : phase === 'exhale' ? 0.85 : 0.85;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col items-center gap-4">
      <div className="text-lg font-bold uppercase tracking-widest text-muted">Box Breathing Timer</div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 opacity-20" style={{ borderColor: COLOR }} />
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="70" fill="none" stroke={currentPhase.color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center transition-transform duration-1000" style={{ transform: `scale(${running ? circleSize : 1})` }}>
          <div className="text-5xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-base text-muted mt-1">{running ? currentPhase.label : 'Bắt đầu'}</div>
        </div>
      </div>
      {running && <div className="text-base text-muted">Vòng {cycles + 1}</div>}
      <button onClick={startStop} className="px-6 py-2 rounded-full text-lg font-bold transition-all" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : COLOR, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

export default function LifestyleBreathingPage() {
  const [activeTech, setActiveTech] = useState('box');
  const [scienceIdx, setScienceIdx] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cBreathOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cBreathOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tech = TECHNIQUES.find(t => t.id === activeTech);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🌬️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Kỹ Thuật Thở</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C6 · Breathing</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Bạn thở 20.000 lần mỗi ngày. Đa số vô thức và không hiệu quả. Chỉ cần thay đổi cách thở 5 phút mỗi ngày, bạn có thể giảm cortisol, cải thiện giấc ngủ và tăng hiệu suất não bộ.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop" alt="Breathing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Hít thở có chủ ý · 3 kỹ thuật khoa học</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Science section */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Khoa Học Đằng Sau Hơi Thở</h2>
        <p className="text-muted text-lg mb-6">Thở là công cụ duy nhất bạn có thể điều khiển cả hệ tự chủ và ý thức. Click để xem cơ chế chi tiết.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCIENCE.map((s, i) => (
            <div key={s.title}
              className="rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `rgba(${s.rgb},0.2)`, background: `rgba(${s.rgb},0.05)` }}
              onClick={() => setScienceIdx(i)}>
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-lg font-bold mb-2" style={{ color: s.color }}>{s.title}</div>
              <div className="text-base text-muted leading-relaxed mb-3">{s.desc}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ color: s.color, background: `rgba(${s.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 3 techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Kỹ Thuật Thở Cốt Lõi</h2>
        <p className="text-muted text-lg mb-6">Mỗi kỹ thuật có mục đích khác nhau — chọn đúng thời điểm để hiệu quả tối đa.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TECHNIQUES.map(t => (
            <button key={t.id} onClick={() => setActiveTech(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium transition-all border ${activeTech === t.id ? 'text-white' : 'text-muted border-border hover:border-sky-500/30'}`} style={{ background: activeTech === t.id ? t.color : undefined, borderColor: activeTech === t.id ? t.color : undefined }}>
              <span>{t.icon}</span>{t.title}
            </button>
          ))}
        </div>

        {tech && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${tech.color}30`, background: `${tech.color}08` }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{tech.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{tech.title}</div>
                <div className="text-base font-bold uppercase tracking-widest mt-1" style={{ color: tech.color }}>{tech.subtitle}</div>
                <p className="text-lg text-muted mt-2 leading-relaxed">{tech.desc}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Cách Thực Hiện</div>
                <ol className="space-y-2">
                  {tech.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-text">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${tech.color}20`, color: tech.color }}>{i + 1}</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Lợi Ích</div>
                  <ul className="space-y-1">
                    {tech.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-lg text-text"><span style={{ color: tech.color }}>✓</span>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl p-3" style={{ background: `${tech.color}10` }}>
                  <div className="text-base text-muted mb-1">⏰ Khi nào dùng</div>
                  <div className="text-lg text-text font-medium">{tech.when}</div>
                  <div className="text-base text-muted mt-1">🕐 {tech.duration}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Interactive box breathing timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Box Breathing Timer</h2>
        <p className="text-muted text-lg mb-6">Thực hành ngay — timer sẽ hướng dẫn từng bước theo nhịp 4-4-4-4.</p>
        <div className="max-w-xs mx-auto">
          <BoxBreathingTimer />
        </div>
      </RevealBlock>

      {/* Daily plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kế Hoạch Thở Hằng Ngày</h2>
        <p className="text-muted text-lg mb-6">Tích hợp 3 kỹ thuật vào thói quen hiện tại — không cần thêm thời gian riêng.</p>
        <div className="space-y-3">
          {[
            { time: 'Sáng thức dậy', tech: 'Thở Cơ Hoành', duration: '3–5 phút', why: 'Kích hoạt hệ phó giao cảm, ra khỏi trạng thái "còn ngủ"', icon: '🌅' },
            { time: 'Trước bài tập / họp', tech: 'Box Breathing', duration: '2–4 phút', why: 'Tăng tập trung, bình ổn hệ thần kinh trước áp lực', icon: '💪' },
            { time: 'Giữa ngày (stress cao)', tech: 'Extended Exhale', duration: '2–3 phút', why: 'Reset nhanh, giảm cortisol trong vài phút', icon: '🌊' },
            { time: 'Trước khi ngủ', tech: 'Thở Cơ Hoành hoặc Extended Exhale', duration: '5–10 phút', why: 'Chuyển sang trạng thái nghỉ ngơi, cải thiện sleep onset', icon: '🌙' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-4 border border-border bg-surface hover:border-sky-500/20 transition-colors">
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-lg font-bold text-text">{item.time}</div>
                <div className="text-base text-muted mt-0.5">{item.why}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold" style={{ color: COLOR }}>{item.tech}</div>
                <div className="text-base text-muted">{item.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Science modal — outside all RevealBlocks ── */}
      {scienceIdx !== null && (
        <BreathingModal
          item={SCIENCE[scienceIdx]}
          idx={scienceIdx}
          total={SCIENCE.length}
          onClose={() => setScienceIdx(null)}
          onPrev={() => setScienceIdx(i => Math.max(0, i - 1))}
          onNext={() => setScienceIdx(i => Math.min(SCIENCE.length - 1, i + 1))}
          hasPrev={scienceIdx > 0}
          hasNext={scienceIdx < SCIENCE.length - 1}
        />
      )}

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/deload" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Deload
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/environment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Thiết Kế Môi Trường
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
