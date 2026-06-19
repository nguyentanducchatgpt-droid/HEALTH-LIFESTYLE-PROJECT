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
          {TIPS.map(t => (
            <div key={t.tip} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <span className="text-2xl shrink-0">{t.icon}</span>
              <p className="text-lg text-muted leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Lộ Trình 4 Tuần</h2>
        <div className="space-y-3">
          {[
            { w: 'Tuần 1', t: 'Nhật Ký 5 Dòng', d: 'Mỗi tối viết 5 dòng theo template cơ bản. Không cần dài, cần đều.' },
            { w: 'Tuần 2', t: '+ Nhật Ký Cảm Xúc', d: 'Khi có sự kiện gây căng thẳng, thêm template cảm xúc vào.' },
            { w: 'Tuần 3', t: '+ Nhật Ký Ăn Uống', d: 'Nếu ăn uống mất kiểm soát, thêm nhật ký ăn uống cảm xúc.' },
            { w: 'Tuần 4', t: 'Nhìn Lại & Điều Chỉnh', d: 'Đọc lại 3 tuần. Nhận ra pattern. Chọn mẫu phù hợp nhất.' },
          ].map((r, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border bg-surface p-4">
              <div className="shrink-0 w-20 text-base font-bold uppercase tracking-widest pt-0.5" style={{ color: COLOR }}>{r.w}</div>
              <div>
                <div className="font-semibold text-text mb-1">{r.t}</div>
                <p className="text-muted text-lg">{r.d}</p>
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
    </div>
  );
}
