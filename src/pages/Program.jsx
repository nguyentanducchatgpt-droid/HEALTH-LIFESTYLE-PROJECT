import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ── RevealBlock ──────────────────────────────────────────────────────────────
function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(22px)', transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Pillar colours ───────────────────────────────────────────────────────────
const PC = {
  A: { c:'#22c55e', bg:'rgba(34,197,94,0.08)',   br:'rgba(34,197,94,0.22)',   t:'text-green-400',  l:'Vận Động',   icon:'🏃' },
  B: { c:'#84cc16', bg:'rgba(132,204,22,0.08)',  br:'rgba(132,204,22,0.22)',  t:'text-lime-400',   l:'Dinh Dưỡng', icon:'🥗' },
  C: { c:'#14b8a6', bg:'rgba(20,184,166,0.08)',  br:'rgba(20,184,166,0.22)',  t:'text-teal-400',   l:'Lối Sống',   icon:'🌿' },
  D: { c:'#a855f7', bg:'rgba(168,85,247,0.08)',  br:'rgba(168,85,247,0.22)',  t:'text-purple-400', l:'Tâm Trí',    icon:'🧘' },
  F: { c:'#f97316', bg:'rgba(249,115,22,0.08)',  br:'rgba(249,115,22,0.22)',  t:'text-orange-400', l:'Công Cụ',    icon:'🛠️' },
};

// ── Journey Detail Modal ─────────────────────────────────────────────────────
function JourneyDetailModal({ journey: j, onClose, onSelect }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${j.rgb},0.28)`, boxShadow: `0 0 80px rgba(${j.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-48 rounded-t-3xl overflow-hidden shrink-0">
          <img src={j.img} alt={j.label} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${j.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${j.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `rgba(${j.rgb},0.18)`, border: `2px solid rgba(${j.rgb},0.4)` }}>
              {j.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: j.color }}>{j.sub}</p>
              <h2 className="font-bold text-white text-xl leading-tight">{j.label}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-7">
          {/* Description */}
          <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: `rgba(${j.rgb},0.75)` }}>{j.desc}</p>

          {/* Numbered details */}
          <ul className="space-y-3 mb-6">
            {j.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${j.rgb},0.14)`, color: j.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* 2-col points */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {j.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${j.rgb},0.06)`, border: `1px solid rgba(${j.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => { onSelect(); onClose(); }}
            className="w-full py-3 rounded-2xl font-bold text-base transition-all duration-200 hover:opacity-90"
            style={{ background: `rgba(${j.rgb},0.15)`, color: j.color, border: `1px solid rgba(${j.rgb},0.3)` }}
          >
            Xem lộ trình này →
          </button>

          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ── Checklist Item Modal ─────────────────────────────────────────────────────
function ChecklistItemModal({ item, dayColor, dayRgb, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${dayRgb},0.28)`, boxShadow: `0 0 80px rgba(${dayRgb},0.14)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${dayRgb},0.06) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${dayColor}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${dayRgb},0.18)`, border: `2px solid rgba(${dayRgb},0.4)` }}>
              {item.icon}
            </div>
            <h2 className="font-bold text-white text-lg leading-tight">{item.label}</h2>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-7">
          {/* Why callout */}
          <div className="rounded-xl p-4 mb-5" style={{ background: `rgba(${dayRgb},0.07)`, border: `1px solid rgba(${dayRgb},0.2)` }}>
            <p className="text-base font-semibold leading-relaxed" style={{ color: dayColor }}>💡 {item.why}</p>
          </div>

          {/* Numbered details */}
          <ul className="space-y-3 mb-6">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${dayRgb},0.14)`, color: dayColor }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* 2-col points */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${dayRgb},0.06)`, border: `1px solid rgba(${dayRgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ── Pillar Detail Modal ──────────────────────────────────────────────────────
function PillarDetailModal({ card, onClose }) {
  const { info, p } = card;
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const rgb = p.br.match(/rgba\((\d+,\d+,\d+)/)?.[1] || '34,197,94';
  const color = p.c;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={info.img} alt={info.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {p.icon}
          </div>
          <div className="absolute bottom-5 left-24 flex flex-col justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{p.l}</span>
            <span className="font-bold text-white text-lg leading-tight">{info.title}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <p className="font-semibold text-base mb-4" style={{ color: `rgba(${rgb},0.75)` }}>{info.detail}</p>

          {/* Key note callout */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <p className="text-base font-medium leading-relaxed" style={{ color }}>💬 {info.note}</p>
          </div>

          {(info.time || info.kcal) && (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
              style={{ background: `rgba(${rgb},0.1)`, color, border: `1px solid rgba(${rgb},0.2)` }}>
              ⏱ {info.time || info.kcal}
            </div>
          )}

          {info.details && (
            <ul className="space-y-3 mb-8">
              {info.details.map((d, di) => (
                <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}

          {info.points && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {info.points.map((pt, pi) => (
                <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                  style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
                  <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                  <div>
                    <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                    <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ── 7-Day data ───────────────────────────────────────────────────────────────
const SEVEN_DAYS = [
  {
    n:1, theme:'Bắt Đầu Nhẹ — Đặt Nền Tảng', emoji:'🌱', tag:'Ngày Khởi Động',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=70',
    A:{ title:'Học 6 Chuyển Động Cơ Bản', detail:'Squat · Hinge · Push · Pull · Core · Thở', time:'20 phút', note:'Form chuẩn trước khối lượng. Đừng lo về số lần — đó là mục tiêu duy nhất hôm nay.',
      img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      details:['6 movement patterns này bao phủ ~95% chuyển động chức năng trong cuộc sống hàng ngày và thể thao — mastering chúng là nền tảng của mọi tiến bộ tiếp theo.','Ngày 1 không cần số lần nhiều hay nặng — mục tiêu là cảm nhận được cơ đang hoạt động đúng chỗ. Sau khi form ổn, số lần và kg sẽ tự tăng theo.','Não cần 300–500 lần lặp đúng để cài đặt motor pattern vào "autopilot". Đây là lý do tập 3–4 lần/tuần trong 4 tuần đầu quan trọng hơn tập nhiều ngay từ đầu.'],
      points:[{icon:'🦵',label:'Squat + Hinge',note:'Lower body — đùi, mông, lưng dưới'},{icon:'💪',label:'Push + Pull',note:'Upper body balance — tránh imbalance vai'},{icon:'🧱',label:'Core + Thở',note:'Foundation của mọi bài tập an toàn'},{icon:'🔁',label:'Form trước volume',note:'Kỹ thuật xây nền — số lần đến sau'}] },
    B:{ title:'Ăn Đủ 3 Bữa Có Đạm', detail:'2 trứng sáng · ức gà trưa · cá/đậu hũ tối', kcal:'~1,410 kcal', note:'Không cần cắt cơm. Thêm rau và giảm đồ ngọt là đủ cho ngày đầu.',
      img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      details:['Đạm (protein) là nguyên liệu xây cơ, sửa mô và tạo hormone — không cần nhiều, cần đủ và đều đặn mỗi bữa mới phát huy tác dụng.','1 lòng bàn tay đạm/bữa là cách dễ nhớ nhất: không cần cân đo, phù hợp cả ăn ngoài lẫn ở nhà, và đủ cho hầu hết người ở ngưỡng duy trì.','Không cần "eat clean" 100% ngày đầu. Chỉ cần thêm đạm vào các bữa đang có là đủ tạo thay đổi đáng kể cho cơ thể.'],
      points:[{icon:'🍳',label:'Sáng: 2 trứng',note:'~12g protein, nhanh và rẻ nhất'},{icon:'🍗',label:'Trưa: ức gà',note:'~30g protein/100g, bữa chính'},{icon:'🐟',label:'Tối: cá/đậu hũ',note:'Dễ tiêu, nhẹ bụng về đêm'},{icon:'💧',label:'Nước + hấp thụ',note:'Uống đủ nước để cơ thể xử lý đạm'}] },
    C:{ title:'Ngủ Trước 23h', detail:'Phòng tối + mát · Phone ra xa giường · 7–9h', note:'Quan trọng hơn bất kỳ bài tập nào — ưu tiên số 1.',
      img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
      details:['Cortisol tự nhiên giảm sau 22h30 — ngủ trước 23h đồng bộ với nhịp sinh học, giúp ngủ sâu hơn, dễ dậy hơn và phục hồi tốt hơn.','Ánh sáng xanh từ điện thoại ức chế melatonin tới 50% — để phone ngoài phòng hoặc bật night mode từ 1 giờ trước ngủ.','Phòng mát 18–22°C và tối hoàn toàn là 2 yếu tố vật lý quan trọng nhất quyết định độ sâu của giấc ngủ.'],
      points:[{icon:'🕙',label:'Target 23h',note:'Giờ đi ngủ, không phải giờ lên giường'},{icon:'📵',label:'Phone xa giường',note:'Để ngoài phòng hoặc mặt úp xuống'},{icon:'🌡️',label:'18–22°C',note:'Nhiệt độ phòng tối ưu cho giấc ngủ sâu'},{icon:'⏰',label:'7–9 giờ',note:'Thời lượng tối thiểu để phục hồi đầy đủ'}] },
    D:{ title:'3 Hơi Thở Sâu Khi Thức Dậy', detail:'Hít 4s · giữ 4s · thở ra 4s — lặp 3 lần', note:'30 giây cài "anchor" tốt cho cả ngày.',
      img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      details:['Buổi sáng, cortisol tự nhiên tăng nhanh (cortisol awakening response) — 3 hơi thở sâu kích hoạt hệ phó giao cảm, giảm stress phản xạ ngay từ đầu ngày.','4s hít - 4s giữ - 4s thở ra là box breathing đơn giản nhất. Navy SEALs dùng kỹ thuật này để bình tĩnh trước áp lực cực độ.','Chỉ 30 giây nhưng tạo "anchor" tích cực: não liên kết thức dậy với bình tĩnh thay vì stress. Sau 21 ngày, thói quen này thành tự động.'],
      points:[{icon:'🫁',label:'4s hít vào',note:'Bằng mũi, thở bụng phình ra'},{icon:'⏸️',label:'4s giữ',note:'Giữ yên, không căng thẳng'},{icon:'💨',label:'4s thở ra',note:'Từ từ qua miệng hoặc mũi'},{icon:'🔁',label:'3 lần',note:'30 giây đủ để não chuyển mode'}] },
    checklist:[
      { label:'Tập 20 phút (6 động tác)', icon:'🏃', img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        why:'20 phút đủ kích hoạt toàn thân và xây motor patterns nền tảng — nhất quán quan trọng hơn thời lượng.',
        details:['6 động tác (Squat, Hinge, Push, Pull, Core, Thở) bao phủ ~95% chuyển động chức năng. Mastering chúng là nền tảng cho mọi tiến bộ tiếp theo.','20 phút đủ tăng nhịp tim, kích hoạt cơ và tạo adaptation mà không gây overtraining. Người mới tập quá nặng quá sớm thường bỏ cuộc trước tuần 2.','Nhất quán > cường độ: 20 phút đều đặn 5 ngày/tuần hiệu quả hơn 2 tiếng gián đoạn — não cần lặp lại 300–500 lần để cài motor pattern vào autopilot.'],
        points:[{icon:'⏱',label:'20 phút là đủ',note:'Tạo kích thích, không quá mệt'},{icon:'🔄',label:'6 động tác cơ bản',note:'Squat·Hinge·Push·Pull·Core·Thở'},{icon:'✅',label:'Form trước số lần',note:'Kỹ thuật đúng tránh chấn thương'},{icon:'📅',label:'Nhất quán',note:'Mỗi ngày 20\' > 2 tiếng cuối tuần'}] },
      { label:'Đạm ở ≥2/3 bữa', icon:'🥩', img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        why:'Cơ thể không lưu trữ đạm — cần nạp đều đặn mỗi bữa để protein synthesis hoạt động liên tục.',
        details:['Khác với mỡ và carb, cơ thể không có kho dự trữ amino acids. Ăn đạm ở 2 bữa ngày đầu là mục tiêu thực tế — không cần hoàn hảo ngay từ ngày 1.','Protein synthesis (quá trình xây cơ) cần amino acids có mặt trong máu liên tục. 1 bữa đủ đạm/ngày không đủ để duy trì chu kỳ này.','1 lòng bàn tay đạm/bữa ≈ 25–35g — đủ kích hoạt protein synthesis và không cần cân đo chính xác ở nhà hàng hay ngoài đường.'],
        points:[{icon:'🍳',label:'Sáng: trứng/sữa',note:'~12–20g, nhanh và đơn giản'},{icon:'🍗',label:'Trưa: thịt/cá',note:'~25–35g, bữa chính quan trọng nhất'},{icon:'🐟',label:'Tối: đạm nhẹ',note:'Cá/đậu hũ — dễ tiêu về đêm'},{icon:'👋',label:'1 lòng bàn tay',note:'Ước lượng nhanh mọi lúc mọi nơi'}] },
      { label:'Uống 1.8L nước', icon:'💧', img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
        why:'Mất 1–2% nước cơ thể đã giảm hiệu suất tập và khả năng tập trung — phần lớn người đang thiếu nước mà không biết.',
        details:['Mất 1% nước → giảm 5–8% hiệu suất thể lực. Mất 2% → khó tập trung, mood xấu hơn, đau đầu. Khát là dấu hiệu đã thiếu nước — cần uống trước khi khát.','1.8L ngày đầu là target khởi đầu thực tế. Sau 7 ngày tăng lên 2–2.5L tùy mức vận động. Tăng dần giúp thận điều chỉnh tự nhiên.','Màu nước tiểu là biểu đồ hydration: vàng nhạt = đủ, trong = hơi nhiều, vàng đậm = thiếu nước rõ rệt — dễ check hơn app.'],
        points:[{icon:'🌅',label:'Sáng: 300ml đầu',note:'Thận sạch, não tỉnh trước cà phê'},{icon:'🏋',label:'Trước/trong tập',note:'200–300ml bù trước khi khát'},{icon:'🍽',label:'Trước bữa ăn',note:'200ml — no nhanh, ít calo hơn'},{icon:'📱',label:'Đặt nhắc nhở',note:'Mỗi 2 giờ 1 ly là đạt 1.8L'}] },
      { label:'Ngủ trước 23h', icon:'🌙', img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
        why:'Cortisol tự nhiên giảm sau 22h30 — ngủ trước 23h đồng bộ với nhịp sinh học cho giấc ngủ sâu nhất.',
        details:['Nhịp sinh học tiết cortisol thấp nhất sau 22h30 và melatonin tăng từ 21h. Ngủ trước 23h đồng bộ với 2 hormone này — giấc ngủ sâu hơn từ ngay phút đầu.','Mỗi giờ ngủ trước nửa đêm giá trị gấp đôi sau nửa đêm về chất lượng phục hồi — deep sleep và REM nhiều hơn trong 4 giờ đầu của đêm.','Giờ thức dậy cố định quan trọng hơn giờ ngủ — dậy cùng giờ mỗi ngày (kể cả cuối tuần) giúp cơ thể tự thiết lập sleep pressure.'],
        points:[{icon:'🕙',label:'23h là deadline',note:'Giờ đi ngủ, không phải lên giường'},{icon:'📵',label:'Phone xa giường',note:'Ánh sáng xanh ức chế melatonin 50%'},{icon:'🌡️',label:'Phòng 18–22°C',note:'Nhiệt độ thấp = tín hiệu ngủ cho não'},{icon:'⏰',label:'Alarm cố định',note:'Dậy cùng giờ = quality ngủ tốt hơn'}] },
      { label:'3 hơi thở buổi sáng', icon:'🫁', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        why:'30 giây kích hoạt hệ phó giao cảm — tắt phản ứng stress mặc định của buổi sáng trước khi nó bắt đầu.',
        details:['Cortisol tăng mạnh ngay khi thức dậy (Cortisol Awakening Response). 3 hơi thở sâu chậm gửi tín hiệu "an toàn" đến não — giảm CAR và lo âu sáng sớm.','Hít 4s–giữ 4s–thở 4s (box breathing) kích hoạt hệ phó giao cảm trong dưới 30 giây. Hiệu quả hơn uống cà phê về mặt tỉnh táo cấp độ não.','Làm trước khi nhìn điện thoại — 30 giây này "đặt tone" cho cả ngày. Xem tin tức hoặc notifications ngay khi thức gây stress phản xạ ngay từ sáng.'],
        points:[{icon:'🌅',label:'Làm ngay khi thức',note:'Trước khi nhìn điện thoại'},{icon:'4️⃣',label:'4s–4s–4s',note:'Box breathing — dễ nhớ nhất'},{icon:'🧠',label:'Giảm cortisol sáng',note:'Ít lo âu — tone tốt cho cả ngày'},{icon:'⚓',label:'Tạo anchor sáng',note:'30 giây đặt nền cho ngày mới'}] },
    ],
  },
  {
    n:2, theme:'Đạm & Nước — Hai Ưu Tiên Đầu', emoji:'💧', tag:'Protein & Hydration',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=70',
    A:{ title:'Lặp 6 Động Tác + Tăng 1 Hiệp', detail:'Giữ nguyên bài · thêm 1 set mỗi động tác', time:'22 phút', note:'Não học qua lặp lại — đừng bỏ dù cảm thấy quá đơn giản.',
      img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      details:['Não học qua lặp lại đúng form — không phải qua đa dạng bài tập. Ngày 2 với cùng 6 bài là motor learning tốt hơn nhiều so với thay bài mới.','Progressive overload đơn giản nhất: +1 set/bài. Hôm qua 2 set → hôm nay 3 set. Cơ thể thích nghi từ từ, bền hơn tập sốc.','Ghi chép sau mỗi buổi tập: số lần, cảm giác mệt 1–10, ghi chú form. Dữ liệu nhỏ này sẽ thay đổi cách bạn luyện tập.'],
      points:[{icon:'🔁',label:'Lặp = học',note:'300+ lần mới thành motor autopilot'},{icon:'➕',label:'+1 set/bài',note:'Progressive overload đơn giản nhất'},{icon:'📝',label:'Ghi chép bài',note:'Số lần + cảm giác mệt sau mỗi buổi'},{icon:'⏱',label:'Nhịp 2-0-1',note:'2s xuống, không nghỉ, 1s lên'}] },
    B:{ title:'Protein Mỗi Bữa Chính', detail:'Yến mạch + trứng · thịt cá rau · đậu hũ', kcal:'~1,380 kcal', note:'1 lòng bàn tay đạm/bữa — quy tắc đơn giản nhất để không thiếu đạm.',
      img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      details:['Amino acid pool trong máu cần được nạp lại mỗi 4–5 giờ — ăn đạm đều 3 bữa tối ưu hơn ăn nhiều một lúc rồi bỏ qua bữa khác.','Muscle protein synthesis (MPS) — quá trình xây cơ — chỉ kích hoạt khi có đủ leucine, 1 amino acid trong đạm động vật và đậu. Mục tiêu 20–30g/bữa.','Không cần ăn thuần thịt — kết hợp đạm thực vật (đậu hũ, đậu lăng, yến mạch) với đạm động vật để có đủ amino acid profile.'],
      points:[{icon:'🌅',label:'Sáng: yến mạch+trứng',note:'~20g protein, no lâu'},{icon:'☀️',label:'Trưa: thịt+cá+rau',note:'~30g protein, bữa quan trọng nhất'},{icon:'🌙',label:'Tối: đậu hũ',note:'~15–20g protein, dễ tiêu'},{icon:'💊',label:'Tổng ~120g/ngày',note:'Cho người 60kg hoạt động vừa'}] },
    C:{ title:'Morning Routine 10 Phút', detail:'Uống nước · 5\' ánh nắng · viết 1 mục tiêu ngày', note:'Anchor buổi sáng giúp não "bật chế độ làm việc" sớm hơn.',
      img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      details:['Cortisol tự nhiên đỉnh điểm trong 30–45 phút đầu sau thức dậy — đây là thời điểm não hoạt động mạnh nhất. Tận dụng bằng morning routine thay vì scroll mạng.','Ánh sáng tự nhiên buổi sáng reset đồng hồ sinh học và kích hoạt serotonin — ngay cả 5 phút đứng trước cửa sổ hoặc ban công cũng đủ.','Viết 1 mục tiêu ngày dưới 1 dòng: não sẽ tự tìm cơ hội thực hiện suốt ngày nhờ reticular activating system.'],
      points:[{icon:'💧',label:'Uống 1 ly nước',note:'Ngay sau thức dậy, trước cà phê'},{icon:'☀️',label:'5\' ánh nắng',note:'Cửa sổ hoặc ban công là đủ'},{icon:'✍️',label:'1 mục tiêu ngày',note:'Viết tay, dưới 1 dòng, cụ thể'},{icon:'📵',label:'Không phone 30\'',note:'Tránh dopamine hit sáng sớm'}] },
    D:{ title:'Nhật Ký 3 Dòng Tối', detail:'Tốt gì hôm nay · học được gì · ngày mai làm gì', note:'5 phút trước ngủ. Không cần hay, chỉ cần thật.',
      img:'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      details:['Viết ra điều tốt trong ngày kích hoạt dopamine và serotonin — não "học" rằng ngày hôm nay có giá trị, giảm lo âu trước khi ngủ.','3 câu hỏi đơn giản: Tốt gì? Học gì? Ngày mai làm gì? Không cần dài, không cần hoàn hảo — chỉ cần thật.','Viết tay tốt hơn gõ phím: bút và giấy kích hoạt vùng não xử lý sâu hơn, giúp ký ức được củng cố tốt hơn trong giấc ngủ.'],
      points:[{icon:'✅',label:'Tốt gì hôm nay',note:'Dù nhỏ — đủ để ghi nhận'},{icon:'📚',label:'Học được gì',note:'1 điều mới, dù từ sai lầm'},{icon:'🎯',label:'Ngày mai làm gì',note:'1 ưu tiên cụ thể'},{icon:'✍️',label:'Viết tay',note:'Tốt hơn gõ phím cho việc phản chiếu'}] },
    checklist:[
      { label:'Đạm cả 3 bữa', icon:'🥩', img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        why:'Protein synthesis cần amino acids liên tục — 3 bữa đủ đạm tối ưu hóa quá trình xây cơ cả ngày.',
        details:['Cơ thể không thể "save" amino acids từ bữa này sang bữa khác. Ăn đạm 3 bữa kích hoạt protein synthesis 3 lần/ngày thay vì 1–2 lần.','Bữa sáng là quan trọng nhất — sau 8 giờ nhịn ngủ, cơ thể đang trong trạng thái catabolism (phân hủy cơ). Đạm sáng đảo ngược điều này ngay lập tức.','Mục tiêu thực tế: mỗi bữa có 1 nguồn đạm bằng lòng bàn tay. Không cần cân gram hay đếm macro — cứ nhìn lòng bàn tay là đủ.'],
        points:[{icon:'🍳',label:'Sáng: bắt buộc',note:'Kết thúc catabolism sau ngủ'},{icon:'🍗',label:'Trưa: bữa chính',note:'Bữa đạm lớn nhất trong ngày'},{icon:'🐟',label:'Tối: duy trì',note:'Cá/đậu hũ nhẹ hơn trưa'},{icon:'📊',label:'~1.6g/kg/ngày',note:'Mục tiêu cho người hoạt động'}] },
      { label:'Uống 2L nước', icon:'💧', img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
        why:'Tăng từ 1.8L → 2L — cơ thể bắt đầu quen với nhịp thủy hóa tối ưu và thận điều chỉnh dần.',
        details:['Tăng dần 200ml/ngày giúp thận điều chỉnh tự nhiên — không gây cảm giác bị ép uống nhiều quá mức.','Bình 500ml × 4 lần = 2L. Đặt trên bàn, nhìn thấy = tự nhắc. Không cần app phức tạp nếu có bình trước mắt.','Trà xanh và nước lọc tính vào tổng; cà phê và rượu bia không tính — thậm chí làm mất nước thêm (diuretic).'],
        points:[{icon:'🍶',label:'Bình 500ml × 4',note:'Nhìn thấy = nhắc uống'},{icon:'🍵',label:'Trà xanh tính được',note:'Bonus antioxidant miễn phí'},{icon:'☕',label:'Cà phê không tính',note:'Diuretic — bù thêm 1 ly/ly cà phê'},{icon:'💛',label:'Vàng nhạt = đủ',note:'Màu nước tiểu là biểu đồ tốt nhất'}] },
      { label:"Morning routine 10'", icon:'🌅', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        why:'10 phút có cấu trúc buổi sáng khởi động não và tạo momentum — nhất quán quan trọng hơn độ phức tạp.',
        details:['Não cần 20–30 phút sau thức dậy để hoạt động hiệu quả. Routine nhẹ 10 phút là cách khởi động não mà không gây stress ngay từ sáng.','10 phút đủ cho 3 thành phần: thể chất (hơi thở + vận động nhẹ) + tinh thần (đặt ý định) + nạp lượng (uống nước). Không cần thêm gì.','Nhất quán quan trọng hơn hoàn hảo: 10 phút đơn giản mỗi ngày > 1 giờ elaborate routine thỉnh thoảng. Não cần pattern lặp lại để build habit.'],
        points:[{icon:'🫁',label:'Hơi thở (1\')',note:'3 box breathing — reset cortisol'},{icon:'🤸',label:'Vận động nhẹ (5\')',note:'Stretch + joint rotation toàn thân'},{icon:'✍️',label:'Đặt ý định (2\')',note:'"Hôm nay tôi sẽ hoàn thành..."'},{icon:'💧',label:'Nước (2\')',note:'300ml trước cà phê buổi sáng'}] },
      { label:'Nhật ký tối 3 dòng', icon:'📓', img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        why:'Reflection tối giải phóng "mental chatter" — đóng tab não và giúp ngủ sâu hơn ngay đêm nay.',
        details:['Chỉ cần 3 dòng: (1) Hôm nay làm được gì, (2) Khó khăn gặp phải, (3) Một điều ngày mai sẽ thay đổi. Không cần đẹp, không cần dài — 5 phút là đủ.','Viết tay kích hoạt vùng não xử lý cảm xúc hiệu quả hơn gõ phím — và không có thông báo làm phân tán.','Unfinished business (việc chưa xong) khiến não tiếp tục "chạy" khi ngủ. Viết ra là cách "đóng tab" — não mới có thể thực sự nghỉ ngơi.'],
        points:[{icon:'✅',label:'Làm được gì',note:'Ghi nhận dù nhỏ — build self-trust'},{icon:'🔍',label:'Khó khăn gì',note:'Không phán xét, chỉ quan sát'},{icon:'🔄',label:'Ngày mai đổi gì',note:'1 điều cụ thể là đủ'},{icon:'✋',label:'Viết tay',note:'Không gõ điện thoại — không thông báo'}] },
      { label:'Tập 22 phút', icon:'🏋', img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        why:'+2 phút so với ngày 1 — progressive overload áp dụng ngay cả với thời gian, không chỉ tạ.',
        details:['Progressive overload không chỉ là tăng tạ — tăng thời gian, số lần, hoặc giảm nghỉ đều là overload hợp lệ và hiệu quả.','Ngày 2 mục tiêu: tăng 1–2 lần lặp/bài hoặc thêm 1 set so với ngày 1. Chọn 1 thôi, không cần cả hai.','Form vẫn chuẩn và không đau = dấu hiệu tốt để tăng volume. Đau khớp hoặc form xấu = giảm lại ngay.'],
        points:[{icon:'📈',label:'+2 phút hôm nay',note:'Progressive overload về thời gian'},{icon:'➕',label:'+1 lần hoặc +1 set',note:'Nhỏ thôi — adaptation thật sự'},{icon:'✅',label:'Form vẫn chuẩn',note:'Quality > quantity mọi lúc'},{icon:'💪',label:'Build momentum',note:'7 ngày nhất quán > 1 ngày cực khổ'}] },
    ],
  },
  {
    n:3, theme:'Ăn Ngoài Thông Minh & Cardio Nhẹ', emoji:'🚶', tag:'Smart Eating + Walk',
    color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70',
    A:{ title:'Đi Bộ Nhanh 20 Phút', detail:'Cardio nhẹ · nhịp tim 100–120 · phục hồi cơ bắp', time:'20 phút', note:'Đi sau bữa trưa: giảm đường huyết 20–30%, tăng sức bền nền.',
      img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
      details:['Đi bộ nhanh sau bữa trưa giảm đường huyết sau ăn 20–30% — cải thiện insulin sensitivity và giảm cảm giác buồn ngủ sau bữa.','Zone cardio nhẹ (nhịp tim 100–120 bpm) thực sự giúp phục hồi cơ bắp tốt hơn ngồi yên — tăng lưu lượng máu đến cơ mà không gây thêm mệt.','20 phút đi bộ tích lũy 2.000–2.500 bước — chiếm 25–30% mục tiêu 8.000 bước/ngày, hoàn toàn không cần thiết bị.'],
      points:[{icon:'🍽️',label:'Sau bữa trưa tốt nhất',note:'Giảm đường huyết ngay sau ăn'},{icon:'❤️',label:'100–120 bpm',note:'Zone cardio phục hồi, không mệt'},{icon:'👣',label:'2.000–2.500 bước',note:'25–30% mục tiêu ngày'},{icon:'🌳',label:'Ra ngoài trời',note:'Ánh sáng tự nhiên + vận động = double benefit'}] },
    B:{ title:'Xử Lý Bữa Ăn Ngoài', detail:'1 protein + 2 rau + tinh bột vừa = công thức ăn ngoài', kcal:'~1,450 kcal', note:'Không cần từ chối bữa xã giao — chỉ cần chiến lược đơn giản.',
      img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
      details:['Công thức 1P+2V+T: 1 phần protein + 2 phần rau + tinh bột vừa. Áp dụng được ở bất kỳ nhà hàng nào — không cần nhìn menu dinh dưỡng.','Chọn protein trước, sau đó mới chọn các món khác đi kèm — thứ tự này giảm khả năng bữa ăn thiếu đạm vì "không biết chọn gì".','Không từ chối bữa xã giao — đó là lý do dẫn đến bỏ cuộc. Ăn ngoài thông minh bền vững hơn 100 lần so với "eat clean tuyệt đối".'],
      points:[{icon:'🍗',label:'Protein trước tiên',note:'Chọn món đạm chính trước'},{icon:'🥦',label:'2 phần rau',note:'Salad + canh/xào, hoặc 2 món rau'},{icon:'🍚',label:'Tinh bột vừa',note:'½ chén cơm/mì, không cần bỏ hoàn toàn'},{icon:'🥤',label:'Không bia/ngọt thêm',note:'Nước lọc/trà không đường thay thế'}] },
    C:{ title:'Không Phone 30\' Trước Ngủ', detail:'Thay bằng: đọc sách · thở · giãn cơ nhẹ', note:'Ánh sáng xanh ức chế melatonin — 1 thói quen nhỏ cải thiện sâu giấc.',
      img:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      details:['Ánh sáng xanh (blue light) từ màn hình ức chế melatonin tới 50% — hormones cần 30–60 phút để phục hồi sau khi tắt màn hình.','Cuộn mạng xã hội tối kích hoạt dopamine loop — não không tắt được dù mắt đã mệt. Đây là nguyên nhân "không buồn ngủ dù đã nằm lâu".','Thay thế 30 phút cuối bằng đọc sách giấy hoặc giãn cơ nhẹ — 2 hoạt động này tự nhiên giảm nhịp tim và chuẩn bị cơ thể cho giấc ngủ.'],
      points:[{icon:'💙',label:'Blue light ức chế',note:'Melatonin giảm 50% khi dùng màn hình'},{icon:'🔄',label:'Dopamine loop',note:'Não không tắt được dù mắt mệt'},{icon:'📖',label:'Thay bằng sách',note:'Sách giấy không phát ánh sáng xanh'},{icon:'🧘',label:'Hoặc giãn cơ',note:'5–10\' giãn cơ = signal cho não ngủ'}] },
    D:{ title:'Box Breathing 5 Phút', detail:'Hít 4 · giữ 4 · thở ra 4 · giữ 4 — lặp 5 vòng', note:'Dùng khi căng thẳng, trước cuộc họp, hoặc tối trước ngủ.',
      img:'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80',
      details:['Box breathing kích hoạt hệ phó giao cảm (rest-and-digest) — đối lập với giao cảm (fight-or-flight). Chỉ cần 4–5 vòng để cảm nhận rõ sự thay đổi.','Navy SEALs sử dụng kỹ thuật 4-4-4-4 này để bình tĩnh trước tình huống áp lực cực độ — hiệu quả được chứng minh trong nhiều nghiên cứu thần kinh học.','5 phút = 5 vòng đủ để nhịp tim giảm 10–15 bpm và cortisol giảm đáng kể — dùng trước cuộc họp căng thẳng hoặc tối trước ngủ.'],
      points:[{icon:'🫁',label:'Hít vào 4s',note:'Thở bụng, từ từ và đều'},{icon:'⏸️',label:'Giữ 4s',note:'Không gồng — giữ nhẹ nhàng'},{icon:'💨',label:'Thở ra 4s',note:'Từ từ, hết hoàn toàn'},{icon:'⏸️',label:'Giữ 4s',note:'Bình tĩnh trước khi lặp lại'}] },
    checklist:[
      { label:'Đi bộ 20 phút', icon:'🚶', img:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
        why:'Đi bộ sau ăn 10 phút giảm đường huyết ~22% — tốt hơn nhiều loại thuốc cho người khỏe mạnh.',
        details:['20 phút đi bộ sau bữa ăn là insulin sensitizer tự nhiên — cơ co lại hấp thụ glucose mà không cần insulin nhiều, giảm spike đường huyết sau ăn ~22%.','Zone 2 cardio (đi bộ nhanh — vừa thở vừa nói được) đốt mỡ hiệu quả nhất và không gây stress cơ đủ để cản phục hồi.','Đi ngoài trời có bonus: vitamin D từ ánh nắng sáng + không khí tươi + giảm cortisol thêm 15%. Tất cả không đạt được trên máy chạy bộ trong nhà.'],
        points:[{icon:'🍽',label:'Sau bữa ăn',note:'Hiệu quả nhất: 10–30 phút sau ăn'},{icon:'💨',label:'Vừa đi vừa nói được',note:'Zone 2 — đốt mỡ, không mệt nhiều'},{icon:'☀️',label:'Ngoài trời',note:'Vitamin D + không khí tươi'},{icon:'📱',label:'App đếm bước',note:'Tích lũy bước về cuối ngày để check'}] },
      { label:'Bữa ngoài theo công thức', icon:'🍱', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        why:'Công thức đĩa ăn lành mạnh giúp ăn ngoài mà vẫn đúng track — không cần từ chối hay lo lắng.',
        details:['Công thức đĩa: ½ rau · ¼ đạm · ¼ tinh bột. Áp dụng ở bất kỳ quán nào — phở (bỏ nước béo + thêm rau), cơm văn phòng (thêm đậu hũ), bún bò (thêm rau muống).','Không cần từ chối ăn ngoài — từ chối xã hội gây tốn kém tâm lý hơn ăn thêm 100 kcal. Chỉ cần điều chỉnh tỷ lệ, không phải thực đơn.','Tip thực tế: gọi thêm rau sống/luộc, đổi nước ngọt → trà không đường. 2 thay đổi này đủ tạo khác biệt lớn mà không khó thực hiện.'],
        points:[{icon:'🥗',label:'½ đĩa rau',note:'Rau luộc/sống/canh đều tính'},{icon:'🍗',label:'¼ đĩa đạm',note:'Thịt/cá/trứng/đậu hũ'},{icon:'🍚',label:'¼ đĩa tinh bột',note:'Cơm/phở/bún — không cần kiêng'},{icon:'🍵',label:'Đổi đồ uống',note:'Trà không đường > nước ngọt'}] },
      { label:"Không phone 30' trước ngủ", icon:'📵', img:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
        why:'Ánh sáng xanh từ màn hình ức chế melatonin tới 50% — phá hoại chất lượng giấc ngủ sâu nghiêm trọng.',
        details:['Ánh sáng xanh (blue light, 480nm) từ điện thoại ức chế sản xuất melatonin lên tới 50%. Hậu quả: khó vào sleep onset hơn 30–45 phút, giảm deep sleep.','Đặt phone ra ngoài phòng ngủ là cách hiệu quả nhất — không có cám dỗ = không cần willpower. Thay thế bằng sách giấy, viết nhật ký, hoặc nói chuyện.','30 phút là minimum — nếu có thể 1 giờ thì tốt hơn. Melatonin cần 20–30 phút để tăng đủ mức sau khi tắt màn hình.'],
        points:[{icon:'📱',label:'Phone ra khỏi phòng',note:'Tốt nhất — không cám dỗ'},{icon:'🔵',label:'Night mode nếu cần',note:'Giảm blue light — tốt hơn không làm gì'},{icon:'📚',label:'Đọc sách giấy',note:'Thay thế tốt nhất cho phone'},{icon:'⏱',label:'30\' tối thiểu',note:'Melatonin cần 20–30\' để tăng đủ'}] },
      { label:"Box breathing 5'", icon:'🫁', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        why:'Box breathing 5 phút giảm nhịp tim và cortisol — chuẩn bị não cho giấc ngủ sâu và phục hồi tối đa.',
        details:['Box breathing (4s–4s–4s–4s) được Navy SEALs dùng để bình tĩnh dưới áp lực cực độ. Nếu hiệu quả với họ, chắc chắn hiệu quả với stress hàng ngày.','5 phút box breathing đủ để giảm nhịp tim ~10 bpm và cortisol đáng kể. Làm tối = dễ ngủ hơn và sâu hơn — bổ sung cho việc không dùng phone.','Hít bằng mũi hiệu quả hơn miệng — mũi lọc không khí, làm ấm và tạo nitric oxide kích hoạt phó giao cảm tốt hơn.'],
        points:[{icon:'4️⃣',label:'4s–4s–4s–4s',note:'Hít · Giữ · Thở · Giữ'},{icon:'👃',label:'Hít bằng mũi',note:'Kích hoạt phó giao cảm nhanh hơn'},{icon:'💓',label:'Giảm ~10 bpm',note:'5 phút thấy khác biệt rõ'},{icon:'🌙',label:'Kết hợp với không phone',note:'2 việc này cộng hưởng hiệu quả'}] },
      { label:'Uống đủ nước', icon:'💧', img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
        why:'Ngày 3 kiểm tra thói quen uống nước đã hình thành chưa — nhất quán 3 ngày đầu là nền tảng của habit.',
        details:['Đến ngày 3, bắt đầu nhận ra pattern cá nhân: uống ít vào giờ nào, quên lúc nào. Đây là dữ liệu thực tế để điều chỉnh thói quen.','Habit formation: hành động lặp lại ở cùng ngữ cảnh (cùng giờ, cùng cốc) được não ghi nhớ nhanh hơn hành động ngẫu nhiên.','Thêm điện giải (muối + chanh + mật ong) vào 1 ly sáng nếu hay bị chuột rút hoặc sau tập nhiều mồ hôi — đặc biệt quan trọng ngày 3.'],
        points:[{icon:'💛',label:'Vàng nhạt = đủ',note:'Màu nước tiểu là biểu đồ hydration'},{icon:'🍋',label:'Chanh + muối sáng',note:'Electrolytes tự nhiên sau ngủ'},{icon:'🔁',label:'Cùng giờ mỗi ngày',note:'Context cố định xây habit nhanh hơn'},{icon:'✅',label:'Ngày 3 = habit check',note:'Thói quen đang hình thành — giữ tiếp'}] },
    ],
  },
  {
    n:4, theme:'Rau Xanh & Phục Hồi Tích Cực', emoji:'🥗', tag:'Greens & Recovery',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=70',
    A:{ title:'Phục Hồi Tích Cực 15 Phút', detail:'Giãn cơ · foam roll · yoga nhẹ · không tập nặng', time:'15 phút', note:'Phục hồi = tập luyện vô hình. Cơ lớn lúc nghỉ, không phải lúc tập.',
      img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      details:['Cơ bắp phát triển lúc nghỉ, không phải lúc tập — tập nặng chỉ tạo tín hiệu kích thích. Recovery là khi cơ thực sự xây sức mạnh.','Foam rolling giúp phá vỡ adhesions (điểm dính) trong cơ, tăng lưu lượng máu đến mô cơ — giảm DOMS (đau cơ sau tập) hiệu quả hơn nghỉ hoàn toàn.','Yoga nhẹ (restorative yoga) kết hợp hít thở sâu kích hoạt hệ phó giao cảm — giảm cortisol và tăng chất lượng giấc ngủ tối hôm đó.'],
      points:[{icon:'🛌',label:'Cơ xây lúc nghỉ',note:'Sleep + recovery = growth stimulus'},{icon:'🔘',label:'Foam roll 5\'',note:'Phá adhesion, tăng blood flow'},{icon:'🧘',label:'Yoga nhẹ 5\'',note:'Kích hoạt phó giao cảm'},{icon:'🚫',label:'Không tập nặng',note:'Rest day = đầu tư, không phải thua'}] },
    B:{ title:'Ngày Ưu Tiên Rau', detail:'Salad · canh rau · rau luộc nhiều hơn bình thường', kcal:'~1,300 kcal', note:'Chất xơ nuôi vi khuẩn đường ruột — hệ miễn dịch và tâm trạng đều hưởng lợi.',
      img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
      details:['70% hệ miễn dịch nằm ở đường ruột — vi khuẩn đường ruột cần chất xơ (prebiotic) từ rau xanh để hoạt động tốt, tạo ra serotonin và giảm viêm.','Đa dạng màu sắc rau = đa dạng phytochemical và vitamin: xanh đậm (folate, sắt), đỏ/cam (lycopene, beta-carotene), tím (anthocyanin).','1.300 kcal ngày rau nhẹ không phải đói — chất xơ làm no lâu hơn tinh bột vì không tiêu hóa nhanh. Bụng no mà calo thấp.'],
      points:[{icon:'🥬',label:'Rau xanh đậm',note:'Folate, sắt, vitamin K'},{icon:'🥕',label:'Rau màu cam/đỏ',note:'Beta-carotene, lycopene'},{icon:'🧅',label:'Tỏi + hành tây',note:'Prebiotic mạnh nhất cho đường ruột'},{icon:'🎨',label:'≥5 màu/ngày',note:'Màu khác = dinh dưỡng khác'}] },
    C:{ title:'8.000 Bước + Ánh Nắng', detail:'Tổng 8k bước trong ngày · ra ngoài 5\' buổi sáng', note:'Không cần đi liên tục. Tổng bước cộng dồn suốt ngày là đủ.',
      img:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
      details:['8.000 bước/ngày không cần đi liên tục — nghiên cứu cho thấy tổng bước tích lũy suốt ngày (đi lại trong nhà, đi cầu thang, ra ngoài) có hiệu quả tương đương.','5 phút ánh nắng buổi sáng (6–9h) reset đồng hồ sinh học và kích hoạt sản xuất vitamin D — cả 2 ảnh hưởng trực tiếp đến năng lượng và tâm trạng.','App đếm bước (có sẵn trong điện thoại) giúp bạn nhận ra mình đã đi bao nhiêu — thường ít hơn bạn nghĩ, và nhiều hơn sau khi bắt đầu để ý.'],
      points:[{icon:'📱',label:'App đếm bước',note:'Đã có sẵn trong health app điện thoại'},{icon:'☀️',label:'5\' ánh nắng sáng',note:'6–9h, reset đồng hồ sinh học'},{icon:'🪜',label:'Dùng cầu thang',note:'Mỗi tầng = ~100–120 bước thêm'},{icon:'🚶',label:'Đi lúc nghỉ giải lao',note:'5\' mỗi giờ = 500–700 bước/lần'}] },
    D:{ title:'Thiền 5 Phút', detail:'Ngồi · nhắm mắt · chú ý hơi thở · không phán xét', note:'Không cần "không suy nghĩ" — chỉ cần nhận ra và nhẹ nhàng quay lại hơi thở.',
      img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      details:['Thiền không yêu cầu "không có suy nghĩ" — đó là hiểu nhầm phổ biến nhất. Mục tiêu là nhận ra khi tâm trí đi lạc và nhẹ nhàng quay lại hơi thở.','Default Mode Network (vùng não hoạt động khi ta "không làm gì") liên quan đến lo âu và overthinking. Thiền giảm hoạt động DMN — giảm lo lắng về tương lai và quá khứ.','5 phút thiền mỗi ngày đủ để thấy kết quả sau 8 tuần: giảm cortisol, tăng gray matter vùng prefrontal cortex, cải thiện khả năng kiểm soát cảm xúc.'],
      points:[{icon:'🧘',label:'Ngồi thoải mái',note:'Ghế, sàn, hoặc giường đều được'},{icon:'👁️',label:'Nhắm mắt',note:'Giảm kích thích thị giác'},{icon:'🫁',label:'Chú ý hơi thở',note:'Cảm nhận bụng phình/xẹp'},{icon:'💭',label:'Không phán xét',note:'Suy nghĩ đến = nhận ra, quay lại thở'}] },
    checklist:[
      { label:'Giãn cơ 15 phút', icon:'🧘', img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        why:'Giãn cơ sau tập tăng lưu lượng máu đến mô cơ, giảm DOMS và đẩy nhanh phục hồi thực sự.',
        details:['Static stretching (giữ 30–45 giây) tốt nhất sau tập nặng — tăng flexibility và giảm tension cơ. Làm trước tập thì ngược lại: giảm sức mạnh tạm thời.','Foam rolling phá vỡ adhesions (điểm dính) trong fascia, tăng blood flow đến cơ — hiệu quả hơn nghỉ hoàn toàn và rẻ hơn massage.','15 phút = 3 nhóm cơ chính đã dùng. Không cần giãn toàn thân mỗi ngày — ưu tiên phần vừa tập hoặc đang tight nhất.'],
        points:[{icon:'⏱',label:'30–45s/nhóm cơ',note:'Static stretch sau tập — không trước'},{icon:'🔘',label:'Foam roll trước',note:'Phá adhesion → blood flow tốt hơn'},{icon:'🎯',label:'Nhóm cơ vừa tập',note:'Đùi · Mông · Lưng dưới · Vai'},{icon:'😤',label:'Thở ra khi giữ',note:'Thở ra sâu = cơ giãn nhiều hơn'}] },
      { label:'Rau ở ≥2 bữa', icon:'🥬', img:'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80',
        why:'Chất xơ từ rau nuôi vi khuẩn đường ruột — 70% hệ miễn dịch nằm ở ruột, không phải ở máu.',
        details:['Vi khuẩn đường ruột cần chất xơ (prebiotic) để sản xuất short-chain fatty acids và serotonin — thiếu rau = hệ miễn dịch yếu và mood thấp hơn.','Đa dạng màu sắc rau = đa dạng dinh dưỡng: xanh đậm (folate, sắt), đỏ/cam (lycopene, beta-carotene), tím (anthocyanin). Ít nhất 3 màu mỗi ngày.','Rau luộc giữ được 70–80% dinh dưỡng và dễ ăn nhiều hơn rau sống — lựa chọn thực tế nhất cho ngày bận.'],
        points:[{icon:'🥬',label:'Rau xanh đậm',note:'Rau muống·cải·bông cải — folate, sắt'},{icon:'🥕',label:'Cam/đỏ',note:'Cà rốt·cà chua — beta-carotene'},{icon:'🧄',label:'Tỏi + hành tây',note:'Prebiotic mạnh nhất cho đường ruột'},{icon:'🎨',label:'≥3 màu/ngày',note:'Màu khác = dinh dưỡng khác nhau'}] },
      { label:'8.000 bước', icon:'👟', img:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
        why:'8.000 bước/ngày giảm 51% nguy cơ tử vong sớm — không cần đi liên tục mới đạt hiệu quả.',
        details:['Nghiên cứu JAMA 2021: 8.000 bước/ngày giảm 51% nguy cơ tử vong so với 4.000 bước. Không cần đến 10.000 — lợi ích lớn nhất đến khoảng 7.000–8.000 bước.','Tổng bước tích lũy suốt ngày (đi lại trong nhà, cầu thang, ra ngoài mua đồ) có hiệu quả tương đương đi liên tục. Không cần dành riêng 1 giờ đi bộ.','5 phút ánh nắng sáng (6–9h) khi ra ngoài: reset đồng hồ sinh học + kích hoạt vitamin D — 2 bonus không thể có trên máy chạy bộ trong nhà.'],
        points:[{icon:'📱',label:'App đếm bước',note:'Có sẵn trong health app điện thoại'},{icon:'🪜',label:'Dùng cầu thang',note:'Mỗi tầng = ~100–120 bước thêm'},{icon:'☀️',label:'5\' ra ngoài sáng',note:'Reset đồng hồ sinh học + vitamin D'},{icon:'🚶',label:'Đi lúc giải lao',note:'5\' mỗi giờ = 500–700 bước/lần'}] },
      { label:'Thiền 5 phút', icon:'🧘', img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        why:'5 phút thiền/ngày đủ để giảm cortisol và tăng gray matter vùng kiểm soát cảm xúc sau 8 tuần.',
        details:['Thiền không yêu cầu "không có suy nghĩ" — đây là hiểu nhầm phổ biến nhất. Mục tiêu là nhận ra khi tâm trí đi lạc và nhẹ nhàng quay lại hơi thở.','Default Mode Network (vùng não hoạt động khi "không làm gì") liên quan đến lo âu và overthinking. Thiền giảm hoạt động DMN — giảm lo lắng về tương lai và quá khứ.','5 phút mỗi ngày đủ để thấy kết quả sau 8 tuần: giảm cortisol, tăng gray matter prefrontal cortex, cải thiện kiểm soát cảm xúc.'],
        points:[{icon:'🧘',label:'Ngồi thoải mái',note:'Ghế · sàn · giường đều được'},{icon:'👁️',label:'Nhắm mắt',note:'Giảm kích thích thị giác'},{icon:'🫁',label:'Chú ý hơi thở',note:'Cảm nhận bụng phình/xẹp'},{icon:'💭',label:'Suy nghĩ đến = ok',note:'Nhận ra → nhẹ nhàng quay lại thở'}] },
      { label:'Ngủ 7–9h', icon:'😴', img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
        why:'7–9h là range phục hồi tối ưu — dưới 6h làm suy giảm miễn dịch và motor learning rõ rệt.',
        details:['Sleep deprivation (<6h): giảm 70% NK cells (tế bào miễn dịch tiêu diệt ung thư), tăng cortisol, insulin resistance tăng, motor skills giảm 20–30%.','7–9h là range WHO recommend. Người trẻ hoạt động nhiều thường cần gần 9h hơn 7h. Không có người nào "chỉ cần 5h" lâu dài mà không ảnh hưởng sức khỏe.','Chất lượng quan trọng hơn số lượng: 7h ngủ sâu > 9h ngủ đứt đoạn. Dấu hiệu ngủ sâu: không thức giữa đêm, dậy cảm thấy sảng khoái.'],
        points:[{icon:'🌙',label:'7–9h là range',note:'Người hoạt động nhiều → gần 9h'},{icon:'📉',label:'<6h là nguy hiểm',note:'NK cells giảm 70% sau 1 đêm'},{icon:'✨',label:'Chất lượng > số lượng',note:'Ngủ sâu, ít thức giữa đêm'},{icon:'⏰',label:'Giờ thức cố định',note:'Quan trọng hơn cả giờ ngủ'}] },
    ],
  },
  {
    n:5, theme:'Ngày Tập Mạnh & Carb Nạp Năng Lượng', emoji:'💪', tag:'Strong Training Day',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70',
    A:{ title:'Tập Sức Mạnh Toàn Thân 30 Phút', detail:'3 set/bài · Squat + Lunge + Push + Row + Plank', time:'30 phút', note:'RPE 7/10 — cảm thấy mệt nhưng không kiệt sức. Đó là zone đúng.',
      img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      details:['RPE 7/10 là zone đúng — cảm thấy mệt, có thể làm thêm 3 lần nữa nếu cần, nhưng không kiệt sức. Zone này kích hoạt adaptation mà không gây overtraining.','Compound movements (Squat, Lunge, Push, Row, Plank) kích hoạt nhiều nhóm cơ cùng lúc — hiệu quả hơn isolation exercises trong cùng 30 phút.','Progressive overload ngày 5: nếu ngày 1 làm 10 lần Squat × 2 set, hôm nay làm 12 lần × 3 set. Tăng nhỏ đều đặn > tăng nhiều gián đoạn.'],
      points:[{icon:'📊',label:'RPE 7/10',note:'Mệt nhưng form vẫn chuẩn'},{icon:'🏋',label:'3 set/bài',note:'Squat + Lunge + Push + Row + Plank'},{icon:'💪',label:'Compound moves',note:'Nhiều nhóm cơ = hiệu quả nhất'},{icon:'📈',label:'Progressive overload',note:'+1–2 lần hoặc +1 set so với tuần trước'}] },
    B:{ title:'Carb Trước + Đạm Sau Tập', detail:'Trước: chuối · Sau: cơm + ức gà · ~1,620 kcal', kcal:'~1,620 kcal', note:'Carb = nhiên liệu. Đạm = vật liệu xây cơ. Đừng bỏ bữa sau tập.',
      img:'https://images.unsplash.com/photo-1517093728197-df2b8b01f48a?w=800&q=80',
      details:['Ăn carb 30–60 phút trước tập: glycogen (năng lượng cơ) cần được nạp. Chuối hoặc bánh mì là lựa chọn nhanh, dễ tiêu, không gây nặng bụng.','Anabolic window sau tập (30–90 phút): cơ thể hấp thụ đạm và carb hiệu quả nhất để phục hồi và xây cơ. Bỏ bữa sau tập = bỏ lãng công tập luyện.','1.620 kcal ngày tập nhiều hơn 1.410 kcal ngày thường — cơ thể cần thêm năng lượng cho việc xây cơ và phục hồi. Đây không phải ăn nhiều, đây là ăn đúng.'],
      points:[{icon:'🍌',label:'Carb trước 30–60\'',note:'Chuối / bánh mì / cơm trắng'},{icon:'🍗',label:'Đạm sau 30–90\'',note:'Cơm + ức gà hoặc protein shake'},{icon:'⚡',label:'Carb = nhiên liệu',note:'Glycogen cho cơ hoạt động tối đa'},{icon:'🧱',label:'Đạm = vật liệu',note:'Amino acids xây cơ trong giấc ngủ'}] },
    C:{ title:'Tối Ưu Giấc Ngủ Hôm Nay', detail:'18–22°C · tối hoàn toàn · không caffeine sau 14h', note:'Giấc ngủ sau tập nặng = lúc cơ bắp tái tạo quan trọng nhất.',
      img:'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
      details:['Growth hormone (GH) tiết ra chủ yếu trong giấc ngủ sâu phase 23h–1h — đây là lúc cơ bắp thực sự tái tạo sau buổi tập nặng. Bỏ ngủ = bỏ lãng công tập.','Caffeine có half-life 5–7 giờ — uống cà phê lúc 15h, đến 22h vẫn còn 50% caffeine trong máu, làm giảm chất lượng giấc ngủ sâu đáng kể.','Phòng tối hoàn toàn quan trọng hơn nhiều người nghĩ — ánh sáng qua mí mắt vẫn ức chế melatonin. Rèm đen hoặc sleep mask giải quyết vấn đề này.'],
      points:[{icon:'🌡️',label:'18–22°C',note:'Nhiệt độ giảm = tín hiệu ngủ cho não'},{icon:'🌑',label:'Tối hoàn toàn',note:'Rèm đen hoặc sleep mask'},{icon:'☕',label:'Không caffeine sau 14h',note:'Half-life 5–7h — vẫn còn 22h'},{icon:'💪',label:'GH tiết 23h–1h',note:'Ngủ đúng giờ = tăng hiệu quả tập'}] },
    D:{ title:'Đặt Ý Định Buổi Sáng', detail:'Viết 1 câu: "Hôm nay tôi sẽ ___" rồi đọc to', note:'Ý định rõ ràng → hành động nhất quán hơn ~35%.',
      img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
      details:['Ý định (intention) khác với mục tiêu (goal) — ý định là hành động cụ thể trong ngày hôm nay, không phải kết quả dài hạn. "Hôm nay tôi sẽ tập lúc 6h" rõ hơn "Tôi muốn khỏe mạnh".','Viết ra và đọc to kích hoạt Reticular Activating System (RAS) — bộ lọc của não sẽ chú ý đến cơ hội thực hiện ý định đó suốt ngày.','Nghiên cứu về implementation intention (Peter Gollwitzer) cho thấy viết ra "Tôi sẽ làm X lúc Y ở Z" tăng tỷ lệ thực hiện lên 91% so với chỉ muốn làm.'],
      points:[{icon:'✍️',label:'Viết 1 câu cụ thể',note:'"Hôm nay lúc 6h tôi sẽ tập"'},{icon:'🗣️',label:'Đọc to 1 lần',note:'Âm thanh kích hoạt RAS hiệu quả hơn'},{icon:'🎯',label:'Cụ thể + có giờ',note:'When + What = tỷ lệ thực hiện +91%'},{icon:'🌙',label:'Xem lại tối',note:'Làm được chưa? Học gì từ hôm nay?'}] },
    checklist:[
      { label:"Tập 30' sức mạnh", icon:'💪', img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        why:'30 phút compound movements ở RPE 7/10 là zone đúng: đủ kích thích adaptation mà không gây overtraining.',
        details:['RPE 7/10 (Rate of Perceived Exertion): mệt nhưng form vẫn chuẩn, có thể làm thêm 3 lần nếu cần. Zone này kích hoạt adaptation mà không gây burnout sau 2–3 tuần.','Compound movements (Squat, Lunge, Push, Row, Plank) kích hoạt nhiều nhóm cơ cùng lúc — hiệu quả nhất trong 30 phút giới hạn.','3 set/bài là standard: đủ để kích hoạt hypertrophy mà không cần session dài hơn 45 phút. Volume tối ưu hơn volume tối đa.'],
        points:[{icon:'📊',label:'RPE 7/10',note:'Mệt, form chuẩn, còn 3 lần dự phòng'},{icon:'🏋',label:'Compound moves',note:'Squat·Lunge·Push·Row·Plank'},{icon:'3️⃣',label:'3 set/bài',note:'Standard kích thích adaptation'},{icon:'📈',label:'+1–2 lần vs ngày 1',note:'Progressive overload nhỏ nhưng thật'}] },
      { label:'Carb trước + đạm sau tập', icon:'🍌', img:'https://images.unsplash.com/photo-1517093728197-df2b8b01f48a?w=800&q=80',
        why:'Carb nạp glycogen trước tập, đạm sau tập kích hoạt protein synthesis trong anabolic window 30–90 phút.',
        details:['Trước tập 30–60 phút: ăn carb dễ tiêu (chuối, bánh mì, cơm trắng) — glycogen là nhiên liệu duy nhất cho bài tập cường độ cao. Thiếu glycogen = mệt sớm và form tệ hơn.','Anabolic window sau tập (30–90 phút): cơ thể hấp thụ đạm và carb hiệu quả nhất để phục hồi và xây cơ. Bỏ bữa sau tập = bỏ lãng công tập.','1.620 kcal ngày tập nhiều hơn ngày thường — cơ thể cần thêm năng lượng để xây cơ và phục hồi. Đây không phải ăn nhiều, đây là ăn đúng.'],
        points:[{icon:'🍌',label:'Carb 30–60\' trước',note:'Chuối·bánh mì·cơm — dễ tiêu'},{icon:'🍗',label:'Đạm 30–90\' sau',note:'Cơm + ức gà hoặc sữa đậu nành'},{icon:'⚡',label:'Carb = nhiên liệu',note:'Glycogen cho cơ hoạt động tối đa'},{icon:'🧱',label:'Đạm = vật liệu',note:'Amino acids xây cơ trong giấc ngủ'}] },
      { label:'Không caffeine sau 14h', icon:'☕', img:'https://images.unsplash.com/photo-1497935586047-9395ee065e52?w=800&q=80',
        why:'Caffeine có half-life 5–7 giờ — uống lúc 15h thì đến 22h vẫn còn 50% trong máu, phá deep sleep.',
        details:['Half-life caffeine 5–7 giờ: 200mg lúc 15h → còn 100mg lúc 21–22h → giảm deep sleep đáng kể kể cả khi vẫn ngủ được.','Deep sleep (slow-wave sleep) bị giảm bởi caffeine — đây là phase quan trọng nhất cho phục hồi cơ và memory consolidation. Bỏ lỡ deep sleep = tập nặng mà cơ không xây.','14h là cut-off an toàn cho hầu hết người. Người nhạy caffeine hơn nên dừng lúc 12h.'],
        points:[{icon:'⏰',label:'Cut-off 14h',note:'An toàn cho hầu hết người'},{icon:'📊',label:'Half-life 5–7h',note:'15h → còn 50% lúc 21–22h'},{icon:'💤',label:'Deep sleep bị phá',note:'Cơ không xây được nếu thiếu deep sleep'},{icon:'🍵',label:'Trà thảo mộc thay thế',note:'Chamomile·gừng·bạc hà — không caffeine'}] },
      { label:'Đặt ý định sáng', icon:'✍️', img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        why:'Implementation intention tăng tỷ lệ thực hiện từ 39% lên 91% theo nghiên cứu của NYU.',
        details:['Ý định khác mục tiêu: "Hôm nay lúc 6h tôi sẽ tập 30 phút ở phòng khách" rõ hơn "Tôi muốn khỏe mạnh" rất nhiều về tỷ lệ thực hiện thực tế.','Viết ra và đọc to kích hoạt Reticular Activating System (RAS) — bộ lọc của não sẽ chú ý đến cơ hội thực hiện ý định đó suốt ngày.','Peter Gollwitzer (NYU) nghiên cứu: viết "Tôi sẽ làm X lúc Y ở Z" tăng tỷ lệ thực hiện từ 39% lên 91% — con số đáng kể nhất về habit formation.'],
        points:[{icon:'✍️',label:'Viết 1 câu cụ thể',note:'"Lúc 6h tôi sẽ tập ở phòng khách"'},{icon:'🗣️',label:'Đọc to 1 lần',note:'Âm thanh kích hoạt RAS tốt hơn đọc thầm'},{icon:'⏰',label:'Có giờ + địa điểm',note:'When + Where = tỷ lệ thực hiện +91%'},{icon:'🌙',label:'Review tối',note:'Làm được chưa? Học gì từ hôm nay?'}] },
      { label:'Ngủ 7–9h', icon:'😴', img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
        why:'Ngủ sau tập nặng là khi growth hormone tiết mạnh nhất — cơ xây trong giấc ngủ, không phải trong phòng gym.',
        details:['Growth hormone tiết ra 70–80% trong deep sleep đầu đêm (23h–1h). Ngủ sớm sau ngày tập nặng = tối ưu hóa GH và phục hồi cơ.','Sleep deprivation sau ngày tập làm giảm muscle protein synthesis 18–20% dù đã ăn đủ đạm — công tập thành vô nghĩa.','Warm-down sau tập (stretch 15\' + box breathing 5\') + không caffeine sau 14h = 2 yếu tố đẩy chất lượng giấc ngủ tối hôm nay lên đáng kể.'],
        points:[{icon:'💪',label:'GH tiết 23h–1h',note:'Ngủ đúng giờ = tối ưu hóa tập luyện'},{icon:'📊',label:'-18–20% muscle synthesis',note:'Thiếu ngủ sau tập = lãng phí công'},{icon:'🌙',label:'Ngủ sớm hơn thường',note:'Ngày tập nặng → thêm 30–60\''},{icon:'🛌',label:'Phòng mát + tối + yên',note:'3 điều kiện vật lý cho giấc ngủ sâu'}] },
    ],
  },
  {
    n:6, theme:'Chuẩn Bị Cho Tuần Mới', emoji:'🗂️', tag:'Meal Prep Weekend',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=70',
    A:{ title:'Yoga Nhẹ / Đi Bộ 30 Phút', detail:'Phục hồi tích cực · không tập nặng cuối tuần đầu', time:'30 phút', note:'Cuối tuần = nạp lại năng lượng. Đừng để áp lực tập làm tổn hại tinh thần.',
      img:'https://images.unsplash.com/photo-1486218119243-13b949ad6cf8?w=800&q=80',
      details:['Cuối tuần đầu tiên nên là nạp năng lượng, không phải kiệt sức. Áp lực phải tập nặng mỗi ngày là nguyên nhân hàng đầu khiến người mới bỏ cuộc.','Yoga nhẹ (yin yoga, restorative yoga) tăng parasympathetic tone — giúp cơ thể và não bộ chuyển từ "survive mode" sang "recover mode".','Đi bộ 30 phút ngoài trời tăng endorphin, vitamin D và serotonin — 3 yếu tố tốt cho sức khỏe tinh thần, không cần phòng gym hay thiết bị.'],
      points:[{icon:'🧘',label:'Yoga 20–30\'',note:'Yin hoặc restorative yoga tốt nhất'},{icon:'🚶',label:'Đi bộ ngoài trời',note:'Thiên nhiên tăng serotonin tự nhiên'},{icon:'🎵',label:'Nghe nhạc/podcast',note:'Kết hợp nạp kiến thức khi đi bộ'},{icon:'🚫',label:'Không tập nặng',note:'Tuần đầu — xây thói quen, không phải phá kỷ lục'}] },
    B:{ title:'Meal Prep 45 Phút', detail:'Nấu 2 loại đạm · rau đủ · tinh bột · chia hộp sẵn', kcal:'~1,495 kcal', note:'Meal prep giảm 60% quyết định ăn ngẫu hứng — thiết lập môi trường thắng.',
      img:'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80',
      details:['Decision fatigue (mệt vì ra quyết định) là nguyên nhân thực sự của ăn uống không lành mạnh — không phải thiếu ý chí. Meal prep loại bỏ quyết định này.','45 phút cuối tuần tiết kiệm ~2 giờ trong tuần — không cần nghĩ "hôm nay ăn gì", không order đồ ăn nhanh vì không biết nấu gì, không bỏ bữa vì bận.','Batch cooking cơ bản: nấu 2 loại đạm (thịt gà + trứng), 1 loại rau nhiều, 1 nồi cơm/khoai. Chia vào hộp = 4–5 bữa trưa đã sẵn sàng.'],
      points:[{icon:'⏱',label:'45\' = 2h tiết kiệm',note:'Không cần nấu 4–5 bữa trưa nữa'},{icon:'🍱',label:'2 loại đạm sẵn',note:'Gà luộc + trứng luộc = linh hoạt nhất'},{icon:'🥦',label:'Rau cắt sẵn',note:'Salad và rau xào dễ làm nhanh hơn'},{icon:'📦',label:'Hộp chia sẵn',note:'Mở là ăn được — giảm quyết định = thắng'}] },
    C:{ title:'Dọn Dẹp Không Gian', detail:'Bàn làm việc gọn · phòng ngủ sạch · tủ lạnh sắp xếp', note:'Không gian gọn gàng giảm cortisol 20% — ảnh hưởng trực tiếp ngủ và tập trung.',
      img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      details:['Không gian lộn xộn kích hoạt vùng não xử lý mối đe dọa liên tục — tạo ra "background stress" âm ỉ ngay cả khi bạn không để ý. Dọn dẹp = giảm cortisol thực sự.','Tủ lạnh sắp xếp theo "healthy default" — rau và protein ở vị trí dễ thấy, đồ ăn vặt ở sau cùng. Môi trường quyết định 80% hành vi ăn uống.','Phòng ngủ gọn gàng = não biết đây là không gian nghỉ ngơi. Khi bàn làm việc và đồ đạc ở trong phòng ngủ, não không tắt được hoàn toàn.'],
      points:[{icon:'🖥️',label:'Bàn làm việc gọn',note:'Chỉ để những gì cần dùng trong ngày'},{icon:'🛏️',label:'Phòng ngủ = nghỉ ngơi',note:'Không có bàn làm việc trong phòng ngủ'},{icon:'🧊',label:'Tủ lạnh sắp xếp',note:'Healthy food nổi bật = default behavior'},{icon:'🌿',label:'Không gian = tâm trí',note:'Môi trường gọn = não gọn'}] },
    D:{ title:'Tổng Kết Tuần 10 Phút', detail:'Làm tốt gì · chưa tốt gì · tuần tới cải thiện gì', note:'Weekly review = công cụ tăng trưởng nhanh nhất. Biến trải nghiệm thành bài học.',
      img:'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
      details:['Weekly review là công cụ tăng trưởng được sử dụng bởi hầu hết CEO và người hiệu suất cao — biến 7 ngày trải nghiệm thành bài học actionable cho tuần sau.','3 câu hỏi cốt lõi: (1) Tuần này làm tốt gì? (2) Chưa tốt gì? (3) Tuần tới cải thiện 1 điều gì? Chỉ 1 — không cần thay đổi tất cả một lúc.','Không tự chỉ trích quá mức — weekly review là tool học hỏi, không phải tòa án. Mục tiêu là nhìn lại với tâm thế tò mò, không phải tội lỗi.'],
      points:[{icon:'✅',label:'Làm tốt gì',note:'Ghi nhận dù nhỏ — builds momentum'},{icon:'🔍',label:'Chưa tốt gì',note:'Không phán xét — chỉ quan sát'},{icon:'🎯',label:'1 cải thiện tuần mới',note:'Chỉ 1 — không overcommit'},{icon:'📋',label:'Plan tuần tiếp',note:'Đặt lịch tập + meal plan trước'}] },
    checklist:[
      { label:'Meal prep 45 phút', icon:'🍱', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        why:'Meal prep là "tự động hóa" quyết định ăn gì — không cần willpower khi đói và mệt vào buổi tối.',
        details:['Khi đói và không có gì sẵn, não chọn thức ăn tiện lợi nhất (thường là processed food). Meal prep loại bỏ quyết định đó — đã có sẵn thì chỉ cần lấy ra ăn.','45 phút cuối tuần chuẩn bị đủ đạm + tinh bột + rau cho 5–7 ngày. Không cần nấu mọi thứ — luộc nguyên liệu là đủ.','Batch cooking tối ưu nhất: luộc 12 trứng (5 phút), hấp 500g ức gà (15 phút), nấu cơm nhiều (10 phút). 3 thứ này là backbone đủ cho 5 ngày.'],
        points:[{icon:'🥚',label:'12 trứng luộc',note:'Để tủ 1 tuần — đạm nhanh mọi lúc'},{icon:'🍗',label:'500g ức gà hấp',note:'Chia 5 hộp — trưa 5 ngày xong'},{icon:'🍚',label:'Cơm nhiều',note:'Để tủ 3–4 ngày — vi sóng là xong'},{icon:'⏱',label:'45 phút là đủ',note:'Không cần nấu phức tạp để thành công'}] },
      { label:"Yoga/đi bộ 30'", icon:'🧘', img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        why:'Active recovery cuối tuần tốt hơn nghỉ hoàn toàn — tăng lưu lượng máu mà không tạo thêm stress cơ.',
        details:['Active recovery tăng blood flow đến cơ, đẩy nhanh thanh thải lactate và giảm DOMS — hiệu quả hơn nằm nghỉ hoàn toàn trên sofa.','Yoga nhẹ kết hợp hít thở sâu kích hoạt hệ phó giao cảm, giảm cortisol — sau 1 tuần làm việc và tập luyện, "reset" hệ thần kinh là điều cần thiết.','30 phút đi bộ ngoài trời cuối tuần: nắng + không khí tươi + bước chân nhẹ = bộ 3 tốt nhất để nạp lại năng lượng cho tuần mới.'],
        points:[{icon:'🚶',label:'Đi bộ ngoài trời',note:'Nắng + không khí tươi + bước nhẹ'},{icon:'🧘',label:'Yoga nhẹ',note:'Restorative yoga — kích hoạt phó giao cảm'},{icon:'💆',label:'Không tập nặng',note:'Recovery = đầu tư, không phải thua cuộc'},{icon:'🌳',label:'Thiên nhiên bonus',note:'Giảm cortisol thêm 15% theo nghiên cứu'}] },
      { label:'Dọn dẹp không gian', icon:'✨', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        why:'Không gian lộn xộn gây cognitive load liên tục — não phải xử lý mọi thứ nhìn thấy dù không cần.',
        details:['Nghiên cứu Princeton 2011: môi trường lộn xộn giảm khả năng tập trung và tăng cortisol. Não xử lý tất cả kích thích thị giác dù không cần thiết.','Dọn dẹp 15–20 phút = "digital detox" cho não về phương diện thị giác. Hiệu quả nhất: dọn bàn làm việc, phòng ngủ và bếp — 3 nơi dùng nhiều nhất.','Thứ tự nhanh nhất: bỏ rác (5\') → gom đồ về chỗ (5\') → lau mặt bàn (5\') → nhìn quanh một lần cuối (5\'). Không cần hoàn hảo.'],
        points:[{icon:'🗑',label:'Bỏ rác trước',note:'Thứ không cần → ra ngoài trước'},{icon:'🛏',label:'Phòng ngủ',note:'Não bắt đầu ngày trong môi trường sạch'},{icon:'🍽',label:'Bếp sạch',note:'Không gian nấu sạch = cook nhiều hơn'},{icon:'🧠',label:'Giảm cognitive load',note:'Mắt không xử lý môi trường nữa'}] },
      { label:"Tổng kết tuần 10'", icon:'📊', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        why:'10 phút nhìn lại cả tuần giúp học từ trải nghiệm thực tế và điều chỉnh hướng đi trước khi tuần mới bắt đầu.',
        details:['Weekly review không cần phức tạp: (1) Làm được gì trong tuần, (2) Khó khăn lớn nhất, (3) 1–2 điều sẽ làm khác tuần tới. 10 phút đủ.','Nhìn lại pattern: ngày nào tập nhiều nhất? Ngày nào bỏ? Lý do bỏ là gì? Đây là dữ liệu thực tế để tuần sau điều chỉnh schedule.','Ăn mừng nhỏ: viết 3 điều làm tốt trong tuần. Não cần reinforcement positive để duy trì motivation — không thể chỉ ghi nhận thất bại.'],
        points:[{icon:'✅',label:'3 điều làm tốt',note:'Bắt đầu với positive — build momentum'},{icon:'🔍',label:'1 khó khăn lớn nhất',note:'1 điều thôi — đủ để học'},{icon:'🔄',label:'1–2 điều đổi tuần sau',note:'Cụ thể và thực tế'},{icon:'🎯',label:'Pattern check',note:'Ngày nào tập? Ngày nào bỏ? Vì sao?'}] },
      { label:'Plan thực đơn tuần mới', icon:'📝', img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        why:'Lên kế hoạch ăn trước khi đói = quyết định bằng lý trí — không phải bằng amygdala đang đói.',
        details:['Khi đói, quyết định ăn gì do amygdala (cảm xúc) điều khiển — không phải prefrontal cortex (lý trí). Plan trước = luôn thắng amygdala.','Không cần plan chi tiết từng bữa — chỉ cần list nguyên liệu cần mua và 3–4 bữa chính sẽ nấu. 5–10 phút là đủ để plan 1 tuần.','Kết hợp grocery shopping sau khi plan: mua đúng những gì cần, không bị cám dỗ bởi đồ processed food khi đi siêu thị đói.'],
        points:[{icon:'📋',label:'List nguyên liệu',note:'Mua gì = nấu gì — đơn giản thế thôi'},{icon:'🍽',label:'3–4 bữa chính',note:'Không cần plan 21 bữa/tuần'},{icon:'🛒',label:'Shopping sau khi plan',note:'Không đi siêu thị khi đói'},{icon:'♻️',label:'Tận dụng meal prep',note:'Plan để batch cooking ngày mai'}] },
    ],
  },
  {
    n:7, theme:'Phục Hồi Hoàn Toàn & Nhìn Lại', emoji:'🌿', tag:'Rest & Reflect',
    color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=70',
    A:{ title:'Nghỉ Ngơi Hoàn Toàn', detail:'Rest day · đi bộ nhẹ nếu muốn · tập trung phục hồi', time:'Tùy chọn', note:'Rest day không phải thua. Cơ thể đang xây sức mạnh từ tuần tập vừa rồi.',
      img:'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
      details:['Supercompensation — cơ thể không chỉ phục hồi về trạng thái ban đầu mà còn xây thêm để chuẩn bị cho tải trọng tương tự. Rest day = đầu tư, không phải lãng phí.','Rest day không nghĩa là nằm im — đi bộ nhẹ 20–30 phút tăng blood flow, giảm DOMS và giúp cơ phục hồi nhanh hơn nằm yên hoàn toàn.','Cảm giác "phải tập mới thấy tốt" ở ngày nghỉ là dấu hiệu của attachment, không phải thiếu recovery. Nhận ra cảm giác này và để nó qua — đây cũng là mindset training.'],
      points:[{icon:'💪',label:'Cơ xây lúc nghỉ',note:'Supercompensation = thực sự cần nghỉ'},{icon:'🚶',label:'Đi bộ nhẹ nếu muốn',note:'20–30\' nhẹ giúp phục hồi tốt hơn'},{icon:'😴',label:'Ngủ nhiều hơn',note:'Rest day là ngày ngủ thêm 30\'–1h'},{icon:'🧠',label:'Mental rest',note:'Không lo về bài tập tiếp theo'}] },
    B:{ title:'Ăn Nhẹ Dễ Tiêu', detail:'Canh rau · cháo/soup · trái cây · ~1,240 kcal', kcal:'~1,240 kcal', note:'Để hệ tiêu hóa nghỉ ngơi 1 ngày — ít chế biến, nhiều rau quả, đủ nước.',
      img:'https://images.unsplash.com/photo-1548940740-204726a19be3?w=800&q=80',
      details:['Hệ tiêu hóa cũng cần nghỉ ngơi — ăn nhẹ, dễ tiêu 1 ngày/tuần giảm viêm đường ruột và tăng khả năng hấp thụ dinh dưỡng cho tuần tiếp theo.','Cháo, soup, canh rau là food dễ tiêu nhất: ít chất xơ thô, nhiều nước, ít năng lượng để tiêu hóa. Hệ tiêu hóa "thở phào" sau 6 ngày vừa qua.','1.240 kcal thấp hơn bình thường vì không tập nặng hôm nay — nhu cầu năng lượng thấp hơn, không cần ép ăn đủ. Lắng nghe cơ thể.'],
      points:[{icon:'🍲',label:'Canh rau / soup',note:'Dễ tiêu, nhiều nước, ít calo'},{icon:'🥣',label:'Cháo',note:'Nhẹ bụng nhất, tốt cho đường ruột'},{icon:'🍊',label:'Trái cây',note:'Vitamin, enzyme hỗ trợ tiêu hóa'},{icon:'💧',label:'Uống nhiều nước',note:'2–2.5L ngày nghỉ để flush toxin'}] },
    C:{ title:'Lên Kế Hoạch Tuần Mới', detail:'Đặt lịch tập · chuẩn bị thực đơn · xem lại mục tiêu', note:'Chuẩn bị = chiến thắng 80% — không cần ngẫu hứng mỗi ngày.',
      img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
      details:['Planning removes friction — khi đã đặt sẵn "Thứ 2 tập lúc 6h30", não không cần quyết định lại. Mỗi quyết định nhỏ tiêu tốn willpower — planning tiết kiệm willpower cho những gì quan trọng.','Grocery list chuẩn bị ngày chủ nhật = không thiếu nguyên liệu lành mạnh trong tuần. Tủ lạnh đầy healthy food = không cần đặt đồ ăn nhanh vì "không có gì ăn".','Xem lại mục tiêu 3 tháng mỗi chủ nhật — kiểm tra xem hành động tuần này có đang đúng hướng không. Điều chỉnh sớm tốt hơn điều chỉnh sau khi đã đi sai lâu.'],
      points:[{icon:'📅',label:'Đặt lịch tập',note:'Block calendar = commitment thật sự'},{icon:'🛒',label:'Grocery list',note:'Mua sẵn = không thiếu nguyên liệu'},{icon:'🎯',label:'Xem lại mục tiêu',note:'Hành động tuần này đúng hướng chưa?'},{icon:'📝',label:'Meal plan sơ bộ',note:'3 bữa chính — không cần chi tiết'}] },
    D:{ title:'Tổng Kết 7 Ngày Đầu', detail:'3 điều làm được · 1 cần cải thiện · 1 cam kết tiếp', note:'Nhìn lại để học và tiếp tục với nhiều thông tin hơn — không phải để chỉ trích.',
      img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      details:['Hoàn thành 7 ngày đầu là mốc quan trọng hơn bạn nghĩ — hầu hết người không tập không vượt qua được ngưỡng này. Đây là bằng chứng bạn khác đa số.','3 điều làm được (dù nhỏ) + 1 cần cải thiện + 1 cam kết tiếp theo: cấu trúc này cân bằng giữa ghi nhận và học hỏi — không quá tự phê bình, không quá tự mãn.','Chia sẻ kết quả 7 ngày với 1 người — accountability partner tăng tỷ lệ tiếp tục lên đến 65% theo nghiên cứu của American Society of Training & Development.'],
      points:[{icon:'🏆',label:'3 điều làm được',note:'Ghi nhận momentum — dù nhỏ'},{icon:'🔍',label:'1 cần cải thiện',note:'Chỉ 1 — tập trung vào điều quan trọng nhất'},{icon:'💪',label:'1 cam kết tiếp',note:'Tuần 2 bắt đầu với gì?'},{icon:'👥',label:'Chia sẻ với ai đó',note:'Accountability +65% tỷ lệ tiếp tục'}] },
    checklist:[
      { label:'Nghỉ / đi bộ nhẹ', icon:'🚶', img:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
        why:'Supercompensation: cơ thể không chỉ phục hồi về ban đầu mà còn xây thêm sức mạnh trong ngày nghỉ.',
        details:['Supercompensation xảy ra 24–72h sau tập nặng — cơ thể phục hồi và xây thêm để chuẩn bị cho tải trọng tương tự. Ngày nghỉ là phần của chương trình tập, không phải ngoài lề.','Active rest (đi bộ nhẹ 20–30 phút) tốt hơn complete rest — tăng blood flow, giảm DOMS, không gây thêm stress cơ.','Cảm giác "phải tập mới tốt" vào ngày nghỉ là attachment, không phải thiếu recovery. Nhận ra cảm giác này và để nó qua — đây cũng là mindset training.'],
        points:[{icon:'💪',label:'Cơ xây lúc nghỉ',note:'Supercompensation — kế hoạch từ đầu'},{icon:'🚶',label:'Đi bộ nhẹ ổn',note:'20–30\' nhẹ giúp recovery tốt hơn'},{icon:'😴',label:'Ngủ thêm 30\'',note:'Rest day = cho phép ngủ thêm'},{icon:'🧠',label:'Mental rest',note:'Không lo bài tập tiếp theo'}] },
      { label:'Ăn nhẹ dễ tiêu', icon:'🥣', img:'https://images.unsplash.com/photo-1548940740-204726a19be3?w=800&q=80',
        why:'Hệ tiêu hóa cũng cần nghỉ ngơi — ăn nhẹ 1 ngày/tuần giảm viêm đường ruột và nạp lại enzyme tiêu hóa.',
        details:['Gut rest (ăn nhẹ, dễ tiêu) 1 ngày/tuần giúp lining đường ruột phục hồi và vi khuẩn đường ruột cân bằng lại — tương tự rest day cho cơ bắp.','Cháo, soup, canh rau dễ tiêu nhất: ít chất xơ thô, nhiều nước, ít năng lượng để tiêu hóa. Hệ tiêu hóa xử lý nhanh mà không cần nhiều enzyme.','1.240 kcal thấp hơn bình thường — không tập nặng nên nhu cầu năng lượng thấp hơn. Lắng nghe cơ thể thay vì ép đủ calo.'],
        points:[{icon:'🍲',label:'Canh rau / soup',note:'Nhẹ nhất cho đường ruột'},{icon:'🥣',label:'Cháo',note:'Dễ tiêu nhất — ít enzyme nhất'},{icon:'🍊',label:'Trái cây',note:'Enzyme tự nhiên hỗ trợ tiêu hóa'},{icon:'💧',label:'Uống nhiều nước',note:'2–2.5L ngày nghỉ — flush toxin'}] },
      { label:'Lên kế hoạch tuần tới', icon:'📅', img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        why:'Planning trước khi tuần bắt đầu loại bỏ quyết định thời gian thực — tiết kiệm willpower cho điều quan trọng hơn.',
        details:['Decision fatigue: mỗi quyết định nhỏ (tập hay không, ăn gì) tiêu tốn willpower. Plan trước = não không cần quyết định lại, chỉ cần thực thi.','Block calendar cho buổi tập = commitment thật sự. "Tôi sẽ tập" < "Tôi block Thứ 2, 3, 5 lúc 6h30 để tập" về tỷ lệ thực hiện rất nhiều.','Grocery list chuẩn bị sẵn = không thiếu nguyên liệu lành mạnh giữa tuần = không phải đặt đồ ăn nhanh "vì không có gì ăn".'],
        points:[{icon:'📅',label:'Block calendar',note:'Đặt lịch tập = commitment thật sự'},{icon:'🛒',label:'Grocery list',note:'Mua đủ = không thiếu giữa tuần'},{icon:'🎯',label:'Mục tiêu tuần 2',note:'Tăng gì? Cải thiện điều gì?'},{icon:'📝',label:'Meal plan sơ bộ',note:'3 bữa chính — không cần chi tiết'}] },
      { label:'Nhật ký tổng kết 7 ngày', icon:'📖', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        why:'7 ngày đầu là mốc quan trọng nhất — hầu hết người bỏ cuộc trước ngày 4. Bạn đã vượt ngưỡng này.',
        details:['Hoàn thành 7 ngày liên tiếp là thành tích khó hơn bạn nghĩ. Phần lớn người thử thói quen mới bỏ cuộc trước ngày 4 — bạn đã vượt qua ngưỡng quan trọng nhất.','Nhật ký 7 ngày không phải đánh giá thành tích — là bức tranh chụp điểm xuất phát để sau 3 tháng so sánh. Khi nhìn lại sẽ thấy sự khác biệt rõ ràng.','Cấu trúc đơn giản nhất: (1) Điều ngạc nhiên nhất trong 7 ngày, (2) Khó khăn lớn nhất, (3) 1 cam kết tiếp theo. 15 phút đủ.'],
        points:[{icon:'🏆',label:'3 điều làm được',note:'Dù nhỏ — ghi nhận để build trust'},{icon:'🔍',label:'Khó nhất là gì',note:'Học từ khó khăn thật hơn thành công'},{icon:'💪',label:'1 cam kết tuần 2',note:'Cụ thể và đo được'},{icon:'👥',label:'Chia sẻ với ai đó',note:'Accountability +65% tỷ lệ tiếp tục'}] },
      { label:'Ngủ sớm trước 22h30', icon:'🌙', img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
        why:'Ngủ trước 22h30 ngày cuối tuần reset đồng hồ sinh học — chống social jetlag cho thứ 2 tuần mới.',
        details:['Social jetlag — thức khuya cuối tuần, dậy muộn — gây trạng thái tương tự jetlag nhẹ vào thứ 2. Ngủ đúng giờ 7 ngày liên tiếp loại bỏ hoàn toàn điều này.','Ngủ thêm 30–60 phút ngày nghỉ (không quá 1 tiếng so với ngày thường) giúp trả "sleep debt" mà không gây social jetlag.','Ngày 7 ngủ trước 22h30 = dậy sảng khoái vào thứ 2, bắt đầu tuần 2 với năng lượng cao nhất. Đây là cuộc đầu tư cho tuần tiếp theo.'],
        points:[{icon:'⏰',label:'22h30 target',note:'Sớm hơn thường 30\' — trả sleep debt'},{icon:'🔄',label:'Reset đồng hồ sinh học',note:'Chống social jetlag thứ 2'},{icon:'📵',label:'Phone off lúc 21h',note:'Chuẩn bị để ngủ sớm hơn'},{icon:'🌅',label:'Tuần 2 bắt đầu đỉnh',note:'7 ngày nhất quán — kết quả tuần 2 sẽ tốt hơn'}] },
    ],
  },
];

// ── 12-Week phases ───────────────────────────────────────────────────────────
const TWELVE_PHASES = [
  {
    id:1, weeks:'Tuần 1–4', tag:'FOUNDATION', name:'Khởi Động Nền Tảng', emoji:'🌱',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=70',
    goal:'Hình thành 5 thói quen cốt lõi — tập 3×/tuần, đĩa ăn chuẩn, ngủ trước 23h, thở sâu sáng, ghi nhật ký',
    pillars:{
      A:'6 mẫu vận động · form trước volume · 3×/tuần 20–25\' · khởi động + giãn cơ bắt buộc',
      B:'Đĩa ăn ½ rau ¼ đạm ¼ tinh bột · 1 lòng bàn tay đạm/bữa · giảm đồ ngọt · uống 1.8–2L/ngày',
      C:'Ngủ trước 23h · không phone 30\' trước ngủ · 7.500–8.000 bước/ngày',
      D:'3 hơi thở sâu sáng · nhật ký 3 dòng tối · box breathing khi căng thẳng',
      F:'Daily Checklist mỗi ngày · Workout Log mỗi buổi · Baseline Test tuần 1',
    },
    kpis:['Tập đủ 12 buổi trong 4 tuần','Thành thạo tư thế 6 động tác','Ngủ trước 23h ≥5/7 ngày','Ghi nhật ký ≥5/7 ngày','Daily Checklist ≥4/6 items/ngày'],
    milestones:['12 buổi tập hoàn thành','Biết tên + tư thế 6 bài tập','Ngủ đúng giờ 5 ngày liên tiếp','Ghi nhật ký 5 ngày liên tiếp'],
    note:'Không tăng cường độ trong 4 tuần này. Mục tiêu là xây thói quen, không phải kết quả ngay lập tức.',
  },
  {
    id:2, weeks:'Tuần 5–8', tag:'BUILD BASE', name:'Xây Dựng Cơ Sở', emoji:'📈',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70',
    goal:'Tăng khối lượng tập dần dần, hiểu TDEE cá nhân, ổn định giấc ngủ, thiền ngắn mỗi ngày',
    pillars:{
      A:'Tăng 1 set/tuần · biến thể khó hơn · thêm 2 cardio nhẹ/tuần 20–30\' · ghi RPE mỗi buổi',
      B:'Tính TDEE với B0 calculator · chia macro P/C/F · meal prep 1×/tuần · tracking 3–4 ngày/tuần',
      C:'Ngủ ±15\' cố định · ánh nắng sáng 5\' · NEAT 8.000–10.000 bước · caffeine trước 14h',
      D:'Thiền 3\'/ngày · box breathing khi căng thẳng · brain dump cuối tuần · giảm màn hình tối',
      F:'Lifestyle Tracker · Workout Log RPE · Meal Plan Template · Test tiến bộ tuần 8',
    },
    kpis:['Tập 4×/tuần 25–30\'','Biết TDEE + protein target cá nhân','Thiền 3\' ≥5/7 ngày','Test tuần 8: cải thiện ≥2/6 chỉ số','Meal prep 1×/tuần ổn định'],
    milestones:['Test tiến bộ tuần 8','Hiểu TDEE cá nhân','Thiền 3\' liên tiếp 7 ngày','Cardio nhẹ 2×/tuần ổn định'],
    note:'Tăng không quá 10% volume/tuần. Nếu đau hoặc mệt quá — giảm 20% và phục hồi 1 tuần.',
  },
  {
    id:3, weeks:'Tuần 9–12', tag:'PERSONALIZE', name:'Cá Nhân Hóa & Hoàn Thiện', emoji:'🎯',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=70',
    goal:'Chọn hướng phát triển cá nhân, tối ưu bằng dữ liệu 8 tuần, tự thiết kế kế hoạch 12 tuần tiếp',
    pillars:{
      A:'Chọn hướng: Sức mạnh/Cơ bắp/Sức bền · chương trình cá nhân hóa · kiểm soát RPE 7–8',
      B:'Điều chỉnh kcal theo mục tiêu · carb timing trước/sau tập · supplement nếu cần (Whey/Creatine)',
      C:'Ngủ ±10\' cố định · active recovery 10\'/ngày · thiết kế phòng ngủ tối ưu',
      D:'Thiền 5–10\' · journaling 2 phong cách · gentle discipline · digital detox 1×/tuần',
      F:'Daily Health Score · Mind Tracker · Reset Protocol · tự thiết kế 12 tuần tiếp theo',
    },
    kpis:['Chọn 1 hướng mục tiêu rõ ràng','Tự lên kế hoạch tuần tập','Test tuần 12 vs baseline','Calm Score tăng ≥10 điểm','Checklist ≥4/6 items/ngày ổn định'],
    milestones:['Test cuối tuần 12 hoàn thành','Tự thiết kế program 12 tuần tiếp','Lối sống ổn định ≥4 tuần liên tiếp','Calm Score tăng ≥10 từ baseline'],
    note:'Tuần 9–12: bạn trở thành người tự quản lý sức khỏe. Dữ liệu 8 tuần qua là chìa khóa cá nhân hóa.',
  },
];

// ── 24-Week = 12-week + 3 advanced phases ───────────────────────────────────
const ADV_PHASES = [
  {
    id:4, weeks:'Tuần 13–16', tag:'ADVANCED', name:'Nâng Cao & Carb Cycling', emoji:'⚡',
    color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=70',
    goal:'Tối ưu thành phần cơ thể bằng carb cycling, kỹ thuật tập nâng cao, digital detox thực sự',
    pillars:{
      A:'Periodized training: Hypertrophy → Strength block · Tempo reps · Pause reps · Deload định kỳ',
      B:'Carb cycling: ngày tập nặng/nhẹ/nghỉ · Pre-workout carb · Post-workout protein window · Hydration+',
      C:'Môi trường ngủ chuẩn (18°C, tối, yên) · NEAT + LISS kết hợp · Screen time hard limit',
      D:'Digital detox 1 ngày/tuần · Body scan 1×/tuần · Journaling nâng cao · Breathwork advanced',
      F:'Health Score ≥70/ngày · 30-day trend analysis · Reset protocol hoàn thiện',
    },
    kpis:['Carb cycling ổn định ≥3 tuần','Digital detox thành thói quen tuần','Health Score ≥70/ngày','Test tuần 16: body comp cải thiện','Calm Score ≥70/100'],
    milestones:['Test tiến bộ tuần 16','Carb cycling tự tin không cần nhắc','Digital detox 1 ngày/tuần đều đặn','Calm Score ≥70'],
    note:'Phase 4 yêu cầu nền tảng vững từ 12 tuần đầu. Không bỏ qua phase 1–3.',
  },
  {
    id:5, weeks:'Tuần 17–20', tag:'OPTIMIZE', name:'Tối Ưu Hóa Toàn Diện', emoji:'🔬',
    color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70',
    goal:'Tối ưu từng pillar theo dữ liệu cá nhân, supplement protocol, chronotype optimization',
    pillars:{
      A:'Peak strength block · 1RM testing (tùy chọn) · Mobility deep work · Injury prevention protocol',
      B:'Electrolyte protocol · Creatine + Omega-3 + VitD + Mg · Advanced meal timing · Fat quality',
      C:'Chronotype optimization · Peak performance window · Advanced sleep hygiene · Sauna/cold (nếu có)',
      D:'Thiền 10\'/ngày · Body scan sâu · Advanced journaling: future self · Breathwork Wim Hof cơ bản',
      F:'Health Score ≥80/ngày · Plateau identification + fix · 30-day trend deep dive · Self-coaching',
    },
    kpis:['Supplement protocol ổn định 4 tuần','Chronotype + peak window xác định','Thiền 10\' đều đặn','Health Score ≥80/ngày','Test tuần 20: benchmark mới'],
    milestones:['Test tiến bộ tuần 20','Supplement protocol ổn định','Peak performance window tìm ra','Thiền 10\' liên tiếp 14 ngày'],
    note:'Supplement = 5–10% kết quả. Basics (tập + ăn + ngủ) vẫn là 90%. Đừng bỏ nền tảng.',
  },
  {
    id:6, weeks:'Tuần 21–24', tag:'MASTERY', name:'Làm Chủ & Thiết Kế Hệ Thống', emoji:'🎓',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=70',
    goal:'Tự thiết kế hệ thống sức khỏe hoàn chỉnh, 80/20 mastery, truyền kiến thức cho người thân',
    pillars:{
      A:'Tự thiết kế 6-tháng program · Self-coaching · Phase cycling tự main không cần hướng dẫn',
      B:'Intuitive eating + 80/20 rule · Recover tốt sau du lịch/hội họp · Family meal integration',
      C:'Lối sống tự vận hành · Tự assess và điều chỉnh · Zero willpower dependency',
      D:'Mental wellness stack cá nhân · Dạy người thân ≥3 thói quen · Long-term peace & resilience',
      F:'Tracking tối giản · Chỉ dùng tools thực sự có giá trị · Tự coach với data 6 tháng tới',
    },
    kpis:['Self-designed 6-month program hoàn chỉnh','80/20: biết 20% thói quen tạo 80% kết quả','Dạy ≥1 người thân ≥3 thói quen','Test tuần 24 vs baseline ngày 1','Hệ thống tự vận hành không cần nhắc nhở'],
    milestones:['Test cuối tuần 24 toàn diện vs ngày 1','Program 6 tháng tiếp theo hoàn chỉnh','Dạy được người thân ≥3 thói quen','Viết "Hành Trình Của Tôi" 1 trang'],
    note:'Sau 24 tuần, bạn không còn "cố gắng khỏe" — bạn đã trở thành người sống khỏe. Đó là sự khác biệt.',
  },
];

const TWENTY_FOUR_PHASES = [...TWELVE_PHASES, ...ADV_PHASES];

// ── Daily framework ──────────────────────────────────────────────────────────
const DAILY_BLOCKS = [
  { time:'5 phút',     name:'Khởi Động',          desc:'Khớp linh hoạt · nâng nhiệt cơ thể',     icon:'🔥', color:'#22c55e' },
  { time:'10–20 phút', name:'Vận Động Chính',      desc:'Sức mạnh hoặc cardio theo lịch',          icon:'💪', color:'#84cc16' },
  { time:'5–10 phút',  name:'Giãn Cơ & Hạ Nhiệt', desc:'Kéo giãn · hạ nhịp tim · thư giãn cơ',  icon:'🧘', color:'#14b8a6' },
  { time:'5 phút',     name:'Mind Reset',          desc:'Thở sâu hoặc thiền ngắn · đặt ý định',   icon:'🌿', color:'#a855f7' },
];

const WEEKLY_RHYTHM = [
  { days:'T2 · T4 · T6', type:'Sức Mạnh',         desc:'Squat · Hinge · Push · Pull · Core — 20–30\'',         color:'green'  },
  { days:'T3 · T5',      type:'Cardio Nhẹ',        desc:'Đi bộ nhanh · đạp xe · leo cầu thang — 20–30\'',      color:'blue'   },
  { days:'T7',           type:'Phục Hồi Tích Cực', desc:'Giãn cơ · yoga · đi bộ thư giãn · massage',           color:'teal'   },
  { days:'CN',           type:'Nghỉ Ngơi',         desc:'Phục hồi hoàn toàn hoặc vận động nhẹ tùy thích',      color:'purple' },
];

const DAY_CLS = { green:'bg-green-500/8 border-green-500/25 text-green-400', blue:'bg-blue-500/8 border-blue-500/25 text-blue-400', teal:'bg-teal-500/8 border-teal-500/25 text-teal-400', purple:'bg-purple-500/8 border-purple-500/25 text-purple-400' };
const DAY_DOT = { green:'bg-green-400', blue:'bg-blue-400', teal:'bg-teal-400', purple:'bg-purple-400' };

const TAB_META = [
  { icon:'💪', c:'#22c55e', rgb:'34,197,94',   ring:'ring-green-500/30',  shadow:'shadow-[0_0_24px_rgba(34,197,94,0.18)]'  },
  { icon:'🏃', c:'#3b82f6', rgb:'59,130,246',  ring:'ring-blue-500/30',   shadow:'shadow-[0_0_24px_rgba(59,130,246,0.18)]' },
  { icon:'🧘', c:'#14b8a6', rgb:'20,184,166',  ring:'ring-teal-500/30',   shadow:'shadow-[0_0_24px_rgba(20,184,166,0.18)]' },
  { icon:'😴', c:'#a855f7', rgb:'168,85,247',  ring:'ring-purple-500/30', shadow:'shadow-[0_0_24px_rgba(168,85,247,0.18)]' },
];

const WEEKLY_PANEL = [
  {
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70',
    intensity: 'RPE 7/10', duration: '20–30\'', sessions: '3×/tuần', rest: '60–90s',
    moves: ['Squat — 3×12', 'Hinge (Deadlift) — 3×10', 'Push (Push-up) — 3×10', 'Pull (Row) — 3×10', 'Core (Plank) — 3×30s'],
    tips: ['Form trước cường độ — không tăng tải khi chưa đúng tư thế', 'Khởi động 5\' bắt buộc trước mỗi buổi', 'Tăng không quá 10% volume/tuần', 'Ghi RPE + số lần vào nhật ký ngay sau buổi tập'],
    avoid: 'Không tập 2 ngày liên tiếp — cơ cần 48h để tái tạo',
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=70',
    intensity: 'RPE 5/10', duration: '20–30\'', sessions: '2×/tuần', rest: 'N/A',
    moves: ['Đi bộ nhanh — nhịp tim 100–120 bpm', 'Đạp xe tĩnh / ngoài trời', 'Leo cầu thang (NEAT)', 'Bơi lội nhẹ / aqua jogging', 'Nhảy dây nhẹ — 10\' đủ'],
    tips: ['Sau bữa trưa = giảm đường huyết 20–30%', 'Đi bộ đến chỗ làm = NEAT miễn phí', 'Nghe podcast / nhạc để tăng commitment', 'Nhịp tim mục tiêu = (220 - tuổi) × 60–70%'],
    avoid: 'Không chạy nhanh ngay sau bữa ăn — chờ ít nhất 30 phút',
  },
  {
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=70',
    intensity: 'RPE 3/10', duration: '20–45\'', sessions: '1×/tuần', rest: 'Linh hoạt',
    moves: ['Giãn cơ tĩnh — giữ 30–60s/vị trí', 'Foam roll toàn thân — 10\'', 'Yoga nhẹ / yin yoga', 'Đi bộ thư giãn công viên', 'Massage nhẹ / tự massage bằng bóng'],
    tips: ['Đây là "tập vô hình" — cơ lớn lúc phục hồi', 'Breathing: hít 4s → giữ 4s → thở ra 6s', 'Đây là lúc nghe body signal tốt nhất', 'Uống nhiều nước hơn bình thường'],
    avoid: 'Tránh coi đây là ngày lười biếng — phục hồi có chủ đích = cơ lớn hơn',
  },
  {
    img: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=900&q=70',
    intensity: 'Không', duration: 'Tùy ý', sessions: '1×/tuần', rest: 'Hoàn toàn',
    moves: ['Đọc sách / nghe nhạc thư giãn', 'Thiền 10–15 phút', 'Dành thời gian với gia đình', 'Nấu ăn lành mạnh meal prep', 'Lên kế hoạch cho tuần mới'],
    tips: ['Nghỉ không phải thua — đây là khi protein synthesis cao nhất', 'Ngủ 8h+ nếu có thể — golden window tái tạo', 'Review nhật ký tuần: 3 điều tốt, 1 cải thiện', 'Lên kế hoạch thực đơn + lịch tập cho tuần tới'],
    avoid: 'Đừng tập "bù" nếu bỏ buổi — điều chỉnh lịch thay vì tập gấp đôi',
  },
];

const SUCCESS_TIPS = [
  { icon:'🔁', title:'Nhất Quán Hơn Cường Độ',     desc:'3–5 buổi/tuần đều đặn quan trọng hơn 1 buổi kiệt sức. 20 phút mỗi ngày thắng 2 giờ mỗi tháng.' },
  { icon:'📈', title:'Tăng Tải Từ Từ',              desc:'Tăng không quá 10% volume/tuần. Quy tắc này ngăn chấn thương và burnout về lâu dài.' },
  { icon:'😴', title:'Ngủ Là Thuốc Phục Hồi',       desc:'7–9h mỗi đêm. Cơ lớn lúc ngủ, không phải lúc tập. Thiếu ngủ giảm hiệu suất 20–30%.' },
  { icon:'🥗', title:'Đạm Đủ Mỗi Ngày',             desc:'1.6–2g protein/kg cân nặng. Ưu tiên thực phẩm nguyên chất: trứng, thịt nạc, đậu hũ, sữa chua Hy Lạp.' },
  { icon:'📓', title:'Ghi Nhật Ký Tập',              desc:'5 phút/buổi: ghi số set, số lần, cảm giác. Nhật ký cho bạn thấy tiến bộ mà mắt thường không thấy.' },
  { icon:'🧠', title:'Kiên Nhẫn Với Kết Quả',       desc:'Kết quả thực sự đến sau 4–8 tuần nhất quán. Những tuần đầu là não đang học — không phải lười biếng.' },
];

const PROGRESS_ROWS = [
  { metric:'Sức Bền Tim Mạch',   test:'Đi bộ nhanh 6 phút',            unit:'m'         },
  { metric:'Sức Mạnh Thân Trên', test:'Push-up tối đa liên tiếp',       unit:'lần'       },
  { metric:'Sức Mạnh Hạ Chi',    test:'Đứng lên ngồi xuống 1 phút',    unit:'lần'       },
  { metric:'Linh Hoạt',          test:'Cúi chạm ngón chân',             unit:'Không/Có'  },
  { metric:'Cân Nặng',           test:'Cân buổi sáng chưa ăn',          unit:'kg'        },
  { metric:'Vòng Eo',            test:'Đo sau thở ra tự nhiên',         unit:'cm'        },
  { metric:'Nhịp Tim Lúc Nghỉ',  test:'Sau nằm yên 5 phút',            unit:'bpm'       },
  { metric:'Chất Lượng Ngủ',     test:'Tự đánh giá 1–10',              unit:'điểm'      },
];

// ── Journey config ───────────────────────────────────────────────────────────
const JOURNEYS = [
  { id:'7d', label:'7 Ngày Khởi Động', sub:'Tuần đầu tiên', icon:'🌱', color:'#22c55e', rgb:'34,197,94',
    desc:'Bắt đầu nhẹ nhàng với 7 ngày đầu tiên. Mỗi ngày tích hợp đủ 4 trụ cột: Vận động · Dinh dưỡng · Lối sống · Tâm trí.',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    details:[
      '7 ngày đầu tích hợp đủ 4 trụ cột mỗi ngày: Vận động (20–30\') + Dinh dưỡng (đủ đạm 2–3 bữa) + Lối sống (ngủ trước 23h) + Tâm trí (hơi thở sáng). Không cần hoàn hảo — làm đủ 4 là thành công.',
      '7 ngày đầu là thử thách khó nhất — phần lớn người bỏ cuộc trước ngày 4. Mục tiêu không phải kết quả thể hình mà là xây "ngôn ngữ" cơ thể và thiết lập neural pathway cho thói quen.',
      'Cấu trúc 7 ngày: Ngày 1–3 (học form + đặt nền tảng) → Ngày 4 (active recovery) → Ngày 5 (tập sức mạnh) → Ngày 6 (meal prep + yoga) → Ngày 7 (nghỉ + lên kế hoạch tuần mới).',
    ],
    points:[
      { icon:'🌱', label:'Ngày 1–3', note:'Học 6 chuyển động + đủ đạm + ngủ 23h' },
      { icon:'💪', label:'Ngày 4–5', note:'Recovery + tập sức mạnh 30\'' },
      { icon:'🗂️', label:'Ngày 6', note:'Meal prep + active recovery' },
      { icon:'🌿', label:'Ngày 7', note:'Nghỉ hoàn toàn + kế hoạch tuần mới' },
    ],
  },
  { id:'12w', label:'12 Tuần Cơ Bản', sub:'Chương trình nền tảng', icon:'📈', color:'#84cc16', rgb:'132,204,22',
    desc:'3 giai đoạn 12 tuần: Khởi Động → Xây Nền → Cá Nhân Hóa. Đủ thời gian để thay đổi thói quen não bộ vĩnh viễn.',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    details:[
      '3 giai đoạn rõ ràng: Tuần 1–4 (Khởi Động — hình thành 5 thói quen cốt lõi) → Tuần 5–8 (Xây Nền — tăng volume và intensity) → Tuần 9–12 (Cá Nhân Hóa — điều chỉnh theo kết quả thực tế).',
      'Nghiên cứu UCL: trung bình 66 ngày để hành động tự động hóa hoàn toàn. 12 tuần = 84 ngày — vượt ngưỡng này. Sau 12 tuần, không còn cần willpower để tập — nó trở thành autopilot.',
      'Bao gồm 5 bài test hàng tháng để đo tiến độ thực tế: Plank, Push-up, Squat 1 phút, Đi bộ 1km và chu vi eo. Dữ liệu thật để biết mình đang tiến hay cần điều chỉnh.',
    ],
    points:[
      { icon:'🌱', label:'Tuần 1–4', note:'Khởi Động — 5 thói quen cốt lõi' },
      { icon:'📈', label:'Tuần 5–8', note:'Xây Nền — tăng volume & intensity' },
      { icon:'🎯', label:'Tuần 9–12', note:'Cá Nhân Hóa — điều chỉnh theo kết quả' },
      { icon:'📊', label:'Test hàng tháng', note:'5 bài đo tiến độ thực tế' },
    ],
  },
  { id:'24w', label:'24 Tuần Nâng Cao', sub:'Chương trình toàn diện', icon:'🎓', color:'#a855f7', rgb:'168,85,247',
    desc:'6 giai đoạn 24 tuần: từ người mới đến làm chủ hoàn toàn hệ thống sức khỏe cá nhân. Carb cycling + supplement + mastery.',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    details:[
      '6 giai đoạn: Khởi Động (1–4) → Xây Nền (5–8) → Tăng Tốc (9–12) → Chuyên Sâu (13–16) → Nâng Cao (17–20) → Mastery (21–24). Mỗi giai đoạn xây trên nền của giai đoạn trước.',
      'Nội dung nâng cao giai đoạn 3–6: Carb cycling (điều chỉnh carb theo ngày tập/nghỉ), basic supplementation (protein, creatine, vitamin D), và periodization (deload week có cấu trúc).',
      'Sau 24 tuần, bạn hiểu cơ thể của chính mình đủ để tự thiết kế chương trình tiếp theo. Đây là điểm khác biệt với 12 tuần — không chỉ khỏe hơn mà còn tự chủ hoàn toàn.',
    ],
    points:[
      { icon:'🏗️', label:'Giai đoạn 1–2', note:'Xây nền tảng từ cơ bản đến trung bình' },
      { icon:'⚡', label:'Giai đoạn 3–4', note:'Carb cycling + supplementation cơ bản' },
      { icon:'🎓', label:'Giai đoạn 5–6', note:'Mastery — tự thiết kế chương trình' },
      { icon:'🧬', label:'Cá nhân hóa', note:'Hiểu cơ thể riêng của mình hoàn toàn' },
    ],
  },
  { id:'sample', label:'Lộ Trình Mẫu', sub:'Ví dụ thực tế', icon:'🗺️', color:'#0ea5e9', rgb:'14,165,233',
    desc:'Xem lộ trình 12 tuần của một người thực tế: 32 tuổi, nhân viên văn phòng, mục tiêu giảm 5kg và tăng năng lượng.',
    img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    details:[
      'Lộ trình thực tế của Tuấn — 32 tuổi, nhân viên văn phòng, 78kg, mục tiêu giảm 5kg và tăng năng lượng. Xem ngày làm gì, ăn gì, tập gì và kết quả cụ thể từng tuần.',
      'Không phải lộ trình lý tưởng — là lộ trình thực tế với những ngày bỏ lỡ, những lần ăn ngoài không theo kế hoạch, và cách điều chỉnh khi bị gián đoạn. Thực tế hơn mọi "perfect plan".',
      'Bao gồm: tracking calo theo tuần, kết quả cân và đo lường từng tháng, những sai lầm gặp phải và cách sửa — cộng với 4 bài học rút ra cho người muốn tự thiết kế lộ trình của mình.',
    ],
    points:[
      { icon:'👤', label:'Tuấn: 78kg → 73kg', note:'12 tuần, thực tế không lý tưởng' },
      { icon:'📊', label:'Tracking thực tế', note:'Calo · cân nặng · chu vi eo/tuần' },
      { icon:'❌', label:'Sai lầm + cách sửa', note:'Học từ thực tế hơn lý thuyết' },
      { icon:'📝', label:'4 bài học quan trọng', note:'Insight sau 12 tuần thực hành' },
    ],
  },
];

const SUB_TABS_12W = [
  { id:'phases', label:'Lộ Trình', icon:'🗓️' },
  { id:'daily',  label:'Khung Ngày', icon:'⏱️' },
  { id:'weekly', label:'Nhịp Tuần', icon:'📅' },
  { id:'tips',   label:'Nguyên Tắc', icon:'💡' },
  { id:'test',   label:'Bài Test', icon:'📈' },
];

// ── PillarRow ────────────────────────────────────────────────────────────────
function PillarRow({ id, text }) {
  const p = PC[id];
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: p.bg, border: `1px solid ${p.br}` }}>
      <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: p.c }}>{p.l}</span>
        <p className="text-base text-muted leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

// ── PhaseCard ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, idx, expanded, onToggle }) {
  const { t } = useTranslation();
  const isEven = idx % 2 === 0;
  return (
    <RevealBlock delay={idx * 80} className="flex gap-4 md:gap-6">
      {/* Timeline dot */}
      <div className="flex flex-col items-center shrink-0">
        <button
          onClick={onToggle}
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-white text-lg z-10 shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          style={{ background: phase.color, borderColor: phase.color }}
        >
          {phase.emoji}
        </button>
        {idx < 2 && <div className="flex-1 w-px mt-2" style={{ background: `rgba(${phase.rgb},0.25)` }} />}
      </div>

      {/* Card */}
      <div className="flex-1 mb-6">
        <button
          onClick={onToggle}
          className="w-full text-left border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
          style={{ borderColor: `rgba(${phase.rgb},0.3)`, background: `rgba(${phase.rgb},0.04)` }}
        >
          {/* Image header */}
          <div className="relative h-28 md:h-36 overflow-hidden">
            <img src={phase.img} alt={phase.name} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(${phase.rgb},0.75) 0%, transparent 60%)` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-0.5" style={{ color: phase.color }}>{phase.weeks}</span>
                <h3 className="font-bold text-lg md:text-xl text-white leading-tight">{phase.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base px-2.5 py-1 rounded-full bg-black/30 border border-white/10 font-semibold" style={{ color: phase.color }}>{phase.tag}</span>
                <span className="text-white/70 text-lg transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
            </div>
          </div>
          {/* Goal line */}
          <div className="px-5 py-3 flex items-start gap-2 border-b" style={{ borderColor: `rgba(${phase.rgb},0.15)` }}>
            <span className="text-lg">🎯</span>
            <p className="text-base leading-relaxed" style={{ color: phase.color }}>{phase.goal}</p>
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="border border-t-0 rounded-b-2xl overflow-hidden animate-fade-in-up" style={{ borderColor: `rgba(${phase.rgb},0.2)` }}>
            <div className="p-5 space-y-4">
              {/* Pillar grid */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.pillar_section_header', 'Nội Dung Theo Trụ Cột')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(phase.pillars).map(([k,v]) => <PillarRow key={k} id={k} text={v} />)}
                </div>
              </div>
              {/* KPIs */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.kpi_section_header', 'Chỉ Số Mục Tiêu')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {phase.kpis.map((kpi, i) => (
                    <div key={i} className="flex items-start gap-2 text-base text-muted">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: phase.color }} />
                      <span>{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Milestones */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.milestone_header', 'Cột Mốc Giai Đoạn')}</h4>
                <div className="flex flex-wrap gap-2">
                  {phase.milestones.map((m, i) => (
                    <span key={i} className="text-base px-3 py-1.5 rounded-full border font-medium" style={{ color: phase.color, borderColor: `rgba(${phase.rgb},0.3)`, background: `rgba(${phase.rgb},0.08)` }}>
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>
              {/* Note */}
              <div className="text-base text-muted/70 italic p-3 rounded-xl border" style={{ borderColor: `rgba(${phase.rgb},0.15)`, background: `rgba(${phase.rgb},0.04)` }}>
                💬 {phase.note}
              </div>
            </div>
          </div>
        )}
      </div>
    </RevealBlock>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function Program() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const contentRef = useRef(null);
  const initTab = new URLSearchParams(location.search).get('tab') || '7d';
  const [journey, setJourney] = useState(initTab);
  const [activeCard, setActiveCard] = useState(null);
  const [activeChecklistItem, setActiveChecklistItem] = useState(null);
  const [activeJourneyInfo, setActiveJourneyInfo] = useState(null);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) {
      setJourney(tab);
      setExpandedPhase(0);
      setSubTab('phases');
      setTimeout(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [location.search]);
  const [activeDay, setActiveDay] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const [subTab, setSubTab] = useState('phases');
  const [samplePhase, setSamplePhase] = useState(0);
  const [weeklyTab, setWeeklyTab] = useState(0);

  // Translated data — fall back to hardcoded Vietnamese constants if key missing
  const tJourneys = t('program.journeys', { returnObjects: true });
  const localJourneys = Array.isArray(tJourneys) ? tJourneys.map((j, i) => ({ ...JOURNEYS[i], ...j })) : JOURNEYS;
  const tSevenDays = t('program.seven_days', { returnObjects: true });
  const localSevenDays = Array.isArray(tSevenDays) ? tSevenDays.map((d, i) => ({ ...SEVEN_DAYS[i], ...d })) : SEVEN_DAYS;
  const tPillarLabels = t('program.pillar_labels', { returnObjects: true });
  const localPC = (tPillarLabels && typeof tPillarLabels === 'object' && !Array.isArray(tPillarLabels))
    ? Object.fromEntries(Object.entries(PC).map(([k, v]) => [k, { ...v, l: tPillarLabels[k] || v.l }]))
    : PC;
  const tQuickLinks = t('program.quick_links', { returnObjects: true });
  const localQuickLinks = Array.isArray(tQuickLinks) ? tQuickLinks : null;
  const localSubTabs = [
    { id:'phases', label: t('program.sub_tab_phases', 'Lộ Trình'),  icon:'🗓️' },
    { id:'daily',  label: t('program.sub_tab_daily',  'Khung Ngày'), icon:'⏱️' },
    { id:'weekly', label: t('program.sub_tab_weekly', 'Nhịp Tuần'), icon:'📅' },
    { id:'tips',   label: t('program.sub_tab_tips',   'Nguyên Tắc'), icon:'💡' },
    { id:'test',   label: t('program.sub_tab_test',   'Bài Test'),  icon:'📈' },
  ];

  const phases12 = journey === '12w' ? TWELVE_PHASES : TWENTY_FOUR_PHASES;

  useEffect(() => {
    const id = 'pg-hero-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes pgLabelIn {
        from { opacity:0; letter-spacing:0.35em; transform:translateY(-8px); }
        to   { opacity:1; letter-spacing:0.22em; transform:translateY(0); }
      }
      @keyframes pgTitleIn {
        from { opacity:0; transform:translateY(30px) scale(0.96); filter:blur(8px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes pgSubIn {
        from { opacity:0; transform:translateX(-16px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes pgLineGrow {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes pgStatPop {
        from { opacity:0; transform:scale(0.8) translateY(10px); }
        to   { opacity:1; transform:scale(1)   translateY(0); }
      }
      @keyframes pgGlowPulse {
        0%,100% { opacity:0.35; transform:scale(1); }
        50%     { opacity:0.65; transform:scale(1.18); }
      }
      .pg-label    { animation:pgLabelIn 0.55s ease both; }
      .pg-title    { animation:pgTitleIn 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both 0.1s; }
      .pg-sub      { animation:pgSubIn  0.6s ease both 0.3s; }
      .pg-divider  { transform-origin:left; animation:pgLineGrow 0.9s ease both 0.28s; }
      .pg-stat     { animation:pgStatPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
      .pg-stat:nth-child(1){ animation-delay:0.5s; }
      .pg-stat:nth-child(2){ animation-delay:0.62s; }
      .pg-stat:nth-child(3){ animation-delay:0.74s; }
      .pg-stat:nth-child(4){ animation-delay:0.86s; }
      .pg-glow { animation:pgGlowPulse 7s ease-in-out infinite; }
      .pg-glow2{ animation:pgGlowPulse 10s ease-in-out infinite reverse; animation-delay:-3s; }
    `;
    document.head.appendChild(s);
  }, []);

  const heroStats = [
    { l:'12', s:'tuần', tip:'Chương trình 12 tuần: Khởi Động (1–4) → Xây Nền (5–8) → Cá Nhân Hóa (9–12). Đủ thời gian thay đổi thói quen não bộ.' },
    { l:'3',  s:'giai đoạn', tip:'3 giai đoạn thích nghi dần: G1 học kỹ thuật + xây thói quen, G2 tăng volume + sức bền, G3 cá nhân hóa mục tiêu.' },
    { l:'6',  s:'trụ cột', tip:'Phối hợp 6 trụ cột đồng thời: Vận động · Dinh dưỡng · Lối sống · Tâm trí · Kiến thức · Công cụ.' },
    { l:'20+',s:'phút/ngày', tip:'20 phút mỗi ngày là ngưỡng tối thiểu để tạo thay đổi. Cấu trúc 4 khối (Khởi → Chính → Giãn → Tĩnh) tối ưu mọi thời lượng.' },
  ];

  return (
  <>
    <div className="max-w-4xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative -mx-4 md:-mx-8 mb-10 overflow-hidden rounded-b-3xl" style={{ minHeight: 300 }}>
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=65" alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/55 to-bg pointer-events-none" />
        <div className="absolute inset-0 grid-dots opacity-20 pointer-events-none" />
        {/* Ambient glow blobs */}
        <div className="pg-glow  absolute top-1/4 left-1/5  w-[480px] h-[380px] bg-accent/6   rounded-full blur-[110px] pointer-events-none" />
        <div className="pg-glow2 absolute top-0   right-1/5 w-[320px] h-[280px] bg-purple-500/4 rounded-full blur-[90px]  pointer-events-none" />

        <div className="relative z-10 px-4 md:px-8 pt-16 pb-14 flex flex-col items-center text-center">

          {/* Decorative trio — mirrors the 3 journey colors */}
          <div className="pg-label flex items-center gap-2.5 mb-7">
            {[['#22c55e','34,197,94'],['#5eead4','94,234,212'],['#a855f7','168,85,247']].map(([c,r],i) => (
              <span key={i}
                className="rounded-full"
                style={{ width: 6+i*3, height: 6+i*3, background:`radial-gradient(circle, rgba(${r},0.9), rgba(${r},0.4))`, boxShadow:`0 0 8px rgba(${r},0.6)` }}
              />
            ))}
            <div className="h-px w-12 rounded-full mx-1" style={{ background:'linear-gradient(90deg,rgba(94,234,212,0.4),rgba(168,85,247,0.4))' }} />
            {[['#a855f7','168,85,247'],['#5eead4','94,234,212'],['#22c55e','34,197,94']].map(([c,r],i) => (
              <span key={i}
                className="rounded-full"
                style={{ width: 12-i*3, height: 12-i*3, background:`radial-gradient(circle, rgba(${r},0.9), rgba(${r},0.4))`, boxShadow:`0 0 8px rgba(${r},0.6)` }}
              />
            ))}
          </div>

          {/* Title */}
          <h1 className="pg-title font-black leading-[1.05] tracking-tight mb-6" style={{ fontSize:'clamp(2.8rem,6vw,4.5rem)' }}>
            <span style={{
              background:'linear-gradient(135deg, #f0fdf4 0%, #ffffff 30%, #86efac 60%, #5eead4 85%, #c4b5fd 100%)',
              WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              {t('program.hero_title')}
            </span>
          </h1>

          {/* Gradient underline */}
          <div className="pg-divider mb-7 h-[2.5px] w-28 rounded-full"
            style={{ background:'linear-gradient(90deg,#22c55e,#5eead4,#a855f7)' }} />

          {/* Subtitle */}
          <p className="pg-sub text-muted/75 text-lg md:text-lg leading-relaxed max-w-[440px] mb-4">
            {t('program.hero_sub')}
          </p>
          <div className="pg-sub flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
            {[['🌱', t('program.j7d'), '#22c55e'],['📈', t('program.j12w'), '#84cc16'],['🎓', t('program.j24w'), '#a855f7']].map(([icon,label,color]) => (
              <span key={label} className="flex items-center gap-1.5 text-base font-semibold" style={{ color }}>
                <span>{icon}</span>{label}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* ── Journey Mode Selector ─────────────────────────────── */}
      <RevealBlock className="mb-10">
        <h2 className="text-base font-bold uppercase tracking-widest text-muted mb-4 text-center">{t('program.choose')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localJourneys.map(j => {
            const active = journey === j.id;
            return (
              <button
                key={j.id}
                onClick={() => { setJourney(j.id); setExpandedPhase(0); setSubTab('phases'); }}
                className="relative text-left rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{ borderColor: active ? `rgba(${j.rgb},0.55)` : 'rgba(255,255,255,0.06)', background: active ? `rgba(${j.rgb},0.07)` : 'rgba(255,255,255,0.02)' }}
              >
                {active && <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at top left, rgba(${j.rgb},0.25), transparent 70%)` }} />}
                <div className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-4xl">{j.icon}</span>
                    {active && <div className="w-2 h-2 rounded-full mt-1" style={{ background: j.color }} />}
                  </div>
                  <div className="font-bold text-lg text-text leading-tight mb-0.5">{j.label}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: j.color }}>{j.sub}</div>
                  <p className="text-base text-muted leading-relaxed mb-3">{j.desc}</p>
                  {j.details && (
                    <span
                      onClick={e => { e.stopPropagation(); setActiveJourneyInfo(j); }}
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ color: j.color, background: `rgba(${j.rgb},0.1)`, border: `1px solid rgba(${j.rgb},0.22)` }}
                    >
                      Chi tiết
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <path d="M3 8h10M9 4l4 4-4 4"/>
                      </svg>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </RevealBlock>

      {/* scroll anchor for deep-link navigation */}
      <div ref={contentRef} className="scroll-mt-20" />

      {/* ─────────────────────────────────────────────────────────
          ── 7-DAY JOURNEY ─────────────────────────────────────
          ───────────────────────────────────────────────────── */}
      {journey === '7d' && (
        <div key="7d">
          {/* Day picker */}
          <RevealBlock className="mb-6">
            <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="flex gap-2 pb-1" style={{ width:'max-content', minWidth:'100%' }}>
                {localSevenDays.map((d, i) => {
                  const active = activeDay === i;
                  return (
                    <button key={d.n} onClick={() => setActiveDay(i)}
                      className="flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer shrink-0"
                      style={{ borderColor: active ? `rgba(${d.rgb},0.5)` : 'rgba(255,255,255,0.07)', background: active ? `rgba(${d.rgb},0.1)` : 'transparent', minWidth: 64 }}
                    >
                      <span className="text-2xl">{d.emoji}</span>
                      <span className="text-[10px] font-bold" style={{ color: active ? d.color : undefined }}>{t('program.day_prefix', 'N')}{d.n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </RevealBlock>

          {/* Day content */}
          {(() => {
            const day = localSevenDays[activeDay];
            return (
              <div key={activeDay} className="animate-fade-in-up">
                {/* Day header */}
                <RevealBlock className="mb-6">
                  <div className="relative rounded-3xl overflow-hidden h-44 md:h-56">
                    <img src={day.img} alt={day.theme} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80" style={{ color: day.color }}>{t('program.day_of_7_label', { n: day.n, defaultValue: `Ngày ${day.n} của 7` })}</div>
                        <h2 className="font-bold text-2xl md:text-3xl text-text leading-tight">{day.theme}</h2>
                      </div>
                      <span className="text-base px-3 py-1.5 rounded-full bg-bg/60 border font-bold" style={{ color: day.color, borderColor: `rgba(${day.rgb},0.3)` }}>{day.tag}</span>
                    </div>
                  </div>
                </RevealBlock>

                {/* 4-pillar cards */}
                <RevealBlock delay={80} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {(['A','B','C','D']).map(pid => {
                    const p = localPC[pid];
                    const info = day[pid];
                    return (
                      <div
                        key={pid}
                        onClick={() => setActiveCard({ pid, info, p })}
                        className="rounded-2xl p-4 border cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: p.bg, borderColor: p.br }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{p.icon}</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p.c }}>{p.l}</span>
                          <div className="ml-auto flex items-center gap-1.5">
                            {(info.time || info.kcal) && (
                              <span className="text-[10px] text-muted/60 font-medium">{info.time || info.kcal}</span>
                            )}
                            <span
                              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity"
                              style={{ color: p.c, background: `rgba(${p.br.match(/rgba\((\d+,\d+,\d+)/)?.[1]||'255,255,255'},0.1)`, border: `1px solid ${p.br}` }}
                            >
                              Chi tiết
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                                <path d="M3 8h10M9 4l4 4-4 4"/>
                              </svg>
                            </span>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-text mb-1 leading-snug">{info.title}</h3>
                        <p className="text-base text-muted mb-2 leading-relaxed">{info.detail}</p>
                        <p className="text-[11px] italic text-muted/60 leading-relaxed border-t pt-2" style={{ borderColor: p.br }}>💬 {info.note}</p>
                      </div>
                    );
                  })}
                </RevealBlock>

                {/* Daily checklist */}
                <RevealBlock delay={160} className="rounded-2xl border p-5 mb-6" style={{ borderColor: `rgba(${day.rgb},0.25)`, background: `rgba(${day.rgb},0.04)` }}>
                  <h3 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: day.color }}>✅ {t('program.checklist_day_label', { n: day.n, defaultValue: `Checklist Ngày ${day.n}` })}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {day.checklist.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveChecklistItem({ item, dayColor: day.color, dayRgb: day.rgb })}
                        className="flex items-center justify-between gap-2 cursor-pointer rounded-xl px-3 py-2 transition-all duration-150 hover:bg-white/5 group/cl"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${day.rgb},0.2)`}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center" style={{ borderColor: `rgba(${day.rgb},0.4)` }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: day.color }} />
                          </span>
                          <span className="text-base text-muted leading-relaxed truncate">{typeof item === 'object' ? item.label : item}</span>
                        </div>
                        {typeof item === 'object' && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 opacity-50 group-hover/cl:opacity-100 transition-opacity"
                            style={{ color: day.color, background: `rgba(${day.rgb},0.1)`, border: `1px solid rgba(${day.rgb},0.2)` }}
                          >
                            Chi tiết
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                              <path d="M3 8h10M9 4l4 4-4 4"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </RevealBlock>

                {/* Day navigation */}
                <div className="flex items-center justify-between mb-10">
                  <button onClick={() => setActiveDay(d => Math.max(0,d-1))} disabled={activeDay===0}
                    className="flex items-center gap-2 text-base font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border">
                    {t('program.prev_day', '← Ngày trước')}
                  </button>
                  <div className="flex gap-1">
                    {localSevenDays.map((_,i) => (
                      <button key={i} onClick={() => setActiveDay(i)}
                        className="rounded-full transition-all duration-300"
                        style={{ width: activeDay===i?16:6, height:6, background: activeDay===i ? localSevenDays[activeDay].color : 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                  <button onClick={() => setActiveDay(d => Math.min(6,d+1))} disabled={activeDay===6}
                    className="flex items-center gap-2 text-base font-medium text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border">
                    {t('program.next_day', 'Ngày tiếp →')}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* 7-day philosophy note */}
          <RevealBlock className="rounded-2xl border border-accent/15 p-5 bg-accent/4 mb-8">
            <p className="text-base text-muted leading-relaxed text-center">
              💡 <strong className="text-text">{t('program.philosophy_7d_strong', '7 ngày này là nền tảng')}</strong> {t('program.philosophy_7d_body', '— không phải để "thay đổi cơ thể" mà để')}
              <strong className="text-accent"> {t('program.philosophy_7d_habit', 'hình thành 4 thói quen đầu tiên')}</strong>.
              {' '}{t('program.philosophy_7d_suffix', 'Hoàn thành 7 ngày → bắt đầu')} <button onClick={() => setJourney('12w')} className="text-lime-400 underline cursor-pointer hover:no-underline">{t('program.link_12w_text', '12 tuần cơ bản')}</button>.
            </p>
          </RevealBlock>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          ── 12-WEEK / 24-WEEK JOURNEY ─────────────────────────
          ───────────────────────────────────────────────────── */}
      {(journey === '12w' || journey === '24w') && (
        <div key={journey}>
          {/* Sub-tab strip */}
          <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-md border-b border-border/60 -mx-4 md:-mx-8 px-4 md:px-8 mb-8">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex" style={{ width:'max-content', minWidth:'100%' }}>
                {localSubTabs.map(tab => {
                  const active = subTab === tab.id;
                  const jColor = journey === '12w' ? '#84cc16' : '#a855f7';
                  return (
                    <button key={tab.id} onClick={() => setSubTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 md:px-5 py-4 text-lg font-semibold whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer ${
                        active ? 'border-current' : 'text-muted border-transparent hover:text-text hover:border-border'
                      }`}
                      style={active ? { color: jColor } : {}}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div key={subTab} className="animate-fade-in-up min-h-[400px]">

            {/* ── Phases tab ───────────────── */}
            {subTab === 'phases' && (
              <div>
                <RevealBlock className="mb-6 text-center">
                  <p className="text-lg text-muted">
                    {journey === '12w' ? t('program.phases_intro_12w') : t('program.phases_intro_24w')}
                  </p>
                </RevealBlock>
                <div className="relative">
                  <div className="absolute left-6 top-6 bottom-6 w-px" style={{ background: journey==='12w' ? 'linear-gradient(to bottom, #22c55e, #84cc16, #a855f7)' : 'linear-gradient(to bottom, #22c55e, #84cc16, #a855f7, #f97316, #3b82f6, #a855f7)' }} />
                  {phases12.map((phase,i) => (
                    <PhaseCard key={phase.id} phase={phase} idx={i} expanded={expandedPhase===i} onToggle={() => setExpandedPhase(expandedPhase===i ? -1 : i)} />
                  ))}
                </div>

                {journey === '12w' && (
                  <RevealBlock className="mt-6 p-4 rounded-2xl border border-purple-500/15 bg-purple-500/4 text-center">
                    <p className="text-base text-muted">
                      {t('program.upgrade_to_24w_cta', 'Muốn tiến xa hơn sau 12 tuần? →')}{' '}
                      <button onClick={() => setJourney('24w')} className="text-purple-400 underline hover:no-underline cursor-pointer">{t('program.see_24w_btn', 'Xem lộ trình 24 tuần nâng cao')}</button>
                    </p>
                  </RevealBlock>
                )}
              </div>
            )}

            {/* ── Daily framework tab ──────── */}
            {subTab === 'daily' && (
              <div>
                <div className="flex h-2.5 rounded-full overflow-hidden mb-8 bg-border/30">
                  {[{f:1,c:'bg-green-500/60'},{f:3,c:'bg-accent/60'},{f:2,c:'bg-teal-500/60'},{f:1,c:'bg-purple-500/60'}].map((seg,i) => (
                    <div key={i} className={`${seg.c} hover:brightness-125 transition-all duration-300`} style={{flex:seg.f}} />
                  ))}
                </div>
                <div className="relative">
                  <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 pointer-events-none" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {DAILY_BLOCKS.map((block,i) => (
                      <RevealBlock key={i} delay={i*80} className="relative bg-surface border border-border rounded-2xl p-5 text-center hover:border-accent/30 hover:shadow-[0_0_24px_rgba(34,197,94,0.07)] transition-all duration-300 group">
                        <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/30">{String(i+1).padStart(2,'0')}</span>
                        <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: block.color }}>{block.time}</p>
                        <h3 className="font-bold text-lg text-text mb-1.5">{block.name}</h3>
                        <p className="text-base text-muted leading-relaxed">{block.desc}</p>
                        {i < 3 && <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border text-xl z-10">›</span>}
                      </RevealBlock>
                    ))}
                  </div>
                </div>
                <RevealBlock delay={320} className="mt-8 p-5 rounded-2xl border border-accent/15 bg-accent/4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-accent mb-3">💡 {t('program.daily_principles_title', 'Nguyên Tắc Khung Ngày')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-muted">
                    {(() => {
                      const principles = t('program.daily_principles', { returnObjects: true });
                      const pArr = Array.isArray(principles) ? principles : [
                        "Không bỏ 5' khởi động — giảm 70% nguy cơ chấn thương",
                        "Mind Reset có thể thay bằng 5' đi bộ im lặng",
                        "Nếu chỉ có 20 phút: 5' khởi động + 10' chính + 5' giãn",
                        "Nếu có 40 phút: thêm Giãn cơ và Mind Reset đầy đủ"
                      ];
                      return pArr.map((p, i) => <p key={i}>• {p}</p>);
                    })()}
                  </div>
                </RevealBlock>
              </div>
            )}

            {/* ── Weekly rhythm tab ────────── */}
            {subTab === 'weekly' && (() => {
              const day   = WEEKLY_RHYTHM[weeklyTab];
              const meta  = TAB_META[weeklyTab];
              const panel = WEEKLY_PANEL[weeklyTab];
              return (
                <div>
                  {/* ── Browser-tab row ── */}
                  <div className="relative mb-0">
                    {/* tab bar track */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0 relative z-10" style={{ borderBottom: `2px solid rgba(${meta.rgb},0.22)` }}>
                      {WEEKLY_RHYTHM.map((d, i) => {
                        const m = TAB_META[i];
                        const active = weeklyTab === i;
                        return (
                          <button
                            key={i}
                            onClick={() => setWeeklyTab(i)}
                            className="relative flex items-center gap-2 px-4 py-3 rounded-t-xl shrink-0 cursor-pointer transition-all duration-250 group"
                            style={{
                              background: active ? `rgba(${m.rgb},0.10)` : 'transparent',
                              borderTop:    active ? `2px solid ${m.c}` : '2px solid transparent',
                              borderLeft:   active ? `1px solid rgba(${m.rgb},0.22)` : '1px solid transparent',
                              borderRight:  active ? `1px solid rgba(${m.rgb},0.22)` : '1px solid transparent',
                              borderBottom: active ? `2px solid rgba(${m.rgb},0.10)` : 'none',
                              marginBottom: active ? '-2px' : '0',
                            }}
                          >
                            {/* colored favicon dot */}
                            <span
                              className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
                              style={{ background: active ? m.c : `rgba(${m.rgb},0.4)`, boxShadow: active ? `0 0 6px ${m.c}` : 'none' }}
                            />
                            <span className="text-lg leading-none">{m.icon}</span>
                            <span className={`text-base font-semibold whitespace-nowrap transition-colors duration-200 ${active ? 'text-text' : 'text-muted group-hover:text-text/80'}`}>
                              {d.type}
                            </span>
                            <span
                              className="hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ color: m.c, background: `rgba(${m.rgb},0.12)` }}
                            >
                              {d.days}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Content panel ── */}
                  <div
                    key={weeklyTab}
                    className="rounded-b-2xl rounded-tr-2xl border-x border-b overflow-hidden animate-fade-in-up"
                    style={{ borderColor: `rgba(${meta.rgb},0.22)`, background: `rgba(${meta.rgb},0.03)` }}
                  >
                    {/* Hero image strip */}
                    <div className="relative h-36 md:h-48 overflow-hidden">
                      <img src={panel.img} alt={day.type} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(${meta.rgb},0.5) 0%, transparent 55%)` }} />
                      <div className="absolute bottom-0 left-0 p-5">
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: meta.c }}>{day.days}</div>
                        <h3 className="font-black text-2xl md:text-3xl text-white leading-tight">{day.type}</h3>
                        <p className="text-base text-white/70 mt-0.5">{day.desc}</p>
                      </div>
                      {/* Stats badges */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {[
                          { l:'Thời lượng', v: panel.duration },
                          { l:'Cường độ',   v: panel.intensity },
                          { l:'Tần suất',   v: panel.sessions },
                        ].map((s,i) => (
                          <div key={i} className="hidden sm:flex flex-col items-center px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-sm">
                            <span className="text-[10px] text-white/50 uppercase tracking-wider">{s.l}</span>
                            <span className="text-base font-bold text-white leading-tight">{s.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Exercises */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: meta.c }}>
                          Bài Tập / Hoạt Động
                        </h4>
                        <ul className="space-y-2">
                          {panel.moves.map((m, i) => (
                            <li key={i} className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 hover:bg-white/3 group/move">
                              <span
                                className="mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                                style={{ background: `rgba(${meta.rgb},0.7)` }}
                              >
                                {i + 1}
                              </span>
                              <span className="text-base text-muted group-hover/move:text-text transition-colors duration-150">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: meta.c }}>
                          Nguyên Tắc Thực Hiện
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {panel.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-base text-muted">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.c }} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                        {/* Avoid note */}
                        <div
                          className="p-3 rounded-xl border text-base"
                          style={{ borderColor: `rgba(${meta.rgb},0.2)`, background: `rgba(${meta.rgb},0.06)`, color: meta.c }}
                        >
                          ⚠️ <span className="text-muted">{panel.avoid}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile stats row */}
                    <div className="sm:hidden grid grid-cols-3 gap-2 px-5 pb-5">
                      {[
                        { l:'Thời lượng', v: panel.duration },
                        { l:'Cường độ',   v: panel.intensity },
                        { l:'Tần suất',   v: panel.sessions },
                      ].map((s,i) => (
                        <div key={i} className="text-center p-2 rounded-xl border" style={{ borderColor:`rgba(${meta.rgb},0.18)`, background:`rgba(${meta.rgb},0.05)` }}>
                          <div className="text-[10px] text-muted uppercase tracking-wide">{s.l}</div>
                          <div className="font-bold text-text text-base mt-0.5">{s.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Adjust schedule tip */}
                  <RevealBlock delay={200} className="p-4 rounded-2xl border border-blue-500/15 bg-blue-500/4 mt-4">
                    <h3 className="text-base font-bold uppercase tracking-widest text-blue-400 mb-3">📌 {t('program.adjust_schedule_title', 'Điều Chỉnh Cho Lịch Của Bạn')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base text-muted">
                      {(() => {
                        const tips = t('program.adjust_tips', { returnObjects: true });
                        const tArr = Array.isArray(tips) ? tips : [
                          'Siêu bận: T2/T4/CN — 3 buổi/tuần là đủ ổn định',
                          'Shift làm việc: linh hoạt ngày, giữ đủ 3–4 buổi/tuần',
                          'Mới bắt đầu: 3 buổi/tuần, mỗi buổi 20–25 phút',
                          'Cardio nhẹ: đi bộ đến nơi làm = tích hợp NEAT tự nhiên',
                        ];
                        return tArr.map((tip, i) => <p key={i}>• {tip}</p>);
                      })()}
                    </div>
                  </RevealBlock>
                </div>
              );
            })()}

            {/* ── Success tips tab ─────────── */}
            {subTab === 'tips' && (
              <div className="relative overflow-hidden rounded-3xl border border-accent/15">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-teal-500/4 pointer-events-none" />
                <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
                <div className="relative p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {SUCCESS_TIPS.map((tip,i) => (
                      <RevealBlock key={i} delay={i*60} className="flex items-start gap-3 group">
                        <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">{tip.icon}</span>
                        <div>
                          <h3 className="font-bold text-text text-lg mb-1 group-hover:text-accent transition-colors duration-200">{tip.title}</h3>
                          <p className="text-base text-muted leading-relaxed">{tip.desc}</p>
                        </div>
                      </RevealBlock>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Progress test tab ────────── */}
            {subTab === 'test' && (
              <div>
                <RevealBlock className="text-base text-muted mb-5 p-4 rounded-xl border border-purple-500/15 bg-purple-500/4">
                  <strong className="text-purple-400">📋 {t('program.test_guide', 'Test buổi sáng sau khi thức dậy, trước khi ăn. Ghi kết quả và so sánh qua các mốc để theo dõi tiến bộ thực sự.')}</strong>
                </RevealBlock>
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-purple-500/60 via-purple-500/20 to-transparent" />
                  <div className="overflow-x-auto">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left text-base font-bold text-muted uppercase tracking-wider px-5 py-3">{t('program.test_metric_col', 'Chỉ Số')}</th>
                          <th className="text-left text-base font-bold text-muted uppercase tracking-wider px-5 py-3">{t('program.test_method_col', 'Bài Test')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_baseline_col', 'Baseline')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week4_col', 'Tuần 4')}</th>
                          <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week12_col', 'Tuần 12')}</th>
                          {journey === '24w' && <th className="text-center text-base font-bold text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">{t('program.test_week24_col', 'Tuần 24')}</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {PROGRESS_ROWS.map((row,i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-purple-500/3 transition-colors duration-150 last:border-0">
                            <td className="px-5 py-3 font-semibold text-text text-lg">{row.metric}</td>
                            <td className="px-5 py-3 text-muted text-base leading-relaxed">{row.test}</td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-teal-400 bg-teal-500/8 border border-teal-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-purple-400 bg-purple-500/8 border border-purple-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>
                            {journey === '24w' && <td className="px-4 py-3 text-center"><span className="inline-block text-base font-semibold text-orange-400 bg-orange-500/8 border border-orange-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">___ {row.unit}</span></td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <RevealBlock delay={200} className="mt-4 p-4 rounded-2xl border border-accent/15 bg-accent/4">
                  <p className="text-base text-muted">
                    🛠️ {t('program.test_tool_note', 'Dùng Công cụ Bài Test Tiến Bộ để lưu kết quả và so sánh qua các mốc tự động.')}
                  </p>
                </RevealBlock>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Sample Roadmap ───────────────────────────────────── */}
      {journey === 'sample' && (
        <div key="sample" className="animate-fade-in-up">

          {/* Profile card */}
          <RevealBlock className="mb-8">
            <div className="relative rounded-3xl overflow-hidden border border-sky-500/25 bg-sky-500/5">
              <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-56 h-56 bg-sky-500/8 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/12 border border-sky-500/25 flex items-center justify-center text-3xl shrink-0">👨‍💼</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-1">Hồ Sơ Người Dùng Mẫu</div>
                    <h2 className="text-xl md:text-2xl font-bold text-text mb-1">Anh Tuấn — 32 tuổi, Nhân viên văn phòng</h2>
                    <p className="text-base text-muted">TP.HCM · Ngồi nhiều 8h/ngày · Ít tập luyện 2 năm gần đây · Hay mệt · Mục tiêu: giảm 5kg + tăng năng lượng trong 12 tuần</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon:'⚖️', val:'78 kg',   sub:'Cân nặng ban đầu' },
                    { icon:'📏', val:'172 cm',   sub:'Chiều cao' },
                    { icon:'🔥', val:'2,080 kcal',sub:'TDEE ước tính' },
                    { icon:'🎯', val:'73 kg',    sub:'Mục tiêu 12 tuần' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl border border-sky-500/15 bg-sky-500/5 p-3 text-center">
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="font-bold text-text text-base">{s.val}</div>
                      <div className="text-[10px] text-muted mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* Phases timeline */}
          <RevealBlock className="mb-8">
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0ea5e9' }}>Lộ Trình 12 Tuần Thực Tế</h2>
            <p className="text-base text-muted mb-6">Click từng giai đoạn để xem chi tiết từng tuần của anh Tuấn</p>
            <div className="space-y-4">
              {[
                {
                  phase:'PHASE 1', weeks:'Tuần 1–4', name:'Khởi Động Từ Số 0', emoji:'🌱',
                  color:'#22c55e', rgb:'34,197,94',
                  goal:'Hình thành 3 thói quen không thể thiếu: tập 3×/tuần, ăn đủ đạm, ngủ trước 23h',
                  detail:[
                    { w:1, focus:'Học 6 động tác cơ bản',        kcal:'1,680 kcal', sleep:'23:00', steps:'6,500',  note:'Tuần 1 mục tiêu duy nhất: đến phòng tập. Không quan tâm số lần hay cân nặng.' },
                    { w:2, focus:'Lặp lại · thêm 1 set',          kcal:'1,700 kcal', sleep:'22:45', steps:'7,000',  note:'Não học qua lặp lại. Tuấn bắt đầu nhớ tên các bài tập.' },
                    { w:3, focus:"Thêm đi bộ 20' sau cơm trưa",  kcal:'1,720 kcal', sleep:'22:30', steps:'7,800',  note:'Phát hiện ra đi bộ sau ăn giúp giảm buồn ngủ 2h chiều — thắng lớn!' },
                    { w:4, focus:"Test baseline · tập 4×/tuần",   kcal:'1,690 kcal', sleep:'22:30', steps:'8,000',  note:'Test tuần 4: 8 push-up, 18 squat/phút, cân 77.2kg (−0.8kg).' },
                  ],
                },
                {
                  phase:'PHASE 2', weeks:'Tuần 5–8', name:'Xây Nền Vững Chắc', emoji:'📈',
                  color:'#84cc16', rgb:'132,204,22',
                  goal:'Tăng khối lượng tập, tính TDEE, bắt đầu theo dõi macro — cụ thể và đo lường được',
                  detail:[
                    { w:5, focus:'Tăng 1 set/bài · Tính TDEE B0',  kcal:'1,750 kcal', sleep:'22:15', steps:'8,500',  note:'B0 cho TDEE 2,080 kcal, target 1,680 kcal (deficit 400). Tuấn bắt đầu tracking.' },
                    { w:6, focus:'Meal prep chủ nhật 45 phút',      kcal:'1,710 kcal', sleep:'22:20', steps:'9,000',  note:'Meal prep thay đổi hoàn toàn: không còn bữa nhậu ngẫu hứng trưa. Cân 75.8kg.' },
                    { w:7, focus:'Thêm cardio T3+T5',               kcal:'1,730 kcal', sleep:'22:10', steps:'9,200',  note:'Cardio: đạp xe tĩnh 25 phút. Nhịp tim lúc nghỉ xuống 72 bpm (trước: 78).' },
                    { w:8, focus:'Test tiến bộ tuần 8',             kcal:'1,720 kcal', sleep:'22:15', steps:'9,500',  note:'Test tuần 8: 16 push-up (+8), 27 squat/phút (+9), cân 74.9kg.' },
                  ],
                },
                {
                  phase:'PHASE 3', weeks:'Tuần 9–12', name:'Cá Nhân Hóa & Làm Chủ', emoji:'🎯',
                  color:'#a855f7', rgb:'168,85,247',
                  goal:'Chọn hướng rõ ràng (giảm mỡ + sức mạnh), tối ưu bằng dữ liệu 8 tuần',
                  detail:[
                    { w:9,  focus:'Carb cycling cơ bản',             kcal:'1,680–1,900', sleep:'22:00', steps:'10,000', note:'Ngày tập nặng: 1,900 kcal. Ngày nghỉ: 1,680 kcal. Năng lượng ổn định hơn hẳn.' },
                    { w:10, focus:"Thiền 5' · Journaling nâng cao",  kcal:'1,720 kcal',  sleep:'22:00', steps:'10,000', note:'Thiền 5 phút sáng. Tuấn nhận ra căng thẳng giảm 30% dù công việc không đổi.' },
                    { w:11, focus:'Tự lên kế hoạch tuần',            kcal:'1,700 kcal',  sleep:'22:00', steps:'10,500', note:'Lần đầu tự thiết kế lịch tập không cần app. Cân 73.5kg — gần mục tiêu!' },
                    { w:12, focus:'Test cuối · Lộ trình 12 tuần tiếp', kcal:'1,720 kcal', sleep:'22:00', steps:'10,000', note:'KẾT QUẢ: 22 push-up, 35 squat/phút, cân 73.1kg (−4.9kg), nhịp tim 68 bpm. ✅ Đạt mục tiêu!' },
                  ],
                },
              ].map((ph, pi) => {
                const active = samplePhase === pi;
                return (
                  <div key={pi}>
                    <button
                      onClick={() => setSamplePhase(active ? -1 : pi)}
                      className="w-full text-left rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
                      style={{ borderColor: `rgba(${ph.rgb},0.3)`, background: `rgba(${ph.rgb},0.04)` }}
                    >
                      <div className="px-5 py-4 flex items-center gap-4">
                        <span className="text-2xl">{ph.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: ph.color }}>{ph.phase} · {ph.weeks}</div>
                          <div className="font-bold text-text text-base leading-tight">{ph.name}</div>
                          <p className="text-base text-muted leading-relaxed mt-0.5">{ph.goal}</p>
                        </div>
                        <span className="text-muted text-lg transition-transform duration-300 shrink-0" style={{ transform: active ? 'rotate(180deg)' : 'none' }}>▾</span>
                      </div>
                    </button>
                    {active && (
                      <div className="border border-t-0 rounded-b-2xl overflow-hidden animate-fade-in-up" style={{ borderColor: `rgba(${ph.rgb},0.2)` }}>
                        <div className="divide-y" style={{ '--dv': `rgba(${ph.rgb},0.12)` }}>
                          {ph.detail.map((row) => (
                            <div key={row.w} className="px-5 py-4 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-5 gap-y-1">
                              <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:justify-center sm:w-14">
                                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full shrink-0" style={{ color: ph.color, background: `rgba(${ph.rgb},0.1)` }}>T{row.w}</span>
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-text text-base mb-1">{row.focus}</div>
                                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted mb-1.5">
                                  <span>🔥 {row.kcal}</span>
                                  <span>😴 Ngủ {row.sleep}</span>
                                  <span>👟 {row.steps} bước</span>
                                </div>
                                <p className="text-base text-muted/80 italic leading-relaxed">💬 {row.note}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </RevealBlock>

          {/* Key lessons */}
          <RevealBlock className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#0ea5e9' }}>Bài Học Từ Lộ Trình Của Tuấn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon:'🎯', title:'Mục tiêu cụ thể thắng mọi động lực',      desc:'"-5kg trong 12 tuần" cho phép tính ngược ra deficit 400 kcal/ngày. Mơ hồ = thất bại.' },
                { icon:'🍱', title:'Meal prep = 60% thành công',               desc:'Tuần nào Tuấn meal prep, tuần đó không lệch quá 100 kcal. Tuần nào không, sai tới 400 kcal.' },
                { icon:'😴', title:'Ngủ quyết định cân nặng, không chỉ bài tập',desc:'2 tuần ngủ trước 22h: giảm 1.2kg. 2 tuần ngủ kém: chỉ giảm 0.3kg dù tập đều.' },
                { icon:'📊', title:'Số liệu là gương soi trung thực',          desc:'Không có tracking, Tuấn nghĩ mình "ăn ít rồi". Tracking cho thấy thực tế hơn 300 kcal.' },
              ].map((l, i) => (
                <RevealBlock key={i} delay={i * 60} className="rounded-2xl border border-sky-500/15 bg-sky-500/4 p-4">
                  <div className="text-xl mb-2">{l.icon}</div>
                  <div className="font-bold text-text text-base mb-1">{l.title}</div>
                  <p className="text-base text-muted leading-relaxed">{l.desc}</p>
                </RevealBlock>
              ))}
            </div>
          </RevealBlock>

          {/* CTA */}
          <RevealBlock className="mb-8">
            <div className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-5 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <div className="font-bold text-text text-base mb-1">Bắt đầu lộ trình của bạn ngay hôm nay</div>
                <p className="text-base text-muted">Chọn 7 Ngày Khởi Động nếu bạn mới bắt đầu, hoặc 12 Tuần Cơ Bản nếu đã sẵn sàng.</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setJourney('7d'); setExpandedPhase(0); setSubTab('phases'); }}
                  className="px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-base font-bold hover:bg-green-500/20 transition-all duration-200">
                  🌱 7 Ngày
                </button>
                <button onClick={() => { setJourney('12w'); setExpandedPhase(0); setSubTab('phases'); }}
                  className="px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/25 text-accent text-base font-bold hover:bg-accent/20 transition-all duration-200">
                  📈 12 Tuần
                </button>
              </div>
            </div>
          </RevealBlock>

        </div>
      )}

      {/* ── Cross-pillar quick links ───────────────────────────── */}
      <RevealBlock className="mt-12">
        <div className="border-t border-border/50 pt-10 mb-6">
          <h2 className="text-base font-bold uppercase tracking-widest text-muted mb-4 text-center">{t('program.deep_dive_title', 'Đi Sâu Vào Từng Trụ Cột')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { to:'/pillar/a',          icon:'🏃', color:'#22c55e' },
              { to:'/pillar/b/roadmap',  icon:'🥗', color:'#84cc16' },
              { to:'/pillar/b/7day',     icon:'📅', color:'#84cc16' },
              { to:'/pillar/c/roadmap',  icon:'🌿', color:'#14b8a6' },
              { to:'/pillar/d/roadmap',  icon:'🧘', color:'#a855f7' },
              { to:'/pillar/f/roadmap',  icon:'🛠️', color:'#f97316' },
            ].map((link, idx) => {
              const ql = localQuickLinks?.[idx];
              const label = ql?.label || ['Vận Động & Tập Luyện','Lộ Trình Dinh Dưỡng','Thực Đơn 7 Ngày','Lối Sống 12 Tuần','Tâm Trí 12 Tuần','Lộ Trình Công Cụ'][idx];
              const sub = ql?.sub || ['6 mẫu · Khung ngày · Lộ trình','12 tuần · Macro · Meal prep','Bữa ăn theo ngày · Shopping list','Ngủ · NEAT · Nhịp sinh học','Thiền · Thở · Journaling','Checklist · Tracker · Test'][idx];
              return (
                <Link key={link.to} to={link.to}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-surface hover:border-[var(--lc)] hover:-translate-y-0.5 transition-all duration-200 group"
                  style={{ '--lc': `rgba(${link.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')},0.35)` }}
                >
                  <span className="text-2xl shrink-0">{link.icon}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-text text-base leading-snug">{label}</div>
                    <div className="text-[10px] text-muted mt-0.5 leading-relaxed">{sub}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </RevealBlock>

      {/* ── Sample programs CTA ───────────────────────────────── */}
      <RevealBlock className="relative overflow-hidden rounded-3xl border border-pink-500/20 bg-pink-500/4 mb-6 group hover:border-pink-500/35 transition-all duration-300">
        <div className="absolute inset-0 grid-dots opacity-15 pointer-events-none" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/6 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-3xl shrink-0">🗂️</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-text mb-1">{t('program.sample_programs_banner_title', 'Lộ Trình Mẫu Theo Mục Tiêu')}</h3>
            <p className="text-base text-muted leading-relaxed">
              {t('program.sample_programs_banner_desc', '6 mục tiêu × 24 tuần — Chọn lộ trình phù hợp: Người mới · Siêu bận · Giảm mỡ · Tăng cơ · Sức bền · Nâng cao.')}
            </p>
          </div>
          <Link to="/sample-programs"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/25 text-pink-400 text-base font-bold hover:bg-pink-500/20 transition-all duration-200">
            {t('program.sample_programs_cta', 'Xem lộ trình →')}
          </Link>
        </div>
      </RevealBlock>

    </div>

    {activeJourneyInfo && (
      <JourneyDetailModal
        journey={activeJourneyInfo}
        onClose={() => setActiveJourneyInfo(null)}
        onSelect={() => { setJourney(activeJourneyInfo.id); setExpandedPhase(0); setSubTab('phases'); }}
      />
    )}
    {activeCard && (
      <PillarDetailModal card={activeCard} onClose={() => setActiveCard(null)} />
    )}
    {activeChecklistItem && (
      <ChecklistItemModal
        item={activeChecklistItem.item}
        dayColor={activeChecklistItem.dayColor}
        dayRgb={activeChecklistItem.dayRgb}
        onClose={() => setActiveChecklistItem(null)}
      />
    )}
  </>
  );
}
