import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLOR = '#ec4899';
const RGB = '236,72,153';
const ORBIT_ID = 'd-bodyscan-orbit-kf';
const ORBIT_PROP = '--d-bs-angle';
const ORBIT_CLASS = 'd-bs-orbit-ring';

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

const BODY_ZONES = [
  { id: 'head', icon: '🧠', name: 'Đầu & Trán', time: '1 phút', instructions: 'Cảm nhận trán — có căng không? Thả lỏng cơ trán, nhắm mắt nhẹ nhàng. Thở ra và để trán xẹp xuống.', tension: 'Thường căng khi lo lắng, nhìn màn hình nhiều' },
  { id: 'jaw', icon: '😶', name: 'Hàm & Cổ', time: '1 phút', instructions: 'Hàm có bị nghiến không? Để lưỡi chạm vòm miệng, miệng hé nhẹ. Cổ thả lỏng, đầu hơi nặng.', tension: 'Vùng giữ stress lớn nhất — nhiều người nghiến hàm mà không biết' },
  { id: 'shoulders', icon: '💪', name: 'Vai & Cánh Tay', time: '1 phút', instructions: 'Vai có đang nhô lên không? Hít vào, nhấc vai lên cao, thở ra mạnh và thả vai xuống hoàn toàn. Cảm nhận sức nặng của cánh tay.', tension: 'Tích lũy stress từ ngồi máy tính, mang ba lô, căng thẳng' },
  { id: 'chest', icon: '❤️', name: 'Ngực & Bụng', time: '1 phút', instructions: 'Cảm nhận ngực phồng-xẹp theo hơi thở. Bụng có căng không? Thở ra và để bụng mềm ra, không cần hút vào.', tension: 'Ngực thắt khi lo âu; bụng cứng khi giữ cảm xúc' },
  { id: 'hips', icon: '🦴', name: 'Lưng & Hông', time: '1 phút', instructions: 'Lưng đang tiếp xúc với mặt giường/ghế như thế nào? Thở ra và để lưng nặng hơn, chìm xuống. Hông thả lỏng.', tension: 'Ngồi nhiều làm cơ hông và lưng dưới căng cứng' },
  { id: 'legs', icon: '🦵', name: 'Đùi & Bắp Chân', time: '1 phút', instructions: 'Đùi có đang căng không? Thở ra và để đùi nặng xuống. Bắp chân thả lỏng, mắt cá chân buông.', tension: 'Vùng hay bị bỏ quên khi thư giãn, ảnh hưởng chất lượng ngủ' },
  { id: 'feet', icon: '🦶', name: 'Bàn Chân', time: '30 giây', instructions: 'Cảm nhận ngón chân, gan bàn chân. Duỗi nhẹ rồi thả ra. Cảm giác bàn chân nặng và ấm.', tension: 'Điểm kết thúc scan — khi đây thả lỏng, toàn thân đã đi vào nghỉ ngơi' },
  { id: 'whole', icon: '✨', name: 'Toàn Thân', time: '1 phút', instructions: 'Cảm nhận toàn thân từ đầu đến chân cùng lúc. Nếu còn vùng nào căng, thở vào đó và thở ra.', tension: 'Kết thúc bài scan — cơ thể đã sẵn sàng ngủ hoặc phục hồi' },
];

const ZONE_MODALS = [
  {
    icon: '🧠', color: COLOR, rgb: RGB,
    modalTitle: 'Đầu & Trán — Frontalis & Scalp Release',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Frontalis muscle (cơ trán) là cơ đầu tiên phản ứng với stress và screen time. Facial EMG cho thấy frontalis hoạt động liên tục khi đọc màn hình — ngay cả khi người dùng không nhận ra. Body scan trán thường gây "aha moment": "Mình đang nhăn trán mà không biết."',
    detail: 'Vùng đầu và trán là nơi tập trung nhiều cơ nhỏ liên quan đến biểu cảm và chú ý. Khi căng thẳng, hầu hết mọi người không nhận ra mình đang giữ tension ở trán, da đầu và xung quanh mắt — đây là điểm khởi đầu lý tưởng của body scan.',
    details: [
      'Frontalis (cơ trán): Cơ dẹt phủ toàn bộ trán, chịu trách nhiệm nhấc lông mày và tạo nếp nhăn trán. Khi lo lắng hoặc tập trung cao độ, frontalis co lại vô thức — tạo cảm giác "nặng trán" hoặc đau đầu căng thẳng (tension headache).',
      'Tension headache và body scan: 80% đau đầu thuộc loại tension-type — do co cơ ở trán, thái dương và cổ. Body scan tập trung vào trán giúp break feedback loop: giảm muscle activity → giảm pain signal → giảm lo âu → tiếp tục giảm muscle activity.',
      'Scalp (da đầu): Nhiều người không biết rằng da đầu có cơ (occipitofrontalis) và có thể căng. Khi thả lỏng hoàn toàn, da đầu "trượt" nhẹ ra sau — cảm giác này là dấu hiệu relaxation sâu đang diễn ra.',
      'Kỹ thuật release: Hít vào, nhẹ nhàng nhấc lông mày lên (tăng tension có chủ đích), giữ 2 giây, thở ra và thả hoàn toàn. Kỹ thuật "tense-then-release" từ Progressive Muscle Relaxation — tạo contrast để não nhận ra sự khác biệt giữa căng và thả lỏng.',
      'Mắt và vùng xung quanh: Orbicularis oculi (cơ vòng quanh mắt) thường co khi căng thẳng. Nhắm mắt nhẹ (không căng) và thở ra — để mi mắt nặng xuống tự nhiên. Cảm giác "mắt chìm vào" là dấu hiệu bắt đầu đi vào trạng thái alpha brain wave.',
      'Brain waves trong body scan đầu: EEG cho thấy focus vào vùng trán trong body scan tạo alpha wave (8–12 Hz) và theta wave (4–8 Hz) — trạng thái relaxed alertness và light sleep. Đây là lý do body scan từ đầu giúp "reset" mental chatter hiệu quả hơn nhiều so với cố ép "không suy nghĩ".',
    ],
    points: [
      { icon: '🧬', label: 'Frontalis EMG', note: 'Cơ trán hoạt động liên tục khi nhìn màn hình' },
      { icon: '💊', label: '80% Đau Đầu', note: 'Tension-type — body scan giải quyết tại nguồn' },
      { icon: '🌊', label: 'Alpha & Theta Waves', note: 'EEG: focus trán → relaxed alertness state' },
      { icon: '✨', label: '"Scalp Trượt"', note: 'Da đầu thả lỏng = dấu hiệu relaxation sâu' },
    ],
  },
  {
    icon: '😶', color: COLOR, rgb: RGB,
    modalTitle: 'Hàm & Cổ — TMJ & Vagus Nerve Gateway',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Masseter (cơ hàm) là một trong những cơ mạnh nhất trong cơ thể — tạo lực cắn lên đến 77 kg. Bruxism (nghiến răng khi ngủ hoặc thức) ảnh hưởng 8–31% dân số và liên quan trực tiếp đến stress. Hàm là "kho chứa stress" lớn nhất trên mặt.',
    detail: 'Cổ chứa vagus nerve — dây thần kinh phế vị kết nối não với tim, phổi và ruột. Release tension cổ qua body scan có thể kích hoạt parasympathetic response — toàn bộ cơ thể thư giãn nhanh hơn khi cổ được thả lỏng so với khi cổ còn căng.',
    details: [
      'TMJ (Temporomandibular Joint) disorder: Khớp thái dương-hàm nối hàm dưới với xương thái dương. TMD ảnh hưởng 5–12% dân số, gây đau hàm, click khi há miệng, và đau đầu. Stress là trigger chính — làm tăng clenching (siết hàm vô thức) cả ngày lẫn đêm.',
      'Lưỡi và vòm miệng: "Lưỡi chạm vòm miệng, hàm hé nhẹ" — kỹ thuật này đặt lưỡi vào vị trí rest position sinh lý. Vị trí này giúp hàm không bị clenching và là tư thế "neutral" của hàm khi không hoạt động. Nhiều người không biết mình đang siết hàm liên tục.',
      'Sternocleidomastoid (SCM) và trapezius trên: SCM chạy từ sau tai xuống xương đòn — khi căng tạo cảm giác "cổ cứng". Cùng với upper trapezius, đây là hai cơ chịu tải nhiều nhất từ posture xấu và stress. Release hai cơ này qua body scan có tác dụng dây chuyền lên đến đầu.',
      'Vagus nerve và cổ: Vagus nerve chạy gần động mạch cảnh ở hai bên cổ. Gentle awareness của vùng cổ trong body scan — đặc biệt khi kết hợp với thở chậm — kích hoạt vagal tone. Heart rate giảm, huyết áp giảm nhẹ trong vòng 60–90 giây.',
      'Forward head posture và căng cổ: Mỗi inch đầu nhô ra phía trước khỏi vai làm tăng tải lên cổ khoảng 10 lbs. Người dùng điện thoại/máy tính trung bình có đầu nhô 3–4 inch — tức là cơ cổ chịu thêm 30–40 lbs tải liên tục. Body scan giúp nhận ra và correct posture này.',
      'Kỹ thuật scan hàm: Miệng hé nhẹ (răng trên không chạm răng dưới) — nếu chạm, bạn đang clenching. Thở ra qua miệng nhẹ và để hàm "rớt" xuống tự nhiên. Cảm giác hàm nặng xuống là dấu hiệu masseter đang thả lỏng.',
    ],
    points: [
      { icon: '💪', label: '77 kg Lực Cắn', note: 'Masseter — cơ mạnh nhất và hay bị căng do stress' },
      { icon: '😬', label: 'Bruxism 8–31%', note: 'Nghiến răng vô thức — hầu hết không biết mình làm' },
      { icon: '🫀', label: 'Vagus Nerve Gateway', note: 'Release cổ → kích hoạt parasympathetic toàn thân' },
      { icon: '📐', label: 'Forward Head', note: 'Mỗi inch nhô ra = +10 lbs tải lên cơ cổ' },
    ],
  },
  {
    icon: '💪', color: COLOR, rgb: RGB,
    modalTitle: 'Vai & Cánh Tay — Upper Trap & Stress Response',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Upper trapezius là cơ đầu tiên co lại khi stress response kích hoạt (fight-or-flight). EMG studies: upper trap activity tăng ngay lập tức khi nghe âm thanh căng thẳng hoặc nhận email xấu — phản xạ không điều kiện. Desk workers có upper trap tension gấp 3–8x so với người lao động thể chất.',
    detail: 'Vai là nơi tích lũy stress nhiều nhất trên cơ thể — và cũng là nơi ít được chú ý nhất trong ngày. Body scan vai thường gây ngạc nhiên: nhiều người nhận ra vai đang "co rúm" lên tai mà không hề biết cho đến khi có hướng dẫn cụ thể.',
    details: [
      'Upper trapezius và stress response: Khi hệ thần kinh giao cảm kích hoạt, cơ thể chuẩn bị cho "fight" — vai nhô lên để bảo vệ cổ (một phản xạ tổ tiên). Vấn đề: stress hiện đại (email, deadline, cuộc họp) kích hoạt cùng phản xạ này hàng chục lần/ngày mà không có "resolution" — vai không bao giờ hoàn toàn thả xuống.',
      'Rotator cuff và impingement: Bốn cơ rotator cuff (supraspinatus, infraspinatus, teres minor, subscapularis) ổn định khớp vai. Chronic upper trap tension kéo xương bả vai lên → giảm không gian cho rotator cuff → shoulder impingement syndrome. Một trong những chấn thương phổ biến nhất ở văn phòng.',
      'Kỹ thuật "shoulder drop": Hít vào sâu, nhấc vai lên cao gần tai (maximize tension), giữ 2 giây, rồi thở ra mạnh và thả vai rơi hoàn toàn. Lặp 2–3 lần. Kỹ thuật này tạo post-contraction inhibition — sau khi cơ co tối đa, nó có thể thả lỏng sâu hơn bình thường.',
      'Cánh tay và bàn tay: Biceps và forearms giữ nhiều tension từ gõ bàn phím và dùng chuột. Trong body scan, sau khi thả vai, hãy để cánh tay "nặng" tự nhiên — không giữ, không đỡ. Bàn tay mở ra (không nắm) và để ngón tay curl tự nhiên như khi ngủ.',
      'Vai và nhịp thở: Shallow breathing (thở ngực) co vai lên nhẹ mỗi lần hít vào. Nếu bạn thở ngực suốt cả ngày, vai của bạn nhấp nhô vài nghìn lần — tích lũy micro-tension. Chuyển sang belly breathing trong body scan giúp vai hoàn toàn tách ra khỏi chu kỳ thở.',
      'Signs of complete shoulder release: Vai cảm thấy "nặng và ấm", cảm giác vai chìm xuống sâu hơn vào đệm/ghế, và khoảng cách giữa vai với tai tăng lên. Nếu bạn cảm thấy "lạ" vì vai xuống quá thấp — đó là tư thế bình thường, bạn chỉ mới nhận ra.',
    ],
    points: [
      { icon: '⚡', label: 'Fight-or-Flight Cơ', note: 'Upper trap co đầu tiên khi stress — phản xạ không điều kiện' },
      { icon: '💼', label: 'Desk Worker x3–8', note: 'Tension gấp 3–8 lần so với người lao động thể chất' },
      { icon: '🔄', label: 'Shoulder Drop', note: 'Co tối đa → thả hoàn toàn — post-contraction inhibition' },
      { icon: '🌡️', label: 'Ấm & Nặng', note: 'Dấu hiệu release: vai ấm lên và chìm sâu xuống' },
    ],
  },
  {
    icon: '❤️', color: COLOR, rgb: RGB,
    modalTitle: 'Ngực & Bụng — Diaphragm & Anxiety Loop',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Breathing pattern thay đổi theo trạng thái cảm xúc — và ngược lại, thay đổi breathing pattern thay đổi cảm xúc. Chronic anxiety thường đi kèm với thoracic breathing (thở ngực) → body scan ngực + diaphragmatic breathing breaks anxiety loop trong 60–90 giây.',
    detail: 'Ngực và bụng là trung tâm của vòng lặp lo âu: lo lắng → thở ngực nông → CO2 giảm → cảm giác lo lắng tăng → thở nhanh hơn. Body scan vùng này, kết hợp với để bụng mềm, phá vỡ vòng lặp này trực tiếp.',
    details: [
      'Diaphragm (cơ hoành) — cơ thở chính: Cơ hoành hình vòm nằm giữa ngực và bụng. Khi hít vào đúng cách (belly breathing), cơ hoành co xuống → bụng phồng ra. Khi thở ngực, liên sườn (intercostals) làm chủ yếu — kém hiệu quả hơn và tạo tension ở ngực.',
      'Anxiety và thoracic breathing: Panic attacks và chronic anxiety thường đi kèm hyperventilation — thở nhanh và nông. Thở nhanh → CO2 máu giảm → vasodilation giảm → não nhận ít O2 hơn → cảm giác "sắp ngất" hoặc ngực thắt. Body scan ngực + slow belly breathing break cycle này.',
      'Solar plexus và "gut feeling": Đám rối thần kinh mặt trời (solar plexus) là mạng lưới thần kinh lớn phía sau dạ dày. Đây là lý do stress tâm lý gây buồn nôn, "bụng quặn" hoặc mất cảm giác thèm ăn. Body scan bụng giúp "de-activate" gut tension.',
      'Bụng mềm vs bụng giữ: Nhiều người có thói quen hút bụng vào suốt ngày (aesthetic concern). Chronic belly-holding làm cứng transverse abdominis và giảm diaphragmatic excursion. "Để bụng mềm ra" trong body scan thường khó — nhưng là bước quan trọng để thở sâu được.',
      'Heart rate trong body scan ngực: Slow, deep breathing kích hoạt baroreceptors ở main arteries → vagus nerve → sinoatrial node của tim → heart rate giảm. Hiệu quả nhất khi thở rate 5–6 lần/phút (thay vì 12–15 bình thường). Body scan ngực tự nhiên làm chậm breathing rate.',
      'Cảm giác ngực mở ra: Sau khi thả lỏng ngực hoàn toàn, nhiều người describe cảm giác "ngực nở ra" hoặc "nhẹ nhàng hơn". Đây là giảm thoracic muscle tension cho phép rib cage expand đầy đủ — tăng tidal volume (thể tích khí mỗi lần thở) mà không cần cố gắng.',
    ],
    points: [
      { icon: '🔄', label: 'Anxiety Loop', note: 'Lo lắng → thở ngực → lo hơn → body scan breaks cycle' },
      { icon: '🫁', label: 'Diaphragm Chính', note: 'Belly breathing hiệu quả hơn thoracic — cơ hoành làm việc' },
      { icon: '🧠', label: 'Solar Plexus', note: 'Stress tâm lý gây bụng quặn — body scan deactivates' },
      { icon: '🫀', label: 'HR Giảm 60–90s', note: 'Slow breathing → baroreceptors → heart rate xuống' },
    ],
  },
  {
    icon: '🦴', color: COLOR, rgb: RGB,
    modalTitle: 'Lưng & Hông — Psoas & Sedentary Release',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Psoas major ("muscle of the soul") là cơ duy nhất kết nối cột sống với chân. Ngồi nhiều làm psoas shortening chronically → anterior pelvic tilt → lower back pain. Psoas cũng chứa nhiều receptors của hệ thần kinh tự chủ — căng psoas liên quan trực tiếp đến trạng thái lo âu.',
    detail: 'Vùng lưng và hông là nơi tích lũy tension từ thói quen ngồi nhiều và không được scan trong hầu hết bài thiền thông thường. Body scan vùng này đặc biệt quan trọng cho desk workers và người hay lo lắng.',
    details: [
      'Psoas major — "fight-or-flight muscle": Psoas co lại khi cơ thể ở trạng thái threat (uốn cong người về phía trước như bào thai — tư thế bảo vệ). Chronic anxiety → chronic psoas tension → cơ thể luôn ở "ready to run" mode. Body scan giải phóng psoas = signal an toàn cho hệ thần kinh.',
      'Hip flexor complex: Gồm psoas, iliacus và rectus femoris. Ngồi >6 giờ/ngày làm shortening adaptive: hip flexors rút ngắn, không thể stretch đầy đủ khi đứng → anterior pelvic tilt (mông đẩy ra sau, bụng nhô ra trước). Body scan + gentle awareness không chữa hoàn toàn nhưng giúp nhận ra và break cycle.',
      'Erector spinae và lower back: Cơ dựng cột sống chạy dọc hai bên cột sống. Khi ngồi xấu, erector spinae làm việc quá tải để chống đỡ tư thế — gây chronic lower back tension. Cảm giác "lưng ép vào đệm" trong body scan nằm = deactivation của erector spinae.',
      'Sacrum và xương cụt: Xương cùng (sacrum) và xương cụt thường bị bỏ qua. Hít vào sâu và khi thở ra, tưởng tượng xương cụt "chìm xuống" — điều này flatten lumbar curve nhẹ và giải phóng tension ở junction giữa cột sống và xương chậu.',
      'Gluteus medius và hip external rotators: Ngồi nhiều atrophy glutes — yếu đi và tighten. Body scan hông có thể bao gồm gentle internal/external rotation awareness: để đùi "rơi ra ngoài" tự nhiên khi nằm = external rotation của hip, một tư thế thả lỏng tốt cho toàn vùng hông.',
      'Lưng tiếp xúc với mặt nằm: "Lưng đang tiếp xúc với mặt giường như thế nào?" — câu hỏi này trong body scan yêu cầu interoceptive precision. Cảm nhận được điểm tiếp xúc, áp lực, nhiệt độ là dấu hiệu interoceptive awareness đang tốt, liên quan đến emotional regulation tốt hơn.',
    ],
    points: [
      { icon: '🧬', label: 'Psoas & Lo Âu', note: 'Psoas tension = "luôn sẵn sàng chạy" — anxiety signal' },
      { icon: '🪑', label: 'Ngồi >6h/ngày', note: 'Hip flexor shortening → anterior tilt → lower back pain' },
      { icon: '📉', label: 'Erector Deactivation', note: '"Lưng chìm" trong body scan = release erector spinae' },
      { icon: '🔍', label: 'Interoceptive Cue', note: 'Cảm nhận tiếp xúc lưng-mặt nằm = emotional regulation' },
    ],
  },
  {
    icon: '🦵', color: COLOR, rgb: RGB,
    modalTitle: 'Đùi & Bắp Chân — Sleep Onset & Cortisol Release',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Restless legs syndrome (RLS) và leg tension before sleep ảnh hưởng 5–10% dân số, làm tăng sleep onset time 20–40 phút. Body scan chủ động thả lỏng đùi và bắp chân giảm RLS symptoms và cải thiện sleep efficiency theo RCT.',
    detail: 'Đùi và bắp chân là vùng hay bị bỏ quên nhất trong bài thiền — nhưng đây là nơi tích lũy tension từ cortisol không được giải phóng (khi stress nhưng không hoạt động thể chất). Các cơ lớn ở chân là "battery" của cortisol discharge.',
    details: [
      'Quadriceps và hamstrings: Bốn cơ đùi trước (quads) và ba cơ đùi sau (hamstrings) là những cơ lớn nhất cơ thể. Cortisol trong stress response prime những cơ này cho hoạt động (fight/run) — nhưng nếu không được dùng, tension tích lũy. Body scan là "discharge" không dùng vận động.',
      'Bắp chân và ankle tension: Gastrocnemius và soleus (bắp chân) thường căng từ high heels, đứng lâu, hoặc nervous energy (nhún chân liên tục). Trong body scan, "mắt cá chân buông" là cue quan trọng — khi mắt cá thả lỏng, toàn bộ cẳng chân thả theo.',
      'Leg tension và sleep quality: EMG studies: người có insomnia có leg muscle activity cao hơn đáng kể trong giai đoạn sleep onset so với người ngủ bình thường. Body scan giảm leg EMG activity → rút ngắn sleep onset time. Đây là một trong những mechanisms quan trọng nhất của body scan for sleep.',
      'IT band và lateral tension: Iliotibial band (IT band) chạy dọc mặt ngoài đùi. Ngồi nhiều và chạy bộ có thể làm IT band tighten. Trong body scan, cảm nhận mặt ngoài đùi và để phần này "mềm" ra — không cần stretch, chỉ cần aware và relax.',
      'Lymphatic drainage và leg scan: Hệ bạch huyết không có "bơm" riêng — phụ thuộc vào cơ bắp contraction và breathing. Khi nằm, gravity giảm tải cho hệ bạch huyết chân. Body scan kết hợp deep breathing tăng thoracic pressure → hút bạch huyết từ chân về — giảm phù nhẹ và cải thiện tuần hoàn.',
      'Cảm giác "chân nặng và ấm": Khi đùi và bắp chân thả lỏng hoàn toàn, peripheral vasodilation tăng — máu chảy nhiều hơn đến bề mặt da → chân ấm lên. Đồng thời cảm giác "nặng" xuất hiện khi muscle tone giảm. Đây là dấu hiệu Autogenic Training (thư giãn tự sinh) — "arms and legs are heavy and warm."',
    ],
    points: [
      { icon: '😴', label: 'Sleep Onset', note: 'Body scan chân giảm EMG → rút ngắn thời gian ngủ' },
      { icon: '⚡', label: 'Cortisol Discharge', note: 'Cơ lớn = "battery" cortisol — release mà không cần vận động' },
      { icon: '🦿', label: 'RLS Symptoms', note: 'Restless legs giảm với conscious release trong body scan' },
      { icon: '🌡️', label: 'Chân Ấm & Nặng', note: 'Vasodilation + muscle tone giảm = dấu hiệu deep relax' },
    ],
  },
  {
    icon: '🦶', color: COLOR, rgb: RGB,
    modalTitle: 'Bàn Chân — Grounding & Proprioception Gateway',
    img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Plantar sole của bàn chân có hàng nghìn mechanoreceptors — mật độ cao nhất trên cơ thể sau đầu ngón tay. Chú ý vào cảm giác bàn chân kích hoạt proprioceptive network → parasympathetic response nhanh. Đây là lý do "grounding" và thiền đi bộ dùng bàn chân làm anchor.',
    detail: 'Bàn chân là điểm kết thúc lý tưởng của body scan — khi chú ý đến mức này, toàn bộ cơ thể phía trên đã đi qua một vòng scan đầy đủ. Cảm giác bàn chân "nặng và ấm" thường đi kèm với trạng thái sắp ngủ.',
    details: [
      'Plantar mechanoreceptors: Gan bàn chân có Meissner corpuscles, Pacinian corpuscles, Merkel discs và Ruffini endings — cảm nhận áp lực, rung động, kéo căng và nhiệt độ. Trong body scan nằm, chú ý vào cảm giác bàn chân tiếp xúc với đệm kích hoạt toàn bộ mạng lưới này.',
      'Plantar fascia release: Dải cân gan bàn chân (plantar fascia) chạy từ gót đến đầu ngón. Plantar fasciitis ảnh hưởng 10% dân số. Khi nằm body scan, "duỗi nhẹ ngón chân rồi thả" kéo giãn nhẹ plantar fascia — không phải điều trị nhưng giảm chronic tension tích lũy.',
      'Toes (ngón chân) và thả lỏng: Nhiều người curl ngón chân lại vô thức khi căng thẳng — tương tự bàn tay nắm lại. Trong body scan, chú ý từng ngón chân và để chúng "mở ra" tự nhiên. Uncurl toes = signal thư giãn cho PNS.',
      'Grounding và bàn chân: "Earthing" hay grounding (tiếp xúc chân trần với đất) có bằng chứng về giảm cortisol và cải thiện HRV. Trong body scan nằm, chú ý vào bàn chân với intention "tôi được đỡ hoàn toàn, không cần giữ hay đỡ gì cả" tạo cùng sense of support.',
      'Completion signal: Não nhận ra "scan đến chân = xong" như một completion marker. Sau khi hoàn thành body scan đến bàn chân, nhiều người cảm thấy "discharge" — một cảm giác nhẹ nhõm và closure. Đây là lý do nên kết thúc scan ở chân thay vì bắt đầu từ chân lên.',
      'Bàn chân ấm = sleep onset imminent: Peripheral vasodilation (tăng blood flow đến bàn chân) là một trong những cơ chế sinh lý của sleep onset — cơ thể "dump" nhiệt qua bàn tay và bàn chân để giảm core temperature. Cảm giác bàn chân ấm trong body scan là dấu hiệu cơ thể đang chuẩn bị ngủ.',
    ],
    points: [
      { icon: '🔬', label: 'Mechanoreceptors', note: 'Mật độ cao nhất sau đầu ngón tay — gateway proprioception' },
      { icon: '🌱', label: 'Grounding Effect', note: 'Chú ý bàn chân → "được đỡ" → parasympathetic nhanh' },
      { icon: '🔚', label: 'Completion Marker', note: 'Scan đến chân = closure signal — não nhận ra "xong"' },
      { icon: '🌡️', label: 'Chân Ấm = Ngủ', note: 'Vasodilation bàn chân = cơ thể dump nhiệt để ngủ' },
    ],
  },
  {
    icon: '✨', color: COLOR, rgb: RGB,
    modalTitle: 'Toàn Thân — Interoceptive Awareness & Integration',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Whole-body awareness (choiceless awareness) là giai đoạn cuối của MBSR body scan — cho phép attention "expand" để cảm nhận toàn thân như một đơn vị. fMRI cho thấy giai đoạn này kích hoạt insula mạnh nhất — trung tâm interoception của não.',
    detail: 'Scan toàn thân sau khi đã đi qua từng vùng là integration step — não tổng hợp toàn bộ sensory information thành một "whole body map". Đây là giai đoạn deepest relaxation thường xảy ra, và là lúc nhiều người bắt đầu ngủ.',
    details: [
      'Insula cortex và interoception: Insula là vùng não chịu trách nhiệm interoception — nhận biết trạng thái bên trong cơ thể. Thiền định viên lâu năm có insula dày hơn đáng kể (MRI) và interoceptive accuracy tốt hơn — liên quan đến emotional regulation tốt hơn và anxiety thấp hơn.',
      'Choiceless awareness: Thay vì focus vào một điểm (hơi thở, bàn chân), choiceless awareness để attention "mở rộng" để nhận bất kỳ sensation nào nổi lên — như radio không chọn kênh cụ thể. Kỹ thuật này từ Vipassana và MBSR là bước cuối sau khi đã làm quen với focused attention.',
      'Still existing tension: Trong giai đoạn toàn thân, một số vùng vẫn còn tension sót lại — thường là hàm, vai hoặc hông. "Hít vào vùng đó và thở ra" là kỹ thuật breath-directed release: tưởng tượng hơi thở đến vùng đó và mang tension ra theo khi thở ra.',
      'Body image vs body sensation: Nhiều người có body image issues có xu hướng "tránh" scan một số vùng. Whole-body scan trong body scan không phải về cách cơ thể trông như thế nào — chỉ là cảm giác từ bên trong. Đây là thực hành tốt cho body neutrality và giảm body dysmorphia.',
      'Sleep onset trong giai đoạn này: Hypnic jerks (giật cơ khi sắp ngủ) thường xảy ra trong giai đoạn toàn thân — đây là dấu hiệu bình thường của sleep onset. Não đang chuyển từ wakefulness sang sleep. Nếu không cố gắng "không ngủ", body scan toàn thân thường kết thúc bằng giấc ngủ.',
      'Sense of wholeness: Cuối body scan, nhiều người mô tả cảm giác "không còn ranh giới rõ ràng giữa các vùng" — cơ thể cảm thấy như một khối thống nhất thay vì tập hợp các bộ phận. Trạng thái này liên quan đến theta brain waves và light sleep onset.',
    ],
    points: [
      { icon: '🧠', label: 'Insula Activation', note: 'fMRI: whole-body scan kích hoạt insula mạnh nhất' },
      { icon: '🌊', label: 'Choiceless Awareness', note: 'Attention mở rộng — nhận tất cả sensation không chọn lọc' },
      { icon: '😴', label: 'Ngủ Trong Scan', note: 'Hypnic jerks bình thường — cơ thể đang chuyển sang sleep' },
      { icon: '✨', label: 'Sense of Wholeness', note: 'Theta waves — cơ thể cảm thấy như một khối thống nhất' },
    ],
  },
];

const WHEN_MODALS = [
  {
    icon: '🌙', color: COLOR, rgb: RGB,
    modalTitle: 'Trước Khi Ngủ — Thay Thế Lướt Điện Thoại',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Blue light từ điện thoại suppress melatonin production 23% sau 2 giờ dùng. Thay thế bằng body scan 8 phút → không blue light + kích hoạt parasympathetic + giảm cortisol → sleep onset nhanh hơn trung bình 15–20 phút theo RCT.',
    detail: 'Body scan trước ngủ là can thiệp evidence-based được khuyến nghị trong MBSR cho insomnia. Kết hợp phytoherapeutic (không thuốc), zero side effects, và hiệu quả tích lũy — người thực hành đều đặn cải thiện sleep quality sau 4–8 tuần.',
    details: [
      'Sleep hygiene và screen time: WHO khuyến nghị không dùng thiết bị điện tử 1 giờ trước ngủ. Blue light (480nm) block melatonin production mạnh nhất. Nhưng nhiều người không thể ngừng lướt — body scan là alternative có cùng "wind-down" effect mà không cần willpower.',
      'Melatonin và darkness: Pineal gland tiết melatonin khi retina không nhận ánh sáng. Body scan trong phòng tối + nhắm mắt → darkness signal → tăng melatonin production. Hiệu quả đặc biệt tốt nếu bắt đầu lúc 9–10 giờ tối (trước melatonin peak tự nhiên lúc 11pm–1am).',
      'Cortisol circadian rhythm: Cortisol thấp nhất lúc nửa đêm và cao nhất lúc 8am (cortisol awakening response). Body scan giúp cortisol đạt điểm thấp đúng thời điểm — không "giữ cao" do stress không giải phóng trước ngủ.',
      'Sleep onset latency (SOL): SOL bình thường là 10–20 phút. Insomnia thường có SOL > 30 phút. RCT về mindfulness for sleep: giảm SOL trung bình 12 phút trong 8 tuần. Body scan là một trong những can thiệp mindfulness hiệu quả nhất cho SOL.',
      'Sleep architecture: Body scan không chỉ giúp ngủ nhanh hơn — còn cải thiện sleep architecture. Tăng slow-wave sleep (deep sleep) và giảm số lần thức giữa đêm. Điều này có nghĩa là ngủ ít hơn nhưng phục hồi nhiều hơn.',
      'Thói quen thay thế: Thay vì "đừng dùng điện thoại" (negative instruction, khó tuân thủ), thay bằng "làm body scan" (positive replacement habit). Implementation intention: "Khi tôi vào giường, tôi sẽ bắt đầu body scan" — effective habit replacement theo BJ Fogg\'s Tiny Habits.',
    ],
    points: [
      { icon: '📱', label: 'Blue Light Block', note: 'Body scan = zero blue light + parasympathetic activation' },
      { icon: '⏱️', label: 'SOL -12 Phút', note: 'RCT: giảm sleep onset latency trung bình 12 phút' },
      { icon: '🌕', label: 'Melatonin Tăng', note: 'Nhắm mắt + tối = tăng melatonin production tự nhiên' },
      { icon: '🔄', label: 'Habit Replacement', note: 'Thay thế lướt TikTok — cùng thời điểm, hành động khác' },
    ],
  },
  {
    icon: '💪', color: COLOR, rgb: RGB,
    modalTitle: 'Sau Buổi Tập Nặng — CNS Recovery & Muscle Release',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hệ thần kinh trung ương (CNS) cần 24–72 giờ phục hồi sau buổi tập cường độ cao — dài hơn cơ bắp (24–48h). Body scan sau tập kích hoạt PNS, giảm cortisol và norepinephrine, tăng HRV — tất cả markers của CNS recovery quality.',
    detail: 'Body scan sau tập không phải chỉ là "cool-down" — mà là active recovery cho hệ thần kinh. Trong khi static stretching sau tập có evidence yếu cho DOMS, body scan có evidence tốt hơn cho subjective recovery và CNS state.',
    details: [
      'CNS fatigue vs muscular fatigue: Sau buổi squat nặng, cơ bắp cần 24h nhưng CNS cần 48–72h. Triệu chứng CNS fatigue: sleep disturbance, irritability, motivation thấp, grip strength giảm. Body scan accelerate CNS recovery bằng cách tắt "always on" sympathetic mode.',
      'Cortisol post-workout: Cortisol đạt peak trong và ngay sau buổi tập nặng — cần thiết cho adaptation nhưng cần giảm sau đó để anabolic hormones (testosterone, GH) chiếm ưu thế. Body scan giảm cortisol nhanh hơn passive rest — tạo anabolic window tốt hơn.',
      'Muscle tension patterns sau tập: Sau deadlift nặng, erector spinae, glutes và hamstrings thường tighten vô thức (protective guarding). Body scan giúp "remind" các cơ này rằng nguy hiểm đã qua và có thể relax — không phải mechanical stretch mà là neural input.',
      'HRV và recovery quality: Heart Rate Variability (HRV) là gold standard marker cho CNS recovery. Buổi tập nặng giảm HRV 15–25%. Body scan 10 phút sau tập tăng HRV back up nhanh hơn so với passive sitting. Nhiều athletes dùng body scan như một phần của post-workout protocol.',
      'Sleep quality sau tập nặng: Tập nặng buổi chiều/tối tăng core temperature và sympathetic tone → khó ngủ. Body scan trước ngủ (2–3 giờ sau tập) giúp "cool down" cả về nhiệt độ và neural arousal. Giải thích tại sao "tập tối không ngủ được" — và cách fix.',
      'DOMS (Delayed Onset Muscle Soreness): Không có strong evidence rằng stretching giảm DOMS. Nhưng body scan giúp phân biệt "soreness bình thường" vs "pain cần chú ý" bằng cách tăng interoceptive accuracy — quan trọng để avoid overtraining và injury.',
    ],
    points: [
      { icon: '🧬', label: 'CNS Recovery', note: 'CNS cần 48–72h — body scan tăng tốc recovery' },
      { icon: '📉', label: 'Cortisol Giảm', note: 'Tạo anabolic window tốt hơn passive rest' },
      { icon: '📊', label: 'HRV Tăng', note: 'Gold standard CNS recovery marker — body scan hiệu quả' },
      { icon: '😴', label: 'Fix Tập Tối', note: 'Giải quyết vấn đề khó ngủ sau buổi tập chiều/tối' },
    ],
  },
  {
    icon: '😤', color: COLOR, rgb: RGB,
    modalTitle: 'Khi Stress Tích Lũy — Nhận Ra Nơi Cơ Thể Giữ Stress',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Alexithymia (khó nhận biết cảm xúc của mình) ảnh hưởng 10% dân số và liên quan đến psychosomatic symptoms — stress biểu hiện qua cơ thể thay vì cảm xúc. Body scan là công cụ tăng interoceptive accuracy — "đọc" cơ thể để biết mình đang stress.',
    detail: 'Nhiều người không nhận ra mình đang stress cho đến khi cơ thể "báo cáo" qua đau đầu, đau vai, rối loạn tiêu hóa hoặc mất ngủ. Body scan là practice nhận ra những tín hiệu này sớm hơn — và giải quyết tại nguồn.',
    details: [
      'Somatic markers của stress: Vai co rúm (upper trap), hàm nghiến (masseter), thở ngực nông (intercostals), bụng căng (transverse abdominis), tay nắm lại (flexors). Body scan là "checklist" hệ thống để phát hiện những pattern này trước khi chúng tích lũy thành pain.',
      'Interoceptive deficit và stress: Nghiên cứu cho thấy người có interoceptive accuracy thấp thường có stress levels cao hơn — vì không nhận ra sớm khi cơ thể cần nghỉ ngơi. Body scan là training cho interoceptive accuracy — như "tập gym" cho khả năng đọc cơ thể.',
      'Stress accumulation model: Stress không tự biến mất — nó "chứa" trong cơ thể dưới dạng muscle tension, altered breathing, và neuroendocrine dysregulation. Body scan là cơ chế discharge có hệ thống: nhận ra tension → relax có chủ đích → feedback loop ngắt.',
      '"Bodily felt sense" (Eugene Gendlin): Felt sense là cảm giác mơ hồ, không có tên, nhưng rõ ràng trong cơ thể — "cái gì đó không ổn". Focusing (kỹ thuật của Gendlin) và body scan đều làm việc với felt sense. Nhận ra và đặt tên cho những cảm giác này có tác dụng therapeutic rõ ràng.',
      'Window of tolerance: Stress tích lũy có thể đẩy activation ra ngoài "window of tolerance" (vùng optimal arousal cho functioning). Hyper-arousal (anxiety, irritability) hoặc hypo-arousal (dissociation, numbness). Body scan giúp bring activation back vào window.',
      'Micro-body-scan trong ngày: Không cần đợi đến buổi tối — 2 phút micro-scan giữa cuộc họp hoặc khi chờ đợi: vai? hàm? thở? bụng? Những check-ins nhanh này prevent accumulation và là form của stress inoculation.',
    ],
    points: [
      { icon: '🔍', label: 'Somatic Stress Map', note: 'Vai, hàm, thở, bụng — checklist nhận stress sớm' },
      { icon: '📈', label: 'Interoceptive Training', note: 'Body scan = "gym" cho khả năng đọc cơ thể' },
      { icon: '🎯', label: 'Discharge Có Hệ Thống', note: 'Stress tích lũy = cần release có chủ đích, không tự biến' },
      { icon: '⏱️', label: 'Micro-Scan 2 Phút', note: 'Check-in nhanh giữa ngày ngăn tích lũy' },
    ],
  },
  {
    icon: '🎯', color: COLOR, rgb: RGB,
    modalTitle: 'Trước Thiền Ngồi — Body Preparation Protocol',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Nested practice: Body scan (interoceptive) → Thiền ngồi (attentional) hoạt động như prep + main set trong training. Body scan "clears" somatic noise (pain, tension, fidgeting) trước — cho phép thiền ngồi đạt deeper attention states nhanh hơn.',
    detail: 'Khó thiền vì cơ thể không thoải mái là một trong những lý do phổ biến nhất người mới bỏ cuộc. Body scan trước giải quyết somatic component — sau đó thiền ngồi có thể focus vào attention component mà không bị distracted bởi cơ thể.',
    details: [
      'Somatic noise và attention: Khi ngồi thiền với vai căng, lưng đau hoặc bụng căng, một phần processing power của não liên tục monitor những sensations này (interoceptive threat monitoring). Body scan trước "clears" những signals này → thiền ngồi có nhiều bandwidth hơn cho attention training.',
      'Sequential practice protocol (MBSR day 6): Jon Kabat-Zinn thiết kế body scan và sitting meditation như hai components bổ trợ nhau. Body scan: lying down, interoceptive, letting go. Sitting meditation: upright, attentional, present moment. Cùng nhau = complete mindfulness session.',
      'Posture và body awareness: Sau body scan, người ngồi thiền thường tự nhiên có posture tốt hơn — vì body awareness tăng. Thay vì "ngồi thẳng" (instruction từ ngoài vào), sau body scan bạn cảm nhận được sự khác biệt giữa tư thế balanced và unbalanced — và tự điều chỉnh.',
      'Thời gian tối ưu: 5–10 phút body scan trước 10–20 phút thiền ngồi = 15–30 phút tổng, hiệu quả hơn 30 phút thiền ngồi đơn thuần theo anecdotal evidence và một số pilot studies. Ratio 1:2 (body scan : sitting) được MBSR program dùng.',
      'Transition từ body scan sang sitting: Sau body scan lying down, ngồi dậy từ từ (tránh orthostatic hypotension — blood pressure drop khi đứng nhanh). Giữ awareness đã build được trong body scan khi chuyển sang tư thế ngồi. Không "reset" attention — carry it over.',
      'Cho người khó ngồi yên: Body scan trước "dùng hết" fidgeting energy và physical restlessness. Sau 8 phút body scan, hầu hết người cảm thấy đủ grounded để ngồi yên 10–15 phút — thay vì struggle ngay từ phút đầu của sitting meditation.',
    ],
    points: [
      { icon: '🧹', label: 'Clear Somatic Noise', note: 'Body scan xóa pain/tension → thiền ngồi focus tốt hơn' },
      { icon: '📐', label: 'MBSR Protocol', note: 'Jon Kabat-Zinn thiết kế hai practice bổ trợ nhau' },
      { icon: '⏱️', label: 'Ratio 1:2', note: '5–10 phút body scan + 10–20 phút sitting = session tối ưu' },
      { icon: '🪑', label: 'Fix Ngồi Không Yên', note: 'Body scan dùng hết restlessness trước → ngồi dễ hơn' },
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

function BodyScanTimer({ color }) {
  const [step, setStep] = useState(-1);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);
  const cntRef = useRef(0);

  const DURATIONS = [60, 60, 60, 60, 60, 60, 30, 60]; // seconds per zone

  const start = () => {
    setStep(0);
    cntRef.current = DURATIONS[0];
    setCount(DURATIONS[0]);
    setRunning(true);
    iRef.current = setInterval(() => {
      cntRef.current--;
      setCount(cntRef.current);
      if (cntRef.current <= 0) {
        setStep(prev => {
          const next = prev + 1;
          if (next >= BODY_ZONES.length) { clearInterval(iRef.current); setRunning(false); return -2; }
          cntRef.current = DURATIONS[next];
          setCount(DURATIONS[next]);
          return next;
        });
      }
    }, 1000);
  };
  const stop = () => { clearInterval(iRef.current); setRunning(false); setStep(-1); setCount(0); };
  useEffect(() => () => clearInterval(iRef.current), []);

  const zone = step >= 0 ? BODY_ZONES[step] : null;
  const progress = zone ? ((DURATIONS[step] - count) / DURATIONS[step]) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-bg p-5 space-y-4">
      <div className="text-base font-bold uppercase tracking-widest text-muted text-center">Body Scan Guided Timer · ~8 phút</div>
      {step === -2 ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-2">🌟</div>
          <div className="text-lg font-bold" style={{ color }}>Hoàn thành! Ngủ ngon nhé.</div>
          <button onClick={() => setStep(-1)} className="mt-3 text-base text-muted hover:text-text transition-colors">Làm lại</button>
        </div>
      ) : zone ? (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{zone.icon}</span>
            <div className="flex-1">
              <div className="text-lg font-bold text-text">{zone.name}</div>
              <div className="text-base text-muted">{zone.time}</div>
            </div>
            <div className="text-3xl font-bold" style={{ color }}>{count}s</div>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: color }} />
          </div>
          <p className="text-base text-muted leading-relaxed italic">{zone.instructions}</p>
          <div className="flex justify-between mt-2 text-base text-muted">
            <span>Vùng {step + 1}/{BODY_ZONES.length}</span>
            <button onClick={stop} className="text-red-400 hover:text-red-300 transition-colors">Dừng</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-base text-muted mb-4">Nằm thoải mái, nhắm mắt. Bài scan sẽ hướng dẫn từng vùng cơ thể.</p>
          <button onClick={start} className="px-6 py-2.5 rounded-full text-lg font-bold" style={{ background: `rgba(${RGB},0.15)`, color, border: `1px solid rgba(${RGB},0.3)` }}>
            Bắt đầu Body Scan
          </button>
        </div>
      )}
    </div>
  );
}

export default function MindBodyScanPage() {
  const { t: tM } = useTranslation('mind');
  const [zoneModal, setZoneModal] = useState(null);
  const [whenModal, setWhenModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes dBsOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: dBsOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>🔍</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{tM('body_scan.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>{tM('body_scan.badge')}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{tM('body_scan.desc')}</p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format&fit=crop" alt="Body Scan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${RGB},0.2)` }}>{tM('body_scan.img_caption')}</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Guided timer */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Body Scan Có Hướng Dẫn</h2>
        <p className="text-muted text-lg mb-6">Nằm thoải mái, bắt đầu — timer sẽ dẫn qua từng vùng.</p>
        <BodyScanTimer color={COLOR} />
      </RevealBlock>

      {/* Zone guide */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>8 Vùng Cơ Thể</h2>
        <p className="text-muted text-lg mb-6">Nhấn vào từng vùng để xem hướng dẫn chi tiết.</p>
        <div className="space-y-2">
          {BODY_ZONES.map((z, i) => (
            <div key={z.id} className="group/zone rounded-xl border border-border bg-surface hover:border-pink-500/20 transition-colors cursor-pointer" onClick={() => setZoneModal(i)}>
              <div className="flex items-center gap-3 p-3">
                <span className="text-2xl">{z.icon}</span>
                <span className="flex-1 text-lg font-medium text-text">{z.name}</span>
                <span className="text-base text-muted mr-2">{z.time}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/zone:opacity-100 transition-opacity"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* When to use */}
      <RevealBlock className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Khi Nào Dùng Body Scan</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {WHEN_MODALS.map((u, i) => (
            <div key={u.modalTitle} className="group/when rounded-xl border border-border bg-surface p-4 hover:border-pink-500/20 transition-colors cursor-pointer" onClick={() => setWhenModal(i)}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-3xl">{u.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-0 group-hover/when:opacity-100 transition-opacity self-start mt-1"
                  style={{ color: COLOR, borderColor: `rgba(${RGB},0.35)`, background: `rgba(${RGB},0.08)` }}>chi tiết →</span>
              </div>
              <div className="text-lg font-bold text-text mb-1">{u.modalTitle.split(' — ')[0]}</div>
              <div className="text-base text-muted leading-relaxed">{u.detail.split('.')[0]}.</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/pillar/d/meditation" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Thiền Ngắn
        </Link>
        <Link to="/pillar/d" className="text-lg text-muted hover:text-purple-400 transition-colors text-center">{tM('breadcrumb')} →</Link>
        <Link to="/pillar/d/journaling" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          Journaling 5 Dòng
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {zoneModal !== null && (
        <CardModal
          item={ZONE_MODALS[zoneModal]}
          onClose={() => setZoneModal(null)}
          onPrev={() => setZoneModal(i => Math.max(0, i - 1))}
          onNext={() => setZoneModal(i => Math.min(ZONE_MODALS.length - 1, i + 1))}
          hasPrev={zoneModal > 0}
          hasNext={zoneModal < ZONE_MODALS.length - 1}
          total={ZONE_MODALS.length}
          idx={zoneModal}
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
    </div>
  );
}
