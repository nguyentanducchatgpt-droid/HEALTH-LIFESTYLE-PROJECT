import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'e-sm-orbit-kf';
const ORBIT_CLASS = 'e-sm-orbit-ring';
const ORBIT_PROP = '--e-sm-orbit-angle';

const METRICS = [
  { label: 'Cân nặng', freq: 'Hàng tuần', when: 'Sáng, sau vệ sinh, trước ăn', tool: 'Cân sức khỏe', note: 'Cân cùng điều kiện mỗi lần. Dao động 1–2kg/ngày là bình thường do nước.' },
  { label: 'Huyết áp', freq: 'Hàng ngày (nếu có vấn đề) hoặc hàng tuần', when: 'Sáng và tối, sau nghỉ 5 phút', tool: 'Máy đo HA tự động', note: 'Ghi lại cả hai lần đo. Trung bình 7 ngày mới phản ánh đúng tình trạng.' },
  { label: 'Đường huyết', freq: 'Hàng ngày (tiểu đường) hoặc hàng tháng', when: 'Lúc đói và sau ăn 2h', tool: 'Máy đo đường huyết', note: 'Theo dõi xu hướng quan trọng hơn một con số đơn lẻ.' },
  { label: 'Nhịp tim nghỉ ngơi', freq: 'Hàng tuần', when: 'Ngay khi thức dậy, trước khi ra khỏi giường', tool: 'Đồng hồ thông minh hoặc đếm tay', note: '60–100 lần/phút bình thường. Tập thể thao đều → nhịp tim nghỉ giảm.' },
  { label: 'Chất lượng giấc ngủ', freq: 'Hàng ngày', when: 'Ngay khi thức dậy', tool: 'App theo dõi giấc ngủ, nhật ký', note: 'Đánh giá: thời gian ngủ, số lần thức đêm, cảm giác khi dậy.' },
  { label: 'Vòng eo', freq: 'Hàng tháng', when: 'Sáng, sau thở ra bình thường', tool: 'Thước dây', note: 'Đo ngang rốn. Nam: < 90cm; Nữ: < 80cm là mục tiêu sức khỏe.' },
  { label: 'Mức năng lượng', freq: 'Hàng ngày', when: 'Giữa buổi sáng và chiều', tool: 'Thang điểm 1–10', note: 'Theo dõi bằng số hoặc emoji. Giúp phát hiện pattern liên quan ăn uống, ngủ nghỉ.' },
];

const DAILY_CHECK = [
  { q: 'Bạn ngủ bao nhiêu tiếng tối qua?', type: 'slider', min: 4, max: 10, unit: 'giờ', key: 'sleep' },
  { q: 'Đã uống đủ nước chưa? (khoảng 2L)', type: 'bool', key: 'water' },
  { q: 'Cảm thấy đau hoặc khó chịu bất thường không?', type: 'bool', key: 'pain', invert: true },
  { q: 'Tâm trạng hôm nay ra sao?', type: 'select', opts: ['Tệ', 'Bình thường', 'Tốt', 'Rất tốt'], key: 'mood' },
  { q: 'Đã vận động ít nhất 20 phút chưa?', type: 'bool', key: 'exercise' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-sm-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-sm-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function DailyCheckForm() {
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);

  function set(key, val) {
    setAnswers(p => ({ ...p, [key]: val }));
  }

  function save() {
    const today = new Date().toLocaleDateString('vi-VN');
    const log = { date: today, ...answers };
    try {
      const history = JSON.parse(localStorage.getItem('healthapp_daily_check') || '[]');
      const filtered = history.filter(h => h.date !== today);
      localStorage.setItem('healthapp_daily_check', JSON.stringify([log, ...filtered].slice(0, 30)));
    } catch { }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
      <div>
        <label className="text-lg text-text mb-1 block">Bạn ngủ bao nhiêu tiếng tối qua?</label>
        <div className="flex items-center gap-3">
          <input type="range" min={4} max={10} step={0.5} value={answers.sleep || 7} onChange={e => set('sleep', +e.target.value)} className="flex-1" />
          <span className="text-lg font-bold w-12 text-right" style={{ color: COLOR }}>{answers.sleep || 7} giờ</span>
        </div>
      </div>
      {[
        { q: 'Đã uống đủ nước chưa? (~2L)', key: 'water' },
        { q: 'Đã vận động ít nhất 20 phút?', key: 'exercise' },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-lg text-text">{item.q}</span>
          <div className="flex gap-2">
            {['Rồi', 'Chưa'].map(opt => (
              <button key={opt} onClick={() => set(item.key, opt === 'Rồi')}
                className="px-3 py-1 rounded-lg text-base font-bold border transition-colors"
                style={answers[item.key] === (opt === 'Rồi') ? { background: COLOR, color: 'white', borderColor: COLOR } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div>
        <label className="text-lg text-text mb-2 block">Tâm trạng hôm nay?</label>
        <div className="flex gap-2 flex-wrap">
          {['😞 Tệ', '😐 Bình thường', '😊 Tốt', '😄 Rất tốt'].map(opt => (
            <button key={opt} onClick={() => set('mood', opt)}
              className="px-3 py-1 rounded-lg text-base border transition-colors"
              style={answers.mood === opt ? { background: COLOR, color: 'white', borderColor: COLOR } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button onClick={save} className="w-full py-2 rounded-xl text-lg font-bold text-white transition-all" style={{ background: saved ? '#22c55e' : COLOR }}>
        {saved ? '✓ Đã lưu!' : 'Lưu Check-in Hôm Nay'}
      </button>
    </div>
  );
}

export default function HealthSelfMonitoringPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eSmOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eSmOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>📊</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Tự Theo Dõi Sức Khỏe</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Biometric tracking · Daily check-in
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi các chỉ số sức khỏe theo thời gian giúp bạn nhận ra pattern, phát hiện thay đổi sớm, và đưa ra quyết định lối sống dựa trên dữ liệu thực tế của cơ thể bạn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop" alt="Tự theo dõi" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Xu hướng quan trọng hơn một con số
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg · {b0.height}cm — Bắt đầu theo dõi cân nặng, huyết áp và vòng eo hàng tuần để có baseline cá nhân.</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>7 Chỉ Số Cần Theo Dõi</h2>
        <p className="text-muted text-lg mb-6">Không nhất thiết theo dõi tất cả mỗi ngày — mỗi chỉ số có tần suất phù hợp riêng.</p>
        <div className="space-y-3">
          {METRICS.map((m, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <div className="font-bold text-lg text-text">{m.label}</div>
                  <div className="text-base text-muted mt-0.5">{m.when} · {m.tool}</div>
                </div>
                <span className="text-base px-2 py-1 rounded-full shrink-0" style={{ background: `rgba(${RGB},0.12)`, color: COLOR }}>{m.freq}</span>
              </div>
              <p className="text-base text-muted">{m.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Check-in Hằng Ngày</h2>
        <p className="text-muted text-lg mb-4">5 câu hỏi đơn giản, mỗi ngày 30 giây. Dữ liệu lưu trong thiết bị của bạn.</p>
        <DailyCheckForm />
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text">Nguyên Tắc Theo Dõi Hiệu Quả</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li>• <strong className="text-text">Nhất quán về điều kiện đo</strong> — cùng thời điểm, cùng thiết bị, cùng trạng thái</li>
            <li>• <strong className="text-text">Ghi ngay, không trì hoãn</strong> — bộ nhớ không đáng tin cậy</li>
            <li>• <strong className="text-text">Nhìn xu hướng 4–8 tuần</strong>, không lo lắng về biến động ngày</li>
            <li>• <strong className="text-text">Không ám ảnh với số</strong> — mục tiêu là nhận biết thay đổi, không phải tối ưu hóa mỗi ngày</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
