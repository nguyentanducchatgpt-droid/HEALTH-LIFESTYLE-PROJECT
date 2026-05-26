import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'c-deload-orbit-kf';
const ORBIT_PROP = '--c-deload-angle';
const ORBIT_CLASS = 'c-deload-orbit-ring';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = document.createElement('div');
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    const ref = { current: null };
    return () => ob.disconnect();
  }, []);
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

const SIGNALS = [
  { icon: '😴', title: 'Mệt mỏi kéo dài', desc: 'Sau 7–9h ngủ vẫn thức dậy không sảng khoái, cảm giác nặng nề suốt ngày.', severity: 'cao' },
  { icon: '📉', title: 'Hiệu suất sụt giảm', desc: 'Cân nặng quen thuộc trở nên khó hơn, cardio cùng pace mà tim đập nhanh hơn.', severity: 'cao' },
  { icon: '😤', title: 'Cáu bẳn, mất động lực', desc: 'Không muốn đến phòng tập, mọi thứ đều khó chịu, cảm xúc thất thường.', severity: 'trung bình' },
  { icon: '🤕', title: 'Đau nhức lan rộng', desc: 'Khớp, gân, cơ đau không rõ vị trí. Đau kéo dài hơn 48h sau buổi tập.', severity: 'cao' },
  { icon: '🛌', title: 'Ngủ không ngon', desc: 'Khó ngủ, ngủ chập chờn hoặc ngủ quá nhiều nhưng vẫn mệt.', severity: 'trung bình' },
  { icon: '🤒', title: 'Hay ốm vặt', desc: 'Hệ miễn dịch suy yếu: cảm cúm, viêm họng xuất hiện thường xuyên hơn bình thường.', severity: 'trung bình' },
  { icon: '🫀', title: 'Nhịp tim nghỉ tăng', desc: 'Sáng ngủ dậy đo nhịp tim cao hơn baseline 5–7 bpm trong 2–3 ngày liên tiếp.', severity: 'cao' },
];

const METHODS = [
  {
    id: 'volume',
    icon: '🔽',
    title: 'Giảm Volume (Phổ biến nhất)',
    desc: 'Giữ nguyên cường độ, giảm 40–60% tổng khối lượng tập.',
    howto: ['Giữ tạ nặng như thường', 'Giảm số set từ 4 → 2, số rep từ 12 → 8', 'Bỏ bớt 1–2 bài phụ', 'Thời gian tập ngắn hơn 30–40%'],
    best: 'Người tập sức mạnh, powerlifter',
    color: '#f97316',
  },
  {
    id: 'intensity',
    icon: '🎯',
    title: 'Giảm Intensity',
    desc: 'Giữ nguyên volume, giảm tạ xuống 50–60% 1RM.',
    howto: ['Số set và rep giữ nguyên', 'Giảm tạ xuống còn 50–60% max', 'Tập với tốc độ chậm hơn, kiểm soát nhiều hơn', 'Tập trung vào kỹ thuật'],
    best: 'Người tập hypertrophy, bodybuilder',
    color: '#06b6d4',
  },
  {
    id: 'frequency',
    icon: '📅',
    title: 'Giảm Tần Suất',
    desc: 'Giảm số buổi tập trong tuần, duy trì cường độ và volume mỗi buổi.',
    howto: ['Từ 5 buổi/tuần → 3 buổi', 'Mỗi buổi tập vẫn như thường', 'Ngày nghỉ thêm là active recovery', 'Tập full-body thay split routine'],
    best: 'Người tập 4–6 ngày/tuần',
    color: '#10b981',
  },
  {
    id: 'active',
    icon: '🚶',
    title: 'Active Deload',
    desc: 'Thay thế buổi tập bằng hoạt động nhẹ nhàng, vui vẻ.',
    howto: ['Bơi lội, đi bộ, yoga nhẹ', 'Không có mục tiêu hiệu suất', 'Chơi thể thao giải trí', 'Đi bộ trong thiên nhiên'],
    best: 'Người tập cardio nhiều, cần phục hồi tâm lý',
    color: '#a78bfa',
  },
];

const FREQUENCY = [
  { level: 'Mới bắt đầu (< 1 năm)', freq: 'Mỗi 8–10 tuần', duration: '1 tuần', note: 'Cơ thể vẫn đang thích nghi, ít cần deload' },
  { level: 'Trung cấp (1–3 năm)', freq: 'Mỗi 6–8 tuần', duration: '1 tuần', note: 'Bắt đầu cảm nhận được dấu hiệu rõ ràng hơn' },
  { level: 'Nâng cao (3–5 năm)', freq: 'Mỗi 4–6 tuần', duration: '1–2 tuần', note: 'Mỗi mesocycle nên kết thúc bằng deload' },
  { level: 'Elite (> 5 năm)', freq: 'Mỗi 3–4 tuần', duration: '1–2 tuần', note: 'Deload là phần không thể thiếu của lập kế hoạch' },
];

const DELOAD_WEEK = [
  { day: 'Thứ 2', type: 'Tập giảm volume', detail: 'Upper body: giảm 50% set, giữ tạ', intensity: 'light' },
  { day: 'Thứ 3', type: 'Active recovery', detail: 'Đi bộ 30 phút + foam rolling', intensity: 'very-light' },
  { day: 'Thứ 4', type: 'Tập giảm volume', detail: 'Lower body: giảm 50% set, giữ tạ', intensity: 'light' },
  { day: 'Thứ 5', type: 'Nghỉ hoàn toàn', detail: 'Stretching nhẹ, đi dạo 20 phút', intensity: 'rest' },
  { day: 'Thứ 6', type: 'Full-body nhẹ', detail: 'Compound movements @ 60% 1RM, 2×8', intensity: 'light' },
  { day: 'Thứ 7', type: 'Active leisure', detail: 'Bơi, leo núi, đạp xe → vui là chính', intensity: 'very-light' },
  { day: 'Chủ nhật', type: 'Nghỉ hoàn toàn', detail: 'Ngủ đủ giấc, chuẩn bị tinh thần tuần mới', intensity: 'rest' },
];

const INTENSITY_COLOR = { light: '#f97316', 'very-light': '#10b981', rest: '#6b7280' };

export default function LifestyleDeloadPage() {
  const [openSignal, setOpenSignal] = useState(null);
  const [openMethod, setOpenMethod] = useState('volume');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cDeloadOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cDeloadOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const activeMethod = METHODS.find(m => m.id === openMethod);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      {/* Breadcrumb */}
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-xs text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>⚡</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Deload & Phục Hồi Chủ Động</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C5 · Deload</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Deload không phải lười biếng — đó là chiến lược. Những tuần giảm tải được lên kế hoạch chính là nơi bạn thực sự mạnh hơn, vì cơ thể có thời gian siêu bù để phát triển vượt mức ban đầu.</p>
        </div>
      </div>

      {/* Hero image */}
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop" alt="Deload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Deload = Đầu Tư Cho Tương Lai</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why deload */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Cần Deload?</h2>
        <p className="text-muted text-sm mb-6">Tập luyện = kích thích. Nghỉ ngơi = thích nghi. Thiếu nghỉ = không tiến bộ.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🔬', title: 'Siêu bù (Supercompensation)', desc: 'Sau stress → cơ thể phục hồi vượt mức cũ. Không có stress → không có lý do để mạnh hơn.' },
            { icon: '🧠', title: 'Phục hồi hệ thần kinh', desc: 'CNS mệt mỏi không thể nhìn thấy như mệt cơ. Deload cho hệ thần kinh "reboot" hoàn toàn.' },
            { icon: '🦴', title: 'Gân & khớp cần thời gian', desc: 'Gân và dây chằng phục hồi chậm hơn cơ 3–5 lần. Không deload = tích lũy vi chấn thương.' },
          ].map(item => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface p-5" style={{ borderColor: `rgba(${RGB},0.15)` }}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-sm font-bold text-text mb-2">{item.title}</div>
              <div className="text-xs text-muted leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7 Signals */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>7 Dấu Hiệu Cần Deload Ngay</h2>
        <p className="text-muted text-sm mb-6">Khi nhận thấy 3+ dấu hiệu này, đừng "cố" — hãy deload có kế hoạch.</p>
        <div className="space-y-2">
          {SIGNALS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden" style={{ borderColor: openSignal === i ? `rgba(${RGB},0.3)` : undefined }}>
              <button onClick={() => setOpenSignal(openSignal === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-2xl">{s.icon}</span>
                <span className="flex-1 text-sm font-medium text-text">{s.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: s.severity === 'cao' ? `rgba(${RGB},0.15)` : 'rgba(107,114,128,0.15)', color: s.severity === 'cao' ? COLOR : '#9ca3af' }}>
                  {s.severity === 'cao' ? '⚠️ Cao' : '⚡ TB'}
                </span>
                <span className="text-muted text-xs">{openSignal === i ? '▲' : '▼'}</span>
              </button>
              {openSignal === i && (
                <div className="px-4 pb-4 pt-0">
                  <div className="ml-10 text-sm text-muted leading-relaxed border-t border-border pt-3">{s.desc}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 4 Methods */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>4 Phương Pháp Deload</h2>
        <p className="text-muted text-sm mb-6">Chọn phương pháp phù hợp với mục tiêu và lịch tập của bạn.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {METHODS.map(m => (
            <button key={m.id} onClick={() => setOpenMethod(m.id)} className={`rounded-xl p-3 text-left transition-all border ${openMethod === m.id ? 'border-opacity-50' : 'border-border hover:border-opacity-30'}`} style={{ background: openMethod === m.id ? `rgba(${RGB},0.1)` : undefined, borderColor: openMethod === m.id ? COLOR : undefined }}>
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-xs font-bold" style={{ color: openMethod === m.id ? COLOR : '#9ca3af' }}>{m.title.split('(')[0].trim()}</div>
            </button>
          ))}
        </div>
        {activeMethod && (
          <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeMethod.icon}</span>
              <div>
                <div className="text-base font-bold text-text">{activeMethod.title}</div>
                <div className="text-sm text-muted">{activeMethod.desc}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Cách Thực Hiện</div>
                <ul className="space-y-1">
                  {activeMethod.howto.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text"><span style={{ color: COLOR }}>→</span>{h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLOR }}>Phù Hợp Nhất Cho</div>
                <div className="rounded-xl p-3 text-sm text-muted" style={{ background: `rgba(${RGB},0.08)` }}>{activeMethod.best}</div>
              </div>
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Frequency by level */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Tần Suất Deload Theo Trình Độ</h2>
        <p className="text-muted text-sm mb-6">Càng tập lâu năm, cơ thể càng cần deload thường xuyên hơn.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted">Trình Độ</th>
                <th className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted">Chu Kỳ</th>
                <th className="text-left py-3 pr-4 text-xs font-bold uppercase tracking-widest text-muted">Thời Gian</th>
                <th className="text-left py-3 text-xs font-bold uppercase tracking-widest text-muted">Ghi Chú</th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY.map((f, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                  <td className="py-3 pr-4 font-medium text-text">{f.level}</td>
                  <td className="py-3 pr-4" style={{ color: COLOR }}>{f.freq}</td>
                  <td className="py-3 pr-4 text-text">{f.duration}</td>
                  <td className="py-3 text-muted text-xs">{f.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      {/* Sample deload week */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Mẫu Tuần Deload</h2>
        <p className="text-muted text-sm mb-6">Kế hoạch 7 ngày cho người tập 4–5 buổi/tuần (Giảm Volume).</p>
        <div className="space-y-2">
          {DELOAD_WEEK.map((d, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl p-3 border border-border bg-surface hover:border-opacity-30 transition-colors" style={{ borderColor: d.intensity !== 'rest' ? `rgba(${RGB},0.1)` : undefined }}>
              <div className="w-16 text-xs font-bold text-center shrink-0" style={{ color: COLOR }}>{d.day}</div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: INTENSITY_COLOR[d.intensity] }} />
              <div className="flex-1">
                <div className="text-sm font-medium text-text">{d.type}</div>
                <div className="text-xs text-muted">{d.detail}</div>
              </div>
              <div className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${INTENSITY_COLOR[d.intensity]}20`, color: INTENSITY_COLOR[d.intensity] }}>
                {d.intensity === 'light' ? 'Nhẹ' : d.intensity === 'very-light' ? 'Rất nhẹ' : 'Nghỉ'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-4 text-sm text-muted border border-border" style={{ background: `rgba(${RGB},0.05)` }}>
          💡 <strong style={{ color: COLOR }}>Dinh dưỡng trong tuần deload:</strong> Giữ nguyên protein. Có thể giảm nhẹ carb nếu thấy khó chịu với việc ăn nhiều mà tập ít hơn. Không cần "ăn ít đi" — cơ thể đang sửa chữa và cần dưỡng chất.
        </div>
      </RevealBlock>

      {/* Key quote */}
      <RevealBlock className="mb-12">
        <blockquote className="rounded-2xl p-6 border-l-4 relative overflow-hidden" style={{ borderLeftColor: COLOR, background: `rgba(${RGB},0.05)` }}>
          <div className="text-4xl absolute right-6 top-4 opacity-10" style={{ color: COLOR }}>"</div>
          <p className="text-lg font-medium text-text leading-relaxed italic">"Người giỏi nhất không phải là người tập nhiều nhất — mà là người biết khi nào cần dừng để tăng tốc."</p>
          <cite className="text-xs text-muted mt-3 block">— Nguyên tắc tập luyện dài hạn</cite>
        </blockquote>
      </RevealBlock>

      {/* Footer nav */}
      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/recovery" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Phục Hồi Chủ Động
        </Link>
        <Link to="/pillar/c" className="text-sm text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/breathing" className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group justify-end">
          Kỹ Thuật Thở
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
