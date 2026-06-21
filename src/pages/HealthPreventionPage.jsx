import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#0ea5e9';
const RGB = '14,165,233';
const ORBIT_ID = 'e-prev-orbit-kf';
const ORBIT_CLASS = 'e-prev-orbit-ring';
const ORBIT_PROP = '--e-prev-orbit-angle';

const PREVENTION_PILLARS = [
  {
    num: '01', icon: '🏃', title: 'Vận Động Đủ',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    items: [
      '150 phút/tuần cường độ vừa (đi bộ nhanh, bơi lội, đạp xe)',
      'Hoặc 75 phút/tuần cường độ cao (chạy, aerobics)',
      '2 ngày/tuần tập sức mạnh tất cả nhóm cơ chính',
      'Giảm thời gian ngồi — đứng dậy đi lại mỗi 30–60 phút',
    ],
    evidence: 'Giảm 35% nguy cơ bệnh tim mạch, 25% nguy cơ ung thư đại tràng, 50% nguy cơ tiểu đường type 2',
    keyFact: '🏃 WHO khuyến nghị 150 phút/tuần vận động cường độ vừa không phải con số ngẫu nhiên — đây là mức tối thiểu được xác định từ hàng trăm nghiên cứu lớn để giảm có ý nghĩa nguy cơ tử vong sớm và bệnh mãn tính. Tin tốt: ngay cả 10–15 phút/ngày đã có lợi rõ rệt so với không vận động gì.',
    details: [
      '150 phút/tuần cường độ vừa — cơ sở bằng chứng: khuyến nghị này dựa trên meta-analysis tổng hợp hơn 80 nghiên cứu với hàng triệu người tham gia. "Cường độ vừa" nghĩa là tim đập nhanh hơn, thở nhanh hơn nhưng vẫn nói chuyện được — tương đương đi bộ nhanh 5–6km/h, đạp xe nhẹ, bơi lội thong thả. 150 phút = 30 phút/ngày × 5 ngày, hoặc có thể chia nhỏ thành 3 lần 10 phút/ngày — hiệu quả tương đương.',
      'Tập sức mạnh 2 ngày/tuần — vì sao quan trọng không kém cardio: cardio tốt cho tim mạch và đốt calo, nhưng tập sức mạnh (resistance training) bảo vệ khối cơ, mật độ xương, và chuyển hóa. Sau 30 tuổi, cơ thể mất 3–8% khối cơ mỗi thập kỷ nếu không tập. Khối cơ cao liên quan đến: giảm nguy cơ tiểu đường type 2 (cơ là kho dự trữ glucose lớn nhất), giảm nguy cơ té ngã ở người cao tuổi, và tuổi thọ dài hơn độc lập với các yếu tố khác.',
      'Hành vi ngồi — "nguy hiểm độc lập" dù bạn tập đủ: nghiên cứu Biswas et al. (2015) trong Annals of Internal Medicine: thời gian ngồi nhiều liên quan đến tăng nguy cơ tim mạch, tiểu đường type 2, và tử vong — kể cả ở người đáp ứng đủ 150 phút/tuần. Ngồi > 8h/ngày tăng 90% nguy cơ tử vong do tiểu đường type 2. Giải pháp không cần tập gym: đứng dậy 2–3 phút mỗi 30–60 phút, đi bộ khi gọi điện, đứng khi họp.',
      'Liều-đáp ứng: nhiều hơn có tốt hơn không? Có, nhưng đến điểm giảm dần lợi ích. Từ 0 → 150 phút/tuần: giảm 35% nguy cơ tử vong sớm. Từ 150 → 300 phút/tuần: thêm 17% giảm nguy cơ. Trên 300 phút/tuần: lợi ích thêm rất nhỏ, và ở mức cực cao (> 600 phút/tuần cường độ cao) có thể tăng nhẹ nguy cơ rung nhĩ. Người không tập gì: bắt đầu với 10 phút/ngày — đây là mức lợi ích bắt đầu xuất hiện.',
      'Vận động và sức khỏe tâm thần — bằng chứng mạnh: meta-analysis (Schuch et al., 2016) trên 33 RCT: vận động hiệu quả tương đương thuốc chống trầm cảm cho trầm cảm nhẹ–vừa. Cơ chế: tăng BDNF (brain-derived neurotrophic factor — "phân bón" cho não), tăng endorphin và serotonin, giảm cortisol (hormone stress), và cải thiện giấc ngủ. WHO 2022 bổ sung khuyến nghị vận động cho cải thiện sức khỏe tâm thần và nhận thức.',
      'Rào cản phổ biến và giải pháp thực tế: "Không có thời gian" — 3 × 10 phút hiệu quả như 1 × 30 phút; leo cầu thang, đi bộ đến chỗ làm gần hơn đều tính. "Đau khớp/chấn thương" — bơi lội và đạp xe không tạo lực lên khớp, yoga và Pilates tốt cho linh hoạt. "Mất động lực" — nghiên cứu cho thấy tập cùng người khác tăng adherence (tuân thủ) lên 25–40%. "Không biết bắt đầu từ đâu" — đi bộ 10 phút/ngày là đủ để khởi đầu.',
    ],
    points: [
      { icon: '⏱️', label: '10 phút/ngày đủ để bắt đầu — không cần gym', note: 'Từ 0 → 150 phút/tuần: giảm 35% nguy cơ tử vong sớm — lợi ích lớn nhất' },
      { icon: '💪', label: 'Sức mạnh 2×/tuần bảo vệ cơ và xương — không chỉ cardio', note: 'Sau 30 tuổi mất 3–8% khối cơ/thập kỷ nếu không tập sức mạnh' },
      { icon: '🪑', label: 'Ngồi > 8h/ngày tăng 90% nguy cơ tiểu đường — dù đã tập đủ', note: 'Đứng dậy mỗi 30–60 phút — đặt nhắc nhở điện thoại' },
      { icon: '🧠', label: 'Vận động hiệu quả như thuốc chống trầm cảm (trầm cảm nhẹ–vừa)', note: 'Tăng BDNF, serotonin, giảm cortisol — lợi ích tâm thần rõ rệt' },
    ],
  },
  {
    num: '02', icon: '🥗', title: 'Dinh Dưỡng Cân Bằng',
    color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    items: [
      'Ăn ≥ 5 phần rau/trái cây mỗi ngày',
      'Ưu tiên ngũ cốc nguyên hạt thay bột trắng',
      'Hạn chế thịt đỏ chế biến sẵn (< 500g/tuần)',
      'Giảm muối (< 5g/ngày), đường thêm (< 25g/ngày)',
      'Ăn cá béo 2 lần/tuần',
    ],
    evidence: 'Chế độ ăn lành mạnh giảm 80% nguy cơ bệnh tim mạch sớm',
    keyFact: '🥗 Nghiên cứu PREDIMED (Spain, 7.447 người, 5 năm): chế độ ăn Địa Trung Hải giảm 30% nguy cơ tim mạch nặng so với chế độ ăn ít chất béo. Đây là một trong những bằng chứng RCT mạnh nhất về dinh dưỡng và sức khỏe tim mạch — thức ăn thực sự có thể phòng bệnh hiệu quả như thuốc.',
    details: [
      '≥ 5 phần rau/trái cây mỗi ngày — "5 a day": mỗi "phần" = 80g rau/trái cây tươi, hoặc 30g sấy khô, hoặc 150ml nước ép (chỉ tính 1 phần/ngày dù uống bao nhiêu). Nghiên cứu Imperial College London (2017) tổng hợp 95 nghiên cứu: 10 phần/ngày giảm 28% nguy cơ tim mạch, 13% nguy cơ ung thư, 31% nguy cơ tử vong sớm so với 0 phần. Cơ chế: chất xơ (tốt cho vi khuẩn đường ruột), polyphenol (chống oxy hóa), folate, kali, và vitamin.',
      'Ngũ cốc nguyên hạt vs tinh chế — sự khác biệt quan trọng: gạo trắng, bột mì trắng, bánh mì trắng là hạt ngũ cốc đã loại bỏ cám và mầm — chỉ còn nội nhũ giàu tinh bột. Ngũ cốc nguyên hạt (gạo lứt, yến mạch, lúa mì nguyên cám) giữ nguyên cả 3 phần. Lợi ích: chỉ số glycemic thấp hơn (đường máu tăng chậm hơn), nhiều chất xơ và vi chất hơn. Systematic review (2016) Lancet: 3 phần ngũ cốc nguyên hạt/ngày giảm 20–30% nguy cơ tim mạch, 20% nguy cơ ung thư đại tràng.',
      'Thịt đỏ chế biến sẵn — giới hạn 500g/tuần (thịt đỏ chưa chế biến): IARC (Cơ quan Nghiên cứu Ung thư Quốc tế) phân loại thịt chế biến (xúc xích, thịt hun khói, thịt hộp) là "Group 1 — gây ung thư" (có bằng chứng đủ mạnh). Thịt đỏ chưa chế biến: "Group 2A — có thể gây ung thư". Ăn 50g thịt chế biến sẵn/ngày (khoảng 2 lát xúc xích) tăng 18% nguy cơ ung thư đại tràng. Khuyến nghị WHO: hạn chế, không cần loại bỏ hoàn toàn.',
      'Muối < 5g/ngày — huyết áp và đột quỵ: người Việt Nam trung bình tiêu thụ 9–10g muối/ngày — gần gấp đôi khuyến nghị WHO. 75% muối đến từ thực phẩm chế biến (nước mắm, tương ớt, thực phẩm đóng gói), không phải muối thêm khi nấu. Giảm 3g muối/ngày giảm huyết áp tâm thu 3–4 mmHg và giảm 13% nguy cơ đột quỵ (ước tính từ meta-analysis). Đường thêm < 25g/ngày (WHO): 1 lon nước ngọt = ~35g đường thêm — đã vượt mức khuyến nghị.',
      'Cá béo 2 lần/tuần — Omega-3 và sức khỏe tim: cá hồi, cá mòi, cá thu, cá ngừ chứa EPA và DHA — hai loại Omega-3 chuỗi dài có hoạt tính sinh học mạnh. Tác dụng: giảm triglyceride (30–40% ở liều cao), giảm viêm, hỗ trợ nhịp tim đều. GISSI-Prevenzione trial: 1g Omega-3/ngày sau nhồi máu cơ tim giảm 45% tử vong đột ngột. Với người ăn chay: tảo biển là nguồn DHA thực vật thay thế.',
      'Mô hình ăn uống quan trọng hơn thực phẩm đơn lẻ: không có "superfood" nào — chế độ ăn tổng thể quan trọng hơn. Chế độ Địa Trung Hải (rau, trái cây, ngũ cốc nguyên hạt, dầu olive, cá, hạt, ít thịt đỏ) là mô hình được nghiên cứu nhiều nhất và cho kết quả nhất quán. DASH (Dietary Approaches to Stop Hypertension): hiệu quả giảm huyết áp tương đương thuốc nhẹ. Với người Việt Nam: cơm gạo lứt, nhiều rau xanh, đậu hũ, cá — đã gần với mô hình lành mạnh, cần giảm muối và đường.',
    ],
    points: [
      { icon: '🫐', label: '10 phần rau/quả/ngày: giảm 31% tử vong sớm', note: 'Mỗi phần = 80g — 5 phần là mức tối thiểu, 10 phần là tối ưu' },
      { icon: '🌾', label: 'Ngũ cốc nguyên hạt: giảm 30% nguy cơ tim mạch', note: 'Gạo lứt, yến mạch, lúa mì nguyên cám — đổi từ trắng sang nâu là đủ' },
      { icon: '🧂', label: 'Người Việt ăn 9–10g muối/ngày — gấp đôi khuyến nghị', note: '75% từ nước mắm, tương, thực phẩm đóng gói — không phải muối thêm' },
      { icon: '🐟', label: 'Cá béo 2×/tuần: Omega-3 giảm 45% tử vong đột ngột sau nhồi máu', note: 'Cá hồi, cá mòi, cá thu, cá ngừ — nguồn EPA/DHA tốt nhất' },
    ],
  },
  {
    num: '03', icon: '😴', title: 'Ngủ Đủ Chất Lượng',
    color: '#8b5cf6', rgb: '139,92,246',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
    items: [
      'Ngủ 7–9 tiếng/đêm (người trưởng thành)',
      'Đi ngủ và thức dậy cùng giờ mỗi ngày kể cả cuối tuần',
      'Tắt màn hình 1 giờ trước khi ngủ',
      'Nhiệt độ phòng 18–21°C tối ưu cho giấc ngủ',
    ],
    evidence: 'Ngủ < 6h/đêm tăng 200% nguy cơ cảm lạnh, tăng 48% nguy cơ bệnh tim',
    keyFact: '😴 Không có cơ quan nào trong cơ thể — từ não đến hệ miễn dịch đến tim — hoạt động tốt khi thiếu ngủ. Matthew Walker (Why We Sleep, 2017): "Không có khía cạnh nào của sức khỏe con người mà thiếu ngủ không làm suy giảm." Giấc ngủ không phải "lãng phí thời gian" — là quá trình sửa chữa tích cực nhất mà cơ thể tự làm.',
    details: [
      '7–9 tiếng — tại sao không thể "bù ngủ cuối tuần": nghiên cứu Buysse và cộng sự: "bù ngủ" cuối tuần không khôi phục hoàn toàn chức năng nhận thức bị suy giảm do thiếu ngủ trong tuần. Hơn nữa, ngủ nhiều cuối tuần phá vỡ đồng hồ sinh học (circadian rhythm) — tạo ra "jet lag xã hội". Nghiên cứu Spiegel et al. (1999): chỉ 6 ngày ngủ 4h/đêm gây ra tình trạng tương đương rối loạn tiền tiểu đường ở người khỏe mạnh.',
      'Đồng hồ sinh học (Circadian Clock) — khoa học đằng sau giờ ngủ đều đặn: mọi tế bào trong cơ thể có "đồng hồ" riêng đồng bộ theo ánh sáng mặt trời. SCN (suprachiasmatic nucleus) trong não điều phối tất cả. Melatonin tiết ra khi tối, đạt đỉnh lúc 2–4 giờ sáng. Nhiệt độ cơ thể giảm 0.5–1°C trong giấc ngủ. Cortisol tăng vào sáng sớm để chuẩn bị thức dậy. Phá vỡ đồng hồ sinh học (làm đêm, ngủ giờ khác nhau) liên quan đến tăng nguy cơ ung thư (IARC phân loại làm ca đêm là "probable carcinogen").',
      'Ánh sáng xanh từ màn hình — cơ chế tác hại: ánh sáng xanh (400–500nm) từ smartphone, tablet, laptop ức chế melatonin mạnh hơn ánh sáng thông thường. Nghiên cứu Harvard (2015): ánh sáng xanh ức chế melatonin gấp đôi so với ánh sáng xanh lá, và kéo dài chu kỳ circadian thêm 3 giờ. Hậu quả: khó vào giấc, ngủ ít sâu, giảm giấc ngủ REM. Giải pháp: Night Mode/True Tone giảm ánh sáng xanh, kính chặn ánh sáng xanh, hoặc đơn giản nhất là tắt màn hình 60 phút trước giờ ngủ.',
      'Nhiệt độ phòng 18–21°C — khoa học giảm thân nhiệt: não cần giảm nhiệt độ cơ thể 1–3°C để vào và duy trì giấc ngủ. Nhiệt độ phòng lý tưởng 18.3°C (65°F) theo Walker — lạnh hơn nhiều người nghĩ. Tắm nước ấm 1–2 giờ trước khi ngủ nghịch lý lại giúp ngủ tốt hơn: cơ thể phản ứng bằng cách giải phóng nhiệt ra ngoài da → thân nhiệt lõi giảm → báo hiệu não đến giờ ngủ. Chân lạnh khó ngủ vì: lưu thông máu ở ngoại vi giúp điều nhiệt.',
      'Thiếu ngủ và hệ miễn dịch: nghiên cứu Prather et al. (2015, Carnegie Mellon): người ngủ < 6h/đêm có nguy cơ nhiễm rhinovirus (cảm lạnh) cao gấp 4.2 lần so với người ngủ ≥ 7h — sau khi kiểm soát các yếu tố khác. Trong giấc ngủ sâu (NREM): hệ miễn dịch "lưu trữ" ký ức miễn dịch từ vaccine và nhiễm trùng. Thiếu ngủ giảm hoạt động tế bào NK (natural killer cell) — tuyến phòng thủ đầu tiên chống ung thư và nhiễm trùng.',
      'Giấc ngủ và não — glymphatic system: 2012, Maiken Nedergaard (Univ. Rochester) phát hiện hệ thống glymphatic — kênh dịch não tủy rửa "rác" độc hại khỏi não trong khi ngủ, bao gồm beta-amyloid (liên quan Alzheimer). Hệ thống này hoạt động 10× mạnh hơn lúc ngủ so với lúc thức. Thiếu ngủ mãn tính → tích lũy beta-amyloid → tăng nguy cơ Alzheimer. Đây là lý do ngủ đủ giấc được xem là chiến lược phòng ngừa Alzheimer quan trọng.',
    ],
    points: [
      { icon: '🕐', label: 'Bù ngủ cuối tuần không hoàn nguyên chức năng nhận thức', note: '"Jet lag xã hội" từ ngủ không đều: phá vỡ circadian rhythm' },
      { icon: '📱', label: 'Ánh sáng xanh ức chế melatonin × 2, kéo dài circadian 3h', note: 'Tắt màn hình 60 phút trước ngủ hoặc bật Night Mode' },
      { icon: '🌡️', label: '18–21°C: não cần giảm thân nhiệt 1–3°C để vào giấc ngủ', note: 'Tắm nước ấm 1–2h trước ngủ giúp thân nhiệt lõi giảm nhanh hơn' },
      { icon: '🧹', label: 'Glymphatic system: não rửa sạch beta-amyloid (Alzheimer) khi ngủ', note: 'Thiếu ngủ mãn tính → tích lũy beta-amyloid → tăng nguy cơ Alzheimer' },
    ],
  },
  {
    num: '04', icon: '🧘', title: 'Quản Lý Stress',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    items: [
      'Thực hành kỹ thuật thư giãn hàng ngày (thở sâu, thiền)',
      'Duy trì kết nối xã hội và quan hệ hỗ trợ',
      'Đặt ranh giới công việc — nghỉ đủ giờ',
      'Tìm kiếm hỗ trợ tâm lý khi cần thiết',
    ],
    evidence: 'Stress mãn tính tăng nguy cơ bệnh tim 40%, làm suy yếu hệ miễn dịch',
    keyFact: '🧘 Stress không phải chỉ là cảm giác — nó là phản ứng sinh lý toàn thân kích hoạt cortisol và adrenaline. Stress cấp tính (ngắn hạn) thực sự có lợi. Vấn đề là stress mãn tính: khi hệ thống cảnh báo khẩn cấp không bao giờ được tắt — đây là kẻ giết người im lặng trong xã hội hiện đại.',
    details: [
      'Sinh lý học của stress — cortisol và "fight or flight": khi não nhận tín hiệu đe dọa (dù là hổ hay email từ sếp), HPA axis (hypothalamic-pituitary-adrenal) kích hoạt → cortisol và adrenaline tăng vọt. Tác dụng tức thì: tim đập nhanh, đường huyết tăng (cung cấp năng lượng cho cơ), miễn dịch ức chế tạm thời (ưu tiên "chiến đấu" trước). Đây là cơ chế sinh tồn hoàn hảo cho nguy hiểm cấp tính. Vấn đề: cơ thể không phân biệt được "hổ thật" với "deadline công việc" — kích hoạt cùng phản ứng, nhiều lần mỗi ngày.',
      'Stress mãn tính — tác hại toàn diện: tim mạch: cortisol mãn tính tăng huyết áp, tăng LDL, thúc đẩy xơ vữa động mạch → tăng 40% nguy cơ bệnh tim. Hệ miễn dịch: ức chế tế bào NK và lymphocyte → dễ nhiễm trùng hơn, vaccine kém hiệu quả hơn. Tiêu hóa: ức chế hệ phó giao cảm → giảm tiêu hóa, gây IBS và GERD. Não: cortisol mãn tính làm co hippocampus (trung tâm ký ức) — ảnh hưởng học tập và trí nhớ dài hạn.',
      'Thở sâu — kỹ thuật đơn giản nhất với bằng chứng mạnh nhất: thở chậm (6 hơi/phút — thay vì 15–20 hơi/phút bình thường) kích hoạt dây thần kinh phế vị (vagus nerve) → kích hoạt hệ phó giao cảm → "rest and digest". Kỹ thuật 4-7-8: hít 4 giây, nín 7 giây, thở ra 8 giây. Box breathing (Navy SEAL dùng): hít 4s → nín 4s → thở ra 4s → nín 4s. Nghiên cứu: 10 phút thở sâu/ngày giảm cortisol, huyết áp, và cải thiện biến thiên nhịp tim (HRV).',
      'Thiền Mindfulness — bằng chứng từ RCT: MBSR (Mindfulness-Based Stress Reduction, Jon Kabat-Zinn, 1979) là chương trình 8 tuần được nghiên cứu nhiều nhất. Meta-analysis (Khoury 2015): MBSR giảm đáng kể lo âu, trầm cảm, và đau mãn tính. Thay đổi não bộ đo được bằng fMRI: tăng mật độ chất xám ở hippocampus (học tập, trí nhớ), giảm hoạt động amygdala (trung tâm sợ hãi). Ngay cả 10 phút/ngày trong 8 tuần cho thấy thay đổi đo được — không cần nhiều giờ mỗi ngày.',
      'Kết nối xã hội — yếu tố sức khỏe bị đánh giá thấp nhất: nghiên cứu Harvard Study of Adult Development (80+ năm, bắt đầu 1938): mối quan hệ xã hội chất lượng là yếu tố dự đoán mạnh nhất về sức khỏe và hạnh phúc ở tuổi già — mạnh hơn cholesterol, BMI, hay thói quen tập thể dục. Holt-Lunstad (2015, PLOS Medicine) meta-analysis: đơn độc xã hội tăng nguy cơ tử vong sớm 29% — tương đương hút 15 điếu thuốc/ngày. Tương tác xã hội thực (face-to-face) hiệu quả hơn mạng xã hội ảo.',
      'Ranh giới công việc — từ bằng chứng đến thực hành: "Always on" culture: nhận email/tin nhắn công việc sau giờ làm kéo dài phản ứng stress. Nghiên cứu (Sousa-Uva et al.): chỉ nhận thông báo công việc ngoài giờ tăng cortisol và giảm chất lượng giấc ngủ — dù không phản hồi. "Right to disconnect" — xu hướng pháp luật tại Pháp, Đức, Bỉ: nhân viên có quyền không phản hồi ngoài giờ. Thực hành: tắt thông báo email/Slack sau 18–19h, không kiểm tra điện thoại 30 phút đầu buổi sáng.',
    ],
    points: [
      { icon: '🫁', label: 'Thở 6 hơi/phút: kích hoạt vagus nerve, giảm cortisol ngay', note: 'Box breathing: hít 4s → nín 4s → thở 4s → nín 4s — Navy SEAL dùng' },
      { icon: '🧘', label: '10 phút thiền/ngày × 8 tuần: thay đổi não bộ đo được bằng fMRI', note: 'Tăng hippocampus, giảm amygdala — không cần nhiều giờ mỗi ngày' },
      { icon: '👥', label: 'Đơn độc xã hội = hút 15 điếu thuốc/ngày về nguy cơ tử vong', note: 'Mối quan hệ chất lượng là yếu tố tiên đoán sức khỏe mạnh nhất tuổi già' },
      { icon: '📵', label: 'Thông báo công việc ngoài giờ tăng cortisol dù không phản hồi', note: 'Tắt thông báo sau 18–19h — "right to disconnect" có bằng chứng khoa học' },
    ],
  },
  {
    num: '05', icon: '🚭', title: 'Không Hút Thuốc & Hạn Chế Rượu',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    items: [
      'Không hút thuốc lá — không có mức "an toàn"',
      'Hạn chế rượu: ≤ 1 đơn vị/ngày nữ, ≤ 2 đơn vị/ngày nam',
      '1 đơn vị = 350ml bia 5% = 150ml rượu vang = 45ml rượu mạnh',
      'Tránh hút thuốc thụ động hoàn toàn',
    ],
    evidence: 'Hút thuốc gây 30% tử vong do ung thư. Bỏ thuốc giúp sống thêm 10 năm',
    keyFact: '🚭 Hút thuốc là nguyên nhân tử vong có thể phòng ngừa hàng đầu thế giới — giết chết 8 triệu người mỗi năm (WHO). Với rượu: năm 2018, Lancet công bố phân tích 195 quốc gia — "mức an toàn của rượu là 0". Không có "một ly vang mỗi tối tốt cho tim" — đây là myth từ nghiên cứu quan sát có nhiều confounders.',
    details: [
      'Thuốc lá — không có mức an toàn (không giống hầu hết các chất khác): khói thuốc chứa hơn 7.000 hóa chất, trong đó ít nhất 70 chất gây ung thư (carcinogens). Nicotine gây nghiện mạnh (tương đương heroin về tốc độ gây nghiện) nhưng không phải nguyên nhân chính gây ung thư — carbon monoxide, benzene, formaldehyde, arsenic và nhiều chất khác trong khói đốt mới là thủ phạm chính. Ngay cả 1 điếu/ngày (không phải "hút nhẹ") tăng 50% nguy cơ bệnh tim và 40% nguy cơ đột quỵ.',
      'Bỏ thuốc — thay đổi ngay và lâu dài: trong 20 phút bỏ thuốc: huyết áp và nhịp tim giảm về bình thường. Sau 12 giờ: CO trong máu giảm, oxygen tăng. Sau 2–12 tuần: tuần hoàn cải thiện, phế quản thư giãn. Sau 1 năm: nguy cơ bệnh tim giảm một nửa. Sau 5 năm: nguy cơ đột quỵ giảm bằng người không hút. Sau 10 năm: nguy cơ ung thư phổi giảm một nửa. Bỏ thuốc ở bất kỳ tuổi nào đều có lợi — không bao giờ quá muộn.',
      'Thuốc lá điện tử (vape/e-cigarette) — không phải "an toàn hơn": EVALI (e-cigarette or vaping-associated lung injury): năm 2019–2020, Mỹ ghi nhận 2.807 ca nhập viện và 68 tử vong liên quan EVALI — phần lớn do vitamin E acetate trong dầu vape có THC. Ngoài ra, aerosol từ vape chứa nicotine (gây nghiện), kim loại nặng (chì, niken từ cuộn đốt), và các hóa chất hương liệu chưa được đánh giá đủ dài hạn. WHO không khuyến nghị vape như công cụ cai thuốc. Bupropion và Varenicline (Champix) có bằng chứng mạnh nhất để cai thuốc lá.',
      'Rượu và ung thư — mối liên hệ bị hiểu nhầm: IARC xếp rượu là "Group 1 — gây ung thư" (bằng chứng đủ). 7 loại ung thư liên quan rõ ràng: miệng, họng, thanh quản, thực quản, gan, đại tràng, và vú. Cơ chế: acetaldehyde (chất chuyển hóa từ rượu) là chất gây ung thư trực tiếp, tổn thương DNA. Không có loại rượu nào "an toàn hơn" — rượu vang đỏ, bia hay rượu trắng đều có acetaldehyde. Rượu cũng ức chế hệ miễn dịch và tương tác với nhiều loại thuốc.',
      '"Rượu vang đỏ tốt cho tim" — myth cần giải quyết: nghiên cứu quan sát ban đầu cho thấy người uống ít rượu (1–2 ly/tuần) khỏe mạnh hơn người không uống. Nhưng nhiều confounder: người không uống gồm cả người bỏ rượu vì bệnh (sick quitter effect), và người uống ít thường có lối sống lành mạnh hơn tổng thể. Nghiên cứu Mendelian randomization (không bị confounders): không tìm thấy lợi ích tim mạch từ rượu. Resveratrol trong rượu vang đỏ: nồng độ quá thấp để có tác dụng sinh học — phải uống hàng trăm lít mới đủ liều từ các nghiên cứu in vitro.',
      'Hút thuốc thụ động — nguy hiểm bằng chứng vững: khói thuốc thứ cấp (secondhand smoke) chứa cùng 70+ carcinogens. Trẻ em sống trong gia đình có người hút thuốc: tăng 50–100% nguy cơ nhiễm trùng hô hấp, hen suyễn, và đột tử ở trẻ sơ sinh (SIDS). Không có "ngưỡng an toàn" cho thuốc thụ động — ngay cả phơi nhiễm ngắn cũng ảnh hưởng chức năng mạch máu. "Hút ngoài ban công" vẫn để lại thirdhand smoke — nicotine và hóa chất bám vào bề mặt, quần áo.',
    ],
    points: [
      { icon: '💨', label: '1 điếu/ngày tăng 50% nguy cơ tim, 40% đột quỵ — không có "hút nhẹ"', note: 'Bỏ thuốc sau 1 năm: nguy cơ tim giảm một nửa. Bao giờ cũng không muộn' },
      { icon: '🍷', label: '"Rượu vang tốt cho tim" là myth — Lancet 2018: mức an toàn là 0', note: 'Sick quitter effect giải thích tại sao uống ít trông khỏe hơn không uống' },
      { icon: '🧪', label: '7 loại ung thư liên quan rõ ràng với rượu — tất cả loại rượu', note: 'Acetaldehyde (chất chuyển hóa của rượu) tổn thương DNA trực tiếp' },
      { icon: '👶', label: 'Hút thụ động: trẻ tăng 50–100% nguy cơ hen suyễn, nhiễm trùng', note: 'Thirdhand smoke bám bề mặt, quần áo — không đủ chỉ ra ngoài hút' },
    ],
  },
];

const VACCINE_SCHEDULE = [
  { vaccine: 'Cúm mùa', frequency: 'Hàng năm', who: 'Tất cả người lớn' },
  { vaccine: 'COVID-19', frequency: 'Theo khuyến cáo hiện tại', who: 'Tất cả người lớn' },
  { vaccine: 'Tdap (Bạch hầu, Uốn ván, Ho gà)', frequency: 'Nhắc lại mỗi 10 năm', who: 'Tất cả người lớn' },
  { vaccine: 'Viêm gan B', frequency: '3 mũi nếu chưa tiêm', who: 'Người chưa có miễn dịch' },
  { vaccine: 'HPV', frequency: '2–3 mũi', who: '9–45 tuổi, ưu tiên trước quan hệ tình dục' },
  { vaccine: 'Phế cầu', frequency: '1–2 mũi', who: '≥ 65 tuổi hoặc bệnh mãn tính' },
];

function PillarCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl shrink-0">{item.icon}</span>
        <span className="font-bold text-text flex-1 text-base">{item.title}</span>
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200"
          style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
      </div>
      <ul className="space-y-1 mb-3">
        {item.items.slice(0, 2).map((it, j) => (
          <li key={j} className="flex gap-2 text-sm text-muted">
            <span className="shrink-0" style={{ color: item.color }}>•</span>{it}
          </li>
        ))}
        {item.items.length > 2 && <li className="text-xs text-muted opacity-50">+{item.items.length - 2} nữa...</li>}
      </ul>
      <div className="rounded-xl px-3 py-2 text-xs border-l-2" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.06)`, color: `rgba(${item.rgb},0.85)` }}>
        <strong>Bằng chứng: </strong>{item.evidence}
      </div>
    </div>
  );
}

function PillarModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Trụ cột {item.num}/05</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-3 leading-snug" style={{ color: item.color }}>{item.title}</h2>
          <ul className="space-y-1.5 mb-5">
            {item.items.map((it, j) => (
              <li key={j} className="flex gap-2 text-sm" style={{ color: 'rgba(209,213,219,0.85)' }}>
                <span className="shrink-0 font-bold" style={{ color: item.color }}>•</span>{it}
              </li>
            ))}
          </ul>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 05</span>
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
      const el = document.getElementById(`reveal-prev-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-prev-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthPreventionPage() {
  const [b0] = useState(() => { try { return JSON.parse(localStorage.getItem('healthapp_e0_profile') || '{}'); } catch { return {}; } });
  const [pillarModal, setPillarModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes ePrevOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: ePrevOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🛡️</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Phòng Bệnh Chủ Động</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Phòng bệnh hơn chữa bệnh
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            80% các bệnh mãn tính phổ biến (tim mạch, tiểu đường type 2, một số ung thư) có thể phòng ngừa hoặc trì hoãn bằng lối sống. Đầu tư vào phòng bệnh hiệu quả gấp 10 lần so với chi phí điều trị.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="Phòng bệnh" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            5 trụ cột phòng bệnh chủ động
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {b0.age && (
        <RevealBlock delay={0} className="mb-10">
          <div className="rounded-2xl border p-4" style={{ borderColor: `rgba(${RGB},0.13)`, background: `rgba(${RGB},0.04)` }}>
            <div className="text-base font-bold uppercase tracking-widest mb-1" style={{ color: COLOR }}>✦ Hồ Sơ Của Bạn</div>
            <p className="text-base text-muted">{b0.age} tuổi · {b0.weight}kg — {b0.age < 30 ? 'Thời điểm tốt nhất để xây nền tảng phòng bệnh bền vững.' : b0.age < 50 ? 'Giai đoạn quan trọng — đầu tư sức khỏe bây giờ để hưởng lợi 20–30 năm tới.' : 'Phòng bệnh vẫn rất có giá trị ở mọi độ tuổi — không bao giờ là quá muộn.'}</p>
          </div>
        </RevealBlock>
      )}

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Trụ Cột Phòng Bệnh</h2>
        <p className="text-muted text-lg mb-6">Click vào từng trụ cột để xem chi tiết và bằng chứng khoa học. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-3">
          {PREVENTION_PILLARS.map((p, i) => (
            <PillarCard key={i} item={p} onClick={() => setPillarModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Lịch Tiêm Vaccine Người Lớn</h2>
        <p className="text-muted text-lg mb-6">Vaccine không chỉ dành cho trẻ em — người lớn cũng cần cập nhật lịch tiêm định kỳ.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-bold text-text">Vaccine</th>
                <th className="text-left py-3 px-3 font-bold text-text">Tần suất</th>
                <th className="text-left py-3 px-3 font-bold text-text">Đối tượng</th>
              </tr>
            </thead>
            <tbody>
              {VACCINE_SCHEDULE.map((v, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-3 font-medium text-text">{v.vaccine}</td>
                  <td className="py-3 px-3 text-muted">{v.frequency}</td>
                  <td className="py-3 px-3 text-muted">{v.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealBlock>

      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold text-text mb-3">Tầm Soát Ung Thư Theo Tuổi</h3>
          <div className="space-y-2 text-lg text-muted">
            <p>• <strong className="text-text">Ung thư đại tràng:</strong> Nội soi bắt đầu từ 45 tuổi, mỗi 10 năm (hoặc mỗi năm nếu FIT dương tính)</p>
            <p>• <strong className="text-text">Ung thư vú:</strong> Mamogram từ 40–45 tuổi, mỗi 1–2 năm</p>
            <p>• <strong className="text-text">Ung thư cổ tử cung:</strong> Pap smear từ 21 tuổi, mỗi 3 năm; hoặc HPV test từ 25 tuổi, mỗi 5 năm</p>
            <p>• <strong className="text-text">Ung thư phổi:</strong> CT liều thấp cho người 50–80 tuổi hút ≥ 20 gói-năm</p>
          </div>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>

      {pillarModal !== null && (
        <PillarModal
          item={PREVENTION_PILLARS[pillarModal]}
          onClose={() => setPillarModal(null)}
          onPrev={() => setPillarModal(i => Math.max(0, i - 1))}
          onNext={() => setPillarModal(i => Math.min(PREVENTION_PILLARS.length - 1, i + 1))}
          hasPrev={pillarModal > 0}
          hasNext={pillarModal < PREVENTION_PILLARS.length - 1}
        />
      )}
    </div>
  );
}
