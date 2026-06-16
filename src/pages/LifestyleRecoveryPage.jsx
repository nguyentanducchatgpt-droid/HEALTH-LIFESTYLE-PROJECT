import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a78bfa';
const RGB = '167,139,250';
const ORBIT_ID = 'c-recovery-orbit-kf';

const RECOVERY_TYPES = [
  {
    type: 'Thụ động (Passive)', icon: '😴', color: '#6366f1', rgb: '99,102,241',
    desc: 'Nằm nghỉ, ngủ, không làm gì. Cần thiết khi kiệt sức hoàn toàn hoặc bệnh.',
    best: 'Khi đau cấp, sốt, bệnh nặng, kiệt sức hoàn toàn',
    title: 'Phục Hồi Thụ Động — Khi Nào Cần Nằm Yên',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phục hồi thụ động bị hiểu lầm nhiều nhất — nhiều người hoặc dùng quá nhiều (lười biếng hóa ngày nghỉ) hoặc quá ít (cố tập dù ốm). Thụ động đúng nghĩa chỉ cần thiết trong 3 trường hợp cụ thể: đau cấp (24–72h đầu), bệnh sốt và kiệt sức hệ thần kinh trung ương hoàn toàn. Phần còn lại, active recovery thường tốt hơn.',
    detail: 'Nghỉ hoàn toàn là công cụ, không phải mặc định. Biết khi nào cần nằm yên và khi nào cần vận động nhẹ là kỹ năng quan trọng — dùng sai cả hai đều làm chậm phục hồi.',
    details: [
      'Đau cấp 24–72h đầu: viêm cấp tính cần giảm tải hoàn toàn. RICE protocol (Rest, Ice, Compression, Elevation) áp dụng trong giai đoạn này. Sau 72h nếu không còn sưng và đau giảm, bắt đầu chuyển sang active recovery nhẹ.',
      'Bệnh sốt: khi sốt >38°C, hệ thống miễn dịch đang làm việc tối đa. Tập luyện lúc này tranh giành nguồn năng lượng với hệ miễn dịch và có thể kéo dài thời gian bệnh. Nguyên tắc "neck rule": triệu chứng trên cổ (sổ mũi, đau họng) có thể tập nhẹ; dưới cổ (sốt, mệt toàn thân) — nghỉ hoàn toàn.',
      'Kiệt sức hệ thần kinh trung ương (CNS fatigue): khác với cơ mỏi thông thường. Dấu hiệu: không có động lực tập, không cải thiện sau giấc ngủ bình thường, tâm trạng thấp, tim đập nhanh hơn khi nghỉ. CNS fatigue cần 48–72h nghỉ thực sự, không chỉ ngủ thêm.',
      'Khác với "lười": cảm thấy "không muốn tập" thông thường không phải CNS fatigue. Cách phân biệt: nếu sau 10 phút khởi động bạn cảm thấy muốn tiếp tục — đó là inertia, không phải fatigue thực sự. Nếu vẫn kiệt sức sau khởi động — ngừng lại.',
      'Giấc ngủ là core của passive recovery: cơ thể tiết GH (Growth Hormone) tối đa trong giai đoạn deep sleep (N3) — cơ bắp và mô được sửa chữa khi ngủ, không phải khi nghỉ ngồi xem TV. Passive recovery = giấc ngủ chất lượng, không chỉ là không tập.',
      'Khi nào chuyển từ passive sang active: đau giảm xuống 3/10 hoặc ít hơn, không sưng đỏ, có thể di chuyển thoải mái. Ở trường hợp bệnh: không còn sốt + năng lượng trở lại một phần. Transition dần dần — không nhảy thẳng từ nằm vào tập nặng.',
    ],
    points: [
      { icon: '🌡️', label: 'Sốt >38°C → nghỉ hoàn toàn', note: '"Neck rule": triệu chứng dưới cổ = không tập, hệ miễn dịch cần ưu tiên' },
      { icon: '🧠', label: 'CNS fatigue khác cơ mỏi', note: 'Tim đập nhanh khi nghỉ + không cải thiện sau ngủ = nghỉ 48–72h thực sự' },
      { icon: '💤', label: 'Giấc ngủ = core recovery', note: 'GH tiết tối đa trong deep sleep — nằm xem TV không phải passive recovery' },
      { icon: '⏰', label: 'Đau cấp: 24–72h RICE', note: 'Sau 72h đau giảm, chuyển sang active recovery — không kéo dài passive' },
    ],
  },
  {
    type: 'Chủ động (Active)', icon: '🚶', color: '#10b981', rgb: '16,185,129',
    desc: 'Vận động nhẹ giúp tăng lưu thông máu, giảm DOMS và đẩy nhanh phục hồi.',
    best: 'Ngày sau tập nặng, cuối tuần, ngày không tập',
    title: 'Phục Hồi Chủ Động — Vận Động Để Hồi Phục Nhanh Hơn',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Active recovery (vận động Zone 1–2, nhịp tim <130) thực sự đẩy nhanh phục hồi hơn nghỉ hoàn toàn cho hầu hết trường hợp. Cơ chế: tăng lưu thông máu đưa oxy và dưỡng chất đến cơ đang phục hồi, đẩy nhanh loại bỏ lactate và chất thải chuyển hóa. Nghiên cứu cho thấy giảm DOMS 20–30% so với nghỉ hoàn toàn.',
    detail: 'Active recovery là "ngày tập nhẹ" — không phải ngày nghỉ có thêm vài bài tập. Cường độ phải đủ thấp để không tạo thêm stress cơ bắp. Tiêu chí đơn giản: bạn phải có thể nói chuyện thoải mái trong suốt buổi tập.',
    details: [
      'Zone 1–2 là cường độ đúng: Zone 1 (<60% max HR ~110–120 bpm) và Zone 2 (60–70% max HR ~120–140 bpm cho người 30 tuổi). Đây là vùng cơ thể dùng chủ yếu fat làm nhiên liệu, không tạo thêm stress tập luyện đáng kể và tăng lưu thông máu nhiều nhất.',
      'DOMS (Delayed Onset Muscle Soreness): đau cơ 24–72h sau tập nặng do micro-tears cơ và phản ứng viêm nhẹ. Đây là quá trình bình thường và cần thiết để cơ to hơn. Active recovery giảm đau DOMS không phải bằng cách ức chế viêm mà bằng cách tăng lưu thông máu đến vùng đang phục hồi.',
      'Lactate clearance: tập cường độ cao tạo ra lactate tích lũy. Active recovery Zone 1–2 hiệu quả nhất để xử lý lactate — tốt hơn nghỉ hoàn toàn vì cơ bắp vẫn đang dùng lactate như nhiên liệu khi hoạt động nhẹ. Đây là lý do vận động viên chuyên nghiệp không ngồi yên sau thi đấu.',
      'Hoạt động phù hợp: đi bộ nhẹ (20–30 phút), đạp xe nhẹ nhàng (20–25 phút, resistance thấp), bơi nhẹ (không sprint), yoga nhẹ, stretching + mobility. Không phù hợp: HIIT, lifting nặng, chạy bộ nhanh.',
      'Tần suất: 1–2 ngày active recovery/tuần cho người tập 4–5 lần/tuần. Người mới tập: 2–3 ngày active recovery/tuần. Người tập ít (2–3 lần/tuần): không cần active recovery riêng — các ngày không tập đã là active recovery tự nhiên nếu có NEAT bình thường.',
      'Tâm lý active recovery: nhiều người cảm thấy "tội lỗi" khi không tập nặng. Hiểu rằng active recovery là một phần của training cycle giúp bỏ tâm lý này. Tập nặng mà không có recovery là "building without consolidating" — cơ bắp và hệ thần kinh cần thời gian thích nghi.',
    ],
    points: [
      { icon: '🩸', label: 'Tăng lưu thông máu đến cơ', note: 'Oxy + dưỡng chất đến vùng phục hồi — đẩy lactate và chất thải ra nhanh hơn' },
      { icon: '😮‍💨', label: 'DOMS giảm 20–30%', note: 'Active recovery rút ngắn đau cơ sau tập so với nghỉ hoàn toàn' },
      { icon: '💬', label: 'Talk test = cường độ đúng', note: 'Nói chuyện thoải mái trong suốt buổi = Zone 1–2, không tạo thêm stress' },
      { icon: '🏊', label: 'Đi bộ / đạp xe / bơi nhẹ', note: 'Low impact, low resistance — không phải HIIT hay lifting nhẹ hơn bình thường' },
    ],
  },
  {
    type: 'Phục hồi theo vùng', icon: '🎯', color: '#0ea5e9', rgb: '14,165,233',
    desc: 'Tập trung giãn cơ và bài tập nhẹ cho vùng đau mỏi cụ thể.',
    best: 'Đau cổ vai gáy, lưng dưới, gối mãn tính',
    title: 'Phục Hồi Theo Vùng — Điều Trị Có Địa Chỉ',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phục hồi theo vùng khác với stretch toàn thân ở chỗ có "địa chỉ" cụ thể — nhắm vào cơ chế gốc của từng vùng đau, không chỉ giãn cơ bề mặt. Đau cổ vai gáy cần counteract pattern gù + vai đổ về trước. Lưng dưới cần giải phóng hip flexor và tăng cường deep core. Gối cần quad/hamstring balance và hip stability.',
    detail: 'Đau mãn tính thường không do "cơ yếu" hay "cơ căng" đơn thuần — mà do imbalance: một nhóm cơ co cụm (tight) kéo xương lệch, nhóm đối lập bị ức chế (weak). Phục hồi theo vùng phải giải quyết cả hai phía: giãn nhóm tight và kích hoạt nhóm weak.',
    details: [
      'Cổ vai gáy (pattern gù): cơ ngực (pectoralis) và cơ thang trên (upper trapezius) bị tight. Cơ thang giữa/dưới và rhomboids bị weak. Điều trị: giãn ngực (doorway stretch), chin tuck để kéo giãn SCM, shoulder roll để tăng lưu thông khớp vai. Không chỉ "xoay cổ" ngẫu nhiên.',
      'Lưng dưới: hip flexors (psoas, iliacus) bị tight do ngồi lâu, kéo xương chậu ra trước (anterior pelvic tilt) → lưng dưới bị overextend. Core sâu (transversus abdominis) bị weak. Điều trị: hip flexor stretch (lunge) + cat-cow + bird-dog activation. Không phải "đứng thẳng" đơn giản.',
      'Gối: phổ biến nhất là "runner\'s knee" (patellofemoral pain) và IT band syndrome. Nguyên nhân thường là quad dominance (mông và hamstring yếu) và hip stability kém khiến gối đổ vào trong khi chuyển động. Điều trị nhắm vào hip abductor (glute med) và hamstring, không chỉ foam roll quanh gối.',
      'Vai (impingement): vai đổ về trước + nội xoay vai → gân rotator cuff bị kẹp trong không gian dưới mỏm cùng vai. Điều trị: ngoại xoay vai (external rotation với band), retraction bả vai (squeeze shoulder blades), giãn cơ ngực. Không tập overhead nặng cho đến khi giải quyết gốc rễ.',
      'Foam rolling vai trò: dùng foam roller để tăng lưu thông trước khi stretch (tác dụng myofascial release). Nhưng foam rolling không thay thế việc kéo giãn và kích hoạt cơ yếu. Thứ tự: foam roll → giãn nhóm tight → kích hoạt nhóm weak. Ba bước, không chỉ 1.',
      'Khi nào cần chuyên gia: đau không cải thiện sau 4–6 tuần tự xử lý, đau có hướng phóng xuống tay/chân (có thể là dây thần kinh bị chèn), đau kèm tê bì hoặc mất lực cơ đột ngột — cần đến physiotherapist hoặc bác sĩ thể thao, không tự xử lý tiếp.',
    ],
    points: [
      { icon: '⚖️', label: 'Tight vs Weak — cả hai phía', note: 'Giãn nhóm tight + kích hoạt nhóm weak — không chỉ stretch bề mặt' },
      { icon: '🦴', label: 'Cổ vai: counteract gù', note: 'Giãn pectoralis + kích hoạt rhomboids — pattern gù phải sửa từ gốc' },
      { icon: '🦵', label: 'Lưng dưới: hip flexor + deep core', note: 'Hip flexors tight → pelvis tilt → lưng bị overextend. Psoas stretch + bird-dog' },
      { icon: '🏥', label: 'Tê bì hoặc mất lực → gặp chuyên gia', note: 'Không tự xử lý khi có dấu hiệu thần kinh — physiotherapist hoặc bác sĩ thể thao' },
    ],
  },
];

const ROUTINE_10 = [
  {
    name: 'Thở cơ hoành', duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng',
    icon: '🫁', color: '#14b8a6', rgb: '20,184,166',
    title: 'Thở Cơ Hoành — Reset Hệ Thần Kinh',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở cơ hoành kích hoạt hệ thần kinh phó giao cảm (rest & digest) và ức chế giao cảm (fight or flight) trong vòng 2–3 nhịp thở. Đây là bài khởi động tốt nhất để "báo hiệu" cho cơ thể rằng đây là thời gian phục hồi, không phải tập luyện. Không làm bước này, cơ thể vẫn ở trạng thái stress khi bắt đầu stretch.',
    detail: 'Hầu hết mọi người thở ngực (chest breathing) — lồng ngực nâng, vai nhích lên. Thở bụng (diaphragmatic breathing) dùng cơ hoành — cơ hô hấp chính bị "tắt" bởi stress và ngồi nhiều. 1 phút thở bụng đúng cách bằng 5–10 phút thư giãn thông thường về tác động hệ thần kinh.',
    details: [
      'Cơ hoành (diaphragm): cơ hình vòm ngăn cách ngực và bụng. Khi hít vào, cơ hoành co xuống → bụng phồng ra (không phải ngực nâng). Khi thở ra, cơ hoành thả lỏng → bụng xẹp tự nhiên. Đây là cơ hô hấp chính — ngực chỉ là hỗ trợ.',
      'Thở ngực vs thở bụng: thở ngực dùng cơ phụ (scalenes, sternocleidomastoid, trapezius) — những cơ này cũng là cơ căng thẳng mãn tính ở dân văn phòng. Thở ngực liên tục duy trì căng cơ cổ vai gáy. Thở bụng "tắt" cơ phụ và giải phóng căng cơ vùng này.',
      'Vagus nerve activation: thở chậm + thở bụng kích hoạt dây thần kinh phế vị (vagus nerve) — dây thần kinh dài nhất của hệ thần kinh phó giao cảm. Kích hoạt vagus giảm nhịp tim, hạ huyết áp, giảm cortisol và chuyển não từ beta waves (tập trung/stress) sang alpha waves (thư giãn tỉnh táo).',
      'Kỹ thuật đúng: nằm hoặc ngồi thẳng lưng, đặt 1 tay lên bụng, 1 tay lên ngực. Hít vào 4 giây — tay bụng nâng lên, tay ngực hầu như không di chuyển. Thở ra 6 giây — bụng xẹp từ từ. Tỷ lệ thở ra > hít vào kích hoạt phó giao cảm mạnh hơn.',
      'Vì sao bắt đầu routine bằng thở: cơ thể cần 2–3 phút để chuyển từ trạng thái active (sau workout) sang trạng thái recovery. Stretch trong khi cơ thể vẫn ở trạng thái giao cảm kém hiệu quả hơn — cơ bắp sẽ không "buông" hoàn toàn. 1 phút thở bụng trước là "warm-up" cho hệ thần kinh.',
      'Box breathing variant: nếu muốn hiệu quả cao hơn, dùng box breathing — hít 4s, giữ 4s, thở ra 4s, giữ 4s. Được Navy SEALs sử dụng để reset nhanh hệ thần kinh trong tình huống stress cao. Áp dụng sau workout cường độ cao hoặc ngày stress công việc.',
    ],
    points: [
      { icon: '🧠', label: 'Kích hoạt phó giao cảm', note: 'Vagus nerve → nhịp tim giảm, cortisol giảm, não chuyển sang alpha waves' },
      { icon: '💪', label: 'Tay bụng nâng, tay ngực yên', note: 'Kiểm tra đúng kỹ thuật — ngực ít di chuyển là thở bụng đúng cách' },
      { icon: '⏱️', label: 'Thở ra 6s > hít vào 4s', note: 'Exhale dài hơn inhale = kích hoạt phó giao cảm mạnh hơn' },
      { icon: '🎯', label: 'Reset trước khi stretch', note: 'Cơ "buông" tốt hơn khi hệ thần kinh đã ở trạng thái rest — không skip bước này' },
    ],
  },
  {
    name: 'Shoulder roll', duration: '1 phút', note: '10 vòng trước + 10 vòng sau',
    icon: '🔄', color: '#f97316', rgb: '249,115,22',
    title: 'Shoulder Roll — Giải Phóng Cơ Thang',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Shoulder roll là bài đơn giản nhất nhưng có tác dụng trực tiếp nhất lên cơ thang (trapezius) — cơ bị căng nhất ở dân ngồi bàn. Xoay vai ra sau (backward roll) counteract pattern vai đổ về trước và kích hoạt rhomboids + lower trapezius đang bị ức chế. 10 vòng trước + 10 vòng sau = bơm dịch khớp vai và giải phóng căng cơ hiệu quả hơn chỉ xoay 1 chiều.',
    detail: 'Không phải tất cả shoulder roll đều có tác dụng như nhau. Xoay về trước (forward roll) thực ra làm tight thêm pectoralis minor và internal rotators. Xoay về sau (backward roll) mới là chiều cần thiết để counteract pattern ngồi máy tính. Tỷ lệ tối ưu: 1 vòng trước : 2 vòng sau.',
    details: [
      'Upper trapezius — cơ "căng thẳng" kinh điển: là cơ nâng vai, thường bị hypertonic (căng liên tục) khi stress và ngồi nhiều. Cảm giác "cổ vai gáy cứng" phần lớn đến từ upper trap. Shoulder roll bơm dịch khớp và kéo giãn cơ này trong phạm vi an toàn.',
      'Rhomboids và lower trapezius bị ức chế: khi vai đổ về trước (protraction), rhomboids và lower trap bị kéo dài và ức chế hoạt động. Xoay vai ra sau kích hoạt lại hai cơ này — bước đầu tiên để sửa posture xấu.',
      'Bơm dịch khớp vai (glenohumeral): khớp vai là khớp linh hoạt nhất cơ thể nhưng cần chuyển động tròn để phân phối synovial fluid đều khắp. Sau 45–60 phút bất động, dịch khớp kém phân phối — shoulder roll là cách tốt nhất để bơm dịch trở lại.',
      'Kỹ thuật backward roll đúng: nâng vai lên → kéo về phía sau → hạ xuống → về trước (một vòng tròn lớn). Giữ ngực mở trong suốt quá trình, không để ngực xẹp về trước. Vòng tròn lớn và chậm tốt hơn vòng nhỏ nhanh.',
      'Kết hợp với hơi thở: hít vào khi vai nâng lên và ra sau, thở ra khi vai hạ xuống và về trước. Synchronize chuyển động với hơi thở tăng relaxation response và giúp cơ buông lỏng sâu hơn.',
      'Sau shoulder roll, thêm chin tuck: shoulder roll giải phóng upper trap → ngay sau đó làm chin tuck × 5 để kéo giãn deep neck extensors và suboccipitals. Hai bài kết hợp giải quyết toàn bộ vùng cổ vai trên trong 2 phút.',
    ],
    points: [
      { icon: '↩️', label: 'Backward > forward roll', note: 'Xoay ra sau counteract pattern gù — không chỉ xoay 1 chiều bất kỳ' },
      { icon: '💧', label: 'Bơm dịch khớp vai', note: 'Synovial fluid phân phối đều khi xoay tròn — giảm tiếng kêu và cứng khớp' },
      { icon: '💪', label: 'Kích hoạt rhomboids', note: 'Lower trap + rhomboids bị ức chế khi vai đổ — xoay sau tái kích hoạt' },
      { icon: '🌬️', label: 'Sync với hơi thở', note: 'Hít vào khi vai nâng/sau — thở ra khi hạ/về trước. Cơ buông sâu hơn' },
    ],
  },
  {
    name: 'Thoracic twist', duration: '1 phút', note: '8 lần mỗi bên',
    icon: '🌀', color: '#10b981', rgb: '16,185,129',
    title: 'Thoracic Twist — Mở Khóa Cột Sống Ngực',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cột sống ngực (thoracic spine, T1–T12) là vùng "bị bỏ quên" nhất trong mobility — và là gốc rễ của nhiều vấn đề cổ, vai và lưng dưới. Thoracic kyphosis (gù lưng trên) do ngồi nhiều làm vai bị đẩy về trước và cổ phải bù bằng cách chìa về trước. Thoracic twist 8 lần mỗi bên restore rotation range of motion bị mất sau mỗi giờ ngồi.',
    detail: 'Thoracic spine được thiết kế để xoay — có 12 đốt sống với khả năng rotation ~35° mỗi bên. Khi cột sống ngực cứng (stiff), cột sống thắt lưng (lumbar) phải bù thêm rotation trong khi nó được thiết kế để flex/extend, không rotate. Đây là nguyên nhân đau lưng dưới phổ biến ở người ngồi nhiều.',
    details: [
      'Thoracic vs Lumbar rotation: thoracic spine (T1–T12) có thể xoay ~35° mỗi bên. Lumbar spine (L1–L5) chỉ có thể xoay ~5° mỗi bên. Khi T-spine cứng, L-spine bị ép xoay quá mức → disc compression → đau lưng dưới. Thoracic twist là "pressure relief valve" cho lumbar.',
      'Vị trí thực hiện: ngồi trên sàn tư thế cross-legged, hoặc ngồi trên ghế thẳng lưng. Xoay từ ngực (không từ hông), tay đặt sau đầu để giữ cổ neutral. 8 lần mỗi bên, mỗi lần xoay đến điểm cảm thấy kéo nhẹ — không ép quá mức.',
      'Nhịp thở + twist: hít vào để chuẩn bị, thở ra khi xoay — lồng ngực xẹp khi thở ra giúp xoay sâu hơn tự nhiên. Đây là "trick" quan trọng mà nhiều người bỏ qua — thở ra trước khi xoay có thể tăng range of motion 10–15%.',
      'Thoracic mobility và hô hấp: 12 cặp xương sườn gắn vào thoracic spine. T-spine cứng → xương sườn ít di động → dung tích hô hấp giảm. Thoracic twist tăng mobility T-spine = mở lồng ngực = thở sâu hơn. Đây là lý do những người hay cúi gù thường thở nông.',
      'T-spine và vai: glenohumeral rhythm — vai hoạt động tốt cần thoracic spine mobile. T-spine kyphosis → scapula wing out → impingement không gian dưới mỏm cùng vai → đau vai khi nâng tay lên cao. Fix T-spine = giảm nguy cơ shoulder impingement.',
      'Tiến triển: bắt đầu với ngồi ghế nếu không quen ngồi sàn. Khi T-spine mobile hơn, chuyển sang thoracic extension over foam roller — nằm ngửa trên foam roller đặt ngang lưng trên, duỗi người ra sau từng đốt sống. Bài này sâu hơn nhưng cần nền mobility tốt.',
    ],
    points: [
      { icon: '🔓', label: 'Mở khóa T-spine', note: 'T-spine cứng → lumbar bù rotation quá mức → đau lưng dưới — xoay ngực giải quyết gốc' },
      { icon: '🫁', label: 'T-spine mobile = thở sâu hơn', note: '12 xương sườn gắn T-spine — mobility tốt hơn = dung tích hô hấp tốt hơn' },
      { icon: '💨', label: 'Thở ra khi xoay', note: 'Lồng ngực xẹp khi exhale → xoay sâu hơn 10–15% — không xoay khi đang hít vào' },
      { icon: '🦾', label: 'Phòng shoulder impingement', note: 'T-spine kyphosis → scapula không di động đúng → vai bị kẹp. Fix source, not symptom' },
    ],
  },
  {
    name: 'Hip flexor stretch', duration: '1 phút × 2', note: 'Giữ 30–45s mỗi bên',
    icon: '🦵', color: '#f59e0b', rgb: '245,158,11',
    title: 'Hip Flexor Stretch — Giải Phóng Cơ Chậu Thắt Lưng',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hip flexors (psoas + iliacus = iliopsoas) là nhóm cơ bị tight nhất ở người ngồi nhiều — và ít được stretch nhất. Psoas tight kéo xương chậu ra trước (anterior pelvic tilt), gây lưng dưới bị overextend liên tục → đau lưng mãn tính. Giữ 30–45s mỗi bên là ngưỡng tối thiểu để phản xạ cơ relaxation (autogenic inhibition) bắt đầu tác dụng.',
    detail: 'Psoas là cơ duy nhất nối cột sống với chân — gốc từ T12-L5 (cột sống thắt lưng), đi qua xương chậu và gắn vào lesser trochanter của femur (xương đùi). Khi ngồi 8 giờ/ngày, psoas co cụm ở chiều dài ngắn — dần dần mất khả năng kéo dài hoàn toàn khi đứng.',
    details: [
      'Psoas anatomy: dài ~43cm, là cơ "sâu nhất" của cơ thể không thể sờ thấy từ bên ngoài. Gốc từ body của T12 và L1–L5, đi qua brim của xương chậu và gắn vào lesser trochanter femur. Ngoài hip flexion, psoas còn rotate cột sống và ổn định lumbar spine — cơ đa chức năng nhất.',
      'Anterior pelvic tilt (APT): psoas tight kéo xương chậu ra trước → lưng dưới bị forced into extension → cơ erector spinae phải co liên tục để giữ thân → đau lưng mãn tính. APT cũng làm bụng dưới "ưỡn ra" dù không có mỡ thừa — dấu hiệu dễ nhận biết nhất.',
      '30–45 giây ngưỡng autogenic inhibition: dưới 20 giây, cơ vẫn đang "chống lại" stretch qua phản xạ myotatic. Sau 20–30 giây, Golgi Tendon Organ (GTO) kích hoạt autogenic inhibition — cơ bắt buộc phải buông lỏng. Đây là lý do phải giữ ít nhất 30 giây — không phải tùy tiện.',
      'Tư thế lunge stretch đúng: quỳ 1 gối, chân trước gập 90°, hông đẩy ra trước (không phải cúi người) cho đến khi cảm thấy kéo ở bẹn/đùi trước chân sau. Thẳng người, không cúi về trước. Thêm arm reach overhead kéo thêm phần psoas gần cột sống.',
      'PNF stretching để tăng hiệu quả: giữ tư thế stretch, sau đó co cơ hip flexor (ép đùi trước xuống sàn) 6 giây với lực 30%, rồi thả lỏng và sink sâu hơn vào stretch. Lặp lại 3 lần. PNF (Proprioceptive Neuromuscular Facilitation) tăng range of motion nhanh hơn static stretch đơn thuần.',
      'Kết hợp với glute activation: psoas tight thường đi kèm glutes bị ức chế (reciprocal inhibition). Sau hip flexor stretch, làm glute bridge × 10 để kích hoạt glutes. Hai bài kết hợp = giải quyết cả hai phía của hội chứng lưng dưới mãn tính.',
    ],
    points: [
      { icon: '⚖️', label: 'APT — xương chậu ngả trước', note: 'Psoas tight → pelvis tilt → lưng overextend liên tục → đau mãn tính' },
      { icon: '⏱️', label: '30–45s = ngưỡng GTO', note: 'Golgi Tendon Organ bắt đầu autogenic inhibition sau 20–30s — phải giữ đủ lâu' },
      { icon: '🦵', label: 'Hông đẩy trước, không cúi người', note: 'Lunge stretch đúng: thân thẳng + hông forward — không phải người cúi về trước' },
      { icon: '🍑', label: 'Sau stretch → Glute bridge × 10', note: 'Psoas tight → glutes bị ức chế. Kích hoạt lại glutes sau khi stretch psoas' },
    ],
  },
  {
    name: 'Hamstring stretch', duration: '1 phút × 2', note: 'Ngồi chân thẳng hoặc đứng cúi',
    icon: '🏃', color: '#0ea5e9', rgb: '14,165,233',
    title: 'Hamstring Stretch — Giải Phóng Chuỗi Sau',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hamstring tight là nguyên nhân thứ hai phổ biến nhất của đau lưng dưới (sau hip flexors). Chuỗi cơ sau (posterior chain): hamstring → sacroiliac joint → erector spinae → lưng dưới đều kết nối qua fascia. Hamstring tight kéo xương chậu ra sau (posterior pelvic tilt) và tăng căng thẳng cho toàn bộ lưng dưới. 1 phút × 2 bên là minimum effective dose.',
    detail: 'Hamstring gồm 3 cơ: biceps femoris, semitendinosus, semimembranosus — đều gắn vào ischial tuberosity (xương ngồi) ở trên và đầu gối ở dưới. Ngồi nhiều giữ hamstring ở chiều dài ngắn — dần dần mất khả năng kéo dài và kéo xương chậu lệch.',
    details: [
      'Posterior chain connection: hamstring gắn vào ischial tuberosity → sacroiliac (SI) joint → sacrum → erector spinae. Khi hamstring tight, toàn bộ chuỗi này bị kéo căng. Đây là lý do nhiều người đau lưng dưới khi cúi người — không phải cột sống yếu, mà là hamstring không kéo dài được.',
      'Posterior pelvic tilt: hamstring tight kéo ischial tuberosity xuống → xương chậu xoay ra sau → lưng dưới flat (mất đường cong tự nhiên) → đĩa đệm bị nén không đều. Đối lập với APT do psoas nhưng cũng gây đau lưng theo cơ chế khác.',
      'Kỹ thuật đứng cúi (standing forward fold): đứng thẳng, gập nhẹ đầu gối (không khóa cứng), cúi từ hông (không từ lưng). Để trọng lực kéo tự nhiên thay vì cố ép. Mỗi lần thở ra, sink thêm 1–2cm. Sau 30 giây đầu tiên cảm thấy cơ bắt đầu buông lỏng.',
      'Kỹ thuật ngồi chân thẳng (seated forward fold): ngồi trên sàn, chân thẳng, ngồi thẳng lưng trước, sau đó nghiêng người ra trước từ hông (không cúi lưng tròn). Nếu không với được bàn chân, dùng dây hoặc khăn quanh bàn chân. Không quan trọng chạm đến đâu — quan trọng là cảm thấy kéo ở đùi sau.',
      'Neural tension test: một số người cảm thấy "điện giật" lan xuống chân khi stretch hamstring — đây là neural tension (dây thần kinh sciatic bị căng), không phải hamstring stretch. Nếu có triệu chứng này, không ép stretch sâu hơn và cần kiểm tra với chuyên gia.',
      'Warm hamstring stretch hiệu quả hơn: không stretch hamstring lạnh (ngay sau khi thức dậy hoặc sau thời gian ngồi dài). Làm sau thở cơ hoành và shoulder roll — cơ thể đã có lưu thông máu tốt hơn, stretch sẽ hiệu quả hơn và an toàn hơn.',
    ],
    points: [
      { icon: '🔗', label: 'Posterior chain toàn bộ', note: 'Hamstring → SI joint → erector spinae — một chuỗi fascia. Tight 1 điểm = ảnh hưởng toàn bộ' },
      { icon: '🦴', label: 'Cúi từ hông, không từ lưng', note: 'Hip hinge, không lumbar flexion — kéo giãn hamstring, không nén đĩa đệm lưng' },
      { icon: '⚡', label: 'Điện giật = neural tension', note: 'Sciatic nerve bị kéo, không phải hamstring stretch — không ép tiếp, cần tư vấn' },
      { icon: '🌡️', label: 'Stretch sau warm-up, không lạnh', note: 'Sau thở bụng + shoulder roll — lưu thông tốt hơn = stretch an toàn và hiệu quả hơn' },
    ],
  },
  {
    name: 'Child pose + thở chậm', duration: '2 phút', note: 'Thở vào 4s, ra 6s',
    icon: '🧘', color: '#8b5cf6', rgb: '139,92,246',
    title: 'Child Pose + Thở Chậm — Tổng Hợp Phục Hồi',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Child pose (balasana) kết hợp thoracic stretch + hip flexor release + lumbar decompression trong 1 tư thế. Thêm thở 4s vào / 6s ra trong tư thế này tạo ra double effect: vật lý (kéo giãn cột sống và hông) + sinh lý (kích hoạt phó giao cảm). 2 phút child pose với thở chậm tương đương 15–20 phút thư giãn thụ động về tác động hệ thần kinh.',
    detail: 'Child pose là bài kết thúc hoàn hảo vì giải quyết 3 vùng cùng lúc: lưng trên + hông + lưng dưới. Trọng lực làm việc thay cho bạn — không cần lực cơ bắp để duy trì tư thế. Kết hợp với thở 4-6, đây là "close loop" của routine — báo hiệu cho não rằng phiên phục hồi đã hoàn tất.',
    details: [
      'Child pose anatomy: quỳ gối, hông ngồi về phía gót chân, tay duỗi ra trước hoặc để dọc theo thân. Tư thế này: (1) kéo giãn erector spinae theo chiều dài cột sống, (2) mở sacroiliac joint, (3) stretch hip flexors nhẹ theo chiều ngược (hip flexion), (4) mở lồng ngực khi tay duỗi ra trước.',
      'Spinal decompression: cột sống bị nén trong suốt ngày do trọng lực và tư thế ngồi/đứng. Child pose đặt cột sống ở tư thế không chịu lực theo trục dọc (axial load-free) — đĩa đệm có cơ hội tái hydrate và phục hồi chiều cao tự nhiên. Tương tự tác dụng nằm ngủ nhưng có thêm stretch.',
      'Thở 4-6 trong child pose: hít vào 4 giây — lưng sau phồng nhẹ (posterior ribcage expansion), thở ra 6 giây — bụng chìm về phía đùi, lưng nhẹ nhàng kéo dài thêm. Mỗi nhịp thở ra là một cơ hội để sink sâu hơn vào tư thế. Sau 5–6 nhịp đầu, cơ bắt đầu buông lỏng đáng kể.',
      'Variations nếu khó ngồi gót: nếu hông không ngồi xuống được gót chân (tight quads hoặc knees), đặt 1–2 gối dưới hông. Nếu đầu không chạm sàn, dùng gối dưới đầu. Tư thế quan trọng hơn depth — cảm thấy thoải mái và có thể thở sâu là tiêu chí đúng.',
      'Phó giao cảm + thở 4-6: exhale dài hơn inhale là công thức kích hoạt phó giao cảm mạnh nhất. Sau 2 phút với 12–15 nhịp thở 4-6 trong child pose, nhịp tim có thể giảm 8–12 bpm, HRV tăng — dấu hiệu cơ thể đã chuyển hoàn toàn sang trạng thái recovery.',
      'Sau child pose — đứng dậy từ từ: thay đổi tư thế đột ngột từ nằm/quỳ lên đứng có thể gây orthostatic hypotension (chóng mặt tụt huyết áp). Đứng dậy từ từ qua tư thế ngồi, đợi 3–5 giây trước khi bước đi. Đây là lý do bài cuối là "đi bộ nhẹ 1–2 phút" — transition đệm.',
    ],
    points: [
      { icon: '🔱', label: '3 vùng trong 1 tư thế', note: 'Lưng trên + hông + lưng dưới — trọng lực làm việc, không cần lực cơ bắp' },
      { icon: '💧', label: 'Spinal decompression', note: 'Axial load-free → đĩa đệm tái hydrate — bù lại 8h cột sống chịu lực' },
      { icon: '😌', label: 'Thở ra 6s = phó giao cảm sâu', note: 'Exhale > inhale = vagus nerve activation mạnh nhất — nhịp tim giảm, HRV tăng' },
      { icon: '🐌', label: 'Đứng dậy từ từ sau đó', note: 'Đứng đột ngột gây chóng mặt — ngồi 3–5s trước khi bước đi bình thường' },
    ],
  },
  {
    name: 'Đi bộ nhẹ', duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng, bình thường hóa',
    icon: '🚶', color: '#84cc16', rgb: '132,204,22',
    title: 'Đi Bộ Nhẹ — Transition Về Trạng Thái Bình Thường',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Cool-down walk" sau routine recovery giúp cơ thể transition từ trạng thái nghỉ hoàn toàn (child pose, nằm) về trạng thái hoạt động nhẹ bình thường — tránh orthostatic hypotension và giúp máu được phân phối lại từ các chi về tuần hoàn trung tâm. 1–2 phút đi bộ nhẹ cũng "lock in" trạng thái phó giao cảm đã tạo ra trong suốt routine.',
    detail: 'Kết thúc routine với đi bộ nhẹ không phải thêm thừa — đây là bước chuyển đổi quan trọng. Giống như sau surgery không cho bệnh nhân nằm yên (early ambulation protocol), sau stretch + nghỉ sâu cơ thể cần được đưa từ từ về hoạt động bình thường để tránh stiffness và duy trì lưu thông.',
    details: [
      'Orthostatic hypotension prevention: khi nằm/quỳ, máu tập trung ở trung tâm cơ thể. Đứng dậy đột ngột, tim cần 5–10 giây để pump đủ máu lên não — trong thời gian đó có thể chóng mặt. 1–2 phút đi bộ nhẹ giúp cơ tim và hệ mạch máu "warm up" trở lại từ từ.',
      'Blood redistribution: khi nằm/stretch, máu tập trung ở các cơ đang được stretch. Đi bộ nhẹ kích hoạt bơm cơ bắp chân → đẩy máu tĩnh mạch trở về tim → tăng cardiac output → máu được phân phối lại đều khắp. Đây là lý do sau yoga và massage nên đi bộ nhẹ, không ngồi ngay.',
      '"Lock in" phó giao cảm: sau 10 phút stretch + thở chậm, cơ thể ở trạng thái phó giao cảm (low HR, low cortisol, high HRV). Đi bộ nhẹ Zone 1 duy trì trạng thái này — không "phá vỡ" bằng kích thích đột ngột (xem điện thoại, tiếp tục công việc ngay lập tức).',
      'Mindful walking: 1–2 phút đi bộ nhẹ là cơ hội thực hành mindfulness nhỏ — chú ý đến cảm giác bàn chân chạm sàn, hơi thở, độ nhẹ của cơ thể so với trước routine. "Body scan while walking" tăng body awareness và giúp nhận ra sự thay đổi sau stretch.',
      'Tránh điện thoại ngay sau routine: não đang ở trạng thái alpha (thư giãn tỉnh táo). Xem điện thoại ngay lập tức chuyển về beta (stimulated, stressed) và "xóa" hầu hết lợi ích thần kinh của routine. Đợi ít nhất 5 phút sau khi kết thúc trước khi kiểm tra tin nhắn.',
      'Thêm ánh sáng nếu có thể: nếu routine buổi sáng, 1–2 phút đi bộ ngoài trời sau đó = cortisol awakening response (CAR) tự nhiên + light therapy sáng sớm. Double benefit trong 2 phút không tốn thêm thời gian. Đây là "morning stack" lý tưởng: routine recovery → ánh sáng sáng sớm.',
    ],
    points: [
      { icon: '🩺', label: 'Chống orthostatic hypotension', note: 'Đứng đột ngột → chóng mặt. Đi bộ nhẹ chuyển huyết áp từ từ — không đứng nhanh' },
      { icon: '🫀', label: 'Venous pump trả máu về tim', note: 'Bắp chân đẩy máu tĩnh mạch lên — phân phối lại tuần hoàn sau nằm/stretch' },
      { icon: '🧘', label: 'Lock in phó giao cảm', note: 'Không phá vỡ trạng thái đã tạo ra — Zone 1 walk duy trì low HR và HRV cao' },
      { icon: '📵', label: 'Tránh điện thoại 5 phút sau', note: 'Não đang ở alpha waves — xem phone chuyển ngay về beta, "xóa" lợi ích thần kinh' },
    ],
  },
];

const ZONE_FIXES = [
  { zone: 'Cổ vai gáy', icon: '🦴', color: '#14b8a6', rgb: '20,184,166',
    cause: 'Ngồi gù, nhìn màn hình liên tục, vai xoáy vào trong',
    exercises: [
      {
        name: 'Chin tuck', reps: '10 lần × 2s giữ', why: 'Phục hồi đường cong cổ tự nhiên',
        icon: '↩️', color: '#14b8a6', rgb: '20,184,166',
        title: 'Chin Tuck — Phục Hồi Cổ Tự Nhiên',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Mỗi cm đầu chìa về trước (forward head posture) tăng tải lên cột sống cổ thêm 4.5kg. Ở 5cm về trước = 22.5kg tải thêm lên C5–C6 liên tục. Chin tuck kéo đầu về neutral và kích hoạt deep neck flexors (longus colli, longus capitis) — nhóm cơ "core" của cổ bị yếu và ức chế bởi tư thế chìa đầu.',
        detail: 'Chin tuck KHÔNG phải gật đầu hay cúi cổ — mà là kéo cằm thẳng về phía sau theo trục nằm ngang (retraction). Tưởng tượng đang tạo "double chin" hoặc đầu đang trượt ra sau trên ray trượt nằm ngang. Giữ 2 giây ở điểm căng nhẹ rồi thả ra.',
        details: [
          'Forward head posture (FHP) biomechanics: cột sống cổ có đường cong tự nhiên (lordosis) bị mất khi đầu chìa về trước. C5–C6 là điểm chịu lực nhiều nhất — đây là nơi thoái hóa đĩa đệm và gai cột sống cổ xuất hiện sớm nhất ở người ngồi nhiều.',
          'Deep neck flexors vs superficial: longus colli và longus capitis (sâu) là "stabilizers" của cổ, như transversus abdominis với lưng dưới. SCM và scalenes (nông) là "movers" — thường bị overactive và tight ở FHP. Chin tuck kích hoạt deep, ức chế superficial.',
          'Kỹ thuật: ngồi thẳng, mắt nhìn thẳng (không nhìn xuống). Kéo cằm về phía cổ theo đường nằm ngang — không phải cúi đầu. Phía sau đầu nên di chuyển ra sau và lên cao nhẹ. Giữ 2 giây (feel kéo nhẹ ở gáy), thả ra. Không nín thở.',
          'Tại sao 10 lần × 2s: 2 giây đủ để kích hoạt deep neck flexors mà không bị compensate bởi superficial. Dưới 2 giây quá ngắn; trên 5 giây với người mới có thể gây tremor (cơ đang quá yếu). 10 lần đủ để tạo neural activation mà không fatigue.',
          'Kết hợp với chin tuck extension: sau khi thành thạo chin tuck cơ bản, thêm chin tuck + nhìn lên nhẹ (cervical extension from neutral) để kích hoạt deep extensors. Không làm bài này nếu chưa mastered chin tuck thuần — dễ dùng sai cơ.',
          'Tiến triển: chin tuck với kháng lực (ấn ngón tay vào trán nhẹ) hoặc chin tuck + arm reach overhead (kéo giãn thêm cơ scalene). Sau 2–4 tuần tập đều, đầu tự nhiên ít chìa về trước khi không nhớ — deep neck flexors đã đủ mạnh để maintain posture.',
        ],
        points: [
          { icon: '📐', label: '+4.5kg/cm chìa đầu', note: '5cm forward head = 22.5kg extra load lên C5-C6 liên tục — tổn thương tích lũy' },
          { icon: '↔️', label: 'Kéo ngang, không gật', note: 'Trục nằm ngang — cằm về sau, đầu lên cao nhẹ, KHÔNG phải cúi cổ xuống' },
          { icon: '💪', label: 'Kích hoạt deep neck flexors', note: 'Longus colli/capitis — "core của cổ" bị yếu và ức chế bởi FHP' },
          { icon: '⏱️', label: '2s giữ × 10 lần', note: 'Đủ để kích hoạt deep stabilizers mà không overload cơ đang yếu' },
        ],
      },
      {
        name: 'Shoulder roll', reps: '10 vòng × 2 chiều', why: 'Giải phóng căng cơ vai',
        icon: '🔄', color: '#f97316', rgb: '249,115,22',
        title: 'Shoulder Roll — Bơm Dịch Khớp Vai',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Upper trapezius là cơ bị hypertonic (căng mãn tính) phổ biến nhất ở dân văn phòng — cảm giác "vai cứng" và "đau cổ gáy" phần lớn đến từ đây. Shoulder roll backward (ra sau) counteract pattern vai đổ về trước và kích hoạt rhomboids + lower trapezius bị ức chế. 10 vòng ra trước + 10 vòng ra sau = bơm đều synovial fluid khắp khớp vai.',
        detail: 'Vai đổ về trước (rounded shoulders) là kết quả của upper trap và pectoralis minor tight, kết hợp với rhomboids và lower trap weak. Shoulder roll backward là "nhắc nhở" cơ thể về vị trí neutral của vai — nhưng phải kết hợp với strengthening dài hạn để duy trì.',
        details: [
          'Cơ nào được kích hoạt: forward roll → pectoralis minor + serratus anterior. Backward roll → rhomboids, middle trap, lower trap, posterior deltoid. Tỷ lệ 1:2 (1 forward : 2 backward) phù hợp cho dân văn phòng vì đã quá nhiều "forward" trong ngày.',
          'Synovial fluid distribution: glenohumeral joint (khớp vai chính) sau 45–60 phút bất động có dịch khớp phân bố không đều → cứng khớp và tiếng kêu. Shoulder roll tròn lớn và chậm phân phối dịch khớp đều khắp diện tiếp xúc.',
          'Kỹ thuật: vai lên → kéo ra sau → xuống → về trước (một vòng tròn đầy đủ). Vòng tròn lớn và chậm tốt hơn nhỏ nhanh. Giữ ngực mở trong suốt — không để ngực xẹp về trước khi vai quay.',
          'Hơi thở sync: hít vào khi vai nâng lên và ra sau, thở ra khi vai hạ xuống và về trước. Nhịp thở + chuyển động tăng parasympathetic response và giúp cơ buông sâu hơn khi phối hợp.',
          'Forward roll warning: 10 vòng ra trước TRƯỚC backward giúp "warm up" khớp và phát hiện điểm đau/kẹt. Nếu forward roll gây đau ở phía trước vai → có thể là shoulder impingement sơ bộ, cần giảm bớt forward và tăng backward rolls.',
          'Sau shoulder roll, ngay lập tức làm chin tuck × 5: upper trap được giải phóng → cổ có thể retract sâu hơn. Hai bài kết hợp trong 2 phút là "minimal effective intervention" cho toàn bộ vùng cổ-vai trên.',
        ],
        points: [
          { icon: '↩️', label: 'Backward > forward', note: 'Xoay ra sau counteract rounded shoulders — không chỉ xoay 1 chiều bất kỳ' },
          { icon: '💧', label: 'Bơm synovial fluid', note: 'Dịch khớp phân bố đều khi xoay tròn lớn — giảm tiếng kêu và cứng khớp sáng' },
          { icon: '💪', label: 'Kích hoạt rhomboids', note: 'Rhomboids + lower trap bị ức chế khi vai đổ — xoay sau tái kích hoạt' },
          { icon: '🌬️', label: 'Sync hơi thở', note: 'Hít vào khi vai nâng/sau — thở ra khi hạ/về trước. Cơ buông sâu hơn' },
        ],
      },
      {
        name: 'Doorway stretch', reps: '30s × 2 lần', why: 'Mở ngực, giảm gù lưng',
        icon: '🚪', color: '#0ea5e9', rgb: '14,165,233',
        title: 'Doorway Stretch — Mở Ngực Và Vai',
        img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Pectoralis minor bị tight ở hầu hết người ngồi nhiều — co cụm kéo coracoid process xuống, đẩy vai về trước và xuống. Doorway stretch là cách hiệu quả nhất để kéo giãn pec minor và pec major trong khi đứng — không cần thiết bị. 30 giây là ngưỡng autogenic inhibition cần thiết để cơ thực sự buông lỏng.',
        detail: 'Doorway stretch đặt pectoralis vào tư thế kéo giãn (external rotation + shoulder abduction) và dùng trọng lực/tựa cửa làm "kháng lực". Bài này sửa vừa rounded shoulders vừa thoracic kyphosis bằng cách mở phần trước ngực và cho phép cột sống ngực duỗi về phía sau.',
        details: [
          'Pectoralis minor anatomy: gắn từ coracoid process (mỏm quạ của xương vai) xuống xương sườn 3–5. Khi tight, kéo scapula ra trước và xuống → vai đổ về trước → không gian dưới acromion thu hẹp → rotator cuff bị kẹp (impingement). Doorway stretch kéo giãn trực tiếp cơ này.',
          'High vs Low elbow position: khuỷu tay ngang vai (90°) kéo giãn sternal head của pec major. Khuỷu tay cao hơn vai (120°) kéo giãn clavicular head. Làm cả hai góc để cover toàn bộ pec major. Pec minor được giãn ở cả hai vị trí.',
          '30 giây ngưỡng GTO: giống hip flexor stretch, Golgi Tendon Organ (GTO) bắt đầu autogenic inhibition sau 20–30 giây — cơ bắt buộc phải buông lỏng. Dưới 20 giây chỉ warm up, không stretch thực sự. 2 lần × 30 giây tốt hơn 1 lần × 60 giây (reset neural response).',
          'Kỹ thuật: đứng ở cửa, tay và khuỷu tay tựa vào khung cửa (90°), bước nhẹ 1 chân về phía trước, cảm thấy kéo ở ngực và vai trước. Không nghiêng người quá nhiều về trước — giữ thân thẳng, để ngực "ra trước". Thở bình thường trong 30 giây.',
          'Kết hợp với scapular squeeze ngay sau: doorway stretch mở ngực (giãn pec) → scapular squeeze kích hoạt rhomboids (squeeze bả vai). Hai bài liên tiếp = giải quyết cả hai phía của rounded shoulders: giãn phía trước + kích hoạt phía sau.',
          'Khi nào KHÔNG làm: đau ở phía trước vai khi duỗi tay ra sau (có thể là biceps tendinitis hoặc SLAP tear). Nếu doorway stretch gây đau sắc trong khớp vai — dừng và kiểm tra với chuyên gia.',
        ],
        points: [
          { icon: '🦴', label: 'Pec minor kéo vai đổ trước', note: 'Coracoid → xương sườn 3–5: tight = vai đổ + không gian dưới acromion hẹp lại' },
          { icon: '📐', label: '90° vs 120° khuỷu tay', note: 'Hai góc để cover sternal + clavicular head của pec major. Làm cả hai' },
          { icon: '⏱️', label: '30s = GTO autogenic inhibition', note: 'Cơ thực sự buông sau 20–30s — dưới đó chỉ warm up, không stretch hiệu quả' },
          { icon: '➡️', label: 'Sau đó → scapular squeeze', note: 'Giãn pec trước + kích hoạt rhomboids sau = giải quyết cả hai phía rounded shoulders' },
        ],
      },
      {
        name: 'Scapular squeeze', reps: '15 lần × 2s giữ', why: 'Kích hoạt cơ lưng giữa yếu',
        icon: '🫸', color: '#10b981', rgb: '16,185,129',
        title: 'Scapular Squeeze — Kích Hoạt Lưng Giữa',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Rhomboids và middle/lower trapezius là hai nhóm cơ bị ức chế mạnh nhất bởi tư thế vai đổ về trước. Scapular squeeze (kéo bả vai về phía nhau) trực tiếp kích hoạt cả hai nhóm. 15 lần × 2s giữ tạo đủ neural activation để "remind" cơ bắp hoạt động — ngưỡng cho motor learning ở người ít vận động.',
        detail: 'Bài này dễ làm sai: nhiều người nâng vai lên thay vì kéo bả vai về sau và xuống. Scapular squeeze đúng là retract (kéo về sau) + depress (kéo xuống) đồng thời — không phải elevation (nâng lên).',
        details: [
          'Rhomboids: gắn từ spinous processes T2–T5 đến medial border của scapula. Chức năng: retract + downward rotate scapula. Khi yếu và bị ức chế, scapula bị kéo ra trước (protraction) liên tục → shoulder impingement và neck pain.',
          'Middle trapezius: gắn từ spinous processes C7–T3 đến spine of scapula. Chức năng: retract scapula. Lower trapezius: gắn từ T4–T12 đến spine of scapula. Chức năng: depress + retract scapula. Cả hai bị ức chế ở rounded shoulders pattern.',
          'Kỹ thuật đúng: ngồi hoặc đứng thẳng, hai tay buông tự nhiên. Kéo bả vai về phía nhau (retract) VÀ xuống phía dưới (depress) đồng thời — như đang "nhét bả vai vào túi quần sau". Giữ 2 giây với lực vừa phải. KHÔNG nâng vai lên.',
          'Lỗi phổ biến: nâng vai thay vì kéo về sau và xuống. Upper trap sẽ bị kích hoạt thay vì middle/lower trap. Cách kiểm tra: vai không di chuyển lên — chỉ bả vai di chuyển về sau. Nếu không chắc, làm trước gương.',
          '15 lần × 2s rationale: 15 lần đủ để tạo motor pattern nhưng không gây fatigue (rhomboids và mid-trap là cơ nhỏ, mỏi nhanh). 2 giây giữ tạo time under tension đủ cho motor learning. 3 sets nếu muốn strengthening — 1 set trong recovery routine là kích hoạt đủ.',
          'Band pull-apart variation: nếu muốn tăng hiệu quả và thêm kháng lực, dùng resistance band mỏng. Kéo band ra trước ngực (horizontal abduction) với hai tay thẳng — kích hoạt thêm posterior deltoid và rotator cuff ngoài. Tiến triển tự nhiên sau khi mastered scapular squeeze.',
        ],
        points: [
          { icon: '↙️', label: 'Retract + Depress đồng thời', note: '"Nhét bả vai vào túi quần sau" — về sau VÀ xuống, KHÔNG nâng lên' },
          { icon: '💪', label: 'Rhomboids + middle/lower trap', note: 'Hai nhóm bị ức chế nhất bởi rounded shoulders — cần kích hoạt lại mỗi ngày' },
          { icon: '🎯', label: '2s giữ = motor learning', note: 'Time under tension tối thiểu để neural pathway được kích hoạt đúng cách' },
          { icon: '🔍', label: 'Làm trước gương', note: 'Kiểm tra vai không nâng lên — chỉ bả vai di chuyển ra sau và xuống' },
        ],
      },
      {
        name: 'Thoracic twist ngồi', reps: '8 lần mỗi bên', why: 'Cải thiện xoay lưng ngực',
        icon: '🌀', color: '#8b5cf6', rgb: '139,92,246',
        title: 'Thoracic Twist Ngồi — Mở Khóa T-Spine',
        img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Thoracic spine (T1–T12) được thiết kế để xoay ~35° mỗi bên — nhiều nhất trong cột sống. Tuy nhiên đây cũng là đoạn bị stiff nhất ở người ngồi nhiều. T-spine cứng bắt cervical spine (cổ) và lumbar spine (lưng dưới) phải bù rotation quá mức — gây đau cổ và đau lưng dưới từ nguồn gốc là T-spine. Ngồi xoay 8 lần/bên là minimum để restore rotation range.',
        detail: 'Thoracic twist ngồi an toàn hơn đứng vì cố định hông và lumbar, buộc rotation phải đến từ T-spine. Tay sau đầu giữ cổ neutral và tăng đòn bẩy cho thoracic rotation mà không compensate bằng cổ.',
        details: [
          'Tại sao T-spine quan trọng cho cổ vai: shoulder blade (scapula) trượt trên T-spine. Khi T-spine kyphotic và stiff, scapula không di động đúng → shoulder mechanics bị lệch → neck và shoulder pain theo sau. Fix T-spine trước khi fix vai-cổ là thứ tự đúng.',
          'Ngồi cross-legged vs ngồi ghế: ngồi cross-legged cố định hông hiệu quả hơn, buộc rotation từ T-spine nhiều hơn. Ngồi ghế thẳng lưng cũng được nếu không quen ngồi sàn — đặt tay sau gáy và xoay từ ngực, không từ hông.',
          'Kỹ thuật: ngồi thẳng lưng, đặt 2 tay sau đầu (elbow ra 2 bên). Hít vào chuẩn bị, thở ra và xoay ngực sang một bên — mắt và khuỷu tay dẫn hướng xoay. Giữ 1–2 giây ở điểm xoay xa nhất. Thở ra khi xoay giúp lồng ngực xẹp → xoay sâu hơn 10–15%.',
          'Không xoay từ hông: người hay compensate bằng cách xoay toàn bộ thân từ hông — T-spine vẫn cứng nhưng cảm giác đã "xoay được nhiều". Cách kiểm tra: hông phải không di chuyển trong suốt rotation. Nếu một bên hông nâng lên → đang xoay từ hông, không từ ngực.',
          'Open book variation (nằm): nằm nghiêng một bên, hai gối gập 90° chồng lên nhau. Tay trên mở ra về phía sau (external rotation) theo nhịp thở. Hiệu quả hơn ngồi nhưng cần nhiều không gian. Dùng nếu muốn kết hợp T-spine rotation với soft tissue release.',
          'Tần suất: T-spine mobility cải thiện chậm — cần kiên trì 4–6 tuần mới thấy range of motion tăng rõ. Nhưng cảm giác dễ chịu sau mỗi lần làm là ngay lập tức. Đây là bài "maintenance" cần làm hàng ngày, không phải bài "fix" làm vài tuần rồi thôi.',
        ],
        points: [
          { icon: '🔓', label: 'T-spine stiff → cổ + lưng bù', note: 'T-spine cứng bắt cổ và lumbar spine bù rotation — gây đau cả hai vùng' },
          { icon: '💨', label: 'Thở ra khi xoay', note: 'Lồng ngực xẹp khi exhale → xoay sâu hơn 10–15% tự nhiên — không xoay khi hít vào' },
          { icon: '🦴', label: 'Hông không di chuyển', note: 'Kiểm tra: hông cố định, chỉ ngực xoay — nếu hông xoay là đang compensate' },
          { icon: '📅', label: 'Cải thiện chậm nhưng chắc', note: '4–6 tuần mới thấy ROM tăng — nhưng cảm giác nhẹ ngay sau mỗi lần làm' },
        ],
      },
    ]
  },
  { zone: 'Lưng dưới', icon: '🫀', color: '#06b6d4', rgb: '6,182,212',
    cause: 'Ngồi lâu, cơ hông gấp căng, cơ bụng yếu',
    exercises: [
      {
        name: 'Dead bug', reps: '10 lần mỗi bên', why: 'Kích hoạt cơ bụng sâu an toàn',
        icon: '🐛', color: '#6366f1', rgb: '99,102,241',
        title: 'Dead Bug — Core Sâu Không Đau Lưng',
        img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Dead bug là bài tập core tốt nhất cho người đau lưng dưới vì kích hoạt transversus abdominis (TA) và multifidus mà không tạo thêm compressive load lên đĩa đệm. Nằm ngửa = spine trong tư thế neutral, trọng lực không nén cột sống theo trục dọc. Tay và chân đối diện di chuyển ra ngoài chậm và kiểm soát — thách thức anti-extension core stability.',
        detail: 'Dead bug đúng kỹ thuật khó hơn trông — lưng dưới phải ép sát sàn trong suốt bài, không được arch lên. Bất kỳ lúc nào lưng dưới tách khỏi sàn = TA không còn active và bài tập mất tác dụng. Đây là bài kiểm tra + tập luyện core stability đồng thời.',
        details: [
          'Transversus abdominis (TA) là cơ "corset" sâu nhất của bụng — bao quanh toàn bộ thân. Chức năng chính là tăng intra-abdominal pressure để ổn định cột sống TRƯỚC khi tay chân di chuyển (feedforward mechanism). TA yếu = mỗi chuyển động tay chân đều có thể gây microtrauma cột sống.',
          'Multifidus: nhóm cơ nhỏ dọc theo cột sống, quan trọng nhất cho segmental stability (ổn định từng đốt sống). Ở người đau lưng mãn tính, multifidus bị atrophy một bên và không tự phục hồi mà không tập luyện có chủ đích. Dead bug là một trong số ít bài kích hoạt multifidus hiệu quả mà không gây đau.',
          'Kỹ thuật: nằm ngửa, hai tay giơ thẳng lên trần, hai đầu gối gập 90° trên không trung. Ép lưng dưới THẲNG sàn (không arch). Chậm rãi hạ tay phải + chân trái xuống gần sàn (không chạm), giữ 2 giây, về vị trí ban đầu. Đổi bên. Trong suốt bài — lưng dưới phải ép sát sàn.',
          'Thở: thở ra TrƯỚC khi hạ tay/chân (kích hoạt TA và intra-abdominal pressure). Giữ hơi thở nhẹ trong khi tay/chân đang di chuyển. Hít vào khi trở về vị trí ban đầu. Đừng nín thở hoàn toàn — Valsalva maneuver gây tăng huyết áp đột ngột.',
          'Tiến triển: bắt đầu với chỉ hạ tay (giữ 2 chân tại chỗ) → sau 2 tuần thêm chân → sau 2 tuần nữa thêm tạ nhẹ 0.5–1kg ở tay. Không tiến triển nếu lưng dưới vẫn tách khỏi sàn — kỹ thuật quan trọng hơn progression.',
          'So sánh với plank: plank là anti-extension isometric, dead bug là anti-extension dynamic. Dead bug chal lenge core ở range of motion lớn hơn và gần với chức năng thực tế (tay chân di chuyển trong khi core ổn định). Cho đau lưng, dead bug an toàn hơn plank vì không có axial load.',
        ],
        points: [
          { icon: '🛡️', label: 'Không compressive load', note: 'Nằm ngửa = cột sống không chịu lực theo trục — an toàn nhất cho đĩa đệm đang phục hồi' },
          { icon: '🔒', label: 'Lưng ép sát sàn suốt bài', note: 'Lưng tách sàn = TA tắt và bài mất tác dụng — đây là tiêu chí kỹ thuật số 1' },
          { icon: '💨', label: 'Thở ra trước khi hạ tay/chân', note: 'Exhale kích hoạt TA và intra-abdominal pressure trước khi cơ tay chân hoạt động' },
          { icon: '🐢', label: 'Chậm > nhiều', note: 'Chuyển động chậm × 10 lần tốt hơn nhanh × 20 lần về kích hoạt deep stabilizers' },
        ],
      },
      {
        name: 'Bird-dog', reps: '10 lần mỗi bên', why: 'Ổn định lưng + kích hoạt glute',
        icon: '🐦', color: '#10b981', rgb: '16,185,129',
        title: 'Bird-Dog — Ổn Định Cột Sống Và Kích Hoạt Glute',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Bird-dog là bài được Stuart McGill (spine biomechanics expert) đưa vào "Big 3" của low back rehabilitation. Bài này train anti-rotation stability — cột sống phải chống lại lực xoắn vặn khi tay và chân đối diện di chuyển. Đây chính xác là loại stability cần thiết trong cuộc sống hàng ngày (bước đi, leo cầu thang, mang đồ).',
        detail: 'Bird-dog kích hoạt gluteus maximus (chân sau), multifidus (ổn định cột sống) và posterior deltoid (tay trước) đồng thời — trong khi core duy trì neutral spine và chống rotation. Bài đa chức năng hiếm có: strengthen + stabilize + coordinate cùng lúc.',
        details: [
          'Stuart McGill\'s "Big 3": curl-up (thay vì sit-up), side plank và bird-dog là 3 bài McGill chứng minh an toàn và hiệu quả nhất cho low back rehab. Bird-dog train "neutral spine under load" — kỹ năng quan trọng nhất để phòng và phục hồi đau lưng.',
          'Anti-rotation demand: khi tay phải giơ ra trước và chân trái kéo ra sau, toàn bộ thân bị kéo về phía phải. Core phải tạo counter-rotation force để giữ neutral. Đây là functional demand rất gần với walking (tay và chân đối diện swing cùng lúc).',
          'Kỹ thuật: quỳ 4 điểm, lưng thẳng (không sag hay arch). Giơ tay phải và chân trái ra ngang bằng — KHÔNG cao hơn thân. Ngón chân trái duỗi (không flex gối). Giữ 3–5 giây, trở về chậm rãi, không chạm gối/tay xuống sàn giữa các lần lặp.',
          'Giữ hông level: không để hông bên chân đang giơ xoay lên hoặc xệ xuống. Đặt 1 cuốn sách lên lưng để kiểm tra — nếu sách rơi là đang xoay hông. Hông level là tiêu chí kỹ thuật quan trọng nhất, còn quan trọng hơn độ cao của tay/chân.',
          'Tiến triển: bird-dog chuẩn → bird-dog + elbow to knee (kéo khuỷu tay và đầu gối đối diện về gặp nhau dưới bụng) → bird-dog với resistance band ở cổ chân → bird-dog trên bosu ball. Progression tăng dần instability và kháng lực.',
          'Kết hợp trong routine: bird-dog sau dead bug hoặc glute bridge. Dead bug train anti-extension (lying), bird-dog train anti-rotation (quadruped) — hai mặt phẳng khác nhau của core stability. Kết hợp cả hai để cover toàn diện.',
        ],
        points: [
          { icon: '🔄', label: 'Anti-rotation stability', note: 'Core chống lực xoắn khi tay và chân đối diện di chuyển — functional cho đi bộ, leo cầu thang' },
          { icon: '📐', label: 'Hông phải level suốt bài', note: 'Quan trọng hơn tầm cao của tay/chân — hông xoay là lỗi kỹ thuật số 1' },
          { icon: '📚', label: 'McGill\'s Big 3', note: 'Một trong 3 bài được chứng minh khoa học an toàn và hiệu quả nhất cho low back rehab' },
          { icon: '⏱️', label: 'Giữ 3–5s, không chạm sàn', note: 'Time under tension dài + không nghỉ giữa reps = kích hoạt multifidus và glute liên tục' },
        ],
      },
      {
        name: 'Glute bridge', reps: '15 lần × 2s giữ', why: 'Tăng cường glute giảm tải lưng',
        icon: '🍑', color: '#f59e0b', rgb: '245,158,11',
        title: 'Glute Bridge — Kích Hoạt Mông Giảm Tải Lưng',
        img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Gluteus maximus là cơ lớn nhất cơ thể và là "extensor chính" của hông — nhưng bị ức chế mạnh nhất bởi ngồi nhiều (reciprocal inhibition với hip flexors). Khi glutes yếu, erector spinae phải bù thêm tải cho hip extension → quá tải lưng dưới mãn tính. Glute bridge kích hoạt glutes từ tư thế nằm — an toàn và hiệu quả ngay cả khi đang đau lưng.',
        detail: '"Gluteal amnesia" là thuật ngữ Stuart McGill dùng để mô tả glutes bị ức chế và "quên" cách kích hoạt đúng sau thời gian dài ngồi. Glute bridge là bài đánh thức lại cơ mông trước khi yêu cầu nó làm việc trong các bài squat hay deadlift.',
        details: [
          'Reciprocal inhibition: khi hip flexors (psoas) hoạt động mạnh (ngồi nhiều), neural inhibition tắt bớt gluteus maximus. Đây là cơ chế thần kinh bình thường — nhưng khi ngồi 8–10 giờ/ngày, glutes bị ức chế gần như suốt ngày → yếu dần và không kích hoạt đúng kể cả khi cần.',
          'Kỹ thuật: nằm ngửa, gối gập 90°, bàn chân rộng bằng hông. Ép gót chân xuống sàn, siết mông, đẩy hông lên cho đến khi thân tạo đường thẳng từ vai đến gối. Giữ 2 giây ở trên cùng — focus vào squeeze glutes. Hạ xuống chậm 2–3 giây.',
          '2 giây giữ: nhiều người làm glute bridge "bouncing" — không có pause ở đỉnh. 2 giây giữ ở vị trí cao nhất tạo maximal glute activation và eliminates momentum. EMG studies cho thấy glute activation tăng 30–40% khi có pause so với không có.',
          'Foot position matters: bàn chân quá gần mông → quads dominant. Bàn chân quá xa → hamstring dominant. Bàn chân đặt sao cho khi ở vị trí cao, ống chân thẳng đứng (shin vertical) → glute dominant. Adjust vị trí bàn chân đến khi cảm thấy glutes nhiều nhất.',
          'Tiến triển: glute bridge 2 chân → glute bridge + band (band quanh đầu gối để resist internal rotation) → single-leg glute bridge → hip thrust với thanh tạ vai. Mỗi bước tiến thêm kháng lực hoặc giảm base of support.',
          'Glute bridge vs hip thrust: glute bridge (lưng trên sàn) dễ hơn và an toàn hơn. Hip thrust (lưng tựa bench) có ROM lớn hơn và EMG glute activation cao hơn ~20%. Bắt đầu với glute bridge trong recovery, chuyển sang hip thrust khi mạnh hơn.',
        ],
        points: [
          { icon: '🔑', label: 'Gluteal amnesia', note: 'Ngồi nhiều → glutes bị ức chế → "quên" kích hoạt → lưng phải bù thêm tải' },
          { icon: '🦵', label: 'Ống chân thẳng đứng', note: 'Vị trí bàn chân tối ưu: shin vertical ở đỉnh → glute dominant, không phải quad/hamstring' },
          { icon: '⏸️', label: '2s pause ở đỉnh = +30–40% activation', note: 'Không bouncing — pause ở trên tối đa hóa glute EMG, loại bỏ momentum' },
          { icon: '💪', label: 'Siết mông, không đẩy lưng', note: 'Cảm giác đẩy từ gót chân qua mông — không phải cong lưng lên' },
        ],
      },
      {
        name: 'Child pose', reps: '1–2 phút', why: 'Giải phóng căng lưng dưới',
        icon: '🧘', color: '#8b5cf6', rgb: '139,92,246',
        title: 'Child Pose — Giải Phóng Lưng Dưới',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Child pose (balasana) đặt cột sống vào flexion nhẹ — tư thế đối lập với extension liên tục do ngồi lâu (anterior pelvic tilt). Cột sống lưng dưới được kéo dài và giảm compression, erector spinae được giãn theo chiều dài. Đồng thời, không gian sau đĩa đệm mở ra — tạm thời giảm áp lực lên dây thần kinh sau đĩa đệm ở L4–L5 và L5–S1.',
        detail: 'Child pose an toàn cho hầu hết người đau lưng dưới cơ học (mechanical low back pain) — nhưng không phù hợp nếu đau tăng khi gập người (disc herniation gây radiculopathy). Luôn test nhẹ trước: nếu đau tăng khi vào tư thế, dừng và chuyển sang prone extension.',
        details: [
          'Posterior disc space: ở tư thế ngồi hoặc đứng, đĩa đệm L4–L5 và L5–S1 chịu lực nén lớn nhất. Gập người về trước (flexion) làm phần sau đĩa đệm mở ra và giảm compression posteriorly. Với disc herniation nhẹ (không có radiculopathy), điều này giảm đau tạm thời.',
          'Erector spinae stretch: cơ erector spinae chạy dọc hai bên cột sống từ xương chậu đến đáy hộp sọ. Ở tư thế ngồi lâu (extension), cơ này bị rút ngắn mãn tính. Child pose kéo dài erector theo chiều dài tối đa — cảm giác "lưng được kéo căng dễ chịu".',
          'Sacroiliac joint decompression: SI joint (khớp nối xương cùng và ilium) thường bị stiff và đau ở người ngồi lâu. Child pose với gối mở rộng (wide-knee child pose) tạo traction nhẹ lên SI joint và stretch iliolumbar ligament.',
          'Wide-knee variation: nếu standard child pose (gối khép) không đủ thoải mái, mở gối rộng ra hai bên và ngón chân chạm nhau. Hông hạ thấp hơn và stretch lưng dưới + hông sâu hơn. Tốt hơn cho người có hông tight hoặc cơ đùi trong tight.',
          'KHÔNG làm nếu: đau tăng khi vào tư thế, có radiculopathy (đau lan xuống chân theo đường dây thần kinh), hoặc stenosis nặng (hẹp ống sống). Với disc herniation gây radiculopathy, prone extension (McKenzie extension) thường phù hợp hơn child pose.',
          'Thở trong child pose: thở cơ hoành — khi hít vào, cảm thấy lưng sau phồng lên (posterior ribcage expansion). Mỗi lần thở ra, sink thêm 1–2mm vào tư thế. Sau 1 phút, lưng dưới thường "buông" đáng kể so với lúc bắt đầu.',
        ],
        points: [
          { icon: '🔓', label: 'Mở posterior disc space', note: 'Flexion mở phần sau đĩa đệm L4–L5, L5–S1 — giảm áp lực dây thần kinh tạm thời' },
          { icon: '📏', label: 'Erector spinae kéo dài tối đa', note: 'Counteract extension mãn tính của ngồi lâu — cơ lưng được "reset" chiều dài' },
          { icon: '⚠️', label: 'Đau tăng → dừng ngay', note: 'Child pose không phù hợp cho disc herniation có radiculopathy — thử prone extension thay' },
          { icon: '💨', label: 'Lưng sau phồng khi hít vào', note: 'Posterior ribcage expansion — mỗi thở ra sink thêm vào tư thế' },
        ],
      },
      {
        name: 'Hip flexor stretch', reps: '45s mỗi bên', why: 'Giải phóng co cứng hông gấp',
        icon: '🦵', color: '#f97316', rgb: '249,115,22',
        title: 'Hip Flexor Stretch — Giải Phóng Psoas',
        img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Psoas (iliopsoas) tight là nguyên nhân hàng đầu của đau lưng dưới mãn tính ở dân văn phòng. Ngồi 8–10 giờ/ngày giữ psoas ở chiều dài ngắn → mất khả năng kéo dài đầy đủ → kéo xương chậu ra trước (APT) khi đứng → lưng dưới bị overextend liên tục → đau. 45 giây đủ để GTO kích hoạt autogenic inhibition và psoas thực sự buông lỏng.',
        detail: 'Psoas là cơ duy nhất nối trực tiếp cột sống với chân, đi qua trước xương chậu. Khi tight, nó không chỉ gây APT mà còn có thể nén đám rối thắt lưng (lumbar plexus) và ảnh hưởng đến hệ thần kinh vùng bụng dưới và hông.',
        details: [
          'Psoas và lumbar lordosis: psoas tight kéo T12–L5 ra trước → tăng lumbar lordosis → facet joints bị nén → đau khi đứng lâu hoặc đi bộ. Đây là "extension-based back pain" — khác với "flexion-based" (đau khi cúi người). Hip flexor stretch là điều trị trực tiếp cho extension-based LBP.',
          '45 giây rationale: GTO (Golgi Tendon Organ) bắt đầu relaxation response sau 20–30 giây. 45 giây đảm bảo cơ đã qua ngưỡng này và đang trong giai đoạn relaxation thực sự — không phải chỉ stretch cơ đang "resist". Với chronic tightness, 60–90 giây thậm chí hiệu quả hơn.',
          'Lunge kneeling stretch (kỹ thuật chuẩn): quỳ gối phải xuống, chân trái bước ra trước gập 90°. Đẩy hông về phía trước (không phải cúi người về trước). Tay trái có thể nâng lên để thêm lateral trunk flexion — kéo psoas ở đoạn gần cột sống. Giữ lưng thẳng trong suốt.',
          'Knifehand variation: từ lunge chuẩn, thêm arm overhead phía chân đang stretch. Giơ tay phải lên (khi stretch psoas phải) và nghiêng nhẹ sang trái — lateral flexion ngược phía thêm kéo giãn đoạn proximal của psoas gần cột sống. Tăng hiệu quả 20–30%.',
          'PNF contract-relax: từ lunge stretch, ép đầu gối xuống sàn nhẹ nhàng (co psoas với lực 20–30%) trong 6 giây, sau đó thả lỏng hoàn toàn và sink sâu hơn vào stretch. Lặp 3–4 lần. PNF (Proprioceptive Neuromuscular Facilitation) là kỹ thuật stretch hiệu quả nhất để tăng ROM nhanh.',
          'Kết hợp với glute bridge ngay sau: psoas stretch (giãn hip flexors) + glute bridge (kích hoạt hip extensors). Hai bài kết hợp = cân bằng lại hip joint từ hai phía: giãn nhóm tight (psoas) + kích hoạt nhóm weak (glutes). Pattern này là core của mọi chương trình rehab lưng dưới hiện đại.',
        ],
        points: [
          { icon: '🔗', label: 'Psoas nối cột sống với chân', note: 'T12–L5 → lesser trochanter. Tight = kéo cột sống về trước = APT = đau lưng' },
          { icon: '⏱️', label: '45s = vượt ngưỡng GTO', note: 'GTO autogenic inhibition sau 20–30s — 45s đảm bảo cơ đang buông thực sự' },
          { icon: '➡️', label: 'Đẩy hông trước, không cúi người', note: 'Hông forward → psoas kéo dài. Cúi người → chỉ stretch lưng, không phải psoas' },
          { icon: '🔄', label: 'Sau đó → Glute bridge', note: 'Giãn psoas + kích hoạt glutes = cân bằng lại hip joint từ cả hai phía' },
        ],
      },
    ]
  },
  { zone: 'Gối', icon: '🦵', color: '#a78bfa', rgb: '167,139,250',
    cause: 'Yếu glute + quad, overuse, tư thế valgus',
    exercises: [
      {
        name: 'Sit-to-stand chậm', reps: '10 lần, kiểm soát', why: 'Tăng sức mạnh quad + glute an toàn',
        icon: '🪑', color: '#0ea5e9', rgb: '14,165,233',
        title: 'Sit-To-Stand Chậm — Squat Chức Năng Cho Gối',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Sit-to-stand là bài tập chức năng nhất cho gối — chúng ta thực hiện hàng chục lần mỗi ngày. Phiên bản chậm (3–5 giây xuống, 3–5 giây lên) tạo time under tension dài cho quadriceps và gluteus maximus mà không cần tải trọng. Eccentric control (hạ xuống chậm) là thành phần quan trọng nhất — cơ chịu tải lớn nhất khi kéo dài và dễ strengthen nhất.',
        detail: 'Gối đau thường do quadriceps yếu không kiểm soát được lực khi xuống (eccentric) — gối "đổ" vào trong (valgus collapse). Sit-to-stand chậm train eccentric quad và gluteus medius (kiểm soát valgus) đồng thời, trong khi ghế là "safety net" nếu không đủ sức.',
        details: [
          'Eccentric overload: cơ sinh lực nhiều nhất khi kéo dài (eccentric) so với rút ngắn (concentric). Đồng thời, eccentric training tạo hypertrophy và strength gains nhanh hơn concentric với cùng số lần tập. Hạ xuống chậm 3–5 giây = eccentric quad training hiệu quả dù không có tạ.',
          'Valgus collapse pattern: gối đổ vào trong khi ngồi xuống là dấu hiệu gluteus medius yếu (hip abductor). Glute med không giữ được femur (xương đùi) ở vị trí trung lập → gối bị valgus stress → patellofemoral pain và IT band syndrome theo sau. Sit-to-stand chậm train cả kiểm soát valgus này.',
          'Kỹ thuật: ngồi ở mép ghế. Đặt chân rộng bằng hông, ngón chân hướng ra ngoài 10–15°. Nhìn thẳng. Đứng dậy: nghiêng người nhẹ ra trước, đẩy từ gót chân, siết mông khi lên đến thẳng người. Ngồi xuống: hạ hông xuống chậm 3–5 giây, đổ trọng lượng về gót, gối theo hướng ngón chân.',
          'Gối không vượt quá ngón chân? Đây là myth đã bị bác bỏ. Gối CÓ THỂ vượt quá ngón chân trong squat bình thường — điều quan trọng là lực phân phối đều qua bàn chân và gối theo hướng ngón chân (không collapse vào trong). Restricting knee forward travel thực ra tăng hip stress.',
          'Tiến triển: sit-to-stand 2 chân (ghế cao) → sit-to-stand 2 chân (ghế thấp) → sit-to-stand với 1–2kg tạ cầm → box squat với tạ nhẹ → squat tự do. Hoặc single-leg sit-to-stand (pistol squat hỗ trợ) khi đã đủ mạnh.',
          'Knee pain indicator: nếu nghe tiếng lộp cộp (crepitus) khi đứng lên — không đáng lo nếu không đau. Nếu đau bên trong gối (medial) → có thể là MCL hoặc medial meniscus. Đau phía trước (kneecap) → patellofemoral. Đau phía sau → popliteal cyst. Đau sắc khi đứng dậy → gặp bác sĩ.',
        ],
        points: [
          { icon: '⬇️', label: 'Hạ xuống 3–5s = eccentric training', note: 'Eccentric = cơ mạnh nhất và tăng strength nhanh nhất — không cần tạ' },
          { icon: '🦵', label: 'Gối theo hướng ngón chân', note: 'Không collapse vào trong (valgus) — tiêu chí kỹ thuật quan trọng nhất cho gối' },
          { icon: '🪑', label: 'Ghế là safety net', note: 'Nếu không đủ sức = ngồi xuống ghế — an toàn để tập đến giới hạn thực tế' },
          { icon: '📈', label: 'Tiến triển: ghế cao → thấp → 1 chân', note: 'Bắt đầu với ghế cao, tiến dần — không nhảy thẳng vào squat tự do' },
        ],
      },
      {
        name: 'Glute bridge một chân', reps: '8–10 lần mỗi bên', why: 'Cân bằng sức mạnh 2 bên',
        icon: '🦶', color: '#10b981', rgb: '16,185,129',
        title: 'Single-Leg Glute Bridge — Cân Bằng 2 Bên',
        img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Hầu hết người có sự chênh lệch sức mạnh glute 2 bên — side asymmetry >15% là yếu tố nguy cơ chấn thương gối và lưng. Single-leg glute bridge (SLGB) phát hiện và fix asymmetry này vì mỗi bên phải làm việc độc lập. Bên yếu hơn sẽ run rẩy, hông xệ xuống hoặc không giữ được 8–10 lần — đây là tín hiệu cần tập tập trung bên đó nhiều hơn.',
        detail: 'SLGB train gluteus maximus đơn bên cùng với hip abductors (gluteus medius, tensor fascia latae) phải ổn định hông khỏi xệ xuống. Đây là điều kiện gần nhất với walking và running — 1 chân chịu lực trong khi chân kia swing.',
        details: [
          'Bilateral deficit: khi tập 2 chân cùng lúc, mỗi chân chỉ phát lực ~70–80% so với 1 chân riêng lẻ — cơ bắp "chia sẻ" effort và có thể hide weakness. SLGB loại bỏ bilateral deficit — bên yếu không có bên mạnh để bù.',
          'Kỹ thuật: bắt đầu từ glute bridge 2 chân. Giơ 1 chân lên (thẳng hoặc gập gối 90°). Đẩy hông lên từ gót chân còn lại, siết mông, giữ hông level. Hông KHÔNG được xệ về phía chân đang giơ. Giữ 1–2 giây ở đỉnh, hạ xuống chậm.',
          'Hip level = hip abductor test: nếu hông xệ về một bên khi giơ chân → gluteus medius bên đó yếu. Đây chính xác là Trendelenburg sign — được dùng trong lâm sàng để test glute med. SLGB vừa là bài tập vừa là screening tool.',
          'Chân đang giơ gập hay thẳng: thẳng tăng hamstring của chân đang giơ activation nhưng dễ làm hơn về balance. Gập 90° giảm hamstring tension và focus hơn vào glute của chân trụ. Cả hai đều hiệu quả — chọn dựa trên comfort.',
          'Số lần không đều 2 bên: nếu chân phải làm được 10 lần nhưng chân trái chỉ được 6 lần — tập thêm 2–3 set riêng cho chân trái sau set bình thường. Asymmetry sẽ giảm dần sau 4–6 tuần tập nhất quán.',
          'Tiến triển: SLGB → SLGB + band quanh đùi → SLGB với tạ trên hông → single-leg hip thrust trên bench. Hoặc → SLGB trên bosu ball để thêm instability challenge cho hip stabilizers.',
        ],
        points: [
          { icon: '⚖️', label: 'Phát hiện asymmetry 2 bên', note: 'Bilateral training ẩn weakness — SLGB buộc mỗi bên phải làm việc độc lập' },
          { icon: '📐', label: 'Hông level = glute med test', note: 'Hông xệ = gluteus medius yếu (Trendelenburg) — tập trung bên yếu hơn' },
          { icon: '🎯', label: 'Số lần không đều → tập thêm bên yếu', note: '2–3 set riêng cho bên yếu sau main set — asymmetry giảm sau 4–6 tuần' },
          { icon: '🦿', label: 'Gần với walking/running', note: '1 chân trụ + hông level = điều kiện chức năng thực tế — transfer tốt nhất' },
        ],
      },
      {
        name: 'Calf raise', reps: '15–20 lần', why: 'Hỗ trợ bơm máu về tim',
        icon: '🦶', color: '#14b8a6', rgb: '20,184,166',
        title: 'Calf Raise — Bơm Tĩnh Mạch Và Mạnh Gân Achilles',
        img: 'https://images.unsplash.com/photo-1434682966252-f8506a5a0f06?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Soleus (cơ dép) trong calf raise đứng là "thiết bị bơm thứ hai" của hệ tuần hoàn — đẩy máu từ tĩnh mạch chân lên tim. Cho gối, calf raise train eccentric control của gân Achilles và gastrocnemius, giảm lực kéo ra sau gối (posterior knee stress). iScience 2022: soleus pushup giảm postprandial glucose 52% — calf raise cũng kích hoạt cơ này.',
        detail: 'Calf raise thường bị underestimate vì quá đơn giản. Nhưng soleus có đặc tính chuyển hóa độc đáo — dùng trực tiếp glucose và fatty acids từ máu để hoạt động, không dùng glycogen. Đây là lý do calf raise đứng nhẹ khi đứng chờ có thể ảnh hưởng đến đường huyết đáng kể.',
        details: [
          'Venous pump mechanism: tim bơm máu xuống động mạch chân. Máu tĩnh mạch trở về phải chống lại trọng lực. Gastrocnemius và soleus co rút khi calf raise đẩy máu tĩnh mạch qua van tĩnh mạch → lên tim. Không có calf pump này, máu ứ ở chân → sưng, mỏi chân, tăng nguy cơ deep vein thrombosis (DVT).',
          'Eccentric calf training cho gối: khi hạ xuống chậm (eccentric lowering), gastrocnemius và soleus chịu load lớn — strengthening gân Achilles và giảm lực kéo ra sau qua posterior knee joint capsule. Beneficial cho jumper\'s knee (patellar tendinopathy) và gối sau chấn thương.',
          'Kỹ thuật tối ưu: đứng với mép bàn chân trên bậc (hoặc sàn), hạ gót xuống thấp nhất có thể (eccentric stretch), sau đó kiễng lên cao nhất có thể (concentric). Giữ 1 giây ở đỉnh. Hạ xuống 3–4 giây (eccentric chậm). Bước này quan trọng hơn số lần.',
          'Single-leg calf raise: sau khi 2 chân dễ dàng, chuyển sang 1 chân. 1 chân tạo ~2× load so với 2 chân → strength gains nhanh hơn và detect asymmetry. Người có tiền sử Achilles tendinopathy PHẢI làm single-leg eccentric calf raise (Alfredson protocol).',
          'Alfredson protocol cho Achilles tendinopathy: 3 sets × 15 reps eccentric calf raise 1 chân, 2 lần/ngày, 12 tuần. Nghiên cứu original của Alfredson (1998) cho thấy 82% thành công — hiệu quả hơn surgery ở nhiều trường hợp. Đây là gold standard điều trị Achilles tendinopathy.',
          'Calf raise và plantar fasciitis: calf tight (particularly soleus) là nguyên nhân chính của plantar fasciitis. Calf raise eccentric kéo giãn và strengthen đồng thời — address cả tightness và weakness. Kết hợp với towel stretch sáng sớm trước khi bước xuống giường.',
        ],
        points: [
          { icon: '🫀', label: 'Bơm tĩnh mạch về tim', note: 'Gastrocnemius + soleus = "tim thứ hai" cho tuần hoàn chân — chống DVT và mỏi chân' },
          { icon: '⬇️', label: 'Hạ xuống 3–4s = eccentric training', note: 'Eccentric slow = gân Achilles và gastrocnemius strengthen — không chỉ kiễng gót lên/xuống' },
          { icon: '🦶', label: 'Mép bàn chân trên bậc', note: 'Full ROM: hạ gót thấp nhất + kiễng cao nhất — tối đa hóa stretch + strengthen' },
          { icon: '🎯', label: '1 chân = Alfredson protocol', note: 'Gold standard cho Achilles tendinopathy — 82% thành công không cần surgery' },
        ],
      },
      {
        name: 'Terminal knee extension', reps: '15 lần', why: 'Kích hoạt VMO — cơ bảo vệ gối',
        icon: '🦿', color: '#f59e0b', rgb: '245,158,11',
        title: 'Terminal Knee Extension — Kích Hoạt VMO',
        img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'VMO (vastus medialis oblique) là phần cơ tứ đầu đùi ở phía trong, trên xương bánh chè. Chức năng quan trọng nhất của VMO là giữ xương bánh chè đi đúng rãnh trên femur (patellar tracking) — VMO yếu làm bánh chè lệch ra ngoài → patellofemoral pain (đau trước gối). TKE kích hoạt VMO ở những 10–15° cuối của duỗi gối — vùng mà VMO hoạt động nhiều nhất.',
        detail: 'TKE (Terminal Knee Extension) là bài tập riêng biệt cho VMO vì VMO chỉ hoạt động nhiều ở cuối tầm duỗi gối (0–15°). Squat và lunge không tạo đủ VMO activation ở cuối tầm này. Với band, TKE target đúng muscle ở đúng range.',
        details: [
          'VMO anatomy: vastus medialis oblique là phần dưới-trong của cơ tứ đầu đùi (quadriceps). Sợi cơ chạy theo hướng 50–55° (oblique) — khác với phần còn lại của vastus medialis. Chức năng: kéo patella vào trong, counteract vastus lateralis (cơ đùi ngoài) đang kéo bánh chè ra ngoài.',
          'Patellofemoral pain syndrome (PFPS): bánh chè lệch ra ngoài do VMO yếu → ma sát giữa bánh chè và femoral groove tăng → đau trước gối, đặc biệt khi leo cầu thang, ngồi lâu, hoặc squat. PFPS là chấn thương gối phổ biến nhất ở người trẻ.',
          'Kỹ thuật với band: vòng resistance band nhẹ quanh cột và sau đầu gối (popliteal fossa). Đứng, gối hơi gập nhẹ, sau đó duỗi thẳng gối hoàn toàn — siết cơ tứ đầu ở điểm cuối (15 degrees cuối). Giữ 1 giây. Không cần motion lớn — chỉ 10–15° cuối của extension.',
          'Làm không có band: ngồi trên sàn, chân thẳng. Gập nhẹ gối 20°, sau đó duỗi thẳng hoàn toàn và siết mạnh cơ tứ đầu khi thẳng. Giữ 2 giây siết. Cảm nhận phần trong-trên của gối (VMO) co lại. Có thể đặt tay lên VMO để cảm nhận.',
          'Kết hợp với straight leg raise: VMO cũng active khi nâng chân thẳng (SLR). SLR + ankle weight là progression sau TKE. SLR không có gối gập = không có shear force lên gối → cực kỳ an toàn ngay cả sau surgery.',
          'Timeline thực tế: VMO atrophy sau chấn thương gối hoặc surgery rất nhanh (24–48h). Nhưng phục hồi chậm hơn — cần 6–12 tuần tập nhất quán để thấy VMO "tròn" trở lại và patellar tracking cải thiện. Không expect thay đổi trong 1–2 tuần.',
        ],
        points: [
          { icon: '🎯', label: 'VMO = patellar tracking guard', note: 'VMO yếu → bánh chè lệch ngoài → ma sát → đau trước gối khi leo cầu thang, squat' },
          { icon: '📐', label: 'Chỉ 10–15° cuối của duỗi gối', note: 'VMO hoạt động nhiều nhất ở cuối tầm — squat và lunge không target đủ vùng này' },
          { icon: '✋', label: 'Đặt tay lên VMO để cảm nhận', note: 'Phần trong-trên gối — kiểm tra cơ co khi duỗi thẳng. Biofeedback tự nhiên' },
          { icon: '⏳', label: '6–12 tuần mới thấy kết quả', note: 'VMO atrophy nhanh, phục hồi chậm — kiên trì 6–12 tuần, không expect kết quả trong 1–2 tuần' },
        ],
      },
      {
        name: 'Hamstring stretch nhẹ', reps: '30s mỗi bên', why: 'Giảm lực kéo sau gối',
        icon: '🏃', color: '#f43f5e', rgb: '244,63,94',
        title: 'Hamstring Stretch Nhẹ — Giảm Tải Sau Gối',
        img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Hamstring tight tạo "posterior knee pull" — kéo liên tục vào sau gối qua hamstring attachment ở đầu gối. Với gối đang phục hồi sau chấn thương hoặc đau mãn tính, thêm lực kéo này làm trậm quá trình phục hồi. Stretch NHẸ (không ép mạnh) 30 giây/bên giảm resting tension của hamstring và giảm posterior knee stress mà không gây thêm microtrauma.',
        detail: 'Từ "nhẹ" trong tên bài quan trọng — với gối đau, hamstring stretch phải thực sự nhẹ nhàng. Đừng ép đến điểm đau. Stretch tĩnh nhẹ giảm muscle tone (resting tension) mà không gây microtrauma. Đây là flexibility maintenance, không phải aggressive lengthening.',
        details: [
          'Posterior knee anatomy: hamstring gắn vào fibula head và tibia qua các tendons khác nhau. Resting tension của hamstring kéo tibia ra sau → posterior knee capsule stress. Với gối đang viêm hoặc sau chấn thương PCL/posterior capsule, tension này cần được minimize.',
          'Supine hamstring stretch (an toàn nhất cho gối): nằm ngửa, nâng 1 chân lên, dùng dây/khăn quanh đùi (không phải bàn chân) để giữ chân lên mà không cần co cơ. Gập gối nhẹ (không thẳng hoàn toàn) nếu gối đang đau. Cảm thấy kéo nhẹ ở đùi sau — không phải căng mạnh.',
          '30 giây đủ cho resting tone reduction: khác với flexibility training (cần 60–90s), mục tiêu ở đây chỉ là giảm resting muscle tone. 30 giây đủ để GTO kích hoạt và tone giảm nhẹ. Không cần ép sâu hơn — nhẹ nhàng là ưu tiên.',
          'KHÔNG làm nếu: đau sắc ở gối khi stretch, tê bì lan xuống bàn chân (sciatic nerve involvement), hoặc đau tăng khi duỗi gối (có thể là meniscus issue). Với những triệu chứng này, hamstring stretch nhẹ vẫn có thể làm theo hướng nằm ngửa với gối gập nhẹ.',
          'Kết hợp với calf stretch: hamstring và calf đều gắn vào phía sau đầu gối. Sau hamstring stretch, làm soleus stretch (gập gối, ép vào tường) để giải quyết cả hai phía của posterior knee. Sequential stretching toàn bộ posterior chain giảm tổng tension hiệu quả hơn từng bài riêng lẻ.',
          'Neural tension consideration: một số người có đau lan xuống chân khi stretch hamstring (sciatic nerve bị kéo căng — neurodynamics). Nếu đau theo đường thần kinh, làm "neural flossing" thay vì stretch cơ thuần túy — gập và duỗi gối nhẹ nhàng trong khi giữ hông flexed, không giữ tĩnh.',
        ],
        points: [
          { icon: '🪶', label: 'Nhẹ nhàng — không ép mạnh', note: 'Gối đau: giảm resting tone, không aggressive lengthening. Kéo nhẹ ở đùi sau là đủ' },
          { icon: '🛡️', label: 'Giảm posterior knee stress', note: 'Hamstring resting tension kéo tibia ra sau — giảm tension = giảm tải capsule và ligaments' },
          { icon: '⚡', label: 'Tê bì lan xuống = dừng ngay', note: 'Sciatic nerve involvement — không stretch thêm, cần neural flossing hoặc gặp chuyên gia' },
          { icon: '🔗', label: 'Sau đó → calf stretch', note: 'Hamstring + calf đều gắn sau gối — sequential stretch giảm tổng posterior knee tension' },
        ],
      },
    ]
  },
];

const ACTIVE_RECOVERY_BY_GOAL = [
  {
    goal: 'Giảm mỡ', activities: 'Đi bộ nhẹ 20–30 phút, mobility 10 phút, giãn cơ tối', note: 'Tránh tập nặng ngày phục hồi',
    icon: '🔥', color: '#f43f5e', rgb: '244,63,94',
    title: 'Phục Hồi Cho Mục Tiêu Giảm Mỡ',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngày phục hồi KHÔNG phải ngày "nghỉ giảm cân". Khi ngủ đủ và active recovery đúng, cơ thể tiết GH (Growth Hormone) nhiều nhất — hormone đốt mỡ và tái tạo cơ bắp mạnh nhất mà không cần thuốc hay supplement nào. Thiếu ngủ 1 tiếng giảm GH tiết ra 70% đêm hôm đó.',
    detail: 'Ngày phục hồi khi giảm mỡ cần hai ưu tiên: duy trì NEAT (Non-Exercise Activity Thermogenesis) bằng đi bộ nhẹ và bảo vệ giấc ngủ. Hai yếu tố này ảnh hưởng đến metabolic rate và fat oxidation nhiều hơn 1 buổi tập bổ sung có thể làm.',
    details: [
      'Zone 1 walk đốt mỡ trực tiếp: ở cường độ nhẹ (<60% max HR, ~4–5 km/h), cơ thể dùng ~60–70% năng lượng từ fat oxidation. Đi bộ 30 phút ở Zone 1 đốt nhiều mỡ hơn HIIT 15 phút tính theo tổng fat gram — dù HIIT đốt nhiều calorie hơn, phần lớn từ glycogen.',
      'Cortisol và fat storage: tập quá nặng ngày phục hồi tăng cortisol — hormone tăng fat storage ở vùng bụng và ức chế fat oxidation. Ngày phục hồi đúng nghĩa giữ cortisol thấp, cho phép cơ thể ưu tiên fat làm nhiên liệu cả ngày.',
      'NEAT contribution: đi bộ nhẹ 30 phút/ngày × 7 ngày = 3,500+ kcal/tháng (tương đương ~0.4kg mỡ). NEAT (đi lại, đứng, di chuyển nhẹ) chiếm 15–30% total energy expenditure — nhiều người bỏ qua "ngày tập" nhưng hoàn toàn bất động, triệt tiêu NEAT.',
      'Mobility 10 phút chiều: giúp duy trì range of motion để buổi tập nặng hôm sau hiệu quả hơn. Cơ thể linh hoạt = squat sâu hơn, deadlift đúng form = calorie đốt nhiều hơn ở mỗi buổi tập. Mobility recovery là đầu tư cho hiệu suất tập luyện hôm sau.',
      'Giãn cơ tối + thở chậm: giảm cortisol tối (peak 2 lần/ngày: sáng sớm và chiều). Cortisol tối cao → khó ngủ → GH tiết ít → recovery kém → fat loss chậm. 10 phút giãn cơ + thở 4-6 trước ngủ cắt vòng lặp này.',
      'Ăn ngày phục hồi như thế nào: không cần "eat back" calorie từ đi bộ nhẹ. Duy trì deficit nhỏ (–200 đến –300 kcal). Ưu tiên protein đủ (1.6–2g/kg) để bảo vệ muscle trong deficit. Ngày phục hồi không phải "cheat day" — nhưng cũng không cần ăn ít hơn ngày tập nặng.',
    ],
    points: [
      { icon: '🌙', label: 'GH tiết tối đa khi ngủ sâu', note: 'Ngủ đủ 7–8h = hormone đốt mỡ mạnh nhất — không supplement nào thay thế được' },
      { icon: '🚶', label: 'Zone 1 walk đốt mỡ trực tiếp', note: '30 phút <60% max HR = 60–70% năng lượng từ fat oxidation' },
      { icon: '📉', label: 'Cortisol thấp = fat loss cao', note: 'Tập nặng ngày phục hồi tăng cortisol → tăng fat storage bụng — counterproductive' },
      { icon: '🍽️', label: 'Duy trì protein cao', note: '1.6–2g/kg protein ngày phục hồi để bảo vệ cơ bắp trong calorie deficit' },
    ],
  },
  {
    goal: 'Tăng cơ', activities: 'Đi bộ 15–20 phút, stretching, foam rolling nhẹ', note: 'Ngủ đủ 7–9h là ưu tiên số 1',
    icon: '💪', color: '#f97316', rgb: '249,115,22',
    title: 'Phục Hồi Cho Mục Tiêu Tăng Cơ',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ bắp KHÔNG lớn lên trong khi tập — chúng lớn lên trong khi ngủ và nghỉ ngơi. Tập luyện chỉ tạo ra stimulus (kích thích). Phục hồi là lúc protein synthesis (tổng hợp protein cơ) diễn ra — quá trình này cần 24–72h tùy nhóm cơ và cường độ. Người không ngủ đủ + không nghỉ đúng sẽ train harder nhưng gain slower.',
    detail: 'Hai sai lầm phổ biến nhất khi tăng cơ: (1) tập nhiều ngày liên tiếp vì nghĩ nhiều tập = nhiều cơ, và (2) bỏ bữa hoặc ăn ít vào ngày không tập. Cả hai đều làm chậm muscle protein synthesis đáng kể.',
    details: [
      'Protein synthesis window: sau tập nặng, muscle protein synthesis (MPS) tăng cao 24–48h. Đây là cửa sổ cơ thể "hấp thụ" protein để xây dựng cơ. Trong 48h này, cần đủ protein (0.4g/kg/bữa × 4 bữa) và calorie dương. Ngày phục hồi là "building day" không kém ngày tập.',
      'GH và IGF-1 trong deep sleep: Growth Hormone tiết 70–80% trong giai đoạn N3 deep sleep (1–3 giờ sáng). GH kích hoạt IGF-1 ở gan → IGF-1 là signal chính để cơ bắp tổng hợp protein mới. 7–9h ngủ = 1–2 chu kỳ deep sleep đầy đủ = GH peak đủ. Dưới 6h ngủ, mất hoàn toàn chu kỳ GH peak thứ 2.',
      'Foam rolling trước stretching: foam roller làm mềm myofascia (vỏ bọc cơ), tăng lưu thông máu và chuẩn bị cơ cho stretching sâu hơn. Cơ sau tập nặng có micro-tears và viêm nhẹ — foam rolling tăng lymphatic flow giúp loại bỏ debris viêm nhanh hơn.',
      'Tại sao chỉ 15–20 phút đi bộ: đủ để tăng lưu thông máu đưa amino acid đến cơ đang phục hồi, nhưng không đủ cường độ để tạo thêm catabolic stress. Đi bộ nhẹ sau tập nặng = "nutrient delivery" cho cơ bắp đang rebuild — hiệu quả hơn ngồi yên.',
      'Đừng bỏ bữa ngày không tập: MPS vẫn cần nguyên liệu (amino acid) 24–48h sau buổi tập. Ăn ít ngày không tập = thiếu nguyên liệu khi cơ đang xây dựng. Nếu muốn eat less, giảm carb một chút nhưng giữ nguyên protein.',
      'Stretching static ngày phục hồi: không làm ngay sau tập nặng (tránh kéo cơ đang bị micro-torn). Nhưng ngày hôm sau — static stretching 20–30s giúp cơ sắp xếp lại collagen fiber đúng hướng trong quá trình healing → cơ hồi phục dẻo dai hơn, ít dính và cứng hơn về dài hạn.',
    ],
    points: [
      { icon: '🛌', label: '7–9h ngủ = ưu tiên số 1', note: 'GH peak trong deep sleep — không có gì thay thế được ngủ đủ cho muscle gain' },
      { icon: '🥩', label: 'Không bỏ bữa ngày nghỉ', note: 'MPS vẫn active 24–48h sau tập — cơ cần protein nguyên liệu cả ngày hôm sau' },
      { icon: '🫀', label: 'Đi bộ nhẹ = nutrient delivery', note: 'Tăng lưu thông máu đưa amino acid đến cơ đang rebuild — tốt hơn ngồi yên' },
      { icon: '🧻', label: 'Foam roll → stretch → nghỉ', note: 'Thứ tự đúng: làm mềm fascia trước, stretch sau, rồi ngủ sớm' },
    ],
  },
  {
    goal: 'Sức bền', activities: 'Đạp/đi bộ/bơi Zone 1–2 (nhịp tim dưới 130)', note: 'Active recovery giảm lactate tốt hơn nghỉ hoàn toàn',
    icon: '🏃', color: '#0ea5e9', rgb: '14,165,233',
    title: 'Phục Hồi Cho Mục Tiêu Sức Bền',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vận động viên sức bền elite có điểm chung: 80% training volume ở Zone 1–2 (nhẹ), 20% ở Zone 4–5 (hard). Ngày phục hồi ở Zone 1–2 không chỉ là nghỉ ngơi — chúng xây dựng aerobic base, tăng mật độ mitochondria và cải thiện fat oxidation ở cường độ thấp. Nghỉ hoàn toàn thực sự làm chậm aerobic adaptation.',
    detail: '80/20 rule (Polarized Training) là phương pháp được nghiên cứu nhiều nhất cho sức bền. Phần lớn người mới mắc lỗi "gray zone" — tập ở cường độ vừa quá thường xuyên, không đủ cả để build base lẫn tạo high-end stimulus. Ngày phục hồi Zone 1–2 đúng nghĩa là phần không thể thiếu của hệ thống này.',
    details: [
      'Lactate clearance cơ chế: sau buổi tập cường độ cao, lactate tích lũy trong máu và cơ bắp. Nghỉ hoàn toàn làm lactate clearance chậm — gan phải chuyển hóa hết. Active recovery Zone 1–2 dùng lactate làm nhiên liệu cho cơ đang hoạt động nhẹ → clearance nhanh hơn 50% so với nghỉ hoàn toàn. Đây là lý do vận động viên "jog nhẹ" sau thi đấu thay vì nằm xuống.',
      'Mitochondria biogenesis: Zone 1–2 training kích hoạt PGC-1α — protein kích hoạt sản xuất mitochondria mới (biogenesis). Mitochondria là "nhà máy năng lượng" của cơ bắp. Nhiều mitochondria = VO2max cao hơn, sức bền tốt hơn, phục hồi nhanh hơn. Zone 1–2 ngày phục hồi vừa rest vừa build mitochondria đồng thời.',
      'Fat oxidation efficiency: Zone 1–2 training dạy cơ thể dùng fat làm nhiên liệu hiệu quả hơn. Người train Zone 1–2 nhiều có thể chạy marathon pace nhanh hơn trước khi bắt đầu dùng glycogen — tiết kiệm glycogen cho final sprint. Đây là "metabolic efficiency" không xây được bằng Zone 4–5 training.',
      'Cường độ đúng cho Zone 1–2: Zone 1 < 60% max HR (~100–115 bpm cho người 30 tuổi). Zone 2 = 60–70% max HR (~115–135 bpm). Talk test: Zone 2 = có thể nói cả câu nhưng không muốn nói nhiều. Không phải "bước nhanh vừa" — phải đủ nhẹ để duy trì 45–90 phút thoải mái.',
      'Hoạt động phù hợp: đạp xe (cường độ thấp, gear nhẹ), bơi nhẹ nhàng (không sprint), chạy bộ cực chậm (nhiều người không thể Zone 2 khi chạy — đạp xe hoặc đi bộ nhanh thường dễ maintain Zone 2 hơn). Rowing machine ở resistance thấp cũng tốt.',
      'Tần suất active recovery: runners tốt nhất thế giới train 10–12 buổi/tuần — trong đó 8–9 buổi ở Zone 1–2. Với người tập 4–5 lần/tuần, 1–2 buổi Zone 1–2 active recovery/tuần là tối ưu. Không cần dài — 30–45 phút đủ để kích hoạt lactate clearance và mitochondria signal.',
    ],
    points: [
      { icon: '🔋', label: '80% volume ở Zone 1–2', note: 'Polarized training: phần lớn low, phần nhỏ high — không có "gray zone" vừa' },
      { icon: '⚗️', label: 'Lactate clearance nhanh hơn 50%', note: 'Active recovery dùng lactate làm nhiên liệu — nhanh hơn nhiều so với nghỉ hoàn toàn' },
      { icon: '🏭', label: 'Xây mitochondria khi recovery', note: 'PGC-1α kích hoạt mitochondria biogenesis ở Zone 1–2 — rest và build đồng thời' },
      { icon: '💬', label: 'Talk test = Zone 2 check', note: 'Nói cả câu được nhưng không muốn nói nhiều — chuẩn Zone 2, không cần HR monitor' },
    ],
  },
  {
    goal: 'Đau mỏi mãn tính', activities: 'Mobility nhẹ cho vùng đau, thở chậm, đi bộ ngắn', note: 'Vận động nhẹ thường tốt hơn nghỉ ngơi hoàn toàn',
    icon: '🎯', color: '#8b5cf6', rgb: '139,92,246',
    title: 'Phục Hồi Cho Người Đau Mỏi Mãn Tính',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đau mãn tính tạo ra "pain-inactivity cycle": đau → nghỉ → cơ yếu hơn → đau nhiều hơn → nghỉ thêm. Nghiên cứu hiện đại cho thấy vận động nhẹ phù hợp phá vỡ vòng lặp này — tăng lưu thông máu, giải phóng endorphin tự nhiên, và giảm central sensitization (não "học" cảm nhận đau ít hơn). Nghỉ hoàn toàn thực sự làm đau mãn tính tồi hơn về dài hạn.',
    detail: 'Đau mãn tính (>12 tuần) khác hoàn toàn với đau cấp. Đau cấp = tín hiệu nguy hiểm thực sự từ mô. Đau mãn tính thường có hệ thần kinh trung ương đã "nhạy cảm hóa" — khuếch đại tín hiệu đau dù không còn tổn thương mô thực sự. Vận động nhẹ và kiểm soát nhận thức là điều trị tốt nhất cho sensitization này.',
    details: [
      'Pain-inactivity cycle: đau → giảm vận động → cơ yếu, khớp cứng → áp lực lên khớp tăng → đau hơn. Vòng lặp này tự duy trì và ngày càng xấu hơn nếu không can thiệp. Vận động nhẹ phá vỡ ở điểm "cơ yếu → áp lực tăng" — cơ mạnh hơn = áp lực khớp giảm = đau giảm.',
      'Endorphin và enkephalin: vận động nhẹ → tiết endorphin (opioid tự nhiên của não) và enkephalin (giảm đau tại tủy sống). Cơ chế này giải thích vì sao đi bộ 20 phút có thể giảm đau trong 2–4 giờ sau. Không phải giả thuyết — đây là cơ chế được đo bằng brain imaging.',
      'Central sensitization và graded exposure: khi hệ thần kinh đã sensitize, mục tiêu không phải chữa khỏi đau ngay mà là "dạy" não rằng vận động an toàn. Graded exposure — tăng dần cường độ/thời gian vận động rất từ từ — là phương pháp được chứng minh làm giảm sensitization theo thời gian.',
      'Mobility đúng vùng đau: không phải "stretch đau thêm" — mà là vận động trong range không đau (pain-free range of motion). Bắt đầu với biên độ nhỏ, nhẹ nhàng. Ví dụ: đau cổ → chin tuck nhẹ (không ép đến đau). Đau lưng → cat-cow ở biên độ 30% tầm vận động bình thường. Nguyên tắc: movement is medicine, but dose matters.',
      'Thở chậm và pain gate control: Gate Control Theory — tín hiệu xúc giác và proprioception (thở chậm, vận động nhẹ) "đóng cổng" (gate) đường dẫn tín hiệu đau lên não. Thở chậm bụng 5–6 nhịp/phút giảm pain perception đo được trên fMRI — brain imaging xác nhận cortex tiếp nhận ít tín hiệu đau hơn.',
      'Khi nào cần gặp chuyên gia: đau mãn tính không cải thiện sau 4–6 tuần can thiệp nhẹ, đau kèm tê bì hoặc yếu cơ (dấu hiệu thần kinh), đau tăng khi vận động nhẹ (không phải đau "cơ" bình thường mà đau sắc và ngay lập tức). Physiotherapist hoặc pain specialist có thể dùng các phương pháp sâu hơn.',
    ],
    points: [
      { icon: '🔄', label: 'Phá vỡ pain-inactivity cycle', note: 'Vận động nhẹ → cơ mạnh hơn → áp lực khớp giảm → đau giảm — vòng lặp tốt thay xấu' },
      { icon: '🧬', label: 'Endorphin tự nhiên 2–4h', note: 'Đi bộ nhẹ 20 phút tiết endorphin — giảm đau tự nhiên mà không cần thuốc' },
      { icon: '📏', label: 'Pain-free range of motion', note: 'Vận động trong biên độ không đau — không ép stretch đến đau. Nhỏ dần to là đúng' },
      { icon: '🫁', label: 'Thở chậm đóng cổng đau', note: 'Gate control theory — thở bụng 5–6 nhịp/phút giảm pain signal lên não đo được trên fMRI' },
    ],
  },
  {
    goal: 'Stress cao', activities: 'Đi bộ ngoài trời, thở cơ hoành, giãn cơ tối', note: 'Thiên nhiên + vận động nhẹ = double effect giảm cortisol',
    icon: '🌿', color: '#10b981', rgb: '16,185,129',
    title: 'Phục Hồi Cho Người Stress Cao',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress tâm lý cao là "invisible training load" — não và hệ thần kinh chịu tải như khi tập nặng mà không có physical output. Cortisol cao mãn tính ức chế recovery, phá hủy cơ bắp (catabolism), tăng fat storage bụng và giảm chất lượng giấc ngủ. Ngày stress cao = cần recovery nhiều hơn, không ít hơn — đây là điều hầu hết mọi người không nhận ra.',
    detail: 'Stress tâm lý và stress thể chất dùng chung "recovery budget". Ngày làm việc 10 giờ stress cao + tập nặng = overtraining risk cao. Ngày phục hồi khi stress cao cần ưu tiên hệ thần kinh phó giao cảm — đi bộ ngoài trời, thở chậm và ánh sáng tự nhiên là ba công cụ mạnh nhất.',
    details: [
      'Cortisol và invisible training load: cortisol tiết ra khi stress công việc, deadline, xung đột — giống như khi tập nặng. Hệ thần kinh và tuyến thượng thận không phân biệt "stress tâm lý" vs "stress tập luyện". Ngày stress cao + tập nặng có thể overload tuyến thượng thận, dẫn đến adrenal fatigue và recovery kéo dài.',
      'Thiên nhiên và Attention Restoration Theory: não ở môi trường tự nhiên (cây cối, bầu trời, âm thanh nước) kích hoạt "restorative" mode — soft fascination thay vì directed attention (tập trung căng thẳng). Nghiên cứu Nhật Bản (Shinrin-yoku/forest bathing) cho thấy 20 phút trong thiên nhiên giảm cortisol 12–15% và hạ nhịp tim đo được.',
      'Đi bộ ngoài trời vs trong nhà: ánh sáng tự nhiên ban ngày → tăng serotonin (mood stabilizer) và điều chỉnh nhịp sinh học. Serotonin là tiền chất của melatonin — ánh sáng tự nhiên buổi sáng = melatonin tốt hơn buổi tối = ngủ sâu hơn = recovery tốt hơn. Đi bộ trong nhà bỏ lỡ hoàn toàn lợi ích này.',
      'Thở cơ hoành và HRV: Heart Rate Variability (HRV) là chỉ số sức khỏe hệ thần kinh tự trị. Stress cao làm HRV giảm (hệ giao cảm dominant). Thở chậm bụng (4–6 nhịp/phút) tăng HRV trong vòng 5 phút — thay đổi đo được bằng thiết bị. HRV cao hơn = capacity phục hồi cao hơn.',
      'Giãn cơ tối và cortisol diurnal rhythm: cortisol có nhịp sinh học — cao nhất 30 phút sau khi thức dậy (CAR - Cortisol Awakening Response), giảm dần và nên về mức thấp vào tối. Stress mãn tính làm cortisol tối vẫn cao → khó ngủ. 10–15 phút giãn cơ nhẹ kèm thở chậm trước ngủ ép cortisol về baseline và kích hoạt melatonin.',
      'Tránh screen 1 giờ trước ngủ khi stress cao: màn hình xanh ức chế melatonin (tuyến pineal). Khi đã stress cao → cortisol cao → thêm screen → thêm ức chế melatonin → ngủ muộn hơn → ít deep sleep → cortisol hôm sau cao hơn → cycle tệ hơn. Thay screen bằng stretch + đọc sách nhẹ = break the cycle.',
    ],
    points: [
      { icon: '🌳', label: '20 phút thiên nhiên = -12% cortisol', note: 'Shinrin-yoku research: cây cối + ánh sáng tự nhiên giảm cortisol đo được' },
      { icon: '💚', label: 'Stress tâm lý = invisible load', note: 'Não dùng chung recovery budget với cơ thể — ngày stress cao cần nghỉ nhiều hơn' },
      { icon: '📊', label: 'Thở bụng tăng HRV trong 5 phút', note: '4–6 nhịp/phút diaphragmatic breathing → HRV tăng ngay — đo được bằng thiết bị' },
      { icon: '📵', label: 'Tắt màn hình 1h trước ngủ', note: 'Screen xanh + cortisol cao = double melatonin suppression — sleep quality sụp đổ' },
    ],
  },
];

function RecoveryModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.title}</h2>
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
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
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
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

export default function LifestyleRecoveryPage() {
  const [openZone, setOpenZone] = useState(null);
  const [recoveryTypeIdx, setRecoveryTypeIdx] = useState(null);
  const [routineIdx, setRoutineIdx] = useState(null);
  const [zoneExState, setZoneExState] = useState(null);
  const [goalIdx, setGoalIdx] = useState(null);

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
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-violet-400 transition-colors">
        ← Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${RGB},0.2)` }}>
          🔄
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Phục Hồi Chủ Động</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: COLOR, background: `rgba(${RGB},0.1)`, border: `1px solid rgba(${RGB},0.2)` }}>
            C4 — Active Recovery · 3 vùng đau mỏi
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
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
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
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
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Loại Phục Hồi</h2>
        <p className="text-muted text-lg mb-6">Click vào từng loại để hiểu cơ chế và khi nào dùng đúng.</p>
        <div className="grid gap-4">
          {RECOVERY_TYPES.map((r, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ borderColor: `rgba(${r.rgb},0.2)`, border: `1px solid rgba(${r.rgb},0.2)`, background: `rgba(${r.rgb},0.06)` }}
              onClick={() => setRecoveryTypeIdx(i)}>
              <span className="text-3xl shrink-0">{r.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-text text-base">{r.type}</div>
                <p className="text-muted text-sm mt-0.5">{r.desc}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: r.color }}>Dùng khi: {r.best}</p>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: r.color, background: `rgba(${r.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 10-min routine */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Routine Phục Hồi 10 Phút</h2>
        <p className="text-muted text-lg mb-6">Routine mẫu cho ngày sau tập nặng hoặc ngày cảm thấy căng cơ. Click để xem hướng dẫn chi tiết.</p>
        <div className="space-y-2">
          {ROUTINE_10.map((r, i) => (
            <div key={i}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${r.rgb},0.05)`, border: `1px solid rgba(${r.rgb},0.18)` }}
              onClick={() => setRoutineIdx(i)}>
              <span className="text-base font-bold tabular-nums w-20 shrink-0" style={{ color: r.color }}>{r.duration}</span>
              <span className="text-xl shrink-0">{r.icon}</span>
              <div className="flex-1">
                <div className="text-base font-semibold text-text">{r.name}</div>
                <div className="text-sm text-muted">{r.note}</div>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: r.color, background: `rgba(${r.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Zone fixes */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phục Hồi Theo Vùng Đau Mỏi</h2>
        <p className="text-muted text-lg mb-6">Chọn vùng đang đau mỏi để xem bài tập phù hợp.</p>
        <div className="space-y-3">
          {ZONE_FIXES.map((z, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: `rgba(${RGB},0.15)` }}>
              <button onClick={() => setOpenZone(openZone === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left" style={{ background: `rgba(${RGB},0.06)` }}>
                <span className="flex items-center gap-3">
                  <span className="text-3xl">{z.icon}</span>
                  <div>
                    <div className="font-bold text-text">{z.zone}</div>
                    <div className="text-base text-muted">{z.cause}</div>
                  </div>
                </span>
                <span style={{ color: COLOR }}>{openZone === i ? '▲' : '▼'}</span>
              </button>
              {openZone === i && (
                <div className="p-4 space-y-3">
                  {z.exercises.map((ex, j) => (
                    <div key={j}
                      className="flex items-center gap-3 py-2 px-1 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] border-b last:border-0"
                      style={{ borderColor: `rgba(${z.rgb},0.1)` }}
                      onClick={() => setZoneExState({ zi: i, ei: j })}>
                      <span className="text-xl shrink-0">{ex.icon}</span>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-text">{ex.name}</div>
                        <div className="text-sm text-muted">{ex.why}</div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums shrink-0" style={{ color: z.color }}>{ex.reps}</span>
                      <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                        style={{ color: ex.color, background: `rgba(${ex.rgb},0.1)` }}>Chi tiết →</span>
                    </div>
                  ))}
                  <p className="text-base text-muted pt-1">⚠️ Dừng ngay nếu cảm thấy đau nhói, tê lan hoặc yếu chân tay.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Active recovery by goal */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Active Recovery Theo Mục Tiêu</h2>
        <p className="text-muted text-lg mb-6">Click vào mục tiêu của bạn để xem hướng dẫn phục hồi chi tiết.</p>
        <div className="space-y-3">
          {ACTIVE_RECOVERY_BY_GOAL.map((g, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{ background: `rgba(${g.rgb},0.05)`, border: `1px solid rgba(${g.rgb},0.18)` }}
              onClick={() => setGoalIdx(i)}>
              <span className="text-2xl shrink-0">{g.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-text text-base" style={{ color: g.color }}>{g.goal}</div>
                <p className="text-muted text-sm mt-0.5">{g.activities}</p>
                <p className="text-xs mt-1 italic text-muted">{g.note}</p>
              </div>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-lg opacity-60"
                style={{ color: g.color, background: `rgba(${g.rgb},0.1)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Sample recovery day */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Ngày Phục Hồi Mẫu</h2>
        <p className="text-muted text-lg mb-6">Một ngày phục hồi không có nghĩa là nằm im cả ngày.</p>
        <div className="space-y-3">
          {[
            { time: 'Sáng', action: 'Ánh sáng + đi bộ nhẹ 10 phút' },
            { time: 'Trưa', action: 'Đi bộ 5 phút sau ăn' },
            { time: 'Chiều', action: 'Mobility 10 phút (vùng hay đau mỏi)' },
            { time: 'Tối', action: 'Giãn cơ nhẹ + thở chậm 5 phút' },
            { time: 'Đêm', action: 'Ngủ sớm hơn 30 phút so với ngày thường' },
          ].map((row, i) => (
            <div key={i} className="flex gap-4 items-center p-3 rounded-xl" style={{ background: `rgba(${RGB},0.04)` }}>
              <span className="w-14 text-base font-bold shrink-0" style={{ color: COLOR }}>{row.time}</span>
              <span className="text-lg text-muted">{row.action}</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link to="/pillar/c/neat" className="text-muted hover:text-violet-400 transition-colors text-lg">← NEAT</Link>
        <Link to="/pillar/c/deload" className="text-lg font-semibold" style={{ color: COLOR }}>Deload →</Link>
      </div>

      {/* ── Goal modal — outside all RevealBlocks ── */}
      {goalIdx !== null && (
        <RecoveryModal
          item={ACTIVE_RECOVERY_BY_GOAL[goalIdx]}
          idx={goalIdx}
          total={ACTIVE_RECOVERY_BY_GOAL.length}
          onClose={() => setGoalIdx(null)}
          onPrev={() => setGoalIdx(i => Math.max(0, i - 1))}
          onNext={() => setGoalIdx(i => Math.min(ACTIVE_RECOVERY_BY_GOAL.length - 1, i + 1))}
          hasPrev={goalIdx > 0}
          hasNext={goalIdx < ACTIVE_RECOVERY_BY_GOAL.length - 1}
        />
      )}

      {/* ── Zone exercise modal — outside all RevealBlocks ── */}
      {zoneExState !== null && (() => {
        const zone = ZONE_FIXES[zoneExState.zi];
        const ex = zone.exercises[zoneExState.ei];
        return (
          <RecoveryModal
            item={ex}
            idx={zoneExState.ei}
            total={zone.exercises.length}
            onClose={() => setZoneExState(null)}
            onPrev={() => setZoneExState(s => ({ ...s, ei: Math.max(0, s.ei - 1) }))}
            onNext={() => setZoneExState(s => ({ ...s, ei: Math.min(zone.exercises.length - 1, s.ei + 1) }))}
            hasPrev={zoneExState.ei > 0}
            hasNext={zoneExState.ei < zone.exercises.length - 1}
          />
        );
      })()}

      {/* ── Routine 10 modal — outside all RevealBlocks ── */}
      {routineIdx !== null && (
        <RecoveryModal
          item={ROUTINE_10[routineIdx]}
          idx={routineIdx}
          total={ROUTINE_10.length}
          onClose={() => setRoutineIdx(null)}
          onPrev={() => setRoutineIdx(i => Math.max(0, i - 1))}
          onNext={() => setRoutineIdx(i => Math.min(ROUTINE_10.length - 1, i + 1))}
          hasPrev={routineIdx > 0}
          hasNext={routineIdx < ROUTINE_10.length - 1}
        />
      )}

      {/* ── Recovery types modal — outside all RevealBlocks ── */}
      {recoveryTypeIdx !== null && (
        <RecoveryModal
          item={RECOVERY_TYPES[recoveryTypeIdx]}
          idx={recoveryTypeIdx}
          total={RECOVERY_TYPES.length}
          onClose={() => setRecoveryTypeIdx(null)}
          onPrev={() => setRecoveryTypeIdx(i => Math.max(0, i - 1))}
          onNext={() => setRecoveryTypeIdx(i => Math.min(RECOVERY_TYPES.length - 1, i + 1))}
          hasPrev={recoveryTypeIdx > 0}
          hasNext={recoveryTypeIdx < RECOVERY_TYPES.length - 1}
        />
      )}
    </div>
  );
}
