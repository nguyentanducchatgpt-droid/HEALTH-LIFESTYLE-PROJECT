import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-checklist-orbit-kf';
const ORBIT_PROP = '--c-cl-angle';
const ORBIT_CLASS = 'c-cl-orbit-ring';

const STORAGE_KEY = 'lifestyle_checklist_state';
const HISTORY_KEY = 'lifestyle_checklist_history';

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const DAILY_ITEMS = [
  { id: 'sleep7', icon: '😴', label: 'Ngủ 7–9 tiếng', detail: 'Không tính ngủ bù cuối tuần', pillar: 'Giấc ngủ', color: '#6366f1' },
  { id: 'sleep_time', icon: '🌙', label: 'Ngủ trước 23:30', detail: 'Theo nhịp sinh học tự nhiên', pillar: 'Giấc ngủ', color: '#6366f1' },
  { id: 'sunlight', icon: '☀️', label: 'Ra ngoài đón nắng sáng', detail: 'Ít nhất 5–10 phút ánh sáng tự nhiên', pillar: 'Nhịp sinh học', color: '#f59e0b' },
  { id: 'steps', icon: '🚶', label: '8.000+ bước chân', detail: 'Hoặc 30 phút vận động nhẹ', pillar: 'NEAT', color: '#10b981' },
  { id: 'water', icon: '💧', label: 'Uống đủ nước', detail: 'Công thức: cân nặng × 35ml', pillar: 'Lối sống', color: '#0ea5e9' },
  { id: 'no_phone_morning', icon: '📵', label: 'Không phone 30 phút đầu', detail: 'Sau khi thức dậy buổi sáng', pillar: 'Môi trường', color: '#f43f5e' },
  { id: 'breathing', icon: '🌬️', label: 'Thực hành thở có chủ ý', detail: '5 phút thở cơ hoành hoặc box breathing', pillar: 'Thở', color: '#0ea5e9' },
];

const WEEKLY_QUESTIONS = [
  {
    id: 'wq1', icon: '⚡', question: 'Năng lượng trung bình tuần này là bao nhiêu?',
    options: ['Tệ — mệt mỏi thường xuyên', 'Trung bình — lên xuống thất thường', 'Tốt — ổn định trong ngày', 'Xuất sắc — tràn đầy năng lượng'],
    color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Năng Lượng — Chỉ Số Tổng Hợp Sức Khỏe Lối Sống',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mức năng lượng chủ quan (subjective energy) là một trong những chỉ số nhạy cảm nhất phản ánh tổng trạng thái sức khỏe lối sống — nhạy hơn nhiều số đo khách quan như huyết áp hay chỉ số BMI. Năng lượng thấp mãn tính là cờ đỏ đầu tiên của: sleep debt tích lũy, chronic cortisol elevation, insufficient NEAT, poor nutrition timing, hoặc combination của tất cả. Đây là lý do câu hỏi năng lượng là câu hỏi đầu tiên và quan trọng nhất.',
    detail: 'Năng lượng không phải chỉ "cảm giác" — nó phản ánh trạng thái ATP production, mitochondrial efficiency, cortisol rhythm, sleep quality, và nutritional status. Theo dõi hàng tuần giúp detect trend trước khi trở thành vấn đề sức khỏe nghiêm trọng.',
    details: [
      'Mức 1 — Tệ, mệt mỏi thường xuyên: energy deficit kinh niên thường có 1 trong các nguyên nhân: (a) Sleep debt tích lũy — mỗi đêm thiếu 1h ngủ tạo cognitive deficit tương đương 1–2 ngày không ngủ; sau 2 tuần bạn không còn nhận ra mình đang impaired. (b) Cortisol dysregulation — stress mãn tính làm "flat" cortisol rhythm, không còn peak sáng để tỉnh táo và không còn nadir tối để ngủ. (c) Iron deficiency/anemia — phổ biến ở phụ nữ VN, cần xét nghiệm nếu mệt không rõ nguyên nhân.',
      'Mức 2 — Trung bình, lên xuống thất thường: energy swings thường báo hiệu: blood sugar instability (ăn nhiều carb đơn, bỏ bữa), inconsistent sleep schedule (ngủ khác giờ cuối tuần/ngày thường), hoặc dehydration (não không phân biệt mệt/khát tốt — thường nhầm thành mệt). Pattern "tỉnh sau cà phê, sụp sau 2h, cần cà phê nữa" là dấu hiệu điển hình của cortisol/blood sugar instability.',
      'Mức 3 — Tốt, ổn định trong ngày: đây là baseline mục tiêu thực tế cho hầu hết người. Năng lượng ổn định không có peaks/crashes, không cần caffeine để function, không "drag" đến chiều, có thể tập trung 90 phút mà không distracted. Điều này đạt được khi: ngủ đủ 7–8h, protein đủ ở mỗi bữa, NEAT đạt 6.000–8.000 bước/ngày, và stress ở mức manageable.',
      'Mức 4 — Xuất sắc, tràn đầy năng lượng: trạng thái này xảy ra khi tất cả systems hoạt động cùng lúc: circadian rhythm synced, mitochondria efficient (từ consistent aerobic exercise), cortisol rhythm clean, sleep architecture đủ deep + REM, và emotional state positive. Không phải trạng thái "normal" cho người bận rộn hiện đại — là aspirational target. Nếu bạn ở đây: ghi nhận những gì bạn đã làm tuần này và replicate.',
      'Cách improve energy theo từng mức: Từ 1 → 2: ưu tiên ngủ trước tất cả (thêm 30–60 phút/đêm), giảm caffeine sau 14:00, uống đủ nước (2–2.5L/ngày). Từ 2 → 3: stabilize blood sugar (protein ở mỗi bữa, giảm carb đơn), consistent bedtime (±30 phút), thêm 2.000 bước/ngày. Từ 3 → 4: optimize sleep timing (ngủ sớm hơn 30 phút), thêm zone 2 cardio 2–3x/tuần, morning sunlight routine, reduce evening screen time.',
      'Energy và self-reporting accuracy: nghiên cứu cho thấy khi sleep-deprived, người ta consistently underestimate mức độ impairment của mình (Dinges, Penn). Điều này có nghĩa: nếu bạn đánh giá mình ở mức 2 (thất thường), thực tế có thể gần mức 1 hơn bạn nhận ra. Xu hướng adaptation — não tự normalize mức năng lượng thấp thành "bình thường". Theo dõi tuần-tuần giúp phát hiện trend deterioration mà không bị normalize.',
    ],
    points: [
      { icon: '📊', label: 'Energy = chỉ số tổng hợp nhạy nhất', note: 'Phản ánh sleep, cortisol, nutrition, NEAT cùng lúc — cờ đỏ đầu tiên khi một hệ thống bị suy' },
      { icon: '☕', label: 'Cần caffeine để function = mức 1–2', note: 'Caffeine mask sleep debt, không giải quyết — năng lượng thực thấp hơn bạn nhận ra' },
      { icon: '🔋', label: 'Mức 3 là realistic target cho người bận', note: 'Ổn định, không crash, tập trung 90 phút — đạt được khi ngủ đủ + protein + 6.000 bước/ngày' },
      { icon: '📈', label: 'Theo dõi hàng tuần ngăn normalization', note: 'Não quen với mệt mỏi và không nhận ra — weekly tracking phát hiện trend trước khi nghiêm trọng' },
    ],
  },
  {
    id: 'wq2', icon: '😴', question: 'Chất lượng giấc ngủ tuần này?',
    options: ['Khó ngủ, thức giữa chừng nhiều', 'Ngủ được nhưng không sâu', 'Ngủ tương đối tốt', 'Ngủ ngon, dậy sảng khoái'],
    color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Chất Lượng Giấc Ngủ — Nền Tảng Của Mọi Hành Vi Sức Khỏe',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giấc ngủ không phải "nghỉ ngơi thụ động" — não và cơ thể thực hiện hàng chục quá trình tích cực: memory consolidation (hippocampus), glymphatic clearance (loại bỏ protein độc bao gồm amyloid beta), hormone secretion (GH đỉnh trong N3), immune consolidation (cytokine production), và emotional processing (amygdala regulation trong REM). Một đêm ngủ kém = những quá trình này bị interrupted — không có shortcut nào để recover chỉ trong một đêm ngủ bù.',
    detail: 'Chất lượng giấc ngủ quan trọng hơn số giờ ngủ. 6 tiếng ngủ sâu có thể tốt hơn 8 tiếng interrupted sleep. Câu hỏi này hỏi chất lượng, không phải số lượng — giúp phân biệt "nằm đủ giờ" và "thực sự ngủ tốt".',
    details: [
      'Mức 1 — Khó ngủ, thức giữa chừng nhiều: sleep onset insomnia (>30 phút mới ngủ) và/hoặc sleep maintenance insomnia (thức giữa đêm >30 phút) — cả hai đều chỉ ra hyperarousal. Nguyên nhân phổ biến: (a) Cortisol cao tối (stress, caffeine sau 14:00, bright light tối, exercise muộn). (b) Core body temperature cao (phòng nóng, rượu). (c) Anxiety và racing thoughts (chưa xử lý stress ngày). (d) Sleep apnea nếu ngáy to + thức không rõ lý do.',
      'Mức 2 — Ngủ được nhưng không sâu: deep sleep (N3/slow-wave sleep) bị reduced. Dấu hiệu: ngủ đủ giờ nhưng dậy mệt, không refreshed. Nguyên nhân: phòng ngủ nóng (CBT không giảm đủ), alcohol (ức chế N3 sau khi "knock out" ban đầu), thiếu exercise (deep sleep tăng với regular exercise), hoặc caffeine muộn. Quick test: nếu hay mơ ngay sau khi ngủ → không đủ N3, vào REM quá sớm.',
      'Mức 3 — Ngủ tương đối tốt: baseline acceptable — deep sleep và REM đủ, nhưng có thể tối ưu thêm. Ở mức này, focus vào consistency: cùng giờ ngủ/dậy 7 ngày/tuần (kể cả cuối tuần) là improvement lớn nhất có thể làm. "Social jet lag" (thức khuya cuối tuần, dậy muộn) desync circadian rhythm giữa tuần ngay cả khi ngủ đủ giờ.',
      'Mức 4 — Ngủ ngon, dậy sảng khoái: đặc trưng bởi: dậy trước hoặc cùng lúc báo thức mà không cần effort, cảm giác refreshed và clear trong 15 phút đầu (không cần cà phê để function), có dreams nhớ được (REM đủ), và mood stable cả ngày. Đây là kết quả của: consistent sleep/wake time, phòng tối + mát, no alcohol, no screens 1h trước ngủ, và adequate exercise.',
      'Metrics để theo dõi khách quan hơn: (1) Sleep latency: bao lâu từ nằm → ngủ (<20 phút là tốt). (2) WASO (wake after sleep onset): tổng thời gian thức giữa đêm (<30 phút tốt). (3) Sleep efficiency: (thời gian ngủ / thời gian nằm) × 100 — >85% là tốt. (4) Morning alertness: không cần cà phê để function trong 1h đầu. Nếu không có wearable tracker, subjective rating hàng sáng (1–10) theo tuần là đủ.',
      'Action cho mỗi mức: Mức 1: ưu tiên wind-down routine 1h trước ngủ (dim light, no screens, giảm temp phòng). Kiểm tra caffeine, alcohol, exercise timing. Mức 2: optimize nhiệt độ phòng (18–20°C), giảm alcohol hoàn toàn, thêm resistance training. Mức 3: lock in consistent bedtime ±30 phút 7 ngày/tuần. Thêm morning sunlight để amplify circadian signal. Mức 4: maintain và tìm cơ hội tối ưu thêm (magnesium glycinate, sleep tracking để hiểu pattern).',
    ],
    points: [
      { icon: '🧠', label: 'Não làm việc tích cực khi ngủ', note: 'Glymphatic clearance, memory consolidation, hormone — không thể "bù" bằng ngủ nhiều hơn sau đó' },
      { icon: '🌡️', label: 'Dậy mệt dù đủ giờ = thiếu deep sleep', note: 'Phòng nóng, alcohol, caffeine muộn — tất cả giảm N3 mà không giảm tổng giờ ngủ' },
      { icon: '📅', label: 'Consistent bedtime > duration', note: 'Social jet lag cuối tuần desync circadian — cùng giờ ngủ 7 ngày là improvement lớn nhất' },
      { icon: '✅', label: 'Dậy trước báo thức = mức 4', note: 'Không cần effort, refreshed trong 15 phút, nhớ mơ — kết quả của tất cả systems hoạt động đúng' },
    ],
  },
  {
    id: 'wq3', icon: '🧘', question: 'Mức độ căng thẳng tuần này?',
    options: ['Rất cao — khó kiểm soát', 'Cao — ảnh hưởng sinh hoạt', 'Trung bình — có thể quản lý', 'Thấp — cân bằng tốt'],
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Mức Độ Căng Thẳng — Hiểu Stress Để Quản Lý Đúng Cách',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress không hoàn toàn xấu — "eustress" (stress tích cực, ngắn hạn) kích hoạt performance, growth hormone, và neuroplasticity. Vấn đề là "distress" mãn tính: cortisol cao kéo dài ức chế immune function, impair memory (hippocampus shrinks với chronic stress), tăng visceral fat, và gây sleep disruption. Câu hỏi này phân biệt stress ở mức nào để biết cần "manage" hay "alleviate" hay "address root cause".',
    detail: 'Stress chủ quan (perceived stress) quan trọng hơn stress khách quan — cùng một stressor, người này perceive là manageable, người kia perceive là overwhelming. Mindset và control perception quyết định cortisol response nhiều hơn stressor itself.',
    details: [
      'Mức 1 — Rất cao, khó kiểm soát: allostatic overload — hệ thống stress response bão hòa, không thể return to baseline. Triệu chứng: không thể "turn off" lo lắng, physical symptoms (headache, GI issues, muscle tension), emotional reactivity cao, và sleep severely disrupted. Ở mức này, lifestyle changes (breathing, exercise) chỉ là band-aid — cần address root stressor (workload, relationship, financial) và/hoặc professional support (therapist, counselor).',
      'Mức 2 — Cao, ảnh hưởng sinh hoạt: sympathetic nervous system dominant — fight-or-flight activated thường xuyên hơn rest-and-digest. Dấu hiệu: khó tập trung (amygdala hijack PFC), irritable, ít hứng thú với hoạt động thường thích, và HRV (Heart Rate Variability) thấp nếu có tracker. Ở mức này: breathing techniques (box breathing, 4-7-8) và exercise (đặc biệt zone 2 cardio) có impact đáng kể nếu thực hiện nhất quán.',
      'Mức 3 — Trung bình, có thể quản lý: "productive zone" — đủ arousal để perform, đủ recovery để sustainable. Tuy nhiên, mức này dễ drift lên mức 2 khi workload tăng. Prevention tốt hơn treatment: maintain micro-recovery practices (5 phút breathing sau mỗi meeting, walk ngắn sau ăn trưa) để keep stress từ tích lũy.',
      'Mức 4 — Thấp, cân bằng tốt: parasympathetic dominant — rest-and-digest, HRV cao, cortisol rhythm clean (peak sáng, thấp tối). Không phải "zero stress" — là stress được processed và recovered đủ nhanh. Dấu hiệu: cảm giác "on top of things", có bandwidth cho creativity và connection, và sleep quality tốt. Điều này đến từ: adequate sleep, regular exercise, social connection, và meaning/purpose trong công việc.',
      'Tools đo stress khách quan: HRV (Heart Rate Variability) là chỉ số khách quan tốt nhất cho stress recovery — HRV cao = parasympathetic recovery tốt. Wearables như Garmin, Apple Watch, Polar đo HRV. Morning HRV thấp hơn baseline 10–15% = cơ thể chưa recovered từ hôm qua. Perceived Stress Scale (PSS-10) là questionnaire validated đo stress level — có thể làm weekly.',
      'Intervention theo mức: Mức 1–2: tập breathing (box breathing: 4-4-4-4, 5–10 phút/ngày) — proven giảm cortisol trong 1 session. Zone 2 cardio (chạy bộ nhẹ 30 phút) giảm cortisol và tăng BDNF. Cold exposure ngắn (30 giây nước lạnh khi tắm) tăng norepinephrine, giảm anxiety. Mức 3: maintain practices, thêm mindfulness (không cần formal meditation — chỉ cần 5 phút chú ý hơi thở sau ăn trưa). Mức 4: optimize bằng sleep và HRV tracking để biết khi nào cần back off.',
    ],
    points: [
      { icon: '⚖️', label: 'Eustress tốt, distress mãn tính có hại', note: 'Stress ngắn hạn kích hoạt performance — vấn đề là khi không return to baseline được' },
      { icon: '🫁', label: 'Box breathing giảm cortisol trong 1 session', note: '4-4-4-4 hoặc 4-7-8, 5–10 phút — effective ngay lập tức cho mức 1–2' },
      { icon: '❤️', label: 'HRV sáng thấp = chưa recovered', note: 'Heart Rate Variability là chỉ số khách quan tốt nhất — thấp hơn baseline 10% = cần rest hôm nay' },
      { icon: '🎯', label: 'Perceived stress > actual stressor', note: 'Control perception và mindset giảm cortisol response nhiều hơn giảm workload' },
    ],
  },
  {
    id: 'wq4', icon: '🚶', question: 'Vận động & NEAT tuần này?',
    options: ['Gần như không vận động', 'Dưới mức kế hoạch', 'Đủ mục tiêu 4–5 ngày', 'Vượt mục tiêu, nhất quán'],
    color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Vận Động & NEAT — Nhiều Hơn Gym, Ít Hơn Bạn Nghĩ',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'NEAT (Non-Exercise Activity Thermogenesis) — năng lượng đốt qua mọi vận động ngoài tập có chủ đích — có thể chiếm 15–50% total daily energy expenditure tùy mức hoạt động. Người "sedentary" có NEAT chỉ ~300 kcal/ngày; người "active" có NEAT ~2.000 kcal/ngày — chênh lệch 1.700 kcal mà không cần gym. Câu hỏi này track cả structured exercise (gym) lẫn NEAT (bước chân, cầu thang, đứng) vì cả hai đều quan trọng ngang nhau.',
    detail: 'Một người tập gym 1h/ngày nhưng ngồi 10h còn lại (office worker) có thể có total movement ít hơn người không tập gym nhưng đi bộ nhiều, leo cầu thang, làm việc nhà. Đây là lý do "active couch potato" là thuật ngữ thực trong y văn — tập gym không đủ để offset sedentary lifestyle.',
    details: [
      'Mức 1 — Gần như không vận động: sedentary lifestyle — <4.000 bước/ngày, không exercise có chủ đích. Research cho thấy >8h sitting/ngày liên quan độc lập với: increased all-cause mortality (ngay cả khi exercise), giảm insulin sensitivity, giảm lipoprotein lipase activity (enzyme xử lý fat). Sitting là hành vi riêng, không phải chỉ là "thiếu exercise" — cần interrupt với standing/walking thường xuyên.',
      'Mức 2 — Dưới mức kế hoạch: có intention nhưng execution thiếu nhất quán. Nguyên nhân phổ biến: perfectionism ("không tập đủ 1h thì không tập"), all-or-nothing thinking ("tuần này bận, bỏ qua hết"), hoặc friction cao (phòng gym xa, phải thay đồ). Fix: lower the bar dramatically — 10 phút walk sau cơm, 5 phút stretching, 20 air squat — đều count. Consistency > intensity cho long-term health.',
      'Mức 3 — Đủ mục tiêu 4–5 ngày: excellent — đây là mức tạo ra health benefits đo được. WHO guidelines: 150–300 phút moderate intensity hoặc 75–150 phút vigorous/tuần. 4–5 ngày vận động là đủ để: cải thiện insulin sensitivity, giảm cardiovascular risk, tăng deep sleep, cải thiện mood (BDNF và endorphin). Focus ở mức này: gradually tăng intensity hoặc add strength training nếu chưa có.',
      'Mức 4 — Vượt mục tiêu, nhất quán: beyond guidelines — 6–7 ngày với mix của structured exercise và high NEAT. Ở mức này, monitor recovery: overtraining syndrome có thể xảy ra khi exercise volume cao kết hợp với insufficient sleep và high stress. HRV thấp + fatigue + performance drop = cần deload. More exercise không always better — progressive overload + adequate recovery = optimal.',
      'NEAT optimization tips: (1) Parking xa, leo cầu thang thay thang máy — không tốn thời gian thêm, cộng dồn 500–800 bước/ngày. (2) Standing desk hoặc treadmill desk — đứng 2–3h/ngày thay vì ngồi. (3) Walk-and-talk meetings qua phone. (4) Set hourly reminder để đứng dậy 2 phút mỗi giờ. (5) Housework, nấu ăn, sắp xếp đồ — tất cả là NEAT. (6) Walk 10 phút sau mỗi bữa ăn — proven giảm postprandial blood glucose spike 30–50%.',
      'Steps target thực tế: 10.000 bước phổ biến nhưng không phải evidence-based target tối ưu. Nghiên cứu JAMA 2021 (72.000 người UK Biobank): benefits plateau ở ~8.000–10.000 bước — thêm sau đó ít lợi thêm. Nhưng từ 4.000 → 7.000 bước có mortality benefit lớn nhất. Target thực tế: tăng 2.000 bước/ngày so với baseline hiện tại — đơn giản, measurable, và có impact thực.',
    ],
    points: [
      { icon: '🔥', label: 'NEAT = 15–50% total energy expenditure', note: 'Active person đốt 1.700 kcal/ngày NEAT hơn sedentary — không cần gym để tạo difference lớn' },
      { icon: '🪑', label: '"Active couch potato" là real', note: 'Tập gym 1h + ngồi 10h còn lại = sedentary lifestyle. Sitting cần interrupt riêng, không offset bằng exercise.' },
      { icon: '📉', label: '4.000→7.000 bước: mortality benefit lớn nhất', note: 'UK Biobank: không cần 10.000 bước — cải thiện từ ít sang vừa phải có impact health lớn nhất' },
      { icon: '🍽️', label: 'Walk 10 phút sau ăn = -30% glucose spike', note: 'Postprandial walk giảm blood sugar spike — một trong những NEAT interventions có evidence mạnh nhất' },
    ],
  },
  {
    id: 'wq5', icon: '🏆', question: 'Thói quen lối sống nào tốt nhất tuần này?',
    options: ['Giấc ngủ', 'Thở & thư giãn', 'Vận động', 'Môi trường'],
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Thói Quen Tốt Nhất — Nhận Diện Strengths Để Build On',
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Câu hỏi này không phải để bạn tự hào về một thứ — mà để identify "anchor habit" của tuần. Anchor habit là thói quen bạn thực hiện nhất quán nhất, có thể được dùng như foundation để stack thêm thói quen mới. James Clear: "The best way to build a new habit is to identify a current habit you already do each day and then stack your new behavior on top." Biết strength của mình là bước đầu tiên để scale it up.',
    detail: 'Mỗi pillar (giấc ngủ, thở, vận động, môi trường) có cơ chế cross-pillar: giấc ngủ tốt → năng lượng cho vận động. Vận động → ngủ sâu hơn. Môi trường tốt → dễ duy trì mọi thói quen. Thở/thư giãn → giảm stress → cải thiện cả sleep và exercise performance. Pillar mạnh nhất của bạn là điểm kéo các pillar khác lên.',
    details: [
      'Nếu chọn Giấc ngủ: đây là anchor mạnh nhất vì sleep ảnh hưởng tất cả pillar khác nhiều nhất. Ngủ tốt → cortisol rhythm healthy → năng lượng tốt → tập luyện có chất lượng hơn → appetite regulation tốt hơn → NEAT cao hơn. Next step từ đây: (1) Thêm morning sunlight để lock circadian rhythm vững hơn. (2) Stack thói quen tập luyện sáng vào sau routine sáng đang work tốt. (3) Thêm wind-down ritual tối để cải thiện từ "ngủ tốt" lên "ngủ xuất sắc".',
      'Nếu chọn Thở & thư giãn: stress management là anchor ít được nhận ra nhưng powerful. Cortisol thấp → immune function tốt hơn, sleep deep hơn, decision-making tốt hơn. Người giỏi stress management thường "lucky" hơn vì they make better decisions với calm mind. Next step: (1) Thêm box breathing vào routine sáng (3–5 phút). (2) Stack thói quen thở vào trước bữa ăn (giảm sympathetic activity khi ăn = tiêu hóa tốt hơn). (3) Explore HRV tracking để có data khách quan về recovery.',
      'Nếu chọn Vận động: physical activity có broadest health benefits — cardiovascular, metabolic, cognitive (BDNF), sleep quality, stress relief, và longevity. Nếu vận động đang là strength, bạn có foundation tốt nhất. Next step: (1) Ensure sleep đang support recovery (nếu chưa tối ưu, vận động sẽ có diminishing returns). (2) Add protein tracking nếu chưa — vận động mà thiếu protein không maximize muscle adaptation. (3) Thêm zone 2 cardio nếu chủ yếu đang lifting — cardiovascular base amplify benefits của strength training.',
      'Nếu chọn Môi trường: environment design là "meta-habit" — nó không phải một hành vi mà là infrastructure giúp tất cả hành vi khác dễ hơn. Nếu bạn đang làm tốt môi trường, bạn đang work smarter not harder. Next step: (1) Audit Friction Design: hành vi tốt nào còn có friction cao? Giảm 1–2 bước để dễ hơn. (2) Thêm visual cues cho thói quen muốn build (ví dụ: thảm yoga kế giường để tập sáng). (3) Share môi trường design với người sống cùng — social environment là pillar thứ 5 ít được nhắc đến.',
      'Cross-pillar synergies: (Giấc ngủ ↔ Vận động): deep sleep tăng với regular exercise; exercise cải thiện từ sleep-recovered state. (Thở ↔ Giấc ngủ): parasympathetic activation từ breathing practices giảm sleep latency và tăng deep sleep. (Môi trường ↔ Tất cả): phòng ngủ tối + mát + không phone = optimize sleep. Bàn sạch + cây = optimize work performance. Wind-down environment = optimize stress recovery. (Vận động ↔ Thở): breathing control trong vận động (nasal breathing) tăng exercise efficiency và recovery.',
      'Cách dùng câu trả lời này cho tuần sau: nếu đã có 1 pillar tốt → chọn 1 pillar yếu nhất để focus tuần sau. Không cố improve tất cả cùng lúc — brain bandwidth limited. "One thing" principle: chọn một thay đổi nhỏ nhất có thể từ pillar yếu nhất và implement nhất quán 7 ngày. Sau 4–6 tuần cycle này, bạn sẽ có 4–6 micro-improvements mà không cần willpower lớn.',
    ],
    points: [
      { icon: '⚓', label: 'Anchor habit = foundation để stack thêm', note: 'Biết strength của mình → dùng nó làm cue cho thói quen mới — James Clear proven method' },
      { icon: '🔗', label: 'Mỗi pillar kéo pillar khác lên', note: 'Cross-pillar synergies: ngủ tốt → vận động tốt → ngủ sâu hơn → vòng lặp tích cực' },
      { icon: '🎯', label: 'Focus 1 pillar yếu nhất mỗi tuần', note: 'Không improve tất cả cùng lúc — one thing principle: 1 micro-improvement / tuần = 52 thay đổi / năm' },
      { icon: '🏗️', label: 'Môi trường = meta-habit, infrastructure', note: 'Environment design không phải 1 hành vi — nó làm mọi hành vi khác dễ hơn tự động' },
    ],
  },
];

function getDayKey() {
  return new Date().toISOString().split('T')[0];
}

function ChecklistModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-48 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-4" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-2xl p-4 mb-5" style={{ background: `rgba(${item.rgb},0.07)`, border: `1px solid rgba(${item.rgb},0.18)` }}>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: item.color }}>{item.keyFact}</p>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
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
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →
            </button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

export default function LifestyleChecklistPage() {
  const [checked, setChecked] = useState({});
  const [weekAnswers, setWeekAnswers] = useState({});
  const [weeklyQIdx, setWeeklyQIdx] = useState(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cClOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cClOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const today = getDayKey();
      if (saved.date === today) setChecked(saved.checked || {});
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      setHistory(hist);
      // Calculate streak
      let s = 0;
      const d = new Date();
      while (true) {
        const key = d.toISOString().split('T')[0];
        if (hist[key] && hist[key].completed >= 5) { s++; d.setDate(d.getDate() - 1); }
        else break;
      }
      setStreak(s);
    } catch {}
  }, []);

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    const today = getDayKey();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, checked: next }));
      const completedCount = Object.values(next).filter(Boolean).length;
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
      hist[today] = { completed: completedCount, total: DAILY_ITEMS.length };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    } catch {}
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedCount / DAILY_ITEMS.length) * 100);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Checklist Lối Sống</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C8 · Daily Checklist</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">7 hành động lối sống khỏe mỗi ngày — đơn giản, dễ theo dõi, tích lũy dần thành thói quen bền vững. Đánh dấu xong mỗi ngày, theo dõi chuỗi ngày liên tiếp.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Checklist" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>7 hành động · Theo dõi tiến trình hằng ngày</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Stats row */}
      <RevealBlock className="mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{completedCount}/{DAILY_ITEMS.length}</div>
            <div className="text-base text-muted mt-1">Hôm nay</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{streak}</div>
            <div className="text-base text-muted mt-1">🔥 Ngày liên tiếp</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4 text-center" style={{ borderColor: `rgba(${RGB},0.15)` }}>
            <div className="text-4xl font-bold" style={{ color: COLOR }}>{progress}%</div>
            <div className="text-base text-muted mt-1">Hoàn thành</div>
          </div>
        </div>
      </RevealBlock>

      {/* Progress bar */}
      <RevealBlock className="mb-10">
        <div className="rounded-2xl border border-border bg-surface p-4" style={{ borderColor: `rgba(${RGB},0.1)` }}>
          <div className="flex justify-between text-base text-muted mb-2">
            <span>Tiến trình hôm nay</span>
            <span style={{ color: COLOR }}>{completedCount} / {DAILY_ITEMS.length}</span>
          </div>
          <div className="h-3 bg-bg rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: `linear-gradient(to right, ${COLOR}, rgba(${RGB},0.6))` }} />
          </div>
          {progress === 100 && (
            <div className="mt-3 text-center text-lg font-bold" style={{ color: COLOR }}>🎉 Hoàn thành 100%! Tuyệt vời!</div>
          )}
        </div>
      </RevealBlock>

      {/* Daily checklist */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Checklist Hằng Ngày</h2>
        <p className="text-muted text-lg mb-6">Đánh dấu từng mục khi hoàn thành. Tiến trình được lưu tự động.</p>
        <div className="space-y-2">
          {DAILY_ITEMS.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${checked[item.id] ? 'opacity-70' : 'hover:border-teal-500/20'}`} style={{ background: checked[item.id] ? `rgba(${RGB},0.08)` : 'var(--color-surface)', borderColor: checked[item.id] ? `rgba(${RGB},0.3)` : undefined }}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked[item.id] ? 'border-teal-400' : 'border-border'}`} style={{ background: checked[item.id] ? COLOR : undefined }}>
                {checked[item.id] && <span className="text-white text-base font-bold">✓</span>}
              </div>
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className={`text-lg font-medium transition-all ${checked[item.id] ? 'line-through text-muted' : 'text-text'}`}>{item.label}</div>
                <div className="text-base text-muted">{item.detail}</div>
              </div>
              <span className="text-base px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${item.color}15`, color: item.color }}>{item.pillar}</span>
            </button>
          ))}
        </div>
      </RevealBlock>

      {/* Weekly review */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Đánh Giá Cuối Tuần</h2>
        <p className="text-muted text-lg mb-2">5 câu hỏi phản tư để hiểu rõ hơn về tuần vừa qua và điều chỉnh cho tuần tiếp theo.</p>
        <p className="text-sm text-muted mb-6 opacity-60">Chọn câu trả lời · Click biểu tượng ℹ để xem phân tích chi tiết</p>
        <div className="space-y-4">
          {WEEKLY_QUESTIONS.map((q, qi) => (
            <div key={q.id} className="rounded-2xl border p-4 transition-all duration-200"
              style={{ borderColor: `rgba(${q.rgb},0.2)`, background: `rgba(${q.rgb},0.04)` }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl shrink-0">{q.icon}</span>
                <div className="flex-1 text-lg font-medium text-text">{q.question}</div>
                <button
                  onClick={() => setWeeklyQIdx(qi)}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{ background: `rgba(${q.rgb},0.15)`, color: q.color, border: `1px solid rgba(${q.rgb},0.3)` }}
                  title="Xem phân tích chi tiết">ℹ</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setWeekAnswers(prev => ({ ...prev, [q.id]: i }))}
                    className={`text-left text-base p-2 rounded-lg border transition-all ${weekAnswers[q.id] === i ? '' : 'border-border hover:border-opacity-50'}`}
                    style={weekAnswers[q.id] === i ? { borderColor: q.color, background: `rgba(${q.rgb},0.1)`, color: q.color } : { borderColor: 'rgba(255,255,255,0.1)' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {Object.keys(weekAnswers).length === WEEKLY_QUESTIONS.length && (
          <div className="mt-4 rounded-xl p-4 border text-lg text-center font-medium" style={{ borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.08)`, color: COLOR }}>
            ✓ Đã ghi nhận đánh giá tuần. Xem lại vào cuối tuần sau!
          </div>
        )}
      </RevealBlock>

      {/* ── Weekly question modal — outside all RevealBlocks ── */}
      {weeklyQIdx !== null && (
        <ChecklistModal
          item={WEEKLY_QUESTIONS[weeklyQIdx]}
          idx={weeklyQIdx}
          total={WEEKLY_QUESTIONS.length}
          onClose={() => setWeeklyQIdx(null)}
          onPrev={() => setWeeklyQIdx(i => Math.max(0, i - 1))}
          onNext={() => setWeeklyQIdx(i => Math.min(WEEKLY_QUESTIONS.length - 1, i + 1))}
          hasPrev={weeklyQIdx > 0}
          hasNext={weeklyQIdx < WEEKLY_QUESTIONS.length - 1}
        />
      )}

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/environment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Thiết Kế Môi Trường
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/assessment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Đánh Giá Lối Sống
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
