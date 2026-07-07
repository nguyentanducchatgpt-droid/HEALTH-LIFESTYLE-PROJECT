import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#14b8a6';
const RGB = '20,184,166';
const ORBIT_ID = 'c-assessment-orbit-kf';
const ORBIT_PROP = '--c-assess-angle';
const ORBIT_CLASS = 'c-assess-orbit-ring';
const STORAGE_KEY = 'lifestyle_assessment_score';

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

const QUESTIONS = [
  {
    id: 'sleep_hours', category: 'Giấc Ngủ', icon: '😴', color: '#6366f1', rgb: '99,102,241',
    q: 'Bạn ngủ bao nhiêu giờ mỗi đêm (trung bình)?',
    options: [
      { label: 'Dưới 5 giờ', pts: 0 },
      { label: '5–6 giờ', pts: 5 },
      { label: '6–7 giờ', pts: 10 },
      { label: '7–9 giờ', pts: 15 },
    ],
    modalTitle: 'Số Giờ Ngủ — Nền Tảng Không Thể Thương Lượng Với Sinh Học',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: '7–9 tiếng là khuyến cáo của National Sleep Foundation cho người 18–64 tuổi, được xây dựng từ hàng trăm nghiên cứu kiểm soát chặt chẽ. Đây không phải "lý tưởng mơ hồ" — đây là minimum sinh học để não hoàn thành: glymphatic clearance (loại bỏ amyloid beta và metabolic waste), memory consolidation (hippocampus transfer từ short-term → long-term), và hormone secretion (growth hormone đỉnh trong N3, cortisol reset). Dưới 7h → các quá trình này bị incomplete mỗi đêm, tạo sleep debt tích lũy không thể trả bằng ngủ bù cuối tuần.',
    detail: 'Nghiên cứu Van Dongen (Penn, 2003): ngủ 6h/đêm trong 14 ngày tạo cognitive impairment tương đương 2 ngày không ngủ hoàn toàn — nhưng người tham gia không nhận ra vì não đã normalize. Sau 2 tuần ngủ ít, bạn mất khả năng đánh giá chính xác mình bị ảnh hưởng bao nhiêu.',
    details: [
      'Sleep debt tích lũy mà không nhận ra: Van Dongen (Penn, 2003) cho 48 người ngủ 4h, 6h hoặc 8h trong 14 ngày. Nhóm 6h sau 14 ngày có cognitive impairment tương đương nhóm không ngủ 2 ngày liên tục — nhưng họ report "cảm thấy ổn". Brain adapts với sleep deprivation theo cách khiến bạn lose khả năng evaluate chính xác performance của mình. Đây là lý do nhiều người nói "tôi quen ngủ ít" — thực ra họ đã normalize impairment.',
      'Glymphatic system và amyloid beta: hệ thống glymphatic (phát hiện 2012 bởi Maiken Nedergaard) là hệ lymph của não, hoạt động chủ yếu khi ngủ bằng cách bơm CSF qua interstitial space để flush amyloid beta, tau protein và metabolic waste. Hệ thống này gần như inactive khi thức — hoạt động tăng 60% khi ngủ. Thiếu ngủ kinh niên → amyloid beta tích lũy → hallmark của Alzheimer bắt đầu sớm hơn nhiều thập kỷ. Chỉ một đêm mất ngủ đã tăng amyloid beta đo được trong CSF.',
      'Memory consolidation và hippocampus: trong giấc ngủ, hippocampus "replays" experiences của ngày để transfer từ short-term memory sang long-term storage trong neocortex. Quá trình này xảy ra đặc biệt trong N2 (sleep spindles) và N3 (slow-wave sleep). Bỏ lỡ các stages này → retention kém, học không hiệu quả, emotional memories không được processed đúng cách. Học tối hôm trước kỳ thi mà không ngủ đủ = học không vào bằng học ít hơn nhưng ngủ đủ.',
      'Growth Hormone và physical recovery: 70–80% daily GH secretion xảy ra trong slow-wave sleep (N3) trong nửa đầu của đêm. GH kiểm soát: muscle protein synthesis, fat metabolism, immune function, và tissue repair. Người ngủ <6h có GH secretion giảm đáng kể → muscle recovery kém sau tập, khó lose fat, immune function suy yếu. Đây là lý do elite athletes ngủ 9–10h/đêm — không phải laziness, mà là training optimization.',
      'Cortisol rhythm và ngủ thiếu: cortisol bình thường có nadir lúc midnight–2am và peak lúc 7–9am (Cortisol Awakening Response). Thiếu ngủ → cortisol elevated cả ngày (không có nadir) → chronic stress state → inflammatory markers tăng, insulin resistance tăng, visceral fat tăng. Chỉ 1 tuần ngủ 5h: fasting glucose tăng, insulin sensitivity giảm đáng kể — tương đương về metabolic risk với thêm vài kg mỡ bụng.',
      'Ngưỡng điểm phản ánh evidence: 15 điểm cho 7–9h vì đây là range có outcomes tốt nhất trong population studies. 10h+ có correlation với higher mortality trong observational studies (confounding: người bệnh ngủ nhiều hơn). Under 6h là risk factor rõ ràng cho cardiovascular disease, type 2 diabetes, obesity, depression và cognitive decline — không phải correlation mà là causal relationship được verify qua controlled sleep restriction experiments.',
    ],
    points: [
      { icon: '🧠', label: 'Glymphatic flush amyloid beta +60% khi ngủ', note: 'Thiếu ngủ = toxin tích lũy, hippocampus shrinks — risk Alzheimer bắt đầu hàng thập kỷ trước' },
      { icon: '📉', label: '6h × 14 ngày = impairment 2 ngày mất ngủ', note: 'Van Dongen Penn: cognitive deficit không nhận ra được vì não đã normalize dần dần' },
      { icon: '💪', label: '70–80% GH tiết ra trong N3 deep sleep', note: 'Muscle recovery, fat metabolism, immune function — mất đỉnh GH khi ngủ thiếu giờ' },
      { icon: '⏰', label: 'Vào giường sớm hơn giờ dậy 8 tiếng', note: '30 phút wind-down + buffer = cần 8h trong giường để thực sự đạt 7h ngủ' },
    ],
  },
  {
    id: 'sleep_quality', category: 'Giấc Ngủ', icon: '🌙', color: '#6366f1', rgb: '99,102,241',
    q: 'Chất lượng giấc ngủ của bạn như thế nào?',
    options: [
      { label: 'Rất tệ — thường xuyên mất ngủ', pts: 0 },
      { label: 'Thấp — ngủ không ngon', pts: 5 },
      { label: 'Trung bình — đôi khi khó ngủ', pts: 10 },
      { label: 'Tốt — ngủ ngon thường xuyên', pts: 15 },
    ],
    modalTitle: 'Chất Lượng Giấc Ngủ — Architecture Quan Trọng Hơn Số Giờ',
    img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chất lượng giấc ngủ phụ thuộc vào sleep architecture — tỷ lệ và distribution của N1, N2, N3, REM trong đêm. Người ngủ 8h nhưng interrupted (nhiều lần thức giữa đêm, ít N3) có cognitive function và recovery kém hơn người ngủ 6.5h ngủ sâu liên tục. Polysomnography studies: "refreshed" hay không sau ngủ được dự đoán tốt nhất bởi slow-wave sleep (N3) duration và REM quality — không phải total hours. Câu hỏi này đánh giá subjective sleep quality, proxy cho sleep architecture hiệu quả.',
    detail: 'Pittsburgh Sleep Quality Index (PSQI) — công cụ validated phổ biến nhất — đánh giá 7 components: subjective quality, latency, duration, efficiency, disturbances, medication use, và daytime dysfunction. "Tốt — ngủ ngon thường xuyên" trong assessment này tương ứng với PSQI "good sleeper" (score ≤5) — baseline mà mọi recovery process được built on.',
    details: [
      '"Rất tệ — thường xuyên mất ngủ" là insomnia disorder: DSM-5 criteria: khó ngủ >30 phút, thức giữa đêm >30 phút, hoặc dậy sớm không ngủ lại — ít nhất 3 đêm/tuần trong ≥3 tháng, gây distress hoặc impairment. Prevalence: 10–15% người trưởng thành có chronic insomnia. Insomnia tăng risk depression 10 lần, anxiety disorder, và cardiovascular disease. CBT-I (Cognitive Behavioral Therapy for Insomnia) là first-line treatment — hiệu quả hơn sleeping pills dài hạn.',
      '"Thấp — ngủ không ngon" là vùng "ngủ được nhưng không sâu": deep sleep (N3) bị reduced, sleep fragmentation nhiều, WASO (wake after sleep onset) cao. Nguyên nhân phổ biến: phòng ngủ quá nóng (N3 cần nhiệt độ cơ thể giảm → cần <20°C), alcohol (suppress N3 sau initial sedation), caffeine muộn (half-life 5–6h, caffeine 15:00 vẫn còn 25% lúc 21:00), blue light tối (delay melatonin onset), sleep apnea nếu ngáy to.',
      '"Trung bình — đôi khi khó ngủ" thường linked với stress variability và inconsistent schedule. "Social jetlag" — thức khuya cuối tuần, dậy muộn — desync circadian rhythm, gây khó ngủ Sunday night và khó thức Monday morning. Cứ mỗi giờ social jetlag: 30% tăng risk obesity (Roenneberg, 2012). Key fix: lock consistent sleep/wake time ±30 phút kể cả cuối tuần — improvement lớn nhất với effort nhỏ nhất.',
      '"Tốt — ngủ ngon thường xuyên" đặc trưng bởi: sleep latency <20 phút (thời gian từ nằm → ngủ), WASO <30 phút tổng cộng, dậy refreshed không cần effort trong 15 phút, có dreams nhớ được (indicator REM đủ), và sleep efficiency ≥85% (sleep time / time in bed × 100). Đây là state cho phép tất cả recovery processes hoàn thành đầy đủ mỗi đêm.',
      'Hyperarousal và cognitive insomnia: chronic insomnia thường maintained bởi hyperarousal — hệ thống stress response (HPA axis, sympathetic NS) chronically activated ngay cả khi nằm. "Conditioned arousal": giường trở thành trigger cho wakefulness thay vì sleep (classical conditioning). Stimulus control (chỉ nằm lên giường khi buồn ngủ thực sự) và sleep restriction therapy là most effective behavioral interventions — hiệu quả hơn z-drugs hay benzos về long-term outcomes.',
      'Optimization roadmap theo từng mức: Từ "Rất tệ" → "Thấp": sleep restriction therapy (dậy cố định bất kể ngủ bao lâu), giảm caffeine sau 13:00, phòng 18–20°C. Từ "Thấp" → "Trung bình": 1h wind-down ritual (dim light, no screens, cool shower trước ngủ). Từ "Trung bình" → "Tốt": lock consistent bedtime ±30 phút 7 ngày/tuần, morning sunlight anchor circadian. Từ "Tốt" → maintain: magnesium glycinate 300–400mg trước ngủ, sleep tracking để identify patterns.',
    ],
    points: [
      { icon: '🏗️', label: 'Sleep architecture > total duration', note: 'N3 + REM balance quyết định refreshed hay không — 6h ngủ sâu tốt hơn 8h interrupted' },
      { icon: '🌡️', label: 'Phòng >22°C giảm N3 đáng kể', note: 'Core body temperature phải giảm để enter deep sleep — nhiệt độ là lever dễ nhất để optimize' },
      { icon: '🍷', label: 'Alcohol: dễ ngủ → N3 suppression → dậy mệt', note: 'Architecture bị phá dù đủ giờ — "ngủ được" ≠ "ngủ tốt" với alcohol trước ngủ' },
      { icon: '📅', label: 'Consistent bedtime 7 ngày là key fix', note: 'Social jetlag cuối tuần desync circadian cả tuần — fix timing trước khi fix duration' },
    ],
  },
  {
    id: 'neat_steps', category: 'NEAT & Vận Động', icon: '🚶', color: '#10b981', rgb: '16,185,129',
    q: 'Số bước chân trung bình mỗi ngày?',
    options: [
      { label: 'Dưới 3.000 bước', pts: 0 },
      { label: '3.000–6.000 bước', pts: 5 },
      { label: '6.000–10.000 bước', pts: 10 },
      { label: 'Trên 10.000 bước', pts: 15 },
    ],
    modalTitle: 'Số Bước Chân — NEAT Là Nền Tảng Sức Khỏe Vận Động Hàng Ngày',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'NEAT (Non-Exercise Activity Thermogenesis) — năng lượng từ mọi vận động ngoài tập có chủ đích — có thể chiếm 15–50% tổng năng lượng tiêu thụ mỗi ngày. JAMA Internal Medicine 2021 (16.741 phụ nữ): mortality giảm từ 2.700 bước, plateau ở ~7.500 bước. JAMA Neurology 2022 (78.500 người): 9.800 bước/ngày → giảm 51% risk dementia, 57% giảm anxiety/depression. 10.000 bước là con số marketing từ pedometer Nhật năm 1964 — không phải evidence-based. 6.000–10.000 bước là sweet spot thực sự.',
    detail: 'Sedentary behavior là risk factor độc lập ngay cả khi có exercise: người tập gym 1h/ngày nhưng ngồi 9–10h còn lại vẫn có increased metabolic risk. Lipoprotein lipase (LPL) — enzyme xử lý fat và glucose — bị inactivated khi ngồi. Mỗi 2–3 phút đứng/đi lại restore LPL activity. Đây là lý do steps quan trọng riêng biệt với structured exercise.',
    details: [
      'NEAT và total daily energy: người "naturally active" đốt thêm 350 kcal/ngày qua NEAT so với người "naturally sedentary" — mà không đi gym (Levine, Mayo Clinic). Trong 1 năm tích lũy: tương đương 36kg mỡ. Không phải gen — là unconscious movement habits: đứng khi điện thoại, đi bộ khi nói chuyện, fidgeting. Gym 1h/ngày = 4% thời gian thức. 96% còn lại quyết định NEAT và health outcomes.',
      '8.000 bước: evidence-based target: JAMA Internal Medicine 2021 meta-analysis (47.471 người): mỗi 1.000 bước thêm giảm mortality 6–36% với diminishing returns từ 8.000 bước. JAMA Neurology 2022: 9.800 bước là "optimal" cho dementia prevention — nhưng 3.800 bước/ngày đã giảm dementia risk 25%. Improvement từ 2.000 → 6.000 bước có impact lớn hơn từ 8.000 → 12.000 — không cần 10.000 để có benefit đáng kể.',
      'Steps và cognitive function: walking tăng hippocampal volume — một trong số ít interventions có thể physically grow gray matter ở người trưởng thành. BDNF (Brain-Derived Neurotrophic Factor) — "Miracle-Gro for the brain" (Ratey) — tăng sau 20–30 phút moderate walking. BDNF improve long-term potentiation (học mới), neuroplasticity, và depression resilience. 20 phút walking trước học tăng academic performance — effect carry over vào cognitive tasks tiếp theo.',
      'Postprandial walking và blood sugar: đi bộ 10–15 phút sau bữa ăn giảm postprandial blood glucose spike 30–50% thông qua non-insulin dependent glucose uptake vào cơ bắp (GLUT4 translocation không cần insulin signal). Effective ngay cả với người insulin resistant. 3 × 10 phút sau bữa ăn = 30 phút vận động + ~2.500 bước + significant blood sugar management. Không cần speed — casual walking đủ để trigger effect này.',
      'Practical integration (không cần thêm thời gian): gap từ sedentary (3.000) → moderate (7.000–8.000) = 4.000–5.000 bước = 35–45 phút. Cách tích hợp: parking xa 400m (800 bước × 2 chuyến), leo cầu thang (100–150 bước/tầng), đi bộ sau bữa trưa 15 phút (~1.500 bước), đứng khi điện thoại. Tổng: +4.000 bước mà không cần "thời gian tập" riêng — chỉ cần thay đổi micro-decisions.',
      'Pace và intensity: 8.000 bước casual (100–110 bước/phút) có cardiovascular benefit moderate. Brisk walking (120–130 bước/phút, slightly breathless) đạt moderate-intensity aerobic guideline WHO (150 phút/tuần). Mix lý tưởng: 6.000 bước NEAT từ daily activities + 2.000 bước brisk walk buổi tối = đạt cả NEAT target và cardio guideline. Cadence app trên smartphone giúp maintain pace tự động.',
    ],
    points: [
      { icon: '📊', label: 'Mortality benefit plateau 7.500–8.000 bước', note: 'JAMA 2021: gap 2.000→7.000 có impact lớn hơn gap 8.000→12.000 — đừng ám ảnh con số 10.000' },
      { icon: '🧠', label: 'BDNF sau walking = Miracle-Gro cho não', note: 'Hippocampal volume tăng với regular walking — memory, learning và depression resilience cải thiện' },
      { icon: '🍽️', label: 'Walk 10 phút sau ăn = -30–50% glucose spike', note: 'GLUT4 translocation không cần insulin — effective ngay cả người insulin resistant' },
      { icon: '🏢', label: 'Parking xa + cầu thang = +4.000 bước/ngày', note: 'Zero extra time — tích hợp vào micro-decisions bình thường, không cần "thời gian tập" riêng' },
    ],
  },
  {
    id: 'circadian', category: 'Nhịp Sinh Học', icon: '☀️', color: '#f59e0b', rgb: '245,158,11',
    q: 'Bạn có ra ngoài hoặc tiếp xúc ánh sáng tự nhiên buổi sáng không?',
    options: [
      { label: 'Gần như không bao giờ', pts: 0 },
      { label: 'Hiếm khi (< 2 ngày/tuần)', pts: 3 },
      { label: 'Thỉnh thoảng (3–4 ngày)', pts: 8 },
      { label: 'Thường xuyên (5+ ngày)', pts: 15 },
    ],
    modalTitle: 'Ánh Sáng Buổi Sáng — Zeitgeber Mạnh Nhất Reset Đồng Hồ Sinh Học',
    img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng sáng sớm là "zeitgeber" (time-giver) mạnh nhất để calibrate circadian clock mỗi ngày. ipRGC — intrinsically photosensitive retinal ganglion cells — chứa melanopsin, cần >1.000 lux để trigger circadian signal đầy đủ đến SCN (suprachiasmatic nucleus) trong hypothalamus. Phòng sáng nhất trong nhà chỉ 300–1.000 lux — không đủ. Ngoài trời trong bóng mát: 10.000–20.000 lux. Signal từ ipRGC → SCN → melatonin ức chế → Cortisol Awakening Response kích hoạt → toàn bộ circadian cascade bắt đầu đúng timing.',
    detail: 'Điểm không đồng đều (0/3/8/15) phản ánh dose-response về frequency: 5+ ngày/tuần là frequency cần thiết để maintain strong circadian anchor. Ít hơn thì circadian rhythm "drift" theo thời gian. 3–4 ngày tốt hơn đáng kể so với 1–2 ngày, và 5+ ngày là điểm mà circadian entrainment thực sự ổn định và consistent.',
    details: [
      'ipRGC và melanopsin: phát hiện 1999 bởi David Berson (Brown University), ipRGC là tế bào cảm quang thứ ba trong võng mạc — không phải để "nhìn" mà chỉ để đo irradiance (cường độ ánh sáng) và signal SCN. Peak sensitivity: 480nm (cyan-blue). Threshold cao — cần ánh sáng đủ mạnh và sustained. Người mù (mất rod/cone) vẫn có circadian rhythm bình thường nếu ipRGC intact. Kính râm, kính cận, kính áp tròng đều reduce signal reaching ipRGC.',
      'Nắng ngoài trời vs ánh đèn nhà: nắng VN mùa hè: 50.000–100.000 lux. Bóng mát ngoài trời: 10.000–20.000 lux. Gần cửa sổ kính: 500–1.000 lux. Phòng sáng nhất nhà: 100–500 lux. SAD lamp 10.000 lux. ipRGC cần >1.000 lux sustained 10–30 phút để trigger đầy đủ. Giải thích tại sao "ngồi gần cửa sổ" không replace "ra ngoài". Không cần nhìn mặt trời — ambient light ngoài trời đủ.',
      'Cortisol Awakening Response (CAR): CAR là natural surge cortisol 50–100% trong 30–60 phút đầu sau thức — cần thiết cho alertness, immune activation, metabolic startup. Morning light amplify và sharpen CAR. Thiếu morning light → blunted CAR → "brain fog" kéo dài → caffeine dependency tăng (caffeine chỉ block adenosine, không replace cortisol function). Andrew Huberman (Stanford Neuroscience): "Morning light viewing is the single most important thing you can do each day."',
      'Serotonin–melatonin pipeline: ánh sáng sáng → ipRGC → raphe nuclei → serotonin synthesis tăng. Serotonin là direct precursor của melatonin (via N-acetyltransferase). "More morning serotonin now = more melatonin tonight." SAD (Seasonal Affective Disorder) được điều trị hiệu quả bằng 10.000 lux morning light vì thiếu ánh sáng sáng → low serotonin → depression. VN gần xích đạo nhưng người làm việc văn phòng cả ngày không khác gì người ở Scandinavia mùa đông.',
      'Golden window và timing: 30–60 phút đầu sau thức là window có maximum impact cho circadian phase anchoring. Ánh sáng sau window này vẫn tốt cho health nhưng circadian impact giảm. Trời nhiều mây: 10.000–20.000 lux ngoài trời — vẫn đủ. Không thể ra ngoài: SAD lamp 10.000 lux 20–30 phút khi ăn sáng (evidence-based substitute). Ngay cả 5 phút outdoor sáng có measurable effect trên circadian timing.',
      'Consistency là critical: bỏ 2 ngày cuối tuần → circadian phase drift nhẹ → Sunday insomnia, Monday morning grogginess. Circadian rhythm cần daily reset giống water intake hay brushing teeth. Ideal: mỗi sáng ra ngoài 5–10 phút trong 30 phút đầu sau thức, mọi ngày kể cả cuối tuần — đặc biệt cuối tuần khi hay thức muộn. Không đeo kính râm trong buổi sáng session (giảm lux hitting retina).',
    ],
    points: [
      { icon: '🏠', label: 'Phòng sáng nhà: 100–500 lux — không đủ', note: 'ipRGC cần >1.000 lux — phải ra ngoài, ngồi gần cửa sổ không thể replace outdoor light' },
      { icon: '⚡', label: 'CAR amplification = natural energy sáng', note: 'Cortisol Awakening Response mạnh hơn → alertness sâu hơn, ít cần caffeine, mood ổn định' },
      { icon: '🌙', label: 'Morning serotonin → more melatonin tonight', note: 'Pipeline: ánh sáng sáng → serotonin ngay → melatonin tốt hơn tối → ngủ sâu hơn' },
      { icon: '📅', label: '5+ ngày/tuần: circadian entrainment ổn định', note: 'Bỏ 2 ngày cuối tuần → drift → khó ngủ Sunday, khó dậy Monday — consistency là key' },
    ],
  },
  {
    id: 'stress', category: 'Quản Lý Căng Thẳng', icon: '🧘', color: '#a855f7', rgb: '168,85,247',
    q: 'Mức độ căng thẳng mãn tính của bạn?',
    options: [
      { label: 'Rất cao — ảnh hưởng sinh hoạt', pts: 0 },
      { label: 'Cao — khó kiểm soát', pts: 3 },
      { label: 'Trung bình — có thể quản lý', pts: 8 },
      { label: 'Thấp — cân bằng tốt', pts: 10 },
    ],
    modalTitle: 'Căng Thẳng Mãn Tính — Kẻ Thầm Lặng Phá Hoại Mọi Hệ Thống',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chronic stress (distress kéo dài) khác hoàn toàn với acute stress (eustress tích cực ngắn hạn). HPA axis khi activated mãn tính: cortisol elevated không có nadir → ức chế hippocampus (memory, learning) → hippocampus literally shrinks với chronic stress (Sapolsky, Stanford). Đồng thời: immune suppression, insulin resistance, visceral fat deposition, và sleep disruption. Điểm tối đa câu hỏi này chỉ 10 (không phải 15) vì stress là context-dependent — "manageable" là threshold realistic cần đạt.',
    detail: 'Perceived stress (chủ quan) quan trọng hơn objective stressor — cùng workload, người này perceive là challenging (eustress), người kia perceive là overwhelming (distress). Mindset và sense of control quyết định cortisol response nhiều hơn stressor itself (Alia Crum, Stanford Mind & Body Lab experiments).',
    details: [
      'HPA axis dysregulation và brain anatomy: HPA axis bình thường: stressor → CRH (hypothalamus) → ACTH (pituitary) → cortisol (adrenal) → negative feedback. Chronic stress: feedback inhibition bị blunted → cortisol chronically elevated. Consequences: (a) Hippocampus shrinks — cortisol neurotoxic ở nồng độ cao, dendritic atrophy trong CA3 region. (b) Amygdala hyperactivates → emotional reactivity tăng, fear generalization. (c) PFC thinning → decision-making và impulse control giảm. Stress literally reshapes brain anatomy theo hướng ngược với meditation (tăng PFC, giảm amygdala).',
      'Immune suppression và wound healing: short-term acute stress → immune boost (evolutionary: prepare to heal wounds). Chronic stress → immune suppression: NK (natural killer) cell count và function giảm → reduced tumor surveillance. Vaccine response kém với chronic stress (Cohen, CMU: stressed medical students có lower antibody response to hepatitis B vaccine). Wound healing chậm 40–60% (Kiecolt-Glaser: caregivers với high chronic stress healed wounds 40% slower than controls).',
      'Visceral fat và cortisol mechanism: cortisol promotes visceral adipogenesis (mỡ bụng sâu) thông qua: (a) Glucocorticoid receptors đậm đặc ở omentum. (b) Lipoprotein lipase activation ở visceral adipocytes. (c) Appetite tăng cho high-calorie foods (cortisol increases reward sensitivity for sugar/fat). Visceral fat là metabolically active — secretes inflammatory cytokines (IL-6, TNF-α), worsening insulin resistance và cardiovascular risk. Stress không chỉ gây tăng cân — gây tăng cân đúng kiểu nguy hiểm nhất.',
      'Stress → insomnia vòng lặp: cortisol và melatonin có inversely related rhythms. Chronic stress → cortisol elevated tối → ức chế melatonin onset → khó ngủ → sleep deprivation → cortisol higher next day → vòng lặp xấu tự reinforcing. Hyperarousal maintained khi ngủ: higher brain temperature, faster EEG activity, elevated metabolic rate — physiological state không compatible với deep sleep. "Stress causes insomnia, insomnia causes more stress" (Harvey, 2002) — vòng lặp cần phá từ cả hai phía.',
      'Perception matters more than stressor: Alia Crum (Stanford) experiment: nhóm được cho biết "stress is enhancing" vs "stress is debilitating" — với cùng stress load, nhóm "enhancing" có better cardiovascular response (higher DHEA-to-cortisol ratio, faster cortisol recovery), fewer symptoms, higher performance. Kelly McGonigal (TED 2013): người view stress as challenge vs threat có dramatically different health outcomes, controlled for objective stressor. Reframe không phải denial — là changing physiological response.',
      'Evidence-based interventions: (a) Box breathing (4-4-4-4): proven giảm cortisol trong 5–10 phút — Navy SEALs, emergency responders, ICU nurses. (b) Zone 2 cardio 30 phút: reduces cortisol, increases BDNF, improves HRV — most robust evidence for stress relief. (c) Cold exposure 30–60 giây: tăng norepinephrine 300%, giảm anxiety chronically (Huberman). (d) Social connection: oxytocin là physiological antidote to cortisol. (e) Nature exposure: 20 phút trong thiên nhiên (không cần exercise) giảm salivary cortisol 21% (Hunter, 2019).',
    ],
    points: [
      { icon: '🧠', label: 'Hippocampus literally shrinks với chronic stress', note: 'Sapolsky Stanford: cortisol neurotoxic — memory và learning kém là structural change, không chỉ cảm giác' },
      { icon: '🛡️', label: 'Wound healing chậm 40–60% khi stressed', note: 'Kiecolt-Glaser: immune suppression là literal, đo được — không phải metaphor' },
      { icon: '🫁', label: 'Box breathing giảm cortisol trong 5 phút', note: '4-4-4-4 proven: Navy SEAL kỹ thuật — immediate, zero cost, zero equipment needed' },
      { icon: '💭', label: 'Stress perception > stressor intensity', note: 'Crum Stanford: "enhancing" mindset → different cortisol profile với cùng objective stress load' },
    ],
  },
  {
    id: 'screen_evening', category: 'Môi Trường', icon: '📱', color: '#f43f5e', rgb: '244,63,94',
    q: 'Bạn dùng điện thoại/màn hình trước khi ngủ bao lâu?',
    options: [
      { label: 'Cho đến khi ngủ', pts: 0 },
      { label: '>1 giờ trước ngủ', pts: 3 },
      { label: '30–60 phút trước ngủ', pts: 8 },
      { label: 'Không dùng trước ngủ 30 phút', pts: 10 },
    ],
    modalTitle: 'Màn Hình Trước Ngủ — Blue Light Và Cognitive Arousal Phá Giấc Ngủ',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Screens trước ngủ ảnh hưởng qua 2 cơ chế độc lập, không phải chỉ một: (1) BLUE LIGHT (480nm) suppresses melatonin — Charles Czeisler (Harvard, 2014): đọc iPad 4h trước ngủ giảm melatonin 55%, delay sleep onset 10 phút, giảm REM sleep 40%, tăng drowsiness ngày hôm sau. (2) COGNITIVE AROUSAL — content (news, social, email) kích hoạt amygdala và PFC, maintain sympathetic state không compatible với sleep onset. Quan trọng: ngay cả night mode/amber glasses chỉ address cơ chế số 1 mà không fix cognitive arousal — cần screen-free hoàn toàn.',
    detail: 'Điểm tối đa 10 (không phải 15) vì screen behavior là environmental factor, không phải biological baseline như sleep hours. "Không dùng 30 phút" là realistic minimum recommendation — optimal là 1h+ nhưng 30 phút là threshold có evidence. Content type cũng matters: calming content + dim screen < stimulating content + bright screen < no screen entirely.',
    details: [
      'Melatonin suppression mechanism: ipRGC trong võng mạc nhạy nhất với 480nm blue light — cùng wavelength mà LCD/LED screens emit nhiều. Signal: ipRGC → SCN → ức chế pineal gland → melatonin secretion giảm. Cường độ ức chế phụ thuộc brightness và duration. Màn hình phone full brightness: ~500–800 lux (đủ để suppress melatonin đáng kể). Night mode giảm ~25–30% suppression — cải thiện nhưng không đủ. Timing: 1–2h trước ngủ là most sensitive window cho melatonin onset.',
      'Czeisler Harvard 2014 study (PNAS): 12 người, crossover design nghiêm ngặt — đọc e-reader 4h trước ngủ vs đọc sách in, 5 ngày mỗi condition. E-reader condition: melatonin onset delay ~1.5h, total melatonin giảm, sleep onset latency tăng 10 phút, REM sleep giảm, và morning alertness kém hơn ngày hôm sau — ngay cả khi tổng giờ ngủ bằng nhau. Đây là small study nhưng controlled rất chặt chẽ, được replicate nhiều lần với consistent findings.',
      'Cognitive arousal là cơ chế thứ hai: content (social media, news, email, games) kích hoạt threat detection (amygdala) và executive processing (PFC), maintain sympathetic nervous system state. Stress response sau khi đặt phone xuống có "tail" kéo dài 15–30 phút: cortisol elevated, heart rate elevated, mind racing. Đọc Twitter về politics → cortisol tăng → 30 phút sau vẫn elevated khi cố ngủ. Amber glasses address melatonin suppression, hoàn toàn không address cognitive arousal.',
      'Recency effect: state cuối ngày bạn mang vào giường quyết định sleep onset quality. Xem phim 2h tối, tắt lúc 22:00 và đi ngủ lúc 23:00 (1h screen-free) = much better. Xem phone 22:30–23:00 và ngủ lúc 23:00 (0 phút screen-free) = worst. Không phải total screen time — mà là screen time trong window cuối trước ngủ. "Wind-down window" cuối ngày là critical, giống warm-up trước tập nhưng ngược lại — cần cool-down system.',
      'Replace, không chỉ restrict: "đừng dùng phone" là negative command — willpower-dependent và inconsistent. Hiệu quả hơn: fill wind-down window với alternatives — đọc sách in (physical), journaling (pen/paper), stretching nhẹ hoặc yoga nidra, tắm nước ấm (giảm core body temperature → sleep onset nhanh), nói chuyện với partner/family. Đặt sạc điện thoại ở phòng khác eliminates bedtime scrolling VÀ morning check — two-for-one behavior change.',
      'Assessment scoring rationale: "Cho đến khi ngủ" (0 điểm): melatonin maximally suppressed + maximum cognitive arousal cùng lúc vào giường. ">1h trước ngủ" (3 điểm): cải thiện nhưng trong sensitive window. "30–60 phút" (8 điểm): minimum clinically recommended. "Không dùng 30 phút+" (10 điểm): let melatonin rise naturally + cognitive arousal dissipate. Điểm tối đa 10 (không 15) vì perfect score reserved cho biological baselines — environmental behavior là supporting factor.',
    ],
    points: [
      { icon: '🔵', label: '480nm blue light suppresses melatonin 55%', note: 'Czeisler Harvard: iPad 4h trước ngủ → delay 1.5h, REM -40%, morning drowsiness tăng' },
      { icon: '🧠', label: 'Cognitive arousal: mạnh hơn và night mode không fix', note: 'Content kích hoạt amygdala → sympathetic kéo dài 30 phút — amber glasses không giải quyết được' },
      { icon: '⏰', label: '30 phút cuối là window quan trọng nhất', note: 'State bạn mang vào giường = sleep onset quality — giờ cuối quan trọng hơn giờ đầu tối' },
      { icon: '📵', label: 'Sạc phone phòng khác = zero willpower needed', note: 'Thiết kế môi trường hiệu quả hơn willpower — không thể scroll nếu phone không trong phòng' },
    ],
  },
  {
    id: 'water', category: 'Hydration', icon: '💧', color: '#0ea5e9', rgb: '14,165,233',
    q: 'Bạn uống bao nhiêu nước mỗi ngày?',
    options: [
      { label: 'Dưới 1 lít', pts: 0 },
      { label: '1–1.5 lít', pts: 3 },
      { label: '1.5–2.5 lít', pts: 8 },
      { label: 'Đủ theo công thức (cân nặng × 35ml)', pts: 10 },
    ],
    modalTitle: 'Hydration Hàng Ngày — Nước Ảnh Hưởng Mọi Hệ Thống Sinh Học',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ cần 1–2% dehydration (700ml–1.4L với người 70kg) đã gây: giảm concentration 12%, short-term memory kém, reaction time chậm, và subjective effort tăng (tasks feel harder). Não là 73% nước — neurotransmission slows down khi dehydrated trước khi bạn cảm thấy khát. Cảm giác khát xuất hiện SAU khi đã dehydrated 1–2% — không phải reliable early warning. Công thức cân nặng × 35ml cá nhân hóa theo body size (VD: 70kg × 35ml = 2.45L, 60kg = 2.1L).',
    detail: 'Điểm "Đủ theo công thức" (10 điểm, không phải 15) vì hydration là supportive lifestyle factor. 1.5–2.5L (8 điểm) adequate cho nhiều người nhỏ hơn hoặc ít vận động. Under 1L (0 điểm) là clearly inadequate cho hầu hết người trưởng thành và gây measurable performance impairment trong vài giờ. Urine pale yellow = proxy đơn giản nhất cho adequate hydration.',
    details: [
      'Dehydration và cognitive function: David Benton (Swansea) meta-analysis: 1–2% dehydration consistently giảm attention, psychomotor performance, và immediate memory — effect size lớn hơn ở tasks yêu cầu sustained attention. Ganio (2011): 1.36% dehydration ở young women giảm mood, tăng perception of task difficulty, giảm concentration — ngay cả không exercise (mild dehydration từ overnight). Buổi sáng thức dậy thường đã dehydrated 300–500ml từ breathing và sweating qua đêm.',
      'Kidneys và toxic clearance: thận lọc 180L plasma/ngày, tái hấp thu 99% (xuất 1–2L urine). Uống không đủ → urine đậm đặc → kidney stones risk tăng (Pearle, UpToDate: urine volume <1L/ngày = significant risk). UTI risk tăng khi urinary flow giảm → bacteria không bị flushed adequately. Urine color là proxy tốt nhất: pale yellow (1–3 urine color chart) = adequate; đậm màu = dehydrated; không màu = over-hydrated (diluted electrolytes — cũng không tốt).',
      'Metabolism và weight management: Michael Boschmann (Charité Berlin): uống 500ml nước lạnh tăng metabolic rate 30% trong 30–40 phút (thermogenesis để warm water lên body temp). Uống 500ml 30 phút trước bữa ăn: stomach distension → appetite suppression + better differentiation "hungry vs thirsty" signal. Davy (2010): nhóm uống 500ml trước mỗi bữa ăn 12 tuần giảm thêm 44% weight so với control group. Nhiều overeating xảy ra vì nhầm khát với đói (signals xử lý gần nhau trong hypothalamus).',
      'Electrolytes và hydration quality: water alone không phải optimal hydration — electrolytes (Na⁺, K⁺, Mg²⁺) cần thiết để maintain osmotic balance. Người vận động nhiều, đổ nhiều mồ hôi, môi trường nóng: thêm electrolytes vào nước. DIY electrolyte: 500ml water + pinch sea salt + squeeze lemon + dash honey. Nước dừa: natural electrolyte drink tốt, không cần thêm đường. Cẩn thận hyponatremia (sodium diluted) nếu uống quá nhiều nước plain trong short period.',
      'Practical hydration habits: (1) Ly 500ml nước ngay khi thức — đặt sẵn tối hôm trước để restore overnight deficit. (2) Bình nước 1L trên bàn làm việc — visual cue nhắc uống và easy tracking. (3) 1–2 ly nước 30 phút trước mỗi bữa ăn. (4) 1 ly sau mỗi cup cà phê (mild diuretic). (5) App reminder mỗi 1–1.5h. (6) Infuse với lát chanh/dưa chuột nếu plain water khó uống đủ. Target: urine pale yellow by 10am = on track cho cả ngày.',
      'Hydration và physical performance: dehydration 2% → endurance performance giảm 10–15% (Nielsen, 2002). Strength và power: giảm 5–8% với 2% deficit. Cho người tập luyện: target 40ml × cân nặng (thay 35ml), 400–600ml trong 2h trước tập, 150–250ml mỗi 15–20 phút trong tập, 500–750ml sau tập cho mỗi 0.5kg lost (estimate từ pre/post workout weight). Joint cartilage là 80% nước — dehydration tăng joint stiffness và pain trong movements.',
    ],
    points: [
      { icon: '🧮', label: 'Công thức: kg × 35ml = target cá nhân hóa', note: '70kg = 2.45L, 60kg = 2.1L — flat "2L cho mọi người" không đúng' },
      { icon: '😵', label: '1% dehydrated = -12% concentration trước khi khát', note: 'Khát là late signal — uống theo schedule, không chờ cảm giác khát để bắt đầu uống' },
      { icon: '💡', label: 'Bình nước trên bàn = visual cue tốt nhất', note: 'Thấy bình → nhớ uống — thiết kế môi trường hiệu quả hơn willpower hay reminder app' },
      { icon: '🌅', label: '500ml sáng sớm = restore overnight deficit', note: 'Mỗi đêm mất 300–500ml qua breathing và sweating — buổi sáng đã dehydrated khi chưa uống gì' },
    ],
  },
];

const MAX_SCORE = QUESTIONS.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.pts)), 0);

const TRACKS = [
  { min: 0, max: 40, name: 'Track 1: Xây Nền', color: '#f97316', icon: '🌱', desc: 'Lối sống cần cải thiện cơ bản. Bắt đầu từ 1–2 thói quen đơn giản nhất.', actions: ['Ưu tiên giấc ngủ 7–8 giờ trước tiên', 'Đặt mục tiêu 6.000 bước/ngày', 'Uống đủ 1.5L nước mỗi ngày', 'Xem lộ trình 12 tuần để có kế hoạch cụ thể'] },
  { min: 41, max: 70, name: 'Track 2: Tăng Cường', color: '#f59e0b', icon: '📈', desc: 'Đã có nền tảng, cần tối ưu hóa và nhất quán hơn.', actions: ['Cải thiện chất lượng giấc ngủ (routine trước ngủ)', 'Tăng NEAT: 8.000–10.000 bước', 'Thiết kế môi trường buổi tối', 'Bắt đầu kỹ thuật thở 5 phút/ngày'] },
  { min: 71, max: MAX_SCORE, name: 'Track 3: Tối Ưu Hóa', color: '#10b981', icon: '🏆', desc: 'Lối sống tốt, tập trung vào tinh chỉnh và duy trì bền vững.', actions: ['Thêm biometric tracking (HRV, sleep stages)', 'Thiết kế deload theo chu kỳ', 'Thử Lifestyle Score 100 điểm đầy đủ', 'Chia sẻ và truyền cảm hứng cho người khác'] },
];

function AssessmentModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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

export default function LifestyleAssessmentPage() {
  const { t: tPillars } = useTranslation('pillars');

  const questionsRaw = tPillars('pillarC.lifestyle_questions', { returnObjects: true });
  const localQuestions = QUESTIONS.map((q, i) => {
    const tr = Array.isArray(questionsRaw) && questionsRaw[i] ? questionsRaw[i] : {};
    return {
      ...q,
      category: tr.category || q.category,
      q: tr.q || q.q,
      modalTitle: tr.modalTitle || q.modalTitle,
      keyFact: tr.keyFact || q.keyFact,
      detail: tr.detail || q.detail,
      details: Array.isArray(tr.details) && tr.details.length ? tr.details : q.details,
      points: Array.isArray(tr.points) && tr.points.length
        ? q.points.map((p, pi) => ({ ...p, ...(tr.points[pi] || {}) }))
        : q.points,
      options: q.options.map((opt, oi) => ({
        ...opt,
        label: (Array.isArray(tr.options) && tr.options[oi]) || opt.label,
      })),
    };
  });

  const tracksRaw = tPillars('pillarC.lifestyle_tracks', { returnObjects: true });
  const localTracks = TRACKS.map((t, i) => {
    const tr = Array.isArray(tracksRaw) && tracksRaw[i] ? tracksRaw[i] : {};
    return {
      ...t,
      name: tr.name || t.name,
      desc: tr.desc || t.desc,
      actions: Array.isArray(tr.actions) && tr.actions.length ? tr.actions : t.actions,
    };
  });

  const lifestyleUI = tPillars('pillarC.lifestyle_ui', { returnObjects: true }) || {};

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [savedScore, setSavedScore] = useState(null);
  const [assessIdx, setAssessIdx] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cAssessOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cAssessOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (s) setSavedScore(s);
    } catch {}
  }, []);

  const totalScore = Object.values(answers).reduce((sum, pts) => sum + pts, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / localQuestions.length) * 100);
  const track = localTracks.find(t => totalScore >= t.min && totalScore <= t.max) || localTracks[0];

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score: totalScore, max: MAX_SCORE, track: track.name, date: new Date().toISOString() }));
      setSavedScore({ score: totalScore, max: MAX_SCORE, track: track.name, date: new Date().toISOString() });
    } catch {}
  };

  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {tPillars('pillarC.assessment_breadcrumb', { defaultValue: 'Lối Sống Khỏe' })}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>📋</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tPillars('pillarC.assessment_title', { defaultValue: 'Đánh Giá Lối Sống' })}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C0 · Lifestyle Assessment</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tPillars('pillarC.assessment_desc', { defaultValue: 'Đánh giá lối sống hiện tại của bạn qua 7 khía cạnh quan trọng. Kết quả sẽ xác định bạn đang ở Track nào và đề xuất hành động ưu tiên phù hợp.' })}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop" alt="Assessment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>7 câu hỏi · Điểm tối đa {MAX_SCORE} · 3 Tracks</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Previous score */}
      {savedScore && !submitted && (
        <RevealBlock className="mb-8">
          <div className="rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <div className="text-base font-bold uppercase tracking-widest mb-0.5" style={{ color: COLOR }}>{lifestyleUI.saved_score_label || 'Đánh Giá Gần Nhất'}</div>
              <div className="text-lg text-text">{savedScore.score}/{savedScore.max} điểm · {savedScore.track}</div>
              <div className="text-base text-muted">{new Date(savedScore.date).toLocaleDateString('vi-VN')}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: COLOR }}>{Math.round((savedScore.score / savedScore.max) * 100)}%</div>
            </div>
          </div>
        </RevealBlock>
      )}

      {!submitted ? (
        <>
          {/* Progress */}
          <RevealBlock className="mb-8">
            <div className="flex justify-between text-base text-muted mb-2">
              <span>{answeredCount}/{localQuestions.length} {lifestyleUI.questions_counter || 'câu hỏi'}</span>
              <span style={{ color: COLOR }}>{progress}%</span>
            </div>
            <div className="h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: COLOR }} />
            </div>
          </RevealBlock>

          {/* Questions */}
          <div className="space-y-6 mb-10">
            {localQuestions.map((q, qi) => (
              <RevealBlock key={q.id} delay={qi * 50} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{q.icon}</span>
                  <div className="flex-1">
                    <div className="text-base font-bold uppercase tracking-widest mb-0.5" style={{ color: q.color }}>{q.category}</div>
                    <div className="text-lg font-medium text-text">{q.q}</div>
                  </div>
                  <button
                    onClick={() => setAssessIdx(qi)}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                    style={{ background: `rgba(${q.rgb},0.15)`, color: q.color, border: `1px solid rgba(${q.rgb},0.3)` }}
                    title="Xem phân tích khoa học chi tiết">ℹ</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.pts }))} className={`text-left text-lg p-3 rounded-xl border transition-all ${answers[q.id] === opt.pts ? '' : 'border-border hover:border-teal-500/30'}`} style={{ background: answers[q.id] === opt.pts ? `${q.color}15` : undefined, borderColor: answers[q.id] === opt.pts ? q.color : undefined, color: answers[q.id] === opt.pts ? q.color : undefined }}>
                      {opt.label}
                      {answers[q.id] === opt.pts && <span className="ml-2 text-base font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </RevealBlock>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={answeredCount < localQuestions.length} className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: answeredCount === localQuestions.length ? COLOR : 'rgba(107,114,128,0.3)' }}>
            {answeredCount < localQuestions.length ? `${localQuestions.length - answeredCount} ${lifestyleUI.answered_label || 'câu chưa trả lời'}` : (lifestyleUI.submit_btn || '→ Xem Kết Quả')}
          </button>
        </>
      ) : (
        /* Results */
        <RevealBlock className="space-y-6">
          {/* Score */}
          <div className="rounded-2xl border p-6 text-center" style={{ borderColor: `${track.color}40`, background: `${track.color}08` }}>
            <div className="text-6xl font-bold mb-2" style={{ color: track.color }}>{totalScore}</div>
            <div className="text-muted text-lg">/ {MAX_SCORE} điểm tối đa</div>
            <div className="mt-4 text-4xl">{track.icon}</div>
            <div className="text-2xl font-bold text-text mt-2">{track.name}</div>
            <p className="text-muted text-lg mt-2 max-w-sm mx-auto">{track.desc}</p>

            {/* Score bar */}
            <div className="mt-5 h-4 bg-bg rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.round((totalScore / MAX_SCORE) * 100)}%`, background: track.color }} />
            </div>
            <div className="text-base text-muted mt-1">{Math.round((totalScore / MAX_SCORE) * 100)}% điểm tối đa</div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="text-lg font-bold text-text mb-4">{lifestyleUI.results_heading || 'Chi Tiết Từng Khía Cạnh'}</div>
            <div className="space-y-3">
              {localQuestions.map(q => {
                const pts = answers[q.id] ?? 0;
                const maxPts = Math.max(...q.options.map(o => o.pts));
                const pct = Math.round((pts / maxPts) * 100);
                return (
                  <div key={q.id} className="flex items-center gap-3">
                    <span className="text-xl w-7">{q.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-base mb-1">
                        <span className="text-muted">{q.category}</span>
                        <span style={{ color: q.color }}>{pts}/{maxPts}</span>
                      </div>
                      <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: q.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border p-5" style={{ borderColor: `${track.color}30`, background: `${track.color}06` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: track.color }}>{lifestyleUI.tracks_heading || 'Hành Động Ưu Tiên Cho Bạn'}</div>
            <ul className="space-y-2">
              {track.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-text">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `${track.color}20`, color: track.color }}>{i + 1}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 py-3 rounded-xl border border-border text-lg text-muted hover:text-text hover:border-teal-500/30 transition-colors">
              {lifestyleUI.reset_btn || 'Làm Lại'}
            </button>
            <Link to="/pillar/c/roadmap" className="flex-1 py-3 rounded-xl text-white text-lg font-bold text-center transition-colors" style={{ background: COLOR }}>
              Xem Lộ Trình →
            </Link>
          </div>
        </RevealBlock>
      )}

      <div className="h-px mt-10 mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/checklist" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Checklist Hằng Ngày
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/roadmap" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Lộ Trình 12 Tuần
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* ── Assessment question modal — outside all RevealBlocks ── */}
      {assessIdx !== null && (
        <AssessmentModal
          item={localQuestions[assessIdx]}
          idx={assessIdx}
          total={localQuestions.length}
          onClose={() => setAssessIdx(null)}
          onPrev={() => setAssessIdx(i => Math.max(0, i - 1))}
          onNext={() => setAssessIdx(i => Math.min(localQuestions.length - 1, i + 1))}
          hasPrev={assessIdx > 0}
          hasNext={assessIdx < localQuestions.length - 1}
        />
      )}
    </div>
  );
}
