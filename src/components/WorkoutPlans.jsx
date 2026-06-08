import { useState } from 'react';

/* ── Color palette ── */
const C = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.2)',   hex:'#22c55e', dot:'bg-green-400',  ring:'ring-green-500/30'  },
  yellow: { text:'text-yellow-400', bg:'bg-yellow-500/10', border:'border-yellow-500/30', bar:'bg-yellow-500', glow:'rgba(234,179,8,0.2)',   hex:'#eab308', dot:'bg-yellow-400', ring:'ring-yellow-500/30' },
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.2)',  hex:'#f97316', dot:'bg-orange-400', ring:'ring-orange-500/30' },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   glow:'rgba(59,130,246,0.2)',  hex:'#3b82f6', dot:'bg-blue-400',   ring:'ring-blue-500/30'   },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   glow:'rgba(20,184,166,0.2)',  hex:'#14b8a6', dot:'bg-teal-400',   ring:'ring-teal-500/30'   },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.2)',  hex:'#a855f7', dot:'bg-purple-400', ring:'ring-purple-500/30' },
};

/* ── Goal plans data ── */
const PLANS = [
  {
    id: 'busy',
    icon: '⚡',
    name: 'Siêu Bận',
    sub: '10 phút/ngày',
    color: 'yellow',
    heroImg: 'https://images.unsplash.com/photo-1485727749690-d091e8284ef3?w=900&q=70',
    badge: 'Linh hoạt nhất',
    rpe: 'RPE 5–7',
    forWho: ['Làm việc 9–10 giờ/ngày', 'Không có thiết bị tập', 'Hay bỏ cuộc vì thiếu thời gian', 'Muốn bắt đầu không cần điều kiện'],
    notFor: 'Muốn tăng cơ hay giảm mỡ nhanh — cần nhiều thời gian hơn',
    commitment: '7 ngày/tuần × 10 phút',
    philosophy: '"Thắng bằng sự đều đặn, không cần hoành tráng." 10 phút mỗi ngày trong 1 năm = 60+ giờ vận động.',
    session: {
      title: 'Buổi Tập 10 Phút — Full Body Circuit',
      blocks: [
        {
          phase: 'Khởi Động', time: '2 phút', color: 'orange', icon: '🔥',
          exercises: ['Đi bộ tại chỗ nâng gối 30s', 'Xoay vai 10 vòng/hướng', 'Xoay hông 10 vòng/hướng'],
        },
        {
          phase: 'Vận Động Chính', time: '6 phút', color: 'yellow', icon: '⚡',
          note: 'Làm 2 vòng, không nghỉ giữa bài — chỉ nghỉ 20s giữa 2 vòng',
          exercises: [
            'Squat 30s — gối theo ngón chân, hông xuống',
            'Push-up (tường/gối/chuẩn tùy sức) 30s',
            'Glute bridge 30s — bóp mông ở đỉnh, giữ 1s',
            'Plank gối hoặc thẳng 20–30s',
          ],
        },
        {
          phase: 'Hạ Nhiệt', time: '2 phút', color: 'teal', icon: '🧘',
          exercises: ['Đi bộ tại chỗ chậm 30s', 'Giãn đùi sau 30s/bên', 'Thở sâu 4 nhịp — hít 4s, thở ra 6s'],
        },
      ],
    },
    progression: [
      { week: '1–2', text: 'Giữ form đúng, không cần nhanh hay nhiều' },
      { week: '3–4', text: 'Tăng lên 3 vòng thay vì 2 vòng' },
      { week: '5–8', text: 'Thêm biến thể khó hơn (squat nhảy nhẹ, push-up sâu hơn)' },
      { week: '9+',  text: 'Xem xét tăng lên 15–20 phút khi lịch cho phép' },
    ],
    nutrition: 'Tối thiểu: mỗi bữa chính có 1 nguồn đạm (trứng, sữa chua, thịt nạc, đậu). Không bỏ bữa sáng. Uống đủ nước.',
    progress: ['28/28 ngày không bỏ buổi dù chỉ 10 phút', 'Cơ thể dẻo dai hơn, ít mỏi lưng sau ngày dài', 'Plank cải thiện từ 15s → 30s+'],
    tip: 'Cài báo thức "10 phút tập luyện" — làm ngay khi chuông reng, không suy nghĩ. Bộ não sẽ tự động hóa thói quen sau 4–6 tuần.',
  },
  {
    id: 'beginner',
    icon: '🌱',
    name: 'Người Mới',
    sub: '20–30 phút/ngày',
    color: 'green',
    heroImg: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=70',
    badge: 'Dễ bắt đầu',
    rpe: 'RPE 5–6',
    forWho: ['Chưa tập thể dục bao giờ hoặc lâu không tập', 'Muốn xây thói quen bền vững', 'Không có thiết bị', 'Ưu tiên học đúng hơn tập nhiều'],
    notFor: 'Đã có nền thể lực tốt — sẽ quá nhẹ',
    commitment: '5–6 ngày/tuần × 20–30 phút',
    philosophy: 'Form đúng trước, tải trọng sau. 4–6 tuần đầu là đầu tư vào hệ thần kinh cơ — không nên vội.',
    session: {
      title: 'Buổi Strength A — Học 5 Mẫu Nền Tảng',
      blocks: [
        {
          phase: 'Khởi Động', time: '5 phút', color: 'orange', icon: '🔥',
          exercises: ['Đi bộ tại chỗ + nâng gối 1\'', 'Xoay vai + xoay cổ tay 30s', 'Gập hông cơ bản 8 lần — cảm nhận chuỗi sau', 'Ngồi xuống ghế kiểm soát 8 lần'],
        },
        {
          phase: 'Strength — 5 Mẫu', time: '18–20 phút', color: 'green', icon: '🏋️',
          note: 'Nghỉ 60–90s giữa mỗi hiệp. Cảm giác "thách thức nhưng kiểm soát" là đúng mức.',
          exercises: [
            'Squat to chair 2–3 × 10 — gối theo ngón chân, không sập vào trong',
            'Wall push-up 2–3 × 10 — thân thẳng, khuỷu 45° so với thân',
            'Glute bridge 2–3 × 12 — bóp mông ở đỉnh, đừng dùng lưng',
            'Dead bug 2–3 × 8/bên — lưng dán sàn hoàn toàn, di chuyển chậm',
            'Plank gối 2–3 × 15–20s — thở nhịp nhàng, không nín thở',
          ],
        },
        {
          phase: 'Giãn Cơ', time: '5 phút', color: 'teal', icon: '🧘',
          exercises: ['Giãn đùi trước 30s/bên (kéo gót về mông)', 'Giãn đùi sau 30s/bên', 'Pigeon pose nhẹ 45s/bên', 'Tư thế em bé 1 phút'],
        },
      ],
    },
    progression: [
      { week: '1–2', text: 'Học form từng bài, không cần tăng khối lượng' },
      { week: '3–4', text: 'Tăng từ 2 lên 3 hiệp khi form ổn định' },
      { week: '5–6', text: 'Squat sâu hơn + push-up gối thay wall push-up' },
      { week: '7–8', text: 'Thêm tạ nhẹ hoặc band kháng lực nếu muốn' },
    ],
    nutrition: 'Áp dụng đĩa ½ rau – ¼ đạm – ¼ tinh bột. Mỗi bữa chính phải có đạm. Uống 2L nước/ngày.',
    progress: ['Plank cải thiện từ 10s → 30s+', 'Squat cảm thấy ổn định hơn, không đau gối', 'Hoàn thành 7/7 ngày tuần đầu tiên'],
    tip: 'Ghi nhật ký ngắn sau mỗi buổi: cảm giác, số reps, điều khó nhất. Sau 4 tuần đọc lại — bạn sẽ ngạc nhiên về sự tiến bộ.',
  },
  {
    id: 'fatloss',
    icon: '🔥',
    name: 'Giảm Mỡ',
    sub: '30–40 phút/ngày',
    color: 'orange',
    heroImg: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&q=70',
    badge: 'Phổ biến nhất',
    rpe: 'RPE 6–7',
    forWho: ['Thừa cân nhẹ (BMI 23–27)', 'Muốn giảm mỡ bền vững không yo-yo', 'Có thể đi bộ nhanh, chạy bộ nhẹ hoặc đạp xe', 'Chấp nhận ăn kiêng không cực đoan'],
    notFor: 'Muốn thấy kết quả trong 2 tuần — giảm mỡ lành mạnh cần 8–12 tuần+',
    commitment: '5 ngày/tuần × 30–40 phút (3 strength + 2 cardio Zone 2)',
    philosophy: 'Thâm hụt calo vừa phải (200–400 kcal/ngày) + strength giữ cơ + Zone 2 đốt mỡ. Không nhịn ăn, không tập quá sức.',
    session: {
      title: 'Buổi Giảm Mỡ — Strength + NEAT',
      blocks: [
        {
          phase: 'Khởi Động', time: '5 phút', color: 'orange', icon: '🔥',
          exercises: ['Đi bộ tại chỗ nhanh dần 1\'', 'Hip circle + xoay vai 30s', 'Inchworm 3 lần — co giãn chuỗi sau', 'Leg swing 10 lần/bên'],
        },
        {
          phase: 'Strength A — Full Body', time: '20 phút', color: 'orange', icon: '🏋️',
          note: '3 hiệp × 10–12 reps. Nghỉ 60s. Nâng tải khi đủ 12 reps 2 buổi liên tiếp.',
          exercises: [
            'Squat trọng lượng cơ thể hoặc goblet squat 3×10',
            'Push-up (tường/gối/chuẩn) 3×8–10',
            'Romanian deadlift (dây/tạ nhẹ) 3×10',
            'Glute bridge / Hip thrust 3×12',
            'Plank 3×25s + Dead bug 3×8/bên',
          ],
        },
        {
          phase: 'LISS Cardio Zone 2', time: '15 phút', color: 'teal', icon: '🏃',
          note: 'Nhịp tim 120–140 bpm. Còn nói được câu ngắn = đúng Zone 2.',
          exercises: ['Chạy bộ nhẹ (jogging) Zone 2, đi bộ nhanh, hoặc đạp xe 15\'', 'Chạy bộ: bắt đầu bằng xen kẽ chạy 1\' + đi bộ 1\' nếu chưa quen', 'Nhịp tim > 145: bước sang đi bộ ngay, không cố chạy', 'Kết thúc: giãn bắp chân + đùi sau 5\''],
        },
      ],
    },
    progression: [
      { week: '1–4', text: '3 strength + 2 cardio Zone 2 (30 phút). Ghi vòng eo ban đầu.' },
      { week: '5–8', text: 'Cardio tăng 5 phút/tuần. Thêm 2000–3000 bước/ngày (NEAT).' },
      { week: '9–12', text: 'Interval nhẹ: 5 × 2\' nhanh + 2\' chậm. Nếu đã chạy bộ được — thay bằng jogging 20\' Zone 2 liên tục.' },
    ],
    nutrition: 'Thâm hụt calo 200–400 kcal/ngày. Protein ≥ 1.6g/kg. Carb thông minh: ăn trước/sau tập, giảm buổi tối. Uống 2–2.5L nước.',
    progress: ['Vòng eo giảm 0.5–1cm/tuần (mục tiêu lành mạnh)', 'Leo cầu thang dễ hơn sau 4 tuần', 'Năng lượng buổi chiều tốt hơn'],
    tip: 'Đo vòng eo mỗi sáng cùng điều kiện (trước ăn, sau toilet). Cân nặng dao động ±2kg/ngày là bình thường — vòng eo mới phản ánh đúng tiến bộ.',
  },
  {
    id: 'muscle',
    icon: '💪',
    name: 'Tăng Cơ',
    sub: '40–50 phút/ngày',
    color: 'blue',
    heroImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=70',
    badge: 'Tăng cơ',
    rpe: 'RPE 7–8',
    forWho: ['Đã biết 5 mẫu vận động cơ bản', 'Có tạ tay, band, hoặc đến gym', 'Muốn cơ thể rắn chắc có hình dáng', 'Kiên nhẫn — cơ tăng chậm nhưng bền vững'],
    notFor: 'Hoàn toàn mới — cần học form trước (Lộ trình Người Mới 8 tuần trước)',
    commitment: '4 ngày/tuần × 40–50 phút (Upper/Lower split)',
    philosophy: 'Progressive overload là vua: mỗi tuần tăng nhẹ tải, reps, hoặc hiệp. Protein đủ 1.6–2g/kg. Ngủ 7–8 tiếng.',
    session: {
      title: 'Upper A — Ngực & Lưng',
      blocks: [
        {
          phase: 'Khởi Động', time: '5 phút', color: 'orange', icon: '🔥',
          exercises: ['Band pull-apart 2×15 — kích hoạt vai/lưng giữa', 'Arm circle + shoulder rotation 30s', 'Push-up nhẹ 10 lần — warm-up ngực'],
        },
        {
          phase: 'Upper A — Compound First', time: '35–40 phút', color: 'blue', icon: '💪',
          note: 'Nghỉ 90s compound, 60s bài phụ. Ghi tải trọng để tăng tuần sau.',
          exercises: [
            'A1. Bench/Push-up nâng cao 4×8–10 — thân thẳng, khuỷu 45°',
            'A2. Dumbbell row 4×10 — lưng thẳng, kéo khuỷu về hông',
            'B1. Overhead press 3×10 — đẩy thẳng lên, không ưỡn lưng',
            'B2. Face pull / Band pull-apart 3×15 — sức khỏe khớp vai',
            'C1. Incline fly / Cable fly 3×12 — cảm nhận ngực kéo dài',
            'C2. Lat pulldown / Band lat 3×10 — kéo bả vai xuống trước',
          ],
        },
        {
          phase: 'Finisher + Giãn Cơ', time: '5 phút', color: 'teal', icon: '🧘',
          exercises: ['Bicep curl 2×12 (tùy chọn)', 'Giãn ngực ở cửa 30s', 'Child pose với tay duỗi 45s', 'Cross-body shoulder stretch 30s/bên'],
        },
      ],
    },
    progression: [
      { week: '1–4', text: 'Học form compound lifts. Tập RPE 7 tối đa.' },
      { week: '5–8', text: 'Tăng volume: 3 → 4 hiệp compound. +2.5kg/tuần nếu form đẹp.' },
      { week: '9–12', text: 'Upper A/B + Lower A/B = 4 ngày full split.' },
      { week: '13+', text: 'Theo dõi PR hàng tháng. Deload tuần 4 mỗi mesocycle.' },
    ],
    nutrition: 'Calo = TDEE + 200–300 kcal (thặng dư nhẹ). Protein 1.6–2g/kg. Carb trước tập, protein sau tập 30 phút. Ngủ 7–8 tiếng.',
    progress: ['Tăng tải trọng đều đặn qua 12 tuần', 'Cảm nhận rõ cơ bắt đầu "chắc" hơn sau 6–8 tuần', 'Test: push-up tăng từ X → X+5 reps sau 12 tuần'],
    tip: 'Chụp ảnh cơ thể mỗi 4 tuần (ánh sáng tốt, cùng góc). Gương và cân không nói thật — ảnh mới phản ánh sự thay đổi.',
  },
  {
    id: 'endurance',
    icon: '🏃',
    name: 'Sức Bền',
    sub: '40–60 phút/ngày',
    color: 'teal',
    heroImg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&q=70',
    badge: 'Cardio Zone 2',
    rpe: 'RPE 5–7',
    forWho: ['Muốn cải thiện tim phổi', 'Chuẩn bị cho sự kiện: 5km, 10km, đạp xe', 'Hay hụt hơi khi leo cầu thang', 'Thích đi bộ/đạp xe nhưng muốn có cấu trúc', 'Muốn bắt đầu chạy bộ từ con số 0 (C25K style)'],
    notFor: 'Muốn tăng cơ nhiều — cần thêm strength training',
    commitment: '5 ngày/tuần × 30–60 phút (3 cardio + 2 strength tối thiểu)',
    philosophy: '80% Zone 2 (nói chuyện được) + 20% Zone 4 (interval). Xây nền aerobic trước — tốc độ đến sau.',
    session: {
      title: 'Buổi Zone 2 + Strength Tối Thiểu',
      blocks: [
        {
          phase: 'Cardio Zone 2', time: '35–40 phút', color: 'teal', icon: '🏃',
          note: 'Nhịp tim 60–70% HRmax. Kiểm tra: còn hát nhẹ được = đúng Zone 2.',
          exercises: [
            'Chạy bộ nhẹ (jogging) Zone 2 — đây là lựa chọn chính để xây nền sức bền',
            'Mới bắt đầu: xen kẽ chạy 1\' + đi bộ 2\' — lặp 10–12 vòng',
            'Sau 4 tuần: tăng dần chạy liên tục 5\' → 10\' → 20\' không dừng',
            'Thay thế: đi bộ nhanh hoặc đạp xe Zone 2 nếu đầu gối đang phục hồi',
            'Nhịp tim > 145: bước sang đi bộ, đừng cố push — tốc độ đến sau',
          ],
        },
        {
          phase: 'Strength Tối Thiểu', time: '15–20 phút', color: 'green', icon: '🏋️',
          note: '2–3 hiệp × 10 reps. Không cần nặng — mục tiêu giữ cơ.',
          exercises: [
            'Squat 3×10 — giữ sức mạnh chân',
            'Push-up 3×10 — giữ thân trên',
            'Band row 3×10 — cân bằng cardio-heavy',
            'Glute bridge 3×12 — bảo vệ hông và lưng',
          ],
        },
        {
          phase: 'Cool-down', time: '5 phút', color: 'purple', icon: '🧘',
          exercises: ['Giãn bắp chân 30s/bên (đau nhức sau cardio)', 'Giãn đùi sau ngồi 30s/bên', 'Pigeon pose 45s/bên', 'Thở chậm 2 phút'],
        },
      ],
    },
    progression: [
      { week: '1–4', text: 'Zone 2 30 phút × 3 buổi. Chạy bộ: xen kẽ chạy 1\' + đi bộ 2\' — lặp 10 vòng. Không thêm interval.' },
      { week: '5–8', text: 'Tăng thời gian chạy liên tục: 5\' → 8\' → 10\'. Thêm 1 buổi interval: 4 × 2\' nhanh + 2\' chậm.' },
      { week: '9–12', text: 'Chạy liên tục 15–20\' Zone 2. 1 buổi dài cuối tuần 50–60 phút (kết hợp chạy + đi bộ).' },
      { week: '13+', text: 'Mục tiêu chạy 5km liên tục. Tempo run: 20 phút Zone 3. Cân nhắc đăng ký sự kiện 5km.' },
    ],
    nutrition: 'Carb đủ để có năng lượng. Uống 2–2.5L + thêm điện giải khi mồ hôi nhiều. Protein sau buổi tập dài để phục hồi cơ.',
    progress: ['Leo cầu thang 3–4 tầng không hụt hơi sau 4 tuần', 'Nhịp tim khi nghỉ (resting HR) giảm 3–5 bpm sau 8 tuần', 'Chạy bộ liên tục 5km không dừng sau 12 tuần'],
    tip: 'Đeo đồng hồ hoặc dùng app đo nhịp tim. Tập Zone 2 mà nhịp tim đúng vùng quan trọng hơn tốc độ hay quãng đường.',
  },
  {
    id: 'advanced',
    icon: '🏆',
    name: 'Nâng Cao',
    sub: '60–90 phút/ngày',
    color: 'purple',
    heroImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=70',
    badge: 'Đa môn',
    rpe: 'RPE 7–8',
    forWho: ['Đã tập đều ≥ 6 tháng', 'Có nền sức mạnh và tim mạch tốt', 'Muốn thử thách đa môn: gym + đạp xe + bơi', 'Sẵn sàng cam kết 6 ngày/tuần'],
    notFor: 'Chưa tập bao giờ — sẽ bị chấn thương. Phải xây nền 6 tháng trước.',
    commitment: '6 ngày/tuần × 60–90 phút (gym 5 + cardio dài 2)',
    philosophy: 'Periodization: tăng load 3 tuần → deload 1 tuần. Theo dõi HRV. Phục hồi là phần tập quan trọng nhất.',
    session: {
      title: 'Thứ 2 — Đạp Xe + Upper Gym + Bơi',
      blocks: [
        {
          phase: 'Cardio Zone 2', time: '40 phút', color: 'teal', icon: '🏃',
          note: 'Zone 2 làm nền aerobic trước gym — không push nhanh.',
          exercises: ['Chạy bộ Zone 2 40\' nhịp tim 120–135 bpm (pace ~6–7 phút/km)', 'Hoặc: đạp xe 40\' cadence 80–90 rpm — tùy điều kiện ngày hôm đó', 'Uống 400–500ml nước trong buổi tập'],
        },
        {
          phase: 'Upper Gym', time: '30 phút', color: 'purple', icon: '💪',
          note: 'Tập sau đạp xe → dạy cơ thể hoạt động khi đã mệt (functional training).',
          exercises: [
            'Bench press / Push-up nâng cao 4×8 — RPE 7',
            'Dumbbell row 4×10 — form trước, tải sau',
            'OHP 3×10 + Face pull 3×15',
            'Superset: Curl 3×12 + Tricep dip 3×12',
          ],
        },
        {
          phase: 'Bơi Kỹ Thuật', time: '50 phút', color: 'blue', icon: '🏊',
          note: 'Bơi sau gym → low-impact recovery cho khớp.',
          exercises: ['Bơi 1000–1500m freestyle kỹ thuật — không sprint', 'Xen kẽ backstroke 200m để phục hồi vai', 'Cool-down: float 5 phút, thở điều hòa'],
        },
      ],
    },
    progression: [
      { week: '1–4', text: 'Làm quen khối lượng lớn. Giữ RPE 6–7, không ép sức.' },
      { week: '5–8', text: '+5–10% volume gym/tuần. Đạp và bơi giữ ổn định.' },
      { week: '9–12', text: 'Thêm interval đạp Zone 3–4 × 1 buổi/tuần.' },
      { week: '13–16', text: 'Peak load. Tuần 17: deload 30% volume.' },
    ],
    nutrition: '~3000 kcal ngày tập nặng. Protein ~155g/ngày (~2g/kg). Carb quanh buổi dài. Ngủ 8 tiếng. Omega-3 + magie bổ sung.',
    progress: ['Bơi 1500m liên tục không dừng', 'Deadlift ≥ 1.5× trọng lượng cơ thể', 'Resting HR < 55 bpm sau 12 tuần'],
    tip: 'Đầu tư vào thiết bị theo dõi HRV (nhịp tim thay đổi). HRV thấp buổi sáng = cơ thể chưa phục hồi → giảm tải ngày đó. Đây là kỹ năng quan trọng nhất của vận động viên nghiệp dư.',
  },
];

/* ── Section component ── */
function Section({ block, pc }) {
  const bc = C[block.color] || pc;
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${bc.border} bg-bg/60`}>
      {/* Section header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${bc.border} ${bc.bg}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{block.icon}</span>
          <div>
            <span className={`text-sm font-black ${bc.text} uppercase tracking-wider`}>{block.phase}</span>
            {block.note && <p className="text-[10px] text-muted/70 mt-0.5 leading-snug">{block.note}</p>}
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-full border ${bc.bg} ${bc.border} ${bc.text}`}>
          ⏱ {block.time}
        </span>
      </div>
      {/* Exercises */}
      <ul className="p-3 space-y-1.5">
        {block.exercises.map((ex, i) => (
          <li key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-bg border border-border/40 hover:border-border transition-colors duration-150">
            <span className={`shrink-0 w-4 h-4 rounded-full ${bc.dot} mt-0.5`} />
            <span className="text-sm text-text/90 leading-relaxed">{ex}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Main component ── */
export default function WorkoutPlans() {
  const [activePlan, setActivePlan] = useState(0);
  const [tab, setTab]               = useState('session'); // 'session' | 'progression' | 'nutrition'

  const plan = PLANS[activePlan];
  const pc   = C[plan.color];

  return (
    <section className="mb-16">
      {/* ── Header ── */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-text flex items-center gap-3 mb-1">
          <span>📋</span> Buổi Tập Theo Mục Tiêu
        </h2>
        <p className="text-muted text-base">
          6 lộ trình cá nhân hóa — chọn đúng mục tiêu, đúng cấp độ, đúng thời gian bạn có
        </p>
      </div>

      {/* ── Goal selector (2-row on mobile, horizontal scroll) ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {PLANS.map((p, i) => {
          const cs       = C[p.color];
          const isActive = activePlan === i;
          return (
            <button
              key={p.id}
              onClick={() => { setActivePlan(i); setTab('session'); }}
              className={`shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all duration-200 min-w-[90px] ${
                isActive
                  ? `${cs.bg} ${cs.border} ${cs.text}`
                  : 'bg-surface border-border text-muted hover:border-white/20 hover:text-text'
              }`}
              style={isActive ? { boxShadow: `0 4px 20px ${cs.glow}` } : undefined}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[11px] font-black leading-tight text-center">{p.name}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${
                isActive ? 'bg-white/10 border-white/20 text-white/60' : 'bg-bg border-border/50 text-muted/50'
              }`}>{p.sub}</span>
            </button>
          );
        })}
      </div>

      {/* ── Plan content card ── */}
      <div
        key={activePlan}
        className={`relative overflow-hidden rounded-3xl border ${pc.border} animate-fade-in-up`}
        style={{ boxShadow: `0 8px 48px ${pc.glow}` }}
      >
        {/* ── Hero header ── */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <img
            src={plan.heroImg}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: 0.32 }}
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-bg/98 via-bg/70 to-transparent`} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

          {/* Glow orb */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ background: pc.hex }} />

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${pc.bg} ${pc.border} ${pc.text}`}>
                    {plan.badge}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.border} ${pc.text}`}>
                    {plan.rpe}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{plan.icon}</span>
                  <div>
                    <h3 className={`text-3xl font-black ${pc.text}`}>{plan.name}</h3>
                    <p className="text-muted text-sm">{plan.sub} · {plan.commitment}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">

          {/* ── Profile cards: For Who + Not For ── */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className={`rounded-2xl border ${pc.border} ${pc.bg} p-4`}>
              <p className={`text-[10px] font-black ${pc.text} uppercase tracking-wider mb-2`}>✅ Dành cho</p>
              <ul className="space-y-1">
                {plan.forWho.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${pc.dot} mt-1.5`} />
                    <span className="text-sm text-text/85 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-surface/50 p-4">
              <p className="text-[10px] font-black text-muted/60 uppercase tracking-wider mb-2">⚠️ Không phù hợp</p>
              <p className="text-sm text-muted/80 leading-relaxed">{plan.notFor}</p>
              <div className={`mt-3 pt-3 border-t border-border/50`}>
                <p className="text-[10px] font-black text-muted/60 uppercase tracking-wider mb-1.5">🧭 Triết lý</p>
                <p className={`text-sm ${pc.text} leading-relaxed font-medium`}>{plan.philosophy}</p>
              </div>
            </div>
          </div>

          {/* ── Inner tab bar ── */}
          <div className="flex gap-1 p-1 bg-bg rounded-xl border border-border mb-5">
            {[
              { key: 'session',     label: '📋 Buổi Tập Mẫu'     },
              { key: 'progression', label: '📈 Lộ Trình'          },
              { key: 'nutrition',   label: '🥗 Dinh Dưỡng'        },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 text-sm font-bold py-2 rounded-lg transition-all duration-150 ${
                  tab === key
                    ? `${pc.bg} ${pc.text} border ${pc.border}`
                    : 'text-muted hover:text-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab: Buổi Tập Mẫu ── */}
          {tab === 'session' && (
            <div>
              <p className={`text-base font-black ${pc.text} mb-4 flex items-center gap-2`}>
                <span>📋</span> {plan.session.title}
              </p>
              <div className="space-y-3">
                {plan.session.blocks.map((block, i) => (
                  <Section key={i} block={block} pc={pc} />
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Lộ Trình ── */}
          {tab === 'progression' && (
            <div>
              <p className={`text-base font-black ${pc.text} mb-4`}>📈 Lộ Trình Tiến Bộ Theo Tuần</p>
              <div className="relative">
                {/* Vertical line */}
                <div className={`absolute left-[18px] top-0 bottom-4 w-px ${pc.bar} opacity-20`} />
                <div className="space-y-3">
                  {plan.progression.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`shrink-0 w-9 h-9 rounded-full ${pc.bg} border ${pc.border} ${pc.text} text-[10px] font-black flex items-center justify-center z-10`}>
                        W{i + 1}
                      </div>
                      <div className={`flex-1 bg-bg/60 border ${pc.border} border-opacity-30 rounded-2xl px-4 py-3`}>
                        <p className={`text-[10px] font-black ${pc.text} mb-0.5`}>Tuần {step.week}</p>
                        <p className="text-sm text-text/85 leading-relaxed">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress markers */}
              <div className={`mt-5 rounded-2xl border ${pc.border} ${pc.bg} p-4`}>
                <p className={`text-sm font-black ${pc.text} mb-3`}>🎯 Dấu Hiệu Tiến Bộ</p>
                <ul className="space-y-2">
                  {plan.progress.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`shrink-0 text-sm ${pc.text} mt-0.5`}>✓</span>
                      <span className="text-sm text-text/85 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ── Tab: Dinh Dưỡng ── */}
          {tab === 'nutrition' && (
            <div>
              <p className={`text-base font-black ${pc.text} mb-4`}>🥗 Dinh Dưỡng Đi Kèm Lộ Trình</p>
              <div className={`relative overflow-hidden rounded-2xl border ${pc.border} ${pc.bg} p-5 mb-5`}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-8 pointer-events-none"
                  style={{ background: pc.hex }} />
                <p className="relative text-base text-text/90 leading-relaxed">{plan.nutrition}</p>
              </div>

              {/* Macro guide */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Protein', value: '1.6–2g/kg', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', tip: 'Trứng · Cá · Thịt nạc · Đậu hũ' },
                  { label: 'Carb',    value: 'Quanh tập',  color: 'text-green-400 bg-green-500/10 border-green-500/30', tip: 'Cơm · Khoai · Yến mạch' },
                  { label: 'Chất béo', value: '0.8–1g/kg', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', tip: 'Bơ · Cá hồi · Hạt chia' },
                ].map((m, i) => (
                  <div key={i} className={`rounded-xl border ${m.color} p-3`}>
                    <p className={`text-[10px] font-black ${m.color.split(' ')[0]} mb-0.5`}>{m.label}</p>
                    <p className="text-sm font-bold text-text">{m.value}</p>
                    <p className="text-[9px] text-muted/60 mt-1">{m.tip}</p>
                  </div>
                ))}
              </div>

              {/* Timing tip */}
              <div className="rounded-xl border border-border bg-surface/50 p-4">
                <p className="text-[10px] font-black text-muted/60 uppercase tracking-wider mb-2">⏱ Thời Điểm Ăn Uống</p>
                <div className="space-y-2">
                  {[
                    { time: 'Trước tập 1–2h', tip: 'Carb nhẹ + protein nhỏ (chuối + whey/trứng)' },
                    { time: 'Sau tập 30–60 phút', tip: 'Protein + carb (cơm + thịt, hoặc shake)' },
                    { time: 'Trước ngủ', tip: 'Casein chậm (sữa chua Hy Lạp, phô mai, trứng)' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${pc.bg} ${pc.border} ${pc.text} whitespace-nowrap`}>
                        {item.time}
                      </span>
                      <span className="text-sm text-muted/80 leading-relaxed">{item.tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Coach tip (always visible) ── */}
          <div className={`mt-5 flex gap-3 items-start rounded-2xl border ${pc.border} ${pc.bg} px-4 py-3`}>
            <span className="text-base shrink-0 mt-0.5">💡</span>
            <div>
              <p className={`text-[10px] font-black ${pc.text} mb-0.5`}>Coach Tip Cá Nhân</p>
              <p className="text-sm text-muted/90 leading-relaxed">{plan.tip}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
