import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

const COLOR = '#3b82f6';
const RGB = '59,130,246';
const ORBIT_ID = 'pe-orbit-kf';
const ORBIT_CLASS = 'pe-orbit-ring';
const PROP = '--pe-orbit-angle';
const E0_KEY = 'healthapp_e0_profile';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

function TeaserSection({ title, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-bold uppercase tracking-widest text-muted px-3">{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features = [], stats = [], image, imageAlt, cta }) {
  return (
    <Link to={to} className="group relative rounded-3xl border border-border bg-surface overflow-hidden flex flex-col md:flex-row hover:border-[rgba(var(--tc-rgb),0.35)] transition-all duration-300 hover:-translate-y-0.5"
      style={{ '--tc-rgb': rgb }}>
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color }}>{category}</span>
          </div>
          <h3 className="text-lg font-bold text-text mb-1 leading-snug">{title}</h3>
          <p className="text-xs font-semibold mb-3" style={{ color }}>{accent}</p>
          <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
          {features.length > 0 && (
            <ul className="space-y-1 mb-4">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />{f}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between">
          {stats.length > 0 && (
            <div className="flex gap-4">
              {stats.map(s => (
                <div key={s.l}>
                  <div className="text-base font-black" style={{ color }}>{s.v}</div>
                  <div className="text-xs text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          )}
          <span className="text-xs font-bold ml-auto" style={{ color }}>{cta}</span>
        </div>
      </div>
      {image && (
        <div className="relative w-full md:w-[42%] h-40 md:h-auto shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ opacity: 0.3 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent md:hidden" />
        </div>
      )}
    </Link>
  );
}

const TABS = [
  { id: 'e0', label: 'Hồ Sơ', icon: '🏥', color: '#3b82f6', rgb: '59,130,246', frameClass: 'pe-frame-0' },
  { id: 'e1', label: 'Hiểu Chỉ Số', icon: '📊', color: '#0ea5e9', rgb: '14,165,233', frameClass: 'pe-frame-1' },
  { id: 'e2', label: 'Tự Theo Dõi', icon: '🔍', color: '#14b8a6', rgb: '20,184,166', frameClass: 'pe-frame-2' },
  { id: 'e3', label: 'Dấu Nguy Hiểm', icon: '🚨', color: '#ef4444', rgb: '239,68,68', frameClass: 'pe-frame-3' },
  { id: 'e4', label: 'Phòng Bệnh', icon: '🛡️', color: '#10b981', rgb: '16,185,129', frameClass: 'pe-frame-4' },
  { id: 'e5', label: 'Khám Định Kỳ', icon: '📅', color: '#84cc16', rgb: '132,204,22', frameClass: 'pe-frame-5' },
  { id: 'e6', label: 'An Toàn Thuốc', icon: '💊', color: '#8b5cf6', rgb: '139,92,246', frameClass: 'pe-frame-6' },
  { id: 'e7', label: 'Lọc Thông Tin', icon: '🔎', color: '#6366f1', rgb: '99,102,241', frameClass: 'pe-frame-7' },
];

const HERO_TIPS = [
  '8 module kiến thức từ cơ bản đến nâng cao — bao gồm chỉ số, cảnh báo, phòng bệnh và lọc thông tin',
  'Lộ trình 12 tuần từ mù mờ về sức khỏe đến tự quản lý chỉ số và phòng bệnh chủ động',
  '5 chỉ số sức khỏe quan trọng nhất: BMI, vòng eo, huyết áp, đường huyết, mỡ máu',
  'Health Literacy Score 100 điểm — đánh giá mức độ hiểu biết sức khỏe của bạn',
];

function TabE0() {
  const [form, setForm] = useState(() => { try { return JSON.parse(localStorage.getItem(E0_KEY)) || {}; } catch { return {}; } });
  const set = (k, v) => { const next = { ...form, [k]: v }; setForm(next); localStorage.setItem(E0_KEY, JSON.stringify(next)); };
  const bmi = form.weight && form.height ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1) : null;
  const bmiLabel = bmi ? (bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì') : '';
  const bmiColor = bmi ? (bmi < 18.5 ? '#f59e0b' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444') : '#888';
  const fields = [
    { k: 'age', l: 'Tuổi', t: 'number', ph: 'VD: 30', unit: 'tuổi' },
    { k: 'weight', l: 'Cân nặng', t: 'number', ph: 'VD: 65', unit: 'kg' },
    { k: 'height', l: 'Chiều cao', t: 'number', ph: 'VD: 168', unit: 'cm' },
    { k: 'waist', l: 'Vòng eo', t: 'number', ph: 'VD: 80', unit: 'cm' },
  ];
  const diseaseOpts = ['Không có bệnh nền', 'Tăng huyết áp', 'Đái tháo đường', 'Rối loạn mỡ máu', 'Bệnh tim mạch', 'Bệnh thận', 'Bệnh gan', 'Bệnh phổi'];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
        <p className="text-sm font-semibold mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Sức Khỏe Cá Nhân (E0)</p>
        <p className="text-xs text-muted">Lưu tự động trên thiết bị. Dùng để cá nhân hóa nội dung trong toàn bộ Trụ cột E.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.k}>
            <label className="text-xs text-muted mb-1 block">{f.l}</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2">
              <input type={f.t} placeholder={f.ph} value={form[f.k] || ''} onChange={e => set(f.k, +e.target.value)}
                className="flex-1 bg-transparent text-sm text-text focus:outline-none w-0 min-w-0" />
              <span className="text-xs text-muted shrink-0">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Giới tính</label>
        <div className="flex gap-2">
          {[{ v: 'male', l: '♂ Nam' }, { v: 'female', l: '♀ Nữ' }].map(g => (
            <button key={g.v} onClick={() => set('sex', g.v)}
              className="flex-1 py-2 rounded-xl border text-sm font-semibold transition-all"
              style={form.sex === g.v ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {g.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Bệnh nền</label>
        <div className="flex flex-wrap gap-2">
          {diseaseOpts.map(d => (
            <button key={d} onClick={() => { const cur = form.diseases || []; const next = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d]; set('diseases', next); }}
              className="px-3 py-1 rounded-full text-xs border transition-all"
              style={(form.diseases || []).includes(d) ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {d}
            </button>
          ))}
        </div>
      </div>
      {bmi && (
        <div className="rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: `${bmiColor}30`, background: `${bmiColor}08` }}>
          <div className="text-center">
            <div className="text-3xl font-black" style={{ color: bmiColor }}>{bmi}</div>
            <div className="text-xs text-muted">BMI</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: bmiColor }}>{bmiLabel}</div>
            <p className="text-xs text-muted">Vòng eo: {form.waist || '–'} cm · {form.sex === 'female' ? 'Nữ: ngưỡng >80 cm' : 'Nam: ngưỡng >90 cm'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TabE1() {
  const METRICS = [
    { icon: '⚖️', t: 'BMI', d: 'Chỉ số khối cơ thể = Cân nặng (kg) / Chiều cao² (m). Sàng lọc nguy cơ. Không phân biệt mỡ và cơ.', ranges: [{ l: '< 18.5', n: 'Thiếu cân', c: '#f59e0b' }, { l: '18.5–24.9', n: 'Bình thường', c: '#10b981' }, { l: '25–29.9', n: 'Thừa cân', c: '#f59e0b' }, { l: '≥ 30', n: 'Béo phì', c: '#ef4444' }], link: '/pillar/e/bmi' },
    { icon: '📏', t: 'Vòng Eo', d: 'Phản ánh mỡ bụng nội tạng — nguy cơ tim mạch và chuyển hóa quan trọng hơn cân nặng.', ranges: [{ l: 'Nam <90cm', n: 'OK', c: '#10b981' }, { l: 'Nam ≥90cm', n: 'Nguy cơ', c: '#ef4444' }, { l: 'Nữ <80cm', n: 'OK', c: '#10b981' }, { l: 'Nữ ≥80cm', n: 'Nguy cơ', c: '#ef4444' }], link: '/pillar/e/bmi' },
    { icon: '❤️', t: 'Huyết Áp', d: 'Bình thường: <120/80 mmHg. Không triệu chứng khi cao — cần đo định kỳ.', ranges: [{ l: '<120/80', n: 'Bình thường', c: '#10b981' }, { l: '130–139/80–89', n: 'Gđ 1', c: '#f59e0b' }, { l: '≥140/90', n: 'Gđ 2', c: '#ef4444' }], link: '/pillar/e/blood-pressure' },
    { icon: '🍬', t: 'Đường Huyết Đói', d: 'Nồng độ glucose sau nhịn ăn ≥8h. Phản ánh kiểm soát đường huyết lúc nghỉ.', ranges: [{ l: '<100 mg/dL', n: 'Bình thường', c: '#10b981' }, { l: '100–125', n: 'Tiền ĐTĐ', c: '#f59e0b' }, { l: '≥126', n: 'ĐTĐ*', c: '#ef4444' }], link: '/pillar/e/blood-sugar' },
    { icon: '🧪', t: 'HbA1c', d: 'Đường huyết trung bình 2–3 tháng. Không cần nhịn ăn. Đánh giá kiểm soát lâu dài.', ranges: [{ l: '<5.7%', n: 'Bình thường', c: '#10b981' }, { l: '5.7–6.4%', n: 'Tiền ĐTĐ', c: '#f59e0b' }, { l: '≥6.5%', n: 'ĐTĐ*', c: '#ef4444' }], link: '/pillar/e/blood-sugar' },
    { icon: '🫀', t: 'Mỡ Máu', d: 'LDL-C, HDL-C, Triglyceride, Cholesterol TP. Liên quan xơ vữa động mạch.', ranges: [{ l: 'LDL<100', n: 'Lý tưởng', c: '#10b981' }, { l: 'HDL>60', n: 'Bảo vệ', c: '#10b981' }, { l: 'TG≥200', n: 'Cao', c: '#ef4444' }], link: '/pillar/e/lipids' },
  ];
  return (
    <div className="space-y-3">
      {METRICS.map(m => (
        <Link to={m.link} key={m.t} className="block rounded-2xl border border-border bg-surface/60 p-4 hover:border-blue-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{m.icon}</span>
            <span className="font-bold text-text group-hover:text-blue-400 transition-colors text-sm">{m.t}</span>
            <span className="ml-auto text-xs" style={{ color: COLOR }}>→</span>
          </div>
          <p className="text-xs text-muted mb-2 leading-relaxed">{m.d}</p>
          <div className="flex flex-wrap gap-1.5">
            {m.ranges.map(r => (
              <span key={r.l} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${r.c}18`, color: r.c }}>{r.l} = {r.n}</span>
            ))}
          </div>
        </Link>
      ))}
      <p className="text-xs text-muted">* Cần xác nhận lại trong bối cảnh y tế phù hợp, không tự kết luận.</p>
    </div>
  );
}

function TabE2() {
  const SCHEDULE = [
    { metric: 'Cân nặng', freq: '1–3 lần/tuần', tip: 'Buổi sáng, sau vệ sinh, trước ăn' },
    { metric: 'Vòng eo', freq: '1 lần/tuần', tip: 'Buổi sáng, đứng thẳng, không hóp' },
    { metric: 'Huyết áp', freq: '2–7 ngày/tuần*', tip: 'Nghỉ 5ph trước đo, ghi trung bình' },
    { metric: 'Nhịp tim nghỉ', freq: '2–3 lần/tuần', tip: 'Ngay sau thức dậy, nằm yên' },
    { metric: 'Giấc ngủ', freq: 'Hằng ngày', tip: 'Giờ ngủ, thức, chất lượng 1–5' },
    { metric: 'Mức stress', freq: 'Hằng ngày', tip: 'Thang 1–10, buổi tối' },
    { metric: 'Bước chân', freq: 'Hằng ngày', tip: 'Mục tiêu 7.000–10.000 bước/ngày' },
  ];
  const [checks, setChecks] = useState({});
  const DAILY = ['Hôm nay ngủ được bao nhiêu giờ?', 'Có vận động ít nhất 20–30 phút không?', 'Có ăn đủ rau/đạm/nước không?', 'Mức stress hôm nay (1–10)?', 'Có triệu chứng bất thường nào không?'];
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-text text-sm mb-3">Lịch Theo Dõi Cơ Bản</h3>
        <div className="space-y-1.5">
          {SCHEDULE.map(s => (
            <div key={s.metric} className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3">
              <div className="w-28 shrink-0">
                <div className="text-sm font-semibold text-text">{s.metric}</div>
                <div className="text-xs font-bold" style={{ color: '#14b8a6' }}>{s.freq}</div>
              </div>
              <p className="text-xs text-muted leading-relaxed">{s.tip}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">* Chỉ khi có nguy cơ tăng huyết áp hoặc được bác sĩ khuyến nghị.</p>
      </div>
      <div>
        <h3 className="font-bold text-text text-sm mb-3">5 Câu Hỏi Self-Check Mỗi Ngày</h3>
        <div className="space-y-2">
          {DAILY.map((q, i) => (
            <button key={i} onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
              className="w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
              style={{ borderColor: checks[i] ? '#14b8a6' : '#2a2a2a', background: checks[i] ? '#14b8a610' : 'transparent' }}>
              <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: checks[i] ? '#14b8a6' : '#555', background: checks[i] ? '#14b8a6' : 'transparent' }}>
                {checks[i] && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-text">{q}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-2 italic">Đo để hiểu, không đo để ám ảnh. Nhìn xu hướng 4–12 tuần quan trọng hơn một con số đơn lẻ.</p>
      </div>
    </div>
  );
}

function TabE3() {
  const EMERGENCY = [
    { icon: '💔', cat: 'Tim Mạch', signs: ['Đau ngực dữ dội, bóp nghẹt, lan tay trái/hàm/lưng', 'Khó thở đột ngột', 'Ngất bất ngờ', 'Hồi hộp kèm choáng, đau ngực, khó thở', 'Huyết áp rất cao kèm đau ngực, yếu liệt, lú lẫn'], color: '#ef4444' },
    { icon: '🧠', cat: 'Thần Kinh (nghi đột quỵ)', signs: ['Méo miệng đột ngột', 'Yếu liệt tay chân một bên', 'Nói khó, nói đớ bất ngờ', 'Đau đầu dữ dội đột ngột', 'Co giật, lú lẫn cấp'], color: '#dc2626' },
    { icon: '🩸', cat: 'Tiêu Hóa & Chuyển Hóa', signs: ['Đau bụng dữ dội', 'Nôn ra máu, đi cầu phân đen', 'Đường huyết rất cao kèm lơ mơ, thở sâu nhanh', 'Đường huyết thấp kèm vã mồ hôi, run, lơ mơ'], color: '#f59e0b' },
    { icon: '🦴', cat: 'Cơ Xương Khớp', signs: ['Đau sau chấn thương kèm biến dạng chi', 'Đau lưng kèm yếu chân, bí tiểu, tê vùng yên ngựa', 'Không chịu lực được sau chấn thương'], color: '#8b5cf6' },
  ];
  const SOON = ['Sụt cân không rõ nguyên nhân', 'Mệt kéo dài >2–4 tuần', 'Ho kéo dài', 'Đau ngực khi gắng sức', 'Phù chân kéo dài', 'Tiểu nhiều, khát nhiều', 'Rối loạn giấc ngủ nặng kéo dài', 'Vết thương lâu lành'];
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-500/30 bg-red-500/08 p-3">
        <p className="text-sm font-bold text-red-400 mb-1">⚠️ Đi Cấp Cứu Ngay — Không Chờ</p>
        <p className="text-xs text-muted">Khi có các dấu hiệu dưới đây: không tự xử trí, gọi 115 hoặc đến cơ sở y tế gần nhất.</p>
      </div>
      {EMERGENCY.map(g => (
        <div key={g.cat} className="rounded-2xl border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{g.icon}</span>
            <span className="font-bold text-sm" style={{ color: g.color }}>{g.cat}</span>
          </div>
          <ul className="space-y-1">
            {g.signs.map(s => (
              <li key={s} className="flex items-start gap-2 text-xs text-muted">
                <span className="shrink-0 mt-0.5" style={{ color: g.color }}>·</span>{s}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/08 p-4">
        <p className="text-xs font-bold text-amber-400 mb-3">Nên Đi Khám Sớm Khi Có:</p>
        <div className="grid grid-cols-2 gap-2">
          {SOON.map(s => (
            <div key={s} className="flex items-start gap-2 text-xs text-muted">
              <span className="text-amber-400 shrink-0 mt-0.5">·</span>{s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabE4() {
  const GROUPS = [
    { icon: '❤️', t: 'Tim Mạch', c: '#ef4444', items: ['Kiểm soát huyết áp <130/80', 'Giảm muối, tăng rau xanh', 'Vận động 150ph/tuần', 'Không hút thuốc lá', 'Kiểm soát mỡ máu LDL'] },
    { icon: '🍬', t: 'Chuyển Hóa', c: '#f59e0b', items: ['Giảm đường tinh chế, nước ngọt', 'Tăng chất xơ (25–38g/ngày)', 'Giảm cân nếu thừa cân', 'Tập sức mạnh 2–3x/tuần', 'Ngủ đủ 7–9h'] },
    { icon: '🦴', t: 'Cơ Xương Khớp', c: '#10b981', items: ['Giãn cơ 5–10ph/ngày', 'Không ngồi quá 2h liên tục', 'Tập lõi (core) 2–3x/tuần', 'Ergonomics bàn làm việc', 'Tập thăng bằng nếu >50 tuổi'] },
    { icon: '🧠', t: 'Stress & Giấc Ngủ', c: '#a855f7', items: ['Ngủ 7–9h/đêm cố định giờ', 'Thiền/thở 5–10ph/ngày', 'Tắt màn hình 1h trước ngủ', 'Duy trì kết nối xã hội', 'Có ít nhất 1 hoạt động thư giãn'] },
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Tập trung vào 4 nhóm bệnh quan trọng nhất trong cuộc sống hiện đại:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GROUPS.map(g => (
          <div key={g.t} className="rounded-2xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{g.icon}</span>
              <span className="font-bold text-sm" style={{ color: g.c }}>{g.t}</span>
            </div>
            <ul className="space-y-1.5">
              {g.items.map(it => (
                <li key={it} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: g.c }} />{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabE5() {
  const BASIC = ['Khám tổng quát', 'Cân nặng + BMI + vòng eo', 'Huyết áp', 'Đường huyết đói', 'HbA1c (nếu có nguy cơ)', 'Mỡ máu toàn phần', 'Chức năng gan (AST/ALT)', 'Chức năng thận (creatinine)', 'Công thức máu toàn phần', 'Tổng phân tích nước tiểu', 'ECG (trên 40 tuổi)'];
  const EXPANDED = [
    { t: 'Thừa cân / béo bụng', items: ['HbA1c', 'Mỡ máu đầy đủ', 'Men gan', 'Acid uric', 'Siêu âm gan (nếu cần)'] },
    { t: 'Tăng huyết áp / nguy cơ tim mạch', items: ['Nhật ký huyết áp 7 ngày', 'Chức năng thận + điện giải', 'ECG / Holter', 'Đánh giá nguy cơ tim mạch 10 năm'] },
    { t: 'Người tập luyện nhiều', items: ['Ferritin, Vitamin D', 'CK (creatine kinase)', 'Tư vấn phục hồi, overtraining', 'Tim mạch nếu có triệu chứng bất thường'] },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-text text-sm mb-3">Gói Kiểm Tra Nền (Health Check Basic)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BASIC.map(b => (
            <div key={b} className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-xs text-muted">
              <span style={{ color: '#84cc16' }}>✓</span>{b}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-text text-sm mb-3">Mở Rộng Theo Nguy Cơ</h3>
        <div className="space-y-3">
          {EXPANDED.map(g => (
            <div key={g.t} className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-xs font-bold mb-2" style={{ color: '#84cc16' }}>+ {g.t}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(it => <span key={it} className="text-xs text-muted px-2 py-0.5 rounded-full border border-border">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted">Khám định kỳ không nên là "gói xét nghiệm càng nhiều càng tốt" — nên dựa trên tuổi, nguy cơ và triệu chứng của từng người.</p>
    </div>
  );
}

function TabE6() {
  const RULES = ['Không tự ngưng thuốc bác sĩ kê', 'Không tự tăng/giảm liều', 'Không dùng đơn thuốc của người khác', 'Không phối hợp thực phẩm chức năng mà không biết thành phần', 'Không tin quảng cáo "chữa dứt điểm", "thải độc", "hết tiểu đường vĩnh viễn"'];
  const CHECK = ['Tôi dùng để làm gì? Có bằng chứng rõ không?', 'Tôi có bệnh nền / đang dùng thuốc không?', 'Sản phẩm có nguồn gốc rõ không?', 'Có nguy cơ ảnh hưởng gan/thận không?', 'Có được bác sĩ/dược sĩ tư vấn không?'];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/08 p-5">
        <p className="text-sm font-bold text-violet-400 mb-3">5 Quy Tắc Không Của Thuốc</p>
        <ul className="space-y-2">
          {RULES.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted">
              <span className="font-black shrink-0" style={{ color: '#8b5cf6' }}>{i + 1}.</span>{r}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-bold text-text mb-3">Checklist Trước Khi Dùng Thực Phẩm Bổ Sung</p>
        <div className="space-y-2">
          {CHECK.map((q, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3 text-sm text-muted">
              <span className="font-black shrink-0" style={{ color: '#8b5cf6' }}>?</span>{q}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
        <p className="text-xs font-bold text-red-400 mb-2">Cụm từ NGUY HIỂM trong quảng cáo</p>
        <div className="flex flex-wrap gap-2">
          {['"Chữa khỏi 100%"', '"Không tác dụng phụ"', '"Thải độc gan/thận"', '"Tan mỡ khi ngủ"', '"Hạ đường vĩnh viễn"', '"Không cần đi bệnh viện"'].map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabE7() {
  const QS = [
    { n: '1', q: 'Ai nói?', tip: 'Có chuyên môn y tế thực sự không? Bằng cấp, tổ chức uy tín?' },
    { n: '2', q: 'Dựa trên gì?', tip: 'Nghiên cứu hay kinh nghiệm cá nhân? Có trích dẫn nguồn không?' },
    { n: '3', q: 'Có hứa hẹn quá mức?', tip: '"100%", "Chữa khỏi", "Tất cả mọi người" — là dấu hiệu đỏ.' },
    { n: '4', q: 'Có bán hàng ngay sau?', tip: 'Tạo nỗi sợ → giới thiệu sản phẩm → bán = công thức thao túng.' },
    { n: '5', q: 'Có khuyên bỏ điều trị?', tip: '"Bỏ thuốc tây đi" — cực kỳ nguy hiểm với bệnh nhân mạn tính.' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">Với sự bùng nổ của TikTok, YouTube và livestream bán hàng, lọc thông tin sức khỏe là kỹ năng sống quan trọng.</p>
      <div className="space-y-2">
        {QS.map(q => (
          <div key={q.n} className="rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0" style={{ background: `${COLOR}20`, color: COLOR }}>{q.n}</span>
              <span className="font-semibold text-sm text-text">{q.q}</span>
            </div>
            <p className="text-xs text-muted pl-8">{q.tip}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
          <p className="text-xs font-bold text-red-400 mb-2">❌ Cụm từ nguy hiểm</p>
          <ul className="space-y-1">{['"Bỏ thuốc tây đi"', '"Giải độc gan 7 ngày"', '"Ai cũng dùng được"', '"Sạch mạch máu"'].map(t => <li key={t} className="text-xs text-muted">{t}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/06 p-4">
          <p className="text-xs font-bold text-green-400 mb-2">✓ Ngôn ngữ an toàn</p>
          <ul className="space-y-1">{['"Hỗ trợ theo dõi"', '"Cần cá nhân hóa"', '"Nên tham khảo bác sĩ"', '"Không thay thuốc điều trị"'].map(t => <li key={t} className="text-xs text-muted">{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT = { e0: TabE0, e1: TabE1, e2: TabE2, e3: TabE3, e4: TabE4, e5: TabE5, e6: TabE6, e7: TabE7 };

export default function PillarE() {
  const [activeTab, setActiveTab] = useState('e0');
  const tab = TABS.find(t => t.id === activeTab);
  const TabPanel = TAB_CONTENT[activeTab];

  useEffect(() => {
    if (document.getElementById(ORBIT_ID)) return;
    const s = document.createElement('style');
    s.id = ORBIT_ID;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes peOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(from var(${PROP}), transparent 0deg, transparent 55deg, rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg, rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg, rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg);
        animation: peOrbitSpin 3.5s linear infinite;
      }
      ${TABS.map((t, i) => `
        @property --pe-fa-${i} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes peFSpin${i} { to { --pe-fa-${i}: 360deg; } }
        .${t.frameClass} { background: conic-gradient(from var(--pe-fa-${i}), transparent 0deg, transparent 70deg, rgba(${t.rgb},0.5) 85deg, rgba(255,255,255,0.8) 90deg, rgba(${t.rgb},0.5) 95deg, transparent 110deg, transparent 360deg); animation: peFSpin${i} 4s linear infinite; }
      `).join('')}
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(ORBIT_ID); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-5xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-sm text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>6 Trụ Cột</span>
      </Link>

      <RevealBlock className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}07` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}25` }}>🏥</div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">Kiến Thức Sức Khỏe</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>Trụ Cột E · Health Literacy</span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">Hiểu cơ thể mình bằng ngôn ngữ đơn giản — biết theo dõi chỉ số quan trọng, nhận ra dấu hiệu nguy hiểm và ra quyết định chăm sóc sức khỏe an toàn hơn mỗi ngày.</p>
          <div className="flex flex-wrap gap-6 mt-6">
            {['8 Module', '12 Tuần', '5 Chỉ số', '100 điểm'].map((label, i) => (
              <div key={label} className="group/stat relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={HERO_TIPS[i]} idx={`hero-e-${i}`} color={COLOR} />
                </div>
                <div className="text-lg font-black" style={{ color: COLOR }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <RevealBlock delay={80}>
        <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop" alt="Health Knowledge" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>Hiểu Chỉ Số · Phòng Bệnh · Đi Khám Đúng Lúc</span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Tab bar */}
      <RevealBlock delay={100}>
        <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 bg-bg/90 backdrop-blur-md pb-3 mb-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all shrink-0"
                style={activeTab === t.id ? { borderColor: t.color, background: `${t.color}20`, color: t.color } : { borderColor: 'transparent', color: '#666' }}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* Tab panel */}
      <RevealBlock key={activeTab}>
        <div className={`${tab.frameClass} rounded-3xl p-[1.5px] mb-16`}>
          <div className="rounded-3xl bg-surface p-5 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{tab.icon}</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: tab.color }}>{tab.id.toUpperCase()} · Trụ Cột E</div>
                <div className="text-lg font-bold text-text">{tab.label}</div>
              </div>
            </div>
            <TabPanel />
          </div>
        </div>
      </RevealBlock>

      {/* Teaser grid */}
      <RevealBlock delay={60}>
        <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">Khám Phá Sâu Hơn</h2>
        <p className="text-muted mb-10">12 chủ đề chuyên sâu về kiến thức sức khỏe phổ thông</p>

        <TeaserSection title="Chỉ Số & Đo Lường">
          <TeaserCard to="/pillar/e/bmi" color="#3b82f6" rgb="59,130,246" icon="⚖️" category="Chỉ Số Cơ Thể" title="BMI & Vòng Eo" accent="Sàng lọc · Nguy cơ chuyển hóa" desc="Hiểu BMI, cách đọc đúng, và tại sao vòng eo quan trọng hơn cân nặng đơn thuần." features={['Công thức tính BMI + ví dụ', 'Vì sao vòng eo quan trọng hơn', 'Kỹ thuật đo đúng chuẩn', 'Hành động theo từng kết quả']} stats={[{ v: '4', l: 'Phân loại' }, { v: 'Tuần/lần', l: 'Đo vòng eo' }]} image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" imageAlt="BMI" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/blood-pressure" color="#ef4444" rgb="239,68,68" icon="❤️" category="Huyết Áp" title="Đo & Hiểu Huyết Áp" accent="120/80 · Theo dõi tại nhà" desc="Tại sao huyết áp nguy hiểm thầm lặng, cách đo đúng và khi nào cần đi khám ngay." features={['Phân loại huyết áp AHA', '5 bước đo đúng kỹ thuật', 'Nhật ký huyết áp 7 ngày', 'Dấu hiệu cần cấp cứu ngay']} stats={[{ v: '5', l: 'Bước đo đúng' }, { v: '7', l: 'Ngày nhật ký' }]} image="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80" imageAlt="Blood Pressure" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/blood-sugar" color="#f59e0b" rgb="245,158,11" icon="🍬" category="Đường Huyết" title="Đường Huyết & HbA1c" accent="Tiền ĐTĐ · Kiểm soát lâu dài" desc="Hiểu sự khác biệt giữa đường huyết đói và HbA1c, cách phòng tiền đái tháo đường." features={['Ngưỡng bình thường và cảnh báo', 'HbA1c khác đường huyết thế nào', 'Liên hệ ăn uống và vận động', 'Khi nào cần xét nghiệm']} stats={[{ v: '8h', l: 'Nhịn trước đo' }, { v: '3 tháng', l: 'HbA1c phản ánh' }]} image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80" imageAlt="Blood Sugar" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/lipids" color="#8b5cf6" rgb="139,92,246" icon="🫀" category="Mỡ Máu" title="LDL, HDL & Triglyceride" accent="Xơ vữa · Tim mạch" desc="Giải mã bảng mỡ máu: LDL 'xấu', HDL 'tốt', triglyceride cao do đâu và điều chỉnh thế nào." features={['LDL-C và xơ vữa động mạch', 'HDL-C: vai trò thực sự', 'Triglyceride và đề kháng insulin', 'Mục tiêu theo nhóm nguy cơ']} stats={[{ v: '4', l: 'Chỉ số mỡ máu' }, { v: 'mg/dL', l: 'Đơn vị' }]} image="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80" imageAlt="Lipids" cta="Xem chi tiết →" />
        </TeaserSection>

        <TeaserSection title="Cảnh Báo & An Toàn">
          <TeaserCard to="/pillar/e/red-flags" color="#ef4444" rgb="239,68,68" icon="🚨" category="Dấu Hiệu Nguy Hiểm" title="Red Flags — Khi Nào Cấp Cứu" accent="Tim · Thần kinh · Tiêu hóa" desc="Bảng tra cứu nhanh các dấu hiệu nguy hiểm cần đến cơ sở y tế ngay — không được chờ đợi." features={['Dấu hiệu đột quỵ: F.A.S.T.', 'Đau ngực nguy hiểm vs bình thường', 'Emergency Decision Tree', '4 nhóm dấu hiệu cần cấp cứu']} stats={[{ v: '4', l: 'Nhóm nguy hiểm' }, { v: '115', l: 'Số cấp cứu' }]} image="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80" imageAlt="Red Flags" cta="Xem ngay →" />
          <TeaserCard to="/pillar/e/medication" color="#10b981" rgb="16,185,129" icon="💊" category="An Toàn Thuốc" title="Thuốc & Thực Phẩm Bổ Sung" accent="5 Quy tắc Không · Checklist" desc="Nguyên tắc dùng thuốc an toàn, checklist trước khi mua thực phẩm chức năng." features={['5 quy tắc Không về thuốc', 'Checklist 5 câu trước khi dùng', 'Cụm từ nguy hiểm trong quảng cáo', 'Tương tác thuốc cơ bản']} stats={[{ v: '5', l: 'Quy tắc' }, { v: '5', l: 'Câu kiểm tra' }]} image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80" imageAlt="Medication" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/media-literacy" color="#6366f1" rgb="99,102,241" icon="🔎" category="Lọc Thông Tin" title="Health Media Literacy" accent="TikTok · YouTube · Livestream" desc="Bộ lọc 5 câu hỏi để nhận biết thông tin sức khỏe sai lệch và nội dung nguy hiểm trên mạng." features={['5 câu hỏi kiểm chứng nguồn', 'Dấu hiệu nội dung nguy hiểm', 'Cách tra cứu nguồn đáng tin', 'Ngôn ngữ quảng cáo thao túng']} stats={[{ v: '5', l: 'Câu hỏi lọc' }, { v: '9', l: 'Từ khóa đỏ' }]} image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" imageAlt="Media Literacy" cta="Xem chi tiết →" />
        </TeaserSection>

        <TeaserSection title="Phòng Bệnh & Theo Dõi">
          <TeaserCard to="/pillar/e/prevention" color="#0ea5e9" rgb="14,165,233" icon="🛡️" category="Phòng Bệnh" title="Phòng Bệnh Chủ Động" accent="Tim mạch · Chuyển hóa · Cơ xương" desc="Từ kiến thức về nguy cơ đến hành động cụ thể phòng bệnh tim mạch, tiểu đường và cơ xương khớp." features={['5 nhóm bệnh quan trọng nhất', 'Hành động phòng ngừa cụ thể', 'Liên kết với Trụ cột A–D', 'Habit Risk Map cá nhân']} stats={[{ v: '5', l: 'Nhóm bệnh' }, { v: '150ph', l: 'Vận động/tuần' }]} image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" imageAlt="Prevention" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/self-monitoring" color="#14b8a6" rgb="20,184,166" icon="📈" category="Tự Theo Dõi" title="Self-Monitoring Tại Nhà" accent="Xu hướng · Không ám ảnh" desc="Hướng dẫn theo dõi chỉ số đúng cách: đo gì, khi nào, bao nhiêu lần và nhìn xu hướng thế nào." features={['Lịch theo dõi 7 chỉ số chính', '5 câu tự đánh giá hằng ngày', 'Nhật ký cân nặng & vòng eo', 'Dashboard 12 tuần đơn giản']} stats={[{ v: '7', l: 'Chỉ số theo dõi' }, { v: '5ph', l: 'Mỗi ngày' }]} image="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80" imageAlt="Self Monitoring" cta="Xem chi tiết →" />
          <TeaserCard to="/pillar/e/checkup" color="#84cc16" rgb="132,204,22" icon="📅" category="Khám Định Kỳ" title="Lộ Trình Khám Định Kỳ" accent="Theo tuổi · Theo nguy cơ" desc="Biết cần làm xét nghiệm gì, khi nào — không xét nghiệm quá nhiều, không bỏ sót quan trọng." features={['Gói Health Check Basic (11 mục)', 'Gói mở rộng theo nguy cơ', 'Câu hỏi cần chuẩn bị trước khám', 'Lưu & theo dõi kết quả']} stats={[{ v: '11', l: 'Xét nghiệm cơ bản' }, { v: 'Hằng năm', l: 'Tần suất' }]} image="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80" imageAlt="Checkup" cta="Xem chi tiết →" />
        </TeaserSection>

        <TeaserSection title="Đánh Giá & Lộ Trình">
          <TeaserCard to="/pillar/e/assessment" color="#3b82f6" rgb="59,130,246" icon="📝" category="Kiểm Tra Kiến Thức" title="Health Literacy Assessment" accent="100 điểm · 7 nhóm kỹ năng" desc="Bài kiểm tra 20 câu giúp đánh giá mức độ kiến thức sức khỏe và gợi ý nên tập trung vào đâu." features={['20 câu hỏi trắc nghiệm', 'Phân tích theo 7 nhóm kỹ năng', '5 cấp độ Health Literacy', 'Gợi ý module nên học tiếp']} stats={[{ v: '20', l: 'Câu hỏi' }, { v: '100', l: 'Điểm tối đa' }]} image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" imageAlt="Assessment" cta="Làm bài test →" />
          <TeaserCard to="/pillar/e/roadmap" color="#a855f7" rgb="168,85,247" icon="🗺️" category="Lộ Trình" title="Lộ Trình 12 Tuần Health Literacy" accent="6 Giai đoạn · Từng bước rõ ràng" desc="Hành trình từ mù mờ về sức khỏe đến tự quản lý chỉ số và phòng bệnh chủ động trong 12 tuần." features={['6 giai đoạn với mục tiêu rõ', 'Lịch 7 ngày mẫu', 'Sản phẩm cụ thể sau mỗi giai đoạn', 'Health Profile cá nhân']} stats={[{ v: '12', l: 'Tuần' }, { v: '6', l: 'Giai đoạn' }]} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" imageAlt="Roadmap" cta="Xem lộ trình →" />
        </TeaserSection>
      </RevealBlock>

      {/* Safety disclaimer */}
      <RevealBlock delay={80} className="mt-6">
        <div className="rounded-2xl border p-5" style={{ borderColor: `${COLOR}20`, background: `${COLOR}06` }}>
          <p className="text-xs text-muted leading-relaxed">
            <strong className="font-bold" style={{ color: COLOR }}>⚕️ Lưu ý quan trọng:</strong> Trụ cột E cung cấp kiến thức và công cụ tự theo dõi — không thay thế khám bệnh, chẩn đoán hoặc điều trị cá nhân hóa. Nếu có bệnh nền hoặc đang dùng thuốc đặc trị, hãy trao đổi với bác sĩ trước khi thay đổi chế độ ăn, tập luyện hoặc bổ sung sản phẩm.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
