import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'e-roadmap-orbit-kf';
const ORBIT_CLASS = 'e-roadmap-orbit-ring';
const ORBIT_PROP = '--e-roadmap-orbit-angle';

const PHASES = [
  {
    phase: 1,
    title: 'Nền Tảng — Hiểu Cơ Thể',
    weeks: 'Tuần 1–2',
    color: '#3b82f6',
    rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    desc: 'Xây dựng baseline cá nhân: đo các chỉ số, hiểu các con số, lập hồ sơ sức khỏe.',
    keyFact: 'Tuần 1–2 là nền tảng của toàn bộ lộ trình. Không có baseline chính xác, mọi nỗ lực cải thiện sau đó thiếu điểm tham chiếu — bạn không biết mình đang tiến hay lùi so với xuất phát điểm ban đầu.',
    details: [
      'Đo và ghi chép tất cả chỉ số baseline: BMI, vòng eo, nhịp tim nghỉ, huyết áp. Các con số này là "ảnh chụp" sức khỏe của bạn vào ngày hôm nay — cần thiết để so sánh 3, 6, 12 tháng sau.',
      'Hoàn thành hồ sơ sức khỏe E0 với đầy đủ: tuổi, giới tính, tiền sử bệnh gia đình (bố mẹ, anh chị em), các bệnh mãn tính hiện tại và danh sách thuốc đang dùng.',
      'Học ngưỡng bình thường của 6 chỉ số sinh hóa: BMI (18.5–24.9), huyết áp (<120/80), đường huyết đói (<100 mg/dL), LDL (<100 mg/dL), HbA1c (<5.7%), vòng eo (nam <90cm, nữ <80cm).',
      'Làm bài Đánh Giá Sức Khỏe 15 câu để xác định điểm mạnh và điểm yếu trong 6 lĩnh vực: vận động, dinh dưỡng, giấc ngủ, tâm trí, phòng bệnh, kiến thức sức khỏe.',
      'Lên lịch khám sức khỏe định kỳ nếu chưa khám trong 12 tháng. Ưu tiên xét nghiệm: công thức máu, đường huyết đói, HbA1c, mỡ máu toàn phần, chức năng gan thận.',
      'Ghi chép tất cả vào một nơi duy nhất — sổ tay, file Excel hoặc ứng dụng ghi chú. Hồ sơ này là tài liệu tham chiếu trong suốt lộ trình và nhiều năm tiếp theo.',
    ],
    goals: [
      'Hoàn thành hồ sơ sức khỏe E0 (tuổi, cân nặng, chiều cao, vòng eo)',
      'Đo BMI, vòng eo, nhịp tim nghỉ, huyết áp (nếu có máy)',
      'Đọc qua 6 chỉ số sinh hóa quan trọng (BMI, HA, đường huyết, mỡ máu, HbA1c, vòng eo)',
      'Lên lịch khám sức khỏe định kỳ nếu chưa khám trong 1 năm',
    ],
    points: [
      { icon: '⚖️', label: 'Đo BMI & Vòng Eo', note: 'Chỉ số nguy cơ tim mạch đầu tiên cần biết' },
      { icon: '🫀', label: 'Kiểm Tra Huyết Áp', note: '"Kẻ giết người thầm lặng" — 1/3 người không biết mình mắc' },
      { icon: '🎯', label: 'Bài Đánh Giá 15 Câu', note: 'Xác định điểm mạnh/yếu rõ ràng để ưu tiên' },
      { icon: '📋', label: 'Lập Hồ Sơ Baseline', note: 'Không có baseline = không biết mình cải thiện bao nhiêu' },
    ],
    milestone: 'Hoàn thành bài Đánh Giá Sức Khỏe và biết điểm mạnh/yếu của mình',
  },
  {
    phase: 2,
    title: 'Hành Động — Theo Dõi Hàng Ngày',
    weeks: 'Tuần 3–6',
    color: '#22c55e',
    rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    desc: 'Bắt đầu theo dõi các chỉ số quan trọng và check-in hàng ngày để xây thói quen.',
    keyFact: 'Tuần 3–6 là giai đoạn vàng xây dựng thói quen. Nghiên cứu tại UCL cho thấy một hành vi nhỏ được lặp lại nhất quán trong 4–6 tuần sẽ chuyển từ cần ý chí sang tự động hóa — đây là cơ chế tạo thói quen bền vững.',
    details: [
      'Cân trọng lượng cơ thể vào sáng sớm, sau khi đi vệ sinh, trước khi ăn uống — cùng một điều kiện mỗi lần. Ghi lại mỗi tuần 1 lần, không cần đo hàng ngày (biến động ngày qua ngày gây lo lắng không cần thiết).',
      'Đo huyết áp 2 lần/tuần nếu có thiết bị: sáng ngay sau khi thức dậy và tối trước khi ngủ. Đo 2 lần liên tiếp, lấy trung bình. Ghi cả 2 số (tâm thu/tâm trương) và nhịp tim.',
      'Thiết lập Daily Check-in 5 câu hỏi mỗi sáng (2 phút): Ngủ mấy tiếng? Chất lượng ngủ 1–10? Năng lượng buổi sáng 1–10? Có vận động hôm qua? Tâm trạng 1–10? Xu hướng theo tuần mới quan trọng hơn số ngày lẻ.',
      'Học nhận biết 4 dấu hiệu cần cấp cứu ngay: (1) Quy tắc FAST cho đột quỵ — Face drooping, Arm weakness, Speech difficulty, Time to call 115; (2) Đau ngực siết chặt lan ra tay trái/hàm — nhồi máu cơ tim; (3) Khó thở đột ngột; (4) Mất ý thức đột ngột.',
      'Cập nhật lịch tiêm vaccine còn thiếu: Cúm (hàng năm), Viêm gan B (nếu chưa có miễn dịch), HPV (nữ và nam <45 tuổi), Phế cầu (>65 tuổi hoặc có bệnh mãn tính), Zona (>50 tuổi).',
      'Bắt đầu theo dõi chất lượng giấc ngủ bằng nhật ký đơn giản: giờ vào giường, giờ thức dậy, số lần thức giữa đêm, cảm giác khi dậy. Dữ liệu 4 tuần đủ để nhận ra pattern giấc ngủ của bạn.',
    ],
    goals: [
      'Cân sức khỏe 1 lần/tuần, ghi chép cân nặng',
      'Đo huyết áp 2 lần/tuần nếu có máy (sáng và tối)',
      'Bắt đầu Daily Check-in: 5 câu hỏi mỗi sáng',
      'Học cách nhận biết 4 dấu hiệu cần cấp cứu (quy tắc FAST, nhồi máu cơ tim)',
      'Cập nhật lịch tiêm vaccine còn thiếu',
    ],
    points: [
      { icon: '📊', label: 'Theo Dõi Tuần Tự', note: 'Cân 1 lần/tuần + HA 2 lần/tuần — đủ để thấy xu hướng' },
      { icon: '🌅', label: 'Daily Check-in 5 Câu', note: '2 phút mỗi sáng — dữ liệu sức khỏe cá nhân quý nhất' },
      { icon: '🚨', label: 'Nhận Biết Cấp Cứu', note: 'FAST cho đột quỵ, đau ngực cho nhồi máu cơ tim' },
      { icon: '💉', label: 'Cập Nhật Vaccine', note: 'Cúm, viêm gan B, HPV — kiểm tra xem còn thiếu gì' },
    ],
    milestone: '4 tuần theo dõi liên tục không bỏ ngày nào',
  },
  {
    phase: 3,
    title: 'Tối Ưu — Phòng Bệnh Chủ Động',
    weeks: 'Tuần 7–10',
    color: '#f59e0b',
    rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    desc: 'Áp dụng kiến thức để thay đổi lối sống tích cực và phòng ngừa các bệnh mãn tính.',
    keyFact: 'WHO ước tính 80% bệnh tim mạch, đột quỵ và tiểu đường type 2 có thể phòng ngừa bằng thay đổi lối sống. Tuần 7–10 là giai đoạn bạn bắt đầu "đầu tư" vào sức khỏe dài hạn bằng những thay đổi có bằng chứng khoa học.',
    details: [
      'Thực hiện ít nhất 3/5 trụ cột phòng bệnh mỗi ngày: (1) Vận động ≥150 phút/tuần — tương đương 22 phút/ngày; (2) Ăn ≥5 phần rau quả; (3) Ngủ 7–9 giờ; (4) Quản lý stress (10 phút thư giãn); (5) Không hút thuốc, hạn chế rượu bia.',
      'Hoàn thành gói khám sức khỏe cơ bản hàng năm bao gồm: công thức máu, đường huyết đói, HbA1c, mỡ máu toàn phần (HDL, LDL, triglyceride), chức năng gan (ALT, AST), chức năng thận (creatinine, eGFR), tổng phân tích nước tiểu, X-quang phổi, ECG cơ bản.',
      'Học 5 câu hỏi kiểm tra nguồn thông tin y tế: (1) Ai viết? (2) Đăng ở đâu? (3) Có trích dẫn nghiên cứu không? (4) Bán sản phẩm gì không? (5) Có xung đột lợi ích? Tin từ PubMed, WHO, Mayo Clinic, NIH — nghi ngờ mọi quảng cáo.',
      'Hiểu đúng 5 nguyên tắc an toàn thuốc: Đọc kỹ tờ hướng dẫn, không tự ý dùng kháng sinh, không dùng thuốc của người khác, không nhân đôi liều khi quên, thông báo với bác sĩ tất cả thuốc/TPCN đang dùng để tránh tương tác.',
      'Chia sẻ kiến thức sức khỏe với ít nhất 1 người thân: dạy họ đo huyết áp đúng cách, giải thích kết quả xét nghiệm, hoặc cùng thực hiện một thói quen lành mạnh. Hành vi sức khỏe lây lan qua mạng xã hội — theo nghĩa tích cực.',
      'Lập kế hoạch tầm soát ung thư phù hợp tuổi và giới: Ung thư đại trực tràng (nội soi từ 45 tuổi), ung thư vú (mammogram từ 40 tuổi), ung thư cổ tử cung (Pap smear từ 21 tuổi), ung thư tuyến tiền liệt (PSA từ 50 tuổi).',
    ],
    goals: [
      'Thực hiện ít nhất 3/5 trụ cột phòng bệnh (vận động, dinh dưỡng, ngủ, stress, không hút thuốc)',
      'Hoàn thành gói khám cơ bản hàng năm và lưu kết quả',
      'Học cách lọc thông tin y tế (5 câu hỏi kiểm tra nguồn)',
      'Hiểu đúng về an toàn thuốc và TPCN đang dùng',
      'Chia sẻ kiến thức với gia đình',
    ],
    points: [
      { icon: '🛡️', label: '3/5 Trụ Cột Mỗi Ngày', note: 'Vận động + Dinh dưỡng + Ngủ + Stress + Không thuốc' },
      { icon: '🏥', label: 'Khám Cơ Bản Hàng Năm', note: '8 xét nghiệm cần có: máu, đường, mỡ, gan, thận, nước tiểu, phổi, tim' },
      { icon: '🔍', label: 'Lọc Thông Tin Y Tế', note: '5 câu hỏi kiểm tra nguồn trước khi tin theo' },
      { icon: '🎗️', label: 'Tầm Soát Ung Thư', note: 'Lập kế hoạch tầm soát phù hợp tuổi và giới tính' },
    ],
    milestone: 'Khám sức khỏe xong, có kết quả xét nghiệm cơ bản',
  },
  {
    phase: 4,
    title: 'Bền Vững — Lối Sống Dài Hạn',
    weeks: 'Tuần 11–12+',
    color: '#a855f7',
    rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=800&q=80&auto=format&fit=crop',
    desc: 'Duy trì và cá nhân hóa chương trình sức khỏe cho suốt đời.',
    keyFact: 'Không có "đích đến" trong sức khỏe — chỉ có vòng lặp liên tục: đánh giá → điều chỉnh → cải thiện. Tuần 11–12 không phải kết thúc lộ trình mà là điểm khởi đầu của lối sống khỏe mạnh suốt đời.',
    details: [
      'Thiết lập hệ thống nhắc nhở tự động cho lịch khám định kỳ: đặt lịch Google Calendar lặp lại hàng năm vào ngày sinh nhật, hay đầu mỗi năm mới. Đặt nhắc trước 1 tháng để có thời gian đặt lịch với bác sĩ.',
      'Review bài Đánh Giá Sức Khỏe mỗi 3 tháng: so sánh điểm số với lần trước, xác định lĩnh vực nào cải thiện và lĩnh vực nào cần tập trung hơn trong 3 tháng tới. Mục tiêu dài hạn: đạt ≥75 điểm.',
      'Điều chỉnh mục tiêu sức khỏe dựa trên kết quả xét nghiệm thực tế: nếu LDL tăng → tăng fiber và giảm chất béo bão hòa; nếu đường huyết ranh giới → tăng cường tập sức mạnh và giảm tinh bột tinh chế; nếu huyết áp cao → giảm muối và tăng kali (chuối, rau xanh).',
      'Mở rộng kiến thức sang các chuyên đề chuyên sâu phù hợp với nguy cơ cá nhân: tim mạch, tiểu đường, loãng xương, sức khỏe tâm thần, hay ung thư theo tiền sử gia đình. Đọc từ nguồn uy tín: WHO, CDC, Hội Y học Việt Nam.',
      'Hỗ trợ ít nhất 1 người thân xây dựng lối sống lành mạnh: đi khám cùng, cùng đi bộ sau bữa tối, nấu bữa ăn lành mạnh chung. Nghiên cứu Framingham Heart Study chứng minh hành vi sức khỏe lan rộng trong mạng lưới xã hội.',
      'Xây dựng "Identity" (bản sắc) người sống khỏe — không chỉ là "người đang cố gắng ăn uống lành mạnh" mà là "người ưu tiên sức khỏe". Khi bản sắc thay đổi, hành vi theo sau tự nhiên mà không cần nhiều ý chí.',
    ],
    goals: [
      'Thiết lập lịch khám định kỳ tự động (nhắc nhở hàng năm)',
      'Review điểm Đánh Giá Sức Khỏe mỗi 3 tháng',
      'Điều chỉnh mục tiêu dựa trên kết quả xét nghiệm',
      'Mở rộng kiến thức sang các chuyên đề chuyên sâu hơn',
      'Hỗ trợ người thân trong gia đình xây dựng lối sống lành mạnh',
    ],
    points: [
      { icon: '🔄', label: 'Vòng Lặp 3 Tháng', note: 'Đánh giá → Điều chỉnh → Cải thiện → Lặp lại' },
      { icon: '🎯', label: 'Cá Nhân Hóa Theo Kết Quả', note: 'Xét nghiệm quyết định mục tiêu — không phải xu hướng mạng' },
      { icon: '👨‍👩‍👧', label: 'Lan Rộng Trong Gia Đình', note: 'Hành vi sức khỏe lây lan — theo nghĩa tích cực' },
      { icon: '🧬', label: 'Bản Sắc Người Sống Khỏe', note: 'Từ "cố gắng" → "đây là tôi" — bền vững hơn ý chí' },
    ],
    milestone: 'Bài Đánh Giá Sức Khỏe đạt ≥ 75 điểm lần làm thứ 2',
  },
];

const SUB_LINKS = [
  { to: '/pillar/e/bmi', icon: '⚖️', title: 'Chỉ Số Khối Cơ Thể', color: '#3b82f6' },
  { to: '/pillar/e/blood-pressure', icon: '🫀', title: 'Huyết Áp', color: '#ef4444' },
  { to: '/pillar/e/blood-sugar', icon: '🍬', title: 'Đường Huyết', color: '#f59e0b' },
  { to: '/pillar/e/lipids', icon: '🩸', title: 'Mỡ Máu', color: '#8b5cf6' },
  { to: '/pillar/e/red-flags', icon: '🚨', title: 'Dấu Hiệu Nguy Hiểm', color: '#ef4444' },
  { to: '/pillar/e/medication', icon: '💊', title: 'An Toàn Thuốc', color: '#10b981' },
  { to: '/pillar/e/media-literacy', icon: '🔍', title: 'Lọc Thông Tin', color: '#6366f1' },
  { to: '/pillar/e/prevention', icon: '🛡️', title: 'Phòng Bệnh', color: '#0ea5e9' },
  { to: '/pillar/e/self-monitoring', icon: '📊', title: 'Tự Theo Dõi', color: '#14b8a6' },
  { to: '/pillar/e/checkup', icon: '🏥', title: 'Khám Định Kỳ', color: '#84cc16' },
  { to: '/pillar/e/assessment', icon: '🎯', title: 'Đánh Giá Sức Khỏe', color: '#3b82f6' },
];

function PhaseCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{
        borderColor: hovered ? `rgba(${item.rgb},0.5)` : 'rgba(255,255,255,0.08)',
        boxShadow: hovered ? `0 0 24px rgba(${item.rgb},0.12)` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
          style={{ background: `rgba(${item.rgb},0.15)`, color: item.color }}>
          P{item.phase}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-text leading-snug">{item.title}</div>
          <div className="text-sm text-muted mt-0.5">{item.weeks}</div>
        </div>
        <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg transition-all duration-200"
          style={{ color: item.color, background: hovered ? `rgba(${item.rgb},0.15)` : `rgba(${item.rgb},0.08)` }}>
          Chi tiết →
        </span>
      </div>
      <p className="text-sm text-muted mt-3 leading-relaxed line-clamp-2">{item.desc}</p>
    </div>
  );
}

function PhaseModal({ item, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: `rgba(${item.rgb},0.25)`, border: `2px solid rgba(${item.rgb},0.55)`, color: item.color }}>
            P{item.phase}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2"
            style={{ color: item.color, background: `rgba(${item.rgb},0.12)` }}>{item.weeks}</span>
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.title}</h2>

          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>

          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: item.color }}>Mục Tiêu Giai Đoạn</div>
            <ul className="space-y-2">
              {item.goals.map((g, gi) => (
                <li key={gi} className="flex gap-2 text-sm" style={{ color: 'rgba(209,213,219,0.85)' }}>
                  <span className="shrink-0" style={{ color: item.color }}>→</span>{g}
                </li>
              ))}
            </ul>
          </div>

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

          <div className="rounded-xl p-4 border-l-2 mb-6" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.08)` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: item.color }}>Milestone</p>
            <p className="text-sm" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.milestone}</p>
          </div>

          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              {p.e_prev_btn || '← Trước'}
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>P{item.phase} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              {p.e_next_btn || 'Sau →'}
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
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
      const el = document.getElementById(`reveal-erm-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-erm-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthRoadmapPage() {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const phases = PHASES.map((ph, i) => ({ ...ph, ...(p.rm_phases_tr?.[i] || {}) }));
  const subLinks = SUB_LINKS.map((s, i) => ({ ...s, ...(p.rm_links_tr?.[i] || {}) }));
  const [phaseModal, setPhaseModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eRoadmapOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eRoadmapOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← {p.sub_breadcrumb || 'Kiến Thức Sức Khỏe'}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{p.rm_h1 || 'Lộ Trình Kiến Thức Sức Khỏe'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {p.rm_badge || '12 tuần · 4 giai đoạn · Từ hiểu đến hành động'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {p.rm_desc || 'Lộ trình có hệ thống từ việc hiểu các chỉ số cơ bản, theo dõi thường xuyên, phòng bệnh chủ động, đến duy trì lối sống lành mạnh bền vững suốt đời.'}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Lộ trình sức khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {p.rm_caption || 'Từ kiến thức → hành động → bền vững'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.rm_s1_h2 || 'Lộ Trình 12 Tuần'}</h2>
        <p className="text-muted text-lg mb-6">Nhấn vào từng giai đoạn để xem mục tiêu chi tiết và milestone.</p>
        <div className="space-y-3">
          {phases.map((ph, i) => (
            <PhaseCard key={i} item={ph} onClick={() => setPhaseModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.rm_s2_h2 || 'Tất Cả Chuyên Đề'}</h2>
        <p className="text-muted text-lg mb-6">Khám phá từng chủ đề theo thứ tự lộ trình hoặc nhảy vào bất kỳ chuyên đề nào bạn quan tâm.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {subLinks.map((s, i) => (
            <Link key={i} to={s.to} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:border-purple-500/30 transition-colors group">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-lg font-medium text-text group-hover:text-white transition-colors">{s.title}</span>
              <span className="ml-auto text-muted group-hover:text-text transition-colors text-lg">→</span>
            </Link>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-10">
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-bold text-text mb-2">Bắt Đầu Ngay Hôm Nay</h3>
          <p className="text-lg text-muted mb-4">Làm bài đánh giá để biết điểm xuất phát của bạn, sau đó theo lộ trình từng bước.</p>
          <Link to="/pillar/e/assessment" className="inline-block px-6 py-2.5 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>
            Làm Bài Đánh Giá →
          </Link>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Nội dung mang tính giáo dục sức khỏe. Luôn tham khảo ý kiến bác sĩ cho các quyết định y tế quan trọng.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← {p.sub_back_footer || 'Quay lại Kiến Thức Sức Khỏe'}</Link>

      {phaseModal !== null && (
        <PhaseModal
          item={phases[phaseModal]}
          total={phases.length}
          onClose={() => setPhaseModal(null)}
          onPrev={() => setPhaseModal(i => Math.max(0, i - 1))}
          onNext={() => setPhaseModal(i => Math.min(phases.length - 1, i + 1))}
          hasPrev={phaseModal > 0}
          hasNext={phaseModal < phases.length - 1}
        />
      )}
    </div>
  );
}
