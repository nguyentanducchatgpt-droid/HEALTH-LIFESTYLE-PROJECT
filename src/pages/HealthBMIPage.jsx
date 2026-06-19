import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#3b82f6';
const RGB = '59,130,246';
const ORBIT_ID = 'e-bmi-orbit-kf';
const ORBIT_CLASS = 'e-bmi-orbit-ring';
const PROP = '--e-bmi-orbit-angle';
const E0_KEY = 'healthapp_e0_profile';

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

const BMI_CATS = [
  {
    range: '< 18.5', label: 'Thiếu cân', color: '#f59e0b', rgb: '245,158,11', icon: '⚖️',
    action: 'Kiểm tra ăn uống, cơ bắp, bệnh lý nền. Tăng protein và calo lành mạnh.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'WHO định nghĩa thiếu cân là BMI < 18.5 kg/m². Thiếu cân liên quan đến suy giảm miễn dịch, loãng xương, thiếu máu và nguy cơ tử vong cao hơn — đặc biệt ở phụ nữ trong độ tuổi sinh sản. Tuy nhiên, BMI thấp không phải lúc nào cũng bệnh lý — người tầm vóc nhỏ hoặc ít cơ nhưng khỏe mạnh cần đánh giá thêm vòng eo, xét nghiệm máu và chức năng thể lực.',
    detail: 'Thiếu cân có thể do nhiều nguyên nhân: ăn không đủ, chuyển hóa cao bất thường, hoặc bệnh lý nền như cường giáp, celiac, viêm ruột. Trước khi tăng cân "bằng mọi cách", cần xác định nguyên nhân. Tăng protein + calo lành mạnh là nền tảng, nhưng tăng cơ quan trọng hơn tăng mỡ.',
    details: [
      'Phân biệt thiếu cân sinh lý và bệnh lý: thiếu cân sinh lý (ăn ít, hoạt động cao, vóc dáng nhỏ) khác với thiếu cân bệnh lý (sụt cân không chủ ý, mệt mỏi, tóc rụng, da khô). Nếu cân giảm >5% trong 6 tháng không rõ nguyên nhân → cần xét nghiệm: tuyến giáp (TSH/T4), CBC, CMP.',
      'Mục tiêu tăng cân lành mạnh: 0.25–0.5 kg/tuần là tốc độ an toàn. Thêm 300–500 kcal/ngày vào TDEE. Protein 1.6–2g/kg để hỗ trợ tăng cơ. Kết hợp resistance training (3 buổi/tuần) để calo dư vào cơ, không vào mỡ.',
      'Thực phẩm tăng calo lành mạnh: bơ đậu phộng (100g = 588 kcal), hạt hỗn hợp (~600 kcal/100g), avocado (160 kcal/100g), cơm/mì phức hợp, trứng, sữa nguyên kem, cá hồi, thịt đỏ nạc. Ưu tiên thực phẩm giàu vi chất — không chỉ calo rỗng từ đường và dầu.',
      'Loãng xương và thiếu cân: BMI thấp là yếu tố nguy cơ loãng xương độc lập vì lực cơ thể lên xương ít và thường đi kèm thiếu vitamin D, canxi. Phụ nữ thiếu cân có nguy cơ mất kinh và giảm estrogen → mất xương nhanh. Bổ sung canxi (1000mg) + D3 (1000–2000 IU).',
      'Suy giảm miễn dịch: thiếu năng lượng và micronutrients (kẽm, sắt, B12, folate) làm giảm sản xuất tế bào miễn dịch. Người thiếu cân thường bị cảm cúm thường xuyên hơn và hồi phục chậm hơn. Protein không đủ = không đủ nguyên liệu tổng hợp kháng thể.',
      'Khi nào cần can thiệp y tế: thiếu cân kèm amenorrhea (mất kinh >3 tháng), mệt mỏi mãn tính, chóng mặt khi đứng, nhịp tim bất thường, hoặc sụt cân nhanh không giải thích được → cần đánh giá y tế. Eating disorder cần tiếp cận chuyên biệt từ bác sĩ và nhà tâm lý.',
    ],
    points: [
      { icon: '🥩', label: 'Protein 1.6–2g/kg', note: 'Nền tảng tăng cơ — không tăng mỡ' },
      { icon: '🏋️', label: 'Resistance training 3×/tuần', note: 'Định hướng calo dư vào cơ bắp' },
      { icon: '🦴', label: 'Ca + D3 nếu BMI < 18.5', note: 'Nguy cơ loãng xương tăng khi thiếu cân' },
      { icon: '🩺', label: 'Kiểm tra tuyến giáp, CBC', note: 'Loại trừ nguyên nhân bệnh lý trước khi tăng cân' },
    ],
  },
  {
    range: '18.5–24.9', label: 'Bình thường', color: '#10b981', rgb: '16,185,129', icon: '✅',
    action: 'Duy trì cân nặng. Theo dõi xu hướng hàng tháng. Kiểm tra thêm vòng eo.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'BMI 18.5–24.9 là khoảng bình thường theo WHO. Nghiên cứu Sharma et al. (2020): BMI 22–23 liên quan đến mortality thấp nhất ở người Châu Á. Người BMI "bình thường" vẫn có thể có metabolic syndrome nếu vòng eo lớn — còn gọi là TOFI (Thin Outside, Fat Inside). Composition (tỷ lệ cơ/mỡ) quan trọng hơn con số BMI.',
    detail: 'Bình thường không có nghĩa là "không cần làm gì." Quan trọng là duy trì composition, không chỉ giữ số trên cân. Người 70kg, 170cm (BMI 24.2) với 25% body fat sẽ khác hoàn toàn với người cùng cân nặng nhưng 15% body fat và nhiều cơ hơn.',
    details: [
      'TOFI (Thin Outside Fat Inside) — nguy cơ ẩn: người BMI bình thường nhưng ít cơ và mỡ nội tạng cao → metabolic risk tương đương người thừa cân. Vòng eo >80cm (nữ) hoặc >90cm (nam) trong khi BMI bình thường = cần chú ý và kiểm tra markers chuyển hóa.',
      'Body composition quan trọng hơn BMI: 1kg cơ chiếm thể tích nhỏ hơn 1kg mỡ. Người tập resistance training có thể BMI 24–25 nhưng tỷ lệ mỡ 12–15% (rất tốt). Ngược lại, người ít vận động BMI 22 có thể 28–30% body fat (không tốt). DEXA scan hoặc InBody là chuẩn vàng.',
      'Mục tiêu duy trì: không phải "giữ cân không đổi" mà là "duy trì muscle mass khi già đi." Sau 30 tuổi, cơ thể mất 1–2% muscle mass mỗi năm (sarcopenia) nếu không tập. Người 45 tuổi cùng cân với 25 tuổi nhưng ít cơ hơn 10–20% = sức khỏe chuyển hóa kém hơn.',
      'Theo dõi vòng eo hàng tháng: cân không thể phân biệt nước, cơ, mỡ. Đo vào buổi sáng trước ăn, cùng vị trí mỗi lần. Trend quan trọng hơn: vòng eo tăng đều 0.5cm/tháng qua nhiều tháng → cần điều chỉnh dù cân không thay đổi.',
      'Duy trì với ăn uống: dùng đĩa chia 50/25/25 (rau/protein/carb). Protein 1.2–1.6g/kg để bảo toàn muscle mass. Hạn chế ultra-processed food. Nhịn đói 12–16 giờ/ngày (intermittent fasting) có bằng chứng cho duy trì metabolic health.',
      'Dấu hiệu cần điều chỉnh: dù BMI bình thường, nếu vòng eo tăng dần, năng lượng giảm → kiểm tra glucose lúc đói (>100 mg/dL = pre-diabetes), lipid panel, và tăng cường resistance training + protein.',
    ],
    points: [
      { icon: '📏', label: 'Đo vòng eo hàng tháng', note: 'BMI không phân biệt mỡ/cơ — vòng eo phản ánh thực chất hơn' },
      { icon: '💪', label: 'Resistance training giữ cơ khi già', note: '-1–2% cơ/năm sau 30 tuổi nếu không tập' },
      { icon: '🎯', label: 'BMI 22–23 tối ưu nhất cho người Á', note: 'Sharma 2020: mortality thấp nhất ở khoảng này' },
      { icon: '⚠️', label: 'TOFI: nguy cơ ẩn trong BMI bình thường', note: 'Vòng eo cao dù cân bình thường = cần kiểm tra' },
    ],
  },
  {
    range: '25–29.9', label: 'Thừa cân', color: '#f59e0b', rgb: '245,158,11', icon: '⚠️',
    action: 'Điều chỉnh ăn uống, tăng vận động. Đo thêm vòng eo để đánh giá mỡ bụng.',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'BMI 25–29.9 là "overweight" theo WHO, nhưng bức tranh phức tạp hơn. Ở cá nhân trẻ tuổi (<50), thừa cân liên quan đến tăng nguy cơ đái tháo đường type 2, tăng huyết áp, sleep apnea và bệnh tim mạch. Vòng eo quan trọng hơn để phân tầng nguy cơ — BMI 27 với vòng eo bình thường rủi ro thấp hơn BMI 27 với vòng eo cao.',
    detail: 'Thừa cân không phải tình trạng tất cả giống nhau. Người 27 BMI chủ yếu cơ bắp khác người 27 BMI chủ yếu mỡ bụng. Bước đầu tiên: đo vòng eo và kiểm tra markers chuyển hóa (glucose, lipid, huyết áp). Từ đó quyết định mức độ can thiệp cần thiết.',
    details: [
      'Phân tầng nguy cơ theo vòng eo: BMI 25–29.9 + vòng eo bình thường (<80cm nữ, <90cm nam) = nguy cơ thấp hơn. BMI 25–29.9 + vòng eo cao = nguy cơ chuyển hóa đáng kể. Kiểm tra: glucose đói >100 = pre-diabetes, TG >150, HDL thấp, huyết áp >130/85 = metabolic syndrome.',
      'Giảm 5–10% cân nặng đủ để thay đổi nguy cơ: với người 80kg = giảm 4–8kg được chứng minh giảm nguy cơ đái tháo đường 58% (DPP Study), huyết áp 5–10 mmHg, TG 20–30%, cải thiện sleep apnea. Không cần đạt BMI lý tưởng để có benefit.',
      'Deficit calo bền vững: -300 đến -500 kcal/ngày là "sweet spot" — đủ để giảm 0.3–0.5 kg/tuần mà không gây đói quá mức, mất cơ hay rebound. Tránh crash diet (<1200 kcal/ngày cho phụ nữ) vì mất cơ nhiều, metabolic rate giảm và khó duy trì.',
      'Ưu tiên thực phẩm no lâu: protein kích hoạt GLP-1 và peptide YY — hormone no nhiều nhất. Chất xơ làm chậm tiêu hóa và ổn định glucose. Nước trước bữa ăn 500ml giảm caloric intake trung bình 13%. Thay thế đồ uống có đường bằng nước: -200–400 kcal/ngày dễ dàng.',
      'Vận động để duy trì giảm cân: exercise quan trọng nhất để DUY TRÌ sau khi đã giảm — không phải để giảm ban đầu. National Weight Control Registry: người giảm >13kg và duy trì >1 năm đi bộ hoặc tương đương 60 phút/ngày. Resistance training giúp giữ muscle trong quá trình giảm cân.',
      'Sleep và stress — yếu tố ẩn: ngủ <6 giờ làm tăng ghrelin (hormone đói) 15% và giảm leptin (hormone no) 15% → ăn nhiều hơn 200–400 kcal/ngày không tự giác. Cortisol mãn tính thúc đẩy tích trữ mỡ bụng. Giảm cân mà không giải quyết ngủ và stress = ngược gió.',
    ],
    points: [
      { icon: '📊', label: 'Giảm 5–10%: đủ để thay đổi nguy cơ', note: 'DPP Study: -58% nguy cơ đái tháo đường chỉ với -5–7% cân' },
      { icon: '⚡', label: 'Deficit -300 đến -500 kcal/ngày', note: 'Vừa đủ để giảm bền — tránh crash diet làm mất cơ' },
      { icon: '😴', label: 'Ngủ <6h = +400 kcal/ngày không tự giác', note: 'Ghrelin tăng, leptin giảm — ngủ đủ là can thiệp miễn phí' },
      { icon: '🏃', label: 'Tập để DUY TRÌ, không để giảm ban đầu', note: 'Exercise quan trọng nhất sau khi đã giảm' },
    ],
  },
  {
    range: '30–34.9', label: 'Béo phì độ I', color: '#ef4444', rgb: '239,68,68', icon: '🔴',
    action: 'Cần kế hoạch dài hạn. Nên tư vấn chuyên môn về dinh dưỡng và vận động.',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Béo phì độ I (BMI 30–34.9) liên quan đến tăng nguy cơ: đái tháo đường type 2 tăng 7×, bệnh tim mạch tăng 2×, 13 loại ung thư khác nhau, sleep apnea, viêm khớp và suy thận mãn tính. Tuy nhiên, béo phì là bệnh mãn tính có cơ chế sinh lý học phức tạp — không chỉ là "thiếu ý chí." Leptin resistance, thay đổi microbiome, yếu tố di truyền đều có vai trò.',
    detail: 'Béo phì độ I cần kế hoạch can thiệp toàn diện, không phải chỉ "ăn ít lại." Combination approach: chế độ ăn có cấu trúc + vận động tăng dần + hành vi (ngủ, stress) + hỗ trợ tâm lý nếu cần. Mục tiêu thực tế: 5–15% giảm cân trong 6–12 tháng.',
    details: [
      'Cơ chế leptin resistance: mỡ thừa tiết leptin nhưng béo phì mãn tính gây "leptin resistance" — não không nhận được tín hiệu no dù leptin cao. Tương tự insulin resistance. Hậu quả: não luôn nghĩ đang đói dù đã ăn đủ → khó kiểm soát khẩu phần chỉ bằng ý chí.',
      'Protein và chế độ ăn có cấu trúc: protein 1.2–1.6g/kg cân nặng lý tưởng giúp giảm hunger hormones và giữ muscle mass. Tránh bỏ bữa — làm tăng hunger và binge eating sau đó. Chế độ Mediterranean hoặc whole-food tốt hơn low-fat hay low-carb nghiêm ngặt cho dài hạn.',
      'Vận động tăng dần từ thấp: bắt đầu với đi bộ 10 phút sau bữa ăn (30 phút/ngày) — không cần phòng gym. Mục tiêu đầu tiên: không đau khớp, không chấn thương. Sau 4–6 tuần, tăng dần lên 45–60 phút. Water aerobics và bơi lội ideal vì giảm tải trọng khớp.',
      'Comorbidities cần theo dõi: BMI 30+ → kiểm tra mỗi 6 tháng: glucose đói + HbA1c, lipid panel, huyết áp, chức năng gan (NAFLD phổ biến), tầm soát sleep apnea (STOP-BANG questionnaire).',
      'Can thiệp hành vi và tâm lý: 25–30% người béo phì có binge eating disorder (BED). CBT cho ăn uống cảm xúc và BED hiệu quả ngang dược phẩm trong nhiều RCT. Không xử lý yếu tố tâm lý → khó duy trì bất kỳ chế độ nào.',
      'Dược phẩm khi cần: BMI ≥30 với comorbidities → thuốc giảm cân (semaglutide/GLP-1 agonists) được FDA approve và chứng minh giảm 15–20% cân nặng. BMI ≥35 với comorbidities nghiêm trọng → phẫu thuật bariatric — giảm trung bình 25–30%, đảo ngược đái tháo đường type 2 trong 60–80% trường hợp.',
    ],
    points: [
      { icon: '🧬', label: 'Leptin resistance: não luôn nghĩ đang đói', note: 'Cơ chế sinh lý học — không phải thiếu ý chí' },
      { icon: '🎯', label: 'Mục tiêu: 5–15% trong 12 tháng', note: 'Đủ để cải thiện tất cả markers — không cần đạt BMI lý tưởng' },
      { icon: '🧠', label: 'CBT cho binge/emotional eating', note: '25–30% người béo phì có BED — cần giải quyết song song' },
      { icon: '💊', label: 'GLP-1 agonists: -15–20% cân', note: 'FDA-approved cho BMI ≥30 kèm comorbidities' },
    ],
  },
  {
    range: '≥ 35', label: 'Béo phì độ II–III', color: '#dc2626', rgb: '220,38,38', icon: '🚨',
    action: 'Cần đánh giá y tế toàn diện. Xem xét hỗ trợ từ bác sĩ chuyên khoa.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Béo phì độ II (BMI 35–39.9) và độ III/morbid obesity (BMI ≥40) là tình trạng y tế nghiêm trọng. Life expectancy giảm 5–20 năm tùy mức độ. Lifestyle intervention đơn độc thường không đủ hiệu quả lâu dài ở mức này — cần đội ngũ chuyên khoa (béo phì nội khoa, dinh dưỡng, tâm lý, phẫu thuật) để thiết kế phác đồ cá nhân hóa.',
    detail: 'BMI ≥35 là tình trạng y tế cần được xử lý với sự hỗ trợ chuyên môn, không phải sự xét xử. Nhiều người ở mức này có nhiều năm nỗ lực và thất bại không phải vì "không cố gắng đủ" mà vì cơ chế sinh lý học cực kỳ phức tạp.',
    details: [
      'Tại sao lifestyle đơn thuần thường không đủ: LOOK AHEAD study (>5000 người, 10 năm): intensive lifestyle intervention → giảm 8.6% năm 1, nhưng sau 8 năm chỉ còn 4.7%. Cơ thể "defend set point" bằng cách giảm metabolic rate (adaptive thermogenesis) và tăng hunger hormones khi cân giảm.',
      'Phẫu thuật bariatric — ai phù hợp: BMI ≥40, hoặc BMI ≥35 kèm ít nhất 1 comorbidity nghiêm trọng (đái tháo đường, tăng huyết áp, sleep apnea). Roux-en-Y gastric bypass: giảm 25–30%, đảo ngược đái tháo đường type 2 trong ~60%. Sleeve gastrectomy: giảm 20–25%, ít biến chứng hơn.',
      'Comorbidities khẩn cấp cần đánh giá: sleep apnea (70% người BMI >35 có OSA → nguy cơ đột quỵ đêm). Cardiomegaly và heart failure. Pulmonary hypertension. Non-alcoholic steatohepatitis (NASH → xơ gan). Pseudotumor cerebri. Lymphedema.',
      'GLP-1 agonists — cuộc cách mạng: Tirzepatide (SURMOUNT-1 trial): giảm trung bình 22.5% cân nặng sau 72 tuần — gần bằng phẫu thuật. Semaglutide (Wegovy): giảm 15–17%. Cơ chế: giảm appetite mạnh, chậm emptying dạ dày, cải thiện insulin sensitivity.',
      'Sức khỏe tâm thần và weight stigma: người béo phì độ II–III trải qua discrimination, self-stigma và trầm cảm ở tỷ lệ cao hơn. Weight stigma trong y tế đã được ghi nhận làm trì hoãn chẩn đoán. Tiếp cận cần compassionate — "health at every stage, moving toward improvement."',
      'Vận động an toàn ở BMI ≥35: ưu tiên giảm đau khớp (bơi lội, xe đạp, seated exercises), tăng cardiorespiratory fitness trước khi tăng intensity. Vận động cải thiện sức khỏe tim mạch ngay cả khi cân không giảm nhiều. HIIT không phù hợp ban đầu — bắt đầu với low-impact, steady state.',
    ],
    points: [
      { icon: '🏥', label: 'Cần đội ngũ chuyên khoa', note: 'Nội khoa, dinh dưỡng, tâm lý, phẫu thuật' },
      { icon: '💊', label: 'GLP-1 (Tirzepatide): -22.5% cân', note: 'SURMOUNT-1: gần hiệu quả bằng phẫu thuật' },
      { icon: '🔪', label: 'Phẫu thuật: -25–30%', note: 'BMI ≥40 hoặc ≥35 kèm comorbidity nghiêm trọng' },
      { icon: '😴', label: 'Kiểm tra sleep apnea ngay', note: '70% người BMI >35 có OSA — nguy cơ đột quỵ đêm' },
    ],
  },
];

const WAIST_RISKS = [
  { group: 'Nam', low: '<90 cm', normal: 'Bình thường', high: '≥90 cm', danger: 'Nguy cơ cao' },
  { group: 'Nữ', low: '<80 cm', normal: 'Bình thường', high: '≥80 cm', danger: 'Nguy cơ cao' },
];

function BMIModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl font-black" style={{ color: item.color }}>{item.range}</span>
            <span className="text-xl font-bold" style={{ color: item.color }}>— {item.label}</span>
          </div>
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
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}>
              ← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {BMI_CATS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

function BMICalculator() {
  const e0 = (() => { try { return JSON.parse(localStorage.getItem(E0_KEY)) || {}; } catch { return {}; } })();
  const [weight, setWeight] = useState(e0.weight || '');
  const [height, setHeight] = useState(e0.height || '');
  const [waist, setWaist] = useState(e0.waist || '');
  const [sex, setSex] = useState(e0.sex || 'male');
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;
  const cat = bmi ? BMI_CATS.find((c, i) => {
    if (i === 0) return bmi < 18.5;
    if (i === 1) return bmi >= 18.5 && bmi < 25;
    if (i === 2) return bmi >= 25 && bmi < 30;
    if (i === 3) return bmi >= 30 && bmi < 35;
    return bmi >= 35;
  }) : null;
  const waistRisk = waist && sex ? (sex === 'male' ? waist >= 90 : waist >= 80) : null;
  const whr = waist && height ? (waist / height).toFixed(2) : null;

  return (
    <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: `${COLOR}30`, background: `${COLOR}07` }}>
      <p className="text-base font-bold uppercase tracking-widest" style={{ color: COLOR }}>Tính BMI & Đánh Giá Vòng Eo</p>
      <div className="grid grid-cols-2 gap-3">
        {[{ l: 'Cân nặng (kg)', v: weight, s: setWeight, ph: 'VD: 70' }, { l: 'Chiều cao (cm)', v: height, s: setHeight, ph: 'VD: 170' }, { l: 'Vòng eo (cm)', v: waist, s: setWaist, ph: 'VD: 85' }].map(f => (
          <div key={f.l}>
            <label className="text-base text-muted mb-1 block">{f.l}</label>
            <input type="number" placeholder={f.ph} value={f.v} onChange={e => f.s(+e.target.value)}
              className="w-full rounded-xl border border-border bg-bg text-text text-lg px-3 py-2 focus:outline-none" />
          </div>
        ))}
        <div>
          <label className="text-base text-muted mb-1 block">Giới tính</label>
          <div className="flex gap-2">
            {[{ v: 'male', l: 'Nam' }, { v: 'female', l: 'Nữ' }].map(g => (
              <button key={g.v} onClick={() => setSex(g.v)}
                className="flex-1 py-2 rounded-xl border text-base font-semibold transition-all"
                style={sex === g.v ? { borderColor: COLOR, background: `${COLOR}20`, color: COLOR } : { borderColor: '#333', color: '#888' }}>
                {g.l}
              </button>
            ))}
          </div>
        </div>
      </div>
      {bmi && cat && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex gap-4">
            <div className="rounded-xl border p-3 flex-1 text-center" style={{ borderColor: `${cat.color}30`, background: `${cat.color}08` }}>
              <div className="text-4xl font-black" style={{ color: cat.color }}>{bmi}</div>
              <div className="text-base font-bold" style={{ color: cat.color }}>{cat.label}</div>
              <div className="text-base text-muted">BMI</div>
            </div>
            {waist && (
              <div className="rounded-xl border p-3 flex-1 text-center" style={{ borderColor: `${waistRisk ? '#ef4444' : '#10b981'}30`, background: `${waistRisk ? '#ef4444' : '#10b981'}08` }}>
                <div className="text-4xl font-black" style={{ color: waistRisk ? '#ef4444' : '#10b981' }}>{waist}</div>
                <div className="text-base font-bold" style={{ color: waistRisk ? '#ef4444' : '#10b981' }}>{waistRisk ? 'Nguy cơ cao' : 'Bình thường'}</div>
                <div className="text-base text-muted">Vòng eo (cm)</div>
              </div>
            )}
            {whr && (
              <div className="rounded-xl border border-border p-3 flex-1 text-center">
                <div className="text-4xl font-black text-text">{whr}</div>
                <div className="text-base text-muted">Tỷ lệ eo/chiều cao</div>
                <div className="text-base" style={{ color: +whr > 0.5 ? '#ef4444' : '#10b981' }}>{+whr > 0.5 ? 'Trên ngưỡng' : 'OK'}</div>
              </div>
            )}
          </div>
          <div className="rounded-xl p-3" style={{ background: `${cat.color}10`, borderLeft: `3px solid ${cat.color}` }}>
            <p className="text-base text-muted leading-relaxed"><strong style={{ color: cat.color }}>Gợi ý hành động:</strong> {cat.action}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HealthBMIPage() {
  const [bmiModal, setBmiModal] = useState(null);

  useEffect(() => {
    const id = ORBIT_ID;
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @property ${PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eBmiOrbitSpin { to { ${PROP}: 360deg; } }
      .${ORBIT_CLASS} { background: conic-gradient(from var(${PROP}), transparent 0deg, transparent 55deg, rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg, rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg, rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg); animation: eBmiOrbitSpin 3.5s linear infinite; }
    `;
    document.head.appendChild(s);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">
        <span>←</span><span>Kiến Thức Sức Khỏe</span>
      </Link>
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>⚖️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">BMI & Vòng Eo</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>E1 · Chỉ Số Cơ Thể</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">BMI sàng lọc tình trạng cân nặng, còn vòng eo phản ánh mỡ bụng nội tạng — nguy cơ tim mạch và chuyển hóa quan trọng hơn con số cân nặng đơn thuần.</p>
        </div>
      </div>
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="BMI" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>Đo vòng eo 1 lần/tuần · Cân 1–3 lần/tuần</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Tính BMI & Đánh Giá</h2>
        <p className="text-muted text-lg mb-6">Nhập số liệu để xem phân loại và gợi ý hành động</p>
        <BMICalculator />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Phân Loại BMI & Hành Động</h2>
        <p className="text-muted text-lg mb-6">BMI là chỉ số sàng lọc — cần kết hợp với vòng eo và các chỉ số khác để đánh giá toàn diện</p>
        <div className="space-y-3">
          {BMI_CATS.map((c, i) => (
            <div key={c.label}
              className="group/bmi rounded-2xl border border-border bg-surface p-4 flex gap-4 cursor-pointer hover:shadow-md transition-all duration-200"
              style={{ '--hc': c.color }}
              onClick={() => setBmiModal(i)}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${c.rgb},0.4)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
              <div className="shrink-0 w-24">
                <div className="text-lg font-black" style={{ color: c.color }}>{c.range}</div>
                <div className="text-base font-bold" style={{ color: c.color }}>{c.label}</div>
              </div>
              <p className="text-lg text-muted leading-relaxed flex-1">{c.action}</p>
              <div className="shrink-0 self-center">
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border"
                  style={{ color: c.color, borderColor: `rgba(${c.rgb},0.35)`, background: `rgba(${c.rgb},0.08)` }}>Chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-base text-muted mt-3">* BMI không phân biệt mỡ và cơ — người tập gym nhiều có thể BMI cao nhưng tỷ lệ mỡ thấp. Luôn kết hợp với vòng eo.</p>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>Vòng Eo — Chỉ Số Quan Trọng Hơn Cân Nặng</h2>
        <p className="text-muted text-lg mb-6">Mỡ bụng nội tạng liên quan đến nguy cơ tim mạch, đái tháo đường type 2, gan nhiễm mỡ và hội chứng chuyển hóa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {WAIST_RISKS.map(w => (
            <div key={w.group} className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-bold text-text mb-3">{w.group}</div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#10b98115' }}>
                  <div className="font-black text-xl" style={{ color: '#10b981' }}>{w.low}</div>
                  <div className="text-base text-muted">{w.normal}</div>
                </div>
                <div className="flex-1 rounded-xl p-3 text-center" style={{ background: '#ef444415' }}>
                  <div className="font-black text-xl" style={{ color: '#ef4444' }}>{w.high}</div>
                  <div className="text-base text-muted">{w.danger}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-lg font-bold text-text mb-3">Cách Đo Vòng Eo Đúng</p>
          <ol className="space-y-2">
            {['Đứng thẳng, hai chân rộng bằng vai', 'Thở ra nhẹ — không hóp bụng', 'Đo ngang qua giữa bờ dưới xương sườn và mào chậu (hoặc ngang rốn)', 'Dùng cùng một vị trí đo mỗi tuần', 'Đo buổi sáng trước ăn là tốt nhất'].map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-lg text-muted">
                <span className="font-black shrink-0 w-5" style={{ color: COLOR }}>{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>
      </RevealBlock>

      <RevealBlock className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `${COLOR}25`, background: `${COLOR}07` }}>
          <h3 className="font-bold text-text mb-3">Nhìn Xu Hướng, Không Nhìn Một Con Số</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { t: 'Cân giảm ít nhưng vòng eo giảm 3–5cm', c: '#10b981', n: '✓ Tiến triển tốt — mỡ bụng đang giảm' },
              { t: 'Cân không giảm, vòng eo tăng', c: '#f59e0b', n: '⚠ Xem lại ăn uống, rượu bia, stress, ngủ' },
              { t: 'Vòng eo tăng nhanh kèm mệt, phù, khó thở', c: '#ef4444', n: '→ Nên đi khám bác sĩ' },
            ].map(c => (
              <div key={c.t} className="rounded-xl border p-3" style={{ borderColor: `${c.c}25`, background: `${c.c}08` }}>
                <p className="text-base text-muted mb-1">{c.t}</p>
                <p className="text-base font-bold" style={{ color: c.c }}>{c.n}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>Quay lại Kiến Thức Sức Khỏe</span>
      </Link>

      {bmiModal !== null && (
        <BMIModal
          item={BMI_CATS[bmiModal]}
          idx={bmiModal}
          onClose={() => setBmiModal(null)}
          onPrev={() => setBmiModal(i => Math.max(0, i - 1))}
          onNext={() => setBmiModal(i => Math.min(BMI_CATS.length - 1, i + 1))}
          hasPrev={bmiModal > 0}
          hasNext={bmiModal < BMI_CATS.length - 1}
        />
      )}
    </div>
  );
}
