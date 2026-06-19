import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#ec4899';
const RGB = '236,72,153';
const ORBIT_ID = 'd-journal-orbit-kf';
const ORBIT_CLASS = 'd-journal-orbit-ring';
const PROP = '--d-journal-orbit-angle';

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

const BENEFIT_MODALS = [
  {
    icon: '🧠', color: COLOR, rgb: RGB,
    modalTitle: 'Giải Phóng Não Bộ — Cognitive Offloading',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Zeigarnik Effect (1927): não bộ không thể "buông" những việc chưa hoàn thành — chúng chiếm working memory liên tục. Viết ra = signal "đã ghi lại" cho não → cho phép buông bỏ và giải phóng bandwidth nhận thức cho việc quan trọng hơn.',
    detail: 'Working memory của con người có giới hạn — chỉ giữ được 4–7 items cùng lúc (Miller, 1956). Khi lo âu, những "open loops" (việc chưa giải quyết, lo lắng chưa xử lý) chiếm hết working memory. Viết nhật ký là hành động cognitive offloading — chuyển tải từ RAM não sang "ổ cứng bên ngoài".',
    details: [
      'Zeigarnik Effect và "chạy vòng lặp": Bluma Zeigarnik (1927) phát hiện người phục vụ nhớ đơn hàng chưa thanh toán rõ hơn đơn đã xong. Não dùng cùng cơ chế cho lo lắng — duy trì "unfinished tasks" trong working memory với mục đích nhắc nhở. Kết quả: rumination loop không tự dừng.',
      'Cognitive offloading và Working Memory: Nghiên cứu của Seli et al. (2016): viết ra những "open loops" trước task = giảm mind-wandering 30% và tăng performance trên task tiếp theo. Não được signal rằng thứ đó đã được ghi nhận → có thể release nó khỏi active maintenance.',
      'Expressive writing và rumination: Pennebaker & Beall (1986) — nghiên cứu landmark: viết về sự kiện căng thẳng 15–20 phút/ngày × 4 ngày → giảm health center visits 43% trong 6 tháng tiếp theo. Cơ chế: narrative processing chuyển raw emotion thành coherent story → giảm intrusive thoughts.',
      'Worry journaling và anxiety: Ứng dụng cụ thể: "Worry time journaling" — dành 10 phút buổi tối viết ra mọi lo lắng. Não học được: "lo lắng có chỗ để xử lý → không cần lo lúc 2 giờ sáng." CBT clinicians dùng kỹ thuật này như component chuẩn trong trị anxiety.',
      'Viết tay vs gõ phím: fMRI studies: handwriting kích hoạt broader neural network hơn typing — bao gồm motor cortex, sensory areas và visual processing. Handwriting slower pace cho phép deeper processing. "Slow writing = deeper thinking" — xu hướng generative AI không thể thay thế.',
      'Pre-sleep journaling và "unfinished business": Baddeley & Logie: working memory interference là nguyên nhân chính của "overthinking before bed." Viết to-do list và lo lắng trước ngủ (Scullin et al., 2018) — nhóm viết to-do list ngủ nhanh hơn 9 phút so với nhóm viết sự kiện đã xong.',
    ],
    points: [
      { icon: '🔄', label: 'Zeigarnik Effect', note: 'Não không buông việc chưa xong — viết ra = signal hoàn thành' },
      { icon: '💾', label: 'Cognitive Offload', note: 'Chuyển lo lắng từ RAM não sang "ổ cứng ngoài"' },
      { icon: '😴', label: 'Ngủ Nhanh +9 Phút', note: 'Scullin 2018: viết to-do trước ngủ → giảm sleep onset' },
      { icon: '📉', label: '-43% Health Visits', note: 'Pennebaker 1986: viết cảm xúc 4 ngày → ít bệnh hơn' },
    ],
  },
  {
    icon: '🔍', color: COLOR, rgb: RGB,
    modalTitle: 'Hiểu Bản Thân Hơn — Pattern Recognition & Self-Awareness',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Narrative identity theory (Dan McAdams): con người hiểu bản thân qua câu chuyện họ kể về chính mình. Journaling là process kiến tạo narrative — từ raw experience rời rạc → coherent story → self-understanding. Người viết nhật ký đều đặn có self-concept clarity cao hơn đáng kể.',
    detail: 'Pattern recognition trong journaling xảy ra qua hai tầng: (1) nhận ra trong khi viết — khi putting words to experience, não làm "sense-making" và connections nổi lên, (2) nhận ra khi đọc lại — thấy recurring themes, triggers, reactions mà không thể thấy khi trong khoảnh khắc đó.',
    details: [
      'Self-Concept Clarity (SCC): Campbell et al. (1996): SCC — mức độ rõ ràng về bản thân — tương quan mạnh với self-esteem, emotional stability và lower neuroticism. Journaling tăng SCC bằng cách forced articulation: khi phải viết ra "tôi là ai, tôi muốn gì, tôi phản ứng thế nào" → self-concept trở nên rõ nét hơn.',
      'Emotional pattern recognition: Viết về cùng một loại situation nhiều lần → bắt đầu nhận ra signature pattern của mình: "Mình hay phản ứng defensive khi bị chỉ trích bởi người thân, nhưng thoải mái hơn với người lạ." Đây là level self-awareness mà therapy cũng hướng đến — và journaling làm được mà không cần therapist.',
      'Trigger mapping: "Điều gì kích hoạt cảm xúc này?" trong nhật ký cảm xúc là bước đầu của trigger awareness. Sau 2–4 tuần, patterns nổi lên: "Mình stress nhất vào thứ Hai sáng, sau khi đọc email." — information này cho phép proactive coping thay vì reactive.',
      'Narrative processing và meaning-making: Neimeyer (2000): sau loss hoặc trauma, người có thể viết coherent narrative về sự kiện phục hồi tốt hơn những người không thể. Journaling giúp chuyển "điều khủng khiếp đó xảy ra với mình" → "đây là điều đó dạy mình và mình đã thay đổi thế này."',
      'Values clarification: Viết về moments bạn cảm thấy fulfilled vs drained giúp reverse-engineer core values. "Mình vui nhất khi làm điều gì? Mình bực nhất khi ai làm điều gì?" — 30 ngày journaling thường reveal 3–5 core values rõ ràng hơn bất kỳ personality test nào.',
      'Metacognitive awareness: Journaling là externalized metacognition — đặt thoughts ra ngoài để quan sát thay vì sống trong đó. "Tôi đang có suy nghĩ rằng..." thay vì "Tôi đang nghĩ..." — khoảng cách nhỏ này là nền tảng của mindfulness và cognitive defusion trong ACT.',
    ],
    points: [
      { icon: '🧩', label: 'Narrative Identity', note: 'McAdams: tự hiểu qua câu chuyện kể về bản thân' },
      { icon: '🗺️', label: 'Trigger Mapping', note: '2–4 tuần → patterns nổi lên: ai/gì/khi nào gây stress' },
      { icon: '💎', label: 'Values Clarification', note: '30 ngày → 3–5 core values rõ hơn bất kỳ personality test' },
      { icon: '🔭', label: 'Metacognition', note: '"Tôi đang có suy nghĩ rằng..." — khoảng cách quan sát' },
    ],
  },
  {
    icon: '💜', color: COLOR, rgb: RGB,
    modalTitle: 'Xử Lý Cảm Xúc Khỏe — Affect Labeling & Emotional Release',
    img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Affect labeling (đặt tên cho cảm xúc): fMRI studies — Matthew Lieberman (UCLA, 2007): khi đặt tên cho cảm xúc bằng lời ("tôi đang tức giận"), amygdala activation giảm ngay lập tức và PFC activation tăng. "Nói ra để não bộ bình tĩnh" không phải ẩn dụ — đây là neuroscience.',
    detail: 'Viết nhật ký là phiên bản chậm và sâu hơn của affect labeling — thay vì chỉ đặt tên, bạn còn mô tả, contextualize và make sense of cảm xúc. Điều này engage PFC (prefrontal cortex) mạnh hơn, tạo "top-down regulation" của amygdala — giảm cường độ cảm xúc một cách có ý thức.',
    details: [
      'Amygdala và prefrontal cortex: Amygdala = alarm system cảm xúc, phản ứng trong 50ms. PFC = "brake pedal" lý trí, chậm hơn nhưng có thể down-regulate amygdala khi được engage. Viết về cảm xúc = engage PFC với task có structure → PFC "busy with task" giúp modulate amygdala response.',
      'Pennebaker\'s expressive writing research: 35+ năm nghiên cứu của James Pennebaker (UT Austin): viết về traumatic/stressful experiences 15–20 phút × 3–4 ngày có effects: giảm anxiety và depression symptoms, cải thiện immune function (T-cell activity tăng), giảm doctor visits, cải thiện sleep quality.',
      'Suppression vs expression: Gross (1998): emotional suppression (không được biểu đạt cảm xúc) có hại cho cả psychological và physical health — tăng cortisol, tăng cardiovascular reactivity, giảm social connection. Viết nhật ký là safe expression outlet — không harm relationships, không cần timing đúng.',
      'Distancing effect: Kross et al. (2014): viết về experience ở third-person ("anh ấy cảm thấy...") hoặc self-distanced ("nhìn từ xa...") giúp process emotion mạnh hơn là first-person ("mình cảm thấy..."). Viết nhật ký tự nhiên tạo khoảng cách này — retrospective perspective vs experiencing in the moment.',
      'Self-compassion through writing: Kristin Neff: self-compassion letter (viết thư an ủi bản thân về điều mình đang khổ sở, như viết cho bạn thân) là can thiệp có effect size lớn nhất cho self-esteem và giảm shame. Template "Nhật Ký Ngày Thất Bại" trong trang này implement kỹ thuật này.',
      'Emotional granularity: Lisa Feldman Barrett: người có emotional granularity cao (phân biệt được nhiều cảm xúc chi tiết) có better emotional regulation. Viết nhật ký tăng emotional granularity — thay vì "tôi cảm thấy tệ", bạn học distinguish: thất vọng, cô đơn, lo âu, chán nản, bị phản bội — mỗi cái cần xử lý khác nhau.',
    ],
    points: [
      { icon: '🧬', label: 'Amygdala Giảm Ngay', note: 'Lieberman 2007: đặt tên cảm xúc → amygdala xuống tức thì' },
      { icon: '🛡️', label: 'Miễn Dịch Tăng', note: 'Pennebaker: viết 4 ngày → T-cell activity tăng đo được' },
      { icon: '💌', label: 'Self-Compassion Letter', note: 'Thư an ủi bản thân — effect size lớn nhất cho shame' },
      { icon: '🎨', label: 'Emotional Granularity', note: 'Barrett: phân biệt cảm xúc chi tiết = regulate tốt hơn' },
    ],
  },
];

const TEMPLATE_MODALS = [
  {
    icon: '📅', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Nhật Ký 5 Dòng — Khoa Học Của Lòng Biết Ơn',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Emmons & McCullough (2003, JPSP): viết 3 điều biết ơn mỗi tuần × 9 tuần → well-being tăng 25%, triệu chứng thể chất giảm, ngủ thêm 30 phút/đêm so với nhóm viết về sự kiện trung tính. Effect kéo dài sau khi ngừng can thiệp.',
    detail: 'Nhật Ký 5 Dòng kết hợp 3 kỹ thuật evidence-based: gratitude practice (câu 1–2), stress disclosure (câu 3), implementation intention (câu 4) và positive self-talk (câu 5). Mỗi câu hỏi được thiết kế để activate một neural mechanism cụ thể.',
    details: [
      'Câu 1 — Gratitude (biết ơn): Ghi ra điều biết ơn force brain scan environment cho positive events thay vì default scan cho threats (negativity bias). Dopamine release khi nhớ lại positive experience. Không cần điều lớn — Emmons: specific, small gratitude ("bữa cơm ngon") có effect tương đương điều lớn.',
      'Câu 2 — Positive event logging: Chủ động ghi nhận "điều đã tốt" (What Went Well — WWW) là kỹ thuật của Martin Seligman (Positive Psychology). WWW exercise × 3 ngày → giảm depressive symptoms và tăng happiness trong 6 tháng — một trong những interventions có effect size lớn nhất trong positive psychology.',
      'Câu 3 — Stress disclosure: Ghi stress KHÔNG phải để giải quyết ngay — mà để externalize và "close the loop." Não được signal "đã ghi nhận" → giảm intrusive rumination. Pennebaker: ngay cả chỉ đặt tên cho stressor (không cần phân tích) đã giảm physiological arousal.',
      'Câu 4 — Implementation intention: "Ưu tiên #1 ngày mai" là dạng implementation intention — "Tôi sẽ làm X vào lúc Y ở nơi Z." Gollwitzer (1999): implementation intentions tăng goal completion rate 2–3x so với chỉ đặt mục tiêu chung chung. Đêm trước là thời điểm tối ưu — consolidation trong ngủ.',
      'Câu 5 — Self-talk/self-compassion: "Nói với bản thân như với người bạn thân" là core của Kristin Neff\'s self-compassion framework. Common humanity + non-judgment + kindness. Người tự nói chuyện với mình theo cách này có cortisol thấp hơn và resilience cao hơn trong adversity.',
      'Tổng thể: 5 câu × 5 phút mỗi ngày activate gratitude network, close open loops, set next-day direction và build self-relationship. Đây không phải "viết nhật ký" thông thường — đây là structured psychological intervention hàng ngày với từng câu hỏi có mục đích rõ ràng.',
    ],
    points: [
      { icon: '🧠', label: 'Biết Ơn +25% Well-being', note: 'Emmons 2003: 9 tuần → well-being tăng đo được' },
      { icon: '😴', label: 'Ngủ +30 Phút/Đêm', note: 'Gratitude practice cải thiện sleep duration và quality' },
      { icon: '🎯', label: 'Implementation Intention', note: 'Câu 4: tăng goal completion 2–3x (Gollwitzer 1999)' },
      { icon: '💌', label: 'Self-Compassion', note: 'Câu 5: Neff framework — cortisol thấp hơn khi adversity' },
    ],
  },
  {
    icon: '😤', color: '#a855f7', rgb: '168,85,247',
    modalTitle: 'Nhật Ký Cảm Xúc — Somatic Markers & Emotional Literacy',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Antonio Damasio (Somatic Marker Hypothesis): cảm xúc là "readout" của cơ thể — không phải trạng thái tâm trí thuần túy mà là pattern tổng hợp từ signals cơ thể (heart rate, gut, muscle tension). Câu 2 "Cơ thể đang phản ứng thế nào?" là bước đầu của somatic awareness.',
    detail: 'Nhật Ký Cảm Xúc theo cấu trúc của Dialectical Behavior Therapy (DBT) emotion regulation module — identify emotion → identify body experience → identify trigger → identify need → identify action. Cấu trúc này từ Marsha Linehan\'s DBT, được nghiên cứu kỹ cho emotional dysregulation.',
    details: [
      'Câu 1 — Emotion identification và labeling: Naming emotion (affect labeling) kích hoạt PFC và giảm amygdala — Lieberman 2007. Nhưng quan trọng hơn: cần emotional granularity — phân biệt "tức giận" vs "thất vọng" vs "bị phản bội" vs "xấu hổ." Mỗi cảm xúc cần xử lý khác nhau; nhầm lẫn → sai approach.',
      'Câu 2 — Body awareness (interoception): "Ngực tức, vai căng, tay run" là somatic markers — signals cơ thể giúp xác định cảm xúc và quyết định. Damasio: người mất khả năng cảm nhận cơ thể (anosognosia) không thể đưa ra quyết định tốt dù IQ nguyên vẹn. Cơ thể là navigation system của emotion.',
      'Câu 3 — Trigger identification: Phân biệt sự kiện (fact) và interpretation (story). "Anh ấy không reply tin nhắn" (fact) vs "Anh ấy ghét mình" (story). CBT: phần lớn emotional suffering đến từ interpretation, không phải event. Viết ra trigger giúp tách fact khỏi story.',
      'Câu 4 — Need identification: Cảm xúc là signal của unmet need — tức giận = boundary bị xâm phạm, cô đơn = need for connection, lo âu = need for safety/certainty. Xác định need (câu 4) quan trọng hơn là phân tích cảm xúc — vì need chỉ hướng đến action có thể làm gì.',
      'Câu 5 — Action step: "Bước nhỏ nhất" — dù chỉ "thở sâu 3 lần" — là bridge giữa emotion regulation và action. Tránh paralysis bằng cách giảm barrier của action step xuống tối thiểu. Self-efficacy xây dựng qua small wins liên tục.',
      'DBT và emotion dysregulation: Template này phù hợp đặc biệt với người có emotional sensitivity cao (high reactive), lịch sử trauma, hoặc pattern của emotional eating/substance use. Không phải diagnosis tool — nhưng consistent practice tạo emotional awareness là foundation của emotional health.',
    ],
    points: [
      { icon: '🔬', label: 'Somatic Markers', note: 'Damasio: cảm xúc là pattern của cơ thể, không phải tâm trí' },
      { icon: '🎨', label: 'Emotional Granularity', note: 'Phân biệt cảm xúc chi tiết = regulate tốt hơn (Barrett)' },
      { icon: '🎯', label: 'Fact vs Story', note: 'CBT: phân tách event thực vs interpretation của mình' },
      { icon: '💡', label: 'Need Identification', note: 'Cảm xúc = signal của unmet need → biết cần làm gì' },
    ],
  },
  {
    icon: '💪', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Nhật Ký Ngày Thất Bại — Growth Mindset & Self-Compassion',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f6c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Carol Dweck (Stanford): người có growth mindset xử lý failure như information, không phải identity threat. Nhật Ký Ngày Thất Bại là structured practice chuyển hóa failure response từ fixed ("mình tệ") sang growth ("mình học được gì") — cùng sự kiện, khác narrative, khác outcome.',
    detail: 'Template này kết hợp 3 frameworks: After Action Review (AAR) từ US Army để extract learning, Self-Compassion Letter (Kristin Neff) để xử lý shame, và Implementation Intention để prevent repeat. Cấu trúc ngăn hai failure modes: self-flagellation (quá khắt khe) và self-deception (bỏ qua bài học).',
    details: [
      'Câu 1 — Event-only description: Chỉ ghi sự kiện, không interpretation. "Mình fail bài kiểm tra" không phải "Mình ngu." Kỹ thuật này từ Cognitive Defusion trong ACT — tạo khoảng cách giữa sự kiện và ý nghĩa mình gán cho nó. Failure có thể là dữ liệu; "mình là kẻ thất bại" là interpretation có thể thay đổi.',
      'Câu 2 — Learning extraction: "Tôi đã học được gì?" — forced learning extraction prevents failure from being "just bad." After Action Review (US Army AAR protocol): sau mỗi mission, dù thành công hay thất bại, luôn có học review. Organizations dùng AAR liên tục có learning rate cao hơn nhiều.',
      'Câu 3 — Bright spots: Tìm "điều đã làm tốt dù trong hoàn cảnh đó" activate appreciative inquiry — tìm gì đang hoạt động thay vì chỉ tập trung vào vấn đề. Chip Heath (Switch): tìm "bright spots" và nhân rộng hiệu quả hơn chỉ fix problems. Xây confidence từ những gì đã đúng.',
      'Câu 4 — Behavior change: "Ngày mai tôi sẽ làm khác thế nào?" chuyển từ rumination (nghĩ về quá khứ) sang orientation (hướng về tương lai). Implementation intention cụ thể ("Tôi sẽ X thay vì Y khi Z xảy ra") có evidence mạnh cho behavior change so với chỉ "cố gắng hơn."',
      'Câu 5 — Self-forgiveness: Kristin Neff: self-compassion không phải tự mãn hay excuse — nó là acknowledge khó khăn + recognize common humanity + be kind to self. People với self-compassion cao hơn thực ra có accountability cao hơn — vì không cần defensive ego protection. Tự tha thứ = release để move forward.',
      'Post-traumatic growth (PTG): Tedeschi & Calhoun: một số người sau adversity không chỉ recover mà còn grow — tìm thấy meaning, strength, connection mới. PTG không xảy ra tự động — cần deliberate narrative processing. Nhật Ký Ngày Thất Bại là low-stakes practice cho PTG mechanism.',
    ],
    points: [
      { icon: '🌱', label: 'Growth Mindset', note: 'Dweck: failure là information, không phải identity' },
      { icon: '🪖', label: 'After Action Review', note: 'US Army AAR: extract learning từ mọi outcome' },
      { icon: '💌', label: 'Self-Compassion', note: 'Neff: accountability cao hơn khi không cần defend ego' },
      { icon: '✨', label: 'Post-Traumatic Growth', note: 'Tedeschi: narrative processing → meaning tìm thấy' },
    ],
  },
  {
    icon: '🍽️', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Nhật Ký Ăn Uống Cảm Xúc — HALT & Interoceptive Eating',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Emotional eating (ăn không do đói sinh lý mà do cảm xúc) ảnh hưởng 60–75% phụ nữ và 40% nam giới theo meta-analysis. HALT framework: Hungry, Angry, Lonely, Tired — 4 trạng thái phổ biến nhất bị nhầm thành "đói." Câu 3 trong template này là HALT check.',
    detail: 'Nhật Ký Ăn Uống Cảm Xúc không phải food diary — không đếm calories, không judge thực phẩm. Mục tiêu là tăng interoceptive awareness về hunger/satiety signals và disconnect ăn uống khỏi emotional regulation. Jean Kristeller (Mindful Eating) và DBT skill "HALT" là nền tảng.',
    details: [
      'Câu 1 — Craving specificity: "Tôi đang muốn ăn gì?" — ghi cụ thể (pizza, kem, bánh mì) có thể phân biệt physical hunger vs emotional hunger. Physical hunger thường flexible (ăn gì cũng được), emotional hunger thường specific (PHẢI là món này). Awareness của specificity là bước đầu.',
      'Câu 2 — Hunger rating (0–10): Nếu đói < 3 (không đói), nhưng vẫn muốn ăn → emotional hunger. Hunger scale train interoceptive accuracy — khả năng "đọc" signals cơ thể. Người mất kết nối interoception (do diet culture, childhood "clean your plate") cần rebuild này từ từ.',
      'Câu 3 — Emotional trigger: Ghi cảm xúc và sự kiện trước khi muốn ăn giúp identify emotional eating pattern. HALT: Hungry (thực sự)? Angry/Anxious? Lonely? Tired? — mỗi cái cần approach khác: food chỉ address Hungry, không address ba cái kia.',
      'Câu 4 — True need: "Tôi thực sự cần gì?" redirect từ eating behavior đến underlying need. Lonely → cần kết nối (gọi điện cho bạn). Tired → cần nghỉ ngơi (nằm 20 phút). Stressed → cần discharge (tập thở). Ăn không satisfy những needs này — chỉ tạm thời numb chúng.',
      'Câu 5 — Post-meal awareness: Ghi lại cảm giác sau ăn (không phán xét) build feedback loop. "Mình cảm thấy tội lỗi và đầy bụng" vs "Mình cảm thấy no vừa và thoải mái" — không phải moralistic judgment mà là data collection. Overtime, patterns nổi lên cho phép informed choices.',
      'Mindful Eating intervention results: Kristeller & Wolever (2011): Mindfulness-Based Eating Awareness Training (MB-EAT) × 9 tuần giảm binge eating episodes 70%, giảm emotional eating scores 28%. Không có dietary restriction nào trong protocol — kết quả từ awareness dẫn đến natural regulation.',
    ],
    points: [
      { icon: '🛑', label: 'HALT Framework', note: 'Hungry/Angry/Lonely/Tired — 4 trạng thái bị nhầm là đói' },
      { icon: '📊', label: 'Hunger Scale 0–10', note: 'Train interoceptive accuracy — đọc signals cơ thể' },
      { icon: '💡', label: 'True Need', note: 'Food chỉ address đói thật — không address cảm xúc' },
      { icon: '📉', label: '-70% Binge Episodes', note: 'Kristeller 2011: MB-EAT 9 tuần, không diet restriction' },
    ],
  },
  {
    icon: '⚡', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Phiên Bản Siêu Ngắn — Minimum Viable Journaling',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'BJ Fogg (Tiny Habits, Stanford): hành vi = Motivation × Ability × Prompt. Khi motivation thấp, ability phải cực cao (barrier cực thấp). "3 câu, 3 từ mỗi câu, 60 giây" = minimum viable practice — đủ để duy trì habit chain ngay cả trong những ngày tệ nhất.',
    detail: '"Phiên Bản Siêu Ngắn" không phải phiên bản thấp kém hơn — đây là chiến lược strategic. Ngày bạn làm 3 câu thay vì bỏ hẳn là ngày bạn giữ được streak và neural pathway của habit. Consistency > intensity trong habit formation.',
    details: [
      'Minimum Viable Practice (MVP): Concept từ startup world — minimum viable product đủ để test và ship. Applied to habits: "minimum viable practice" đủ để maintain habit signal ngay cả khi không có energy/motivation cho full version. 60 giây journaling giữ habit alive cho những ngày bình thường.',
      'Câu 1 — Emotion in 1–3 words: Tốc ký cảm xúc ("mệt, lo, ổn") activate affect labeling mechanism đủ để có tác dụng. Không cần phân tích — chỉ cần đặt tên. EEG studies cho thấy ngay cả minimal labeling tạo PFC engagement và amygdala modulation.',
      'Câu 2 — Need in 1–3 words: "Nghỉ ngơi, kết nối, một mình" — tốc độ ghi minimal nhưng activate need-awareness. Chỉ biết mình cần gì là already valuable — ngay cả khi không làm được ngay. Awareness → intention → eventual action.',
      'Câu 3 — Next smallest step: Một action cụ thể tối giản — "uống nước", "thở sâu 3 lần", "nhắn tin cho X." Implementation science: specific micro-actions có follow-through rate cao hơn nhiều so với vague intentions. "Sẽ cố gắng hơn" = 0 behavior change. "Sẽ uống 1 ly nước ngay bây giờ" = action.',
      'Habit stacking và anchor: Fogg: attach tiny habit vào existing habit như anchor. "Sau khi đánh răng, tôi viết 3 câu siêu ngắn." Anchor behavior đã stable → new behavior piggybacking on neural pathway đã có. Không cần nhớ, không cần motivation riêng.',
      'Những ngày "không muốn": Điều quan trọng nhất không phải chất lượng của buổi journaling — mà là không break streak. Research on habit formation: streak interruption là nguyên nhân chính của habit failure. "Never miss twice" (James Clear) — Siêu Ngắn là insurance policy cho rule này.',
    ],
    points: [
      { icon: '⚡', label: 'Tiny Habits', note: 'Fogg: barrier thấp → behavior xảy ra ngay cả khi ít motivation' },
      { icon: '🔗', label: 'Habit Stacking', note: 'Attach vào existing routine — không cần willpower riêng' },
      { icon: '📅', label: 'Streak > Quality', note: 'Never miss twice — siêu ngắn giữ streak sống' },
      { icon: '🎯', label: 'Micro-Action', note: 'Action cụ thể 1 bước — follow-through cao hơn nhiều' },
    ],
  },
];

const TEMPLATES = [
  { id: 'daily', icon: '📅', label: 'Nhật Ký 5 Dòng', color: '#ec4899', lines: [
    { q: '1. Hôm nay tôi biết ơn điều gì?', ph: 'Một điều nhỏ cũng đủ...' },
    { q: '2. Điều gì đã diễn ra tốt?', ph: 'Dù nhỏ cũng tính...' },
    { q: '3. Điều gì gây căng thẳng?', ph: 'Không phán xét, chỉ ghi lại...' },
    { q: '4. Ưu tiên #1 của ngày mai?', ph: 'Chỉ 1 việc thôi...' },
    { q: '5. Tôi muốn nói gì với bản thân?', ph: 'Như nói với người bạn thân...' },
  ]},
  { id: 'stress', icon: '😤', label: 'Nhật Ký Cảm Xúc', color: '#a855f7', lines: [
    { q: '1. Tôi đang cảm thấy gì?', ph: 'Mô tả cảm xúc cụ thể...' },
    { q: '2. Cơ thể đang phản ứng thế nào?', ph: 'Ngực tức, vai căng, tay run...' },
    { q: '3. Điều gì kích hoạt cảm xúc này?', ph: 'Tình huống, người, lời nói...' },
    { q: '4. Tôi cần gì lúc này?', ph: 'Nghỉ ngơi, nói chuyện, im lặng...' },
    { q: '5. Bước nhỏ nhất tôi có thể làm?', ph: 'Thở sâu, uống nước, đi bộ...' },
  ]},
  { id: 'failday', icon: '💪', label: 'Nhật Ký Ngày Thất Bại', color: '#f59e0b', lines: [
    { q: '1. Điều gì đã xảy ra?', ph: 'Chỉ kể lại sự kiện...' },
    { q: '2. Tôi đã học được gì?', ph: 'Bài học thực sự...' },
    { q: '3. Điều gì đã làm tốt dù trong hoàn cảnh đó?', ph: 'Tìm điểm tích cực...' },
    { q: '4. Ngày mai tôi sẽ làm khác thế nào?', ph: '1 thay đổi cụ thể...' },
    { q: '5. Tôi tha thứ cho bản thân điều gì?', ph: 'Lòng trắc ẩn với chính mình...' },
  ]},
  { id: 'eating', icon: '🍽️', label: 'Nhật Ký Ăn Uống Cảm Xúc', color: '#0ea5e9', lines: [
    { q: '1. Tôi đang muốn ăn gì?', ph: 'Món cụ thể...' },
    { q: '2. Tôi có thực sự đói không? (0-10)', ph: 'Điểm đói thực sự...' },
    { q: '3. Tôi đang cảm thấy gì trước khi muốn ăn?', ph: 'Cảm xúc, sự kiện trước đó...' },
    { q: '4. Điều gì tôi thực sự cần?', ph: 'Nghỉ ngơi, kết nối, an toàn...' },
    { q: '5. Sau khi ăn tôi cảm thấy thế nào?', ph: 'Ghi lại sau khi ăn...' },
  ]},
  { id: 'quick', icon: '⚡', label: 'Phiên Bản Siêu Ngắn', color: '#10b981', lines: [
    { q: '1. Tôi đang cảm thấy gì?', ph: '1-3 từ...' },
    { q: '2. Tôi cần gì lúc này?', ph: '1-3 từ...' },
    { q: '3. Bước nhỏ nhất tiếp theo?', ph: '1 hành động cụ thể...' },
  ]},
];

const TIP_MODALS = [
  {
    icon: '🕐', color: COLOR, rgb: RGB,
    modalTitle: 'Thời Điểm Tốt Nhất — Sáng Sớm & Trước Ngủ',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cortisol Awakening Response (CAR): cortisol tăng 50–100% trong 30 phút đầu sau thức dậy — đỉnh tự nhiên của alertness và cognitive clarity. Buổi sáng sớm cũng có theta-alpha transition (não vừa ra khỏi ngủ) — ideal for reflective, creative writing.',
    detail: 'Có hai "cửa sổ" sinh lý tối ưu cho journaling: sáng sớm (cognitive peak + fresh perspective) và trước ngủ (cognitive offloading + sleep preparation). Cả hai đều có neurological reasons cụ thể — không phải mê tín.',
    details: [
      'Sáng sớm — Cortisol Awakening Response: Cortisol tăng tự nhiên 30–45 phút sau thức dậy (CAR). Đây là peak tự nhiên của working memory, executive function và creative thinking. Viết nhật ký trong window này capture clarity trước khi daily stress và stimuli (social media, email) "pollute" perspective.',
      'Sáng sớm — Theta waves transition: Khi thức dậy, não đang trong theta-alpha transition (4–12 Hz) — trạng thái giữa ngủ và tỉnh hoàn toàn. Nghiên cứu creativity: theta state liên quan đến divergent thinking, "aha moments" và free association. Morning pages (Julia Cameron) khai thác chính window này.',
      'Trước ngủ — Cognitive offloading: Viết nhật ký trước ngủ externalize "open loops" — những việc chưa xong, lo lắng, unresolved thoughts. Scullin et al. (2018): viết to-do list cụ thể trước ngủ giảm sleep onset time 9 phút. Não được signal "đã ghi lại = an toàn để buông."',
      'Trước ngủ — Memory consolidation: Memories được consolidate trong ngủ (hippocampal replay trong slow-wave sleep). Viết về ngày trước ngủ encode experiences vào long-term memory tốt hơn. "Học mà không ôn = quên"; viết về ngày = brief review trước consolidation window.',
      'Tránh: Ngay sau ăn nặng (tiêu hóa compete với cognitive function), sau intense exercise (cortisol còn cao), khi quá mệt (quality giảm). Không có "sai" nếu không thể theo thời điểm ideal — nhưng consistent timing giúp habit formation qua context-dependent memory.',
      'Implementation: Set specific time anchor — "Khi tôi pha cà phê sáng, tôi viết nhật ký" hoặc "Khi tôi nằm xuống giường, tôi viết 3 câu." Time + context anchor mạnh hơn chỉ "mỗi ngày." Fogg: anchor behavior vào sensory cue (mùi cà phê, cảm giác nằm xuống) tạo automatic trigger.',
    ],
    points: [
      { icon: '⚡', label: 'Cortisol Peak', note: 'Sáng: +50–100% cortisol = clarity và cognitive peak' },
      { icon: '🌊', label: 'Theta-Alpha State', note: 'Sáng sớm: creative thinking và free association tốt nhất' },
      { icon: '😴', label: 'Sleep Onset -9 Phút', note: 'Tối: viết to-do list → ngủ nhanh hơn (Scullin 2018)' },
      { icon: '🧠', label: 'Memory Consolidation', note: 'Tối: viết ngày → hippocampus encode tốt hơn trong ngủ' },
    ],
  },
  {
    icon: '✏️', color: COLOR, rgb: RGB,
    modalTitle: 'Viết Tay — Handwriting & Neural Encoding',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Van der Meer & Van der Weel (2023, Frontiers in Psychology): handwriting kích hoạt neural networks rộng và phức tạp hơn typing đáng kể — motor cortex, somatosensory, visual processing và language areas cùng hoạt động. "Handwriting is brain training, typing is not."',
    detail: 'Handwriting slow pace buộc não phải process, summarize và synthesize information — không thể viết tay nhanh bằng nói hay gõ phím. Chính sự "chậm chạp" này là advantage: deeper encoding, better understanding, và more reflective thinking.',
    details: [
      'Motor-cognitive coupling: Mỗi chữ viết tay = unique motor program (sequence of muscle movements). Neural circuits cho handwriting bao gồm cerebellum (motor coordination), basal ganglia (sequence learning), và primary motor cortex — tất cả kết nối với language và memory areas. Typing = chỉ nhấn phím giống nhau.',
      'Encoding và recall: Mueller & Oppenheimer (2014, Psychological Science): sinh viên ghi chú tay nhớ và hiểu bài tốt hơn ghi chú laptop dù laptop nhiều thông tin hơn. Reason: viết tay requires paraphrase và synthesis (generative processing), typing enables verbatim recording (shallow processing).',
      'Slow writing = deeper reflection: Journaling speed tự nhiên slower khi viết tay → more time for reflection between sentences. "Writing is thinking made visible" — tốc độ chậm cho phép thoughts fully form trước khi được externalized, thay vì stream-of-consciousness unprocessed.',
      'Digital distraction elimination: Khi viết tay, không có notifications, no autocomplete, no ability to "just quickly check" something. Attention không bị fragmented. Flow state (Csikszentmihalyi) dễ đạt hơn với analog medium vì zero distraction.',
      'Tangible artifact: Nhật ký vật lý tạo tangible object — có thể cầm, lật lại, thấy progress vật lý qua nhiều cuốn. Psychological studies: tangible goals và artifacts tạo commitment stronger than digital. "Seeing the stack of completed journals" là visual motivator khác với scrolling through digital notes.',
      'Nếu phải dùng digital: Apps như Bear, Day One, hoặc Obsidian (offline, no social) là better than social-connected apps. Block notifications khi viết. Đặt phone ở chế độ Do Not Disturb. Dù không bằng tay, digital với intent và focus tốt hơn handwriting mà distracted.',
    ],
    points: [
      { icon: '🧠', label: 'Neural Network Rộng', note: 'Handwriting kích hoạt nhiều brain areas hơn typing' },
      { icon: '💾', label: 'Deeper Encoding', note: 'Mueller 2014: viết tay → nhớ và hiểu tốt hơn laptop' },
      { icon: '🔇', label: 'Zero Distraction', note: 'Không notifications, không autocomplete, không check' },
      { icon: '📚', label: 'Tangible Progress', note: 'Stack of journals = visual motivator không thể clone' },
    ],
  },
  {
    icon: '⏱️', color: COLOR, rgb: RGB,
    modalTitle: '5–10 Phút Mỗi Ngày — Minimum Effective Dose',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b6f6c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Perfectionism là nguyên nhân #1 của journaling failure. "Phải viết đủ, phải hay, phải phân tích sâu" → skip khi không có thời gian/energy. MED principle: 5 phút consistent > 30 phút một lần/tuần. Brain builds neural pathway qua repetition, không qua duration.',
    detail: 'Nghiên cứu habit formation (Lally et al., 2010): habits take 18–254 ngày để automatic, trung bình 66 ngày. Critical factor: frequency của repetition, không phải duration. Mỗi lần viết — dù 2 phút — củng cố habit neural pathway. Skip một ngày làm yếu pathway đó.',
    details: [
      'MED (Minimum Effective Dose): Concept từ Timothy Ferriss/pharmacology — lượng tối thiểu để có tác dụng mong muốn. Trong journaling: 5 phút đủ để activate affect labeling, cognitive offloading và gratitude neural networks. Hơn 5 phút tốt hơn, nhưng 5 phút >> 0 phút.',
      'Perfectionism trap: "Nếu không viết đủ tốt, thôi không viết" là cognitive distortion kinh điển — all-or-nothing thinking. Journaling không có grading system. A messy, fragmented 3 phút có therapeutic value. A "perfect" journal entry không tồn tại vì không có tiêu chuẩn.',
      'Habit formation — frequency > duration: Lally et al. (2010, EJSP): nghiên cứu 12 tuần về habit formation. Daily repetition là variable quan trọng nhất. Missing one day occasionally không phải disaster — nhưng missing more than 2 consecutive days có correlation mạnh với permanent abandonment.',
      'Energy-based approach: Hôm nào energy cao → viết lâu hơn, sâu hơn. Hôm nào kiệt sức → 3 câu siêu ngắn. "Điều chỉnh theo năng lượng, không theo kế hoạch cứng" align với natural ultradian rhythms (90 phút cycle của energy). Forcing khi low energy tạo negative association với habit.',
      '"Done is better than perfect" cho journaling: Research on self-regulation: người đặt "flexible" goals (process-oriented, not outcome-oriented) có better long-term adherence than people with rigid "perfect" standards. "Tôi sẽ viết mỗi ngày" tốt hơn "Tôi sẽ viết 1000 từ mỗi ngày."',
      'Timer method: Đặt timer 5 phút và cam kết viết cho đến khi timer kêu. Người thường viết vượt quá 5 phút khi đã bắt đầu (Zeigarnik: khi đã bắt đầu, não muốn hoàn thành). Timer eliminates decision fatigue về "khi nào dừng" và giảm start barrier.',
    ],
    points: [
      { icon: '💊', label: 'Minimum Effective Dose', note: '5 phút kích hoạt đủ neural mechanisms quan trọng' },
      { icon: '🔄', label: 'Frequency > Duration', note: 'Lally 2010: daily practice builds pathway, không phải length' },
      { icon: '🚫', label: 'Anti-Perfectionism', note: 'Messy 3 phút > đợi "có thời gian" và không bao giờ viết' },
      { icon: '⏲️', label: 'Timer Method', note: 'Set 5 phút → thường vượt quá, Zeigarnik effect kicks in' },
    ],
  },
  {
    icon: '🚫', color: COLOR, rgb: RGB,
    modalTitle: 'Không Chỉnh Sửa, Không Phán Xét — Free Writing & Inner Critic',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Inner critic (Tiếng nói phán xét nội tâm) là sản phẩm của prefrontal cortex kiểm soát quá mức. Khi viết và ngay lập tức edit/judge, PFC interrupt raw emotional processing — giảm therapeutic value của writing. "Write drunk, edit sober" (Hemingway) — không phải về rượu, mà về states.',
    detail: 'Free writing (Elbow, 1973) là kỹ thuật viết không dừng, không sửa trong thời gian nhất định. Khi inner critic bị bypass, material từ subconscious và emotional processing center (limbic system) có thể surface — những insights mà rational, editing mind thường suppress.',
    details: [
      'Inner critic và Superego: Freud mô tả Superego là phần kiểm soát, phán xét và censoring của psyche. Trong viết nhật ký, inner critic là Superego hoạt động — "Câu này không hay", "Điều này nghe sẽ... weird", "Nếu ai đọc được...". Censor này block authentic expression và emotional processing.',
      'Free writing mechanics: Peter Elbow (Writing Without Teachers, 1973): viết liên tục, không dừng, không sửa lỗi chính tả, không xóa. Nếu không biết viết gì, viết "tôi không biết viết gì" cho đến khi material xuất hiện. Pen không rời giấy. Rule này bypass inner critic bằng cách không để nó interrupt.',
      'Stream of consciousness và access: Julia Cameron (The Artist\'s Way): "Morning Pages" là 3 trang viết tay, free writing, ngay sau thức dậy — không edit, không re-read. Mục tiêu: access subconscious material trước rational mind "wake up fully." Nhiều people report unexpected insights và emotional releases.',
      'Judgment và cortisol: Khi lo lắng bị phán xét (ngay cả từ bản thân), cortisol tăng và PFC hoạt động ở defensive mode — giảm emotional authenticity. "Nhật ký là để trung thực, không phải để hay" là permission structure quan trọng. Authenticity trong viết correlates với therapeutic outcomes.',
      'Không re-read ngay: Re-reading immediately after writing triggers editorial mode — tend to judge, edit, want to change. Allow written material to "settle" before reading. Many journalers follow "write, close, read the next morning" rule. Time distance creates perspective.',
      'Grammar và spelling là irrelevant: Journaling không phải essay — perfect grammar là distraction. Khi brain dùng energy để correct spelling, nó không dùng energy cho emotional processing. "cảm giác mình mệt waaaa, không hiểu sao" valid và useful. "Tôi cảm thấy mệt mỏi không rõ nguyên nhân" không ích gì hơn.',
    ],
    points: [
      { icon: '🧠', label: 'Bypass Inner Critic', note: 'Free writing ngắt censor của PFC → subconscious surfaces' },
      { icon: '🌊', label: 'Stream of Consciousness', note: 'Cameron: Morning Pages — 3 trang không chỉnh, không đọc lại' },
      { icon: '✍️', label: 'Pen Không Rời Giấy', note: 'Elbow 1973: viết liên tục = momentum vượt qua resistance' },
      { icon: '😌', label: 'Authenticity > Grammar', note: 'Không phán xét → cortisol thấp → processing sâu hơn' },
    ],
  },
  {
    icon: '🔒', color: COLOR, rgb: RGB,
    modalTitle: 'Nhật Ký Riêng Tư — Disclosure Inhibition & Safe Space',
    img: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Pennebaker\'s Disclosure Inhibition Theory: giữ bí mật và ức chế disclosure (không nói ra) tiêu tốn cognitive và physiological energy liên tục — tương tự giữ muscle contracted. Long-term inhibition = chronic stress response, immune suppression, và higher illness rates. Viết ra = release inhibition.',
    detail: 'Khi biết nhật ký là riêng tư, người viết có authentic disclosure rate cao hơn — viết thứ họ không nói với ai. Chính authentic disclosure này (không phải "viết hay") tạo therapeutic effect. "Audience of zero" paradoxically creates deeper honest expression.',
    details: [
      'Disclosure Inhibition Theory: Pennebaker (1985): người giữ secrets và không thể disclose experiences stressful có higher health problems, more doctor visits, và lower immune function. Physiological work of inhibition = chronic low-grade stress response. Journaling là safe disclosure — không cần audience.',
      '"Audience of zero" effect: Khi viết cho người đọc (blog, diary shared), writing becomes performance — chọn lọc, censor, curate. Khi viết chỉ cho mình, không có social audience → authentic expression possible. Người viết nhật ký private thường disclose deeper material than shared writing.',
      'Safety và psychological containment: Nhật ký vật lý hoặc private digital space tạo "contained" environment cho difficult emotions. Containment (concept từ Bion, psychoanalysis) cho phép hold intense feelings trong bounded space — không overwhelm, không permanence tách biệt khỏi life. Emotions được "held" rồi processed.',
      'Không cần share, không cần validate: Trong social media culture, nhiều người share để get validation (likes, comments). Nhật ký không cần validation — đây là một dạng self-sufficiency trong emotional processing. Khả năng validate bản thân (self-validation) là sign of emotional maturity và security.',
      'Destroy or keep: Nhiều người lo "nếu mình chết, ai đọc nhật ký?" hoặc "nếu bị tìm thấy?" Giải pháp: destroy regularly (đốt, cắt nhỏ), dùng private encrypted digital (Day One với passcode), hoặc accept rằng context-stripped journal entries không biểu đạt đúng mình. Sợ bị đọc = censor = less effective.',
      'Therapeutic writing vs. journaling: Pennebaker protocol (expressive writing) yêu cầu người viết destroy paper after writing — remove concern về audience hoàn toàn. Nhiều therapists dùng protocol này: write for 20 min, then shred. Effect size significant ngay cả khi không keep journal.',
    ],
    points: [
      { icon: '🔓', label: 'Release Inhibition', note: 'Pennebaker: giữ secrets = chronic stress, viết ra = release' },
      { icon: '🎭', label: 'Audience of Zero', note: 'Không có người đọc → authentic disclosure tự nhiên hơn' },
      { icon: '🫂', label: 'Psychological Containment', note: 'Safe space cho emotions khó — held, not suppressed' },
      { icon: '🗑️', label: 'Destroy = More Free', note: 'Không lo bị đọc → viết thật hơn → therapeutic hơn' },
    ],
  },
  {
    icon: '📈', color: COLOR, rgb: RGB,
    modalTitle: 'Đọc Lại Sau 7 Ngày — Pattern Recognition & Narrative Review',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Self-tracking và periodic review là core của Quantified Self movement và behavior change science. Đọc lại journal sau 7 ngày tạo "second-order observation" — quan sát bản thân đang quan sát — highest level của self-awareness theo Gregory Bateson.',
    detail: 'Khi viết, bạn đang capture real-time experience. Khi đọc lại, bạn đang observe that experience từ temporal distance — một người khác nhìn vào version của bạn 7 ngày trước. Khoảng cách thời gian này tạo perspective không thể có trong khoảnh khắc.',
    details: [
      'Pattern recognition qua time: Một entry đơn lẻ = data point. Bảy entries = pattern. "Thứ Hai luôn tệ nhất" "Mình hay stress sau khi gặp X" "Mình ăn nhiều hơn khi cô đơn" — những patterns này chỉ visible khi nhìn lại nhiều ngày, không thể thấy in-the-moment. Self-knowledge qua patterns > introspection đơn thuần.',
      'Temporal distancing và perspective: Kross et al. (2014): temporal distancing ("tôi 7 ngày trước") giống như spatial distancing — tạo self-compassionate perspective. Đọc lại lo lắng cũ thường giải phóng: "ồ, điều đó đã tự giải quyết" hoặc "điều đó không quan trọng bằng mình nghĩ lúc đó."',
      'Evidence-based self-awareness: Nhiều người có inaccurate self-perception — overestimate stable traits, underestimate situational factors. Journaling review cung cấp empirical evidence về actual behavior và feelings, không phải self-concept. "Mình nghĩ mình không bao giờ lo lắng" vs "7 entries, 5 cái đề cập lo lắng."',
      'Growth tracking: Đọc lại journal từ 1 tháng hoặc 1 năm trước thường reveal growth mà không thể thấy in real-time (change blindness — mắt không thấy slow changes). "Mình đã lo lắng điều này nhiều thế — bây giờ không còn lo nữa" = direct evidence của growth.',
      'Weekly review practice: GTD (Getting Things Done — David Allen) và nhiều productivity systems đề xuất weekly review. Áp dụng cho journaling: Sunday evening đọc lại tuần qua + viết reflection ngắn (top 3 themes? top 1 lesson?). Synthesis brief này là metacognitive practice có giá trị cao.',
      'Avoid over-analysis: Đọc lại để observe, không phải để judge. "Interesting, mình đã cảm thấy thế này" — not "Mình thật idiotic khi lo điều đó." Attitude: curious observer, không phải critic. Nếu đọc lại gây ra distress (thấy tệ hơn), reduce frequency hoặc discuss với mental health professional.',
    ],
    points: [
      { icon: '🔭', label: 'Second-Order Observation', note: 'Nhìn bản thân nhìn chính mình — highest self-awareness' },
      { icon: '📊', label: 'Patterns > Snapshots', note: '7 entries = pattern; 1 entry = chỉ là một ngày' },
      { icon: '⏳', label: 'Temporal Distancing', note: 'Kross: đọc lại tạo compassion và perspective tự nhiên' },
      { icon: '📈', label: 'Growth Evidence', note: 'Change blindness fix: proof bạn đã thay đổi' },
    ],
  },
];

const ROADMAP_MODALS = [
  {
    icon: '🌱', color: COLOR, rgb: RGB,
    modalTitle: 'Tuần 1 — Xây Nền Móng Habit',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Habit formation research (Lally et al.): tuần đầu là "pain period" — motivation cao nhưng automaticity thấp, cần most willpower. Bí quyết: giảm friction tối đa (bút + sổ sẵn ở gần giường), anchor vào ritual cố định, và không đặt kỳ vọng về quality.',
    detail: 'Tuần 1 không phải về viết hay hay sâu — chỉ về viết. Mục tiêu duy nhất: 7/7 ngày có ít nhất 3 dòng gì đó. Không miss. Bất kỳ miss nào trong tuần đầu có correlation cao với permanent abandonment (habit không được establish đủ để survive interruption).',
    details: [
      'Tại sao chỉ "Nhật Ký 5 Dòng": 5 câu có structure rõ ràng → không cần think "viết gì hôm nay." Decision fatigue là enemy của new habits. Khi template có sẵn, cognitive load gần bằng 0 — chỉ cần ngồi xuống và điền vào. Dễ hơn nhiều so với "tự do viết."',
      'Friction reduction: Bút và sổ để ngay trên đầu giường hoặc bàn làm việc — thấy ngay, lấy ngay. Không cần mở tủ, không cần tìm. Fogg: mỗi extra step trong routine là potential dropout point. "2-minute rule" — nếu mất < 2 phút để prepare, không có excuse nào valid.',
      'Anchor và cue: Chọn một anchor cụ thể: "Sau khi đánh răng tối → viết nhật ký." Anchor phải là behavior ĐANG có sẵn, stable, và xảy ra daily. Sensory cue mạnh hơn time cue — "khi tôi ngồi vào bàn uống cà phê" rõ ràng hơn "lúc 7 giờ sáng."',
      'Imperfect is OK — missing is not: Ngày viết 2 câu vì quá mệt = success. Ngày viết "hôm nay tôi không muốn viết gì" = success. Ngày không viết = only failure. Habit threshold không phải về quality trong tuần đầu — về unbroken chain. "Don\'t break the chain" (Seinfeld strategy).',
      'Social accountability (optional): Tell one trusted person about journaling goal hoặc use habit tracker app (Streaks, Habitica). Commitment device cho tuần đầu — not needed long-term once habit established, but helpful while neural pathway being built.',
      'Week 1 milestone: Cuối tuần 1, nếu đã viết 7/7, bạn đã pass critical threshold. Research: người complete tuần đầu của new habit có significantly higher long-term adherence. Celebrate nhỏ — nhận ra mình đã làm điều quan trọng.',
    ],
    points: [
      { icon: '🔗', label: 'Chain Không Đứt', note: '7/7 ngày — miss bất kỳ ngày nào = nguy cơ cao bỏ luôn' },
      { icon: '⚡', label: 'Zero Decision', note: 'Template có sẵn = không phải nghĩ "viết gì" → just do it' },
      { icon: '🪝', label: 'Anchor Behavior', note: 'Gắn với ritual đã có — không cần remember or plan' },
      { icon: '✅', label: 'Quality Không Quan Trọng', note: 'Tuần 1: chỉ cần viết gì đó, bất kể hay hay dở' },
    ],
  },
  {
    icon: '🌿', color: COLOR, rgb: RGB,
    modalTitle: 'Tuần 2 — Thêm Nhật Ký Cảm Xúc Khi Có Sự Kiện',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuần 2: habit đã có đủ inertia để survive với addition của complexity mới. Cơ chế "progressive overload" từ strength training áp dụng cho habit: tăng difficulty khi đã master previous level. Nhật Ký Cảm Xúc không thay thế 5 Dòng — chỉ thêm vào khi có stress event.',
    detail: '"Reactive journaling" — chỉ dùng Nhật Ký Cảm Xúc khi sự kiện xảy ra — là approach thực tế nhất. Không cần làm mỗi ngày, không cần force nếu không có gì để process. Đây là on-demand tool cho stress events, không phải daily obligation thêm.',
    details: [
      'Trigger-based practice: Nhật Ký Cảm Xúc hoạt động tốt nhất khi có specific trigger — argument, bad news, sudden anxiety, sau cuộc họp căng thẳng. Implementation intention: "Khi tôi cảm thấy cảm xúc mạnh (>6/10), tôi sẽ mở nhật ký và viết 5 câu." If-then rule tạo automatic response.',
      'Hot vs cool cognition: "Hot" cognition = trong lúc cảm xúc mạnh, harder to process rationally. Viết trong "hot" state captures raw emotion. Sau đó đọc lại ở "cool" state tạo insight. Không cần phân tích khi đang viết — chỉ describe experience. Analysis comes later.',
      'Stacking với Nhật Ký 5 Dòng: Những ngày có stress event → viết cả hai (5 Dòng + Cảm Xúc). Những ngày không có event đặc biệt → chỉ 5 Dòng. Total time on stress days: 10–15 phút. No stress days: 5 phút. Không bao giờ skip 5 Dòng vì "đã viết Cảm Xúc".',
      'Emotional vocabulary expansion: Tuần 2 là cơ hội để expand emotional granularity. Thay vì "tệ" → phân biệt: thất vọng, bị phản bội, cô đơn, lo lắng, kiệt sức, chán nản. List cảm xúc cụ thể (Feelings Wheel của Dr. Gloria Willcox) có ích. Granularity tăng = regulation tốt hơn.',
      'Notice without fix: Nhiều người viết nhật ký với intention "fix" cảm xúc — không phải lúc nào cũng cần. Đôi khi mục tiêu chỉ là witness và acknowledge. "Tôi đang cảm thấy buồn. Đó là thật." — không cần giải quyết ngay. Witnessing without judgment already has therapeutic effect.',
      'Pattern từ tuần 2: Cuối tuần 2, đọc lại cả 2 tuần. Stress events có pattern không? Cùng người? Cùng loại situation? Cùng time of day/week? Early pattern recognition này là payoff của consistent practice.',
    ],
    points: [
      { icon: '🎯', label: 'If-Then Rule', note: 'Cảm xúc mạnh >6/10 → tự động mở Nhật Ký Cảm Xúc' },
      { icon: '🌡️', label: 'Hot vs Cool', note: 'Viết khi hot → đọc lại khi cool = insight xuất hiện' },
      { icon: '🎨', label: 'Emotional Granularity', note: 'Tuần 2: học phân biệt cảm xúc chi tiết hơn' },
      { icon: '👁️', label: 'Witness, Not Fix', note: 'Acknowledge cảm xúc đã có value — không cần giải quyết ngay' },
    ],
  },
  {
    icon: '🌲', color: COLOR, rgb: RGB,
    modalTitle: 'Tuần 3 — Thêm Nhật Ký Ăn Uống Cảm Xúc',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Pillar B connection: Nhật Ký Ăn Uống Cảm Xúc là bridge giữa Trụ Cột D (Tâm trí) và Trụ Cột B (Dinh dưỡng). Emotional eating thường không được nhận ra vì xảy ra automatic, không có awareness. 3 tuần journaling practice đã tạo enough interoceptive awareness để notice patterns này.',
    detail: 'Tuần 3 chỉ thêm Nhật Ký Ăn Uống nếu có pattern emotional eating — không phải ai cũng cần. Nếu ăn uống không phải area of difficulty, có thể skip hoặc replace bằng nhật ký khác (vd: Nhật Ký Ngày Thất Bại). Self-directed program, không phải rigid protocol.',
    details: [
      'Interoceptive readiness: Sau 2 tuần consistent journaling, interoceptive awareness đã tăng. Điều này make Nhật Ký Ăn Uống more effective — bạn đã practice "notice what I\'m feeling" và có thể apply it to eating context. Không nên bắt đầu ăn uống journaling từ ngày 1 vì foundation awareness chưa có.',
      'Not calorie counting: Hoàn toàn khác với food diary/calorie logging. Không có "foods to avoid," không có gram counting, không có judgment về thứ đã ăn. Chỉ là awareness exercise: what was I feeling? what did I actually need? — không phải nutritional analysis.',
      'HALT in eating context: Hungry (đói thật?) — Angry/Anxious (bực hay lo?) — Lonely (cô đơn?) — Tired (kiệt sức?). Ba cái sau thường trigger eating khi không đói thật. Nhật Ký Ăn Uống helps identify which HALT state is driving eating và redirect đến appropriate response.',
      'Compassionate tracking: Nếu ăn "vì cảm xúc" và ghi vào nhật ký — không tự trách. Ghi nhận, tò mò, không judge. "Tôi đã ăn cả hộp kem vì buồn và cô đơn" là valuable information, không phải moral failure. Self-compassion in this context actually predicts better eating behavior long-term.',
      'Connection với Trụ Cột B tools: Combine với hunger scale (1–10) từ Mindful Eating section trong Pillar B. "Câu 2: Tôi có đói thật không? (0–10)" trong template là TDEE/hunger awareness tool. Người dùng cả hai resources sẽ thấy chúng reinforce nhau.',
      'When to skip this step: Nếu có history của eating disorders (anorexia, bulimia, orthorexia), Nhật Ký Ăn Uống có thể counter-productive — consult với mental health professional trước. Awareness tools designed for general population không phải EDs recovery tools.',
    ],
    points: [
      { icon: '🌉', label: 'Pillar D + B Bridge', note: 'Kết nối tâm trí với ăn uống — awareness transfer' },
      { icon: '🚫', label: 'Không Đếm Calories', note: 'Chỉ emotions và needs — không phải nutritional tracking' },
      { icon: '🛑', label: 'HALT Check', note: 'Hungry/Angry/Lonely/Tired — identify real need trước khi ăn' },
      { icon: '💜', label: 'Self-Compassion First', note: 'Emotional eating = information, không phải moral failure' },
    ],
  },
  {
    icon: '🏔️', color: COLOR, rgb: RGB,
    modalTitle: 'Tuần 4 — Review, Personalize & Build Long-Term System',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Meta-learning: học về cách mình học. Tuần 4 không phải về adding more — mà về stepping back và asking "điều gì đang hoạt động tốt nhất với mình?" Research on self-determination: intrinsic motivation (do mình chọn, vì mình thấy value) sustains habit long-term. Extrinsic protocols không sustain.',
    detail: 'Tuần 4 là "personalization phase" — bạn đã có 3 tuần data về bản thân. Đọc lại toàn bộ, nhận ra patterns, và thiết kế system làm việc cho YOUR life — không phải system hoàn hảo theo lý thuyết. Best journaling system = system bạn thực sự duy trì được.',
    details: [
      'Monthly review protocol: Đọc lại tất cả entries từ 3 tuần. Ghi chú: themes lặp lại là gì? emotions nào xuất hiện nhiều nhất? triggers phổ biến? điều gì đã tốt hơn? điều gì vẫn stuck? — không phải grading, mà là inquiry. Câu hỏi: "Tôi đã học được gì về bản thân mình?"',
      'Template optimization: Sau 3 tuần, nhận ra template nào resonate nhất. Có người thấy 5 Dòng đủ mãi mãi. Có người chuyển hoàn toàn sang Nhật Ký Cảm Xúc. Có người kết hợp custom. Personalization = higher adherence. Rigidly following một template khi nó không work = recipe for quitting.',
      'Reduce hay increase: Nếu thấy 5 phút quá ngắn — tự nhiên extend. Nếu thấy 3 tuần quá nhiều commitment — simplify xuống 1 template 3 phút. Không phải "mình thất bại với lộ trình" — mà là "mình biết mình cần gì." Self-knowledge là outcome, không phải rule-following.',
      'Long-term sustainability cues: Questions to ask: Có gần giường hay không? Có phải search cho bút không? Có timer hay không? Có consistent anchor chưa? Có reward (dù nhỏ) sau khi viết không? Friction thấp, context strong, reward present = habit sustainable beyond 4 weeks.',
      'Annual reflection (bonus): Sau 3–6 tháng, add một buổi annual/quarterly review dài hơn — 30–60 phút đọc lại journals từ nhiều tháng. Many journalers report này là most valuable practice: seeing growth over months, không phải days. "Mình của 6 tháng trước lo lắng điều này... bây giờ mình đã qua được."',
      'Sharing decision: Chia sẻ insights từ journal (không phải entries) với therapist, trusted friend, hay accountability partner có thể amplify value. Không cần share entries raw. Synthesized insights ("tôi nhận ra mình stress nhất khi...") là output tốt từ journaling practice.',
    ],
    points: [
      { icon: '🔭', label: 'Meta-Learning', note: 'Học về cách mình học — highest level reflection' },
      { icon: '🎨', label: 'Personalization', note: 'Best system = system bạn thực sự duy trì được' },
      { icon: '📅', label: 'Annual Review', note: '6 tháng sau: xem growth mà không thể thấy ngày-qua-ngày' },
      { icon: '🌱', label: 'Intrinsic Motivation', note: 'Tự chọn, tự thấy value → sustain long-term, không phải protocol' },
    ],
  },
];

const TIPS = [
  { icon: '🕐', tip: 'Sáng sớm hoặc trước khi ngủ là thời điểm tốt nhất' },
  { icon: '✏️', tip: 'Viết tay hiệu quả hơn gõ phím — kết nối não bộ sâu hơn' },
  { icon: '⏱️', tip: 'Chỉ cần 5–10 phút mỗi ngày, không cần hoàn hảo' },
  { icon: '🚫', tip: 'Không chỉnh sửa, không phán xét — cứ viết ra' },
  { icon: '🔒', tip: 'Nhật ký là riêng tư, không cần lo ai đọc' },
  { icon: '📈', tip: 'Sau 7 ngày, đọc lại để thấy sự thay đổi của bản thân' },
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

function JournalWriter({ template }) {
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const set = (idx, val) => setAnswers(p => ({ ...p, [idx]: val }));
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${template.color}33`, background: `${template.color}08` }}>
      {template.lines.map((line, i) => (
        <div key={i}>
          <p className="text-base font-semibold mb-1.5" style={{ color: template.color }}>{line.q}</p>
          <textarea
            className="w-full rounded-xl border bg-bg text-text text-lg p-3 resize-none focus:outline-none focus:ring-2 min-h-[56px]"
            style={{ borderColor: `${template.color}30`, '--tw-ring-color': `${template.color}60` }}
            placeholder={line.ph}
            value={answers[i] || ''}
            onChange={e => set(i, e.target.value)}
            rows={2}
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        className="px-5 py-2 rounded-full text-lg font-bold transition-all"
        style={{ background: template.color, color: '#fff', opacity: saved ? 0.7 : 1 }}
      >
        {saved ? '✓ Đã lưu!' : 'Lưu nhật ký'}
      </button>
    </div>
  );
}

export default function MindJournalingPage() {
  const [active, setActive] = useState('daily');
  const [benefitModal, setBenefitModal] = useState(null);
  const [templateModal, setTemplateModal] = useState(null);
  const [tipModal, setTipModal] = useState(null);
  const [roadmapModal, setRoadmapModal] = useState(null);
  const tmpl = TEMPLATES.find(t => t.id === active);
  const tmplIdx = TEMPLATES.findIndex(t => t.id === active);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dJournalOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dJournalOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>📓</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Journaling &amp; Nhật Ký Tâm Trí</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D4 · Viết Để Giải Phóng</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Viết nhật ký là công cụ đơn giản nhất để giải phóng tâm trí — không phán xét, không cần hoàn hảo, chỉ cần viết ra những gì đang diễn ra bên trong.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop" alt="Journaling" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>5 phút · Mỗi ngày</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tại Sao Nên Viết Nhật Ký?</h2>
        <p className="text-muted text-lg mb-6">3 lợi ích được nghiên cứu khoa học xác nhận</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BENEFIT_MODALS.map((c, i) => (
            <div key={c.modalTitle} className="group/benefit rounded-2xl border border-border bg-surface p-5 hover:border-pink-500/30 transition-colors cursor-pointer" onClick={() => setBenefitModal(i)}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-4xl">{c.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/benefit:opacity-100 transition-opacity self-start mt-1"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
              <div className="font-bold text-text mb-2">{c.modalTitle.split(' — ')[0]}</div>
              <p className="text-muted text-lg leading-relaxed">{c.detail.split('.')[0]}.</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>5 Mẫu Nhật Ký Thực Hành</h2>
        <p className="text-muted text-lg mb-6">Chọn mẫu phù hợp với tâm trạng hôm nay</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className="px-4 py-2 rounded-full text-lg font-semibold border transition-all"
              style={active === t.id
                ? { background: t.color, color: '#fff', borderColor: t.color }
                : { background: 'transparent', color: '#888', borderColor: '#333' }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {tmpl && (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{tmpl.icon}</span>
                <span className="font-bold text-text">{tmpl.label}</span>
              </div>
              <button onClick={() => setTemplateModal(tmplIdx)}
                className="text-[11px] font-bold px-3 py-1 rounded-full border transition-colors hover:opacity-80"
                style={{ color: tmpl.color, borderColor: `${tmpl.color}40`, background: `${tmpl.color}12` }}>
                Khoa học đằng sau →
              </button>
            </div>
            <JournalWriter key={tmpl.id} template={tmpl} />
          </>
        )}
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Mẹo Để Duy Trì Thói Quen</h2>
        <p className="text-muted text-lg mb-6">Biến việc viết nhật ký thành nghi thức hằng ngày</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <div key={t.tip} className="group/tip flex items-start gap-3 rounded-xl border border-border bg-surface p-4 hover:border-pink-500/20 transition-colors cursor-pointer" onClick={() => setTipModal(i)}>
              <span className="text-2xl shrink-0">{t.icon}</span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <p className="text-lg text-muted leading-relaxed">{t.tip}</p>
                <span className="shrink-0 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/tip:opacity-100 transition-opacity"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Lộ Trình 4 Tuần</h2>
        <div className="space-y-3">
          {ROADMAP_MODALS.map((r, i) => (
            <div key={i} className="group/roadmap flex gap-4 rounded-2xl border border-border bg-surface p-4 hover:border-pink-500/20 transition-colors cursor-pointer" onClick={() => setRoadmapModal(i)}>
              <div className="shrink-0 w-20 text-base font-bold uppercase tracking-widest pt-0.5" style={{ color: COLOR }}>{['Tuần 1','Tuần 2','Tuần 3','Tuần 4'][i]}</div>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-text mb-1">{r.modalTitle.split(' — ')[1] || r.modalTitle}</div>
                  <p className="text-muted text-lg">{r.detail.split('.')[0]}.</p>
                </div>
                <span className="shrink-0 self-start text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/roadmap:opacity-100 transition-opacity mt-0.5"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>

      {benefitModal !== null && (
        <CardModal
          item={BENEFIT_MODALS[benefitModal]}
          onClose={() => setBenefitModal(null)}
          onPrev={() => setBenefitModal(i => Math.max(0, i - 1))}
          onNext={() => setBenefitModal(i => Math.min(BENEFIT_MODALS.length - 1, i + 1))}
          hasPrev={benefitModal > 0}
          hasNext={benefitModal < BENEFIT_MODALS.length - 1}
          total={BENEFIT_MODALS.length}
          idx={benefitModal}
        />
      )}
      {templateModal !== null && (
        <CardModal
          item={TEMPLATE_MODALS[templateModal]}
          onClose={() => setTemplateModal(null)}
          onPrev={() => setTemplateModal(i => Math.max(0, i - 1))}
          onNext={() => setTemplateModal(i => Math.min(TEMPLATE_MODALS.length - 1, i + 1))}
          hasPrev={templateModal > 0}
          hasNext={templateModal < TEMPLATE_MODALS.length - 1}
          total={TEMPLATE_MODALS.length}
          idx={templateModal}
        />
      )}
      {tipModal !== null && (
        <CardModal
          item={TIP_MODALS[tipModal]}
          onClose={() => setTipModal(null)}
          onPrev={() => setTipModal(i => Math.max(0, i - 1))}
          onNext={() => setTipModal(i => Math.min(TIP_MODALS.length - 1, i + 1))}
          hasPrev={tipModal > 0}
          hasNext={tipModal < TIP_MODALS.length - 1}
          total={TIP_MODALS.length}
          idx={tipModal}
        />
      )}
      {roadmapModal !== null && (
        <CardModal
          item={ROADMAP_MODALS[roadmapModal]}
          onClose={() => setRoadmapModal(null)}
          onPrev={() => setRoadmapModal(i => Math.max(0, i - 1))}
          onNext={() => setRoadmapModal(i => Math.min(ROADMAP_MODALS.length - 1, i + 1))}
          hasPrev={roadmapModal > 0}
          hasNext={roadmapModal < ROADMAP_MODALS.length - 1}
          total={ROADMAP_MODALS.length}
          idx={roadmapModal}
        />
      )}
    </div>
  );
}
