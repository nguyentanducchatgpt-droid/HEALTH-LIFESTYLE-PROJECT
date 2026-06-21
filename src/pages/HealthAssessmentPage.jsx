import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#3b82f6';
const RGB = '59,130,246';
const ORBIT_ID = 'e-assess-orbit-kf';
const ORBIT_CLASS = 'e-assess-orbit-ring';
const ORBIT_PROP = '--e-assess-orbit-angle';

const SCORE_COLORS = [
  { color: '#ef4444', rgb: '239,68,68',  label: 'Cần cải thiện' },
  { color: '#f97316', rgb: '249,115,22', label: 'Chưa đạt' },
  { color: '#eab308', rgb: '234,179,8',  label: 'Tạm ổn' },
  { color: '#22c55e', rgb: '34,197,94',  label: 'Tốt' },
  { color: '#3b82f6', rgb: '59,130,246', label: 'Xuất sắc' },
];

const QUESTIONS = [
  {
    id: 1, cat: 'Vận Động', q: 'Bạn vận động thể chất ít nhất 20 phút bao nhiêu ngày/tuần?',
    opts: ['Không vận động', '1–2 ngày', '3–4 ngày', '5–6 ngày', 'Hàng ngày'],
    insights: [
      'Không vận động là yếu tố nguy cơ độc lập cho bệnh tim, tiểu đường và tử vong sớm. Bắt đầu ngay: 10 phút đi bộ mỗi ngày — không cần đủ 30 phút.',
      'Tốt hơn không vận động nhưng chưa đạt ngưỡng khuyến nghị. WHO khuyến nghị 150 phút/tuần — 1–2 ngày chỉ đạt 40–60 phút. Tăng thêm 1–2 ngày nữa.',
      'Bạn đang gần ngưỡng khuyến nghị. 3–4 ngày × 30 phút = 90–120 phút/tuần. Thêm 30 phút/tuần nữa là đạt tối ưu.',
      'Xuất sắc! Bạn đạt và vượt ngưỡng 150 phút/tuần của WHO. Nguy cơ bệnh tim và tiểu đường giảm đáng kể. Duy trì!',
      'Tuyệt vời! Vận động hàng ngày giảm nguy cơ bệnh tim 35%, tiểu đường 50%, và cải thiện tâm trạng rõ rệt.',
    ],
  },
  {
    id: 2, cat: 'Vận Động', q: 'Bạn có thường xuyên ngồi liên tục > 2 giờ không nghỉ không?',
    opts: ['Hầu như mọi ngày', 'Thường xuyên', 'Đôi khi', 'Hiếm khi', 'Hầu như không'],
    insights: [
      'Ngồi liên tục > 2 giờ tăng nguy cơ tim mạch và tiểu đường dù bạn có tập thể dục. Đặt nhắc mỗi 45–60 phút đứng dậy đi 5 phút.',
      'Vẫn ở mức đáng lo. Thử quy tắc 50-10: mỗi 50 phút ngồi = 10 phút đứng/đi lại. Một vòng đi bộ nhỏ mang lại lợi ích lớn.',
      'Tạm ổn nhưng còn cải thiện được. Mục tiêu: không ngồi liên tục quá 90 phút bất kỳ lúc nào trong ngày.',
      'Tốt! Bạn đã thành công tránh ngồi quá lâu — một trong những thói quen quan trọng nhất của dân văn phòng hiện đại.',
      'Tuyệt vời! Đứng/di chuyển thường xuyên bảo vệ tim mạch, cột sống và cải thiện tuần hoàn máu suốt cả ngày.',
    ],
  },
  {
    id: 3, cat: 'Vận Động', q: 'Bạn có tập sức mạnh (tạ, thể dục) ít nhất 2 lần/tuần không?',
    opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Luôn luôn'],
    insights: [
      'Tập sức mạnh không cần gym: 10 push-up + 10 squat + 30s plank mỗi ngày là đủ để bắt đầu. Xây dựng cơ bắp bảo vệ xương và chuyển hóa.',
      'Chưa đủ nhưng có ý thức. WHO khuyến nghị 2 buổi sức mạnh/tuần. Squat, plank, push-up tại nhà 15 phút × 2 lần là đủ.',
      'Bạn đang đúng hướng. Tập sức mạnh 2×/tuần giảm nguy cơ tiểu đường 34% và giúp kiểm soát cân nặng lâu dài hiệu quả hơn cardio.',
      'Rất tốt! Tập sức mạnh đều đặn duy trì khối cơ, tăng trao đổi chất khi nghỉ, bảo vệ xương và cải thiện posture.',
      'Xuất sắc! Tập sức mạnh nhất quán là nền tảng sức khỏe lâu dài. Đảm bảo protein đủ (1.6–2.0g/kg) và ngày nghỉ phục hồi đúng.',
    ],
  },
  {
    id: 4, cat: 'Dinh Dưỡng', q: 'Bạn ăn rau và trái cây bao nhiêu phần mỗi ngày?',
    opts: ['Hầu như không', '1 phần', '2–3 phần', '4–5 phần', '≥ 5 phần'],
    insights: [
      'Thiếu rau quả = thiếu fiber, vitamin, khoáng chất và phytochemicals bảo vệ tế bào. Bước nhỏ: thêm 1 nắm rau sống vào mỗi bữa ăn.',
      'Chưa đủ. WHO khuyến nghị ≥ 5 phần (400g)/ngày. Thêm 1 quả táo hoặc 1 bát rau xào mỗi ngày là bước tiến đầu tiên dễ thực hiện.',
      'Tiến bộ tốt nhưng còn xa ngưỡng tối ưu. Mỗi bữa chính: nửa đĩa là rau — quy tắc "đĩa khỏe" đơn giản nhất để tăng rau mỗi ngày.',
      'Gần đạt ngưỡng WHO! 4–5 phần rau quả giảm đáng kể nguy cơ bệnh tim, đột quỵ và một số loại ung thư. Tuyệt vời!',
      'Xuất sắc! ≥5 phần/ngày được chứng minh giảm tử vong tim mạch 25% và nguy cơ ung thư đại tràng 20%. Tiếp tục duy trì!',
    ],
  },
  {
    id: 5, cat: 'Dinh Dưỡng', q: 'Bạn có thường xuyên ăn đồ chế biến sẵn / fast food không?',
    opts: ['Hàng ngày', '4–6 lần/tuần', '2–3 lần/tuần', '1 lần/tuần', 'Hiếm khi'],
    insights: [
      'Thực phẩm chế biến sẵn chứa nhiều muối, đường ẩn, chất béo trans và phụ gia. Ăn hàng ngày tăng nguy cơ tim mạch, béo phì và ung thư.',
      'Quá thường xuyên. Muối và đường ẩn tích lũy nhanh. Bắt đầu thay thế 2 bữa/tuần bằng cơm nhà — hiệu quả lớn hơn bạn nghĩ.',
      'Tạm chấp nhận được nhưng hãy giảm xuống 1 lần/tuần. Mỗi bữa tự nấu là đầu tư trực tiếp cho sức khỏe dài hạn và tiết kiệm chi phí.',
      'Tốt! 1 lần/tuần là mức hợp lý — ít ảnh hưởng tổng thể nếu phần còn lại của chế độ ăn lành mạnh. Duy trì tốt!',
      'Xuất sắc! Hạn chế thực phẩm chế biến sẵn là một trong những quyết định dinh dưỡng có tác động lớn nhất đến sức khỏe lâu dài.',
    ],
  },
  {
    id: 6, cat: 'Dinh Dưỡng', q: 'Bạn uống đủ nước (khoảng 2L/ngày) không?',
    opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Luôn luôn'],
    insights: [
      'Mất nước mãn tính ảnh hưởng chức năng thận, não và da. Bắt đầu: 1 ly nước ngay khi thức dậy, 1 ly trước mỗi bữa ăn.',
      'Chưa đủ. Khát nước là dấu hiệu đã mất nước nhẹ rồi. Đặt mục tiêu: 1 ly nước mỗi giờ trong giờ làm việc — đặt bình trên bàn.',
      'Tạm ổn nhưng không đều. Mang theo bình nước 500ml–1L để nhắc nhở uống trong ngày. Nhìn thấy bình = uống ngay.',
      'Tốt! Uống nước đều đặn hỗ trợ chức năng thận, da, tiêu hóa và tập trung. Đây là thói quen đơn giản nhưng nhiều người thiếu.',
      'Tuyệt vời! Uống đủ nước nhất quán là một trong những thói quen sức khỏe cơ bản và hiệu quả nhất. Tiếp tục duy trì!',
    ],
  },
  {
    id: 7, cat: 'Giấc Ngủ', q: 'Bạn thường ngủ bao nhiêu tiếng mỗi đêm?',
    opts: ['< 5 giờ', '5–6 giờ', '6–7 giờ', '7–8 giờ', '> 8 giờ'],
    insights: [
      'Ngủ < 5 giờ tăng nguy cơ tiểu đường 48%, bệnh tim 45%, và ảnh hưởng nghiêm trọng đến miễn dịch, trí nhớ và cân nặng. Cần ưu tiên ngủ ngay.',
      'Thiếu ngủ mãn tính. "Nợ ngủ" không thể bù hoàn toàn vào cuối tuần. Thêm 30 phút ngủ mỗi đêm trong 1 tuần: bạn sẽ nhận ra sự khác biệt.',
      'Gần đủ nhưng chưa tối ưu. NSF khuyến nghị 7–9 giờ cho người trưởng thành. Thêm 30–60 phút ngủ sẽ cải thiện rõ rệt năng lượng và trí nhớ.',
      'Đây là ngưỡng tối ưu! 7–8 giờ ngủ đêm là nền tảng của sức khỏe toàn diện — não, tim và hệ miễn dịch đều hoạt động tốt nhất.',
      'Tốt nếu chất lượng ngủ cao. Nếu ngủ > 9 giờ thường xuyên và vẫn mệt, hãy kiểm tra ngưng thở khi ngủ (sleep apnea) với bác sĩ.',
    ],
  },
  {
    id: 8, cat: 'Giấc Ngủ', q: 'Bạn cảm thấy thế nào khi thức dậy vào buổi sáng?',
    opts: ['Rất mệt', 'Mệt', 'Bình thường', 'Tỉnh táo', 'Rất tỉnh táo và sẵn sàng'],
    insights: [
      'Mệt khi thức dậy mãn tính là dấu hiệu cần điều tra: thiếu sắt, suy giáp, ngưng thở khi ngủ hoặc trầm cảm. Nên gặp bác sĩ để kiểm tra.',
      'Mệt sau ngủ đủ giấc không phải bình thường. Kiểm tra: tránh màn hình 1h trước ngủ, phòng tối và mát (18–20°C), giờ ngủ cố định.',
      'OK nhưng bạn có thể tốt hơn. Giờ ngủ/thức đều đặn ngay cả cuối tuần cải thiện đáng kể chất lượng giấc ngủ trong vài tuần.',
      'Tốt! Thức dậy tỉnh táo là dấu hiệu giấc ngủ chất lượng tốt và cơ thể đang phục hồi hiệu quả qua đêm.',
      'Tuyệt vời! Đây là trạng thái lý tưởng — giấc ngủ của bạn hiệu quả, chu kỳ ngủ hoàn chỉnh và cơ thể phục hồi tối đa.',
    ],
  },
  {
    id: 9, cat: 'Tâm Trí', q: 'Mức độ stress hằng ngày của bạn?',
    opts: ['Cực kỳ cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'],
    insights: [
      'Stress cực cao mãn tính là nguy cơ sức khỏe nghiêm trọng: tăng cortisol → tăng huyết áp, đường huyết, ức chế miễn dịch. Cần can thiệp chuyên nghiệp.',
      'Stress cao kéo dài ảnh hưởng tim mạch, tiêu hóa và miễn dịch. Ưu tiên 1 kỹ thuật thư giãn hàng ngày — chỉ 10 phút đủ tạo tác động tích lũy.',
      'Mức stress trung bình có thể kiểm soát. Thêm 10 phút đi bộ hoặc thở sâu vào cuối ngày làm việc để "xả" căng thẳng tích lũy.',
      'Rất tốt! Stress thấp giúp hệ miễn dịch, tim mạch và tâm trạng hoạt động tối ưu. Duy trì các thói quen quản lý stress của bạn.',
      'Tuyệt vời! Kiểm soát stress xuất sắc là kỹ năng sống quý giá. Chia sẻ cách bạn duy trì sự bình thản với người xung quanh.',
    ],
  },
  {
    id: 10, cat: 'Tâm Trí', q: 'Bạn có thực hành kỹ thuật thư giãn (thở sâu, thiền, yoga) không?',
    opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Hàng ngày'],
    insights: [
      'Bắt đầu đơn giản nhất: thở 4-7-8 (hít 4 giây, nín 7, thở ra 8) × 3 lần trước khi ngủ. 2 phút mỗi đêm là đủ để bắt đầu thay đổi.',
      'Chưa thành thói quen. Thử: 5 phút thở sâu bụng sau bữa trưa. Nhỏ nhưng đủ tạo sự khác biệt trong ngày dài áp lực.',
      'Tốt hơn không có nhưng chưa đủ để tạo tác động tích lũy. Ngay cả 5–10 phút/ngày nhất quán hiệu quả hơn 1 giờ/tuần không đều.',
      'Rất tốt! Thực hành thư giãn đều đặn giảm cortisol, cải thiện huyết áp và chất lượng giấc ngủ. Tiếp tục duy trì thói quen này.',
      'Xuất sắc! Thực hành thiền/thở sâu hàng ngày là một trong những thói quen có nhiều bằng chứng khoa học nhất về lợi ích sức khỏe.',
    ],
  },
  {
    id: 11, cat: 'Phòng Bệnh', q: 'Bạn đi khám sức khỏe định kỳ bao nhiêu?',
    opts: ['Không bao giờ', 'Khi thấy bệnh mới đi', 'Mỗi 2–3 năm', 'Hàng năm', 'Thường xuyên hơn khi cần'],
    insights: [
      'Không khám định kỳ = bệnh chỉ phát hiện khi đã có triệu chứng nặng. Ung thư giai đoạn 1 vs giai đoạn 4: tỷ lệ sống khác nhau 5–10 lần.',
      'Điều trị triệu chứng tốn kém hơn và ít hiệu quả hơn phòng ngừa nhiều. Gói khám cơ bản ~500.000–1.500.000 VNĐ/năm là đầu tư nhỏ cho sức khỏe lớn.',
      'Khá ổn nhưng nhiều bệnh (tăng HA, tiểu đường) thay đổi đáng kể trong 1–2 năm. Khám hàng năm là lý tưởng từ 35–40 tuổi.',
      'Tuyệt vời! Khám định kỳ hàng năm cho sức khỏe của bạn cơ hội phát hiện sớm và điều trị hiệu quả nhất có thể.',
      'Xuất sắc! Theo dõi sức khỏe chủ động với tần suất phù hợp theo nguy cơ cá nhân là cách tiếp cận thông minh nhất.',
    ],
  },
  {
    id: 12, cat: 'Phòng Bệnh', q: 'Bạn có hút thuốc hoặc uống rượu bia thường xuyên không?',
    opts: ['Hút thuốc + uống nhiều', 'Một trong hai nhiều', 'Một trong hai ít', 'Đôi khi một trong hai', 'Không có cả hai'],
    insights: [
      'Hút thuốc + uống nhiều rượu là tổ hợp nguy hiểm nhất cho gan, phổi và tim. Không cần bỏ hoàn toàn ngay: giảm 50% trong 30 ngày đã là thành công lớn.',
      'Dù là thuốc hay rượu, mức "nhiều" gây tổn thương tích lũy. Mục tiêu 30 ngày đầu: giảm ngay 50%. Tìm hỗ trợ từ bác sĩ hoặc ứng dụng cai thuốc.',
      'Hướng đúng, cần giảm tiếp. Không có mức rượu bia nào hoàn toàn an toàn theo WHO 2023. Mỗi ly bỏ được là lợi ích sức khỏe thực sự.',
      'Gần như lý tưởng. Sử dụng không thường xuyên ít ảnh hưởng đến sức khỏe tổng thể — duy trì được là quan trọng nhất.',
      'Xuất sắc! Không hút thuốc và không uống rượu bia là hai trong số các quyết định có tác động lớn nhất đến tuổi thọ và chất lượng sống.',
    ],
  },
  {
    id: 13, cat: 'Kiến Thức', q: 'Bạn chủ động tìm hiểu thông tin sức khỏe bao nhiêu?',
    opts: ['Không bao giờ', 'Hiếm khi', 'Đôi khi', 'Thường xuyên', 'Hàng ngày'],
    insights: [
      'Kiến thức sức khỏe là nền tảng của mọi quyết định đúng đắn. Bắt đầu: đọc 1 bài sức khỏe uy tín mỗi tuần. Trang này là điểm khởi đầu tốt.',
      'Ít thông tin dẫn đến quyết định sức khỏe kém. Đăng ký 1 newsletter sức khỏe uy tín — thông tin sẽ tự đến bạn mỗi tuần.',
      'Bạn quan tâm nhưng chưa đủ đều. Dành 15 phút/tuần đọc nội dung từ nguồn khoa học đáng tin là đầu tư thời gian cực tốt.',
      'Rất tốt! Cập nhật thường xuyên giúp bạn ra quyết định sức khỏe tốt hơn và phát hiện sớm những thay đổi đáng lo ngại.',
      'Xuất sắc! Bạn là người học tập sức khỏe chủ động. Nhớ chọn lọc nguồn uy tín và tư duy phản biện — không phải mọi thứ trên mạng đều đúng.',
    ],
  },
  {
    id: 14, cat: 'Kiến Thức', q: 'Bạn có biết các chỉ số sức khỏe cơ bản của mình (BMI, HA, đường huyết) không?',
    opts: ['Không biết', 'Biết một phần', 'Biết nhưng không theo dõi', 'Biết và theo dõi thỉnh thoảng', 'Biết và theo dõi đều đặn'],
    insights: [
      'Không biết BMI, huyết áp, đường huyết giống như lái xe không có đồng hồ. 1 lần khám cơ bản sẽ cho bạn tất cả số liệu cần thiết.',
      'Hiểu một phần là điểm tốt để bắt đầu. Tìm hiểu nốt các chỉ số còn thiếu — Google "ngưỡng BMI, huyết áp bình thường" và ghi nhớ.',
      'Biết nhưng không theo dõi là lãng phí thông tin. Lập 1 bảng Excel đơn giản ghi lại các chỉ số sau mỗi lần khám — 5 phút thôi.',
      'Tốt! Theo dõi thỉnh thoảng giúp phát hiện xu hướng. Tăng tần suất lên mỗi 6–12 tháng để có dữ liệu đủ có giá trị.',
      'Xuất sắc! Theo dõi chỉ số đều đặn là công cụ phòng bệnh mạnh nhất bạn có thể tự thực hiện. Xu hướng quan trọng hơn số tuyệt đối.',
    ],
  },
  {
    id: 15, cat: 'Kiến Thức', q: 'Bạn tin tưởng khả năng tự quản lý sức khỏe của mình không?',
    opts: ['Không tự tin chút nào', 'Ít tự tin', 'Tự tin vừa phải', 'Tự tin', 'Rất tự tin'],
    insights: [
      'Không tự tin là bình thường khi bắt đầu. Trang web này được xây dựng để giúp bạn từng bước. Bắt đầu từ 1 thay đổi nhỏ nhất có thể làm ngay hôm nay.',
      'Tự tin sẽ đến từ kiến thức và hành động nhỏ. Chọn 1 thói quen từ trang web này và thực hiện trong 21 ngày — thành công nhỏ tạo tự tin lớn.',
      'Đây là nền tảng tốt để phát triển. Tiếp tục học hỏi và thực hành — tự tin sẽ tăng theo kinh nghiệm và kết quả thực tế.',
      'Rất tốt! Tự tin quản lý sức khỏe giúp bạn duy trì thói quen lâu dài và ứng phó tốt hơn khi sức khỏe có vấn đề.',
      'Xuất sắc! Bạn là người chủ động với sức khỏe của mình. Chia sẻ kiến thức và kinh nghiệm với người xung quanh — đó là điều tuyệt vời nhất.',
    ],
  },
];

const CATS = ['Vận Động', 'Dinh Dưỡng', 'Giấc Ngủ', 'Tâm Trí', 'Phòng Bệnh', 'Kiến Thức'];

const LEVELS = [
  { min: 0, max: 39, label: 'Cần Cải Thiện Nhiều', color: '#ef4444', desc: 'Sức khỏe của bạn đang ở mức cần chú ý. Bắt đầu với 1–2 thay đổi nhỏ ngay hôm nay.' },
  { min: 40, max: 59, label: 'Đang Trên Đà Phát Triển', color: '#f97316', desc: 'Bạn đã có nền tảng nhất định. Tập trung vào những điểm yếu để bứt phá.' },
  { min: 60, max: 74, label: 'Tốt — Tiếp Tục Duy Trì', color: '#eab308', desc: 'Bạn có lối sống lành mạnh hơn trung bình. Tinh chỉnh các điểm còn thiếu.' },
  { min: 75, max: 89, label: 'Rất Tốt', color: '#22c55e', desc: 'Bạn đang thực hành sức khỏe ở mức cao. Chia sẻ kiến thức với người xung quanh!' },
  { min: 90, max: 100, label: 'Xuất Sắc', color: '#3b82f6', desc: 'Bạn đang sống khỏe ở mức tối ưu. Duy trì và là nguồn cảm hứng cho người khác.' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-ea-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-ea-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

export default function HealthAssessmentPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eAssessOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eAssessOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  function setAnswer(id, val) { setAnswers(p => ({ ...p, [id]: val })); }

  function calcScore() {
    const total = Object.values(answers).reduce((s, v) => s + v, 0);
    return Math.round((total / (QUESTIONS.length * 4)) * 100);
  }

  function catScore(cat) {
    const qs = QUESTIONS.filter(q => q.cat === cat);
    const answered = qs.filter(q => answers[q.id] !== undefined);
    if (!answered.length) return null;
    const sum = answered.reduce((s, q) => s + answers[q.id], 0);
    return Math.round((sum / (answered.length * 4)) * 100);
  }

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
  const score = submitted ? calcScore() : null;
  const level = score !== null ? LEVELS.find(l => score >= l.min && score <= l.max) : null;

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Kiến Thức Sức Khỏe</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🎯</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Đánh Giá Sức Khỏe</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            15 câu hỏi · 6 lĩnh vực
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đánh giá toàn diện lối sống và thói quen sức khỏe của bạn qua 15 câu hỏi thuộc 6 lĩnh vực. Kết quả giúp bạn xác định điểm mạnh cần phát huy và điểm yếu cần cải thiện.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop" alt="Đánh giá sức khỏe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Hiểu mình · Cải thiện đúng chỗ
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {!submitted ? (
        <RevealBlock delay={0} className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: COLOR }}>Bài Đánh Giá</h2>
            <span className="text-lg text-muted">{Object.keys(answers).length}/{QUESTIONS.length} câu</span>
          </div>
          <div className="space-y-6">
            {QUESTIONS.map((q, i) => {
              const prevCat = i > 0 ? QUESTIONS[i - 1].cat : null;
              return (
                <div key={q.id}>
                  {q.cat !== prevCat && (
                    <div className="text-base font-bold uppercase tracking-widest mb-3 px-1" style={{ color: COLOR }}>— {q.cat}</div>
                  )}
                  <div className="rounded-2xl border bg-surface p-4 transition-all duration-300"
                    style={{ borderColor: answers[q.id] !== undefined ? `rgba(${SCORE_COLORS[answers[q.id]].rgb},0.25)` : 'rgba(255,255,255,0.08)' }}>
                    <p className="text-base text-text font-medium mb-3">{i + 1}. {q.q}</p>
                    <div className="flex flex-col gap-2">
                      {q.opts.map((opt, j) => {
                        const sc = SCORE_COLORS[j];
                        const selected = answers[q.id] === j;
                        return (
                          <button key={j} onClick={() => setAnswer(q.id, j)}
                            className="flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200"
                            style={{
                              border: `1.5px solid ${selected ? sc.color : 'rgba(255,255,255,0.08)'}`,
                              background: selected ? `rgba(${sc.rgb},0.12)` : 'rgba(255,255,255,0.02)',
                              boxShadow: selected ? `0 0 12px rgba(${sc.rgb},0.15)` : 'none',
                              transform: selected ? 'translateX(2px)' : 'translateX(0)',
                            }}>
                            <div className="w-3 h-3 rounded-full shrink-0 transition-all duration-200"
                              style={{ background: selected ? sc.color : 'rgba(255,255,255,0.2)', boxShadow: selected ? `0 0 6px ${sc.color}` : 'none' }} />
                            <span className="flex-1 text-sm" style={{ color: selected ? '#e5e7eb' : 'rgba(156,163,175,0.85)' }}>{opt}</span>
                            {selected && <span className="text-xs font-bold shrink-0" style={{ color: sc.color }}>{sc.label}</span>}
                          </button>
                        );
                      })}
                    </div>
                    {answers[q.id] !== undefined && (
                      <div className="mt-3 pl-4 border-l-2 py-1" style={{ borderColor: SCORE_COLORS[answers[q.id]].color }}>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(209,213,219,0.85)' }}>
                          {q.insights[answers[q.id]]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => { if (allAnswered) setSubmitted(true); }}
            disabled={!allAnswered}
            className="mt-8 w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: COLOR }}>
            {allAnswered ? 'Xem Kết Quả →' : `Trả lời thêm ${QUESTIONS.length - Object.keys(answers).length} câu nữa`}
          </button>
        </RevealBlock>
      ) : (
        <RevealBlock delay={0} className="mb-10">
          <div className="text-center mb-8">
            <div className="text-6xl font-black mb-2" style={{ color: level?.color }}>{score}</div>
            <div className="text-2xl font-bold text-text mb-2">{level?.label}</div>
            <p className="text-muted text-lg max-w-xl mx-auto">{level?.desc}</p>
          </div>
          <div className="w-full h-3 bg-surface rounded-full mb-8 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: level?.color }} />
          </div>
          <h3 className="font-bold text-text mb-4">Điểm Theo Lĩnh Vực</h3>
          <div className="space-y-3 mb-8">
            {CATS.map(cat => {
              const cs = catScore(cat);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg text-muted w-28 shrink-0">{cat}</span>
                  <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cs ?? 0}%`, background: COLOR, opacity: cs === null ? 0.3 : 1 }} />
                  </div>
                  <span className="text-lg font-bold w-10 text-right" style={{ color: COLOR }}>{cs ?? '–'}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="flex-1 py-2 rounded-xl text-lg border border-border text-muted hover:text-text transition-colors">Làm lại</button>
            <Link to="/pillar/e/roadmap" className="flex-1 py-2 rounded-xl text-lg font-bold text-white text-center transition-all" style={{ background: COLOR }}>Xem Lộ Trình →</Link>
          </div>
        </RevealBlock>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
