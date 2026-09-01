import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── Tab data ───────────────────────────────────────────────────────────────────

const TABS = [
  {
    n: '01',
    frameClass: 'pa-frame-0',
    path: '/pillar/a/movements',
    title: '6 Mẫu Vận Động Nền Tảng',
    sub: 'Khởi Động & Giãn Cơ Sau Tập',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=65',
    longDesc: 'Học 6 mẫu chuyển động cơ bản — nền tảng của mọi chương trình tập luyện hiệu quả. Mỗi bài tập có video minh họa chi tiết, từ tư thế chuẩn đến biến thể nâng cao. Kết hợp khởi động 5–8 phút và giãn cơ sau tập, bạn có một buổi hoàn chỉnh và an toàn.',
    highlights: [
      { icon: '🎬', title: 'Video HD từng bài', desc: 'Xem rõ góc độ, kỹ thuật và cue vận động chuẩn' },
      { icon: '📊', title: '3 cấp độ/bài tập',  desc: 'Từ cơ bản đến nâng cao — tiến bộ từng bước rõ ràng' },
      { icon: '🔥', title: 'Khởi động chuẩn khoa học', desc: 'Giảm nguy cơ chấn thương và tăng hiệu suất 15–20%' },
    ],
    quote: 'Thành thạo 6 mẫu chuyển động cơ bản — bạn có nền tảng cho 95% mọi bài tập trong cuộc đời.',
    quoteContext: 'Nguyên lý sinh cơ học hiện đại',
    details: [
      { icon: '🦴', title: 'Tại sao chỉ 6 mẫu?', body: 'Các nhà sinh cơ học phân tích hàng nghìn bài tập và tìm thấy chúng đều là biến thể của 6 mẫu cơ bản. Thành thạo 6 mẫu = nền tảng vĩnh cửu cho mọi chương trình.' },
      { icon: '🔄', title: 'Biến thể không giới hạn', body: 'Mỗi mẫu có 5–10+ biến thể từ siêu dễ đến nâng cao. Squat vào ghế → Pistol squat. Không cần thiết bị — tư thế đúng là tất cả.' },
      { icon: '⚖️', title: 'Cân bằng cơ thể toàn diện', body: 'Push + Pull cân bằng cơ trước/sau. Squat + Hinge phát triển toàn hạ bộ. Core ổn định cột sống. Breath kiểm soát toàn bộ hệ thống — đây là vòng lặp hoàn hảo.' },
    ],
    tabStats: [
      { n: '6', label: 'Bài tập', tooltip: '6 mẫu vận động cơ bản: Squat, Hinge, Push, Pull, Core, Thở — bao phủ 95% mọi bài tập bạn cần trong cuộc đời.' },
      { n: '3×', label: 'Cấp độ/bài', tooltip: 'Mỗi bài có 3 cấp: cơ bản, trung cấp, nâng cao. Bắt đầu dễ, tiến dần — không cần thiết bị phức tạp.' },
      { n: "15'", label: 'Khởi + Giãn', tooltip: 'Khởi động 5–8 phút trước tập giảm nguy cơ chấn thương, giãn cơ 5–10 phút sau tập tăng tốc phục hồi 20–30%.' },
    ],
    previewItems: ['Squat', 'Hinge', 'Push-up', 'Pull/Row', 'Core', 'Thở & Tim mạch', 'Khởi động 5–8\'', 'Giãn cơ 5–10\''],
    cta: 'Học động tác',
    color: '#22c55e',
    rgb:   '34,197,94',
    glow: 'rgba(34,197,94,0.18)',
    text:  'text-green-400',
    badge: 'bg-green-500/8 border-green-500/20 text-green-400',
    dot:   'bg-green-400',
    chip:  'bg-green-500/10 border-green-500/20 text-green-300',
    border:'border-green-500/30',
    accentBg: 'bg-green-500/8',
    tabBg:    'bg-green-500/5',
    bar:   'from-green-500/80 to-transparent',
  },
  {
    n: '02',
    frameClass: 'pa-frame-1',
    path: '/pillar/a/framework',
    title: 'Khung Ngày Tập 20–40 Phút',
    sub: 'Chọn Khung Thời Gian Luyện Tập',
    icon: '⏱️',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=65',
    longDesc: 'Buổi tập không cần dài — cần đúng cấu trúc. 4 khối thời gian trong ngày (Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm) cho phép tập có mục đích trong bất kỳ thời lượng nào. Chọn khung phù hợp — mỗi phút đều có kế hoạch rõ ràng.',
    highlights: [
      { icon: '⚡', title: '4 khối thời gian chuẩn', desc: 'Cấu trúc khoa học cho mỗi buổi tập' },
      { icon: '📐', title: '8 mức: 20–180 phút',      desc: 'Từ siêu bận đến chuyên sâu — đều có lịch' },
      { icon: '💡', title: 'Chi tiết từng phút',       desc: 'Biết chính xác làm gì trong mỗi khoảng thời gian' },
    ],
    quote: 'Cấu trúc tốt quan trọng hơn thời gian dài. 20 phút có kế hoạch hiệu quả hơn 1 giờ tự do.',
    quoteContext: 'Khoa học hành vi tập luyện',
    details: [
      { icon: '🧠', title: 'Não bộ cần cấu trúc', body: 'Giảm quyết định trong buổi tập giúp tập trung vào chất lượng động tác, không phải "tập gì tiếp theo". Cấu trúc rõ ràng = ít burnout hơn và nhất quán hơn theo thời gian.' },
      { icon: '⚡', title: '4 khối — một cấu trúc vạn năng', body: 'Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm. Buổi 20 phút hay 180 phút đều dùng cùng cấu trúc này, chỉ thay đổi tỉ lệ thời gian giữa các khối.' },
      { icon: '🌙', title: 'Tĩnh tâm 5 phút — không phải xa xỉ', body: '5 phút thở có kiểm soát sau tập giảm cortisol 15% và cải thiện giấc ngủ đêm. Đây là đầu tư nhỏ nhất với lợi ích phục hồi lớn nhất trong ngày.' },
    ],
    tabStats: [
      { n: '4', label: 'Khối/ngày', tooltip: '4 khối chuẩn: Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm. Cấu trúc này áp dụng cho buổi 20 phút hay 3 giờ đều phù hợp.' },
      { n: '8', label: 'Mức thời gian', tooltip: '8 mức lịch từ 20 phút (siêu bận) đến 3 giờ (chuyên sâu) — mỗi phút đều có kế hoạch rõ ràng, không lãng phí.' },
      { n: "20'", label: 'Tối thiểu', tooltip: '20 phút đủ để hoàn thành một buổi tập có ý nghĩa. Não cần cấu trúc, không cần thời gian dài.' },
    ],
    previewItems: ['Khởi động 5\'', 'Sức mạnh 10–20\'', 'Tim mạch 15–35\'', 'Giãn cơ 5–10\'', 'Tĩnh tâm 5\'', '7 kcal/phút max'],
    cta: 'Xây khung ngày',
    color: '#f97316',
    rgb:   '249,115,22',
    glow: 'rgba(249,115,22,0.18)',
    text:  'text-orange-400',
    badge: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
    dot:   'bg-orange-400',
    chip:  'bg-orange-500/10 border-orange-500/20 text-orange-300',
    border:'border-orange-500/30',
    accentBg: 'bg-orange-500/8',
    tabBg:    'bg-orange-500/5',
    bar:   'from-orange-500/80 to-transparent',
  },
  {
    n: '03',
    frameClass: 'pa-frame-2',
    path: '/pillar/a/weekly',
    title: 'Nhịp Tuần Gợi Ý',
    sub: 'Buổi Tập Theo Mục Tiêu',
    icon: '📅',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=900&q=65',
    longDesc: 'Thể lực được xây qua tuần, không phải qua ngày. 3 giai đoạn nhịp tuần (Bắt đầu → Xây nền → Nâng cao) giúp cơ thể thích nghi từng bước mà không burnout. 6 lộ trình theo mục tiêu giúp bạn chọn đúng nhịp cho hoàn cảnh cụ thể của mình.',
    highlights: [
      { icon: '🗓', title: '3 giai đoạn nhịp tuần', desc: 'Tiến bộ từng bước, không burnout' },
      { icon: '🎯', title: '6 lộ trình theo mục tiêu', desc: 'Từ siêu bận đến vận động viên chuyên sâu' },
      { icon: '😴', title: 'Nghỉ đúng cách',          desc: 'Phục hồi là phần thiết yếu, không phải lười biếng' },
    ],
    quote: 'Cơ thể phát triển trong thời gian nghỉ ngơi — không phải trong buổi tập. Nhịp tuần là nghệ thuật biết lúc nào dừng.',
    quoteContext: 'Sinh lý học tập luyện',
    details: [
      { icon: '🔬', title: 'Cửa sổ phục hồi 48–72 giờ', body: 'Cơ bắp cần 48–72 giờ để sửa chữa vi chấn thương và tăng trưởng. Thiết kế nhịp tuần đúng tạo đủ khoảng cách giữa các buổi cùng nhóm cơ — đây là nền tảng của progressive overload.' },
      { icon: '📈', title: '3 giai đoạn thích nghi dần', body: 'Giai đoạn 1 (tuần 1–2): 3 buổi/tuần — cơ thể học nhận diện tải. Giai đoạn 2 (tuần 3–6): 4 buổi — xây nền sức mạnh. Giai đoạn 3 (tuần 7+): 5–6 buổi — cá nhân hóa theo mục tiêu.' },
      { icon: '🎯', title: 'Chọn nhịp bền vững, không phải lý tưởng', body: '6 lộ trình từ 2 buổi/tuần (siêu bận) đến 6 buổi/tuần (vận động viên). Nhịp tốt nhất không phải nhịp cao nhất — là nhịp bạn duy trì được 12 tuần liên tục.' },
    ],
    tabStats: [
      { n: '3', label: 'Giai đoạn', tooltip: 'G1 (tuần 1–2): 3 buổi/tuần cơ bản. G2 (tuần 3–6): 4 buổi xây nền. G3 (tuần 7+): 5–6 buổi nâng cao cá nhân hóa.' },
      { n: '6', label: 'Lộ trình', tooltip: '6 lộ trình theo mục tiêu: người mới · giảm mỡ · tăng cơ · sức bền · vận động viên · siêu bận. Chọn 1 phù hợp hoàn cảnh.' },
      { n: '7', label: 'Ngày/tuần', tooltip: '7 ngày = 3 buổi sức mạnh + 2 buổi cardio + 2 ngày nghỉ/phục hồi. Nghỉ đúng là phần thiết yếu, không phải lười biếng.' },
    ],
    previewItems: ['Sức mạnh T2/T4/T6', 'Cardio T3/T5', 'Phục hồi T7', 'Người mới', 'Giảm mỡ', 'Tăng cơ', 'Sức bền', 'Nâng cao'],
    cta: 'Lên lịch tuần',
    color: '#14b8a6',
    rgb:   '20,184,166',
    glow: 'rgba(20,184,166,0.18)',
    text:  'text-teal-400',
    badge: 'bg-teal-500/8 border-teal-500/20 text-teal-400',
    dot:   'bg-teal-400',
    chip:  'bg-teal-500/10 border-teal-500/20 text-teal-300',
    border:'border-teal-500/30',
    accentBg: 'bg-teal-500/8',
    tabBg:    'bg-teal-500/5',
    bar:   'from-teal-500/80 to-transparent',
  },
  {
    n: '04',
    frameClass: 'pa-frame-3',
    path: '/pillar/a/progress',
    title: 'Bậc Thang Tiến Bộ',
    sub: 'Kiểm Tra Tiến Bộ Hàng Tháng',
    icon: '🏆',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65',
    longDesc: 'Tiến bộ mà không đo được thì không bền vững. Bậc thang tiến bộ cho bạn thấy rõ đang ở đâu và cần làm gì tiếp theo. Kết hợp test 3 kỳ (Tuần 4, 8, 12) và radar chart 4 chiều, bạn có bức tranh toàn diện về sức khỏe thể chất.',
    highlights: [
      { icon: '🪜', title: 'Bậc thang rõ ràng',     desc: 'Biết chính xác bước tiếp theo trong hành trình' },
      { icon: '🎯', title: 'Test định kỳ 3 kỳ',     desc: 'Kiểm tra tuần 4, tuần 8 và tuần 12' },
      { icon: '📊', title: 'Radar chart 4 chiều',   desc: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi' },
    ],
    quote: 'Những gì không đo được thì không cải thiện được. Tiến bộ nhỏ, đo được, nhất quán — đó là công thức thật sự.',
    quoteContext: 'Nguyên lý quản lý hiệu suất',
    details: [
      { icon: '📋', title: 'Test công bằng — không phải ngẫu hứng', body: '3 kỳ test (Tuần 4, 8, 12) được lên kế hoạch khi cơ thể đã phục hồi hoàn toàn — không phải sau buổi tập nặng. Điều kiện test nhất quán cho kết quả đáng tin cậy.' },
      { icon: '🕸️', title: 'Radar chart 4 chiều — thấy điểm yếu ẩn', body: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi. Nhiều người mạnh về sức mạnh nhưng kém linh hoạt — đây là nguy cơ chấn thương ẩn mà chỉ nhìn một chỉ số không thấy được.' },
      { icon: '🪜', title: '5 bậc — biết rõ vị trí và đích đến', body: 'Bậc 1 (Hoạt động cơ bản) đến Bậc 5 (Vận động viên). Mỗi bậc có tiêu chí rõ ràng: bài tập nào, reps/sets bao nhiêu, thời gian phục hồi. Không còn cảm giác "không biết tập đến đâu rồi".' },
    ],
    tabStats: [
      { n: '6', label: 'Lộ trình', tooltip: '6 lộ trình từ 2 buổi/tuần (siêu bận) đến 6 buổi/tuần (vận động viên). Nhịp tốt nhất là nhịp duy trì được 12 tuần.' },
      { n: '5', label: 'Bậc/lộ trình', tooltip: '5 bậc từ Hoạt động cơ bản đến Vận động viên. Mỗi bậc có tiêu chí rõ ràng — bài tập, reps, thời gian phục hồi.' },
      { n: '4', label: 'Chiều đánh giá', tooltip: 'Radar chart 4 chiều: Sức mạnh · Sức bền · Linh hoạt · Phục hồi. Thấy được điểm yếu ẩn mà chỉ một chỉ số không thể hiện.' },
    ],
    previewItems: ['Tuần 4 test', 'Tuần 8 test', 'Tuần 12 test', 'Radar chart', '6 mục tiêu cá nhân', 'Điểm A/B/C/D', 'Coach notes'],
    cta: 'Theo dõi tiến bộ',
    color: '#a855f7',
    rgb:   '168,85,247',
    glow: 'rgba(168,85,247,0.18)',
    text:  'text-purple-400',
    badge: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
    dot:   'bg-purple-400',
    chip:  'bg-purple-500/10 border-purple-500/20 text-purple-300',
    border:'border-purple-500/30',
    accentBg: 'bg-purple-500/8',
    tabBg:    'bg-purple-500/5',
    bar:   'from-purple-500/80 to-transparent',
  },
];

// HIGHLIGHT_MODALS[tabIdx * 3 + highlightIdx]
const HIGHLIGHT_MODALS = [
  // ── Tab 0: 6 Mẫu Vận Động (green) ──────────────────────────────────────────
  {
    icon: '🎬', color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Video HD Từng Bài — Tại Sao Xem Đúng Quan Trọng Hơn Đọc',
    img: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Học kỹ thuật vận động qua video giúp não kích hoạt "mirror neurons" — cơ thể bắt đầu học mẫu chuyển động ngay cả trước khi thực hành. Xem đúng góc độ giảm 40% thời gian học kỹ thuật mới.',
    detail: 'Kỹ thuật tập luyện là thứ không thể học chỉ qua chữ viết. Video HD với nhiều góc quay khác nhau cho phép não bộ phân tích chuyển động 3D — điều mà hình ảnh 2D hay mô tả văn bản không thể truyền đạt được.',
    details: [
      'Mirror neurons (neuron gương): Khi xem người khác thực hiện động tác, cùng các vùng não kiểm soát vận động của bạn cũng kích hoạt — đây là cơ chế học vận động qua quan sát.',
      'Góc quay quan trọng: Góc bên (sagittal) cho thấy độ sâu squat và vị trí lưng. Góc trước (frontal) cho thấy đối xứng hai bên. Góc sau cho thấy căn chỉnh cột sống. Một video với đủ 3 góc là tốt nhất.',
      'Cue vận động (movement cues): "Ngồi giữa hai chân" hiệu quả hơn "gập gối 90 độ". "Đẩy sàn xuống" hiệu quả hơn "duỗi gối". Cue tốt kích hoạt đúng nhóm cơ hơn mô tả kỹ thuật thuần túy.',
      'Tốc độ xem: Xem slow-motion ở 0.5× tốc độ giúp nhận ra các phase của động tác mà mắt thường bỏ sót ở tốc độ bình thường — đặc biệt quan trọng cho deadlift và overhead press.',
      'So sánh cấp độ: Xem cùng bài tập ở cấp độ cơ bản, trung cấp và nâng cao cạnh nhau giúp não xây dựng "lộ trình tiến bộ" trực quan — biết mình đang ở đâu và đích đến trông như thế nào.',
      'Xem trước, tập sau: Nghiên cứu Motor Learning cho thấy xem video 2–3 lần trước khi thực hành cải thiện kỹ thuật buổi đầu tiên lên 28% so với nhóm chỉ đọc mô tả.',
    ],
    points: [
      { icon: '🧠', label: 'Mirror neurons', note: 'Não học kỹ thuật ngay khi xem, trước khi tập' },
      { icon: '📐', label: '3 góc quay', note: 'Sagittal · Frontal · Posterior — không thiếu góc nào' },
      { icon: '⏪', label: 'Slow-motion 0.5×', note: 'Nhận ra phase động tác mắt thường bỏ sót' },
      { icon: '📈', label: '+28% kỹ thuật', note: 'Xem video trước tập tốt hơn chỉ đọc mô tả' },
    ],
  },
  {
    icon: '📊', color: '#22c55e', rgb: '34,197,94',
    modalTitle: '3 Cấp Độ Mỗi Bài — Tiến Bộ Không Bao Giờ Dừng Lại',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Principle of Progressive Overload: cơ thể chỉ tiếp tục phát triển khi kích thích tăng dần theo thời gian. 3 cấp độ mỗi bài tập tạo ra lộ trình tiến bộ rõ ràng trong ít nhất 6–18 tháng.',
    detail: 'Hầu hết người bỏ tập không phải vì lười — mà vì bị "plateau" và không biết bước tiếp theo là gì. 3 cấp độ rõ ràng mỗi bài giải quyết vấn đề này: luôn có thứ gì đó để hướng đến.',
    details: [
      'Cấp 1 — Cơ bản (Beginner): Biên độ động tác đầy đủ với hỗ trợ hoặc tải trọng thấp. Mục tiêu là học pattern chuyển động đúng, không phải khối lượng tạ. Ví dụ: Goblet squat giữ dumbbell nhẹ.',
      'Cấp 2 — Trung cấp (Intermediate): Cùng mẫu chuyển động nhưng giảm hỗ trợ hoặc tăng tải trọng. Kỹ thuật đã ổn định, giờ tập trung vào strength progression. Ví dụ: Barbell back squat.',
      'Cấp 3 — Nâng cao (Advanced): Thêm độ khó qua unilateral (1 chân/tay), tempo đặc biệt, hoặc biên độ mở rộng. Ví dụ: Pistol squat, pause squat, tempo squat 4-0-1-0.',
      'Tiêu chí lên cấp: Không phải ngẫu hứng — mà dựa trên tiêu chí cụ thể (10 reps × 3 sets với kỹ thuật hoàn hảo ở cấp hiện tại). Đừng lên cấp trước khi đạt tiêu chí.',
      'Thời gian giữa các cấp: Người mới thường mất 4–8 tuần mỗi cấp. Người trung cấp mất 8–16 tuần. Không có "quá chậm" — chỉ có "đúng thời điểm" hay "chưa sẵn sàng".',
      'Khi bị stuck ở cấp: Không phải thiếu nỗ lực — thường là thiếu volume (thêm 1–2 set), thiếu protein, hoặc thiếu ngủ. Giải quyết 3 yếu tố này trước khi lo về kỹ thuật.',
    ],
    points: [
      { icon: '🪜', label: 'Lộ trình 6–18 tháng', note: '3 cấp = đủ thách thức cho ít nhất 1,5 năm' },
      { icon: '✅', label: 'Tiêu chí lên cấp', note: '10 reps × 3 sets kỹ thuật hoàn hảo = sẵn sàng' },
      { icon: '⏱️', label: '4–8 tuần/cấp', note: 'Người mới bình thường — đừng so sánh với người khác' },
      { icon: '🔄', label: 'Plateau = thiếu volume', note: 'Thêm 1–2 set trước khi lo về kỹ thuật' },
    ],
  },
  {
    icon: '🔥', color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Khởi Động Chuẩn Khoa Học — 5–8 Phút Không Thể Bỏ',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Khởi động đúng cách tăng nhiệt độ cơ bắp 1–2°C, cải thiện dẫn truyền thần kinh-cơ, và giảm viscosity khớp. Kết quả: sức mạnh đỉnh tăng 15–20%, nguy cơ chấn thương giảm 20–30%.',
    detail: 'Khởi động không phải nghi lễ — nó có chức năng sinh lý cụ thể. Cơ bắp lạnh co bóp kém hơn, dẫn truyền thần kinh chậm hơn, và khớp thiếu dầu bôi trơn. 5–8 phút khởi động đúng cách thay đổi hoàn toàn chất lượng buổi tập.',
    details: [
      'Nhiệt độ cơ bắp: Mỗi 1°C tăng nhiệt độ = tốc độ co cơ tăng 2–4%. Khởi động 5 phút đủ để tăng 1–2°C nhiệt độ cơ bắp sâu — tương đương tăng 4–8% tốc độ và sức mạnh co cơ.',
      'Dịch khớp (synovial fluid): Lúc sáng sớm hoặc sau thời gian ngồi lâu, dịch khớp đặc và ít. Chuyển động nhẹ trong khởi động kích thích tiết dịch khớp, giảm ma sát và nguy cơ tổn thương sụn.',
      'Neural pre-activation: Khởi động kích hoạt các motor neurons cần dùng trong buổi tập. Bắt đầu bằng các bài tập tương tự pattern sẽ tập (mobility squat cho buổi squat) hiệu quả hơn chạy bộ chung chung.',
      'Dynamic > Static: Khởi động động (leg swing, hip circle, arm circle) tốt hơn giãn cơ tĩnh (static stretch) trước tập. Static stretch trước tập có thể giảm sức mạnh đỉnh tạm thời 5–10%.',
      'Progressive intensity: Bắt đầu nhẹ → tăng dần cường độ. Không bắt đầu ngay bằng bài nặng nhất. Rule of thumb: 2–3 warm-up sets với tải trọng 50–70% trước working sets.',
      'Khởi động tâm lý: Thời gian khởi động cũng là thời gian não "chuyển mode" từ công việc/cuộc sống sang buổi tập. Không bỏ qua khởi động tâm lý này — nó ảnh hưởng đến sự tập trung và motivation.',
    ],
    points: [
      { icon: '🌡️', label: '+1–2°C nhiệt độ cơ', note: '= +4–8% tốc độ và sức mạnh co cơ' },
      { icon: '💧', label: 'Kích thích dịch khớp', note: 'Giảm ma sát, bảo vệ sụn khớp' },
      { icon: '⚡', label: 'Neural pre-activation', note: 'Kích hoạt đúng motor neurons sẽ dùng' },
      { icon: '🚫', label: 'No static stretch trước', note: 'Giảm sức mạnh đỉnh 5–10% nếu giãn tĩnh trước tập' },
    ],
  },
  // ── Tab 1: Khung Ngày Tập (orange) ─────────────────────────────────────────
  {
    icon: '⚡', color: '#f97316', rgb: '249,115,22',
    modalTitle: '4 Khối Thời Gian Chuẩn — Cấu Trúc Khoa Học Mỗi Buổi Tập',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '4 khối phục vụ 4 chức năng sinh lý khác nhau: Khởi động (neural activation) → Vận động chính (stimulus) → Giãn cơ (recovery initiation) → Tĩnh tâm (ANS regulation). Thiếu bất kỳ khối nào làm giảm hiệu quả tổng thể.',
    detail: 'Cấu trúc 4 khối không phải tùy tiện — mỗi khối phục vụ một giai đoạn trong chu trình sinh lý của buổi tập. Khi thiếu 1 khối, cả chuỗi sinh lý bị phá vỡ và hiệu quả tổng thể giảm dù volume vận động chính không đổi.',
    details: [
      'Khối 1 — Khởi động (5–10 phút): Tăng nhiệt độ cơ, kích hoạt thần kinh-cơ, bôi trơn khớp. Bỏ qua khối này = giảm 15–20% sức mạnh đỉnh và tăng nguy cơ gân cơ bị kéo căng đột ngột.',
      'Khối 2 — Vận động chính (10–150 phút): Phần cốt lõi của buổi tập. Sức mạnh, cardio, hoặc kết hợp. Đây là khối duy nhất có thể co giãn theo thời gian — các khối khác nên giữ nguyên.',
      'Khối 3 — Giãn cơ (5–10 phút): Static stretch sau tập (không trước) khi cơ đang ấm giúp tăng range of motion và giảm DOMS. Mỗi tư thế giữ ≥30 giây — dưới 15 giây không có hiệu quả.',
      'Khối 4 — Tĩnh tâm (5 phút): Điều chỉnh hệ thần kinh tự chủ từ sympathetic (fight/flight) sang parasympathetic (rest/digest). Thở có kiểm soát là cách nhanh nhất để thực hiện điều này.',
      'Tỉ lệ thời gian: Buổi 60 phút gợi ý: Khởi động 8\' + Vận động chính 40\' + Giãn cơ 7\' + Tĩnh tâm 5\'. Buổi 20 phút: 4\' + 10\' + 4\' + 2\'. Tỉ lệ co giãn, cấu trúc không đổi.',
      'Sai lầm phổ biến: Bỏ khởi động vì "bận", bỏ giãn cơ vì "chán", bỏ tĩnh tâm vì "không cần". Kết quả là buổi tập chỉ có khối 2 — thiếu 3 điều quan trọng nhất cho tính bền vững.',
    ],
    points: [
      { icon: '🔥', label: 'Khởi động không thể bỏ', note: '+15–20% sức mạnh đỉnh khi khởi động đúng' },
      { icon: '⚡', label: 'Vận động chính', note: 'Khối duy nhất linh hoạt — co giãn thoải mái' },
      { icon: '🧘', label: 'Giãn cơ sau (không trước)', note: '≥30 giây/tư thế để có hiệu quả thực' },
      { icon: '🌬️', label: 'Tĩnh tâm 5 phút', note: 'Chuyển sympathetic → parasympathetic nhanh nhất' },
    ],
  },
  {
    icon: '📐', color: '#f97316', rgb: '249,115,22',
    modalTitle: '8 Mức Thời Gian — Từ 20 Phút Đến 3 Giờ, Đều Có Kế Hoạch',
    img: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Hôm nay bận quá không tập được" thường không phải vì thiếu thời gian — mà vì thiếu kế hoạch cho buổi tập ngắn. 20 phút có cấu trúc hiệu quả hơn 1 giờ không có kế hoạch.',
    detail: '8 mức thời gian từ 20 đến 180 phút đảm bảo luôn có một lịch tập phù hợp với thời gian bạn có hôm đó — không có lý do để bỏ buổi chỉ vì "không đủ thời gian".',
    details: [
      'Mức 20 phút (Siêu bận): Khởi động 4\' + Sức mạnh full-body circuit 12\' + Giãn nhanh 3\' + Thở 1\'. 3 bài tập compound (squat/push/hinge), 3 sets × 8 reps. Không lãng phí giây nào.',
      'Mức 30 phút (Nhanh): Thêm 1 bài hoặc thêm 1 set cho mỗi bài. Hoặc thay circuit bằng superset (2 bài liên tiếp, nghỉ ngắn hơn).',
      'Mức 45 phút (Chuẩn): Tách được thành sức mạnh (25\') + cardio nhẹ (10\') hoặc tập trung hoàn toàn vào sức mạnh với thêm warm-up chuyên sâu.',
      'Mức 60 phút (Đầy đủ): Đủ thời gian cho lower hoặc upper body tập trung, với warm-up đầy đủ và giãn cơ có ý nghĩa. Đây là "buổi tập lý tưởng" cho hầu hết người đi làm.',
      'Mức 90–120 phút (Nâng cao): Thêm accessory work sau main lift, hoặc kết hợp sức mạnh + cardio LISS (low-intensity steady-state). Cần thêm dinh dưỡng trong/sau buổi tập.',
      'Mức 180 phút (Chuyên sâu): Phù hợp vận động viên hoặc ngày tập đặc biệt. Cần đặc biệt chú ý hydration, intra-workout nutrition (carbs trong buổi), và recovery sau đó.',
    ],
    points: [
      { icon: '⚡', label: '20 phút là đủ', note: 'Full-body circuit có cấu trúc không kém 1 giờ' },
      { icon: '📅', label: '8 mức = 8 lịch sẵn sàng', note: 'Luôn có kế hoạch dù thời gian khác nhau' },
      { icon: '🎯', label: '60 phút = lý tưởng', note: 'Đủ cho buổi tập đầy đủ không cần ép thời gian' },
      { icon: '🚫', label: 'Không có "quá bận"', note: 'Chỉ có "chưa có kế hoạch cho buổi ngắn"' },
    ],
  },
  {
    icon: '💡', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Chi Tiết Từng Phút — Không Còn "Không Biết Tập Gì"',
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người tập với kế hoạch cụ thể từng phút hoàn thành 94% volume dự định. Người tập không có kế hoạch chi tiết chỉ hoàn thành 67% — bỏ bài, rút ngắn set, nghỉ quá lâu giữa các bài.',
    detail: 'Kế hoạch "từng phút" không có nghĩa là cứng nhắc — nó có nghĩa là biết chính xác sẽ làm gì trong mỗi giai đoạn. Sự rõ ràng này loại bỏ hoàn toàn "dead time" (thời gian lãng phí do do dự) trong buổi tập.',
    details: [
      'Dead time trong buổi tập: Thời gian do dự giữa các bài, quyết định set tiếp theo, tìm kiếm thiết bị. Khảo sát phòng gym cho thấy dead time chiếm 20–35% thời gian ở phòng gym không có kế hoạch.',
      'Rest timer vs. feel: Nghỉ theo cảm giác thường dài hơn 40% so với cần thiết. Timer 60–90 giây cho hypertrophy, 3–5 phút cho strength max effort. Cụ thể hóa = hiệu quả hơn.',
      'Bài tập theo thứ tự ưu tiên: Tập bài quan trọng nhất đầu tiên khi energy cao nhất. Accessory work sau cùng. Nếu buổi bị cắt ngắn, đã hoàn thành phần quan trọng nhất.',
      'Superset và giant set: Ghép 2–3 bài không cùng nhóm cơ chính liên tiếp (ví dụ: squat + pull-up + plank). Tăng density (volume/thời gian) mà không tăng total thời gian buổi tập.',
      'Tracking đơn giản: Ghi ngay sau mỗi set (bài, reps, tạ). 2–3 phút/buổi. Giúp quyết định nhanh set tiếp theo và xây dựng progression logic cho buổi sau.',
      'Adaptive planning: Kế hoạch "từng phút" không phải không thể thay đổi — nó là điểm xuất phát. Điều chỉnh khi cần (mệt hơn dự kiến, thiếu thiết bị) nhưng không phá vỡ cấu trúc tổng thể.',
    ],
    points: [
      { icon: '✅', label: '94% vs 67%', note: 'Hoàn thành volume với/không có kế hoạch chi tiết' },
      { icon: '⏱️', label: 'Rest timer', note: '60–90" cho hypertrophy · 3–5\' cho max strength' },
      { icon: '🔝', label: 'Ưu tiên bài đầu', note: 'Quan trọng nhất trước khi energy giảm' },
      { icon: '📝', label: 'Track 2–3 phút/buổi', note: 'Đủ để progressive overload diễn ra nhất quán' },
    ],
  },
  // ── Tab 2: Nhịp Tuần (teal) ─────────────────────────────────────────────────
  {
    icon: '🗓', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: '3 Giai Đoạn Nhịp Tuần — Từ Bắt Đầu Đến Cá Nhân Hóa',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'General Adaptation Syndrome (GAS, Selye 1950): cơ thể phản ứng với stress theo 3 giai đoạn — Alarm (sốc) → Resistance (thích nghi) → Exhaustion (kiệt sức nếu không nghỉ). Nhịp tuần theo 3 giai đoạn phản ánh đúng chu trình sinh lý này.',
    detail: '3 giai đoạn nhịp tuần không phải tùy ý đặt ra — chúng phản ánh cách cơ thể học thích nghi với tải trọng tập luyện theo thời gian. Bỏ qua giai đoạn nào cũng dẫn đến chấn thương hoặc không đạt kết quả.',
    details: [
      'Giai đoạn 1 — Bắt đầu (Tuần 1–4): 3 buổi/tuần, cường độ thấp-vừa, tập trung vào học kỹ thuật. Mục tiêu: tạo thói quen, không phải fitness. Không cần tập đến "thất bại cơ bắp" (failure).',
      'Giai đoạn 2 — Xây nền (Tuần 5–12): 4 buổi/tuần, tăng volume và cường độ có kiểm soát. Đây là giai đoạn tăng cơ/giảm mỡ chính — cơ thể đang thích nghi nhanh nhất.',
      'Giai đoạn 3 — Nâng cao (Tuần 13+): 5–6 buổi/tuần, cá nhân hóa theo mục tiêu cụ thể. Chỉ vào giai đoạn này khi nền đã xây đủ vững — không có shortcut.',
      'Deload tuần: Sau mỗi 4–6 tuần tăng volume, 1 tuần giảm 40–50% cường độ. Supercompensation xảy ra trong tuần deload này — thực ra đây là tuần tăng mạnh nhất về mặt sinh lý.',
      'Tại sao 3 giai đoạn không thể bỏ qua: Bắt đầu thẳng vào giai đoạn 3 (5–6 buổi/tuần) = overuse injury trong 4–8 tuần. Thống kê ACSM: 70% người tập quá nhiều quá sớm bị chấn thương trong 3 tháng đầu.',
      'Chuyển tiếp giai đoạn: Không có ngày cụ thể để "lên giai đoạn mới" — dựa vào tín hiệu cơ thể: recovery tốt (không đau kéo dài), hiệu suất ổn định, ngủ tốt, mood ổn.',
    ],
    points: [
      { icon: '🌱', label: 'Giai đoạn 1: Thói quen', note: 'Học kỹ thuật + tạo habit — chưa phải fitness' },
      { icon: '💪', label: 'Giai đoạn 2: Xây nền', note: 'Tuần 5–12: tăng cơ/giảm mỡ nhanh nhất' },
      { icon: '🎯', label: 'Giai đoạn 3: Cá nhân hóa', note: 'Tuần 13+: tối ưu cho mục tiêu riêng' },
      { icon: '🔄', label: 'Deload = tuần mạnh nhất', note: 'Supercompensation xảy ra trong tuần nghỉ bớt' },
    ],
  },
  {
    icon: '🎯', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: '6 Lộ Trình Theo Mục Tiêu — Tìm Nhịp Tập Phù Hợp Nhất Với Bạn',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: '"One size fits all" không tồn tại trong tập luyện. 6 lộ trình được thiết kế cho 6 profile khác nhau về mục tiêu, thời gian có, và điểm xuất phát. Chọn nhầm lộ trình = không đạt kết quả dù cố gắng nhiều.',
    detail: 'Nhiều người thất bại không phải vì thiếu kỷ luật — mà vì đang đi theo lộ trình không phù hợp với hoàn cảnh của họ. Người mới đi theo lịch của vận động viên chuyên nghiệp, hoặc người bận rộn cố duy trì lịch 6 buổi/tuần — đều không bền vững.',
    details: [
      'Lộ trình 1 — Siêu bận (2 buổi/tuần): Full-body mỗi buổi, 45 phút, 4–5 bài compound. Đủ để duy trì cơ bắp và sức khỏe tổng thể. Phù hợp: người làm việc >50h/tuần hoặc có trách nhiệm gia đình lớn.',
      'Lộ trình 2 — Bắt đầu (3 buổi/tuần): A/B alternating (Full-body A và Full-body B xen kẽ). Hiệu quả nhất cho người mới vì tần suất đủ cao để học kỹ thuật mà không quá tải.',
      'Lộ trình 3 — Phổ biến (4 buổi/tuần): Upper/Lower split. 2 ngày upper, 2 ngày lower. Đủ để tiến bộ rõ rệt và đủ nghỉ giữa các buổi. Phù hợp: hầu hết người không phải chuyên nghiệp.',
      'Lộ trình 4 — Nâng cao (5 buổi/tuần): Push/Pull/Legs hoặc Upper-Lower-Full. Cần nền tảng kỹ thuật tốt và khả năng phục hồi cao. Không phù hợp cho người đang stress cao hay ngủ kém.',
      'Lộ trình 5 — Chuyên sâu (6 buổi/tuần): Tập từng nhóm cơ riêng (bro split) hoặc Daily Undulating Periodization. Cần kinh nghiệm 12+ tháng và điều kiện dinh dưỡng-ngủ nghỉ tối ưu.',
      'Lộ trình 6 — Vận động viên (6 buổi + cardio phụ): Kết hợp strength training, sport-specific cardio, và mobility work. Không phải mục tiêu của hầu hết người — nhưng để biết tiềm năng phát triển.',
    ],
    points: [
      { icon: '🏃', label: 'Lộ trình 1–2: Bắt đầu', note: '2–3 buổi/tuần cho người mới và bận rộn' },
      { icon: '💪', label: 'Lộ trình 3: Sweet spot', note: '4 buổi/tuần phổ biến nhất, kết quả tốt nhất' },
      { icon: '🔑', label: 'Chọn dựa trên thực tế', note: 'Nhịp duy trì được > nhịp lý tưởng không duy trì' },
      { icon: '📈', label: 'Tăng dần từ ít', note: 'Ổn định 4 tuần rồi thêm 1 buổi — không nhảy cóc' },
    ],
  },
  {
    icon: '😴', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Nghỉ Đúng Cách — Phục Hồi Là Phần Thiết Yếu, Không Phải Lười Biếng',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ bắp không mạnh lên trong buổi tập — mà trong thời gian nghỉ sau đó. Ngày nghỉ không phải ngày "không làm gì" — mà là ngày cơ thể thực sự xây dựng những gì bạn kích thích trong buổi tập.',
    detail: 'Văn hóa "no pain no gain" và "rest is for the weak" đã gây hại cho hàng triệu người tập. Nghỉ ngơi đủ không phải dấu hiệu yếu đuối — nó là kỹ năng training thiết yếu của vận động viên chuyên nghiệp.',
    details: [
      'Active recovery vs. passive rest: Ngày nghỉ không có nghĩa là nằm im. Đi bộ 20–30 phút, yoga nhẹ, bơi nhẹ ở cường độ thấp (<60% max HR) thực ra tăng tốc phục hồi bằng cách tăng blood flow mà không tạo thêm tải.',
      'Sleep là recovery tool số 1: GH (growth hormone) tiết 70–80% trong giai đoạn slow-wave sleep. Thiếu ngủ 1 giờ = giảm MPS 18–21% và tăng cortisol. Không có supplement nào bù được thiếu ngủ.',
      'Nutrition trong ngày nghỉ: Không cần giảm protein ngày nghỉ — muscle protein synthesis vẫn xảy ra 24–48h sau tập. Carbs có thể giảm nhẹ nhưng đừng cắt hoàn toàn — glycogen cần được tái nạp.',
      'HRV (Heart Rate Variability): Metric đơn giản nhất để đo recovery. HRV cao sáng dậy = phục hồi tốt. HRV thấp nhiều ngày liên tiếp = cần thêm rest hoặc giảm cường độ. Nhiều smartwatch đo được.',
      'Resting Heart Rate trend: Nếu RHR tăng 5–10 BPM so với baseline liên tục 3+ ngày — đây là tín hiệu overtraining. Cần 1–2 ngày nghỉ thêm hoặc giảm volume 40–50%.',
      'Psychological recovery: Ngày nghỉ cũng là recovery tâm lý. Buổi tập mỗi ngày mà không hứng thú, phải ép bản thân — đây là dấu hiệu cần nghỉ dù cơ thể "không đau". Motivation burnout thường đến trước physical burnout.',
    ],
    points: [
      { icon: '🏃', label: 'Active recovery tốt hơn', note: 'Đi bộ nhẹ > nằm im trong ngày nghỉ' },
      { icon: '😴', label: 'Sleep = GH +70–80%', note: 'Không supplement nào bù được thiếu ngủ' },
      { icon: '💓', label: 'HRV theo dõi recovery', note: 'Smartwatch đo được — HRV cao = đã phục hồi' },
      { icon: '🧠', label: 'Psychological burnout trước', note: 'Mất motivation là tín hiệu sớm hơn physical pain' },
    ],
  },
  // ── Tab 3: Bậc Thang Tiến Bộ (purple) ─────────────────────────────────────
  {
    icon: '🪜', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Bậc Thang Rõ Ràng — Biết Chính Xác Bước Tiếp Theo Là Gì',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thiếu rõ ràng về "bước tiếp theo" là nguyên nhân số 1 khiến người tập bỏ cuộc (IHRSA 2019). Không phải lười biếng, không phải thiếu thời gian — mà là "tôi không biết mình cần làm gì tiếp".',
    detail: 'Bậc thang tiến bộ không phải danh hiệu hay cuộc cạnh tranh. Nó là hệ thống định vị — giúp bạn biết hiện đang ở đâu, cần gì để tiến lên, và bước tiếp theo trông như thế nào cụ thể.',
    details: [
      'Vấn đề của "tập tự do": Không có tiêu chí rõ ràng = không biết bao giờ đã "đủ tốt". Tập mà không biết mình tiến bộ hay không = mất động lực sau 4–8 tuần.',
      '5 bậc rõ ràng với tiêu chí cụ thể: Bậc 1 (đi bộ 30\'/ngày) → Bậc 2 (push-up 10, plank 30") → Bậc 3 (squat BW, 2km chạy) → Bậc 4 (squat 1.5BW, 5km <30\') → Bậc 5 (vận động viên).',
      'Tại sao 5 bậc, không phải nhiều hơn: Đủ granular để biết mình đang ở đâu, không quá nhiều đến mức gây overwhelm. 5 bậc cũng phù hợp với khoảng thời gian 1–5 năm tập luyện nghiêm túc.',
      'Test vào đúng bậc: Đánh giá bản thân dựa trên tiêu chí khách quan (reps, thời gian, tải trọng), không dựa trên cảm giác. Nhiều người overestimate hoặc underestimate bậc của mình.',
      'Phần thưởng khi lên bậc: Thêm loại bài tập mới (unilateral, olympic lifting), tăng tần suất tập, hoặc thêm cardio chuyên biệt. Mỗi bậc mở ra khả năng mới — đây là dynamic phần thưởng.',
      'Không so sánh với người khác: Bậc thang là cá nhân — dựa trên baseline của bạn, không phải benchmark của người khác. Người 50 tuổi ở Bậc 3 tốt hơn nhiều so với người 20 tuổi ở Bậc 3 nhưng đang plateau.',
    ],
    points: [
      { icon: '🗺️', label: 'Định vị rõ ràng', note: 'Biết đang ở đâu = giảm 70% khả năng bỏ cuộc' },
      { icon: '✅', label: 'Tiêu chí khách quan', note: 'Reps · Thời gian · Tải trọng — không phải cảm giác' },
      { icon: '🏆', label: 'Phần thưởng khi lên bậc', note: 'Mỗi bậc mở ra khả năng và bài tập mới' },
      { icon: '🚫', label: 'Không so sánh', note: 'Bậc thang cá nhân — baseline riêng của bạn' },
    ],
  },
  {
    icon: '🎯', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Test Định Kỳ 3 Kỳ — Tuần 4, 8 Và 12 Là Mốc Quan Trọng',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không đo không cải thiện (Peter Drucker). 3 kỳ test trong 12 tuần đầu cho phép điều chỉnh kế hoạch dựa trên dữ liệu thực — không phải cảm giác. Người có lịch test cụ thể đạt mục tiêu 2.5× hiệu quả hơn.',
    detail: '3 kỳ test không phải để kiểm tra mà để điều chỉnh. Tuần 4 cho biết kế hoạch có phù hợp không. Tuần 8 cho thấy progression rate. Tuần 12 đánh giá tổng thể và lập kế hoạch giai đoạn tiếp theo.',
    details: [
      'Tuần 4 test — Calibration: Sau 4 tuần, cơ thể đã vượt qua giai đoạn neural adaptation ban đầu. Test này cho biết kế hoạch có phù hợp (đang tiến bộ) hay cần điều chỉnh (không tiến bộ đáng kể).',
      'Tuần 8 test — Trend analysis: So sánh với tuần 4. Nếu tiến bộ >10% = kế hoạch đang hoạt động tốt. Nếu <5% = cần xem lại dinh dưỡng và ngủ. Nếu hiệu suất giảm = overtraining.',
      'Tuần 12 test — Full evaluation: Đánh giá toàn diện tất cả 4 chiều (sức mạnh, sức bền, linh hoạt, phục hồi). Kết quả này làm nền tảng để thiết kế kế hoạch 12 tuần tiếp theo.',
      'Test đúng ngày: Không test sau buổi tập nặng, không test khi mệt hay ốm, không test sau đêm ngủ kém. Điều kiện nhất quán cho phép so sánh chính xác giữa các kỳ.',
      'Điều chỉnh dựa trên test: Tuần 4 test kém → tăng protein hoặc ngủ thêm trước khi thay đổi volume. Tuần 8 test tốt → tăng thêm 5–10% volume. Không thay đổi nhiều thứ cùng lúc.',
      'Tạo ritual: Biến ngày test thành một nghi thức — cùng thời điểm, cùng warm-up, cùng âm nhạc nếu có. Ritual giúp tâm lý vào đúng trạng thái và kết quả nhất quán hơn.',
    ],
    points: [
      { icon: '📅', label: 'Tuần 4: Calibration', note: 'Kế hoạch có phù hợp không? Điều chỉnh sớm nếu cần' },
      { icon: '📈', label: 'Tuần 8: Trend', note: '>10% tiến bộ = đang đi đúng hướng' },
      { icon: '🏁', label: 'Tuần 12: Full eval', note: 'Nền tảng cho kế hoạch 12 tuần tiếp theo' },
      { icon: '🎭', label: 'Tạo ritual test', note: 'Cùng điều kiện mỗi lần = kết quả đáng tin cậy' },
    ],
  },
  {
    icon: '📊', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Radar Chart 4 Chiều — Sức Mạnh · Sức Bền · Linh Hoạt · Phục Hồi',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: '4 chiều không phải 4 bài test riêng lẻ — chúng là hệ thống đánh giá toàn diện sức khỏe thể chất. VO2 max (sức bền) là predictor số 1 của tuổi thọ theo nghiên cứu JAMA 2018 với 122.000 người.',
    detail: 'Fitness không phải một chiều tuyến tính. Người mạnh nhất chưa chắc khỏe nhất. Người dẻo dai chưa chắc phục hồi tốt. Radar chart 4 chiều là cách đơn giản nhất để thấy "bức tranh toàn diện" về sức khỏe thể chất.',
    details: [
      'Chiều 1 — Sức mạnh: Đo ability to produce force. Test đơn giản: push-up max reps, squat 5RM, deadlift 3RM. Sức mạnh là nền tảng — thiếu sức mạnh = giới hạn tất cả các chiều khác.',
      'Chiều 2 — Sức bền (Cardiovascular): VO2 max là gold standard nhưng khó đo. Thay thế: thời gian chạy 1.5km, beep test, hoặc 12-minute Cooper test. VO2 max là predictor mạnh nhất của tử vong tim mạch và tuổi thọ.',
      'Chiều 3 — Linh hoạt (Mobility): Không phải mềm dẻo như vũ công — mà là đủ range of motion để thực hiện các mẫu chuyển động cơ bản an toàn. Test: overhead squat, hip flexor length, shoulder mobility.',
      'Chiều 4 — Phục hồi: Tổng hợp của HRV trend, resting heart rate, chất lượng giấc ngủ (PSQI score), và thời gian để không còn DOMS sau buổi tập chuẩn. Chiều này cải thiện khi 3 chiều kia được cân bằng.',
      'Asymmetry là warning sign: Nếu một chiều thấp hơn các chiều khác >30% → ưu tiên cải thiện chiều đó trong giai đoạn tiếp theo. Đừng cố tối ưu điểm mạnh khi có điểm yếu rõ ràng.',
      'Cách vẽ radar chart: Cho mỗi chiều điểm từ 1–10 dựa trên tiêu chí của bậc thang (Bậc 1 = 2 điểm, Bậc 2 = 4 điểm, v.v.). Vẽ lên 4 trục và nối thành hình tứ giác. Mục tiêu: hình tứ giác đều, không phải hình không đều có một góc nhọn.',
    ],
    points: [
      { icon: '❤️', label: 'VO2 max = tuổi thọ', note: 'JAMA 2018: 122.000 người — predictor số 1' },
      { icon: '⚠️', label: 'Asymmetry = danger', note: '>30% chênh lệch = ưu tiên cải thiện chiều yếu' },
      { icon: '📐', label: 'Điểm 1–10 mỗi chiều', note: 'Dựa trên tiêu chí bậc thang — khách quan' },
      { icon: '🎯', label: 'Hình tứ giác đều', note: 'Không cần điểm cao — cần cân bằng giữa 4 chiều' },
    ],
  },
];

// DETAIL_MODALS[tabIdx * 3 + detailIdx] — separate from TABS to survive i18n merge
const DETAIL_MODALS = [
  // ── Tab 0: 6 Mẫu Vận Động (green) ──────────────────────────────────────────
  {
    icon: '🦴', color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Tại Sao Chỉ 6 Mẫu? — Sinh Cơ Học Sau Hàng Nghìn Bài Tập',
    img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Các nhà sinh cơ học phân tích > 3.000 bài tập và phát hiện tất cả đều là biến thể của 6 mẫu chuyển động cơ bản. Thành thạo 6 mẫu = nền tảng cho 95% mọi bài tập trong cuộc đời.',
    detail: 'Bộ khung 6 mẫu không phải do ai tùy tiện đặt ra — đây là kết quả phân tích sinh cơ học từ hàng nghìn bài tập khác nhau. Mỗi mẫu đại diện cho một chuỗi khớp-cơ phối hợp theo cách mà cơ thể người được tiến hóa thiết kế.',
    details: [
      'Squat (gập khuỵu): Khớp hông + gối + mắt cá gập đồng thời — kích hoạt 60–70% khối lượng cơ toàn thân, quan trọng nhất cho sức mạnh hạ thể.',
      'Hip Hinge (bản lề hông): Gập hông giữ lưng thẳng — nền tảng của deadlift, Romanian DL, kettlebell swing. Cơ mông và gân kheo phát triển tối đa.',
      'Push (đẩy): Từ push-up sàn đến overhead press — phát triển cơ ngực, vai, tricep theo trục ngang và dọc.',
      'Pull (kéo): Từ band pull đến pull-up — cân bằng với mẫu đẩy, phát triển lưng, bicep, rhomboid. Giảm nguy cơ vẹo vai do tập đẩy quá nhiều.',
      'Carry (gánh): Đi với tải trọng — kích hoạt core 360°, cải thiện tư thế, bắt chước chuyển động chức năng trong cuộc sống thực.',
      'Core & Breath (chống xoay/sụp): Plank, dead bug, pallof press — không phải sit-up, mà là chống lại chuyển động không mong muốn. Thở là điều kiện nền của mọi mẫu khác.',
    ],
    points: [
      { icon: '🎯', label: 'Bao phủ toàn thân', note: '6 mẫu = 100% cơ bắp chính được kích hoạt cân bằng' },
      { icon: '♾️', label: 'Vô số biến thể', note: 'Mỗi mẫu có 5–15+ biến thể từ dễ đến rất khó' },
      { icon: '🛡️', label: 'An toàn lâu dài', note: 'Không có điểm yếu cấu trúc nào bị bỏ qua' },
      { icon: '🧠', label: 'Dễ nhớ, dễ áp dụng', note: 'Tự thiết kế buổi tập chỉ cần 1 bài mỗi mẫu' },
    ],
  },
  {
    icon: '🔄', color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Biến Thể Không Giới Hạn — Cùng Mẫu, Vô Số Cấp Độ Tiến Bộ',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mỗi mẫu có phổ từ cực dễ đến cực khó trong cùng một chuỗi tiến bộ. Không cần đổi bài tập — chỉ cần đi lên trên phổ đó khi đã sẵn sàng.',
    detail: 'Sai lầm phổ biến nhất trong tập luyện là đổi bài tập liên tục thay vì tiến sâu vào một mẫu. Squat vào ghế → goblet squat → barbell squat → pistol squat: đây là cùng một mẫu, bốn cấp độ khác nhau.',
    details: [
      'Hồi quy (regression): Mọi mẫu đều có phiên bản siêu dễ cho người mới, người phục hồi chấn thương, hoặc ngày mệt mỏi. Không bao giờ "không có bài để tập".',
      'Tiến bộ (progression): Thêm tải trọng, giảm hỗ trợ, tăng biên độ, thay đổi tempo — 4 trục tiến bộ cho mỗi mẫu mà không cần mua thêm thiết bị.',
      'Unilateral (một chân/tay): Pistol squat, single-leg RDL, archer push-up — tăng độ khó gấp đôi mà không cần tạ nặng hơn. Phát hiện mất cân bằng hai bên.',
      'Tempo: Eccentric 4 giây thay vì 1 giây tăng thời gian căng cơ (TUT) 300–400%. Cùng trọng lượng, khó hơn rất nhiều, tăng cơ hiệu quả hơn.',
      'Môi trường: Cát, sàn không bằng phẳng, túi cát thay barbell — thay đổi yếu tố ổn định mà không thay đổi mẫu cơ bản.',
      'Khả năng chuyển hóa: Thành thạo goblet squat → barbell squat dễ hơn; thành thạo push-up → bench press ngay lập tức. Mẫu giống nhau, công cụ khác nhau.',
    ],
    points: [
      { icon: '📈', label: 'Tiến bộ rõ ràng', note: 'Biết chính xác bước tiếp theo cần làm' },
      { icon: '🏠', label: 'Không cần thiết bị', note: 'Bodyweight đủ để đạt cấp độ trung-cao' },
      { icon: '🔧', label: '4 trục tiến bộ', note: 'Tải · Hỗ trợ · Biên độ · Tempo' },
      { icon: '⚡', label: 'Nhất quán dài hạn', note: 'Không bao giờ nhàm chán khi có phổ tiến bộ rõ' },
    ],
  },
  {
    icon: '⚖️', color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Cân Bằng Cơ Thể Toàn Diện — Thiết Kế Không Có Điểm Yếu',
    img: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hầu hết chấn thương thể thao không phải do yếu — mà do mất cân bằng. Push quá nhiều mà không Pull đủ → đau vai. Squat nhiều mà không Hinge đủ → đau lưng dưới.',
    detail: 'Cơ thể người được tiến hóa thiết kế cho 6 chuyển động này theo tỉ lệ cân bằng. Khi tập quá nhiều một mẫu và bỏ qua mẫu đối xứng, mất cân bằng cơ lực xuất hiện và chấn thương chỉ là vấn đề thời gian.',
    details: [
      'Push + Pull: Tỉ lệ 1:1 giữa thể tích đẩy và kéo giảm 60% nguy cơ đau vai. Nhiều gym-goer đẩy 3× nhiều hơn kéo — đây là lý do phổ biến nhất của rotator cuff injury.',
      'Squat + Hinge: Squat phát triển quad (trước đùi), Hinge phát triển glute/hamstring (sau đùi). Tỉ lệ quad:hamstring chuẩn là 3:2; mất cân bằng → knee injury.',
      'Bilateral + Unilateral: Barbell squat tốt cho sức mạnh, nhưng single-leg squat phát hiện mất cân bằng hai bên. Thêm ít nhất 1 bài unilateral mỗi mẫu mỗi tuần.',
      'Core anti-movement: Cột sống không được thiết kế để uốn cong dưới tải — mà để chống lại chuyển động không mong muốn. Plank tốt hơn crunch cho sức khỏe lưng.',
      'Breath dưới áp lực: Valsalva maneuver khi nâng tạ nặng bảo vệ cột sống. Thở không tốt = core không ổn định = tải gây hại lên đĩa đệm.',
      'Tỉ lệ tập tuần gợi ý: 2× squat + 2× hinge + 2× push + 2× pull + 2× carry + daily core/breath = không có điểm yếu cấu trúc.',
    ],
    points: [
      { icon: '🛡️', label: 'Phòng chấn thương', note: 'Cân bằng push/pull giảm 60% nguy cơ đau vai' },
      { icon: '💪', label: 'Phát triển toàn diện', note: 'Không có nhóm cơ nào bị bỏ sót' },
      { icon: '🦵', label: 'Squat/Hinge cân bằng', note: 'Quad:hamstring = 3:2 là tỉ lệ khỏe mạnh' },
      { icon: '🌬️', label: 'Breath là nền tảng', note: 'Thở đúng bảo vệ cột sống dưới mọi tải trọng' },
    ],
  },
  // ── Tab 1: Khung Ngày Tập (orange) ─────────────────────────────────────────
  {
    icon: '🧠', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Não Bộ Cần Cấu Trúc — Quyết Định Ít Hơn, Tập Tốt Hơn',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nghiên cứu Baumeister (1998) về "decision fatigue" cho thấy mỗi quyết định nhỏ tiêu hao willpower. Người có lịch tập cấu trúc duy trì nhất quán 62% vs 23% ở nhóm không có lịch (Annesi, 2003).',
    detail: 'Khi vào phòng gym mà không biết sẽ làm gì, não bộ tốn năng lượng để quyết định liên tục: tập gì, bao nhiêu set, nghỉ bao lâu. Năng lượng đó đáng lẽ dùng để tập tốt hơn. Cấu trúc xóa bỏ hoàn toàn vấn đề này.',
    details: [
      'Decision fatigue trong tập luyện: Mỗi lần quyết định "tập gì tiếp theo" giữa chừng, chất lượng quyết định giảm. Kết quả: tập tắt dần về cuối buổi, bỏ bài khó, rút ngắn thời gian.',
      'Lịch cấu trúc → automatic execution: Khi biết chính xác sẽ làm gì, não chuyển sang "auto-pilot". Chất lượng kỹ thuật và cường độ đều tăng vì não không phải lo lên kế hoạch.',
      'Giảm barrier to start: "Tôi sẽ làm A → B → C" dễ bắt đầu hơn "tôi sẽ tập gì hôm nay". Rào cản bắt đầu thấp = ít bỏ buổi hơn.',
      'Habit stacking: Cấu trúc cho phép gắn tập luyện vào thói quen đã có. "Sau khi ăn tối → khởi động 5 phút" dễ duy trì hơn "tối nay sẽ tập lúc nào đó".',
      'Linh hoạt trong cấu trúc: Có 45 phút thay vì 60 phút? Cắt thời gian từng khối theo tỉ lệ. Bộ khung vẫn giữ nguyên — nội dung linh hoạt theo.',
      'Long-term adherence: Nghiên cứu 12 tháng (Conn et al., 2011) cho thấy nhóm có cấu trúc duy trì được 68% buổi, vs 34% nhóm không có kế hoạch rõ ràng.',
    ],
    points: [
      { icon: '🧠', label: 'Ít quyết định hơn', note: 'Auto-pilot = chất lượng tập cao hơn' },
      { icon: '📈', label: '62% vs 23%', note: 'Tỉ lệ duy trì nhất quán có/không có lịch' },
      { icon: '🚀', label: 'Dễ bắt đầu hơn', note: 'Rào cản thấp khi đã biết chính xác sẽ làm gì' },
      { icon: '🔄', label: 'Linh hoạt thông minh', note: 'Cấu trúc co giãn theo thời gian có, không xóa bỏ' },
    ],
  },
  {
    icon: '⚡', color: '#f97316', rgb: '249,115,22',
    modalTitle: '4 Khối Thời Gian — Cấu Trúc Vạn Năng Từ 20 Đến 180 Phút',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: '4 khối (Khởi động → Vận động chính → Giãn cơ → Tĩnh tâm) phục vụ 4 chức năng sinh lý khác nhau và không thể thay thế cho nhau. Cắt bỏ bất kỳ khối nào đều làm giảm hiệu quả và tăng rủi ro.',
    detail: 'Mỗi khối không phải tùy tiện — chúng phục vụ một chức năng sinh lý cụ thể. Khởi động kích hoạt hệ thần kinh-cơ. Vận động chính tạo kích thích tăng trưởng. Giãn cơ hỗ trợ phục hồi. Tĩnh tâm điều chỉnh thần kinh tự chủ.',
    details: [
      'Khởi động (5–10 phút): Tăng nhiệt độ cơ bắp 1–2°C, tăng độ nhớt dầu khớp, kích hoạt dẫn truyền thần kinh-cơ. Bỏ qua khởi động = giảm 15–20% sức mạnh đỉnh và tăng nguy cơ chấn thương gân.',
      'Vận động chính (10–150 phút): Phần cốt lõi — sức mạnh, cardio, hoặc kết hợp. Đây là khối duy nhất có thể mở rộng/thu ngắn linh hoạt theo thời gian có.',
      'Giãn cơ (5–10 phút): Static stretch sau tập giảm DOMS 20–40%. Thời gian giữ tối thiểu 30 giây/tư thế để có hiệu quả thực sự — ngắn hơn không tính.',
      'Tĩnh tâm (5 phút): Cyclic sighing kích hoạt hệ phó giao cảm, giảm cortisol, chuẩn bị não cho phần còn lại của ngày. Không phải tùy chọn — là đầu tư phục hồi tốt nhất.',
      'Khi cắt ngắn buổi tập: Ưu tiên giữ khởi động + tĩnh tâm nguyên vẹn. Cắt từ vận động chính. Buổi 20 phút: 5\' + 10\' + 3\' + 2\' — vẫn đủ 4 khối.',
      'Linh hoạt thứ tự trong khối vận động chính: Sức mạnh trước cardio nếu mục tiêu tăng cơ. Cardio trước sức mạnh nếu mục tiêu sức bền tim mạch. 4 khối không đổi, nội dung trong khối linh hoạt.',
    ],
    points: [
      { icon: '🔥', label: 'Khởi động không thể bỏ', note: '+15–20% sức mạnh đỉnh, -30% nguy cơ chấn thương' },
      { icon: '⚡', label: 'Vận động chính', note: 'Khối duy nhất linh hoạt hoàn toàn về thời gian' },
      { icon: '🧘', label: 'Giãn cơ có hiệu quả', note: '≥30 giây/tư thế để giảm DOMS thực sự' },
      { icon: '🌙', label: 'Tĩnh tâm là đầu tư', note: '5 phút = phục hồi tốt hơn cho 23 giờ còn lại' },
    ],
  },
  {
    icon: '🌙', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Tĩnh Tâm 5 Phút — Cortisol, Phục Hồi Và Giấc Ngủ Tốt Hơn',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nghiên cứu Stanford (Spiegel et al., 2023) cho thấy cyclic sighing giảm cortisol 15% và cải thiện positive affect nhiều hơn mindfulness meditation hoặc box breathing trong 5 phút thực hành.',
    detail: '5 phút sau tập là thời điểm cortisol đang cao. Nếu bạn chạy ra ngoài ngay, mức cortisol cao này theo bạn vào phần còn lại của ngày, ảnh hưởng đến giấc ngủ tối và phục hồi cơ bắp.',
    details: [
      'Cortisol sau tập: Exercise là stress tốt (eustress), nhưng cortisol tăng trong và sau tập. Không giảm đúng cách → khó ngủ tối, cơ bắp phục hồi chậm hơn.',
      'Cyclic sighing: Hít vào mũi đầy → hít thêm một hơi ngắn bằng mũi → thở ra dài và chậm bằng miệng. Lặp 5–10 lần. Kích hoạt phó giao cảm nhanh hơn bất kỳ kỹ thuật thở nào khác.',
      'Box breathing (4-4-4-4): Thay thế tốt nếu không quen cyclic sighing. Hít 4 giây → giữ 4 → thở ra 4 → giữ 4. Dùng nhiều bởi lính đặc nhiệm để giảm cortisol trước/sau nhiệm vụ.',
      'Không nằm xuống: Ngồi hoặc đứng, mắt nhắm hoặc nhìn điểm cố định. Nằm xuống có thể dẫn đến ngủ thiếp đi, phá vỡ lịch ngủ tối.',
      'Cải thiện giấc ngủ: Người tập buổi tối + 5 phút tĩnh tâm ngủ sâu hơn 18% so với nhóm dừng tập đột ngột. Melatonin không bị cortisol ức chế.',
      'Tích lũy theo thời gian: Nhóm thực hành 5 phút tĩnh tâm sau tập liên tục 8 tuần có mức cortisol baseline thấp hơn 12% và self-reported stress thấp hơn đáng kể.',
    ],
    points: [
      { icon: '📉', label: 'Cortisol -15%', note: 'Cyclic sighing hiệu quả nhất trong 5 phút' },
      { icon: '😴', label: 'Ngủ sâu hơn 18%', note: 'Nhất là khi tập buổi tối' },
      { icon: '💪', label: 'Phục hồi cơ tốt hơn', note: 'Cortisol thấp = GH cao hơn khi ngủ sâu' },
      { icon: '🧠', label: 'Calm ≠ weakness', note: 'Tĩnh tâm là kỹ năng, không phải dấu hiệu yếu đuối' },
    ],
  },
  // ── Tab 2: Nhịp Tuần (teal) ─────────────────────────────────────────────────
  {
    icon: '🔬', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Cửa Sổ Phục Hồi 48–72 Giờ — Cơ Thể Mạnh Khi Nghỉ, Không Khi Tập',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Muscle Protein Synthesis (MPS) đạt đỉnh 24–36 giờ sau tập và trở về baseline sau 48–72 giờ. Tập lại cùng nhóm cơ trong 24 giờ = phá vỡ quá trình tái tạo. Tập lại sau 72 giờ = bỏ lỡ window tăng trưởng.',
    detail: 'Nghịch lý của tập luyện là cơ bắp không mạnh lên trong buổi tập — mà trong thời gian nghỉ ngơi sau đó. Buổi tập tạo ra "vết nứt" vi mô trong sợi cơ. Cơ thể sửa chữa những vết nứt này to hơn và mạnh hơn — nhưng chỉ khi được cho đủ thời gian.',
    details: [
      'Muscle Protein Synthesis (MPS): Sau tập sức mạnh, MPS tăng 25–150% và duy trì 24–48 giờ. Đây là cửa sổ quan trọng nhất để protein từ bữa ăn được dùng cho tái tạo cơ.',
      'DOMS (Delayed Onset Muscle Soreness): Cơn đau nhức 24–72 giờ sau tập là dấu hiệu vi chấn thương đang được sửa chữa — không nguy hiểm, nhưng tập nặng lên cùng nhóm cơ khi đang DOMS sẽ làm chậm tái tạo.',
      'Glycogen resynthesis: Sau tập cardio cường độ cao, glycogen cơ cần 24–48 giờ để tái nạp đầy với chế độ ăn bình thường. Tập lại khi glycogen chưa đầy = hiệu suất kém và tốn nhiều cơ hơn làm nhiên liệu.',
      'CNS fatigue: Hệ thần kinh trung ương mệt mỏi sau buổi tập nặng. Không thể đo bằng cảm giác cơ bắp — ngay cả khi chân không đau, CNS có thể vẫn chưa phục hồi sau squat nặng.',
      'Growth hormone khi ngủ: GH tiết nhiều nhất trong giai đoạn ngủ sâu (slow-wave sleep), bị ức chế bởi cortisol cao. Nghỉ đủ và ngủ đủ là điều kiện thiếu yếu để MPS diễn ra tối đa.',
      'Nguyên tắc thiết kế nhịp tuần: Cùng nhóm cơ chính cách nhau ít nhất 48 giờ (tốt nhất 72 giờ). Upper/lower split xen kẽ thay vì liền kề. Active recovery ngày nghỉ — đi bộ, yoga nhẹ — không làm hỏng phục hồi nếu cường độ thấp.',
    ],
    points: [
      { icon: '🔬', label: 'MPS đỉnh 24–48h', note: 'Đây là khi protein từ bữa ăn được dùng nhiều nhất' },
      { icon: '⏱️', label: 'Nghỉ 48–72h', note: 'Cùng nhóm cơ — không sớm hơn, không muộn hơn' },
      { icon: '😴', label: 'GH khi ngủ sâu', note: 'Growth hormone chủ yếu tiết trong slow-wave sleep' },
      { icon: '🧠', label: 'CNS cũng mệt', note: 'Thần kinh trung ương phục hồi chậm hơn cơ bắp' },
    ],
  },
  {
    icon: '📈', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: '3 Giai Đoạn Thích Nghi — Tiến Bộ Bền Vững Không Burnout',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'SAID Principle (Specific Adaptation to Imposed Demand): cơ thể chỉ thích nghi với đúng loại kích thích được áp đặt. 3 giai đoạn thích nghi (thần kinh → cấu trúc → hiệu suất) xảy ra tuần tự, không thể bỏ qua.',
    detail: 'Một trong những sai lầm phổ biến nhất của người mới tập là tăng quá nhanh — thêm nhiều ngày tập, thêm volume, thêm cường độ — trước khi cơ thể đã hoàn thành giai đoạn thích nghi đầu tiên. Kết quả thường là chấn thương hoặc burnout.',
    details: [
      'Giai đoạn 1 — Neural (Tuần 1–4): Không phải cơ to lên mà não học cách tuyển dụng nhiều motor units hơn. Sức mạnh tăng 20–40% trong 4 tuần đầu = thần kinh tối ưu hóa, không phải hypertrophy.',
      'Giai đoạn 2 — Cấu trúc (Tuần 5–12): Bắt đầu hypertrophy thực sự — protein được thêm vào sợi cơ. Cần đủ protein (1.6–2.2g/kg/ngày) và ngủ đủ (7–9 tiếng) để giai đoạn này xảy ra.',
      'Giai đoạn 3 — Hiệu suất (Tuần 13+): Cơ thể đã có nền tảng → có thể tối ưu hóa cho mục tiêu cụ thể (sức mạnh tối đa, sức bền, tốc độ). Cá nhân hóa thực sự bắt đầu ở đây.',
      'Deload có cấu trúc: Sau 4–6 tuần tăng volume liên tục, 1 tuần giảm tải 40–50% cho phép supercompensation (phục hồi vượt mức). Không deload = nền hiệu suất giảm dần.',
      'Dấu hiệu overtraining: Hiệu suất giảm dù đang nghỉ đủ, nhịp tim nghỉ cao hơn bình thường 5–10 BPM, mood xấu liên tục, giấc ngủ kém mà không có nguyên nhân khác.',
      'Linear vs non-linear progression: Người mới → linear (thêm cùng tải mỗi tuần). Người trung cấp trở lên → non-linear (heavy/medium/light week xen kẽ). Không nhận ra sự chuyển tiếp này = plateau sớm.',
    ],
    points: [
      { icon: '🧠', label: 'Tuần 1–4: Neural', note: 'Não học, không phải cơ to — sức mạnh tăng 20–40%' },
      { icon: '💪', label: 'Tuần 5–12: Hypertrophy', note: 'Cơ trưởng thành với đủ protein + ngủ đủ' },
      { icon: '🎯', label: 'Tuần 13+: Cá nhân hóa', note: 'Nền đã có → tối ưu cho mục tiêu riêng' },
      { icon: '🔄', label: 'Deload là bắt buộc', note: '1 tuần giảm tải sau 4–6 tuần để supercompensate' },
    ],
  },
  {
    icon: '🎯', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Nhịp Tập Bền Vững — Nhịp Tốt Nhất Là Nhịp Duy Trì Được 12 Tháng',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: '"2 buổi/tuần × 12 tháng = 96 buổi" tốt hơn "6 buổi/tuần × 6 tuần = 36 buổi". Tổng volume tích lũy dài hạn, không phải cường độ ngắn hạn, quyết định kết quả thực sự.',
    detail: 'Fitness culture thường tôn vinh cường độ cao và tần suất tập nhiều. Nhưng nghiên cứu dài hạn nhất quán chỉ ra rằng biến số quan trọng nhất không phải cường độ — mà là consistency. Người tập đều 2 buổi/tuần trong 5 năm có kết quả tốt hơn người tập 5 buổi/tuần trong 6 tháng rồi bỏ.',
    details: [
      'Minimum Effective Dose (MED): 2 buổi sức mạnh/tuần đủ để duy trì và tăng cơ ở người không chuyên. Không cần tập nhiều hơn nếu không thể duy trì — hãy bắt đầu với MED.',
      'Never miss twice rule: Bỏ 1 buổi = bình thường. Bỏ 2 buổi liên tiếp = bắt đầu mất momentum. Quy tắc đơn giản nhất để duy trì nhất quán là không cho phép bỏ 2 buổi liên tiếp.',
      '6 lộ trình từ ít đến nhiều: Siêu bận (2 buổi/tuần) → Bắt đầu (3 buổi) → Phổ biến (4 buổi) → Nâng cao (5 buổi) → Chuyên sâu (6 buổi) → Vận động viên (6 buổi + cardio phụ).',
      'Scale up từ từ: Duy trì nhất quán ở mức thấp hơn 4 tuần rồi thêm 1 buổi. Không nhảy thẳng từ 2 lên 5 buổi — burnout đến rất nhanh.',
      'Social accountability: Tập cùng 1 người khác tăng adherence 37% (Plante et al., 1996). Không có partner? Community online hoặc check-in app cũng có hiệu quả.',
      'Identity shift: Người duy trì được 12+ tháng thường không còn "đang cố tập" — họ đã trở thành "người tập luyện". Identity-based habits bền hơn goal-based habits.',
    ],
    points: [
      { icon: '📅', label: '96 > 36 buổi', note: '2 buổi/tuần × 12 tháng > 6 buổi/tuần × 6 tuần' },
      { icon: '✌️', label: 'Never miss twice', note: 'Quy tắc đơn giản nhất để giữ momentum' },
      { icon: '🤝', label: 'Partner +37%', note: 'Accountability partner tăng adherence đáng kể' },
      { icon: '🆔', label: 'Identity shift', note: '"Tôi là người tập luyện" bền hơn "tôi đang cố gắng"' },
    ],
  },
  // ── Tab 3: Bậc Thang Tiến Bộ (purple) ─────────────────────────────────────
  {
    icon: '📋', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Test Định Kỳ — Đo Chuẩn Để Tiến Bộ Đáng Tin Cậy',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thực hiện test là một kỹ năng riêng cần 2–3 lần để thành thạo. Điều kiện test không nhất quán (sau tập nặng, thiếu ngủ) có thể thay đổi kết quả ±15–20%, khiến bạn tưởng tiến bộ/thụt lùi sai.',
    detail: 'Test fitness không chỉ là "tập và đếm". Để kết quả có ý nghĩa và so sánh được theo thời gian, điều kiện test phải nhất quán: cùng thời điểm trong ngày, cùng trạng thái ngủ, cùng cách warm-up, cùng thiết bị.',
    details: [
      'Lên lịch test trước: 3 kỳ test — Tuần 4, Tuần 8, Tuần 12 — được đặt vào lịch từ đầu, không phụ thuộc vào cảm giác "sẵn sàng". Ngày test không phải ngày tập nặng.',
      'Điều kiện test chuẩn hóa: 8+ tiếng ngủ đêm trước, không tập nặng 48 giờ trước, cùng thời điểm (ví dụ: sáng thứ 7), cùng warm-up 10 phút. Ghi lại tất cả điều kiện.',
      '±15–20% dao động không phải tiến bộ thực: Nếu điều kiện test khác nhau, kết quả khác nhau không phản ánh fitness thực. Chỉ so sánh test với cùng điều kiện.',
      'Kỹ năng test cần luyện tập: Lần test đầu thường không tối ưu vì chưa quen với áp lực. Tuần 4 test = học cách test. Tuần 8 và 12 = số liệu đáng tin cậy để so sánh.',
      'Ghi chép chi tiết: Ghi không chỉ kết quả mà còn cảm giác chủ quan (1–10), giấc ngủ đêm trước, cafein, thời tiết. Metadata này giải thích các outlier.',
      'Chọn bài test phù hợp mục tiêu: Tăng cơ → 5RM squat/deadlift. Sức bền → 2km chạy hoặc beep test. Linh hoạt → sit-and-reach. Phục hồi → resting heart rate trend.',
    ],
    points: [
      { icon: '📅', label: 'Test có lịch trước', note: 'Tuần 4, 8, 12 — không phụ thuộc cảm giác' },
      { icon: '🎯', label: 'Điều kiện nhất quán', note: 'Cùng giờ, ngủ, warm-up mỗi lần test' },
      { icon: '📝', label: 'Ghi chép metadata', note: 'Giải thích outlier và kết quả bất ngờ' },
      { icon: '🎓', label: 'Test là kỹ năng', note: 'Lần 1–2 để học, lần 3+ mới đáng tin cậy' },
    ],
  },
  {
    icon: '🕸️', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Radar Chart 4 Chiều — Thấy Điểm Yếu Ẩn Mà Một Chỉ Số Không Hiện',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người có sức mạnh cao nhưng linh hoạt kém có nguy cơ chấn thương cao hơn người tập cân bằng, dù "khỏe hơn" theo nghĩa thông thường. 4 chiều phát hiện mất cân bằng ẩn không thấy được qua 1 chỉ số.',
    detail: 'Fitness không phải một chiều. Người mạnh có thể thiếu sức bền. Người bền có thể thiếu sức mạnh. Người dẻo có thể phục hồi chậm. Radar chart 4 chiều cho bạn thấy "bức tranh thực" về tình trạng thể chất — không chỉ điểm mạnh.',
    details: [
      'Chiều 1 — Sức mạnh: Đo bằng bài test đại diện (squat BW ×1.5 cho nam, ×1.0 cho nữ là mức khá). Sức mạnh là nền tảng — thiếu sức mạnh = giới hạn mọi chiều khác.',
      'Chiều 2 — Sức bền: VO2 max hoặc bài test đơn giản như 1.5km chạy. VO2 max là predictor mạnh nhất của tử vong do tim mạch — quan trọng hơn hầu hết chỉ số sức khỏe khác.',
      'Chiều 3 — Linh hoạt: Không phải chỉ yoga mới cần — linh hoạt đủ cho squat sâu (hip crease dưới đầu gối), overhead reach không arch lưng, toe touch gần chạm. Thiếu linh hoạt = compensation patterns = chấn thương.',
      'Chiều 4 — Phục hồi: Resting heart rate xu hướng (giảm = tốt), HRV trend nếu đo được, chất lượng giấc ngủ (PSQI <5), và thời gian phục hồi chủ quan sau buổi tập nặng.',
      'Nguy hiểm khi asymmetric: Mạnh + kém linh hoạt = rotator cuff injury, hip impingement. Bền + không có sức mạnh nền = stress fracture. Mạnh + phục hồi kém = overtraining tích lũy.',
      'Cách dùng radar chart: Vẽ ở tuần 1 → 4 → 8 → 12. Chiều nào lõm nhất = ưu tiên tập cho giai đoạn tiếp theo. Mục tiêu không phải điểm cao nhất từng chiều — mà là hình tròn đều nhất.',
    ],
    points: [
      { icon: '📊', label: '4 chiều quan trọng', note: 'Sức mạnh · Sức bền · Linh hoạt · Phục hồi' },
      { icon: '⚠️', label: 'Mạnh + cứng = nguy hiểm', note: 'Mất cân bằng ẩn là nguyên nhân chấn thương phổ biến' },
      { icon: '❤️', label: 'VO2 max = tuổi thọ', note: 'Predictor mạnh nhất của tử vong tim mạch' },
      { icon: '🎯', label: 'Hình tròn đều hơn', note: 'Mục tiêu: cân bằng, không phải điểm cao 1 chiều' },
    ],
  },
  {
    icon: '🪜', color: '#a855f7', rgb: '168,85,247',
    modalTitle: '5 Bậc Tiến Bộ — Biết Rõ Vị Trí Và Bước Tiếp Theo Là Gì',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: '20–30% người bỏ tập trong 90 ngày đầu không phải vì lười biếng — mà vì không biết mình đang ở đâu và bước tiếp theo là gì (IHRSA, 2019). Cấu trúc bậc thang giải quyết trực tiếp vấn đề này.',
    detail: '5 bậc không phải danh hiệu hay cuộc thi — chúng là bản đồ. Biết mình đang ở Bậc 2 và tiêu chí lên Bậc 3 là gì = có hướng rõ ràng = ít bỏ cuộc hơn. Không có bản đồ = đi lạc.',
    details: [
      'Bậc 1 — Hoạt động cơ bản: Đi bộ 30 phút/ngày, 3 lần/tuần. Không cần gym. Đây là điểm bắt đầu cho người hoàn toàn ít vận động. Mục tiêu: tạo thói quen vận động trước khi nghĩ đến cường độ.',
      'Bậc 2 — Nền tảng: Có thể hoàn thành 3 buổi/tuần với 6 mẫu cơ bản ở mức cơ sở (10 push-up, goblet squat BW × 20 reps, plank 30 giây). Hầu hết người mới đạt được sau 4–8 tuần.',
      'Bậc 3 — Trung cấp: Sức mạnh đủ để squat BW, deadlift BW ×1.2, 20 push-up. Sức bền: chạy 2km không nghỉ. Đây là bậc "khỏe mạnh cơ bản" theo tiêu chuẩn y tế.',
      'Bậc 4 — Nâng cao: Squat BW ×1.5 (nam) / ×1.0 (nữ). 5km <30 phút. Pull-up 5 reps (nam) / 2 reps (nữ). Cần 6–18 tháng tập có hệ thống từ nền zero.',
      'Bậc 5 — Vận động viên: Squat BW ×2.0+. 5km <22 phút. Cần gen tốt + thời gian dài + lập trình chuyên sâu. Không phải mục tiêu mọi người cần đạt.',
      'Thực tế: 80% lợi ích sức khỏe đến từ Bậc 1–3. Không cần Bậc 4–5 để có sức khỏe tốt và tuổi thọ dài. Biết điều này giảm áp lực và giúp duy trì lâu dài hơn.',
    ],
    points: [
      { icon: '🗺️', label: 'Bậc = bản đồ', note: 'Biết vị trí + bước tiếp theo = ít bỏ cuộc' },
      { icon: '🏁', label: 'Bậc 1–3 = đủ rồi', note: '80% lợi ích sức khỏe từ nền đến trung cấp' },
      { icon: '📅', label: '4–8 tuần lên Bậc 2', note: 'Người mới đạt nền tảng trong 1–2 tháng' },
      { icon: '🎯', label: '6–18 tháng lên Bậc 4', note: 'Nâng cao cần thời gian — không có đường tắt' },
    ],
  },
];

const PRINCIPLES = [
  {
    icon: '🎯',
    title: 'Kỹ thuật đúng là nền tảng',
    body: 'Học đúng từ đầu tiết kiệm hàng năm tập sai. 6 mẫu vận động cơ bản bao phủ 95% mọi bài tập bạn cần trong cuộc đời — không cần thiết bị phức tạp.',
    img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=75&auto=format&fit=crop',
    keyFact: '6 mẫu vận động (Squat, Hinge, Push, Pull, Carry, Core) bao phủ 95% mọi bài tập thể lực cần thiết suốt đời.',
    detail: 'Kỹ thuật sai không chỉ gây chấn thương — nó còn làm lãng phí mỗi buổi tập. Học đúng ngay từ buổi đầu giúp não bộ "ghi" đúng motor pattern, sau đó cơ thể tự động thực hiện hiệu quả hơn theo thời gian. Cơ thể người được thiết kế để thực hiện 6 mẫu vận động cơ bản. Thuần thục 6 mẫu này là đủ để tập suốt đời — không cần dụng cụ phức tạp hay bài tập hoa mỹ.',
    details: [
      'Kỹ thuật sai tạo ra "bad motor pattern" — não bộ ghi nhớ cách di chuyển sai và tự động hóa nó. Sửa sau rất khó hơn học đúng ngay từ đầu.',
      '6 mẫu vận động cơ bản: Squat (ngồi xuống), Hip Hinge (gập hông), Push (đẩy), Pull (kéo), Carry (mang), Core (ổn định). Mọi bài tập phức tạp đều là biến thể của 6 mẫu này.',
      'Tập đúng kỹ thuật với tạ nhỏ hiệu quả hơn tập sai với tạ nặng. Nguyên tắc "progressive overload" chỉ an toàn khi form chuẩn.',
      'Video tự quay hoặc gương là công cụ miễn phí hiệu quả nhất để kiểm tra kỹ thuật. Mỗi 2 tuần, quay lại 1 bài cơ bản và tự đánh giá.',
      'Không cần gym hay dụng cụ: chỉ cần không gian 2m², thảm và trọng lượng cơ thể là đủ để học đúng 6 mẫu vận động.',
    ],
    points: [
      { icon: '🏋️', label: 'Squat & Hinge', note: 'Nền tảng sức mạnh hạ chi' },
      { icon: '💪', label: 'Push & Pull', note: 'Cân bằng thân trên toàn diện' },
      { icon: '🧱', label: 'Carry & Core', note: 'Ổn định cột sống khi vận động' },
      { icon: '📹', label: 'Tự quay kiểm tra', note: 'Phản hồi trực quan miễn phí' },
    ],
  },
  {
    icon: '🔁',
    title: 'Nhất quán quan trọng hơn cường độ',
    body: 'Não bộ xây thói quen qua lặp lại đều đặn. 3 buổi/tuần duy trì 12 tuần tốt hơn 7 buổi/tuần rồi burnout sau 3 tuần — cơ thể cần thời gian thích nghi.',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=75&auto=format&fit=crop',
    keyFact: '3 buổi/tuần trong 12 tuần = 36 buổi tập. 7 buổi/tuần trong 3 tuần = 21 buổi rồi bỏ cuộc. Toán học ủng hộ sự nhất quán.',
    detail: 'Não bộ xây dựng "superhighway thần kinh" thông qua lặp lại đều đặn — không phải qua cường độ cao. Thích nghi thần kinh cơ xảy ra khi có kích thích vừa đủ, nghỉ ngơi đủ, và chu kỳ lặp lại ổn định. Tập quá nhiều quá sớm kích hoạt cortisol cao kéo dài, phá vỡ giấc ngủ, làm giảm ý chí — và cuối cùng dẫn đến bỏ cuộc. Xây nhất quán trước, tăng cường độ sau.',
    details: [
      'Não bộ cần 21–66 ngày để tự động hóa một hành vi mới. Trong giai đoạn này, ý chí là nguồn năng lượng hữu hạn — thiết kế thói quen để tiêu hao ít ý chí nhất.',
      'Nguyên tắc "minimum effective dose": liều tập tối thiểu vẫn tạo ra thích nghi. 20 phút với form tốt > 90 phút với form mệt.',
      'Recovery không phải thời gian lãng phí — đây là lúc cơ thể thực sự thích nghi và mạnh hơn. Bỏ qua recovery = phá vỡ chu kỳ thích nghi.',
      'Habit stacking: gắn buổi tập vào thói quen sẵn có (sau cà phê sáng, trước khi tắm). Giảm "friction" của việc bắt đầu.',
      'Khi lỡ 1 ngày: quy tắc "không bao giờ bỏ 2 ngày liên tiếp". Bỏ 1 ngày là sự cố; bỏ 2 ngày là bắt đầu thói quen mới (thói quen không tập).',
    ],
    points: [
      { icon: '🧠', label: '21–66 ngày', note: 'Thời gian não tự động hóa thói quen' },
      { icon: '📅', label: '3 buổi/tuần', note: 'Tần suất tối ưu cho người mới' },
      { icon: '😴', label: 'Recovery đủ', note: 'Cơ thể thích nghi khi nghỉ, không phải khi tập' },
      { icon: '🔗', label: 'Habit Stacking', note: 'Gắn tập vào thói quen sẵn có' },
    ],
  },
  {
    icon: '📊',
    title: 'Đo để không lạc hướng',
    body: 'Tiến bộ mà không thấy được thì dễ nản lòng. Mốc rõ ràng mỗi 4 tuần cho bạn biết chính xác mình đang ở đâu và cần điều chỉnh gì tiếp theo.',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=75&auto=format&fit=crop',
    keyFact: 'Chỉ cần 4 chỉ số đơn giản: số lần reps tăng, thời gian plank, vòng eo, và cảm giác năng lượng. Không cần máy móc phức tạp.',
    detail: 'Tiến bộ trong thể lực xảy ra chậm và phi tuyến tính — không có phản hồi rõ ràng, não bộ không thể phân biệt "đang tiến bộ" với "đang giậm chân tại chỗ". Đo lường tạo ra feedback loop rõ ràng: bạn biết cần điều chỉnh gì, và quan trọng hơn, bạn thấy mình thực sự tiến bộ dù chậm.',
    details: [
      '4 loại chỉ số cần theo dõi: (1) Sức mạnh — số reps/tạ tăng; (2) Sức bền — thời gian plank, số bước; (3) Hình thể — vòng eo/hông; (4) Chức năng — năng lượng, chất lượng ngủ.',
      'Chu kỳ test 4 tuần: không phải ngẫu nhiên — 4 tuần đủ để thấy thích nghi rõ ràng nhưng không quá dài để mất phương hướng.',
      'Ghi lại kết quả bằng bất cứ công cụ nào bạn dùng được: note điện thoại, bảng tính, nhật ký tay. Quan trọng là GHI LẠI, không phải công cụ.',
      'So sánh với chính mình tuần trước, không phải với người khác. Tiến bộ 5% mỗi 4 tuần sau 1 năm = tăng 80% so với ban đầu.',
      'Khi kết quả không thay đổi sau 4 tuần: không phải thất bại — đây là tín hiệu cần điều chỉnh (thêm tải, đổi bài, cải thiện ngủ/ăn).',
    ],
    points: [
      { icon: '💪', label: 'Sức mạnh', note: 'Reps & tạ tăng theo thời gian' },
      { icon: '📏', label: 'Hình thể', note: 'Vòng eo, hông — thực tế hơn cân' },
      { icon: '⚡', label: 'Năng lượng', note: 'Chỉ số chức năng quan trọng nhất' },
      { icon: '🔄', label: 'Chu kỳ 4 tuần', note: 'Review & điều chỉnh định kỳ' },
    ],
  },
];

// ─── PrincipleModal — full-screen detail overlay (outside all RevealBlocks) ────
const PA_COLOR = '#22c55e';
const PA_RGB   = '34,197,94';

function PrincipleModal({ p, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t: tCommon } = useTranslation('common');
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#080e08', borderColor: `rgba(${PA_RGB},0.28)`, boxShadow: `0 0 80px rgba(${PA_RGB},0.15), 0 40px 80px rgba(0,0,0,0.6)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={p.img} alt={p.title} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${PA_RGB},0.08) 50%, #080e08 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${PA_COLOR}, transparent)` }} />
          {/* Number watermark */}
          <div className="absolute top-5 right-6 font-black leading-none" style={{ fontSize: 52, color: PA_COLOR, textShadow: `0 0 30px rgba(${PA_RGB},0.65)` }}>
            {String(idx + 1).padStart(2, '0')}
          </div>
          {/* Icon */}
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${PA_RGB},0.18)`, border: `2px solid rgba(${PA_RGB},0.45)` }}>
            {p.icon}
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}
          >✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: PA_COLOR }}>{p.title}</h2>

          {/* Key fact banner */}
          <div className="flex gap-3 rounded-2xl p-4 mb-6" style={{ background: `rgba(${PA_RGB},0.07)`, border: `1px solid rgba(${PA_RGB},0.2)` }}>
            <span className="text-lg shrink-0">💡</span>
            <p className="text-sm font-semibold leading-relaxed m-0" style={{ color: '#86efac' }}>{p.keyFact}</p>
          </div>

          {/* Detail paragraph */}
          <p className="text-base text-muted leading-relaxed mb-6">{p.detail}</p>

          {/* Numbered detail list */}
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: PA_COLOR }}>{tCommon('modal.practice_title')}</p>
          <ul className="space-y-3 mb-8">
            {p.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${PA_RGB},0.14)`, color: PA_COLOR }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {p.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${PA_RGB},0.06)`, border: `1px solid rgba(${PA_RGB},0.15)` }}>
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
            <button
              onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? PA_COLOR : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${PA_RGB},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${PA_RGB},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >{tCommon('modal.prev')}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{idx + 1} / {total}</span>
            <button
              onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? PA_COLOR : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${PA_RGB},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${PA_RGB},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{tCommon('modal.next')}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ─── TabDetailModal ──────────────────────────────────────────────────────────────

function TabDetailModal({ item, itemIdx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t: tCommon } = useTranslation('common');
  const { color, rgb } = item;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#080a08', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15), 0 40px 80px rgba(0,0,0,0.6)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${rgb},0.08) 50%, #080a08 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          {/* Icon */}
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {item.icon}
          </div>
          {/* Number watermark */}
          <div className="absolute top-5 right-6 font-black leading-none select-none" style={{ fontSize: 48, color, textShadow: `0 0 30px rgba(${rgb},0.6)`, opacity: 0.8 }}>
            {String(itemIdx + 1).padStart(2, '0')}
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}
          >✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-4 leading-snug" style={{ color }}>{item.modalTitle}</h2>

          {/* Key fact banner */}
          <div className="flex gap-3 rounded-2xl p-4 mb-5" style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <span className="text-lg shrink-0">💡</span>
            <p className="text-sm font-semibold leading-relaxed m-0" style={{ color: `rgba(255,255,255,0.85)` }}>{item.keyFact}</p>
          </div>

          {/* Detail paragraph */}
          <p className="text-sm text-muted leading-relaxed mb-5">{item.detail}</p>

          {/* Numbered detail list */}
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color }}>{tCommon('modal.apply_title')}</p>
          <ul className="space-y-3 mb-7">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col grid */}
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
            <button
              onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >{tCommon('modal.prev')}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>{itemIdx + 1} / 3</span>
            <button
              onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{tCommon('modal.next')}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{tCommon('modal.close_hint')}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function RevealBlock({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedStat({ n, label, color, tooltip }) {
  const numericPart = parseFloat(n.replace(/[^0-9.]/g, ''));
  const suffix = n.replace(/[0-9.]/g, '');
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!numericPart) return;
    let raf;
    const t0 = performance.now();
    const delay = setTimeout(() => {
      const tick = (now) => {
        const p = Math.min((now - t0) / 900, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * numericPart));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 350);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf); };
  }, []);

  const display = numericPart > 0 ? `${val}${suffix}` : n;
  return (
    <div className="group/astat relative bg-bg/85 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/astat:opacity-100 scale-90 group-hover/astat:scale-100 -translate-y-1 group-hover/astat:translate-y-0 transition-all duration-200 origin-bottom">
          <ThoughtBubble text={tooltip} idx={`a-${n}-${label}`} color={color} />
        </div>
      )}
      <div className="text-xl font-black leading-none mb-0.5" style={{ color }}>{display}</div>
      <div className="text-[9px] text-muted leading-snug">{label}</div>
    </div>
  );
}

// ─── Tab content panel ──────────────────────────────────────────────────────────

function TabPanel({ tab, onDetailClick, onHighlightClick }) {
  const { t: tCommon } = useTranslation('common');
  return (
    <div className={`relative overflow-hidden rounded-3xl border ${tab.border}`} style={{ background: `${tab.color}03` }}>
      {/* Top accent gradient line */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${tab.color}ee, ${tab.color}40, transparent)` }} />

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={tab.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.05 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/60 to-bg/95" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: tab.glow }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: `${tab.color}06` }} />
      </div>

      {/* ── QUOTE BLOCK (full width) ── */}
      <div className="relative z-10 px-7 md:px-10 pt-8 pb-6 border-b" style={{ borderColor: `${tab.color}18` }}>
        <div className="flex items-start gap-4">
          <span className="text-6xl font-black leading-[0.7] shrink-0 select-none" style={{ color: `${tab.color}40` }}>"</span>
          <div>
            <p className="text-lg md:text-xl font-semibold text-text/90 leading-relaxed italic mb-2">{tab.quote}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${tab.color}80` }}>— {tab.quoteContext}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="relative z-10 p-7 md:p-10 grid md:grid-cols-[58%_42%] gap-8 md:gap-10">
        {/* ── LEFT ── */}
        <div className="flex flex-col">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 border text-[10px] font-bold px-3 py-1.5 rounded-full mb-5 self-start ${tab.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
            {tab.n} / 04 · {tab.sub}
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-text leading-tight mb-2">{tab.title}</h2>
          <p className={`text-base font-bold ${tab.text} mb-4 opacity-80`}>{tab.sub}</p>
          <p className="text-muted text-lg leading-relaxed mb-7">{tab.longDesc}</p>

          {/* Highlights — staggered fade in */}
          <div className="space-y-3 mb-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted/60 mb-2">{tab.highlights_label}</p>
            {tab.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 group/hl animate-fade-in-up cursor-pointer rounded-xl transition-all duration-200 hover:bg-white/[0.03] -mx-2 px-2 py-1"
                style={{ animationDelay: `${i * 70 + 80}ms`, animationFillMode: 'both' }}
                onClick={() => onHighlightClick && onHighlightClick(i)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border transition-all duration-200 group-hover/hl:scale-110"
                  style={{ background: `${tab.color}10`, borderColor: `${tab.color}25` }}
                >
                  {h.icon}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-text leading-tight">{h.title}</p>
                  <p className="text-[11px] text-muted mt-0.5">{h.desc}</p>
                </div>
                <span className="shrink-0 self-center text-[10px] font-bold opacity-0 group-hover/hl:opacity-60 transition-opacity" style={{ color: tab.color }}>{tCommon('modal.see_detail') || 'chi tiết →'}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, ${tab.color}20, transparent)` }} />

          {/* Details — staggered, with colored left border */}
          <div className="space-y-4 mb-8">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted/60 mb-2">{tab.details_label}</p>
            {tab.details.map((d, i) => (
              <div
                key={i}
                className="flex gap-3.5 animate-fade-in-up group/detail cursor-pointer rounded-xl transition-all duration-200 hover:bg-white/[0.03] -mx-2 px-2 py-1"
                style={{ animationDelay: `${i * 90 + 280}ms`, animationFillMode: 'both' }}
                onClick={() => onDetailClick && onDetailClick(i)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 border mt-0.5 transition-all group-hover/detail:scale-110"
                  style={{ background: `${tab.color}08`, borderColor: `${tab.color}20` }}
                >
                  {d.icon}
                </div>
                <div className="flex-1 pl-3 border-l" style={{ borderColor: `${tab.color}25` }}>
                  <p className="text-base font-bold text-text/90 leading-tight mb-1">{d.title}</p>
                  <p className="text-[11px] text-muted leading-relaxed">{d.body}</p>
                </div>
                <span className="shrink-0 self-center text-[10px] font-bold opacity-0 group-hover/detail:opacity-60 transition-opacity" style={{ color: tab.color }}>{tCommon('modal.see_detail') || 'chi tiết →'}</span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="mt-auto">
            <Link
              to={tab.path}
              className="inline-flex items-center gap-2.5 font-bold text-lg px-7 py-3.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 group"
              style={{ background: `${tab.color}12`, borderColor: `${tab.color}40`, color: tab.color }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${tab.glow}`; e.currentTarget.style.background = `${tab.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = `${tab.color}12`; }}
            >
              {tab.cta}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex flex-col gap-5">
          {/* Hero image with animated stats */}
          <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img src={tab.img} alt={tab.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tab.color}0a, transparent 60%)` }} />

            {/* Tab number watermark */}
            <div className="absolute top-3 right-4 font-black text-6xl leading-none select-none pointer-events-none" style={{ color: `${tab.color}15` }}>{tab.n}</div>

            {/* Animated stats overlay */}
            <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2">
              {tab.tabStats.map((s, i) => (
                <AnimatedStat key={i} n={s.n} label={s.label} color={tab.color} tooltip={s.tooltip} />
              ))}
            </div>
          </div>

          {/* Content chips */}
          <div>
            <p className="text-[9px] font-bold text-muted/60 uppercase tracking-widest mb-2">{tab.preview_label}</p>
            <div className="flex flex-wrap gap-1.5">
              {tab.previewItems.map((item, pi) => (
                <span key={pi} className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${tab.chip}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function PillarA() {
  const { t: tCommon }  = useTranslation('common');
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarA', { returnObjects: true });

  // Build merged tab array: static data (colors, paths, icons) + translated text
  const tabsTr = Array.isArray(pillar?.tabs) ? pillar.tabs : [];
  const mergedTabs = TABS.map((t, i) => {
    const tr = tabsTr[i] || {};
    return {
      ...t,
      title:            tr.title            || t.title,
      sub:              tr.sub              || t.sub,
      longDesc:         tr.longDesc         || t.longDesc,
      highlights:       tr.highlights       || t.highlights,
      quote:            tr.quote            || t.quote,
      quoteContext:     tr.quoteContext     || t.quoteContext,
      details:          tr.details          || t.details,
      tabStats:         t.tabStats.map((s, j) => ({ ...s, label: tr.tabStats?.[j]?.label || s.label })),
      previewItems:     tr.previewItems     || t.previewItems,
      cta:              tr.cta              || t.cta,
      highlights_label: pillar?.highlights_label || 'Điểm nổi bật',
      details_label:    pillar?.details_label    || 'Hiểu sâu hơn',
      preview_label:    pillar?.preview_label    || 'Nội dung bên trong',
    };
  });

  const translatedPrinciples = PRINCIPLES.map((p, i) => ({
    ...p,
    title:    tPillars(`pillarA.principles.${i}.title`,          { defaultValue: p.title }),
    keyFact:  tPillars(`pillarA.principles_full.${i}.keyFact`,  { defaultValue: p.keyFact }),
    detail:   tPillars(`pillarA.principles_full.${i}.detail`,   { defaultValue: p.detail }),
    details:  tPillars(`pillarA.principles_full.${i}.details`,  { returnObjects: true, defaultValue: p.details }),
    points:   tPillars(`pillarA.principles_full.${i}.points`,   { returnObjects: true, defaultValue: p.points }),
  }));

  const translatedHighlightModals = HIGHLIGHT_MODALS.map((m, i) => ({
    ...m,
    modalTitle: tPillars(`pillarA.highlight_modals_full.${i}.modalTitle`, { defaultValue: m.modalTitle }),
    keyFact:    tPillars(`pillarA.highlight_modals_full.${i}.keyFact`,    { defaultValue: m.keyFact }),
    detail:     tPillars(`pillarA.highlight_modals_full.${i}.detail`,     { defaultValue: m.detail }),
    details:    tPillars(`pillarA.highlight_modals_full.${i}.details`,    { returnObjects: true, defaultValue: m.details }),
    points:     tPillars(`pillarA.highlight_modals_full.${i}.points`,     { returnObjects: true, defaultValue: m.points }),
  }));

  const translatedDetailModals = DETAIL_MODALS.map((m, i) => ({
    ...m,
    modalTitle: tPillars(`pillarA.detail_modals_full.${i}.modalTitle`, { defaultValue: m.modalTitle }),
    keyFact:    tPillars(`pillarA.detail_modals_full.${i}.keyFact`,    { defaultValue: m.keyFact }),
    detail:     tPillars(`pillarA.detail_modals_full.${i}.detail`,     { defaultValue: m.detail }),
    details:    tPillars(`pillarA.detail_modals_full.${i}.details`,    { returnObjects: true, defaultValue: m.details }),
    points:     tPillars(`pillarA.detail_modals_full.${i}.points`,     { returnObjects: true, defaultValue: m.points }),
  }));

  const [principleIdx, setPrincipleIdx] = useState(null);
  const [detailModal, setDetailModal] = useState(null);     // { tabIdx, itemIdx }
  const [highlightModal, setHighlightModal] = useState(null); // { tabIdx, itemIdx }
  const [activeTab, setActiveTab] = useState(0);
  const [tabKey, setTabKey] = useState(0);
  const tabBarRef = useRef(null);
  const journeyRef = useRef(null);
  const stepRefs = useRef([]);
  const [jets, setJets] = useState([]);

  // Inject water-jet keyframe once
  useEffect(() => {
    const id = 'wj-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes wjFly {
        0%   { transform: translate(0px, var(--wy,0px)) scale(1);    opacity: 0.95; }
        38%  { transform: translate(calc(var(--wx)*0.38), calc(var(--wy,0px) + var(--wa,-18px))) scale(0.72); opacity: 0.85; }
        100% { transform: translate(var(--wx), var(--wy,0px)) scale(0.1); opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  // Inject orbit-border keyframe once
  useEffect(() => {
    const id = 'pa-orbit-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property --pa-orbit-angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }
      @keyframes paOrbitSpin {
        to { --pa-orbit-angle: 360deg; }
      }
      .pa-orbit-ring {
        background: conic-gradient(
          from var(--pa-orbit-angle),
          transparent 0deg,
          transparent 55deg,
          rgba(34,197,94,0.0) 65deg,
          rgba(34,197,94,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg,
          rgba(34,197,94,0.75) 99deg,
          rgba(34,197,94,0.0) 115deg,
          transparent 125deg,
          transparent 360deg
        );
        animation: paOrbitSpin 3.5s linear infinite;
      }
      @keyframes paTitleShimmer {
        0%   { background-position: -250% center; }
        100% { background-position: 250% center; }
      }
      @keyframes paAmpPulse {
        0%, 100% { filter: drop-shadow(0 0 8px rgba(34,197,94,0.45)); }
        50%       { filter: drop-shadow(0 0 22px rgba(34,197,94,0.95)); }
      }
      .pa-title-word {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 30%,
          #4ade80 45%, #86efac 52%,
          #ffffff 67%, #ffffff 100%
        );
        background-size: 300% auto;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation: paTitleShimmer 5s linear infinite;
      }
      .pa-title-amp {
        -webkit-text-fill-color: #22c55e;
        color: #22c55e;
        animation: paAmpPulse 2.2s ease-in-out infinite;
      }
      @property --pat0 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pat1 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pat2 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @property --pat3 { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pat0Spin { to { --pat0: 360deg; } }
      @keyframes pat1Spin { to { --pat1: 360deg; } }
      @keyframes pat2Spin { to { --pat2: 360deg; } }
      @keyframes pat3Spin { to { --pat3: 360deg; } }
      .pa-frame-0 { background: conic-gradient(from var(--pat0), rgba(34,197,94,0.28) 0deg, rgba(34,197,94,0.28) 353deg, rgba(34,197,94,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(34,197,94,0.55) 361deg, rgba(34,197,94,0.28) 363deg, rgba(34,197,94,0.28) 360deg); animation: pat0Spin 4s linear infinite; border-radius: 1rem; padding: 1.5px; }
      .pa-frame-1 { background: conic-gradient(from var(--pat1), rgba(34,197,94,0.28) 0deg, rgba(34,197,94,0.28) 353deg, rgba(34,197,94,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(34,197,94,0.55) 361deg, rgba(34,197,94,0.28) 363deg, rgba(34,197,94,0.28) 360deg); animation: pat1Spin 4.4s linear infinite; border-radius: 1rem; padding: 1.5px; }
      .pa-frame-2 { background: conic-gradient(from var(--pat2), rgba(34,197,94,0.28) 0deg, rgba(34,197,94,0.28) 353deg, rgba(34,197,94,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(34,197,94,0.55) 361deg, rgba(34,197,94,0.28) 363deg, rgba(34,197,94,0.28) 360deg); animation: pat2Spin 3.8s linear infinite; border-radius: 1rem; padding: 1.5px; }
      .pa-frame-3 { background: conic-gradient(from var(--pat3), rgba(34,197,94,0.28) 0deg, rgba(34,197,94,0.28) 353deg, rgba(34,197,94,0.55) 355deg, rgba(255,255,255,0.92) 358deg, rgba(34,197,94,0.55) 361deg, rgba(34,197,94,0.28) 363deg, rgba(34,197,94,0.28) 360deg); animation: pat3Spin 3.5s linear infinite; border-radius: 1rem; padding: 1.5px; }
    `;
    document.head.appendChild(s);
  }, []);

  const fireJet = useCallback((fromIdx, toIdx) => {
    const fromEl = stepRefs.current[fromIdx];
    const toEl   = stepRefs.current[toIdx];
    const cnt    = journeyRef.current;
    if (!fromEl || !toEl || !cnt) return;

    const fR = fromEl.getBoundingClientRect();
    const tR = toEl.getBoundingClientRect();
    const cR = cnt.getBoundingClientRect();

    const ox = fR.left + fR.width  / 2 - cR.left;
    const oy = fR.top  + 18         - cR.top;   // 18 = half of 36px circle
    const dx = tR.left + tR.width  / 2 - cR.left - ox;

    const batch = Date.now();
    const color = TABS[fromIdx].color;

    const newJets = Array.from({ length: 14 }, (_, k) => ({
      id:    `${batch}-${k}`,
      ox,    oy,    dx,
      arc:   -(6 + Math.random() * 30),
      ys:    (Math.random() - 0.5) * 20,
      color,
      size:  2.5 + Math.random() * 4,
      delay: k * 22,
      dur:   340 + Math.random() * 210,
    }));

    setJets(prev => [...prev, ...newJets]);
    setTimeout(() => setJets(prev => prev.filter(j => !j.id.startsWith(String(batch)))), 950);
  }, []);

  // Cooldown ref — prevent refiring same step within 550ms
  const hoverCooldown = useRef({});
  const fireJetOnHover = useCallback((i) => {
    if (i >= TABS.length - 1) return; // last step has no next
    const now = Date.now();
    if (hoverCooldown.current[i] && now - hoverCooldown.current[i] < 550) return;
    hoverCooldown.current[i] = now;
    fireJet(i, i + 1);
  }, [fireJet]);

  const switchTab = useCallback((i) => {
    if (i === activeTab) return;
    setActiveTab(i);
    setTabKey(k => k + 1);
  }, [activeTab]);

  // Keep active tab card visible on mobile when switching (skip on initial mount)
  const didMountTab = useRef(false);
  useEffect(() => {
    if (!didMountTab.current) { didMountTab.current = true; return; }
    const bar = tabBarRef.current;
    if (!bar) return;
    const btn = bar.children[activeTab];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!pillar || typeof pillar !== 'object') {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-muted text-lg">{tCommon('common.loading')}</span>
      </div>
    );
  }

  const tab = mergedTabs[activeTab];

  return (
    <div className="max-w-5xl mx-auto -mt-4">

      {/* ── HERO ────────────────────────────────────────────────────────────────── */}

      {/* Breadcrumb */}
      <div className="mb-10">
        <Link
          to="/pillars"
          className="inline-flex items-center gap-2 text-muted hover:text-accent text-lg transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          {tCommon('nav.pillars')}
        </Link>
      </div>

      {/* Icon + Title */}
      <div className="mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-6xl bg-surface border border-accent/20 shrink-0 animate-float">
            🏃
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
              {(() => {
                const s = pillar.title;
                const i = s.indexOf('&');
                if (i === -1) return <span className="pa-title-word">{s}</span>;
                return (
                  <>
                    <span className="pa-title-word">{s.slice(0, i)}</span>
                    <span className="pa-title-amp">&</span>
                    <span className="pa-title-word">{s.slice(i + 1)}</span>
                  </>
                );
              })()}
            </h1>
            <span className="inline-block text-base font-bold uppercase tracking-widest text-accent mt-3 mb-4 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              {pillar.subtitle}
            </span>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">
              {pillar.description}
            </p>
          </div>
        </div>
      </div>

      {/* Wide image with orbit glow border */}
      <div className="pa-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=70"
            alt="exercise training"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-accent text-base font-bold uppercase tracking-widest bg-bg/60 px-3 py-1 rounded-full border border-accent/20">
              {pillar?.subtitle || 'Daily Training'}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* ── NARRATIVE INTRO ────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-14">

        {/* Opening statement */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <p className="text-2xl md:text-3xl font-semibold text-text/85 leading-relaxed mb-3">
            {pillar?.intro_pt1 || 'Tập luyện hiệu quả không phải là tập '}<em>{pillar?.intro_em || 'nhiều hơn'}</em>
            <br />
            {pillar?.intro_pt2 || '— mà là tập '}<span className="text-accent font-bold not-italic">{pillar?.intro_strong || 'đúng hơn'}</span>.
          </p>
          <p className="text-lg text-muted leading-relaxed">
            {pillar?.intro_sub || '4 chủ đề dưới đây được sắp xếp theo thứ tự logic.'}
          </p>
        </div>

        {/* 3 core principles */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {PRINCIPLES.map((p, i) => {
            const pt = Array.isArray(pillar?.principles) && pillar.principles[i] ? pillar.principles[i] : p;
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => setPrincipleIdx(i)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setPrincipleIdx(i); }}
                className="flex gap-4 p-5 rounded-2xl border border-border/40 bg-surface/20 hover:bg-surface/35 hover:border-green-500/40 transition-all duration-300 group animate-fade-in-up cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', boxShadow: undefined }}
              >
                <span className="text-3xl shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-text mb-1.5 group-hover:text-green-400 transition-colors">{pt.title}</p>
                  <p className="text-[11px] text-muted leading-relaxed">{pt.body}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-bold text-green-500/50 group-hover:text-green-400 transition-colors">
                    {tCommon('modal.see_detail_label')}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4-step journey flow */}
        <div className="relative" ref={journeyRef}>
          <p className="text-center text-[9px] font-bold text-muted/50 uppercase tracking-[0.25em] mb-5">{pillar?.journey_label || 'Hành trình 4 bước'}</p>

          {/* Particle overlay */}
          <div className="absolute inset-0 pointer-events-none z-30" style={{ overflow: 'visible' }}>
            {jets.map(j => (
              <div
                key={j.id}
                className="absolute rounded-full"
                style={{
                  left:  j.ox + j.ys * 0.25,
                  top:   j.oy + j.ys * 0.6,
                  width:  j.size,
                  height: j.size,
                  background: j.color,
                  boxShadow: `0 0 ${j.size * 2}px ${j.color}`,
                  animationName: 'wjFly',
                  animationDuration: `${j.dur}ms`,
                  animationDelay: `${j.delay}ms`,
                  animationTimingFunction: 'ease-in',
                  animationFillMode: 'both',
                  '--wx': `${j.dx}px`,
                  '--wy': `${j.ys * 0.4}px`,
                  '--wa': `${j.arc}px`,
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TABS.map((t, i) => {
              const jt = Array.isArray(pillar?.journey) && pillar.journey[i] ? pillar.journey[i] : t;
              return (
              <div
                key={t.n}
                ref={el => { stepRefs.current[i] = el; }}
                onMouseEnter={() => fireJetOnHover(i)}
                className="group relative flex flex-col items-center text-center p-4"
              >
                {/* Step circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-black border mb-3 transition-all duration-300 group-hover:scale-110 relative z-10"
                  style={{ background: `${t.color}12`, borderColor: `${t.color}40`, color: t.color }}
                >
                  {i + 1}
                </div>

                {/* Icon */}
                <span className="text-2xl mb-2">{t.icon}</span>

                {/* Title */}
                <p className="text-[11px] font-bold text-text/80 group-hover:text-text leading-snug mb-1 transition-colors">{jt.title}</p>

                {/* Sub in tab color */}
                <p className="text-[9px] leading-tight" style={{ color: `${t.color}80` }}>
                  {jt.sub.length > 22 ? jt.sub.slice(0, 22) + '…' : jt.sub}
                </p>
              </div>
              );
            })}
          </div>

          <p className="text-center text-[10px] text-muted/40 mt-5">
            {pillar?.journey_cta || 'Chọn bất kỳ chủ đề nào bên dưới để bắt đầu khám phá →'}
          </p>
        </div>

      </RevealBlock>

      {/* ── TAB NAVIGATION ──────────────────────────────────────────────────────── */}
      <div id="tab-section" className="scroll-mt-4">
      <RevealBlock className="mb-0">
        {/* Section header */}
        <div className="mb-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <h2 className="text-lg font-black uppercase tracking-[0.18em] text-text whitespace-nowrap">
                {pillar?.tabs_label || '4 chủ đề luyện tập'}
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-0.5 rounded-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
            <div className="w-px h-4 bg-gradient-to-b from-accent/40 to-transparent" />
          </div>
        </div>

        {/* Orbit-ring frame wrapping tab strip + content */}
        <div className={`rounded-2xl p-[1.5px] transition-[background] duration-700 ${mergedTabs[activeTab].frameClass || 'pa-frame-0'}`}>
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a' }}>

            {/* Tab strip */}
            <div className="relative">
              <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: `${mergedTabs[activeTab].color}40 transparent` }}>
                <div ref={tabBarRef} className="flex items-stretch min-w-max md:min-w-0">
                {mergedTabs.map((t, i) => {
                  const isActive = activeTab === i;
                  return (
                    <button
                      key={t.n}
                      type="button"
                      onClick={() => switchTab(i)}
                      className="group relative flex items-center gap-3 px-5 py-4 font-bold transition-all duration-250 focus:outline-none cursor-pointer whitespace-nowrap"
                      style={{
                        color: isActive ? t.color : 'rgba(100,116,139,0.55)',
                        background: isActive ? `${t.color}0e` : 'transparent',
                      }}
                    >
                      <span className={`text-3xl transition-all duration-200 ${isActive ? 'scale-110' : 'opacity-50'}`}
                        style={{ filter: isActive ? `drop-shadow(0 0 8px ${t.color}90)` : 'none' }}>
                        {t.icon}
                      </span>
                      <span className="text-lg font-black">{t.n}</span>
                      <span className="hidden sm:inline text-lg">— {t.title}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full animate-pulse ml-0.5" style={{ background: t.color }} />
                      )}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] transition-all duration-300"
                        style={{
                          background: isActive ? `linear-gradient(90deg, transparent, ${t.color}, transparent)` : 'transparent',
                          boxShadow: isActive ? `0 0 8px ${t.color}` : 'none',
                        }}
                      />
                    </button>
                  );
                })}
                </div>
              </div>
              {/* Right fade hint — indicates more tabs to scroll */}
              <div className="absolute top-0 right-0 bottom-0 w-12 pointer-events-none md:hidden"
                style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }} />
            </div>

            {/* Separator */}
            <div
              className="h-px transition-all duration-700"
              style={{ background: `linear-gradient(90deg, transparent, ${mergedTabs[activeTab].color}30 25%, ${mergedTabs[activeTab].color}30 75%, transparent)` }}
            />

            {/* Content panel */}
            <div key={tabKey} className="relative overflow-hidden animate-fade-in-up">
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none transition-all duration-700"
                style={{ background: `${mergedTabs[activeTab].color}0e` }}
              />
              <div className="relative z-10">
                <TabPanel
                  tab={tab}
                  onDetailClick={(i) => setDetailModal({ tabIdx: activeTab, itemIdx: i })}
                  onHighlightClick={(i) => setHighlightModal({ tabIdx: activeTab, itemIdx: i })}
                />
              </div>
            </div>

          </div>
        </div>

      </RevealBlock>
      </div>{/* /tab-section */}

      {/* ── GUIDE: Bắt đầu từ đâu? ─────────────────────────────────────────────── */}
      <RevealBlock className="mt-10 mb-16">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-white/[0.015] p-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-4">{pillar?.guide_title || 'Bắt đầu từ đâu?'}</p>
          <div className="grid md:grid-cols-2 gap-2">
            {(Array.isArray(pillar?.guide_items) ? pillar.guide_items : [
              { who: '🌱 Mới hoàn toàn',       where: 'Bắt đầu với' },
              { who: '⏱ Có nền, cần cấu trúc', where: 'Đi thẳng đến' },
              { who: '📅 Cần tổ chức tuần',     where: 'Khám phá' },
              { who: '🏆 Muốn đo tiến bộ',      where: 'Thử ngay' },
            ]).map((item, i) => (
              <button
                key={item.who}
                onClick={() => { switchTab(i); tabBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border transition-all duration-200 group hover:bg-white/[0.03] text-left w-full"
              >
                <span className="text-lg font-medium text-muted min-w-[140px] shrink-0">{item.who}</span>
                <span className="text-[11px] text-muted/50 shrink-0 hidden md:block">{item.where}</span>
                <span className={`text-[11px] font-bold flex-1 truncate ${mergedTabs[i].text}`}>{mergedTabs[i].title}</span>
                <span className="text-muted group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
              </button>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ── SAFETY callout ──────────────────────────────────────────────────────── */}
      {pillar.sections && Array.isArray(pillar.sections) && pillar.sections[5] && (
        <RevealBlock className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/4 p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <h3 className="font-bold text-yellow-400 text-lg">{pillar.sections[5].title}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                {Array.isArray(pillar.sections[5].items) && pillar.sections[5].items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-base text-yellow-300/70">
                    <span className="text-yellow-400/60 mt-0.5 shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <RevealBlock className="mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/program" className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/4 p-6 hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-4xl mb-3">🗓️</div>
              <h3 className="font-black text-text text-lg mb-1">{pillar?.cta_12week_title || 'Lộ Trình 12 Tuần'}</h3>
              <p className="text-muted text-base leading-relaxed mb-4">{pillar?.cta_12week_desc || 'Khung ngày chuẩn, nhịp tuần gợi ý, bộ test tiến bộ theo giai đoạn.'}</p>
              <span className="inline-flex items-center gap-1.5 text-accent text-base font-bold group-hover:gap-2.5 transition-all">{pillar?.cta_12week_btn || 'Xem lộ trình'} <span>→</span></span>
            </div>
          </Link>
          <Link to="/sample-programs" className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-pink-500/4 p-6 hover:border-pink-500/40 hover:bg-pink-500/8 transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute inset-0 grid-dots opacity-10 pointer-events-none" />
            <div className="relative">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-black text-text text-lg mb-1">{pillar?.cta_sample_title || 'Lộ Trình Mẫu'}</h3>
              <p className="text-muted text-base leading-relaxed mb-4">{pillar?.cta_sample_desc || '6 mục tiêu × 24 tuần — tìm lộ trình phù hợp nhất với bạn.'}</p>
              <span className="inline-flex items-center gap-1.5 text-pink-400 text-base font-bold group-hover:gap-2.5 transition-all">{pillar?.cta_sample_btn || 'Khám phá'} <span>→</span></span>
            </div>
          </Link>
        </div>
      </RevealBlock>

      {/* Highlight modal — outside all RevealBlocks so position:fixed works */}
      {highlightModal !== null && (() => {
        const hItem = translatedHighlightModals[highlightModal.tabIdx * 3 + highlightModal.itemIdx];
        return hItem ? (
          <TabDetailModal
            item={hItem}
            itemIdx={highlightModal.itemIdx}
            onClose={() => setHighlightModal(null)}
            onPrev={() => setHighlightModal(dm => ({ ...dm, itemIdx: Math.max(0, dm.itemIdx - 1) }))}
            onNext={() => setHighlightModal(dm => ({ ...dm, itemIdx: Math.min(2, dm.itemIdx + 1) }))}
            hasPrev={highlightModal.itemIdx > 0}
            hasNext={highlightModal.itemIdx < 2}
          />
        ) : null;
      })()}

      {/* Tab detail modal — outside all RevealBlocks so position:fixed works */}
      {detailModal !== null && (() => {
        const modalItem = translatedDetailModals[detailModal.tabIdx * 3 + detailModal.itemIdx];
        return modalItem ? (
          <TabDetailModal
            item={modalItem}
            itemIdx={detailModal.itemIdx}
            onClose={() => setDetailModal(null)}
            onPrev={() => setDetailModal(dm => ({ ...dm, itemIdx: Math.max(0, dm.itemIdx - 1) }))}
            onNext={() => setDetailModal(dm => ({ ...dm, itemIdx: Math.min(2, dm.itemIdx + 1) }))}
            hasPrev={detailModal.itemIdx > 0}
            hasNext={detailModal.itemIdx < 2}
          />
        ) : null;
      })()}

      {/* Principle modal — outside all RevealBlocks so position:fixed works */}
      {principleIdx !== null && (
        <PrincipleModal
          p={translatedPrinciples[principleIdx]}
          idx={principleIdx}
          total={PRINCIPLES.length}
          onClose={() => setPrincipleIdx(null)}
          onPrev={() => setPrincipleIdx(i => Math.max(0, i - 1))}
          onNext={() => setPrincipleIdx(i => Math.min(PRINCIPLES.length - 1, i + 1))}
          hasPrev={principleIdx > 0}
          hasNext={principleIdx < PRINCIPLES.length - 1}
        />
      )}

    </div>
  );
}
