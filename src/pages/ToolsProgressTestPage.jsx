import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#ef4444';
const RGB = '239,68,68';
const ORBIT_ID = 'f-pt-orbit-kf';
const ORBIT_CLASS = 'f-pt-orbit-ring';
const LS_KEY = 'healthapp_f_test';
const LS_HIST = 'healthapp_f_test_hist';

const TEST_ITEMS = [
  {
    key: 'weight', label: 'Cân nặng', unit: 'kg', icon: '⚖️',
    how: 'Cân buổi sáng, sau vệ sinh, trước khi ăn', betterDir: 'Phụ thuộc mục tiêu',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cân nặng là chỉ số dễ đo nhất nhưng ít thông tin nhất về sức khỏe thực sự',
    details: [
      'Cân nặng dao động 1–3 kg trong ngày tùy theo nước, thức ăn và thời điểm — vì vậy luôn đo cùng điều kiện: sáng sớm, sau vệ sinh, trước ăn uống.',
      'Một mình cân nặng không nói lên đủ: hai người cùng 70 kg có thể có % mỡ và sức khỏe hoàn toàn khác nhau.',
      'Mục tiêu giảm cân: kỳ vọng giảm 0.5–1 kg/tuần là tốc độ lành mạnh. Giảm nhanh hơn thường đồng nghĩa mất cơ.',
      'Mục tiêu tăng cơ: cân tăng chậm 0.5 kg/tháng là dấu hiệu tốt — không cần tăng nhanh hơn nếu không dùng hỗ trợ.',
      'Mục tiêu recomp: cân nặng có thể không đổi nhiều tuần dù cơ thể đang cải thiện hình dáng và thể lực.',
      'Không nên cân hàng ngày nếu dễ bị ảnh hưởng tâm lý — 1 lần/tuần hoặc mỗi 4 tuần theo mốc test là đủ.',
    ],
    points: [
      { icon: '⏰', label: 'Thời điểm', note: 'Sáng sớm, sau vệ sinh, trước ăn' },
      { icon: '📊', label: 'Tần suất', note: '1 lần/tuần hoặc mỗi 4 tuần' },
      { icon: '🎯', label: 'Mục tiêu', note: 'Phụ thuộc goal cá nhân' },
      { icon: '💡', label: 'Lưu ý', note: 'Không so sánh ngày qua ngày' },
    ],
  },
  {
    key: 'waist', label: 'Vòng eo', unit: 'cm', icon: '📏',
    how: 'Đo ngang rốn sau khi thở ra nhẹ, không hít vào', betterDir: 'Giảm là tốt (≤ 80cm nữ, ≤ 90cm nam)',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Vòng eo phản ánh mỡ nội tạng — chỉ số sức khỏe tim mạch tốt hơn BMI',
    details: [
      'Mỡ bụng (nội tạng) nguy hiểm hơn mỡ dưới da vì bao quanh các cơ quan và tạo viêm mãn tính — vòng eo đo trực tiếp nguy cơ này.',
      'Cách đo chuẩn: thở ra nhẹ, đặt thước ngang qua rốn, giữ thước ngang và không kéo căng, đọc số sau khi thở ra.',
      'Ngưỡng nguy hiểm: nữ > 80 cm, nam > 90 cm — nguy cơ tim mạch và tiểu đường type 2 tăng đáng kể.',
      'Ngưỡng rủi ro cao: nữ > 88 cm, nam > 102 cm — cần can thiệp dinh dưỡng và vận động ngay.',
      'Vòng eo giảm sớm hơn cân nặng khi bắt đầu tập và ăn đúng — đây thường là dấu hiệu đầu tiên của sự thay đổi.',
      'Đo 1 lần mỗi 4 tuần cùng thời điểm trong ngày — buổi sáng trước ăn cho kết quả nhất quán nhất.',
    ],
    points: [
      { icon: '📍', label: 'Vị trí đo', note: 'Ngang rốn, thước nằm ngang' },
      { icon: '🫁', label: 'Kỹ thuật', note: 'Sau khi thở ra nhẹ' },
      { icon: '⚠️', label: 'Ngưỡng cảnh báo', note: '> 80 cm (nữ), > 90 cm (nam)' },
      { icon: '📉', label: 'Tốt hơn khi', note: 'Giảm đều theo từng 4 tuần' },
    ],
  },
  {
    key: 'sts', label: 'Sit-to-stand 1 phút', unit: 'lần', icon: '🪑',
    how: 'Đứng lên ngồi xuống từ ghế, không dùng tay đỡ, đếm trong 60 giây', betterDir: 'Tăng là tốt (≥ 20 lần = tốt)',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Sit-to-stand dự đoán nguy cơ té ngã và tuổi thọ tốt hơn nhiều bài test phức tạp',
    details: [
      'Nghiên cứu từ European Journal of Cardiology (2012) chỉ ra: điểm sit-to-stand thấp liên quan đến tỷ lệ tử vong cao hơn 5–6 lần trong 6 năm theo dõi.',
      'Bài test đo đồng thời sức mạnh chân, khả năng giữ thăng bằng, phối hợp cơ và sức bền tim mạch trong 60 giây.',
      'Cách thực hiện chuẩn: ngồi ghế thẳng (không có tay vịn), đứng lên hoàn toàn — hai chân thẳng, sau đó ngồi xuống nhẹ nhàng. Đếm số lần hoàn chỉnh trong 60 giây.',
      'Không được dùng tay đỡ vào đùi hoặc ghế — đây là lỗi phổ biến làm kết quả cao ảo.',
      'Mức tốt theo độ tuổi: 20–39 tuổi ≥ 25 lần; 40–59 tuổi ≥ 20 lần; 60+ tuổi ≥ 15 lần.',
      'Tăng 3–5 lần sau mỗi 4 tuần là tiến bộ xuất sắc — cho thấy sức mạnh chân và thể lực cải thiện rõ.',
    ],
    points: [
      { icon: '🪑', label: 'Thiết bị', note: 'Ghế thẳng, không tay vịn' },
      { icon: '🚫', label: 'Không dùng tay', note: 'Không đỡ vào đùi hay ghế' },
      { icon: '🏆', label: 'Mục tiêu', note: '≥ 20 lần/phút là tốt' },
      { icon: '📈', label: 'Tiến bộ', note: '+3–5 lần mỗi 4 tuần' },
    ],
  },
  {
    key: 'plank', label: 'Plank (gối hoặc thường)', unit: 'giây', icon: '💪',
    how: 'Giữ tư thế plank đến khi không thể nữa, lưng thẳng', betterDir: 'Tăng là tốt (≥ 60 giây = tốt)',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Plank đo sức mạnh lõi cơ thể — nền tảng của mọi vận động và bảo vệ cột sống',
    details: [
      'Sức mạnh lõi (core) không chỉ là bụng 6 múi — mà là khả năng giữ ổn định toàn bộ thân mình khi vận động, ngăn chấn thương lưng và cải thiện tư thế.',
      'Plank trên gối hoàn toàn hợp lệ nếu chưa đủ sức — quan trọng là tư thế thẳng từ gối/mũi chân đến đầu, không để hông võng hay nhô cao.',
      'Dừng khi: hông bắt đầu võng, lưng dưới đau, không giữ được hơi thở đều — không cố ép qua các tín hiệu này.',
      'Tiến bộ từ 20 giây lên 60 giây là bước ngoặt lớn. Trên 60 giây, bạn đã có nền sức mạnh lõi cơ bản.',
      'Mức tham chiếu: người mới < 30 giây; trung bình 30–60 giây; tốt > 60 giây; xuất sắc > 90 giây.',
      'Sau khi đạt 90 giây, thay vì giữ lâu hơn, hãy chuyển sang các biến thể khó hơn: plank có chân nâng, plank xoay, side plank.',
    ],
    points: [
      { icon: '📐', label: 'Tư thế', note: 'Thẳng từ đầu đến chân/gối' },
      { icon: '🛑', label: 'Dừng khi', note: 'Hông võng hoặc lưng đau' },
      { icon: '🏆', label: 'Mục tiêu', note: '≥ 60 giây (tốt)' },
      { icon: '⬆️', label: 'Nâng cấp', note: 'Trên 90 giây → biến thể khó hơn' },
    ],
  },
  {
    key: 'walk6', label: 'Đi bộ 6 phút', unit: 'm hoặc cảm giác', icon: '🚶',
    how: 'Đi bộ nhanh nhất có thể trong 6 phút, ghi quãng đường hoặc mức dễ/vừa/khó', betterDir: 'Cảm giác nhẹ hơn hoặc quãng đường xa hơn là tốt',
    color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
    keyFact: '6-Minute Walk Test là công cụ đo sức bền tim phổi được WHO khuyến nghị',
    details: [
      'Test đi bộ 6 phút (6MWT) là bài đánh giá sức bền tim phổi phổ biến nhất trong y học phục hồi chức năng — không cần thiết bị đắt tiền.',
      'Đi trên đoạn thẳng (hành lang, công viên), đi nhanh nhất có thể duy trì được trong 6 phút — không chạy, không dừng hẳn.',
      'Nếu không đo được khoảng cách: ghi nhận cảm giác — "dễ/vừa/khó". Cùng một lộ trình cảm thấy nhẹ hơn sau 4 tuần = đã tiến bộ.',
      'Mức tham chiếu (người trưởng thành): < 400m = cần cải thiện; 400–550m = trung bình; > 550m = tốt; > 650m = xuất sắc.',
      'Tốc độ cải thiện: thêm 20–50m sau mỗi 4 tuần là tiến bộ đáng kể cho người mới bắt đầu.',
      'Bài test này cũng phản ánh gián tiếp chất lượng giấc ngủ và phục hồi — nếu cảm thấy khó hơn dù đã tập, có thể đang thiếu ngủ hoặc overtrain.',
    ],
    points: [
      { icon: '🗺️', label: 'Địa điểm', note: 'Đoạn thẳng, bằng phẳng' },
      { icon: '⚡', label: 'Cường độ', note: 'Nhanh nhất duy trì được' },
      { icon: '🏆', label: 'Mục tiêu', note: '> 550m hoặc cảm giác nhẹ hơn' },
      { icon: '📈', label: 'Tiến bộ', note: '+20–50m mỗi 4 tuần' },
    ],
  },
  {
    key: 'sleep', label: 'Giấc ngủ TB', unit: 'giờ/đêm', icon: '😴',
    how: 'Trung bình 7 ngày qua, ước lượng gần nhất', betterDir: 'Mục tiêu ≥ 7 giờ',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Giấc ngủ là "steroid tự nhiên" — thiếu ngủ phá hỏng mọi nỗ lực tập luyện và ăn uống',
    details: [
      'Trong giấc ngủ sâu (deep sleep), cơ thể tiết GH (Growth Hormone) để sửa chữa cơ bắp, phục hồi mô và củng cố hệ miễn dịch — thiếu ngủ = thiếu phục hồi.',
      'Nghiên cứu cho thấy ngủ < 6 giờ/đêm làm tăng cảm giác đói (tăng ghrelin, giảm leptin), khiến khó kiểm soát ăn uống hơn 30–40%.',
      'Mục tiêu: 7–9 giờ/đêm cho người trưởng thành. Trẻ hơn và tập nặng hơn cần tiệm cận 9 giờ.',
      'Chất lượng quan trọng không kém số giờ: ngủ 8 giờ nhưng thức giấc nhiều lần kém hơn ngủ 7 giờ liên tục sâu.',
      'Dấu hiệu ngủ tốt: tỉnh dậy tự nhiên không cần báo thức, không buồn ngủ sau 3 giờ chiều, cảm giác sảng khoái buổi sáng.',
      'Nếu điểm ngủ không cải thiện dù đang tập đều — đây là vấn đề cần giải quyết trước mọi thứ khác.',
    ],
    points: [
      { icon: '🎯', label: 'Mục tiêu', note: '7–9 giờ/đêm' },
      { icon: '💤', label: 'Chất lượng', note: 'Ngủ liên tục, không thức giữa đêm' },
      { icon: '⚠️', label: 'Nguy hiểm', note: 'Dưới 6 giờ = phá hoại mọi nỗ lực' },
      { icon: '🌙', label: 'Ưu tiên', note: 'Sửa ngủ trước khi tăng tập' },
    ],
  },
  {
    key: 'stress', label: 'Stress tự chấm', unit: '/10', icon: '🌡️',
    how: 'Mức stress cảm nhận trung bình tuần qua (1 = bình thản, 10 = quá tải)', betterDir: 'Giảm là tốt (≤ 4 = tốt)',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress mãn tính tăng cortisol — phá hoại cơ bắp, tích mỡ bụng và suy giảm miễn dịch',
    details: [
      'Cortisol (hormone stress) ở mức cao kéo dài làm cơ thể phân giải cơ bắp để lấy năng lượng và ưu tiên tích trữ mỡ bụng.',
      'Thang điểm tự chấm: 1–3 = bình thản, kiểm soát tốt; 4–6 = stress vừa, có thể quản lý; 7–8 = cao, ảnh hưởng sức khỏe; 9–10 = quá tải, cần can thiệp.',
      'Stress ở mức 5–6/10 liên tục nhiều tuần nguy hiểm hơn stress đỉnh 9/10 ngắn ngày vì cơ thể không có thời gian phục hồi.',
      'Nếu điểm stress tăng qua các mốc test dù đang "tập tốt" — đây là cảnh báo cần giảm cường độ hoặc thêm ngày nghỉ.',
      'Các công cụ giảm stress hiệu quả: hít thở 4-7-8, thiền 10 phút/ngày, đi bộ thiên nhiên, viết nhật ký.',
      'Mục tiêu: giảm trung bình ≥ 1 điểm sau mỗi 4 tuần nếu điểm ban đầu ≥ 6.',
    ],
    points: [
      { icon: '📊', label: 'Thang điểm', note: '1 (bình thản) đến 10 (quá tải)' },
      { icon: '⚠️', label: 'Ngưỡng', note: 'Trên 6 = cần chú ý' },
      { icon: '🧘', label: 'Công cụ', note: 'Hít thở, thiền, đi bộ thiên nhiên' },
      { icon: '📉', label: 'Mục tiêu', note: 'Dưới 4 là vùng an toàn' },
    ],
  },
  {
    key: 'energy', label: 'Năng lượng tự chấm', unit: '/10', icon: '⚡',
    how: 'Mức năng lượng cảm nhận trung bình tuần qua (1 = kiệt sức, 10 = tràn đầy)', betterDir: 'Tăng là tốt (≥ 7 = tốt)',
    color: '#eab308', rgb: '234,179,8',
    img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Năng lượng tổng thể là thước đo tổng hợp nhất — phản ánh ngủ, dinh dưỡng, vận động cùng lúc',
    details: [
      'Năng lượng tự chấm là "chỉ số tổng hợp" tốt nhất: nếu ngủ đủ, ăn đủ chất và tập vừa sức, điểm năng lượng sẽ tăng tự nhiên.',
      'Thang điểm: 1–3 = kiệt sức, khó hoàn thành việc cơ bản; 4–6 = trung bình, hoạt động được; 7–8 = tốt, năng suất cao; 9–10 = tràn đầy, hiếm gặp.',
      'Điểm năng lượng thấp (< 5) kéo dài dù số liệu khác ổn = dấu hiệu thiếu sắt, thiếu B12, hoặc bệnh tiềm ẩn cần kiểm tra.',
      'Năng lượng buổi chiều (2–4 giờ) thường xuống thấp tự nhiên — đây không phải bệnh, mà là nhịp sinh học (circadian dip).',
      'Nếu năng lượng giảm sau khi tăng cường độ tập — đây là dấu hiệu overtrain hoặc thiếu carbohydrate trong khẩu phần.',
      'Mục tiêu: tăng trung bình ≥ 1 điểm sau mỗi 4 tuần nếu điểm ban đầu < 6.',
    ],
    points: [
      { icon: '📊', label: 'Thang điểm', note: '1 (kiệt sức) đến 10 (tràn đầy)' },
      { icon: '🎯', label: 'Mục tiêu', note: 'Duy trì ≥ 7 điểm' },
      { icon: '🔍', label: 'Chú ý', note: 'Dưới 5 kéo dài → kiểm tra sức khỏe' },
      { icon: '📈', label: 'Tiến bộ', note: '+1 điểm/4 tuần là tốt' },
    ],
  },
];

const MILESTONES = [
  {
    week: 0, label: 'Baseline', desc: 'Đo lần đầu tiên trước khi bắt đầu chương trình',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Dữ liệu nền tảng — điểm xuất phát của mọi tiến bộ',
    details: [
      'Baseline là lần đo quan trọng nhất trong cả hành trình — đây là "bức ảnh khởi đầu" giúp bạn nhìn lại tiến bộ thực sự sau 12 tuần.',
      'Hãy đo tất cả 8 chỉ số trong một buổi sáng, sau khi ngủ dậy, trước khi ăn uống để đảm bảo tính nhất quán cho các lần đo sau.',
      'Đừng lo nếu kết quả không đẹp — đây không phải bài kiểm tra năng lực, mà là điểm xuất phát. Không có Baseline nào "xấu".',
      'Ghi thêm cảm nhận chủ quan: mức năng lượng, chất lượng giấc ngủ, mức stress trung bình của tuần trước khi bắt đầu.',
      'Chụp ảnh màn hình hoặc in kết quả — bạn sẽ rất vui khi đối chiếu lại sau 12 tuần.',
      'Dùng Baseline để chọn cường độ tập ban đầu: nếu Plank dưới 20 giây, bắt đầu với cường độ nhẹ và tăng dần sau mỗi 2 tuần.',
    ],
    points: [
      { icon: '📅', label: 'Thời điểm đo', note: 'Buổi sáng, sau ngủ dậy, trước ăn' },
      { icon: '📋', label: 'Số chỉ số', note: '8 chỉ số toàn diện' },
      { icon: '🎯', label: 'Mục tiêu', note: 'Xác lập điểm xuất phát chính xác' },
      { icon: '💡', label: 'Lưu ý', note: 'Trung thực 100% — không tô hồng' },
    ],
  },
  {
    week: 4, label: 'Test 4 Tuần', desc: 'Kết quả đầu tiên — cảm giác và chỉ số đã thay đổi chưa?',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: '4 tuần đủ cảm nhận sự thay đổi — chưa cần thấy số thay đổi lớn',
    details: [
      'Sau 4 tuần, cơ thể bắt đầu thích nghi với lịch vận động và ăn uống mới — bạn có thể chưa thấy nhiều thay đổi trên cân, nhưng cảm giác cơ thể sẽ rõ hơn.',
      'Tập trung vào chỉ số chức năng: Plank tăng bao nhiêu giây? Sit-to-stand tăng bao nhiêu lần? Đây là bằng chứng thể lực thực sự cải thiện.',
      'Nếu cân nặng chưa thay đổi — hoàn toàn bình thường. Cơ thể đang xây nền tảng bên trong trước khi thay đổi hình dáng bên ngoài.',
      'So sánh từng chỉ số với Baseline: cải thiện 5–10% sau 4 tuần là kết quả xuất sắc và cho thấy bạn đang đi đúng hướng.',
      'Nếu ≥ 5/8 chỉ số không đổi hoặc tệ hơn — đây là tín hiệu cần điều chỉnh: thêm buổi tập, xem lại dinh dưỡng hoặc giấc ngủ.',
      'Ghi lại những gì hoạt động tốt và những gì khó duy trì — thông tin này quý hơn bất kỳ con số nào.',
    ],
    points: [
      { icon: '📈', label: 'Kỳ vọng', note: 'Cảm giác tốt hơn là đủ' },
      { icon: '🔍', label: 'Ưu tiên', note: 'Chỉ số chức năng > cân nặng' },
      { icon: '⚖️', label: 'Đánh giá', note: '3/8 tốt hơn = đúng hướng' },
      { icon: '✏️', label: 'Điều chỉnh', note: 'Điều chỉnh nhẹ nếu cần thiết' },
    ],
  },
  {
    week: 8, label: 'Test 8 Tuần', desc: 'Tiến bộ rõ rệt hơn — điều chỉnh nếu cần',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Tuần 8 là thời điểm vàng — tiến bộ rõ nhất và sẵn sàng tăng thử thách',
    details: [
      'Đây là mốc hầu hết người thấy kết quả rõ nhất — cơ thể đã vượt qua giai đoạn thích nghi và cải thiện hiệu quả hơn.',
      'Nếu nhất quán từ đầu, các chỉ số chức năng (Plank, Sit-to-stand, đi bộ 6 phút) có thể tăng 20–40% so với Baseline.',
      'Đây là lúc cân nhắc tăng cường độ: thêm trọng lượng, thêm reps, hoặc thêm 1 buổi tập/tuần nếu cơ thể đã thích nghi tốt.',
      'Kiểm tra stress và giấc ngủ — nếu hai chỉ số này xấu đi dù cơ thể tốt hơn, bạn có thể đang overtrain hoặc thiếu thời gian phục hồi.',
      'So sánh 3 mốc: Baseline → T4 → T8. Tốc độ cải thiện có duy trì? Nếu chậm lại, xem lại chất lượng dinh dưỡng và giấc ngủ trước tiên.',
      'Lập kế hoạch cụ thể cho 4 tuần cuối (T8→T12) dựa trên điểm mạnh và điểm yếu vừa phát hiện.',
    ],
    points: [
      { icon: '🚀', label: 'Cơ hội', note: 'Tăng thử thách có kiểm soát' },
      { icon: '📊', label: 'Mục tiêu', note: '+20–40% vs Baseline' },
      { icon: '😴', label: 'Chú ý', note: 'Stress & ngủ không xấu hơn' },
      { icon: '🗓️', label: 'Kế hoạch', note: 'Định hướng rõ 4 tuần cuối' },
    ],
  },
  {
    week: 12, label: 'Test 12 Tuần', desc: 'Tổng kết 1 chu kỳ — lập kế hoạch tiếp theo',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hoàn thành 12 tuần = bạn đã xây dựng được thói quen — điều khó nhất',
    details: [
      'Hoàn thành test T12 đồng nghĩa bạn đã bền vững qua 1 chu kỳ đầy đủ — điều mà phần lớn người không làm được.',
      'So sánh toàn bộ 4 mốc: Baseline → T4 → T8 → T12. Nhìn vào xu hướng tổng thể, không chỉ so T12 với T8.',
      'Tính điểm hoàn thành: đếm bao nhiêu trong 8 chỉ số đã cải thiện so với Baseline. 5/8+ = thành công rõ ràng; 3–4/8 = tiến bộ, cần tinh chỉnh.',
      'Những gì bạn học được về cơ thể trong 12 tuần này quý hơn bất kỳ số liệu nào — bạn đã biết mình phản ứng thế nào với vận động, ăn uống và stress.',
      'Nghỉ 1–2 tuần deload (giảm cường độ hoặc nghỉ ngơi) trước khi bắt đầu chu kỳ mới — cơ thể cần thời gian đồng hóa.',
      'Chu kỳ tiếp: giữ T12 làm Baseline mới và đặt mục tiêu cụ thể hơn cho từng chỉ số dựa trên kinh nghiệm vừa tích lũy.',
    ],
    points: [
      { icon: '🏆', label: 'Thành tích', note: '12 tuần nhất quán = thói quen' },
      { icon: '📝', label: 'Tổng kết', note: 'So sánh đầy đủ 4 mốc' },
      { icon: '🔄', label: 'Chu kỳ mới', note: 'T12 làm Baseline tiếp theo' },
      { icon: '😴', label: 'Recovery', note: '1–2 tuần deload trước khi tái bắt đầu' },
    ],
  },
];

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

const READ_TIPS = [
  {
    label: 'Không so sánh với người khác — chỉ so với chính mình lần trước',
    title: 'Không So Sánh Với Người Khác',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cuộc đua duy nhất đáng tham gia là cuộc đua với phiên bản cũ của chính bạn',
    details: [
      'Mỗi người có điểm xuất phát khác nhau: gen di truyền, lịch sử tập luyện, thói quen ngủ, mức stress — so sánh chỉ số với người khác là so sánh hai phương trình hoàn toàn khác nhau.',
      'Mạng xã hội chỉ hiển thị kết quả đẹp nhất của người khác, không phải hành trình thực tế — bạn đang so sánh cuộc sống thực của mình với highlight reel của họ.',
      'Nghiên cứu tâm lý học chỉ ra: người so sánh với người khác có động lực ngắn hạn nhưng kiệt sức nhanh hơn; người tập trung vào tiến bộ bản thân duy trì được lâu dài hơn.',
      'Câu hỏi đúng không phải "Tôi có tốt hơn X không?" mà là "Tôi có tốt hơn tôi của 4 tuần trước không?"',
      'Ngay cả 1 chỉ số cải thiện nhỏ — ngủ từ 5.5h lên 6h, plank từ 15s lên 20s — là tiến bộ thực sự đáng ăn mừng.',
      'Ghi chú cảm xúc bên cạnh số liệu: "Tuần này cảm thấy nhẹ hơn khi leo cầu thang" — những quan sát này không đo được bằng số nhưng có giá trị thực.',
    ],
    points: [
      { icon: '🔄', label: 'So sánh đúng', note: 'Chỉ so với chính mình' },
      { icon: '📱', label: 'Tránh bẫy MXH', note: 'Highlight reel ≠ thực tế' },
      { icon: '🎯', label: 'Câu hỏi đúng', note: 'Tôi tốt hơn 4 tuần trước chưa?' },
      { icon: '🌱', label: 'Ăn mừng nhỏ', note: 'Mọi tiến bộ đều có giá trị' },
    ],
  },
  {
    label: 'Tiến bộ nhỏ đều ổn — tốt hơn 1% mỗi tuần = 50% tốt hơn sau 1 năm',
    title: 'Sức Mạnh Của Tiến Bộ Nhỏ',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cải thiện 1% mỗi tuần tạo ra kết quả lớn hơn 50% sau 1 năm — sức mạnh của lãi kép',
    details: [
      'Toán học đơn giản: 1.01^52 tuần = 1.68 — nghĩa là cải thiện 1% mỗi tuần trong 1 năm tạo ra kết quả tốt hơn 68%, không phải chỉ 52%.',
      'Ngược lại: giảm 1% mỗi tuần (0.99^52) = chỉ còn 59% so với ban đầu — bỏ cuộc từng bước nhỏ cũng hủy hoại theo cấp số nhân.',
      '"Tốt hơn 1%" không cần đo lường chính xác — chỉ cần mỗi tuần có một điều gì đó nhỉnh hơn: plank thêm 5 giây, ngủ thêm 15 phút, căng thẳng giảm 0.5 điểm.',
      'Phần nguy hiểm nhất trong hành trình sức khỏe không phải là thất bại — mà là kỳ vọng kết quả lớn quá nhanh và bỏ cuộc khi không thấy.',
      'James Clear (Atomic Habits): "Bạn không tăng lên ngang tầm mục tiêu, bạn rơi xuống ngang tầm hệ thống". Xây hệ thống nhỏ > đặt mục tiêu lớn.',
      'Mỗi test 4 tuần chỉ cần 1–2 chỉ số tiến bộ rõ là đủ để biết hệ thống đang hoạt động — tiếp tục.',
    ],
    points: [
      { icon: '📈', label: 'Lãi kép', note: '+1%/tuần = +68% sau 1 năm' },
      { icon: '🧩', label: 'Hệ thống', note: 'Xây thói quen > đặt mục tiêu lớn' },
      { icon: '⏳', label: 'Kiên nhẫn', note: 'Kết quả lớn cần thời gian nhỏ đều' },
      { icon: '🎯', label: 'Ngưỡng thành công', note: '1–2 chỉ số tốt hơn = đúng hướng' },
    ],
  },
  {
    label: 'Nếu 3/8 chỉ số tốt hơn — đang đi đúng hướng',
    title: 'Đọc Điểm Số Toàn Diện',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Không phải tất cả 8 chỉ số cải thiện cùng lúc — đó là điều bình thường và đúng về sinh lý',
    details: [
      'Cơ thể không cải thiện đồng đều tất cả các hệ cùng lúc: tuần 1–4 thường thấy cải thiện thể lực trước, tuần 5–8 thấy cải thiện giấc ngủ và năng lượng, tuần 9–12 mới thấy thay đổi hình dáng.',
      'Nếu 3/8 chỉ số tốt hơn sau 4 tuần = tiến bộ thực sự. Nếu 5/8 trở lên = xuất sắc. Đừng đòi hỏi tất cả 8/8.',
      'Chú ý mối liên hệ giữa các chỉ số: ngủ tốt hơn thường kéo năng lượng tăng và stress giảm — đây là "ripple effect" (hiệu ứng lan tỏa) của một thay đổi.',
      'Chỉ số nào đang tốt? Đó là mảng bạn đang làm đúng — tiếp tục. Chỉ số nào đứng im hoặc tệ hơn? Đó là tín hiệu cần điều chỉnh cụ thể.',
      'Cân nặng và vòng eo thường thay đổi chậm hơn các chỉ số chức năng (plank, sit-to-stand) — đừng dùng hai chỉ số này làm thước đo duy nhất.',
      'Sau 12 tuần: tổng kết xem chỉ số nào cải thiện nhiều nhất, chỉ số nào ì nhất — đó là bản đồ của cơ thể bạn cho chu kỳ tiếp theo.',
    ],
    points: [
      { icon: '✅', label: 'Tốt', note: '3–4/8 chỉ số cải thiện' },
      { icon: '🏆', label: 'Xuất sắc', note: '5/8 trở lên cải thiện' },
      { icon: '🔗', label: 'Liên hệ', note: 'Một thay đổi kéo nhiều chỉ số khác' },
      { icon: '🗺️', label: 'Bản đồ', note: 'Chỉ số ì nhất = ưu tiên chu kỳ sau' },
    ],
  },
  {
    label: 'Nếu tất cả đứng im — cần thay đổi gì đó trong lịch tập hoặc dinh dưỡng',
    title: 'Khi Kết Quả Không Thay Đổi',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Plateau không phải thất bại — đó là tín hiệu cơ thể đã thích nghi và cần kích thích mới',
    details: [
      'Nếu tất cả 8 chỉ số không thay đổi sau 4 tuần, trước tiên kiểm tra: bạn có thực sự thực hiện đúng kế hoạch không? Nhật ký tập/ăn thực tế so với kế hoạch.',
      'Nguyên nhân phổ biến nhất của plateau: cường độ tập không tăng theo thời gian (cơ thể đã thích nghi); thiếu protein; ngủ dưới 6.5 giờ; stress mãn tính cao.',
      'Quy tắc điều chỉnh: thay đổi một biến mỗi lần — nếu thay đổi tập luyện VÀ dinh dưỡng cùng lúc, bạn không biết cái nào có tác dụng.',
      'Cách phá plateau vận động: thêm 10–15% khối lượng tập, hoặc thêm 1 buổi/tuần, hoặc đổi loại bài tập cho cùng nhóm cơ.',
      'Cách phá plateau dinh dưỡng: kiểm tra protein (≥ 1.6g/kg cân nặng), giảm đồ uống có calo ẩn (nước ngọt, cà phê sữa), thêm rau vào mỗi bữa.',
      'Nếu điều chỉnh 2 chu kỳ (8 tuần) mà vẫn không thay đổi — đây là lúc xem xét gặp chuyên gia dinh dưỡng hoặc huấn luyện viên để được đánh giá trực tiếp.',
    ],
    points: [
      { icon: '🔍', label: 'Kiểm tra trước', note: 'Thực hiện đúng kế hoạch chưa?' },
      { icon: '⚙️', label: 'Đổi 1 biến', note: 'Không đổi mọi thứ cùng lúc' },
      { icon: '💪', label: 'Tăng cường độ', note: '+10–15% khối lượng hoặc +1 buổi' },
      { icon: '🥗', label: 'Dinh dưỡng', note: 'Protein ≥ 1.6g/kg, thêm rau' },
    ],
  },
];

function ReadTipModal({ item, idx, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) onPrev();
      if (e.key === 'ArrowRight' && idx < total - 1) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, idx, total]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-2" style={{ color: item.color }}>{item.title}</h2>
          <div className="rounded-xl border-l-4 px-4 py-3 mb-6" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.07)` }}>
            <p className="text-base font-semibold" style={{ color: item.color }}>✦ {item.keyFact}</p>
          </div>
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
            <button onClick={() => idx > 0 && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx > 0 ? item.color : 'rgba(255,255,255,0.2)', background: idx > 0 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx > 0 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx > 0 ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => idx < total - 1 && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx < total - 1 ? item.color : 'rgba(255,255,255,0.2)', background: idx < total - 1 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx < total - 1 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx < total - 1 ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function TestItemModal({ item, idx, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) onPrev();
      if (e.key === 'ArrowRight' && idx < total - 1) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, idx, total]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.label}</h2>
          <p className="font-semibold text-sm mb-4" style={{ color: `rgba(${item.rgb},0.7)` }}>📊 {item.betterDir}</p>
          <div className="rounded-xl border-l-4 px-4 py-3 mb-6" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.07)` }}>
            <p className="text-base font-semibold" style={{ color: item.color }}>✦ {item.keyFact}</p>
          </div>
          <div className="rounded-xl border px-4 py-3 mb-6" style={{ borderColor: `rgba(${item.rgb},0.2)`, background: `rgba(${item.rgb},0.05)` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: item.color }}>📋 Cách đo</p>
            <p className="text-base text-muted">{item.how}</p>
          </div>
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
            <button onClick={() => idx > 0 && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx > 0 ? item.color : 'rgba(255,255,255,0.2)', background: idx > 0 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx > 0 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx > 0 ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => idx < total - 1 && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx < total - 1 ? item.color : 'rgba(255,255,255,0.2)', background: idx < total - 1 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx < total - 1 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx < total - 1 ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MilestoneModal({ item, idx, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && idx > 0) onPrev();
      if (e.key === 'ArrowRight' && idx < total - 1) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext, idx, total]);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}>
        <div className="relative h-44 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)`, color: item.color }}>
            T{item.week}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color: item.color }}>{item.label}</h2>
          <p className="font-semibold text-base mb-4" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.desc}</p>
          <div className="rounded-xl border-l-4 px-4 py-3 mb-6" style={{ borderColor: item.color, background: `rgba(${item.rgb},0.07)` }}>
            <p className="text-base font-semibold" style={{ color: item.color }}>✦ {item.keyFact}</p>
          </div>
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
            <button onClick={() => idx > 0 && onPrev()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx > 0 ? item.color : 'rgba(255,255,255,0.2)', background: idx > 0 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx > 0 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx > 0 ? 'pointer' : 'default' }}>← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => idx < total - 1 && onNext()} className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: idx < total - 1 ? item.color : 'rgba(255,255,255,0.2)', background: idx < total - 1 ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${idx < total - 1 ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: idx < total - 1 ? 'pointer' : 'default' }}>Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ToolsProgressTestPage() {
  const [inputs, setInputs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_HIST) || '[]'); } catch { return []; }
  });
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [testLabel, setTestLabel] = useState('Baseline');
  const [openItem, setOpenItem] = useState(null);
  const [testModal, setTestModal] = useState(null);
  const [readTipModal, setReadTipModal] = useState(null);
  const [milestoneModal, setMilestoneModal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --f-pt-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes fPtOrbitSpin { to { --f-pt-orbit-angle: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(--f-pt-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: fPtOrbitSpin 3.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const setVal = (key, val) => {
    const next = { ...inputs, [key]: val };
    setInputs(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const saveTest = () => {
    const entry = { date: testDate, label: testLabel, data: { ...inputs } };
    const next = [entry, ...history.filter(h => h.label !== testLabel)].sort((a, b) => a.label.localeCompare(b.label));
    setHistory(next);
    localStorage.setItem(LS_HIST, JSON.stringify(next));
    alert('Đã lưu kết quả test!');
  };

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← Công Cụ &amp; Tài Nguyên</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>📈</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Bộ Test Tiến Bộ 4 Tuần</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            8 chỉ số · Mỗi 4 tuần · Toàn diện hơn cân nặng
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Đo tiến bộ không chỉ bằng cân nặng. 8 chỉ số phản ánh đầy đủ hơn: thể lực, phục hồi, tâm trí và lối sống. Cân bằng và trung thực với chính mình.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop" alt="Progress test" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            đo lường toàn diện · không chỉ là cân nặng
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      {/* Milestones */}
      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Lịch Test 12 Tuần</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {MILESTONES.map((m, i) => (
            <div key={i}
              onClick={() => setMilestoneModal(i)}
              className="rounded-xl border p-4 text-center cursor-pointer group transition-all hover:bg-white/5"
              style={{ borderColor: milestoneModal === i ? `rgba(${m.rgb},0.45)` : `rgba(${m.rgb},0.2)`, background: `rgba(${m.rgb},0.04)`, transition: 'border-color 0.2s, background 0.2s' }}>
              <div className="text-3xl font-black mb-1" style={{ color: m.color }}>T{m.week}</div>
              <div className="font-bold text-text text-lg mb-1">{m.label}</div>
              <div className="text-sm text-muted mb-2">{m.desc}</div>
              <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: m.color }}>Chi tiết →</span>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* Test form */}
      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: COLOR }}>Nhập Kết Quả Test</h2>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-base text-muted block mb-1">Ngày test</label>
              <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-transparent text-lg text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }} />
            </div>
            <div>
              <label className="text-base text-muted block mb-1">Giai đoạn</label>
              <select value={testLabel} onChange={e => setTestLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-surface text-lg text-text focus:outline-none"
                style={{ borderColor: `rgba(${RGB},0.3)` }}>
                {MILESTONES.map(m => <option key={m.label} value={m.label}>{m.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {TEST_ITEMS.map((item, i) => (
              <div key={item.key} className="rounded-xl border border-border overflow-hidden group"
                style={{ borderColor: testModal === i ? `rgba(${item.rgb},0.4)` : undefined, transition: 'border-color 0.2s' }}>
                <div className="flex items-center gap-3 p-3">
                  <button onClick={() => setTestModal(i)} className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-lg font-medium text-text">{item.label}</div>
                      <div className="text-base text-muted">{inputs[item.key] ? `${inputs[item.key]} ${item.unit}` : 'Chưa nhập'}</div>
                    </div>
                    <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mr-2" style={{ color: item.color }}>Chi tiết →</span>
                  </button>
                  <button onClick={() => setOpenItem(openItem === i ? null : i)} className="text-muted text-lg px-2 py-1 hover:text-text transition-colors shrink-0">
                    {openItem === i ? '▲' : '▼'}
                  </button>
                </div>
                {openItem === i && (
                  <div className="px-3 pb-3 border-t border-border pt-2">
                    <p className="text-base text-muted mb-2">📋 {item.how}</p>
                    <p className="text-base mb-2" style={{ color: item.color }}>📊 {item.betterDir}</p>
                    <input type="text" value={inputs[item.key] ?? ''} onChange={e => setVal(item.key, e.target.value)}
                      placeholder={`Nhập ${item.unit}`} className="w-full px-3 py-2 rounded-lg border bg-transparent text-lg text-text placeholder-muted focus:outline-none"
                      style={{ borderColor: `rgba(${item.rgb},0.3)` }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={saveTest} className="w-full py-3 rounded-xl font-bold text-lg text-white" style={{ background: COLOR }}>
            💾 Lưu kết quả {testLabel}
          </button>
        </div>
      </RevealBlock>

      {/* History comparison */}
      {history.length > 0 && (
        <RevealBlock delay={2} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>So Sánh Kết Quả</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted font-medium">Chỉ số</th>
                  {history.map(h => <th key={h.label} className="text-center py-2 text-muted font-medium">{h.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {TEST_ITEMS.map(item => (
                  <tr key={item.key} className="border-b border-border/40">
                    <td className="py-2 text-muted flex items-center gap-1">{item.icon} {item.label}</td>
                    {history.map(h => (
                      <td key={h.label} className="py-2 text-center font-medium" style={{ color: h.data[item.key] ? COLOR : '#666' }}>
                        {h.data[item.key] || '–'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealBlock>
      )}

      {/* Note */}
      <RevealBlock delay={3} className="mb-10">
        <div className="rounded-2xl border p-5" style={{ borderColor: `rgba(${RGB},0.2)`, background: `rgba(${RGB},0.05)` }}>
          <h3 className="font-bold mb-3" style={{ color: COLOR }}>📌 Cách Đọc Kết Quả</h3>
          <ul className="space-y-2">
            {READ_TIPS.map((tip, i) => (
              <li key={i}
                onClick={() => setReadTipModal(i)}
                className="flex items-center gap-2 text-lg text-muted rounded-xl px-2 py-1.5 -mx-2 cursor-pointer group hover:bg-white/5 transition-colors">
                <span style={{ color: tip.color }} className="shrink-0">→</span>
                <span className="flex-1">{tip.label}</span>
                <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: tip.color }}>Chi tiết →</span>
              </li>
            ))}
          </ul>
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/f" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Công Cụ &amp; Tài Nguyên</Link>

      {readTipModal !== null && (
        <ReadTipModal
          item={READ_TIPS[readTipModal]}
          idx={readTipModal}
          total={READ_TIPS.length}
          onClose={() => setReadTipModal(null)}
          onPrev={() => setReadTipModal(i => Math.max(0, i - 1))}
          onNext={() => setReadTipModal(i => Math.min(READ_TIPS.length - 1, i + 1))}
        />
      )}
      {testModal !== null && (
        <TestItemModal
          item={TEST_ITEMS[testModal]}
          idx={testModal}
          total={TEST_ITEMS.length}
          onClose={() => setTestModal(null)}
          onPrev={() => setTestModal(i => Math.max(0, i - 1))}
          onNext={() => setTestModal(i => Math.min(TEST_ITEMS.length - 1, i + 1))}
        />
      )}
      {milestoneModal !== null && (
        <MilestoneModal
          item={MILESTONES[milestoneModal]}
          idx={milestoneModal}
          total={MILESTONES.length}
          onClose={() => setMilestoneModal(null)}
          onPrev={() => setMilestoneModal(i => Math.max(0, i - 1))}
          onNext={() => setMilestoneModal(i => Math.min(MILESTONES.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
