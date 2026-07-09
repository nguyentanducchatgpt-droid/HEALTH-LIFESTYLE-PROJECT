import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  {
    id: 'sleep7', icon: '😴', label: 'Ngủ 7–9 tiếng', desc: 'Không tính ngủ bù cuối tuần', pillar: 'Giấc ngủ', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Ngủ 7–9 Tiếng — Không Thể Thương Lượng Với Sinh Học',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: '7–9 tiếng là khuyến cáo của National Sleep Foundation cho người trưởng thành (18–64 tuổi) dựa trên hàng trăm nghiên cứu. Không phải "lý tưởng" — đây là minimum để não hoàn thành các quá trình phục hồi bắt buộc: glymphatic clearance (loại bỏ metabolic waste bao gồm amyloid beta), memory consolidation (hippocampus transfer từ short-term → long-term), và hormone secretion (growth hormone đỉnh trong N3, cortisol reset). Mỗi giờ thiếu ngủ tạo "sleep debt" không thể trả bằng ngủ bù cuối tuần.',
    detail: 'Não người cần ~5–6 chu kỳ ngủ hoàn chỉnh (mỗi chu kỳ 90 phút) để hoàn thành đủ N1/N2/N3/REM trong tỷ lệ tối ưu. 6 tiếng = chỉ 4 chu kỳ — bỏ lỡ 2 chu kỳ REM cuối cùng (quan trọng cho emotional processing và creativity). 8 tiếng = 5–6 chu kỳ đầy đủ.',
    details: [
      'Sleep debt là thật và tích lũy: nghiên cứu Van Dongen (Penn, 2003) cho thấy ngủ 6h/đêm trong 14 ngày tạo cognitive impairment tương đương 2 ngày không ngủ hoàn toàn — nhưng người tham gia cảm thấy mình "quen" và không nhận ra suy giảm. Brain tự normalize sleep deprivation. Sau tuần thứ 2 ngủ ít, bạn mất khả năng đánh giá chính xác mình bị ảnh hưởng bao nhiêu.',
      'Glymphatic system hoạt động chủ yếu khi ngủ: glymphatic system (hệ thống lymph của não, phát hiện 2012 bởi Maiken Nedergaard) bơm CSF (cerebrospinal fluid) qua não để flush amyloid beta, tau protein và metabolic waste. Hệ thống này gần như inactive khi thức — hoạt động tăng 60% khi ngủ. Thiếu ngủ kinh niên = waste tích lũy = risk Alzheimer tăng (amyloid beta là dấu hiệu Alzheimer sớm nhất).',
      'Ngủ bù cuối tuần không hoạt động: nghiên cứu Dinges và đồng nghiệp: sau 5 ngày ngủ 6h, ngủ bù 2 ngày cuối tuần khôi phục subjective sleepiness nhưng KHÔNG restore cognitive performance về baseline. Deficit về attention, working memory và reaction time vẫn đo được sau khi cảm giác "đã bù". Đây là lý do "không tính ngủ bù cuối tuần" trong checklist này.',
      'Giờ ngủ tối ưu phụ thuộc vào chronotype: "7–9 tiếng" là về duration, không phải timing. Morning chronotype (lark) ngủ 22:00–06:00 tốt. Evening chronotype (owl) có thể ngủ 00:00–08:00 với cùng benefit — miễn là đủ duration và consistent timing. Cưỡng ép owl dậy sớm và không đủ giờ ngủ là "social jetlag" — gây harm tương tự múi giờ.',
      'Practical: calculator đơn giản nhất: đặt báo thức lúc cần dậy, đếm ngược 8 tiếng (không phải 7) để vào giường — 30 phút đầu thường là đọc sách/wind-down trước khi thực sự ngủ. Nếu không thể đủ 7h liên tục: nap 20–25 phút (không quá — vào deep sleep và dậy sẽ groggy) ≈ partial recovery cho alertness (không cho memory consolidation hay glymphatic).',
      'Đánh giá quality vs quantity: nhiều người ngủ 8h nhưng poor quality (interrupted, không đủ deep sleep). Dấu hiệu ngủ đủ giờ VÀ chất lượng: dậy trước hoặc cùng lúc báo thức, tỉnh trong 15–20 phút đầu mà không cần caffeine, và không "drag" vào buổi chiều. Nếu ngủ 8h vẫn mệt: investigate quality (nhiệt độ phòng, alcohol, timing của caffeine, sleep apnea).',
    ],
    points: [
      { icon: '🧠', label: 'Glymphatic flush amyloid beta khi ngủ', note: 'Waste clearance tăng 60% lúc ngủ — thiếu ngủ = toxin tích lũy, risk Alzheimer dài hạn' },
      { icon: '📉', label: 'Ngủ bù không restore cognitive deficit', note: 'Penn study: cảm giác hồi phục ≠ performance thực sự — deficit vẫn đo được dù hết buồn ngủ' },
      { icon: '🔄', label: '5–6 chu kỳ 90 phút = 7.5–9 tiếng', note: 'Cắt ngắn = mất REM cuối — emotional processing, creativity, immune function bị ảnh hưởng' },
      { icon: '⏰', label: 'Vào giường = giờ ngủ - 30 phút', note: 'Tính ngược từ giờ dậy: cần 8h nằm để thực sự ngủ đủ 7–7.5h' },
    ],
  },
  {
    id: 'sleep_time', icon: '🌙', label: 'Ngủ trước 23:30', desc: 'Theo nhịp sinh học tự nhiên', pillar: 'Giấc ngủ', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Ngủ Trước 23:30 — Đồng Bộ Với Circadian Rhythm',
    img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giá trị của giấc ngủ không chỉ phụ thuộc vào số giờ mà còn vào TIMING — ngủ đúng cửa sổ circadian rhythm (khoảng 22:00–02:00 cho hầu hết chronotype trung bình) để maximize slow-wave sleep (N3) concentration. Nghiên cứu large-scale (UK Biobank, 88.000 người): ngủ 22:00–23:00 liên quan đến cardiovascular risk thấp nhất; ngủ sau 00:00 tăng risk 12–25% ngay cả khi kiểm soát duration. Timing matters independently of duration.',
    detail: 'Circadian rhythm điều khiển không chỉ giấc ngủ mà còn hàng trăm quá trình sinh học theo 24h cycle: cortisol, melatonin, body temperature, immune function, hormone secretion, DNA repair. Ngủ "lệch pha" với circadian rhythm (như thức khuya, ngủ ban ngày) disrupts tất cả những quá trình này ngay cả khi đủ số giờ.',
    details: [
      'Melatonin onset và "sleep pressure window": melatonin bắt đầu tăng ~2h trước "dim light melatonin onset" (DLMO) — thường 20:00–22:00 ở người trung bình (sớm hơn ở larks, muộn hơn ở owls). Bỏ lỡ window này (vẫn thức lúc melatonin đã tăng) gây "second wind" — cortisol tăng nhẹ, alertness trở lại tạm thời. Thức khuya qua second wind → phá vỡ melatonin onset → khó ngủ.',
      'Slow-wave sleep (N3) concentration: N3 (deep sleep, quan trọng nhất cho physical recovery, immune function, GH secretion) concentrated trong nửa đầu của đêm. Người ngủ 00:00–08:00 có CÙNG giờ ngủ với người ngủ 22:00–06:00 nhưng ít N3 hơn vì bỏ lỡ peak N3 window (23:00–01:00 cho average chronotype). Ngủ muộn = sacrifice deep sleep, không chỉ shift timing.',
      'Cortisol và circadian misalignment: cortisol rhythm bình thường: đáy lúc 00:00–02:00, bắt đầu tăng 03:00–04:00, peak lúc 07:00–09:00 (Cortisol Awakening Response). Thức khuya → sinh hoạt khi cortisol ở đáy → "forced wakefulness" stress → cortisol tăng không đúng thời điểm → disrupts hormone cascade. Người thức đêm kinh niên có cortisol profile flattened — không có peak sáng để energize, không có nadir đêm để sleep.',
      'Social jetlag và health outcomes: "social jetlag" là khoảng cách giữa chronobiological sleep time và social/work sleep time. Trung bình người lớn có 1–2h social jetlag (dậy sớm hơn đồng hồ sinh học đòi hỏi). Mỗi 1h social jetlag: tăng 33% risk overweight (Roenneberg, 2012), tăng smoking, alcohol consumption, depression risk. Consistent bedtime giảm social jetlag.',
      '23:30 là target thực tế, không phải lý tưởng: lý tưởng nhất là ngủ khi tự nhiên buồn ngủ (~22:00–22:30 cho average adult với morning light exposure đủ). 23:30 là realistic target cho người Việt với lifestyle thực tế (ăn tối muộn, social commitments). Điều quan trọng là CONSISTENCY — ngủ 23:30 mỗi đêm tốt hơn ngủ 22:00 ba ngày và 01:00 bốn ngày còn lại.',
      'Cách pull bedtime earlier: không nên đột ngột thay đổi >1h — body clock điều chỉnh ~15 phút/ngày. Pull earlier 15 phút mỗi tuần: nếu đang ngủ 01:00, mất 6–8 tuần để adjust đến 23:30 mà không gây insomnia. Kết hợp với: morning sunlight sáng (anchor giờ dậy → anchor giờ buồn ngủ), giảm bright light sau 20:00, giảm caffeine sau 14:00, và physical activity ban ngày.',
    ],
    points: [
      { icon: '🫀', label: 'Ngủ 22–23h: cardiovascular risk thấp nhất', note: 'UK Biobank 88.000 người: ngủ sau 00:00 tăng CVD risk 12–25%, độc lập với duration' },
      { icon: '🌊', label: 'N3 concentrated 23:00–01:00', note: 'Ngủ muộn = bỏ lỡ peak deep sleep window — không phải chỉ shift timing, mà mất actual N3' },
      { icon: '📅', label: 'Consistency > timing tuyệt đối', note: '23:30 mỗi đêm tốt hơn 22:00 ba ngày + 01:00 bốn ngày — variability disrupts circadian rhythm' },
      { icon: '⏱️', label: 'Pull earlier 15 phút/tuần', note: 'Body clock điều chỉnh 15 phút/ngày — thay đổi đột ngột >1h gây transient insomnia' },
    ],
  },
  {
    id: 'sunlight', icon: '☀️', label: 'Ra ngoài đón nắng sáng', desc: 'Ít nhất 5–10 phút ánh sáng tự nhiên', pillar: 'Nhịp sinh học', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Ánh Sáng Sáng — Zeitgeber Mạnh Nhất Reset Đồng Hồ Sinh Học',
    img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng sáng sớm là "zeitgeber" (time-giver) mạnh nhất để calibrate circadian clock mỗi ngày. Võng mạc có tế bào cảm quang đặc biệt (ipRGC — intrinsically photosensitive retinal ganglion cells) chứa melanopsin, nhạy nhất với ánh sáng xanh 480nm. Khi ánh sáng >1000 lux hit ipRGC: signal đi thẳng đến suprachiasmatic nucleus (SCN) trong hypothalamus — "đồng hồ chủ" của cơ thể. SCN nhận lệnh "đã là ban ngày" → ức chế melatonin → trigger cortisol awakening response → toàn bộ circadian cascade bắt đầu đúng timing.',
    detail: 'Ánh sáng nắng ngoài trời mùa hè VN có thể 50.000–100.000 lux. Đứng gần cửa sổ trong nhà: 500–1.000 lux. Phòng trong nhà bình thường: 100–300 lux. ipRGC cần >1000 lux để trigger circadian signal đầy đủ — giải thích tại sao phải ra ngoài, không chỉ ngồi gần cửa sổ.',
    details: [
      'ipRGC và melanopsin: phát hiện năm 1999 bởi David Berson (Brown University), ipRGC là tế bào cảm quang thứ ba trong võng mạc (ngoài rod và cone). Chức năng của chúng không phải để nhìn — chỉ để đo ánh sáng ambient và signal cho SCN. Chúng nhạy nhất với 480nm (blue), có threshold cao hơn rod/cone — cần ánh sáng đủ MẠNH. Người mù một số loại vẫn có circadian rhythm bình thường nếu ipRGC còn intact.',
      'Cortisol Awakening Response (CAR) amplification: CAR là spike cortisol tự nhiên trong 30–60 phút đầu sau thức — cần thiết cho alertness, immune activation, và metabolic startup buổi sáng. Ánh sáng mạnh buổi sáng amplify CAR — cortisol peak cao hơn và sắc nét hơn. Thiếu sánh sáng sáng → CAR yếu → "brain fog" kéo dài → cần nhiều caffeine hơn để function. Andrew Huberman (Stanford) gọi đây là "most important thing you can do for your health every morning".',
      'Serotonin synthesis và mood: ánh sáng sáng qua ipRGC → trigger serotonin synthesis tại raphe nuclei (brainstem). Serotonin là mood neurotransmitter và precursor của melatonin. "More morning light = more serotonin now = more melatonin tonight." Seasonal Affective Disorder (SAD — trầm cảm mùa đông) điều trị bằng morning light therapy 10.000 lux vì thiếu ánh sáng sáng = serotonin thấp = depression risk tăng. VN gần xích đạo — SAD ít phổ biến, nhưng người làm việc văn phòng cả ngày không khác gì.',
      'Timing window: Golden window là 30–60 phút đầu sau thức dậy. Ánh sáng trong window này có maximum impact trên circadian timing. Sau đó, light exposure vẫn tốt cho sức khỏe mắt và vitamin D nhưng ít tác dụng circadian hơn. Không phải về nhìn thẳng vào mặt trời — ambient light ngoài trời đã đủ. Đứng bóng mát ngoài trời vẫn 10.000–20.000 lux (đủ), phòng sáng nhất trong nhà chỉ 500–1.000 lux (không đủ).',
      'Không cần kính mắt: kính râm, kính cận, kính áp tròng đều giảm ánh sáng hitting ipRGC. Ideal: ra ngoài không đeo kính râm (không nhìn trực tiếp mặt trời). Không thể ra ngoài: SAD lamp 10.000 lux đặt cách mặt 50cm trong 20–30 phút khi ăn sáng — evidence-based cho circadian reset và SAD treatment.',
      'Vitamin D bonus: UV-B trong nắng sáng (thấp, không nguy hiểm) kích hoạt synthesis vitamin D trong da. Người VN trên lý thuyết có đủ nắng nhưng thực tế thiếu vitamin D do: ở trong nhà, kem chống nắng, quần áo che kín. 10–15 phút nắng buổi sáng (trước 10:00) với da tiếp xúc vừa phải = đủ vitamin D synthesis, UV-A thấp (ít risk ung thư da hơn nắng trưa). Double benefit: circadian + vitamin D.',
    ],
    points: [
      { icon: '🏠', label: 'Phòng sáng nhất: 300–1000 lux = không đủ', note: 'ipRGC cần >1000 lux — phải ra ngoài, không thể thay bằng ngồi gần cửa sổ' },
      { icon: '⚡', label: 'Amplify CAR = natural energy sáng', note: 'Cortisol Awakening Response mạnh hơn → tỉnh táo sâu hơn, ít cần caffeine' },
      { icon: '🌙', label: 'Ánh sáng sáng → ngủ ngon tối', note: 'Serotonin → melatonin: morning light quyết định melatonin quality 14–16h sau' },
      { icon: '⏰', label: 'Window vàng: 30–60 phút đầu sau thức', note: 'Không thể bù bằng ánh sáng mạnh buổi trưa — timing đặc biệt quan trọng cho circadian' },
    ],
  },
  {
    id: 'steps', icon: '🚶', label: '8.000+ bước chân', desc: 'Hoặc 30 phút vận động nhẹ', pillar: 'NEAT', color: '#10b981', rgb: '16,185,129',
    modalTitle: '8.000+ Bước Chân — NEAT Là Nền Tảng Sức Khỏe Vận Động',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'NEAT (Non-Exercise Activity Thermogenesis) — năng lượng từ mọi vận động ngoài tập có chủ đích — có thể chiếm 15–50% tổng năng lượng tiêu thụ mỗi ngày. 8.000 bước/ngày là target evidence-based: JAMA Internal Medicine 2021 (16.741 phụ nữ lớn tuổi): mortality giảm dần từ 2.700 bước, plateau ở ~7.500 bước. JAMA Neurology 2022: 9.800 bước/ngày liên quan đến giảm 51% risk dementia và 57% giảm anxiety/depression. 8.000 bước/ngày là điểm "ngưỡng" cost-effective nhất cho cả longevity và mental health.',
    detail: '10.000 bước là con số marketing từ pedometer Nhật 1964, không phải evidence-based target. Khoa học hiện đại cho thấy benefit lớn nhất từ việc tăng từ ít (2.000–4.000) lên vừa phải (7.000–8.000 bước) — thêm từ 8.000 lên 12.000 có benefit nhỏ hơn nhiều.',
    details: [
      'Sedentary behavior là risk factor độc lập: ngay cả người tập gym 1h/ngày nhưng ngồi 9–10h còn lại có increased risk — exercise không "offset" sitting. Lipoprotein lipase (LPL), enzyme quan trọng để process fat và glucose, bị inactivated khi ngồi. Mỗi giờ ngồi, LPL hoạt động giảm đáng kể; đứng hoặc đi lại brief (2–3 phút mỗi giờ) restore LPL activity. Đây là lý do NEAT (steps) quan trọng riêng biệt với structured exercise.',
      '8.000 bước và cognitive health: Walking tăng hippocampal volume (vùng não cho memory và learning) — một trong số ít interventions có thể increase gray matter volume ở người trưởng thành. BDNF (Brain-Derived Neurotrophic Factor) tăng sau aerobic activity, bao gồm brisk walking — "Miracle-Gro for the brain" theo John Ratey (Spark). 30–40 phút walking moderate intensity tăng BDNF đủ để improve memory consolidation trong 24h tiếp theo.',
      'Postprandial walking và blood sugar: đi bộ 10–15 phút sau mỗi bữa ăn giảm postprandial blood glucose spike 30–50% bằng cách tăng glucose uptake vào cơ bắp (non-insulin dependent — hoạt động ngay cả ở người insulin resistant). Đây là một trong những low-effort, high-impact interventions cho metabolic health. 3 lần × 10 phút sau bữa ăn = 30 phút vận động + ~2.000–3.000 bước + significant blood sugar control.',
      'Bước chân thực tế VN: người đi làm văn phòng ở VN trung bình ~4.000–6.000 bước/ngày. Gap từ 5.000 → 8.000 bước = 3.000 bước = 25–30 phút đi bộ. Cách thực tế: parking/xe ôm xa 500m (500 bước × 2 = 1.000/ngày), leo cầu thang (100–200 bước/tầng), đi bộ sau bữa trưa 15 phút (~1.500 bước). Tổng: không cần thêm "thời gian tập" riêng.',
      'Pace và intensity: "8.000 bước" không phân biệt pace — nhưng có evidence cho richer benefit từ brisk walking (100–130 bước/phút, cảm giác "có thể nói chuyện nhưng hơi khó"). Brisk walking 30 phút/ngày đạt moderate-intensity aerobic guideline. Mix: 6.000 bước casual (NEAT từ daily activities) + 2.000 bước brisk walk buổi trưa hoặc tối = optimal cho cả NEAT và cardiovascular benefit.',
      'Tracking và psychology: fitness tracker (điện thoại, smartwatch, pedometer rẻ) tạo real-time feedback loop — thấy số bước tăng theo ngày là "visual cue" và mini-reward. Research cho thấy người dùng step tracker đi thêm trung bình 2.000 bước/ngày so với không dùng. Không cần tracker đắt tiền — health app trên điện thoại Android/iOS đã count steps miễn phí. Weekly average quan trọng hơn daily — đừng bỏ cuộc nếu một ngày kém.',
    ],
    points: [
      { icon: '📊', label: '8.000 bước: điểm ngưỡng optimal', note: 'Mortality benefit plateau ở 7.500–8.000 — thêm lên 12.000 có ít benefit hơn nhiều' },
      { icon: '🧠', label: 'BDNF tăng sau walking — Miracle-Gro não', note: 'Hippocampal volume tăng, memory consolidation tốt hơn — không intervention nào khác làm được' },
      { icon: '🍽️', label: 'Walk 10 phút sau ăn = -30–50% glucose spike', note: 'Non-insulin dependent glucose uptake — effective ngay cả khi insulin resistant' },
      { icon: '🚗', label: 'Parking xa + cầu thang = +3.000 bước/ngày', note: 'Không cần thêm "thời gian tập" — tích hợp vào sinh hoạt bình thường là đủ' },
    ],
  },
  {
    id: 'water', icon: '💧', label: 'Uống đủ nước', desc: 'Công thức: cân nặng × 35ml', pillar: 'Lối sống', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Uống Đủ Nước — Hydration Ảnh Hưởng Mọi Hệ Thống',
    img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Công thức cân nặng × 35ml là guideline thực hành đơn giản nhất (người 60kg cần ~2.1L, 70kg cần ~2.45L, 80kg cần ~2.8L). Chỉ cần 1–2% dehydration (700ml–1L với người 70kg) đã gây: concentration giảm 12%, short-term memory giảm, reaction time chậm, subjective effort tăng (tasks feel harder). Não là 73% nước — dehydration nhẹ làm neurotransmission chậm lại trước khi bạn cảm thấy khát.',
    detail: 'Cảm giác khát xuất hiện khi đã dehydrated 1–2% — nghĩa là khát không phải indicator tốt cho hydration status. Đặc biệt ở người cao tuổi, cảm giác khát blunted thêm. Uống theo schedule (mỗi giờ, sau mỗi bữa ăn, buổi sáng khi thức) tốt hơn uống theo cảm giác khát.',
    details: [
      'Dehydration và cognitive function: David Benton (University of Swansea) meta-analysis: ngay cả dehydration nhẹ (1%) giảm attention, psychomotor và immediate memory, đặc biệt ở trẻ em và người cao tuổi. Não sử dụng 20% tổng năng lượng cơ thể và cần hydration đầy đủ để efficient. Mỗi neurotransmission qua synapse cần water-based environment. Dehydration tăng viscosity của blood → giảm cerebral blood flow → slows everything.',
      'Kidney function và detox: thận lọc 180L plasma/ngày, tái hấp thu 99% nước và xuất ra 1–2L urine. Uống không đủ → urine đậm đặc → kidney stones risk tăng → UTI risk tăng → concentrated toxin không được cleared nhanh. Target urine color: pale yellow (số 1–3 trên urine color chart). Urine trong vàng đậm → dehydrated. Urine không màu → over-hydrated (electrolytes diluted — cũng không tốt).',
      'Metabolism và weight management: nghiên cứu của Michael Boschmann (Charite University Berlin): uống 500ml nước lạnh tăng metabolic rate 30% trong 30–40 phút (thermogenesis để warm water lên body temperature). Uống nước trước bữa ăn (500ml, 30 phút trước) giảm caloric intake: appetite suppression do stomach distension, differentiation "hungry vs thirsty" signals tốt hơn. Hypothesis: nhiều người overeating vì nhầm khát thành đói.',
      'Electrolytes và hydration quality: water alone không phải hydration tốt nhất — electrolytes (Na, K, Mg) cần thiết để giữ nước trong tế bào. Người vận động nhiều hoặc đổ mồ hôi nhiều: thêm pinch of sea salt (sodium) hoặc electrolyte tablet vào nước. Không cần sport drinks (nhiều đường) — homemade electrolyte: 500ml water + pinch salt + squeeze lemon (potassium) + dash honey nếu cần. Coconut water (nước dừa) là natural electrolyte drink tốt.',
      'Practical hydration habits: (1) Ly nước 500ml ngay khi thức (ly đặt sẵn bên giường tối hôm trước). (2) Bình nước 1L trên bàn làm việc — visual cue nhắc uống. (3) Uống 1–2 ly nước trước mỗi bữa ăn. (4) Sau mỗi cup cà phê: 1 cup nước (cà phê có mild diuretic effect). (5) Set reminder điện thoại mỗi 1–1.5h. (6) Infuse nước với chanh, dưa chuột, bạc hà nếu khó uống nước plain.',
      'Hydration và skin, joint, performance: collagen (cấu trúc da) cần nước để maintain elasticity và plumpness. Cartilage (sụn khớp) 80% nước — dehydration tăng joint stiffness và pain. Athletic performance: dehydration 2% giảm endurance performance 10–15%, strength/power performance 5–8%. Cho bất kỳ ai tập luyện hoặc vận động nhiều: target 40ml × cân nặng thay vì 35ml.',
    ],
    points: [
      { icon: '🧮', label: 'Công thức: cân nặng (kg) × 35ml = target', note: '70kg = 2.45L/ngày — urine pale yellow là dấu hiệu đơn giản nhất của đủ nước' },
      { icon: '😵', label: '1% dehydration = -12% concentration', note: 'Khát xuất hiện sau khi đã dehydrated — uống theo schedule, không theo cảm giác khát' },
      { icon: '🔥', label: '500ml nước lạnh tăng metabolism 30%', note: 'Thermogenesis để warm water — uống sáng sớm và trước bữa ăn maximize double benefit' },
      { icon: '💡', label: 'Bình nước trên bàn = visual cue tốt nhất', note: 'Thấy bình nước → nhớ uống — Friction Design đơn giản nhất cho hydration' },
    ],
  },
  {
    id: 'no_phone_morning', icon: '📵', label: 'Không phone 30 phút đầu', desc: 'Sau khi thức dậy buổi sáng', pillar: 'Môi trường', color: '#f43f5e', rgb: '244,63,94',
    modalTitle: 'Không Phone 30 Phút Đầu — Bảo Vệ Não Trong Golden Window',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Prefrontal Cortex (PFC) — vùng điều hành tư duy phê phán, ra quyết định, self-control và emotional regulation — cần 20–30 phút để fully activate sau sleep inertia. Kiểm tra điện thoại ngay khi thức đặt não vào reactive mode (xử lý notifications, emails, social comparison) TRƯỚC KHI PFC sẵn sàng — để người khác đặt agenda cho ngày của bạn trong khi não chưa có phòng vệ nhận thức. 30 phút phone-free = PFC warm-up tự nhiên + DMN hoạt động cho sáng tạo + proactive mindset thay vì reactive.',
    detail: 'Điện thoại buổi sáng không chỉ lãng phí thời gian — nó tái cấu trúc mental state từ đầu ngày. Mỗi notification là micro-stressor; social comparison kích hoạt amygdala; news tiêu cực raise cortisol. Tất cả TRƯỚC KHI não đủ khả năng xử lý và filter chúng.',
    details: [
      'Sleep inertia và PFC impairment: "sleep inertia" là cognitive impairment kéo dài 15–30 phút (đôi khi đến 60 phút) sau thức — PFC chưa hoạt động đầy đủ, gray matter metabolism chưa đạt peak, decision-making kém, impulse control giảm. Checking điện thoại trong sleep inertia = processing information khi cognitive defenses thấp nhất. Người có "brain fog" sáng thường bị nặng hơn do phone exposure trước khi sleep inertia clear.',
      'Dopamine loop và morning hijack: notifications tạo "variable reward schedule" (không biết có gì mới không) — structure giống slot machine, kích hoạt dopamine seeking loop. Dopamine là "wanting neurotransmitter" — tạo craving, không phải satisfaction. Checking điện thoại đầu ngày đặt brain vào dopamine-seeking mode trước khi có deep work — after that, rất khó shift sang slow, focused thinking. "Morning scroll → afternoon unable to concentrate" là pattern phổ biến.',
      'Default Mode Network (DMN) và sáng tạo: khi không có external input, não hoạt động qua DMN — liên quan đến day-dreaming, memory consolidation, creative insight, future planning và self-reflection. DMN hoạt động mạnh nhất sau ngủ dậy — brain đang "defragmenting" và connecting dots từ ngày hôm trước. Điện thoại ngay khi thức suppress DMN và kích hoạt Task-Positive Network (reactive processing) — mất window sáng tạo tự nhiên nhất trong ngày.',
      'Cortisol và anxious start: email và news tiêu cực buổi sáng raise cortisol trước CAR đã normalize. Cortisol cao từ external stressors khác với healthy CAR: tạo narrow thinking (tunnel vision), reduced working memory, increased anxiety. Người bắt đầu ngày với worry/stress từ phone thường report feeling "overwhelmed" và "behind" ngay từ sáng — không phải vì công việc nhiều hơn mà vì mental bandwidth bị hẹp từ đầu.',
      'Implementation strategies: (1) Điện thoại ở phòng khác khi ngủ (từ tuần 1 của 30-day challenge) → không thể check ngay khi thức. (2) Đồng hồ báo thức vật lý loại bỏ "cần phone để báo thức". (3) Grayscale mode giảm visual appeal. (4) App blocker (Forest, Freedom, Digital Wellbeing) block social apps trước 8:00. (5) Thay phone bằng activity khác: uống nước, ra đón nắng, đọc sách, journal. Fill the space với alternatives, đừng chỉ "không làm gì".',
      'Nghiên cứu về morning phone check: Deloitte Global Mobile Consumer Survey: 68% người check phone trong 10 phút đầu sau thức. IDC Research: 80% smartphone users check phone trước khi đánh răng. Không có nghiên cứu RCT dài hạn về morning phone-free specifically, nhưng: studies on reactive vs proactive morning routines cho thấy proactive starters (intention-setting trước checking inputs) có lower stress, higher focus, và better mood outcomes cả ngày.',
    ],
    points: [
      { icon: '🧠', label: 'PFC cần 20–30 phút warm-up', note: 'Sleep inertia: impulse control và decision-making kém — worst time để nhận external inputs' },
      { icon: '🎰', label: 'Variable reward = slot machine cho não', note: 'Không biết có gì mới → dopamine seeking → khó shift sang deep work sau đó' },
      { icon: '💡', label: 'DMN: sáng tạo tự nhiên nhất sau ngủ', note: 'Phone suppress DMN → mất window insightful thinking, problem-solving và self-reflection' },
      { icon: '📵', label: 'Phone ở phòng khác = zero willpower', note: 'Cất điện thoại tối hôm trước → sáng không thể check ngay → 30 phút xảy ra tự động' },
    ],
  },
  {
    id: 'breathing', icon: '🌬️', label: 'Thực hành thở có chủ ý', desc: '5 phút thở cơ hoành hoặc box breathing', pillar: 'Thở', color: '#14b8a6', rgb: '20,184,166',
    modalTitle: 'Thở Có Chủ Ý — Công Cụ Duy Nhất Điều Khiển ANS Trực Tiếp',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hơi thở là cơ quan duy nhất trong hệ thần kinh tự chủ (Autonomic Nervous System) mà bạn có thể kiểm soát CÓ CHỦ Ý — không cần thiết bị, thuốc hay thời gian dài. ANS kiểm soát heart rate, huyết áp, tiêu hóa, immune function và stress response. Thở chậm và sâu (5–6 hơi/phút) kích hoạt mạnh vagus nerve → parasympathetic dominance → cortisol giảm, HRV tăng, inflammatory markers giảm. Chỉ 5 phút/ngày tạo changes đo được trong HRV baseline sau 4–8 tuần.',
    detail: 'Hầu hết người trưởng thành thở 15–20 lần/phút (chronic hyperventilation nhẹ) — quá nhanh để kích hoạt đủ parasympathetic response. Thở có chủ ý 5–6 lần/phút (resonance frequency breathing) đồng bộ với nhịp tim tự nhiên — tạo maximum HRV và vagal tone.',
    details: [
      'Vagus nerve và thở chậm: vagus nerve (nerve thứ 10, dài nhất cơ thể) là con đường chính của parasympathetic system. Trong hơi thở vào: heart rate tăng nhẹ (sympathetic). Trong hơi thở ra: heart rate giảm (parasympathetic — vagus nerve activation). Hơi thở ra DÀI HƠN hơi thở vào → net parasympathetic effect. Box breathing (4-4-4-4) và 4-7-8 breathing đều có exhale ≥ inhale để maximize vagal activation. Thở qua mũi (nasal breathing) thêm nitric oxide release → vasodilation.',
      'Box breathing (4-4-4-4): hít vào 4 giây → giữ 4 giây → thở ra 4 giây → giữ 4 giây. Đây là kỹ thuật được Navy SEALs và elite athletes dùng trong high-stress situations để maintain PFC function khi amygdala bị activate. Cortisol giảm đo được sau 5 phút box breathing. 10–15 phút/ngày sau 8 tuần: PTSD symptoms giảm, depression và anxiety giảm có ý nghĩa thống kê (nghiên cứu của Brown & Gerbarg).',
      'Thở cơ hoành (diaphragmatic breathing): 70% người thở ngực (shallow, upper chest) thay vì thở bụng (cơ hoành). Thở ngực không kích hoạt vagus nerve đủ vì ít kéo giãn phổi và không massage abdominal organs. Thở cơ hoành: nằm/ngồi, đặt tay lên bụng, hít vào để bụng phình ra (không phải ngực), thở ra bụng xẹp lại. Thở 6 lần/phút, 5–10 phút. Research Stanford (David Spiegel): chỉ 5 phút/ngày trong 1 tháng giảm anxiety 25% và improve focus.',
      'CO₂ tolerance và panic: nhiều người không biết rằng "cảm giác muốn thở" không phải do thiếu oxygen — mà do CO₂ tích lũy. Khi hold breath, CO₂ tăng → cảm giác cần thở (panic response ở người CO₂ intolerant). Luyện tập thở giúp tăng CO₂ tolerance → giảm anxiety khi không thở ngay → calm trong stressful situations. Wim Hof method và Oxygen Advantage (Patrick McKeown) focus nhiều vào CO₂ tolerance training.',
      'HRV và breathing practice: Heart Rate Variability (HRV) — variation trong time between heartbeats — là marker tốt nhất của autonomic health và recovery. Higher HRV = better parasympathetic tone = better stress resilience. Consistent breathing practice (5–6 phút/ngày) tăng resting HRV baseline sau 4–8 tuần — effect size tương đương regular aerobic exercise. Tracking HRV (Garmin, Polar, Oura Ring) cho feedback khách quan về breathing practice đang work.',
      'Khi nào và cách thực hành 5 phút: BUỔI SÁNG (tốt nhất): sau uống nước, trước breakfast, tăng parasympathetic tone cho ngày. TRƯỚC BỮA ĂN: giảm sympathetic activity → tiêu hóa tốt hơn. SAU HỌP/STRESSFUL EVENTS: "physiological sigh" (hít vào 2 lần ngắn + thở ra dài 1 lần) reset stress ngay lập tức. TRƯỚC NGỦ: 4-7-8 breathing (4 giây hít, 7 giây giữ, 8 giây thở ra) giảm sleep latency. Đơn giản nhất để bắt đầu: timer 5 phút, thở 4 giây vào + 6 giây ra, đếm = 50 hơi.',
    ],
    points: [
      { icon: '🎛️', label: 'Hơi thở = remote control của ANS', note: 'Cơ quan duy nhất trong autonomic NS bạn điều khiển chủ ý — không cần thiết bị hay thuốc' },
      { icon: '📈', label: 'HRV tăng sau 4–8 tuần luyện tập', note: 'Effect size tương đương regular aerobic exercise — metric khách quan nhất để track progress' },
      { icon: '🫁', label: 'Thở ra dài hơn hít vào = parasympathetic', note: 'Box 4-4-4-4 hoặc 4-7-8: exhale ≥ inhale để maximize vagus nerve activation' },
      { icon: '⚡', label: 'Physiological sigh: reset stress 30 giây', note: '2 hít ngắn + 1 thở ra dài = fastest stress recovery kỹ thuật được khoa học verify' },
    ],
  },
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
  const { t: tPillars } = useTranslation('pillars');
  const hero = tPillars('pillarC.c_checklist_hero', { returnObjects: true }) || {};
  const [checked, setChecked] = useState({});
  const [weekAnswers, setWeekAnswers] = useState({});
  const [weeklyQIdx, setWeeklyQIdx] = useState(null);
  const [dailyItemIdx, setDailyItemIdx] = useState(null);
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
        {hero.breadcrumb || 'Lối Sống Khỏe'}
      </Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${RGB},0.2)` }}>✅</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight animate-fade-in-up">{hero.title || 'Checklist Lối Sống'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>{hero.badge || 'C8 · Daily Checklist'}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{hero.desc || '7 hành động lối sống khỏe mỗi ngày — đơn giản, dễ theo dõi, tích lũy dần thành thói quen bền vững. Đánh dấu xong mỗi ngày, theo dõi chuỗi ngày liên tiếp.'}</p>
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
          {DAILY_ITEMS.map((item, di) => (
            <div key={item.id} onClick={() => toggle(item.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${checked[item.id] ? 'opacity-70' : 'hover:border-teal-500/20'}`} style={{ background: checked[item.id] ? `rgba(${RGB},0.08)` : 'var(--color-surface)', borderColor: checked[item.id] ? `rgba(${RGB},0.3)` : undefined }}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked[item.id] ? 'border-teal-400' : 'border-border'}`} style={{ background: checked[item.id] ? COLOR : undefined }}>
                {checked[item.id] && <span className="text-white text-base font-bold">✓</span>}
              </div>
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <div className={`text-lg font-medium transition-all ${checked[item.id] ? 'line-through text-muted' : 'text-text'}`}>{item.label}</div>
                <div className="text-base text-muted">{item.desc}</div>
              </div>
              <span className="text-base px-2 py-0.5 rounded-full font-bold shrink-0" style={{ background: `${item.color}15`, color: item.color }}>{item.pillar}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setDailyItemIdx(di); }}
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                style={{ background: `rgba(${item.rgb},0.15)`, color: item.color, border: `1px solid rgba(${item.rgb},0.3)` }}
                title="Xem chi tiết khoa học">ℹ</button>
            </div>
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

      {/* ── Daily item modal — outside all RevealBlocks ── */}
      {dailyItemIdx !== null && (
        <ChecklistModal
          item={DAILY_ITEMS[dailyItemIdx]}
          idx={dailyItemIdx}
          total={DAILY_ITEMS.length}
          onClose={() => setDailyItemIdx(null)}
          onPrev={() => setDailyItemIdx(i => Math.max(0, i - 1))}
          onNext={() => setDailyItemIdx(i => Math.min(DAILY_ITEMS.length - 1, i + 1))}
          hasPrev={dailyItemIdx > 0}
          hasNext={dailyItemIdx < DAILY_ITEMS.length - 1}
        />
      )}

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
          {hero.nav_prev || 'Thiết Kế Môi Trường'}
        </Link>
        <Link to="/pillar/c" className="text-lg text-muted hover:text-teal-400 transition-colors text-center">
          {hero.nav_all || 'Tất cả Module Lối Sống →'}
        </Link>
        <Link to="/pillar/c/assessment" className="flex items-center gap-2 text-lg text-muted hover:text-text transition-colors group justify-end">
          {hero.nav_next || 'Đánh Giá Lối Sống'}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
