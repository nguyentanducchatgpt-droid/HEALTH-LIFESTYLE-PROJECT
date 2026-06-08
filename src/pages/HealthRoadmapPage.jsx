import { useEffect, useState } from 'react';
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
    desc: 'Xây dựng baseline cá nhân: đo các chỉ số, hiểu các con số, lập hồ sơ sức khỏe.',
    goals: [
      'Hoàn thành hồ sơ sức khỏe E0 (tuổi, cân nặng, chiều cao, vòng eo)',
      'Đo BMI, vòng eo, nhịp tim nghỉ, huyết áp (nếu có máy)',
      'Đọc qua 6 chỉ số sinh hóa quan trọng (BMI, HA, đường huyết, mỡ máu, HbA1c, vòng eo)',
      'Lên lịch khám sức khỏe định kỳ nếu chưa khám trong 1 năm',
    ],
    milestone: 'Hoàn thành bài Đánh Giá Sức Khỏe và biết điểm mạnh/yếu của mình',
  },
  {
    phase: 2,
    title: 'Hành Động — Theo Dõi Hàng Ngày',
    weeks: 'Tuần 3–6',
    color: '#22c55e',
    desc: 'Bắt đầu theo dõi các chỉ số quan trọng và check-in hàng ngày để xây thói quen.',
    goals: [
      'Cân sức khỏe 1 lần/tuần, ghi chép cân nặng',
      'Đo huyết áp 2 lần/tuần nếu có máy (sáng và tối)',
      'Bắt đầu Daily Check-in: 5 câu hỏi mỗi sáng',
      'Học cách nhận biết 4 dấu hiệu cần cấp cứu (quy tắc FAST, nhồi máu cơ tim)',
      'Cập nhật lịch tiêm vaccine còn thiếu',
    ],
    milestone: '4 tuần theo dõi liên tục không bỏ ngày nào',
  },
  {
    phase: 3,
    title: 'Tối Ưu — Phòng Bệnh Chủ Động',
    weeks: 'Tuần 7–10',
    color: '#f59e0b',
    desc: 'Áp dụng kiến thức để thay đổi lối sống tích cực và phòng ngừa các bệnh mãn tính.',
    goals: [
      'Thực hiện ít nhất 3/5 trụ cột phòng bệnh (vận động, dinh dưỡng, ngủ, stress, không hút thuốc)',
      'Hoàn thành gói khám cơ bản hàng năm và lưu kết quả',
      'Học cách lọc thông tin y tế (5 câu hỏi kiểm tra nguồn)',
      'Hiểu đúng về an toàn thuốc và TPCN đang dùng',
      'Chia sẻ kiến thức với gia đình',
    ],
    milestone: 'Khám sức khỏe xong, có kết quả xét nghiệm cơ bản',
  },
  {
    phase: 4,
    title: 'Bền Vững — Lối Sống Dài Hạn',
    weeks: 'Tuần 11–12+',
    color: '#a855f7',
    desc: 'Duy trì và cá nhân hóa chương trình sức khỏe cho suốt đời.',
    goals: [
      'Thiết lập lịch khám định kỳ tự động (nhắc nhở hàng năm)',
      'Review điểm Đánh Giá Sức Khỏe mỗi 3 tháng',
      'Điều chỉnh mục tiêu dựa trên kết quả xét nghiệm',
      'Mở rộng kiến thức sang các chuyên đề chuyên sâu hơn',
      'Hỗ trợ người thân trong gia đình xây dựng lối sống lành mạnh',
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
  const [openPhase, setOpenPhase] = useState(0);

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
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🗺️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Lộ Trình Kiến Thức Sức Khỏe</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            12 tuần · 4 giai đoạn · Từ hiểu đến hành động
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Lộ trình có hệ thống từ việc hiểu các chỉ số cơ bản, theo dõi thường xuyên, phòng bệnh chủ động, đến duy trì lối sống lành mạnh bền vững suốt đời.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Lộ trình sức khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Từ kiến thức → hành động → bền vững
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lộ Trình 12 Tuần</h2>
        <p className="text-muted text-base mb-6">Nhấn vào từng giai đoạn để xem mục tiêu chi tiết và milestone.</p>
        <div className="space-y-3">
          {PHASES.map((ph, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpenPhase(openPhase === i ? null : i)} className="w-full p-4 text-left hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black" style={{ background: `${ph.color}20`, color: ph.color }}>
                    P{ph.phase}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-text">{ph.title}</div>
                    <div className="text-sm text-muted mt-0.5">{ph.weeks}</div>
                  </div>
                  <span className="text-muted">{openPhase === i ? '▲' : '▼'}</span>
                </div>
              </button>
              {openPhase === i && (
                <div className="px-4 pb-5 border-t border-border pt-4 space-y-4">
                  <p className="text-base text-muted">{ph.desc}</p>
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: ph.color }}>Mục Tiêu</div>
                    <ul className="space-y-1.5">
                      {ph.goals.map((g, j) => (
                        <li key={j} className="flex gap-2 text-base text-muted">
                          <span style={{ color: ph.color }} className="shrink-0">→</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl p-3 border-l-2 text-base" style={{ borderColor: ph.color, background: `${ph.color}10` }}>
                    <strong style={{ color: ph.color }}>Milestone: </strong><span className="text-muted">{ph.milestone}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Tất Cả Chuyên Đề</h2>
        <p className="text-muted text-base mb-6">Khám phá từng chủ đề theo thứ tự lộ trình hoặc nhảy vào bất kỳ chuyên đề nào bạn quan tâm.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUB_LINKS.map((s, i) => (
            <Link key={i} to={s.to} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 hover:border-purple-500/30 transition-colors group">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-base font-medium text-text group-hover:text-white transition-colors">{s.title}</span>
              <span className="ml-auto text-muted group-hover:text-text transition-colors text-base">→</span>
            </Link>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-10">
        <div className="rounded-2xl border p-5 text-center" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-bold text-text mb-2">Bắt Đầu Ngay Hôm Nay</h3>
          <p className="text-base text-muted mb-4">Làm bài đánh giá để biết điểm xuất phát của bạn, sau đó theo lộ trình từng bước.</p>
          <Link to="/pillar/e/assessment" className="inline-block px-6 py-2.5 rounded-xl text-base font-bold text-white" style={{ background: COLOR }}>
            Làm Bài Đánh Giá →
          </Link>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-sm text-muted mb-6">⚠ Nội dung mang tính giáo dục sức khỏe. Luôn tham khảo ý kiến bác sĩ cho các quyết định y tế quan trọng.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
