import { useState } from 'react';
import { Link } from 'react-router-dom';
import WorkoutFramework from '../components/WorkoutFramework';

const MS = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.3)'  },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.3)' },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   glow:'rgba(20,184,166,0.3)' },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.3)' },
};

const DAILY_BLOCKS = [
  {
    time: '5 phút', name: 'Khởi Động', icon: '🔥', color: 'orange',
    img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&q=70',
    goal: 'Tăng nhiệt cơ thể, bôi trơn khớp, kích hoạt hệ thần kinh — giảm nguy cơ chấn thương',
    steps: [
      { name: 'Thở cơ hoành',   how: 'Tay đặt lên bụng, bụng phồng khi hít vào, thở ra chậm qua miệng',        duration: '4–6 nhịp' },
      { name: 'Đi bộ tại chỗ',  how: 'Nâng gối vừa phải, vai thả lỏng, nhịp nhàng đều đặn',                     duration: '60 giây'  },
      { name: 'Xoay vai',       how: 'Xoay chậm về phía sau, không rút cổ, cảm nhận sự giãn ra',                duration: '10 vòng'  },
      { name: 'Ép bờ vai',      how: 'Kéo nhẹ hai vai về sau, mở ngực, giữ 1–2 giây mỗi lần',                   duration: '10 lần'   },
      { name: 'Gập hông cơ bản',how: 'Đẩy hông ra sau, lưng thẳng, gối hơi chùng — không cúi bằng lưng',        duration: '8 lần'    },
      { name: 'Ngồi xuống ghế', how: 'Ngồi xuống rồi đứng lên kiểm soát, không "rơi" xuống ghế',                duration: '8 lần'    },
    ],
    tips: [
      'Không bỏ qua dù đang vội — 5 phút này giảm đáng kể nguy cơ chấn thương',
      'Cơ thể cần 3–5 phút để tăng nhiệt độ cơ lên mức an toàn (38°C)',
      'Thở sâu đầu tiên giúp "bật" hệ thần kinh phó giao cảm → cơ thả lỏng tốt hơn',
    ],
  },
  {
    time: '10–20 phút', name: 'Vận Động Chính', icon: '💪', color: 'green',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70',
    goal: 'Kích thích cơ bắp & hệ tim mạch — đây là phần tạo ra sự thích nghi và tiến bộ',
    options: [
      {
        name: 'Sức Mạnh', icon: '🏋️', days: 'T2 · T4 · T6',
        exercises: [
          { name: 'Gập chân (Squat)',       sets: '2–3 × 10–12 lần'  },
          { name: 'Bước tấn (Lunge)',        sets: '2–3 × 10 lần/bên' },
          { name: 'Chống đẩy (Push-up)',     sets: '2–3 × 8–12 lần'   },
          { name: 'Kéo dây / khăn (Row)',    sets: '2–3 × 10–12 lần'  },
          { name: 'Cầu mông (Glute Bridge)', sets: '2–3 × 12–15 lần'  },
          { name: 'Gập hông (Romanian DL)',  sets: '2–3 × 10 lần'     },
          { name: 'Tư thế ván (Plank)',      sets: '2–3 × 20–40 giây' },
          { name: 'Superman (Lưng dưới)',    sets: '2–3 × 12 lần'     },
        ],
        note: 'Nghỉ 60–90 giây giữa các hiệp. Tăng tải ≤ 10%/tuần.',
      },
      {
        name: 'Tim Mạch', icon: '🏃', days: 'T3 · T5',
        exercises: [
          { name: 'Chạy bộ nhẹ Zone 2',     sets: '15–20 phút'   },
          { name: 'Đi bộ nhanh ngoài trời', sets: '15–20 phút'   },
          { name: 'Đạp xe nhẹ nhàng',       sets: '15–20 phút'   },
          { name: 'Leo cầu thang',           sets: '10–15 phút'   },
          { name: 'Nhảy dây nhẹ',           sets: '5–10 phút'    },
          { name: 'Nhịp tim mục tiêu',       sets: '50–70% HRmax' },
        ],
        note: 'HRmax ≈ 220 − tuổi. Có thể nói chuyện được là đúng vùng.',
      },
    ],
    tips: [
      'Chất lượng > số lượng — form chuẩn trước, tăng tải sau',
      'Uống nước ngay khi khát, đừng chờ đến khi rất khát',
      'Nếu quá mệt sau bài: giảm 1 hiệp hoặc giảm tải — tiến bộ dần đều mới bền vững',
    ],
  },
  {
    time: '5–10 phút', name: 'Giãn Cơ & Hạ Nhiệt', icon: '🧘', color: 'teal',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=70',
    goal: 'Phục hồi nhịp tim, tăng linh hoạt, giảm đau cơ hôm sau — không bỏ qua bước này',
    steps: [
      { name: 'Giãn gấp hông', how: 'Quỳ một chân, đẩy hông nhẹ về trước — cảm nhận căng trước đùi',  duration: '30 giây/bên' },
      { name: 'Giãn đùi sau',  how: 'Duỗi một chân, gập người nhẹ, lưng không gù quá mức',              duration: '30 giây/bên' },
      { name: 'Mở ngực',       how: 'Dan hai tay sau lưng hoặc chống tay vào cửa, ngực mở ra trước',     duration: '30 giây'     },
      { name: 'Tư thế em bé',  how: 'Ngồi về gót, vươn tay ra trước, thở chậm, cảm nhận lưng giãn',     duration: '30–60 giây'  },
      { name: 'Thở chậm',      how: 'Hít vào 4 giây, thở ra 6 giây — chú ý bụng phồng xẹp',             duration: '4–6 nhịp'    },
    ],
    tips: [
      'Giữ mỗi động tác ≥ 20 giây để cơ thực sự được kéo giãn',
      'Không nín thở — thở đều đặn giúp cơ mềm và dễ giãn hơn',
      'Cảm giác căng nhẹ là bình thường — đau nhói là dừng ngay',
    ],
  },
  {
    time: '5 phút', name: 'Tĩnh Tâm', icon: '🌿', color: 'purple',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=70',
    goal: 'Hạ cortisol, củng cố ký ức vận động, chuyển não từ chế độ "nỗ lực" sang "phục hồi"',
    steps: [
      { name: 'Ngồi/nằm thoải mái', how: 'Đặt tay lên bụng, nhắm mắt nhẹ hoặc nhìn xuống',                                    duration: '30 giây'  },
      { name: 'Thở hộp (Box)',       how: 'Hít vào 4s → giữ 4s → thở ra 4s → giữ 4s — lặp 2–3 vòng',                         duration: '2–3 phút' },
      { name: 'Quét cơ thể',         how: 'Nhận biết từng vùng từ đầu đến chân — cảm nhận không phán xét',                     duration: '1 phút'   },
      { name: 'Ghi nhận tích cực',   how: 'Nghĩ đến 1 điều tốt trong buổi tập: đã hoàn thành, cảm thấy khỏe, bước tiến nào đó',duration: '30 giây'  },
      { name: 'Đặt ý định',          how: 'Quyết định 1 điều muốn làm tốt trong phần còn lại của ngày',                        duration: '30 giây'  },
    ],
    tips: [
      'Không cần "đầu óc trống rỗng" — chỉ cần quan sát, không phán xét',
      '5 phút thiền sau tập giúp cortisol giảm 15–20%',
      'Đây là lúc não bộ củng cố và ghi nhớ các vận động mới học — đừng lướt điện thoại ngay',
    ],
  },
];

export default function PillarAFramework() {
  const [activeDayBlock, setActiveDayBlock] = useState(0);

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── Sub-page hero ──────────────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 overflow-hidden mb-10" style={{ minHeight: 230 }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=60"
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.12 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/65 to-bg pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-bg/70 pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-orange-500/6 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-10 pb-8 animate-fade-in-up">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-5 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
            <span className="text-border/60">/</span>
            <Link to="/pillar/a" className="hover:text-accent transition-colors">Vận Động & Tập Luyện</Link>
            <span className="text-border/60">/</span>
            <span className="text-orange-400 font-medium">Khung Ngày & Thời Gian</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-orange-500/8 border border-orange-500/20 text-orange-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shrink-0" />
            2 / 4 · Khung Ngày & Thời Gian
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-text leading-tight mb-3">
            Khung Ngày Tập 20–40 Phút &amp;<br />
            <span className="text-orange-400">Chọn Khung Thời Gian Luyện Tập</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-xl">
            4 khối thời gian trong ngày và 8 mức thời gian từ 20 đến 180 phút — tìm lịch phù hợp
            với cuộc sống và mức độ hiện tại của bạn.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { n: '4', label: 'Khối trong ngày' },
              { n: '8', label: 'Mức: 20–180 phút' },
              { n: '7', label: 'Kcal/phút tối đa' },
              { n: '100+', label: 'Bài tập mẫu' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-surface/70 backdrop-blur-sm border border-border/60 px-3 py-2 rounded-xl">
                <span className="text-orange-400 font-extrabold text-sm leading-none">{s.n}</span>
                <span className="text-muted text-[10px] leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Daily framework tabs ────────────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-7">
          <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm flex items-center justify-center shrink-0 font-black">⏱</span>
          <h2 className="text-2xl font-black text-text">Khung Ngày Tập 20–40 Phút</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>
        <p className="text-muted text-sm mb-6">Mỗi buổi tập được chia thành 4 khối — chọn khối để xem chi tiết từng bước</p>

        {/* Tab bar */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
          <div className="flex gap-1.5 min-w-max pb-0.5">
            {DAILY_BLOCKS.map((b, i) => {
              const s = MS[b.color];
              const isActive = activeDayBlock === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveDayBlock(i)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 focus:outline-none ${
                    isActive
                      ? `${s.bg} ${s.text} border ${s.border}`
                      : 'text-muted border border-transparent hover:border-border hover:text-text hover:bg-white/4'
                  }`}
                >
                  <span className="text-base leading-none">{b.icon}</span>
                  <span>{b.name}</span>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${
                    isActive ? 'bg-white/15 border-white/20 text-white/70' : 'bg-surface border-border text-muted'
                  }`}>
                    {b.time}
                  </span>
                  {isActive && <span className={`absolute bottom-0 inset-x-3 h-0.5 ${s.bar} rounded-full`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active block panel */}
        {(() => {
          const b = DAILY_BLOCKS[activeDayBlock];
          const s = MS[b.color];
          return (
            <div key={activeDayBlock} className={`relative overflow-hidden rounded-3xl border ${s.border} animate-fade-in-up`}>
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${s.glow.replace('0.3)', '0.6)')}, transparent)` }} />

              {/* Image header */}
              <div className="relative h-52 overflow-hidden">
                <img src={b.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center text-2xl shrink-0`}>{b.icon}</div>
                    <div>
                      <h3 className={`font-black text-xl ${s.text}`}>{b.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.border} ${s.text}`}>{b.time}</span>
                    </div>
                  </div>
                  <p className="text-white/65 text-xs leading-relaxed max-w-xl">{b.goal}</p>
                </div>
              </div>

              <div className="p-5 md:p-6">
                {b.options ? (
                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    {b.options.map((opt, oi) => (
                      <div key={oi} className={`rounded-2xl border ${s.border} ${s.bg} overflow-hidden`}>
                        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
                          <span className="text-lg">{opt.icon}</span>
                          <h4 className={`font-black text-sm ${s.text}`}>{opt.name}</h4>
                          <span className="ml-auto text-[10px] text-muted font-medium">{opt.days}</span>
                        </div>
                        <div className="p-3 space-y-1.5">
                          {opt.exercises.map((ex, ei) => (
                            <div key={ei} className="flex items-center justify-between bg-bg/70 border border-border/40 rounded-xl px-3 py-2.5 hover:border-border-bright transition-colors">
                              <span className="text-xs text-text">{ex.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ml-2 ${s.bg} ${s.border} ${s.text}`}>{ex.sets}</span>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 pb-3">
                          <p className="text-[10px] text-muted/60 italic">{opt.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    {b.steps.map((step, si) => (
                      <div key={si} className="flex items-start gap-3 bg-bg/60 border border-border/40 rounded-xl px-4 py-3 hover:border-border-bright transition-colors duration-150">
                        <span className={`w-6 h-6 rounded-full ${s.bg} border ${s.border} ${s.text} text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5`}>{si + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text">{step.name}</p>
                          <p className="text-[10px] text-muted mt-0.5 leading-snug">{step.how}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap mt-0.5 ${s.bg} ${s.border} ${s.text}`}>{step.duration}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                <div className="relative overflow-hidden rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="absolute top-0 left-0 w-0.5 h-full" style={{ background: `linear-gradient(180deg, ${s.glow}, transparent)` }} />
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-3">💡 Lưu ý quan trọng</p>
                  <ul className="space-y-2">
                    {b.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-text/80 leading-relaxed">
                        <span className={`${s.text} shrink-0 mt-0.5 font-bold`}>·</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── WorkoutFramework (8 duration levels) ─────────────────────────────────── */}
      <WorkoutFramework />

      {/* ── Bottom navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-8 border-t border-border/40 mt-8 mb-4">
        <Link
          to="/pillar/a/movements"
          className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Vận Động & Khởi Động</span>
        </Link>
        <Link
          to="/pillar/a"
          className="flex items-center gap-2 text-xs bg-surface border border-border rounded-xl px-4 py-2 text-muted hover:text-text hover:border-orange-500/30 transition-all"
        >
          <span>↩</span>
          <span>Về tổng quan</span>
        </Link>
        <Link
          to="/pillar/a/weekly"
          className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors group"
        >
          <span>Nhịp Tuần & Mục Tiêu</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
