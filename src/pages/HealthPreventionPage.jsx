import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'e-prev-orbit-kf';
const ORBIT_CLASS = 'e-prev-orbit-ring';
const ORBIT_PROP = '--e-prev-orbit-angle';

const PREVENTION_PILLARS = [
  {
    icon: '🏃',
    title: 'Vận Động Đủ',
    color: '#22c55e',
    items: [
      '150 phút/tuần cường độ vừa (đi bộ nhanh, bơi lội, đạp xe)',
      'Hoặc 75 phút/tuần cường độ cao (chạy, aerobics)',
      '2 ngày/tuần tập sức mạnh tất cả nhóm cơ chính',
      'Giảm thời gian ngồi — đứng dậy đi lại mỗi 30–60 phút',
    ],
    evidence: 'Giảm 35% nguy cơ bệnh tim mạch, 25% nguy cơ ung thư đại tràng, 50% nguy cơ tiểu đường type 2',
  },
  {
    icon: '🥗',
    title: 'Dinh Dưỡng Cân Bằng',
    color: '#84cc16',
    items: [
      'Ăn ≥ 5 phần rau/trái cây mỗi ngày',
      'Ưu tiên ngũ cốc nguyên hạt thay bột trắng',
      'Hạn chế thịt đỏ chế biến sẵn (< 500g/tuần)',
      'Giảm muối (< 5g/ngày), đường thêm (< 25g/ngày)',
      'Ăn cá béo 2 lần/tuần',
    ],
    evidence: 'Chế độ ăn lành mạnh giảm 80% nguy cơ bệnh tim mạch sớm',
  },
  {
    icon: '😴',
    title: 'Ngủ Đủ Chất Lượng',
    color: '#8b5cf6',
    items: [
      'Ngủ 7–9 tiếng/đêm (người trưởng thành)',
      'Đi ngủ và thức dậy cùng giờ mỗi ngày kể cả cuối tuần',
      'Tắt màn hình 1 giờ trước khi ngủ',
      'Nhiệt độ phòng 18–21°C tối ưu cho giấc ngủ',
    ],
    evidence: 'Ngủ < 6h/đêm tăng 200% nguy cơ cảm lạnh, tăng 48% nguy cơ bệnh tim',
  },
  {
    icon: '🧘',
    title: 'Quản Lý Stress',
    color: '#a855f7',
    items: [
      'Thực hành kỹ thuật thư giãn hàng ngày (thở sâu, thiền)',
      'Duy trì kết nối xã hội và quan hệ hỗ trợ',
      'Đặt ranh giới công việc — nghỉ đủ giờ',
      'Tìm kiếm hỗ trợ tâm lý khi cần thiết',
    ],
    evidence: 'Stress mãn tính tăng nguy cơ bệnh tim 40%, làm suy yếu hệ miễn dịch',
  },
  {
    icon: '🚭',
    title: 'Không Hút Thuốc & Hạn Chế Rượu',
    color: '#ef4444',
    items: [
      'Không hút thuốc lá — không có mức "an toàn"',
      'Hạn chế rượu: ≤ 1 đơn vị/ngày nữ, ≤ 2 đơn vị/ngày nam',
      '1 đơn vị = 350ml bia 5% = 150ml rượu vang = 45ml rượu mạnh',
      'Tránh hút thuốc thụ động hoàn toàn',
    ],
    evidence: 'Hút thuốc gây 30% tử vong do ung thư. Bỏ thuốc giúp sống thêm 10 năm',
  },
];

const VACCINE_SCHEDULE = [
  { vaccine: 'Cúm mùa', frequency: 'Hàng năm', who: 'Tất cả người lớn' },
  { vaccine: 'COVID-19', frequency: 'Theo khuyến cáo hiện tại', who: 'Tất cả người lớn' },
  { vaccine: 'Tdap (Bạch hầu, Uốn ván, Ho gà)', frequency: 'Nhắc lại mỗi 10 năm', who: 'Tất cả người lớn' },
  { vaccine: 'Viêm gan B', frequency: '3 mũi nếu chưa tiêm', who: 'Người chưa có miễn dịch' },
  { vaccine: 'HPV', frequency: '2–3 mũi', who: '9–45 tuổi, ưu tiên trước quan hệ tình dục' },
  { vaccine: 'Phế cầu', frequency: '1–2 mũi', who: '≥ 65 tuổi hoặc bệnh mãn tính' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-prev-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-prev-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthPreventionPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [openPillar, setOpenPillar] = useState(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes ePrevOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: ePrevOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🛡️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Phòng Bệnh Chủ Động</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Phòng bệnh hơn chữa bệnh
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            80% các bệnh mãn tính phổ biến (tim mạch, tiểu đường type 2, một số ung thư) có thể phòng ngừa hoặc trì hoãn bằng lối sống. Đầu tư vào phòng bệnh hiệu quả gấp 10 lần so với chi phí điều trị.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="Phòng bệnh" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            5 trụ cột phòng bệnh chủ động
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age < 30 ? 'Thời điểm tốt nhất để xây nền tảng phòng bệnh bền vững.' : b0.age < 50 ? 'Giai đoạn quan trọng — đầu tư sức khỏe bây giờ để hưởng lợi 20–30 năm tới.' : 'Phòng bệnh vẫn rất có giá trị ở mọi độ tuổi — không bao giờ là quá muộn.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Trụ Cột Phòng Bệnh</h2>
        <p className="text-muted text-lg mb-6">Nhấn vào từng trụ cột để xem chi tiết và bằng chứng khoa học.</p>
        <div className="space-y-3">
          {PREVENTION_PILLARS.map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button
                onClick={() => setOpenPillar(openPillar === i ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-3xl">{p.icon}</span>
                <span className="font-bold text-text flex-1">{p.title}</span>
                <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                <span className="text-muted ml-1">{openPillar === i ? '▲' : '▼'}</span>
              </button>
              {openPillar === i && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <ul className="space-y-1">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex gap-2 text-lg text-muted">
                        <span style={{ color: p.color }} className="shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl p-3 text-base border-l-2 text-muted" style={{ borderColor: p.color }}>
                    <strong style={{ color: p.color }}>Bằng chứng: </strong>{p.evidence}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lịch Tiêm Vaccine Người Lớn</h2>
        <p className="text-muted text-lg mb-6">Vaccine không chỉ dành cho trẻ em — người lớn cũng cần cập nhật lịch tiêm định kỳ.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-bold text-text">Vaccine</th>
                <th className="text-left py-3 px-3 font-bold text-text">Tần suất</th>
                <th className="text-left py-3 px-3 font-bold text-text">Đối tượng</th>
              </tr>
            </thead>
            <tbody>
              {VACCINE_SCHEDULE.map((v, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-3 font-medium text-text">{v.vaccine}</td>
                  <td className="py-3 px-3 text-muted">{v.frequency}</td>
                  <td className="py-3 px-3 text-muted">{v.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Tầm Soát Ung Thư Theo Tuổi</h3>
          <div className="space-y-2 text-lg text-muted">
            <p>• <strong className="text-text">Ung thư đại tràng:</strong> Nội soi bắt đầu từ 45 tuổi, mỗi 10 năm (hoặc mỗi năm nếu FIT dương tính)</p>
            <p>• <strong className="text-text">Ung thư vú:</strong> Mamogram từ 40–45 tuổi, mỗi 1–2 năm</p>
            <p>• <strong className="text-text">Ung thư cổ tử cung:</strong> Pap smear từ 21 tuổi, mỗi 3 năm; hoặc HPV test từ 25 tuổi, mỗi 5 năm</p>
            <p>• <strong className="text-text">Ung thư phổi:</strong> CT liều thấp cho người 50–80 tuổi hút ≥ 20 gói-năm</p>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
