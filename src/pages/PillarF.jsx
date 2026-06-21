import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThoughtBubble from '../components/ThoughtBubble';

const COLOR = '#f97316';
const RGB = '249,115,22';

// --- Orbit ring CSS ---
const ORBIT_CSS = `
  @property --pf-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
  @keyframes pfOrbitSpin { to { --pf-orbit-angle: 360deg; } }
  .pf-orbit-ring {
    background: conic-gradient(
      from var(--pf-orbit-angle),
      transparent 0deg, transparent 55deg,
      rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
      rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
      rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
    );
    animation: pfOrbitSpin 3.5s linear infinite;
  }
  @keyframes pb-frame-f0 { 0%,100% { border-color: rgba(249,115,22,0.15); } 50% { border-color: rgba(249,115,22,0.45); } }
  @keyframes pb-frame-f1 { 0%,100% { border-color: rgba(249,115,22,0.15); } 50% { border-color: rgba(249,115,22,0.4); } }
  @keyframes pfTitleShimmer {
    0%   { background-position: -280% center; }
    100% { background-position: 280% center; }
  }
  @keyframes pfAmpFire {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(249,115,22,0.5)) drop-shadow(0 0 14px rgba(251,146,60,0.3)); transform: rotate(-3deg) scale(1); }
    50%       { filter: drop-shadow(0 0 20px rgba(249,115,22,1)) drop-shadow(0 0 36px rgba(253,186,116,0.6)); transform: rotate(3deg) scale(1.12); }
  }
  .pf-title-word {
    background: linear-gradient(90deg,
      #ffffff 0%, #ffffff 22%,
      #fdba74 36%, #f97316 48%, #fbbf24 57%, #fb923c 65%,
      #ffffff 80%, #ffffff 100%
    );
    background-size: 310% auto;
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent; color: transparent;
    animation: pfTitleShimmer 5.5s linear infinite;
  }
  .pf-title-amp {
    -webkit-text-fill-color: #fb923c; color: #fb923c;
    display: inline-block;
    animation: pfAmpFire 2s ease-in-out infinite;
  }
`;

const TABS = [
  { id: 'f0', label: 'Dashboard', icon: '📊', frame: 'pb-frame-f0' },
  { id: 'f1', label: 'Checklist', icon: '✅', frame: 'pb-frame-f1' },
  { id: 'f2', label: 'Nhật Ký Tập', icon: '🏋️', frame: 'pb-frame-f0' },
  { id: 'f3', label: 'Thực Đơn', icon: '🍽️', frame: 'pb-frame-f1' },
  { id: 'f4', label: 'Lifestyle', icon: '💤', frame: 'pb-frame-f0' },
  { id: 'f5', label: 'Tâm Trí', icon: '🧘', frame: 'pb-frame-f1' },
  { id: 'f6', label: 'Test 4 Tuần', icon: '📈', frame: 'pb-frame-f0' },
  { id: 'f7', label: 'Thư Viện', icon: '⚡', frame: 'pb-frame-f1' },
];

// --- Hero stats ---
const HERO_STATS = [
  { v: '8', l: 'Module', tip: 'Checklist, nhật ký tập, meal plan, lifestyle, tâm trí, test, thư viện, dashboard' },
  { v: '12', l: 'Tuần', tip: '12-week roadmap với 4 giai đoạn rõ ràng: nền tảng → đo tiến bộ → cá nhân hóa → tự vận hành' },
  { v: '100', l: 'Điểm/ngày', tip: 'Hệ thống Health Score 100 điểm: vận động 25đ, dinh dưỡng 20đ, nước 10đ, ngủ 15đ, NEAT 15đ, tâm trí 10đ, ghi nhật ký 5đ' },
  { v: '5', l: 'Phút/ngày', tip: 'Bài tập tối thiểu 5 phút/ngày đủ để duy trì chuỗi thói quen khi quá bận' },
];

// --- Daily checklist data ---
const DAILY_MIN = [
  {
    label: 'Vận động ít nhất 10 phút', icon: '🏃', cat: 'A',
    tip: 'Bất kỳ: đi bộ, leo cầu thang, đạp xe đều tính',
    img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nghiên cứu JAMA 2019 trên 120,000 người cho thấy 10 phút vận động/ngày đã giảm nguy cơ tử vong sớm 15%. Không cần gym, không cần đồ thể thao đặc biệt — chỉ cần di chuyển.',
    details: [
      '10 phút vận động liên tục đủ để kích hoạt hệ tim mạch và giải phóng endorphin. Tất cả đều tính: đi bộ nhanh, leo cầu thang, đạp xe, bơi lội, nhảy dây, chơi với con.',
      'Tích lũy được: 3 lần × 10 phút = 30 phút, tương đương về lợi ích tim mạch với 1 lần × 30 phút liên tục theo ACSM (American College of Sports Medicine).',
      'Thời điểm tốt nhất là thời điểm bạn thực sự làm được. Sáng sớm đặt tông tích cực; buổi tối xả stress. Không có thời điểm "hoàn hảo" nào cả.',
      '"2-minute rule": nếu không muốn tập, cam kết chỉ 2 phút. Khi bắt đầu rồi, 90% người tiếp tục quá 10 phút nhờ quán tính của hành động.',
      'Habit stack — gắn với hành vi có sẵn: sau ăn sáng, trước khi tắm, lúc chờ con. Không cần thêm thời gian riêng, chỉ cần ghép vào lịch đã có.',
      'Mục tiêu dài hạn là 150 phút/tuần (WHO) — nhưng 10 phút/ngày là ngưỡng khởi đầu đã được chứng minh và bền vững nhất để xây thói quen từ đầu.',
    ],
    points: [
      { icon: '⏱️', label: '10 Phút Là Đủ', note: 'Bắt đầu từ 10 phút — ngưỡng có bằng chứng khoa học' },
      { icon: '🎯', label: 'Mọi Hoạt Động Tính', note: 'Đi bộ, leo thang, đạp xe — không bắt buộc phải đến gym' },
      { icon: '🧠', label: 'Cải Thiện Tâm Trạng', note: 'Endorphin tăng trong 5 phút đầu, kéo dài vài giờ' },
      { icon: '📈', label: 'Tích Lũy Hiệu Quả', note: '3 × 10 phút = lợi ích tim mạch tương đương 30 phút liên tục' },
    ],
  },
  {
    label: 'Ăn đủ 1 nguồn đạm mỗi bữa chính', icon: '🥩', cat: 'B',
    tip: 'Thịt/cá/trứng/đậu phụ — chọn 1 nguồn là đủ',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient duy nhất không tích trữ được trong cơ thể — cần nạp đều qua từng bữa. 20–30g protein/bữa là ngưỡng tối ưu cho tổng hợp cơ, no lâu và kiểm soát đường huyết ổn định.',
    details: [
      'Mỗi bữa chính nên có 1 nguồn đạm rõ ràng: ức gà (~25g/100g), cá (~20g/100g), trứng (~6g/quả), thịt bò (~25g/100g), đậu phụ cứng (~8g/100g), đậu lăng nấu chín (~9g/100g).',
      'Protein giúp no lâu hơn carb và fat nhờ thermic effect cao nhất (cơ thể đốt 20–30% calo từ protein chỉ để tiêu hóa) — hỗ trợ kiểm soát cân nặng tự nhiên.',
      'Đạm thực vật và động vật đều có giá trị. Kết hợp 2 nguồn thực vật (gạo + đậu) cho amino acid profile đầy đủ tương đương thịt — không cần phải ăn thịt mỗi bữa.',
      'Phân bổ đều 3 bữa tốt hơn dồn buổi tối — cơ thể hấp thu và sử dụng hiệu quả hơn cho tổng hợp protein cơ và phục hồi (theo protein timing research).',
      'Dấu hiệu thiếu đạm: mệt mỏi dai dẳng, tóc và móng yếu, vết thương lành chậm, thèm đồ ngọt sau bữa ăn (cơ thể tìm năng lượng nhanh thay thế).',
      'Quy tắc đơn giản: nhìn vào đĩa ăn — không thấy nguồn đạm rõ ràng thì thêm 1 quả trứng hoặc 1 hộp sữa chua Hy Lạp. Dễ thực hiện nhất, tác động ngay.',
    ],
    points: [
      { icon: '🥚', label: '20–30g / Bữa', note: 'Ngưỡng tối ưu tổng hợp cơ và no lâu' },
      { icon: '🐟', label: 'Đa Dạng Nguồn', note: 'Thịt/cá/trứng/đậu — đổi xoay để đủ amino acid' },
      { icon: '⏰', label: 'Chia Đều 3 Bữa', note: 'Không dồn buổi tối — hấp thu và sử dụng tốt hơn' },
      { icon: '💪', label: 'Giữ Khối Cơ', note: 'Quan trọng sau 30 tuổi — cơ tự thoái hóa ~1%/năm' },
    ],
  },
  {
    label: 'Ăn ít nhất 2 phần rau/trái cây', icon: '🥗', cat: 'B',
    tip: '1 nắm tay = 1 phần. Ăn đa màu sắc càng tốt',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị ≥5 phần (400g) rau quả/ngày. 2 phần là ngưỡng khởi đầu thực tế — mỗi phần thêm giảm 4% nguy cơ tim mạch và 3% nguy cơ ung thư (phân tích 95 nghiên cứu, 2019).',
    details: [
      '1 phần = 1 nắm tay (~80g): 1 quả chuối, 1 nắm rau cải, 3 muỗng canh rau nấu chín, 1 bát salad nhỏ, hoặc 1 ly nước ép nguyên chất không đường.',
      'Màu sắc = vi chất khác nhau: đỏ (lycopene - tim mạch), cam/vàng (beta-carotene - mắt), xanh lá (chlorophyll - gan), tím (anthocyanin - não), trắng (allicin - miễn dịch).',
      'Rau sống và rau nấu có lợi ích khác nhau. Kết hợp cả hai trong ngày là lý tưởng — không cần cầu kỳ, chỉ cần đa dạng.',
      'Fiber từ rau quả nuôi vi khuẩn đường ruột có lợi (prebiotics), giảm LDL, làm chậm hấp thu đường, và tạo no lâu. Không supplement nào thay thế được rau thật.',
      'Mẹo dễ nhất: thêm 1 nắm rau vào bất kỳ bữa nào; trái cây làm snack thay đồ ngọt; sinh tố rau/quả buổi sáng (5 phút, không cần chế biến phức tạp).',
      'Rau đông lạnh không kém tươi về dinh dưỡng — thường được đông lạnh ngay sau thu hoạch khi dưỡng chất cao nhất. Tiện và ít lãng phí hơn rau tươi.',
    ],
    points: [
      { icon: '🥦', label: '1 Nắm Tay = 1 Phần', note: '~80g — không cần cân, ước lượng bằng tay của bạn' },
      { icon: '🌈', label: 'Ăn Đa Màu Sắc', note: 'Mỗi màu = phytochemical bảo vệ sức khỏe khác nhau' },
      { icon: '🦠', label: 'Nuôi Đường Ruột', note: 'Fiber là thức ăn vi khuẩn có lợi — supplement không thay được' },
      { icon: '❄️', label: 'Đông Lạnh Vẫn Tốt', note: 'Dinh dưỡng ngang tươi — tiện lợi và ít lãng phí hơn' },
    ],
  },
  {
    label: 'Uống đủ nước theo nhu cầu cá nhân', icon: '💧', cat: 'C',
    tip: 'Cân nặng × 35 ml = mục tiêu ngày của bạn',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất nước chỉ 1–2% trọng lượng cơ thể giảm hiệu suất nhận thức 10–15% và thể chất 20–30%. Khát nước là dấu hiệu đã mất nước nhẹ — không nên đợi đến khi khát.',
    details: [
      'Công thức cá nhân: cân nặng (kg) × 35 ml = lượng cơ bản/ngày. 60kg → 2,100 ml; 70kg → 2,450 ml; 80kg → 2,800 ml. Thêm ~500 ml/giờ vận động mạnh hoặc trời nóng.',
      'Nước lọc là tốt nhất. Trà xanh không đường, cà phê vừa phải, và soup cũng tính. Nước ngọt và nước ép có đường KHÔNG tính vào tổng — chứa calo rỗng, không hydrate hiệu quả.',
      'Chia đều cả ngày: 1 ly khi thức dậy, 1 ly trước mỗi bữa ăn, 1 ly mỗi 2 tiếng khi làm việc, 1 ly nhỏ trước ngủ (không quá nhiều để tránh thức đêm).',
      'Màu nước tiểu là thước đo tốt nhất: vàng nhạt như nước rơm = đủ. Vàng đậm hoặc cam = cần uống thêm ngay. Trong suốt = có thể uống quá nhiều.',
      'Uống quá nhiều (>4L/ngày với người ít vận động) có thể gây hạ natri máu — hiếm nhưng nguy hiểm. Mục tiêu là uống ĐỦ, không phải uống càng nhiều càng tốt.',
      'Nhu cầu tăng khi: sốt (+500ml), ăn nhiều muối/protein, ngồi điều hòa lạnh nhiều giờ (không khí khô hút ẩm qua da và hơi thở), mang thai (+300ml).',
    ],
    points: [
      { icon: '📐', label: 'Công Thức Cá Nhân', note: 'Cân nặng (kg) × 35 ml = mục tiêu riêng của bạn' },
      { icon: '🌡️', label: 'Quan Sát Nước Tiểu', note: 'Vàng nhạt = đủ. Vàng đậm = uống thêm ngay' },
      { icon: '⏰', label: 'Chia Đều Cả Ngày', note: 'Uống dồn kém hiệu quả — thận chỉ xử lý ~1L/giờ' },
      { icon: '🚫', label: 'Không Đợi Khát', note: 'Khát = đã mất nước nhẹ rồi — uống trước khi khát' },
    ],
  },
  {
    label: 'Chuẩn bị/ngủ sớm hơn hôm qua', icon: '😴', cat: 'C',
    tip: 'Tắt màn hình 30 phút trước khi ngủ',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thêm 30 phút ngủ/đêm (từ 6.5h → 7h) giảm 24% nguy cơ bệnh tim và 14% nguy cơ tiểu đường theo nghiên cứu 500,000 người UK Biobank. Không cần ngủ hoàn hảo — chỉ cần tiến từng chút.',
    details: [
      'Mục tiêu không phải "ngủ sớm hơn 1 tiếng ngay" — mà là sớm hơn hôm qua 15–30 phút. Thay đổi đột ngột phá vỡ circadian rhythm. Tiến từ từ bền vững hơn.',
      '"Không xem điện thoại 30 phút trước ngủ" là quy tắc đơn giản nhất với tác động lớn nhất. Ánh sáng xanh từ màn hình ức chế melatonin (hormone ngủ) mạnh như ánh sáng ban ngày.',
      'Chuẩn bị môi trường: tắt đèn lớn → đèn nhỏ 60 phút trước; nhiệt độ phòng 18–20°C; phòng tối nhất có thể. Nhiệt độ là yếu tố môi trường tác động nhất đến chất lượng ngủ.',
      'Wind-down routine 20–30 phút: tắm nước ấm (nhiệt độ cơ thể giảm sau đó kích thích buồn ngủ), đọc sách giấy, nghe nhạc nhẹ. Cùng một routine mỗi đêm → não liên kết với ngủ.',
      'Giờ thức dậy cố định quan trọng hơn giờ ngủ: cố định giờ thức kể cả cuối tuần điều chỉnh đồng hồ sinh học hiệu quả hơn nhiều so với cố gắng đi ngủ sớm.',
      'Không ngủ được sau 20 phút: dậy ra, đọc sách giấy trong ánh đèn mờ đến khi buồn ngủ thật sự mới nằm lại. Nằm mãi không ngủ tạo liên kết "giường = lo lắng".',
    ],
    points: [
      { icon: '📅', label: 'Tiến Từng Bước Nhỏ', note: 'Sớm hơn 15 phút/ngày — không nhảy 1 tiếng ngay' },
      { icon: '📵', label: 'Không Điện Thoại 30p', note: 'Ánh sáng xanh ức chế melatonin như ánh mặt trời' },
      { icon: '🌡️', label: 'Phòng Mát 18–20°C', note: 'Yếu tố môi trường tác động nhất đến chất lượng ngủ' },
      { icon: '⏰', label: 'Giờ Thức Cố Định', note: 'Quan trọng hơn giờ ngủ — kể cả thứ 7, chủ nhật' },
    ],
  },
  {
    label: 'Dành 3–5 phút thở/chậm lại', icon: '🧘', cat: 'D',
    tip: 'Box breathing 4-4-4-4 hoặc đơn giản là ngồi yên',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở chậm và sâu kích hoạt hệ thần kinh phó giao cảm trong vòng 60–90 giây — phản ứng ngược hoàn toàn với stress. 5 phút thở có chủ đích/ngày giảm cortisol 15–20% sau 4 tuần nhất quán.',
    details: [
      'Box breathing (4-4-4-4): hít vào 4 giây, nín 4, thở ra 4, nín 4. Lặp 4–6 lần = 1.5–2.5 phút. Được Navy SEALs dùng để giữ bình tĩnh trong tình huống áp lực cực cao.',
      '4-7-8 breathing (cho giấc ngủ): hít 4 giây, nín 7, thở ra chậm 8 giây. Thở ra dài hơn hít vào kích hoạt phản ứng thư giãn mạnh hơn — phù hợp nhất trước khi ngủ.',
      'Thở bụng đúng cách: 1 tay lên bụng, 1 tay lên ngực. Hít vào để bụng phình ra, ngực ít di chuyển. Đây là cách thở tự nhiên của trẻ sơ sinh — nhiều người lớn đã quên.',
      'Nhất quán quan trọng hơn thời lượng: 5 phút/ngày mỗi ngày hiệu quả hơn 30 phút/tuần vào cuối tuần. Não học nhận tín hiệu thư giãn tốt hơn khi luyện tập đều đặn.',
      'Thời điểm hiệu quả: ngay sau thức dậy trước điện thoại, trước bữa ăn để tiêu hóa tốt hơn, khi stress tăng, như phần wind-down trước khi ngủ.',
      'Đơn giản nhất: ngồi thẳng lưng, nhắm mắt, tập trung vào hơi thở. Khi tâm trí phân tâm — nhẹ nhàng đưa về hơi thở. Đây là nền tảng của mọi thực hành thiền.',
    ],
    points: [
      { icon: '📦', label: 'Box Breathing 4-4-4-4', note: 'Navy SEALs dùng trong áp lực — bạn cũng dùng được' },
      { icon: '🫁', label: 'Thở Bụng Đúng Cách', note: 'Bụng phình khi hít vào — cách thở tự nhiên nhiều người quên' },
      { icon: '⏱️', label: '5 Phút Mỗi Ngày', note: 'Nhất quán quan trọng hơn thời lượng — tích lũy sau 4 tuần' },
      { icon: '🧘', label: 'Bất Kỳ Lúc Nào', note: 'Trước ăn, sau thức dậy, khi stress — không cần thời gian riêng' },
    ],
  },
];

const CAT_COLORS = { A: '#22c55e', B: '#84cc16', C: '#14b8a6', D: '#a855f7', E: '#3b82f6', F: COLOR };
const CAT_RGBS   = { A: '34,197,94', B: '132,204,22', C: '20,184,166', D: '168,85,247', E: '59,130,246', F: RGB };

// --- Weekly checklist ---
const WEEKLY_ITEMS = [
  { label: 'Số buổi tập sức mạnh', target: '2–4 buổi', icon: '💪' },
  { label: 'Số buổi cardio/đi bộ dài', target: '2–5 buổi', icon: '🚶' },
  { label: 'Số ngày ăn đủ rau', target: '≥ 5 ngày', icon: '🥦' },
  { label: 'Số ngày ngủ tốt', target: '≥ 4 ngày', icon: '😴' },
  { label: 'Số ngày có thực hành calm', target: '≥ 4 ngày', icon: '🧘' },
  { label: 'Số ngày ghi nhật ký', target: '≥ 5 ngày', icon: '📝' },
];

// --- Health Score breakdown ---
const SCORE_ITEMS = [
  { label: 'Vận động/tập luyện', pts: 25, icon: '🏋️' },
  { label: 'Đi bộ/NEAT', pts: 15, icon: '🚶' },
  { label: 'Dinh dưỡng cơ bản', pts: 20, icon: '🍽️' },
  { label: 'Uống nước', pts: 10, icon: '💧' },
  { label: 'Ngủ/phục hồi', pts: 15, icon: '😴' },
  { label: 'Tâm trí/calm practice', pts: 10, icon: '🧘' },
  { label: 'Ghi nhật ký', pts: 5, icon: '📝' },
];

// --- Quick workouts ---
const QUICK_WO = [
  {
    dur: '5 phút', label: 'Reset Cơ Thể', color: '#22c55e', rgb: '34,197,94',
    icon: '🌬️',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    steps: ['1 phút thở chậm / thở cơ hoành', '1 phút xoay vai, mở ngực', '1 phút Cat-cow hoặc thoracic twist', '1 phút Hip hinge nhẹ hoặc squat ghế', '1 phút Child pose / thở chậm'],
    note: 'Mục tiêu: duy trì chuỗi thói quen, không phải đốt mỡ.',
    keyFact: '5 phút mỗi ngày đủ để duy trì thói quen vận động — ngay cả khi không có thời gian cho bài dài hơn. Nghiên cứu cho thấy consistency quan trọng hơn cường độ: 5 phút × 7 ngày hiệu quả hơn 35 phút × 1 ngày/tuần.',
    details: [
      'Mục tiêu chính của bài 5 phút không phải đốt mỡ hay tăng cơ — mà là duy trì chuỗi thói quen (habit chain) và không để cơ thể "đóng băng" sau nhiều giờ ngồi hoặc ngày nghỉ lười biếng.',
      'Thở cơ hoành (diaphragmatic breathing): hít vào bằng mũi 4 giây, bụng phồng lên (không phải ngực), thở ra bằng miệng 6 giây. Kích hoạt hệ phó giao cảm — giảm cortisol và chuẩn bị cơ thể cho vận động.',
      'Xoay vai và mở ngực: counteract tư thế ngồi cong lưng suốt ngày. Cơ ngực trước (pectoral) và cơ vai trước (anterior deltoid) bị rút ngắn — xoay vai ra sau kéo giãn chúng, mở không gian lồng ngực.',
      'Cat-cow: kết hợp gập lưng (cat) và ưỡn lưng (cow) tạo mobility cho cột sống toàn bộ chiều dài. Kích hoạt dịch khớp và giảm căng cứng do ngồi lâu — đặc biệt hiệu quả sau ngủ hoặc làm việc lâu.',
      'Hip hinge nhẹ (romanian deadlift không tạ): kéo giãn hamstring và glutes — hai nhóm cơ bị ức chế nhiều nhất khi ngồi. Đứng thẳng, ngả người về trước bằng cách gập hông (không cong lưng), tay chạm đầu gối, rồi đứng lên.',
      'Child pose kết thúc: giải phóng lưng dưới và hông, tạo cảm giác thư giãn toàn thân. Thở sâu trong tư thế này kích hoạt phản xạ thư giãn — giúp cơ thể và tâm trí sẵn sàng cho công việc hoặc nghỉ ngơi tiếp theo.',
    ],
    points: [
      { icon: '🔗', label: 'Duy Trì Habit Chain', note: 'Không bỏ ngày — ngay cả khi chỉ 5 phút' },
      { icon: '🫁', label: 'Thở Cơ Hoành Trước', note: 'Giảm cortisol, kích hoạt phó giao cảm' },
      { icon: '🪑', label: 'Chống Tư Thế Ngồi', note: 'Mở ngực + hip hinge counteract ngồi máy tính' },
      { icon: '😌', label: 'Kết Thúc Bằng Child Pose', note: 'Thư giãn thực sự — không cắt ngắn bước này' },
    ],
  },
  {
    dur: '10 phút', label: 'Toàn Thân Người Mới', color: '#f97316', rgb: '249,115,22',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    steps: ['2 phút khởi động: đi bộ tại chỗ, xoay vai, squat ghế', '6 phút × 2 vòng: Squat 30s → Push-up gối 30s → Glute bridge 30s → Dead bug 30s', '2 phút giãn cơ + thở'],
    note: 'Phù hợp người mới, sáng sớm hoặc giờ nghỉ trưa.',
    keyFact: '10 phút đủ để kích hoạt tất cả nhóm cơ chính (chân, ngực, lưng, core) và tạo phản ứng hormone tích cực. Bài 2 vòng này được thiết kế để người mới hoàn thành được ngay từ ngày đầu — không cần thiết bị, không cần kinh nghiệm.',
    details: [
      'Khởi động 2 phút là bắt buộc — không được bỏ qua dù bài ngắn. Đi bộ tại chỗ tăng nhiệt độ cơ và nhịp tim, xoay vai mở khớp vai và cột sống ngực, squat ghế kích hoạt cơ đùi và mông trước khi tải nặng hơn.',
      'Circuit 2 vòng: mỗi động tác 30 giây → chuyển ngay không nghỉ. Squat đứng bình thường (hoặc từ ghế nếu cần) → Push-up gối (điều chỉnh cho người mới, hoàn toàn hiệu quả) → Glute bridge nằm ngửa → Dead bug.',
      'Squat cơ bản: đứng chân rộng bằng vai, ngồi xuống như ngồi ghế sau lưng, gối không vượt quá mũi chân quá nhiều, lưng thẳng. Kích hoạt quadriceps, glutes, và core ổn định đồng thời.',
      'Push-up gối: không kém hiệu quả hơn push-up thường nếu làm đúng kỹ thuật. Thân người thẳng từ đầu gối đến vai, hạ thấp ngực gần chạm sàn, đẩy lên hết. Đây là khởi điểm — sẽ chuyển sang push-up thường sau 4–6 tuần.',
      'Glute bridge: nằm ngửa, gối gập 90°, đẩy hông lên cao cho đến khi đùi và thân tạo thành đường thẳng. Giữ 2 giây ở trên đỉnh để kích hoạt cơ mông tối đa. Rất quan trọng cho người ngồi nhiều (cơ mông bị ức chế).',
      'Dead bug: bài tập core sâu (transverse abdominis) tốt nhất cho người mới. Nằm ngửa, nâng chân và tay lên 90°, từ từ hạ tay và chân đối diện xuống sàn rồi đưa lên. Lưng dưới phải luôn ép sàn — nếu không thể giữ lưng, biên độ chuyển động quá lớn.',
    ],
    points: [
      { icon: '⏱️', label: '2 Phút Khởi Động Bắt Buộc', note: 'Không bỏ qua dù bài ngắn — phòng tránh chấn thương' },
      { icon: '🔄', label: '2 Vòng Circuit', note: '4 động tác × 30s × 2 vòng = 6 phút hiệu quả' },
      { icon: '🦵', label: 'Push-up Gối Hoàn Toàn OK', note: 'Đúng kỹ thuật quan trọng hơn kiểu push-up' },
      { icon: '🌱', label: 'Nền Tảng 4–6 Tuần', note: 'Sau đó chuyển sang push-up thường và tăng vòng' },
    ],
  },
  {
    dur: '20 phút', label: 'Full Body Chuẩn', color: '#ef4444', rgb: '239,68,68',
    icon: '💪',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    steps: ['4 phút khởi động', '12 phút × 3 vòng: Squat/Sit-to-stand → Push-up → Band row → Glute bridge → Plank/Dead bug', '4 phút cooldown giãn cơ'],
    note: 'Đủ để tạo hiệu quả rõ ràng nếu duy trì 3–4 lần/tuần.',
    keyFact: '20 phút × 3–4 lần/tuần là ngưỡng tối thiểu để tạo thích nghi cơ học và hormone đáng kể. Bài 3 vòng này kích thích tất cả 5 nhóm cơ chính, tạo EPOC (đốt mỡ sau tập) và kích thích tổng hợp protein cơ trong 24–48 giờ sau đó.',
    details: [
      'Khởi động 4 phút: đi bộ tại chỗ 1 phút, xoay khớp toàn thân 1 phút, squat nhẹ 1 phút, inchworm hoặc world\'s greatest stretch 1 phút. Nhiệt độ cơ và độ nhớt khớp phải đạt mức tối ưu trước khi tập chính.',
      '3 vòng circuit: mỗi động tác 40–45 giây, nghỉ 15 giây giữa các động tác, nghỉ 60 giây giữa các vòng. Squat (cơ chân) → Push-up (ngực + triceps + vai) → Band row (lưng + biceps) → Glute bridge (mông + hamstring) → Plank (core).',
      'Band row (dây kháng lực): đặt dây ở điểm cố định ngang ngực, kéo về phía mình bằng cách gập khuỷu tay, siết cơ lưng ở cuối hành trình. Kích hoạt rhomboids, mid-traps, và lats — nhóm cơ thường yếu ở người ngồi nhiều.',
      'Tại sao 3 vòng quan trọng hơn 2 vòng: vòng 3 tạo metabolic stress cao nhất (cơ đã kiệt sức một phần) — đây là stimulus chính cho tổng hợp protein cơ. EPOC (excess post-exercise oxygen consumption) tăng đáng kể sau vòng 3.',
      'Cooldown 4 phút không thể cắt: hạ nhịp tim từ từ (đi bộ 1 phút), giãn quadriceps 30s mỗi bên, giãn hamstring 30s, pigeon pose (hông) 30s mỗi bên, child pose 1 phút. Bỏ cooldown tăng nguy cơ chóng mặt và đau nhức cơ ngày hôm sau.',
      'Tần suất: 3–4 lần/tuần với ít nhất 1 ngày nghỉ giữa các buổi tập cùng nhóm cơ. Cơ cần 48 giờ để phục hồi và tái tạo. Tập hàng ngày mà không thay đổi bài sẽ gây overtraining và kém hiệu quả hơn.',
    ],
    points: [
      { icon: '🔥', label: 'EPOC Sau Tập', note: 'Đốt mỡ tiếp tục 24–48h sau — tập 3 vòng tạo hiệu ứng này' },
      { icon: '🔗', label: 'Band Row Cho Lưng', note: 'Nhóm cơ thường bị bỏ qua — quan trọng nhất' },
      { icon: '💤', label: '48h Nghỉ Phục Hồi', note: 'Tập 3–4 lần/tuần, xen kẽ — không hàng ngày' },
      { icon: '🧘', label: 'Cooldown 4 Phút Bắt Buộc', note: 'Không cắt — giảm đau nhức và nguy cơ chóng mặt' },
    ],
  },
];

// --- Test items ---
const TEST_ITEMS = [
  {
    label: 'Cân nặng', unit: 'kg', how: 'Cân buổi sáng, sau vệ sinh, trước ăn',
    icon: '⚖️', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cân nặng có thể dao động 1–3kg trong ngày do nước, thức ăn, và glycogen cơ — không phải mỡ. Chỉ so sánh có ý nghĩa khi đo cùng điều kiện: sáng sớm, sau vệ sinh, trước ăn, cùng loại quần áo.',
    details: [
      'Điều kiện chuẩn: sáng sớm sau khi vệ sinh, trước bữa sáng và nước đầu tiên. Cùng thời điểm, cùng quần áo mỗi lần đo. Sai điều kiện → sai lệch 1–3kg không phản ánh thực tế.',
      'Trend quan trọng hơn số đơn lẻ: theo dõi trung bình 7–14 ngày thay vì so sánh ngày-với-ngày. Dao động ngày trong 1–3kg là bình thường (nước, muối, glycogen cơ, chu kỳ kinh nguyệt).',
      'Cân không đo được mọi thứ: người tập luyện có thể tăng 2–3kg cơ trong khi giảm mỡ cùng thời gian — cân nặng không đổi nhưng cơ thể thay đổi rõ rệt. Kết hợp đo vòng eo + cảm giác quần áo.',
      'BMI có giới hạn: không phân biệt được cơ và mỡ. Người tập gym nhiều có thể BMI "thừa cân" nhưng cơ thể khỏe mạnh. Vòng eo + tỷ lệ cơ/mỡ là chỉ số tốt hơn.',
      'Setpoint theory: cơ thể có "điểm cân bằng" được điều chỉnh bởi leptin và ghrelin. Giảm cân nhanh kích hoạt cơ chế bảo vệ (tăng đói, giảm chuyển hóa). Thay đổi chậm và bền vững hơn.',
      'Mục tiêu thực tế: giảm 0.5–1kg/tuần là tối đa để giảm mỡ (không phải cơ). Hơn thế thường là nước và cơ — sẽ tái phát sau khi ăn uống trở lại.',
    ],
    points: [
      { icon: '⏰', label: 'Cùng Điều Kiện Mỗi Lần', note: 'Sáng sớm, sau vệ sinh, trước ăn — quan trọng nhất' },
      { icon: '📈', label: 'Trend 7–14 Ngày', note: 'Trung bình tuần quan trọng hơn số đơn lẻ' },
      { icon: '💪', label: 'Kết Hợp Đo Vòng Eo', note: 'Cân không đo được tỷ lệ cơ/mỡ thay đổi' },
      { icon: '🐢', label: '0.5–1kg/tuần Là Chuẩn', note: 'Nhanh hơn thường là nước và cơ — sẽ tái phát' },
    ],
  },
  {
    label: 'Vòng eo', unit: 'cm', how: 'Đo ngang rốn sau khi thở ra nhẹ',
    icon: '📏', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo là chỉ số sức khỏe tim mạch tốt hơn BMI và cân nặng. WHO: nguy cơ tăng khi >80cm (nữ) / >94cm (nam), nguy cơ cao khi >88cm (nữ) / >102cm (nam). Mỡ nội tạng (bụng) nguy hiểm hơn mỡ dưới da.',
    details: [
      'Mỡ nội tạng (visceral fat) bao quanh các cơ quan nội tạng trong bụng — khác hoàn toàn với mỡ dưới da. Tiết ra các cytokine viêm và adipokine gây kháng insulin, tăng huyết áp, và rối loạn lipid máu.',
      'Cách đo chuẩn: đứng thẳng, thở ra nhẹ (không hóp bụng), đặt thước ngang qua rốn, đo vòng eo nhỏ nhất. Không nhịn thở, không hóp — kết quả sẽ sai lệch 3–5cm.',
      'Waist-to-height ratio (WHtR): vòng eo ÷ chiều cao < 0.5 là an toàn. Ví dụ: cao 170cm → vòng eo < 85cm. Chỉ số này tốt hơn BMI trong dự đoán nguy cơ tim mạch và tiểu đường.',
      'Giảm vòng eo không cần tập bụng: mỡ nội tạng đáp ứng tốt nhất với cardio (30 phút × 3–5 lần/tuần), kiểm soát insulin (giảm đường và tinh bột tinh), và ngủ đủ giấc. Sit-up không đốt mỡ bụng trực tiếp.',
      'Giảm 5–10% vòng eo (dù không giảm nhiều cân nặng): giảm nguy cơ tiểu đường loại 2 tới 58%, cải thiện huyết áp, và giảm cholesterol LDL. Thay đổi nhỏ = lợi ích lớn.',
      'Theo dõi mỗi 4 tuần: vòng eo thay đổi chậm hơn cân nặng nhưng phản ánh thay đổi thực sự của mỡ cơ thể hơn. 1–2cm giảm sau 4 tuần là tiến bộ có ý nghĩa.',
    ],
    points: [
      { icon: '⚠️', label: 'Ngưỡng Nguy Hiểm', note: '>88cm (nữ) / >102cm (nam) — nguy cơ tim mạch cao' },
      { icon: '🔥', label: 'Cardio Giảm Mỡ Bụng', note: 'Tốt hơn sit-up — mỡ nội tạng phản ứng với cardio' },
      { icon: '📐', label: 'WHtR < 0.5', note: 'Vòng eo ÷ chiều cao — tốt hơn BMI trong dự đoán nguy cơ' },
      { icon: '🍬', label: 'Giảm Đường = Hiệu Quả Nhất', note: 'Insulin cao thúc đẩy tích trữ mỡ nội tạng' },
    ],
  },
  {
    label: 'Sit-to-stand 1 phút', unit: 'lần', how: 'Đứng lên ngồi xuống từ ghế, không dùng tay đỡ',
    icon: '🪑', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sit-to-stand test đo sức mạnh cơ chân và khả năng chức năng. Nghiên cứu European Journal of Preventive Cardiology: người không thể đứng dậy từ sàn mà không dùng tay có nguy cơ tử vong sớm cao hơn 6.5 lần so với người làm được dễ dàng.',
    details: [
      'Cơ đùi trước (quadriceps) và cơ mông (glutes) là nhóm cơ lớn nhất cơ thể — quyết định khả năng đứng, ngồi, leo cầu thang, và tự chủ trong sinh hoạt hàng ngày khi lớn tuổi.',
      'Ngưỡng tham chiếu: người 40–49 tuổi: ≥12 lần/phút (tốt), 8–11 lần (trung bình), <8 lần (cần cải thiện). Người 50–59 tuổi: ≥10 lần tốt. Điều chỉnh theo tuổi.',
      'Bài tập cải thiện: squat (cơ đùi + mông), lunges, step-up lên bậc thang, glute bridge. Chỉ cần 10–15 phút × 2–3 lần/tuần để tăng số lần sit-to-stand đáng kể sau 4–6 tuần.',
      'Kỹ thuật đúng: ngồi trên ghế cao 45cm, tay chéo trước ngực, đứng hẳn lên (chân thẳng) → ngồi xuống nhẹ nhàng. Không dùng tay đỡ, không nảy người. Đếm số lần hoàn chỉnh trong 1 phút.',
      'Mất sức mạnh cơ chân theo tuổi (sarcopenia): sau 30 tuổi mất ~1% sức mạnh/năm nếu không tập. Sau 65 tuổi tốc độ tăng gấp đôi. Tập sức mạnh 2–3 lần/tuần ngăn chặn quá trình này hiệu quả.',
      'Chức năng trong thực tế: khả năng đứng lên-ngồi xuống tốt = ít nguy cơ té ngã, ít phụ thuộc vào người khác, duy trì chất lượng cuộc sống khi già. Đây là chỉ số "tuổi thọ chức năng" thực tế nhất.',
    ],
    points: [
      { icon: '🦵', label: 'Cơ Chân Là Quan Trọng Nhất', note: 'Nhóm cơ lớn nhất — quyết định tự chủ khi lớn tuổi' },
      { icon: '📊', label: '≥12 Lần/Phút Là Tốt', note: 'Ngưỡng cho người 40–49 tuổi — điều chỉnh theo tuổi' },
      { icon: '🏋️', label: 'Squat + Lunges', note: 'Cải thiện rõ sau 4–6 tuần tập 2–3 lần/tuần' },
      { icon: '⏰', label: 'Mất 1%/Năm Sau 30 Tuổi', note: 'Sarcopenia — tập sức mạnh là biện pháp duy nhất' },
    ],
  },
  {
    label: 'Plank (gối hoặc thường)', unit: 'giây', how: 'Giữ tư thế plank đến khi không thể nữa',
    icon: '🏋️', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Plank test đo sức bền core (cơ lõi) — nhóm cơ bụng sâu, cơ lưng, và cơ hông hoạt động cùng lúc. Core mạnh = tư thế tốt, giảm đau lưng, tăng hiệu quả mọi bài tập, và ổn định toàn thân.',
    details: [
      'Core không chỉ là cơ bụng 6 múi (rectus abdominis) mà gồm: transverse abdominis (cơ bụng sâu nhất, như đai tự nhiên), multifidus (cơ lưng dọc sống), cơ hông, và cơ chậu. Tất cả hoạt động cùng lúc trong plank.',
      'Ngưỡng tham chiếu: dưới 30 giây = cần cải thiện nhiều; 30–60 giây = trung bình; 60–120 giây = tốt; trên 2 phút = rất tốt. Plank gối tốt hơn plank thường sai kỹ thuật.',
      'Kỹ thuật đúng: cánh tay thẳng hoặc chống bằng khuỷu tay, thân người thẳng hàng từ đầu đến gót (như một tấm ván), không để hông cao hoặc thấp, không nín thở — thở đều.',
      'Cải thiện plank: dead bug (bài tập nền tốt nhất cho core sâu), bird dog, hollow body hold, pallof press. Plank lâu hơn bằng cách tập đúng kỹ thuật 30–60 giây × 3 set, mỗi tuần tăng 5–10 giây.',
      'Core mạnh = giảm đau lưng: 80% người sẽ bị đau lưng ít nhất 1 lần trong đời. Nguyên nhân phổ biến nhất là core yếu và tư thế sai — cả hai được cải thiện bởi tập core đúng cách.',
      'Plank là test và bài tập: 3 set × 30–60 giây plank mỗi ngày vừa đo lường tiến bộ vừa là bài tập chức năng hiệu quả không cần thiết bị.',
    ],
    points: [
      { icon: '🎯', label: '60–120 Giây Là Tốt', note: 'Gối đúng kỹ thuật tốt hơn thường sai kỹ thuật' },
      { icon: '🏗️', label: 'Core = Đai Tự Nhiên', note: 'Cơ bụng sâu ổn định cột sống — không phải 6 múi' },
      { icon: '🌿', label: 'Dead Bug Là Nền Tảng', note: 'Bài tập core sâu tốt nhất — thêm vào routine' },
      { icon: '💆', label: 'Giảm Đau Lưng', note: 'Core yếu = nguyên nhân số 1 đau lưng mãn tính' },
    ],
  },
  {
    label: 'Đi bộ 6 phút', unit: 'm / cảm giác', how: 'Ghi quãng đường hoặc mức gắng sức (dễ/vừa/khó)',
    icon: '🚶', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '6-Minute Walk Test (6MWT) là test tim mạch được dùng trong y khoa để đánh giá thể lực tổng thể và sức khỏe tim phổi. Quãng đường >500m (nam) / >450m (nữ) ở tốc độ bình thường = năng lực tim mạch tốt.',
    details: [
      '6MWT đo khả năng tim phổi cung cấp oxy cho cơ trong khi vận động liên tục. Là bài kiểm tra chức năng toàn diện nhất có thể tự thực hiện mà không cần thiết bị y tế.',
      'Ngưỡng tham chiếu người khỏe mạnh: nam 40–49 tuổi: 550–650m; nữ 40–49 tuổi: 500–600m. Tiến bộ 50–100m sau 4 tuần tập là cải thiện có ý nghĩa lâm sàng.',
      'Nếu không đo được quãng đường: dùng thang RPE (cảm giác gắng sức): Dễ = thoải mái, có thể hát; Vừa = có thể nói chuyện nhưng hơi khó thở; Khó = chỉ nói được vài từ. Theo dõi RPE theo thời gian cũng có giá trị.',
      'Cải thiện 6MWT: đi bộ nhanh 30 phút × 3–5 lần/tuần là đủ để tăng quãng đường đáng kể sau 4–8 tuần. Không cần chạy — đi bộ nhanh với cường độ vừa phải là lý tưởng cho người mới.',
      'Cardio zone 2 (có thể nói chuyện nhưng khó thở): 60–70% nhịp tim tối đa. Đây là zone đốt mỡ hiệu quả nhất và xây dựng nền tảng aerobic bền vững. 6MWT là bài tập trong zone 2.',
      'Nhiệt độ, mùa, và địa hình ảnh hưởng đến kết quả: so sánh cùng điều kiện. Buổi sáng mát và đường phẳng cho kết quả tốt hơn buổi chiều nóng hoặc địa hình dốc.',
    ],
    points: [
      { icon: '❤️', label: 'Test Tim Phổi Thực Tế', note: '6MWT được dùng trong y khoa — không cần thiết bị' },
      { icon: '📏', label: '>500m Là Tốt', note: 'Tốc độ bình thường — cải thiện 50–100m/4 tuần' },
      { icon: '💬', label: 'Dùng RPE Nếu Không Đo Được', note: 'Dễ/Vừa/Khó — track cảm giác theo thời gian' },
      { icon: '🔥', label: 'Zone 2 = Đốt Mỡ Tốt Nhất', note: 'Có thể nói chuyện nhưng khó thở — hiệu quả nhất' },
    ],
  },
  {
    label: 'Giấc ngủ trung bình', unit: 'giờ/đêm', how: 'Trung bình 7 ngày qua',
    icon: '😴', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Trung bình giấc ngủ 7 ngày quan trọng hơn giấc ngủ từng đêm. Nợ ngủ tích lũy trong tuần ảnh hưởng đến hormone, trao đổi chất, và nhận thức theo cách cộng dồn — không hồi phục hoàn toàn chỉ bằng ngủ bù cuối tuần.',
    details: [
      'Trung bình <6 giờ/đêm trong 7 ngày: tăng 30% nguy cơ mắc bệnh (immune suppression rõ rệt), giảm 37% khả năng tiêm vaccine có hiệu quả, và tăng gấp 4 lần nguy cơ cảm lạnh.',
      'Ngủ và cân nặng: thiếu ngủ tăng ghrelin (hormone đói) 24% và giảm leptin (hormone no) 18% — dẫn đến thèm ăn nhiều hơn ~300 kcal/ngày và ưa tinh bột/đường.',
      '7–9 giờ là range lý tưởng cho đa số người trưởng thành. Một số người ngủ tốt với 6.5 giờ (short sleepers — do gene), nhưng đây là thiểu số (<3% dân số). Không nên tự coi mình là trường hợp này.',
      'Consistency quan trọng: ngủ cùng giờ ±30 phút mỗi đêm (kể cả cuối tuần) ổn định circadian rhythm tốt hơn nhiều so với ngủ bù cuối tuần. Giờ dậy cố định quan trọng hơn giờ ngủ.',
      'Alcohol và giấc ngủ: rượu giúp ngủ nhanh hơn nhưng phá vỡ giấc ngủ REM và làm tăng thức giữa đêm. 1–2 đơn vị alcohol = mất ~1 giờ ngủ chất lượng trong đêm đó.',
      'Ngủ trưa (20–30 phút): cải thiện nhận thức và tâm trạng sau bữa trưa mà không ảnh hưởng giấc ngủ tối nếu ngủ trước 3h chiều và không quá 30 phút (tránh vào deep sleep).',
    ],
    points: [
      { icon: '📊', label: 'Trung Bình Tuần Quan Trọng', note: 'Nợ ngủ tích lũy — không trả được hoàn toàn bằng bù' },
      { icon: '🍔', label: 'Thiếu Ngủ = Đói Hơn', note: 'Ghrelin +24%, Leptin -18% — +300 kcal thèm ăn/ngày' },
      { icon: '⏰', label: 'Cùng Giờ Dậy Mỗi Ngày', note: 'Quan trọng hơn giờ ngủ — kể cả thứ 7, chủ nhật' },
      { icon: '🍷', label: 'Alcohol Phá Vỡ REM', note: '1–2 ly = mất ~1 giờ ngủ chất lượng đêm đó' },
    ],
  },
  {
    label: 'Stress tự chấm', unit: '/10', how: 'Mức stress cảm nhận trung bình tuần qua',
    icon: '😓', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress tự cảm nhận (perceived stress) là chỉ số tốt hơn cortisol máu trong việc dự đoán kết quả sức khỏe dài hạn. Theo dõi xu hướng hàng tuần quan trọng hơn con số từng ngày.',
    details: [
      'Perceived stress scale (PSS) là công cụ được dùng rộng rãi nhất trong nghiên cứu tâm lý — đánh giá mức độ cảm nhận stress, không phải nguyên nhân. Cách chấm tự đánh giá này có giá trị khoa học thực sự.',
      'Stress 7–8/10 kéo dài >1 tuần: tín hiệu cần can thiệp ngay. Stress mãn tính ở mức này tăng nguy cơ burnout, rối loạn lo âu, và suy giảm miễn dịch đáng kể.',
      'Trend quan trọng hơn điểm số: nếu stress từ 8 xuống 6 sau 4 tuần áp dụng can thiệp (ngủ tốt hơn, tập luyện, thiền) — đó là tiến bộ có ý nghĩa dù 6 vẫn cao.',
      'Stress tự chấm cao không phải lúc nào cũng có nguyên nhân từ công việc: thiếu ngủ, ít vận động, cô lập xã hội, và dinh dưỡng kém đều làm tăng cảm giác stress mà không có stressor cụ thể.',
      'Ngưỡng tốt: 4–5/10 là stress "bình thường" và thậm chí có ích. <3/10 kéo dài có thể chỉ ra thiếu thách thức và kích thích (boredom, underperformance). Mục tiêu là 4–5/10, không phải 0.',
      'Kết hợp với các chỉ số khác: stress cao + ngủ kém + năng lượng thấp = tín hiệu overtraining hoặc burnout. Stress cao nhưng ngủ tốt + năng lượng cao = tốt (eustress — stress tích cực).',
    ],
    points: [
      { icon: '📉', label: 'Trend Quan Trọng Hơn Số', note: 'Stress giảm từ 8 → 6 là tiến bộ thực sự' },
      { icon: '⚠️', label: '>7/10 Kéo Dài = Can Thiệp', note: 'Burnout và suy miễn dịch bắt đầu từ đây' },
      { icon: '✅', label: '4–5/10 Là Lý Tưởng', note: 'Không phải 0 — eustress có ích cho hiệu suất' },
      { icon: '🔗', label: 'Xem Kết Hợp Với Ngủ + Năng Lượng', note: 'Stress cao + ngủ tốt = khác với stress cao + mất ngủ' },
    ],
  },
  {
    label: 'Năng lượng tự chấm', unit: '/10', how: 'Mức năng lượng cảm nhận trung bình tuần qua',
    icon: '⚡', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Năng lượng trung bình tuần (7–10 ngày) là chỉ số phục hồi tổng thể tốt hơn năng lượng từng ngày vốn dao động nhiều. Năng lượng trung bình tăng sau 4 tuần can thiệp (ngủ, dinh dưỡng, vận động) là dấu hiệu hệ thống đang phục hồi.',
    details: [
      'Năng lượng 7–8/10 liên tục = hệ thống hoạt động tốt: ngủ đủ, dinh dưỡng ổn, tập luyện phù hợp, stress được quản lý. Đây là mục tiêu dài hạn, không phải trạng thái thường xuyên tức thì.',
      'Năng lượng thấp kéo dài (<5/10 hơn 2 tuần) với không rõ nguyên nhân: check ngay các nguyên nhân phổ biến — sắt/ferritin thấp (đặc biệt phụ nữ), vitamin D thiếu hụt, hypothyroidism, hoặc thiếu máu.',
      'Energy management khác time management: năng lượng có thể được tái tạo (bằng ngủ, nghỉ, vận động, dinh dưỡng) trong khi thời gian không thể. Quản lý năng lượng quan trọng hơn quản lý lịch trình.',
      'Sau tập luyện tốt: năng lượng tăng 2–4 giờ ngay sau bài tập vừa phải (do endorphin, norepinephrine). Tuy nhiên overtraining (tập quá nặng quá nhiều) gây năng lượng thấp kéo dài — theo dõi xu hướng.',
      'Chu kỳ năng lượng tự nhiên: sáng (cao sau 9h), trưa (giảm 1–3h), chiều (tăng nhẹ 3–5h), tối (giảm để chuẩn bị ngủ). Lên kế hoạch việc quan trọng theo chu kỳ này thay vì chống lại nó.',
      'Đường và năng lượng: đường và carb tinh gây tăng năng lượng nhanh rồi sụp (energy crash). Protein + fat + fiber ổn định năng lượng trong 3–4 giờ. Bữa ăn quyết định đường cong năng lượng cả ngày.',
    ],
    points: [
      { icon: '📊', label: 'Trung Bình Tuần Quan Trọng', note: 'Dao động ngày là bình thường — trend mới quan trọng' },
      { icon: '🩺', label: '<5/10 Kéo Dài → Kiểm Tra', note: 'Sắt, Vit D, tuyến giáp — nguyên nhân y tế phổ biến' },
      { icon: '🔋', label: 'Tái Tạo Được Bằng Ngủ+Ăn', note: 'Energy management quan trọng hơn time management' },
      { icon: '🍽️', label: 'Bữa Ăn = Đường Cong Năng Lượng', note: 'Protein+fat+fiber ổn định hơn đường và carb tinh' },
    ],
  },
];

// --- Teaser sections ---
const TEASER_SECTIONS = [
  {
    title: 'Công Cụ Hằng Ngày',
    cards: [
      { to: '/pillar/f/checklist', icon: '✅', category: 'Hành Động', title: 'Checklist Ngày & Tuần', accent: 'Interactive · Lưu tiến độ', desc: 'Checklist tối giản 6 mục hàng ngày và checklist tuần theo dõi xu hướng. Mỗi tick là một bước tiến.', features: ['Checklist 6 mục hàng ngày', 'Tracker 6 chỉ tiêu hàng tuần', 'Review cuối tuần 4 câu hỏi'], stats: [{ v: '6', l: 'Mục/ngày' }, { v: '6', l: 'Chỉ tiêu tuần' }], image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', cta: 'Mở checklist →' },
      { to: '/pillar/f/workout-log', icon: '🏋️', category: 'Tập Luyện', title: 'Nhật Ký Tập Luyện', accent: 'RPE · Tăng tiến · Lưu lịch sử', desc: 'Ghi lại bài tập, thời lượng, cảm giác RPE. Theo dõi tăng tiến tuần sau. Không tập theo cảm hứng nữa.', features: ['Log bài tập + RPE 1–10', 'Template tăng tiến tuần sau', 'Lịch sử 30 ngày gần nhất'], stats: [{ v: 'RPE', l: '1–10' }, { v: '30', l: 'Ngày lưu' }], image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80', cta: 'Ghi nhật ký →' },
      { to: '/pillar/f/meal-plan', icon: '🍽️', category: 'Dinh Dưỡng', title: 'Template Thực Đơn', accent: 'Đĩa ăn chuẩn · Ghi nhật ký ăn', desc: 'Template đĩa ăn lành mạnh theo tỷ lệ ½ rau – ¼ đạm – ¼ tinh bột. Nhật ký ăn uống đơn giản mỗi ngày.', features: ['Template đĩa ăn chuẩn', 'Nhật ký protein/rau/nước hàng ngày', 'Gợi ý bữa ăn Việt'], stats: [{ v: '3', l: 'Bữa/ngày' }, { v: '4', l: 'Tuần theo dõi' }], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', cta: 'Lên thực đơn →' },
    ],
  },
  {
    title: 'Theo Dõi & Đánh Giá',
    cards: [
      { to: '/pillar/f/lifestyle-tracker', icon: '💤', category: 'Lifestyle', title: 'Lifestyle Tracker', accent: 'Ngủ · Bước chân · Năng lượng', desc: 'Theo dõi giấc ngủ, số bước chân, và mức năng lượng hàng ngày. Tìm pattern ảnh hưởng đến cảm giác của bạn.', features: ['Sleep log + chất lượng giấc ngủ', 'Bước chân & NEAT tracker', 'Chỉ số năng lượng 1–10'], stats: [{ v: '3', l: 'Chỉ số' }, { v: '30', l: 'Ngày lưu' }], image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', cta: 'Theo dõi lifestyle →' },
      { to: '/pillar/f/mind-tracker', icon: '🧘', category: 'Tâm Trí', title: 'Mind & Calm Tracker', accent: 'Stress · Mood · Journaling', desc: 'Theo dõi stress, tâm trạng và thực hành calm practice. Nhận ra ngày nào cần giảm tải trước khi kiệt sức.', features: ['Stress score hàng ngày', 'Mood tracker emoji', 'Journaling 3 câu hỏi'], stats: [{ v: '3', l: 'Chỉ số tâm trí' }, { v: '5', l: 'Phút/ngày' }], image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', cta: 'Theo dõi tâm trí →' },
      { to: '/pillar/f/health-score', icon: '💯', category: 'Điểm Số', title: 'Daily Health Score', accent: '100 điểm · 6 nhóm · Phân tích tuần', desc: 'Chấm điểm sức khỏe hàng ngày theo 6 nhóm hành vi. Xem xu hướng điểm trung bình tuần để tự điều chỉnh.', features: ['6 nhóm hành vi · 100 điểm', 'Lịch sử điểm 7 ngày', 'Quy tắc điều chỉnh theo điểm số'], stats: [{ v: '100', l: 'Điểm tối đa' }, { v: '6', l: 'Nhóm hành vi' }], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', cta: 'Chấm điểm →' },
    ],
  },
  {
    title: 'Thư Viện & Tài Nguyên',
    cards: [
      { to: '/pillar/f/quick-workouts', icon: '⚡', category: 'Bài Nhanh', title: 'Thư Viện Bài Nhanh', accent: '5 · 10 · 20 phút', desc: 'Bài tập 5–10–20 phút cho mọi tình huống. Quá bận, quá mệt, hay chỉ cần reset — luôn có lựa chọn phù hợp.', features: ['Bài 5 phút reset cơ thể', 'Bài 10 phút toàn thân người mới', 'Bài 20 phút full body chuẩn'], stats: [{ v: '3', l: 'Độ dài' }, { v: '5', l: 'Nhóm mục tiêu' }], image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', cta: 'Xem thư viện →' },
      { to: '/pillar/f/meal-prep', icon: '🥡', category: 'Bếp Núc', title: 'Meal Prep 3 Ngày', accent: '30–45 phút · Chuẩn bị sẵn', desc: 'Hướng dẫn meal prep đơn giản cho 2–3 ngày. Một lần nấu, nhiều ngày dùng. Cấu trúc đĩa ăn nhất quán mà không ngán.', features: ['Template 5 thành phần', 'Quy tắc 30–45 phút nấu', 'Tips đổi vị không ngán'], stats: [{ v: '3', l: 'Ngày prep' }, { v: '45', l: 'Phút nấu' }], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', cta: 'Bắt đầu meal prep →' },
      { to: '/pillar/f/reset-protocol', icon: '🔄', category: 'Recovery', title: 'Reset Protocol', accent: 'Sau lỡ nhịp · Quay lại nhanh', desc: 'Hệ thống reset sau ngày ăn lệch, tuần bỏ tập, hoặc giai đoạn stress cao. Không tự trách — chỉ cần quay lại đúng cách.', features: ['Reset sau 1 ngày ăn lệch', 'Reset sau 1 tuần bỏ tập', 'Reset sau stress/mất ngủ'], stats: [{ v: '4', l: 'Tình huống reset' }, { v: '1', l: 'Ngày quay lại' }], image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80', cta: 'Xem protocol →' },
    ],
  },
  {
    title: 'Lộ Trình & Test',
    cards: [
      { to: '/pillar/f/progress-test', icon: '📈', category: 'Đo Lường', title: 'Bộ Test Tiến Bộ 4 Tuần', accent: 'Thể lực · Vòng eo · Cảm giác', desc: 'Test 8 chỉ số mỗi 4 tuần để đo tiến bộ ngoài cân nặng. Plank, sit-to-stand, giấc ngủ, stress, năng lượng — toàn diện hơn.', features: ['8 chỉ số theo dõi toàn diện', 'Bảng so sánh tuần 0/4/8/12', 'Không đánh giá chỉ bằng cân nặng'], stats: [{ v: '8', l: 'Chỉ số test' }, { v: '4', l: 'Tuần/lần' }], image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', cta: 'Bắt đầu test →' },
      { to: '/pillar/f/roadmap', icon: '🗺️', category: 'Lộ Trình', title: 'Lộ Trình 12 Tuần', accent: '4 giai đoạn · Tự vận hành', desc: 'Từ làm quen checklist → đo tiến bộ → cá nhân hóa theo mục tiêu → tự điều chỉnh không cần ai nhắc.', features: ['Tuần 1–2: nền tảng', 'Tuần 3–6: đo tiến bộ', 'Tuần 7–12: cá nhân hóa & tối ưu'], stats: [{ v: '12', l: 'Tuần' }, { v: '4', l: 'Giai đoạn' }], image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80', cta: 'Xem lộ trình →' },
    ],
  },
];

// --- DailyMinCard: dual-zone (checkbox left, detail right) ---
function DailyMinCard({ item, idx, checked, onToggle, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[item.cat];
  const rgb   = CAT_RGBS[item.cat];
  const isDone = !!checked[idx];
  return (
    <div className="flex items-stretch rounded-2xl border bg-surface overflow-hidden transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${rgb},0.45)` : isDone ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 18px rgba(${rgb},0.1)` : 'none' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Checkbox zone */}
      <button onClick={() => onToggle(idx)}
        className="flex items-center justify-center px-4 shrink-0 border-r border-white/5 transition-colors"
        style={{ background: isDone ? `rgba(${rgb},0.1)` : 'transparent' }}>
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={isDone ? { background: color, borderColor: color } : { borderColor: 'rgba(255,255,255,0.25)' }}>
          {isDone && <span className="text-white text-[10px] font-black leading-none">✓</span>}
        </div>
      </button>
      {/* Detail zone */}
      <button onClick={() => onOpen(idx)} className="flex-1 flex items-center gap-3 py-3 px-4 text-left cursor-pointer">
        <span className="text-xl shrink-0">{item.icon}</span>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>{item.label}</span>
          <p className="text-xs text-muted mt-0.5 truncate">{item.tip}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center" style={{ color: '#0a0a0a', background: color }}>{item.cat}</span>
          <span className="text-[10px]" style={{ color: `rgba(${rgb},0.5)` }}>Chi tiết →</span>
        </div>
      </button>
    </div>
  );
}

function DailyMinModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const color = CAT_COLORS[item.cat];
  const rgb   = CAT_RGBS[item.cat];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        {/* Content */}
        <div className="p-6 md:p-8">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2" style={{ color: '#0a0a0a', background: color }}>Trụ Cột {item.cat}</span>
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color }}>{item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: color, background: `rgba(${rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- RevealBlock ---
function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.08}s, transform 0.55s ease ${delay * 0.08}s` }}>
      {children}
    </div>
  );
}

// --- TeaserCard ---
function TeaserCard({ to, icon, category, title, accent, desc, features, stats, image, imageAlt, cta }) {
  return (
    <Link to={to} className="block rounded-3xl border border-border bg-surface overflow-hidden hover:border-orange-500/40 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{icon}</span>
              <span className="text-base font-bold uppercase tracking-widest" style={{ color: COLOR }}>{category}</span>
            </div>
            <h3 className="text-xl font-bold text-text mb-1 leading-tight">{title}</h3>
            <p className="text-base text-muted mb-3">{accent}</p>
            <p className="text-lg text-muted leading-relaxed mb-4">{desc}</p>
            <ul className="space-y-1 mb-5">
              {features.map((f, i) => (
                <li key={i} className="flex gap-2 text-base text-muted"><span style={{ color: COLOR }}>✦</span>{f}</li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black" style={{ color: COLOR }}>{s.v}</div>
                  <div className="text-base text-muted">{s.l}</div>
                </div>
              ))}
            </div>
            <span className="ml-auto text-lg font-bold group-hover:translate-x-1 transition-transform" style={{ color: COLOR }}>{cta}</span>
          </div>
        </div>
        <div className="relative md:w-44 h-36 md:h-auto shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt || title} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/90 via-surface/20 to-transparent md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-transparent md:hidden" />
        </div>
      </div>
    </Link>
  );
}

function TeaserSection({ title, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.07)` }}>{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// --- F0 Dashboard tab ---
function F0Dashboard() {
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_score_today') || '{}'); } catch { return {}; }
  });

  function setScore(key, val) {
    const u = { ...scores, [key]: val, date: new Date().toLocaleDateString('vi-VN') };
    setScores(u);
    localStorage.setItem('healthapp_f_score_today', JSON.stringify(u));
  }

  const total = SCORE_ITEMS.reduce((s, item) => s + (scores[item.label] || 0), 0);
  const level = total >= 80 ? { label: 'Ngày Rất Tốt 🔥', color: '#22c55e' } : total >= 60 ? { label: 'Ngày Ổn ✓', color: COLOR } : total >= 40 ? { label: 'Duy Trì Tối Thiểu', color: '#eab308' } : { label: 'Ngày Reset', color: '#ef4444' };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text">Health Score Hôm Nay</h3>
          <div className="text-right">
            <div className="text-4xl font-black" style={{ color: level.color }}>{total}</div>
            <div className="text-base font-bold" style={{ color: level.color }}>{level.label}</div>
          </div>
        </div>
        <div className="w-full h-2 bg-bg rounded-full mb-5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${total}%`, background: level.color }} />
        </div>
        <div className="space-y-3">
          {SCORE_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-base text-muted flex-1">{item.label}</span>
              <span className="text-base text-muted w-8 text-right">{item.pts}đ</span>
              <div className="flex gap-1">
                {[0, Math.round(item.pts * 0.4), Math.round(item.pts * 0.7), item.pts].map((v, j) => (
                  <button key={j} onClick={() => setScore(item.label, v)}
                    className="px-2 py-0.5 rounded text-base transition-colors"
                    style={(scores[item.label] || 0) >= v && v > 0 ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                    {j === 0 ? '0' : j === 1 ? '~' : j === 2 ? '+' : '✓'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/pillar/f/checklist" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">✅</div>
          <div className="text-base font-bold text-text">Checklist Ngày</div>
        </Link>
        <Link to="/pillar/f/workout-log" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">🏋️</div>
          <div className="text-base font-bold text-text">Ghi Nhật Ký</div>
        </Link>
        <Link to="/pillar/f/health-score" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">💯</div>
          <div className="text-base font-bold text-text">Lịch Sử Điểm</div>
        </Link>
        <Link to="/pillar/f/progress-test" className="rounded-2xl border border-border bg-surface p-4 hover:border-orange-500/30 transition-colors text-center">
          <div className="text-3xl mb-1">📈</div>
          <div className="text-base font-bold text-text">Test Tiến Bộ</div>
        </Link>
      </div>
    </div>
  );
}

// --- F1 Checklist tab ---
function F1Checklist() {
  const [checked, setChecked] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_daily') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return {};
      return s.items || {};
    } catch { return {}; }
  });
  const [weekView, setWeekView] = useState(false);
  const [weekData, setWeekData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_weekly') || '{}'); } catch { return {}; }
  });
  const [dailyModal, setDailyModal] = useState(null);

  function toggle(i) {
    const u = { ...checked, [i]: !checked[i] };
    setChecked(u);
    localStorage.setItem('healthapp_f_daily', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), items: u }));
  }

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / DAILY_MIN.length) * 100);
  const msg = doneCount >= 5 ? '🔥 Ngày tốt!' : doneCount >= 3 ? '✓ Đạt mức duy trì' : '→ Cứ từng bước một';

  return (
    <div className="space-y-5">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setWeekView(false)} className="flex-1 py-2 rounded-xl text-lg font-bold transition-colors" style={!weekView ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Hôm Nay</button>
        <button onClick={() => setWeekView(true)} className="flex-1 py-2 rounded-xl text-lg font-bold transition-colors" style={weekView ? { background: COLOR, color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>Tuần Này</button>
      </div>
      {!weekView ? (
        <>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COLOR }} />
            </div>
            <span className="text-lg font-bold" style={{ color: COLOR }}>{doneCount}/{DAILY_MIN.length}</span>
          </div>
          <p className="text-base text-muted mb-3">{msg} — Làm được 70% là thắng.</p>
          <div className="space-y-2">
            {DAILY_MIN.map((item, i) => (
              <DailyMinCard key={i} item={item} idx={i} checked={checked} onToggle={toggle} onOpen={setDailyModal} />
            ))}
          </div>
          {dailyModal !== null && (
            <DailyMinModal
              item={DAILY_MIN[dailyModal]} idx={dailyModal} total={DAILY_MIN.length}
              onClose={() => setDailyModal(null)}
              onPrev={() => setDailyModal(i => Math.max(0, i - 1))}
              onNext={() => setDailyModal(i => Math.min(DAILY_MIN.length - 1, i + 1))}
              hasPrev={dailyModal > 0} hasNext={dailyModal < DAILY_MIN.length - 1}
            />
          )}
        </>
      ) : (
        <div className="space-y-3">
          {WEEKLY_ITEMS.map((item, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-lg text-text">{item.label}</div>
                <div className="text-base text-muted">{item.target}</div>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map(d => (
                  <button key={d} onClick={() => {
                    const key = `${i}-${d}`;
                    const u = { ...weekData, [key]: !weekData[key] };
                    setWeekData(u);
                    localStorage.setItem('healthapp_f_weekly', JSON.stringify(u));
                  }} className="w-5 h-5 rounded transition-colors shrink-0"
                    style={weekData[`${i}-${d}`] ? { background: COLOR } : { background: 'var(--border)' }} />
                ))}
              </div>
            </div>
          ))}
          <p className="text-base text-muted">Mỗi ô tương ứng 1 ngày trong tuần. Nhấn để tick.</p>
        </div>
      )}
    </div>
  );
}

// --- F2 Workout Log tab ---
function F2WorkoutLog() {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('healthapp_f_workout') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ exercise: '', duration: '', rpe: 5, feeling: '', next: '' });

  function add() {
    if (!form.exercise) return;
    const entry = { ...form, date: new Date().toLocaleDateString('vi-VN'), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) };
    const u = [entry, ...entries].slice(0, 30);
    setEntries(u);
    localStorage.setItem('healthapp_f_workout', JSON.stringify(u));
    setForm({ exercise: '', duration: '', rpe: 5, feeling: '', next: '' });
  }

  const RPE_COLORS = { 1: '#22c55e', 2: '#22c55e', 3: '#84cc16', 4: '#84cc16', 5: '#eab308', 6: '#eab308', 7: '#f97316', 8: '#f97316', 9: '#ef4444', 10: '#ef4444' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
        <h3 className="font-bold text-text text-lg">Ghi Buổi Tập Mới</h3>
        <input value={form.exercise} onChange={e => setForm(p => ({ ...p, exercise: e.target.value }))} placeholder="Bài tập (vd: Full body 20 phút)" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <div className="grid grid-cols-2 gap-2">
          <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="Thời lượng (vd: 25 phút)" className="bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
          <input value={form.feeling} onChange={e => setForm(p => ({ ...p, feeling: e.target.value }))} placeholder="Cảm giác (vd: Hơi mệt)" className="bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-muted shrink-0">RPE: <strong style={{ color: RPE_COLORS[form.rpe] }}>{form.rpe}/10</strong></span>
          <input type="range" min={1} max={10} value={form.rpe} onChange={e => setForm(p => ({ ...p, rpe: +e.target.value }))} className="flex-1" />
        </div>
        <input value={form.next} onChange={e => setForm(p => ({ ...p, next: e.target.value }))} placeholder="Lần sau (vd: Tăng 2 lần squat)" className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted" />
        <button onClick={add} className="w-full py-2 rounded-xl text-lg font-bold text-white" style={{ background: COLOR }}>+ Lưu Buổi Tập</button>
      </div>
      {entries.length === 0 && <p className="text-center text-muted text-lg py-6">Chưa có nhật ký. Ghi buổi tập đầu tiên.</p>}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {entries.map((e, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ background: RPE_COLORS[e.rpe] }} />
              <span className="text-lg font-bold text-text">{e.exercise}</span>
              <span className="ml-auto text-base text-muted">{e.date}</span>
            </div>
            <div className="flex gap-3 text-base text-muted">
              {e.duration && <span>⏱ {e.duration}</span>}
              <span>RPE <strong style={{ color: RPE_COLORS[e.rpe] }}>{e.rpe}</strong></span>
              {e.feeling && <span>💬 {e.feeling}</span>}
            </div>
            {e.next && <p className="text-base text-muted mt-1">Lần sau: {e.next}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Nutrition log items ---
const NUTRI_LOG_ITEMS = [
  {
    key: 'protein', label: 'Protein đủ?', icon: '🥩', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient duy nhất cơ thể không tích trữ được — cần nạp đều qua từng bữa. 20–30g protein/bữa là ngưỡng tối ưu cho tổng hợp cơ, no lâu và kiểm soát đường huyết ổn định.',
    details: [
      'Mỗi bữa chính nên có 1 nguồn đạm rõ ràng: ức gà (~25g/100g), cá hồi (~20g/100g), trứng (~6g/quả), thịt bò (~25g/100g), đậu phụ cứng (~8g/100g), đậu lăng (~9g/100g).',
      'Protein giúp no lâu nhờ thermic effect cao nhất — cơ thể đốt 20–30% calo từ protein chỉ để tiêu hóa. Hỗ trợ kiểm soát cân nặng tự nhiên mà không cần đếm calo.',
      'Phân bổ đều 3 bữa tốt hơn dồn buổi tối: cơ thể hấp thu và sử dụng hiệu quả hơn cho tổng hợp protein cơ và phục hồi (protein timing research).',
      'Đạm thực vật + động vật đều có giá trị. Kết hợp 2 nguồn thực vật (gạo + đậu) cho amino acid profile đầy đủ tương đương thịt — không cần ăn thịt mỗi bữa.',
      'Dấu hiệu thiếu đạm: mệt mỏi dai dẳng, tóc và móng yếu, vết thương lành chậm, thèm đồ ngọt sau bữa ăn (cơ thể tìm năng lượng nhanh thay thế).',
      'Quy tắc đơn giản: nhìn vào đĩa ăn — không thấy nguồn đạm rõ ràng thì thêm 1 quả trứng hoặc 1 hộp sữa chua Hy Lạp. Dễ thực hiện nhất, tác động ngay.',
    ],
    points: [
      { icon: '🥚', label: '20–30g / Bữa', note: 'Ngưỡng tối ưu tổng hợp cơ và no lâu' },
      { icon: '🐟', label: 'Đa Dạng Nguồn', note: 'Thịt/cá/trứng/đậu — đổi xoay để đủ amino acid' },
      { icon: '⏰', label: 'Chia Đều 3 Bữa', note: 'Không dồn buổi tối — hấp thu và sử dụng tốt hơn' },
      { icon: '💪', label: 'Giữ Khối Cơ', note: 'Quan trọng sau 30 tuổi — cơ tự thoái hóa ~1%/năm' },
    ],
  },
  {
    key: 'veg', label: 'Rau đủ?', icon: '🥦', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị ≥5 phần (400g) rau quả/ngày. Mỗi phần thêm giảm 4% nguy cơ tim mạch và 3% nguy cơ ung thư (phân tích 95 nghiên cứu, 2019). 2 phần là ngưỡng khởi đầu thực tế.',
    details: [
      '1 phần = 1 nắm tay (~80g): 1 quả chuối, 1 nắm rau cải, 3 muỗng canh rau nấu chín, 1 bát salad nhỏ. Không cần cân — ước lượng bằng tay của chính bạn.',
      'Màu sắc = vi chất khác nhau: đỏ (lycopene - tim mạch), cam/vàng (beta-carotene - mắt), xanh lá (chlorophyll - gan), tím (anthocyanin - não), trắng (allicin - miễn dịch).',
      'Rau sống và rau nấu có lợi ích khác nhau. Kết hợp cả hai trong ngày là lý tưởng — không cần cầu kỳ, chỉ cần đa dạng màu sắc và cách chế biến.',
      'Fiber từ rau quả nuôi vi khuẩn đường ruột có lợi (prebiotics), giảm LDL, làm chậm hấp thu đường, và tạo no lâu. Không supplement nào thay thế được rau thật.',
      'Mẹo dễ nhất: thêm 1 nắm rau vào bất kỳ bữa nào; trái cây làm snack; sinh tố rau/quả buổi sáng (5 phút, không cần chế biến phức tạp).',
      'Rau đông lạnh không kém tươi về dinh dưỡng — thường đông lạnh ngay sau thu hoạch khi dưỡng chất cao nhất. Tiện và ít lãng phí hơn rau tươi.',
    ],
    points: [
      { icon: '🥦', label: '1 Nắm Tay = 1 Phần', note: '~80g — ước lượng bằng tay của bạn, không cần cân' },
      { icon: '🌈', label: 'Ăn Đa Màu Sắc', note: 'Mỗi màu = phytochemical bảo vệ sức khỏe khác nhau' },
      { icon: '🦠', label: 'Nuôi Đường Ruột', note: 'Fiber là thức ăn vi khuẩn có lợi — supplement không thay được' },
      { icon: '❄️', label: 'Đông Lạnh Vẫn Tốt', note: 'Dinh dưỡng ngang tươi — tiện lợi và ít lãng phí hơn' },
    ],
  },
  {
    key: 'water', label: 'Nước đủ?', icon: '💧', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất nước chỉ 1–2% trọng lượng cơ thể giảm hiệu suất nhận thức 10–15% và thể chất 20–30%. Khát nước là dấu hiệu đã mất nước nhẹ — không nên đợi đến khi khát.',
    details: [
      'Công thức cá nhân: cân nặng (kg) × 35 ml = lượng cơ bản/ngày. 60kg → 2,100 ml; 70kg → 2,450 ml; 80kg → 2,800 ml. Thêm ~500 ml/giờ vận động mạnh hoặc trời nóng.',
      'Nước lọc là tốt nhất. Trà xanh không đường, cà phê vừa phải, soup cũng tính. Nước ngọt và nước ép có đường KHÔNG tính — chứa calo rỗng, không hydrate hiệu quả.',
      'Chia đều cả ngày: 1 ly khi thức dậy, 1 ly trước mỗi bữa ăn, 1 ly mỗi 2 tiếng khi làm việc, 1 ly nhỏ trước ngủ (không quá nhiều để tránh thức đêm).',
      'Màu nước tiểu là thước đo tốt nhất: vàng nhạt như nước rơm = đủ. Vàng đậm hoặc cam = cần uống thêm ngay. Trong suốt = có thể uống quá nhiều.',
      'Uống quá nhiều (>4L/ngày với người ít vận động) có thể gây hạ natri máu — hiếm nhưng nguy hiểm. Mục tiêu là uống ĐỦ, không phải uống càng nhiều càng tốt.',
      'Nhu cầu tăng khi: sốt (+500ml), ăn nhiều muối/protein, ngồi điều hòa lạnh nhiều giờ (không khí khô), mang thai (+300ml), tập luyện cường độ cao.',
    ],
    points: [
      { icon: '📐', label: 'Công Thức Cá Nhân', note: 'Cân nặng (kg) × 35 ml = mục tiêu riêng của bạn' },
      { icon: '🌡️', label: 'Quan Sát Nước Tiểu', note: 'Vàng nhạt = đủ. Vàng đậm = uống thêm ngay' },
      { icon: '⏰', label: 'Chia Đều Cả Ngày', note: 'Uống dồn kém hiệu quả — thận chỉ xử lý ~1L/giờ' },
      { icon: '🚫', label: 'Không Đợi Khát', note: 'Khát = đã mất nước nhẹ rồi — uống trước khi khát' },
    ],
  },
  {
    key: 'sugar', label: 'Ít đồ ngọt?', icon: '🍬', color: '#f43f5e', rgb: '244,63,94',
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO khuyến nghị đường tự do < 10% tổng calo/ngày (~ 50g với người 2000kcal), lý tưởng < 5% (~ 25g). Người Việt trung bình tiêu thụ 46g đường/ngày — gần ngưỡng giới hạn tối đa.',
    details: [
      'Đường tự do bao gồm: đường thêm vào thức ăn (đường cát, mật ong, siro), nước ngọt, nước ép trái cây đóng hộp, và các sản phẩm chế biến. Không tính đường tự nhiên trong trái cây tươi.',
      '1 lon nước ngọt (~40g đường) đã gần hết ngưỡng khuyến nghị cả ngày. Trà sữa, cà phê ngọt, bánh ngọt, mì ăn liền — đường ẩn trong hầu hết đồ ăn chế biến sẵn.',
      'Đường gây nghiện theo cơ chế dopamine tương tự một số chất kích thích — não nhận tín hiệu phần thưởng ngay lập tức, dẫn đến thèm đường nhiều hơn sau mỗi lần ăn.',
      'Giảm đường từ từ hiệu quả hơn cắt đột ngột: thay thế dần — trà ít đường → không đường, nước ngọt → nước có gas → nước lọc. Vị giác thích nghi trong 2–4 tuần.',
      'Trái cây tươi có đường tự nhiên nhưng kèm fiber và vi chất — không cần hạn chế như đường tự do. Fiber làm chậm hấp thu, ngăn tăng đường huyết đột ngột.',
      'Nhãn thực phẩm: tìm "added sugars" (đường thêm vào) — khác với "total sugars" vốn bao gồm cả đường tự nhiên. Các tên ẩn: glucose, fructose, corn syrup, maltose, dextrose.',
    ],
    points: [
      { icon: '🎯', label: '<25g / Ngày Là Lý Tưởng', note: 'WHO: dưới 5% tổng calo — khoảng 6 muỗng cà phê' },
      { icon: '🥤', label: 'Nước Ngọt Là Nguồn Lớn Nhất', note: '1 lon = ~40g — gần hết ngưỡng cả ngày' },
      { icon: '🧠', label: 'Đường Gây Thèm Thêm', note: 'Cơ chế dopamine — não muốn nhiều hơn sau mỗi lần ăn' },
      { icon: '🍊', label: 'Trái Cây Tươi Không Bị Tính', note: 'Fiber đi kèm ngăn tăng đường huyết đột ngột' },
    ],
  },
];

// --- NutriLogCard: dual-zone (toggle Có/Chưa + open modal) ---
function NutriLogCard({ item, value, onToggle, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const isDone = value === 'Có';
  const isNo = value === 'Chưa';
  return (
    <div className="flex items-center gap-3 p-3 transition-all duration-200"
      style={{ background: hovered ? `rgba(${item.rgb},0.05)` : 'transparent' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Toggle zone */}
      <div className="flex gap-1.5 shrink-0">
        {['Có', 'Chưa'].map(opt => (
          <button key={opt} onClick={() => onToggle(item.key, opt)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-200"
            style={value === opt
              ? { background: opt === 'Có' ? item.color : '#ef4444', color: 'white', borderColor: opt === 'Có' ? item.color : '#ef4444' }
              : { borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)', background: 'transparent' }}>
            {opt}
          </button>
        ))}
      </div>
      {/* Content zone — opens modal */}
      <button onClick={onOpen} className="flex-1 flex items-center gap-2.5 text-left min-w-0 cursor-pointer">
        <span className={`text-xl shrink-0 transition-all duration-200 ${isDone ? '' : isNo ? 'grayscale opacity-50' : ''}`}>{item.icon}</span>
        <span className={`text-sm font-semibold leading-snug flex-1 truncate transition-colors ${isDone ? '' : isNo ? 'line-through text-muted' : 'text-text'}`}
          style={isDone ? { color: item.color } : {}}>
          {item.label}
        </span>
        <span className="text-[11px] font-bold shrink-0 transition-all duration-200"
          style={{ color: hovered ? item.color : 'rgba(255,255,255,0.2)' }}>Chi tiết →</span>
      </button>
    </div>
  );
}

// --- NutriLogModal ---
function NutriLogModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.icon} {item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {NUTRI_LOG_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- Meal plan data ---
const MEAL_ITEMS = [
  {
    meal: 'Sáng', icon: '🌅', color: '#f59e0b', rgb: '245,158,11',
    formula: 'Đạm + tinh bột tốt + trái cây/rau',
    eg: 'Trứng + yến mạch + chuối',
    img: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa sáng giàu protein (≥20g) giảm cảm giác thèm ăn trong ngày và ổn định đường huyết. Nghiên cứu Columbia University: bỏ bữa sáng tăng 27% nguy cơ bệnh tim mạch.',
    details: [
      'Protein bữa sáng là ưu tiên số 1: trứng (6g/quả), sữa chua Hy Lạp (15–20g/hộp), đậu phụ, phô mai tươi. Giúp no đến tận trưa và kiểm soát cortisol buổi sáng.',
      'Tinh bột bữa sáng chọn loại phức hợp: yến mạch, bánh mì nguyên cám, khoai lang. Tránh bánh ngọt, ngũ cốc đường cao — gây tăng đường huyết đột ngột và mệt lúc 10h.',
      'Trái cây buổi sáng là lý tưởng: đường tự nhiên + fiber + vitamin. Chuối cho năng lượng nhanh, táo cho fiber lâu no, berries cho antioxidant mạnh.',
      'Uống 1–2 ly nước trước bữa sáng — sau ngủ 7–8h cơ thể đang thiếu nước. Uống nước trước ăn giúp tiêu hóa tốt hơn và tránh ăn quá nhiều.',
      'Không có thời gian? 3 options nhanh: trứng chiên/luộc + chuối (5 phút), sữa chua + hoa quả (2 phút), smoothie protein + yến mạch (3 phút blender).',
      'Thời điểm tốt nhất: 30–60 phút sau khi thức dậy, đồng bộ cortisol buổi sáng (đỉnh 8–9h). Không nên ăn ngay khi mắt còn ngủ — chờ cơ thể tỉnh hẳn.',
    ],
    points: [
      { icon: '🥚', label: 'Ưu Tiên Protein', note: '≥20g protein — no lâu, giảm thèm ăn cả ngày' },
      { icon: '🌾', label: 'Tinh Bột Phức Hợp', note: 'Yến mạch / bánh nguyên cám — không tăng đường đột ngột' },
      { icon: '🍌', label: 'Trái Cây Tươi', note: 'Fiber + vitamin — lý tưởng nhất vào buổi sáng' },
      { icon: '💧', label: 'Nước Trước Ăn', note: 'Hydrate sau 7–8h không uống — tăng tiêu hóa' },
    ],
  },
  {
    meal: 'Trưa', icon: '☀️', color: '#22c55e', rgb: '34,197,94',
    formula: '½ rau + ¼ đạm + ¼ tinh bột',
    eg: 'Cơm + cá + rau luộc',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa trưa cân bằng theo Harvard Plate (½ rau + ¼ đạm + ¼ tinh bột) duy trì năng lượng ổn định chiều. Bữa trưa quá nhiều tinh bột → hiệu suất làm việc giảm 15–20% sau 2 tiếng.',
    details: [
      '½ đĩa rau/canh là nền tảng: rau xào, canh rau, salad — không giới hạn. Fiber từ rau làm chậm tiêu hóa, ổn định đường huyết, tạo môi trường đường ruột tốt.',
      '¼ đĩa đạm: cá (tốt nhất), ức gà, thịt nạc, trứng, đậu phụ. Bữa trưa là thời điểm cơ thể hấp thu protein hiệu quả — đừng bỏ qua nguồn đạm.',
      '¼ đĩa tinh bột: cơm trắng, bún, mì đều ổn — chỉ cần giữ tỷ lệ ¼ thay vì ½ hay hơn. Gạo lứt, khoai lang tốt hơn nhưng không bắt buộc.',
      'Nước canh/soup là cộng thêm tốt: cung cấp nước, điện giải, và vi chất tan trong nước. Bữa cơm Việt có canh là truyền thống rất khoa học.',
      'Tránh: bữa trưa thiếu đạm rõ ràng, đồ chiên nhiều dầu (tăng gánh tiêu hóa chiều), bỏ bữa trưa (cortisol tăng, thèm ăn tối mạnh hơn).',
      'Meal prep bữa trưa: nấu 1 lần cho 2–3 ngày. Cơm + đạm + rau giữ ngăn mát 3 ngày. Sáng hâm nóng + thêm rau tươi nếu muốn.',
    ],
    points: [
      { icon: '🥦', label: '½ Đĩa Là Rau', note: 'Không giới hạn — càng nhiều rau càng tốt' },
      { icon: '🐟', label: '¼ Đĩa Đạm', note: 'Cá lý tưởng nhất — omega-3 tốt cho não buổi chiều' },
      { icon: '🍚', label: '¼ Đĩa Tinh Bột', note: 'Giữ tỷ lệ — không phải kiêng, chỉ cần cân bằng' },
      { icon: '🍵', label: 'Canh Là Cộng Thêm', note: 'Hydrate + vi chất — truyền thống Việt rất khoa học' },
    ],
  },
  {
    meal: 'Phụ', icon: '🌿', color: '#84cc16', rgb: '132,204,22',
    formula: 'Đạm nhẹ hoặc trái cây',
    eg: 'Sữa chua + trái cây',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa phụ lành mạnh (100–200 kcal) duy trì năng lượng ổn định 3–4h sau bữa trưa, ngăn thèm ăn lúc 4–5h chiều — thời điểm nhiều người sập bẫy đồ ăn vặt không lành mạnh.',
    details: [
      'Thời điểm lý tưởng: 2.5–3h sau bữa trưa (thường 3–4h chiều). Đây là lúc đường huyết bắt đầu giảm, não cần glucose, và dễ thèm đồ ngọt hoặc cà phê.',
      'Options tốt nhất: sữa chua Hy Lạp (protein cao + probiotic), trái cây tươi (chuối/táo/cam), một nắm nhỏ hạt (almonds/walnuts), phô mai tươi, trứng luộc.',
      'Bữa phụ KHÔNG nên là: bánh ngọt, snack đóng gói, đồ chiên, nước ngọt, mì gói — tăng đường huyết nhanh rồi sụp ngay → mệt hơn trước khi ăn.',
      'Kích thước đúng: 100–200 kcal, không phải một bữa ăn đầy đủ. Nếu không đói thực sự (dạ dày rỗng, không chỉ miệng muốn ăn) — có thể bỏ qua.',
      'Uống nước trước khi quyết định ăn phụ: 20% lần "đói" thực ra là đang khát. Uống 1 ly nước, đợi 10 phút — nếu vẫn đói thì mới ăn.',
      'Cho người tập luyện: bữa phụ chiều có thể là pre-workout nhẹ nếu tập từ 5–7h tối. Chuối + protein (sữa chua/shake) 60–90 phút trước tập.',
    ],
    points: [
      { icon: '⏰', label: 'Đúng Thời Điểm', note: '3–4h chiều — ngăn đói kéo đến tối rồi ăn quá nhiều' },
      { icon: '🥛', label: 'Sữa Chua Là Lý Tưởng', note: 'Protein + probiotic + calci trong 1 lựa chọn duy nhất' },
      { icon: '💧', label: 'Nước Trước Đã', note: '20% "đói" thực ra là khát — thử nước trước 10 phút' },
      { icon: '🥜', label: 'Hạt Nhỏ Tốt', note: 'Almonds / walnuts — healthy fat + protein + no lâu' },
    ],
  },
  {
    meal: 'Tối', icon: '🌙', color: '#6366f1', rgb: '99,102,241',
    formula: 'Đạm + rau nhiều + tinh bột vừa',
    eg: 'Gà/cá + salad + khoai',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bữa tối quyết định chất lượng giấc ngủ và phục hồi. Ăn quá no, quá muộn (sau 9h), hoặc nhiều tinh bột tinh sẽ tăng đường huyết khi ngủ — ảnh hưởng hormone tăng trưởng tiết 11h–1h sáng.',
    details: [
      'Đạm bữa tối quan trọng cho phục hồi ban đêm: cơ thể tổng hợp và sửa chữa mô trong khi ngủ. Cá hồi, ức gà, trứng, đậu phụ — dễ tiêu hơn thịt đỏ vào buổi tối.',
      'Rau càng nhiều càng tốt: salad, rau hấp, súp rau — cung cấp fiber và vi chất mà không thêm nhiều calo. Rau nhiều bữa tối giúp tiêu hóa tốt qua đêm.',
      'Tinh bột buổi tối: giảm ½ so với bữa trưa nhưng không cần cắt hoàn toàn. Khoai lang tốt hơn cơm trắng vào buổi tối (GI thấp hơn, fiber cao hơn).',
      'Thời điểm ăn tối: lý tưởng 6–7h30, kết thúc ít nhất 2–3h trước khi ngủ. Ăn muộn → dạ dày hoạt động khi ngủ → giấc ngủ kém, trào ngược.',
      'Tránh: alcohol nhiều (ức chế REM sleep), đồ chiên xào nhiều dầu (khó tiêu), đường và tinh bột tinh nhiều (tăng đường huyết khi ngủ).',
      'After-dinner walk: 10–15 phút đi bộ nhẹ sau bữa tối giảm đường huyết sau ăn 25–30% — không cần tập nặng, chỉ cần di chuyển nhẹ là đủ.',
    ],
    points: [
      { icon: '🕕', label: 'Ăn Trước 8h', note: 'Kết thúc 2–3h trước ngủ — tốt cho giấc ngủ và tiêu hóa' },
      { icon: '🥗', label: 'Rau Là Ưu Tiên', note: 'Không giới hạn — fiber + vi chất, ít calo' },
      { icon: '🍠', label: 'Khoai Lang Tốt Hơn', note: 'GI thấp hơn cơm trắng — đường huyết ổn định khi ngủ' },
      { icon: '🚶', label: 'Đi Bộ 10–15 Phút', note: 'Sau ăn — giảm đường huyết 25–30% mà không cần tập nặng' },
    ],
  },
  {
    meal: 'Sau tập', icon: '💪', color: '#ef4444', rgb: '239,68,68',
    formula: 'Đạm nhanh + carb dễ tiêu',
    eg: 'Sữa/whey + chuối',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Trong "anabolic window" 30–60 phút sau tập: protein kích hoạt tổng hợp cơ tối đa, carb nhanh tái nạp glycogen. Bỏ bữa sau tập = bỏ phí tới 50% hiệu quả buổi tập.',
    details: [
      '"Anabolic window": 30–60 phút sau tập là khi cơ bắp nhạy cảm nhất với insulin và protein. Tổng hợp protein cơ tăng tối đa trong khung giờ này.',
      'Protein sau tập: 20–40g là đủ. Whey protein hấp thu nhanh nhất (15–20 phút), sau đó là trứng, sữa tươi, sữa chua Hy Lạp, ức gà. Quan trọng là có protein.',
      'Carb sau tập: chuối, bánh mì trắng, cơm trắng, nước ép trái cây — đường đơn/đường nhanh để tái nạp glycogen. Đây là lúc hiếm hoi cần carb nhanh.',
      'Nước và điện giải: uống bù lại mồ hôi (~500ml/giờ tập). Thêm chút muối hoặc sports drink nếu tập dài hơn 60 phút và ra nhiều mồ hôi.',
      'Không cần bữa sau tập nếu: buổi tập < 30 phút nhẹ, ăn bữa chính trong vòng 2h sau tập, hoặc mục tiêu giảm mỡ cần deficit calo nghiêm ngặt.',
      'Cẩn thận "bù đắp" sau tập: nhiều người ăn nhiều hơn lượng đốt được. Bữa sau tập là để phục hồi — không phải phần thưởng cho ăn tự do.',
    ],
    points: [
      { icon: '⏱️', label: 'Trong 30–60 Phút', note: 'Anabolic window — tổng hợp cơ tối đa trong khung giờ này' },
      { icon: '🥛', label: 'Protein 20–40g', note: 'Whey/trứng/sữa — hấp thu nhanh, phù hợp sau tập' },
      { icon: '🍌', label: 'Carb Nhanh OK', note: 'Chuối / cơm trắng — tái nạp glycogen ngay sau tập' },
      { icon: '💧', label: 'Bù Nước Đủ', note: '~500ml/giờ tập — ưu tiên bù nước trước bù thức ăn' },
    ],
  },
];

// --- MealCard ---
function MealCard({ item, idx, onOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onOpen(idx)}
      className="w-full flex items-center gap-3 p-3 text-left border-b last:border-b-0 transition-all duration-200"
      style={{
        borderColor: 'rgba(255,255,255,0.06)',
        background: hovered ? `rgba(${item.rgb},0.07)` : 'transparent',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: `rgba(${item.rgb},0.12)`, border: `1.5px solid rgba(${item.rgb},0.3)` }}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-base" style={{ color: item.color }}>{item.meal}</span>
          <span className="text-xs text-muted truncate">{item.formula}</span>
        </div>
        <p className="text-xs text-muted truncate">Vd: {item.eg}</p>
      </div>
      <span className="text-[11px] font-bold shrink-0 px-2 py-0.5 rounded-lg transition-all duration-200"
        style={{ color: hovered ? item.color : 'rgba(255,255,255,0.25)', background: hovered ? `rgba(${item.rgb},0.12)` : 'transparent' }}>
        Chi tiết →
      </span>
    </button>
  );
}

// --- MealModal ---
function MealModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.meal} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>Bữa {item.meal}</h2>
          <p className="font-semibold text-base mb-6" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.formula} · Vd: {item.eg}</p>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {MEAL_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- F3 Meal Plan tab ---
function F3MealPlan() {
  const PLATE_PARTS = [
    { label: '½ đĩa — Rau, canh, salad, trái cây ít ngọt', color: '#22c55e', pct: 50 },
    { label: '¼ đĩa — Đạm: thịt, cá, trứng, đậu', color: '#f97316', pct: 25 },
    { label: '¼ đĩa — Tinh bột: cơm, bún, khoai, yến mạch', color: '#eab308', pct: 25 },
  ];
  const [log, setLog] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_meal') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return {};
      return s.data || {};
    } catch { return {}; }
  });
  const [mealModal, setMealModal] = useState(null);
  const [nutriModal, setNutriModal] = useState(null);

  function setVal(key, val) {
    const u = { ...log, [key]: val };
    setLog(u);
    localStorage.setItem('healthapp_f_meal', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h3 className="font-bold text-text mb-3">Template Đĩa Ăn Lành Mạnh</h3>
        <div className="space-y-2 mb-3">
          {PLATE_PARTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="rounded-full" style={{ width: `${p.pct * 2}px`, height: 8, background: p.color, minWidth: 20 }} />
              <span className="text-base text-muted">{p.label}</span>
            </div>
          ))}
        </div>
        <p className="text-base text-muted">+ Một lượng nhỏ chất béo tốt: dầu olive, bơ, các loại hạt.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <span className="text-base font-bold uppercase tracking-widest" style={{ color: COLOR }}>Thực Đơn Theo Bữa</span>
          <span className="text-xs text-muted">Nhấn để xem chi tiết</span>
        </div>
        {MEAL_ITEMS.map((m, i) => (
          <MealCard key={i} item={m} idx={i} onOpen={setMealModal} />
        ))}
      </div>
      {mealModal !== null && (
        <MealModal
          item={MEAL_ITEMS[mealModal]} idx={mealModal}
          onClose={() => setMealModal(null)}
          onPrev={() => setMealModal(i => Math.max(0, i - 1))}
          onNext={() => setMealModal(i => Math.min(MEAL_ITEMS.length - 1, i + 1))}
          hasPrev={mealModal > 0} hasNext={mealModal < MEAL_ITEMS.length - 1}
        />
      )}
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <h3 className="font-bold text-text">Nhật Ký Dinh Dưỡng Hôm Nay</h3>
          <span className="text-xs text-muted">Nhấn để xem chi tiết</span>
        </div>
        <div className="divide-y divide-white/5">
          {NUTRI_LOG_ITEMS.map((item) => (
            <NutriLogCard key={item.key} item={item} value={log[item.key]} onToggle={setVal} onOpen={() => setNutriModal(item.key)} />
          ))}
        </div>
      </div>
      {nutriModal !== null && (() => {
        const item = NUTRI_LOG_ITEMS.find(x => x.key === nutriModal);
        const idx = NUTRI_LOG_ITEMS.findIndex(x => x.key === nutriModal);
        return (
          <NutriLogModal
            item={item} idx={idx}
            onClose={() => setNutriModal(null)}
            onPrev={() => setNutriModal(NUTRI_LOG_ITEMS[Math.max(0, idx - 1)].key)}
            onNext={() => setNutriModal(NUTRI_LOG_ITEMS[Math.min(NUTRI_LOG_ITEMS.length - 1, idx + 1)].key)}
            hasPrev={idx > 0} hasNext={idx < NUTRI_LOG_ITEMS.length - 1}
          />
        );
      })()}
    </div>
  );
}

// --- Lifestyle items data ---
const LIFESTYLE_ITEMS = [
  {
    key: 'sleep', icon: '😴', label: 'Giấc ngủ tối qua',
    min: 4, max: 10, step: 0.5, unit: 'giờ',
    color: '#14b8a6', rgb: '20,184,166',
    good: v => v >= 7 ? '#22c55e' : v >= 6 ? '#eab308' : '#ef4444',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ngủ đủ 7–9 giờ không chỉ là nghỉ ngơi — não bộ đang "bảo trì hệ thống": xóa độc tố amyloid-beta (nguy cơ Alzheimer), củng cố ký ức, tái tạo hormone tăng trưởng và tế bào miễn dịch.',
    details: [
      '7–9 giờ là ngưỡng khuyến nghị của National Sleep Foundation cho người trưởng thành. Dưới 6 giờ liên tục 2 tuần = hiệu suất nhận thức tương đương thức 24 giờ liên tục.',
      'Giai đoạn REM (20–25% tổng giấc ngủ, chủ yếu sau 5–6h): não xử lý cảm xúc, củng cố ký ức dài hạn, tạo kết nối sáng tạo. Cắt ngắn giấc ngủ = mất REM.',
      'Ngủ đủ giấc trong 1 tuần: testosterone tăng như 10 năm trẻ hơn (nam); cortisol giảm 15%; leptin (hormone no) tăng, ghrelin (hormone đói) giảm — hỗ trợ kiểm soát cân nặng tự nhiên.',
      'Nợ ngủ không trả được hoàn toàn bằng ngủ bù cuối tuần. Ngủ bù 1–2h có ích, nhưng không phục hồi hoàn toàn hiệu suất nhận thức và hormone bị ảnh hưởng trong tuần.',
      'Chất lượng quan trọng hơn số giờ: 7 giờ ngủ liên tục không gián đoạn tốt hơn 9 giờ ngủ chập chờn. Đánh giá bằng cảm giác tỉnh táo sau 15–20 phút dậy.',
      'Nhiệt độ phòng 18–20°C là yếu tố môi trường tác động nhất. Cơ thể cần hạ nhiệt độ lõi ~1°C để vào giấc ngủ sâu — phòng mát hỗ trợ quá trình này hiệu quả.',
    ],
    points: [
      { icon: '🧠', label: '7–9 Giờ Là Chuẩn', note: '<6 giờ = hiệu suất như thức 24h liên tục' },
      { icon: '🌙', label: 'REM Là Quan Trọng', note: 'Xuất hiện sau 5–6h — cắt ngắn giấc ngủ mất REM' },
      { icon: '💉', label: 'Hormone Tự Tái Tạo', note: 'GH, testosterone, leptin phục hồi trong giấc ngủ sâu' },
      { icon: '🌡️', label: 'Phòng Mát 18–20°C', note: 'Yếu tố môi trường tác động nhất đến chất lượng ngủ' },
    ],
  },
  {
    key: 'steps', icon: '🚶', label: 'Số bước chân hôm nay',
    min: 1000, max: 15000, step: 500, unit: 'bước',
    color: '#f59e0b', rgb: '245,158,11',
    good: v => v >= 8000 ? '#22c55e' : v >= 5000 ? '#eab308' : '#ef4444',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nghiên cứu JAMA 2019 trên 16,000 người: mỗi 1,000 bước thêm giảm 15% nguy cơ tử vong sớm. Lợi ích tăng dần đến 7,500 bước/ngày — sau đó ổn định. Không cần 10,000 mới có lợi.',
    details: [
      '10,000 bước/ngày là con số marketing từ pedometer Nhật 1965 — không có cơ sở khoa học cụ thể. Nghiên cứu hiện đại cho thấy lợi ích tối ưu ở 7,000–8,000 bước/ngày.',
      'NEAT (Non-Exercise Activity Thermogenesis): hoạt động không phải tập luyện — đi bộ, đứng, fidgeting — chiếm 15–50% tổng calo đốt mỗi ngày. Tăng NEAT hiệu quả hơn tập gym 1h rồi ngồi cả ngày.',
      'Ngưỡng nguy hiểm: dưới 5,000 bước/ngày tương quan với tăng nguy cơ tiểu đường loại 2, bệnh tim mạch, và tử vong sớm. Đây là ngưỡng cần vượt qua đầu tiên.',
      'Đi bộ sau bữa ăn 10–15 phút: giảm đường huyết sau ăn 25–30%, cải thiện độ nhạy insulin, giảm cảm giác nặng nề và buồn ngủ sau ăn. Hiệu quả nhất trong 30 phút sau ăn.',
      'Hack số bước: đỗ xe xa hơn 200m, đi thang bộ thay thang máy, bước đi khi gọi điện, xuống xe buýt 1–2 trạm trước. Dễ thêm 2,000–3,000 bước mà không cần thay đổi lịch.',
      'Cường độ cũng quan trọng: đi bộ nhanh (>100 bước/phút, >5km/h) tốt hơn đi chậm cùng số bước. Có thể nói chuyện nhưng hơi khó thở = cường độ lý tưởng.',
    ],
    points: [
      { icon: '🎯', label: '7,000–8,000 Là Đủ', note: '10,000 bước là marketing — lợi ích tối ưu ở 7–8k' },
      { icon: '🔥', label: 'NEAT Quan Trọng', note: 'Di chuyển hàng ngày đốt nhiều calo hơn bạn nghĩ' },
      { icon: '🍽️', label: 'Đi Bộ Sau Ăn', note: '10–15 phút sau ăn — giảm đường huyết 25–30%' },
      { icon: '⚡', label: 'Nhanh Hơn Là Tốt Hơn', note: '>100 bước/phút = zone cardio nhẹ, hiệu quả hơn' },
    ],
  },
  {
    key: 'energy', icon: '⚡', label: 'Mức năng lượng',
    min: 1, max: 10, step: 1, unit: '/10',
    color: '#a855f7', rgb: '168,85,247',
    good: v => v >= 7 ? '#22c55e' : v >= 5 ? '#eab308' : '#ef4444',
    img: 'https://images.unsplash.com/photo-1495837174058-628aafc7d610?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Năng lượng là chỉ số tổng hợp phản ánh chất lượng ngủ, dinh dưỡng, hydration, stress và vận động. Năng lượng thấp kéo dài (<=5/10 hơn 3 ngày liên tiếp) là tín hiệu cần điều chỉnh hệ thống.',
    details: [
      'Nguyên nhân phổ biến nhất: thiếu ngủ (cộng hưởng nhanh nhất), mất nước nhẹ (chỉ 1–2% đã giảm 20% hiệu suất), bỏ bữa sáng, ăn ít protein, và ngồi quá lâu không vận động.',
      'Chu kỳ năng lượng tự nhiên (ultradian rhythm): mỗi ~90–120 phút có 1 chu kỳ tập trung cao → giảm năng lượng → nghỉ ngắn → phục hồi. Làm việc theo chu kỳ này hiệu quả hơn.',
      '"2:30 PM slump" (mệt chiều): do đường huyết giảm sau bữa trưa kết hợp nhịp sinh học. Fix: đi bộ 10 phút + uống nước + ánh sáng tự nhiên — không cần cà phê hay đồ ngọt.',
      'Tập luyện tăng năng lượng ngay: 10–20 phút tập vừa phải tăng norepinephrine và dopamine, kéo dài 2–4 giờ. Ngược lại với cảm giác mệt hơn mà nhiều người lo trước khi tập.',
      'Thiền/thở 5 phút phục hồi nhanh hơn caffeine: kích hoạt hệ thần kinh phó giao cảm trong 60–90 giây, giảm cortisol, tăng tập trung mà không có crash sau đó.',
      'Theo dõi pattern: ghi chú ngày nào năng lượng cao/thấp và liên hệ với ngủ, ăn, vận động, stress. Sau 2–3 tuần sẽ thấy pattern rõ để tối ưu hóa.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ Là Nhanh Nhất', note: 'Thiếu ngủ = nguyên nhân năng lượng thấp phổ biến nhất' },
      { icon: '💧', label: 'Kiểm Tra Nước', note: 'Mất nước 1–2% giảm 20% hiệu suất — uống ngay' },
      { icon: '🏃', label: 'Tập = Tăng Năng Lượng', note: '10–20 phút tập nhẹ — norepinephrine kéo dài 2–4h' },
      { icon: '📊', label: 'Theo Dõi Pattern', note: '2–3 tuần ghi chú → thấy rõ nguyên nhân năng lượng thấp' },
    ],
  },
];

// --- LifestyleModal ---
function LifestyleModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.icon} {item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {LIFESTYLE_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- F4 Lifestyle tab ---
function F4Lifestyle() {
  const [data, setData] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_lifestyle') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return { sleep: 7, steps: 5000, energy: 7 };
      return s.data || { sleep: 7, steps: 5000, energy: 7 };
    } catch { return { sleep: 7, steps: 5000, energy: 7 }; }
  });
  const [lifestyleModal, setLifestyleModal] = useState(null);

  function set(k, v) {
    const u = { ...data, [k]: v };
    setData(u);
    localStorage.setItem('healthapp_f_lifestyle', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  return (
    <div className="space-y-4">
      {LIFESTYLE_ITEMS.map((item, i) => {
        const val = data[item.key];
        const valColor = item.good(val);
        return (
          <div key={item.key} className="rounded-2xl border border-border bg-surface p-4 transition-all duration-200"
            style={{ borderColor: lifestyleModal === i ? `rgba(${item.rgb},0.35)` : undefined }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-lg text-text font-medium flex-1">{item.label}</span>
              <span className="text-2xl font-black" style={{ color: valColor }}>{val}<span className="text-base font-normal ml-0.5">{item.unit}</span></span>
              <button onClick={() => setLifestyleModal(i)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg ml-2 transition-all duration-200 hover:opacity-80"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
                Chi tiết →
              </button>
            </div>
            <input type="range" min={item.min} max={item.max} step={item.step} value={val}
              onChange={e => set(item.key, +e.target.value)} className="w-full" />
          </div>
        );
      })}
      {lifestyleModal !== null && (
        <LifestyleModal
          item={LIFESTYLE_ITEMS[lifestyleModal]} idx={lifestyleModal}
          onClose={() => setLifestyleModal(null)}
          onPrev={() => setLifestyleModal(i => Math.max(0, i - 1))}
          onNext={() => setLifestyleModal(i => Math.min(LIFESTYLE_ITEMS.length - 1, i + 1))}
          hasPrev={lifestyleModal > 0} hasNext={lifestyleModal < LIFESTYLE_ITEMS.length - 1}
        />
      )}
      <div className="rounded-2xl border p-3 text-base text-muted" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.04)` }}>
        Dữ liệu lưu theo ngày trong thiết bị của bạn. <Link to="/pillar/f/lifestyle-tracker" className="underline" style={{ color: COLOR }}>Xem lịch sử →</Link>
      </div>
    </div>
  );
}

// --- Mind tracker items data ---
const MIND_ITEMS = {
  stress: {
    key: 'stress', icon: '😓', label: 'Mức stress hôm nay',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress ngắn hạn (acute stress) thực ra có lợi — tăng hiệu suất, cảnh giác, và học hỏi. Nguy hiểm là stress mãn tính (>7/10 kéo dài nhiều ngày): cortisol cao liên tục phá vỡ hệ miễn dịch, trí nhớ, và sức khỏe tim mạch.',
    details: [
      'Stress mãn tính (cortisol cao kéo dài): thu nhỏ vùng hippocampus (trí nhớ), suy yếu prefrontal cortex (ra quyết định), và tăng hoạt động amygdala (phản ứng sợ hãi). Theo nghĩa đen làm thay đổi cấu trúc não.',
      'Chỉ số stress 7–8/10 hơn 3 ngày liên tiếp = tín hiệu cần can thiệp ngay. Không phải chờ đến khi kiệt sức (burnout) mới xử lý — burnout mất 3–6 tháng để phục hồi hoàn toàn.',
      '"Stress inoculation": tiếp xúc có kiểm soát với stress nhỏ (tập luyện khó, cold shower, deadline hợp lý) xây dựng khả năng chịu đựng stress lớn hơn — như vaccine cho não.',
      'Kỹ thuật hạ stress nhanh nhất được chứng minh: thở ra dài hơn hít vào (4 hít - 6 thở ra). Kích hoạt vagus nerve → hệ phó giao cảm trong 60–90 giây. Dùng được mọi lúc mọi nơi.',
      'Nguyên nhân stress thường bị bỏ qua: thiếu ngủ (ngủ 6h tăng cortisol 37%), caffeine quá nhiều (>400mg/ngày), đường và thực phẩm siêu chế biến, và thiếu vận động thể chất.',
      'Journaling về stress giảm cảm giác stress ngay lập tức: viết ra giúp não "ngoại hóa" lo lắng ra khỏi vòng lặp suy nghĩ liên tục, giải phóng working memory để xử lý vấn đề thực tế.',
    ],
    points: [
      { icon: '⚡', label: 'Stress Ngắn = Có Lợi', note: 'Acute stress tăng hiệu suất — mãn tính mới nguy' },
      { icon: '🧠', label: 'Thay Đổi Cấu Trúc Não', note: 'Cortisol cao kéo dài thu nhỏ hippocampus thật sự' },
      { icon: '💨', label: 'Thở Ra Dài Hơn', note: '4 hít - 6 thở ra — vagus nerve trong 60–90 giây' },
      { icon: '😴', label: 'Ngủ Thiếu = Cortisol +37%', note: 'Ngủ đủ là biện pháp chống stress số 1' },
    ],
  },
  mood: {
    key: 'mood', icon: '🙂', label: 'Tâm trạng hôm nay',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tâm trạng (mood) khác với cảm xúc (emotion): cảm xúc kéo dài vài giây đến vài phút, tâm trạng kéo dài giờ đến ngày. Theo dõi tâm trạng hàng ngày giúp nhận ra pattern và can thiệp sớm trước khi trở thành trầm cảm.',
    details: [
      'Theo dõi tâm trạng 21 ngày liên tiếp: nghiên cứu cho thấy người dùng mood tracker nhận ra được "early warning signs" của tâm trạng xấu sắp đến trước 1–2 ngày, cho phép can thiệp phòng ngừa.',
      'Tâm trạng bị ảnh hưởng mạnh bởi: ánh sáng tự nhiên (thiếu ánh sáng → serotonin thấp), vận động (10 phút đi bộ tăng mood ngay), xã hội (kết nối với người khác là nhu cầu sinh học), và ăn uống (đường ruột sản xuất 90% serotonin).',
      'Behavioral activation: khi mood thấp, người ta thường giảm hoạt động → mood giảm thêm → giảm hoạt động hơn nữa (vòng xoáy). Phá vỡ bằng cách làm 1 việc nhỏ dù không muốn — mood thường cải thiện sau đó.',
      'Mood contagion (lây lan tâm trạng): não có mirror neurons phản chiếu trạng thái cảm xúc của người xung quanh. 15 phút với người tích cực có thể cải thiện mood; ngược lại với người tiêu cực.',
      'Sáng sớm là thời điểm mood dễ bị ảnh hưởng nhất (limbic system chưa "khởi động"). Tránh: xem tin tức ngay khi dậy, check email công việc, gặp người khó chịu đầu tiên. Bắt đầu với 5 phút yên tĩnh.',
      'Mood thấp kéo dài >2 tuần, không có nguyên nhân rõ ràng = nên nói chuyện với chuyên gia. Không phải "yếu đuối" — là tín hiệu sinh học cần hỗ trợ.',
    ],
    points: [
      { icon: '📊', label: 'Theo Dõi = Phòng Ngừa', note: 'Nhận ra pattern 1–2 ngày trước để can thiệp sớm' },
      { icon: '☀️', label: 'Ánh Sáng + Vận Động', note: '10 phút đi bộ ngoài trời — tăng serotonin ngay' },
      { icon: '🔄', label: 'Phá Vòng Xoáy', note: 'Mood thấp → ít hoạt động → thấp hơn: làm 1 việc nhỏ' },
      { icon: '🧬', label: '90% Serotonin Từ Ruột', note: 'Ăn đa dạng, ít đường = hỗ trợ tâm trạng từ gốc' },
    ],
  },
  calm: {
    key: 'calm', icon: '🧘', label: 'Calm practice hôm nay',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút calm practice mỗi ngày giảm cortisol 15–20% sau 4 tuần nhất quán (Harvard Medical School). Không cần ngồi thiền "đúng chuẩn" — bất kỳ hoạt động nào kích hoạt hệ phó giao cảm đều tính.',
    details: [
      'Calm practice là bất kỳ hoạt động nào đưa bạn vào trạng thái "rest and digest": thở chậm có chủ đích, đi bộ không điện thoại, viết nhật ký, thiền, yoga nhẹ, đọc sách, tắm nước ấm, nghe nhạc chú tâm.',
      'Box breathing (4-4-4-4): hít vào 4s → nín 4s → thở ra 4s → nín 4s. Lặp 4–6 lần = 1.5–2.5 phút. Navy SEALs dùng để giữ bình tĩnh trong tình huống áp lực cực cao — bạn cũng dùng được.',
      'Nhất quán quan trọng hơn thời lượng: 5 phút/ngày mỗi ngày hiệu quả hơn 30 phút/tuần vào cuối tuần. Não học nhận tín hiệu thư giãn tốt hơn khi luyện tập đều đặn.',
      'Default Mode Network (DMN): khi não "nghỉ ngơi" không tập trung vào nhiệm vụ, DMN hoạt động — xử lý cảm xúc, củng cố ký ức, và tạo sự kết nối sáng tạo. Calm practice cho DMN "chạy".',
      'Đi bộ không điện thoại 10 phút: vừa tăng bước chân, vừa kích hoạt calm state, vừa cho DMN hoạt động. Một hoạt động đạt 3 mục tiêu cùng lúc — hiệu quả nhất trong danh sách.',
      'Journaling 3 câu: "Hôm nay tôi biết ơn điều gì?", "Điều gì đang chiếm tâm trí tôi?", "Ngày mai tôi muốn làm tốt hơn điều gì?" — 5 phút, tác động lớn đến clarity và tâm trạng.',
    ],
    points: [
      { icon: '⏱️', label: '5 Phút Là Đủ', note: 'Nhất quán quan trọng hơn thời lượng — tích lũy 4 tuần' },
      { icon: '📦', label: 'Box Breathing', note: '4-4-4-4 — Navy SEALs dùng, bạn cũng dùng được' },
      { icon: '🚶', label: 'Đi Bộ Không Phone', note: '10 phút: bước chân + calm + DMN — 3 trong 1' },
      { icon: '📝', label: 'Journaling 3 Câu', note: 'Biết ơn + lo lắng + cải thiện — 5 phút clarity lớn' },
    ],
  },
  journal: {
    key: 'journal', icon: '📝', label: 'Ghi nhanh 1 dòng',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Expressive writing (viết về cảm xúc và suy nghĩ) 15–20 phút/ngày × 3–4 ngày liên tiếp: giảm lo âu, cải thiện hệ miễn dịch, giảm lượt khám bác sĩ (James Pennebaker, UT Austin). Hiệu quả kéo dài 4–6 tuần sau.',
    details: [
      'Viết ra giúp "ngoại hóa" lo lắng ra khỏi vòng lặp suy nghĩ trong đầu. Não không cần tiếp tục "giữ" thông tin đó trong working memory → giải phóng năng lực nhận thức cho việc khác.',
      '"Ghi nhanh 1 dòng" đủ để tạo thói quen: ngưỡng thấp tối đa (1 câu, 10–15 từ). Sau khi bắt đầu viết, 70% người tiếp tục viết nhiều hơn nhờ quán tính. Đừng đặt mục tiêu cao ngay từ đầu.',
      'Brain dump buổi sáng: viết 3 trang bất kỳ điều gì trong đầu khi vừa dậy (Morning Pages — Julia Cameron). Không cần hay, không cần logic — mục tiêu là xả hết "mental clutter" trước ngày mới.',
      'Gratitude journaling (ghi biết ơn): não không thể cảm nhận lo lắng và biết ơn đồng thời. 3 điều biết ơn cụ thể (không lặp lại) mỗi ngày tái cấu trúc mạng lưới thần kinh nhận thức tích cực sau 3–4 tuần.',
      'Pre-sleep journaling: viết ra những việc chưa làm xong và kế hoạch ngày mai trước khi ngủ. Nghiên cứu Michael Scullin (Baylor): giảm thời gian để vào giấc ngủ trung bình 9 phút — não ngừng "nhắc nhở".',
      'Không cần journal đẹp hay có cấu trúc: note phone, giấy nhỏ, voice memo đều tính. Quan trọng là quá trình "chuyển từ trong đầu ra ngoài" — không phải phương tiện hay hình thức.',
    ],
    points: [
      { icon: '🧠', label: 'Giải Phóng Working Memory', note: 'Viết ra = não không cần giữ → tập trung hơn' },
      { icon: '🙏', label: 'Gratitude 3 Điều', note: 'Biết ơn + lo lắng không cùng tồn tại trong não' },
      { icon: '🌙', label: 'Viết Trước Ngủ', note: 'Kế hoạch ngày mai → ngủ nhanh hơn 9 phút' },
      { icon: '📱', label: 'Bất Kỳ Phương Tiện Nào', note: 'Phone/giấy/voice — quan trọng là viết ra, không phải nơi' },
    ],
  },
};

// --- MindModal ---
function MindModal({ itemKey, onClose, onPrev, onNext, hasPrev, hasNext, keys }) {
  const item = MIND_ITEMS[itemKey];
  const idx = keys.indexOf(itemKey);
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.icon} {item.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {keys.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

const MIND_KEYS = ['stress', 'mood', 'calm', 'journal'];

// --- F5 Mind Tracker tab ---
function F5MindTracker() {
  const MOODS = ['😞', '😐', '🙂', '😊', '🤩'];
  const [data, setData] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('healthapp_f_mind') || '{}');
      if (s.date !== new Date().toLocaleDateString('vi-VN')) return { stress: 5, mood: 2, calm: false, journal: '' };
      return s.data || { stress: 5, mood: 2, calm: false, journal: '' };
    } catch { return { stress: 5, mood: 2, calm: false, journal: '' }; }
  });
  const [mindModal, setMindModal] = useState(null);

  function set(k, v) {
    const u = { ...data, [k]: v };
    setData(u);
    localStorage.setItem('healthapp_f_mind', JSON.stringify({ date: new Date().toLocaleDateString('vi-VN'), data: u }));
  }

  const stressColor = data.stress >= 7 ? '#ef4444' : data.stress >= 5 ? '#f97316' : '#22c55e';

  function DetailBtn({ itemKey }) {
    const item = MIND_ITEMS[itemKey];
    return (
      <button onClick={() => setMindModal(itemKey)}
        className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 shrink-0"
        style={{ color: item.color, background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
        Chi tiết →
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stress */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <span>😓</span>
          <span className="text-lg text-text flex-1">Mức stress hôm nay</span>
          <span className="font-black" style={{ color: stressColor }}>{data.stress}/10</span>
          <DetailBtn itemKey="stress" />
        </div>
        <input type="range" min={1} max={10} value={data.stress} onChange={e => set('stress', +e.target.value)} className="w-full" />
      </div>
      {/* Mood */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg text-text flex-1">Tâm trạng hôm nay</span>
          <DetailBtn itemKey="mood" />
        </div>
        <div className="flex gap-3 justify-center">
          {MOODS.map((m, i) => (
            <button key={i} onClick={() => set('mood', i)}
              className="text-4xl transition-all duration-200"
              style={{ opacity: data.mood === i ? 1 : 0.35, transform: data.mood === i ? 'scale(1.3)' : 'scale(1)' }}>
              {m}
            </button>
          ))}
        </div>
      </div>
      {/* Calm practice */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg text-text flex-1">Đã có calm practice hôm nay?</span>
          <button onClick={() => set('calm', !data.calm)} className="px-4 py-1.5 rounded-xl text-base font-bold transition-colors shrink-0"
            style={data.calm ? { background: '#a855f7', color: 'white' } : { background: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
            {data.calm ? '✓ Đã làm' : 'Chưa'}
          </button>
          <DetailBtn itemKey="calm" />
        </div>
        <p className="text-base text-muted">Thở chậm, thiền, đi bộ không điện thoại, journaling...</p>
      </div>
      {/* Journal */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg text-text flex-1">Ghi nhanh 1 dòng</span>
          <DetailBtn itemKey="journal" />
        </div>
        <textarea value={data.journal} onChange={e => set('journal', e.target.value)} rows={2} placeholder="Hôm nay tôi cảm thấy... / Điều làm tôi khó tập trung là..." className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted resize-none" />
      </div>
      {mindModal !== null && (() => {
        const idx = MIND_KEYS.indexOf(mindModal);
        return (
          <MindModal
            itemKey={mindModal} keys={MIND_KEYS}
            onClose={() => setMindModal(null)}
            onPrev={() => setMindModal(MIND_KEYS[Math.max(0, idx - 1)])}
            onNext={() => setMindModal(MIND_KEYS[Math.min(MIND_KEYS.length - 1, idx + 1)])}
            hasPrev={idx > 0} hasNext={idx < MIND_KEYS.length - 1}
          />
        );
      })()}
    </div>
  );
}

// --- TestModal ---
function TestModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = TEST_ITEMS[idx];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.icon} {item.label}</h2>
          <p className="text-sm mb-4" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.unit} · {item.how}</p>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {TEST_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- F6 Progress Test tab ---
function F6Test() {
  const [vals, setVals] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_f_test') || '{}'); } catch { return {}; } });
  const [saved, setSaved] = useState(false);
  const [testModal, setTestModal] = useState(null);

  function set(k, v) { setVals(p => ({ ...p, [k]: v })); }
  function save() {
    const entry = { ...vals, date: new Date().toLocaleDateString('vi-VN') };
    try {
      const hist = JSON.parse(localStorage.getItem('healthapp_f_test_hist') || '[]');
      const filtered = hist.filter(h => h.date !== entry.date);
      localStorage.setItem('healthapp_f_test_hist', JSON.stringify([entry, ...filtered].slice(0, 4)));
      localStorage.setItem('healthapp_f_test', JSON.stringify(vals));
    } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="text-lg text-muted">Thực hiện test đầu vào và mỗi 4 tuần một lần để đo tiến bộ toàn diện.</p>
      <div className="space-y-2">
        {TEST_ITEMS.map((item, i) => (
          <div key={i} className="rounded-2xl border bg-surface p-3 flex items-center gap-3 transition-colors duration-200"
            style={{ borderColor: testModal === i ? `rgba(${item.rgb},0.45)` : 'var(--border)' }}>
            <button onClick={() => setTestModal(i)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-200 hover:scale-110"
              style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
              {item.icon}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-base text-text font-medium leading-tight">{item.label}</div>
              <div className="text-xs text-muted truncate">{item.how}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <input value={vals[item.label] || ''} onChange={e => set(item.label, e.target.value)} placeholder="0" className="w-16 bg-bg border border-border rounded-lg px-2 py-1 text-lg text-text text-center" />
              <span className="text-xs text-muted w-14 leading-tight">{item.unit}</span>
              <button onClick={() => setTestModal(i)}
                className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 shrink-0"
                style={{ color: item.color, background: `rgba(${item.rgb},0.1)`, border: `1px solid rgba(${item.rgb},0.25)` }}>
                Chi tiết →
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} className="w-full py-2 rounded-xl text-lg font-bold text-white transition-all" style={{ background: saved ? '#22c55e' : COLOR }}>
        {saved ? '✓ Đã lưu!' : 'Lưu Kết Quả Test'}
      </button>
      <Link to="/pillar/f/progress-test" className="block text-center text-base" style={{ color: COLOR }}>Xem bảng so sánh 4 tuần →</Link>
      {testModal !== null && (
        <TestModal
          idx={testModal}
          onClose={() => setTestModal(null)}
          onPrev={() => setTestModal(i => Math.max(0, i - 1))}
          onNext={() => setTestModal(i => Math.min(TEST_ITEMS.length - 1, i + 1))}
          hasPrev={testModal > 0}
          hasNext={testModal < TEST_ITEMS.length - 1}
        />
      )}
    </div>
  );
}

// --- QuickWoModal ---
function QuickWoModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const wo = QUICK_WO[idx];
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

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${wo.rgb},0.28)`, boxShadow: `0 0 80px rgba(${wo.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={wo.img} alt={wo.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${wo.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${wo.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${wo.rgb},0.18)`, border: `2px solid rgba(${wo.rgb},0.45)` }}>{wo.icon}</div>
          <div className="absolute bottom-5 left-24">
            <span className="font-black text-2xl" style={{ color: wo.color }}>{wo.dur}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: wo.color }}>{wo.icon} {wo.label}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: wo.color, background: `rgba(${wo.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{wo.keyFact}</p>
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `rgba(${wo.rgb},0.7)` }}>Các bước thực hiện</h3>
          <ol className="space-y-2 mb-8">
            {wo.steps.map((s, j) => (
              <li key={j} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${wo.rgb},0.14)`, color: wo.color }}>{j + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{s}</span>
              </li>
            ))}
          </ol>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: `rgba(${wo.rgb},0.7)` }}>Chi tiết khoa học</h3>
          <ul className="space-y-3 mb-8">
            {wo.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${wo.rgb},0.14)`, color: wo.color }}>{di + 1}</span>
                <span style={{ color: 'rgba(209,213,219,0.85)' }}>{d}</span>
              </li>
            ))}
          </ul>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: `rgba(${wo.rgb},0.4)`, background: `rgba(${wo.rgb},0.04)` }}>
            <p className="text-sm italic" style={{ color: `rgba(${wo.rgb},0.85)` }}>{wo.note}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {wo.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${wo.rgb},0.06)`, border: `1px solid rgba(${wo.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? wo.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${wo.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${wo.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {QUICK_WO.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? wo.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${wo.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${wo.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- F7 Quick Workouts tab ---
function F7QuickWorkouts() {
  const [open, setOpen] = useState(0);
  const [woModal, setWoModal] = useState(null);

  return (
    <div className="space-y-3">
      <p className="text-lg text-muted">Nguyên tắc: Có 5 phút vẫn làm được. Không bỏ hẳn — chỉ cần chọn bản ngắn hơn.</p>
      {QUICK_WO.map((wo, i) => (
        <div key={i} className="rounded-2xl border bg-surface overflow-hidden transition-colors duration-200"
          style={{ borderColor: woModal === i ? `rgba(${wo.rgb},0.45)` : 'var(--border)' }}>
          <div className="flex items-center gap-3 p-4">
            <button onClick={() => setWoModal(i)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-200 hover:scale-110"
              style={{ background: `rgba(${wo.rgb},0.12)`, border: `1px solid rgba(${wo.rgb},0.25)` }}>
              {wo.icon}
            </button>
            <button onClick={() => setOpen(open === i ? -1 : i)} className="flex-1 flex items-center gap-3 text-left">
              <span className="font-black text-lg w-16 shrink-0" style={{ color: wo.color }}>{wo.dur}</span>
              <span className="font-bold text-lg text-text flex-1">{wo.label}</span>
              <span className="text-muted mr-1">{open === i ? '▲' : '▼'}</span>
            </button>
            <button onClick={() => setWoModal(i)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all duration-200 hover:opacity-80 shrink-0"
              style={{ color: wo.color, background: `rgba(${wo.rgb},0.1)`, border: `1px solid rgba(${wo.rgb},0.25)` }}>
              Chi tiết →
            </button>
          </div>
          {open === i && (
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
              <ol className="space-y-1">
                {wo.steps.map((s, j) => (
                  <li key={j} className="flex gap-2 text-lg text-muted">
                    <span style={{ color: wo.color }} className="shrink-0 font-bold">{j + 1}.</span>{s}
                  </li>
                ))}
              </ol>
              <p className="text-base text-muted border-l-2 pl-2 mt-2" style={{ borderColor: wo.color }}>{wo.note}</p>
            </div>
          )}
        </div>
      ))}
      <Link to="/pillar/f/quick-workouts" className="block text-center text-base py-2" style={{ color: COLOR }}>Xem đầy đủ thư viện bài nhanh →</Link>
      {woModal !== null && (
        <QuickWoModal
          idx={woModal}
          onClose={() => setWoModal(null)}
          onPrev={() => setWoModal(i => Math.max(0, i - 1))}
          onNext={() => setWoModal(i => Math.min(QUICK_WO.length - 1, i + 1))}
          hasPrev={woModal > 0}
          hasNext={woModal < QUICK_WO.length - 1}
        />
      )}
    </div>
  );
}

// --- Main component ---
export default function PillarF() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarF', { returnObjects: true });
  const [tab, setTab] = useState('f0');
  const tabBarRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'pf-orbit-kf';
    style.textContent = ORBIT_CSS;
    document.head.appendChild(style);
    return () => document.getElementById('pf-orbit-kf')?.remove();
  }, []);

  const tabContent = { f0: <F0Dashboard />, f1: <F1Checklist />, f2: <F2WorkoutLog />, f3: <F3MealPlan />, f4: <F4Lifestyle />, f5: <F5MindTracker />, f6: <F6Test />, f7: <F7QuickWorkouts /> };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pb-24">
      <Link to="/pillars" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Sống Khỏe 360</Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🛠️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
            {pillar?.title || 'Công Cụ & Tài Nguyên'}
          </h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {pillar?.subtitle || 'Tools & Resources'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{pillar?.description || 'Biến mọi kiến thức A–E thành hành động cụ thể mỗi ngày.'}</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        {HERO_STATS.map((s, i) => (
          <div key={i} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={`hero-f-${i}`} color={COLOR} />
            </div>
            <div className="rounded-2xl border px-4 py-3 cursor-default" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
              <div className="text-3xl font-black" style={{ color: COLOR }}>{s.v}</div>
              <div className="text-base text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Image */}
      <div className="pf-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Công cụ sống khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {pillar?.image_caption || 'Tools & Resources'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Sticky Tab Bar */}
      <div ref={tabBarRef} className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 pt-3 mb-8"
        style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(14px)' }}>
        <div className="relative flex items-end overflow-x-auto scrollbar-hide"
          style={{ borderBottom: '1.5px solid rgba(255,255,255,0.09)' }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 shrink-0 font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                style={active ? {
                  color: COLOR,
                  padding: '9px 16px 11px',
                  background: '#111213',
                  borderTop: `2px solid ${COLOR}`,
                  borderLeft: '1px solid rgba(255,255,255,0.09)',
                  borderRight: '1px solid rgba(255,255,255,0.09)',
                  borderBottom: '1.5px solid #111213',
                  borderRadius: '8px 8px 0 0',
                  marginBottom: '-1.5px',
                  boxShadow: `0 -4px 16px rgba(${RGB},0.14)`,
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

      {/* Tab Content */}
      <RevealBlock key={tab} delay={0} className="mb-14">
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `rgba(${RGB},0.15)`, animation: `pb-frame-f0 4s ease-in-out infinite` }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">{TABS.find(t => t.id === tab)?.icon}</span>
            <h2 className="text-xl font-bold text-text">{TABS.find(t => t.id === tab)?.label}</h2>
          </div>
          {tabContent[tab]}
        </div>
      </RevealBlock>

      {/* Sub-page Teaser Grid */}
      <RevealBlock delay={1} className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">Công Cụ & Tài Nguyên Chi Tiết</h2>
        <p className="text-muted text-lg mb-10">11 chuyên đề chuyên sâu để bạn xây hệ thống sống khỏe hoàn chỉnh.</p>
        {TEASER_SECTIONS.map((sec, i) => (
          <TeaserSection key={i} title={sec.title}>
            {sec.cards.map((card, j) => (
              <RevealBlock key={j} delay={j + 1}>
                <TeaserCard {...card} />
              </RevealBlock>
            ))}
          </TeaserSection>
        ))}
      </RevealBlock>

      {/* Bottom disclaimer */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />
      <p className="text-base text-muted text-center">Mọi dữ liệu được lưu cục bộ trong thiết bị của bạn, không gửi lên server. Công cụ không thay thế tư vấn y tế chuyên nghiệp.</p>
    </div>
  );
}
