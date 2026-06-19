import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
        <span className="text-base font-bold uppercase tracking-widest text-muted px-3">{title}</span>
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
            <span className="text-3xl">{icon}</span>
            <span className="text-base font-bold uppercase tracking-widest" style={{ color }}>{category}</span>
          </div>
          <h3 className="text-xl font-bold text-text mb-1 leading-snug">{title}</h3>
          <p className="text-base font-semibold mb-3" style={{ color }}>{accent}</p>
          <p className="text-lg text-muted leading-relaxed mb-4">{desc}</p>
          {features.length > 0 && (
            <ul className="space-y-1 mb-4">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-base text-muted">
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
                  <div className="text-lg font-black" style={{ color }}>{s.v}</div>
                  <div className="text-base text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          )}
          <span className="text-base font-bold ml-auto" style={{ color }}>{cta}</span>
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
        <p className="text-lg font-semibold mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Sức Khỏe Cá Nhân (E0)</p>
        <p className="text-base text-muted">Lưu tự động trên thiết bị. Dùng để cá nhân hóa nội dung trong toàn bộ Trụ cột E.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.k}>
            <label className="text-base text-muted mb-1 block">{f.l}</label>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2">
              <input type={f.t} placeholder={f.ph} value={form[f.k] || ''} onChange={e => set(f.k, +e.target.value)}
                className="flex-1 bg-transparent text-lg text-text focus:outline-none w-0 min-w-0" />
              <span className="text-base text-muted shrink-0">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="text-base text-muted mb-1 block">Giới tính</label>
        <div className="flex gap-2">
          {[{ v: 'male', l: '♂ Nam' }, { v: 'female', l: '♀ Nữ' }].map(g => (
            <button key={g.v} onClick={() => set('sex', g.v)}
              className="flex-1 py-2 rounded-xl border text-lg font-semibold transition-all"
              style={form.sex === g.v ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {g.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-base text-muted mb-1 block">Bệnh nền</label>
        <div className="flex flex-wrap gap-2">
          {diseaseOpts.map(d => (
            <button key={d} onClick={() => { const cur = form.diseases || []; const next = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d]; set('diseases', next); }}
              className="px-3 py-1 rounded-full text-base border transition-all"
              style={(form.diseases || []).includes(d) ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {d}
            </button>
          ))}
        </div>
      </div>
      {bmi && (
        <div className="rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: `${bmiColor}30`, background: `${bmiColor}08` }}>
          <div className="text-center">
            <div className="text-4xl font-black" style={{ color: bmiColor }}>{bmi}</div>
            <div className="text-base text-muted">BMI</div>
          </div>
          <div>
            <div className="font-bold" style={{ color: bmiColor }}>{bmiLabel}</div>
            <p className="text-base text-muted">Vòng eo: {form.waist || '–'} cm · {form.sex === 'female' ? 'Nữ: ngưỡng >80 cm' : 'Nam: ngưỡng >90 cm'}</p>
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
            <span className="text-2xl">{m.icon}</span>
            <span className="font-bold text-text group-hover:text-blue-400 transition-colors text-lg">{m.t}</span>
            <span className="ml-auto text-base" style={{ color: COLOR }}>→</span>
          </div>
          <p className="text-base text-muted mb-2 leading-relaxed">{m.d}</p>
          <div className="flex flex-wrap gap-1.5">
            {m.ranges.map(r => (
              <span key={r.l} className="text-base px-2 py-0.5 rounded-full" style={{ background: `${r.c}18`, color: r.c }}>{r.l} = {r.n}</span>
            ))}
          </div>
        </Link>
      ))}
      <p className="text-base text-muted">* Cần xác nhận lại trong bối cảnh y tế phù hợp, không tự kết luận.</p>
    </div>
  );
}

const SCHEDULE = [
  {
    metric: 'Cân nặng', freq: '1–3 lần/tuần', tip: 'Buổi sáng, sau vệ sinh, trước ăn',
    icon: '⚖️', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cân nặng biến động 1–2 kg mỗi ngày do nước, thức ăn trong ruột, chu kỳ kinh nguyệt — không phải mỡ thực sự. Chỉ nhìn xu hướng 4–8 tuần mới có ý nghĩa. Cân 1–3 lần/tuần (không mỗi ngày) giúp tránh lo lắng không cần thiết và vẫn đủ để theo dõi xu hướng.',
    detail: 'Cân vào buổi sáng sau vệ sinh, trước ăn sáng, không mặc quần áo nặng — đây là thời điểm cơ thể ở trạng thái "baseline" nhất quán nhất. Ghi lại số và lấy trung bình tuần để loại bỏ nhiễu ngày.',
    details: [
      'Tại sao không nên cân mỗi ngày: dao động hàng ngày do natri (muối giữ nước), carbohydrate (glycogen giữ nước 3g/g), chu kỳ kinh nguyệt, hơi thở, mồ hôi. Cân mỗi ngày và phản ứng với số là nguồn gốc của lo lắng không cần thiết và quyết định ăn uống sai lầm.',
      'Tần suất tối ưu: 1–3 lần/tuần, cùng ngày trong tuần (VD: thứ 2, thứ 4, thứ 6 sáng). Lấy trung bình 3 lần = trọng lượng tuần. So sánh tuần này với tuần trước, không ngày này với ngày trước.',
      'Điều kiện chuẩn mỗi lần đo: sau khi đi vệ sinh (tiểu tiện), trước khi uống nước hoặc ăn sáng, cùng thiết bị, cùng vị trí đặt cân (sàn cứng phẳng). Không mang giày, không mặc đồ nặng.',
      'Hiểu xu hướng: giảm >0.25 kg/tuần trong 4 tuần liên tiếp = xu hướng giảm thực sự. Cân dao động trong ±1 kg so với tuần trước = không thay đổi. Tăng >0.5 kg/tuần trong 3–4 tuần = cần xem lại chế độ ăn.',
      'Khi nào không nên cân: sau bữa ăn lớn, sau buổi tập nặng (cơ giữ nước để hồi phục), ngay trước/sau chu kỳ kinh nguyệt, khi đang bị bệnh có sốt. Những lúc này số sẽ không phản ánh thực tế.',
      'App theo dõi hữu ích: Happy Scale (iOS) hoặc LibreScale (Android) tính trung bình động và loại bỏ nhiễu — cho thấy xu hướng thực sự khi số hàng ngày trông hỗn loạn. Hoặc ghi vào bảng tính đơn giản: ngày, cân nặng, trung bình 7 ngày.',
    ],
    points: [
      { icon: '📅', label: '1–3 lần/tuần là đủ', note: 'Nhiều hơn tạo lo lắng — không thêm thông tin có ích' },
      { icon: '🌅', label: 'Sáng, sau vệ sinh, trước ăn', note: 'Baseline nhất quán nhất trong ngày' },
      { icon: '📊', label: 'Nhìn trung bình tuần', note: 'Loại bỏ nhiễu ngày — xu hướng 4 tuần mới có ý nghĩa' },
      { icon: '🚫', label: 'Không phản ứng với một con số', note: 'Biến động ±1–2 kg là bình thường sinh lý, không phải mỡ' },
    ],
  },
  {
    metric: 'Vòng eo', freq: '1 lần/tuần', tip: 'Buổi sáng, đứng thẳng, không hóp',
    icon: '📏', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo là chỉ số phản ánh mỡ nội tạng — loại mỡ nguy hiểm hơn cân nặng đơn thuần. Nam giới ngưỡng nguy hiểm ≥90 cm, nữ giới ≥80 cm (tiêu chuẩn IDF châu Á). Chỉ cần 1 thước dây và 30 giây — đây là chỉ số tim mạch quan trọng nhất bạn có thể tự đo tại nhà.',
    detail: 'Mỡ nội tạng (quanh cơ quan trong bụng) hoạt động khác mỡ dưới da: tiết adipokines viêm, free fatty acids trực tiếp vào vòng tuần hoàn cổng, gây kháng insulin và xơ vữa động mạch. Vòng eo giảm 5–10 cm liên quan đến giảm nguy cơ tim mạch và đái tháo đường đáng kể, ngay cả khi cân nặng không đổi nhiều.',
    details: [
      'Cách đo đúng: đứng thẳng, hai chân rộng bằng vai, thở ra nhẹ nhàng (KHÔNG hóp bụng hay thở ra hết), đo ngang qua điểm giữa bờ dưới xương sườn cuối và mào chậu trên — thường ngang hoặc 1–2 cm trên rốn. Không kéo thước quá chặt, không để lỏng. Đo 2 lần, lấy trung bình.',
      'Tần suất 1 lần/tuần là tối ưu: vòng eo thay đổi chậm hơn cân nặng (đây là mỡ thực sự, không phải nước). Đo mỗi ngày sẽ không thấy thay đổi và tạo nản lòng. Xu hướng 4–8 tuần mới rõ ràng. Cùng buổi sáng trước ăn, cùng điều kiện.',
      'Hiểu ngưỡng nguy hiểm châu Á: IDF 2005 đặt ngưỡng thấp hơn phương Tây vì người châu Á tích mỡ nội tạng nhiều hơn ở cùng BMI. Nam ≥90 cm (phương Tây 102 cm), nữ ≥80 cm (phương Tây 88 cm). Người BMI bình thường nhưng vòng eo vượt ngưỡng = "TOFI" — nguy cơ chuyển hóa tương đương người thừa cân.',
      'Vòng eo giảm trước cân: khi bắt đầu chế độ ăn lành mạnh + tập luyện, mỡ nội tạng (phản ánh qua vòng eo) thường giảm trước khi cân số giảm đáng kể. Vòng eo giảm 2–3 cm trong khi cân không đổi = thành công thực sự — bạn đang mất mỡ và tăng cơ.',
      'Yếu tố ảnh hưởng vòng eo ngoài ăn uống: stress mãn tính (cortisol kích hoạt tích mỡ bụng), ngủ kém (<6h liên tục gây cortisol cao), rượu bia (đặc biệt beer belly), thuốc corticosteroid dài hạn. Giảm vòng eo cần giải quyết tất cả các yếu tố này, không chỉ ăn ít.',
      'Khi nào cần lo ngại: vòng eo tăng >3 cm trong 1 tháng không giải thích được, hoặc tăng kèm phù mặt/chân, mệt mỏi bất thường, khó thở → cần đánh giá y tế (loại trừ cổ trướng, suy tim, suy thận).',
    ],
    points: [
      { icon: '🎯', label: 'Nam <90cm · Nữ <80cm', note: 'Ngưỡng IDF châu Á — thấp hơn phương Tây vì sinh lý khác' },
      { icon: '📐', label: 'Đo đúng: thở ra nhẹ, không hóp', note: 'Hóp bụng hoặc thở hết làm sai kết quả tới 3–5 cm' },
      { icon: '📉', label: 'Vòng eo giảm trước cân', note: 'Mỡ nội tạng đáp ứng nhanh — dấu hiệu sớm nhất của tiến bộ' },
      { icon: '⚠️', label: 'TOFI: BMI ổn nhưng vòng eo cao', note: 'Nguy cơ chuyển hóa dù cân bình thường — đo vòng eo bắt buộc' },
    ],
  },
  {
    metric: 'Huyết áp', freq: '2–7 ngày/tuần*', tip: 'Nghỉ 5ph trước đo, ghi trung bình',
    icon: '❤️', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tăng huyết áp được gọi là "kẻ giết người thầm lặng" vì không có triệu chứng rõ ràng cho đến khi có biến chứng (đột quỵ, nhồi máu cơ tim, suy thận). Trung bình 7 ngày đo tại nhà (buổi sáng + tối) chính xác hơn đo 1 lần tại phòng khám vì loại trừ được "white coat hypertension" (huyết áp tăng do lo lắng khi gặp bác sĩ).',
    detail: 'Huyết áp thay đổi liên tục trong ngày: thấp nhất lúc ngủ, tăng dần từ 6–10 giờ sáng (morning surge), cao nhất chiều tối. Một lần đo duy nhất có thể sai lệch 10–20 mmHg so với thực tế. Giao thức chuẩn: đo 2 lần cách nhau 1–2 phút, lấy trung bình, ghi lại cả hai buổi.',
    details: [
      'Chuẩn bị đúng trước đo: nghỉ ngồi yên tĩnh 5 phút (không nói chuyện, không dùng điện thoại). Không uống cà phê, không hút thuốc, không tập thể dục trong vòng 30 phút trước. Bàng quang rỗng (bàng quang đầy làm tăng HA 10–15 mmHg). Ngồi thẳng lưng, chân đặt phẳng sàn, không vắt chân.',
      'Tư thế và vị trí đặt manometer: cánh tay đặt ngang tim (trên mặt bàn, ngang ngực). Vòng bít phủ 80% chu vi cánh tay (dùng sai size làm sai kết quả ±10 mmHg). Không đo qua áo dày. Nghỉ ít nhất 1 phút giữa 2 lần đo, lấy trung bình 2 lần.',
      'Tần suất đo theo tình trạng: người bình thường khỏe mạnh — đo 2–3 lần/tuần đủ để phát hiện xu hướng. Người được chẩn đoán hoặc nghi tăng HA — đo sáng + tối mỗi ngày trong 7 ngày, ghi lại, mang kết quả đến bác sĩ. Người đang điều chỉnh thuốc — theo hướng dẫn bác sĩ.',
      'Đọc số đúng: 120/80 = tâm thu/tâm trương. Bình thường: <120/80. Elevated: 120–129/<80. Stage 1 HTN: 130–139/80–89. Stage 2 HTN: ≥140/90. Hypertensive crisis: >180/>120 → đi khám ngay. Một lần cao chưa phải kết luận — cần nhiều lần đo khác nhau.',
      'Masked hypertension và white-coat hypertension: HA tại nhà bình thường nhưng tại phòng khám cao = white-coat (25–30% bệnh nhân). HA tại nhà cao nhưng tại phòng khám bình thường = masked hypertension (nguy hiểm hơn vì bị bỏ qua). Đây là lý do đo tại nhà quan trọng không kém đo tại cơ sở y tế.',
      'Khi nào đi khám ngay: HA ≥180/120 mmHg (dù không triệu chứng), HA cao kèm đau đầu dữ dội sau gáy, nhìn mờ, đau ngực, khó thở, phù mặt/tay chân đột ngột, hoặc HA tâm trương tăng đột ngột >20 mmHg so với baseline của bạn.',
    ],
    points: [
      { icon: '⏱️', label: 'Nghỉ 5 phút trước đo', note: 'Đứng dậy, nói chuyện, dùng ĐT làm tăng HA 5–15 mmHg' },
      { icon: '📝', label: 'Ghi cả 2 lần đo, cả 2 buổi', note: '7 ngày trung bình sáng + tối chính xác hơn 1 lần phòng khám' },
      { icon: '🎯', label: 'Mục tiêu: <120/80 mmHg', note: 'Stage 1 HTN: 130–139/80–89 → cần thay đổi lối sống' },
      { icon: '🚨', label: '≥180/120 → đi khám ngay', note: 'Hypertensive crisis — không chờ dù chưa có triệu chứng' },
    ],
  },
  {
    metric: 'Nhịp tim nghỉ', freq: '2–3 lần/tuần', tip: 'Ngay sau thức dậy, nằm yên',
    icon: '💓', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhịp tim nghỉ (resting heart rate) là chỉ số đơn giản phản ánh sức khỏe tim mạch và mức độ hồi phục. Người tập thể thao đều đặn có RHR 45–55 bpm; người ít vận động 75–90 bpm. Nghiên cứu: mỗi 10 nhịp/phút tăng trong RHR liên quan đến tăng 15–18% nguy cơ tử vong tim mạch. RHR cao đột ngột (>10 nhịp so với baseline) là dấu hiệu sớm của bệnh, stress, ngủ kém hoặc overtraining.',
    detail: 'RHR phải đo ngay sau thức dậy, trước khi ngồi dậy hoặc làm bất kỳ việc gì — đây là "true resting" state. Ngồi dậy làm tăng RHR 10–15 bpm, uống cà phê tăng 5–10 bpm, căng thẳng tăng 5–20 bpm. Theo dõi baseline cá nhân của bạn quan trọng hơn so với ngưỡng "bình thường" chung.',
    details: [
      'Cách đo chính xác: ngay khi thức dậy (mắt vừa mở), vẫn nằm yên, đặt 2 ngón (trỏ + giữa) lên cổ tay phía trong (mạch quay) hoặc cổ (mạch cảnh), đếm trong 60 giây. Hoặc 30 giây x 2. Đồng hồ thông minh đo liên tục và lấy trung bình buổi đêm — chính xác hơn đo tay một lần.',
      'Ngưỡng bình thường và ý nghĩa: 60–100 bpm là "bình thường" theo AHA, nhưng ngưỡng tối ưu cho sức khỏe là 60–80 bpm. Vận động viên: 40–60 bpm (nhịp tim mạnh hơn, bơm nhiều máu mỗi nhát). RHR >100 bpm liên tục = tachycardia, cần đánh giá y tế.',
      'RHR là barometer hồi phục: RHR tăng 5–7 bpm so với baseline sau buổi tập = bạn chưa hồi phục đủ — nên tập nhẹ hoặc nghỉ hôm đó. RHR tăng 7–10+ bpm kèm mệt mỏi = có thể bệnh đang đến (nhiễm virus thường làm RHR tăng trước khi triệu chứng rõ). Garmin/Apple Watch HRV và Recovery Score dựa vào điều này.',
      'Cải thiện RHR qua tập luyện: Zone 2 cardio (chạy bộ, đạp xe chậm — mức bạn vẫn trò chuyện được) 150 phút/tuần là cách hiệu quả nhất giảm RHR dài hạn. Sau 8–12 tuần tập đều, RHR có thể giảm 5–10 bpm. Resistance training cũng giúp nhưng ít hơn cardio.',
      'Các yếu tố làm tăng RHR: mất nước (RHR tăng 7–8 bpm khi thiếu 1% trọng lượng cơ thể qua nước), cà phê, căng thẳng, thiếu ngủ, rượu bia (tăng ngay trong đêm), thuốc (xem hướng dẫn). Những biến động này bình thường nếu RHR trở về baseline sau 1–2 ngày.',
      'HRV — chỉ số nâng cao hơn: Heart Rate Variability (biến thiên nhịp tim giữa các nhịp đập) phản ánh cân bằng hệ thần kinh tự trị tốt hơn RHR đơn thuần. HRV cao = hồi phục tốt, tim khỏe. Đồng hồ thông minh hiện đại đo HRV mỗi sáng — nếu HRV thấp hơn baseline >20% nhiều ngày liên tiếp, đây là tín hiệu cơ thể cần nghỉ ngơi.',
    ],
    points: [
      { icon: '🛌', label: 'Đo ngay khi thức, chưa ngồi dậy', note: 'Ngồi dậy làm tăng ngay 10–15 bpm — mất đi giá trị baseline' },
      { icon: '📈', label: '+5–7 bpm so baseline = chưa hồi phục', note: 'Tập nhẹ hoặc nghỉ hôm đó — đặc biệt nếu kèm mệt mỏi' },
      { icon: '🏃', label: 'Zone 2 cardio giảm RHR', note: '150 phút/tuần → RHR giảm 5–10 bpm sau 8–12 tuần' },
      { icon: '💧', label: 'Mất nước tăng RHR 7–8 bpm', note: 'Uống nước đủ ngay khi thức dậy trước khi đo lần tiếp theo' },
    ],
  },
  {
    metric: 'Giấc ngủ', freq: 'Hằng ngày', tip: 'Giờ ngủ, thức, chất lượng 1–5',
    icon: '😴', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giấc ngủ ảnh hưởng đến gần như mọi hệ cơ quan. Thiếu ngủ mãn tính (<7 giờ/đêm) liên quan đến tăng nguy cơ béo phì 89% (ở trẻ em), đái tháo đường type 2, tăng huyết áp, trầm cảm, suy giảm nhận thức và tử vong sớm. Matthew Walker (Why We Sleep): "Không có cơ quan nào trong cơ thể không hưởng lợi từ ngủ đủ giấc, không có bệnh lý nào không trở nên tệ hơn khi thiếu ngủ."',
    detail: 'Theo dõi giấc ngủ mỗi ngày giúp bạn nhận ra pattern: bạn ngủ tốt hơn sau những ngày tập thể dục? Sau khi ăn tối sớm? Tương quan với tâm trạng ngày hôm sau? Dữ liệu cá nhân hóa giúp cải thiện hiệu quả hơn bất kỳ lời khuyên chung nào.',
    details: [
      'Những gì cần ghi: giờ lên giường, giờ ngủ thiếp (ước tính), số lần thức đêm, giờ thức dậy, cảm giác khi dậy (thang 1–5: 1=rất mệt, 5=sảng khoái). Tổng thời gian ngủ (sleep duration) + chất lượng (cảm giác khi dậy) = hai chỉ số quan trọng nhất.',
      'Công cụ theo dõi: đồng hồ thông minh (Apple Watch, Garmin, Fitbit) tự động theo dõi sleep stages (light/deep/REM). Apps như Sleep Cycle hoặc Oura Ring phân tích chất lượng. Tối giản nhất: nhật ký giấc ngủ 3 chỉ số (giờ ngủ, giờ dậy, điểm chất lượng 1–5) mất 10 giây mỗi sáng.',
      'Nhịp sinh học (circadian rhythm): cơ thể có đồng hồ nội tại 24h kiểm soát tiết melatonin, cortisol, nhiệt độ cơ thể. Ngủ và dậy cùng giờ mỗi ngày (kể cả cuối tuần) là yếu tố quan trọng nhất cho chất lượng giấc ngủ — quan trọng hơn giờ ngủ cụ thể. Sai lệch >1 giờ cuối tuần so ngày thường ("social jetlag") làm tăng nguy cơ béo phì và tim mạch.',
      'Deep sleep và REM: deep sleep (N3) quan trọng cho hồi phục cơ thể, miễn dịch, hormone tăng trưởng. REM quan trọng cho trí nhớ cảm xúc, sáng tạo, xử lý stress. Deep sleep nhiều hơn trong 1/3 đầu đêm; REM nhiều hơn 1/3 cuối. Rượu bia ức chế REM mạnh — ngủ 8 tiếng sau uống rượu nhưng thiếu REM = không hồi phục thực sự.',
      'Những kẻ phá giấc ngủ phổ biến: màn hình điện tử trước ngủ (ánh sáng xanh ức chế melatonin 2–3h), nhiệt độ phòng quá nóng (lý tưởng 18–20°C), cà phê sau 14:00 (bán kỳ 5–6h — 25% caffeine vẫn trong máu lúc nửa đêm), uống nhiều nước tối, thức đêm bù ngủ cuối tuần.',
      'Khi theo dõi thấy pattern: ngủ <6h liên tục >1 tuần → ưu tiên cải thiện ngủ trước bất kỳ mục tiêu sức khỏe nào khác. Chất lượng ≤2/5 dù đủ giờ → xem xét sleep apnea (đặc biệt nếu ngáy, BMI cao, cổ to). Thức đêm thường xuyên 2–3 giờ sáng → cortisol cao/stress/lo âu cần giải quyết.',
    ],
    points: [
      { icon: '🕐', label: 'Cùng giờ ngủ/dậy cả tuần', note: 'Nhịp sinh học ổn định quan trọng hơn số giờ ngủ cụ thể' },
      { icon: '📵', label: 'Tắt màn hình trước ngủ 1h', note: 'Ánh sáng xanh ức chế melatonin 2–3 giờ — delay giờ ngủ thiếp' },
      { icon: '🌡️', label: 'Phòng 18–20°C để ngủ sâu', note: 'Nhiệt độ cơ thể giảm khi ngủ sâu — phòng mát hỗ trợ điều này' },
      { icon: '🍺', label: 'Rượu bia phá REM dù bạn ngủ đủ giờ', note: 'Ngủ 8h sau rượu = thiếu giấc ngủ phục hồi thực sự' },
    ],
  },
  {
    metric: 'Mức stress', freq: 'Hằng ngày', tip: 'Thang 1–10, buổi tối',
    icon: '🧘', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress mãn tính (kéo dài nhiều tuần/tháng) có tác động sinh lý thực sự: cortisol cao liên tục làm tăng huyết áp, ức chế hệ miễn dịch, gây kháng insulin, tích mỡ bụng và thu nhỏ hippocampus (vùng não quan trọng cho trí nhớ). Theo dõi mức stress hàng ngày giúp bạn nhận ra trigger, pattern và hiệu quả của các can thiệp (thiền, tập thể dục, ngủ).',
    detail: 'Thang 1–10 chủ quan đơn giản nhưng hiệu quả khi theo dõi liên tục. Điểm tuyệt đối ít quan trọng hơn xu hướng: stress 6/10 mỗi ngày trong 2 tuần nguy hiểm hơn stress 8/10 một ngày. Ghi vào buổi tối trước khi ngủ — thời điểm phản ánh đủ cả ngày.',
    details: [
      'Cách dùng thang 1–10: 1–3 = thư giãn, không áp lực đáng kể. 4–5 = stress nhẹ bình thường, xử lý được. 6–7 = stress đáng kể, ảnh hưởng tập trung và tâm trạng. 8–9 = rất stress, khó kiểm soát. 10 = cực độ, khủng hoảng. Ghi số và optionally ghi 1 từ về nguyên nhân chính (công việc, gia đình, sức khỏe, tài chính).',
      'Pattern thường thấy khi theo dõi: stress cao mỗi thứ 2 đầu tuần (anticipatory stress), stress thấp sau tập thể dục (endorphin effect thấy rõ trong dữ liệu), stress tăng tương quan với ngủ kém 2 đêm liên tiếp, stress giảm sau thiền đều đặn >4 tuần. Dữ liệu cá nhân hóa này hiệu quả hơn bất kỳ lời khuyên chung nào.',
      'Stress sinh lý vs stress cảm nhận: HRV (heart rate variability) là chỉ số sinh lý phản ánh stress thần kinh tự trị — thấp = stress cao dù bạn cảm thấy ổn. Kết hợp HRV từ đồng hồ thông minh với thang stress chủ quan cho bức tranh đầy đủ hơn. Nhiều người "không cảm thấy stress" nhưng HRV liên tục thấp = allostatic load cao.',
      'Can thiệp hiệu quả nhất theo bằng chứng: (1) Tập thể dục 30 phút moderate — giảm cortisol, tăng BDNF, endorphin. (2) Breathing 4–7–8 hoặc box breathing — kích hoạt parasympathetic ngay lập tức. (3) Thiền mindfulness >8 tuần — giảm kích thước amygdala, tăng grey matter prefrontal cortex (meta-analysis Holzel 2011). (4) Ngủ đủ — cortisol đêm giảm trong deep sleep.',
      'Allostatic load — tổng tải stress lâu dài: cơ thể có thể chịu đựng stress cao ngắn hạn (acute stress thực ra có lợi). Vấn đề là khi stress liên tục không được phục hồi. Theo dõi điểm trung bình 7 ngày: nếu liên tục ≥6/10 trong >2 tuần → đây là dấu hiệu cần can thiệp chủ động, không chỉ "cố gắng thêm".',
      'Social connection — yếu tố thường bỏ qua: cô đơn và cô lập xã hội có tác động sức khỏe tương đương hút 15 điếu thuốc/ngày (Holt-Lunstad 2015). Theo dõi mức kết nối xã hội song song với stress — nhiều khi stress cao là do cô đơn, không phải công việc. Một cuộc trò chuyện thật với người thân giảm cortisol hiệu quả.',
    ],
    points: [
      { icon: '📝', label: 'Ghi buổi tối, thêm nguyên nhân chính', note: 'Xu hướng 7 ngày quan trọng hơn điểm một ngày' },
      { icon: '🏃', label: 'Tập 30 phút giảm cortisol ngay', note: 'Endorphin + BDNF — can thiệp stress nhanh nhất và hiệu quả nhất' },
      { icon: '🫁', label: 'Box breathing kích hoạt parasympathetic', note: '4 giây hít — 4 giây giữ — 4 giây thở ra — lặp 4 lần' },
      { icon: '⚠️', label: '≥6/10 liên tục >2 tuần = cần can thiệp', note: 'Allostatic load — cơ thể không hồi phục được khi stress không ngắt' },
    ],
  },
  {
    metric: 'Bước chân', freq: 'Hằng ngày', tip: 'Mục tiêu 7.000–10.000 bước/ngày',
    icon: '🚶', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Con số 10.000 bước/ngày xuất phát từ chiến dịch marketing của một công ty Nhật năm 1965, không phải nghiên cứu khoa học. Nghiên cứu JAMA 2019 (hơn 16.000 phụ nữ): ngưỡng có lợi bắt đầu từ 4.400 bước/ngày và lợi ích tăng dần đến ~7.500 bước/ngày — sau đó plateau. 7.000–8.000 bước là mục tiêu realistic và dựa trên bằng chứng cho người bình thường.',
    detail: 'Bước chân là proxy cho NEAT (Non-Exercise Activity Thermogenesis) — lượng calo tiêu thụ qua hoạt động hàng ngày ngoài tập thể dục có chủ đích. NEAT biến động đến 2.000 kcal/ngày giữa người hoạt động và ít vận động. Tăng bước chân thường xuyên dễ duy trì hơn tập gym và có thể có tác động lớn hơn về tổng calo tiêu thụ trong tuần.',
    details: [
      'Bằng chứng về ngưỡng tối ưu: JAMA Internal Medicine 2021 (2.110 người trung niên): 7.000+ bước/ngày giảm 50–70% nguy cơ tử vong tim mạch so với <5.000 bước. Sau 10.000 bước, lợi ích thêm không đáng kể. Nghiên cứu Lancet 2022: ngưỡng tối ưu 6.000–8.000 bước với người >60 tuổi, 8.000–10.000 với người trẻ hơn.',
      'Bước chân vs tập thể dục có chủ đích: 10.000 bước/ngày ≈ 5–7 km đi bộ ≈ 300–400 kcal. Kết hợp bước chân cao (NEAT) + tập thể dục cấu trúc (gym/cardio) cho kết quả tốt hơn chỉ tập gym nhưng ngồi suốt phần còn lại của ngày ("active couch potato" — nghiên cứu đã xác nhận tập 60 phút/ngày không bù đắp được 8–12h ngồi liên tục).',
      'Cách tăng bước chân mà không "cố gắng": đi cầu thang thay thang máy, xuống xe bus sớm 1–2 trạm, đi bộ khi gọi điện thoại, họp đứng hoặc walking meeting, đặt xe xa hơn 5 phút. Những thay đổi nhỏ này tích lũy 2.000–3.000 bước/ngày không tốn thêm thời gian.',
      'Intensity matters too: 100 bước/phút = walking pace bình thường. 130+ bước/phút = brisk walk (cardio nhẹ). Đoạn đi bộ nhanh 10 phút liên tục (brisk walking bout) có lợi ích cardiovascular bổ sung ngoài tổng bước chân. WHO khuyến nghị 150 phút moderate activity/tuần = ~10 phút brisk walk x 5 ngày/tuần.',
      'Công cụ theo dõi: điện thoại (accelerometer tích hợp, dùng Health/Google Fit) đủ chính xác cho theo dõi thường ngày — sai số ~5–10%. Đồng hồ thông minh chính xác hơn. Pedometer đơn giản giá rẻ ($5–10) cũng đủ. Quan trọng: consistency trong dùng một công cụ hơn là độ chính xác tuyệt đối.',
      'Ngưỡng cảnh báo: <3.000 bước/ngày liên tục nhiều tuần = sedentary lifestyle với các rủi ro sức khỏe rõ ràng. Nếu công việc buộc ngồi nhiều (>6h/ngày), bổ sung đứng dậy đi 5 phút mỗi giờ (tổng cộng 40 phút) giảm nguy cơ tim mạch tương đương tăng 1.000 bước/ngày.',
    ],
    points: [
      { icon: '🎯', label: '7.000–8.000 bước = mục tiêu thực tế', note: 'JAMA 2019: lợi ích plateau ở ~7.500 — 10.000 là marketing' },
      { icon: '🏢', label: 'NEAT > 1 buổi gym dài', note: 'Ngồi 8h dù tập gym 1h vẫn là sedentary — tăng NEAT cả ngày' },
      { icon: '⚡', label: '10 phút brisk walk = bonus cardio', note: '130+ bước/phút liên tục có lợi ích tim mạch bổ sung' },
      { icon: '📱', label: 'Điện thoại đủ chính xác để theo dõi', note: 'Consistency quan trọng hơn accuracy — dùng một tool nhất quán' },
    ],
  },
];

function ScheduleModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-48 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.metric} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold" style={{ color: item.color }}>{item.metric}</h2>
            <span className="text-sm px-2 py-0.5 rounded-full font-bold" style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>{item.freq}</span>
          </div>
          <p className="text-sm text-muted mb-4 opacity-70">⏰ {item.tip}</p>
          <div className="rounded-xl px-4 py-3 mb-5 text-base leading-relaxed"
            style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: `rgba(${item.rgb},0.9)` }}>
            💡 {item.keyFact}
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {SCHEDULE.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

function TabE2() {
  const [checks, setChecks] = useState({});
  const [schedModal, setSchedModal] = useState(null);
  const DAILY = ['Hôm nay ngủ được bao nhiêu giờ?', 'Có vận động ít nhất 20–30 phút không?', 'Có ăn đủ rau/đạm/nước không?', 'Mức stress hôm nay (1–10)?', 'Có triệu chứng bất thường nào không?'];
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-text text-lg mb-1">Lịch Theo Dõi Cơ Bản</h3>
        <p className="text-xs text-muted mb-3 opacity-60">Nhấp vào từng chỉ số để xem hướng dẫn và khoa học chi tiết</p>
        <div className="space-y-1.5">
          {SCHEDULE.map((s, i) => (
            <div key={s.metric}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 p-3 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSchedModal(i)}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${s.rgb},0.45)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="w-28 shrink-0">
                <div className="text-lg font-semibold text-text">{s.metric}</div>
                <div className="text-base font-bold" style={{ color: s.color }}>{s.freq}</div>
              </div>
              <p className="text-base text-muted leading-relaxed flex-1">{s.tip}</p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border shrink-0"
                style={{ color: s.color, borderColor: `rgba(${s.rgb},0.35)`, background: `rgba(${s.rgb},0.08)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
        <p className="text-base text-muted mt-2">* Chỉ khi có nguy cơ tăng huyết áp hoặc được bác sĩ khuyến nghị.</p>
      </div>
      <div>
        <h3 className="font-bold text-text text-lg mb-3">5 Câu Hỏi Self-Check Mỗi Ngày</h3>
        <div className="space-y-2">
          {DAILY.map((q, i) => (
            <button key={i} onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
              className="w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all"
              style={{ borderColor: checks[i] ? '#14b8a6' : '#2a2a2a', background: checks[i] ? '#14b8a610' : 'transparent' }}>
              <div className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0" style={{ borderColor: checks[i] ? '#14b8a6' : '#555', background: checks[i] ? '#14b8a6' : 'transparent' }}>
                {checks[i] && <span className="text-white text-base font-bold">✓</span>}
              </div>
              <span className="text-lg text-text">{q}</span>
            </button>
          ))}
        </div>
        <p className="text-base text-muted mt-2 italic">Đo để hiểu, không đo để ám ảnh. Nhìn xu hướng 4–12 tuần quan trọng hơn một con số đơn lẻ.</p>
      </div>
      {schedModal !== null && (
        <ScheduleModal
          item={SCHEDULE[schedModal]}
          idx={schedModal}
          onClose={() => setSchedModal(null)}
          onPrev={() => setSchedModal(i => Math.max(0, i - 1))}
          onNext={() => setSchedModal(i => Math.min(SCHEDULE.length - 1, i + 1))}
          hasPrev={schedModal > 0}
          hasNext={schedModal < SCHEDULE.length - 1}
        />
      )}
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
        <p className="text-lg font-bold text-red-400 mb-1">⚠️ Đi Cấp Cứu Ngay — Không Chờ</p>
        <p className="text-base text-muted">Khi có các dấu hiệu dưới đây: không tự xử trí, gọi 115 hoặc đến cơ sở y tế gần nhất.</p>
      </div>
      {EMERGENCY.map(g => (
        <div key={g.cat} className="rounded-2xl border border-border bg-surface/60 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{g.icon}</span>
            <span className="font-bold text-lg" style={{ color: g.color }}>{g.cat}</span>
          </div>
          <ul className="space-y-1">
            {g.signs.map(s => (
              <li key={s} className="flex items-start gap-2 text-base text-muted">
                <span className="shrink-0 mt-0.5" style={{ color: g.color }}>·</span>{s}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/08 p-4">
        <p className="text-base font-bold text-amber-400 mb-3">Nên Đi Khám Sớm Khi Có:</p>
        <div className="grid grid-cols-2 gap-2">
          {SOON.map(s => (
            <div key={s} className="flex items-start gap-2 text-base text-muted">
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
      <p className="text-base text-muted">Tập trung vào 4 nhóm bệnh quan trọng nhất trong cuộc sống hiện đại:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GROUPS.map(g => (
          <div key={g.t} className="rounded-2xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{g.icon}</span>
              <span className="font-bold text-lg" style={{ color: g.c }}>{g.t}</span>
            </div>
            <ul className="space-y-1.5">
              {g.items.map(it => (
                <li key={it} className="flex items-center gap-2 text-base text-muted">
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
        <h3 className="font-bold text-text text-lg mb-3">Gói Kiểm Tra Nền (Health Check Basic)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BASIC.map(b => (
            <div key={b} className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-base text-muted">
              <span style={{ color: '#84cc16' }}>✓</span>{b}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-text text-lg mb-3">Mở Rộng Theo Nguy Cơ</h3>
        <div className="space-y-3">
          {EXPANDED.map(g => (
            <div key={g.t} className="rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-base font-bold mb-2" style={{ color: '#84cc16' }}>+ {g.t}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map(it => <span key={it} className="text-base text-muted px-2 py-0.5 rounded-full border border-border">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-base text-muted">Khám định kỳ không nên là "gói xét nghiệm càng nhiều càng tốt" — nên dựa trên tuổi, nguy cơ và triệu chứng của từng người.</p>
    </div>
  );
}

function TabE6() {
  const RULES = ['Không tự ngưng thuốc bác sĩ kê', 'Không tự tăng/giảm liều', 'Không dùng đơn thuốc của người khác', 'Không phối hợp thực phẩm chức năng mà không biết thành phần', 'Không tin quảng cáo "chữa dứt điểm", "thải độc", "hết tiểu đường vĩnh viễn"'];
  const CHECK = ['Tôi dùng để làm gì? Có bằng chứng rõ không?', 'Tôi có bệnh nền / đang dùng thuốc không?', 'Sản phẩm có nguồn gốc rõ không?', 'Có nguy cơ ảnh hưởng gan/thận không?', 'Có được bác sĩ/dược sĩ tư vấn không?'];
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/08 p-5">
        <p className="text-lg font-bold text-violet-400 mb-3">5 Quy Tắc Không Của Thuốc</p>
        <ul className="space-y-2">
          {RULES.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-lg text-muted">
              <span className="font-black shrink-0" style={{ color: '#8b5cf6' }}>{i + 1}.</span>{r}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-lg font-bold text-text mb-3">Checklist Trước Khi Dùng Thực Phẩm Bổ Sung</p>
        <div className="space-y-2">
          {CHECK.map((q, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3 text-lg text-muted">
              <span className="font-black shrink-0" style={{ color: '#8b5cf6' }}>?</span>{q}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
        <p className="text-base font-bold text-red-400 mb-2">Cụm từ NGUY HIỂM trong quảng cáo</p>
        <div className="flex flex-wrap gap-2">
          {['"Chữa khỏi 100%"', '"Không tác dụng phụ"', '"Thải độc gan/thận"', '"Tan mỡ khi ngủ"', '"Hạ đường vĩnh viễn"', '"Không cần đi bệnh viện"'].map(t => (
            <span key={t} className="text-base px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{t}</span>
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
      <p className="text-base text-muted">Với sự bùng nổ của TikTok, YouTube và livestream bán hàng, lọc thông tin sức khỏe là kỹ năng sống quan trọng.</p>
      <div className="space-y-2">
        {QS.map(q => (
          <div key={q.n} className="rounded-xl border border-border bg-surface/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-base font-black shrink-0" style={{ background: `${COLOR}20`, color: COLOR }}>{q.n}</span>
              <span className="font-semibold text-lg text-text">{q.q}</span>
            </div>
            <p className="text-base text-muted pl-8">{q.tip}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
          <p className="text-base font-bold text-red-400 mb-2">❌ Cụm từ nguy hiểm</p>
          <ul className="space-y-1">{['"Bỏ thuốc tây đi"', '"Giải độc gan 7 ngày"', '"Ai cũng dùng được"', '"Sạch mạch máu"'].map(t => <li key={t} className="text-base text-muted">{t}</li>)}</ul>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/06 p-4">
          <p className="text-base font-bold text-green-400 mb-2">✓ Ngôn ngữ an toàn</p>
          <ul className="space-y-1">{['"Hỗ trợ theo dõi"', '"Cần cá nhân hóa"', '"Nên tham khảo bác sĩ"', '"Không thay thuốc điều trị"'].map(t => <li key={t} className="text-base text-muted">{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT = { e0: TabE0, e1: TabE1, e2: TabE2, e3: TabE3, e4: TabE4, e5: TabE5, e6: TabE6, e7: TabE7 };

export default function PillarE() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarE', { returnObjects: true });
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
      @keyframes peScanMove {
        0%   { background-position: -350% center; }
        100% { background-position: 350% center; }
      }
      @keyframes pePulse {
        0%, 100% { filter: drop-shadow(0 0 4px rgba(59,130,246,0.35)) drop-shadow(0 0 10px rgba(96,165,250,0.2)); }
        40%       { filter: drop-shadow(0 0 14px rgba(59,130,246,0.8)) drop-shadow(0 0 28px rgba(147,197,253,0.5)); }
        60%       { filter: drop-shadow(0 0 14px rgba(59,130,246,0.8)) drop-shadow(0 0 28px rgba(147,197,253,0.5)); }
      }
      .pe-title-know {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 20%,
          #93c5fd 35%, #3b82f6 46%, #67e8f9 54%, #93c5fd 63%,
          #ffffff 78%, #ffffff 100%
        );
        background-size: 360% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: peScanMove 5s linear infinite;
      }
      .pe-title-health {
        -webkit-text-fill-color: #93c5fd; color: #93c5fd;
        display: inline-block;
        animation: pePulse 2.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(ORBIT_ID); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-5xl mx-auto pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Sống Khỏe 360</span>
      </Link>

      <RevealBlock className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}07` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}25` }}>🏥</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
            {pillar?.title || 'Kiến Thức Sức Khỏe'}
          </h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>{pillar?.subtitle || 'Health Literacy'}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{pillar?.description || 'Hiểu cơ thể mình bằng ngôn ngữ đơn giản.'}</p>
          <div className="flex flex-wrap gap-6 mt-6">
            {['8 Module', '12 Tuần', '5 Chỉ số', '100 điểm'].map((label, i) => (
              <div key={label} className="group/stat relative">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={HERO_TIPS[i]} idx={`hero-e-${i}`} color={COLOR} />
                </div>
                <div className="text-xl font-black" style={{ color: COLOR }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <RevealBlock delay={80}>
        <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1400&q=80&auto=format&fit=crop" alt="Health Knowledge" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>{pillar?.image_caption || 'Hiểu Chỉ Số · Phòng Bệnh'}</span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Tab bar */}
      <RevealBlock delay={100}>
        <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 pt-3 mb-8"
          style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(14px)' }}>
          <div className="relative flex items-end overflow-x-auto scrollbar-hide"
            style={{ borderBottom: '1.5px solid rgba(255,255,255,0.09)' }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-2 shrink-0 font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                  style={active ? {
                    color: t.color,
                    padding: '9px 16px 11px',
                    background: '#111213',
                    borderTop: `2px solid ${t.color}`,
                    borderLeft: '1px solid rgba(255,255,255,0.09)',
                    borderRight: '1px solid rgba(255,255,255,0.09)',
                    borderBottom: '1.5px solid #111213',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '-1.5px',
                    boxShadow: `0 -4px 16px rgba(${t.rgb},0.14)`,
                  } : {
                    color: 'rgba(130,130,148,0.72)',
                    padding: '7px 14px 12px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: '8px 8px 0 0',
                  }}>
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-lg">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* Tab panel */}
      <RevealBlock key={activeTab}>
        <div className={`${tab.frameClass} rounded-3xl p-[1.5px] mb-16`}>
          <div className="rounded-3xl bg-surface p-5 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{tab.icon}</span>
              <div>
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: tab.color }}>{tab.id.toUpperCase()} · Trụ Cột E</div>
                <div className="text-xl font-bold text-text">{tab.label}</div>
              </div>
            </div>
            <TabPanel />
          </div>
        </div>
      </RevealBlock>

      {/* Teaser grid */}
      <RevealBlock delay={60}>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">Khám Phá Sâu Hơn</h2>
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
          <p className="text-base text-muted leading-relaxed">
            <strong className="font-bold" style={{ color: COLOR }}>⚕️ Lưu ý quan trọng:</strong> Trụ cột E cung cấp kiến thức và công cụ tự theo dõi — không thay thế khám bệnh, chẩn đoán hoặc điều trị cá nhân hóa. Nếu có bệnh nền hoặc đang dùng thuốc đặc trị, hãy trao đổi với bác sĩ trước khi thay đổi chế độ ăn, tập luyện hoặc bổ sung sản phẩm.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
