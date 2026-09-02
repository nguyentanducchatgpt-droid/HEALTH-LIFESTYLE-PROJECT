import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  {
    group: 'Nam', icon: '👨', color: '#3b82f6', rgb: '59,130,246',
    low: '<90 cm', normal: 'Bình thường', high: '≥90 cm', danger: 'Nguy cơ cao',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo ≥90cm ở nam giới (tiêu chuẩn IDF châu Á) là dấu hiệu mỡ nội tạng cao — nguy cơ độc lập của đái tháo đường type 2, bệnh tim mạch và hội chứng chuyển hóa, ngay cả khi BMI bình thường. Nam giới có xu hướng tích mỡ dạng "táo" (bụng) — mẫu phân bố mỡ nguy hiểm hơn cho tim mạch so với dạng "lê" (hông/đùi) thường gặp ở nữ.',
    detail: 'Ở nam giới, mỡ nội tạng (visceral fat) bao quanh các cơ quan như gan, tụy, ruột — khác với mỡ dưới da. Mỡ nội tạng tiết adipokines viêm (TNF-α, IL-6) và free fatty acids → kháng insulin → đái tháo đường; tăng LDL, giảm HDL → bệnh tim mạch.',
    details: [
      'Tại sao nam giới tích mỡ bụng: testosterone hỗ trợ phân bố mỡ dạng "táo" (android fat — trung tâm cơ thể). Khi testosterone giảm (sau 40 tuổi, stress cao, béo phì, ít ngủ), tỷ lệ estrogen/testosterone tăng → mỡ tích thêm ở bụng. Cortisol mãn tính cũng kích hoạt adipogenesis đặc biệt ở mỡ nội tạng.',
      'Nguy cơ tim mạch: Framingham Heart Study: mỗi 1cm tăng vòng eo = tăng 2% nguy cơ cardiovascular event. Nam giới vòng eo ≥90cm: nguy cơ nhồi máu cơ tim tăng 3×, đột quỵ tăng 2×. Mỡ nội tạng tiết adipokines pro-inflammatory gây xơ vữa động mạch nhanh hơn.',
      'Mỡ gan và NAFLD: vòng eo ≥90cm liên quan trực tiếp với NAFLD — nguy cơ tăng 3.5×, độc lập với BMI. Gan nhiễm mỡ → viêm gan → xơ gan trong 10–20 năm nếu không can thiệp. Kiểm tra ALT/AST định kỳ nếu vòng eo cao.',
      'Đo vòng eo đúng cho nam: đứng thẳng, thở ra nhẹ (không hóp bụng), đo ngang qua điểm giữa bờ dưới xương sườn cuối và mào chậu (thường ngang hoặc 1–2cm trên rốn). Buổi sáng trước ăn. Đo 2 lần và lấy trung bình.',
      'Giảm mỡ bụng: không có cách giảm mỡ bụng riêng lẻ (spot reduction không tồn tại). Deficit calo 300–500 kcal + resistance training (tăng testosterone tự nhiên) + ngủ đủ 7–9h (testosterone đỉnh trong deep sleep) + giảm alcohol. HIIT 2–3 lần/tuần hiệu quả cho giảm mỡ bụng.',
      'Testosterone và mỡ bụng — vòng lặp xấu: mỡ bụng nhiều → enzyme aromatase chuyển testosterone thành estrogen → testosterone giảm thêm → tích thêm mỡ bụng. Giảm cân phá vỡ vòng lặp này và tăng testosterone tự nhiên 15–20%.',
    ],
    points: [
      { icon: '🫀', label: 'Vòng eo ≥90cm = nguy cơ cao', note: 'Tiêu chuẩn IDF châu Á — thấp hơn tiêu chuẩn phương Tây (102cm)' },
      { icon: '🔥', label: 'Mỡ nội tạng tiết chất viêm', note: 'TNF-α, IL-6, FFA → kháng insulin → đái tháo đường type 2' },
      { icon: '😴', label: 'Ngủ đủ = testosterone tốt', note: 'Testosterone đỉnh trong deep sleep — ngủ <6h giảm T 15–20%' },
      { icon: '💪', label: 'Resistance training tăng T tự nhiên', note: 'Compound moves (squat, deadlift) hiệu quả nhất cho testosterone' },
    ],
  },
  {
    group: 'Nữ', icon: '👩', color: '#ec4899', rgb: '236,72,153',
    low: '<80 cm', normal: 'Bình thường', high: '≥80 cm', danger: 'Nguy cơ cao',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo ≥80cm ở phụ nữ (tiêu chuẩn IDF châu Á) phản ánh mỡ nội tạng tăng cao. Ngưỡng thấp hơn nam do phụ nữ châu Á tích mỡ nội tạng cao hơn dù cùng BMI. Estrogen tiền mãn kinh "bảo vệ" phân bố mỡ dạng "lê" (hông/đùi), nhưng sau mãn kinh mỡ dịch chuyển về bụng và nguy cơ tim mạch tăng mạnh.',
    detail: 'Phụ nữ có đặc điểm sinh lý khác về mỡ cơ thể: tổng mỡ cao hơn nam (22–25% vs 15–18% healthy range) nhưng mỡ dưới da ở hông/đùi ít nguy hiểm hơn mỡ nội tạng. Sau mãn kinh, estrogen giảm → mỡ tái phân bố từ hông về bụng → nguy cơ tim mạch tăng ngang nam giới.',
    details: [
      'Estrogen và phân bố mỡ: estrogen ức chế enzyme lipoprotein lipase ở mỡ bụng và kích hoạt ở mỡ hông/đùi → phụ nữ tiền mãn kinh tích mỡ dạng "lê". Mỡ hông/đùi tiết adiponectin (hormone chống viêm, tăng nhạy cảm insulin) — thực ra có tác dụng bảo vệ. Mỡ bụng nội tạng tiết adipokines viêm.',
      'PCOS và vòng eo: hội chứng buồng trứng đa nang (PCOS) ảnh hưởng 5–10% phụ nữ tuổi sinh sản và liên quan chặt với mỡ bụng tăng. PCOS → insulin resistance → mỡ tích ở bụng → vòng eo tăng → kháng insulin nặng hơn. Kiểm tra: testosterone, DHEAS, LH/FSH ratio nếu vòng eo tăng kèm chu kỳ không đều.',
      'Mãn kinh và tái phân bố mỡ: trong 5 năm sau mãn kinh, phụ nữ tăng trung bình 3–5kg và vòng eo tăng 4–5cm do giảm estrogen. Nguy cơ tim mạch tăng từ thấp lên ngang bằng nam giới cùng tuổi. HRT (hormone replacement therapy) có thể giảm bớt tái phân bố mỡ — cần thảo luận với bác sĩ.',
      'Ăn uống và vòng eo phụ nữ: PREDIMED study: chế độ Mediterranean giảm waist circumference 0.4–0.7 cm/năm so với low-fat diet. Đường và tinh bột tinh chế là yếu tố chính tăng mỡ bụng ở phụ nữ — không phải chất béo toàn thể. Chất xơ và healthy fats giảm insulin spike.',
      'Vận động cho giảm mỡ bụng ở nữ: resistance training 2–3 lần/tuần + cardio moderate 150 phút/tuần là combination hiệu quả nhất (ACSM). Yoga và Pilates không đủ giảm mỡ nội tạng nhưng giảm cortisol — yếu tố gián tiếp quan trọng. Bơi lội và đạp xe ideal nếu có vấn đề khớp.',
      'Cortisol và mỡ bụng nữ: phụ nữ có phản ứng cortisol cao hơn nam với social stressors. Cortisol mãn tính → tăng appetite (đặc biệt thức ăn giàu đường và mỡ), ức chế fat oxidation, kích hoạt adipogenesis ở mỡ nội tạng. Thiền, breathing practice và ngủ đủ giấc là can thiệp y học thực sự cho mỡ bụng nữ.',
    ],
    points: [
      { icon: '🌸', label: 'Vòng eo ≥80cm = ngưỡng cảnh báo', note: 'IDF châu Á: thấp hơn phương Tây (88cm) vì phụ nữ Á có mỡ nội tạng cao hơn cùng BMI' },
      { icon: '🔄', label: 'Mãn kinh: mỡ dịch từ hông về bụng', note: 'Estrogen giảm → nguy cơ tim mạch tăng ngang nam giới cùng tuổi' },
      { icon: '🧘', label: 'Cortisol giảm = mỡ bụng giảm', note: 'Stress mãn tính → tích mỡ nội tạng — thiền và breathing là can thiệp thực' },
      { icon: '🥗', label: 'Mediterranean diet giảm vòng eo', note: 'PREDIMED: hiệu quả hơn low-fat diet cho mỡ bụng ở phụ nữ' },
    ],
  },
];

function BMIModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
              {p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {BMI_CATS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              {p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>
  );
}

const TREND_ITEMS = [
  {
    num: '01', icon: '✅', color: '#10b981', rgb: '16,185,129',
    t: 'Cân giảm ít nhưng vòng eo giảm 3–5cm',
    n: '✓ Tiến triển tốt — mỡ bụng đang giảm',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo giảm 3–5cm trong khi cân không giảm nhiều là dấu hiệu tốt nhất: bạn đang mất mỡ nội tạng và tăng cơ cùng lúc — đây chính xác là mục tiêu của "body recomposition." Mỡ nội tạng giảm = giảm nguy cơ tim mạch, đái tháo đường, và cải thiện nhạy cảm insulin ngay cả khi cân không thay đổi.',
    detail: 'Đây là kịch bản lý tưởng khi tập resistance training kết hợp ăn đủ protein. Cơ bắp (dày đặc hơn mỡ) thay thế mỡ nội tạng — cân nặng gần như không đổi nhưng tỷ lệ cơ/mỡ cải thiện rõ rệt. Đừng nản vì cân không xuống nhanh: vòng eo mới là thước đo thực sự.',
    details: [
      'Recomposition là gì: mất mỡ và tăng cơ đồng thời. Xảy ra hiệu quả nhất ở người mới tập, người có % mỡ cao, hoặc người ăn đủ protein (1.6–2g/kg). Cân không giảm nhưng quần áo rộng hơn, vòng eo nhỏ hơn — đây là progress thật.',
      'Tại sao vòng eo quan trọng hơn cân: 1kg mỡ chiếm thể tích gấp 3–4 lần 1kg cơ. Người mất 2kg mỡ bụng và tăng 2kg cơ = cân không đổi nhưng trông gọn hơn, khỏe hơn, các marker chuyển hóa cải thiện hoàn toàn.',
      'Mỡ nội tạng giảm trước: cơ thể ưu tiên đốt mỡ nội tạng (quanh cơ quan) trước mỡ dưới da khi caloric deficit kết hợp exercise. Đây là tin tốt — mỡ nội tạng là loại mỡ nguy hiểm nhất và nó đáp ứng nhanh nhất với can thiệp.',
      'Đo đúng để thấy progress: cân 1–2 lần/tuần buổi sáng trước ăn, lấy trung bình. Đo vòng eo mỗi 1–2 tuần cùng vị trí. Chụp ảnh tiến trình 4 tuần/lần. So quần áo cũ. Những thước đo này trung thực hơn con số trên cân nhiều.',
      'Duy trì và tiếp tục: đây là giai đoạn không được thay đổi chiến lược. Tiếp tục resistance training 3–4 buổi/tuần, protein 1.6–2g/kg, ngủ 7–9h, quản lý stress. Đừng tăng deficit vì cân không xuống — bạn đang làm đúng rồi.',
      'Khi nào cân sẽ bắt đầu giảm: sau khi recomp plateau (thường 8–12 tuần), body composition ổn định hơn và cân sẽ bắt đầu giảm dần nếu vẫn duy trì deficit. Hoặc có thể duy trì cân hiện tại với body composition tốt hơn nhiều — cũng là kết quả xuất sắc.',
    ],
    points: [
      { icon: '🔥', label: 'Mỡ nội tạng giảm trước', note: 'Đáp ứng nhanh nhất với deficit + exercise — nguy cơ tim giảm ngay' },
      { icon: '💪', label: 'Cơ tăng = cân không giảm', note: 'Recomposition: 1 kg cơ nhỏ hơn 3–4× so với 1 kg mỡ' },
      { icon: '📏', label: 'Vòng eo thật hơn cân', note: 'Mỡ/cơ không hiển thị trên cân — vòng eo mới phản ánh thực tế' },
      { icon: '✅', label: 'Tiếp tục chiến lược hiện tại', note: 'Đừng thay đổi vì cân chậm — đây là progress tốt nhất có thể' },
    ],
  },
  {
    num: '02', icon: '⚠️', color: '#f59e0b', rgb: '245,158,11',
    t: 'Cân không giảm, vòng eo tăng',
    n: '⚠ Xem lại ăn uống, rượu bia, stress, ngủ',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cân không giảm nhưng vòng eo tăng dần là tín hiệu cảnh báo quan trọng: mỡ nội tạng đang tích tụ trong khi cơ bắp có thể đang giảm (sarcopenia ẩn). Điều này thường xảy ra khi ăn uống không kiểm soát, ngủ kém mãn tính, stress cao hoặc uống rượu bia thường xuyên — ngay cả khi cân số giữ nguyên.',
    detail: 'Đây là kịch bản "skinny fat" hoặc "weight stable but metabolically deteriorating" — nguy hiểm vì người dùng thường nghĩ mình ổn vì cân không tăng. Nhưng sự tích tụ mỡ nội tạng trong khi mất cơ là xu hướng xấu về sức khỏe chuyển hóa, tim mạch và tuổi thọ.',
    details: [
      'Rượu bia — thủ phạm số 1: Alcohol không chứa nhiều calo hơn tưởng (7 kcal/g, hơn protein và carb). Quan trọng hơn: alcohol ức chế fat oxidation trong 24–48 giờ → cơ thể ưu tiên đốt alcohol thay mỡ → toàn bộ calo ăn trong ngày đó được lưu trữ thành mỡ, đặc biệt mỡ bụng. 2–3 ly/ngày đủ để tăng vòng eo đáng kể qua nhiều tháng.',
      'Ngủ kém mãn tính: ngủ <6 giờ làm ghrelin tăng 15% (đói hơn) và leptin giảm 15% (no ít hơn) → ăn thêm 200–400 kcal/ngày không tự giác. Cortisol cao do thiếu ngủ kích hoạt tích trữ mỡ nội tạng đặc biệt. Ngủ đủ 7–9 giờ là can thiệp hiệu quả và miễn phí nhất.',
      'Stress mãn tính: cortisol kéo dài kích hoạt enzyme lipoprotein lipase ở mỡ bụng nội tạng — tức là tín hiệu "tích mỡ ngay tại đây." Stress cũng gây eating khi buồn/lo âu. Một nghiên cứu 2015: phụ nữ stress cao tích 11% mỡ nội tạng nhiều hơn nhóm stress thấp dù ăn cùng lượng calo.',
      'Ăn uống không kiểm soát dần: "cân không tăng" thường đi kèm ăn ít protein hơn, nhiều ultra-processed food hơn — thay cơ bằng mỡ từ từ. Kiểm tra: protein/ngày có đạt 1.2–1.6g/kg không? Fiber có đủ 25–30g/ngày không? Số bữa tự nấu vs bên ngoài?',
      'Kiểm tra markers chuyển hóa: vòng eo tăng dù cân ổn định → nên làm xét nghiệm: glucose đói (bình thường <100 mg/dL), HbA1c (<5.7%), lipid panel (TG <150, HDL >40 nam/>50 nữ), huyết áp (<120/80 mmHg). Một hoặc nhiều chỉ số bất thường = metabolic syndrome đang hình thành.',
      'Kế hoạch điều chỉnh: (1) Cắt hoặc giảm mạnh rượu bia 4 tuần, (2) Ưu tiên ngủ 7–9 giờ như mục tiêu số 1, (3) Thêm resistance training nếu chưa có, (4) Tăng protein về 1.6g/kg, (5) Đo lại vòng eo sau 4 tuần. Không cần làm tất cả cùng lúc — bắt đầu với ngủ và rượu bia.',
    ],
    points: [
      { icon: '🍺', label: 'Rượu bia ức chế fat oxidation', note: '2–3 ly/ngày = toàn bộ calo ngày đó vào mỡ bụng' },
      { icon: '😴', label: 'Ngủ <6h = +400 kcal/ngày vô thức', note: 'Ghrelin tăng, leptin giảm — ngủ đủ là can thiệp miễn phí nhất' },
      { icon: '😤', label: 'Cortisol mãn tính → mỡ nội tạng', note: 'Stress cao = enzyme tích mỡ ở bụng hoạt động liên tục' },
      { icon: '🩺', label: 'Kiểm tra glucose, TG, huyết áp', note: 'Metabolic syndrome có thể đang hình thành dù cân ổn định' },
    ],
  },
  {
    num: '03', icon: '🚨', color: '#ef4444', rgb: '239,68,68',
    t: 'Vòng eo tăng nhanh kèm mệt, phù, khó thở',
    n: '→ Nên đi khám bác sĩ',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo tăng nhanh (>5cm trong vài tuần) kèm theo các triệu chứng như mệt mỏi bất thường, phù chân, khó thở khi nằm, hoặc đau tức ngực là dấu hiệu cần đánh giá y tế ngay. Đây không phải tăng cân bình thường — có thể là biểu hiện của suy tim, bệnh gan, suy thận, hội chứng Cushing hoặc các tình trạng nội tiết nghiêm trọng.',
    detail: 'Không phải mọi tăng vòng eo đều do ăn nhiều. Tích dịch cổ trướng (ascites), phù nề lan tỏa, khối u hoặc tăng cortisol do bệnh lý có thể gây tăng vòng eo nhanh và không liên quan đến chế độ ăn. Phân biệt rõ nguyên nhân trước khi bắt đầu bất kỳ can thiệp nào.',
    details: [
      'Suy tim sung huyết (CHF): tim bơm kém → dịch tích ở phổi (khó thở khi nằm, phải ngồi để thở) và ở bụng, chân (phù). Vòng eo tăng nhanh + phù chân + mệt khi leo cầu thang → ưu tiên hàng đầu cần loại trừ. Chẩn đoán: ECG, siêu âm tim, BNP/NT-proBNP.',
      'Cổ trướng do bệnh gan: xơ gan (do rượu, viêm gan B/C, NASH) → albumin giảm → dịch thoát vào ổ bụng. Bụng to nhanh, căng, gõ vang, tĩnh mạch bụng nổi, vàng da nhẹ, mệt mỏi. Kiểm tra: ALT/AST, bilirubin, albumin, siêu âm ổ bụng.',
      'Suy thận và hội chứng thận hư: thận không đào thải dịch → phù toàn thân, bụng to. Hội chứng thận hư: mất protein qua nước tiểu → phù nhiều. Dấu hiệu: nước tiểu có bọt (protein niệu), phù mặt buổi sáng, phù chân chiều tối. Kiểm tra: creatinine, BUN, tổng phân tích nước tiểu.',
      'Hội chứng Cushing: cortisol cao bất thường (do khối u tuyến thượng thận hoặc thuốc corticosteroid) gây tích mỡ đặc trưng: bụng to, mặt tròn (moon face), gù lưng (buffalo hump), da mỏng dễ bầm, vết rạn tím. Kiểm tra: cortisol 24h niệu, cortisol buổi sáng, dexamethasone suppression test.',
      'Khối u ổ bụng: u nang buồng trứng lớn, u xơ tử cung, ung thư buồng trứng, u lymphoma ổ bụng có thể gây bụng to nhanh không liên quan cân nặng. Dấu hiệu: vòng eo tăng không đối xứng, cảm giác nặng hoặc đau tức, rối loạn tiêu hóa/tiểu tiện. Siêu âm ổ bụng là bước đầu tiên.',
      'Khi nào cần đi cấp cứu ngay: khó thở đột ngột tăng nặng khi nằm, phù chân nhanh trong 24–48 giờ, đau ngực hoặc đau bụng dữ dội kèm bụng cứng, vàng da và vàng mắt xuất hiện nhanh, hoặc lú lẫn/rối loạn ý thức. Những triệu chứng này cần đánh giá cấp cứu, không chờ hẹn bác sĩ thường.',
    ],
    points: [
      { icon: '🫀', label: 'Suy tim: khó thở khi nằm + phù chân', note: 'ECG + siêu âm tim + BNP → phân loại ngay' },
      { icon: '🫁', label: 'Gan: bụng căng + vàng da + mệt', note: 'ALT/AST + siêu âm ổ bụng → loại trừ xơ gan' },
      { icon: '💊', label: 'Cushing: mỡ bụng + mặt tròn + da mỏng', note: 'Cortisol cao bất thường → cần nội tiết học' },
      { icon: '🚑', label: 'Khó thở nặng/đau ngực → cấp cứu ngay', note: 'Không chờ hẹn — một số nguyên nhân đe dọa tính mạng' },
    ],
  },
];

function WaistModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.group} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
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
            <span className="text-2xl font-black" style={{ color: item.color }}>{item.group}</span>
            <span className="text-base font-semibold text-muted">· Vòng eo & nguy cơ sức khỏe</span>
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
              {p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {WAIST_RISKS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              {p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>
  );
}

function TrendModal({ item, idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.t} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-2 leading-snug" style={{ color: item.color }}>{item.t}</h2>
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
              {p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {TREND_ITEMS.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}>
              {p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>
  );
}

function BMICalculator() {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const cats = BMI_CATS.map((c, i) => ({...c, ...(p.bmi_cats_tr?.[i] || {})}));
  const e0 = (() => { try { return JSON.parse(localStorage.getItem(E0_KEY)) || {}; } catch { return {}; } })();
  const [weight, setWeight] = useState(e0.weight || '');
  const [height, setHeight] = useState(e0.height || '');
  const [waist, setWaist] = useState(e0.waist || '');
  const [sex, setSex] = useState(e0.sex || 'male');
  const bmi = weight && height ? (weight / Math.pow(height / 100, 2)).toFixed(1) : null;
  const cat = bmi ? cats.find((c, i) => {
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
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const cats = BMI_CATS.map((c, i) => ({...c, ...(p.bmi_cats_tr?.[i] || {})}));
  const waistRisks = WAIST_RISKS.map((w, i) => ({...w, ...(p.waist_risks_tr?.[i] || {})}));
  const trendItems = TREND_ITEMS.map((tr, i) => ({...tr, ...(p.trend_items_tr?.[i] || {})}));
  const [bmiModal, setBmiModal] = useState(null);
  const [waistModal, setWaistModal] = useState(null);
  const [trendModal, setTrendModal] = useState(null);

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
        <span>←</span><span>{p.sub_breadcrumb || 'Kiến Thức Sức Khỏe'}</span>
      </Link>
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `${COLOR}08` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `${COLOR}30` }}>⚖️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{p.bmi_h1 || 'BMI & Vòng Eo'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `${COLOR}15`, borderColor: `${COLOR}30` }}>{p.bmi_badge || 'E1 · Chỉ Số Cơ Thể'}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{p.bmi_desc || 'BMI sàng lọc tình trạng cân nặng, còn vòng eo phản ánh mỡ bụng nội tạng — nguy cơ tim mạch và chuyển hóa quan trọng hơn con số cân nặng đơn thuần.'}</p>
        </div>
      </div>
      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="BMI" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `${COLOR}30` }}>{p.bmi_caption || 'Đo vòng eo 1 lần/tuần · Cân 1–3 lần/tuần'}</span>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{p.bmi_s1_h2 || 'Tính BMI & Đánh Giá'}</h2>
        <p className="text-muted text-lg mb-6">{p.bmi_s1_sub || 'Nhập số liệu để xem phân loại và gợi ý hành động'}</p>
        <BMICalculator />
      </RevealBlock>

      <RevealBlock className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{p.bmi_s2_h2 || 'Phân Loại BMI & Hành Động'}</h2>
        <p className="text-muted text-lg mb-6">{p.bmi_s2_sub || 'BMI là chỉ số sàng lọc — cần kết hợp với vòng eo và các chỉ số khác để đánh giá toàn diện'}</p>
        <div className="space-y-3">
          {cats.map((c, i) => (
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
        <h2 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: COLOR }}>{p.bmi_s3_h2 || 'Vòng Eo — Chỉ Số Quan Trọng Hơn Cân Nặng'}</h2>
        <p className="text-muted text-lg mb-6">Mỡ bụng nội tạng liên quan đến nguy cơ tim mạch, đái tháo đường type 2, gan nhiễm mỡ và hội chứng chuyển hóa</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {waistRisks.map((w, i) => (
            <div key={w.group}
              className="rounded-2xl border border-border bg-surface p-5 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setWaistModal(i)}
              onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${w.rgb},0.4)`}
              onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
              <div className="flex justify-between items-center mb-3">
                <div className="font-bold text-text">{w.icon} {w.group}</div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border"
                  style={{ color: w.color, borderColor: `rgba(${w.rgb},0.35)`, background: `rgba(${w.rgb},0.08)` }}>Chi tiết →</span>
              </div>
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
              <p className="text-center text-xs text-muted mt-3 opacity-50">Nhấp để xem phân tích chi tiết</p>
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
          <h3 className="font-bold text-text mb-1">Nhìn Xu Hướng, Không Nhìn Một Con Số</h3>
          <p className="text-xs text-muted mb-4 opacity-60">Nhấp vào mỗi kịch bản để xem phân tích chi tiết</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trendItems.map((item, i) => (
              <div key={item.t}
                className="rounded-xl border p-3 cursor-pointer hover:shadow-md transition-all duration-200"
                style={{ borderColor: `${item.color}25`, background: `${item.color}08` }}
                onClick={() => setTrendModal(i)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${item.rgb},0.45)`; e.currentTarget.style.background = `rgba(${item.rgb},0.12)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${item.color}25`; e.currentTarget.style.background = `${item.color}08`; }}>
                <p className="text-base text-muted mb-1">{item.t}</p>
                <p className="text-base font-bold" style={{ color: item.color }}>{item.n}</p>
                <p className="text-[10px] text-muted mt-2 opacity-50">Nhấp để xem phân tích →</p>
              </div>
            ))}
          </div>
        </div>
      </RevealBlock>

      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">
        <span>←</span><span>{p.sub_back_footer || 'Quay lại Kiến Thức Sức Khỏe'}</span>
      </Link>

      {bmiModal !== null && (
        <BMIModal
          item={cats[bmiModal]}
          idx={bmiModal}
          onClose={() => setBmiModal(null)}
          onPrev={() => setBmiModal(i => Math.max(0, i - 1))}
          onNext={() => setBmiModal(i => Math.min(cats.length - 1, i + 1))}
          hasPrev={bmiModal > 0}
          hasNext={bmiModal < cats.length - 1}
        />
      )}
      {waistModal !== null && (
        <WaistModal
          item={waistRisks[waistModal]}
          idx={waistModal}
          onClose={() => setWaistModal(null)}
          onPrev={() => setWaistModal(i => Math.max(0, i - 1))}
          onNext={() => setWaistModal(i => Math.min(waistRisks.length - 1, i + 1))}
          hasPrev={waistModal > 0}
          hasNext={waistModal < waistRisks.length - 1}
        />
      )}
      {trendModal !== null && (
        <TrendModal
          item={trendItems[trendModal]}
          idx={trendModal}
          onClose={() => setTrendModal(null)}
          onPrev={() => setTrendModal(i => Math.max(0, i - 1))}
          onNext={() => setTrendModal(i => Math.min(trendItems.length - 1, i + 1))}
          hasPrev={trendModal > 0}
          hasNext={trendModal < trendItems.length - 1}
        />
      )}
    </div>
  );
}
