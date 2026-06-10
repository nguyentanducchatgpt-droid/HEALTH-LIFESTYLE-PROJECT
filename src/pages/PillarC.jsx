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
  {
    step: '1', icon: '🕙',
    title: 'Cố định khung giờ ngủ – thức',
    desc: 'Không cần tuyệt đối chính xác, nhưng nên giữ lệch không quá 60 phút giữa các ngày, kể cả cuối tuần.',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngủ và thức đúng giờ mỗi ngày quan trọng hơn tổng số giờ ngủ — nhất quán là yếu tố số 1 để có giấc ngủ sâu.',
    detail: 'Đồng hồ sinh học (circadian rhythm) được thiết lập chủ yếu bởi giờ thức dậy, không phải giờ đi ngủ. Cố định giờ thức là chìa khóa để điều chỉnh toàn bộ chu kỳ ngủ.',
    details: [
      'Não dùng giờ thức dậy như "điểm neo" để tính ngược lại giờ buồn ngủ tự nhiên — vì vậy thức đúng giờ quan trọng hơn ngủ đúng giờ.',
      '"Social jet lag" — ngủ muộn/dậy muộn cuối tuần — tạo ra hiệu ứng tương đương đổi múi giờ 2–3 tiếng mỗi tuần cho cơ thể.',
      'Sau 3–4 tuần giữ giờ thức nhất quán, cảm giác buồn ngủ vào buổi tối sẽ xuất hiện đúng giờ một cách tự nhiên mà không cần cố.',
      'Không cần ép ngủ sớm ngay — chỉ cần giữ giờ THỨC cố định trước. Giờ ngủ sẽ tự điều chỉnh sau 1–2 tuần.',
      'Nếu bị thức khuya bất đắc dĩ, vẫn dậy đúng giờ hôm sau thay vì ngủ bù — ngủ bù phá vỡ việc đồng hồ sinh học đang hình thành.',
      'Ánh sáng mạnh trong 30 phút đầu sau khi thức (ra ngoài hoặc mở rèm) giúp "chốt" giờ thức vào đồng hồ sinh học nhanh hơn nhiều.',
    ],
    points: [
      { icon: '⏰', label: 'Giờ thức cố định', note: 'Quan trọng hơn giờ đi ngủ' },
      { icon: '📅', label: 'Kể cả cuối tuần', note: 'Lệch ≤60 phút là chấp nhận được' },
      { icon: '☀️', label: 'Ánh sáng sau thức', note: '30 phút đầu ra ngoài hoặc mở rèm' },
      { icon: '🗓️', label: '3–4 tuần hình thành', note: 'Sau đó buồn ngủ đúng giờ tự nhiên' },
    ],
  },
  {
    step: '2', icon: '💡',
    title: 'Giảm ánh sáng mạnh buổi tối',
    desc: 'Tắt bớt đèn, giảm màn hình từ 21–22h. Ánh sáng mạnh ban đêm ức chế melatonin tự nhiên.',
    color: '#06b6d4', rgb: '6,182,212',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 10–15 phút tiếp xúc ánh sáng xanh sáng vào buổi tối đủ để ức chế melatonin 50% trong 2–3 giờ tiếp theo — theo nghiên cứu của Harvard.',
    detail: 'Melatonin — hormone báo hiệu "đêm đến" — bắt đầu tiết khoảng 2 giờ trước giờ ngủ tự nhiên của bạn. Ánh sáng xanh từ màn hình là kẻ thù số 1 của quá trình này.',
    details: [
      'Màn hình điện thoại, máy tính, TV phát ánh sáng xanh (450–490nm) — loại ánh sáng não "hiểu" là ban ngày và chặn tiết melatonin.',
      'Kính lọc ánh sáng xanh hoặc chế độ "Night Mode / Night Shift" giảm khoảng 20–30% ánh sáng xanh — hữu ích nhưng không loại bỏ hoàn toàn.',
      'Tắt bớt đèn nhà từ 21h, chuyển sang đèn ngủ vàng ấm (<3000K) gửi tín hiệu "đêm đến" cho não hiệu quả hơn nhiều so với app lọc màu.',
      'Đọc sách giấy thay màn hình 30 phút trước ngủ giảm thời gian chìm vào giấc ngủ trung bình 12 phút và cải thiện chất lượng ngủ.',
      'Đeo kính chặn ánh sáng xanh (amber lens) từ 20h là giải pháp hiệu quả nhất nếu bạn cần dùng màn hình muộn vì công việc.',
      'Ánh sáng môi trường (đèn nhà sáng) ảnh hưởng nhiều hơn ánh sáng màn hình nhỏ — ưu tiên làm tối phòng trước khi lo về Night Mode.',
    ],
    points: [
      { icon: '🌑', label: 'Tắt đèn từ 21h', note: 'Chuyển đèn vàng ấm <3000K' },
      { icon: '📵', label: 'Không màn hình 22h+', note: 'Hoặc dùng kính chặn ánh xanh' },
      { icon: '📚', label: 'Đọc sách giấy', note: 'Thay màn hình 30 phút trước ngủ' },
      { icon: '⚙️', label: 'Night Mode', note: 'Bật từ 19–20h không chờ đến muộn' },
    ],
  },
  {
    step: '3', icon: '☕',
    title: 'Giảm kích thích cơ thể',
    desc: 'Tránh caffeine sau 14–15h, tránh tập quá nặng sát giờ ngủ, tránh làm việc căng ngay trước ngủ.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Caffeine có half-life 5–6 giờ: ly cà phê lúc 15h vẫn còn 50% hoạt chất trong máu lúc 21h — đủ để phá vỡ chất lượng ngủ sâu dù bạn vẫn ngủ được.',
    detail: 'Kích thích thần kinh và hormone từ caffeine, tập nặng, hay công việc căng thẳng tạo ra môi trường sinh lý ngược lại với những gì cơ thể cần để đi vào giấc ngủ sâu.',
    details: [
      'Caffeine hoạt động bằng cách chặn adenosine (chất tích lũy gây buồn ngủ) — khi caffeine tan hết, adenosine "đổ ập" trở lại gây mệt đột ngột.',
      'Người "nhạy cảm" với caffeine: thức uống chứa caffeine sau 12h đã đủ ảnh hưởng đến giấc ngủ — đây là gen di truyền, không phải ý chí yếu.',
      'Tập thể lực nặng trong vòng 2–3 giờ trước ngủ tăng cortisol và thân nhiệt cơ thể — cả hai đều làm khó ngủ. Tập nhẹ (đi bộ, yoga) thì ổn.',
      'Làm việc căng thẳng trước ngủ kích hoạt "problem-solving mode" của não — hệ thần kinh giao cảm vẫn kích hoạt dù bạn đã tắt máy.',
      '"Wind-down" 30–60 phút: tắt email/công việc, làm việc nhẹ không đòi hỏi quyết định. Não cần thời gian chuyển từ "chiến đấu" sang "nghỉ ngơi".',
      'Rượu bia giúp ngủ nhanh hơn nhưng phá vỡ giai đoạn REM (giấc ngủ mơ) và deep sleep trong nửa sau đêm — chất lượng tổng thể tệ hơn.',
    ],
    points: [
      { icon: '☕', label: 'Cắt caffeine sau 14–15h', note: 'Half-life 5–6 giờ còn trong máu' },
      { icon: '🏋️', label: 'Tập nhẹ trước ngủ', note: 'Đi bộ/yoga OK, tập nặng thì không' },
      { icon: '💼', label: 'Dừng công việc 21h', note: 'Wind-down 30–60 phút trước ngủ' },
      { icon: '🍺', label: 'Hạn chế rượu bia tối', note: 'Phá REM dù giúp ngủ nhanh hơn' },
    ],
  },
  {
    step: '4', icon: '🛏️',
    title: 'Tối ưu phòng ngủ',
    desc: 'Phòng tối, mát (~18–21°C), yên tĩnh. Giường dùng chủ yếu để ngủ, không làm việc hay xem video trên giường.',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhiệt độ phòng 18–21°C là điều kiện lý tưởng để đạt deep sleep — thân nhiệt cơ thể cần giảm 1–2°C để chìm vào giấc ngủ sâu.',
    detail: 'Phòng ngủ là môi trường kích hoạt hành vi ngủ. Khi não liên kết giường với công việc, màn hình hay stress, nó ngừng nhận "giường = ngủ" như một tín hiệu.',
    details: [
      'Nhiệt độ lạnh hơn bình thường giúp ngủ sâu vì não và cơ thể cần giảm nhiệt để bước vào giai đoạn ngủ sâu (NREM stage 3).',
      'Bóng tối hoàn toàn (hoặc gần hoàn toàn) quan trọng hơn nhiều người nghĩ: ánh đèn đường qua rèm mỏng đủ để giảm chất lượng ngủ.',
      '"Stimulus control": giường chỉ dùng để ngủ và quan hệ — không làm việc, không xem phim, không cuộn mạng xã hội trên giường.',
      'Tiếng ồn ngắt quãng (xe cộ, tiếng nói) phá vỡ giấc ngủ nhiều hơn tiếng ồn nền liên tục — white noise / fan nhẹ có thể giúp "che" tiếng ồn ngắt quãng.',
      'Nệm và gối ảnh hưởng đến tư thế ngủ và đau nhức sau ngủ — đây là đầu tư đáng tiền nhất trong phòng ngủ nếu bạn thức dậy bị đau.',
      'Dọn dẹp phòng ngủ gọn gàng giảm "visual noise" — nghiên cứu cho thấy phòng bừa bộn liên quan đến khó ngủ và ngủ không sâu.',
    ],
    points: [
      { icon: '❄️', label: '18–21°C', note: 'Nhiệt độ tối ưu để ngủ sâu' },
      { icon: '🌑', label: 'Tối hoàn toàn', note: 'Rèm dày hoặc mặt nạ ngủ' },
      { icon: '🔇', label: 'Giảm tiếng ồn', note: 'White noise che tiếng ồn ngắt quãng' },
      { icon: '🛏️', label: 'Giường chỉ để ngủ', note: 'Không làm việc, không màn hình' },
    ],
  },
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
  {
    icon: '☀️', label: 'Ánh sáng sáng',
    desc: 'Ra ánh sáng tự nhiên 3–5 phút sau khi thức. Báo hiệu cho cơ thể bắt đầu ngày mới.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng tự nhiên buổi sáng là kích thích mạnh nhất để đặt lại đồng hồ sinh học — 5 phút ra ngoài hiệu quả gấp 10 lần bật đèn trong nhà.',
    detail: 'Mắt có các tế bào nhạy cảm ánh sáng đặc biệt (ipRGCs) kết nối trực tiếp với nhân trên giao thoa (SCN) — đồng hồ chủ của cơ thể. Ánh sáng buổi sáng "chốt" giờ thức và kích hoạt chuỗi hormone cho cả ngày.',
    details: [
      'Ánh sáng tự nhiên buổi sáng (10.000–100.000 lux) mạnh gấp 100–1000 lần ánh đèn trong nhà (~100–500 lux) — đây là lý do ra ngoài quan trọng hơn bật đèn.',
      'Trong vòng 30–60 phút đầu sau khi thức, tiếp xúc ánh sáng kích hoạt cortisol (Cortisol Awakening Response) — đây là cortisol tốt giúp bạn tỉnh táo và năng động.',
      '5 phút ánh sáng tự nhiên buổi sáng không cần nắng gắt — ngày흐mây vẫn hiệu quả vì độ sáng ngoài trời vẫn cao hơn trong nhà rất nhiều.',
      'Đeo kính râm khi ra ngoài buổi sáng làm giảm tác dụng — để mắt tiếp xúc ánh sáng trực tiếp (không nhìn thẳng vào mặt trời).',
      'Nếu không thể ra ngoài, mở rèm hết và ngồi gần cửa sổ trong 10–15 phút vẫn tốt hơn không làm gì.',
      'Ánh sáng buổi sáng còn giúp tăng serotonin — tiền chất của melatonin về đêm. Nhiều serotonin ban ngày → ngủ sâu hơn về tối.',
    ],
    points: [
      { icon: '⏱️', label: '5 phút là đủ', note: 'Ra ngoài ngay sau khi thức' },
      { icon: '🌥️', label: 'Ngày흐mây vẫn tốt', note: 'Ngoài trời luôn sáng hơn trong nhà' },
      { icon: '👓', label: 'Không đeo kính râm', note: 'Để mắt nhận ánh sáng tự nhiên' },
      { icon: '🌅', label: 'Trong 1 giờ đầu', note: 'Kích hoạt cortisol tốt cho cả ngày' },
    ],
  },
  {
    icon: '💧', label: 'Uống nước đầu ngày',
    desc: 'Uống 200–300ml nước ngay khi thức. Cơ thể mất nước sau 7–9 giờ ngủ không có nước.',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất 1–2% nước trong cơ thể đã đủ làm giảm hiệu suất nhận thức 10–15% và tăng cảm giác mệt mỏi — và bạn thường đạt mức này ngay khi vừa thức dậy.',
    detail: 'Sau 7–9 giờ không uống nước, cơ thể bắt đầu ngày mới ở trạng thái thiếu nước nhẹ. Uống nước là một trong những thói quen sáng đơn giản nhất với lợi ích rõ ràng nhất.',
    details: [
      'Não chứa ~75% nước — thiếu nước nhẹ làm chậm dẫn truyền thần kinh, giảm tập trung và tăng cảm giác mơ màng buổi sáng.',
      'Uống nước trước khi uống cà phê: caffeine lúc bụng đói + cơ thể mất nước tăng cortisol và gây khó chịu dạ dày cho nhiều người.',
      '200–300ml nước là lượng lý tưởng — không cần uống cả lít ngay một lúc, uống từ từ trong 10–15 phút đầu.',
      'Nước thường hoặc nước ấm đều tốt. Thêm chút muối (electrolyte) hoặc chanh không bắt buộc nhưng có thể giúp hấp thu nhanh hơn.',
      'Đặt bình nước ngay cạnh giường tối hôm trước — loại bỏ ma sát để biến thói quen uống nước thành tự động.',
      'Cảm giác "buồn ngủ" sau khi thức trong 10–20 phút (sleep inertia) thường giảm nhanh hơn sau khi uống nước và ra ánh sáng — không phải lúc nào cũng cần cà phê.',
    ],
    points: [
      { icon: '🥛', label: '200–300ml ngay khi thức', note: 'Trước cà phê và bữa sáng' },
      { icon: '🛏️', label: 'Đặt bình cạnh giường', note: 'Tự động hóa thói quen' },
      { icon: '🧠', label: 'Não cần nước', note: 'Giảm mơ màng, tăng tập trung' },
      { icon: '⚡', label: 'Giảm sleep inertia', note: 'Cảm giác "chưa tỉnh" sau ngủ' },
    ],
  },
  {
    icon: '🍽️', label: 'Bữa đầu có đạm',
    desc: 'Protein buổi sáng giúp ổn định đường huyết, tránh tụt năng lượng buổi chiều.',
    color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa sáng giàu protein (~25–30g) giúp kiểm soát cơn thèm ăn suốt cả ngày bằng cách tăng GLP-1 và giảm ghrelin (hormone đói) hiệu quả hơn carb đơn thuần.',
    detail: 'Bữa sáng không phải là bắt buộc với mọi người, nhưng nếu bạn ăn sáng thì đạm là thành phần quan trọng nhất — quyết định đường huyết và năng lượng suốt buổi sáng.',
    details: [
      'Bữa sáng nhiều carb tinh (bánh mì trắng, xôi trắng, cháo loãng) gây tăng đường huyết nhanh rồi tụt mạnh lúc 10–11h — đây là nguyên nhân chính của cơn đói và mệt buổi sáng.',
      '25–30g protein buổi sáng làm chậm hấp thu, ổn định đường huyết và duy trì cảm giác no đến gần trưa mà không cần ăn vặt.',
      'Nguồn đạm dễ làm buổi sáng: 3 quả trứng (~18g), sữa chua Hy Lạp 200g (~17g), ức gà nguội 80g (~26g), phô mai tươi 100g (~12g).',
      'Không nhất thiết phải ăn sáng ngay khi thức — nhiều người nhịn đến 9–10h vẫn tốt nếu không đói. Nhưng khi ăn bữa đầu, hãy có đạm.',
      'Cà phê + đường không phải là bữa sáng — đây là kích thích cortisol và đường huyết ngắn hạn, sẽ sập năng lượng sớm hơn.',
      'Kết hợp lý tưởng: đạm + chất xơ (rau, trái cây) cho bữa đầu ngày — carb có thể có nhưng không nên là thành phần chủ đạo.',
    ],
    points: [
      { icon: '🥚', label: '25–30g protein', note: 'Mục tiêu cho bữa đầu ngày' },
      { icon: '📉', label: 'Tránh carb đơn thuần', note: 'Gây tụt đường huyết lúc 10–11h' },
      { icon: '🕘', label: 'Không cần ăn ngay', note: 'Ăn khi đói, nhưng có đạm khi ăn' },
      { icon: '🧀', label: 'Nguồn đạm nhanh', note: 'Trứng, sữa chua, phô mai' },
    ],
  },
  {
    icon: '🚶', label: 'Đi bộ sau ăn',
    desc: '5–10 phút đi bộ sau bữa trưa giúp tỉnh táo, tránh buồn ngủ sau ăn và ổn định đường huyết.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đi bộ 10 phút sau bữa ăn giảm đường huyết sau bữa đến 22% — hiệu quả hơn đi bộ 30 phút vào bất kỳ thời điểm nào khác trong ngày.',
    detail: 'Buồn ngủ sau ăn trưa (post-lunch dip) là hiện tượng sinh lý tự nhiên — nhưng bạn có thể giảm thiểu đáng kể bằng cách di chuyển nhẹ thay vì ngồi yên sau ăn.',
    details: [
      'Sau bữa ăn, cơ thể chuyển máu đến hệ tiêu hóa và đường huyết tăng — ngồi yên làm quá trình này kéo dài và gây cảm giác nặng nề, buồn ngủ.',
      'Đi bộ nhẹ kích hoạt cơ bắp hấp thu glucose từ máu (không cần insulin) — đây là cơ chế giải thích tại sao chỉ 10 phút đi bộ giảm đường huyết đáng kể.',
      'Không cần đi bộ nhanh hay xa — chỉ cần "di chuyển" là đủ. Đi quanh văn phòng, leo cầu thang 1–2 tầng, hoặc ra ngoài 5 phút đều có tác dụng.',
      'Thời điểm lý tưởng: bắt đầu đi trong vòng 20–30 phút sau khi ăn xong — đây là khi đường huyết đang tăng và cơ bắp cần glucose nhất.',
      'Post-lunch dip tự nhiên nhất lúc 13–15h (nhịp sinh học) — đi bộ + ánh sáng tự nhiên là combo mạnh nhất để vượt qua điểm tụt này.',
      'Đây cũng là thời điểm tốt để "ngắt" công việc: một vòng ngắn ngoài trời reset tư duy, giảm stress và tăng tập trung buổi chiều.',
    ],
    points: [
      { icon: '⏱️', label: '5–10 phút là đủ', note: 'Không cần bài tập dài' },
      { icon: '🕐', label: 'Trong 30 phút sau ăn', note: 'Đường huyết đang tăng cao nhất' },
      { icon: '📉', label: 'Giảm đường huyết 22%', note: 'Hiệu quả hơn tập lúc khác' },
      { icon: '🧠', label: 'Reset tư duy buổi chiều', note: 'Giảm post-lunch dip tự nhiên' },
    ],
  },
  {
    icon: '☕', label: 'Caffeine thông minh',
    desc: 'Không uống caffeine khi chưa uống nước và ăn nhẹ. Tránh caffeine sau 15h với người khó ngủ.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Uống cà phê ngay sau khi thức dậy khi cortisol đang ở đỉnh (6–9h) lãng phí tác dụng caffeine — uống lúc 90–120 phút sau khi thức mới tối ưu nhất.',
    detail: 'Caffeine là công cụ mạnh khi dùng đúng cách và là kẻ thù của giấc ngủ khi lạm dụng. Thời điểm và cách uống quan trọng hơn lượng uống.',
    details: [
      'Cortisol (hormone tỉnh táo) đạt đỉnh 30–45 phút sau khi thức — đây là lúc não tự nhiên "tỉnh nhất". Uống cà phê lúc này không thêm được gì và còn làm tăng khả năng nhờn caffeine.',
      'Uống cà phê lúc 90–120 phút sau khi thức (khi cortisol bắt đầu giảm) cho tác dụng tỉnh táo tối đa và kéo dài hơn.',
      'Uống cà phê khi bụng đói làm tăng cortisol và axit dạ dày — uống sau khi đã uống nước và ăn nhẹ nhẹ bụng hơn nhiều.',
      'Caffeine có half-life 5–6 giờ: ly cà phê 15h → 50% caffeine vẫn còn lúc 21h → phá giai đoạn deep sleep dù bạn vẫn ngủ được.',
      '"Người không nhạy caffeine" thường vẫn bị ảnh hưởng đến giấc ngủ mà không nhận ra — vì deep sleep bị phá không gây mất ngủ rõ ràng, chỉ là ngủ không thật sự phục hồi.',
      'Giới hạn thực tế: 1–2 tách cà phê/ngày, uống trước 14h. Trà xanh và matcha cũng chứa caffeine — tính luôn vào tổng lượng.',
    ],
    points: [
      { icon: '⏰', label: 'Uống sau 90 phút thức', note: 'Cortisol giảm, caffeine mới hiệu quả' },
      { icon: '🥛', label: 'Uống nước trước', note: 'Tránh bụng đói + mất nước' },
      { icon: '🕒', label: 'Cắt sau 14h', note: 'Half-life 5–6h còn trong máu buổi tối' },
      { icon: '🍵', label: 'Tính cả trà', note: 'Trà xanh, matcha đều có caffeine' },
    ],
  },
];

const C3_LEVELS = [
  {
    level: 'Mới bắt đầu', label: 'Mới bắt đầu',
    steps: '+1.000–2.000 bước so với nền', desc: '+1.000–2.000 bước so với nền hiện tại',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tăng chỉ 1.000 bước/ngày so với mức hiện tại đã giảm nguy cơ bệnh tim mạch 10% và tử vong sớm 15% — mục tiêu nhỏ nhất vẫn có lợi ích rõ ràng.',
    detail: 'Điểm xuất phát tốt nhất không phải là 10.000 bước — mà là bất cứ đâu cao hơn mức hiện tại của bạn. Cơ thể phản ứng với sự thay đổi, không với con số tuyệt đối.',
    details: [
      'Trước tiên đo baseline: đeo điện thoại hoặc smartwatch 3–5 ngày liên tục không thay đổi thói quen, ghi lại mức trung bình thực sự.',
      'Tăng 1.000–2.000 bước so với baseline đó — không phải so với "mục tiêu 10.000" của người khác. Nếu bạn đang đi 2.000 bước, mục tiêu là 3.000–4.000.',
      'Nhiều nghiên cứu xác nhận lợi ích sức khỏe bắt đầu ngay từ mức tăng nhỏ đầu tiên — điều quan trọng là tạo xu hướng tăng dần, không phải nhảy vọt.',
      'Giai đoạn này không cần track chính xác từng ngày — chỉ cần cảm nhận "hôm nay mình đi nhiều hơn thường ngày" là thành công.',
      'Thêm 1 thói quen nhỏ: đi bộ sau 1 bữa ăn, đi cầu thang 1 tầng, đỗ xe xa hơn 1 ô. Mỗi thói quen nhỏ cộng khoảng 200–500 bước.',
      'Sau 2–3 tuần, baseline tự nâng lên — lúc đó tăng thêm 500–1.000 bước tiếp theo thay vì cố giữ cùng một con số mục tiêu.',
    ],
    points: [
      { icon: '📊', label: 'Đo baseline trước', note: 'Theo dõi 3–5 ngày không thay đổi' },
      { icon: '➕', label: 'Tăng +1.000–2.000', note: 'So với nền của chính bạn' },
      { icon: '🔁', label: 'Tăng dần mỗi 2–3 tuần', note: 'Không nhảy vọt ngay' },
      { icon: '🏃', label: 'Thói quen nhỏ cộng lại', note: '200–500 bước mỗi thói quen' },
    ],
  },
  {
    level: 'Cơ bản', label: 'Cơ bản',
    steps: '6.000–8.000 bước/ngày', desc: '6.000–8.000 bước/ngày',
    color: '#06b6d4', rgb: '6,182,212',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: '7.000 bước/ngày giảm 50–70% nguy cơ tử vong sớm so với nhóm dưới 2.000 bước — đây là "điểm gập" lớn nhất trong toàn bộ phổ nghiên cứu bước chân.',
    detail: 'Mức 6.000–8.000 bước/ngày là vùng lợi ích sức khỏe tốt nhất theo chi phí thời gian — đủ để có tác động đáng kể mà không cần dành quá nhiều thời gian đặc biệt cho việc đi bộ.',
    details: [
      'Nghiên cứu JAMA Internal Medicine (2019) trên 16.741 phụ nữ: 7.500 bước/ngày giảm tử vong sớm 65% so với nhóm 2.700 bước. Lợi ích plateau sau khoảng 7.500–8.000 bước.',
      'Ở mức này, bạn không cần "tập bộ" riêng — vận động phân tán suốt ngày (đi lại văn phòng, cầu thang, đi chợ) đủ để đạt mục tiêu.',
      'Mức 6.000–8.000 bước tương đương khoảng 45–60 phút đi lại tích lũy trong ngày — hoàn toàn khả thi với lịch bận.',
      'Đây là mức phù hợp nhất để duy trì lâu dài mà không cảm thấy như một "nhiệm vụ" — đủ thách thức nhưng không quá áp lực.',
      'Theo dõi tuần thay vì ngày: trung bình 7 ngày quan trọng hơn việc đạt đúng mục tiêu mỗi ngày. Ngày nào ít bước, ngày khác bù lại.',
      'Khi đạt mức này đều đặn 3–4 tuần, cơ thể tự thích nghi — bạn sẽ thấy đi 6.000 bước trở nên dễ dàng và tự nhiên hơn nhiều.',
    ],
    points: [
      { icon: '📉', label: '7.000 bước = điểm gập', note: 'Giảm 50–70% nguy cơ tử vong sớm' },
      { icon: '⏱️', label: '45–60 phút tích lũy', note: 'Không cần đi bộ liên tục 1 lần' },
      { icon: '📅', label: 'Tính trung bình tuần', note: 'Linh hoạt hơn theo dõi từng ngày' },
      { icon: '🔄', label: 'Duy trì 3–4 tuần', note: 'Sau đó trở thành tự nhiên' },
    ],
  },
  {
    level: 'Khỏe hơn', label: 'Khỏe hơn',
    steps: '8.000–10.000 bước/ngày', desc: '8.000–10.000 bước/ngày',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1486218119243-13301b4e234d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Con số 10.000 bước/ngày xuất phát từ một chiến dịch marketing Nhật Bản năm 1965 — nghiên cứu khoa học thực sự cho thấy lợi ích tối đa đạt được ở khoảng 8.000–9.000 bước.',
    detail: 'Mức 8.000–10.000 bước mang lại cải thiện rõ ràng về sức bền tim mạch, kiểm soát cân nặng và tâm trạng. Đây là mức để "khỏe hơn", không chỉ là "tránh bệnh".',
    details: [
      'Con số 10.000 bước/ngày được tạo ra bởi công ty Yamasa năm 1965 khi ra mắt máy đếm bước "Manpo-kei" (万歩計 = vạn bộ kế). Không có nghiên cứu khoa học nào đứng sau con số này lúc đó.',
      'Nghiên cứu hiện đại cho thấy lợi ích sức khỏe tăng mạnh nhất từ 0→7.000 bước, và tiếp tục tăng nhưng chậm dần từ 7.000→10.000 bước.',
      'Ở mức 8.000–10.000 bước, bạn bắt đầu thấy cải thiện về: cân nặng ổn định hơn, ngủ sâu hơn, tâm trạng tốt hơn, sức bền tăng.',
      'Để đạt mức này một cách tự nhiên: 1 lần đi bộ buổi sáng/tối 20–30 phút + vận động phân tán trong ngày là đủ.',
      'Đi bộ nhanh (brisk walk — có thể nói chuyện nhưng hơi thở nhanh hơn) tạo ra lợi ích tim mạch nhiều hơn đi bộ chậm cùng số bước.',
      'Ở mức này, chất lượng bước quan trọng dần: thỉnh thoảng đi bộ trên địa hình không bằng phẳng, đi bộ kết hợp leo dốc tạo thêm thách thức tim mạch.',
    ],
    points: [
      { icon: '🏃', label: '20–30 phút đi bộ', note: '+ vận động phân tán cả ngày' },
      { icon: '💨', label: 'Brisk walk', note: 'Đi nhanh có nhịp tim hiệu quả hơn' },
      { icon: '📐', label: 'Chất lượng > số lượng', note: 'Địa hình dốc thêm thách thức' },
      { icon: '🎯', label: '8.000–9.000 là ngưỡng tối ưu', note: '10.000 là marketing, không phải khoa học' },
    ],
  },
  {
    level: 'Tập nhiều', label: 'Tập nhiều',
    steps: 'Cá nhân hóa theo phục hồi', desc: 'Cá nhân hóa theo khả năng phục hồi',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người tập gym 4–5 ngày/tuần cường độ cao có thể cần ít bước hơn vì cơ thể đã nhận đủ tín hiệu vận động — ép thêm bước khi đang phục hồi có thể làm chậm tiến bộ.',
    detail: 'Khi bạn đã tập luyện có cấu trúc, NEAT cần được cân bằng với nhu cầu phục hồi — không phải "càng nhiều càng tốt". Lắng nghe cơ thể quan trọng hơn đạt số bước.',
    details: [
      'Người tập nặng có thể cần điều chỉnh mục tiêu bước theo lịch tập: ngày tập chân nặng → giảm bước đi bộ để cơ được phục hồi; ngày nhẹ → có thể tăng bước.',
      'Dấu hiệu cần giảm NEAT: nhịp tim nghỉ cao hơn bình thường 5–7 bpm, hiệu suất tập giảm liên tiếp 2–3 buổi, đau cơ kéo dài hơn 72 giờ.',
      'Với người tập gym, "active recovery" bước nhẹ (3.000–5.000 bước đi bộ chậm) ngày sau tập nặng thường tốt hơn nằm yên hoàn toàn.',
      'Tổng tải trọng hàng tuần (training load) gồm cả buổi tập + NEAT — khi tập nhiều, tự động giảm NEAT một chút là cơ thể tự điều tiết thông minh.',
      'Đối với người thi đấu hoặc tập 5–6 ngày/tuần: có tuần cao tải (bước + tập) và tuần thấp tải (deload + giảm bước) giúp tiến bộ lâu dài hơn.',
      'Công cụ theo dõi: heart rate variability (HRV) sáng sớm là chỉ số tốt nhất để biết hôm nay nên tăng hay giảm vận động tổng thể.',
    ],
    points: [
      { icon: '⚖️', label: 'Cân bằng tập + NEAT', note: 'Không ép bước khi đang phục hồi' },
      { icon: '📈', label: 'HRV buổi sáng', note: 'Chỉ số tốt nhất cho phục hồi' },
      { icon: '🔄', label: 'Tuần cao/thấp tải', note: 'Deload định kỳ cho tiến bộ lâu dài' },
      { icon: '🦵', label: 'Ngày tập chân nặng', note: 'Giảm bước, ưu tiên phục hồi' },
    ],
  },
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
  {
    exercise: 'Thở cơ hoành', label: 'Thở cơ hoành', icon: '🫁',
    duration: '1 phút', note: 'Bụng phồng khi hít, ngực ít nâng',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở cơ hoành kích hoạt hệ thần kinh phó giao cảm trong vòng 60 giây — giảm cortisol và nhịp tim hiệu quả hơn bất kỳ kỹ thuật thư giãn nào khác.',
    detail: 'Đây là bài tập đầu tiên và quan trọng nhất. 90% người hít thở bằng ngực, không phải cơ hoành — điều này duy trì cơ thể trong trạng thái kích thích nhẹ liên tục.',
    details: [
      'Thở ngực (chest breathing) kích hoạt cơ cổ và vai phụ — tạo ra căng thẳng cơ học liên tục ở vùng cổ vai gáy khi bạn thở mỗi ngày 20.000+ nhịp.',
      'Cơ hoành nằm ngay dưới phổi — khi hít vào đúng cách, bụng phồng ra và ngực gần như không nâng. Đây là cơ hô hấp chính của cơ thể.',
      'Dây thần kinh phế vị (vagus nerve) chạy qua cơ hoành — thở cơ hoành chậm kích thích trực tiếp dây này, kích hoạt chế độ "rest and digest".',
      'Sau 5–6 nhịp thở cơ hoành chậm (4 giây hít, 6 giây thở), HRV (heart rate variability) tăng có thể đo được — chỉ số phục hồi tốt hơn.',
      'Kỹ thuật: đặt tay phải lên bụng, tay trái lên ngực. Hít vào mũi — tay phải phải nâng lên, tay trái gần như đứng yên. Thở ra miệng từ từ.',
      'Tập trong 1 phút mỗi ngày tạo "cơ bắp thần kinh" phó giao cảm — về dài hạn giúp cơ thể phục hồi nhanh hơn sau stress và tập luyện.',
    ],
    points: [
      { icon: '🫁', label: 'Bụng phồng, ngực ít nâng', note: 'Cơ hoành là cơ hô hấp chính' },
      { icon: '🧠', label: 'Vagus nerve', note: 'Kích hoạt "rest and digest" mode' },
      { icon: '❤️', label: 'Tăng HRV', note: 'Chỉ số phục hồi cải thiện ngay' },
      { icon: '⏱️', label: '1 phút = 6–8 nhịp', note: '4 giây hít, 6 giây thở' },
    ],
  },
  {
    exercise: 'Shoulder roll', label: 'Shoulder roll', icon: '🔄',
    duration: '1 phút', note: 'Xoay vai trước và sau',
    color: '#818cf8', rgb: '129,140,248',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dân văn phòng dành 6–8 giờ/ngày với vai nhún về phía tai — shoulder roll ngược chiều hàng ngày ngăn chặn tình trạng co rút cơ thang (trapezius) mạn tính.',
    detail: 'Shoulder roll đơn giản nhưng cực kỳ hiệu quả để reset cơ vai và cổ sau thời gian dài căng thẳng hoặc ngồi làm việc. Hai chiều xoay có tác dụng khác nhau.',
    details: [
      'Xoay vai về phía trước (anterior) kéo giãn cơ rhomboid (giữa hai bả vai) thường bị căng do vai đổ về phía trước khi ngồi.',
      'Xoay vai về phía sau (posterior) kích hoạt cơ lower trapezius và serratus anterior — hai cơ thường bị yếu và ức chế ở người ngồi nhiều.',
      'Kết hợp hít thở: hít vào khi vai đi lên và về sau, thở ra khi vai đi xuống và về trước — tăng hiệu quả giãn cơ và kích hoạt phó giao cảm.',
      'Phạm vi chuyển động đầy đủ quan trọng hơn tốc độ — xoay chậm, lớn, cảm nhận từng cơ trong vòng xoay thay vì xoay nhanh hời hợt.',
      'Dấu hiệu cần chú ý: nghe tiếng "lục cục" khi xoay vai → bình thường nếu không đau; nếu đau → cần kiểm tra rotator cuff trước khi tập.',
      '1 phút = khoảng 8–10 vòng mỗi chiều. Sau 10 giây, cảm giác căng ở cổ và vai sẽ bắt đầu giảm rõ rệt.',
    ],
    points: [
      { icon: '🔄', label: 'Hai chiều xoay', note: 'Trước và sau, tác dụng khác nhau' },
      { icon: '💨', label: 'Kết hợp hít thở', note: 'Hít lên, thở ra xuống' },
      { icon: '🐢', label: 'Chậm và đầy đủ', note: 'Phạm vi rộng quan trọng hơn tốc độ' },
      { icon: '👂', label: 'Tiếng lục cục', note: 'Bình thường nếu không kèm đau' },
    ],
  },
  {
    exercise: 'Thoracic twist', label: 'Thoracic twist', icon: '🌀',
    duration: '1 phút', note: 'Xoay lưng ngực từng bên',
    color: '#c084fc', rgb: '192,132,252',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cột sống ngực được thiết kế để xoay 35–40°, nhưng ngồi làm việc suốt ngày làm giảm xuống còn 10–15° — gây ra cơ chế bù trừ khiến cổ và lưng dưới phải xoay thay.',
    detail: 'Thoracic spine (T1–T12) là vùng bị quên nhất trong phục hồi, nhưng lại là "cầu nối" giữa cổ và lưng. Mất linh hoạt ở đây gây đau cả hai đầu.',
    details: [
      'Khi T-spine bị cứng, não tự động "tìm" range of motion ở các khớp lân cận — thường là L4–L5 (lưng dưới) và C4–C6 (cổ), tạo ra tải trọng dư thừa và đau mạn tính.',
      'Tư thế ngồi làm việc (forward head, rounded shoulders) nén các đốt ngực về phía trước liên tục — thoracic twist kéo giãn ngược lại sự nén này.',
      'Kỹ thuật: ngồi thẳng, tay phải đặt lên vai trái, xoay thân về bên phải tối đa, giữ 3–5 giây. Đảm bảo xương chậu không xoay theo — chỉ xoay phần lưng ngực.',
      'Hít vào trước khi xoay, thở ra khi xoay tối đa — phổi xẹp tạo không gian cho lồng ngực xoay sâu hơn 10–15%.',
      'Điểm phổ biến nhất bị cứng: T4–T8 (giữa lưng ngực) — cảm nhận "điểm kháng cự" khi xoay, ở đó giữ thêm 2–3 giây.',
      'Kết quả ngay lập tức: sau 3–5 lần mỗi bên, tầm nhìn khi ngửa đầu và xoay cổ thường tăng đáng kể — bằng chứng T-spine và cổ có liên hệ trực tiếp.',
    ],
    points: [
      { icon: '🔄', label: 'Chỉ xoay lưng ngực', note: 'Xương chậu giữ cố định' },
      { icon: '💨', label: 'Thở ra khi xoay', note: 'Tăng ROM thêm 10–15%' },
      { icon: '🎯', label: 'T4–T8 là điểm cứng nhất', note: 'Giữ thêm 2–3 giây ở điểm kháng' },
      { icon: '🔗', label: 'Liên hệ với cổ', note: 'T-spine lỏng → cổ bớt đau' },
    ],
  },
  {
    exercise: 'Hip flexor stretch', label: 'Hip flexor stretch', icon: '🦵',
    duration: '1 phút × 2', note: 'Giãn gấp hông từng bên',
    color: '#e879f9', rgb: '232,121,249',
    img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người ngồi 8+ giờ/ngày có hip flexor (cơ gấp hông) co rút liên tục — kéo xương chậu ngả về trước (anterior pelvic tilt) và là nguyên nhân số 1 gây đau lưng dưới.',
    detail: 'Psoas và iliacus (nhóm hip flexor) nối cột sống thắt lưng với xương đùi. Khi co rút, chúng kéo lưng dưới ưỡn ra và nén đĩa đệm L4–L5, L5–S1.',
    details: [
      'Ngồi giữ hip flexor ở tư thế co ngắn liên tục — sau vài tháng, cơ "nhớ" độ dài ngắn này và mất đi độ linh hoạt ngay cả khi không ngồi.',
      'Anterior pelvic tilt (chậu ngả trước) do hip flexor căng làm: bụng phình ra dù không có mỡ thừa, mông "phẳng", lưng dưới ưỡn quá mức.',
      'Kỹ thuật lunge stretch: gối phải chạm sàn, chân trái phía trước 90°, đẩy hông phải về phía trước và xuống. Cảm thấy căng ở đùi trước chân phải = đúng vị trí.',
      'Tăng cường độ: từ từ nâng tay cùng bên với gối chạm sàn lên đầu — kéo giãn thêm phần psoas gần cột sống hơn.',
      'Giữ 60 giây mỗi bên với nhịp thở chậm — không nảy người. Cơ cần thời gian để phản xạ giãn (autogenic inhibition) hoạt động.',
      'Cơ mông (glutes) và hip flexor là "kẻ thù" — khi hip flexor căng, glutes bị ức chế (reciprocal inhibition). Giãn hip flexor = kích hoạt glutes hiệu quả hơn.',
    ],
    points: [
      { icon: '🦴', label: 'Anterior pelvic tilt', note: 'Lưng dưới đau vì chậu ngả trước' },
      { icon: '⏱️', label: '60 giây mỗi bên', note: 'Đủ thời gian cho autogenic inhibition' },
      { icon: '🍑', label: 'Giãn hip flexor = kích hoạt glute', note: 'Reciprocal inhibition' },
      { icon: '🙅', label: 'Không nảy người', note: 'Gây phản xạ co cơ ngược lại' },
    ],
  },
  {
    exercise: 'Hamstring stretch', label: 'Hamstring stretch', icon: '🏃',
    duration: '1 phút × 2', note: 'Giãn đùi sau từng bên',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hamstring co rút là một trong 3 nguyên nhân hàng đầu gây đau lưng dưới mạn tính — 60 giây giãn mỗi ngày đủ để duy trì độ linh hoạt và giảm tải lên đĩa đệm.',
    detail: 'Hamstring (cơ đùi sau) chạy từ xương ngồi đến sau gối — khi co rút, chúng kéo xương chậu ngả ra sau (posterior tilt) và làm phẳng đường cong sinh lý lưng dưới.',
    details: [
      'Hamstring nối xương ngồi (ischial tuberosity) với xương chày và fibula. Khi ngồi, chúng ở trạng thái vừa dài vừa bị nén — gây mất linh hoạt theo cơ chế khác hip flexor.',
      'Posterior pelvic tilt do hamstring căng làm "phẳng" lưng dưới — mất đường cong sinh lý L4–L5, tăng áp lực lên đĩa đệm ở tư thế ngồi và cúi.',
      'Kỹ thuật đứng: đứng thẳng, gót chân phải đặt lên bề mặt cao (30–50cm), giữ gối thẳng, từ từ cúi người về phía chân. Cảm thấy căng sau đùi = đúng.',
      'Kỹ thuật nằm: nằm ngửa, kéo chân lên 90° bằng khăn quàng cổ vòng qua gót, giữ gối thẳng. Kiểm soát tốt hơn lực kéo so với đứng.',
      'Neural tension vs. cơ bắp: đôi khi "cảm giác căng sau đùi" là dây thần kinh tọa căng chứ không phải cơ — nếu cảm thấy ngứa ran hay tê, giảm góc kéo.',
      'Sau 4–6 tuần tập đều, hamstring dài ra và lưng dưới cảm thấy "nhẹ" hơn rõ rệt — đặc biệt sau khi ngủ dậy buổi sáng.',
    ],
    points: [
      { icon: '🦵', label: 'Kéo lưng phẳng', note: 'Posterior tilt gây đau L4–L5' },
      { icon: '⏱️', label: '60 giây mỗi bên', note: 'Không nảy, giữ tĩnh' },
      { icon: '⚡', label: 'Kiểm tra dây thần kinh', note: 'Tê/ngứa ran → giảm góc kéo' },
      { icon: '🔄', label: '4–6 tuần thấy khác biệt', note: 'Lưng sáng dậy nhẹ hơn rõ' },
    ],
  },
  {
    exercise: 'Child pose + thở', label: 'Child pose + thở', icon: '🧘',
    duration: '2 phút', note: 'Thư giãn hoàn toàn',
    color: '#7dd3fc', rgb: '125,211,252',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Child pose kết hợp thở chậm giảm hoạt động hệ thần kinh giao cảm và tăng HRV trong vòng 2 phút — là bài kết thúc lý tưởng vì tích hợp cả giãn cơ lẫn điều hòa thần kinh.',
    detail: 'Child pose (Balasana) nhẹ nhàng kéo giãn lưng, hông và vai trong khi tư thế cúi về phía trước tự nhiên kích hoạt phản xạ phó giao cảm.',
    details: [
      'Tư thế cúi người về phía trước (forward fold) kích hoạt baroreceptor ở cổ — não nhận tín hiệu áp lực tăng và tự động làm chậm nhịp tim, kích hoạt "rest mode".',
      'Child pose kéo giãn đồng thời: erector spinae (cơ dựng cột sống), QL (quadratus lumborum) hai bên lưng, và hip flexor theo chiều khác với lunge stretch.',
      'Tay duỗi thẳng về phía trước (extended child pose) kéo giãn thêm vai và lat (cơ lưng rộng) — thường rất căng ở người tập tay nhiều.',
      'Thở vào khi ở child pose: hít sâu để hướng khí xuống lưng và hông — bạn sẽ cảm nhận được hông và lưng dưới giãn ra thêm với mỗi nhịp thở.',
      '2 phút cho phép cơ thể "chìm sâu" hơn vào tư thế — trong 30 giây đầu cơ phản xạ co lại, sau 60 giây bắt đầu buông. Đừng rút ngắn dưới 90 giây.',
      'Kết hợp với thở dài: hít 4 giây, thở ra 6–8 giây trong child pose là combo mạnh nhất để hạ cortisol và chuẩn bị cho giấc ngủ tốt.',
    ],
    points: [
      { icon: '🧘', label: 'Forward fold reflex', note: 'Kích hoạt phó giao cảm tự nhiên' },
      { icon: '🫁', label: 'Thở hướng về lưng', note: 'Hông và lưng giãn thêm mỗi nhịp' },
      { icon: '⏳', label: 'Tối thiểu 90 giây', note: '60 giây đầu cơ phản xạ co lại' },
      { icon: '💤', label: 'Trước ngủ', note: 'Kết hợp thở ra dài để hạ cortisol' },
    ],
  },
  {
    exercise: 'Đi bộ nhẹ', label: 'Đi bộ nhẹ', icon: '🚶',
    duration: '1–2 phút', note: 'Kết thúc nhẹ nhàng',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Kết thúc bằng đi bộ nhẹ cho phép huyết áp và nhịp tim giảm từ từ — dừng đột ngột sau tập hoặc căng giãn mạnh có thể gây chóng mặt và máu đọng ở cơ bắp.',
    detail: 'Đây là bước "hạ cánh" của toàn bộ routine. Đi bộ nhẹ đảm bảo tuần hoàn trở về bình thường trước khi cơ thể chuyển sang chế độ nghỉ ngơi hoàn toàn.',
    details: [
      'Sau căng giãn và thư giãn, cơ bắp còn nhiều máu đọng lại (blood pooling) — đi bộ nhẹ bơm máu trở về tim và phổi, tránh cảm giác chóng mặt khi đứng dậy đột ngột.',
      'Nhiệt độ cơ thể tăng nhẹ trong quá trình tập và căng giãn — 1–2 phút đi bộ nhẹ hạ thân nhiệt từ từ, cơ thể tiếp tục quá trình làm mát sau khi kết thúc.',
      'Tốc độ lý tưởng: bước đi chậm hơn nhịp bình thường 20–30%, thở bình thường — đây là "active cool down", không phải đứng yên.',
      'Lắc nhẹ tay và xoay vai khi đi bộ tăng thêm lưu thông bạch huyết — hệ bạch huyết không có bơm riêng, phụ thuộc vào chuyển động cơ bắp để dẫn lưu.',
      'Nếu thực hiện routine này trước ngủ: sau đi bộ nhẹ, nằm xuống và để cơ thể tự "chìm" vào nghỉ ngơi — không kiểm tra điện thoại.',
      'Thời gian linh hoạt: 1 phút nếu vội, 2–3 phút nếu có thể. Không có giới hạn tối đa — đi bộ nhẹ 10 phút sau routine còn tốt hơn.',
    ],
    points: [
      { icon: '🩸', label: 'Chống blood pooling', note: 'Bơm máu về tim sau căng giãn' },
      { icon: '🌡️', label: 'Hạ thân nhiệt từ từ', note: 'Không dừng đột ngột' },
      { icon: '💧', label: 'Bạch huyết lưu thông', note: 'Lắc tay nhẹ khi đi bộ' },
      { icon: '😴', label: 'Trước ngủ', note: 'Sau đó nằm xuống không dùng điện thoại' },
    ],
  },
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
  {
    icon: '📉', label: 'Giảm số hiệp', desc: 'Ví dụ: 4 hiệp → 2–3 hiệp. Giữ nguyên cường độ.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm 40–50% tổng số hiệp trong tuần deload để hệ thần kinh hồi phục hoàn toàn.',
    detail: 'Giảm số hiệp là phương pháp deload nhẹ nhàng nhất — giữ nguyên cường độ (% 1RM) nhưng cắt giảm volume. Não bộ và hệ thần kinh trung ương được "xả áp" trong khi cơ bắp vẫn duy trì kích thích đủ để không mất form.',
    details: [
      'Giữ nguyên trọng lượng sử dụng, chỉ giảm số hiệp từ 4 xuống còn 2–3 hiệp mỗi bài.',
      'Tổng volume tuần giảm 40–50% so với tuần tập nặng — đây là mức đủ để kích hoạt hồi phục.',
      'Thích hợp nhất cho người tập sức mạnh muốn duy trì kỹ thuật mà không mất thần kinh-cơ.',
      'Không giảm thêm số rep — chỉ giảm số set để giữ pattern vận động ổn định.',
      'Sau 1 tuần deload kiểu này, hiệu suất tuần tiếp theo thường tăng 3–8% nhờ supercompensation.',
      'Kết hợp với ngủ sớm hơn 30 phút sẽ tối ưu hóa quá trình tái tạo hệ thần kinh.',
    ],
    points: [
      { icon: '⚡', label: 'Cường độ giữ nguyên', note: '% 1RM không đổi, chỉ volume giảm' },
      { icon: '🧠', label: 'Hồi phục thần kinh', note: 'CNS được xả áp trong 5–7 ngày' },
      { icon: '📊', label: 'Giảm 40–50% volume', note: '4 hiệp → 2–3 hiệp mỗi bài' },
      { icon: '🔁', label: 'Duy trì pattern', note: 'Form kỹ thuật không bị gián đoạn' },
    ],
  },
  {
    icon: '🏋️', label: 'Giảm mức tạ', desc: 'Giảm 10–20% trọng lượng so với tuần trước.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm 10–20% trọng lượng giúp cơ và mô liên kết hồi phục mà cơ thể vẫn "nhớ" chuyển động.',
    detail: 'Giảm mức tạ tác động trực tiếp vào hệ cơ-xương-khớp — giảm stress cơ học lên cơ và mô liên kết (gân, dây chằng). Đặc biệt hiệu quả khi bạn cảm thấy đau khớp nhẹ hoặc mô liên kết căng cứng sau nhiều tuần tập nặng.',
    details: [
      'Giảm 10–20% trọng lượng so với tuần trước — ví dụ squat 100kg → 80–90kg.',
      'Giữ nguyên số hiệp và rep để cơ thể vẫn quen với pattern volume tương tự.',
      'Tập trung vào kỹ thuật: tốc độ di chuyển chậm hơn, kiểm soát giai đoạn eccentric tốt hơn.',
      'Gân và dây chằng hồi phục chậm hơn cơ — phương pháp này đặc biệt bảo vệ mô liên kết.',
      'Không cảm thấy "dễ quá" là bình thường — mục tiêu không phải hiệu suất mà là hồi phục.',
      'Sau deload kiểu này, thường tăng được 5–10% trọng lượng ở tuần tiếp theo nhờ cơ thể đã phục hồi.',
    ],
    points: [
      { icon: '🦴', label: 'Bảo vệ mô liên kết', note: 'Gân, dây chằng được giảm stress cơ học' },
      { icon: '📐', label: 'Cải thiện kỹ thuật', note: 'Tạ nhẹ hơn → focus form tốt hơn' },
      { icon: '💪', label: 'Giảm 10–20% tạ', note: 'Volume tương đương, cơ vẫn được kích thích' },
      { icon: '🔋', label: 'Nạp lại năng lượng', note: 'Glycogen cơ được bổ sung đầy đủ' },
    ],
  },
  {
    icon: '🏃', label: 'Giảm thời lượng cardio', desc: '45 phút → 25–30 phút. Hoặc chuyển sang Zone 1–2.',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Zone 1–2 (60–70% max HR) tăng cường tuần hoàn mà không gây thêm stress cho hệ thần kinh.',
    detail: 'Cardio cường độ cao tích lũy stress tương tự tập tạ — tác động đến hệ thần kinh giao cảm, hệ miễn dịch và năng lượng tổng thể. Tuần deload cardio tập trung vào Zone 1–2 giúp tăng lưu lượng máu đến cơ (active recovery) mà không tiêu hao thêm nguồn lực hồi phục.',
    details: [
      'Giảm thời lượng từ 45 phút xuống 25–30 phút, hoặc từ 30 phút xuống 15–20 phút.',
      'Chuyển từ Zone 3–4 (HIIT, chạy nhanh) sang Zone 1–2 (đi bộ nhanh, đạp xe nhẹ nhàng).',
      'Zone 1–2: nhịp tim 60–70% HRmax — bạn vẫn nói chuyện được thoải mái khi tập.',
      'Active recovery ở Zone 1–2 tăng tuần hoàn máu, giúp các chất chuyển hóa được đào thải nhanh hơn.',
      'Tránh hoàn toàn HIIT và sprint trong tuần deload — hệ thần kinh cần được nghỉ ngơi.',
      'Bơi nhẹ hoặc đạp xe tĩnh là lựa chọn tốt nhất vì không có tác động va chạm lên khớp.',
    ],
    points: [
      { icon: '❤️', label: 'Zone 1–2 target', note: '60–70% HRmax, vẫn nói chuyện được' },
      { icon: '🩸', label: 'Active recovery', note: 'Tăng máu đến cơ, đào thải chất chuyển hóa' },
      { icon: '⏱️', label: 'Giảm 40% thời gian', note: '45 phút → 25–30 phút tối đa' },
      { icon: '🚴', label: 'Ưu tiên low-impact', note: 'Bơi, đạp xe — không va chạm lên khớp' },
    ],
  },
  {
    icon: '🚶', label: 'Giảm cường độ', desc: 'Chạy nhanh → đi bộ nhanh, đạp xe nhẹ, bơi nhẹ.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giảm cường độ toàn diện (cả sức mạnh lẫn cardio) là chiến lược deload sâu nhất, phù hợp sau chu kỳ tập cực nặng.',
    detail: 'Giảm cường độ là phương pháp deload toàn diện — vừa giảm % 1RM vừa hạ nhịp tim mục tiêu. Phù hợp sau chu kỳ peaking (thi đấu, test max), sau chấn thương nhẹ, hoặc khi cơ thể có nhiều dấu hiệu overtrain cùng lúc. Cơ thể chuyển sang trạng thái parasympathetic hoàn toàn.',
    details: [
      'Chạy nhanh → đi bộ nhanh (5–6 km/h), đạp xe nhẹ (50–60 rpm), bơi thoải mái (không đua thời gian).',
      'Kết hợp giảm cường độ cả tập tạ: dùng 50–60% 1RM, tempo chậm, rep thấp (3–5 rep).',
      'Phù hợp nhất sau giai đoạn peaking 4–6 tuần hoặc sau buổi thi đấu/test max.',
      'Hệ thần kinh tự chủ chuyển từ giao cảm (fight-or-flight) sang đối giao cảm (rest-and-digest).',
      'Thêm các hoạt động nhẹ nhàng: yoga, đi bộ thiên nhiên, bơi lội — tốt cho tâm lý lẫn thể chất.',
      'Kéo dài 7–10 ngày thay vì 5–7 ngày nếu đây là deload sau chu kỳ dài và nặng.',
    ],
    points: [
      { icon: '🧘', label: 'Chế độ Parasympathetic', note: 'Cơ thể chuyển sang rest-and-digest' },
      { icon: '🌿', label: 'Giảm toàn diện', note: 'Cả sức mạnh lẫn cardio đều hạ xuống' },
      { icon: '🏖️', label: 'Phù hợp sau peaking', note: 'Sau test max hoặc thi đấu 4–6 tuần' },
      { icon: '⏳', label: '7–10 ngày', note: 'Dài hơn deload thông thường nếu cần' },
    ],
  },
];

const C6_TECHNIQUES = [
  {
    icon: '🫁', name: 'Thở cơ hoành', label: 'Thở cơ hoành',
    steps: 'Tay lên bụng • Hít mũi → bụng phồng • Thở miệng chậm • Ngực ít nâng',
    time: '1–3 phút', use: 'Trước ngủ, sau tập, khi căng thẳng',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80&auto=format&fit=crop',
    keyFact: '90% người thở bằng ngực — thở cơ hoành đúng cách kích hoạt hệ phó giao cảm trong 60 giây, giảm cortisol hiệu quả hơn bất kỳ kỹ thuật thư giãn nào.',
    detail: 'Thở cơ hoành là nền tảng của mọi kỹ thuật thở. Cơ hoành là cơ chính của hô hấp, nhưng hầu hết người trưởng thành đã mất thói quen thở bằng cơ hoành do stress mãn tính — và chuyển sang thở ngực nông, duy trì cơ thể trong trạng thái kích thích nhẹ liên tục 24/7.',
    details: [
      'Đặt một tay lên ngực, một tay lên bụng — khi thở đúng, chỉ tay trên bụng nâng lên.',
      'Hít vào qua mũi trong 4 giây: để bụng phồng ra tự nhiên, ngực giữ nguyên hoặc ít nâng.',
      'Thở ra qua miệng chậm trong 4–6 giây: bụng xẹp dần từ dưới lên, không ép.',
      'Lặp 6–10 nhịp, tổng 1–3 phút — có thể ngồi, đứng hoặc nằm ngửa.',
      'Dấu hiệu thở đúng: cảm giác nhẹ đầu nhẹ nhàng sau 3–4 nhịp đầu (CO₂ đang cân bằng).',
      'Tập luyện hằng ngày 3 phút buổi sáng để tái lập thói quen thở cơ hoành tự nhiên.',
    ],
    points: [
      { icon: '✋', label: 'Tay lên bụng', note: 'Kiểm tra: tay bụng nâng, tay ngực giữ nguyên' },
      { icon: '👃', label: 'Hít mũi 4 giây', note: 'Bụng phồng ra, không nâng vai lên' },
      { icon: '💨', label: 'Thở miệng 4–6 giây', note: 'Chậm, kiểm soát, bụng xẹp dần' },
      { icon: '⏱️', label: '1–3 phút', note: 'Trước ngủ, sau tập, khi căng thẳng' },
    ],
  },
  {
    icon: '📦', name: 'Box breathing', label: 'Box breathing',
    steps: 'Hít 4 giây • Giữ 4 giây • Thở 4 giây • Giữ 4 giây • Lặp 4 vòng',
    time: '4 vòng (64 giây)', use: 'Trước tập, lúc stress, trước ngủ',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box breathing (4-4-4-4) đồng bộ hóa nhịp tim và hệ thần kinh tự chủ — kỹ thuật Navy SEAL dùng để bình tĩnh tức thời dưới áp lực cao.',
    detail: 'Box breathing hoạt động theo nguyên lý "nhịp thở đối xứng" — 4 giai đoạn bằng nhau tạo ra vòng lặp sinh lý có trật tự, giúp đồng bộ hóa nhịp tim với hơi thở (Heart Rate Variability). Não chuyển từ trạng thái amygdala (phản ứng) sang prefrontal cortex (tư duy) chỉ sau 3–4 vòng.',
    details: [
      'Hít vào qua mũi đúng 4 giây: bụng nở, cảm nhận phổi lấp đầy dần.',
      'Giữ hơi 4 giây: không căng cơ, chỉ "tạm dừng" hơi thở một cách nhẹ nhàng.',
      'Thở ra qua miệng đúng 4 giây: bụng xẹp từ từ, kiểm soát tốc độ đều đặn.',
      'Giữ rỗng 4 giây: đây là giai đoạn quan trọng nhất — não nhận tín hiệu "an toàn" mạnh nhất.',
      'Lặp 4 vòng (64 giây tổng) — đủ để não chuyển sang trạng thái bình tĩnh rõ rệt.',
      'Dùng được ở bất kỳ đâu: văn phòng, nhà vệ sinh, trước buổi họp, thang máy.',
    ],
    points: [
      { icon: '📦', label: '4-4-4-4', note: 'Hít → Giữ → Thở → Giữ rỗng, mỗi pha 4 giây' },
      { icon: '🧠', label: 'Prefrontal cortex', note: 'Não chuyển từ stress sang tư duy rõ ràng' },
      { icon: '❤️', label: 'Heart Rate Variability', note: 'Đồng bộ hóa nhịp tim với hơi thở' },
      { icon: '⏱️', label: '64 giây', note: '4 vòng là đủ — dùng được mọi lúc mọi nơi' },
    ],
  },
  {
    icon: '🌊', name: 'Thở ra dài hơn', label: 'Thở ra dài hơn',
    steps: 'Hít 4 giây • Thở ra 6 giây • Lặp 6–10 vòng',
    time: '2–3 phút', use: 'Khó ngủ, tim đập nhanh, sau ngày mệt',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1510894347713-fc3dc6166086?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở ra dài hơn hít vào là cách kích hoạt dây thần kinh phế vị mạnh nhất — đặc biệt hiệu quả khi khó ngủ hoặc tim đập nhanh.',
    detail: 'Kỹ thuật này khai thác cơ chế sinh lý: nhịp tim tăng nhẹ khi hít vào (giao cảm) và giảm khi thở ra (phó giao cảm). Khi thở ra dài hơn hít vào, bạn kéo dài pha phó giao cảm — dây thần kinh phế vị được kích hoạt lâu hơn, hạ nhịp tim và cortisol nhanh hơn bất kỳ kỹ thuật nào.',
    details: [
      'Hít vào qua mũi trong 4 giây: nhẹ nhàng, không ép, bụng phồng.',
      'Thở ra qua miệng trong 6–8 giây (hoặc lâu hơn nếu thoải mái): chậm, đều, bụng xẹp dần.',
      'Khoảng im lặng tự nhiên sau thở ra: đừng vội hít vào — chờ cơ thể tự "đòi" thở.',
      'Lặp 6–10 vòng (2–3 phút tổng) — nhiều người ngủ thiếp trước khi kết thúc 10 vòng.',
      'Không đếm nếu khiến bạn căng thẳng — chỉ tập trung vào cảm giác thở ra chậm và dài.',
      'Hiệu quả nhất khi nằm ngửa trong phòng tối — kết hợp với nhiệt độ phòng 18–22°C.',
    ],
    points: [
      { icon: '🕸️', label: 'Vagus nerve', note: 'Thở ra dài = kích hoạt phế vị tối đa' },
      { icon: '🌊', label: 'Tỉ lệ 4:6', note: 'Thở ra > hít vào — kéo dài pha phó giao cảm' },
      { icon: '💤', label: 'Chống khó ngủ', note: 'Hiệu quả nhất trong 3 kỹ thuật khi mất ngủ' },
      { icon: '⏱️', label: '6–10 vòng (2–3 phút)', note: 'Không đếm nếu stress — focus cảm giác' },
    ],
  },
];

const C6_PROTOCOLS = [
  {
    icon: '🏋️', label: 'Trước tập', brief: '4–6 nhịp thở cơ hoành',
    color: '#22d3ee', rgb: '34,211,238',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80&auto=format&fit=crop',
    keyFact: '4–6 nhịp thở cơ hoành trước tập kích hoạt hệ phó giao cảm, giúp cơ thể chuyển từ trạng thái căng thẳng sang sẵn sàng tập trung.',
    detail: 'Trước khi tập, hệ thần kinh giao cảm (fight-or-flight) cần được "bật" đúng cách — không quá kích động nhưng đủ tỉnh táo. Thở cơ hoành 4–6 nhịp giúp oxy hóa máu, ổn định nhịp tim, và kết nối thần kinh-cơ trước khi bắt đầu buổi tập.',
    details: [
      'Đứng hoặc ngồi thẳng, tay đặt lên bụng để cảm nhận chuyển động của cơ hoành.',
      'Hít vào qua mũi 4 giây: bụng phồng ra trước, ngực ít nâng lên — đây là thở cơ hoành đúng cách.',
      'Thở ra qua miệng 6 giây: bụng xẹp dần, không ép bụng đột ngột.',
      'Lặp 4–6 nhịp — khoảng 40–60 giây — ngay trước bài khởi động đầu tiên.',
      'Kết hợp với tập trung vào buổi tập: nghĩ đến các bài tập sắp thực hiện, hình dung form đúng.',
      'Không thở quá nhanh hoặc quá sâu đến mức chóng mặt — giữ nhịp tự nhiên và kiểm soát.',
    ],
    points: [
      { icon: '🫁', label: 'Kích hoạt cơ hoành', note: 'Bụng phồng khi hít, ngực ít nâng' },
      { icon: '🧠', label: 'Kết nối tâm-cơ', note: 'Focus vào buổi tập ngay từ nhịp đầu' },
      { icon: '⏱️', label: '40–60 giây', note: '4–6 nhịp trước bài khởi động' },
      { icon: '💡', label: 'Không chóng mặt', note: 'Giữ nhịp tự nhiên, không quá sâu' },
    ],
  },
  {
    icon: '🧊', label: 'Sau tập', brief: 'Hít 4 giây, thở 6 giây × 6–8 vòng',
    color: '#38bdf8', rgb: '56,189,248',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở ra dài hơn hít vào kích hoạt dây thần kinh phế vị, chủ động hạ nhịp tim và cortisol sau tập.',
    detail: 'Sau buổi tập cường độ cao, hệ giao cảm đang "nóng" — tim đập nhanh, cortisol cao, cơ thể chưa thoát khỏi trạng thái stress sinh lý. Protocol hít 4 / thở 6 giây kích hoạt dây thần kinh phế vị (vagus nerve), chủ động chuyển về trạng thái phục hồi nhanh hơn.',
    details: [
      'Sau bài tập cuối, ngồi xuống hoặc nằm ngửa với tư thế thoải mái.',
      'Hít vào qua mũi trong 4 giây: bụng phồng, lồng ngực nở nhẹ.',
      'Thở ra qua miệng chậm trong 6 giây: thở ra lâu hơn hít vào là chìa khóa kích hoạt phó giao cảm.',
      'Lặp 6–8 vòng — khoảng 1.5–2 phút — nhịp tim sẽ giảm rõ rệt trong vòng 2–3 phút.',
      'Không đứng dậy ngay sau 8 vòng nếu vẫn còn chóng mặt — thêm 2–3 nhịp tự nhiên.',
      'Kết hợp với bước đi thư giãn 3–5 phút để hỗ trợ tuần hoàn máu trở về tim.',
    ],
    points: [
      { icon: '❤️', label: 'Hạ nhịp tim', note: 'Rõ rệt trong 2–3 phút sau 8 vòng' },
      { icon: '🧬', label: 'Vagus nerve', note: 'Thở ra dài kích hoạt dây phế vị' },
      { icon: '⏱️', label: '1.5–2 phút', note: '6–8 vòng × (4s hít + 6s thở)' },
      { icon: '🚶', label: 'Kết hợp đi bộ', note: 'Cool-down 3–5 phút sau protocol' },
    ],
  },
  {
    icon: '🌙', label: 'Trước ngủ', brief: 'Thở cơ hoành 3 phút',
    color: '#818cf8', rgb: '129,140,248',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: '3 phút thở cơ hoành trước ngủ giảm cortisol và kích thích melatonin — rút ngắn thời gian đi vào giấc ngủ trung bình 8–12 phút.',
    detail: 'Thở cơ hoành 3 phút trước khi ngủ là protocol đơn giản nhất nhưng có tác dụng sinh lý rõ ràng nhất. Cortisol — hormone tỉnh táo — được hạ nhanh khi thở chậm sâu, trong khi melatonin được kích thích tổng hợp tốt hơn trong môi trường tối và yên tĩnh.',
    details: [
      'Nằm ngửa, mắt nhắm, hai tay đặt lên bụng để cảm nhận chuyển động.',
      'Hít vào mũi 4 giây: cảm nhận bụng nâng lên dưới tay — đây là thở cơ hoành đúng cách.',
      'Thở ra miệng chậm 6–8 giây: bụng hạ từ từ, thư giãn hoàn toàn cơ bụng.',
      'Duy trì trong 3 phút (khoảng 15–18 nhịp thở) — hầu hết người cảm thấy buồn ngủ trước khi kết thúc.',
      'Nếu tâm trí còn lang thang, tập trung vào cảm giác tay nâng/hạ thay vì đếm số.',
      'Kết hợp với phòng tối, nhiệt độ 18–22°C, và không dùng điện thoại 30 phút trước.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ sớm hơn 8–12 phút', note: 'Rút ngắn thời gian đi vào giấc ngủ' },
      { icon: '🌡️', label: 'Giảm cortisol', note: 'Hormone tỉnh táo hạ nhanh khi thở sâu' },
      { icon: '🌑', label: 'Tối + yên tĩnh', note: 'Kết hợp để tối ưu melatonin' },
      { icon: '⏱️', label: '3 phút (15–18 nhịp)', note: '4s hít + 6–8s thở, nằm ngửa' },
    ],
  },
  {
    icon: '😤', label: 'Căng thẳng giữa ngày', brief: 'Box breathing 4 vòng',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box breathing 4 vòng (64 giây) đủ để hạ cortisol và ổn định hệ thần kinh giữa ngày làm việc căng thẳng.',
    detail: 'Box breathing (thở hộp) là kỹ thuật được Navy SEAL và Google sử dụng để phục hồi trạng thái bình tĩnh dưới áp lực cao. Nhịp thở đều 4–4–4–4 đồng bộ hóa nhịp tim và hệ thần kinh tự chủ, nhanh chóng đưa não về trạng thái prefrontal cortex (tư duy rõ ràng) thay vì amygdala (phản ứng stress).',
    details: [
      'Ngồi thẳng lưng hoặc đứng, mắt nhắm hoặc nhìn xuống một điểm cố định.',
      'Hít vào mũi 4 giây: bụng và ngực nở đều.',
      'Giữ hơi 4 giây: không căng, không ép — giữ tự nhiên.',
      'Thở ra miệng chậm 4 giây: bụng xẹp dần từ dưới lên.',
      'Giữ rỗng 4 giây trước nhịp tiếp theo — đây là điểm quan trọng nhất của box breathing.',
      'Lặp 4 vòng (64 giây) — não sẽ bình tĩnh rõ rệt sau vòng thứ 3.',
    ],
    points: [
      { icon: '🧠', label: 'Prefrontal cortex', note: 'Não chuyển từ stress sang tư duy rõ ràng' },
      { icon: '📦', label: '4-4-4-4', note: 'Hít → Giữ → Thở → Giữ rỗng × 4' },
      { icon: '⏱️', label: '64 giây', note: '4 vòng × 16 giây/vòng' },
      { icon: '💼', label: 'Dùng được ở mọi nơi', note: 'Văn phòng, toilet, thang máy đều OK' },
    ],
  },
  {
    icon: '🛌', label: 'Khó ngủ', brief: 'Thở ra dài hơn hít vào × 8–10 vòng',
    color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1495197359483-d092478c170a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tỉ lệ thở ra/hít vào > 1 là kích hoạt mạnh nhất dây thần kinh phế vị — hiệu quả nhất khi nằm trên giường không ngủ được.',
    detail: 'Khi nằm trên giường mà không ngủ được, não đang ở trạng thái hyperarousal — quá tỉnh táo, suy nghĩ nhiều. Protocol thở ra dài hơn hít vào khai thác phản xạ sinh lý: thở ra dài kích hoạt dây thần kinh phế vị mạnh hơn bất kỳ protocol nào khác, chủ động kéo nhịp tim và não xuống trạng thái buồn ngủ.',
    details: [
      'Nằm ngửa, hai tay xuôi hoặc đặt lên bụng, mắt nhắm.',
      'Hít vào mũi 4 giây: nhẹ nhàng, không ép.',
      'Thở ra miệng chậm 6–8 giây (hoặc lâu hơn nếu thoải mái) — thở ra càng dài càng tốt.',
      'Khoảng im lặng tự nhiên sau thở ra: đừng vội hít vào — chờ cơ thể tự "đòi" thở.',
      'Lặp 8–10 vòng (khoảng 2–3 phút) — hầu hết người ngủ thiếp đi trước khi kết thúc 10 vòng.',
      'Không đếm số nếu khiến bạn căng thẳng — chỉ tập trung vào cảm giác thở ra dài.',
    ],
    points: [
      { icon: '🕸️', label: 'Vagus nerve mạnh nhất', note: 'Tỉ lệ thở ra > hít vào = kích hoạt tối đa' },
      { icon: '💤', label: 'Giảm hyperarousal', note: 'Não quá tỉnh → kéo xuống buồn ngủ' },
      { icon: '⏱️', label: '8–10 vòng (2–3 phút)', note: '4s hít + 6–8s thở ra' },
      { icon: '🌀', label: 'Không đếm nếu stress', note: 'Focus cảm giác, không focus con số' },
    ],
  },
];

const C7_AREAS = [
  { area: 'Buổi sáng', icon: '🌅', tips: ['Đặt bình nước trên bàn đầu giường', 'Để giày đi bộ ở cửa', 'Chuẩn bị đồ tập từ tối hôm trước', 'Đặt điện thoại xa giường', 'Mở rèm dễ dàng'] },
  { area: 'Làm việc', icon: '💼', tips: ['Đặt bình nước xa bàn để buộc phải đứng dậy', 'Dùng timer 45–60 phút', 'Để dây kháng lực nhỏ ở bàn', 'Tạo góc đứng làm việc 10–15 phút', 'Đặt nhắc "đi bộ 2 phút"'] },
  { area: 'Buổi tối', icon: '🌙', tips: ['Giảm đèn sau 21–22h', 'Sạc điện thoại ngoài phòng ngủ', 'Để sách giấy cạnh giường', 'Chuẩn bị quần áo ngày mai', 'Viết 3 việc ngày mai'] },
];

const C5_SCHEDULES = [
  {
    icon: '🌱', label: 'Người mới', freq: 'Mỗi 6–8 tuần hoặc khi có dấu hiệu mệt',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người mới thường cần 6–8 tuần mới tích lũy đủ fatigue để cần deload — cơ thể còn đang thích nghi nhanh.',
    detail: 'Ở giai đoạn người mới, cơ thể đang trải qua "newbie gains" — thích nghi nhanh với mọi kích thích tập luyện. Fatigue tích lũy chậm hơn, nên deload ít thường xuyên hơn. Tuy nhiên vẫn cần quan sát kỹ các dấu hiệu cơ thể, đặc biệt là giấc ngủ và cảm giác hồi phục.',
    details: [
      'Tập 6–8 tuần liên tục trước khi lên kế hoạch deload đầu tiên — cơ thể cần thời gian thích nghi.',
      'Ưu tiên deload theo tín hiệu cơ thể hơn theo lịch cứng: ngủ kém, đau mỏi kéo dài, mất động lực.',
      'Tuần deload người mới: giảm 30–40% volume tổng (số hiệp × số bài), giữ nguyên kỹ thuật.',
      'Tránh hoàn toàn bỏ tập — deload chủ động giúp duy trì thói quen và thần kinh-cơ.',
      'Sau deload, người mới thường cảm nhận rõ sự khác biệt: cảm giác nhẹ nhàng hơn và tập được nặng hơn tuần trước.',
      'Ghi chép lại tuần deload và kết quả tuần tiếp theo để xây dựng pattern phù hợp với cơ thể bạn.',
    ],
    points: [
      { icon: '📅', label: 'Chu kỳ 6–8 tuần', note: 'Hoặc sớm hơn khi có dấu hiệu fatigue' },
      { icon: '🌿', label: 'Giảm 30–40% volume', note: 'Nhẹ nhàng, giữ nguyên kỹ thuật' },
      { icon: '👂', label: 'Lắng nghe cơ thể', note: 'Tín hiệu quan trọng hơn lịch cứng' },
      { icon: '📝', label: 'Ghi chép tiến trình', note: 'Xây dựng pattern cá nhân theo thời gian' },
    ],
  },
  {
    icon: '💪', label: 'Trung bình', freq: 'Mỗi 4–6 tuần, giảm 10–20% volume',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1517963879433-6ad2a56fcd82?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người tập trung bình tích lũy fatigue nhanh hơn — cần deload mỗi 4–6 tuần để duy trì tiến bộ dài hạn.',
    detail: 'Ở trình độ trung bình, cơ thể đã thích nghi và cần kích thích cao hơn để tiến bộ — điều này đồng nghĩa với việc fatigue tích lũy nhanh hơn. Deload 4–6 tuần/lần là cửa sổ tối ưu để duy trì momentum mà không bị overtrain.',
    details: [
      'Lên lịch deload cố định mỗi 4 tuần (người tập 4–5 ngày/tuần) hoặc 6 tuần (3 ngày/tuần).',
      'Giảm 10–20% volume: nếu tuần bình thường có 20 set/nhóm cơ, tuần deload còn 16–18 set.',
      'Giữ cường độ (% 1RM) ở mức 60–70% — đủ để duy trì strength mà không gây thêm fatigue.',
      'Kết hợp giảm cardio: từ 3–4 buổi/tuần xuống 2 buổi, chuyển sang Zone 1–2.',
      'Người tập trung bình nên dùng tuần deload để tập trung vào kỹ thuật và mobility.',
      'Theo dõi hiệu suất: nếu sau deload không thấy cải thiện, xem xét kéo dài deload thêm 1 tuần.',
    ],
    points: [
      { icon: '📅', label: 'Chu kỳ 4–6 tuần', note: 'Tùy số buổi tập/tuần của bạn' },
      { icon: '📉', label: 'Giảm 10–20% volume', note: 'Giữ cường độ ở 60–70% 1RM' },
      { icon: '🏃', label: 'Giảm cardio', note: 'Xuống Zone 1–2, bớt 1–2 buổi/tuần' },
      { icon: '🎯', label: 'Focus kỹ thuật', note: 'Tận dụng tuần nhẹ để cải thiện form' },
    ],
  },
  {
    icon: '🔥', label: 'Tập nhiều', freq: 'Mỗi 4–5 tuần, giảm 30–40% volume',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người tập nặng (5–6 ngày/tuần, volume cao) cần giảm 30–40% volume mỗi 4–5 tuần để tránh chronic fatigue.',
    detail: 'Người tập với volume và cường độ cao tích lũy systemic fatigue rất nhanh. Deload thường xuyên hơn (4–5 tuần) và sâu hơn (30–40% volume) là bắt buộc — không phải tùy chọn. Bỏ qua deload ở trình độ này dễ dẫn đến overtraining syndrome, chấn thương, hoặc plateau dài hạn.',
    details: [
      'Lên lịch deload cứng mỗi 4 tuần — không chờ dấu hiệu mệt vì thường nhận ra quá muộn.',
      'Giảm 30–40% tổng volume: từ 25–30 set/nhóm cơ/tuần xuống còn 15–18 set.',
      'Có thể kết hợp "full deload" (giảm cả volume lẫn cường độ) sau chu kỳ peaking hoặc thi đấu.',
      'Hệ miễn dịch ở người tập nặng thường bị ức chế — tuần deload là thời gian để phục hồi miễn dịch.',
      'Ưu tiên ngủ 8–9 tiếng, massage, sauna (nếu có), và tăng lượng carb nạp vào trong tuần deload.',
      'Người tập nặng nên có 2–3 "micro-deload" (1 buổi nhẹ) trong chu kỳ 4 tuần để quản lý fatigue chủ động.',
    ],
    points: [
      { icon: '📅', label: 'Chu kỳ 4–5 tuần', note: 'Deload cứng, không chờ dấu hiệu mệt' },
      { icon: '📊', label: 'Giảm 30–40% volume', note: 'Sâu hơn người tập ít — bắt buộc, không tùy chọn' },
      { icon: '🛡️', label: 'Phục hồi miễn dịch', note: 'Tập nặng ức chế miễn dịch — deload tái lập' },
      { icon: '🍚', label: 'Tăng carb nạp vào', note: 'Nạp lại glycogen cơ trong tuần nhẹ' },
    ],
  },
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

// ─── C1StepModal ─────────────────────────────────────────────────────────────

function C1StepModal({ step, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  const { color, rgb } = step;

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
          <img src={step.img} alt={step.title} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
              {step.icon}
            </div>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color, background: `rgba(${rgb},0.2)`, border: `1px solid rgba(${rgb},0.35)` }}>
              Bước {step.step}
            </span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color }}>{step.title}</h2>
          <p className="text-sm mb-4" style={{ color: `rgba(${rgb},0.7)` }}>{step.detail}</p>

          {/* Key fact */}
          <div className="rounded-2xl px-4 py-3 mb-6 flex items-start gap-3"
            style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <span className="text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm leading-relaxed" style={{ color: `rgba(${rgb},0.9)` }}>{step.keyFact}</p>
          </div>

          {/* Numbered details */}
          <ul className="space-y-3 mb-8">
            {step.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {step.points.map((pt, pi) => (
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
            >← Bước trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Bước {idx + 1} / {C1_STEPS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Bước sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ─── StandUpModal ─────────────────────────────────────────────────────────────

const STANDUP_COLOR = '#10b981';
const STANDUP_RGB   = '16,185,129';
const STANDUP_DATA  = {
  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
  keyFact: 'Ngồi liên tục >8 giờ/ngày làm tăng nguy cơ bệnh tim mạch, tiểu đường type 2 và tử vong sớm — độc lập với việc bạn có tập gym hay không.',
  detail: 'Đứng dậy 2 phút mỗi 45–60 phút không phải là "nghỉ giải lao" — đây là cơ chế sinh lý để chống lại tác hại của tư thế ngồi kéo dài lên trao đổi chất và tuần hoàn.',
  details: [
    'Ngồi tắt tắt hoạt động của enzyme lipoprotein lipase (LPL) — enzyme quan trọng để đốt mỡ. Chỉ cần đứng lên và di chuyển 2 phút là kích hoạt lại LPL.',
    'Sau 20–30 phút ngồi bất động, lưu lượng máu đến não giảm nhẹ — đây là lý do bạn cảm thấy "mơ màng" và khó tập trung sau một lúc làm việc liên tục.',
    'Nghiên cứu tại ĐH Utah (2015): thay thế 2 phút ngồi bằng đi bộ nhẹ mỗi giờ giảm nguy cơ tử vong 33% so với nhóm ngồi liên tục.',
    'Calf raise (kiễng gót) đặc biệt hiệu quả khi đứng tại chỗ — cơ bắp chân hoạt động như "máy bơm thứ hai" giúp máu trở về tim từ chân.',
    'Không nhất thiết phải rời bàn — đứng lên xoay vai, vươn người, nghiêng cổ trái/phải 30 giây cũng đủ ngắt chu kỳ ngồi và kích hoạt lại tuần hoàn.',
    'Đặt báo thức 45 phút là cách đơn giản nhất để tạo thói quen này. Sau 2–3 tuần cơ thể tự "cảm thấy cần đứng dậy" mà không cần nhắc.',
  ],
  points: [
    { icon: '⏱️', label: 'Mỗi 45–60 phút', note: 'Đứng dậy tối thiểu 2 phút' },
    { icon: '🦵', label: 'Calf raise', note: 'Máy bơm thứ hai cho tuần hoàn' },
    { icon: '🔔', label: 'Đặt báo thức', note: 'Tự động hóa thói quen đứng dậy' },
    { icon: '🧠', label: 'Reset máu não', note: 'Giảm mơ màng, tăng tập trung' },
  ],
};

function StandUpModal({ onClose }) {
  const d = STANDUP_DATA;
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${STANDUP_RGB},0.28)`, boxShadow: `0 0 80px rgba(${STANDUP_RGB},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={d.img} alt="Quy tắc đứng dậy" className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${STANDUP_RGB},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${STANDUP_COLOR}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: `rgba(${STANDUP_RGB},0.18)`, border: `2px solid rgba(${STANDUP_RGB},0.45)` }}>⏱</div>
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: STANDUP_COLOR, background: `rgba(${STANDUP_RGB},0.2)`, border: `1px solid rgba(${STANDUP_RGB},0.35)` }}>
              Quy tắc NEAT
            </span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: STANDUP_COLOR }}>Quy Tắc Đứng Dậy 2 Phút</h2>
          <p className="text-sm mb-4" style={{ color: `rgba(${STANDUP_RGB},0.7)` }}>{d.detail}</p>

          <div className="rounded-2xl px-4 py-3 mb-6 flex items-start gap-3"
            style={{ background: `rgba(${STANDUP_RGB},0.08)`, border: `1px solid rgba(${STANDUP_RGB},0.2)` }}>
            <span className="text-lg shrink-0 mt-0.5">💡</span>
            <p className="text-sm leading-relaxed" style={{ color: `rgba(${STANDUP_RGB},0.9)` }}>{d.keyFact}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {d.details.map((det, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${STANDUP_RGB},0.14)`, color: STANDUP_COLOR }}>{i + 1}</span>
                <span>{det}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {d.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${STANDUP_RGB},0.06)`, border: `1px solid rgba(${STANDUP_RGB},0.15)` }}>
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

// ─── Main component ────────────────────────────────────────────────────────────

export default function PillarC() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarC', { returnObjects: true });
  const [activeTab, setActiveTab] = useState('c1');
  const [c0Idx, setC0Idx] = useState(null);
  const [c1Idx, setC1Idx] = useState(null);
  const [c2EnergyIdx, setC2EnergyIdx] = useState(null);
  const [c3LevelIdx, setC3LevelIdx] = useState(null);
  const [standUpOpen, setStandUpOpen] = useState(false);
  const [c4RoutineIdx, setC4RoutineIdx] = useState(null);
  const [c5MethodIdx, setC5MethodIdx] = useState(null);
  const [c5ScheduleIdx, setC5ScheduleIdx] = useState(null);
  const [c6ProtocolIdx, setC6ProtocolIdx] = useState(null);
  const [c6TechIdx, setC6TechIdx] = useState(null);
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
                  {C1_STEPS.map((s, i) => (
                    <div
                      key={s.step}
                      role="button"
                      tabIndex={0}
                      onClick={() => setC1Idx(i)}
                      onKeyDown={e => e.key === 'Enter' && setC1Idx(i)}
                      className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5"
                      style={{ background: `rgba(${s.rgb},0.05)`, border: `1px solid rgba(${s.rgb},0.15)` }}
                    >
                      <span className="text-3xl shrink-0">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text text-lg">Bước {s.step}: {s.title}</div>
                        <div className="text-muted text-base mt-1 leading-relaxed">{s.desc}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                        Chi tiết
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setC2EnergyIdx(i)}
                      onKeyDown={e => e.key === 'Enter' && setC2EnergyIdx(i)}
                      className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5"
                      style={{ background: `rgba(${t.rgb},0.05)`, border: `1px solid rgba(${t.rgb},0.15)` }}
                    >
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text text-lg">{t.label}</div>
                        <div className="text-muted text-base mt-0.5">{t.desc}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.color }}>
                        Chi tiết
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setC3LevelIdx(i)}
                      onKeyDown={e => e.key === 'Enter' && setC3LevelIdx(i)}
                      className="group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5"
                      style={{ background: `rgba(${l.rgb},0.06)`, border: `1px solid rgba(${l.rgb},0.18)` }}
                    >
                      <span className="text-lg font-semibold text-text">{l.level}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold tabular-nums" style={{ color: l.color }}>{l.steps}</span>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" style={{ color: l.color }}><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setStandUpOpen(true)}
                  onKeyDown={e => e.key === 'Enter' && setStandUpOpen(true)}
                  className="group p-4 rounded-xl mb-6 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-lg font-bold" style={{ color: '#10b981' }}>⏱ Quy tắc đứng dậy 2 phút</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#10b981' }}>
                      Chi tiết
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                    </span>
                  </div>
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
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => setC4RoutineIdx(i)}
                      onKeyDown={e => e.key === 'Enter' && setC4RoutineIdx(i)}
                      className="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5"
                      style={{ background: `rgba(${r.rgb},0.05)`, border: `1px solid rgba(${r.rgb},0.15)` }}
                    >
                      <span className="text-base font-bold tabular-nums w-20 shrink-0" style={{ color: r.color }}>{r.duration}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-semibold text-text">{r.exercise}</div>
                        <div className="text-base text-muted">{r.note}</div>
                      </div>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: r.color }}><path d="M3 8h10M9 4l4 4-4 4"/></svg>
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
                    <div
                      key={i}
                      className="flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{ background: `rgba(${m.rgb},0.06)`, border: `1px solid rgba(${m.rgb},0.15)` }}
                      onClick={() => setC5MethodIdx(i)}
                    >
                      <span className="text-3xl shrink-0">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text text-lg" style={{ color: m.color }}>{m.label}</div>
                        <div className="text-muted text-base mt-0.5">{m.desc}</div>
                      </div>
                      <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60" style={{ color: m.color, background: `rgba(${m.rgb},0.1)` }}>Chi tiết →</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#f97316' }}>Lịch Deload Theo Trình Độ</h3>
                <div className="space-y-2">
                  {C5_SCHEDULES.map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{ background: `rgba(${row.rgb},0.06)`, border: `1px solid rgba(${row.rgb},0.15)` }}
                      onClick={() => setC5ScheduleIdx(i)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{row.icon}</span>
                        <span className="font-semibold text-lg" style={{ color: row.color }}>{row.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted text-base text-right">{row.freq}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg opacity-60 shrink-0" style={{ color: row.color, background: `rgba(${row.rgb},0.1)` }}>→</span>
                      </div>
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
                <div className="grid gap-3 mb-6">
                  {C6_TECHNIQUES.map((t, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{ background: `rgba(${t.rgb},0.06)`, border: `1px solid rgba(${t.rgb},0.18)` }}
                      onClick={() => setC6TechIdx(i)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{t.icon}</span>
                          <span className="font-bold text-lg" style={{ color: t.color }}>{t.name}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg opacity-60" style={{ color: t.color, background: `rgba(${t.rgb},0.12)` }}>Chi tiết →</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {t.steps.split(' • ').map((step, si) => (
                          <div key={si} className="flex items-center gap-1.5 text-base">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background: t.color, color: 'black' }}>{si + 1}</span>
                            <span className="text-text">{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 text-sm text-muted mt-2 flex-wrap">
                        <span>⏱ {t.time}</span>
                        <span>• {t.use}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#0ea5e9' }}>Protocol theo tình huống</h3>
                <div className="space-y-2">
                  {C6_PROTOCOLS.map((p, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{ background: `rgba(${p.rgb},0.06)`, border: `1px solid rgba(${p.rgb},0.15)` }}
                      onClick={() => setC6ProtocolIdx(i)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <span className="text-muted text-base">{p.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base text-right" style={{ color: p.color }}>{p.brief}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg opacity-60 shrink-0" style={{ color: p.color, background: `rgba(${p.rgb},0.1)` }}>→</span>
                      </div>
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

      {/* ── C6 technique modal ── */}
      {c6TechIdx !== null && (
        <C0ItemModal
          item={C6_TECHNIQUES[c6TechIdx]}
          idx={c6TechIdx}
          onClose={() => setC6TechIdx(null)}
          onPrev={() => setC6TechIdx(i => Math.max(0, i - 1))}
          onNext={() => setC6TechIdx(i => Math.min(C6_TECHNIQUES.length - 1, i + 1))}
          hasPrev={c6TechIdx > 0}
          hasNext={c6TechIdx < C6_TECHNIQUES.length - 1}
        />
      )}

      {/* ── C6 breathing protocol modal ── */}
      {c6ProtocolIdx !== null && (
        <C0ItemModal
          item={C6_PROTOCOLS[c6ProtocolIdx]}
          idx={c6ProtocolIdx}
          onClose={() => setC6ProtocolIdx(null)}
          onPrev={() => setC6ProtocolIdx(i => Math.max(0, i - 1))}
          onNext={() => setC6ProtocolIdx(i => Math.min(C6_PROTOCOLS.length - 1, i + 1))}
          hasPrev={c6ProtocolIdx > 0}
          hasNext={c6ProtocolIdx < C6_PROTOCOLS.length - 1}
        />
      )}

      {/* ── C5 deload schedule modal ── */}
      {c5ScheduleIdx !== null && (
        <C0ItemModal
          item={C5_SCHEDULES[c5ScheduleIdx]}
          idx={c5ScheduleIdx}
          onClose={() => setC5ScheduleIdx(null)}
          onPrev={() => setC5ScheduleIdx(i => Math.max(0, i - 1))}
          onNext={() => setC5ScheduleIdx(i => Math.min(C5_SCHEDULES.length - 1, i + 1))}
          hasPrev={c5ScheduleIdx > 0}
          hasNext={c5ScheduleIdx < C5_SCHEDULES.length - 1}
        />
      )}

      {/* ── C5 deload method modal ── */}
      {c5MethodIdx !== null && (
        <C0ItemModal
          item={C5_METHODS[c5MethodIdx]}
          idx={c5MethodIdx}
          onClose={() => setC5MethodIdx(null)}
          onPrev={() => setC5MethodIdx(i => Math.max(0, i - 1))}
          onNext={() => setC5MethodIdx(i => Math.min(C5_METHODS.length - 1, i + 1))}
          hasPrev={c5MethodIdx > 0}
          hasNext={c5MethodIdx < C5_METHODS.length - 1}
        />
      )}

      {/* ── C4 recovery routine modal ── */}
      {c4RoutineIdx !== null && (
        <C0ItemModal
          item={C4_ROUTINE[c4RoutineIdx]}
          idx={c4RoutineIdx}
          onClose={() => setC4RoutineIdx(null)}
          onPrev={() => setC4RoutineIdx(i => Math.max(0, i - 1))}
          onNext={() => setC4RoutineIdx(i => Math.min(C4_ROUTINE.length - 1, i + 1))}
          hasPrev={c4RoutineIdx > 0}
          hasNext={c4RoutineIdx < C4_ROUTINE.length - 1}
        />
      )}

      {/* ── Stand-up rule modal ── */}
      {standUpOpen && <StandUpModal onClose={() => setStandUpOpen(false)} />}

      {/* ── C3 level modal — reuses C0ItemModal (same data shape) ── */}
      {c3LevelIdx !== null && (
        <C0ItemModal
          item={C3_LEVELS[c3LevelIdx]}
          idx={c3LevelIdx}
          onClose={() => setC3LevelIdx(null)}
          onPrev={() => setC3LevelIdx(i => Math.max(0, i - 1))}
          onNext={() => setC3LevelIdx(i => Math.min(C3_LEVELS.length - 1, i + 1))}
          hasPrev={c3LevelIdx > 0}
          hasNext={c3LevelIdx < C3_LEVELS.length - 1}
        />
      )}

      {/* ── C2 energy tips modal — reuses C0ItemModal (same data shape) ── */}
      {c2EnergyIdx !== null && (
        <C0ItemModal
          item={C2_ENERGY_TIPS[c2EnergyIdx]}
          idx={c2EnergyIdx}
          onClose={() => setC2EnergyIdx(null)}
          onPrev={() => setC2EnergyIdx(i => Math.max(0, i - 1))}
          onNext={() => setC2EnergyIdx(i => Math.min(C2_ENERGY_TIPS.length - 1, i + 1))}
          hasPrev={c2EnergyIdx > 0}
          hasNext={c2EnergyIdx < C2_ENERGY_TIPS.length - 1}
        />
      )}

      {/* ── C1 step modal — outside all RevealBlocks so position:fixed works ── */}
      {c1Idx !== null && (
        <C1StepModal
          step={C1_STEPS[c1Idx]}
          idx={c1Idx}
          onClose={() => setC1Idx(null)}
          onPrev={() => setC1Idx(i => Math.max(0, i - 1))}
          onNext={() => setC1Idx(i => Math.min(C1_STEPS.length - 1, i + 1))}
          hasPrev={c1Idx > 0}
          hasNext={c1Idx < C1_STEPS.length - 1}
        />
      )}
    </div>
  );
}
