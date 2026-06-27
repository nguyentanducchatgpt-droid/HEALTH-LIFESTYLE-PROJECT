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

// ── Quick Link Modal ─────────────────────────────────────────────────────────
function QuickLinkModal({ ql, onClose }) {
  const { t: tCommon } = useTranslation('common');
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
        style={{ background: '#0d0d0d', borderColor: `rgba(${ql.rgb},0.28)`, boxShadow: `0 0 80px rgba(${ql.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={ql.img} alt={ql.label} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${ql.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${ql.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${ql.rgb},0.18)`, border: `2px solid rgba(${ql.rgb},0.4)` }}>
              {ql.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: ql.color }}>{ql.sub}</p>
              <h2 className="font-bold text-white text-lg leading-tight">{ql.label}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-7">
          <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: `rgba(${ql.rgb},0.75)` }}>{ql.desc}</p>

          <ul className="space-y-3 mb-6">
            {ql.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${ql.rgb},0.14)`, color: ql.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {ql.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${ql.rgb},0.06)`, border: `1px solid rgba(${ql.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to={ql.to}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-base transition-all duration-200 hover:opacity-90"
            style={{ background: `rgba(${ql.rgb},0.15)`, color: ql.color, border: `1px solid rgba(${ql.rgb},0.3)` }}
          >
            {tCommon('modal.see_detail')}
          </Link>

          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── Journey Detail Modal ─────────────────────────────────────────────────────
function JourneyDetailModal({ journey: j, onClose, onSelect }) {
  const { t: tCommon } = useTranslation('common');
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
            {tCommon('program.journey_cta', 'Xem lộ trình này →')}
          </button>

          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── Checklist Item Modal ─────────────────────────────────────────────────────
function ChecklistItemModal({ item, dayColor, dayRgb, onClose }) {
  const { t: tCommon } = useTranslation('common');
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

          <p className="text-center text-xs text-muted opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── Pillar Detail Modal ──────────────────────────────────────────────────────
function PillarDetailModal({ card, onClose }) {
  const { t: tCommon } = useTranslation('common');
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

          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
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
  {
    time:'5 phút', name:'Khởi Động', desc:'Khớp linh hoạt · nâng nhiệt cơ thể', icon:'🔥', color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    details:[
      '5 phút khởi động giảm 70% nguy cơ chấn thương — đây không phải "tùy chọn" mà là bước bắt buộc. Cơ lạnh co bóp chậm, kém đàn hồi và nhận tín hiệu thần kinh chậm hơn 30%.',
      'Công thức đơn giản: xoay khớp từ trên xuống (cổ → vai → hông → gối → cổ chân) 30 giây/vị trí + 1 phút đi bộ nhanh hoặc jumping jack. Tổng 4–5 phút là đủ.',
      'Ngay cả khi vội, giữ tối thiểu 3 phút: xoay khớp lớn + 10 jumping jack + 5 arm circle mỗi bên. Không bao giờ bỏ hoàn toàn.',
    ],
    points:[
      { icon:'🦴', label:'Khớp linh hoạt', note:'Xoay từ trên xuống 30s/vị trí' },
      { icon:'🌡️', label:'Nâng nhiệt cơ', note:'Cơ ấm co bóp hiệu quả hơn 20%' },
      { icon:'⚡', label:'Kích hoạt thần kinh', note:'Neural drive cho buổi tập chính' },
      { icon:'🛡️', label:'Giảm chấn thương', note:'70% injury từ bỏ warm-up' },
    ],
    links:[
      { icon:'🏃', label:'6 Mẫu Vận Động', to:'/pillar/a/movements' },
      { icon:'📐', label:'Khung Ngày Tập', to:'/pillar/a/framework' },
    ],
  },
  {
    time:'10–20 phút', name:'Vận Động Chính', desc:'Sức mạnh hoặc cardio theo lịch', icon:'💪', color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    details:[
      'T2/T4/T6 = Sức mạnh (Squat, Hinge, Push, Pull, Core). T3/T5 = Cardio nhẹ (đi bộ nhanh, đạp xe, 100–130 bpm). T7 = Phục hồi tích cực. CN = Nghỉ hoàn toàn.',
      'RPE mục tiêu: 6–8/10. Không quá dễ (không có kích thích thích nghi) cũng không quá nặng (không phục hồi kịp). Ghi RPE ngay sau mỗi buổi.',
      'Nguyên tắc vàng: form trước volume, volume trước intensity. Tăng không quá 10% tổng volume mỗi tuần để tránh overtraining.',
    ],
    points:[
      { icon:'💪', label:'Ngày sức mạnh', note:'T2/T4/T6 — 6 mẫu vận động cơ bản' },
      { icon:'🚶', label:'Ngày cardio nhẹ', note:'T3/T5 — nhịp tim 100–130 bpm' },
      { icon:'📊', label:'RPE 6–8/10', note:'Đủ kích thích, vẫn phục hồi được' },
      { icon:'📈', label:'Tăng 10%/tuần', note:'Progressive overload có kiểm soát' },
    ],
    links:[
      { icon:'🏃', label:'6 Mẫu Vận Động', to:'/pillar/a/movements' },
      { icon:'📅', label:'Nhịp Tuần', to:'/pillar/a/weekly' },
    ],
  },
  {
    time:'5–10 phút', name:'Giãn Cơ & Hạ Nhiệt', desc:'Kéo giãn · hạ nhịp tim · thư giãn cơ', icon:'🧘', color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    details:[
      'Sau tập mạnh, cơ đang ở trạng thái co rút. Giãn tĩnh 30s/nhóm cơ giúp phục hồi độ dài cơ và giảm DOMS (đau cơ hôm sau) 20–30%.',
      'Hạ nhịp tim đúng cách: đi bộ chậm 2 phút → giãn cơ → thở sâu. Không ngồi hoặc nằm xuống ngay sau tập nặng — máu dồn ở tay chân không kịp trở về tim.',
      'Foam rolling trước giãn tĩnh (nếu có): 30 giây/nhóm cơ lớn. Ưu tiên: đùi sau, bắp chân, hông, lưng trên. Tác dụng tốt hơn giãn đơn thuần.',
    ],
    points:[
      { icon:'🔄', label:'Giãn tĩnh 30s', note:'Giữ không nảy — nhóm cơ vừa tập' },
      { icon:'❤️', label:'Hạ nhịp tim', note:'Đi chậm 2\' trước khi giãn cơ' },
      { icon:'😌', label:'Kích hoạt PSNS', note:'Hệ thần kinh từ fight → rest' },
      { icon:'🧴', label:'Foam roll', note:'30s/nhóm cơ lớn nếu có dụng cụ' },
    ],
    links:[
      { icon:'🌿', label:'Phục Hồi Tích Cực', to:'/pillar/c/recovery' },
      { icon:'📐', label:'Khung Ngày Tập', to:'/pillar/a/framework' },
    ],
  },
  {
    time:'5 phút', name:'Mind Reset', desc:'Thở sâu hoặc thiền ngắn · đặt ý định', icon:'🌿', color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    details:[
      '5 phút cuối là cầu nối từ "mode tập" sang "mode sống". Đây là lúc não bộ consolidate (củng cố) ký ức vận động — bỏ qua là mất một phần lợi ích của buổi tập.',
      'Công thức: 3 hơi thở sâu (4s hít – 4s giữ – 6s thở ra) → 2 phút ngồi im hoặc đi bộ im lặng → đặt 1 ý định cụ thể cho phần còn lại của ngày.',
      'Nếu không có thời gian: 5 phút đi bộ im lặng (không phone, không nhạc) thay thế hoàn toàn. Tác dụng tương đương với thiền ngồi nhờ kích hoạt Default Mode Network.',
    ],
    points:[
      { icon:'🌬️', label:'3 hơi thở sâu', note:'4-4-6 giảm cortisol trong 90 giây' },
      { icon:'🎯', label:'Đặt ý định', note:'1 điều muốn làm tốt nhất hôm nay' },
      { icon:'🚶', label:'Thay thế: đi bộ', note:'5\' im lặng = thiền động hiệu quả' },
      { icon:'🧠', label:'Củng cố ký ức', note:'Não encode bài học tập sau khi dừng' },
    ],
    links:[
      { icon:'🌬️', label:'Kỹ Thuật Thở', to:'/pillar/d/breathing' },
      { icon:'🧘', label:'Thiền Định', to:'/pillar/d/meditation' },
    ],
  },
];

const DAILY_PRINCIPLES = [
  {
    text:"Không bỏ 5' khởi động — giảm 70% nguy cơ chấn thương",
    icon:'🛡️', color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    details:[
      '70% chấn thương trong tập luyện xảy ra ở buổi tập không khởi động đủ. Con số từ nghiên cứu y học thể thao — không phải ước tính.',
      'Cơ lạnh co bóp chậm, kém đàn hồi và nhận tín hiệu thần kinh chậm hơn 30%. 5 phút khởi động giải quyết cả ba vấn đề này cùng lúc.',
      'Ngay cả khi vội, giữ tối thiểu 3 phút: xoay khớp lớn + 10 jumping jack + 10 arm circle. Không bao giờ bỏ hoàn toàn — không có ngoại lệ.',
    ],
    points:[
      { icon:'⏱️', label:'Tối thiểu 3 phút', note:'Không có lý do để bỏ hoàn toàn' },
      { icon:'🦴', label:'Xoay khớp trước', note:'Cổ → vai → hông → gối → cổ chân' },
      { icon:'❤️', label:'Nâng nhịp tim nhẹ', note:'Jumping jack hoặc đi bộ 1 phút đủ' },
      { icon:'🛡️', label:'Không thương lượng', note:'Không thể bỏ — chỉ có thể rút ngắn' },
    ],
    links:[
      { icon:'🔥', label:'Xem Khung Ngày', to:'/pillar/a/framework' },
      { icon:'🏃', label:'6 Mẫu Vận Động', to:'/pillar/a/movements' },
    ],
  },
  {
    text:"Mind Reset có thể thay bằng 5' đi bộ im lặng",
    icon:'🚶', color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
    details:[
      '5 phút đi bộ im lặng (không phone, không nhạc) kích hoạt Default Mode Network — cùng vùng não với thiền định chính thức.',
      'Thiền "formal" (ngồi, nhắm mắt) không bắt buộc. Điều bắt buộc là: im lặng + ý thức hiện tại + không có kích thích. Đi bộ thỏa mãn cả ba.',
      'Áp dụng ngay: sau buổi tập, để phone trong túi, đi bộ từ phòng gym ra xe/nhà. 5 phút đó là Mind Reset hoàn toàn hợp lệ.',
    ],
    points:[
      { icon:'📵', label:'Không phone', note:'Stimulation = ngược với reset' },
      { icon:'👁️', label:'Chú ý môi trường', note:'Nhìn xung quanh thay vì màn hình' },
      { icon:'🌬️', label:'Thở tự nhiên', note:'Không cần kiểm soát — để tự nhiên' },
      { icon:'🧠', label:'DMN activation', note:'Não bộ xử lý và củng cố trong im lặng' },
    ],
    links:[
      { icon:'🌬️', label:'Kỹ Thuật Thở', to:'/pillar/d/breathing' },
      { icon:'🧘', label:'Thiền Định', to:'/pillar/d/meditation' },
    ],
  },
  {
    text:"Nếu chỉ có 20 phút: 5' khởi động + 10' chính + 5' giãn",
    icon:'⏱️', color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&q=80',
    details:[
      '20 phút luôn tốt hơn 0 phút. Nghiên cứu chứng minh 1 set/bài tập đã có 60–70% lợi ích so với 3 set — khi thời gian hạn chế, ưu tiên nhất quán hơn là hoàn hảo.',
      'Công thức 20 phút: 5\' khởi động → 10\' vận động chính (2–3 bài, 1–2 set, không nghỉ dài) → 5\' giãn cơ + thở. Bỏ Mind Reset riêng — kết hợp vào cuối giãn cơ.',
      'Khi chỉ có 20 phút, dùng circuit training: thực hiện liên tục 2–3 bài không nghỉ giữa các bài, chỉ nghỉ khi kết thúc vòng. Tiết kiệm 5–8 phút so với nghỉ bình thường.',
    ],
    points:[
      { icon:'⏰', label:'20 phút đủ', note:'Luôn tốt hơn bỏ hoàn toàn' },
      { icon:'🏃', label:'2–3 bài chính', note:'Ít bài hơn, ít nghỉ hơn' },
      { icon:'🔗', label:'Circuit training', note:'Đi liên tục để tiết kiệm thời gian' },
      { icon:'📐', label:'Ưu tiên form', note:'Thà ít rep đúng hơn nhiều rep sai' },
    ],
    links:[
      { icon:'📐', label:'Khung Ngày Tập', to:'/pillar/a/framework' },
      { icon:'⚡', label:'Quick Workouts', to:'/pillar/f/quick-workouts' },
    ],
  },
  {
    text:"Nếu có 40 phút: thêm Giãn cơ và Mind Reset đầy đủ",
    icon:'🌟', color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    details:[
      '40 phút là "golden zone" — đủ cho buổi tập hoàn chỉnh mà không quá dài gây mệt mỏi tinh thần hoặc khó duy trì thói quen.',
      'Phân bổ 40 phút: 5\' khởi động → 20\' vận động chính (thêm set hoặc thêm 1 bài) → 10\' giãn cơ đủ cho mọi nhóm cơ → 5\' Mind Reset đầy đủ.',
      'Nếu thường xuyên có 40 phút: thêm foam rolling 5 phút trước giãn tĩnh, hoặc thiền ngồi thay vì chỉ thở sâu. Đây là phiên bản "full program" mỗi ngày.',
    ],
    points:[
      { icon:'⏳', label:'Golden zone', note:'40 phút = hiệu quả & bền vững nhất' },
      { icon:'🧴', label:'Thêm foam roll', note:'5\' trước giãn tĩnh nếu có dụng cụ' },
      { icon:'🧘', label:'Thiền đầy đủ', note:'5\' ngồi im thay vì chỉ 3 nhịp thở' },
      { icon:'📊', label:'Thêm 1 bài', note:'Tăng set hoặc weak point exercise' },
    ],
    links:[
      { icon:'📐', label:'Khung Ngày Tập', to:'/pillar/a/framework' },
      { icon:'🌿', label:'Phục Hồi', to:'/pillar/c/recovery' },
    ],
  },
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
    movesData: [
      { icon:'🏋️', name:'Squat — 3×12', time:'BÀI 1', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
        details:['Squat là "vua" bài tập hạ chi — kích hoạt đùi trước, đùi sau, mông và lõi cùng lúc. 3 set × 12 reps với body weight hoặc tạ vừa là điểm khởi đầu hoàn hảo.','Kỹ thuật then chốt: đầu gối theo hướng ngón chân, ngực thẳng, mông ngồi xuống như ngồi ghế sau lưng. Không để đầu gối đổ vào trong.','Khi đã quen 3×12 dễ dàng, tăng 1 set hoặc thêm 2.5kg. Không tăng cả hai cùng lúc — progressive overload có kiểm soát.'],
        points:[{icon:'🦵',label:'Hạ chi toàn diện',note:'Đùi trước · đùi sau · mông'},{icon:'📐',label:'Đầu gối theo ngón chân',note:'Không đổ vào trong'},{icon:'⬆️',label:'Ngực thẳng',note:'Không cúi người quá nhiều'},{icon:'📊',label:'3×12 → tăng dần',note:'Tăng 1 set hoặc +2.5kg'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📈',label:'Theo Dõi Tiến Bộ',to:'/pillar/a/progress'}] },
      { icon:'⚡', name:'Hinge (Deadlift) — 3×10', time:'BÀI 2', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
        details:['Hinge là chuyển động gấp hông — kích hoạt đùi sau, mông và lưng dưới. Romanian Deadlift với tạ nhẹ là biến thể an toàn nhất để bắt đầu.','Kỹ thuật: giữ lưng thẳng, đẩy hông ra sau (không cúi gập lưng), cảm nhận căng cơ đùi sau khi hạ xuống. Đẩy hông về trước khi đứng dậy.','Đây là bài tập phòng chống đau lưng hiệu quả nhất — lưng dưới mạnh = ít đau khi ngồi lâu. 3×10 với form đúng quan trọng hơn nặng.'],
        points:[{icon:'🍑',label:'Mông & đùi sau',note:'Cơ nhóm posterior chain'},{icon:'🔒',label:'Lưng thẳng',note:'Không bao giờ cong lưng khi deadlift'},{icon:'🦴',label:'Phòng đau lưng',note:'Lưng dưới mạnh = dứt đau lưng mãn'},{icon:'🐢',label:'Chậm khi hạ',note:'2 giây hạ = kích thích cơ tốt hơn'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📐',label:'Khung Ngày Tập',to:'/pillar/a/framework'}] },
      { icon:'💪', name:'Push (Push-up) — 3×10', time:'BÀI 3', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        details:['Push-up kích hoạt ngực, vai trước và tam đầu cánh tay. Không cần tạ — body weight đủ khi form đúng và kiểm soát tốt tempo.','Nếu push-up sàn còn khó: bắt đầu với push-up nghiêng (tay trên ghế/tường), giảm góc dần khi mạnh hơn. Không bao giờ "giảm tải" bằng cách cong lưng.','3×10 với pause 1 giây dưới cùng hiệu quả hơn 3×20 nhanh. Paused push-up = loại bỏ momentum, 100% cơ.'],
        points:[{icon:'🫁',label:'Ngực + vai + tam đầu',note:'3 nhóm cơ thân trên mỗi lần'},{icon:'⬇️',label:'Pause dưới cùng',note:'1s giữ = loại bỏ momentum'},{icon:'📐',label:'Lưng thẳng như ván',note:'Cốt lõi cứng suốt chuyển động'},{icon:'📈',label:'Push-up nghiêng → sàn',note:'Tiến trình tự nhiên cho người mới'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'⚡',label:'Quick Workouts',to:'/pillar/f/quick-workouts'}] },
      { icon:'🔄', name:'Pull (Row) — 3×10', time:'BÀI 4', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
        details:['Pull/Row kích hoạt lưng giữa, lưng rộng và nhị đầu. Cân bằng Push-Pull là nguyên tắc số 1 để tránh chấn thương vai và đau lưng trên dài hạn.','Dumbbell row, resistance band row, hoặc cạnh bàn row (không có dụng cụ) đều hiệu quả. Quan trọng là co bóp lưng giữa khi kéo về — không chỉ dùng tay.','Hầu hết người mới tập quá nhiều Push và quá ít Pull — mất cân bằng cơ vai trước/sau dẫn đến đau vai sau 3–6 tháng. Giữ tỷ lệ 1:1.'],
        points:[{icon:'🔙',label:'Lưng giữa & lưng rộng',note:'Cân bằng với Push = vai khỏe'},{icon:'🤏',label:'Co bóp bả vai',note:'Kéo bằng lưng, không chỉ tay'},{icon:'⚖️',label:'Push:Pull = 1:1',note:'Cân bằng ngăn chấn thương vai'},{icon:'🪑',label:'Không cần phòng gym',note:'Bàn/ghế/band đều dùng được'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📈',label:'Theo Dõi Tiến Bộ',to:'/pillar/a/progress'}] },
      { icon:'🛡️', name:'Core (Plank) — 3×30s', time:'BÀI 5', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        details:['Plank và core stability là nền tảng của MỌI bài tập khác — không phải để có "6 múi" mà để cột sống được bảo vệ khi tập nặng hơn.','3×30 giây plank chuẩn: cổ trung lập, hông không chảy xuống, lõi cứng như đang chịu đòn. 30 giây chuẩn hiệu quả hơn 2 phút sai tư thế.','Tiến trình: Plank sàn 30s → 45s → 60s → thêm shoulder tap → plank một chân. Đừng vội tiến nếu lưng còn bị chảy.'],
        points:[{icon:'⚙️',label:'Nền tảng mọi bài tập',note:'Core yếu = mọi bài khác kém hiệu quả'},{icon:'📐',label:'Hông không chảy',note:'Tưởng tượng ván thẳng từ gót đến đầu'},{icon:'🧠',label:'Kích hoạt thần kinh',note:'Siết bụng chủ động, không thụ động'},{icon:'⏱️',label:'30s chuẩn > 2\' sai',note:'Chất lượng trước thời gian'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📐',label:'Khung Ngày Tập',to:'/pillar/a/framework'}] },
    ],
    tipsData: [
      { icon:'📐', name:'Form trước cường độ', time:'NGUYÊN TẮC', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        details:['Form sai với tạ nặng = chấn thương chỉ là vấn đề thời gian. Form đúng với tạ nhẹ = an toàn vĩnh viễn và kích thích cơ hiệu quả hơn.','Kiểm tra form: quay video góc bên trong buổi đầu, so sánh với hướng dẫn chuẩn. Hầu hết sai lầm không thấy được khi không có gương.','Khi nào tăng tải: tất cả reps trong set đều chuẩn + cảm thấy dễ + nghỉ giữa set đủ phục hồi. Chỉ tăng 1 biến (tạ HOẶC reps) mỗi tuần.'],
        points:[{icon:'🔬',label:'Form = bảo vệ khớp',note:'Chấn thương từ form sai có thể dài hạn'},{icon:'📹',label:'Quay video kiểm tra',note:'Điện thoại góc bên = coach miễn phí'},{icon:'⚖️',label:'1 biến/tuần',note:'Chỉ tăng tạ HOẶC reps, không cả hai'},{icon:'🐢',label:'Tempo chậm',note:'2s hạ · 1s giữ · 1s đẩy = form tốt hơn'}],
        links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📊',label:'Workout Log',to:'/pillar/f/workout-log'}] },
      { icon:'🔥', name:'Khởi động 5\' bắt buộc', time:'NGUYÊN TẮC', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        details:['70% chấn thương xảy ra trong 10 phút đầu buổi tập không khởi động. Cơ lạnh co bóp kém, kéo giãn kém và nhận tín hiệu thần kinh chậm hơn 30%.','Công thức 5 phút: xoay khớp từ trên xuống (cổ → vai → hông → gối) 30s/vị trí + 1 phút đi bộ nhanh hoặc jumping jack. Tổng 4–5 phút là đủ.','Khi vội chỉ có 3 phút: xoay 3 khớp lớn + 10 jumping jack + 5 arm circle. Không bỏ hoàn toàn — không có ngoại lệ.'],
        points:[{icon:'🌡️',label:'Cơ ấm = hiệu quả hơn 20%',note:'Nhiệt độ cơ tăng = co bóp mạnh hơn'},{icon:'⚡',label:'Kích hoạt thần kinh',note:'Neural drive chuẩn bị cho tải nặng'},{icon:'⏱️',label:'Tối thiểu 3 phút',note:'Không có lý do chính đáng để bỏ'},{icon:'🦴',label:'Khớp linh hoạt trước',note:'Xoay từ cổ xuống — không bỏ bước này'}],
        links:[{icon:'📐',label:'Khung Ngày Tập',to:'/pillar/a/framework'},{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'}] },
      { icon:'📈', name:'Tăng không quá 10% volume/tuần', time:'NGUYÊN TẮC', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        details:['"10% rule" là quy tắc phổ thông nhất trong thể thao: tăng tổng volume (sets × reps × tạ) không quá 10% mỗi tuần. Vượt ngưỡng này = nguy cơ chấn thương tăng gấp đôi.','Ví dụ thực tế: tuần này tập 10 set tổng → tuần sau tối đa 11 set. Không tăng tạ + reps + sets cùng lúc.','Khi cơ thể báo hiệu: đau dai dẳng (khác với đau cơ bình thường), ngủ kém hơn, motivation giảm mạnh = dấu hiệu overtraining. Cần giảm 20% volume 1 tuần.'],
        points:[{icon:'📊',label:'Volume = sets×reps×tạ',note:'Tính tổng tuần, không chỉ/buổi'},{icon:'🛑',label:'+10% tối đa',note:'Vượt ngưỡng = chấn thương gần hơn'},{icon:'🔄',label:'Deload 1 tuần/tháng',note:'Giảm 40% volume = phục hồi sâu'},{icon:'📝',label:'Ghi workout log',note:'Không log = không biết đang tăng bao nhiêu'}],
        links:[{icon:'📊',label:'Workout Log',to:'/pillar/f/workout-log'},{icon:'📈',label:'Theo Dõi Tiến Bộ',to:'/pillar/a/progress'}] },
      { icon:'📓', name:'Ghi RPE + số lần sau buổi tập', time:'NGUYÊN TẮC', color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        details:['RPE (Rate of Perceived Exertion) 1–10 là công cụ tự đánh giá cường độ: RPE 6 = nói chuyện được · RPE 8 = khó nói · RPE 10 = không còn sức. Ghi ngay sau mỗi buổi.','5 phút ghi nhật ký tập = dữ liệu để tăng tải thông minh. Nhìn lại 4 tuần: RPE 7 liên tục → tăng tải. RPE 9 liên tục → giữ nguyên hoặc deload.','Tối thiểu cần ghi: bài tập · tạ · set/reps · RPE. Dùng app hoặc sổ tay — không quan trọng, quan trọng là nhất quán.'],
        points:[{icon:'🎯',label:'RPE 7–8 là mục tiêu',note:'Đủ nặng để kích thích, đủ nhẹ để phục hồi'},{icon:'📱',label:'App hoặc sổ tay',note:'Dữ liệu tốt hơn trí nhớ luôn'},{icon:'🔍',label:'Review 4 tuần/lần',note:'Tìm pattern: đang tăng hay giậm chân?'},{icon:'⚡',label:'5 phút sau buổi tập',note:'Khi còn nhớ — không để đến hôm sau'}],
        links:[{icon:'📊',label:'Workout Log',to:'/pillar/f/workout-log'},{icon:'✅',label:'Daily Checklist',to:'/pillar/f/checklist'}] },
    ],
    avoidData: { icon:'⚠️', name:'Không tập 2 ngày liên tiếp', time:'CẢNH BÁO', color:'#22c55e', rgb:'34,197,94',
      img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      details:['Cơ không lớn lúc tập — cơ lớn lúc nghỉ. Sợi cơ cần 48–72h để tái tạo protein và phục hồi hoàn toàn. Tập lại trước đó = chấn thương vi mô chồng lên chấn thương vi mô.','Cảm giác "đau cơ" (DOMS) ngày 2 sau tập sức mạnh là bình thường và an toàn. Tập lại ngay lúc còn đau = kéo dài thời gian hồi phục, không rút ngắn.','Lịch 3×/tuần cách ngày (T2·T4·T6) là thiết kế tối ưu: đủ kích thích + đủ nghỉ ngơi. Nếu muốn tập hàng ngày: xen kẽ sức mạnh và cardio nhẹ/phục hồi.'],
      points:[{icon:'⏳',label:'48–72h phục hồi',note:'Sợi cơ cần thời gian tái tạo protein'},{icon:'😴',label:'Ngủ = thuốc phục hồi',note:'Protein synthesis cao nhất lúc ngủ sâu'},{icon:'📅',label:'T2·T4·T6 là tối ưu',note:'Cách ngày = tập + nghỉ xen kẽ'},{icon:'🔄',label:'Tập hàng ngày?',note:'Xen kẽ sức mạnh + cardio nhẹ/recovery'}],
      links:[{icon:'🌿',label:'Phục Hồi Tích Cực',to:'/pillar/c/recovery'},{icon:'📅',label:'Nhịp Tuần',to:'/pillar/a/weekly'}] },
  },
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=70',
    intensity: 'RPE 5/10', duration: '20–30\'', sessions: '2×/tuần', rest: 'N/A',
    moves: ['Đi bộ nhanh — nhịp tim 100–120 bpm', 'Đạp xe tĩnh / ngoài trời', 'Leo cầu thang (NEAT)', 'Bơi lội nhẹ / aqua jogging', 'Nhảy dây nhẹ — 10\' đủ'],
    tips: ['Sau bữa trưa = giảm đường huyết 20–30%', 'Đi bộ đến chỗ làm = NEAT miễn phí', 'Nghe podcast / nhạc để tăng commitment', 'Nhịp tim mục tiêu = (220 - tuổi) × 60–70%'],
    avoid: 'Không chạy nhanh ngay sau bữa ăn — chờ ít nhất 30 phút',
    movesData: [
      { icon:'🚶', name:'Đi bộ nhanh — 100–120 bpm', time:'HOẠT ĐỘNG 1', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        details:['Đi bộ nhanh (brisk walk) là cardio hoàn hảo nhất cho người mới: ít chấn thương, đốt mỡ hiệu quả, có thể duy trì hàng ngày. Nhịp tim mục tiêu 100–120 bpm = Zone 2.','Zone 2 cardio = đốt chủ yếu mỡ làm nhiên liệu, tăng khả năng hấp thụ oxy (VO2max), cải thiện sức bền tim mạch. Có thể nói chuyện nhưng hơi thở nhanh hơn bình thường.','30 phút đi bộ nhanh sau bữa trưa giảm đường huyết 20–30% — hiệu quả tương đương uống thuốc tiểu đường nhẹ theo nghiên cứu 2023.'],
        points:[{icon:'❤️',label:'Zone 2 cardio',note:'100–120 bpm = đốt mỡ tối ưu'},{icon:'🧠',label:'Tăng sức bền não',note:'Cardio tăng BDNF — protein tăng trưởng não'},{icon:'🩸',label:'Kiểm soát đường huyết',note:'-20–30% sau ăn 10–15 phút'},{icon:'🦴',label:'Ít chấn thương nhất',note:'Impact thấp = khớp gối và lưng an toàn'}],
        links:[{icon:'🌿',label:'NEAT & Lối Sống',to:'/pillar/c/neat'},{icon:'🔄',label:'Phục Hồi Tích Cực',to:'/pillar/c/recovery'}] },
      { icon:'🚴', name:'Đạp xe tĩnh / ngoài trời', time:'HOẠT ĐỘNG 2', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        details:['Đạp xe là cardio lý tưởng nếu đầu gối hoặc hông nhạy cảm — zero impact, dễ điều chỉnh cường độ và có thể kết hợp với thông tin/giải trí.','Xe tĩnh trong nhà: dễ thêm vào thói quen sáng hoặc tối, xem phim/nghe podcast cùng lúc. Xe ngoài trời: thêm lợi ích ánh sáng tự nhiên và không khí.','Cường độ mục tiêu: có thể nói được một câu ngắn mà không hụt hơi. Thấp hơn = không đủ kích thích. Cao hơn = chuyển sang interval training (không phải mục tiêu hôm nay).'],
        points:[{icon:'🦴',label:'Zero impact',note:'Tốt cho người đầu gối yếu'},{icon:'🎬',label:'Kết hợp giải trí',note:'Xem phim + đạp xe = commitment cao hơn'},{icon:'☀️',label:'Ngoài trời = thêm lợi ích',note:'Ánh sáng tự nhiên tốt cho circadian'},{icon:'⚙️',label:'Điều chỉnh cường độ dễ',note:'Kháng lực cao = interval, thấp = Zone 2'}],
        links:[{icon:'🌿',label:'Nhịp Sinh Học',to:'/pillar/c/circadian'},{icon:'🌀',label:'NEAT',to:'/pillar/c/neat'}] },
      { icon:'🪜', name:'Leo cầu thang (NEAT)', time:'HOẠT ĐỘNG 3', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        details:['NEAT (Non-Exercise Activity Thermogenesis) là năng lượng đốt từ hoạt động không phải tập gym. Leo cầu thang là NEAT dễ tích hợp nhất vào cuộc sống hàng ngày.','Nghiên cứu cho thấy người tích cực NEAT đốt thêm 300–500 kcal/ngày so với người ngồi nhiều — mà không cần tập thêm một buổi nào. Leo cầu thang 10 phút/ngày = 70 phút cardio/tuần miễn phí.','Mẹo tích hợp: luôn chọn cầu thang thay thang máy, đỗ xe xa hơn 200m, đứng thay ngồi khi họp. Cộng dồn mới quan trọng, không phải mỗi lần.'],
        points:[{icon:'🔥',label:'300–500 kcal/ngày',note:'NEAT tích cực = đốt thêm không cần tập'},{icon:'🪜',label:'Cầu thang = tập mông',note:'10 bước = kích hoạt glute tốt'},{icon:'⏱️',label:'Tích hợp vào sinh hoạt',note:'Không cần thời gian riêng — chỉ thay thói quen'},{icon:'📊',label:'10.000 bước/ngày',note:'Mục tiêu NEAT cơ bản khuyến nghị'}],
        links:[{icon:'🌀',label:'NEAT & Lifestyle',to:'/pillar/c/neat'},{icon:'📈',label:'Theo Dõi',to:'/pillar/a/progress'}] },
      { icon:'🏊', name:'Bơi lội nhẹ / aqua jogging', time:'HOẠT ĐỘNG 4', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        details:['Bơi lội là cardio toàn thân tốt nhất — kích hoạt cơ thân trên, thân dưới và lõi đồng thời, trong khi áp lực lên khớp gần bằng không.','Aqua jogging (chạy dưới nước với dây phao) là lựa chọn hay cho người đang phục hồi chấn thương — cường độ như chạy bộ nhưng zero impact.','Nếu không có hồ bơi gần: thay bằng đi bộ nhanh 25 phút. Đừng bỏ buổi cardio vì thiếu dụng cụ — thay thế tốt luôn tốt hơn bỏ.'],
        points:[{icon:'💦',label:'Cardio toàn thân',note:'Thân trên · thân dưới · lõi cùng lúc'},{icon:'🦴',label:'Áp lực khớp ~0',note:'Tốt nhất cho người đau khớp gối'},{icon:'🩹',label:'Phục hồi chấn thương',note:'Aqua jogging = chạy không impact'},{icon:'🔄',label:'Thay thế linh hoạt',note:'Không có hồ? Đi bộ nhanh 25 phút'}],
        links:[{icon:'🔄',label:'Phục Hồi',to:'/pillar/c/recovery'},{icon:'🌀',label:'Lối Sống',to:'/pillar/c/neat'}] },
      { icon:'⏭️', name:'Nhảy dây nhẹ — 10\' đủ', time:'HOẠT ĐỘNG 5', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1434596922112-19c563067271?w=800&q=80',
        details:['10 phút nhảy dây nhẹ = 30 phút đi bộ về năng lượng đốt — hiệu quả thời gian cao nhất trong các dạng cardio đơn giản. Giá dây nhảy 50–100k, dùng hàng chục năm.','Kỹ thuật cho người mới: bước chân đôi (không nhảy một chân), cổ tay quay dây (không phải cánh tay), đổ trọng lực về mũi bàn chân. Nhảy chậm đều tốt hơn nhanh mà vấp.','Nếu 10 phút liên tục còn khó: xen kẽ 30s nhảy + 30s nghỉ × 10 vòng. Interval nhảy dây = cardio + coordination + sức bền trong 1 bài.'],
        points:[{icon:'⚡',label:'10 phút = 30 phút đi bộ',note:'Calorie/phút cao nhất trong cardio đơn'},{icon:'🏠',label:'Tập trong phòng được',note:'Không cần ra ngoài hay dụng cụ to'},{icon:'🦶',label:'Bàn chân hấp thụ',note:'Đổ trọng lực mũi chân, không gót'},{icon:'🔄',label:'Interval nếu chưa quen',note:'30s nhảy + 30s nghỉ × 10 vòng'}],
        links:[{icon:'⚡',label:'Quick Workouts',to:'/pillar/f/quick-workouts'},{icon:'📐',label:'Khung Ngày',to:'/pillar/a/framework'}] },
    ],
    tipsData: [
      { icon:'🍽️', name:'Sau bữa trưa = giảm đường huyết', time:'MẸO', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        details:['10–15 phút đi bộ sau ăn trưa giảm đường huyết 20–30% — hiệu quả cao nhất trong tất cả thời điểm đi bộ trong ngày theo nghiên cứu CGM (liên tục theo dõi đường huyết).','Cơ chế: đường từ bữa ăn vào máu → cơ chân đang hoạt động hấp thụ glucose → không cần insulin nhiều → đường huyết ổn định. Đặc biệt quan trọng nếu có tiểu đường hoặc tiền tiểu đường.','Không cần tốc độ cao — đi bộ thư thái 10 phút là đủ. Ngay cả đứng thay ngồi sau ăn cũng giảm đột biến đường huyết 10–15%.'],
        points:[{icon:'🩸',label:'-20–30% đường huyết',note:'Hiệu quả nhất của đi bộ sau ăn'},{icon:'⏱️',label:'10–15 phút là đủ',note:'Không cần dài — cần đúng thời điểm'},{icon:'💡',label:'Không cần nhanh',note:'Thư thái vẫn hiệu quả — quan trọng là di chuyển'},{icon:'🔬',label:'Nghiên cứu CGM 2023',note:'Dữ liệu từ đeo thiết bị đường huyết liên tục'}],
        links:[{icon:'🥗',label:'Dinh Dưỡng',to:'/pillar/b'},{icon:'🌀',label:'NEAT',to:'/pillar/c/neat'}] },
      { icon:'🚶', name:'Đi bộ đến chỗ làm = NEAT miễn phí', time:'MẸO', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        details:['Tích hợp đi bộ vào di chuyển hàng ngày = NEAT tự động không cần ý chí. Đỗ xe cách 500m, xuống xe buýt sớm 1 trạm, đi bộ giờ trưa — cộng dồn 30–60 phút/ngày dễ dàng.','NEAT không đếm là "tập gym" nhưng đóng góp 15–30% tổng calorie đốt hàng ngày ở người năng động. Người ngồi văn phòng NEAT thấp hơn người bán hàng 1500–2000 kcal/ngày.','Không cần thay đổi lớn — chỉ cần thay 1 thói quen: luôn chọn cầu thang, luôn đỗ xa hơn, luôn đứng khi họp điện thoại. 3 thay đổi này = 200–300 kcal/ngày.'],
        points:[{icon:'🔄',label:'NEAT tự động',note:'Không cần nhớ tập — tích hợp vào thói quen'},{icon:'📊',label:'15–30% calorie đốt',note:'NEAT đóng góp lớn như tập gym'},{icon:'🏢',label:'3 thay đổi đơn giản',note:'Cầu thang · đỗ xa · đứng khi họp'},{icon:'💰',label:'Hoàn toàn miễn phí',note:'Không phí gym, không trang thiết bị'}],
        links:[{icon:'🌀',label:'NEAT & Lối Sống',to:'/pillar/c/neat'},{icon:'🌿',label:'Lifestyle',to:'/pillar/c'}] },
      { icon:'🎧', name:'Nghe podcast / nhạc tăng commitment', time:'MẸO', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        details:['Chỉ được nghe podcast/nhạc yêu thích khi đang đi bộ hoặc cardio — tạo "reward" đặc biệt cho buổi tập. Hiệu ứng "temptation bundling" tăng tỷ lệ duy trì thói quen 51%.','Nghiên cứu từ Wharton School: người dùng temptation bundling (chỉ nghe audiobook khi tập) tập thêm 51% so với nhóm không dùng. Không phải ý chí — là thiết kế hệ thống.','Chọn nội dung chỉ nghe khi cardio: podcast series dài, audiobook hấp dẫn, playlist đặc biệt. Cảm giác "chờ được nghe tiếp" là động lực ra ngoài.'],
        points:[{icon:'🎯',label:'Temptation bundling',note:'Reward tốt + hành động khó = duy trì tốt hơn'},{icon:'📈',label:'+51% tần suất tập',note:'Nghiên cứu thực tế từ Wharton School'},{icon:'🎵',label:'Playlist "chỉ khi tập"',note:'Nhạc này = não biết đến giờ tập rồi'},{icon:'📚',label:'Audiobook series dài',note:'Muốn nghe tiếp = muốn ra ngoài đi bộ'}],
        links:[{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'},{icon:'🌀',label:'NEAT',to:'/pillar/c/neat'}] },
      { icon:'❤️', name:'Nhịp tim mục tiêu 60–70% max', time:'MẸO', color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        details:['Công thức: nhịp tim tối đa = 220 - tuổi. Zone 2 cardio = 60–70% max nhịp tim. Ví dụ 30 tuổi: max = 190 bpm → Zone 2 = 114–133 bpm.','Zone 2 đặc biệt hiệu quả cho: đốt mỡ (cơ thể dùng mỡ làm nhiên liệu chính), cải thiện sức bền tim mạch dài hạn, phục hồi sau tập nặng.','Cách đơn giản nhất đo Zone 2 không cần thiết bị: bạn phải có thể nói được 1–2 câu đầy đủ mà không hụt hơi. Nhanh hơn = Zone 3, chậm hơn = Zone 1.'],
        points:[{icon:'🧮',label:'220 - tuổi = max HR',note:'Ví dụ 30t: max 190 → Zone2: 114–133'},{icon:'🔥',label:'Zone 2 = đốt mỡ',note:'Mỡ là nguồn nhiên liệu chính ở 60–70%'},{icon:'💬',label:'Talk test đơn giản',note:'Nói được 1 câu = Zone 2 đúng'},{icon:'📱',label:'Smartwatch tiện hơn',note:'Không cần tính toán — thiết bị tự đo'}],
        links:[{icon:'🌿',label:'Lối Sống',to:'/pillar/c'},{icon:'📈',label:'Theo Dõi Tiến Bộ',to:'/pillar/a/progress'}] },
    ],
    avoidData: { icon:'⚠️', name:'Không chạy nhanh ngay sau bữa ăn', time:'CẢNH BÁO', color:'#3b82f6', rgb:'59,130,246',
      img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      details:['Sau bữa ăn, máu tập trung về hệ tiêu hóa để xử lý thức ăn. Chạy nhanh ngay lúc này = tranh giành máu giữa cơ và ruột → chuột rút bụng, buồn nôn, đau bên hông.','30 phút nghỉ sau ăn nhẹ, 60–90 phút sau bữa đầy đủ. Đi bộ nhẹ nhàng sau ăn là ngoại lệ — đủ chậm để không tranh giành máu tiêu hóa.','Nếu phải tập ngay: ăn snack nhỏ 100–150 kcal (chuối, bánh gạo) thay vì bữa đầy. Dạ dày nhẹ = tập thoải mái hơn nhiều.'],
      points:[{icon:'🩸',label:'Máu tranh giành',note:'Cơ vs ruột = chuột rút, buồn nôn'},{icon:'⏱️',label:'Chờ 30–90 phút',note:'30p sau snack nhẹ · 90p sau bữa đầy'},{icon:'🚶',label:'Đi bộ nhẹ OK',note:'Đủ chậm để không ảnh hưởng tiêu hóa'},{icon:'🍌',label:'Snack nhỏ trước tập',note:'100–150 kcal = năng lượng không nặng bụng'}],
      links:[{icon:'🥗',label:'Dinh Dưỡng & Meal Plan',to:'/pillar/b'},{icon:'🌀',label:'NEAT',to:'/pillar/c/neat'}] },
  },
  {
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=70',
    intensity: 'RPE 3/10', duration: '20–45\'', sessions: '1×/tuần', rest: 'Linh hoạt',
    moves: ['Giãn cơ tĩnh — giữ 30–60s/vị trí', 'Foam roll toàn thân — 10\'', 'Yoga nhẹ / yin yoga', 'Đi bộ thư giãn công viên', 'Massage nhẹ / tự massage bằng bóng'],
    tips: ['Đây là "tập vô hình" — cơ lớn lúc phục hồi', 'Breathing: hít 4s → giữ 4s → thở ra 6s', 'Đây là lúc nghe body signal tốt nhất', 'Uống nhiều nước hơn bình thường'],
    avoid: 'Tránh coi đây là ngày lười biếng — phục hồi có chủ đích = cơ lớn hơn',
    movesData: [
      { icon:'🧘', name:'Giãn cơ tĩnh — 30–60s/vị trí', time:'HOẠT ĐỘNG 1', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        details:['Giãn tĩnh (static stretch) sau tập: giữ 30–60 giây mỗi nhóm cơ, không nảy, không đau. Ưu tiên nhóm cơ vừa tập nặng: đùi trước, đùi sau, hông, ngực, vai.','Giãn đúng cách giảm DOMS (đau cơ hôm sau) 20–30% và phục hồi độ dài cơ để tránh cứng cơ dài hạn. Không cần flexibility — cần consistency.','Thứ tự chuẩn: bắt đầu nhóm cơ lớn (đùi, mông, lưng) trước nhóm cơ nhỏ (bắp tay, bắp chân). Giữ nhẹ nhàng — cảm giác kéo căng, không phải đau.'],
        points:[{icon:'⏱️',label:'30–60 giây/vị trí',note:'Dưới 20s không đủ hiệu quả'},{icon:'😌',label:'Kéo căng, không đau',note:'Nếu đau = kéo quá → giảm biên độ'},{icon:'🔄',label:'Nhóm cơ lớn trước',note:'Đùi · mông · lưng → vai · ngực → bắp tay'},{icon:'📉',label:'-20–30% DOMS',note:'Đau cơ hôm sau giảm đáng kể'}],
        links:[{icon:'🌿',label:'Phục Hồi Tích Cực',to:'/pillar/c/recovery'},{icon:'📐',label:'Khung Ngày Tập',to:'/pillar/a/framework'}] },
      { icon:'🧴', name:'Foam roll toàn thân — 10\'', time:'HOẠT ĐỘNG 2', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        details:['Foam rolling (self-myofascial release) phá vỡ "điểm kích hoạt" (trigger point) trong cơ — nút thắt nhỏ gây đau và hạn chế vận động. 10 phút trên roller = massage 20 phút.','Kỹ thuật: lăn chậm 2–3 giây/cm, khi gặp điểm đau dừng lại 20–30 giây cho đến khi dịu. Không lăn nhanh liên tục — không có tác dụng.','Ưu tiên: đùi sau (hamstring), đùi ngoài (IT band), bắp chân, lưng trên (không lăn cổ và lưng dưới). Dùng trước giãn tĩnh để kết quả tốt hơn.'],
        points:[{icon:'🎯',label:'Điểm kích hoạt',note:'Dừng ở điểm đau 20–30s cho đến khi dịu'},{icon:'🔙',label:'Lưu ý lưng dưới',note:'KHÔNG foam roll lưng dưới — dùng tennis ball thay'},{icon:'⏰',label:'Trước giãn tĩnh',note:'Foam roll trước = giãn cơ hiệu quả hơn 30%'},{icon:'💰',label:'Roller 150–300k',note:'Dùng hàng chục năm — đáng đầu tư'}],
        links:[{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'},{icon:'🔄',label:'Lối Sống',to:'/pillar/c'}] },
      { icon:'🧘', name:'Yoga nhẹ / yin yoga', time:'HOẠT ĐỘNG 3', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        details:['Yin yoga (giữ tư thế 2–5 phút) tác động vào mô liên kết sâu (fascia, ligament) — không chỉ cơ bắp. Tăng phạm vi vận động khớp theo cách mà giãn thông thường không làm được.','Phù hợp cho ngày phục hồi vì nhịp độ chậm, không có cường độ và mang lại trạng thái thư giãn sâu nhờ kích hoạt hệ thần kinh parasympathetic.','Không biết bắt đầu từ đâu: YouTube "Yoga with Adriene — Yin yoga for beginners" là điểm khởi đầu miễn phí hoàn hảo.'],
        points:[{icon:'⏳',label:'Giữ 2–5 phút/tư thế',note:'Dài hơn giãn thông thường — đúng mục đích'},{icon:'🔗',label:'Tác động fascia',note:'Mô liên kết sâu — không chỉ cơ bắp'},{icon:'😌',label:'Kích hoạt PSNS',note:'Thần kinh "nghỉ-tiêu hóa" → thư giãn sâu'},{icon:'📱',label:'YouTube miễn phí',note:'Yoga with Adriene = tốt nhất cho người mới'}],
        links:[{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'},{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'}] },
      { icon:'🌳', name:'Đi bộ thư giãn công viên', time:'HOẠT ĐỘNG 4', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
        details:['Đi bộ trong môi trường xanh (công viên, cây cối) giảm cortisol 16% và huyết áp 10% so với đi bộ cùng khoảng cách trong đô thị — theo nghiên cứu Nhật Bản về "Shinrin-yoku" (tắm rừng).','Đây là cardio recovery hoàn hảo: nhịp tim 60–80 bpm, kích thích hệ thần kinh parasympathetic, tăng vitamin D từ ánh nắng sáng sớm.','Không có công viên: thay bằng đi bộ phố ít xe, khu dân cư yên tĩnh, hoặc 20 phút quanh tòa nhà nơi làm việc. Môi trường tĩnh quan trọng hơn có cây hay không.'],
        points:[{icon:'🌿',label:'-16% cortisol',note:'Thiên nhiên giảm stress hormone tốt hơn phố'},{icon:'☀️',label:'Vitamin D tự nhiên',note:'Sáng sớm ngoài trời = tốt nhất'},{icon:'😌',label:'Recovery cardio',note:'60–80 bpm = kích thích PSNS'},{icon:'🧠',label:'Shinrin-yoku',note:'Tắm rừng Nhật Bản — nghiên cứu 30 năm'}],
        links:[{icon:'🌿',label:'Phục Hồi Tích Cực',to:'/pillar/c/recovery'},{icon:'🌀',label:'NEAT',to:'/pillar/c/neat'}] },
      { icon:'💆', name:'Massage nhẹ / tự massage bằng bóng', time:'HOẠT ĐỘNG 5', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        details:['Tennis ball hoặc lacrosse ball là công cụ tự massage tốt nhất cho các điểm khó tiếp cận: lòng bàn chân, bắp chân, vai và lưng trên. Đặt bóng, đổ trọng lực lên và xoay chậm.','Tự massage cơ chân mỗi tối trước ngủ: dùng tay day ấn nhẹ bắp chân theo hướng từ dưới lên (về tim). 5 phút/chân = giảm DOMS và ngủ sâu hơn.','Không có dụng cụ: dùng tay mát-xa nhẹ nhóm cơ vừa tập, kết hợp thở sâu. Không cần kỹ thuật chuyên sâu — áp lực nhẹ + nhất quán là đủ.'],
        points:[{icon:'🎾',label:'Tennis ball đa năng',note:'Lòng bàn chân · bắp chân · vai'},{icon:'🩸',label:'Lưu thông máu',note:'Từ chân lên tim = giảm sưng'},{icon:'😴',label:'Trước khi ngủ',note:'5 phút massage chân → ngủ sâu hơn'},{icon:'💰',label:'Hoàn toàn miễn phí',note:'Chỉ cần tay + kiên nhẫn'}],
        links:[{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'},{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'}] },
    ],
    tipsData: [
      { icon:'💪', name:'"Tập vô hình" — cơ lớn lúc phục hồi', time:'MẸO', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        details:['Cơ không lớn lúc tập gym — cơ lớn lúc nghỉ ngơi và ngủ. Tập = phá vỡ sợi cơ. Nghỉ = tái tạo sợi cơ to hơn trước. Bỏ nghỉ = không có cơ, chỉ có mệt.','Protein synthesis (tổng hợp protein cơ) đạt đỉnh 24–48h SAU tập nặng — đúng trong ngày phục hồi. Đây là "ngày tập vô hình" quan trọng không kém ngày tập gym.','Ngày phục hồi bao gồm: ăn đủ đạm (1.6–2g/kg), ngủ 7–9h, hydration tốt và hoạt động nhẹ nhàng. Thiếu bất kỳ yếu tố nào = kết quả tập giảm đáng kể.'],
        points:[{icon:'💤',label:'Ngủ = xây cơ',note:'GH (growth hormone) tiết ra lúc ngủ sâu'},{icon:'🥩',label:'Đạm đủ 1.6–2g/kg',note:'Nguyên liệu xây cơ — không thể thiếu'},{icon:'💧',label:'Hydration tốt',note:'Cơ 75% là nước — thiếu nước = phục hồi chậm'},{icon:'🔄',label:'Active recovery',note:'Vận động nhẹ tăng lưu thông máu phục hồi'}],
        links:[{icon:'🥗',label:'Dinh Dưỡng',to:'/pillar/b'},{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'}] },
      { icon:'🌬️', name:'Breathing: 4s hít · 4s giữ · 6s thở ra', time:'MẸO', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        details:['Thở ra dài hơn hít vào (tỷ lệ 4:4:6 hoặc 4:6) kích hoạt hệ thần kinh phó giao cảm (rest & digest) — đối lập với giao cảm (fight & flight). Dùng trong ngày phục hồi để thư giãn sâu hơn.','5 phút thở 4-4-6 giảm nhịp tim nghỉ 5–10 bpm và cortisol 15–20% — hiệu quả tương đương 30 phút thiền cho người mới. Kỹ thuật đơn giản nhất trong tất cả breathing exercises.','Thực hành: nằm ngửa, tay lên bụng, hít 4s (bụng phình), giữ 4s, thở ra 6s (bụng xẹp). Lặp 5–10 lần. Cảm giác buồn ngủ sau đó là bình thường và tốt.'],
        points:[{icon:'😌',label:'4:4:6 = PSNS activation',note:'Thở ra dài hơn hít vào = thư giãn'},{icon:'❤️',label:'-5–10 bpm nhịp tim',note:'5 phút thở = hiệu quả ngay lập tức'},{icon:'🛌',label:'Nằm ngửa hiệu quả nhất',note:'Tay trên bụng để cảm nhận thở bụng'},{icon:'😴',label:'Buồn ngủ = tốt',note:'Hệ PSNS hoạt động đúng'}],
        links:[{icon:'🌬️',label:'Kỹ Thuật Thở',to:'/pillar/d/breathing'},{icon:'🧘',label:'Thiền Định',to:'/pillar/d/meditation'}] },
      { icon:'👂', name:'Nghe body signal tốt nhất trong ngày này', time:'MẸO', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        details:['Ngày phục hồi là thời điểm tốt nhất để scan cơ thể: vùng nào còn căng? Khớp nào còn khó chịu? Năng lượng tổng thể như thế nào? Những tín hiệu này hướng dẫn tuần tập tiếp theo.','Phân biệt 3 loại đau: DOMS (đau cơ bình thường, 24–72h sau tập, tự hết) · Acute pain (đau nhọn khi tập, dừng ngay) · Chronic pain (đau dai dẳng >7 ngày, cần bác sĩ).','Body scan 5 phút buổi sáng: nằm yên, quét từ đầu xuống chân, chú ý không phán xét. Kỹ năng này phát triển theo thời gian và giúp tránh chấn thương từ sớm.'],
        points:[{icon:'🔍',label:'Scan từ đầu xuống chân',note:'Chú ý — không phán xét'},{icon:'🚦',label:'3 loại đau',note:'DOMS bình thường · Acute dừng ngay · Chronic → bác sĩ'},{icon:'📅',label:'Hướng dẫn tuần tiếp',note:'Tín hiệu hôm nay = điều chỉnh lịch tập'},{icon:'🧠',label:'Kỹ năng tự nhận thức',note:'Tốt hơn theo thời gian — như học một ngôn ngữ'}],
        links:[{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'},{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'}] },
      { icon:'💧', name:'Uống nhiều nước hơn bình thường', time:'MẸO', color:'#14b8a6', rgb:'20,184,166',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        details:['Ngày sau tập nặng, cơ thể cần thêm nước để: vận chuyển chất dinh dưỡng đến cơ đang phục hồi, loại bỏ sản phẩm chuyển hóa (lactate, creatine) và duy trì thể tích máu.','Mục tiêu: 2–2.5L nước/ngày trong ngày phục hồi (thay vì 1.5–2L ngày thường). Uống đều đặn suốt ngày — không uống 1L một lúc.','Dấu hiệu đủ nước: nước tiểu màu vàng nhạt (như nước chanh nhạt). Vàng đậm = thiếu nước. Trong suốt = uống quá nhiều (hiếm nhưng có thể gây mất điện giải).'],
        points:[{icon:'💧',label:'2–2.5L ngày phục hồi',note:'Cao hơn 20–30% so với ngày thường'},{icon:'⏰',label:'Đều đặn suốt ngày',note:'Không uống dồn — thận xử lý không kịp'},{icon:'🟡',label:'Màu nước tiểu',note:'Vàng nhạt = lý tưởng'},{icon:'⚡',label:'Electrolyte nếu ra nhiều mồ hôi',note:'Thêm muối nhỏ vào nước hoặc uống nước dừa'}],
        links:[{icon:'🥗',label:'Dinh Dưỡng',to:'/pillar/b'},{icon:'🌿',label:'Lối Sống',to:'/pillar/c'}] },
    ],
    avoidData: { icon:'⚠️', name:'Phục hồi có chủ đích ≠ lười biếng', time:'CẢNH BÁO', color:'#14b8a6', rgb:'20,184,166',
      img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      details:['Tâm lý "bỏ tập = thua" là sai lầm phổ biến nhất của người mới. Phục hồi không phải bỏ tập — phục hồi là một buổi tập, chỉ là loại khác.','Overtraining (tập quá nhiều không nghỉ đủ) giảm hiệu suất, tăng nguy cơ chấn thương và gây burnout tâm lý. Elite athlete cũng có 1–2 ngày recovery/tuần trong lịch.','Active recovery (phục hồi tích cực) tốt hơn complete rest: vận động nhẹ tăng lưu thông máu đến cơ, đẩy nhanh loại bỏ chất thải chuyển hóa và giảm cứng cơ.'],
      points:[{icon:'🧠',label:'Mindset quan trọng',note:'Phục hồi = tập — chỉ loại khác'},{icon:'⚡',label:'Overtraining là thật',note:'Hiệu suất giảm khi không nghỉ đủ'},{icon:'🏃',label:'Active > passive rest',note:'Vận động nhẹ phục hồi nhanh hơn nằm im'},{icon:'🏆',label:'Elite athlete cũng nghỉ',note:'Lịch của họ có recovery days như bạn'}],
      links:[{icon:'🌿',label:'Phục Hồi Tích Cực',to:'/pillar/c/recovery'},{icon:'📅',label:'Nhịp Tuần',to:'/pillar/a/weekly'}] },
  },
  {
    img: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=900&q=70',
    intensity: 'Không', duration: 'Tùy ý', sessions: '1×/tuần', rest: 'Hoàn toàn',
    moves: ['Đọc sách / nghe nhạc thư giãn', 'Thiền 10–15 phút', 'Dành thời gian với gia đình', 'Nấu ăn lành mạnh meal prep', 'Lên kế hoạch cho tuần mới'],
    tips: ['Nghỉ không phải thua — đây là khi protein synthesis cao nhất', 'Ngủ 8h+ nếu có thể — golden window tái tạo', 'Review nhật ký tuần: 3 điều tốt, 1 cải thiện', 'Lên kế hoạch thực đơn + lịch tập cho tuần tới'],
    avoid: 'Đừng tập "bù" nếu bỏ buổi — điều chỉnh lịch thay vì tập gấp đôi',
    movesData: [
      { icon:'📚', name:'Đọc sách / nghe nhạc thư giãn', time:'HOẠT ĐỘNG 1', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        details:['Đọc sách 30 phút/ngày giảm căng thẳng 68% theo nghiên cứu Đại học Sussex 2009 — hiệu quả hơn đi bộ (42%), uống trà (54%) và nghe nhạc (61%) cùng thời gian.','Chủ đề cho ngày nghỉ: sách phi hư cấu nhẹ (kỹ năng, lịch sử), tiểu thuyết cuốn hút, hoặc tái đọc sách yêu thích. Tránh sách liên quan công việc để não thực sự nghỉ ngơi.','Môi trường đọc quan trọng: ánh sáng đủ, tư thế thoải mái, không có thông báo điện thoại. 20 phút đọc tập trung > 1 tiếng đọc bị ngắt quãng.'],
        points:[{icon:'😌',label:'-68% stress',note:'Đọc sách hiệu quả hơn yoga hay đi bộ'},{icon:'🧠',label:'Não thực sự nghỉ',note:'Chủ đề nhẹ nhàng — không công việc'},{icon:'📵',label:'Không thông báo',note:'20 phút tập trung > 1h bị ngắt'},{icon:'💡',label:'Audiobook cũng được',note:'Nhắm mắt + audiobook = thiền + học'}],
        links:[{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'},{icon:'💡',label:'Kiến Thức Sức Khỏe',to:'/pillar/e'}] },
      { icon:'🧘', name:'Thiền 10–15 phút', time:'HOẠT ĐỘNG 2', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        details:['10–15 phút thiền ngày nghỉ là "nạp pin" tâm lý cho tuần mới. Thiền không phải không suy nghĩ — mà là nhận ra khi tâm trí đi lạc và nhẹ nhàng quay lại hơi thở.','Sau 8 tuần thiền 10 phút/ngày: gray matter vùng prefrontal cortex dày hơn (liên quan quyết định và tự kiểm soát), amygdala thu nhỏ (liên quan phản ứng stress).','Cách đơn giản nhất: ngồi thoải mái, nhắm mắt, đếm thở từ 1 đến 10, khi bị lạc đếm lại từ 1. 10 phút này là bắt đầu của mọi thứ.'],
        points:[{icon:'🧠',label:'Thay đổi não bộ',note:'Sau 8 tuần — đo được bằng MRI'},{icon:'😌',label:'Không phải "không suy nghĩ"',note:'Nhận ra lạc + quay lại = đúng kỹ thuật'},{icon:'1️⃣',label:'Đếm thở 1–10',note:'Kỹ thuật đơn giản nhất, hiệu quả nhất'},{icon:'⏰',label:'Sáng > tối',note:'Thiền sáng sớm: ngày bắt đầu tốt hơn'}],
        links:[{icon:'🧘',label:'Thiền Định',to:'/pillar/d/meditation'},{icon:'🌬️',label:'Kỹ Thuật Thở',to:'/pillar/d/breathing'}] },
      { icon:'👨‍👩‍👧', name:'Dành thời gian với gia đình', time:'HOẠT ĐỘNG 3', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80',
        details:['Kết nối xã hội mạnh là yếu tố dự đoán tuổi thọ số 1 — quan trọng hơn không hút thuốc, tập thể dục và ăn uống lành mạnh theo nghiên cứu Harvard 80 năm.','Chất lượng hơn số lượng: 30 phút ăn tối không điện thoại với gia đình có giá trị hơn 3 giờ ngồi cùng nhau mà ai cũng nhìn màn hình riêng.','Ngày nghỉ là thời gian tốt nhất để nạp năng lượng xã hội: ăn chung, chơi board game, đi dạo, hoặc nấu ăn cùng nhau. Ký ức tạo ra đây bền hơn kết quả tập gym.'],
        points:[{icon:'❤️',label:'Tuổi thọ #1',note:'Kết nối xã hội quan trọng hơn tập gym'},{icon:'📵',label:'Không điện thoại khi ăn',note:'30 phút present > 3h ngồi cùng'},{icon:'🎲',label:'Hoạt động chung',note:'Nấu ăn · board game · đi dạo'},{icon:'🧠',label:'Nạp năng lượng tinh thần',note:'Introvert hay extrovert đều cần kết nối'}],
        links:[{icon:'🧘',label:'Tâm Trí',to:'/pillar/d'},{icon:'🌿',label:'Lối Sống',to:'/pillar/c'}] },
      { icon:'🥘', name:'Nấu ăn lành mạnh / meal prep', time:'HOẠT ĐỘNG 4', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        details:['45–60 phút meal prep Chủ nhật = 5–7 ngày ăn chuẩn không cần nghĩ. Nấu trước: cơm hoặc ngũ cốc nguyên hạt, protein (thịt/đậu/trứng), rau đã cắt sẵn.','Meal prep không phải nấu sẵn từng bữa — mà là chuẩn bị nguyên liệu để lắp ghép nhanh. 3 hộp protein + 2 hộp ngũ cốc + 1 hộp rau = hàng chục tổ hợp bữa ăn.','Nguyên tắc batch cooking: nấu 1 lần số lượng × 4. Chia hộp, tủ lạnh 4 ngày, tủ đông 2–3 tháng. Tiết kiệm tiền, tiết kiệm thời gian, kiểm soát dinh dưỡng tốt hơn.'],
        points:[{icon:'⏱️',label:'45 phút = 7 ngày ăn chuẩn',note:'Đầu tư thời gian tốt nhất trong tuần'},{icon:'🧩',label:'Nguyên liệu · không bữa',note:'Chuẩn sẵn để lắp ghép linh hoạt'},{icon:'💰',label:'Tiết kiệm chi phí',note:'Ăn ngoài 3× đắt hơn tự nấu'},{icon:'🎯',label:'Kiểm soát macro',note:'Biết mình ăn gì = đạt mục tiêu dễ hơn'}],
        links:[{icon:'🥗',label:'Dinh Dưỡng',to:'/pillar/b'},{icon:'📦',label:'Meal Prep Guide',to:'/pillar/b/mealprep'}] },
      { icon:'📋', name:'Lên kế hoạch cho tuần mới', time:'HOẠT ĐỘNG 5', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        details:['15 phút review + plan cuối tuần tăng tỷ lệ thực hiện kế hoạch tuần tiếp theo lên 70–80% (so với không plan = 30–40%). Não cần hình dung cụ thể để thực hiện.','Review 5 phút: 3 điều tốt tuần qua, 1 điều cần cải thiện, RPE trung bình có hợp lý không. Không phán xét — chỉ quan sát.','Plan 10 phút: ghi lịch tập T2–CN, menu 3–4 bữa cần chuẩn bị, 1 thói quen mới muốn thêm. Cụ thể hơn = tỷ lệ thực hiện cao hơn. "Tập gym" → "Push-up 3×10 lúc 7h sáng T2".'],
        points:[{icon:'📈',label:'+70–80% thực hiện',note:'Plan cụ thể vs không plan'},{icon:'🔍',label:'Review 5 phút trước',note:'3 tốt · 1 cải thiện · RPE check'},{icon:'✏️',label:'Cụ thể = hiệu quả',note:'"7h sáng T2" thay vì "sớm trong tuần"'},{icon:'📓',label:'Viết ra không chỉ nghĩ',note:'Viết = cam kết với bản thân'}],
        links:[{icon:'✅',label:'Daily Checklist',to:'/pillar/f/checklist'},{icon:'📊',label:'Workout Log',to:'/pillar/f/workout-log'}] },
    ],
    tipsData: [
      { icon:'💪', name:'Protein synthesis cao nhất ngày nghỉ', time:'MẸO', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80',
        details:['Protein synthesis (tổng hợp protein cơ) đạt đỉnh 24–48h sau buổi tập nặng — tức là trong ngày nghỉ của bạn. "Ngày nghỉ" thực ra là "ngày cơ lớn nhất".','Để tận dụng protein synthesis: ăn đủ đạm (1.6–2g/kg), phân bổ đều qua 4–5 bữa (20–40g/bữa), ngủ đủ 7–9h. Thiếu 1 trong 3 = giảm kết quả tập đáng kể.','Nghỉ không phải không làm gì — nghỉ là tối ưu hóa phục hồi: đạm đủ + ngủ đủ + stress thấp. Ba yếu tố này quyết định 80% kết quả tập gym.'],
        points:[{icon:'⏰',label:'24–48h sau tập',note:'Đỉnh protein synthesis trong ngày nghỉ'},{icon:'🥩',label:'1.6–2g protein/kg',note:'Không thể xây cơ thiếu nguyên liệu'},{icon:'😴',label:'7–9h ngủ',note:'GH tiết ra lúc ngủ sâu = hormone xây cơ'},{icon:'😌',label:'Stress thấp',note:'Cortisol cao = protein synthesis thấp'}],
        links:[{icon:'🥗',label:'Dinh Dưỡng',to:'/pillar/b'},{icon:'🌿',label:'Phục Hồi',to:'/pillar/c/recovery'}] },
      { icon:'😴', name:'Ngủ 8h+ — golden window tái tạo', time:'MẸO', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
        details:['Ngủ đủ là "siêu năng lực" phục hồi: Growth Hormone (GH) tiết ra 70% trong giấc ngủ sâu (deep sleep), testosterone tăng 10–15% sau 8h ngủ, cortisol giảm xuống baseline.','Chủ nhật là ngày tốt nhất để "trả nợ ngủ": nếu thiếu ngủ cả tuần, 1–2h ngủ thêm Chủ nhật giúp phục hồi 60–70% hiệu suất nhận thức (không thể phục hồi hoàn toàn, nhưng đáng).','Môi trường ngủ tối ưu: phòng mát (18–20°C), tối hoàn toàn, không tiếng ồn. Không điện thoại 30 phút trước ngủ. Giờ ngủ nhất quán quan trọng hơn số giờ ngủ.'],
        points:[{icon:'💪',label:'GH tiết ra 70% khi ngủ',note:'Hormone xây cơ chính — không thể bỏ'},{icon:'🌡️',label:'Phòng mát 18–20°C',note:'Nhiệt độ ảnh hưởng chất lượng ngủ sâu'},{icon:'📵',label:'Không điện thoại 30\'',note:'Blue light ức chế melatonin'},{icon:'⏰',label:'Giờ ngủ nhất quán',note:'Lịch ngủ ổn > tổng giờ ngủ'}],
        links:[{icon:'🌿',label:'Lối Sống & Ngủ',to:'/pillar/c'},{icon:'🌀',label:'Nhịp Sinh Học',to:'/pillar/c/circadian'}] },
      { icon:'📓', name:'Review nhật ký: 3 tốt + 1 cải thiện', time:'MẸO', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        details:['5 phút review cuối tuần với tỷ lệ 3:1 (3 điểm tốt : 1 cải thiện) giúp não học từ thành công, không chỉ từ thất bại. Não có xu hướng ghi nhớ tiêu cực nhiều hơn 3× — 3:1 cân bằng lại.','Câu hỏi review hiệu quả: "Tuần này tôi tự hào nhất điều gì?" · "Tôi đã nhất quán ở đâu?" · "Một điều làm khác đi tuần sau để tốt hơn 1%?"','Viết ra (không chỉ nghĩ) = ghi nhớ tốt hơn 42% và cam kết cao hơn. 5 phút mỗi Chủ nhật xây nên awareness tích lũy theo tháng — không thể thấy ngắn hạn nhưng rõ ràng sau 1 năm.'],
        points:[{icon:'🎯',label:'Tỷ lệ 3:1',note:'3 điểm tốt trước 1 cải thiện'},{icon:'✏️',label:'Viết ra',note:'Viết > nghĩ: +42% ghi nhớ'},{icon:'📈',label:'Cải thiện 1%/tuần',note:'52 tuần × 1% = +67% cuối năm'},{icon:'🔍',label:'3 câu hỏi chuẩn',note:'Tự hào · nhất quán · điều chỉnh'}],
        links:[{icon:'📊',label:'Workout Log',to:'/pillar/f/workout-log'},{icon:'✅',label:'Daily Checklist',to:'/pillar/f/checklist'}] },
      { icon:'📅', name:'Lên kế hoạch thực đơn + lịch tập', time:'MẸO', color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
        details:['Người có kế hoạch bữa ăn tuần trước ăn lành mạnh hơn 42% và chi tiêu ít hơn 25% cho thức ăn so với người quyết định ngẫu hứng mỗi ngày (nghiên cứu 2016).','Kế hoạch lịch tập tuần tới: cụ thể hóa thứ, giờ, bài tập. Không phải "tập T2" mà là "Squat 3×12 + Hinge 3×10 lúc 6h30 T2". Cụ thể = não biết cần chuẩn bị gì.','Kiểm tra lịch tuần trước lên kế hoạch: có meeting dài → đổi buổi tập sang giờ khác. Lên kế hoạch = không bao giờ "không có thời gian" vì đã chặn thời gian trước.'],
        points:[{icon:'🥘',label:'Meal plan = ăn chuẩn hơn 42%',note:'Quyết định trước > quyết định ngẫu hứng'},{icon:'📅',label:'Block thời gian tập',note:'Đặt lịch như meeting — không cancel'},{icon:'🔄',label:'Kiểm tra lịch tuần',note:'Dự đoán xung đột = không miss buổi tập'},{icon:'✏️',label:'Càng cụ thể càng tốt',note:'Thứ + giờ + bài tập = cam kết thật'}],
        links:[{icon:'🥗',label:'Thực Đơn 7 Ngày',to:'/pillar/b/7day'},{icon:'📦',label:'Meal Prep',to:'/pillar/b/mealprep'}] },
    ],
    avoidData: { icon:'⚠️', name:'Đừng tập "bù" nếu bỡ buổi', time:'CẢNH BÁO', color:'#a855f7', rgb:'168,85,247',
      img:'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&q=80',
      details:['Tập "bù" (tập gấp đôi sau khi bỏ) tăng nguy cơ chấn thương, gây burnout tinh thần và tạo mối quan hệ cảm xúc tiêu cực với việc tập luyện. Tuần tốt nhất là tuần nhất quán — không phải tuần có 1 buổi siêu nặng.','Cách đúng khi bỡ buổi: điều chỉnh lịch tuần (đổi T2 → T3), không thêm buổi tập. Tổng 3 buổi/tuần vẫn đạt được — chỉ thay đổi ngày.','Tư duy "không bao giờ bỏ 2 lần liên tiếp" tốt hơn "tập gấp đôi để bù". 1 buổi bỡ = không sao. 2 buổi liên tiếp bỡ = bắt đầu mất thói quen. 3 buổi liên tiếp = phải bắt đầu lại từ đầu.'],
      points:[{icon:'🔄',label:'Điều chỉnh · không tập bù',note:'Đổi ngày · giữ tổng 3 buổi/tuần'},{icon:'🧠',label:'"Không bỏ 2 liên tiếp"',note:'Rule đơn giản nhất để duy trì thói quen'},{icon:'📅',label:'Lịch linh hoạt',note:'T2/T4/T6 chỉ là gợi ý — không phải luật'},{icon:'❤️',label:'Quan hệ tích cực với tập',note:'Tập vì thích · không vì tội lỗi'}],
      links:[{icon:'📅',label:'Nhịp Tuần',to:'/pillar/a/weekly'},{icon:'✅',label:'Daily Checklist',to:'/pillar/f/checklist'}] },
  },
];

const ADJUST_TIPS_DATA = [
  { icon:'⚡', name:'Siêu bận: T2/T4/CN — 3 buổi/tuần', time:'LỰA CHỌN', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
    details:['3 buổi/tuần cách ngày (T2/T4/T7 hoặc T2/T4/CN) là lịch tối thiểu để duy trì và phát triển sức mạnh. Nghiên cứu cho thấy 3 buổi/tuần đạt 80–85% kết quả của 5 buổi/tuần.','Full-body 3×/tuần hiệu quả hơn split 5–6×/tuần cho người bắt đầu và trung cấp: mỗi nhóm cơ được kích thích 3 lần/tuần thay vì 1 lần — tần suất > volume cho người mới.','Khi siêu bận: ưu tiên buổi 20 phút đúng hơn hủy hoàn toàn. 3 buổi 20 phút/tuần nhất quán tốt hơn nhiều so với 2 buổi 1h không đều.'],
    points:[{icon:'📊',label:'3 buổi = 80–85% kết quả 5 buổi',note:'Hiệu quả thời gian tốt nhất'},{icon:'🔄',label:'Full-body > split',note:'Mỗi nhóm cơ 3×/tuần tốt hơn 1×'},{icon:'⏱️',label:'20 phút là đủ',note:'Nhất quán quan trọng hơn thời lượng'},{icon:'📅',label:'T2/T4/CN gợi ý',note:'Bất kỳ 3 ngày cách ngày đều được'}],
    links:[{icon:'📅',label:'Nhịp Tuần',to:'/pillar/a/weekly'},{icon:'⚡',label:'Quick Workouts',to:'/pillar/f/quick-workouts'}] },
  { icon:'🔄', name:'Shift làm việc: linh hoạt ngày', time:'LỰA CHỌN', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    details:['Làm ca không có nghĩa là không thể tập — nghĩa là cần lịch linh hoạt hơn. Quy tắc: duy trì 3–4 buổi/tuần, không cố định ngày trong tuần.','Tập trước hay sau ca đều được — quan trọng là khoảng cách với giờ ngủ: không tập nặng trong vòng 2h trước khi cần ngủ (tăng cortisol, khó ngủ).','Ca đêm đặc biệt: tập nhẹ trước ca (warm-up cơ thể), tập sức mạnh sau ca (khi cơ thể đã "thức") + ngủ ngay sau. Không tập cardio mạnh ngay trước giờ ngủ.'],
    points:[{icon:'📅',label:'3–4 buổi/tuần',note:'Không cần cố định T2/T4/T6'},{icon:'😴',label:'Tránh tập nặng 2h trước ngủ',note:'Cortisol cao → khó ngủ'},{icon:'🌙',label:'Ca đêm: tập nhẹ trước ca',note:'Warm-up cơ thể cho ca làm việc dài'},{icon:'⚙️',label:'Điều chỉnh mỗi tuần',note:'Nhìn lịch làm việc trước · plan sau'}],
    links:[{icon:'📅',label:'Nhịp Tuần',to:'/pillar/a/weekly'},{icon:'🌀',label:'Nhịp Sinh Học',to:'/pillar/c/circadian'}] },
  { icon:'🌱', name:'Mới bắt đầu: 3 buổi/tuần × 20–25 phút', time:'LỰA CHỌN', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    details:['Người mới tập: bắt đầu với ít hơn bạn nghĩ là cần. 3 buổi × 20 phút với body weight đủ để tạo thói quen, đủ kích thích thần kinh cơ, và không gây overtraining.','Tuần 1–2: form trước mọi thứ. Không tăng tải, không tăng reps — chỉ lặp để cơ và thần kinh quen với chuyển động. Cảm giác "dễ quá" là bình thường và tốt.','Tuần 3–4: khi tất cả bài đều cảm thấy kiểm soát tốt, thêm 1 set. Tuần 5+: tăng reps hoặc tải nhẹ. Tiến trình chậm = tiến trình bền vững.'],
    points:[{icon:'🐌',label:'Ít hơn bạn nghĩ',note:'Bắt đầu nhỏ = dễ thành thói quen hơn'},{icon:'🧠',label:'Tuần 1–2: chỉ học form',note:'Thần kinh cơ cần thời gian "học"'},{icon:'📈',label:'Tăng từ tuần 3+',note:'Cảm thấy kiểm soát tốt → mới tăng'},{icon:'💡',label:'Dễ = đang tiến bộ',note:'Cảm giác dễ nghĩa là cơ đang thích nghi'}],
    links:[{icon:'🏃',label:'6 Mẫu Vận Động',to:'/pillar/a/movements'},{icon:'📐',label:'Khung Ngày Tập',to:'/pillar/a/framework'}] },
  { icon:'🚶', name:'Cardio nhẹ: đi bộ đến chỗ làm = NEAT', time:'LỰA CHỌN', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    details:['Tích hợp cardio vào di chuyển hàng ngày = NEAT tự động, không cần thời gian riêng. Đỗ xe cách 500m, đi bộ 10 phút đến trạm xe buýt, leo thang bộ = 30–45 phút "cardio" miễn phí.','NEAT đóng góp 15–30% tổng calorie đốt của người năng động — tương đương 1 buổi tập gym/tuần. Người đứng/đi nhiều trong công việc có TDEE cao hơn 500–700 kcal so với người ngồi.','Không cần quần áo gym, không cần phòng gym, không cần thời gian đặc biệt. Chỉ cần một quyết định nhỏ mỗi lần: cầu thang hay thang máy?'],
    points:[{icon:'🔄',label:'NEAT tự động',note:'Thay đổi thói quen di chuyển · không thêm thời gian'},{icon:'📊',label:'500–700 kcal/ngày',note:'NEAT cao vs NEAT thấp — cùng cân nặng'},{icon:'💰',label:'Hoàn toàn miễn phí',note:'Không phí gym · không trang bị'},{icon:'🧗',label:'Cầu thang luôn',note:'Rule đơn giản nhất để tăng NEAT'}],
    links:[{icon:'🌀',label:'NEAT & Lifestyle',to:'/pillar/c/neat'},{icon:'🌿',label:'Lối Sống',to:'/pillar/c'}] },
];

const SUCCESS_TIPS = [
  { icon:'🔁', title:'Nhất Quán Hơn Cường Độ', desc:'3–5 buổi/tuần đều đặn quan trọng hơn 1 buổi kiệt sức. 20 phút mỗi ngày thắng 2 giờ mỗi tháng.',
    color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    details:[
      'Nhất quán tạo ra thói quen thần kinh (neural habit loop): não bộ ngừng cần ý chí sau 21–66 ngày lặp lại — tập trở thành tự động như đánh răng. Cường độ cao không tạo được điều này.',
      'Nghiên cứu từ James Clear (Atomic Habits): người tập 3 buổi × 20 phút/tuần liên tục 1 năm đạt kết quả vượt trội so với người tập 5 buổi × 60 phút nhưng bỏ sau 3 tháng.',
      'Quy tắc "không bao giờ bỏ 2 lần liên tiếp": 1 buổi bỏ = ổn, 2 buổi liên tiếp = bắt đầu mất thói quen, 3 buổi = phải xây lại từ đầu. Bảo vệ chuỗi quan trọng hơn hoàn hảo.',
    ],
    points:[
      { icon:'🧠', label:'Habit loop thần kinh', note:'21–66 ngày = tập trở thành tự động' },
      { icon:'⏱️', label:'20 phút đủ', note:'Nhất quán > thời lượng trong giai đoạn đầu' },
      { icon:'🔗', label:'Không bỏ 2 liên tiếp', note:'Rule đơn giản nhất để duy trì' },
      { icon:'📅', label:'3 buổi/tuần tối thiểu', note:'Đủ kích thích thích nghi cơ thể' },
    ],
    links:[
      { icon:'📅', label:'Nhịp Tuần', to:'/pillar/a/weekly' },
      { icon:'✅', label:'Daily Checklist', to:'/pillar/f/checklist' },
    ],
  },
  { icon:'📈', title:'Tăng Tải Từ Từ', desc:'Tăng không quá 10% volume/tuần. Quy tắc này ngăn chấn thương và burnout về lâu dài.',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    details:[
      '"10% rule" là nguyên tắc vàng của progressive overload: tăng tổng volume (sets × reps × tạ) không quá 10% mỗi tuần. Vượt ngưỡng này, nguy cơ chấn thương tăng gấp đôi theo nghiên cứu thể thao.',
      'Ví dụ thực tế: tuần này tập 100 "đơn vị" (10 set × 10 reps) → tuần sau tối đa 110. Không tăng tạ + reps + sets cùng lúc — chỉ thay đổi 1 biến mỗi lần.',
      'Deload 1 tuần mỗi tháng (giảm 40% volume): không phải "tập nhẹ" — đây là khi cơ thể supercompensate (phục hồi vượt mức), mạnh hơn trước. Bỏ deload = mất 15–20% kết quả dài hạn.',
    ],
    points:[
      { icon:'📊', label:'Volume = sets×reps×tạ', note:'Đo tổng tuần, không chỉ từng buổi' },
      { icon:'🛑', label:'+10% tối đa/tuần', note:'Vượt ngưỡng = chấn thương gần hơn' },
      { icon:'🔄', label:'Deload 1 tuần/tháng', note:'Supercompensation = mạnh hơn sau nghỉ' },
      { icon:'📝', label:'1 biến/lần', note:'Tạ HOẶC reps HOẶC sets — không cả ba' },
    ],
    links:[
      { icon:'📊', label:'Workout Log', to:'/pillar/f/workout-log' },
      { icon:'📈', label:'Theo Dõi Tiến Bộ', to:'/pillar/a/progress' },
    ],
  },
  { icon:'😴', title:'Ngủ Là Thuốc Phục Hồi', desc:'7–9h mỗi đêm. Cơ lớn lúc ngủ, không phải lúc tập. Thiếu ngủ giảm hiệu suất 20–30%.',
    color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    details:[
      'Growth Hormone (GH) — hormone xây cơ và đốt mỡ chính — tiết ra 70% trong giấc ngủ sâu (slow-wave sleep). Không có ngủ sâu = không có GH = tập gym không có kết quả.',
      'Thiếu ngủ 6h (thay vì 8h) chỉ trong 1 tuần: sức mạnh tối đa giảm 20%, testosterone giảm 10–15%, cortisol tăng 37%, khả năng học kỹ năng vận động giảm 40%.',
      'Tối ưu ngủ không phải chỉ là số giờ: chất lượng quan trọng hơn. Phòng mát 18–20°C, tối hoàn toàn (blackout curtain), không điện thoại 30 phút trước. Giờ ngủ nhất quán = circadian rhythm ổn định.',
    ],
    points:[
      { icon:'💪', label:'GH tiết ra 70% khi ngủ', note:'Hormone xây cơ — không thể thay thế' },
      { icon:'🌡️', label:'Phòng mát 18–20°C', note:'Nhiệt độ ảnh hưởng ngủ sâu' },
      { icon:'📵', label:'Không phone 30 phút trước', note:'Blue light ức chế melatonin' },
      { icon:'⏰', label:'Giờ ngủ nhất quán', note:'±15 phút mỗi ngày = circadian ổn' },
    ],
    links:[
      { icon:'🌿', label:'Lối Sống & Ngủ', to:'/pillar/c' },
      { icon:'🌀', label:'Nhịp Sinh Học', to:'/pillar/c/circadian' },
    ],
  },
  { icon:'🥗', title:'Đạm Đủ Mỗi Ngày', desc:'1.6–2g protein/kg cân nặng. Ưu tiên thực phẩm nguyên chất: trứng, thịt nạc, đậu hũ, sữa chua Hy Lạp.',
    color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    details:[
      'Protein là nguyên liệu duy nhất xây cơ — không có protein đủ, dù tập bao nhiêu cũng không có kết quả. 1.6–2g/kg là dải khuyến nghị từ meta-analysis 49 nghiên cứu (Morton 2018).',
      'Phân bổ đều quan trọng hơn tổng: 4–5 bữa × 20–40g protein/bữa kích thích protein synthesis nhiều hơn 2 bữa × 80g dù cùng tổng lượng. Bữa sáng ≥20g đặc biệt quan trọng.',
      'Nguồn đạm tốt nhất trong ẩm thực Việt: trứng (6g/quả), ức gà (31g/100g), đậu hũ cứng (8–12g/100g), sữa chua Hy Lạp (10g/100g), đậu lăng (9g/100g nấu chín).',
    ],
    points:[
      { icon:'🧮', label:'1.6–2g/kg cân nặng', note:'Ví dụ 65kg → 104–130g đạm/ngày' },
      { icon:'⏰', label:'Phân bổ 4–5 bữa', note:'20–40g/bữa > 1–2 bữa lớn' },
      { icon:'🍳', label:'Bữa sáng ≥20g', note:'Protein sáng = MPS cao cả ngày' },
      { icon:'🇻🇳', label:'Nguồn Việt Nam', note:'Trứng · ức gà · đậu hũ cứng' },
    ],
    links:[
      { icon:'🥗', label:'Dinh Dưỡng', to:'/pillar/b' },
      { icon:'🍱', label:'Thực Đơn 7 Ngày', to:'/pillar/b/7day' },
    ],
  },
  { icon:'📓', title:'Ghi Nhật Ký Tập', desc:'5 phút/buổi: ghi số set, số lần, cảm giác. Nhật ký cho bạn thấy tiến bộ mà mắt thường không thấy.',
    color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
    details:[
      'Nhật ký tập là "bản đồ tiến bộ" — không có nó, bạn đang lái xe mà không có GPS. Người ghi nhật ký đạt mục tiêu thể chất nhanh hơn 42% so với người không ghi (nghiên cứu AJPH 2012).',
      'Tối thiểu cần ghi: bài tập · tạ · set/reps · RPE (1–10) · cảm giác chung. 5 phút ngay sau tập khi còn nhớ — không để đến hôm sau. Dùng app (Strong, Hevy) hoặc sổ tay đều được.',
      'Cách dùng nhật ký: review 4 tuần/lần. RPE liên tục 7–8 → có thể tăng tải. RPE liên tục 9–10 → cần giảm volume hoặc deload. Stagnation (không tiến) → đổi rep range hoặc bài tập.',
    ],
    points:[
      { icon:'🎯', label:'42% nhanh hơn đạt mục tiêu', note:'Người ghi nhật ký vs không ghi' },
      { icon:'📱', label:'App hoặc sổ tay', note:'Strong · Hevy · sổ tay — không quan trọng' },
      { icon:'⏱️', label:'5 phút ngay sau tập', note:'Khi còn nhớ — không để hôm sau' },
      { icon:'🔍', label:'Review 4 tuần/lần', note:'Tìm pattern để điều chỉnh thông minh' },
    ],
    links:[
      { icon:'📊', label:'Workout Log', to:'/pillar/f/workout-log' },
      { icon:'🔬', label:'Progress Test', to:'/pillar/f/progress-test' },
    ],
  },
  { icon:'🧠', title:'Kiên Nhẫn Với Kết Quả', desc:'Kết quả thực sự đến sau 4–8 tuần nhất quán. Những tuần đầu là não đang học — không phải lười biếng.',
    color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    details:[
      'Tuần 1–3: cơ thể đang xây "neural pathways" mới — không phải tạo cơ mới mà là dạy não bộ cách điều khiển cơ hiệu quả hơn. Cảm giác vẫn "yếu" là bình thường và là bước cần thiết.',
      'Tuần 4–6: "neuromuscular adaptation" hoàn chỉnh — lực tăng 20–40% mà không cần cơ lớn hơn. Đây là lý do người mới tập thấy mạnh hơn rất nhanh trong 6 tuần đầu.',
      'Tuần 7+: hypertrophy (tăng kích thước cơ) bắt đầu rõ. Body composition thay đổi thấy được. Nhưng cần ít nhất 12 tuần nhất quán để người khác nhận ra sự thay đổi.',
    ],
    points:[
      { icon:'⚡', label:'Tuần 1–3: não học trước', note:'Neural pathways — không phải cơ tăng' },
      { icon:'💪', label:'Tuần 4–6: mạnh hơn 20–40%', note:'Neuromuscular adaptation đầy đủ' },
      { icon:'📅', label:'12 tuần: thấy rõ', note:'Người khác nhận ra sau 3 tháng' },
      { icon:'🔬', label:'Test 4 tuần/lần', note:'Đo để thấy tiến bộ trước khi thấy được' },
    ],
    links:[
      { icon:'🗺️', label:'Lộ Trình 12 Tuần', to:'/program' },
      { icon:'🔬', label:'Progress Test', to:'/pillar/f/progress-test' },
    ],
  },
];

const PROGRESS_KEY = 'healthapp_progress_test';

const PROGRESS_ROWS = [
  { metric:'Sức Bền Tim Mạch', test:'Đi bộ nhanh 6 phút', unit:'m',
    icon:'❤️', color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    name:'Sức Bền Tim Mạch', time:'BÀI TEST',
    details:[
      'Bài test đi bộ nhanh 6 phút (6MWT) là tiêu chuẩn y tế quốc tế để đánh giá sức bền tim mạch — được dùng trong lâm sàng và nghiên cứu thể thao. Đơn giản, không cần thiết bị, chính xác.',
      'Cách thực hiện: tìm đường thẳng hoặc vỉa hè bằng phẳng, đi nhanh nhất có thể trong đúng 6 phút (không chạy), đo tổng quãng đường. Mặc quần áo thoải mái, giày đế bằng.',
      'Mục tiêu cải thiện: người mới tập thường tăng 50–150m sau 4 tuần nhất quán. Tuần 12: tăng 150–300m là kết quả tốt. Người trẻ bình thường: 500–700m/6 phút.',
    ],
    points:[
      { icon:'📏', label:'Đo quãng đường', note:'Càng xa trong 6 phút = tim mạch tốt hơn' },
      { icon:'🚶', label:'Đi nhanh nhất có thể', note:'Không chạy — đi nhanh tối đa' },
      { icon:'📈', label:'+50–150m sau 4 tuần', note:'Mục tiêu cải thiện thực tế' },
      { icon:'⏰', label:'Test sáng sớm', note:'Sau khi thức dậy, trước ăn sáng' },
    ],
    links:[
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
      { icon:'🏃', label:'Khung Ngày Tập', to:'/pillar/a/framework' },
    ],
  },
  { metric:'Sức Mạnh Thân Trên', test:'Push-up tối đa liên tiếp', unit:'lần',
    icon:'💪', color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    name:'Sức Mạnh Thân Trên', time:'BÀI TEST',
    details:[
      'Push-up tối đa liên tiếp (không dừng) là test sức mạnh thân trên đơn giản và đáng tin cậy nhất. Đo sức mạnh cơ ngực, vai, tam đầu và khả năng stabilize lõi cùng lúc.',
      'Cách thực hiện: tư thế push-up chuẩn (lưng thẳng, lõi cứng), thực hiện liên tiếp không nghỉ đến khi không thể thêm 1 rep hoàn chỉnh nữa. Không tính rep có lưng cong hoặc hông chảy.',
      'Chuẩn tham chiếu: nam 30 tuổi ≥25 rep = tốt, ≥35 = rất tốt. Nữ 30 tuổi ≥15 rep = tốt, ≥25 = rất tốt. Người mới thường tăng 5–15 rep sau 8 tuần tập đúng.',
    ],
    points:[
      { icon:'📐', label:'Form hoàn chỉnh bắt buộc', note:'Không đếm rep sai tư thế' },
      { icon:'💪', label:'Ngực · vai · tam đầu', note:'3 nhóm cơ thân trên đo cùng lúc' },
      { icon:'🔢', label:'Nam ≥25 · Nữ ≥15 = tốt', note:'Chuẩn tham chiếu tuổi 30' },
      { icon:'📈', label:'+5–15 rep/8 tuần', note:'Mục tiêu cải thiện thực tế' },
    ],
    links:[
      { icon:'🏃', label:'6 Mẫu Vận Động', to:'/pillar/a/movements' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Sức Mạnh Hạ Chi', test:'Đứng lên ngồi xuống 1 phút', unit:'lần',
    icon:'🦵', color:'#22c55e', rgb:'34,197,94',
    img:'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
    name:'Sức Mạnh Hạ Chi', time:'BÀI TEST',
    details:[
      'Bài test đứng lên ngồi xuống 1 phút (Chair Stand Test) đo sức mạnh đùi, mông và khả năng phối hợp thần kinh cơ hạ chi. Đây là chỉ số dự đoán nguy cơ té ngã và chất lượng cuộc sống dài hạn.',
      'Cách thực hiện: ngồi trên ghế không có tay vịn (cao 43–46cm), tay khoanh trước ngực, đứng lên ngồi xuống hoàn toàn càng nhiều lần càng tốt trong đúng 1 phút.',
      'Chuẩn tham chiếu: nam 30 tuổi ≥23 lần = tốt. Nữ 30 tuổi ≥21 lần = tốt. Người mới tập thường tăng 5–10 lần/phút sau 8 tuần. Dưới 14 lần/phút là ngưỡng cảnh báo sức khỏe.',
    ],
    points:[
      { icon:'🪑', label:'Ghế không tay vịn', note:'Cao 43–46cm là chuẩn' },
      { icon:'🦵', label:'Đùi + mông + balance', note:'3 yếu tố hạ chi được đo cùng lúc' },
      { icon:'📊', label:'Nam ≥23 · Nữ ≥21/phút', note:'Chuẩn tham chiếu tuổi 30' },
      { icon:'⚠️', label:'<14 lần/phút = cảnh báo', note:'Nguy cơ té ngã và chấn thương cao' },
    ],
    links:[
      { icon:'🏃', label:'6 Mẫu Vận Động', to:'/pillar/a/movements' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Linh Hoạt', test:'Cúi chạm ngón chân', unit:'Không/Có',
    icon:'🤸', color:'#14b8a6', rgb:'20,184,166',
    img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    name:'Linh Hoạt', time:'BÀI TEST',
    details:[
      'Sit-and-Reach Test (cúi với ngón tay chạm đất khi duỗi thẳng chân) đo độ linh hoạt cơ đùi sau (hamstring) và lưng dưới — hai vùng cứng nhất ở người ngồi nhiều, liên quan trực tiếp đến đau lưng.',
      'Cách thực hiện: ngồi trên sàn, chân duỗi thẳng, từ từ cúi người ra trước trong 3 giây, đến điểm tối đa mà không cong gối. Kết quả: Có = tay chạm hoặc vượt qua ngón chân. Không = tay dừng trước ngón chân.',
      'Từ "Không" → "Có" thường mất 4–8 tuần giãn tĩnh đều đặn (30 giây × 2 lần/buổi tập). Đây là một trong những cải thiện có thể thấy sớm nhất — động lực tốt cho người mới.',
    ],
    points:[
      { icon:'🦵', label:'Hamstring + lưng dưới', note:'Hai vùng cứng nhất ở người ngồi nhiều' },
      { icon:'🐢', label:'Cúi chậm 3 giây', note:'Không nảy — giãn tĩnh mới có tác dụng' },
      { icon:'📅', label:'4–8 tuần → thấy kết quả', note:'Một trong những cải thiện nhanh nhất' },
      { icon:'💺', label:'Liên quan đau lưng', note:'Hamstring cứng → kéo chậu trước → đau lưng' },
    ],
    links:[
      { icon:'🌿', label:'Phục Hồi Tích Cực', to:'/pillar/c/recovery' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Cân Nặng', test:'Cân buổi sáng chưa ăn', unit:'kg',
    icon:'⚖️', color:'#84cc16', rgb:'132,204,22',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    name:'Cân Nặng', time:'BÀI TEST',
    details:[
      'Cân sáng sớm (sau khi đi vệ sinh, trước khi ăn uống) là thời điểm chính xác nhất và nhất quán nhất để theo dõi cân nặng. Có thể dao động 1–2.5kg trong ngày tùy nước, thức ăn.',
      'Đừng bị ám ảnh bởi số cân hàng ngày — cân trọng lượng dao động là bình thường. Theo dõi xu hướng 7–14 ngày: trung bình tuần này so với tuần trước mới có ý nghĩa.',
      'Cân nặng chỉ là 1 trong 6 chỉ số — không phải chỉ số duy nhất. Người tập sức mạnh có thể cân nặng không giảm nhưng body composition (tỷ lệ cơ/mỡ) cải thiện rõ rệt. Kết hợp với vòng eo để có bức tranh đầy đủ hơn.',
    ],
    points:[
      { icon:'⏰', label:'Sáng sớm nhất quán', note:'Sau WC, trước ăn — cùng điều kiện' },
      { icon:'📊', label:'Xu hướng 7–14 ngày', note:'Trung bình tuần quan trọng hơn ngày' },
      { icon:'⚖️', label:'Dao động ±1–2.5kg bình thường', note:'Nước + thức ăn trong đường tiêu hóa' },
      { icon:'🔗', label:'Kết hợp với vòng eo', note:'2 chỉ số cùng nhau = bức tranh rõ hơn' },
    ],
    links:[
      { icon:'🥗', label:'Dinh Dưỡng & TDEE', to:'/pillar/b' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Vòng Eo', test:'Đo sau thở ra tự nhiên', unit:'cm',
    icon:'📏', color:'#f97316', rgb:'249,115,22',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    name:'Vòng Eo', time:'BÀI TEST',
    details:[
      'Vòng eo là chỉ số sức khỏe tim mạch và chuyển hóa quan trọng hơn cân nặng. Mỡ nội tạng (visceral fat) quanh eo liên quan trực tiếp đến tiểu đường type 2, bệnh tim và huyết áp cao.',
      'Cách đo chuẩn: thở ra tự nhiên (không hút bụng, không phình bụng), đặt thước dây ngang rốn hoặc điểm giữa xương sườn thấp nhất và xương chậu, đọc số khi thở ra xong.',
      'Ngưỡng nguy cơ: nam >90cm, nữ >80cm là ngưỡng cảnh báo WHO (châu Á). Mục tiêu giảm 1–2cm/tháng với tập luyện + ăn đúng là thực tế và bền vững.',
    ],
    points:[
      { icon:'⚠️', label:'Nam >90 · Nữ >80cm', note:'Ngưỡng nguy cơ WHO cho châu Á' },
      { icon:'🫁', label:'Thở ra tự nhiên khi đo', note:'Không hút bụng — đo thực chất' },
      { icon:'📉', label:'Giảm 1–2cm/tháng', note:'Mục tiêu thực tế và bền vững' },
      { icon:'❤️', label:'Tim mạch + chuyển hóa', note:'Mỡ nội tạng nguy hiểm hơn mỡ dưới da' },
    ],
    links:[
      { icon:'🥗', label:'Dinh Dưỡng', to:'/pillar/b' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Nhịp Tim Lúc Nghỉ', test:'Sau nằm yên 5 phút', unit:'bpm',
    icon:'❤️', color:'#3b82f6', rgb:'59,130,246',
    img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    name:'Nhịp Tim Lúc Nghỉ', time:'BÀI TEST',
    details:[
      'Resting Heart Rate (RHR) là chỉ số sức khỏe tim mạch đơn giản và mạnh nhất. Tim hiệu quả hơn = bơm nhiều máu hơn mỗi nhịp = cần ít nhịp hơn để cung cấp oxy. RHR giảm = tim mạnh hơn.',
      'Cách đo chuẩn: nằm yên tĩnh 5 phút (không nói chuyện, không nhìn điện thoại), dùng ngón trỏ và giữa đặt lên mạch cổ tay hoặc cổ, đếm trong 60 giây. Buổi sáng sớm khi vừa thức dậy là chính xác nhất.',
      'Chuẩn tham chiếu: 60–80 bpm bình thường. <60 bpm = tim mạch tốt (VĐV thường 40–60). >100 bpm lúc nghỉ = tachycardia, cần kiểm tra. Người tập cardio đều đặn có thể giảm RHR 5–15 bpm sau 8–12 tuần.',
    ],
    points:[
      { icon:'💓', label:'60–80 bpm bình thường', note:'<60 = tim khỏe · >100 = cần kiểm tra' },
      { icon:'📉', label:'-5–15 bpm/8–12 tuần', note:'Kết quả từ cardio đều đặn' },
      { icon:'⏰', label:'Sáng sớm chính xác nhất', note:'Sau thức dậy, trước uống cà phê' },
      { icon:'📱', label:'Smartwatch tiện nhất', note:'Đo tự động liên tục khi ngủ' },
    ],
    links:[
      { icon:'🌿', label:'Lối Sống', to:'/pillar/c' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
  { metric:'Chất Lượng Ngủ', test:'Tự đánh giá 1–10', unit:'điểm',
    icon:'😴', color:'#a855f7', rgb:'168,85,247',
    img:'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    name:'Chất Lượng Ngủ', time:'BÀI TEST',
    details:[
      'Chất lượng ngủ tự đánh giá (1–10) là chỉ số chủ quan nhưng có giá trị: tương quan cao với hiệu suất tập luyện, cảm xúc và năng suất ngày hôm sau. Nghiên cứu cho thấy tự đánh giá chính xác hơn số giờ ngủ đơn thuần.',
      'Thang đánh giá: 1–3 = ngủ rất kém (thức nhiều lần, mệt khi dậy), 4–6 = trung bình (thức 1–2 lần hoặc dậy không tươi), 7–8 = tốt (ngủ sâu, dậy tỉnh táo), 9–10 = xuất sắc (tràn đầy năng lượng khi thức dậy).',
      'Mục tiêu: điểm trung bình 7+ liên tục 2 tuần. 3 yếu tố cải thiện nhanh nhất: giờ ngủ nhất quán (±15 phút), phòng mát và tối, không nhìn màn hình 30 phút trước ngủ.',
    ],
    points:[
      { icon:'🎯', label:'Mục tiêu ≥7/10', note:'Trung bình 2 tuần liên tiếp' },
      { icon:'⏰', label:'Giờ ngủ nhất quán', note:'±15 phút mỗi ngày = cải thiện nhanh nhất' },
      { icon:'🌡️', label:'Phòng mát + tối', note:'18–20°C + blackout = ngủ sâu hơn' },
      { icon:'📵', label:'No screen 30 phút trước', note:'Blue light ức chế melatonin' },
    ],
    links:[
      { icon:'🌀', label:'Nhịp Sinh Học', to:'/pillar/c/circadian' },
      { icon:'🔬', label:'Progress Test Tool', to:'/pillar/f/progress-test' },
    ],
  },
];

// ── Journey config ───────────────────────────────────────────────────────────
// ── Quick link cards data ────────────────────────────────────────────────────
const QUICK_LINKS_DATA = [
  { to:'/pillar/a',         icon:'🏃', color:'#22c55e', rgb:'34,197,94',
    label:'Vận Động & Tập Luyện', sub:'6 mẫu · Khung ngày · Lộ trình',
    img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    desc:'Từ 6 chuyển động cơ bản đến lộ trình 12 tuần cá nhân hóa — hướng dẫn đầy đủ cho người mới và người muốn nâng cấp.',
    details:[
      '6 chuyển động cơ bản (Squat, Hinge, Push, Pull, Core, Thở) là ngôn ngữ của cơ thể — mastering chúng trước khi thêm bất kỳ thứ gì khác là cách tiếp cận hiệu quả và an toàn nhất.',
      'Khung ngày tập chuẩn: 5 phút khởi động + 20–30 phút chính + 5–10 phút giãn cơ + 5 phút mind reset. Cấu trúc này tối ưu hóa hiệu quả và phục hồi trong mỗi buổi tập.',
      'Lộ trình 12 tuần chia 3 giai đoạn rõ ràng với bài test tiến độ mỗi 4 tuần — không đoán mò, đo lường được, điều chỉnh theo kết quả thực tế.',
    ],
    points:[
      {icon:'🏋',label:'6 chuyển động cơ bản',note:'Nền tảng của mọi chương trình tập'},
      {icon:'⏱',label:'Khung ngày chuẩn',note:'5\' khởi động + 20–30\' chính + giãn'},
      {icon:'📅',label:'Lộ trình 12 tuần',note:'3 giai đoạn · test tiến độ định kỳ'},
      {icon:'📊',label:'Nhịp tuần',note:'3 sức mạnh + 2 cardio + 2 recovery'},
    ],
  },
  { to:'/pillar/b/roadmap', icon:'🥗', color:'#84cc16', rgb:'132,204,22',
    label:'Lộ Trình Dinh Dưỡng', sub:'12 tuần · Macro · Meal prep',
    img:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    desc:'Hệ thống dinh dưỡng 12 tuần: từ đĩa ăn cơ bản đến macro và meal prep nâng cao — không kiêng khem, chỉ ăn thông minh hơn.',
    details:[
      '12 tuần dinh dưỡng không phải về kiêng khem — mà về ăn đủ và ăn đúng: đủ đạm để xây cơ, đủ carb để có năng lượng, đủ chất xơ để hệ tiêu hóa khỏe mạnh.',
      '3 giai đoạn: Tuần 1–4 (học công thức đĩa cơ bản) → Tuần 5–8 (tính TDEE và theo dõi macro) → Tuần 9–12 (meal prep và cá nhân hóa hoàn toàn).',
      'Tích hợp TDEE calculator cá nhân hóa — nhập cân nặng, chiều cao, tuổi và mức vận động để nhận kế hoạch phù hợp với nhu cầu calo và macro của riêng bạn.',
    ],
    points:[
      {icon:'🍽',label:'Công thức đĩa ăn',note:'½ rau · ¼ đạm · ¼ tinh bột'},
      {icon:'🔢',label:'TDEE calculator',note:'Cá nhân hóa calo & macro'},
      {icon:'📦',label:'Meal prep guide',note:'45 phút/tuần cho 5–7 ngày ăn chuẩn'},
      {icon:'📈',label:'Tăng dần theo tuần',note:'Không cú sốc — điều chỉnh từng bước'},
    ],
  },
  { to:'/pillar/b/7day',    icon:'📅', color:'#84cc16', rgb:'132,204,22',
    label:'Thực Đơn 7 Ngày', sub:'Bữa ăn theo ngày · Shopping list',
    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    desc:'Thực đơn 7 ngày chi tiết từng bữa với shopping list sẵn sàng — sao chép và nấu, không cần nghĩ gì thêm.',
    details:[
      '7 ngày thực đơn chi tiết sáng · trưa · tối với kcal và macro đã tính sẵn. Template rõ ràng để làm theo ngay — phù hợp nhất cho người mới bắt đầu.',
      'Shopping list đi kèm tổng hợp tất cả nguyên liệu cho cả tuần — 1 lần đi chợ là đủ. Không phải sáng nào cũng phải nghĩ "hôm nay ăn gì".',
      'Thực đơn đa dạng hóa — không ăn lặp > 2 lần/tuần cho cùng một món. Đủ đạm, đủ rau, phù hợp ẩm thực Việt Nam hàng ngày.',
    ],
    points:[
      {icon:'🍳',label:'3 bữa/ngày × 7 ngày',note:'21 bữa có sẵn macro & kcal'},
      {icon:'🛒',label:'Shopping list',note:'1 lần đi chợ cho cả tuần'},
      {icon:'🇻🇳',label:'Ẩm thực Việt Nam',note:'Nguyên liệu quen thuộc trong nước'},
      {icon:'🔄',label:'Không lặp > 2 lần',note:'Đa dạng dinh dưỡng mỗi ngày'},
    ],
  },
  { to:'/pillar/c/roadmap', icon:'🌿', color:'#14b8a6', rgb:'20,184,166',
    label:'Lối Sống 12 Tuần', sub:'Ngủ · NEAT · Nhịp sinh học',
    img:'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80',
    desc:'Lộ trình lối sống 12 tuần — tối ưu giấc ngủ, tăng vận động tự nhiên và đồng bộ với nhịp sinh học.',
    details:[
      'Ngủ là "siêu năng lực" của sức khỏe — 12 tuần lối sống bắt đầu từ tối ưu giấc ngủ: giờ ngủ nhất quán, phòng mát tối, không blue light. Mọi thứ khác hiệu quả hơn khi ngủ đủ.',
      'NEAT (Non-Exercise Activity Thermogenesis) — vận động không phải tập gym: đi bộ, đứng, cầu thang — có thể đốt 300–500 kcal/ngày ở người năng động. Tăng NEAT dễ hơn tăng thời gian tập gym.',
      'Nhịp sinh học (circadian rhythm) điều chỉnh hormone, năng lượng và mood. Lộ trình giúp đồng bộ lịch sinh hoạt với đồng hồ sinh học để tối ưu hóa tự nhiên — không cần thay đổi quá nhiều.',
    ],
    points:[
      {icon:'😴',label:'Tối ưu giấc ngủ',note:'Phòng mát · tối · giờ nhất quán'},
      {icon:'🚶',label:'Tăng NEAT',note:'300–500 kcal/ngày từ vận động tự nhiên'},
      {icon:'🔄',label:'Nhịp sinh học',note:'Đồng bộ lịch sinh hoạt với circadian'},
      {icon:'📱',label:'Digital wellness',note:'Quản lý screen time & dopamine'},
    ],
  },
  { to:'/pillar/d/roadmap', icon:'🧘', color:'#a855f7', rgb:'168,85,247',
    label:'Tâm Trí 12 Tuần', sub:'Thiền · Thở · Journaling',
    img:'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    desc:'Lộ trình tâm trí 12 tuần — giảm stress, tăng tập trung và xây khả năng tự nhận thức bằng 3 công cụ: thiền, thở và nhật ký.',
    details:[
      'Thiền không phải "không suy nghĩ" — mà là luyện nhận ra khi tâm trí đi lạc và nhẹ nhàng quay lại. 5 phút/ngày đủ thay đổi gray matter vùng prefrontal cortex sau 8 tuần.',
      'Hơi thở là công cụ duy nhất kiểm soát ý thức và tác động trực tiếp đến hệ thần kinh tự trị. Box breathing (4s–4s–4s–4s) giảm cortisol và nhịp tim trong dưới 30 giây.',
      'Journaling 3 dòng tối — viết ra "unfinished business" — giúp não "đóng tab", giảm mental chatter trước ngủ và tăng chất lượng học từ trải nghiệm hàng ngày.',
    ],
    points:[
      {icon:'🧘',label:'Thiền 5 phút/ngày',note:'Thay đổi não bộ sau 8 tuần'},
      {icon:'🫁',label:'Box breathing',note:'4s–4s–4s–4s — giảm cortisol <30s'},
      {icon:'📓',label:'Journaling 3 dòng',note:'Đóng tab não — ngủ sâu hơn'},
      {icon:'🎯',label:'Đặt ý định sáng',note:'RAS activation — tỷ lệ thực hiện +91%'},
    ],
  },
  { to:'/pillar/f/roadmap', icon:'🛠️', color:'#f97316', rgb:'249,115,22',
    label:'Lộ Trình Công Cụ', sub:'Checklist · Tracker · Test',
    img:'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&q=80',
    desc:'Bộ công cụ theo dõi tiến độ đầy đủ: checklist hàng ngày, tracker tuần và bài test 4 tuần — đo lường thật để tiến bộ thật.',
    details:[
      'Checklist hàng ngày gồm 5 mục cốt lõi: tập đủ không, ăn đủ đạm không, uống đủ nước không, ngủ trước 23h không, thực hành tâm trí không. Tích vào cuối ngày = awareness thật sự.',
      'Tracker tuần giúp nhìn pattern: tuần nào tập đủ, tuần nào thiếu, lý do tại sao — dữ liệu này quan trọng hơn cảm giác "hình như tôi đang tốt hơn".',
      'Bài test 4 tuần: 5 chỉ số đo được — Plank tĩnh, Push-up tối đa, Squat 1 phút, Đi bộ 1km, chu vi eo. Số liệu thật → điều chỉnh thật → tiến bộ thật.',
    ],
    points:[
      {icon:'✅',label:'Checklist hàng ngày',note:'5 mục cốt lõi · tích vào cuối ngày'},
      {icon:'📊',label:'Tracker theo tuần',note:'Pattern > cảm giác chủ quan'},
      {icon:'📈',label:'Test 4 tuần',note:'Plank · Push-up · Squat · 1km · eo'},
      {icon:'🎯',label:'Dữ liệu thật',note:'Đo lường → điều chỉnh → tiến bộ'},
    ],
  },
];

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

// ── DailyBlockModal (shared for DAILY_BLOCKS + DAILY_PRINCIPLES) ─────────────
function DailyBlockModal({ block, onClose }) {
  const { t: tCommon } = useTranslation('common');
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${block.rgb},0.28)`, boxShadow: `0 0 80px rgba(${block.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={block.img} alt={block.name} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${block.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${block.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${block.rgb},0.18)`, border: `2px solid rgba(${block.rgb},0.4)` }}>
              {block.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: block.color }}>{block.time || tCommon('program.principle_tag', 'NGUYÊN TẮC')}</p>
              <h2 className="font-bold text-white text-lg leading-tight max-w-xs">{block.name || block.text}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        {/* Content */}
        <div className="p-5 md:p-7">
          <ul className="space-y-2.5 mb-5">
            {block.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${block.rgb},0.14)`, color: block.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          {/* Quick links */}
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${block.rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${block.rgb},0.5)` }}>Khám Phá Chi Tiết</p>
            <div className="flex flex-wrap gap-2">
              {block.links.map((lk, li) => (
                <Link key={li} to={lk.to} onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                  style={{ color: block.color, background: `rgba(${block.rgb},0.1)`, border: `1px solid rgba(${block.rgb},0.22)` }}>
                  <span>{lk.icon}</span> {lk.label} →
                </Link>
              ))}
            </div>
          </div>
          {/* Key points */}
          <div className="grid grid-cols-2 gap-2.5">
            {block.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${block.rgb},0.06)`, border: `1px solid rgba(${block.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── Pillar Assets for Phase Modal ────────────────────────────────────────────
const PILLAR_ASSETS = {
  A: {
    img: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
    points: [
      { icon: '🏋️', label: 'Form trước volume', note: 'Kỹ thuật đúng từ đầu = an toàn lâu dài' },
      { icon: '⏱️', label: '20–25 phút đủ', note: 'Thời gian không phải yếu tố quyết định' },
      { icon: '🔄', label: 'Khởi động bắt buộc', note: '5 phút warm-up giảm 80% chấn thương' },
      { icon: '📝', label: 'Workout Log', note: 'Ghi lại buổi tập = thấy tiến bộ rõ ràng' },
    ],
    links: [
      { icon: '🏃', label: '6 Mẫu Vận Động', to: '/pillar/a/movements' },
      { icon: '📐', label: 'Khung Ngày Tập', to: '/pillar/a/framework' },
      { icon: '📅', label: 'Nhịp Tuần', to: '/pillar/a/weekly' },
      { icon: '📈', label: 'Theo Dõi Tiến Bộ', to: '/pillar/a/progress' },
    ],
  },
  B: {
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    points: [
      { icon: '🍽️', label: 'Đĩa ăn chuẩn', note: '½ rau · ¼ đạm · ¼ tinh bột mỗi bữa' },
      { icon: '💧', label: 'Uống đủ nước', note: '1.8–2L/ngày = chuyển hóa tốt hơn rõ rệt' },
      { icon: '🥩', label: 'Đạm mỗi bữa', note: '1 lòng bàn tay đạm = đủ no + giữ cơ' },
      { icon: '🚫', label: 'Giảm đồ ngọt', note: 'Không cần cắt hoàn toàn — giảm dần là đủ' },
    ],
    links: [
      { icon: '🍽️', label: 'Đĩa Ăn & Khẩu Phần', to: '/pillar/b/content' },
      { icon: '🥩', label: 'Protein Guide', to: '/pillar/b/protein' },
      { icon: '🧮', label: 'Tính TDEE (B0)', to: '/pillar/b' },
      { icon: '📋', label: 'Thực Đơn 7 Ngày', to: '/pillar/b/7day' },
    ],
  },
  C: {
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    points: [
      { icon: '🌙', label: 'Ngủ trước 23h', note: 'Giấc ngủ = thuốc phục hồi hiệu quả nhất' },
      { icon: '📵', label: 'Không phone', note: '30\' trước ngủ = melatonin tăng tự nhiên' },
      { icon: '👟', label: '7.500 bước/ngày', note: 'NEAT thấp làm giảm TDEE đáng kể' },
      { icon: '☀️', label: 'Ánh nắng sáng', note: 'Reset đồng hồ sinh học mỗi sáng' },
    ],
    links: [
      { icon: '🌙', label: 'Tối Ưu Giấc Ngủ', to: '/pillar/c/sleep' },
      { icon: '🌅', label: 'Nhịp Sinh Học', to: '/pillar/c/circadian' },
      { icon: '👟', label: 'NEAT & Bước Chân', to: '/pillar/c/neat' },
      { icon: '🌬️', label: 'Thở & Hồi Phục', to: '/pillar/c/breathing' },
    ],
  },
  D: {
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    points: [
      { icon: '🌬️', label: '3 hơi thở sâu', note: 'Kích hoạt hệ thần kinh phó giao cảm' },
      { icon: '📖', label: 'Nhật ký 3 dòng', note: 'Clarify tư duy + build gratitude mỗi tối' },
      { icon: '📦', label: 'Box breathing', note: '4-4-4-4 = giảm cortisol tức thì' },
      { icon: '🧠', label: 'Awareness đầu tiên', note: 'Nhận ra trạng thái = bước đầu kiểm soát' },
    ],
    links: [
      { icon: '🌬️', label: 'Kỹ Thuật Thở', to: '/pillar/d/breathing' },
      { icon: '📖', label: 'Viết Nhật Ký', to: '/pillar/d/journaling' },
      { icon: '🧘', label: 'Thiền Định', to: '/pillar/d/meditation' },
      { icon: '🧠', label: 'Quản Lý Căng Thẳng', to: '/pillar/d/stress' },
    ],
  },
  F: {
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    points: [
      { icon: '✅', label: 'Daily Checklist', note: 'Habit tracker trực quan mỗi ngày' },
      { icon: '📊', label: 'Workout Log', note: 'Data → pattern → cải thiện có hướng' },
      { icon: '🔬', label: 'Baseline Test', note: 'Điểm xuất phát = tiêu chuẩn so sánh' },
      { icon: '🔄', label: 'Weekly Review', note: '10 phút review = 10x hiệu quả tuần sau' },
    ],
    links: [
      { icon: '✅', label: 'Daily Checklist', to: '/pillar/f/checklist' },
      { icon: '📊', label: 'Workout Log', to: '/pillar/f/workout-log' },
      { icon: '🔬', label: 'Progress Test', to: '/pillar/f/progress-test' },
      { icon: '📈', label: 'Health Score', to: '/pillar/f/health-score' },
    ],
  },
};

// ── PillarPhaseModal ──────────────────────────────────────────────────────────
function PillarPhaseModal({ pillarId, text, phase, onClose }) {
  const { t: tCommon } = useTranslation('common');
  const p = PC[pillarId];
  const assets = PILLAR_ASSETS[pillarId];
  const details = text.split(' · ');
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${phase.rgb},0.28)`, boxShadow: `0 0 80px rgba(${phase.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={assets.img} alt={p.l} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${phase.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${p.c}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${phase.rgb},0.18)`, border: `2px solid rgba(${phase.rgb},0.4)` }}>
              {p.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p.c }}>{p.l} · {phase.weeks}</p>
              <h2 className="font-bold text-white text-lg leading-tight">{phase.name}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-5 md:p-7">
          <p className="text-sm font-semibold mb-5 leading-relaxed" style={{ color: `rgba(${phase.rgb},0.75)` }}>
            Nội dung trọng tâm của trụ cột <strong style={{ color: p.c }}>{p.l}</strong> trong giai đoạn {phase.weeks}:
          </p>
          <ul className="space-y-2.5 mb-5">
            {details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${phase.rgb},0.14)`, color: p.c }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Quick-access links */}
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${phase.rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${phase.rgb},0.5)` }}>
              Khám Phá Chi Tiết
            </p>
            <div className="flex flex-wrap gap-2">
              {assets.links.map((lk, li) => (
                <Link key={li} to={lk.to} onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                  style={{ color: p.c, background: `rgba(${phase.rgb},0.1)`, border: `1px solid rgba(${phase.rgb},0.22)` }}>
                  <span>{lk.icon}</span> {lk.label} →
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {assets.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${phase.rgb},0.06)`, border: `1px solid rgba(${phase.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── PhaseItemModal (KPI + Milestone) ─────────────────────────────────────────
const KPI_POINTS = [
  { icon: '📊', label: 'Cách đo lường', note: 'Dùng Workout Log hoặc Checklist hàng ngày' },
  { icon: '📅', label: 'Tần suất kiểm tra', note: 'Cuối mỗi tuần — không kiểm tra từng ngày' },
  { icon: '💪', label: 'Khi chưa đạt', note: 'Ghi chú nguyên nhân → điều chỉnh plan' },
  { icon: '🎯', label: 'Mục đích thật sự', note: 'Xây thói quen — không chỉ đạt con số' },
];
const MILESTONE_POINTS = [
  { icon: '🏆', label: 'Ý nghĩa thật', note: 'Vượt qua giai đoạn khó nhất — tiếp tục thôi' },
  { icon: '📖', label: 'Ghi vào nhật ký', note: 'Document lại ngày đạt — để nhìn lại sau' },
  { icon: '🔜', label: 'Bước tiếp theo', note: 'Cột mốc tiếp theo đang chờ — giữ đà' },
  { icon: '👥', label: 'Chia sẻ với ai đó', note: 'Accountability tăng 65% tỷ lệ tiếp tục' },
];
const KPI_LINKS = [
  { icon: '🔬', label: 'Progress Test', to: '/pillar/f/progress-test' },
  { icon: '📊', label: 'Workout Log', to: '/pillar/f/workout-log' },
  { icon: '✅', label: 'Daily Checklist', to: '/pillar/f/checklist' },
  { icon: '📈', label: 'Health Score', to: '/pillar/f/health-score' },
];
const MILESTONE_LINKS = [
  { icon: '🔬', label: 'Test Tiến Bộ', to: '/pillar/f/progress-test' },
  { icon: '🗓️', label: 'Lộ Trình 12 Tuần', to: '/program?tab=12w' },
  { icon: '📋', label: 'Chương Trình Mẫu', to: '/sample-programs' },
  { icon: '🏆', label: 'Khám Phá 6 Trụ Cột', to: '/pillars' },
];

function PhaseItemModal({ text, phase, type, onClose }) {
  const { t: tCommon } = useTranslation('common');
  const isKpi = type === 'kpi';

  const tKpiPts = tCommon('program.kpi_points', { returnObjects: true });
  const localKpiPoints = Array.isArray(tKpiPts) ? tKpiPts.map((p, i) => ({ ...KPI_POINTS[i], ...p })) : KPI_POINTS;
  const tMsPts = tCommon('program.milestone_points', { returnObjects: true });
  const localMilestonePoints = Array.isArray(tMsPts) ? tMsPts.map((p, i) => ({ ...MILESTONE_POINTS[i], ...p })) : MILESTONE_POINTS;
  const tKpiLks = tCommon('program.kpi_links', { returnObjects: true });
  const localKpiLinks = Array.isArray(tKpiLks) ? tKpiLks.map((l, i) => ({ ...KPI_LINKS[i], ...l })) : KPI_LINKS;
  const tMsLks = tCommon('program.milestone_links', { returnObjects: true });
  const localMilestoneLinks = Array.isArray(tMsLks) ? tMsLks.map((l, i) => ({ ...MILESTONE_LINKS[i], ...l })) : MILESTONE_LINKS;
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  const details = isKpi ? [
    tCommon('program.kpi_detail_1', { weeks: phase.weeks, defaultValue: `Chỉ số này đo lường thực tế qua từng tuần — không phải cảm giác mà là con số bạn có thể kiểm tra trong giai đoạn ${phase.weeks}.` }),
    tCommon('program.kpi_detail_2', { defaultValue: 'Đạt được chỉ số này là tín hiệu rõ ràng cho thấy nền tảng đang được xây đúng hướng và thói quen đang hình thành bền vững.' }),
    tCommon('program.kpi_detail_3', { defaultValue: 'Nếu chưa đạt — không sao. Ghi lại nguyên nhân và điều chỉnh cách tiếp cận, không phải hạ thấp mục tiêu.' }),
  ] : [
    tCommon('program.milestone_detail_1', { weeks: phase.weeks, defaultValue: `Cột mốc này đánh dấu bước tiến thực sự trong giai đoạn ${phase.weeks} — không phải về con số mà về sự nhất quán đã hình thành.` }),
    tCommon('program.milestone_detail_2', { defaultValue: 'Khi đạt được cột mốc này, bạn đang xây dựng được nền móng vững chắc — tinh thần và thể chất đều đang đi đúng hướng.' }),
    tCommon('program.milestone_detail_3', { defaultValue: 'Ghi lại ngày bạn đạt cột mốc này. Đây sẽ là điểm tham chiếu để nhìn lại sau 3–6 tháng nữa với sự tự hào thực sự.' }),
  ];
  const img = isKpi
    ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    : 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=800&q=80';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${phase.rgb},0.28)`, boxShadow: `0 0 80px rgba(${phase.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-36 rounded-t-3xl overflow-hidden">
          <img src={img} alt={type} className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${phase.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${phase.color}, transparent)` }} />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `rgba(${phase.rgb},0.18)`, border: `2px solid rgba(${phase.rgb},0.4)` }}>
              {isKpi ? '📊' : '🏆'}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                {isKpi ? tCommon('program.kpi_type_label', 'Chỉ Số Mục Tiêu') : tCommon('program.milestone_type_label', 'Cột Mốc Giai Đoạn')} · {phase.weeks}
              </p>
              <h2 className="font-bold text-white text-sm leading-snug max-w-xs">{text}</h2>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-5 md:p-7">
          <ul className="space-y-2.5 mb-5">
            {details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${phase.rgb},0.14)`, color: phase.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Quick-access links */}
          <div className="mb-5 pb-5" style={{ borderBottom: `1px solid rgba(${phase.rgb},0.12)` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: `rgba(${phase.rgb},0.5)` }}>
              {isKpi ? tCommon('program.kpi_links_header', 'Công Cụ Đo Lường') : tCommon('program.milestone_links_header', 'Khám Phá Tiếp Theo')}
            </p>
            <div className="flex flex-wrap gap-2">
              {(isKpi ? localKpiLinks : localMilestoneLinks).map((lk, li) => (
                <Link key={li} to={lk.to} onClick={onClose}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105"
                  style={{ color: phase.color, background: `rgba(${phase.rgb},0.1)`, border: `1px solid rgba(${phase.rgb},0.22)` }}>
                  <span>{lk.icon}</span> {lk.label} →
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {(isKpi ? localKpiPoints : localMilestonePoints).map((pt, pi) => (
              <div key={pi} className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: `rgba(${phase.rgb},0.06)`, border: `1px solid rgba(${phase.rgb},0.14)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ── PillarRow ────────────────────────────────────────────────────────────────
function PillarRow({ id, text, onClick }) {
  const { t } = useTranslation();
  const p = PC[id];
  const label = t(`program.pillar_labels.${id}`, { defaultValue: p.l });
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: p.bg, border: `1px solid ${p.br}` }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.borderColor = p.c + '55'}
      onMouseLeave={e => e.currentTarget.style.borderColor = p.br}
    >
      <span className="text-lg shrink-0 mt-0.5">{p.icon}</span>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: p.c }}>{label}</span>
        <p className="text-sm text-muted leading-relaxed">{text}</p>
      </div>
      <span className="shrink-0 self-center text-[10px] font-bold px-2 py-1 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ color: p.c, background: p.bg, border: `1px solid ${p.br}` }}>→</span>
    </div>
  );
}

// ── PhaseCard ────────────────────────────────────────────────────────────────
function PhaseCard({ phase, idx, expanded, onToggle, onPillarClick, onKpiClick, onMilestoneClick }) {
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
                  {Object.entries(phase.pillars).map(([k,v]) => (
                    <PillarRow key={k} id={k} text={v} onClick={() => onPillarClick({ pillarId: k, text: v, phase })} />
                  ))}
                </div>
              </div>
              {/* KPIs */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.kpi_section_header', 'Chỉ Số Mục Tiêu')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {phase.kpis.map((kpi, i) => (
                    <div key={i}
                      className="flex items-start gap-2 text-sm text-muted cursor-pointer group rounded-lg px-2 py-1 transition-colors hover:bg-white/5"
                      onClick={() => onKpiClick({ text: kpi, phase })}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125" style={{ background: phase.color }} />
                      <span className="flex-1 group-hover:text-text/80 transition-colors">{kpi}</span>
                      <span className="shrink-0 text-[10px] font-bold opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: phase.color }}>→</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Milestones */}
              <div>
                <h4 className="text-base font-bold uppercase tracking-widest text-muted mb-3">{t('program.milestone_header', 'Cột Mốc Giai Đoạn')}</h4>
                <div className="flex flex-wrap gap-2">
                  {phase.milestones.map((m, i) => (
                    <button key={i}
                      className="text-sm px-3 py-1.5 rounded-full border font-medium cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{ color: phase.color, borderColor: `rgba(${phase.rgb},0.3)`, background: `rgba(${phase.rgb},0.08)` }}
                      onClick={() => onMilestoneClick({ text: m, phase })}>
                      ✓ {m}
                    </button>
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
  const [activeQuickLink, setActiveQuickLink] = useState(null);
  const [activePillarRow, setActivePillarRow] = useState(null);
  const [activePhaseItem, setActivePhaseItem] = useState(null);
  const [activeDailyBlock, setActiveDailyBlock] = useState(null);
  const [activeWeeklyItem, setActiveWeeklyItem] = useState(null);
  const [activeSuccessTip, setActiveSuccessTip] = useState(null);
  const [activeProgressRow, setActiveProgressRow] = useState(null);
  const [progressData, setProgressData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; }
  });
  const updateProgress = (metricKey, field, val) => {
    setProgressData(prev => {
      const next = { ...prev, [metricKey]: { ...(prev[metricKey] || {}), [field]: val } };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

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
  const localJourneys = JOURNEYS.map((j, i) => {
    const tJ = Array.isArray(tJourneys) ? tJourneys[i] : null;
    return tJ ? { ...j, ...tJ } : j;
  });
  const tSevenDays = t('program.seven_days', { returnObjects: true });
  const localSevenDays = Array.isArray(tSevenDays) ? tSevenDays.map((d, i) => ({ ...SEVEN_DAYS[i], ...d })) : SEVEN_DAYS;
  const tPillarLabels = t('program.pillar_labels', { returnObjects: true });
  const localPC = (tPillarLabels && typeof tPillarLabels === 'object' && !Array.isArray(tPillarLabels))
    ? Object.fromEntries(Object.entries(PC).map(([k, v]) => [k, { ...v, l: tPillarLabels[k] || v.l }]))
    : PC;
  const tQuickLinks = t('program.quick_links', { returnObjects: true });
  const localQuickLinks = Array.isArray(tQuickLinks) ? tQuickLinks : null;
  const tWeeklyDays = t('program.weekly_days', { returnObjects: true });
  const localWeekly = Array.isArray(tWeeklyDays) ? tWeeklyDays.map((d, i) => ({ ...WEEKLY_RHYTHM[i], ...d })) : WEEKLY_RHYTHM;
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
                      {t('modal.see_detail_label')}
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
                              {t('modal.see_detail_label')}
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
                            {t('modal.see_detail_label')}
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
                    <PhaseCard key={phase.id} phase={phase} idx={i} expanded={expandedPhase===i} onToggle={() => setExpandedPhase(expandedPhase===i ? -1 : i)}
                      onPillarClick={setActivePillarRow}
                      onKpiClick={d => setActivePhaseItem({ ...d, type: 'kpi' })}
                      onMilestoneClick={d => setActivePhaseItem({ ...d, type: 'milestone' })}
                    />
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
                      <RevealBlock key={i} delay={i*80}>
                        <div
                          className="relative bg-surface border border-border rounded-2xl p-5 text-center transition-all duration-300 group cursor-pointer hover:-translate-y-0.5"
                          onClick={() => setActiveDailyBlock(block)}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${block.rgb},0.45)`; e.currentTarget.style.boxShadow = `0 0 24px rgba(${block.rgb},0.12)`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                          <span className="absolute top-3 right-3 text-[10px] font-bold text-muted/30">{String(i+1).padStart(2,'0')}</span>
                          <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{block.icon}</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: block.color }}>{block.time}</p>
                          <h3 className="font-bold text-lg text-text mb-1.5">{block.name}</h3>
                          <p className="text-sm text-muted leading-relaxed">{block.desc}</p>
                          <span className="inline-block mt-2 text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-opacity"
                            style={{ color: block.color }}>{t('modal.see_detail')}</span>
                          {i < 3 && <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border text-xl z-10">›</span>}
                        </div>
                      </RevealBlock>
                    ))}
                  </div>
                </div>
                <RevealBlock delay={320} className="mt-8 p-5 rounded-2xl border border-accent/15 bg-accent/4">
                  <h3 className="text-base font-bold uppercase tracking-widest text-accent mb-3">💡 {t('program.daily_principles_title', 'Nguyên Tắc Khung Ngày')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DAILY_PRINCIPLES.map((pr, i) => (
                      <button key={i}
                        className="flex items-start gap-2.5 text-left px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: `rgba(${pr.rgb},0.04)`, border: `1px solid rgba(${pr.rgb},0.12)` }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${pr.rgb},0.35)`; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${pr.rgb},0.12)`; }}
                        onClick={() => setActiveDailyBlock(pr)}
                      >
                        <span className="text-base shrink-0 mt-0.5">{pr.icon}</span>
                        <span className="text-sm text-muted leading-relaxed group-hover:text-text/80 transition-colors flex-1">• {pr.text}</span>
                        <span className="shrink-0 text-[10px] font-bold opacity-0 group-hover:opacity-60 transition-opacity self-center" style={{ color: pr.color }}>→</span>
                      </button>
                    ))}
                  </div>
                </RevealBlock>
              </div>
            )}

            {/* ── Weekly rhythm tab ────────── */}
            {subTab === 'weekly' && (() => {
              const day   = localWeekly[weeklyTab];
              const meta  = TAB_META[weeklyTab];
              const panel = WEEKLY_PANEL[weeklyTab];
              return (
                <div>
                  {/* ── Browser-tab row ── */}
                  <div className="relative mb-0">
                    {/* tab bar track */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0 relative z-10" style={{ borderBottom: `2px solid rgba(${meta.rgb},0.22)` }}>
                      {localWeekly.map((d, i) => {
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
                          { l: t('program.weekly_stat_duration', 'Thời lượng'), v: panel.duration },
                          { l: t('program.weekly_stat_intensity', 'Cường độ'),  v: panel.intensity },
                          { l: t('program.weekly_stat_sessions',  'Tần suất'),  v: panel.sessions },
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
                          {t('program.weekly_moves_header', 'Bài Tập / Hoạt Động')}
                        </h4>
                        <ul className="space-y-2">
                          {panel.moves.map((m, i) => (
                            <li key={i}
                              className="flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 hover:bg-white/3 group/move cursor-pointer"
                              onClick={() => panel.movesData && setActiveWeeklyItem(panel.movesData[i])}
                            >
                              <span
                                className="mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                                style={{ background: `rgba(${meta.rgb},0.7)` }}
                              >
                                {i + 1}
                              </span>
                              <span className="text-base text-muted group-hover/move:text-text transition-colors duration-150 flex-1">{m}</span>
                              <span className="shrink-0 text-[10px] font-bold opacity-0 group-hover/move:opacity-50 transition-opacity self-center" style={{ color: meta.c }}>→</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: meta.c }}>
                          {t('program.weekly_tips_header', 'Nguyên Tắc Thực Hiện')}
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {panel.tips.map((tip, i) => (
                            <li key={i}
                              className="flex items-start gap-2 text-base text-muted group/tip cursor-pointer px-2 py-1.5 rounded-xl transition-all duration-150 hover:bg-white/3"
                              onClick={() => panel.tipsData && setActiveWeeklyItem(panel.tipsData[i])}
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.c }} />
                              <span className="flex-1 group-hover/tip:text-text/80 transition-colors">{tip}</span>
                              <span className="shrink-0 text-[10px] font-bold opacity-0 group-hover/tip:opacity-50 transition-opacity self-center" style={{ color: meta.c }}>→</span>
                            </li>
                          ))}
                        </ul>
                        {/* Avoid note */}
                        <div
                          className="p-3 rounded-xl border text-base cursor-pointer group/avoid transition-all duration-150 hover:opacity-90"
                          style={{ borderColor: `rgba(${meta.rgb},0.2)`, background: `rgba(${meta.rgb},0.06)`, color: meta.c }}
                          onClick={() => panel.avoidData && setActiveWeeklyItem(panel.avoidData)}
                        >
                          ⚠️ <span className="text-muted group-hover/avoid:text-text/80 transition-colors">{panel.avoid}</span>
                          <span className="ml-2 text-[10px] font-bold opacity-0 group-hover/avoid:opacity-60 transition-opacity" style={{ color: meta.c }}>→</span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ADJUST_TIPS_DATA.map((tip, i) => (
                        <button key={i}
                          className="flex items-start gap-2 text-left px-3 py-2.5 rounded-xl group/adj transition-all duration-150 hover:-translate-y-0.5 cursor-pointer"
                          style={{ background: `rgba(${tip.rgb},0.04)`, border: `1px solid rgba(${tip.rgb},0.12)` }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${tip.rgb},0.3)`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${tip.rgb},0.12)`; }}
                          onClick={() => setActiveWeeklyItem(tip)}
                        >
                          <span className="text-base shrink-0 mt-0.5">{tip.icon}</span>
                          <span className="text-base text-muted group-hover/adj:text-text/80 transition-colors flex-1">• {tip.name}</span>
                          <span className="shrink-0 text-[10px] font-bold opacity-0 group-hover/adj:opacity-60 transition-opacity self-center" style={{ color: tip.color }}>→</span>
                        </button>
                      ))}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SUCCESS_TIPS.map((tip,i) => (
                      <RevealBlock key={i} delay={i*60}>
                        <div
                          className="flex items-start gap-3 p-4 rounded-2xl cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
                          style={{ border: `1px solid rgba(${tip.rgb},0.12)`, background: `rgba(${tip.rgb},0.03)` }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${tip.rgb},0.35)`; e.currentTarget.style.background = `rgba(${tip.rgb},0.07)`; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${tip.rgb},0.12)`; e.currentTarget.style.background = `rgba(${tip.rgb},0.03)`; }}
                          onClick={() => setActiveSuccessTip(tip)}
                        >
                          <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-200 mt-0.5">{tip.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-text text-lg mb-1 transition-colors duration-200" style={{}}>{tip.title}</h3>
                            <p className="text-base text-muted leading-relaxed">{tip.desc}</p>
                            <span className="inline-block mt-2 text-[10px] font-bold opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: tip.color }}>{t('modal.see_detail')}</span>
                          </div>
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
                        {(() => {
                          const COL_META = [
                            { field:'baseline', text:'#2dd4bf', bg:'rgba(20,184,166,0.08)', border:'rgba(20,184,166,0.22)' },
                            { field:'week4',    text:'#22c55e', bg:'rgba(34,197,94,0.08)',  border:'rgba(34,197,94,0.22)'  },
                            { field:'week12',   text:'#c084fc', bg:'rgba(168,85,247,0.08)', border:'rgba(168,85,247,0.22)' },
                            { field:'week24',   text:'#fb923c', bg:'rgba(249,115,22,0.08)', border:'rgba(249,115,22,0.22)' },
                          ];
                          const visibleCols = journey === '24w' ? COL_META : COL_META.slice(0,3);
                          return PROGRESS_ROWS.map((row,i) => (
                            <tr key={i}
                              className="border-b border-border/50 transition-colors duration-150 last:border-0 group/row"
                              onMouseEnter={e => { e.currentTarget.style.background = `rgba(${row.rgb},0.04)`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                            >
                              {/* Metric name — click opens modal */}
                              <td className="px-5 py-3 font-semibold text-text text-lg cursor-pointer"
                                onClick={() => setActiveProgressRow(row)}>
                                <span className="flex items-center gap-2">
                                  <span className="text-xl shrink-0">{row.icon}</span>
                                  <span className="group-hover/row:underline decoration-dotted" style={{ textDecorationColor: row.color }}>{row.metric}</span>
                                  <span className="text-[10px] font-bold opacity-0 group-hover/row:opacity-60 transition-opacity" style={{ color: row.color }}>→</span>
                                </span>
                              </td>
                              {/* Test description */}
                              <td className="px-5 py-3 text-muted text-base leading-relaxed">{row.test}</td>
                              {/* Editable value cells */}
                              {visibleCols.map(cm => {
                                const val = progressData[row.metric]?.[cm.field] || '';
                                return (
                                  <td key={cm.field} className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                                    {row.unit === 'Không/Có' ? (
                                      <button
                                        onClick={() => updateProgress(row.metric, cm.field, val === '' ? 'Có' : val === 'Có' ? 'Không' : '')}
                                        className="inline-flex items-center justify-center px-3 py-1 rounded-full border text-base font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ color: cm.text, background: cm.bg, borderColor: cm.border, minWidth: '90px' }}
                                      >
                                        {val || '___'}
                                      </button>
                                    ) : (
                                      <label className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full border cursor-text"
                                        style={{ color: cm.text, background: cm.bg, borderColor: cm.border }}>
                                        <input
                                          type="text"
                                          inputMode="decimal"
                                          value={val}
                                          onChange={e => updateProgress(row.metric, cm.field, e.target.value)}
                                          placeholder="___"
                                          className="w-10 text-center text-base font-semibold bg-transparent outline-none placeholder:text-white/25"
                                          style={{ color: cm.text, caretColor: cm.text }}
                                        />
                                        <span className="text-base font-semibold select-none">{row.unit}</span>
                                      </label>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
                <RevealBlock delay={200} className="mt-4 p-4 rounded-2xl border border-accent/15 bg-accent/4 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-base text-muted flex-1">
                    💾 Kết quả được tự động lưu vào trình duyệt. Nhấn vào ô để nhập — chỉ số <strong className="text-accent">Linh Hoạt</strong> click để chuyển đổi Có/Không.
                  </p>
                  <button
                    onClick={() => {
                      const ok = window.confirm('Xóa toàn bộ dữ liệu test đã lưu?');
                      if (ok) { setProgressData({}); localStorage.removeItem(PROGRESS_KEY); }
                    }}
                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-500/25 text-red-400/70 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    🗑 Xóa dữ liệu
                  </button>
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
            {QUICK_LINKS_DATA.map((ql, idx) => {
              const tql = localQuickLinks?.[idx];
              const label = tql?.label || ql.label;
              const sub = tql?.sub || ql.sub;
              const desc = tql?.desc || ql.desc;
              const mergedQl = { ...ql, label, sub, desc };
              return (
                <div
                  key={ql.to}
                  onClick={() => setActiveQuickLink(mergedQl)}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-border bg-surface cursor-pointer group transition-all duration-200 hover:-translate-y-0.5"
                  style={{ '--lc': `rgba(${ql.rgb},0.35)` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${ql.rgb},0.35)`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ''}
                >
                  <span className="text-2xl shrink-0">{ql.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-text text-base leading-snug">{label}</div>
                    <div className="text-[10px] text-muted mt-0.5 leading-relaxed">{sub}</div>
                  </div>
                  <span
                    className="shrink-0 self-center text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: ql.color, background: `rgba(${ql.rgb},0.1)`, border: `1px solid rgba(${ql.rgb},0.2)` }}
                  >→</span>
                </div>
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
    {activeQuickLink && (
      <QuickLinkModal ql={activeQuickLink} onClose={() => setActiveQuickLink(null)} />
    )}
    {activePillarRow && (
      <PillarPhaseModal
        pillarId={activePillarRow.pillarId}
        text={activePillarRow.text}
        phase={activePillarRow.phase}
        onClose={() => setActivePillarRow(null)}
      />
    )}
    {activePhaseItem && (
      <PhaseItemModal
        text={activePhaseItem.text}
        phase={activePhaseItem.phase}
        type={activePhaseItem.type}
        onClose={() => setActivePhaseItem(null)}
      />
    )}
    {activeDailyBlock && (
      <DailyBlockModal block={activeDailyBlock} onClose={() => setActiveDailyBlock(null)} />
    )}
    {activeWeeklyItem && (
      <DailyBlockModal block={activeWeeklyItem} onClose={() => setActiveWeeklyItem(null)} />
    )}
    {activeSuccessTip && (
      <DailyBlockModal block={{ ...activeSuccessTip, name: activeSuccessTip.title, time: 'BÍ QUYẾT' }} onClose={() => setActiveSuccessTip(null)} />
    )}
    {activeProgressRow && (
      <DailyBlockModal block={activeProgressRow} onClose={() => setActiveProgressRow(null)} />
    )}
  </>
  );
}
