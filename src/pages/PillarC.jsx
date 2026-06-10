import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL = '#14b8a6';
const TEAL_RGB = '20,184,166';
const ORBIT_ID = 'pc3-orbit-kf';

const TABS = [
  { id: 'c0', label: 'Đánh Giá',    color: '#14b8a6', rgb: '20,184,166',   icon: '📋', frame: 'pc3-frame-0' },
  { id: 'c1', label: 'Giấc Ngủ',    color: '#14b8a6', rgb: '20,184,166',   icon: '😴', frame: 'pc3-frame-1' },
  { id: 'c2', label: 'Nhịp Sinh Học',color: '#06b6d4', rgb: '6,182,212',   icon: '☀️', frame: 'pc3-frame-2' },
  { id: 'c3', label: 'NEAT',         color: '#10b981', rgb: '16,185,129',  icon: '🚶', frame: 'pc3-frame-3' },
  { id: 'c4', label: 'Phục Hồi',    color: '#a78bfa', rgb: '167,139,250', icon: '🔄', frame: 'pc3-frame-4' },
  { id: 'c5', label: 'Deload',       color: '#f97316', rgb: '249,115,22',  icon: '⚡', frame: 'pc3-frame-5' },
  { id: 'c6', label: 'Thở',          color: '#0ea5e9', rgb: '14,165,233',  icon: '🌬️', frame: 'pc3-frame-6' },
  { id: 'c7', label: 'Môi Trường',   color: '#f43f5e', rgb: '244,63,94',   icon: '🏠', frame: 'pc3-frame-7' },
];

// ─── Tab content data ─────────────────────────────────────────────────────────

const C0_ITEMS = [
  {
    icon: '😴', label: 'Giấc ngủ', desc: 'Giờ ngủ, giờ thức, số giờ, chất lượng ngủ',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: '7–9 giờ ngủ chất lượng cải thiện hiệu suất tập luyện 20–25% và giảm nguy cơ bệnh mạn tính đáng kể.',
    detail: 'Giấc ngủ là nền tảng của mọi thứ — phục hồi cơ bắp, cân bằng hormone, trí nhớ và kiểm soát cơn thèm ăn. Đây là chỉ số đầu tiên cần đánh giá.',
    details: [
      'Ghi nhận giờ đi ngủ và giờ thức dậy trong 7 ngày liên tục — đây là baseline thực sự, không phải ý định.',
      'Chất lượng quan trọng hơn số giờ: ngủ 6 tiếng sâu tốt hơn 8 tiếng trằn trọc. Đánh giá 1–10 sau mỗi buổi sáng.',
      'Giờ ngủ nhất quán (lệch ≤60 phút mỗi ngày kể cả cuối tuần) điều tiết đồng hồ sinh học tốt hơn bất kỳ thói quen nào.',
      'Melatonin bắt đầu tiết 2 giờ trước khi bạn buồn ngủ tự nhiên — ánh sáng xanh và thức ăn nặng cản trở quá trình này.',
      'Giai đoạn ngủ sâu (deep sleep) xảy ra chủ yếu trong nửa đầu đêm — đi ngủ sau 00h mất nhiều deep sleep hơn tưởng.',
      'Nếu thức dậy mà không cảm thấy tươi tỉnh sau 7+ giờ → đây là tín hiệu cần điều chỉnh thói quen tối, không phải uống thêm cà phê.',
    ],
    points: [
      { icon: '⏰', label: 'Giờ ngủ ổn định', note: 'Lệch ≤60 phút mỗi ngày' },
      { icon: '🌙', label: 'Chất lượng ngủ', note: 'Chấm điểm 1–10 mỗi sáng' },
      { icon: '💤', label: '7–9 giờ/đêm', note: 'Người lớn trưởng thành' },
      { icon: '📊', label: 'Theo dõi 7 ngày', note: 'Xây baseline trước khi cải thiện' },
    ],
  },
  {
    icon: '⚡', label: 'Năng lượng', desc: 'Khi nào tỉnh nhất, khi nào dễ mệt nhất',
    color: '#06b6d4', rgb: '6,182,212',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhịp sinh học (circadian rhythm) quyết định ~60% mức năng lượng trong ngày — biết chu kỳ của mình để làm việc thuận theo, không phải chống lại nó.',
    detail: 'Năng lượng không phải là ý chí — là sinh lý học. Biết khi nào não bạn sắc bén nhất và khi nào cơ thể cần nghỉ giúp bạn tận dụng tối đa từng giờ.',
    details: [
      'Ghi nhận mức năng lượng mỗi 2–3 giờ trong 3 ngày (1–10): đây là cách duy nhất để biết "chronotype" thực sự của bạn.',
      'Hầu hết người có đỉnh năng lượng lúc 9–11h sáng và 15–17h chiều, với tụt mạnh lúc 13–15h sau ăn trưa.',
      'Khi nào tỉnh nhất → làm việc đòi hỏi tư duy sâu. Khi nào mệt nhất → họp, email, việc cơ học.',
      'Chu kỳ Ultradian ~90 phút: não hoạt động cường độ cao ~90 phút rồi cần nghỉ 10–20 phút. Đừng ép qua điểm này.',
      'Caffeine che giấu adenosine (chất gây buồn ngủ) chứ không tạo năng lượng thật — uống quá nhiều làm rối loạn chu kỳ tự nhiên.',
      'Ánh sáng tự nhiên buổi sáng là "nút reset" mạnh nhất cho đồng hồ sinh học — 5 phút ra ngoài sau khi thức đủ để có hiệu quả.',
    ],
    points: [
      { icon: '📈', label: 'Đỉnh năng lượng', note: 'Thường 9–11h và 15–17h' },
      { icon: '🔄', label: 'Chu kỳ 90 phút', note: 'Nghỉ 10–20 phút sau mỗi chu kỳ' },
      { icon: '☀️', label: 'Ánh sáng sáng', note: '5 phút ra ngoài sau khi thức' },
      { icon: '☕', label: 'Caffeine thông minh', note: 'Uống sau 90 phút thức dậy' },
    ],
  },
  {
    icon: '🚶', label: 'Vận động trong ngày', desc: 'Số bước, thời gian ngồi, di chuyển nhẹ',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: '8.000 bước/ngày giảm 51% nguy cơ tử vong sớm theo nghiên cứu JAMA 2021 — và bạn không cần tập gym để đạt được con số này.',
    detail: 'NEAT (Non-Exercise Activity Thermogenesis) — vận động ngoài tập gym — chiếm 15–50% tổng năng lượng tiêu thụ. Đây là "vũ khí bí mật" mà nhiều người bỏ qua.',
    details: [
      'Đếm số bước hiện tại trước khi đặt mục tiêu — nhiều người tập gym nhưng vẫn chỉ đi 3.000–4.000 bước vì ngồi cả ngày.',
      'Ngồi >8 giờ liên tục làm tăng nguy cơ bệnh tim mạch độc lập với việc có tập gym hay không — đứng dậy mỗi 45–60 phút.',
      'Mỗi 1.000 bước thêm vào baseline hiện tại tạo ra lợi ích sức khỏe có thể đo được — không cần nhảy lên 10.000 ngay.',
      'Di chuyển nhẹ sau bữa ăn (5–10 phút đi bộ) giảm đường huyết sau ăn 20–30% hiệu quả hơn nhiều so với ngồi yên.',
      'Thời gian ngồi liên tục quan trọng hơn tổng thời gian ngồi: ngồi 8 tiếng nhưng đứng mỗi giờ tốt hơn ngồi liên tục 4 tiếng.',
      'Mục tiêu thực tế: tăng 500–1.000 bước mỗi tuần cho đến khi đạt 7.000–8.000 bước/ngày một cách tự nhiên.',
    ],
    points: [
      { icon: '👣', label: '7.000–8.000 bước', note: 'Mục tiêu thiết thực nhất' },
      { icon: '⏱️', label: 'Đứng mỗi 45–60 phút', note: 'Chống tác hại của ngồi lâu' },
      { icon: '🍽️', label: 'Đi bộ sau ăn', note: '5–10 phút kiểm soát đường huyết' },
      { icon: '📱', label: 'Đeo máy đếm bước', note: 'Hoặc dùng app điện thoại' },
    ],
  },
  {
    icon: '🔄', label: 'Phục hồi', desc: 'Đau mỏi vai gáy, lưng, gối; dấu hiệu quá tải',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: '40% chấn thương thể thao và đau mạn tính không xuất phát từ tập quá sức — mà từ phục hồi không đủ và bỏ qua các tín hiệu cảnh báo sớm.',
    detail: 'Phục hồi không phải nghỉ ngơi thụ động — là tập hợp các thực hành chủ động giúp cơ thể tái tạo, giảm viêm và chuẩn bị cho buổi tập tiếp theo.',
    details: [
      'Đau mỏi vai gáy và lưng dưới sau ngồi làm việc là tín hiệu của cơ yếu và tư thế sai — không phải "tự nhiên" phải chịu.',
      'Phân biệt đau cơ do tập (DOMS — nhức 1–3 ngày sau tập, lan tỏa) và đau khớp/gân (nhói, cố định vị trí → cần nghỉ và kiểm tra).',
      'Mobility 5–10 phút/ngày hiệu quả hơn foam roll 1 tiếng/tuần — tính nhất quán quan trọng hơn cường độ phục hồi.',
      'Dấu hiệu quá tải: nhịp tim nghỉ cao hơn bình thường 5–7 bpm, mất ngủ dù mệt, hiệu suất giảm liên tiếp 2–3 buổi.',
      'Deload (tuần giảm khối lượng tập 40–50%) mỗi 4–6 tuần giúp phục hồi sâu và thường đi kèm với bước tiến sau đó.',
      'Lạnh/nóng, massage, và giãn cơ đều là công cụ — không có gì tốt nhất cho mọi người. Thử và quan sát phản ứng của cơ thể bạn.',
    ],
    points: [
      { icon: '🩺', label: 'Phân biệt loại đau', note: 'Cơ bắp vs khớp/gân' },
      { icon: '🧘', label: 'Mobility 5–10 phút/ngày', note: 'Nhất quán hơn là cường độ' },
      { icon: '📉', label: 'Dấu hiệu quá tải', note: 'Tim nhanh, mất ngủ, giảm suất' },
      { icon: '🔁', label: 'Deload 4–6 tuần/lần', note: 'Giảm 40–50% khối lượng tập' },
    ],
  },
  {
    icon: '📱', label: 'Thói quen tối', desc: 'Màn hình, giờ ăn, phòng ngủ, công việc',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Màn hình ánh sáng xanh sau 20h làm chậm tiết melatonin 1–3 giờ và giảm chất lượng giấc ngủ ~20% theo nghiên cứu Harvard.',
    detail: 'Những gì bạn làm trong 2 giờ trước khi ngủ quyết định chất lượng 7–8 tiếng ngủ phía sau. Đây là cửa sổ can thiệp dễ nhất và có tác động lớn nhất.',
    details: [
      'Màn hình điện thoại/TV phát ánh sáng xanh (blue light) ức chế melatonin — hãy dùng chế độ Night Mode hoặc kính lọc ánh sáng xanh từ 20h.',
      'Ăn tối trước 20h lý tưởng — bữa ăn nặng gần giờ ngủ làm tăng thân nhiệt cơ thể, khó ngủ sâu và tăng nguy cơ trào ngược.',
      'Công việc căng thẳng sau 21h kích hoạt cortisol — để não "thoát khỏi" công việc, cần ít nhất 60 phút không làm việc trước khi ngủ.',
      'Phòng ngủ nên dưới 20°C — thân nhiệt giảm khi ngủ, và môi trường mát giúp quá trình này tự nhiên hơn.',
      'Routine tối dù ngắn 5 phút (tắm, đọc sách nhẹ, viết nhật ký ngắn) gửi tín hiệu đến não: sắp đến giờ ngủ.',
      'Không cần làm tất cả mọi thứ — chọn 1 thói quen thay đổi, duy trì 2–3 tuần, rồi mới thêm cái tiếp theo.',
    ],
    points: [
      { icon: '🌑', label: 'Giảm màn hình 20h+', note: 'Night mode hoặc kính xanh' },
      { icon: '🍽️', label: 'Ăn tối trước 20h', note: 'Không ăn nặng gần giờ ngủ' },
      { icon: '❄️', label: 'Phòng mát <20°C', note: 'Nhiệt độ tối ưu để ngủ sâu' },
      { icon: '📖', label: 'Routine tối 5–30 phút', note: 'Tín hiệu cho não chuẩn bị ngủ' },
    ],
  },
];

const C0_SCORE = [
  { label: 'Ngủ ≥ 7 giờ hoặc cải thiện', pts: 20 },
  { label: 'Giờ ngủ tương đối ổn định', pts: 15 },
  { label: 'Có ánh sáng/vận động sáng', pts: 15 },
  { label: 'Số bước / NEAT đạt mục tiêu', pts: 15 },
  { label: 'Không ngồi quá lâu liên tục', pts: 10 },
  { label: 'Có phục hồi/mobility/thở', pts: 15 },
  { label: 'Giảm màn hình/caffeine tối', pts: 10 },
];

const C1_STEPS = [
  { step: '1', title: 'Cố định khung giờ ngủ – thức', desc: 'Không cần tuyệt đối chính xác, nhưng nên giữ lệch không quá 60 phút giữa các ngày, kể cả cuối tuần.', icon: '🕙' },
  { step: '2', title: 'Giảm ánh sáng mạnh buổi tối', desc: 'Tắt bớt đèn, giảm màn hình từ 21–22h. Ánh sáng mạnh ban đêm ức chế melatonin tự nhiên.', icon: '💡' },
  { step: '3', title: 'Giảm kích thích cơ thể', desc: 'Tránh caffeine sau 14–15h, tránh tập quá nặng sát giờ ngủ, tránh làm việc căng ngay trước ngủ.', icon: '☕' },
  { step: '4', title: 'Tối ưu phòng ngủ', desc: 'Phòng tối, mát (~18–21°C), yên tĩnh. Giường dùng chủ yếu để ngủ, không làm việc hay xem video trên giường.', icon: '🛏️' },
];

const C1_CHECKLIST = [
  'Giảm màn hình trước ngủ 30+ phút',
  'Không uống caffeine sau 15h',
  'Có routine tối 5–30 phút',
  'Lên giường trong khung giờ dự kiến',
  'Ngủ đủ hoặc tốt hơn hôm qua',
];

const C2_MORNING_5 = [
  { time: '1 phút', action: 'Uống 1 ly nước' },
  { time: '2 phút', action: 'Mở rèm / ra ngoài trời lấy ánh sáng' },
  { time: '1 phút', action: 'Đi bộ nhẹ tại chỗ + xoay vai, xoay hông' },
  { time: '1 phút', action: 'Hít thở sâu 4–6 nhịp' },
];

const C2_MORNING_10 = [
  { time: '2 phút', action: 'Uống nước, mở cửa, tiếp xúc ánh sáng tự nhiên' },
  { time: '3 phút', action: 'Đi bộ nhẹ trong nhà hoặc ra ngoài' },
  { time: '3 phút', action: 'Mobility: cổ vai gáy, xoay hông, vươn người' },
  { time: '2 phút', action: 'Thở chậm + xác định 1 việc chính trong ngày' },
];

const C2_ENERGY_TIPS = [
  { icon: '☀️', title: 'Ánh sáng sáng', desc: 'Ra ánh sáng tự nhiên 3–5 phút sau khi thức. Báo hiệu cho cơ thể bắt đầu ngày mới.' },
  { icon: '💧', title: 'Uống nước đầu ngày', desc: 'Uống 200–300ml nước ngay khi thức. Cơ thể mất nước sau 7–9 giờ ngủ không có nước.' },
  { icon: '🍽️', title: 'Bữa đầu có đạm', desc: 'Protein buổi sáng giúp ổn định đường huyết, tránh tụt năng lượng buổi chiều.' },
  { icon: '🚶', title: 'Đi bộ sau ăn', desc: '5–10 phút đi bộ sau bữa trưa giúp tỉnh táo, tránh buồn ngủ sau ăn và ổn định đường huyết.' },
  { icon: '☕', title: 'Caffeine thông minh', desc: 'Không uống caffeine khi chưa uống nước và ăn nhẹ. Tránh caffeine sau 15h với người khó ngủ.' },
];

const C3_LEVELS = [
  { level: 'Mới bắt đầu', steps: '+1.000–2.000 bước so với nền', color: '#10b981' },
  { level: 'Cơ bản', steps: '6.000–8.000 bước/ngày', color: '#059669' },
  { level: 'Khỏe hơn', steps: '8.000–10.000 bước/ngày', color: '#047857' },
  { level: 'Tập nhiều', steps: 'Cá nhân hóa theo phục hồi', color: '#065f46' },
];

const C3_IDEAS = [
  'Đi cầu thang thay vì thang máy 1–2 tầng',
  'Gửi xe xa hơn một chút khi đi làm',
  'Nghe điện thoại khi đứng hoặc đi lại',
  'Họp ngắn thực hiện khi đi bộ',
  'Đặt bình nước xa bàn để phải đứng dậy',
  'Đi bộ 5 phút trước khi vào nhà sau công việc',
  'Dọn nhà 10 phút — cũng là vận động!',
  'Đi bộ sau ít nhất 1 bữa ăn/ngày',
];

const C4_ROUTINE = [
  { exercise: 'Thở cơ hoành', duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng' },
  { exercise: 'Shoulder roll', duration: '1 phút', note: 'Xoay vai trước và sau' },
  { exercise: 'Thoracic twist', duration: '1 phút', note: 'Xoay lưng ngực từng bên' },
  { exercise: 'Hip flexor stretch', duration: '1 phút × 2', note: 'Giãn gấp hông từng bên' },
  { exercise: 'Hamstring stretch', duration: '1 phút × 2', note: 'Giãn đùi sau từng bên' },
  { exercise: 'Child pose + thở', duration: '2 phút', note: 'Thư giãn hoàn toàn' },
  { exercise: 'Đi bộ nhẹ', duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng' },
];

const C4_ZONES = [
  { zone: 'Cổ vai gáy', icon: '🦴', exercises: ['Chin tuck 10 lần', 'Shoulder roll', 'Doorway stretch', 'Scapular squeeze', 'Thoracic twist'] },
  { zone: 'Lưng', icon: '🫀', exercises: ['Dead bug 10 lần', 'Bird-dog 10 lần', 'Glute bridge 15 lần', 'Child pose 1 phút', 'Hip flexor stretch'] },
  { zone: 'Gối', icon: '🦵', exercises: ['Sit-to-stand 10 lần', 'Glute bridge 15 lần', 'Calf raise 15 lần', 'Split squat bám tường (nhẹ)', 'Hamstring stretch'] },
];

const C5_SIGNALS = [
  'Ngủ kém 2–3 đêm liên tiếp',
  'Tập bài quen nhưng thấy rất nặng',
  'Đau mỏi cơ kéo dài không phục hồi',
  'Nhịp tim nghỉ cao hơn bình thường',
  'Mất động lực, cáu gắt, uể oải',
  'Đau khớp hoặc đau tăng dần',
  'Hiệu suất giảm liên tục nhiều buổi',
];

const C5_METHODS = [
  { icon: '📉', title: 'Giảm số hiệp', desc: 'Ví dụ: 4 hiệp → 2–3 hiệp. Giữ nguyên cường độ.' },
  { icon: '🏋️', title: 'Giảm mức tạ', desc: 'Giảm 10–20% trọng lượng so với tuần trước.' },
  { icon: '🏃', title: 'Giảm thời lượng cardio', desc: '45 phút → 25–30 phút. Hoặc chuyển sang Zone 1–2.' },
  { icon: '🚶', title: 'Giảm cường độ', desc: 'Chạy nhanh → đi bộ nhanh, đạp xe nhẹ, bơi nhẹ.' },
];

const C6_TECHNIQUES = [
  { name: 'Thở cơ hoành', steps: 'Tay lên bụng • Hít mũi → bụng phồng • Thở miệng chậm • Ngực ít nâng', time: '1–3 phút', use: 'Trước ngủ, sau tập, khi căng thẳng' },
  { name: 'Box breathing', steps: 'Hít 4 giây • Giữ 4 giây • Thở 4 giây • Giữ 4 giây • Lặp 4 vòng', time: '4 vòng', use: 'Trước tập, lúc stress, trước ngủ' },
  { name: 'Thở ra dài hơn', steps: 'Hít 4 giây • Thở ra 6 giây • Lặp 6–10 vòng', time: '2–3 phút', use: 'Khó ngủ, tim đập nhanh, sau ngày mệt' },
];

const C7_AREAS = [
  { area: 'Buổi sáng', icon: '🌅', tips: ['Đặt bình nước trên bàn đầu giường', 'Để giày đi bộ ở cửa', 'Chuẩn bị đồ tập từ tối hôm trước', 'Đặt điện thoại xa giường', 'Mở rèm dễ dàng'] },
  { area: 'Làm việc', icon: '💼', tips: ['Đặt bình nước xa bàn để buộc phải đứng dậy', 'Dùng timer 45–60 phút', 'Để dây kháng lực nhỏ ở bàn', 'Tạo góc đứng làm việc 10–15 phút', 'Đặt nhắc "đi bộ 2 phút"'] },
  { area: 'Buổi tối', icon: '🌙', tips: ['Giảm đèn sau 21–22h', 'Sạc điện thoại ngoài phòng ngủ', 'Để sách giấy cạnh giường', 'Chuẩn bị quần áo ngày mai', 'Viết 3 việc ngày mai'] },
];

// ─── RevealBlock ───────────────────────────────────────────────────────────────

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

// ─── TeaserCard ───────────────────────────────────────────────────────────────

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features = [], stats = [], image, imageAlt, cta }) {
  return (
    <Link to={to} className="group relative flex flex-col md:flex-row rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ '--tc': color }}>
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between" style={{ minWidth: 0 }}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{icon}</span>
            <span className="text-base font-bold uppercase tracking-widest" style={{ color }}>{category}</span>
          </div>
          <h3 className="text-xl font-bold text-text mb-1 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-base font-semibold mb-2" style={{ color }}>{accent}</p>
          <p className="text-muted text-lg leading-relaxed mb-4">{desc}</p>
          <ul className="space-y-1 mb-4">
            {features.map((f, i) => (
              <li key={i} className="text-base text-muted flex items-center gap-2">
                <span style={{ color }}>✦</span>{f}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-4 mt-auto">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold" style={{ color }}>{s.v}</div>
              <div className="text-base text-muted">{s.l}</div>
            </div>
          ))}
          <span className="ml-auto text-base font-semibold" style={{ color }}>{cta}</span>
        </div>
      </div>
      {image && (
        <div className="md:w-44 h-36 md:h-auto relative shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--color-surface), transparent)' }} />
        </div>
      )}
    </Link>
  );
}

function TeaserSection({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        {title}
        <span className="h-px flex-1 bg-border" />
      </h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

// ─── C0ItemModal ──────────────────────────────────────────────────────────────

function C0ItemModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color }}>{item.label}</h2>
          <p className="text-sm mb-4" style={{ color: `rgba(${rgb},0.7)` }}>{item.detail}</p>

          {/* Key fact */}
          <div className="rounded-2xl px-4 py-3 mb-6 flex items-start gap-3"
            style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <span className="text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm leading-relaxed" style={{ color: `rgba(${rgb},0.9)` }}>{item.keyFact}</p>
          </div>

          {/* Numbered details */}
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col */}
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

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {C0_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PillarC() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarC', { returnObjects: true });
  const [activeTab, setActiveTab] = useState('c1');
  const [c0Idx, setC0Idx] = useState(null);
  const [sleepChecks, setSleepChecks] = useState({});
  const [neatChecks, setNeatChecks] = useState({});
  const [openZone, setOpenZone] = useState(null);
  const [morningMode, setMorningMode] = useState('5');
  const [breathMode, setBreathMode] = useState(0);
  const tabBarRef = useRef(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pc3-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pc3OrbitSpin { to { --pc3-orbit-angle: 360deg; } }
      .pc3-orbit-ring {
        background: conic-gradient(from var(--pc3-orbit-angle),transparent 0deg,transparent 55deg,rgba(20,184,166,0) 65deg,rgba(20,184,166,0.75) 85deg,rgba(255,255,255,0.9) 92deg,rgba(20,184,166,0.75) 99deg,rgba(20,184,166,0) 115deg,transparent 125deg,transparent 360deg);
        animation: pc3OrbitSpin 3.5s linear infinite;
      }
      ${TABS.map((t, i) => `
        @property --pc3f${i}-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes pc3f${i}Spin { to { --pc3f${i}-angle: 360deg; } }
        .${t.frame} {
          background: conic-gradient(from var(--pc3f${i}-angle),transparent 0deg,transparent 75deg,rgba(${t.rgb},0) 82deg,rgba(${t.rgb},0.6) 90deg,rgba(${t.rgb},0.6) 96deg,rgba(${t.rgb},0) 104deg,transparent 111deg,transparent 360deg);
          animation: pc3f${i}Spin 4s linear infinite;
          border-radius: 1rem; padding: 1.5px;
        }
      `).join('')}
      @keyframes pcTitleWave {
        0%   { background-position: -300% center; }
        100% { background-position: 300% center; }
      }
      @keyframes pcKeyGlow {
        0%, 100% { filter: drop-shadow(0 0 6px rgba(20,184,166,0.4)); opacity: 0.9; }
        50%       { filter: drop-shadow(0 0 20px rgba(20,184,166,0.9)) drop-shadow(0 0 36px rgba(94,234,212,0.4)); opacity: 1; }
      }
      .pc-title-main {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 28%,
          #5eead4 43%, #14b8a6 52%, #2dd4bf 60%,
          #ffffff 75%, #ffffff 100%
        );
        background-size: 330% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: pcTitleWave 7s linear infinite;
      }
      .pc-title-key {
        -webkit-text-fill-color: #2dd4bf; color: #2dd4bf;
        animation: pcKeyGlow 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const tab = TABS.find(t => t.id === activeTab) || TABS[1];
  const sleepProgress = C1_CHECKLIST.filter((_, i) => sleepChecks[i]).length;
  const neatProgress = [0, 1, 2, 3].filter(i => neatChecks[i]).length;

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (tabBarRef.current) {
      const idx = TABS.findIndex(t => t.id === id);
      const btn = tabBarRef.current.children[idx];
      if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-muted text-lg mb-8 hover:text-teal-400 transition-colors">
        ← Sống Khỏe 360
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: `rgba(${TEAL_RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl flex items-center justify-center shrink-0 animate-float"
          style={{ background: 'var(--color-surface)', border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
          🌿
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
            {pillar?.title || 'Lối Sống Khỏe'}
          </h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full"
            style={{ color: TEAL, background: `rgba(${TEAL_RGB},0.1)`, border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
            {pillar?.subtitle || 'Lifestyle'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {pillar?.description || 'Ngủ tốt hơn, sống có nhịp hơn, phục hồi tốt hơn.'}
          </p>
        </div>
      </div>

      {/* Hero stats with tooltips */}
      <RevealBlock className="flex flex-wrap gap-6 mb-10">
        {[
          { v: '7–9h', l: 'Ngủ mỗi đêm', tip: 'Người lớn cần 7–9 giờ ngủ để phục hồi tối ưu. Ngủ kém làm giảm hiệu quả tập luyện và kiểm soát ăn uống.' },
          { v: '300+', l: 'kcal NEAT/ngày', tip: 'NEAT (Non-Exercise Activity Thermogenesis) có thể đốt 300–500 kcal/ngày mà không cần tập gym.' },
          { v: '8 module', l: 'Lối sống C0–C7', tip: '8 module từ đánh giá ban đầu đến thiết kế môi trường, bao phủ toàn bộ nhịp sống 24h.' },
          { v: '1%', l: 'Cải thiện mỗi ngày', tip: 'Triết lý cốt lõi: không cần hoàn hảo ngay. Sửa 1% mỗi ngày đúng chỗ tạo nên sự thay đổi bền vững.' },
        ].map((s, i) => (
          <div key={i} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
              opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100
              -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={`hero-c3-${i}`} color={TEAL} />
            </div>
            <div className="text-center px-4 py-2 rounded-xl cursor-default"
              style={{ background: `rgba(${TEAL_RGB},0.06)`, border: `1px solid rgba(${TEAL_RGB},0.15)` }}>
              <div className="text-3xl font-bold" style={{ color: TEAL }}>{s.v}</div>
              <div className="text-base text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </RevealBlock>

      {/* Hero image */}
      <RevealBlock className="mb-12">
        <div className="pc3-orbit-ring rounded-3xl p-[1.5px]">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop"
              alt="Lối sống khỏe" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)' }} />
            <div className="absolute bottom-4 left-6">
              <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: TEAL, background: 'rgba(10,10,10,0.6)', border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
                {pillar?.image_caption || 'Ngủ · Nhịp sống · Phục hồi'}
              </span>
            </div>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Tab bar — browser chrome style */}
      <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 pt-3 mb-8"
        style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(14px)' }}>
        <div ref={tabBarRef} className="relative flex items-end overflow-x-auto scrollbar-hide"
          style={{ borderBottom: '1.5px solid rgba(255,255,255,0.09)' }}>
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => handleTabClick(t.id)}
                className="flex items-center gap-2 shrink-0 font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                style={active ? {
                  color: t.color,
                  padding: '9px 16px 11px',
                  background: '#111213',
                  borderTop: `2px solid ${t.color}`,
                  borderLeft: '1px solid rgba(255,255,255,0.09)',
                  borderRight: '1px solid rgba(255,255,255,0.09)',
                  borderBottom: '1.5px solid #111213',
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '-1.5px',
                  boxShadow: `0 -4px 16px rgba(${t.rgb},0.14), inset 0 1px 0 rgba(${t.rgb},0.08)`,
                } : {
                  color: 'rgba(130,130,148,0.72)',
                  padding: '7px 14px 12px',
                  background: 'transparent',
                  border: '1px solid transparent',
                  borderRadius: '8px 8px 0 0',
                }}>
                <span className="text-lg">{t.icon}</span>
                <span className="text-lg">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panels */}
      <div className="mb-12">
        {/* C0 — Đánh Giá */}
        {activeTab === 'c0' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: TEAL }}>Đánh Giá Lối Sống Ban Đầu</h2>
                <p className="text-muted text-lg mb-6">Biết điểm xuất phát trước khi thay đổi. Không đánh giá để phán xét — đánh giá để chọn điểm bắt đầu đúng nhất.</p>
                <div className="grid gap-3 mb-6">
                  {C0_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setC0Idx(i)}
                      onKeyDown={e => e.key === 'Enter' && setC0Idx(i)}
                      className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5"
                      style={{ background: `rgba(${item.rgb},0.05)`, border: `1px solid rgba(${item.rgb},0.15)` }}
                    >
                      <span className="text-3xl shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text text-lg">{item.label}</div>
                        <div className="text-muted text-base mt-0.5">{item.desc}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: item.color }}>
                        Chi tiết
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: TEAL }}>Lifestyle Score — 100 điểm</h3>
                <div className="space-y-2 mb-6">
                  {C0_SCORE.map((row, i) => (
                    <div key={i} className="flex items-center justify-between text-lg">
                      <span className="text-muted">{row.label}</span>
                      <span className="font-bold tabular-nums" style={{ color: TEAL }}>{row.pts} đ</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.08)`, border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
                  <p className="text-lg font-semibold mb-3" style={{ color: TEAL }}>Chọn track phù hợp với bạn:</p>
                  <div className="grid gap-2">
                    {[
                      { t: 'Track Cơ Bản', d: 'Ngủ muộn, mệt mỏi, ít vận động' },
                      { t: 'Track Bận Rộn', d: 'Thiếu thời gian, làm việc nhiều, ngồi lâu' },
                      { t: 'Track Tập Nhiều', d: 'Gym/chạy/đạp/bơi nhiều, cần phục hồi tốt hơn' },
                    ].map((tr, i) => (
                      <div key={i} className="p-2 rounded-lg text-lg" style={{ background: `rgba(${TEAL_RGB},0.05)` }}>
                        <span className="font-semibold text-text">{tr.t}</span>
                        <span className="text-muted"> — {tr.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link to="/pillar/c/assessment" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: TEAL }}>
              Xem đánh giá đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C1 — Giấc Ngủ */}
        {activeTab === 'c1' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: TEAL }}>Vệ Sinh Giấc Ngủ 4 Bước</h2>
                <p className="text-muted text-lg mb-6">Ngủ không phải là "thời gian chết". Ngủ là lúc cơ thể sửa chữa cơ bắp, cân bằng hormone và phục hồi tâm lý.</p>
                <div className="grid gap-3 mb-8">
                  {C1_STEPS.map((s) => (
                    <div key={s.step} className="flex gap-4 p-4 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.05)`, border: `1px solid rgba(${TEAL_RGB},0.1)` }}>
                      <span className="text-3xl shrink-0">{s.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-lg">Bước {s.step}: {s.title}</div>
                        <div className="text-muted text-base mt-1 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: TEAL }}>Checklist Ngủ Hằng Ngày</h3>
                <div className="space-y-2 mb-4">
                  {C1_CHECKLIST.map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => setSleepChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                        style={{ background: sleepChecks[i] ? TEAL : 'transparent', borderColor: TEAL }}>
                        {sleepChecks[i] && <span className="text-black text-base font-bold">✓</span>}
                      </div>
                      <span className="text-lg text-muted group-hover:text-text transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: `rgba(${TEAL_RGB},0.15)` }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sleepProgress / C1_CHECKLIST.length * 100}%`, background: TEAL }} />
                </div>
                <p className="text-base text-muted">{sleepProgress}/{C1_CHECKLIST.length} — {sleepProgress >= 4 ? 'Tốt lắm!' : sleepProgress >= 3 ? 'Đạt mức tốt' : 'Đang xây dựng thói quen'}</p>
              </div>
            </div>
            <Link to="/pillar/c/sleep" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: TEAL }}>
              Xem khoa học giấc ngủ đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C2 — Nhịp Sinh Học */}
        {activeTab === 'c2' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#06b6d4' }}>Nhịp Sinh Học & Năng Lượng</h2>
                <p className="text-muted text-lg mb-6">Năng lượng không chỉ đến từ cà phê. Năng lượng đến từ ánh sáng, nước, vận động nhẹ, bữa ăn và nhịp làm việc đúng.</p>
                <div className="flex gap-2 mb-5">
                  {['5', '10'].map(m => (
                    <button key={m} onClick={() => setMorningMode(m)}
                      className="px-3 py-1.5 rounded-lg text-lg font-semibold transition-all"
                      style={morningMode === m
                        ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }
                        : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      Routine sáng {m} phút
                    </button>
                  ))}
                </div>
                <div className="space-y-2 mb-7">
                  {(morningMode === '5' ? C2_MORNING_5 : C2_MORNING_10).map((row, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)' }}>
                      <span className="text-base font-bold tabular-nums w-12 shrink-0" style={{ color: '#06b6d4' }}>{row.time}</span>
                      <span className="text-lg text-text">{row.action}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#06b6d4' }}>5 Yếu Tố Tạo Năng Lượng</h3>
                <div className="grid gap-2">
                  {C2_ENERGY_TIPS.map((t, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.04)' }}>
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-lg">{t.title}</div>
                        <div className="text-muted text-base mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/circadian" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#06b6d4' }}>
              Xem nhịp sinh học đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C3 — NEAT */}
        {activeTab === 'c3' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#10b981' }}>NEAT & Chống Ngồi Lâu</h2>
                <p className="text-muted text-lg mb-6">NEAT là toàn bộ vận động ngoài buổi tập: đi bộ, đứng lên, làm việc nhà. Với người bận rộn, NEAT quan trọng không kém buổi tập gym.</p>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#10b981' }}>Mục tiêu bước theo cấp độ</h3>
                <div className="grid gap-2 mb-6">
                  {C3_LEVELS.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                      <span className="text-lg font-semibold text-text">{l.level}</span>
                      <span className="text-lg font-bold tabular-nums" style={{ color: '#10b981' }}>{l.steps}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p className="text-lg font-bold mb-1" style={{ color: '#10b981' }}>⏱ Quy tắc đứng dậy 2 phút</p>
                  <p className="text-base text-muted">Mỗi 45–60 phút ngồi, đứng dậy 2 phút. Đi lấy nước, xoay vai, vươn người, calf raise. <strong>Đừng đợi đau mới đứng dậy.</strong></p>
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#10b981' }}>NEAT Checklist</h3>
                <div className="space-y-2 mb-4">
                  {['Đứng dậy sau mỗi 45–60 phút ngồi', 'Đi bộ sau ít nhất 1 bữa ăn', 'Đạt mục tiêu bước cá nhân', 'Có 1–2 lần vận động ngắn trong giờ làm'].map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div onClick={() => setNeatChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all border"
                        style={{ background: neatChecks[i] ? '#10b981' : 'transparent', borderColor: '#10b981' }}>
                        {neatChecks[i] && <span className="text-black text-base font-bold">✓</span>}
                      </div>
                      <span className="text-lg text-muted group-hover:text-text transition-colors">{item}</span>
                    </label>
                  ))}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${neatProgress / 4 * 100}%`, background: '#10b981' }} />
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#10b981' }}>Ý tưởng tăng NEAT</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {C3_IDEAS.map((idea, i) => (
                    <div key={i} className="flex items-center gap-2 text-base text-muted p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.04)' }}>
                      <span style={{ color: '#10b981' }}>→</span>{idea}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/neat" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#10b981' }}>
              Xem hướng dẫn NEAT đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C4 — Phục Hồi */}
        {activeTab === 'c4' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#a78bfa' }}>Phục Hồi Chủ Động</h2>
                <p className="text-muted text-lg mb-6">Ngày phục hồi là một phần của chương trình, không phải ngày thất bại. Phục hồi bằng hành động nhẹ, không chỉ nằm nghỉ.</p>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#a78bfa' }}>Routine Phục Hồi 10 Phút</h3>
                <div className="space-y-2 mb-6">
                  {C4_ROUTINE.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)' }}>
                      <span className="text-base font-bold tabular-nums w-20 shrink-0" style={{ color: '#a78bfa' }}>{r.duration}</span>
                      <div>
                        <div className="text-lg font-semibold text-text">{r.exercise}</div>
                        <div className="text-base text-muted">{r.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#a78bfa' }}>Phục Hồi Theo Vùng Đau Mỏi</h3>
                <div className="space-y-2">
                  {C4_ZONES.map((z, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(167,139,250,0.15)' }}>
                      <button onClick={() => setOpenZone(openZone === i ? null : i)}
                        className="w-full flex items-center justify-between p-3 text-left" style={{ background: 'rgba(167,139,250,0.06)' }}>
                        <span className="flex items-center gap-2 font-semibold text-lg text-text">
                          <span>{z.icon}</span>{z.zone}
                        </span>
                        <span style={{ color: '#a78bfa' }}>{openZone === i ? '▲' : '▼'}</span>
                      </button>
                      {openZone === i && (
                        <div className="p-3 space-y-1">
                          {z.exercises.map((ex, j) => (
                            <div key={j} className="text-base text-muted flex items-center gap-2">
                              <span style={{ color: '#a78bfa' }}>•</span>{ex}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/recovery" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#a78bfa' }}>
              Xem phục hồi chủ động đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C5 — Deload */}
        {activeTab === 'c5' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#f97316' }}>Deload & Quản Lý Tải</h2>
                <p className="text-muted text-lg mb-6">Deload là giảm tải có kế hoạch. Không phải lùi bước — mà là chiến lược để đi xa hơn về lâu dài.</p>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <p className="text-lg font-bold mb-2" style={{ color: '#f97316' }}>🚨 Dấu hiệu cần deload</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {C5_SIGNALS.map((s, i) => (
                      <div key={i} className="text-base text-muted flex items-center gap-2">
                        <span style={{ color: '#f97316' }}>!</span>{s}
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#f97316' }}>4 Cách Deload</h3>
                <div className="grid gap-3 mb-6">
                  {C5_METHODS.map((m, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)' }}>
                      <span className="text-3xl shrink-0">{m.icon}</span>
                      <div>
                        <div className="font-semibold text-text text-lg">{m.title}</div>
                        <div className="text-muted text-base mt-0.5">{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#f97316' }}>Lịch Deload Theo Trình Độ</h3>
                <div className="space-y-2">
                  {[
                    { level: 'Người mới', freq: 'Mỗi 6–8 tuần hoặc khi có dấu hiệu mệt' },
                    { level: 'Trung bình', freq: 'Mỗi 4–6 tuần, giảm 10–20% volume' },
                    { level: 'Tập nhiều', freq: 'Mỗi 4–5 tuần, giảm 30–40% volume' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-lg p-2 rounded-lg" style={{ background: 'rgba(249,115,22,0.04)' }}>
                      <span className="font-semibold text-text">{row.level}</span>
                      <span className="text-muted text-base text-right">{row.freq}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/deload" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#f97316' }}>
              Xem hướng dẫn deload đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C6 — Thở */}
        {activeTab === 'c6' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#0ea5e9' }}>Thở & Hạ Nhịp Cơ Thể</h2>
                <p className="text-muted text-lg mb-6">Thở đúng cách là công cụ điều hòa cơ thể, hỗ trợ phục hồi sau tập và giúp ngủ sâu hơn.</p>
                <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
                  {C6_TECHNIQUES.map((t, i) => (
                    <button key={i} onClick={() => setBreathMode(i)}
                      className="px-3 py-1.5 rounded-lg text-lg font-semibold shrink-0 transition-all"
                      style={breathMode === i
                        ? { background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }
                        : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      {t.name}
                    </button>
                  ))}
                </div>
                {C6_TECHNIQUES[breathMode] && (
                  <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                    <h3 className="font-bold text-text mb-3">{C6_TECHNIQUES[breathMode].name}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {C6_TECHNIQUES[breathMode].steps.split(' • ').map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-lg">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                            style={{ background: '#0ea5e9', color: 'black' }}>{i + 1}</span>
                          <span className="text-text">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 text-base text-muted mt-3 flex-wrap">
                      <span>⏱ {C6_TECHNIQUES[breathMode].time}</span>
                      <span>• {C6_TECHNIQUES[breathMode].use}</span>
                    </div>
                  </div>
                )}
                <h3 className="font-bold text-lg mb-3" style={{ color: '#0ea5e9' }}>Protocol theo tình huống</h3>
                <div className="space-y-2">
                  {[
                    ['Trước tập', '4–6 nhịp thở cơ hoành'],
                    ['Sau tập', 'Hít 4 giây, thở 6 giây × 6–8 vòng'],
                    ['Trước ngủ', 'Thở cơ hoành 3 phút'],
                    ['Căng thẳng giữa ngày', 'Box breathing 4 vòng'],
                    ['Khó ngủ', 'Thở ra dài hơn hít vào × 8–10 vòng'],
                  ].map(([s, b], i) => (
                    <div key={i} className="flex justify-between items-center text-lg py-2 border-b" style={{ borderColor: 'rgba(14,165,233,0.08)' }}>
                      <span className="text-muted">{s}</span>
                      <span className="font-semibold text-base text-right" style={{ color: '#0ea5e9' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/pillar/c/breathing" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#0ea5e9' }}>
              Xem kỹ thuật thở đầy đủ →
            </Link>
          </RevealBlock>
        )}

        {/* C7 — Môi Trường */}
        {activeTab === 'c7' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#f43f5e' }}>Thiết Kế Môi Trường & Thói Quen</h2>
                <p className="text-muted text-lg mb-6">Đừng chỉ dựa vào ý chí. Hãy thiết kế môi trường để hành vi tốt xảy ra dễ hơn, tự nhiên hơn mỗi ngày.</p>
                <div className="space-y-4 mb-6">
                  {C7_AREAS.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.1)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{a.icon}</span>
                        <span className="font-bold text-lg" style={{ color: '#f43f5e' }}>{a.area}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {a.tips.map((tip, j) => (
                          <li key={j} className="text-base text-muted flex items-center gap-2">
                            <span style={{ color: '#f43f5e' }}>→</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
                  <p className="text-lg font-bold mb-2" style={{ color: '#f43f5e' }}>Quy tắc "Ngày Fail"</p>
                  <p className="text-base text-muted leading-relaxed">Khi lỡ một ngày: không tự trách, không bỏ luôn. Quay lại bằng hành động nhỏ nhất: uống nước, đi bộ 5 phút, ngủ sớm hơn 15 phút.</p>
                  <p className="text-base font-semibold mt-2" style={{ color: '#f43f5e' }}>Một ngày lệch nhịp không phá hỏng hành trình.</p>
                </div>
              </div>
            </div>
            <Link to="/pillar/c/environment" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: '#f43f5e' }}>
              Xem thiết kế môi trường đầy đủ →
            </Link>
          </RevealBlock>
        )}
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Sub-pages Teaser Grid */}
      <RevealBlock className="mb-6">
        <h2 className="text-3xl font-bold text-text mb-1">Khám Phá Sâu</h2>
        <p className="text-muted text-lg">12 chủ đề chuyên sâu về lối sống khỏe — từ khoa học giấc ngủ đến thiết kế môi trường sống.</p>
      </RevealBlock>

      <TeaserSection title="Nền Tảng & Giấc Ngủ">
        <TeaserCard
          to="/pillar/c/assessment" color={TEAL} rgb={TEAL_RGB}
          icon="📋" category="Đánh Giá" title="Đánh Giá Lối Sống Ban Đầu"
          accent="Lifestyle Score · 3 Track" desc="Biết điểm xuất phát trước khi thay đổi. Tự đánh giá 5 lĩnh vực: giấc ngủ, năng lượng, vận động, phục hồi và thói quen tối."
          features={['Lifestyle Score 100 điểm', 'Chọn Track phù hợp', 'Baseline Form 7 ngày']}
          stats={[{v:'5',l:'Lĩnh vực'},{v:'3',l:'Track'}]}
          image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70"
          imageAlt="Đánh giá lối sống" cta="Đánh giá ngay →" />
        <TeaserCard
          to="/pillar/c/sleep" color={TEAL} rgb={TEAL_RGB}
          icon="😴" category="Giấc Ngủ" title="Khoa Học Giấc Ngủ"
          accent="C1 · Vệ sinh giấc ngủ · 4 bước" desc="Module quan trọng nhất của Trụ cột C. Hiểu đúng về giấc ngủ và xây nền phục hồi vững chắc cho cơ thể."
          features={['4 bước vệ sinh giấc ngủ', 'Xử lý 3 tình huống thường gặp', 'Checklist 5 mục hằng ngày']}
          stats={[{v:'7–9h',l:'Giờ ngủ'},{v:'4',l:'Bước'}]}
          image="https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=600&q=70"
          imageAlt="Giấc ngủ" cta="Ngủ tốt hơn →" />
        <TeaserCard
          to="/pillar/c/sleep-routine" color={TEAL} rgb={TEAL_RGB}
          icon="🌙" category="Giấc Ngủ" title="Routine Trước Ngủ 30–60 Phút"
          accent="C1 · Chuẩn bị ngủ · Reset 7 ngày" desc="Xây dựng routine chuyển cơ thể từ chế độ làm việc sang phục hồi. Phiên bản 10 và 60 phút phù hợp mọi lịch trình."
          features={['Routine 60 phút đầy đủ', 'Routine 10 phút rút gọn', 'Sửa ngủ muộn trong 7 ngày']}
          stats={[{v:'10–60',l:'Phút'},{v:'7',l:'Ngày reset'}]}
          image="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=70"
          imageAlt="Routine ngủ" cta="Xây routine →" />
        <TeaserCard
          to="/pillar/c/circadian" color="#06b6d4" rgb="6,182,212"
          icon="☀️" category="Nhịp Sinh Học" title="Nhịp Sinh Học & Năng Lượng"
          accent="C2 · Tạo năng lượng ổn định" desc="Hiểu nhịp sinh học để tối ưu năng lượng 24h. Buổi sáng bật cơ thể lên đúng cách, buổi tối hạ xuống nhẹ nhàng."
          features={['Bản đồ năng lượng 7 ngày', 'Quy tắc ánh sáng sáng/tối', 'Caffeine thông minh']}
          stats={[{v:'5',l:'Yếu tố'},{v:'24h',l:'Chu kỳ'}]}
          image="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&q=70"
          imageAlt="Nhịp sinh học" cta="Tối ưu năng lượng →" />
      </TeaserSection>

      <TeaserSection title="Vận Động & Phục Hồi">
        <TeaserCard
          to="/pillar/c/morning" color="#06b6d4" rgb="6,182,212"
          icon="🌅" category="Routine Sáng" title="Routine Buổi Sáng"
          accent="C2 · 5 / 10 / 20 phút" desc="Bắt đầu ngày đúng cách để có năng lượng suốt ngày. 3 phiên bản phù hợp mọi lịch trình từ bận rộn đến rảnh rang."
          features={['Routine sáng 5 phút cơ bản', 'Routine 10 phút đầy đủ', 'Routine 20 phút nâng cao']}
          stats={[{v:'3',l:'Phiên bản'},{v:'5+',l:'Phút'}]}
          image="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=70"
          imageAlt="Routine sáng" cta="Bắt đầu ngày →" />
        <TeaserCard
          to="/pillar/c/neat" color="#10b981" rgb="16,185,129"
          icon="🚶" category="NEAT" title="NEAT & Chống Ngồi Lâu"
          accent="C3 · Vận động trong đời sống" desc="Tăng hoạt động không cần buổi tập gym. Với người bận rộn, NEAT có thể quan trọng không kém gym."
          features={['Mục tiêu bước theo cấp độ', 'Quy tắc đứng dậy 2 phút', 'NEAT cho dân văn phòng']}
          stats={[{v:'300+',l:'kcal NEAT'},{v:'2',l:'Phút mỗi giờ'}]}
          image="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=70"
          imageAlt="NEAT đi bộ" cta="Tăng NEAT →" />
        <TeaserCard
          to="/pillar/c/recovery" color="#a78bfa" rgb="167,139,250"
          icon="🔄" category="Phục Hồi" title="Phục Hồi Chủ Động"
          accent="C4 · Active recovery" desc="Phục hồi không chỉ là nằm nghỉ. Học cách phục hồi bằng hành động nhẹ: mobility, giãn cơ, thở, foam rolling."
          features={['Routine phục hồi 10 phút', 'Phục hồi theo vùng đau mỏi', 'Active recovery theo mục tiêu']}
          stats={[{v:'10',l:'Phút'},{v:'3',l:'Vùng cơ thể'}]}
          image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70"
          imageAlt="Phục hồi" cta="Phục hồi tốt hơn →" />
        <TeaserCard
          to="/pillar/c/deload" color="#f97316" rgb="249,115,22"
          icon="⚡" category="Deload" title="Deload & Quản Lý Tải"
          accent="C5 · Giảm tải có kế hoạch" desc="Người khỏe biết lúc nào nên đẩy, lúc nào nên giữ, lúc nào nên lùi một bước để đi xa hơn."
          features={['7 dấu hiệu cần deload', '4 cách thực hiện deload', 'Lịch deload theo trình độ']}
          stats={[{v:'4–6',l:'Tuần/lần'},{v:'4',l:'Cách deload'}]}
          image="https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=600&q=70"
          imageAlt="Deload" cta="Deload đúng cách →" />
      </TeaserSection>

      <TeaserSection title="Kỹ Năng & Công Cụ">
        <TeaserCard
          to="/pillar/c/breathing" color="#0ea5e9" rgb="14,165,233"
          icon="🌬️" category="Thở" title="Kỹ Thuật Thở & Hạ Nhịp"
          accent="C6 · 3 kỹ thuật cốt lõi" desc="Thở đúng cách điều hòa hệ thần kinh, hỗ trợ phục hồi và cải thiện chất lượng giấc ngủ."
          features={['Thở cơ hoành', 'Box breathing', 'Protocol theo 5 tình huống']}
          stats={[{v:'3',l:'Kỹ thuật'},{v:'1–3',l:'Phút'}]}
          image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=70"
          imageAlt="Thở" cta="Thở đúng cách →" />
        <TeaserCard
          to="/pillar/c/environment" color="#f43f5e" rgb="244,63,94"
          icon="🏠" category="Môi Trường" title="Thiết Kế Môi Trường Sống"
          accent="C7 · Giảm phụ thuộc ý chí" desc="Muốn thay đổi hành vi bền vững, hãy thiết kế lại môi trường. Không cần ý chí mạnh, chỉ cần môi trường đúng."
          features={['Môi trường buổi sáng', 'Môi trường làm việc', 'Môi trường buổi tối']}
          stats={[{v:'3',l:'Không gian'},{v:'15+',l:'Gợi ý'}]}
          image="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=70"
          imageAlt="Môi trường sống" cta="Thiết kế ngay →" />
        <TeaserCard
          to="/pillar/c/checklist" color={TEAL} rgb={TEAL_RGB}
          icon="✅" category="Theo Dõi" title="Checklist & Theo Dõi Lối Sống"
          accent="C8 · Daily + Weekly tracking" desc="Theo dõi đủ để nhận xu hướng, không quá nhiều để trở thành áp lực. Daily checklist 7 mục và weekly review."
          features={['Daily Lifestyle Checklist 7 mục', 'Weekly review 5 câu hỏi', 'Red flags an toàn']}
          stats={[{v:'7',l:'Mục/ngày'},{v:'5',l:'Câu/tuần'}]}
          image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=70"
          imageAlt="Checklist" cta="Bắt đầu theo dõi →" />
        <TeaserCard
          to="/pillar/c/roadmap" color={TEAL} rgb={TEAL_RGB}
          icon="🗺️" category="Lộ Trình" title="Lộ Trình 12 Tuần Lối Sống"
          accent="Tuần 1–12 · 3 giai đoạn" desc="Từ nhận diện nhịp sống đến cá nhân hóa hoàn toàn. 12 tuần xây dựng lối sống khỏe bền vững từng bước."
          features={['Tuần 1–2: Nhận diện nhịp sống', 'Tuần 3–6: Xây routine cơ bản', 'Tuần 7–12: Cá nhân hóa']}
          stats={[{v:'12',l:'Tuần'},{v:'3',l:'Giai đoạn'}]}
          image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70"
          imageAlt="Lộ trình" cta="Xem lộ trình →" />
      </TeaserSection>

      {/* Core message */}
      <RevealBlock className="mt-4 mb-12">
        <div className="rounded-2xl p-6 text-center" style={{ background: `rgba(${TEAL_RGB},0.06)`, border: `1px solid rgba(${TEAL_RGB},0.15)` }}>
          <div className="text-4xl mb-3">🌿</div>
          <blockquote className="text-xl font-bold text-text leading-relaxed mb-2">
            "Không cần sống hoàn hảo. Chỉ cần sống có nhịp, có hồi phục, có quay lại."
          </blockquote>
          <p className="text-muted text-lg">— Triết lý Trụ cột C</p>
        </div>
      </RevealBlock>

      <div className="pt-6 border-t border-border">
        <Link to="/pillars" className="text-muted hover:text-teal-400 transition-colors text-lg">← Sống Khỏe 360</Link>
      </div>

      {/* ── C0 item modal — outside all RevealBlocks so position:fixed works ── */}
      {c0Idx !== null && (
        <C0ItemModal
          item={C0_ITEMS[c0Idx]}
          idx={c0Idx}
          onClose={() => setC0Idx(null)}
          onPrev={() => setC0Idx(i => Math.max(0, i - 1))}
          onNext={() => setC0Idx(i => Math.min(C0_ITEMS.length - 1, i + 1))}
          hasPrev={c0Idx > 0}
          hasNext={c0Idx < C0_ITEMS.length - 1}
        />
      )}
    </div>
  );
}
