import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'd-braindump-orbit-kf';
const ORBIT_CLASS = 'd-braindump-orbit-ring';
const PROP = '--d-braindump-orbit-angle';

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

const STEPS = [
  { n: '01', t: 'Cài đồng hồ 10 phút', d: 'Không cần hơn. Giới hạn thời gian giúp não tập trung xả hết.' },
  { n: '02', t: 'Lấy tờ giấy hoặc mở file text', d: 'Viết tay tốt hơn. Không cần máy tính đẹp, không cần note app.' },
  { n: '03', t: 'Viết MỌI THỨ đang trong đầu', d: 'Việc cần làm, lo âu, ý tưởng, hối tiếc, kế hoạch — tất cả ra hết.' },
  { n: '04', t: 'Không phán xét, không chỉnh sửa', d: 'Cứ viết. Câu không hoàn chỉnh cũng được. Chính tả sai cũng không sao.' },
  { n: '05', t: 'Phân loại sau khi xả xong', d: 'Nhìn lại danh sách: cái nào có thể làm ngay? Cái nào lo vô ích? Cái nào cần plan?' },
  { n: '06', t: 'Chọn 1–3 việc ưu tiên hôm nay', d: 'Chỉ 1–3 thôi. Gạch bỏ hoặc chuyển sang "ngày mai / không bao giờ".' },
];

const STEP_MODALS = [
  {
    icon: '⏱️', color: COLOR, rgb: RGB,
    modalTitle: 'Cài Đồng Hồ 10 Phút — Parkinson\'s Law & Time Constraint',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Parkinson\'s Law (1955): "Work expands to fill the time available for its completion." Không có deadline → brain dump kéo dài vô tận và trở thành perfectionism exercise. 10 phút tạo productive pressure: não hiểu đây là sprint, không phải marathon.',
    detail: 'Time constraint là design choice, không phải shortcut. 10 phút đủ để externalize working memory load một cách hiệu quả. Hơn 10 phút → người bắt đầu filter, analyze, và edit trong khi viết — phá vỡ mục đích của brain dump là raw capture.',
    details: [
      'Parkinson\'s Law trong cognitive tasks: Cyril Northcote Parkinson (1955) quan sát trong bureaucracy — nhưng principle áp dụng rộng hơn. Với creative và cognitive tasks: không có time limit → overthinking, perfectionism, và analysis paralysis. Timer = external constraint buộc não switch sang execution mode.',
      'Focused urgency và working memory: 10-minute timer tạo mild time pressure — đủ để activate "challenge" response (optimal arousal, Yerkes-Dodson curve) mà không tạo "threat" response (cortisol quá cao, executive function giảm). Trong window này, não ưu tiên externalize nhanh hơn là perfect.',
      'Pomodoro Technique connection: Francesco Cirillo\'s Pomodoro (25 phút + 5 phút break) dùng cùng mechanism. Brain dump 10 phút là "compressed pomodoro" cho capture phase. Sau 10 phút, brain có signal rõ: "capture done, now process" — giảm cognitive switching cost.',
      'Không cần chuẩn bị — start immediately: Timer prevents "chuẩn bị để chuẩn bị" — một dạng procrastination phổ biến. Khi timer chạy, không có lý do nào hợp lệ để chờ thêm. Implementation friction = zero. Chỉ cần bắt đầu viết. Áp lực nhẹ của đồng hồ là sufficient cue.',
      'Điều gì xảy ra sau 10 phút: Ngay cả khi chưa xong, stop và review những gì đã viết. Thường 80% concerns đã được captured trong 10 phút đầu — law of diminishing returns với brain dump sau đó. Nếu cần thêm, set another 10 phút; không kéo dài vô hạn.',
      'Variations: Trường phái "Morning Pages" (Julia Cameron) dùng 30 phút và 3 trang — cho creative recovery context. GTD Weekly Review dùng 15–20 phút cho comprehensive capture. 10 phút là optimal cho daily stress-clearing context — đủ để release working memory load mà không quá tải thêm.',
    ],
    points: [
      { icon: '⏰', label: 'Parkinson\'s Law', note: 'Work expands to fill time — constraint = productive urgency' },
      { icon: '🎯', label: 'Execution Mode', note: 'Timer switches brain from planning → doing instantly' },
      { icon: '📊', label: 'Optimal Arousal', note: 'Mild time pressure = Yerkes-Dodson peak performance zone' },
      { icon: '🚀', label: '80% trong 10 Phút', note: 'Diminishing returns sau đó — stop & process is fine' },
    ],
  },
  {
    icon: '✏️', color: COLOR, rgb: RGB,
    modalTitle: 'Viết Tay Vs Gõ Phím — Neural Encoding & Cognitive Depth',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Van der Meer & Van der Weel (2023, Frontiers in Psychology): handwriting kích hoạt neural networks phức tạp và rộng hơn typing đáng kể — motor cortex, somatosensory, visual và language areas cùng hoạt động trong coordination. EEG studies: handwriting tạo theta-alpha oscillation liên quan đến memory encoding.',
    detail: 'Với brain dump, viết tay có một advantage đặc biệt ngoài neural encoding: không có undo button. Khi viết tay, mọi thứ đã viết ra là permanent trên giấy — tạo commitment và finality mà digital không có. Điều này giảm urge để re-edit và overthink.',
    details: [
      'Motor-cognitive coupling: Viết tay mỗi chữ = unique motor sequence (cerebellum + basal ganglia + primary motor cortex). Mỗi stroke = sensory feedback loop (visual + proprioceptive). Kết quả: deeper processing per word. Typing = same key patterns, minimal sensory variety, shallower processing.',
      'Mueller & Oppenheimer (2014): Sinh viên note bằng tay nhớ bài và hiểu concept tốt hơn laptop, dù laptop có nhiều thông tin hơn. Mechanism: viết tay slower → forced synthesis và paraphrase (generative processing) vs typing → verbatim capture (shallow processing). Same principle áp dụng cho brain dump.',
      'Tốc độ chậm là feature, không phải bug: Brain dump khi viết tay naturally slower — điều này cho phép brief reflection giữa mỗi item được viết. "Ah, và còn cái này nữa" xuất hiện tự nhiên trong slow pauses. Typing quá fast có thể outpace reflection — bạn viết trước khi fully process.',
      'Finality và commitment: Không thể "Ctrl+Z" khi viết tay. Item đã viết = committed to page. Điều này tạo psychological accountability nhỏ — bạn phải đối mặt với thứ bạn đã viết. Digital often creates false sense of "I can change it later" → avoidance behavior.',
      'File text là acceptable alternative: Nếu không có giấy: plain text editor (Notepad, VS Code, TextEdit) — không phải notion, không phải fancy app. Fancy apps tạo formatting temptation. Goal: raw capture, không phải pretty output. Nếu dùng text, tắt spell-check để không bị distracted.',
      'Phone là worst choice: Phone notifications, social media proximity, và portrait keyboard all disrupt flow. If must use digital, use laptop in fullscreen mode with airplane mode. Physical distance from social apps = reduced context switching urge.',
    ],
    points: [
      { icon: '🧠', label: 'Neural Network Rộng Hơn', note: 'Handwriting kích hoạt nhiều brain areas cùng lúc' },
      { icon: '💾', label: 'Generative Processing', note: 'Forced synthesis vs verbatim capture = deeper encoding' },
      { icon: '📌', label: 'Finality Effect', note: 'Không undo → commitment và accountability tự nhiên' },
      { icon: '📵', label: 'Tránh Phone', note: 'Notifications + proximity = flow disruption guarantee' },
    ],
  },
  {
    icon: '🌊', color: COLOR, rgb: RGB,
    modalTitle: 'Viết MỌI THỨ — Cognitive Offloading & Zeigarnik Effect',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Zeigarnik Effect (Bluma Zeigarnik, 1927): não bộ duy trì "incomplete tasks" trong working memory liên tục — bất kể quan trọng hay không. Kết quả: list dài của unresolved items chiếm bandwidth nhận thức 24/7. Viết ra = signal hoàn thành → não có thể release items khỏi active maintenance.',
    detail: '"MỌI THỨ" nghĩa là không filter — bao gồm cả những thứ nhỏ nhặt, ngớ ngẩn, "không quan trọng." Chính việc filter trong khi dump là lỗi phổ biến nhất. Filter phase đến sau khi dump xong. Trong dump phase, mọi item đều bình đẳng và xứng đáng được externalize.',
    details: [
      'Working memory và "open loops": Miller\'s Law (1956): working memory giữ 4–7 items ±2. Khi list "việc cần làm + lo âu + nhớ" vượt capacity này, não bắt đầu cyclic rehearsal (lặp đi lặp lại) để không quên — giống như spinning plates. Kết quả: background mental noise và reduced focus on present task.',
      'Cognitive offloading science: Risko & Gilbert (2016): cognitive offloading (externalize information sang môi trường) là adaptive strategy của human cognition — không phải lazy, mà là efficient. Viết ra giải phóng working memory cho higher-order thinking. "External brain" giúp "internal brain" hoạt động tốt hơn.',
      'MỌI THỨ bao gồm: Việc cần làm (todo list). Lo âu và worry ("nếu X thì sao"). Ý tưởng random. Cảm xúc và grievances. Kế hoạch và dreams. Nhắn tin chưa reply. Bill chưa trả. Người cần gặp. Sách muốn đọc. Không có filter. Não không phân biệt "important" và "trivial" khi duy trì open loops.',
      'Pennebaker\'s research connection: James Pennebaker\'s expressive writing research: viết về stressful experiences 15–20 phút × 4 ngày giảm intrusive thoughts và health visits. Brain dump là ít structured hơn nhưng dùng cùng mechanism — externalization cho phép brain "file" experience và release active maintenance.',
      'Surprising items: Thường sau brain dump, người ngạc nhiên về những gì xuất hiện — thứ không nghĩ đang bother mình. Subconscious processing đưa items vào working memory pool mà conscious mind không notice. Brain dump surfaces these hidden open loops.',
      'Không cần đủ câu: "cần gọi XYZ" "dentist?" "report thứ Sáu" "mẹ" — fragments, not sentences. Speed over grammar. Grammar là filter. Filter phá vỡ dump flow. Viết keyword triggers là enough — trong sort phase, bạn sẽ biết nó nghĩa là gì.',
    ],
    points: [
      { icon: '🔄', label: 'Zeigarnik Loop', note: 'Não không release incomplete tasks — viết ra = completion signal' },
      { icon: '💾', label: 'Cognitive Offload', note: 'Giải phóng working memory cho việc quan trọng hơn' },
      { icon: '🌊', label: 'No Filter = More Release', note: 'Filter trong dump = block flow; filter phase đến sau' },
      { icon: '💡', label: 'Surfaces Hidden Loops', note: 'Items bạn không biết đang bother mình sẽ nổi lên' },
    ],
  },
  {
    icon: '🚫', color: COLOR, rgb: RGB,
    modalTitle: 'Không Phán Xét, Không Chỉnh Sửa — Inner Critic & Free Flow',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Inner critic trong brain dump: khi bắt đầu judge ("cái này ngớ ngẩn"), edit ("nên viết khác"), hoặc censor ("không nên lo điều này"), prefrontal cortex (PFC) engage analytical mode — interrupting the raw externalization process. PFC là chính công cụ bạn đang cố bypass trong dump phase.',
    detail: 'Brain dump và free writing (Elbow, 1973) dùng cùng mechanism: bypass the internal editor để surface raw material. Trong dump phase, không có "wrong items" — chỉ có items chưa được externalized. Grammar sai, spelling sai, half-formed thoughts đều perfectly valid.',
    details: [
      'Inner critic là PFC hoạt động quá sớm: PFC (prefrontal cortex) là trung tâm của executive function — planning, judging, editing. Đây là công cụ quan trọng cho sort phase. Nhưng trong dump phase, PFC activation creates censorship loop: viết → judge → delete → chưa externalized → still in working memory.',
      'Free writing principle (Peter Elbow, 1973): "Writing Without Teachers" — core principle: pen không rời giấy, không dừng để think hoặc edit, không re-read trong khi viết. Brain dump không cần pen-on-paper rule nhưng cùng tinh thần: continuous output, no interrupt.',
      'Acceptance vs judgment: ACT (Acceptance and Commitment Therapy): psychological distress thường đến từ struggling against unwanted thoughts ("không nên lo điều này") rather than thoughts themselves. Viết ra lo âu "ngớ ngẩn" mà không judge = practice acceptance — reduces secondary distress.',
      'Không xóa, không sửa trong dump: Khi bạn viết "lo về X" rồi xóa vì "cái này ngớ ngẩn" — item đó vẫn còn trong working memory (và có thể còn mạnh hơn vì reinforced bởi attention). Rule: không xóa trong dump phase. Để nó đó. Sort phase sẽ quyết định.',
      'Sentence fragments và abbreviations welcome: "mtg 3pm", "mẹ ốm?", "tax deadline" — fragments trigger the memory trace đủ để externalize. Viết đủ để bạn biết cái đó là gì trong sort phase. Không cần người khác hiểu. Không cần future-you-3-years-later hiểu. Chỉ cần future-you-10-minutes-later hiểu.',
      'Nếu "không biết viết gì": Viết "không biết viết gì" lặp đi lặp lại cho đến khi material xuất hiện. Julia Cameron (Morning Pages): "If you can\'t think of anything to write, describe what\'s in front of you." Material sẽ đến — não luôn có items để externalize; resistance thường là inner critic disguised.',
    ],
    points: [
      { icon: '🧠', label: 'Bypass PFC Editor', note: 'Judge trong dump = PFC blocks raw externalization' },
      { icon: '✍️', label: 'Free Flow Priority', note: 'Continuous output > perfect sentences trong dump phase' },
      { icon: '🫂', label: 'Acceptance Practice', note: 'Viết lo "ngớ ngẩn" không judge = giảm secondary distress' },
      { icon: '🚀', label: 'Fragments OK', note: '"mtg 3pm" đủ — bạn sẽ biết trong sort phase' },
    ],
  },
  {
    icon: '🗂️', color: COLOR, rgb: RGB,
    modalTitle: 'Phân Loại Sau Khi Xả Xong — GTD & Eisenhower Matrix',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'David Allen (Getting Things Done, 2001): capture → clarify → organize → reflect → engage. "Phân loại" là bước Clarify trong GTD framework — xác định từng item: là gì, và bước tiếp theo là gì. Không có clarify step → mỗi item vẫn là "open loop" dù đã viết ra.',
    detail: 'Phân loại sau khi dump xong là quan trọng: nếu phân loại trong khi dump, bạn đang kết hợp hai cognitive modes (creative/capture + analytical/sort) — làm cả hai đều kém hơn. Dump first, sort second = serial processing thay vì parallel processing.',
    details: [
      'GTD Capture vs Clarify: Allen phân biệt rõ hai bước này. Capture = đưa mọi thứ ra khỏi đầu vào trusted system. Clarify = xử lý từng item: có phải là actionable không? Nếu có, action tiếp theo là gì? Nếu không, là gì (reference, someday/maybe, trash)? Hai bước này cần thực hiện tuần tự, không đồng thời.',
      'Eisenhower Matrix (2×2): Dwight Eisenhower: "What is important is seldom urgent, and what is urgent is seldom important." Matrix 4 ô: Urgent+Important (làm ngay), Not Urgent+Important (lên lịch), Urgent+Not Important (delegate), Not Urgent+Not Important (eliminate). Brain dump sort phase là simplified Eisenhower.',
      '"Lo vô ích" — Stoic categorization: Marcus Aurelius, Epictetus: phân biệt điều trong tầm kiểm soát vs ngoài tầm kiểm soát. "Lo nếu trời mưa" = ngoài tầm kiểm soát → worrying serves no function. Sorting "lo vô ích" ra khỏi todo list là Stoic practice embedded in brain dump.',
      'Two-minute rule (GTD): Allen: "If an action takes less than 2 minutes, do it now." Sort phase reveals 2-minute items — reply tin nhắn, set reminder, quick email. Completing these immediately trong sort phase gives quick wins và reduces list length rapidly.',
      'Không cần system phức tạp: 4 categories trên trang này đủ cho daily brain dump: làm ngay / lên lịch / lo vô ích / ý tưởng hay. Không cần Notion database, không cần elaborate tags. Complexity is enemy of consistency — simple system used daily > perfect system used occasionally.',
      'Realistic review time: Sort phase thường 5–10 phút cho typical brain dump (10–30 items). Total session: 10 phút dump + 5–10 phút sort = 15–20 phút. High ROI: 20 phút → reduced cognitive load for entire day. Once weekly: 30–45 phút cho comprehensive capture.',
    ],
    points: [
      { icon: '📋', label: 'GTD Clarify Step', note: 'Dump → Clarify tuần tự, không đồng thời = cả hai tốt hơn' },
      { icon: '⚡', label: '2-Minute Rule', note: 'Nếu < 2 phút, làm luôn trong sort phase' },
      { icon: '🏛️', label: 'Stoic Filter', note: 'Lo vô ích = không kiểm soát được → buông bỏ conscious' },
      { icon: '🗂️', label: 'Simple System Wins', note: '4 categories đủ — phức tạp hơn = không dùng được lâu' },
    ],
  },
  {
    icon: '🎯', color: COLOR, rgb: RGB,
    modalTitle: 'Chọn 1–3 Việc Ưu Tiên — Decision Fatigue & Cognitive Load',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f6c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Decision fatigue (Roy Baumeister, 1998): mỗi quyết định tiêu thụ limited willpower resource. Sau brain dump + sort, list "có thể làm" có thể còn 10–20 items. Buộc phải chọn 1–3 = reduce decision burden cho phần còn lại của ngày. Biết mình đang làm gì >> có list dài không thể hoàn thành.',
    detail: '"1–3 việc" là number được chọn có chủ ý: ít hơn 1 = undercommitment (dễ lãng phí ngày), hơn 3 = overcommitment (cognitive overload trở lại). Research on daily productivity: người có 3 clear MIT (Most Important Tasks) thường productive hơn người có todo list dài 20 items.',
    details: [
      'Cognitive load và task switching: Miller\'s Law: working memory 4–7 items. Khi "todo list hiện tại" nhiều hơn 3–5 items, cognitive overhead của tracking đó itself reduces performance. 1–3 MITs (Most Important Tasks) giữ active working memory load trong optimal range.',
      'Decision fatigue evidence: Shai Danziger et al. (2011): Israeli judges approve 65% parole requests ở đầu ngày, giảm xuống gần 0% trước breaks. After food breaks, lên lại 65%. Willpower và decision quality depletes. Chọn priorities sáng sớm khi willpower peak = better decisions.',
      '"Không bao giờ" list là liberating: Items không làm hôm nay và không bao giờ sẽ làm → explicitly put in "không bao giờ" bucket. Nhiều items in "cần làm" list là things we feel obligated to do but will never actually do. Explicitly declaring them "not doing this" releases working memory holding them.',
      'MIT methodology (Leo Babauta, Zen To Done): Mỗi buổi sáng, identify 3 MITs cho ngày. "Nếu chỉ có thể làm 3 việc hôm nay, đó là những việc gì?" Framing này forces prioritization. Brain dump là input để identify MITs — without dump, MIT selection is guesswork.',
      'Single-tasking > multi-tasking: Gloria Mark (University of California, Irvine): sau mỗi interruption, mất trung bình 23 phút để re-focus. Chọn 1 việc và single-task > 3 việc done simultaneously. 1–3 priorities không phải 1–3 parallel tracks — đây là prioritized queue, làm tuần tự.',
      'Evening review: Cuối ngày, check lại: 3 MITs có được hoàn thành không? Nếu không, tại sao? — thông tin này cải thiện planning ngày hôm sau. Không phán xét — chỉ data collection. Pattern sau 1–2 tuần reveal what actually takes time vs what you think takes time.',
    ],
    points: [
      { icon: '⚡', label: 'Decision Fatigue', note: 'Willpower depletes — choose priorities when energy is peak' },
      { icon: '🎯', label: '3 MITs', note: 'Most Important Tasks — biết mình làm gì > list dài 20 items' },
      { icon: '🗑️', label: '"Không Bao Giờ" List', note: 'Explicitly declare = release working memory giữ chúng' },
      { icon: '⏱️', label: 'Single-Task', note: 'Gloria Mark: 23 phút để re-focus sau mỗi interrupt' },
    ],
  },
];

const CATEGORY_MODALS = [
  {
    icon: '✅', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Có Thể Làm Ngay — 2-Minute Rule & Quick Wins',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'David Allen\'s 2-Minute Rule (GTD): "If an action takes less than 2 minutes, do it now — during the processing step, not later." Lý do: cost of tracking và revisiting item > cost of just doing it. "Ghi vào system để làm sau" cho 2-minute task là inefficient system usage.',
    detail: '"Có thể làm ngay" không chỉ nghĩa là dễ — mà là có thể bắt đầu với next clear action ngay lập tức. Reply tin nhắn, đặt reminder, quick research, gửi email, trả lời đơn giản — những thứ không cần planning hay special resources.',
    details: [
      '2-Minute Rule mechanics: Allen: trong clarify phase, mọi item có next action < 2 phút nên được done immediately. Không queue, không schedule, không delegate — do it now. Lý do: overhead of tracking (open loop in system + revisit cost + mental real estate) > 2-minute execution cost.',
      'Quick wins và momentum: Teresa Amabile (Harvard) — Progress Principle: cảm giác making progress là strongest motivator, ngay cả với small wins. Completing quick-win items tạo momentum và dopamine release — tăng likelihood of tackling bigger items sau đó. Brain dump often reveals surprising number of 2-minute tasks.',
      'Batch vs immediate: Nếu có nhiều 2-minute tasks, có thể batch chúng (respond to all messages in one sitting, make all calls back-to-back) — điều này tốt hơn random interruption. Key insight: identify them as "quick batch" trong sort phase → allocate 15–20 phút để complete toàn bộ batch.',
      'Energy-action matching: Một số 2-minute tasks cần concentration (quick decision, reply email clearly). Làm khi energy còn tốt. Một số thực sự mechanical (set timer, add to calendar). Làm bất cứ lúc nào. Energy-action matching trong "làm ngay" bucket = higher quality output.',
      'Phân biệt "có thể làm ngay" vs "muốn làm ngay": Scrolling social media, checking news, answering non-urgent messages feel like "quick tasks" nhưng không phải MITs. Quick-win bias: brain prefer easy tasks over important tasks (just-world fallacy applied to productivity). "Làm ngay" bucket chỉ bao gồm necessary tasks, không phải pleasant distractions.',
      'Review sau: Những "làm ngay" nào xuất hiện thường xuyên trong brain dumps? Pattern reveals systemic issues: nếu "reply X" xuất hiện mỗi lần → set up automated response system. If "check Y" mỗi lần → set up monitoring alert. Recurring quick tasks = automation candidates.',
    ],
    points: [
      { icon: '⚡', label: '2-Minute Rule', note: 'GTD: làm ngay nếu < 2 phút — tracking cost > execution cost' },
      { icon: '🎯', label: 'Quick Win Momentum', note: 'Amabile: small progress = strongest motivator tiếp theo' },
      { icon: '📦', label: 'Batch Similar Tasks', note: 'Gộp tất cả quick tasks → 1 session = less context switching' },
      { icon: '⚠️', label: 'Cẩn Thận Pleasant Distractions', note: 'Scrolling ≠ "làm ngay" task, dù feel quick' },
    ],
  },
  {
    icon: '📅', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Cần Lên Lịch — Time Blocking & Calendar Commitment',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Eisenhower Quadrant 2: "Quan trọng nhưng không khẩn cấp" — đây là quadrant của strategic work, long-term goals, relationship building, và personal development. Research: người dành nhiều thời gian ở Q2 có higher well-being, lower stress, và better outcomes long-term.',
    detail: '"Cần lên lịch" không phải "làm khi có thời gian" — khi không có specific time slot, Q2 tasks luôn bị displaced bởi urgent items. Calendar commitment là required step: không lên lịch = effectively deciding not to do it.',
    details: [
      'Q2 vs Q1 trap: Người sống trong Q1 (urgent + important) constantly firefighting — reactive, stressed, burnout-prone. Q2 (important, not urgent) activities: exercise, learning, relationship maintenance, strategic planning, preventive health. Neglecting Q2 → more Q1 emergencies. Investment in Q2 reduces Q1 load over time.',
      'Time blocking method: Cal Newport (Deep Work): allocate specific time blocks on calendar cho Q2 tasks — treat them like meetings. "Làm project X từ 9–11am thứ Ba" là concrete commitment. "Sẽ làm project X tuần này" là wishful thinking. Calendar không nói dối; intentions hay bị lie.',
      'Implementation intention: Gollwitzer (1999): "When X occurs, I will do Y" dramatically increases goal completion (2–3x). Applied: "Thứ Ba 9am, tôi sẽ ngồi vào bàn và bắt đầu [task]" vs "tôi sẽ cố gắng làm [task] tuần này." Specificity của time + place = implementation intention formula.',
      'Buffer time and realistic scheduling: Common mistake: lên lịch tasks back-to-back với no buffer. Research: tasks regularly take 1.5–2x estimated time (planning fallacy — Kahneman). Buffer 20% allows for overruns without cascade schedule failures. Better: 3 tasks well-done > 6 tasks half-done.',
      'Recurring vs one-time scheduling: Brain dump reveals recurring Q2 items ("exercise," "call family") → schedule as recurring calendar events. One-time items → schedule in next available appropriate time slot. Recurring schedule = decision fatigue reduction — not "when should I do X?" every time.',
      'Weekly review as scheduling session: Combine brain dump sort + scheduling into weekly ritual. Sunday evening or Monday morning: dump, sort, then immediately schedule Q2 items vào calendar tuần. 30 minutes weekly → dramatically reduce reactive mode throughout week.',
    ],
    points: [
      { icon: '🏆', label: 'Quadrant 2 Focus', note: 'Important + not urgent = strategic investment trong tương lai' },
      { icon: '📅', label: 'Calendar = Commitment', note: 'Không lên lịch = effectively deciding not to do it' },
      { icon: '🎯', label: 'Implementation Intention', note: 'Time + place specific → 2–3x higher completion rate' },
      { icon: '⏰', label: 'Planning Fallacy Buffer', note: 'Tasks take 1.5–2x longer — schedule buffer 20%' },
    ],
  },
  {
    icon: '🗑️', color: '#6b7280', rgb: '107,114,128',
    modalTitle: 'Lo Vô Ích — Stoic Philosophy & Worry Categorization',
    img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Epictetus (Enchiridion, ~125 AD): "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion… Things not in our control are body, reputation, command, and in one word, whatever are not our own actions." — Categorizing "lo vô ích" là 2000-year-old Stoic practice, modern psychology validated.',
    detail: '"Lo vô ích" không có nghĩa là cảm xúc là wrong — lo lắng là signal tự nhiên. Nhưng sau khi signal được acknowledged và categorized, continuing to ruminate on uncontrollable events serves no function. Explicit labeling "lo vô ích" + release là cognitive và emotional skill, không phải suppression.',
    details: [
      'Dichotomy of Control (Stoicism): Epictetus, Marcus Aurelius, Seneca đều dạy: phân biệt rõ ràng những gì trong tầm kiểm soát (hành động, response, effort) vs ngoài tầm kiểm soát (outcome, weather, others\' opinions, economy). Worry về uncontrollables = wasted cognitive resources. "Lo vô ích" sort = applied Stoicism.',
      'CBT và catastrophic thinking: Aaron Beck (Cognitive Behavioral Therapy): lo lắng thường involve cognitive distortions — overestimating probability of bad outcome, overestimating impact nếu outcome xảy ra. "Nếu fail interview thì sao?" Brain dump + sort giúp identify worry → apply realistic assessment: "Xác suất là gì? Thực sự impact là bao nhiêu?"',
      'Worry postponement technique: CBT tool: khi lo lắng xuất hiện ngoài "worry window," postpone: "Tôi sẽ worry về điều này lúc 5pm." Oddly effective — nhiều worries resolve themselves or feel less significant by scheduled time. Brain dump tạo "worry session" chính thức → reduce intrusive rumination throughout day.',
      'Acknowledging vs acting on worry: Thay vì suppress lo âu (không hiệu quả — ironic process theory: "đừng nghĩ đến con voi trắng" → không thể không nghĩ), acknowledge it explicitly: "Tôi đang lo về X. X là ngoài tầm kiểm soát của tôi. Tôi chọn không tiêu tốn thêm mental energy cho X." Conscious release vs suppression.',
      'Healthy worry vs unhealthy rumination: Mark Vasey & Colin MacLeod: một số worry là functional — problem-solving, planning, preparing for controllable risks. Unhealthy: circular rumination về same uncontrollable events without new information or action. "Lo vô ích" category = explicitly marking second type.',
      'Physical release: Một số lo âu cần more than cognitive categorization — somatic experience. After labeling "lo vô ích," short physical practice helpful: 4-7-8 breathing, brief walk, cold water on face. These regulate nervous system và help signal to body that "danger" is processed, not ongoing.',
    ],
    points: [
      { icon: '🏛️', label: 'Stoic Dichotomy', note: 'Control / not control — 2000 năm validated, neuroscience confirmed' },
      { icon: '🧠', label: 'CBT Reality Check', note: 'Overestimate probability + impact = cognitive distortion' },
      { icon: '⏰', label: 'Worry Postponement', note: 'Schedule worry time → intrusive rumination giảm significantly' },
      { icon: '🌬️', label: 'Acknowledge, Not Suppress', note: 'Suppress makes stronger — acknowledge + release is effective' },
    ],
  },
  {
    icon: '💡', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Ý Tưởng Hay — Capture System & Idea Incubation',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Default Mode Network (DMN): khi não "nghỉ ngơi" (không actively focused), DMN active — đây là khi creative connections, insights và "aha moments" xuất hiện. Ideas thường đến trong shower, đi bộ, drift giữa tasks. Brain dump surfaces DMN-generated ideas trước khi chúng fade từ working memory.',
    detail: '"Ý tưởng hay" category trong brain dump là capture net cho những thứ không urgent nhưng valuable — không phải todo, không phải worry, không cần làm ngay. Lưu vào trusted system để incubate → revisit khi timing phù hợp.',
    details: [
      'Idea incubation science: Graham Wallas (1926) — 4 stages of creativity: Preparation → Incubation → Illumination → Verification. Incubation = subconscious processing khi ý thức không actively working on problem. Capturing idea và "letting it rest" trong trusted system enables incubation without anxiety of forgetting.',
      'Default Mode Network và creativity: Immordino-Yang et al. (2012): DMN activity during rest và mind-wandering correlates với creativity, self-understanding và empathy. Ideas emerging during DMN activation are often high-quality — cross-domain connections that focused attention misses. Brain dump in early morning (post-sleep DMN activity) often yields unexpected ideas.',
      'Trusted capture system: GTD "Someday/Maybe" list: place for ideas not ready to act on, not ready to discard. Regular review (monthly) prevents stale accumulation. Key: "trusted" — system bạn tin rằng sẽ review. Không tin → không capture → ideas lost. Đơn giản + consistent > elaborate + forgotten.',
      'Idea connecting over time: Niklas Luhmann\'s Zettelkasten method: ghi ideas và link chúng với nhau over time → knowledge network tự tạo connections. Không cần system này elaborate — ngay cả simple "idea notebook" reviewed monthly reveals unexpected connections giữa ideas captured at different times.',
      'Avoid idea hoarding: Common trap: capture many ideas, never review, never act on any. "Idea collection" becomes source of guilt. Rule: monthly idea review — for each old idea, decide: act on it / delete it / keep for another month. 3 months without interest → delete. Ideas không có expiry date nhưng attention có.',
      'Energy matching for idea exploration: Idea development cần creative, exploratory headspace — không phải khi stressed, rushed, hay depleted. Calendar block "idea exploration" time: 30 phút mỗi tuần hay 2 giờ/tháng để review và develop captured ideas. Điều này transforms idea bucket từ "guilt pile" thành "inspiration resource."',
    ],
    points: [
      { icon: '🧠', label: 'Default Mode Network', note: 'Rest state = creative connections; dump captures trước khi fade' },
      { icon: '🌱', label: 'Incubation Works', note: 'Capture + let rest → subconscious processes → illumination' },
      { icon: '📦', label: 'Someday/Maybe List', note: 'Trusted system để revisit; monthly review prevents stale pile' },
      { icon: '⚠️', label: 'Tránh Idea Hoarding', note: '3 tháng không dùng → delete; attention có limit, không nên guilt' },
    ],
  },
];

const WHEN_MODALS = [
  {
    icon: '😰', color: COLOR, rgb: RGB,
    modalTitle: 'Khi Cảm Thấy Quá Tải — Overwhelm & Cognitive Overload',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cognitive overload (Sweller, 1988): khi thông tin cần xử lý vượt quá capacity của working memory, learning và performance sụt giảm đáng kể. Overwhelm là không phải weakness — đó là normal response của limited system bị overloaded. Brain dump reduces load by 40–60% reported in GTD practitioners.',
    detail: '"Không biết bắt đầu từ đâu" thường không phải thiếu biết — mà là quá nhiều competing demands trong working memory cùng lúc, tạo decision paralysis. Brain dump làm visible số lượng thực sự các items, cho phép systematic approach thay vì scattered anxiety.',
    details: [
      'Overwhelm vs Busyness: Busy = nhiều việc cần làm. Overwhelm = nhiều việc cần làm + không rõ priority + cảm giác không đủ resource. Brain dump giải quyết "không rõ priority" và "không biết bao nhiêu thật ra" — hai components của overwhelm, không phải workload thực sự.',
      'Decision paralysis và cognitive overload: Barry Schwartz (Paradox of Choice): too many choices → worse decisions and less satisfaction. Khi todo list trong đầu chứa 20+ items với unclear priority, não không thể pick starting point. Brain dump externalizes list → visual scan → prioritization possible.',
      'Cortisol và overwhelm: Perceived lack of control (không biết bắt đầu từ đâu) triggers stress response — cortisol tăng, executive function giảm, making situation worse. Brain dump creates a sense of control: "Tôi biết mình đang đối mặt với gì." Perception of control giảm cortisol ngay cả khi actual workload unchanged.',
      'Why right now, not later: Phổ biến: "khi bình tĩnh hơn thì dump." Nhưng overwhelm không tự resolve — nó accumulates. Brain dump in overwhelmed state releases pressure immediately. Metaphor: não như pressure cooker — dump là safety valve. "Nước sôi" trước khi dump is exactly when dump is most needed.',
      'Post-dump clarity: Nhiều người báo cáo sau brain dump 10 phút: surprise rằng list không dài như tưởng (khi items are vague in head, they expand). Sort phase reveals most items are either manageable or "lo vô ích." The clarity allows focused action on 1–3 real priorities.',
      'Emergency brain dump (5 minutes): Khi không có 10 phút full session: 5-minute version — grab any paper, set timer, dump without sorting. Even unsorted list is better than amorphous overwhelm. "Get it out, even messy" > "wait for perfect time" which never comes during overwhelm.',
    ],
    points: [
      { icon: '🧠', label: 'Cognitive Overload', note: 'Sweller: exceed WM capacity → performance sụt giảm' },
      { icon: '🎯', label: 'Decision Paralysis Fix', note: 'Schwartz: visible list → clear choice > amorphous overwhelm' },
      { icon: '😌', label: 'Control Perception', note: 'Biết mình đối mặt với gì → cortisol giảm ngay' },
      { icon: '⚡', label: 'Emergency 5-Minute', note: 'Unsorted dump now > perfect dump never during overwhelm' },
    ],
  },
  {
    icon: '😴', color: COLOR, rgb: RGB,
    modalTitle: 'Trước Khi Ngủ — Sleep Onset & Zeigarnik Night Loops',
    img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Scullin et al. (2018, Experimental Brain Research): people who wrote a to-do list for upcoming tasks for 5 minutes before bed fell asleep significantly faster (9 minutes faster) than people who wrote about completed tasks. Specificity mattered: more specific to-do list = faster sleep onset. Brain dump before bed is evidence-based sleep hygiene.',
    detail: 'Overthinking trước khi ngủ ("nằm xuống thì não chạy vòng vòng") là Zeigarnik Effect in action — incomplete tasks và unprocessed concerns được activated trong low-stimulation environment của darkness và quiet. Brain dump "closes loops" và signals brain: "Đã ghi lại. An toàn để buông."',
    details: [
      'Zeigarnik at night: Bluma Zeigarnik: incomplete tasks giữ "active record" trong working memory. Ban ngày, distractions (tasks, conversations, sensory input) partially mask these loops. Khi nằm xuống trong bóng tối, distractions remove → Zeigarnik loops become amplified. "Não chạy vòng vòng" = Zeigarnik Effect in quiet environment.',
      'To-do list specificity effect: Scullin 2018 findings: vague intentions ("I should do something about work") = minimal sleep benefit. Specific to-do list ("Email John about meeting 9am, finish report section 2, call dentist") = maximum sleep onset reduction. Specificity signals to brain: "this is handled, I know exactly what to do next."',
      'Default Mode Network và pre-sleep: As you wind down, DMN becomes more active (less task-focused, more self-referential processing). DMN processes unresolved personal concerns — which is why unprocessed events/worries from the day surface at bedtime. Pre-sleep brain dump processes these before DMN amplifies them.',
      'Hippocampal consolidation preparation: Sleep consolidates memories and learning via hippocampal replay (slow-wave sleep). Writing about the day briefly before sleep may enhance this consolidation — "tagging" experiences for memory encoding. Gratitude journaling (noting positives) before sleep biases what gets consolidated.',
      'Avoid stimulating content before dump: Stimulating pre-sleep activities (phone, news, intense conversation) can prime emotional or cognitive material that overloads the dump. Better: 30-minute wind-down (dim lights, calm activity) → then 10-minute brain dump → sleep. Context matters for dump effectiveness.',
      'Light version for bedtime: Full brain dump may be too activating for some people right before sleep. Alternative: brief "tomorrow list" (3 things tomorrow) + "today release" (3 things letting go of) → 5 minutes total. This simplified version still triggers closure mechanism without full dump energy.',
    ],
    points: [
      { icon: '😴', label: 'Sleep Onset -9 Phút', note: 'Scullin 2018: specific to-do list before bed = faster sleep' },
      { icon: '🔄', label: 'Zeigarnik at Night', note: 'Quiet + dark → loops amplified; dump = close loops' },
      { icon: '🧠', label: 'DMN Wind-Down', note: 'Pre-sleep DMN processes unresolved events — dump first' },
      { icon: '📋', label: 'Specificity Matters', note: 'Specific list > vague intentions cho sleep onset benefit' },
    ],
  },
  {
    icon: '🌀', color: COLOR, rgb: RGB,
    modalTitle: 'Khi Lo Âu Vô Lý — Amorphous Anxiety & Specificity Cure',
    img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Amorphous anxiety (lo âu không có object rõ ràng) is often more distressing than specific fear because brain cannot mount a targeted response. "Lo mơ hồ không rõ về gì" = diffuse activation of threat system without clear target. Brain dump forces specificity: viết ra buộc phải articulate WHAT exactly you\'re anxious about.',
    detail: 'Nhiều người không lo về things they think they\'re worrying about — what surfaces in brain dump often surprises them. "Lo không rõ" thường là collection of many small concerns lumped into one amorphous feeling. Dump separates them into discrete, manageable items.',
    details: [
      'Anxiety vs specific fear: Fear has object (sợ rắn, sợ ngã), anxiety does not ("cảm giác gì đó sắp xảy ra"). Anxiety involves threat without identified source → brain cannot assess danger accurately → remains on alert indefinitely. Brain dump forces articulation: "Tôi đang lo về... cụ thể là... vì..." — specificity converts anxiety into something brain can assess.',
      'Rumination vs problem-solving: Susan Nolen-Hoeksema: rumination (repetitive thinking about problem without action) increases depression and anxiety. Brain dump → sort is active problem-solving mode — shifts cognitive set from rumination to action orientation. Even items categorized as "lo vô ích" = active decision to release, không phải passive rumination.',
      'Affect labeling effect: Matthew Lieberman (UCLA): labeling emotions ("tôi đang lo âu") reduces amygdala activation. Writing emotion labels = more thorough affect labeling than just thinking them. Brain dump naturally produces affect labeling as items are written — "lo về X" already starts regulation process.',
      'Surprise discoveries: In amorphous anxiety sessions, brain dump often reveals: (1) many items are actually "lo vô ích" (uncontrollable) — when isolated and named, easier to release, (2) some items have clear small actions available — action possibility reduces anxiety, (3) "big looming anxiety" is actually 5–8 smaller concerns, each manageable.',
      'Breathing regulation before dump: When anxiety is high, parasympathetic activation helps: 4-7-8 breathing (inhale 4s, hold 7s, exhale 8s) × 3–4 rounds reduces sympathetic activation. Then brain dump from calmer baseline → better articulation, better sort. Combine somatic regulation + cognitive externalization.',
      'When to seek professional help: Brain dump is self-help tool for normal stress và occasional anxiety. Persistent anxiety significantly interfering with daily functioning, panic attacks, trauma symptoms, or anxiety tied to specific events → consult mental health professional. Brain dump helpful as adjunct, not replacement for treatment.',
    ],
    points: [
      { icon: '🎯', label: 'Specificity Converts Anxiety', note: 'Amorphous fear → named specific worry = brain can assess' },
      { icon: '🔬', label: 'Affect Labeling', note: 'Lieberman: naming emotion → amygdala activation giảm ngay' },
      { icon: '💡', label: 'Surprise Items', note: 'Big anxiety often = 5–8 small concerns; each manageable alone' },
      { icon: '🌬️', label: 'Breathing First', note: '4-7-8 breathing × 3 → calmer baseline → better dump' },
    ],
  },
];

const CATEGORIES = [
  { icon: '✅', label: 'Có thể làm ngay', color: '#10b981', desc: 'Dưới 5 phút — làm luôn' },
  { icon: '📅', label: 'Cần lên lịch', color: '#a855f7', desc: 'Quan trọng nhưng không khẩn' },
  { icon: '🗑️', label: 'Lo vô ích', color: '#6b7280', desc: 'Không kiểm soát được — buông bỏ' },
  { icon: '💡', label: 'Ý tưởng hay', color: '#f59e0b', desc: 'Lưu lại nhưng chưa cần làm ngay' },
];

const TOOL_MODAL = {
  icon: '🧹', color: COLOR, rgb: RGB,
  modalTitle: 'Khoa Học Của Brain Dump — Tại Sao Nó Hoạt Động',
  img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
  keyFact: 'David Allen (Getting Things Done, 2001): "Your mind is for having ideas, not holding them." Não bộ human không được thiết kế như RAM — nó không có "save state." Mọi thứ chưa được externalize đều chiếm active maintenance bandwidth, làm giảm capacity cho thinking hiệu quả. Brain dump là hành động release toàn bộ maintenance burden này ra bên ngoài.',
  detail: 'Brain dump kết hợp ít nhất 4 evidence-based mechanisms: cognitive offloading (giảm working memory load), Zeigarnik closure (signal complete cho open loops), affect labeling (naming anxieties = reduces amygdala), và structured externalisation (viết ra = 2-phase cognitive processing: capture then evaluate). Mỗi cơ chế độc lập có research backing; kết hợp tạo synergistic effect.',
  details: [
    'Cognitive Offloading & Working Memory: Risko & Gilbert (2016) — cognitive offloading là adaptive human strategy, không phải weakness. Working memory capacity: 4–7 items (Miller, 1956). Khi "mental list" vượt capacity, não bắt đầu cyclic rehearsal — mental spinning của same items để không quên. Brain dump releases toàn bộ rehearsal burden vào trusted external system, freeing WM cho higher-order thinking.',
    'Zeigarnik Effect & Closure: Bluma Zeigarnik (1927): não duy trì "active record" của incomplete tasks. Unfinished items xâm nhập consciousness bất cứ lúc nào (intrusive thoughts). Externalization — viết ra trong brain dump — cung cấp closure signal: "đã ghi lại, an toàn để release." Điều này stops the intrusive loop, không phải suppress — distinction quan trọng (suppression rebound effect).',
    'Two-phase Cognitive Processing: Merlin Donald (Origins of the Modern Mind, 1991): human cognition uniquely powerful bởi vì khả năng externalize và then manipulate external representations. Brain dump là ứng dụng: Phase 1 (capture/dump) = raw externalization từ episodic và semantic memory. Phase 2 (sort) = analytical evaluation từ external representation. Tách hai phase prevents cognitive interference giữa creative capture và analytical evaluation.',
    'Structured Labeling & Anxiety Reduction: Labeling items trong sort phase ("lo vô ích," "cần lên lịch") là extended affect labeling exercise. Matthew Lieberman (UCLA): labeling emotional content activates PFC và reduces amygdala response. Sort phase transforms undifferentiated anxiety thành labeled, bounded categories — from "everything is overwhelming" to "these 3 items need action, these 4 are uncontrollable."',
    'GTD System Evidence: David Allen\'s GTD được implemented bởi millions và studied qualitatively. Core insight validated: human stress often comes not from amount of work but from undefined next actions. Khi mỗi item có clear "home" (do now / schedule / release / capture), brain không cần maintain vigilance. "Stress-free productivity" emerges from trusted capture system, không phải từ doing less.',
    'Practical design của tool này: Textarea (không phải fancy input) = minimal cognitive overhead để bắt đầu. "Mỗi dòng một ý" = simple encoding rule → easy parsing trong sort phase. 4 categories đủ granular cho most brain dumps mà không overwhelm với choices. "Làm lại" option = low-stakes iteration. Flow: open → dump → click → sort → done. Zero setup, zero learning curve.',
  ],
  points: [
    { icon: '🧠', label: 'Working Memory Release', note: 'Free từ cyclic rehearsal → think better about what matters' },
    { icon: '🔒', label: 'Zeigarnik Closure', note: 'Viết ra = signal complete → intrusive loops stop' },
    { icon: '🔬', label: 'Two-Phase Processing', note: 'Capture trước, evaluate sau = cả hai done better' },
    { icon: '😌', label: 'Anxiety Categorization', note: 'Labeled categories = amygdala giảm, PFC tăng' },
  ],
};

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

function BrainDumpTool() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [sorted, setSorted] = useState({});
  const [phase, setPhase] = useState('dump'); // dump | sort

  const handleDump = () => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    setItems(lines.map((l, i) => ({ id: i, text: l, cat: null })));
    setPhase('sort');
  };

  const assignCat = (id, cat) => {
    setItems(p => p.map(it => it.id === id ? { ...it, cat } : it));
  };

  const grouped = CATEGORIES.map(c => ({ ...c, items: items.filter(it => it.cat === c.label) }));
  const unassigned = items.filter(it => !it.cat);

  if (phase === 'sort') return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-bold text-text">Phân Loại {items.length} Mục</span>
        <button onClick={() => { setPhase('dump'); setText(''); setItems([]); }} className="text-base text-muted hover:text-text underline">Làm lại</button>
      </div>
      {unassigned.length > 0 && (
        <div>
          <p className="text-base text-muted mb-3">Chưa phân loại ({unassigned.length}):</p>
          <div className="space-y-2">
            {unassigned.map(it => (
              <div key={it.id} className="rounded-xl border border-border p-3">
                <p className="text-lg text-text mb-2">{it.text}</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.label} onClick={() => assignCat(it.id, c.label)}
                      className="text-base px-3 py-1 rounded-full border transition-all hover:opacity-80"
                      style={{ borderColor: c.color, color: c.color }}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {unassigned.length === 0 && (
        <div className="space-y-4">
          {grouped.filter(g => g.items.length > 0).map(g => (
            <div key={g.label}>
              <p className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: g.color }}>{g.icon} {g.label}</p>
              <ul className="space-y-1">
                {g.items.map(it => (
                  <li key={it.id} className="text-lg text-muted pl-4 border-l-2" style={{ borderColor: g.color }}>{it.text}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className="pt-2 border-t border-border">
            <p className="text-base text-muted">✓ Brain dump hoàn tất! Chọn 1–3 việc từ "Có thể làm ngay" để bắt đầu.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}>
      <p className="text-base font-semibold" style={{ color: COLOR }}>Viết hết những gì đang trong đầu (mỗi dòng một ý):</p>
      <textarea
        className="w-full rounded-xl border bg-bg text-text text-lg p-4 resize-none focus:outline-none focus:ring-2 min-h-[180px]"
        style={{ borderColor: `${COLOR}30`, '--tw-ring-color': `${COLOR}60` }}
        placeholder={"Việc cần làm...\nLo về...\nCần nhớ...\nMuốn làm...\nĐang tức về...\n(cứ viết hết vào đây)"}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="flex items-center justify-between">
        <span className="text-base text-muted">{text.split('\n').filter(l => l.trim()).length} mục</span>
        <button
          onClick={handleDump}
          disabled={!text.trim()}
          className="px-5 py-2 rounded-full text-lg font-bold transition-all disabled:opacity-40"
          style={{ background: COLOR, color: '#fff' }}
        >
          Phân loại →
        </button>
      </div>
    </div>
  );
}

export default function MindBrainDumpPage() {
  const { t: tM } = useTranslation('mind');
  const [stepModal, setStepModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [whenModal, setWhenModal] = useState(null);
  const [toolModal, setToolModal] = useState(false);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBrainDumpOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBrainDumpOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>{tM('breadcrumb')}</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🧹</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tM('brain_dump.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>{tM('brain_dump.badge')}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tM('brain_dump.desc')}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop" alt="Brain Dump" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>{tM('brain_dump.img_caption')}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5 md:p-6 mb-6" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <p className="text-lg text-text leading-relaxed italic">"Não bộ không được thiết kế để nhớ danh sách — nó được thiết kế để suy nghĩ. Khi bạn yêu cầu nó làm cả hai, nó sẽ làm cả hai đều kém."</p>
          <p className="text-base mt-3" style={{ color: COLOR }}>— David Allen, Getting Things Done</p>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>6 Bước Brain Dump</h2>
        <p className="text-muted text-lg mb-6">Quy trình 10 phút để làm trống đầu óc</p>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="group/step flex gap-4 rounded-2xl border border-border bg-surface p-4 hover:border-sky-500/30 transition-colors cursor-pointer" onClick={() => setStepModal(i)}>
              <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black" style={{ background: `${COLOR}20`, color: COLOR }}>{s.n}</div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-text mb-1">{s.t}</div>
                  <p className="text-muted text-lg">{s.d}</p>
                </div>
                <span className="shrink-0 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/step:opacity-100 transition-opacity mt-0.5"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Thử Brain Dump Ngay</h2>
          <button onClick={() => setToolModal(true)}
            className="text-[11px] font-bold px-3 py-1 rounded-full border transition-colors hover:opacity-80"
            style={{ color: COLOR, borderColor: `${COLOR}40`, background: `${COLOR}12` }}>
            Khoa học đằng sau →
          </button>
        </div>
        <p className="text-muted text-lg mb-6">Viết ra mọi thứ trong đầu, rồi phân loại tự động</p>
        <BrainDumpTool />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Nhóm Phân Loại</h2>
        <p className="text-muted text-lg mb-6">Sau brain dump, phân loại để biết phải làm gì tiếp</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((c, i) => (
            <div key={c.label} className="group/cat rounded-2xl border border-border bg-surface p-5 hover:border-sky-500/20 transition-colors cursor-pointer" onClick={() => setCategoryModal(i)}>
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{c.icon}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/cat:opacity-100 transition-opacity"
                  style={{ color: c.color, borderColor: `${c.color}55`, background: `${c.color}12` }}>chi tiết →</span>
              </div>
              <div className="font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
              <p className="text-lg text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Khi Nào Nên Brain Dump?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHEN_MODALS.map((c, i) => (
            <div key={c.modalTitle} className="group/when rounded-2xl border border-border bg-surface p-5 text-center hover:border-sky-500/20 transition-colors cursor-pointer" onClick={() => setWhenModal(i)}>
              <div className="text-4xl mb-2">{c.icon}</div>
              <div className="font-semibold text-text mb-1">{c.modalTitle.split(' — ')[0]}</div>
              <p className="text-lg text-muted mb-3">{c.detail.split('.')[0]}.</p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/when:opacity-100 transition-opacity"
                style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>{tM('breadcrumb_back')}</span>
      </Link>

      {stepModal !== null && (
        <CardModal
          item={STEP_MODALS[stepModal]}
          onClose={() => setStepModal(null)}
          onPrev={() => setStepModal(i => Math.max(0, i - 1))}
          onNext={() => setStepModal(i => Math.min(STEP_MODALS.length - 1, i + 1))}
          hasPrev={stepModal > 0}
          hasNext={stepModal < STEP_MODALS.length - 1}
          total={STEP_MODALS.length}
          idx={stepModal}
        />
      )}
      {categoryModal !== null && (
        <CardModal
          item={CATEGORY_MODALS[categoryModal]}
          onClose={() => setCategoryModal(null)}
          onPrev={() => setCategoryModal(i => Math.max(0, i - 1))}
          onNext={() => setCategoryModal(i => Math.min(CATEGORY_MODALS.length - 1, i + 1))}
          hasPrev={categoryModal > 0}
          hasNext={categoryModal < CATEGORY_MODALS.length - 1}
          total={CATEGORY_MODALS.length}
          idx={categoryModal}
        />
      )}
      {whenModal !== null && (
        <CardModal
          item={WHEN_MODALS[whenModal]}
          onClose={() => setWhenModal(null)}
          onPrev={() => setWhenModal(i => Math.max(0, i - 1))}
          onNext={() => setWhenModal(i => Math.min(WHEN_MODALS.length - 1, i + 1))}
          hasPrev={whenModal > 0}
          hasNext={whenModal < WHEN_MODALS.length - 1}
          total={WHEN_MODALS.length}
          idx={whenModal}
        />
      )}
      {toolModal && (
        <CardModal
          item={TOOL_MODAL}
          onClose={() => setToolModal(false)}
          onPrev={() => {}}
          onNext={() => {}}
          hasPrev={false}
          hasNext={false}
          total={1}
          idx={0}
        />
      )}
    </div>
  );
}
