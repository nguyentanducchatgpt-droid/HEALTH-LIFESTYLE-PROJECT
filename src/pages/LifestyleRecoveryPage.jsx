import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a78bfa';
const RGB = '167,139,250';
const ORBIT_ID = 'c-recovery-orbit-kf';

const RECOVERY_TYPES = [
  { type: 'Thụ động (Passive)', desc: 'Nằm nghỉ, ngủ, không làm gì. Cần thiết khi kiệt sức hoàn toàn hoặc bệnh.', best: 'Khi đau cấp, sốt, bệnh nặng, kiệt sức hoàn toàn', icon: '😴' },
  { type: 'Chủ động (Active)', desc: 'Vận động nhẹ giúp tăng lưu thông máu, giảm DOMS và đẩy nhanh phục hồi.', best: 'Ngày sau tập nặng, cuối tuần, ngày không tập', icon: '🚶' },
  { type: 'Phục hồi theo vùng', desc: 'Tập trung giãn cơ và bài tập nhẹ cho vùng đau mỏi cụ thể.', best: 'Đau cổ vai gáy, lưng dưới, gối mãn tính', icon: '🎯' },
];

const ROUTINE_10 = [
  { name: 'Thở cơ hoành', duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng' },
  { name: 'Shoulder roll', duration: '1 phút', note: '10 vòng trước + 10 vòng sau' },
  { name: 'Thoracic twist', duration: '1 phút', note: '8 lần mỗi bên' },
  { name: 'Hip flexor stretch', duration: '1 phút × 2', note: 'Giữ 30–45s mỗi bên' },
  { name: 'Hamstring stretch', duration: '1 phút × 2', note: 'Ngồi chân thẳng hoặc đứng cúi' },
  { name: 'Child pose + thở chậm', duration: '2 phút', note: 'Thở vào 4s, ra 6s' },
  { name: 'Đi bộ nhẹ', duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng, bình thường hóa' },
];

const ZONE_FIXES = [
  { zone: 'Cổ vai gáy', icon: '🦴', color: '#14b8a6', rgb: '20,184,166',
    cause: 'Ngồi gù, nhìn màn hình liên tục, vai xoáy vào trong',
    exercises: [
      { name: 'Chin tuck', reps: '10 lần × 2s giữ', why: 'Phục hồi đường cong cổ tự nhiên' },
      { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', why: 'Giải phóng căng cơ vai' },
      { name: 'Doorway stretch', reps: '30s × 2 lần', why: 'Mở ngực, giảm gù lưng' },
      { name: 'Scapular squeeze', reps: '15 lần × 2s giữ', why: 'Kích hoạt cơ lưng giữa yếu' },
      { name: 'Thoracic twist ngồi', reps: '8 lần mỗi bên', why: 'Cải thiện xoay lưng ngực' },
    ]
  },
  { zone: 'Lưng dưới', icon: '🫀', color: '#06b6d4', rgb: '6,182,212',
    cause: 'Ngồi lâu, cơ hông gấp căng, cơ bụng yếu',
    exercises: [
      { name: 'Dead bug', reps: '10 lần mỗi bên', why: 'Kích hoạt cơ bụng sâu an toàn' },
      { name: 'Bird-dog', reps: '10 lần mỗi bên', why: 'Ổn định lưng + kích hoạt glute' },
      { name: 'Glute bridge', reps: '15 lần × 2s giữ', why: 'Tăng cường glute giảm tải lưng' },
      { name: 'Child pose', reps: '1–2 phút', why: 'Giải phóng căng lưng dưới' },
      { name: 'Hip flexor stretch', reps: '45s mỗi bên', why: 'Giải phóng co cứng hông gấp' },
    ]
  },
  { zone: 'Gối', icon: '🦵', color: '#a78bfa', rgb: '167,139,250',
    cause: 'Yếu glute + quad, overuse, tư thế valgus',
    exercises: [
      { name: 'Sit-to-stand chậm', reps: '10 lần, kiểm soát', why: 'Tăng sức mạnh quad + glute an toàn' },
      { name: 'Glute bridge một chân', reps: '8–10 lần mỗi bên', why: 'Cân bằng sức mạnh 2 bên' },
      { name: 'Calf raise', reps: '15–20 lần', why: 'Hỗ trợ bơm máu về tim' },
      { name: 'Terminal knee extension', reps: '15 lần', why: 'Kích hoạt VMO — cơ bảo vệ gối' },
      { name: 'Hamstring stretch nhẹ', reps: '30s mỗi bên', why: 'Giảm lực kéo sau gối' },
    ]
  },
];

const ACTIVE_RECOVERY_BY_GOAL = [
  { goal: 'Giảm mỡ', activities: 'Đi bộ nhẹ 20–30 phút, mobility 10 phút, giãn cơ tối', note: 'Tránh tập nặng ngày phục hồi' },
  { goal: 'Tăng cơ', activities: 'Đi bộ 15–20 phút, stretching, foam rolling nhẹ', note: 'Ngủ đủ 7–9h là ưu tiên số 1' },
  { goal: 'Sức bền', activities: 'Đạp/đi bộ/bơi Zone 1–2 (nhịp tim dưới 130)', note: 'Active recovery giảm lactate tốt hơn nghỉ hoàn toàn' },
  { goal: 'Đau mỏi mãn tính', activities: 'Mobility nhẹ cho vùng đau, thở chậm, đi bộ ngắn', note: 'Vận động nhẹ thường tốt hơn nghỉ ngơi hoàn toàn' },
  { goal: 'Stress cao', activities: 'Đi bộ ngoài trời, thở cơ hoành, giãn cơ tối', note: 'Thiên nhiên + vận động nhẹ = double effect giảm cortisol' },
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

export default function LifestyleRecoveryPage() {
  const [openZone, setOpenZone] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-rec-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cRecSpin { to { --c-rec-angle: 360deg; } }
      .c-rec-ring {
        background: conic-gradient(from var(--c-rec-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cRecSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-sm mb-8 hover:text-violet-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🔄
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight">Phục Hồi Chủ Động</h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C4 — Active Recovery · 3 vùng đau mỏi
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Ngày phục hồi không phải ngày bỏ cuộc. Ngày phục hồi là ngày chương trình giúp bạn bền hơn, tiến xa hơn.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-rec-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop"
              alt="Phục hồi" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Mobility · Giãn cơ · Thở chậm
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Recovery types */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>3 Loại Phục Hồi</h2>
        <div className="grid gap-4">
          {RECOVERY_TYPES.map((r, i) => (
            <div key={i} className="p-4 rounded-xl border" style={{ borderColor: `rgba(${RGB},0.15)`, background: `rgba(${RGB},0.05)` }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{r.icon}</span>
                <span className="font-bold text-text">{r.type}</span>
              </div>
              <p className="text-muted text-sm mb-2">{r.desc}</p>
              <p className="text-xs" style={{ color: COLOR }}><strong>Dùng khi:</strong> {r.best}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 10-min routine */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Routine Phục Hồi 10 Phút</h2>
        <p className="text-muted text-sm mb-6">Routine mẫu cho ngày sau tập nặng hoặc ngày cảm thấy căng cơ.</p>
        <div className="space-y-2">
          {ROUTINE_10.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <span className="text-xs font-bold tabular-nums w-20 shrink-0" style={{ color: COLOR }}>{r.duration}</span>
              <div>
                <div className="text-sm font-semibold text-text">{r.name}</div>
                <div className="text-xs text-muted">{r.note}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Zone fixes */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Phục Hồi Theo Vùng Đau Mỏi</h2>
        <p className="text-muted text-sm mb-6">Chọn vùng đang đau mỏi để xem bài tập phù hợp.</p>
        <div className="space-y-3">
          {ZONE_FIXES.map((z, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: `rgba(${RGB},0.15)` }}>
              <button onClick={() => setOpenZone(openZone === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left" style={{ background: `rgba(${RGB},0.06)` }}>
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{z.icon}</span>
                  <div>
                    <div className="font-bold text-text">{z.zone}</div>
                    <div className="text-xs text-muted">{z.cause}</div>
                  </div>
                </span>
                <span style={{ color: COLOR }}>{openZone === i ? '▲' : '▼'}</span>
              </button>
              {openZone === i && (
                <div className="p-4 space-y-3">
                  {z.exercises.map((ex, j) => (
                    <div key={j} className="flex justify-between items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: `rgba(${z.rgb},0.1)` }}>
                      <div>
                        <div className="text-sm font-semibold text-text">{ex.name}</div>
                        <div className="text-xs text-muted">{ex.why}</div>
                      </div>
                      <span className="text-xs font-semibold tabular-nums shrink-0" style={{ color: z.color }}>{ex.reps}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted pt-1">⚠️ Dừng ngay nếu cảm thấy đau nhói, tê lan hoặc yếu chân tay.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Active recovery by goal */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Active Recovery Theo Mục Tiêu</h2>
        <div className="space-y-3">
          {ACTIVE_RECOVERY_BY_GOAL.map((g, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-text text-sm" style={{ color: COLOR }}>{g.goal}</span>
              </div>
              <p className="text-sm text-muted mb-1">{g.activities}</p>
              <p className="text-xs text-muted italic">{g.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sample recovery day */}
      <RevealBlock className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>Ngày Phục Hồi Mẫu</h2>
        <p className="text-muted text-sm mb-6">Một ngày phục hồi không có nghĩa là nằm im cả ngày.</p>
        <div className="space-y-3">
          {[
            { time: 'Sáng', action: 'Ánh sáng + đi bộ nhẹ 10 phút' },
            { time: 'Trưa', action: 'Đi bộ 5 phút sau ăn' },
            { time: 'Chiều', action: 'Mobility 10 phút (vùng hay đau mỏi)' },
            { time: 'Tối', action: 'Giãn cơ nhẹ + thở chậm 5 phút' },
            { time: 'Đêm', action: 'Ngủ sớm hơn 30 phút so với ngày thường' },
          ].map((row, i) => (
            <div key={i} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)` }}>
              <span className="w-14 text-xs font-bold shrink-0" style={{ color: COLOR }}>{row.time}</span>
              <span className="text-sm text-muted">{row.action}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/neat" className="text-muted hover:text-violet-400 transition-colors text-sm">← NEAT</Link>
        <Link to="/pillar/c/deload" className="text-sm font-semibold" style={{ color: COLOR }}>Deload →</Link>
      </div>
    </div>
  );
}
