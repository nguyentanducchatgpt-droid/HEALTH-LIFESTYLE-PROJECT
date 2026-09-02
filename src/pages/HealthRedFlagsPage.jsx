import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'e-rf-orbit-kf';
const ORBIT_CLASS = 'e-rf-orbit-ring';
const ORBIT_PROP = '--e-rf-orbit-angle';

const EMERGENCY_GROUPS = [
  {
    icon: '🧠', title: 'Đột Quỵ — Gọi 115 Ngay', tag: 'KHẨN CẤP',
    color: '#ef4444', rgb: '239,68,68',
    signs: [
      'Méo miệng đột ngột, mất cân đối khuôn mặt',
      'Tê hoặc yếu nửa người (tay, chân, mặt)',
      'Nói đớ, không thành lời, không hiểu người khác nói',
      'Mờ mắt một hoặc hai mắt đột ngột',
      'Đau đầu dữ dội không rõ nguyên nhân',
    ],
    note: 'Nhớ quy tắc FAST: Face drooping · Arm weakness · Speech difficulty · Time to call 115',
    action: 'Gọi 115 hoặc đến cấp cứu ngay — mỗi phút mất 1.9 triệu tế bào thần kinh trong đột quỵ.',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '⏱️ "Time is Brain": mỗi phút trì hoãn điều trị = 1.9 triệu tế bào thần kinh tử vong. Trong 4.5 giờ đầu, thuốc tiêu huyết khối (tPA) có thể đảo ngược tổn thương. Nhận biết FAST và gọi 115 là điều duy nhất bạn cần làm.',
    details: [
      'Quy tắc FAST: F (Face drooping — méo miệng), A (Arm weakness — yếu tay, không giơ cả 2 tay được), S (Speech difficulty — nói khó, đớ, vô nghĩa), T (Time — gọi 115 ngay khi có ≥ 1 dấu hiệu trên).',
      'Đột quỵ thiếu máu (ischemic, 85%): tắc mạch máu não. Điều trị: tPA tiêu huyết khối trong 4.5h, hoặc lấy huyết khối cơ học (thrombectomy) trong 6–24h tại trung tâm đột quỵ.',
      'Đột quỵ xuất huyết (hemorrhagic, 15%): vỡ mạch máu trong não. KHÔNG dùng aspirin — có thể làm nặng hơn. Cần phẫu thuật hoặc can thiệp nội mạch.',
      'Triệu chứng thoáng qua (TIA — "mini stroke"): giống đột quỵ nhưng hết trong < 24h (thường < 1h). Đừng xem nhẹ — 10–15% TIA dẫn đến đột quỵ thật trong 3 tháng, nguy cơ cao nhất trong 48h đầu.',
      'Không nên làm: (1) Không cho ăn/uống — nguy cơ sặc; (2) Không tự đưa bằng xe máy — xóc làm xuất huyết nặng hơn; (3) Không dùng thuốc hạ áp tự ý; (4) Không chờ xem có tự hết không.',
      'Phòng ngừa: kiểm soát huyết áp (mục tiêu < 130/80), không hút thuốc, kiểm soát rung nhĩ (nguyên nhân 20% đột quỵ), statin nếu LDL cao, aspirin chỉ khi có chỉ định của bác sĩ.',
    ],
    points: [
      { icon: '⏱️', label: 'Cửa sổ vàng: 4.5 giờ', note: 'tPA hiệu quả nhất trong 3h đầu — gọi 115 ngay' },
      { icon: '🚫', label: 'Không dùng aspirin nếu chưa biết loại', note: 'Xuất huyết não: aspirin làm nặng hơn' },
      { icon: '🧠', label: 'TIA không được bỏ qua', note: '10–15% → đột quỵ thật trong 3 tháng' },
      { icon: '📵', label: 'Không tự đưa bằng xe máy', note: 'Xóc có thể làm xuất huyết nặng hơn' },
    ],
  },
  {
    icon: '❤️', title: 'Nhồi Máu Cơ Tim', tag: 'KHẨN CẤP',
    color: '#ef4444', rgb: '239,68,68',
    signs: [
      'Đau ngực như bị ép, siết chặt, kéo dài > 15 phút',
      'Đau lan ra vai trái, cánh tay trái, hàm, lưng',
      'Khó thở kèm đau ngực',
      'Toát mồ hôi lạnh, buồn nôn, chóng mặt đột ngột',
      'Cảm giác báo trước kỳ lạ, lo lắng cực độ',
    ],
    note: 'Phụ nữ có thể không đau ngực điển hình — triệu chứng thường là buồn nôn, mệt mỏi đột ngột, khó thở.',
    action: 'Gọi 115 ngay, nhai 1 viên aspirin 300mg (nếu không dị ứng), nằm nghỉ — không tự lái xe đến bệnh viện.',
    img: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=800&q=80',
    keyFact: '💊 Aspirin 300mg nhai ngay (không nuốt nguyên) nếu không dị ứng — làm mỏng huyết khối đang tắc mạch vành. "Door-to-balloon" < 90 phút là tiêu chuẩn vàng: càng vào viện sớm, cơ tim được cứu càng nhiều.',
    details: [
      'Cơ chế: mảng xơ vữa trong động mạch vành vỡ ra → huyết khối hình thành đột ngột → tắc hoàn toàn → cơ tim thiếu oxy → hoại tử. Không tự phục hồi — mỗi phút = thêm cơ tim chết.',
      'Triệu chứng điển hình ở nam: đau ngực trái/giữa ngực như bị ai bóp, ép, đốt; kéo dài > 15 phút; lan ra hàm, cổ, tay trái, lưng; kèm vã mồ hôi, buồn nôn.',
      'Triệu chứng không điển hình (hay gặp ở nữ, tiểu đường, người cao tuổi): mệt mỏi đột ngột dữ dội, khó thở không giải thích được, buồn nôn, chóng mặt, đau hàm hoặc lưng — không đau ngực rõ. Thường đến viện muộn hơn.',
      'Sơ cứu đúng: (1) Gọi 115 trước; (2) Ngồi/nằm thoải mái, nới lỏng quần áo; (3) Nhai (không nuốt) 1 viên Aspirin 300mg nếu không dị ứng; (4) Nitroglycerin xịt dưới lưỡi nếu đã có chỉ định; (5) Không ăn uống gì thêm; (6) Không tự lái xe.',
      'Điều trị tại viện: PCI (đặt stent mạch vành) trong < 90 phút từ khi vào viện là tiêu chuẩn vàng. Nếu không có PCI, tiêu huyết khối (tPA) trong 30 phút. Mỗi phút trì hoãn = thêm 2000 tế bào cơ tim chết.',
      'Phục hồi sau nhồi máu: chương trình cardiac rehab giảm nguy cơ tái phát 25–30%. Thuốc duy trì: aspirin + clopidogrel/ticagrelor 1 năm, statin, beta-blocker, ACE inhibitor — không tự ngưng.',
    ],
    points: [
      { icon: '💊', label: 'Aspirin 300mg — nhai ngay', note: 'Làm mỏng huyết khối đang tắc — không nuốt nguyên' },
      { icon: '🚗', label: 'Không tự lái xe đến viện', note: 'Nguy hiểm nếu mất ý thức đột ngột trên đường' },
      { icon: '👩', label: 'Nữ: triệu chứng khác nam', note: 'Mệt, buồn nôn, khó thở — không nhất thiết đau ngực' },
      { icon: '🏥', label: 'Door-to-balloon < 90 phút', note: 'Mỗi phút trì hoãn = thêm cơ tim hoại tử' },
    ],
  },
  {
    icon: '🌡️', title: 'Nhiễm Trùng Nặng / Sốc Nhiễm Khuẩn', tag: 'KHẨN CẤP',
    color: '#f97316', rgb: '249,115,22',
    signs: [
      'Sốt cao > 39.5°C không hạ sau 2 giờ dùng thuốc',
      'Mạch nhanh > 100 lần/phút kèm lơ mơ',
      'Tụt huyết áp: HA tâm thu < 90 mmHg',
      'Nổi ban đỏ lan nhanh kèm sốt',
      'Cứng gáy, sợ ánh sáng, đau đầu dữ dội (viêm màng não)',
    ],
    note: 'Sốc nhiễm trùng (septic shock) là tình trạng đe dọa tính mạng cần điều trị trong vòng 1 giờ đầu.',
    action: 'Vào cấp cứu ngay — không chờ uống thuốc xem có đỡ không.',
    img: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?w=800&q=80',
    keyFact: '⏱️ "Hour-1 Bundle" (bộ xử lý sepsis trong 1 giờ): cấy máu → kháng sinh phổ rộng → truyền dịch 30ml/kg. Tỷ lệ tử vong tăng 7% mỗi giờ trì hoãn kháng sinh. Nhận biết sớm = cứu sống.',
    details: [
      'Sepsis: phản ứng viêm toàn thân quá mức với nhiễm trùng → tổn thương đa cơ quan. Septic shock: cần thuốc vận mạch để duy trì MAP ≥ 65 mmHg + lactate > 2 mmol/L. Tỷ lệ tử vong 40–50%.',
      'Dấu hiệu cảnh báo sớm (qSOFA): (1) Nhịp thở > 22 lần/phút; (2) Thay đổi ý thức (lơ mơ, lẫn lộn); (3) HA tâm thu < 100 mmHg. Có ≥ 2 → nguy cơ sepsis cao.',
      'Viêm màng não mủ: cứng gáy + sốt + đau đầu dữ dội + sợ ánh sáng. Không cần đợi chọc dịch não tủy để bắt đầu kháng sinh — trễ 1 giờ tăng nguy cơ di chứng thần kinh vĩnh viễn.',
      'Ban xuất huyết không mất màu khi ép (non-blanching purpura): ấn ngón tay lên ban, nếu ban không nhạt màu → xuất huyết do nhiễm khuẩn huyết (meningococcemia) — cấp cứu tối khẩn.',
      'Ổ nhiễm trùng thường gặp dẫn đến sepsis: viêm phổi (50%), nhiễm trùng ổ bụng (20%), nhiễm trùng tiết niệu (15%), nhiễm trùng da/mô mềm (10%). Cần kiểm soát ổ nhiễm cùng kháng sinh.',
      'Phòng ngừa: vắc-xin phế cầu, cúm; chăm sóc vết thương đúng cách; không tự mua kháng sinh điều trị sốt kéo dài — che giấu triệu chứng sepsis nguy hiểm.',
    ],
    points: [
      { icon: '🦠', label: '+7% tử vong mỗi giờ trễ kháng sinh', note: 'Kháng sinh sớm là can thiệp quan trọng nhất' },
      { icon: '🔴', label: 'Ban không mất màu = khẩn cấp tối đa', note: 'Meningococcemia — nguy cơ tử vong trong vài giờ' },
      { icon: '💧', label: 'Bù dịch 30ml/kg trong 3h đầu', note: 'Một phần của Hour-1 Bundle tiêu chuẩn quốc tế' },
      { icon: '🧠', label: 'Lơ mơ + sốt = nguy hiểm', note: 'Rối loạn ý thức là chỉ điểm sepsis — không chỉ là "sốt cao"' },
    ],
  },
  {
    icon: '🫁', title: 'Khó Thở Cấp Tính', tag: 'KHẨN CẤP',
    color: '#f97316', rgb: '249,115,22',
    signs: [
      'Thở dốc đột ngột khi nghỉ ngơi',
      'Tím môi, tím đầu ngón tay',
      'Không thể nói trọn câu vì thiếu hơi',
      'Thở khò khè dữ dội không đáp ứng thuốc xịt',
      'Ho ra máu',
    ],
    note: 'Nhồi máu phổi (thuyên tắc phổi) có thể gây khó thở đột ngột mà không có dấu hiệu báo trước.',
    action: 'Gọi 115 hoặc vào cấp cứu ngay, đặt người bệnh ngồi tựa để dễ thở hơn.',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '💙 SpO2 < 90% = suy hô hấp cần can thiệp ngay. Tím môi/đầu ngón tay xuất hiện khi SpO2 ≈ 85% — cơ thể đã thiếu oxy nghiêm trọng. Đặt người bệnh ngồi thẳng (orthopnea) giúp phổi giãn nở tốt hơn nằm.',
    details: [
      'Nguyên nhân phổ biến: (1) Phù phổi cấp (nhồi máu cơ tim, suy tim mất bù); (2) Thuyên tắc phổi (PE); (3) Cơn hen nặng; (4) Tràn khí màng phổi; (5) Viêm phổi nặng; (6) Phản vệ.',
      'Thuyên tắc phổi (PE): huyết khối từ tĩnh mạch sâu chi dưới di chuyển lên phổi. Yếu tố nguy cơ: nằm lâu, sau phẫu thuật, ung thư, thai kỳ, ngồi máy bay dài. Triệu chứng: đau ngực kiểu màng phổi + khó thở đột ngột + mạch nhanh.',
      'Tím tái (cyanosis) ở môi/móng tay → SpO2 < 85% → cần hỗ trợ oxy ngay. Máy đo SpO2 kẹp ngón tay (pulse oximeter) nên có ở nhà nếu có người bệnh hen, COPD, hoặc bệnh tim.',
      'Cơn hen nặng: không thể nói trọn câu, SpO2 < 92%, nhịp thở > 30/phút, dùng cơ hô hấp phụ. Xịt salbutamol 2–4 nhát, nếu không đáp ứng → gọi 115 ngay.',
      'Tràn khí màng phổi tự phát: người trẻ cao gầy, đau ngực một bên đột ngột + khó thở. Tràn khí áp lực (tension pneumothorax) phải xử trí trong vài phút — không tự khỏi.',
      'Phản vệ (anaphylaxis): khó thở + nổi mề đay/phù mặt sau tiếp xúc dị nguyên. Điều trị: adrenalin 0.3–0.5mg tiêm bắp đùi ngay — là can thiệp cứu sống duy nhất; kháng histamine không thay thế được.',
    ],
    points: [
      { icon: '📊', label: 'SpO2 < 90% = suy hô hấp', note: 'Máy đo ngón tay giúp nhận biết sớm tại nhà' },
      { icon: '🪑', label: 'Ngồi thẳng giúp phổi giãn tốt hơn', note: 'Tư thế orthopnea — không ép nằm xuống' },
      { icon: '💉', label: 'Phản vệ: adrenalin tiêm bắp ngay', note: 'Kháng histamine không thay thế được adrenalin' },
      { icon: '✈️', label: 'Khó thở sau ngồi lâu/phẫu thuật = nghi PE', note: 'Thuyên tắc phổi có thể không báo trước' },
    ],
  },
];

const SOON_SIGNS = [
  {
    icon: '⚖️', sign: 'Sụt cân không rõ nguyên nhân > 5% trong 1 tháng', urgency: 'Trong 1–2 tuần',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
    keyFact: '⚠️ Sụt cân không chủ ý > 5% trọng lượng cơ thể trong 1 tháng (hoặc > 10% trong 6 tháng) là một trong những dấu hiệu "đỏ" quan trọng nhất trong y học — có thể là biểu hiện đầu tiên của ung thư, tiểu đường, cường giáp, hay bệnh lý tiêu hóa nghiêm trọng.',
    details: [
      'Nguyên nhân ác tính cần loại trừ: ung thư dạ dày, ung thư đại trực tràng, ung thư phổi, lymphoma (ung thư hạch), ung thư tụy. Đây là nhóm ung thư thường biểu hiện bằng sụt cân sớm trước khi có triệu chứng cụ thể khác.',
      'Nguyên nhân nội tiết: tiểu đường type 1 (sụt cân nhanh kèm uống nhiều, tiểu nhiều), cường giáp (sụt cân kèm hồi hộp, đổ mồ hôi, tiêu chảy), suy thượng thận (sụt cân kèm mệt, buồn nôn, hạ áp).',
      'Nguyên nhân tiêu hóa: bệnh Crohn, viêm loét đại tràng, celiac disease (dị ứng gluten), hội chứng kém hấp thu. Thường kèm tiêu chảy mạn, đau bụng, hoặc phân bất thường.',
      'Nguyên nhân nhiễm trùng mạn: lao phổi (sụt cân + ho + sốt nhẹ về chiều), HIV/AIDS, nhiễm ký sinh trùng mạn tính. Cần hỏi về tiền sử tiếp xúc và du lịch.',
      'Cần làm gì khi gặp bác sĩ: cân nặng tại nhiều thời điểm (tự theo dõi), nhật ký ăn uống, các triệu chứng kèm theo. Bác sĩ sẽ chỉ định: CBC, chức năng gan/thận/giáp, glucose, và tùy nghi ngờ — nội soi hoặc CT scan.',
      'Sụt cân có chủ ý (ăn kiêng, tập thể dục) không phải dấu hiệu nguy hiểm. Chỉ lo ngại khi sụt cân KHÔNG CÓ thay đổi về chế độ ăn hoặc vận động — tức là cơ thể đang "tiêu hao" vì nguyên nhân bên trong.',
    ],
    points: [
      { icon: '🎯', label: 'Mốc cảnh báo: > 5% trong 1 tháng', note: 'Ví dụ: người 60kg sụt > 3kg không rõ lý do' },
      { icon: '🦀', label: 'Loại trừ ung thư trước tiên', note: 'Đặc biệt nếu > 45 tuổi hoặc có tiền sử gia đình' },
      { icon: '📋', label: 'Ghi lại cân nặng và triệu chứng kèm', note: 'Giúp bác sĩ đánh giá xu hướng và định hướng xét nghiệm' },
      { icon: '🔬', label: 'CBC + TSH + glucose là bước đầu', note: 'Xét nghiệm cơ bản + nội soi nếu cần' },
    ],
  },
  {
    icon: '😴', sign: 'Mệt mỏi dai dẳng không hồi phục dù nghỉ đủ', urgency: 'Trong 1–2 tuần',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    keyFact: '⚠️ Mệt mỏi dai dẳng kéo dài > 6 tuần, không cải thiện dù ngủ đủ giấc, không do nguyên nhân rõ ràng — cần đánh giá y tế. Phân biệt với mệt mỏi thông thường: mệt bệnh lý không hồi phục sau nghỉ ngơi.',
    details: [
      'Thiếu máu (anemia): nguyên nhân phổ biến nhất. Thiếu sắt (hay gặp ở phụ nữ kinh nguyệt nhiều, ăn chay), thiếu B12/folate (người cao tuổi, ăn chay thuần túy). Biểu hiện: mệt + da xanh + hoa mắt + nhịp tim nhanh.',
      'Suy giáp (hypothyroidism): TSH tăng, FT4 giảm. Gặp ở nữ giới nhiều hơn (tỷ lệ 5:1). Triệu chứng: mệt mỏi + tăng cân + lạnh + táo bón + tóc rụng + da khô. Chẩn đoán bằng xét nghiệm TSH.',
      'Tiểu đường type 2: glucose cao → tế bào không dùng được glucose → thiếu năng lượng. Kèm: uống nhiều, tiểu nhiều, nhìn mờ, vết thương lâu lành. Nhiều người phát hiện bệnh lần đầu qua triệu chứng mệt mỏi.',
      'Trầm cảm và rối loạn lo âu: mệt mỏi là triệu chứng cốt lõi của trầm cảm. Thường kèm mất ngủ/ngủ nhiều, mất hứng thú, buồn bã, khó tập trung. Cần đánh giá sức khỏe tâm thần song song với các nguyên nhân thực thể.',
      'Hội chứng mệt mỏi mạn (ME/CFS): mệt mỏi nghiêm trọng > 6 tháng, tệ hơn sau gắng sức (post-exertional malaise), kèm sương mù não, đau cơ khớp. Chẩn đoán loại trừ — sau khi kiểm tra hết các nguyên nhân khác.',
      'Ung thư: mệt mỏi không giải thích được là triệu chứng của hầu hết các ung thư, đặc biệt lymphoma, bệnh bạch cầu (leukemia). Đặc biệt nghi ngờ nếu kèm sụt cân, sốt, đổ mồ hôi đêm (B symptoms).',
    ],
    points: [
      { icon: '🩸', label: 'CBC + sắt + TSH trước tiên', note: 'Thiếu máu và suy giáp — nguyên nhân phổ biến, dễ điều trị' },
      { icon: '🍬', label: 'Xét nghiệm đường huyết lúc đói', note: 'Tiểu đường type 2 thường phát hiện muộn qua triệu chứng mệt' },
      { icon: '🧠', label: 'Đánh giá sức khỏe tâm thần', note: 'Trầm cảm và lo âu là nguyên nhân mệt mỏi rất hay gặp' },
      { icon: '📅', label: 'Mệt > 6 tuần không rõ = cần khám', note: 'Đừng tự quy cho "làm việc nhiều" mà bỏ qua' },
    ],
  },
  {
    icon: '🔵', sign: 'Khối u hoặc hạch bất thường mới xuất hiện', urgency: 'Trong 1 tuần',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '⚠️ Bất kỳ khối u mới nào xuất hiện trên cơ thể hoặc hạch sưng to không đau không rõ nguyên nhân đều cần đánh giá. Đặc biệt: khối u cứng, không di động, bờ không đều, hoặc hạch > 2cm kéo dài > 4 tuần.',
    details: [
      'Hạch bình thường vs. bất thường: hạch phản ứng với nhiễm trùng thường mềm, đau, di động được và tự nhỏ sau 2–4 tuần. Hạch cần lo ngại: cứng, không đau, không di động, > 2cm, kéo dài > 4 tuần, kèm sụt cân/sốt/đổ mồ hôi đêm.',
      'Vị trí hạch và ý nghĩa: cổ (viêm họng, ung thư vùng đầu cổ, lymphoma); nách (viêm nhiễm tay, ung thư vú); bẹn (nhiễm trùng sinh dục, ung thư tế bào hắc tố chi dưới); hạch thượng đòn trái (Virchow node — cảnh báo ung thư ổ bụng).',
      'Lymphoma (ung thư hạch): Hodgkin lymphoma hay gặp ở người trẻ 15–35 tuổi, thường bắt đầu bằng hạch cổ không đau. Non-Hodgkin lymphoma đa dạng hơn, có thể ở mọi lứa tuổi. B symptoms: sốt, đổ mồ hôi đêm, sụt cân.',
      'Khối u vú: bất kỳ khối u mới nào ở vú đều cần đánh giá — dù đau hay không. Ung thư vú thường không đau. Cần siêu âm (người < 40) hoặc mammography (> 40) và có thể sinh thiết.',
      'Khối u da — dấu hiệu ABCDE: Asymmetry (mất đối xứng), Border irregular (bờ không đều), Color variation (màu không đồng nhất), Diameter > 6mm, Evolution (thay đổi theo thời gian). Bất kỳ nốt ruồi nào thay đổi đều cần kiểm tra.',
      'Bước tiếp theo: siêu âm hoặc CT để đánh giá kích thước; FNA (chọc hút tế bào) hoặc sinh thiết cắt để chẩn đoán mô học — đây là tiêu chuẩn vàng xác định ác tính hay lành tính.',
    ],
    points: [
      { icon: '🔴', label: 'Hạch cứng, không đau, không di động = lo ngại', note: 'Khác với hạch phản ứng: mềm, đau, tự nhỏ sau 2–4 tuần' },
      { icon: '👆', label: 'Hạch thượng đòn trái = cảnh báo cao', note: 'Virchow node — thường liên quan ung thư ổ bụng' },
      { icon: '🩻', label: 'Siêu âm là bước đầu', note: 'Nhanh, rẻ, không bức xạ — đánh giá cấu trúc và kích thước' },
      { icon: '🔬', label: 'Sinh thiết = chẩn đoán xác định', note: 'Chỉ sinh thiết mới cho biết lành hay ác tính' },
    ],
  },
  {
    icon: '🩸', sign: 'Đi tiểu ra máu (không do kinh nguyệt)', urgency: 'Trong 1 tuần',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80',
    keyFact: '⚠️ Tiểu máu (hematuria) — dù chỉ một lần, không đau, không kèm triệu chứng khác — cũng cần đánh giá y tế. Tiểu máu không đau ở người > 45 tuổi có thể là ung thư bàng quang hoặc thận cho đến khi được loại trừ.',
    details: [
      'Tiểu máu đại thể (thấy bằng mắt thường): nước tiểu đỏ hoặc nâu. Tiểu máu vi thể (qua xét nghiệm): > 3 hồng cầu/vi trường. Cả hai đều cần đánh giá — tiểu máu vi thể cũng có thể là bệnh nghiêm trọng.',
      'Nguyên nhân theo tuổi: người trẻ (<40): viêm cầu thận (IgA nephropathy), sỏi tiết niệu, nhiễm trùng tiết niệu. Người trung niên và cao tuổi (>45): ung thư bàng quang, ung thư thận là ưu tiên loại trừ đầu tiên.',
      'Ung thư bàng quang: hay gặp ở nam > 50 tuổi, hút thuốc, tiếp xúc hóa chất công nghiệp. Tiểu máu không đau là triệu chứng đầu tiên trong 80% ca. Điều trị tốt nhất khi phát hiện giai đoạn sớm (còn trong niêm mạc).',
      'Sỏi tiết niệu: tiểu máu kèm đau quặn (renal colic) dữ dội từ hông lan xuống bẹn. CT scan không thuốc cản quang là tiêu chuẩn chẩn đoán (nhạy 95%).',
      'Viêm cầu thận: tiểu máu vi thể + protein niệu + phù. IgA nephropathy hay gặp ở người trẻ sau nhiễm trùng hô hấp. Cần sinh thiết thận để chẩn đoán và đánh giá mức độ tổn thương.',
      'Cần làm gì: tổng phân tích nước tiểu (UA) là bước đầu; nếu tiểu máu được xác nhận → siêu âm thận bàng quang, tế bào học nước tiểu, và nếu > 45 tuổi → nội soi bàng quang (cystoscopy).',
    ],
    points: [
      { icon: '🚨', label: 'Tiểu máu không đau > 45 tuổi = ưu tiên loại trừ ung thư', note: '80% ung thư bàng quang biểu hiện qua tiểu máu không đau' },
      { icon: '🔬', label: 'Tổng phân tích nước tiểu là bước đầu', note: 'Xác nhận tiểu máu và tìm dấu hiệu viêm/nhiễm kèm' },
      { icon: '🩻', label: 'Siêu âm + CT thận tiết niệu', note: 'Phát hiện sỏi, u thận, bất thường cấu trúc' },
      { icon: '🔭', label: 'Nội soi bàng quang nếu > 45 tuổi', note: 'Tiêu chuẩn vàng phát hiện ung thư bàng quang giai đoạn sớm' },
    ],
  },
  {
    icon: '🫁', sign: 'Ho kéo dài > 3 tuần không rõ nguyên nhân', urgency: 'Trong 2 tuần',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
    keyFact: '⚠️ Ho kéo dài > 3 tuần không do cảm cúm hoặc không cải thiện sau điều trị thông thường cần loại trừ lao phổi, ung thư phổi và bệnh phổi mạn tính. Đặc biệt nguy hiểm nếu kèm ho ra máu, sụt cân, hoặc sốt kéo dài.',
    details: [
      'Lao phổi: ho mạn + sốt nhẹ về chiều + đổ mồ hôi đêm + sụt cân là tứ chứng kinh điển. Việt Nam thuộc 30 quốc gia có gánh nặng lao cao nhất thế giới. Chẩn đoán: X-quang phổi + đờm AFB (3 mẫu) + Gene Xpert MTB/RIF.',
      'Ung thư phổi: thường không triệu chứng giai đoạn sớm. Dấu hiệu cảnh báo: ho mới khởi phát hoặc thay đổi tính chất ho ở người hút thuốc, ho ra máu, khàn tiếng, đau ngực. Tỷ lệ sống 5 năm: giai đoạn I >90%, giai đoạn IV chỉ 10%.',
      'Ho mạn do thuốc (ACE inhibitor cough): ho khan kích thích gặp ở 5–20% người dùng thuốc hạ áp nhóm ACE inhibitor (captopril, enalapril, lisinopril). Ho thường hết sau khi ngưng thuốc 1–4 tuần.',
      'Trào ngược dạ dày thực quản (GERD): ho mạn ban đêm hoặc sau ăn, kèm ợ chua, ợ nóng. Cơ chế: acid kích thích thanh quản/phế quản. Điều trị thử PPI 4–8 tuần thấy cải thiện có giá trị chẩn đoán.',
      'Hen phế quản ho dạng (cough-variant asthma): ho khan dai dẳng, tăng ban đêm và sáng sớm, kích thích bởi lạnh/gắng sức/mùi hóa chất. Không thở khò khè rõ. Chẩn đoán bằng đo hô hấp ký và test phế quản giãn.',
      'Nhỏ giọt sau (post-nasal drip): dịch mũi chảy xuống họng → kích thích ho, hay gặp ở viêm mũi xoang mạn. Ho nhiều buổi sáng, cảm giác chảy dịch sau cổ họng. Điều trị: xịt mũi corticoid, kháng histamine.',
    ],
    points: [
      { icon: '🦠', label: 'Loại trừ lao phổi trước tiên ở Việt Nam', note: 'X-quang + đờm AFB + Gene Xpert — cần làm nếu ho > 3 tuần' },
      { icon: '🚬', label: 'Hút thuốc + ho mới = nghi ung thư phổi', note: 'CT low-dose sàng lọc ung thư phổi cho người hút thuốc > 50 tuổi' },
      { icon: '💊', label: 'Kiểm tra thuốc đang dùng', note: 'ACE inhibitor gây ho khan — ngưng thuốc là điều trị' },
      { icon: '🩻', label: 'X-quang phổi là bước đầu', note: 'Nhanh, rẻ, loại trừ lao và các bất thường phổi lớn' },
    ],
  },
  {
    icon: '🩹', sign: 'Thay đổi tính chất phân: máu, đen, mỏng hơn kéo dài', urgency: 'Trong 1 tuần',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    keyFact: '⚠️ Phân đen hoặc có máu đỏ tươi kéo dài — không do táo bón hoặc trĩ đã biết — cần loại trừ ung thư đại trực tràng và xuất huyết tiêu hóa. Phân hình bút chì (pencil-thin stool) kéo dài là dấu hiệu cảnh báo ung thư trực tràng.',
    details: [
      'Phân đen (melena): màu đen như hắc ín, mùi hôi đặc trưng — xuất huyết tiêu hóa trên (dạ dày, tá tràng). Nguyên nhân: loét dạ dày/tá tràng, giãn tĩnh mạch thực quản (xơ gan). Cần nội soi dạ dày khẩn nếu phân đen kèm chóng mặt, ngất.',
      'Phân đỏ tươi (hematochezia): thường là xuất huyết tiêu hóa dưới. Nguyên nhân lành tính: trĩ, nứt hậu môn. Nguyên nhân nghiêm trọng: polyp đại tràng, ung thư đại trực tràng, viêm đại tràng. Không tự quy cho trĩ nếu chưa được xác nhận qua nội soi.',
      'Ung thư đại trực tràng: thay đổi thói quen đại tiện (táo bón luân phiên tiêu chảy, phân mỏng hơn), máu trong phân, đau bụng, sụt cân là tứ chứng kinh điển. Ung thư phổ biến thứ 3 thế giới; tỷ lệ sống > 90% nếu phát hiện giai đoạn I.',
      'Sàng lọc ung thư đại trực tràng: ACS khuyến nghị bắt đầu từ 45 tuổi bằng: nội soi đại tràng mỗi 10 năm, hoặc xét nghiệm máu ẩn phân (FIT) mỗi năm, hoặc xét nghiệm DNA phân mỗi 3 năm.',
      'Phân mỏng dạng bút chì (pencil-thin stool) kéo dài: khối u trong trực tràng thu hẹp lòng ruột — phân bị nén thành hình bút chì. Đây là dấu hiệu cảnh báo cao cần nội soi đại tràng ngay.',
      'Thuốc gây màu phân: sắt và bismuth gây phân đen (không mùi đặc trưng như melena); củ dền/thực phẩm đỏ có thể gây phân đỏ. Hỏi về thuốc và thực phẩm trước khi lo ngại — nhưng tốt nhất vẫn nên kiểm tra.',
    ],
    points: [
      { icon: '⚫', label: 'Phân đen + chóng mặt = cấp cứu', note: 'Xuất huyết tiêu hóa trên có thể mất máu nhanh' },
      { icon: '✏️', label: 'Phân hình bút chì = nghi ung thư trực tràng', note: 'Khối u thu hẹp lòng ruột — cần nội soi ngay' },
      { icon: '🚫', label: 'Đừng tự quy cho trĩ', note: 'Trĩ gây máu đỏ tươi — nhưng ung thư cũng vậy. Cần nội soi xác nhận' },
      { icon: '🩺', label: 'Sàng lọc từ 45 tuổi', note: 'Nội soi đại tràng mỗi 10 năm hoặc FIT test hàng năm' },
    ],
  },
  {
    icon: '🧠', sign: 'Đau đầu sáng sớm kèm nôn mửa liên tục', urgency: 'Trong 3–5 ngày',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '⚠️ Đau đầu dữ dội buổi sáng sớm (thường cải thiện sau nôn), kèm nôn mửa phun vọt, thị giác thay đổi — là dấu hiệu kinh điển của tăng áp lực nội sọ. Có thể là u não, tụ máu nội sọ, hoặc tràn dịch não thất cần chẩn đoán khẩn.',
    details: [
      'Tăng áp lực nội sọ (TALNS): tam chứng Cushing — đau đầu sáng sớm (tệ nhất khi mới thức dậy, cải thiện sau khi đứng dậy/nôn), nôn mửa phun vọt (không có buồn nôn trước), phù gai thị (nhìn mờ, song thị). Áp lực bình thường 5–15 mmHg, TALNS khi > 20 mmHg.',
      'U não nguyên phát: glioblastoma (grade IV, tiến triển nhanh, trung vị sống 15 tháng), meningioma (thường lành tính, phát triển chậm). Không phải tất cả u não đều gây đau đầu — chỉ 50% có triệu chứng đau đầu.',
      'U não di căn: ung thư phổi (50%), ung thư vú (15%), ung thư đại trực tràng, ung thư thận. Đau đầu tiến triển kèm suy giảm thần kinh khu trú (yếu tay chân một bên, rối loạn thị giác, thay đổi tính cách).',
      'Tràn dịch não thất (hydrocephalus): dịch não tủy tích lũy → tăng áp lực. Dạng mắc phải (sau viêm màng não, sau chảy máu dưới nhện). Triệu chứng: đau đầu tăng dần, lơ mơ, dáng đi không vững.',
      'Chẩn đoán phân biệt với migraine lành tính: migraine cũng nặng vào sáng và kèm nôn — nhưng có tiền triệu (aura), biết trước yếu tố kích hoạt, và có lịch sử lâu dài. Đau đầu "dữ dội nhất cuộc đời" (thunderclap headache) là cấp cứu — nghĩ đến vỡ phình mạch.',
      'Cần làm gì: MRI não có/không thuốc cản quang là tiêu chuẩn vàng. CT não phù hợp hơn trong cấp cứu (nhanh, phát hiện xuất huyết tốt). Không trì hoãn nếu có thêm yếu liệt, co giật, hoặc thay đổi ý thức.',
    ],
    points: [
      { icon: '🌅', label: 'Đau đầu sáng sớm + nôn phun = TALNS', note: 'Tăng áp lực nội sọ — không tự xử lý' },
      { icon: '⚡', label: '"Đau đầu dữ dội nhất cuộc đời" = cấp cứu', note: 'Thunderclap headache — nghi vỡ phình mạch máu não' },
      { icon: '🧲', label: 'MRI não là tiêu chuẩn vàng', note: 'Tốt hơn CT cho khối u nhỏ — CT dùng trong cấp cứu' },
      { icon: '🎯', label: 'Đau đầu tiến triển ≠ migraine', note: 'Nặng hơn mỗi ngày, không đáp ứng thuốc thông thường' },
    ],
  },
  {
    icon: '👁️', sign: 'Nhìn đôi hoặc mất thị lực một phần kéo dài', urgency: 'Trong 1–2 ngày',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1516239482977-b550ba7253f2?w=800&q=80',
    keyFact: '⚠️ Mất thị lực đột ngột hoặc nhìn đôi dai dẳng là dấu hiệu thần kinh hoặc mắt nghiêm trọng. Mất thị lực một mắt đột ngột (amaurosis fugax) có thể là TIA và dự báo đột quỵ trong 48h tiếp theo.',
    details: [
      'Amaurosis fugax (mù thoáng qua một mắt): mất thị lực hoàn toàn một mắt trong vài giây đến vài phút, tự hồi phục — như "tấm màn sập xuống". Nguyên nhân: tắc mạch máu tạm thời đến võng mạc từ cục huyết khối mảng xơ vữa động mạch cảnh. Đây là TIA mắt — cấp cứu thần kinh mạch máu.',
      'Bong võng mạc: mất thị lực một phần (như tấm màn che một góc), kèm ánh sáng chớp, nhiều chấm bay hơn bình thường. Không đau. Cần phẫu thuật khẩn trong 24h nếu điểm vàng (macula) chưa bị ảnh hưởng — trì hoãn gây mù vĩnh viễn.',
      'Glaucoma cấp: tăng nhãn áp đột ngột → đau mắt dữ dội + nhìn mờ + nhìn thấy quầng xung quanh đèn + buồn nôn. Cấp cứu nhãn khoa — áp lực cao gây tổn thương dây thần kinh thị giác không thể hồi phục.',
      'Nhìn đôi (diplopia) phân loại: một mắt (monocular — che mắt kia vẫn nhìn đôi) → nguyên nhân ở mắt. Hai mắt (binocular — che một mắt là hết) → nguyên nhân thần kinh. Liệt dây thần kinh III, IV, VI → nghi phình mạch, u não, tăng áp nội sọ.',
      'Tắc động mạch trung tâm võng mạc (CRAO): "đột quỵ mắt" — mất thị lực hoàn toàn và đột ngột một mắt, không đau. Cửa sổ điều trị < 4–6 giờ. Cần đến cấp cứu ngay như đột quỵ não.',
      'Phân biệt với lành tính: mờ mắt do khúc xạ (cải thiện khi nheo mắt), mờ khi nhìn xa (cận thị đơn thuần). Lo ngại khi: một mắt bị ảnh hưởng, xuất hiện đột ngột, có kèm đau mắt, hoặc không cải thiện sau nghỉ ngơi.',
    ],
    points: [
      { icon: '🚨', label: 'Mù thoáng qua 1 mắt = TIA = khẩn cấp', note: 'Nguy cơ đột quỵ trong 48h tiếp theo — gọi 115' },
      { icon: '🔲', label: '"Tấm màn" che thị lực = nghi bong võng mạc', note: 'Phẫu thuật trong 24h nếu macula chưa bị — trễ → mù' },
      { icon: '👓', label: 'Nhìn đôi 2 mắt = nguyên nhân thần kinh', note: 'Che 1 mắt mà hết nhìn đôi → vấn đề thần kinh/não' },
      { icon: '👁️', label: 'Đau mắt + quầng ánh đèn = glaucoma cấp', note: 'Cấp cứu nhãn khoa — tổn thương thần kinh thị không hồi phục' },
    ],
  },
];

const PREP_ITEMS = [
  {
    icon: '📱', sign: 'Lưu số 115 vào điện thoại ngay bây giờ', urgency: 'Làm ngay hôm nay',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&q=80',
    keyFact: '✅ Trong tình huống cấp cứu, não người hoảng loạn không nhớ được số điện thoại — kể cả những số đã thuộc lòng. Lưu sẵn "115 Cấp Cứu" với tên hiển thị rõ ràng giúp bất kỳ ai cầm điện thoại cũng có thể gọi ngay lập tức.',
    details: [
      'Tại sao cần lưu sẵn thay vì nhớ: nghiên cứu về stress cấp tính cho thấy vỏ não trán trước (prefrontal cortex) — vùng xử lý ký ức và ra quyết định — bị ức chế mạnh khi cơ thể trong trạng thái "fight or flight". Hành động đơn giản nhất (gọi số đã lưu) vẫn thực hiện được ngay cả khi hoảng loạn.',
      'Lưu với tên rõ ràng: "115 Cấp Cứu" hoặc "SOS - Cấp Cứu 115". Nếu điện thoại có tính năng ICE (In Case of Emergency), điền thêm thông tin liên lạc khẩn cấp của người thân.',
      'Bật tính năng SOS khẩn cấp: iOS — nhấn nút nguồn 5 lần hoặc giữ nút nguồn + âm lượng để gọi SOS tự động. Android — phụ thuộc nhà sản xuất, thường trong Cài đặt → An toàn và khẩn cấp → SOS khẩn cấp.',
      'Medical ID (iOS) / Thông tin khẩn cấp (Android): điền nhóm máu, dị ứng thuốc, bệnh mạn tính, người liên hệ. Thông tin này hiển thị ngay trên màn hình khóa — nhân viên cấp cứu có thể đọc mà không cần mở khóa điện thoại.',
      'Dạy cả gia đình: trẻ em từ 5–6 tuổi đã có thể học gọi số khẩn cấp nếu được hướng dẫn. Luyện tập tình huống giả định với trẻ (role-play): "Nếu bố/mẹ ngã và không dậy được, con sẽ làm gì?"',
      'Ngoài 115: lưu thêm số bệnh viện gần nhà (khoa cấp cứu), số xe taxi uy tín địa phương (nếu cần đưa đi viện nhanh khi 115 bận), số của ít nhất 2 người thân có thể đến ngay trong 15 phút.',
    ],
    points: [
      { icon: '🧠', label: 'Não hoảng loạn không nhớ số điện thoại', note: 'Lưu sẵn — hành động cứu sống đơn giản nhất' },
      { icon: '🔒', label: 'Medical ID hiển thị ở màn hình khóa', note: 'Nhân viên cấp cứu đọc được ngay — không cần mở khóa' },
      { icon: '👶', label: 'Dạy trẻ từ 5–6 tuổi', note: 'Luyện tập tình huống giả định với trẻ em' },
      { icon: '📋', label: 'Lưu thêm số bệnh viện + người thân', note: 'Tối thiểu 2 người có thể đến trong 15 phút' },
    ],
  },
  {
    icon: '🏥', sign: 'Biết tên và địa chỉ bệnh viện gần nhà nhất có khoa cấp cứu', urgency: 'Tìm hiểu tuần này',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    keyFact: '🏥 "Thời gian cửa đến kim" (door-to-needle) trong đột quỵ và "cửa đến bóng" (door-to-balloon) trong nhồi máu cơ tim là tiêu chuẩn chất lượng y tế — mỗi phút tính từ khi vào viện. Biết trước nơi nào gần và có năng lực xử lý cấp cứu = rút ngắn thời gian quyết định trong lúc hoảng loạn.',
    details: [
      'Phân biệt cơ sở y tế: Trạm y tế phường/xã — sơ cứu cơ bản, không có phẫu thuật. Bệnh viện quận/huyện — cấp cứu cơ bản, một số phẫu thuật. Bệnh viện tỉnh/thành phố — ICU, phẫu thuật phức tạp, đơn vị đột quỵ. Bệnh viện chuyên khoa (Chợ Rẫy, Bạch Mai, Việt Đức) — ca nặng nhất.',
      'Năng lực cần biết: (1) Có khoa cấp cứu 24/7 không? (2) Có đơn vị đột quỵ (stroke unit) không? (3) Có can thiệp mạch vành (PCI) không? — quan trọng cho nhồi máu cơ tim. (4) Có phòng mổ hoạt động 24/7 không?',
      'Lập danh sách 2–3 bệnh viện theo khoảng cách: (1) Gần nhất (< 10 phút) — cho cấp cứu bất kỳ; (2) Bệnh viện có đơn vị đột quỵ/PCI gần nhất; (3) Bệnh viện chuyên khoa nếu cần chuyển viện. Lưu địa chỉ vào Google Maps để dẫn đường ngay.',
      'Giờ kẹt xe và lộ trình thay thế: biết trước đường đi vào giờ cao điểm. Một số bệnh viện có cổng vào khoa cấp cứu riêng — không phải cổng chính. Tìm hiểu và lưu tọa độ GPS cổng cấp cứu (khác với cổng chính).',
      'Thẻ bảo hiểm y tế và phạm vi thanh toán: BHYT thanh toán ở tuyến đúng (xã → huyện → tỉnh → trung ương). Cấp cứu thực sự (nguy hiểm tính mạng) được thanh toán ở bất kỳ tuyến nào kể cả trái tuyến — nhưng cần có giấy tờ hợp lệ.',
      'Lập sơ đồ cấp cứu gia đình: dán trên tủ lạnh hoặc cửa ra vào — danh sách bệnh viện, số điện thoại, địa chỉ, người liên hệ khẩn cấp. Đặc biệt quan trọng nếu trong nhà có người cao tuổi, trẻ nhỏ, hoặc người bệnh mạn tính.',
    ],
    points: [
      { icon: '⏱️', label: 'Mỗi phút tính từ khi vào viện', note: 'Door-to-needle (đột quỵ) và door-to-balloon (tim mạch) là tiêu chuẩn vàng' },
      { icon: '🗺️', label: 'Lưu tọa độ GPS cổng cấp cứu', note: 'Cổng cấp cứu thường khác cổng chính — tìm trước khi cần' },
      { icon: '💳', label: 'Cấp cứu thật được BHYT thanh toán trái tuyến', note: 'Nhưng cần có giấy tờ và xác nhận cấp cứu từ bệnh viện' },
      { icon: '📌', label: 'Dán sơ đồ cấp cứu ở nhà', note: 'Tủ lạnh hoặc cửa ra vào — ai cũng thấy ngay' },
    ],
  },
  {
    icon: '🎒', sign: 'Chuẩn bị túi cấp cứu cơ bản: aspirin, thuốc thường dùng, CCCD, thẻ BHYT', urgency: 'Chuẩn bị trong tuần',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&q=80',
    keyFact: '🎒 Túi cấp cứu không phải "kit sinh tồn" phức tạp — chỉ cần 5 thứ thiết yếu trong 1 túi nhỏ ở vị trí cố định: (1) Aspirin 300mg, (2) Danh sách thuốc đang dùng + dị ứng, (3) CCCD, (4) Thẻ BHYT, (5) Số liên lạc khẩn cấp. Chuẩn bị sẵn = tiết kiệm 5–10 phút trong tình huống mà từng phút có giá trị.',
    details: [
      'Aspirin 300mg: nhai ngay khi nghi nhồi máu cơ tim (nếu không dị ứng). Liều tiêu chuẩn: 300mg nhai (không nuốt nguyên) → hấp thu nhanh hơn 50%. Không dùng nếu có dị ứng aspirin, đang chảy máu tiêu hóa, hoặc không chắc loại đột quỵ. Hạn sử dụng: kiểm tra 6 tháng/lần.',
      'Danh sách thuốc đang dùng (medication list): ghi tên thuốc, liều, lần/ngày, tên bác sĩ kê. Đặc biệt quan trọng: thuốc chống đông (warfarin, xarelto, pradaxa), insulin, thuốc tim mạch, thuốc động kinh. Nhân viên cấp cứu cần biết để tránh tương tác thuốc.',
      'Danh sách dị ứng: ghi rõ dị ứng thuốc (penicillin, aspirin, NSAID...), dị ứng thực phẩm nặng (đậu phộng, hải sản), dị ứng iốt cản quang (quan trọng nếu cần CT/MRI có thuốc). Ghi cả phản ứng cụ thể (nổi mề đay vs. phản vệ).',
      'Tài liệu tùy thân: CCCD/CMND (cần để nhập viện và xác nhận danh tính), thẻ BHYT (hoặc ứng dụng VssID/VNeID có thể thay thẻ vật lý), thẻ tín dụng/ít tiền mặt (đặt cọc viện phí). Chụp ảnh tất cả và lưu trên điện thoại như backup.',
      'Thuốc cấp cứu cá nhân: người hen — ống xịt salbutamol (Ventolin); người tiểu đường — viên glucose (dextrose) cho hạ đường huyết; người dị ứng nặng — bút tiêm epinephrine (EpiPen) nếu có chỉ định; người tim mạch — Nitroglycerin xịt/ngậm nếu đã được kê.',
      'Vị trí và bảo quản: túi cấp cứu ở vị trí CỐ ĐỊNH mà cả nhà đều biết. Kiểm tra 6 tháng/lần: hạn thuốc, tình trạng giấy tờ, cập nhật danh sách thuốc. Không để trong ô tô để tránh nhiệt độ cao làm hỏng thuốc.',
    ],
    points: [
      { icon: '💊', label: 'Aspirin 300mg — nhai khi nghi nhồi máu', note: 'Kiểm tra hạn sử dụng 6 tháng/lần' },
      { icon: '📝', label: 'Danh sách thuốc + dị ứng = quan trọng nhất', note: 'Giúp nhân viên cấp cứu tránh tương tác thuốc nguy hiểm' },
      { icon: '🆔', label: 'CCCD + BHYT + tiền mặt nhỏ', note: 'Chụp ảnh lưu điện thoại như backup' },
      { icon: '📍', label: 'Vị trí cố định — cả nhà đều biết', note: 'Kiểm tra và cập nhật 6 tháng/lần' },
    ],
  },
  {
    icon: '🫀', sign: 'Học cách sơ cứu cơ bản: CPR, hồi sức ngừng thở', urgency: 'Học trong tháng này',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80',
    keyFact: '💪 CPR (Cardiopulmonary Resuscitation — hồi sinh tim phổi) tăng tỷ lệ sống sót sau ngừng tim đột ngột từ 5% lên 40–50% nếu được thực hiện đúng trong 4 phút đầu. Mỗi phút không có CPR = giảm 10% khả năng sống sót. Bạn không cần là bác sĩ — CPR cơ bản có thể học trong 30 phút.',
    details: [
      'Nhận biết ngừng tim: người không phản ứng (lay/gọi không tỉnh), không thở bình thường (không thở hoặc thở ngáp — agonal breathing). Không cần kiểm tra mạch — người thường kiểm tra mạch mất 5–10 giây và thường sai. Nếu không chắc chắn người đang thở bình thường → bắt đầu CPR.',
      'Chuỗi sinh tồn (Chain of Survival): (1) Nhận biết và gọi 115; (2) CPR sớm chất lượng cao; (3) AED (máy sốc tim tự động) sớm; (4) Cấp cứu nâng cao; (5) Chăm sóc sau ngừng tim. Mỗi mắt xích đều quan trọng — CPR và AED là 2 mắt có thể làm trước khi 115 đến.',
      'CPR thực hành: (1) Đặt nạn nhân nằm ngửa trên mặt phẳng cứng; (2) Quỳ bên cạnh ngang ngực; (3) Đặt 2 tay chồng nhau ở giữa ngực dưới (xương ức); (4) Ép ngực sâu 5–6cm, tốc độ 100–120 lần/phút (theo nhịp bài "Stayin\' Alive" của Bee Gees); (5) Để ngực nở hoàn toàn giữa các lần ép; (6) Không dừng trừ khi có người thay hoặc AED về.',
      'Hô hấp nhân tạo (rescue breathing): theo AHA 2020, CPR chỉ ép ngực (Hands-Only CPR) đủ hiệu quả cho người lớn ngừng tim đột ngột do tim mạch trong 5–10 phút đầu. Hô hấp nhân tạo cần thiết hơn cho: trẻ em, ngạt nước, ngộ độc, ngừng thở do nguyên nhân hô hấp.',
      'AED (Automated External Defibrillator — máy sốc tim tự động): thiết bị phân tích nhịp tim tự động và hướng dẫn bằng giọng nói. Chỉ sốc nếu phát hiện rung thất (VF/VT) — không sốc nếu nhịp tim bình thường hay vô tâm thu. Tìm AED: sân bay, trung tâm thương mại, phòng gym, một số tòa nhà văn phòng. Học cách dùng trước khi cần.',
      'Học CPR ở đâu: AHA/Hội Tim mạch Việt Nam tổ chức lớp BLS (Basic Life Support) 4 giờ, chứng chỉ 2 năm. Nhiều bệnh viện tổ chức lớp miễn phí cho cộng đồng. Xem video hướng dẫn AHA trên YouTube như phương án tạm thời — nhưng không thay thế thực hành trực tiếp trên manikin.',
    ],
    points: [
      { icon: '⏱️', label: 'Mỗi phút không CPR = -10% sống sót', note: 'Bắt đầu ngay — CPR sai vẫn tốt hơn không làm' },
      { icon: '🎵', label: '100–120 lần/phút = nhịp "Stayin\' Alive"', note: 'Bài hát của Bee Gees có nhịp đúng chuẩn CPR' },
      { icon: '⚡', label: 'Tìm AED ở nơi công cộng', note: 'Sân bay, trung tâm thương mại, phòng gym — học dùng trước' },
      { icon: '🎓', label: 'Học BLS 4 giờ = chứng chỉ 2 năm', note: 'AHA / Hội Tim mạch Việt Nam — nhiều lớp miễn phí' },
    ],
  },
];

function SoonModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.sign} className="w-full h-full object-cover" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>{item.urgency}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-4 leading-snug" style={{ color: item.color }}>{item.sign}</h2>
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
            >{p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function EmergencyModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.18)` }}
        onClick={e => e.stopPropagation()}>
        {/* Hero image */}
        <div className="relative h-48 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.1) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
              {item.icon}
            </div>
            <span className="text-xs font-black px-3 py-1 rounded-full" style={{ background: item.color, color: 'white' }}>{item.tag}</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.title}</h2>

          {/* keyFact */}
          <div className="rounded-2xl px-4 py-3 mb-5 text-sm leading-relaxed" style={{ background: `rgba(${item.rgb},0.08)`, borderLeft: `3px solid ${item.color}`, color: 'rgba(229,231,235,0.88)' }}>
            {item.keyFact}
          </div>

          {/* Signs */}
          <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: item.color }}>Dấu hiệu nhận biết</h3>
          <ul className="space-y-2 mb-4">
            {item.signs.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed" style={{ color: 'rgba(229,231,235,0.85)' }}>
                <span style={{ color: item.color }} className="shrink-0 mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>

          {/* Note */}
          {item.note && (
            <p className="text-sm mb-4 pl-3 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)', borderLeft: `2px solid rgba(${item.rgb},0.4)` }}>{item.note}</p>
          )}

          {/* Action CTA */}
          <div className="rounded-xl p-3 text-sm font-bold mb-6" style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>
            → {item.action}
          </div>

          {/* Detailed info */}
          <h3 className="font-bold text-sm uppercase tracking-widest mb-3" style={{ color: item.color }}>Thông tin chuyên sâu</h3>
          <ul className="space-y-3 mb-8">
            {item.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${item.rgb},0.14)`, color: item.color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points grid */}
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

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >{p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
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
      const el = document.getElementById(`reveal-rf-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-rf-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthRedFlagsPage() {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const emergencyGroups = EMERGENCY_GROUPS.map((g, i) => ({...g, ...(p.rf_groups_tr?.[i] || {})}));
  const soonSigns = SOON_SIGNS.map((s, i) => ({...s, ...(p.rf_soon_tr?.[i] || {})}));
  const prepItems = PREP_ITEMS.map((item, i) => { const tr = p.rf_prep_tr?.[i] || {}; return {...item, ...tr, ...(tr.title ? { sign: tr.title } : {})}; });
  const [emergencyModal, setEmergencyModal] = useState(null);
  const [soonModal, setSoonModal] = useState(null);
  const [prepModal, setPrepModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eRfOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eRfOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🚨</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{p.rf_h1 || 'Dấu Hiệu Nguy Hiểm'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {p.rf_badge || 'Nhận biết khẩn cấp · Cấp cứu đúng lúc'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Nhận biết đúng các dấu hiệu nguy hiểm có thể cứu sống bạn hoặc người thân. Ghi nhớ: <strong className="text-text">khi nghi ngờ — gọi 115</strong>. Không chờ đợi khi triệu chứng nghiêm trọng.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80&auto=format&fit=crop" alt="Cấp cứu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {p.rf_caption || 'Gọi 115 khi nghi ngờ'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Emergency banner */}
      <RevealBlock delay={0} className="mb-10">
        <div className="rounded-2xl border-2 p-4 text-center" style={{ borderColor: COLOR, background: `rgba(${RGB},0.07)` }}>
          <div className="text-3xl font-black text-white mb-1">115</div>
          <div className="text-lg font-bold" style={{ color: COLOR }}>Số cấp cứu toàn quốc — Miễn phí 24/7</div>
          <p className="text-base text-muted mt-1">Hoặc nhờ ai đó đưa đến khoa cấp cứu bệnh viện gần nhất</p>
        </div>
      </RevealBlock>

      {/* Emergency groups */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.rf_s1_h2 || 'Cấp Cứu Ngay Lập Tức'}</h2>
        <p className="text-muted text-lg mb-6">Các tình trạng dưới đây đòi hỏi xử lý trong phút — không phải giờ.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {emergencyGroups.map((g, i) => (
            <div key={i}
              onClick={() => setEmergencyModal(i)}
              className="rounded-2xl border overflow-hidden cursor-pointer transition-all"
              style={{ borderColor: `rgba(${g.rgb},0.28)` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.6)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${g.rgb},0.28)`; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="flex items-center gap-3 p-4" style={{ background: `rgba(${g.rgb},0.08)` }}>
                <span className="text-3xl">{g.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: g.color }}>{g.title}</div>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded-full shrink-0" style={{ background: g.color, color: 'white' }}>{g.tag}</span>
              </div>
              <div className="p-4">
                <ul className="space-y-1 mb-3">
                  {g.signs.slice(0, 3).map((s, j) => (
                    <li key={j} className="flex gap-2 text-sm" style={{ color: 'rgba(209,213,219,0.85)' }}>
                      <span style={{ color: g.color }} className="shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                  {g.signs.length > 3 && (
                    <li className="text-xs pl-4" style={{ color: `rgba(${g.rgb},0.7)` }}>+{g.signs.length - 3} dấu hiệu khác...</li>
                  )}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: `rgba(${g.rgb},0.7)` }}>Click để xem chi tiết & cách xử lý</span>
                  <span style={{ color: g.color }} className="text-sm font-bold">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Soon signs */}
      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.rf_s2_h2 || 'Cần Đi Khám Sớm'}</h2>
        <p className="text-muted text-lg mb-6">Các dấu hiệu này không cần vào cấp cứu ngay nhưng cần đặt lịch khám trong thời gian ngắn. Click để xem chi tiết.</p>
        <div className="space-y-2">
          {soonSigns.map((s, i) => (
            <div key={i}
              onClick={() => setSoonModal(i)}
              className="rounded-2xl border bg-surface p-4 flex items-center gap-4 cursor-pointer transition-all"
              style={{ borderColor: `rgba(${s.rgb},0.2)` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${s.rgb},0.55)`; e.currentTarget.style.transform = 'translateX(4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${s.rgb},0.2)`; e.currentTarget.style.transform = 'translateX(0)'; }}>
              <span className="text-xl shrink-0">{s.icon}</span>
              <p className="flex-1 text-sm" style={{ color: 'rgba(229,231,235,0.9)' }}>{s.sign}</p>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded-full border" style={{ color: s.color, borderColor: `rgba(${s.rgb},0.3)`, background: `rgba(${s.rgb},0.1)` }}>{s.urgency}</span>
              <span className="text-sm shrink-0 ml-1" style={{ color: s.color }}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: COLOR }}>{p.rf_s3_h2 || 'Chuẩn Bị Sẵn Sàng'}</h2>
        <p className="text-muted text-sm mb-5">4 việc cần làm ngay — click để xem hướng dẫn chi tiết</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {prepItems.map((p, i) => (
            <div key={i}
              onClick={() => setPrepModal(i)}
              className="rounded-2xl border bg-surface p-4 flex gap-3 cursor-pointer transition-all"
              style={{ borderColor: `rgba(${p.rgb},0.22)` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `rgba(${p.rgb},0.55)`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `rgba(${p.rgb},0.22)`; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <span className="text-2xl shrink-0">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-1" style={{ color: p.color }}>{p.sign}</div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `rgba(${p.rgb},0.12)`, color: p.color }}>{p.urgency}</span>
              </div>
              <span className="text-sm shrink-0 self-center" style={{ color: p.color }}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-base text-muted mb-6">⚠ Nội dung chỉ mang tính giáo dục. Không thay thế khám và điều trị y tế.</p>
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← {p.sub_back_footer || 'Quay lại Kiến Thức Sức Khỏe'}</Link>

      {prepModal !== null && (
        <SoonModal
          item={prepItems[prepModal]}
          idx={prepModal}
          total={prepItems.length}
          onClose={() => setPrepModal(null)}
          onPrev={() => setPrepModal(i => Math.max(0, i - 1))}
          onNext={() => setPrepModal(i => Math.min(prepItems.length - 1, i + 1))}
          hasPrev={prepModal > 0}
          hasNext={prepModal < prepItems.length - 1}
        />
      )}
      {soonModal !== null && (
        <SoonModal
          item={soonSigns[soonModal]}
          idx={soonModal}
          total={soonSigns.length}
          onClose={() => setSoonModal(null)}
          onPrev={() => setSoonModal(i => Math.max(0, i - 1))}
          onNext={() => setSoonModal(i => Math.min(soonSigns.length - 1, i + 1))}
          hasPrev={soonModal > 0}
          hasNext={soonModal < soonSigns.length - 1}
        />
      )}
      {emergencyModal !== null && (
        <EmergencyModal
          item={emergencyGroups[emergencyModal]}
          idx={emergencyModal}
          total={emergencyGroups.length}
          onClose={() => setEmergencyModal(null)}
          onPrev={() => setEmergencyModal(i => Math.max(0, i - 1))}
          onNext={() => setEmergencyModal(i => Math.min(emergencyGroups.length - 1, i + 1))}
          hasPrev={emergencyModal > 0}
          hasNext={emergencyModal < emergencyGroups.length - 1}
        />
      )}
    </div>
  );
}
