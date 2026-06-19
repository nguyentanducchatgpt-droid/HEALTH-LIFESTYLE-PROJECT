import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'd-roadmap-orbit-kf';
const ORBIT_CLASS = 'd-roadmap-orbit-ring';
const PROP = '--d-roadmap-orbit-angle';

function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.07 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(26px)' }}>
      {children}
    </div>
  );
}

const PHASES = [
  {
    phase: 'Giai Đoạn 1',
    weeks: 'Tuần 1–2',
    title: 'Nhận Diện & Nền Tảng',
    color: '#6366f1',
    icon: '🔍',
    goals: ['Làm bài đánh giá ban đầu', 'Học nhận diện 3 loại stress', 'Thực hành thở bụng 5 phút/ngày', 'Bắt đầu nhật ký 5 dòng mỗi tối'],
    milestones: ['Biết stress level hiện tại', 'Có 1 kỹ thuật thở cơ bản', 'Viết nhật ký được 7 ngày liên tiếp'],
    time: '15–20 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 2',
    weeks: 'Tuần 3–4',
    title: 'Xây Công Cụ Cốt Lõi',
    color: '#8b5cf6',
    icon: '🛠️',
    goals: ['Thiền 3 phút mỗi sáng', 'Học kỹ thuật Box Breathing', 'Brain dump 1 lần/tuần khi cảm thấy quá tải', 'Thiết lập 1 phone-free zone'],
    milestones: ['Thiền 7 ngày liên tiếp', 'Dùng box breathing khi stress', 'Giảm screen time trước ngủ'],
    time: '20–25 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 3',
    weeks: 'Tuần 5–8',
    title: 'Mở Rộng Thực Hành',
    color: '#a855f7',
    icon: '🌱',
    goals: ['Thiền 5–10 phút mỗi ngày', 'Body scan 1 lần/tuần', 'Thử Journaling theo 2 mẫu khác nhau', 'Xây 1 thói quen mới theo habit loop', 'Giới hạn social media 30ph/ngày'],
    milestones: ['Có routine buổi sáng và tối ổn định', 'Body scan 4 lần', 'Giữ 2 thói quen trong 30 ngày'],
    time: '25–35 phút/ngày',
  },
  {
    phase: 'Giai Đoạn 4',
    weeks: 'Tuần 9–12',
    title: 'Cá Nhân Hóa & Ổn Định',
    color: '#d946ef',
    icon: '⭐',
    goals: ['Chọn 3–5 thực hành phù hợp nhất với bản thân', 'Làm lại bài đánh giá — so sánh trước/sau', 'Xây "Mental Wellness Stack" cá nhân', 'Chia sẻ hoặc hướng dẫn 1 người khác'],
    milestones: ['Calm Score tăng ít nhất 15 điểm', 'Có routine cá nhân ổn định', 'Cảm thấy bình tĩnh hơn trong stress'],
    time: '20–30 phút/ngày (bền vững)',
  },
];

const PHASE_MODALS = [
  {
    icon: '🔍', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Tuần 1–2: Nhận Diện & Nền Tảng — Tại Sao Phải Bắt Đầu Từ Đây?',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Allostatic Load Model (McEwen, 1998): stress tích lũy theo thời gian tạo "wear and tear" trên hệ thần kinh, miễn dịch và tim mạch. Nhưng brain có neuroplasticity — khả năng thay đổi cấu trúc theo kinh nghiệm. Tuần 1–2 không phải "làm quen" — đây là bắt đầu thay đổi neural baseline thực sự.',
    detail: 'Trước khi xây bất kỳ công cụ nào, cần biết điểm xuất phát. Giai Đoạn 1 tập trung vào awareness (nhận diện) — nghiên cứu nhất quán cho thấy người biết rõ stress triggers của mình recover nhanh hơn và có intervention efficacy cao hơn so với người bắt đầu mù quáng vào kỹ thuật.',
    details: [
      'Tại sao cần đánh giá ban đầu: Bài đánh giá PSS (Perceived Stress Scale) và GAD-7 cho baseline objective. Không có baseline → không biết progress → motivation giảm dần sau tuần 3–4. Nghiên cứu behavior change: visual progress là predictor mạnh nhất của long-term adherence. "Tôi đã tiến bộ" cần số liệu cụ thể để believe.',
      'Nhận diện 3 loại stress — tại sao quan trọng: Acute stress (ngắn hạn, kích hoạt) vs Chronic stress (dài hạn, gây harm) vs Eustress (stress tích cực — challenge, engagement). Người không phân biệt được tend to avoid ALL stress — làm giảm performance và growth. Nhận diện đúng loại = respond đúng cách.',
      'Thở bụng 5 phút/ngày — cơ chế sinh lý học: Diaphragmatic breathing kích hoạt vagus nerve → parasympathetic nervous system (PNS) activation. PNS: giảm heart rate, giảm cortisol, tăng HRV (Heart Rate Variability). HRV là biomarker của stress resilience — higher HRV = better recovery. Chỉ cần 5 phút/ngày để bắt đầu thay đổi HRV measurable sau 2 tuần.',
      'Nhật ký 5 dòng 7 ngày liên tiếp — tại sao 7 ngày: Lally et al. (2010): habit formation đòi hỏi consistent repetition. 7 ngày là critical threshold của first week — vượt qua tuần đầu dramatically increases long-term adherence. 7 ngày liên tiếp không phải arbitrary — đây là enough repetition để context-dependent memory form: "mỗi tối = nhật ký."',
      '15–20 phút/ngày — tại sao thời gian này optimal: Đủ để practice hai skills (thở + nhật ký) mà không overwhelm schedule. Fogg\'s Tiny Habits: new habits fail most often from overcommitment in early stages. 15 phút = high compliance rate across demographics. Tuần sau increase — nhưng tuần đầu, completion > duration.',
      'Neuroplasticity của Giai Đoạn 1: Ngay từ ngày đầu practice, synaptogenesis bắt đầu trong PFC (regulation circuits) và hippocampus (memory + stress response). 2 tuần practice không đủ để see functional MRI changes — nhưng đủ để establish behavioral circuits. Tuần 1–2 là "planting seeds" — growth visible ở giai đoạn sau.',
    ],
    points: [
      { icon: '📊', label: 'Baseline Assessment', note: 'Progress cần số liệu — không có baseline = không biết progress' },
      { icon: '💨', label: 'Vagus Nerve Activation', note: 'Thở bụng → PNS → HRV tăng → stress resilience xây dựng' },
      { icon: '📓', label: '7 Ngày Liên Tiếp', note: 'First-week threshold — vượt qua = dramatically higher adherence' },
      { icon: '🧠', label: 'Neuroplasticity Starts Now', note: 'Ngay ngày 1, synaptogenesis bắt đầu trong stress circuits' },
    ],
  },
  {
    icon: '🛠️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Tuần 3–4: Xây Công Cụ Cốt Lõi — Từ Awareness Đến Skill',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Skill acquisition theory (Fitts & Posner, 1967): cognitive stage → associative stage → autonomous stage. Tuần 3–4 là critical transition từ cognitive (phải nhớ để làm) sang associative (bắt đầu feel more natural). Sau 4 tuần practice, box breathing và thiền bắt đầu trở thành automatic response thay vì deliberate effort.',
    detail: 'Giai Đoạn 2 là "tooling phase" — xây core skills mà toàn bộ 12 tuần còn lại dựa trên. Thiền 3 phút, box breathing, và brain dump không phải arbitrary choices — đây là three highest-evidence interventions cho stress reduction với lowest time investment và lowest barrier to entry.',
    details: [
      'Thiền 3 phút mỗi sáng — tại sao 3 phút đủ để bắt đầu: Meta-analysis của Sedlmeier et al. (2012) — 163 studies: meditation có significant effects trên stress, anxiety và well-being. Minimum effective dose cho beginners: 5–10 phút. Nhưng cho habit establishment, starting at 3 phút → 100% completion rate higher → habit forms → duration increases naturally. "Thiền 7 ngày liên tiếp" > "thiền 20 phút một lần".',
      'Box Breathing — SEAL Navy protocol và physiology: Tactical breathing protocol used by Navy SEALs: 4 hít vào - 4 hold - 4 thở ra - 4 hold (hoặc 4-4-4-4). Kết quả: giảm cortisol ngay lập tức, giảm amygdala activation, giảm heart rate. Có thể làm anywhere, anytime — in meeting, trước exam, trong traffic. Acute stress tool with highest ROI.',
      'Brain dump 1 lần/tuần khi quá tải — tại sao weekly: Sau 2 tuần nhật ký, đã có foundation của externalization habit. Weekly brain dump là "safety valve" — khi things accumulate. Không daily vì Tuần 3–4 đã có đủ daily practices. Weekly = sustainable addition. Pattern: ngày thường là nhật ký 5 dòng, khi overwhelm = brain dump.',
      'Phone-free zone — what research says: Harvard study on smartphones (Ward et al., 2017): sự hiện diện của phone (ngay cả face-down, silent) reduces available cognitive capacity. 1 phone-free zone (ví dụ: bedroom, dining table, morning routine) = specific context với reduced digital distraction. Không cần tắt cả ngày — chỉ cần 1 protected zone.',
      'Stacking với Giai Đoạn 1: Tuần 3–4 không replace Tuần 1–2 practices — chúng stack. Morning: thiền 3 phút (new). Khi stress: box breathing (new). 1x/tuần khi quá tải: brain dump (new). Tối: nhật ký 5 dòng (continued). Total: ~20–25 phút/ngày. Stacking creates synergy: thiền thêm metacognitive awareness cho nhật ký; box breathing complement thở bụng.',
      'Milestone "dùng box breathing khi stress" — behavioral indicator: Milestone này quan trọng hơn "học box breathing" — vì cho thấy skill đã transfer vào real-world use. Cognitive skill → behavioral implementation là critical gap. Khi stress xảy ra naturally và bạn automatically reach cho box breathing = Giai Đoạn 2 complete. This is associative stage.',
    ],
    points: [
      { icon: '🧘', label: 'Thiền 3 Phút MED', note: 'Minimum effective dose cho habit → duration tăng tự nhiên' },
      { icon: '📦', label: 'Box Breathing', note: 'Navy SEAL protocol — giảm cortisol ngay lập tức, anywhere' },
      { icon: '📵', label: 'Phone-Free Zone', note: 'Ward 2017: phone presence alone reduces cognitive capacity' },
      { icon: '🔗', label: 'Skill Transfer', note: 'Milestone: dùng breathing khi stress = real-world transfer' },
    ],
  },
  {
    icon: '🌱', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Tuần 5–8: Mở Rộng Thực Hành — Consolidation & Depth',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Lally et al. (2010, EJSP): habits take 18–254 days to become automatic, median 66 days. Tuần 5 = ngày 29–35. Practices từ Giai Đoạn 1–2 đang trong associative phase — chưa autonomous nhưng đã significantly easier. Giai Đoạn 3 deepens existing practices và adds breadth — không phải vì cần thêm, mà vì brain đã có sufficient capacity.',
    detail: 'Giai Đoạn 3 là "consolidation and depth" phase. Không thêm nhiều new skills — thay vào đó, extend duration (thiền 5–10 phút), add complementary practices (body scan), và explore journaling templates khác. Hai habit goals (maintain 2 habits for 30 days, stable morning/evening routine) là markers của habits entering autonomous phase.',
    details: [
      'Thiền 5–10 phút — tại sao tăng từ 3 phút: Ngưỡng 5 phút là điểm mà neuroimaging studies bắt đầu thấy measurable changes trong brain structure sau sustained practice. Lazar et al. (2005, NeuroReport): 8 tuần thiền 5+ phút → cortical thickness tăng ở PFC và insula. Tăng từ 3 lên 5–10 phút không phải arbitrary — đây là stepping vào clinical effective range.',
      'Body scan 1 lần/tuần — tại sao tuần 5, không phải tuần 1: Body scan yêu cầu sustained attention (20–40 phút) và interoceptive awareness đã developed qua practice. Người chưa có meditation foundation thường find body scan too difficult — mind wanders excessively, frustration builds. 4 tuần foundation = sufficient interoceptive training để body scan be effective.',
      '2 mẫu journaling — tại sao explore variations: Sau 4 tuần Nhật Ký 5 Dòng, brain đã có đủ metacognitive awareness để benefit từ different templates. Nhật ký Cảm Xúc (DBT-based) cho emotional regulation. Nhật Ký Ngày Thất Bại cho growth mindset. Exploring variations prevents journaling từ becoming mechanical — keeps engagement và insight-generation high.',
      '1 thói quen mới theo habit loop — Charles Duhigg\'s framework: Habit Loop (Cue → Routine → Reward). Tuần 5 là thời điểm tốt để consciously xây new habit vì: đã có understanding của habit formation (từ practice), đã có cognitive capacity (routines from phases 1–2 are more automatic), đã có metacognitive awareness từ journaling. Pick small, specific habit — "sau khi thức dậy → 5 phút stretching → coffee" format.',
      'Giới hạn social media 30ph/ngày — evidence base: Twenge et al. (2018): social media use > 2–3 giờ/ngày correlates với increased depression và anxiety, especially in adolescents and young adults. Kross et al. (2013, PLOS ONE): Facebook use → decreased well-being và life satisfaction. 30 phút/ngày là research-supported boundary. App limits (iOS Screen Time, Android Digital Wellbeing) make this easy to enforce.',
      'Milestones của Giai Đoạn 3 — tại sao "routine ổn định": Stable morning + evening routine là highest-level habit achievement trong 12 tuần vì routines = multiple habits chained together. Charles Duhigg: routines create habit bundles — each habit in routine cues the next. When morning routine is stable, energy for willpower is preserved for work/creativity instead of "what should I do next."',
    ],
    points: [
      { icon: '🧠', label: 'Neuroimaging Threshold', note: 'Lazar 2005: 5+ phút/ngày → cortical thickness changes measurable' },
      { icon: '🫀', label: 'Body Scan Readiness', note: '4 tuần foundation = đủ interoceptive awareness để benefit' },
      { icon: '📵', label: 'Social Media 30ph', note: 'Twenge 2018: >2–3 giờ/ngày correlates với depression risk' },
      { icon: '🔄', label: 'Habit Bundles', note: 'Routine ổn định = chained habits, reduces willpower drain' },
    ],
  },
  {
    icon: '⭐', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Tuần 9–12: Cá Nhân Hóa & Ổn Định — Từ Protocol Đến Identity',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Self-Determination Theory (Deci & Ryan, 1985): intrinsic motivation (autonomy, competence, relatedness) predicts long-term behavior change far better than extrinsic motivation. Giai Đoạn 4 chuyển từ "following a protocol" sang "this is my practice" — từ compliance sang identity. Research: identity-based habit change (James Clear: "I am someone who meditates") có higher 2-year adherence.',
    detail: 'Giai Đoạn 4 không phải "làm thêm." Đây là về personalization và sustainability. 8 tuần trước đã cho đủ data về bản thân để biết: cái gì resonate, cái gì không; cái gì fit schedule, cái gì không; cái gì produce noticeable results, cái gì không. Tuần 9–12 là thiết kế "Mental Wellness Stack" của riêng mình — custom, không phải generic.',
    details: [
      'Chọn 3–5 thực hành — tại sao không giữ tất cả: Sustainability law: bạn sẽ không duy trì được 10 practices lâu dài khi không còn novelty. 3–5 practices được cá nhân hóa (yêu thích + hiệu quả + khả thi) > 10 practices từ generic program. Atomic Habits principle: design environment và identity around fewer, deeper commitments thay vì wider, shallower ones.',
      'Làm lại bài đánh giá — so sánh trước/sau: PSS và GAD-7 scores sau 12 tuần thường cho thấy: 20–40% reduction in stress scores cho people who practice consistently (meta-analysis). Seeing objective improvement → reinforces identity: "người thực hành mindfulness." Không làm lại assessment = miss most powerful motivator — evidence of one\'s own progress.',
      '"Mental Wellness Stack" — khái niệm và cách xây: Stack = personalized combination of practices. Ví dụ: Sáng: 5 phút thiền + thở bụng. Ngày: box breathing khi stress. Tối: nhật ký 5 dòng. Weekly: brain dump. Monthly: đọc lại journals. Đây là YOUR stack, không phải của ai khác. Lưu lại thành "personal protocol" — tham chiếu khi life disrupts.',
      'Chia sẻ hoặc hướng dẫn 1 người khác — learning pyramid: NTL Institute Learning Pyramid: teaching others = 90% retention (highest of all learning modes). Giải thích cho người khác những gì bạn học: (1) forces synthesis và clarity, (2) reveals gaps trong understanding của bản thân, (3) creates social commitment — bạn không thể dạy điều mình không thực hành. Social connection là pillar của well-being.',
      'Calm Score +15 điểm — tại sao cụ thể: 15 điểm thay đổi trên PSS (hoặc tương đương) là clinically meaningful improvement — đủ để cảm nhận được khác biệt trong daily life. Không phải arbitrary. Research shows: người practice mindfulness consistently 8–12 tuần average 20–35% reduction in stress scores. 15 điểm = conservative, achievable goal.',
      'Từ Practice đến Identity: Identity-based change (Clear, Atomic Habits): "Every action is a vote for the type of person you wish to become." Sau 12 tuần, mỗi meditation session, mỗi nhật ký, mỗi breathing exercise là một "vote" cho identity: "Tôi là người chăm sóc sức khỏe tâm trí." Identity shift là strongest predictor của long-term behavior maintenance — far stronger than motivation or discipline.',
    ],
    points: [
      { icon: '🎨', label: 'Personalization', note: '3–5 cá nhân hóa > 10 generic — sustainability law' },
      { icon: '📊', label: 'Before/After Evidence', note: '-20–40% stress scores sau 12 tuần consistent practice' },
      { icon: '👥', label: 'Teaching = 90% Retention', note: 'NTL Pyramid: dạy người khác = highest retention mode' },
      { icon: '🌟', label: 'Identity Shift', note: '"Tôi là người...": identity-based change có highest adherence' },
    ],
  },
];

const DAILY_STACK = [
  { time: 'Sáng (10ph)', items: ['Uống nước + 5 hít thở sâu', 'Thiền 3–5 phút', 'Viết 1 ý định cho ngày'] },
  { time: 'Chiều (5ph)', items: ['Check-in cảm xúc', 'Box breathing nếu stress', 'Di chuyển 5 phút'] },
  { time: 'Tối (10ph)', items: ['Viết nhật ký 5 dòng', 'Không màn hình 30ph trước ngủ', 'Body scan 5 phút (tuỳ chọn)'] },
];

const DAILY_STACK_MODALS = [
  {
    icon: '🌅', color: COLOR, rgb: RGB,
    modalTitle: 'Buổi Sáng 10 Phút — Tại Sao Sáng Sớm Là Thời Điểm Vàng',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol Awakening Response (CAR): cortisol tăng tự nhiên 50–100% trong 30–45 phút đầu sau thức dậy — đây là peak tự nhiên của alertness, working memory và executive function. Window này là "biological prime time" không thể tạo ra bằng caffeine. Morning stack khai thác CAR để set direction cho cả ngày.',
    detail: 'Ba thực hành sáng (nước + thở, thiền, ý định) không phải random selection — mỗi cái target một system khác nhau: hydration/physiological reset, nervous system regulation, và prefrontal cortex activation. Tổng thời gian 10 phút là deliberately minimal — đủ impact, đủ sustainable ngay cả với schedule bận.',
    details: [
      'Uống nước ngay sau thức dậy — dehydration và cognitive function: Sau 7–9 giờ ngủ không uống, cơ thể mất ~400–600ml nước qua hơi thở và mồ hôi. Nghiên cứu Benton & Burgess (2009): ngay cả mild dehydration (1–2% body weight) giảm cognitive performance đáng kể — attention, memory, mood đều bị ảnh hưởng. Uống 200–400ml nước trước bất kỳ việc gì khác = immediate cognitive boost.',
      '5 hít thở sâu kèm nước — transition ritual: Uống nước + thở sâu 5 lần là sensory anchor: thức dậy → specific cue (uống) → specific behavior (thở). Habit stacking principle (James Clear): gắn new behavior vào existing trigger. 5 hít thở sâu kích hoạt vagus nerve → parasympathetic tone → giảm cortisol spike nếu quá mức, tăng HRV baseline cho ngày.',
      'Thiền 3–5 phút buổi sáng — theta-alpha transition window: Não khi vừa thức dậy ở theta-alpha transition (4–12 Hz) — trạng thái giữa giấc ngủ và tỉnh táo hoàn toàn. Nghiên cứu creativity: theta state liên quan đến divergent thinking và "aha moments." Thiền ngay trong window này khai thác self-referential processing của Default Mode Network trước khi external demands hijack attention.',
      'Thiền 3–5 phút là đủ để bắt đầu — evidence: Zeidan et al. (2010, Consciousness & Cognition): 4 ngày thiền, chỉ 20 phút/ngày → significant improvements trong working memory, sustained attention, và visuospatial processing. Ngay cả 3 phút: đủ để activate metacognitive awareness và reduce mind-wandering. Ngắn nhưng consistent >>> dài nhưng sporadic.',
      'Viết 1 ý định cho ngày — implementation intention power: Gollwitzer (1999): implementation intentions ("Hôm nay tôi sẽ làm X vào Y giờ") tăng goal completion 2–3x so với vague goals ("tôi sẽ cố gắng"). Buổi sáng là optimal timing — consolidation overnight fresh → PFC clear → intention setting most effective. 1 ý định, không phải 5 — specificity + focus over comprehensiveness.',
      'Tại sao 10 phút là đủ: 10 phút = nước (1 phút) + thở (2 phút) + thiền (5 phút) + viết ý định (2 phút). Đây là design cho 100% compliance, không phải ideal practice. Fogg\'s Tiny Habits: barrier phải đủ thấp để không skip ngay cả khi mệt, trễ, hay không muốn. "Perfect routine skipped" = 0. "Simple routine done" = compound effect over months.',
    ],
    points: [
      { icon: '⚡', label: 'Cortisol Peak Window', note: 'CAR: cognitive prime time 30–45 phút sau thức dậy' },
      { icon: '💧', label: 'Hydration First', note: 'Benton 2009: mild dehydration → cognitive decline ngay' },
      { icon: '🌊', label: 'Theta-Alpha State', note: 'Sau ngủ: creativity và divergent thinking window tối ưu' },
      { icon: '🎯', label: '1 Ý Định, Không Nhiều Hơn', note: 'Gollwitzer: implementation intention → 2–3x completion' },
    ],
  },
  {
    icon: '☀️', color: COLOR, rgb: RGB,
    modalTitle: 'Buổi Chiều 5 Phút — Recovery Window & Acute Stress Response',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ultradian rhythm (Peretz Lavie, 1986): não hoạt động theo chu kỳ 90–120 phút (high performance) xen kẽ với rest windows (15–20 phút). Chiều thường rơi vào rest window tự nhiên — đặc biệt khoảng 2–3 giờ (post-lunch dip). Thay vì fight qua rest window bằng caffeine, 5-minute mental reset trong window này restore baseline hiệu quả hơn.',
    detail: 'Ba thực hành chiều (check-in cảm xúc, box breathing, di chuyển) target ba systems bị tích lũy stress suốt ngày: cognitive load (check-in giải quyết), sympathetic activation (box breathing reset), và physical stagnation (di chuyển giải quyết). 5 phút nhưng tác động lên 3 systems = highest ROI practice trong ngày.',
    details: [
      'Check-in cảm xúc — metacognition và mid-day recalibration: Check-in không phải "ngồi cảm nhận cảm xúc" — đó là brief scan: "Tôi đang cảm thấy gì? (0–10). Tại sao? Tôi cần gì lúc này?" 30 giây. Metacognitive awareness giúp catch emotional spirals sớm — trước khi chúng compound thành buổi chiều/tối tệ. CBT: early intervention khi emotion còn ở mức 4–5/10 hiệu quả hơn nhiều so với can thiệp ở 8–9/10.',
      'Check-in là early warning system: Người không có check-in habit thường nhận ra "hôm nay tôi rất stress" chỉ vào buổi tối — khi đã accumulated 8+ giờ unprocessed stress. Check-in chiều: catch stress ở giai đoạn giữa ngày → có thể intervene (box breathing, walk, micro-break) trước khi compound. Prevention > treatment.',
      'Box breathing khi stress — acute sympathetic reset: 4-4-4-4 box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) kích hoạt baroreceptors trong aorta → vagal signal → parasympathetic activation trong 60–90 giây. Cortisol giảm measurable sau 3 phút. HRV tăng ngay lập tức. Không cần quiet room — có thể làm trong meeting break, toilet, car. Zero barrier, maximum portability.',
      'Di chuyển 5 phút — BDNF và cognitive reset: John Ratey (Spark, 2008): exercise releases BDNF (Brain-Derived Neurotrophic Factor) — protein giúp neurons grow và connect. Ngay cả 5 phút light movement (walk, stretch, stairs) tăng BDNF và blood flow to PFC. Nghiên cứu: 5-minute walk after prolonged sitting → attention và creativity scores tăng significantly vs sedentary group.',
      'Sitting disease và afternoon productivity: Biswas et al. (2015, Annals of Internal Medicine): sitting > 8 giờ/ngày linked với mortality risk tương đương smoking, independent of exercise frequency. Prolonged sitting → reduced circulation → reduced brain oxygenation → cognitive decline throughout afternoon. 5-minute movement break every 90 phút là nghiên cứu-supported prescription.',
      'Tại sao chỉ 5 phút và không nhiều hơn: Workday context — không thể schedule 30 phút break giữa buổi làm. 5 phút = feasible cho 100% of people on any schedule. Check-in (1 phút) + box breathing if needed (3 phút) + brief movement (5 phút) = total 5–9 phút. Flexibility: ngày nhẹ = cả 3. Ngày bận = chỉ check-in. Never skip: minimum viable version prevents "missed habit" pattern.',
    ],
    points: [
      { icon: '🔄', label: 'Ultradian Rest Window', note: 'Lavie: 90-120 phút cycle — afternoon dip là natural reset cue' },
      { icon: '🧠', label: 'Check-in = Early Warning', note: 'Catch stress ở 4/10 trước khi leo lên 9/10 buổi tối' },
      { icon: '📦', label: 'Box Breathing Reset', note: 'HRV tăng trong 60–90 giây, cortisol giảm measurable' },
      { icon: '🏃', label: 'BDNF trong 5 Phút', note: 'Ratey: brief movement → PFC blood flow → attention tăng ngay' },
    ],
  },
  {
    icon: '🌙', color: COLOR, rgb: RGB,
    modalTitle: 'Buổi Tối 10 Phút — Sleep Preparation & Memory Consolidation',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Matthew Walker (Why We Sleep, 2017): sleep là não bộ\'s active maintenance cycle — không phải passive rest. Trong NREM slow-wave sleep, hippocampus "replays" experiences từ ngày để transfer sang cortical long-term storage. Những gì xảy ra 30–60 phút trước ngủ directly influences chất lượng của consolidation cycle này.',
    detail: 'Ba thực hành tối (nhật ký, không màn hình, body scan) là sequential sleep preparation protocol — nhật ký đóng cognitive loops, không màn hình cho melatonin rise, body scan transitions nervous system từ sympathetic sang parasympathetic. Đây không phải "nice to have" bedtime routine — đây là neurological preparation cho nightly memory consolidation.',
    details: [
      'Viết nhật ký 5 dòng — Zeigarnik closure và sleep onset: Scullin et al. (2018, Experimental Brain Research): người viết specific to-do list trước ngủ ngủ nhanh hơn 9 phút vs nhóm viết completed activities. Cơ chế: Zeigarnik Effect — não duy trì "open loops" (incomplete tasks, unresolved concerns) trong working memory → interrupts sleep onset. Nhật ký 5 dòng closes daily loops, signals brain: "đã xử lý, an toàn để release."',
      'Không màn hình 30 phút — blue light và melatonin suppression: Chang et al. (2014, PNAS): screen exposure trước ngủ suppresses melatonin secretion lên đến 50% và delays circadian clock 90+ phút. Melatonin là sleep onset hormone — không đủ → khó ngủ và ngủ không đủ sâu. 30 phút no-screen = đủ để melatonin bắt đầu rise naturally. Phone/laptop/TV blue light (450–490 nm) là worst offender.',
      'Không màn hình — dopamine và arousal: Beyond blue light, content itself is stimulating: notifications, news, social media tạo dopamine hits và emotional arousal. Aroused nervous system (sympathetic activation) incompatible với sleep onset. 30 phút của calm activity (đọc sách giấy, nhẹ nhàng, nói chuyện) allows sympathetic → parasympathetic transition naturally.',
      'Body scan 5 phút (tuỳ chọn) — progressive muscle relaxation connection: Body scan before sleep có roots trong Jacobson\'s Progressive Muscle Relaxation (1929) — systematic attention to body parts → voluntary muscle release → global relaxation. Nghiên cứu: PMR và mindful body scan before sleep → reduced sleep onset latency, increased slow-wave sleep duration, và improved sleep quality scores. "Tuỳ chọn" vì effective even 2–3x/week, not needing daily.',
      'Sleep và memory consolidation — tại sao tối quan trọng: Stickgold (2005, Science): sleep plays critical and active role in memory consolidation. Hippocampal-neocortical transfer xảy ra chủ yếu trong NREM Stage 3 (deep sleep, 60–90 phút sau ngủ). Pre-sleep practices that improve sleep quality → improve this consolidation. Skills learned during day (thiền, breathing, journaling insights) consolidate better with quality sleep.',
      'Evening routine là neurological anchor: Circadian rhythm được duy trì bởi environmental cues (zeitgebers): light, temperature, và behavioral cues. Consistent evening routine tạo behavioral zeitgeber — não learns "sau sequence này = ngủ" → sleep onset faster over time. Điều này giải thích tại sao routine quan trọng hơn perfect practices: consistency of sequence > perfection of individual practices.',
    ],
    points: [
      { icon: '😴', label: 'Sleep Onset -9 Phút', note: 'Scullin 2018: to-do list trước ngủ → ngủ nhanh hơn 9 phút' },
      { icon: '📵', label: 'Melatonin -50%', note: 'Chang 2014: screen suppresses melatonin 50%, delays clock 90 phút' },
      { icon: '🫀', label: 'Body Scan + PMR', note: 'Reduced sleep onset, increased slow-wave sleep depth' },
      { icon: '🧠', label: 'Memory Consolidation', note: 'Walker: NREM transfers skills to long-term cortical storage' },
    ],
  },
];

const LINKS = [
  { to: '/pillar/d/assessment', icon: '🧠', t: 'Đánh Giá Tâm Trí', d: 'Đo lường trước khi bắt đầu' },
  { to: '/pillar/d/stress', icon: '😤', t: 'Quản Lý Stress', d: 'Tuần 1–2' },
  { to: '/pillar/d/breathing', icon: '💨', t: 'Kỹ Thuật Thở', d: 'Tuần 1–4' },
  { to: '/pillar/d/meditation', icon: '🧘', t: 'Thiền Định', d: 'Tuần 2–8' },
  { to: '/pillar/d/body-scan', icon: '🫀', t: 'Body Scan', d: 'Tuần 5–8' },
  { to: '/pillar/d/journaling', icon: '📓', t: 'Nhật Ký', d: 'Tuần 1–12' },
  { to: '/pillar/d/brain-dump', icon: '🧹', t: 'Brain Dump', d: 'Khi quá tải' },
  { to: '/pillar/d/digital-detox', icon: '📵', t: 'Digital Detox', d: 'Tuần 3–6' },
  { to: '/pillar/d/gentle-discipline', icon: '🌿', t: 'Kỷ Luật Mềm', d: 'Tuần 5–12' },
  { to: '/pillar/d/habits', icon: '🔄', t: 'Xây Thói Quen', d: 'Tuần 5–12' },
  { to: '/pillar/d/checklist', icon: '✅', t: 'Checklist Hằng Ngày', d: 'Toàn bộ lộ trình' },
];

function CardModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, total, idx }) {
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
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-xl px-4 py-3 mb-5 text-base font-medium leading-relaxed"
            style={{ background: `rgba(${item.rgb},0.1)`, borderLeft: `3px solid ${item.color}`, color: `rgba(${item.rgb},0.9)` }}>
            💡 {item.keyFact}
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-base text-muted leading-relaxed">
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
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

export default function MindRoadmapPage() {
  const [activePhase, setActivePhase] = useState(0);
  const [phaseModal, setPhaseModal] = useState(null);
  const [dailyModal, setDailyModal] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dRoadmapOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dRoadmapOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const p = PHASES[activePhase];

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🗺️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Lộ Trình 12 Tuần Tâm Trí An Nhiên</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D7 · Hành Trình Từng Bước</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Lộ trình từng bước để xây dựng sức khỏe tâm trí bền vững — từ nhận diện stress đến có một "bộ công cụ tâm trí" hoàn chỉnh cá nhân hóa cho bạn.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop" alt="Roadmap" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>4 Giai Đoạn · 12 Tuần</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Giai Đoạn Phát Triển</h2>
        <p className="text-muted text-lg mb-6">Click vào từng giai đoạn để xem chi tiết</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {PHASES.map((ph, i) => (
            <div key={i} className="group/phase relative rounded-2xl border p-4 text-left transition-all cursor-pointer"
              style={activePhase === i
                ? { borderColor: ph.color, background: `${ph.color}15` }
                : { borderColor: '#2a2a2a', background: 'transparent' }}
              onClick={() => setActivePhase(i)}>
              <div className="text-3xl mb-2">{ph.icon}</div>
              <div className="text-base font-bold uppercase tracking-wide mb-1" style={{ color: ph.color }}>{ph.weeks}</div>
              <div className="text-lg font-semibold text-text">{ph.title}</div>
              <span
                className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border opacity-0 group-hover/phase:opacity-100 transition-opacity"
                style={{ color: ph.color, borderColor: `${ph.color}55`, background: `${ph.color}12` }}
                onClick={e => { e.stopPropagation(); setPhaseModal(i); }}>
                chi tiết →
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${p.color}30`, background: `${p.color}07` }}>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{p.icon}</span>
              <div>
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.phase} · {p.weeks} · {p.time}</div>
                <div className="text-xl font-bold text-text">{p.title}</div>
              </div>
            </div>
            <button onClick={() => setPhaseModal(activePhase)}
              className="shrink-0 text-[11px] font-bold px-3 py-1 rounded-full border transition-colors hover:opacity-80"
              style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}12` }}>
              Khoa học đằng sau →
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <p className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: p.color }}>Mục Tiêu</p>
              <ul className="space-y-2">
                {p.goals.map(g => (
                  <li key={g} className="flex items-start gap-2 text-lg text-muted">
                    <span className="shrink-0 mt-1" style={{ color: p.color }}>→</span>{g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: p.color }}>Milestones</p>
              <ul className="space-y-2">
                {p.milestones.map(m => (
                  <li key={m} className="flex items-start gap-2 text-lg text-muted">
                    <span className="shrink-0 mt-1" style={{ color: p.color }}>✓</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mental Wellness Stack Hằng Ngày</h2>
        <p className="text-muted text-lg mb-6">25 phút mỗi ngày chia ra 3 buổi — không cần làm tất cả cùng lúc</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DAILY_STACK.map((s, i) => (
            <div key={s.time} className="group/daily rounded-2xl border border-border bg-surface p-5 hover:border-purple-500/30 transition-colors cursor-pointer" onClick={() => setDailyModal(i)}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: COLOR }}>{s.time}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/daily:opacity-100 transition-opacity"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
              <ul className="space-y-2">
                {s.items.map(it => (
                  <li key={it} className="flex items-start gap-2 text-lg text-muted">
                    <span className="shrink-0" style={{ color: COLOR }}>·</span>{it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tất Cả Công Cụ Của Bạn</h2>
        <p className="text-muted text-lg mb-6">Truy cập nhanh vào mọi module trong lộ trình</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-purple-500/40 transition-all group">
              <span className="text-2xl shrink-0">{l.icon}</span>
              <div>
                <div className="text-lg font-semibold text-text group-hover:text-purple-300 transition-colors">{l.t}</div>
                <div className="text-base text-muted">{l.d}</div>
              </div>
            </Link>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6 text-center" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <div className="text-4xl mb-3">🌟</div>
          <p className="text-lg text-text font-semibold mb-2">Bắt Đầu Từ Hôm Nay</p>
          <p className="text-lg text-muted mb-5 max-w-lg mx-auto">Không cần hoàn hảo. Không cần làm tất cả. Chỉ cần bắt đầu 1 việc nhỏ nhất — thở sâu 5 lần, viết 1 dòng nhật ký, hay tắt điện thoại 30 phút trước khi ngủ.</p>
          <Link to="/pillar/d/assessment"
            className="inline-block px-8 py-3 rounded-full font-bold text-lg"
            style={{ background: COLOR, color: '#fff' }}>
            Bắt đầu với bài đánh giá →
          </Link>
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>

      {dailyModal !== null && (
        <CardModal
          item={DAILY_STACK_MODALS[dailyModal]}
          onClose={() => setDailyModal(null)}
          onPrev={() => setDailyModal(i => Math.max(0, i - 1))}
          onNext={() => setDailyModal(i => Math.min(DAILY_STACK_MODALS.length - 1, i + 1))}
          hasPrev={dailyModal > 0}
          hasNext={dailyModal < DAILY_STACK_MODALS.length - 1}
          total={DAILY_STACK_MODALS.length}
          idx={dailyModal}
        />
      )}
      {phaseModal !== null && (
        <CardModal
          item={PHASE_MODALS[phaseModal]}
          onClose={() => setPhaseModal(null)}
          onPrev={() => setPhaseModal(i => Math.max(0, i - 1))}
          onNext={() => setPhaseModal(i => Math.min(PHASE_MODALS.length - 1, i + 1))}
          hasPrev={phaseModal > 0}
          hasNext={phaseModal < PHASE_MODALS.length - 1}
          total={PHASE_MODALS.length}
          idx={phaseModal}
        />
      )}
    </div>
  );
}
