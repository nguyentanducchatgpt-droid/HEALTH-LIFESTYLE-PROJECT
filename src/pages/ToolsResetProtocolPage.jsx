import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'f-rp-orbit-kf';
const ORBIT_CLASS = 'f-rp-orbit-ring';

const RESET_SCENARIOS = [
  {
    icon: '🍔', title: 'Sau 1 Ngày Ăn Lệch', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    trigger: 'Ăn quá nhiều, ăn thực phẩm không lành mạnh, bỏ rau hoàn toàn 1 ngày.',
    rule: 'Một ngày ăn lệch KHÔNG thể xóa đi nhiều tuần tập luyện. Đây là sự thật sinh lý học.',
    steps: [
      'Uống nhiều nước hơn bình thường hôm nay (thêm 500ml)',
      'Ăn bữa tiếp theo bình thường — không bỏ bữa, không ăn ít hơn để "bù"',
      'Thêm một ít rau vào bữa ăn bình thường tiếp theo',
      'Đi bộ nhẹ 10–15 phút nếu có thể',
      'Ghi nhật ký: điều gì dẫn đến việc ăn lệch? Có thể tránh lần sau không?',
    ],
    avoid: 'Không nhịn ăn, không "detox", không tập bù quá mức.',
    keyFact: 'Một ngày ăn lệch không thể xóa nhiều tuần tập luyện. 1 ngày dư 2000 kcal chỉ tương đương 250–300g mỡ — bạn "nặng hơn" hôm sau chủ yếu vì glycogen và nước, không phải mỡ thật. Cảm giác tội lỗi gây hại hơn bản thân bữa ăn lệch.',
    details: [
      'Sinh lý học: cơ thể lưu glycogen trước khi chuyển thành mỡ. 1 bữa nhiều carb nạp đầy glycogen liver (~100g) và glycogen cơ (~400g) — bạn nặng hơn hôm sau chủ yếu vì nước giữ glycogen (1g glycogen giữ 3–4g nước), không phải mỡ thật.',
      'Tại sao không nhịn bù: bỏ bữa sau ăn nhiều làm cortisol tăng, kích thích cravings mạnh hơn — dễ dẫn đến cycle binge-restrict tiêu cực. Cơ thể cần tín hiệu "mọi thứ ổn" qua bữa bình thường tiếp theo.',
      'Hydration giúp gì: thêm 500ml nước giúp thận flush natri dư (từ đồ ăn mặn), giảm bloating và cảm giác nặng nề. Không phải "detox" — chỉ hỗ trợ chức năng thận xử lý natri dư bình thường.',
      'Đi bộ 10–15 phút: không phải đốt calorie bù (~60–80 kcal thôi), mà kích hoạt insulin sensitivity và cải thiện tâm trạng. Chuyển động nhẹ đưa bạn ra khỏi mood tội lỗi hiệu quả hơn ngồi nghĩ.',
      'Bữa tiếp theo quan trọng nhất: ăn bình thường — protein đủ, rau, carb vừa phải. Đây là tín hiệu cho cả não và cơ thể: không có khủng hoảng, chỉ là một ngày trong nhiều ngày bình thường.',
      'Phòng ngừa tái diễn: ghi lại cảm xúc xung quanh việc ăn lệch (stress? mệt mỏi? áp lực xã hội?). Không phán xét — đây là dữ liệu. 80% trigger của ăn lệch là cảm xúc, không phải đói thực sự.',
    ],
    points: [
      { icon: '💧', label: 'Thêm 500ml Nước', note: 'Flush natri dư, giảm bloating — không phải "detox"' },
      { icon: '🍽️', label: 'Bữa Tiếp Bình Thường', note: 'Không bỏ bữa, không ăn ít — tín hiệu "mọi thứ ổn"' },
      { icon: '🚶', label: 'Đi Bộ 10 Phút', note: 'Insulin sensitivity + tâm lý tích cực, không phải đốt bù' },
      { icon: '📓', label: 'Ghi Nhận Trigger', note: '80% ăn lệch do cảm xúc — dữ liệu để cải thiện' },
    ],
  },
  {
    icon: '💤', title: 'Sau 1 Tuần Bỏ Tập', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    trigger: 'Đi công tác, ốm, quá bận, hoặc đơn giản là mất động lực 1 tuần.',
    rule: 'Sau 1 tuần nghỉ, cơ thể vẫn giữ được hầu hết sức mạnh. Mất sức bắt đầu rõ rệt sau 2–3 tuần.',
    steps: [
      'Bắt đầu bằng bài tập nhẹ hơn 20–30% so với trước khi nghỉ',
      'Không cố "bù" — tập 5 ngày liên tiếp sau nghỉ dễ gây chấn thương',
      'Tuần đầu quay lại: 2 buổi tập thôi, cảm nhận lại cơ thể',
      'Tuần thứ 2: trở về lịch bình thường',
      'Tự hỏi: điều gì gây ra việc bỏ tập? Cần điều chỉnh lịch không?',
    ],
    avoid: 'Không tập nặng ngay lập tức. Không tự trách mình quá lâu.',
    keyFact: 'Muscle memory là thật: sau 1 tuần nghỉ, sức mạnh giảm <5%. Neural adaptation — thứ xây dựng sức mạnh — giữ nguyên đến 2–3 tuần. Quay lại với 70–80% load giúp cơ thể readapt an toàn mà không gây overuse injury cho gân và dây chằng.',
    details: [
      'Muscle memory hoạt động thế nào: các myonuclei (nhân tế bào cơ) không mất dù cơ teo nhẹ sau 1 tuần nghỉ. Khi quay lại tập, satellite cells tái kích hoạt nhanh hơn lần đầu nhờ "ký ức" cấu trúc — đây là lý do người tập lại phục hồi nhanh hơn người mới bắt đầu.',
      'Detraining timeline thực tế: 1 tuần — giảm glycolytic capacity nhẹ (~5%), sức mạnh gần như giữ nguyên; 2–3 tuần — giảm VO2max 5–10%, sức mạnh giảm 5–10%; 4+ tuần — mới thấy giảm rõ rệt. Sau 1 tuần bạn chưa mất gì đáng kể.',
      '70–80% load khi quay lại: không phải để "dễ hơn" mà để cho connective tissue (gân, dây chằng) readapt — chúng phục hồi chậm hơn cơ nhiều. Sức mạnh thần kinh giữ tốt, nhưng gân cần thêm thời gian trước khi chịu load đầy đủ an toàn.',
      'Tại sao không tập 5 ngày liên tiếp để bù: DOMS sau nghỉ thường mạnh hơn bình thường vì cơ đang readapt. Tập liên tiếp không có recovery giữa các buổi làm tăng nguy cơ chấn thương gân và overuse injury ở khớp.',
      'Tuần đầu — 2 buổi thôi: đây là chiến lược "gõ cửa lại" cho cơ thể. Mục tiêu không phải fitness gains mà là re-establish pattern và kiểm tra cơ thể đang ở đâu. Tập 2 buổi nhẹ tốt hơn 5 buổi bừa bãi nhiều.',
      'Đặt câu hỏi đúng: không phải "tôi đã mất bao nhiêu?" mà là "điều gì giúp tôi không bỏ tuần tiếp theo?" Lịch quá dày? Buổi tập quá dài? Thiếu accountability? Điều chỉnh hệ thống, không chỉ dùng thêm ý chí.',
    ],
    points: [
      { icon: '🧠', label: 'Muscle Memory Giữ Nguyên', note: 'Myonuclei tồn tại — quay lại nhanh hơn người mới nhiều' },
      { icon: '⚖️', label: 'Dùng 70–80% Load', note: 'Gân cần thêm thời gian readapt — sức mạnh thần kinh mất chậm' },
      { icon: '📅', label: '2 Buổi Tuần Đầu', note: '"Gõ cửa lại" cho cơ thể — re-establish pattern an toàn' },
      { icon: '🔍', label: 'Phân Tích Nguyên Nhân', note: 'Điều chỉnh hệ thống lịch, không chỉ cố thêm bằng ý chí' },
    ],
  },
  {
    icon: '😰', title: 'Sau Giai Đoạn Stress Cao', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&q=80&auto=format&fit=crop',
    trigger: 'Áp lực công việc, gia đình, sự kiện lớn trong cuộc sống dẫn đến mất ngủ và kiệt sức.',
    rule: 'Cortisol cao kéo dài không phải môi trường tốt để cơ thể phục hồi hay phát triển cơ bắp.',
    steps: [
      'Ưu tiên ngủ trước tiên — ngay cả khi chưa tập được gì',
      'Giảm cường độ tập xuống 40–50% trong 3–5 ngày đầu quay lại',
      'Tập calm practice ít nhất 5 phút/ngày (thở sâu, đi bộ thiên nhiên)',
      'Giảm caffeine tạm thời nếu đang dùng nhiều',
      'Chia sẻ với người thân hoặc ghi ra giấy — đừng gánh một mình',
    ],
    avoid: 'Không thêm áp lực tập luyện vào khi cortisol đã cao.',
    keyFact: 'Cortisol cao mãn tính (>2 tuần) ức chế testosterone, IGF-1 và GH — ba hormone quan trọng nhất cho phục hồi cơ bắp. Tập nặng khi cortisol đã cao không xây cơ — chỉ thêm stimulus không có recovery. Phục hồi stress TRƯỚC khi quay lại tập nặng là quyết định khoa học, không phải sự lười biếng.',
    details: [
      'Sinh lý học stress mãn tính: cortisol cao → protein catabolism tăng (phá cơ), mTOR pathway bị ức chế (block protein synthesis), testosterone giảm 15–25%. Tập nặng trong môi trường này = thêm stress vào cơ thể đang quá tải mà không có khả năng phục hồi.',
      'Tại sao ngủ là ưu tiên #1: 75–80% GH (growth hormone) tiết ra trong slow-wave sleep. Khi stress cao, giấc ngủ kém → ít GH → không rebuild được. Cải thiện ngủ là bước đầu tiên của recovery thực sự.',
      '40–50% cường độ khi quay lại: không phải "tập bình thường nhẹ hơn". Zone 1–2 có chủ đích kích hoạt parasympathetic nervous system — giảm cortisol chứ không thêm vào. Tập đúng zone nhẹ giúp recover, tập nặng làm ngược lại.',
      'Calm practice — tại sao có tác dụng: thở sâu bụng 5 phút kích hoạt vagus nerve → tăng HRV (heart rate variability) → chuyển sang rest-and-digest mode. Không cần meditation phức tạp — chỉ cần hít thở sâu đếm 4-6-8 mỗi ngày.',
      'Caffeine và cortisol: caffeine tăng cortisol thêm 30–50% trong 30–60 phút sau uống. Baseline cortisol cao + cà phê = cortisol spike rất cao. Giảm hoặc chuyển uống sáng sớm (không sau 14h) giúp cortisol pattern phục hồi nhanh hơn.',
      'Kết nối xã hội: nghiên cứu Shelley Taylor (UCLA) cho thấy kết nối xã hội tiết oxytocin, đối kháng trực tiếp cortisol. Chia sẻ với 1 người tin tưởng hiệu quả hơn nhiều so với tự xử lý một mình trong im lặng.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ Trước Tất Cả', note: '75% GH tiết khi ngủ sâu — không ngủ không recover được' },
      { icon: '☕', label: 'Giảm Caffeine', note: 'Caffeine tăng cortisol 30–50% — tránh uống sau 14h' },
      { icon: '🌿', label: 'Thở 4-6-8 Mỗi Ngày', note: 'Kích hoạt vagus nerve, giảm cortisol — 5 phút đủ rồi' },
      { icon: '🤝', label: 'Chia Sẻ 1 Người', note: 'Oxytocin từ kết nối xã hội đối kháng trực tiếp cortisol' },
    ],
  },
  {
    icon: '😴', title: 'Sau Mất Ngủ Nhiều Đêm', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    trigger: 'Khó ngủ liên tiếp 3–5 ngày, ngủ ít hơn 5 tiếng, chất lượng ngủ rất kém.',
    rule: 'Tập tạ khi thiếu ngủ nghiêm trọng tăng nguy cơ chấn thương và không giúp phục hồi cơ.',
    steps: [
      'Ưu tiên phục hồi giấc ngủ trước — không cần tập trong 1–2 ngày đầu',
      'Đặt giờ ngủ cố định, tắt màn hình 30 phút trước khi ngủ',
      'Không ngủ trưa quá 20 phút (gây khó ngủ tối)',
      'Khi ngủ đủ giấc trở lại: bắt đầu bằng vận động nhẹ (đi bộ, giãn cơ)',
      'Theo dõi nguyên nhân: caffeine muộn? Lo lắng? Thiếu routine?',
    ],
    avoid: 'Không uống thuốc ngủ nếu không có chỉ định bác sĩ.',
    keyFact: 'Ngủ đủ giấc là điều kiện tiên quyết để protein synthesis diễn ra. 75–80% GH được tiết trong slow-wave sleep. Tập tạ sau <5 giờ ngủ liên tiếp 3 ngày tăng nguy cơ chấn thương 1.7× và gần như không có protein synthesis đáng kể — tập mà không được.',
    details: [
      'GH và giấc ngủ sâu: Growth Hormone tiết mạnh nhất trong 90 phút đầu slow-wave sleep (giai đoạn 3 NREM). Thiếu ngủ → thiếu slow-wave sleep → thiếu GH → protein synthesis không diễn ra → tập chỉ phá cơ, không xây được.',
      'Reaction time và injury risk: thiếu ngủ <6 giờ/đêm trong 3 ngày giảm reaction time 20–30% — tương đương uống 2 ly bia. Khi phản xạ kém hơn, nguy cơ drop weight, mất kiểm soát form và chấn thương tăng rõ rệt khi tập tạ.',
      'Tại sao giờ ngủ cố định quan trọng: circadian rhythm điều khiển cortisol, melatonin và GH theo giờ cố định. Thay đổi giờ ngủ mỗi ngày (kể cả cuối tuần) disrupts nhịp sinh học — cơ thể không biết khi nào cần tiết melatonin.',
      'Tắt màn hình 30 phút: ánh sáng xanh (wavelength 460–480nm) ức chế melatonin secretion mạnh nhất. 30 phút dark environment trước khi ngủ đủ để melatonin bắt đầu tăng và cơ thể chuyển vào sleep mode tự nhiên.',
      'Power nap đúng cách: ngủ trưa 10–20 phút (trước 15h) cải thiện alertness 34% và performance 16% (nghiên cứu NASA). Nhưng ngủ >20 phút dễ vào deep sleep → thức dậy bị sleep inertia và giảm áp lực ngủ buổi tối.',
      'Nguyên nhân thường gặp và cách xử lý: caffeine sau 14h (half-life 5–7 giờ — cắt xuống trước 12h); lo lắng trước ngủ — write-to-clear (viết ra tất cả lo lắng, đóng sổ lại); phòng ngủ quá nóng (nhiệt độ lý tưởng 18–20°C giúp cơ thể hạ thân nhiệt cần thiết để ngủ sâu).',
    ],
    points: [
      { icon: '🌙', label: 'GH Cần Slow-Wave Sleep', note: '75% GH tiết trong 90 phút đầu ngủ sâu — không thể thay thế' },
      { icon: '⚠️', label: 'Injury Risk +1.7×', note: 'Reaction time giảm 20–30% khi thiếu ngủ 3 ngày liên tiếp' },
      { icon: '📱', label: 'Tắt Màn Hình 30 Phút', note: 'Ánh sáng xanh ức chế melatonin — cần dark environment' },
      { icon: '⏰', label: 'Giờ Ngủ Cố Định', note: 'Circadian rhythm cần consistency — kể cả cuối tuần' },
    ],
  },
];

const QUICK_ACTIONS = [
  {
    action: 'Uống 1 ly nước', why: 'Hydration là nền tảng phục hồi nhanh nhất',
    icon: '💧', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mất chỉ 1–2% nước cơ thể đã giảm hiệu suất nhận thức 10–15% và tâm trạng rõ rệt. Uống 300–500ml nước là hành động reset đơn giản nhất, nhanh nhất, và có bằng chứng khoa học rõ ràng nhất để phục hồi trạng thái bình thường.',
    details: [
      'Mất nước nhẹ (1–2%) xảy ra trước khi bạn cảm thấy khát — khát nước là tín hiệu muộn. Sau 1 ngày ăn mặn, uống ít, hoặc stress cao, cơ thể dễ ở trạng thái thiếu nước nhẹ mà không biết.',
      'Nước ảnh hưởng đến não trực tiếp: não chứa 75% là nước. Mất nước 1–2% giảm khả năng tập trung và làm tăng cảm giác mệt mỏi. University of Connecticut: thiếu nước nhẹ gây mood thấp hơn và cảm giác mọi thứ khó khăn hơn.',
      'Cơ chế flush: uống nước kích thích thận lọc và bài tiết natri dư, các chất chuyển hóa từ stress, và cortisol breakdown products. Không phải "detox" thần kỳ — chỉ là hỗ trợ chức năng sinh lý bình thường của thận.',
      'Tại sao 300–500ml thay vì "uống nhiều vào": uống quá nhanh quá nhiều (>1L trong 30 phút) có thể gây cảm giác buồn nôn và loãng natri máu nhẹ. 300–500ml trong 5–10 phút là lượng tối ưu để reset hydration nhanh và an toàn.',
      'Nước ấm vs nước lạnh: nước ấm (~40°C) kích thích peristalsis và hệ tiêu hóa tốt hơn. Nước lạnh hấp thu nhanh hơn vào máu (~20%). Cả hai đều tốt — chọn theo cảm giác cơ thể lúc đó, không cần nguyên tắc cứng nhắc.',
      'Kết hợp sau khi uống: hít thở sâu 3–5 lần. Hydration + deep breathing kết hợp tạo parasympathetic activation mạnh hơn từng thứ riêng lẻ — phục hồi từ stress nhanh hơn đáng kể so với chỉ làm 1 trong 2.',
    ],
    points: [
      { icon: '🧠', label: 'Não 75% Là Nước', note: 'Thiếu 1–2% → mood thấp, khó tập trung ngay tức thì' },
      { icon: '🚿', label: 'Flush Cortisol Dư', note: 'Thận lọc breakdown products của stress hormone' },
      { icon: '🌡️', label: '300–500ml Là Đủ', note: 'Không cần uống nhiều — đây là lượng tối ưu để reset' },
      { icon: '💨', label: 'Kết Hợp Thở Sâu', note: 'Hydration + breathing = parasympathetic activation mạnh hơn' },
    ],
  },
  {
    action: 'Đi bộ 5 phút', why: 'Kích hoạt cơ thể, cải thiện tâm trạng tức thì',
    icon: '🚶', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút đi bộ đủ để tăng BDNF (brain-derived neurotrophic factor), giảm cortisol đo được, và cải thiện mood đáng kể. Đây không phải bài tập — đây là công cụ neurochemistry tức thì không cần bất kỳ thiết bị hay chuẩn bị nào.',
    details: [
      'BDNF — "phân bón não": chỉ cần 5 phút vận động nhẹ đã kích hoạt tiết BDNF, protein tăng cường neuroplasticity và cải thiện mood. Đây là cơ chế tại sao "đi bộ giải tỏa đầu óc" không chỉ là cảm giác chủ quan — có nền tảng sinh hóa thực sự.',
      'Cortisol giảm trong 5 phút: vận động nhẹ (RPE 2–3) kích hoạt parasympathetic nervous system, trực tiếp giảm cortisol. Khác với tập nặng (tăng cortisol tạm thời) — đi bộ nhẹ đưa cortisol về baseline nhanh hơn ngồi yên.',
      'Vòng lặp dopamine: di chuyển về phía trước (locomotion) kích hoạt dopamine pathway trong não. Đây là lý do tại sao walking — đặc biệt outdoors — có tác dụng chống trầm cảm nhẹ được nghiên cứu chứng minh qua nhiều RCT.',
      'Ngoài trời > trong nhà: ánh sáng tự nhiên kích hoạt serotonin production và reset đồng hồ sinh học. 5 phút ngoài trời tốt hơn 15 phút trên máy chạy bộ trong phòng tối về tác động mood ngay lập tức.',
      'Không cần đích đến: đi vòng quanh tòa nhà, dọc hành lang, hoặc ra ban công. Mục tiêu không phải quãng đường — là thay đổi trạng thái cơ thể và môi trường visual. Thay đổi context vật lý giúp não "thoát" khỏi vòng lặp suy nghĩ.',
      'Sau khi đi bộ về: không ngồi ngay vào màn hình. 30–60 giây dừng lại, nhìn xa, thở sâu trước khi tiếp tục. Transition này củng cố tác dụng của việc đi bộ và ngăn cortisol rebound ngay lập tức.',
    ],
    points: [
      { icon: '🧬', label: 'BDNF Tức Thì', note: '5 phút đủ kích hoạt "phân bón não" — neuroplasticity' },
      { icon: '📉', label: 'Cortisol Giảm Thật Sự', note: 'Parasympathetic activation — không phải chỉ cảm giác' },
      { icon: '☀️', label: 'Ngoài Trời Tốt Hơn', note: 'Ánh sáng tự nhiên → serotonin + reset đồng hồ sinh học' },
      { icon: '🔄', label: 'Đổi Trạng Thái', note: 'Mục tiêu không phải khoảng cách — là thay đổi context' },
    ],
  },
  {
    action: 'Ăn 1 bữa có rau', why: 'Bắt đầu lại từ điều đơn giản nhất',
    icon: '🥗', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Rau xanh chứa folate — precursor của serotonin và dopamine. Một bữa có rau sau giai đoạn ăn lệch không phải "bù trừ" — đây là tín hiệu cho cả đường ruột lẫn tâm lý: "mọi thứ đang quay trở lại bình thường." Gut-brain axis phản ứng với fiber trong vòng 4–6 giờ.',
    details: [
      'Gut-brain axis và rau xanh: ~95% serotonin được sản xuất ở đường ruột, không phải não. Vi khuẩn đường ruột cần fiber từ rau để hoạt động và sản xuất neurotransmitter. Một bữa có rau ngay lập tức cung cấp substrate cho vi khuẩn có lợi.',
      'Folate và tâm trạng: rau lá xanh (rau cải, rau muống, súp lơ) giàu folate — thiếu folate liên quan đến trầm cảm và lo lắng. Không cần bổ sung nhiều ngày — ngay 1 bữa có rau đã tăng folate intake đáng kể.',
      'Tâm lý của "hành động nhỏ nhất": sau giai đoạn ăn tệ, mục tiêu không phải là bữa ăn hoàn hảo ngay lập tức — mà là 1 tín hiệu cụ thể rằng bạn đang quay lại. Rau là thứ dễ thêm nhất vào bất kỳ bữa ăn nào.',
      'Không cần rau cao cấp: cải thìa luộc, rau muống xào, canh rau ngót — rau Việt sẵn có đều đủ dinh dưỡng. Đừng hoãn vì "chưa có kale" hay "chưa mua organics". Rau nào cũng tốt hơn không có rau.',
      'Thêm rau vào bữa hiện có: không cần nấu riêng. Thêm rau thơm vào tô bún/phở, ăn thêm rau sống với bất kỳ món chính, hoặc uống 1 ly sinh tố rau quả. Lowering barrier to action là chiến lược quan trọng nhất.',
      'Reset signal cho não: ăn rau sau giai đoạn ăn lệch gửi tín hiệu tâm lý — "tôi đang chăm sóc cơ thể mình." Identity reinforcement này quan trọng không kém dinh dưỡng từ rau — nó reset mental state về lối sống lành mạnh.',
    ],
    points: [
      { icon: '🦠', label: '95% Serotonin Ở Ruột', note: 'Fiber nuôi vi khuẩn tốt → sản xuất neurotransmitter' },
      { icon: '🌿', label: 'Folate Tăng Ngay', note: 'Rau lá xanh → precursor serotonin và dopamine' },
      { icon: '🎯', label: 'Tín Hiệu Nhỏ Nhất', note: 'Không cần bữa hoàn hảo — 1 phần rau là đủ để restart' },
      { icon: '🥬', label: 'Rau Nào Cũng Được', note: 'Cải thìa, rau muống, rau ngót — không cần rau cao cấp' },
    ],
  },
  {
    action: 'Ngủ đúng giờ tối nay', why: 'Giấc ngủ là công cụ phục hồi mạnh nhất',
    icon: '🌙', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Một đêm ngủ đúng giờ và đủ giấc reset cortisol về baseline, tăng GH tiết trong slow-wave sleep, và cải thiện insulin sensitivity cho ngày hôm sau. Không có supplement hay bài tập nào thay thế được 1 đêm ngủ tốt về khả năng phục hồi toàn diện.',
    details: [
      'Tại sao "đúng giờ" quan trọng không kém "đủ giờ": circadian rhythm tiết melatonin theo giờ cố định — ngủ lúc 23h khác với ngủ lúc 2h dù cùng 8 tiếng. Ngủ sớm hơn → nhiều slow-wave sleep (giai đoạn GH tiết mạnh nhất) hơn.',
      'GH và slow-wave sleep: 75–80% GH được tiết trong 90 phút đầu tiên của giai đoạn 3 NREM (ngủ sâu). Ngủ đúng giờ → đi vào slow-wave sleep sớm hơn trong đêm → GH peak cao hơn → phục hồi cơ và tế bào tốt hơn.',
      'Cortisol reset qua đêm: cortisol theo nhịp sinh học — tự nhiên thấp nhất lúc nửa đêm đến 3h sáng và bắt đầu tăng từ 6–8h sáng. 1 đêm ngủ tốt cho phép cycle này hoàn thành đúng nghĩa — cortisol về baseline.',
      'Insulin sensitivity ngày hôm sau: chỉ 1 đêm thiếu ngủ giảm insulin sensitivity 25%. Ngủ đủ giấc đúng giờ = bữa sáng hôm sau cơ thể xử lý glucose tốt hơn → ít tích mỡ hơn, năng lượng ổn định hơn suốt buổi sáng.',
      'Chuẩn bị ngủ đúng giờ trong 30 phút: tắt màn hình, giảm ánh sáng (dim → melatonin bắt đầu tăng), viết ra 3 việc quan trọng cần làm ngày mai (clearing mental RAM), nhiệt độ phòng 18–20°C. Không cần ritual phức tạp.',
      'Nếu không ngủ được ngay: đừng stress về việc không ngủ — sleep anxiety là nguyên nhân phổ biến nhất của insomnia. Nằm im, thở chậm, và để cơ thể nghỉ ngơi cũng có giá trị ngay cả khi chưa ngủ được.',
    ],
    points: [
      { icon: '⏰', label: '"Đúng Giờ" Quan Trọng', note: 'Ngủ sớm → nhiều slow-wave sleep → GH peak cao hơn' },
      { icon: '📉', label: 'Cortisol Về Baseline', note: 'Cycle sinh học hoàn thành đúng nghĩa trong 1 đêm tốt' },
      { icon: '⚡', label: 'Insulin Sensitivity +25%', note: 'Ngủ đủ → cơ thể xử lý glucose tốt hơn ngày hôm sau' },
      { icon: '📝', label: 'Clear Mental RAM', note: 'Viết 3 việc ngày mai trước ngủ — giảm lo lắng đêm khuya' },
    ],
  },
];

const GENERAL_RULES = [
  'Một ngày tệ không phải thất bại — đó là dữ liệu để học hỏi',
  'Lỡ nhịp là chuyện bình thường với 100% người luyện tập lâu dài',
  'Reset nhanh nhất là bắt đầu lại với mục tiêu nhỏ nhất có thể',
  'Không bao giờ bù tập bằng cách tập gấp đôi — dễ chấn thương',
  'Nếu lỡ nhịp nhiều hơn 1 lần/tuần — lịch đang quá tham vọng, cần điều chỉnh',
];

function QuickModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = QUICK_ACTIONS[idx];
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
          <img src={item.img} alt={item.action} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Reset Ngay Lập Tức — {idx + 1}/{QUICK_ACTIONS.length}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: item.color }}>{item.action}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{item.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
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
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {QUICK_ACTIONS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function ResetModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const s = RESET_SCENARIOS[idx];
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
        style={{ background: '#0d0d0d', borderColor: `rgba(${s.rgb},0.28)`, boxShadow: `0 0 80px rgba(${s.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={s.img} alt={s.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${s.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${s.rgb},0.18)`, border: `2px solid rgba(${s.rgb},0.45)` }}>{s.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${s.rgb},0.6)` }}>Reset Protocol — {idx + 1}/{RESET_SCENARIOS.length}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: s.color }}>{s.title}</h2>
          <div className="border-l-2 pl-4 py-2 mb-6 rounded-r-xl" style={{ borderColor: s.color, background: `rgba(${s.rgb},0.06)` }}>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.88)' }}>{s.keyFact}</p>
          </div>
          <ul className="space-y-3 mb-8">
            {s.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${s.rgb},0.14)`, color: s.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {s.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${s.rgb},0.06)`, border: `1px solid rgba(${s.rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl text-sm mb-6" style={{ background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid #ef4444' }}>
            <strong className="text-red-400">⛔ Tránh: </strong><span style={{ color: 'rgba(209,213,219,0.85)' }}>{s.avoid}</span>
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? s.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${s.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${s.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {RESET_SCENARIOS.length}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? s.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${s.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${s.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ToolsResetProtocolPage() {
  const { t: tT } = useTranslation('tools');
  const [open, setOpen] = useState(null);
  const [resetModal, setResetModal] = useState(null);
  const [quickModal, setQuickModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-rp-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fRpOrbitSpin { to { --f-rp-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-rp-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fRpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🔄</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('reset_protocol.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('reset_protocol.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('reset_protocol.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80&auto=format&fit=crop" alt="Reset protocol" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('reset_protocol.img_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* General mindset */}
      <RevealBlock delay={0} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-xl mb-3" style={{ color: COLOR }}>🧠 Mindset Trước Khi Reset</h3>
          <ul className="space-y-2">
            {GENERAL_RULES.map((r, i) => (
              <li key={i} className="flex gap-2 text-lg text-muted">
                <span style={{ color: COLOR }} className="shrink-0">→</span>{r}
              </li>
            ))}
          </ul>
        </div>
      </RevealBlock>

      {/* Scenarios */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>4 Tình Huống Reset Thường Gặp</h2>
        <p className="text-muted text-lg mb-6">Nhấn vào tình huống bạn đang gặp để xem protocol cụ thể. Hover → <span style={{ color: COLOR }}>Chi tiết</span> để xem phân tích sâu.</p>
        <div className="space-y-3">
          {RESET_SCENARIOS.map((s, i) => (
            <div key={i} className="rounded-2xl overflow-hidden group"
              style={{ border: `1px solid ${resetModal === i ? `rgba(${s.rgb},0.45)` : 'var(--border)'}`, background: 'var(--surface)', transition: 'border-color 0.2s' }}>
              <div className="flex items-center">
                <button onClick={() => setOpen(open === i ? null : i)} className="flex-1 flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors">
                  <span className="text-3xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-text">{s.title}</div>
                    <div className="text-base text-muted mt-0.5">{s.trigger.slice(0, 60)}...</div>
                  </div>
                  <span className="text-muted">{open === i ? '▲' : '▼'}</span>
                </button>
                <button onClick={() => setResetModal(i)}
                  className="shrink-0 mr-3 text-xs font-bold px-3 py-1.5 rounded-full border opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ color: s.color, borderColor: `rgba(${s.rgb},0.35)`, background: `rgba(${s.rgb},0.08)` }}>
                  Chi tiết →
                </button>
              </div>
              {open === i && (
                <div className="px-4 pb-5 border-t border-border pt-4 space-y-4">
                  <div className="p-3 rounded-xl text-base" style={{ background: `${s.color}10`, borderLeft: `3px solid ${s.color}` }}>
                    <strong style={{ color: s.color }}>🔬 Sự thật:</strong> <span className="text-muted">{s.rule}</span>
                  </div>
                  <div>
                    <div className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: s.color }}>Protocol Reset</div>
                    <ol className="space-y-2">
                      {s.steps.map((step, j) => (
                        <li key={j} className="flex gap-3 text-lg text-muted">
                          <span className="font-bold shrink-0" style={{ color: s.color }}>{j + 1}.</span>{step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-3 rounded-xl text-base" style={{ background: 'rgba(239,68,68,0.08)', borderLeft: '3px solid #ef4444' }}>
                    <strong className="text-red-400">⛔ Tránh:</strong> <span className="text-muted">{s.avoid}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Quick reset */}
      <RevealBlock delay={2} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>⚡ Reset Ngay Lập Tức (1 Hành Động)</h2>
        <p className="text-muted text-lg mb-4">Click vào từng hành động để xem khoa học đằng sau.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((item, i) => (
            <div key={i}
              onClick={() => setQuickModal(i)}
              className="rounded-xl border bg-surface p-4 cursor-pointer group transition-all hover:bg-white/5"
              style={{ borderColor: quickModal === i ? `rgba(${item.rgb},0.45)` : 'var(--border)', transition: 'border-color 0.2s' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{item.icon}</span>
                <div className="font-bold text-text text-lg" style={{ color: item.color }}>{item.action}</div>
                <span className="ml-auto text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  style={{ color: item.color }}>Chi tiết →</span>
              </div>
              <div className="text-base text-muted">{item.why}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

      {quickModal !== null && (
        <QuickModal
          idx={quickModal}
          onClose={() => setQuickModal(null)}
          onPrev={() => setQuickModal(i => Math.max(0, i - 1))}
          onNext={() => setQuickModal(i => Math.min(QUICK_ACTIONS.length - 1, i + 1))}
          hasPrev={quickModal > 0}
          hasNext={quickModal < QUICK_ACTIONS.length - 1}
        />
      )}
      {resetModal !== null && (
        <ResetModal
          idx={resetModal}
          onClose={() => setResetModal(null)}
          onPrev={() => setResetModal(i => Math.max(0, i - 1))}
          onNext={() => setResetModal(i => Math.min(RESET_SCENARIOS.length - 1, i + 1))}
          hasPrev={resetModal > 0}
          hasNext={resetModal < RESET_SCENARIOS.length - 1}
        />
      )}
    </div>
  );
}
