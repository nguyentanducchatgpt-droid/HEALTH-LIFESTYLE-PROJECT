import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#84cc16';
const RGB = '132,204,22';
const ORBIT_ID = 'f-mprep-orbit-kf';
const ORBIT_CLASS = 'f-mprep-orbit-ring';

const PREP_TEMPLATE = [
  {
    component: 'Tinh bột', icon: '🍚', color: '#f59e0b', rgb: '245,158,11',
    options: ['Cơm gạo lứt 4–5 phần', 'Khoai lang luộc 4–5 củ nhỏ', 'Bánh mì nguyên cám (để sẵn)', 'Yến mạch (chuẩn bị trước)'],
    tip: 'Nấu 1 nồi cơm, phân chia ngay vào hộp.',
    img: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef3e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tinh bột phức (complex carbs) là nguồn năng lượng bền vững nhất cho não và cơ bắp. Gạo lứt, khoai lang, yến mạch cung cấp glucose ổn định hơn tinh bột tinh (white rice, bánh mì trắng) nhờ chỉ số đường huyết (GI) thấp hơn 30–40%, kéo dài cảm giác no và năng lượng 2–3 giờ.',
    details: [
      'Gạo lứt vs. gạo trắng: gạo lứt giữ nguyên cám (bran) và mầm (germ) — chứa fiber, B vitamins, magnesium, và antioxidants. GI gạo lứt ~50–55 vs. gạo trắng ~70–75. Ăn gạo lứt thay gạo trắng giảm nguy cơ tiểu đường type 2 33% (Harvard School of Public Health, 2010).',
      'Resistant starch (tinh bột kháng): cơm gạo lứt để tủ lạnh qua đêm rồi hâm nóng lại tăng resistant starch gấp 3–4 lần. Resistant starch không tiêu hóa được — đi thẳng xuống ruột già, nuôi gut bacteria có lợi và sản xuất butyrate (giảm viêm, bảo vệ đại tràng).',
      'Khoai lang: GI ~44–61 (thấp hơn khoai tây thường). Ngoài carbs, khoai lang giàu beta-carotene (tiền vitamin A), vitamin C, và potassium. Luộc thay nướng giữ GI thấp hơn (nướng làm vỡ cấu trúc tinh bột, tăng GI lên ~94).',
      'Yến mạch: beta-glucan trong yến mạch là fiber hòa tan có nhiều bằng chứng khoa học nhất — giảm LDL cholesterol, ổn định blood sugar, và tăng cảm giác no nhờ tạo gel trong dạ dày. FDA (Mỹ) chính thức công nhận yến mạch có thể giảm nguy cơ tim mạch.',
      'Meal prep với tinh bột: nấu tinh bột trước khi cần là chiến lược tốt nhất. Cơm/khoai bảo quản tủ lạnh 3–4 ngày, tủ đông 1–2 tuần. Phân chia thành phần 150–200g/phần (cooked) trực tiếp sau nấu — dễ lấy, không phải đong đo sau.',
      'Không nên sợ tinh bột: low-carb diet không cần thiết cho đa số người. Tinh bột phức + protein + rau là cấu trúc bữa ăn bền vững nhất để duy trì năng lượng, mood ổn định, và ăn uống không thiếu hụt dài hạn. Carbs là "mood macronutrient" — thiếu carbs gây irritability và cognitive fog.',
    ],
    points: [
      { icon: '🌾', label: 'Gạo Lứt GI 50 vs. 75', note: 'Năng lượng bền hơn — giảm spike đường huyết sau ăn' },
      { icon: '🔬', label: 'Resistant Starch', note: 'Cơm lứt để lạnh → resistant starch tăng 3–4x — tốt cho gut' },
      { icon: '🫙', label: 'Phân Chia 150–200g/Phần', note: 'Làm ngay sau nấu — không cần đong đo lại khi ăn' },
      { icon: '🧠', label: 'Carbs = Mood Macronutrient', note: 'Thiếu carbs → irritability + cognitive fog — không cần low-carb' },
    ],
  },
  {
    component: 'Đạm', icon: '🥩', color: '#ef4444', rgb: '239,68,68',
    options: ['Thịt gà ức luộc/áp chảo 400–500g', 'Cá hồi/cá basa áp chảo', 'Trứng luộc 8–10 quả', 'Đậu phụ chiên hoặc nướng'],
    tip: 'Làm 2–3 nguồn đạm khác nhau để không ngán.',
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Protein là macronutrient quan trọng nhất để build và maintain cơ bắp, hỗ trợ hệ miễn dịch, sản xuất enzymes và hormones. Người tập luyện cần 1.6–2.0g/kg thể trọng/ngày. Protein cũng có thermogenic effect cao nhất (20–30% calo đốt trong quá trình tiêu hóa) — giúp no lâu và hỗ trợ weight management.',
    details: [
      'Muscle protein synthesis (MPS): ăn ≥20–30g protein/bữa kích hoạt MPS đủ để build cơ. Ít hơn → cơ thể dùng protein cho energy và repair, không đủ để grow. Phân bổ đều 3–4 bữa (20–40g mỗi bữa) hiệu quả hơn ăn 1 lần nhiều/ngày.',
      'Gà ức là protein king của meal prep: 100g gà ức = 31g protein, 3.6g fat, 165 kcal. Tỉ lệ protein/calo cao nhất trong thực phẩm phổ biến. Luộc/áp chảo giữ chất dinh dưỡng tốt hơn chiên. Bảo quản tủ lạnh 3–4 ngày mà không mất chất lượng đáng kể.',
      'Cá hồi — protein + omega-3 kép: 100g cá hồi = 20g protein + 2.2g EPA/DHA omega-3. Omega-3 giảm viêm, cải thiện brain function, và tăng muscle protein synthesis thêm 10–20%. Nếu ngân sách hạn chế, cá basa thay thế được về protein nhưng không có omega-3.',
      'Trứng — complete protein benchmark: trứng có PDCAAS (Protein Digestibility Corrected Amino Acid Score) = 1.0 — thang điểm hoàn hảo. Leucine trong trứng là amino acid quan trọng nhất kích hoạt MPS. 1 quả trứng = 6–7g protein, 5g fat, 77 kcal. 2–3 trứng/ngày an toàn cho đa số người.',
      'Đậu phụ — protein thực vật: 100g đậu phụ cứng = 8–12g protein, isoflavones (giảm LDL, hỗ trợ bone density), và calcium. PDCAAS = 0.91 — gần bằng protein động vật. Người ăn chay hoặc muốn giảm thịt: kết hợp đậu phụ + legumes + grains đủ amino acid đầy đủ.',
      '2–3 nguồn đạm khác nhau: đa dạng nguồn protein cung cấp amino acid profile phong phú hơn và giảm ngán. Gợi ý combo: gà ức (cơ bản) + trứng luộc (tiện lợi) + cá béo 1–2 lần/tuần. Prep cùng lúc, bảo quản riêng để linh hoạt phối hợp bữa ăn.',
    ],
    points: [
      { icon: '💪', label: '20–30g Protein/Bữa', note: 'Ngưỡng tối thiểu kích hoạt muscle protein synthesis' },
      { icon: '🐔', label: 'Gà Ức 31g/100g', note: 'Tỉ lệ protein/calo cao nhất — king của meal prep' },
      { icon: '🥚', label: 'Trứng PDCAAS = 1.0', note: 'Complete protein benchmark — leucine kích hoạt MPS tốt nhất' },
      { icon: '🎨', label: '2–3 Nguồn Để Không Ngán', note: 'Đa dạng amino acid + giảm cảm giác lặp lại bữa ăn' },
    ],
  },
  {
    component: 'Rau', icon: '🥦', color: '#22c55e', rgb: '34,197,94',
    options: ['Súp lơ/bông cải xanh 1 bó', 'Cà rốt thái miếng 3–4 củ', 'Đậu que xào tỏi', 'Rau muống/cải xào'],
    tip: 'Luộc rau để ráo nước trước khi cho vào hộp.',
    img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Rau xanh và rau nhiều màu là nguồn fiber, vitamins, minerals, và phytonutrients không thể thay thế bằng supplement. 30g fiber/ngày từ rau nguyên thể (không phải bột fiber supplement) là foundation của gut microbiome khỏe mạnh — ảnh hưởng đến immunity, mood, và inflammation.',
    details: [
      'Súp lơ xanh (broccoli) — superfood thực sự: chứa sulforaphane — phytonutrient kích hoạt Nrf2 pathway, tăng cường detox enzymes và chống oxy hóa. Nghiên cứu cho thấy sulforaphane giảm nguy cơ một số ung thư và cải thiện gut barrier. Luộc nhẹ (3–4 phút) hoặc hấp giữ sulforaphane tốt hơn xào nhiều dầu.',
      'Màu sắc = dinh dưỡng khác nhau: đỏ/cam (cà rốt, ớt chuông) = beta-carotene, vitamin C; xanh đậm (rau muống, cải bó xôi) = folate, iron, vitamin K; tím (cà tím, bắp cải tím) = anthocyanins (antioxidant mạnh). Ăn ít nhất 3 màu khác nhau mỗi ngày.',
      'Fiber và gut microbiome: mỗi loại rau cung cấp prebiotic fiber khác nhau, nuôi các chủng vi khuẩn đường ruột khác nhau. Đa dạng rau → đa dạng microbiome → resilience cao hơn và production butyrate (acid béo chuỗi ngắn) nhiều hơn. Trồng 1 loại rau cả tuần làm nghèo microbiome.',
      'Rau và no: fiber trong rau hấp thụ nước và tăng thể tích trong dạ dày → kéo dài cảm giác no mà ít calo. Rau chiếm 40–50% đĩa ăn theo volume nhưng chỉ 10–15% calo bữa ăn — chiến lược fill-up mà không fill-out hiệu quả nhất.',
      'Bảo quản rau trong meal prep: rau luộc/hấp để ráo hoàn toàn trước khi cho vào hộp — đây là bước quan trọng nhất để không bị nát/nhớt sau 2–3 ngày. Bảo quản riêng với tinh bột và đạm. Rau lá sống (rau xà lách, bắp cải) để riêng, không prep sẵn — héo nhanh và mất chất dinh dưỡng.',
      'Kỹ thuật nấu giữ dinh dưỡng: hấp > luộc > xào > chiên. Luộc mất 20–30% vitamin C và B vào nước. Hấp mất <10%. Xào nhanh với ít dầu ở nhiệt độ cao giữ phần lớn dinh dưỡng. Không nấu quá chín — rau còn hơi cứng giữ nhiều enzyme và phytonutrients hơn.',
    ],
    points: [
      { icon: '🌈', label: '3 Màu Tối Thiểu/Ngày', note: 'Mỗi màu = phytonutrient khác nhau nuôi gut bacteria khác' },
      { icon: '🦠', label: 'Fiber Đa Dạng = Microbiome', note: 'Cùng 1 loại rau → nghèo gut diversity → immunity yếu hơn' },
      { icon: '⚗️', label: 'Súp Lơ → Sulforaphane', note: 'Hấp/luộc nhẹ 3–4 phút — kích hoạt Nrf2 detox pathway' },
      { icon: '💧', label: 'Ráo Nước Trước Khi Hộp', note: 'Bước quan trọng nhất để rau không nát/nhớt sau 2–3 ngày' },
    ],
  },
  {
    component: 'Chất béo lành mạnh', icon: '🥑', color: '#14b8a6', rgb: '20,184,166',
    options: ['Bơ tươi ½–1 quả/ngày', 'Hạt điều/óc chó 30g/ngày', 'Dầu ô liu dùng khi ăn', 'Cá béo (omega-3)'],
    tip: 'Không cần chuẩn bị trước — lấy trực tiếp khi ăn.',
    img: 'https://images.unsplash.com/photo-1519624014191-508652cbd7b5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chất béo không phải kẻ thù — mà là macronutrient thiết yếu cho hấp thụ vitamin tan trong dầu (A, D, E, K), sản xuất hormones, bảo vệ tế bào não (60% não là fat), và kiểm soát viêm. Phân biệt chất béo lành mạnh (unsaturated, omega-3) và có hại (trans fat, quá nhiều saturated) quan trọng hơn "sợ fat".',
    details: [
      'Bơ (avocado) — monounsaturated fat tốt nhất: oleic acid trong bơ giống dầu ô liu — tăng HDL (cholesterol tốt), giảm LDL oxidized (dạng nguy hiểm), và giảm viêm. Bơ cũng giàu potassium (hơn chuối), fiber 7g/quả, và lutein (tốt cho mắt). Ăn ½–1 quả/ngày là an toàn và có lợi.',
      'Omega-3 (EPA/DHA) từ cá béo: quan trọng nhất trong fat group. EPA giảm viêm mạch máu; DHA là cấu trúc chính của não và võng mạc. Thiếu omega-3 → depression, cognitive decline, và dry eye phổ biến hơn. Cá hồi, cá ngừ, cá thu 2–3 lần/tuần đủ nhu cầu EPA/DHA.',
      'Hạt óc chó — plant-based omega-3: giàu ALA (alpha-linolenic acid) — tiền chất omega-3 từ thực vật. Conversion ALA→EPA/DHA chỉ ~5–10% — cần ăn lượng lớn hơn để đạt cùng hiệu quả. Tuy nhiên, óc chó còn chứa polyphenols và melatonin — tốt nhất cho brain health trong nhóm hạt.',
      'Dầu ô liu extra virgin: chứa polyphenols (oleocanthal, oleuropein) có tác dụng anti-inflammatory tương tự ibuprofen ở liều cao hơn. Điều mà khiến Mediterranean diet hiệu quả không chỉ là monounsaturated fat mà là polyphenols này. Dùng sống (drizzle khi ăn) giữ polyphenols tốt hơn nấu ở nhiệt độ cao.',
      'Trans fat cần tránh hoàn toàn: dầu thực vật hydrogen hóa (shortening, margarine), đồ chiên công nghiệp. Trans fat tăng LDL, giảm HDL, và gây viêm — không có "safe level". FDA Mỹ cấm hoàn toàn từ 2018. Đọc nhãn: "partially hydrogenated oil" = có trans fat.',
      'Không cần prep chất béo lành mạnh: bơ cắt ngay khi ăn (tránh oxy hóa), hạt để trong hũ kín dùng dần, dầu ô liu rưới lên khi ăn. Đây là lợi thế của nhóm này trong meal prep — không mất công chuẩn bị mà vẫn đủ dinh dưỡng. Chỉ cần có sẵn trong bếp.',
    ],
    points: [
      { icon: '🧠', label: '60% Não Là Fat', note: 'Omega-3 DHA là cấu trúc thiết yếu của não — không thể thiếu' },
      { icon: '🫒', label: 'Dầu Ô Liu Sống > Nấu', note: 'Drizzle khi ăn giữ polyphenols anti-inflammatory tốt nhất' },
      { icon: '🐟', label: 'Cá Béo 2–3 Lần/Tuần', note: 'EPA/DHA từ cá — nguồn omega-3 hiệu quả nhất, không cần convert' },
      { icon: '🚫', label: 'Tránh Trans Fat Hoàn Toàn', note: 'Dầu hydrogen hóa — không có safe level, FDA cấm từ 2018' },
    ],
  },
  {
    component: 'Gia vị & Nước chấm', icon: '🧂', color: '#6366f1', rgb: '99,102,241',
    options: ['Nước mắm pha sẵn nhạt', 'Muối tiêu chanh', 'Sốt cà chua nấu sẵn', 'Tương ớt/mù tạt nhỏ'],
    tip: 'Chuẩn bị gia vị đa dạng giúp đổi vị mà không ngán.',
    img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gia vị và nước chấm là "multiplier" của meal prep — cùng 5 thành phần cơ bản nhưng đổi gia vị tạo ra trải nghiệm khác nhau hoàn toàn. Nhiều loại gia vị (nghệ, gừng, tỏi, ớt) còn có tác dụng chống viêm và tăng cường hấp thụ dinh dưỡng được nghiên cứu kỹ lưỡng.',
    details: [
      'Nước mắm Việt Nam — fermented protein: nước mắm là nguồn umami (glutamate) tự nhiên và amino acids từ cá lên men. Có probiotics nhỏ và cải thiện vị giác. Pha loãng giảm sodium đáng kể mà không mất vị. Nước mắm pha sẵn (nước + chanh + đường + tỏi + ớt) bảo quản tủ lạnh 1 tuần — đổ lên gì cũng ngon.',
      'Tỏi — antibiotic tự nhiên: allicin trong tỏi (tạo ra khi tỏi được cắt/giã) là kháng sinh tự nhiên mạnh, ức chế nhiều loại vi khuẩn và nấm. Giảm huyết áp tâm thu ~5–8 mmHg theo meta-analysis. Nấu ở nhiệt độ cao phá vỡ allicin — tỏi sống/tỏi phi nhẹ > tỏi nấu chín kỹ.',
      'Nghệ + tiêu đen — anti-inflammatory kép: curcumin trong nghệ là chất chống viêm mạnh nhưng bioavailability thấp (chỉ 3%). Piperine trong tiêu đen tăng hấp thụ curcumin lên 2,000%. Kết hợp nghệ + tiêu đen + dầu béo = bộ ba tối ưu. Thêm vào nước chấm hoặc sốt.',
      'Gừng — nausea và inflammation: gingerol trong gừng giảm nausea (hiệu quả như metoclopramide trong nghiên cứu), giảm đau cơ sau tập (giảm CK enzyme 23%), và có tác dụng anti-inflammatory. Gừng tươi > gừng khô về gingerol. Dùng trong nước chấm, món kho, hoặc pha trà.',
      'Sodium và sức khỏe: nước mắm, xì dầu, nước tương cao sodium. WHO khuyến nghị <2,000mg sodium/ngày. Người Việt trung bình tiêu thụ 3,500–4,500mg/ngày — gần gấp đôi. Pha loãng nước chấm, hạn chế chấm nhiều, và dùng chanh/giấm thay muối giúp giảm sodium mà không nhạt vị.',
      'Đổi vị = không ngán: cùng gà ức + cơm lứt + súp lơ, nhưng hôm nay nước mắm chanh, ngày mai sốt cà chua, ngày kia muối tiêu chanh — trải nghiệm ăn hoàn toàn khác. Đây là bí quyết meal prep 3 ngày không chán: kiểm soát macro consistency + đổi flavor profile linh hoạt.',
    ],
    points: [
      { icon: '🧄', label: 'Tỏi → Allicin Antibiotic', note: 'Tỏi cắt/giã (không nấu kỹ) — kháng khuẩn + giảm huyết áp' },
      { icon: '🌿', label: 'Nghệ + Tiêu Đen Kép', note: 'Piperine tăng hấp thụ curcumin 2,000% — bộ đôi anti-inflammatory' },
      { icon: '🎭', label: 'Đổi Vị = Không Ngán', note: 'Cùng 5 thành phần, khác gia vị — 3 ngày thành 3 bữa khác nhau' },
      { icon: '⚖️', label: 'Pha Loãng Giảm Sodium', note: 'WHO <2,000mg/ngày — người Việt TB gấp đôi, cần pha loãng' },
    ],
  },
];

const SCHEDULE = [
  { step: 1, time: '0–5 phút', action: 'Chuẩn bị', desc: 'Rã đông thịt (nếu cần), vo gạo/nấu cơm, bật bếp, lấy rau ra.' },
  { step: 2, time: '5–15 phút', action: 'Nấu đạm', desc: 'Luộc gà hoặc áp chảo cá. Song song luộc trứng 8–10 phút.' },
  { step: 3, time: '15–25 phút', action: 'Xào rau', desc: 'Xào 2 loại rau khác nhau. Luộc thêm 1 loại nếu muốn.' },
  { step: 4, time: '25–35 phút', action: 'Phân chia', desc: 'Chia tinh bột, đạm, rau vào hộp. Cân bằng theo đĩa ăn chuẩn.' },
  { step: 5, time: '35–45 phút', action: 'Bảo quản', desc: 'Để nguội trước khi đậy nắp. Tủ lạnh 3 ngày, tủ đông 1 tuần.' },
];

const TIPS = [
  { icon: '🌈', tip: 'Đa dạng màu sắc = đa dạng dinh dưỡng. Mỗi tuần thay 1 loại rau.' },
  { icon: '🧊', tip: 'Cơm gạo lứt để tủ lạnh qua đêm = tăng tinh bột kháng (tốt hơn cho đường huyết).' },
  { icon: '🔄', tip: 'Làm 2 loại đạm khác nhau: 1 kiểu đậm đà + 1 kiểu nhẹ nhàng hơn.' },
  { icon: '📦', tip: 'Hộp thủy tinh tốt hơn hộp nhựa — không mùi, gia nhiệt được trực tiếp.' },
  { icon: '🧂', tip: 'Nêm gia vị sau khi hâm nóng, không cần cho vào hộp — giữ tươi hơn.' },
  { icon: '⏰', tip: 'Meal prep tốt nhất vào tối Chủ nhật — fresh cho thứ 2–4.' },
];

function PrepModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = PREP_TEMPLATE[idx];
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

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.component} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
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
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.component}</h2>
          <div className="rounded-xl p-3 mb-5 text-sm text-muted leading-relaxed"
            style={{ borderLeft: `3px solid ${item.color}`, background: `rgba(${item.rgb},0.07)` }}>
            <strong style={{ color: item.color }}>Key fact:</strong> {item.keyFact}
          </div>
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
                  <p className="font-bold text-xs text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {PREP_TEMPLATE.length}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); io.disconnect(); } }, { threshold: 0.07 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function ToolsMealPrepPage() {
  const [openComp, setOpenComp] = useState(null);
  const [prepModal, setPrepModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-mprep-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fMprepOrbitSpin { to { --f-mprep-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-mprep-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fMprepOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🥡</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Meal Prep 3 Ngày</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            30–45 phút · 5 thành phần · Không ngán
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Một lần nấu cho 2–3 ngày. Cấu trúc đĩa ăn nhất quán nhưng đổi vị linh hoạt. Giải pháp thực tế cho người bận mà vẫn muốn ăn lành mạnh.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop" alt="Meal prep" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            1 lần nấu · 3 ngày không lo ăn gì
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* 5 components */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Thành Phần Cơ Bản</h2>
        <p className="text-muted text-lg mb-6">Chuẩn bị đủ 5 thành phần này — bạn có thể lắp ráp thành bất kỳ bữa ăn nào mà không ngán.</p>
        <div className="space-y-3">
          {PREP_TEMPLATE.map((comp, i) => (
            <div key={i} className="rounded-2xl border bg-surface overflow-hidden transition-colors"
              style={{ borderColor: prepModal === i ? `rgba(${comp.rgb},0.45)` : 'var(--border)' }}>
              <div className="group flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                <button onClick={() => setOpenComp(openComp === i ? null : i)} className="flex items-center gap-4 flex-1 text-left">
                  <span className="text-3xl">{comp.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-text">{comp.component}</div>
                    <div className="text-base text-muted">{comp.options[0]} và thêm...</div>
                  </div>
                </button>
                <button
                  onClick={() => setPrepModal(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-3 py-1 rounded-full shrink-0"
                  style={{ color: comp.color, background: `rgba(${comp.rgb},0.12)`, border: `1px solid rgba(${comp.rgb},0.3)` }}
                >Chi tiết →</button>
                <button onClick={() => setOpenComp(openComp === i ? null : i)} className="text-muted shrink-0 ml-1">{openComp === i ? '▲' : '▼'}</button>
              </div>
              {openComp === i && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <ul className="space-y-1 mb-3">
                    {comp.options.map((opt, j) => (
                      <li key={j} className="flex gap-2 text-lg text-muted"><span style={{ color: comp.color }}>→</span>{opt}</li>
                    ))}
                  </ul>
                  <div className="p-3 rounded-xl text-base" style={{ background: `${comp.color}10`, borderLeft: `2px solid ${comp.color}` }}>
                    <strong style={{ color: comp.color }}>Tip:</strong> {comp.tip}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Schedule */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lịch Nấu 45 Phút</h2>
        <p className="text-muted text-lg mb-6">Làm song song đúng thứ tự để tiết kiệm thời gian tối đa.</p>
        <div className="space-y-3">
          {SCHEDULE.map(s => (
            <div key={s.step} className="flex gap-4 items-start p-4 rounded-2xl border border-border bg-surface">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-lg" style={{ background: `rgba(${RGB},0.15)`, color: COLOR }}>{s.step}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text text-lg">{s.action}</span>
                  <span className="text-base px-2 py-0.5 rounded-full" style={{ color: COLOR, background: `rgba(${RGB},0.1)` }}>{s.time}</span>
                </div>
                <p className="text-lg text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Tips */}
      <RevealBlock delay={2} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Tips Không Ngán</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <span className="text-2xl block mb-2">{t.icon}</span>
              <p className="text-lg text-muted">{t.tip}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {prepModal !== null && (
        <PrepModal
          idx={prepModal}
          onClose={() => setPrepModal(null)}
          onPrev={() => setPrepModal(i => Math.max(0, i - 1))}
          onNext={() => setPrepModal(i => Math.min(PREP_TEMPLATE.length - 1, i + 1))}
          hasPrev={prepModal > 0}
          hasNext={prepModal < PREP_TEMPLATE.length - 1}
        />
      )}
    </div>
  );
}
