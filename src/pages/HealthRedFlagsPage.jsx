import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-rf-orbit-kf';
const ORBIT_CLASS = 'e-rf-orbit-ring';
const ORBIT_PROP = '--e-rf-orbit-angle';

const EMERGENCY_GROUPS = [
  {
    icon: '🧠', title: 'Đột Quỵ — Gọi 115 Ngay', tag: 'KHẨN CẤP',
    color: '#ef4444', rgb: '239,68,68',
    signs: [
      'Méo miệng đột ngột, mất cân đối khuôn mặt',
      'Tê hoặc yếu nửa người (tay, chân, mặt)',
      'Nói đớ, không thành lời, không hiểu người khác nói',
      'Mờ mắt một hoặc hai mắt đột ngột',
      'Đau đầu dữ dội không rõ nguyên nhân',
    ],
    note: 'Nhớ quy tắc FAST: Face drooping · Arm weakness · Speech difficulty · Time to call 115',
    action: 'Gọi 115 hoặc đến cấp cứu ngay — mỗi phút mất 1.9 triệu tế bào thần kinh trong đột quỵ.',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '⏱️ "Time is Brain": mỗi phút trì hoãn điều trị = 1.9 triệu tế bào thần kinh tử vong. Trong 4.5 giờ đầu, thuốc tiêu huyết khối (tPA) có thể đảo ngược tổn thương. Nhận biết FAST và gọi 115 là điều duy nhất bạn cần làm.',
    details: [
      'Quy tắc FAST: F (Face drooping — méo miệng), A (Arm weakness — yếu tay, không giơ cả 2 tay được), S (Speech difficulty — nói khó, đớ, vô nghĩa), T (Time — gọi 115 ngay khi có ≥ 1 dấu hiệu trên).',
      'Đột quỵ thiếu máu (ischemic, 85%): tắc mạch máu não. Điều trị: tPA tiêu huyết khối trong 4.5h, hoặc lấy huyết khối cơ học (thrombectomy) trong 6–24h tại trung tâm đột quỵ.',
      'Đột quỵ xuất huyết (hemorrhagic, 15%): vỡ mạch máu trong não. KHÔNG dùng aspirin — có thể làm nặng hơn. Cần phẫu thuật hoặc can thiệp nội mạch.',
      'Triệu chứng thoáng qua (TIA — "mini stroke"): giống đột quỵ nhưng hết trong < 24h (thường < 1h). Đừng xem nhẹ — 10–15% TIA dẫn đến đột quỵ thật trong 3 tháng, nguy cơ cao nhất trong 48h đầu.',
      'Không nên làm: (1) Không cho ăn/uống — nguy cơ sặc; (2) Không tự đưa bằng xe máy — xóc làm xuất huyết nặng hơn; (3) Không dùng thuốc hạ áp tự ý; (4) Không chờ xem có tự hết không.',
      'Phòng ngừa: kiểm soát huyết áp (mục tiêu < 130/80), không hút thuốc, kiểm soát rung nhĩ (nguyên nhân 20% đột quỵ), statin nếu LDL cao, aspirin chỉ khi có chỉ định của bác sĩ.',
    ],
    points: [
      { icon: '⏱️', label: 'Cửa sổ vàng: 4.5 giờ', note: 'tPA hiệu quả nhất trong 3h đầu — gọi 115 ngay' },
      { icon: '🚫', label: 'Không dùng aspirin nếu chưa biết loại', note: 'Xuất huyết não: aspirin làm nặng hơn' },
      { icon: '🧠', label: 'TIA không được bỏ qua', note: '10–15% → đột quỵ thật trong 3 tháng' },
      { icon: '📵', label: 'Không tự đưa bằng xe máy', note: 'Xóc có thể làm xuất huyết nặng hơn' },
    ],
  },
  {
    icon: '❤️', title: 'Nhồi Máu Cơ Tim', tag: 'KHẨN CẤP',
    color: '#ef4444', rgb: '239,68,68',
    signs: [
      'Đau ngực như bị ép, siết chặt, kéo dài > 15 phút',
      'Đau lan ra vai trái, cánh tay trái, hàm, lưng',
      'Khó thở kèm đau ngực',
      'Toát mồ hôi lạnh, buồn nôn, chóng mặt đột ngột',
      'Cảm giác báo trước kỳ lạ, lo lắng cực độ',
    ],
    note: 'Phụ nữ có thể không đau ngực điển hình — triệu chứng thường là buồn nôn, mệt mỏi đột ngột, khó thở.',
    action: 'Gọi 115 ngay, nhai 1 viên aspirin 300mg (nếu không dị ứng), nằm nghỉ — không tự lái xe đến bệnh viện.',
    img: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&q=80',
    keyFact: '💊 Aspirin 300mg nhai ngay (không nuốt nguyên) nếu không dị ứng — làm mỏng huyết khối đang tắc mạch vành. "Door-to-balloon" < 90 phút là tiêu chuẩn vàng: càng vào viện sớm, cơ tim được cứu càng nhiều.',
    details: [
      'Cơ chế: mảng xơ vữa trong động mạch vành vỡ ra → huyết khối hình thành đột ngột → tắc hoàn toàn → cơ tim thiếu oxy → hoại tử. Không tự phục hồi — mỗi phút = thêm cơ tim chết.',
      'Triệu chứng điển hình ở nam: đau ngực trái/giữa ngực như bị ai bóp, ép, đốt; kéo dài > 15 phút; lan ra hàm, cổ, tay trái, lưng; kèm vã mồ hôi, buồn nôn.',
      'Triệu chứng không điển hình (hay gặp ở nữ, tiểu đường, người cao tuổi): mệt mỏi đột ngột dữ dội, khó thở không giải thích được, buồn nôn, chóng mặt, đau hàm hoặc lưng — không đau ngực rõ. Thường đến viện muộn hơn.',
      'Sơ cứu đúng: (1) Gọi 115 trước; (2) Ngồi/nằm thoải mái, nới lỏng quần áo; (3) Nhai (không nuốt) 1 viên Aspirin 300mg nếu không dị ứng; (4) Nitroglycerin xịt dưới lưỡi nếu đã có chỉ định; (5) Không ăn uống gì thêm; (6) Không tự lái xe.',
      'Điều trị tại viện: PCI (đặt stent mạch vành) trong < 90 phút từ khi vào viện là tiêu chuẩn vàng. Nếu không có PCI, tiêu huyết khối (tPA) trong 30 phút. Mỗi phút trì hoãn = thêm 2000 tế bào cơ tim chết.',
      'Phục hồi sau nhồi máu: chương trình cardiac rehab giảm nguy cơ tái phát 25–30%. Thuốc duy trì: aspirin + clopidogrel/ticagrelor 1 năm, statin, beta-blocker, ACE inhibitor — không tự ngưng.',
    ],
    points: [
      { icon: '💊', label: 'Aspirin 300mg — nhai ngay', note: 'Làm mỏng huyết khối đang tắc — không nuốt nguyên' },
      { icon: '🚗', label: 'Không tự lái xe đến viện', note: 'Nguy hiểm nếu mất ý thức đột ngột trên đường' },
      { icon: '👩', label: 'Nữ: triệu chứng khác nam', note: 'Mệt, buồn nôn, khó thở — không nhất thiết đau ngực' },
      { icon: '🏥', label: 'Door-to-balloon < 90 phút', note: 'Mỗi phút trì hoãn = thêm cơ tim hoại tử' },
    ],
  },
  {
    icon: '🌡️', title: 'Nhiễm Trùng Nặng / Sốc Nhiễm Khuẩn', tag: 'KHẨN CẤP',
    color: '#f97316', rgb: '249,115,22',
    signs: [
      'Sốt cao > 39.5°C không hạ sau 2 giờ dùng thuốc',
      'Mạch nhanh > 100 lần/phút kèm lơ mơ',
      'Tụt huyết áp: HA tâm thu < 90 mmHg',
      'Nổi ban đỏ lan nhanh kèm sốt',
      'Cứng gáy, sợ ánh sáng, đau đầu dữ dội (viêm màng não)',
    ],
    note: 'Sốc nhiễm trùng (septic shock) là tình trạng đe dọa tính mạng cần điều trị trong vòng 1 giờ đầu.',
    action: 'Vào cấp cứu ngay — không chờ uống thuốc xem có đỡ không.',
    img: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=800&q=80',
    keyFact: '⏱️ "Hour-1 Bundle" (bộ xử lý sepsis trong 1 giờ): cấy máu → kháng sinh phổ rộng → truyền dịch 30ml/kg. Tỷ lệ tử vong tăng 7% mỗi giờ trì hoãn kháng sinh. Nhận biết sớm = cứu sống.',
    details: [
      'Sepsis: phản ứng viêm toàn thân quá mức với nhiễm trùng → tổn thương đa cơ quan. Septic shock: cần thuốc vận mạch để duy trì MAP ≥ 65 mmHg + lactate > 2 mmol/L. Tỷ lệ tử vong 40–50%.',
      'Dấu hiệu cảnh báo sớm (qSOFA): (1) Nhịp thở > 22 lần/phút; (2) Thay đổi ý thức (lơ mơ, lẫn lộn); (3) HA tâm thu < 100 mmHg. Có ≥ 2 → nguy cơ sepsis cao.',
      'Viêm màng não mủ: cứng gáy + sốt + đau đầu dữ dội + sợ ánh sáng. Không cần đợi chọc dịch não tủy để bắt đầu kháng sinh — trễ 1 giờ tăng nguy cơ di chứng thần kinh vĩnh viễn.',
      'Ban xuất huyết không mất màu khi ép (non-blanching purpura): ấn ngón tay lên ban, nếu ban không nhạt màu → xuất huyết do nhiễm khuẩn huyết (meningococcemia) — cấp cứu tối khẩn.',
      'Ổ nhiễm trùng thường gặp dẫn đến sepsis: viêm phổi (50%), nhiễm trùng ổ bụng (20%), nhiễm trùng tiết niệu (15%), nhiễm trùng da/mô mềm (10%). Cần kiểm soát ổ nhiễm cùng kháng sinh.',
      'Phòng ngừa: vắc-xin phế cầu, cúm; chăm sóc vết thương đúng cách; không tự mua kháng sinh điều trị sốt kéo dài — che giấu triệu chứng sepsis nguy hiểm.',
    ],
    points: [
      { icon: '🦠', label: '+7% tử vong mỗi giờ trễ kháng sinh', note: 'Kháng sinh sớm là can thiệp quan trọng nhất' },
      { icon: '🔴', label: 'Ban không mất màu = khẩn cấp tối đa', note: 'Meningococcemia — nguy cơ tử vong trong vài giờ' },
      { icon: '💧', label: 'Bù dịch 30ml/kg trong 3h đầu', note: 'Một phần của Hour-1 Bundle tiêu chuẩn quốc tế' },
      { icon: '🧠', label: 'Lơ mơ + sốt = nguy hiểm', note: 'Rối loạn ý thức là chỉ điểm sepsis — không chỉ là "sốt cao"' },
    ],
  },
  {
    icon: '🫁', title: 'Khó Thở Cấp Tính', tag: 'KHẨN CẤP',
    color: '#f97316', rgb: '249,115,22',
    signs: [
      'Thở dốc đột ngột khi nghỉ ngơi',
      'Tím môi, tím đầu ngón tay',
      'Không thể nói trọn câu vì thiếu hơi',
      'Thở khò khè dữ dội không đáp ứng thuốc xịt',
      'Ho ra máu',
    ],
    note: 'Nhồi máu phổi (thuyên tắc phổi) có thể gây khó thở đột ngột mà không có dấu hiệu báo trước.',
    action: 'Gọi 115 hoặc vào cấp cứu ngay, đặt người bệnh ngồi tựa để dễ thở hơn.',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '💙 SpO2 < 90% = suy hô hấp cần can thiệp ngay. Tím môi/đầu ngón tay xuất hiện khi SpO2 ≈ 85% — cơ thể đã thiếu oxy nghiêm trọng. Đặt người bệnh ngồi thẳng (orthopnea) giúp phổi giãn nở tốt hơn nằm.',
    details: [
      'Nguyên nhân phổ biến: (1) Phù phổi cấp (nhồi máu cơ tim, suy tim mất bù); (2) Thuyên tắc phổi (PE); (3) Cơn hen nặng; (4) Tràn khí màng phổi; (5) Viêm phổi nặng; (6) Phản vệ.',
      'Thuyên tắc phổi (PE): huyết khối từ tĩnh mạch sâu chi dưới di chuyển lên phổi. Yếu tố nguy cơ: nằm lâu, sau phẫu thuật, ung thư, thai kỳ, ngồi máy bay dài. Triệu chứng: đau ngực kiểu màng phổi + khó thở đột ngột + mạch nhanh.',
      'Tím tái (cyanosis) ở môi/móng tay → SpO2 < 85% → cần hỗ trợ oxy ngay. Máy đo SpO2 kẹp ngón tay (pulse oximeter) nên có ở nhà nếu có người bệnh hen, COPD, hoặc bệnh tim.',
      'Cơn hen nặng: không thể nói trọn câu, SpO2 < 92%, nhịp thở > 30/phút, dùng cơ hô hấp phụ. Xịt salbutamol 2–4 nhát, nếu không đáp ứng → gọi 115 ngay.',
      'Tràn khí màng phổi tự phát: người trẻ cao gầy, đau ngực một bên đột ngột + khó thở. Tràn khí áp lực (tension pneumothorax) phải xử trí trong vài phút — không tự khỏi.',
      'Phản vệ (anaphylaxis): khó thở + nổi mề đay/phù mặt sau tiếp xúc dị nguyên. Điều trị: adrenalin 0.3–0.5mg tiêm bắp đùi ngay — là can thiệp cứu sống duy nhất; kháng histamine không thay thế được.',
    ],
    points: [
      { icon: '📊', label: 'SpO2 < 90% = suy hô hấp', note: 'Máy đo ngón tay giúp nhận biết sớm tại nhà' },
      { icon: '🪑', label: 'Ngồi thẳng giúp phổi giãn tốt hơn', note: 'Tư thế orthopnea — không ép nằm xuống' },
      { icon: '💉', label: 'Phản vệ: adrenalin tiêm bắp ngay', note: 'Kháng histamine không thay thế được adrenalin' },
      { icon: '✈️', label: 'Khó thở sau ngồi lâu/phẫu thuật = nghi PE', note: 'Thuyên tắc phổi có thể không báo trước' },
    ],
  },
];

const SOON_SIGNS = [
  { icon: '🩺', sign: 'Sụt cân không rõ nguyên nhân > 5% trong 1 tháng', urgency: 'Trong 1–2 tuần' },
  { icon: '🩺', sign: 'Mệt mỏi dai dẳng không hồi phục dù nghỉ đủ', urgency: 'Trong 1–2 tuần' },
  { icon: '🩺', sign: 'Khối u hoặc hạch bất thường mới xuất hiện', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Đi tiểu ra máu (không do kinh nguyệt)', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Ho kéo dài > 3 tuần không rõ nguyên nhân', urgency: 'Trong 2 tuần' },
  { icon: '🩺', sign: 'Thay đổi tính chất phân: máu, đen, mỏng hơn kéo dài', urgency: 'Trong 1 tuần' },
  { icon: '🩺', sign: 'Đau đầu sáng sớm kèm nôn mửa liên tục', urgency: 'Trong 3–5 ngày' },
  { icon: '🩺', sign: 'Nhìn đôi hoặc mất thị lực một phần kéo dài', urgency: 'Trong 1–2 ngày' },
];

function EmergencyModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = e => {
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
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.18)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero image */}
        <div className="relative h-48 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.1) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: item.color, color: 'white' }}>{item.tag}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.title}</h2>

          {/* keyFact */}
          <div className="rounded-2xl px-4 py-3 mb-5 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.88)' }}>
            {item.keyFact}
          </div>

          {/* Signs */}
          <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: item.color }}>Dấu hiệu nhận biết</h3>
          <ul className="space-y-2 mb-4">
            {item.signs.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.85)' }}>
                <span style={{ color: item.color }} className="shrink-0 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>

          {/* Note */}
          {item.note && (
            <p className="text-sm mb-4 pl-3 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)', borderLeft: `2px solid rgba(${item.rgb},0.4)` }}>{item.note}</p>
          )}

          {/* Action CTA */}
          <div className="rounded-xl p-3 text-sm font-bold mb-6" style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>
            → {item.action}
          </div>

          {/* Detailed info */}
          <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: item.color }}>Thông tin chuyên sâu</h3>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-3"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-xs leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-rf-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-rf-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthRedFlagsPage() {
  const [emergencyModal, setEmergencyModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eRfOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eRfOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🚨</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Dấu Hiệu Nguy Hiểm</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Nhận biết khẩn cấp · Cấp cứu đúng lúc
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Nhận biết đúng các dấu hiệu nguy hiểm có thể cứu sống bạn hoặc người thân. Ghi nhớ: <strong className="text-text">khi nghi ngờ — gọi 115</strong>. Không chờ đợi khi triệu chứng nghiêm trọng.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&auto=format&fit=crop" alt="Cấp cứu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Gọi 115 khi nghi ngờ
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Emergency banner */}
      <RevealBlock delay={0} className="mb-10">
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: COLOR, background: `rgba(${RGB},0.07)` }}>
          <div className="text-3xl font-black text-white mb-1">115</div>
          <div className="text-lg font-bold" style={{ color: COLOR }}>Số cấp cứu toàn quốc — Miễn phí 24/7</div>
          <p className="text-base text-muted mt-1">Hoặc nhờ ai đó đưa đến khoa cấp cứu bệnh viện gần nhất</p>
        </div>
      </RevealBlock>

      {/* Emergency groups */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Cấp Cứu Ngay Lập Tức</h2>
        <p className="text-muted text-lg mb-6">Các tình trạng dưới đây đòi hỏi xử lý trong phút — không phải giờ.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {EMERGENCY_GROUPS.map((g, i) => (
            <div key={i}
              onClick={() => setEmergencyModal(i)}
              className="rounded-2xl border overflow-hidden cursor-pointer transition-all"
              style={{ borderColor: `rgba(${g.rgb},0.28)` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.6)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.28)`; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="flex items-center gap-3 p-4" style={{ background: `rgba(${g.rgb},0.08)` }}>
                <span className="text-3xl">{g.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: g.color }}>{g.title}</div>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded-full shrink-0" style={{ background: g.color, color: 'white' }}>{g.tag}</span>
              </div>
              <div className="p-4">
                <ul className="space-y-1 mb-3">
                  {g.signs.slice(0, 3).map((s, j) => (
                    <li key={j} className="flex gap-2 text-sm" style={{ color: 'rgba(209,213,219,0.85)' }}>
                      <span style={{ color: g.color }} className="shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                  {g.signs.length > 3 && (
                    <li className="text-xs pl-4" style={{ color: `rgba(${g.rgb},0.7)` }}>+{g.signs.length - 3} dấu hiệu khác...</li>
                  )}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: `rgba(${g.rgb},0.7)` }}>Click để xem chi tiết & cách xử lý</span>
                  <span style={{ color: g.color }} className="text-sm font-bold">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Soon signs */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Cần Đi Khám Sớm</h2>
        <p className="text-muted text-lg mb-6">Các dấu hiệu này không cần vào cấp cứu ngay nhưng cần đặt lịch khám trong thời gian ngắn.</p>
        <div className="space-y-2">
          {SOON_SIGNS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-4">
              <span className="text-xl">{s.icon}</span>
              <p className="text-lg text-text flex-1">{s.sign}</p>
              <span className="text-base font-bold shrink-0 px-2 py-1 rounded-full border" style={{ color: '#f97316', borderColor: '#f9731633', background: '#f9731610' }}>{s.urgency}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Chuẩn Bị Sẵn Sàng</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li>• Lưu số 115 vào điện thoại ngay bây giờ</li>
            <li>• Biết tên và địa chỉ bệnh viện gần nhà nhất có khoa cấp cứu</li>
            <li>• Chuẩn bị túi cấp cứu cơ bản: aspirin (nếu không dị ứng), thuốc thường dùng, CCCD, thẻ bảo hiểm y tế</li>
            <li>• Học cách sơ cứu cơ bản: CPR, hồi sức ngừng thở</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục. Không thay thế khám và điều trị y tế.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {emergencyModal !== null && (
        <EmergencyModal
          item={EMERGENCY_GROUPS[emergencyModal]}
          idx={emergencyModal}
          total={EMERGENCY_GROUPS.length}
          onClose={() => setEmergencyModal(null)}
          onPrev={() => setEmergencyModal(i => Math.max(0, i - 1))}
          onNext={() => setEmergencyModal(i => Math.min(EMERGENCY_GROUPS.length - 1, i + 1))}
          hasPrev={emergencyModal > 0}
          hasNext={emergencyModal < EMERGENCY_GROUPS.length - 1}
        />
      )}
    </div>
  );
}
