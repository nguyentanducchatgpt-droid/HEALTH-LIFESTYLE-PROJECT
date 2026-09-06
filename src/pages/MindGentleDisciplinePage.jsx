import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'd-discipline-orbit-kf';
const ORBIT_CLASS = 'd-discipline-orbit-ring';
const PROP = '--d-discipline-orbit-angle';

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

const PRINCIPLES = [
  { icon: '🌱', t: 'Nhỏ Hơn Là Được', d: 'Mục tiêu 1% mỗi ngày bền hơn mục tiêu 100% một lần. Não bộ thích thành công nhỏ liên tiếp.' },
  { icon: '💜', t: 'Tự Trắc Ẩn Là Nền Tảng', d: 'Nghiêm khắc với bản thân làm tăng cortisol và giảm động lực. Tử tế với bản thân thực ra hiệu quả hơn.' },
  { icon: '🔄', t: 'Hệ Thống Hơn Ý Chí', d: 'Ý chí là tài nguyên hữu hạn. Tạo môi trường và thói quen giúp hành động đúng xảy ra tự động.' },
  { icon: '📍', t: 'Bản Sắc Trước Hành Động', d: 'Thay vì "tôi muốn tập gym", hãy nghĩ "tôi là người chăm sóc sức khỏe". Bản sắc định hình hành động.' },
  { icon: '🎯', t: 'Linh Hoạt Trong Cứng Nhắc', d: 'Kỷ luật mềm cho phép thay đổi phương pháp nhưng giữ vững mục tiêu. Miss 1 ngày OK, miss 2 ngày liên tiếp là cần chú ý.' },
  { icon: '🏆', t: 'Ăn Mừng Nhỏ Mỗi Ngày', d: 'Ghi nhận tiến bộ dù nhỏ kích hoạt dopamine — hóa chất tạo động lực tiếp tục.' },
];

const VS = [
  { soft: 'Tôi đã làm được một phần', harsh: 'Tôi thất bại hoàn toàn' },
  { soft: 'Ngày mai tôi sẽ thử lại', harsh: 'Tôi không có ý chí' },
  { soft: 'Tôi học được điều gì từ hôm nay?', harsh: 'Tôi thật tệ' },
  { soft: 'Tôi cần nghỉ ngơi để tốt hơn', harsh: 'Nghỉ là lười biếng' },
  { soft: 'Tôi không hoàn hảo và điều đó OK', harsh: 'Phải hoàn hảo mới là tốt' },
];

const PRACTICES = [
  { time: 'Sáng', icon: '🌅', habits: ['Uống 1 ly nước trước khi cầm điện thoại', 'Viết 1 ý định cho ngày hôm nay', 'Di chuyển cơ thể ít nhất 5 phút'] },
  { time: 'Trưa', icon: '☀️', habits: ['Đánh giá nhanh: buổi sáng đã theo plan chưa?', 'Ăn ít nhất 1 bữa có rau xanh', 'Nghỉ 5-10 phút không màn hình'] },
  { time: 'Tối', icon: '🌙', habits: ['Viết 3 điều tốt đã làm hôm nay', 'Chuẩn bị 1 việc cho ngày mai', 'Tắt màn hình 30 phút trước ngủ'] },
];

function SelfTalkTool() {
  const [text, setText] = useState('');
  const [reframed, setReframed] = useState('');
  const examples = [
    ['Tôi thật tệ', 'Tôi đang học và đang cố gắng. Hôm nay không tốt nhưng ngày mai là cơ hội mới.'],
    ['Tôi không có ý chí', 'Ý chí là cơ bắp, cần luyện tập. Tôi sẽ bắt đầu nhỏ hơn để thành công nhiều hơn.'],
    ['Tôi thất bại hoàn toàn', 'Tôi đã làm được phần lớn. Một sai sót không định nghĩa toàn bộ nỗ lực của tôi.'],
  ];
  const [exIdx, setExIdx] = useState(0);

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}>
      <p className="text-lg font-semibold" style={{ color: COLOR }}>Luyện Tập Tái Khung Suy Nghĩ Tiêu Cực</p>
      <div className="space-y-2">
        <div>
          <label className="text-base text-muted mb-1 block">Suy nghĩ tiêu cực bạn hay nói với bản thân:</label>
          <textarea className="w-full rounded-xl border bg-bg text-text text-lg p-3 resize-none min-h-[60px] focus:outline-none focus:ring-2"
            style={{ borderColor: `${COLOR}30`, '--tw-ring-color': `${COLOR}60` }}
            placeholder="VD: Tôi thật tệ, tôi không có ý chí..."
            value={text} onChange={e => setText(e.target.value)} rows={2} />
        </div>
        <div>
          <label className="text-base text-muted mb-1 block">Tái khung thành câu tích cực hơn:</label>
          <textarea className="w-full rounded-xl border bg-bg text-text text-lg p-3 resize-none min-h-[60px] focus:outline-none focus:ring-2"
            style={{ borderColor: `${COLOR}30`, '--tw-ring-color': `${COLOR}60` }}
            placeholder="Viết lại câu trên theo hướng trắc ẩn với bản thân..."
            value={reframed} onChange={e => setReframed(e.target.value)} rows={2} />
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <p className="text-base text-muted mb-3">Ví dụ thực tế ({exIdx + 1}/{examples.length}):</p>
        <div className="space-y-2 rounded-xl bg-surface border border-border p-4">
          <div className="flex gap-2 items-start"><span className="text-base font-bold text-red-400 shrink-0">❌</span><p className="text-lg text-muted">{examples[exIdx][0]}</p></div>
          <div className="flex gap-2 items-start"><span className="text-base font-bold shrink-0" style={{ color: COLOR }}>✓</span><p className="text-lg text-text">{examples[exIdx][1]}</p></div>
        </div>
        <div className="flex gap-2 mt-3">
          {examples.map((_, i) => (
            <button key={i} onClick={() => setExIdx(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === exIdx ? COLOR : '#555' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MindGentleDisciplinePage() {
  const { t: tM } = useTranslation('mind');
  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dDisciplineOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dDisciplineOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>{tM('breadcrumb')}</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🌿</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tM('gentle_discipline.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>{tM('gentle_discipline.badge')}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tM('gentle_discipline.desc')}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop" alt="Gentle Discipline" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>{tM('gentle_discipline.img_caption')}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <p className="text-lg text-text leading-relaxed italic">"Sự tử tế với bản thân không phải sự yếu đuối — đó là nền tảng của kỷ luật bền vững. Người tử tế với bản thân khi thất bại thường tiếp tục cố gắng lâu dài hơn."</p>
          <p className="text-base mt-3" style={{ color: COLOR }}>— Kristin Neff, Self-Compassion Research</p>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>6 Nguyên Tắc Kỷ Luật Mềm</h2>
        <p className="text-muted text-lg mb-6">Xây dựng kỷ luật dựa trên sức mạnh nội tâm, không phải nỗi sợ</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRINCIPLES.map(p => (
            <div key={p.t} className="rounded-2xl border border-border bg-surface p-5 hover:border-emerald-500/30 transition-colors">
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-bold text-text mb-2">{p.t}</div>
              <p className="text-lg text-muted leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Kỷ Luật Mềm vs Khắc Nghiệt</h2>
        <p className="text-muted text-lg mb-6">Thay thế ngôn ngữ tự phán xét bằng tự trắc ẩn</p>
        <div className="space-y-3">
          {VS.map((v, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-red-400 text-lg shrink-0 mt-0.5">✗</span>
                <p className="text-lg text-muted">{v.harsh}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5" style={{ color: COLOR }}>✓</span>
                <p className="text-lg text-text">{v.soft}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thực Hành Tái Khung</h2>
        <p className="text-muted text-lg mb-6">Luyện tập nói chuyện tử tế với bản thân</p>
        <SelfTalkTool />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Khung Thực Hành 3 Buổi</h2>
        <p className="text-muted text-lg mb-6">Micro-habits trong ngày để xây kỷ luật bền vững</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRACTICES.map(p => (
            <div key={p.time} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-bold mb-3" style={{ color: COLOR }}>{p.time}</div>
              <ul className="space-y-2">
                {p.habits.map(h => (
                  <li key={h} className="flex items-start gap-2 text-lg text-muted">
                    <span className="shrink-0 mt-1" style={{ color: COLOR }}>·</span>{h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>{tM('breadcrumb_back')}</span>
      </Link>
    </div>
  );
}
