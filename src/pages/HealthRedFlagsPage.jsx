import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-rf-orbit-kf';
const ORBIT_CLASS = 'e-rf-orbit-ring';
const ORBIT_PROP = '--e-rf-orbit-angle';

const EMERGENCY_GROUPS = [
  {
    icon: '🧠',
    title: 'Đột Quỵ — Gọi 115 Ngay',
    color: '#ef4444',
    tag: 'KHẨN CẤP',
    signs: [
      'Méo miệng đột ngột, mất cân đối khuôn mặt',
      'Tê hoặc yếu nửa người (tay, chân, mặt)',
      'Nói đớ, không thành lời, không hiểu người khác nói',
      'Mờ mắt một hoặc hai mắt đột ngột',
      'Đau đầu dữ dội không rõ nguyên nhân',
    ],
    note: 'Nhớ quy tắc FAST: Face drooping · Arm weakness · Speech difficulty · Time to call 115',
    action: 'Gọi 115 hoặc đến cấp cứu ngay — mỗi phút mất 1.9 triệu tế bào thần kinh trong đột quỵ.',
  },
  {
    icon: '❤️',
    title: 'Nhồi Máu Cơ Tim',
    color: '#ef4444',
    tag: 'KHẨN CẤP',
    signs: [
      'Đau ngực như bị ép, siết chặt, kéo dài > 15 phút',
      'Đau lan ra vai trái, cánh tay trái, hàm, lưng',
      'Khó thở kèm đau ngực',
      'Toát mồ hôi lạnh, buồn nôn, chóng mặt đột ngột',
      'Cảm giác báo trước kỳ lạ, lo lắng cực độ',
    ],
    note: 'Phụ nữ có thể không đau ngực điển hình — triệu chứng thường là buồn nôn, mệt mỏi đột ngột, khó thở.',
    action: 'Gọi 115 ngay, nhai 1 viên aspirin 300mg (nếu không dị ứng), nằm nghỉ — không tự lái xe đến bệnh viện.',
  },
  {
    icon: '🌡️',
    title: 'Nhiễm Trùng Nặng / Sốc',
    color: '#f97316',
    tag: 'KHẨN CẤP',
    signs: [
      'Sốt cao > 39.5°C không hạ sau 2 giờ dùng thuốc',
      'Mạch nhanh > 100 lần/phút kèm lơ mơ',
      'Tụt huyết áp: HA tâm thu < 90 mmHg',
      'Nổi ban đỏ lan nhanh kèm sốt',
      'Cứng gáy, sợ ánh sáng, đau đầu dữ dội (viêm màng não)',
    ],
    note: 'Sốc nhiễm trùng (septic shock) là tình trạng đe dọa tính mạng cần điều trị trong vòng 1 giờ đầu.',
    action: 'Vào cấp cứu ngay — không chờ uống thuốc xem có đỡ không.',
  },
  {
    icon: '🫁',
    title: 'Khó Thở Cấp Tính',
    color: '#f97316',
    tag: 'KHẨN CẤP',
    signs: [
      'Thở dốc đột ngột khi nghỉ ngơi',
      'Tím môi, tím đầu ngón tay',
      'Không thể nói trọn câu vì thiếu hơi',
      'Thở khò khè dữ dội không đáp ứng thuốc xịt',
      'Ho ra máu',
    ],
    note: 'Nhồi máu phổi (thuyên tắc phổi) có thể gây khó thở đột ngột mà không có dấu hiệu báo trước.',
    action: 'Gọi 115 hoặc vào cấp cứu ngay, đặt người bệnh ngồi tựa để dễ thở hơn.',
  },
];

const SOON_SIGNS = [
  { icon: '🩺', sign: 'Sụt cân không rõ nguyên nhân > 5% trong 1 tháng', urgency: 'Trong 1–2 tuần' },
  { icon: '🩺', sign: 'Mệt mỏi dai dẳng không hồi phục dù nghỉ đủ', urgency: 'Trong 1–2 tuần' },
  { icon: '🩺', sign: 'Khối u hoặc hạch bất thường mới xuất hiện', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Đi tiểu ra máu (không do kinh nguyệt)', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Ho kéo dài > 3 tuần không rõ nguyên nhân', urgency: 'Trong 2 tuần' },
  { icon: '🩺', sign: 'Thay đổi tính chất phân: máu, đen, mỏng hơn kéo dài', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Đau đầu sáng sớm kèm nôn mửa liên tục', urgency: 'Trong 3–5 ngày' },
  { icon: '🩺', sign: 'Nhìn đôi hoặc mất thị lực một phần kéo dài', urgency: 'Trong 1–2 ngày' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-rf-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-rf-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthRedFlagsPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eRfOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eRfOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🚨</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Dấu Hiệu Nguy Hiểm</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Nhận biết khẩn cấp · Cấp cứu đúng lúc
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Nhận biết đúng các dấu hiệu nguy hiểm có thể cứu sống bạn hoặc người thân. Ghi nhớ: <strong className="text-text">khi nghi ngờ — gọi 115</strong>. Không chờ đợi khi triệu chứng nghiêm trọng.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&auto=format&fit=crop" alt="Cấp cứu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Gọi 115 khi nghi ngờ
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Emergency banner */}
      <RevealBlock delay={0} className="mb-10">
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: COLOR, background: `rgba(${RGB},0.07)` }}>
          <div className="text-2xl font-black text-white mb-1">115</div>
          <div className="text-sm font-bold" style={{ color: COLOR }}>Số cấp cứu toàn quốc — Miễn phí 24/7</div>
          <p className="text-xs text-muted mt-1">Hoặc nhờ ai đó đưa đến khoa cấp cứu bệnh viện gần nhất</p>
        </div>
      </RevealBlock>

      {/* Emergency groups */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Cấp Cứu Ngay Lập Tức</h2>
        <p className="text-muted text-sm mb-6">Các tình trạng dưới đây đòi hỏi xử lý trong phút — không phải giờ.</p>
        <div className="space-y-4">
          {EMERGENCY_GROUPS.map((g, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: `${g.color}33` }}>
              <div className="flex items-center gap-3 p-4" style={{ background: `${g.color}10` }}>
                <span className="text-2xl">{g.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-text">{g.title}</div>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded-full" style={{ background: g.color, color: 'white' }}>{g.tag}</span>
              </div>
              <div className="p-4 space-y-3">
                <ul className="space-y-1">
                  {g.signs.map((s, j) => (
                    <li key={j} className="flex gap-2 text-sm text-text">
                      <span style={{ color: g.color }} className="shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
                {g.note && <p className="text-xs text-muted border-l-2 pl-3" style={{ borderColor: g.color }}>{g.note}</p>}
                <div className="rounded-xl p-3 text-sm font-bold" style={{ background: `${g.color}15`, color: g.color }}>
                  → {g.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Soon signs */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>Cần Đi Khám Sớm</h2>
        <p className="text-muted text-sm mb-6">Các dấu hiệu này không cần vào cấp cứu ngay nhưng cần đặt lịch khám trong thời gian ngắn.</p>
        <div className="space-y-2">
          {SOON_SIGNS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm text-text flex-1">{s.sign}</p>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-full border" style={{ color: '#f97316', borderColor: '#f9731633', background: '#f9731610' }}>{s.urgency}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Chuẩn Bị Sẵn Sàng</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>• Lưu số 115 vào điện thoại ngay bây giờ</li>
            <li>• Biết tên và địa chỉ bệnh viện gần nhà nhất có khoa cấp cứu</li>
            <li>• Chuẩn bị túi cấp cứu cơ bản: aspirin (nếu không dị ứng), thuốc thường dùng, CCCD, thẻ bảo hiểm y tế</li>
            <li>• Học cách sơ cứu cơ bản: CPR, hồi sức ngừng thở</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-xs text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục. Không thay thế khám và điều trị y tế.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
