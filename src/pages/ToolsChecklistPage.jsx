import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f97316';
const RGB = '249,115,22';
const ORBIT_ID = 'f-cl-orbit-kf';
const ORBIT_CLASS = 'f-cl-orbit-ring';

const DAILY_ITEMS = [
  { label: 'Vận động ít nhất 10 phút', icon: '🏃', cat: 'A', tip: 'Bất kỳ: đi bộ, tập, leo cầu thang đều tính' },
  { label: 'Ăn đủ 1 nguồn đạm mỗi bữa chính', icon: '🥩', cat: 'B', tip: 'Thịt/cá/trứng/đậu phụ — chọn 1 nguồn là đủ' },
  { label: 'Ăn ít nhất 2 phần rau/trái cây', icon: '🥗', cat: 'B', tip: '1 nắm tay = 1 phần. Ăn đa màu sắc càng tốt' },
  { label: 'Uống đủ nước (cân nặng × 35 ml)', icon: '💧', cat: 'C', tip: '70 kg → 2,450 ml. Tốt nhất chia đều cả ngày' },
  { label: 'Chuẩn bị ngủ sớm hơn tối qua', icon: '😴', cat: 'C', tip: 'Tắt màn hình 30 phút trước khi ngủ' },
  { label: 'Dành 3–5 phút thở/chậm lại', icon: '🧘', cat: 'D', tip: 'Box breathing 4-4-4-4 hoặc đơn giản là ngồi yên' },
];

const WEEKLY_TARGETS = [
  { label: 'Buổi tập sức mạnh', target: '2–4 buổi', icon: '💪', unit: 'buổi' },
  { label: 'Buổi cardio/đi bộ dài', target: '2–5 buổi', icon: '🚶', unit: 'buổi' },
  { label: 'Ngày ăn đủ rau', target: '≥ 5 ngày', icon: '🥦', unit: 'ngày' },
  { label: 'Ngày ngủ ≥ 7 tiếng', target: '≥ 4 ngày', icon: '😴', unit: 'ngày' },
  { label: 'Ngày có calm practice', target: '≥ 4 ngày', icon: '🧘', unit: 'ngày' },
  { label: 'Ngày ghi nhật ký', target: '≥ 5 ngày', icon: '📝', unit: 'ngày' },
];

const REVIEW_QS = [
  'Điều gì hoạt động tốt tuần này?',
  'Điều gì khó nhất và vì sao?',
  'Tuần sau cần thay đổi gì?',
  'Mức năng lượng tổng thể tuần này (1–10)?',
];

const LS_DAILY = 'healthapp_f_daily';
const LS_WEEKLY = 'healthapp_f_weekly';
const LS_REVIEW = 'healthapp_f_review';

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

export default function ToolsChecklistPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [daily, setDaily] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(LS_DAILY) || '{}'); return s[today] || []; } catch { return []; }
  });
  const [weekly, setWeekly] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_WEEKLY) || '{}'); } catch { return {}; }
  });
  const [review, setReview] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_REVIEW) || '{}'); } catch { return {}; }
  });
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-cl-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fClOrbitSpin { to { --f-cl-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-cl-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fClOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const toggleDaily = (idx) => {
    const next = daily.includes(idx) ? daily.filter(i => i !== idx) : [...daily, idx];
    setDaily(next);
    const all = JSON.parse(localStorage.getItem(LS_DAILY) || '{}');
    all[today] = next;
    localStorage.setItem(LS_DAILY, JSON.stringify(all));
  };

  const setWeeklyVal = (idx, val) => {
    const n = { ...weekly, [idx]: val };
    setWeekly(n);
    localStorage.setItem(LS_WEEKLY, JSON.stringify(n));
  };

  const setReviewVal = (idx, val) => {
    const n = { ...review, [idx]: val };
    setReview(n);
    localStorage.setItem(LS_REVIEW, JSON.stringify(n));
  };

  const dailyPct = Math.round((daily.length / DAILY_ITEMS.length) * 100);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Checklist Ngày &amp; Tuần</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            6 mục hàng ngày · 6 chỉ tiêu hàng tuần · Review cuối tuần
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Checklist tối giản giúp bạn duy trì 6 hành vi quan trọng nhất mỗi ngày. Mỗi tick là một bước nhỏ xây dựng thói quen bền vững.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Checklist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            6 hành vi · mỗi ngày · không quá 5 phút để tick
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Daily checklist */}
      <RevealBlock delay={0} className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Checklist Hôm Nay</h2>
          <span className="text-base font-bold" style={{ color: COLOR }}>{daily.length}/{DAILY_ITEMS.length} mục</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-border mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${dailyPct}%`, background: COLOR }} />
        </div>
        <div className="space-y-2">
          {DAILY_ITEMS.map((item, i) => (
            <button key={i} onClick={() => toggleDaily(i)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all"
              style={{ borderColor: daily.includes(i) ? `rgba(${RGB},0.4)` : 'rgba(255,255,255,0.08)', background: daily.includes(i) ? `rgba(${RGB},0.08)` : 'rgba(255,255,255,0.02)' }}>
              <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: daily.includes(i) ? COLOR : 'rgba(255,255,255,0.3)', background: daily.includes(i) ? COLOR : 'transparent' }}>
                {daily.includes(i) && <span className="text-black text-sm font-black">✓</span>}
              </div>
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-base font-medium text-text" style={{ textDecoration: daily.includes(i) ? 'line-through' : 'none', opacity: daily.includes(i) ? 0.6 : 1 }}>{item.label}</div>
                <div className="text-sm text-muted mt-0.5">{item.tip}</div>
              </div>
            </button>
          ))}
        </div>
        {daily.length === DAILY_ITEMS.length && (
          <div className="mt-4 p-4 rounded-2xl text-center" style={{ background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.3)` }}>
            <div className="text-3xl mb-1">🎉</div>
            <div className="font-bold text-base" style={{ color: COLOR }}>Hoàn thành checklist ngày hôm nay! Tuyệt vời.</div>
          </div>
        )}
      </RevealBlock>

      {/* Weekly tracker */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Tracker Hàng Tuần</h2>
        <p className="text-muted text-base mb-6">Nhập số liệu thực tế tuần này. Không cần hoàn hảo — chỉ cần trung thực.</p>
        <div className="space-y-3">
          {WEEKLY_TARGETS.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-base font-medium text-text">{item.label}</div>
                  <div className="text-sm text-muted">Mục tiêu: {item.target}</div>
                </div>
                <input
                  type="number" min="0" max="7"
                  value={weekly[i] ?? ''}
                  onChange={e => setWeeklyVal(i, e.target.value)}
                  placeholder="0"
                  className="w-16 text-center px-2 py-1.5 rounded-xl text-base font-bold border bg-transparent"
                  style={{ borderColor: `rgba(${RGB},0.3)`, color: COLOR }}
                />
              </div>
              <div className="text-sm text-muted text-right">{item.unit} đã thực hiện</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Weekly review */}
      <RevealBlock delay={2} className="mb-12">
        <button onClick={() => setReviewOpen(o => !o)}
          className="w-full flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:bg-white/5 transition-colors">
          <div>
            <div className="font-bold text-text text-left">Review Cuối Tuần</div>
            <div className="text-sm text-muted mt-0.5">4 câu hỏi · ~5 phút · cải thiện tuần sau</div>
          </div>
          <span className="text-muted">{reviewOpen ? '▲' : '▼'}</span>
        </button>
        {reviewOpen && (
          <div className="mt-3 rounded-2xl border border-border bg-surface p-5 space-y-4">
            {REVIEW_QS.map((q, i) => (
              <div key={i}>
                <label className="text-base font-medium text-text block mb-2">{i + 1}. {q}</label>
                <textarea
                  value={review[i] ?? ''}
                  onChange={e => setReviewVal(i, e.target.value)}
                  rows={2}
                  placeholder="Nhập câu trả lời..."
                  className="w-full px-3 py-2 rounded-xl border bg-transparent text-base text-text placeholder-muted resize-none focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }}
                />
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* Tips */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3" style={{ color: COLOR }}>💡 Tips Sử Dụng Checklist</h3>
          <ul className="space-y-2 text-base text-muted">
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Tick checklist vào buổi tối trước khi ngủ, không cần tick ngay khi làm</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Mục tiêu là ≥ 5/6 mỗi ngày. 6/6 mỗi ngày là không thực tế lâu dài</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Nếu liên tục bỏ 1 mục — đó là tín hiệu cần điều chỉnh, không phải thất bại</li>
            <li className="flex gap-2"><span style={{ color: COLOR }}>→</span>Review tuần là thời điểm để học hỏi, không phải để chỉ trích bản thân</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>
    </div>
  );
}
