import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#06b6d4';
const RGB = '6,182,212';
const ORBIT_ID = 'c-morning-orbit-kf';

const ROUTINE_5 = [
  { step: 1, time: '1 phút', action: 'Uống 1 ly nước (200–300ml)', why: 'Bổ sung nước sau 7–9 giờ không uống' },
  { step: 2, time: '1 phút', action: 'Mở rèm hoặc ra ngoài lấy ánh nắng', why: 'Tắt melatonin, bật cortisol tự nhiên' },
  { step: 3, time: '1 phút', action: 'Đi bộ nhẹ tại chỗ 50–100 bước', why: 'Tăng nhịp tim nhẹ, bật hệ tuần hoàn' },
  { step: 4, time: '1 phút', action: 'Xoay vai × 10, xoay hông × 10', why: 'Giảm cứng khớp sau khi ngủ' },
  { step: 5, time: '1 phút', action: 'Hít thở sâu 4–6 nhịp chậm', why: 'Oxy cho não, giảm cortisol lo âu' },
];

const ROUTINE_10 = [
  { step: 1, time: '2 phút', action: 'Uống nước + mở cửa sổ/ra ngoài lấy ánh sáng tự nhiên', why: 'Hydrate + báo hiệu bắt đầu ngày' },
  { step: 2, time: '3 phút', action: 'Đi bộ nhẹ (trong nhà, ra hành lang hoặc ngoài trời)', why: 'Tăng nhiệt độ cơ thể, bật năng lượng' },
  { step: 3, time: '3 phút', action: 'Mobility nhẹ: cổ vai gáy + xoay hông + vươn người', why: 'Giảm căng cơ, cải thiện tư thế ngày mới' },
  { step: 4, time: '2 phút', action: 'Thở chậm + xác định 1 việc quan trọng nhất hôm nay', why: 'Định hướng tâm trí, giảm lo âu sáng sớm' },
];

const ROUTINE_20 = [
  { step: 1, time: '3 phút', action: 'Uống nước + ánh sáng tự nhiên + journal 1 câu', why: 'Hydrate, tín hiệu ngày mới, khởi động tư duy' },
  { step: 2, time: '5 phút', action: 'Đi bộ ngoài trời + hít thở không khí sáng', why: 'Nhiệt độ cơ thể tăng, cortisol khỏe mạnh' },
  { step: 3, time: '7 phút', action: 'Mobility + kéo giãn toàn thân (xem bài tập bên dưới)', why: 'Chuẩn bị cơ thể cho ngày dài' },
  { step: 4, time: '3 phút', action: 'Thiền nhẹ hoặc thở cơ hoành + review 3 việc chính', why: 'Tâm trí bình tĩnh, focus cao' },
  { step: 5, time: '2 phút', action: 'Bữa ăn có đạm hoặc uống nước protein', why: 'Ổn định đường huyết, năng lượng bền' },
];

const MOBILITY_5 = [
  { name: 'Chin tuck', reps: '10 lần', muscles: 'Cổ trước' },
  { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', muscles: 'Vai, cổ' },
  { name: 'Xoay hông (đứng)', reps: '10 vòng mỗi bên', muscles: 'Hông, lưng dưới' },
  { name: 'Thoracic extension', reps: '8–10 lần', muscles: 'Lưng trên' },
  { name: 'World\'s greatest stretch', reps: '5 lần mỗi bên', muscles: 'Toàn thân' },
];

const WHY_MORNING = [
  {
    icon: '🧠', title: 'Cortisol Awakening Response (CAR)',
    desc: 'Cortisol tự nhiên đạt đỉnh 30–45 phút sau thức dậy. Đây là window lý tưởng nhất trong ngày để não hoạt động sắc bén nhất.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol Awakening Response (CAR) là đợt tăng cortisol tự nhiên 50–100% trong 30–45 phút đầu sau khi thức dậy. Đây là "năng lượng mồi" sinh học mạnh nhất trong ngày — không cần cà phê, không cần supplement.',
    detail: 'CAR là cơ chế tiến hóa giúp tổ tiên chúng ta tỉnh táo ngay khi dậy để đối phó với môi trường. Ngày nay nó vẫn hoạt động — nhưng chúng ta thường phá vỡ nó bằng điện thoại, ánh sáng nhân tạo và cà phê ngay khi dậy, trước khi cortisol đạt đỉnh tự nhiên.',
    details: [
      'Cortisol tăng 50–100% trong 30–45 phút đầu sau khi dậy — đây là cơ chế sinh học tự nhiên giúp não chuyển từ trạng thái ngủ sang hoạt động nhận thức đầy đủ.',
      'CAR mạnh hay yếu phụ thuộc vào: chất lượng ngủ đêm trước, giờ ngủ nhất quán, ánh sáng buổi sáng và mức độ căng thẳng mãn tính.',
      'Uống cà phê ngay khi dậy (trước khi CAR đạt đỉnh) lãng phí cả hai: cortisol cao làm giảm hiệu quả caffeine, và caffeine cạnh tranh với receptor adenosine khi adenosine chưa đủ tích lũy.',
      'Window CAR (30–45 phút đầu) là thời điểm tốt nhất để lên kế hoạch ngày, đọc nội dung phức tạp, hoặc xử lý bất kỳ tư duy sâu nào — không phải lướt social media.',
      'Ánh sáng tự nhiên sáng sớm khuếch đại CAR: ánh nắng kích hoạt tuyến thượng thận tăng cortisol thêm qua trục HPA, giải thích tại sao ra ngoài sáng sớm cho cảm giác "tỉnh hơn" rõ rệt.',
      'Người có CAR yếu (mệt mỏi dù ngủ đủ giờ): thường có sleep debt tích lũy, căng thẳng mãn tính hoặc nhịp circadian lệch — các vấn đề cần giải quyết gốc rễ, không phải caffeine nhiều hơn.',
    ],
    points: [
      { icon: '⚡', label: 'Tăng 50–100% tự nhiên', note: 'Trong 30–45 phút đầu sau khi dậy — mạnh hơn caffeine' },
      { icon: '🚫', label: 'Không cà phê ngay khi dậy', note: 'Chờ 90–120 phút — tận dụng CAR trước khi thêm caffeine' },
      { icon: '📖', label: 'Dùng window này cho việc quan trọng', note: 'Đây là đỉnh nhận thức — không lãng phí vào scrolling' },
      { icon: '☀️', label: 'Ánh sáng khuếch đại CAR', note: 'Ra ngoài 5 phút sáng sớm → cortisol tăng thêm' },
    ],
  },
  {
    icon: '☀️', title: 'Đồng hồ sinh học reset hàng ngày',
    desc: 'Ánh nắng buổi sáng là "nút reset" mạnh nhất. Giúp melatonin tối hôm đó tiết đúng lúc hơn — bạn sẽ dễ ngủ hơn 12–16 giờ sau.',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng mặt trời sáng sớm là tín hiệu quan trọng nhất để đặt lại đồng hồ sinh học 24h (SCN). Nó quyết định thời điểm melatonin tiết tối nay — 5 phút ngoài trời lúc 6–9h ảnh hưởng trực tiếp đến chất lượng ngủ đêm 12–16 giờ sau đó.',
    detail: 'Suprachiasmatic nucleus (SCN) — "đồng hồ chủ" nằm trong não — cần ánh sáng mạnh buổi sáng để đặt lại nhịp 24h chính xác. Nếu không nhận đủ ánh sáng sáng, SCN bị lệch pha, melatonin tiết muộn hơn, và bạn sẽ khó ngủ vào giờ bạn muốn.',
    details: [
      'SCN (suprachiasmatic nucleus) là đồng hồ sinh học chủ của cơ thể — nó cần ánh sáng 10.000+ lux buổi sáng để đặt lại chính xác. Ánh đèn trong nhà (100–500 lux) không đủ.',
      'Ánh sáng buổi sáng đặt "timer" cho melatonin: sau khoảng 12–16 giờ kể từ khi nhận ánh sáng mạnh, tuyến tùng bắt đầu tiết melatonin — đây là cơ chế giải thích tại sao ngủ cùng giờ mỗi đêm dễ hơn khi ra ngoài sáng sớm.',
      'Chỉ cần 5–10 phút tiếp xúc ánh sáng trực tiếp lúc 6–9h (không cần nhìn thẳng mặt trời) — đủ để kích hoạt tín hiệu đặt lại SCN cho cả ngày.',
      'Ngày흐u/mưa: ra ngoài vẫn hiệu quả hơn ngồi trong nhà — ánh sáng tán xạ ngoài trời ngày흐u (1.000–5.000 lux) vẫn mạnh hơn nhiều lần so với đèn trong nhà.',
      'Người không thể ra ngoài sáng sớm: ngồi cạnh cửa sổ có ánh nắng trực tiếp, dùng đèn light therapy (10.000 lux) 20–30 phút sau khi dậy — hai lựa chọn thay thế có bằng chứng.',
      'Tác động tích lũy: áp dụng liên tục 7–14 ngày sẽ thấy giờ buồn ngủ dịch về sớm hơn và giờ dậy tự nhiên ổn định hơn — không cần báo thức mỗi ngày.',
    ],
    points: [
      { icon: '🕐', label: '12–16h sau = ngủ ngon hơn', note: 'Ánh sáng 6–9h → melatonin tiết đúng giờ tối nay' },
      { icon: '⏱️', label: 'Chỉ 5–10 phút là đủ', note: 'Không cần nhìn mặt trời — ánh sáng tán xạ đủ hiệu quả' },
      { icon: '🌧️', label: 'Ngày흐u vẫn ra ngoài', note: '1.000–5.000 lux ngoài trời > 100–500 lux trong nhà' },
      { icon: '📅', label: 'Rõ sau 7–14 ngày', note: 'Giờ buồn ngủ dịch sớm hơn, dậy tự nhiên không cần báo thức' },
    ],
  },
  {
    icon: '💧', title: 'Cơ thể cần nước sau giấc ngủ',
    desc: 'Bạn thở và toát mồ hôi trong khi ngủ. Dậy với 200–300ml nước trước tiên giúp não hoạt động tốt hơn ngay lập tức.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 7–9 giờ không uống nước, cơ thể mất 0.5–1 lít qua hơi thở và mồ hôi khi ngủ. Mất nước nhẹ 1% đã đủ làm giảm hiệu suất nhận thức 5–10%. Uống 200–300ml nước ngay khi dậy là "hack" đơn giản nhất để não hoạt động tốt hơn trong 30 phút đầu.',
    detail: 'Não là 73% nước và tiêu thụ lượng nước không cân xứng so với trọng lượng của nó. Buổi sáng sau khi ngủ dậy, nhiều người nhầm triệu chứng dehydration nhẹ (mệt mỏi, khó tập trung, đau đầu nhẹ) với "chưa uống cà phê" — trong khi thực ra họ chỉ cần nước.',
    details: [
      'Trong 7–9 giờ ngủ, cơ thể mất khoảng 0.5–1 lít nước qua hơi thở (respiratory water loss) và mồ hôi không nhìn thấy (insensible perspiration).',
      'Mất nước 1% (700ml với người 70kg) làm giảm sự tập trung, tốc độ xử lý và trí nhớ ngắn hạn có thể đo được — bạn đạt ngưỡng này trước bữa sáng nếu không uống nước.',
      'Não là 73% nước: ngay cả dehydration nhẹ làm giảm thể tích não một phần, ảnh hưởng đến hiệu suất nhận thức trước khi bạn cảm thấy khát.',
      'Uống 200–300ml nước lạnh (10–15°C) ngay khi dậy giúp tăng cảnh giác nhanh hơn: nhiệt độ thấp kích thích thần kinh giao cảm nhẹ, tương tự "shock" nhỏ tỉnh táo.',
      'Thêm muối (một nhúm nhỏ) hoặc một lát chanh: giúp hấp thụ nước vào tế bào nhanh hơn (electrolytes) so với nước lọc thuần túy — hữu ích đặc biệt sau đêm ra nhiều mồ hôi.',
      'Nước TRƯỚC cà phê: caffeine có tác dụng lợi tiểu nhẹ — uống cà phê khi đang thiếu nước có thể tăng tác động tiêu cực. Hydrate trước để tối ưu cả hai.',
    ],
    points: [
      { icon: '🌊', label: 'Mất 0.5–1 lít khi ngủ', note: 'Qua hơi thở + mồ hôi — dù không cảm thấy khát khi dậy' },
      { icon: '🧠', label: 'Não 73% là nước', note: '-1% nước → -5–10% hiệu suất nhận thức ngay lập tức' },
      { icon: '❄️', label: '200–300ml nước lạnh', note: 'Nhiệt độ thấp kích thích tỉnh táo nhanh hơn nước ấm' },
      { icon: '🍋', label: 'Thêm muối/chanh', note: 'Electrolytes giúp hấp thụ nước vào tế bào nhanh hơn' },
    ],
  },
  {
    icon: '🏃', title: 'Vận động nhẹ bật hệ tuần hoàn',
    desc: 'Chỉ 5 phút đi bộ nhẹ tăng dopamine, norepinephrine và serotonin — 3 neurotransmitter quan trọng cho mood và focus cả ngày.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút vận động nhẹ sáng sớm tăng đồng thời dopamine (động lực), norepinephrine (tập trung) và serotonin (mood ổn định). Hiệu ứng này kéo dài 2–4 giờ — dài hơn 1 ly cà phê và không có crash sau đó.',
    detail: 'Vận động nhẹ không cần đổ mồ hôi để có tác dụng thần kinh. Chỉ cần tăng nhịp tim lên 30–40% so với nghỉ ngơi (đi bộ nhẹ, leo cầu thang, nhảy nhẹ tại chỗ) đủ để kích hoạt cascade neurotransmitter và BDNF — protein tăng trưởng não.',
    details: [
      'Dopamine: vận động sáng sớm tăng baseline dopamine — tạo cảm giác động lực, sẵn sàng hành động thay vì trì hoãn. Đây là neurotransmitter của "muốn làm" chứ không chỉ "cảm thấy vui".',
      'Norepinephrine: tăng cùng với dopamine khi vận động, cải thiện khả năng chú ý, tập trung và phản ứng nhanh — giải thích tại sao nhiều người báo cáo "đầu óc sắc bén hơn" sau khi đi bộ sáng.',
      'Serotonin: vận động + ánh sáng sáng sớm là combo kép tăng serotonin — ảnh hưởng đến mood, self-confidence và kiên nhẫn. Serotonin thấp thường gây khó chịu, dễ cáu và cảm giác "không muốn làm gì".',
      'BDNF (Brain-Derived Neurotrophic Factor): vận động kích thích sản xuất BDNF — "phân bón não" giúp tăng kết nối nơ-ron, cải thiện học tập và bảo vệ não khỏi lão hóa dài hạn.',
      'Chỉ cần 5 phút: nghiên cứu cho thấy ngay cả 5 phút đi bộ nhẹ đủ để đo được sự thay đổi neurotransmitter — không cần gym, không cần đổ mồ hôi, không cần thay đồ.',
      'Không có thang máy + ưu tiên cầu thang: leo 2–3 tầng cầu thang = 2 phút vận động nhẹ hiệu quả — tích lũy "movement snacks" nhỏ như thế này trong sáng có tác động đáng kể.',
    ],
    points: [
      { icon: '🎯', label: 'Dopamine + Norepinephrine', note: 'Động lực + tập trung — kéo dài 2–4 giờ sau vận động' },
      { icon: '😊', label: 'Serotonin tăng', note: 'Vận động + ánh sáng = combo kép cải thiện mood cả ngày' },
      { icon: '🌱', label: 'BDNF — phân bón não', note: 'Tăng kết nối nơ-ron, cải thiện học tập và bảo vệ não' },
      { icon: '⏱️', label: 'Chỉ cần 5 phút', note: 'Không cần đổ mồ hôi — đi bộ nhẹ đủ thay đổi neurotransmitter' },
    ],
  },
];

function MorningModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
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
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.title}</h2>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {WHY_MORNING.length}</span>
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

export default function LifestyleMorningPage() {
  const [mode, setMode] = useState('5');
  const [whyIdx, setWhyIdx] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-morn-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cMornSpin { to { --c-morn-angle: 360deg; } }
      .c-morn-ring {
        background: conic-gradient(from var(--c-morn-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cMornSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const routines = { '5': ROUTINE_5, '10': ROUTINE_10, '20': ROUTINE_20 };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-cyan-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🌅
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Routine Buổi Sáng</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C2 — 5 / 10 / 20 phút
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Buổi sáng không cần hoàn hảo. Chỉ cần bật cơ thể lên đúng cách. 5 phút đúng còn tốt hơn kế hoạch 1 tiếng không làm được.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-morn-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop"
              alt="Routine sáng" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Nước · Ánh sáng · Vận động nhẹ
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why morning matters */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Buổi Sáng Quan Trọng?</h2>
        <p className="text-muted text-lg mb-6">Những gì bạn làm trong 30–60 phút đầu tiên thiết lập tone cho cả ngày.</p>
        <div className="grid gap-3">
          {WHY_MORNING.map((item, i) => (
            <div key={i}
              className="flex gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.15)` }}
              onClick={() => setWhyIdx(i)}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-lg mb-1">{item.title}</div>
                <p className="text-muted text-base leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Routine plans */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Phiên Bản Routine</h2>
        <p className="text-muted text-lg mb-5">Chọn phiên bản phù hợp với ngày hôm nay. Ngày bận = 5 phút. Ngày thường = 10 phút. Ngày rảnh = 20 phút.</p>
        <div className="flex gap-2 mb-6">
          {['5', '10', '20'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-lg font-semibold transition-all"
              style={mode === m
                ? { background: `rgba(${RGB},0.15)`, color: COLOR, border: `1px solid rgba(${RGB},0.3)` }
                : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
              {m} phút
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {routines[mode].map((row, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-lg font-bold"
                style={{ background: COLOR, color: 'black' }}>{row.step}</div>
              <div className="flex-1">
                <div className="font-semibold text-text text-lg">{row.action}</div>
                <div className="text-base text-muted mt-0.5">{row.why}</div>
              </div>
              <div className="text-base font-semibold tabular-nums shrink-0" style={{ color: COLOR }}>{row.time}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Mobility */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mobility Sáng 5 Phút</h2>
        <p className="text-muted text-lg mb-6">Bài mobility nhẹ buổi sáng giảm cứng khớp, cải thiện tư thế và chuẩn bị cơ thể cho ngày làm việc.</p>
        <div className="space-y-2">
          {MOBILITY_5.map((ex, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div>
                <div className="font-semibold text-text text-lg">{ex.name}</div>
                <div className="text-base text-muted">{ex.muscles}</div>
              </div>
              <div className="text-base font-semibold tabular-nums" style={{ color: COLOR }}>{ex.reps}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Practical tips */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẹo Thực Tế</h2>
        <div className="grid gap-3">
          {[
            { tip: 'Chuẩn bị từ tối hôm trước', detail: 'Để sẵn bình nước, giày đi bộ, quần áo tập. Giảm ma sát buổi sáng = tăng khả năng thực hiện.' },
            { tip: 'Không xem điện thoại trong 15 phút đầu', detail: 'Điện thoại ngay khi thức dậy → não vào chế độ reactive ngay. Ưu tiên routine trước, điện thoại sau.' },
            { tip: 'Bắt đầu từ 1 thói quen, không phải cả list', detail: 'Tuần 1: chỉ uống nước khi thức. Tuần 2: thêm ánh sáng. Tuần 3: thêm đi bộ 2 phút.' },
            { tip: 'Ngày bận nhất vẫn có thể làm 3 phút', detail: 'Uống nước + ánh sáng + 5 hít thở = 3 phút. Đây là "minimum viable morning routine" của bạn.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <div className="font-semibold text-text text-lg mb-1" style={{ color: COLOR }}>→ {item.tip}</div>
              <p className="text-muted text-base leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/circadian" className="text-muted hover:text-cyan-400 transition-colors text-lg">← Nhịp Sinh Học</Link>
        <Link to="/pillar/c/neat" className="text-lg font-semibold" style={{ color: COLOR }}>NEAT →</Link>
      </div>

      {/* ── Why morning modal — outside all RevealBlocks ── */}
      {whyIdx !== null && (
        <MorningModal
          item={WHY_MORNING[whyIdx]}
          idx={whyIdx}
          onClose={() => setWhyIdx(null)}
          onPrev={() => setWhyIdx(i => Math.max(0, i - 1))}
          onNext={() => setWhyIdx(i => Math.min(WHY_MORNING.length - 1, i + 1))}
          hasPrev={whyIdx > 0}
          hasNext={whyIdx < WHY_MORNING.length - 1}
        />
      )}
    </div>
  );
}
