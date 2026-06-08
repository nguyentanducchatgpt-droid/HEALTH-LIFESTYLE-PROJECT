import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ec4899';
const RGB = '236,72,153';
const ORBIT_ID = 'd-journal-orbit-kf';
const ORBIT_CLASS = 'd-journal-orbit-ring';
const PROP = '--d-journal-orbit-angle';

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

const TEMPLATES = [
  { id: 'daily', icon: '📅', label: 'Nhật Ký 5 Dòng', color: '#ec4899', lines: [
    { q: '1. Hôm nay tôi biết ơn điều gì?', ph: 'Một điều nhỏ cũng đủ...' },
    { q: '2. Điều gì đã diễn ra tốt?', ph: 'Dù nhỏ cũng tính...' },
    { q: '3. Điều gì gây căng thẳng?', ph: 'Không phán xét, chỉ ghi lại...' },
    { q: '4. Ưu tiên #1 của ngày mai?', ph: 'Chỉ 1 việc thôi...' },
    { q: '5. Tôi muốn nói gì với bản thân?', ph: 'Như nói với người bạn thân...' },
  ]},
  { id: 'stress', icon: '😤', label: 'Nhật Ký Cảm Xúc', color: '#a855f7', lines: [
    { q: '1. Tôi đang cảm thấy gì?', ph: 'Mô tả cảm xúc cụ thể...' },
    { q: '2. Cơ thể đang phản ứng thế nào?', ph: 'Ngực tức, vai căng, tay run...' },
    { q: '3. Điều gì kích hoạt cảm xúc này?', ph: 'Tình huống, người, lời nói...' },
    { q: '4. Tôi cần gì lúc này?', ph: 'Nghỉ ngơi, nói chuyện, im lặng...' },
    { q: '5. Bước nhỏ nhất tôi có thể làm?', ph: 'Thở sâu, uống nước, đi bộ...' },
  ]},
  { id: 'failday', icon: '💪', label: 'Nhật Ký Ngày Thất Bại', color: '#f59e0b', lines: [
    { q: '1. Điều gì đã xảy ra?', ph: 'Chỉ kể lại sự kiện...' },
    { q: '2. Tôi đã học được gì?', ph: 'Bài học thực sự...' },
    { q: '3. Điều gì đã làm tốt dù trong hoàn cảnh đó?', ph: 'Tìm điểm tích cực...' },
    { q: '4. Ngày mai tôi sẽ làm khác thế nào?', ph: '1 thay đổi cụ thể...' },
    { q: '5. Tôi tha thứ cho bản thân điều gì?', ph: 'Lòng trắc ẩn với chính mình...' },
  ]},
  { id: 'eating', icon: '🍽️', label: 'Nhật Ký Ăn Uống Cảm Xúc', color: '#0ea5e9', lines: [
    { q: '1. Tôi đang muốn ăn gì?', ph: 'Món cụ thể...' },
    { q: '2. Tôi có thực sự đói không? (0-10)', ph: 'Điểm đói thực sự...' },
    { q: '3. Tôi đang cảm thấy gì trước khi muốn ăn?', ph: 'Cảm xúc, sự kiện trước đó...' },
    { q: '4. Điều gì tôi thực sự cần?', ph: 'Nghỉ ngơi, kết nối, an toàn...' },
    { q: '5. Sau khi ăn tôi cảm thấy thế nào?', ph: 'Ghi lại sau khi ăn...' },
  ]},
  { id: 'quick', icon: '⚡', label: 'Phiên Bản Siêu Ngắn', color: '#10b981', lines: [
    { q: '1. Tôi đang cảm thấy gì?', ph: '1-3 từ...' },
    { q: '2. Tôi cần gì lúc này?', ph: '1-3 từ...' },
    { q: '3. Bước nhỏ nhất tiếp theo?', ph: '1 hành động cụ thể...' },
  ]},
];

const TIPS = [
  { icon: '🕐', tip: 'Sáng sớm hoặc trước khi ngủ là thời điểm tốt nhất' },
  { icon: '✏️', tip: 'Viết tay hiệu quả hơn gõ phím — kết nối não bộ sâu hơn' },
  { icon: '⏱️', tip: 'Chỉ cần 5–10 phút mỗi ngày, không cần hoàn hảo' },
  { icon: '🚫', tip: 'Không chỉnh sửa, không phán xét — cứ viết ra' },
  { icon: '🔒', tip: 'Nhật ký là riêng tư, không cần lo ai đọc' },
  { icon: '📈', tip: 'Sau 7 ngày, đọc lại để thấy sự thay đổi của bản thân' },
];

function JournalWriter({ template }) {
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const set = (idx, val) => setAnswers(p => ({ ...p, [idx]: val }));
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${template.color}33`, background: `${template.color}08` }}>
      {template.lines.map((line, i) => (
        <div key={i}>
          <p className="text-base font-semibold mb-1.5" style={{ color: template.color }}>{line.q}</p>
          <textarea
            className="w-full rounded-xl border bg-bg text-text text-lg p-3 resize-none focus:outline-none focus:ring-2 min-h-[56px]"
            style={{ borderColor: `${template.color}30`, '--tw-ring-color': `${template.color}60` }}
            placeholder={line.ph}
            value={answers[i] || ''}
            onChange={e => set(i, e.target.value)}
            rows={2}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="px-5 py-2 rounded-full text-lg font-bold transition-all"
        style={{ background: template.color, color: '#fff', opacity: saved ? 0.7 : 1 }}
      >
        {saved ? '✓ Đã lưu!' : 'Lưu nhật ký'}
      </button>
    </div>
  );
}

export default function MindJournalingPage() {
  const [active, setActive] = useState('daily');
  const tmpl = TEMPLATES.find(t => t.id === active);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dJournalOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dJournalOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>📓</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Journaling &amp; Nhật Ký Tâm Trí</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D4 · Viết Để Giải Phóng</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Viết nhật ký là công cụ đơn giản nhất để giải phóng tâm trí — không phán xét, không cần hoàn hảo, chỉ cần viết ra những gì đang diễn ra bên trong.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop" alt="Journaling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>5 phút · Mỗi ngày</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Nên Viết Nhật Ký?</h2>
        <p className="text-muted text-lg mb-6">3 lợi ích được nghiên cứu khoa học xác nhận</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🧠', t: 'Giải phóng não bộ', d: 'Viết ra giúp não không còn phải "chạy vòng lặp" lo âu liên tục, giải phóng bộ nhớ làm việc.' },
            { icon: '🔍', t: 'Hiểu bản thân hơn', d: 'Nhận ra pattern suy nghĩ, cảm xúc lặp lại — từ đó thay đổi cách phản ứng có ý thức hơn.' },
            { icon: '💜', t: 'Xử lý cảm xúc khỏe', d: 'Đặt tên cho cảm xúc làm giảm cường độ của nó. Viết ra = chấp nhận và buông bỏ.' },
          ].map(c => (
            <div key={c.t} className="rounded-2xl border border-border bg-surface p-5 hover:border-pink-500/30 transition-colors">
              <div className="text-4xl mb-3">{c.icon}</div>
              <div className="font-bold text-text mb-2">{c.t}</div>
              <p className="text-muted text-lg leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>5 Mẫu Nhật Ký Thực Hành</h2>
        <p className="text-muted text-lg mb-6">Chọn mẫu phù hợp với tâm trạng hôm nay</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="px-4 py-2 rounded-full text-lg font-semibold border transition-all"
              style={active === t.id
                ? { background: t.color, color: '#fff', borderColor: t.color }
                : { background: 'transparent', color: '#888', borderColor: '#333' }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {tmpl && <JournalWriter key={tmpl.id} template={tmpl} />}
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẹo Để Duy Trì Thói Quen</h2>
        <p className="text-muted text-lg mb-6">Biến việc viết nhật ký thành nghi thức hằng ngày</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map(t => (
            <div key={t.tip} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="text-2xl shrink-0">{t.icon}</span>
              <p className="text-lg text-muted leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Lộ Trình 4 Tuần</h2>
        <div className="space-y-3">
          {[
            { w: 'Tuần 1', t: 'Nhật Ký 5 Dòng', d: 'Mỗi tối viết 5 dòng theo template cơ bản. Không cần dài, cần đều.' },
            { w: 'Tuần 2', t: '+ Nhật Ký Cảm Xúc', d: 'Khi có sự kiện gây căng thẳng, thêm template cảm xúc vào.' },
            { w: 'Tuần 3', t: '+ Nhật Ký Ăn Uống', d: 'Nếu ăn uống mất kiểm soát, thêm nhật ký ăn uống cảm xúc.' },
            { w: 'Tuần 4', t: 'Nhìn Lại & Điều Chỉnh', d: 'Đọc lại 3 tuần. Nhận ra pattern. Chọn mẫu phù hợp nhất.' },
          ].map((r, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
              <div className="shrink-0 w-20 text-base font-bold uppercase tracking-widest pt-0.5" style={{ color: COLOR }}>{r.w}</div>
              <div>
                <div className="font-semibold text-text mb-1">{r.t}</div>
                <p className="text-muted text-lg">{r.d}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>
    </div>
  );
}
