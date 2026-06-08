import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'd-assessment-orbit-kf';
const ORBIT_CLASS = 'd-assessment-orbit-ring';
const PROP = '--d-assessment-orbit-angle';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

const QUESTIONS = [
  { id: 'q1', cat: 'Stress', q: 'Tôi thường cảm thấy căng thẳng hoặc lo lắng trong ngày', rev: true },
  { id: 'q2', cat: 'Stress', q: 'Tôi biết cách nhận ra khi bản thân đang bị stress', rev: false },
  { id: 'q3', cat: 'Stress', q: 'Tôi có ít nhất 1 cách để giảm stress hiệu quả', rev: false },
  { id: 'q4', cat: 'Hơi Thở & Thiền', q: 'Tôi thực hành thở có ý thức ít nhất vài lần mỗi tuần', rev: false },
  { id: 'q5', cat: 'Hơi Thở & Thiền', q: 'Tôi có thể ngồi im trong 5 phút mà không cảm thấy bồn chồn', rev: false },
  { id: 'q6', cat: 'Nhận Thức', q: 'Tôi thường không để ý đến những gì đang xảy ra xung quanh', rev: true },
  { id: 'q7', cat: 'Nhận Thức', q: 'Tôi có thể quan sát suy nghĩ mà không bị cuốn vào chúng', rev: false },
  { id: 'q8', cat: 'Kỹ Thuật Số', q: 'Tôi cầm điện thoại ngay khi thức dậy hoặc trước khi ngủ', rev: true },
  { id: 'q9', cat: 'Kỹ Thuật Số', q: 'Tôi có thể đặt điện thoại xuống và tập trung làm việc không bị gián đoạn', rev: false },
  { id: 'q10', cat: 'Giấc Ngủ', q: 'Tôi thức dậy thường xuyên cảm thấy mệt mỏi', rev: true },
  { id: 'q11', cat: 'Giấc Ngủ', q: 'Tôi ngủ đủ 7–9 tiếng hầu hết các ngày trong tuần', rev: false },
  { id: 'q12', cat: 'Nhật Ký', q: 'Tôi thường xuyên ghi lại suy nghĩ/cảm xúc của mình', rev: false },
  { id: 'q13', cat: 'Nhật Ký', q: 'Tôi biết cách xử lý cảm xúc mà không dồn nén', rev: false },
  { id: 'q14', cat: 'Kỷ Luật', q: 'Tôi dễ từ bỏ kế hoạch khi gặp khó khăn nhỏ', rev: true },
  { id: 'q15', cat: 'Kỷ Luật', q: 'Tôi tử tế với bản thân khi thất bại', rev: false },
];

const OPTIONS = [
  { v: 1, l: 'Không bao giờ' },
  { v: 2, l: 'Hiếm khi' },
  { v: 3, l: 'Đôi khi' },
  { v: 4, l: 'Thường xuyên' },
  { v: 5, l: 'Luôn luôn' },
];

function getScore(answers) {
  let total = 0;
  QUESTIONS.forEach(q => {
    const v = answers[q.id] || 3;
    total += q.rev ? (6 - v) : v;
  });
  return Math.round((total / (QUESTIONS.length * 5)) * 100);
}

function getLevel(score) {
  if (score >= 80) return { label: 'Tâm Trí Vững', color: '#10b981', icon: '🌟', desc: 'Bạn đang có nền tảng tâm trí rất tốt. Tiếp tục duy trì và đi sâu hơn!' };
  if (score >= 60) return { label: 'Đang Phát Triển', color: '#f59e0b', icon: '🌱', desc: 'Bạn có cơ sở tốt. Tập trung vào những khu vực điểm thấp để cải thiện nhanh hơn.' };
  if (score >= 40) return { label: 'Cần Chú Ý', color: '#ef4444', icon: '⚠️', desc: 'Tâm trí đang chịu nhiều áp lực. Bắt đầu với 1–2 kỹ thuật đơn giản nhất.' };
  return { label: 'Cần Hỗ Trợ', color: '#dc2626', icon: '🆘', desc: 'Hãy ưu tiên sức khỏe tâm thần. Cân nhắc nói chuyện với chuyên gia.' };
}

export default function MindAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const score = submitted ? getScore(answers) : 0;
  const level = submitted ? getLevel(score) : null;

  const cats = [...new Set(QUESTIONS.map(q => q.cat))];
  const catScores = cats.map(cat => {
    const qs = QUESTIONS.filter(q => q.cat === cat);
    const s = qs.reduce((acc, q) => {
      const v = answers[q.id] || 3;
      return acc + (q.rev ? (6 - v) : v);
    }, 0);
    return { cat, pct: Math.round((s / (qs.length * 5)) * 100) };
  });

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dAssessmentOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dAssessmentOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const grouped = cats.map(cat => ({ cat, qs: QUESTIONS.filter(q => q.cat === cat) }));

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🧠</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Đánh Giá Sức Khỏe Tâm Trí</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D0 · Bài Test Nhập Môn</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Bài đánh giá 15 câu hỏi giúp bạn hiểu mức độ sức khỏe tâm trí hiện tại và nhận gợi ý cá nhân hóa về nên tập trung vào đâu trước.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop" alt="Assessment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>15 câu · ~5 phút</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {!submitted ? (
        <RevealBlock className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Bài Kiểm Tra</h2>
            <span className="text-base text-muted">{answered}/{QUESTIONS.length} câu</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface border border-border mb-8 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${answered / QUESTIONS.length * 100}%`, background: COLOR }} />
          </div>
          <div className="space-y-6">
            {grouped.map(g => (
              <div key={g.cat}>
                <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>{g.cat}</p>
                <div className="space-y-4">
                  {g.qs.map((q, i) => (
                    <div key={q.id} className="rounded-2xl border border-border bg-surface p-5">
                      <p className="text-base text-text mb-4 leading-relaxed">{i + 1}. {q.q}</p>
                      <div className="flex flex-wrap gap-2">
                        {OPTIONS.map(o => (
                          <button key={o.v} onClick={() => setAnswers(p => ({ ...p, [q.id]: o.v }))}
                            className="px-3 py-1.5 rounded-full text-sm border transition-all"
                            style={answers[q.id] === o.v
                              ? { background: COLOR, color: '#fff', borderColor: COLOR }
                              : { background: 'transparent', color: '#888', borderColor: '#333' }}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => answered === QUESTIONS.length && setSubmitted(true)}
              disabled={answered < QUESTIONS.length}
              className="px-8 py-3 rounded-full font-bold text-base transition-all disabled:opacity-40"
              style={{ background: COLOR, color: '#fff' }}
            >
              {answered < QUESTIONS.length ? `Còn ${QUESTIONS.length - answered} câu chưa trả lời` : 'Xem kết quả →'}
            </button>
          </div>
        </RevealBlock>
      ) : (
        <RevealBlock className="mb-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{level.icon}</div>
            <div className="text-6xl font-black mb-2" style={{ color: level.color }}>{score}</div>
            <div className="text-2xl font-bold text-text mb-3">{level.label}</div>
            <p className="text-muted max-w-lg mx-auto">{level.desc}</p>
          </div>
          <div className="space-y-3 mb-8">
            {catScores.map(c => (
              <div key={c.cat} className="flex items-center gap-4">
                <span className="text-base text-muted w-32 shrink-0">{c.cat}</span>
                <div className="flex-1 h-2 rounded-full bg-surface border border-border overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.pct >= 70 ? '#10b981' : c.pct >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="text-base font-bold w-10 text-right" style={{ color: c.pct >= 70 ? '#10b981' : c.pct >= 50 ? '#f59e0b' : '#ef4444' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="px-6 py-2.5 rounded-full text-base border border-border text-muted hover:text-text transition-colors mr-3">Làm lại</button>
            <Link to="/pillar/d/roadmap" className="inline-block px-6 py-2.5 rounded-full text-base font-bold" style={{ background: COLOR, color: '#fff' }}>Xem lộ trình →</Link>
          </div>
        </RevealBlock>
      )}

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
