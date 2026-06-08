import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-sleep-orbit-kf';

const SLEEP_FACTS = [
  { icon: '💪', title: 'Phục hồi cơ bắp', desc: 'Trong giai đoạn ngủ sâu (slow-wave sleep), cơ thể tiết GH — hormone tăng trưởng giúp sửa chữa mô cơ sau tập luyện.' },
  { icon: '🧠', title: 'Tăng cường trí nhớ', desc: 'Não củng cố thông tin học được trong ngày. Thiếu ngủ làm giảm khả năng học kỹ năng mới và hồi phục kỹ thuật vận động.' },
  { icon: '🍽️', title: 'Kiểm soát hormone đói', desc: 'Ngủ kém tăng ghrelin (hormone đói) và giảm leptin (hormone no). Người ngủ kém thường thèm đồ ngọt và thức ăn nhiều calo hơn.' },
  { icon: '❤️', title: 'Sức khỏe tim mạch', desc: 'Ngủ đủ giúp hạ huyết áp, giảm viêm và cân bằng nhịp tim. Ngủ dưới 6 giờ tăng nguy cơ tim mạch đáng kể.' },
  { icon: '😊', title: 'Ổn định tâm trạng', desc: 'Giấc ngủ đủ giúp kiểm soát cảm xúc tốt hơn, giảm lo âu, cáu gắt và dễ duy trì động lực tập luyện.' },
];

const SLEEP_STAGES = [
  { stage: 'N1 — Ngủ nông', time: '5–10 phút', color: '#06b6d4', desc: 'Chuyển tiếp từ thức sang ngủ. Cơ thể bắt đầu thư giãn, nhịp tim chậm lại.' },
  { stage: 'N2 — Ngủ nhẹ', time: '~50% giấc ngủ', color: '#0ea5e9', desc: 'Nhiệt độ cơ thể giảm, nhịp tim chậm hơn. Sleep spindles xuất hiện — quan trọng cho trí nhớ.' },
  { stage: 'N3 — Ngủ sâu', time: '20–25%', color: '#6366f1', desc: 'Giai đoạn phục hồi thể chất quan trọng nhất. Hormone tăng trưởng được tiết. Khó thức dậy nhất.' },
  { stage: 'REM — Mơ', time: '20–25%', color: '#a78bfa', desc: 'Não hoạt động mạnh. Củng cố trí nhớ cảm xúc, xử lý thông tin phức tạp và phục hồi tâm lý.' },
];

const TROUBLE_CASES = [
  {
    title: 'Lên giường nhưng không ngủ được',
    icon: '🛏️',
    tips: ['Không nhìn đồng hồ liên tục', 'Không cố ép ngủ — thư giãn cơ thể thay vì ép mắt nhắm', 'Thở chậm cơ hoành 3–5 phút', 'Đọc sách giấy nhẹ, không màn hình', 'Nếu nằm >30 phút không ngủ: dậy nhẹ nhàng 10 phút rồi thử lại'],
  },
  {
    title: 'Ngủ muộn vì công việc',
    icon: '💼',
    tips: ['Đặt giờ "đóng ngày" — sau giờ đó không nhận việc mới', 'Viết ra 3 việc chưa xong để đầu bớt chạy', 'Chuyển sang routine tối ngắn 10 phút', 'Không làm việc trên giường', 'Màn hình computer: dùng Night Shift/Night Mode từ 21h'],
  },
  {
    title: 'Tối rất buồn ngủ nhưng nằm xuống lại tỉnh',
    icon: '😵',
    tips: ['Nguyên nhân thường: màn hình quá sát giờ ngủ', 'Ánh sáng phòng vẫn còn mạnh', 'Lo nghĩ quá nhiều chuyện ngày mai', 'Caffeine muộn hoặc vận động quá ít ban ngày', 'Cách fix: tăng ánh sáng buổi sáng + tăng đi bộ ban ngày + journaling tối'],
  },
];

const SEVEN_DAY_PLAN = [
  { day: 'Ngày 1', focus: 'Ghi lại thật, không ép', action: 'Ghi lại giờ ngủ thực tế, không cố ngủ sớm hơn ngay' },
  { day: 'Ngày 2', focus: 'Tắt màn hình sớm hơn', action: 'Tắt màn hình sớm hơn 15 phút so với thói quen' },
  { day: 'Ngày 3', focus: 'Ánh sáng buổi sáng', action: 'Ra nắng hoặc mở rèm 5 phút sau khi thức' },
  { day: 'Ngày 4', focus: 'Ngủ sớm hơn 15 phút', action: 'Lên giường sớm hơn 15 phút so với ngày 1' },
  { day: 'Ngày 5', focus: 'Cắt caffeine muộn', action: 'Không uống caffeine sau 14–15h' },
  { day: 'Ngày 6', focus: 'Thêm routine tối', action: 'Thêm 10 phút: giãn cơ + thở chậm trước ngủ' },
  { day: 'Ngày 7', focus: 'Giữ giờ dậy ổn định', action: 'Dậy đúng giờ, không ngủ bù quá 1 tiếng cuối tuần' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </div>
  );
}

export default function LifestyleSleepPage() {
  const [openCase, setOpenCase] = useState(null);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-sleep-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cSleepSpin { to { --c-sleep-angle: 360deg; } }
      .c-sleep-ring {
        background: conic-gradient(from var(--c-sleep-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cSleepSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const checkCount = Object.values(checks).filter(Boolean).length;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-base mb-8 hover:text-teal-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          😴
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Khoa Học Giấc Ngủ</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C1 — Giấc Ngủ · Vệ Sinh Ngủ
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Ngủ không phải "thời gian chết". Đây là lúc cơ thể sửa chữa mô cơ, cân bằng hormone, củng cố trí nhớ và chuẩn bị năng lượng cho ngày hôm sau.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-sleep-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop"
              alt="Khoa học giấc ngủ" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                7–9 giờ · Ngủ đúng nhịp
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why sleep matters */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Giấc Ngủ Quan Trọng?</h2>
        <p className="text-muted text-base mb-6">Muốn khỏe bền, đừng chỉ tập thêm — hãy ngủ tốt hơn.</p>
        <div className="grid gap-3">
          {SLEEP_FACTS.map((f, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <span className="text-3xl shrink-0">{f.icon}</span>
              <div>
                <div className="font-semibold text-text text-base mb-1">{f.title}</div>
                <div className="text-muted text-sm leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sleep stages */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Giai Đoạn Giấc Ngủ</h2>
        <p className="text-muted text-base mb-6">Một chu kỳ ngủ hoàn chỉnh kéo dài ~90 phút và lặp lại 4–6 lần mỗi đêm.</p>
        <div className="space-y-3">
          {SLEEP_STAGES.map((st, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ borderColor: `${st.color}22`, background: `${st.color}08` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base" style={{ color: st.color }}>{st.stage}</span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: st.color }}>{st.time}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.07)`, border: `1px solid rgba(${RGB},0.15)` }}>
          <p className="text-sm text-muted"><strong style={{ color: COLOR }}>Lưu ý quan trọng:</strong> Giấc ngủ sâu (N3) nhiều nhất trong 3 giờ đầu đêm. REM nhiều nhất vào buổi sáng sớm. Ngủ muộn → mất giấc ngủ sâu; thức sớm → mất REM.</p>
        </div>
      </RevealBlock>

      {/* 4 steps hygiene */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vệ Sinh Giấc Ngủ 4 Bước</h2>
        <p className="text-muted text-base mb-6">Không ép ngủ hoàn hảo, mà xây môi trường để cơ thể dễ ngủ hơn.</p>
        <div className="grid gap-4">
          {[
            { num: '01', title: 'Cố định khung giờ ngủ – thức', color: COLOR, icon: '🕙',
              content: 'Không cần chính xác tuyệt đối, nhưng nên giữ lệch không quá 60 phút giữa các ngày kể cả cuối tuần. Cơ thể hoạt động theo nhịp sinh học 24h (circadian rhythm). Giờ ngủ đều giúp cơ thể dự đoán và chuẩn bị sản xuất melatonin đúng lúc.',
              tip: 'Tip: Đặt báo thức DẬY (không phải báo thức ngủ). Dậy đúng giờ quan trọng hơn ngủ đúng giờ.' },
            { num: '02', title: 'Giảm ánh sáng mạnh buổi tối', color: COLOR, icon: '💡',
              content: 'Ánh sáng xanh từ màn hình ức chế melatonin — hormone báo hiệu "đến giờ ngủ". Tắt bớt đèn, giảm độ sáng màn hình từ 21–22h. Dùng chế độ Night Shift/Night Mode trên thiết bị.',
              tip: 'Tip: Ánh sáng ấm (cam/vàng) ban đêm ít ức chế melatonin hơn ánh sáng trắng/xanh.' },
            { num: '03', title: 'Giảm kích thích trước ngủ', color: COLOR, icon: '☕',
              content: 'Caffeine có half-life 5–6 giờ — uống cà phê lúc 15h vẫn còn ½ lượng trong máu lúc 21h. Tránh tập nặng sát giờ ngủ (dưới 2 giờ). Tránh tranh luận, công việc căng thẳng, tin tức nhiều cảm xúc.',
              tip: 'Tip: Thay cà phê tối bằng trà thảo mộc ấm (gừng, hoa cúc) nếu cần uống gì đó.' },
            { num: '04', title: 'Tối ưu phòng ngủ', color: COLOR, icon: '🛏️',
              content: 'Nhiệt độ lý tưởng để ngủ: 18–21°C. Cơ thể cần nhiệt độ giảm để vào giấc ngủ sâu. Phòng tối (rèm dày hoặc mặt nạ ngủ), yên tĩnh (nút tai nếu cần). Giường chỉ dùng để ngủ — không làm việc, không xem phim trên giường.',
              tip: 'Tip: Giường = tín hiệu ngủ. Làm việc trên giường làm não liên kết giường với trạng thái tỉnh táo.' },
          ].map((step, i) => (
            <div key={i} className="p-5 rounded-2xl border" style={{ borderColor: `rgba(${RGB},0.15)`, background: `rgba(${RGB},0.04)` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl font-black tabular-nums" style={{ color: `rgba(${RGB},0.3)` }}>{step.num}</span>
                <span className="text-2xl">{step.icon}</span>
                <h3 className="font-bold text-text">{step.title}</h3>
              </div>
              <p className="text-muted text-base leading-relaxed mb-3">{step.content}</p>
              <div className="text-sm font-semibold px-3 py-1.5 rounded-lg inline-block" style={{ color: COLOR, background: `rgba(${RGB},0.1)` }}>
                💡 {step.tip}
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day reset */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Sửa Ngủ Muộn Trong 7 Ngày</h2>
        <p className="text-muted text-base mb-6">Không kéo giờ ngủ sớm quá mạnh ngay. Mỗi 2–3 ngày kéo sớm 15–30 phút để cơ thể thích nghi.</p>
        <div className="space-y-3">
          {SEVEN_DAY_PLAN.map((day, i) => (
            <div key={i} className="flex gap-4 items-start p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="shrink-0 w-16 text-center">
                <div className="text-sm font-bold tabular-nums" style={{ color: COLOR }}>{day.day}</div>
              </div>
              <div>
                <div className="font-semibold text-text text-base">{day.focus}</div>
                <div className="text-muted text-sm mt-0.5">{day.action}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Trouble cases */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Xử Lý Tình Huống Thường Gặp</h2>
        <p className="text-muted text-base mb-6">3 kịch bản phổ biến nhất và cách xử lý thực tế.</p>
        <div className="space-y-3">
          {TROUBLE_CASES.map((c, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: `rgba(${RGB},0.15)` }}>
              <button onClick={() => setOpenCase(openCase === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left" style={{ background: `rgba(${RGB},0.06)` }}>
                <span className="flex items-center gap-3 font-semibold text-text">
                  <span className="text-2xl">{c.icon}</span>{c.title}
                </span>
                <span style={{ color: COLOR }}>{openCase === i ? '▲' : '▼'}</span>
              </button>
              {openCase === i && (
                <div className="p-4 space-y-2">
                  {c.tips.map((tip, j) => (
                    <div key={j} className="flex items-start gap-2 text-base">
                      <span style={{ color: COLOR }} className="shrink-0 mt-0.5">→</span>
                      <span className="text-muted">{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Daily checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Checklist Ngủ Hằng Ngày</h2>
        <p className="text-muted text-base mb-6">Không cần đạt 5/5 mỗi ngày. Đạt 3/5 là đã tốt cho người mới bắt đầu.</p>
        <div className="space-y-3">
          {[
            'Giảm màn hình trước ngủ 30+ phút',
            'Không uống caffeine sau 15h',
            'Có routine tối ít nhất 5 phút (giãn cơ, thở, đọc sách)',
            'Lên giường trong khung giờ dự kiến',
            'Ngủ đủ hoặc tốt hơn hôm qua',
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div onClick={() => setChecks(p => ({ ...p, [i]: !p[i] }))}
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                style={{ background: checks[i] ? COLOR : 'transparent', borderColor: COLOR }}>
                {checks[i] && <span className="text-black text-sm font-bold">✓</span>}
              </div>
              <span className="text-base text-muted group-hover:text-text transition-colors">{item}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: `rgba(${RGB},0.15)` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${checkCount / 5 * 100}%`, background: COLOR }} />
        </div>
        <p className="text-sm text-muted mt-2">{checkCount}/5 — {checkCount >= 4 ? '🌟 Xuất sắc!' : checkCount >= 3 ? '✅ Tốt!' : '⏳ Đang xây dựng'}</p>
      </RevealBlock>

      {/* Safety note */}
      <RevealBlock className="mb-12">
        <div className="p-5 rounded-2xl border" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
          <h3 className="font-bold text-red-400 mb-3">⚠️ Khi Nào Cần Gặp Bác Sĩ?</h3>
          <div className="space-y-1 text-base text-muted">
            {['Mất ngủ kéo dài hơn 3–4 tuần dù đã áp dụng vệ sinh giấc ngủ', 'Ngủ 7–9 tiếng nhưng vẫn mệt mỏi suốt ngày (có thể là sleep apnea)', 'Ngáy to, ngừng thở khi ngủ', 'Chân bứt rứt khó chịu khi ngủ (restless legs)', 'Mộng du hoặc hành vi bất thường khi ngủ'].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 shrink-0">•</span>{item}
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c" className="text-muted hover:text-teal-400 transition-colors text-base">← Lối Sống Khỏe</Link>
        <Link to="/pillar/c/sleep-routine" className="text-base font-semibold" style={{ color: COLOR }}>Routine Trước Ngủ →</Link>
      </div>
    </div>
  );
}
