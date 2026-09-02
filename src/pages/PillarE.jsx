import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const { t: tPE0 } = useTranslation('pillars');
  const pillarE0 = tPE0('pillarE', { returnObjects: true });
  const [form, setForm] = useState(() => { try { return JSON.parse(localStorage.getItem(E0_KEY)) || {}; } catch { return {}; } });
  const set = (k, v) => { const next = { ...form, [k]: v }; setForm(next); localStorage.setItem(E0_KEY, JSON.stringify(next)); };
  const bmi = form.weight && form.height ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1) : null;
  const bmis = [pillarE0?.e0_bmi_underweight || 'Thiếu cân', pillarE0?.e0_bmi_normal || 'Bình thường', pillarE0?.e0_bmi_overweight || 'Thừa cân', pillarE0?.e0_bmi_obese || 'Béo phì'];
  const bmiLabel = bmi ? (bmi < 18.5 ? bmis[0] : bmi < 25 ? bmis[1] : bmi < 30 ? bmis[2] : bmis[3]) : '';
  const bmiColor = bmi ? (bmi < 18.5 ? '#f59e0b' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444') : '#888';
  const egPfx = pillarE0?.e0_eg_prefix || 'VD';
  const fields = [
    { k: 'age', l: pillarE0?.e0_field_age || 'Tuổi', t: 'number', ph: `${egPfx}: 30`, unit: pillarE0?.e0_unit_years || 'tuổi' },
    { k: 'weight', l: pillarE0?.e0_field_weight || 'Cân nặng', t: 'number', ph: `${egPfx}: 65`, unit: 'kg' },
    { k: 'height', l: pillarE0?.e0_field_height || 'Chiều cao', t: 'number', ph: `${egPfx}: 168`, unit: 'cm' },
    { k: 'waist', l: pillarE0?.e0_field_waist || 'Vòng eo', t: 'number', ph: `${egPfx}: 80`, unit: 'cm' },
  ];
  const VI_DISEASES = ['Không có bệnh nền', 'Tăng huyết áp', 'Đái tháo đường', 'Rối loạn mỡ máu', 'Bệnh tim mạch', 'Bệnh thận', 'Bệnh gan', 'Bệnh phổi'];
  const diseaseLabels = pillarE0?.e0_diseases || VI_DISEASES;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-4" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
        <p className="text-lg font-semibold mb-1" style={{ color: COLOR }}>{pillarE0?.e0_profile_title || '✦ Hồ Sơ Sức Khỏe Cá Nhân (E0)'}</p>
        <p className="text-base text-muted">{pillarE0?.e0_auto_save || 'Lưu tự động trên thiết bị. Dùng để cá nhân hóa nội dung trong toàn bộ Trụ cột E.'}</p>
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
        <label className="text-base text-muted mb-1 block">{pillarE0?.e0_gender || 'Giới tính'}</label>
        <div className="flex gap-2">
          {[{ v: 'male', l: pillarE0?.e0_male || '♂ Nam' }, { v: 'female', l: pillarE0?.e0_female || '♀ Nữ' }].map(g => (
            <button key={g.v} onClick={() => set('sex', g.v)}
              className="flex-1 py-2 rounded-xl border text-lg font-semibold transition-all"
              style={form.sex === g.v ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {g.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-base text-muted mb-1 block">{pillarE0?.e0_conditions || 'Bệnh nền'}</label>
        <div className="flex flex-wrap gap-2">
          {VI_DISEASES.map((d, i) => (
            <button key={d} onClick={() => { const cur = form.diseases || []; const next = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d]; set('diseases', next); }}
              className="px-3 py-1 rounded-full text-base border transition-all"
              style={(form.diseases || []).includes(d) ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
              {diseaseLabels[i]}
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
            <p className="text-base text-muted">Vòng eo: {form.waist || '–'} cm · {form.sex === 'female' ? (pillarE0?.e0_waist_female || 'Nữ: ngưỡng >80 cm') : (pillarE0?.e0_waist_male || 'Nam: ngưỡng >90 cm')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TabE1() {
  const { t: tP } = useTranslation('pillars');
  const METRICS_BASE = [
    { icon: '⚖️', t: 'BMI', d: 'Chỉ số khối cơ thể = Cân nặng (kg) / Chiều cao² (m). Sàng lọc nguy cơ. Không phân biệt mỡ và cơ.', ranges: [{ l: '< 18.5', n: 'Thiếu cân', c: '#f59e0b' }, { l: '18.5–24.9', n: 'Bình thường', c: '#10b981' }, { l: '25–29.9', n: 'Thừa cân', c: '#f59e0b' }, { l: '≥ 30', n: 'Béo phì', c: '#ef4444' }], link: '/pillar/e/bmi' },
    { icon: '📏', t: 'Vòng Eo', d: 'Phản ánh mỡ bụng nội tạng — nguy cơ tim mạch và chuyển hóa quan trọng hơn cân nặng.', ranges: [{ l: 'Nam <90cm', n: 'OK', c: '#10b981' }, { l: 'Nam ≥90cm', n: 'Nguy cơ', c: '#ef4444' }, { l: 'Nữ <80cm', n: 'OK', c: '#10b981' }, { l: 'Nữ ≥80cm', n: 'Nguy cơ', c: '#ef4444' }], link: '/pillar/e/bmi' },
    { icon: '❤️', t: 'Huyết Áp', d: 'Bình thường: <120/80 mmHg. Không triệu chứng khi cao — cần đo định kỳ.', ranges: [{ l: '<120/80', n: 'Bình thường', c: '#10b981' }, { l: '130–139/80–89', n: 'Gđ 1', c: '#f59e0b' }, { l: '≥140/90', n: 'Gđ 2', c: '#ef4444' }], link: '/pillar/e/blood-pressure' },
    { icon: '🍬', t: 'Đường Huyết Đói', d: 'Nồng độ glucose sau nhịn ăn ≥8h. Phản ánh kiểm soát đường huyết lúc nghỉ.', ranges: [{ l: '<100 mg/dL', n: 'Bình thường', c: '#10b981' }, { l: '100–125', n: 'Tiền ĐTĐ', c: '#f59e0b' }, { l: '≥126', n: 'ĐTĐ*', c: '#ef4444' }], link: '/pillar/e/blood-sugar' },
    { icon: '🧪', t: 'HbA1c', d: 'Đường huyết trung bình 2–3 tháng. Không cần nhịn ăn. Đánh giá kiểm soát lâu dài.', ranges: [{ l: '<5.7%', n: 'Bình thường', c: '#10b981' }, { l: '5.7–6.4%', n: 'Tiền ĐTĐ', c: '#f59e0b' }, { l: '≥6.5%', n: 'ĐTĐ*', c: '#ef4444' }], link: '/pillar/e/blood-sugar' },
    { icon: '🫀', t: 'Mỡ Máu', d: 'LDL-C, HDL-C, Triglyceride, Cholesterol TP. Liên quan xơ vữa động mạch.', ranges: [{ l: 'LDL<100', n: 'Lý tưởng', c: '#10b981' }, { l: 'HDL>60', n: 'Bảo vệ', c: '#10b981' }, { l: 'TG≥200', n: 'Cao', c: '#ef4444' }], link: '/pillar/e/lipids' },
  ];
  const METRICS = METRICS_BASE.map((m, i) => ({
    ...m,
    t: tP(`pillarE.e_metrics_tr.${i}.t`, { defaultValue: m.t }),
    d: tP(`pillarE.e_metrics_tr.${i}.d`, { defaultValue: m.d }),
    ranges: m.ranges.map((r, ri) => ({
      ...r,
      l: tP(`pillarE.e_metrics_tr.${i}.ranges.${ri}.l`, { defaultValue: r.l }),
      n: tP(`pillarE.e_metrics_tr.${i}.ranges.${ri}.n`, { defaultValue: r.n }),
    })),
  }));
  const footnote = tP('pillarE.e_metrics_footnote', { defaultValue: '* Cần xác nhận lại trong bối cảnh y tế phù hợp, không tự kết luận.' });
  return (
    <div className="space-y-3">
      {METRICS.map(m => (
        <Link to={m.link} key={m.link} className="block rounded-2xl border border-border bg-surface/60 p-4 hover:border-blue-500/30 transition-colors group">
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
      <p className="text-base text-muted">{footnote}</p>
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

function ScheduleModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t: tCommon } = useTranslation('common');
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
  return createPortal(
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
            {tCommon('modal.prev')}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              {tCommon('modal.next')}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

const DAILY_CHECKS = [
  {
    q: 'Hôm nay ngủ được bao nhiêu giờ?', icon: '😴', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người lớn cần 7–9 giờ ngủ mỗi đêm (AHA/CDC). Thiếu ngủ mãn tính (<6h) gây rối loạn hormone hunger/fullness (ghrelin tăng 15%, leptin giảm 15%), tăng nguy cơ béo phì 89%, đái tháo đường 25%, và giảm hiệu suất nhận thức tương đương uống 2 ly rượu. Đây là câu hỏi quan trọng nhất trong checklist vì giấc ngủ ảnh hưởng đến mọi chỉ số còn lại.',
    detail: 'Ghi số giờ ngủ thực tế mỗi sáng tạo dữ liệu cá nhân quý giá: bạn ngủ ít nhất ngày nào? Sau khi ngủ đủ, ngày hôm sau bạn ăn ít hơn không? Tập luyện tốt hơn không? Chuỗi dữ liệu 30 ngày sẽ cho thấy pattern rõ ràng mà không thể cảm nhận chủ quan được.',
    details: [
      'Ngưỡng tối thiểu và lý tưởng: <6h = thiếu ngủ rõ rệt, có hại sinh lý. 6–7h = vùng xám, đủ chức năng nhưng tích lũy sleep debt. 7–9h = khuyến nghị cho người trưởng thành. >9h thường xuyên mà vẫn mệt = có thể là triệu chứng bệnh (trầm cảm, thiếu máu, suy giáp, sleep apnea).',
      'Sleep debt tích lũy: mỗi đêm thiếu 1h ngủ tạo ra "sleep debt." Não không thể phân biệt được mức độ suy giảm của chính nó khi thiếu ngủ — người thiếu ngủ thường nghĩ mình đang ổn trong khi test hiệu suất cho thấy tệ hơn nhiều. Ngủ bù cuối tuần chỉ phục hồi được một phần.',
      'Thời điểm ngủ quan trọng không kém số giờ: ngủ 23:00–7:00 (8h, đúng nhịp sinh học) tốt hơn ngủ 2:00–10:00 (8h, lệch nhịp). Deep sleep cao điểm trong nửa đêm đầu, REM cao điểm nửa đêm sau. Ngủ muộn = ít deep sleep = ít hormone tăng trưởng, ít hồi phục cơ thể.',
      'Dấu hiệu ngủ đủ giấc: thức dậy trước báo thức hoặc cùng giờ không cần báo thức, không cần cà phê để tỉnh táo buổi sáng, không buồn ngủ trong khi ngồi yên ban ngày, cảm thấy sảng khoái trong 1h đầu sau khi dậy.',
      'Cải thiện nhanh nhất: (1) Ngủ và dậy cùng giờ mỗi ngày — kể cả cuối tuần. (2) Không dùng màn hình 1h trước ngủ (ánh sáng xanh ức chế melatonin 2–3h). (3) Phòng mát 18–20°C. (4) Không uống rượu bia 3h trước ngủ. Chỉ cần áp dụng 2 trong 4 điều này, chất lượng giấc ngủ cải thiện rõ rệt sau 1–2 tuần.',
      'Khi nào cần đánh giá y tế: ngủ đủ giờ nhưng vẫn mệt khi dậy, ngáy to hoặc thức dậy nhiều lần trong đêm, buồn ngủ ban ngày không kiểm soát được (ngủ gật khi họp, xem TV), khó ngủ >30 phút mỗi đêm kéo dài >4 tuần. Sleep apnea và insomnia có phương pháp điều trị hiệu quả — không cần chịu đựng.',
    ],
    points: [
      { icon: '🎯', label: '7–9 giờ là ngưỡng tối ưu', note: '<6h mãn tính = suy giảm tương đương uống rượu liên tục' },
      { icon: '🌙', label: 'Ngủ trước nửa đêm để có deep sleep', note: 'Deep sleep cao điểm 22:00–2:00 — ngủ muộn mất đi khoảng này' },
      { icon: '📵', label: 'Tắt màn hình 1h trước khi ngủ', note: 'Ánh sáng xanh delay melatonin 2–3h — giờ ngủ thiếp muộn hơn' },
      { icon: '📅', label: 'Cùng giờ ngủ/dậy cả 7 ngày', note: 'Nhịp sinh học ổn định = chất lượng cao hơn dù số giờ không đổi' },
    ],
  },
  {
    q: 'Có vận động ít nhất 20–30 phút không?', icon: '🏃', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị 150–300 phút moderate aerobic/tuần (hoặc 75–150 phút vigorous) + strength training 2 ngày/tuần. Nghiên cứu Lancet 2016 (>1 triệu người): 1h/ngày moderate activity (đi bộ nhanh, đạp xe) đủ để loại bỏ hoàn toàn nguy cơ tử vong sớm liên quan đến ngồi nhiều. Chỉ 20–30 phút/ngày đã giảm đáng kể nguy cơ tim mạch, đái tháo đường và trầm cảm.',
    detail: 'Câu hỏi này không đặt bar quá cao — 20 phút là ngưỡng tối thiểu đủ để có lợi ích sinh lý rõ ràng: tăng BDNF (não), tiết endorphin, cải thiện insulin sensitivity 24–48h sau tập. Ghi "Rồi" hay "Chưa" mỗi ngày tạo accountability và giúp bạn nhận ra pattern: bạn ít vận động nhất ngày nào trong tuần?',
    details: [
      'Tại sao 20–30 phút đủ để tính: nghiên cứu Jakicic (2015): ba đoạn 10 phút/ngày tốt ngang một đoạn 30 phút liên tục cho sức khỏe tim mạch. "Exercise snacks" (1–5 phút vigorous activity mỗi giờ) tích lũy lợi ích tương đương. Quan trọng nhất là tổng thời gian trong tuần.',
      'Phân biệt các mức độ: Light (đi bộ thong thả, kéo giãn) — tốt hơn ngồi nhưng ít benefit tim mạch. Moderate (đi bộ nhanh, đạp xe bình thường, bơi chậm — mức bạn thở nhanh hơn nhưng vẫn nói chuyện được) — ngưỡng có lợi ích đã được chứng minh. Vigorous (chạy, HIIT, đạp xe nhanh — khó nói chuyện) — lợi ích tương đương moderate nhưng thời gian ngắn hơn 2×.',
      'Zone 2 cardio — vũ khí bí mật: cường độ bạn vẫn trò chuyện được nhưng hơi thở hơi nặng (~60–70% max heart rate). Đây là zone tốt nhất cho mitochondrial biogenesis, fat oxidation dài hạn và cardiorespiratory fitness. 3–4 buổi 30–45 phút/tuần trong 3–6 tháng tạo thay đổi sinh lý cơ bản: RHR giảm, VO2max tăng, insulin sensitivity cải thiện rõ.',
      'Resistance training — không thể thiếu sau 30 tuổi: mất 1–2% cơ bắp/năm (sarcopenia) sau 30 nếu không tập. Cơ bắp là "metabolic organ" — tăng 1 kg cơ = tăng ~50 kcal TDEE. 2–3 buổi/tuần compound movements (squat, deadlift, push-up, row) đủ để bảo toàn cơ bắp dài hạn. Không cần gym — bodyweight đủ nếu đủ progressive overload.',
      'Vận động và não: tập thể dục tăng BDNF (Brain-Derived Neurotrophic Factor) — "phân bón não" giúp neuroplasticity, trí nhớ và chống trầm cảm. Một buổi tập 20–30 phút cải thiện tập trung và tâm trạng trong 2–4h tiếp theo. Đây là lý do nhiều người làm việc sáng tạo thấy hiệu quả nhất ngay sau tập.',
      'Vượt qua rào cản "không có thời gian": 20 phút = 1.4% của 24h. Giải pháp: đặt lịch như cuộc họp, không phải tùy hứng. Morning walk trước khi tắm. Đi bộ/đạp xe đi làm. Tập ngay sau ăn tối (cũng giúp kiểm soát đường huyết sau ăn). Nghiên cứu: người báo cáo "không có thời gian tập" xem TV trung bình 3.5h/ngày.',
    ],
    points: [
      { icon: '⏱️', label: '3 × 10 phút = 1 × 30 phút', note: 'Exercise snacks tích lũy — không cần liên tục để có lợi ích' },
      { icon: '💬', label: 'Zone 2: vừa đi vừa nói chuyện được', note: 'Cường độ tối ưu cho fat burn và tim mạch dài hạn' },
      { icon: '💪', label: 'Resistance 2×/tuần chống sarcopenia', note: '-1–2% cơ/năm sau 30 nếu không tập — cơ là metabolic organ' },
      { icon: '🧠', label: 'BDNF tăng ngay sau 20 phút tập', note: 'Tập trung và tâm trạng tốt hơn 2–4h sau buổi tập' },
    ],
  },
  {
    q: 'Có ăn đủ rau/đạm/nước không?', icon: '🥗', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ba trụ dinh dưỡng cơ bản nhất: rau (fiber, vi chất, chống oxy hóa), protein (tổng hợp cơ, miễn dịch, enzyme, hormone), nước (mọi phản ứng sinh hóa đều cần nước). Thiếu bất kỳ trụ nào đều có hậu quả ngay trong ngày: thiếu fiber → glucose spike; thiếu protein → muscle breakdown; thiếu nước →giảm hiệu suất nhận thức 10–15% khi mất 2% trọng lượng cơ thể.',
    detail: 'Câu hỏi đơn giản "Có đủ rau/đạm/nước không?" là filter tốt nhất cho chế độ ăn hàng ngày mà không cần đếm calo. Nếu câu trả lời là "Có" cho cả 3, rất có thể bạn đang ăn uống hợp lý. Nếu "Không" nhiều ngày liên tiếp → đây là tín hiệu cần điều chỉnh.',
    details: [
      'Rau và chất xơ — nền tảng sức khỏe microbiome: khuyến nghị 400–600g rau/ngày (5 phần). Chất xơ mục tiêu 25–35g/ngày. Chất xơ nuôi vi khuẩn ruột có lợi → sản xuất short-chain fatty acids → giảm viêm, tăng nhạy cảm insulin, hỗ trợ miễn dịch. Đa dạng loại rau quan trọng hơn số lượng — mỗi màu sắc có phytochemical khác nhau.',
      'Protein — ngưỡng tối thiểu và tối ưu: người ít vận động tối thiểu 0.8g/kg/ngày (thường thiếu ở người ăn nhiều tinh bột). Người tập thể dục: 1.2–2g/kg. Protein quan trọng nhất cho bữa sáng và sau tập — "protein pulse" 25–40g mỗi bữa kích hoạt muscle protein synthesis hiệu quả hơn chia nhỏ nhiều bữa ít. Nguồn tốt: trứng, cá, đậu phụ, thịt nạc, sữa chua Hy Lạp.',
      'Nước — bao nhiêu là đủ: công thức cơ bản: 35ml × kg cân nặng/ngày. VD: 65kg → 2.275L/ngày. Thêm nước khi tập (500ml/30 phút vigorous activity), thời tiết nóng, hoặc đổ mồ hôi nhiều. Màu nước tiểu là indicator tốt nhất: vàng nhạt như nước chanh = đủ nước; vàng đậm = cần uống thêm; trong suốt = uống quá nhiều.',
      'Meal sequencing — thứ tự ăn quan trọng: ăn rau trước → protein → tinh bột cuối. Nghiên cứu Weill Cornell (2015): ăn rau và protein trước tinh bột giảm glucose peak 29–37% và insulin spike 20–28% so với ăn tinh bột trước. Không cần thay đổi thực phẩm, chỉ thay đổi thứ tự.',
      'Thiếu nước ảnh hưởng nhận thức: mất 1–2% trọng lượng cơ thể qua nước (700mL–1.4L với người 70kg) làm giảm tập trung 13%, trí nhớ ngắn hạn 7%, tăng cảm giác mệt mỏi và đau đầu. RHR tăng 7–8 bpm. Rất nhiều người bị "mệt mỏi chiều" thực ra là do mất nước nhẹ tích lũy trong ngày.',
      'Practical framework — đĩa ăn đơn giản: 50% rau (nhiều màu sắc), 25% protein (ít nhất 25–30g mỗi bữa), 25% tinh bột phức hợp (gạo lứt, khoai, quinoa). Không cần app đếm calo — nếu đĩa ăn của bạn trông như thế này và bạn uống đủ nước, 80% dinh dưỡng đã được đảm bảo.',
    ],
    points: [
      { icon: '🥦', label: '400–600g rau/ngày · 25–35g fiber', note: 'Fiber nuôi microbiome → giảm viêm, insulin sensitivity tốt hơn' },
      { icon: '🥩', label: 'Protein 1.2–2g/kg · 25–40g/bữa', note: 'Muscle protein synthesis cần "pulse" đủ lớn mỗi bữa, không rải đều' },
      { icon: '💧', label: '35ml/kg/ngày · uống trước khi khát', note: 'Khát = đã thiếu nước — uống đều cả ngày, không dồn một lúc' },
      { icon: '🥗', label: 'Ăn rau trước → protein → tinh bột', note: 'Meal sequencing giảm glucose spike 29–37% không đổi thực phẩm' },
    ],
  },
  {
    q: 'Mức stress hôm nay (1–10)?', icon: '🧘', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ghi điểm stress mỗi tối là bước đầu tiên để quản lý nó. Hầu hết mọi người bị ảnh hưởng bởi stress nhưng không nhận ra pattern của mình — ngày nào cao nhất? Nguyên nhân gì? Can thiệp nào giúp? Sau 30 ngày theo dõi, bạn sẽ biết câu trả lời cụ thể cho bản thân hơn bất kỳ cuốn sách self-help nào.',
    detail: 'Stress cấp tính ngắn hạn (eustress) thực ra có lợi: tăng cortisol tạm thời cải thiện focus, tăng immune activity, củng cố trí nhớ. Vấn đề là stress mãn tính kéo dài — cortisol không bao giờ hạ xuống — gây ức chế miễn dịch, mỡ bụng, tăng huyết áp và thu nhỏ hippocampus. Phân biệt "stress tốt" (thử thách vừa sức, có deadline rõ ràng) và "stress độc" (không kiểm soát được, kéo dài, không có lối thoát).',
    details: [
      'Dùng thang đúng: 1–3 = thư giãn, hoạt động như bình thường. 4–5 = stress nhẹ, có thể xử lý. 6–7 = ảnh hưởng tập trung và quyết định. 8–9 = rất khó kiểm soát, triệu chứng thể chất (đau đầu, căng vai gáy). 10 = khủng hoảng. Kèm theo con số, ghi 1 từ nguyên nhân chính: "công việc", "gia đình", "tiền", "sức khỏe" — sẽ rõ pattern sau vài tuần.',
      'Cortisol và ảnh hưởng sinh lý: cortisol cao mãn tính → tăng glucose máu (cơ thể chuẩn bị "fight or flight") → nếu glucose không được dùng → tích trữ thành mỡ nội tạng. Ức chế hệ tiêu hóa, hệ sinh sản, hệ miễn dịch. Huyết áp tăng. Ngủ kém (cortisol đêm bình thường thấp — stress mãn tính đảo lộn nhịp này).',
      'Can thiệp tức thì hiệu quả nhất — breathing: Physiological sigh (hít vào sâu qua mũi, hít thêm một hơi ngắn, thở ra dài qua miệng) — Stanford 2023: hiệu quả nhất trong tất cả breathing techniques để hạ cortisol ngay lập tức. Box breathing (4-4-4-4) kích hoạt parasympathetic trong 2–3 phút. 4-7-8 breathing cho trước khi ngủ.',
      'Tập thể dục — reset stress tốt nhất: 20–30 phút moderate exercise tiêu thụ cortisol, tăng endorphin và serotonin, tăng BDNF. Nghiên cứu: một buổi tập hiệu quả trong việc hạ lo âu ngang bằng benzodiazepine liều thấp trong các RCT, không tác dụng phụ. Điều trị lo âu và trầm cảm nhẹ-vừa: exercise là first-line recommendation của NICE (UK) và APA.',
      'Cold exposure và stress resilience: tắm nước lạnh 30–90 giây/ngày tăng norepinephrine 100–300% — chất tạo focus và mood. Quan trọng hơn: tập chịu đựng cảm giác khó chịu trong môi trường an toàn (nước lạnh) → tăng tolerance với stress thực tế trong cuộc sống. Wim Hof method, cold plunge có nền tảng nghiên cứu ngày càng vững.',
      'Khi điểm stress ≥7 trong >7 ngày liên tiếp: đây là dấu hiệu cần can thiệp chủ động, không phải "cố thêm một chút." Xem xét: liệu pháp CBT (hiệu quả nhất cho lo âu mãn tính theo meta-analysis), mindfulness-based stress reduction (MBSR) 8 tuần, giảm tải công việc, nói chuyện với người tin tưởng, và nếu cần — đánh giá tâm lý/tâm thần chuyên khoa.',
    ],
    points: [
      { icon: '📊', label: 'Ghi số + 1 từ nguyên nhân', note: 'Pattern 30 ngày cho thấy trigger và hiệu quả can thiệp cụ thể của bạn' },
      { icon: '🫁', label: 'Physiological sigh hạ cortisol ngay', note: 'Stanford 2023: hít sâu + hít thêm + thở ra dài — hiệu quả nhất' },
      { icon: '🏃', label: '20 phút tập = benzodiazepine liều thấp', note: 'Reset stress tốt nhất — không tác dụng phụ, không nghiện' },
      { icon: '⚠️', label: '≥7/10 liên tục >7 ngày → cần can thiệp', note: 'Allostatic overload — không tự phục hồi được, cần hỗ trợ chủ động' },
    ],
  },
  {
    q: 'Có triệu chứng bất thường nào không?', icon: '🩺', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hỏi bản thân mỗi tối "có gì bất thường không?" là thói quen đơn giản nhất để phát hiện sớm các vấn đề sức khỏe. Nhiều bệnh nghiêm trọng (ung thư, bệnh tim, đái tháo đường, tăng huyết áp) có triệu chứng sớm mờ nhạt mà người bệnh bỏ qua nhiều tháng vì nghĩ là "bình thường." Ghi nhận và theo dõi thay đổi theo thời gian là kỹ năng y tế quan trọng nhất bạn có thể có.',
    detail: 'Không phải mọi triệu chứng đều cần lo lắng — cơ thể luôn có những biến động nhỏ. Quan trọng là nhận ra điều gì là MỚI, KHÔNG GIẢI THÍCH ĐƯỢC, hoặc KÉO DÀI hơn bình thường. Câu hỏi tốt để tự hỏi: "Nếu cứ 2–4 tuần nữa vẫn như thế này, mình có lo không?" Nếu câu trả lời là "Có" → đặt lịch khám.',
    details: [
      'Triệu chứng cần chú ý — không cần cấp cứu nhưng cần khám trong 1–2 tuần: mệt mỏi bất thường kéo dài >2 tuần không giải thích được, sụt cân không chủ ý >5% trong 6 tháng, ho kéo dài >3 tuần, đau ngực khi gắng sức hoặc leo cầu thang, phù chân mới xuất hiện, tiểu nhiều/khát nhiều bất thường, thay đổi thói quen đại tiện kéo dài.',
      'Red flags — cần khám sớm trong 24–48h: vết thương lâu lành (>2 tuần, đặc biệt nếu có đái tháo đường), khó nuốt kéo dài, thay đổi giọng nói kéo dài >3 tuần, nổi hạch không đau to dần, xuất huyết bất thường (phân đen, tiểu ra máu, nôn ra máu, xuất huyết âm đạo sau mãn kinh).',
      'Cấp cứu ngay — gọi 115 hoặc đến ER: đau ngực dữ dội bóp nghẹt, khó thở đột ngột nặng, yếu liệt một bên người/méo miệng/nói khó đột ngột (nghi đột quỵ), đau đầu dữ dội đột ngột "sét đánh", mất ý thức, co giật lần đầu.',
      'Theo dõi symptom journal: khi có triệu chứng, ghi: ngày bắt đầu, mô tả cụ thể (đau như thế nào, ở đâu, mức độ 1–10), thời gian kéo dài mỗi lần, yếu tố làm nặng/nhẹ hơn, triệu chứng kèm theo. Thông tin này giúp bác sĩ chẩn đoán chính xác hơn nhiều — và giúp bạn quyết định có cần đi khám không.',
      'Đừng tự chẩn đoán bằng internet: "cyberchondria" — lo lắng do tự tra Google triệu chứng — rất phổ biến và thường dẫn đến kết luận sai (mọi đau đầu đều thành u não khi Google). Rule of thumb: Google để hiểu cơ bản, nhưng quyết định có đi khám hay không dựa trên: triệu chứng có mới, kéo dài, hoặc ảnh hưởng chức năng không? Không phải dựa trên worst-case scenario từ internet.',
      'Biết bình thường của chính mình: không ai biết cơ thể bạn tốt hơn bạn — nhưng chỉ khi bạn chú ý. Nhiều người "không để ý" đến cơ thể đến mức không phân biệt được "bình thường của mình" và "triệu chứng mới." Daily check-in xây dựng awareness này từng ngày — sau vài tháng, bạn sẽ nhận ra thay đổi nhỏ sớm hơn nhiều so với người không theo dõi.',
    ],
    points: [
      { icon: '🔍', label: 'Mới + Kéo dài + Không giải thích = khám', note: 'Ba tiêu chí để phân biệt biến động bình thường và triệu chứng thực' },
      { icon: '📝', label: 'Ghi: ngày bắt đầu, mô tả, mức độ', note: 'Symptom journal giúp bác sĩ chẩn đoán chính xác hơn nhiều' },
      { icon: '📵', label: 'Không tự chẩn đoán bằng Google', note: 'Dùng để hiểu cơ bản — không để quyết định có bệnh nghiêm trọng không' },
      { icon: '🚑', label: 'Yếu liệt một bên / đau ngực → 115 ngay', note: 'Đột quỵ: mỗi phút = 1.9 triệu tế bào não — không chờ xem thêm' },
    ],
  },
];

function TabE2() {
  const { t: tCommon } = useTranslation('common');
  const { t: tP } = useTranslation('pillars');
  const pillarE = tP('pillarE', { returnObjects: true });
  const scheduleTr = Array.isArray(pillarE?.e_schedule) ? pillarE.e_schedule : [];
  const SCHED = SCHEDULE.map((s, i) => ({ ...s, ...(scheduleTr[i] || {}) }));
  const checksTr = Array.isArray(pillarE?.e_daily_checks) ? pillarE.e_daily_checks : [];
  const CHECKS = DAILY_CHECKS.map((s, i) => ({ ...s, ...(checksTr[i] || {}) }));
  const [checks, setChecks] = useState({});
  const [schedModal, setSchedModal] = useState(null);
  const [dailyModal, setDailyModal] = useState(null);
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-text text-lg mb-1">{pillarE?.e_tab2_h1 || 'Lịch Theo Dõi Cơ Bản'}</h3>
        <p className="text-xs text-muted mb-3 opacity-60">{pillarE?.e_tab2_hint1 || 'Nhấp vào từng chỉ số để xem hướng dẫn và khoa học chi tiết'}</p>
        <div className="space-y-1.5">
          {SCHED.map((s, i) => (
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
                style={{ color: s.color, borderColor: `rgba(${s.rgb},0.35)`, background: `rgba(${s.rgb},0.08)` }}>{tCommon('modal.see_detail')}</span>
            </div>
          ))}
        </div>
        <p className="text-base text-muted mt-2">* Chỉ khi có nguy cơ tăng huyết áp hoặc được bác sĩ khuyến nghị.</p>
      </div>
      <div>
        <h3 className="font-bold text-text text-lg mb-1">{pillarE?.e_tab2_h2 || '5 Câu Hỏi Self-Check Mỗi Ngày'}</h3>
        <p className="text-xs text-muted mb-3 opacity-60">{pillarE?.e_tab2_hint2 || 'Tick để check · Nhấp "Chi tiết" để xem khoa học và hướng dẫn'}</p>
        <div className="space-y-2">
          {CHECKS.map((item, i) => (
            <div key={i}
              className="flex items-center gap-3 rounded-xl border p-3 transition-all duration-200"
              style={{ borderColor: checks[i] ? `rgba(${item.rgb},0.4)` : '#2a2a2a', background: checks[i] ? `rgba(${item.rgb},0.07)` : 'transparent' }}>
              <button
                onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
                className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                style={{ borderColor: checks[i] ? item.color : '#555', background: checks[i] ? item.color : 'transparent' }}>
                {checks[i] && <span className="text-white text-[11px] font-black">✓</span>}
              </button>
              <span className="text-base text-text flex-1">{item.q}</span>
              <button
                onClick={() => setDailyModal(i)}
                className="text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 transition-all hover:opacity-80"
                style={{ color: item.color, borderColor: `rgba(${item.rgb},0.35)`, background: `rgba(${item.rgb},0.08)` }}>
                {tCommon('modal.see_detail')}
              </button>
            </div>
          ))}
        </div>
        <p className="text-base text-muted mt-2 italic">{pillarE?.e_tab2_note || 'Đo để hiểu, không đo để ám ảnh. Nhìn xu hướng 4–12 tuần quan trọng hơn một con số đơn lẻ.'}</p>
      </div>
      {schedModal !== null && (
        <ScheduleModal
          item={SCHED[schedModal]} idx={schedModal} total={SCHED.length}
          onClose={() => setSchedModal(null)}
          onPrev={() => setSchedModal(i => Math.max(0, i - 1))}
          onNext={() => setSchedModal(i => Math.min(SCHED.length - 1, i + 1))}
          hasPrev={schedModal > 0} hasNext={schedModal < SCHED.length - 1}
        />
      )}
      {dailyModal !== null && (
        <ScheduleModal
          item={CHECKS[dailyModal]} idx={dailyModal} total={CHECKS.length}
          onClose={() => setDailyModal(null)}
          onPrev={() => setDailyModal(i => Math.max(0, i - 1))}
          onNext={() => setDailyModal(i => Math.min(CHECKS.length - 1, i + 1))}
          hasPrev={dailyModal > 0} hasNext={dailyModal < CHECKS.length - 1}
        />
      )}
    </div>
  );
}

const EMERGENCY = [
  {
    icon: '💔', cat: 'Tim Mạch', color: '#ef4444', rgb: '239,68,68',
    signs: ['Đau ngực dữ dội, bóp nghẹt, lan tay trái/hàm/lưng', 'Khó thở đột ngột', 'Ngất bất ngờ', 'Hồi hộp kèm choáng, đau ngực, khó thở', 'Huyết áp rất cao kèm đau ngực, yếu liệt, lú lẫn'],
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhồi máu cơ tim (NMCT) và suy tim cấp là hai cấp cứu tim mạch phổ biến nhất. Với NMCT: mỗi phút không được tái tưới máu = thêm khoảng 2 triệu tế bào cơ tim chết. "Time is muscle" — thời gian từ khi có triệu chứng đến khi mở mạch (door-to-balloon <90 phút) quyết định trực tiếp tổn thương tim vĩnh viễn và tử vong.',
    detail: 'Đau ngực do tim thường được mô tả là "bóp nghẹt", "đè nặng", "như có người ngồi lên ngực" — không nhất thiết phải "đau nhói". 25–30% NMCT không điển hình (đặc biệt ở nữ giới, người đái tháo đường): chỉ mệt mỏi, buồn nôn, khó thở, đau hàm hoặc cổ. Không chờ xem thêm — gọi 115 ngay.',
    details: [
      'Nhận biết NMCT (nhồi máu cơ tim): đau ngực bóp nghẹt kéo dài >20 phút, lan lên vai trái, cánh tay trái (hoặc cả hai), hàm dưới, lưng giữa. Kèm vã mồ hôi lạnh, buồn nôn, nôn, chóng mặt, cảm giác sắp chết. Không giảm khi nghỉ ngơi hoặc ngậm nitroglycerin. Phụ nữ thường không điển hình: chỉ mệt mỏi cực độ, buồn nôn, khó thở.',
      'Nhận biết suy tim cấp: khó thở đột ngột nặng — đặc biệt khi nằm (phải ngồi thẳng để thở), thở khò khè bọt hồng, phù chân tăng nhanh, bụng to nhanh, tĩnh mạch cổ nổi. Nguyên nhân thường là NMCT cấp, rối loạn nhịp nặng, hoặc mất bù suy tim mãn.',
      'Rối loạn nhịp nguy hiểm: hồi hộp đánh trống ngực kèm choáng váng, ngất, hoặc đau ngực = rối loạn nhịp có thể đe dọa tính mạng (VT, VF, AF có đáp ứng thất nhanh, block nhĩ thất độ 3). Ngất đột ngột không báo trước ở người có bệnh tim = nghi rối loạn nhịp cho đến khi chứng minh ngược lại.',
      'Hành động đúng khi nghi NMCT: (1) Gọi 115 ngay — không tự lái xe. (2) Nhai (không nuốt nguyên) Aspirin 300mg nếu không dị ứng và đang có. (3) Nằm yên, thư giãn, không hoạt động gắng sức. (4) Mở cửa cho xe cấp cứu. (5) Nếu ngừng tim + mất ý thức: CPR 30 ép ngực : 2 hô hấp nhân tạo, liên tục đến khi có cấp cứu.',
      'Cơn đau thắt ngực ổn định vs không ổn định: đau thắt ngực ổn định = xảy ra khi gắng sức, hết sau 5–10 phút nghỉ hoặc nitroglycerin — CẦN KHÁM nhưng không phải cấp cứu ngay. Đau thắt ngực không ổn định = mới xuất hiện, tần suất tăng, xảy ra khi nghỉ ngơi, không đáp ứng nitroglycerin → ĐI CẤP CỨU NGAY (có thể là NMCT đang hình thành).',
      'Hypertensive crisis (tăng HA cấp cứu): HA >180/>120 kèm đau ngực, khó thở, lú lẫn, nhìn mờ, yếu liệt một bên, co giật → cấp cứu ngay (end-organ damage). HA >180/>120 đơn thuần không triệu chứng = hypertensive urgency — cần điều trị trong vài giờ nhưng không nguy cấp bằng.',
    ],
    points: [
      { icon: '⏱️', label: 'Mỗi phút = 2 triệu tế bào tim chết', note: 'Time is muscle — gọi 115, không chờ, không tự lái xe đến viện' },
      { icon: '💊', label: 'Nhai Aspirin 300mg ngay nếu có', note: 'Giảm cục máu đông — làm trong khi chờ xe cấp cứu' },
      { icon: '⚠️', label: 'Nữ/ĐTĐ: triệu chứng không điển hình', note: 'Mệt cực độ, buồn nôn, khó thở — không nhất thiết đau ngực' },
      { icon: '🫀', label: 'Đau khi nghỉ + không đáp ứng NTG', note: 'Đây là unstable angina/NMCT đang hình thành — cấp cứu ngay' },
    ],
  },
  {
    icon: '🧠', cat: 'Thần Kinh (nghi đột quỵ)', color: '#dc2626', rgb: '220,38,38',
    signs: ['Méo miệng đột ngột', 'Yếu liệt tay chân một bên', 'Nói khó, nói đớ bất ngờ', 'Đau đầu dữ dội đột ngột', 'Co giật, lú lẫn cấp'],
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đột quỵ là nguyên nhân tử vong đứng thứ 2 và gây tàn tật đứng thứ 1 toàn cầu. Mỗi phút đột quỵ không được điều trị: 1.9 triệu tế bào não chết, 14 tỷ synapse mất đi. Cửa sổ điều trị tiêu sợi huyết (tPA): 4.5 giờ từ khi triệu chứng xuất hiện. Cứu 1 phút = cứu 1.9 triệu tế bào não. Dùng FAST để nhận biết nhanh.',
    detail: 'FAST (Face-Arm-Speech-Time): Méo miệng (F) + Yếu tay một bên (A) + Nói đớ/không hiểu (S) → Gọi 115 ngay (T). Thêm BE-FAST: Balance (mất thăng bằng đột ngột) + Eyes (nhìn mờ/đôi một bên). Đột quỵ xuất huyết (vỡ mạch máu) thường khởi phát với đau đầu dữ dội đột ngột "như sét đánh" — cần phân biệt để điều trị khác nhau.',
    details: [
      'Nhận diện bằng BE-FAST: Balance (mất thăng bằng, đi loạng choạng đột ngột), Eyes (nhìn mờ hoặc mất thị lực một bên/mù nửa thị trường đột ngột), Face (méo miệng khi cười — bảo bệnh nhân mỉm cười, một bên không lên), Arm (yếu một tay — bảo giơ 2 tay ngang, một tay rơi xuống), Speech (nói không rõ, ú ớ, không hiểu câu hỏi đơn giản), Time (gọi 115 ngay).',
      'TIA (Transient Ischemic Attack) — cảnh báo không được bỏ qua: triệu chứng đột quỵ thoáng qua tự hết trong <1h (thường <5–15 phút). 15% đột quỵ hoàn toàn xảy ra trong 48h sau TIA. Đây KHÔNG phải dấu hiệu "ổn rồi" — cần đi khám cấp cứu ngay khi TIA xảy ra, ngay cả khi đã hết triệu chứng.',
      'Đột quỵ xuất huyết não vs nhồi máu: xuất huyết (20%): đau đầu đột ngột dữ dội nhất trong đời ("thunderclap headache"), buồn nôn, nôn, mất ý thức. Nhồi máu (80%): triệu chứng thần kinh khu trú (một bên người, mặt, lời nói) thường không đau đầu nhiều. Cả hai cần cấp cứu ngay — không tự phân biệt để trì hoãn điều trị.',
      'Cửa sổ thời gian điều trị: tPA (tiêu sợi huyết): 0–4.5h từ khi triệu chứng. Thrombectomy cơ học (lấy huyết khối): 0–24h trong một số trường hợp chọn lọc. Điều trị trong 1h đầu ("golden hour"): phục hồi gần như hoàn toàn ở 30–50% bệnh nhân. Trì hoãn mỗi 30 phút = giảm 10% khả năng phục hồi tốt.',
      'Yếu tố nguy cơ đột quỵ có thể kiểm soát: tăng huyết áp (nguy cơ #1, chiếm 50% đột quỵ), rung nhĩ (tăng nguy cơ 5×), đái tháo đường, hút thuốc, mỡ máu cao, béo phì. Kiểm soát tốt huyết áp đơn lẻ giảm 40% nguy cơ đột quỵ. Aspirin 81mg/ngày không khuyến cáo dự phòng tiên phát (người chưa từng đột quỵ) nếu không có chỉ định khác.',
      'Phục hồi sau đột quỵ: bắt đầu vật lý trị liệu trong 24–48h đầu (nếu ổn định) — neuroplasticity cao nhất trong 3–6 tháng đầu. 30% phục hồi gần hoàn toàn, 30% còn khuyết tật nhẹ, 30% khuyết tật nặng. Yếu tố quyết định: thời gian điều trị + cường độ phục hồi chức năng sớm.',
    ],
    points: [
      { icon: '🅱️', label: 'BE-FAST: 6 dấu hiệu cần nhớ', note: 'Balance · Eyes · Face · Arm · Speech · Time (gọi 115)' },
      { icon: '⏰', label: 'Cửa sổ 4.5h cho tPA', note: 'Mỗi phút = 1.9 triệu tế bào não — không chờ, không "xem thêm"' },
      { icon: '🚨', label: 'TIA tự hết vẫn phải đi cấp cứu', note: '15% đột quỵ hoàn toàn xảy ra trong 48h sau TIA' },
      { icon: '❤️', label: 'Kiểm soát HA = giảm 40% đột quỵ', note: 'Tăng HA là nguy cơ #1 — theo dõi và điều trị là dự phòng tốt nhất' },
    ],
  },
  {
    icon: '🩸', cat: 'Tiêu Hóa & Chuyển Hóa', color: '#f59e0b', rgb: '245,158,11',
    signs: ['Đau bụng dữ dội', 'Nôn ra máu, đi cầu phân đen', 'Đường huyết rất cao kèm lơ mơ, thở sâu nhanh', 'Đường huyết thấp kèm vã mồ hôi, run, lơ mơ'],
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cấp cứu tiêu hóa và chuyển hóa đa dạng và dễ bị bỏ qua vì triệu chứng đôi khi mơ hồ. Xuất huyết tiêu hóa trên (nôn máu/phân đen) mất máu nhanh, tỷ lệ tử vong 10% nếu không xử trí kịp. Hạ đường huyết nặng (<50 mg/dL) gây tổn thương não không hồi phục trong 5–10 phút nếu không điều chỉnh. Nhiễm toan ceton (DKA) là biến chứng đái tháo đường đe dọa tính mạng với tỷ lệ tử vong 1–5%.',
    detail: 'Phân biệt đau bụng cấp cứu và đau bụng thông thường: cấp cứu khi đau dữ dội đột ngột, bụng cứng như gỗ (viêm phúc mạc), kèm sốt cao + rùng mình, đau không giảm sau 30–60 phút hoặc tăng dần. Đau bụng kèm sốc (huyết áp thấp, mạch nhanh, da lạnh ẩm) = cấp cứu tuyệt đối.',
    details: [
      'Xuất huyết tiêu hóa trên — nhận biết nhanh: nôn ra máu đỏ tươi (chảy máu đang hoạt động, nặng) hoặc màu bã cà phê (máu tiêu một phần). Phân đen như hắc ín, mùi tanh đặc trưng (melena) = máu tiêu qua ruột, nguồn gốc thực quản/dạ dày/tá tràng. 150–200mL máu đủ gây phân đen. Nguyên nhân: loét dạ dày, vỡ giãn tĩnh mạch thực quản (xơ gan), Mallory-Weiss.',
      'Hạ đường huyết cấp (<70 mg/dL có triệu chứng): run tay, vã mồ hôi, đói cồn cào, tim đập nhanh, lo âu — đây là giai đoạn sớm, còn tỉnh táo và có thể tự xử trí: ăn 15–20g đường nhanh (4 viên glucose, 150ml nước ép trái cây, 1 muỗng mật ong), kiểm tra lại sau 15 phút. Nặng hơn: lú lẫn, co giật, mất ý thức → tiêm glucagon (nếu có) và gọi 115 ngay.',
      'DKA (Nhiễm toan ceton đái tháo đường): đường huyết >300 mg/dL + buồn nôn/nôn/đau bụng + hơi thở mùi táo/aceton + thở sâu và nhanh (Kussmaul) + lơ mơ. Thường ở ĐTĐ type 1 hoặc type 2 khi stress, nhiễm trùng, bỏ thuốc. Cần IV fluid và insulin khẩn cấp tại bệnh viện — không tự xử trí tại nhà.',
      'Viêm ruột thừa — nhận biết: đau thường bắt đầu quanh rốn sau đó di chuyển về hố chậu phải, tăng khi di chuyển, sốt nhẹ. Nếu vỡ ruột thừa: đau lan toàn bụng, bụng cứng, sốt cao — cấp cứu khẩn cấp. Biểu hiện không điển hình ở trẻ em, người già, phụ nữ có thai: đau có thể ở vị trí khác.',
      'Tắc ruột: đau bụng co cơn từng đợt, bụng chướng, buồn nôn/nôn nhiều, không trung tiện/đại tiện. Tắc ruột hoàn toàn là cấp cứu — ruột có thể thiếu máu và hoại tử trong vài giờ. Tắc ruột do dính (sau phẫu thuật bụng trước đây) phổ biến nhất ở người lớn.',
      'Khi nào đau bụng cần đi cấp cứu ngay: đau đột ngột dữ dội (đặc biệt đau "xé toạc" vùng lưng/bụng → nghi phình/vỡ động mạch chủ bụng), bụng cứng khi chạm, kèm sốc (mạch nhanh, HA thấp, da lạnh), kèm nôn ra máu hoặc phân đen, đau không giảm sau 1–2h hoặc tăng dần, kèm sốt >38.5°C và lạnh run.',
    ],
    points: [
      { icon: '🩸', label: 'Phân đen như hắc ín = xuất huyết tiêu hóa', note: '150mL máu đủ gây phân đen — nguồn gốc trên tá tràng' },
      { icon: '🍬', label: 'Hạ ĐH nhẹ: 15–20g đường nhanh', note: 'Run + vã mồ hôi còn tỉnh táo → tự xử trí được, kiểm lại 15 phút' },
      { icon: '💨', label: 'Hơi thở mùi táo + thở nhanh sâu = DKA', note: 'Nhiễm toan ceton — gọi 115, không tự điều chỉnh insulin tại nhà' },
      { icon: '🚑', label: 'Bụng cứng + sốc = cấp cứu tuyệt đối', note: 'Viêm phúc mạc, vỡ tạng — phẫu thuật khẩn cấp, không trì hoãn' },
    ],
  },
  {
    icon: '🦴', cat: 'Cơ Xương Khớp', color: '#8b5cf6', rgb: '139,92,246',
    signs: ['Đau sau chấn thương kèm biến dạng chi', 'Đau lưng kèm yếu chân, bí tiểu, tê vùng yên ngựa', 'Không chịu lực được sau chấn thương'],
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cấp cứu cơ xương khớp ít gây tử vong nhưng có thể gây tàn tật vĩnh viễn nếu xử trí chậm. Hội chứng cauda equina (chèn ép đuôi ngựa tủy sống) với yếu chân + bí tiểu/tiểu không kiểm soát + tê vùng đáy chậu là cấp cứu phẫu thuật — trì hoãn >6–12h có thể gây mất kiểm soát bàng quang/ruột vĩnh viễn. Gãy cột sống cổ sau chấn thương không được bất động đúng = có thể gây liệt tứ chi vĩnh viễn.',
    detail: 'Đau sau chấn thương kèm biến dạng chi hầu như luôn là gãy xương cho đến khi có X-quang chứng minh ngược lại. Không cố nắn thẳng, không để bệnh nhân đứng/đi bộ. Bất động bằng nẹp tạm thời ở tư thế hiện tại và vận chuyển an toàn. Chú ý: gãy xương có thể mất máu đáng kể (gãy đùi: 1–2L, gãy xương chậu: 3–5L).',
    details: [
      'Nhận biết gãy xương: đau dữ dội tại vị trí chấn thương, sưng nề nhanh, biến dạng rõ ràng (xương lồi, chi ngắn/lệch), không thể chịu lực, cảm giác lắc rắc khi chấn thương. Gãy hở (đầu xương xuyên qua da) = cấp cứu do nguy cơ nhiễm khuẩn nặng, cần kháng sinh và xử trí trong 6–8h.',
      'Hội chứng Cauda Equina — cấp cứu phẫu thuật: thoát vị đĩa đệm thắt lưng khổng lồ chèn ép đuôi ngựa gây: đau lưng thấp + yếu hai chân + tê vùng yên ngựa (đáy chậu, bộ phận sinh dục, mặt trong đùi) + rối loạn cơ vòng (bí tiểu/tiểu không kiểm soát, táo bón nặng hoặc đại tiện không tự chủ). Phẫu thuật giải ép trong 24–48h = tiên lượng tốt; trễ hơn = tổn thương thần kinh vĩnh viễn.',
      'Gãy cột sống cổ sau chấn thương: chấn thương đầu/cổ mạnh (tai nạn giao thông, ngã ngựa, bơi lội đập đầu) với đau cổ = phải coi là gãy cột sống cổ đến khi chụp CT loại trừ. Không di chuyển đầu/cổ tự do. Cần nẹp cổ cứng và vận chuyển thẳng trên cáng. Di chuyển sai = gây liệt tứ chi vĩnh viễn do tổn thương tủy sống.',
      'Hội chứng khoang (Compartment Syndrome): sau gãy xương/chèn ép/bỏng — áp lực trong khoang筋 (fascial compartment) tăng cao, thiếu máu nuôi → đau dữ dội không giải thích được, đau tăng khi duỗi thụ động cơ, căng cứng khoang, tê bì đầu chi. Cửa sổ điều trị 6h — trễ hơn gây hoại tử cơ không hồi phục (rhabdomyolysis).',
      'Sai khớp — không cố nắn tại hiện trường: sai khớp vai (thường nhất), háng, đầu gối, khuỷu tay. Đau dữ dội, chi ở tư thế bất thường, không cử động được. Không cố nắn tại nhà vì có thể kèm gãy xương (nắn gây thêm tổn thương) hoặc tổn thương mạch máu/thần kinh. Kiểm tra mạch, cảm giác và vận động đầu chi. Đến ER để X-quang trước khi nắn.',
      'Đau lưng khi nào cần đi cấp cứu: đau lưng thông thường (<6 tuần, không yếu chi, không rối loạn cơ vòng) không phải cấp cứu. ĐI CẤP CỨU NGAY khi đau lưng kèm: yếu hai chân tiến triển nhanh, bí tiểu hoặc tiểu không tự chủ, tê vùng đáy chậu (cauda equina), sốt cao + rùng mình (nghi viêm đốt sống nhiễm khuẩn), tiền sử ung thư (nghi di căn cột sống), chấn thương mạnh.',
    ],
    points: [
      { icon: '🦿', label: 'Biến dạng chi sau chấn thương = gãy xương', note: 'Bất động tại chỗ, không nắn thẳng, không để đứng — đến ER' },
      { icon: '🚨', label: 'Tê đáy chậu + bí tiểu = cauda equina', note: 'Phẫu thuật trong 24–48h — trễ hơn = mất kiểm soát bàng quang vĩnh viễn' },
      { icon: '🏊', label: 'Đau cổ sau chấn thương đầu = nẹp cổ', note: 'Gãy cột sống cổ đến khi CT loại trừ — di chuyển sai = liệt tứ chi' },
      { icon: '⏰', label: 'Hội chứng khoang: cửa sổ 6h', note: 'Đau dữ dội + khoang cứng sau gãy xương — trễ hơn 6h = hoại tử cơ' },
    ],
  },
];

const SOON_ITEMS = [
  {
    metric: 'Sụt cân không rõ nguyên nhân', freq: 'Khám trong 1–2 tuần', tip: 'Cân hàng tuần để theo dõi xu hướng',
    icon: '⚖️', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sụt >5% trọng lượng cơ thể trong 6–12 tháng không chủ ý là ngưỡng y khoa cần điều tra — ung thư, tiểu đường, cường giáp thường biểu hiện qua sụt cân trước khi có triệu chứng rõ ràng khác.',
    detail: 'Sụt cân không chủ ý khác hoàn toàn với sụt cân có chủ đích. Khi cơ thể mất cân mà không thay đổi chế độ ăn hay tập luyện, đó là tín hiệu cơ thể đang tiêu thụ năng lượng bất thường hoặc không hấp thu đủ dinh dưỡng — cần tìm nguyên nhân.',
    details: [
      'Ngưỡng y khoa: mất >5% cân nặng (ví dụ 3.5 kg với người 70 kg) trong 6–12 tháng mà không chủ ý = "clinically significant weight loss" cần điều tra bất kể cảm giác chủ quan.',
      'Ung thư cần loại trừ đầu tiên: ung thư tụy, dạ dày, đại tràng, phổi gây sụt cân sớm qua tăng chuyển hóa và kém hấp thu — trước khi có đau hoặc triệu chứng cụ thể.',
      'Cường giáp (hyperthyroidism): hormone tuyến giáp tăng → tăng tốc chuyển hóa toàn thân → đốt calo nhanh hơn. Kèm: tim đập nhanh, run tay, ra nhiều mồ hôi. TSH thấp là xét nghiệm tầm soát.',
      'Tiểu đường type 1 mới khởi phát: tế bào không nhận glucose → cơ thể đốt cơ và mỡ dự trữ → sụt cân nhanh kèm tiểu nhiều, khát nhiều. Có thể xảy ra ở mọi lứa tuổi.',
      'Bệnh viêm ruột (Crohn/viêm đại tràng): viêm mạn tính → kém hấp thu + tăng chuyển hóa + ăn ít do đau bụng. Xét nghiệm: CRP, calprotectin phân, nội soi.',
      'Ghi lại cân nặng và thời gian để bác sĩ đánh giá tốc độ: sụt 3 kg trong 3 tháng khác với sụt 5 kg trong 3 tuần — kèm bất kỳ triệu chứng nào khác thì ưu tiên khám sớm hơn.',
    ],
    points: [
      { icon: '📉', label: '>5% / 6 tháng = ngưỡng khám', note: 'VD: 70 kg → sụt 3.5 kg không chủ ý trong 6 tháng' },
      { icon: '🔬', label: 'Xét nghiệm cơ bản', note: 'CBC, đường huyết, TSH, chức năng gan/thận, CEA' },
      { icon: '📋', label: 'Cân hàng tuần, ghi sổ', note: 'Dữ liệu xu hướng giúp bác sĩ đánh giá tốc độ sụt cân' },
      { icon: '⏱️', label: 'Khám trong 1–2 tuần', note: 'Không trì hoãn nếu sụt cân kèm đau bụng, mệt, sốt' },
    ],
  },
  {
    metric: 'Mệt kéo dài >2–4 tuần', freq: 'Khám sau 2–4 tuần không cải thiện', tip: 'Mệt không hết dù đã ngủ đủ giấc',
    icon: '😴', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mệt mỏi mạn tính là triệu chứng gặp trong >200 tình trạng y tế. Điểm phân biệt quan trọng: mệt sinh lý thông thường hết sau nghỉ ngơi. Mệt bệnh lý không hết sau ngủ đủ giấc và ảnh hưởng chức năng hàng ngày.',
    detail: 'Không phải mọi mệt mỏi đều cần đi khám. Nhưng khi mệt kéo dài >2–4 tuần, không cải thiện sau nghỉ ngơi đủ giấc, ảnh hưởng công việc/sinh hoạt — đây là triệu chứng cần điều tra nguyên nhân, không chỉ uống vitamin.',
    details: [
      'Thiếu máu thiếu sắt: nguyên nhân phổ biến nhất ở phụ nữ tuổi sinh sản và người ăn chay/thuần chay. Ferritin có thể thấp trước khi hemoglobin giảm — cần xét nghiệm cả hai.',
      'Suy giáp (hypothyroidism): hormone tuyến giáp giảm → làm chậm mọi chuyển hóa. Mệt + tăng cân + lạnh tay chân + táo bón + da khô. TSH cao = suy giáp. Phổ biến ở phụ nữ >40 tuổi.',
      'Hội chứng mệt mãn tính (ME/CFS): mệt tồi tệ hơn sau gắng sức thể chất/tinh thần (post-exertional malaise), không hết sau nghỉ. Chẩn đoán loại trừ — ảnh hưởng ~0.2–0.4% dân số.',
      'Tiểu đường type 2: kháng insulin → glucose không vào tế bào hiệu quả → tế bào thiếu năng lượng dù đường huyết cao. Mệt sau ăn kèm khát nước, tiểu nhiều là tam chứng điển hình.',
      'Trầm cảm và lo âu mạn tính: kiệt sức thể chất do não thiếu dopamine/serotonin. Thường kèm mất hứng thú, rối loạn giấc ngủ, thay đổi cảm giác ăn ngon, khó tập trung.',
      'Nguyên nhân khác: ngưng thở khi ngủ (sleep apnea), suy thận mạn, lupus, thiếu vitamin D và B12 đặc biệt ở người ít nắng và người ăn thuần chay.',
    ],
    points: [
      { icon: '🩸', label: 'Xét nghiệm tầm soát', note: 'CBC, ferritin, TSH, đường huyết HbA1c, vitamin D, B12' },
      { icon: '⏳', label: '2–4 tuần là ngưỡng đi khám', note: 'Mệt không hết sau nghỉ đủ giấc + ảnh hưởng sinh hoạt' },
      { icon: '🧠', label: 'Đánh giá cả tâm lý', note: 'Trầm cảm và lo âu là nguyên nhân thường bị bỏ qua' },
      { icon: '📊', label: 'Ghi nhật ký năng lượng', note: 'Thang 1–10 mỗi ngày — giúp bác sĩ thấy pattern' },
    ],
  },
  {
    metric: 'Ho kéo dài', freq: 'Khám sau 3–8 tuần ho không dứt', tip: 'Ho >3 tuần không do cảm cúm thông thường',
    icon: '🫁', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ho mạn tính (>8 tuần) có 3 nguyên nhân phổ biến chiếm >90%: nhỏ giọt sau mũi, hen suyễn và GERD. Nhưng ho kéo dài cũng là triệu chứng sớm của ung thư phổi và lao — cần X-quang ngực để loại trừ.',
    detail: 'Ho cấp (<3 tuần) thường do cảm cúm và tự khỏi. Ho kéo dài >3–8 tuần cần tìm nguyên nhân cụ thể và điều trị đúng nguyên nhân — uống thuốc ho chỉ che triệu chứng, không chữa bệnh.',
    details: [
      'Nhỏ giọt sau mũi (postnasal drip): dịch nhầy từ xoang chảy xuống họng kích thích phản xạ ho. Thường nặng hơn buổi sáng và khi nằm. Điều trị: antihistamine/xịt mũi corticoid.',
      'Hen suyễn (asthma): ho đặc biệt về đêm và sáng sớm, khi tiếp xúc không khí lạnh. Cough-variant asthma có thể không có tiếng rít. Đo peak flow hoặc spirometry để chẩn đoán.',
      'GERD (trào ngược dạ dày-thực quản): acid trào ngược kích thích thanh quản → ho mạn. Đặc biệt sau ăn, khi nằm. Silent GERD thường không kèm ợ chua. Thử PPI 4–8 tuần xem ho có cải thiện.',
      'Ung thư phổi: ho mạn tính kèm đờm có máu, khàn tiếng, đau ngực, sụt cân — cần chụp CT ngực ngay. Ung thư phổi thường không có triệu chứng giai đoạn sớm — ho kéo dài là cơ hội phát hiện sớm.',
      'Lao phổi: ho kéo dài >2–3 tuần ở người có nguy cơ kèm sốt về chiều, đổ mồ hôi đêm, sụt cân — cần xét nghiệm AFB đờm và Mantoux/IGRA.',
      'Thuốc ức chế men chuyển (ACE inhibitors như enalapril, captopril): gây ho khan ở 10–15% người dùng. Nếu mới dùng thuốc huyết áp và xuất hiện ho → báo bác sĩ đổi sang ARB.',
    ],
    points: [
      { icon: '🏥', label: 'Ba nguyên nhân >90%', note: 'Postnasal drip, hen suyễn, GERD — điều trị được' },
      { icon: '🚨', label: 'Ho + đờm máu = khám ngay', note: 'Không đợi — loại trừ ung thư phổi và lao' },
      { icon: '💊', label: 'Không tự uống thuốc ho', note: 'Chỉ che triệu chứng — cần tìm và điều trị nguyên nhân' },
      { icon: '📷', label: 'X-quang / CT ngực', note: 'Bước đầu tiên trong tầm soát nguyên nhân ho mạn' },
    ],
  },
  {
    metric: 'Đau ngực khi gắng sức', freq: 'Khám tim mạch khẩn — trong vài ngày', tip: 'Đau khi leo cầu thang, đi bộ nhanh, mang nặng',
    icon: '💔', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đau ngực khi gắng sức (angina pectoris) là dấu hiệu mạch vành hẹp không cấp máu đủ cho cơ tim khi hoạt động. Đây là cảnh báo trước nhồi máu cơ tim — không đợi "xem có hết không".',
    detail: 'Cơ tim cần oxy liên tục. Khi mạch vành hẹp >50–70%, cơ tim đủ oxy lúc nghỉ nhưng thiếu oxy khi tim cần bơm mạnh hơn. Kết quả là đau/tức ngực — tín hiệu cơ tim đang thiếu máu cục bộ.',
    details: [
      'Đặc điểm điển hình: cảm giác tức nặng/đè ép/thắt ở giữa ngực, lan lên vai trái, cánh tay trái, cổ hoặc hàm. Xuất hiện khi gắng sức và biến mất sau nghỉ ngơi 1–5 phút — điểm phân biệt với đau cơ xương.',
      'Cơ chế: mảng xơ vữa thu hẹp lòng mạch vành → lưu lượng máu giảm → cơ tim thiếu oxy khi cần hoạt động mạnh → giải phóng adenosine gây đau. Mảng xơ vữa không ổn định có thể vỡ bất cứ lúc nào.',
      'Phân biệt với nguyên nhân khác: đau cơ xương (đau khi ấn vào ngực, thay đổi theo tư thế); GERD (đau rát sau xương ức, sau ăn); panic attack (kèm tim đập nhanh, ECG bình thường). Đau ngực điển hình khi gắng sức = nghi mạch vành cho đến khi chứng minh ngược lại.',
      'Yếu tố nguy cơ: nam >45 tuổi / nữ >55 tuổi, hút thuốc, tăng huyết áp, tiểu đường, rối loạn mỡ máu, béo bụng, tiền sử gia đình bị bệnh tim sớm (<55 tuổi nam, <65 tuổi nữ).',
      'Chẩn đoán: ECG lúc nghỉ (có thể bình thường), nghiệm pháp gắng sức (stress test — ECG trong khi đi thảm lăn), siêu âm tim gắng sức, CT mạch vành, hoặc chụp mạch vành xâm lấn.',
      'Nguy hiểm nếu trì hoãn: mảng xơ vữa không ổn định có thể vỡ → huyết khối bịt mạch → nhồi máu cơ tim cấp. Điều trị (statin, aspirin, stent) giảm đáng kể nguy cơ biến cố.',
    ],
    points: [
      { icon: '🚨', label: 'Khám tim mạch trong vài ngày', note: 'Không trì hoãn — nguy cơ nhồi máu cơ tim' },
      { icon: '❤️', label: 'Dấu hiệu mạch vành hẹp', note: 'Cảnh báo trước nhồi máu cơ tim — cần can thiệp sớm' },
      { icon: '🧪', label: 'Cần stress test', note: 'ECG nghỉ thường bình thường — cần ECG gắng sức' },
      { icon: '🚫', label: 'Tránh gắng sức cho đến khi khám', note: 'Không tự tập luyện mạnh khi chưa được tư vấn' },
    ],
  },
  {
    metric: 'Phù chân kéo dài', freq: 'Khám trong 1 tuần', tip: 'Phù cả hai chân, nặng hơn cuối ngày',
    icon: '🦵', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phù hai chân kéo dài thường phản ánh vấn đề hệ thống: suy tim, suy thận hoặc hạ albumin máu. Phù một bên cần loại trừ ngay huyết khối tĩnh mạch sâu (DVT) — có thể gây thuyên tắc phổi nguy hiểm tính mạng.',
    detail: 'Phù xảy ra khi dịch từ lòng mạch thoát ra khoang gian bào — do áp lực thủy tĩnh tăng (suy tim, suy tĩnh mạch) hoặc áp lực keo giảm (albumin thấp). Phù nhẹ cuối ngày sau đứng nhiều là bình thường; phù không hết qua đêm cần điều tra.',
    details: [
      'Phù cả hai bên — nguyên nhân hệ thống: suy tim (tim không bơm đủ → áp lực tĩnh mạch tăng), suy thận (giữ nước và muối), hạ albumin (xơ gan, suy dinh dưỡng nặng, hội chứng thận hư), suy giáp. Cần xét nghiệm: albumin, BNP, creatinine, TSH.',
      'Phù một bên — loại trừ DVT ngay: huyết khối tĩnh mạch sâu gây phù đột ngột một chân, đỏ, ấm, đau. Cục máu đông có thể di chuyển lên phổi → thuyên tắc phổi → tử vong. Cần siêu âm Doppler tĩnh mạch ngay.',
      'Suy tĩnh mạch mạn tính: phù mềm, trắng, không đau, tăng dần cuối ngày, giảm khi nằm nghỉ nâng cao chân. Thường kèm giãn tĩnh mạch, da đổi màu nâu ở mắt cá chân. Phổ biến ở người đứng nhiều, béo phì.',
      'Phù do thuốc: amlodipine và nifedipine (thuốc huyết áp), NSAID, corticoid, thuốc tiểu đường thiazolidinediones gây phù là tác dụng phụ. Nếu phù xuất hiện sau dùng thuốc mới → báo bác sĩ.',
      'Phù thận: nước tiểu bọt (protein), giảm lượng nước tiểu, tăng huyết áp kèm phù mặt buổi sáng là đặc trưng bệnh thận hơn bệnh tim.',
      'Test đơn giản: phù sinh lý hết sau ngủ 1 đêm nằm nâng cao chân. Phù không hết sau nghỉ ngơi đúng cách = bệnh lý cần điều tra.',
    ],
    points: [
      { icon: '🩺', label: 'Phù 1 bên = khám ngay', note: 'Loại trừ DVT — nguy hiểm tính mạng nếu không điều trị' },
      { icon: '🧪', label: 'Xét nghiệm cần', note: 'Albumin, BNP, creatinine, siêu âm tim và tĩnh mạch' },
      { icon: '🛏️', label: 'Test nâng cao chân qua đêm', note: 'Phù không giảm sau ngủ nằm = cần đi khám ngay' },
      { icon: '💊', label: 'Kiểm tra thuốc đang dùng', note: 'Amlodipine, NSAID, corticoid thường gây phù chân' },
    ],
  },
  {
    metric: 'Tiểu nhiều, khát nhiều', freq: 'Khám trong 1 tuần', tip: 'Tiểu >8 lần/ngày kèm khát bất thường',
    icon: '💧', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tam chứng "tiểu nhiều – khát nhiều – ăn nhiều nhưng sụt cân" là biểu hiện kinh điển của tiểu đường. Glucose cao kéo nước ra qua nước tiểu → mất nước → khát → uống nhiều → tiểu nhiều. Một xét nghiệm đường huyết đơn giản có thể xác nhận hoặc loại trừ.',
    detail: 'Tiểu nhiều (polyuria: >3 lít/ngày) và khát nhiều thường đi kèm nhau. Cần loại trừ tiểu đường — nhưng cũng cần nghĩ đến đái tháo nhạt, tăng canxi máu và tác dụng phụ thuốc lợi tiểu.',
    details: [
      'Tiểu đường type 2: kháng insulin → glucose tích lũy → khi vượt ngưỡng thận (~10 mmol/L) → glucose lọc vào nước tiểu → kéo nước theo thẩm thấu → tiểu nhiều → khát bù. Đường huyết đói ≥7.0 mmol/L là chẩn đoán tiểu đường.',
      'Tiểu đường type 1 — khởi phát cấp hơn: thiếu insulin tuyệt đối → tế bào "đói" dù máu đầy glucose → cơ thể đốt mỡ và cơ → sụt cân nhanh kèm nôn, hơi thở mùi trái cây (ketoacidosis). Nguy hiểm nếu không chẩn đoán kịp.',
      'Đái tháo nhạt (diabetes insipidus): ADH thiếu hoặc thận không đáp ứng → tiểu rất nhiều (10–20 lít/ngày), nước tiểu loãng như nước lã. Đường huyết bình thường, nước tiểu không có glucose — khác hoàn toàn với tiểu đường thông thường.',
      'Tăng canxi máu (hypercalcemia): canxi cao ức chế khả năng cô đặc nước tiểu → tiểu nhiều. Nguyên nhân: cường tuyến cận giáp, ung thư di căn xương, thừa vitamin D. Kèm yếu cơ, táo bón, buồn nôn.',
      'Đo lượng nước tiểu 24h để xác nhận: ghi lại lượng nước uống vào và lượng nước tiểu ra trong 24h. >3 lít nước tiểu/ngày = polyuria thực sự cần điều tra. Nếu chỉ tiểu đêm → có thể bàng quang hoạt động quá mức.',
      'Xét nghiệm tầm soát đơn giản: đường huyết đói, HbA1c, tổng phân tích nước tiểu (glucose và protein), canxi máu. Có kết quả trong 1 ngày tại phòng khám bất kỳ.',
    ],
    points: [
      { icon: '🩸', label: 'Xét nghiệm cơ bản', note: 'Đường huyết đói + HbA1c + nước tiểu — tại phòng khám bất kỳ' },
      { icon: '📏', label: 'Đo nước tiểu 24h', note: '>3 lít/ngày = polyuria thực sự cần điều tra nguyên nhân' },
      { icon: '⚡', label: 'Type 1 có thể cấp tính', note: 'Sụt cân nhanh + nôn + tiểu nhiều = cấp cứu, không chờ' },
      { icon: '📋', label: 'Ghi triệu chứng kèm theo', note: 'Sụt cân, mờ mắt, mệt — giúp bác sĩ phân biệt type 1 và 2' },
    ],
  },
  {
    metric: 'Rối loạn giấc ngủ nặng kéo dài', freq: 'Khám sau 4 tuần', tip: 'Mất ngủ hoặc ngủ quá nhiều ảnh hưởng sinh hoạt',
    icon: '🌙', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Rối loạn giấc ngủ mạn tính (>4 tuần) làm tăng nguy cơ tim mạch, béo phì, tiểu đường type 2, suy giảm miễn dịch và rút ngắn tuổi thọ. Nguyên nhân thường điều trị được nếu được chẩn đoán đúng.',
    detail: 'Mất ngủ mạn tính (khó ngủ hoặc không duy trì giấc ngủ ≥3 đêm/tuần trong >4 tuần) cần phân biệt với ngưng thở khi ngủ, hội chứng chân bứt rứt và rối loạn nhịp sinh học — các tình trạng có điều trị hiệu quả cao.',
    details: [
      'Mất ngủ mạn tính (chronic insomnia): khó ngủ, thức giữa đêm, dậy sớm không ngủ lại. CBT-I (liệu pháp nhận thức hành vi) hiệu quả hơn thuốc ngủ dài hạn và không gây phụ thuộc — điều trị đầu tay theo tất cả hướng dẫn quốc tế.',
      'Ngưng thở khi ngủ (sleep apnea — OSA): đường thở tắc từng cơn → oxy máu giảm → não thức dậy nhiều lần/đêm mà không biết → sáng dậy mệt, ngủ ngày, nhức đầu, ngáy to. Điều trị CPAP rất hiệu quả.',
      'Hội chứng chân bứt rứt (RLS): cảm giác khó chịu ở chân khi nằm yên → khó ngủ, nặng hơn buổi tối. Thường do thiếu sắt, suy thận, hoặc một số thuốc (antidepressant, antihistamine). Kiểm tra ferritin.',
      'Rối loạn nhịp sinh học: không thể ngủ trước 2–3 giờ sáng và rất khó dậy sáng (delayed sleep phase). Điều trị: ánh sáng mạnh buổi sáng (light therapy) + melatonin liều thấp vào buổi chiều.',
      'Rối loạn giấc ngủ và sức khỏe tâm thần: trầm cảm gây thức dậy sớm không ngủ lại được. Lo âu gây khó ngủ ban đầu và suy nghĩ lặp đi lặp lại. Rối loạn lưỡng cực có thể biểu hiện qua không ngủ nhiều ngày liên tục.',
      'Thuốc ngủ không phải giải pháp dài hạn: benzodiazepine và z-drugs (zolpidem) gây phụ thuộc, suy giảm nhận thức, tăng nguy cơ ngã ở người cao tuổi. Dùng tối đa 2–4 tuần trong khi chờ điều trị nguyên nhân.',
    ],
    points: [
      { icon: '🛌', label: 'CBT-I hiệu quả hơn thuốc ngủ', note: 'Không gây phụ thuộc — điều trị đầu tay theo WHO' },
      { icon: '😤', label: 'Ngáy to = nghi ngưng thở', note: 'Sleep apnea — cần đo giấc ngủ (polysomnography)' },
      { icon: '🦵', label: 'Chân bứt rứt khi nằm', note: 'RLS — kiểm tra ferritin, có thể bổ sung sắt điều trị' },
      { icon: '☀️', label: 'Ánh sáng mạnh buổi sáng', note: 'Reset đồng hồ sinh học — hiệu quả cho rối loạn pha' },
    ],
  },
  {
    metric: 'Vết thương lâu lành', freq: 'Khám trong 2–4 tuần nếu không lành', tip: 'Vết thương >2 tuần không cải thiện',
    icon: '🩹', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vết thương lành bình thường trong 1–2 tuần. Vết thương không lành sau >4 tuần dù chăm sóc đúng = "chronic wound" — nguyên nhân thường là tiểu đường, bệnh mạch máu ngoại biên, hoặc suy tĩnh mạch. Cần điều trị nguyên nhân gốc rễ, không chỉ chăm sóc vết thương.',
    detail: 'Lành vết thương bình thường qua 4 giai đoạn: cầm máu → viêm (1–5 ngày) → tái tạo mô (5–21 ngày) → tái cấu trúc. Bất kỳ bệnh lý nào cản trở tuần hoàn máu, miễn dịch hoặc chuyển hóa đều làm chậm quá trình này.',
    details: [
      'Tiểu đường — nguyên nhân hàng đầu: đường huyết cao làm tổn thương vi mạch → giảm cấp máu đến mô → thiếu oxy và chất dinh dưỡng → lành chậm. Đường cao cũng ức chế bạch cầu và làm chậm tổng hợp collagen. Bàn chân tiểu đường cần chăm sóc chuyên biệt.',
      'Bệnh động mạch ngoại biên (PAD): mảng xơ vữa hẹp động mạch chi dưới → thiếu máu mạn → vết thương ở bàn chân không lành, đau khi đi bộ, da lạnh và nhợt. Chỉ số ABI (ankle-brachial index) đơn giản để tầm soát.',
      'Suy tĩnh mạch mạn tính: áp lực tĩnh mạch cao → phù + thay đổi da → loét tĩnh mạch ở mắt cá trong. Lành rất chậm nếu không kiểm soát phù — phương pháp chính là băng nén (compression). Chiếm 70–80% loét chân mạn tính.',
      'Suy dinh dưỡng và thiếu vi chất: protein, vitamin C (đồng yếu tố tổng hợp collagen), kẽm (tổng hợp DNA và phân chia tế bào), vitamin A (tái tạo biểu bì) — thiếu bất kỳ thứ nào đều làm chậm lành. Người lớn tuổi và người ăn kém có nguy cơ cao.',
      'Nhiễm trùng vết thương: đỏ, sưng, nóng, chảy mủ, mùi hôi = dấu hiệu nhiễm trùng → cần kháng sinh theo kháng sinh đồ. Biofilm vi khuẩn trong vết thương mạn là thách thức điều trị lớn, không đáp ứng kháng sinh thông thường.',
      'Vết thương lâu lành và ung thư da: loét da không lành dai dẳng, đặc biệt ở vùng tiếp xúc ánh nắng, có thể là ung thư da (squamous/basal cell carcinoma). Ung thư da lành tính nếu phát hiện sớm — sinh thiết là tiêu chuẩn vàng.',
    ],
    points: [
      { icon: '🩸', label: 'Kiểm tra đường huyết', note: 'Tiểu đường không chẩn đoán là nguyên nhân số 1' },
      { icon: '🦿', label: 'Đánh giá tuần hoàn mạch', note: 'ABI test đơn giản loại trừ bệnh động mạch ngoại biên' },
      { icon: '🥩', label: 'Dinh dưỡng cho lành vết thương', note: 'Protein + vitamin C + kẽm — thiếu 1 trong 3 làm chậm lành' },
      { icon: '🔬', label: '>4 tuần không lành = sinh thiết', note: 'Loại trừ ung thư da — đặc biệt vết loét không rõ nguyên nhân' },
    ],
  },
];

function TabE3() {
  const { t: tCommon } = useTranslation('common');
  const { t: tP } = useTranslation('pillars');
  const pillarE = tP('pillarE', { returnObjects: true });
  const emergTr = Array.isArray(pillarE?.e_emergency) ? pillarE.e_emergency : [];
  const EMERG = EMERGENCY.map((s, i) => ({ ...s, ...(emergTr[i] || {}) }));
  const soonTr = Array.isArray(pillarE?.e_soon_items) ? pillarE.e_soon_items : [];
  const SOON = SOON_ITEMS.map((s, i) => ({ ...s, ...(soonTr[i] || {}) }));
  const [emergModal, setEmergModal] = useState(null);
  const [soonModal, setSoonModal] = useState(null);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-500/30 bg-red-500/08 p-3">
        <p className="text-lg font-bold text-red-400 mb-1">{pillarE?.e_tab3_h1 || '⚠️ Đi Cấp Cứu Ngay — Không Chờ'}</p>
        <p className="text-base text-muted">{pillarE?.e_tab3_note || 'Khi có các dấu hiệu dưới đây: kh��ng tự xử trí, gọi 115 hoặc đến cơ sở y tế gần nhất.'}</p>
      </div>
      <p className="text-xs text-muted opacity-60">{pillarE?.e_tab3_hint || 'Nhấp vào từng nhóm để xem chi tiết và cách xử trí'}</p>
      {EMERG.map((g, i) => (
        <div key={g.cat}
          className="rounded-2xl border border-border bg-surface/60 p-4 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => setEmergModal(i)}
          onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${g.rgb},0.45)`}
          onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{g.icon}</span>
              <span className="font-bold text-lg" style={{ color: g.color }}>{g.cat}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full border shrink-0"
              style={{ color: g.color, borderColor: `rgba(${g.rgb},0.35)`, background: `rgba(${g.rgb},0.08)` }}>{tCommon('modal.see_detail')}</span>
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
        <p className="text-base font-bold text-amber-400 mb-1">{pillarE?.e_tab3_h2 || 'Nên Đi Khám Sớm Khi Có:'}</p>
        <p className="text-xs text-muted opacity-60 mb-3">{pillarE?.e_tab3_hint2 || 'Nhấp vào từng mục để xem chi tiết và hướng xử trí'}</p>
        <div className="grid grid-cols-2 gap-2">
          {SOON.map((s, i) => (
            <div key={s.metric}
              className="flex items-center gap-2 text-base text-muted rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 hover:text-text"
              style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}
              onClick={() => setSoonModal(i)}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(${s.rgb},0.10)`; e.currentTarget.style.borderColor = `rgba(${s.rgb},0.35)`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.04)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.12)'; }}>
              <span className="text-lg shrink-0">{s.icon}</span>
              <span className="text-sm leading-snug">{s.metric}</span>
              <span className="ml-auto text-[9px] font-bold shrink-0" style={{ color: s.color }}>→</span>
            </div>
          ))}
        </div>
      </div>
      {emergModal !== null && (
        <ScheduleModal
          item={{ ...EMERG[emergModal], metric: EMERG[emergModal].cat, freq: tP('pillarE.e_emerg_freq', { defaultValue: 'Cấp cứu ngay' }), tip: tP('pillarE.e_emerg_tip', { defaultValue: 'Gọi 115 — không tự xử trí' }) }}
          idx={emergModal} total={EMERG.length}
          onClose={() => setEmergModal(null)}
          onPrev={() => setEmergModal(i => Math.max(0, i - 1))}
          onNext={() => setEmergModal(i => Math.min(EMERG.length - 1, i + 1))}
          hasPrev={emergModal > 0} hasNext={emergModal < EMERG.length - 1}
        />
      )}
      {soonModal !== null && (
        <ScheduleModal
          item={SOON[soonModal]}
          idx={soonModal} total={SOON.length}
          onClose={() => setSoonModal(null)}
          onPrev={() => setSoonModal(i => Math.max(0, i - 1))}
          onNext={() => setSoonModal(i => Math.min(SOON.length - 1, i + 1))}
          hasPrev={soonModal > 0} hasNext={soonModal < SOON.length - 1}
        />
      )}
    </div>
  );
}

const DISEASE_GROUPS = [
  {
    metric: 'Tim Mạch', freq: 'Phòng ngừa suốt đời', tip: '5 thay đổi lối sống giảm 80% nguy cơ tim mạch',
    icon: '❤️', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80&auto=format&fit=crop',
    items: ['Kiểm soát huyết áp <130/80', 'Giảm muối, tăng rau xanh', 'Vận động 150ph/tuần', 'Không hút thuốc lá', 'Kiểm soát mỡ máu LDL'],
    keyFact: 'Bệnh tim mạch là nguyên nhân tử vong số 1 toàn cầu — chiếm ~32% tổng số ca tử vong (WHO 2019). Tin tốt: 80% trường hợp có thể phòng ngừa bằng thay đổi lối sống. Kiểm soát 5 yếu tố — huyết áp, mỡ máu, đường huyết, cân nặng và hút thuốc — là cốt lõi phòng ngừa hiệu quả.',
    detail: 'Bệnh tim mạch phát triển trong im lặng hàng chục năm trước khi gây ra nhồi máu cơ tim hay đột quỵ. Mảng xơ vữa tích tụ từ tuổi 20–30 và các yếu tố nguy cơ hoàn toàn có thể kiểm soát được ngay hôm nay với thay đổi lối sống đúng hướng.',
    details: [
      'Huyết áp <130/80 mmHg: tăng huyết áp làm tổn thương thành mạch, tạo điều kiện cho xơ vữa tích tụ. Mỗi 10 mmHg giảm huyết áp tâm thu giảm 20–30% nguy cơ đột quỵ và 15% nguy cơ nhồi máu cơ tim. Đo tại nhà (buổi sáng, trước ăn sáng, nghỉ 5 phút) chính xác hơn phòng khám.',
      'Giảm muối <5g/ngày + tăng rau xanh: WHO khuyến nghị <5g muối/ngày (1 thìa cà phê). Rau xanh cung cấp kali (cân bằng natri), chất xơ hòa tan (giảm LDL) và folate (giảm homocysteine). Chế độ DASH giảm huyết áp hiệu quả tương đương thuốc nhẹ.',
      'Vận động 150 phút moderate/tuần: tim cần được "tập luyện" như bắp thịt. Đi bộ nhanh, bơi lội, đạp xe đều hiệu quả. Meta-analysis (Cochrane 2011): tập thể dục giảm tử vong tim mạch 26%, nhồi máu tái phát 25%.',
      'Không hút thuốc lá: thuốc lá gây co mạch, tăng đông máu, phá hủy nội mô mạch. Ngưng hút thuốc 1 năm → nguy cơ tim mạch giảm 50%; 15 năm → ngang người không bao giờ hút. Không có "số điếu an toàn" — ngay cả 1 điếu/ngày tăng 48% nguy cơ nhồi máu (BMJ 2018).',
      'Kiểm soát LDL <100 mg/dL: LDL tích tụ trong thành mạch tạo mảng xơ vữa. Nếu thay đổi lối sống chưa đủ, statin an toàn và hiệu quả — giảm LDL 30–50%, giảm biến cố tim mạch 25–35%. Người đã có bệnh tim: LDL mục tiêu <70 mg/dL.',
      'Ngủ đủ 7–9h + quản lý stress: cortisol mạn tính làm tăng huyết áp và tình trạng viêm toàn thân. Ngủ <6h tăng nguy cơ tim mạch 48% (meta-analysis SLEEP journal). Thiền và vận động là hai can thiệp stress hiệu quả nhất về tim mạch.',
    ],
    points: [
      { icon: '📊', label: 'Đo huyết áp tại nhà', note: 'Buổi sáng, trước ăn — chính xác hơn đo tại phòng khám' },
      { icon: '🚭', label: 'Ngưng thuốc lá ngay hôm nay', note: '1 năm ngưng → nguy cơ tim giảm 50% — không có liều an toàn' },
      { icon: '🏃', label: '150 phút moderate/tuần', note: 'Chia 5 ngày × 30 phút — đi bộ nhanh đủ hiệu quả' },
      { icon: '🧪', label: 'Mỡ máu 1–2 năm/lần', note: 'LDL <100 mg/dL — statin nếu lối sống chưa đạt mục tiêu' },
    ],
  },
  {
    metric: 'Chuyển Hóa', freq: 'Phòng ngừa tiểu đường & béo phì', tip: '5 thói quen kiểm soát đường huyết và cân nặng',
    icon: '🍬', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    items: ['Giảm đường tinh chế, nước ngọt', 'Tăng chất xơ (25–38g/ngày)', 'Giảm cân nếu thừa cân', 'Tập sức mạnh 2–3x/tuần', 'Ngủ đủ 7–9h'],
    keyFact: 'Hội chứng chuyển hóa (béo bụng + huyết áp cao + đường huyết cao + mỡ máu xấu) ảnh hưởng >25% người trưởng thành toàn cầu và tăng gấp 3 nguy cơ tim mạch, gấp 5 nguy cơ tiểu đường type 2. Tất cả thành phần đều cải thiện đáng kể bằng lối sống mà không cần thuốc trong giai đoạn sớm.',
    detail: 'Đề kháng insulin là gốc rễ của hội chứng chuyển hóa — tế bào không phản ứng hiệu quả với insulin → đường huyết tăng → tụy tiết insulin nhiều hơn → cuối cùng kiệt sức → tiểu đường type 2. Toàn bộ vòng này có thể đảo ngược ở giai đoạn tiền tiểu đường.',
    details: [
      'Giảm đường tinh chế và nước ngọt: đường thêm vào (added sugar) >10% tổng calo làm tăng triglyceride, gan nhiễm mỡ và đề kháng insulin. Mục tiêu <25g đường thêm vào/ngày (WHO). Đọc nhãn thực phẩm — đường ẩn trong sốt cà chua, bánh mì, sữa chua có hương vị.',
      'Chất xơ 25–38g/ngày: chất xơ hòa tan (đậu, yến mạch, táo, atiso) tạo gel làm chậm hấp thu đường và giảm LDL. Chất xơ không hòa tan (rau, ngũ cốc nguyên hạt) nuôi Bifidobacterium và Lactobacillus có lợi. Người Việt trung bình chỉ đạt 10–15g/ngày.',
      'Giảm 5–10% cân nặng nếu thừa cân: DPP study (Diabetes Prevention Program): giảm 5–7% cân nặng + 150 phút vận động/tuần giảm 58% nguy cơ tiến triển từ tiền tiểu đường sang tiểu đường — hiệu quả gấp đôi metformin (31%).',
      'Tập sức mạnh 2–3x/tuần: cơ bắp là "bể chứa glucose" lớn nhất cơ thể — cơ nhiều hơn = nhận glucose hiệu quả hơn kể cả không có insulin (GLUT4 translocation). Resistance training giảm HbA1c hiệu quả hơn aerobic đơn thuần trong kiểm soát đường huyết.',
      'Ngủ đủ 7–9h: thiếu ngủ làm tăng ghrelin (hormone đói) và giảm leptin (hormone no) → ăn nhiều hơn 300–500 kcal/ngày mà không biết. Chỉ 2 tuần ngủ 5.5h → giảm độ nhạy insulin 25% (Annals of Internal Medicine 2010).',
      'Kiểm soát stress mạn tính: cortisol cao → tăng đường huyết → tăng insulin → tích mỡ bụng visceral. Mỡ bụng (visceral fat) sản xuất adipokine gây viêm → tăng đề kháng insulin → vòng luẩn quẩn. Thiền + vận động đồng thời tấn công cả hai đầu vòng này.',
    ],
    points: [
      { icon: '📏', label: 'Đo vòng eo mỗi tháng', note: 'Nam <90cm, nữ <80cm — mỡ bụng quan trọng hơn BMI tổng' },
      { icon: '🥦', label: 'Thực phẩm nguyên chất ưu tiên', note: 'Ít chế biến = ít đường ẩn + nhiều chất xơ tự nhiên hơn' },
      { icon: '💪', label: 'Squat + deadlift tốt hơn chỉ chạy bộ', note: 'Cơ bắp là "bể chứa glucose" — tập sức mạnh giảm đề kháng insulin tốt nhất' },
      { icon: '🩸', label: 'Đường huyết đói + HbA1c mỗi năm', note: 'Phát hiện sớm tiền tiểu đường — giai đoạn còn đảo ngược được' },
    ],
  },
  {
    metric: 'Cơ Xương Khớp', freq: 'Phòng ngừa từ tuổi 30+', tip: '5 thói quen bảo vệ cơ xương khớp suốt đời',
    icon: '🦴', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    items: ['Giãn cơ 5–10ph/ngày', 'Không ngồi quá 2h liên tục', 'Tập lõi (core) 2–3x/tuần', 'Ergonomics bàn làm việc', 'Tập thăng bằng nếu >50 tuổi'],
    keyFact: 'Sarcopenia (mất cơ theo tuổi) bắt đầu từ 30 tuổi với tốc độ 3–8%/thập kỷ, tăng lên 15%/thập kỷ sau 60 tuổi. Viêm khớp ảnh hưởng >500 triệu người toàn cầu. Cả hai đều phòng ngừa và làm chậm tiến triển hiệu quả bằng vận động và dinh dưỡng đúng cách — không cần chờ đến khi có triệu chứng.',
    detail: 'Hệ cơ xương khớp suy giảm theo tuổi là tất yếu — nhưng tốc độ suy giảm hoàn toàn kiểm soát được. Người tập luyện đều đặn ở tuổi 70 có thể có sức mạnh cơ và mật độ xương tương đương người ít vận động ở tuổi 40.',
    details: [
      'Giãn cơ 5–10ph/ngày: tính linh hoạt (flexibility) giảm theo tuổi nếu không duy trì. Giãn cơ dynamic trước tập (leg swing, arm circle) kích hoạt cơ và khớp. Giãn tĩnh sau tập (giữ 20–30 giây) tăng tầm vận động. Yoga và pilates là hệ thống hoàn chỉnh nhất cho flexibility + core.',
      'Không ngồi quá 2h liên tục: ngồi lâu co rút cơ gấp hông (hip flexors), làm yếu cơ mông (glutes) và gây đau lưng dưới mạn tính. Đứng dậy đi 2–5 phút mỗi 1–2h. "Active sitting" (ngồi bóng, ghế ergonomic) không thay thế được việc đứng dậy di chuyển.',
      'Tập lõi (core) 2–3x/tuần: core không chỉ là 6-pack mà gồm tất cả cơ bao quanh thân (transverse abdominis, multifidus, cơ sàn chậu). Plank, bird-dog, dead bug, Pallof press ổn định cột sống, giảm nguy cơ chấn thương khi nâng vật và hoạt động hàng ngày.',
      '"Tech neck" và ergonomics: cúi đầu 60° nhìn điện thoại = 27kg áp lực lên đốt sống cổ (thay vì 5kg bình thường). Màn hình ngang tầm mắt, khuỷu tay 90°, lưng có điểm tựa, bàn chân phẳng sàn. Đầu tư một màn hình phụ tốt hơn vật lý trị liệu sau này.',
      'Tập thăng bằng sau 50 tuổi: ngã là nguyên nhân hàng đầu thương tích nghiêm trọng ở người cao tuổi — 30% người >65 tuổi ngã ít nhất 1 lần/năm. Tập đứng một chân (30 giây/chân), tai chi, yoga cải thiện proprioception và phản xạ ngã — giảm 50% nguy cơ ngã (WHO data).',
      'Canxi và vitamin D cho xương: canxi 1000–1200mg/ngày (sữa, rau lá xanh đậm, cá hộp có xương) + vitamin D 1500–2000 IU/ngày. Vitamin D cần thiết để hấp thu canxi — thiếu D dù đủ canxi vẫn loãng xương. Sau 50 tuổi: đo mật độ xương (DEXA) mỗi 2 năm để tầm soát loãng xương.',
    ],
    points: [
      { icon: '⏰', label: 'Đứng dậy mỗi 2h', note: '"Active breaks" 5 phút đủ reset cột sống và lưu lượng máu' },
      { icon: '🧘', label: 'Core + flexibility 3x/tuần', note: 'Plank, bird-dog, giãn cơ hông — đầu tư tốt nhất cho tuổi trung niên' },
      { icon: '🥛', label: 'Canxi + vitamin D đủ liều', note: '1000–1200mg canxi + 1500–2000 IU vitamin D/ngày từ tuổi 50' },
      { icon: '⚖️', label: 'Tập sức mạnh giữ cơ theo tuổi', note: 'Sarcopenia bắt đầu 30 tuổi — resistance training đảo ngược được' },
    ],
  },
  {
    metric: 'Stress & Giấc Ngủ', freq: 'Hằng ngày — không thể bù đắp', tip: '5 thói quen phục hồi não bộ và hệ thần kinh',
    icon: '🧠', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    items: ['Ngủ 7–9h/đêm cố định giờ', 'Thiền/thở 5–10ph/ngày', 'Tắt màn hình 1h trước ngủ', 'Duy trì kết nối xã hội', 'Có ít nhất 1 hoạt động thư giãn'],
    keyFact: 'Stress mạn tính và thiếu ngủ tạo ra vòng luẩn quẩn: cortisol cao làm khó ngủ, thiếu ngủ làm cortisol cao hơn. Cả hai đồng thời tăng nguy cơ tim mạch, tiểu đường, trầm cảm và suy giảm nhận thức — và cả hai đáp ứng tốt với cùng một tập hợp can thiệp đơn giản.',
    detail: 'Não và hệ thần kinh không thể "hoạt động liên tục" như máy tính. Giấc ngủ là thời gian dọn dẹp độc chất não (glymphatic system), củng cố trí nhớ và cân bằng cảm xúc. Không thể bù giấc ngủ bằng cách ngủ nhiều cuối tuần.',
    details: [
      'Cố định giờ dậy 7 ngày/tuần: consistency của giờ ngủ/dậy quan trọng hơn tổng số giờ. "Social jetlag" (dậy muộn cuối tuần >1 giờ so với ngày thường) làm tăng nguy cơ béo phì, tim mạch và tâm trạng kém tuần tiếp theo. Một giờ dậy cố định là can thiệp đơn giản và mạnh nhất.',
      'Thiền/thở 5–10 phút/ngày: box breathing (hít 4 giây – giữ 4 – thở 4 – giữ 4) kích hoạt parasympathetic ngay lập tức — nhịp tim và huyết áp giảm trong vài phút. Thiền mindfulness >8 tuần giảm kích thước amygdala và tăng grey matter vùng prefrontal cortex (Holzel et al. 2011, Harvard).',
      'Tắt màn hình 1h trước ngủ: ánh sáng xanh từ điện thoại/máy tính ức chế melatonin 2–3 giờ và trễ giờ ngủ thiếp trung bình 30–40 phút. Nếu phải dùng thiết bị: bật Night Shift/Night Light + giảm độ sáng tối đa + đeo kính chặn ánh sáng xanh.',
      'Kết nối xã hội chất lượng: cô đơn và cô lập xã hội có tác động sức khỏe tương đương hút 15 điếu thuốc/ngày (Holt-Lunstad 2015, BYU). Chất lượng quan hệ (1–2 người thật sự hiểu nhau) quan trọng hơn số lượng. Một cuộc trò chuyện thật giảm cortisol hiệu quả.',
      '"Active rest" thay vì passive entertainment: đọc sách giấy, nấu ăn, làm vườn, âm nhạc, thủ công — não cần "playful mode" để tái tạo dopamine và serotonin. Ngược lại, scroll mạng xã hội và Netflix kích thích thụ động không cho não nghỉ ngơi thực sự, thường làm tăng lo âu và căng thẳng.',
      'Vận động là can thiệp stress hiệu quả nhất: 30 phút moderate exercise → giảm cortisol, tăng BDNF (brain-derived neurotrophic factor — "phân bón cho não"), endorphin và serotonin. Hiệu quả ngay sau buổi tập (mood boost 4–6h) và tích lũy theo tuần. Meta-analysis: tập thể dục hiệu quả tương đương antidepressant nhẹ đến vừa.',
    ],
    points: [
      { icon: '🛌', label: 'Cố định giờ dậy 7 ngày', note: 'Nhịp sinh học ổn định — quan trọng hơn giờ ngủ cụ thể' },
      { icon: '🫁', label: 'Box breathing 4-4-4-4', note: 'Kích hoạt parasympathetic ngay — làm 3–4 vòng khi stress cao' },
      { icon: '📵', label: 'Không màn hình 1h trước ngủ', note: 'Ánh sáng xanh delay melatonin 2–3h — Night Mode không đủ' },
      { icon: '🏃', label: 'Vận động 30 phút = giảm stress ngay', note: 'Endorphin + BDNF — can thiệp stress nhanh và bền vững nhất' },
    ],
  },
];

function TabE4() {
  const { t: tCommon } = useTranslation('common');
  const { t: tP } = useTranslation('pillars');
  const pillarE = tP('pillarE', { returnObjects: true });
  const diseaseTr = Array.isArray(pillarE?.e_disease_groups) ? pillarE.e_disease_groups : [];
  const DISEASES = DISEASE_GROUPS.map((s, i) => ({ ...s, ...(diseaseTr[i] || {}) }));
  const [groupModal, setGroupModal] = useState(null);
  return (
    <div className="space-y-4">
      <p className="text-base text-muted">{pillarE?.e_tab4_h1 || 'Tập trung vào 4 nhóm bệnh quan trọng nhất trong cuộc sống hiện đại:'}</p>
      <p className="text-xs text-muted opacity-60">{pillarE?.e_tab4_hint || 'Nhấp vào từng nhóm để xem chiến lược phòng ngừa chi tiết'}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DISEASES.map((g, i) => (
          <div key={g.metric}
            className="rounded-2xl border border-border bg-surface/60 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
            onClick={() => setGroupModal(i)}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.45)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{g.icon}</span>
                <span className="font-bold text-lg" style={{ color: g.color }}>{g.metric}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full border shrink-0"
                style={{ color: g.color, borderColor: `rgba(${g.rgb},0.35)`, background: `rgba(${g.rgb},0.08)` }}>{tCommon('modal.see_detail')}</span>
            </div>
            <ul className="space-y-1.5">
              {g.items.map(it => (
                <li key={it} className="flex items-center gap-2 text-base text-muted">
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ background: g.color }} />{it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {groupModal !== null && (
        <ScheduleModal
          item={DISEASES[groupModal]}
          idx={groupModal} total={DISEASES.length}
          onClose={() => setGroupModal(null)}
          onPrev={() => setGroupModal(i => Math.max(0, i - 1))}
          onNext={() => setGroupModal(i => Math.min(DISEASES.length - 1, i + 1))}
          hasPrev={groupModal > 0} hasNext={groupModal < DISEASES.length - 1}
        />
      )}
    </div>
  );
}

const CHECK_BASIC = [
  {
    metric: 'Khám tổng quát', freq: '1 lần/năm', tip: 'Bắt đầu từ 20 tuổi hoặc sớm hơn nếu có nguy cơ',
    icon: '🩺', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhiều bệnh nghiêm trọng — tăng huyết áp, tiểu đường, ung thư giai đoạn sớm — không gây triệu chứng rõ ràng trong nhiều năm. Khám tổng quát là cơ hội duy nhất phát hiện sớm trước khi bệnh tiến triển nặng và tốn kém hơn nhiều để điều trị.',
    detail: 'Khám tổng quát không chỉ là xét nghiệm máu — bao gồm hỏi bệnh sử, khám lâm sàng toàn diện, đánh giá nguy cơ cá nhân và tư vấn phòng ngừa. Bác sĩ là người quyết định xét nghiệm nào phù hợp với tuổi và nguy cơ của bạn.',
    details: [
      'Hỏi bệnh sử: tiền sử bệnh bản thân và gia đình, thuốc đang dùng, thói quen sinh hoạt (hút thuốc, rượu, vận động, ngủ, stress). Đây là nền tảng để bác sĩ quyết định tầm soát nào ưu tiên.',
      'Khám lâm sàng toàn diện: cân nặng, chiều cao, BMI, vòng eo, huyết áp, nhịp tim, nhiệt độ, nghe tim phổi, sờ bụng, khám hạch bạch huyết, kiểm tra da và niêm mạc. Nhiều phát hiện quan trọng đến từ khám tay đơn giản.',
      'Tầm soát theo tuổi và giới: phụ nữ >21 tuổi — PAP smear (tầm soát ung thư cổ tử cung) mỗi 3 năm. Phụ nữ >40 tuổi — mammography. Nam >50 tuổi — tầm soát ung thư đại tràng, PSA. Tất cả >40 tuổi — ECG, đo mật độ xương (nếu nguy cơ).',
      'Tiêm chủng người lớn: nhiều người bỏ qua tiêm phòng sau tuổi trưởng thành. Khám tổng quát là dịp rà soát: cúm (hàng năm), viêm gan B (nếu chưa có miễn dịch), HPV (đến 26 tuổi), Tdap (mỗi 10 năm), phế cầu (>65 tuổi).',
      'Tư vấn và đặt mục tiêu sức khỏe: khám tổng quát là cơ hội thảo luận mục tiêu sức khỏe với bác sĩ — giảm cân, cải thiện đường huyết, ngưng thuốc lá, quản lý stress. Bác sĩ gia đình tốt là người nhớ bạn qua nhiều năm và thấy xu hướng thay đổi.',
      'Tần suất phù hợp: 20–39 tuổi khỏe mạnh, không nguy cơ → 2–3 năm/lần. 40–49 tuổi → 1–2 năm/lần. ≥50 tuổi → hàng năm. Có bệnh mạn tính hoặc nguy cơ cao → theo lịch hẹn của bác sĩ (thường 3–6 tháng/lần).',
    ],
    points: [
      { icon: '📅', label: '1 lần/năm từ tuổi 40+', note: '20–39 tuổi khỏe mạnh → 2–3 năm/lần là đủ' },
      { icon: '🗓️', label: 'Nhịn ăn trước khám', note: 'Nhịn ăn 8–12h để đường huyết và mỡ máu đo chính xác' },
      { icon: '📋', label: 'Mang danh sách thuốc đang dùng', note: 'Bao gồm thực phẩm chức năng — ảnh hưởng kết quả xét nghiệm' },
      { icon: '📊', label: 'Lưu kết quả để so sánh', note: 'Xu hướng thay đổi theo năm quan trọng hơn một lần đo' },
    ],
  },
  {
    metric: 'Cân nặng + BMI + vòng eo', freq: '1 lần/năm (hoặc hàng tháng tại nhà)', tip: 'BMI và vòng eo cùng nhau phản ánh nguy cơ chuyển hóa',
    icon: '⚖️', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&q=80&auto=format&fit=crop',
    keyFact: 'BMI có giới hạn — không phân biệt được cơ và mỡ. Vòng eo là chỉ số tốt hơn cho mỡ bụng (visceral fat) — loại mỡ nguy hiểm nhất về tim mạch và chuyển hóa. Nam >90cm, nữ >80cm = nguy cơ tăng đáng kể dù BMI bình thường.',
    detail: 'Cân nặng một mình không đủ thông tin. BMI thêm chiều cao vào phương trình nhưng vẫn bỏ qua phân bố mỡ. Vòng eo đo mỡ nội tạng (visceral fat) — loại mỡ bao quanh các cơ quan nội tạng và gây viêm hệ thống, đề kháng insulin và bệnh tim mạch.',
    details: [
      'BMI (Body Mass Index) = cân nặng (kg) / chiều cao² (m²). Phân loại WHO châu Á: <18.5 = thiếu cân; 18.5–22.9 = bình thường; 23–24.9 = thừa cân; ≥25 = béo phì. Người châu Á ngưỡng thấp hơn người da trắng do tỷ lệ mỡ/cơ khác nhau.',
      'Vòng eo đo đúng cách: đứng thẳng, thở ra bình thường, đặt thước ở điểm giữa xương sườn thấp nhất và đỉnh xương chậu (thường ngang rốn). Nguy cơ tăng: nam ≥90cm, nữ ≥80cm. Rất cao: nam ≥102cm, nữ ≥88cm (theo chuẩn châu Á điều chỉnh).',
      'Tỷ số vòng eo/chiều cao (WHtR): vòng eo/chiều cao <0.5 là mục tiêu tốt hơn BMI đơn thuần. VD: chiều cao 170cm → vòng eo mục tiêu <85cm. WHtR >0.6 ở bất kỳ BMI nào đều tăng nguy cơ tim mạch đáng kể.',
      'Visceral fat nguy hiểm hơn subcutaneous fat: mỡ bụng nội tạng bao quanh gan, tụy, ruột → giải phóng adipokine gây viêm, free fatty acid gây đề kháng insulin, IL-6 và TNF-α. Người "skinny fat" (BMI bình thường nhưng vòng eo lớn) có nguy cơ chuyển hóa ngang người béo phì.',
      'Theo dõi xu hướng quan trọng hơn con số tuyệt đối: cân mỗi tháng cùng giờ, cùng điều kiện (sáng sớm, sau toilet, trước ăn sáng). Biến động 1–2 kg/tuần là bình thường. Xu hướng tăng liên tục >3–6 tháng cần điều chỉnh.',
      'Cân thông minh (body composition scale): nhiều cân thông minh đo được % mỡ, cơ, nước cơ thể qua BIA (bioelectrical impedance). Độ chính xác không bằng DEXA nhưng đủ để theo dõi xu hướng. % mỡ lý tưởng: nam 15–20%, nữ 20–28%.',
    ],
    points: [
      { icon: '📐', label: 'Vòng eo quan trọng hơn BMI', note: 'Nam <90cm, nữ <80cm — mỡ nội tạng mới là vấn đề thực' },
      { icon: '⏰', label: 'Cân buổi sáng cùng điều kiện', note: 'Sau toilet, trước ăn — giảm nhiễu từ thức ăn và nước' },
      { icon: '📊', label: 'Theo dõi xu hướng 3–6 tháng', note: 'Biến động ngày/tuần bình thường — xu hướng mới quan trọng' },
      { icon: '💪', label: 'Cơ nhiều có thể BMI cao', note: 'Người tập sức mạnh: dùng % mỡ cơ thể thay vì chỉ BMI' },
    ],
  },
  {
    metric: 'Huyết áp', freq: 'Mỗi lần khám + đo tại nhà hàng tuần', tip: 'Đo 2 lần cách nhau 1 phút, lấy giá trị trung bình',
    icon: '💊', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tăng huyết áp được gọi là "kẻ giết người thầm lặng" vì không có triệu chứng rõ ràng trong nhiều năm. Ảnh hưởng 1.28 tỷ người trưởng thành toàn cầu (WHO 2021) và là yếu tố nguy cơ hàng đầu của đột quỵ, nhồi máu cơ tim và suy thận.',
    detail: 'Huyết áp dao động trong ngày — cao nhất buổi sáng, thấp nhất khi ngủ. Đo đúng cách quan trọng hơn đo nhiều lần. Đo tại nhà (home blood pressure monitoring) phản ánh chính xác hơn đo tại phòng khám do tránh được "white coat hypertension".',
    details: [
      'Phân loại huyết áp (theo AHA 2017): Bình thường <120/80. Nâng cao (elevated) 120–129/<80. Tăng độ 1: 130–139/80–89. Tăng độ 2: ≥140/90. Khủng hoảng: >180/120 → đi cấp cứu. Người Việt Nam thường dùng ngưỡng <140/90 là bình thường nhưng hướng dẫn quốc tế mới dùng <130/80.',
      'Cách đo đúng: ngồi nghỉ 5 phút trước khi đo, lưng tựa ghế, chân không bắt chéo, tay ngang tim. Không nói chuyện khi đo. Đo 2 lần cách nhau 1 phút, lấy trung bình. Không uống cà phê, không tập thể dục trong 30 phút trước.',
      'White coat hypertension: huyết áp tăng khi đến phòng khám do lo lắng — gặp ở 15–30% người. Huyết áp thật sự bình thường nhưng đo tại phòng khám cao. Ngược lại: masked hypertension — bình thường tại phòng khám nhưng cao tại nhà (nguy hiểm hơn vì không được điều trị).',
      'Mục tiêu điều trị: hầu hết người lớn → <130/80 mmHg. Người >65 tuổi → <130/80 nếu dung nạp được. Người có bệnh thận mạn/đái tháo đường → <130/80. Đạt mục tiêu bằng lối sống trước, thuốc nếu cần sau 3 tháng không cải thiện.',
      'Can thiệp lối sống hiệu quả: giảm muối (<5g/ngày) giảm 5–6 mmHg. Tập thể dục aerobic 150 phút/tuần giảm 5–8 mmHg. Giảm 5kg nếu thừa cân giảm 5 mmHg. Hạn chế rượu (<2 ly/ngày) giảm 3–4 mmHg. DASH diet giảm 8–14 mmHg.',
      'Đo tại nhà: máy đo huyết áp bắp tay tự động (omron, citizen) chính xác hơn máy đo cổ tay. Đo 2 lần buổi sáng (trước ăn, trước thuốc) + 2 lần buổi tối trong 7 ngày. Ghi lại và mang cho bác sĩ — có giá trị hơn một lần đo tại phòng khám.',
    ],
    points: [
      { icon: '🎯', label: 'Mục tiêu <130/80 mmHg', note: 'Ngưỡng mới theo AHA 2017 — không phải <140/90 cũ' },
      { icon: '🏠', label: 'Đo tại nhà chính xác hơn', note: 'Tránh white coat effect — đo sáng + tối trong 7 ngày' },
      { icon: '🧂', label: 'Giảm muối — hiệu quả nhất', note: '<5g muối/ngày giảm 5–6 mmHg không cần thuốc' },
      { icon: '💊', label: 'Thuốc nếu lối sống chưa đủ', note: '3 tháng thay đổi lối sống không đạt mục tiêu → cần thuốc' },
    ],
  },
  {
    metric: 'Đường huyết đói', freq: '1 lần/năm (hoặc mỗi 3 năm nếu bình thường)', tip: 'Nhịn ăn ít nhất 8 giờ, không uống gì ngoài nước lọc',
    icon: '🩸', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: '537 triệu người trưởng thành toàn cầu sống với tiểu đường (IDF 2021) — và khoảng 240 triệu người không biết mình mắc bệnh. Đường huyết đói là xét nghiệm tầm soát đơn giản nhất, nhanh nhất và rẻ nhất để phát hiện tiểu đường và tiền tiểu đường.',
    detail: 'Đường huyết đói (fasting plasma glucose — FPG) đo nồng độ glucose trong máu sau khi nhịn ăn ≥8 giờ. Đây là xét nghiệm tiêu chuẩn cho chẩn đoán tiểu đường và tầm soát hàng năm.',
    details: [
      'Ngưỡng chẩn đoán (ADA 2023): Bình thường: <5.6 mmol/L (100 mg/dL). Tiền tiểu đường: 5.6–6.9 mmol/L (100–125 mg/dL). Tiểu đường: ≥7.0 mmol/L (126 mg/dL) — cần xác nhận lần 2 nếu không có triệu chứng.',
      'Tầm quan trọng của giai đoạn tiền tiểu đường: 70–80 triệu người Việt Nam có nguy cơ tiền tiểu đường. Đây là giai đoạn hoàn toàn đảo ngược được bằng lối sống — giảm 5–7% cân nặng + 150 phút vận động/tuần giảm 58% nguy cơ tiến triển sang tiểu đường (DPP study).',
      'Ai nên tầm soát sớm hơn (từ 35 tuổi hoặc sớm hơn): BMI ≥23, vòng eo lớn, tiền sử gia đình có tiểu đường, tiểu đường thai kỳ, hội chứng buồng trứng đa nang (PCOS), tăng huyết áp hoặc mỡ máu xấu, lối sống ít vận động.',
      'Giới hạn của đường huyết đói đơn thuần: chỉ phản ánh tình trạng tại một thời điểm buổi sáng. Một số người có đường huyết đói bình thường nhưng HbA1c tăng (đường huyết sau ăn cao). Lý tưởng là xét nghiệm cả FPG và HbA1c.',
      'Sau khi được chẩn đoán tiểu đường: tự theo dõi đường huyết tại nhà (glucometer) giúp thấy phản ứng với thức ăn, vận động và thuốc. Đường huyết 2h sau ăn <8.0 mmol/L (140 mg/dL) là mục tiêu cho người tiểu đường có điều trị.',
      'Đường huyết bình thường không có nghĩa là "không cần lo": đường huyết đói bình thường nhưng sau ăn spike cao (postprandial hyperglycemia) vẫn gây tổn thương mạch máu. Ăn tinh bột nhiều, ít chất xơ, ăn nhanh đều làm tăng spike sau ăn dù đường huyết đói bình thường.',
    ],
    points: [
      { icon: '📏', label: 'Ngưỡng tiểu đường ≥7.0 mmol/L', note: 'Tiền tiểu đường: 5.6–6.9 mmol/L — giai đoạn đảo ngược được' },
      { icon: '⏰', label: 'Nhịn ăn ít nhất 8 giờ', note: 'Chỉ uống nước lọc — cà phê, trà đều ảnh hưởng kết quả' },
      { icon: '🎯', label: 'Tầm soát từ 35 tuổi', note: 'Hoặc sớm hơn nếu có nguy cơ — béo bụng, gia đình có tiểu đường' },
      { icon: '🏃', label: 'Tiền tiểu đường hoàn toàn đảo ngược', note: 'Giảm 5% cân + 150 phút/tuần vận động giảm 58% nguy cơ' },
    ],
  },
  {
    metric: 'HbA1c (nếu có nguy cơ)', freq: 'Mỗi 3 tháng (tiểu đường) hoặc 1 lần/năm (tầm soát)', tip: 'Phản ánh đường huyết trung bình 3 tháng — không cần nhịn ăn',
    icon: '🧪', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop',
    keyFact: 'HbA1c (glycated hemoglobin) phản ánh đường huyết trung bình trong 2–3 tháng qua — không bị ảnh hưởng bởi bữa ăn ngay trước khi xét nghiệm. Là tiêu chuẩn vàng theo dõi kiểm soát tiểu đường và có thể dùng để chẩn đoán.',
    detail: 'Glucose gắn vào hemoglobin trong hồng cầu theo tỷ lệ thuận với nồng độ glucose trong máu. Vì hồng cầu sống 2–3 tháng, HbA1c phản ánh "ký ức đường huyết" của 3 tháng trước — không thể "làm đẹp" bằng cách nhịn ăn một ngày trước xét nghiệm.',
    details: [
      'Ngưỡng giải thích: Bình thường: <5.7% (39 mmol/mol). Tiền tiểu đường: 5.7–6.4% (39–46 mmol/mol). Tiểu đường: ≥6.5% (48 mmol/mol). Mục tiêu kiểm soát tiểu đường: <7.0% (53 mmol/mol) cho hầu hết người lớn.',
      'Ưu điểm so với đường huyết đói: không cần nhịn ăn, phản ánh kiểm soát đường huyết dài hạn chứ không chỉ một thời điểm, ít biến động ngày qua ngày. Nhược điểm: không phát hiện được dao động đường huyết trong ngày (cần CGMS để đánh giá).',
      'HbA1c và biến chứng tiểu đường: DCCT study (type 1) và UKPDS study (type 2) chứng minh mỗi 1% giảm HbA1c giảm 35% nguy cơ biến chứng mắt, 25% biến chứng thận, 18% biến chứng tim mạch. Kiểm soát tốt HbA1c từ sớm có "memory effect" — bảo vệ kéo dài dù sau này kiểm soát kém hơn.',
      'Giới hạn của HbA1c: không chính xác với thiếu máu hồng cầu hình liềm, thiếu máu nặng (hồng cầu sống ngắn hơn), sau truyền máu. Người thiếu máu sắt: HbA1c thường cao giả tạo. Người thiếu G6PD: HbA1c thấp giả tạo.',
      'Tần suất xét nghiệm: tiểu đường kiểm soát tốt → 2 lần/năm. Tiểu đường chưa đạt mục tiêu hoặc mới thay đổi phác đồ → mỗi 3 tháng. Tiền tiểu đường → 1 lần/năm. Nguy cơ cao (béo bụng, gia đình tiểu đường) → 1 lần/năm.',
      'Mục tiêu cá nhân hóa: người trẻ, mới chẩn đoán, không biến chứng → <6.5%. Người già, nhiều bệnh đi kèm, nguy cơ hạ đường huyết cao → <8.0%. Mục tiêu quá chặt có thể gây hạ đường huyết nguy hiểm ở người cao tuổi.',
    ],
    points: [
      { icon: '📊', label: 'Phản ánh 3 tháng — không thể "giả"', note: 'Không cần nhịn ăn — đường huyết trung bình dài hạn' },
      { icon: '🎯', label: 'Mục tiêu <7.0% khi có tiểu đường', note: 'Mỗi 1% giảm HbA1c = giảm 35% biến chứng mắt và thận' },
      { icon: '🩺', label: 'Tầm soát nếu có nguy cơ', note: 'Béo bụng, gia đình tiểu đường, tiền tiểu đường → 1 lần/năm' },
      { icon: '⚠️', label: 'Không chính xác nếu thiếu máu', note: 'Thiếu sắt làm HbA1c cao giả — cần bổ sung thêm xét nghiệm' },
    ],
  },
  {
    metric: 'Mỡ máu toàn phần', freq: '1 lần/năm (hoặc mỗi 5 năm nếu bình thường)', tip: 'Nhịn ăn 9–12 giờ để triglyceride chính xác',
    icon: '🫀', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Rối loạn mỡ máu (dyslipidemia) là một trong 4 yếu tố nguy cơ tim mạch chính cùng tăng huyết áp, tiểu đường và hút thuốc. LDL "cholesterol xấu" thường không gây triệu chứng cho đến khi đột quỵ hoặc nhồi máu cơ tim xảy ra.',
    detail: 'Lipid panel cơ bản gồm 4 chỉ số: Total cholesterol (TC), LDL-C, HDL-C và Triglycerides. Mỗi chỉ số có vai trò khác nhau trong đánh giá nguy cơ tim mạch — không thể nhìn một chỉ số mà bỏ qua các chỉ số còn lại.',
    details: [
      'LDL-C (low-density lipoprotein): "cholesterol xấu" tích tụ trong thành mạch tạo mảng xơ vữa. Mục tiêu: <2.6 mmol/L (100 mg/dL) cho người bình thường; <1.8 mmol/L (70 mg/dL) nếu đã có bệnh tim mạch. LDL-C là mục tiêu điều trị chính của statin.',
      'HDL-C (high-density lipoprotein): "cholesterol tốt" thu dọn cholesterol từ thành mạch đưa về gan. Thấp (<1.0 mmol/L nam, <1.2 mmol/L nữ) = nguy cơ cao. Tập aerobic và rượu nhẹ tăng HDL; hút thuốc và béo phì giảm HDL.',
      'Triglycerides (TG): mỡ trung tính — tăng sau ăn và khi uống rượu. TG cao (>5.6 mmol/L) tăng nguy cơ viêm tụy cấp. TG 1.7–5.6 mmol/L = nguy cơ tim mạch tăng vừa. Giảm TG: cắt đường, rượu, carb tinh chế; tăng omega-3.',
      'Non-HDL cholesterol = TC - HDL-C: phản ánh tất cả lipoprotein chứa apoB (LDL, VLDL, IDL, Lp(a)) — là predictor tim mạch tốt hơn LDL đơn thuần. Mục tiêu: <3.4 mmol/L (130 mg/dL) cho nguy cơ thấp.',
      'Tầm soát theo tuổi: nam ≥35 tuổi, nữ ≥45 tuổi hoặc sau mãn kinh. Người có nguy cơ cao (gia đình tăng cholesterol, tiểu đường, hút thuốc) → bắt đầu sớm hơn và theo dõi thường xuyên hơn.',
      'Statin — khi nào cần: LDL tăng kéo dài dù đã thay đổi lối sống 3–6 tháng, đặc biệt kèm nguy cơ tim mạch 10 năm >7.5% (theo Framingham score). Statin an toàn và hiệu quả — lo ngại "hại gan" từ statin là không có cơ sở khoa học vững chắc khi dùng đúng liều.',
    ],
    points: [
      { icon: '📉', label: 'LDL <2.6 mmol/L mục tiêu cơ bản', note: 'Đã có bệnh tim → <1.8 mmol/L — statin nếu lối sống chưa đạt' },
      { icon: '⬆️', label: 'HDL càng cao càng tốt', note: 'Tập aerobic là cách tăng HDL hiệu quả nhất' },
      { icon: '🍬', label: 'TG cao = cắt đường và rượu trước', note: 'Đường và rượu là nguyên nhân phổ biến nhất tăng triglyceride' },
      { icon: '💊', label: 'Statin an toàn khi dùng đúng liều', note: 'Lo ngại "hại gan" không có cơ sở — theo dõi ALT nếu cần' },
    ],
  },
  {
    metric: 'Chức năng gan (AST/ALT)', freq: '1 lần/năm', tip: 'AST và ALT là enzyme trong tế bào gan — tăng khi tế bào gan tổn thương',
    icon: '🫁', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gan là "nhà máy hóa chất" lớn nhất cơ thể — thực hiện >500 chức năng. Viêm gan B và C mạn tính là nguyên nhân hàng đầu xơ gan và ung thư gan ở Việt Nam. Nhiều người mang virus viêm gan mà không biết cho đến khi đã xơ gan nặng.',
    detail: 'AST (aspartate aminotransferase) và ALT (alanine aminotransferase) là enzyme trong tế bào gan. Khi tế bào gan bị tổn thương, enzyme rò rỉ vào máu → nồng độ trong máu tăng. ALT đặc hiệu cho gan hơn AST (AST còn có trong tim, cơ).',
    details: [
      'Ngưỡng bình thường: ALT: nam <40 U/L, nữ <35 U/L. AST: <40 U/L. Tăng nhẹ (<3 lần ngưỡng trên): thường do rượu, thuốc, thực phẩm chức năng, tập thể dục mạnh trước xét nghiệm. Tăng >3–5 lần: cần điều tra thêm.',
      'Gan nhiễm mỡ không do rượu (NAFLD/NASH): ngày càng phổ biến do ăn nhiều đường, béo phì, tiểu đường type 2. ALT thường tăng nhẹ 1–3 lần. Tiến triển từ steatosis → viêm → xơ gan → ung thư gan theo thập kỷ. Điều trị hiệu quả nhất: giảm cân 7–10%.',
      'Viêm gan B và C mạn tính: Việt Nam có tỷ lệ HBsAg dương tính ~8–10% dân số (một trong những cao nhất thế giới). Viêm gan B mạn → AST/ALT tăng thất thường → xơ gan → ung thư gan. Có vaccine viêm gan B và thuốc kháng virus hiệu quả (tenofovir, entecavir).',
      'Phân biệt nguyên nhân tăng transaminase: tỷ số AST/ALT >2 thường gợi ý do rượu (alcoholic hepatitis). ALT>AST gợi ý NAFLD hoặc viêm gan virus. ALT tăng kèm ALP và bilirubin gợi ý tắc mật. Cần kết hợp hình ảnh học (siêu âm) và marker virus để chẩn đoán chính xác.',
      'Thuốc và thực phẩm chức năng gây tổn thương gan: paracetamol (quá liều >4g/ngày), thuốc lao (INH, rifampicin), statins (tăng nhẹ, hiếm khi nghiêm trọng), thảo dược và TPCN không rõ thành phần là nguyên nhân ngày càng phổ biến của drug-induced liver injury (DILI).',
      'Theo dõi người dùng statin: statin có thể gây tăng ALT nhẹ (<3 lần giới hạn trên bình thường) ở một số người — thường tự hồi phục. Kiểm tra ALT trước khi bắt đầu statin và sau 3 tháng. Không cần ngưng statin nếu ALT <3 lần giới hạn trên.',
    ],
    points: [
      { icon: '🦠', label: 'Tầm soát viêm gan B và C', note: 'HBsAg và Anti-HCV — Việt Nam tỷ lệ nhiễm cao, có điều trị hiệu quả' },
      { icon: '🍺', label: 'AST/ALT >2 gợi ý do rượu', note: 'Cắt rượu 4–6 tuần và đo lại — thường về bình thường' },
      { icon: '⚖️', label: 'Giảm cân tốt nhất cho gan nhiễm mỡ', note: 'Giảm 7–10% cân nặng cải thiện NAFLD rõ rệt trong 6 tháng' },
      { icon: '💊', label: 'Kiểm tra TPCN đang dùng', note: 'Thảo dược không rõ nguồn gốc là nguyên nhân phổ biến DILI' },
    ],
  },
  {
    metric: 'Chức năng thận (creatinine)', freq: '1 lần/năm', tip: 'eGFR tính từ creatinine, tuổi và giới — quan trọng hơn creatinine đơn thuần',
    icon: '💧', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bệnh thận mạn (CKD) ảnh hưởng ~10% dân số toàn cầu — phần lớn không biết do không có triệu chứng đến giai đoạn muộn. Thận hoạt động như bộ lọc 24/7 — tiểu đường và tăng huyết áp là hai nguyên nhân hàng đầu gây suy thận cần lọc máu.',
    detail: 'Creatinine là sản phẩm phân hủy của creatine trong cơ. Thận lọc creatinine ra khỏi máu — khi thận suy, creatinine tích lũy trong máu. eGFR (estimated GFR) tính toán mức lọc cầu thận ước tính từ creatinine, tuổi, giới và cân nặng — phản ánh chức năng thận tốt hơn creatinine đơn thuần.',
    details: [
      'Phân loại giai đoạn CKD theo eGFR: G1: ≥90 ml/min (bình thường — nhưng cần có albumin niệu để chẩn đoán CKD). G2: 60–89. G3a: 45–59. G3b: 30–44 (cần theo dõi sát). G4: 15–29 (chuẩn bị lọc máu). G5: <15 hoặc lọc máu.',
      'Ngưỡng creatinine bình thường: nam 62–115 µmol/L (0.7–1.3 mg/dL); nữ 44–97 µmol/L (0.5–1.1 mg/dL). Người có cơ bắp nhiều (vận động viên) có creatinine cao hơn — không phải dấu hiệu bệnh. eGFR quan trọng hơn creatinine đơn thuần.',
      'Protein/albumin trong nước tiểu (proteinuria/albuminuria): dấu hiệu sớm tổn thương thận — xuất hiện trước khi creatinine tăng. Microalbuminuria (30–300 mg/g creatinine) là dấu hiệu sớm nhất của bệnh thận do tiểu đường và huyết áp. Xét nghiệm nước tiểu trong gói khám định kỳ thường phát hiện điều này.',
      'Tiểu đường và thận: đường huyết cao gây tổn thương tiểu cầu thận (glomeruli) qua nhiều cơ chế — glycation, tăng áp lực lọc, viêm. Người tiểu đường cần kiểm tra creatinine và albumin niệu ít nhất 1 lần/năm. Kiểm soát HbA1c <7% và huyết áp <130/80 là hai biện pháp bảo thận hiệu quả nhất.',
      'Thuốc gây độc thận thường gặp: NSAID (ibuprofen, naproxen — dùng thường xuyên hoặc kéo dài), aminoglycosides (kháng sinh tiêm như gentamicin), thuốc cản quang (contrast dye) ở người thận yếu, một số thảo dược chứa aristolochic acid (mộc thông, phòng kỷ). Người thận yếu (eGFR <60) phải cẩn thận với liều thuốc thải qua thận.',
      'Bảo vệ thận: kiểm soát đường huyết và huyết áp là quan trọng nhất. Uống đủ nước (2–2.5 lít/ngày). Tránh NSAID dài hạn. Nếu cần thuốc cản quang → hydrate tốt trước và sau. Người CKD giai đoạn 3+ cần hạn chế protein động vật để giảm tải lọc thận.',
    ],
    points: [
      { icon: '📊', label: 'eGFR quan trọng hơn creatinine', note: 'Tính từ creatinine + tuổi + giới — phản ánh chức năng thực' },
      { icon: '🩺', label: 'Protein niệu là dấu hiệu sớm', note: 'Xuất hiện trước khi creatinine tăng — cần xét nghiệm nước tiểu' },
      { icon: '💊', label: 'Tránh NSAID dài hạn', note: 'Ibuprofen thường xuyên làm giảm eGFR theo thời gian' },
      { icon: '💧', label: 'Hydrate đủ — bảo vệ thận đơn giản nhất', note: '2–2.5 lít nước/ngày — quan trọng đặc biệt khi làm xét nghiệm cản quang' },
    ],
  },
  {
    metric: 'Công thức máu toàn phần', freq: '1 lần/năm', tip: 'Complete Blood Count (CBC) — đánh giá 3 dòng tế bào máu',
    icon: '🔬', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Công thức máu toàn phần (CBC) là một trong những xét nghiệm phổ biến nhất trong y tế — đánh giá ba dòng tế bào máu: hồng cầu (oxy), bạch cầu (miễn dịch) và tiểu cầu (đông máu). Một xét nghiệm duy nhất có thể phát hiện thiếu máu, nhiễm trùng, leukemia và nhiều bệnh khác.',
    detail: 'CBC đo số lượng và đặc điểm của các tế bào máu. Kết hợp với triệu chứng lâm sàng, CBC giúp bác sĩ đưa ra hướng chẩn đoán — không phải chẩn đoán cuối cùng mà là sàng lọc để quyết định xét nghiệm tiếp theo.',
    details: [
      'Hồng cầu và hemoglobin: Hemoglobin bình thường nam ≥130 g/L, nữ ≥120 g/L. Thiếu máu (anemia) khi dưới ngưỡng này. Nguyên nhân phổ biến nhất: thiếu sắt (ferritin thấp), thiếu B12/folate, bệnh mạn tính. MCV (mean corpuscular volume): nhỏ = thiếu sắt/thalassemia; to = thiếu B12/folate.',
      'Bạch cầu và vi differential: WBC bình thường 4.0–11.0 × 10⁹/L. Tăng bạch cầu (leukocytosis) gặp trong nhiễm trùng, viêm, stress, corticoid. Giảm bạch cầu (leukopenia) gặp trong virus (HIV, EBV), thuốc, bệnh tủy xương. Differential (tỷ lệ từng loại bạch cầu) cho thêm thông tin: neutrophil tăng = vi khuẩn; lymphocyte tăng = virus.',
      'Tiểu cầu (platelets): bình thường 150–400 × 10⁹/L. Giảm tiểu cầu (<100 × 10⁹/L) → nguy cơ chảy máu: do ITP (tự miễn), thuốc, virus dengue (xuất huyết dengue), hội chứng DIC. Tăng tiểu cầu (>450 × 10⁹/L) → nguy cơ huyết khối.',
      'Thiếu máu thiếu sắt — phổ biến nhất: phụ nữ tuổi sinh sản mất sắt qua kinh nguyệt, thai kỳ; người ăn chay/thuần chay; người chạy bộ nhiều (foot strike hemolysis). Ferritin là xét nghiệm nhạy hơn CBC để phát hiện sớm — ferritin <30 ng/mL dù hemoglobin bình thường là thiếu sắt tiềm ẩn.',
      'Thalassemia — phổ biến ở Việt Nam: MCV thấp (<80 fL) kèm hồng cầu nhỏ nhiều (microcytosis) nhưng ferritin bình thường gợi ý thalassemia trait (người mang gen). Không cần điều trị nhưng cần tư vấn di truyền trước khi mang thai (nếu cả 2 vợ chồng mang gen → nguy cơ sinh con nặng 25%).',
      'Bạch cầu ái toan (eosinophil) tăng: >5% hoặc >0.5 × 10⁹/L → nghĩ đến dị ứng mạn tính, nhiễm ký sinh trùng (giun, sán), bệnh tự miễn. Ở Việt Nam hay gặp nhiễm giun lươn (strongyloides), giun đũa chó mèo (toxocara).',
    ],
    points: [
      { icon: '🩸', label: 'Ferritin quan trọng hơn hemoglobin', note: 'Thiếu sắt tiềm ẩn: ferritin <30 ng/mL dù hemoglobin còn bình thường' },
      { icon: '🔬', label: 'MCV nhỏ + ferritin bình thường', note: 'Gợi ý thalassemia trait — phổ biến ở Việt Nam, cần tư vấn di truyền' },
      { icon: '🦠', label: 'Bạch cầu cao ≠ luôn là nhiễm trùng', note: 'Stress, vận động, corticoid đều tăng WBC — cần kết hợp lâm sàng' },
      { icon: '🐛', label: 'Eosinophil tăng → kiểm tra ký sinh trùng', note: 'Toxocara, giun lươn phổ biến ở Việt Nam — xét nghiệm phân và huyết thanh' },
    ],
  },
  {
    metric: 'Tổng phân tích nước tiểu', freq: '1 lần/năm', tip: 'Xét nghiệm nước tiểu giữa dòng buổi sáng — không cần nhịn ăn',
    icon: '🧫', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nước tiểu là "gương phản chiếu" của thận và nhiều cơ quan khác. Tổng phân tích nước tiểu (urinalysis) đơn giản, rẻ và nhanh có thể phát hiện bệnh thận, tiểu đường, nhiễm trùng tiết niệu và thậm chí một số ung thư — trước khi có triệu chứng.',
    detail: 'Urinalysis gồm 3 phần: đánh giá bằng mắt (màu, độ đục), que nhúng dipstick (protein, glucose, máu, bạch cầu, nitrite, pH, tỷ trọng, bilirubin, urobilinogen) và soi kính hiển vi (tế bào, trụ, tinh thể). Kết quả bất thường cần xét nghiệm tiếp theo và đánh giá lâm sàng.',
    details: [
      'Protein niệu (proteinuria): bình thường <150 mg/24h hoặc <30 mg/g creatinine. Albumin niệu vi lượng (30–300 mg/g) là dấu hiệu sớm nhất tổn thương thận do tiểu đường và tăng huyết áp — xuất hiện trước khi creatinine tăng 5–10 năm. Protein niệu >500 mg/ngày: cần điều tra nguyên nhân khẩn.',
      'Glucose niệu: bình thường không có glucose trong nước tiểu. Xuất hiện khi đường huyết vượt ngưỡng thận (~10 mmol/L). Là dấu hiệu gợi ý tiểu đường nhưng không đủ để chẩn đoán — cần xét nghiệm máu xác nhận.',
      'Máu trong nước tiểu (hematuria): vi thể (chỉ thấy dưới kính hiển vi) hoặc đại thể (màu đỏ/hồng nhìn thấy được). Nguyên nhân: sỏi thận/tiết niệu, viêm cầu thận, nhiễm trùng tiết niệu, ung thư bàng quang/thận. Hematuria không đau cần tầm soát ung thư niệu đạo đặc biệt ở người >40 tuổi và hút thuốc.',
      'Bạch cầu niệu và nitrite: gợi ý nhiễm trùng tiết niệu (UTI). Nitrite dương tính khi vi khuẩn gram âm (E. coli) chuyển hóa nitrate → nitrite. Phụ nữ có tỷ lệ UTI cao hơn nam do niệu đạo ngắn. UTI không điều trị có thể tiến triển thành viêm bể thận (pyelonephritis).',
      'Tỷ trọng nước tiểu (specific gravity): phản ánh khả năng cô đặc của thận và tình trạng hydrate. 1.010–1.030 là bình thường. <1.003 liên tục: thận không cô đặc được (đái tháo nhạt hoặc uống nhiều nước). >1.030 thường: mất nước. Đo tỷ trọng dạy được nhiều về tình trạng thủy điện giải.',
      'Cách lấy mẫu đúng: lấy giữa dòng (midstream clean-catch) — vệ sinh sạch vùng niệu đạo, bỏ phần nước tiểu đầu tiên, lấy phần giữa. Làm xét nghiệm trong 2 giờ sau khi lấy mẫu để tránh phân hủy. Phụ nữ nên tránh lấy mẫu trong kỳ kinh nguyệt.',
    ],
    points: [
      { icon: '🔍', label: 'Albumin niệu — dấu hiệu thận sớm', note: 'Xuất hiện 5–10 năm trước khi creatinine tăng ở tiểu đường' },
      { icon: '🩸', label: 'Máu niệu không đau → tầm soát ung thư', note: 'Đặc biệt >40 tuổi và hút thuốc — ung thư bàng quang' },
      { icon: '🧪', label: 'Lấy mẫu giữa dòng buổi sáng', note: 'Nước tiểu cô đặc nhất, ít nhiễu nhất để phân tích' },
      { icon: '💊', label: 'UTI cần điều trị kháng sinh đúng', note: 'Không tự dùng kháng sinh — cần cấy nước tiểu xác định vi khuẩn' },
    ],
  },
  {
    metric: 'ECG (trên 40 tuổi)', freq: '1 lần/năm từ 40 tuổi', tip: 'Điện tâm đồ lúc nghỉ — chụp hoạt động điện tim 10 giây',
    icon: '📈', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'ECG (electrocardiogram) là xét nghiệm không xâm lấn, nhanh (10 giây), không đau và rẻ tiền — nhưng có thể phát hiện rung nhĩ, block nhĩ thất, phì đại thất trái, thiếu máu cơ tim im lặng và các bất thường khác trước khi gây triệu chứng.',
    detail: 'Điện tâm đồ ghi lại hoạt động điện của tim qua 12 điện cực. Bác sĩ đọc ECG đánh giá nhịp tim, tần số, block dẫn truyền, phì đại buồng tim và dấu hiệu thiếu máu/nhồi máu. ECG nghỉ không phát hiện được bệnh mạch vành khi không đang thiếu máu — cần stress test để tầm soát đó.',
    details: [
      'Rung nhĩ (atrial fibrillation — AF): loạn nhịp tim phổ biến nhất, ảnh hưởng >33 triệu người toàn cầu. AF thường không có triệu chứng rõ ràng nhưng tăng nguy cơ đột quỵ gấp 5 lần (cục máu đông từ nhĩ trái di chuyển lên não). Phát hiện qua ECG → điều trị anticoagulant giảm 60–70% nguy cơ đột quỵ.',
      'Block nhĩ thất (AV block): chậm trễ hoặc gián đoạn dẫn truyền điện từ nhĩ xuống thất. Block độ 1 và 2 type 1 thường lành tính. Block độ 2 type 2 và block độ 3 (complete heart block) cần can thiệp — đặt máy tạo nhịp.',
      'Phì đại thất trái (LVH): dấu hiệu tăng huyết áp lâu dài không kiểm soát. Tim phải bơm mạnh hơn → cơ thất trái dày lên → tăng nguy cơ suy tim và loạn nhịp. LVH trên ECG là yếu tố nguy cơ tim mạch độc lập.',
      'Bất thường ST-T: có thể gợi ý thiếu máu cơ tim im lặng (silent ischemia) — một số người bệnh mạch vành không có đau ngực điển hình, đặc biệt người tiểu đường và phụ nữ. Cần đánh giá thêm bằng stress test hoặc CT mạch vành.',
      'Hội chứng Wolff-Parkinson-White (WPW) và hội chứng Brugada: bất thường dẫn truyền bẩm sinh có thể gây đột tử tim (sudden cardiac death) ở người trẻ và người tập luyện cường độ cao. ECG có thể phát hiện pattern đặc trưng — quan trọng cho người chơi thể thao cường độ cao.',
      'ECG nghỉ so với stress test: ECG nghỉ phát hiện bất thường cấu trúc và nhịp tim nhưng không phát hiện bệnh mạch vành khi đang tưới máu tốt lúc nghỉ. Stress test (ECG trong khi đi thảm lăn hoặc tiêm dobutamine) phát hiện thiếu máu khi tim cần tăng cung cấp oxy. Chỉ định stress test: đau ngực khi gắng sức, nhiều yếu tố nguy cơ tim mạch.',
    ],
    points: [
      { icon: '💗', label: 'Phát hiện rung nhĩ im lặng', note: 'AF không triệu chứng tăng nguy cơ đột quỵ gấp 5 lần — cần anticoagulant' },
      { icon: '📊', label: 'LVH = dấu hiệu tăng HA lâu dài', note: 'Thành thất trái dày → nguy cơ suy tim và loạn nhịp' },
      { icon: '🏃', label: 'ECG nghỉ ≠ loại trừ bệnh mạch vành', note: 'Cần stress test để phát hiện thiếu máu khi gắng sức' },
      { icon: '⚡', label: 'WPW và Brugada ở người trẻ', note: 'Đột tử tim ở vận động viên trẻ — cần tầm soát ECG trước thi đấu' },
    ],
  },
];

const CHECK_EXPANDED = [
  {
    metric: 'Thừa cân / béo bụng', freq: 'Bổ sung thêm vào gói cơ bản', tip: 'Vòng eo lớn kèm BMI >23 là chỉ định rõ ràng',
    icon: '⚖️', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    items: ['HbA1c', 'Mỡ máu đầy đủ', 'Men gan', 'Acid uric', 'Siêu âm gan (nếu cần)'],
    keyFact: 'Béo bụng là yếu tố nguy cơ độc lập cho 5 nhóm bệnh: tiểu đường type 2, tim mạch, gan nhiễm mỡ, gout và ung thư (đại tràng, vú, nội mạc tử cung). Các xét nghiệm mở rộng này bắt đầu theo dõi khi vòng eo vượt ngưỡng — ngay cả khi chưa có triệu chứng.',
    detail: 'Người béo bụng cần đánh giá toàn diện hội chứng chuyển hóa. Không cần đợi đến khi có triệu chứng — phát hiện sớm giai đoạn tiền bệnh giúp đảo ngược bằng lối sống trước khi cần thuốc.',
    details: [
      'HbA1c tầm soát tiền tiểu đường: người béo bụng có nguy cơ tiền tiểu đường cao gấp 3–5 lần. HbA1c 5.7–6.4% = tiền tiểu đường — giai đoạn hoàn toàn đảo ngược bằng giảm cân và vận động. Đợi đến HbA1c ≥6.5% (tiểu đường) thì can thiệp tốn kém và ít hiệu quả hơn.',
      'Mỡ máu đầy đủ (full lipid panel): người béo bụng thường có triglycerides cao, HDL thấp, LDL nhỏ dày (small dense LDL — xâm nhập thành mạch dễ hơn). Bộ mỡ máu đầy đủ bao gồm: TC, LDL, HDL, TG, non-HDL và apoB (nếu có thể).',
      'AST/ALT và siêu âm gan: gan nhiễm mỡ không do rượu (NAFLD) gặp ở 50–75% người béo bụng. ALT tăng nhẹ kèm siêu âm gan echo dày là chẩn đoán NAFLD. Điều trị hiệu quả nhất: giảm 7–10% cân nặng — giảm viêm gan và ngăn tiến triển sang xơ gan.',
      'Acid uric: mỡ bụng tăng → tăng tổng hợp acid uric và giảm đào thải qua thận. Acid uric cao (>420 µmol/L nam, >360 µmol/L nữ) → gout và sỏi thận. Cắt đường fructose (nước ngọt) và rượu là biện pháp hàng đầu giảm acid uric không cần thuốc.',
      'Siêu âm bụng tổng quát (nếu cần): đánh giá độ echo gan (gan nhiễm mỡ), kích thước thận, sỏi mật và sỏi thận, u nang buồng trứng (phụ nữ với PCOS hay kèm béo phì). Siêu âm không dùng tia X, an toàn, thông tin nhiều cho một buổi khám.',
      'Insulin và HOMA-IR (nếu có điều kiện): insulin đói và glucose đói → tính HOMA-IR (đề kháng insulin). HOMA-IR >2.5 = đề kháng insulin đáng kể ngay cả khi đường huyết còn bình thường. Phát hiện sớm nhất giai đoạn trước tiền tiểu đường — nhưng xét nghiệm này không phổ biến trong tầm soát thường quy.',
    ],
    points: [
      { icon: '🍬', label: 'HbA1c phát hiện tiền tiểu đường', note: '5.7–6.4% = có thể đảo ngược — đừng đợi đến 6.5%' },
      { icon: '🫀', label: 'TG cao + HDL thấp = nguy hiểm', note: 'Bộ mỡ máu béo bụng đặc trưng — không nhìn LDL đơn thuần' },
      { icon: '🫁', label: 'NAFLD điều trị bằng giảm cân', note: 'Giảm 7–10% cân → giảm viêm gan rõ rệt trong 6 tháng' },
      { icon: '🍺', label: 'Cắt đường + rượu → giảm acid uric', note: 'Fructose trong nước ngọt là nguyên nhân phổ biến nhất' },
    ],
  },
  {
    metric: 'Tăng huyết áp / nguy cơ tim mạch', freq: 'Theo dõi sát — 3–6 tháng/lần', tip: 'Gói đánh giá nguy cơ tim mạch 10 năm toàn diện',
    icon: '❤️', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80&auto=format&fit=crop',
    items: ['Nhật ký huyết áp 7 ngày', 'Chức năng thận + điện giải', 'ECG / Holter', 'Đánh giá nguy cơ tim mạch 10 năm'],
    keyFact: 'Tăng huyết áp không chỉ cần đo huyết áp — cần đánh giá tổng thể tổn thương cơ quan đích (thận, tim, mắt) và tính nguy cơ tim mạch 10 năm để quyết định mức độ điều trị tích cực. Người huyết áp nhẹ nhưng nguy cơ 10 năm >10% cần điều trị sớm hơn.',
    detail: 'Tăng huyết áp không điều trị đúng gây tổn thương nhiều cơ quan theo thời gian — tim (LVH, suy tim), thận (CKD), não (đột quỵ) và mắt (bệnh võng mạc). Đánh giá toàn diện giúp bác sĩ quyết định mức độ điều trị phù hợp.',
    details: [
      'Nhật ký huyết áp 7 ngày (home BP monitoring): đo sáng + tối, 2 lần mỗi buổi, cách nhau 1 phút. Lấy trung bình tất cả các lần đo trong 7 ngày (bỏ ngày đầu). Huyết áp tại nhà <135/85 = bình thường. Phân biệt white coat hypertension (cao phòng khám, bình thường tại nhà) với masked hypertension (bình thường phòng khám, cao tại nhà — nguy hiểm hơn).',
      'Chức năng thận và điện giải: tăng huyết áp gây và gây ra bởi bệnh thận (vòng luẩn quẩn). Kiểm tra: creatinine, eGFR (bảo thận), kali và natri (điện giải — quan trọng khi dùng thuốc huyết áp, đặc biệt lợi tiểu và ACE inhibitor/ARB), albumin niệu (tổn thương thận sớm).',
      'ECG tầm soát LVH và loạn nhịp: tăng huyết áp lâu dài → phì đại thất trái (LVH) trên ECG. LVH là yếu tố nguy cơ tim mạch độc lập và là dấu hiệu tăng huyết áp chưa được kiểm soát đủ. Holter 24h khi nghi ngờ loạn nhịp hoặc huyết áp biến động nhiều ban đêm.',
      'Nguy cơ tim mạch 10 năm: Framingham Risk Score hoặc SCORE2 (châu Âu) tính nguy cơ nhồi máu cơ tim/đột quỵ 10 năm dựa trên tuổi, giới, huyết áp, cholesterol, tiểu đường, hút thuốc. Nguy cơ >10% = cần điều trị tích cực hơn (mục tiêu HA thấp hơn, statin nếu LDL tăng).',
      'Tầm soát hẹp động mạch thận (renal artery stenosis): nguyên nhân thứ phát của tăng huyết áp — tăng huyết áp khó kiểm soát dù dùng 3 thuốc, tăng creatinine đột ngột khi dùng ACE inhibitor/ARB, chênh lệch kích thước 2 thận trên siêu âm. Siêu âm Doppler mạch thận là bước tầm soát đầu tiên.',
      'Siêu âm tim (echocardiography): đánh giá trực tiếp độ dày thành thất trái (LVH), chức năng co bóp thất trái (EF) và diastolic dysfunction. Cần thiết khi: ECG có dấu hiệu LVH, có triệu chứng suy tim, trước khi bắt đầu hoặc thay đổi phác đồ điều trị tăng huyết áp nặng.',
    ],
    points: [
      { icon: '🏠', label: 'Nhật ký HA 7 ngày — vàng chuẩn', note: 'Phân biệt white coat và masked hypertension — cả 2 cần điều trị khác nhau' },
      { icon: '🧮', label: 'Tính nguy cơ 10 năm', note: 'HA nhẹ + nhiều yếu tố nguy cơ = cần điều trị tích cực hơn' },
      { icon: '🫀', label: 'LVH trên ECG = HA chưa đủ kiểm soát', note: 'Phì đại thất trái là dấu hiệu tổn thương cơ quan đích' },
      { icon: '🩺', label: 'Kiểm tra thận + điện giải khi dùng thuốc', note: 'ACE inhibitor/ARB và lợi tiểu ảnh hưởng kali và thận' },
    ],
  },
  {
    metric: 'Người tập luyện nhiều', freq: '1–2 lần/năm hoặc khi có triệu chứng bất thường', tip: 'Tập >10h/tuần hoặc thi đấu thể thao cần đánh giá riêng',
    icon: '🏃', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    items: ['Ferritin, Vitamin D', 'CK (creatine kinase)', 'Tư vấn phục hồi, overtraining', 'Tim mạch nếu có triệu chứng bất thường'],
    keyFact: 'Người tập luyện cường độ cao có nguy cơ riêng: thiếu sắt tiềm ẩn (foot strike hemolysis, sweating losses), thiếu vitamin D dù tập ngoài trời, và hội chứng overtraining (nRAR — nonfunctional overreaching) khi tải tập vượt khả năng phục hồi. Xét nghiệm định kỳ giúp tối ưu hiệu suất và phòng chấn thương.',
    detail: 'Paradox của người tập nhiều: hoạt động thể chất cao bảo vệ sức khỏe tổng thể nhưng cũng tạo ra stress sinh lý đặc thù. Thiếu vi chất, overtraining và bất thường tim mạch không phát hiện là nguyên nhân hàng đầu chấn thương và đột tử thể thao.',
    details: [
      'Ferritin và thiếu sắt: vận động viên có nhu cầu sắt cao hơn 70% so với người bình thường (hemolysis, mất qua mồ hôi, viêm vi thể đường tiêu hóa). Ferritin <30 ng/mL = thiếu sắt tiềm ẩn dù hemoglobin bình thường → giảm hiệu suất, mệt mỏi, recovery kém. Bổ sung sắt khi ferritin <30–50 ng/mL và có triệu chứng.',
      'Vitamin D: vai trò trong sức mạnh cơ, phục hồi, miễn dịch và hấp thu canxi cho xương. Tập trong nhà, dùng kem chống nắng và tập sáng sớm/chiều tối làm giảm tổng hợp D qua da. Mục tiêu 25-OH-D: >50 nmol/L (20 ng/mL) tối thiểu; >75 nmol/L (30 ng/mL) tối ưu cho vận động viên.',
      'CK (creatine kinase): enzyme trong cơ, tăng sau tập cường độ cao (DOMS — delayed onset muscle soreness). CK bình thường vận động viên có thể cao hơn người thường 2–3 lần. CK >10 lần giới hạn trên bình thường kèm nước tiểu màu cola = rhabdomyolysis (tiêu cơ vân cấp) — cần nhập viện ngay, bù dịch mạnh.',
      'Hội chứng overtraining (OTS): khối lượng tập vượt khả năng phục hồi kéo dài → suy giảm hiệu suất kéo dài ≥2 tháng dù nghỉ ngơi. Triệu chứng: mệt mỏi mạn, mất hứng thú, ngủ kém, tâm trạng tiêu cực, nhịp tim nghỉ tăng, HRV giảm. Không có xét nghiệm đặc hiệu — chẩn đoán dựa trên lâm sàng và loại trừ.',
      'Bất thường tim mạch ở vận động viên: tim vận động viên (athlete\'s heart) — phì đại sinh lý lành tính. Phân biệt với bệnh cơ tim phì đại (HCM — nguyên nhân hàng đầu đột tử ở vận động viên trẻ). Chỉ định siêu âm tim khi: đau ngực khi gắng sức, ngất khi tập, gia đình có đột tử tim sớm, nghi loạn nhịp.',
      'ECG tầm soát trước thi đấu: nhiều quốc gia châu Âu và liên đoàn thể thao yêu cầu ECG 12 chuyển đạo trước khi tham gia thi đấu cạnh tranh. ECG phát hiện WPW, hội chứng Brugada, LQTS và dấu hiệu HCM — có thể cứu sống vận động viên trẻ.',
    ],
    points: [
      { icon: '🩸', label: 'Ferritin <30 ng/mL = thiếu sắt', note: 'Dù hemoglobin bình thường — ảnh hưởng hiệu suất và recovery' },
      { icon: '☀️', label: 'Vitamin D >75 nmol/L tối ưu', note: 'Sức mạnh cơ, miễn dịch và xương — vận động viên cần mức cao hơn' },
      { icon: '📉', label: 'Giảm hiệu suất >2 tháng = OTS', note: 'Nghỉ ngơi + giảm khối lượng — không thể "tập luyện qua"' },
      { icon: '❤️', label: 'ECG trước thi đấu cạnh tranh', note: 'Phát hiện WPW, HCM và Brugada — nguyên nhân đột tử thể thao' },
    ],
  },
];

function TabE5() {
  const { t: tCommon } = useTranslation('common');
  const { t: tP } = useTranslation('pillars');
  const pillarE = tP('pillarE', { returnObjects: true });
  const basicTr = Array.isArray(pillarE?.e_check_basic) ? pillarE.e_check_basic : [];
  const BASIC = CHECK_BASIC.map((s, i) => ({ ...s, ...(basicTr[i] || {}) }));
  const expandTr = Array.isArray(pillarE?.e_check_expanded) ? pillarE.e_check_expanded : [];
  const EXPANDED = CHECK_EXPANDED.map((s, i) => ({ ...s, ...(expandTr[i] || {}) }));
  const [basicModal, setBasicModal] = useState(null);
  const [expandedModal, setExpandedModal] = useState(null);
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-text text-lg mb-1">{pillarE?.e_tab5_h1 || 'Gói Kiểm Tra Nền (Health Check Basic)'}</h3>
        <p className="text-xs text-muted opacity-60 mb-3">{pillarE?.e_tab5_hint1 || 'Nhấp vào từng mục để xem chi tiết và ý nghĩa xét nghiệm'}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {BASIC.map((b, i) => (
            <div key={b.metric}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-base text-muted cursor-pointer transition-all duration-200 hover:text-text"
              onClick={() => setBasicModal(i)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(132,204,22,0.45)'; e.currentTarget.style.background = 'rgba(132,204,22,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>
              <span className="text-lg shrink-0">{b.icon}</span>
              <span className="flex-1">{b.metric}</span>
              <span className="text-[9px] font-bold shrink-0" style={{ color: '#84cc16' }}>→</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold text-text text-lg mb-1">{pillarE?.e_tab5_h2 || 'Mở Rộng Theo Nguy Cơ'}</h3>
        <p className="text-xs text-muted opacity-60 mb-3">{pillarE?.e_tab5_hint2 || 'Nhấp vào từng nhóm để xem danh sách xét nghiệm bổ sung'}</p>
        <div className="space-y-3">
          {EXPANDED.map((g, i) => (
            <div key={g.metric}
              className="rounded-xl border border-border bg-surface/60 p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
              onClick={() => setExpandedModal(i)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.45)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-bold flex items-center gap-2" style={{ color: g.color }}>
                  <span>{g.icon}</span>+ {g.metric}
                </p>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border shrink-0"
                  style={{ color: g.color, borderColor: `rgba(${g.rgb},0.35)`, background: `rgba(${g.rgb},0.08)` }}>{tCommon('modal.see_detail')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map(it => <span key={it} className="text-base text-muted px-2 py-0.5 rounded-full border border-border">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-base text-muted">{pillarE?.e_tab5_note || 'Khám định kỳ không nên là "gói xét nghiệm càng nhiều càng tốt" — nên dựa trên tuổi, nguy cơ và triệu chứng của từng người.'}</p>
      {basicModal !== null && (
        <ScheduleModal
          item={BASIC[basicModal]}
          idx={basicModal} total={BASIC.length}
          onClose={() => setBasicModal(null)}
          onPrev={() => setBasicModal(i => Math.max(0, i - 1))}
          onNext={() => setBasicModal(i => Math.min(BASIC.length - 1, i + 1))}
          hasPrev={basicModal > 0} hasNext={basicModal < BASIC.length - 1}
        />
      )}
      {expandedModal !== null && (
        <ScheduleModal
          item={EXPANDED[expandedModal]}
          idx={expandedModal} total={EXPANDED.length}
          onClose={() => setExpandedModal(null)}
          onPrev={() => setExpandedModal(i => Math.max(0, i - 1))}
          onNext={() => setExpandedModal(i => Math.min(EXPANDED.length - 1, i + 1))}
          hasPrev={expandedModal > 0} hasNext={expandedModal < EXPANDED.length - 1}
        />
      )}
    </div>
  );
}

const DRUG_RULES = [
  {
    metric: 'Không tự ngưng thuốc bác sĩ kê', freq: 'Quy tắc #1', tip: 'Luôn hỏi bác sĩ trước khi ngưng — kể cả khi thấy "đã khỏe"',
    icon: '💊', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngưng thuốc đột ngột có thể nguy hiểm hơn chưa từng dùng thuốc — đặc biệt corticoid, beta-blocker, thuốc tâm thần và chống động kinh. Cơ thể thích nghi với thuốc theo thời gian và cần giảm liều dần dần (tapering) để phục hồi an toàn.',
    detail: 'Nhiều người tự ý ngưng thuốc khi "thấy khỏe hơn" hoặc "ngại tác dụng phụ" mà không biết điều này có thể gây ra những hậu quả nghiêm trọng hơn cả bệnh ban đầu.',
    details: [
      'Corticosteroid (prednisone, methylprednisolone): dùng >2–3 tuần → tuyến thượng thận ức chế, giảm sản xuất cortisol nội sinh. Ngưng đột ngột → suy tuyến thượng thận cấp (adrenal crisis): tụt huyết áp, nôn, mất ý thức — đe dọa tính mạng. Phải giảm liều dần trong nhiều tuần.',
      'Beta-blocker (metoprolol, atenolol — thuốc huyết áp/tim): ngưng đột ngột → rebound tachycardia và tăng huyết áp vọt. Nguy hiểm đặc biệt với người bệnh mạch vành — có thể kích hoạt cơn đau thắt ngực hoặc nhồi máu cơ tim.',
      'Thuốc chống động kinh (phenytoin, valproate, carbamazepine, levetiracetam): ngưng đột ngột → hạ ngưỡng co giật → cơn động kinh nặng (status epilepticus) — co giật liên tục >30 phút gây tổn thương não vĩnh viễn và tử vong.',
      'Thuốc trầm cảm/lo âu (SSRI, SNRI như sertraline, escitalopram, venlafaxine): ngưng đột ngột → discontinuation syndrome: chóng mặt, cảm giác "điện giật" trong đầu, buồn nôn, lo âu bùng phát, mất ngủ. Phải giảm liều dần trong 2–4 tuần.',
      'Kháng sinh: ngưng trước khi hết liệu trình khi "thấy đỡ" → vi khuẩn chưa tiêu diệt hoàn toàn, những con kháng thuốc còn sót lại nhân lên → nhiễm trùng tái phát với chủng kháng thuốc khó điều trị hơn. Đây là nguyên nhân chính của kháng kháng sinh toàn cầu.',
      'Thuốc "an toàn" cũng cần thận trọng khi ngưng: aspirin liều thấp (ngưng đột ngột có thể tăng nguy cơ huyết khối tạm thời — rebound platelet activation). Insulin và thuốc tiểu đường (ngưng đột ngột → đường huyết mất kiểm soát). Thuốc tuyến giáp (ngưng → suy giáp trở lại trong vài tuần).',
    ],
    points: [
      { icon: '⚕️', label: 'Hỏi bác sĩ trước khi ngưng', note: '"Thuốc tôi có thể ngưng được không?" là câu hỏi hoàn toàn hợp lý' },
      { icon: '⚠️', label: 'Corticoid ngưng đột ngột = nguy hiểm', note: 'Suy tuyến thượng thận cấp nếu dùng >2–3 tuần rồi ngưng ngay' },
      { icon: '💊', label: 'Kháng sinh uống hết liệu trình', note: 'Ngưng sớm → tạo vi khuẩn kháng thuốc — nguy hại cả cộng đồng' },
      { icon: '📋', label: 'Ghi nhật ký thuốc đang dùng', note: 'Tên, liều, lý do — mang khi đi khám bất kỳ chuyên khoa nào' },
    ],
  },
  {
    metric: 'Không tự tăng/giảm liều', freq: 'Quy tắc #2', tip: 'Liều được tính theo cân nặng, chức năng gan/thận và bệnh đi kèm',
    icon: '⚖️', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Liều thuốc không phải con số tùy ý — được tính toán dựa trên dược động học (pharmacokinetics): cân nặng, tuổi, chức năng thận và gan, tương tác thuốc. Tự thay đổi liều có thể gây ngộ độc (quá liều) hoặc mất tác dụng (dưới liều điều trị).',
    detail: 'Khái niệm "cửa sổ điều trị" (therapeutic window): khoảng nồng độ thuốc trong máu đủ để có tác dụng nhưng chưa gây độc. Một số thuốc có cửa sổ rất hẹp — thay đổi 20–30% liều đã vượt giới hạn an toàn.',
    details: [
      'Paracetamol — thuốc "vô hại" dễ quá liều nhất: liều an toàn <4g/ngày với người khỏe mạnh. Uống >7.5–10g một lần → hoại tử gan cấp. Người uống rượu thường xuyên, suy dinh dưỡng hoặc suy gan → ngưỡng an toàn chỉ còn <2g/ngày. Lưu ý: nhiều thuốc cảm cúm combo đã chứa paracetamol — cộng dồn dễ vượt ngưỡng.',
      'Thuốc có cửa sổ điều trị hẹp (narrow therapeutic index — NTI): digoxin (tim), warfarin (chống đông), lithium (tâm thần), phenytoin (động kinh), aminoglycosides (kháng sinh tiêm), cyclosporine (ức chế miễn dịch). Chênh lệch 20% liều = nguy cơ ngộ độc hoặc mất hiệu quả. Cần đo nồng độ thuốc trong máu (TDM — therapeutic drug monitoring).',
      'Insulin và thuốc tiểu đường: tăng liều insulin mà không kiểm tra đường huyết → hạ đường huyết nặng (seizure, hôn mê). Giảm liều khi "thấy đường huyết tốt" → mất kiểm soát, tiến triển biến chứng. HbA1c là xét nghiệm đánh giá kiểm soát dài hạn — không phải một lần đo tại nhà.',
      'Kháng sinh dưới liều: nồng độ thuốc không đủ tiêu diệt vi khuẩn → chọn lọc chủng kháng thuốc. Đây là cơ chế chính tạo ra superbug (vi khuẩn siêu kháng thuốc). Một quyết định cá nhân (giảm liều) tạo ra hệ quả cộng đồng nghiêm trọng.',
      'Vitamin và khoáng chất cũng có liều độc: vitamin D >4000 IU/ngày dài hạn → tăng canxi máu → sỏi thận, vôi hóa mạch. Vitamin A >3000 µg/ngày (thai phụ) → dị tật thai nhi. Sắt quá liều → ngộ độc sắt đặc biệt ở trẻ em. Không có nghĩa là "vitamin tự nhiên, uống nhiều không sao".',
      'Aspirin: liều thấp (75–100 mg) dùng cho tim mạch. Liều trung bình (325 mg) cho giảm đau. Liều cao (>500 mg) chống viêm. Tự tăng lên liều cao không có chỉ định → tăng nguy cơ chảy máu tiêu hóa và xuất huyết não mà không tăng thêm lợi ích tim mạch.',
    ],
    points: [
      { icon: '🎯', label: 'Paracetamol <4g/ngày tối đa', note: 'Uống rượu hoặc suy gan → giới hạn còn <2g — kiểm tra thuốc combo' },
      { icon: '🧪', label: 'Thuốc NTI cần đo nồng độ máu', note: 'Digoxin, warfarin, lithium — liều phải dựa trên kết quả xét nghiệm' },
      { icon: '💉', label: 'Insulin: đo đường trước khi điều chỉnh', note: 'Không tăng liều "cảm giác" — hạ đường huyết nặng gây hôn mê' },
      { icon: '🌿', label: 'Vitamin cũng có liều độc', note: 'D >4000 IU/ngày dài hạn → sỏi thận. A nhiều → dị tật thai nhi' },
    ],
  },
  {
    metric: 'Không dùng đơn thuốc của người khác', freq: 'Quy tắc #3', tip: 'Thuốc phù hợp với người này có thể gây nguy hiểm cho người khác',
    icon: '🚫', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hai người có triệu chứng giống nhau nhưng nguyên nhân khác nhau cần thuốc hoàn toàn khác nhau. Dùng thuốc kháng sinh "của bạn" khi bị viêm họng không phân biệt được nguyên nhân virus hay vi khuẩn, đúng loại kháng sinh hay không, và có dị ứng hay không.',
    detail: 'Đơn thuốc là tài liệu y tế cá nhân hóa — được kê dựa trên chẩn đoán, tiền sử dị ứng, bệnh đi kèm, thuốc đang dùng và đặc điểm của từng bệnh nhân cụ thể. Không có hai người cần đúng thuốc như nhau dù triệu chứng có vẻ giống nhau.',
    details: [
      'Chẩn đoán giống nhưng nguyên nhân khác: "đau đầu" có thể do căng thẳng (paracetamol), migraine (sumatriptan), tăng huyết áp (không dùng NSAID — làm tăng HA thêm), u não (cần chẩn đoán hình ảnh). Dùng thuốc của người khác → điều trị sai nguyên nhân → bỏ lỡ bệnh nghiêm trọng.',
      'Dị ứng thuốc: penicillin và các cephalosporin dị ứng chéo → sốc phản vệ. Dị ứng sulfonamide → không dùng cotrimoxazole. Aspirin/NSAID → có thể gây hen dạng aspirin (aspirin-exacerbated respiratory disease) ở 10% người hen phế quản. Không ai biết dị ứng của người khác.',
      'Tương tác thuốc: người đang dùng warfarin + dùng aspirin của bạn → tăng nguy cơ xuất huyết nghiêm trọng. Người dùng MAOI + dùng antidepressant của bạn → hội chứng serotonin nguy hiểm. Các tương tác này không ai biết nếu không biết đầy đủ danh sách thuốc của người đó.',
      'Liều khác nhau theo cân nặng, tuổi và chức năng thận: kháng sinh liều người lớn 70kg khác với người 50kg. Người suy thận phải giảm liều thuốc thải qua thận (aminoglycosides, metformin). Người cao tuổi nhạy cảm hơn với nhiều thuốc — liều người trẻ có thể gây ngộ độc.',
      'Kháng sinh "của bạn" khi bị cảm: 80–90% viêm đường hô hấp trên là do virus → kháng sinh hoàn toàn vô tác dụng. Dùng kháng sinh không cần thiết → diệt vi khuẩn có lợi trong đường ruột, tạo điều kiện Clostridioides difficile gây tiêu chảy nặng, và đóng góp vào kháng kháng sinh toàn cầu.',
      'Thuốc kê đơn không phải tự nhiên: corticoid, thuốc tâm thần, opioid, thuốc chống đông — được kê đơn vì cần theo dõi chặt chẽ. Dùng mà không có chỉ định và giám sát của bác sĩ có thể gây phụ thuộc, ngộ độc và biến chứng nghiêm trọng.',
    ],
    points: [
      { icon: '🧬', label: 'Cùng triệu chứng, khác nguyên nhân', note: '"Đau đầu" cần chẩn đoán — không phải cùng một loại thuốc' },
      { icon: '🚨', label: 'Dị ứng thuốc có thể gây sốc phản vệ', note: 'Penicillin, aspirin, sulfonamide — sốc phản vệ tử vong trong phút' },
      { icon: '🔗', label: 'Tương tác thuốc không thể đoán trước', note: 'Warfarin + aspirin → chảy máu. MAOI + SSRI → hội chứng serotonin' },
      { icon: '🦠', label: 'Kháng sinh khi cảm = vô tác dụng', note: '90% cảm cúm là virus — kháng sinh không diệt virus, chỉ hại ruột' },
    ],
  },
  {
    metric: 'Không phối hợp thực phẩm chức năng mà không biết thành phần', freq: 'Quy tắc #4', tip: 'TPCN có thể tương tác với thuốc kê đơn — nguy hiểm như tương tác thuốc-thuốc',
    icon: '🌿', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thực phẩm chức năng (TPCN) không phải "vô hại vì tự nhiên". St. John\'s Wort (cỏ Saint-John) giảm hiệu quả của thuốc tránh thai, thuốc chống HIV, thuốc ung thư và thuốc chống thải ghép — tất cả qua cùng một cơ chế cảm ứng enzyme CYP3A4.',
    detail: 'Thị trường TPCN trị giá >150 tỷ USD toàn cầu và được quản lý lỏng lẻo hơn nhiều so với thuốc. Nhà sản xuất không cần chứng minh hiệu quả trước khi bán — chỉ cần đảm bảo an toàn (và thực tế nhiều sản phẩm chưa được kiểm chứng đủ về an toàn).',
    details: [
      'St. John\'s Wort (Hypericum perforatum): thảo dược "chống trầm cảm tự nhiên" — cảm ứng CYP3A4 và P-glycoprotein → giảm nồng độ nhiều thuốc: thuốc tránh thai (mang thai ngoài ý muốn), cyclosporine (thải ghép tạng), indinavir (HIV), irinotecan (ung thư), warfarin (chống đông). Đây là tương tác thảo dược-thuốc nguy hiểm nhất được nghiên cứu rõ ràng.',
      'Grapefruit (bưởi chùm): ức chế CYP3A4 → tăng nồng độ nhiều thuốc lên 2–3 lần: statin (atorvastatin, simvastatin — tăng nguy cơ tiêu cơ vân), amiodarone, calcium channel blockers (thuốc huyết áp), thuốc chống đông thế hệ mới. Chỉ một ly nước bưởi ảnh hưởng 24–72h.',
      'Omega-3/fish oil liều cao: ở liều >3g EPA+DHA/ngày có tác dụng chống đông máu → khi kết hợp warfarin, aspirin, clopidogrel → tăng nguy cơ chảy máu đáng kể, đặc biệt trước phẫu thuật. Ngưng omega-3 trước phẫu thuật 1–2 tuần.',
      'Kẽm và kháng sinh: kẽm tạo phức với tetracycline và fluoroquinolone (ciprofloxacin) → giảm hấp thu kháng sinh đến 50–90%. Nếu cần cả hai → uống kháng sinh 2h trước hoặc 6h sau khi uống kẽm.',
      'Thảo dược có hoạt tính sinh học cao: tỏi liều cao (chống đông → cộng hưởng với warfarin), ginkgo biloba (chống đông + chống tiểu cầu), ginseng (ảnh hưởng đường huyết và warfarin), kava (độc gan + an thần → khuếch đại tác dụng thuốc ngủ/rượu). Nhiều tương tác chưa được nghiên cứu đủ.',
      'TPCN có thể chứa thành phần ẩn: phân tích 78 sản phẩm "tăng cường sinh lực" phát hiện sildenafil (Viagra) không khai báo. Sản phẩm "giảm cân thảo dược" chứa sibutramine (thuốc bị cấm do nguy cơ tim mạch). Sản phẩm "hạ đường" chứa glibenclamide (thuốc kê đơn gây hạ đường huyết nặng ở người không tiểu đường).',
    ],
    points: [
      { icon: '⚗️', label: 'St. John\'s Wort giảm thuốc tránh thai', note: 'Cảm ứng CYP3A4 — ảnh hưởng hàng chục loại thuốc kê đơn quan trọng' },
      { icon: '🍊', label: 'Bưởi chùm nguy hiểm với statin', note: '1 ly nước bưởi tăng nồng độ atorvastatin 2–3 lần → tiêu cơ vân' },
      { icon: '🐟', label: 'Omega-3 >3g/ngày tăng nguy cơ chảy máu', note: 'Ngưng 1–2 tuần trước phẫu thuật nếu đang uống kháng đông' },
      { icon: '🔍', label: 'Kiểm tra TPCN trên NIH Dietary Supplements', note: 'Cơ sở dữ liệu tương tác thuốc-TPCN uy tín của NIH, miễn phí' },
    ],
  },
  {
    metric: 'Không tin quảng cáo "chữa dứt điểm", "thải độc", "hết tiểu đường vĩnh viễn"', freq: 'Quy tắc #5', tip: 'Nếu nghe quá hay — đó là dấu hiệu cảnh báo, không phải cơ hội',
    icon: '🚨', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không có loại thuốc hoặc TPCN nào "chữa khỏi hoàn toàn" tiểu đường type 2, tăng huyết áp mạn tính, viêm khớp hay ung thư. Những tuyên bố này vi phạm luật quảng cáo tại Việt Nam — và dấu hiệu của sản phẩm giả mạo hoặc kém chất lượng.',
    detail: 'Ngành công nghiệp TPCN và thuốc "dân gian" khai thác nỗi sợ hãi, hy vọng và thiếu thông tin của người bệnh và gia đình họ. Mỗi năm hàng nghìn tỷ đồng bị lãng phí vào sản phẩm vô tác dụng — trong khi bệnh thật sự không được điều trị đúng cách.',
    details: [
      '"Thải độc" (detox): gan và thận là hệ thống thải độc tự nhiên của cơ thể hoạt động 24/7. Không có bằng chứng khoa học nào ủng hộ việc "thải độc bổ sung" qua TPCN, nước ép detox hoặc enema. Nếu gan thận hoạt động bình thường → không cần detox. Nếu không hoạt động bình thường → cần điều trị y khoa, không phải TPCN.',
      '"Hết tiểu đường vĩnh viễn": tiểu đường type 2 có thể đạt remission (lui bệnh) qua giảm cân đáng kể (>15kg, phẫu thuật bariatric) và thay đổi lối sống triệt để — không phải qua TPCN. Tiểu đường type 1 là bệnh tự miễn không thể "chữa dứt điểm" bằng bất kỳ phương pháp nào hiện có.',
      '"Không tác dụng phụ": mọi chất có tác dụng sinh học đều có thể có tác dụng phụ ở liều đủ cao hoặc với một số người nhạy cảm. Tuyên bố "hoàn toàn không tác dụng phụ" hoặc là không đúng sự thật hoặc là sản phẩm không có tác dụng gì cả.',
      '"Chữa khỏi 100%": không có phương pháp điều trị nào có hiệu quả 100% với tất cả mọi người — ngay cả thuốc được chứng minh lâm sàng chặt chẽ. Tuyên bố 100% là vi phạm quy định quảng cáo y tế tại Việt Nam (Nghị định 181/2013/NĐ-CP và Thông tư 09/2015).',
      'Nhận biết quảng cáo lừa đảo: người nổi tiếng hoặc "bác sĩ" chứng thực không đủ cơ sở. Kết quả chứng thực cá nhân (testimonial) không phải bằng chứng khoa học. Áp lực thời gian ("mua ngay hôm nay", "số lượng có hạn"). Tuyên bố điều trị nhiều bệnh khác nhau cùng lúc. Không có thông tin liên hệ rõ ràng.',
      'Khi muốn thử phương pháp bổ sung: tìm hiểu trên Pubmed (cơ sở dữ liệu nghiên cứu khoa học), hỏi bác sĩ hoặc dược sĩ, kiểm tra sản phẩm có đăng ký cục ATTP không. Tích hợp với điều trị y khoa chuẩn mực — không thay thế. Thông báo bác sĩ mọi TPCN đang dùng để phát hiện tương tác.',
    ],
    points: [
      { icon: '🧪', label: '"Thải độc" là pseudoscience', note: 'Gan + thận làm điều này 24/7 — không TPCN nào làm tốt hơn' },
      { icon: '📊', label: 'Tìm bằng chứng trên PubMed', note: 'Nghiên cứu ngẫu nhiên có đối chứng (RCT) — tiêu chuẩn vàng y học' },
      { icon: '🏥', label: 'TPCN bổ trợ — không thay thế điều trị', note: 'Dùng song song với thuốc bác sĩ kê — không ngưng thuốc để dùng TPCN' },
      { icon: '⚖️', label: 'Tuyên bố "100%" = vi phạm pháp luật', note: 'Báo cáo quảng cáo sai sự thật cho Cục ATTP — 1800 6838' },
    ],
  },
];

const SUPPLEMENT_CHECKS = [
  {
    metric: 'Tôi dùng để làm gì? Có bằng chứng rõ không?', freq: 'Câu hỏi #1', tip: 'Bằng chứng cấp độ cao nhất: RCT đa trung tâm, meta-analysis',
    icon: '🎯', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phần lớn TPCN được bán ra với bằng chứng hiệu quả rất yếu hoặc không có. Biết mình dùng để làm gì và liệu có bằng chứng khoa học ủng hộ là bước đầu tiên quan trọng nhất để quyết định có nên dùng không.',
    detail: 'Bằng chứng khoa học có thứ bậc rõ ràng. Cảm nhận cá nhân và chứng thực của người nổi tiếng nằm ở đáy kim tự tháp — ít đáng tin nhất. Thử nghiệm ngẫu nhiên có đối chứng (RCT) và meta-analysis tổng hợp nhiều nghiên cứu nằm ở đỉnh.',
    details: [
      'Kim tự tháp bằng chứng y học: (Cao → Thấp) Meta-analysis/Systematic review → Randomized Controlled Trial (RCT) → Cohort study → Case-control study → Case report → Expert opinion → Testimonial/Anecdote. TPCN thường được quảng cáo dựa trên tầng thấp nhất.',
      'Câu hỏi cụ thể để đánh giá: Mục tiêu điều trị là gì (giảm cân, tăng miễn dịch, ngủ ngon)? Có RCT nào trên người — không phải chuột hoặc ống nghiệm — chứng minh hiệu quả không? Hiệu quả có ý nghĩa lâm sàng không (không chỉ ý nghĩa thống kê)? Lợi ích vượt trội nguy cơ và chi phí không?',
      'Tìm kiếm bằng chứng: PubMed (pubmed.ncbi.nlm.nih.gov) — cơ sở dữ liệu nghiên cứu y tế miễn phí. Natural Medicines Database — cơ sở dữ liệu uy tín về TPCN và thảo dược. Cochrane Library — meta-analysis chất lượng cao. Tránh tìm kiếm trên Google — kết quả thường ưu tiên trang quảng cáo.',
      'TPCN có bằng chứng tốt: vitamin D (thiếu hụt thực sự), folate (phụ nữ trước mang thai), omega-3 (tim mạch ở một số nhóm), probiotics (một số chủng cho một số chỉ định cụ thể), sắt (thiếu máu thiếu sắt xác nhận). Không phải "uống cho chắc ăn" không có bằng chứng.',
      'TPCN được quảng cáo nhiều nhưng bằng chứng yếu: glucosamine/chondroitin (thoái hóa khớp — RCT lớn GAIT 2006 không cho thấy lợi ích rõ), collagen uống (không có bằng chứng đủ mạnh), "tăng cường miễn dịch" chung chung (hệ miễn dịch không cần "tăng cường" nếu hoạt động bình thường), detox/cleanse (không có bằng chứng).',
      'Placebo effect thực và mạnh: 30–40% người dùng TPCN có cảm giác "hiệu quả" — đây là hiệu ứng giả dược (placebo), đặc biệt với các triệu chứng chủ quan (mệt mỏi, đau, lo âu). Không có nghĩa sản phẩm có tác dụng sinh học — có nghĩa là não bộ phản ứng với kỳ vọng. RCT dùng nhóm đối chứng giả dược để phân biệt điều này.',
    ],
    points: [
      { icon: '📚', label: 'Tìm trên PubMed, không phải Google', note: 'pubmed.ncbi.nlm.nih.gov — nghiên cứu thật, không phải quảng cáo' },
      { icon: '🔬', label: 'RCT trên người — tiêu chuẩn tối thiểu', note: 'Nghiên cứu chuột/ống nghiệm không đủ cơ sở để dùng trên người' },
      { icon: '💡', label: '"Cảm thấy hiệu quả" có thể là placebo', note: '30–40% người dùng TPCN cảm thấy tốt hơn bất kể thành phần' },
      { icon: '✅', label: 'Vitamin D, folate, sắt — có bằng chứng', note: 'Nhưng chỉ khi có thiếu hụt xác nhận qua xét nghiệm — không dùng đại trà' },
    ],
  },
  {
    metric: 'Tôi có bệnh nền / đang dùng thuốc không?', freq: 'Câu hỏi #2', tip: 'Bệnh nền và thuốc kê đơn = phải hỏi bác sĩ trước khi dùng bất kỳ TPCN nào',
    icon: '🏥', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người có bệnh mạn tính đang dùng thuốc kê đơn là nhóm dễ bị ảnh hưởng nhất bởi tương tác TPCN-thuốc. Thống kê: 40–50% người dùng TPCN không thông báo cho bác sĩ biết, và bác sĩ không hỏi — đây là khoảng trống nguy hiểm.',
    detail: 'Người càng nhiều bệnh và nhiều thuốc thì tương tác càng phức tạp và càng khó dự đoán. Gan và thận bị ảnh hưởng bởi bệnh nền càng làm chậm chuyển hóa và thải thuốc, tăng nguy cơ ngộ độc.',
    details: [
      'Bệnh tim mạch và thuốc chống đông: warfarin, aspirin, clopidogrel, rivaroxaban tương tác với nhiều TPCN có tính chống đông (vitamin E liều cao, omega-3 liều cao, tỏi, ginkgo, ginger). Kết quả: tăng nguy cơ chảy máu nghiêm trọng — chảy máu não, xuất huyết tiêu hóa.',
      'Tiểu đường và thuốc hạ đường huyết: một số TPCN có tác dụng hạ đường huyết (cinnamon, chromium, gymnema, bitter melon) khi kết hợp metformin, sulfonylurea hoặc insulin → hạ đường huyết nặng. Người tiểu đường muốn dùng TPCN cần theo dõi đường huyết chặt hơn và thông báo bác sĩ.',
      'Bệnh gan và thận: đây là hai cơ quan chuyển hóa và thải trừ thuốc chính. Khi suy giảm chức năng → thuốc và TPCN tích lũy trong cơ thể → ngộ độc ở liều bình thường. Người suy thận đặc biệt phải tránh: thảo dược chứa kali cao (dandelion), NSAID tự mua, và nhiều kháng sinh.',
      'Phụ nữ mang thai và cho con bú: giai đoạn cần thận trọng nhất. Vitamin A >3000 µg/ngày gây dị tật thai nhi. St. John\'s Wort, kava, ma huang, blue cohosh chống chỉ định tuyệt đối trong thai kỳ. Gần như không có nghiên cứu RCT về TPCN trong thai kỳ — nguyên tắc: ít nhất là tốt nhất.',
      'Người cao tuổi (>65 tuổi): chuyển hóa thuốc chậm hơn, thường dùng nhiều thuốc (polypharmacy), dễ bị ngã do thuốc gây chóng mặt hoặc hạ huyết áp. Melatonin liều cao gây buồn ngủ ban ngày và tăng nguy cơ ngã. Valerian kết hợp benzodiazepine → an thần quá mức.',
      'Ung thư đang điều trị: tương tác TPCN-hóa chất trị liệu là vấn đề nghiêm trọng. Antioxidant liều cao (vitamin C, E, A) lý thuyết có thể giảm tác dụng của hóa trị và xạ trị hoạt động qua cơ chế tạo gốc tự do. St. John\'s Wort giảm nồng độ irinotecan và tamoxifen. Tuyệt đối phải thông báo bác sĩ ung thư trước khi dùng bất kỳ TPCN nào.',
    ],
    points: [
      { icon: '💊', label: 'Kể tên tất cả TPCN cho bác sĩ', note: '40–50% người dùng không thông báo — tạo ra khoảng trống nguy hiểm' },
      { icon: '🩸', label: 'Dùng thuốc chống đông = cảnh giác cao', note: 'Warfarin + omega-3/tỏi/ginkgo → tăng nguy cơ chảy máu' },
      { icon: '🤰', label: 'Thai kỳ: ít TPCN = tốt nhất', note: 'Gần như không có RCT trong thai kỳ — nguyên tắc tối thiểu hóa' },
      { icon: '🎗️', label: 'Ung thư: báo bác sĩ tất cả TPCN', note: 'Antioxidant liều cao có thể giảm hiệu quả hóa trị/xạ trị' },
    ],
  },
  {
    metric: 'Sản phẩm có nguồn gốc rõ không?', freq: 'Câu hỏi #3', tip: 'Tìm số đăng ký Cục ATTP và chứng nhận bên thứ ba (USP, NSF, ConsumerLab)',
    icon: '🔍', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không giống thuốc, TPCN tại hầu hết quốc gia không cần chứng minh hiệu quả hoặc an toàn trước khi bán. Nghiên cứu của ConsumerLab phát hiện 1/4 TPCN không chứa đúng lượng thành phần ghi trên nhãn — nhiều sản phẩm chứa thành phần ẩn nguy hiểm.',
    detail: 'Tại Việt Nam, TPCN phải đăng ký với Cục An toàn thực phẩm (Cục ATTP) nhưng không cần bằng chứng hiệu quả lâm sàng. Đăng ký chỉ xác nhận sản phẩm không có thành phần bị cấm — không xác nhận hiệu quả hay chất lượng.',
    details: [
      'Kiểm tra đăng ký Cục ATTP: tra cứu tại congkhaiyte.moh.gov.vn. Số đăng ký có dạng: XXXXX/2024/ĐKSP hoặc tương tự. Sản phẩm không có số đăng ký hoặc số giả → vi phạm pháp luật và tiềm ẩn nguy cơ cao. Đặc biệt cẩn thận với sản phẩm nhập khẩu không rõ nguồn gốc.',
      'Chứng nhận bên thứ ba (third-party certification): USP (US Pharmacopeia) và NSF International là hai tổ chức uy tín kiểm tra độc lập sản phẩm TPCN về: đúng thành phần ghi trên nhãn, không chứa chất bị cấm, không bị nhiễm kim loại nặng, vi sinh vật. ConsumerLab.com (mất phí) kiểm tra và so sánh sản phẩm.',
      'Dấu hiệu cảnh báo sản phẩm đáng ngờ: không có địa chỉ nhà sản xuất rõ ràng, không có số đăng ký, chỉ bán online qua mạng xã hội (không qua nhà thuốc hoặc chuỗi phân phối chính thức), giá rất rẻ so với sản phẩm tương tự, tuyên bố quá nhiều công dụng khác nhau, không có thông tin về thành phần đầy đủ.',
      'Thực phẩm chức năng nhiễm kim loại nặng: nghiên cứu Consumer Reports phát hiện nhiều thực phẩm bổ sung protein (protein powder), thảo dược và chất khoáng có chứa chì, thủy ngân, cadmium, asen vượt ngưỡng an toàn — đặc biệt sản phẩm giá rẻ nhập khẩu từ một số nguồn không được kiểm soát chặt.',
      'Sản phẩm dành cho vận động viên tăng nguy cơ doping: pre-workout, fat burner, testosterone booster từ một số nguồn có thể chứa stimulants bị cấm (ma huang/ephedra, DMAA, DMBA) hoặc anabolic steroids không khai báo. Vận động viên thi đấu có thể bị cấm thi đấu dù vô tình — WADA không chấp nhận lý do "không biết".',
      'Nơi mua đáng tin cậy: nhà thuốc có uy tín và được cấp phép, chuỗi phân phối chính thức (Long Châu, Pharmacity, An Khang), website chính thức của nhà sản xuất, siêu thị lớn. Tránh: mạng xã hội không rõ ràng, chợ online không kiểm soát (Shopee/Lazada cũng có sản phẩm giả), người bán dạo hoặc đa cấp.',
    ],
    points: [
      { icon: '🏛️', label: 'Tra số đăng ký Cục ATTP', note: 'congkhaiyte.moh.gov.vn — kiểm tra trước khi mua' },
      { icon: '✅', label: 'Tìm dấu USP hoặc NSF trên nhãn', note: 'Chứng nhận bên thứ ba = đúng thành phần, không chứa chất cấm' },
      { icon: '🚩', label: '6 dấu hiệu cảnh báo sản phẩm đáng ngờ', note: 'Không địa chỉ, chỉ bán mạng xã hội, giá rẻ bất thường, 10 công dụng' },
      { icon: '🏃', label: 'Pre-workout: nguy cơ doping', note: 'WADA không tha lý do "không biết" — kiểm tra tại Informed Sport' },
    ],
  },
  {
    metric: 'Có nguy cơ ảnh hưởng gan/thận không?', freq: 'Câu hỏi #4', tip: 'Thảo dược và TPCN "tự nhiên" là nguyên nhân DILI ngày càng tăng',
    icon: '⚠️', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Drug-Induced Liver Injury (DILI) do thảo dược và TPCN (HILI — Herb-Induced Liver Injury) chiếm 20% và đang tăng nhanh. Tại Mỹ, TPCN chiếm ~20% tổng số ca suy gan cấp nhập viện. Nhiều sản phẩm được xem là "tự nhiên và an toàn" nhưng có độc tính gan cao.',
    detail: 'Quan niệm "tự nhiên = an toàn" là sai lầm phổ biến và nguy hiểm. Nhiều chất độc mạnh nhất tự nhiên trên Trái Đất là chất tự nhiên (aconite, ricin, arsenic). Gan và thận phải xử lý tất cả những gì đi vào cơ thể — kể cả TPCN.',
    details: [
      'Thảo dược gây độc gan nổi tiếng: kava (Piper methysticum) — lo âu và mất ngủ → viêm gan nặng, vàng da, suy gan cấp. Bị cấm ở nhiều quốc gia châu Âu. Pyrrolizidine alkaloids (trong comfrey, borage, một số trà thảo dược) → tắc tĩnh mạch gan (SOS/VOD) — không hồi phục. Green tea extract liều cao (>800 mg EGCG/ngày) → viêm gan cấp.',
      'Thảo dược gây độc thận: aristolochic acid trong mộc thông (Aristolochia), phòng kỷ (Stephania) — gây xơ thận nhanh và tiến triển đến suy thận không hồi phục (aristolochic acid nephropathy). Crom picolinate liều cao dài hạn → tổn thương thận. Nhiều thảo dược chứa oxalate cao → sỏi thận canxi oxalate.',
      'Người có bệnh gan/thận từ trước cần cẩn thận hơn: chức năng gan/thận kém → thuốc và TPCN tích lũy → đạt ngưỡng độc ở liều bình thường. Viêm gan B mạn → gan nhạy cảm hơn với độc tính bổ sung. Suy thận CKD giai đoạn 3+ → tránh thảo dược giàu kali và oxalate.',
      'Sản phẩm giảm cân và tăng cơ tiềm ẩn nguy cơ cao: nhiều sản phẩm "giảm cân thảo dược" và "tăng cơ" bị phát hiện chứa các chất gây độc gan không khai báo: anabolic steroids, sibutramine (bị cấm), DNP (2,4-dinitrophenol — cực kỳ nguy hiểm). DNP làm tăng nhiệt độ cơ thể, gây sốt cao tử vong.',
      'Kiểm tra độc tính trước khi dùng: Natural Medicines Database (prescriber.naturalmediciners.com) đánh giá an toàn của hàng nghìn thảo dược và TPCN — có rating rõ ràng từ "Likely Safe" đến "Unsafe". NCCIH (National Center for Complementary and Integrative Health) của NIH cũng cung cấp thông tin đáng tin cậy.',
      'Dấu hiệu tổn thương gan cần khám ngay: vàng da, vàng mắt, nước tiểu màu nâu/coca-cola, phân nhạt màu, ngứa toàn thân, mệt mỏi tăng nhanh, đau tức vùng gan (hạ sườn phải). Ngưng ngay sản phẩm đang dùng và đến khám bác sĩ mang theo nhãn sản phẩm.',
    ],
    points: [
      { icon: '🫁', label: 'Kava + green tea extract = độc gan', note: 'HILI chiếm 20% DILI và đang tăng — "tự nhiên" không nghĩa là an toàn' },
      { icon: '🫘', label: 'Mộc thông/phòng kỷ → suy thận vĩnh viễn', note: 'Aristolochic acid nephropathy — không hồi phục, tiến đến lọc máu' },
      { icon: '📱', label: 'Tra Natural Medicines Database', note: 'Rating an toàn rõ ràng từ Likely Safe đến Unsafe — đáng tin cậy' },
      { icon: '🟡', label: 'Vàng da + nước tiểu sẫm = dừng TPCN ngay', note: 'Mang nhãn sản phẩm đến khám — giúp bác sĩ xác định nguyên nhân' },
    ],
  },
  {
    metric: 'Có được bác sĩ/dược sĩ tư vấn không?', freq: 'Câu hỏi #5', tip: 'Dược sĩ lâm sàng là chuyên gia tương tác thuốc-TPCN phù hợp nhất để hỏi',
    icon: '👨‍⚕️', color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 34% người dùng TPCN thông báo cho bác sĩ biết (NHIS survey). Trong khi đó 70% bác sĩ thừa nhận không tự động hỏi bệnh nhân về TPCN. Khoảng trống giao tiếp này là nguyên nhân của nhiều tương tác thuốc-TPCN nguy hiểm không được phát hiện.',
    detail: 'Tư vấn bác sĩ hoặc dược sĩ không chỉ là thủ tục — đây là bước kiểm tra an toàn quan trọng nhất. Dược sĩ lâm sàng được đào tạo đặc biệt về tương tác thuốc và là nguồn tư vấn TPCN phù hợp nhất, thậm chí tốt hơn bác sĩ trong nhiều trường hợp.',
    details: [
      'Vai trò của dược sĩ lâm sàng: được đào tạo về dược lý học, dược động học và tương tác thuốc sâu hơn nhiều bác sĩ. Kiểm tra tương tác thuốc-TPCN, đánh giá phù hợp với bệnh nền, tư vấn liều phù hợp, thời điểm uống và cách bảo quản. Dược sĩ nhà thuốc lớn có thể tra cứu tương tác qua phần mềm chuyên dụng.',
      'Những gì cần nói với bác sĩ/dược sĩ: danh sách đầy đủ tất cả thuốc kê đơn và TPCN đang dùng (kể cả "nhỏ" như aspirin 81mg, multivitamin). Sản phẩm TPCN muốn dùng mới. Bệnh nền và dị ứng. Tiền sử phản ứng bất thường với thuốc hoặc TPCN. Đang mang thai hoặc cho con bú.',
      'Nguồn thông tin đáng tin cho bác sĩ/dược sĩ tra cứu: Lexicomp, Micromedex và Natural Medicines Database là ba nguồn uy tín nhất về tương tác thuốc-TPCN dùng chuyên nghiệp. Medscape Drug Interaction Checker (miễn phí) cũng có tương tác thuốc-TPCN.',
      'Khi bác sĩ không có kiến thức về TPCN: không phải mọi bác sĩ đều có kiến thức sâu về TPCN — đây là lĩnh vực chuyên biệt. Có thể hỏi dược sĩ hoặc bác sĩ y học tích hợp (integrative medicine). Nguyên tắc quan trọng: bác sĩ chuyên khoa điều trị bệnh chính của bạn phải biết bạn đang dùng gì.',
      'Mua ở đâu cũng cần tư vấn: không phải chỉ cần tư vấn khi mua ở nhà thuốc. Mua online cũng cần tra cứu hoặc hỏi dược sĩ trước. Nhiều người mua TPCN online vì tiện hoặc rẻ hơn — nhưng mất đi bước kiểm tra quan trọng từ dược sĩ.',
      'Tư vấn định kỳ: danh sách TPCN nên được xem xét lại mỗi năm — tình trạng sức khỏe thay đổi, bệnh nền mới, thuốc mới → tương tác mới có thể xuất hiện. Đặc biệt khi bắt đầu thuốc mới → cần kiểm tra lại toàn bộ tương tác với TPCN đang dùng.',
    ],
    points: [
      { icon: '💬', label: 'Dược sĩ — chuyên gia tương tác tốt nhất', note: 'Được đào tạo sâu về tương tác thuốc hơn nhiều bác sĩ' },
      { icon: '📋', label: 'Mang danh sách đầy đủ khi tư vấn', note: 'Kể cả "nhỏ" như aspirin 81mg, vitamin C, omega-3 — tất cả đều quan trọng' },
      { icon: '🔄', label: 'Xem xét lại TPCN mỗi năm', note: 'Bệnh thay đổi → thuốc mới → tương tác mới — không set and forget' },
      { icon: '🌐', label: 'Medscape Drug Interaction Checker', note: 'Miễn phí, uy tín — tra cứu tương tác thuốc-TPCN trực tuyến' },
    ],
  },
];

function TabE6() {
  const { t: tP } = useTranslation('pillars');
  const pillarE = tP('pillarE', { returnObjects: true });
  const rulesTr = Array.isArray(pillarE?.e_drug_rules) ? pillarE.e_drug_rules : [];
  const RULES = DRUG_RULES.map((s, i) => ({ ...s, ...(rulesTr[i] || {}) }));
  const suppTr = Array.isArray(pillarE?.e_supplement_checks) ? pillarE.e_supplement_checks : [];
  const SUPPS = SUPPLEMENT_CHECKS.map((s, i) => ({ ...s, ...(suppTr[i] || {}) }));
  const [ruleModal, setRuleModal] = useState(null);
  const [checkModal, setCheckModal] = useState(null);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/08 p-5">
        <p className="text-lg font-bold text-violet-400 mb-1">{pillarE?.e_tab6_h1 || '5 Quy Tắc Không Của Thuốc'}</p>
        <p className="text-xs text-muted opacity-60 mb-3">{pillarE?.e_tab6_hint || 'Nhấp vào từng quy tắc để hiểu lý do và hậu quả'}</p>
        <ul className="space-y-2">
          {RULES.map((r, i) => (
            <li key={i}
              className="flex items-start gap-3 text-base text-muted rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 hover:text-text"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.10)' }}
              onClick={() => setRuleModal(i)}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.10)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.04)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.10)'; }}>
              <span className="font-black shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: 'rgba(139,92,246,0.18)', color: '#8b5cf6' }}>{i + 1}</span>
              <span className="flex-1">{r.metric}</span>
              <span className="text-[9px] font-bold shrink-0 mt-0.5" style={{ color: '#8b5cf6' }}>→</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-lg font-bold text-text mb-1">{pillarE?.e_tab6_h2 || 'Checklist Trước Khi Dùng Thực Phẩm Bổ Sung'}</p>
        <p className="text-xs text-muted opacity-60 mb-3">Nhấp vào từng câu hỏi để xem hướng dẫn chi tiết</p>
        <div className="space-y-2">
          {SUPPS.map((q, i) => (
            <div key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-3 text-base text-muted cursor-pointer transition-all duration-200 hover:text-text"
              onClick={() => setCheckModal(i)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.40)'; e.currentTarget.style.background = 'rgba(139,92,246,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}>
              <span className="font-black shrink-0 mt-0.5" style={{ color: '#8b5cf6' }}>?</span>
              <span className="flex-1">{q.metric}</span>
              <span className="text-[9px] font-bold shrink-0 mt-0.5" style={{ color: '#8b5cf6' }}>→</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
        <p className="text-base font-bold text-red-400 mb-2">{pillarE?.e_tab6_h3 || 'Cụm từ NGUY HIỂM trong quảng cáo'}</p>
        <div className="flex flex-wrap gap-2">
          {['"Chữa khỏi 100%"', '"Không tác dụng phụ"', '"Thải độc gan/thận"', '"Tan mỡ khi ngủ"', '"Hạ đường vĩnh viễn"', '"Không cần đi bệnh viện"'].map(t => (
            <span key={t} className="text-base px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{t}</span>
          ))}
        </div>
      </div>
      {ruleModal !== null && (
        <ScheduleModal
          item={RULES[ruleModal]}
          idx={ruleModal} total={RULES.length}
          onClose={() => setRuleModal(null)}
          onPrev={() => setRuleModal(i => Math.max(0, i - 1))}
          onNext={() => setRuleModal(i => Math.min(RULES.length - 1, i + 1))}
          hasPrev={ruleModal > 0} hasNext={ruleModal < RULES.length - 1}
        />
      )}
      {checkModal !== null && (
        <ScheduleModal
          item={SUPPS[checkModal]}
          idx={checkModal} total={SUPPS.length}
          onClose={() => setCheckModal(null)}
          onPrev={() => setCheckModal(i => Math.max(0, i - 1))}
          onNext={() => setCheckModal(i => Math.min(SUPPS.length - 1, i + 1))}
          hasPrev={checkModal > 0} hasNext={checkModal < SUPPS.length - 1}
        />
      )}
    </div>
  );
}

const DANGER_PHRASES = [
  {
    num: '01', icon: '🚫', color: '#ef4444', rgb: '239,68,68',
    metric: '"Bỏ thuốc tây đi"',
    freq: 'Cực kỳ nguy hiểm',
    tip: 'Ngừng thuốc đột ngột có thể gây nguy hiểm tính mạng với bệnh mạn tính.',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💡 Bỏ thuốc huyết áp, tim mạch hoặc đái tháo đường đột ngột có thể gây đột quỵ, nhồi máu cơ tim, hoặc hôn mê trong vài giờ.',
    detail: 'Đây là lời khuyên nguy hiểm nhất trong thế giới sức khỏe mạng — nghe có vẻ tự nhiên nhưng có thể gây hậu quả không thể đảo ngược.',
    details: [
      'Thuốc điều trị bệnh mạn tính (huyết áp, đái tháo đường, tim mạch, động kinh) không thể ngừng đột ngột — cơ thể đã thích nghi và cần giảm liều dần theo chỉ dẫn bác sĩ.',
      'Ngừng thuốc huyết áp đột ngột: nguy cơ rebound hypertension — huyết áp vọt lên cao hơn mức trước khi điều trị, có thể gây đột quỵ trong 24–48 giờ.',
      'Ngừng thuốc chống động kinh: seizure rebound có thể xảy ra dù bệnh nhân đã kiểm soát tốt nhiều năm — co giật liên tục là cấp cứu nội khoa.',
      'Ngừng corticosteroid đột ngột: suy tuyến thượng thận cấp (Addisonian crisis) — sốc, hạ huyết áp, đe dọa tính mạng.',
      '"Thuốc tây có tác dụng phụ" là đúng — nhưng bác sĩ đã cân nhắc lợi ích vượt nguy cơ. Nếu muốn thay đổi, làm cùng bác sĩ, không tự ngừng.',
      'Nếu thực sự muốn giảm dùng thuốc: thay đổi lối sống tích cực (ăn uống, vận động) có thể hỗ trợ — nhưng thực hiện CÙNG điều trị, không THAY THẾ, và dưới giám sát y tế.',
    ],
    points: [
      { icon: '⚡', label: 'Nguy hiểm tức thì', note: 'Huyết áp, tim, động kinh — tính giờ' },
      { icon: '📉', label: 'Rebound effect', note: 'Bệnh bùng phát mạnh hơn sau khi ngừng' },
      { icon: '👨‍⚕️', label: 'Chỉ bác sĩ quyết định', note: 'Không ai khác có quyền khuyên ngừng' },
      { icon: '🔄', label: 'Giảm dần nếu cần', note: 'Phải có phác đồ cụ thể, không đột ngột' },
    ],
  },
  {
    num: '02', icon: '🫀', color: '#ef4444', rgb: '239,68,68',
    metric: '"Giải độc gan 7 ngày"',
    freq: 'Pseudoscience phổ biến',
    tip: 'Gan không cần "giải độc" — đây là cơ quan tự làm sạch tốt nhất của cơ thể.',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '💡 Không có bằng chứng khoa học nào ủng hộ "liver detox" thương mại. Gan là cơ quan lọc cực kỳ hiệu quả — nếu cần "giải độc" thực sự, bạn cần nhập viện, không uống trà thảo mộc.',
    detail: 'Khái niệm "detox gan" trong y học có nghĩa hoàn toàn khác với sản phẩm thương mại — đây là một trong những misconception phổ biến nhất về sức khỏe.',
    details: [
      'Gan xử lý 1.5 lít máu/phút, loại bỏ độc chất 24/7 — không cần "nghỉ ngơi" hay "kích thích" từ trà thảo mộc hay supplement.',
      'Trong y học, "giải độc gan" thực sự là điều trị tại ICU: lọc máu (plasmapheresis), ghép gan cấp cứu với bệnh nhân suy gan do ngộ độc nặng.',
      'Nhiều sản phẩm "detox gan" thương mại chứa thành phần chưa được nghiên cứu đầy đủ — paradoxically, chính chúng có thể gây tổn thương gan (DILI - drug-induced liver injury).',
      'Nước ép cần tây, trà artichoke, silymarin (milk thistle) có dữ liệu hạn chế — không thể "giải độc" hay đảo ngược tổn thương gan có sẵn.',
      'Cách bảo vệ gan thực sự: không uống rượu, duy trì cân nặng hợp lý, tiêm phòng viêm gan B, không tự ý dùng thuốc/thảo dược liều cao.',
      'Nếu lo về sức khỏe gan: xét nghiệm AST, ALT, GGT, bilirubin — cho kết quả thực, không tốn tiền vào sản phẩm không có bằng chứng.',
    ],
    points: [
      { icon: '🔬', label: 'Gan tự lọc 24/7', note: '1.5L máu/phút, không cần "giải độc"' },
      { icon: '⚠️', label: 'DILI nguy cơ thực', note: 'Thảo dược liều cao → tổn thương gan' },
      { icon: '🏥', label: 'Detox thật = ICU', note: 'Không phải trà hay supplement' },
      { icon: '🧪', label: 'Xét nghiệm thực tế', note: 'AST/ALT/GGT cho số liệu chính xác' },
    ],
  },
  {
    num: '03', icon: '👥', color: '#f59e0b', rgb: '245,158,11',
    metric: '"Ai cũng dùng được"',
    freq: 'Claim sai về y học cá nhân hóa',
    tip: 'Không có thuốc hay thực phẩm chức năng nào phù hợp với tất cả mọi người.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    keyFact: '💡 Y học hiện đại đang tiến tới precision medicine — cùng một thuốc có thể cứu sống người này nhưng gây hại người khác, tùy gene, bệnh nền, tương tác thuốc.',
    detail: 'Tuyên bố "ai cũng dùng được" vi phạm nguyên tắc cơ bản của dược học và y học — mỗi người có profile sinh lý, bệnh nền, và đáp ứng thuốc riêng biệt.',
    details: [
      'Cùng một loại thuốc: người chuyển hóa nhanh (extensive metabolizer) cần liều cao hơn người chuyển hóa chậm (poor metabolizer) — do đa hình di truyền enzyme CYP450.',
      'Chống chỉ định phổ biến bị bỏ qua: sắt không dùng với bệnh hemochromatosis; canxi không tốt với người sỏi thận calci oxalat; omega-3 liều cao với người dùng thuốc chống đông.',
      'Phụ nữ mang thai: hầu hết thảo dược "tự nhiên" chưa có dữ liệu an toàn trong thai kỳ — thận trọng là nguyên tắc mặc định.',
      'Trẻ em không phải người lớn thu nhỏ: liều, dạng bào chế, và độ an toàn khác hoàn toàn — sản phẩm dành cho người lớn không tự động an toàn cho trẻ.',
      'Bệnh thận mạn (CKD): nhiều chất bổ sung tích lũy trong cơ thể khi thận suy giảm khả năng lọc — kali, phospho, vitamin tan trong mỡ (A, D, E, K) cần kiểm soát chặt.',
      'Tương tác thuốc-thảo dược: St. John\'s Wort làm giảm hiệu quả thuốc tránh thai, thuốc chống thải ghép, thuốc kháng HIV — "tự nhiên" không có nghĩa là không tương tác.',
    ],
    points: [
      { icon: '🧬', label: 'Gene quyết định đáp ứng', note: 'Pharmacogenomics — mỗi người khác nhau' },
      { icon: '🤰', label: 'Thai kỳ = thận trọng', note: 'Mặc định chưa có dữ liệu an toàn' },
      { icon: '🫘', label: 'Bệnh thận/gan cần lọc', note: 'Chất tích lũy khi thận/gan suy yếu' },
      { icon: '💊', label: 'Tương tác thuốc-thảo dược', note: 'St. John\'s Wort + thuốc kê đơn = nguy hiểm' },
    ],
  },
  {
    num: '04', icon: '🩸', color: '#ef4444', rgb: '239,68,68',
    metric: '"Sạch mạch máu"',
    freq: 'Pseudoscience tim mạch',
    tip: 'Không có sản phẩm nào "làm sạch" mạch máu theo nghĩa thương mại quảng cáo.',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f3?w=800&q=80',
    keyFact: '💡 Xơ vữa động mạch là quá trình mạn tính cần điều trị y tế nghiêm túc (statin, thay đổi lối sống). Không có thực phẩm chức năng nào có thể "rửa sạch" mảng bám đã hình thành.',
    detail: 'Khái niệm "sạch mạch máu" trong quảng cáo không tương ứng với bất kỳ cơ chế sinh lý nào đã được khoa học xác nhận — đây là pseudoscience tim mạch phổ biến.',
    details: [
      'Xơ vữa động mạch (atherosclerosis) là quá trình hình thành mảng bám lipid + tế bào viêm + calci trong thành mạch — phát triển qua nhiều thập kỷ, không thể "rửa" bằng thực phẩm chức năng.',
      'Điều trị xơ vữa thực sự: statin (giảm LDL, ổn định mảng bám), aspirin (chống kết tập tiểu cầu), kiểm soát huyết áp, ngừng hút thuốc — tất cả cần theo dõi y tế.',
      'Tỏi, omega-3, coenzyme Q10, vitamin E: có dữ liệu về hỗ trợ sức khỏe tim mạch ở mức độ nhất định — nhưng không ai trong số này "làm sạch" mạch máu có mảng bám đã hình thành.',
      'Đánh giá sức khỏe mạch máu thực tế: xét nghiệm lipid máu (LDL, HDL, triglycerides), siêu âm Doppler mạch cảnh, chụp CT coronary calcium score.',
      '"Thông mạch máu" trong quảng cáo đông y thường ám chỉ cải thiện tuần hoàn — khác hoàn toàn với điều trị xơ vữa động mạch có bằng chứng.',
      'Nếu lo về sức khỏe tim mạch: đo huyết áp định kỳ, xét nghiệm mỡ máu, kiểm soát đường huyết, không hút thuốc — đây là biện pháp có bằng chứng thực sự.',
    ],
    points: [
      { icon: '🔬', label: 'Mảng bám không "rửa" được', note: 'Cần can thiệp y tế chuyên sâu' },
      { icon: '💊', label: 'Statin là điều trị thực', note: 'Bằng chứng mạnh nhất về xơ vữa' },
      { icon: '🧪', label: 'Đo lipid máu', note: 'LDL/HDL/triglycerides — số thật' },
      { icon: '🏃', label: 'Lối sống > supplement', note: 'Vận động + ăn uống có bằng chứng cao hơn' },
    ],
  },
];

const SAFE_PHRASES = [
  {
    num: '01', icon: '📊', color: '#22c55e', rgb: '34,197,94',
    metric: '"Hỗ trợ theo dõi"',
    freq: 'Ngôn ngữ y khoa chuẩn',
    tip: 'Thừa nhận giới hạn của sản phẩm — chỉ hỗ trợ, không thay thế điều trị.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    keyFact: '💡 "Hỗ trợ" trong y học có nghĩa là bổ sung thêm vào điều trị chính, không phải thay thế. Cụm từ này thể hiện sự trung thực về vai trò của sản phẩm.',
    detail: 'Ngôn ngữ "hỗ trợ theo dõi" phản ánh đúng vị trí của nhiều sản phẩm sức khỏe — có vai trò bổ sung nhưng không phải công cụ điều trị.',
    details: [
      '"Hỗ trợ theo dõi" thừa nhận rằng sản phẩm không chữa bệnh — đây là sự trung thực cần thiết trong truyền thông sức khỏe.',
      'Ví dụ hợp lệ: thiết bị đo nhịp tim hỗ trợ theo dõi — cần bác sĩ diễn giải kết quả và đưa ra quyết định điều trị.',
      'Phân biệt rõ: "hỗ trợ theo dõi đường huyết" (máy đo) khác với "điều trị đái tháo đường" (thuốc + insulin + thay đổi lối sống).',
      'Ngôn ngữ này giúp người dùng đặt kỳ vọng đúng — không tin rằng chỉ cần theo dõi là đủ, vẫn cần điều trị cốt lõi.',
      'Công cụ theo dõi tốt (app, wearable, máy đo) có giá trị thực khi dùng cùng với chăm sóc y tế, không thay thế nó.',
      'Khi thấy cụm từ này, câu hỏi tiếp theo: "Theo dõi gì? Tần suất? Kết quả cần báo bác sĩ khi nào?" — để biết cách dùng đúng.',
    ],
    points: [
      { icon: '✅', label: 'Thừa nhận giới hạn', note: 'Trung thực về vai trò bổ sung' },
      { icon: '🔗', label: 'Cùng điều trị chính', note: 'Hỗ trợ thêm, không thay thế' },
      { icon: '📱', label: 'Công cụ theo dõi', note: 'Wearable, app — giá trị khi dùng đúng' },
      { icon: '❓', label: 'Hỏi thêm cụ thể', note: 'Theo dõi gì? Báo bác sĩ khi nào?' },
    ],
  },
  {
    num: '02', icon: '🎯', color: '#22c55e', rgb: '34,197,94',
    metric: '"Cần cá nhân hóa"',
    freq: 'Ngôn ngữ y học chuẩn',
    tip: 'Thừa nhận rằng không có giải pháp một size fits all — phản ánh đúng thực tế y khoa.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    keyFact: '💡 Precision medicine — xu hướng y học hiện đại — xây dựng trên nguyên tắc này: mỗi người cần phác đồ riêng dựa trên gene, lối sống, và bệnh nền.',
    detail: 'Cá nhân hóa là nguyên tắc cốt lõi của y học hiện đại — cụm từ này phản ánh tư duy khoa học, không phải né tránh cam kết.',
    details: [
      'Nhu cầu protein: 0.8–2.2g/kg tùy mục tiêu (giảm cân, tăng cơ, bệnh thận), tuổi tác, mức độ hoạt động — không có con số duy nhất cho tất cả.',
      'Liều vitamin D: phụ thuộc mức 25-OH vitamin D hiện tại, khả năng tiếp xúc ánh nắng, màu da, BMI — xét nghiệm trước, bổ sung sau.',
      'Kế hoạch vận động: người có đau khớp gối cần bài tập khác người khỏe mạnh; người cao tuổi cần ưu tiên thăng bằng và chống ngã hơn sức mạnh.',
      'Thực đơn: người bị hội chứng ruột kích thích (IBS) cần low-FODMAP; người đái tháo đường cần kiểm soát GI; người suy thận cần hạn chế kali, phospho.',
      'Khi sản phẩm/dịch vụ nói "cần cá nhân hóa", đây là tín hiệu tốt — họ không overpromise và thừa nhận bạn cần được đánh giá riêng.',
      'Bước tiếp theo khi nghe cụm từ này: "Cá nhân hóa dựa trên thông tin gì? Ai đánh giá? Có cần xét nghiệm không?" — để biết quy trình cụ thể.',
    ],
    points: [
      { icon: '🧬', label: 'Precision medicine', note: 'Xu hướng y học dựa trên gene + lối sống' },
      { icon: '⚖️', label: 'Không overpromise', note: 'Thừa nhận không có giải pháp chung' },
      { icon: '📋', label: 'Cần đánh giá cụ thể', note: 'Xét nghiệm, tiền sử, mục tiêu cá nhân' },
      { icon: '✅', label: 'Dấu hiệu trung thực', note: 'Người nói hiểu giới hạn của thông tin' },
    ],
  },
  {
    num: '03', icon: '👨‍⚕️', color: '#22c55e', rgb: '34,197,94',
    metric: '"Nên tham khảo bác sĩ"',
    freq: 'Disclaimer chuẩn mực y tế',
    tip: 'Khuyến nghị đúng đắn — nhận ra giới hạn của bản thân và chuyển hướng đến chuyên gia.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    keyFact: '💡 Cụm từ này không phải né tránh trách nhiệm — đây là lời khuyên đúng nhất có thể đưa ra khi không biết đủ thông tin cá nhân của bạn để đưa ra khuyến nghị cụ thể.',
    detail: 'Lời khuyên "tham khảo bác sĩ" bị nhiều người xem là né tránh, nhưng thực ra đây là biểu hiện của sự trung thực và trách nhiệm trong truyền thông sức khỏe.',
    details: [
      'Bác sĩ có thể đặt câu hỏi trực tiếp, xem xét tiền sử bệnh, kiểm tra thể lực, đọc kết quả xét nghiệm — tất cả những điều mà nội dung online không thể làm thay.',
      'Nội dung y tế online chỉ cung cấp thông tin chung (general information), không phải lời khuyên y tế (medical advice) — hai khái niệm này khác nhau về pháp lý và đạo đức.',
      'Ở nhiều quốc gia, chỉ bác sĩ được cấp phép mới được cung cấp "medical advice" cá nhân hóa — đây là quy định bảo vệ bệnh nhân.',
      'Khi ai đó nói "nên tham khảo bác sĩ", hãy coi đây là dấu hiệu họ hiểu giới hạn của mình — không phải né tránh mà là trách nhiệm.',
      'Cụm từ này đặc biệt quan trọng với: phụ nữ mang thai, trẻ em, người cao tuổi, người có bệnh nền, người đang dùng nhiều thuốc cùng lúc.',
      'Cách tận dụng tốt: ghi chú nội dung đọc được, đặt câu hỏi cụ thể cho bác sĩ tại lần khám tiếp theo — nội dung online và bác sĩ bổ trợ cho nhau.',
    ],
    points: [
      { icon: '🩺', label: 'Bác sĩ biết bạn cụ thể', note: 'Tiền sử, thuốc, kết quả xét nghiệm' },
      { icon: '⚖️', label: 'Info ≠ medical advice', note: 'Hai khái niệm khác nhau về pháp lý' },
      { icon: '✅', label: 'Dấu hiệu trung thực', note: 'Người nói biết giới hạn của mình' },
      { icon: '📝', label: 'Dùng thông minh', note: 'Ghi câu hỏi → hỏi bác sĩ lần sau' },
    ],
  },
  {
    num: '04', icon: '💊', color: '#22c55e', rgb: '34,197,94',
    metric: '"Không thay thuốc điều trị"',
    freq: 'Disclaimer quan trọng nhất',
    tip: 'Tuyên bố rõ ràng về vị trí của sản phẩm — bổ sung, không thay thế điều trị.',
    img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80',
    keyFact: '💡 Integrative medicine (y học tích hợp) kết hợp y học thông thường với các liệu pháp bổ sung — nhưng luôn nhấn mạnh: liệu pháp bổ sung không thay thế điều trị cốt lõi.',
    detail: 'Đây là disclaimer quan trọng và trung thực nhất trong truyền thông sức khỏe — sản phẩm biết rõ vị trí của mình trong hệ sinh thái chăm sóc sức khỏe.',
    details: [
      'Sản phẩm có thể bổ sung vào điều trị y tế: giảm tác dụng phụ, cải thiện chất lượng sống, hỗ trợ phục hồi — nhưng không phải liều thuốc thay thế.',
      'Ví dụ: gừng hỗ trợ giảm buồn nôn trong hóa trị — có bằng chứng khoa học nhất định, nhưng không thay thế phác đồ hóa trị của bác sĩ ung thư.',
      'Khi sản phẩm nói "không thay thuốc điều trị", đây là sự trung thực về giới hạn — đừng xem đây là điểm yếu mà là dấu hiệu đáng tin.',
      'Integrative medicine tại các bệnh viện lớn (MD Anderson, Mayo Clinic) sử dụng yoga, thiền, châm cứu — CÙNG với điều trị ung thư, không thay thế nó.',
      'Nguy hiểm xảy ra khi người bệnh tự quyết định thay điều trị bằng "tự nhiên" — thường do hiểu sai thông tin hoặc bị quảng cáo thao túng.',
      'Câu hỏi đúng đắn: "Liệu pháp bổ sung này có tương tác với thuốc điều trị của tôi không?" — hỏi bác sĩ và dược sĩ trước khi thêm bất kỳ thứ gì.',
    ],
    points: [
      { icon: '🔗', label: 'Bổ sung, không thay thế', note: 'Integrative medicine — luôn giữ điều trị chính' },
      { icon: '✅', label: 'Dấu hiệu trung thực', note: 'Sản phẩm biết vị trí của mình' },
      { icon: '⚠️', label: 'Hỏi về tương tác', note: 'Bổ sung + thuốc có thể xung đột' },
      { icon: '🏥', label: 'Integrative medicine', note: 'Kết hợp đúng cách tại bệnh viện lớn' },
    ],
  },
];

const INFO_FILTER = [
  {
    num: '01', icon: '🧑‍⚕️', color: '#6366f1', rgb: '99,102,241',
    metric: 'Ai nói?',
    freq: 'Kiểm tra uy tín người nói',
    tip: 'Có chuyên môn y tế thực sự không? Bằng cấp, tổ chức uy tín?',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '💡 Influencer có lượt theo dõi cao ≠ có chuyên môn y tế. Luôn xác minh bằng cấp thực sự.',
    detail: 'Người chia sẻ thông tin sức khỏe cần có nền tảng chuyên môn được xác minh, không chỉ trải nghiệm cá nhân hay lượt xem cao.',
    details: [
      'Bác sĩ, dược sĩ, chuyên gia dinh dưỡng được cấp phép là nguồn uy tín — hỏi rõ bằng cấp nếu không chắc.',
      'Tổ chức y tế có uy tín: WHO, Bộ Y tế, Hội Y học Việt Nam, Mayo Clinic, WebMD là các nguồn đáng tin.',
      'Influencer kể "hành trình cá nhân" có thể truyền cảm hứng nhưng không phải lời khuyên y tế — phân biệt rõ hai loại.',
      'Xác nhận bằng cách tìm kiếm tên người nói + "bằng cấp", "giấy phép hành nghề" hoặc tìm trên trang web cơ quan nhà nước.',
      'Thận trọng với danh hiệu tự phong: "chuyên gia", "tiến sĩ" mà không có trường/tổ chức cụ thể — không thể kiểm chứng.',
      'Kênh YouTube/TikTok với vài triệu follow không có nghĩa là kiến thức y khoa đúng — đám đông không xác nhận sự thật.',
    ],
    points: [
      { icon: '🎓', label: 'Bằng cấp thực', note: 'Trường/cơ quan cụ thể có thể tra cứu' },
      { icon: '🏥', label: 'Tổ chức uy tín', note: 'WHO, Bộ Y tế, Hội Y học' },
      { icon: '⚠️', label: 'Danh hiệu tự phong', note: '"Chuyên gia" không rõ nguồn gốc' },
      { icon: '🔍', label: 'Cách kiểm tra', note: 'Tên + bằng cấp + giấy phép hành nghề' },
    ],
  },
  {
    num: '02', icon: '🔬', color: '#6366f1', rgb: '99,102,241',
    metric: 'Dựa trên gì?',
    freq: 'Kiểm tra bằng chứng khoa học',
    tip: 'Nghiên cứu hay kinh nghiệm cá nhân? Có trích dẫn nguồn không?',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    keyFact: '💡 "Tôi đã thử và thấy hiệu quả" là anecdote, không phải bằng chứng khoa học. Cần nghiên cứu có kiểm soát.',
    detail: 'Chất lượng bằng chứng quyết định độ tin cậy của thông tin sức khỏe — từ ý kiến cá nhân đến thử nghiệm lâm sàng là khoảng cách rất lớn.',
    details: [
      'Bậc thang bằng chứng (từ cao đến thấp): systematic review → RCT → cohort study → case report → ý kiến chuyên gia → kinh nghiệm cá nhân.',
      'Khi xem claim sức khỏe, tìm nguồn trích dẫn: nghiên cứu đăng ở tạp chí nào, bao nhiêu người tham gia, thời gian theo dõi bao lâu.',
      'Nghiên cứu trên chuột hoặc ống nghiệm (in vitro) không tự động áp dụng cho người — cần thử nghiệm lâm sàng xác nhận.',
      'Correlation ≠ causation: "người ăn X sống lâu hơn" chưa chứng minh X là nguyên nhân — có thể người giàu mới ăn được X.',
      'Số mẫu nhỏ (n<50), không có nhóm đối chứng, tự báo cáo — các dấu hiệu của nghiên cứu yếu cần thận trọng.',
      'Google Scholar, PubMed là công cụ tra cứu nghiên cứu miễn phí — bất kỳ ai cũng có thể tự kiểm chứng nguồn trích dẫn.',
    ],
    points: [
      { icon: '📊', label: 'RCT là chuẩn vàng', note: 'Thử nghiệm ngẫu nhiên có đối chứng' },
      { icon: '🐭', label: 'Nghiên cứu chuột ≠ người', note: 'Cần xác nhận thêm trên người' },
      { icon: '🔗', label: 'Trích dẫn cụ thể', note: 'Tên tác giả, tạp chí, năm xuất bản' },
      { icon: '🔎', label: 'Tự kiểm chứng', note: 'PubMed.gov — tra cứu miễn phí' },
    ],
  },
  {
    num: '03', icon: '🚩', color: '#ef4444', rgb: '239,68,68',
    metric: 'Có hứa hẹn quá mức?',
    freq: 'Nhận diện red flags ngôn ngữ',
    tip: '"100%", "Chữa khỏi", "Tất cả mọi người" — là dấu hiệu đỏ.',
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    keyFact: '💡 Y học thực chứng không bao giờ dùng ngôn ngữ tuyệt đối. "Luôn luôn hiệu quả" và "không có tác dụng phụ" là dấu hiệu cảnh báo.',
    detail: 'Ngôn ngữ marketing sức khỏe sử dụng các cụm từ cảm xúc để tạo niềm tin giả tạo — nhận biết chúng là kỹ năng bảo vệ bản thân quan trọng.',
    details: [
      'Red flags phổ biến: "100% tự nhiên", "không tác dụng phụ", "chữa khỏi hoàn toàn", "ai dùng cũng có hiệu quả", "bác sĩ không muốn bạn biết điều này".',
      '"Tự nhiên" không đồng nghĩa an toàn — arsenic, thuốc phiện đều tự nhiên nhưng cực độc; nhiều thuốc tổng hợp là cứu sống người.',
      'Y học dùng ngôn ngữ xác suất: "có thể giảm nguy cơ", "hỗ trợ điều trị", "cần theo dõi thêm" — không bao giờ tuyệt đối.',
      '"Giải pháp bí mật mà các công ty dược phẩm giấu đi" là cụm từ điển hình của thuyết âm mưu, không có cơ sở thực tế.',
      'Testimonial (lời chứng nhận) của một vài người không thay thế được dữ liệu thống kê từ hàng nghìn người trong nghiên cứu.',
      'Khi thấy claim nghe quá tốt để là thật — thường là không thật. Hiệu ứng "too good to be true" đặc biệt phổ biến trong sức khỏe.',
    ],
    points: [
      { icon: '🚩', label: '"100%" và "Luôn luôn"', note: 'Ngôn ngữ tuyệt đối — không có trong y học' },
      { icon: '🌿', label: '"Tự nhiên" ≠ an toàn', note: 'Nhiều chất tự nhiên là độc hại' },
      { icon: '👥', label: 'Testimonial ≠ bằng chứng', note: 'Câu chuyện cá nhân không thay được dữ liệu' },
      { icon: '🤫', label: '"Bí mật bị giấu"', note: 'Dấu hiệu điển hình của thuyết âm mưu' },
    ],
  },
  {
    num: '04', icon: '🛒', color: '#f59e0b', rgb: '245,158,11',
    metric: 'Có bán hàng ngay sau?',
    freq: 'Nhận diện công thức thao túng',
    tip: 'Tạo nỗi sợ → giới thiệu sản phẩm → bán = công thức thao túng.',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    keyFact: '💡 Công thức FASO (Fear → Authority → Solution → Offer) là cấu trúc của hàng nghìn livestream sức khỏe. Nhận biết cấu trúc này giúp bạn không bị thao túng.',
    detail: 'Nội dung sức khỏe thực sự nhằm giáo dục, không nhằm bán hàng ngay lập tức. Khi giáo dục và bán hàng lẫn lộn, cần đặt câu hỏi về động cơ của người tạo nội dung.',
    details: [
      'Công thức FASO: Fear (tạo nỗi sợ về bệnh tật) → Authority (đóng vai chuyên gia) → Solution (giới thiệu giải pháp) → Offer (bán sản phẩm) — xuất hiện trong hàng nghìn livestream.',
      '"Gan của bạn đang bị tổn thương mà không biết… May mà có sản phẩm này" — đây là ví dụ điển hình của chuỗi FASO.',
      'Thông tin giáo dục sức khỏe hợp lệ không cần đi kèm link mua ngay hay flash sale, không tạo áp lực thời gian ("chỉ còn 10 suất").',
      'Conflict of interest: người bán bổ sung không thể là người khách quan đánh giá bổ sung đó — xung đột lợi ích làm méo mó thông tin.',
      'Affiliate link, hoa hồng, code giảm giá không tự làm thông tin sai — nhưng cần biết động cơ tài chính của người chia sẻ.',
      'Câu hỏi đơn giản: "Nếu tôi không mua gì, người này vẫn muốn chia sẻ thông tin không?" — giúp đánh giá động cơ thực sự.',
    ],
    points: [
      { icon: '😱', label: 'Fear-based hook', note: 'Tạo nỗi sợ để tạo nhu cầu' },
      { icon: '⏰', label: 'Áp lực thời gian', note: '"Chỉ còn X suất" — chiêu bán hàng' },
      { icon: '💰', label: 'Conflict of interest', note: 'Người bán không thể khách quan' },
      { icon: '🎓', label: 'Giáo dục vs. bán hàng', note: 'Nội dung thực không cần CTA ngay' },
    ],
  },
  {
    num: '05', icon: '💊', color: '#ef4444', rgb: '239,68,68',
    metric: 'Có khuyên bỏ điều trị?',
    freq: 'Dấu hiệu nguy hiểm nhất',
    tip: '"Bỏ thuốc tây đi" — cực kỳ nguy hiểm với bệnh nhân mạn tính.',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💡 Bỏ thuốc điều trị đột ngột có thể gây nguy hiểm tính mạng với bệnh tim, đái tháo đường, tâm thần phân liệt, động kinh. Không bao giờ làm điều này mà không có bác sĩ hướng dẫn.',
    detail: 'Khuyên bỏ điều trị y tế thông thường là ranh giới đỏ nghiêm trọng nhất — hậu quả có thể không thể đảo ngược với nhiều bệnh mạn tính.',
    details: [
      'Nhóm nguy hiểm nhất khi bỏ thuốc đột ngột: bệnh tim mạch (nhồi máu, suy tim), đái tháo đường (hôn mê), động kinh (co giật liên tục), tâm thần phân liệt (tái phát cấp tính).',
      '"Thuốc tây có tác dụng phụ" là đúng — nhưng không dùng thuốc với bệnh nặng còn nguy hiểm hơn nhiều. Bác sĩ cân bằng lợi ích-nguy cơ cho từng người.',
      'Không ai có quyền khuyên bỏ thuốc của bạn trừ bác sĩ điều trị của bạn — đây là ranh giới pháp lý và đạo đức rõ ràng.',
      '"Điều trị bổ sung" (thảo dược, châm cứu, liệu pháp tâm lý) có thể được dùng CÙNG với điều trị y tế, không phải THAY THẾ — gọi là integrative medicine.',
      'Nếu muốn thay đổi phác đồ điều trị, làm cùng bác sĩ: giảm liều dần, theo dõi chỉ số, có phương án dự phòng — không tự ngừng đột ngột.',
      'Báo cáo cho cơ quan y tế khi gặp nội dung khuyên bỏ điều trị: vi phạm quy định về quảng cáo y tế và có thể bị xử lý hình sự.',
    ],
    points: [
      { icon: '🚫', label: 'Không tự ngừng thuốc', note: 'Luôn có bác sĩ hướng dẫn' },
      { icon: '⚕️', label: 'Integrative ≠ thay thế', note: 'Bổ sung cạnh thuốc, không thay thuốc' },
      { icon: '⚡', label: 'Nguy cơ tức thì', note: 'Tim, tiểu đường, động kinh — nguy hiểm ngay' },
      { icon: '📢', label: 'Báo cáo vi phạm', note: 'Cơ quan y tế có thể xử lý nội dung này' },
    ],
  },
];

function TabE7() {
  const { t: tE7 } = useTranslation('pillars');
  const [filterModal, setFilterModal] = useState(null);
  const [dangerModal, setDangerModal] = useState(null);
  const [safeModal, setSafeModal] = useState(null);
  return (
    <div className="space-y-4">
      <p className="text-base text-muted">{tE7('pillarE.e7_intro') || 'Với sự bùng nổ của TikTok, YouTube và livestream bán hàng, lọc thông tin sức khỏe là kỹ năng sống quan trọng.'}</p>
      <div className="space-y-2">
        {INFO_FILTER.map((q, i) => (
          <div
            key={q.num}
            onClick={() => setFilterModal(i)}
            className="rounded-xl border border-border bg-surface/60 p-4 cursor-pointer hover:border-indigo-500/40 hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-base font-black shrink-0" style={{ background: `rgba(${q.rgb},0.15)`, color: q.color }}>{q.num}</span>
              <span className="font-semibold text-lg text-text flex-1">{q.metric}</span>
              <span className="text-muted text-sm">→</span>
            </div>
            <p className="text-base text-muted pl-8">{q.tip}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/06 p-4">
          <p className="text-base font-bold text-red-400 mb-2">{tE7('pillarE.e7_danger_heading') || '❌ Cụm từ nguy hiểm'}</p>
          <ul className="space-y-1">
            {DANGER_PHRASES.map((p, i) => (
              <li
                key={p.num}
                onClick={() => setDangerModal(i)}
                className="text-base text-muted cursor-pointer hover:text-red-300 transition-colors flex items-center justify-between group"
              >
                <span>{p.metric}</span>
                <span className="text-red-500/40 group-hover:text-red-400 text-xs ml-1 transition-colors">→</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/06 p-4">
          <p className="text-base font-bold text-green-400 mb-2">{tE7('pillarE.e7_safe_heading') || '✓ Ngôn ngữ an toàn'}</p>
          <ul className="space-y-1">
            {SAFE_PHRASES.map((p, i) => (
              <li
                key={p.num}
                onClick={() => setSafeModal(i)}
                className="text-base text-muted cursor-pointer hover:text-green-300 transition-colors flex items-center justify-between group"
              >
                <span>{p.metric}</span>
                <span className="text-green-500/40 group-hover:text-green-400 text-xs ml-1 transition-colors">→</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {filterModal !== null && (
        <ScheduleModal
          item={INFO_FILTER[filterModal]}
          idx={filterModal}
          total={INFO_FILTER.length}
          onClose={() => setFilterModal(null)}
          onPrev={() => setFilterModal(i => Math.max(0, i - 1))}
          onNext={() => setFilterModal(i => Math.min(INFO_FILTER.length - 1, i + 1))}
          hasPrev={filterModal > 0}
          hasNext={filterModal < INFO_FILTER.length - 1}
        />
      )}
      {dangerModal !== null && (
        <ScheduleModal
          item={DANGER_PHRASES[dangerModal]}
          idx={dangerModal}
          total={DANGER_PHRASES.length}
          onClose={() => setDangerModal(null)}
          onPrev={() => setDangerModal(i => Math.max(0, i - 1))}
          onNext={() => setDangerModal(i => Math.min(DANGER_PHRASES.length - 1, i + 1))}
          hasPrev={dangerModal > 0}
          hasNext={dangerModal < DANGER_PHRASES.length - 1}
        />
      )}
      {safeModal !== null && (
        <ScheduleModal
          item={SAFE_PHRASES[safeModal]}
          idx={safeModal}
          total={SAFE_PHRASES.length}
          onClose={() => setSafeModal(null)}
          onPrev={() => setSafeModal(i => Math.max(0, i - 1))}
          onNext={() => setSafeModal(i => Math.min(SAFE_PHRASES.length - 1, i + 1))}
          hasPrev={safeModal > 0}
          hasNext={safeModal < SAFE_PHRASES.length - 1}
        />
      )}
    </div>
  );
}

const TAB_CONTENT = { e0: TabE0, e1: TabE1, e2: TabE2, e3: TabE3, e4: TabE4, e5: TabE5, e6: TabE6, e7: TabE7 };

export default function PillarE() {
  const { t: tPillars } = useTranslation('pillars');
  const { t: tCommon } = useTranslation('common');
  const pillar = tPillars('pillarE', { returnObjects: true });
  const [activeTab, setActiveTab] = useState('e0');
  const tabsTr = Array.isArray(pillar?.hub_tabs) ? pillar.hub_tabs : [];
  const mergedTabs = TABS.map((t, i) => ({ ...t, label: tabsTr[i]?.label || t.label }));
  const eTc = Array.isArray(pillar?.e_teaser_cards) ? pillar.e_teaser_cards : [];
  const tab = mergedTabs.find(t => t.id === activeTab);
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
        <span>←</span><span>{tCommon('nav.pillars')}</span>
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
            {(Array.isArray(pillar?.e_hero_stats) ? pillar.e_hero_stats : ['8 Module', '12 Tuần', '5 Chỉ số', '100 điểm']).map((label, i) => (
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
            {mergedTabs.map(t => {
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
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: tab.color }}>{tab.id.toUpperCase()} · {pillar?.title || 'Kiến Thức Sức Khỏe'}</div>
                <div className="text-xl font-bold text-text">{tab.label}</div>
              </div>
            </div>
            <TabPanel />
          </div>
        </div>
      </RevealBlock>

      {/* Teaser grid */}
      <RevealBlock delay={60}>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">{pillar?.e_explore_title || 'Khám Phá Sâu Hơn'}</h2>
        <p className="text-muted mb-10">{pillar?.e_explore_sub || '12 chủ đề chuyên sâu về kiến thức sức khỏe phổ thông'}</p>

        <TeaserSection title={pillar?.e_teaser_s1 || 'Chỉ Số & Đo Lường'}>
          <TeaserCard to="/pillar/e/bmi" color="#3b82f6" rgb="59,130,246" icon="⚖️" category={eTc[0]?.category || 'Chỉ Số Cơ Thể'} title={eTc[0]?.title || 'BMI & Vòng Eo'} accent={eTc[0]?.accent || 'Sàng lọc · Nguy cơ chuyển hóa'} desc={eTc[0]?.desc || 'Hiểu BMI, cách đọc đúng, và tại sao vòng eo quan trọng hơn cân nặng đơn thuần.'} features={eTc[0]?.features || ['Công thức tính BMI + ví dụ', 'Vì sao vòng eo quan trọng hơn', 'Kỹ thuật đo đúng chuẩn', 'Hành động theo từng kết quả']} stats={[{ v: '4', l: eTc[0]?.stats?.[0]?.l || 'Phân loại' }, { v: 'Tuần/lần', l: eTc[0]?.stats?.[1]?.l || 'Đo vòng eo' }]} image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80" imageAlt="BMI" cta={eTc[0]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/blood-pressure" color="#ef4444" rgb="239,68,68" icon="❤️" category={eTc[1]?.category || 'Huyết Áp'} title={eTc[1]?.title || 'Đo & Hiểu Huyết Áp'} accent={eTc[1]?.accent || '120/80 · Theo dõi tại nhà'} desc={eTc[1]?.desc || 'Tại sao huyết áp nguy hiểm thầm lặng, cách đo đúng và khi nào cần đi khám ngay.'} features={eTc[1]?.features || ['Phân loại huyết áp AHA', '5 bước đo đúng kỹ thuật', 'Nhật ký huyết áp 7 ngày', 'Dấu hiệu cần cấp cứu ngay']} stats={[{ v: '5', l: eTc[1]?.stats?.[0]?.l || 'Bước đo đúng' }, { v: '7', l: eTc[1]?.stats?.[1]?.l || 'Ngày nhật ký' }]} image="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80" imageAlt="Blood Pressure" cta={eTc[1]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/blood-sugar" color="#f59e0b" rgb="245,158,11" icon="🍬" category={eTc[2]?.category || 'Đường Huyết'} title={eTc[2]?.title || 'Đường Huyết & HbA1c'} accent={eTc[2]?.accent || 'Tiền ĐTĐ · Kiểm soát lâu dài'} desc={eTc[2]?.desc || 'Hiểu sự khác biệt giữa đường huyết đói và HbA1c, cách phòng tiền đái tháo đường.'} features={eTc[2]?.features || ['Ngưỡng bình thường và cảnh báo', 'HbA1c khác đường huyết thế nào', 'Liên hệ ăn uống và vận động', 'Khi nào cần xét nghiệm']} stats={[{ v: '8h', l: eTc[2]?.stats?.[0]?.l || 'Nhịn trước đo' }, { v: '3 tháng', l: eTc[2]?.stats?.[1]?.l || 'HbA1c phản ánh' }]} image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80" imageAlt="Blood Sugar" cta={eTc[2]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/lipids" color="#8b5cf6" rgb="139,92,246" icon="🫀" category={eTc[3]?.category || 'Mỡ Máu'} title={eTc[3]?.title || 'LDL, HDL & Triglyceride'} accent={eTc[3]?.accent || 'Xơ vữa · Tim mạch'} desc={eTc[3]?.desc || "Giải mã bảng mỡ máu: LDL 'xấu', HDL 'tốt', triglyceride cao do đâu và điều chỉnh thế nào."} features={eTc[3]?.features || ['LDL-C và xơ vữa động mạch', 'HDL-C: vai trò thực sự', 'Triglyceride và đề kháng insulin', 'Mục tiêu theo nhóm nguy cơ']} stats={[{ v: '4', l: eTc[3]?.stats?.[0]?.l || 'Chỉ số mỡ máu' }, { v: 'mg/dL', l: eTc[3]?.stats?.[1]?.l || 'Đơn vị' }]} image="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80" imageAlt="Lipids" cta={eTc[3]?.cta || 'Xem chi tiết →'} />
        </TeaserSection>

        <TeaserSection title={pillar?.e_teaser_s2 || 'Cảnh Báo & An Toàn'}>
          <TeaserCard to="/pillar/e/red-flags" color="#ef4444" rgb="239,68,68" icon="🚨" category={eTc[4]?.category || 'Dấu Hiệu Nguy Hiểm'} title={eTc[4]?.title || 'Red Flags — Khi Nào Cấp Cứu'} accent={eTc[4]?.accent || 'Tim · Thần kinh · Tiêu hóa'} desc={eTc[4]?.desc || 'Bảng tra cứu nhanh các dấu hiệu nguy hiểm cần đến cơ sở y tế ngay — không được chờ đợi.'} features={eTc[4]?.features || ['Dấu hiệu đột quỵ: F.A.S.T.', 'Đau ngực nguy hiểm vs bình thường', 'Emergency Decision Tree', '4 nhóm dấu hiệu cần cấp cứu']} stats={[{ v: '4', l: eTc[4]?.stats?.[0]?.l || 'Nhóm nguy hiểm' }, { v: '115', l: eTc[4]?.stats?.[1]?.l || 'Số cấp cứu' }]} image="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80" imageAlt="Red Flags" cta={eTc[4]?.cta || 'Xem ngay →'} />
          <TeaserCard to="/pillar/e/medication" color="#10b981" rgb="16,185,129" icon="💊" category={eTc[5]?.category || 'An Toàn Thuốc'} title={eTc[5]?.title || 'Thuốc & Thực Phẩm Bổ Sung'} accent={eTc[5]?.accent || '5 Quy tắc Không · Checklist'} desc={eTc[5]?.desc || 'Nguyên tắc dùng thuốc an toàn, checklist trước khi mua thực phẩm chức năng.'} features={eTc[5]?.features || ['5 quy tắc Không về thuốc', 'Checklist 5 câu trước khi dùng', 'Cụm từ nguy hiểm trong quảng cáo', 'Tương tác thuốc cơ bản']} stats={[{ v: '5', l: eTc[5]?.stats?.[0]?.l || 'Quy tắc' }, { v: '5', l: eTc[5]?.stats?.[1]?.l || 'Câu kiểm tra' }]} image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80" imageAlt="Medication" cta={eTc[5]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/media-literacy" color="#6366f1" rgb="99,102,241" icon="🔎" category={eTc[6]?.category || 'Lọc Thông Tin'} title={eTc[6]?.title || 'Health Media Literacy'} accent={eTc[6]?.accent || 'TikTok · YouTube · Livestream'} desc={eTc[6]?.desc || 'Bộ lọc 5 câu hỏi để nhận biết thông tin sức khỏe sai lệch và nội dung nguy hiểm trên mạng.'} features={eTc[6]?.features || ['5 câu hỏi kiểm chứng nguồn', 'Dấu hiệu nội dung nguy hiểm', 'Cách tra cứu nguồn đáng tin', 'Ngôn ngữ quảng cáo thao túng']} stats={[{ v: '5', l: eTc[6]?.stats?.[0]?.l || 'Câu hỏi lọc' }, { v: '9', l: eTc[6]?.stats?.[1]?.l || 'Từ khóa đỏ' }]} image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" imageAlt="Media Literacy" cta={eTc[6]?.cta || 'Xem chi tiết →'} />
        </TeaserSection>

        <TeaserSection title={pillar?.e_teaser_s3 || 'Phòng Bệnh & Theo Dõi'}>
          <TeaserCard to="/pillar/e/prevention" color="#0ea5e9" rgb="14,165,233" icon="🛡️" category={eTc[7]?.category || 'Phòng Bệnh'} title={eTc[7]?.title || 'Phòng Bệnh Chủ Động'} accent={eTc[7]?.accent || 'Tim mạch · Chuyển hóa · Cơ xương'} desc={eTc[7]?.desc || 'Từ kiến thức về nguy cơ đến hành động cụ thể phòng bệnh tim mạch, tiểu đường và cơ xương khớp.'} features={eTc[7]?.features || ['5 nhóm bệnh quan trọng nhất', 'Hành động phòng ngừa cụ thể', 'Liên kết với Trụ cột A–D', 'Habit Risk Map cá nhân']} stats={[{ v: '5', l: eTc[7]?.stats?.[0]?.l || 'Nhóm bệnh' }, { v: '150ph', l: eTc[7]?.stats?.[1]?.l || 'Vận động/tuần' }]} image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" imageAlt="Prevention" cta={eTc[7]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/self-monitoring" color="#14b8a6" rgb="20,184,166" icon="📈" category={eTc[8]?.category || 'Tự Theo Dõi'} title={eTc[8]?.title || 'Self-Monitoring Tại Nhà'} accent={eTc[8]?.accent || 'Xu hướng · Không ám ảnh'} desc={eTc[8]?.desc || 'Hướng dẫn theo dõi chỉ số đúng cách: đo gì, khi nào, bao nhiêu lần và nhìn xu hướng thế nào.'} features={eTc[8]?.features || ['Lịch theo dõi 7 chỉ số chính', '5 câu tự đánh giá hằng ngày', 'Nhật ký cân nặng & vòng eo', 'Dashboard 12 tuần đơn giản']} stats={[{ v: '7', l: eTc[8]?.stats?.[0]?.l || 'Chỉ số theo dõi' }, { v: '5ph', l: eTc[8]?.stats?.[1]?.l || 'Mỗi ngày' }]} image="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80" imageAlt="Self Monitoring" cta={eTc[8]?.cta || 'Xem chi tiết →'} />
          <TeaserCard to="/pillar/e/checkup" color="#84cc16" rgb="132,204,22" icon="📅" category={eTc[9]?.category || 'Khám Định Kỳ'} title={eTc[9]?.title || 'Lộ Trình Khám Định Kỳ'} accent={eTc[9]?.accent || 'Theo tuổi · Theo nguy cơ'} desc={eTc[9]?.desc || 'Biết cần làm xét nghiệm gì, khi nào — không xét nghiệm quá nhiều, không bỏ sót quan trọng.'} features={eTc[9]?.features || ['Gói Health Check Basic (11 mục)', 'Gói mở rộng theo nguy cơ', 'Câu hỏi cần chuẩn bị trước khám', 'Lưu & theo dõi kết quả']} stats={[{ v: '11', l: eTc[9]?.stats?.[0]?.l || 'Xét nghiệm cơ bản' }, { v: 'Hằng năm', l: eTc[9]?.stats?.[1]?.l || 'Tần suất' }]} image="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&q=80" imageAlt="Checkup" cta={eTc[9]?.cta || 'Xem chi tiết →'} />
        </TeaserSection>

        <TeaserSection title={pillar?.e_teaser_s4 || 'Đánh Giá & Lộ Trình'}>
          <TeaserCard to="/pillar/e/assessment" color="#3b82f6" rgb="59,130,246" icon="📝" category={eTc[10]?.category || 'Kiểm Tra Kiến Thức'} title={eTc[10]?.title || 'Health Literacy Assessment'} accent={eTc[10]?.accent || '100 điểm · 7 nhóm kỹ năng'} desc={eTc[10]?.desc || 'Bài kiểm tra 20 câu giúp đánh giá mức độ kiến thức sức khỏe và gợi ý nên tập trung vào đâu.'} features={eTc[10]?.features || ['20 câu hỏi trắc nghiệm', 'Phân tích theo 7 nhóm kỹ năng', '5 cấp độ Health Literacy', 'Gợi ý module nên học tiếp']} stats={[{ v: '20', l: eTc[10]?.stats?.[0]?.l || 'Câu hỏi' }, { v: '100', l: eTc[10]?.stats?.[1]?.l || 'Điểm tối đa' }]} image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80" imageAlt="Assessment" cta={eTc[10]?.cta || 'Làm bài test →'} />
          <TeaserCard to="/pillar/e/roadmap" color="#a855f7" rgb="168,85,247" icon="🗺️" category={eTc[11]?.category || 'Lộ Trình'} title={eTc[11]?.title || 'Lộ Trình 12 Tuần Health Literacy'} accent={eTc[11]?.accent || '6 Giai đoạn · Từng bước rõ ràng'} desc={eTc[11]?.desc || 'Hành trình từ mù mờ về sức khỏe đến tự quản lý chỉ số và phòng bệnh chủ động trong 12 tuần.'} features={eTc[11]?.features || ['6 giai đoạn với mục tiêu rõ', 'Lịch 7 ngày mẫu', 'Sản phẩm cụ thể sau mỗi giai đoạn', 'Health Profile cá nhân']} stats={[{ v: '12', l: eTc[11]?.stats?.[0]?.l || 'Tuần' }, { v: '6', l: eTc[11]?.stats?.[1]?.l || 'Giai đoạn' }]} image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" imageAlt="Roadmap" cta={eTc[11]?.cta || 'Xem lộ trình →'} />
        </TeaserSection>
      </RevealBlock>

      {/* Safety disclaimer */}
      <RevealBlock delay={80} className="mt-6">
        <div className="rounded-2xl border p-5" style={{ borderColor: `${COLOR}20`, background: `${COLOR}06` }}>
          <p className="text-base text-muted leading-relaxed">
            <strong className="font-bold" style={{ color: COLOR }}>⚕️ {pillar?.e_safety_label || 'Lưu ý quan trọng:'}</strong> {pillar?.e_safety_body || 'Trụ cột E cung cấp kiến thức và công cụ tự theo dõi — không thay thế khám bệnh, chẩn đoán hoặc điều trị cá nhân hóa. Nếu có bệnh nền hoặc đang dùng thuốc đặc trị, hãy trao đổi với bác sĩ trước khi thay đổi chế độ ăn, tập luyện hoặc bổ sung sản phẩm.'}
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}
