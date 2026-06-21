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
  {
    num: '01', icon: '🤧', vaccine: 'Cúm mùa', frequency: 'Hàng năm', who: 'Tất cả người lớn',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    keyFact: '🤧 Virus cúm đột biến mỗi năm — vaccine năm ngoái không bảo vệ cho năm nay. WHO giám sát các chủng virus cúm đang lưu hành toàn cầu và cập nhật công thức vaccine mỗi năm. Tiêm vaccine cúm hàng năm giảm 40–60% nguy cơ mắc cúm và giảm đáng kể nguy cơ biến chứng nặng.',
    details: [
      'Tại sao phải tiêm cúm mỗi năm: không giống vaccine sởi hay viêm gan B cho miễn dịch suốt đời, virus cúm (Influenza A và B) có tốc độ đột biến cực cao — đặc biệt protein H (hemagglutinin) và N (neuraminidase) trên bề mặt. Mỗi mùa, các chủng mới chiếm ưu thế. WHO vận hành mạng lưới 150 trung tâm giám sát tại 114 quốc gia để dự đoán chủng nào sẽ lưu hành và cập nhật công thức vaccine 2 lần/năm (cho Bắc và Nam bán cầu).',
      'Hiệu quả thực tế và ai được lợi nhiều nhất: hiệu quả vaccine cúm dao động 40–60% tùy năm (phụ thuộc mức độ khớp giữa vaccine và chủng lưu hành). Nghe có vẻ thấp, nhưng ngay cả khi "không khớp hoàn toàn", vaccine vẫn giảm mức độ nặng của bệnh, giảm nhập viện, và giảm tử vong. Đối tượng được lợi nhất: người ≥ 65 tuổi (nguy cơ biến chứng cao nhất), phụ nữ mang thai (bảo vệ cả mẹ và bé), trẻ em 6 tháng – 5 tuổi, người có bệnh mãn tính (tim, phổi, tiểu đường), và nhân viên y tế.',
      'Thời điểm tiêm tối ưu tại Việt Nam: mùa cúm ở Việt Nam khác miền: miền Bắc đỉnh cúm vào mùa đông (tháng 11–3), miền Nam đỉnh cúm liên quan mùa mưa (tháng 5–10). Nên tiêm trước mùa cúm 2–4 tuần để cơ thể tạo đủ kháng thể. Thực tế: có thể tiêm bất kỳ lúc nào trong năm — muộn hơn vẫn tốt hơn không tiêm. Miễn dịch đạt đỉnh sau 2 tuần và kéo dài khoảng 6–12 tháng.',
      'Biến chứng cúm — tại sao không nên xem thường: cúm không phải "cảm lạnh nặng hơn". Influenza có thể gây viêm phổi nguyên phát (do virus) hoặc thứ phát (do vi khuẩn bội nhiễm), viêm cơ tim, viêm não, và suy đa tạng. Tử vong do cúm toàn cầu: 290.000–650.000 người/năm (WHO). Tại Mỹ mùa cúm 2017–2018 đặc biệt nặng: 810.000 ca nhập viện và 61.000 ca tử vong. Trẻ em dưới 5 tuổi và người trên 65 chiếm phần lớn ca tử vong.',
      'Herd immunity và bảo vệ cộng đồng: khi tỷ lệ tiêm vaccine cúm trong cộng đồng cao (> 60–70%), người không thể tiêm được (sơ sinh < 6 tháng, người dị ứng nặng) cũng được bảo vệ gián tiếp vì virus khó lây lan. Tiêm vaccine không chỉ bảo vệ bạn — còn bảo vệ ông bà, trẻ nhỏ, và người bệnh xung quanh bạn. Đây là lý do nhân viên y tế được khuyến nghị tiêm vaccine cúm hàng năm bắt buộc tại nhiều nước.',
      'Vaccine cúm tứ giá (quadrivalent) — lựa chọn hiện đại: vaccine cúm thế hệ cũ chỉ bảo vệ 3 chủng (trivalent). Vaccine tứ giá (quadrivalent, 4 chủng) bảo vệ rộng hơn: 2 chủng A (H1N1 và H3N2) + 2 chủng B. Hiện nay WHO khuyến nghị vaccine tứ giá. Tại Việt Nam, có sẵn tại các trung tâm tiêm chủng lớn (VNVC, Safpo). Giá khoảng 200.000–350.000 VNĐ — đầu tư nhỏ so với chi phí điều trị cúm biến chứng.',
    ],
    points: [
      { icon: '🔄', label: 'Virus đột biến mỗi năm — vaccine năm ngoái hết hiệu lực', note: 'WHO cập nhật công thức 2 lần/năm theo giám sát 114 quốc gia' },
      { icon: '👴', label: '≥ 65 tuổi, mang thai, bệnh mãn tính: ưu tiên tiêm hàng năm', note: 'Ngay cả 40–60% hiệu quả vẫn giảm đáng kể biến chứng nặng và tử vong' },
      { icon: '🗓️', label: 'VN: tiêm trước mùa đông (miền Bắc) hoặc trước mùa mưa (miền Nam)', note: 'Muộn vẫn tốt hơn không — miễn dịch đạt đỉnh sau 2 tuần' },
      { icon: '💉', label: 'Chọn vaccine tứ giá (quadrivalent) — bảo vệ 4 chủng thay vì 3', note: 'Có tại VNVC, Safpo — khoảng 200–350k VNĐ/mũi' },
    ],
  },
  {
    num: '02', icon: '🦠', vaccine: 'COVID-19', frequency: 'Theo khuyến cáo hiện tại', who: 'Tất cả người lớn',
    color: '#0ea5e9', rgb: '14,165,233',
    img: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    keyFact: '🦠 Bối cảnh COVID-19 liên tục thay đổi — khuyến nghị vaccine cập nhật theo tình hình miễn dịch cộng đồng, chủng lưu hành, và bằng chứng mới. Nguyên tắc chung: người nguy cơ cao (≥ 60 tuổi, bệnh mãn tính, suy giảm miễn dịch) được lợi nhiều nhất từ mũi nhắc lại định kỳ.',
    details: [
      'Công nghệ mRNA — cuộc cách mạng vaccine: vaccine Pfizer-BioNTech và Moderna dùng công nghệ mRNA — đây là lần đầu tiên công nghệ này được triển khai ở quy mô lớn. mRNA không bao giờ vào nhân tế bào, không tương tác với DNA. Tế bào đọc mRNA để tạo ra protein spike của SARS-CoV-2, kích thích hệ miễn dịch tạo kháng thể và tế bào T/B nhớ. mRNA bị phân hủy hoàn toàn trong vài ngày — không tồn tại lâu dài trong cơ thể.',
      'Hiệu quả theo thời gian và tại sao cần mũi nhắc: miễn dịch sau vaccine (và sau nhiễm) giảm theo thời gian, đặc biệt với các chủng mới. Kháng thể trung hòa giảm nhanh nhất (vài tháng), nhưng tế bào T và B nhớ bền hơn — đây là lý do vaccine vẫn bảo vệ tốt khỏi bệnh nặng dù kháng thể giảm. Mũi nhắc (booster) "đánh thức" hệ miễn dịch, tăng cả kháng thể lẫn tế bào nhớ, và được cập nhật để khớp với chủng đang lưu hành (như vaccine cúm).',
      'Đối tượng ưu tiên mũi nhắc nhất: người ≥ 60 tuổi (nguy cơ COVID nặng cao nhất, hệ miễn dịch suy giảm tự nhiên theo tuổi). Suy giảm miễn dịch (ghép tạng, hóa trị, HIV không kiểm soát). Bệnh mãn tính nặng (COPD, đái tháo đường, suy tim). Nhân viên y tế (tiếp xúc cao, bảo vệ bệnh nhân dễ tổn thương). Tại Việt Nam: theo dõi khuyến cáo Bộ Y tế — cập nhật tại moh.gov.vn.',
      'Long COVID — lý do thêm để phòng ngừa nhiễm: khoảng 10–30% người mắc COVID-19 (kể cả ca nhẹ) có triệu chứng kéo dài > 12 tuần sau nhiễm — gọi là Long COVID hay Post-COVID Condition. Triệu chứng phổ biến: mệt mỏi mãn tính, khó tập trung ("brain fog"), khó thở, đau khớp. Cơ chế đang nghiên cứu: viêm mãn tính, rối loạn tự miễn, và tổn thương vi mạch. Vaccine giảm nguy cơ Long COVID khoảng 50% theo một số nghiên cứu.',
      'An toàn và tác dụng phụ: tác dụng phụ phổ biến (ngắn hạn, tự khỏi): đau tại chỗ tiêm (70–80%), mệt mỏi (60%), nhức đầu (55%), ớn lạnh (40%). Myocarditis (viêm cơ tim) sau vaccine mRNA: hiếm gặp, chủ yếu ở nam trẻ 16–29 tuổi sau mũi 2. Tỷ lệ: khoảng 12–40 ca/triệu liều — và đa số tự khỏi trong vài ngày. Quan trọng: nguy cơ viêm cơ tim do COVID-19 thực sự cao hơn nhiều lần so với do vaccine. Hơn 13 tỷ liều đã tiêm toàn cầu — hồ sơ an toàn ngắn-trung hạn được theo dõi chặt chẽ.',
      'Tại sao không thể dựa vào "miễn dịch tự nhiên" hoàn toàn: miễn dịch sau nhiễm không đồng đều — người bệnh nặng thường có miễn dịch mạnh hơn người bệnh nhẹ. Nguy cơ để mắc COVID tự nhiên để có miễn dịch là không thể chấp nhận (tử vong, Long COVID, nguy cơ cho người xung quanh). Hybrid immunity (nhiễm + vaccine) thường cho miễn dịch rộng và bền hơn vaccine hoặc nhiễm đơn thuần. Hiện nay, hầu hết dân số đã có hybrid immunity ở mức độ nào đó — nhắc lại định kỳ giúp duy trì bảo vệ.',
    ],
    points: [
      { icon: '🧬', label: 'mRNA không vào nhân tế bào, không tương tác DNA', note: 'Phân hủy hoàn toàn trong vài ngày — công nghệ đột phá, an toàn ngắn-trung hạn' },
      { icon: '🔋', label: 'Kháng thể giảm sau vài tháng — tế bào T/B nhớ bền hơn', note: 'Vaccine vẫn bảo vệ tốt khỏi bệnh nặng dù kháng thể đo được giảm' },
      { icon: '😮‍💨', label: 'Long COVID: 10–30% ca nhẹ vẫn có triệu chứng > 12 tuần', note: 'Vaccine giảm nguy cơ Long COVID ~50% — thêm lý do để phòng ngừa nhiễm' },
      { icon: '👴', label: '≥ 60 tuổi + bệnh mãn tính: ưu tiên mũi nhắc theo khuyến cáo BYT', note: 'Theo dõi moh.gov.vn để cập nhật khuyến nghị mới nhất cho Việt Nam' },
    ],
  },
  {
    num: '03', icon: '🔬', vaccine: 'Tdap (Bạch hầu, Uốn ván, Ho gà)', frequency: 'Nhắc lại mỗi 10 năm', who: 'Tất cả người lớn',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    keyFact: '🔬 Miễn dịch từ vaccine Tdap tiêm thời thơ ấu giảm dần — đến tuổi trưởng thành, nhiều người không còn được bảo vệ đầy đủ. Ho gà (whooping cough) đang tái xuất hiện ở người lớn tại nhiều quốc gia. Uốn ván có thể gây tử vong — và vi khuẩn tồn tại khắp nơi trong đất và môi trường.',
    details: [
      'Ba bệnh trong một vaccine: Bạch hầu (Diphtheria): vi khuẩn Corynebacterium diphtheriae tạo độc tố gây màng giả ở họng → tắc đường thở, viêm cơ tim, liệt thần kinh. Tỷ lệ tử vong 5–10%, trẻ em cao hơn. Việt Nam có dịch bạch hầu tại vùng cao năm 2020 do tỷ lệ tiêm thấp. Uốn ván (Tetanus): Clostridium tetani trong đất, bụi, phân → qua vết thương → co giật cơ nặng → tỷ lệ tử vong 10–80% tùy mức độ. Ho gà (Pertussis): Bordetella pertussis → ho kịch phát 100 ngày ("trăm ngày ho"), nguy hiểm nhất cho trẻ sơ sinh < 6 tháng.',
      'Tại sao người lớn cần nhắc lại: tiêm chủng cơ bản (DTaP) cho trẻ em thường hoàn tất ở 4–6 tuổi. Miễn dịch kháng bạch hầu và ho gà giảm sau 5–10 năm. Uốn ván: miễn dịch kéo dài hơn (~10 năm) nhưng vẫn cần nhắc. Khuyến nghị CDC và WHO: nhắc 1 mũi Tdap cho người lớn chưa tiêm Tdap (nếu trước đây chỉ tiêm Td). Sau đó: nhắc Td (không có thành phần ho gà) mỗi 10 năm. Đặc biệt: phụ nữ mang thai nên tiêm Tdap mỗi thai kỳ (tuần 27–36).',
      'Ho gà tái xuất hiện — không phải bệnh của trẻ em: nhiều ổ dịch ho gà lớn gần đây (Mỹ 2012: 48.277 ca — cao nhất từ 1955) phần lớn ở thanh thiếu niên và người lớn. Người lớn không tiêm nhắc mang vi khuẩn không có triệu chứng điển hình (chỉ ho dai dẳng vài tuần), sau đó lây cho trẻ sơ sinh < 6 tháng chưa hoàn thành lịch tiêm — đây là đối tượng nguy hiểm nhất (tử vong do ho gà > 90% ở trẻ < 6 tháng). Chiến lược "cocooning": tiêm Tdap cho cha mẹ, anh chị em, ông bà trước khi em bé ra đời.',
      'Uốn ván — nguy cơ thường trực: vi khuẩn Clostridium tetani bào tử tồn tại trong đất, phân động vật, và bụi đường — không thể tránh hoàn toàn. Bất kỳ vết thương nào (đinh rỉ sét, cắt sâu, bỏng, vết cắn động vật) đều có thể là cổng vào. Triệu chứng khởi phát 3–21 ngày sau nhiễm: co cứng hàm (lockjaw), co giật toàn thân, rối loạn thần kinh tự động. Không có thuốc điều trị đặc hiệu — chỉ chăm sóc hỗ trợ (ICU, máy thở). Tỷ lệ tử vong tại các nước đang phát triển vẫn lên đến 50–80%.',
      'Tiêm nhắc uốn ván sau chấn thương: nếu bị vết thương nguy cơ (sâu, bẩn, tiếp xúc đất/phân): cần tiêm nhắc nếu chưa tiêm trong 5 năm qua (thay vì 10 năm). Nếu không rõ lịch tiêm hoặc chưa hoàn thành: tiêm đủ 3 mũi (0, 1 tháng, 6–12 tháng). Immunoglobulin uốn ván (TIG): tiêm cùng lúc với vaccine cho vết thương nặng ở người chưa tiêm đủ — cung cấp miễn dịch thụ động tức thì trong khi chờ vaccine tạo miễn dịch chủ động.',
      'Phụ nữ mang thai — tiêm Tdap mỗi thai kỳ: CDC và WHO khuyến nghị tiêm Tdap ở tuần 27–36 mỗi thai kỳ (không chỉ thai kỳ đầu tiên). Lý do: kháng thể mẹ truyền qua nhau thai cho bé — bảo vệ bé ngay từ khi sinh đến khi bé đủ tuổi tiêm vaccine (2 tháng). Nghiên cứu cho thấy hiệu quả bảo vệ trẻ sơ sinh đến 93% khi mẹ tiêm Tdap trong thai kỳ. An toàn: Tdap đã được chứng minh an toàn trong thai kỳ qua nhiều nghiên cứu lớn.',
    ],
    points: [
      { icon: '⏰', label: 'Nhắc lại mỗi 10 năm — miễn dịch trẻ em giảm dần theo tuổi', note: 'Vết thương nguy cơ: nhắc nếu chưa tiêm trong 5 năm (không phải 10)' },
      { icon: '👶', label: 'Ho gà: người lớn không triệu chứng lây cho sơ sinh < 6 tháng', note: 'Chiến lược cocooning: tiêm cho cha mẹ, ông bà trước khi em bé ra đời' },
      { icon: '🌱', label: 'Uốn ván trong đất, bụi — không thể tránh, tử vong đến 50–80%', note: 'Không có thuốc đặc hiệu — chỉ phòng ngừa bằng vaccine mới hiệu quả' },
      { icon: '🤰', label: 'Mang thai: tiêm Tdap tuần 27–36 mỗi thai kỳ — bảo vệ bé từ khi sinh', note: 'Kháng thể mẹ truyền qua nhau thai — hiệu quả bảo vệ bé đến 93%' },
    ],
  },
  {
    num: '04', icon: '🫀', vaccine: 'Viêm gan B', frequency: '3 mũi nếu chưa tiêm', who: 'Người chưa có miễn dịch',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '🫀 Việt Nam thuộc vùng lưu hành viêm gan B cao (hyperendemic) — tỷ lệ nhiễm HBsAg trong dân số 8–10%. Viêm gan B mãn tính là nguyên nhân hàng đầu gây xơ gan và ung thư gan tế bào (HCC) tại Việt Nam. Vaccine viêm gan B hiệu quả > 95% và cho miễn dịch suốt đời ở người tiêm đủ 3 mũi.',
    details: [
      'Viêm gan B tại Việt Nam — gánh nặng thực sự: Việt Nam có khoảng 8–10 triệu người nhiễm HBV mãn tính (HBsAg dương tính). Ung thư gan là loại ung thư phổ biến hàng 2 và là nguyên nhân tử vong do ung thư hàng đầu ở nam giới Việt Nam — 75–80% do HBV. Viêm gan B lây qua: máu (truyền máu, dùng chung kim tiêm, xăm, châm cứu không vô trùng), quan hệ tình dục, và lây dọc từ mẹ sang con (đây là con đường chính tại Việt Nam).',
      'Lây qua đường nào và không lây qua đường nào: LÂY: máu và dịch cơ thể (tinh dịch, dịch âm đạo, sữa mẹ), từ mẹ sang con (chu sinh), dùng chung dao cạo, bàn chải đánh răng, kim tiêm. KHÔNG LÂY: bắt tay, ôm, hôn má, chia sẻ thức ăn, ho, hắt hơi, nước bơi hồ. HBV chứa trong máu ở nồng độ cao hơn HIV gấp 50–100 lần — lây qua tiếp xúc máu rất nhỏ. Dụng cụ làm nail, xăm, và châm cứu không vô trùng là nguồn lây quan trọng cần lưu ý.',
      'Phác đồ tiêm — 3 mũi cơ bản và kiểm tra miễn dịch: phác đồ chuẩn: mũi 1 (0 tháng) → mũi 2 (1 tháng) → mũi 3 (6 tháng). Phác đồ nhanh: 0–1–2 tháng + mũi 4 lúc 12 tháng (dùng khi cần bảo vệ nhanh, ví dụ trước du lịch). Sau hoàn thành 3 mũi: kiểm tra Anti-HBs (kháng thể bảo vệ) sau 1–2 tháng. Anti-HBs ≥ 10 mIU/mL = đã được bảo vệ. Anti-HBs < 10 mIU/mL = "non-responder" (khoảng 5–10% người lớn) — cần tiêm thêm 3 mũi nữa và kiểm tra lại.',
      'Trước khi tiêm — cần xét nghiệm gì: xét nghiệm HBsAg (đang nhiễm HBV không?), Anti-HBs (đã có miễn dịch chưa?), và Anti-HBc (tiếp xúc HBV cũ?). Nếu HBsAg dương tính: không tiêm vaccine — cần điều trị HBV. Nếu Anti-HBs dương tính (≥ 10 mIU/mL): đã có miễn dịch, không cần tiêm. Nếu cả hai âm tính: chưa miễn dịch, nên tiêm ngay. Tại Việt Nam, nhiều người đã nhiễm HBV (8–10%) hoặc đã có miễn dịch từ tiêm trẻ em — xét nghiệm trước để tránh tiêm không cần thiết.',
      'Bảo vệ sơ sinh — mũi đầu trong 24 giờ: trẻ sinh ra từ mẹ HBsAg dương tính có nguy cơ nhiễm HBV 70–90% nếu không có can thiệp. Giao thức hiện tại: tiêm vaccine viêm gan B ngay trong vòng 12–24 giờ sau sinh + HBIG (hepatitis B immune globulin) — giảm nguy cơ nhiễm xuống < 5–10%. Đây là lý do vaccine viêm gan B nằm trong chương trình tiêm chủng quốc gia VN từ năm 1997, với mũi đầu trong 24 giờ. Trẻ sinh từ mẹ không biết HBsAg: xét nghiệm mẹ ngay và tiêm vaccine sớm nhất có thể.',
      'Người lớn cần tiêm: ai nên ưu tiên nếu chưa tiêm hoặc không rõ lịch tiêm: nhân viên y tế (tiếp xúc máu cao). Người có nhiều bạn tình hoặc quan hệ đồng giới nam. Người dùng ma túy tiêm. Người sống cùng hoặc quan hệ tình dục với người HBsAg dương tính. Bệnh nhân thận mãn tính/lọc máu (thường cần liều cao hơn). Du khách đến vùng lưu hành HBV cao. Và thực ra: tất cả người lớn chưa có miễn dịch đều nên tiêm — vaccine an toàn, hiệu quả, và cho miễn dịch suốt đời.',
    ],
    points: [
      { icon: '🇻🇳', label: 'VN: 8–10 triệu người nhiễm HBV — ung thư gan hàng đầu nam giới', note: 'Lây từ mẹ sang con là con đường chính — vaccine đầu trong 24h sau sinh' },
      { icon: '🧪', label: 'Xét nghiệm HBsAg + Anti-HBs trước khi tiêm', note: 'Nếu đã có miễn dịch hoặc đang nhiễm: không cần/không nên tiêm vaccine' },
      { icon: '✅', label: 'Anti-HBs ≥ 10 mIU/mL sau 3 mũi = bảo vệ suốt đời', note: '5–10% không đáp ứng — kiểm tra sau 1–2 tháng, tiêm thêm nếu cần' },
      { icon: '🍺', label: 'Lây qua dụng cụ nail, xăm, châm cứu không vô trùng', note: 'HBV trong máu đậm đặc hơn HIV 50–100 lần — rủi ro tiếp xúc nhỏ vẫn lây' },
    ],
  },
  {
    num: '05', icon: '🎗️', vaccine: 'HPV', frequency: '2–3 mũi', who: '9–45 tuổi, ưu tiên trước quan hệ tình dục',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    keyFact: '🎗️ Vaccine HPV là vaccine đầu tiên và duy nhất chứng minh có thể NGĂN NGỪA UNG THƯ — không phải chỉ phòng bệnh nhiễm trùng. HPV gây 99% ung thư cổ tử cung, 90% ung thư hậu môn, 70% ung thư họng miệng. Hiệu quả vaccine lên đến 97–99% với các chủng HPV nguy cơ cao khi tiêm trước khi phơi nhiễm.',
    details: [
      'HPV là gì và tại sao phổ biến đến vậy: Human Papillomavirus (HPV) là virus lây qua tiếp xúc da-da khi quan hệ tình dục — bao gồm quan hệ âm đạo, hậu môn, và miệng. Ước tính 80–90% người có hoạt động tình dục sẽ nhiễm ít nhất 1 chủng HPV trong đời. Hầu hết nhiễm tự khỏi trong 1–2 năm nhờ hệ miễn dịch. Vấn đề: một số chủng (đặc biệt HPV-16 và HPV-18) tồn tại lâu dài → tích hợp vào DNA tế bào → gây biến đổi ác tính. Không có triệu chứng trong giai đoạn nhiễm — không biết mình đang mang virus.',
      'Các bệnh HPV gây ra: ung thư cổ tử cung (CTC): 99% do HPV — HPV-16 và HPV-18 chiếm 70% ca. Ung thư hậu môn: 90% do HPV. Ung thư âm hộ, âm đạo, dương vật: 40–90% do HPV. Ung thư vùng miệng/họng (oropharyngeal): HPV-16 gây 70–80% ca, đang tăng nhanh ở nam giới. Mụn cóc sinh dục (condyloma): HPV-6 và HPV-11 (chủng nguy cơ thấp). Gardasil 9 bảo vệ khỏi 9 chủng: HPV-6, 11, 16, 18, 31, 33, 45, 52, 58 — bao phủ ~90% ca ung thư CTC.',
      'Lịch tiêm theo tuổi: 9–14 tuổi (trước phơi nhiễm): 2 mũi (0 và 6–12 tháng) — hệ miễn dịch ở độ tuổi này đáp ứng mạnh hơn, nên 2 mũi đủ tạo miễn dịch tương đương 3 mũi ở người lớn. 15–45 tuổi: 3 mũi (0, 2, và 6 tháng). Trên 45 tuổi: FDA Mỹ mở rộng đến 45, nhưng lợi ích giảm dần vì khả năng đã phơi nhiễm HPV cao hơn — tham khảo bác sĩ. Quan trọng: vaccine hiệu quả nhất TRƯỚC khi phơi nhiễm — nhưng vẫn có lợi ở người đã hoạt động tình dục (bảo vệ các chủng chưa nhiễm).',
      'Nam giới có nên tiêm không: Có, hoàn toàn nên. Nam giới cũng bị ung thư hậu môn, dương vật, và ung thư vùng họng (oropharyngeal) do HPV. HPV-16 gây ung thư họng ở nam tăng nhanh ở Mỹ và châu Âu. Mụn cóc sinh dục (HPV-6/11): gây khó chịu và lo lắng, điều trị tốn kém. Vaccine nam giới cũng giảm lây lan HPV cho bạn tình. CDC khuyến nghị HPV vaccine cho mọi người đến 26 tuổi không phân biệt giới tính, và cân nhắc đến 45 tuổi.',
      'Hiệu quả thực tế sau khi triển khai đại trà: Australia bắt đầu chương trình HPV vaccine quốc gia năm 2007 cho nữ, 2013 cho nam. Kết quả đến 2023: ung thư cổ tử cung ở phụ nữ dưới 30 tuổi giảm 90%+ — tiến đến mục tiêu loại trừ ung thư CTC. Scotland: giảm 89% tỷ lệ ung thư cổ tử cung ở phụ nữ tiêm vaccine năm 12–13 tuổi. Đây là bằng chứng thực tế mạnh nhất: vaccine hoạt động không chỉ trong thử nghiệm lâm sàng mà trong dân số thực.',
      'Vaccine HPV và tầm soát ung thư CTC: vaccine không thay thế tầm soát (Pap smear / HPV test). Lý do: vaccine bảo vệ ~90% nhưng không phải 100% chủng. Người đã tiêm vẫn cần tầm soát định kỳ. Hướng dẫn tầm soát hiện tại: Pap smear mỗi 3 năm (từ 21 tuổi), hoặc HPV test + Pap smear (co-test) mỗi 5 năm (từ 30 tuổi), hoặc HPV test đơn thuần mỗi 5 năm (từ 25 tuổi). Tại Việt Nam: HPV test ngày càng có nhiều tại bệnh viện lớn.',
    ],
    points: [
      { icon: '🛡️', label: 'Vaccine đầu tiên chứng minh NGĂN NGỪA UNG THƯ — không chỉ nhiễm trùng', note: 'Gardasil 9 bảo vệ 9 chủng HPV — bao gồm 90% ca ung thư cổ tử cung' },
      { icon: '👦', label: 'Nam giới nên tiêm — ung thư họng do HPV-16 đang tăng nhanh', note: 'CDC khuyến nghị cho mọi người đến 26 tuổi, cân nhắc đến 45 tuổi' },
      { icon: '🇦🇺', label: 'Australia: ung thư CTC giảm 90%+ ở thế hệ tiêm vaccine', note: 'Bằng chứng dân số thực — loại trừ ung thư CTC đang tiến đến được' },
      { icon: '🔬', label: 'Vaccine không thay thế Pap smear / HPV test định kỳ', note: 'Tầm soát mỗi 3–5 năm vẫn cần thiết — 90% bảo vệ không phải 100%' },
    ],
  },
  {
    num: '06', icon: '🫁', vaccine: 'Phế cầu', frequency: '1–2 mũi', who: '≥ 65 tuổi hoặc bệnh mãn tính',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    keyFact: '🫁 Streptococcus pneumoniae (phế cầu) là nguyên nhân hàng đầu gây viêm phổi do vi khuẩn, viêm màng não, và nhiễm khuẩn huyết ở người lớn tuổi. Tại các nước có chương trình vaccine phế cầu toàn quốc, tỷ lệ viêm phổi nặng và tử vong ở người ≥ 65 tuổi giảm 50–80%.',
    details: [
      'Streptococcus pneumoniae — kẻ cơ hội nguy hiểm nhất: phế cầu là vi khuẩn thường trú trong mũi họng của 5–40% người khỏe mạnh (tỷ lệ cao hơn ở trẻ em và người cao tuổi). Phần lớn thời gian không gây bệnh — nhưng khi hệ miễn dịch suy yếu (do cúm, COVID, tuổi cao, bệnh mãn tính): vi khuẩn xâm nhập xuống phổi, vào máu, hoặc vào màng não. Có hơn 90 serotype (chủng) phế cầu — vaccine bảo vệ các serotype gây bệnh nặng nhất.',
      'Các bệnh phế cầu gây ra: viêm phổi do vi khuẩn (pneumococcal pneumonia): biểu hiện sốt cao, ho đờm, khó thở — cần nhập viện, đôi khi ICU. Tỷ lệ tử vong ở người cao tuổi: 20–30%. Viêm màng não mủ (meningitis): sốt, cứng cổ, sợ ánh sáng — tỷ lệ tử vong 20–30%, di chứng thần kinh nặng (điếc, liệt) ở người sống sót. Nhiễm khuẩn huyết (bacteremia/sepsis): vi khuẩn vào máu — tử vong cao đặc biệt ở người cao tuổi và suy giảm miễn dịch.',
      'Hai loại vaccine phế cầu — PCV và PPSV: PPSV23 (Pneumovax): vaccine đa đường (polysaccharide) bảo vệ 23 serotype. Chỉ tạo miễn dịch ngắn hạn (5–7 năm), không tạo miễn dịch tế bào B nhớ, kém hiệu quả ở trẻ < 2 tuổi. PCV13 (Prevenar 13) / PCV15 / PCV20: vaccine liên hợp (conjugate) — protein gắn vào polysaccharide → kích hoạt tế bào T + B nhớ → miễn dịch bền hơn, hiệu quả hơn. PCV20 (Prevnar 20) mới nhất bảo vệ 20 serotype — đang thay thế dần PCV13. Hiện tại khuyến nghị: PCV20 hoặc PCV15 + PPSV23.',
      'Ai nên tiêm và lịch tiêm: ≥ 65 tuổi: PCV20 1 mũi (hoặc PCV15 rồi PPSV23 sau ≥ 1 năm). 19–64 tuổi có nguy cơ cao: bệnh phổi mãn tính (COPD, hen), tim mạch, tiểu đường, bệnh thận mãn tính, gan mạn, mất lách, HIV, suy giảm miễn dịch. Hút thuốc lá cũng là yếu tố nguy cơ (phá hủy niêm mạc đường hô hấp). Trẻ em < 5 tuổi: PCV được đưa vào lịch tiêm chủng quốc gia — bảo vệ trẻ và giảm lây lan trong cộng đồng (herd protection cho người cao tuổi).',
      'Hiệu quả vaccine trong thực tế: sau khi Mỹ triển khai PCV13 cho người lớn năm 2014: viêm phổi do phế cầu serotype trong vaccine giảm 91–93% ở người ≥ 65 tuổi trong vài năm. Tỷ lệ nhiễm khuẩn huyết và viêm màng não phế cầu giảm đáng kể. Vaccine phế cầu nhi đồng (PCV) còn tạo herd protection gián tiếp cho người cao tuổi: trẻ ít mang vi khuẩn → lây ít hơn cho ông bà. Đây là ví dụ quan trọng về lợi ích cộng đồng của vaccine.',
      'Phân biệt viêm phổi do virus vs vi khuẩn: viêm phổi do virus (bao gồm COVID, cúm): không đáp ứng với kháng sinh, điều trị hỗ trợ. Viêm phổi do phế cầu (vi khuẩn): cần kháng sinh (amoxicillin/clavulanate, azithromycin, fluoroquinolone). Kháng kháng sinh (antibiotic resistance): S. pneumoniae ngày càng kháng penicillin và macrolide — thêm lý do để phòng ngừa bằng vaccine thay vì chỉ phụ thuộc kháng sinh điều trị. Tại Việt Nam, kháng kháng sinh ở phế cầu ở mức cao.',
    ],
    points: [
      { icon: '👴', label: '≥ 65 tuổi: viêm phổi phế cầu tử vong 20–30% — tiêm 1 mũi PCV20', note: 'Bệnh phổi, tim mạch, tiểu đường 19–64 tuổi: cũng nên tiêm' },
      { icon: '💊', label: 'Phế cầu ngày càng kháng kháng sinh — phòng tốt hơn điều trị', note: 'Kháng penicillin và macrolide cao tại VN — vaccine là tuyến phòng thủ hiệu quả nhất' },
      { icon: '🧒', label: 'Trẻ tiêm PCV giảm lây phế cầu cho ông bà — herd protection', note: 'PCV trong lịch tiêm quốc gia VN bảo vệ cả trẻ và cộng đồng người cao tuổi' },
      { icon: '🏥', label: 'PCV20: 1 mũi bảo vệ 20 serotype — thay thế phác đồ 2-vaccine cũ', note: 'Prevnar 20 đơn giản hóa lịch tiêm so với PCV15 + PPSV23 trước đây' },
    ],
  },
];

function VaccineCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `rgba(${item.rgb},0.12)`, border: `1px solid rgba(${item.rgb},0.25)` }}>{item.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-sm text-text leading-snug">{item.vaccine}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold transition-opacity duration-200"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `rgba(${item.rgb},0.1)`, color: item.color }}>⏰ {item.frequency}</span>
            <span className="text-xs px-2 py-0.5 rounded-full text-muted" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>👤 {item.who}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaccineModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
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
          <img src={item.img} alt={item.vaccine} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Vaccine {item.num}/06</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-2 leading-snug" style={{ color: item.color }}>{item.vaccine}</h2>
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: `rgba(${item.rgb},0.12)`, color: item.color }}>⏰ {item.frequency}</span>
            <span className="text-xs px-3 py-1 rounded-full text-muted" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>👤 {item.who}</span>
          </div>
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
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 06</span>
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
  const [vaccineModal, setVaccineModal] = useState(null);

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
        <p className="text-muted text-lg mb-6">Vaccine không chỉ dành cho trẻ em — người lớn cũng cần cập nhật lịch tiêm định kỳ. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {VACCINE_SCHEDULE.map((v, i) => (
            <VaccineCard key={i} item={v} onClick={() => setVaccineModal(i)} />
          ))}
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

      {vaccineModal !== null && (
        <VaccineModal
          item={VACCINE_SCHEDULE[vaccineModal]}
          onClose={() => setVaccineModal(null)}
          onPrev={() => setVaccineModal(i => Math.max(0, i - 1))}
          onNext={() => setVaccineModal(i => Math.min(VACCINE_SCHEDULE.length - 1, i + 1))}
          hasPrev={vaccineModal > 0}
          hasNext={vaccineModal < VACCINE_SCHEDULE.length - 1}
        />
      )}

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
