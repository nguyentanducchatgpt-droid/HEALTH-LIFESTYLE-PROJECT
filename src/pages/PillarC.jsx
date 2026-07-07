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
  {
    label: 'Ngủ ≥ 7 giờ hoặc cải thiện', pts: 20,
    icon: '😴', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    detail: 'Tiêu chí quan trọng nhất trong Lifestyle Score — ngủ đủ giờ là nền tảng cho mọi cải thiện sức khỏe khác.',
    keyFact: 'Chỉ 1 đêm ngủ dưới 6 tiếng làm giảm 40% khả năng ghi nhớ và tăng cortisol 37% hôm sau — ảnh hưởng lan đến cả dinh dưỡng, vận động và tâm lý.',
    details: [
      'Mục tiêu tối thiểu là 7 giờ — không phải 8 giờ. Nhiều nghiên cứu cho thấy 7–9 giờ là khoảng tối ưu cho người trưởng thành, và 7 giờ là ngưỡng đủ để hầu hết chức năng nhận thức hoạt động bình thường.',
      '"Hoặc cải thiện" nghĩa là nếu trước đây bạn ngủ 5 tiếng và nay tăng lên 6 tiếng, bạn vẫn được điểm — tiến bộ quan trọng hơn hoàn hảo ngay lập tức.',
      'Chất lượng > số lượng: 7 giờ ngủ sâu liên tục tốt hơn 9 giờ ngủ gián đoạn. Hai chỉ số thực tế cần quan sát: (1) tỉnh dậy tự nhiên không cần báo thức, (2) không buồn ngủ trước 2pm.',
      'Thiếu ngủ mạn tính (dưới 6 giờ liên tục nhiều tuần) liên kết với tăng nguy cơ tiểu đường type 2, béo phì, bệnh tim mạch và rối loạn tâm lý — ngay cả khi cảm giác "quen rồi".',
      'Ngủ bù cuối tuần không xóa được nợ ngủ tích lũy trong tuần — chỉ giúp một phần chức năng nhận thức phục hồi nhưng không phục hồi được tổn thương trao đổi chất và miễn dịch.',
      'Chiến lược đơn giản nhất: cố định giờ thức dậy trước, rồi điều chỉnh giờ đi ngủ dần dần — não sẽ tự điều chỉnh chu kỳ ngủ xung quanh giờ thức cố định.',
    ],
    points: [
      { icon: '🎯', label: 'Mục tiêu', note: '7–9 giờ/đêm cho người trưởng thành' },
      { icon: '📈', label: 'Tiến bộ', note: 'Tăng dần từng 30 phút mỗi tuần' },
      { icon: '⏰', label: 'Cố định giờ thức', note: 'Quan trọng hơn giờ đi ngủ' },
      { icon: '🔋', label: 'Tỉnh táo 2pm', note: 'Dấu hiệu bạn ngủ đủ giấc' },
    ],
  },
  {
    label: 'Giờ ngủ tương đối ổn định', pts: 15,
    icon: '🕙', color: '#0d9488', rgb: '13,148,136',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80&auto=format&fit=crop',
    detail: 'Nhất quán về thời điểm ngủ quan trọng hơn số giờ ngủ — đồng hồ sinh học cần được neo vào một lịch trình đều đặn.',
    keyFact: 'Thay đổi giờ ngủ hơn 90 phút giữa ngày thường và cuối tuần (social jet lag) có cùng tác động tiêu cực lên trao đổi chất như bay qua 1–2 múi giờ mỗi tuần.',
    details: [
      '"Tương đối ổn định" có nghĩa lệch không quá 60 phút giữa các ngày — không cần chính xác từng phút nhưng cần có khung cố định để não dự đoán được và chuẩn bị cho giấc ngủ.',
      'Đồng hồ sinh học (circadian rhythm) điều phối hơn 20.000 gen và hàng trăm hormone theo chu kỳ 24 giờ — khi lịch ngủ không đều, tất cả các chu kỳ này bị lệch pha và hoạt động kém hiệu quả.',
      'Cuối tuần ngủ muộn hơn 2 tiếng so với ngày thường tạo ra "social jet lag" — làm giảm độ nhạy insulin, tăng cảm giác thèm ăn đồ ngọt và béo vào Thứ Hai.',
      'Chiến lược: đặt báo thức "đi ngủ" (không chỉ báo thức dậy) 30 phút trước giờ ngủ mục tiêu — gợi ý não bắt đầu quá trình wind-down mỗi ngày ở cùng một thời điểm.',
      'Ánh sáng buổi sáng là "neo" mạnh nhất để cố định nhịp circadian — 10–15 phút ánh sáng tự nhiên sau khi thức dậy đặt lại đồng hồ sinh học hiệu quả hơn bất kỳ supplement nào.',
      'Nếu bạn phải ngủ muộn hơn 1 tiếng trong 1 ngày: giữ nguyên giờ thức dậy (không ngủ bù), chấp nhận buổi sáng hơi mệt, và tối hôm đó cơ thể sẽ tự điều chỉnh về đúng lịch.',
    ],
    points: [
      { icon: '🔄', label: 'Lệch ≤ 60 phút', note: 'Ngưỡng an toàn giữa các ngày' },
      { icon: '📅', label: 'Cuối tuần', note: 'Không ngủ muộn hơn 90 phút' },
      { icon: '☀️', label: 'Ánh sáng sáng', note: 'Neo nhịp sinh học mạnh nhất' },
      { icon: '⏰', label: 'Báo thức đi ngủ', note: 'Nhắc wind-down đúng giờ' },
    ],
  },
  {
    label: 'Có ánh sáng/vận động sáng', pts: 15,
    icon: '🌅', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    detail: 'Hai tín hiệu mạnh nhất để đặt lại đồng hồ sinh học mỗi sáng — kết hợp cho hiệu quả cộng hưởng.',
    keyFact: 'Tiếp xúc ánh sáng mặt trời trong 30–60 phút đầu sau khi thức dậy ức chế hoàn toàn melatonin ban ngày và tăng cortisol theo nhịp tự nhiên — thiết lập nền tảng cho năng lượng ổn định cả ngày.',
    details: [
      'Ánh sáng tự nhiên buổi sáng kích hoạt tế bào ipRGC trong mắt — gửi tín hiệu trực tiếp đến suprachiasmatic nucleus (SCN), đồng hồ trung tâm của não để bắt đầu đếm ngược 14–16 giờ đến giờ ngủ.',
      'Cường độ cần thiết: 1.000–10.000 lux (ánh sáng ngoài trời), so với chỉ 100–500 lux trong nhà với đèn LED thông thường — đây là lý do tại sao ngồi cạnh cửa sổ không đủ thay thế 10 phút ra ngoài.',
      'Vận động sáng (5–15 phút đi bộ, stretching, hoặc light cardio) tăng nhiệt độ lõi cơ thể và dopamine — hai tín hiệu tỉnh thức mạnh hơn caffeine mà không gây rebound mệt mỏi buổi chiều.',
      'Không có mặt trời (ngày mưa/mùa đông): đèn therapy light 10.000 lux 10–20 phút, hoặc ánh sáng trời mây (vẫn khoảng 1.000–5.000 lux ngoài trời, cao hơn trong nhà nhiều lần).',
      'Kết hợp lý tưởng: đi bộ 10 phút ngoài trời ngay sau khi thức dậy — vừa ánh sáng, vừa vận động, vừa kích hoạt nhiệt độ cơ thể. Ba tín hiệu circadian cùng một lúc.',
      'Tránh kính râm trong 10–15 phút đầu ra ngoài — kính lọc ánh sáng UV cần thiết để kích hoạt phản xạ đồng hồ sinh học qua mắt.',
    ],
    points: [
      { icon: '☀️', label: '10 phút ra ngoài', note: 'Tốt hơn 1 giờ cạnh cửa sổ' },
      { icon: '🏃', label: 'Vận động nhẹ', note: 'Đi bộ hoặc stretching 5–15 phút' },
      { icon: '👓', label: 'Không kính râm', note: '10 phút đầu để nhận ánh sáng' },
      { icon: '💡', label: 'Mưa/mây', note: 'Vẫn ra ngoài hoặc đèn 10.000 lux' },
    ],
  },
  {
    label: 'Số bước / NEAT đạt mục tiêu', pts: 15,
    icon: '🚶', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80&auto=format&fit=crop',
    detail: 'NEAT (Non-Exercise Activity Thermogenesis) — năng lượng đốt từ mọi vận động ngoài tập luyện — có thể chiếm 15–50% tổng năng lượng tiêu thụ mỗi ngày.',
    keyFact: 'Người có công việc hoạt động đốt hơn người ngồi bàn giấy 2.000 kcal/ngày chỉ qua NEAT — tương đương chạy marathon mỗi ngày mà không cần tập gym.',
    details: [
      '7.000–10.000 bước/ngày là mục tiêu hợp lý cho hầu hết người lớn không vận động chuyên nghiệp. Dưới 5.000 bước/ngày được phân loại là "sedentary" và liên kết với nguy cơ bệnh chuyển hóa cao.',
      'NEAT không chỉ là số bước: đứng lên 2 phút mỗi giờ, cầu thang thay thang máy, đứng khi nói chuyện điện thoại, đi bộ ngắn sau bữa ăn — tất cả cộng dồn thành năng lượng đốt đáng kể.',
      '"Đạt mục tiêu" không cần 10.000 bước mỗi ngày — mục tiêu cá nhân hóa: nếu baseline của bạn là 3.000 bước, mục tiêu 5.000 là phù hợp và tăng dần 500–1.000 bước mỗi tuần.',
      'Đi bộ sau bữa ăn 10–15 phút đặc biệt hiệu quả: giảm đỉnh glucose sau ăn 30–50%, tăng insulin sensitivity và giảm cảm giác nặng bụng — đây là NEAT hiệu quả nhất theo giờ thực hiện.',
      'Tracker bước chân (điện thoại, đồng hồ thông minh) tăng số bước trung bình 26% theo meta-analysis — đơn giản là việc đo lường tạo ra động lực thay đổi hành vi.',
      'Nếu một ngày đặc biệt ít bước (dưới 3.000): 5 phút squat, lunges, calf raise hoặc marching tại chỗ trước khi ngủ để kích hoạt cơ và trao đổi chất — không thay thế được nhưng giảm thiểu tác động tiêu cực.',
    ],
    points: [
      { icon: '👟', label: '7.000–10.000 bước', note: 'Mục tiêu hợp lý phần lớn người' },
      { icon: '🍽️', label: 'Đi bộ sau ăn', note: 'NEAT hiệu quả nhất theo giờ' },
      { icon: '📱', label: 'Dùng tracker', note: 'Tăng bước đi 26% tự nhiên' },
      { icon: '🪜', label: 'Cầu thang > thang máy', note: 'NEAT cộng dồn mỗi ngày' },
    ],
  },
  {
    label: 'Không ngồi quá lâu liên tục', pts: 10,
    icon: '🪑', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    detail: 'Ngồi liên tục hơn 60–90 phút là hành vi có hại riêng biệt — không thể được "bù đắp" bằng tập gym 1 tiếng sau đó.',
    keyFact: '"Sitting is the new smoking" — ngồi liên tục >90 phút làm tăng nguy cơ bệnh chuyển hóa, ngay cả ở người tập gym thường xuyên. Đứng dậy 2–3 phút mỗi 60 phút đủ để đảo ngược phần lớn tác hại này.',
    details: [
      'Ngồi lâu gây ức chế lipoprotein lipase (LPL) — enzyme đốt mỡ trong cơ bắp. Sau 60 phút ngồi bất động, LPL giảm 90% hoạt động, và huyết đường + triglyceride bắt đầu tăng dần.',
      'Quy tắc 60 phút: đứng dậy, di chuyển tối thiểu 2–3 phút sau mỗi 60 phút ngồi. Không cần bài tập — chỉ cần đứng, đi lấy nước, vươn vai, hoặc đi vệ sinh là đủ để kích hoạt lại LPL.',
      'Nguy cơ độc lập: nghiên cứu trên 800.000 người cho thấy ngồi nhiều nhất (>8h/ngày) có nguy cơ tử vong cao hơn 73% so với nhóm ít ngồi nhất — ngay cả sau khi điều chỉnh yếu tố tập luyện.',
      'Công cụ đơn giản: đặt timer 50 phút (Pomodoro kết hợp đứng dậy), dùng standing desk xen kẽ ngồi, hoặc đặt cốc nước nhỏ để buộc phải đứng dậy lấy nước nhiều hơn.',
      'Sau bữa ăn đặc biệt quan trọng: ngồi ngay sau ăn kéo dài đỉnh glucose sau ăn và tăng tích trữ mỡ. 10 phút đứng hoặc đi nhẹ sau ăn cải thiện đáng kể phản ứng insulin.',
      'Standing desk không đủ nếu đứng bất động: cần xen kẽ ngồi-đứng (không đứng >2h liên tục) và thêm vận động nhỏ khi đứng — lắc chân, chuyển trọng tâm, squat nhỏ.',
    ],
    points: [
      { icon: '⏱️', label: 'Quy tắc 60 phút', note: 'Đứng dậy 2–3 phút mỗi giờ' },
      { icon: '💧', label: 'Cốc nước nhỏ', note: 'Buộc đứng dậy tự nhiên nhiều hơn' },
      { icon: '🍽️', label: 'Đứng sau ăn', note: '10 phút giảm đỉnh glucose' },
      { icon: '📊', label: 'Độc lập với gym', note: 'Tập gym không bù được ngồi nhiều' },
    ],
  },
  {
    label: 'Có phục hồi/mobility/thở', pts: 15,
    icon: '🧘', color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    detail: 'Phục hồi chủ động, mobility và thở có chủ đích — ba trụ cột để hệ thần kinh tự trị chuyển sang chế độ parasympathetic và cơ thể thực sự hồi phục.',
    keyFact: 'HRV (Heart Rate Variability) — chỉ số phục hồi thần kinh — tăng 18% sau 10 phút thở có chủ đích so với nghỉ ngơi thụ động cùng thời gian. Phục hồi chủ động hiệu quả gấp đôi phục hồi thụ động.',
    details: [
      'Phục hồi chủ động: 10 phút foam rolling, nhẹ nhàng di chuyển các khớp, hoặc yoga nhẹ — kích thích lưu thông máu đến cơ bắp mà không tạo thêm stress sinh lý, đẩy nhanh loại bỏ lactate và chất thải trao đổi chất.',
      'Mobility không phải stretching đơn thuần: là khả năng kiểm soát chủ động phạm vi vận động của khớp. Ít nhất 5 phút mobility động (dynamic mobility) mỗi ngày duy trì chức năng khớp tốt hơn stretching tĩnh kéo dài.',
      'Thở có chủ đích: thở 4-7-8 (hít 4 giây, giữ 7 giây, thở ra 8 giây) kích hoạt phó giao cảm trong 3–5 phút, giảm cortisol và nhịp tim. Box breathing (4-4-4-4) đặc biệt hiệu quả sau stress cao điểm.',
      'Thời điểm tối ưu: ngay trước khi ngủ (5–10 phút) giúp chuyển tiếp từ trạng thái tỉnh táo sang buồn ngủ hiệu quả hơn nhiều so với nằm nhìn điện thoại; sau khi thức dậy để thiết lập tone thần kinh cho cả ngày.',
      'Tối thiểu đủ điểm: 10 phút/ngày bất kỳ kết hợp nào của ba yếu tố trên. Không cần hoàn hảo — 5 phút stretching + 5 phút thở đã đủ để kích hoạt phản ứng parasympathetic có thể đo được.',
      'Tín hiệu thiếu phục hồi: cơ bắp căng cứng mạn tính, nhịp tim nghỉ cao hơn bình thường, khó đi vào giấc ngủ, cáu kỉnh không rõ lý do — đây là dấu hiệu hệ thần kinh giao cảm đang chiếm ưu thế.',
    ],
    points: [
      { icon: '🫁', label: 'Thở 4-7-8', note: 'Kích hoạt phó giao cảm trong 5 phút' },
      { icon: '🔄', label: 'Dynamic mobility', note: 'Tốt hơn static stretching' },
      { icon: '🌙', label: 'Trước khi ngủ', note: '10 phút giúp chuyển tiếp hiệu quả' },
      { icon: '📈', label: 'HRV +18%', note: 'So với nghỉ ngơi thụ động' },
    ],
  },
  {
    label: 'Giảm màn hình/caffeine tối', pts: 10,
    icon: '🌙', color: '#818cf8', rgb: '129,140,248',
    img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80&auto=format&fit=crop',
    detail: 'Hai tác nhân phổ biến nhất phá vỡ chất lượng giấc ngủ — ánh sáng xanh từ màn hình và caffeine tồn tại trong cơ thể lâu hơn bạn nghĩ.',
    keyFact: 'Caffeine có half-life 5–7 giờ trong cơ thể — một ly cà phê lúc 3pm vẫn còn 50% trong máu lúc 8–10pm. Ánh sáng màn hình lúc 9pm ức chế melatonin đến 50% trong 1–2 giờ tiếp theo.',
    details: [
      'Caffeine half-life 5–7 giờ: nếu uống 200mg caffeine (2 espresso) lúc 2pm, lúc 9pm vẫn còn ~100mg "hoạt động". Ngưỡng ảnh hưởng giấc ngủ bắt đầu từ 80mg caffeine — nhiều người "thấy mình không nhạy caffeine" nhưng thực ra chất lượng giấc ngủ đang kém đi.',
      'Màn hình buổi tối: ánh sáng xanh (wavelength 480nm) ức chế melatonin hiệu quả nhất — chiều tối, màn hình điện thoại, laptop phát chủ yếu ánh sáng xanh và "lừa" não nghĩ vẫn còn ban ngày.',
      'Giải pháp thực tế màn hình: bật Night Mode/f.lux từ 6–7pm (giảm ánh sáng xanh), giảm độ sáng màn hình về 30–40% sau 8pm, hoặc đeo kính chặn ánh sáng xanh (amber-tinted) từ sau 9pm.',
      'Giải pháp caffeine: cut-off cứng lúc 1–2pm nếu bạn định ngủ lúc 10–11pm. Nếu cần caffeine buổi chiều, chọn trà xanh (ít caffeine hơn, có L-theanine chống anxiety) thay vì cà phê.',
      'Deceptive caffeine sources: trà xanh 30–50mg, trà đen 40–70mg, chocolate đen 25mg/30g, nước tăng lực 80–150mg — những nguồn này thường bị bỏ qua khi đếm lượng caffeine trong ngày.',
      'Không nhất thiết phải "zero screen" từ 8pm: đọc sách với đèn vàng, xem video với Night Mode, hoặc họp Zoom cuối ngày với độ sáng thấp vẫn tốt hơn nhiều so với lướt mạng với màn hình sáng rực.',
    ],
    points: [
      { icon: '☕', label: 'Cut-off 1–2pm', note: 'Half-life 5–7h vẫn ảnh hưởng tối' },
      { icon: '📱', label: 'Night Mode 6–7pm', note: 'Bật sớm hơn bạn nghĩ cần' },
      { icon: '🌕', label: 'Kính amber', note: 'Block ánh sáng xanh từ 9pm' },
      { icon: '🍫', label: 'Caffeine ẩn', note: 'Trà, chocolate đen, nước tăng lực' },
    ],
  },
];

const C0_TRACKS = [
  {
    label: 'Track Cơ Bản', icon: '🌱', color: '#14b8a6', rgb: '20,184,166',
    desc: 'Ngủ muộn, mệt mỏi, ít vận động',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    detail: 'Track dành cho người đang bắt đầu từ đầu — chưa có thói quen sức khỏe ổn định, năng lượng thấp hoặc thiếu ngủ mạn tính.',
    keyFact: 'Nghiên cứu cho thấy thay đổi 1 thói quen nền tảng (ngủ đúng giờ) có thể tự động cải thiện 3–4 thói quen khác mà không cần cố gắng — hiệu ứng domino của keystone habit.',
    details: [
      'Dành cho ai: ngủ muộn hơn 12am thường xuyên, thức dậy mệt mỏi, ít vận động (dưới 5.000 bước/ngày), năng lượng dao động lớn trong ngày, hoặc mới bắt đầu quan tâm đến sức khỏe.',
      'Ưu tiên số 1: cố định giờ thức dậy — đây là can thiệp đơn giản nhất có tác động lớn nhất. Không cần tập gym, không cần ăn kiêng — chỉ cần thức dậy cùng một giờ 7 ngày/tuần trong 2 tuần.',
      'Tuần 1–2: chỉ làm 1 việc — ra ngoài 10 phút mỗi sáng sau khi thức dậy. Kết hợp ánh sáng + vận động nhẹ + nhiệt độ không khí ngoài trời đủ để bắt đầu đặt lại circadian rhythm.',
      'Tuần 3–4: thêm quy tắc "không màn hình 30 phút trước ngủ". Đọc sách giấy, thiền nhẹ hoặc nghe audio êm — bất kỳ hoạt động nào không phát ánh sáng xanh vào mắt.',
      'Tuần 5–8: dần dần tăng bước chân (từ baseline +1.000 bước/tuần), thêm 10 phút stretching trước ngủ. Không thêm quá 1 thói quen mới mỗi 2 tuần để tránh overwhelm.',
      'Dấu hiệu sẵn sàng nâng lên Track Bận Rộn: ngủ 7+ giờ ≥5 ngày/tuần, thức dậy không cần báo thức đôi khi, năng lượng buổi sáng cải thiện rõ rệt so với trước.',
    ],
    points: [
      { icon: '⏰', label: 'Cố định giờ thức', note: 'Thay đổi 1 việc duy nhất đầu tiên' },
      { icon: '☀️', label: 'Ra ngoài 10 phút', note: 'Ánh sáng sáng — bước đầu tiên' },
      { icon: '📵', label: 'Không màn hình 30p', note: 'Trước khi ngủ — tuần 3–4' },
      { icon: '🌱', label: '1 thói quen/2 tuần', note: 'Không thêm quá nhiều cùng lúc' },
    ],
  },
  {
    label: 'Track Bận Rộn', icon: '⚡', color: '#f59e0b', rgb: '245,158,11',
    desc: 'Thiếu thời gian, làm việc nhiều, ngồi lâu',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    detail: 'Track dành cho người có lịch làm việc dày đặc — ưu tiên hiệu quả tối đa, can thiệp ngắn nhưng có tác động cao, tích hợp vào thói quen hiện có thay vì tạo thêm gánh nặng.',
    keyFact: 'Micro-habits (thói quen 2–5 phút) tích hợp vào lịch trình hiện có có tỷ lệ duy trì cao hơn 80% so với thói quen mới tốn thêm thời gian riêng — theo nghiên cứu về habit formation.',
    details: [
      'Dành cho ai: làm việc 8–12 giờ/ngày, ngồi bàn giấy phần lớn thời gian, khó sắp xếp lịch tập gym, thường bỏ bữa ăn hoặc ăn vội, năng lượng tốt nhưng phục hồi kém.',
      'Chiến lược cốt lõi: "habit stacking" — gắn thói quen sức khỏe vào việc đang làm. Cuộc họp đứng, đi bộ khi gọi điện, squat khi chờ cà phê pha — không cần thêm thời gian, chỉ thay đổi cách làm.',
      'Quy tắc 60 phút thiết yếu: timer nhắc đứng dậy 2–3 phút mỗi giờ — đây là ưu tiên số 1 cho người ngồi văn phòng. Dễ thực hiện nhất và tác động trao đổi chất lớn nhất theo giờ đầu tư.',
      'Tối ưu hóa bữa ăn: prep bữa trưa tối hôm trước (5 phút), có sẵn snack lành mạnh trong tầm tay, uống đủ nước bằng cách đặt chai nước lớn trên bàn thay vì cốc nhỏ.',
      'Recovery ngắn nhưng chất lượng: 5 phút box breathing sau 1 cuộc họp căng thẳng, 10 phút đi bộ sau bữa ăn trưa, stretching cổ vai gáy trong khi đọc email.',
      'Caffeine protocol cho người bận: không trước 90 phút sau thức dậy (cortisol tự nhiên cao nhất — caffeine vào lúc này ít hiệu quả), cut-off 1pm, không quá 400mg/ngày (2–4 ly cà phê).',
    ],
    points: [
      { icon: '🔗', label: 'Habit stacking', note: 'Gắn thói quen vào việc đang làm' },
      { icon: '⏱️', label: 'Timer 60 phút', note: 'Đứng dậy — ưu tiên số 1 văn phòng' },
      { icon: '🧘', label: '5 phút box breathing', note: 'Sau cuộc họp căng thẳng' },
      { icon: '☕', label: 'Caffeine 90p sau dậy', note: 'Hiệu quả hơn ngay khi thức dậy' },
    ],
  },
  {
    label: 'Track Tập Nhiều', icon: '💪', color: '#a855f7', rgb: '168,85,247',
    desc: 'Gym/chạy/đạp/bơi nhiều, cần phục hồi tốt hơn',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    detail: 'Track dành cho người tập luyện cường độ cao thường xuyên — vấn đề không phải thiếu vận động mà là thiếu phục hồi, dẫn đến cao nguyên hoặc chấn thương.',
    keyFact: 'Phục hồi không phải "không làm gì" — là quá trình chủ động. Người tập nhiều mà không đầu tư vào recovery thường đạt đỉnh sớm hơn và mất thành tích nhanh hơn người tập ít nhưng phục hồi tốt.',
    details: [
      'Dành cho ai: tập gym ≥4 buổi/tuần, chạy/đạp/bơi thường xuyên, tham gia giải thi đấu, đang tăng volume/intensity, hoặc cảm thấy tập mãi không thấy tiến bộ mặc dù cố gắng.',
      'Ngủ là nơi diễn ra 80% phục hồi cơ bắp: GH (growth hormone) tiết peak lúc ngủ sâu giai đoạn N3, cortisol giảm thấp nhất lúc ngủ để tái tổng hợp cơ — thiếu ngủ giảm gain cơ 30–60%.',
      'HRV monitoring: theo dõi Heart Rate Variability buổi sáng (trước khi dậy) 3 ngày liên tiếp thấp → dấu hiệu overtraining. Hôm đó nên tập nhẹ hoặc recovery, không cố push để đạt PR.',
      'Protein timing cho người tập nhiều: 0.4g/kg mỗi bữa ăn (không nhất thiết phải trong 30 phút sau tập — cửa sổ anabolic kéo dài 3–4 giờ sau tập với điều kiện đã ăn trước đó). Tổng ngày: 1.6–2.2g/kg.',
      'Deload chủ động: mỗi 4–6 tuần tập nặng, giảm 40–50% volume (trọng lượng và số set) trong 1 tuần — không bỏ tập mà tập nhẹ. Deload cải thiện performance sau đó tốt hơn tập liên tục không nghỉ.',
      'Recovery toolkit tối thiểu cho người tập nhiều: 10 phút foam rolling sau buổi tập, 5 phút breathing protocol trước ngủ, 7–9 giờ ngủ (người tập cần nhiều hơn người không tập), và 1 ngày active recovery mỗi tuần.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ 7–9h', note: '80% phục hồi cơ diễn ra lúc ngủ sâu' },
      { icon: '📊', label: 'HRV monitoring', note: 'Đo phục hồi thần kinh hàng sáng' },
      { icon: '🗓️', label: 'Deload 4–6 tuần', note: 'Giảm 40–50% volume 1 tuần' },
      { icon: '🥩', label: 'Protein 1.6–2.2g/kg', note: 'Trải đều qua 4–5 bữa ăn' },
    ],
  },
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
  {
    label: 'Giảm màn hình trước ngủ 30+ phút',
    icon: '📵', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80&auto=format&fit=crop',
    detail: 'Ánh sáng xanh từ màn hình ức chế melatonin — hormone báo hiệu ngủ. Tắt màn hình 30 phút trước khi ngủ là can thiệp đơn giản nhất để cải thiện chất lượng giấc ngủ.',
    keyFact: 'Ánh sáng xanh (480nm) ức chế melatonin hiệu quả gấp 2 lần ánh sáng trắng thông thường — 1 giờ nhìn màn hình tối có thể trì hoãn giấc ngủ 30–45 phút ngay cả sau khi tắt điện thoại.',
    details: [
      'Melatonin bắt đầu tăng 2 giờ trước giờ ngủ thông thường của bạn. Ánh sáng màn hình trong khung giờ này làm gián đoạn quá trình tích lũy melatonin, khiến bạn khó buồn ngủ hơn.',
      '30 phút là ngưỡng tối thiểu — lý tưởng là 60 phút không màn hình. Nhưng nếu chưa làm được, chỉ cần giảm 30 phút cuối trước ngủ đã có tác động đo được lên thời gian đi vào giấc ngủ.',
      'Giải pháp thực tế: bật Night Mode/f.lux từ 7–8pm (giảm ánh sáng xanh), giảm độ sáng màn hình 30–40% sau 9pm. Nếu phải dùng màn hình, kính chặn ánh sáng xanh (amber lens) hiệu quả hơn Night Mode đơn thuần.',
      'Thay thế màn hình 30 phút cuối: đọc sách giấy dưới đèn vàng, viết nhật ký, thiền nhẹ, nghe podcast âm thanh (không nhìn màn hình), hoặc nói chuyện — bất cứ hoạt động không phát ánh sáng xanh vào mắt.',
      'Thói quen đặt điện thoại ra xa giường (charge ở phòng khác hoặc đầu kia phòng ngủ) giảm cám dỗ check điện thoại trước ngủ và sau khi thức giữa đêm — hai thói quen phá hoại giấc ngủ phổ biến nhất.',
      'Tín hiệu thành công: bạn bắt đầu cảm thấy buồn ngủ đúng giờ dự kiến thay vì phải "cố ngủ". Melatonin hoạt động đúng nhịp khi không bị ánh sáng xanh gián đoạn.',
    ],
    points: [
      { icon: '📱', label: 'Night Mode 7–8pm', note: 'Sớm hơn bạn nghĩ là cần' },
      { icon: '📚', label: 'Sách giấy thay màn hình', note: 'Đèn vàng không ức chế melatonin' },
      { icon: '🔌', label: 'Phone xa giường', note: 'Giảm cám dỗ check lúc nửa đêm' },
      { icon: '😴', label: 'Buồn ngủ đúng giờ', note: 'Dấu hiệu melatonin hoạt động đúng' },
    ],
  },
  {
    label: 'Không uống caffeine sau 15h',
    icon: '☕', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop',
    detail: 'Caffeine có half-life 5–7 giờ trong cơ thể — ly cà phê 3pm vẫn còn 50% hoạt động lúc 8–10pm, âm thầm phá hoại chất lượng ngủ sâu ngay cả khi bạn có thể đi vào giấc ngủ.',
    keyFact: 'Caffeine không chỉ khó ngủ — nó giảm giấc ngủ sóng chậm (deep sleep) tới 20% ngay cả ở người "không nhạy caffeine". Bạn ngủ được nhưng chất lượng phục hồi kém hơn đáng kể.',
    details: [
      'Caffeine hoạt động bằng cách chặn adenosine receptors — adenosine là phân tử "tích mệt mỏi" xây dựng dần trong ngày. Khi caffeine chặn receptor này, não không nhận tín hiệu buồn ngủ dù cơ thể thực sự mệt.',
      'Half-life 5–7 giờ có nghĩa: 200mg caffeine (2 espresso) lúc 3pm → 100mg vẫn còn hoạt động lúc 8–10pm. Với người chuyển hóa caffeine chậm (gene CYP1A2 biến thể), half-life lên đến 9–10 giờ.',
      'Cut-off 3pm (15h) là ngưỡng an toàn cho hầu hết người. Nếu bạn ngủ lúc 10pm, caffeine uống lúc 3pm chỉ còn 25–50mg lúc đi ngủ — dưới ngưỡng ảnh hưởng đáng kể với hầu hết người.',
      'Nguồn caffeine ẩn thường bị bỏ qua: trà xanh 25–50mg/tách, trà đen 40–70mg, chocolate đen 20–30mg/30g, nước tăng lực 80–150mg, một số đau đầu thuốc có 65mg caffeine mỗi viên.',
      'Khi "cần" caffeine buổi chiều: thay bằng trà xanh (có L-theanine làm chậm hấp thu và giảm anxiety) hoặc đi bộ 10 phút ra ngoài — ánh sáng tự nhiên + vận động tăng cảnh giác hiệu quả như 100mg caffeine mà không ảnh hưởng giấc ngủ.',
      'Nếu phải uống caffeine muộn (họp tối, ca đêm): uống với thức ăn để làm chậm hấp thu, chọn nguồn ít caffeine hơn (matcha thay espresso), và chấp nhận ngủ muộn hơn 30–45 phút tối hôm đó.',
    ],
    points: [
      { icon: '⏰', label: 'Cut-off 3pm', note: 'An toàn cho hầu hết người ngủ 10pm' },
      { icon: '🧬', label: 'Gene CYP1A2', note: 'Chuyển hóa chậm cần cut-off sớm hơn' },
      { icon: '🍵', label: 'Matcha thay espresso', note: 'L-theanine làm mượt caffeine' },
      { icon: '🏃', label: 'Đi bộ 10 phút', note: 'Bằng 100mg caffeine — không ảnh hưởng ngủ' },
    ],
  },
  {
    label: 'Có routine tối 5–30 phút',
    icon: '🌙', color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop',
    detail: 'Routine tối là "tín hiệu" nhất quán báo cho não biết đã đến lúc chuyển sang chế độ ngủ — hệ thần kinh cần thời gian wind-down chủ động, không thể chuyển trực tiếp từ làm việc sang ngủ.',
    keyFact: 'Não cần 20–30 phút để hạ nhiệt độ lõi cơ thể và tăng melatonin đủ mức để đi vào giấc ngủ sâu. Làm việc hoặc xem nội dung kích thích đến phút cuối trước ngủ giữ nhiệt độ lõi và cortisol cao, trì hoãn onset giấc ngủ.',
    details: [
      'Routine tối hoạt động vì conditioning (điều kiện hóa): khi bạn làm cùng một chuỗi hoạt động trước ngủ mỗi đêm, não học cách liên kết chuỗi đó với buồn ngủ. Sau 2–3 tuần, chỉ cần bắt đầu routine là đã cảm thấy buồn ngủ.',
      'Thời gian tối thiểu hiệu quả: 5 phút. Ngay cả routine ngắn (rửa mặt → đánh răng → nằm thở 1 phút) cũng tạo được tín hiệu chuyển tiếp nếu thực hiện nhất quán mỗi đêm.',
      'Thành phần routine hiệu quả nhất: giảm ánh sáng và tiếng ồn → vệ sinh cá nhân → hoạt động thư giãn thụ động (đọc sách, viết nhật ký, thiền nhẹ) → breathing. Tránh các hoạt động kích thích tư duy (giải bài, tranh luận, lên kế hoạch).',
      'Nhiệt độ: tắm/tắm vòi sen nước ấm 1–2 giờ trước ngủ nghịch lý giúp ngủ nhanh hơn — nhiệt từ nước ấm kéo máu ra ngoài da, sau đó nhiệt tản ra ngoài làm hạ nhiệt độ lõi cơ thể nhanh hơn bình thường.',
      'Viết nhật ký 5 phút trước ngủ (đặc biệt "to-do list" cho ngày mai) giảm thời gian đi vào giấc ngủ trung bình 9 phút theo nghiên cứu 2018 — vì não không cần "nhắc" bản thân về các việc chưa làm trong đêm.',
      'Bắt đầu nhỏ: chọn 1 hoạt động 5 phút và làm nhất quán 7 ngày trước khi thêm hoạt động thứ 2. Routine phức tạp ngay từ đầu ít được duy trì hơn routine đơn giản được thực hiện đều đặn.',
    ],
    points: [
      { icon: '🔄', label: 'Conditioning', note: '2–3 tuần để não học liên kết' },
      { icon: '🛁', label: 'Tắm nước ấm', note: '1–2h trước ngủ hạ nhiệt độ lõi' },
      { icon: '📓', label: 'Viết to-do list', note: 'Giảm 9 phút thời gian đi vào ngủ' },
      { icon: '✅', label: 'Bắt đầu 1 việc', note: '5 phút nhất quán tốt hơn 30 phút lúc có' },
    ],
  },
  {
    label: 'Lên giường trong khung giờ dự kiến',
    icon: '🛏️', color: '#2dd4bf', rgb: '45,212,191',
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format&fit=crop',
    detail: 'Thời điểm lên giường nhất quán — dù không ngủ ngay — giúp đồng hồ sinh học học được "giờ ngủ" của bạn và chuẩn bị melatonin đúng thời điểm.',
    keyFact: 'Giường ngủ phải là tín hiệu duy nhất cho não: "đây là nơi ngủ". Làm việc, xem phim, lướt mạng trên giường phá vỡ liên kết này — não bắt đầu coi giường là nơi tỉnh táo, không phải ngủ.',
    details: [
      'Stimulus control therapy: một trong những kỹ thuật CBT-I (Cognitive Behavioral Therapy for Insomnia) được chứng minh hiệu quả nhất. Nguyên tắc cốt lõi: giường = ngủ và sex only, không làm bất cứ gì khác trên giường.',
      '"Khung giờ dự kiến" nghĩa là lên giường trong cửa sổ 30 phút xung quanh giờ ngủ mục tiêu. Không cần chính xác 10:30pm mỗi đêm, nhưng 10:00–11:00pm ổn định hơn nhiều so với 9pm hôm nay 1am hôm sau.',
      'Nếu không ngủ được sau 20 phút nằm: dậy ra khỏi giường, làm gì đó nhạt nhẽo dưới ánh sáng yếu cho đến khi buồn ngủ thực sự, rồi mới quay lại giường. Nằm trằn trọc tạo ra anxiety về giường và làm xấu hơn về lâu dài.',
      'Tránh "trả nợ ngủ" bằng cách ngủ bù muộn — nếu ngủ muộn 1 hôm, vẫn dậy đúng giờ thông thường hôm sau và chịu buồn ngủ một ngày để tái thiết áp lực ngủ (sleep pressure) cho tối hôm đó.',
      'Môi trường giường: chỉ dùng giường để ngủ, giúp cải thiện "sleep efficiency" (tỷ lệ thời gian thực sự ngủ / tổng thời gian nằm trên giường). Sleep efficiency dưới 85% là dấu hiệu cần điều chỉnh.',
      'Chuẩn bị giường hàng đêm (giũ gối, sắp xếp chăn) như một bước trong routine tối — hành động vật lý nhỏ này hoạt động như "trigger" kép: báo hiệu não và tạo môi trường thoải mái để ngủ.',
    ],
    points: [
      { icon: '🎯', label: 'Cửa sổ 30 phút', note: 'Không cần chính xác từng phút' },
      { icon: '🛋️', label: 'Giường = chỉ để ngủ', note: 'CBT-I stimulus control' },
      { icon: '🚶', label: 'Không ngủ được → dậy', note: 'Sau 20 phút, ra khỏi giường' },
      { icon: '📊', label: 'Sleep efficiency >85%', note: 'Chỉ số chất lượng quan trọng' },
    ],
  },
  {
    label: 'Ngủ đủ hoặc tốt hơn hôm qua',
    icon: '⭐', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    detail: 'Tiêu chí linh hoạt nhất — không yêu cầu hoàn hảo ngay lập tức mà hướng đến cải thiện tích lũy. "Tốt hơn hôm qua" tạo momentum bền vững hơn "đạt chuẩn tuyệt đối".',
    keyFact: '"Ngủ đủ" là chủ quan — dấu hiệu khách quan: tỉnh dậy trước hoặc cùng lúc báo thức, không buồn ngủ trước 2pm, có thể tập trung làm việc mà không cần caffeine trong 3 giờ đầu.',
    details: [
      '"Hoặc tốt hơn hôm qua" quan trọng hơn "đạt 7 giờ". Nếu hôm qua ngủ 5 giờ và hôm nay ngủ 5.5 giờ — bạn đang đi đúng hướng. Tiến bộ từng bước bền vững hơn thay đổi đột ngột.',
      'Dấu hiệu ngủ đủ (không cần tracker): tỉnh dậy không cần báo thức hoặc trước khi báo thức reo; không buồn ngủ trong khoảng 1–2 giờ sau khi thức; có thể tập trung 90 phút liên tục buổi sáng mà không cần caffeine.',
      'Giấc ngủ theo chu kỳ 90 phút: mỗi chu kỳ bao gồm light sleep → deep sleep → REM. Thức dậy giữa chu kỳ (vd: lúc 4.5 giờ) cảm giác tệ hơn thức dậy sau 6 giờ (4 chu kỳ hoàn chỉnh). Tính giờ ngủ theo bội số 90 phút + 15 phút để đi vào giấc.',
      'Tracking đơn giản: ghi lại giờ lên giường và giờ thức dậy mỗi sáng (10 giây). Sau 1 tuần nhìn lại pattern — quan sát những ngày ngủ tốt và xác định yếu tố tạo ra giấc ngủ tốt đó.',
      'Giấc ngủ kém 1–2 đêm là bình thường và không gây hại lâu dài — áp lực "phải ngủ được" (sleep anxiety) thực ra là nguyên nhân phổ biến của mất ngủ mạn tính. Chấp nhận đêm xấu và tập trung vào thói quen, không phải kết quả.',
      'Ngủ ngắn (nap) 10–20 phút trước 3pm có thể bù đắp một phần thiếu ngủ đêm trước mà không ảnh hưởng đến giấc ngủ tối. Nap trên 30 phút hoặc sau 3pm rủi ro làm giảm "sleep pressure" tối hôm đó.',
    ],
    points: [
      { icon: '📈', label: 'Tiến bộ từng bước', note: '"Tốt hơn hôm qua" bền vững hơn' },
      { icon: '⏰', label: 'Bội số 90 phút', note: 'Tính giờ ngủ theo chu kỳ' },
      { icon: '📝', label: 'Tracking 10 giây', note: 'Ghi giờ ngủ/thức mỗi sáng' },
      { icon: '😌', label: 'Chấp nhận đêm xấu', note: 'Sleep anxiety làm mất ngủ nặng hơn' },
    ],
  },
];

const C2_MORNING_5 = [
  {
    time: '1 phút', action: 'Uống 1 ly nước',
    icon: '💧', label: 'Uống 1 ly nước',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&auto=format&fit=crop',
    detail: 'Bước đơn giản nhất với tác động tức thì — cơ thể mất nước sau 7–9 giờ ngủ không uống gì.',
    keyFact: 'Mất chỉ 1–2% nước trong cơ thể đã làm giảm hiệu suất nhận thức 10–15% — và bạn thường đạt mức này ngay khi vừa thức dậy.',
    details: [
      'Sau 7–9 giờ không uống nước khi ngủ, cơ thể bắt đầu ngày mới ở trạng thái thiếu nước nhẹ — trực tiếp gây ra cảm giác mơ màng và chậm chạp buổi sáng.',
      'Não chứa ~75% nước — thiếu nước nhẹ làm chậm dẫn truyền thần kinh, giảm tập trung và tăng cảm giác mệt mỏi ngay cả trước khi uống cà phê.',
      'Uống nước trước cà phê: caffeine lúc bụng đói + cơ thể mất nước tăng cortisol không cần thiết và gây khó chịu dạ dày cho nhiều người.',
      '200–300ml nước là lý tưởng — không cần uống cả lít ngay một lúc. Uống từ từ trong 5–10 phút đầu tiên.',
      'Mẹo đơn giản: đặt bình nước ngay cạnh giường tối hôm trước — loại bỏ hoàn toàn ma sát để thói quen xảy ra tự động.',
      'Cảm giác "chưa tỉnh" sau khi thức (sleep inertia) thường giảm nhanh hơn sau khi uống nước + ra ánh sáng — không phải lúc nào cũng cần cà phê.',
    ],
    points: [
      { icon: '🥛', label: '200–300ml ngay khi thức', note: 'Trước cà phê và bữa sáng' },
      { icon: '🛏️', label: 'Đặt bình cạnh giường', note: 'Tự động hóa thói quen đêm trước' },
      { icon: '🧠', label: 'Não cần nước', note: 'Giảm mơ màng, tăng tập trung' },
      { icon: '⚡', label: 'Giảm sleep inertia', note: 'Cảm giác "chưa tỉnh" tan nhanh hơn' },
    ],
  },
  {
    time: '2 phút', action: 'Mở rèm / ra ngoài trời lấy ánh sáng',
    icon: '☀️', label: 'Mở rèm / Ánh sáng tự nhiên',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    detail: 'Ánh sáng tự nhiên là "nút reset" mạnh nhất cho đồng hồ sinh học — quan trọng hơn bất kỳ thói quen sáng nào khác.',
    keyFact: 'Ánh sáng ngoài trời (10.000–100.000 lux) mạnh gấp 100–1.000 lần đèn trong nhà — 5 phút ra ngoài hiệu quả hơn bật đèn cả buổi sáng.',
    details: [
      'Mắt có tế bào nhạy sáng đặc biệt (ipRGCs) kết nối trực tiếp với "đồng hồ chủ" của cơ thể (SCN). Ánh sáng buổi sáng "chốt" giờ thức và kích hoạt chuỗi hormone cho cả ngày.',
      'Trong 30–60 phút đầu sau khi thức, ánh sáng kích hoạt Cortisol Awakening Response (CAR) — đây là cortisol tốt giúp bạn tỉnh táo, không phải cortisol stress.',
      'Ngày흐mây, mưa nhỏ vẫn đủ hiệu quả — ánh sáng ngoài trời tối thiểu 1.000–2.000 lux, mạnh hơn đèn trong nhà 10–20 lần dù không có nắng.',
      'Mở rèm thay vì ra ngoài cũng có tác dụng nếu cửa sổ lớn và hướng đông — nhưng không hiệu quả bằng 5 phút thực sự ra ngoài.',
      'Không đeo kính râm trong 5 phút đầu — kính làm giảm tác dụng. Nhìn về phía bầu trời (không nhìn thẳng vào mặt trời) là đủ.',
      'Ánh sáng sáng còn tăng serotonin — tiền chất của melatonin về đêm. Nhiều serotonin ban ngày = ngủ sâu hơn về tối.',
    ],
    points: [
      { icon: '⏱️', label: '5 phút là đủ', note: 'Ra ngoài ngay sau khi thức' },
      { icon: '🌥️', label: 'Ngày흐mây vẫn tốt', note: 'Ngoài trời sáng hơn trong nhà 100x' },
      { icon: '👓', label: 'Không đeo kính râm', note: 'Để mắt nhận ánh sáng tự nhiên' },
      { icon: '🌅', label: 'Trong 1 giờ đầu', note: 'Kích hoạt cortisol tốt cho cả ngày' },
    ],
  },
  {
    time: '1 phút', action: 'Đi bộ nhẹ tại chỗ + xoay vai, xoay hông',
    icon: '🚶', label: 'Đi bộ nhẹ + Xoay khớp',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    detail: '60 giây vận động nhẹ đủ để đánh thức hệ tuần hoàn, bơm máu đến não và bôi trơn khớp sau 7–9 giờ nằm yên.',
    keyFact: '60 giây vận động nhẹ buổi sáng kích hoạt hệ tuần hoàn và bôi trơn khớp — giảm đáng kể cứng khớp và đau mỏi trong ngày dài.',
    details: [
      'Sau 7–9 giờ ngủ, dịch hoạt bao khớp ít hơn và sụn khớp chưa được "bôi trơn" — vài phút vận động nhẹ đầu ngày phân phối dịch khớp, giảm cứng khớp sáng.',
      'Đi bộ tại chỗ 30–60 giây: bơm máu từ chân về tim, tăng huyết áp từ từ thay vì đứng dậy đột ngột, giảm chóng mặt buổi sáng.',
      'Xoay vai: cơ vai và cổ co cứng nhất sau ngủ. 10–15 vòng mỗi chiều giải phóng cơ thang (trapezius) và giảm căng cổ hiệu quả.',
      'Xoay hông: khớp háng là khớp lớn nhất cơ thể và thường cứng nhất sau ngủ — xoay tròn 10–15 vòng mỗi bên "thức dậy" khớp và cơ vùng chậu.',
      'Không cần không gian — tất cả có thể thực hiện ngay tại chỗ đứng, thậm chí bên cạnh giường ngủ.',
      '1 phút này là "thông báo" cho cơ thể rằng ngày mới bắt đầu — hiệu quả hơn nằm thêm 5–10 phút sau khi chuông báo thức.',
    ],
    points: [
      { icon: '💧', label: 'Bôi trơn khớp', note: 'Dịch hoạt bao phân phối khi vận động' },
      { icon: '🩸', label: 'Tăng tuần hoàn', note: 'Máu từ chân lên não nhẹ nhàng' },
      { icon: '🦴', label: 'Xoay vai 10–15 vòng', note: 'Giải phóng cơ thang sau ngủ' },
      { icon: '🌀', label: 'Xoay hông 10–15 vòng', note: 'Thức dậy khớp háng lớn nhất cơ thể' },
    ],
  },
  {
    time: '1 phút', action: 'Hít thở sâu 4–6 nhịp',
    icon: '🫁', label: 'Hít thở sâu 4–6 nhịp',
    color: '#06b6d4', rgb: '6,182,212',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    detail: 'Kết thúc routine 5 phút bằng hít thở sâu — cài đặt tần số thần kinh cho cả ngày trước khi đối mặt với bất kỳ thứ gì.',
    keyFact: '4–6 nhịp thở cơ hoành chậm đủ để kích hoạt hệ phó giao cảm — trạng thái "calm but alert" lý tưởng để bắt đầu ngày.',
    details: [
      'Buổi sáng, hệ thần kinh giao cảm (fight-or-flight) thường cao do cortisol tăng — vài nhịp thở sâu giúp cân bằng lại sang trạng thái tập trung bình tĩnh.',
      'Kỹ thuật đơn giản nhất: hít vào mũi 4 giây (bụng phồng ra, ngực ít nâng), thở ra miệng 6 giây. Lặp 4–6 lần.',
      'Thở ra dài hơn hít vào kích hoạt dây thần kinh phế vị (vagus nerve) — làm chậm nhịp tim và hạ huyết áp trong vòng 60 giây.',
      'Sau 4–6 nhịp thở đúng, HRV (heart rate variability) tăng có thể đo được — chỉ số quan trọng nhất của trạng thái phục hồi và tập trung.',
      'Trong khi thở, đặt câu hỏi: "Hôm nay tôi muốn cảm thấy thế nào? Việc quan trọng nhất là gì?" — kích hoạt prefrontal cortex trước khi vào luồng phản xạ.',
      'Chỉ 1 phút nhưng tác dụng kéo dài: nhịp thở chậm buổi sáng thiết lập "baseline" thần kinh cho cả ngày, giúp phục hồi bình tĩnh nhanh hơn khi gặp stress.',
    ],
    points: [
      { icon: '🫁', label: 'Bụng phồng, ngực ít nâng', note: 'Thở cơ hoành đúng cách' },
      { icon: '⏱️', label: 'Hít 4s, thở ra 6s', note: 'Thở ra dài hơn = kích hoạt phó giao cảm' },
      { icon: '🧠', label: 'Đặt ý định cho ngày', note: 'Kích hoạt prefrontal cortex' },
      { icon: '❤️', label: 'Tăng HRV', note: 'Chỉ số phục hồi và tập trung' },
    ],
  },
];

const C2_MORNING_10 = [
  {
    time: '2 phút', action: 'Uống nước, mở cửa, tiếp xúc ánh sáng tự nhiên',
    icon: '💧', label: 'Nước + Ánh sáng tự nhiên',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&auto=format&fit=crop',
    detail: 'Bộ đôi quan trọng nhất của buổi sáng — cùng thực hiện trong 2 phút để tối đa hóa hiệu quả đánh thức sinh lý.',
    keyFact: 'Nước + ánh sáng tự nhiên trong 2 phút đầu là "double reset" mạnh nhất cho đồng hồ sinh học — hiệu quả hơn bất kỳ supplement nào.',
    details: [
      'Uống 200–300ml nước ngay khi thức: não chứa ~75% nước, thiếu nước nhẹ sau ngủ làm giảm hiệu suất nhận thức 10–15% trước khi bạn kịp nhận ra.',
      'Ra ngoài hoặc mở cửa lấy ánh sáng: các tế bào nhạy sáng trong mắt (ipRGCs) gửi tín hiệu đến đồng hồ sinh học — ánh sáng sáng kích hoạt cortisol tốt cho cả ngày.',
      'Thực hiện hai việc cùng lúc: uống nước trong khi đứng cạnh cửa sổ mở hoặc ngoài hiên — tiết kiệm thời gian và tạo "combo thói quen" dễ duy trì.',
      'Không cần trời nắng — ngày흐mây vẫn đủ sáng. Ánh sáng ngoài trời tối thiểu 1.000–2.000 lux, mạnh hơn đèn trong nhà rất nhiều.',
      '2 phút đầu quan trọng hơn bất kỳ 2 phút nào khác trong ngày về mặt thiết lập sinh lý — đây là thời điểm cơ thể nhận tín hiệu "ngày mới bắt đầu".',
      'Mẹo: đêm trước đặt bình nước cạnh giường + đặt báo thức cạnh cửa ra vào để tự nhiên thực hiện cả hai khi dậy.',
    ],
    points: [
      { icon: '💧', label: '200–300ml nước', note: 'Trước cà phê — luôn luôn' },
      { icon: '🌅', label: 'Ánh sáng ngay khi thức', note: 'Mở cửa hoặc ra ngoài 1–2 phút' },
      { icon: '🔗', label: 'Làm cùng lúc', note: 'Uống nước khi đứng ngoài cửa' },
      { icon: '⏰', label: '2 phút đầu quan trọng nhất', note: 'Thiết lập toàn bộ sinh lý cho ngày' },
    ],
  },
  {
    time: '3 phút', action: 'Đi bộ nhẹ trong nhà hoặc ra ngoài',
    icon: '🚶', label: 'Đi bộ nhẹ 3 phút',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    detail: '3 phút đi bộ nhẹ sau ngủ dậy bơm máu toàn thân, đánh thức hệ tiêu hóa và chuẩn bị cơ khớp cho ngày dài.',
    keyFact: '3 phút đi bộ nhẹ buổi sáng tăng lưu lượng máu đến cơ bắp và não lên 20–30% — hiệu quả hơn caffeine trong 15 phút đầu tiên.',
    details: [
      'Sau đêm ngủ, máu tập trung nhiều ở cơ quan nội tạng — đi bộ nhẹ "phân phối lại" máu đến cơ bắp và não, tạo cảm giác tỉnh táo tự nhiên.',
      'Không cần ra ngoài nếu thời tiết xấu: đi bộ trong nhà 3–4 vòng hoặc lên xuống cầu thang 2–3 lần cũng đủ để đánh thức tuần hoàn.',
      'Ra ngoài đi bộ: kết hợp được cả ánh sáng tự nhiên và vận động — đây là "double benefit" lý tưởng nhất.',
      'Tốc độ lý tưởng: thoải mái, không gắng sức — nhịp tim chỉ cần tăng nhẹ 10–15% so với nghỉ ngơi. Đây là thức dậy, không phải tập luyện.',
      'Hệ tiêu hóa cũng được đánh thức: vận động nhẹ kích thích nhu động ruột, giúp buổi sáng "thông suốt" hơn.',
      '3 phút này cũng là thời gian để não "khởi động lại" sau giấc ngủ — nhiều người phát hiện ý tưởng tốt nhất trong ngày xuất hiện khi đi bộ sáng.',
    ],
    points: [
      { icon: '🩸', label: 'Phân phối máu', note: 'Từ nội tạng → cơ bắp và não' },
      { icon: '🌿', label: 'Ra ngoài tốt nhất', note: 'Kết hợp ánh sáng + vận động' },
      { icon: '🐢', label: 'Tốc độ thoải mái', note: 'Không gắng sức — chỉ thức dậy' },
      { icon: '💭', label: 'Não khởi động', note: 'Ý tưởng tốt xuất hiện khi đi bộ' },
    ],
  },
  {
    time: '3 phút', action: 'Mobility: cổ vai gáy, xoay hông, vươn người',
    icon: '🌀', label: 'Mobility: Cổ Vai Gáy + Hông',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    detail: '3 phút mobility đúng vị trí cơ thể cần nhất — cổ vai gáy và hông là hai vùng cứng nhất sau ngủ.',
    keyFact: '3 phút mobility buổi sáng mỗi ngày hiệu quả hơn 30 phút stretching ngẫu nhiên cuối tuần — tính nhất quán tạo thay đổi cấu trúc lâu dài.',
    details: [
      'Cổ vai gáy: sau ngủ, cơ thang (trapezius) và levator scapulae thường là vùng căng cứng nhất. Xoay đầu từ từ mỗi chiều 5–8 lần + nghiêng tai về mỗi vai 5 giây.',
      'Xoay vai: 10–15 vòng về phía trước, 10–15 vòng về phía sau — hai chiều có tác dụng khác nhau (kéo giãn cơ trước ngực và kích hoạt cơ sau vai).',
      'Vươn người: đứng thẳng, hai tay đan nhau giơ cao đầu, vươn lên trong khi nhón gót — kéo giãn toàn bộ cột sống sau 7–9 giờ nằm ngang.',
      'Xoay hông: đứng hai chân rộng bằng vai, tay trên hông, xoay vòng 10–15 lần mỗi chiều — "bôi trơn" khớp háng lớn nhất cơ thể.',
      'Không cần gây đau — chỉ cần đến giới hạn nhẹ và cảm nhận cơ căng. Mobility sáng là thức dậy cơ thể, không phải kéo giãn sâu.',
      'Sau 4–6 tuần đều đặn mỗi sáng, tầm vận động khớp vai và hông tăng rõ rệt — ngồi làm việc ít đau mỏi cổ vai gáy hơn.',
    ],
    points: [
      { icon: '🦴', label: 'Cổ vai gáy trước', note: 'Vùng cứng nhất sau ngủ' },
      { icon: '🌀', label: 'Xoay hông 2 chiều', note: 'Bôi trơn khớp háng lớn nhất' },
      { icon: '⬆️', label: 'Vươn người lên cao', note: 'Kéo giãn toàn bộ cột sống' },
      { icon: '🔁', label: 'Mỗi ngày 3 phút', note: 'Hiệu quả hơn 30 phút cuối tuần' },
    ],
  },
  {
    time: '2 phút', action: 'Thở chậm + xác định 1 việc chính trong ngày',
    icon: '🎯', label: 'Thở chậm + Đặt ý định',
    color: '#06b6d4', rgb: '6,182,212',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    detail: 'Kết thúc routine 10 phút bằng thở + tư duy — cài đặt cả tần số thần kinh lẫn hướng tập trung cho cả ngày.',
    keyFact: 'Xác định 1 việc quan trọng nhất trước khi nhìn vào điện thoại giúp não hoạt động chủ động — tránh bẫy "phản ứng với hộp thư đến" cả ngày.',
    details: [
      'Thở chậm: hít vào 4 giây, giữ 2 giây, thở ra 6 giây. Lặp 4–6 lần. Thở ra dài hơn kích hoạt dây phế vị, hạ nhịp tim và mang lại bình tĩnh có thể đo được.',
      'Xác định 1 việc chính: trả lời câu hỏi "Nếu hôm nay tôi chỉ làm được 1 việc, đó là gì?" — kỹ thuật từ GTD và Essentialism để tránh bị cuốn vào công việc không quan trọng.',
      'Làm điều này trước khi kiểm tra điện thoại: sau khi nhìn vào thông báo/email, não chuyển sang "phản ứng" mode — khó quay lại "chủ động" mode.',
      'Kết hợp với hình dung: trong khi thở, hình dung mình đã hoàn thành xong việc đó và cảm giác thế nào — kích hoạt mạch thần kinh và tăng động lực.',
      'Ghi nhanh 1 câu vào sổ hoặc điện thoại: "Hôm nay: [việc X]" — viết ra tăng cam kết thêm 42% so với chỉ nghĩ trong đầu.',
      '2 phút này là ranh giới giữa sáng đầu ngày và phần còn lại — người thực hiện đều đặn thường cảm thấy "chủ động" và ít bị cuốn theo công việc phản xạ hơn.',
    ],
    points: [
      { icon: '🫁', label: 'Hít 4s, thở ra 6s', note: 'Kích hoạt vagus nerve, hạ nhịp tim' },
      { icon: '🎯', label: '1 việc quan trọng nhất', note: 'Trả lời trước khi mở điện thoại' },
      { icon: '📝', label: 'Viết ra 1 câu', note: '+42% cam kết so với chỉ nghĩ' },
      { icon: '🧠', label: 'Chủ động thay vì phản ứng', note: 'Tránh bẫy hộp thư đến sáng sớm' },
    ],
  },
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

const C3_NEAT_CHECKLIST = [
  {
    label: 'Đứng dậy sau mỗi 45–60 phút ngồi',
    icon: '🪑', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
    detail: 'Ngồi liên tục hơn 60 phút ức chế enzyme đốt mỡ và làm tăng glucose máu — đứng dậy 2 phút mỗi giờ đủ để đảo ngược phần lớn tác hại này.',
    keyFact: 'Sau 60 phút ngồi bất động, hoạt động lipoprotein lipase (LPL) — enzyme chính đốt mỡ trong cơ bắp — giảm 90%. Đứng dậy và di chuyển chỉ 2 phút kích hoạt lại LPL trong vòng vài giây.',
    details: [
      'Cơ chế sinh học: ngồi bất động làm cơ chân không co, kéo dài trạng thái "off" của LPL. Điều này không liên quan đến mức độ tập luyện — ngay cả người tập gym thường xuyên cũng bị ảnh hưởng nếu ngồi liên tục sau đó.',
      'Quy tắc 45–60 phút (không phải 90 phút): nghiên cứu Levine 2009 cho thấy tác động tiêu cực bắt đầu rõ ràng sau 60 phút. 45 phút là ngưỡng phòng ngừa tốt hơn với margin an toàn.',
      'Chỉ cần 2 phút: không cần stretching dài hay bài tập — chỉ cần đứng dậy, đi vài bước, hoặc đứng tại chỗ trong 2 phút là đủ để kích hoạt lại LPL và cải thiện lưu thông máu.',
      'Công cụ nhắc nhở: đặt timer 50 phút (Pomodoro + đứng dậy) hoặc dùng app nhắc đứng dậy. Một số người đặt cốc nước nhỏ (200ml) để phải đứng dậy lấy nước thường xuyên hơn.',
      'Standing desk không đủ: đứng bất động cũng tệ hơn việc ngồi-đứng xen kẽ. Cần cả hai: xen kẽ tư thế VÀ di chuyển nhỏ khi đứng (lắc chân, chuyển trọng tâm, squat nhỏ).',
      'Sau bữa ăn đặc biệt quan trọng: ngồi ngay sau ăn kéo dài đỉnh glucose và insulin. 10 phút đứng dậy hoặc đi nhẹ sau bữa trưa cải thiện độ nhạy insulin chiều tương đương 15–20 phút đi bộ riêng.',
    ],
    points: [
      { icon: '⏱️', label: 'Timer 45–50 phút', note: 'Pomodoro kết hợp đứng dậy' },
      { icon: '💧', label: 'Cốc nước nhỏ', note: 'Buộc đứng dậy tự nhiên hơn' },
      { icon: '🔄', label: 'Ngồi ↔ Đứng', note: 'Xen kẽ tốt hơn chỉ standing desk' },
      { icon: '🍽️', label: 'Đứng sau bữa ăn', note: '10 phút = 15–20 phút đi bộ riêng' },
    ],
  },
  {
    label: 'Đi bộ sau ít nhất 1 bữa ăn',
    icon: '🚶', color: '#059669', rgb: '5,150,105',
    img: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80&auto=format&fit=crop',
    detail: 'Đi bộ sau bữa ăn là một trong những can thiệp NEAT hiệu quả nhất: giảm đỉnh glucose sau ăn, tăng insulin sensitivity, và cải thiện tiêu hóa — chỉ cần 10–15 phút.',
    keyFact: 'Đi bộ 10 phút sau bữa ăn giảm đỉnh glucose máu trung bình 30–50% so với ngồi nghỉ — hiệu quả hơn đi bộ 30 phút lúc xa bữa ăn theo một số nghiên cứu về quản lý glucose.',
    details: [
      'Cơ chế: trong 30–90 phút sau ăn, glucose từ tiêu hóa đổ vào máu. Cơ bắp đang co (đi bộ) hấp thu glucose trực tiếp qua GLUT-4 transporter mà không cần insulin — "hút" glucose ra khỏi máu theo cơ chế cơ học, không phụ thuộc hormone.',
      'Chỉ cần 10 phút: tốc độ đi bộ thoải mái (không cần nhanh) đã kích hoạt cơ chân đủ để hấp thu glucose. 15–20 phút hiệu quả hơn nhưng 10 phút vẫn tạo ra sự khác biệt đo được.',
      'Thời điểm tốt nhất: bắt đầu trong vòng 15–30 phút sau khi kết thúc bữa ăn — trước khi đỉnh glucose sau ăn đạt mức cao nhất (~45–60 phút sau ăn). Đợi 1–2 giờ sau ăn mới đi bộ ít hiệu quả hơn nhiều.',
      'Tiêu hóa và đi bộ: lo ngại rằng đi bộ sau ăn "cản trở tiêu hóa" là hiểu lầm phổ biến. Đi bộ nhẹ thực ra kích thích co bóp đường tiêu hóa (GI motility) và giảm cảm giác nặng bụng sau ăn.',
      '"Ít nhất 1 bữa ăn" thực tế nhất là bữa trưa: có thể đi bộ quanh văn phòng, ra ngoài 10 phút, hoặc cầu thang. Bữa tối sau 7pm: đi bộ giúp hạ nhiệt độ lõi nhẹ, hỗ trợ chuyển tiếp sang trạng thái ngủ.',
      'Habit stacking: kết hợp đi bộ sau ăn với việc gọi điện thoại, nghe podcast, hoặc đi cùng đồng nghiệp. Việc gắn thói quen vào hoạt động có sẵn tăng tỷ lệ duy trì từ 20% lên 80%+.',
    ],
    points: [
      { icon: '📉', label: 'Giảm 30–50% glucose', note: 'Hiệu quả nhất trong 30p đầu sau ăn' },
      { icon: '⏰', label: 'Bắt đầu 15–30p sau ăn', note: 'Trước đỉnh glucose 45–60 phút' },
      { icon: '🍱', label: 'Bữa trưa dễ nhất', note: 'Đi bộ quanh văn phòng 10 phút' },
      { icon: '🔗', label: 'Habit stacking', note: 'Kết hợp với gọi điện/podcast' },
    ],
  },
  {
    label: 'Đạt mục tiêu bước cá nhân',
    icon: '👟', color: '#34d399', rgb: '52,211,153',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    detail: 'Mục tiêu bước chân cá nhân hóa — không nhất thiết phải là 10.000 bước. Baseline của bạn quyết định mục tiêu hợp lý, và chỉ cần đạt mục tiêu đó đều đặn hơn là thỉnh thoảng vượt xa rồi lại thấp.',
    keyFact: 'Mỗi 1.000 bước thêm mỗi ngày liên kết với giảm 10–15% nguy cơ tử vong sớm — và lợi ích này tiếp tục tăng đến khoảng 8.000–10.000 bước/ngày, sau đó plateau. Không có ngưỡng tối thiểu — bất kỳ bước chân thêm nào cũng có giá trị.',
    details: [
      '"Mục tiêu cá nhân" quan trọng hơn con số tuyệt đối: nếu baseline của bạn là 3.000 bước/ngày, mục tiêu 5.000 là phù hợp và tăng trưởng bền vững. Nhảy thẳng lên 10.000 thường thất bại sau 1–2 tuần.',
      'Cách thiết lập mục tiêu: theo dõi bước chân tự nhiên trong 7 ngày (không cố gắng thêm), tính trung bình, rồi đặt mục tiêu là trung bình + 1.500–2.000 bước. Sau 3 tuần đạt được đều đặn, tăng thêm 1.000 bước.',
      'Tracking tạo ra tác động: chỉ cần đo lường số bước chân (điện thoại, đồng hồ) làm tăng trung bình số bước 26% mà không cần thay đổi gì khác. Việc nhìn thấy con số tạo ra phản hồi tự nhiên để điều chỉnh hành vi.',
      'Chiến lược đạt mục tiêu bước dễ nhất: cầu thang thay thang máy (50–200 bước), gửi xe xa hơn 200m (400–600 bước khứ hồi), đi vệ sinh ở tầng khác (100–200 bước mỗi lần). Không cần thay đổi lịch trình.',
      '10.000 bước là con số marketing từ máy đo bước chân Nhật năm 1965 (万歩計 — manpokei), không phải con số khoa học. Nghiên cứu của Harvard 2019 trên 16.000+ phụ nữ cho thấy lợi ích plateau ở 7.500 bước cho nhóm người cao tuổi.',
      'Ngày ít bước (dưới 50% mục tiêu): 5 phút micro-workout tại chỗ (squat 20 lần, calf raise 30 lần, marching) không thay thế được nhưng duy trì thói quen vận động và giảm thiểu tác động tiêu cực của ngày ít di chuyển.',
    ],
    points: [
      { icon: '📊', label: 'Baseline +1.500 bước', note: 'Mục tiêu thực tế hơn 10.000 ngay' },
      { icon: '📱', label: 'Tracking +26% tự nhiên', note: 'Chỉ đo là đã cải thiện' },
      { icon: '🪜', label: 'Cầu thang + xe xa', note: 'Thêm 500–800 bước không tốn thời gian' },
      { icon: '🎯', label: '7.500 bước', note: 'Ngưỡng plateau lợi ích sức khỏe' },
    ],
  },
  {
    label: 'Có 1–2 lần vận động ngắn trong giờ làm',
    icon: '💪', color: '#6ee7b7', rgb: '110,231,183',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    detail: 'Micro-workout 3–5 phút xen kẽ trong giờ làm — không cần thay đồ, không cần thiết bị, nhưng đủ để kích hoạt tuần hoàn, tăng cảnh giác và phục vụ như "break" chất lượng cho não.',
    keyFact: '4× micro-workout 5 phút (tổng 20 phút) phân bổ đều trong ngày cải thiện mood, energy và tập trung tốt hơn 1 buổi tập 20 phút liên tục theo nghiên cứu về "exercise snacking" 2022.',
    details: [
      '"Exercise snacking" — khái niệm vận động ngắn xen kẽ trong ngày — được nghiên cứu ngày càng nhiều với kết quả tích cực về cả chỉ số tim mạch lẫn hiệu suất nhận thức ngắn hạn.',
      'Vận động ngắn lý tưởng trong giờ làm: không cần dụng cụ, không cần thay đồ, không gây đổ mồ hôi đáng kể. 10 squat, 10 push-up vào tường, 20 calf raise, 30 giây plank, hoặc đơn giản là vươn vai + xoay cổ 2 phút.',
      'Lợi ích nhận thức: 5 phút đi bộ hoặc vận động nhẹ tăng BDNF (brain-derived neurotrophic factor) và dopamine — hai chất giúp tập trung và học tập. Tác động kéo dài 1–2 giờ sau khi tập, giải thích tại sao "break vận động" làm việc hiệu quả hơn "break xem điện thoại".',
      'Thời điểm tốt nhất trong giờ làm: sau 90 phút tập trung cao (khi não bắt đầu đuối), hoặc ngay sau cuộc họp căng thẳng (để giải phóng cortisol tích lũy). Tránh trước các task đòi hỏi sự tập trung cao ngay lập tức.',
      'Kết hợp với timer: khi timer 45–50 phút báo đứng dậy, thay vì chỉ đứng lấy nước, làm 10–15 squat hoặc stretch 2 phút — biến "break bắt buộc" thành "exercise snack". Không tốn thêm thời gian nào.',
      'Tích lũy có ý nghĩa: 2 lần × 5 phút vận động ngắn = 10 phút/ngày × 5 ngày = 50 phút/tuần NEAT bổ sung ngoài bước chân. Tương đương gần 1 buổi tập nhẹ thêm mỗi tuần từ các "snack" nhỏ.',
    ],
    points: [
      { icon: '🍎', label: 'Exercise snacking', note: '4× 5 phút tốt hơn 1× 20 phút' },
      { icon: '🧠', label: 'BDNF + dopamine', note: 'Tập trung tốt hơn 1–2h sau đó' },
      { icon: '⏰', label: 'Sau 90 phút làm', note: 'Khi não bắt đầu đuối hiệu quả' },
      { icon: '📈', label: '50 phút NEAT/tuần', note: 'Từ 2× 5 phút mỗi ngày làm' },
    ],
  },
];

const C3_IDEAS = [
  {
    label: 'Đi cầu thang thay vì thang máy 1–2 tầng',
    icon: '🪜', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    detail: 'Cầu thang là một trong những can thiệp NEAT đơn giản và hiệu quả nhất — kết hợp bước chân + leo bậc nâng nhịp tim nhẹ và đốt calorie gấp 3 lần so với đi bộ phẳng.',
    keyFact: 'Leo cầu thang 2 phút tiêu thụ tương đương 15–20 phút đi bộ nhẹ về mặt năng lượng tương đối — và đủ để tăng nhịp tim vào vùng light cardio.',
    details: [
      'Cầu thang đốt khoảng 8–11 kcal/phút (so với 3–4 kcal/phút khi đi bộ phẳng) — cùng thời gian, calorie tiêu thụ cao hơn 2–3 lần do lực tác dụng lên cơ mông, đùi và bắp chân.',
      '1–2 tầng là ngưỡng không gây đổ mồ hôi và không tốn thêm thời gian đáng kể. Không cần thay đồ, không cần giày thể thao — chỉ cần ra khỏi thang máy sớm hơn 1 nút.',
      'Cộng dồn: 4 lần lên xuống 2 tầng mỗi ngày làm = ~5–8 phút leo cầu thang/ngày = ~150–200 kcal thêm/tuần từ 1 thói quen đơn giản. Sau 1 năm: tương đương ~8.000 kcal hay gần 1kg mỡ.',
      'Cardiorespiratory fitness: nghiên cứu cho thấy leo cầu thang thường xuyên cải thiện VO2max (khả năng hấp thu oxy) và sức mạnh cơ đùi ở người ít vận động tương tự như chương trình tập cardio nhẹ.',
      'Tâm lý: không cần "thời gian tập luyện riêng" — đây là vận động tích hợp trong sinh hoạt. Không có cảm giác "phải đi tập", chỉ là "chọn cầu thang thay vì thang máy".',
      'Bắt đầu nhỏ: nếu văn phòng ở tầng 10, đi thang máy đến tầng 8 rồi leo 2 tầng. Không cần leo toàn bộ ngay — tăng dần 1 tầng mỗi tuần.',
    ],
    points: [
      { icon: '🔥', label: '8–11 kcal/phút', note: 'Gấp 2–3 lần đi bộ phẳng' },
      { icon: '🏗️', label: '1–2 tầng', note: 'Không đổ mồ hôi, không tốn thời gian' },
      { icon: '📈', label: 'VO2max tăng', note: 'Cardio nhẹ tích hợp vào ngày làm' },
      { icon: '🗓️', label: '~1kg/năm', note: 'Từ 4 lần leo cầu thang mỗi ngày' },
    ],
  },
  {
    label: 'Gửi xe xa hơn một chút khi đi làm',
    icon: '🚗', color: '#059669', rgb: '5,150,105',
    img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80&auto=format&fit=crop',
    detail: 'Gửi xe xa thêm 200–300m tạo ra thêm 400–600 bước mỗi ngày (khứ hồi) — không tốn thêm thời gian đáng kể và là NEAT gần như "miễn phí".',
    keyFact: 'Gửi xe xa thêm 300m mỗi chiều = 600 bước thêm × 5 ngày = 3.000 bước/tuần = ~156.000 bước/năm — tương đương 75km đi bộ thêm không cần "tập luyện".',
    details: [
      '300m thêm mỗi chiều chỉ mất 3–4 phút đi bộ — hầu hết người không cảm nhận đây là "tập thể dục" mà chỉ là đi bộ đến chỗ làm. Đây là điểm mấu chốt của NEAT: vận động tích hợp vào sinh hoạt.',
      'Tâm lý học thói quen: khi quyết định "gửi xe xa" là một lần mỗi sáng, không cần suy nghĩ lại mỗi ngày. Habit cue rõ ràng (đến chỗ làm → gửi xa) giúp duy trì lâu dài.',
      'Khuyến khích thêm ánh sáng sáng: đi bộ ngoài trời buổi sáng vừa tăng NEAT vừa nhận ánh sáng tự nhiên để đặt lại đồng hồ sinh học — hai lợi ích từ một quyết định.',
      'Biến thể: xuống xe buýt/tàu một trạm sớm, đỗ xe ở tầng trên cùng của bãi (leo cầu thang thêm), hoặc đi bộ từ nhà đến điểm gửi xe thay vì lái đến tận nơi.',
      'Ngày mưa/nóng: vẫn gửi xa nhưng đi nhanh hơn — 3 phút đi nhanh vẫn có giá trị NEAT và tốt hơn không làm gì. Có ô/mũ sẵn trong xe.',
      'Cộng dồn với cầu thang: gửi xe xa + leo cầu thang 2 tầng mỗi ngày = ~700–800 bước thêm + mini cardio boost mỗi sáng. Hai thói quen nhỏ, tác động cộng hưởng.',
    ],
    points: [
      { icon: '📍', label: '300m thêm = 600 bước', note: 'Khứ hồi gần như miễn phí' },
      { icon: '☀️', label: 'Ánh sáng sáng', note: 'NEAT + circadian cùng lúc' },
      { icon: '🧠', label: 'Quyết định 1 lần', note: 'Không cần suy nghĩ lại mỗi ngày' },
      { icon: '📅', label: '75km/năm', note: 'Từ thói quen 3–4 phút mỗi sáng' },
    ],
  },
  {
    label: 'Nghe điện thoại khi đứng hoặc đi lại',
    icon: '📞', color: '#34d399', rgb: '52,211,153',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format&fit=crop',
    detail: 'Cuộc gọi điện thoại là cơ hội vận động hoàn toàn tự do — bạn không cần tập trung vào màn hình, chỉ cần tai nghe và đứng dậy đi lại.',
    keyFact: 'Người có công việc thường xuyên di chuyển khi nói chuyện điện thoại (walking meetings, standing calls) đốt thêm trung bình 300–500 kcal/ngày so với người ngồi làm mọi thứ — chỉ từ thay đổi này.',
    details: [
      'Tại sao điện thoại là cơ hội vàng: bạn không nhìn màn hình khi nghe điện thoại, tay không cần gõ phím — hoàn toàn có thể vừa nghe vừa đi lại mà không ảnh hưởng chất lượng cuộc gọi.',
      'Đứng hay đi? Đi lại (walking) tốt hơn đứng yên vì: tăng bước chân, kích hoạt nhiều cơ hơn, tăng lưu thông máu não giúp tư duy rõ hơn, và thực tế tăng khả năng lắng nghe và ghi nhớ thông tin.',
      'Nghiên cứu về walking meetings: Stanford 2014 cho thấy đi bộ trong khi brainstorm tăng tư duy sáng tạo 81% so với ngồi — nhiều công ty lớn (Apple, Facebook, Twitter) có văn hóa walking 1:1.',
      'Thực tế: đặt tai nghe không dây (AirPods, earbuds) sạc ngay cạnh điện thoại — khi có cuộc gọi, cắm vào và đứng dậy là phản xạ tự động. Không cần quyết định gì thêm.',
      'Trong nhà: có thể đi vòng quanh phòng khách, đi ra ban công, hoặc đứng gần cửa sổ. Không cần không gian lớn — 10m² đủ để đi 50–100 bước trong 5 phút cuộc gọi.',
      'Lợi ích nhận thức: đứng + đi nhẹ trong khi nói chuyện tăng lưu lượng máu não, giúp suy nghĩ rõ hơn và phản ứng nhanh hơn trong cuộc gọi — bạn cũng nói chuyện tốt hơn.',
    ],
    points: [
      { icon: '🎧', label: 'Tai nghe không dây', note: 'Đặt cạnh điện thoại — tự động hóa' },
      { icon: '🧠', label: 'Sáng tạo +81%', note: 'Walking brainstorm (Stanford 2014)' },
      { icon: '🚶', label: 'Đi lại > đứng yên', note: 'Nhiều cơ hơn, tư duy tốt hơn' },
      { icon: '⚡', label: '300–500 kcal/ngày', note: 'Từ đứng/đi khi gọi điện' },
    ],
  },
  {
    label: 'Họp ngắn thực hiện khi đi bộ',
    icon: '🤝', color: '#6ee7b7', rgb: '110,231,183',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop',
    detail: 'Walking meeting — họp khi đi bộ — là format ngày càng phổ biến trong văn hóa công ty hiện đại, phù hợp cho cuộc gặp 1:1, brainstorm, và feedback không cần trình chiếu.',
    keyFact: 'Cuộc họp đứng (standing meeting) giảm thời gian họp trung bình 25% và walking meeting tăng sự tập trung và mức năng lượng của người tham gia so với họp ngồi trong phòng kín.',
    details: [
      'Phù hợp nhất cho: họp 1:1, catch-up ngắn, feedback không chính thức, brainstorm ý tưởng, và check-in hàng ngày. Không phù hợp cho: trình bày slides, ký hợp đồng, ghi chép phức tạp.',
      'Lợi ích tâm lý: không gian mở và chuyển động vật lý phá vỡ "power dynamic" của phòng họp truyền thống — nhiều người cởi mở hơn, thành thật hơn khi không đối mặt trực tiếp mà đi song song.',
      'Cách đề xuất: "Mình đi bộ một vòng xung quanh tòa nhà trong lúc talk nhé?" hoặc đơn giản là "Walking meeting?" — nhiều người sẵn sàng hơn bạn nghĩ, đặc biệt cho các cuộc gặp không chính thức.',
      'Outdoor vs indoor: đi bộ ngoài trời thêm lợi ích ánh sáng tự nhiên + không khí — nhưng indoor (hành lang, lobby) cũng được nếu thời tiết không thuận lợi.',
      'Ghi chú: dùng voice memo hoặc ghi âm ngắn thay vì ghi trên giấy/điện thoại. Hoặc tóm tắt bằng email ngay sau khi kết thúc — trí nhớ còn tươi trong 5 phút đầu.',
      'Tích lũy: 2 walking meeting 20 phút/tuần = 40 phút đi bộ thêm/tuần hoàn toàn trong giờ làm, không cần cắt giờ nghỉ hay thêm thời gian.',
    ],
    points: [
      { icon: '✅', label: 'Họp 1:1 và brainstorm', note: 'Format phù hợp nhất' },
      { icon: '💬', label: 'Cởi mở hơn', note: 'Không đối mặt → thành thật hơn' },
      { icon: '⏱️', label: 'Giảm 25% thời gian họp', note: 'Standing/walking meeting ngắn hơn' },
      { icon: '📅', label: '40 phút đi bộ/tuần', note: 'Từ 2 walking meeting 20 phút' },
    ],
  },
  {
    label: 'Đặt bình nước xa bàn để phải đứng dậy',
    icon: '💧', color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    detail: 'Thiết kế môi trường để buộc phải vận động — đặt bình nước xa bàn tạo ra "friction có lợi" khiến mỗi lần uống nước trở thành một lần đứng dậy đi lại.',
    keyFact: 'Uống đủ nước (2–2.5L/ngày) kết hợp với bình nước nhỏ (500ml) = 4–5 lần đứng dậy bắt buộc mỗi ngày — tự động tạo ra ngắt quãng ngồi mà không cần nhớ hay cài timer.',
    details: [
      'Nguyên tắc "thiết kế môi trường": thay vì dựa vào ý chí để nhớ đứng dậy, tạo ra cấu trúc vật lý buộc hành vi xảy ra tự động. James Clear (Atomic Habits) gọi đây là "environment design".',
      'Bình nước 500ml (không phải 1L): buộc phải đi lấy nước 4–5 lần thay vì 2 lần. Mỗi lần là 20–50 bước và 1–2 phút đứng dậy — đủ để kích hoạt LPL và phá vỡ chuỗi ngồi dài.',
      'Xa bao nhiêu là đủ: 10–20m là lý tưởng — đủ xa để phải đứng dậy và đi vài bước, không quá xa để trở thành bất tiện. Bếp, bình nước hành lang, hoặc phòng khác trong văn phòng.',
      'Bonus: đứng dậy lấy nước cũng là cơ hội thêm: calf raise khi chờ nước rót, vươn vai, hoặc đi vòng qua chỗ đồng nghiệp để trao đổi nhanh thay vì nhắn tin.',
      'Kết hợp với bài tập uống nước: sau mỗi lần uống, 10 squat hoặc calf raise. Nhỏ đến mức không cần thay đồ, đủ để đánh thức cơ chân sau thời gian ngồi dài.',
      'Uống nước đủ cũng là lợi ích trực tiếp: mất nước 1–2% làm giảm khả năng tập trung 15–20% và tăng cảm giác mệt mỏi. Bình nước xa bàn buộc uống nước đều đặn hơn cốc nước to để ngay cạnh.',
    ],
    points: [
      { icon: '🏗️', label: 'Environment design', note: 'Không cần ý chí — cơ cấu tự động' },
      { icon: '🥤', label: 'Bình 500ml', note: '4–5 lần đứng dậy/ngày bắt buộc' },
      { icon: '🧠', label: 'Tập trung +20%', note: 'Uống đủ nước giảm mệt mỏi' },
      { icon: '🦵', label: '10 squat sau uống nước', note: 'Micro-workout tích hợp tự nhiên' },
    ],
  },
  {
    label: 'Đi bộ 5 phút trước khi vào nhà sau công việc',
    icon: '🚪', color: '#059669', rgb: '5,150,105',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    detail: 'Khoảng đệm chuyển tiếp từ "mode làm việc" sang "mode thư giãn" — 5 phút đi bộ trước khi vào nhà giúp cortisol hạ và tâm trí tách khỏi công việc hiệu quả hơn ngồi xe/tàu đến thẳng.',
    keyFact: '"Transition ritual" — nghi thức chuyển tiếp — làm giảm spillover stress từ công việc vào cuộc sống gia đình. 5 phút đi bộ đủ để cortisol giảm đo được và "mental switch" xảy ra.',
    details: [
      'Work-life spillover: không có nghi thức chuyển tiếp, não vẫn ở "work mode" khi về nhà — tiếp tục xử lý vấn đề công việc trong vô thức, gây khó thư giãn, căng thẳng tối và ngủ kém.',
      '5 phút đi bộ ngoài trời là "decompression ritual": nhịp thở sâu hơn tự nhiên, nhịp tim giảm nhẹ, cortisol bắt đầu giảm. Não chuyển từ sympathetic (giao cảm) sang parasympathetic (phó giao cảm).',
      'Không cần xa: đi vòng quanh block nhà, ra nhận thư rồi đi bộ thêm, hoặc xuống xe/xe buýt sớm vài trạm. Quan trọng là outdoor và không nhìn điện thoại trong 5 phút đó.',
      'Kết hợp mindfulness: trong 5 phút đi bộ, chú ý đến những gì nhìn thấy, nghe thấy, cảm nhận thay vì nghĩ về email chưa trả lời. Đây là mindful walking đơn giản nhất.',
      '"Bookend ritual": sáng (ra ngoài 10 phút ánh sáng sau thức dậy) + tối (5 phút đi bộ trước vào nhà) tạo ra cấu trúc ngày rõ ràng cho hệ thần kinh — giúp điều tiết cortisol cả ngày.',
      'Thêm NEAT: 5 phút đi bộ × 5 ngày = 25 phút/tuần thêm hoàn toàn không tốn thời gian riêng — đây là thời gian "không làm gì" (ngồi trong xe, chờ tàu) được chuyển thành vận động.',
    ],
    points: [
      { icon: '🧘', label: 'Decompression ritual', note: 'Chuyển từ work mode → home mode' },
      { icon: '📵', label: 'Không điện thoại', note: '5 phút để não thực sự nghỉ' },
      { icon: '🌇', label: 'Outdoor', note: 'Ánh sáng tự nhiên hỗ trợ cortisol hạ' },
      { icon: '📚', label: 'Bookend ritual', note: 'Sáng + tối = cấu trúc ngày rõ ràng' },
    ],
  },
  {
    label: 'Dọn nhà 10 phút — cũng là vận động!',
    icon: '🧹', color: '#34d399', rgb: '52,211,153',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    detail: 'Dọn nhà là NEAT cao nhất trong các hoạt động sinh hoạt hàng ngày — đứng, đi lại, cúi người, với tay, mang vác nhẹ — kết hợp nhiều nhóm cơ và vùng vận động.',
    keyFact: 'Dọn nhà 10 phút đốt 40–60 kcal tùy cường độ — tương đương 15–20 phút đi bộ nhẹ. Và không gian sạch sẽ sau đó có tác động tích cực lên tâm trạng và khả năng tập trung.',
    details: [
      'NEAT từ dọn nhà bao gồm: đứng liên tục (active standing), di chuyển qua các phòng (walking), cúi nhặt đồ (hip hinge nhẹ), với tay lên cao (shoulder mobility), mang vác nhẹ (cơ tay và lõi).',
      '10 phút không cần dọn toàn bộ nhà: 1 phòng hoặc 1 khu vực — bếp, phòng ngủ, bàn làm việc. Chia nhỏ thành "micro-dọn" 10 phút giúp dễ bắt đầu và không cảm thấy nặng nề.',
      'Habit stacking tối ưu: dọn nhà 10 phút ngay sau ăn tối — vừa tăng NEAT sau bữa ăn (giảm glucose), vừa tạo không gian sạch trước khi bắt đầu routine tối.',
      'Tâm lý học môi trường: môi trường lộn xộn tăng cortisol và giảm khả năng tập trung (research từ Princeton Neuroscience). Dọn nhà không chỉ là NEAT mà còn là đầu tư vào chất lượng nghỉ ngơi tối.',
      'Cường độ điều chỉnh: "hăng" như hút bụi, lau sàn = 50–60 kcal/10 phút; "nhẹ" như sắp xếp, thu dọn = 30–40 kcal/10 phút. Cả hai đều có giá trị.',
      '"Cũng là vận động" là mindset quan trọng nhất: xóa ranh giới giữa "tập luyện" và "sinh hoạt hàng ngày". Mọi hoạt động đòi hỏi cơ bắp đều là vận động có giá trị.',
    ],
    points: [
      { icon: '🔥', label: '40–60 kcal/10 phút', note: 'Tương đương đi bộ 15–20 phút' },
      { icon: '🍽️', label: 'Sau ăn tối', note: 'NEAT + giảm glucose sau ăn' },
      { icon: '🧠', label: 'Giảm cortisol', note: 'Không gian sạch → tâm trí nhẹ hơn' },
      { icon: '💡', label: 'Mindset shift', note: 'Sinh hoạt hàng ngày = vận động' },
    ],
  },
  {
    label: 'Đi bộ sau ít nhất 1 bữa ăn/ngày',
    icon: '🍽️', color: '#6ee7b7', rgb: '110,231,183',
    img: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=800&q=80&auto=format&fit=crop',
    detail: 'Can thiệp NEAT đơn giản nhất với tác động đo được trên glucose máu — 10 phút đi bộ sau ăn hiệu quả hơn 30 phút đi bộ xa bữa ăn về quản lý glucose sau ăn.',
    keyFact: 'Meta-analysis 2022 (7 RCT) xác nhận: đi bộ 2–5 phút sau ăn giảm đỉnh glucose sau ăn 12%, đi bộ 10 phút giảm 30–50% — hiệu quả nhất khi bắt đầu trong 30 phút đầu sau ăn.',
    details: [
      'Cơ chế: trong 30–90 phút sau ăn, glucose từ tiêu hóa đổ vào máu. Cơ bắp đang co (đi bộ) hấp thu glucose qua GLUT-4 không cần insulin — giảm tải cho tuyến tụy và làm phẳng đường cong glucose.',
      'Thời điểm tối ưu: bắt đầu trong vòng 15–30 phút sau khi kết thúc bữa ăn. Đợi hơn 1 giờ sau ăn ít hiệu quả hơn nhiều vì đỉnh glucose đã qua.',
      '"Ít nhất 1 bữa" là ngưỡng thực tế — không cần làm sau cả 3 bữa. Bữa trưa thường dễ nhất (có giờ nghỉ) và tác động lớn nhất vì bữa trưa thường là bữa nhiều carb nhất trong ngày.',
      'Tốc độ: không cần đi nhanh. Tốc độ thoải mái (~4–5 km/h, có thể nói chuyện) đã đủ để kích hoạt GLUT-4 trong cơ chân. Đi nhanh không tăng thêm đáng kể hiệu quả giảm glucose.',
      'Kết hợp với điện thoại: đây là thời điểm tốt để nghe podcast, gọi điện cho người thân, hoặc nghe nhạc — biến walk sau ăn thành thời gian "tự thưởng" thay vì "phải làm".',
      'Tác động lâu dài: người thực hiện đi bộ sau ăn đều đặn trong 3 tháng cải thiện HbA1c (chỉ số đường huyết dài hạn) trung bình 0.5–1% — đáng kể cho người có nguy cơ tiểu đường type 2.',
    ],
    points: [
      { icon: '📉', label: 'Giảm 30–50% glucose', note: '10 phút trong 30p đầu sau ăn' },
      { icon: '🍱', label: 'Bữa trưa dễ nhất', note: 'Nhiều carb nhất + có giờ nghỉ' },
      { icon: '🎧', label: 'Kết hợp podcast', note: 'Biến thành thời gian "tự thưởng"' },
      { icon: '📊', label: 'HbA1c -0.5–1%', note: 'Sau 3 tháng đều đặn' },
    ],
  },
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
  {
    zone: 'Cổ vai gáy', icon: '🦴',
    exercises: ['Chin tuck 10 lần', 'Shoulder roll', 'Doorway stretch', 'Scapular squeeze', 'Thoracic twist'],
    label: 'Phục Hồi Cổ Vai Gáy',
    color: '#a78bfa', rgb: '167,139,250',
    img: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&q=80&auto=format&fit=crop',
    detail: 'Cổ vai gáy là vùng chịu đựng nhiều nhất của người ngồi làm việc — 5 bài tập mục tiêu giải phóng cơ thang, cổ và lưng trên hiệu quả.',
    keyFact: 'Mỗi centimeter đầu nhô về phía trước (forward head posture) tăng tải lên cột sống cổ thêm 4–5 kg — sau 8 giờ ngồi màn hình, cơ cổ gánh thêm 20–25 kg tải dư thừa.',
    details: [
      'Chin tuck (kéo cằm về sau): không cúi đầu mà kéo cằm ngang về phía sau, tạo "double chin" nhẹ. 10 lần × giữ 3 giây — bài tập đơn giản nhất để chống forward head posture và kích hoạt cơ cổ sâu.',
      'Shoulder roll 10–15 vòng mỗi chiều: giải phóng cơ thang trên (upper trapezius) và levator scapulae — hai cơ co cứng nhất ở người ngồi nhiều và gây đau cổ vai gáy kinh điển.',
      'Doorway stretch: đứng trong khung cửa, hai tay bám ngang vai, nghiêng người ra trước để cảm nhận căng cơ ngực — kéo giãn pectoralis minor thường co rút khiến vai đổ về phía trước.',
      'Scapular squeeze: kéo hai bả vai về phía nhau, giữ 5 giây, lặp 10–15 lần — kích hoạt rhomboid và lower trapezius, hai cơ thường bị ức chế do ngồi sai tư thế kéo dài.',
      'Thoracic twist: ngồi thẳng, đặt tay đối diện lên vai, xoay thân mình (không phải lưng dưới) từng bên 5–8 lần — cột sống ngực cứng gây đau cổ và lưng dưới bù trừ.',
      'Thứ tự lý tưởng: Chin tuck → Shoulder roll → Thoracic twist → Doorway stretch → Scapular squeeze. 5–8 phút đủ cho một session phục hồi cổ vai gáy hoàn chỉnh.',
    ],
    points: [
      { icon: '🎯', label: 'Chin tuck', note: 'Chống forward head posture' },
      { icon: '🔄', label: 'Shoulder roll 2 chiều', note: 'Giải phóng cơ thang trên' },
      { icon: '🚪', label: 'Doorway stretch', note: 'Kéo giãn cơ ngực nhỏ' },
      { icon: '🦋', label: 'Scapular squeeze', note: 'Kích hoạt rhomboid + lower trap' },
    ],
  },
  {
    zone: 'Lưng', icon: '🫀',
    exercises: ['Dead bug 10 lần', 'Bird-dog 10 lần', 'Glute bridge 15 lần', 'Child pose 1 phút', 'Hip flexor stretch'],
    label: 'Phục Hồi Vùng Lưng',
    color: '#818cf8', rgb: '129,140,248',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    detail: '5 bài tập kết hợp kích hoạt cơ lõi, giải phóng cơ gấp hông và kéo giãn — tiếp cận đau lưng từ nhiều góc độ khác nhau.',
    keyFact: '90% trường hợp đau lưng dưới không đặc hiệu có thể cải thiện đáng kể chỉ bằng tập luyện đúng — và 3 nhóm cơ quan trọng nhất cần kích hoạt là cơ lõi, cơ mông và cơ đùi sau.',
    details: [
      'Dead bug: nằm ngửa, tay giơ thẳng lên, chân gập 90°, hạ tay và chân đối diện cùng lúc mà không để lưng dưới rời sàn. Kích hoạt transversus abdominis (cơ bụng sâu nhất) — bài tập lõi an toàn nhất cho lưng đau.',
      'Bird-dog: quỳ bốn điểm, giơ tay phải và chân trái thẳng đồng thời, giữ 3 giây, đổi bên — 10 lần mỗi bên. Kích hoạt multifidus (cơ sâu dọc cột sống) và cải thiện ổn định lõi.',
      'Glute bridge 15 lần: nằm ngửa gối gập 90°, nâng hông lên, giữ 2 giây. Kích hoạt cơ mông (glutes) thường bị ức chế khi ngồi nhiều — mông yếu buộc lưng bù trừ và gây đau.',
      'Child pose 1 phút: kéo giãn erector spinae và QL (quadratus lumborum). Thở sâu hướng vào lưng khi ở tư thế này — mỗi nhịp thở ra giúp cơ buông lỏng thêm.',
      'Hip flexor stretch lunge 60 giây mỗi bên: psoas và iliacus căng do ngồi nhiều kéo lưng dưới ưỡn, nén đĩa đệm L4–L5 — đây thường là nguyên nhân sâu xa của đau lưng dưới mạn tính.',
      'Thứ tự lý tưởng: Dead bug → Bird-dog → Glute bridge → Hip flexor stretch → Child pose. Từ kích hoạt cơ lõi → kích hoạt mông → giải phóng cơ đối kháng → thư giãn hoàn toàn.',
    ],
    points: [
      { icon: '🐛', label: 'Dead bug', note: 'Kích hoạt cơ lõi sâu an toàn nhất' },
      { icon: '🐦', label: 'Bird-dog', note: 'Kích hoạt multifidus dọc cột sống' },
      { icon: '🍑', label: 'Glute bridge', note: 'Kích hoạt mông — giảm tải lưng' },
      { icon: '🧘', label: 'Child pose', note: 'Kéo giãn và thư giãn hoàn toàn' },
    ],
  },
  {
    zone: 'Gối', icon: '🦵',
    exercises: ['Sit-to-stand 10 lần', 'Glute bridge 15 lần', 'Calf raise 15 lần', 'Split squat bám tường (nhẹ)', 'Hamstring stretch'],
    label: 'Phục Hồi Vùng Gối',
    color: '#e879f9', rgb: '232,121,249',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    detail: '5 bài tập tăng cường cơ xung quanh gối, cải thiện linh hoạt gân kheo và tăng khả năng chịu lực — không cần thiết bị.',
    keyFact: 'Gối đau không phải do gối "yếu" — mà do cơ mông, đùi và bắp chân yếu khiến gối chịu tải không cân bằng. Tăng sức mạnh cơ xung quanh = giảm đau gối hiệu quả.',
    details: [
      'Sit-to-stand 10 lần: đứng lên ngồi xuống từ ghế, không dùng tay — vừa là bài test vừa là bài tập. Kích hoạt quadriceps và glutes, tăng dần tải lên gối theo cách kiểm soát an toàn.',
      'Glute bridge 15 lần: kích hoạt cơ mông giảm tải gối. Mông yếu làm gối bị kéo vào trong (knee valgus) khi đứng và vận động — nguyên nhân phổ biến nhất của đau gối trước.',
      'Calf raise 15 lần: tăng sức mạnh cơ bắp chân và gân Achilles — hỗ trợ hấp thu lực va chạm từ dưới lên, giảm tải trọng truyền lên gối khi đi lại mỗi ngày.',
      'Split squat bám tường: squat một chân với tường đỡ thăng bằng, chỉ xuống đến mức gối không đau, lên chậm. Bài tập đơn hướng an toàn nhất cho gối đau nhẹ đến trung bình.',
      'Hamstring stretch 60 giây mỗi bên: gân kheo căng tăng tải lên mặt sau gối và giảm phạm vi vận động — kéo giãn hamstring giảm trực tiếp áp lực lên khớp gối sau.',
      'Lưu ý quan trọng: nếu đau gối cấp tính, sưng tấy, hoặc đau khi leo cầu thang ngay cả nhẹ — cần gặp bác sĩ hoặc PT trước khi tự tập. 5 bài này phù hợp cho đau gối mạn tính nhẹ đến trung bình.',
    ],
    points: [
      { icon: '🪑', label: 'Sit-to-stand', note: 'Kích hoạt quad và glute cùng lúc' },
      { icon: '🍑', label: 'Glute bridge', note: 'Chống knee valgus — đau gối trước' },
      { icon: '🦶', label: 'Calf raise', note: 'Hấp thu lực — giảm tải gối' },
      { icon: '⚠️', label: 'Đau cấp tính', note: 'Gặp bác sĩ trước khi tự tập' },
    ],
  },
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
  { name: 'Thở cơ hoành', steps: 'Tay lên bụng • Hít mũi → bụng phồng • Thở miệng chậm • Ngực ít nâng', time: '1–3 phút', use: 'Trước ngủ, sau tập, khi căng thẳng' },
  { name: 'Box breathing', steps: 'Hít 4 giây • Giữ 4 giây • Thở 4 giây • Giữ 4 giây • Lặp 4 vòng', time: '4 vòng', use: 'Trước tập, lúc stress, trước ngủ' },
  { name: 'Thở ra dài hơn', steps: 'Hít 4 giây • Thở ra 6 giây • Lặp 6–10 vòng', time: '2–3 phút', use: 'Khó ngủ, tim đập nhanh, sau ngày mệt' },
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
  const { t: tCommon } = useTranslation('common');
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
            >{tCommon('modal.prev')}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {C0_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{tCommon('modal.next')}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ─── C1StepModal ─────────────────────────────────────────────────────────────

function C1StepModal({ step, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t: tCommon } = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');
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
              {tPillars('pillarC.c1_step_prefix', { defaultValue: 'Bước' })} {step.step}
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
            >{tCommon('modal.prev')}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {C1_STEPS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{tCommon('modal.next')}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
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
  const { t: tCommon } = useTranslation('common');
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

          <p className="text-center text-xs text-muted opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function PillarC() {
  const { t: tPillars } = useTranslation('pillars');
  const { t: tCommon } = useTranslation('common');
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
  const [sleepChecks, setSleepChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_c1_sleep_checks')) || {}; } catch { return {}; }
  });
  const [scoreChecks, setScoreChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_c0_score_checks')) || {}; } catch { return {}; }
  });
  const [neatChecks, setNeatChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_c3_neat_checks')) || {}; } catch { return {}; }
  });
  const [openZone, setOpenZone] = useState(null);
  const [zoneModalIdx, setZoneModalIdx] = useState(null);
  const [scoreModalIdx, setScoreModalIdx] = useState(null);
  const [trackModalIdx, setTrackModalIdx] = useState(null);
  const [sleepChecklistModal, setSleepChecklistModal] = useState(null);
  const [neatChecklistModal, setNeatChecklistModal] = useState(null);
  const [neatIdeaModal, setNeatIdeaModal] = useState(null);
  const [morningMode, setMorningMode] = useState('5');
  const [morningModalIdx, setMorningModalIdx] = useState(null);
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

  useEffect(() => {
    localStorage.setItem('healthapp_c0_score_checks', JSON.stringify(scoreChecks));
  }, [scoreChecks]);

  useEffect(() => {
    localStorage.setItem('healthapp_c1_sleep_checks', JSON.stringify(sleepChecks));
  }, [sleepChecks]);

  useEffect(() => {
    localStorage.setItem('healthapp_c3_neat_checks', JSON.stringify(neatChecks));
  }, [neatChecks]);

  const tabsTr = Array.isArray(pillar?.hub_tabs) ? pillar.hub_tabs : [];
  const mergedTabs = TABS.map((t, i) => ({ ...t, label: tabsTr[i]?.label || t.label }));

  const c1StepsTr = tPillars('pillarC.c1_steps', { returnObjects: true });
  const localC1Steps = C1_STEPS.map((s, i) => ({
    ...s,
    ...(Array.isArray(c1StepsTr) && c1StepsTr[i] ? c1StepsTr[i] : {}),
  }));

  const c3LevelsTr = tPillars('pillarC.c3_levels', { returnObjects: true });
  const localC3Levels = C3_LEVELS.map((l, i) => ({
    ...l,
    ...(Array.isArray(c3LevelsTr) && c3LevelsTr[i] ? c3LevelsTr[i] : {}),
  }));

  const c0ItemsTr = tPillars('pillarC.c0_items', { returnObjects: true });
  const localC0Items = C0_ITEMS.map((item, i) => ({
    ...item,
    ...(Array.isArray(c0ItemsTr) && c0ItemsTr[i] ? c0ItemsTr[i] : {}),
  }));

  const c0ScoreTr = tPillars('pillarC.c0_score', { returnObjects: true });
  const localC0Score = C0_SCORE.map((row, i) => ({
    ...row,
    ...(Array.isArray(c0ScoreTr) && c0ScoreTr[i] ? c0ScoreTr[i] : {}),
  }));

  const c2Morning5Tr = tPillars('pillarC.c2_morning_5', { returnObjects: true });
  const localC2Morning5 = C2_MORNING_5.map((row, i) => ({
    ...row,
    ...(Array.isArray(c2Morning5Tr) && c2Morning5Tr[i] ? c2Morning5Tr[i] : {}),
  }));

  const c2Morning10Tr = tPillars('pillarC.c2_morning_10', { returnObjects: true });
  const localC2Morning10 = C2_MORNING_10.map((row, i) => ({
    ...row,
    ...(Array.isArray(c2Morning10Tr) && c2Morning10Tr[i] ? c2Morning10Tr[i] : {}),
  }));

  const c2EnergyTipsTr = tPillars('pillarC.c2_energy_tips', { returnObjects: true });
  const localC2EnergyTips = C2_ENERGY_TIPS.map((t, i) => ({
    ...t,
    ...(Array.isArray(c2EnergyTipsTr) && c2EnergyTipsTr[i] ? c2EnergyTipsTr[i] : {}),
  }));

  const tab = mergedTabs.find(t => t.id === activeTab) || mergedTabs[1];
  const sleepProgress = C1_CHECKLIST.filter((_, i) => sleepChecks[i]).length;
  const neatProgress = [0, 1, 2, 3].filter(i => neatChecks[i]).length;
  const lifestyleScore = C0_SCORE.reduce((sum, row, i) => sum + (scoreChecks[i] ? row.pts : 0), 0);

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
        ← {tCommon('nav.pillars')}
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
        {(() => {
          const heroStatsTr = tPillars('pillarC.c_hero_stats', { returnObjects: true });
          const baseStats = [
            { v: '7–9h', l: 'Ngủ mỗi đêm', tip: 'Người lớn cần 7–9 giờ ngủ để phục hồi tối ưu. Ngủ kém làm giảm hiệu quả tập luyện và kiểm soát ăn uống.' },
            { v: '300+', l: 'kcal NEAT/ngày', tip: 'NEAT (Non-Exercise Activity Thermogenesis) có thể đốt 300–500 kcal/ngày mà không cần tập gym.' },
            { v: '8 module', l: 'Lối sống C0–C7', tip: '8 module từ đánh giá ban đầu đến thiết kế môi trường, bao phủ toàn bộ nhịp sống 24h.' },
            { v: '1%', l: 'Cải thiện mỗi ngày', tip: 'Triết lý cốt lõi: không cần hoàn hảo ngay. Sửa 1% mỗi ngày đúng chỗ tạo nên sự thay đổi bền vững.' },
          ];
          const stats = baseStats.map((s, i) => ({
            ...s,
            ...(Array.isArray(heroStatsTr) && heroStatsTr[i] ? heroStatsTr[i] : {}),
          }));
          return stats;
        })().map((s, i) => (
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
          {mergedTabs.map(t => {
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
                <h2 className="text-2xl font-bold mb-1" style={{ color: TEAL }}>{tPillars('pillarC.c0_heading', { defaultValue: 'Đánh Giá Lối Sống Ban Đầu' })}</h2>
                <p className="text-muted text-lg mb-6">{tPillars('pillarC.c0_desc', { defaultValue: 'Biết điểm xuất phát trước khi thay đổi. Không đánh giá để phán xét — đánh giá để chọn điểm bắt đầu đúng nhất.' })}</p>
                <div className="grid gap-3 mb-6">
                  {localC0Items.map((item, i) => (
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
                        {tCommon('modal.see_detail_label')}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: TEAL }}>{tPillars('pillarC.c0_score_heading', { defaultValue: 'Lifestyle Score — 100 điểm' })}</h3>
                <div className="space-y-1.5 mb-3">
                  {localC0Score.map((row, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl group transition-all"
                      style={{
                        border: '1px solid',
                        borderColor: scoreChecks[i] ? `rgba(${row.rgb},0.35)` : scoreModalIdx === i ? `rgba(${row.rgb},0.25)` : 'rgba(255,255,255,0.05)',
                        background: scoreChecks[i] ? `rgba(${row.rgb},0.07)` : 'transparent',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}>
                      {/* Checkbox zone */}
                      <button
                        onClick={() => setScoreChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all"
                        style={{ cursor: 'pointer' }}
                        aria-label={scoreChecks[i] ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}
                      >
                        <div className="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all"
                          style={{
                            borderColor: scoreChecks[i] ? row.color : 'rgba(255,255,255,0.25)',
                            background: scoreChecks[i] ? row.color : 'transparent',
                            boxShadow: scoreChecks[i] ? `0 0 8px rgba(${row.rgb},0.5)` : 'none',
                          }}>
                          {scoreChecks[i] && (
                            <svg viewBox="0 0 12 10" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5">
                              <path d="M1 5l3.5 3.5L11 1"/>
                            </svg>
                          )}
                        </div>
                      </button>
                      {/* Label + modal zone */}
                      <button onClick={() => setScoreModalIdx(i)}
                        className="flex-1 flex items-center justify-between text-lg py-2 pr-3 text-left group/label cursor-pointer"
                      >
                        <span className={`flex items-center gap-2 transition-colors ${scoreChecks[i] ? 'text-text' : 'text-muted group-hover/label:text-text'}`}>
                          <span className="text-base">{row.icon}</span>
                          <span className={scoreChecks[i] ? 'line-through opacity-60' : ''}>{row.label}</span>
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold opacity-0 group-hover/label:opacity-100 transition-opacity" style={{ color: row.color }}>{tCommon('modal.see_detail')}</span>
                          <span className="font-bold tabular-nums" style={{ color: scoreChecks[i] ? row.color : `rgba(${row.rgb},0.5)` }}>{row.pts} đ</span>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                {/* Score total bar */}
                <div className="mb-6 p-3 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.07)`, border: `1px solid rgba(${TEAL_RGB},0.18)` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: TEAL }}>{tPillars('pillarC.c0_score_total_label', { defaultValue: 'Tổng điểm hôm nay' })}</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: lifestyleScore >= 80 ? '#22c55e' : lifestyleScore >= 50 ? TEAL : '#f59e0b' }}>
                      {lifestyleScore} <span className="text-sm font-semibold opacity-60">/ 100</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: `rgba(${TEAL_RGB},0.15)` }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${lifestyleScore}%`,
                        background: lifestyleScore >= 80
                          ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                          : lifestyleScore >= 50
                          ? `linear-gradient(90deg,${TEAL},#0d9488)`
                          : 'linear-gradient(90deg,#f59e0b,#d97706)',
                      }} />
                  </div>
                  <p className="text-xs text-muted mt-1.5">
                    {lifestyleScore >= 80
                      ? tPillars('pillarC.c0_score_msg_excellent', { defaultValue: '🏆 Xuất sắc — lối sống rất tốt!' })
                      : lifestyleScore >= 50
                      ? tPillars('pillarC.c0_score_msg_good', { defaultValue: '✦ Tốt — tiếp tục duy trì!' })
                      : tPillars('pillarC.c0_score_msg_start', { defaultValue: '💪 Bắt đầu tích điểm từng ngày' })}
                  </p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: `rgba(${TEAL_RGB},0.08)`, border: `1px solid rgba(${TEAL_RGB},0.2)` }}>
                  <p className="text-lg font-semibold mb-3" style={{ color: TEAL }}>{tPillars('pillarC.c0_tracks_heading', { defaultValue: 'Chọn track phù hợp với bạn:' })}</p>
                  <div className="grid gap-2">
                    {C0_TRACKS.map((tr, i) => (
                      <button key={i} onClick={() => setTrackModalIdx(i)}
                        className="w-full p-2 rounded-lg text-lg text-left group cursor-pointer transition-all hover:bg-white/5"
                        style={{ background: `rgba(${tr.rgb},0.06)`, border: `1px solid rgba(${tr.rgb},0.15)`, transition: 'border-color 0.2s, background 0.2s' }}>
                        <span className="flex items-center justify-between">
                          <span>
                            <span className="font-semibold text-text">{tr.label}</span>
                            <span className="text-muted"> — {tr.desc}</span>
                          </span>
                          <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3" style={{ color: tr.color }}>{tCommon('modal.see_detail')}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Link to="/pillar/c/assessment" className="inline-flex items-center gap-2 text-lg font-semibold" style={{ color: TEAL }}>
              {tPillars('pillarC.c0_full_link', { defaultValue: 'Xem đánh giá đầy đủ →' })}
            </Link>
          </RevealBlock>
        )}

        {/* C1 — Giấc Ngủ */}
        {activeTab === 'c1' && (
          <RevealBlock>
            <div className={`${tab.frame} rounded-2xl mb-6`}>
              <div className="rounded-2xl bg-surface p-5 md:p-6">
                <h2 className="text-2xl font-bold mb-1" style={{ color: TEAL }}>{tPillars('pillarC.c1_heading', { defaultValue: 'Vệ Sinh Giấc Ngủ 4 Bước' })}</h2>
                <p className="text-muted text-lg mb-6">{tPillars('pillarC.c1_desc', { defaultValue: 'Ngủ không phải là "thời gian chết". Ngủ là lúc cơ thể sửa chữa cơ bắp, cân bằng hormone và phục hồi tâm lý.' })}</p>
                <div className="grid gap-3 mb-8">
                  {localC1Steps.map((s, i) => (
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
                        <div className="font-semibold text-text text-lg">{tPillars('pillarC.c1_step_prefix', { defaultValue: 'Bước' })} {s.step}: {s.title}</div>
                        <div className="text-muted text-base mt-1 leading-relaxed">{s.desc}</div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                        {tCommon('modal.see_detail_label')}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: TEAL }}>{tPillars('pillarC.c1_checklist_heading', { defaultValue: 'Checklist Ngủ Hằng Ngày' })}</h3>
                <div className="space-y-1.5 mb-4">
                  {C1_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl group transition-all"
                      style={{
                        border: '1px solid',
                        borderColor: sleepChecks[i] ? `rgba(${item.rgb},0.35)` : sleepChecklistModal === i ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.05)',
                        background: sleepChecks[i] ? `rgba(${item.rgb},0.07)` : 'transparent',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}>
                      {/* Checkbox */}
                      <button onClick={() => setSleepChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                        aria-label={sleepChecks[i] ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all"
                          style={{
                            borderColor: sleepChecks[i] ? item.color : 'rgba(255,255,255,0.25)',
                            background: sleepChecks[i] ? item.color : 'transparent',
                            boxShadow: sleepChecks[i] ? `0 0 8px rgba(${item.rgb},0.5)` : 'none',
                          }}>
                          {sleepChecks[i] && (
                            <svg viewBox="0 0 12 10" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5">
                              <path d="M1 5l3.5 3.5L11 1"/>
                            </svg>
                          )}
                        </div>
                      </button>
                      {/* Label + detail trigger */}
                      <button onClick={() => setSleepChecklistModal(i)}
                        className="flex-1 flex items-center justify-between py-2 pr-3 text-left group/label cursor-pointer">
                        <span className={`flex items-center gap-2 text-lg transition-colors ${sleepChecks[i] ? 'text-text' : 'text-muted group-hover/label:text-text'}`}>
                          <span className="text-base">{item.icon}</span>
                          <span className={sleepChecks[i] ? 'line-through opacity-60' : ''}>{item.label}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover/label:opacity-100 transition-opacity shrink-0 ml-2" style={{ color: item.color }}>
                          {tCommon('modal.see_detail_label')}
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                        </span>
                      </button>
                    </div>
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
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#06b6d4' }}>{tPillars('pillarC.c2_heading', { defaultValue: 'Nhịp Sinh Học & Năng Lượng' })}</h2>
                <p className="text-muted text-lg mb-6">{tPillars('pillarC.c2_desc', { defaultValue: 'Năng lượng không chỉ đến từ cà phê. Năng lượng đến từ ánh sáng, nước, vận động nhẹ, bữa ăn và nhịp làm việc đúng.' })}</p>
                <div className="flex gap-2 mb-5">
                  {['5', '10'].map(m => (
                    <button key={m} onClick={() => setMorningMode(m)}
                      className="px-3 py-1.5 rounded-lg text-lg font-semibold transition-all"
                      style={morningMode === m
                        ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }
                        : { color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}>
                      {tPillars('pillarC.c2_routine_label', { defaultValue: 'Routine sáng {m} phút' }).replace('{m}', m)}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 mb-7">
                  {(morningMode === '5' ? localC2Morning5 : localC2Morning10).map((row, i) => (
                    <div key={i}
                      onClick={() => setMorningModalIdx(i)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group transition-all hover:bg-white/5"
                      style={{ background: `rgba(${row.rgb},0.05)`, border: `1px solid rgba(${row.rgb},0.15)`, transition: 'border-color 0.2s, background 0.2s' }}>
                      <span className="text-base font-bold tabular-nums w-12 shrink-0" style={{ color: row.color }}>{row.time}</span>
                      <span className="text-lg text-text flex-1">{row.action}</span>
                      <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: row.color }}>{tCommon('modal.see_detail')}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#06b6d4' }}>{tPillars('pillarC.c2_energy_heading', { defaultValue: '5 Yếu Tố Tạo Năng Lượng' })}</h3>
                <div className="grid gap-2">
                  {localC2EnergyTips.map((t, i) => (
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
                        {tCommon('modal.see_detail_label')}
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
                  {localC3Levels.map((l, i) => (
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
                    <p className="text-lg font-bold" style={{ color: '#10b981' }}>{tPillars('pillarC.c3_standup_title', { defaultValue: '⏱ Quy tắc đứng dậy 2 phút' })}</p>
                    <span className="flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#10b981' }}>
                      {tCommon('modal.see_detail_label')}
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                    </span>
                  </div>
                  <p className="text-base text-muted">{tPillars('pillarC.c3_standup_desc', { defaultValue: 'Mỗi 45–60 phút ngồi, đứng dậy 2 phút. Đi lấy nước, xoay vai, vươn người, calf raise. Đừng đợi đau mới đứng dậy.' })}</p>
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#10b981' }}>{tPillars('pillarC.c3_neat_checklist_heading', { defaultValue: 'NEAT Checklist' })}</h3>
                <div className="space-y-1.5 mb-4">
                  {C3_NEAT_CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl group transition-all"
                      style={{
                        border: '1px solid',
                        borderColor: neatChecks[i] ? `rgba(${item.rgb},0.35)` : neatChecklistModal === i ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.05)',
                        background: neatChecks[i] ? `rgba(${item.rgb},0.07)` : 'transparent',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}>
                      {/* Checkbox */}
                      <button onClick={() => setNeatChecks(p => ({ ...p, [i]: !p[i] }))}
                        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl"
                        aria-label={neatChecks[i] ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all"
                          style={{
                            borderColor: neatChecks[i] ? item.color : 'rgba(255,255,255,0.25)',
                            background: neatChecks[i] ? item.color : 'transparent',
                            boxShadow: neatChecks[i] ? `0 0 8px rgba(${item.rgb},0.5)` : 'none',
                          }}>
                          {neatChecks[i] && (
                            <svg viewBox="0 0 12 10" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-2.5">
                              <path d="M1 5l3.5 3.5L11 1"/>
                            </svg>
                          )}
                        </div>
                      </button>
                      {/* Label + detail trigger */}
                      <button onClick={() => setNeatChecklistModal(i)}
                        className="flex-1 flex items-center justify-between py-2 pr-3 text-left group/label cursor-pointer">
                        <span className={`flex items-center gap-2 text-lg transition-colors ${neatChecks[i] ? 'text-text' : 'text-muted group-hover/label:text-text'}`}>
                          <span className="text-base">{item.icon}</span>
                          <span className={neatChecks[i] ? 'line-through opacity-60' : ''}>{item.label}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold opacity-0 group-hover/label:opacity-100 transition-opacity shrink-0 ml-2" style={{ color: item.color }}>
                          {tCommon('modal.see_detail_label')}
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${neatProgress / 4 * 100}%`, background: '#10b981' }} />
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#10b981' }}>Ý tưởng tăng NEAT</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {C3_IDEAS.map((idea, i) => (
                    <button key={i} onClick={() => setNeatIdeaModal(i)}
                      className="flex items-center gap-2 text-base text-left p-2.5 rounded-lg group cursor-pointer transition-all hover:bg-white/5"
                      style={{
                        background: `rgba(${idea.rgb},0.05)`,
                        border: `1px solid rgba(${idea.rgb},0.12)`,
                        transition: 'border-color 0.2s, background 0.2s',
                      }}>
                      <span className="text-lg shrink-0">{idea.icon}</span>
                      <span className="flex-1 text-muted group-hover:text-text transition-colors">{idea.label}</span>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: idea.color }}>
                        {tCommon('modal.see_detail_label')}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
                      </span>
                    </button>
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
                    <div key={i} className="rounded-xl overflow-hidden border group"
                      style={{ borderColor: zoneModalIdx === i ? `rgba(${z.rgb},0.4)` : 'rgba(167,139,250,0.15)', transition: 'border-color 0.2s' }}>
                      <div className="flex items-center justify-between p-3" style={{ background: `rgba(${z.rgb},0.06)` }}>
                        <button onClick={() => setZoneModalIdx(i)}
                          className="flex items-center gap-2 font-semibold text-lg text-text flex-1 text-left hover:opacity-80 transition-opacity">
                          <span>{z.icon}</span>{z.zone}
                          <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ml-2" style={{ color: z.color }}>{tCommon('modal.see_detail')}</span>
                        </button>
                        <button onClick={() => setOpenZone(openZone === i ? null : i)} className="px-2 py-1" style={{ color: z.color }}>
                          {openZone === i ? '▲' : '▼'}
                        </button>
                      </div>
                      {openZone === i && (
                        <div className="p-3 space-y-1">
                          {z.exercises.map((ex, j) => (
                            <div key={j} className="text-base text-muted flex items-center gap-2">
                              <span style={{ color: z.color }}>•</span>{ex}
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
                      <span className="text-xs font-bold shrink-0 self-center px-2 py-1 rounded-lg opacity-60" style={{ color: m.color, background: `rgba(${m.rgb},0.1)` }}>{tCommon('modal.see_detail')}</span>
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
          item={localC0Items[c0Idx]}
          idx={c0Idx}
          onClose={() => setC0Idx(null)}
          onPrev={() => setC0Idx(i => Math.max(0, i - 1))}
          onNext={() => setC0Idx(i => Math.min(localC0Items.length - 1, i + 1))}
          hasPrev={c0Idx > 0}
          hasNext={c0Idx < localC0Items.length - 1}
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
          item={localC3Levels[c3LevelIdx]}
          idx={c3LevelIdx}
          onClose={() => setC3LevelIdx(null)}
          onPrev={() => setC3LevelIdx(i => Math.max(0, i - 1))}
          onNext={() => setC3LevelIdx(i => Math.min(localC3Levels.length - 1, i + 1))}
          hasPrev={c3LevelIdx > 0}
          hasNext={c3LevelIdx < C3_LEVELS.length - 1}
        />
      )}

      {/* ── C2 morning routine modal ── */}
      {morningModalIdx !== null && (() => {
        const list = morningMode === '5' ? localC2Morning5 : localC2Morning10;
        return (
          <C0ItemModal
            item={list[morningModalIdx]}
            idx={morningModalIdx}
            onClose={() => setMorningModalIdx(null)}
            onPrev={() => setMorningModalIdx(i => Math.max(0, i - 1))}
            onNext={() => setMorningModalIdx(i => Math.min(list.length - 1, i + 1))}
            hasPrev={morningModalIdx > 0}
            hasNext={morningModalIdx < list.length - 1}
          />
        );
      })()}

      {/* ── C2 energy tips modal — reuses C0ItemModal (same data shape) ── */}
      {c2EnergyIdx !== null && (
        <C0ItemModal
          item={localC2EnergyTips[c2EnergyIdx]}
          idx={c2EnergyIdx}
          onClose={() => setC2EnergyIdx(null)}
          onPrev={() => setC2EnergyIdx(i => Math.max(0, i - 1))}
          onNext={() => setC2EnergyIdx(i => Math.min(C2_ENERGY_TIPS.length - 1, i + 1))}
          hasPrev={c2EnergyIdx > 0}
          hasNext={c2EnergyIdx < C2_ENERGY_TIPS.length - 1}
        />
      )}

      {/* ── C3 NEAT ideas modal ── */}
      {neatIdeaModal !== null && (
        <C0ItemModal
          item={C3_IDEAS[neatIdeaModal]}
          idx={neatIdeaModal}
          onClose={() => setNeatIdeaModal(null)}
          onPrev={() => setNeatIdeaModal(i => Math.max(0, i - 1))}
          onNext={() => setNeatIdeaModal(i => Math.min(C3_IDEAS.length - 1, i + 1))}
          hasPrev={neatIdeaModal > 0}
          hasNext={neatIdeaModal < C3_IDEAS.length - 1}
        />
      )}

      {/* ── C3 NEAT checklist modal ── */}
      {neatChecklistModal !== null && (
        <C0ItemModal
          item={C3_NEAT_CHECKLIST[neatChecklistModal]}
          idx={neatChecklistModal}
          onClose={() => setNeatChecklistModal(null)}
          onPrev={() => setNeatChecklistModal(i => Math.max(0, i - 1))}
          onNext={() => setNeatChecklistModal(i => Math.min(C3_NEAT_CHECKLIST.length - 1, i + 1))}
          hasPrev={neatChecklistModal > 0}
          hasNext={neatChecklistModal < C3_NEAT_CHECKLIST.length - 1}
        />
      )}

      {/* ── C1 sleep checklist modal ── */}
      {sleepChecklistModal !== null && (
        <C0ItemModal
          item={C1_CHECKLIST[sleepChecklistModal]}
          idx={sleepChecklistModal}
          onClose={() => setSleepChecklistModal(null)}
          onPrev={() => setSleepChecklistModal(i => Math.max(0, i - 1))}
          onNext={() => setSleepChecklistModal(i => Math.min(C1_CHECKLIST.length - 1, i + 1))}
          hasPrev={sleepChecklistModal > 0}
          hasNext={sleepChecklistModal < C1_CHECKLIST.length - 1}
        />
      )}

      {/* ── C0 score criterion modal ── */}
      {scoreModalIdx !== null && (
        <C0ItemModal
          item={localC0Score[scoreModalIdx]}
          idx={scoreModalIdx}
          onClose={() => setScoreModalIdx(null)}
          onPrev={() => setScoreModalIdx(i => Math.max(0, i - 1))}
          onNext={() => setScoreModalIdx(i => Math.min(C0_SCORE.length - 1, i + 1))}
          hasPrev={scoreModalIdx > 0}
          hasNext={scoreModalIdx < C0_SCORE.length - 1}
        />
      )}

      {/* ── C0 track modal ── */}
      {trackModalIdx !== null && (
        <C0ItemModal
          item={C0_TRACKS[trackModalIdx]}
          idx={trackModalIdx}
          onClose={() => setTrackModalIdx(null)}
          onPrev={() => setTrackModalIdx(i => Math.max(0, i - 1))}
          onNext={() => setTrackModalIdx(i => Math.min(C0_TRACKS.length - 1, i + 1))}
          hasPrev={trackModalIdx > 0}
          hasNext={trackModalIdx < C0_TRACKS.length - 1}
        />
      )}

      {/* ── C4 recovery zone modal ── */}
      {zoneModalIdx !== null && (
        <C0ItemModal
          item={C4_ZONES[zoneModalIdx]}
          idx={zoneModalIdx}
          onClose={() => setZoneModalIdx(null)}
          onPrev={() => setZoneModalIdx(i => Math.max(0, i - 1))}
          onNext={() => setZoneModalIdx(i => Math.min(C4_ZONES.length - 1, i + 1))}
          hasPrev={zoneModalIdx > 0}
          hasNext={zoneModalIdx < C4_ZONES.length - 1}
        />
      )}

      {/* ── C1 step modal — outside all RevealBlocks so position:fixed works ── */}
      {c1Idx !== null && (
        <C1StepModal
          step={localC1Steps[c1Idx]}
          idx={c1Idx}
          onClose={() => setC1Idx(null)}
          onPrev={() => setC1Idx(i => Math.max(0, i - 1))}
          onNext={() => setC1Idx(i => Math.min(localC1Steps.length - 1, i + 1))}
          hasPrev={c1Idx > 0}
          hasNext={c1Idx < C1_STEPS.length - 1}
        />
      )}
    </div>
  );
}
