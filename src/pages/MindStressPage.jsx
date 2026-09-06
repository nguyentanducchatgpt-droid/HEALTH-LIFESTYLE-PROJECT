import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#8b5cf6';
const RGB = '139,92,246';
const ORBIT_ID = 'd-stress-orbit-kf';
const ORBIT_PROP = '--d-stress-angle';
const ORBIT_CLASS = 'd-stress-orbit-ring';

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

const LAYERS = [
  { icon: '💪', title: 'Tầng Cơ Thể', color: '#f97316', signs: ['Tim đập nhanh, hồi hộp', 'Căng cổ vai gáy', 'Thở nông, thở nhanh', 'Đau đầu, khó ngủ', 'Mệt mỏi không rõ nguyên nhân'] },
  { icon: '😤', title: 'Tầng Cảm Xúc', color: '#ec4899', signs: ['Dễ cáu bẳn, mất kiên nhẫn', 'Lo lắng, bất an', 'Buồn bực, chán nản', 'Cảm giác quá tải', 'Khó tập trung, đãng trí'] },
  { icon: '🔄', title: 'Tầng Hành Vi', color: '#6366f1', signs: ['Ăn vặt nhiều hơn', 'Lướt điện thoại vô thức', 'Trì hoãn việc quan trọng', 'Bỏ tập, bỏ thói quen', 'Thức khuya, ngủ nướng'] },
];

const LOOPS = [
  {
    title: 'Vòng lặp công việc',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Deadline gấp, sếp hối' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Không xong được đâu"' },
      { icon: '😟', label: 'Cảm xúc', text: 'Panic, tê liệt' },
      { icon: '📱', label: 'Hành vi', text: 'Trì hoãn, làm việc khác' },
      { icon: '💢', label: 'Hậu quả', text: 'Deadline gần hơn, panic tăng' },
    ],
    breakpoint: 'Thở 4 vòng → viết "việc nhỏ tiếp theo là..."',
  },
  {
    title: 'Vòng lặp mạng xã hội',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Buồn chán, rảnh rỗi' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Xem 5 phút thôi"' },
      { icon: '😟', label: 'Cảm xúc', text: 'So sánh, tự ti' },
      { icon: '📱', label: 'Hành vi', text: 'Cuộn mãi, 1 giờ trôi qua' },
      { icon: '💢', label: 'Hậu quả', text: 'Mất thời gian, cảm thấy tệ hơn' },
    ],
    breakpoint: 'Tắt màn hình → đi bộ 5 phút → uống nước',
  },
  {
    title: 'Vòng lặp ăn uống',
    steps: [
      { icon: '⚡', label: 'Trigger', text: 'Stress, buồn, bắt buộc' },
      { icon: '💭', label: 'Suy nghĩ', text: '"Ăn cho khuây"' },
      { icon: '😟', label: 'Cảm xúc', text: 'An tâm tức thời' },
      { icon: '🍕', label: 'Hành vi', text: 'Ăn vặt, ăn quá nhiều' },
      { icon: '💢', label: 'Hậu quả', text: 'Mặc cảm, ăn thêm để xoa dịu' },
    ],
    breakpoint: 'Dừng 10 giây: "Mình đói hay mệt?" → thở 1 phút',
  },
];

const TECHNIQUES = [
  { icon: '🏷️', title: 'Đặt tên cho suy nghĩ', desc: 'Thay vì "Tôi thất bại rồi" → đổi thành "Tôi đang có suy nghĩ rằng mình thất bại." Tạo khoảng cách giữa bạn và suy nghĩ.', example: '"Mình đang bận tâm về X" thay vì "X là sự thật"' },
  { icon: '🔵', title: 'Vòng tròn kiểm soát', desc: 'Chia lo âu thành 2 nhóm: Tôi kiểm soát được (giờ ngủ, bữa ăn, cách phản ứng) vs Tôi không kiểm soát được (ý kiến người khác, kết quả tuyệt đối). Chỉ hành động với nhóm đầu.', example: 'Viết 2 cột, tập trung hành động vào cột trái' },
  { icon: '🔍', title: 'Tìm bằng chứng', desc: 'Khi có suy nghĩ tiêu cực, hỏi: "Có bằng chứng chắc chắn không? Có cách diễn giải khác không?" Não thường phóng đại mối nguy.', example: '"Mình mắc lỗi" → "Mình mắc lỗi một lần, không có nghĩa mình luôn mắc lỗi"' },
  { icon: '⏸️', title: 'Điểm dừng nhỏ', desc: 'Mục tiêu của Trụ cột D không phải xóa sạch lo âu, mà là chèn một điểm dừng nhỏ vào vòng lặp. Điểm dừng có thể là: thở 1 phút, viết 5 dòng, đi bộ 5 phút, tắt màn hình 10 phút.', example: 'Khi cảm thấy căng: dừng → thở → gọi tên cảm xúc → chọn việc nhỏ tiếp theo' },
];

const TECHNIQUE_MODALS = [
  {
    icon: '🏷️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Đặt Tên Cho Suy Nghĩ (Defusion)',
    img: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cognitive defusion (ACT): khoảng cách giữa "Tôi thất bại" và "Tôi đang có suy nghĩ rằng mình thất bại" là tất cả — cùng nội dung, nhưng não xử lý theo cách hoàn toàn khác.',
    detail: 'Kỹ thuật từ Acceptance & Commitment Therapy (Steven Hayes). Fusion = gắn chặt vào suy nghĩ như sự thật. Defusion = tạo khoảng cách bằng ngôn ngữ — giúp quan sát suy nghĩ thay vì bị nó điều khiển.',
    details: [
      'Cognitive fusion là trạng thái suy nghĩ = thực tế: "Tôi thất bại" → não xử lý như một sự kiện đang xảy ra, kích hoạt amygdala và threat response. Đây là nguồn gốc của nhiều vòng lặp lo âu.',
      '"Tôi đang có suy nghĩ rằng..." thêm một lớp quan sát giữa bạn và suy nghĩ. fMRI cho thấy cách diễn đạt này giảm hoạt động amygdala và tăng hoạt động PFC — dịch chuyển từ phản ứng sang quan sát.',
      'Biến thể mạnh hơn: "Tôi nhận ra mình đang có suy nghĩ rằng..." — thêm "nhận ra" (noticing) tăng meta-awareness, tạo khoảng cách lớn hơn và giảm ảnh hưởng cảm xúc của suy nghĩ.',
      'Đặt tên cho loại suy nghĩ còn hiệu quả hơn: "Đây là suy nghĩ lo âu về tương lai" / "Đây là suy nghĩ so sánh" / "Đây là cái não mình hay phán xét bản thân". Categorizing giúp não nhận ra pattern.',
      'Nghiên cứu ACT (Hayes, 2012): defusion techniques giảm ảnh hưởng của suy nghĩ tiêu cực hiệu quả hơn "suy nghĩ tích cực" (positive thinking) vì không cố xóa suy nghĩ — chỉ thay đổi mối quan hệ với nó.',
      'Thực hành ngay: lần tới khi có suy nghĩ tiêu cực, thêm "Mình đang bận tâm về..." hoặc đơn giản nói thầm "Đó chỉ là một suy nghĩ" — đủ để phá vỡ fusion trong hầu hết tình huống hằng ngày.',
    ],
    points: [
      { icon: '🔭', label: 'Cognitive Defusion', note: 'Quan sát suy nghĩ thay vì bị cuốn vào' },
      { icon: '🧠', label: 'Giảm Amygdala', note: 'Cách diễn đạt thay đổi não xử lý' },
      { icon: '🏷️', label: 'Đặt Tên Pattern', note: 'Categorizing giúp nhận ra vòng lặp' },
      { icon: '✅', label: 'Không Cần Xóa', note: 'Thay đổi quan hệ, không phải nội dung' },
    ],
  },
  {
    icon: '🔵', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Vòng Tròn Kiểm Soát (Circle of Control)',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Epictetus (thế kỷ 1 SCN): "Không phải sự vật làm bạn xáo trộn — mà là quan điểm của bạn về sự vật." 2000 năm sau, tâm lý học hiện đại xác nhận điều này qua Locus of Control theory.',
    detail: 'Lo âu tăng mạnh nhất khi dành năng lượng cho điều không thể kiểm soát. Vòng tròn kiểm soát (Stephen Covey, 7 Habits) phân loại rõ ràng — giúp não ngừng "giải quyết" điều không thể giải quyết được.',
    details: [
      'Locus of Control (Julian Rotter, 1954): người có internal locus (tin rằng mình kiểm soát được kết quả) có mức lo âu thấp hơn, phục hồi nhanh hơn và hiệu suất cao hơn so với người có external locus.',
      'Vòng tròn trong (Circle of Control): giờ ngủ, bữa ăn, cách luyện tập, cách phản ứng, lời nói, hành động — những thứ chỉ bạn quyết định. Đây là nơi đặt toàn bộ năng lượng.',
      'Vòng tròn ngoài (Circle of Concern): ý kiến người khác, thị trường, thời tiết, kết quả tuyệt đối — biết nhưng không hành động. Nghĩ về nó → stress. Chấp nhận nó → bình an.',
      'Cognitive load giảm đáng kể khi phân loại rõ ràng: não không còn phải "cố giải quyết" điều không giải quyết được. Nhiều nghiên cứu về burnout cho thấy đây là kỹ năng phân biệt người có resilience cao.',
      'Bài tập thực hành: viết lo âu hiện tại ra → hỏi "Mình có thể làm gì cụ thể về điều này không?" → Có: lên kế hoạch nhỏ ngay. Không: ghi nhận và đặt sang một bên có ý thức.',
      'Cạm bẫy phổ biến: lo âu về điều trong vòng ngoài, nhưng biến nó thành cảm giác có trách nhiệm — "Tôi cần phải lo vì tôi quan tâm." Phân biệt lo âu (passive) với hành động (active) là kỹ năng quan trọng.',
    ],
    points: [
      { icon: '⭕', label: 'Circle of Control', note: 'Chỉ hành động trong vòng tròn này' },
      { icon: '🧘', label: 'Locus of Control', note: 'Internal = lo âu thấp + resilience cao' },
      { icon: '🧩', label: 'Giảm Cognitive Load', note: 'Não ngừng "giải quyết" điều vô nghĩa' },
      { icon: '📝', label: 'Bài Tập Viết', note: '2 cột: kiểm soát được / không kiểm soát được' },
    ],
  },
  {
    icon: '🔍', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Tìm Bằng Chứng (Cognitive Restructuring)',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cognitive distortions (Aaron Beck): não trong trạng thái stress không "nghĩ sai" — nó áp dụng đúng cơ chế nhưng với dữ liệu sai lệch. Tìm bằng chứng là cách cập nhật dữ liệu.',
    detail: 'Cognitive restructuring từ CBT (Cognitive Behavioral Therapy): không phải "suy nghĩ tích cực" — mà là "suy nghĩ chính xác". Khi suy nghĩ tiêu cực xuất hiện, kiểm tra nó như kiểm tra một giả thuyết khoa học.',
    details: [
      'Aaron Beck (cha đẻ CBT) xác định 10 cognitive distortions phổ biến: all-or-nothing thinking, catastrophizing, mind reading, fortune telling, overgeneralization... Não stress có xu hướng dùng tất cả cùng lúc.',
      '"Mình mắc lỗi" → cognitive distortion "overgeneralization" (khái quát hóa từ 1 trường hợp). Tìm bằng chứng phản bác: "Mình có mắc lỗi ở mọi việc không?" → Không → suy nghĩ ban đầu không chính xác.',
      '"Kiểm tra chéo" (cross-examination): tự hỏi "Nếu bạn thân mình có suy nghĩ này, mình sẽ nói gì với họ?" — perspective shift này đủ để não đánh giá lại suy nghĩ một cách khách quan hơn.',
      '"Tìm diễn giải thay thế": cho cùng một sự kiện, có bao nhiêu diễn giải khác khả dĩ? Bạn gửi email, sếp không reply → "Sếp bực tôi" vs "Sếp bận" vs "Email bị filter". Ít nhất 3 diễn giải luôn tồn tại.',
      'Behavioral experiment: thay vì chỉ tranh luận với suy nghĩ, thử hành động nhỏ để kiểm tra nó. "Mình không làm được đâu" → làm 5 phút → có làm được không? Bằng chứng thực tế mạnh hơn lý luận.',
      'Meta-cognition (nghĩ về cách mình nghĩ): sau khi tìm bằng chứng, nhận ra "Khi stress, não mình có xu hướng catastrophize" — biết pattern của chính mình giúp nhận diện nhanh hơn lần sau.',
    ],
    points: [
      { icon: '⚖️', label: 'Cognitive Restructuring', note: 'Kiểm tra suy nghĩ như giả thuyết' },
      { icon: '🔄', label: 'Diễn Giải Thay Thế', note: 'Luôn có ít nhất 3 cách diễn giải' },
      { icon: '👥', label: 'Perspective Shift', note: '"Bạn thân mình sẽ nói gì?"' },
      { icon: '🧪', label: 'Behavioral Experiment', note: 'Hành động nhỏ → bằng chứng thực tế' },
    ],
  },
  {
    icon: '⏸️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Điểm Dừng Nhỏ (Pattern Interrupt)',
    img: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Pattern interrupt là kỹ thuật NLP và neuroscience: chèn một hành động có ý thức vào vòng lặp tự động — đủ để phá vỡ chuỗi trigger-thought-emotion-behavior trước khi nó hoàn chỉnh.',
    detail: 'Không cần phải "giải quyết" vòng lặp ngay. Chỉ cần tạo một khoảng trống nhỏ giữa trigger và phản ứng. Viktor Frankl: "Giữa kích thích và phản ứng là một khoảng trống. Sức mạnh của chúng ta nằm ở chỗ chọn cách phản ứng trong khoảng trống đó."',
    details: [
      'Pattern interrupt hoạt động vì: hành vi tự động chạy theo "neurological highway" — chuỗi nơ-ron đã được củng cố qua nhiều lần lặp lại. Một hành động gián đoạn buộc não "derail" khỏi đường ray quen thuộc.',
      'Thở 1 phút: đây không chỉ là "hít thở". 6 hơi thở chậm (~10 giây/hơi) đủ để kích hoạt vagal brake — hệ phó giao cảm hạ nhịp tim và cortisol, đưa PFC trở lại online để ra quyết định có ý thức.',
      'Viết 5 dòng: không cần câu đẹp. Viết stream of consciousness (ghi lại mọi thứ đang trong đầu không lọc) trong 3–5 phút giải phóng working memory, giảm cognitive load và đặt vòng lặp lo âu "ra bên ngoài não".',
      'Đi bộ 5 phút: locomotion (chuyển động nhịp điệu) kích thích serotonin và endorphin, cộng thêm đổi môi trường thị giác phá vỡ associative context của stress — lý do "đi dạo" giải quyết vấn đề hiệu quả hơn ngồi tại bàn.',
      'Tắt màn hình 10 phút: cho Default Mode Network (DMN) vào hoạt động — mạng lưới xử lý ký ức và cảm xúc mà chỉ hoạt động khi não "nhàn rỗi". DMN thường tự tìm ra giải pháp mà conscious mind không thấy.',
      'Chuỗi điểm dừng: Dừng → Thở → Gọi tên cảm xúc → Chọn việc nhỏ tiếp theo. 4 bước này chỉ mất 60–90 giây nhưng tạo đủ khoảng trống để chuyển từ reactive (phản ứng tự động) sang responsive (chọn lựa có ý thức).',
    ],
    points: [
      { icon: '⚡', label: 'Pattern Interrupt', note: 'Phá chuỗi tự động trước khi hoàn chỉnh' },
      { icon: '🫁', label: 'Vagal Brake', note: '6 hơi thở = PFC online trở lại' },
      { icon: '🚶', label: 'Locomotion', note: 'Đi bộ kích thích serotonin + đổi context' },
      { icon: '🌐', label: 'DMN Activation', note: 'Màn hình off → não tự giải quyết vấn đề' },
    ],
  },
];

const STRESS_LEVEL_MODALS = [
  {
    icon: '😌', color: '#10b981', rgb: '16,185,129',
    modalTitle: '0–2 · Bình Thường — Trạng Thái Nền Lý Tưởng',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress 0–2 không có nghĩa là không có gì xảy ra — đây là trạng thái cân bằng sinh lý (homeostasis) mà cơ thể liên tục cố đạt được. Mục tiêu là duy trì, không phải đạt điểm tuyệt đối 0.',
    detail: 'Ở mức 0–2, cortisol ở baseline buổi sáng (CAR — Cortisol Awakening Response), HRV cao, PFC hoạt động tốt và hệ miễn dịch ở trạng thái ổn định. Đây là điều kiện tối ưu để học hỏi, sáng tạo và gây dựng habits.',
    details: [
      'Cortisol nhịp sinh học bình thường: tăng tự nhiên 30–45 phút sau khi thức dậy (CAR), đạt đỉnh vào 8–9 giờ sáng, giảm dần về chiều và thấp nhất vào tối. Nhịp này giúp bạn tỉnh táo buổi sáng và buồn ngủ buổi tối.',
      'HRV (Heart Rate Variability) cao ở mức stress 0–2: chỉ số này phản ánh khả năng thích nghi của hệ thần kinh tự chủ. HRV cao → dễ chuyển đổi giữa tập trung và thư giãn → resilience tốt hơn với stress tiếp theo.',
      'Neuroplasticity tối ưu: ở trạng thái bình thường, BDNF (Brain-Derived Neurotrophic Factor) — "phân bón của não" — được tiết đủ để hỗ trợ tạo kết nối nơ-ron mới. Học kỹ năng mới hiệu quả nhất khi stress thấp.',
      '"Tiếp tục duy trì" không có nghĩa là không làm gì — mà là tiếp tục những habits đang tạo ra trạng thái này: ngủ đủ giấc, vận động, ăn đều, giảm thiếu screen time, kết nối xã hội đủ.',
      'Trạng thái 0–2 không tự nhiên mà có trong xã hội hiện đại — nó là kết quả của lifestyle design có chủ ý. Người duy trì được thường có routines rõ ràng và biết cách "exit" stress trước khi tích lũy.',
      'Cảnh báo: nhiều người nhầm lẫn "không cảm thấy gì" với stress 0–2. Thực ra, alexithymia (khó nhận diện cảm xúc) hoặc emotional numbing có thể tạo cảm giác trống rỗng — đây không phải bình thường mà là dấu hiệu cần chú ý.',
    ],
    points: [
      { icon: '⚖️', label: 'Homeostasis', note: 'Cân bằng sinh lý mà cơ thể luôn hướng tới' },
      { icon: '📈', label: 'HRV Cao', note: 'Resilience tốt với stress tiếp theo' },
      { icon: '🧠', label: 'BDNF Optimal', note: 'Học hỏi và tạo habits hiệu quả nhất' },
      { icon: '🔄', label: 'Lifestyle Design', note: 'Kết quả của habits có chủ ý, không tự nhiên' },
    ],
  },
  {
    icon: '🟡', color: '#84cc16', rgb: '132,204,22',
    modalTitle: '3–4 · Nhẹ — Eustress Có Thể Quản Lý',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress 3–4 là vùng eustress productive — đủ để kích hoạt tập trung và động lực, nhưng chưa đủ để làm suy giảm hiệu suất. Reset 2 phút ngăn tích lũy lên vùng cao hơn.',
    detail: 'Ở mức này, norepinephrine và dopamine tăng vừa đủ để đạt trạng thái "alert but calm" — đây là điều kiện tối ưu cho deep work và problem-solving. Tuy nhiên, nếu không xả, stress 3–4 có thể tích lũy thành 5–6 trong vài giờ.',
    details: [
      'Yerkes-Dodson zone: stress 3–4 nằm ở vùng "upslope" của đường cong hiệu suất — mức kích thích tăng đang kéo hiệu suất lên, chưa qua đỉnh. Deadline nhẹ, thử thách vừa sức, mục tiêu rõ ràng tạo ra trạng thái này.',
      'Reset 2 phút được thiết kế để "xả van" trước khi áp lực tích lũy: 5 hơi thở cơ hoành sâu + thả lỏng 3 điểm (vai, hàm, bàn tay) + 1 câu định hướng ("Việc quan trọng nhất mình cần làm tiếp theo là...").',
      'Stress 3–4 buổi sáng là bình thường và lành mạnh — CAR (Cortisol Awakening Response) tự nhiên tạo mức này để chuẩn bị cho ngày làm việc. Vấn đề xảy ra khi mức này không giảm về cuối ngày.',
      'Self-monitoring hiệu quả: đặt alarm 3 lần/ngày (10h, 14h, 18h) để "check-in" stress level. Nếu nhận thấy 3–4 đang kéo dài > 3 giờ liên tục, đó là dấu hiệu cần reset trước khi tự leo thang.',
      'Chiến lược phòng ngừa tốt nhất ở mức 3–4: không thêm commitments, giải quyết 1 việc nhỏ ngay (giảm cognitive load), uống nước (dehydration nhẹ làm stress tăng), đứng dậy đi lại 2 phút.',
      'Lưu ý: một số người chronically ở mức 3–4 đến mức coi đó là "bình thường". Nếu bạn khó nhớ lần cuối cùng mình thực sự thư giãn là khi nào — đây là dấu hiệu mức baseline của bạn đã bị nâng lên.',
    ],
    points: [
      { icon: '⚡', label: 'Eustress Zone', note: 'Kích hoạt tập trung và động lực' },
      { icon: '⏱️', label: 'Reset 2 Phút', note: 'Xả van trước khi stress tích lũy' },
      { icon: '📊', label: 'Self-Monitor', note: 'Check-in 3 lần/ngày ngăn leo thang' },
      { icon: '⚠️', label: 'Chronic 3–4', note: 'Kéo dài quá lâu → baseline bị nâng' },
    ],
  },
  {
    icon: '🟠', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: '5–6 · Trung Bình — Hiệu Suất Bắt Đầu Giảm',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress 5–6 là đỉnh của đường cong Yerkes-Dodson — thêm một chút áp lực nữa là bắt đầu đi xuống. Box breathing + journal là combo hiệu quả nhất để giữ không leo lên 7–8.',
    detail: 'Ở mức này, PFC bắt đầu bị cortisol ảnh hưởng: khả năng lọc thông tin giảm, working memory bị quá tải, quyết định kém hơn bình thường. Bạn vẫn "hoạt động" được nhưng chất lượng và tốc độ đều kém hơn.',
    details: [
      'Tipping point: stress 5–6 là ngưỡng mà cortisol bắt đầu có tác động đo được lên prefrontal cortex — thời gian phản ứng chậm hơn 15–20%, lỗi sai tăng, khó giữ nhiều thông tin trong đầu cùng lúc.',
      'Working memory bị thu hẹp: bình thường working memory giữ được 7±2 items. Ở stress 5–6, con số này giảm còn 4–5 — giải thích tại sao bạn hay quên, mất mạch và cần nhắc nhở nhiều hơn.',
      'Box breathing (4-4-4-4) ở mức này: 4 vòng × 16 giây = 64 giây đủ để hạ cortisol đo được và đưa HRV tăng trở lại. Hiệu quả nhất khi thực hiện TRƯỚC khi làm việc quan trọng, không phải sau.',
      'Journal ở mức 5–6: viết "brain dump" — đổ hết mọi thứ đang trong đầu ra giấy không lọc. Mục tiêu không phải giải quyết vấn đề mà là giải phóng working memory khỏi "open loops" để não hoạt động hiệu quả hơn.',
      'Dấu hiệu thêm cần nhận ra ở 5–6: ăn uống thay đổi (thèm ngọt, mặn), social withdrawal (không muốn nói chuyện), thở nông hơn bình thường, hay kiểm tra điện thoại vô thức.',
      'Nếu 5–6 kéo dài > 2 ngày liên tiếp, cần đánh giá nguồn gốc stress: công việc cụ thể nào? Mối quan hệ nào? Sức khỏe? Tài chính? Giải quyết nguyên nhân gốc thay vì chỉ dùng kỹ thuật hô hấp.',
    ],
    points: [
      { icon: '📉', label: 'Hiệu Suất Giảm', note: 'PFC bị cortisol ảnh hưởng rõ ràng' },
      { icon: '🧠', label: 'Working Memory', note: '7±2 → 4–5 items: hay quên và mất mạch' },
      { icon: '⬜', label: 'Box Breathing', note: '64 giây trước việc quan trọng' },
      { icon: '📓', label: 'Brain Dump Journal', note: 'Xả open loops → giải phóng working memory' },
    ],
  },
  {
    icon: '🔴', color: '#f97316', rgb: '249,115,22',
    modalTitle: '7–8 · Cao — Chế Độ Tồn Tại, Không Phải Sống',
    img: 'https://images.unsplash.com/photo-1505455184862-554165e5f6ba?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress 7–8 là ngưỡng mà não chuyển sang "survival mode" — PFC gần như offline, amygdala kiểm soát hầu hết quyết định. Ưu tiên nghỉ ngơi không phải yếu đuối, đó là sinh lý học.',
    detail: 'Ở mức này, cortisol đã vượt ngưỡng tối ưu và bắt đầu gây hại: ký ức ngắn hạn suy giảm, immune function giảm, tiêu hóa kém, giấc ngủ bị phá vỡ. Giảm kỳ vọng không phải từ bỏ — là điều chỉnh thực tế để không làm mọi thứ tệ hơn.',
    details: [
      'Survival mode: amygdala ở trạng thái 7–8 có ngưỡng kích hoạt cực thấp — mọi kích thích nhỏ đều có thể gây phản ứng quá mức. Bạn "cáu" với những thứ bình thường không ảnh hưởng — đây là triệu chứng sinh lý, không phải tính cách.',
      'Immune system: stress 7–8 kéo dài kích hoạt pro-inflammatory cytokines (IL-6, TNF-α) và ức chế NK cells. Người trong trạng thái này dễ ốm hơn 2–3 lần, và khi ốm thì phục hồi chậm hơn bình thường.',
      'Giấc ngủ bị phá vỡ nghiêm trọng: cortisol cao tối ngăn melatonin, kết hợp amygdala hypervigilant → mind racing khi nằm xuống. Thiếu ngủ → cortisol tăng thêm → vòng lặp tự khuếch đại.',
      'Giảm kỳ vọng có nghĩa là: tạm thời hủy những cam kết không thiết yếu, delegate những việc có thể, nói "không" một cách rõ ràng và không xin lỗi quá nhiều. Không phải từ bỏ — là ưu tiên lại.',
      'Những gì KHÔNG nên làm ở 7–8: cafein nhiều hơn bình thường (kích thích cortisol thêm), làm thêm giờ để "giải quyết xong" (không hiệu quả, chỉ deepens stress response), isolate hoàn toàn (connection là buffer quan trọng).',
      'Phục hồi 7–8 cần 24–72 giờ để cortisol về baseline nếu loại bỏ được nguồn stress chính. Nếu không loại bỏ được — cần chiến lược buffer: ngủ đủ giấc là ưu tiên #1, vận động nhẹ (không intense), kết nối người thân.',
    ],
    points: [
      { icon: '🧠', label: 'Survival Mode', note: 'PFC offline, amygdala kiểm soát' },
      { icon: '🛡️', label: 'Miễn Dịch Sụt Giảm', note: 'Dễ ốm 2–3 lần, phục hồi chậm' },
      { icon: '😴', label: 'Ngủ Bị Phá Vỡ', note: 'Cortisol tối + amygdala = mind racing' },
      { icon: '📋', label: 'Giảm Kỳ Vọng', note: 'Ưu tiên lại, không phải từ bỏ' },
    ],
  },
  {
    icon: '🚨', color: '#ef4444', rgb: '239,68,68',
    modalTitle: '9–10 · Nguy Hiểm — Cần Hỗ Trợ Bên Ngoài',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress 9–10 vượt ngưỡng mà các kỹ thuật tự quản lý còn hiệu quả — hệ thần kinh đang trong trạng thái không thể tự điều tiết (dysregulation). Tìm kiếm hỗ trợ là hành động khôn ngoan nhất, không phải yếu đuối.',
    detail: 'Ở mức này, cortisol + adrenaline ở mức rất cao trong thời gian kéo dài đã gây ra allostatic overload — cơ thể không còn đủ khả năng "reset" mà không có can thiệp từ bên ngoài. Điều này không có nghĩa là bạn đã "thất bại".',
    details: [
      'Allostatic overload: khái niệm của Bruce McEwen (Rockefeller) — khi cumulative stress vượt khả năng adaptaion của sinh lý, hệ thống bắt đầu breakdown thay vì adapt. Không phải vấn đề ý chí — là giới hạn sinh học.',
      'Dấu hiệu nhận biết 9–10: dissociation (cảm giác không thật, như nhìn từ bên ngoài bản thân), cơn hoảng loạn (panic attack), suy nghĩ vòng lặp không thể dừng, ăn ngủ bị ảnh hưởng nặng (hoặc không ngủ hoặc ngủ liên tục), không thể thực hiện các tasks bình thường.',
      'Hỏi người thân không phải "cầu cứu yếu đuối" — nghiên cứu về social support cho thấy oxytocin được giải phóng khi kết nối với người thân tin cậy, trực tiếp đối kháng cortisol và giảm amygdala hyperactivation.',
      'Chuyên gia tâm lý/tâm thần có thể cung cấp: liệu pháp CBT hoặc ACT được chứng minh lâm sàng, đánh giá chính xác mức độ và cần can thiệp gì, và nếu cần, hỗ trợ dược lý ngắn hạn (không phụ thuộc).',
      'Những gì CÓ THỂ giúp ngay bây giờ trong khi tìm kiếm hỗ trợ: gọi điện cho 1 người bạn tin tưởng (không cần nói gì nhiều, chỉ cần không ở một mình), ra ngoài không gian hẹp, uống nước ấm, ánh sáng tự nhiên.',
      'Đường dây hỗ trợ sức khỏe tâm thần Việt Nam: Đường dây tư vấn sức khỏe tâm thần 1800 599 920 (miễn phí, 24/7). Việc gọi điện là bước đầu tiên — không cần biết chắc mình "đủ nghiêm trọng" để gọi.',
    ],
    points: [
      { icon: '🔬', label: 'Allostatic Overload', note: 'Cơ thể không thể tự reset — cần can thiệp' },
      { icon: '🤝', label: 'Social Support', note: 'Oxytocin từ kết nối trực tiếp chống cortisol' },
      { icon: '🧑‍⚕️', label: 'Chuyên Gia', note: 'CBT/ACT lâm sàng + đánh giá chính xác' },
      { icon: '📞', label: '1800 599 920', note: 'Đường dây tư vấn miễn phí 24/7' },
    ],
  },
];

const LAYER_MODALS = [
  {
    icon: '💪', color: '#f97316', rgb: '249,115,22',
    modalTitle: 'Tầng Cơ Thể — Triệu Chứng & Cơ Chế',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ thể là "cảnh báo sớm" của stress — các triệu chứng thực thể xuất hiện TRƯỚC khi bạn nhận ra mình đang stress. Nhận diện ở tầng này giúp can thiệp sớm nhất.',
    detail: 'HPA axis (Hypothalamic-Pituitary-Adrenal) và hệ giao cảm kích hoạt đồng thời: adrenaline phóng thích trong giây, cortisol theo sau trong vài phút — tạo ra toàn bộ bộ triệu chứng cơ thể mà bạn cảm nhận.',
    details: [
      'Tim đập nhanh và hồi hộp: adrenaline (epinephrine) làm tăng nhịp tim để bơm máu tới cơ bắp chuẩn bị "fight or flight" — một phản xạ tiến hóa hữu ích khi đối mặt nguy hiểm thật sự, nhưng kích hoạt liên tục gây mệt mỏi tim mạch.',
      'Căng cổ vai gáy: cơ trapezius và cơ cổ co lại trong stress như bản năng bảo vệ đầu. Sau nhiều giờ ngồi + stress, các cơ này không được thư giãn và tạo ra "stress hump" — cảm giác vai gáy như đá.',
      'Thở nông, thở nhanh: khi giao cảm kích hoạt, nhịp thở tăng để cung cấp O₂ nhanh hơn. Nhưng thở ngực nông gây hyperventilation nhẹ — CO₂ giảm → cảm giác chóng mặt và lo âu tăng (vòng lặp tự khuếch đại).',
      'Đau đầu: căng cơ cổ-vai → giảm lưu thông máu lên đầu + cortisol gây viêm → đau đầu căng thẳng (tension headache). Đây là loại đau đầu phổ biến nhất ở người làm việc văn phòng.',
      'Khó ngủ: cortisol cao buổi tối ức chế melatonin, norepinephrine duy trì "chế độ cảnh giác" của não — ngăn não vào giai đoạn ngủ sâu NREM cần thiết cho phục hồi.',
      'Mệt mỏi không rõ nguyên nhân: hệ miễn dịch tiêu thụ nhiều năng lượng hơn khi cortisol mãn tính gây viêm toàn thân — bạn "mệt" dù không làm gì nhiều vì cơ thể đang chiến đấu ở cấp độ tế bào.',
    ],
    points: [
      { icon: '⚡', label: 'Adrenaline Ngay Lập Tức', note: 'Tim đập nhanh trong vòng giây' },
      { icon: '🏔️', label: 'Căng Cơ Bảo Vệ', note: 'Vai gáy co lại như bản năng tự vệ' },
      { icon: '🌬️', label: 'Thở Nông → Vòng Lặp', note: 'Hyperventilation làm lo âu tăng thêm' },
      { icon: '🔍', label: 'Cảnh Báo Sớm Nhất', note: 'Nhận diện ở đây trước khi leo lên tầng cảm xúc' },
    ],
  },
  {
    icon: '😤', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Tầng Cảm Xúc — Từ Kích Động Đến Quá Tải',
    img: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Amygdala "chiếm quyền" vỏ não khi stress cao — đây là lý do bạn dễ cáu, mất kiên nhẫn và không thể suy nghĩ rõ ràng dù bình thường vẫn làm được.',
    detail: 'Amygdala hijack (Joseph LeDoux): khi stress vượt ngưỡng, amygdala kích hoạt phản ứng cảm xúc nhanh hơn vỏ não trước trán (PFC) có thể điều chỉnh — bạn phản ứng trước khi kịp suy nghĩ.',
    details: [
      'Amygdala hijack: amygdala xử lý tín hiệu nguy hiểm nhanh hơn PFC 11–17 mili giây. Khi cortisol cao, ngưỡng kích hoạt amygdala giảm thấp — nghĩa là cùng một tình huống sẽ gây phản ứng mạnh hơn bình thường.',
      'Dễ cáu bẳn và mất kiên nhẫn: cortisol làm giảm serotonin — neurotransmitter điều tiết tâm trạng và khả năng chịu đựng. Khi serotonin thấp, ngưỡng "bực" giảm xuống và mọi thứ nhỏ cũng trở nên khó chịu.',
      'Lo lắng và bất an: amygdala trong trạng thái cảnh giác cao → não liên tục quét môi trường để tìm mối đe dọa — tạo ra trạng thái lo âu nền ngay cả khi không có trigger rõ ràng.',
      'Buồn bực và chán nản: stress mãn tính làm giảm dopamine tonic (nền) — không còn cảm giác hứng khởi hoặc kỳ vọng tích cực. Các hoạt động bình thường vui không còn hấp dẫn.',
      'Cảm giác quá tải (overwhelm): khi PFC bị "offline" do cortisol, khả năng phân loại và ưu tiên công việc suy giảm — mọi thứ đều có vẻ cấp bách và quan trọng như nhau, gây liệt hành động.',
      'Khó tập trung, đãng trí: norepinephrine ở mức tối ưu giúp tập trung, nhưng khi quá cao (stress cao) nó giảm khả năng lọc thông tin không liên quan — bạn để ý mọi thứ xung quanh thay vì tập trung vào việc chính.',
    ],
    points: [
      { icon: '🧠', label: 'Amygdala Hijack', note: 'Phản ứng cảm xúc nhanh hơn lý trí' },
      { icon: '😠', label: 'Serotonin Giảm', note: 'Ngưỡng chịu đựng thấp → dễ cáu' },
      { icon: '🌀', label: 'Lo Âu Nền', note: 'Não quét nguy hiểm liên tục' },
      { icon: '🧩', label: 'PFC Offline', note: 'Mất khả năng ưu tiên và sắp xếp' },
    ],
  },
  {
    icon: '🔄', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Tầng Hành Vi — Bù Đắp Và Né Tránh',
    img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Các hành vi bù đắp không phải sự yếu đuối — đó là não tự tìm nguồn dopamine nhanh vì stress đã làm cạn kiệt dopamine từ các hoạt động có ý nghĩa.',
    detail: 'Khi stress kéo dài, dopamine tonic (nền) giảm → não thiếu cảm giác thưởng thích. Não chuyển sang tìm kiếm dopamine phasic (đột biến nhanh) từ thực phẩm ngon, MXH, game — những thứ cho phản hồi tức thì nhưng không giải quyết nguồn gốc stress.',
    details: [
      'Ăn vặt nhiều hơn: thực phẩm giàu đường và chất béo kích thích dopamine nhanh, cộng thêm cortisol cao làm tăng cảm giác thèm ăn đặc biệt với food comfort. Đây là cơ chế tiến hóa — cơ thể tích trữ năng lượng khi "nguy hiểm".',
      'Lướt điện thoại vô thức: mỗi lần kéo feed là một "variable reward" (phần thưởng không chắc chắn) — cơ chế tương tự máy đánh bạc. Variable reward tạo dopamine đột biến mạnh nhất, lý do MXH gây nghiện hơn nội dung cố định.',
      'Trì hoãn việc quan trọng: PFC offline → khó khởi động nhiệm vụ phức tạp. Não ưu tiên việc nhỏ, dễ, cho kết quả tức thì (check email, dọn bàn) để có cảm giác hoàn thành mà tránh nhiệm vụ nặng gây thêm stress.',
      'Bỏ tập, bỏ thói quen: habit loop cần willpower để kích hoạt — khi cortisol cao, willpower (self-regulation) suy giảm vì PFC thiếu năng lượng. Những habits tốt dễ bị break nhất vì chúng cần effort cao nhất.',
      'Thức khuya, ngủ nướng: thức khuya = tìm thêm "thời gian cho bản thân" (revenge bedtime procrastination) sau ngày stress. Ngủ nướng = cơ thể cố phục hồi cortisol deficit qua ngủ thêm nhưng thực ra làm lệch nhịp sinh học.',
      'Vòng lặp tự khuếch đại: hành vi bù đắp → không giải quyết stress → tiếp tục bỏ habits tốt → sức khỏe/hiệu suất giảm → stress tăng → bù đắp nhiều hơn. Đây là lý do stress mãn tính khó thoát nếu không can thiệp có ý thức.',
    ],
    points: [
      { icon: '🍕', label: 'Dopamine Tức Thì', note: 'Ăn vặt/MXH thay thế dopamine thiếu hụt' },
      { icon: '📱', label: 'Variable Reward Loop', note: 'Feed MXH = máy đánh bạc dopamine' },
      { icon: '⏳', label: 'Willpower Suy Giảm', note: 'PFC thiếu năng lượng → habits tốt bị break' },
      { icon: '🔁', label: 'Vòng Lặp Tự Khuếch Đại', note: 'Bù đắp → không giải quyết → stress thêm' },
    ],
  },
];

const STRESS_TYPE_MODALS = [
  {
    icon: '✅', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Stress Tích Cực (Eustress)',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Eustress là nhiên liệu hiệu suất — não và cơ thể được thiết kế để phát huy tốt nhất khi có mức thách thức vừa phải, đủ để kích hoạt nhưng không đủ để làm tê liệt.',
    detail: 'Từ "eu-" (tiếng Hy Lạp: tốt) + stress. Hans Selye (1974) phân loại eustress là loại stress có lợi — kích hoạt norepinephrine, dopamine và cortisol ở mức vừa đủ tạo trạng thái "flow" và hiệu suất đỉnh cao.',
    details: [
      'Đường cong Yerkes-Dodson (1908): hiệu suất tăng theo mức kích thích — nhưng chỉ đến ngưỡng tối ưu. Eustress nằm ở vùng đỉnh của đường cong này, nơi não hoạt động tốt nhất.',
      'Norepinephrine tăng trong eustress giúp tăng tập trung, xử lý thông tin nhanh hơn và củng cố ký ức ngắn hạn — cơ chế tương tự tại sao deadline có thể giúp làm việc hiệu quả hơn.',
      'Cortisol ở mức vừa (eustress) kích thích neuroplasticity — não tạo kết nối mới và học hỏi tốt hơn. Vận động, học kỹ năng mới, thách thức sáng tạo đều gây eustress.',
      'Eustress kéo dài ngắn và có điểm kết thúc rõ ràng — khi thách thức hoàn thành, hệ thần kinh tự reset về baseline. Đây là điểm khác biệt cốt lõi với distress.',
      'Cảm giác "hứng khởi trước thử thách" là dấu hiệu eustress: dopamine được giải phóng khi não nhận ra thách thức có thể vượt qua được — tạo động lực hành động.',
      'Thiếu eustress cũng gây hại: trạng thái hoàn toàn không có thách thức (boredom) làm giảm dopamine, tăng nguy cơ trầm cảm và làm suy giảm nhận thức theo thời gian.',
    ],
    points: [
      { icon: '⚡', label: 'Kích Hoạt Hiệu Suất', note: 'Norepinephrine + dopamine ở mức tối ưu' },
      { icon: '🧠', label: 'Neuroplasticity', note: 'Cortisol vừa đủ → não tạo kết nối mới' },
      { icon: '📈', label: 'Đường Cong Yerkes-Dodson', note: 'Hiệu suất đỉnh tại mức kích thích vừa' },
      { icon: '🏁', label: 'Kết Thúc Rõ Ràng', note: 'Reset về baseline sau khi hoàn thành' },
    ],
  },
  {
    icon: '⚠️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Stress Mãn Tính (Distress)',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Distress không phải về cường độ mà về thời gian — không phải bao nhiêu áp lực mà là kéo dài bao lâu mà không có điểm kết thúc và không được xả.',
    detail: 'Cortisol mãn tính — kéo dài nhiều ngày/tuần — tích lũy tác hại lên não (thu nhỏ hippocampus), miễn dịch (ức chế NK cells), tim mạch và trao đổi chất. Cơ thể không phân biệt được stress công việc và nguy hiểm tính mạng.',
    details: [
      'Hippocampus — vùng não xử lý ký ức và học tập — bị thu nhỏ sau stress mãn tính kéo dài. McEwen (Rockefeller University) ghi nhận điều này qua MRI ở người mắc PTSD và trầm cảm nặng.',
      'HPA axis (Hypothalamic-Pituitary-Adrenal) bị dysregulation: sau stress mãn tính, hệ phản hồi cortisol hoạt động sai — không còn tăng đúng lúc và hạ đúng lúc như ở người khỏe mạnh.',
      'Hệ miễn dịch bị ức chế: cortisol cao mãn tính làm giảm NK cells (natural killer cells) và tăng cytokine gây viêm — giải thích tại sao người stress kéo dài dễ ốm và phục hồi chậm hơn.',
      'Giấc ngủ bị phá vỡ: cortisol cao vào buổi tối ngăn melatonin tiết ra đúng lúc — vòng lặp không ngủ được → stress hơn → càng không ngủ được hình thành và tự duy trì.',
      'Visceral fat (mỡ bụng nội tạng) tăng: cortisol mãn tính kích thích tích trữ mỡ ở vùng bụng — đây là loại mỡ nguy hiểm nhất, liên quan đến bệnh tim và tiểu đường type 2.',
      'Vòng lặp lo âu–thói quen hình thành khi stress mãn tính không được nhận diện: não tìm kiếm "giải pháp tạm thời" (lướt MXH, ăn vặt) → không giải quyết gốc rễ → stress tích lũy thêm.',
    ],
    points: [
      { icon: '🧠', label: 'Hippocampus Thu Nhỏ', note: 'Ảnh hưởng ký ức và học tập' },
      { icon: '🛡️', label: 'Miễn Dịch Suy Giảm', note: 'NK cells giảm, dễ ốm, phục hồi chậm' },
      { icon: '😴', label: 'Giấc Ngủ Vỡ', note: 'Cortisol cao → melatonin không tiết được' },
      { icon: '🔁', label: 'Vòng Lặp Tự Duy Trì', note: 'Không xả → tích lũy → thói quen bù đắp' },
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
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
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
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
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

export default function MindStressPage() {
  const { t: tM } = useTranslation('mind');
  const [openLoop, setOpenLoop] = useState(null);
  const [stressModal, setStressModal] = useState(null);
  const [layerModal, setLayerModal] = useState(null);
  const [techniqueModal, setTechniqueModal] = useState(null);
  const [stressLevelModal, setStressLevelModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dStressOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dStressOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/d" className="inline-flex items-center gap-2 text-base text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        {tM('breadcrumb')}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🌪️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tM('stress.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>{tM('stress.badge')}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tM('stress.desc')}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop" alt="Stress" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>{tM('stress.img_caption')}</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Good vs bad stress */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Stress Tốt vs Stress Xấu</h2>
        <p className="text-muted text-lg mb-6">Không phải stress nào cũng cần loại bỏ.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="group/card rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}
            onClick={() => setStressModal(0)}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-text">✅ Stress tích cực (Eustress)</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity"
                style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.08)' }}>
                chi tiết →
              </span>
            </div>
            <ul className="space-y-2">
              {['Giúp tập trung cao độ khi cần', 'Thúc đẩy hoàn thành deadline', 'Cảm giác hứng khởi trước thử thách', 'Kéo dài ngắn, kết thúc rõ ràng'].map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span className="text-green-400">→</span>{s}</li>)}
            </ul>
          </div>
          <div className="group/card rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            style={{ borderColor: `rgba(${RGB},0.3)`, background: `rgba(${RGB},0.05)` }}
            onClick={() => setStressModal(1)}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-text">⚠️ Stress mãn tính (Distress)</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity"
                style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>
                chi tiết →
              </span>
            </div>
            <ul className="space-y-2">
              {['Kéo dài nhiều ngày, không được xả', 'Ảnh hưởng ngủ, ăn, tập luyện', 'Cảm xúc không ổn định', 'Hình thành vòng lặp lo âu–thói quen'].map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span style={{ color: COLOR }}>→</span>{s}</li>)}
            </ul>
          </div>
        </div>
      </RevealBlock>

      {/* 3 layers */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>3 Tầng Của Stress</h2>
        <p className="text-muted text-lg mb-6">Stress biểu hiện ở cả 3 tầng cùng lúc — nhận diện tầng nào đang ảnh hưởng bạn nhiều nhất.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {LAYERS.map((l, i) => (
            <div key={l.title}
              className="group/card rounded-2xl border border-border bg-surface p-5 cursor-pointer transition-all duration-200 hover:bg-white/[0.03]"
              style={{ '--hover-color': l.color }}
              onClick={() => setLayerModal(i)}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{l.icon}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity shrink-0"
                  style={{ color: l.color, borderColor: `rgba(${LAYER_MODALS[i].rgb},0.35)`, background: `rgba(${LAYER_MODALS[i].rgb},0.08)` }}>
                  chi tiết →
                </span>
              </div>
              <div className="text-lg font-bold mb-3" style={{ color: l.color }}>{l.title}</div>
              <ul className="space-y-1">
                {l.signs.map(s => <li key={s} className="text-base text-muted flex items-start gap-2"><span style={{ color: l.color }}>·</span>{s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Anxiety loops */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vòng Lặp Lo Âu – Thói Quen</h2>
        <p className="text-muted text-lg mb-6">Mục tiêu không phải xóa sạch lo âu — mà là chèn một điểm dừng nhỏ vào vòng lặp.</p>
        <div className="space-y-3">
          {LOOPS.map((loop, i) => (
            <div key={i} className="rounded-2xl border border-border overflow-hidden">
              <button onClick={() => setOpenLoop(openLoop === i ? null : i)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left">
                <span className="text-lg font-medium text-text flex-1">{loop.title}</span>
                <span className="text-muted text-base">{openLoop === i ? '▲' : '▼'}</span>
              </button>
              {openLoop === i && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {loop.steps.map((s, si) => (
                      <div key={si} className="flex items-center gap-1">
                        <div className="rounded-lg p-2 text-center min-w-[80px]" style={{ background: `rgba(${RGB},0.08)` }}>
                          <div className="text-xl">{s.icon}</div>
                          <div className="text-base font-bold mt-0.5" style={{ color: COLOR }}>{s.label}</div>
                          <div className="text-base text-muted mt-0.5 leading-tight">{s.text}</div>
                        </div>
                        {si < loop.steps.length - 1 && <span className="text-muted text-base">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-3 text-base border" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.06)` }}>
                    🔧 <strong style={{ color: COLOR }}>Điểm dừng:</strong> {loop.breakpoint}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Techniques */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>4 Kỹ Thuật Phá Vòng Lặp</h2>
        <p className="text-muted text-lg mb-6">Công cụ nhận thức giúp tạo khoảng cách giữa bạn và phản ứng tự động.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {TECHNIQUES.map((t, i) => (
            <div key={t.title}
              className="group/card rounded-2xl border border-border bg-surface p-5 cursor-pointer transition-all duration-200 hover:border-violet-500/30 hover:bg-white/[0.03]"
              onClick={() => setTechniqueModal(i)}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{t.icon}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity shrink-0"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>
                  chi tiết →
                </span>
              </div>
              <div className="text-lg font-bold text-text mb-2">{t.title}</div>
              <p className="text-base text-muted leading-relaxed mb-3">{t.desc}</p>
              <div className="rounded-lg p-2 text-base italic text-muted border border-border">💡 {t.example}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Stress levels */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Thang Đo Stress 0–10</h2>
        <p className="text-muted text-lg mb-6">Chấm điểm mỗi ngày để nhận diện xu hướng trước khi stress leo thang.</p>
        <div className="space-y-2">
          {[
            { range: '0–2', label: 'Bình thường', desc: 'Cơ thể và tâm trí ổn định. Tiếp tục duy trì.', color: '#10b981' },
            { range: '3–4', label: 'Nhẹ', desc: 'Có áp lực nhưng kiểm soát được. Dùng Reset 2 phút.', color: '#84cc16' },
            { range: '5–6', label: 'Trung bình', desc: 'Ảnh hưởng tập trung. Nên dùng box breathing + journal.', color: '#f59e0b' },
            { range: '7–8', label: 'Cao', desc: 'Căng thẳng rõ ràng. Ưu tiên nghỉ ngơi, giảm kỳ vọng.', color: '#f97316' },
            { range: '9–10', label: 'Nguy hiểm', desc: 'Không tự xử lý được. Hỏi người thân hoặc chuyên gia.', color: '#ef4444' },
          ].map((s, i) => (
            <div key={s.range}
              className="group/row flex items-center gap-4 p-3 rounded-xl border border-border bg-surface cursor-pointer transition-all duration-200 hover:bg-white/[0.03]"
              style={{ '--hc': s.color }}
              onClick={() => setStressLevelModal(i)}>
              <div className="text-lg font-bold w-12 text-center shrink-0" style={{ color: s.color }}>{s.range}</div>
              <div className="w-16 shrink-0 text-base font-bold" style={{ color: s.color }}>{s.label}</div>
              <div className="text-base text-muted flex-1">{s.desc}</div>
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/row:opacity-100 transition-opacity"
                style={{ color: s.color, borderColor: `${s.color}55`, background: `${s.color}14` }}>
                chi tiết →
              </span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {tM('breadcrumb')}
        </Link>
        <Link to="/pillar/d/breathing" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Kỹ Thuật Thở
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {stressModal !== null && (
        <CardModal
          item={STRESS_TYPE_MODALS[stressModal]}
          onClose={() => setStressModal(null)}
          onPrev={() => setStressModal(i => Math.max(0, i - 1))}
          onNext={() => setStressModal(i => Math.min(STRESS_TYPE_MODALS.length - 1, i + 1))}
          hasPrev={stressModal > 0}
          hasNext={stressModal < STRESS_TYPE_MODALS.length - 1}
          total={STRESS_TYPE_MODALS.length}
          idx={stressModal}
        />
      )}

      {layerModal !== null && (
        <CardModal
          item={LAYER_MODALS[layerModal]}
          onClose={() => setLayerModal(null)}
          onPrev={() => setLayerModal(i => Math.max(0, i - 1))}
          onNext={() => setLayerModal(i => Math.min(LAYER_MODALS.length - 1, i + 1))}
          hasPrev={layerModal > 0}
          hasNext={layerModal < LAYER_MODALS.length - 1}
          total={LAYER_MODALS.length}
          idx={layerModal}
        />
      )}

      {techniqueModal !== null && (
        <CardModal
          item={TECHNIQUE_MODALS[techniqueModal]}
          onClose={() => setTechniqueModal(null)}
          onPrev={() => setTechniqueModal(i => Math.max(0, i - 1))}
          onNext={() => setTechniqueModal(i => Math.min(TECHNIQUE_MODALS.length - 1, i + 1))}
          hasPrev={techniqueModal > 0}
          hasNext={techniqueModal < TECHNIQUE_MODALS.length - 1}
          total={TECHNIQUE_MODALS.length}
          idx={techniqueModal}
        />
      )}

      {stressLevelModal !== null && (
        <CardModal
          item={STRESS_LEVEL_MODALS[stressLevelModal]}
          onClose={() => setStressLevelModal(null)}
          onPrev={() => setStressLevelModal(i => Math.max(0, i - 1))}
          onNext={() => setStressLevelModal(i => Math.min(STRESS_LEVEL_MODALS.length - 1, i + 1))}
          hasPrev={stressLevelModal > 0}
          hasNext={stressLevelModal < STRESS_LEVEL_MODALS.length - 1}
          total={STRESS_LEVEL_MODALS.length}
          idx={stressLevelModal}
        />
      )}
    </div>
  );
}
