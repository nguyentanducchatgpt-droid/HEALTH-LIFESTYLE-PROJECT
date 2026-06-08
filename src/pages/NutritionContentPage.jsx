import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── Constants ────────────────────────────────────────────────────────────────

const LIME = '#84cc16';
const LS_INPUTS = 'healthapp_b0_inputs';

const ACTIVITY_LEVELS = [
  { key: 'sedentary',  label: 'Ít vận động', sub: 'Ngồi nhiều, không tập',  mult: 1.2   },
  { key: 'light',      label: 'Nhẹ',         sub: '1–2 ngày/tuần',          mult: 1.375 },
  { key: 'moderate',   label: 'Vừa phải',    sub: '3–5 ngày/tuần',          mult: 1.55  },
  { key: 'active',     label: 'Năng động',   sub: '6–7 ngày/tuần',          mult: 1.725 },
  { key: 'veryactive', label: 'Rất năng động',sub: 'Tập 2 lần/ngày',        mult: 1.9   },
];

const GOAL_MODIFIERS = [
  { key: 'loss',   label: 'Giảm mỡ',    emoji: '🔥', multMin: 0.85, multMax: 0.90, delta: -400, proteinMult: 2.0, note: 'Thâm hụt 10–15% TDEE. Giảm 0.3–0.5 kg/tuần.' },
  { key: 'recomp', label: 'Tái tổ hợp', emoji: '⚖️', multMin: 1.0,  multMax: 1.0,  delta:    0, proteinMult: 1.8, note: 'Duy trì TDEE. Ưu tiên protein + tập luyện.' },
  { key: 'gain',   label: 'Tăng cơ',    emoji: '💪', multMin: 1.05, multMax: 1.10, delta:  300, proteinMult: 1.8, note: 'Thặng dư 5–10% TDEE. Tăng 0.1–0.2 kg/tuần.' },
  { key: 'endure', label: 'Sức bền',    emoji: '🏃', multMin: 1.0,  multMax: 1.15, delta:  200, proteinMult: 1.6, note: 'Ưu tiên carb cao ngày tập. Protein vừa phải.' },
];

const DAY_TYPES = [
  { key: 'heavy',   label: 'Ngày tập nặng',  mult: 1.07, emoji: '🏋️', carbMult: 1.4, color: '#22c55e' },
  { key: 'moderate',label: 'Ngày tập vừa',   mult: 1.00, emoji: '🚴', carbMult: 1.0, color: '#06b6d4' },
  { key: 'light',   label: 'Ngày tập nhẹ',   mult: 0.95, emoji: '🚶', carbMult: 0.85,color: '#f59e0b' },
  { key: 'rest',    label: 'Ngày nghỉ',       mult: 0.90, emoji: '😴', carbMult: 0.7, color: '#a855f7' },
];

const BMI_RANGES = [
  { min: 0,   max: 18.5, label: 'Thiếu cân',     color: '#06b6d4', note: 'Nên tăng cân dần, ưu tiên dinh dưỡng đủ chất' },
  { min: 18.5,max: 23,   label: 'Bình thường',   color: '#22c55e', note: 'Duy trì. Có thể tập tăng cơ hoặc sức bền' },
  { min: 23,  max: 25,   label: 'Hơi thừa cân',  color: '#84cc16', note: 'Nhẹ. Tập thể dục + điều chỉnh khẩu phần' },
  { min: 25,  max: 30,   label: 'Thừa cân',       color: '#f59e0b', note: 'Giảm mỡ từ từ. Không cần quá nghiêm ngặt' },
  { min: 30,  max: 999,  label: 'Béo phì',        color: '#ef4444', note: 'Nên tham khảo bác sĩ dinh dưỡng' },
];

// ─── Module B0–B7 structure ────────────────────────────────────────────────────

const MODULE_SECTIONS = [
  {
    id: 'B0', label: 'Nutrition Onboarding', emoji: '🚀', color: '#22c55e',
    goal: 'Giúp người tham gia biết mình đang ở đâu trước khi thay đổi. Không vội đưa thực đơn ngay mà đánh giá nền tảng trước.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'Tự đánh giá thói quen ăn uống', desc: 'Trả lời nhanh: bữa sáng có ăn không? Rau có vào bữa nào? Nước ngọt/trà sữa bao nhiêu ly/ngày?' },
      { title: 'Phân nhóm người tham gia', desc: 'Nhóm A: người mới hoàn toàn · Nhóm B: đã biết nhưng chưa ổn định · Nhóm C: người tập có mục tiêu · Nhóm D: người muốn tối ưu' },
      { title: 'Chỉ số đầu vào', desc: 'Cân nặng, chiều cao, tuổi, giới tính, mức vận động hiện tại, mục tiêu chính, thời gian có thể dành cho meal prep' },
    ],
    kpis: ['4 nhóm cá nhân hóa', '3 cấp độ áp dụng', 'Đầu ra: Profile dinh dưỡng'],
  },
  {
    id: 'B1', label: 'Kiến Thức Nền', emoji: '📚', color: '#06b6d4',
    goal: 'Học ít nhưng hiểu đúng. Nội dung ngắn, dễ hiểu, tránh biến người mới thành người phải tính toán phức tạp trước khi bắt đầu.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B1.1 Năng lượng: BMR, TDEE, cân bằng năng lượng', desc: 'BMR = nhu cầu cơ bản. TDEE = BMR × hệ số vận động. Mục tiêu kcal = TDEE ± delta theo goal.' },
      { title: 'B1.2 Macro: Protein – Carb – Fat', desc: 'Protein là neo chính (1.6–2.2g/kg). Carb là nhiên liệu (không demonize). Fat là điều hòa hormone (0.6–1.0g/kg).' },
      { title: 'B1.3 Chất xơ, nước và vi chất', desc: 'Chất xơ ≥25g/ngày. Nước ≥1.8–2.5L/ngày. Vi chất: ăn đa dạng màu sắc rau củ quả.' },
    ],
    kpis: ['3 nhóm chính dinh dưỡng', 'Công thức Mifflin-St Jeor', 'Học 1 lần, áp dụng mãi'],
  },
  {
    id: 'B2', label: 'Đĩa Ăn Lành Mạnh', emoji: '🍽️', color: '#f59e0b',
    goal: 'Biến kiến thức thành hành động hằng ngày mà không cần cân đo hay tính toán phức tạp.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B2.1 Công thức đĩa ăn cơ bản', desc: '½ đĩa rau/canh · ¼ đĩa đạm · ¼ đĩa tinh bột · thêm 1 phần nhỏ chất béo tốt. Phù hợp với cơm Việt.' },
      { title: 'B2.2 Quy tắc bàn tay', desc: 'Đạm = 1 lòng bàn tay · Tinh bột = 1 nắm tay · Rau = 2 nắm tay · Fat = 1 ngón cái. Không cần cân.' },
      { title: 'B2.3 Cấu trúc bữa ăn chuẩn', desc: '4 câu hỏi: Có đạm chưa? Có rau/canh chưa? Tinh bột vừa với vận động? Không quá nhiều chiên/ngọt?' },
    ],
    kpis: ['Không cần cân đo', 'Phù hợp ăn ngoài', '4 câu hỏi kiểm tra'],
  },
  {
    id: 'B3', label: 'Ăn Theo Mục Tiêu', emoji: '🎯', color: '#a855f7',
    goal: 'Cá nhân hóa chiến lược dinh dưỡng theo mục tiêu cụ thể: giảm mỡ, tăng cơ, sức bền, hay sống khỏe nền tảng.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B3.1 Giảm mỡ', desc: 'Thâm hụt kcal nhẹ (10–15%). Protein đủ 2g/kg. Rau nhiều. Carb không cắt cực đoan. Cho phép linh hoạt 20%.' },
      { title: 'B3.2 Tăng cơ', desc: 'Thặng dư nhẹ 5–10%. Protein 1.8–2.2g/kg. Carb đủ cho buổi tập. Bữa trước + sau tập. Theo dõi cân nặng + vòng eo.' },
      { title: 'B3.3 Sức bền (chạy/đạp/bơi)', desc: 'Carb cycling: ngày nặng kcal cao hơn, ngày nghỉ kcal thấp hơn. Nước + điện giải quan trọng.' },
      { title: 'B3.4 Sống khỏe nền tảng', desc: 'Ăn đủ 3 nhóm. Giảm nước ngọt/bánh kẹo/đồ chiên. Tăng rau, đạm, nước. Không cần tính calo ngay.' },
    ],
    kpis: ['4 nhánh mục tiêu', 'Công thức riêng từng nhánh', 'Có bản "đời thật"'],
  },
  {
    id: 'B4', label: 'Meal Plans — Thực Đơn Mẫu', emoji: '📋', color: '#ec4899',
    goal: 'Thư viện thực đơn đa dạng: 7 ngày, 14 ngày, theo mục tiêu, theo túi tiền, theo thời gian nấu.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B4.1 Thư viện Meal Plans', desc: '7 ngày cơ bản · 14 ngày có mục tiêu · Bản bận rộn · Bản tiết kiệm · Bản ăn ngoài · Bản gia đình' },
      { title: 'B4.2 Format chuẩn mỗi ngày', desc: 'Sáng/trưa/tối/snack + kcal ước tính + protein ước tính + ghi chú thay thế' },
      { title: 'B4.3 Quy tắc thay món', desc: 'Bảng thay thế: protein (gà↔cá↔trứng↔đậu) · carb (cơm↔bún↔khoai) · rau (theo mùa và sở thích)' },
    ],
    kpis: ['6 loại thực đơn', 'Bảng thay thế linh hoạt', 'Phù hợp mọi ngân sách'],
  },
  {
    id: 'B5', label: 'Meal Prep & Ăn Ngoài', emoji: '📦', color: '#f97316',
    goal: 'Giúp người bận rộn không phải nghĩ "hôm nay ăn gì" mỗi ngày, đồng thời vẫn ăn khỏe khi ăn ngoài quán.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B5.1 Meal prep 2 lần/tuần', desc: 'Mỗi lần chuẩn bị 2–3 nguồn đạm · Luộc/hấp rau củ sẵn · Nấu tinh bột vừa đủ · Có món dự phòng nhanh' },
      { title: 'B5.2 Ăn ngoài vẫn khỏe', desc: 'Quy tắc 3 chọn: chọn đạm trước → thêm rau/canh → điều chỉnh tinh bột. Ví dụ: cơm bình dân, phở, bún bò, cơm tấm' },
    ],
    kpis: ['2 lần/tuần meal prep', 'Quy tắc 3 chọn khi ăn ngoài', 'Món dự phòng 10 phút'],
  },
  {
    id: 'B6', label: 'Thói Quen Ăn Uống', emoji: '🔄', color: '#14b8a6',
    goal: 'Xây các thói quen vi mô: ăn chậm, ăn đúng giờ, kiểm soát đồ ngọt, và xử lý bữa "lỡ tay".',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B6.1 Ăn chậm', desc: 'Ăn trong 15–20 phút. Đặt đũa xuống vài lần. Dừng ở mức no 7–8/10. Não cần 20 phút để nhận tín hiệu no.' },
      { title: 'B6.2 Ăn đúng giờ tương đối', desc: 'Không cần cứng nhắc nhưng nên có nhịp. Bữa sáng trong 1 giờ đầu sau thức dậy. Bữa trưa cố định.' },
      { title: 'B6.3 Kiểm soát đồ ngọt', desc: 'Không cấm hoàn toàn. Chiến lược: ăn đủ bữa chính → đủ protein → có trái cây → giảm tần suất ngọt dần.' },
      { title: 'B6.4 Xử lý bữa ăn lỡ tay', desc: 'Quy tắc 3 không: không bỏ bữa sau để bù, không tập phạt, không buông cả ngày. Bữa tiếp theo bình thường.' },
    ],
    kpis: ['4 thói quen vi mô', 'Quy tắc 3 không', 'Bữa kế tiếp là cơ hội'],
  },
  {
    id: 'B7', label: 'Theo Dõi & Điều Chỉnh', emoji: '📊', color: '#8b5cf6',
    goal: 'Theo dõi tiến bộ bằng các chỉ số đơn giản và điều chỉnh kế hoạch sau mỗi 2 tuần dựa trên dữ liệu thực.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70&auto=format&fit=crop',
    items: [
      { title: 'B7.1 Chỉ số theo dõi hằng ngày', desc: 'Protein đủ chưa? Rau/canh có chưa? Nước đủ? Năng lượng trong ngày? Chất lượng ngủ? Bước đi?' },
      { title: 'B7.2 Chỉ số theo dõi hằng tuần', desc: 'Cân nặng trung bình (đo sáng, sau vệ sinh, trước ăn). Vòng eo. Ảnh tiến bộ. Số buổi tập. Tuân thủ meal plan.' },
      { title: 'B7.3 Luật điều chỉnh sau 2 tuần', desc: 'Cân giảm/tăng quá nhanh → điều chỉnh ±150–200 kcal. Không thay đổi → cân lại TDEE và xem lại tracking.' },
    ],
    kpis: ['Daily Log 7 chỉ số', 'Weekly Review 5 chỉ số', 'Điều chỉnh sau 2 tuần'],
  },
];

// ─── User journey steps ───────────────────────────────────────────────────────

const USER_JOURNEY = [
  { step: 1, icon: '📝', title: 'Đánh Giá Đầu Vào', color: '#22c55e', desc: 'Cân nặng, vòng eo, mục tiêu, thói quen ăn, mức vận động → tạo Nutrition Profile', module: 'B0' },
  { step: 2, icon: '🎯', title: 'Chọn Mục Tiêu', color: '#06b6d4', desc: 'Giảm mỡ / tăng cơ / giữ cân / sức bền / sống khỏe nền tảng', module: 'B3' },
  { step: 3, icon: '📚', title: 'Học Kiến Thức Nền', color: '#f59e0b', desc: 'BMR, TDEE, macro basics. Người mới: đĩa ăn. Nâng cao: tính macro', module: 'B1, B2' },
  { step: 4, icon: '🍽️', title: 'Nhận Meal Plan Mẫu', color: '#a855f7', desc: '7 ngày hoặc 14 ngày, phù hợp với mục tiêu và cấp độ đã chọn', module: 'B4' },
  { step: 5, icon: '📓', title: 'Ghi Daily Log', color: '#ec4899', desc: 'Protein, rau, nước, năng lượng, bữa ăn ngoài. App hoặc notebook đều được', module: 'B7' },
  { step: 6, icon: '🔍', title: 'Review Hằng Tuần', color: '#f97316', desc: 'Xem tuân thủ, cân nặng, vòng eo, năng lượng, hiệu suất tập', module: 'B7' },
  { step: 7, icon: '🔄', title: 'Điều Chỉnh', color: '#84cc16', desc: 'Tăng/giảm khẩu phần, đổi món, sửa giờ ăn, thêm meal prep nếu cần', module: 'B5, B7' },
];

// ─── Content product series ───────────────────────────────────────────────────

const VIDEO_SERIES = [
  { ep: 1, title: 'Dinh dưỡng là gì và tại sao quan trọng', duration: '8 phút', tag: 'Nền tảng', color: '#22c55e' },
  { ep: 2, title: 'Protein giúp bạn no lâu và phục hồi tốt hơn', duration: '6 phút', tag: 'Macro', color: '#22c55e' },
  { ep: 3, title: 'Carb không phải kẻ thù — dùng carb thông minh', duration: '7 phút', tag: 'Macro', color: '#06b6d4' },
  { ep: 4, title: 'Chất béo tốt là bạn đồng hành', duration: '5 phút', tag: 'Macro', color: '#f59e0b' },
  { ep: 5, title: 'TDEE là gì? Tính calo hàng ngày thế nào?', duration: '10 phút', tag: 'Công cụ', color: '#a855f7' },
  { ep: 6, title: 'Đĩa ăn lành mạnh — không cần cân đo', duration: '6 phút', tag: 'Thực hành', color: '#ec4899' },
  { ep: 7, title: 'Giảm mỡ không phải nhịn ăn', duration: '8 phút', tag: 'Mục tiêu', color: '#f97316' },
  { ep: 8, title: 'Bữa sau tập nên ăn gì?', duration: '5 phút', tag: 'Tập luyện', color: '#14b8a6' },
  { ep: 9, title: 'Meal prep 60 phút cho cả tuần', duration: '12 phút', tag: 'Thực hành', color: '#8b5cf6' },
  { ep: 10, title: 'Ăn ngoài quán vẫn khỏe — quy tắc 3 chọn', duration: '7 phút', tag: 'Thực hành', color: '#84cc16' },
  { ep: 11, title: 'Một bữa lỡ tay không phá hỏng tiến trình', duration: '5 phút', tag: 'Tâm lý', color: '#06b6d4' },
  { ep: 12, title: 'Theo dõi tiến bộ đúng cách — không bị ám ảnh cân nặng', duration: '8 phút', tag: 'Theo dõi', color: '#f59e0b' },
];

const BLOG_ARTICLES = [
  { title: 'Hướng dẫn tính TDEE cho người Việt', tag: 'Công thức', readTime: '8 phút đọc', icon: '🔢' },
  { title: 'Thực đơn 7 ngày cho người muốn giảm mỡ', tag: 'Meal Plan', readTime: '5 phút đọc', icon: '📋' },
  { title: 'Cơm Việt và dinh dưỡng: không phải kẻ thù', tag: 'Văn hóa', readTime: '6 phút đọc', icon: '🍚' },
  { title: '20 nguồn protein dễ kiếm ở Việt Nam', tag: 'Thực phẩm', readTime: '4 phút đọc', icon: '🥩' },
  { title: 'Ăn ngoài quán bún/phở/cơm tấm vẫn đúng kế hoạch', tag: 'Thực hành', readTime: '5 phút đọc', icon: '🍜' },
  { title: 'Protein powder: cần không? Uống khi nào?', tag: 'Supplement', readTime: '7 phút đọc', icon: '💊' },
  { title: 'Bữa trước/sau tập: hướng dẫn chi tiết', tag: 'Tập luyện', readTime: '6 phút đọc', icon: '💪' },
  { title: '5 lỗi phổ biến khi bắt đầu ăn uống lành mạnh', tag: 'Sai lầm', readTime: '5 phút đọc', icon: '⚠️' },
];

const DOWNLOADABLE_TOOLS = [
  { title: 'Template Daily Nutrition Log (Google Sheet)', desc: 'Theo dõi protein, rau, nước, năng lượng hàng ngày', icon: '📊', tag: 'Theo dõi', color: '#22c55e' },
  { title: 'Thực đơn 7 ngày giảm mỡ (PDF)', desc: 'Sáng/trưa/tối/snack + kcal + protein ước tính', icon: '🔥', tag: 'Meal Plan', color: '#f97316' },
  { title: 'Thực đơn 7 ngày tăng cơ (PDF)', desc: 'Cao protein, carb cycling, bữa workout', icon: '💪', tag: 'Meal Plan', color: '#06b6d4' },
  { title: 'Bảng thay thế thực phẩm (PDF)', desc: '30+ thực phẩm thay thế theo nhóm protein/carb/rau', icon: '🔄', tag: 'Công cụ', color: '#a855f7' },
  { title: 'Meal Prep Checklist (Notion template)', desc: 'Lên kế hoạch nấu 2 lần/tuần, danh sách đi chợ', icon: '📦', tag: 'Meal Prep', color: '#ec4899' },
  { title: 'Máy tính TDEE + Macro (Google Sheet)', desc: 'Nhập cân nặng/chiều cao/mức vận động → ra kết quả', icon: '🔢', tag: 'Công cụ', color: '#84cc16' },
];

// ─── 4 Layers ─────────────────────────────────────────────────────────────────

const FOUR_LAYERS = [
  { num: 1, label: 'Học Đúng', icon: '🧠', color: '#06b6d4', width: '100%', modules: 'B1 + B2',
    desc: 'TDEE, protein, carb, fat, nước, chất xơ, vi chất. Đĩa ăn lành mạnh. Kiến thức để mọi quyết định khác đứng vững.',
    items: ['BMR & TDEE calculation', 'Macro fundamentals', 'Healthy plate system', 'Fiber & micronutrients'] },
  { num: 2, label: 'Ăn Được Ngay', icon: '🍽️', color: '#22c55e', width: '85%', modules: 'B2 + B4 + B5',
    desc: 'Đĩa ăn lành mạnh, quy tắc bàn tay, mẫu bữa Việt, ăn ngoài. Áp dụng được ngay hôm nay mà không cần tính toán.',
    items: ['Plate method', 'Hand portion guide', 'Vietnamese meal templates', 'Eating out strategies'] },
  { num: 3, label: 'Theo Mục Tiêu', icon: '🎯', color: '#f59e0b', width: '70%', modules: 'B3 + B4',
    desc: 'Giảm mỡ, tăng cơ, sức bền, duy trì sức khỏe. Mỗi nhánh có chiến lược macro và meal plan riêng.',
    items: ['Fat loss protocol', 'Muscle gain protocol', 'Endurance nutrition', 'Health maintenance'] },
  { num: 4, label: 'Theo Dõi & Cá Nhân Hóa', icon: '📊', color: '#a855f7', width: '55%', modules: 'B5 + B6 + B7',
    desc: 'Daily Log, Weekly Review, điều chỉnh sau 2 tuần. Tối ưu dựa trên dữ liệu thực, không phải lý thuyết.',
    items: ['Daily nutrition log', 'Weekly review system', 'Bi-weekly adjustment', 'Progress tracking'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEFAULT_INPUTS = { weight: 70, height: 170, age: 30, sex: 'male', activityKey: 'moderate', goalKey: 'recomp' };

function computeStats(inp) {
  const act = ACTIVITY_LEVELS.find(a => a.key === inp.activityKey) || ACTIVITY_LEVELS[2];
  const bmr = Math.round(inp.sex === 'male'
    ? 10 * inp.weight + 6.25 * inp.height - 5 * inp.age + 5
    : 10 * inp.weight + 6.25 * inp.height - 5 * inp.age - 161);
  const tdee = Math.round(bmr * act.mult);
  const goalObj = GOAL_MODIFIERS.find(g => g.key === inp.goalKey) || GOAL_MODIFIERS[1];
  const targetKcal = tdee + goalObj.delta;
  const proteinG = Math.round(inp.weight * goalObj.proteinMult);
  const fatG = Math.round(inp.weight * 0.8);
  const carbG = Math.round((targetKcal - proteinG * 4 - fatG * 9) / 4);
  const bmi = parseFloat((inp.weight / ((inp.height / 100) ** 2)).toFixed(1));
  const bmiRange = BMI_RANGES.find(r => bmi >= r.min && bmi < r.max) || BMI_RANGES[3];
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbKcal = Math.max(0, targetKcal - proteinKcal - fatKcal);
  const carbGCalc = Math.round(carbKcal / 4);
  const proteinPct = Math.round(proteinKcal / targetKcal * 100);
  const fatPct = Math.round(fatKcal / targetKcal * 100);
  const carbPct = 100 - proteinPct - fatPct;
  return {
    ...inp, act, goalObj, bmr, tdee, targetKcal,
    proteinG, fatG, carbG: carbGCalc, bmi, bmiRange,
    proteinKcal, fatKcal, carbKcal, proteinPct, fatPct, carbPct,
    perMealProtein: Math.round(proteinG / 4),
    waterMl: Math.round(inp.weight * 35),
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

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
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px)', transition: `opacity 0.55s ${delay}ms, transform 0.55s ${delay}ms` }}>
      {children}
    </div>
  );
}

function MacroDonut({ s, size = 110 }) {
  const segs = [
    { label: 'Protein', g: s.proteinG, pct: s.proteinPct, color: '#84cc16', kcal: s.proteinKcal },
    { label: 'Carb',    g: s.carbG,    pct: s.carbPct,    color: '#06b6d4', kcal: s.carbKcal    },
    { label: 'Fat',     g: s.fatG,     pct: s.fatPct,     color: '#f59e0b', kcal: s.fatKcal     },
  ];
  const R = size * 0.38, CX = size / 2, CY = size / 2;
  let angle = -90;
  const arcs = segs.map(seg => {
    const startA = angle; const sweep = Math.max(seg.pct * 3.6, 1); angle += seg.pct * 3.6;
    const toR = a => a * Math.PI / 180;
    const x1 = CX + R * Math.cos(toR(startA)), y1 = CY + R * Math.sin(toR(startA));
    const x2 = CX + R * Math.cos(toR(startA + sweep)), y2 = CY + R * Math.sin(toR(startA + sweep));
    return { ...seg, d: `M ${CX} ${CY} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z` };
  });
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible', flexShrink: 0 }}>
        {arcs.map((a, i) => <path key={i} d={a.d} fill={`${a.color}20`} stroke={a.color} strokeWidth="2.5" />)}
        <circle cx={CX} cy={CY} r={R * 0.62} fill="#0a0a0a" />
        <text x={CX} y={CY - 3} textAnchor="middle" fontSize={size * 0.1} fontWeight="700" fill="rgba(255,255,255,0.85)">{(s.targetKcal/1000).toFixed(1)}k</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize={size * 0.07} fill="#6b7280">kcal</text>
      </svg>
      <div className="space-y-2 text-[10px]">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: a.color }} />
            <span className="font-bold" style={{ color: a.color }}>{a.label}</span>
            <span className="text-text font-semibold">{a.g}g</span>
            <span className="text-muted/60">{a.pct}% · {a.kcal} kcal</span>
          </div>
        ))}
        <div className="pt-1 border-t border-border/20 text-[9px] text-muted/50">BMR {s.bmr.toLocaleString()} · TDEE {s.tdee.toLocaleString()} kcal</div>
      </div>
    </div>
  );
}

function DayTypeChart({ s }) {
  const W = 520, H = 110, PL = 42, PR = 14, PT = 14, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const kcals = DAY_TYPES.map(d => Math.round(s.targetKcal * d.mult));
  const maxK = Math.max(...kcals) * 1.1, minK = Math.min(...kcals) * 0.9;
  const yOf = k => PT + cH * (1 - (k - minK) / (maxK - minK));
  const tdeeY = yOf(s.tdee);
  const barW = (cW / 4) - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      <line x1={PL} y1={tdeeY} x2={W - PR} y2={tdeeY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="5 4" />
      <text x={PL - 4} y={tdeeY + 3} textAnchor="end" fontSize="7.5" fill="rgba(255,255,255,0.3)">TDEE</text>
      {DAY_TYPES.map((d, i) => {
        const x = PL + i * (barW + 8) + 4;
        const kcal = kcals[i];
        const bY = yOf(kcal);
        return (
          <g key={d.key}>
            <rect x={x} y={bY} width={barW} height={PT + cH - bY} fill={`${d.color}15`} rx="5" />
            <rect x={x} y={bY} width={barW} height={4} fill={d.color} rx="2" opacity="0.8" />
            <text x={x + barW / 2} y={bY - 7} textAnchor="middle" fontSize="9" fontWeight="700" fill={`${d.color}cc`}>{kcal.toLocaleString()}</text>
            <text x={x + barW / 2} y={PT + cH + 16} textAnchor="middle" fontSize="8" fill={d.color}>{d.emoji} {d.label}</text>
          </g>
        );
      })}
      <text x={PL - 4} y={PT} textAnchor="end" fontSize="7.5" fill="#4b5563">kcal</text>
    </svg>
  );
}

function CarbDistChart({ s }) {
  const W = 520, H = 90, PL = 42, PR = 14, PT = 10, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const carbs = DAY_TYPES.map(d => Math.round(s.carbG * d.carbMult));
  const maxC = Math.max(...carbs) * 1.15;
  const barW = (cW / 4) - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: 'visible' }}>
      {carbs.map((c, i) => {
        const x = PL + i * (barW + 8) + 4;
        const bH = (c / maxC) * cH;
        const bY = PT + cH - bH;
        const d = DAY_TYPES[i];
        return (
          <g key={d.key}>
            <rect x={x} y={bY} width={barW} height={bH} fill={`${d.color}15`} rx="4" />
            <rect x={x} y={bY} width={barW} height={3.5} fill={d.color} rx="2" opacity="0.8" />
            <text x={x + barW / 2} y={bY - 5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={`${d.color}cc`}>{c}g</text>
            <text x={x + barW / 2} y={PT + cH + 16} textAnchor="middle" fontSize="7.5" fill="#6b7280">{d.label}</text>
          </g>
        );
      })}
      <text x={PL - 4} y={PT + cH / 2} textAnchor="end" fontSize="7" fill="#4b5563">Carb(g)</text>
    </svg>
  );
}

function BMIGauge({ bmi }) {
  const W = 260, H = 70, r = 90, cx = 130, cy = 100;
  const toRad = d => d * Math.PI / 180;
  const segments = [
    { from: 180, to: 234, color: '#06b6d4', label: '<18.5' },
    { from: 234, to: 270, color: '#22c55e', label: '18.5–23' },
    { from: 270, to: 292, color: '#84cc16', label: '23–25' },
    { from: 292, to: 328, color: '#f59e0b', label: '25–30' },
    { from: 328, to: 360, color: '#ef4444', label: '>30' },
  ];
  const bmiToAngle = b => Math.min(180 + Math.min(Math.max(b, 10), 40) / 40 * 180, 360);
  const needleAngle = bmiToAngle(bmi);
  const arcPath = (from, to, rOuter, rInner) => {
    const x1 = cx + rOuter * Math.cos(toRad(from)), y1 = cy + rOuter * Math.sin(toRad(from));
    const x2 = cx + rOuter * Math.cos(toRad(to)), y2 = cy + rOuter * Math.sin(toRad(to));
    const x3 = cx + rInner * Math.cos(toRad(to)), y3 = cy + rInner * Math.sin(toRad(to));
    const x4 = cx + rInner * Math.cos(toRad(from)), y4 = cy + rInner * Math.sin(toRad(from));
    const lg = (to - from) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${lg} 0 ${x4} ${y4} Z`;
  };
  const nx = cx + 70 * Math.cos(toRad(needleAngle));
  const ny = cy + 70 * Math.sin(toRad(needleAngle));
  const bmiRng = BMI_RANGES.find(r => bmi >= r.min && bmi < r.max) || BMI_RANGES[3];
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 100" width="220" style={{ overflow: 'visible' }}>
        {segments.map((seg, i) => (
          <path key={i} d={arcPath(seg.from, seg.to, r, r - 16)} fill={`${seg.color}60`} stroke={seg.color} strokeWidth="0.5" />
        ))}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill="#0a0a0a" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="14" fontWeight="800" fill={bmiRng.color}>{bmi}</text>
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="7.5" fill="#9ca3af">{bmiRng.label}</text>
      </svg>
      <p className="text-[9px] text-muted/60 mt-1">{bmiRng.note}</p>
    </div>
  );
}

function FormulaStep({ step, title, color, children, formula }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `${color}20`, background: `${color}04` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors text-left">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0"
          style={{ background: `${color}20`, color, border: `1.5px solid ${color}40` }}>{step}</div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-text">{title}</p>
          {formula && <p className="text-[9px] font-mono text-muted/70 mt-0.5">{formula}</p>}
        </div>
        <span className="text-muted/40 text-sm transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </button>
      {open && <div className="px-4 pb-4 pt-0 border-t space-y-2" style={{ borderColor: `${color}15` }}>{children}</div>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NutritionContentPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [inputOpen, setInputOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [videoTab, setVideoTab] = useState('video');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_INPUTS);
      if (saved) setInputs(p => ({ ...DEFAULT_INPUTS, ...JSON.parse(saved) }));
    } catch {}
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = 'nc-page-kf';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes ncFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes ncPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
      @keyframes ncShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @property --nc-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
      @keyframes ncSpin { to { --nc-angle: 360deg; } }
      .nc-orbit { background:conic-gradient(from var(--nc-angle),transparent 0deg,transparent 55deg,rgba(132,204,22,0) 65deg,rgba(132,204,22,.75) 85deg,rgba(255,255,255,.95) 92deg,rgba(132,204,22,.75) 99deg,rgba(132,204,22,0) 115deg,transparent 125deg,transparent 360deg); animation:ncSpin 3.5s linear infinite; }
      .nc-float { animation:ncFloat 3.5s ease-in-out infinite; }
      .nc-shimmer { background:linear-gradient(90deg,#84cc16 0%,#fff 40%,#84cc16 60%,#22c55e 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:ncShimmer 3s linear infinite; }
    `;
    document.head.appendChild(style);
  }, []);

  const s = useMemo(() => computeStats(inputs), [inputs]);
  const numFld = (label, key, min, max, unit) => (
    <div className="flex flex-col gap-1">
      <label className="text-[9px] font-bold text-muted uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-1 rounded-lg border border-border/25 bg-surface/20 px-2.5 py-1.5">
        <input type="number" min={min} max={max} value={inputs[key]}
          onChange={e => setInputs(p => ({ ...p, [key]: +e.target.value }))}
          className="w-14 bg-transparent text-[11px] font-bold text-text outline-none" />
        <span className="text-[9px] text-muted/60">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Sticky bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-border/20' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/pillar/b" className="text-[10px] font-bold text-muted hover:text-lime-400 transition-colors">← Dinh Dưỡng & Thực Đơn</Link>
          {scrolled && <p className="text-[10px] font-bold text-lime-400">Cấu Trúc Module Nutrition</p>}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1400&q=80&auto=format&fit=crop" alt="Nutrition module" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(10,10,10,.75)0%,rgba(10,10,10,.88)60%,#0a0a0a 100%)' }} />
        <div className="absolute top-20 right-12 w-64 h-64 rounded-full blur-[120px]" style={{ background: 'rgba(132,204,22,0.1)' }} />
        <div className="relative pt-20 pb-14 px-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-[9px] text-muted/60 mb-5">
            <Link to="/" className="hover:text-muted">Trang Chủ</Link><span>/</span>
            <Link to="/pillar/b" className="hover:text-lime-400">Dinh Dưỡng</Link><span>/</span>
            <span className="text-lime-400">Cấu Trúc Module</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/25 bg-lime-500/8 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block nc-pulse" />
                <span className="text-[9px] font-bold text-lime-400 uppercase tracking-[0.2em]">Tài Liệu Tổng Thể</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-3">
                <span className="nc-shimmer">Cấu Trúc Sản Phẩm</span><br />
                <span className="text-text">Nội Dung Module Nutrition</span>
              </h1>
              <p className="text-base text-muted leading-relaxed max-w-xl">
                8 phần B0–B7 · Công thức tính toán · Lộ trình 7 bước · Series nội dung · Công cụ theo dõi. Toàn bộ hệ sinh thái Trụ Cột B trong một trang.
              </p>
              <div className="flex flex-wrap gap-5 mt-6">
                {[['8', 'Phần B0–B7', '#22c55e'],['20+', 'Nguyên tắc', '#06b6d4'],['7', 'Bước hành trình', '#a855f7'],['4', 'Lớp nội dung', '#f59e0b']].map(([v, l, c]) => (
                  <div key={l}><p className="text-3xl font-black" style={{ color: c }}>{v}</p><p className="text-[9px] text-muted uppercase tracking-wider">{l}</p></div>
                ))}
              </div>
            </div>
            {/* Mini formula card */}
            <div className="nc-float rounded-3xl border border-lime-500/15 bg-surface/25 backdrop-blur-sm p-5 w-full lg:w-72 shrink-0">
              <p className="text-[9px] font-bold text-lime-400 uppercase tracking-wider mb-3">Công Thức Nền Tảng</p>
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  ['BMR (nam)', '10×W + 6.25×H − 5×A + 5', '#22c55e'],
                  ['BMR (nữ)', '10×W + 6.25×H − 5×A − 161', '#22c55e'],
                  ['TDEE', 'BMR × Hệ số vận động', '#06b6d4'],
                  ['Protein', 'W(kg) × 1.6–2.2g/kg', '#f59e0b'],
                  ['Carb', '(Target − P×4 − F×9) ÷ 4', '#a855f7'],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between gap-2 items-start">
                    <span className="font-bold shrink-0" style={{ color: c }}>{k}</span>
                    <span className="text-muted/70 text-right leading-tight">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">

        {/* ── LAYER PYRAMID ── */}
        <RevealBlock>
          <div className="rounded-3xl border border-border/20 bg-surface/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏗️</span>
              <div>
                <p className="text-base font-bold text-text">4 Lớp Kiến Trúc Module Nutrition</p>
                <p className="text-[9px] text-muted">Từ nền tảng kiến thức đến cá nhân hóa theo dõi</p>
              </div>
            </div>
            <div className="space-y-3">
              {FOUR_LAYERS.map((layer, i) => (
                <RevealBlock key={i} delay={i * 80}>
                  <div className="rounded-2xl border p-4 transition-all hover:shadow-lg" style={{ borderColor: `${layer.color}20`, background: `${layer.color}06`, maxWidth: layer.width, marginLeft: `${(100 - parseInt(layer.width)) / 2}%` }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: `${layer.color}18`, border: `1.5px solid ${layer.color}30` }}>
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: layer.color }}>Lớp {layer.num}</span>
                          <p className="text-base font-bold text-text">{layer.label}</p>
                          <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${layer.color}30`, color: layer.color }}>Module {layer.modules}</span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed mb-2">{layer.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.items.map((item, j) => (
                            <span key={j} className="text-[8px] px-2 py-0.5 rounded-full border" style={{ borderColor: `${layer.color}25`, color: `${layer.color}bb`, background: `${layer.color}08` }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </div>
        </RevealBlock>

        {/* ── MODULE B0–B7 GRID ── */}
        <RevealBlock>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap">8 Phần Cấu Trúc Module B0–B7</p>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MODULE_SECTIONS.map((mod, i) => (
                <RevealBlock key={mod.id} delay={i * 40}>
                  <button onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                    className="w-full text-left rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={{ borderColor: activeModule === mod.id ? `${mod.color}50` : `${mod.color}18`, background: activeModule === mod.id ? `${mod.color}10` : `${mod.color}04` }}>
                    <div className="relative h-20 overflow-hidden">
                      <img src={mod.image} alt={mod.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${mod.color}40 50%, rgba(10,10,10,.9) 100%)` }} />
                      <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                        <span className="text-xl">{mod.emoji}</span>
                        <span className="text-[10px] font-black text-white">{mod.id}</span>
                      </div>
                      <div className="absolute top-2 right-2 text-[7px] px-1.5 py-0.5 rounded-full" style={{ background: `${mod.color}80`, color: '#fff' }}>
                        {mod.kpis[0]}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-text leading-snug">{mod.label}</p>
                      <p className="text-[9px] text-muted mt-1 leading-relaxed line-clamp-2">{mod.goal}</p>
                    </div>
                  </button>
                </RevealBlock>
              ))}
            </div>

            {/* Active module detail */}
            {activeModule && (() => {
              const mod = MODULE_SECTIONS.find(m => m.id === activeModule);
              return (
                <div className="mt-4 rounded-3xl border p-6" style={{ borderColor: `${mod.color}25`, background: `${mod.color}06` }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `${mod.color}15`, border: `1.5px solid ${mod.color}30` }}>{mod.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: mod.color }}>{mod.id}</p>
                        <p className="text-lg font-black text-text">{mod.label}</p>
                      </div>
                      <p className="text-[10px] text-muted leading-relaxed mt-1">{mod.goal}</p>
                    </div>
                    <button onClick={() => setActiveModule(null)} className="text-muted/40 hover:text-muted text-xl shrink-0">✕</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-3">Nội Dung Chi Tiết</p>
                      <div className="space-y-3">
                        {mod.items.map((item, i) => (
                          <div key={i} className="rounded-xl border p-3" style={{ borderColor: `${mod.color}15`, background: `${mod.color}05` }}>
                            <p className="text-[10px] font-bold text-text mb-1">{item.title}</p>
                            <p className="text-[9px] text-muted leading-relaxed">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">KPIs / Đầu Ra</p>
                        <div className="space-y-2">
                          {mod.kpis.map((k, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: `${mod.color}40`, background: `${mod.color}10` }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: mod.color }} />
                              </div>
                              <p className="text-[10px] text-muted">{k}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl overflow-hidden h-32">
                        <img src={mod.image} alt={mod.label} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </RevealBlock>

        {/* ── FORMULA CALCULATOR ── */}
        <RevealBlock>
          <div className="rounded-3xl border border-lime-500/20 bg-lime-500/4 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-lime-500/15 border border-lime-500/25 flex items-center justify-center"><span className="text-xl">🔢</span></div>
              <div>
                <p className="text-base font-bold text-text">Công Thức Tính Nhanh — Meal Plan Cá Nhân Hóa</p>
                <p className="text-[9px] text-muted">Nhập thông tin → xem ngay kết quả BMI, BMR, TDEE, Macro theo từng bước</p>
              </div>
            </div>

            {/* Input row */}
            <div className="rounded-2xl border border-border/25 bg-surface/15 p-4 mb-6">
              <button onClick={() => setInputOpen(!inputOpen)} className="w-full flex items-center justify-between text-left">
                <div>
                  <p className="text-[10px] font-bold text-lime-400">Thông Số Đầu Vào</p>
                  <p className="text-[9px] text-muted mt-0.5">{inputs.weight}kg · {inputs.height}cm · {inputs.age} tuổi · {inputs.sex === 'male' ? 'Nam' : 'Nữ'} · {ACTIVITY_LEVELS.find(a=>a.key===inputs.activityKey)?.label} · {GOAL_MODIFIERS.find(g=>g.key===inputs.goalKey)?.label}</p>
                </div>
                <span className="text-muted/40 text-sm" style={{ transform: inputOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {inputOpen && (
                <div className="mt-4 space-y-4 border-t border-border/20 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {numFld('Cân nặng', 'weight', 30, 200, 'kg')}
                    {numFld('Chiều cao', 'height', 100, 230, 'cm')}
                    {numFld('Tuổi', 'age', 12, 80, 'tuổi')}
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-muted uppercase tracking-wider">Giới tính</label>
                      <div className="flex gap-1.5">
                        {['male','female'].map(v => (
                          <button key={v} onClick={() => setInputs(p=>({...p, sex:v}))}
                            className="flex-1 rounded-lg border text-[9px] font-bold py-1.5 transition-all"
                            style={inputs.sex===v?{borderColor:LIME,background:`${LIME}18`,color:LIME}:{borderColor:'rgba(255,255,255,0.1)',color:'#6b7280'}}>
                            {v==='male'?'♂ Nam':'♀ Nữ'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Mức vận động</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ACTIVITY_LEVELS.map(a => (
                        <button key={a.key} onClick={() => setInputs(p=>({...p,activityKey:a.key}))}
                          className="px-2.5 py-1 rounded-lg border text-[9px] font-bold transition-all"
                          style={inputs.activityKey===a.key?{borderColor:LIME,background:`${LIME}18`,color:LIME}:{borderColor:'rgba(255,255,255,0.1)',color:'#6b7280'}}>
                          {a.label} <span className="opacity-60">({a.sub})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Mục tiêu</p>
                    <div className="flex flex-wrap gap-2">
                      {GOAL_MODIFIERS.map(g => (
                        <button key={g.key} onClick={() => setInputs(p=>({...p,goalKey:g.key}))}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-bold transition-all"
                          style={inputs.goalKey===g.key?{borderColor:LIME,background:`${LIME}18`,color:LIME}:{borderColor:'rgba(255,255,255,0.1)',color:'#6b7280'}}>
                          <span>{g.emoji}</span>{g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-step results */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* BMI */}
              <div className="rounded-2xl border border-border/20 bg-surface/10 p-4 flex flex-col items-center">
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2 self-start">Bước 1 — BMI</p>
                <p className="text-[9px] font-mono text-muted/60 self-start mb-3">BMI = {inputs.weight} ÷ ({(inputs.height/100).toFixed(2)})² = <span className="text-lime-400 font-bold">{s.bmi}</span></p>
                <BMIGauge bmi={s.bmi} />
              </div>

              {/* BMR */}
              <div className="rounded-2xl border border-border/20 bg-surface/10 p-4">
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Bước 2 — BMR (Mifflin-St Jeor)</p>
                <div className="font-mono text-[9px] text-muted/70 leading-relaxed space-y-1 mb-3">
                  <p>= 10 × {inputs.weight} + 6.25 × {inputs.height} − 5 × {inputs.age} {inputs.sex==='male'?'+ 5':'− 161'}</p>
                  <p>= {10*inputs.weight} + {6.25*inputs.height} − {5*inputs.age} {inputs.sex==='male'?'+ 5':'− 161'}</p>
                  <p className="text-lime-400 font-bold text-[11px]">= {s.bmr.toLocaleString()} kcal/ngày</p>
                </div>
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Bước 3 — TDEE</p>
                <div className="font-mono text-[9px] text-muted/70 leading-relaxed space-y-1">
                  <p>= {s.bmr.toLocaleString()} × {s.act.mult} ({s.act.label})</p>
                  <p className="text-cyan-400 font-bold text-[11px]">= {s.tdee.toLocaleString()} kcal/ngày</p>
                </div>
                <div className="mt-3 rounded-xl p-2.5 border border-lime-500/15 bg-lime-500/5">
                  <p className="text-[9px] font-bold text-lime-400">Mục tiêu: {s.goalObj.label}</p>
                  <p className="text-[8px] text-muted mt-0.5">{s.goalObj.note}</p>
                  <p className="text-[11px] font-black text-text mt-1">Target: {s.targetKcal.toLocaleString()} kcal/ngày</p>
                </div>
              </div>
            </div>

            {/* Macro breakdown */}
            <div className="rounded-2xl border border-border/20 bg-surface/5 p-5 mb-4">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-4">Bước 4–6 — Phân Bổ Macro</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <MacroDonut s={s} size={120} />
                  <div className="mt-4 rounded-xl p-3 border border-border/20 bg-surface/10">
                    <p className="text-[9px] font-mono text-muted/60 leading-relaxed space-y-1">
                      <span className="block">Protein = {inputs.weight} × {s.goalObj.proteinMult}g/kg = <strong className="text-lime-400">{s.proteinG}g</strong> ({s.proteinPct}%)</span>
                      <span className="block">Fat = {inputs.weight} × 0.8g/kg = <strong className="text-amber-400">{s.fatG}g</strong> ({s.fatPct}%)</span>
                      <span className="block">Carb = ({s.targetKcal} − {s.proteinKcal} − {s.fatKcal}) ÷ 4 = <strong className="text-cyan-400">{s.carbG}g</strong> ({s.carbPct}%)</span>
                      <span className="block text-muted/40 border-t border-border/20 pt-1 mt-1">Nước = {inputs.weight} × 35ml = {s.waterMl}ml/ngày</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Kcal Theo Loại Ngày</p>
                    <DayTypeChart s={s} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-2">Carb Theo Loại Ngày</p>
                    <CarbDistChart s={s} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-step formula accordion */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-muted uppercase tracking-wider mb-3">Chi Tiết Từng Bước Tính Toán</p>
              <FormulaStep step={1} title="Thu thập dữ liệu đầu vào" color="#22c55e" formula="Cân nặng · Chiều cao · Tuổi · Giới tính · Mức vận động · Mục tiêu">
                <p className="text-[9px] text-muted pt-2">Mỗi thông số đầu vào ảnh hưởng trực tiếp đến kết quả. Cân nặng và chiều cao ảnh hưởng BMR. Mức vận động nhân hệ số TDEE. Mục tiêu xác định delta kcal và hệ số protein.</p>
              </FormulaStep>
              <FormulaStep step={2} title="Tính BMI — Chỉ số khối cơ thể" color="#06b6d4" formula="BMI = W(kg) / H(m)²">
                <div className="pt-2 space-y-1.5 text-[9px]">
                  {BMI_RANGES.map((r, i) => <div key={i} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: r.color }} /><span className="font-bold" style={{ color: r.color }}>{r.label} (BMI {r.min}–{r.max === 999 ? '30+' : r.max})</span><span className="text-muted/70">— {r.note}</span></div>)}
                  <p className="text-muted/50 pt-1">Lưu ý: BMI không chính xác với người nhiều cơ. Dùng như chỉ số sàng lọc ban đầu.</p>
                </div>
              </FormulaStep>
              <FormulaStep step={3} title="Tính BMR — Nhu cầu cơ bản" color="#f59e0b" formula="Nam: 10W+6.25H−5A+5 | Nữ: 10W+6.25H−5A−161">
                <p className="text-[9px] text-muted pt-2">Công thức Mifflin-St Jeor (1990) — được đánh giá chính xác nhất trong nghiên cứu 2005 của Academy of Nutrition and Dietetics. BMR là năng lượng tối thiểu để tim đập, phổi thở, não hoạt động khi nghỉ hoàn toàn.</p>
              </FormulaStep>
              <FormulaStep step={4} title="Tính TDEE — Tổng tiêu hao năng lượng" color="#a855f7" formula="TDEE = BMR × Hệ số vận động (1.2 → 1.9)">
                <div className="pt-2 space-y-1.5 text-[9px]">
                  {ACTIVITY_LEVELS.map(a => <div key={a.key} className="flex justify-between"><span className="text-muted">{a.label} ({a.sub})</span><span className="font-mono text-purple-400">× {a.mult}</span></div>)}
                </div>
              </FormulaStep>
              <FormulaStep step={5} title="Chọn kcal theo mục tiêu" color="#ec4899" formula="Target = TDEE × Hệ số mục tiêu hoặc TDEE ± Delta">
                <div className="pt-2 space-y-1.5 text-[9px]">
                  {GOAL_MODIFIERS.map(g => <div key={g.key} className="flex gap-2 items-start"><span className="text-2xl">{g.emoji}</span><div><p className="font-bold text-text">{g.label}: TDEE × {g.multMin}–{g.multMax}</p><p className="text-muted/70">{g.note}</p></div></div>)}
                </div>
              </FormulaStep>
              <FormulaStep step={6} title="Tính protein, fat, carb" color="#22c55e" formula="P=W×1.6–2.2g/kg · F=W×0.6–1.0g/kg · C=(Target−P×4−F×9)÷4">
                <div className="pt-2 space-y-2 text-[9px]">
                  <p className="text-muted">Protein là neo chính — tính trước. Fat tính sau. Carb là phần còn lại của tổng kcal. Nguyên tắc: carb tăng/giảm theo loại ngày tập, protein giữ ổn định.</p>
                  <div className="font-mono space-y-1">
                    <p className="text-lime-400">Protein = {s.proteinG}g = {s.proteinKcal} kcal ({s.proteinPct}%)</p>
                    <p className="text-amber-400">Fat = {s.fatG}g = {s.fatKcal} kcal ({s.fatPct}%)</p>
                    <p className="text-cyan-400">Carb = {s.carbG}g = {s.carbKcal} kcal ({s.carbPct}%)</p>
                  </div>
                </div>
              </FormulaStep>
              <FormulaStep step={7} title="Chia kcal theo bữa + theo ngày tập" color="#84cc16" formula="Sáng 25% · Trưa 35% · Tối 30% · Snack 10%">
                <div className="pt-2 space-y-2 text-[9px]">
                  <div className="grid grid-cols-2 gap-2">
                    {[['Sáng (25%)', Math.round(s.targetKcal*0.25), '#f59e0b'],['Trưa (35%)', Math.round(s.targetKcal*0.35), '#22c55e'],['Tối (30%)', Math.round(s.targetKcal*0.30), '#a855f7'],['Snack (10%)', Math.round(s.targetKcal*0.10), '#06b6d4']].map(([l, v, c]) => (
                      <div key={l} className="rounded-lg border p-2 text-center" style={{ borderColor: `${c}20`, background: `${c}08` }}>
                        <p className="font-bold" style={{ color: c }}>{v} kcal</p>
                        <p className="text-muted/60">{l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FormulaStep>
            </div>
          </div>
        </RevealBlock>

        {/* ── USER JOURNEY ── */}
        <RevealBlock>
          <div className="rounded-3xl border border-border/20 bg-surface/5 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🗺️</span>
              <div>
                <p className="text-base font-bold text-text">Hành Trình 7 Bước Của Người Dùng</p>
                <p className="text-[9px] text-muted">Từ đánh giá ban đầu đến theo dõi và điều chỉnh liên tục</p>
              </div>
            </div>
            {/* Step selector */}
            <div className="flex gap-2 flex-wrap mb-5">
              {USER_JOURNEY.map((step, i) => (
                <button key={i} onClick={() => setActiveJourneyStep(i)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[9px] font-bold transition-all"
                  style={activeJourneyStep === i
                    ? { borderColor: step.color, background: `${step.color}18`, color: step.color }
                    : { borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
                  <span>{step.icon}</span><span>Bước {step.step}</span>
                </button>
              ))}
            </div>
            {/* Active step detail */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ background: `linear-gradient(180deg, ${USER_JOURNEY[activeJourneyStep].color}60, transparent)` }} />
              <div className="pl-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: `${USER_JOURNEY[activeJourneyStep].color}15`, border: `1.5px solid ${USER_JOURNEY[activeJourneyStep].color}40` }}>
                    {USER_JOURNEY[activeJourneyStep].icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: USER_JOURNEY[activeJourneyStep].color }}>Bước {USER_JOURNEY[activeJourneyStep].step} / 7 · Module {USER_JOURNEY[activeJourneyStep].module}</p>
                    <p className="text-base font-black text-text">{USER_JOURNEY[activeJourneyStep].title}</p>
                    <p className="text-[10px] text-muted leading-relaxed mt-1">{USER_JOURNEY[activeJourneyStep].desc}</p>
                  </div>
                </div>
                {/* Journey steps mini timeline */}
                <div className="flex items-center gap-0 overflow-x-auto">
                  {USER_JOURNEY.map((st, i) => (
                    <div key={i} className="flex items-center shrink-0">
                      <button onClick={() => setActiveJourneyStep(i)}
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm transition-all"
                        style={i === activeJourneyStep
                          ? { borderColor: st.color, background: `${st.color}20`, boxShadow: `0 0 10px ${st.color}40` }
                          : i < activeJourneyStep
                          ? { borderColor: `${st.color}80`, background: `${st.color}10` }
                          : { borderColor: 'rgba(255,255,255,0.12)', background: 'transparent' }}>
                        <span style={{ filter: i <= activeJourneyStep ? 'none' : 'grayscale(1) opacity(0.4)' }}>{st.icon}</span>
                      </button>
                      {i < USER_JOURNEY.length - 1 && <div className="w-8 h-px mx-0.5" style={{ background: i < activeJourneyStep ? `${st.color}60` : 'rgba(255,255,255,0.08)' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── CONTENT PRODUCT STRUCTURE ── */}
        <RevealBlock>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] whitespace-nowrap px-3">Cấu Trúc Sản Phẩm Nội Dung</p>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 rounded-xl border border-border/25 bg-surface/15 p-1 mb-5">
              {[['video', '🎬 Series Video (12 tập)'], ['blog', '📝 Bài Viết Blog (8 bài)'], ['tools', '🛠️ Công Cụ Tải Về (6 mục)']].map(([id, label]) => (
                <button key={id} onClick={() => setVideoTab(id)}
                  className="flex-1 px-3 py-2 rounded-lg text-[9px] font-bold transition-all duration-200"
                  style={videoTab === id ? { background: LIME, color: '#0a0a0a' } : { color: '#9ca3af' }}>
                  {label}
                </button>
              ))}
            </div>

            {videoTab === 'video' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VIDEO_SERIES.map((v, i) => (
                  <RevealBlock key={i} delay={i * 30}>
                    <div className="rounded-2xl border border-border/20 bg-surface/5 p-4 hover:border-border/40 transition-colors">
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{ background: `${v.color}18`, color: v.color, border: `1px solid ${v.color}30` }}>
                          {v.ep}
                        </div>
                        <div className="flex-1">
                          <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${v.color}18`, color: v.color }}>{v.tag}</span>
                        </div>
                        <span className="text-[8px] text-muted/50">{v.duration}</span>
                      </div>
                      <p className="text-[10px] font-bold text-text leading-snug">{v.title}</p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            )}

            {videoTab === 'blog' && (
              <div className="grid sm:grid-cols-2 gap-3">
                {BLOG_ARTICLES.map((a, i) => (
                  <RevealBlock key={i} delay={i * 40}>
                    <div className="rounded-2xl border border-border/20 bg-surface/5 p-4 hover:border-lime-500/25 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{a.icon}</span>
                        <div>
                          <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-lime-500/10 text-lime-400">{a.tag}</span>
                          <p className="text-[8px] text-muted/50 mt-0.5">{a.readTime}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-text leading-snug">{a.title}</p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            )}

            {videoTab === 'tools' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOWNLOADABLE_TOOLS.map((t, i) => (
                  <RevealBlock key={i} delay={i * 40}>
                    <div className="rounded-2xl border p-4 hover:scale-[1.01] transition-all cursor-pointer" style={{ borderColor: `${t.color}20`, background: `${t.color}06` }}>
                      <div className="text-3xl mb-2">{t.icon}</div>
                      <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${t.color}18`, color: t.color }}>{t.tag}</span>
                      <p className="text-[10px] font-bold text-text leading-snug mb-1">{t.title}</p>
                      <p className="text-[9px] text-muted">{t.desc}</p>
                    </div>
                  </RevealBlock>
                ))}
              </div>
            )}
          </div>
        </RevealBlock>

        {/* ── DATA STRUCTURE ── */}
        <RevealBlock>
          <div className="nc-orbit rounded-3xl p-[1.5px]">
            <div className="rounded-3xl overflow-hidden">
              <div className="relative h-36">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=75&auto=format&fit=crop" alt="Data structure" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-bg/96 via-bg/70 to-bg/20" />
                <div className="absolute inset-0 flex items-center px-8 gap-8">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lime-400 mb-1">Cấu Trúc Dữ Liệu</p>
                    <h3 className="text-xl font-black text-text">4 Database Cốt Lõi</h3>
                    <p className="text-[9px] text-muted">App · Notion · Google Sheet</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: 'Nutrition Profile', icon: '👤', color: '#22c55e', fields: 'BMR, TDEE, macro targets, goal, level' },
                      { name: 'Meal Library', icon: '📚', color: '#06b6d4', fields: 'Tên món, kcal, protein, carb, fat, category' },
                      { name: 'Daily Log', icon: '📓', color: '#f59e0b', fields: 'Protein ✓, Rau ✓, Nước ✓, Steps, Sleep, Mood' },
                      { name: 'Weekly Review', icon: '📊', color: '#a855f7', fields: 'Cân nặng TB, vòng eo, adherence %, điều chỉnh' },
                    ].map((db, i) => (
                      <div key={i} className="rounded-xl border p-2.5" style={{ borderColor: `${db.color}25`, background: `${db.color}10` }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-base">{db.icon}</span>
                          <p className="text-[9px] font-bold" style={{ color: db.color }}>{db.name}</p>
                        </div>
                        <p className="text-[8px] text-muted/70 leading-relaxed">{db.fields}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── SAFETY NOTE ── */}
        <RevealBlock>
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" className="w-5 h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-400 mb-1">Chuẩn An Toàn Module Nutrition</p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                  {['Nội dung dành cho giáo dục sức khỏe phổ thông — không thay thế tư vấn y khoa',
                    'Người có bệnh nền (đái tháo đường, thận, tim mạch, gout) cần tham khảo bác sĩ',
                    'Không khuyến khích nhịn ăn cực đoan hoặc giảm cân quá nhanh (>1kg/tuần)',
                    'Không cổ vũ cắt bỏ hoàn toàn một nhóm chất nếu không có chỉ định y tế',
                    'Không dùng cân nặng làm chỉ số duy nhất — ưu tiên sức khỏe và năng lượng',
                    'Phụ nữ mang thai, cho con bú, người dưới 16 tuổi cần cá nhân hóa riêng',
                  ].map((note, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-yellow-400 text-[9px] mt-0.5 shrink-0">✓</span>
                      <p className="text-[9px] text-muted/80 leading-relaxed">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── CTA ── */}
        <RevealBlock>
          <div className="rounded-3xl border border-lime-500/20 bg-lime-500/5 p-8 text-center">
            <p className="text-3xl mb-2">🏗️</p>
            <h3 className="text-xl font-black text-text mb-2">Module Nutrition — Hệ Thống Hoàn Chỉnh</h3>
            <p className="text-[10px] text-muted max-w-md mx-auto mb-5">
              Từ triết lý đến công cụ. Từ kiến thức đến hành động. Từ ngày đầu tiên đến thói quen trọn đời.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pillar/b" className="px-5 py-2.5 rounded-xl border border-lime-500/30 bg-lime-500/10 text-[10px] font-bold text-lime-400 hover:bg-lime-500/20 transition-all">
                ← Về Dinh Dưỡng & Thực Đơn
              </Link>
              <Link to="/pillar/b/roadmap" className="px-5 py-2.5 rounded-xl text-[10px] font-bold text-bg hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #22c55e, #84cc16)' }}>
                Xem Lộ Trình 12/24 Tuần →
              </Link>
            </div>
          </div>
        </RevealBlock>
        <div className="h-8" />
      </div>
    </div>
  );
}
