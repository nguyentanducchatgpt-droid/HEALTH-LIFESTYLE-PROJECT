import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#3b82f6';
const RGB = '59,130,246';
const ORBIT_ID = 'e-assess-orbit-kf';
const ORBIT_CLASS = 'e-assess-orbit-ring';
const ORBIT_PROP = '--e-assess-orbit-angle';

const QUESTIONS = [
  // Physical activity (Q1-3)
  { id: 1, cat: 'Vận Động', q: 'Bạn vận động thể chất ít nhất 20 phút bao nhiêu ngày/tuần?', opts: ['Không vận động', '1–2 ngày', '3–4 ngày', '5–6 ngày', 'Hàng ngày'] },
  { id: 2, cat: 'Vận Động', q: 'Bạn có thường xuyên ngồi liên tục > 2 giờ không nghỉ không?', opts: ['Hầu như mọi ngày', 'Thường xuyên', 'Đôi khi', 'Hiếm khi', 'Hầu như không'] },
  { id: 3, cat: 'Vận Động', q: 'Bạn có tập sức mạnh (tạ, thể dục) ít nhất 2 lần/tuần không?', opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Luôn luôn'] },
  // Nutrition (Q4-6)
  { id: 4, cat: 'Dinh Dưỡng', q: 'Bạn ăn rau và trái cây bao nhiêu phần mỗi ngày?', opts: ['Hầu như không', '1 phần', '2–3 phần', '4–5 phần', '≥ 5 phần'] },
  { id: 5, cat: 'Dinh Dưỡng', q: 'Bạn có thường xuyên ăn đồ chế biến sẵn / fast food không?', opts: ['Hàng ngày', '4–6 lần/tuần', '2–3 lần/tuần', '1 lần/tuần', 'Hiếm khi'] },
  { id: 6, cat: 'Dinh Dưỡng', q: 'Bạn uống đủ nước (khoảng 2L/ngày) không?', opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Luôn luôn'] },
  // Sleep (Q7-8)
  { id: 7, cat: 'Giấc Ngủ', q: 'Bạn thường ngủ bao nhiêu tiếng mỗi đêm?', opts: ['< 5 giờ', '5–6 giờ', '6–7 giờ', '7–8 giờ', '> 8 giờ'] },
  { id: 8, cat: 'Giấc Ngủ', q: 'Bạn cảm thấy thế nào khi thức dậy vào buổi sáng?', opts: ['Rất mệt', 'Mệt', 'Bình thường', 'Tỉnh táo', 'Rất tỉnh táo và sẵn sàng'] },
  // Stress/Mind (Q9-11)
  { id: 9, cat: 'Tâm Trí', q: 'Mức độ stress hằng ngày của bạn?', opts: ['Cực kỳ cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'] },
  { id: 10, cat: 'Tâm Trí', q: 'Bạn có thực hành kỹ thuật thư giãn (thở sâu, thiền, yoga) không?', opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Hàng ngày'] },
  // Preventive (Q12-13)
  { id: 11, cat: 'Phòng Bệnh', q: 'Bạn đi khám sức khỏe định kỳ bao nhiêu?', opts: ['Không bao giờ', 'Khi thấy bệnh mới đi', 'Mỗi 2–3 năm', 'Hàng năm', 'Thường xuyên hơn khi cần'] },
  { id: 12, cat: 'Phòng Bệnh', q: 'Bạn có hút thuốc hoặc uống rượu bia thường xuyên không?', opts: ['Hút thuốc + uống nhiều', 'Một trong hai nhiều', 'Một trong hai ít', 'Đôi khi một trong hai', 'Không có cả hai'] },
  // Knowledge (Q13-15)
  { id: 13, cat: 'Kiến Thức', q: 'Bạn chủ động tìm hiểu thông tin sức khỏe bao nhiêu?', opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Hàng ngày'] },
  { id: 14, cat: 'Kiến Thức', q: 'Bạn có biết các chỉ số sức khỏe cơ bản của mình (BMI, HA, đường huyết) không?', opts: ['Không biết', 'Biết một phần', 'Biết nhưng không theo dõi', 'Biết và theo dõi thỉnh thoảng', 'Biết và theo dõi đều đặn'] },
  { id: 15, cat: 'Kiến Thức', q: 'Bạn tin tưởng khả năng tự quản lý sức khỏe của mình không?', opts: ['Không tự tin chút nào', 'Ít tự tin', 'Tự tin vừa phải', 'Tự tin', 'Rất tự tin'] },
];

const CATS = ['Vận Động', 'Dinh Dưỡng', 'Giấc Ngủ', 'Tâm Trí', 'Phòng Bệnh', 'Kiến Thức'];

const LEVELS = [
  { min: 0, max: 39, label: 'Cần Cải Thiện Nhiều', color: '#ef4444', desc: 'Sức khỏe của bạn đang ở mức cần chú ý. Bắt đầu với 1–2 thay đổi nhỏ ngay hôm nay.' },
  { min: 40, max: 59, label: 'Đang Trên Đà Phát Triển', color: '#f97316', desc: 'Bạn đã có nền tảng nhất định. Tập trung vào những điểm yếu để bứt phá.' },
  { min: 60, max: 74, label: 'Tốt — Tiếp Tục Duy Trì', color: '#eab308', desc: 'Bạn có lối sống lành mạnh hơn trung bình. Tinh chỉnh các điểm còn thiếu.' },
  { min: 75, max: 89, label: 'Rất Tốt', color: '#22c55e', desc: 'Bạn đang thực hành sức khỏe ở mức cao. Chia sẻ kiến thức với người xung quanh!' },
  { min: 90, max: 100, label: 'Xuất Sắc', color: '#3b82f6', desc: 'Bạn đang sống khỏe ở mức tối ưu. Duy trì và là nguồn cảm hứng cho người khác.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-ea-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-ea-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eAssessOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eAssessOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  function setAnswer(id, val) { setAnswers(p => ({ ...p, [id]: val })); }

  function calcScore() {
    const total = Object.values(answers).reduce((s, v) => s + v, 0);
    return Math.round((total / (QUESTIONS.length * 4)) * 100);
  }

  function catScore(cat) {
    const qs = QUESTIONS.filter(q => q.cat === cat);
    const answered = qs.filter(q => answers[q.id] !== undefined);
    if (!answered.length) return null;
    const sum = answered.reduce((s, q) => s + answers[q.id], 0);
    return Math.round((sum / (answered.length * 4)) * 100);
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
  const score = submitted ? calcScore() : null;
  const level = score !== null ? LEVELS.find(l => score >= l.min && score <= l.max) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🎯</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Đánh Giá Sức Khỏe</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            15 câu hỏi · 6 lĩnh vực
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đánh giá toàn diện lối sống và thói quen sức khỏe của bạn qua 15 câu hỏi thuộc 6 lĩnh vực. Kết quả giúp bạn xác định điểm mạnh cần phát huy và điểm yếu cần cải thiện.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="Đánh giá sức khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Hiểu mình · Cải thiện đúng chỗ
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {!submitted ? (
        <RevealBlock delay={0} className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: COLOR }}>Bài Đánh Giá</h2>
            <span className="text-lg text-muted">{Object.keys(answers).length}/{QUESTIONS.length} câu</span>
          </div>
          <div className="space-y-6">
            {QUESTIONS.map((q, i) => {
              const prevCat = i > 0 ? QUESTIONS[i - 1].cat : null;
              return (
                <div key={q.id}>
                  {q.cat !== prevCat && (
                    <div className="text-base font-bold uppercase tracking-widest mb-3 px-1" style={{ color: COLOR }}>— {q.cat}</div>
                  )}
                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-lg text-text font-medium mb-3">{i + 1}. {q.q}</p>
                    <div className="flex flex-col gap-2">
                      {q.opts.map((opt, j) => (
                        <button key={j} onClick={() => setAnswer(q.id, j)}
                          className="flex items-center gap-3 rounded-xl border p-3 text-left text-lg transition-colors"
                          style={answers[q.id] === j ? { borderColor: COLOR, background: `rgba(${RGB},0.08)`, color: 'var(--text)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
                          <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center"
                            style={answers[q.id] === j ? { borderColor: COLOR, background: COLOR } : { borderColor: 'var(--border)' }}>
                            {answers[q.id] === j && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => { if (allAnswered) setSubmitted(true); }}
            disabled={!allAnswered}
            className="mt-8 w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: COLOR }}>
            {allAnswered ? 'Xem Kết Quả →' : `Trả lời thêm ${QUESTIONS.length - Object.keys(answers).length} câu nữa`}
          </button>
        </RevealBlock>
      ) : (
        <RevealBlock delay={0} className="mb-10">
          <div className="text-center mb-8">
            <div className="text-6xl font-black mb-2" style={{ color: level?.color }}>{score}</div>
            <div className="text-2xl font-bold text-text mb-2">{level?.label}</div>
            <p className="text-muted text-lg max-w-xl mx-auto">{level?.desc}</p>
          </div>
          <div className="w-full h-3 bg-surface rounded-full mb-8 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: level?.color }} />
          </div>
          <h3 className="font-bold text-text mb-4">Điểm Theo Lĩnh Vực</h3>
          <div className="space-y-3 mb-8">
            {CATS.map(cat => {
              const cs = catScore(cat);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg text-muted w-28 shrink-0">{cat}</span>
                  <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cs ?? 0}%`, background: COLOR, opacity: cs === null ? 0.3 : 1 }} />
                  </div>
                  <span className="text-lg font-bold w-10 text-right" style={{ color: COLOR }}>{cs ?? '–'}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="flex-1 py-2 rounded-xl text-lg border border-border text-muted hover:text-text transition-colors">Làm lại</button>
            <Link to="/pillar/e/roadmap" className="flex-1 py-2 rounded-xl text-lg font-bold text-white text-center transition-all" style={{ background: COLOR }}>Xem Lộ Trình →</Link>
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
