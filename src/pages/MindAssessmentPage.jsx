import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#a855f7';
const RGB = '168,85,247';
const ORBIT_ID = 'd-assessment-orbit-kf';
const ORBIT_CLASS = 'd-assessment-orbit-ring';
const PROP = '--d-assessment-orbit-angle';

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

const QUESTIONS = [
  { id: 'q1', cat: 'Stress', q: 'Tôi thường cảm thấy căng thẳng hoặc lo lắng trong ngày', rev: true },
  { id: 'q2', cat: 'Stress', q: 'Tôi biết cách nhận ra khi bản thân đang bị stress', rev: false },
  { id: 'q3', cat: 'Stress', q: 'Tôi có ít nhất 1 cách để giảm stress hiệu quả', rev: false },
  { id: 'q4', cat: 'Hơi Thở & Thiền', q: 'Tôi thực hành thở có ý thức ít nhất vài lần mỗi tuần', rev: false },
  { id: 'q5', cat: 'Hơi Thở & Thiền', q: 'Tôi có thể ngồi im trong 5 phút mà không cảm thấy bồn chồn', rev: false },
  { id: 'q6', cat: 'Nhận Thức', q: 'Tôi thường không để ý đến những gì đang xảy ra xung quanh', rev: true },
  { id: 'q7', cat: 'Nhận Thức', q: 'Tôi có thể quan sát suy nghĩ mà không bị cuốn vào chúng', rev: false },
  { id: 'q8', cat: 'Kỹ Thuật Số', q: 'Tôi cầm điện thoại ngay khi thức dậy hoặc trước khi ngủ', rev: true },
  { id: 'q9', cat: 'Kỹ Thuật Số', q: 'Tôi có thể đặt điện thoại xuống và tập trung làm việc không bị gián đoạn', rev: false },
  { id: 'q10', cat: 'Giấc Ngủ', q: 'Tôi thức dậy thường xuyên cảm thấy mệt mỏi', rev: true },
  { id: 'q11', cat: 'Giấc Ngủ', q: 'Tôi ngủ đủ 7–9 tiếng hầu hết các ngày trong tuần', rev: false },
  { id: 'q12', cat: 'Nhật Ký', q: 'Tôi thường xuyên ghi lại suy nghĩ/cảm xúc của mình', rev: false },
  { id: 'q13', cat: 'Nhật Ký', q: 'Tôi biết cách xử lý cảm xúc mà không dồn nén', rev: false },
  { id: 'q14', cat: 'Kỷ Luật', q: 'Tôi dễ từ bỏ kế hoạch khi gặp khó khăn nhỏ', rev: true },
  { id: 'q15', cat: 'Kỷ Luật', q: 'Tôi tử tế với bản thân khi thất bại', rev: false },
];

const OPTIONS = [
  { v: 1, l: 'Không bao giờ' },
  { v: 2, l: 'Hiếm khi' },
  { v: 3, l: 'Đôi khi' },
  { v: 4, l: 'Thường xuyên' },
  { v: 5, l: 'Luôn luôn' },
];

const QM_COLOR = '#a855f7';
const QM_RGB = '168,85,247';
const QUESTION_MODALS = [
  {
    icon: '😟', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Tần Suất Stress Hằng Ngày',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cảm thấy stress thỉnh thoảng là hoàn toàn bình thường — nhưng nếu căng thẳng/lo âu xuất hiện mỗi ngày hoặc nhiều lần trong ngày mà không có nguyên nhân rõ ràng, đây là dấu hiệu HPA axis đang dysregulated.',
    detail: 'Câu này dùng thang đo ngược (REV): điểm "Luôn luôn" = điểm thấp. Mục tiêu không phải 0 stress — mà là stress có nguyên nhân rõ, kết thúc rõ, và không kéo dài sang ngày hôm sau.',
    details: [
      'Stress hằng ngày có 2 loại: situational (do sự kiện cụ thể, kết thúc khi sự kiện qua) và chronic background anxiety (lo âu nền không rõ nguyên nhân, không bao giờ hoàn toàn biến mất). Câu hỏi này nhắm vào loại thứ hai.',
      'Cortisol bình thường tăng sáng (CAR) và giảm tối. Nếu bạn cảm thấy căng thẳng từ sáng đến tối không có lúc nào thực sự thư giãn — cortisol baseline của bạn đã bị nâng lên, là dấu hiệu cần can thiệp.',
      'Lo âu mãn tính thường bắt đầu với "cảm giác có gì đó không ổn" mơ hồ — không phải lo về điều gì cụ thể mà là trạng thái cảnh giác liên tục. Amygdala ở chế độ "scan for threats" 24/7.',
      'Nếu điểm này thấp (stress thường xuyên), ưu tiên trước: xác định 1–2 nguồn gốc stress lớn nhất, thêm ít nhất 1 "buffer activity" mỗi ngày (thở, đi bộ, viết), đảm bảo ngủ đủ giấc.',
      'Stress mãn tính thường đến từ: quá nhiều cam kết, thiếu ranh giới rõ ràng, thiếu cảm giác kiểm soát, hoặc unresolved conflicts tích lũy. Không có kỹ thuật thở nào chữa được nếu không giải quyết nguồn gốc.',
      'Câu hỏi tự kiểm tra quan trọng: "Lần cuối cùng mình thực sự thư giãn hoàn toàn (không làm gì, không lo gì) là khi nào?" Nếu khó nhớ — đây là dấu hiệu cần chú ý.',
    ],
    points: [
      { icon: '📊', label: 'Thang Đo Ngược', note: '"Luôn luôn" = điểm thấp nhất' },
      { icon: '⚠️', label: 'Lo Âu Nền', note: 'Mơ hồ, không rõ nguyên nhân, liên tục' },
      { icon: '🎯', label: 'Mục Tiêu', note: 'Stress có nguyên nhân rõ, kết thúc rõ' },
      { icon: '🔍', label: 'Nguồn Gốc', note: 'Kỹ thuật không chữa được nếu không giải quyết gốc' },
    ],
  },
  {
    icon: '🔍', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Meta-Awareness — Nhận Diện Stress Của Bản Thân',
    img: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nhận ra mình đang stress là kỹ năng không tự nhiên có — nhiều người stress mãn tính không nhận ra vì nó đã trở thành trạng thái "bình thường", mất đi điểm tham chiếu về "cảm giác tốt" là gì.',
    detail: 'Meta-awareness (nhận thức về trạng thái của mình) là điều kiện tiên quyết cho mọi can thiệp stress khác. Không thể dùng kỹ thuật đúng nếu không biết đang ở tầng nào (cơ thể/cảm xúc/hành vi).',
    details: [
      'Stress blindness: người stress mãn tính thường mô tả bản thân là "bình thường" hoặc "chỉ hơi mệt" — amygdala đã adapt với mức cortisol cao mới, và não không còn "alert" về trạng thái này nữa.',
      'Dấu hiệu cơ thể là cảnh báo sớm nhất: nhận ra vai cứng, thở nông, tim đập nhanh hơn bình thường TRƯỚC KHI cảm xúc leo thang là kỹ năng quan trọng nhất trong quản lý stress.',
      'Self-check đơn giản 3 lần/ngày: sáng (khi thức dậy), trưa (sau bữa ăn), tối (trước ngủ) — hỏi "Mình đang cảm thấy thế nào? Stress ở đâu trong người?" Mất < 30 giây nhưng xây dựng awareness quan trọng.',
      'Journaling giúp nhận diện pattern: sau 2–3 tuần ghi lại, bạn có thể nhận ra "Thứ Hai và sau cuộc họp với X mình luôn stress cao hơn" — và chủ động chuẩn bị hoặc thay đổi.',
      'Phân biệt stress vật lý vs tâm lý: stress vật lý (thiếu ngủ, đau cơ, đói) thường nhầm là stress tâm lý. Kiểm tra cơ bản trước: uống nước, ăn, nghỉ ngơi — nếu cải thiện thì là vật lý.',
      'Điểm tham chiếu: nhớ lại 1 khoảnh khắc/ngày bạn cảm thấy tốt gần đây và "lưu" cảm giác đó như điểm tham chiếu cho "bình thường". Giúp nhận ra khi nào đang lệch khỏi baseline.',
    ],
    points: [
      { icon: '👁️', label: 'Meta-Awareness', note: 'Điều kiện tiên quyết cho mọi can thiệp' },
      { icon: '🔔', label: 'Cảnh Báo Sớm', note: 'Cơ thể → cảm xúc → hành vi (theo thứ tự)' },
      { icon: '📅', label: 'Self-Check 3x/ngày', note: 'Sáng/trưa/tối < 30 giây' },
      { icon: '📊', label: 'Pattern Recognition', note: 'Journal 2–3 tuần để nhận ra xu hướng' },
    ],
  },
  {
    icon: '🛠️', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Bộ Công Cụ Stress Cá Nhân',
    img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không phải mọi kỹ thuật đều hiệu quả với mọi người — có "personal stress toolkit" đã được thử nghiệm là yếu tố phân biệt người resilient với người dễ bị overwhelm trong cùng một hoàn cảnh.',
    detail: 'Câu hỏi này hỏi về "ít nhất 1 cách hiệu quả" — ngưỡng tối thiểu. Mục tiêu dài hạn là có 3–5 công cụ cho các tình huống khác nhau (mức stress khác nhau, thời gian có khác nhau, địa điểm khác nhau).',
    details: [
      'Tại sao cần nhiều hơn 1 công cụ: kỹ thuật thở hiệu quả khi stress ở 3–6 nhưng kém hiệu quả hơn ở 7–8 (khi PFC gần offline). Cần công cụ phù hợp với từng mức độ stress.',
      'Toolkit theo mức stress: 3–4 (thở 2 phút, đứng dậy đi lại), 5–6 (box breathing + journal 5 phút, đi bộ ngắn), 7–8 (nghỉ ngơi thực sự, gọi người thân, giảm commitments), 9–10 (tìm hỗ trợ chuyên nghiệp).',
      'Thử nghiệm để tìm cái phù hợp: dành 2 tuần thử 1 kỹ thuật nghiêm túc (ít nhất 3x/tuần). Nếu không có cải thiện nào sau 2 tuần, thử cái khác. Không phán xét sớm sau 1–2 lần.',
      'Điều kiện để kỹ thuật "hiệu quả": giảm được mức stress chủ quan 2+ điểm trong 10–15 phút, hoặc bạn cảm thấy rõ ràng tốt hơn sau khi thực hành. Nếu không — chưa phải công cụ phù hợp với bạn.',
      'Công cụ nhanh (< 5 phút): thở 4-7-8 x 4 vòng, physical pattern interrupt (rửa mặt nước lạnh, đứng dậy), 1 phút viết stream-of-consciousness, nghe 1 bài nhạc bạn biết từng note.',
      'Xây dựng toolkit: bắt đầu với kỹ thuật thở (phổ thông nhất, có bằng chứng mạnh). Sau khi thành thạo, thêm: journaling ngắn, đi bộ, kỹ thuật nhận thức (đặt tên cho suy nghĩ). Không học nhiều cùng lúc.',
    ],
    points: [
      { icon: '🎯', label: 'Personal Toolkit', note: 'Công cụ phù hợp với bạn, không phải ai cũng giống' },
      { icon: '📊', label: 'Theo Mức Stress', note: 'Công cụ khác nhau cho mức 3–4, 5–6, 7–8' },
      { icon: '🧪', label: 'Thử Nghiệm 2 Tuần', note: 'Cam kết đủ để đánh giá hiệu quả' },
      { icon: '🫁', label: 'Bắt Đầu Với Thở', note: 'Phổ thông, bằng chứng mạnh, học được nhanh' },
    ],
  },
  {
    icon: '🫁', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Thực Hành Thở Có Ý Thức Đều Đặn',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: '"Vài lần mỗi tuần" là ngưỡng tối thiểu để thở có ý thức trở thành skill có thể sử dụng trong tình huống stress thật — dưới ngưỡng này, bạn biết lý thuyết nhưng không nhớ đến khi cần nhất.',
    detail: 'Thực hành thở giống như thực hành piano: biết rằng có kỹ thuật không đủ — cần lặp lại đến mức cơ thể tự nhớ. Dưới 3x/tuần, kỹ thuật thở vẫn ở mức "conscious effort", chưa đến "automatic response khi stress".',
    details: [
      'Neurological basis: thực hành lặp lại củng cố neural pathway giữa "cảm thấy stress" → "thở chậm lại". Dưới 3x/tuần, pathway này yếu — khi stress thật (cortisol cao, amygdala kích hoạt), bạn quên mất việc thở.',
      'Minimum effective dose: nghiên cứu về thở mindful gợi ý 10–15 phút/ngày hoặc 3–4 phiên 5 phút/ngày đủ để có tác động đo được lên HRV và cortisol baseline sau 4–6 tuần.',
      'Làm thế nào để nhất quán: gắn với hành động có sẵn (anchor habit). Ví dụ: 3 hơi thở cơ hoành trước khi bắt đầu bữa ăn, 5 hơi thở trước khi mở laptop, 1 phút thở trước khi ngủ.',
      'Tiến trình: Tuần 1–2 (chỉ cần 3 hơi thở bụng đúng 1 lần/ngày) → Tuần 3–4 (5 phút box breathing 3x/tuần) → Tuần 5–6 (tự nhiên thở chậm khi nhận ra stress). Không cần rush.',
      'Dấu hiệu kỹ thuật đang internalize: bạn tự nhiên thở chậm lại khi bắt đầu bực bội — mà không cần nhắc nhở. Đây là mục tiêu thực sự của "vài lần mỗi tuần".',
      'Công cụ hỗ trợ: timer + nhắc nhở điện thoại 3x/ngày (10h, 14h, 18h) với nội dung "Thở 1 phút". Sau 3–4 tuần, bắt đầu cancel nhắc nhở vì bạn đã tự nhớ.',
    ],
    points: [
      { icon: '🧠', label: 'Neural Pathway', note: 'Lặp lại tạo phản xạ tự động khi stress' },
      { icon: '📅', label: '3x/Tuần', note: 'Ngưỡng tối thiểu để xây dựng skill' },
      { icon: '🔗', label: 'Anchor Habit', note: 'Gắn với hành động có sẵn để nhất quán' },
      { icon: '🎯', label: 'Mục Tiêu Thật', note: 'Tự nhớ thở khi stress, không cần nhắc' },
    ],
  },
  {
    icon: '🧘', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Khả Năng Ngồi Im 5 Phút Không Bồn Chồn',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không thể ngồi im 5 phút không phải "thiếu ý chí" — đó là dấu hiệu hệ thần kinh đang ở trạng thái hyperactivation mãn tính (cần input liên tục). Đây là điều có thể cải thiện được từ từ.',
    detail: 'Bồn chồn khi ngồi im phản ánh dopamine system đang quen với mức kích thích cao liên tục từ điện thoại, MXH, và môi trường. Không phải thiền là "không phù hợp với bạn" — mà là ngưỡng chịu đựng chưa được build up.',
    details: [
      'Default Mode Network (DMN): khi ngồi im, não kích hoạt DMN — mạng lưới xử lý ký ức, tưởng tượng và introspection. Nếu chưa quen, DMN tạo ra "bồn chồn" vì não interpret idle = không an toàn (từ evolutionary logic).',
      'Dopamine ngưỡng: sau nhiều năm stimulation cao (MXH, content, thông báo), dopamine system cần mức kích thích cao hơn để không cảm thấy "chán". Ngồi im = dưới ngưỡng kích thích → bồn chồn. Cần hạ ngưỡng dần.',
      'Bắt đầu đúng cách: không bắt đầu với 5 phút. Bắt đầu với 60 giây ngồi im hoàn toàn. Tăng 30 giây/tuần. Đây là cách xây dựng "stillness tolerance" từng bước — không phải ý chí mà là adaptation sinh lý.',
      'Kỳ vọng đúng: ngồi im KHÔNG có nghĩa là không có suy nghĩ nào. Suy nghĩ sẽ đến và đi — mục tiêu là quan sát chúng, không phải xóa chúng. "Tốt" hay "xấu" không phải tiêu chí — nhất quán mới là tiêu chí.',
      'Môi trường hỗ trợ: tắt thông báo điện thoại, không check điện thoại trong 30 phút đầu và cuối ngày — làm giảm baseline stimulation và khiến ngồi im dễ hơn sau 1–2 tuần.',
      'Bẫy phổ biến: cảm thấy bồn chồn → bỏ cuộc → kết luận "mình không phù hợp với thiền". Thực ra, cảm giác bồn chồn là BÌNH THƯỜNG và là phần của quá trình — ngồi qua nó (dù khó) là bài tập thực sự.',
    ],
    points: [
      { icon: '🌐', label: 'DMN Activation', note: 'Idle time = não xử lý nội tâm quan trọng' },
      { icon: '📉', label: 'Hạ Ngưỡng Kích Thích', note: 'Giảm MXH → stillness dễ hơn' },
      { icon: '⏱️', label: 'Bắt Đầu Với 60 Giây', note: 'Tăng 30 giây/tuần, không rush' },
      { icon: '✅', label: 'Tiêu Chí Đúng', note: 'Nhất quán, không phải "không có suy nghĩ"' },
    ],
  },
  {
    icon: '🌫️', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Autopilot & Sống Trong Hiện Tại',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Harvard Study (Killingsworth, 2010): não người lang thang (không chú ý đến việc đang làm) 47% thời gian thức — và những lúc đó, người ta kém hạnh phúc hơn bất kể đang làm gì.',
    detail: 'Câu này dùng thang đo ngược: "Luôn luôn không để ý" = điểm thấp. Sống trên autopilot không phải lỗi đạo đức — đó là kết quả tự nhiên của việc sống trong môi trường kích thích cao liên tục không có khoảng dừng.',
    details: [
      'Mind Wandering Study (Harvard): 2,250 người được sampling ngẫu nhiên trong ngày bằng smartphone. Kết quả: 47% thời gian não không tập trung vào việc đang làm, và đây dự báo mức độ không hạnh phúc mạnh hơn bất kỳ hoạt động nào.',
      'Autopilot không hoàn toàn xấu: một số task cần autopilot (lái xe quen đường, gõ bàn phím). Vấn đề là khi autopilot chiếm cả những khoảnh khắc quan trọng: ăn với gia đình, cuộc trò chuyện ý nghĩa.',
      'Mindfulness không phải thiền định 30 phút — đó là bất kỳ khoảnh khắc nào bạn thực sự chú ý đến điều đang xảy ra. Ăn sáng mà không nhìn điện thoại = mindful eating. 3 hơi thở có ý thức = mindful breathing.',
      'Sensory anchors giúp thoát autopilot: khi nhận ra mình đang "không ở đây", dùng 5-4-3-2-1 grounding (5 thứ thấy, 4 thứ sờ, 3 thứ nghe, 2 thứ ngửi, 1 thứ nếm). Đưa não về hiện tại trong 60 giây.',
      'Digital distraction là nguyên nhân lớn nhất của autopilot hiện đại: mỗi khi check điện thoại vô thức, não học rằng "khi buồn/nhàm chán → check điện thoại" thay vì "khi buồn/nhàm chán → chú ý đến xung quanh".',
      'Luyện tập đơn giản nhất: chọn 1 hoạt động mỗi ngày để làm "với toàn bộ sự chú ý" (bữa sáng, tắm, đi bộ). Không phải mọi thứ — chỉ 1. Đây là đủ để bắt đầu build mindfulness.',
    ],
    points: [
      { icon: '🔬', label: 'Harvard Study', note: '47% thời gian tâm trí lang thang = kém hạnh phúc' },
      { icon: '⚓', label: 'Sensory Anchor', note: '5-4-3-2-1 grounding đưa não về hiện tại' },
      { icon: '📱', label: 'Digital Distraction', note: 'Nguyên nhân lớn nhất của autopilot hiện đại' },
      { icon: '🎯', label: 'Thực Hành Nhỏ', note: '1 hoạt động/ngày "với toàn bộ sự chú ý"' },
    ],
  },
  {
    icon: '👁️', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Quan Sát Suy Nghĩ Không Bị Cuốn Vào',
    img: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cognitive defusion (ACT) và "witness consciousness" (thiền định): khả năng quan sát suy nghĩ mà không đồng nhất với chúng là core skill của cả CBT, ACT, và mindfulness — và hoàn toàn có thể luyện tập.',
    detail: 'Fusion = "Tôi là suy nghĩ của mình". Defusion = "Tôi là người đang có suy nghĩ". Khoảng cách nhỏ trong ngôn ngữ tạo ra sự khác biệt lớn trong trải nghiệm: cùng nội dung suy nghĩ, nhưng ít tác động cảm xúc hơn.',
    details: [
      'Cognitive fusion vs defusion: fusion là khi bạn "trở thành" suy nghĩ — "Tôi thất bại" → bạn cảm thấy mình là người thất bại. Defusion là quan sát: "Tôi đang có suy nghĩ rằng mình thất bại" → bạn nhìn suy nghĩ như một sự kiện.',
      'fMRI evidence: cách diễn đạt "Tôi đang có suy nghĩ rằng..." thay vì "Tôi thật sự..." kích hoạt vỏ não trước trán và giảm hoạt động amygdala trong thời gian thực — đo được bằng máy.',
      'Metaphor "đám mây": tưởng tượng suy nghĩ như đám mây trôi qua bầu trời. Bạn là bầu trời — luôn ở đó dù đám mây có màu gì. Suy nghĩ đến và đi, bạn không phải là suy nghĩ đó.',
      'Kỹ thuật "đặt tên": khi suy nghĩ tiêu cực xuất hiện, đặt tên cho nó: "Đây là suy nghĩ catastrophizing" / "Đây là vòng lặp lo âu thường gặp của mình" — naming tạo khoảng cách và giảm cường độ.',
      'Luyện tập trong thiền: ngồi im 5 phút, quan sát suy nghĩ đến và đi mà không cố xóa chúng hoặc bám vào chúng. Mỗi khi nhận ra mình bị cuốn vào — nhẹ nhàng trở về quan sát. Mỗi lần "trở về" đó là một rep luyện tập.',
      'Ứng dụng thực tế: lần tới khi có suy nghĩ tiêu cực mạnh, thêm "Mình nhận ra mình đang có suy nghĩ rằng..." ở đầu câu. Làm điều này 10 lần/ngày trong 1 tuần và nhận thấy sự thay đổi.',
    ],
    points: [
      { icon: '🔭', label: 'Defusion', note: '"Tôi có suy nghĩ" ≠ "Tôi là suy nghĩ"' },
      { icon: '☁️', label: 'Metaphor Đám Mây', note: 'Suy nghĩ đến và đi, bạn là bầu trời' },
      { icon: '🏷️', label: 'Đặt Tên', note: 'Naming giảm cường độ cảm xúc đo được' },
      { icon: '🔄', label: 'Mỗi Lần Trở Về', note: 'Là 1 rep luyện tập, không phải thất bại' },
    ],
  },
  {
    icon: '📱', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Thói Quen Điện Thoại Sáng/Tối',
    img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80&auto=format&fit=crop',
    keyFact: '30 phút đầu và cuối ngày là thời gian có tác động không cân xứng lên toàn bộ ngày và giấc ngủ. Cầm điện thoại trong 2 khoảng này đặt não vào trạng thái reactive thay vì proactive.',
    detail: 'Câu này dùng thang đo ngược: "Luôn luôn" cầm điện thoại ngay khi thức dậy/trước ngủ = điểm thấp. Điện thoại sáng sớm không phải vấn đề về giờ giấc — mà là về việc ai đang định hình trạng thái tinh thần của bạn ngay khi bạn dễ bị ảnh hưởng nhất.',
    details: [
      'Buổi sáng — "Golden Hour": trong 30–60 phút sau khi thức, não ở trạng thái theta-alpha — dễ tiếp nhận, sáng tạo và set intention. Cầm điện thoại ngay = bỏ lỡ cửa sổ này, thay vào đó là email/tin tức người khác định agenda cho bạn.',
      'Cortisol Awakening Response (CAR): cortisol tự nhiên đạt đỉnh 30 phút sau khi thức — thời điểm tốt nhất để thiền, journal, hoặc tập trung. Ánh sáng xanh điện thoại làm nhiễu loạn nhịp này.',
      'Buổi tối — "Wind-Down Window": 60–90 phút trước ngủ, não cần giảm cortisol và norepinephrine để melatonin tiết ra. Nội dung điện thoại (tin tức, MXH, email) là kích thích tâm lý — làm trì hoãn quá trình này.',
      'Ánh sáng xanh (420–480nm) ức chế melatonin — nhưng nghiên cứu gần đây cho thấy tác hại tâm lý của nội dung điện thoại (arousal từ content) có thể lớn hơn tác hại ánh sáng đơn thuần.',
      'Thay thế thực tế: buổi sáng (3 hơi thở + 1 ý định cho ngày), buổi tối (10 phút đọc sách giấy + viết 3 câu về ngày hôm nay). Cả 2 hoạt động này gộp lại < 15 phút nhưng tác động đáng kể.',
      'Kỹ thuật giảm dần: nếu thói quen đã ăn sâu, không cần bỏ hoàn toàn ngay. Tuần 1: trì hoãn cầm điện thoại sáng thêm 10 phút. Tuần 2: 20 phút. Tuần 3–4: 30 phút. Xây dựng habit thay thế song song.',
    ],
    points: [
      { icon: '🌅', label: 'Golden Hour Sáng', note: 'Theta-alpha state — thiền/journal hiệu quả nhất' },
      { icon: '🌙', label: 'Wind-Down Tối', note: '60–90 phút trước ngủ = cần giảm arousal' },
      { icon: '💡', label: 'Ánh Sáng Xanh', note: 'Tác hại tâm lý của content > tác hại ánh sáng' },
      { icon: '📉', label: 'Giảm Dần', note: 'Trì hoãn 10 phút → 20 phút → 30 phút/tuần' },
    ],
  },
  {
    icon: '🎯', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Deep Work Không Bị Gián Đoạn',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cal Newport (Deep Work): khả năng tập trung không bị gián đoạn vào công việc khó là kỹ năng đang ngày càng hiếm — và ngày càng có giá trị. Như một cơ bắp: không luyện thì teo, luyện thì mạnh hơn.',
    detail: 'Gloria Mark (UC Irvine): mỗi lần bị ngắt quãng cần trung bình 23 phút để đạt lại trạng thái tập trung sâu. Kiểm tra điện thoại mỗi vài phút = không bao giờ đạt được trạng thái deep work trong ngày làm việc.',
    details: [
      '23-minute recovery: sau mỗi lần bị ngắt quãng (thông báo, câu hỏi, check MXH), PFC cần 23 phút để đạt lại mức tập trung sâu trước đó. 4 lần bị ngắt = mất gần 2 giờ tập trung trong ngày 8 giờ.',
      'Flow state requirements: để đạt trạng thái "flow" (tập trung hoàn toàn, năng suất và sự hài lòng cao nhất), cần: task vừa sức (không quá dễ, không quá khó), không bị ngắt quãng ít nhất 20–25 phút, và ý định rõ ràng.',
      'Attention residue (Sophie Leroy): khi chuyển từ task A sang task B, một phần attention vẫn "ở lại" với A. Đây là lý do đa nhiệm (multitasking) không hiệu quả — bạn không thực sự làm 2 việc cùng lúc mà làm cả 2 ở mức kém hơn.',
      'Phone proximity effect (Adrian Ward): chỉ cần điện thoại nằm trên bàn (dù úp mặt, tắt tiếng) làm giảm cognitive capacity — não dùng năng lượng để kháng cự không nhìn điện thoại. Giải pháp: để điện thoại ở phòng khác.',
      'Deep Work blocks: làm việc theo khối 90 phút (1 Pomodoro cycle, hay 1 ultradian rhythm cycle). Trước: tắt tất cả thông báo, đặt điện thoại ngoài tầm với, viết rõ task cần hoàn thành. Sau: break có chủ ý 15–20 phút.',
      'Xây dựng dần: nếu chưa quen với deep work, bắt đầu với 25 phút không gián đoạn (1 Pomodoro). Sau 1 tuần, tăng lên 50 phút. Mục tiêu dài hạn: 2–4 giờ deep work/ngày trong khối liên tục.',
    ],
    points: [
      { icon: '⏱️', label: '23 Phút Phục Hồi', note: 'Chi phí thực của mỗi lần bị ngắt quãng' },
      { icon: '🌊', label: 'Flow State', note: 'Cần 20–25 phút liên tục để vào được' },
      { icon: '📵', label: 'Phone Proximity', note: 'Điện thoại trên bàn = giảm cognitive capacity' },
      { icon: '⬛', label: 'Deep Work Blocks', note: '90 phút không gián đoạn = 1 block' },
    ],
  },
  {
    icon: '😴', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Chất Lượng Giấc Ngủ — Thức Dậy Mệt Mỏi',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thức dậy mệt mỏi thường xuyên không phải "cần thêm caffein" — đó là tín hiệu giấc ngủ không restorative: thiếu NREM3 (ngủ sâu) hoặc REM, thường do stress, ánh sáng xanh, hoặc schedule không nhất quán.',
    detail: 'Câu này dùng thang đo ngược: "Luôn luôn thức dậy mệt" = điểm thấp. Chất lượng giấc ngủ (% NREM3 + REM) quan trọng hơn số giờ — 6 giờ ngủ sâu tốt hơn 9 giờ ngủ nông bị gián đoạn.',
    details: [
      'Sleep architecture: giấc ngủ có chu kỳ 90 phút — N1 (buồn ngủ) → N2 (ngủ nhẹ) → N3 (ngủ sâu, NREM) → REM (mơ, xử lý cảm xúc). Thức dậy mệt thường là dấu hiệu thiếu N3 hoặc thiếu REM.',
      'Glymphatic system: trong N3 (deep sleep), não co lại ~60% để dịch não tủy chảy qua và rửa sạch beta-amyloid và tau protein (liên quan đến Alzheimer nếu tích lũy). Thiếu N3 = không "dọn rác" não đủ.',
      'REM sleep và cảm xúc: REM là lúc não xử lý và tích hợp cảm xúc ngày hôm trước — như một "therapist ban đêm". Thiếu REM → mang theo cảm xúc chưa được xử lý sang ngày hôm sau → dễ reactive.',
      'Nguyên nhân phổ biến của giấc ngủ kém: giờ ngủ không nhất quán (lệch nhịp sinh học), cafein sau 14h, rượu (disrupt REM), màn hình tối, phòng quá ấm (lý tưởng: 17–19°C), stress chưa được xả trước ngủ.',
      'Sleep debt là tích lũy: thiếu 1–2 giờ/đêm tích lũy thành sleep debt đáng kể sau 1 tuần — cognitive performance giảm tương đương với không ngủ liên tục 24 giờ, nhưng người đó không tự nhận ra.',
      'Cải thiện nhanh nhất: giờ thức dậy cố định 7 ngày/tuần (kể cả cuối tuần) là can thiệp đơn lẻ có tác động lớn nhất lên chất lượng giấc ngủ theo Matthew Walker — giúp reset circadian rhythm.',
    ],
    points: [
      { icon: '🧠', label: 'Glymphatic System', note: 'N3 ngủ sâu → não dọn rác beta-amyloid' },
      { icon: '🎭', label: 'REM & Cảm Xúc', note: 'REM = therapist ban đêm xử lý cảm xúc' },
      { icon: '⏰', label: 'Giờ Thức Cố Định', note: 'Can thiệp đơn lẻ hiệu quả nhất (kể cả cuối tuần)' },
      { icon: '☕', label: 'Cafein Cutoff', note: 'Không dùng cafein sau 14h' },
    ],
  },
  {
    icon: '🌙', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: '7–9 Tiếng Ngủ — Tại Sao Không Thể Thương Lượng',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Matthew Walker (Why We Sleep): chưa tìm thấy bất kỳ chức năng sinh lý hoặc tâm lý nào KHÔNG bị suy giảm bởi thiếu ngủ. Ngủ không phải xa xỉ — là maintenance bắt buộc của hệ thống.',
    detail: '7–9 giờ là khuyến nghị của WHO và American Academy of Sleep Medicine cho người trưởng thành. Dưới 7 giờ liên tục > 2 tuần: cognitive performance giảm tương đương say rượu (BAC 0.10%), nhưng người đó không tự nhận ra.',
    details: [
      'Sleep deprivation disguised as normal: người thiếu ngủ mãn tính (6 giờ/đêm) thường đánh giá mình "ổn" hoặc "đã quen" — nhưng performance tests cho thấy suy giảm rõ ràng. Thiếu ngủ làm mất khả năng nhận ra mình đang suy giảm.',
      'Immune system: một đêm ngủ < 6 giờ làm giảm NK cells 70%. Thiếu ngủ mãn tính tăng nguy cơ cảm cúm 4.5x — giải thích tại sao người thiếu ngủ bệnh thường xuyên hơn.',
      'Testosterone và hormone: testosterone ở nam giảm 10–15% sau 1 tuần ngủ 5 giờ/đêm. Tương đương với lão hóa 10–15 năm về mức hormone. Growth hormone tiết chủ yếu trong N3 sleep.',
      'Trí nhớ và học tập: sleep spindles (trong N2) chuyển ký ức ngắn hạn thành ký ức dài hạn. Không ngủ đủ sau khi học = bỏ lỡ consolidation — thông tin sẽ không được "save" đúng nghĩa.',
      '"Short sleeper gene" là cực kỳ hiếm: chỉ ~3% dân số có gene cho phép ngủ < 6 giờ mà không suy giảm. Nếu bạn nghĩ mình "chỉ cần 5–6 giờ" — khả năng 97% bạn đang bị thiếu ngủ mà không nhận ra.',
      'Ngủ không thể "bù đắp": ngủ bù cuối tuần không hoàn toàn phục hồi được những gì mất trong tuần. Một số tác hại (đặc biệt về hormone và immune) tích lũy và không đảo ngược bằng sleep recovery.',
    ],
    points: [
      { icon: '🧪', label: 'Performance = Say Rượu', note: '< 7 giờ/đêm liên tục 2 tuần' },
      { icon: '🛡️', label: 'NK Cells -70%', note: 'Một đêm thiếu ngủ làm miễn dịch sụp đổ' },
      { icon: '📚', label: 'Memory Consolidation', note: 'Sleep spindles chuyển ký ức thành dài hạn' },
      { icon: '⚠️', label: 'Không Thể Bù', note: 'Ngủ bù cuối tuần không hoàn toàn phục hồi' },
    ],
  },
  {
    icon: '📓', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Thực Hành Ghi Lại Suy Nghĩ & Cảm Xúc',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Journaling có bằng chứng khoa học mạnh nhất trong số các self-care practices đơn giản: cải thiện hệ miễn dịch, giảm triệu chứng lo âu và trầm cảm, và tăng working memory — tất cả từ 15–20 phút/ngày.',
    detail: 'James Pennebaker (UT Austin, 30+ năm nghiên cứu): expressive writing về cảm xúc/suy nghĩ trong 3–4 ngày liên tiếp, 15–20 phút mỗi lần, dẫn đến cải thiện đo được về sức khỏe cả tâm lý và thể chất.',
    details: [
      'Pennebaker Effect: ghi lại cảm xúc khó (stress, grief, anger) giúp não chuyển từ xử lý cảm xúc (amygdala) sang đặt ngôn từ và narrative (PFC). Quá trình này tạo ra "closure" và giải phóng cognitive resources.',
      'Immune function: trong các RCT của Pennebaker, nhóm expressive writing có ít lần đến bác sĩ hơn, T-helper cell count cao hơn và phục hồi nhanh hơn sau vaccine trong 6 tháng so với nhóm viết về chủ đề trung tính.',
      'Zeigarnik Effect: não nhớ và "replay" việc chưa hoàn thành nhiều hơn việc đã xong. Viết ra "open loops" (lo lắng, việc cần làm, cảm xúc chưa xử lý) đủ để tạo "closure giả lập" — não thả ra và ngừng loop.',
      'Working memory boost: expressive writing giải phóng working memory khỏi việc phải "giữ" những suy nghĩ và cảm xúc nặng nề — não có thêm tài nguyên cho các tasks khác. Cải thiện GRE performance đo được trong 1 RCT.',
      'Không cần viết đẹp hoặc dài: 1–5 câu hoàn toàn đủ cho daily journaling. Mục tiêu là nhất quán (mỗi ngày) hơn là chất lượng từng entry. Stream-of-consciousness (viết gì đến viết đó không lọc) thường hiệu quả hơn viết có cấu trúc.',
      'Khi nào nên journal: tối trước ngủ (xử lý ngày + giảm mind-racing) hoặc sáng (set intention + xả những gì đang trong đầu). Cả 2 đều hiệu quả — chọn cái bạn sẽ nhất quán nhất.',
    ],
    points: [
      { icon: '🧬', label: 'Pennebaker Effect', note: 'Immune function + tâm lý cải thiện đo được' },
      { icon: '🔓', label: 'Zeigarnik Loop', note: 'Viết ra = đóng open loops, não thả ra' },
      { icon: '🧠', label: 'Working Memory', note: 'Giải phóng tài nguyên cho tasks quan trọng' },
      { icon: '✏️', label: '1–5 Câu Đủ', note: 'Nhất quán > chất lượng từng entry' },
    ],
  },
  {
    icon: '💧', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Xử Lý Cảm Xúc Lành Mạnh — Không Dồn Nén',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Emotional suppression không làm cảm xúc biến mất — nó tăng physiological arousal, tiêu tốn cognitive resources, và thường dẫn đến bùng phát cảm xúc mạnh hơn (rebound effect) sau đó.',
    detail: 'James Gross (Stanford) — Emotion Regulation theory: suppression (dồn nén) và reappraisal (đặt lại nhận thức) là 2 chiến lược cơ bản. Suppression có chi phí cao hơn và hiệu quả thấp hơn reappraisal về lâu dài.',
    details: [
      'Suppression paradox: cố gắng không nghĩ đến điều gì làm bạn nghĩ về nó nhiều hơn (Wegner White Bear experiment, 1987). Dồn nén cảm xúc tương tự — nó sẽ tìm cách biểu hiện, thường vào thời điểm ít thuận lợi nhất.',
      'Physiological cost: suppression tăng arousal tim mạch ở cả người suppressing VÀ người mà họ đang nói chuyện cùng. Nỗ lực "kiểm soát" cảm xúc làm tăng stress responses thay vì giảm.',
      'Cognitive cost: dồn nén cảm xúc tiêu tốn working memory — bạn cần dùng tài nguyên nhận thức để "giữ" cảm xúc lại. Đây là lý do sau khi phải suppression nhiều (họp căng thẳng), bạn cảm thấy kiệt sức dù không làm gì nặng.',
      'Reappraisal thay thế: thay đổi cách nhìn về tình huống (không phải "tôi thất bại" mà "tôi học được điều gì đó") có chi phí nhận thức thấp hơn và hiệu quả cao hơn dài hạn. PFC được kích hoạt, amygdala giảm hoạt động.',
      'Affect labeling: đặt tên chính xác cho cảm xúc ("Tôi đang cảm thấy thất vọng vì...") là cách xử lý cảm xúc đơn giản nhất có bằng chứng fMRI — giảm amygdala activation và tăng PFC ngay lập tức.',
      'Khi nào cần hỗ trợ: nếu bạn thường xuyên không biết mình đang cảm thấy gì (alexithymia), hoặc cảm xúc thường bùng phát không kiểm soát được — đây là dấu hiệu nên nói chuyện với chuyên gia tâm lý.',
    ],
    points: [
      { icon: '🚫', label: 'Suppression Paradox', note: 'Cố không nghĩ = nghĩ nhiều hơn' },
      { icon: '🔋', label: 'Cognitive Cost', note: 'Dồn nén tiêu tốn working memory' },
      { icon: '🔄', label: 'Reappraisal', note: 'Đặt lại nhận thức — hiệu quả hơn, rẻ hơn' },
      { icon: '🏷️', label: 'Affect Labeling', note: 'Đặt tên cảm xúc → amygdala giảm ngay' },
    ],
  },
  {
    icon: '🏔️', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Resilience & Khả Năng Tiếp Tục Khi Gặp Khó Khăn',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dễ từ bỏ khi gặp khó khăn nhỏ thường không phải "thiếu ý chí" — mà là thiếu self-efficacy (Bandura) hoặc kế hoạch không có cơ chế xử lý trở ngại. Cả 2 đều có thể được build lên.',
    detail: 'Câu này dùng thang đo ngược: "Luôn luôn từ bỏ" = điểm thấp. Angela Duckworth (Grit): thành công dài hạn dự báo bởi grit (đam mê + kiên trì) mạnh hơn IQ, tài năng, hay hoàn cảnh gia đình.',
    details: [
      'Self-efficacy (Albert Bandura): niềm tin vào khả năng hoàn thành một task cụ thể. Người có self-efficacy cao trong một lĩnh vực tiếp tục khi gặp khó khăn vì họ tin "mình có thể vượt qua" — không phải vì họ không cảm thấy khó.',
      'Implementation intentions: nghiên cứu của Peter Gollwitzer cho thấy kế hoạch dạng "Nếu X xảy ra, tôi sẽ làm Y" tăng đáng kể tỷ lệ tiếp tục khi gặp trở ngại. Kế hoạch không có contingency plan dễ bị abandon.',
      'Consistency > intensity: từ bỏ thường xảy ra khi đặt mục tiêu quá cao và cố làm "đủ lớn" ngay từ đầu. Làm 10 phút mỗi ngày trong 3 tháng > làm 3 giờ 1 lần rồi bỏ. Identity consistency trumps episode intensity.',
      'Failure reframe: nghiên cứu về growth mindset (Dweck) cho thấy cách diễn giải thất bại quan trọng hơn thất bại bản thân. "Mình thất bại" (fixed) vs "Mình chưa tìm được cách phù hợp" (growth) → behavior khác nhau hoàn toàn.',
      'Environmental design: ý chí (willpower) là tài nguyên có giới hạn. Thay vì "cố" tiếp tục, thiết kế môi trường để việc tiếp tục trở nên dễ hơn và việc bỏ cuộc trở nên khó hơn. Remove friction cho hành vi tốt.',
      'Tiny habits (BJ Fogg): bắt đầu với version nhỏ nhất có thể của habit (2 phút thay vì 30 phút). Khi gặp khó khăn, không bỏ cuộc — "scale down" xuống mức nhỏ nhất có thể vẫn được tính là "làm". Nhất quán quan trọng hơn liều lượng.',
    ],
    points: [
      { icon: '💪', label: 'Self-Efficacy', note: 'Niềm tin vào khả năng quan trọng hơn khả năng thực' },
      { icon: '🗺️', label: 'Contingency Plan', note: '"Nếu X thì tôi sẽ Y" tăng tỷ lệ tiếp tục' },
      { icon: '🌱', label: 'Growth Mindset', note: '"Chưa tìm ra cách" thay vì "Tôi thất bại"' },
      { icon: '🔽', label: 'Scale Down', note: 'Khi khó: nhỏ hơn nhưng nhất quán, không bỏ' },
    ],
  },
  {
    icon: '💚', color: QM_COLOR, rgb: QM_RGB,
    modalTitle: 'Self-Compassion — Tử Tế Với Bản Thân Khi Thất Bại',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Kristin Neff (UT Austin): người có self-compassion cao thất bại ít hơn không phải vì họ dễ dãi — mà vì họ không bị tê liệt bởi sợ thất bại và không mất thời gian tự trách thay vì học và thử lại.',
    detail: 'Self-compassion ≠ self-pity (tự thương hại). 3 thành phần: self-kindness (tử tế với bản thân), common humanity (nhận ra thất bại là phần của trải nghiệm con người), và mindfulness (không cường điệu cũng không phủ nhận).',
    details: [
      'Self-compassion vs self-esteem: self-esteem phụ thuộc vào thành công và so sánh với người khác — dễ bị mất khi thất bại. Self-compassion độc lập với kết quả — duy trì ổn định hơn và predict wellbeing tốt hơn.',
      'Accountability paradox: nghiên cứu của Neff cho thấy người có self-compassion cao thực ra có trách nhiệm với bản thân cao hơn — vì không sợ nhìn nhận thất bại, họ dễ học từ nó thay vì phủ nhận hoặc né tránh.',
      'Cortisol and self-criticism: tự trách bản thân kích hoạt threat defense system và tăng cortisol — não vào chế độ defensive, không phải learning mode. Bạn không thể học tốt trong khi tấn công bản thân.',
      'Oxytocin: tự nói chuyện với bản thân theo cách tử tế (như với bạn thân) kích hoạt oxytocin — hormone kết nối và an toàn. Oxytocin đối kháng cortisol và tạo trạng thái an toàn để học hỏi.',
      'Common humanity component: "Nhiều người cũng gặp điều này" — tái nhận thức thất bại như một phần của trải nghiệm con người chung, không phải điều đặc biệt xấu hổ của riêng bạn, giảm isolation và shame.',
      'Bài tập thực hành: khi thất bại, hỏi "Nếu bạn thân mình gặp điều này, mình sẽ nói gì với họ?" — rồi nói điều đó với bản thân mình. Khoảng cách góc nhìn thường đủ để chuyển từ harsh self-judgment sang compassionate response.',
    ],
    points: [
      { icon: '🎭', label: '3 Thành Phần', note: 'Self-kindness + Common humanity + Mindfulness' },
      { icon: '📊', label: 'Accountability Cao Hơn', note: 'Self-compassion → không sợ nhìn nhận thất bại' },
      { icon: '🧬', label: 'Oxytocin', note: 'Tự nói chuyện tốt → oxytocin đối kháng cortisol' },
      { icon: '👥', label: 'Common Humanity', note: '"Nhiều người cũng gặp" → giảm shame và isolation' },
    ],
  },
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

function getScore(answers) {
  let total = 0;
  QUESTIONS.forEach(q => {
    const v = answers[q.id] || 3;
    total += q.rev ? (6 - v) : v;
  });
  return Math.round((total / (QUESTIONS.length * 5)) * 100);
}

function getLevel(score) {
  if (score >= 80) return { label: 'Tâm Trí Vững', color: '#10b981', icon: '🌟', desc: 'Bạn đang có nền tảng tâm trí rất tốt. Tiếp tục duy trì và đi sâu hơn!' };
  if (score >= 60) return { label: 'Đang Phát Triển', color: '#f59e0b', icon: '🌱', desc: 'Bạn có cơ sở tốt. Tập trung vào những khu vực điểm thấp để cải thiện nhanh hơn.' };
  if (score >= 40) return { label: 'Cần Chú Ý', color: '#ef4444', icon: '⚠️', desc: 'Tâm trí đang chịu nhiều áp lực. Bắt đầu với 1–2 kỹ thuật đơn giản nhất.' };
  return { label: 'Cần Hỗ Trợ', color: '#dc2626', icon: '🆘', desc: 'Hãy ưu tiên sức khỏe tâm thần. Cân nhắc nói chuyện với chuyên gia.' };
}

export default function MindAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [qModal, setQModal] = useState(null);
  const answered = Object.keys(answers).length;
  const score = submitted ? getScore(answers) : 0;
  const level = submitted ? getLevel(score) : null;

  const cats = [...new Set(QUESTIONS.map(q => q.cat))];
  const catScores = cats.map(cat => {
    const qs = QUESTIONS.filter(q => q.cat === cat);
    const s = qs.reduce((acc, q) => {
      const v = answers[q.id] || 3;
      return acc + (q.rev ? (6 - v) : v);
    }, 0);
    return { cat, pct: Math.round((s / (qs.length * 5)) * 100) };
  });

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dAssessmentOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dAssessmentOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  const grouped = cats.map(cat => ({ cat, qs: QUESTIONS.filter(q => q.cat === cat) }));

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Tâm Trí An Nhiên</span>
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>🧠</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">Đánh Giá Sức Khỏe Tâm Trí</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>D0 · Bài Test Nhập Môn</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">Bài đánh giá 15 câu hỏi giúp bạn hiểu mức độ sức khỏe tâm trí hiện tại và nhận gợi ý cá nhân hóa về nên tập trung vào đâu trước.</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop" alt="Assessment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>15 câu · ~5 phút</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {!submitted ? (
        <RevealBlock className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: COLOR }}>Bài Kiểm Tra</h2>
            <span className="text-lg text-muted">{answered}/{QUESTIONS.length} câu</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface border border-border mb-8 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${answered / QUESTIONS.length * 100}%`, background: COLOR }} />
          </div>
          <div className="space-y-6">
            {grouped.map(g => (
              <div key={g.cat}>
                <p className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: COLOR }}>{g.cat}</p>
                <div className="space-y-4">
                  {g.qs.map((q, i) => (
                    <div key={q.id} className="group/card rounded-2xl border border-border bg-surface p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <p className="text-lg text-text leading-relaxed">{i + 1}. {q.q}</p>
                        <button onClick={() => setQModal(QUESTIONS.indexOf(q))}
                          className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer"
                          style={{ color: QM_COLOR, borderColor: 'rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.08)' }}>chi tiết →</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {OPTIONS.map(o => (
                          <button key={o.v} onClick={() => setAnswers(p => ({ ...p, [q.id]: o.v }))}
                            className="px-3 py-1.5 rounded-full text-base border transition-all"
                            style={answers[q.id] === o.v
                              ? { background: COLOR, color: '#fff', borderColor: COLOR }
                              : { background: 'transparent', color: '#888', borderColor: '#333' }}>
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => answered === QUESTIONS.length && setSubmitted(true)}
              disabled={answered < QUESTIONS.length}
              className="px-8 py-3 rounded-full font-bold text-lg transition-all disabled:opacity-40"
              style={{ background: COLOR, color: '#fff' }}
            >
              {answered < QUESTIONS.length ? `Còn ${QUESTIONS.length - answered} câu chưa trả lời` : 'Xem kết quả →'}
            </button>
          </div>
        </RevealBlock>
      ) : (
        <RevealBlock className="mb-10">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{level.icon}</div>
            <div className="text-6xl font-black mb-2" style={{ color: level.color }}>{score}</div>
            <div className="text-2xl font-bold text-text mb-3">{level.label}</div>
            <p className="text-muted max-w-lg mx-auto">{level.desc}</p>
          </div>
          <div className="space-y-3 mb-8">
            {catScores.map(c => (
              <div key={c.cat} className="flex items-center gap-4">
                <span className="text-lg text-muted w-32 shrink-0">{c.cat}</span>
                <div className="flex-1 h-2 rounded-full bg-surface border border-border overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.pct >= 70 ? '#10b981' : c.pct >= 50 ? '#f59e0b' : '#ef4444' }} />
                </div>
                <span className="text-lg font-bold w-10 text-right" style={{ color: c.pct >= 70 ? '#10b981' : c.pct >= 50 ? '#f59e0b' : '#ef4444' }}>{c.pct}%</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="px-6 py-2.5 rounded-full text-lg border border-border text-muted hover:text-text transition-colors mr-3">Làm lại</button>
            <Link to="/pillar/d/roadmap" className="inline-block px-6 py-2.5 rounded-full text-lg font-bold" style={{ background: COLOR, color: '#fff' }}>Xem lộ trình →</Link>
          </div>
        </RevealBlock>
      )}

      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Tâm Trí An Nhiên</span>
      </Link>

      {qModal !== null && (
        <CardModal
          item={QUESTION_MODALS[qModal]}
          onClose={() => setQModal(null)}
          onPrev={() => setQModal(i => Math.max(0, i - 1))}
          onNext={() => setQModal(i => Math.min(QUESTION_MODALS.length - 1, i + 1))}
          hasPrev={qModal > 0}
          hasNext={qModal < QUESTION_MODALS.length - 1}
          total={QUESTION_MODALS.length}
          idx={qModal}
        />
      )}
    </div>
  );
}
