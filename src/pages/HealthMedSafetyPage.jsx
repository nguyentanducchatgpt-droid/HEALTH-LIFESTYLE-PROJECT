import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  {
    icon: '📈', phrase: '"Uống nhiều hơn cho mau khỏi"',
    risk: 'Quá liều, độc cho gan/thận tùy loại thuốc',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '🚨 Liều thuốc được tính toán dựa trên dược động học — khoảng cách giữa liều điều trị và liều gây độc (therapeutic index) thường rất hẹp. Tăng liều không có nghĩa là "mau khỏi hơn" — mà là đang tiến gần ngưỡng gây tổn thương cơ quan.',
    details: [
      'Chỉ số điều trị hẹp (narrow therapeutic index): một số thuốc như digoxin, warfarin, lithium, phenytoin, theophylline có khoảng cách rất nhỏ giữa liều điều trị và liều độc — uống gấp đôi có thể gây ngộ độc nghiêm trọng dù chỉ tăng một chút.',
      'Paracetamol — cạm bẫy phổ biến nhất: ở liều điều trị, gan chuyển hóa paracetamol an toàn. Khi quá liều, con đường chính bão hòa → enzyme CYP2E1 tạo ra NAPQI (chất độc mạnh). Glutathione dùng để trung hòa NAPQI cạn kiệt → tổn thương tế bào gan không hồi phục sau 3–5 ngày.',
      'NSAID (ibuprofen, naproxen) quá liều: viêm loét dạ dày cấp, xuất huyết tiêu hóa, suy thận cấp (ức chế prostaglandin thận → co mạch máu thận), và trên liều 3.200mg/ngày ibuprofen tăng nguy cơ đột quỵ và nhồi máu cơ tim.',
      'Vitamin D liều cao kéo dài: nhiều người tự tăng liều vì "thiếu vitamin D thì uống nhiều cho nhanh". Vitamin D > 10.000 IU/ngày kéo dài → hypercalcemia (calci máu cao) → buồn nôn, sỏi thận, vôi hóa mô mềm, rối loạn nhịp tim. Cần đo 25(OH)D trước khi điều chỉnh liều.',
      'Kháng sinh quá liều không chữa nhanh hơn: hiệu quả kháng sinh (trừ nhóm concentration-dependent như aminoglycoside) phụ thuộc vào thời gian duy trì nồng độ trên MIC, không phải nồng độ đỉnh. Tăng liều amoxicillin không diệt khuẩn nhanh hơn — chỉ tăng nguy cơ tiêu chảy và phá vỡ vi khuẩn có ích.',
      'Triệu chứng ngộ độc cần cấp cứu ngay: buồn nôn/nôn nhiều sau uống thuốc, đau bụng dữ dội, vàng da/vàng mắt (tổn thương gan), tiểu ít/không tiểu (suy thận), rối loạn ý thức, co giật. Nếu nghi ngộ độc thuốc: gọi 115 hoặc đến cấp cứu ngay — không chờ triệu chứng nặng hơn.',
    ],
    points: [
      { icon: '⚖️', label: 'Therapeutic index hẹp — rất nguy hiểm', note: 'Digoxin, warfarin, lithium, phenytoin — tăng liều nhỏ = ngộ độc' },
      { icon: '🔥', label: 'Paracetamol: NAPQI phá gan sau 3–5 ngày', note: 'Ngộ độc không đau ngay — tổn thương âm thầm đến khi quá muộn' },
      { icon: '💊', label: 'Vitamin D > 10.000 IU/ngày → sỏi thận', note: 'Đo 25(OH)D máu trước khi tự điều chỉnh liều cao' },
      { icon: '🚨', label: 'Nghi ngộ độc thuốc → gọi 115 ngay', note: 'Không chờ triệu chứng nặng — cửa sổ điều trị rất hẹp' },
    ],
  },
  {
    icon: '🌿', phrase: '"Thuốc tây hại, dùng thuốc nam cho an toàn"',
    risk: 'Nhiều thảo dược tương tác nghiêm trọng với thuốc tây (St. John\'s Wort + thuốc chống trầm cảm, kava + an thần)',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    keyFact: '🌿 "Tự nhiên" không đồng nghĩa với "an toàn". Nhiều thảo dược chứa hoạt chất dược lý mạnh, tương tác với thuốc tây, và không trải qua kiểm duyệt lâm sàng nghiêm ngặt trước khi bán ra thị trường.',
    details: [
      'St. John\'s Wort (Hypericum perforatum) — kẻ gây rối nổi tiếng nhất: cảm ứng mạnh enzyme CYP3A4 và P-glycoprotein → giảm nồng độ hàng chục loại thuốc quan trọng: thuốc chống HIV (indinavir giảm 57%), thuốc tránh thai (có thể dẫn đến mang thai ngoài ý muốn), warfarin (giảm hiệu quả chống đông), cyclosporine (tăng thải ghép), digoxin, nhiều thuốc chống trầm cảm.',
      'Kava (Piper methysticum) và độc gan: kava là thảo dược giảm lo âu phổ biến. Tuy nhiên, có trên 100 ca suy gan cấp và tử vong được báo cáo toàn cầu, dẫn đến lệnh cấm tại Đức, Thụy Sĩ, Canada. Kết hợp với rượu hoặc thuốc an thần → tăng nguy cơ ức chế hô hấp.',
      'Aristolochic acid (mộc thông, phòng kỷ, một số bài thuốc đông y): chất độc thận cực mạnh và là chất gây ung thư (nhóm 1 IARC). Đã gây ra hàng ngàn ca suy thận mãn tính ở Bỉ (Belgian herbal nephropathy) và nhiều quốc gia châu Á. Hiện bị cấm ở nhiều nước nhưng vẫn lưu hành ở một số thị trường.',
      'Pyrrolizidine alkaloids (PA) trong comfrey, coltsfoot, borage: chất độc gan gây viêm tắc tĩnh mạch gan (hepatic veno-occlusive disease), đặc biệt nguy hiểm ở trẻ em và phụ nữ mang thai. Comfrey từng được dùng rộng rãi tại Việt Nam và châu Á.',
      'Ô nhiễm và giả mạo trong thảo dược: nhiều nghiên cứu phân tích TPCN thảo dược phát hiện kim loại nặng (chì, thủy ngân, asen — đặc biệt trong thuốc đông y nhập từ Trung Quốc), thành phần dược phẩm ẩn (sildenafil trong thuốc tăng cường sinh lý, corticosteroid trong thuốc chữa viêm khớp), và hoạt chất không được công bố.',
      'Tương tác thảo dược với thuốc kê đơn thường gặp tại Việt Nam: tỏi liều cao + warfarin → tăng chảy máu; gừng + aspirin → tăng chảy máu; nhân sâm + warfarin → ảnh hưởng INR; dầu cá > 3g/ngày + warfarin → tăng nguy cơ chảy máu. Luôn thông báo cho bác sĩ tất cả thảo dược đang dùng.',
    ],
    points: [
      { icon: '🌱', label: 'St. John\'s Wort giảm thuốc HIV 57%', note: 'Cũng vô hiệu hóa thuốc tránh thai, warfarin, cyclosporine' },
      { icon: '⚗️', label: 'Kava → suy gan cấp, bị cấm nhiều nước', note: 'Kết hợp với rượu/an thần → nguy cơ ức chế hô hấp' },
      { icon: '🧪', label: 'Aristolochic acid → suy thận mãn, ung thư', note: 'Nhóm 1 IARC — chất gây ung thư đã được xác nhận' },
      { icon: '⚠️', label: 'TPCN thảo dược: kiểm tra nguồn gốc', note: 'Ô nhiễm kim loại nặng và hoạt chất ẩn phổ biến hơn bạn nghĩ' },
    ],
  },
  {
    icon: '🦠', phrase: '"Kháng sinh uống vài ngày thấy khỏi thì thôi"',
    risk: 'Kháng kháng sinh — vi khuẩn sống sót phát triển đề kháng, lần sau khó điều trị hơn',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '🦠 Việt Nam nằm trong top các quốc gia có tỷ lệ đề kháng kháng sinh cao nhất thế giới. Ngưng kháng sinh sớm khi "thấy đỡ" là một trong các nguyên nhân chính tạo ra siêu vi khuẩn kháng thuốc.',
    details: [
      'Tại sao triệu chứng hết sớm hơn vi khuẩn bị tiêu diệt: hệ miễn dịch và kháng sinh cùng chiến đấu — triệu chứng cải thiện khi vi khuẩn giảm xuống dưới ngưỡng gây bệnh, nhưng vẫn còn vi khuẩn sống sót có khả năng đề kháng. Những vi khuẩn này phát triển mạnh khi ngưng kháng sinh.',
      'Cơ chế chọn lọc kháng thuốc (selective pressure): quần thể vi khuẩn luôn có biến thể ngẫu nhiên. Kháng sinh tiêu diệt vi khuẩn nhạy cảm, chừa lại những vi khuẩn có đặc tính đề kháng. Nếu ngưng quá sớm, những vi khuẩn đề kháng này nhân lên và trở thành chủng mới khó điều trị.',
      'Tình trạng đề kháng tại Việt Nam: nghiên cứu ASTS và GARP-Vietnam ghi nhận MRSA (Staphylococcus aureus kháng methicillin) chiếm 30–40% mẫu phân lập; E. coli kháng fluoroquinolone > 60%; Klebsiella pneumoniae kháng carbapenem ngày càng tăng — kháng sinh "cuối tuyến" dần mất hiệu lực.',
      'Kháng sinh không diệt virus — nguyên nhân đề kháng phổ biến: 70–80% cảm lạnh, cúm thông thường, và viêm họng là do virus. Kháng sinh hoàn toàn vô dụng với virus nhưng vẫn giết vi khuẩn có ích trong đường ruột, tạo cơ hội cho vi khuẩn đề kháng chiếm chỗ.',
      'Kháng sinh time-dependent vs concentration-dependent: nhóm time-dependent (penicillin, amoxicillin, cephalosporin, metronidazole) hiệu quả khi nồng độ duy trì trên MIC trong suốt khoảng cách liều. Uống trễ 2–4 giờ → nồng độ tụt dưới MIC → vi khuẩn phát triển trong khoảng thời gian đó. Đây là lý do phải uống đúng giờ và đủ liệu trình.',
      'Siêu vi khuẩn và hậu quả toàn cầu: WHO tuyên bố đề kháng kháng sinh là một trong 10 mối đe dọa sức khỏe toàn cầu lớn nhất. Ước tính đến 2050, đề kháng kháng sinh có thể gây 10 triệu ca tử vong/năm — vượt qua ung thư. Mỗi lần ngưng kháng sinh sớm là góp phần vào khủng hoảng toàn cầu này.',
    ],
    points: [
      { icon: '⏱️', label: 'Hết triệu chứng ≠ hết vi khuẩn', note: 'Vi khuẩn đề kháng vẫn còn — ngưng sớm để chúng sinh sôi' },
      { icon: '🇻🇳', label: 'Việt Nam: MRSA 30–40%, E.coli kháng FQ 60%+', note: 'Top đề kháng kháng sinh cao nhất thế giới' },
      { icon: '🦠', label: 'Virus không cần kháng sinh', note: '70–80% cảm/cúm/viêm họng là do virus — kháng sinh vô dụng' },
      { icon: '💀', label: 'Đến 2050: 10 triệu người/năm vì siêu vi khuẩn', note: 'Mỗi lần dùng sai kháng sinh góp phần vào khủng hoảng toàn cầu' },
    ],
  },
  {
    icon: '🔥', phrase: '"Paracetamol an toàn, uống nhiều không sao"',
    risk: 'Paracetamol > 4g/ngày (người bình thường) hoặc > 2g/ngày (uống rượu nhiều) → suy gan cấp',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80',
    keyFact: '⚠️ Paracetamol là nguyên nhân hàng đầu gây suy gan cấp tính tại Mỹ, Anh và nhiều nước phát triển — không phải vì người ta cố ý dùng nhiều, mà vì vô tình cộng dồn từ nhiều nguồn khác nhau.',
    details: [
      'Cơ chế độc gan (hepatotoxicity): ở liều bình thường, paracetamol được glucuronide hóa và sulfate hóa an toàn. Khi quá liều, hai con đường này bão hòa → CYP2E1 chuyển hóa tạo ra NAPQI (N-acetyl-p-benzoquinoneimine) — chất cực độc. Glutathione dùng để trung hòa NAPQI cạn kiệt nhanh → NAPQI liên kết với protein tế bào gan → hoại tử tế bào gan.',
      'Giới hạn an toàn: người bình thường khỏe mạnh — tối đa 4g/ngày (8 viên 500mg), chia đều mỗi 6 giờ. Người uống rượu thường xuyên — tối đa 2g/ngày vì CYP2E1 đã tăng hoạt và glutathione cạn kiệt do rượu. Người suy gan, thiếu dinh dưỡng nặng, đang nhịn ăn kéo dài — cũng cần giảm liều.',
      'Nguy hiểm ẩn: paracetamol có trong hàng trăm thuốc kết hợp không kê đơn — thuốc cảm cúm (Panadol Cold, Decolgen), thuốc ho, thuốc ngủ kết hợp, thuốc giảm đau liều cao. Người uống 2 viên Panadol + 1 gói Decolgen + 1 viên Efferalgan = đã gần đến giới hạn 4g/ngày mà không biết.',
      'Dấu hiệu ngộ độc theo giai đoạn: Giai đoạn 1 (0–24h): buồn nôn, nôn, mệt — dễ bị xem là triệu chứng bình thường. Giai đoạn 2 (24–72h): đau hạ sườn phải, men gan tăng. Giai đoạn 3 (72–96h): suy gan cấp, vàng da, rối loạn đông máu, có thể tử vong. Giai đoạn 4: hồi phục hoặc tử vong/ghép gan.',
      'Cửa sổ điều trị hẹp: N-acetylcysteine (NAC) là thuốc giải độc hiệu quả nếu dùng trong 8–10 giờ đầu sau uống quá liều — hiệu quả giảm mạnh sau 24 giờ. Đây là lý do phải đến cấp cứu ngay khi nghi ngờ, không chờ triệu chứng rõ ràng.',
      'Lời khuyên thực tế: luôn đọc nhãn tất cả thuốc đang uống để tìm "paracetamol", "acetaminophen" (tên ở Mỹ), "APAP". Nếu uống nhiều hơn 1 loại thuốc chứa paracetamol, cộng tổng liều lại. Không uống rượu trong vòng 24 giờ trước/sau khi dùng paracetamol liều cao.',
    ],
    points: [
      { icon: '🧬', label: 'NAPQI phá hủy tế bào gan — không hồi phục', note: 'Glutathione cạn trong 8–10 giờ — cửa sổ điều trị rất hẹp' },
      { icon: '📦', label: 'Nhiều thuốc cùng chứa paracetamol', note: 'Decolgen + Panadol + Efferalgan = gần đến giới hạn 4g/ngày' },
      { icon: '🍷', label: 'Uống rượu: giới hạn chỉ còn 2g/ngày', note: 'CYP2E1 tăng hoạt → tạo NAPQI nhiều hơn, glutathione ít hơn' },
      { icon: '⏰', label: 'Cấp cứu trong 8–10 giờ đầu — N-acetylcysteine', note: 'Sau 24h: NAC giảm hiệu quả mạnh — không đợi triệu chứng' },
    ],
  },
  {
    icon: '💊', phrase: '"Vitamin uống bao nhiêu cũng được"',
    risk: 'Vitamin A, D, E, K (tan trong dầu) tích lũy → độc liều cao. Vitamin A: > 10.000 IU/ngày gây dị tật thai',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
    keyFact: '💊 Vitamin tan trong nước (B, C) được thải qua nước tiểu nếu thừa — tương đối an toàn ở liều cao. Nhưng vitamin tan trong dầu (A, D, E, K) tích lũy trong mô mỡ và gan, gây độc khi dùng kéo dài ở liều cao.',
    details: [
      'Vitamin A (retinol) — chất gây dị tật thai hàng đầu: liều > 10.000 IU/ngày ở phụ nữ mang thai (đặc biệt 3 tháng đầu) tăng nguy cơ dị tật tim, mạch máu lớn, sứt môi hở hàm ếch, dị tật thần kinh. Isotretinoin (thuốc trị mụn Accutane) — dạng tổng hợp vitamin A — yêu cầu hai biện pháp tránh thai vì nguy cơ dị tật cực cao. Người lớn: ngộ độc cấp (> 150.000 IU một lần) gây buồn nôn, nhức đầu; mãn tính (> 15.000 IU/ngày kéo dài) gây loãng xương, tổn thương gan.',
      'Vitamin D — "thần dược" bị lạm dụng: mức an toàn tối đa (UL) của WHO là 4.000 IU/ngày cho người lớn. Nhiều người tự uống 10.000–50.000 IU/ngày mà không theo dõi nồng độ. Hypervitaminosis D → hypercalcemia (calci máu cao) → buồn nôn, khát nước, tiểu nhiều, sỏi thận, vôi hóa thận và mạch máu, rối loạn nhịp tim. Cần đo 25(OH)D máu để biết liều phù hợp.',
      'Vitamin E liều cao và đông máu: nghiên cứu HOPE-TOO cho thấy vitamin E > 400 IU/ngày tăng nguy cơ suy tim và tử vong do tất cả nguyên nhân. Vitamin E ức chế kết tập tiểu cầu và tương tác với warfarin → tăng chảy máu. Cần ngưng vitamin E > 400 IU ít nhất 2 tuần trước phẫu thuật.',
      'Vitamin B6 (pyridoxine) và bệnh thần kinh ngoại vi: đây là vitamin tan trong nước nhưng vẫn có độc liều cao. B6 > 500mg/ngày kéo dài → neuropathy ngoại vi (tê, đau, mất cảm giác ở tay chân), có thể mất khả năng đi lại. Tổn thương thần kinh có thể không hồi phục sau khi ngưng.',
      'Vitamin C liều cao (> 2g/ngày): mặc dù ít nguy hiểm hơn, liều cao làm tăng oxalate niệu → sỏi thận (đặc biệt ở người có tiền sử sỏi thận). Cũng có thể tăng hấp thu sắt quá mức ở người bị hemochromatosis. Và do "rebound scurvy": khi ngưng đột ngột sau dùng liều cao kéo dài, cơ thể tiếp tục đào thải nhanh → thiếu vitamin C tạm thời.',
      'Nguyên tắc chung: bổ sung vitamin chỉ khi có bằng chứng thiếu hụt (xét nghiệm máu) hoặc nhu cầu tăng (mang thai, bệnh hấp thu kém, chế độ ăn hạn chế đặc biệt). "Phòng ngừa" bằng liều cao mà không theo dõi là không cần thiết và có thể gây hại. Thực phẩm đa dạng là nguồn vitamin tốt nhất và an toàn nhất.',
    ],
    points: [
      { icon: '🤰', label: 'Vitamin A > 10.000 IU → dị tật thai', note: 'Tuyệt đối không dùng liều cao khi mang thai hoặc chuẩn bị mang thai' },
      { icon: '☀️', label: 'Vitamin D: đo 25(OH)D trước khi dùng liều cao', note: 'UL là 4.000 IU/ngày — không tự tăng lên 10.000–50.000 IU' },
      { icon: '🩸', label: 'Vitamin E > 400 IU: tăng chảy máu, ngưng trước mổ', note: 'Ức chế tiểu cầu + tương tác warfarin — ngưng 2 tuần trước phẫu thuật' },
      { icon: '🦵', label: 'Vitamin B6 > 500mg/ngày → liệt tay chân', note: 'Vitamin tan trong nước nhưng vẫn độc ở liều cao — tổn thương thần kinh' },
    ],
  },
  {
    icon: '📦', phrase: '"Thuốc bổ không cần đơn"',
    risk: 'TPCN không qua kiểm duyệt nghiêm ngặt như thuốc, có thể nhiễm kim loại nặng, tương tác thuốc',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1576107232684-1279f55f1e4f?w=800&q=80',
    keyFact: '📋 Tại hầu hết các quốc gia, thực phẩm chức năng (TPCN) không cần phải chứng minh hiệu quả trước khi được bán ra. Nhà sản xuất không bắt buộc phải báo cáo tác dụng phụ. FDA chỉ can thiệp sau khi có vấn đề xảy ra.',
    details: [
      'Khung pháp lý lỏng lẻo: tại Mỹ, Dietary Supplement Health and Education Act (DSHEA 1994) cho phép bán TPCN mà không cần chứng minh hiệu quả hay an toàn trước khi bán — ngược hoàn toàn với thuốc. Tại Việt Nam, TPCN được quản lý như thực phẩm, không như thuốc — tiêu chuẩn kiểm duyệt thấp hơn đáng kể.',
      'Ô nhiễm kim loại nặng: phân tích hàng ngàn mẫu TPCN từ nhiều nghiên cứu độc lập (ConsumerLab, NSF, AOAC) phát hiện 20–30% chứa chì, thủy ngân, cadmium, asen vượt mức an toàn. Rủi ro cao nhất: thuốc đông y nhập từ Trung Quốc và Ấn Độ, sản phẩm chiết xuất từ thực vật mọc ở đất ô nhiễm.',
      'Thành phần dược phẩm ẩn (undisclosed pharmaceutical ingredients): FDA đã phát hiện hàng trăm sản phẩm TPCN chứa hoạt chất dược phẩm không công bố — phổ biến nhất: sildenafil/tadalafil trong "thuốc tăng cường sinh lý nam", sibutramine (thuốc giảm cân đã bị thu hồi vì nguy cơ tim mạch), anabolic steroids trong sản phẩm tăng cơ, corticosteroid trong "thuốc xương khớp" thảo dược.',
      'Tương tác thực sự với thuốc kê đơn: dầu cá > 3g/ngày + warfarin → tăng nguy cơ chảy máu; CoQ10 + warfarin → ảnh hưởng INR; canxi + levothyroxine → giảm hấp thu hormone tuyến giáp; kẽm liều cao → cản trở hấp thu đồng → thiếu đồng; sắt + hầu hết kháng sinh → giảm hấp thu kháng sinh. Không bao giờ coi TPCN là "vô hại với thuốc".',
      'Tiêu chuẩn chất lượng đáng tin cậy: tìm nhãn bên thứ ba độc lập — NSF International, USP Verified, ConsumerLab, Informed-Sport. Các nhãn này chứng nhận sản phẩm chứa đúng thành phần ghi trên nhãn, không ô nhiễm, và không chứa chất bị cấm (quan trọng với vận động viên). Không có nghĩa là "hiệu quả" — chỉ là "sạch".',
      'Quy tắc vàng: luôn thông báo với bác sĩ và dược sĩ tất cả TPCN đang dùng, ngay cả "chỉ là vitamin" hay "thảo dược tự nhiên". Đặc biệt quan trọng trước phẫu thuật, khi điều chỉnh thuốc mãn tính, và khi mang thai. Bác sĩ không thể giúp bạn nếu không biết đủ thông tin.',
    ],
    points: [
      { icon: '📜', label: 'TPCN không cần chứng minh hiệu quả', note: 'FDA/Bộ Y tế VN: TPCN bán ra không cần thử nghiệm lâm sàng trước' },
      { icon: '☠️', label: '20–30% TPCN chứa kim loại nặng vượt ngưỡng', note: 'Đặc biệt: thuốc đông y nhập từ Trung Quốc, Ấn Độ' },
      { icon: '💉', label: 'Hoạt chất ẩn: sildenafil, steroid, sibutramine', note: 'FDA đã phát hiện hàng trăm sản phẩm "thảo dược" chứa thuốc thật' },
      { icon: '🔍', label: 'Tìm nhãn NSF / USP Verified / ConsumerLab', note: 'Chứng nhận độc lập = sản phẩm sạch, đúng thành phần (không = hiệu quả)' },
    ],
  },
];

const SUPPLEMENT_CHECK = [
  {
    icon: '🐟', label: 'Omega-3',
    note: 'Giảm TG, an toàn. Liều > 3g/ngày: ảnh hưởng đông máu — báo bác sĩ trước mổ.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '🐟 Omega-3 từ dầu cá (EPA + DHA) có bằng chứng lâm sàng mạnh nhất về giảm triglyceride và chống viêm. ALA từ thực vật (hạt lanh, chia) hấp thu kém — chỉ 5–15% được chuyển hóa thành EPA/DHA.',
    details: [
      'EPA vs DHA: EPA (eicosapentaenoic acid) hiệu quả hơn với chống viêm và trầm cảm. DHA quan trọng hơn cho não, mắt và phát triển thai nhi. Sản phẩm tốt nên chứa cả hai. Liều điều trị triglyceride cao: 2–4g EPA+DHA/ngày (kê đơn).',
      'Giảm triglyceride: omega-3 liều cao (2–4g/ngày) giảm triglyceride 20–30% — hiệu quả nhất trong các TPCN. Cơ chế: ức chế tổng hợp VLDL ở gan, tăng thanh thải triglyceride. Icosapent ethyl (Vascepa) — dạng EPA tinh khiết kê đơn — giảm biến cố tim mạch 25% trong nghiên cứu REDUCE-IT.',
      'Tương tác đông máu: omega-3 > 3g/ngày ức chế kết tập tiểu cầu và kéo dài thời gian chảy máu. Kết hợp với aspirin, warfarin, hoặc clopidogrel → tăng nguy cơ chảy máu đáng kể. Cần ngưng ít nhất 1–2 tuần trước phẫu thuật. Thông báo với bác sĩ và gây mê.',
      'Chất lượng sản phẩm — quan trọng hơn bạn nghĩ: dầu cá dễ bị oxy hóa → mất hiệu lực và tạo sản phẩm oxy hóa có hại. Dấu hiệu dầu cá tốt: mùi tanh nhẹ (không hôi), IFOS 5 sao hoặc NSF certified, hàm lượng EPA+DHA ghi rõ (không chỉ "dầu cá"), được bảo quản trong tủ lạnh sau khi mở. Cá nhỏ (cá cơm, cá mòi) có ít thủy ngân hơn cá lớn.',
      'Ăn cá vs uống viên: 2–3 bữa cá béo/tuần (cá hồi, cá thu, cá ngừ, cá mòi) cung cấp đủ omega-3 cho người khỏe mạnh. TPCN chỉ cần thiết khi không ăn đủ cá hoặc cần liều điều trị cao. Cá nguyên con còn cung cấp protein, selen, và vitamin D — viên omega-3 không thay thế được điều này.',
      'Omega-3 với thai kỳ: DHA đặc biệt quan trọng cho phát triển não và mắt thai nhi trong 3 tháng cuối và sau sinh. Phụ nữ mang thai nên ăn 2–3 bữa cá ít thủy ngân/tuần và/hoặc bổ sung DHA 200–300mg/ngày. Tránh cá có thủy ngân cao: cá kiếm, cá mập, cá thu vua.',
    ],
    points: [
      { icon: '📉', label: 'Giảm TG 20–30% ở liều 2–4g/ngày', note: 'Hiệu quả nhất trong các TPCN về tim mạch' },
      { icon: '🩸', label: '> 3g/ngày: báo bác sĩ trước phẫu thuật', note: 'Ngưng 1–2 tuần trước mổ — ức chế tiểu cầu' },
      { icon: '🐟', label: 'EPA cho viêm/tâm trạng, DHA cho não/mắt', note: 'Chọn sản phẩm ghi rõ mg EPA + mg DHA riêng biệt' },
      { icon: '🧊', label: 'Bảo quản lạnh sau khi mở — tránh oxy hóa', note: 'Mùi hôi = dầu cá đã oxy hóa — không nên dùng' },
    ],
  },
  {
    icon: '☀️', label: 'Vitamin D3',
    note: 'Thiếu phổ biến. Liều 1.000–2.000 IU/ngày an toàn. Kiểm tra 25(OH)D máu trước bổ sung liều cao.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    keyFact: '☀️ Ước tính 70–80% người Việt Nam thiếu vitamin D do lối sống trong nhà, kem chống nắng, và ánh mặt trời ít hiệu quả gần xích đạo vào buổi trưa. Thiếu D liên quan đến loãng xương, suy giảm miễn dịch, và rối loạn tâm trạng.',
    details: [
      'D2 vs D3: Vitamin D3 (cholecalciferol, từ động vật/ánh nắng) hiệu quả hơn D2 (ergocalciferol, từ thực vật) trong tăng và duy trì 25(OH)D máu — được khuyến nghị ưu tiên. Chỉ số xét nghiệm: 25-hydroxyvitamin D [25(OH)D]. Mức tối ưu: 40–60 ng/mL (100–150 nmol/L).',
      'Ánh nắng và tổng hợp vitamin D: UVB (290–315nm) kích thích tổng hợp vitamin D3 ở da. Gần xích đạo (Việt Nam), UVB có quanh năm nhưng chỉ đủ mạnh vào khoảng 10h–14h. 10–15 phút nắng/ngày trên da mặt+tay (không kem chống nắng) đủ cho người da trắng; người da tối cần lâu hơn. Kem chống nắng SPF 30 giảm 95–98% tổng hợp vitamin D.',
      'Liều bổ sung theo nhu cầu: phòng ngừa ở người khỏe mạnh — 1.000–2.000 IU/ngày. Nâng nhanh nồng độ khi thiếu trung bình — 4.000 IU/ngày có thể dùng 2–3 tháng rồi kiểm tra lại. Giới hạn an toàn UL (Tolerable Upper Intake Level) của WHO — 4.000 IU/ngày cho người lớn. Không tự dùng > 4.000 IU/ngày mà không theo dõi xét nghiệm.',
      'Vitamin D3 và K2 — cặp đôi hoàn hảo: vitamin D tăng hấp thu canxi từ ruột; vitamin K2 (MK-7) định hướng canxi vào xương thay vì lắng đọng ở thành mạch máu (vôi hóa). Nhiều nghiên cứu gợi ý dùng D3+K2 cùng nhau để tối ưu sức khỏe xương và giảm nguy cơ tim mạch. Liều K2 thường 100–200 mcg/ngày.',
      'Vitamin D và sức khỏe toàn diện: ngoài xương, vitamin D ảnh hưởng đến hệ miễn dịch (giảm nguy cơ nhiễm trùng đường hô hấp), tâm trạng (deficiency liên quan đến trầm cảm theo mùa), kiểm soát đường huyết, và có thể giảm nguy cơ một số ung thư. Tuy nhiên, bổ sung D ở người đã đủ không mang lại thêm lợi ích.',
      'Ngộ độc vitamin D (hypervitaminosis D): xảy ra khi > 10.000 IU/ngày kéo dài nhiều tháng → 25(OH)D > 150 ng/mL → hypercalcemia → buồn nôn, khát, tiểu nhiều, sỏi thận, vôi hóa thận và mạch. Không có nguy cơ ngộ độc từ ánh nắng — da tự điều chỉnh. Nguy cơ từ viên uống liều cao mà không theo dõi.',
    ],
    points: [
      { icon: '🔬', label: 'Đo 25(OH)D máu trước khi tăng liều', note: 'Mức tối ưu: 40–60 ng/mL — không đoán mò liều' },
      { icon: '🦴', label: 'D3 + K2 (MK-7): combo tốt nhất cho xương', note: 'K2 định hướng canxi vào xương, không lắng ở mạch máu' },
      { icon: '⚠️', label: 'Giới hạn an toàn: 4.000 IU/ngày (UL)', note: 'Không tự dùng > 4.000 IU mà không theo dõi xét nghiệm' },
      { icon: '☀️', label: '10–15 phút nắng/ngày = nguồn D tốt nhất', note: 'Không kem chống nắng, da mặt+tay, 10h–14h tại Việt Nam' },
    ],
  },
  {
    icon: '🌿', label: 'Magie',
    note: 'Giúp ngủ, giảm chuột rút. Magie glycinate/citrate hấp thu tốt. Liều > 350mg/ngày → tiêu chảy.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    keyFact: '🌿 Magie tham gia vào hơn 300 phản ứng enzyme trong cơ thể — bao gồm tổng hợp ATP, tổng hợp DNA/RNA, và điều tiết ion canxi/kali. Thiếu magie âm thầm rất phổ biến nhưng khó phát hiện qua xét nghiệm máu thông thường (99% magie nằm trong tế bào, không trong máu).',
    details: [
      'Các dạng magie và sự khác biệt quan trọng: Magie glycinate (bisglycinate) — hấp thu tốt nhất, dịu dạ dày nhất, tốt nhất cho giảm lo âu và cải thiện giấc ngủ. Magie citrate — hấp thu tốt, tác dụng nhẹ làm mềm phân (hữu ích cho người táo bón). Magie oxide — hấp thu kém (4%), chủ yếu dùng làm thuốc nhuận tràng, không hiệu quả để tăng magie tế bào. Magie L-threonate — có thể vượt hàng rào máu-não tốt hơn, nghiên cứu sơ bộ về nhận thức.',
      'Vai trò trong giấc ngủ và thư giãn thần kinh: magie điều tiết thụ thể GABA (chất dẫn truyền thần kinh ức chế) và ức chế thụ thể NMDA (glutamate kích thích). Thiếu magie → tăng kích thích thần kinh → khó ngủ, lo lắng, cơ bắp co cứng. Liều 200–400mg glycinate buổi tối giúp thư giãn và cải thiện chất lượng giấc ngủ.',
      'Chuột rút cơ bắp: magie cần thiết cho thư giãn cơ (canxi gây co, magie gây giãn). Thiếu magie → chuột rút về đêm, đặc biệt ở bắp chân. Cũng phổ biến ở người tập thể thao nặng (mất qua mồ hôi), phụ nữ mang thai, người dùng lợi tiểu (furosemide, thiazide), và người uống rượu nhiều.',
      'Nguồn thực phẩm giàu magie: hạt bí ngô (535mg/100g), hạt lanh (392mg), hạnh nhân (270mg), điều (292mg), đậu đen (70mg/100g nấu chín), rau bina (87mg/100g nấu), socola đen > 70% (228mg/100g). Người ăn đa dạng thực phẩm nguyên chất thường đủ magie từ thực phẩm.',
      'Giới hạn bổ sung và tác dụng phụ: UL của WHO cho magie từ bổ sung (không tính từ thực phẩm) là 350mg/ngày cho người lớn. Liều cao → tiêu chảy thẩm thấu (đặc biệt oxide và citrate). Người suy thận không được tự bổ sung magie — thận không đào thải được → nguy cơ ngộ độc (nhịp tim chậm, ức chế hô hấp).',
      'Magie và thuốc kê đơn: magie giảm hấp thu bisphosphonate (thuốc loãng xương — phải uống cách nhau ≥ 2 giờ), fluoroquinolone và tetracycline (uống cách ≥ 2 giờ), và levothyroxine. Magie tăng cường tác dụng của thuốc giãn cơ và an thần — thận trọng khi dùng cùng.',
    ],
    points: [
      { icon: '💊', label: 'Glycinate = hấp thu tốt + dịu dạ dày', note: 'Tốt nhất cho giấc ngủ và lo âu — tránh dùng oxide' },
      { icon: '😴', label: 'GABA + NMDA: thư giãn thần kinh tự nhiên', note: '200–400mg glycinate buổi tối giúp ngủ sâu hơn' },
      { icon: '🚿', label: '> 350mg/ngày (từ viên): có thể gây tiêu chảy', note: 'Chia nhỏ liều và tăng từ từ để tránh tác dụng phụ tiêu hóa' },
      { icon: '⚠️', label: 'Suy thận: không tự bổ sung magie', note: 'Thận suy không đào thải → tích lũy → ngộ độc magie' },
    ],
  },
  {
    icon: '🦠', label: 'Probiotics',
    note: 'Hỗ trợ đường ruột sau kháng sinh. Uống cách kháng sinh 2 giờ.',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&q=80',
    keyFact: '🦠 Hệ vi sinh đường ruột (gut microbiome) chứa hơn 100 nghìn tỷ vi khuẩn — gấp 10 lần số tế bào người — và tham gia vào tiêu hóa, miễn dịch, tổng hợp vitamin, và thậm chí tâm trạng qua trục não-ruột.',
    details: [
      'Không phải "probiotic" nào cũng như nhau — chủng loài quyết định tất cả: Lactobacillus rhamnosus GG (LGG) — nghiên cứu nhiều nhất, bằng chứng mạnh nhất về tiêu chảy liên quan kháng sinh và tiêu chảy du lịch. Bifidobacterium longum — hỗ trợ phục hồi sau kháng sinh ở ruột già. Saccharomyces boulardii — nấm men, không bị kháng sinh tiêu diệt, hiệu quả với tiêu chảy C. difficile. Lactobacillus acidophilus NCFM — hỗ trợ miễn dịch và giảm đầy hơi.',
      'Uống cách kháng sinh 2 giờ — tại sao quan trọng: kháng sinh tiêu diệt cả vi khuẩn probiotic nếu uống cùng lúc. Uống probiotic trước kháng sinh 1–2 giờ hoặc sau kháng sinh 2 giờ để vi khuẩn probiotic sống sót đến ruột. Tiếp tục uống probiotic thêm 1–2 tuần sau khi hoàn thành liệu trình kháng sinh để giúp hệ vi sinh phục hồi.',
      'CFU (Colony Forming Units) — đơn vị đo lường: liều từ 1–10 tỷ CFU/ngày phổ biến nhất. Liều cao hơn không nhất thiết hiệu quả hơn — chủng quan trọng hơn số lượng. Một số sản phẩm ghi hàng tỷ CFU nhưng ở chủng không có bằng chứng — marketing hơn là khoa học.',
      'Bảo quản và sinh tồn: nhiều probiotic cần bảo quản lạnh (2–8°C) để vi khuẩn sống sót. Một số dòng "shelf-stable" được sấy đông khô, ổn định ở nhiệt độ phòng. Kiểm tra ngày hết hạn — probiotic chứa vi khuẩn sống, số lượng giảm dần theo thời gian. Uống sau bữa ăn (không lúc đói) giúp vi khuẩn sống sót qua axit dạ dày.',
      'Bằng chứng lâm sàng — đâu có, đâu không: CÓ bằng chứng tốt: phòng ngừa và điều trị tiêu chảy liên quan kháng sinh (NNT = 6), hội chứng ruột kích thích (IBS), đầy hơi chức năng, tăng cường miễn dịch mùa đông. BẰNG CHỨNG YẾU/CHƯA ĐỦ: eczema ở người lớn, bệnh Crohn đang hoạt động, giảm cân, cải thiện tâm trạng (nghiên cứu sơ bộ).',
      'Prebiotic — thức ăn cho probiotic: prebiotic là chất xơ đặc biệt (inulin, FOS, GOS, pectin) nuôi vi khuẩn có lợi trong ruột. Nguồn tự nhiên: tỏi, hành tây, chuối chín, yến mạch, củ artichoke. Probiotic mà không có prebiotic giống như trồng cây nhưng không tưới nước. Nhiều sản phẩm kết hợp cả hai gọi là "synbiotic".',
    ],
    points: [
      { icon: '⏰', label: 'Uống cách kháng sinh 2 giờ — không cùng lúc', note: 'Tiếp tục 1–2 tuần sau khi hoàn thành kháng sinh' },
      { icon: '🔬', label: 'LGG và S. boulardii: bằng chứng mạnh nhất', note: 'Chủng quan trọng hơn số tỷ CFU trên nhãn' },
      { icon: '🌡️', label: 'Bảo quản lạnh 2–8°C (hầu hết dòng)', note: 'Uống sau bữa ăn để sống sót qua axit dạ dày' },
      { icon: '🌱', label: 'Prebiotic = thức ăn cho probiotic', note: 'Tỏi, hành, chuối, yến mạch nuôi vi khuẩn có lợi' },
    ],
  },
  {
    icon: '🩸', label: 'Sắt',
    note: 'Chỉ bổ sung khi có chỉ định thiếu máu. Thừa sắt gây táo bón, có hại cho gan.',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    keyFact: '🩸 Thừa sắt (hemochromatosis) nguy hiểm ngang thiếu sắt — tích lũy sắt ở gan, tim, tuyến tụy gây xơ gan, suy tim, và đái tháo đường. Không tự bổ sung sắt mà không có xét nghiệm chỉ định.',
    details: [
      'Xét nghiệm chẩn đoán thiếu sắt: không chỉ đo hemoglobin (Hb) — Hb thấp là hậu quả muộn. Cần đo ferritin (dự trữ sắt) và transferrin saturation. Ferritin < 15 ng/mL = cạn dự trữ. Ferritin < 30 ng/mL + triệu chứng mệt mỏi, rụng tóc, khó tập trung = thiếu sắt chức năng (dù Hb còn bình thường). Ferritin > 200 ng/mL (nữ) hoặc > 300 ng/mL (nam) = cần kiểm tra thừa sắt.',
      'Các dạng sắt và hấp thu: Ferrous sulfate (sắt sulfat) — rẻ nhất, phổ biến nhất, hấp thu tốt nhưng gây táo bón và buồn nôn nhiều nhất. Ferrous gluconate — dịu dạ dày hơn, hấp thu tương đương. Ferrous bisglycinate (sắt glycinate chelate) — hấp thu tốt nhất, ít tác dụng phụ tiêu hóa nhất — đắt hơn. Ferric (sắt 3+) như ferric carboxymaltose (Ferinject) — IV cho thiếu máu nặng.',
      'Tối đa hóa hấp thu sắt: uống lúc đói hoặc với vitamin C (tăng hấp thu 2–3 lần). TRÁNH uống cùng: sữa và các sản phẩm từ sữa (canxi ức chế), trà/cà phê (tannin chelate sắt), antacid chứa Ca/Mg/Al, kháng sinh fluoroquinolone và tetracycline (cách nhau ≥ 2 giờ). Uống cách bữa ăn 30 phút trước hoặc 2 giờ sau nếu dung nạp được.',
      'Tác dụng phụ tiêu hóa và xử lý: táo bón, buồn nôn, phân đen (bình thường) là phổ biến nhất. Chiến lược giảm: bắt đầu liều thấp rồi tăng dần; uống sau bữa ăn nếu không chịu được lúc đói (giảm hấp thu nhưng dung nạp tốt hơn); thử ferrous gluconate hoặc bisglycinate nếu sulfate gây vấn đề; tăng chất xơ và nước trong thời gian bổ sung.',
      'Hemochromatosis di truyền (hereditary hemochromatosis): bệnh di truyền lặn do đột biến gen HFE — cơ thể hấp thu sắt quá mức không điều chỉnh được. Phổ biến ở người gốc Bắc Âu (1/200–300 người). Tích lũy sắt ở gan (xơ gan), tim (rối loạn nhịp, suy tim), khớp (viêm khớp), tuyến tụy (đái tháo đường). Điều trị đơn giản: phlebotomy (lấy máu) định kỳ.',
      'Nhóm đặc biệt cần lưu ý: phụ nữ mang thai — nhu cầu tăng 27mg/ngày (từ 18mg), kiểm tra ferritin đầu thai kỳ. Phụ nữ tiền mãn kinh mất máu kinh nguyệt nhiều — kiểm tra ferritin thường xuyên. Vận động viên endurance (chạy bộ đường dài) — hemolysis (vỡ hồng cầu do va đập) gây mất sắt. Người ăn chay/thuần chay — sắt non-heme từ thực vật hấp thu kém hơn 2–3 lần so với sắt heme từ thịt.',
    ],
    points: [
      { icon: '🔬', label: 'Đo ferritin trước khi bổ sung', note: 'Hb thấp là hậu quả muộn — ferritin mới là chỉ số sớm' },
      { icon: '🍊', label: 'Vitamin C tăng hấp thu 2–3 lần', note: 'Uống cùng nước cam hoặc viên vitamin C — tránh trà/cà phê' },
      { icon: '💊', label: 'Bisglycinate: dịu dạ dày nhất', note: 'Ít táo bón và buồn nôn hơn sulfate — đáng giá chi phí thêm' },
      { icon: '⚠️', label: 'Thừa sắt → xơ gan, suy tim, tiểu đường', note: 'Không tự bổ sung sắt "cho chắc" — nguy cơ thực sự' },
    ],
  },
  {
    icon: '🦴', label: 'Canxi',
    note: 'Hấp thu tốt nhất từ thực phẩm. Bổ sung: canxi citrate tốt hơn carbonate. Không uống cùng sắt.',
    color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80',
    keyFact: '🦴 Cơ thể chỉ hấp thu tối đa 500–600mg canxi mỗi lần uống — chia nhỏ liều là bắt buộc. Uống > 1.000mg canxi bổ sung/ngày có thể tăng nguy cơ sỏi thận và có thể liên quan đến nguy cơ tim mạch.',
    details: [
      'Calcium carbonate vs calcium citrate — khác biệt thực sự: Carbonate (phổ biến, rẻ hơn) cần axit dạ dày để hòa tan — uống sau bữa ăn (khi dạ dày tiết axit nhiều nhất). Không phù hợp cho người dùng thuốc ức chế bơm proton (PPI như omeprazole) hoặc người cao tuổi (giảm axit dạ dày). Citrate (đắt hơn) hấp thu tốt ngay cả khi đói và không cần axit dạ dày — phù hợp hơn cho người > 50 tuổi, người dùng PPI, và người dạ dày yếu.',
      'Giới hạn hấp thu và chia liều: hệ vận chuyển canxi ở ruột bão hòa ở khoảng 500–600mg/liều. Uống 1.000mg một lần → chỉ hấp thu 300–350mg. Chia thành 2–3 lần 500mg/lần → hấp thu tổng cộng nhiều hơn. Thực phẩm canxi cao: sữa (120mg/100ml), sữa chua (150mg/100g), đậu hũ làm từ canxi sulfat (350mg/100g), cá hộp ăn cả xương (400mg/100g), rau xanh đậm (100–150mg/100g).',
      'Vitamin D3 và K2 — không thể thiếu: canxi bổ sung mà không có đủ vitamin D → hấp thu kém và hiệu quả xương thấp. Canxi + D3 mà không có K2 → canxi có thể lắng đọng ở thành mạch thay vì xương (một số nghiên cứu liên quan đến canxi bổ sung tăng nguy cơ vôi hóa động mạch). K2 (MK-7) kích hoạt osteocalcin và matrix Gla protein → định hướng canxi vào xương, không vào mạch.',
      'Tranh cãi về canxi bổ sung và tim mạch: phân tích tổng hợp của Bolland (2010, 2011) gợi ý canxi bổ sung > 1.000mg/ngày tăng nguy cơ nhồi máu cơ tim. Nghiên cứu sau đó cho kết quả mâu thuẫn. Consensus hiện tại: ưu tiên canxi từ thực phẩm, chỉ bổ sung khi thực sự thiếu, không vượt 500–600mg bổ sung/ngày, đảm bảo đủ K2 nếu bổ sung canxi liều cao.',
      'Tương tác với các thuốc và khoáng chất: canxi ức chế hấp thu sắt (không uống cùng), kẽm (uống cách nhau), và magie (cạnh tranh cùng transporter). Canxi cũng ảnh hưởng đến hấp thu tetracycline và fluoroquinolone (uống cách ≥ 2 giờ). Thiazide lợi tiểu giảm bài xuất canxi → tăng nguy cơ tăng canxi máu nếu bổ sung nhiều. Furosemide ngược lại — tăng mất canxi qua nước tiểu.',
      'Nhu cầu canxi theo tuổi và nhóm: Trẻ em 9–18 tuổi — 1.300mg/ngày (đang phát triển xương nhanh). Người lớn 19–50 tuổi — 1.000mg/ngày. Phụ nữ > 51 tuổi và nam > 70 tuổi — 1.200mg/ngày. Phụ nữ mang thai và cho con bú — 1.000mg/ngày (cơ thể điều chỉnh hấp thu). Tốt nhất lấy từ thực phẩm; bổ sung chỉ phần thiếu hụt.',
    ],
    points: [
      { icon: '⚖️', label: 'Tối đa 500mg mỗi lần — chia nhỏ liều', note: 'Hấp thu bão hòa ở 500–600mg/lần — uống 1.000mg/lần = lãng phí' },
      { icon: '💊', label: 'Citrate tốt hơn cho người > 50 tuổi / dùng PPI', note: 'Carbonate cần axit dạ dày — citrate hấp thu ngay cả khi đói' },
      { icon: '🧬', label: 'D3 + K2 không thể thiếu khi bổ sung canxi', note: 'K2 đưa canxi vào xương — không để lắng ở thành mạch' },
      { icon: '🍼', label: 'Thực phẩm trước — bổ sung phần thiếu hụt', note: 'Sữa, đậu hũ, cá hộp ăn xương, rau xanh đậm' },
    ],
  },
];

const DOCTOR_ITEMS = [
  {
    icon: '💊', label: 'Tất cả thuốc đang dùng',
    note: 'Kể cả OTC, vitamin, thảo dược — không phải chỉ thuốc kê đơn.',
    color: '#10b981', rgb: '16,185,129',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '💊 Tương tác thuốc-thuốc là nguyên nhân gây ra hàng chục nghìn ca nhập viện có thể phòng ngừa mỗi năm. Bác sĩ không thể kiểm tra tương tác nếu không biết đầy đủ danh sách thuốc đang dùng — kể cả OTC và thảo dược.',
    details: [
      'Tại sao OTC cũng quan trọng: aspirin, ibuprofen, antacid, thuốc cảm, thuốc ngủ không kê đơn đều có tương tác thực sự với thuốc kê đơn. Ibuprofen + ACE inhibitor → suy thận cấp. Aspirin + warfarin → tăng chảy máu nghiêm trọng. Antacid chứa nhôm/magie + fluoroquinolone → giảm hấp thu kháng sinh.',
      'Thực phẩm chức năng và thảo dược không phải "vô hại": St. John\'s Wort giảm nồng độ 50+ loại thuốc; dầu cá > 3g/ngày + warfarin → tăng chảy máu; CoQ10 ảnh hưởng INR; tỏi liều cao tác dụng chống đông. Nhiều người không khai báo vì nghĩ "chỉ là TPCN, bác sĩ không cần biết".',
      'Medication reconciliation — kiểm tra chéo danh sách thuốc: sai sót trong medication reconciliation (đối chiếu thuốc) là một trong các lỗi y khoa phổ biến nhất, đặc biệt khi chuyển viện, nhập viện, hoặc phẫu thuật. Bệnh nhân có danh sách thuốc đầy đủ giảm đáng kể nguy cơ sai sót.',
      'Cách chuẩn bị tốt nhất cho buổi khám: mang theo tất cả hộp/lọ thuốc đang dùng (hoặc chụp ảnh nhãn), kể cả vitamin, omega-3, magie, thảo dược. Nói rõ tần suất, liều dùng, và thời gian đã dùng. Cập nhật danh sách mỗi khi có thay đổi.',
      'Ứng dụng hữu ích: lưu danh sách thuốc trong điện thoại (ảnh hoặc ghi chú), hoặc dùng app như Medisafe, MyChart để theo dõi và chia sẻ với bác sĩ. Một số bệnh viện cho phép bệnh nhân cập nhật danh sách thuốc qua portal trước buổi khám.',
      'Nhóm cần đặc biệt thận trọng: người > 65 tuổi dùng ≥ 5 loại thuốc (polypharmacy) — nguy cơ tương tác tăng theo cấp số nhân; người khám nhiều bác sĩ chuyên khoa (mỗi bác sĩ chỉ biết phần của mình); người vừa xuất viện (danh sách thuốc thay đổi); người dùng thuốc narrow therapeutic index (warfarin, digoxin, phenytoin, lithium).',
    ],
    points: [
      { icon: '📋', label: 'Mang theo tất cả hộp/lọ thuốc khi khám', note: 'Kể cả vitamin và thảo dược — chụp ảnh nhãn nếu tiện hơn' },
      { icon: '⚠️', label: 'OTC tương tác với thuốc kê đơn', note: 'Ibuprofen + ACE inhibitor → suy thận; aspirin + warfarin → chảy máu' },
      { icon: '🌿', label: 'Thảo dược "tự nhiên" vẫn tương tác', note: 'St. John\'s Wort ảnh hưởng 50+ loại thuốc kê đơn' },
      { icon: '📱', label: 'Lưu danh sách thuốc trong điện thoại', note: 'Cập nhật mỗi khi có thay đổi — chia sẻ với mọi bác sĩ' },
    ],
  },
  {
    icon: '⚠️', label: 'Dị ứng thuốc đã gặp trước đây',
    note: 'Báo cả loại phản ứng, mức độ nặng nhẹ, không chỉ tên thuốc.',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    keyFact: '🚨 Phản vệ (anaphylaxis) do thuốc có thể gây tử vong trong vòng vài phút. Thông tin dị ứng không đầy đủ hoặc không chính xác có thể khiến bác sĩ tránh những thuốc an toàn, hoặc nguy hiểm hơn — dùng thuốc gây dị ứng chéo.',
    details: [
      'Phân biệt dị ứng thực sự, bất dung nạp, và tác dụng phụ: DỊ ỨNG (allergy): phản ứng miễn dịch IgE-mediated — mề đay, phù nề, khó thở, sốc phản vệ. BẤT DUNG NẠP (intolerance): không qua miễn dịch — buồn nôn, đau đầu, đau dạ dày với codeine, đỏ mặt với vancomycin (red man syndrome). TÁC DỤNG PHỤ dự đoán được — không phải dị ứng. Phân biệt quan trọng vì bác sĩ quản lý khác nhau.',
      'Phổ mức độ nghiêm trọng — cần báo rõ: NHẸ: phát ban giới hạn, ngứa không lan rộng → có thể thử premedication. TRUNG BÌNH: mề đay lan rộng, phù môi, buồn nôn/nôn → tránh thuốc đó, thận trọng với thuốc liên quan. NẶNG/PHẢN VỆ: khó thở, tụt huyết áp, mất ý thức → tránh tuyệt đối cả nhóm, ghi vào hồ sơ cấp cứu, đeo vòng cảnh báo.',
      'Dị ứng chéo quan trọng phải biết: Penicillin → cephalosporin thế hệ 1-2 (1–10% chéo); thế hệ 3-4 thấp hơn (<1%). Aspirin/NSAID → dị ứng chéo toàn nhóm NSAID ở người nhạy cảm (Samter\'s triad: polyp mũi + hen + nhạy cảm aspirin). Sulfonamide (sulfamethoxazole) → furosemide, thiazide, celecoxib (chia sẻ cấu trúc sulfonyl). Iodine/hải sản → không phải chống chỉ định thuốc cản quang iodine (misconception phổ biến — không liên quan cơ chế).',
      'Thông tin cần báo đầy đủ: tên thuốc gây dị ứng (brand và generic nếu biết), loại phản ứng (phát ban, khó thở, sưng, buồn nôn), thời gian phản ứng xảy ra sau khi uống (tức thì vs vài giờ vs vài ngày), mức độ nghiêm trọng (có phải đi cấp cứu không?), và điều trị đã dùng (tự hết vs cần antihistamine vs phải epinephrine).',
      'Penicillin allergy — vấn đề phổ biến bị hiểu sai: ~10% dân số báo cáo dị ứng penicillin, nhưng sau khi xét nghiệm chuẩn, chỉ 1% thực sự dị ứng. 90% người "dị ứng penicillin" thực ra an toàn khi dùng. Hậu quả của label sai: bác sĩ phải dùng kháng sinh thay thế đắt hơn, rộng phổ hơn, và kém hiệu quả hơn cho nhiều nhiễm khuẩn — góp phần đề kháng kháng sinh. Nếu nghi ngờ bị label sai, hỏi bác sĩ về skin testing để xác nhận.',
      'Vòng cảnh báo dị ứng và thẻ thông tin: người có tiền sử phản vệ nặng nên đeo MedicAlert bracelet và mang theo auto-injector epinephrine (EpiPen). Trong hồ sơ điện tử (EMR), dị ứng thuốc nên được cập nhật mỗi lần khám để hệ thống cảnh báo tự động khi bác sĩ kê đơn. Báo dị ứng rõ ràng với BẤT KỲ nhân viên y tế nào — kể cả nha sĩ và dược sĩ.',
    ],
    points: [
      { icon: '🔴', label: 'Báo loại phản ứng + mức độ nghiêm trọng', note: 'Phát ban nhẹ vs sốc phản vệ → bác sĩ quản lý hoàn toàn khác' },
      { icon: '🔄', label: 'Dị ứng chéo: penicillin → cephalosporin', note: 'Aspirin → tất cả NSAID; sulfa → furosemide, thiazide' },
      { icon: '💉', label: 'Phản vệ nặng: đeo vòng MedicAlert + EpiPen', note: 'Cập nhật dị ứng vào hồ sơ y tế ở mọi cơ sở điều trị' },
      { icon: '🧪', label: '90% "dị ứng penicillin" thực ra không dị ứng', note: 'Hỏi bác sĩ về skin testing nếu nghi ngờ label sai' },
    ],
  },
  {
    icon: '🤰', label: 'Đang mang thai hoặc cho con bú',
    note: 'Kể cả đang có kế hoạch mang thai — một số thuốc gây dị tật từ trước khi biết có thai.',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    keyFact: '🤰 Cửa sổ nhạy cảm nhất là tuần 2–8 của thai kỳ — thường trước khi người mẹ biết mình có thai. Một số thuốc gây dị tật nặng ngay cả khi dùng một liều duy nhất trong giai đoạn này.',
    details: [
      'Cửa sổ teratogenic quan trọng: Tuần 1–2: "all-or-nothing" — phôi chết hoặc phát triển bình thường. Tuần 3–8 (organogenesis): giai đoạn nguy hiểm nhất — tim, não, tủy sống, chi, mắt hình thành → thuốc gây dị tật tác động mạnh nhất. Tuần 9–40: cơ quan đã hình thành nhưng vẫn phát triển — thuốc có thể ảnh hưởng chức năng (không phải cấu trúc). Đây là lý do phải báo ngay cả "chỉ đang cố gắng mang thai".',
      'Thuốc tuyệt đối chống chỉ định khi mang thai (Category X / nhóm D nguy cơ cao): Isotretinoin (Accutane — trị mụn) → dị tật tim, não nghiêm trọng, thai chết lưu; chương trình iPLEDGE yêu cầu 2 biện pháp tránh thai. Methotrexate (điều trị vảy nến, ung thư, viêm khớp) → chấm dứt thai kỳ, dị tật nghiêm trọng. Valproate (thuốc chống động kinh, hưng-trầm cảm) → dị tật ống thần kinh (spina bifida), chậm phát triển nhận thức. Warfarin → "warfarin embryopathy" trong tam cá nguyệt 1; xuất huyết thai trong tam cá nguyệt 3.',
      'Thuốc thường dùng nhưng cần thận trọng: NSAID (ibuprofen, naproxen) — an toàn trong tam cá nguyệt 1-2, nhưng TRÁNH trong tam cá nguyệt 3 (đóng ductus arteriosus sớm). ACE inhibitor / ARB — tránh trong tam cá nguyệt 2-3 (suy thận thai nhi). Fluoroquinolone — tránh nếu có thể (ảnh hưởng sụn khớp thai nhi). Benzodiazepine — hội chứng cai thuốc ở trẻ sơ sinh.',
      'Thuốc an toàn trong mang thai: paracetamol (acetaminophen) — vẫn là giảm đau an toàn nhất trong thai kỳ (nhưng dùng liều thấp nhất, ngắn nhất cần thiết). Nhiều kháng sinh: amoxicillin, cephalosporin, azithromycin. Acid folic (400–800 mcg/ngày từ trước mang thai) — giảm 70% nguy cơ dị tật ống thần kinh. Sắt, canxi, DHA — nhu cầu tăng trong thai kỳ.',
      'Cho con bú và thuốc: hầu hết thuốc truyền vào sữa mẹ ở nồng độ thấp (1–2% liều mẹ) → thường an toàn. TRÁNH: methotrexate, isotretinoin, chloramphenicol, ergotamine, lithium, một số thuốc tâm thần. Database đáng tin cậy: LactMed (NIH) — miễn phí, cập nhật liên tục, cho biết nồng độ trong sữa và nguy cơ với trẻ bú. Dược sĩ bệnh viện cũng có thể tra cứu nhanh.',
      'Thuốc mãn tính và mang thai: người đang điều trị bệnh mãn tính (động kinh, huyết áp, tiểu đường, tâm thần, hen) cần lên kế hoạch trước khi mang thai với bác sĩ chuyên khoa. Nhiều bệnh nặng hơn khi mang thai nếu không điều trị — nguy cơ không điều trị đôi khi lớn hơn nguy cơ của thuốc. Không tự ngưng thuốc mãn tính khi phát hiện có thai — cần tham khảo bác sĩ ngay.',
    ],
    points: [
      { icon: '📅', label: 'Tuần 3–8: nguy hiểm nhất — thường chưa biết có thai', note: 'Báo ngay cả "đang cố gắng" để bác sĩ chọn thuốc phù hợp' },
      { icon: '🚫', label: 'Isotretinoin, methotrexate, valproate = tuyệt đối tránh', note: 'Chương trình iPLEDGE bắt buộc 2 biện pháp tránh thai với Accutane' },
      { icon: '🤱', label: 'LactMed (NIH) — tra cứu an toàn thuốc khi cho bú', note: 'Miễn phí, cập nhật liên tục — dược sĩ cũng có thể tra cứu' },
      { icon: '💊', label: 'Không tự ngưng thuốc mãn tính khi biết có thai', note: 'Bệnh không điều trị đôi khi nguy hiểm hơn thuốc — hỏi bác sĩ ngay' },
    ],
  },
  {
    icon: '🫀', label: 'Bệnh nền: gan, thận, tim',
    note: 'Chức năng tạng quyết định liều thuốc và lựa chọn thuốc — ngay cả khi bệnh "đang kiểm soát tốt".',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '🫀 Liều thuốc tiêu chuẩn trên tờ hướng dẫn được tính cho người có chức năng thận-gan bình thường. Người suy thận hay suy gan có thể tích lũy thuốc đến mức độc — ngay cả ở "liều bình thường".',
    details: [
      'Thận và thanh thải thuốc (renal clearance): 60–70% thuốc hoặc chất chuyển hóa hoạt tính được đào thải qua thận. GFR (Glomerular Filtration Rate) / CrCl (Creatinine Clearance) quyết định liều nhiều loại thuốc: metformin (chống chỉ định GFR < 30), kháng sinh aminoglycoside (liều theo CrCl), gabapentin (giảm liều mạnh khi suy thận), digoxin (độc tính tăng khi thận suy). Người cao tuổi thường GFR giảm mà không biết — creatinine máu "bình thường" nhưng GFR thực tế thấp.',
      'Gan và chuyển hóa thuốc (hepatic metabolism): hầu hết thuốc được chuyển hóa tại gan qua enzyme CYP450. Xơ gan, viêm gan nặng, suy gan → giảm chức năng enzyme, giảm lưu lượng máu gan, giảm protein huyết tương (albumin thấp → thuốc gắn protein tăng phần tự do → tăng tác dụng). Warfarin rất nhạy với chức năng gan — INR dao động mạnh khi gan suy; paracetamol liều giảm còn 2g/ngày; codeine có thể tích lũy morphine.',
      'Suy tim và phân bố thuốc: suy tim giảm cung lượng tim → giảm tưới máu gan và thận → thuốc chuyển hóa và thải trừ chậm hơn. Phù nề trong suy tim tăng thể tích phân bố của thuốc thân nước. Digoxin trong suy tim: chỉ còn dùng để kiểm soát nhịp tim ở liều thấp — ngưỡng độc hẹp. Một số thuốc chống chỉ định trong suy tim: NSAID (giữ nước, tăng tiền gánh), thiazolidinedione, verapamil/diltiazem liều cao.',
      'Đái tháo đường và chức năng thận: tiểu đường type 2 là nguyên nhân hàng đầu gây bệnh thận mãn tính. GFR quyết định: metformin (không dùng khi GFR < 30), SGLT-2 inhibitor kém hiệu quả khi GFR < 45, liều insulin cần điều chỉnh khi thận suy (insulin bị phân hủy một phần ở thận). Kiểm tra GFR ít nhất mỗi 6–12 tháng ở người tiểu đường.',
      'COPD và lựa chọn thuốc: beta-blocker (propranolol, metoprolol) chống chỉ định tương đối hoặc tuyệt đối ở COPD nặng — gây co thắt phế quản. Tuy nhiên, beta-blocker chọn lọc (bisoprolol, atenolol) và cardioselective thường an toàn ở COPD nhẹ-trung bình khi có chỉ định tim mạch. Aspirin và NSAID có thể gây co thắt phế quản ở 10–20% COPD/hen (aspirin-exacerbated respiratory disease). Báo cả COPD/hen khi kê thuốc tim mạch.',
      'Kể cả "đang kiểm soát tốt": bệnh nền được kiểm soát vẫn ảnh hưởng đến dược động học. Người tiểu đường type 2 kiểm soát tốt nhưng có GFR 50 ml/min vẫn cần chỉnh liều nhiều thuốc. Người cao huyết áp kiểm soát tốt nhưng dùng ACE inhibitor vẫn không nên dùng thêm NSAID. Không nên giấu bệnh nền vì "đang ổn" — bác sĩ cần thông tin để kê đơn an toàn.',
    ],
    points: [
      { icon: '🧪', label: 'GFR / CrCl quyết định liều kháng sinh & metformin', note: 'Creatinine "bình thường" nhưng GFR vẫn có thể thấp ở người cao tuổi' },
      { icon: '🫀', label: 'NSAID chống chỉ định ở suy tim, suy thận', note: 'Giữ nước, tăng tải tim — nguy hiểm ngay cả khi chỉ dùng 1–2 viên' },
      { icon: '🩺', label: 'Xơ gan → warfarin, paracetamol cần giảm liều', note: 'Albumin thấp → tăng phần thuốc tự do → tăng tác dụng và độc tính' },
      { icon: '💬', label: '"Đang kiểm soát tốt" vẫn phải khai báo', note: 'Bệnh nền ổn định vẫn ảnh hưởng dược động học — luôn thông báo' },
    ],
  },
];

function SupplementCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 18px rgba(${item.rgb},0.1)` : 'none', transform: hovered ? 'translateY(-3px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl shrink-0">{item.icon}</span>
        <span className="font-bold text-base text-text">{item.label}</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200"
          style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{item.note}</p>
    </div>
  );
}

function SupplementModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>TPCN · Hướng dẫn</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.label}</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.note}</p>
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

function DoctorCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 18px rgba(${item.rgb},0.1)` : 'none', transform: hovered ? 'translateX(4px)' : 'translateX(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},${hovered ? '0.4' : '0.2'})` }}>{item.icon}</span>
        <span className="font-bold text-sm text-text leading-snug flex-1">{item.label}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200"
          style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>→</span>
      </div>
      <p className="text-xs text-muted leading-relaxed pl-12">{item.note}</p>
    </div>
  );
}

function DoctorModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Thông tin cần báo bác sĩ</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.label}</h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.note}</p>
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

function DangerCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.5)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 18px rgba(${item.rgb},0.1)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
        <div className="font-bold text-base leading-snug" style={{ color: '#fbbf24' }}>{item.phrase}</div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200 whitespace-nowrap"
          style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
      </div>
      <p className="text-sm text-muted flex gap-2 pl-8">
        <span className="text-red-400 shrink-0">⚠</span>
        <span>{item.risk}</span>
      </p>
    </div>
  );
}

function DangerModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.phrase} className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(220,38,38,0.18)', color: '#f87171', border: '1px solid rgba(220,38,38,0.4)' }}>⚠ Quan niệm sai lầm</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-lg md:text-xl mb-1 leading-snug" style={{ color: '#fbbf24' }}>{item.phrase}</h2>
          <p className="text-sm mb-4 flex gap-2" style={{ color: 'rgba(252,165,165,0.9)' }}><span className="shrink-0">⚠</span><span>{item.risk}</span></p>
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
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const [medModal, setMedModal] = useState(null);
  const [dangerModal, setDangerModal] = useState(null);
  const [suppModal, setSuppModal] = useState(null);
  const [doctorModal, setDoctorModal] = useState(null);

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
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← {p.sub_breadcrumb || 'Kiến Thức Sức Khỏe'}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>💊</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{p.med_h1 || 'An Toàn Thuốc'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {p.med_badge || 'Dùng thuốc đúng cách · Tránh rủi ro'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {p.med_desc || 'Thuốc chữa bệnh khi dùng đúng, nhưng gây hại khi dùng sai. Hiểu đúng về thuốc — bao gồm thuốc kê đơn, OTC, và thực phẩm chức năng — là kỹ năng bảo vệ sức khỏe thiết yếu.'}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80&auto=format&fit=crop" alt="An toàn thuốc" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {p.med_caption || 'Dùng đúng thuốc · Đúng liều · Đúng lúc'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.med_s1_h2 || '5 Quy Tắc An Toàn Thuốc'}</h2>
        <p className="text-muted text-lg mb-6">Áp dụng mỗi khi bắt đầu một loại thuốc mới. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-4">
          {MED_RULES.map((r, i) => (
            <MedCard key={i} rule={r} onClick={() => setMedModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.med_s2_h2 || 'Những Câu Nguy Hiểm Cần Nhớ'}</h2>
        <p className="text-muted text-lg mb-6">Những quan niệm phổ biến nhưng sai — và tại sao chúng nguy hiểm. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-3">
          {DANGER_PHRASES.map((d, i) => (
            <DangerCard key={i} item={d} onClick={() => setDangerModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.med_s3_h2 || 'Hướng Dẫn Bổ Sung Thực Phẩm Chức Năng'}</h2>
        <p className="text-muted text-lg mb-6">TPCN không phải thuốc nhưng cũng cần dùng đúng cách. Luôn thông báo cho bác sĩ tất cả TPCN đang dùng. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {SUPPLEMENT_CHECK.map((s, i) => (
            <SupplementCard key={i} item={s} onClick={() => setSuppModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.med_s4_h2 || 'Luôn Nói Với Bác Sĩ / Dược Sĩ'}</h2>
        <p className="text-muted text-lg mb-6">Bốn thông tin bác sĩ cần biết để kê thuốc an toàn cho bạn. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DOCTOR_ITEMS.map((d, i) => (
            <DoctorCard key={i} item={d} onClick={() => setDoctorModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục sức khỏe. Không thay thế tư vấn của bác sĩ hoặc dược sĩ.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← {p.sub_back_footer || 'Quay lại Kiến Thức Sức Khỏe'}</Link>

      {doctorModal !== null && (
        <DoctorModal
          item={DOCTOR_ITEMS[doctorModal]}
          idx={doctorModal}
          total={DOCTOR_ITEMS.length}
          onClose={() => setDoctorModal(null)}
          onPrev={() => setDoctorModal(i => Math.max(0, i - 1))}
          onNext={() => setDoctorModal(i => Math.min(DOCTOR_ITEMS.length - 1, i + 1))}
          hasPrev={doctorModal > 0}
          hasNext={doctorModal < DOCTOR_ITEMS.length - 1}
        />
      )}
      {suppModal !== null && (
        <SupplementModal
          item={SUPPLEMENT_CHECK[suppModal]}
          idx={suppModal}
          total={SUPPLEMENT_CHECK.length}
          onClose={() => setSuppModal(null)}
          onPrev={() => setSuppModal(i => Math.max(0, i - 1))}
          onNext={() => setSuppModal(i => Math.min(SUPPLEMENT_CHECK.length - 1, i + 1))}
          hasPrev={suppModal > 0}
          hasNext={suppModal < SUPPLEMENT_CHECK.length - 1}
        />
      )}
      {dangerModal !== null && (
        <DangerModal
          item={DANGER_PHRASES[dangerModal]}
          idx={dangerModal}
          total={DANGER_PHRASES.length}
          onClose={() => setDangerModal(null)}
          onPrev={() => setDangerModal(i => Math.max(0, i - 1))}
          onNext={() => setDangerModal(i => Math.min(DANGER_PHRASES.length - 1, i + 1))}
          hasPrev={dangerModal > 0}
          hasNext={dangerModal < DANGER_PHRASES.length - 1}
        />
      )}
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
