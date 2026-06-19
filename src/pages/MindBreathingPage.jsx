import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#6366f1';
const RGB = '99,102,241';
const ORBIT_ID = 'd-breathing-orbit-kf';
const ORBIT_PROP = '--d-breath-angle';
const ORBIT_CLASS = 'd-breath-orbit-ring';

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
    subtitle: 'Nền tảng — dùng hằng ngày',
    color: '#10b981',
    formula: 'Bụng phồng khi hít → bụng xẹp khi thở',
    when: 'Sau tập, trước ngủ, khi vai gáy căng',
    duration: '1–3 phút',
    steps: [
      'Nằm ngửa hoặc ngồi thoải mái',
      'Một tay đặt lên ngực, một tay đặt lên bụng',
      'Hít vào chậm qua mũi — bụng phồng lên, ngực ít di chuyển',
      'Thở ra từ từ qua miệng hoặc mũi — bụng xẹp xuống',
      'Vai không nhấc lên. Thở nhẹ, chậm, đều.',
    ],
    mistakes: ['Cố hít thật sâu gây chóng mặt', 'Gồng bụng quá mức', 'Vai nhô lên cao khi hít'],
    benefits: ['Giảm căng thẳng trong 2–3 phút', 'Cải thiện O₂ máu', 'Thư giãn cổ-vai-gáy', 'Chuẩn bị giấc ngủ tốt hơn'],
  },
  {
    id: 'box',
    icon: '⬜',
    title: 'Box Breathing',
    subtitle: '4-4-4-4 — Navy SEALs technique',
    color: COLOR,
    formula: 'Hít 4 → Giữ 4 → Thở 4 → Giữ 4',
    when: 'Trước họp, khi bực tức, mất tập trung, hồi hộp',
    duration: '4 vòng (khoảng 1–2 phút)',
    steps: [
      'Ngồi thẳng, vai thả lỏng',
      'Hít vào qua mũi — đếm 4 giây',
      'Giữ hơi thở — đếm 4 giây (thoải mái, không gắng)',
      'Thở ra từ từ — đếm 4 giây',
      'Giữ trống — đếm 4 giây trước khi hít vào tiếp',
    ],
    mistakes: ['Nín thở quá căng', 'Đếm quá nhanh', 'Cố giữ phần "giữ trống" khi khó chịu'],
    benefits: ['Reset hệ thần kinh trong 2 phút', 'Tăng khả năng chịu áp lực', 'Cải thiện tập trung', 'Giảm lo âu tức thời'],
  },
  {
    id: '478',
    icon: '🌊',
    title: 'Thở 4-7-8',
    subtitle: 'Extended exhale — chuẩn bị ngủ',
    color: '#d946ef',
    formula: 'Hít 4 → Giữ 7 → Thở 8',
    when: 'Buổi tối, trước ngủ, sau ngày căng',
    duration: '3–4 vòng',
    steps: [
      'Ngồi hoặc nằm thoải mái',
      'Hít vào qua mũi — đếm 4 giây',
      'Giữ hơi thở — đếm 7 giây',
      'Thở ra hoàn toàn qua miệng — đếm 8 giây (như thổi nến từ xa)',
      'Người mới: dùng nhịp 3-3-6 nếu khó giữ 7 giây',
    ],
    mistakes: ['Cố giữ 7 giây khi thấy chóng mặt — hãy rút ngắn', 'Thở ra quá mạnh, không chậm đều'],
    benefits: ['Kích hoạt hệ phó giao cảm nhanh nhất', 'Giảm nhịp tim trong 60 giây', 'Hiệu quả nhất trước ngủ', 'Giảm lo âu cấp tính'],
  },
  {
    id: 'reset2',
    icon: '⚡',
    title: 'Reset 2 Phút',
    subtitle: 'Emergency tool — dùng ngay khi quá tải',
    color: '#f59e0b',
    formula: 'Dừng → Thở → Thả lỏng → Neo',
    when: 'Khi quá tải, giữa ngày, sau tranh cãi, trước phản ứng nóng vội',
    duration: '2 phút',
    steps: [
      '30 giây: Dừng lại, không cầm điện thoại, không phản ứng ngay',
      '30 giây: Thở 5 nhịp chậm qua mũi',
      '30 giây: Thả lỏng vai, hàm, bàn tay (3 vùng thường căng nhất)',
      '30 giây: Nhìn xa khỏi màn hình → tự hỏi "Việc nhỏ tiếp theo là gì?"',
    ],
    mistakes: ['Bỏ qua bước thả lỏng cơ', 'Dùng điện thoại ngay sau khi reset'],
    benefits: ['Cắt ngắt phản ứng tự động', 'Lấy lại kiểm soát trong 2 phút', 'Dùng được mọi nơi, mọi lúc', 'Ngăn leo thang cảm xúc'],
  },
];

const SITUATION_MODALS = [
  {
    icon: '🫁', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Thở Cơ Hoành — Sau Tập & Trước Ngủ',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở cơ hoành kích hoạt phó giao cảm (rest-and-digest) qua vagus nerve — giảm nhịp tim và cortisol trong 2–3 phút. Đây là kỹ thuật nền tảng vì nó sửa lỗi "thở ngực" mà hầu hết người stress đang mắc phải.',
    detail: 'Cơ hoành chịu 70–80% công thở khi cơ thể ở trạng thái bình thường. Khi stress, người ta tự động chuyển sang "thở ngực" — vai nhô, cơ hoành không dùng, O₂ vào ít hơn và CO₂ tích lũy làm lo âu tăng. Thở bụng phá vỡ vòng lặp này.',
    details: [
      'Cơ chế vagus nerve: Thở sâu bằng bụng kéo căng thụ thể trong phổi và gửi tín hiệu theo vagus nerve lên brainstem → kích hoạt PNS (phó giao cảm) → nhịp tim giảm, cortisol giảm, cơ thư giãn theo phản xạ.',
      'Tại sao vai gáy căng liên quan: "Thở ngực" buộc cơ thang (trapezius) và ức đòn chũm (sternocleidomastoid) hoạt động liên tục để kéo lồng ngực. Khi chuyển sang thở bụng, 2 nhóm cơ này được nghỉ hoàn toàn.',
      'Kiểm tra kỹ thuật bằng 2 tay: Tay trên ngực ít di chuyển, tay trên bụng phồng khi hít vào và xẹp khi thở ra. Nếu tay ngực di chuyển nhiều hơn — bạn vẫn đang thở ngực.',
      'Sau tập luyện: HRV (Heart Rate Variability) phục hồi nhanh hơn 20–30% sau 5–10 phút thở cơ hoành so với nghỉ thở bình thường. Đây là lý do các VĐV chuyên nghiệp thở có ý thức trong thời gian cool-down.',
      'Trước ngủ: 5–10 phút thở bụng sâu đủ để giảm nhịp tim 5–10 BPM và hạ nhiệt độ cơ thể — 2 chỉ số sinh lý quan trọng nhất để cơ thể "nhận lệnh" chìm vào giấc ngủ sâu.',
      'Sai lầm phổ biến nhất: Cố hít thật sâu và gồng bụng quá mức — gây chóng mặt và căng thẳng ngược. Hơi thở nên nhẹ nhàng và chậm, không cần to và sâu để có hiệu quả.',
    ],
    points: [
      { icon: '🧬', label: 'Vagus Nerve', note: 'Kích hoạt PNS — nhịp tim & cortisol giảm' },
      { icon: '💆', label: 'Vai & Gáy', note: 'Cơ thang được nghỉ khi thở bụng đúng' },
      { icon: '📊', label: 'HRV Recovery', note: 'Phục hồi sau tập nhanh hơn 20–30%' },
      { icon: '🌙', label: 'Trước Ngủ', note: 'Hạ nhịp tim 5–10 BPM trong 5 phút' },
    ],
  },
  {
    icon: '⬜', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Box Breathing — Trước Họp & Khi Bực Tức',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box Breathing được Navy SEALs sử dụng để duy trì khả năng ra quyết định và kiểm soát cảm xúc trong điều kiện stress cực độ. Cơ chế: phần "giữ hơi" giúp O₂ saturate đầy hơn; phần "thở ra" kéo dài kích hoạt phó giao cảm.',
    detail: 'Tên "box" (hình vuông) vì 4 giai đoạn bằng nhau (4-4-4-4). Điều quan trọng không phải số giây mà là nguyên lý: hít → giữ → thở → giữ tạo nhịp nhàng đủ để PFC (rational brain) lấy lại kiểm soát từ amygdala.',
    details: [
      'Tại sao 4-4-4-4: Nhịp tim con người dao động theo chu kỳ khoảng 4–6 giây. Thở theo đúng nhịp này (nhịp tim và hơi thở đồng pha) tối ưu hóa HRV và kích hoạt phó giao cảm mạnh nhất.',
      'Phần "giữ trống" sau thở ra: Đây là phần khó nhất nhưng quan trọng nhất. "Giữ trống" (không khí ra hết, chưa hít vào) kích thích baroreceptors ở ngực gửi tín hiệu "an toàn" lên não stem.',
      'Trước cuộc họp: Cortisol và adrenaline tăng trước áp lực là phản ứng tự nhiên — nhưng quá nhiều làm PFC kém hiệu quả. 4 vòng Box Breathing (≈2 phút) đủ để đưa arousal về vùng tối ưu cho performance.',
      'Khi bực tức: Tức giận kích hoạt amygdala và làm cortisol tăng đột biến. Bất kỳ hành động gì trong trạng thái này (nhắn tin, email, nói) đều có chất lượng thấp hơn. Box Breathing + chờ 10 phút là can thiệp đơn giản nhất.',
      'Mất tập trung: Khi attention bị kéo sang nhiều hướng, Box Breathing "reset" default mode network và tạo trạng thái focused attention trong 5–10 phút tiếp theo. Hiệu quả hơn uống thêm cà phê.',
      'Không cần đếm to: Đếm nhẩm hoặc dùng app timer. Sau 2–3 tuần luyện tập, cơ thể sẽ tự cảm nhận được 4 giây mà không cần đếm — kỹ thuật trở thành phản xạ khi cần.',
    ],
    points: [
      { icon: '🎖️', label: 'Navy SEALs', note: 'Dùng trong stress chiến đấu cực độ' },
      { icon: '🧠', label: 'PFC Recovery', note: 'Rational brain lấy lại quyền kiểm soát' },
      { icon: '🎯', label: '4 Vòng = 2 Phút', note: 'Đủ để reset trước họp hoặc tình huống căng' },
      { icon: '📉', label: 'Arousal Tối Ưu', note: 'Giảm cortisol về vùng peak performance' },
    ],
  },
  {
    icon: '🌊', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Thở 4-7-8 — Buổi Tối & Trước Ngủ',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ratio thở ra dài hơn hít vào (1:2 về thời gian) là cơ chế khoa học cốt lõi của 4-7-8. Dr. Andrew Weil gọi đây là "natural tranquilizer for the nervous system" — kích hoạt phó giao cảm mạnh hơn bất kỳ kỹ thuật thở nào khác.',
    detail: 'Số 4-7-8 không phải ngẫu nhiên: "giữ 7" cho phép O₂ saturate hemoglobin đầy đủ hơn trước khi thở ra; "thở ra 8" (gấp đôi hít vào) kéo dài kích hoạt cardiac vagal tone — giảm nhịp tim theo phản xạ. Người mới: dùng 3-3-6 để giữ nguyên ratio.',
    details: [
      'Nguyên lý ratio 1:2: Bất kỳ kỹ thuật nào có thở ra dài gấp đôi hít vào đều kích hoạt PNS mạnh hơn thở bình thường. 4-7-8 là cực đoan nhất — thở ra dài gấp đôi hít vào (8 vs 4), với "giữ" tạo thêm CO₂ giúp phát huy tối đa.',
      '"Giữ 7 giây" — tại sao quan trọng: Thở ra ngay sau hít vào làm CO₂ tích lũy ít hơn mức tối ưu. "Giữ 7 giây" cho CO₂ tích lũy vừa đủ → kích thích bradycardia reflex (nhịp tim chậm lại theo phản xạ).',
      'Melatonin trigger: Melatonin được tiết ra khi thân nhiệt cơ thể giảm và nhịp tim hạ dưới ngưỡng nhất định. 3–4 vòng 4-7-8 đủ để vượt ngưỡng này — tạo ra "lệnh ngủ sinh lý" chứ không phải chỉ thư giãn.',
      'Người mới gặp khó khăn: "Giữ 7 giây" quá dài gây khó chịu với người chưa quen. Dùng 3-3-6 (hít 3, giữ 3, thở 6) — giữ đúng ratio 1:1:2. Sau 2–3 tuần comfortable, tăng dần lên 4-7-8.',
      'Nên ngồi hoặc nằm: Kỹ thuật này hạ huyết áp nhanh — có thể gây chóng mặt nhẹ nếu đứng. Luôn thực hành khi đã ngồi hoặc nằm vào giường. Không dùng khi đang lái xe.',
      'Kết hợp với body scan: Sau 3–4 vòng 4-7-8, thêm "body scan" (ý thức thả lỏng từng nhóm cơ từ chân lên đầu). Kết hợp này hiệu quả hơn dùng riêng lẻ cho trường hợp khó ngủ do overthinking.',
    ],
    points: [
      { icon: '🌊', label: 'Ratio 1:2', note: 'Thở ra dài gấp đôi = kích PNS mạnh nhất' },
      { icon: '💤', label: 'Melatonin Trigger', note: 'Nhịp tim hạ → signal ngủ sinh lý' },
      { icon: '🔢', label: 'Người Mới: 3-3-6', note: 'Giữ ratio, tăng dần — không rush' },
      { icon: '⚠️', label: 'Ngồi / Nằm', note: 'Tránh đứng — có thể chóng mặt nhẹ' },
    ],
  },
  {
    icon: '⚡', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Reset 2 Phút — Quá Tải Giữa Ngày',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Reset 2 Phút" là protocol ngắt quãng phản ứng tự động (automatic response) và lấy lại kiểm soát có chủ ý. 4 bước × 30 giây đủ để cortisol bắt đầu giảm và PFC (rational brain) online lại trước khi bạn phản ứng.',
    detail: 'Khi quá tải, amygdala chiếm quyền và PFC bị cortisol làm kém hiệu quả — mọi quyết định và phản ứng trong trạng thái này đều kém chất lượng hơn bình thường. 2 phút "dừng + thở + thả lỏng + neo" đủ để đảo ngược quá trình này.',
    details: [
      '"Dừng 30 giây" — can thiệp quan trọng nhất: Phản ứng nóng vội xảy ra vì amygdala phản ứng trong 200ms — trước khi PFC kịp xử lý. "Dừng" ngay khi nhận ra quá tải tạo khoảng cách đủ để cortisol bắt đầu clearance.',
      'Sau tranh cãi: Tranh cãi tăng cortisol, adrenaline và norepinephrine cùng lúc. Phản ứng ngay sau (nhắn tin, email, quyết định) là phản ứng tệ nhất. 2 phút reset cho PFC đủ thời gian recovery trước khi bạn nói hoặc làm gì.',
      'Cortisol peak giữa ngày: Cortisol tự nhiên có đỉnh thứ hai lúc 13h–15h (sau đỉnh sáng sớm). Đây là lúc nhiều người cảm thấy "quá tải" và khó tập trung. Reset 2 Phút lúc này hiệu quả hơn cafein mà không có side effects.',
      'Bước "Thả lỏng 3 vùng" (vai, hàm, bàn tay): Stress tích trữ vật lý trong 3 nhóm cơ này nhiều nhất. Ý thức thả lỏng chúng gửi tín hiệu "bottom-up" lên não: "không có threat đang xảy ra" — đối nghịch với vòng lặp stress-tense.',
      'Bước "Neo" — câu hỏi ma thuật: "Việc nhỏ tiếp theo là gì?" đưa não từ chế độ "overwhelmed bởi big picture" sang "one concrete next action". Giảm cognitive load tức thì và khởi động lại execution mode của PFC.',
      'Tính linh hoạt: Không cần phòng yên tĩnh, không cần 20 phút. Dùng được trong nhà vệ sinh, thang máy, trước phòng họp, trong xe. Đây là "minimum viable intervention" với tác động thực sự — đặc biệt so với scroll MXH hoặc uống thêm cà phê.',
    ],
    points: [
      { icon: '🧠', label: 'PFC Recovery', note: '2 phút đủ để rational brain online lại' },
      { icon: '💆', label: '3 Vùng Thả Lỏng', note: 'Vai + hàm + tay = signal "không có threat"' },
      { icon: '⚡', label: 'Peak 13h–15h', note: 'Hiệu quả hơn cafein tại cortisol peak giữa ngày' },
      { icon: '🎯', label: 'Câu Hỏi Neo', note: '"Việc nhỏ tiếp theo?" → thoát overwhelm ngay' },
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

function BoxBreathingTimer({ color }) {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const iRef = useRef(null);
  const pIdxRef = useRef(0);
  const cntRef = useRef(0);
  const PHASES = [
    { key: 'inhale', label: 'Hít vào', dur: 4, scale: 1.2 },
    { key: 'hold1', label: 'Giữ', dur: 4, scale: 1.2 },
    { key: 'exhale', label: 'Thở ra', dur: 4, scale: 0.85 },
    { key: 'hold2', label: 'Giữ trống', dur: 4, scale: 0.85 },
  ];
  const startStop = () => {
    if (running) {
      clearInterval(iRef.current);
      setRunning(false); setPhase('idle'); setCount(0); setCycles(0); pIdxRef.current = 0;
    } else {
      setRunning(true); pIdxRef.current = 0;
      setPhase(PHASES[0].key); cntRef.current = PHASES[0].dur; setCount(PHASES[0].dur);
      iRef.current = setInterval(() => {
        cntRef.current--;
        if (cntRef.current <= 0) {
          const ni = (pIdxRef.current + 1) % 4;
          if (ni === 0) setCycles(c => c + 1);
          pIdxRef.current = ni;
          const p = PHASES[ni];
          setPhase(p.key); cntRef.current = p.dur; setCount(p.dur);
        } else setCount(cntRef.current);
      }, 1000);
    }
  };
  useEffect(() => () => clearInterval(iRef.current), []);
  const cur = PHASES.find(p => p.key === phase) || PHASES[0];
  const pct = phase !== 'idle' ? ((cur.dur - count) / cur.dur) * 100 : 0;
  return (
    <div className="rounded-2xl border border-border bg-bg p-6 flex flex-col items-center gap-4 max-w-sm mx-auto mt-4">
      <div className="text-base font-bold uppercase tracking-widest text-muted">Box Breathing Interactive Timer</div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="3" opacity="0.15" />
          <circle cx="80" cy="80" r="68" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 68}`} strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center transition-transform duration-1000" style={{ transform: running ? `scale(${cur.scale})` : 'scale(1)' }}>
          <div className="text-5xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-base text-muted mt-1">{running ? cur.label : 'Bắt đầu'}</div>
        </div>
      </div>
      {running && <div className="text-base text-muted">Vòng {cycles + 1} · Mục tiêu: 4 vòng</div>}
      <button onClick={startStop} className="px-6 py-2 rounded-full text-lg font-bold" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

export default function MindBreathingPage() {
  const [activeTech, setActiveTech] = useState('box');
  const [sitModal, setSitModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBreathOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBreathOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tech = TECHNIQUES.find(t => t.id === activeTech);
  const activeTechIdx = TECHNIQUES.findIndex(t => t.id === activeTech);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🫁</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Kỹ Thuật Thở</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D2 · Thở & Hạ Nhịp</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Thở là công cụ miễn phí, luôn sẵn sàng, không cần dụng cụ. 4 kỹ thuật cho 4 tình huống khác nhau — từ nền tảng hằng ngày đến emergency reset trong 2 phút.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop" alt="Breathing" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>4 kỹ thuật · Timer tương tác · Chọn đúng tình huống</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Quick reference */}
      <RevealBlock className="mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead><tr className="border-b border-border">{['Tình Huống', 'Kỹ Thuật'].map(h => <th key={h} className="text-left py-3 pr-4 text-base font-bold uppercase tracking-widest text-muted">{h}</th>)}</tr></thead>
            <tbody>
              {[
                ['Sau tập, trước ngủ, vai căng', 'Thở Cơ Hoành'],
                ['Trước họp, khi bực tức, mất tập trung', 'Box Breathing'],
                ['Buổi tối, trước ngủ, hạ nhịp', 'Thở 4-7-8'],
                ['Quá tải giữa ngày, sau tranh cãi', 'Reset 2 Phút'],
              ].map(([sit, tech2], i) => (
                <tr key={sit} className="group/row border-b border-border/30 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => setSitModal(i)}>
                  <td className="py-3 pr-4 text-muted text-base">{sit}</td>
                  <td className="py-3 text-base font-bold" style={{ color: SITUATION_MODALS[i].color }}>
                    {tech2}
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/row:opacity-100 transition-opacity"
                      style={{ color: SITUATION_MODALS[i].color, borderColor: `rgba(${SITUATION_MODALS[i].rgb},0.35)`, background: `rgba(${SITUATION_MODALS[i].rgb},0.08)` }}>
                      chi tiết →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* Techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Chi Tiết</h2>
        <p className="text-muted text-lg mb-6">Chọn kỹ thuật để xem hướng dẫn từng bước.</p>
        <div className="flex gap-2 flex-wrap mb-6">
          {TECHNIQUES.map(t => (
            <button key={t.id} onClick={() => setActiveTech(t.id)} className={`flex items-center gap-2 px-3 py-2 rounded-full text-base font-medium transition-all border ${activeTech === t.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: activeTech === t.id ? t.color : undefined, borderColor: activeTech === t.id ? t.color : undefined }}>
              {t.icon} {t.title}
            </button>
          ))}
        </div>
        {tech && (
          <div className="group/tech rounded-2xl border p-5 md:p-6" style={{ borderColor: `${tech.color}30`, background: `${tech.color}06` }}>
            <div className="flex items-start gap-4 mb-5">
              <span className="text-5xl">{tech.icon}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xl font-bold text-text">{tech.title}</div>
                  <button onClick={() => setSitModal(activeTechIdx)}
                    className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/tech:opacity-100 transition-opacity cursor-pointer"
                    style={{ color: tech.color, borderColor: `rgba(${SITUATION_MODALS[activeTechIdx]?.rgb},0.35)`, background: `rgba(${SITUATION_MODALS[activeTechIdx]?.rgb},0.08)` }}>
                    chi tiết →
                  </button>
                </div>
                <div className="text-base font-bold uppercase tracking-widest mt-0.5" style={{ color: tech.color }}>{tech.subtitle}</div>
                <div className="text-lg font-mono mt-2 px-3 py-1 rounded-full inline-block" style={{ background: `${tech.color}15`, color: tech.color }}>{tech.formula}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: tech.color }}>Các Bước</div>
                <ol className="space-y-2">
                  {tech.steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 text-lg text-text">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${tech.color}20`, color: tech.color }}>{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                {activeTech === 'box' && <BoxBreathingTimer color={tech.color} />}
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: tech.color }}>Lợi Ích</div>
                  <ul className="space-y-1">{tech.benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-base text-muted"><span style={{ color: tech.color }}>✓</span>{b}</li>)}</ul>
                </div>
                <div>
                  <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: tech.color }}>Lỗi Thường Gặp</div>
                  <ul className="space-y-1">{tech.mistakes.map((m, i) => <li key={i} className="flex items-start gap-2 text-base text-muted"><span className="text-red-400">✗</span>{m}</li>)}</ul>
                </div>
                <div className="rounded-xl p-3 text-base" style={{ background: `${tech.color}10` }}>
                  <span className="font-bold" style={{ color: tech.color }}>⏰ Khi nào:</span> <span className="text-muted">{tech.when}</span>
                  <br /><span className="font-bold" style={{ color: tech.color }}>🕐 Thời gian:</span> <span className="text-muted">{tech.duration}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Daily plan */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lịch Thở Hằng Ngày</h2>
        <p className="text-muted text-lg mb-6">Tích hợp vào 4 điểm trong ngày — không cần thêm thời gian riêng.</p>
        <div className="space-y-3">
          {[
            { time: '🌅 Buổi sáng', tech: 'Thở Cơ Hoành', dur: '1–2 phút', tip: 'Trước khi ra khỏi giường — kích hoạt nhẹ nhàng' },
            { time: '💼 Trước họp/tập', tech: 'Box Breathing', dur: '4 vòng', tip: 'Tăng tập trung, bình tĩnh trước áp lực' },
            { time: '⚡ Giữa ngày căng', tech: 'Reset 2 Phút', dur: '2 phút', tip: 'Cắt vòng lặp stress, chọn việc tiếp theo' },
            { time: '🌙 Trước ngủ', tech: 'Thở 4-7-8 hoặc Cơ Hoành', dur: '3–5 phút', tip: 'Chuyển cơ thể sang trạng thái nghỉ ngơi' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-indigo-500/20 transition-colors">
              <div className="text-lg w-40 shrink-0 text-text font-medium">{item.time}</div>
              <div className="flex-1">
                <div className="text-base font-bold" style={{ color: COLOR }}>{item.tech}</div>
                <div className="text-base text-muted">{item.tip}</div>
              </div>
              <div className="text-base text-muted shrink-0">{item.dur}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/stress" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Hiểu Stress
        </Link>
        <Link to="/pillar/d" className="text-lg text-muted hover:text-purple-400 transition-colors text-center">Tâm Trí An Nhiên →</Link>
        <Link to="/pillar/d/meditation" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Thiền Ngắn
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {sitModal !== null && (
        <CardModal
          item={SITUATION_MODALS[sitModal]}
          onClose={() => setSitModal(null)}
          onPrev={() => setSitModal(i => Math.max(0, i - 1))}
          onNext={() => setSitModal(i => Math.min(SITUATION_MODALS.length - 1, i + 1))}
          hasPrev={sitModal > 0}
          hasNext={sitModal < SITUATION_MODALS.length - 1}
          total={SITUATION_MODALS.length}
          idx={sitModal}
        />
      )}
    </div>
  );
}
