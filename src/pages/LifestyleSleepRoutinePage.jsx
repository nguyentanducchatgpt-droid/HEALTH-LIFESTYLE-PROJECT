import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-sroutine-orbit-kf';

const ROUTINE_60 = [
  { time: 'Trước ngủ 60 phút', action: 'Ngưng việc nặng, chốt công việc ngày mai', icon: '📋' },
  { time: 'Trước ngủ 50 phút', action: 'Kiểm tra tin nhắn lần cuối, sau đó đặt điện thoại đi', icon: '📱' },
  { time: 'Trước ngủ 45 phút', action: 'Giảm đèn phòng, bật đèn ngủ ấm', icon: '💡' },
  { time: 'Trước ngủ 40 phút', action: 'Tắm ấm hoặc rửa mặt, vệ sinh cá nhân', icon: '🚿' },
  { time: 'Trước ngủ 30 phút', action: 'Giãn cơ nhẹ: cổ vai gáy, lưng, hông (5–10 phút)', icon: '🧘' },
  { time: 'Trước ngủ 20 phút', action: 'Đọc sách giấy hoặc nghe nhạc nhẹ', icon: '📚' },
  { time: 'Trước ngủ 10 phút', action: 'Thở chậm cơ hoành 3–5 phút', icon: '🌬️' },
  { time: 'Lên giường', action: 'Không lướt điện thoại, nhắm mắt thư giãn', icon: '😴' },
];

const ROUTINE_10 = [
  { step: 1, action: 'Tắt màn hình và đặt điện thoại ra xa', duration: '1 phút' },
  { step: 2, action: 'Giãn cổ vai gáy nhẹ (xoay đầu, shoulder roll)', duration: '2 phút' },
  { step: 3, action: 'Child pose + vươn người (kéo căng lưng)', duration: '2 phút' },
  { step: 4, action: 'Thở chậm: hít 4 giây, thở 6 giây × 5–6 vòng', duration: '2 phút' },
  { step: 5, action: 'Viết 1 dòng: "Việc quan trọng nhất ngày mai là..."', duration: '1 phút' },
  { step: 6, action: 'Lên giường, nhắm mắt, tiếp tục thở chậm', duration: '2 phút' },
];

const STRETCH_EXERCISES = [
  { name: 'Chin tuck', reps: '10 lần × 2s giữ', muscles: 'Cổ trước', icon: '🦴' },
  { name: 'Shoulder roll', reps: '10 vòng × 2 chiều', muscles: 'Vai, cổ', icon: '💫' },
  { name: 'Thoracic twist', reps: '8 lần mỗi bên', muscles: 'Lưng trên', icon: '🔄' },
  { name: 'Child pose', reps: '1–2 phút giữ', muscles: 'Lưng dưới, hông', icon: '🧘' },
  { name: 'Hip flexor stretch', reps: '1 phút mỗi bên', muscles: 'Gấp hông, đùi trước', icon: '🦵' },
  { name: 'Legs up the wall', reps: '2–5 phút', muscles: 'Giảm sưng chân, thư giãn', icon: '🦶' },
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

export default function LifestyleSleepRoutinePage() {
  const [mode, setMode] = useState('60');

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --c-sr-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cSrSpin { to { --c-sr-angle: 360deg; } }
      .c-sr-ring {
        background: conic-gradient(from var(--c-sr-angle),transparent 0deg,transparent 55deg,rgba(${RGB},0) 65deg,rgba(${RGB},0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(${RGB},0.75) 99deg,rgba(${RGB},0) 115deg,transparent 125deg,transparent 360deg);
        animation: cSrSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-base mb-8 hover:text-teal-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🌙
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Routine Trước Ngủ</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C1 — 10 đến 60 phút · Reset 7 ngày
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Routine trước ngủ giúp chuyển cơ thể từ "chế độ làm việc" sang "chế độ phục hồi". Không cần hoàn hảo — chỉ cần có tín hiệu nhất quán.
          </p>
        </div>
      </div>

      <RevealBlock className="mb-12">
        <div className="c-sr-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop"
              alt="Routine trước ngủ" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9), rgba(10,10,10,0.3) 50%, transparent)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${RGB},0.2)` }}>
                Giảm màn hình · Giãn cơ · Thở chậm
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Why routine */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Cần Routine Trước Ngủ?</h2>
        <p className="text-muted text-base mb-6">Não cần tín hiệu để chuyển từ "mode tỉnh táo" sang "mode ngủ". Routine là bộ tín hiệu đó.</p>
        <div className="grid gap-3">
          {[
            { icon: '🧠', title: 'Giảm cortisol', desc: 'Hormone stress cortisol cần giảm để melatonin tăng. Routine nhẹ nhàng giúp hạ cortisol hiệu quả hơn việc "cố ngủ".' },
            { icon: '🌡️', title: 'Hạ nhiệt độ cơ thể', desc: 'Tắm ấm nghịch lý giúp ngủ tốt hơn: nước ấm làm giãn mạch máu → nhiệt tỏa ra → nhiệt độ cơ thể lõi giảm → dễ vào giấc.' },
            { icon: '📵', title: 'Cắt kích thích cuối ngày', desc: 'Tin tức, mạng xã hội, công việc trễ kích thích não liên tục. Routine giúp "đóng tab" cuối ngày để não nghỉ.' },
            { icon: '🎯', title: 'Tạo tín hiệu Pavlov', desc: 'Sau 2–3 tuần làm đều, routine sẽ trở thành tín hiệu conditioned — cơ thể tự bắt đầu buồn ngủ khi bắt đầu routine.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <div className="font-semibold text-text text-base mb-1">{item.title}</div>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Routine plans */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Routine Mẫu</h2>
        <p className="text-muted text-base mb-5">Chọn phiên bản phù hợp với lịch trình của bạn.</p>
        <div className="flex gap-2 mb-6">
          {['10', '60'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-4 py-2 rounded-lg text-base font-semibold transition-all"
              style={mode === m
                ? { background: `rgba(${RGB},0.15)`, color: COLOR, border: `1px solid rgba(${RGB},0.3)` }
                : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
              {m === '10' ? '10 phút rút gọn' : '60 phút đầy đủ'}
            </button>
          ))}
        </div>

        {mode === '10' ? (
          <div className="space-y-3">
            {ROUTINE_10.map((row, i) => (
              <div key={i} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: `rgba(${RGB},0.05)`, border: `1px solid rgba(${RGB},0.1)` }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-base font-bold"
                  style={{ background: COLOR, color: 'black' }}>{row.step}</div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-text">{row.action}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums shrink-0" style={{ color: COLOR }}>{row.duration}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {ROUTINE_60.map((row, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
                <span className="text-2xl shrink-0">{row.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold tabular-nums mb-1" style={{ color: COLOR }}>{row.time}</div>
                  <div className="text-base text-text">{row.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* Stretching */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Giãn Cơ Trước Ngủ</h2>
        <p className="text-muted text-base mb-6">Giãn cơ nhẹ 5–10 phút trước ngủ giảm căng cơ tích lũy, tăng thư giãn và cải thiện chất lượng giấc ngủ.</p>
        <div className="grid gap-3">
          {STRETCH_EXERCISES.map((ex, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <span className="text-3xl shrink-0">{ex.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-text text-base">{ex.name}</div>
                <div className="text-sm text-muted">{ex.muscles}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums text-right" style={{ color: COLOR }}>{ex.reps}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Common mistakes */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Lỗi Thường Gặp</h2>
        <div className="grid gap-3">
          {[
            { wrong: 'Cố ngủ sớm 2–3 tiếng ngay từ ngày 1', right: 'Kéo giờ ngủ sớm dần 15–30 phút mỗi 2–3 ngày' },
            { wrong: 'Xem phim trên điện thoại "cho đến khi ngủ được"', right: 'Đặt điện thoại ra xa và đọc sách giấy thay thế' },
            { wrong: 'Ngủ bù vào cuối tuần đến trưa', right: 'Dậy không quá 1 tiếng sau giờ thường — tránh lệch nhịp' },
            { wrong: 'Uống rượu để "dễ ngủ hơn"', right: 'Rượu giúp vào giấc nhưng phá giấc ngủ sâu và REM' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                <span className="text-base text-muted">{item.wrong}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5" style={{ color: COLOR }}>✓</span>
                <span className="text-base text-text">{item.right}</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/sleep" className="text-muted hover:text-teal-400 transition-colors text-base">← Khoa Học Giấc Ngủ</Link>
        <Link to="/pillar/c/circadian" className="text-base font-semibold" style={{ color: COLOR }}>Nhịp Sinh Học →</Link>
      </div>
    </div>
  );
}
