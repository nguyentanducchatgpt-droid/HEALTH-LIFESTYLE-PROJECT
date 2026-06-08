import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#8b5cf6';
const RGB = '139,92,246';
const ORBIT_ID = 'd-stress-orbit-kf';
const ORBIT_PROP = '--d-stress-angle';
const ORBIT_CLASS = 'd-stress-orbit-ring';

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

const LAYERS = [
  { icon: '💪', title: 'Tầng Cơ Thể', color: '#f97316', signs: ['Tim đập nhanh, hồi hộp', 'Căng cổ vai gáy', 'Thở nông, thở nhanh', 'Đau đầu, khó ngủ', 'Mệt mỏi không rõ nguyên nhân'] },
  { icon: '😤', title: 'Tầng Cảm Xúc', color: '#ec4899', signs: ['Dễ cáu bẳn, mất kiên nhẫn', 'Lo lắng, bất an', 'Buồn bực, chán nản', 'Cảm giác quá tải', 'Khó tập trung, đãng trí'] },
  { icon: '🔄', title: 'Tầng Hành Vi', color: '#6366f1', signs: ['Ăn vặt nhiều hơn', 'Lướt điện thoại vô thức', 'Trì hoãn việc quan trọng', 'Bỏ tập, bỏ thói quen', 'Thức khuya, ngủ nướng'] },
];

const LOOPS = [
  {
    title: 'Vòng lặp công việc',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Deadline gấp, sếp hối' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Không xong được đâu"' },
      { icon: '😟', label: 'Cảm xúc', text: 'Panic, tê liệt' },
      { icon: '📱', label: 'Hành vi', text: 'Trì hoãn, làm việc khác' },
      { icon: '💢', label: 'Hậu quả', text: 'Deadline gần hơn, panic tăng' },
    ],
    breakpoint: 'Thở 4 vòng → viết "việc nhỏ tiếp theo là..."',
  },
  {
    title: 'Vòng lặp mạng xã hội',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Buồn chán, rảnh rỗi' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Xem 5 phút thôi"' },
      { icon: '😟', label: 'Cảm xúc', text: 'So sánh, tự ti' },
      { icon: '📱', label: 'Hành vi', text: 'Cuộn mãi, 1 giờ trôi qua' },
      { icon: '💢', label: 'Hậu quả', text: 'Mất thời gian, cảm thấy tệ hơn' },
    ],
    breakpoint: 'Tắt màn hình → đi bộ 5 phút → uống nước',
  },
  {
    title: 'Vòng lặp ăn uống',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Stress, buồn, bắt buộc' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Ăn cho khuây"' },
      { icon: '😟', label: 'Cảm xúc', text: 'An tâm tức thời' },
      { icon: '🍕', label: 'Hành vi', text: 'Ăn vặt, ăn quá nhiều' },
      { icon: '💢', label: 'Hậu quả', text: 'Mặc cảm, ăn thêm để xoa dịu' },
    ],
    breakpoint: 'Dừng 10 giây: "Mình đói hay mệt?" → thở 1 phút',
  },
];

const TECHNIQUES = [
  { icon: '🏷️', title: 'Đặt tên cho suy nghĩ', desc: 'Thay vì "Tôi thất bại rồi" → đổi thành "Tôi đang có suy nghĩ rằng mình thất bại." Tạo khoảng cách giữa bạn và suy nghĩ.', example: '"Mình đang bận tâm về X" thay vì "X là sự thật"' },
  { icon: '🔵', title: 'Vòng tròn kiểm soát', desc: 'Chia lo âu thành 2 nhóm: Tôi kiểm soát được (giờ ngủ, bữa ăn, cách phản ứng) vs Tôi không kiểm soát được (ý kiến người khác, kết quả tuyệt đối). Chỉ hành động với nhóm đầu.', example: 'Viết 2 cột, tập trung hành động vào cột trái' },
  { icon: '🔍', title: 'Tìm bằng chứng', desc: 'Khi có suy nghĩ tiêu cực, hỏi: "Có bằng chứng chắc chắn không? Có cách diễn giải khác không?" Não thường phóng đại mối nguy.', example: '"Mình mắc lỗi" → "Mình mắc lỗi một lần, không có nghĩa mình luôn mắc lỗi"' },
  { icon: '⏸️', title: 'Điểm dừng nhỏ', desc: 'Mục tiêu của Trụ cột D không phải xóa sạch lo âu, mà là chèn một điểm dừng nhỏ vào vòng lặp. Điểm dừng có thể là: thở 1 phút, viết 5 dòng, đi bộ 5 phút, tắt màn hình 10 phút.', example: 'Khi cảm thấy căng: dừng → thở → gọi tên cảm xúc → chọn việc nhỏ tiếp theo' },
];

export default function MindStressPage() {
  const [openLoop, setOpenLoop] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dStressOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dStressOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Tâm Trí An Nhiên
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🌪️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Hiểu Stress & Vòng Lặp Lo Âu</h1>
          <span className="inline-block text-sm font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>D1 · Nền Tảng</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Stress không xấu. Stress giúp bạn tập trung và hành động. Vấn đề chỉ xảy ra khi stress kéo dài, không được xả và hình thành vòng lặp lo âu–thói quen. Hiểu cơ chế là bước đầu để phá vỡ vòng lặp đó.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop" alt="Stress" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-sm font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>3 tầng stress · Vòng lặp lo âu · Kỹ thuật phá vỡ</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Good vs bad stress */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Stress Tốt vs Stress Xấu</h2>
        <p className="text-muted text-base mb-6">Không phải stress nào cũng cần loại bỏ.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
            <div className="text-base font-bold text-text mb-3">✅ Stress tích cực (Eustress)</div>
            <ul className="space-y-2">
              {['Giúp tập trung cao độ khi cần', 'Thúc đẩy hoàn thành deadline', 'Cảm giác hứng khởi trước thử thách', 'Kéo dài ngắn, kết thúc rõ ràng'].map(s => <li key={s} className="text-sm text-muted flex items-start gap-2"><span className="text-green-400">→</span>{s}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.05)` }}>
            <div className="text-base font-bold text-text mb-3">⚠️ Stress mãn tính (Distress)</div>
            <ul className="space-y-2">
              {['Kéo dài nhiều ngày, không được xả', 'Ảnh hưởng ngủ, ăn, tập luyện', 'Cảm xúc không ổn định', 'Hình thành vòng lặp lo âu–thói quen'].map(s => <li key={s} className="text-sm text-muted flex items-start gap-2"><span style={{ color: COLOR }}>→</span>{s}</li>)}
            </ul>
          </div>
        </div>
      </RevealBlock>

      {/* 3 layers */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Tầng Của Stress</h2>
        <p className="text-muted text-base mb-6">Stress biểu hiện ở cả 3 tầng cùng lúc — nhận diện tầng nào đang ảnh hưởng bạn nhiều nhất.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {LAYERS.map(l => (
            <div key={l.title} className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-4xl mb-3">{l.icon}</div>
              <div className="text-base font-bold mb-3" style={{ color: l.color }}>{l.title}</div>
              <ul className="space-y-1">
                {l.signs.map(s => <li key={s} className="text-sm text-muted flex items-start gap-2"><span style={{ color: l.color }}>·</span>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Anxiety loops */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vòng Lặp Lo Âu – Thói Quen</h2>
        <p className="text-muted text-base mb-6">Mục tiêu không phải xóa sạch lo âu — mà là chèn một điểm dừng nhỏ vào vòng lặp.</p>
        <div className="space-y-3">
          {LOOPS.map((loop, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpenLoop(openLoop === i ? null : i)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
                <span className="text-base font-medium text-text flex-1">{loop.title}</span>
                <span className="text-muted text-sm">{openLoop === i ? '▲' : '▼'}</span>
              </button>
              {openLoop === i && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {loop.steps.map((s, si) => (
                      <div key={si} className="flex items-center gap-1">
                        <div className="rounded-lg p-2 text-center min-w-[80px]" style={{ background: `rgba(${RGB},0.08)` }}>
                          <div className="text-xl">{s.icon}</div>
                          <div className="text-sm font-bold mt-0.5" style={{ color: COLOR }}>{s.label}</div>
                          <div className="text-sm text-muted mt-0.5 leading-tight">{s.text}</div>
                        </div>
                        {si < loop.steps.length - 1 && <span className="text-muted text-sm">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3 text-sm border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
                    🔧 <strong style={{ color: COLOR }}>Điểm dừng:</strong> {loop.breakpoint}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Phá Vòng Lặp</h2>
        <p className="text-muted text-base mb-6">Công cụ nhận thức giúp tạo khoảng cách giữa bạn và phản ứng tự động.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {TECHNIQUES.map(t => (
            <div key={t.title} className="rounded-2xl border border-border bg-surface p-5 hover:border-violet-500/20 transition-colors">
              <div className="text-3xl mb-3">{t.icon}</div>
              <div className="text-base font-bold text-text mb-2">{t.title}</div>
              <p className="text-sm text-muted leading-relaxed mb-3">{t.desc}</p>
              <div className="rounded-lg p-2 text-sm italic text-muted border border-border">💡 {t.example}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Stress levels */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thang Đo Stress 0–10</h2>
        <p className="text-muted text-base mb-6">Chấm điểm mỗi ngày để nhận diện xu hướng trước khi stress leo thang.</p>
        <div className="space-y-2">
          {[
            { range: '0–2', label: 'Bình thường', desc: 'Cơ thể và tâm trí ổn định. Tiếp tục duy trì.', color: '#10b981' },
            { range: '3–4', label: 'Nhẹ', desc: 'Có áp lực nhưng kiểm soát được. Dùng Reset 2 phút.', color: '#84cc16' },
            { range: '5–6', label: 'Trung bình', desc: 'Ảnh hưởng tập trung. Nên dùng box breathing + journal.', color: '#f59e0b' },
            { range: '7–8', label: 'Cao', desc: 'Căng thẳng rõ ràng. Ưu tiên nghỉ ngơi, giảm kỳ vọng.', color: '#f97316' },
            { range: '9–10', label: 'Nguy hiểm', desc: 'Không tự xử lý được. Hỏi người thân hoặc chuyên gia.', color: '#ef4444' },
          ].map(s => (
            <div key={s.range} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-surface">
              <div className="text-base font-bold w-12 text-center shrink-0" style={{ color: s.color }}>{s.range}</div>
              <div className="w-16 shrink-0 text-sm font-bold" style={{ color: s.color }}>{s.label}</div>
              <div className="text-sm text-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Tâm Trí An Nhiên
        </Link>
        <Link to="/pillar/d/breathing" className="flex items-center gap-2 text-base text-muted hover:text-text transition-colors group justify-end">
          Kỹ Thuật Thở
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
