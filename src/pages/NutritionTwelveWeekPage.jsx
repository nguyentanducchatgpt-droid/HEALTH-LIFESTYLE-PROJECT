import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEAL = '#14b8a6';

const HERO_STATS = [
  { n: '12', label: 'Tuần', tip: '12 tuần lộ trình dinh dưỡng toàn diện từ nền tảng đến tốt nghiệp' },
  { n: '6',  label: 'Giai đoạn', tip: '6 phase học dần từng lớp kỹ năng ăn uống bền vững' },
  { n: '100', label: 'Điểm/ngày', tip: 'Hệ thống 100 điểm đánh giá chất lượng dinh dưỡng hàng ngày' },
  { n: '90', label: 'Ngày tiếp theo', tip: 'Kế hoạch 90 ngày cá nhân hoá sau khi tốt nghiệp chương trình' },
];

const PHASES = [
  { id: 1, weeks: '1–2', label: 'Nền Tảng',     color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.35)', emoji: '📋' },
  { id: 2, weeks: '3–4', label: 'Đĩa Ăn',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',  emoji: '🍽️' },
  { id: 3, weeks: '5–6', label: 'Năng Lượng',   color: '#84cc16', bg: 'rgba(132,204,22,0.12)',  border: 'rgba(132,204,22,0.35)', emoji: '⚡' },
  { id: 4, weeks: '7–8', label: 'Cá Nhân Hóa',  color: '#eab308', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.35)',  emoji: '🎯' },
  { id: 5, weeks: '9',   label: 'Phục Hồi',     color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)', emoji: '🛠️' },
  { id: 6, weeks: '10–12', label: 'Tốt Nghiệp', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', emoji: '🎓' },
];

const WEEKS = [
  {
    n: 1, phase: 1, emoji: '📝', color: '#14b8a6', rgb: '20,184,166',
    title: 'Biết mình đang ăn gì',
    tagline: '"Không ghi lại thì không sửa được."',
    goal: 'Ghi nhận hiện trạng: ăn mấy bữa, uống bao nhiêu nước, bữa nào thiếu đạm, khi nào ăn do stress.',
    tasks: [
      { task: 'Ghi 3 bữa chính', req: 'Không cần tính kcal, chỉ ghi món ăn' },
      { task: 'Chụp ảnh bữa ăn', req: '1–3 ảnh/ngày' },
      { task: 'Ghi nước uống', req: 'Số ly hoặc số lít' },
      { task: 'Ghi mức đói', req: 'Trước ăn: đói 1–10 điểm' },
      { task: 'Ghi năng lượng', req: 'Sáng/chiều/tối: thấp, vừa, tốt' },
    ],
    rules: ['Không phán xét bữa ăn', 'Không tự trách', 'Không cắt tinh bột vội', 'Chỉ cần nhìn rõ thói quen'],
    kpi: ['Ghi được ít nhất 5/7 ngày', 'Biết 3 lỗi lớn nhất: thiếu đạm, ít rau, uống ít nước, ăn vặt nhiều, ăn tối quá muộn, ăn do stress'],
    content: ['Video: "Vì sao bạn ăn ít mà vẫn không giảm?"', 'Video: "Chụp ảnh bữa ăn 7 ngày"', 'Checklist: Nhật ký ăn uống 7 ngày'],
  },
  {
    n: 2, phase: 1, emoji: '💧', color: '#14b8a6', rgb: '20,184,166',
    title: 'Protein + Nước',
    tagline: '"Đủ đạm giúp no lâu, giữ cơ, giảm thèm ăn."',
    goal: 'Mỗi bữa có nguồn đạm và uống đủ nước — 2 việc dễ tạo kết quả nhất.',
    tasks: [
      { task: 'Mỗi bữa chính có 1 nguồn đạm', req: '1 lòng bàn tay/bữa' },
      { task: 'Uống 1 ly nước sau thức dậy', req: 'Trước khi làm gì khác' },
      { task: 'Uống 1 ly nước trước mỗi bữa', req: '15–20 phút trước' },
      { task: 'Chuẩn bị sẵn 2 món đạm nhanh', req: 'Trong tủ lạnh' },
    ],
    rules: ['1 lòng bàn tay đạm/bữa chính', 'Ít nhất 1–2 nắm tay rau/ngày', '1.8–2.5 lít nước/ngày', 'Đồ ngọt ăn sau bữa chính'],
    proteins: [
      { group: 'Đạm động vật', items: 'Trứng, cá, thịt gà, thịt nạc, sữa chua Hy Lạp' },
      { group: 'Đạm thực vật', items: 'Đậu hũ, đậu nành, đậu lăng, hạt' },
      { group: 'Nhanh gọn', items: 'Trứng luộc, sữa chua không đường, whey nếu phù hợp' },
    ],
    kpi: ['5/7 ngày có đủ đạm ở ít nhất 2 bữa chính', '5/7 ngày uống đủ nước mục tiêu cá nhân', 'Giảm số lần ăn vặt do đói giả'],
  },
  {
    n: 3, phase: 2, emoji: '🍽️', color: '#22c55e', rgb: '34,197,94',
    title: 'Xây Đĩa Ăn Dự Án',
    tagline: '"Nhìn là hiểu, làm là được."',
    goal: 'Ăn lành mạnh mà không cần cân đo. ½ rau — ¼ đạm — ¼ tinh bột + chất béo nhỏ.',
    plate: [
      { part: '½ đĩa', label: 'Rau/canh/đồ luộc', color: '#22c55e' },
      { part: '¼ đĩa', label: 'Đạm', color: '#14b8a6' },
      { part: '¼ đĩa', label: 'Tinh bột', color: '#f59e0b' },
      { part: 'Nhỏ', label: 'Chất béo tốt', color: '#ec4899' },
    ],
    examples: [
      { meal: 'Cơm nhà', fix: 'Giữ cơm 1/4 đĩa, tăng rau, thêm thịt/cá/trứng' },
      { meal: 'Phở/bún', fix: 'Thêm thịt, thêm rau, hạn chế nước béo nếu giảm mỡ' },
      { meal: 'Cơm văn phòng', fix: 'Chọn 1 món đạm + 2 phần rau + cơm vừa' },
      { meal: 'Bánh mì', fix: 'Thêm trứng/thịt, giảm sốt ngọt, thêm rau' },
      { meal: 'Ăn ngoài', fix: 'Ưu tiên món có đạm rõ, rau rõ, tinh bột vừa' },
    ],
    tasks: ['Mỗi ngày chỉnh ít nhất 1 bữa theo đĩa ăn dự án', 'Chụp ảnh trước/sau khi chỉnh bữa ăn', 'Không cần ăn "sạch 100%", chỉ cần đúng cấu trúc hơn'],
    kpi: ['5/7 ngày có ít nhất 1 bữa đạt chuẩn đĩa ăn dự án', 'Tự nhìn được bữa nào thiếu đạm, thiếu rau, thừa tinh bột'],
  },
  {
    n: 4, phase: 2, emoji: '⏰', color: '#22c55e', rgb: '34,197,94',
    title: 'Ăn Đúng Giờ · Ăn Chậm',
    tagline: '"Không phải cứ thèm là thiếu kỷ luật. Nhiều khi là thiếu bữa chính."',
    goal: 'Ổn định nhịp ăn để giảm ăn vặt, giảm thèm ngọt và hạn chế bữa "vỡ trận".',
    situations: [
      { case: 'Hay thèm ngọt buổi chiều', fix: 'Bữa trưa cần đủ đạm + rau + tinh bột tốt' },
      { case: 'Hay ăn đêm', fix: 'Kiểm tra bữa tối có quá ít không' },
      { case: 'Hay uống trà sữa/nước ngọt', fix: 'Chuyển dần sang size nhỏ, ít đường, không topping' },
      { case: 'Ăn quá nhanh', fix: 'Đặt đũa xuống 2–3 lần trong bữa' },
      { case: 'Lỡ ăn nhiều', fix: 'Bữa sau quay lại bình thường, không nhịn cực đoan' },
    ],
    tasks: ['Ăn chậm hơn: mỗi bữa ít nhất 15 phút nếu có thể', 'Đồ ngọt chỉ ăn sau bữa chính, không ăn lúc quá đói', 'Thử 3 món snack tốt: trái cây + sữa chua, trứng luộc, hạt + trái cây'],
    kpi: ['Giảm ít nhất 20–30% số lần ăn vặt không kiểm soát', 'Có danh sách 5 món snack lành mạnh cá nhân thích'],
  },
  {
    n: 5, phase: 3, emoji: '🔢', color: '#84cc16', rgb: '132,204,22',
    title: 'Hiểu Kcal & TDEE',
    tagline: '"Ăn healthy vẫn có thể không giảm cân nếu tổng năng lượng quá cao."',
    goal: 'Giới thiệu BMR, TDEE, thâm hụt, duy trì, thặng dư ở mức dễ hiểu.',
    formula: [
      { goal: 'Giảm mỡ', rule: 'TDEE − 300 đến 500 kcal/ngày' },
      { goal: 'Duy trì/sống khỏe', rule: 'Gần TDEE' },
      { goal: 'Tăng cơ', rule: 'TDEE + 150 đến 300 kcal/ngày' },
      { goal: 'Tập sức bền nhiều', rule: 'Linh hoạt theo ngày tập, tăng carb ngày nặng' },
    ],
    tasks: ['Tính TDEE ước lượng', 'Chọn mục tiêu chính: giảm mỡ, tăng cơ, sức bền, sống khỏe', 'Chọn mức kcal khởi đầu, không quá cực đoan', 'Theo dõi cân nặng trung bình 3 buổi sáng/tuần'],
    kpi: ['Biết mức kcal ước lượng của mình', 'Hiểu vì sao cân dao động do nước, muối, chu kỳ, tập luyện, giấc ngủ'],
  },
  {
    n: 6, phase: 3, emoji: '🥡', color: '#84cc16', rgb: '132,204,22',
    title: 'Meal Prep 2 Lần/Tuần',
    tagline: '"Meal prep không phải ăn ức gà cả tuần. Meal prep là chuẩn bị lựa chọn tốt trước khi đói."',
    goal: 'Biến dinh dưỡng thành hệ thống dễ làm. Người bận thất bại vì đói + không có món sẵn.',
    schedule: [
      { time: 'Chủ nhật', tasks: 'Chuẩn bị 2–3 nguồn đạm, 2 loại rau, 1–2 nguồn tinh bột' },
      { time: 'Thứ tư', tasks: 'Bổ sung món tươi, đổi vị, chuẩn bị snack' },
      { time: 'Mỗi tối', tasks: 'Chuẩn bị bữa sáng hoặc hộp trưa hôm sau' },
    ],
    boxes: [
      { comp: 'Đạm', ex: 'Gà áp chảo, cá, trứng, bò nạc, đậu hũ' },
      { comp: 'Tinh bột', ex: 'Cơm, khoai, bún, mì nguyên cám, yến mạch' },
      { comp: 'Rau', ex: 'Rau luộc, salad, dưa leo, cà chua, canh' },
      { comp: 'Sốt', ex: 'Nước mắm chanh ít đường, sữa chua, sốt mè lượng nhỏ' },
    ],
    tasks: ['Tạo 3 combo bữa sáng', 'Tạo 3 combo bữa trưa', 'Tạo 3 combo bữa tối', 'Tạo danh sách đi chợ cố định'],
    kpi: ['Có ít nhất 2 buổi meal prep', '5/7 ngày không phải "ăn đại vì quá đói"', 'Có 6–9 món tủ để xoay vòng'],
  },
  {
    n: 7, phase: 4, emoji: '🔥', color: '#eab308', rgb: '234,179,8',
    title: 'Giảm Mỡ Bền Vững',
    tagline: '"Không cắt tinh bột cực đoan, không nhịn ăn quá mức."',
    goal: 'Giảm mỡ theo hướng bền vững: giữ protein cao, carb quanh tập, rau nhiều.',
    rules: [
      { comp: 'Kcal', rule: 'TDEE − 300 đến 500 kcal' },
      { comp: 'Protein', rule: 'Ưu tiên cao, mỗi bữa có đạm' },
      { comp: 'Carb', rule: 'Giảm vừa phải, ưu tiên quanh buổi tập' },
      { comp: 'Fat', rule: 'Không quá thấp' },
      { comp: 'Rau/xơ', rule: 'Tăng để no lâu' },
      { comp: 'Theo dõi', rule: 'Cân trung bình + vòng eo + ảnh' },
    ],
    meals: [
      { meal: 'Sáng', food: 'Trứng + sữa chua/yến mạch + trái cây' },
      { meal: 'Trưa', food: 'Cơm vừa + ức gà/cá/thịt nạc + nhiều rau' },
      { meal: 'Snack', food: 'Trái cây + sữa chua không đường' },
      { meal: 'Tối', food: 'Đạm + rau + khoai/cơm ít hơn trưa' },
    ],
    errors: ['Cắt cơm hoàn toàn rồi tối ăn bù', 'Ăn salad nhưng thiếu đạm', 'Uống nhiều calo từ trà sữa, nước ép, cà phê sữa', 'Cân mỗi ngày rồi hoảng vì dao động nước'],
    kpi: ['Vòng eo hoặc cân trung bình bắt đầu có xu hướng tốt', 'Vẫn đủ năng lượng tập', 'Không có cảm giác "ăn kiêng hành xác"'],
  },
  {
    n: 8, phase: 4, emoji: '💪', color: '#eab308', rgb: '234,179,8',
    title: 'Tăng Cơ & Sức Bền',
    tagline: '"Không sợ carb — carb là nhiên liệu cho tập luyện."',
    goal: 'Dạy ăn để tập tốt hơn. Tăng kcal ngày tập nặng, giữ protein ổn định.',
    muscleRules: [
      { comp: 'Kcal', rule: 'TDEE + 150 đến 300 kcal' },
      { comp: 'Protein', rule: '1.6–2.2 g/kg/ngày tùy người' },
      { comp: 'Carb', rule: 'Đủ để tập nặng' },
      { comp: 'Theo dõi', rule: 'Tăng tạ/reps, cân tăng chậm, vòng eo không tăng quá nhanh' },
    ],
    endurance: [
      { time: 'Trước tập 60–90 phút', food: 'Carb dễ tiêu + ít đạm' },
      { time: 'Sau tập', food: 'Đạm + carb' },
      { time: 'Buổi tập dài', food: 'Nước + điện giải, thêm carb nếu >60–90 phút' },
      { time: 'Ngày tập nặng', food: 'Carb cao hơn ngày nghỉ' },
    ],
    preworkout: [
      { case: 'Trước tập nhẹ', food: 'Chuối hoặc bánh mì nhỏ' },
      { case: 'Trước tập nặng', food: 'Chuối + sữa chua/whey hoặc yến mạch' },
      { case: 'Sau tập', food: 'Cơm/khoai/yến mạch + thịt/cá/trứng/sữa' },
      { case: 'Tập dài ra mồ hôi', food: 'Nước + điện giải' },
    ],
    kpi: ['Tập khỏe hơn, ít hụt năng lượng', 'Biết tăng carb vào ngày nặng, giảm nhẹ vào ngày nghỉ', 'Không còn tư duy "carb là xấu"'],
  },
  {
    n: 9, phase: 5, emoji: '🛠️', color: '#f97316', rgb: '249,115,22',
    title: 'Phục Hồi & Sửa Lỗi',
    tagline: '"Ăn đúng không chỉ để giảm cân, mà để cơ thể phục hồi."',
    goal: 'Tuần "kiểm tra hệ thống": tiêu hóa, giấc ngủ, năng lượng, stress, cảm giác đói, bữa ăn ngoài.',
    checks: [
      { q: 'Có táo bón/đầy bụng không?', meaning: 'Kiểm tra chất xơ, nước, tốc độ ăn' },
      { q: 'Có mất ngủ không?', meaning: 'Kiểm tra caffeine, ăn tối, stress' },
      { q: 'Có thèm ngọt mạnh không?', meaning: 'Kiểm tra thiếu ngủ, thiếu đạm, thiếu kcal' },
      { q: 'Có tập tụt sức không?', meaning: 'Kiểm tra carb và tổng năng lượng' },
      { q: 'Có ăn ngoài quá nhiều không?', meaning: 'Cần quy tắc chọn món' },
    ],
    eatOut: [
      { place: 'Quán cơm', rule: '1 phần đạm rõ + nhiều rau + cơm vừa' },
      { place: 'Phở/bún', rule: 'Thêm thịt, thêm rau, không uống hết nước béo' },
      { place: 'Tiệc', rule: 'Ăn đạm trước, rau sau, tinh bột vừa, chọn món thích nhất thay vì ăn tất cả' },
      { place: 'Cà phê', rule: 'Ưu tiên ít đường, hạn chế topping' },
      { place: 'Buffet', rule: 'Đi 1 vòng nhìn trước, không lấy ngay' },
    ],
    kpi: ['Biết 3 lỗi lớn nhất của mình', 'Có bộ quy tắc ăn ngoài', 'Không "bỏ cuộc" sau một bữa ăn lỡ tay'],
  },
  {
    n: 10, phase: 6, emoji: '🎨', color: '#a855f7', rgb: '168,85,247',
    title: 'Menu Cá Nhân',
    tagline: '"Không dùng thực đơn mẫu một cách máy móc nữa."',
    goal: 'Tự thiết kế thực đơn theo công thức cá nhân hóa.',
    template: [
      { group: 'Bữa chính', count: '3 bữa' },
      { group: 'Snack', count: '0–2 bữa tùy nhu cầu' },
      { group: 'Đạm', count: 'Có ở mỗi bữa chính' },
      { group: 'Rau', count: 'Ít nhất 2 bữa/ngày' },
      { group: 'Carb', count: 'Điều chỉnh theo ngày tập/nghỉ' },
      { group: 'Nước', count: 'Theo mục tiêu cá nhân' },
      { group: 'Món yêu thích', count: 'Có kiểm soát, không cấm tuyệt đối' },
    ],
    exercises: ['3 bữa sáng cá nhân', '5 bữa trưa cá nhân', '5 bữa tối cá nhân', '5 snack cá nhân', '3 lựa chọn ăn ngoài', '1 thực đơn cuối tuần'],
    kpi: ['Có menu cá nhân 7 ngày', 'Có danh sách đi chợ', 'Có phương án khi bận, đi làm, đi chơi, ăn tiệc'],
  },
  {
    n: 11, phase: 6, emoji: '⚙️', color: '#a855f7', rgb: '168,85,247',
    title: 'Tự Động Hóa Môi Trường',
    tagline: '"Kỷ luật tốt nhất là bớt phải ra quyết định."',
    goal: 'Không chỉ dựa vào ý chí. Thiết kế môi trường để lựa chọn tốt trở nên dễ hơn.',
    environment: [
      { area: 'Tủ lạnh', action: 'Luôn có đạm nhanh, rau, trái cây' },
      { area: 'Bàn làm việc', action: 'Có nước, không để snack ngọt trong tầm tay' },
      { area: 'Đi chợ', action: 'Đi theo danh sách, không đi lúc quá đói' },
      { area: 'Lịch tuần', action: 'Chọn trước ngày meal prep' },
      { area: 'Ứng dụng/Notion', action: 'Ghi protein, nước, rau, cân nặng, vòng eo' },
    ],
    kpi: ['Có hệ thống theo dõi đơn giản', 'Ít phụ thuộc vào động lực', 'Biết chuẩn bị trước cho 3 tình huống khó: bận, stress, ăn ngoài'],
  },
  {
    n: 12, phase: 6, emoji: '🎓', color: '#a855f7', rgb: '168,85,247',
    title: 'Test & Tốt Nghiệp',
    tagline: '"Graduation — không chỉ nhìn cân nặng."',
    goal: 'Đánh giá kết quả thật sự. Lập kế hoạch 90 ngày tiếp theo.',
    metrics: [
      { group: 'Cơ thể', items: 'Cân nặng trung bình, vòng eo, ảnh trước/sau' },
      { group: 'Thói quen', items: 'Số ngày đủ protein, đủ nước, đủ rau' },
      { group: 'Hiệu suất', items: 'Tập khỏe hơn không, ít mệt hơn không' },
      { group: 'Tiêu hóa', items: 'Đầy bụng, táo bón, cảm giác nhẹ bụng' },
      { group: 'Tinh thần', items: 'Ít guilt sau khi ăn, tự tin chọn món' },
      { group: 'Bền vững', items: 'Có thể duy trì thêm 3 tháng không' },
    ],
    questions: [
      'Bữa nào mình làm tốt nhất?',
      'Bữa nào dễ vỡ nhất?',
      'Món lành mạnh nào mình thật sự thích?',
      'Mình hợp ăn 3 bữa hay 3 bữa + snack?',
      'Mục tiêu 90 ngày tới là gì?',
      'Mình cần chỉnh kcal, protein, carb hay lịch meal prep?',
    ],
    next90: [
      { goal: 'Giảm mỡ tiếp', plan: 'Giữ thâm hụt nhẹ, không siết thêm nếu quá mệt' },
      { goal: 'Tăng cơ', plan: 'Tăng kcal nhẹ, ưu tiên strength và protein' },
      { goal: 'Sức bền', plan: 'Tăng carb quanh buổi tập, chú ý điện giải' },
      { goal: 'Duy trì', plan: 'Ăn linh hoạt 80/20, giữ tracking tối thiểu' },
      { goal: 'Sống khỏe', plan: 'Giữ đĩa ăn dự án + nước + rau + protein' },
    ],
    kpi: ['Tự xây được thực đơn 7 ngày', 'Biết chỉnh khẩu phần theo mục tiêu', 'Biết xử lý ăn ngoài, cuối tuần, bữa lỡ tay', 'Có kế hoạch 90 ngày tiếp theo'],
  },
];

const WEEK_THEMES = [
  'Nhật Ký', 'Đạm & Nước', 'Đĩa Ăn', 'Nhịp Ăn',
  'Kcal', 'Meal Prep', 'Giảm Mỡ', 'Tăng Cơ',
  'Phục Hồi', 'Menu', 'Môi Trường', 'Tốt Nghiệp',
];

const SCORE_CRITERIA = [
  { id: 'protein',     label: 'Đủ protein',                desc: 'Mỗi bữa chính có nguồn đạm',                       pts: 25, icon: '🥩' },
  { id: 'veggie',      label: 'Đủ rau/chất xơ',            desc: 'Có rau ở ít nhất 2 bữa/ngày',                      pts: 20, icon: '🥦' },
  { id: 'water',       label: 'Đủ nước',                   desc: '1.8–2.5 lít/ngày tùy người',                       pts: 15, icon: '💧' },
  { id: 'carb',        label: 'Carb phù hợp',              desc: 'Điều chỉnh theo ngày tập/nghỉ',                    pts: 15, icon: '🌾' },
  { id: 'noLiquidCal', label: 'Không uống calo quá mức',   desc: 'Hạn chế trà sữa, nước ngọt, cà phê sữa',           pts: 10, icon: '🚫' },
  { id: 'slow',        label: 'Ăn chậm/đúng nhịp',         desc: 'Ít nhất 15 phút/bữa, đúng giờ',                   pts: 10, icon: '⏱️' },
  { id: 'recovery',    label: 'Xử lý tốt bữa lỡ tay',      desc: 'Không bù nhịn, không guilt trip',                  pts: 5,  icon: '🔄' },
];

// ─── RevealBlock ──────────────────────────────────────────────────────────────

function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── computeB0 ────────────────────────────────────────────────────────────────

function computeB0() {
  const defaults = { w: 70, h: 170, age: 30, sx: 'male', goal: 'maintain', a: 'moderate' };
  let inputs = defaults;
  try {
    const raw = localStorage.getItem('healthapp_b0_inputs');
    if (raw) inputs = { ...defaults, ...JSON.parse(raw) };
  } catch { /* ignore */ }

  const { w, h, age, sx, goal, a } = inputs;
  const bmr = sx === 'female'
    ? 10 * w + 6.25 * h - 5 * age - 161
    : 10 * w + 6.25 * h - 5 * age + 5;

  const actMap = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const mult = actMap[a] || 1.55;
  const tdee = Math.round(bmr * mult);

  let kcalTarget = tdee;
  if (goal === 'lose')   kcalTarget = tdee - 400;
  if (goal === 'gain')   kcalTarget = tdee + 200;

  const protein = Math.round(w * 1.9);

  return { tdee, kcalTarget, protein, w, h, age, sx, goal };
}

// ─── Score helpers ────────────────────────────────────────────────────────────

function getTier(score) {
  if (score >= 85) return { label: 'Nutrition Master', color: '#14b8a6' };
  if (score >= 70) return { label: 'Đúng hướng',       color: '#84cc16' };
  if (score >= 50) return { label: 'Đang xây nền',     color: '#f97316' };
  return                  { label: 'Khởi động',         color: '#ef4444' };
}

// ─── SVG Arc Gauge ────────────────────────────────────────────────────────────

function ScoreGauge({ score, color }) {
  const R = 54;
  const CIRC = 2 * Math.PI * R; // ~339.3
  const offset = CIRC * (1 - score / 100);
  const pulse = score >= 85;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" style={{ overflow: 'visible' }}>
      {pulse && (
        <circle cx="70" cy="70" r="62" fill="none" stroke={color} strokeWidth="1"
          style={{ opacity: 0.15, animation: 'pulseGlow 2s ease-in-out infinite' }} />
      )}
      <circle cx="70" cy="70" r={R} fill="none" stroke="#1f2937" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={R} fill="none"
        stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px', transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="70" y="66" textAnchor="middle" fill={color} fontSize="28" fontWeight="800">{score}</text>
      <text x="70" y="84" textAnchor="middle" fill="#6b7280" fontSize="11">điểm</text>
    </svg>
  );
}

// ─── Week Detail Panel ────────────────────────────────────────────────────────

function WeekDetail({ week }) {
  if (!week) return null;
  const c = week.color;
  return (
    <div
      key={week.n}
      className="mt-4 rounded-2xl p-5 border transition-all duration-500"
      style={{ borderColor: `rgba(${week.rgb},0.3)`, background: `rgba(${week.rgb},0.05)` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-3xl shrink-0">{week.emoji}</div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: c }}>
            Tuần {week.n} · Phase {week.phase}
          </div>
          <h3 className="text-xl font-bold text-text leading-tight">{week.title}</h3>
          <p className="text-muted text-sm mt-1 italic">{week.tagline}</p>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-4 p-3 rounded-xl border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
        <span className="font-semibold" style={{ color: c }}>Mục tiêu: </span>{week.goal}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Tasks */}
        {week.tasks && Array.isArray(week.tasks) && week.tasks.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Nhiệm vụ</div>
            <div className="space-y-2">
              {week.tasks.map((t, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-bg" style={{ background: c }}>{i + 1}</span>
                  <div>
                    <div className="text-text text-sm font-medium">{typeof t === 'string' ? t : t.task}</div>
                    {typeof t === 'object' && t.req && <div className="text-muted text-xs">{t.req}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPI */}
        {week.kpi && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>KPI Tuần Này</div>
            <div className="space-y-2">
              {week.kpi.map((k, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c }} />
                  <span className="text-muted text-sm">{k}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rules / proteins / plate / etc. */}
      {week.rules && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Nguyên tắc</div>
          <div className="flex flex-wrap gap-2">
            {week.rules.map((r, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ color: c, borderColor: `rgba(${week.rgb},0.3)`, background: `rgba(${week.rgb},0.08)` }}>{r}</span>
            ))}
          </div>
        </div>
      )}

      {week.proteins && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Nguồn Đạm</div>
          <div className="space-y-1.5">
            {week.proteins.map((p, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold shrink-0" style={{ color: c }}>{p.group}:</span>
                <span className="text-muted">{p.items}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.plate && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Cấu Trúc Đĩa</div>
          <div className="grid grid-cols-2 gap-2">
            {week.plate.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg border text-sm" style={{ borderColor: `${p.color}40`, background: `${p.color}10` }}>
                <span className="font-bold" style={{ color: p.color }}>{p.part}</span>
                <span className="text-muted">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.examples && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Ví Dụ Thực Tế</div>
          <div className="space-y-1.5">
            {week.examples.map((e, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold shrink-0" style={{ color: c }}>{e.meal}:</span>
                <span className="text-muted">{e.fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.formula && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Công Thức Mục Tiêu</div>
          <div className="space-y-1.5">
            {week.formula.map((f, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold shrink-0" style={{ color: c }}>{f.goal}:</span>
                <span className="text-muted">{f.rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.situations && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Xử Lý Tình Huống</div>
          <div className="space-y-2">
            {week.situations.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold shrink-0" style={{ color: c }}>→</span>
                <span className="text-text font-medium">{s.case}:</span>
                <span className="text-muted">{s.fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.schedule && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Lịch Meal Prep</div>
          <div className="space-y-2">
            {week.schedule.map((s, i) => (
              <div key={i} className="flex gap-3 text-sm p-2 rounded-lg border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <span className="font-bold shrink-0" style={{ color: c }}>{s.time}</span>
                <span className="text-muted">{s.tasks}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.rules && week.rules.length === 0 && week.meals && (
        <div className="mt-4" />
      )}
      {week.meals && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Thực Đơn Mẫu</div>
          <div className="grid grid-cols-2 gap-2">
            {week.meals.map((m, i) => (
              <div key={i} className="p-2 rounded-lg border text-sm" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <div className="font-bold mb-0.5" style={{ color: c }}>{m.meal}</div>
                <div className="text-muted text-xs">{m.food}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.errors && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2 text-red-400">Lỗi Hay Gặp</div>
          <div className="space-y-1">
            {week.errors.map((e, i) => (
              <div key={i} className="flex gap-2 text-sm text-muted">
                <span className="text-red-400 shrink-0">✕</span>{e}
              </div>
            ))}
          </div>
        </div>
      )}

      {week.checks && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Kiểm Tra Hệ Thống</div>
          <div className="space-y-2">
            {week.checks.map((ch, i) => (
              <div key={i} className="text-sm p-2 rounded-lg border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <div className="text-text font-medium">{ch.q}</div>
                <div className="text-muted text-xs mt-0.5">→ {ch.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.template && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Công Thức Menu</div>
          <div className="grid grid-cols-2 gap-2">
            {week.template.map((t, i) => (
              <div key={i} className="flex gap-2 text-sm p-2 rounded-lg border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <span className="font-semibold shrink-0" style={{ color: c }}>{t.group}:</span>
                <span className="text-muted">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.environment && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Thiết Kế Môi Trường</div>
          <div className="space-y-2">
            {week.environment.map((e, i) => (
              <div key={i} className="flex gap-3 text-sm p-2 rounded-lg border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <span className="font-bold shrink-0" style={{ color: c }}>{e.area}</span>
                <span className="text-muted">{e.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.metrics && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Đánh Giá Tốt Nghiệp</div>
          <div className="grid md:grid-cols-2 gap-2">
            {week.metrics.map((m, i) => (
              <div key={i} className="text-sm p-2 rounded-lg border" style={{ borderColor: `rgba(${week.rgb},0.2)`, background: `rgba(${week.rgb},0.04)` }}>
                <div className="font-semibold" style={{ color: c }}>{m.group}</div>
                <div className="text-muted text-xs mt-0.5">{m.items}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {week.questions && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Câu Hỏi Tự Đánh Giá</div>
          <div className="space-y-1.5">
            {week.questions.map((q, i) => (
              <div key={i} className="flex gap-2 text-sm text-muted">
                <span style={{ color: c }}>{i + 1}.</span>{q}
              </div>
            ))}
          </div>
        </div>
      )}

      {week.content && (
        <div className="mt-4">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: c }}>Nội Dung Học</div>
          <div className="space-y-1">
            {week.content.map((ct, i) => (
              <div key={i} className="flex gap-2 text-sm text-muted">
                <span style={{ color: c }}>▶</span>{ct}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function NutritionTwelveWeekPage() {
  // ── Orbit ring injection
  useEffect(() => {
    if (document.getElementById('tw-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 'tw-orbit-kf';
    s.textContent = `
      @property --tw-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes twOrbitSpin { to { --tw-orbit-angle: 360deg; } }
      .tw-orbit-ring {
        background: conic-gradient(
          from var(--tw-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(20,184,166,0.0) 65deg, rgba(20,184,166,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(20,184,166,0.75) 99deg,
          rgba(20,184,166,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: twOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }, []);

  // ── Keyframe animations injection
  useEffect(() => {
    if (document.getElementById('tw12w-kf')) return;
    const s = document.createElement('style');
    s.id = 'tw12w-kf';
    s.textContent = `
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulseGlow { 0%,100%{opacity:0.10} 50%{opacity:0.30} }
      .animate-float { animation: float 3.5s ease-in-out infinite; }
      .animate-fade-in-up { animation: fadeInUp 0.6s ease both; }
    `;
    document.head.appendChild(s);
  }, []);

  // ── State
  const [b0] = useState(() => computeB0());
  const [activePhase, setActivePhase] = useState(1);
  const [activeWeek, setActiveWeek] = useState(null);
  const [scoreChecks, setScoreChecks] = useState({
    protein: false, veggie: false, water: false,
    carb: false, noLiquidCal: false, slow: false, recovery: false,
  });
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const weekGridRef = useRef(null);

  const score = SCORE_CRITERIA.reduce((sum, c) => sum + (scoreChecks[c.id] ? c.pts : 0), 0);
  const tier = getTier(score);

  const goalLabel = {
    lose: 'Giảm mỡ', gain: 'Tăng cơ', maintain: 'Duy trì', endurance: 'Sức bền'
  }[b0.goal] || 'Duy trì';

  function handlePhaseClick(phId) {
    setActivePhase(phId);
    setActiveWeek(null);
    if (weekGridRef.current) {
      weekGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleWeekClick(idx) {
    setActiveWeek(prev => prev === idx ? null : idx);
  }

  function toggleCheck(id) {
    setScoreChecks(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const phaseWeeks = WEEKS.filter(w => w.phase === activePhase);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <Link
        to="/pillar/b"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-teal-400 transition-colors mb-8"
      >
        ← Dinh Dưỡng
      </Link>

      {/* ── Hero Row ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl text-5xl bg-[#0d1117] border border-teal-500/20 shrink-0 animate-float flex items-center justify-center select-none">
          🗓️
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            Lộ trình Nutrition 12 Tuần
          </h1>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-400 mt-3 mb-4 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
            12 Weeks · 6 Phases · Nutrition Mastery
          </span>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            Chương trình 12 tuần dạy bạn ăn đúng một cách bền vững — từ ghi nhật ký đến xây dựng hệ thống dinh dưỡng cá nhân hoàn chỉnh, không cần ý chí cực đoan.
          </p>
        </div>
      </div>

      {/* ── Wide Image ───────────────────────────────────────────────────────── */}
      <div className="tw-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80&auto=format&fit=crop"
            alt="Nutrition planning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-teal-400 text-xs font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-teal-500/20 backdrop-blur-sm">
            12 Tuần · Dinh Dưỡng Thông Minh
          </span>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ── Section 0: Hero Stats ─────────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <div className="grid grid-cols-4 gap-3">
          {HERO_STATS.map((s, i) => (
            <div key={i} className="group/stat relative flex flex-col items-center">
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
                  opacity-0 group-hover/stat:opacity-100
                  scale-90 group-hover/stat:scale-100
                  -translate-y-1 group-hover/stat:translate-y-0
                  transition-all duration-200 origin-bottom"
              >
                <ThoughtBubble text={s.tip} idx={`hs-${i}`} color={TEAL} />
              </div>
              <div
                className="w-full rounded-2xl border p-4 text-center cursor-default transition-colors duration-200"
                style={{ borderColor: 'rgba(20,184,166,0.2)', background: 'rgba(20,184,166,0.05)' }}
              >
                <div className="text-3xl font-extrabold leading-none mb-1" style={{ color: TEAL }}>{s.n}</div>
                <div className="text-xs text-muted font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Section 1: Personalized Banner ───────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <div className="rounded-2xl border p-6" style={{ borderColor: 'rgba(20,184,166,0.25)', background: 'rgba(20,184,166,0.05)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">👤</span>
            <h2 className="text-base font-bold text-text">Kế Hoạch Của Bạn</h2>
            <span className="text-xs text-muted ml-auto italic">Dựa trên hồ sơ B0 của bạn</span>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-5">
            Kế hoạch dưới đây được tính riêng cho bạn dựa trên thông số BMR và TDEE đã nhập ở mục B0. Hãy dùng các con số này làm điểm khởi đầu — điều chỉnh linh hoạt theo phản hồi của cơ thể.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Kcal mục tiêu', val: `${b0.kcalTarget} kcal`, sub: goalLabel },
              { label: 'Protein/ngày',  val: `${b0.protein} g`,       sub: `${Math.round(b0.protein / b0.w * 10) / 10} g/kg` },
              { label: 'TDEE ước tính', val: `${b0.tdee} kcal`,       sub: 'Tổng năng lượng tiêu thụ' },
              { label: 'Tuần bắt đầu',  val: 'Tuần 1',                sub: 'Nền Tảng — Ghi nhật ký' },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border p-3 text-center" style={{ borderColor: 'rgba(20,184,166,0.2)', background: 'rgba(20,184,166,0.06)' }}>
                <div className="text-xl font-extrabold mb-0.5" style={{ color: TEAL }}>{item.val}</div>
                <div className="text-xs font-semibold text-text mb-0.5">{item.label}</div>
                <div className="text-[10px] text-muted">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── Section 2: Phase Timeline ─────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <h2 className="text-xl font-bold text-text mb-5">6 Giai Đoạn Học Tập</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {PHASES.map(ph => (
            <button
              key={ph.id}
              onClick={() => handlePhaseClick(ph.id)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200"
              style={{
                borderColor: activePhase === ph.id ? ph.color : `${ph.color}40`,
                background: activePhase === ph.id ? ph.bg : 'transparent',
                color: activePhase === ph.id ? ph.color : '#6b7280',
              }}
            >
              <span>{ph.emoji}</span>
              <span className="hidden md:inline">Phase {ph.id}:</span>
              <span>{ph.label}</span>
              <span className="text-xs opacity-70">{ph.weeks}</span>
            </button>
          ))}
        </div>

        {/* Active Phase Detail */}
        {(() => {
          const ph = PHASES.find(p => p.id === activePhase);
          return (
            <div className="rounded-2xl border p-5 transition-all duration-300" style={{ borderColor: ph.border, background: ph.bg }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{ph.emoji}</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: ph.color }}>
                    Phase {ph.id} · Tuần {ph.weeks}
                  </div>
                  <div className="text-lg font-bold text-text">{ph.label}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {WEEKS.filter(w => w.phase === activePhase).map(w => (
                  <span
                    key={w.n}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ color: ph.color, borderColor: `${ph.color}40`, background: `${ph.color}10` }}
                  >
                    {w.emoji} Tuần {w.n}: {w.title}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
      </RevealBlock>

      {/* ── Section 3: Week Navigator ─────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <h2 className="text-xl font-bold text-text mb-5">12 Tuần Chi Tiết</h2>
        <div ref={weekGridRef} className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
          {WEEKS.map((w, i) => {
            const isActive = activeWeek === i;
            const isPhaseActive = w.phase === activePhase;
            return (
              <button
                key={w.n}
                onClick={() => handleWeekClick(i)}
                className="relative rounded-2xl border p-3 text-left transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: isActive ? w.color : isPhaseActive ? `${w.color}50` : 'rgba(255,255,255,0.08)',
                  background: isActive ? `rgba(${w.rgb},0.15)` : isPhaseActive ? `rgba(${w.rgb},0.06)` : 'rgba(255,255,255,0.02)',
                  boxShadow: isActive ? `0 0 0 1px ${w.color}40` : 'none',
                }}
              >
                <div className="text-xl mb-1">{w.emoji}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: w.color }}>
                  Tuần {w.n}
                </div>
                <div className="text-xs text-text font-medium leading-tight">{WEEK_THEMES[i]}</div>
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: w.color }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Week Detail Panel */}
        {activeWeek !== null && (
          <WeekDetail key={activeWeek} week={WEEKS[activeWeek]} />
        )}
      </RevealBlock>

      {/* ── Section 4: Score Calculator ──────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <h2 className="text-xl font-bold text-text mb-2">Điểm Dinh Dưỡng Hôm Nay</h2>
        <p className="text-muted text-sm mb-6">Đánh dấu các mục bạn đã hoàn thành trong ngày. Mục tiêu: 75–85 điểm/tuần là tốt.</p>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Criteria list */}
          <div className="space-y-2">
            {SCORE_CRITERIA.map(c => (
              <button
                key={c.id}
                onClick={() => toggleCheck(c.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150"
                style={{
                  borderColor: scoreChecks[c.id] ? 'rgba(20,184,166,0.4)' : 'rgba(255,255,255,0.08)',
                  background: scoreChecks[c.id] ? 'rgba(20,184,166,0.1)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{
                    borderColor: scoreChecks[c.id] ? TEAL : 'rgba(255,255,255,0.2)',
                    background: scoreChecks[c.id] ? TEAL : 'transparent',
                  }}
                >
                  {scoreChecks[c.id] && <span className="text-bg text-[10px] font-bold">✓</span>}
                </div>
                <span className="text-lg shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text">{c.label}</div>
                  <div className="text-xs text-muted truncate">{c.desc}</div>
                </div>
                <div
                  className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-full"
                  style={{
                    color: scoreChecks[c.id] ? TEAL : '#6b7280',
                    background: scoreChecks[c.id] ? 'rgba(20,184,166,0.12)' : 'rgba(255,255,255,0.04)',
                  }}
                >
                  +{c.pts}
                </div>
              </button>
            ))}
          </div>

          {/* Gauge */}
          <div className="flex flex-col items-center p-6 rounded-2xl border" style={{ borderColor: `${tier.color}30`, background: `${tier.color}08` }}>
            <ScoreGauge score={score} color={tier.color} />
            <div className="mt-4 text-center">
              <div className="text-2xl font-extrabold mb-1" style={{ color: tier.color }}>{tier.label}</div>
              <div className="text-muted text-sm">Tổng: {score}/100 điểm</div>
            </div>
            <div className="mt-5 w-full space-y-2">
              {[
                { range: '0–49',   label: 'Khởi động',      color: '#ef4444' },
                { range: '50–69',  label: 'Đang xây nền',   color: '#f97316' },
                { range: '70–84',  label: 'Đúng hướng',     color: '#84cc16' },
                { range: '85–100', label: 'Nutrition Master', color: '#14b8a6' },
              ].map(t => (
                <div key={t.range} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: t.color }} />
                  <span style={{ color: t.color }} className="font-bold w-16">{t.range}</span>
                  <span className="text-muted">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* ── Section 5: Summary Table ──────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <h2 className="text-xl font-bold text-text mb-5">Tổng Quan 12 Tuần</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(20,184,166,0.2)' }}>
          <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-widest text-muted px-4 py-2.5 border-b" style={{ borderColor: 'rgba(20,184,166,0.15)', background: 'rgba(20,184,166,0.06)' }}>
            <span>Tuần</span><span>Chủ đề</span><span className="hidden md:block">Trọng tâm</span><span>Đầu ra</span>
          </div>
          {WEEKS.map((w, i) => {
            const isHov = hoveredRow === i;
            return (
              <div
                key={w.n}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => { handleWeekClick(i); weekGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="grid grid-cols-4 px-4 py-3 border-b cursor-pointer transition-all duration-150 items-center"
                style={{
                  borderColor: 'rgba(255,255,255,0.05)',
                  background: isHov ? `rgba(${w.rgb},0.08)` : 'transparent',
                }}
              >
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: w.color }}>
                  {w.emoji} {w.n}
                </span>
                <span className="text-text text-sm font-medium leading-tight pr-2">{w.title}</span>
                <span className="hidden md:block text-muted text-xs leading-relaxed pr-2">{w.goal?.slice(0, 60)}{w.goal?.length > 60 ? '…' : ''}</span>
                <span className="text-muted text-xs">{w.kpi?.[0]?.slice(0, 40)}{w.kpi?.[0]?.length > 40 ? '…' : ''}</span>
              </div>
            );
          })}
        </div>
      </RevealBlock>

      {/* ── Section 6: 90-Day Plan ────────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <h2 className="text-xl font-bold text-text mb-2">Kế Hoạch 90 Ngày Sau Tốt Nghiệp</h2>
        <p className="text-muted text-sm mb-6">Chọn hướng đi tiếp theo sau 12 tuần. Mở từng mục để xem kế hoạch chi tiết.</p>
        <div className="space-y-3">
          {WEEKS[11].next90.map((item, i) => {
            const isOpen = accordionOpen === i;
            const phColors = ['#14b8a6', '#22c55e', '#84cc16', '#eab308', '#a855f7'];
            const c = phColors[i] || TEAL;
            return (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden transition-all duration-200"
                style={{ borderColor: isOpen ? `${c}50` : 'rgba(255,255,255,0.08)' }}
              >
                <button
                  onClick={() => setAccordionOpen(prev => prev === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  style={{ background: isOpen ? `${c}0d` : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }} />
                    <span className="font-semibold text-text">{item.goal}</span>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 text-sm"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: c }}
                  >
                    ▾
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 border-t" style={{ borderColor: `${c}20` }}>
                    <p className="text-muted text-sm leading-relaxed mt-3">{item.plan}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </RevealBlock>

      {/* ── Section 7: Safety Note ────────────────────────────────────────────── */}
      <RevealBlock>
        <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(234,179,8,0.2)', background: 'rgba(234,179,8,0.04)' }}>
          <div className="flex gap-3 items-start">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <div className="text-sm font-bold text-yellow-400 mb-1">Lưu Ý Quan Trọng</div>
              <p className="text-muted text-sm leading-relaxed">
                Đây là hướng dẫn sức khỏe phổ thông, không thay thế điều trị y khoa. Người có bệnh thận, đái tháo đường, bệnh tim mạch, phụ nữ có thai cần tham khảo bác sĩ trước khi thay đổi chế độ dinh dưỡng.
              </p>
            </div>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
