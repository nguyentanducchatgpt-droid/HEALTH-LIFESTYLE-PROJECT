import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  {
    step: 1, time: '0–5 phút', action: 'Chuẩn bị', desc: 'Rã đông thịt (nếu cần), vo gạo/nấu cơm, bật bếp, lấy rau ra.',
    icon: '🔧', color: '#6366f1', rgb: '99,102,241',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
    keyFact: '5 phút chuẩn bị đầu tiên quyết định 80% hiệu quả của cả buổi meal prep. Rã đông sai cách là nguyên nhân phổ biến nhất gây ngộ độc thực phẩm — vi khuẩn nhân đôi mỗi 20 phút ở nhiệt độ phòng. Mise en place (chuẩn bị đồ dùng trước) là kỹ thuật của đầu bếp chuyên nghiệp giúp giảm 40–50% thời gian bếp.',
    details: [
      'Rã đông thịt đúng cách: chuyển từ tủ đông xuống ngăn mát từ tối hôm trước (8–12h) là phương pháp an toàn nhất. KHÔNG rã đông ở nhiệt độ phòng — vùng nhiệt nguy hiểm (4°C–60°C) là môi trường vi khuẩn nhân đôi mỗi 20 phút. Nếu cần nhanh: ngâm túi kín trong nước lạnh, thay nước mỗi 30 phút.',
      'Mise en place (chuẩn bị trước): kỹ thuật của đầu bếp chuyên nghiệp — lấy hết hộp đựng, dao, thớt, nồi, chảo ra trước khi bắt đầu. Không phải tìm từng thứ khi đang nấu. Giảm 40–50% thời gian bếp so với không chuẩn bị.',
      'Vo gạo lứt và tỉ lệ nước: vo 2–3 lần cho đến khi nước bớt đục. Tỉ lệ: 1 cup gạo lứt : 2–2.5 cups nước (nhiều hơn gạo trắng do cám cứng). Ngâm trước 30 phút giúp gạo chín đều và mềm hơn. Nấu bật rice cooker và tiếp tục làm các việc khác.',
      'Batch cooking mindset: ngay từ đầu phải think in batches — nấu nhiều hơn mức cần, phân chia sau. Nấu 400g gà thay vì 200g không tốn thêm thời gian đáng kể nhưng cho protein cho 2 ngày. Lên kế hoạch số bữa ăn trước khi mua nguyên liệu.',
      'Kiểm tra inventory trước khi bắt đầu: check tủ lạnh xem đã có gì, thiếu gì. Plan combo bữa ăn — gà hôm nay ăn với rau gì, nước chấm nào. Biết trước plan giúp không phải dừng giữa chừng để nghĩ.',
      'An toàn thực phẩm từ bước đầu: rửa tay 20 giây với xà phòng trước khi bắt đầu và sau khi chạm thịt sống. Dùng thớt riêng cho thịt sống và rau (màu khác nhau). Cross-contamination là nguyên nhân phổ biến nhất gây food poisoning tại gia.',
    ],
    points: [
      { icon: '❄️', label: 'Rã Đông Tủ Lạnh 8–12h', note: 'An toàn nhất — tránh vùng nhiệt 4–60°C vi khuẩn nhân đôi mỗi 20 phút' },
      { icon: '🍳', label: 'Mise en Place Trước', note: 'Đầu bếp pro lấy hết đồ dùng ra trước — giảm 40–50% thời gian bếp' },
      { icon: '🌾', label: 'Ngâm Gạo Lứt 30 Phút', note: 'Gạo lứt ngâm trước → chín đều hơn, mềm hơn, ít tốn nước hơn' },
      { icon: '🔢', label: 'Think in Batches', note: 'Nấu 400g thay 200g không tốn thêm thời gian — protein đủ 2 ngày' },
    ],
  },
  {
    step: 2, time: '5–15 phút', action: 'Nấu đạm', desc: 'Luộc gà hoặc áp chảo cá. Song song luộc trứng 8–10 phút.',
    icon: '🍳', color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gà ức là protein king của meal prep: 31g protein/100g, ít fat, bảo quản 3–4 ngày. Kỹ thuật nấu protein đúng cách giúp gà không bị khô cứng — đây là vấn đề phổ biến nhất khiến người ta bỏ meal prep. Luộc sôi sùng sục là lỗi kỹ thuật cơ bản nhất.',
    details: [
      'Luộc gà ức đúng cách (poaching): nước lạnh + gà ức → đun sôi → hạ lửa nhỏ nhất → luộc 12–15 phút (tùy độ dày). KHÔNG luộc sôi sùng sục — nhiệt độ cao làm protein co rút nhanh, mất nước, gà khô xơ. Nhiệt độ bên trong đạt 74°C là chín hoàn hảo.',
      'Áp chảo đúng kỹ thuật (pan-sear): chảo nóng đỏ trước khi cho gà/cá vào (dầu bốc khói nhẹ). 3–4 phút mỗi mặt với lửa trung-cao. KHÔNG đậy nắp khi áp chảo — hơi nước tích tụ mất màu vàng caramel. Maillard reaction tạo ra hàng trăm hợp chất hương vị ở bề mặt.',
      'Song song luộc trứng: trứng từ tủ lạnh cho vào nước nguội → đun sôi → 8 phút (lòng đỏ chín hoàn toàn cho meal prep). Ngay khi tắt bếp, chuyển vào tô nước đá lạnh 5 phút — dừng cooking process và bóc vỏ dễ hơn. Bảo quản vỏ còn nguyên 7 ngày trong tủ lạnh.',
      'Tính lượng đạm cần nấu: thịt mất ~35% trọng lượng sau nấu do nước bốc hơi. Muốn 4 bữa × 100g cooked → cần nấu ~615g thịt tươi. Nấu dư 10–15% để có buffer cho ngày lỡ kế hoạch hoặc ăn thêm bữa.',
      'Đa dạng nguồn đạm: lý tưởng là làm 2 nguồn song song — gà ức (đạm cơ bản) + trứng luộc (tiện lợi, không cần ăn nóng) hoặc cá (omega-3). Tận dụng tối đa 2 bếp: gà trên bếp chính, trứng trên bếp phụ.',
      'Rest time cho thịt: sau khi nấu xong, để thịt nghỉ 5 phút trước khi cắt — juice phân phối lại vào thịt thay vì chảy ra hết khi cắt ngay. Cắt khi còn ấm (không quá nóng, không quá nguội) — dễ thao tác nhất và ít bị vụn.',
    ],
    points: [
      { icon: '🌡️', label: '74°C = Gà Chín Hoàn Hảo', note: 'Lửa nhỏ sau khi sôi — không sùng sục → gà mềm, không khô xơ' },
      { icon: '🔥', label: 'Chảo Nóng Đỏ Trước Khi Cho Vào', note: 'Maillard reaction → caramel bề mặt → hàng trăm hợp chất hương vị' },
      { icon: '🥚', label: 'Trứng Nước Lạnh → 8 Phút', note: 'Nước đá sau tắt bếp — dừng cooking, bóc vỏ dễ, bảo quản 7 ngày' },
      { icon: '⚖️', label: '615g Tươi = 4 Bữa 100g', note: 'Thịt mất ~35% sau nấu — tính ngược để mua đúng lượng, tránh thiếu' },
    ],
  },
  {
    step: 3, time: '15–25 phút', action: 'Xào rau', desc: 'Xào 2 loại rau khác nhau. Luộc thêm 1 loại nếu muốn.',
    icon: '🥢', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Xào rau đúng kỹ thuật giữ lại >85% vitamin và phytonutrients. Luộc nước sôi mất 20–30% vitamin C vào nước; xào nhanh nhiệt cao mất <15%. Hai loại rau khác nhau = đa dạng phytonutrient và tránh ngán sau 3 ngày.',
    details: [
      'Kỹ thuật stir-fry đúng: chảo hoặc wok nóng đỏ, dầu smoking point cao (dầu hướng dương, dầu cám gạo — không dùng dầu ô liu extra virgin vì điểm khói thấp). Tỏi vào trước 10 giây, sau đó rau. Lửa to nhất. Xào liên tục 3–5 phút, không đậy nắp. Rau còn hơi cứng là đúng độ.',
      'Thứ tự xào theo độ cứng: rau cứng vào trước (cà rốt, su su, broccoli cắt nhỏ), rau mềm sau (rau muống, cải thảo, đậu que). Quy tắc: rau cứng vào trước 1–2 phút rồi mới cho rau mềm. Sai thứ tự → rau cứng chưa chín, rau mềm đã nát.',
      'Hấp vs. luộc vs. xào: hấp tốt nhất (giữ >90% vitamin C), luộc mất 20–30% vào nước, xào nhanh mất <15%. Tuy nhiên xào có ưu điểm: dầu giúp hấp thụ vitamin A, E, K, carotenoids (fat-soluble). Trường hợp lý tưởng: hấp broccoli, xào rau lá xanh.',
      'KHÔNG cho thêm nước khi xào rau: nước làm rau bị luộc thay vì xào, mất màu xanh tươi và tạo nước thừa trong hộp meal prep. Rau tự ra nước trong quá trình xào là bình thường — đây là nước rau, không phải thiếu nước.',
      'Ráo nước là bước không thể bỏ: sau xào/luộc, để rau trên rổ hoặc trải mâm 3–5 phút. Hơi nóng bốc hơi, không đọng đáy hộp. Rau đổ vào hộp còn ẩm → sau 2–3 ngày thành vũng nước → rau nhớt. Đây là lý do #1 khiến meal prep rau thất bại.',
      '2 loại rau = 2 trải nghiệm: súp lơ hôm nay ăn với gà nước mắm chanh, đậu que ngày mai ăn với cá sốt cà. Đa dạng không chỉ về dinh dưỡng mà còn texture và hương vị. Làm cùng 1 loại rau 3 ngày là lý do #1 gây ngán và bỏ meal prep.',
    ],
    points: [
      { icon: '🔥', label: 'Lửa To + Chảo Nóng Đỏ', note: 'Stir-fry đúng: xào nhanh nhiệt cao — giữ màu xanh, giữ dinh dưỡng' },
      { icon: '📋', label: 'Rau Cứng Trước 1–2 Phút', note: 'Cà rốt/broccoli trước, rau lá sau — tránh cứng sống hoặc nát nhũn' },
      { icon: '💧', label: 'Ráo Nước Trước Khi Hộp', note: 'Quan trọng nhất: rau ẩm trong hộp → nhớt sau 1 ngày — không bỏ bước này' },
      { icon: '🌈', label: '2 Loại Rau = 2 Trải Nghiệm', note: 'Đa dạng phytonutrient + tránh ngán — lý do #1 gây bỏ meal prep' },
    ],
  },
  {
    step: 4, time: '25–35 phút', action: 'Phân chia', desc: 'Chia tinh bột, đạm, rau vào hộp. Cân bằng theo đĩa ăn chuẩn.',
    icon: '📦', color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Phân chia đúng tỉ lệ là bước biến "nấu ăn" thành "meal prep" thực sự. Không phân chia ngay sau nấu là sai lầm phổ biến nhất: thức ăn ở nhiệt độ phòng > 2 giờ → vi khuẩn phát triển nhanh. Hộp đúng loại và label ngày là yếu tố an toàn thực phẩm.',
    details: [
      'Healthy Plate Model khi phân chia: 50% rau (theo volume) + 25% tinh bột + 25% đạm. Rau chiếm nửa hộp nhưng chỉ 10–15% calo bữa ăn — đây là chiến lược fill-up mà không fill-out hiệu quả nhất. Theo thể tích, không phải trọng lượng.',
      'Phân chia ngay khi còn ấm: không chờ nguội hoàn toàn mới chia. Mục tiêu: chia trong vòng 30 phút sau khi nấu xong. Thức ăn ở 4–60°C quá 2 giờ → vùng nguy hiểm. Rau ráo nước + thịt nghỉ 5 phút → bắt đầu chia ngay.',
      'Lượng theo phần: 150–200g tinh bột (cooked) + 100–120g đạm + nhiều rau nhất có thể. Ban đầu dùng cân hoặc cup để "calibrate" mắt. Sau 3–4 lần meal prep, bạn ước lượng chính xác bằng mắt — không cần đong đo mỗi lần.',
      'Label hộp bắt buộc: dùng băng keo y tế hoặc marker xóa được ghi ngày nấu. Hộp tủ lạnh: tối đa 3–4 ngày. Hộp tủ đông: 1–2 tuần. Rule FIFO: First In First Out — hộp cũ ăn trước. Không label dẫn đến ăn nhầm thứ tự và lãng phí.',
      'Hộp thủy tinh (glass container) là tốt nhất: không thấm mùi, gia nhiệt trực tiếp trong microwave an toàn, nhìn thấy nội dung. Hộp nhựa BPA-free chấp nhận được nhưng không nên hâm nóng trực tiếp. Kích thước 750ml–1L phù hợp cho 1 bữa chính đầy đủ.',
      'Để riêng hay để chung: thức ăn cơ bản (đạm + rau + tinh bột) để chung trong 1 hộp ổn. Nước chấm/sốt luôn để riêng — chan khi ăn tránh rau bị ngấm. Rau sống (salad) luôn để riêng, không prep chung với thức ăn nóng đã nấu.',
    ],
    points: [
      { icon: '🍽️', label: '50% Rau + 25% Đạm + 25% Bột', note: 'Healthy Plate Model — 50% rau theo volume chỉ chiếm 10–15% calo' },
      { icon: '⏱️', label: 'Chia Trong 30 Phút Sau Nấu', note: 'Vùng nguy hiểm 4–60°C: vi khuẩn phát triển nhanh sau 2h nhiệt độ phòng' },
      { icon: '🏷️', label: 'Label Ngày — FIFO', note: 'Hộp cũ hơn ăn trước — tủ lạnh 3–4 ngày, tủ đông 1–2 tuần' },
      { icon: '🫙', label: 'Thủy Tinh 750ml–1L', note: 'Không thấm mùi, hâm microwave an toàn, nhìn thấy nội dung rõ' },
    ],
  },
  {
    step: 5, time: '35–45 phút', action: 'Bảo quản', desc: 'Để nguội trước khi đậy nắp. Tủ lạnh 3 ngày, tủ đông 1 tuần.',
    icon: '🧊', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Bảo quản đúng cách giữ 80–90% dinh dưỡng và hương vị trong 3 ngày. Hai lỗi phổ biến nhất: đậy nắp khi còn quá nóng (tạo hơi nước → môi trường vi khuẩn trong hộp kín) và không đánh dấu ngày nấu (ăn nhầm thứ tự, lãng phí hoặc ngộ độc).',
    details: [
      'Để nguội đúng cách trước tủ lạnh: để hộp mở không đậy nắp ở nhiệt độ phòng 20–30 phút. Mục tiêu: nhiệt độ xuống dưới 60°C trước khi đậy nắp và cho vào tủ. Đậy nắp sớm → hơi nước ngưng tụ bên trong → môi trường ẩm + ấm → vi khuẩn phát triển nhanh hơn dù đã trong tủ lạnh.',
      'Không cho thức ăn nóng vào tủ lạnh ngay: nhiệt độ tủ lạnh tăng → ảnh hưởng nhiệt đến các hộp khác → giảm thời gian bảo quản của TẤT CẢ thức ăn trong tủ. Nguyên tắc: chờ không còn bốc hơi nóng, không nghi ngút khói.',
      'Thời hạn bảo quản: tủ lạnh (4°C) — gà/cá nấu chín: 3–4 ngày; trứng luộc còn vỏ: 5–7 ngày; cơm: 3–5 ngày. Tủ đông (-18°C) — thịt/cá đã nấu: 1–2 tháng; cơm/tinh bột: 2–3 tháng. Tủ đông giảm texture nhưng an toàn dài hạn.',
      'Sắp xếp tủ lạnh đúng nguyên tắc: shelf trên cùng → đồ chín, ăn ngay. Shelf giữa → meal prep boxes. Shelf dưới cùng → thịt cá sống (tránh nhỏ xuống đồ khác). Ngăn rau → rau sống chưa cắt. Cross-contamination trong tủ lạnh là nguyên nhân phổ biến gây food poisoning tại nhà.',
      'Hâm nóng đúng cách: microwave 2–3 phút, đậy khăn giấy ẩm lên hộp để không bị khô. Chảo: thêm vài giọt nước, đậy nắp, lửa nhỏ 3–5 phút. Nhiệt độ trung tâm phải đạt 74°C (nóng bốc hơi) = an toàn. Chỉ hâm phần sẽ ăn — không hâm rồi để lại tủ lạnh.',
      'Dấu hiệu meal prep hỏng: mùi lạ khác thường, màu xỉn đi (thịt xám, rau vàng), texture nhớt hoặc nhầy. Nguyên tắc: "When in doubt, throw it out." Chi phí bỏ 1 hộp meal prep (~50k) nhỏ hơn nhiều so với chi phí ngộ độc thực phẩm. Sức khỏe không đáng đánh đổi.',
    ],
    points: [
      { icon: '⏰', label: 'Nguội 20–30 Phút Trước Tủ', note: 'Đậy sớm → hơi nước + vi khuẩn trong hộp kín dù đã vào tủ lạnh' },
      { icon: '🌡️', label: 'Tủ Lạnh 4°C → 3–4 Ngày', note: 'Gà/cá 3–4 ngày; tủ đông -18°C → 1–2 tháng an toàn' },
      { icon: '📋', label: 'Sắp: Chín Trên, Sống Dưới', note: 'Thịt sống shelf dưới cùng — tránh nhỏ xuống đồ chín gây ngộ độc' },
      { icon: '🔥', label: 'Hâm Đến 74°C = An Toàn', note: 'Nóng bốc hơi = đủ nhiệt. Chỉ hâm phần sẽ ăn, không hâm 2 lần' },
    ],
  },
];

const TIPS = [
  {
    icon: '🌈', color: '#22c55e', rgb: '34,197,94',
    tip: 'Đa dạng màu sắc = đa dạng dinh dưỡng. Mỗi tuần thay 1 loại rau.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Mỗi màu rau quả đại diện cho một nhóm phytonutrient khác nhau — pigment tự nhiên bảo vệ thực vật cũng bảo vệ tế bào người ăn. Nghiên cứu American Gut Project cho thấy người ăn ≥30 loại thực vật/tuần có gut microbiome đa dạng hơn đáng kể so với người ăn <10 loại.',
    details: [
      'Màu xanh (broccoli, rau muống, cải bó xôi): chlorophyll + folate + vitamin K + iron + lutein/zeaxanthin. Lutein và zeaxanthin bảo vệ mắt khỏi thoái hóa điểm vàng (AMD). Folate thiết yếu cho tổng hợp DNA và quan trọng với phụ nữ mang thai (giảm neural tube defects 70%).',
      'Màu đỏ/hồng (cà chua, ớt đỏ, dưa hấu): lycopene — carotenoid mạnh nhất chống oxy hóa tế bào tim mạch và tiền liệt tuyến. Lycopene trong cà chua tăng hấp thu khi nấu chín có dầu (fat-soluble carotenoid) — cà chua xào dầu hấp thu lycopene cao hơn cà chua sống 3–4 lần.',
      'Màu cam/vàng (cà rốt, khoai lang, ớt vàng): beta-carotene — tiền vitamin A. Hấp thu tăng mạnh khi có chất béo. Cà rốt xào dầu hấp thu beta-carotene cao hơn cà rốt sống 6.5 lần. Vitamin A thiết yếu cho thị lực, hệ miễn dịch, và tái tạo da.',
      'Màu tím (cà tím, bắp cải tím, việt quất): anthocyanins — flavonoid mạnh. Nghiên cứu cho thấy anthocyanins cải thiện trí nhớ ngắn hạn, giảm viêm não, và bảo vệ thành mạch máu. Cà tím có nasunin — antioxidant bảo vệ lipid trong màng tế bào não.',
      'Màu trắng/nâu nhạt (tỏi, hành tây, nấm): allicin (tỏi) + quercetin (hành tây) + ergothioneine (nấm — antioxidant độc đáo, chỉ có trong nấm, không tổng hợp được từ thực vật khác). Hành tây tím có quercetin cao gấp 3–4 lần hành tây trắng.',
      'Mục tiêu 30 loại thực vật/tuần: đây là target từ American Gut Project sau phân tích >10,000 mẫu microbiome. Đếm tất cả: rau, trái cây, đậu, hạt, ngũ cốc, gia vị (1 loại gia vị = 1 điểm). Đa dạng > số lượng — 30 loại mỗi 30g còn tốt hơn 3 loại mỗi 300g về gut diversity.',
    ],
    points: [
      { icon: '🟢', label: 'Xanh → Folate + Lutein', note: 'Bảo vệ DNA tổng hợp và mắt khỏi thoái hóa điểm vàng (AMD)' },
      { icon: '🔴', label: 'Đỏ → Lycopene + Dầu', note: 'Cà chua xào dầu: hấp thu lycopene cao hơn sống 3–4 lần' },
      { icon: '🟠', label: 'Cam → Beta-Carotene', note: 'Cà rốt xào dầu: hấp thu beta-carotene cao hơn sống 6.5 lần' },
      { icon: '🫐', label: '30 Loại Thực Vật/Tuần', note: 'American Gut Project: 30+ loại → gut microbiome vượt trội, miễn dịch tốt hơn' },
    ],
  },
  {
    icon: '🧊', color: '#3b82f6', rgb: '59,130,246',
    tip: 'Cơm gạo lứt để tủ lạnh qua đêm = tăng tinh bột kháng (tốt hơn cho đường huyết).',
    img: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef3e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Resistant starch (tinh bột kháng) trong cơm để lạnh qua đêm tăng 3–4 lần so với cơm mới nấu. Resistant starch không tiêu hóa được ở ruột non — đi thẳng xuống ruột già, nuôi vi khuẩn có lợi và sản xuất butyrate, giảm glycemic index và bảo vệ ruột kết.',
    details: [
      'Resistant starch là gì: tinh bột không tiêu hóa được bởi enzyme amylase ở ruột non. Có 4 loại; loại RS3 (retrograde) được tạo ra khi tinh bột nấu chín rồi làm lạnh — tinh bột tái kết tinh thành cấu trúc mà enzyme không phân cắt được.',
      'Tác dụng với đường huyết: resistant starch làm chậm tiêu hóa và hấp thu glucose → glycemic index (GI) giảm đáng kể. Cơm lứt mới nấu GI ~55; cơm lứt để lạnh và hâm nóng lại GI ~35–40. Giảm blood sugar spike sau ăn — có lợi cho cả người bình thường và tiểu đường type 2.',
      'Tác dụng với gut microbiome: resistant starch là prebiotic hàng đầu — nuôi Bifidobacterium, Lactobacillus, và Faecalibacterium prausnitzii (vi khuẩn liên quan đến giảm viêm). Lên men resistant starch → sản xuất butyrate, propionate, acetate (short-chain fatty acids).',
      'Butyrate — nhiên liệu của tế bào ruột kết: butyrate là nguồn năng lượng chính của colonocytes. Thiếu butyrate → tế bào ruột chết sớm → tăng intestinal permeability (leaky gut). Butyrate cũng giảm viêm toàn thân và được nghiên cứu trong ngăn ngừa ung thư ruột kết.',
      'Hâm nóng lại có làm mất resistant starch không: một phần RS3 bị phá vỡ khi hâm nóng, nhưng vẫn cao hơn cơm mới nấu. Nghiên cứu 2015: cơm để lạnh 24h rồi hâm nóng có resistant starch cao hơn cơm mới nấu 2.5 lần. Ăn nguội (kiểu sushi rice) giữ nhiều RS3 nhất.',
      'Áp dụng thực tế: nấu cơm tối hôm trước, để nguội 30 phút mở nắp → đậy nắp, tủ lạnh qua đêm. Sáng hôm sau hâm nóng 2 phút microwave. Không cần thay đổi gì trong thói quen — chỉ cần nấu sớm hơn 1 ngày. Đây là "hack" đơn giản nhất để upgrade meal prep.',
    ],
    points: [
      { icon: '🔬', label: 'GI Giảm Còn 35–40', note: 'Cơm lứt mới nấu GI ~55; sau làm lạnh + hâm = ~35–40 — no lâu hơn' },
      { icon: '🦠', label: 'Prebiotic Nuôi Gut Bacteria', note: 'Resistant starch nuôi Bifidobacterium → sản xuất butyrate bảo vệ ruột' },
      { icon: '⚡', label: 'Butyrate = Nhiên Liệu Ruột', note: 'Thiếu butyrate → leaky gut → viêm toàn thân — cơm lạnh phòng ngừa tự nhiên' },
      { icon: '🍱', label: 'Nấu Tối Hôm Trước = Tốt Hơn', note: 'Cơm lạnh 24h rồi hâm: resistant starch cao hơn cơm mới nấu 2.5 lần' },
    ],
  },
  {
    icon: '🔄', color: '#f97316', rgb: '249,115,22',
    tip: 'Làm 2 loại đạm khác nhau: 1 kiểu đậm đà + 1 kiểu nhẹ nhàng hơn.',
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đa dạng nguồn protein cung cấp amino acid profile đầy đủ hơn và ngăn ngán — nguyên nhân #1 khiến người bỏ meal prep. Mỗi nguồn đạm có profile amino acid và micronutrients đặc trưng: leucine từ gà, omega-3 từ cá, choline từ trứng — kết hợp tối ưu hơn chuyên biệt.',
    details: [
      'Tại sao 2 nguồn đạm: mỗi protein có profile amino acid khác nhau. Gà ức: leucine cao nhất → kích hoạt MPS tốt nhất. Cá hồi: taurine + EPA/DHA → anti-inflammatory + brain function. Trứng: choline → liver health + brain. Đa dạng nguồn > chuyên biệt 1 nguồn về tổng hợp dinh dưỡng.',
      '1 đậm đà + 1 nhẹ nhàng là combo thực tế nhất: đậm đà (gà kho gừng, cá áp chảo sốt tỏi) và nhẹ nhàng (gà luộc trắng, trứng luộc, đậu phụ hấp). Hôm nào ngán đồ đậm → ăn đồ nhẹ. Hôm nào muốn hương vị mạnh → đồ đậm đà. Linh hoạt theo mood thay vì bị ép ăn 1 kiểu.',
      'Leucine threshold — amino acid kích hoạt MPS: mỗi bữa cần ≥2.5–3g leucine để kích hoạt muscle protein synthesis tối đa. Gà ức 150g = ~3.2g leucine (đủ standalone). Trứng 2 quả = ~1.1g leucine (cần combine thêm protein khác). Kết hợp trứng + cơm + đậu phụ trong bữa đủ threshold.',
      'Protein timing: phân bổ 20–40g/bữa (3–4 bữa/ngày) hiệu quả hơn ăn 80g 1 lần. Bữa sau tập trong 2h đầu quan trọng nhất cho recovery. Protein trước ngủ (casein — sữa, phô mai tươi) hỗ trợ overnight muscle repair thêm 10–15%.',
      'Protein thực vật trong meal prep: đậu phụ (PDCAAS 0.91), đậu lăng, đậu đen là options tốt cho người muốn giảm thịt. Kết hợp legumes + grains (đậu + cơm) trong cùng bữa hoặc cùng ngày → complete amino acid profile tương đương thịt. Không cần "perfect combining" mỗi bữa — daily total amino acid balance đủ.',
      'Rotation mỗi tuần để không ngán: Tuần 1: gà + cá. Tuần 2: bò + trứng. Tuần 3: heo + đậu phụ. Rotation đảm bảo đa dạng micronutrients (iron từ thịt đỏ, omega-3 từ cá, choline từ trứng mỗi tuần) và giữ meal prep thú vị sau nhiều tháng.',
    ],
    points: [
      { icon: '💪', label: '≥2.5g Leucine/Bữa', note: 'Threshold kích hoạt MPS tối đa — gà ức 150g = 3.2g leucine đủ' },
      { icon: '🔄', label: 'Rotate Nguồn Mỗi Tuần', note: 'Tuần gà/cá, tuần bò/trứng — đa dạng micronutrient + không ngán dài hạn' },
      { icon: '🌱', label: 'Đậu + Cơm = Complete Protein', note: 'Legumes + grains cùng ngày → amino acid profile đầy đủ như thịt' },
      { icon: '🎭', label: 'Đậm Đà + Nhẹ Nhàng Combo', note: 'Hai phong cách nấu → chọn theo mood mỗi ngày, không bị ép ăn 1 kiểu' },
    ],
  },
  {
    icon: '📦', color: '#f59e0b', rgb: '245,158,11',
    tip: 'Hộp thủy tinh tốt hơn hộp nhựa — không mùi, gia nhiệt được trực tiếp.',
    img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hộp thủy tinh là lựa chọn tốt nhất cho meal prep: không thấm mùi, an toàn hâm microwave, bền 10+ năm, và không release hóa chất vào thức ăn khi nhiệt độ thay đổi. Chi phí ban đầu cao hơn nhưng rẻ hơn nhựa về dài hạn (cost per use thấp hơn 2x sau 2 năm).',
    details: [
      'BPA và BPA-free: BPA (bisphenol A) trong nhựa polycarbonate bị FDA cấm trong bình sữa trẻ em từ 2012. "BPA-free" nhựa thường thay bằng BPS hoặc BPF — nghiên cứu 2020–2023 cho thấy BPS/BPF có tác dụng endocrine disruptor tương tự BPA. Giải pháp tốt nhất: tránh hâm nhựa, hoặc chuyển sang thủy tinh.',
      'Leaching nhiều nhất khi: (1) nhiệt độ cao (hâm microwave), (2) acid tiếp xúc lâu (cà chua, chanh trong hộp nhựa), (3) nhựa bị trầy xước (tăng diện tích tiếp xúc). Thủy tinh hoàn toàn inert — không phản ứng với thức ăn ở bất kỳ nhiệt độ nào, acid hay base.',
      'Mùi và staining: nhựa thấm mùi sau 3–6 tháng (đặc biệt sốt nghệ, cà chua, tỏi). Thủy tinh không thấm mùi, không bị stain dù dùng hàng năm. Rửa máy rửa bát không làm mờ thủy tinh — nhựa có thể deform hoặc vàng ở nhiệt độ cao.',
      'Gia nhiệt microwave: hộp thủy tinh borosilicate (Pyrex, Anchor Hocking) chịu nhiệt -40°C đến 300°C, an toàn chuyển trực tiếp từ tủ đông → microwave → bàn ăn. Hộp nhựa "microwave safe" có nghĩa là không biến dạng — không đảm bảo không leach hóa chất khi nóng.',
      'Longevity và cost per use: thủy tinh tốt bền 10–15 năm. Nhựa thường thay sau 1–2 năm do stain, mùi, hoặc trầy xước. Chi phí/năm: thủy tinh ~50k/năm (hộp 200k / 4 năm thực tế) vs. nhựa ~100k/năm (hộp 50k / 6 tháng). Thủy tinh rẻ hơn sau 2 năm đầu.',
      'Kích thước và hãng tốt: 750ml (bữa vừa) và 1,000ml (bữa đầy đủ với nhiều rau) là 2 size nên có. Nắp lock kín tốt hơn nắp snap. Hộp vuông/chữ nhật tiết kiệm diện tích tủ lạnh hơn hộp tròn. Hãng đáng mua: Pyrex (Mỹ), Weck (Đức), IKEA 365+.',
    ],
    points: [
      { icon: '🧪', label: 'BPA-Free ≠ An Toàn Tuyệt Đối', note: 'BPS/BPF thay BPA cũng có endocrine disruption — thủy tinh không có vấn đề này' },
      { icon: '🔥', label: '-40°C → 300°C Borosilicate', note: 'Tủ đông thẳng microwave — zero leaching ở mọi nhiệt độ và mọi loại thức ăn' },
      { icon: '💰', label: 'Rẻ Hơn Sau 2 Năm', note: '~50k/năm (thủy tinh) vs. ~100k/năm (nhựa) — ROI rõ ràng về dài hạn' },
      { icon: '📐', label: 'Vuông 1L > Tròn', note: 'Xếp tủ lạnh gọn hơn; Pyrex, Weck, IKEA 365+ là lựa chọn tốt' },
    ],
  },
  {
    icon: '🧂', color: '#6366f1', rgb: '99,102,241',
    tip: 'Nêm gia vị sau khi hâm nóng, không cần cho vào hộp — giữ tươi hơn.',
    img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Gia vị trong hộp kín qua nhiều ngày = hương thơm bay hơi + rau/thịt bị over-marinated thay đổi texture. Nêm sau khi hâm là cách đơn giản nhất để mỗi bữa ăn tươi ngon như mới nấu, dù đã prep từ 2–3 ngày trước. Đây là bí quyết khác biệt giữa meal prep "ngon" và meal prep "meh."',
    details: [
      'Tại sao không nêm vào hộp: hương thơm của gia vị (terpenes, volatile compounds) bay hơi trong môi trường kín ẩm ấm qua 2–3 ngày. Tỏi trong hộp kín 3 ngày mất 60–70% allicin. Ớt tươi trong hộp 2 ngày mất màu và vị cay. Nêm vào hộp = lãng phí gia vị, bữa ăn nhạt và tẻ nhạt.',
      'Nước chấm và sốt để riêng: nước mắm, sốt tương, sốt cà chua làm rau và thịt bị over-marinated sau 2–3 ngày — mất texture giòn/mềm tự nhiên. Ví dụ ngoại lệ tốt: trứng luộc ngâm nước mắm/xì dầu 1 ngày (muốn marinate sâu). Rau xào ngâm sốt 3 ngày → nhũn, mất màu xanh.',
      'Gia vị nêm sau tốt nhất: tỏi phi thêm, tiêu xay, chanh/giấm (acid), ớt tươi, hành lá, rau mùi, ngò gai. Đây là volatile aromatics — phát huy tốt nhất khi mới thêm vào bữa ăn đã hâm nóng. Muối có thể cho vào hộp nhưng tốt hơn nêm sau để điều chỉnh theo khẩu vị từng ngày.',
      'Acid là "flavor brightener" của đầu bếp: vài giọt chanh hoặc giấm thêm trước khi ăn "brighten" toàn bộ hương vị bữa ăn — giống như muối nhưng không tăng sodium. Kỹ thuật này được dạy trong mọi trường culinary. Acid cũng tăng iron absorption từ rau lá xanh lên đến 3 lần (vitamin C + iron).',
      'Dầu ô liu extra virgin (EVOO) drizzle sau hâm: polyphenols trong EVOO (oleocanthal, oleuropein) bị phá hủy ở >180°C. Nấu với EVOO lãng phí phần quý nhất. Drizzle lên thức ăn đã hâm nóng (60–70°C) = giữ nguyên toàn bộ polyphenols anti-inflammatory. 1–2 muỗng cà phê đủ.',
      'Xây dựng seasoning station nhỏ: chuẩn bị bên cạnh lò vi sóng — lọ tỏi phi sẵn (bảo quản 3–4 ngày trong tủ lạnh), lọ tiêu xay, chanh tươi, ớt, EVOO. 30 giây nêm sau khi hâm = bữa ăn ngon hơn hẳn. Đây là khác biệt giữa meal prep "meh" và meal prep "wow" mà đầu bếp tại nhà ít chú ý.',
    ],
    points: [
      { icon: '💨', label: 'Volatile Aromatics Bay Hơi', note: 'Tỏi hộp kín 3 ngày mất 60–70% allicin — nêm sau để giữ nguyên hương' },
      { icon: '🍋', label: 'Acid = Flavor Brightener', note: 'Chanh/giấm sau hâm = tươi toàn bữa + tăng iron absorption rau xanh 3x' },
      { icon: '🫒', label: 'EVOO Drizzle Sau Hâm', note: 'Polyphenols bị phá >180°C — drizzle 60–70°C giữ toàn bộ anti-inflammatory' },
      { icon: '🧄', label: 'Seasoning Station Bên Lò Vi Sóng', note: 'Tỏi phi + tiêu + chanh + ớt + EVOO: 30 giây nêm = bữa ăn "wow"' },
    ],
  },
  {
    icon: '⏰', color: '#14b8a6', rgb: '20,184,166',
    tip: 'Meal prep tốt nhất vào tối Chủ nhật — fresh cho thứ 2–4.',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tối Chủ nhật là "golden window" của meal prep: siêu thị vừa restocked cuối tuần, bạn còn năng lượng sau ngày nghỉ, và thứ 2–4 là đỉnh workload tuần — khi bạn ít thời gian nấu nhất. Meal prep đúng thời điểm quyết định 70% khả năng duy trì thói quen lâu dài.',
    details: [
      'Tại sao Chủ nhật tối không phải buổi sáng: sáng Chủ nhật thường bận (family time, brunch, nghỉ ngơi). Buổi tối 7–9h: năng lượng còn đủ, nhà yên tĩnh, không bị gián đoạn. Thức ăn sẵn sàng trước khi thứ 2 bắt đầu — không phải vội vàng sáng thứ 2 khi đã bận rộn với công việc.',
      'Fresh window của meal prep: gà/cá nấu chín tươi ngon nhất 3 ngày đầu (thứ 2–4). Sau ngày thứ 4, chất lượng bắt đầu giảm — không nguy hiểm nhưng kém ngon, texture thay đổi. Nếu muốn ăn thứ 5–7: mini-prep 20 phút vào tối thứ 3 hoặc thứ 4 (chỉ cần nấu thêm đạm, cơm còn đủ).',
      'Two-session strategy tốt nhất: Chủ nhật tối — prep cho thứ 2–4 (45 phút full). Thứ 3 hoặc 4 tối — mini-prep cho thứ 5–7 (20–25 phút, đơn giản hơn vì còn cơm/tinh bột từ lần trước). Chiến lược này tốt hơn prep 1 lần cho cả 7 ngày về chất lượng thức ăn và hương vị.',
      'Grocery shopping Chủ nhật chiều: siêu thị thường nhập hàng mới thứ 6–thứ 7 cuối tuần. Mua Chủ nhật chiều → nấu tối hôm đó = nguyên liệu tươi nhất có thể. Tránh mua thứ 2 sáng — thường hết hàng tươi sau cuối tuần (gà, cá tươi hết trước).',
      'Cơm nấu Chủ nhật đủ cả tuần: cơm gạo lứt bảo quản tủ lạnh 3–5 ngày, tủ đông 2–3 tháng. Nấu 1 nồi lớn Chủ nhật → không cần nấu cơm mới mỗi ngày. Cơm để tủ lạnh qua đêm còn có lợi resistant starch (tip số 2). Win-win.',
      'Từ chore thành ritual: gắn meal prep với ritual cố định giúp duy trì thói quen. Mở playlist yêu thích, pha cốc trà hoặc cà phê, nấu ăn trong 45 phút. Đây không chỉ là cooking — đây là Sunday self-care ritual. Người duy trì meal prep thành công thường mô tả nó là "me time" thay vì việc phải làm.',
    ],
    points: [
      { icon: '📅', label: 'Thứ 2–4 = Đỉnh Workload', note: 'Ít thời gian nấu nhất → prep sẵn từ Chủ nhật = cứu cánh tuần bận' },
      { icon: '🕐', label: 'Fresh Window: 3 Ngày Đầu', note: 'Gà/cá ngon nhất thứ 2–4; mini-prep tối thứ 3–4 cho nửa sau tuần' },
      { icon: '🛒', label: 'Mua Chiều + Nấu Tối CN', note: 'Siêu thị restocked cuối tuần — nguyên liệu tươi nhất cả tuần' },
      { icon: '🎵', label: 'Ritual > Chore', note: 'Playlist + đồ uống + 45 phút = Sunday self-care ritual dễ duy trì' },
    ],
  },
];

function TipModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = TIPS[idx];
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
          <img src={item.img} alt={item.tip} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
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
          <p className="font-bold text-lg md:text-xl mb-4 leading-snug" style={{ color: item.color }}>{item.tip}</p>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {TIPS.length}</span>
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

function ScheduleModal({ idx, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const item = SCHEDULE[idx];
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
          <img src={item.img} alt={item.action} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)`, color: item.color }}>{item.step}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color: item.color, background: `rgba(${item.rgb},0.2)`, border: `1px solid rgba(${item.rgb},0.35)` }}>{item.time}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.icon} {item.action}</h2>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Bước {item.step} / {SCHEDULE.length}</span>
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
  const { t: tT } = useTranslation('tools');
  const [openComp, setOpenComp] = useState(null);
  const [prepModal, setPrepModal] = useState(null);
  const [scheduleModal, setScheduleModal] = useState(null);
  const [tipModal, setTipModal] = useState(null);

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
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">{tT('breadcrumb')}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🥡</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{tT('meal_prep.title')}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {tT('meal_prep.badge')}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {tT('meal_prep.desc')}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop" alt="Meal prep" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {tT('meal_prep.img_caption')}
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
          {SCHEDULE.map((s, i) => (
            <div key={s.step} className="group flex gap-4 items-center p-4 rounded-2xl border bg-surface transition-colors cursor-pointer hover:bg-white/5"
              style={{ borderColor: scheduleModal === i ? `rgba(${s.rgb},0.45)` : 'var(--border)' }}
              onClick={() => setScheduleModal(i)}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-lg" style={{ background: `rgba(${s.rgb},0.15)`, color: s.color }}>{s.step}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-text text-lg">{s.action}</span>
                  <span className="text-sm px-2 py-0.5 rounded-full" style={{ color: s.color, background: `rgba(${s.rgb},0.1)` }}>{s.time}</span>
                </div>
                <p className="text-base text-muted">{s.desc}</p>
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-3 py-1 rounded-full shrink-0"
                style={{ color: s.color, background: `rgba(${s.rgb},0.12)`, border: `1px solid rgba(${s.rgb},0.3)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Tips */}
      <RevealBlock delay={2} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Tips Không Ngán</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {TIPS.map((t, i) => (
            <div key={i}
              className="group relative rounded-xl border bg-surface p-4 cursor-pointer hover:bg-white/5 transition-colors"
              style={{ borderColor: tipModal === i ? `rgba(${t.rgb},0.45)` : 'var(--border)' }}
              onClick={() => setTipModal(i)}>
              <span className="text-2xl block mb-2">{t.icon}</span>
              <p className="text-base text-muted leading-snug">{t.tip}</p>
              <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold px-2 py-1 rounded-full"
                style={{ color: t.color, background: `rgba(${t.rgb},0.12)`, border: `1px solid rgba(${t.rgb},0.3)` }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">{tT('breadcrumb_back')}</Link>

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

      {tipModal !== null && (
        <TipModal
          idx={tipModal}
          onClose={() => setTipModal(null)}
          onPrev={() => setTipModal(i => Math.max(0, i - 1))}
          onNext={() => setTipModal(i => Math.min(TIPS.length - 1, i + 1))}
          hasPrev={tipModal > 0}
          hasNext={tipModal < TIPS.length - 1}
        />
      )}

      {scheduleModal !== null && (
        <ScheduleModal
          idx={scheduleModal}
          onClose={() => setScheduleModal(null)}
          onPrev={() => setScheduleModal(i => Math.max(0, i - 1))}
          onNext={() => setScheduleModal(i => Math.min(SCHEDULE.length - 1, i + 1))}
          hasPrev={scheduleModal > 0}
          hasNext={scheduleModal < SCHEDULE.length - 1}
        />
      )}
    </div>
  );
}
