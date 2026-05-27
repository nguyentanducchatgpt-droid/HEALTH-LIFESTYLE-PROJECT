import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'f-rp-orbit-kf';
const ORBIT_CLASS = 'f-rp-orbit-ring';

const RESET_SCENARIOS = [
  {
    icon: '🍔', title: 'Sau 1 Ngày Ăn Lệch', color: '#f59e0b',
    trigger: 'Ăn quá nhiều, ăn thực phẩm không lành mạnh, bỏ rau hoàn toàn 1 ngày.',
    rule: 'Một ngày ăn lệch KHÔNG thể xóa đi nhiều tuần tập luyện. Đây là sự thật sinh lý học.',
    steps: [
      'Uống nhiều nước hơn bình thường hôm nay (thêm 500ml)',
      'Ăn bữa tiếp theo bình thường — không bỏ bữa, không ăn ít hơn để "bù"',
      'Thêm một ít rau vào bữa ăn bình thường tiếp theo',
      'Đi bộ nhẹ 10–15 phút nếu có thể',
      'Ghi nhật ký: điều gì dẫn đến việc ăn lệch? Có thể tránh lần sau không?',
    ],
    avoid: 'Không nhịn ăn, không "detox", không tập bù quá mức.',
  },
  {
    icon: '💤', title: 'Sau 1 Tuần Bỏ Tập', color: '#6366f1',
    trigger: 'Đi công tác, ốm, quá bận, hoặc đơn giản là mất động lực 1 tuần.',
    rule: 'Sau 1 tuần nghỉ, cơ thể vẫn giữ được hầu hết sức mạnh. Mất sức bắt đầu rõ rệt sau 2–3 tuần.',
    steps: [
      'Bắt đầu bằng bài tập nhẹ hơn 20–30% so với trước khi nghỉ',
      'Không cố "bù" — tập 5 ngày liên tiếp sau nghỉ dễ gây chấn thương',
      'Tuần đầu quay lại: 2 buổi tập thôi, cảm nhận lại cơ thể',
      'Tuần thứ 2: trở về lịch bình thường',
      'Tự hỏi: điều gì gây ra việc bỏ tập? Cần điều chỉnh lịch không?',
    ],
    avoid: 'Không tập nặng ngay lập tức. Không tự trách mình quá lâu.',
  },
  {
    icon: '😰', title: 'Sau Giai Đoạn Stress Cao', color: '#ef4444',
    trigger: 'Áp lực công việc, gia đình, sự kiện lớn trong cuộc sống dẫn đến mất ngủ và kiệt sức.',
    rule: 'Cortisol cao kéo dài không phải môi trường tốt để cơ thể phục hồi hay phát triển cơ bắp.',
    steps: [
      'Ưu tiên ngủ trước tiên — ngay cả khi chưa tập được gì',
      'Giảm cường độ tập xuống 40–50% trong 3–5 ngày đầu quay lại',
      'Tập calm practice ít nhất 5 phút/ngày (thở sâu, đi bộ thiên nhiên)',
      'Giảm caffeine tạm thời nếu đang dùng nhiều',
      'Chia sẻ với người thân hoặc ghi ra giấy — đừng gánh một mình',
    ],
    avoid: 'Không thêm áp lực tập luyện vào khi cortisol đã cao.',
  },
  {
    icon: '😴', title: 'Sau Mất Ngủ Nhiều Đêm', color: '#a855f7',
    trigger: 'Khó ngủ liên tiếp 3–5 ngày, ngủ ít hơn 5 tiếng, chất lượng ngủ rất kém.',
    rule: 'Tập tạ khi thiếu ngủ nghiêm trọng tăng nguy cơ chấn thương và không giúp phục hồi cơ.',
    steps: [
      'Ưu tiên phục hồi giấc ngủ trước — không cần tập trong 1–2 ngày đầu',
      'Đặt giờ ngủ cố định, tắt màn hình 30 phút trước khi ngủ',
      'Không ngủ trưa quá 20 phút (gây khó ngủ tối)',
      'Khi ngủ đủ giấc trở lại: bắt đầu bằng vận động nhẹ (đi bộ, giãn cơ)',
      'Theo dõi nguyên nhân: caffeine muộn? Lo lắng? Thiếu routine?',
    ],
    avoid: 'Không uống thuốc ngủ nếu không có chỉ định bác sĩ.',
  },
];

const GENERAL_RULES = [
  'Một ngày tệ không phải thất bại — đó là dữ liệu để học hỏi',
  'Lỡ nhịp là chuyện bình thường với 100% người luyện tập lâu dài',
  'Reset nhanh nhất là bắt đầu lại với mục tiêu nhỏ nhất có thể',
  'Không bao giờ bù tập bằng cách tập gấp đôi — dễ chấn thương',
  'Nếu lỡ nhịp nhiều hơn 1 lần/tuần — lịch đang quá tham vọng, cần điều chỉnh',
];

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

export default function ToolsResetProtocolPage() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-rp-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fRpOrbitSpin { to { --f-rp-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-rp-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fRpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🔄</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Reset Protocol</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Sau lỡ nhịp · Quay lại đúng cách · Không tự trách
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Ai cũng lỡ nhịp. Điều quan trọng là quay lại như thế nào. Đây là hệ thống cụ thể cho từng tình huống — không phán xét, chỉ hành động tiếp theo.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop" alt="Reset protocol" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            lỡ nhịp là bình thường · quay lại mới quan trọng
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* General mindset */}
      <RevealBlock delay={0} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-lg mb-3" style={{ color: COLOR }}>🧠 Mindset Trước Khi Reset</h3>
          <ul className="space-y-2">
            {GENERAL_RULES.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span style={{ color: COLOR }} className="shrink-0">→</span>{r}
              </li>
            ))}
          </ul>
        </div>
      </RevealBlock>

      {/* Scenarios */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: COLOR }}>4 Tình Huống Reset Thường Gặp</h2>
        <p className="text-muted text-sm mb-6">Nhấn vào tình huống bạn đang gặp để xem protocol cụ thể.</p>
        <div className="space-y-3">
          {RESET_SCENARIOS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-text">{s.title}</div>
                  <div className="text-xs text-muted mt-0.5">{s.trigger.slice(0, 60)}...</div>
                </div>
                <span className="text-muted">{open === i ? '▲' : '▼'}</span>
              </button>
              {open === i && (
                <div className="px-4 pb-5 border-t border-border pt-4 space-y-4">
                  <div className="p-3 rounded-xl text-xs" style={{ background: `${s.color}10`, borderLeft: `3px solid ${s.color}` }}>
                    <strong style={{ color: s.color }}>🔬 Sự thật:</strong> <span className="text-muted">{s.rule}</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: s.color }}>Protocol Reset</div>
                    <ol className="space-y-2">
                      {s.steps.map((step, j) => (
                        <li key={j} className="flex gap-3 text-sm text-muted">
                          <span className="font-bold shrink-0" style={{ color: s.color }}>{j + 1}.</span>{step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid #ef4444' }}>
                    <strong className="text-red-400">⛔ Tránh:</strong> <span className="text-muted">{s.avoid}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Quick reset */}
      <RevealBlock delay={2} className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: COLOR }}>⚡ Reset Ngay Lập Tức (1 Hành Động)</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { action: 'Uống 1 ly nước', why: 'Hydration là nền tảng phục hồi nhanh nhất' },
            { action: 'Đi bộ 5 phút', why: 'Kích hoạt cơ thể, cải thiện tâm trạng tức thì' },
            { action: 'Ăn 1 bữa có rau', why: 'Bắt đầu lại từ điều đơn giản nhất' },
            { action: 'Ngủ đúng giờ tối nay', why: 'Giấc ngủ là công cụ phục hồi mạnh nhất' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="font-bold text-text text-sm mb-1" style={{ color: COLOR }}>{item.action}</div>
              <div className="text-xs text-muted">{item.why}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
