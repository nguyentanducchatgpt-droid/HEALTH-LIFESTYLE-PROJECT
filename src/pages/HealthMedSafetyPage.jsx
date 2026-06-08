import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'e-med-orbit-kf';
const ORBIT_CLASS = 'e-med-orbit-ring';
const ORBIT_PROP = '--e-med-orbit-angle';

const MED_RULES = [
  {
    num: '1', icon: '📋',
    title: 'Không tự ý đổi thuốc hoặc liều',
    desc: 'Không thay thế thuốc kê đơn bằng thuốc khác "trông giống vậy". Không tự giảm liều khi thấy "đỡ rồi" — nhiều bệnh cần điều trị đủ liệu trình mới khỏi hẳn.',
  },
  {
    num: '2', icon: '⏰',
    title: 'Uống đúng giờ, đúng cách',
    desc: 'Một số thuốc cần uống trước ăn (như metformin để giảm phụ tác dụng dạ dày), một số cần uống sau ăn. Kháng sinh cần duy trì nồng độ đều đặn — uống đúng giờ.',
  },
  {
    num: '3', icon: '🍊',
    title: 'Chú ý tương tác thuốc-thức ăn',
    desc: 'Bưởi (grapefruit) ức chế enzyme CYP3A4, tăng nồng độ nhiều loại thuốc lên 10 lần. Rượu + paracetamol → tổn thương gan. Sữa + tetracycline → giảm hấp thu.',
  },
  {
    num: '4', icon: '💊',
    title: 'Không dùng chung thuốc',
    desc: 'Thuốc kê cho người khác, dù cùng triệu chứng, có thể không phù hợp với bạn do dị ứng, bệnh nền, hoặc tương tác thuốc đang dùng.',
  },
  {
    num: '5', icon: '📦',
    title: 'Bảo quản đúng cách',
    desc: 'Hầu hết thuốc bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng. Không để thuốc trong phòng tắm (ẩm) hay xe hơi (nóng). Insulin: bảo quản lạnh 2–8°C.',
  },
];

const DANGER_PHRASES = [
  { phrase: '"Uống nhiều hơn cho mau khỏi"', risk: 'Quá liều, độc cho gan/thận tùy loại thuốc' },
  { phrase: '"Thuốc tây hại, dùng thuốc nam cho an toàn"', risk: 'Nhiều thảo dược tương tác nghiêm trọng với thuốc tây (St. John\'s Wort + thuốc chống trầm cảm, kava + an thần)' },
  { phrase: '"Kháng sinh uống vài ngày thấy khỏi thì thôi"', risk: 'Kháng kháng sinh — vi khuẩn sống sót phát triển đề kháng, lần sau khó điều trị hơn' },
  { phrase: '"Paracetamol an toàn, uống nhiều không sao"', risk: 'Paracetamol > 4g/ngày (người bình thường) hoặc > 2g/ngày (uống rượu nhiều) → suy gan cấp' },
  { phrase: '"Vitamin uống bao nhiêu cũng được"', risk: 'Vitamin A, D, E, K (tan trong dầu) tích lũy → độc liều cao. Vitamin A: > 10.000 IU/ngày gây dị tật thai' },
  { phrase: '"Thuốc bổ không cần đơn"', risk: 'TPCN không qua kiểm duyệt nghiêm ngặt như thuốc, có thể nhiễm kim loại nặng, tương tác thuốc' },
];

const SUPPLEMENT_CHECK = [
  { label: 'Omega-3', note: 'Giảm TG, an toàn. Liều > 3g/ngày: ảnh hưởng đông máu — báo bác sĩ trước mổ.' },
  { label: 'Vitamin D3', note: 'Thiếu phổ biến. Liều 1.000–2.000 IU/ngày an toàn. Kiểm tra 25(OH)D máu trước bổ sung liều cao.' },
  { label: 'Magie', note: 'Giúp ngủ, giảm chuột rút. Magie glycinate/citrate hấp thu tốt. Liều > 350mg/ngày → tiêu chảy.' },
  { label: 'Probiotics', note: 'Hỗ trợ đường ruột sau kháng sinh. Uống cách kháng sinh 2 giờ.' },
  { label: 'Sắt', note: 'Chỉ bổ sung khi có chỉ định thiếu máu. Thừa sắt gây táo bón, có hại cho gan.' },
  { label: 'Canxi', note: 'Hấp thu tốt nhất từ thực phẩm. Bổ sung: canxi citrate tốt hơn carbonate. Không uống cùng sắt.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-med-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-med-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthMedSafetyPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eMedOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eMedOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💊</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">An Toàn Thuốc</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Dùng thuốc đúng cách · Tránh rủi ro
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Thuốc chữa bệnh khi dùng đúng, nhưng gây hại khi dùng sai. Hiểu đúng về thuốc — bao gồm thuốc kê đơn, OTC, và thực phẩm chức năng — là kỹ năng bảo vệ sức khỏe thiết yếu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop" alt="An toàn thuốc" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Dùng đúng thuốc · Đúng liều · Đúng lúc
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Quy Tắc An Toàn Thuốc</h2>
        <p className="text-muted text-base mb-6">Áp dụng mỗi khi bắt đầu một loại thuốc mới.</p>
        <div className="space-y-4">
          {MED_RULES.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5 flex gap-4 hover:border-emerald-500/30 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `rgba(${RGB},0.12)` }}>{r.icon}</div>
              <div>
                <div className="font-bold text-text mb-1">{r.num}. {r.title}</div>
                <p className="text-base text-muted">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Những Câu Nguy Hiểm Cần Nhớ</h2>
        <p className="text-muted text-base mb-6">Những quan niệm phổ biến nhưng sai — và tại sao chúng nguy hiểm.</p>
        <div className="space-y-3">
          {DANGER_PHRASES.map((d, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="font-bold text-base text-amber-400 mb-2">"{d.phrase}"</div>
              <p className="text-sm text-muted flex gap-2"><span className="text-red-400 shrink-0">⚠</span>{d.risk}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Hướng Dẫn Bổ Sung Thực Phẩm Chức Năng</h2>
        <p className="text-muted text-base mb-6">TPCN không phải thuốc nhưng cũng cần dùng đúng cách. Luôn thông báo cho bác sĩ tất cả TPCN đang dùng.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPLEMENT_CHECK.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 hover:border-emerald-500/30 transition-colors">
              <div className="font-bold text-base text-text mb-1">{s.label}</div>
              <p className="text-sm text-muted">{s.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Luôn Nói Với Bác Sĩ / Dược Sĩ</h3>
          <ul className="space-y-2 text-base text-muted">
            <li>• Tất cả thuốc đang dùng (kể cả OTC, vitamin, thảo dược)</li>
            <li>• Dị ứng thuốc đã gặp trước đây</li>
            <li>• Đang mang thai, cho con bú, hoặc có kế hoạch mang thai</li>
            <li>• Bệnh nền: gan, thận, tim — ảnh hưởng lớn đến lựa chọn và liều thuốc</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-sm text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục sức khỏe. Không thay thế tư vấn của bác sĩ hoặc dược sĩ.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
