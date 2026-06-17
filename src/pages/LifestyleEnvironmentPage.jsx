import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#f43f5e';
const RGB = '244,63,94';
const ORBIT_ID = 'c-environment-orbit-kf';
const ORBIT_PROP = '--c-env-angle';
const ORBIT_CLASS = 'c-env-orbit-ring';

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

const ENV_ZONES = [
  {
    id: 'morning', icon: '🌅', title: 'Môi Trường Buổi Sáng',
    subtitle: 'Thiết kế cho sự khởi động', color: '#f59e0b',
    items: [
      {
        icon: '💡', title: 'Ánh sáng ngay khi thức',
        desc: 'Mở rèm hoặc bật đèn sáng trắng (5000K+) trong 5 phút đầu. Ức chế melatonin, reset đồng hồ sinh học.',
        color: '#f59e0b', rgb: '245,158,11',
        modalTitle: 'Ánh Sáng Buổi Sáng — Reset Đồng Hồ Sinh Học',
        img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Ánh sáng mạnh (>1000 lux) trong 30 phút đầu sau khi thức là tín hiệu mạnh nhất để reset circadian clock. Võng mạc có tế bào cảm quang đặc biệt (ipRGC — intrinsically photosensitive retinal ganglion cells) nhạy nhất với ánh sáng xanh lam (480nm) — chúng gửi tín hiệu trực tiếp đến suprachiasmatic nucleus (SCN) trong hypothalamus, "đồng hồ chủ" của cơ thể. Ánh sáng sáng buổi sáng = SCN nhận lệnh "đã là ban ngày" → ức chế melatonin → cortisol tăng đúng lúc → tỉnh táo trong 6–8h tiếp theo.',
        detail: 'Đồng hồ sinh học (circadian rhythm) không tự động biết giờ — nó cần "zeitgebers" (time-givers) bên ngoài để calibrate mỗi ngày. Ánh sáng mạnh buổi sáng là zeitgeber mạnh nhất và quan trọng nhất. Thiếu ánh sáng buổi sáng (làm việc trong văn phòng tối, dậy trước bình minh không bù đắp) là nguyên nhân phổ biến của cảm giác "không tỉnh" kéo dài suốt buổi sáng.',
        details: [
          'ipRGC và melanopsin: tế bào cảm quang đặc biệt này (phát hiện năm 1999 bởi David Berson) không liên quan đến thị giác thông thường — chức năng duy nhất là đo ánh sáng ambient để điều tiết đồng hồ sinh học. Chúng nhạy nhất với bước sóng 480nm (xanh lam) và cần ánh sáng đủ mạnh (>100 lux) mới hoạt động hiệu quả. Phòng trong nhà buổi sáng thường chỉ 50–100 lux — không đủ. Nắng ngoài trời: 10.000–100.000 lux.',
          'Cortisol Awakening Response (CAR) và ánh sáng: ánh sáng mạnh buổi sáng amplify CAR — đỉnh cortisol tự nhiên cao hơn và sắc nét hơn → năng lượng tốt hơn trong 4–6h đầu. Thiếu ánh sáng buổi sáng → CAR yếu → "brain fog" kéo dài. Đây là lý do người làm việc ca đêm và sống trong môi trường ít sáng thường bị mood disorders — đồng hồ sinh học bị desynchronize.',
          'Serotonin synthesis: ánh sáng buổi sáng qua ipRGC trigger serotonin synthesis tại raphe nuclei. Serotonin là precursor của melatonin — "more morning light = more serotonin now + more melatonin tonight". Đây là lý do morning sunlight trực tiếp liên quan đến chất lượng giấc ngủ tối hôm đó và tại sao seasonal affective disorder (trầm cảm mùa đông) điều trị bằng light therapy.',
          'Practical: 5 phút đủ (nếu ánh sáng đủ mạnh). Ra ngoài trời 10 phút không đeo kính râm (ánh sáng phải qua mắt, không phải da) = tốt nhất. Nếu không ra ngoài được: mở cửa sổ hoặc bật đèn sáng trắng 5000K+ (LED studio light hoặc SAD lamp 10.000 lux) trong khi ăn sáng. Không cần nhìn thẳng vào ánh sáng — ambient light đủ.',
          'Timing quan trọng hơn duration: ánh sáng mạnh trong 30–60 phút đầu sau thức có impact lớn nhất. Sau đó, light exposure ít ảnh hưởng hơn đến circadian timing. "Golden window" này không thể bù bằng ánh sáng mạnh vào buổi trưa hay chiều cho mục đích circadian reset.',
          'Ánh sáng nhân tạo có đủ không: SAD lamps (10.000 lux, 20–30 phút) được chứng minh hiệu quả tương đương nắng tự nhiên cho circadian reset và seasonal depression. Đèn LED thông thường trong nhà (200–500 lux) không đủ. Đầu tư một SAD lamp hoặc đèn grow light (dùng gần mặt) là giải pháp cho người không thể ra ngoài sáng sớm.',
        ],
        points: [
          { icon: '🌞', label: '10 phút nắng sáng > bất kỳ supplement', note: 'Serotonin + CAR amplification + circadian reset — không thứ gì thay thế được' },
          { icon: '🔬', label: 'ipRGC: cảm biến ánh sáng chuyên dụng', note: 'Tế bào đặc biệt chỉ đo ánh sáng ambient — cần >100 lux để hoạt động (phòng trong nhà thường 50 lux)' },
          { icon: '🌙', label: 'Ánh sáng sáng → ngủ tốt tối', note: 'Serotonin → melatonin: morning light trực tiếp quyết định chất lượng giấc ngủ 14–16h sau' },
          { icon: '⏱️', label: 'Golden window: 30–60 phút đầu', note: 'Timing quan trọng hơn duration — không thể bù bằng ánh sáng mạnh buổi trưa' },
        ],
      },
      {
        icon: '🌡️', title: 'Nhiệt độ mát',
        desc: 'Giữ phòng 18–20°C buổi sáng. Nhiệt độ thấp kích hoạt cortisol tích cực, tăng tỉnh táo.',
        color: '#0ea5e9', rgb: '14,165,233',
        modalTitle: 'Nhiệt Độ Mát Sáng — Kích Hoạt Tỉnh Táo Tự Nhiên',
        img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Core body temperature (CBT) tự nhiên đạt đáy lúc 4:00–6:00 sáng và bắt đầu tăng trước khi thức dậy — đây là tín hiệu kích hoạt cortisol và tỉnh táo. Giữ phòng 18–20°C buổi sáng tăng tốc quá trình tăng nhiệt độ này qua thermogenesis (cơ thể tự đốt calo để làm ấm) — tạo cảm giác tỉnh táo và energized nhanh hơn 20–30 phút so với phòng ấm 24–26°C.',
        detail: 'Nhiệt độ ảnh hưởng đến trạng thái tỉnh thức sâu hơn hầu hết mọi người nhận ra. Phòng quá ấm buổi sáng duy trì trạng thái gần với sleep — não và cơ thể "không có lý do" để fully activate. Nhiệt độ mát tạo gentle thermal stress kích hoạt sympathetic nervous system vừa đủ.',
        details: [
          'CBT và sleep-wake cycle: core body temperature dao động theo circadian rhythm — thấp nhất lúc ngủ sâu (giúp deep sleep), tăng dần trước khi thức. Phòng quá ấm làm chậm việc tăng CBT → kéo dài trạng thái drowsy. Phòng 18–20°C = slight thermal stress → cơ thể phải generate heat → thermogenesis → tỉnh táo hơn.',
          'Thermogenesis và brown adipose tissue: nhiệt độ lạnh nhẹ kích hoạt brown adipose tissue (BAT — mỡ nâu) đốt calo để tạo nhiệt. Không giống mỡ trắng (fat storage), BAT có nhiều mitochondria và đốt glucose/fatty acids trực tiếp. BAT activation tăng metabolism sáng sớm — một lý do tắm lạnh hoặc phòng mát buổi sáng được liên kết với higher energy expenditure.',
          'Cold exposure và norepinephrine: nhiệt độ lạnh nhẹ (không cần cực đoan như cold plunge) tăng norepinephrine release — neurotransmitter liên quan đến focus, alertness và mood. Nghiên cứu cho thấy tăng 200–300% norepinephrine sau cold exposure ngắn. Điều này giải thích "cảm giác tỉnh hẳn" khi bước ra ngoài buổi sáng mát.',
          'Optimal morning temperature range: 18–20°C là sweet spot — đủ mát để kích hoạt thermogenesis và norepinephrine, không quá lạnh gây discomfort làm giảm motivation ra khỏi giường. Nhiệt độ <16°C có thể gây shivering (không productive). >22°C sáng sớm: thiếu thermal stimulus để fully wake up.',
          'Practical: mở cửa sổ buổi sáng (đặc biệt ở VN mùa Đông hoặc phòng có máy lạnh). Để nhiệt độ 18–20°C khi ngủ và sáng dậy không tăng ngay. Nếu không thể điều chỉnh nhiệt độ phòng, tắm nước mát/lạnh 2–3 phút sau khi thức có effect tương tự — đây là option mạnh hơn nhiệt độ phòng.',
          'Nhiệt độ phòng vs tắm lạnh: tắm lạnh (15–20°C, 2–5 phút) tăng norepinephrine 200–300% trong vài giờ — mạnh hơn nhiều so với chỉ ở phòng mát. Nhưng tắm lạnh cần willpower để bắt đầu. Phòng mát là "passive version" — tự động xảy ra mà không cần effort. Tốt nhất: phòng mát + tắm lạnh hoặc ít nhất rửa mặt nước lạnh.',
        ],
        points: [
          { icon: '🌡️', label: '18–20°C = sweet spot tỉnh táo', note: 'Thermogenesis + norepinephrine activation mà không gây discomfort cản trở dậy giường' },
          { icon: '🔥', label: 'BAT đốt calo khi lạnh nhẹ', note: 'Brown adipose tissue activation = higher metabolism sáng sớm, không cần exercise' },
          { icon: '⚡', label: 'Norepinephrine +200–300% khi lạnh', note: 'Focus, alertness, mood — giải thích "cảm giác tỉnh hẳn" khi ra ngoài buổi sáng mát' },
          { icon: '🚿', label: 'Tắm lạnh = passive phòng mát × 10', note: '2–5 phút nước lạnh mạnh hơn nhiều — option cho người muốn maximize morning activation' },
        ],
      },
      {
        icon: '📵', title: 'Phone-free 30 phút',
        desc: 'Để điện thoại ở phòng khác hoặc chế độ DND. Không email, không mạng xã hội — não bộ cần thời gian "warm up".',
        color: '#f43f5e', rgb: '244,63,94',
        modalTitle: 'Phone-Free Sáng — Bảo Vệ Não Trong Giờ Vàng',
        img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Prefrontal cortex (PFC) — vùng não điều hành tư duy phê phán, ra quyết định và self-control — cần 20–30 phút để fully activate sau khi thức dậy. Kiểm tra điện thoại ngay khi thức đặt não vào reactive mode (xử lý notifications, emails, social) trước khi PFC sẵn sàng — về cơ bản bạn đang để người khác đặt agenda cho ngày của mình trong khi não chưa đủ khả năng phòng vệ nhận thức.',
        detail: 'Điện thoại buổi sáng không chỉ lãng phí thời gian — nó tái cấu trúc trạng thái tinh thần. Mỗi notification là một micro-stressor; social media comparison kích hoạt amygdala; news tiêu cực raise cortisol. Tất cả trước khi não bạn sẵn sàng xử lý chúng — để lại dấu ấn anxiety và reactive mindset cho cả ngày.',
        details: [
          'Sleep inertia và PFC warm-up: "sleep inertia" (quán tính ngủ) là trạng thái cognitive impairment kéo dài 15–30 phút sau khi thức — PFC chưa hoạt động đầy đủ, judgment kém, impulse control giảm. Trong giai đoạn này, cơ chế phòng vệ nhận thức (critical thinking, skepticism, self-regulation) chưa hoạt động. Đây là thời điểm tệ nhất để tiếp xúc với thông tin cần xử lý — nhưng là lúc nhiều người mở điện thoại.',
          'Dopamine hijack buổi sáng: notifications tạo variable reward (không biết có gì mới không) → kích hoạt dopamine spike liên tục. Dopamine là "wanting neurotransmitter" — nó tạo craving, không phải satisfaction thực sự. Checking điện thoại đầu ngày đặt não vào dopamine-seeking loop trước khi có bất kỳ deep work nào — sau đó rất khó để shift sang focused, slow thinking.',
          'Default Mode Network (DMN) và sáng tạo: khi không có external input (điện thoại, media), não hoạt động qua DMN — liên quan đến day-dreaming, memory consolidation, creative insight và self-reflection. Buổi sáng là lúc DMN hoạt động tự nhiên nhất sau ngủ. Điện thoại ngay khi thức suppress DMN và kích hoạt Task-Positive Network — mất cơ hội cho những sáng kiến và insights quan trọng.',
          'Cortisol và reactive mindset: email/news tiêu cực buổi sáng raise cortisol trước CAR đã normalize. Cortisol cao → narrow thinking (tunnel vision), reduced working memory, increased anxiety. Người bắt đầu ngày với cortisol cao thường report cảm giác "overwhelmed" và "reactive" suốt ngày — không phải vì công việc nhiều hơn mà vì mental bandwidth bị hẹp từ đầu.',
          'Friction Design cho phone-free: đặt điện thoại ở phòng khác khi ngủ là cách hiệu quả nhất (zero willpower cần thiết). Sử dụng đồng hồ báo thức vật lý thay vì điện thoại loại bỏ "cần điện thoại để báo thức" — lý do biện hộ phổ biến nhất. Grayscale mode trên điện thoại (Settings → Accessibility) giảm visual appeal của apps → giảm urge to check.',
          'Alternative sáng tốt hơn: 30 phút phone-free là cơ hội để: journal (5 phút ghi 3 thứ biết ơn + 1 intention cho ngày), đọc sách vật lý, thiền/thở, vận động nhẹ, ăn sáng không màn hình. Những hoạt động này proactively set mental state cho ngày thay vì để external inputs (notifications) define nó.',
        ],
        points: [
          { icon: '🧠', label: 'PFC cần 20–30 phút warm-up', note: 'Kiểm tra phone trước khi PFC ready = xử lý reactive mode khi não chưa có phòng vệ nhận thức' },
          { icon: '🎲', label: 'Variable reward = dopamine loop', note: 'Notifications không biết có gì → dopamine craving → khó shift sang deep work sau đó' },
          { icon: '💡', label: 'DMN = cơ hội sáng tạo buổi sáng', note: 'Phone suppress Default Mode Network — mất window tự nhiên nhất cho creative insights' },
          { icon: '📍', label: 'Cất điện thoại phòng khác = zero willpower', note: 'Friction Design: không cần kỷ luật — vật lý không thể với tay lấy ngay khi thức' },
        ],
      },
      {
        icon: '💧', title: 'Nước trên bàn đêm',
        desc: 'Đặt sẵn ly nước lớn bên giường. Uống ngay khi thức dậy — cơ thể mất 0.5–1L qua đêm.',
        color: '#3b82f6', rgb: '59,130,246',
        modalTitle: 'Hydration Sáng — Khởi Động Cơ Thể Với Nước',
        img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Sau 7–9h ngủ không uống nước, cơ thể ở trạng thái mild dehydration (mất 0.5–1L qua hơi thở, mồ hôi và tiểu đêm). Dù nhẹ (chỉ 1–2% body weight), dehydration gây giảm cognitive performance đo được: concentration giảm 12%, short-term memory giảm, reaction time chậm hơn. Uống 400–500ml nước ngay khi thức dậy là cách nhanh nhất để restore hydration và "kick-start" các hệ thống cơ thể.',
        detail: 'Nước không chỉ là hydration — nó là trigger sinh lý cho nhiều quá trình: kích hoạt hệ tiêu hóa, flush toxins tích lũy qua đêm, và tăng blood volume giúp circulation tốt hơn ngay buổi sáng. Friction Design đơn giản nhất: đặt sẵn ly nước bên giường = không cần willpower, không cần đi lấy.',
        details: [
          'Dehydration và cognitive function: nghiên cứu của University of East London và Universty of Westminster cho thấy chỉ 1% dehydration (khoảng 700ml với người 70kg) giảm concentration, short-term memory và psychomotor speed đo được. Brain tissue là 73% nước — ngay cả dehydration nhẹ làm não "shrink" tạm thời, tăng cortisol và làm task feel harder.',
          'Adenosine và wakefulness: adenosine (hóa chất "buồn ngủ") tích lũy suốt ngày và giải phóng khi ngủ. Khi thức dậy, adenosine vẫn còn trong máu. Uống đủ nước giúp flush adenosine và metabolic waste products khác nhanh hơn qua kidney filtration — một phần lý do tại sao uống nước sáng sớm giúp tỉnh táo nhanh hơn.',
          'Lymphatic system morning activation: lymphatic system (hệ thống loại bỏ waste và immune cells) không có pump riêng như tim — nó di chuyển qua vận động cơ và hydration. Sau 8h không vận động (ngủ), lymph fluid stagnant. Uống nước sáng + nhẹ nhàng vươn vai/vận động giúp kick-start lymph circulation — quan trọng cho detox và immune function.',
          'Electrolytes và muscle function: nước lọc tốt, nhưng thêm một chút muối biển (pinch of sea salt) hoặc lát chanh vào nước sáng tăng electrolyte content giúp hấp thu nước vào tế bào tốt hơn (không phải qua kidney ngay). Electrolytes giúp cơ hoạt động hiệu quả hơn — quan trọng nếu tập sáng. Không cần sport drinks — pinch of salt là đủ.',
          'Nước ấm vs nước lạnh buổi sáng: nước ấm (40–50°C) kích hoạt hệ tiêu hóa nhẹ nhàng hơn và không gây "thermal shock" cho dạ dày. Nước lạnh (10–15°C) tăng thermogenesis và alertness ngay lập tức. Cả hai đều tốt hơn không uống — chọn theo preference và mục tiêu (tỉnh táo nhanh: lạnh; gentle morning: ấm).',
          'Friction Design implementation: ly nước lớn (500ml+) đặt ngay bên giường tối hôm trước = friction gần bằng 0. Thay vì tìm ly, tìm nước, đi ra bếp — chỉ cần vươn tay và uống. Sau 2–3 tuần trở thành reflex tự nhiên: thức dậy → uống nước tự động trước khi fully conscious. Đây là tiny habit dễ nhất và ROI cao nhất buổi sáng.',
        ],
        points: [
          { icon: '🧠', label: '1% dehydration = -12% concentration', note: 'Sau ngủ mất 0.5–1L — uống 400–500ml ngay là cách nhanh nhất restore cognitive performance' },
          { icon: '🔄', label: 'Flush adenosine và metabolic waste', note: 'Nước giúp kidney clear sleep-accumulated waste nhanh hơn — tỉnh táo nhanh hơn caffeine' },
          { icon: '🧂', label: 'Pinch of salt tăng hấp thu', note: 'Electrolyte nhỏ giúp nước vào tế bào thay vì qua kidney ngay — không cần sport drinks' },
          { icon: '🛏️', label: 'Ly nước bên giường = zero willpower', note: 'Chuẩn bị tối hôm trước = vươn tay là uống — Friction Design đơn giản nhất có ROI cao nhất' },
        ],
      },
      {
        icon: '🎵', title: 'Âm nhạc hoặc im lặng',
        desc: 'Tránh podcast/news ngay từ sáng — chúng kích thích hệ thống xử lý thông tin trước khi não sẵn sàng.',
        color: '#a855f7', rgb: '168,85,247',
        modalTitle: 'Âm Thanh Buổi Sáng — Bảo Vệ Khả Năng Tập Trung',
        img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Podcast và news buổi sáng nghe có vẻ productive ("học hỏi trong lúc ăn sáng") nhưng thực tế làm giảm khả năng deep thinking suốt ngày. Language processing trong não cạnh tranh tài nguyên nhận thức với other thinking — nghe nói/podcast activate Wernicke\'s area và Broca\'s area liên tục, exhausting language processing capacity trước khi bạn cần nó cho công việc quan trọng. Kết quả: "verbal fatigue" sớm, khó viết và khó diễn đạt ý tưởng phức tạp sau đó.',
        detail: 'Buổi sáng là lúc DMN (Default Mode Network) — liên quan đến sáng tạo, problem-solving và self-reflection — hoạt động mạnh nhất. Đưa external audio vào suppress DMN và force Task-Positive Network activation sớm. Im lặng hoặc âm nhạc không lời cho DMN không gian để "chạy tự do" — often khi những ý tưởng tốt nhất trong ngày xuất hiện.',
        details: [
          'Cognitive bandwidth và serial processing: não không thực sự multitask với complex tasks — nó switch nhanh giữa các tasks (time-sharing). Language comprehension là một trong những tasks đòi hỏi cognitive bandwidth cao nhất. Nghe podcast khi ăn sáng/chuẩn bị = dùng hết bandwidth cho language processing → ít bandwidth còn lại cho planning, creative thinking, problem-solving buổi sáng.',
          'News và cortisol: news media (đặc biệt breaking news và social media news) thiết kế để tạo urgency và emotional arousal — kích hoạt amygdala và raise cortisol. Tiếp xúc với news tiêu cực buổi sáng (kể cả chỉ nghe radio) liên quan đến higher anxiety và worse mood outcome cả ngày theo nghiên cứu của Graham Davey (University of Sussex). Tin xấu không cần phải là "tin của bạn" để ảnh hưởng cortisol.',
          'Silence và creativity: nghiên cứu của Imke Kirste (Duke University) cho thấy im lặng 2h kích thích neurogenesis (tạo tế bào não mới) ở hippocampus — vùng liên quan đến memory và learning. Ngay cả white noise và âm nhạc không tạo được effect này. Buổi sáng im lặng (hoặc chỉ tiếng thiên nhiên) cho hippocampus cơ hội để consolidate memories từ đêm trước.',
          'Âm nhạc không lời là compromise tốt: nhạc không lời (classical, ambient, jazz không có vocals) ít can thiệp vào language processing hơn. Nhạc tempo 60–80 bpm kích hoạt alpha brainwave (8–14 Hz) liên quan đến relaxed alertness — trạng thái tốt cho creative thinking. Mozart Effect (dù bị overhyped) có cơ sở thực: nhạc baroque phức tạp có thể tăng spatial reasoning tạm thời.',
          'Morning pages và internal dialogue: cho phép suy nghĩ "rảnh" buổi sáng (không input từ ngoài) là lúc "morning pages" — stream-of-consciousness journaling — hiệu quả nhất. Julia Cameron (The Artist\'s Way) gọi đây là "brain drain" — những gì xuất hiện khi viết mà không có media noise thường là creative insights, solutions cho problems đang nghĩ, và clarity về ưu tiên. Impossible nếu đang nghe podcast.',
          'Practical implementation: nếu cần âm thanh để không cảm thấy "too quiet", thử: nature sounds (birdsong, rain, stream), instrumental music không có vocals, hoặc binaural beats (40Hz gamma cho focus). Dành podcast/audiobooks cho lúc làm việc tay chân (rửa bát, lái xe) — không cạnh tranh với creative work. Protect buổi sáng như "cognitive prime time".',
        ],
        points: [
          { icon: '🧠', label: 'Language processing exhausts bandwidth', note: 'Podcast buổi sáng dùng hết verbal capacity trước khi cần cho công việc quan trọng' },
          { icon: '📰', label: 'News = cortisol spike từ sáng sớm', note: 'Tin xấu kích hoạt amygdala → anxiety cả ngày — không cần là tin của bạn để gây hại' },
          { icon: '✨', label: 'Im lặng kích thích neurogenesis', note: 'Duke research: 2h im lặng tạo tế bào não mới ở hippocampus — white noise không làm được' },
          { icon: '🎼', label: '60–80 bpm không lời = alpha state', note: 'Classical/ambient nhẹ nhàng kích hoạt alpha brainwave — compromise tốt nhất nếu cần âm thanh' },
        ],
      },
    ],
  },
  {
    id: 'work', icon: '💼', title: 'Môi Trường Làm Việc',
    subtitle: 'Tối ưu cho tập trung & năng suất', color: '#0ea5e9',
    items: [
      {
        icon: '🖥️', title: 'Bàn làm việc ngăn nắp',
        desc: 'Dọn dẹp bàn trước mỗi phiên tập trung. Môi trường hỗn loạn → não luôn dùng tài nguyên để xử lý thứ không liên quan.',
        color: '#14b8a6', rgb: '20,184,166',
        modalTitle: 'Bàn Ngăn Nắp — Giải Phóng Tài Nguyên Nhận Thức',
        img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Môi trường hỗn loạn không chỉ "trông không đẹp" — nó tích cực tiêu thụ cognitive resources. Não xử lý visual environment liên tục ở background (pre-attentive processing), và mỗi vật thể không liên quan trên bàn là một "unresolved open loop" nhỏ cạnh tranh attention. Nghiên cứu của Princeton University Neuroscience Institute cho thấy clutter làm giảm khả năng focus và xử lý thông tin đo được trên fMRI — do cạnh tranh visual cortex.',
        detail: 'Dọn bàn trước mỗi phiên làm việc không chỉ là thói quen gọn gàng — đây là "pre-task ritual" reset cognitive state. Nghiên cứu về rituals (Michael Norton, Harvard) cho thấy rituals cụ thể trước performance giảm anxiety và tăng consistency.',
        details: [
          'Pre-attentive processing và visual clutter: não xử lý visual scene ở nhiều cấp độ song song — conscious attention chỉ là một phần nhỏ. Pre-attentive processing (không cần conscious effort) liên tục scan và categorize objects trong môi trường. Mỗi irrelevant object là một data point não phải process và decide "không liên quan" → suppress. Nhiều objects = nhiều suppression cycles = cognitive drain không nhận biết.',
          'Open loops và Zeigarnik effect: Bluma Zeigarnik (1927) phát hiện não nhớ incomplete tasks tốt hơn completed tasks và liên tục "ping" chúng để nhắc nhở. Đống hồ sơ chưa xử lý, bills chưa trả, sách chưa đọc trên bàn — tất cả là "open loops" tạo background mental noise. Dọn bàn đóng visual open loops → giảm mental background noise.',
          'Ritual transition và flow state: dọn bàn 5 phút trước khi bắt đầu là pre-task ritual tạo clear boundary giữa "random time" và "focused work time". Mihaly Csikszentmihalyi (Flow) mô tả flow state cần: clear goals, immediate feedback và elimination of distractions. Ritual dọn bàn chuẩn bị mind và environment cho flow — không phải procrastination.',
          'Không gian = tư duy: nhiều nhà tư tưởng lớn làm việc trong môi trường tối giản — không phải ngẫu nhiên. Trống rỗng trên bàn = trống rỗng trong đầu để điền ý tưởng mới. Ngược lại, bàn đầy vật dụng = mind đầy noise. "A place for everything and everything in its place" là nguyên tắc cả environmental design và cognitive hygiene.',
          'Minimum viable desk setup: bàn sạch không có nghĩa là bàn trống hoàn toàn. Chỉ để những gì cần cho task hiện tại + một vài items có emotional significance (ảnh gia đình nhỏ, cây mini). Research cho thấy một vài personal items tăng sense of agency và comfort mà không gây clutter cognitive effects. Guideline: nếu không dùng trong buổi làm việc này, cất đi.',
          'End-of-day desk reset: dọn bàn vào cuối ngày (không phải đầu ngày) tạo clear closure signal cho workday và cho phép tiếp tục vào sáng hôm sau mà không cần thêm transition time. "Tomorrow\'s self" sẽ cảm ơn bạn. Kết hợp với write 3 priorities cho ngày mai trên sticky note → bàn sạch + clear intention = tối ưu cognitive setup.',
        ],
        points: [
          { icon: '🧠', label: 'Clutter = cognitive drain trên fMRI', note: 'Princeton: môi trường hỗn loạn giảm focus đo được — não process visual clutter dù không chú ý' },
          { icon: '🔄', label: 'Open loops tạo mental background noise', note: 'Hồ sơ, bills, sách chưa xử lý = Zeigarnik effect — não ping liên tục để nhắc nhở' },
          { icon: '🎯', label: 'Dọn bàn là pre-flow ritual', note: 'Ritual tạo boundary "random time → focused time" — giảm anxiety, tăng consistency theo research' },
          { icon: '🌅', label: 'Dọn cuối ngày > dọn đầu ngày', note: 'Closure signal cho workday + bàn sạch sẵn sàng cho sáng mai = gift cho future self' },
        ],
      },
      {
        icon: '🌿', title: 'Cây xanh & thiên nhiên',
        desc: 'Ít nhất 1 cây nhỏ trên bàn hoặc tầm nhìn ra cây xanh. Giảm stress, tăng sáng tạo theo nghiên cứu.',
        color: '#10b981', rgb: '16,185,129',
        modalTitle: 'Cây Xanh — Thiên Nhiên Trong Không Gian Làm Việc',
        img: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Nhìn vào cây xanh và thiên nhiên — dù chỉ 40 giây — phục hồi attention capacity và giảm stress đo được. Nghiên cứu "micro-break" của University of Melbourne cho thấy nhìn ra mái nhà có cây xanh 40 giây giữa tasks khó giúp concentration sustained lâu hơn và ít lỗi hơn so với nhìn vào mái nhà bê tông. Cây trên bàn làm việc giảm cortisol và blood pressure, tăng creativity và satisfaction theo meta-analysis 2019 trên 24 nghiên cứu.',
        detail: 'Attention Restoration Theory (ART) của Rachel và Stephen Kaplan giải thích: natural environments kích hoạt "involuntary attention" (fascination không cần effort) thay vì "directed attention" (tập trung cần effort). Nhìn cây xanh = let directed attention rest = restore concentration capacity.',
        details: [
          'Attention Restoration Theory (ART): directed attention (concentrated focus) là resource hữu hạn — cạn dần theo thời gian làm việc. Natural environments kích hoạt "soft fascination" — quan tâm không cần effort, không cạnh tranh với directed attention. Nhìn cây xanh, mây, nước = directed attention được "recharge" trong khi eyes và mind vẫn awake. Urban environments (traffic, screens, buildings) require constant directed attention → fatigue nhanh hơn.',
          'Biophilia hypothesis và stress: E.O. Wilson\'s Biophilia hypothesis — con người có innate affinity với living organisms và natural settings vì evolutionary history (>99% thời gian tổ tiên sống trong thiên nhiên). Khi thấy cây xanh, não interpret là "safe environment" — giảm sympathetic activation, giảm cortisol, giảm blood pressure. Phản ứng này tự động và không cần conscious processing.',
          'Không khí và productivity: nhiều cây indoor (snake plant, peace lily, pothos) có khả năng lọc VOCs (volatile organic compounds) — benzene, formaldehyde từ furniture và building materials. VOCs ở nồng độ cao giảm cognitive performance. Một nghiên cứu của Dr. Joseph Allen (Harvard) cho thấy improved air quality tăng cognitive function score lên 101% trên 9 parameters. Cây xanh là air filter tự nhiên — không thay thế ventilation tốt nhưng bổ sung.',
          'Màu xanh lá và mood: wavelength của ánh sáng phản xạ từ lá cây (xanh lá, ~520–550nm) ít demanding hơn với visual cortex so với màu đỏ hay màu sắc bão hòa cao. Màu xanh lá liên quan đến trạng thái calm và balance trong color psychology — không phải cultural bias mà có cơ sở neurological (visual cortex processing).',
          'Cây nào phù hợp bàn làm việc: ưu tiên cây chịu bóng tốt (ít ánh sáng tự nhiên trong văn phòng) và dễ chăm. Top picks: pothos (devil\'s ivy) — extremely hardy, grows in water, air purifier. Snake plant (Sansevieria) — survive neglect, release O₂ ban đêm. ZZ plant — drought tolerant, glossy leaves. Peace lily — blooms, air purifier, cần ít sáng. Tránh: cây cần tưới hàng ngày → chết = depressing visual cue.',
          'Thiên nhiên nhân tạo có tác dụng không: views of nature (ảnh, painting, video screen saver của thiên nhiên) có một phần tác dụng của thiên nhiên thực — giảm stress nhẹ hơn nhưng có đo được. Living plants tốt hơn ảnh; moving water (desktop fountain) tốt hơn static image. Nếu không thể có cây thực (dị ứng, chăm sóc), desktop nature screensaver + occasional outdoor walk là compromise.',
        ],
        points: [
          { icon: '👁️', label: '40 giây nhìn cây = restore attention', note: 'Melbourne University: micro-break nhìn cây xanh giảm lỗi và duy trì concentration lâu hơn bê tông' },
          { icon: '🧬', label: 'Biophilia: não mặc định "safe" khi thấy cây', note: 'Evolutionary hard-wired — cây xanh giảm cortisol, blood pressure tự động không cần conscious effort' },
          { icon: '💨', label: 'Snake plant lọc VOCs buổi tối', note: 'Release O₂ ban đêm, lọc formaldehyde — pair với phòng thoáng cho air quality tốt nhất' },
          { icon: '🌱', label: 'Pothos: không thể giết chết', note: 'Sống trong nước, chịu bóng tốt, air purifier — cây lý tưởng nhất cho desk làm việc' },
        ],
      },
      {
        icon: '🎧', title: 'Kiểm soát âm thanh',
        desc: 'Nút tai, headphone noise-cancelling hoặc white noise (mynoise.net). 60–70dB là ngưỡng tối ưu cho sáng tạo.',
        color: '#6366f1', rgb: '99,102,241',
        modalTitle: 'Âm Thanh Làm Việc — Tối Ưu Môi Trường Âm Học',
        img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Tiếng ồn ngẫu nhiên và không dự đoán được (conversations gần đó, thông báo đột ngột, traffic) là kẻ thù lớn nhất của deep work. Nghiên cứu cho thấy mỗi interruption (dù chỉ 2.8 giây) cần trung bình 23 phút để fully re-enter flow state. Tiếng ồn xung quanh 60–70dB (tiếng ồn vừa phải, như quán cà phê) thực ra tăng creative thinking — nhưng >75dB làm giảm cả creative và analytical thinking.',
        detail: 'Không phải mọi tiếng ồn đều như nhau. Tiếng ồn dự đoán được (white noise, nhạc không lời, mưa) ít gây distraction hơn tiếng ồn bất ngờ. Conversations gần đó đặc biệt disruptive vì language processing network tự động activate khi nghe giọng người — không thể "tắt" được.',
        details: [
          'Cocktail party effect và language hijack: não được lập trình để ưu tiên nghe giọng người (evolutionary survival advantage). Ngay cả khi đang tập trung vào task khác, nghe conversation gần đó tự động activate language processing areas. Đây là lý do open office plans với nhiều người nói chuyện cực kỳ disruptive — không phải volume của tiếng ồn mà là content (speech) là vấn đề.',
          'Stochastic resonance và white noise: white noise (all frequencies bằng nhau) và pink noise (tần số thấp nhiều hơn, nghe tự nhiên hơn) tạo "stochastic resonance" — một lượng noise nhỏ paradoxically tăng signal detection trong neural systems. Ở mức phù hợp, white noise làm mờ sharp edges của sudden sounds → giảm startling → duy trì focus. MyNoise.net, Brain.fm, Noisli là tools tốt.',
          '60–70dB creative sweet spot: nghiên cứu Ravi Mehta (University of Illinois) cho thấy moderate ambient noise (~70dB, tương đương quán cà phê nhộn nhịp) tăng creative thinking so với silence hoặc loud (85dB+). Cơ chế: moderate distraction đẩy não vào slightly broader thinking mode (less focused → more associative). Đây là basis của "coffee shop effect" — nhiều người sáng tạo làm việc tốt nhất trong quán cà phê.',
          'Noise-cancelling headphones vs earplugs: ANC headphones (Active Noise Cancellation) tốt nhất cho low-frequency noise (HVAC, traffic, machine hum). Earplugs tốt hơn cho high-frequency random noise. Kết hợp: ANC headphones + white noise qua headphones = maximum noise control. Sony WH-1000XM5, Bose QC45 là top ANC performers.',
          'Music for different task types: no music = tốt nhất cho learning new material và complex analytical tasks (cần full cognitive bandwidth). Familiar instrumental music = tốt cho repetitive tasks (data entry, editing). Upbeat familiar music = tốt cho creative brainstorming (positive mood → broader thinking). Never: music with lyrics khi cần viết hoặc đọc (language interference).',
          'Architectural acoustics cho home office: hard surfaces (hardwood, tile, glass) reflect sound → echoy và reverberant → tiring to work in long-term. Add: rugs, curtains, bookshelf full of books, foam panels (recording studio foam) reduce reverberation. Dead-quiet room (anechoic) cũng uncomfortable — target RT60 (reverberation time) của 0.3–0.5 giây là comfortable for speech và work.',
        ],
        points: [
          { icon: '⚠️', label: '2.8s interrupt = 23 phút để recover focus', note: 'Mỗi bất ngờ nhỏ = 23 phút mất flow — noise control là ROI cao nhất trong deep work' },
          { icon: '☕', label: '70dB quán cà phê = creative sweet spot', note: 'Moderate noise paradoxically tăng creative thinking — quá im lặng hoặc quá ồn đều kém hơn' },
          { icon: '🗣️', label: 'Speech là noise tệ nhất', note: 'Não không thể tắt language processing khi nghe giọng người — ANC headphone giải quyết' },
          { icon: '🎵', label: 'Lyrics khi viết = cognitive conflict', note: 'Nhạc có lời cạnh tranh với language center khi viết/đọc — instrumental hoặc không nhạc' },
        ],
      },
      {
        icon: '🌡️', title: 'Nhiệt độ 20–22°C',
        desc: 'Nhiệt độ phòng ảnh hưởng trực tiếp đến năng suất. Quá nóng hoặc quá lạnh đều giảm hiệu suất nhận thức.',
        color: '#0ea5e9', rgb: '14,165,233',
        modalTitle: 'Nhiệt Độ Làm Việc — Tối Ưu Môi Trường Nhiệt Học',
        img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Nhiệt độ phòng làm việc ảnh hưởng trực tiếp đến cognitive performance theo đường cong U ngược: quá lạnh (<18°C) gây vasoconstriction giảm blood flow đến não, quá nóng (>25°C) tăng metabolic load và giảm alertness. Nghiên cứu của ASHRAE và Cornell University xác định 20–22°C là peak cognitive performance zone, với 22°C cho văn phòng cho thấy typing errors giảm 44% và output tăng 150% so với 25°C.',
        detail: 'Nhiệt độ ảnh hưởng đến cả physical comfort và neurochemistry. Nóng quá kích hoạt thermoregulation mechanisms tiêu thụ energy → less available for cognitive tasks. Lạnh quá trigger stress response. Sweet spot 20–22°C là trạng thái "thermally neutral" — cơ thể không cần effort để maintain temperature.',
        details: [
          'Thermoregulation và cognitive load: khi quá nóng, hypothalamus kích hoạt thermoregulation: tăng sweating, vasodilation (giãn mạch để tỏa nhiệt), giảm core metabolism. Tất cả đều consume energy và attention resources. "Thermal discomfort" — dù chỉ cảm giác hơi nóng — create background physiological stress tương tự như low-grade pain, continuously consuming cognitive resources.',
          'Cornell study và typing performance: nghiên cứu của Alan Hedge (Cornell, 2004) trong môi trường văn phòng thực: ở 20°C, typing errors 25°C là 25°C là điểm typing errors giảm 44% và typing output tăng 150%. Economic calculation: ở 25°C với 1 nhân viên/m², tăng nhiệt độ lên 25°C cost employer $2/h trong productivity loss. Đây là lý do nhiều công ty đầu tư vào HVAC system.',
          'Gender differences trong thermal preference: nghiên cứu cho thấy women thường comfortable ở nhiệt độ cao hơn 2–3°C so với men ở cùng điều kiện — do differences trong metabolic rate và body composition. "Standard office temperature" được set dựa trên metabolic rate của nam giới 40+ tuổi từ thập niên 1960. Khi làm việc remote, điều chỉnh nhiệt độ theo preference cá nhân là lợi thế lớn của home office.',
          'Humidity và perceived temperature: độ ẩm 40–60% là comfortable range — dưới 30% gây dry eyes và throat, trên 70% gây cảm giác ẩm ướt và tăng perceived temperature. Điều hòa nhiệt độ thường làm giảm humidity (drying effect) → cần humidifier nếu sử dụng AC nhiều. Đặc biệt quan trọng trong mùa lạnh khi heating systems làm không khí rất khô.',
          'Seasonal adjustment và acclimatization: cơ thể có thể acclimatize đến nhiệt độ khác nhau trong 2–3 tuần. Người sống ở khí hậu nhiệt đới thường comfortable ở nhiệt độ cao hơn người sống ở khí hậu ôn đới. Đừng cố ép mình làm việc ở nhiệt độ "theoretically optimal" nếu cơ thể chưa acclimatize — discomfort itself là cognitive load. Điều chỉnh dần dần nếu muốn thay đổi temperature preference.',
          'Micro-climate tricks: nếu không thể điều chỉnh nhiệt độ phòng (shared office, rented space), tạo micro-climate: desk fan khi nóng, cardigan/blanket khi lạnh, heated/cooled mouse pad. Bàn chân lạnh đặc biệt disruptive — sock ấm hoặc foot warmer giải quyết nhanh. Uống nước lạnh khi nóng, trà ấm khi lạnh giúp điều tiết core temperature mà không thay đổi room temperature.',
        ],
        points: [
          { icon: '📊', label: '22°C: typing errors -44%, output +150%', note: 'Cornell study: nhiệt độ optimal trong văn phòng thực — không phải theory mà là đo được' },
          { icon: '⚡', label: 'Thermoregulation = stolen cognitive load', note: 'Nóng quá hoặc lạnh quá → cơ thể dùng energy để regulate temp → ít để thinking' },
          { icon: '💧', label: 'Humidity 40–60% quan trọng không kém temp', note: 'AC làm khô không khí → dry eyes, throat → humidifier là pair hoàn hảo với AC' },
          { icon: '🧦', label: 'Bàn chân lạnh = đặc biệt disruptive', note: 'Micro-climate: cardigan + warm socks khi không thể kiểm soát nhiệt độ phòng' },
        ],
      },
      {
        icon: '⏰', title: 'Pomodoro vật lý',
        desc: 'Đồng hồ đếm ngược (không phải điện thoại). Giúp não "cam kết" với thời gian làm việc hơn timer trên screen.',
        color: '#f97316', rgb: '249,115,22',
        modalTitle: 'Pomodoro Vật Lý — Kỹ Thuật Quản Lý Thời Gian Hiệu Quả',
        img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Pomodoro Technique (Francesco Cirillo, 1980s): 25 phút focused work → 5 phút break → lặp lại. Sau 4 pomodoros: 15–30 phút break dài. Nghiên cứu cho thấy kỹ thuật này hiệu quả vì nó matches với natural attention span, tạo urgency giúp start (không phải perfect, chỉ cần start), và mandatory breaks prevent mental fatigue accumulation. Đồng hồ vật lý hiệu quả hơn phone timer vì không có notification temptation và ticking sound tạo auditory cue.',
        detail: 'Pomodoro không phải chỉ là timer technique — nó là time-boxing và attention management tool. Biết "chỉ còn 15 phút" tạo mild urgency kích hoạt Parkinson\'s Law (work expands to fill available time) theo hướng ngược: khi time limited, bạn focus vào essential, bỏ qua perfectionism.',
        details: [
          'Ultradian rhythms và 90-minute cycles: Peretz Lavie và Nathaniel Kleitman phát hiện "basic rest-activity cycle" (BRAC) — não oscillate giữa high-focus và low-focus states theo chu kỳ ~90 phút ngay cả ban ngày. Pomodoro 25 phút nằm trong 1/3 đầu của BRAC khi attention cao nhất. 4 pomodoros (100 phút + breaks) xấp xỉ 1 full BRAC. Long break sau 4 pomodoros align với natural BRAC reset.',
          'Time anxiety và procrastination: procrastination thường bắt nguồn từ task feeling overwhelming (không biết bắt đầu từ đâu) hoặc perfectionistic fear (không làm nếu không làm perfect). Pomodoro giải quyết cả hai: không cần hoàn thành task, chỉ cần "work on it for 25 minutes". Tính hữu hạn của 25 phút làm task feel manageable → dễ start hơn rất nhiều.',
          'Đồng hồ vật lý vs phone timer: phone timer = điện thoại trên bàn = visual cue → temptation check notifications (ngay cả khi screen off, biết phone ở đó đủ để gây distraction). Đồng hồ vật lý = tactile experience (wind up crank) tạo physical commitment, ticking sound = auditory pacemaker giúp maintain pace, và visual countdown = natural urgency. Mechanical Pomodoro timers (cà chua hình quả cà chua) có thêm yếu tố play.',
          'Break quality matters: Pomodoro break 5 phút không phải để check phone — đó là "micro-recovery". Effective breaks: stand up, stretch (thay đổi posture), look out window (ART), drink water, deep breathe. Không effective: social media, email, news — chúng không allow cognitive recovery và làm break feel "wasted" dù đã nghỉ về thể chất.',
          'Task batching với Pomodoro: estimate tasks in pomodoros trước khi bắt đầu ngày. "Email: 1 pomodoro. Report draft: 3 pomodoros. Meeting prep: 1 pomodoro." Việc estimate tạo realistic expectation và giảm overwhelm. Tracking completed pomodoros mỗi ngày cũng là productivity metric hữu ích hơn "hours worked" vì exclude breaks và distractions.',
          'Interruptions handling: khi bị interrupt trong pomodoro, ghi chú nhanh và nói "tôi sẽ trả lời sau 15 phút" — rồi finish pomodoro. Nếu interrupt không thể defer, reset pomodoro sau khi giải quyết. Không "add thêm vài phút bù" — nếu bị gián đoạn, reset là quy tắc. Consistency quan trọng hơn perfection trong Pomodoro.',
        ],
        points: [
          { icon: '🍅', label: '25 phút matches natural attention span', note: 'Ultradian rhythm: 90 phút full cycle, 25 phút = high-focus phase đầu của cycle' },
          { icon: '🚀', label: '"Chỉ 25 phút" phá procrastination', note: 'Không cần perfect, không cần xong — chỉ cần work 25 phút. Tính hữu hạn làm task feel manageable' },
          { icon: '📵', label: 'Phone timer = phone trên bàn = distraction', note: 'Đồng hồ vật lý: không notification temptation + ticking = auditory pacemaker tự nhiên' },
          { icon: '🧘', label: 'Break = micro-recovery, không phải scroll', note: 'Stand + stretch + look out window: ART + postural change. Phone trong break = không recover' },
        ],
      },
    ],
  },
  {
    id: 'evening', icon: '🌙', title: 'Môi Trường Buổi Tối',
    subtitle: 'Thiết kế cho phục hồi & giấc ngủ', color: '#a855f7',
    items: [
      {
        icon: '🔅', title: 'Dim light sau 20:00',
        desc: 'Giảm độ sáng tất cả đèn và màn hình xuống 30–40% sau 8 giờ tối. Kích hoạt sản xuất melatonin tự nhiên.',
        color: '#f59e0b', rgb: '245,158,11',
        modalTitle: 'Dim Light Tối — Kích Hoạt Melatonin Tự Nhiên',
        img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Melatonin bắt đầu tăng khi ánh sáng giảm xuống dưới ~50 lux — thường là lúc hoàng hôn trong điều kiện tự nhiên. Phòng khách hiện đại với đèn LED trần (300–500 lux) ức chế hoàn toàn melatonin dù bạn cảm thấy buồn ngủ. Dim light xuống 30–40% sau 20:00 giảm lux xuống ~50–100 lux — đủ để melatonin bắt đầu tăng tự nhiên trong 30–60 phút. Kết quả: buồn ngủ đúng giờ, sleep onset nhanh hơn, deep sleep nhiều hơn.',
        detail: 'Ánh sáng nhân tạo buổi tối là nguyên nhân số 1 của "social jet lag" — đồng hồ sinh học bị delay so với lịch xã hội. Người dùng màn hình sáng và đèn trần đến 23:00 effectively "living in a timezone 2-3 hours ahead" — cơ thể muốn ngủ lúc 2:00 nhưng lịch yêu cầu dậy lúc 6:30.',
        details: [
          'Melanopsin và light threshold: melatonin suppression bởi ánh sáng hoạt động qua ipRGC (cùng tế bào cảm quang phát hiện sáng sáng) với ngưỡng nhạy cảm ~10 lux — rất thấp. Điều này có nghĩa là ngay cả ánh sáng đèn ngủ (20–50 lux) vẫn ức chế một phần melatonin nếu tiếp xúc đủ lâu. Dim all lights, không chỉ tắt đèn trần.',
          'Blue light wavelength và melatonin: ipRGC nhạy nhất với ánh sáng xanh lam (480nm) — bước sóng phổ biến trong LED trắng lạnh và screens. LED ấm (2700K, màu vàng cam) ít blue light hơn nhiều. Switching từ 6500K LED trắng (đèn văn phòng) sang 2700K LED ấm sau 20:00 giảm melatonin suppression đến 40–60% ở cùng lux level.',
          'Dimmer switch và smart bulbs: đầu tư dimmer switch (500k-1M VNĐ) hoặc smart bulbs (Philips Hue, Yeelight) cho phép tự động dim lights theo lịch. Đặt routine: 20:00 = 50%, 21:00 = 30%, 22:00 = 10%. Smart bulbs cũng có thể shift color temperature từ 6500K (ban ngày) xuống 2700K (buổi tối) theo lịch — best of both worlds.',
          'Candles và firelight: ánh nến và firelight là ánh sáng flickering, warm color (1800K), low lux (~10–20 lux) — hoàn hảo về mặt sleep physiology. Không phải ngẫu nhiên mà tổ tiên ngủ tốt hơn bên lửa trại: firelight không suppress melatonin. Nến buổi tối là low-tech sleep hack hiệu quả và aesthetically pleasant.',
          'Screen dimming và Night Mode: Night Shift (iOS) và Night Mode (Android) shift screen màu sang warm tones sau hoàng hôn. Tuy nhiên, nghiên cứu cho thấy color shift không đủ — vấn đề chính là overall brightness của screen, không chỉ color temperature. Giảm screen brightness xuống 30–50% vào buổi tối quan trọng hơn là bật Night Shift ở brightness cao.',
          'Bathroom lighting đặc biệt quan trọng: nhiều người dim lights phòng khách nhưng quên bathroom có đèn LED trắng sáng (500+ lux) — đánh răng, rửa mặt trước ngủ trong bathroom sáng reset melatonin. Solution: để đèn ngủ nhỏ trong bathroom cho routine tối, hoặc dùng đèn đỏ (red light không suppress melatonin vì wavelength khác). Red night light là solution đơn giản và rẻ nhất.',
        ],
        points: [
          { icon: '💡', label: '<50 lux = melatonin bắt đầu tăng', note: 'Đèn LED trần 300–500 lux ức chế hoàn toàn melatonin — dim xuống 30% = game changer' },
          { icon: '🔶', label: '2700K ấm giảm melatonin suppression 50%', note: 'Shift từ LED trắng lạnh sang LED ấm = giảm blue light = ít ức chế melatonin cùng lux level' },
          { icon: '🕯️', label: 'Nến = sleep physiology hoàn hảo', note: '1800K, ~15 lux, flickering = không suppress melatonin, tổ tiên ngủ tốt bên lửa không ngẫu nhiên' },
          { icon: '🚽', label: 'Bathroom sáng trước ngủ reset melatonin', note: 'Đèn đỏ trong bathroom là fix đơn giản nhất — red wavelength không ức chế melatonin' },
        ],
      },
      {
        icon: '🌡️', title: 'Làm mát phòng ngủ',
        desc: 'Nhiệt độ phòng ngủ lý tưởng: 16–19°C. Cơ thể cần giảm nhiệt độ lõi 1–2°C để đi vào giấc ngủ sâu.',
        color: '#0ea5e9', rgb: '14,165,233',
        modalTitle: 'Nhiệt Độ Phòng Ngủ — Điều Kiện Sinh Lý Cho Deep Sleep',
        img: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Core body temperature (CBT) cần giảm 1–2°C để brain "switch" sang sleep mode và vào deep sleep (N3 — slow-wave sleep). CBT giảm bằng cách "dump" nhiệt ra peripheral vasodilation (mạch máu tay chân giãn để tỏa nhiệt). Phòng mát (16–19°C) hỗ trợ quá trình này — phòng ấm (>22°C) cản trở CBT drop → khó ngủ, ít deep sleep. Nghiên cứu của University of Texas cho thấy mỗi 1°C phòng ngủ mát hơn tương quan với 10–15 phút ngủ sâu hơn.',
        detail: 'Mất nhiều năm để hiểu tại sao chân ấm trước khi ngủ giúp ngủ tốt hơn dù phòng mát: vasodilation ở tay chân (tỏa nhiệt) = giảm CBT nhanh hơn = sleep onset nhanh hơn. Vớ ấm không làm ấm cơ thể — nó giúp tay chân release nhiệt hiệu quả hơn.',
        details: [
          'CBT và sleep architecture: CBT không chỉ liên quan đến sleep onset mà còn ảnh hưởng sleep architecture. CBT thấp nhất (~4:00–6:00 sáng) tương quan với deep slow-wave sleep (SWS) peak. Khi phòng quá ấm, CBT không xuống đủ thấp → SWS giảm → thức dậy không sảng khoái dù ngủ đủ giờ. Điều hòa nhiệt độ phòng là "nhà máy SWS" nếu dùng đúng.',
          'Warm bath/shower trick (paradox): tắm nước ấm (40°C) 1–2h trước khi ngủ paradoxically helps sleep. Cơ chế: nước ấm kích hoạt mạnh vasodilation → cơ thể dump nhiệt hiệu quả → CBT drop nhanh hơn sau khi ra khỏi bồn. Nghiên cứu confirm: tắm ấm 1–2h trước ngủ giảm sleep onset 10 phút và tăng deep sleep 15%. Không phải tắm nước lạnh — ấm mới hiệu quả.',
          'Bedding và thermal regulation: chăn/đệm ảnh hưởng sleep temperature nhiều như nhiệt độ phòng. Chăn lông vũ (down comforter) giữ nhiệt tốt — phù hợp nếu phòng mát. Chăn bamboo/cotton thoáng khí — phù hợp nếu phòng ấm hoặc hot sleepers. Gối memory foam giữ nhiệt; gối latex hoặc cooling gel phân tán nhiệt tốt hơn. Nếu partner có preference nhiệt độ khác nhau: dual-zone chăn là giải pháp.',
          'Ideal temperature range và individual variation: 16–19°C là range nghiên cứu suggest, nhưng individual variation lớn. Phụ nữ thường comfortable ở nhiệt độ ngủ cao hơn 1–2°C (do hormonal cycle ảnh hưởng thermoregulation). Người cao tuổi thường ngủ tốt hơn ở nhiệt độ ấm hơn. Experiment với ½°C increments trong 1–2 tuần để tìm optimal temperature cá nhân.',
          'Fan vs AC: fan tạo airflow giúp evaporative cooling (mồ hôi bay hơi) nhưng không thực sự làm mát không khí. Hiệu quả khi ambient temperature đã đủ mát (<26°C). AC cần cho nhiệt độ cao (tropical climate). White noise của fan là bonus sleep aid. Dehumidifier quan trọng ở khí hậu ẩm — high humidity giảm evaporative cooling và makes sleep uncomfortable.',
          'Napping và temperature: ngủ trưa cũng benefits from cool environment — napping trong phòng 18–20°C vs 26°C: SWS nhiều hơn, wake up cảm thấy refreshed hơn. Nếu không thể control nhiệt độ phòng khi nap, cooling eye mask hoặc mở quạt aimed at body giúp simulate cooler environment ở micro-level.',
        ],
        points: [
          { icon: '🌡️', label: 'CBT drop 1–2°C = deep sleep trigger', note: 'Phòng mát hỗ trợ drop CBT — mỗi 1°C mát hơn = +10–15 phút SWS thêm' },
          { icon: '🛁', label: 'Tắm ấm 40°C trước ngủ 1–2h', note: 'Paradox: vasodilation từ nước ấm dump nhiệt nhanh → CBT drop sau khi ra bồn → ngủ sâu hơn' },
          { icon: '🧦', label: 'Vớ ấm giúp tỏa nhiệt từ bàn chân', note: 'Không làm ấm — giúp vasodilation hiệu quả hơn = CBT drop nhanh hơn = sleep onset nhanh hơn' },
          { icon: '💨', label: 'Fan: airflow + white noise', note: 'Evaporative cooling + sleep-inducing sound — pair với đủ mát không khí để hiệu quả nhất' },
        ],
      },
      {
        icon: '📵', title: 'Blue light filter 21:00',
        desc: 'Bật Night Shift / f.lux trên tất cả thiết bị. Hoặc tốt hơn — không dùng màn hình sau 21:30.',
        color: '#3b82f6', rgb: '59,130,246',
        modalTitle: 'Blue Light Tối — Bảo Vệ Melatonin Trước Khi Ngủ',
        img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Ánh sáng xanh (blue light, 400–490nm) từ màn hình điện thoại, máy tính và TV là melatonin suppressor mạnh nhất trong phổ ánh sáng nhìn thấy được. Harvard Medical School research cho thấy ánh sáng xanh ức chế melatonin gấp đôi ánh sáng xanh lá và delay circadian clock thêm 3 giờ — so với ánh sáng xanh lá chỉ delay 1.5h. Điện thoại hiện đại (peak brightness 600–900 nits) ở khoảng cách gần mặt tạo intense light exposure vào thời điểm tệ nhất trong ngày.',
        detail: 'Blue light filter apps (Night Shift, f.lux) giúp nhưng không đủ — chúng shift color nhưng không giảm brightness. Màn hình sáng ở warm tone vẫn suppress melatonin. Giải pháp tốt nhất: giảm brightness + warm filter + tăng khoảng cách từ mắt. Tốt nhất: không dùng màn hình 1h trước ngủ.',
        details: [
          'Harvard 2015 study — iPad vs eReader: người đọc iPad (backlit) vs eReader (no backlight) trước ngủ: iPad group mất thêm 10 phút để ngủ, melatonin peak delay 1.5h, REM sleep giảm, cảm thấy ít alertness hơn sáng hôm sau ngay cả khi ngủ cùng số giờ. Đây là evidence trực tiếp nhất về ảnh hưởng của blue light buổi tối trên sleep quality.',
          'Distance và lux: cường độ ánh sáng giảm theo bình phương khoảng cách (inverse square law). Điện thoại cách mắt 30cm = 4× lux của cùng điện thoại cách mắt 60cm. TV lớn từ 3–4m = lux rất thấp từ screen — safe hơn nhiều so với phone/laptop gần mặt. Đây là lý do xem TV tối ít hại hơn scroll phone trước ngủ, dù TV có màn hình lớn hơn nhiều.',
          'f.lux và Night Shift — limitations: f.lux (free, Mac/PC) tự động shift screen màu từ 6500K xuống 1900K theo sunset time. Night Shift (iOS/macOS) tương tự. Tuy nhiên, nghiên cứu University of Manchester (2019) cho thấy color temperature shift ít hiệu quả hơn kỳ vọng — não adjust đến "warm screen" và treat nó như white light. Brightness reduction là factor quan trọng hơn color shift.',
          'Blue light blocking glasses: glasses với orange/amber tinted lenses (block 99% blue light) là solution portable cho situations không thể tránh screen buổi tối. Research mixed — một số study cho thấy benefit, một số không. Chất lượng glasses quan trọng: glasses cheap filter ít blue light hơn advertised. Dùng spectrometer app để test. Nếu phải làm việc late với màn hình, glasses tốt hơn không có gì.',
          'Alternative buổi tối: thay màn hình bằng: đọc sách giấy (hoặc e-ink eReader không backlit như Kindle Paperwhite ở brightness thấp), podcast/audiobook với điện thoại face-down, board games, nhạc cụ, vẽ/viết tay. Những activities này tạo winding-down ritual đồng thời tránh blue light — double benefit.',
          'Children và blue light: trẻ em đặc biệt nhạy cảm với blue light vì pupils larger và lens clearer → more light reaches retina. American Academy of Pediatrics khuyến nghị no screens 1h trước bedtime cho trẻ <12 tuổi. Sleep deprivation ở trẻ liên quan đến attention problems, emotional dysregulation và academic performance — often misdiagnosed as ADHD khi thực chất là sleep issues từ screen use.',
        ],
        points: [
          { icon: '🔵', label: 'Blue light delay circadian 3h — gấp đôi green', note: 'Harvard: blue light (480nm) là melatonin suppressor mạnh nhất — màn hình hiện đại peak blue' },
          { icon: '📏', label: 'Khoảng cách giảm exposure bình phương', note: 'Phone 30cm = 4× lux của 60cm — TV 3m xa much safer dù screen lớn hơn' },
          { icon: '🔆', label: 'Brightness quan trọng hơn color shift', note: 'Night Shift warm tone + brightness cao vẫn suppress melatonin — giảm brightness mới là key' },
          { icon: '📚', label: 'Sách giấy = best buổi tối', note: 'Không backlight, không notification, warm ambient light = sleep-friendly và effective wind-down' },
        ],
      },
      {
        icon: '🧴', title: 'Mùi hương thư giãn',
        desc: 'Lavender, chamomile hoặc sandalwood. Hệ khứu giác kết nối trực tiếp với limbic system — vùng não điều tiết cảm xúc và giấc ngủ.',
        color: '#a855f7', rgb: '168,85,247',
        modalTitle: 'Mùi Hương — Aromatherapy Và Giấc Ngủ Khoa Học',
        img: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Khứu giác (olfaction) là giác quan duy nhất có đường trực tiếp đến limbic system (amygdala, hippocampus) mà không qua thalamus — "relay station" của não. Tất cả giác quan khác (thị giác, thính giác, xúc giác) đều qua thalamus trước khi đến emotional brain. Điều này giải thích tại sao mùi hương gây emotional responses ngay lập tức và mạnh mẽ hơn bất kỳ giác quan nào. Lavender được nghiên cứu nhiều nhất: linalool (chemical chính trong lavender) ức chế glutamate receptors → giảm neural excitability → calming effect.',
        detail: 'Aromatherapy có evidence base chắc hơn nhiều người nghĩ — nhưng cơ chế không phải là "mùi thơm nên thư giãn" (psychological only) mà là direct neurochemical effect thông qua olfactory-limbic pathway.',
        details: [
          'Olfactory-limbic pathway: khi phân tử mùi đến olfactory epithelium (niêm mạc khứu giác), signal đi trực tiếp đến olfactory bulb → olfactory cortex → amygdala và hippocampus. Amygdala xử lý emotional responses; hippocampus liên kết mùi với memory. Đây là lý do tại sao mùi hương gây emotional recall mạnh (Proustian memory phenomenon) và tại sao aromatherapy ảnh hưởng mood trực tiếp.',
          'Linalool trong lavender: nghiên cứu in vitro và animal studies cho thấy linalool (chất chính trong lavender essential oil) interact với GABA-A receptors — cùng receptor mà benzodiazepines (thuốc an thần) tác động. Có thể ức chế neuronal excitability không qua bloodstream mà qua olfactory pathway. Human trials cho thấy lavender inhalation giảm anxiety scores và improves sleep quality measurably.',
          'Chamomile và apigenin: chamomile tea và essential oil chứa apigenin — một flavonoid bind với benzodiazepine receptors trong não (GABA-A). Cơ chế tương tự lavender nhưng mạnh hơn qua oral ingestion (chamomile tea). Kết hợp: uống chamomile tea + diffuse chamomile essential oil = double-pathway delivery của apigenin-like compounds.',
          'Sandalwood và alpha-santalol: sandalwood chứa alpha-santalol được nghiên cứu cho sedative và anxiolytic effects thông qua olfaction. Traditional use trong meditation và sleep rituals (Indian Ayurveda) có cơ sở biochemical — không chỉ là cultural belief. Sandalwood also inhibit 5-alpha-reductase liên quan đến testosterone metabolism (separate dari sleep).',
          'Diffuser vs direct application: ultrasonic diffuser (không nhiệt) tốt nhất — nhiệt phá vỡ some volatile compounds. Đặt trong phòng 30 phút trước khi vào phòng ngủ (fill air với scent molecules) rồi tắt hoặc để chạy low. Pillow spray (diluted essential oil trong water) là alternative đơn giản — lavender spray trên gối. Không dùng undiluted essential oil trực tiếp trên da.',
          'Associative conditioning và sleep cue: sau 2–3 tuần dùng cùng mùi hương mỗi tối trước ngủ, mùi đó trở thành Pavlovian sleep cue — ngửi mùi đó = não release sleep-related neurotransmitters. Đây là lý do hotel sử dụng signature scent (brand scent) và tại sao cùng mùi từ nhà có thể giúp ngủ tốt khi đi xa. Consistency quan trọng: cùng mùi, cùng thời gian, cùng ritual.',
        ],
        points: [
          { icon: '🧬', label: 'Olfaction → limbic trực tiếp, không qua thalamus', note: 'Giác quan duy nhất có đường thẳng đến emotional brain — phản ứng nhanh và mạnh nhất' },
          { icon: '💊', label: 'Linalool tác động GABA-A như benzodiazepine', note: 'Lavender không chỉ "ngửi thơm" — linalool ức chế neural excitability qua GABA receptor' },
          { icon: '🫖', label: 'Chamomile tea + diffuse = double pathway', note: 'Apigenin qua uống (oral) + olfactory = maximize GABA-A binding cho sedative effect' },
          { icon: '🔁', label: '2–3 tuần = Pavlovian sleep cue', note: 'Cùng mùi mỗi tối → associative conditioning → ngửi mùi = não release sleep neurotransmitters tự động' },
        ],
      },
      {
        icon: '📚', title: 'Sách thay điện thoại',
        desc: 'Để sách trên giường thay điện thoại. Đọc sách giả tưởng hoặc nhẹ nhàng — không sách phát triển bản thân trước ngủ.',
        color: '#10b981', rgb: '16,185,129',
        modalTitle: 'Đọc Sách Tối — Wind-Down Ritual Tốt Nhất',
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80&auto=format&fit=crop',
        keyFact: 'Đọc sách giấy 6 phút trước ngủ giảm stress 68% theo nghiên cứu của University of Sussex (2009) — hiệu quả hơn nghe nhạc (61%), uống trà (54%) và đi bộ (42%). Cơ chế: đọc sách (đặc biệt fiction) activate "transportation" — não "enter" vào thế giới câu chuyện, releasing từ rumination về ngày hôm đó. Narrative immersion tự nhiên giảm cortisol và mental chatter không cần technique thiền.',
        detail: 'Không phải mọi loại sách đều như nhau trước ngủ. Fiction (tiểu thuyết, truyện ngắn) tạo transportation effect và ít cognitive demand. Self-help và non-fiction thường đặt câu hỏi ("tôi phải làm gì ngày mai?") → activate planning mode → không conducive cho sleep.',
        details: [
          'Transportation theory và narrative immersion: Green & Brock (2000) mô tả "transportation" — trạng thái mental immersion hoàn toàn vào narrative của sách. Khi transported, attention rời khỏi real world (problems, anxieties, to-dos) và vào fictional world. Neuroimaging cho thấy transportation deactivates DMN default mode network rumination và activates narrative processing networks — cognitive "vacation" từ self-referential thinking.',
          'Sussex study mechanics: 2009 study bởi Mindlab International (Dr. David Lewis) đo heart rate variability, muscle tension và skin conductance. Reading decreased stress markers trong 6 phút — chỉ cần 6 phút, không phải 30 phút. Effectiveness của reading attributed đến: "active engagement of imagination", linguistic processing different từ digital multitasking, và physical còn (sách không có sounds/notifications).',
          'Fiction vs non-fiction trước ngủ: non-fiction thường chứa new information → working memory activation → harder to wind down. "Actionable content" (productivity, business) đặc biệt tệ — kích hoạt planning và problem-solving. Fiction "completes" emotional arcs → cathartic closure. Best genres trước ngủ: fantasy, literary fiction, mystery (cozy, không thriller căng thẳng). Worst: thriller, horror, news, business books.',
          'Physical book vs e-reader: sách giấy tốt nhất (no backlight). E-ink e-readers (Kindle Paperwhite) là second best — no backlight, no notifications, eye-friendly. Đặt ở brightness thấp nhất có thể đọc comfortable. iPad và phone apps: poor choice — backlit, notification-prone, temptation to switch apps. Nếu phải dùng phone để đọc: full brightness Night Mode, airplane mode, grayscale.',
          'Bookmarking ritual và transition: đặt bookmark là "completion signal" cho brain — task done, ready to sleep. Không đọc đến "ở chỗ hay không thể dừng" — sẽ đọc thêm 2h và overrun sleep time. Set timer "đọc 20–30 phút" hoặc hẹn "đọc đến cuối chapter này". Đặt sách xuống, đèn tắt là physical ritual end của ngày — mạnh hơn "scroll thêm 5 phút nữa" của phone.',
          'Genre recommendations và library building: xây một nightstand book stack nhỏ (3–5 cuốn rotation) để có lựa chọn mà không phải tìm kiếm (friction thấp). Mix genres: một cuốn đang đọc chính, một cuốn essays nhẹ (khi không muốn theo dõi plot), một cuốn thơ (5 phút là đủ). Thư viện địa phương và ứng dụng Libby (ebooks miễn phí từ thư viện) là nguồn sách không tốn tiền.',
        ],
        points: [
          { icon: '😌', label: '6 phút đọc sách giảm stress 68%', note: 'Sussex 2009: mạnh hơn nhạc (61%), trà (54%), đi bộ (42%) — transportation effect' },
          { icon: '🏰', label: 'Fiction = mental vacation khỏi ngày hôm đó', note: 'Narrative transportation deactivate rumination và self-referential thinking tự nhiên' },
          { icon: '🚫', label: 'Không sách self-help trước ngủ', note: 'Actionable content kích hoạt planning mode → ngược lại mục đích wind-down' },
          { icon: '🔖', label: 'Đặt bookmark = completion signal cho não', note: 'Physical ritual kết thúc ngày — set timer để không đọc quá giờ ngủ' },
        ],
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: '🔲', title: 'Cất điện thoại khỏi phòng ngủ', impact: 'Cao', time: '0 phút', cost: 'Miễn phí',
    color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Cất Điện Thoại Khỏi Phòng Ngủ — Thay Đổi Đơn Giản Nhất, Tác Động Lớn Nhất',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Điện thoại trong phòng ngủ gây hại theo 3 cơ chế độc lập: (1) ánh sáng xanh ức chế melatonin, (2) notifications gây micro-arousals làm gián đoạn giấc ngủ sâu, (3) temptation to check kéo dài giờ vào giường trễ. Cất điện thoại ra phòng khác là thay đổi duy nhất loại bỏ cả 3 cơ chế — không tốn tiền, không tốn thời gian, chỉ cần một quyết định.',
    detail: 'Đây là ví dụ Friction Design hoàn hảo nhất: thêm 20–30 giây (đi lấy điện thoại từ phòng khác) giảm 40–60% tần suất check điện thoại đêm khuya và sáng sớm. Không cần willpower — môi trường làm việc thay bạn.',
    details: [
      'Blue light và melatonin suppression: màn hình điện thoại phát ánh sáng xanh (450–490nm) — bước sóng nhạy nhất với ipRGC (intrinsically photosensitive retinal ganglion cells). Chỉ 1–2 giờ tiếp xúc ánh sáng xanh buổi tối ức chế melatonin 50–80%, làm trễ onset giấc ngủ 1–3 tiếng. Night mode/warm filter giảm nhưng không loại bỏ hoàn toàn — giải pháp duy nhất là không dùng điện thoại sau 21:00.',
      'Sleep fragmentation từ notifications: dù tắt tiếng, notifications (đèn nhấp nháy, rung nhẹ) gây micro-arousals — não chuyển lên lighter sleep stages để process tín hiệu. Nghiên cứu 2017 (University of Michigan) cho thấy chỉ có điện thoại trong phòng (dù không bật) liên quan đến sleep fragmentation đo được bằng polysomnography. Brain "monitors" thiết bị ngay cả khi ngủ.',
      'Sleep onset delay — "just one more scroll": dopamine loop của social media/video khiến "1 phút" thành 45 phút. Mỗi video/post thú vị là variable reward kích hoạt dopamine — brain muốn thêm. Người để điện thoại trong phòng trung bình đi ngủ trễ hơn 47 phút so với người để ngoài (JAMA Pediatrics, 2019 — dù nghiên cứu ở teen, pattern tương tự ở người lớn).',
      'Morning phone check và reactive mindset: 68% người check điện thoại trong 10 phút đầu sau thức (Deloitte survey). Kiểm tra điện thoại sáng sớm (trước khi PFC fully activate) đặt não vào reactive mode — xử lý notifications, emails, social comparison trước khi có bất kỳ intention cho ngày. Cất điện thoại phòng khác = không thể check ngay khi thức = bảo vệ "golden hour" buổi sáng.',
      'Đồng hồ báo thức thay thế: lý do biện hộ phổ biến nhất cho việc giữ điện thoại trong phòng là "cần báo thức". Một đồng hồ báo thức vật lý (loại cơ hoặc digital, giá 50–100k) loại bỏ hoàn toàn lý do này. Đầu tư nhỏ nhất với ROI giấc ngủ cao nhất: 100k đổi lại 6–12 tháng ngủ tốt hơn mỗi đêm.',
      'Nghiên cứu thực địa về bedroom phone removal: một RCT 2020 (Sleep Medicine) yêu cầu participants để điện thoại ngoài phòng ngủ 4 tuần. Kết quả: sleep duration tăng trung bình 43 phút/đêm, sleep quality (Pittsburgh Sleep Quality Index) cải thiện có ý nghĩa, morning mood tốt hơn đáng kể so với control group. Không có can thiệp nào khác — chỉ thay đổi vị trí điện thoại.',
    ],
    points: [
      { icon: '😴', label: '+43 phút ngủ mỗi đêm', note: 'RCT: chỉ cần cất điện thoại ra phòng khác — không có can thiệp nào khác' },
      { icon: '📵', label: 'Micro-arousals ngay cả khi tắt tiếng', note: 'Brain monitors thiết bị khi ngủ — notification nhỏ đủ phá vỡ deep sleep' },
      { icon: '⏰', label: 'Đồng hồ 100k = giải pháp hoàn hảo', note: 'Loại bỏ lý do "cần báo thức" — đầu tư nhỏ nhất, ROI giấc ngủ cao nhất' },
      { icon: '🌅', label: 'Bảo vệ golden hour buổi sáng', note: 'Không thể check ngay khi thức = PFC warm-up tự nhiên, morning routine proactive' },
    ],
  },
  {
    icon: '💡', title: 'Đèn đọc sách warm white', impact: 'Cao', time: '5 phút', cost: '< 200k',
    color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Đèn Warm White — Ánh Sáng Đúng Giờ Bảo Vệ Giấc Ngủ',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng buổi tối ảnh hưởng giấc ngủ qua màu sắc (color temperature), không phải chỉ độ sáng. Ánh sáng trắng lạnh (5000–6500K, cool white) giàu blue light → ức chế melatonin mạnh. Ánh sáng vàng ấm (2200–3000K, warm white/amber) có ít blue light → ít ức chế melatonin. Thay bóng đèn phòng ngủ/đèn bàn sang warm white (<3000K) là thay đổi infrastructure một lần — không cần nhớ làm gì mỗi tối.',
    detail: 'Đọc sách vật lý dưới đèn warm white là hoạt động tối lý tưởng: không có blue light từ màn hình, không có dopamine loops từ apps, nội dung có closure (sách có kết), và thường gây buồn ngủ tự nhiên sau 20–30 phút.',
    details: [
      'Color temperature và melatonin: đơn vị Kelvin (K) đo color temperature của ánh sáng — cao hơn = trắng lạnh hơn = giàu blue light hơn. Bóng đèn LED cool white phòng khách (4000–6500K) ức chế melatonin gần như mạnh bằng ánh sáng ban ngày. Warm white LED (2200–2700K) có phổ gần nến/mặt trời lúc hoàng hôn — ánh sáng não bộ tiến hóa liên kết với "sắp tối, chuẩn bị ngủ".',
      'Lux và thời điểm: độ sáng (lux) cũng quan trọng. Overhead lighting 300–500 lux tối lý tưởng nên giảm xuống <50 lux sau 20:00. Đèn đọc sách (chiếu cục bộ, không overhead) tự nhiên tạo ambient light thấp hơn. Combination: warm white (<3000K) + low lux (<50) + cục bộ (không overhead) = minimal melatonin suppression.',
      'Đọc sách vs màn hình: đọc sách vật lý không phát light — nó reflect ánh sáng ambient (warm, low lux). E-ink readers (Kindle không backlit) tương tự. iPad/tablet phát light trực tiếp vào mắt dù có night mode. Đọc 20–30 phút trước ngủ với sách vật lý liên quan đến sleep onset nhanh hơn 25% và ít wake-ups hơn (University of Sussex).',
      'Thói quen đọc và sleep hygiene: đọc sách tạo natural sleep cue — nội dung stimulating nhưng không interactive, không có variable reward loops. Sau 15–20 phút, mắt mỏi, tập trung giảm → buồn ngủ tự nhiên. Ngược với điện thoại (variable reward giữ tỉnh táo vô thời hạn), sách có endpoint tự nhiên (hết chương, mắt mỏi).',
      'Thiết lập cụ thể: đèn kẹp sách (book clip light) warm white, để cạnh giường, chỉ dùng sau 20:00. Tắt overhead light phòng ngủ → chỉ đèn sách warm white. Sau 30 phút đọc, cơ thể thường ready for sleep tự nhiên. Không cần "cố ngủ" — let the warm light + book do the work.',
      'Đèn thông minh (smart bulb) và automation: Philips Hue, LIFX, hoặc bóng thông minh Xiaomi cho phép schedule tự động chuyển sang warm white sau 19:00–20:00 mà không cần nhớ. Một lần cài → hàng tối tự động đúng màu. Chi phí 200–500k/bóng nhưng hoàn toàn passive sau khi cài — perfect Friction Design.',
    ],
    points: [
      { icon: '🌡️', label: '<3000K = ít blue light nhất', note: 'Warm white/amber gần phổ nến/hoàng hôn — màu ánh sáng não liên kết với "sắp ngủ"' },
      { icon: '📖', label: 'Sách vật lý: sleep onset nhanh hơn 25%', note: 'Không phát light, có natural endpoint, không có dopamine loops — hoạt động tối hoàn hảo' },
      { icon: '💡', label: '<50 lux sau 20:00', note: 'Đèn đọc cục bộ tự nhiên tạo low ambient light — kết hợp với warm white = minimal melatonin suppression' },
      { icon: '⚙️', label: 'Smart bulb tự động sau 19:00', note: 'Một lần cài schedule → hàng tối passive — không cần nhớ, không cần willpower' },
    ],
  },
  {
    icon: '🌿', title: 'Mua 1 cây trồng chậu nhỏ', impact: 'Trung bình', time: '15 phút', cost: '< 100k',
    color: '#22c55e', rgb: '34,197,94',
    modalTitle: 'Cây Xanh Trong Nhà — Biophilia Và Sức Khỏe Không Gian Sống',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Biophilia hypothesis (E.O. Wilson, 1984) cho rằng con người có xu hướng tiến hóa để kết nối với thiên nhiên — bộ não con người tiến hóa trong môi trường tự nhiên hàng triệu năm và vẫn "expect" thiên nhiên xung quanh. Nhìn thấy cây xanh kích hoạt parasympathetic nervous system (rest-and-digest), giảm cortisol measurable, và giảm mental fatigue theo cơ chế Attention Restoration Theory (ART) của Rachel và Stephen Kaplan.',
    detail: 'Cây trong nhà không chỉ trang trí — chúng tạo micro-environment tâm lý. Attention Restoration Theory giải thích tại sao môi trường thiên nhiên (kể cả chỉ 1 cây nhỏ) giúp phục hồi directed attention sau cognitive fatigue — quan trọng cho người làm việc trí tuệ suốt ngày.',
    details: [
      'Attention Restoration Theory (ART): Rachel và Stephen Kaplan (University of Michigan) phân biệt "directed attention" (effort-based focus cho công việc) và "fascination" (effortless attention trong thiên nhiên). Directed attention bị depleted theo giờ làm việc. Thiên nhiên (kể cả cây trong nhà) kích hoạt fascination mode — phục hồi directed attention mà không tốn mental effort. Sau 10–15 phút nhìn cây/thiên nhiên, directed attention được restore đáng kể.',
      'Cortisol và green space: nghiên cứu của Seung-Yeon Lee (Chung-Ang University) đo cortisol saliva khi nhìn cây trong nhà vs nhìn màn hình. Nhóm cây xanh giảm cortisol 15–20% trong 5 phút. Cây không cần lớn — ngay cả cây nhỏ trên bàn đủ tạo "green micro-dose" có tác dụng. Cơ chế: visual perception của màu xanh lá và organic shapes trigger parasympathetic response.',
      'NASA Clean Air Study và chất lượng không khí: nghiên cứu NASA 1989 (và validated nhiều lần sau) cho thấy cây trong nhà hấp thu VOCs (volatile organic compounds) như benzene, formaldehyde, toluene từ furniture, paint, cleaning products. Số lượng cần cho 18m² phòng: 6–8 cây loại trung bình. Ngay cả 1–2 cây cũng tạo cải thiện nhỏ về air quality, đặc biệt nếu phòng ít thông khí.',
      'Cây dễ chăm nhất cho người bận rộn: (1) Lưỡi hổ / Snake plant (Sansevieria): sống trong bóng tối, tưới 2 tuần/lần, lọc không khí tốt nhất NASA. (2) Trầu bà / Pothos: leo, bóng tối, tưới khi đất khô. (3) Xương rồng / Cactus: tưới 1 tháng/lần. (4) ZZ Plant: chịu khô tốt nhất, không cần nhiều ánh sáng. (5) Sơ ri / Peace Lily: thích bóng mát, nở hoa trắng. Tất cả đều < 100k và siêu khó chết.',
      'Psychological ownership và engagement: chăm sóc cây tạo sense of nurturing và responsibility nhỏ — giúp thiết lập routine (tưới cây) và tạo kết nối với môi trường sống. Research cho thấy người chăm cây thường báo cáo higher sense of control và lower loneliness. Cây là "low-stakes living thing" — không quá demanding như thú cưng, nhưng đủ alive để tạo connection.',
      'Workplace cây xanh và productivity: meta-analysis 2014 (Exeter University, 2.000 nhân viên văn phòng) cho thấy văn phòng có cây xanh tăng productivity 15%, wellbeing 47%, creativity 45% so với văn phòng không có cây. Chỉ cần 1 cây trong tầm nhìn là đủ cho cải thiện đo được. Nhìn cây khi "stuck" với problem → attention restoration → fresh perspective.',
    ],
    points: [
      { icon: '🧠', label: 'Attention restore sau cognitive fatigue', note: 'ART: thiên nhiên kích hoạt effortless fascination — phục hồi directed attention mà không effort' },
      { icon: '📉', label: 'Cortisol giảm 15–20% trong 5 phút', note: 'Chỉ cần NHÌN cây nhỏ trên bàn đủ trigger parasympathetic response đo được' },
      { icon: '💼', label: '+15% productivity, +45% creativity', note: 'Exeter meta-analysis (2.000 người): 1 cây trong tầm nhìn đủ cho cải thiện có ý nghĩa' },
      { icon: '🌱', label: 'Lưỡi hổ: tưới 2 tuần/lần, siêu bền', note: 'NASA top air purifier — sống được trong bóng tối, gần như không thể chết, <50k' },
    ],
  },
  {
    icon: '🎧', title: 'Nút tai chống ồn', impact: 'Cao', time: '0 phút', cost: '< 50k',
    color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Nút Tai Chống Ồn — Kiểm Soát Acoustic Environment',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tiếng ồn nền (ambient noise) ảnh hưởng cognitive performance ngay cả khi bạn "quen" với nó và không chú ý. Hippocampus — vùng não quan trọng cho memory và learning — đặc biệt nhạy với noise stress: tiếng ồn không đoán được (unpredictable noise) gây cortisol spike và impair memory formation. Nút tai xốp (foam earplugs, giá 20–50k/cặp) giảm âm thanh 25–33 dB — đủ để loại bỏ hầu hết ambient noise trong nhà và văn phòng.',
    detail: 'Không cần ANC (active noise cancellation) đắt tiền — foam earplugs đơn giản hiệu quả hơn cho deep work và ngủ. Không có electronics, không cần sạc, không có latency, giảm noise nhiều hơn hầu hết ANC headphones ở mid-range.',
    details: [
      'Cognitive performance và noise: nghiên cứu của Cornell (Evans & Johnson, 2000) cho thấy nhân viên văn phòng open-plan (có noise nền) có elevated cortisol, giảm motivation to persist on challenges, và ít ergonomic adjustments (giảm adapting to environment). Quan trọng nhất: participants KHÔNG NHẬN THỨC được noise đang ảnh hưởng họ — chứng minh noise gây harm dưới ngưỡng conscious perception.',
      'Unpredictable noise vs constant noise: não có cơ chế habituation với constant noise (fan, white noise) — eventually tune it out. Nhưng với unpredictable noise (tiếng người nói chuyện, xe cộ, notifications), não không thể fully habituate — phải liên tục "check" tín hiệu mới. Đây là lý do tiếng người nói chuyện (speech-modulated noise) phá concentration nhiều nhất.',
      'Inhibitory spillover effect: khi đang cố ngủ, tiếng ồn gây arousal responses — não activate để process tiếng ồn dù bạn cố ignore. Nút tai khi ngủ giảm sleep latency (thời gian từ nằm xuống đến ngủ) trung bình 15–20 phút theo nghiên cứu ICU noise (tương tự nhà ở VN gần đường phố). Đặc biệt hữu ích giai đoạn sleep onset và early morning khi giấc ngủ nhẹ hơn.',
      'Foam earplugs vs ANC headphones: foam earplugs (NRR 32–33 dB) thực sự giảm noise nhiều hơn hầu hết ANC headphones mid-range (hiệu quả 15–25 dB tùy tần số). ANC tốt hơn cho low-frequency noise (engine hum); foam tốt hơn cho broad-spectrum ambient noise. Foam không cần sạc, không có microphone leakage, không có pressure sensation của ANC, và chi phí 20–50k thay vì 2–5 triệu.',
      'Deep work và acoustic environment: Cal Newport (Deep Work) nhấn mạnh "monk mode" — môi trường không gián đoạn cho intense focused work. Nút tai là thiết bị đơn giản nhất để tạo monk mode ngay lập tức, bất kỳ đâu. Khi đeo nút tai, bạn còn tạo visual signal cho người xung quanh "đang tập trung, không làm phiền" — double benefit.',
      'Acoustic và sức khỏe dài hạn: WHO (2011) ước tính tiếng ồn giao thông đô thị ở châu Âu gây mất 1 triệu năm healthy life/năm do sleep disturbance và cardiovascular effects. Tiếp xúc chronic noise (>55 dB ban đêm) liên quan đến tăng risk cardiovascular disease, hypertension, và cognitive decline. Nút tai không chỉ improve productivity — còn là health protection measure.',
    ],
    points: [
      { icon: '🧠', label: 'Noise hại cognitive dưới conscious perception', note: 'Cornell: nhân viên không biết noise đang ảnh hưởng — cortisol tăng, motivation giảm đo được' },
      { icon: '😴', label: 'Sleep latency giảm 15–20 phút', note: 'Ít tín hiệu arousal trong giai đoạn sleep onset — đặc biệt quan trọng ở VN gần đường phố' },
      { icon: '💰', label: 'Foam 50k > ANC 5 triệu cho noise reduction', note: 'NRR 33 dB foam earplugs thường giảm noise nhiều hơn mid-range ANC headphones' },
      { icon: '🚫', label: 'Unpredictable speech noise = worst for focus', note: 'Não không thể habituate tiếng người — nút tai loại bỏ loại noise phá concentration nhất' },
    ],
  },
  {
    icon: '💧', title: 'Ly nước đặt sẵn bên giường', impact: 'Trung bình', time: '0 phút', cost: 'Miễn phí',
    color: '#3b82f6', rgb: '59,130,246',
    modalTitle: 'Ly Nước Bên Giường — Friction Design Cho Hydration Sáng',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sau 7–9h ngủ không uống nước, cơ thể mất 0.5–1L qua hơi thở, mồ hôi và tiểu đêm, dẫn đến mild dehydration (1–2% body weight). Nghiên cứu cho thấy chỉ 1% dehydration giảm concentration 12%, short-term memory đo được, và làm tasks feel harder (subjective effort tăng). Ly nước 500ml bên giường = friction gần 0 — vươn tay là uống, trước khi fully conscious, trước bất kỳ quyết định nào khác buổi sáng.',
    detail: 'Đây là ví dụ Friction Design đơn giản nhất với ROI cao nhất: chuẩn bị tối hôm trước (10 giây) → thói quen tự động sáng hôm sau (vươn tay uống ngay khi thức). Sau 2–3 tuần, trở thành reflex không cần nghĩ.',
    details: [
      'Dehydration sáng và cognitive function: khi thức dậy, plasma osmolality (nồng độ chất hòa tan trong máu) cao hơn mức tối ưu do mất nước qua hơi thở và không uống 8h. Brain tissue 73% nước — ngay cả 1–2% dehydration gây brain "shrink" tạm thời, tăng cortisol stress response, và làm neural transmission chậm hơn. Uống nước sáng sớm là cách nhanh nhất restore cellular hydration.',
      'Adenosine clearance: adenosine là hóa chất "buồn ngủ" tích lũy suốt ngày thức và được metabolize khi ngủ. Sau 8h ngủ, adenosine vẫn còn residual trong bloodstream cần được cleared qua kidney. Hydration giúp renal clearance hoạt động hiệu quả hơn — một phần lý do uống nước sáng sớm giúp tỉnh táo. Caffeine hoạt động bằng cách block adenosine receptors; nước hoạt động bằng cách flush adenosine — complementary mechanisms.',
      'Metabolism activation: uống 500ml nước lạnh sáng sớm tăng metabolic rate ~30% trong 30–40 phút theo nghiên cứu (Journal of Clinical Endocrinology & Metabolism, 2003). Cơ thể phải "warm up" nước lạnh để đạt body temperature — thermogenesis nhỏ nhưng có ý nghĩa. Nước ấm không có hiệu ứng thermogenesis này nhưng gentler cho hệ tiêu hóa — chọn theo preference.',
      'Lymphatic system kickstart: lymphatic system không có pump như tim — nó di chuyển qua muscle contractions và hydration pressure. Sau 8h nằm không vận động, lymph fluid stagnant. Uống nước + nhẹ nhàng vươn vai/vận động giúp kickstart lymph circulation — quan trọng cho detox, immune cell distribution, và giảm morning puffiness (sưng mặt sáng).',
      'Electrolyte enhancement: thêm pinch of Himalayan salt (≈1/8 tsp) hoặc squeeze chanh vào ly nước sáng tăng electrolyte content — giúp nước được absorbed vào tế bào thay vì qua kidney ngay. Electrolytes (sodium, potassium, magnesium) cần thiết cho neural function và muscle contraction. Không cần sport drinks — pinch of salt là đủ và chi phí gần 0.',
      'Habit stacking: ly nước bên giường là anchor habit — trigger automatic behavior: (1) thức dậy → (2) vươn tay → (3) uống 500ml → (4) ngồi dậy. Habit stacking (James Clear) gắn thói quen mới vào action hiện có. "Ngay sau khi thức dậy (trigger), tôi uống ly nước bên giường (routine)" — không cần nhớ, không cần motivation, ly nước ở đó nhắc bạn.',
    ],
    points: [
      { icon: '🧠', label: '1% dehydration = -12% concentration', note: 'Mild dehydration sau ngủ ảnh hưởng cognitive performance trước bất kỳ task nào buổi sáng' },
      { icon: '⚗️', label: 'Flush adenosine qua kidney', note: 'Nước giúp clear "sleepiness chemical" hiệu quả hơn — complementary với cơ chế caffeine' },
      { icon: '🔥', label: '+30% metabolic rate với nước lạnh', note: 'Thermogenesis nhỏ để warm up nước — bonus metabolism kick cùng với hydration benefits' },
      { icon: '🧂', label: 'Pinch of salt = electrolyte upgrade miễn phí', note: 'Sodium giúp nước vào tế bào thay vì qua kidney ngay — absorption tốt hơn, không cần sport drink' },
    ],
  },
  {
    icon: '📦', title: 'Hộp đựng dây cáp, đồ lặt vặt', impact: 'Trung bình', time: '30 phút', cost: '< 100k',
    color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Hộp Đựng Dây Cáp — Giải Phóng Cognitive Load Từ Clutter',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dây cáp rối, đồ lặt vặt vô mục đích trên bàn là ví dụ điển hình của "cognitive clutter" — môi trường hỗn loạn mà não phải liên tục process ở background. Princeton University Neuroscience Institute cho thấy clutter cạnh tranh visual cortex, làm giảm ability to focus và process information. Một hộp đựng gọn gàng không chỉ "trông đẹp hơn" — nó giải phóng cognitive resources đang bị tiêu thụ vô ích.',
    detail: 'Hộp đựng là giải pháp 30 phút, một lần, vĩnh viễn — sau khi thiết lập, mỗi lần cất đồ vào hộp chỉ cần 5 giây. So với dây cáp rối mà bạn phải "process" mỗi lần nhìn vào bàn làm việc suốt 8h.',
    details: [
      'Pre-attentive processing và visual noise: não xử lý visual environment song song ở nhiều cấp độ — conscious attention chỉ là một phần nhỏ. Pre-attentive processing (automatic, không cần effort) liên tục scan và categorize mọi thứ trong visual field. Dây cáp rối, đồ lặt vặt = nhiều objects não phải process và decide "không liên quan" → suppress. Nhiều objects = nhiều suppression cycles = cognitive drain không nhận ra.',
      'Zeigarnik effect và open loops: não có xu hướng nhớ incomplete tasks và "ping" chúng liên tục (Bluma Zeigarnik, 1927). Đồ vật không có chỗ cố định là "open loops" — não implicit nhận ra "chưa được xử lý/cất đúng chỗ" và generate nhẹ nhàng nhưng liên tục background anxiety. Mỗi vật có chỗ cố định = closed loop = giảm background mental noise.',
      'Thiết lập hệ thống một lần, benefit mãi mãi: khác với dọn bàn (cần làm lại mỗi ngày), mua hộp đựng và thiết lập system là one-time effort. Sau khi mọi thứ có "home", cất đồ sau khi dùng chỉ cần 5 giây — không cần decide "để đây hay để đâu". Decision fatigue giảm mỗi ngày từ đó.',
      'Cable management cụ thể: (1) Velcro cable ties hoặc binder clips gộp dây cáp theo nhóm. (2) Hộp có ngăn (organizer box) cho: tai nghe, sạc, adapter, pin dự phòng. (3) Labeled drawers: không cần nhớ, chỉ cần đọc label. (4) Cable clips dán vào cạnh bàn để routing cáp gọn. Chi phí tổng: 50–200k từ Daiso, Muji, hoặc Shopee.',
      'Minimalism và decision fatigue: Steve Jobs mặc cùng một outfit mỗi ngày, Barack Obama chỉ mặc navy/grey suits — không phải quirk, mà là deliberate decision fatigue reduction. Mỗi quyết định nhỏ (để dây này đâu, cái này đâu) tiêu thụ mental bandwidth cùng pool với quyết định quan trọng. Môi trường gọn gàng = ít micro-decisions = nhiều bandwidth cho thứ quan trọng hơn.',
      'Maintenance system: hệ thống chỉ bền nếu cất đồ dễ như (hoặc dễ hơn) để bừa. Golden rule: "If it takes less than 5 seconds to put away, do it now." Hộp không nên có nắp phức tạp, hộp nên ở vị trí tiện tay, không cần gấp/xếp — chỉ cần thả vào. Friction Design cho cất đồ: càng dễ cất → càng ít bừa → môi trường luôn gọn.',
    ],
    points: [
      { icon: '🧠', label: 'Clutter = cognitive drain trên fMRI', note: 'Princeton: visual clutter cạnh tranh visual cortex — não process bất kể bạn chú ý hay không' },
      { icon: '🔄', label: 'Zeigarnik: đồ vô chỗ = open loops stress', note: 'Não implicit track items without "home" — background anxiety không nhận ra từ đồ lặt vặt' },
      { icon: '⚡', label: 'One-time setup, lifetime benefit', note: 'Khác với dọn bàn hàng ngày — thiết lập system một lần, cất đồ 5 giây mỗi lần' },
      { icon: '🎯', label: 'Ít micro-decisions = nhiều bandwidth', note: 'Jobs/Obama uniform principle: đồ có chỗ cố định → không cần decide → nhiều capacity cho thứ quan trọng' },
    ],
  },
  {
    icon: '🌡️', title: 'Máy đo nhiệt độ phòng ngủ', impact: 'Cao', time: '0 phút', cost: '< 200k',
    color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Máy Đo Nhiệt Độ — Biết Số Liệu Để Tối Ưu Giấc Ngủ',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhiệt độ phòng ngủ lý tưởng cho người lớn là 16–19°C theo National Sleep Foundation — lạnh hơn hầu hết mọi người nghĩ. Vấn đề: không ai biết phòng mình thực sự bao nhiêu độ. Máy đo nhiệt độ/độ ẩm mini (Xiaomi, 150–200k) cung cấp real-time data chính xác — bước đầu tiên để optimize là BIẾT baseline hiện tại là gì. Không thể cải thiện điều không đo được.',
    detail: 'Nhiều người ngủ trong phòng 26–28°C nghĩ mình ngủ "ổn" nhưng không biết mình đang miss 30–40% deep sleep. Máy đo nhiệt độ là data tool — sau khi có data, bạn có thể thực sự làm điều gì đó với nó.',
    details: [
      'Core body temperature và sleep stages: giấc ngủ sâu (slow-wave sleep, N3) xảy ra khi core body temperature (CBT) đạt đáy. Não cần giảm CBT ~1–2°C từ đỉnh ban ngày để enter deep sleep. Phòng lạnh giúp quá trình giảm CBT xảy ra nhanh hơn và sâu hơn — phòng nóng làm CBT không giảm đủ, deep sleep giảm. Đây là cơ chế sinh học giải thích tại sao nhiệt độ phòng có impact lớn đến sleep quality.',
      'REM sleep và nhiệt độ: não không regulate nhiệt độ trong REM sleep (giống cold-blooded animal trong REM). Trong phòng quá nóng, REM sleep giảm đáng kể vì core temp không được regulate. REM sleep quan trọng cho emotional processing, memory consolidation và creativity. Phòng nóng không chỉ giảm deep sleep — còn ảnh hưởng REM, làm giảm emotional stability và cognitive function ngày hôm sau.',
      'Độ ẩm và sleep quality: máy đo combo (nhiệt độ + độ ẩm) cũng cho thấy humidity — quan trọng không kém. Độ ẩm lý tưởng: 40–60%. <30%: niêm mạc khô, ho, thức giữa đêm. >70%: cảm giác nóng bức dù nhiệt độ thấp, dễ moldy. Ở VN mùa hè, phòng có thể 28°C + 85% humidity — combination tệ nhất cho giấc ngủ.',
      'Data-driven sleep optimization: Xiaomi/Mijia Bluetooth thermometer hygrometer (150–200k) log data theo thời gian, sync với app — bạn có thể thấy nhiệt độ phòng thay đổi như thế nào trong đêm. Nhiều người phát hiện phòng tăng nhiệt 2–3°C lúc 2–4 sáng khi máy lạnh tắt timer — giải thích tại sao hay thức lúc 3–4 sáng không rõ lý do.',
      'Cooling strategies không tốn tiền: nếu không có máy lạnh hoặc muốn tiết kiệm điện: (1) Quạt hướng vào cửa sổ đêm (draw cool air in). (2) Túi nước đá dưới chân giường (feet cooling = core temp giảm nhanh hơn). (3) Màn cửa dày để chặn nhiệt ban ngày. (4) Tắt tất cả electronics phát nhiệt trong phòng. (5) Ga trải giường cotton nhẹ (không dùng fleece mùa hè).',
      'Sleep temperature tracking và improvement: sau khi biết nhiệt độ phòng qua máy đo, set target: giảm 1–2°C so với hiện tại (nếu >22°C). Nhiều người giảm nhiệt độ phòng từ 26°C → 22°C báo cáo sleep quality cải thiện đáng kể trong 1–2 tuần đầu. Oura Ring, Withings và các sleep trackers khác cũng measure skin temperature — nhưng room thermometer là bước đầu tiên và rẻ nhất.',
    ],
    points: [
      { icon: '🌡️', label: '16–19°C = sweet spot giấc ngủ', note: 'Lạnh hơn hầu hết mọi người nghĩ — và hầu hết không biết phòng mình thực sự bao nhiêu độ' },
      { icon: '📊', label: 'Không thể optimize điều không đo được', note: '150–200k đổi lại data chính xác — bước đầu tiên của bất kỳ improvement nào là biết baseline' },
      { icon: '😴', label: 'Phòng nóng = giảm deep sleep + REM', note: 'CBT không giảm đủ → ít N3 (deep sleep); não không regulate nhiệt trong REM → REM giảm' },
      { icon: '💧', label: 'Độ ẩm 40–60% cũng quan trọng', note: 'Humidity cao (>70%) ở VN mùa hè gây nóng bức dù nhiệt thấp — máy đo combo cho cả hai số' },
    ],
  },
  {
    icon: '🔅', title: 'Cài Night Mode tự động 20:00', impact: 'Cao', time: '2 phút', cost: 'Miễn phí',
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Night Mode Tự Động — Passive Protection Cho Giấc Ngủ Tối',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Night mode (màu ấm/amber cho màn hình) filter blue light (450–490nm) — bước sóng ức chế melatonin mạnh nhất. Schedule tự động lúc 20:00 là Friction Design hoàn hảo: thay đổi xảy ra passive, không cần nhớ, không cần willpower. Thiết lập một lần (2 phút) → bảo vệ melatonin production mỗi tối mãi mãi. Không perfect như tắt màn hình hoàn toàn, nhưng tốt hơn rất nhiều so với màn hình trắng lạnh lúc 22:00.',
    detail: 'Night mode không thể thay thế việc tắt màn hình hoàn toàn sau 21:00, nhưng là backstop quan trọng: cho những ngày không thể tránh dùng màn hình buổi tối, night mode giảm thiệt hại đáng kể. Passive protection > active willpower.',
    details: [
      'Blue light và melatonin: võng mạc có tế bào cảm quang đặc biệt (ipRGC) chứa melanopsin — cực kỳ nhạy với ánh sáng xanh 480nm. Ban đêm, khi ánh sáng xanh hit ipRGC, não nhận tín hiệu "còn ban ngày" → ức chế pineal gland → giảm melatonin. Màn hình điện thoại/laptop phát ánh sáng xanh đáng kể ngay cả ở độ sáng thấp. Night mode giảm blue light output 30–80% tùy mức độ, giúp melatonin production ít bị gián đoạn hơn.',
      'Schedule timing quan trọng: lý tưởng nhất là bắt đầu 2–3h trước giờ ngủ dự định. Nếu ngủ 23:00, set night mode từ 20:00–20:30. Melatonin onset tự nhiên xảy ra ~2h trước sleep time — cần bảo vệ window này. 20:00 schedule đủ early cho hầu hết people với sleep time 22:00–23:30.',
      'Cài đặt cụ thể trên các thiết bị: iOS: Settings → Display & Brightness → Night Shift → Scheduled (sunset to sunrise hoặc custom 20:00–07:00), intensity cao nhất (most warm). Android: Settings → Display → Night Light hoặc Blue Light Filter → Schedule. macOS: System Preferences → Displays → Night Shift. Windows: Settings → System → Display → Night Light. Tất cả đều miễn phí, built-in.',
      'Blue light glasses như alternative: blue light blocking glasses (kính filter blue light) có thể đeo khi dùng màn hình buổi tối — option cho người không muốn thay đổi màu màn hình. Amber-tinted glasses (đỏ/vàng đậm) hiệu quả hơn clear "blue light glasses" thông thường. Nghiên cứu University of Toronto (2015) cho thấy amber glasses đêm cải thiện sleep quality tương đương với không có bright light exposure.',
      'Kết hợp với dim lighting: night mode trên màn hình + giảm độ sáng màn hình xuống 30–40% + tắt overhead lights (dùng đèn warm white floor lamp) là combination mạnh nhất. Ba lớp bảo vệ: màu ánh sáng (warm) + độ sáng (thấp) + nguồn ánh sáng (cục bộ, không overhead). Tổng chi phí: setup 2 phút + bóng warm white 50–100k.',
      'Limitation của night mode: nghiên cứu Harvard 2018 gây tranh cãi: green light cũng ức chế melatonin, và warm/amber light ở high intensity vẫn có thể gây suppression. Night mode không thể hoàn toàn replace "không dùng màn hình". Nhưng practical reality: nhiều người PHẢI dùng màn hình buổi tối — night mode + dim là harm reduction strategy tốt nhất có thể trong constraints thực tế.',
    ],
    points: [
      { icon: '🌙', label: 'Filter 30–80% blue light tùy intensity', note: 'Không perfect, nhưng passive protection tốt hơn rất nhiều so với màn hình trắng lạnh lúc 22:00' },
      { icon: '⚙️', label: 'Cài một lần, bảo vệ mỗi tối', note: 'Passive Friction Design: xảy ra tự động — không cần nhớ, không cần willpower tối nào' },
      { icon: '⏰', label: '20:00 = 2–3h trước sleep time', note: 'Melatonin onset tự nhiên ~2h trước khi ngủ — bảo vệ window này là quan trọng nhất' },
      { icon: '🥽', label: 'Amber glasses: alternative không cần đổi màn hình', note: 'Kính amber-tinted (đỏ/vàng) hiệu quả như không có bright light exposure — option cho màn hình pro' },
    ],
  },
];

const IMPACT_COLOR = { 'Cao': '#10b981', 'Trung bình': '#f59e0b' };

const WEEKS = [
  {
    week: 'Tuần 1', focus: 'Phòng Ngủ',
    changes: ['Cất điện thoại ra ngoài', 'Nhiệt độ 18°C', 'Rèm tối hoàn toàn'],
    color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Tuần 1: Tối Ưu Phòng Ngủ — Nền Tảng Của Mọi Thứ',
    img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuần 1 tập trung vào phòng ngủ vì lý do chiến lược: giấc ngủ là nền tảng của mọi hành vi sức khỏe khác. Thiếu ngủ làm giảm willpower, tăng cortisol, impair prefrontal cortex — khiến tất cả thay đổi khác (ăn uống, tập luyện, tâm trí) trở nên khó khăn hơn gấp đôi. Giải quyết phòng ngủ trước = đặt foundation vững chắc cho 3 tuần còn lại.',
    detail: 'Ba thay đổi tuần 1 được chọn vì: (1) impact cao nhất trên giấc ngủ, (2) không tốn tiền hoặc rất rẻ, (3) có thể thực hiện ngay hôm nay mà không cần chuẩn bị. Mỗi thay đổi loại bỏ một "sleep saboteur" lớn nhất trong phòng ngủ người Việt điển hình.',
    details: [
      'Cất điện thoại — tại sao đây là ưu tiên số 1: điện thoại trong phòng ngủ gây hại qua 3 cơ chế đồng thời: blue light ức chế melatonin, notifications gây micro-arousals giữa đêm, và temptation to scroll trước khi ngủ. Nghiên cứu 2020 (Sleep Medicine RCT): chỉ cất điện thoại ra ngoài phòng ngủ = sleep duration tăng 43 phút/đêm. Không có thay đổi lifestyle nào khác tạo ra improvement nhanh và lớn như vậy.',
      'Nhiệt độ 18°C — không phải comfort, là physiology: nhiều người nghĩ ngủ ấm (24–26°C) là thoải mái. Thực ra, deep sleep (N3) đòi hỏi core body temperature giảm ~1–2°C từ đỉnh ban ngày. Phòng nóng ngăn CBT giảm đủ → ít deep sleep → thức dậy mệt dù ngủ đủ giờ. 18–19°C là nhiệt độ phòng ngủ được nghiên cứu nhiều nhất và consistently cho kết quả tốt nhất về sleep quality. Mùa hè VN khó đạt — ít nhất target <22°C.',
      'Rèm tối — ánh sáng ảnh hưởng giấc ngủ ngay cả qua mí mắt nhắm: eyelids không block ánh sáng hoàn toàn — ánh đèn đường, đèn xe, ánh sáng sáng sớm đi qua mí mắt nhắm đủ để kích hoạt ipRGC và ức chế melatonin nhẹ. Nghiên cứu cho thấy ngủ trong phòng tối hoàn toàn liên quan đến: melatonin production cao hơn, ít awakenings hơn, sáng dậy cortisol thấp hơn (ít bị "giật mình" bởi ánh sáng). Rèm blackout (200–500k) là investment một lần.',
      'Kỳ vọng tuần 1 — những gì sẽ xảy ra: ngày 1–3: có thể cảm thấy "thiếu" điện thoại, khó ngủ hơn một chút (digital withdrawal nhẹ). Ngày 4–7: sleep onset bắt đầu nhanh hơn, ít thức giữa đêm hơn. Sau 7 ngày: đa số người báo cáo cảm giác ngủ sâu hơn và dậy tỉnh táo hơn — không phải placebo, là physiology cải thiện thực sự.',
      'Tuần 1 tạo nền tảng cho tuần 2–4 thế nào: ngủ tốt hơn → cortisol sáng thấp hơn → buổi sáng tuần 2 (ly nước, ánh sáng, no-phone) cảm thấy natural hơn. Não được nghỉ ngơi đủ → prefrontal cortex hoạt động tốt hơn → intention và discipline cho tuần 3–4 tốt hơn. Đây là lý do phòng ngủ được ưu tiên đầu tiên — không phải ngẫu nhiên.',
      'Sustainability check: sau 7 ngày, đánh giá: điện thoại có thực sự ra ngoài mỗi đêm không? Nhiệt độ có duy trì được không? Rèm có đủ tối không? Thay đổi nào khó nhất? Tuần 1 xong = không nên dừng — tiếp tục maintain 3 thay đổi này khi sang tuần 2. Mỗi tuần là "stack thêm", không phải "thay thế". Sau 4 tuần, bạn có 12 thay đổi cùng hoạt động.',
    ],
    points: [
      { icon: '😴', label: '+43 phút ngủ chỉ từ cất điện thoại', note: 'RCT: không có thay đổi nào khác — đây là ROI cao nhất của bất kỳ sleep intervention nào' },
      { icon: '🌡️', label: '18–19°C để deep sleep tối ưu', note: 'Phòng nóng ngăn CBT giảm đủ → ít N3 → thức dậy mệt dù đủ giờ ngủ' },
      { icon: '🌑', label: 'Tối hoàn toàn: ánh sáng qua mí mắt nhắm', note: 'eyelids không block hoàn toàn — ánh đèn đường đủ ức chế melatonin nhẹ suốt đêm' },
      { icon: '📈', label: 'Nền tảng cho 3 tuần còn lại', note: 'Ngủ tốt → cortisol thấp → willpower cao → mọi thay đổi khác dễ hơn gấp đôi' },
    ],
  },
  {
    week: 'Tuần 2', focus: 'Buổi Sáng',
    changes: ['Ly nước bên giường', 'Đèn sáng 5 phút đầu', 'Không phone 30 phút'],
    color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Tuần 2: Thiết Kế Buổi Sáng — Kiểm Soát Ngày Từ Giờ Đầu Tiên',
    img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Buổi sáng là "keystone period" — cách bạn bắt đầu ngày ảnh hưởng đến trạng thái mental, hormonal và behavioral của cả ngày còn lại. Ba thay đổi tuần 2 tác động đến 3 hệ thống sinh học khác nhau: hydration (phục hồi nước sau ngủ), circadian reset (ánh sáng mạnh sáng sớm), và cognitive priming (bảo vệ PFC trong 30 phút đầu). Tất cả là passive hoặc gần passive — không cần thêm thời gian, chỉ cần thay đổi trình tự.',
    detail: 'Ba thay đổi tuần 2 được thiết kế để "stack" lên nhau: thức dậy → uống nước (ly đã có sẵn) → ra chỗ có ánh sáng (cửa sổ/ban công) → 30 phút không phone (điện thoại đã ở phòng khác từ tuần 1). Friction gần bằng 0 — tuần 1 đã setup sẵn điều kiện cho tuần 2.',
    details: [
      'Ly nước bên giường — tại sao là thay đổi đầu tiên: sau 7–9h không uống nước, mild dehydration (1%) giảm concentration 12% và làm tasks feel harder. Uống 400–500ml ngay khi thức là cách nhanh nhất restore hydration và kickstart các hệ thống cơ thể. Friction Design: ly đã sẵn sàng bên giường (chuẩn bị tối hôm trước) = không cần quyết định, không cần đi lấy, vươn tay là uống — trở thành reflex sau 2–3 tuần.',
      'Ánh sáng mạnh 5 phút — reset đồng hồ sinh học hàng ngày: ánh sáng mạnh (>1000 lux nắng ngoài trời, hoặc SAD lamp 10.000 lux) trong 30 phút đầu là tín hiệu mạnh nhất reset circadian clock. Kích hoạt Cortisol Awakening Response (CAR), amplify serotonin synthesis, suppress melatonin residual. 5 phút ở cửa sổ hoặc ban công (không cần trực tiếp nhìn mặt trời) đủ để bắt đầu process này. Đây là "free productivity hack" mà hầu hết người bỏ qua.',
      'Không phone 30 phút — bảo vệ PFC trong golden window: Prefrontal Cortex (PFC) cần 20–30 phút để fully activate sau sleep inertia. Kiểm tra điện thoại trước khi PFC sẵn sàng = xử lý notifications, social, news khi não chưa có phòng vệ nhận thức → reactive mindset từ đầu ngày. 30 phút phone-free = PFC có thời gian warm up + DMN (Default Mode Network) hoạt động tự nhiên → sáng tạo và clarity tốt hơn buổi sáng.',
      'Kỳ vọng tuần 2 — những gì sẽ xảy ra: ngày 1–2: cảm giác buổi sáng ít vội vàng hơn, ít cảm giác "reactive" ngay từ đầu ngày. Ngày 3–5: năng lượng buổi sáng cải thiện đáng kể (kết hợp hydration + ánh sáng + PFC protection). Ngày 6–7: buổi sáng bắt đầu feel có chủ đích — bạn control agenda của ngày thay vì notifications control bạn.',
      'Stack với tuần 1: điện thoại đã ở phòng khác (tuần 1) → "không phone 30 phút" của tuần 2 gần như tự động xảy ra — không cần thêm willpower, chỉ cần không đi lấy điện thoại ngay. Rèm tối (tuần 1) giúp ngủ sâu hơn → dậy refreshed hơn → buổi sáng tuần 2 bắt đầu từ trạng thái tốt hơn. Compound effect bắt đầu rõ ràng từ tuần 2.',
      'Thiết lập cụ thể tối hôm trước: (1) Đặt ly nước 500ml bên giường. (2) Quyết định chỗ nhận ánh sáng sáng (cửa sổ nào, ban công hay không). (3) Điện thoại đã ở phòng khác (tuần 1 đã làm). Sáng hôm sau: wake → uống nước → đến chỗ có ánh sáng tự nhiên 5–10 phút → ăn sáng/vận động nhẹ. Không phone cho đến khi hoàn thành routine sáng.',
    ],
    points: [
      { icon: '💧', label: 'Uống nước trước → concentration +12%', note: 'Dehydration nhẹ sau ngủ giảm performance — vươn tay uống trước khi làm bất cứ điều gì' },
      { icon: '☀️', label: '5 phút ánh sáng = CAR amplification', note: 'Cortisol Awakening Response mạnh hơn, serotonin tăng, circadian reset — không thứ gì thay thế được' },
      { icon: '🧠', label: 'PFC warm-up trong 30 phút đầu', note: 'Không phone = PFC có thời gian activate đầy đủ → intentional mindset thay vì reactive từ sáng sớm' },
      { icon: '🔗', label: 'Tuần 1 setup sẵn điều kiện cho tuần 2', note: 'Điện thoại đã ngoài phòng → no-phone sáng gần tự động. Compound effect bắt đầu rõ từ tuần này.' },
    ],
  },
  {
    week: 'Tuần 3', focus: 'Làm Việc',
    changes: ['Dọn bàn mỗi sáng', 'Nút tai/headphone', 'Cây xanh trên bàn'],
    color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Tuần 3: Tối Ưu Không Gian Làm Việc — Môi Trường Cho Deep Work',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đến tuần 3, phòng ngủ và buổi sáng đã được tối ưu. Tuần này chuyển focus sang không gian làm việc — nơi bạn dành 6–10h mỗi ngày. Ba thay đổi tuần 3 tác động đến 3 yếu tố cản trở deep work phổ biến nhất: visual clutter (bàn lộn xộn), acoustic pollution (tiếng ồn), và cognitive fatigue (thiếu thiên nhiên). Tất cả ba thay đổi này có thể thực hiện song song — không cần chọn thứ tự.',
    detail: 'Không gian làm việc có tác động lớn hơn hầu hết mọi người nhận ra. Nghiên cứu cho thấy môi trường làm việc vật lý ảnh hưởng đến chất lượng output nhiều hơn "trying harder". Tuần 3 là đầu tư vào infrastructure cho tất cả công việc trí tuệ bạn làm.',
    details: [
      'Dọn bàn mỗi sáng — pre-task ritual và cognitive reset: Princeton fMRI study cho thấy clutter cạnh tranh visual cortex, làm giảm focus và processing speed. Dọn bàn 5 phút sáng không chỉ loại bỏ cognitive drag — nó còn tạo "pre-task ritual" tạo clear psychological boundary giữa casual time và focused work time. Nghiên cứu rituals (Michael Norton, Harvard): rituals cụ thể trước performance giảm anxiety và tăng consistency — ngay cả rituals "không liên quan" đến task.',
      'Nút tai/headphone — kiểm soát acoustic environment: tiếng ồn nền gây hại ngay cả khi bạn quen và không chú ý (pre-attentive processing). Đặc biệt: speech-modulated noise (tiếng người nói chuyện) não không thể fully habituate — phải liên tục "check" xem có gì mới không. Foam earplugs (NRR 33 dB, 20–50k) giảm noise hiệu quả hơn hầu hết ANC headphones. White noise apps (free) hoặc brown noise mask ambient noise tốt nếu không dùng earplugs.',
      'Cây xanh trên bàn — Attention Restoration Theory: Rachel và Stephen Kaplan (University of Michigan) cho thấy thiên nhiên (kể cả cây nhỏ trong phòng) kích hoạt "fascination mode" — effortless attention giúp phục hồi directed attention bị depleted bởi work. Sau 10–15 phút nhìn cây, directed attention được restore đáng kể. Exeter meta-analysis (2.000 nhân viên): 1 cây trong tầm nhìn → productivity +15%, creativity +45%.',
      'Kỳ vọng tuần 3 — những gì sẽ xảy ra: ngày 1–2: bàn sạch sáng đầu tiên tạo cảm giác fresh start; nút tai giúp vào focus nhanh hơn. Ngày 3–5: bắt đầu notice khi không có những thứ này — bằng chứng chúng đang work. Ngày 6–7: work sessions feel qualitatively khác — ít friction, ít context switches, ít "tại sao mình ngồi đây mà không làm được gì" frustration.',
      'Stack với tuần 1–2: ngủ tốt (tuần 1) + buổi sáng tốt (tuần 2) → đến bàn làm việc ở trạng thái cognitive tốt nhất có thể. Bàn sạch (tuần 3) + nút tai + cây = môi trường không làm depleted thêm. Three-layer optimization: sleep (recovery), morning (activation), workspace (protection of cognitive resources). Compound effect đạt maximum từ tuần 3.',
      'Cụ thể hóa tuần 3: (1) Dọn bàn 5 phút đầu mỗi buổi sáng làm việc — tất cả không liên quan cất vào hộc/hộp đựng (đã mua tuần trước). (2) Nút tai hoặc noise-canceling trên bàn sẵn sàng — đeo khi bắt đầu phiên focus. (3) Mua 1 cây nhỏ (lưỡi hổ/trầu bà/ZZ plant, <100k) đặt trên hoặc cạnh bàn ở tầm nhìn. Không cần làm cùng một lúc — từng thứ một trong 7 ngày là đủ.',
    ],
    points: [
      { icon: '🧹', label: 'Dọn bàn = pre-flow ritual + cognitive reset', note: 'Ritual trước performance giảm anxiety, tăng consistency — và loại bỏ visual drain từ clutter' },
      { icon: '🎧', label: 'Nút tai foam: NRR 33 dB, 50k, không cần sạc', note: 'Giảm noise hiệu quả hơn hầu hết ANC headphones — loại bỏ speech noise không thể habituate' },
      { icon: '🌿', label: 'Cây nhỏ = restore directed attention', note: 'ART: 10–15 phút nhìn cây → fascination mode → directed attention phục hồi, không cần effort' },
      { icon: '⚡', label: 'Compound từ 3 tuần: sleep + morning + workspace', note: 'Từ tuần 3, tất cả 9 thay đổi hoạt động cùng lúc — cognitive performance ở mức tốt nhất có thể' },
    ],
  },
  {
    week: 'Tuần 4', focus: 'Buổi Tối',
    changes: ['Night mode 20:00', 'Sách thay điện thoại', 'Mùi lavender'],
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Tuần 4: Thiết Kế Wind-Down — Chuẩn Bị Cho Giấc Ngủ Từ 2 Tiếng Trước',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giấc ngủ tốt không bắt đầu khi bạn nằm xuống giường — nó bắt đầu 2 tiếng trước. Tuần 4 thiết kế "wind-down period" (20:00–22:00) thông qua 3 cơ chế: giảm blue light (night mode), thay hoạt động stimulating bằng relaxing (sách thay điện thoại), và tạo olfactory sleep cue (mùi lavender). Ba thay đổi này cộng hưởng với phòng ngủ đã được tối ưu từ tuần 1 — tạo vòng lặp hoàn chỉnh từ tối đến sáng.',
    detail: 'Tuần 4 là tuần cuối nhưng hoàn thiện hệ thống. Sau 4 tuần, bạn có 12 thay đổi môi trường hoạt động cùng nhau — không cần willpower để duy trì vì mỗi thay đổi đã được thiết kế để self-sustaining qua Friction Design và habit stacking.',
    details: [
      'Night mode 20:00 — passive blue light protection: schedule tự động (1 lần cài, mãi mãi active) đảm bảo màn hình chuyển warm/amber sau 20:00 mà không cần nhớ hay quyết định. Giảm blue light output 30–80% tùy intensity → ít ức chế melatonin → melatonin onset tự nhiên hơn lúc 21:00–22:00. Không perfect như không dùng màn hình, nhưng là backstop quan trọng cho những tối không thể tránh dùng màn hình muộn.',
      'Sách thay điện thoại — replacing dopamine loop với natural sleep cue: điện thoại (social, video, news) có variable reward structure — não không biết phần thưởng tiếp theo là gì, nên liên tục kéo scroll dù mắt mỏi. Sách không có variable reward — nội dung có kết, mắt mỏi dần, buồn ngủ tự nhiên sau 20–30 phút. University of Sussex: đọc sách 6 phút giảm stress 68% (nhanh hơn nghe nhạc, uống trà). Sách vật lý = không có blue light + natural sleep onset.',
      'Mùi lavender — olfactory sleep cue qua classical conditioning: khứu giác là giác quan duy nhất kết nối trực tiếp với limbic system (amygdala, hippocampus) mà không qua thalamus — giải thích tại sao mùi trigger memory và emotion mạnh và nhanh hơn bất kỳ giác quan nào. Linalool trong lavender có tác dụng anxiolytic trực tiếp qua GABA receptor. Nhưng mạnh hơn là conditioning: dùng lavender đều đặn trước ngủ → mùi trở thành Pavlovian sleep cue — não học "mùi này = sắp ngủ" và bắt đầu wind-down tự động.',
      'Kỳ vọng tuần 4 — những gì sẽ xảy ra: ngày 1–3: buổi tối feel "chậm hơn" theo nghĩa tốt — ít stimulation, calm hơn. Ngày 4–7: sleep onset (thời gian từ nằm xuống đến ngủ) ngắn hơn đáng kể. Sau tuần 4 đầy đủ: wake-ups giữa đêm giảm; sáng dậy feeling more rested. Đây là kết quả của 4 tuần stack — không phải chỉ tuần 4, mà là toàn bộ hệ thống 12 thay đổi hoạt động cùng nhau.',
      'Hoàn thiện hệ thống sau 30 ngày: sau 30 ngày, nhìn lại 12 thay đổi. Cái nào stick? Cái nào chưa? Không expect 100% — 8/12 thay đổi được duy trì nhất quán là excellent result. Tiếp theo: đánh giá sleep quality (subjective: cảm giác khi dậy, energy level 3h sau khi thức) và identify bottleneck tiếp theo. Hệ thống môi trường không bao giờ "hoàn thành" — luôn có thứ để tinh chỉnh.',
      'Lavender cụ thể — cách sử dụng: (1) Essential oil diffuser (150–300k) với 3–5 giọt lavender oil, bật 30 phút trước ngủ. (2) Lavender pillow spray (xịt gối trước khi nằm xuống). (3) Lavender sachets trong vỏ gối. (4) Cây lavender thật trên bàn đầu giường (nếu có điều kiện). Consistency quan trọng hơn method — dùng cùng một loại mùi, cùng thời điểm, mỗi tối để conditioning xảy ra sau 2–3 tuần.',
    ],
    points: [
      { icon: '🌙', label: 'Night mode: passive, một lần cài, mãi mãi', note: 'Schedule tự động 20:00 = zero willpower mỗi tối — backstop cho những ngày phải dùng màn hình muộn' },
      { icon: '📚', label: 'Sách: natural sleep onset sau 20–30 phút', note: 'Không có variable reward → não không có lý do tiếp tục → buồn ngủ tự nhiên. Stress giảm 68% sau 6 phút đọc.' },
      { icon: '💜', label: 'Lavender → Pavlovian sleep cue', note: 'Conditioning: mùi quen + ngủ đều → mùi đó trigger wind-down tự động sau 2–3 tuần dùng' },
      { icon: '🔄', label: '12 thay đổi, 4 tuần, 0 willpower', note: 'Mỗi thay đổi được thiết kế self-sustaining — toàn bộ hệ thống chạy automatic sau khi setup' },
    ],
  },
];

const PRINCIPLES = [
  {
    icon: '✅', title: 'Friction Design',
    desc: 'Giảm "ma sát" cho hành vi tốt (đặt thảm tập ngay trước giường), tăng ma sát cho hành vi xấu (cất TV vào tủ).',
    color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Friction Design — Thiết Kế Ma Sát Thay Đổi Hành Vi',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Friction Design (thiết kế ma sát) là nguyên tắc hành vi học đơn giản nhất và mạnh nhất: giảm số bước/effort cần thiết để thực hiện hành vi tốt, tăng số bước cho hành vi xấu. Nghiên cứu của BJ Fogg (Stanford) và James Clear cho thấy thêm chỉ 20 giây vào một hành vi (ví dụ: để điện thoại phòng khác = phải đi lấy) giảm tần suất hành vi đó đến 30–50%. Ngược lại, giảm 20 giây cho hành vi tốt làm tăng tần suất tương tự.',
    detail: 'Friction Design không dựa vào willpower hay motivation — những thứ có hạn và dao động theo ngày. Thay vào đó, nó thay đổi cấu trúc môi trường để hành vi tốt trở thành "con đường ít kháng cự nhất" (path of least resistance). Não bộ luôn chọn con đường dễ nhất — Friction Design hack điều này có lợi.',
    details: [
      'Neuroscience của least effort: não bộ tiến hóa để tiết kiệm năng lượng — mỗi quyết định tiêu thụ glucose và mental bandwidth. Khi một hành vi đòi hỏi nhiều bước, não tự động resist nó (cognitive load quá cao). Friction Design giảm cognitive load của hành vi tốt xuống mức "auto-pilot" — không cần decision-making, chỉ cần một bước đơn giản.',
      'Hai chiều của Friction Design: (1) Giảm ma sát cho hành vi tốt: thảm yoga đặt cạnh giường → thức dậy vấp phải → tập ngay. Sách để trên bàn → thấy → đọc. Rau xanh để ở tầm mắt trong tủ lạnh → mở ra thấy ngay → ăn rau. (2) Tăng ma sát cho hành vi xấu: cất TV vào tủ có khóa → lấy phải mở khóa → bớt xem. Để điện thoại ở phòng khác khi ngủ → phải đi bộ lấy → bớt scroll đêm.',
      'The 2-Minute Rule của James Clear: thiết kế mọi hành vi tốt để có thể bắt đầu trong 2 phút. Không phải "tập gym 1 tiếng" — mà là "đi đến gym (2 phút)". Không phải "thiền 20 phút" — mà là "ngồi xuống đệm thiền (2 phút)". Khi đã bắt đầu, momentum tự nhiên đẩy tiếp. Friction Design = làm cho bước đầu tiên này dễ nhất có thể.',
      'Environment design vs willpower: nghiên cứu của Roy Baumeister cho thấy willpower là resource hữu hạn — cạn dần theo ngày. Người thành công không có willpower mạnh hơn — họ có môi trường tốt hơn, không đặt mình vào tình huống cần dùng willpower. Người ít ăn kẹo không phải vì "kỷ luật" — mà vì không để kẹo ở nhà.',
      'Friction audit: đi qua một ngày của bạn và liệt kê: hành vi tốt nào bạn hay bỏ qua? Có bao nhiêu bước để thực hiện nó? Hành vi xấu nào bạn hay làm dù không muốn? Có bao nhiêu bước? Giảm 1–2 bước cho hành vi tốt và thêm 2–3 bước cho hành vi xấu thường đủ để tạo ra sự thay đổi có ý nghĩa mà không cần motivation.',
      'Stacking Friction Design với identity: Friction Design hoạt động tốt nhất khi kết hợp với identity-based habits (James Clear). "Tôi là người chạy bộ buổi sáng" + giày chạy đặt ngay cửa ra vào = friction thấp + identity reinforcement. Mỗi lần thực hiện hành vi dễ dàng vì friction thấp, bạn đang bầu chọn cho identity của mình — củng cố vòng lặp tích cực.',
    ],
    points: [
      { icon: '⏱️', label: '+20 giây giảm hành vi 30–50%', note: 'Để điện thoại phòng khác = thêm 20 giây = scroll đêm giảm 40%' },
      { icon: '🧠', label: 'Không cần willpower', note: 'Môi trường tốt > kỷ luật — người thành công có môi trường tốt, không phải ý chí mạnh hơn' },
      { icon: '⚡', label: '2-Minute Rule: bắt đầu trong 2 phút', note: 'Thiết kế bước đầu tiên dễ nhất có thể — momentum tự đẩy tiếp' },
      { icon: '🔍', label: 'Friction audit định kỳ', note: 'Liệt kê hành vi tốt/xấu → đếm số bước → giảm/tăng ma sát tương ứng' },
    ],
  },
  {
    icon: '👁️', title: 'Visual Cues',
    desc: 'Những gì bạn thấy → bạn nghĩ đến → bạn làm. Để sách nơi dễ thấy, cất điện thoại khỏi tầm mắt.',
    color: '#f43f5e', rgb: '244,63,94',
    modalTitle: 'Visual Cues — Môi Trường Trực Quan Định Hướng Hành Vi',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Visual cues (tín hiệu thị giác) là trigger mạnh nhất để kích hoạt hành vi — mạnh hơn cả intention và reminder app. Não bộ xử lý thông tin thị giác nhanh hơn bất kỳ giác quan nào khác (11 triệu bits/giây so với 40 bits conscious processing). "Những gì bạn thấy" là môi trường kích hoạt liên tục suốt ngày — thiết kế visual environment đúng = thiết kế hành vi của bạn.',
    detail: 'Environmental psychology cho thấy con người phần lớn hành động theo context và visual cues xung quanh, không phải theo "ý định". Thay đổi những gì bạn nhìn thấy thay đổi những gì bạn làm — không cần self-discipline.',
    details: [
      'Implementation intentions và visual anchors: nghiên cứu của Peter Gollwitzer cho thấy "implementation intentions" (IF-THEN plans) kết hợp với visual cues tăng follow-through đến 91% so với chỉ có intention. "Khi tôi thấy thảm yoga cạnh giường (visual cue), tôi sẽ tập 10 phút ngay" hiệu quả hơn rất nhiều so với "Tôi sẽ tập yoga buổi sáng".',
      'Cue-routine-reward loop: theo Charles Duhigg (The Power of Habit), mọi habit đều có cấu trúc: Cue (tín hiệu) → Routine (hành vi) → Reward (phần thưởng). Visual cues là loại cue mạnh nhất vì não xử lý nó gần như tức thời và tự động. Thiết kế visual cue đúng = thiết kế cue mạnh nhất của habit loop.',
      'Visibility và salience: không phải mọi thứ bạn thấy đều tạo cue như nhau — salience (độ nổi bật) quan trọng. Sách đặt trên giá sách (thấy) khác sách đặt trên gối (salience cao hơn). Rau để ở tầm mắt tủ lạnh khác rau để ở ngăn dưới (salience cao hơn → ăn nhiều hơn 25%). Thiết kế visual cue = tăng salience của hành vi tốt, giảm salience của hành vi xấu.',
      'Out of sight, out of mind: nghiên cứu Cornell "Wansink Kitchen" cho thấy người để kẹo trên bàn bếp ăn trung bình nặng hơn 8–10 lbs so với người để trong tủ kín. Người để điện thoại trên bàn trong meeting nhớ ít hơn 20% nội dung — ngay cả khi điện thoại tắt (chỉ cần nhìn thấy là đủ gây distraction). Visual cue không cần conscious attention để ảnh hưởng hành vi.',
      'Thiết kế visual environment cụ thể: (Hành vi tốt) Đặt sách/kindle trên gối → đọc trước ngủ. Đặt vitamin trên bàn ăn sáng → uống mỗi sáng. Đặt bình nước 2L trên bàn làm việc → uống đủ nước. Đặt giày chạy ở cửa → chạy buổi sáng. (Hành vi xấu) Cất điện thoại vào hộc bàn → ít check. Cất remote TV vào tủ → ít xem. Để snack không healthy trong tủ kín trên cao → ít ăn.',
      'Visual cues và accountability: visual tracking (habit tracker dán tường, whiteboard goals, jar với marble đếm ngày liên tiếp) tạo external accountability thông qua visual cues. Thấy chuỗi ngày không gián đoạn trên tracker → không muốn phá vỡ chuỗi (don\'t break the chain — Jerry Seinfeld method). Visual progress = motivation duy trì hành vi.',
    ],
    points: [
      { icon: '👁️', label: '11 triệu bits/s xử lý thị giác', note: 'Não xử lý visual nhanh nhất — visual cue ảnh hưởng hành vi ngay cả khi không chú ý' },
      { icon: '📊', label: 'Salience: tầm mắt = 25% ăn nhiều hơn', note: 'Rau ở tầm mắt tủ lạnh → ăn nhiều hơn 25% so với để ngăn dưới' },
      { icon: '📱', label: 'Điện thoại trên bàn = nhớ kém 20%', note: 'Chỉ cần THẤY điện thoại (dù tắt) là đủ gây distraction measurable' },
      { icon: '📆', label: 'Visual tracker = don\'t break the chain', note: 'Thấy chuỗi habit days → không muốn phá vỡ → habit duy trì tự nhiên' },
    ],
  },
  {
    icon: '🔄', title: 'Habit Stacking',
    desc: 'Ghép thói quen mới vào môi trường/thói quen cũ. "Sau khi pha cà phê, tôi ngồi thiền 5 phút trên ghế bếp."',
    color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Habit Stacking — Xây Thói Quen Mới Trên Nền Cũ',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Habit Stacking là kỹ thuật của BJ Fogg (Tiny Habits) và James Clear (Atomic Habits): ghép thói quen mới vào ngay sau/trước một thói quen cũ đã vững chắc. Công thức: "Sau khi [THÓI QUEN CŨ], tôi sẽ [THÓI QUEN MỚI]." Neural pathway của thói quen cũ đã rất mạnh — khi kích hoạt, nó kéo theo thói quen mới, giảm effort cần thiết để bắt đầu xuống gần bằng 0.',
    detail: 'Habit Stacking hoạt động vì nó tận dụng "associative memory" — não bộ liên kết các sự kiện xảy ra cùng nhau. Sau đủ repetitions, não không còn cần nhắc nhở để làm thói quen mới — nó tự động xảy ra khi thói quen cũ kết thúc, giống như domino.',
    details: [
      'Neurological basis — associative learning: mỗi khi hai hành vi xảy ra liên tiếp, synapse giữa các neurons đại diện cho chúng được strengthen (Hebbian learning: "neurons that fire together, wire together"). Sau 30–50 repetitions, connection đủ mạnh để một hành vi tự động trigger hành vi kia — không cần conscious decision. Habit stacking exploit cơ chế này.',
      'Thói quen neo (anchor habits): để habit stacking hiệu quả, "anchor habit" (thói quen cũ làm cue) phải là thói quen đã hoàn toàn automatic — không cần suy nghĩ. Pha cà phê, đánh răng, ngồi vào bàn làm việc, ăn trưa, tắt máy tính buổi tối. Đây là những điểm "neo" tự nhiên trong ngày — mỗi điểm neo có thể gắn 1 thói quen mới.',
      'Nguyên tắc tiny: thói quen mới trong habit stack phải nhỏ hơn nhiều so với mục tiêu dài hạn. "Thiền 20 phút" → quá lớn để stack. "Ngồi yên 2 phút sau khi pha cà phê" → hoàn hảo. Tiny habit dễ thực hiện nhất quán và xây dựng momentum. Sau 2–4 tuần, tự nhiên muốn mở rộng ("2 phút cảm thấy tốt, thêm 3 phút nữa").',
      'Chain stacking — morning/evening routine: từ nhiều tiny habits stack lại tạo thành morning/evening routine hoàn chỉnh mà không cần discipline. Ví dụ morning stack: Tắt alarm → ra khỏi giường ngay (stack 1) → uống nước (stack 2) → mở rèm (stack 3) → 5 phút thở cơ hoành (stack 4) → 10 phút đọc sách (stack 5). Sau 6–8 tuần, toàn bộ chain xảy ra auto-pilot.',
      'Environment integration — location stacking: kết hợp Habit Stacking với visual cues và specific location. "Ngồi vào ghế bếp sau khi pha cà phê" hiệu quả hơn "thiền ở đâu đó sau khi pha cà phê" — location cụ thể tạo additional cue. Não associate location với hành vi (giải thích tại sao làm việc trên giường inefficient — não không associate giường với "work mode").',
      'Troubleshooting habit stacks thất bại: stack thất bại thường vì: (1) anchor habit không đủ automatic — chọn anchor khác. (2) Thói quen mới quá lớn — tiny-fy thêm. (3) Sequence không natural — test xem hành vi mới có phù hợp với ngữ cảnh anchor không. "Sau khi tắt máy tính, tôi tập 30 phút gym" — không natural vì gym cần travel. "Sau khi tắt máy tính, tôi thay đồ gym" — natural, chỉ 1 bước.',
    ],
    points: [
      { icon: '🔗', label: '"Sau khi X, tôi sẽ Y" — formula đơn giản nhất', note: 'Tận dụng neural pathway cũ đã mạnh để kéo thói quen mới theo không tốn effort' },
      { icon: '🧠', label: 'Neurons fire together → wire together', note: '30–50 repetitions đủ để thói quen mới tự động xảy ra sau anchor habit' },
      { icon: '⚡', label: 'Tiny habit: < 2 phút để stack', note: 'Bắt đầu nhỏ — "ngồi yên 2 phút" dễ stack hơn "thiền 20 phút" nhiều lần' },
      { icon: '📍', label: 'Location cụ thể tăng hiệu quả', note: '"Ghế bếp sau cà phê" > "đâu đó sau cà phê" — location = thêm 1 visual cue' },
    ],
  },
];

function EnvModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
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
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước
            </button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
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

export default function LifestyleEnvironmentPage() {
  const [activeZone, setActiveZone] = useState('morning');
  const [principleIdx, setPrincipleIdx] = useState(null);
  const [zoneItemIdx, setZoneItemIdx] = useState(null);
  const [quickWinIdx, setQuickWinIdx] = useState(null);
  const [weekIdx, setWeekIdx] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes cEnvOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: cEnvOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const zone = ENV_ZONES.find(z => z.id === activeZone);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/c" className="inline-flex items-center gap-2 text-base text-muted hover:text-teal-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Lối Sống Khỏe
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🏠</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Thiết Kế Môi Trường</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>C7 · Environment Design</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Hành vi tốt không chỉ từ ý chí mạnh — mà từ môi trường được thiết kế để làm cho hành vi tốt dễ hơn. Mỗi thay đổi nhỏ trong không gian sống là một "thiết kế hành vi" vô hình nhưng mạnh mẽ.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop" alt="Environment Design" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>Môi trường quyết định hành vi · 3 không gian sống</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Core principle */}
      <RevealBlock className="mb-12">
        <div className="rounded-2xl p-5 border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
          <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>Nguyên Tắc Cốt Lõi — Click để xem chi tiết</div>
          <div className="grid md:grid-cols-3 gap-4">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title}
                className="rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                style={{ borderColor: `rgba(${p.rgb},0.2)`, background: `rgba(${p.rgb},0.06)` }}
                onClick={() => setPrincipleIdx(i)}>
                <div className="text-3xl mb-2">{p.icon}</div>
                <div className="text-lg font-bold mb-1" style={{ color: p.color }}>{p.title}</div>
                <div className="text-base text-muted leading-relaxed mb-3">{p.desc}</div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ color: p.color, background: `rgba(${p.rgb},0.12)` }}>Chi tiết →</span>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* 3 Environment zones */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Không Gian Cần Thiết Kế</h2>
        <p className="text-muted text-lg mb-6">Tối ưu hóa từng giai đoạn trong ngày bắt đầu từ môi trường xung quanh bạn.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {ENV_ZONES.map(z => (
            <button key={z.id} onClick={() => setActiveZone(z.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium transition-all border ${activeZone === z.id ? 'text-white' : 'text-muted border-border hover:border-rose-500/30'}`} style={{ background: activeZone === z.id ? z.color : undefined, borderColor: activeZone === z.id ? z.color : undefined }}>
              <span>{z.icon}</span>{z.title.replace('Môi Trường ', '')}
            </button>
          ))}
        </div>

        {zone && (
          <div className="rounded-2xl border p-5 md:p-6" style={{ borderColor: `${zone.color}30`, background: `${zone.color}06` }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-4xl">{zone.icon}</span>
              <div>
                <div className="text-xl font-bold text-text">{zone.title}</div>
                <div className="text-base font-bold uppercase tracking-widest mt-0.5" style={{ color: zone.color }}>{zone.subtitle}</div>
              </div>
            </div>
            <p className="text-sm text-muted mb-3 opacity-60">Click vào từng mục để xem chi tiết khoa học</p>
            <div className="space-y-3">
              {zone.items.map((item, i) => (
                <div key={i}
                  className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
                  style={{ borderColor: `rgba(${item.rgb},0.18)`, background: `rgba(${item.rgb},0.05)` }}
                  onClick={() => setZoneItemIdx(i)}>
                  <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold" style={{ color: item.color }}>{item.title}</div>
                    <div className="text-base text-muted leading-relaxed mt-0.5">{item.desc}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0 self-start mt-1"
                    style={{ color: item.color, background: `rgba(${item.rgb},0.12)` }}>Chi tiết →</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </RevealBlock>

      {/* Quick wins cards */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>8 Thay Đổi Nhanh, Tác Động Lớn</h2>
        <p className="text-muted text-lg mb-2">Bắt đầu với những gì dễ nhất — ngay hôm nay, không cần kế hoạch phức tạp.</p>
        <p className="text-sm text-muted mb-6 opacity-60">Click vào từng mục để xem chi tiết khoa học</p>
        <div className="space-y-2">
          {QUICK_WINS.map((w, i) => (
            <div key={i}
              className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg"
              style={{ borderColor: `rgba(${w.rgb},0.2)`, background: `rgba(${w.rgb},0.05)` }}
              onClick={() => setQuickWinIdx(i)}>
              <span className="text-2xl shrink-0">{w.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="text-base font-bold" style={{ color: w.color }}>{w.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-sm font-bold shrink-0" style={{ background: `${IMPACT_COLOR[w.impact]}20`, color: IMPACT_COLOR[w.impact] }}>{w.impact}</span>
              <span className="text-sm text-muted shrink-0 hidden sm:block">{w.time}</span>
              <span className="text-sm text-muted shrink-0 hidden sm:block">{w.cost}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-lg shrink-0" style={{ color: w.color, background: `rgba(${w.rgb},0.12)` }}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* 30-day challenge */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thử Thách 30 Ngày</h2>
        <p className="text-muted text-lg mb-2">Thực hiện từng thay đổi theo tuần — không làm tất cả một lúc.</p>
        <p className="text-sm text-muted mb-6 opacity-60">Click vào từng tuần để xem kế hoạch chi tiết</p>
        <div className="grid md:grid-cols-4 gap-3">
          {WEEKS.map((w, i) => (
            <div key={w.week}
              className="rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              style={{ borderColor: `rgba(${w.rgb},0.25)`, background: `rgba(${w.rgb},0.06)` }}
              onClick={() => setWeekIdx(i)}>
              <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: w.color }}>{w.week}</div>
              <div className="text-lg font-bold text-text mb-3">{w.focus}</div>
              <ul className="space-y-1 mb-4">
                {w.changes.map((c, ci) => (
                  <li key={ci} className="flex items-start gap-2 text-base text-muted">
                    <span style={{ color: w.color }}>→</span>{c}
                  </li>
                ))}
              </ul>
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: w.color, background: `rgba(${w.rgb},0.12)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── 30-day challenge modal — outside all RevealBlocks ── */}
      {weekIdx !== null && (
        <EnvModal
          item={WEEKS[weekIdx]}
          idx={weekIdx}
          total={WEEKS.length}
          onClose={() => setWeekIdx(null)}
          onPrev={() => setWeekIdx(i => Math.max(0, i - 1))}
          onNext={() => setWeekIdx(i => Math.min(WEEKS.length - 1, i + 1))}
          hasPrev={weekIdx > 0}
          hasNext={weekIdx < WEEKS.length - 1}
        />
      )}

      {/* ── Quick wins modal — outside all RevealBlocks ── */}
      {quickWinIdx !== null && (
        <EnvModal
          item={QUICK_WINS[quickWinIdx]}
          idx={quickWinIdx}
          total={QUICK_WINS.length}
          onClose={() => setQuickWinIdx(null)}
          onPrev={() => setQuickWinIdx(i => Math.max(0, i - 1))}
          onNext={() => setQuickWinIdx(i => Math.min(QUICK_WINS.length - 1, i + 1))}
          hasPrev={quickWinIdx > 0}
          hasNext={quickWinIdx < QUICK_WINS.length - 1}
        />
      )}

      {/* ── Zone item modal — outside all RevealBlocks ── */}
      {zoneItemIdx !== null && zone && (
        <EnvModal
          item={zone.items[zoneItemIdx]}
          idx={zoneItemIdx}
          total={zone.items.length}
          onClose={() => setZoneItemIdx(null)}
          onPrev={() => setZoneItemIdx(i => Math.max(0, i - 1))}
          onNext={() => setZoneItemIdx(i => Math.min(zone.items.length - 1, i + 1))}
          hasPrev={zoneItemIdx > 0}
          hasNext={zoneItemIdx < zone.items.length - 1}
        />
      )}

      {/* ── Principles modal — outside all RevealBlocks ── */}
      {principleIdx !== null && (
        <EnvModal
          item={PRINCIPLES[principleIdx]}
          idx={principleIdx}
          total={PRINCIPLES.length}
          onClose={() => setPrincipleIdx(null)}
          onPrev={() => setPrincipleIdx(i => Math.max(0, i - 1))}
          onNext={() => setPrincipleIdx(i => Math.min(PRINCIPLES.length - 1, i + 1))}
          hasPrev={principleIdx > 0}
          hasNext={principleIdx < PRINCIPLES.length - 1}
        />
      )}

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/c/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Kỹ Thuật Thở
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          Tất cả Module Lối Sống →
        </Link>
        <Link to="/pillar/c/checklist" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Checklist Hằng Ngày
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
