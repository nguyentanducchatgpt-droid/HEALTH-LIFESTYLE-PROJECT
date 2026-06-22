import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'f-lt-orbit-kf';
const ORBIT_CLASS = 'f-lt-orbit-ring';
const LS_KEY = 'healthapp_f_lifestyle';

const SLEEP_QUALITY = [
  { label: 'Rất tệ', icon: '😫', val: 1 },
  { label: 'Tệ', icon: '😞', val: 2 },
  { label: 'Tạm được', icon: '😐', val: 3 },
  { label: 'Tốt', icon: '😊', val: 4 },
  { label: 'Rất tốt', icon: '😄', val: 5 },
];

const TRACKER_FIELDS = [
  {
    key: 'sleep', icon: '😴', label: 'Số giờ ngủ đêm qua', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngủ 7–9 giờ/đêm là khoảng thời gian não cần để hoàn thành đầy đủ 4–5 chu kỳ ngủ (NREM + REM). Thiếu ngủ mãn tính (<6h) tăng nguy cơ béo phì 55%, tiểu đường type 2 50%, và suy giảm nhận thức tương đương uống 2 ly rượu — theo Matthew Walker, ĐH Berkeley.',
    details: [
      'Chu kỳ ngủ kéo dài ~90 phút gồm NREM (3 giai đoạn, deep sleep) và REM (dreaming, memory consolidation). Cần 4–5 chu kỳ đầy đủ — tương đương 6–7.5 giờ tối thiểu, 7–9 giờ tối ưu.',
      'Deep sleep (NREM stage 3): xảy ra nhiều trong nửa đêm đầu. Giai đoạn này cơ thể tiết growth hormone, phục hồi cơ xương, tăng cường miễn dịch. Đi ngủ muộn → mất deep sleep dù ngủ đủ số giờ.',
      'REM sleep: xảy ra nhiều trong nửa đêm sau (4–8h sáng). Não xử lý cảm xúc, consolidate memory, và tăng cường sáng tạo. Dậy sớm đột ngột (alarm quá sớm) cắt đứt REM — nguyên nhân "buổi sáng khó chịu" phổ biến.',
      'Thiếu ngủ tích lũy: mất 1.5h mỗi đêm trong 5 ngày = cognitive performance tương đương thức 24h liên tục. Ngủ bù cuối tuần bù được một phần nhưng không hoàn toàn — DNA damage từ thiếu ngủ không reversal hoàn toàn.',
      'Ngủ quá nhiều (>9h) cũng có liên quan đến tử vong sớm cao hơn — không phải ngủ nhiều gây hại, mà thường là triệu chứng của bệnh tiềm ẩn. Trên 9h liên tục nhiều ngày → cần kiểm tra sức khỏe.',
      'Sleep debt (nợ ngủ): mỗi giờ thiếu tích lũy vào "tài khoản nợ". Một tuần cuối tuần không đủ bù — cần chiến lược nhất quán hơn: ngủ đúng giờ 7 ngày/tuần quan trọng hơn ngủ nhiều 2 ngày.',
    ],
    points: [
      { icon: '🔬', label: '4–5 Chu Kỳ Ngủ', note: '90 phút/chu kỳ — cần đủ để phục hồi hoàn toàn' },
      { icon: '🌙', label: 'Deep Sleep = Nửa Đêm Đầu', note: 'Ngủ muộn cắt đứt giai đoạn phục hồi quan trọng nhất' },
      { icon: '🧠', label: 'REM = Nửa Đêm Sau', note: 'Dậy sớm cắt REM — ảnh hưởng trí nhớ và cảm xúc' },
      { icon: '⚠️', label: 'Thiếu Ngủ = 2 Ly Rượu', note: 'Cognitive impairment tương đương — không thể "quen" được' },
    ],
  },
  {
    key: 'sleepQ', icon: '⭐', label: 'Chất lượng giấc ngủ', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chất lượng giấc ngủ quan trọng không kém số giờ. 8 tiếng ngủ không liên tục (thức giữa đêm nhiều lần) kém hiệu quả hơn 6.5 tiếng ngủ sâu liên tục. Sleep efficiency = tỷ lệ % thời gian thực sự ngủ trên thời gian nằm trên giường — lý tưởng là >85%.',
    details: [
      'Sleep efficiency: nếu nằm giường 8h mà chỉ ngủ được 6h = 75% efficiency — cần cải thiện. Giải pháp: chỉ dùng giường để ngủ (không xem điện thoại, không làm việc trên giường), ra khỏi giường nếu không ngủ được sau 20 phút.',
      'Ngủ không sâu (light sleep nhiều, deep sleep ít): thường do nhiệt độ phòng không phù hợp (lý tưởng: 18–20°C), ánh sáng lọt vào, tiếng ồn, hoặc không uống đủ nước trước khi ngủ.',
      'Tỉnh giữa đêm nhiều lần: nguyên nhân phổ biến nhất là sleep apnea (ngưng thở khi ngủ), đi tiểu đêm (uống quá nhiều sau 18h), stress/anxiety, hoặc nhiệt độ phòng quá nóng.',
      'Đánh giá chủ quan vs khách quan: cảm giác "ngủ tốt" không luôn tương quan với actual sleep quality. Wearable (vòng đeo tay, smartwatch) cho góc nhìn khách quan hơn. Nếu luôn cảm thấy mệt dù ngủ 7–8h → đáng kiểm tra sleep apnea.',
      'Alcohol và sleep quality: rượu giúp ngủ nhanh hơn nhưng giảm REM sleep 20–30% và gây fragmented sleep sau nửa đêm. 1 ly rượu vang tối → "ngủ tốt" cảm giác nhưng quality thực tế thấp hơn.',
      'Cải thiện sleep quality không cần thuốc: nhiệt độ phòng mát (18–20°C), tối hoàn toàn (blackout curtains hoặc sleep mask), yên tĩnh (hoặc white noise), cắt screen 1h trước ngủ, tắm nước ấm 1–2h trước ngủ.',
    ],
    points: [
      { icon: '📊', label: 'Sleep Efficiency >85%', note: '8h nằm × 85% = cần thực sự ngủ ≥6.8h' },
      { icon: '🌡️', label: '18–20°C Lý Tưởng', note: 'Nhiệt độ phòng ảnh hưởng deep sleep nhiều nhất' },
      { icon: '🍷', label: 'Rượu Phá REM', note: 'Ngủ nhanh hơn nhưng quality thấp hơn — nghịch lý' },
      { icon: '📱', label: 'Cắt Screen 1h Trước Ngủ', note: 'Blue light ức chế melatonin — delay ngủ 30–45 phút' },
    ],
  },
  {
    key: 'bedtime', icon: '🌙', label: 'Giờ ngủ & Giờ dậy', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1508558936510-0af1e3cccbab?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Consistency của giờ ngủ/thức quan trọng hơn tổng số giờ. Lệch >1 giờ mỗi ngày gây "social jetlag" — đồng hồ sinh học bị lệch phase, làm giảm hiệu suất, tăng cortisol, và tăng nguy cơ rối loạn chuyển hóa. Ngủ cùng giờ 7 ngày/tuần = chronobiological foundation.',
    details: [
      'Circadian rhythm: đồng hồ sinh học 24h điều phối bởi SCN (suprachiasmatic nucleus) trong não, chủ yếu bằng ánh sáng. Ngủ/thức cùng giờ giữ rhythm ổn định → melatonin tiết đúng giờ → ngủ nhanh hơn, sâu hơn.',
      'Chronotype: không phải ai cũng nên ngủ lúc 22h. Early bird (larks) có cortisol peak sáng sớm; night owl có peak muộn hơn. Chronotype 40% do gene — nhưng phần lớn bị "xã hội" ép sai giờ. Tìm chronotype tự nhiên và consistent với nó quan trọng hơn.',
      'Social jetlag: sai lệch giữa giờ ngủ ngày thường và cuối tuần. Ngủ 23h–6h trong tuần và 2h–10h cuối tuần = 3 giờ social jetlag mỗi tuần. Liên quan đến tăng 33% nguy cơ béo phì, 23% tăng nguy cơ tim mạch theo nghiên cứu 2019.',
      'Bedtime routine signal: não học qua Pavlovian conditioning. Làm cùng một chuỗi hoạt động 30 phút trước ngủ (tắm/đọc sách/stretch nhẹ) tạo "sleep signal" giúp ngủ nhanh hơn 15–20 phút theo thời gian.',
      'Giờ dậy quan trọng hơn giờ ngủ: anchor wake time cố định (dậy cùng giờ mọi ngày kể cả cuối tuần) là cách hiệu quả nhất để fix đồng hồ sinh học. Sau khi wake time ổn định, bedtime tự nhiên sẽ điều chỉnh.',
      'Ánh sáng buổi sáng: 10–15 phút nắng sáng trong 1h đầu sau thức dậy reset circadian clock, tăng cortisol awakening response (CAR), và cải thiện giấc ngủ tối hôm sau — vòng feedback tích cực.',
    ],
    points: [
      { icon: '🔄', label: 'Consistency Trên Số Giờ', note: 'Lệch >1h mỗi ngày = social jetlag có hại' },
      { icon: '⏰', label: 'Anchor Wake Time', note: 'Dậy cùng giờ 7 ngày — reset đồng hồ sinh học hiệu quả nhất' },
      { icon: '📋', label: 'Bedtime Routine 30 Phút', note: 'Chuỗi thói quen = Pavlovian sleep signal cho não' },
      { icon: '☀️', label: 'Nắng Sáng 10–15 Phút', note: 'Reset circadian clock + cải thiện giấc ngủ tối hôm sau' },
    ],
  },
  {
    key: 'steps', icon: '🚶', label: 'Bước chân hôm nay', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '10,000 bước/ngày là con số marketing từ 1964 (máy đếm bước Nhật tên "Manpo-kei" = 万歩計 = 10,000 bước). Nghiên cứu 2021 trên 15,000 người: lợi ích sức khỏe tăng rõ từ 7,000 bước và plateau ở 8,000–10,000. Mỗi 2,000 bước thêm giảm 8–11% nguy cơ tử vong sớm.',
    details: [
      '7,000–8,000 bước/ngày là ngưỡng thực tế cho người bận: giảm tử vong sớm 50–65% so với <4,000 bước theo JAMA Internal Medicine 2021. Không cần đạt 10,000 — con số tốt nhất là cao hơn hôm qua.',
      'Non-exercise activity thermogenesis (NEAT): tất cả bước chân không phải lúc tập (đi lại trong nhà, lên cầu thang, đi chợ) đóng góp 15–50% tổng calo đốt trong ngày tùy lifestyle. NEAT có thể chênh lệch 2,000 kcal/ngày giữa người ngồi nhiều và người năng động.',
      'Sitting breaks quan trọng hơn tổng bước: ngồi liên tục >60 phút gây insulin resistance tạm thời, giảm lipoprotein lipase, và tăng đông máu. 2–3 phút đi bộ mỗi 30–45 phút giải quyết vấn đề này — không cần thêm vào tổng 10,000 bước.',
      'Đi bộ và tâm lý: 10 phút đi bộ giảm anxiety và tăng mood ngay lập tức nhờ tăng serotonin và endorphin. Đặc biệt hiệu quả: đi bộ trong thiên nhiên (green exercise) giảm cortisol 16% hơn so với đi trong nhà.',
      'Tracking bước chân: điện thoại trong túi đo ~80–90% chính xác; smartwatch 90–95%; pedometer clip-on biến động nhiều nhất. Consistency của device quan trọng hơn accuracy tuyệt đối — xu hướng qua thời gian là metric cần theo dõi.',
      'Tăng bước chân không cần thay đổi lịch: đỗ xe xa hơn 200m (thêm ~500 bước), dùng cầu thang thay thang máy (+100–200 bước/tầng), đi bộ trong lúc gọi điện, break lunch đi bộ 15 phút (+1,500 bước). Những thay đổi nhỏ cộng lại thành 3,000–4,000 bước/ngày.',
    ],
    points: [
      { icon: '🎯', label: '7,000–8,000 Ngưỡng Thực Tế', note: 'Giảm 50–65% tử vong sớm — không cần đúng 10,000' },
      { icon: '⚡', label: 'NEAT = 15–50% Calo/Ngày', note: 'Bước chân hằng ngày quan trọng như tập gym' },
      { icon: '⏱️', label: 'Break 2–3 Phút/30–45 Phút', note: 'Ngồi liên tục gây insulin resistance — break thường xuyên' },
      { icon: '🌿', label: 'Đi Bộ Ngoài Trời', note: 'Green exercise giảm cortisol 16% hơn trong nhà' },
    ],
  },
  {
    key: 'energy', icon: '⚡', label: 'Mức năng lượng hôm nay', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mức năng lượng chủ quan (1–10) là một trong những biofeedback quan trọng nhất về recovery và sức khỏe tổng thể. HRV (heart rate variability) cao tương quan với energy cao. Theo dõi 2–4 tuần sẽ cho thấy pattern rõ ràng: năng lượng thấp vào những ngày nào và tại sao.',
    details: [
      'Energy level là lagging indicator: năng lượng hôm nay phản ánh sleep, hydration, và stress của hôm qua và ngày hôm trước đó. Nếu hôm nay năng lượng thấp → nhìn lại giấc ngủ 2 đêm trước và water intake hôm qua.',
      'Ultradian rhythm: não hoạt động theo chu kỳ 90–120 phút (tương tự chu kỳ ngủ). Trong mỗi chu kỳ có ~20 phút "peak" và ~20 phút "trough". Lên kế hoạch deep work trong peak; admin tasks/emails trong trough là chiến lược productivity thiết thực.',
      'Energy management khác time management: thời gian là cố định, năng lượng có thể tăng. Người năng suất không làm thêm giờ — họ quản lý energy: ngủ đủ, protein buổi sáng, vận động nhẹ, hydration, và breaks có chủ đích.',
      'Chronic fatigue warning signs: energy dưới 5/10 liên tục >2 tuần dù ngủ đủ → cần kiểm tra: thiếu máu (iron/B12), hypothyroidism, sleep apnea, hoặc overtraining syndrome. Không nên uống thêm caffeine để compensate.',
      'Caffeine và energy illusion: caffeine block adenosine receptors tạo cảm giác tỉnh táo nhưng không giải quyết sleep debt. Adenosine tích lũy khi đang "block" và crash mạnh hơn khi caffeine hết tác dụng. Half-life caffeine ~5–6h — cà phê lúc 15h ảnh hưởng giấc ngủ 21h.',
      'High-energy activities: vận động nhẹ (đi bộ 10 phút) thực sự tăng energy ngay lập tức nhờ epinephrine và endorphin — không giống caffeine là borrowed energy. Nghịch lý: khi mệt nhất là lúc nên vận động nhẹ nhất.',
    ],
    points: [
      { icon: '🔄', label: 'Lagging Indicator', note: 'Năng lượng hôm nay = giấc ngủ + hydration hôm qua' },
      { icon: '⏱️', label: 'Chu Kỳ 90–120 Phút', note: 'Plan deep work trong peak, admin trong trough' },
      { icon: '☕', label: 'Caffeine = Borrowed Energy', note: 'Block adenosine nhưng không giải quyết sleep debt' },
      { icon: '🚶', label: 'Vận Động Nhẹ Khi Mệt', note: '10 phút đi bộ tăng energy thật sự — không như caffeine' },
    ],
  },
];

const STEPS_RANGES = [
  { label: '< 3,000', color: '#ef4444', note: 'Ngồi nhiều — cần tăng' },
  { label: '3,000–5,000', color: '#f59e0b', note: 'Dưới mức khuyến nghị' },
  { label: '5,000–7,500', color: '#84cc16', note: 'Đủ tối thiểu' },
  { label: '7,500–10,000', color: '#22c55e', note: 'Tốt' },
  { label: '> 10,000', color: '#14b8a6', note: 'Xuất sắc' },
];

function TrackerModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = TRACKER_FIELDS[idx];
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
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Tracker {idx + 1}/{TRACKER_FIELDS.length}</p>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {TRACKER_FIELDS.length}</span>
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

export default function ToolsLifestyleTrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || { sleep: 7, sleepQ: 3, steps: '', energy: 5, bedtime: '', waketime: '', notes: '' }; } catch { return { sleep: 7, sleepQ: 3, steps: '', energy: 5, bedtime: '', waketime: '', notes: '' }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });
  const [trackerModal, setTrackerModal] = useState(null);

  const InfoBtn = ({ fieldIdx }) => {
    const f = TRACKER_FIELDS[fieldIdx];
    return (
      <button onClick={() => setTrackerModal(fieldIdx)}
        className="text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all shrink-0"
        style={{ color: f.color, background: `rgba(${f.rgb},0.1)`, border: `1px solid rgba(${f.rgb},0.25)` }}>
        Chi tiết →
      </button>
    );
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-lt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fLtOrbitSpin { to { --f-lt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-lt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fLtOrbitSpin 3.5s linear infinite;
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

  const last7 = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
  const avgSleep = last7.length ? (last7.reduce((s, [, v]) => s + (v.sleep || 0), 0) / last7.length).toFixed(1) : null;
  const avgEnergy = last7.length ? (last7.reduce((s, [, v]) => s + (v.energy || 0), 0) / last7.length).toFixed(1) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💤</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Lifestyle Tracker</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Ngủ · Bước chân · Năng lượng · 7 ngày trend
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi giấc ngủ, số bước chân và mức năng lượng mỗi ngày. Sau 1 tuần bạn sẽ thấy pattern rõ ràng ảnh hưởng cảm giác của mình.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop" alt="Lifestyle tracker" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            ngủ tốt → năng lượng tốt → kết quả tốt
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* 7-day summary */}
      {last7.length > 1 && (
        <RevealBlock delay={0} className="mb-8">
          <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLOR }}>{avgSleep}</div>
              <div className="text-base text-muted">giờ ngủ TB/ngày</div>
              <div className="text-base mt-1" style={{ color: +avgSleep >= 7 ? '#22c55e' : '#f59e0b' }}>{+avgSleep >= 7 ? '✓ Đủ giấc' : '⚠ Cần ngủ thêm'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: COLOR }}>{avgEnergy}</div>
              <div className="text-base text-muted">năng lượng TB/10</div>
              <div className="text-base mt-1" style={{ color: +avgEnergy >= 6 ? '#22c55e' : '#f59e0b' }}>{+avgEnergy >= 6 ? '✓ Tốt' : '⚠ Cần cải thiện'}</div>
            </div>
          </div>
        </RevealBlock>
      )}

      {/* Today's log */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Ghi Hôm Nay</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-6">

          {/* Sleep hours */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
              <label className="text-lg font-medium text-text">😴 Số giờ ngủ đêm qua</label>
              <div className="flex items-center gap-2 shrink-0">
                <InfoBtn fieldIdx={0} />
                <span className="text-lg font-bold" style={{ color: COLOR }}>{data.sleep} giờ</span>
              </div>
            </div>
            <input type="range" min="3" max="12" step="0.5" value={data.sleep} onChange={e => update('sleep', +e.target.value)}
              className="w-full" style={{ accentColor: COLOR }} />
            <div className="flex justify-between text-base text-muted mt-1"><span>3h</span><span>7h (mục tiêu)</span><span>12h</span></div>
          </div>

          {/* Sleep quality */}
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <label className="text-lg font-medium text-text">⭐ Chất lượng giấc ngủ</label>
              <InfoBtn fieldIdx={1} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {SLEEP_QUALITY.map(q => (
                <button key={q.val} onClick={() => update('sleepQ', q.val)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all text-base"
                  style={{ borderColor: data.sleepQ === q.val ? COLOR : 'rgba(255,255,255,0.08)', background: data.sleepQ === q.val ? `rgba(${RGB},0.15)` : 'transparent' }}>
                  <span className="text-2xl">{q.icon}</span>
                  <span className="text-muted">{q.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedtime / waketime */}
          <div>
            <div className="flex items-center justify-between mb-3 gap-2">
              <span className="text-lg font-medium text-text">🌙 Giờ ngủ &amp; ☀️ Giờ dậy</span>
              <InfoBtn fieldIdx={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['🌙 Giờ ngủ', 'bedtime'], ['☀️ Giờ dậy', 'waketime']].map(([lbl, key]) => (
                <div key={key}>
                  <label className="text-base font-medium text-muted block mb-2">{lbl}</label>
                  <input type="time" value={data[key] ?? ''} onChange={e => update(key, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text focus:outline-none"
                    style={{ borderColor: `rgba(${RGB},0.3)` }} />
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
              <label className="text-lg font-medium text-text">🚶 Bước chân hôm nay</label>
              <InfoBtn fieldIdx={3} />
            </div>
            <input type="number" min="0" value={data.steps ?? ''} onChange={e => update('steps', e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="vd: 7500" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>

          {/* Energy */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
              <label className="text-lg font-medium text-text">⚡ Mức năng lượng hôm nay</label>
              <div className="flex items-center gap-2 shrink-0">
                <InfoBtn fieldIdx={4} />
                <span className="text-lg font-bold" style={{ color: COLOR }}>{data.energy}/10</span>
              </div>
            </div>
            <input type="range" min="1" max="10" value={data.energy} onChange={e => update('energy', +e.target.value)}
              className="w-full" style={{ accentColor: COLOR }} />
          </div>

          {/* Notes */}
          <div>
            <label className="text-lg font-medium text-text block mb-2">📝 Ghi chú hôm nay</label>
            <textarea value={data.notes ?? ''} onChange={e => update('notes', e.target.value)}
              rows={2} placeholder="Điều gì ảnh hưởng đến giấc ngủ/năng lượng hôm nay?" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>
        </div>
      </RevealBlock>

      {/* Steps guide */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Hướng Dẫn Bước Chân</h2>
        <div className="space-y-2">
          {STEPS_RANGES.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
              <span className="text-lg font-medium text-text w-32">{r.label}</span>
              <span className="text-base text-muted">{r.note}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* History */}
      {last7.length > 0 && (
        <RevealBlock delay={3} className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>7 Ngày Gần Nhất</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-base text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Ngày</th>
                  <th className="text-center py-2 font-medium">Ngủ</th>
                  <th className="text-center py-2 font-medium">Bước chân</th>
                  <th className="text-center py-2 font-medium">Năng lượng</th>
                </tr>
              </thead>
              <tbody>
                {last7.map(([date, d]) => (
                  <tr key={date} className="border-b border-border/50">
                    <td className="py-2 text-muted">{date.slice(5)}</td>
                    <td className="py-2 text-center">
                      <span style={{ color: (d.sleep || 0) >= 7 ? '#22c55e' : '#f59e0b' }}>{d.sleep || '–'}h</span>
                    </td>
                    <td className="py-2 text-center text-muted">{d.steps || '–'}</td>
                    <td className="py-2 text-center">
                      <span style={{ color: (d.energy || 0) >= 6 ? COLOR : '#f59e0b' }}>{d.energy || '–'}/10</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {trackerModal !== null && (
        <TrackerModal
          idx={trackerModal}
          onClose={() => setTrackerModal(null)}
          onPrev={() => setTrackerModal(i => Math.max(0, i - 1))}
          onNext={() => setTrackerModal(i => Math.min(TRACKER_FIELDS.length - 1, i + 1))}
          hasPrev={trackerModal > 0}
          hasNext={trackerModal < TRACKER_FIELDS.length - 1}
        />
      )}
    </div>
  );
}
