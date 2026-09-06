import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#22c55e';
const RGB = '34,197,94';
const ORBIT_ID = 'f-wl-orbit-kf';
const ORBIT_CLASS = 'f-wl-orbit-ring';
const LS_KEY = 'healthapp_f_workout';

const EXERCISE_TEMPLATES = [
  { name: 'Squat', muscles: 'Đùi, mông', type: 'Sức mạnh' },
  { name: 'Push-up', muscles: 'Ngực, vai, tam đầu', type: 'Sức mạnh' },
  { name: 'Romanian Deadlift', muscles: 'Đùi sau, mông, lưng', type: 'Sức mạnh' },
  { name: 'Dumbbell Row', muscles: 'Lưng trên, nhị đầu', type: 'Sức mạnh' },
  { name: 'Plank', muscles: 'Core', type: 'Ổn định' },
  { name: 'Glute Bridge', muscles: 'Mông, đùi sau', type: 'Sức mạnh' },
  { name: 'Đi bộ', muscles: 'Cardio toàn thân', type: 'Cardio' },
  { name: 'Chạy bộ', muscles: 'Cardio toàn thân', type: 'Cardio' },
];

const RPE_LABELS = ['', 'Rất nhẹ', 'Nhẹ', 'Vừa nhẹ', 'Vừa', 'Vừa nặng', 'Nặng', 'Rất nặng', 'Gần tối đa', 'Tối đa', 'Siêu tối đa'];
const RPE_COLORS = ['', '#14b8a6', '#22c55e', '#22c55e', '#84cc16', '#f59e0b', '#f59e0b', '#ef4444', '#ef4444', '#ef4444', '#7c3aed'];

const RPE_ITEMS = [
  {
    level: 1, label: 'Rất nhẹ', color: '#14b8a6', rgb: '20,184,166',
    icon: '🌬️',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 1 tương đương đứng yên hoặc đi dạo cực nhẹ. Nhịp tim chỉ tăng 5–10% so với trạng thái nghỉ. Đây là mức baseline — không đủ kích thích thích ứng thể chất, nhưng là nền tảng cho warm-up và recovery.',
    details: [
      'Ở RPE 1, cơ thể hoạt động dưới aerobic threshold rất xa — hầu như không có sự thay đổi về sinh lý so với ngồi yên. Nhịp tim 55–65 bpm, thở hoàn toàn thoải mái qua mũi.',
      'Ứng dụng thực tế: không được dùng làm buổi tập chính. RPE 1 phù hợp cho warm-up cực nhẹ (2–3 phút trước khi tăng cường độ) hoặc ngay sau buổi tập nặng để flush lactic acid.',
      'Active recovery ở RPE 1–2: đi bộ chậm 10 phút sau buổi tập giúp giảm DOMS (đau cơ muộn) tốt hơn ngồi nghỉ nhờ tăng lưu thông máu đến cơ mà không tạo thêm stress.',
      'Nếu mục tiêu là đốt mỡ, RPE 1 không đủ — cần ít nhất RPE 4–5 để kích hoạt lipid oxidation đáng kể. RPE 1 chỉ đốt ~2–3 kcal/phút từ mỡ, không hơn ngồi nhiều.',
      'Zone 1 training (nhịp tim <60% max) có tác dụng xây dựng aerobic base cho vận động viên elite — nhưng người mới bắt đầu nên ưu tiên Zone 2–3 trước khi lo Zone 1.',
      'Dấu hiệu nhận biết: có thể hát một bài hát hoàn chỉnh mà không bị ngắt hơi, hoàn toàn không có cảm giác khó chịu, có thể duy trì giờ.',
    ],
    points: [
      { icon: '💨', label: 'Nhịp Tim 55–65 bpm', note: 'Không đủ kích thích thích ứng — chỉ dùng cho recovery' },
      { icon: '🚶', label: 'Đi Dạo Nhẹ', note: 'Flush lactic acid sau tập nặng, tốt hơn nghỉ nguyên' },
      { icon: '🎵', label: 'Có Thể Hát Được', note: 'Thở hoàn toàn thoải mái qua mũi suốt buổi' },
      { icon: '⏱️', label: 'Dùng Cho Warm-up', note: '2–3 phút trước khi tăng dần cường độ' },
    ],
  },
  {
    level: 3, label: 'Vừa nhẹ', color: '#22c55e', rgb: '34,197,94',
    icon: '🚶',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 3 là Zone 2 — ngưỡng vàng cho sức bền aerobic. Nghiên cứu của Stephen Seiler cho thấy 80% buổi tập của vận động viên elite ở Zone 2. Nhịp tim 60–70% max, đủ kích thích mitochondria tăng sinh mà không gây overtraining.',
    details: [
      'RPE 3 kích hoạt quá trình tổng hợp mitochondria (mitochondrial biogenesis) — tăng "nhà máy năng lượng" trong tế bào cơ. Đây là nền tảng của sức bền dài hạn không thể xây dựng ở cường độ cao.',
      'Talk test: có thể nói chuyện thành câu hoàn chỉnh, nhưng không muốn nói dài. Đây là dấu hiệu đang ở aerobic threshold thấp — fat oxidation đạt mức tối ưu (60–70% năng lượng từ mỡ).',
      'Ideal cho đi bộ nhanh, đạp xe thoải mái, bơi nhẹ, yoga động. Thời gian khuyến nghị: 30–60 phút. Người mới bắt đầu nên xây dựng 3–4 buổi RPE 3–4/tuần trước khi thêm cường độ cao.',
      'Fat burning peak: ở RPE 3–4, tỷ lệ đốt mỡ trên tổng năng lượng cao nhất (~65%). Dù số kcal/phút ít hơn RPE 7–8, nhưng % từ mỡ cao hơn — phù hợp cho mục tiêu giảm mỡ bền vững.',
      'Giảm cortisol: buổi tập RPE 3 thực sự giảm cortisol (hormone stress), trái với RPE 8+ có thể tăng cortisol nếu không đủ recovery. Tốt cho người đang căng thẳng cao.',
      'Duy trì 30 phút ở RPE 3 cải thiện insulin sensitivity, giảm huyết áp, và hỗ trợ giấc ngủ — ngay cả khi không có kết quả thẩm mỹ rõ ràng. Lợi ích sức khỏe là toàn diện và ngay lập tức.',
    ],
    points: [
      { icon: '🏭', label: 'Tăng Mitochondria', note: 'Zone 2 — nền tảng sức bền dài hạn không thể thay thế' },
      { icon: '🔥', label: 'Fat Burning Tối Ưu', note: '~65% năng lượng từ mỡ — lý tưởng cho giảm mỡ bền vững' },
      { icon: '😌', label: 'Giảm Cortisol', note: 'Tập Zone 2 giảm stress hormone, tốt cho recovery' },
      { icon: '💬', label: 'Talk Test Pass', note: 'Nói câu hoàn chỉnh được nhưng không muốn nói dài' },
    ],
  },
  {
    level: 5, label: 'Vừa nặng', color: '#f59e0b', rgb: '245,158,11',
    icon: '🏃',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 5 là aerobic threshold trên — cơ thể bắt đầu chuyển từ fat-dominant sang carb-dominant fuel. Vùng này (Zone 3) thường bị "ô nhiễm" nhất trong chương trình tập — không đủ dễ để recover, không đủ khó để kích thích. Dùng có mục đích, không vô tình.',
    details: [
      'Ở RPE 5, cơ thể bắt đầu sử dụng nhiều glycogen hơn mỡ. Lactate bắt đầu tích lũy nhẹ nhưng cơ thể vẫn xử lý được. Nhịp tim ~70–80% max, thở nhanh hơn nhưng còn kiểm soát được.',
      'Ventilatory threshold 1 (VT1): RPE 5 xấp xỉ VT1 — ngưỡng bạn bắt đầu thở nặng hơn rõ rệt và cảm thấy hơi khó nói chuyện. Phía trên VT1, cơ thể bắt đầu thở bù không chỉ để cung O2.',
      '"Zone 3 trap": nhiều người tập trung vào Zone 3 (RPE 5–6) vì cảm giác "đang nỗ lực" nhưng không quá khó. Thực ra đây là vùng fatigue cao mà adaptation ít nhất. Polarized training (Zone 2 + Zone 4–5) hiệu quả hơn nhiều.',
      'Dùng hợp lý ở RPE 5: tempo run ngắn (20–25 phút), đạp xe tempo, swimming intervals. Không phù hợp làm buổi tập dài (>45 phút) hoặc tập hằng ngày.',
      'Recovery: sau buổi tập RPE 5 kéo dài, cần 24–36 giờ để phục hồi đầy đủ. Không nên xếp 2 buổi RPE 5+ liên tiếp không có ngày recovery ở giữa.',
      'Dấu hiệu nhận biết: nói được 3–4 từ liền trước khi cần thở lại, cảm thấy cần tập trung vào nhịp thở, mồ hôi xuất hiện trong 5–10 phút đầu.',
    ],
    points: [
      { icon: '⚡', label: 'Glycogen Dominant', note: 'Chuyển sang dùng carb nhiều hơn — cần bổ sung trước tập' },
      { icon: '⚠️', label: 'Zone 3 Trap', note: 'Vùng nguy hiểm: fatigue cao, adaptation ít — dùng có mục đích' },
      { icon: '⏱️', label: 'Giới Hạn 20–25 Phút', note: 'Tempo run hoặc intervals — không phù hợp tập dài' },
      { icon: '🔄', label: '24–36h Recovery', note: 'Cần ít nhất 1 ngày phục hồi sau buổi tập ở vùng này' },
    ],
  },
  {
    level: 6, label: 'Nặng', color: '#f59e0b', rgb: '245,158,11',
    icon: '💪',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 6 là vùng lactate threshold (LT) — ngưỡng lactate tích lũy nhanh hơn cơ thể xử lý. Tập đều ở đây cải thiện LT đáng kể, cho phép duy trì cường độ cao lâu hơn. Đây là mức đích cho sức mạnh endurance và circuit training hiệu quả.',
    details: [
      'Lactate threshold: ở RPE 6, lactate máu thường ở 2–4 mmol/L — ranh giới giữa thoải mái và bắt đầu "cháy cơ". Luyện tập sát LT nâng ngưỡng này lên, cho phép tập nặng hơn mà không tích lactate.',
      'Strength endurance zone: RPE 6 là mức lý tưởng cho circuit training 3–4 rounds, AMRAP moderate, hoặc supersets với nghỉ đủ. Đủ nặng để kích thích cơ học (mechanical tension) mà không quá tải hệ thần kinh.',
      'Nói chuyện bị gián đoạn: chỉ nói được 1–2 từ giữa các nhịp thở. Đây là dấu hiệu đang ở hoặc vượt VT2 (ventilatory threshold 2) — thở bù tăng đột ngột do lactate kích thích trung tâm hô hấp.',
      'Frequency: RPE 6 phù hợp 2–3 buổi/tuần với recovery đủ. Người mới tập chưa nên tiếp cận vùng này trong 4–6 tuần đầu — xây aerobic base trước để buổi tập RPE 6 có ý nghĩa hơn.',
      'Weight training application: khi tập tạ, RPE 6 = 3–4 reps trong reserve (RIR 3–4). Đây là vùng tập hypertrophy hiệu quả mà không gây fatigue thần kinh quá mức — có thể duy trì nhiều sets.',
      'Cảm giác sau 48 giờ: DOMS (đau cơ muộn) nhẹ đến vừa, thường ở 24–48h. Nếu đau nhiều hơn, có thể đã thực sự ở RPE 7–8 không phải 6.',
    ],
    points: [
      { icon: '🧪', label: 'Lactate Threshold', note: 'Tập đều ở đây nâng ngưỡng LT — endurance tốt hơn' },
      { icon: '🔄', label: 'Circuit Training', note: 'Lý tưởng cho AMRAP và supersets 3–4 rounds' },
      { icon: '💪', label: 'RIR 3–4 Khi Tập Tạ', note: '3–4 reps dự trữ — hypertrophy hiệu quả, ít mệt thần kinh' },
      { icon: '📅', label: '2–3 Buổi/Tuần', note: 'Cần recovery đủ — không tập RPE 6+ liền ngày' },
    ],
  },
  {
    level: 7, label: 'Rất nặng', color: '#ef4444', rgb: '239,68,68',
    icon: '🔥',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 7 là ngưỡng sức mạnh tối ưu — đủ nặng để kích thích maximum motor unit recruitment mà vẫn còn 2–3 reps dự trữ. Đây là sweet spot cho strength gain: mechanical tension cao, volume đủ, không overreach. Hầu hết strength sets nên kết thúc ở RPE 7–8.',
    details: [
      'Motor unit recruitment: ở RPE 7, cơ thể bắt đầu recruit high-threshold motor units (Type II fast-twitch fibers). Đây là điều kiện cần thiết để kích thích hypertrophy và strength adaptation.',
      'RIR 2–3 (Reps in Reserve): ngừng khi còn 2–3 reps đến failure. Nghiên cứu của Mike Zourdos cho thấy training ở RIR 2–3 an toàn hơn training to failure trong khi vẫn giữ ~95% stimulus của failure.',
      'Dấu hiệu kỹ thuật: ở RPE 7, kỹ thuật vẫn còn clean và kiểm soát được. Nếu form bắt đầu breakdown, bạn đã vượt RPE 7 — đó là tín hiệu dừng set dù chưa đến số reps dự kiến.',
      'Volume capacity: có thể thực hiện 4–6 sets ở RPE 7 với cùng weight trước khi cần giảm tải. Đây là basis của progressive overload — tăng dần số sets/reps ở cùng RPE trước khi tăng tải.',
      'Cardio ở RPE 7: HIIT intervals ngắn (30–60 giây), threshold run 10–15 phút. Không phải vùng để duy trì dài — glycogen cạn nhanh, lactate tăng mạnh, neural fatigue cao.',
      'Recovery sau RPE 7: 48 giờ cho cơ nhóm nhỏ (vai, cánh tay), 72 giờ cho cơ nhóm lớn (lưng, chân). Protein synthesis peak ở 24–48h sau tập — đây là cửa sổ dinh dưỡng quan trọng.',
    ],
    points: [
      { icon: '⚡', label: 'Motor Unit Tối Đa', note: 'Kích hoạt fast-twitch fibers — cần thiết cho sức mạnh' },
      { icon: '🎯', label: 'RIR 2–3 Sweet Spot', note: '95% stimulus của failure, an toàn hơn nhiều' },
      { icon: '✅', label: 'Form Vẫn Clean', note: 'Kỹ thuật kiểm soát được — dừng nếu form breakdown' },
      { icon: '⏳', label: '48–72h Recovery', note: 'Cơ lớn cần 72h — đây là cửa sổ dinh dưỡng quan trọng' },
    ],
  },
  {
    level: 8, label: 'Gần tối đa', color: '#ef4444', rgb: '239,68,68',
    icon: '🌋',
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 8 = RIR 1–2 — chỉ còn 1–2 reps đến failure. Đây là vùng peaking: kích thích neural adaptation tối đa, xây sức mạnh tuyệt đối. Dùng cho competition prep hoặc deload week sau chu kỳ volume. Không phù hợp làm baseline — cần periodization.',
    details: [
      'Neural adaptation peak: RPE 8+ kích thích tối đa hệ thần kinh, tăng firing rate và synchronization của motor units — đây là cơ chế tăng sức mạnh nhanh nhất không phụ thuộc vào hypertrophy.',
      'RIR 1–2: 1 hoặc 2 reps trước technical failure. Kỹ thuật bắt đầu thay đổi nhẹ ở rep cuối nhưng vẫn an toàn. Đây là ranh giới mỏng với RPE 9 (failure) — cần kinh nghiệm tự đánh giá chính xác.',
      'Injury risk: thống kê cho thấy RPE 8–9 có injury rate cao hơn 3× so với RPE 6–7, đặc biệt với deadlift và squat. Không nên tập RPE 8+ khi mệt mỏi, thiếu ngủ, hoặc đang có discomfort cơ khớp.',
      'Periodization: chỉ dùng RPE 8 trong 1–2 tuần cuối của mesocycle (peaking phase) sau 4–6 tuần build-up ở RPE 6–7. Tiếp cận RPE 8 ngay từ đầu là sai lầm phổ biến nhất của người mới.',
      'Cardio ở RPE 8: sprint intervals (10–20 giây), VO2max intervals (3–5 phút). Cực kỳ effective cho VO2max improvement nhưng tạo recovery debt lớn — tối đa 1–2 buổi/tuần.',
      'Dấu hiệu nhận biết: không thể nói bất kỳ từ nào, tập trung 100% vào bài tập, cảm giác "toàn thân nỗ lực", mặt đỏ, mồ hôi nhiều, thở gấp ngay khi dừng set.',
    ],
    points: [
      { icon: '🧠', label: 'Neural Adaptation Max', note: 'Tăng sức mạnh nhanh nhất qua cơ chế thần kinh' },
      { icon: '⚠️', label: 'Injury Risk 3×', note: 'Không tập khi mệt, thiếu ngủ, hay có discomfort' },
      { icon: '📅', label: 'Chỉ Dùng Peaking', note: '1–2 tuần cuối mesocycle sau build-up đủ' },
      { icon: '🏃', label: 'Sprint Intervals', note: '10–20 giây all-out — tối đa 2 buổi/tuần' },
    ],
  },
  {
    level: 9, label: 'Tối đa', color: '#ef4444', rgb: '239,68,68',
    icon: '💥',
    img: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 9 = 1 rep đến technical failure. Cực kỳ hiệu quả cho sức mạnh tuyệt đối nhưng neural fatigue rất cao — cần 72–96 giờ recovery. Chỉ dành cho người tập lâu năm với kỹ thuật hoàn thiện. Người mới dưới 2 năm không nên tiếp cận vùng này thường xuyên.',
    details: [
      'Technical failure: rep cuối trước khi kỹ thuật bị phá vỡ (không nhất thiết là cơ không co được). Người có kinh nghiệm phân biệt technical failure và absolute failure — quan trọng để tránh chấn thương.',
      'Neural fatigue tích lũy: tập RPE 9 liên tục 3+ tuần mà không deload thường dẫn đến overreaching — biểu hiện là sức mạnh plateau hoặc giảm, ngủ nhiều hơn bình thường, mood thấp, resting HR tăng.',
      'Dùng hợp lý: test 1RM định kỳ (mỗi 6–8 tuần) để calibrate training loads; competition attempt; prove point sau chu kỳ tập dài. Không phải routine hàng tuần.',
      'Safety protocol bắt buộc: LUÔN có spotter cho squat, bench press, overhead press khi ở RPE 9. Không thương lượng — không có exception. Deadlift: có thể tự perform nhưng cần biết kỹ thuật drop bar.',
      'RPE 9 cardio: absolute sprint (100m dash, Assault Bike max), VO2max test. Cảm giác "phổi bốc lửa", chân không đáp ứng dù não muốn tiếp tục. Không duy trì được quá 60 giây.',
      'Dấu hiệu nguy hiểm cần dừng ngay: chóng mặt, đau ngực, nhìn mờ, cảm giác sắp ngất. RPE 9 không phải lý do để push through pain — phân biệt discomfort (OK) với pain (dừng ngay).',
    ],
    points: [
      { icon: '🧠', label: 'Technical Failure', note: 'Form breakdown — không nhất thiết cơ hết lực hoàn toàn' },
      { icon: '😴', label: '72–96h Recovery', note: 'Neural fatigue cao — xếp lịch recovery nghiêm túc' },
      { icon: '👥', label: 'Bắt Buộc Có Spotter', note: 'Squat/Bench/OHP ở RPE 9 — không exception' },
      { icon: '📊', label: 'Test 1RM 6–8 Tuần', note: 'Dùng để calibrate load — không phải routine weekly' },
    ],
  },
  {
    level: 10, label: 'Siêu tối đa', color: '#7c3aed', rgb: '124,58,237',
    icon: '☄️',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'RPE 10 = absolute failure — không thể thực hiện thêm 1 rep/giây dù cố gắng tối đa. Cực kỳ hiếm khi cần thiết, chỉ trong competitive context. Tập to failure thường xuyên gây overtraining, không cần thiết cho 95% người tập. Nghiên cứu cho thấy RIR 0–1 và RIR 2–3 có cùng hypertrophy kết quả với ít systemic fatigue hơn nhiều.',
    details: [
      'Absolute failure: cơ không thể tạo đủ lực để hoàn thành movement dù có sự trợ giúp của toàn thân. Đây là điểm cơ thể sẽ tự ngắt (protective inhibition) — một cơ chế bảo vệ tiến hóa.',
      'Protective inhibition: SNC tự giảm signal đến cơ khi phát hiện nguy cơ chấn thương quá cao. Cảm giác "cơ không nghe lời" khi ở absolute failure là protective mechanism, không phải weakness.',
      'Science về failure training: meta-analysis 2021 của Refalo et al. (16 nghiên cứu) cho thấy training to failure không tạo thêm hypertrophy so với RIR 2–3 nhưng tăng recovery time 40–60%. Kết luận: failure không cần thiết cho size.',
      'Khi nào RPE 10 có giá trị: powerlifting/weightlifting competition (attempt 3 — all-out); forced reps với spotter để kéo dài TUT (time under tension) cho hypertrophy cực độ; testing absolute strength.',
      'Tâm lý học RPE 10: nhiều người overestimate RPE của họ — nghiên cứu cho thấy 70% người "tập đến failure" thực tế vẫn còn 2–3 reps. Thực sự ở RPE 10 là rất hiếm và kiệt sức thật sự.',
      'Recovery từ RPE 10: ít nhất 96–120 giờ cho cơ nhóm lớn. Hệ thần kinh cần thêm 24–48 giờ sau khi cơ đã hồi phục. Không tập cùng nhóm cơ trong 5 ngày — đây là rule cứng.',
    ],
    points: [
      { icon: '🛡️', label: 'Protective Inhibition', note: 'SNC tự ngắt — cơ chế bảo vệ tự nhiên của cơ thể' },
      { icon: '📊', label: 'Không Cần Cho Hypertrophy', note: 'RIR 2–3 cho kết quả tương đương với ít fatigue hơn' },
      { icon: '🏆', label: 'Chỉ Dùng Cho Competition', note: 'Attempt 3 powerlifting — không phải training thường xuyên' },
      { icon: '⏳', label: '96–120h Recovery', note: '5 ngày không tập cùng nhóm cơ — rule cứng' },
    ],
  },
];

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

function RpeModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = RPE_ITEMS[idx];
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
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-4xl font-black leading-none" style={{ color: item.color }}>{item.level}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>RPE {item.level} / 10 — {idx + 1} of {RPE_ITEMS.length}</p>
          <h2 className="font-bold text-2xl md:text-3xl mb-5" style={{ color: item.color }}>{item.label}</h2>
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
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>← RPE {hasPrev ? RPE_ITEMS[idx - 1]?.level : ''}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>RPE {item.level}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>RPE {hasNext ? RPE_ITEMS[idx + 1]?.level : ''} →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ToolsWorkoutLogPage() {
  const { t: tT } = useTranslation('tools');
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), exercise: '', sets: '', reps: '', weight: '', duration: '', rpe: 7, note: '' });
  const [showTemplate, setShowTemplate] = useState(false);
  const [rpeModal, setRpeModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-wl-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fWlOrbitSpin { to { --f-wl-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-wl-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fWlOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const saveLog = () => {
    if (!form.exercise) return;
    const entry = { ...form, id: Date.now() };
    const next = [entry, ...logs].slice(0, 30);
    setLogs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setForm({ date: new Date().toISOString().slice(0, 10), exercise: '', sets: '', reps: '', weight: '', duration: '', rpe: 7, note: '' });
  };

  const deleteLog = (id) => {
    const next = logs.filter(l => l.id !== id);
    setLogs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const applyTemplate = (tmpl) => {
    setForm(f => ({ ...f, exercise: tmpl.name }));
    setShowTemplate(false);
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🏋️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('workout_log.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('workout_log.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('workout_log.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop" alt="Workout log" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('workout_log.img_caption')}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Log form */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Ghi Buổi Tập Mới</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base text-muted block mb-1">Ngày</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-base text-muted block mb-1">Bài tập</label>
              <div className="flex gap-2">
                <input type="text" value={form.exercise} onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))}
                  placeholder="Tên bài tập" className="flex-1 px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }} />
                <button onClick={() => setShowTemplate(o => !o)} className="px-3 py-2 rounded-xl text-base font-bold border" style={{ color: COLOR, borderColor: `rgba(${RGB},0.3)` }}>
                  Template
                </button>
              </div>
            </div>
          </div>

          {showTemplate && (
            <div className="rounded-xl border p-3 grid grid-cols-2 gap-2" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
              {EXERCISE_TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => applyTemplate(t)}
                  className="text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="text-lg font-medium text-text">{t.name}</div>
                  <div className="text-base text-muted">{t.muscles}</div>
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            {[['Sets', 'sets', 'số set'], ['Reps', 'reps', 'số lần'], ['Cân nặng (kg)', 'weight', '0 = bodyweight']].map(([lbl, key, ph]) => (
              <div key={key}>
                <label className="text-base text-muted block mb-1">{lbl}</label>
                <input type="number" min="0" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={ph} className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                  style={{ borderColor: `rgba(${RGB},0.3)` }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-base text-muted block mb-1">Thời gian (phút)</label>
              <input type="number" min="0" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                placeholder="tổng thời gian buổi tập" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-base text-muted block mb-1">RPE: {form.rpe}/10 — {RPE_LABELS[form.rpe]}</label>
              <input type="range" min="1" max="10" value={form.rpe} onChange={e => setForm(f => ({ ...f, rpe: +e.target.value }))}
                className="w-full" style={{ accentColor: RPE_COLORS[form.rpe] }} />
            </div>
          </div>

          <div>
            <label className="text-base text-muted block mb-1">Ghi chú (tuần sau tăng tiến thế nào?)</label>
            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={2} placeholder="vd: tăng 2.5kg hoặc thêm 1 set" className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
              style={{ borderColor: `rgba(${RGB},0.3)` }} />
          </div>

          <button onClick={saveLog} className="w-full py-3 rounded-xl font-bold text-lg text-white" style={{ background: COLOR }}>
            💾 Lưu buổi tập
          </button>
        </div>
      </RevealBlock>

      {/* Log history */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Lịch Sử Tập ({logs.length} buổi)</h2>
        {logs.length === 0 ? (
          <div className="text-center text-muted text-lg py-8">Chưa có buổi tập nào. Hãy ghi buổi đầu tiên!</div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div key={log.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-text">{log.exercise}</span>
                      <span className="text-base px-2 py-0.5 rounded-full font-bold" style={{ color: RPE_COLORS[log.rpe], background: `${RPE_COLORS[log.rpe]}15` }}>
                        RPE {log.rpe}
                      </span>
                    </div>
                    <div className="text-base text-muted flex flex-wrap gap-3">
                      <span>📅 {log.date}</span>
                      {log.sets && <span>Sets: {log.sets}</span>}
                      {log.reps && <span>Reps: {log.reps}</span>}
                      {log.weight && <span>Cân: {log.weight}kg</span>}
                      {log.duration && <span>⏱ {log.duration} phút</span>}
                    </div>
                    {log.note && <div className="text-base text-muted mt-1 italic">→ {log.note}</div>}
                  </div>
                  <button onClick={() => deleteLog(log.id)} className="text-base text-muted hover:text-red-400 transition-colors">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </RevealBlock>

      {/* RPE guide */}
      <RevealBlock delay={2} className="mb-10">
        <h3 className="font-bold mb-1" style={{ color: COLOR }}>📊 Thang RPE (Rate of Perceived Exertion)</h3>
        <p className="text-sm text-muted mb-4">Mục tiêu thông thường: RPE 6–8 cho tập sức mạnh, RPE 4–6 cho cardio. Click để xem chi tiết.</p>
        <div className="grid grid-cols-2 gap-2">
          {RPE_ITEMS.map((item, i) => (
            <div key={item.level}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer group transition-all"
              style={{ background: rpeModal === i ? `rgba(${item.rgb},0.08)` : 'transparent', border: `1px solid ${rpeModal === i ? `rgba(${item.rgb},0.35)` : 'rgba(255,255,255,0.06)'}` }}
              onClick={() => setRpeModal(i)}>
              <span className="font-black text-lg w-6 shrink-0 text-center" style={{ color: item.color }}>{item.level}</span>
              <span className="flex-1 text-base text-muted">{item.label}</span>
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: item.color }}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

      {rpeModal !== null && (
        <RpeModal
          idx={rpeModal}
          onClose={() => setRpeModal(null)}
          onPrev={() => setRpeModal(i => Math.max(0, i - 1))}
          onNext={() => setRpeModal(i => Math.min(RPE_ITEMS.length - 1, i + 1))}
          hasPrev={rpeModal > 0}
          hasNext={rpeModal < RPE_ITEMS.length - 1}
        />
      )}
    </div>
  );
}
