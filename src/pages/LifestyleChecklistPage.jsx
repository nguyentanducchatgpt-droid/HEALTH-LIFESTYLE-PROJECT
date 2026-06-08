import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-checklist-orbit-kf';
const ORBIT_PROP = '--c-cl-angle';
const ORBIT_CLASS = 'c-cl-orbit-ring';

const STORAGE_KEY = 'lifestyle_checklist_state';
const HISTORY_KEY = 'lifestyle_checklist_history';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
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

const DAILY_ITEMS = [
  { id: 'sleep7', icon: '😴', label: 'Ngủ 7–9 tiếng', detail: 'Không tính ngủ bù cuối tuần', pillar: 'Giấc ngủ', color: '#6366f1' },
  { id: 'sleep_time', icon: '🌙', label: 'Ngủ trước 23:30', detail: 'Theo nhịp sinh học tự nhiên', pillar: 'Giấc ngủ', color: '#6366f1' },
  { id: 'sunlight', icon: '☀️', label: 'Ra ngoài đón nắng sáng', detail: 'Ít nhất 5–10 phút ánh sáng tự nhiên', pillar: 'Nhịp sinh học', color: '#f59e0b' },
  { id: 'steps', icon: '🚶', label: '8.000+ bước chân', detail: 'Hoặc 30 phút vận động nhẹ', pillar: 'NEAT', color: '#10b981' },
  { id: 'water', icon: '💧', label: 'Uống đủ nước', detail: 'Công thức: cân nặng × 35ml', pillar: 'Lối sống', color: '#0ea5e9' },
  { id: 'no_phone_morning', icon: '📵', label: 'Không phone 30 phút đầu', detail: 'Sau khi thức dậy buổi sáng', pillar: 'Môi trường', color: '#f43f5e' },
  { id: 'breathing', icon: '🌬️', label: 'Thực hành thở có chủ ý', detail: '5 phút thở cơ hoành hoặc box breathing', pillar: 'Thở', color: '#0ea5e9' },
];

const WEEKLY_QUESTIONS = [
  { id: 'wq1', icon: '⚡', question: 'Năng lượng trung bình tuần này là bao nhiêu?', options: ['Tệ — mệt mỏi thường xuyên', 'Trung bình — lên xuống thất thường', 'Tốt — ổn định trong ngày', 'Xuất sắc — tràn đầy năng lượng'] },
  { id: 'wq2', icon: '😴', question: 'Chất lượng giấc ngủ tuần này?', options: ['Khó ngủ, thức giữa chừng nhiều', 'Ngủ được nhưng không sâu', 'Ngủ tương đối tốt', 'Ngủ ngon, dậy sảng khoái'] },
  { id: 'wq3', icon: '🧘', question: 'Mức độ căng thẳng tuần này?', options: ['Rất cao — khó kiểm soát', 'Cao — ảnh hưởng sinh hoạt', 'Trung bình — có thể quản lý', 'Thấp — cân bằng tốt'] },
  { id: 'wq4', icon: '🚶', question: 'Vận động & NEAT tuần này?', options: ['Gần như không vận động', 'Dưới mức kế hoạch', 'Đủ mục tiêu 4–5 ngày', 'Vượt mục tiêu, nhất quán'] },
  { id: 'wq5', icon: '🏆', question: 'Thói quen lối sống nào tốt nhất tuần này?', options: ['Giấc ngủ', 'Thở & thư giãn', 'Vận động', 'Môi trường'] },
];

function getDayKey() {
  return new Date().toISOString().split('T')[0];
}

export default function LifestyleChecklistPage() {
  const [checked, setChecked] = useState({});
  const [weekAnswers, setWeekAnswers] = useState({});
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cClOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cClOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const today = getDayKey();
      if (saved.date === today) setChecked(saved.checked || {});
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      setHistory(hist);
      // Calculate streak
      let s = 0;
      const d = new Date();
      while (true) {
        const key = d.toISOString().split('T')[0];
        if (hist[key] && hist[key].completed >= 5) { s++; d.setDate(d.getDate() - 1); }
        else break;
      }
      setStreak(s);
    } catch {}
  }, []);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    const today = getDayKey();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, checked: next }));
      const completedCount = Object.values(next).filter(Boolean).length;
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      hist[today] = { completed: completedCount, total: DAILY_ITEMS.length };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    } catch {}
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedCount / DAILY_ITEMS.length) * 100);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Checklist Lối Sống</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C8 · Daily Checklist</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">7 hành động lối sống khỏe mỗi ngày — đơn giản, dễ theo dõi, tích lũy dần thành thói quen bền vững. Đánh dấu xong mỗi ngày, theo dõi chuỗi ngày liên tiếp.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Checklist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>7 hành động · Theo dõi tiến trình hằng ngày</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Stats row */}
      <RevealBlock className="mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{completedCount}/{DAILY_ITEMS.length}</div>
            <div className="text-sm text-muted mt-1">Hôm nay</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{streak}</div>
            <div className="text-sm text-muted mt-1">🔥 Ngày liên tiếp</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{progress}%</div>
            <div className="text-sm text-muted mt-1">Hoàn thành</div>
          </div>
        </div>
      </RevealBlock>

      {/* Progress bar */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-border bg-surface p-4" style={{ borderColor: `rgba(${RGB},0.1)` }}>
          <div className="flex justify-between text-sm text-muted mb-2">
            <span>Tiến trình hôm nay</span>
            <span style={{ color: COLOR }}>{completedCount} / {DAILY_ITEMS.length}</span>
          </div>
          <div className="h-3 bg-bg rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: `linear-gradient(to right, ${COLOR}, rgba(${RGB},0.6))` }} />
          </div>
          {progress === 100 && (
            <div className="mt-3 text-center text-base font-bold" style={{ color: COLOR }}>🎉 Hoàn thành 100%! Tuyệt vời!</div>
          )}
        </div>
      </RevealBlock>

      {/* Daily checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Checklist Hằng Ngày</h2>
        <p className="text-muted text-base mb-6">Đánh dấu từng mục khi hoàn thành. Tiến trình được lưu tự động.</p>
        <div className="space-y-2">
          {DAILY_ITEMS.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${checked[item.id] ? 'opacity-70' : 'hover:border-teal-500/20'}`} style={{ background: checked[item.id] ? `rgba(${RGB},0.08)` : 'var(--color-surface)', borderColor: checked[item.id] ? `rgba(${RGB},0.3)` : undefined }}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked[item.id] ? 'border-teal-400' : 'border-border'}`} style={{ background: checked[item.id] ? COLOR : undefined }}>
                {checked[item.id] && <span className="text-white text-sm font-bold">✓</span>}
              </div>
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className={`text-base font-medium transition-all ${checked[item.id] ? 'line-through text-muted' : 'text-text'}`}>{item.label}</div>
                <div className="text-sm text-muted">{item.detail}</div>
              </div>
              <span className="text-sm px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${item.color}15`, color: item.color }}>{item.pillar}</span>
            </button>
          ))}
        </div>
      </RevealBlock>

      {/* Weekly review */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Đánh Giá Cuối Tuần</h2>
        <p className="text-muted text-base mb-6">5 câu hỏi phản tư để hiểu rõ hơn về tuần vừa qua và điều chỉnh cho tuần tiếp theo.</p>
        <div className="space-y-4">
          {WEEKLY_QUESTIONS.map(q => (
            <div key={q.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{q.icon}</span>
                <div className="text-base font-medium text-text">{q.question}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setWeekAnswers(prev => ({ ...prev, [q.id]: i }))} className={`text-left text-sm p-2 rounded-lg border transition-all ${weekAnswers[q.id] === i ? 'border-teal-400' : 'border-border hover:border-teal-500/30'}`} style={{ background: weekAnswers[q.id] === i ? `rgba(${RGB},0.1)` : undefined, color: weekAnswers[q.id] === i ? COLOR : undefined }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {Object.keys(weekAnswers).length === WEEKLY_QUESTIONS.length && (
          <div className="mt-4 rounded-xl p-4 border text-base text-center font-medium" style={{ borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.08)`, color: COLOR }}>
            ✓ Đã ghi nhận đánh giá tuần. Xem lại vào cuối tuần sau!
          </div>
        )}
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/environment" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Thiết Kế Môi Trường
        </Link>
        <Link to="/pillar/c" className="text-base text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/assessment" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group justify-end">
          Đánh Giá Lối Sống
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
