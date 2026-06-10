import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-sleep-orbit-kf';

const SLEEP_FACTS = [
  {
    icon: '💪', label: 'Phục hồi cơ bắp', desc: 'Trong giai đoạn ngủ sâu (slow-wave sleep), cơ thể tiết GH — hormone tăng trưởng giúp sửa chữa mô cơ sau tập luyện.',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: '95% lượng Growth Hormone (GH) được tiết ra trong giấc ngủ sâu N3 — thiếu ngủ đồng nghĩa thiếu GH, và mô cơ không được sửa chữa dù bạn tập bao nhiêu.',
    detail: 'Giấc ngủ sâu (slow-wave sleep, N3) là "xưởng sửa chữa" của cơ thể. Đây là giai đoạn hormone tăng trưởng GH được tiết ra mạnh nhất — kích thích tổng hợp protein, sửa chữa vi tổn thương cơ sau tập, và tái tạo mô liên kết. Bỏ qua giấc ngủ = bỏ qua phần lớn kết quả tập luyện.',
    details: [
      'Hormone tăng trưởng GH được tiết 70–80% trong giai đoạn N3 (ngủ sâu) trong vòng 1–2 tiếng đầu sau khi ngủ.',
      'GH kích thích tổng hợp protein cơ (muscle protein synthesis) — quá trình biến amino acid thành mô cơ mới.',
      'Thiếu ngủ 1 đêm có thể giảm tổng hợp protein cơ 18% — tương đương giảm hiệu quả buổi tập đáng kể.',
      'Cortisol (hormone phân hủy cơ) tăng cao khi thiếu ngủ — đây là lý do tập nhiều mà không thấy kết quả khi ngủ kém.',
      'Ngoài GH, insulin-like growth factor 1 (IGF-1) cũng tăng trong giấc ngủ sâu — hỗ trợ phục hồi xương và gân.',
      'Ngủ 7–9 tiếng liên tục quan trọng hơn ngủ nhiều lần ngắn — N3 xảy ra chủ yếu trong 4 tiếng đầu giấc ngủ.',
    ],
    points: [
      { icon: '🧪', label: 'GH tiết 70–80%', note: 'Trong N3 (ngủ sâu) 1–2h đầu giấc ngủ' },
      { icon: '💪', label: 'Tổng hợp protein', note: 'Thiếu 1 đêm ngủ → giảm 18% hiệu quả' },
      { icon: '📉', label: 'Cortisol tăng', note: 'Thiếu ngủ → phân hủy cơ, mất kết quả tập' },
      { icon: '⏰', label: '7–9 tiếng liên tục', note: 'Quan trọng hơn ngủ nhiều lần ngắn' },
    ],
  },
  {
    icon: '🧠', label: 'Tăng cường trí nhớ', desc: 'Não củng cố thông tin học được trong ngày. Thiếu ngủ làm giảm khả năng học kỹ năng mới và hồi phục kỹ thuật vận động.',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Trong giấc ngủ REM, não "replay" lại các kỹ năng đã học trong ngày — đây là lý do tại sao ngủ sau khi học giúp nhớ lâu hơn 40% so với thức.',
    detail: 'Não không "tắt" khi ngủ — nó đang bận rộn "lưu file". Trong giai đoạn N2 (sleep spindles) và REM, hippocampus chuyển thông tin ngắn hạn sang vỏ não để lưu trữ dài hạn. Đây là quá trình memory consolidation — thiếu ngủ làm gián đoạn quá trình này.',
    details: [
      'Memory consolidation xảy ra trong 2 giai đoạn: N2 (kỹ năng vận động, thủ tục) và REM (kiến thức, trí nhớ khai báo).',
      'Sleep spindles trong N2 tích cực chuyển thông tin từ hippocampus (ngắn hạn) sang neocortex (dài hạn).',
      'Giấc ngủ REM đặc biệt quan trọng cho kỹ năng vận động — học một động tác mới cần ngủ để não củng cố motor memory.',
      'Thiếu 1 đêm ngủ làm giảm khả năng học từ mới xuống 40% và giảm khả năng ghi nhớ kỹ năng mới xuống 30%.',
      'Ngủ trưa 20–30 phút (power nap) chứa đủ N2 để cải thiện hiệu suất học sau đó đáng kể.',
      '"Sleep to forget" — REM cũng giúp loại bỏ thông tin không cần thiết, giữ cho não không bị quá tải.',
    ],
    points: [
      { icon: '🔄', label: 'Memory replay', note: 'REM replay kỹ năng đã học — nhớ lâu hơn 40%' },
      { icon: '⚡', label: 'Sleep spindles', note: 'N2 chuyển trí nhớ ngắn → dài hạn' },
      { icon: '🏃', label: 'Motor memory', note: 'Kỹ thuật vận động cần ngủ REM để định hình' },
      { icon: '☀️', label: 'Power nap 20 phút', note: 'Đủ N2 để boost hiệu suất học chiều' },
    ],
  },
  {
    icon: '🍽️', label: 'Kiểm soát hormone đói', desc: 'Ngủ kém tăng ghrelin (hormone đói) và giảm leptin (hormone no). Người ngủ kém thường thèm đồ ngọt và thức ăn nhiều calo hơn.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 2 đêm ngủ ít hơn 2 tiếng so với nhu cầu làm tăng ghrelin 28% và giảm leptin 18% — tương đương cảm giác đói như nhịn ăn 1.000 kcal.',
    detail: 'Ghrelin và leptin là 2 hormone điều khiển cảm giác đói và no. Thiếu ngủ làm mất cân bằng nghiêm trọng: ghrelin tăng (bạn đói hơn), leptin giảm (bạn không cảm thấy no dù đã ăn đủ). Đây là cơ chế sinh học giải thích tại sao người ngủ ít thường ăn nhiều hơn và dễ tăng cân hơn.',
    details: [
      'Ghrelin (hormone đói) được sản xuất chủ yếu ở dạ dày — tăng trước bữa ăn để báo hiệu cần nạp năng lượng.',
      'Leptin (hormone no) được tiết từ mô mỡ — tăng sau ăn và trong giấc ngủ để báo no và ức chế ăn.',
      'Chỉ 2 đêm ngủ 4 tiếng: ghrelin tăng 28%, leptin giảm 18%, và người tham gia tự báo đói hơn 24%.',
      'Người ngủ ít thường thèm carb tinh luyện, đồ ngọt và thức ăn nhiều calo — não tìm kiếm năng lượng nhanh.',
      'Cortisol cao do thiếu ngủ cũng làm tăng insulin resistance — cơ thể khó xử lý đường huyết, càng thèm ngọt hơn.',
      'Khắc phục: ngủ đủ 7–9 tiếng là "can thiệp dinh dưỡng" miễn phí giúp kiểm soát cảm giác thèm ăn.',
    ],
    points: [
      { icon: '📈', label: 'Ghrelin +28%', note: 'Chỉ sau 2 đêm ngủ thiếu 2 tiếng' },
      { icon: '📉', label: 'Leptin −18%', note: 'Không cảm thấy no dù đã ăn đủ' },
      { icon: '🍬', label: 'Thèm ngọt', note: 'Não tìm năng lượng nhanh khi thiếu ngủ' },
      { icon: '💡', label: 'Ngủ đủ = kiểm soát ăn', note: 'Can thiệp dinh dưỡng miễn phí tốt nhất' },
    ],
  },
  {
    icon: '❤️', label: 'Sức khỏe tim mạch', desc: 'Ngủ đủ giúp hạ huyết áp, giảm viêm và cân bằng nhịp tim. Ngủ dưới 6 giờ tăng nguy cơ tim mạch đáng kể.',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người ngủ dưới 6 tiếng/đêm có nguy cơ tăng huyết áp cao hơn 48% và nguy cơ đau tim cao hơn 200% so với người ngủ 7–8 tiếng.',
    detail: 'Tim và mạch máu cần giấc ngủ để "bảo dưỡng". Trong giấc ngủ sâu, huyết áp giảm 10–20% (nocturnal dipping) — đây là "kỳ nghỉ" quan trọng cho hệ tim mạch. Người không có nocturnal dipping (thường do thiếu ngủ) có nguy cơ bệnh tim mạch cao hơn đáng kể.',
    details: [
      'Nocturnal dipping: huyết áp bình thường giảm 10–20% trong giấc ngủ — tim và mạch máu được nghỉ ngơi thực sự.',
      'Thiếu ngủ làm mất nocturnal dipping — tim phải hoạt động 24/7 không có kỳ nghỉ, dẫn đến tổn thương tích lũy.',
      'CRP (C-reactive protein) — chỉ số viêm — tăng cao khi thiếu ngủ, đây là yếu tố nguy cơ độc lập của xơ vữa động mạch.',
      'Thiếu ngủ làm tăng fibrinogen (protein đông máu) — tăng nguy cơ hình thành cục máu đông.',
      'Ngủ dưới 6 tiếng liên tục trong 2 tuần: nguy cơ tim mạch tương đương hút 1 gói thuốc/ngày.',
      'Cải thiện giấc ngủ từ 6 lên 7 tiếng đã giảm đáng kể nguy cơ tim mạch theo nghiên cứu NHANES 2019.',
    ],
    points: [
      { icon: '📉', label: 'Nocturnal dipping', note: 'HA giảm 10–20% khi ngủ — tim được nghỉ' },
      { icon: '🔥', label: 'CRP viêm tăng', note: 'Thiếu ngủ → viêm mãn tính → xơ vữa' },
      { icon: '⚠️', label: 'Nguy cơ +200%', note: 'Ngủ <6h → nguy cơ đau tim cao hơn 2× ' },
      { icon: '💊', label: 'Liều thuốc miễn phí', note: '+1 tiếng ngủ = giảm đáng kể nguy cơ tim' },
    ],
  },
  {
    icon: '😊', label: 'Ổn định tâm trạng', desc: 'Giấc ngủ đủ giúp kiểm soát cảm xúc tốt hơn, giảm lo âu, cáu gắt và dễ duy trì động lực tập luyện.',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thiếu ngủ làm amygdala (trung tâm cảm xúc) phản ứng mạnh hơn 60% với kích thích tiêu cực — giải thích tại sao người mệt dễ cáu hơn và khó kiểm soát cảm xúc.',
    detail: 'Giấc ngủ REM đóng vai trò đặc biệt quan trọng trong điều tiết cảm xúc. Trong REM, não xử lý lại các ký ức cảm xúc trong môi trường noradrenaline thấp — giúp "giải độc" cảm xúc tiêu cực mà không gây thêm stress. Matthew Walker gọi đây là "overnight therapy" — liệu pháp ban đêm tự nhiên.',
    details: [
      'Amygdala — trung tâm xử lý cảm xúc và phản ứng sợ hãi — tăng hoạt động 60% khi thiếu ngủ.',
      'Kết nối giữa prefrontal cortex (lý trí) và amygdala (cảm xúc) yếu đi khi thiếu ngủ — mất kiểm soát cảm xúc.',
      'Giấc ngủ REM "detox" cảm xúc: xử lý lại ký ức trong môi trường stress thấp, giảm cường độ cảm xúc tiêu cực.',
      'Thiếu ngủ mãn tính làm tăng nguy cơ trầm cảm lên 2× và lo âu lên 3× theo nghiên cứu dọc dài hạn.',
      'Dopamine pathway (hệ thống thưởng) cũng bị ảnh hưởng — thiếu ngủ giảm cảm giác vui, giảm động lực tập luyện.',
      'Ngủ tốt 7–9 tiếng là nền tảng của sức khỏe tâm thần — không có biện pháp nào thay thế được.',
    ],
    points: [
      { icon: '🧠', label: 'Amygdala +60%', note: 'Phản ứng tiêu cực mạnh hơn khi thiếu ngủ' },
      { icon: '🌙', label: 'REM therapy', note: 'Xử lý cảm xúc ban đêm — "overnight therapy"' },
      { icon: '😰', label: 'Trầm cảm +2×', note: 'Thiếu ngủ mãn tính → nguy cơ gấp đôi' },
      { icon: '⚡', label: 'Dopamine giảm', note: 'Mất động lực, giảm cảm giác vui khi thiếu ngủ' },
    ],
  },
];

const SLEEP_STAGES = [
  {
    stage: 'N1 — Ngủ nông', label: 'N1 — Ngủ nông', icon: '🌫️',
    time: '5–10 phút', color: '#06b6d4', rgb: '6,182,212',
    desc: 'Chuyển tiếp từ thức sang ngủ. Cơ thể bắt đầu thư giãn, nhịp tim chậm lại.',
    img: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'N1 chỉ chiếm 5% giấc ngủ và cực kỳ dễ bị gián đoạn — đây là giai đoạn bạn "giật mình" khi ngủ (hypnic jerk) và có thể nghe thấy âm thanh xung quanh.',
    detail: 'N1 là cánh cổng giữa thức và ngủ — não bắt đầu chuyển từ sóng beta (tỉnh táo) sang sóng alpha rồi theta (buồn ngủ). Đây là giai đoạn ngắn nhất và nhạy cảm nhất: ánh sáng, tiếng ồn nhỏ cũng đủ đánh thức bạn hoàn toàn.',
    details: [
      'Nhịp tim chậm lại, cơ bắp giãn ra, nhiệt độ cơ thể bắt đầu giảm nhẹ.',
      'Sóng não chuyển từ alpha (8–12 Hz, thư giãn) sang theta (4–7 Hz, buồn ngủ) — ý thức mờ dần.',
      'Hypnic jerk (giật mình khi ngủ): não hiểu nhầm trạng thái thư giãn đột ngột là "ngã" và gửi tín hiệu co cơ.',
      'Ở N1, bạn vẫn có thể nghe thấy âm thanh và hình dung hình ảnh mơ màng (hypnagogic hallucination).',
      'Nếu bị đánh thức ở N1, bạn thường nói "tôi chưa ngủ" — dù thực ra đã ngủ được vài phút.',
      'Giai đoạn N1 lặp lại ngắn hơn ở các chu kỳ sau — cơ thể "đi sâu" nhanh hơn khi đã quen ngủ.',
    ],
    points: [
      { icon: '⚡', label: 'Hypnic jerk', note: 'Giật mình khi ngủ — phản xạ bình thường của não' },
      { icon: '👂', label: 'Vẫn nghe được', note: 'Âm thanh nhỏ cũng có thể đánh thức hoàn toàn' },
      { icon: '🌊', label: 'Sóng theta', note: 'Não chuyển từ alpha → theta, ý thức mờ dần' },
      { icon: '⏱️', label: 'Chỉ 5% giấc ngủ', note: 'Giai đoạn ngắn và dễ bị gián đoạn nhất' },
    ],
  },
  {
    stage: 'N2 — Ngủ nhẹ', label: 'N2 — Ngủ nhẹ', icon: '🌙',
    time: '~50% giấc ngủ', color: '#0ea5e9', rgb: '14,165,233',
    desc: 'Nhiệt độ cơ thể giảm, nhịp tim chậm hơn. Sleep spindles xuất hiện — quan trọng cho trí nhớ.',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'N2 chiếm ~50% tổng giấc ngủ — đây là nơi "sleep spindles" xuất hiện, giúp chuyển thông tin từ trí nhớ ngắn hạn sang dài hạn và bảo vệ giấc ngủ khỏi bị gián đoạn.',
    detail: 'N2 là giai đoạn ngủ thực sự bắt đầu — ý thức gần như tắt hẳn, khó đánh thức hơn N1. Điều đặc biệt là sleep spindles (chuỗi sóng não tần số cao) xuất hiện trong N2, đóng vai trò quan trọng trong việc củng cố trí nhớ thủ tục và kỹ năng vận động. Power nap 20 phút chứa đủ N2 để cải thiện hiệu suất chiều.',
    details: [
      'Nhiệt độ cơ thể giảm tiếp, nhịp tim và hô hấp chậm và đều hơn N1.',
      'Sleep spindles: chuỗi sóng não 12–15 Hz, kéo dài 0.5–3 giây, xuất hiện 1–2 lần/phút trong N2.',
      'Sleep spindles ức chế tín hiệu cảm giác từ đồi thị (thalamus) — "cách âm" não khỏi kích thích bên ngoài.',
      'K-complexes: sóng não đơn biên độ cao, phản ứng với tiếng ồn đột ngột — bảo vệ giấc ngủ không bị gián đoạn.',
      'N2 quan trọng cho trí nhớ thủ tục (procedural memory) — học nhạc cụ, kỹ thuật thể thao, thao tác tay.',
      'Power nap 20 phút đủ để vào N2 và tận dụng sleep spindles — không cần vào N3 mới có lợi ích trí nhớ.',
    ],
    points: [
      { icon: '🌀', label: 'Sleep spindles', note: 'Chuyển trí nhớ ngắn → dài hạn mỗi phút' },
      { icon: '🔇', label: 'Cách âm não', note: 'Spindles chặn tín hiệu ngoài — ngủ sâu hơn' },
      { icon: '⚡', label: 'K-complexes', note: 'Bảo vệ giấc ngủ khỏi tiếng ồn đột ngột' },
      { icon: '☀️', label: 'Power nap 20 phút', note: 'Đủ N2 để cải thiện trí nhớ kỹ năng' },
    ],
  },
  {
    stage: 'N3 — Ngủ sâu', label: 'N3 — Ngủ sâu', icon: '🌑',
    time: '20–25%', color: '#6366f1', rgb: '99,102,241',
    desc: 'Giai đoạn phục hồi thể chất quan trọng nhất. Hormone tăng trưởng được tiết. Khó thức dậy nhất.',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'N3 (slow-wave sleep) là giai đoạn "đại tu" cơ thể — GH tiết mạnh nhất, hệ miễn dịch hồi phục, não tẩy sạch chất thải độc hại qua hệ glymphatic. Mất N3 = mất phục hồi.',
    detail: 'N3 là đỉnh cao của giấc ngủ — khó thức dậy nhất, và nếu bị đánh thức đột ngột sẽ gây "sleep inertia" (choáng váng, mất phương hướng). Hệ glymphatic não hoạt động mạnh nhất trong N3, tẩy sạch beta-amyloid và tau protein — các chất liên quan đến Alzheimer. Thiếu N3 mãn tính là một trong các yếu tố nguy cơ của sa trí tuệ.',
    details: [
      'Sóng delta (0.5–4 Hz) chiếm ưu thế — sóng não chậm và biên độ cao nhất trong toàn bộ giấc ngủ.',
      'Growth Hormone (GH) được tiết 70–80% trong N3 — tập gym mà không có N3 đủ là lãng phí công sức tập.',
      'Hệ thống glymphatic hoạt động mạnh: dịch não tủy rửa sạch chất thải chuyển hóa, bao gồm beta-amyloid (Alzheimer-linked).',
      'Hệ miễn dịch sản xuất cytokines và tăng hoạt động T-cell — thiếu N3 làm giảm đáp ứng vaccine và chống nhiễm trùng.',
      'N3 nhiều nhất trong 3 giờ đầu đêm — ngủ muộn đồng nghĩa mất phần lớn N3 dù tổng thời gian ngủ không đổi.',
      'Không thể "bù" N3 bằng ngủ trưa — cần ngủ sớm để hệ circadian hỗ trợ N3 tự nhiên.',
    ],
    points: [
      { icon: '💉', label: 'GH tiết 70–80%', note: 'Phục hồi cơ, xương, gân — peak trong N3' },
      { icon: '🧹', label: 'Glymphatic cleanup', note: 'Tẩy beta-amyloid — bảo vệ não dài hạn' },
      { icon: '🛡️', label: 'Hệ miễn dịch', note: 'T-cell tăng — phòng bệnh và đáp ứng vaccine' },
      { icon: '🌙', label: 'N3 nhiều nhất 3h đầu', note: 'Ngủ muộn = mất N3 dù ngủ đủ giờ' },
    ],
  },
  {
    stage: 'REM — Mơ', label: 'REM — Mơ', icon: '✨',
    time: '20–25%', color: '#a78bfa', rgb: '167,139,250',
    desc: 'Não hoạt động mạnh. Củng cố trí nhớ cảm xúc, xử lý thông tin phức tạp và phục hồi tâm lý.',
    img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Trong REM, não hoạt động gần như khi thức — nhưng cơ bắp bị "tê liệt" tạm thời. Đây là giai đoạn xử lý cảm xúc, sáng tạo và "overnight therapy" mà Matthew Walker mô tả.',
    detail: 'REM (Rapid Eye Movement) là giai đoạn kỳ lạ nhất của giấc ngủ: não hoạt động như khi thức, nhưng cơ thể gần như bất động (atonia cơ — để bạn không thực hiện các hành động trong giấc mơ). Đây là thời gian não tích hợp thông tin, xử lý cảm xúc phức tạp và tạo ra các kết nối sáng tạo.',
    details: [
      'Mắt chuyển động nhanh dưới mí (rapid eye movement) — não đang "xem lại" và xử lý ký ức ban ngày.',
      'Atonia cơ (liệt cơ tạm thời) do não ức chế tủy sống — ngăn cơ thể thực hiện các hành động trong mơ.',
      'REM nhiều nhất vào buổi sáng sớm (4–6h) — thức dậy sớm hoặc báo thức cắt bỏ REM quan trọng nhất.',
      'Xử lý cảm xúc trong môi trường noradrenaline thấp — ký ức được "phát lại" mà không kèm phản ứng stress.',
      'Giải quyết vấn đề sáng tạo: nhiều phát minh, giải pháp xuất hiện sau giấc ngủ REM — não kết nối thông tin phi tuyến.',
      'Thiếu REM liên quan đến PTSD (não không "giải độc" được ký ức sang chấn), trầm cảm và lo âu.',
    ],
    points: [
      { icon: '👁️', label: 'Mắt chuyển động', note: 'Não replay và xử lý ký ức ban ngày' },
      { icon: '😴', label: 'Atonia cơ', note: 'Cơ bị liệt tạm thời — không thực hiện giấc mơ' },
      { icon: '🎨', label: 'Sáng tạo tăng', note: 'Kết nối thông tin phi tuyến khi thức dậy' },
      { icon: '🌅', label: 'REM nhiều nhất 4–6h', note: 'Báo thức sớm cắt bỏ REM quan trọng nhất' },
    ],
  },
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

function SleepTimingModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  const color = '#14b8a6'; const rgb = '20,184,166';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src="https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80&auto=format&fit=crop"
            alt="Thời điểm ngủ" className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>⏰</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2" style={{ color }}>Thời Điểm Ngủ & Thức Dậy</h2>
          <div className="rounded-xl p-3 mb-5 text-sm font-semibold" style={{ background: `rgba(${rgb},0.1)`, color, border: `1px solid rgba(${rgb},0.2)` }}>
            ✦ N3 nhiều nhất 3 giờ đầu đêm — REM nhiều nhất buổi sáng sớm. Thay đổi giờ ngủ/thức ảnh hưởng hoàn toàn khác nhau đến từng giai đoạn.
          </div>
          <p className="text-muted text-base leading-relaxed mb-5">Không phải tất cả các giờ ngủ đều như nhau. Cơ thể theo đồng hồ sinh học circadian — N3 và REM có "cửa sổ thời gian" tự nhiên. Hiểu điều này giúp bạn tối ưu hóa giấc ngủ không chỉ bằng số giờ mà còn bằng thời điểm.</p>
          <ul className="space-y-3 mb-8">
            {[
              'N3 (ngủ sâu) tập trung nhiều nhất trong 3–4 giờ đầu tiên sau khi ngủ — đây là "cửa sổ vàng" phục hồi thể chất.',
              'REM tập trung nhiều nhất vào 2–3 giờ cuối trước khi thức — buổi sáng sớm 4–7h là giai đoạn REM dài nhất.',
              'Ngủ muộn 2 tiếng (2h AM thay vì 0h AM) không làm giảm tổng giờ ngủ nhưng cắt bỏ gần toàn bộ N3.',
              'Thức dậy sớm hơn 2 tiếng (5h AM thay vì 7h AM) không giảm nhiều N3 nhưng mất phần lớn REM quan trọng.',
              'Cùng 6 tiếng ngủ nhưng 23h–5h (nhiều N3, ít REM) khác hoàn toàn với 1h–7h (ít N3, nhiều REM).',
              'Mục tiêu lý tưởng: ngủ 22h–23h, dậy 6h–7h — tối ưu cả N3 (đầu đêm) lẫn REM (sáng sớm).',
            ].map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '🌑', label: 'N3 cửa sổ vàng', note: '3–4 tiếng đầu đêm — không thể bù lại' },
              { icon: '✨', label: 'REM buổi sáng', note: '4–7h AM — thức sớm mất toàn bộ REM' },
              { icon: '😴', label: 'Ngủ muộn = mất N3', note: 'Dù ngủ đủ giờ, cơ thể không hồi phục' },
              { icon: '⏰', label: 'Lý tưởng: 22–23h', note: 'Dậy 6–7h — cân bằng N3 + REM' },
            ].map((pt, pi) => (
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
          <p className="text-center text-xs text-muted opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

function SleepFactModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
  const { color, rgb } = item;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2" style={{ color }}>{item.label}</h2>
          <div className="rounded-xl p-3 mb-5 text-sm font-semibold" style={{ background: `rgba(${rgb},0.1)`, color, border: `1px solid rgba(${rgb},0.2)` }}>✦ {item.keyFact}</div>
          <p className="text-muted text-base leading-relaxed mb-5">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
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
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {SLEEP_FACTS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

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
  const [sleepFactIdx, setSleepFactIdx] = useState(null);
  const [sleepStageIdx, setSleepStageIdx] = useState(null);
  const [sleepTimingOpen, setSleepTimingOpen] = useState(false);

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
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-teal-400 transition-colors">
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
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
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
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
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
        <p className="text-muted text-lg mb-6">Muốn khỏe bền, đừng chỉ tập thêm — hãy ngủ tốt hơn.</p>
        <div className="grid gap-3">
          {SLEEP_FACTS.map((f, i) => (
            <div key={i}
              className="flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${f.rgb},0.06)`, border: `1px solid rgba(${f.rgb},0.15)` }}
              onClick={() => setSleepFactIdx(i)}>
              <span className="text-3xl shrink-0">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg mb-1" style={{ color: f.color }}>{f.label}</div>
                <div className="text-muted text-base leading-relaxed">{f.desc}</div>
              </div>
              <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60"
                style={{ color: f.color, background: `rgba(${f.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sleep stages */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Giai Đoạn Giấc Ngủ</h2>
        <p className="text-muted text-lg mb-6">Một chu kỳ ngủ hoàn chỉnh kéo dài ~90 phút và lặp lại 4–6 lần mỗi đêm.</p>
        <div className="space-y-3">
          {SLEEP_STAGES.map((st, i) => (
            <div key={i}
              className="p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ borderColor: `rgba(${st.rgb},0.2)`, background: `rgba(${st.rgb},0.07)` }}
              onClick={() => setSleepStageIdx(i)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{st.icon}</span>
                  <span className="font-bold text-lg" style={{ color: st.color }}>{st.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold tabular-nums" style={{ color: st.color }}>{st.time}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg opacity-60" style={{ color: st.color, background: `rgba(${st.rgb},0.12)` }}>→</span>
                </div>
              </div>
              <p className="text-muted text-base leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.005]"
          style={{ background: `rgba(${RGB},0.07)`, border: `1px solid rgba(${RGB},0.2)` }}
          onClick={() => setSleepTimingOpen(true)}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-base text-muted"><strong style={{ color: COLOR }}>Lưu ý quan trọng:</strong> Giấc ngủ sâu (N3) nhiều nhất trong 3 giờ đầu đêm. REM nhiều nhất vào buổi sáng sớm. Ngủ muộn → mất giấc ngủ sâu; thức sớm → mất REM.</p>
            <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg" style={{ color: COLOR, background: `rgba(${RGB},0.12)` }}>Chi tiết →</span>
          </div>
        </div>
      </RevealBlock>

      {/* 4 steps hygiene */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vệ Sinh Giấc Ngủ 4 Bước</h2>
        <p className="text-muted text-lg mb-6">Không ép ngủ hoàn hảo, mà xây môi trường để cơ thể dễ ngủ hơn.</p>
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
              <p className="text-muted text-lg leading-relaxed mb-3">{step.content}</p>
              <div className="text-base font-semibold px-3 py-1.5 rounded-lg inline-block" style={{ color: COLOR, background: `rgba(${RGB},0.1)` }}>
                💡 {step.tip}
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day reset */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Sửa Ngủ Muộn Trong 7 Ngày</h2>
        <p className="text-muted text-lg mb-6">Không kéo giờ ngủ sớm quá mạnh ngay. Mỗi 2–3 ngày kéo sớm 15–30 phút để cơ thể thích nghi.</p>
        <div className="space-y-3">
          {SEVEN_DAY_PLAN.map((day, i) => (
            <div key={i} className="flex gap-4 items-start p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)`, border: `1px solid rgba(${RGB},0.08)` }}>
              <div className="shrink-0 w-16 text-center">
                <div className="text-base font-bold tabular-nums" style={{ color: COLOR }}>{day.day}</div>
              </div>
              <div>
                <div className="font-semibold text-text text-lg">{day.focus}</div>
                <div className="text-muted text-base mt-0.5">{day.action}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Trouble cases */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Xử Lý Tình Huống Thường Gặp</h2>
        <p className="text-muted text-lg mb-6">3 kịch bản phổ biến nhất và cách xử lý thực tế.</p>
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
                    <div key={j} className="flex items-start gap-2 text-lg">
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
        <p className="text-muted text-lg mb-6">Không cần đạt 5/5 mỗi ngày. Đạt 3/5 là đã tốt cho người mới bắt đầu.</p>
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
                {checks[i] && <span className="text-black text-base font-bold">✓</span>}
              </div>
              <span className="text-lg text-muted group-hover:text-text transition-colors">{item}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ background: `rgba(${RGB},0.15)` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${checkCount / 5 * 100}%`, background: COLOR }} />
        </div>
        <p className="text-base text-muted mt-2">{checkCount}/5 — {checkCount >= 4 ? '🌟 Xuất sắc!' : checkCount >= 3 ? '✅ Tốt!' : '⏳ Đang xây dựng'}</p>
      </RevealBlock>

      {/* Safety note */}
      <RevealBlock className="mb-12">
        <div className="p-5 rounded-2xl border" style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}>
          <h3 className="font-bold text-red-400 mb-3">⚠️ Khi Nào Cần Gặp Bác Sĩ?</h3>
          <div className="space-y-1 text-lg text-muted">
            {['Mất ngủ kéo dài hơn 3–4 tuần dù đã áp dụng vệ sinh giấc ngủ', 'Ngủ 7–9 tiếng nhưng vẫn mệt mỏi suốt ngày (có thể là sleep apnea)', 'Ngáy to, ngừng thở khi ngủ', 'Chân bứt rứt khó chịu khi ngủ (restless legs)', 'Mộng du hoặc hành vi bất thường khi ngủ'].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-400 shrink-0">•</span>{item}
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c" className="text-muted hover:text-teal-400 transition-colors text-lg">← Lối Sống Khỏe</Link>
        <Link to="/pillar/c/sleep-routine" className="text-lg font-semibold" style={{ color: COLOR }}>Routine Trước Ngủ →</Link>
      </div>

      {/* ── Sleep timing modal ── */}
      {sleepTimingOpen && <SleepTimingModal onClose={() => setSleepTimingOpen(false)} />}

      {/* ── Sleep stage modal ── */}
      {sleepStageIdx !== null && (
        <SleepFactModal
          item={SLEEP_STAGES[sleepStageIdx]}
          idx={sleepStageIdx}
          onClose={() => setSleepStageIdx(null)}
          onPrev={() => setSleepStageIdx(i => Math.max(0, i - 1))}
          onNext={() => setSleepStageIdx(i => Math.min(SLEEP_STAGES.length - 1, i + 1))}
          hasPrev={sleepStageIdx > 0}
          hasNext={sleepStageIdx < SLEEP_STAGES.length - 1}
        />
      )}

      {/* ── Sleep fact modal — outside all RevealBlocks so position:fixed works ── */}
      {sleepFactIdx !== null && (
        <SleepFactModal
          item={SLEEP_FACTS[sleepFactIdx]}
          idx={sleepFactIdx}
          onClose={() => setSleepFactIdx(null)}
          onPrev={() => setSleepFactIdx(i => Math.max(0, i - 1))}
          onNext={() => setSleepFactIdx(i => Math.min(SLEEP_FACTS.length - 1, i + 1))}
          hasPrev={sleepFactIdx > 0}
          hasNext={sleepFactIdx < SLEEP_FACTS.length - 1}
        />
      )}
    </div>
  );
}
