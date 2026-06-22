import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'f-mt-orbit-kf';
const ORBIT_CLASS = 'f-mt-orbit-ring';
const LS_KEY = 'healthapp_f_mind';

const MOODS = [
  { icon: '😤', label: 'Căng thẳng', val: 'stressed', color: '#ef4444' },
  { icon: '😞', label: 'Mệt mỏi', val: 'tired', color: '#f59e0b' },
  { icon: '😐', label: 'Bình thường', val: 'neutral', color: '#6366f1' },
  { icon: '😊', label: 'Vui vẻ', val: 'happy', color: '#22c55e' },
  { icon: '🤩', label: 'Tuyệt vời', val: 'great', color: '#14b8a6' },
];

const CALM_OPTIONS = [
  {
    label: 'Thở sâu / Box breathing', icon: '🌬️', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box breathing (4-4-4-4) kích hoạt hệ thần kinh phó giao cảm trong 90 giây — giảm cortisol, hạ nhịp tim, tắt phản ứng "fight or flight". Navy SEAL sử dụng kỹ thuật này trước nhiệm vụ áp lực cao để duy trì bình tĩnh và rõ ràng trong tư duy.',
    details: [
      'Cơ chế sinh lý: hít thở chậm kích thích dây thần kinh phế vị (vagus nerve) — kết nối não với tim, phổi, ruột. Kích thích vagus nerve tăng HRV (heart rate variability), tín hiệu hệ phó giao cảm đang active và cơ thể ở trạng thái "rest & digest" thay vì "fight or flight".',
      'Box breathing 4-4-4-4: Hít vào 4 giây → Nín thở 4 giây → Thở ra 4 giây → Nín 4 giây → Lặp lại. 5 chu kỳ = ~2 phút là đủ để giảm cortisol đo được. Bắt đầu với 3-3-3-3 nếu chưa quen nín thở.',
      '4-7-8 breathing (Dr. Andrew Weil): Hít 4 giây → Nín 7 giây → Thở ra 8 giây. Nín thở lâu hơn tăng CO2 nhẹ → giãn mạch máu → thư giãn sâu hơn. Đặc biệt tốt trước khi ngủ.',
      'Physiological sigh (Andrew Huberman): Hít vào mũi → Hít thêm 1 hơi ngắn (double inhale) → Thở ra dài qua miệng. 1–3 lần đủ giảm lo âu ngay lập tức — đây là phản xạ tự nhiên não dùng để reset hệ thần kinh khi bị overwhelm.',
      'Thời điểm tốt nhất: trước cuộc họp áp lực, sau tin xấu, khi bắt đầu cảm thấy overwhelmed, trước khi ngủ. Hiệu quả nhất khi thực hành đều đặn hằng ngày — não "học" liên kết kỹ thuật này với bình tĩnh qua điều kiện hóa Pavlov.',
      'Tích hợp vào routine: đặt reminder 3 lần/ngày (sáng thức dậy, sau bữa trưa, trước ngủ). Mỗi lần 2–3 phút. Sau 2 tuần thực hành nhất quán, hệ thần kinh phản ứng nhanh hơn với kỹ thuật này nhờ neuroplasticity.',
    ],
    points: [
      { icon: '⏱️', label: 'Hiệu Quả Trong 90 Giây', note: 'Vagus nerve kích hoạt phó giao cảm — giảm cortisol đo được' },
      { icon: '🔢', label: 'Box: 4-4-4-4', note: 'Navy SEAL dùng trước nhiệm vụ áp lực cao — đơn giản và hiệu quả' },
      { icon: '😮‍💨', label: 'Physiological Sigh', note: 'Double inhale + thở ra dài — reset nhanh nhất, chỉ 1–3 lần' },
      { icon: '🧠', label: 'Neuroplasticity 2 Tuần', note: 'Luyện đều đặn — não học phản xạ bình tĩnh tự động hơn' },
    ],
  },
  {
    label: 'Thiền 5–10 phút', icon: '🧘', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 8 tuần thiền mindfulness 10 phút/ngày thay đổi vật lý não — tăng grey matter ở prefrontal cortex (ra quyết định, tự kiểm soát) và giảm kích thước amygdala (trung tâm sợ hãi/lo âu). Nghiên cứu của Sara Lazar, ĐH Harvard, 2011.',
    details: [
      'Mindfulness meditation là gì: chú ý có chủ đích vào khoảnh khắc hiện tại, không phán xét. Không phải làm trống đầu — mà là nhận ra khi tâm trí lạc và nhẹ nhàng kéo lại. Mỗi lần kéo lại là 1 "mental rep" — như tập tạ cho não.',
      'Hướng dẫn 5 phút cho người mới: Ngồi thoải mái, nhắm mắt. Chú ý hơi thở (cảm giác không khí vào/ra). Khi tâm trí lạc (suy nghĩ xuất hiện) — nhận ra, không phán xét, kéo lại hơi thở. Lặp lại. Không có thiền "thất bại".',
      'Thay đổi não sau 8 tuần: prefrontal cortex dày hơn → quyết định tốt hơn, ít impulsive; amygdala nhỏ hơn → ít phản ứng quá mức với stress; insula nhạy hơn → body awareness tốt hơn — đo bằng MRI (Harvard, 2011).',
      'Thiền và sleep quality: 10 phút thiền trước ngủ giảm pre-sleep cognitive arousal (không tắt được não) — nguyên nhân #1 của insomnia theo National Sleep Foundation. Kết quả: ngủ nhanh hơn ~10 phút và deep sleep tăng đáng kể.',
      'App hỗ trợ: Headspace, Calm, Insight Timer (miễn phí), YouTube "guided meditation tiếng Việt" cho người mới. Bắt đầu với guided meditation dễ hơn — giọng hướng dẫn ngăn tâm trí lạc đi và giữ nhịp thở.',
      'Misconceptions: Thiền không cần ngồi kiết già — ngồi ghế, nằm (nếu không ngủ), đi bộ đều được. Không cần im lặng hoàn toàn. Không cần "đạt trạng thái đặc biệt" — chỉ cần ngồi và quan sát. 5 phút mỗi ngày > 30 phút mỗi tuần.',
    ],
    points: [
      { icon: '🧬', label: 'Thay Đổi Não 8 Tuần', note: 'Grey matter tăng ở PFC — ĐH Harvard 2011 (Sara Lazar)' },
      { icon: '😌', label: 'Amygdala Thu Nhỏ', note: 'Giảm phản ứng sợ hãi/lo âu quá mức theo thời gian' },
      { icon: '😴', label: 'Trước Ngủ: -10 Phút', note: 'Giảm cognitive arousal → ngủ nhanh và sâu hơn' },
      { icon: '🔄', label: '"Mental Rep" = Tập Tạ Não', note: 'Mỗi lần kéo tâm trí lại = 1 rep — không có thiền thất bại' },
    ],
  },
  {
    label: 'Đi bộ chậm / mindful walk', icon: '🚶', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mindful walking kết hợp lợi ích của thiền định và vận động. Nghiên cứu 2019 (Journal of Health Psychology): 10 phút mindful walk giảm cortisol 12% hơn đi bộ thường, và 23% hơn ngồi trong phòng yên tĩnh.',
    details: [
      'Hướng dẫn mindful walk: Đi chậm hơn 30% so với tốc độ thường. Chú ý: bàn chân chạm đất (heel → ball → toes), cảm giác không khí trên da, âm thanh xung quanh. Khi tâm trí lạc vào suy nghĩ, kéo chú ý về bước chân — không phán xét.',
      '"Green exercise" bonus: đi bộ trong công viên, cây xanh, gần nước giảm cortisol 16% hơn đi bộ trên phố. Tiếp xúc thiên nhiên kích hoạt "awe response" — trạng thái ngạc nhiên làm nhỏ self-referential thinking (ngừng nghĩ quá nhiều về bản thân).',
      'Rumination buster: 20–30 phút đi bộ trong thiên nhiên giảm activity ở vùng não liên quan đến suy nghĩ tiêu cực lặp lại so với đi bộ đô thị — đo bằng fMRI tại Stanford (2015). Thiên nhiên "tắt" vòng lặp lo âu.',
      'Kết hợp với hơi thở 4-4: hít vào 4 bước, thở ra 4 bước. Đồng bộ hơi thở và bước chân tạo coherence giữa hệ hô hấp và tim mạch — tăng HRV và cảm giác dễ chịu sâu hơn so với đi bộ thường.',
      'Phone-free là bắt buộc: check điện thoại khi đi bộ hủy toàn bộ lợi ích mindfulness. Tai nghe/podcast tốt hơn không đi, nhưng không có gì tốt hơn đi trong im lặng. Thỏa hiệp: 5 phút đầu có điện thoại, 15 phút sau không.',
      'Morning walk đặc biệt: 10–20 phút trong vòng 1 giờ đầu sau thức dậy = ánh sáng mặt trời (reset circadian) + vận động (cortisol tốt buổi sáng) + mindfulness (set tone ngày mới). 1 thói quen, 3 lợi ích.',
    ],
    points: [
      { icon: '🌿', label: 'Thiên Nhiên -16% Cortisol', note: 'Green exercise giảm stress nhiều hơn đi bộ trong phố' },
      { icon: '🧠', label: 'Chống Rumination', note: '20–30 phút giảm suy nghĩ tiêu cực lặp lại — Stanford 2015' },
      { icon: '🌬️', label: 'Hơi Thở 4-4 Bước', note: 'Đồng bộ nhịp thở + bước chân tăng HRV và thư giãn sâu' },
      { icon: '☀️', label: 'Morning Walk 3-in-1', note: 'Reset circadian + cortisol tốt + mindfulness trong 1 thói quen' },
    ],
  },
  {
    label: 'Viết nhật ký', icon: '📝', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Journaling là một trong số ít thực hành tâm lý được chứng minh qua RCT. James Pennebaker (ĐH Texas) cho thấy viết về cảm xúc khó khăn 20 phút/ngày × 3–4 ngày liên tiếp cải thiện sức khỏe thể chất, tăng T-lymphocytes, và giảm triệu chứng trầm cảm.',
    details: [
      'Cơ chế tác động: viết buộc não chuyển cảm xúc từ amygdala (hệ limbic, cảm xúc thô) sang prefrontal cortex (ngôn ngữ, lý luận). "Affect labeling" — đặt tên cho cảm xúc — giảm hoạt động amygdala đo được bằng fMRI.',
      'Expressive writing vs. gratitude journal: expressive writing (viết về điều khó khăn, cảm xúc tiêu cực) hiệu quả nhất cho người stress cao và trauma chưa xử lý. Gratitude journal (3 điều biết ơn) tốt nhất cho wellbeing hằng ngày. Kết hợp cả hai là tối ưu.',
      '3 câu hỏi tối thiểu: (1) Điều gì làm tôi căng thẳng nhất hôm nay? (2) Điều gì tôi biết ơn? (3) Ngày mai tôi muốn cảm thấy thế nào? 5 phút mỗi tối — consistency quan trọng hơn depth.',
      'Brain dump technique: khi overwhelmed, viết stream-of-consciousness 5 phút không dừng, không chỉnh sửa, không phán xét. Mục tiêu là "externalize" những gì đang chiếm working memory, giải phóng cognitive load.',
      'Morning pages (Julia Cameron): viết 3 trang A4 ngay khi thức dậy, trước coffee. Không cần hay — chỉ cần viết. Giúp process giấc mơ, set intention, và dọn dẹp tinh thần trước khi ngày bắt đầu.',
      'Vật lý vs. digital: viết tay kích hoạt nhiều vùng não hơn gõ phím — motor memory + ngôn ngữ + cảm xúc kết hợp. Tốc độ viết tay chậm hơn buộc não xử lý và filter ý tưởng sâu hơn. Sổ tay đơn giản là đủ.',
    ],
    points: [
      { icon: '🔬', label: 'RCT-Proven', note: 'Cải thiện sức khỏe thể chất + tăng T-lymphocytes — Pennebaker' },
      { icon: '🧠', label: 'Affect Labeling', note: 'Đặt tên cảm xúc → giảm hoạt động amygdala đo được bằng fMRI' },
      { icon: '🙏', label: 'Gratitude + Expressive', note: 'Kết hợp 2 loại: tối ưu cho wellbeing và stress relief' },
      { icon: '✍️', label: 'Viết Tay > Gõ Phím', note: 'Kích hoạt nhiều vùng não hơn — motor + ngôn ngữ + cảm xúc' },
    ],
  },
  {
    label: 'Không dùng điện thoại 30 phút', icon: '📵', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người dùng smartphone trung bình kiểm tra điện thoại 96 lần/ngày (Asurion 2019). Mỗi ngắt quãng = 23 phút để lấy lại deep focus hoàn toàn (Gloria Mark, UCI). 30 phút không điện thoại là "minimum viable break" để hệ thần kinh reset khỏi dopamine loop.',
    details: [
      'Dopamine loop: notification → micro-spike dopamine → check điện thoại → spike lớn hơn nếu có gì mới → hoặc drop nếu không → check lại. Não bị condition như slot machine. 30 phút offline phá vỡ cycle này và reset baseline dopamine tự nhiên.',
      'Default Mode Network (DMN): khi không có input bên ngoài, não chuyển sang DMN — liên quan đến sáng tạo, xử lý cảm xúc, và kết nối ý tưởng. Smartphones liên tục ngăn DMN hoạt động. 30 phút không điện thoại = não được "thở".',
      'Paradox của "just checking": điện thoại để mặt trên bàn (không dùng) vẫn giảm cognitive capacity 10–20% do "brain drain" — một phần attention luôn bị thu hút (Adrian Ward, UT Austin 2017). Để điện thoại ở phòng khác.',
      'Buổi sáng không điện thoại: tránh check 30–60 phút đầu sau thức dậy là thực hành hiệu quả nhất. Ngay khi check, amygdala bị kích hoạt (emails, news) → cortisol tăng → stress mode từ đầu ngày thay vì intention-setting mode.',
      'Trước ngủ: blue light ức chế melatonin 2–3 giờ. Nhưng quan trọng hơn là mental stimulation (scroll social, chat) giữ hệ thần kinh trong arousal state. Tắt điện thoại 30–60 phút trước ngủ = deep sleep tăng rõ rệt.',
      'Thực hành từng bước: (1) Airplane mode khi ăn tối; (2) Không điện thoại trong phòng ngủ; (3) Physical book thay phone buổi sáng. Mỗi thay đổi nhỏ cộng dồn thành thói quen bền vững hơn quy tắc tuyệt đối.',
    ],
    points: [
      { icon: '🎰', label: 'Dopamine Loop Reset', note: '30 phút offline phá vỡ slot machine cycle của notifications' },
      { icon: '💡', label: 'Default Mode Network', note: 'Não cần offline để sáng tạo và xử lý cảm xúc sâu' },
      { icon: '👁️', label: 'Phone Trên Bàn = -20% Não', note: 'Chỉ nhìn thấy điện thoại đã giảm cognitive capacity (Ward 2017)' },
      { icon: '🌙', label: 'Tắt 30 Phút Trước Ngủ', note: 'Mental stimulation — không phải chỉ blue light — mới là vấn đề' },
    ],
  },
  {
    label: 'Nghỉ ngơi không làm gì', icon: '😌', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Doing nothing" là kỹ thuật phục hồi bị đánh giá thấp nhất. Mary Helen Immordino-Yang (USC) cho thấy thời gian nghỉ ngơi không có mục đích là khi não xử lý kinh nghiệm, consolidate memory, và phát triển moral reasoning — không thể xảy ra trong khi làm việc liên tục.',
    details: [
      'Productive rest ≠ lazy: nghỉ ngơi không làm gì là khi default mode network (DMN) xử lý thông tin đã học, kết nối ý tưởng tưởng không liên quan, và tạo insight mới. Nhiều "eureka moments" xảy ra khi tắm, đi dạo, hoặc nằm không làm gì.',
      'Ultradian rest: sau mỗi 90 phút tập trung, não cần 15–20 phút nghỉ thực sự (không phải scroll điện thoại). Bỏ qua nhu cầu này → cognitive fatigue tích lũy → hiệu suất giảm dần. 4 chu kỳ 90+20 phút > 8 giờ liên tục.',
      'Non-sleep deep rest (NSDR): nằm xuống, nhắm mắt, không ngủ, không làm gì 10–20 phút. Nghiên cứu Huberman Lab: NSDR tăng dopamine 65% sau deep work session và accelerate skill learning khi thực hành ngay sau. Nap <20 phút tương tự.',
      'Guilt về nghỉ ngơi: nhiều người cảm thấy tội lỗi khi không làm gì — kết quả của "toxic productivity". Nhắc nhở: recovery là phần của performance, không phải đối lập. Cơ bắp cần ngày nghỉ; não cũng vậy.',
      'Staring into space: nhìn ra cửa sổ, ngồi trong vườn, ngắm trời — đây là nghỉ ngơi hiệu quả cao. Ánh sáng tự nhiên + không có task = DMN thoải mái nhất. Tiếng chim và gió giảm cortisol đo được hơn ngồi trong phòng im lặng.',
      'Lên lịch nghỉ ngơi: người perfectionist cần "scheduled idle time" trong lịch để thực sự cho phép bản thân nghỉ. Đặt "nghỉ 20 phút" như một meeting quan trọng — không được reschedule. Cấu trúc giúp người luôn bận tâm học cách nghỉ.',
    ],
    points: [
      { icon: '💡', label: 'DMN = Xử Lý Ngầm', note: 'Insight và sáng tạo xảy ra lúc nghỉ — không phải lúc làm việc' },
      { icon: '⚡', label: 'NSDR +65% Dopamine', note: 'Nằm không ngủ 10–20 phút sau deep work = phục hồi nhanh nhất' },
      { icon: '🔄', label: 'Ultradian 90+20 Phút', note: '4 chu kỳ nghỉ đúng cách > 8 giờ liên tục không nghỉ' },
      { icon: '🌿', label: 'Nhìn Thiên Nhiên = Nghỉ Thật', note: 'Cây xanh + tiếng chim giảm cortisol tốt hơn phòng im lặng' },
    ],
  },
];

const JOURNAL_QS = [
  {
    q: 'Điều gì làm bạn căng thẳng nhất hôm nay?', color: '#ef4444', rgb: '239,68,68', icon: '🌡️',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đặt tên cụ thể cho stressor (nguồn gây stress) là bước đầu tiên để xử lý nó. Nghiên cứu affect labeling (Matthew Lieberman, UCLA) cho thấy viết ra điều khiến bạn lo lắng giảm hoạt động amygdala ngay lập tức — não chuyển từ "cảm xúc thô" sang "ngôn ngữ và lý luận".',
    details: [
      'Tại sao câu hỏi này quan trọng: nhiều người sống với stress mơ hồ — cảm giác nặng nề nhưng không biết vì sao. Buộc bản thân viết ra 1 nguồn gây stress cụ thể nhất ngày hôm nay chuyển nó từ trạng thái "diffuse anxiety" sang vấn đề có thể nhìn rõ và xử lý.',
      'Cách viết hiệu quả nhất: cụ thể hóa. Không phải "tôi stress vì công việc" mà là "tôi stress vì deadline dự án X vào thứ Sáu và tôi chưa hoàn thành phần Y". Cụ thể → não xác định vấn đề rõ hơn → giải pháp xuất hiện dễ hơn.',
      'Phân biệt stressor vs. emotion: "Cuộc họp với sếp" là stressor; "Sợ bị đánh giá thấp" là emotion. Viết cả hai nếu có thể. Nhận ra emotion giúp bạn xử lý cảm xúc thay vì chỉ cố gắng giải quyết sự kiện bên ngoài.',
      'Cognitive reframing trong khi viết: sau khi viết stressor, thử thêm: "Điều tôi có thể kiểm soát trong việc này là..." Câu hỏi này kích hoạt prefrontal cortex — vùng não kiểm soát chủ động — và giảm cảm giác bất lực.',
      'Dumping vs. ruminating: mục tiêu là viết ra và để đó — không phải tiếp tục suy nghĩ về nó. Sau khi viết, hít thở sâu 3 lần và nói với bản thân: "Tôi đã ghi lại. Bây giờ tôi để nó xuống." Externalizing = giải phóng working memory.',
      'Pattern recognition sau 1 tuần: đọc lại 7 câu trả lời này cho thấy stressor thực sự của bạn. Thường thấy: cùng 1–2 nguồn gây stress lặp lại → đây là vấn đề cần giải quyết gốc rễ, không chỉ manage ngày qua ngày.',
    ],
    points: [
      { icon: '🧠', label: 'Affect Labeling', note: 'Đặt tên stress → giảm amygdala ngay lập tức (UCLA, Lieberman)' },
      { icon: '🎯', label: 'Cụ Thể Hóa Stressor', note: '"Công việc" → "deadline X thứ Sáu" — não giải quyết tốt hơn' },
      { icon: '⚖️', label: 'Stressor vs. Emotion', note: 'Ghi cả sự kiện lẫn cảm xúc để xử lý toàn diện hơn' },
      { icon: '📊', label: 'Pattern 7 Ngày', note: 'Đọc lại 1 tuần — thấy nguồn stress lặp lại cần xử lý gốc' },
    ],
  },
  {
    q: 'Điều gì bạn biết ơn hôm nay?', color: '#f59e0b', rgb: '245,158,11', icon: '🙏',
    img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gratitude journaling thực sự thay đổi não. Nghiên cứu của Robert Emmons (UC Davis) và Martin Seligman: viết 3 điều biết ơn mỗi ngày trong 3 tuần tăng hạnh phúc 25%, giảm triệu chứng trầm cảm, và hiệu quả kéo dài 6 tháng sau khi dừng thực hành.',
    details: [
      'Negativity bias và tại sao cần gratitude: não người tiến hóa để chú ý vào nguy hiểm — tỉ lệ 5:1 (5 trải nghiệm tiêu cực cần thiết để cân bằng 1 tích cực trong trí nhớ). Gratitude journaling chủ động counter-balance bias này bằng cách buộc não tìm kiếm positive.',
      'Specificity tăng hiệu quả: "Tôi biết ơn gia đình" ít hiệu quả hơn "Tôi biết ơn vì hôm nay mẹ gọi hỏi thăm lúc tôi đang mệt nhất". Cụ thể → emotional resonance cao hơn → oxytocin và serotonin tăng nhiều hơn.',
      'Novelty quan trọng: não quen với điều lặp lại và không còn tiết dopamine. Viết cùng 3 điều mỗi ngày ("sức khỏe, gia đình, công việc") mất hiệu quả sau 2–3 tuần. Cố tìm 1 điều mới, nhỏ và cụ thể mỗi ngày.',
      '"Why" powerful hơn "what": thay vì "tôi biết ơn vì có việc làm", thêm "vì nó cho tôi cảm giác đóng góp và ổn định tài chính để chăm sóc gia đình". Giải thích lý do kết nối điều biết ơn với giá trị sâu hơn — tác động cảm xúc mạnh hơn nhiều.',
      'Gratitude letter (advanced): thỉnh thoảng viết một lá thư dài về điều/người bạn biết ơn — không cần gửi. Nghiên cứu cho thấy đây là bài tập có tác động mạnh nhất trong tâm lý học tích cực, kể cả so với liệu pháp khác.',
      'Timing tốt nhất: tối trước khi ngủ là hiệu quả nhất — não trong trạng thái consolidation (dọn dẹp và lưu trữ ký ức). Kết thúc ngày với gratitude giúp last impression trước ngủ là tích cực → cải thiện giấc ngủ và mood buổi sáng.',
    ],
    points: [
      { icon: '📈', label: 'Hạnh Phúc +25%', note: '3 tuần viết gratitude — Emmons & Seligman (UC Davis)' },
      { icon: '🔍', label: 'Cụ Thể + Mới Mỗi Ngày', note: 'Specificity + novelty = não tiết serotonin nhiều hơn' },
      { icon: '❓', label: '"Why" > "What"', note: 'Thêm lý do → kết nối giá trị sâu → tác động cảm xúc mạnh hơn' },
      { icon: '🌙', label: 'Tối Trước Ngủ', note: 'Last impression tích cực trước ngủ → cải thiện giấc ngủ' },
    ],
  },
  {
    q: 'Ngày mai bạn muốn cảm thấy thế nào?', color: '#14b8a6', rgb: '20,184,166', icon: '🌅',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Intention setting (đặt ý định) kích hoạt reticular activating system (RAS) — bộ lọc của não chú ý vào những gì bạn đã định hướng. Viết rõ cảm xúc bạn muốn ngày mai giúp não "scan" cho cơ hội tạo ra cảm xúc đó, thay vì phản ứng ngẫu nhiên với sự kiện.',
    details: [
      'Tại sao focus vào cảm xúc, không phải task: "Ngày mai tôi muốn hoàn thành 3 việc" là goal setting. "Ngày mai tôi muốn cảm thấy tập trung và bình tĩnh" là emotional intention. Cảm xúc là kim chỉ nam tốt hơn task list — chúng định hình cách bạn xử lý mọi tình huống.',
      'Reticular Activating System (RAS): phần não lọc ~11 triệu bits thông tin/giây (chỉ cho 40 bits đi vào ý thức). RAS ưu tiên thứ bạn nghĩ đến gần đây. Viết cảm xúc muốn cảm thấy → RAS tìm kiếm bằng chứng của cảm xúc đó suốt ngày hôm sau.',
      'Mental rehearsal: sau khi viết cảm xúc muốn cảm thấy, dành 30 giây hình dung 1 tình huống cụ thể ngày mai và bạn phản ứng với cảm xúc đó. Hình dung kích hoạt cùng neural pathway với trải nghiệm thực — athlete olympics dùng điều này mỗi ngày.',
      'Liên kết với hành động: thêm 1 hành động nhỏ hỗ trợ cảm xúc đó. "Tôi muốn cảm thấy tập trung → tôi sẽ không check điện thoại 1 giờ đầu sáng". Cầu nối giữa intention và behavior là quan trọng để không chỉ là ước muốn.',
      'If-then planning: "Nếu tôi cảm thấy lo lắng ngày mai, tôi sẽ thở sâu 3 lần". Nghiên cứu của Peter Gollwitzer (NYU) cho thấy if-then planning tăng khả năng thực hiện hành động mong muốn lên 2–3 lần so với chỉ intention thông thường.',
      'Consistency với self-concept: các nghiên cứu self-concept cho thấy bạn hành động theo cách bạn tin là bạn. Viết "ngày mai tôi muốn cảm thấy năng lượng và proactive" củng cố identity là người năng lượng và proactive — theo thời gian tạo thành self-fulfilling prophecy tích cực.',
    ],
    points: [
      { icon: '🔭', label: 'RAS Lọc Thực Tế', note: 'Não tìm bằng chứng của cảm xúc bạn đã define trước ngủ' },
      { icon: '🏆', label: 'Mental Rehearsal', note: '30 giây hình dung kích hoạt cùng neural path với thực tế' },
      { icon: '🔗', label: 'If-Then Planning', note: '"Nếu X xảy ra, tôi sẽ Y" — tăng khả năng thực hiện 2–3x' },
      { icon: '🪞', label: 'Self-Concept Building', note: 'Viết cảm xúc muốn = củng cố identity bạn đang xây dựng' },
    ],
  },
];

const WARNING_SIGNS = [
  {
    label: 'Stress ≥ 7 trong 3 ngày liên tiếp', icon: '🔴', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1568027762272-e4da8b386fe9?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress mạn tính (≥7/10 kéo dài >3 ngày) là trạng thái sinh lý khác biệt so với stress cấp tính. Cortisol liên tục cao phá hủy hippocampus (trí nhớ), ức chế hệ miễn dịch, và là tiền đề trực tiếp của burnout — không phải "buồn thoáng qua" mà là dấu hiệu cần hành động ngay.',
    details: [
      'Stress cấp vs. mạn tính: stress cấp (đột ngột, có nguyên nhân rõ) → cortisol tăng → giải quyết → cortisol giảm. Đây là bình thường và có lợi. Stress mạn tính (không có điểm dừng, kéo dài) → cortisol không giảm → bắt đầu gây hại thực sự.',
      'Tác động của cortisol kéo dài: phá hủy tế bào thần kinh hippocampus (trí nhớ và không gian) → giải thích vì sao khi rất stress bạn hay quên và mất phương hướng. Ức chế sản xuất lymphocytes → dễ bệnh hơn. Tăng visceral fat ngay cả khi ăn uống không thay đổi.',
      'HPA axis dysregulation: khi stress kéo dài, hệ hypothalamus-pituitary-adrenal "kiệt sức" dần → cortisol pattern bất thường → ngủ không sâu, dậy mệt dù ngủ đủ giờ, energy thấp lúc sáng sớm. Đây là "HPA fatigue" — dấu hiệu burnout đang đến.',
      'Các bước cần làm ngay: (1) Giảm stressor nếu có thể — xác định 1 thứ có thể bỏ/hoãn/delegate; (2) Tăng recovery: ngủ 30 phút thêm, 1 lần thở box breathing 5 phút; (3) Nói chuyện với người tin tưởng — social support giảm cortisol đo được.',
      'Khi nào cần chuyên gia: nếu stress ≥7 liên tục >2 tuần kèm theo: không thể ngủ, không thể ăn, không thể tập trung làm việc cơ bản, hoặc cảm giác tuyệt vọng — đây là dấu hiệu cần gặp chuyên gia tâm lý, không tự xử lý một mình.',
      'Stress ≥7 không phải "yếu đuối": 1/4 người trưởng thành tại các nước phát triển trải qua burnout ít nhất 1 lần. Nhận ra dấu hiệu sớm và hành động sớm là dấu hiệu của trí tuệ cảm xúc cao, không phải sức yếu.',
    ],
    points: [
      { icon: '🧬', label: 'Cortisol Phá Hippocampus', note: 'Giải thích quên, mất tập trung khi stress mạn tính kéo dài' },
      { icon: '🛡️', label: 'Miễn Dịch Suy Giảm', note: 'Cortisol cao → lymphocytes giảm → dễ bệnh hơn đáng kể' },
      { icon: '⚡', label: 'Hành Động Ngay', note: 'Giảm 1 stressor + tăng recovery + nói chuyện với ai đó' },
      { icon: '👨‍⚕️', label: '>2 Tuần → Chuyên Gia', note: 'Kéo dài + mất ngủ/ăn/tập trung → cần tìm hỗ trợ chuyên nghiệp' },
    ],
  },
  {
    label: 'Mệt mỏi/căng thẳng là mood chủ đạo cả tuần', icon: '🟠', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mood là "emotional weather" — biến động theo ngày là bình thường. Nhưng khi một mood tiêu cực (mệt mỏi, căng thẳng, chán nản) là chủ đạo cả tuần (5/7 ngày), đây không còn là weather mà là "emotional climate" — cần tìm nguyên nhân hệ thống.',
    details: [
      'Mood vs. emotion: emotion là phản ứng ngắn với sự kiện cụ thể (buồn khi nghe tin xấu, vui khi ăn ngon). Mood là trạng thái nền kéo dài hơn (cả ngày mệt mỏi dù không có gì cụ thể xảy ra). Mood ảnh hưởng cách bạn filter mọi trải nghiệm.',
      'Persistent negative mood — nguyên nhân thường gặp: (1) Sleep debt tích lũy — thiếu ngủ 1–1.5h mỗi đêm trong 1 tuần; (2) Thiếu sunlight — ít ra ngoài, làm việc trong phòng kín; (3) Social isolation — ít tiếp xúc con người thực; (4) Nutritional deficiency — thiếu sắt, B12, vitamin D rất phổ biến.',
      'Emotional contagion: mood lan sang người xung quanh. Người luôn mệt mỏi, căng thẳng có xu hướng thu hút hoặc giữ lại năng lượng tiêu cực trong môi trường — tạo vòng lặp tự củng cố. Nhận ra điều này không phải để tự trách mà để tìm môi trường hỗ trợ.',
      'Mood tracking insight: ghi mood cả tuần cho thấy pattern. Mệt mỏi nhiều vào thứ Hai–Ba? → cuối tuần không thực sự nghỉ ngơi. Mệt mỏi nhiều buổi chiều? → ultradian dip + caffeine crash. Pattern → can thiệp đúng điểm.',
      'Ngưỡng can thiệp: 1–2 ngày mood xấu = bình thường, self-care đơn giản. 3–4 ngày liên tiếp = xem lại sleep, nutrition, social contact. 5+ ngày = nói chuyện với người thân/bạn thân, cân nhắc gặp chuyên gia.',
      'Behavioral activation (CBT technique): khi mood thấp, bản năng là thu mình lại. Điều này tạo ra vòng lặp tệ hơn. Làm ngược lại: chủ động làm 1 hoạt động nhỏ mang lại pleasure hoặc achievement — ngay cả khi không muốn. Hành động → mood thay đổi, không phải ngược lại.',
    ],
    points: [
      { icon: '🌤️', label: 'Weather vs. Climate', note: 'Mood xấu 1–2 ngày = thời tiết. Cả tuần = khí hậu cần xem lại' },
      { icon: '🔍', label: 'Tìm Nguồn Gốc Hệ Thống', note: 'Sleep debt, thiếu sun, social isolation, thiếu dinh dưỡng' },
      { icon: '📈', label: 'Behavioral Activation', note: 'Làm 1 việc nhỏ dù không muốn — hành động đổi mood, không ngược' },
      { icon: '🤝', label: '5+ Ngày → Nói Chuyện', note: 'Tìm người tin tưởng, đừng tự xử lý một mình' },
    ],
  },
  {
    label: 'Không thực hành calm nào trong 3 ngày', icon: '🟡', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Calm practices (thở, thiền, đi bộ, journaling) là "mental hygiene" — giống như đánh răng cho tâm trí. Bỏ 3 ngày không khác gì không đánh răng 3 ngày. Không thấy hậu quả ngay, nhưng "plaque" tâm lý (stress tích lũy, ruminative thoughts) đang build up.',
    details: [
      'Tại sao 3 ngày là ngưỡng: thần kinh học cho thấy không thực hành mindfulness/calm trong 3+ ngày khiến stress response dễ trigger hơn — amygdala "sensitized". Người thực hành thường xuyên có amygdala response chậm hơn và weaker hơn với cùng một stressor.',
      'Consistency > intensity: 5 phút thở sâu mỗi ngày hiệu quả hơn 30 phút thiền mỗi tuần. Reason: neuroplasticity cần consistent repetition để build stable neural pathway. Gap 3+ ngày = pathway "weaken" và cần rebuild từ đầu.',
      'Busy = most need calm: nghịch lý phổ biến — bận nhất là lúc bỏ qua calm practice nhất. Nhưng đây cũng là lúc cần nhất. Người thực hành 10 năm đều nói: ngày họ không có 5 phút là ngày họ cần 30 phút.',
      'Thiết kế để không bỏ: minimum viable dose. Nếu không thể 10 phút, làm 2 phút. 3 lần box breathing = đủ để count là "thực hành ngày hôm nay". Đừng để perfect là kẻ thù của done.',
      'Environmental triggers: đặt reminder vật lý (gối thiền, sổ tay, đồng hồ tắt báo) ở vị trí dễ thấy. Kết nối calm practice với habit đã có (sau đánh răng, trước coffee) — habit stacking giảm cognitive load để nhớ.',
      'Tự tha thứ và reset: bỏ 3 ngày không phải lý do để bỏ hẳn. Não có xu hướng "all-or-nothing" khi fail ("đã bỏ 3 ngày rồi thì thôi luôn"). Nhận ra pattern này, tự tha thứ, và làm 2 phút ngay hôm nay — reset streak từ đây.',
    ],
    points: [
      { icon: '🦷', label: 'Mental Hygiene 3 Ngày', note: 'Như không đánh răng 3 ngày — không thấy ngay nhưng tích lũy' },
      { icon: '⚡', label: '5 Phút/Ngày > 30 Phút/Tuần', note: 'Consistency builds neural pathway — gap 3 ngày weakens nó' },
      { icon: '🎯', label: 'Minimum Viable Dose', note: '3 lần box breathing = đủ count — đừng để perfect block done' },
      { icon: '🔗', label: 'Habit Stacking', note: 'Gắn với habit có sẵn (sau đánh răng) — không cần nhớ' },
    ],
  },
  {
    label: 'Không ngủ được dù mệt', icon: '🟣', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Không ngủ được dù mệt" là triệu chứng của cortisol cao kéo dài, anxiety, hoặc "hyperarousal" — não đang ở trạng thái threat-detection liên tục. Đây khác với insomnia thông thường và là dấu hiệu nghiêm trọng cần giải quyết gốc rễ, không chỉ cải thiện sleep hygiene.',
    details: [
      'Hyperarousal là gì: hệ thần kinh giao cảm (fight-or-flight) không tắt được dù cơ thể mệt. Cortisol và norepinephrine cao → não "quét" liên tục tìm nguy hiểm → không thể let go để ngủ. Giống như cố ngủ trong khi còi báo động đang kêu.',
      'Paradoxical insomnia: khi quá mệt, nhiều người trở nên "wired and tired" — mệt thể xác nhưng não hyperactive. Nguyên nhân: overfatigue làm cortisol tăng thêm (như một lần cuối trước khi collapse). Vòng lặp này cần phá vỡ.',
      'Sleep anxiety: nếu nằm xuống → nghĩ đến việc không ngủ được → lo lắng → cortisol tăng → không ngủ được → lo lắng hơn. CBT cho insomnia (CBT-I) là điều trị hiệu quả nhất — hiệu quả hơn thuốc ngủ dài hạn theo nghiên cứu Stanford.',
      'Phân biệt với sleep apnea: nếu ngủ được nhưng dậy mệt, ngáy, đau đầu buổi sáng → sleep apnea. Nếu không thể ngủ dù mệt → hyperarousal/anxiety. Khác nhau về nguyên nhân và cách xử lý.',
      'Ngay tối nay: (1) Không nằm trên giường quá 20 phút nếu không ngủ được — dậy đọc sách (ánh sáng mờ) rồi quay lại; (2) Box breathing 4-7-8 liên tục 4–5 lần; (3) Viết ra mọi thứ đang nghĩ (brain dump) vào sổ — externalizing giảm mental noise.',
      'Khi nào cần gặp bác sĩ: mất ngủ >3 tuần liên tiếp kèm theo giảm khả năng làm việc, mood thấp liên tục, lo lắng không kiểm soát được. Đây không phải laziness — là rối loạn cần điều trị. CBT-I thường cần 6–8 buổi với chuyên gia.',
    ],
    points: [
      { icon: '🚨', label: 'Hyperarousal — Không Phải Lười', note: 'Hệ thần kinh giao cảm không tắt — không thể "cố" ngủ được' },
      { icon: '🔄', label: 'Sleep Anxiety Vòng Lặp', note: 'Lo không ngủ → cortisol tăng → không ngủ → vòng lặp' },
      { icon: '📖', label: 'CBT-I Hiệu Quả Hơn Thuốc', note: '6–8 buổi CBT-I — Stanford: tốt hơn thuốc ngủ dài hạn' },
      { icon: '📝', label: 'Brain Dump Trước Ngủ', note: 'Viết ra mọi thứ đang nghĩ → externalizing → giảm mental noise' },
    ],
  },
  {
    label: 'Không muốn nói chuyện với ai', icon: '⚫', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Withdrawal (thu mình, tránh né xã hội) là một trong những dấu hiệu sớm và nghiêm trọng nhất của burnout và trầm cảm. Paradox: khi cần hỗ trợ nhất thì lại muốn cô lập nhất. Social connection là "medicine" quan trọng nhất không thể tự tổng hợp.',
    details: [
      'Social withdrawal và não: khi não ở trạng thái stress mạn tính hoặc depression, social processing network hoạt động kém — con người "tốn năng lượng" hơn bình thường. Cảm giác "không muốn gặp ai" là não đang bảo tồn năng lượng, không phải bạn ghét người.',
      'Oxytocin và healing: tiếp xúc xã hội (kể cả chỉ 10 phút nói chuyện thật sự với người thân) tiết oxytocin → giảm cortisol → cảm giác ấm áp và an toàn. Không thể tự tổng hợp bằng một mình — đây là lý do "talk to someone" không phải lời khuyên nhàm mà là neuroscience.',
      'Phân biệt introvert recharge vs. withdrawal: introvert cần thời gian một mình để nạp năng lượng — bình thường và lành mạnh. Withdrawal là tránh né ngay cả người thân tin tưởng, ngay cả khi biết sẽ giúp được, ngay cả khi được mời. Difference: muốn một mình (healthy) vs. không muốn bất kỳ ai (warning sign).',
      'Bước nhỏ nhất có thể: không cần gặp nhóm đông. 1 tin nhắn cho 1 người thân: "Dạo này mình hơi nặng nề, bạn có 5 phút chat không?" Chỉ vậy thôi. Não cần bắt đầu nhỏ để vượt qua activation energy của withdrawal.',
      'Vulnerability và connection: Brené Brown (nghiên cứu shame/vulnerability) cho thấy khả năng nói "tôi đang không ổn" với người tin tưởng là predictor mạnh nhất của wellbeing và resilience dài hạn. Người hay withdrawal thường có shame/fear of judgment cao — cần nhận ra điều này.',
      'Professional support không phải điểm yếu: nếu withdrawal kéo dài >1 tuần kèm mất hứng thú với mọi thứ trước đây từng thích, mood trống rỗng/buồn liên tục, hoặc suy nghĩ tiêu cực về bản thân — đây là dấu hiệu cần gặp chuyên gia tâm lý. Tâm lý trị liệu là can thiệp y tế, không phải "xa xỉ".',
    ],
    points: [
      { icon: '🧪', label: 'Oxytocin = Giảm Cortisol', note: '10 phút nói chuyện thật sự với người thân đã tạo thay đổi đo được' },
      { icon: '⚖️', label: 'Introvert Recharge ≠ Withdrawal', note: 'Muốn một mình (OK) vs. tránh tất cả mọi người (warning)' },
      { icon: '💬', label: 'Tin Nhắn 1 Người = Bắt Đầu', note: '"Mình nặng nề dạo này, có 5 phút không?" — bước đủ nhỏ nhất' },
      { icon: '👨‍⚕️', label: '>1 Tuần + Mất Hứng Thú', note: 'Cần tìm chuyên gia tâm lý — đây là can thiệp y tế, không xa xỉ' },
    ],
  },
];

function JournalModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = JOURNAL_QS[idx];
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
          <img src={item.img} alt={item.q} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Câu hỏi {idx + 1}/{JOURNAL_QS.length}</p>
          <h2 className="font-bold text-xl md:text-2xl mb-5 leading-snug" style={{ color: item.color }}>{idx + 1}. {item.q}</h2>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {JOURNAL_QS.length}</span>
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

function WarnModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = WARNING_SIGNS[idx];
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
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Dấu hiệu {idx + 1}/{WARNING_SIGNS.length}</p>
          <h2 className="font-bold text-xl md:text-2xl mb-5 leading-snug" style={{ color: item.color }}>{item.label}</h2>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {WARNING_SIGNS.length}</span>
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

function CalmModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = CALM_OPTIONS[idx];
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
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: `rgba(${item.rgb},0.6)` }}>Thực hành {idx + 1}/{CALM_OPTIONS.length}</p>
          <h2 className="font-bold text-xl md:text-2xl mb-5 leading-snug" style={{ color: item.color }}>{item.label}</h2>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {CALM_OPTIONS.length}</span>
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

export default function ToolsMindTrackerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState(() => {
    try { const d = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); return d[today] || { stress: 5, mood: '', calm: [], journal: {} }; } catch { return { stress: 5, mood: '', calm: [], journal: {} }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });
  const [calmModal, setCalmModal] = useState(null);
  const [journalModal, setJournalModal] = useState(null);
  const [warnModal, setWarnModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMtOrbitSpin { to { --f-mt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMtOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const update = (key, val) => {
    const next = { ...data, [key]: val };
    setData(next);
    const all = { ...history, [today]: next };
    setHistory(all);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  const toggleCalm = (val) => {
    const next = data.calm.includes(val) ? data.calm.filter(c => c !== val) : [...data.calm, val];
    update('calm', next);
  };

  const updateJournal = (qi, val) => {
    update('journal', { ...data.journal, [qi]: val });
  };

  const stressColor = data.stress <= 3 ? '#22c55e' : data.stress <= 6 ? '#f59e0b' : '#ef4444';
  const stressLabel = data.stress <= 3 ? 'Thấp — tốt' : data.stress <= 6 ? 'Vừa — chú ý' : 'Cao — cần giảm tải';

  const last7 = Object.entries(history).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🧘</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Mind &amp; Calm Tracker</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Stress · Mood · Calm practice · Journaling
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Theo dõi stress, tâm trạng và thực hành calm mỗi ngày. Nhận ra dấu hiệu cần giảm tải trước khi kiệt sức — không cần chờ đến khi vỡ vụn.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop" alt="Mind tracker" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            nhận ra → điều chỉnh → bền vững
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Today */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Ghi Tâm Trí Hôm Nay</h2>
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-6">

          {/* Stress slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-lg font-medium text-text">🌡️ Mức stress hôm nay</label>
              <span className="text-lg font-bold" style={{ color: stressColor }}>{data.stress}/10 — {stressLabel}</span>
            </div>
            <input type="range" min="1" max="10" value={data.stress} onChange={e => update('stress', +e.target.value)}
              className="w-full" style={{ accentColor: stressColor }} />
            <div className="flex justify-between text-base text-muted mt-1"><span>1 Bình thản</span><span>5 Vừa</span><span>10 Quá tải</span></div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-lg font-medium text-text block mb-3">🎭 Tâm trạng chủ đạo hôm nay</label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button key={m.val} onClick={() => update('mood', m.val)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl border transition-all text-base"
                  style={{ borderColor: data.mood === m.val ? m.color : 'rgba(255,255,255,0.08)', background: data.mood === m.val ? `${m.color}20` : 'transparent' }}>
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-muted">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calm practice */}
          <div>
            <label className="text-lg font-medium text-text block mb-3">🌿 Thực hành calm hôm nay (chọn tất cả đã làm)</label>
            <div className="grid grid-cols-2 gap-2">
              {CALM_OPTIONS.map((c, i) => {
                const checked = data.calm.includes(i);
                return (
                  <div key={i} className="group relative flex items-center gap-2 p-3 rounded-xl border transition-all text-base"
                    style={{ borderColor: calmModal === i ? `rgba(${c.rgb},0.5)` : checked ? `rgba(${c.rgb},0.4)` : 'rgba(255,255,255,0.08)', background: checked ? `rgba(${c.rgb},0.09)` : 'transparent' }}>
                    <button onClick={() => toggleCalm(i)} className="flex items-center gap-2 flex-1 text-left min-w-0">
                      <span className="text-lg shrink-0">{c.icon}</span>
                      <span className={`text-sm leading-snug ${checked ? 'text-text' : 'text-muted'}`}>{c.label}</span>
                    </button>
                    <button onClick={() => setCalmModal(i)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      style={{ color: c.color, background: `rgba(${c.rgb},0.12)`, border: `1px solid rgba(${c.rgb},0.3)` }}>
                      Chi tiết →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </RevealBlock>

      {/* Journaling */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nhật Ký 3 Câu</h2>
        <p className="text-muted text-lg mb-6">3 câu hỏi đơn giản, 3–5 phút, giúp bạn xử lý cảm xúc và đặt ý định cho ngày mai.</p>
        <div className="space-y-4">
          {JOURNAL_QS.map((jq, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <label className="text-lg font-medium text-text leading-snug">{i + 1}. {jq.q}</label>
                <button onClick={() => setJournalModal(i)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all shrink-0 mt-0.5"
                  style={{ color: jq.color, background: `rgba(${jq.rgb},0.1)`, border: `1px solid rgba(${jq.rgb},0.25)` }}>
                  Chi tiết →
                </button>
              </div>
              <textarea value={data.journal[i] ?? ''} onChange={e => updateJournal(i, e.target.value)}
                rows={2} placeholder="Nhập suy nghĩ của bạn..." className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text placeholder-muted resize-none focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 7-day trend */}
      {last7.length > 1 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Xu Hướng 7 Ngày</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead>
                <tr className="text-base text-muted border-b border-border">
                  <th className="text-left py-2 font-medium">Ngày</th>
                  <th className="text-center py-2 font-medium">Stress</th>
                  <th className="text-center py-2 font-medium">Mood</th>
                  <th className="text-center py-2 font-medium">Calm</th>
                </tr>
              </thead>
              <tbody>
                {last7.map(([date, d]) => {
                  const moodObj = MOODS.find(m => m.val === d.mood);
                  const sc = (d.stress || 0) <= 3 ? '#22c55e' : (d.stress || 0) <= 6 ? '#f59e0b' : '#ef4444';
                  return (
                    <tr key={date} className="border-b border-border/50">
                      <td className="py-2 text-muted">{date.slice(5)}</td>
                      <td className="py-2 text-center"><span style={{ color: sc }}>{d.stress || '–'}/10</span></td>
                      <td className="py-2 text-center">{moodObj ? moodObj.icon : '–'}</td>
                      <td className="py-2 text-center text-muted">{(d.calm || []).length} mục</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      {/* Warning signs */}
      <RevealBlock delay={3} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>💡 Dấu Hiệu Cần Giảm Tải</h2>
        <p className="text-muted text-base mb-4">Nhận ra sớm để hành động trước khi kiệt sức thực sự. Click để xem giải thích và cách xử lý.</p>
        <div className="space-y-2">
          {WARNING_SIGNS.map((w, i) => (
            <div key={i}
              className="group flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200"
              style={{ borderColor: warnModal === i ? `rgba(${w.rgb},0.45)` : 'rgba(255,255,255,0.08)', background: warnModal === i ? `rgba(${w.rgb},0.07)` : 'transparent' }}
              onClick={() => setWarnModal(i)}>
              <span className="text-lg shrink-0" style={{ color: w.color }}>⚠</span>
              <span className="text-base text-muted flex-1 leading-snug">{w.label}</span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: w.color, background: `rgba(${w.rgb},0.1)`, border: `1px solid rgba(${w.rgb},0.25)` }}>
                Chi tiết →
              </span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {calmModal !== null && (
        <CalmModal
          idx={calmModal}
          onClose={() => setCalmModal(null)}
          onPrev={() => setCalmModal(i => Math.max(0, i - 1))}
          onNext={() => setCalmModal(i => Math.min(CALM_OPTIONS.length - 1, i + 1))}
          hasPrev={calmModal > 0}
          hasNext={calmModal < CALM_OPTIONS.length - 1}
        />
      )}
      {journalModal !== null && (
        <JournalModal
          idx={journalModal}
          onClose={() => setJournalModal(null)}
          onPrev={() => setJournalModal(i => Math.max(0, i - 1))}
          onNext={() => setJournalModal(i => Math.min(JOURNAL_QS.length - 1, i + 1))}
          hasPrev={journalModal > 0}
          hasNext={journalModal < JOURNAL_QS.length - 1}
        />
      )}
      {warnModal !== null && (
        <WarnModal
          idx={warnModal}
          onClose={() => setWarnModal(null)}
          onPrev={() => setWarnModal(i => Math.max(0, i - 1))}
          onNext={() => setWarnModal(i => Math.min(WARNING_SIGNS.length - 1, i + 1))}
          hasPrev={warnModal > 0}
          hasNext={warnModal < WARNING_SIGNS.length - 1}
        />
      )}
    </div>
  );
}
