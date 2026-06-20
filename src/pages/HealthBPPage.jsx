import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-bp-orbit-kf';
const ORBIT_CLASS = 'e-bp-orbit-ring';
const ORBIT_PROP = '--e-bp-orbit-angle';

const BP_CATS = [
  {
    label: 'Bình thường', sys: '< 120', dia: '< 80', color: '#22c55e', rgb: '34,197,94', bg: '#22c55e18',
    action: 'Duy trì lối sống lành mạnh, tái khám hàng năm.',
    icon: '💚',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    keyFact: '💡 Huyết áp tối ưu thực sự là < 115/75 mmHg. Mỗi 20 mmHg tâm thu tăng = nguy cơ bệnh tim mạch tăng gấp đôi theo dữ liệu Framingham Heart Study.',
    detail: 'Duy trì huyết áp bình thường là thành tích quan trọng — nhiều người không biết mình đã có tăng huyết áp âm thầm trong nhiều năm mà không có triệu chứng.',
    details: [
      'HA < 120/80 mmHg ở người lớn được AHA 2017 phân loại là "Normal" — đây là ngưỡng bảo vệ tim mạch tối ưu theo bằng chứng hiện tại.',
      'Mỗi năm nên đo HA ít nhất 1 lần, dù không có triệu chứng — tăng HA thường không có dấu hiệu cảnh báo cho đến khi xảy ra biến chứng.',
      'Giữ HA trong ngưỡng bình thường làm giảm nguy cơ đột quỵ 35–40% và giảm nguy cơ nhồi máu cơ tim 20–25% so với người có HA tăng.',
      'Yếu tố duy trì HA bình thường: cân nặng hợp lý, ăn ít muối (< 5g/ngày), vận động đều, không hút thuốc, hạn chế rượu bia.',
      'Huyết áp dao động trong ngày là bình thường: cao hơn vào buổi sáng sớm (morning surge), thấp hơn ban đêm — đo lúc thức nhưng chưa ăn cho kết quả chuẩn nhất.',
      'Người dưới 40 tuổi, không có yếu tố nguy cơ: đo HA mỗi 1–2 năm là đủ. Người ≥ 40 tuổi hoặc có nguy cơ: nên đo mỗi 3–6 tháng.',
    ],
    points: [
      { icon: '📅', label: 'Tái khám hàng năm', note: 'Ngay cả khi không có triệu chứng' },
      { icon: '🧂', label: 'Muối < 5g/ngày', note: '1 muỗng cà phê — giảm 5 mmHg' },
      { icon: '🏃', label: '150 phút/tuần vận động', note: 'Giảm HA 5–8 mmHg' },
      { icon: '⚖️', label: 'BMI 18.5–24.9', note: 'Giảm 1kg → HA giảm ~1 mmHg' },
    ],
  },
  {
    label: 'Tiền tăng huyết áp', sys: '120–129', dia: '< 80', color: '#eab308', rgb: '234,179,8', bg: '#eab30818',
    action: 'Điều chỉnh chế độ ăn, giảm muối, tăng vận động.',
    icon: '⚡',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '💡 Người ở mức "Elevated" (120–129/<80) có nguy cơ phát triển tăng huyết áp thực sự cao hơn 2 lần trong 4 năm tới — đây là cơ hội vàng để can thiệp trước khi cần thuốc.',
    detail: 'Giai đoạn tiền tăng huyết áp là "cửa sổ cơ hội" — thay đổi lối sống ở bước này có thể đưa HA về ngưỡng bình thường mà không cần can thiệp thuốc.',
    details: [
      'Phân loại AHA 2017: tâm thu 120–129 mmHg VÀ tâm trương < 80 mmHg = "Elevated". Đây chưa phải tăng huyết áp nhưng cần hành động.',
      'Nguy cơ: trong 4 năm, khoảng 40–50% người ở mức này sẽ phát triển thành tăng HA thực sự nếu không thay đổi lối sống.',
      'Mục tiêu can thiệp: đưa HA xuống < 120/80 mmHg thông qua lối sống — không cần thuốc ở giai đoạn này trừ khi có bệnh nền đặc biệt.',
      'DASH diet (Dietary Approaches to Stop Hypertension): giảm HA 8–14 mmHg — hiệu quả tương đương một viên thuốc huyết áp nhẹ.',
      'Cắt giảm natri từ 3.5g xuống 1.5g/ngày giảm được 5–6 mmHg HA tâm thu — đọc nhãn thực phẩm đóng gói là bước quan trọng.',
      'Tái đánh giá sau 3 tháng thay đổi lối sống: nếu HA không về bình thường, cần kiểm tra thêm yếu tố nguy cơ tim mạch toàn diện (lipid, đường huyết).',
    ],
    points: [
      { icon: '🥗', label: 'DASH diet', note: 'Giảm 8–14 mmHg không cần thuốc' },
      { icon: '🧂', label: 'Cắt giảm muối tích cực', note: 'Từ 3.5g → 1.5g/ngày' },
      { icon: '🏋️', label: 'Tăng vận động', note: '150 phút/tuần aerobic' },
      { icon: '📊', label: 'Theo dõi 3 tháng', note: 'Đánh giá lại sau thay đổi lối sống' },
    ],
  },
  {
    label: 'Tăng HA độ 1', sys: '130–139', dia: '80–89', color: '#f97316', rgb: '249,115,22', bg: '#f9731618',
    action: 'Thay đổi lối sống 3–6 tháng; cân nhắc thuốc nếu có nguy cơ.',
    icon: '📈',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 Tăng HA độ 1 tăng nguy cơ đột quỵ 35% và nhồi máu cơ tim 25%. Nếu có thêm tiểu đường, bệnh thận mạn, hoặc bệnh tim mạch — nên bắt đầu thuốc ngay, không chờ 3–6 tháng.',
    detail: 'Ở giai đoạn này, quyết định dùng thuốc hay không phụ thuộc vào nguy cơ tim mạch tổng thể, không chỉ riêng con số huyết áp.',
    details: [
      'AHA khuyến cáo: tăng HA độ 1 (130–139/80–89) — nếu nguy cơ tim mạch 10 năm < 10%: thử lối sống 3–6 tháng trước. Nếu ≥ 10%: bắt đầu thuốc ngay.',
      'Tính nguy cơ tim mạch 10 năm bằng thang điểm Pooled Cohort Equations (tính trực tuyến miễn phí trên các trang tim mạch): dựa trên tuổi, giới, cholesterol, đái tháo đường, hút thuốc.',
      'Nhóm cần thuốc ngay dù HA chỉ 130–139/80–89: có bệnh tim mạch đã xác định (tiền sử đột quỵ, NMCT), đái tháo đường, bệnh thận mạn (eGFR < 60).',
      'Thuốc hàng đầu cho tăng HA không biến chứng: thiazide, ACE inhibitor, ARB, hoặc calcium channel blocker — bác sĩ chọn dựa trên profile cá nhân.',
      'Kết hợp thuốc + lối sống hiệu quả hơn đơn độc: thuốc giảm 10–15 mmHg + DASH + giảm muối + vận động có thể đưa HA về < 130/80.',
      'Tái khám sau 1 tháng bắt đầu thuốc để đánh giá hiệu quả và tác dụng phụ. Không tự điều chỉnh liều mà không có bác sĩ hướng dẫn.',
    ],
    points: [
      { icon: '🏥', label: 'Đánh giá nguy cơ 10 năm', note: 'Quyết định có dùng thuốc hay không' },
      { icon: '💊', label: 'Thuốc nếu nguy cơ cao', note: 'Tiểu đường, thận mạn → thuốc ngay' },
      { icon: '🔄', label: 'Kết hợp thuốc + lối sống', note: 'Hiệu quả hơn đơn độc mỗi thứ' },
      { icon: '📅', label: 'Tái khám sau 1 tháng', note: 'Kiểm tra hiệu quả và tác dụng phụ' },
    ],
  },
  {
    label: 'Tăng HA độ 2', sys: '≥ 140', dia: '≥ 90', color: '#ef4444', rgb: '239,68,68', bg: '#ef444418',
    action: 'Bắt đầu dùng thuốc + thay đổi lối sống, tái khám trong 1 tháng.',
    icon: '🚨',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💡 Ở mức ≥ 140/90 mmHg, phần lớn hướng dẫn khuyến cáo phối hợp 2 loại thuốc ngay từ đầu — 1 thuốc thường không đủ kiểm soát HA đến mục tiêu < 130/80.',
    detail: 'Tăng HA độ 2 là ngưỡng cần can thiệp y tế tích cực ngay — thay đổi lối sống đơn thuần không đủ nhanh để bảo vệ cơ quan đích.',
    details: [
      'Ở mức ≥ 140/90 mmHg, nguy cơ tổn thương cơ quan đích (tim, não, thận, mắt, mạch máu) tăng theo cấp số nhân — cần hạ HA nhanh nhưng có kiểm soát.',
      'Phối hợp 2 thuốc thường được khuyến cáo ngay từ đầu thay vì đơn trị liệu — thường là ACE inhibitor/ARB + thiazide hoặc calcium channel blocker.',
      'Mục tiêu HA ở người có bệnh nền: < 130/80 (tiểu đường, bệnh thận), < 125/75 (protein niệu cao). Không phải một mục tiêu cho tất cả.',
      'Tổn thương cơ quan đích cần kiểm tra định kỳ: ECG (tim), creatinine + eGFR (thận), soi đáy mắt (võng mạc), siêu âm tim (nếu có triệu chứng).',
      'Tránh hạ HA quá nhanh: người cao tuổi, xơ vữa nặng — hạ HA đột ngột có thể gây thiếu máu não (chóng mặt, ngất, đột quỵ do giảm tưới máu).',
      'Theo dõi tại nhà 2 lần/ngày (sáng + tối) và ghi lại nhật ký: cung cấp thông tin quan trọng cho bác sĩ điều chỉnh thuốc hiệu quả hơn đo tại phòng khám.',
    ],
    points: [
      { icon: '💊', label: 'Phối hợp 2 thuốc', note: '1 thuốc thường không đủ ở mức này' },
      { icon: '🫀', label: 'Kiểm tra cơ quan đích', note: 'Tim, thận, mắt, não' },
      { icon: '📉', label: 'Hạ từ từ', note: 'Không hạ đột ngột ở người cao tuổi' },
      { icon: '📓', label: 'Nhật ký sáng + tối', note: 'Dữ liệu thực hơn đo tại phòng khám' },
    ],
  },
  {
    label: 'Khủng hoảng HA', sys: '> 180', dia: '> 120', color: '#ef4444', rgb: '239,68,68', bg: '#ef444430',
    action: 'Đến cấp cứu ngay nếu có triệu chứng (đau đầu dữ dội, mờ mắt, đau ngực).',
    icon: '🆘',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=800&q=80',
    keyFact: '💡 Hypertensive emergency (>180/120 + tổn thương cơ quan) đòi hỏi hạ HA bằng thuốc truyền tĩnh mạch tại ICU — không phải uống thêm thuốc tại nhà. Gọi 115 ngay.',
    detail: 'Khủng hoảng huyết áp là cấp cứu nội khoa thực sự — tổn thương não, tim, thận có thể xảy ra trong vài giờ nếu không điều trị.',
    details: [
      'Phân biệt 2 loại: Hypertensive urgency (>180/120, không có triệu chứng tổn thương cơ quan) — có thể kiểm soát trong 24–48h. Hypertensive emergency (>180/120 + triệu chứng) — cần ICU ngay.',
      'Triệu chứng của hypertensive emergency: đau đầu dữ dội (thunderclap headache), mờ mắt hoặc mất thị lực đột ngột, đau ngực, khó thở, lú lẫn, yếu liệt tay chân một bên, nói khó.',
      'KHÔNG tự uống thêm thuốc huyết áp tại nhà khi HA > 180/120 kèm triệu chứng — thuốc uống tác dụng chậm và không kiểm soát được tốc độ hạ HA.',
      'Tại ICU: thuốc hạ HA truyền tĩnh mạch (labetalol, nicardipine, sodium nitroprusside) cho phép điều chỉnh chính xác tốc độ hạ HA từng phút.',
      'Mục tiêu hạ HA trong khủng hoảng: giảm không quá 25% trong giờ đầu — hạ quá nhanh gây đột quỵ do thiếu máu não (ischemic stroke) do mạch não đã thích nghi với HA cao.',
      'Sau khi ổn định: tìm nguyên nhân thứ phát (hẹp động mạch thận, u tủy thượng thận, hội chứng Cushing) — 5–10% tăng HA có nguyên nhân có thể điều trị triệt để.',
    ],
    points: [
      { icon: '🚑', label: 'Gọi 115 ngay', note: 'Không tự lái xe khi HA > 180/120 + triệu chứng' },
      { icon: '🏥', label: 'Điều trị tại ICU', note: 'Thuốc truyền tĩnh mạch — không uống tại nhà' },
      { icon: '📉', label: 'Hạ chậm có kiểm soát', note: 'Không quá 25% trong giờ đầu' },
      { icon: '🔬', label: 'Tìm nguyên nhân thứ phát', note: 'Sau ổn định — 5-10% có nguyên nhân chữa được' },
    ],
  },
];

const STEPS = [
  { num: '1', title: 'Nghỉ ngơi 5 phút', desc: 'Ngồi yên, không nói chuyện, tư thế thoải mái trước khi đo.' },
  { num: '2', title: 'Tránh cà phê & thuốc lá', desc: 'Không dùng cà phê, thuốc lá, rượu 30 phút trước khi đo.' },
  { num: '3', title: 'Tư thế chuẩn', desc: 'Ngồi ngay lưng, hai chân chạm đất, tay đặt bằng tim trên bàn.' },
  { num: '4', title: 'Băng quấn đúng cỡ', desc: 'Băng quấn ôm sát, cách nếp khuỷu tay 2–3cm. Không quấn lên áo.' },
  { num: '5', title: 'Đo 2 lần liên tiếp', desc: 'Nghỉ 1–2 phút giữa 2 lần đo. Ghi lại trị số trung bình.' },
];

const LIFESTYLE = [
  { icon: '🧂', title: 'Giảm muối', desc: '< 5g muối/ngày (1 muỗng cà phê). Tránh đồ đóng hộp, mì gói.' },
  { icon: '🥦', title: 'Ăn nhiều rau quả', desc: 'DASH diet: rau, trái cây, ngũ cốc nguyên hạt, sữa ít béo.' },
  { icon: '🏃', title: 'Vận động đều', desc: '150 phút/tuần cường độ vừa (đi bộ nhanh, bơi lội, đạp xe).' },
  { icon: '⚖️', title: 'Giữ cân nặng hợp lý', desc: 'Giảm 1kg → HA giảm ~1 mmHg. Mục tiêu BMI 18.5–24.9.' },
  { icon: '🚭', title: 'Không hút thuốc', desc: 'Bỏ thuốc lá → HA giảm ngay trong vài tuần đầu.' },
  { icon: '🧘', title: 'Kiểm soát stress', desc: 'Thở sâu, thiền, yoga → giảm hệ thần kinh giao cảm.' },
];

function BPModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = e => {
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
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
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
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
            <h2 className="font-bold text-2xl md:text-3xl" style={{ color: item.color }}>{item.label}</h2>
          </div>
          <p className="font-semibold text-base mb-2 pl-6" style={{ color: `rgba(${item.rgb},0.7)` }}>
            Tâm thu: {item.sys} &nbsp;·&nbsp; Tâm trương: {item.dia}
          </p>
          <div className="rounded-2xl px-4 py-3 mb-6 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}` }}>
            {item.keyFact}
          </div>
          <p className="text-muted text-base leading-relaxed mb-6">{item.detail}</p>
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
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-bp-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      id={`reveal-bp-${delay}`}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s`,
      }}
    >
      {children}
    </div>
  );
}

function BPJournal() {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_bp_journal') || '[]'); }
    catch { return []; }
  });
  const [sys, setSys] = useState('');
  const [dia, setDia] = useState('');
  const [pulse, setPulse] = useState('');

  function addEntry() {
    if (!sys || !dia) return;
    const now = new Date();
    const entry = { sys: +sys, dia: +dia, pulse: +pulse || null, date: now.toLocaleDateString('vi-VN'), time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    const updated = [entry, ...entries].slice(0, 14);
    setEntries(updated);
    localStorage.setItem('healthapp_bp_journal', JSON.stringify(updated));
    setSys(''); setDia(''); setPulse('');
  }

  function getColor(s, d) {
    if (s > 180 || d > 120) return '#7f1d1d';
    if (s >= 140 || d >= 90) return '#ef4444';
    if (s >= 130 || d >= 80) return '#f97316';
    if (s >= 120) return '#eab308';
    return '#22c55e';
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold text-text mb-4" style={{ color: COLOR }}>Nhật Ký Huyết Áp 7 Ngày</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <input value={sys} onChange={e => setSys(e.target.value)} placeholder="Tâm thu (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={dia} onChange={e => setDia(e.target.value)} placeholder="Tâm trương (mmHg)" type="number" className="flex-1 min-w-[120px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <input value={pulse} onChange={e => setPulse(e.target.value)} placeholder="Nhịp tim (bpm)" type="number" className="flex-1 min-w-[100px] bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <button onClick={addEntry} className="px-4 py-2 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>+ Thêm</button>
      </div>
      {entries.length === 0 && <p className="text-muted text-lg text-center py-6">Chưa có dữ liệu. Thêm lần đo đầu tiên.</p>}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2 border border-border">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(e.sys, e.dia) }} />
            <span className="font-bold text-lg" style={{ color: getColor(e.sys, e.dia) }}>{e.sys}/{e.dia}</span>
            {e.pulse && <span className="text-base text-muted">♥ {e.pulse} bpm</span>}
            <span className="text-base text-muted ml-auto">{e.date} {e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HealthBPPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [bpModal, setBpModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBpOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eBpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        ← Kiến Thức Sức Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>
          🫀
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Huyết Áp</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Chỉ số sinh tồn · Theo dõi thường xuyên
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Huyết áp là áp lực máu tác động lên thành mạch. Tăng huyết áp không triệu chứng thường trực — được gọi là "kẻ giết người thầm lặng" — và là nguyên nhân hàng đầu của đột quỵ, nhồi máu cơ tim.
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&q=80&auto=format&fit=crop" alt="Đo huyết áp" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Đo đúng cách · Đọc đúng số
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Personalized banner */}
      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — Nên đo huyết áp {b0.age >= 40 ? 'mỗi 3–6 tháng' : 'mỗi năm'} và theo dõi hàng ngày nếu có nguy cơ.</p>
          </div>
        </RevealBlock>
      )}

      {/* Classification */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại Huyết Áp (AHA 2017)</h2>
        <p className="text-muted text-lg mb-6">Đơn vị mmHg. Áp dụng cho người lớn ≥ 18 tuổi, không dùng thuốc huyết áp.</p>
        <div className="space-y-3">
          {BP_CATS.map((c, i) => (
            <div key={i}
              onClick={() => setBpModal(i)}
              className="rounded-2xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer transition-colors"
              style={{ background: c.bg, borderColor: `rgba(${c.rgb},0.25)` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.55)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.25)`}
            >
              <div className="flex items-center gap-3 sm:w-48 shrink-0">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="font-bold text-lg text-text">{c.label}</span>
              </div>
              <div className="flex gap-4 text-base text-muted sm:w-40 shrink-0">
                <span>Tâm thu: <strong className="text-text">{c.sys}</strong></span>
                <span>Tâm trương: <strong className="text-text">{c.dia}</strong></span>
              </div>
              <p className="text-base text-muted flex-1">{c.action}</p>
              <span className="text-muted text-base shrink-0">→</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border p-4 text-lg" style={{ borderColor: `rgba(239,68,68,0.3)`, background: 'rgba(239,68,68,0.06)' }}>
          <span className="font-bold text-red-400">⚠ Khẩn cấp:</span> <span className="text-muted">HA &gt; 180/120 mmHg kèm đau đầu dữ dội, mờ mắt, đau ngực, khó thở, tê liệt → <strong className="text-text">Gọi 115 hoặc vào cấp cứu ngay.</strong></span>
        </div>
      </RevealBlock>

      {/* Measurement technique */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kỹ Thuật Đo Đúng Chuẩn</h2>
        <p className="text-muted text-lg mb-6">Sai kỹ thuật có thể khiến kết quả lệch 10–20 mmHg.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {STEPS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-4">
              <div className="w-9 h-9 rounded-xl font-bold text-xl flex items-center justify-center shrink-0" style={{ background: `rgba(${RGB},0.12)`, color: COLOR }}>{s.num}</div>
              <div>
                <div className="font-bold text-lg text-text mb-1">{s.title}</div>
                <div className="text-base text-muted">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 text-lg text-muted">
          <strong className="text-text">Nên đo lúc nào?</strong> Buổi sáng (sau khi thức, trước khi ăn, trước khi uống thuốc) và buổi tối (trước khi ngủ). Ghi lại cả hai lần để có xu hướng chính xác hơn.
        </div>
      </RevealBlock>

      {/* Lifestyle */}
      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lối Sống Kiểm Soát Huyết Áp</h2>
        <p className="text-muted text-lg mb-6">Thay đổi lối sống có thể giảm HA 5–20 mmHg mà không cần thuốc.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {LIFESTYLE.map((l, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3 hover:border-red-500/30 transition-colors">
              <span className="text-3xl">{l.icon}</span>
              <div>
                <div className="font-bold text-lg text-text mb-1">{l.title}</div>
                <div className="text-base text-muted">{l.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Journal */}
      <RevealBlock delay={4} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Ghi Nhật Ký Huyết Áp</h2>
        <BPJournal />
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        ← Quay lại Kiến Thức Sức Khỏe
      </Link>

      {bpModal !== null && (
        <BPModal
          item={BP_CATS[bpModal]}
          idx={bpModal}
          total={BP_CATS.length}
          onClose={() => setBpModal(null)}
          onPrev={() => setBpModal(i => Math.max(0, i - 1))}
          onNext={() => setBpModal(i => Math.min(BP_CATS.length - 1, i + 1))}
          hasPrev={bpModal > 0}
          hasNext={bpModal < BP_CATS.length - 1}
        />
      )}
    </div>
  );
}
