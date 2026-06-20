import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#10b981';
const RGB = '16,185,129';
const ORBIT_ID = 'e-med-orbit-kf';
const ORBIT_CLASS = 'e-med-orbit-ring';
const ORBIT_PROP = '--e-med-orbit-angle';

const MED_RULES = [
  {
    num: '1', icon: '📋',
    title: 'Không tự ý đổi thuốc hoặc liều',
    desc: 'Không thay thế thuốc kê đơn bằng thuốc khác "trông giống vậy". Không tự giảm liều khi thấy "đỡ rồi" — nhiều bệnh cần điều trị đủ liệu trình mới khỏi hẳn.',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '⚠️ Mỗi thuốc kê đơn được chọn dựa trên hồ sơ bệnh nhân cụ thể — chẩn đoán, bệnh nền, thuốc đang dùng, chức năng gan/thận, dị ứng. "Trông giống vậy" không có nghĩa là hoạt chất giống nhau hay liều tương đương. Tự ý đổi thuốc là đặt cược với sức khỏe của mình.',
    details: [
      'Generic vs. brand: Thuốc gốc (generic) và thuốc brand name chứa cùng hoạt chất và liều nhưng có thể khác nhau về tá dược, màng bao, cách phóng thích — ảnh hưởng đến hấp thu và hiệu quả. Một số thuốc nhạy cảm (levothyroxine, warfarin, thuốc động kinh) không nên tự đổi giữa generic và brand mà không tham khảo bác sĩ.',
      'Tự giảm liều khi "đỡ rồi": đặc biệt nguy hiểm với kháng sinh (tạo đề kháng), corticosteroid (suy thượng thận cấp nếu ngưng đột ngột), thuốc chống trầm cảm (hội chứng ngưng thuốc), thuốc tim mạch (nhịp tim phản ứng dội).',
      'Tương tác giữa các thuốc (drug-drug interaction): ảnh hưởng enzyme chuyển hóa cytochrome P450. Ví dụ: warfarin + nhiều loại kháng sinh → tăng nguy cơ chảy máu; statin + clarithromycin → tăng nguy cơ tiêu cơ (rhabdomyolysis); ACE inhibitor + NSAID → suy thận cấp.',
      'Thuốc "trông giống vậy" (look-alike): nhầm lẫn thuốc do tên gọi hoặc hình dạng tương tự — một trong các nguyên nhân hàng đầu gây sai sót thuốc trong bệnh viện và tại nhà. ISMP (Institute for Safe Medication Practices) duy trì danh sách các cặp LASA (Look-Alike Sound-Alike) nguy hiểm.',
      'Khi muốn chuyển thuốc hoặc giảm liều: luôn trao đổi với bác sĩ kê đơn. Nhiều bác sĩ sẵn sàng điều chỉnh nếu bạn giải thích lý do (giá, phụ tác dụng, bất tiện). Không tự quyết định vì "đọc trên mạng thấy người khác dùng vậy".',
      'Kháng sinh và liệu trình đủ: triệu chứng cải thiện thường xảy ra trước khi vi khuẩn bị tiêu diệt hoàn toàn. Ngưng kháng sinh sớm → vi khuẩn còn sống sót phát triển đề kháng → lần tái phát khó điều trị hơn. Đây là cơ chế chính tạo ra siêu vi khuẩn kháng thuốc.',
    ],
    points: [
      { icon: '🧬', label: 'Generic ≠ tự động thay thế', note: 'Thuốc nhạy cảm (warfarin, levothyroxine) — hỏi bác sĩ trước khi đổi' },
      { icon: '⚠️', label: 'Ngưng corticoid đột ngột = nguy hiểm', note: 'Suy thượng thận cấp — giảm liều từ từ theo hướng dẫn' },
      { icon: '🔄', label: 'Tương tác P450 — đọc tờ hướng dẫn', note: 'Warfarin, statin, ACE inhibitor dễ tương tác nhất' },
      { icon: '💬', label: 'Hỏi bác sĩ thay vì tự điều chỉnh', note: 'Bác sĩ sẵn sàng điều chỉnh nếu bạn giải thích lý do' },
    ],
  },
  {
    num: '2', icon: '⏰',
    title: 'Uống đúng giờ, đúng cách',
    desc: 'Một số thuốc cần uống trước ăn (như metformin để giảm phụ tác dụng dạ dày), một số cần uống sau ăn. Kháng sinh cần duy trì nồng độ đều đặn — uống đúng giờ.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
    keyFact: '⏱️ Thời điểm uống thuốc không phải ngẫu nhiên — được quyết định bởi dược động học: tốc độ hấp thu, ảnh hưởng của thức ăn lên pH dạ dày, và cần duy trì nồng độ điều trị trong máu. Uống sai thời điểm có thể giảm hiệu quả đến 50% hoặc tăng phụ tác dụng.',
    details: [
      'Thuốc nên uống trước ăn (dạ dày rỗng): Levothyroxine (hấp thu tốt hơn 40% khi đói); Omeprazole/PPI (cần kích hoạt trước bữa ăn 30 phút); Bisphosphonate (alendronate — phải uống lúc đói với nhiều nước, đứng thẳng 30 phút sau).',
      'Thuốc nên uống sau ăn: NSAID (ibuprofen, naproxen, aspirin — giảm kích ứng niêm mạc dạ dày); Metformin (giảm buồn nôn và tiêu chảy khi uống cùng bữa ăn); Sắt — tuy hấp thu tốt hơn khi đói nhưng nếu không chịu được thì uống sau ăn nhẹ.',
      'Kháng sinh và nồng độ đều đặn: kháng sinh time-dependent (penicillin, amoxicillin, cephalosporin) cần duy trì nồng độ trên MIC (Minimal Inhibitory Concentration) trong suốt khoảng cách giữa các liều. Uống trễ 2–3 giờ → nồng độ tụt dưới MIC → vi khuẩn phát triển trở lại.',
      'Thuốc uống buổi tối: statin (atorvastatin có thể uống bất kỳ lúc nào; simvastatin/pravastatin tốt nhất buổi tối vì gan tổng hợp cholesterol nhiều nhất 2–4 giờ sáng); thuốc hạ áp (một số nghiên cứu MAPEC/TIME cho thấy uống tối giảm biến cố tim mạch hơn uống sáng).',
      'Thuốc kiểm soát phóng thích (extended-release/XR/SR): KHÔNG nghiền, KHÔNG bẻ đôi — phá vỡ cơ chế kiểm soát phóng thích → toàn bộ liều giải phóng cùng lúc → có thể ngộ độc. Ví dụ: metoprolol XL, metformin XR, nifedipine SR, lithium SR.',
      'Cách uống nước: hầu hết thuốc nên uống với ít nhất 200ml nước (1 ly) để đảm bảo thuốc xuống đến dạ dày và tan đều. Bisphosphonate cần 250ml. Không uống thuốc với nước cam, cà phê, sữa — ảnh hưởng đến hấp thu.',
    ],
    points: [
      { icon: '🦋', label: 'Levothyroxine: uống lúc đói — quan trọng', note: 'Thức ăn và canxi giảm hấp thu 40% — uống 30–60 phút trước ăn' },
      { icon: '🚫', label: 'Không nghiền/bẻ thuốc XR/SR/XL', note: 'Phá cơ chế phóng thích → nguy cơ ngộ độc cấp tính' },
      { icon: '⏰', label: 'Kháng sinh: đúng giờ mỗi ngày', note: 'Uống trễ → nồng độ tụt → vi khuẩn phát triển trở lại' },
      { icon: '💧', label: 'Uống với ít nhất 200ml nước', note: 'Không uống với sữa, nước cam, cà phê — ảnh hưởng hấp thu' },
    ],
  },
  {
    num: '3', icon: '🍊',
    title: 'Chú ý tương tác thuốc-thức ăn',
    desc: 'Bưởi (grapefruit) ức chế enzyme CYP3A4, tăng nồng độ nhiều loại thuốc lên 10 lần. Rượu + paracetamol → tổn thương gan. Sữa + tetracycline → giảm hấp thu.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f55f1e4f?w=800&q=80',
    keyFact: '🍊 Bưởi (và một số thực phẩm khác) không chỉ "ảnh hưởng nhỏ" — có thể tăng nồng độ thuốc trong máu lên 2–10 lần, tương đương uống quá liều. Tương tác thức ăn-thuốc thường bị bỏ qua nhưng có thể nguy hiểm hơn nhiều người nghĩ.',
    details: [
      'Bưởi và CYP3A4: bưởi chứa furanocoumarins ức chế enzyme CYP3A4 ở ruột — enzyme chuyển hóa 50% thuốc phổ biến. Tác dụng kéo dài 24–72 giờ sau một ly nước bưởi. Thuốc nguy hiểm nhất khi kết hợp bưởi: statin (simvastatin, atorvastatin → nguy cơ tiêu cơ), calcium channel blocker (felodipine, nifedipine → hạ áp quá mức), immunosuppressant (cyclosporine → độc thận), sildenafil (Viagra → hạ áp nguy hiểm).',
      'Rượu + paracetamol: người uống rượu thường xuyên có CYP2E1 tăng hoạt → chuyển hóa paracetamol thành NAPQI (chất độc gan) nhiều hơn; đồng thời glutathione (chất giải độc) bị cạn kiệt do rượu. Ngưỡng an toàn giảm còn 2g/ngày (thay vì 4g). Paracetamol vẫn là lựa chọn giảm đau tốt hơn NSAID ở người uống rượu nếu dùng đúng liều.',
      'Vitamin K và warfarin: rau xanh giàu vitamin K (cải xoăn, bông cải xanh, rau bina) ảnh hưởng đến hiệu quả warfarin. Không cần kiêng hoàn toàn — nhưng cần ăn nhất quán (không tăng/giảm đột ngột). Báo bác sĩ nếu thay đổi chế độ ăn để điều chỉnh liều warfarin.',
      'Sữa và kháng sinh: Ca2+ trong sữa tạo phức chelate với tetracycline và fluoroquinolone (ciprofloxacin) → giảm hấp thu 40–90%. Uống các kháng sinh này cách sữa hoặc các sản phẩm từ sữa, antacid chứa Ca/Mg/Al ít nhất 2 giờ.',
      'Tyramine và MAOI: thuốc ức chế MAO (monoamine oxidase inhibitor — một số thuốc chống trầm cảm) + thực phẩm giàu tyramine (phô mai già, rượu vang đỏ, thịt xông khói, nước tương, tương đậu) → tăng huyết áp khủng hoảng (hypertensive crisis) đe dọa tính mạng. Cần hỏi dược sĩ nếu đang dùng MAOI.',
      'Caffeine và thuốc: caffeine + kháng sinh fluoroquinolone (ciprofloxacin) → tăng nồng độ caffeine → lo lắng, tim đập nhanh. Caffeine + ephedrine (một số thuốc cảm) → tăng nhịp tim, huyết áp. Uống thuốc với cà phê nói chung không khuyến nghị — ảnh hưởng hấp thu và tương tác tiềm ẩn.',
    ],
    points: [
      { icon: '🍊', label: 'Bưởi ảnh hưởng 24–72 giờ', note: 'Không chỉ "uống cùng lúc" — cả ngày hôm sau vẫn còn tác dụng' },
      { icon: '🍷', label: 'Rượu + paracetamol = nguy hiểm', note: 'Ngưỡng an toàn giảm còn 2g/ngày ở người uống rượu thường xuyên' },
      { icon: '🥛', label: 'Sữa + tetracycline/ciprofloxacin = cách 2 giờ', note: 'Ca2+ chelate với kháng sinh → giảm hấp thu 40–90%' },
      { icon: '🥬', label: 'Vitamin K + warfarin = nhất quán', note: 'Không cần kiêng rau xanh — nhưng ăn đều đặn, không tăng/giảm đột ngột' },
    ],
  },
  {
    num: '4', icon: '💊',
    title: 'Không dùng chung thuốc',
    desc: 'Thuốc kê cho người khác, dù cùng triệu chứng, có thể không phù hợp với bạn do dị ứng, bệnh nền, hoặc tương tác thuốc đang dùng.',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    keyFact: '🚫 Kể cả khi triệu chứng trông giống hệt nhau, nguyên nhân bên dưới có thể hoàn toàn khác — và cùng loại thuốc có thể gây hại nghiêm trọng do bệnh nền, tương tác thuốc, hoặc dị ứng mà người kê đơn không biết về bạn.',
    details: [
      'Cùng triệu chứng ≠ cùng bệnh: đau đầu có thể là migraine, cao huyết áp, u não, hay căng thẳng — điều trị khác nhau. Đau bụng có thể là viêm loét, sỏi thận, hay viêm ruột thừa. Thuốc phù hợp với người kia chưa chắc phù hợp với bạn khi chưa biết nguyên nhân.',
      'Dị ứng chéo (cross-reactivity): người dị ứng penicillin có 1–10% khả năng dị ứng chéo với cephalosporin. Người dị ứng aspirin có thể dị ứng với tất cả NSAID. Người dị ứng sulfonamide có thể phản ứng với furosemide (lợi tiểu), thiazide. Không biết hồ sơ dị ứng của người khác = không biết thuốc họ đang dùng có an toàn cho bạn không.',
      'Liều theo cân nặng và tuổi: paracetamol, ibuprofen, nhiều kháng sinh có liều tính theo kg cân nặng — đặc biệt quan trọng ở trẻ em và người già. Thuốc liều cho người 70kg không phù hợp cho người 45kg hay trẻ em.',
      'Tương tác với thuốc đang dùng: người cho bạn thuốc không biết bạn đang uống gì. Ví dụ: họ cho bạn clarithromycin (kháng sinh) nhưng bạn đang uống simvastatin → tương tác nguy hiểm tăng nguy cơ tiêu cơ nghiêm trọng.',
      'Bệnh nền ảnh hưởng lựa chọn thuốc: NSAID (ibuprofen) chống chỉ định ở người suy thận, loét dạ dày đang hoạt động, suy tim. Metformin chống chỉ định khi GFR < 30. Quinolone ảnh hưởng sụn khớp ở trẻ em. Người nhận thuốc không biết các chống chỉ định của bạn.',
      'Kháng sinh và đề kháng: dùng kháng sinh không đúng chỉ định (virus không cần kháng sinh), không đủ liệu trình, hoặc dùng loại không phù hợp với vi khuẩn đang gây bệnh → chọn lọc vi khuẩn đề kháng. Hiện tại Việt Nam có tỷ lệ đề kháng kháng sinh thuộc hàng cao nhất thế giới do lạm dụng kháng sinh không kê đơn.',
    ],
    points: [
      { icon: '🔍', label: 'Cùng triệu chứng ≠ cùng bệnh', note: 'Đau đầu, đau bụng có hàng chục nguyên nhân khác nhau' },
      { icon: '⚗️', label: 'Dị ứng chéo — nguy hiểm ẩn', note: 'Dị ứng penicillin → có thể dị ứng cephalosporin' },
      { icon: '⚖️', label: 'Liều theo cân nặng — đặc biệt trẻ em', note: 'Thuốc người lớn 70kg không phù hợp cho trẻ hay người nhỏ con' },
      { icon: '🇻🇳', label: 'Việt Nam: đề kháng kháng sinh hàng đầu', note: 'Hệ quả của dùng kháng sinh không kê đơn tràn lan' },
    ],
  },
  {
    num: '5', icon: '📦',
    title: 'Bảo quản đúng cách',
    desc: 'Hầu hết thuốc bảo quản ở nơi khô ráo, thoáng mát, tránh ánh nắng. Không để thuốc trong phòng tắm (ẩm) hay xe hơi (nóng). Insulin: bảo quản lạnh 2–8°C.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '🌡️ Nhiệt độ và độ ẩm có thể phá vỡ cấu trúc hóa học của thuốc — không chỉ giảm hiệu quả mà còn tạo ra sản phẩm phân hủy có hại. Phòng tắm (ẩm, nóng) và xe hơi (nhiệt độ đến 70°C vào mùa hè) là hai nơi phổ biến nhất gây hỏng thuốc.',
    details: [
      'Điều kiện bảo quản tiêu chuẩn: "nhiệt độ phòng" theo dược điển = 15–25°C, độ ẩm < 60%. "Mát" = 8–15°C. "Lạnh" = 2–8°C (ngăn mát tủ lạnh, KHÔNG đông lạnh). "Đông lạnh" = dưới -10°C. Đọc nhãn thuốc để biết yêu cầu cụ thể.',
      'Insulin: lọ/bút chưa dùng → tủ lạnh 2–8°C. Lọ/bút đang dùng → nhiệt độ phòng dưới 25°C, tối đa 28–30 ngày (tùy loại). Không để trong ngăn đông (insulin đông đá mất hiệu lực). Không để gần ống xả nhiệt tủ lạnh (nhiệt độ quá thấp). Luôn đọc tờ hướng dẫn của từng loại insulin.',
      'Thuốc viên và nhiệt độ cao: viên thuốc gelatin, suppository (thuốc đặt), kem bôi nhạy cảm với nhiệt. Xe hơi đỗ ngoài trời mùa hè: nhiệt độ trong xe có thể đạt 60–80°C — đủ để phân hủy nhiều loại thuốc trong vài giờ. Không để thuốc trong glove compartment hay cốp xe.',
      'Phòng tắm — môi trường tệ nhất: độ ẩm cao (hơi nước từ tắm/vòi sen) + nhiệt độ dao động → hút ẩm làm vỡ vỏ viên, thủy phân hoạt chất, tạo điều kiện nấm mốc phát triển. Tủ thuốc trong phòng tắm là thói quen phổ biến nhưng không phù hợp.',
      'Ánh sáng và oxi hóa: ánh UV và ánh sáng nhìn thấy oxy hóa nhiều hoạt chất (đặc biệt vitamin A, C, E, một số kháng sinh như doxycycline, tetracycline). Đây là lý do nhiều thuốc đựng trong hộp/chai màu tối. Không bỏ thuốc ra khỏi bao bì gốc trừ khi cần.',
      'Thuốc hết hạn: hầu hết thuốc vẫn an toàn sau hạn dùng nhưng giảm hiệu lực. Ngoại lệ nguy hiểm: tetracycline hết hạn → độc thận (Fanconi syndrome); nitroglycerin hết hạn → mất hiệu lực trong cấp cứu tim; insulin hết hạn → giảm hiệu lực kiểm soát đường huyết. Loại bỏ thuốc hết hạn đúng cách: không đổ xuống bồn cầu — đem đến nhà thuốc hoặc cơ sở y tế.',
    ],
    points: [
      { icon: '🌡️', label: 'Xe hơi có thể đạt 60–80°C mùa hè', note: 'Phân hủy nhiều loại thuốc trong vài giờ — không để trong xe' },
      { icon: '🚿', label: 'Phòng tắm = môi trường tệ nhất cho thuốc', note: 'Độ ẩm + nhiệt → thủy phân, nấm mốc, giảm hiệu lực' },
      { icon: '💉', label: 'Insulin đang dùng: nhiệt độ phòng ≤ 30 ngày', note: 'Không đông lạnh — insulin đông đá mất hiệu lực hoàn toàn' },
      { icon: '♻️', label: 'Không đổ thuốc hết hạn xuống bồn cầu', note: 'Đem đến nhà thuốc hoặc cơ sở y tế để xử lý đúng cách' },
    ],
  },
];

const DANGER_PHRASES = [
  { phrase: '"Uống nhiều hơn cho mau khỏi"', risk: 'Quá liều, độc cho gan/thận tùy loại thuốc' },
  { phrase: '"Thuốc tây hại, dùng thuốc nam cho an toàn"', risk: 'Nhiều thảo dược tương tác nghiêm trọng với thuốc tây (St. John\'s Wort + thuốc chống trầm cảm, kava + an thần)' },
  { phrase: '"Kháng sinh uống vài ngày thấy khỏi thì thôi"', risk: 'Kháng kháng sinh — vi khuẩn sống sót phát triển đề kháng, lần sau khó điều trị hơn' },
  { phrase: '"Paracetamol an toàn, uống nhiều không sao"', risk: 'Paracetamol > 4g/ngày (người bình thường) hoặc > 2g/ngày (uống rượu nhiều) → suy gan cấp' },
  { phrase: '"Vitamin uống bao nhiêu cũng được"', risk: 'Vitamin A, D, E, K (tan trong dầu) tích lũy → độc liều cao. Vitamin A: > 10.000 IU/ngày gây dị tật thai' },
  { phrase: '"Thuốc bổ không cần đơn"', risk: 'TPCN không qua kiểm duyệt nghiêm ngặt như thuốc, có thể nhiễm kim loại nặng, tương tác thuốc' },
];

const SUPPLEMENT_CHECK = [
  { label: 'Omega-3', note: 'Giảm TG, an toàn. Liều > 3g/ngày: ảnh hưởng đông máu — báo bác sĩ trước mổ.' },
  { label: 'Vitamin D3', note: 'Thiếu phổ biến. Liều 1.000–2.000 IU/ngày an toàn. Kiểm tra 25(OH)D máu trước bổ sung liều cao.' },
  { label: 'Magie', note: 'Giúp ngủ, giảm chuột rút. Magie glycinate/citrate hấp thu tốt. Liều > 350mg/ngày → tiêu chảy.' },
  { label: 'Probiotics', note: 'Hỗ trợ đường ruột sau kháng sinh. Uống cách kháng sinh 2 giờ.' },
  { label: 'Sắt', note: 'Chỉ bổ sung khi có chỉ định thiếu máu. Thừa sắt gây táo bón, có hại cho gan.' },
  { label: 'Canxi', note: 'Hấp thu tốt nhất từ thực phẩm. Bổ sung: canxi citrate tốt hơn carbonate. Không uống cùng sắt.' },
];

function MedCard({ rule, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-5 flex gap-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${rule.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${rule.rgb},0.12)` : 'none', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-200"
        style={{ background: `rgba(${rule.rgb},0.14)`, border: `1px solid rgba(${rule.rgb},${hovered ? '0.4' : '0.2'})` }}>
        {rule.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-text mb-1 flex items-center gap-2">
          <span>{rule.num}. {rule.title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200"
            style={{ background: `rgba(${rule.rgb},0.12)`, color: rule.color, opacity: hovered ? 1 : 0 }}>Xem thêm →</span>
        </div>
        <p className="text-base text-muted line-clamp-2">{rule.desc}</p>
      </div>
    </div>
  );
}

function MedModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Quy tắc {item.num}/5</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.num}. {item.title}</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.desc}</p>
          <div className="rounded-2xl px-4 py-3 mb-6 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.88)' }}>
            {item.keyFact}
          </div>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-3"
                style={{ background: `rgba(${item.rgb},0.06)`, border: `1px solid rgba(${item.rgb},0.15)` }}>
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-xs leading-snug" style={{ color: '#e5e7eb' }}>{pt.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(156,163,175,0.9)' }}>{pt.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-med-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-med-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthMedSafetyPage() {
  const [medModal, setMedModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eMedOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eMedOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💊</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">An Toàn Thuốc</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Dùng thuốc đúng cách · Tránh rủi ro
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Thuốc chữa bệnh khi dùng đúng, nhưng gây hại khi dùng sai. Hiểu đúng về thuốc — bao gồm thuốc kê đơn, OTC, và thực phẩm chức năng — là kỹ năng bảo vệ sức khỏe thiết yếu.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop" alt="An toàn thuốc" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Dùng đúng thuốc · Đúng liều · Đúng lúc
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Quy Tắc An Toàn Thuốc</h2>
        <p className="text-muted text-lg mb-6">Áp dụng mỗi khi bắt đầu một loại thuốc mới. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-4">
          {MED_RULES.map((r, i) => (
            <MedCard key={i} rule={r} onClick={() => setMedModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Những Câu Nguy Hiểm Cần Nhớ</h2>
        <p className="text-muted text-lg mb-6">Những quan niệm phổ biến nhưng sai — và tại sao chúng nguy hiểm.</p>
        <div className="space-y-3">
          {DANGER_PHRASES.map((d, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4">
              <div className="font-bold text-lg text-amber-400 mb-2">"{d.phrase}"</div>
              <p className="text-base text-muted flex gap-2"><span className="text-red-400 shrink-0">⚠</span>{d.risk}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Hướng Dẫn Bổ Sung Thực Phẩm Chức Năng</h2>
        <p className="text-muted text-lg mb-6">TPCN không phải thuốc nhưng cũng cần dùng đúng cách. Luôn thông báo cho bác sĩ tất cả TPCN đang dùng.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPLEMENT_CHECK.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 hover:border-emerald-500/30 transition-colors">
              <div className="font-bold text-lg text-text mb-1">{s.label}</div>
              <p className="text-base text-muted">{s.note}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Luôn Nói Với Bác Sĩ / Dược Sĩ</h3>
          <ul className="space-y-2 text-lg text-muted">
            <li>• Tất cả thuốc đang dùng (kể cả OTC, vitamin, thảo dược)</li>
            <li>• Dị ứng thuốc đã gặp trước đây</li>
            <li>• Đang mang thai, cho con bú, hoặc có kế hoạch mang thai</li>
            <li>• Bệnh nền: gan, thận, tim — ảnh hưởng lớn đến lựa chọn và liều thuốc</li>
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục sức khỏe. Không thay thế tư vấn của bác sĩ hoặc dược sĩ.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {medModal !== null && (
        <MedModal
          item={MED_RULES[medModal]}
          idx={medModal}
          total={MED_RULES.length}
          onClose={() => setMedModal(null)}
          onPrev={() => setMedModal(i => Math.max(0, i - 1))}
          onNext={() => setMedModal(i => Math.min(MED_RULES.length - 1, i + 1))}
          hasPrev={medModal > 0}
          hasNext={medModal < MED_RULES.length - 1}
        />
      )}
    </div>
  );
}
