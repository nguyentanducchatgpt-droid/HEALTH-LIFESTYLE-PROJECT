import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

const PURPLE = '#a855f7';
const PURPLE_RGB = '168,85,247';
const ORBIT_ID = 'pd-orbit-kf';

const TABS = [
  { id: 'd0', label: 'Nhập Môn', icon: '🧭', color: '#a855f7', rgb: '168,85,247', frame: 'pd-frame-0' },
  { id: 'd1', label: 'Stress', icon: '🌪️', color: '#8b5cf6', rgb: '139,92,246', frame: 'pd-frame-1' },
  { id: 'd2', label: 'Thở', icon: '🫁', color: '#6366f1', rgb: '99,102,241', frame: 'pd-frame-2' },
  { id: 'd3', label: 'Thiền', icon: '🧘', color: '#d946ef', rgb: '217,70,239', frame: 'pd-frame-3' },
  { id: 'd4', label: 'Journaling', icon: '📓', color: '#ec4899', rgb: '236,72,153', frame: 'pd-frame-4' },
  { id: 'd5', label: 'Digital Detox', icon: '📵', color: '#0ea5e9', rgb: '14,165,233', frame: 'pd-frame-5' },
  { id: 'd6', label: 'Kỷ Luật Mềm', icon: '🌱', color: '#10b981', rgb: '16,185,129', frame: 'pd-frame-6' },
  { id: 'd7', label: 'Theo Dõi', icon: '📊', color: '#f59e0b', rgb: '245,158,11', frame: 'pd-frame-7' },
];

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

// ─── Box Breathing Timer (D2 tab) ───────────────────────────────────────────
function BoxBreathTimer({ color }) {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);
  const phaseIdxRef = useRef(0);
  const countRef = useRef(0);
  const PHASES = [
    { key: 'inhale', label: 'Hít vào', dur: 4 },
    { key: 'hold1',  label: 'Giữ',     dur: 4 },
    { key: 'exhale', label: 'Thở ra',  dur: 4 },
    { key: 'hold2',  label: 'Giữ',     dur: 4 },
  ];
  const startStop = () => {
    if (running) {
      clearInterval(iRef.current);
      setRunning(false); setPhase('idle'); setCount(0); phaseIdxRef.current = 0;
    } else {
      setRunning(true); phaseIdxRef.current = 0;
      setPhase(PHASES[0].key); countRef.current = PHASES[0].dur; setCount(PHASES[0].dur);
      iRef.current = setInterval(() => {
        countRef.current -= 1;
        if (countRef.current <= 0) {
          phaseIdxRef.current = (phaseIdxRef.current + 1) % 4;
          const p = PHASES[phaseIdxRef.current];
          setPhase(p.key); countRef.current = p.dur; setCount(p.dur);
        } else { setCount(countRef.current); }
      }, 1000);
    }
  };
  useEffect(() => () => clearInterval(iRef.current), []);
  const curPhase = PHASES.find(p => p.key === phase) || PHASES[0];
  const pct = phase !== 'idle' ? ((curPhase.dur - count) / curPhase.dur) * 100 : 0;
  return (
    <div className="rounded-2xl border border-border bg-bg p-5 flex flex-col items-center gap-3 max-w-xs mx-auto">
      <div className="text-xs font-bold uppercase tracking-widest text-muted">Box Breathing · 4-4-4-4</div>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" opacity="0.2" />
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center">
          <div className="text-3xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-xs text-muted">{running ? curPhase.label : 'Bắt đầu'}</div>
        </div>
      </div>
      <button onClick={startStop} className="px-5 py-2 rounded-full text-sm font-bold transition-all" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${PURPLE_RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${PURPLE_RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

// ─── Journal Prompt (D4 tab) ─────────────────────────────────────────────────
function JournalPrompt({ color }) {
  const [answers, setAnswers] = useState({});
  const PROMPTS = [
    { id: 'p1', q: 'Hôm nay mình đang cảm thấy gì?' },
    { id: 'p2', q: 'Điều gì làm mình căng nhất?' },
    { id: 'p3', q: 'Hôm nay mình làm tốt điều gì, dù nhỏ?' },
    { id: 'p4', q: 'Ngày mai chỉ cần làm 1 việc quan trọng nào?' },
    { id: 'p5', q: 'Một câu tử tế mình muốn nói với bản thân?' },
  ];
  return (
    <div className="space-y-3">
      {PROMPTS.map((p, i) => (
        <div key={p.id} className="rounded-xl border border-border bg-bg p-3">
          <div className="text-xs font-bold mb-1.5" style={{ color }}>{i + 1}. {p.q}</div>
          <textarea value={answers[p.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [p.id]: e.target.value }))} rows={2} placeholder="Viết tự do, không cần hay..." className="w-full text-sm bg-transparent text-text placeholder:text-muted/40 resize-none outline-none" />
        </div>
      ))}
    </div>
  );
}

// ─── Calm Score (D7 tab) ─────────────────────────────────────────────────────
function CalmScore({ color }) {
  const [checks, setChecks] = useState({});
  const ITEMS = [
    { id: 'breath', label: 'Thở/thiền ≥ 3 phút', pts: 25 },
    { id: 'journal', label: 'Journal 1–5 dòng', pts: 20 },
    { id: 'detox', label: 'Digital detox ≥ 10 phút', pts: 15 },
    { id: 'stress', label: 'Ghi nhận stress trong ngày', pts: 10 },
    { id: 'routine', label: 'Routine tối hoặc reset trước ngủ', pts: 15 },
    { id: 'soft', label: 'Kỷ luật mềm: không tự trách', pts: 15 },
  ];
  const score = ITEMS.reduce((s, i) => s + (checks[i.id] ? i.pts : 0), 0);
  const level = score >= 80 ? { label: 'Xuất sắc', color: '#10b981' } : score >= 60 ? { label: 'Tốt', color: color } : score >= 40 ? { label: 'Đạt', color: '#f59e0b' } : { label: 'Cần cố', color: '#f97316' };
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl font-bold" style={{ color: level.color }}>{score}</div>
        <div>
          <div className="text-xs text-muted">/ 100 điểm</div>
          <div className="text-sm font-bold" style={{ color: level.color }}>{level.label}</div>
        </div>
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden ml-2">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: level.color }} />
        </div>
      </div>
      <div className="space-y-2">
        {ITEMS.map(item => (
          <button key={item.id} onClick={() => setChecks(p => ({ ...p, [item.id]: !p[item.id] }))} className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${checks[item.id] ? '' : 'border-border hover:border-purple-500/20'}`} style={{ background: checks[item.id] ? `rgba(${PURPLE_RGB},0.08)` : 'var(--color-surface)', borderColor: checks[item.id] ? `rgba(${PURPLE_RGB},0.3)` : undefined }}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`} style={{ borderColor: checks[item.id] ? color : '#4b5563', background: checks[item.id] ? color : 'transparent' }}>
              {checks[item.id] && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span className="flex-1 text-sm text-text">{item.label}</span>
            <span className="text-xs font-bold" style={{ color: checks[item.id] ? color : '#6b7280' }}>+{item.pts}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab panels ──────────────────────────────────────────────────────────────
function D0Panel({ color }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted leading-relaxed">Trụ cột D không biến bạn thành người "luôn bình tĩnh". Nó cung cấp bộ công cụ dùng ngay khi căng: thở khi stress, viết khi rối, tắt màn hình khi quá tải.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '🌪️', title: 'D1 – Hiểu Stress', desc: 'Nhận diện 3 tầng stress: cơ thể, cảm xúc, hành vi. Vòng lặp lo âu – thói quen.' },
          { icon: '🫁', title: 'D2 – Thở & Hạ Nhịp', desc: 'Thở cơ hoành, box breathing 4-4-4-4, thở 4-7-8, reset 2 phút.' },
          { icon: '🧘', title: 'D3 – Thiền & Chánh Niệm', desc: 'Thiền 3 phút cho người mới. Body scan 5 phút. Chánh niệm khi ăn, đi bộ.' },
          { icon: '📓', title: 'D4 – Journaling 5 Dòng', desc: '5 câu hỏi mỗi tối. Xả não khi quá tải. Journal sau ngày fail.' },
          { icon: '📵', title: 'D5 – Digital Detox', desc: '3 mức: dễ → chuẩn → nâng cao. Giảm màn hình trước ngủ, tắt thông báo.' },
          { icon: '🌱', title: 'D6 – Kỷ Luật Mềm', desc: 'Không tự trách. Quy tắc 1% quay lại. Thói quen nhỏ bền vững.' },
        ].map(m => (
          <div key={m.title} className="rounded-xl border border-border bg-bg p-4 hover:border-purple-500/20 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{m.icon}</span>
              <span className="text-sm font-bold text-text">{m.title}</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4 text-sm text-muted leading-relaxed" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.06)` }}>
        <span className="font-bold" style={{ color }}>⚠️ Quy tắc an toàn: </span>
        Trụ cột D chỉ là giáo dục sức khỏe phổ thông. Nếu lo âu/buồn bã kéo dài nhiều tuần, mất ngủ nặng, cơn hoảng sợ lặp lại hoặc ý nghĩ tự làm hại bản thân — hãy tìm hỗ trợ chuyên môn.
      </div>
    </div>
  );
}

function D1Panel({ color }) {
  const [openLoop, setOpenLoop] = useState(null);
  const LOOPS = [
    { trigger: 'Sếp nhắn tin gấp', thought: '"Chắc mình làm sai"', emotion: 'Lo, tim đập nhanh', behavior: 'Mở điện thoại liên tục', result: 'Mệt, làm việc kém hơn' },
    { trigger: 'Thấy người khác thành công', thought: '"Mình không bằng ai"', emotion: 'Tự ti, chán nản', behavior: 'Lướt mạng xã hội nhiều hơn', result: 'Càng so sánh, càng mệt' },
    { trigger: 'Deadline gấp', thought: '"Không xong được đâu"', emotion: 'Lo lắng, tê liệt', behavior: 'Trì hoãn, làm việc khác', result: 'Deadline càng gần, panic càng tăng' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>3 Tầng Của Stress</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '💪', label: 'Cơ Thể', signs: ['Tim đập nhanh', 'Căng vai gáy', 'Thở nông', 'Khó ngủ'] },
            { icon: '😤', label: 'Cảm Xúc', signs: ['Dễ cáu', 'Lo lắng', 'Buồn bực', 'Mất kiên nhẫn'] },
            { icon: '🔄', label: 'Hành Vi', signs: ['Ăn vặt', 'Lướt điện thoại', 'Trì hoãn', 'Bỏ tập'] },
          ].map(t => (
            <div key={t.label} className="rounded-xl border border-border bg-bg p-3">
              <div className="text-xl mb-1 text-center">{t.icon}</div>
              <div className="text-xs font-bold text-center mb-2" style={{ color }}>{t.label}</div>
              <ul className="space-y-0.5">{t.signs.map(s => <li key={s} className="text-xs text-muted text-center">{s}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>Vòng Lặp Lo Âu – Thói Quen</div>
        <div className="space-y-2">
          {LOOPS.map((l, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <button onClick={() => setOpenLoop(openLoop === i ? null : i)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left">
                <span className="text-sm font-medium text-text flex-1">Trigger: {l.trigger}</span>
                <span className="text-muted text-xs">{openLoop === i ? '▲' : '▼'}</span>
              </button>
              {openLoop === i && (
                <div className="px-3 pb-3">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {[['💭', 'Suy nghĩ', l.thought], ['😟', 'Cảm xúc', l.emotion], ['📱', 'Hành vi', l.behavior], ['💢', 'Hậu quả', l.result]].map(([ic, lb, val]) => (
                      <div key={lb} className="rounded-lg p-2 flex-1 min-w-[120px]" style={{ background: `rgba(${PURPLE_RGB},0.08)` }}>
                        <div className="font-bold" style={{ color }}>{ic} {lb}</div>
                        <div className="text-muted mt-0.5">{val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted p-2 rounded-lg border border-border">
                    🔧 <strong style={{ color }}>Điểm dừng:</strong> Thở 1 phút → gọi tên cảm xúc → chọn việc nhỏ tiếp theo.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function D2Panel({ color }) {
  const [active, setActive] = useState('box');
  const TECHS = [
    { id: 'diaphragm', icon: '🫁', name: 'Thở Cơ Hoành', formula: 'Hít bụng phồng → thở ra xẹp', when: 'Sau tập, trước ngủ, khi vai gáy căng', steps: ['1 tay ngực, 1 tay bụng', 'Hít vào — bụng phồng, ngực ít', 'Thở ra chậm, bụng xẹp', '1–3 phút'] },
    { id: 'box', icon: '⬜', name: 'Box Breathing', formula: 'Hít 4 – Giữ 4 – Thở 4 – Giữ 4', when: 'Trước họp, khi bực tức, mất tập trung', steps: ['Hít vào 4 giây', 'Giữ hơi 4 giây', 'Thở ra 4 giây', 'Giữ trống 4 giây — lặp 4 vòng'] },
    { id: '478', icon: '🌊', name: 'Thở 4-7-8', formula: 'Hít 4 – Giữ 7 – Thở 8', when: 'Buổi tối, trước ngủ, hạ nhịp sau ngày căng', steps: ['Hít vào 4 giây', 'Giữ hơi 7 giây', 'Thở ra 8 giây (nhẹ nhàng)', 'Lặp 3–4 vòng'] },
    { id: 'reset2', icon: '⚡', name: 'Reset 2 Phút', formula: 'Dừng → Thở → Thả lỏng → Neo', when: 'Khi quá tải, giữa ngày, sau tranh cãi', steps: ['Dừng 10 giây, không cầm điện thoại', 'Thở 5 nhịp chậm qua mũi', 'Thả lỏng vai – hàm – bàn tay', 'Nói 1 câu: "Việc nhỏ tiếp theo là..."'] },
  ];
  const tech = TECHS.find(t => t.id === active);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {TECHS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${active === t.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: active === t.id ? color : undefined, borderColor: active === t.id ? color : undefined }}>
            {t.icon} {t.name}
          </button>
        ))}
      </div>
      {tech && (
        <div className="rounded-xl border p-4" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <div className="text-sm font-bold text-text mb-1">{tech.formula}</div>
          <div className="text-xs text-muted mb-3">⏰ Khi nào: {tech.when}</div>
          <ol className="space-y-1 mb-4">
            {tech.steps.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-text"><span className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `rgba(${PURPLE_RGB},0.2)`, color }}>{i + 1}</span>{s}</li>)}
          </ol>
          {active === 'box' && <BoxBreathTimer color={color} />}
        </div>
      )}
    </div>
  );
}

function D3Panel({ color }) {
  const [mode, setMode] = useState('3min');
  const MODES = [
    { id: '3min', label: 'Thiền 3 Phút', steps: ['Ngồi thoải mái, nhắm mắt hoặc nhìn xuống', 'Cảm nhận hơi thở vào – ra ở mũi/bụng', 'Khi suy nghĩ xuất hiện, nói thầm "biết rồi"', 'Nhẹ nhàng quay lại hơi thở'] },
    { id: '5min', label: 'Thiền 5 Phút Trước Ngủ', steps: ['1 phút thở chậm, sâu', '2 phút scan cơ thể: trán → vai → ngực → bụng → chân', '1 phút thả lỏng vùng đang căng', '1 phút tự nhắc: "Hôm nay đủ rồi, ngày mai làm tiếp"'] },
    { id: 'walk', label: 'Chánh Niệm Đi Bộ', steps: ['Đi bộ 5–10 phút không tai nghe', 'Cảm nhận bàn chân chạm đất từng bước', 'Quan sát ánh sáng, cây cối, bầu trời', 'Thở đều, không đếm thành tích'] },
    { id: 'eat', label: 'Chánh Niệm Khi Ăn', steps: ['Tắt màn hình khi ăn', 'Ăn chậm hơn, nhai kỹ hơn', 'Nhận ra cảm giác no – đói', 'Dừng 10 giây trước khi lấy thêm đồ ăn'] },
  ];
  const m = MODES.find(x => x.id === mode);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Thiền không phải là "không suy nghĩ". Thiền là <strong className="text-text">nhận ra mình đang bị cuốn đi và quay lại nhẹ nhàng</strong>.</p>
      <div className="flex gap-2 flex-wrap">
        {MODES.map(x => (
          <button key={x.id} onClick={() => setMode(x.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${mode === x.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: mode === x.id ? color : undefined, borderColor: mode === x.id ? color : undefined }}>
            {x.label}
          </button>
        ))}
      </div>
      {m && (
        <div className="rounded-xl border p-4" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <ol className="space-y-2">
            {m.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ background: `rgba(${PURPLE_RGB},0.2)`, color }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function D4Panel({ color }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Nhiều người mệt không vì nhiều việc, mà vì <strong className="text-text">mọi việc nằm lộn xộn trong đầu</strong>. Journal đưa chúng ra giấy.</p>
      <JournalPrompt color={color} />
      <div className="rounded-xl border p-3 text-xs text-muted" style={{ borderColor: `rgba(${PURPLE_RGB},0.15)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
        <strong style={{ color }}>Phiên bản siêu ngắn:</strong> "Mình đang cảm thấy… / Mình cần… / Việc nhỏ tiếp theo là…"
      </div>
    </div>
  );
}

function D5Panel({ color }) {
  const [level, setLevel] = useState(1);
  const LEVELS = [
    { l: 1, name: 'Mức 1 – Dễ', rules: ['Không mở MXH 10 phút sau khi thức', 'Tắt thông báo không cần thiết', 'Không để điện thoại trên giường khi ngủ', 'Giảm màn hình 10–20 phút trước ngủ'] },
    { l: 2, name: 'Mức 2 – Chuẩn', rules: ['30 phút đầu ngày không MXH', '30 phút trước ngủ không cuộn feed', '10 phút "khoảng trống" trong ngày', 'Khi ăn, không cầm điện thoại'] },
    { l: 3, name: 'Mức 3 – Nâng Cao', rules: ['1 buổi tối/tuần ít màn hình', '1 lần đi bộ không tai nghe, không điện thoại', 'Cuối tuần 2–3 giờ "deep life": gia đình, nấu ăn, đọc sách', 'Đưa app gây nghiện ra khỏi màn hình chính'] },
  ];
  const cur = LEVELS.find(x => x.l === level);
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Điện thoại không xấu. Vấn đề là <strong className="text-text">cuộn vô thức khi não đang mệt</strong>, làm stress nặng hơn và ngủ kém hơn.</p>
      <div className="flex gap-2">
        {LEVELS.map(x => (
          <button key={x.l} onClick={() => setLevel(x.l)} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${level === x.l ? 'text-white' : 'text-muted border-border'}`} style={{ background: level === x.l ? color : undefined, borderColor: level === x.l ? color : undefined }}>
            {x.name}
          </button>
        ))}
      </div>
      {cur && (
        <ul className="space-y-2">
          {cur.rules.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text p-2 rounded-lg" style={{ background: `rgba(${PURPLE_RGB},0.05)` }}>
              <span style={{ color }}>→</span>{r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function D6Panel({ color }) {
  const HABITS = [
    { situation: 'Căng thẳng', habit: 'Thở 1 phút' },
    { situation: 'Quá tải công việc', habit: 'Xả não 5 dòng' },
    { situation: 'Trước khi ngủ', habit: 'Tắt màn hình 10–20 phút' },
    { situation: 'Sau khi fail', habit: 'Viết 1 câu quay lại' },
    { situation: 'Muốn ăn vặt', habit: 'Dừng 10 giây hỏi mình đói hay mệt' },
    { situation: 'Mất động lực', habit: 'Làm bản tối thiểu 2 phút' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted"><strong className="text-text">Kỷ luật mềm</strong> không phải dễ dãi. Đó là cách quay lại sau khi lệch nhịp — không tự mắng, không bù gấp đôi.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {HABITS.map(h => (
          <div key={h.situation} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg">
            <div className="text-xs text-muted w-32 shrink-0">{h.situation}</div>
            <div className="text-xs font-bold" style={{ color }}>→ {h.habit}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 text-xs text-muted leading-relaxed border" style={{ borderColor: `rgba(${PURPLE_RGB},0.15)`, background: `rgba(${PURPLE_RGB},0.06)` }}>
        <strong style={{ color }}>Quy tắc 1% quay lại:</strong> Không tập được 30 phút → làm 5 phút. Ăn quá tay → bữa tiếp theo quay lại. Ngủ muộn → tối hôm sau giảm màn hình sớm 10 phút. <strong className="text-text">Một ngày fail không phá hỏng hành trình. Bỏ luôn mới phá.</strong>
      </div>
    </div>
  );
}

function D7Panel({ color }) {
  return <CalmScore color={color} />;
}

const PANEL_MAP = { d0: D0Panel, d1: D1Panel, d2: D2Panel, d3: D3Panel, d4: D4Panel, d5: D5Panel, d6: D6Panel, d7: D7Panel };

// ─── Teaser components (copied from PillarB pattern) ─────────────────────────
function TeaserSection({ title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted px-3">{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features, stats, image, imageAlt, cta }) {
  return (
    <Link to={to} className="group relative rounded-2xl border border-border bg-surface overflow-hidden hover:border-opacity-40 transition-all duration-300 flex flex-col md:flex-row" style={{ '--hov-color': color }} >
      <div className="md:hidden relative h-28 overflow-hidden">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, var(--color-surface) 90%)` }} />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color }}>{category}</div>
              <div className="text-base font-bold text-text group-hover:text-white transition-colors leading-tight">{title}</div>
            </div>
          </div>
          {accent && <div className="text-xs font-medium mb-2 px-2 py-0.5 rounded-full inline-block" style={{ background: `rgba(${rgb},0.1)`, color }}>{accent}</div>}
          <p className="text-xs text-muted leading-relaxed mb-3">{desc}</p>
          {features && <ul className="space-y-0.5 mb-3">{features.map(f => <li key={f} className="text-xs text-muted flex items-center gap-1.5"><span style={{ color }}>·</span>{f}</li>)}</ul>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          {stats && <div className="flex gap-3">{stats.map(s => <div key={s.l} className="text-center"><div className="text-sm font-bold" style={{ color }}>{s.v}</div><div className="text-xs text-muted">{s.l}</div></div>)}</div>}
          <span className="text-xs font-bold ml-auto" style={{ color }}>{cta}</span>
        </div>
      </div>
      <div className="hidden md:block w-[38%] relative overflow-hidden shrink-0">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, var(--color-surface) 10%, transparent 60%)` }} />
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PillarD() {
  const [activeTab, setActiveTab] = useState('d0');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --pd-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pdOrbitSpin { to { --pd-orbit-angle: 360deg; } }
      .pd-orbit-ring {
        background: conic-gradient(
          from var(--pd-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${PURPLE_RGB},0.0) 65deg, rgba(${PURPLE_RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${PURPLE_RGB},0.75) 99deg,
          rgba(${PURPLE_RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: pdOrbitSpin 3.5s linear infinite;
      }
      ${TABS.map(t => `
        @property --${t.frame}-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes ${t.frame}Spin { to { --${t.frame}-angle: 360deg; } }
        .${t.frame} {
          background: conic-gradient(from var(--${t.frame}-angle),
            transparent 0deg, rgba(${t.rgb},0.0) 70deg, rgba(${t.rgb},0.6) 85deg,
            rgba(255,255,255,0.8) 90deg, rgba(${t.rgb},0.6) 95deg,
            rgba(${t.rgb},0.0) 110deg, transparent 360deg);
          animation: ${t.frame}Spin 4s linear infinite;
        }
      `).join('')}
      @keyframes pdTitleShimmer {
        0%   { background-position: -300% center; }
        100% { background-position: 300% center; }
      }
      @keyframes pdCalmBreathe {
        0%, 100% { filter: drop-shadow(0 0 5px rgba(168,85,247,0.3)) drop-shadow(0 0 12px rgba(192,132,252,0.2)); letter-spacing: 0em; }
        50%       { filter: drop-shadow(0 0 16px rgba(168,85,247,0.8)) drop-shadow(0 0 32px rgba(216,180,254,0.4)); letter-spacing: 0.02em; }
      }
      .pd-title-mind {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 22%,
          #c084fc 38%, #a855f7 50%, #d8b4fe 60%,
          #ffffff 76%, #ffffff 100%
        );
        background-size: 320% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: pdTitleShimmer 8s ease-in-out infinite;
      }
      .pd-title-calm {
        -webkit-text-fill-color: #e9d5ff; color: #e9d5ff;
        display: inline-block;
        animation: pdCalmBreathe 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tab = TABS.find(t => t.id === activeTab) || TABS[0];
  const Panel = PANEL_MAP[activeTab] || D0Panel;

  const HERO_STATS = [
    { v: '8', l: 'Module', tip: 'D0–D7: từ nhập môn, stress, thở, thiền, journal, detox, kỷ luật đến theo dõi', idx: 'hero-d-0' },
    { v: '5ph', l: 'Mỗi ngày', tip: '5 phút Mind Reset mỗi ngày là đủ để bắt đầu thay đổi trạng thái tinh thần', idx: 'hero-d-1' },
    { v: '12', l: 'Tuần lộ trình', tip: 'Từ nhận diện stress → thiền ngắn → journaling → digital detox → kỷ luật mềm', idx: 'hero-d-2' },
    { v: '100', l: 'Calm Score', tip: 'Thang điểm tự đánh giá mỗi ngày: thở + journal + detox + routine tối + kỷ luật mềm', idx: 'hero-d-3' },
  ];

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      {/* Breadcrumb */}
      <Link to="/pillars" className="inline-flex items-center gap-2 text-xs text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Sống Khỏe 360
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${PURPLE_RGB},0.06)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)` }}>🧘</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in-up">
            <span className="pd-title-mind">Tâm Trí </span><span className="pd-title-calm">An Nhiên</span>
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: PURPLE, background: `rgba(${PURPLE_RGB},0.1)`, borderColor: `rgba(${PURPLE_RGB},0.2)` }}>Trụ Cột D · Mind & Calm</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">An nhiên không phải là không có áp lực. An nhiên là biết dừng lại, thở, nhìn rõ vấn đề, chọn một bước nhỏ và tiếp tục. Không cần trở thành người luôn bình tĩnh — chỉ cần biết cách quay lại trạng thái ổn định nhanh hơn.</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        {HERO_STATS.map(s => (
          <div key={s.idx} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={s.idx} color={PURPLE} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: PURPLE }}>{s.v}</div>
              <div className="text-xs text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero image */}
      <div className="pd-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop" alt="Mind & Calm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: PURPLE, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${PURPLE_RGB},0.2)` }}>Mind & Calm · 8 Module · 12 Tuần</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Tabs */}
      <RevealBlock className="mb-8">
        <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-3 backdrop-blur-md border-b border-border" style={{ background: 'rgba(10,10,10,0.85)' }}>
          <div className="flex gap-1 overflow-x-auto scrollbar-none max-w-4xl">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${activeTab === t.id ? 'text-white' : 'text-muted hover:text-text'}`} style={{ background: activeTab === t.id ? t.color : 'transparent' }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`${tab.frame} rounded-2xl p-[1.5px] mt-4`}>
          <div className="rounded-2xl bg-surface p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{tab.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-text">{tab.label}</h2>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: tab.color }}>{tab.id.toUpperCase()} · Tâm Trí An Nhiên</div>
              </div>
            </div>
            <Panel color={tab.color} />
          </div>
        </div>
      </RevealBlock>

      {/* Core quote */}
      <RevealBlock className="mb-14">
        <blockquote className="rounded-2xl p-6 border-l-4 relative overflow-hidden" style={{ borderLeftColor: PURPLE, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <div className="text-4xl absolute right-6 top-4 opacity-10" style={{ color: PURPLE }}>"</div>
          <p className="text-lg font-medium text-text leading-relaxed italic">"Tâm trí an nhiên không phải là không còn áp lực, mà là biết cách hạ nhịp, quay lại và sống khỏe bền hơn mỗi ngày."</p>
          <cite className="text-xs text-muted mt-3 block">— Triết lý Tâm Trí An Nhiên</cite>
        </blockquote>
      </RevealBlock>

      {/* Teaser sections */}
      <RevealBlock>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Khám Phá Chi Tiết</h2>
        <p className="text-muted text-sm mb-10">12 trang chuyên sâu — từ nền tảng đến thực hành và công cụ theo dõi.</p>

        <TeaserSection title="Nền Tảng & Nhận Diện">
          <TeaserCard to="/pillar/d/stress" color="#8b5cf6" rgb="139,92,246" icon="🌪️" category="Nền Tảng" title="Hiểu Stress & Vòng Lặp Lo Âu" accent="3 tầng · Trigger · Vòng lặp" desc="Stress không phải kẻ thù. Hiểu cơ chế để nhận diện sớm và chèn điểm dừng vào vòng lặp lo âu–thói quen." features={['3 tầng: cơ thể, cảm xúc, hành vi', 'Mô hình Trigger → Hành vi → Hậu quả', 'Kỹ thuật đặt tên cho suy nghĩ']} stats={[{ v: '3', l: 'Tầng' }, { v: '5', l: 'Trigger' }]} image="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80" imageAlt="Stress" cta="Hiểu stress →" />
          <TeaserCard to="/pillar/d/assessment" color="#a855f7" rgb="168,85,247" icon="📋" category="Đánh Giá" title="Mind & Calm Assessment" accent="7 câu hỏi · 3 Track" desc="Đánh giá trạng thái tinh thần hiện tại qua 7 khía cạnh. Xác định Track phù hợp và hành động ưu tiên." features={['Điểm Mind & Calm ban đầu', 'Xác định Track 1–3', 'Đề xuất hành động cá nhân hóa']} stats={[{ v: '7', l: 'Câu hỏi' }, { v: '3', l: 'Tracks' }]} image="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80" imageAlt="Assessment" cta="Đánh giá ngay →" />
        </TeaserSection>

        <TeaserSection title="Công Cụ Thực Hành">
          <TeaserCard to="/pillar/d/breathing" color="#6366f1" rgb="99,102,241" icon="🫁" category="Thực Hành" title="Kỹ Thuật Thở" accent="4 kỹ thuật · Timer tương tác" desc="Thở cơ hoành, box breathing 4-4-4-4, thở 4-7-8 và reset 2 phút — mỗi kỹ thuật cho một tình huống cụ thể." features={['Thở cơ hoành: nền tảng', 'Box breathing: tập trung & bình tĩnh', 'Thở 4-7-8: chuẩn bị ngủ', 'Reset 2 phút: dùng ngay khi quá tải']} stats={[{ v: '4', l: 'Kỹ thuật' }, { v: '2ph', l: 'Tối thiểu' }]} image="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80" imageAlt="Breathing" cta="Xem kỹ thuật →" />
          <TeaserCard to="/pillar/d/meditation" color="#d946ef" rgb="217,70,239" icon="🧘" category="Thực Hành" title="Thiền Ngắn & Chánh Niệm" accent="3 phút · Body scan · Mindful walking" desc="Thiền không cần ngồi 1 tiếng. 3 phút quan sát hơi thở, 5 phút body scan trước ngủ, chánh niệm khi ăn và đi bộ." features={['Thiền 3 phút cho người mới', 'Body scan 5 phút trước ngủ', 'Chánh niệm khi ăn & đi bộ', 'Lộ trình tăng dần 3→10 phút']} stats={[{ v: '3ph', l: 'Bắt đầu' }, { v: '4', l: 'Kiểu thiền' }]} image="https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80" imageAlt="Meditation" cta="Thực hành →" />
          <TeaserCard to="/pillar/d/body-scan" color="#ec4899" rgb="236,72,153" icon="🔍" category="Thực Hành" title="Body Scan" accent="10 phút · Phục hồi sâu" desc="Body scan 10 phút từng vùng cơ thể — từ trán đến ngón chân. Công cụ thiền tốt nhất cho người khó ngủ và căng cơ." features={['Scan từng vùng cơ thể có hướng dẫn', 'Progressive muscle relaxation', 'Dùng sau tập nặng hoặc trước ngủ', 'Audio guidance từng bước']} stats={[{ v: '10ph', l: 'Thời gian' }, { v: '8', l: 'Vùng scan' }]} image="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" imageAlt="Body Scan" cta="Bắt đầu scan →" />
          <TeaserCard to="/pillar/d/journaling" color="#ec4899" rgb="236,72,153" icon="📓" category="Thực Hành" title="Journaling 5 Dòng" accent="5 phút · Mỗi tối" desc="5 câu hỏi mỗi tối giúp dọn rác trong đầu, nhận ra cảm xúc và chuẩn bị cho ngày mai nhẹ nhàng hơn." features={['Mẫu journal 5 dòng cơ bản', 'Journal khi ăn theo cảm xúc', 'Journal sau ngày fail', 'Template in & dùng']} stats={[{ v: '5', l: 'Câu hỏi' }, { v: '5ph', l: 'Mỗi tối' }]} image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80" imageAlt="Journaling" cta="Xem template →" />
        </TeaserSection>

        <TeaserSection title="Quản Lý Tâm Trí">
          <TeaserCard to="/pillar/d/brain-dump" color="#0ea5e9" rgb="14,165,233" icon="🧠" category="Công Cụ" title="Xả Não & Brain Dump" accent="Brain dump · Vòng tròn kiểm soát" desc="Khi đầu quá nhiều việc, viết tất cả ra giấy rồi phân loại: làm ngay, lên kế hoạch, hoặc buông tạm." features={['Kỹ thuật Brain Dump 5 phút', 'Vòng tròn kiểm soát: tôi kiểm soát được gì?', 'Phân loại: làm ngay / kế hoạch / buông', 'Danh sách lo âu']} stats={[{ v: '5ph', l: 'Brain dump' }, { v: '3', l: 'Nhóm việc' }]} image="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80" imageAlt="Brain Dump" cta="Xả não ngay →" />
          <TeaserCard to="/pillar/d/digital-detox" color="#0ea5e9" rgb="14,165,233" icon="📵" category="Công Cụ" title="Digital Detox" accent="3 mức · Không cực đoan" desc="Giảm màn hình thông minh — không ép bỏ điện thoại hoàn toàn mà thiết kế môi trường số giúp não có khoảng thở." features={['3 mức: Dễ → Chuẩn → Nâng cao', 'Menu thay thế cho lướt điện thoại', 'Thiết kế môi trường số', '7-day digital detox plan']} stats={[{ v: '3', l: 'Mức độ' }, { v: '7', l: 'Ngày plan' }]} image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80" imageAlt="Digital Detox" cta="Bắt đầu detox →" />
          <TeaserCard to="/pillar/d/gentle-discipline" color="#10b981" rgb="16,185,129" icon="🌱" category="Tư Duy" title="Kỷ Luật Mềm" accent="Quy tắc 1% · Không tự trách" desc="Kỷ luật mềm là cách duy trì thói quen mà không tự làm mình kiệt sức. Quay lại bằng bản nhỏ nhất sau mỗi ngày lệch." features={['Quy tắc 1% quay lại sau ngày fail', 'Bản tối thiểu cho mọi thói quen', 'Xử lý ăn uống cảm xúc', 'Tối giản mục tiêu: 1–2 thay đổi/giai đoạn']} stats={[{ v: '1%', l: 'Quay lại' }, { v: '6', l: 'Tình huống' }]} image="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80" imageAlt="Gentle Discipline" cta="Học kỷ luật mềm →" />
          <TeaserCard to="/pillar/d/habits" color="#10b981" rgb="16,185,129" icon="🔗" category="Tư Duy" title="Thói Quen Nhỏ Bền Vững" accent="Habit stacking · 3 phút/ngày" desc="Thói quen tốt không đến từ ý chí mạnh — mà từ hệ thống nhỏ lặp lại. Ghép thói quen mới vào điểm neo hiện có." features={['Habit stacking: ghép vào thói quen cũ', 'Cue → Routine → Reward', '7 thói quen nhỏ Mind & Calm', 'Streak tracker tích hợp']} stats={[{ v: '7', l: 'Thói quen' }, { v: '21', l: 'Ngày hình thành' }]} image="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80" imageAlt="Habits" cta="Xây thói quen →" />
        </TeaserSection>

        <TeaserSection title="Theo Dõi & Lộ Trình">
          <TeaserCard to="/pillar/d/checklist" color="#f59e0b" rgb="245,158,11" icon="✅" category="Công Cụ" title="Daily Calm Checklist" accent="6 mục · Calm Score · Streak" desc="Checklist hằng ngày với 6 hành động Mind & Calm. Theo dõi điểm số, chuỗi ngày liên tiếp và mood từng ngày." features={['6 mục checklist Mind & Calm', 'Calm Score 100 điểm/ngày', 'Mood tracker 😣→😄', 'Streak ngày liên tiếp']} stats={[{ v: '6', l: 'Mục hàng ngày' }, { v: '100', l: 'Điểm tối đa' }]} image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80" imageAlt="Checklist" cta="Mở checklist →" />
          <TeaserCard to="/pillar/d/roadmap" color="#a855f7" rgb="168,85,247" icon="🗺️" category="Lộ Trình" title="Lộ Trình 12 Tuần Mind & Calm" accent="6 giai đoạn · 3–10 phút/ngày" desc="Từ nhận diện stress → thở → journaling → digital detox → kỷ luật mềm → cá nhân hóa routine. Mỗi ngày chỉ cần 3–10 phút." features={['Tuần 1–2: Nhận diện stress & reset', 'Tuần 3–4: Thở có chủ ý', 'Tuần 5–6: Journaling & xả não', 'Tuần 7–12: Detox, kỷ luật, cá nhân hóa']} stats={[{ v: '12', l: 'Tuần' }, { v: '6', l: 'Giai đoạn' }]} image="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80" imageAlt="Roadmap" cta="Xem lộ trình →" />
        </TeaserSection>
      </RevealBlock>
    </div>
  );
}
