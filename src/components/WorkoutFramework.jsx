import { useState, useEffect } from 'react';

// ─── Color palette ─────────────────────────────────────────────────────────────
const S = {
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', hex:'#f97316', ring:'ring-orange-500/30', glow:'rgba(249,115,22,0.35)' },
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  hex:'#22c55e', ring:'ring-green-500/30',  glow:'rgba(34,197,94,0.35)'  },
  lime:   { text:'text-lime-400',   bg:'bg-lime-500/10',   border:'border-lime-500/30',   bar:'bg-lime-500',   hex:'#84cc16', ring:'ring-lime-500/30',   glow:'rgba(132,204,22,0.35)' },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   hex:'#3b82f6', ring:'ring-blue-500/30',   glow:'rgba(59,130,246,0.35)' },
  teal:   { text:'text-teal-400',   bg:'bg-teal-500/10',   border:'border-teal-500/30',   bar:'bg-teal-500',   hex:'#14b8a6', ring:'ring-teal-500/30',   glow:'rgba(20,184,166,0.35)' },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', hex:'#a855f7', ring:'ring-purple-500/30', glow:'rgba(168,85,247,0.35)' },
  pink:   { text:'text-pink-400',   bg:'bg-pink-500/10',   border:'border-pink-500/30',   bar:'bg-pink-500',   hex:'#ec4899', ring:'ring-pink-500/30',   glow:'rgba(236,72,153,0.35)' },
};

// ─── Framework data — 8 durations ─────────────────────────────────────────────
const FRAMEWORKS = [
  {
    mins: 20, label: '20 phút', color: 'green', intensityNum: 1,
    intensity: 'Nhẹ', forWho: 'Mới bắt đầu · Bận rộn', calBurn: '80–120 kcal',
    tagline: 'Đủ để tạo thói quen hàng ngày',
    headerImg: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:3,  icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Đánh thức cơ thể — nhẹ nhàng khởi động',
        exercises:['Thở cơ hoành × 5 nhịp','Đi bộ tại chỗ 30 giây','Xoay khớp vai & hông'] },
      { name:'Sức Mạnh', mins:12, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Vòng tập toàn thân — ưu tiên kỹ thuật chuẩn',
        exercises:['Ngồi xổm 2 × 10','Hít đất 2 × 8','Chống tĩnh 2 × 20 giây','Cầu mông 2 × 12'] },
      { name:'Giãn Cơ',  mins:5,  icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Hạ nhiệt & phục hồi cơ bản',
        exercises:['Giãn đùi trước 30 giây/bên','Mở ngực 30 giây','Tư thế em bé 45 giây'] },
    ],
  },
  {
    mins: 40, label: '40 phút', color: 'lime', intensityNum: 2,
    intensity: 'Nhẹ–Vừa', forWho: 'Người mới · Duy trì thói quen', calBurn: '150–220 kcal',
    tagline: 'Đủ để thấy tiến bộ rõ rệt sau 4 tuần',
    headerImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:5,  icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Bôi trơn khớp & tăng nhiệt cơ thể',
        exercises:['Thở cơ hoành × 5','Đi bộ tại chỗ 60 giây','Xoay vai × 10','Gập hông × 8','Ngồi xổm nhẹ × 8'] },
      { name:'Sức Mạnh', mins:20, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Xây dựng cơ bắp nền tảng — nghỉ 60 giây',
        exercises:['Ngồi xổm 3 × 10','Hít đất 3 × 10','Kéo dây 3 × 12','Bước tấn 2 × 10/bên','Chống tĩnh 3 × 30 giây'] },
      { name:'Tim Mạch', mins:10, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Zone 2 — đốt mỡ & cải thiện tuần hoàn',
        exercises:['Đi bộ nhanh 10 phút','Hoặc: Chạy bộ nhẹ Zone 2 (xen kẽ đi bộ nếu cần)','Hoặc: Leo cầu thang / Đạp xe tại chỗ'] },
      { name:'Giãn Cơ',  mins:5,  icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Phục hồi linh hoạt & hạ nhịp tim',
        exercises:['Giãn gấp hông 30 giây/bên','Giãn đùi sau 30 giây/bên','Mở ngực 30 giây','Thở chậm × 5'] },
    ],
  },
  {
    mins: 60, label: '60 phút', color: 'blue', intensityNum: 3,
    intensity: 'Vừa', forWho: 'Đang tập đều · Muốn tiến bộ', calBurn: '250–350 kcal',
    tagline: 'Chuẩn quốc tế — hiệu quả toàn diện',
    headerImg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:8,  icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Kích hoạt toàn diện hệ thần kinh & cơ',
        exercises:['Thở cơ hoành × 8','Đi bộ & nâng gối 90 giây','Xoay khớp đầy đủ','Ngồi xổm nhẹ × 10','Gập hông × 10','Xoay vòng hông × 10'] },
      { name:'Sức Mạnh', mins:25, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Kích thích tất cả nhóm cơ lớn — nghỉ 75 giây',
        exercises:['Ngồi xổm 3 × 12','Hạ tạ Romania 3 × 10','Hít đất nâng cao 3 × 12','Kéo dây 3 × 12','Bước tấn 3 × 10/bên','Chống tĩnh 3 × 40 giây','Nâng tứ chi 2 × 12'] },
      { name:'Tim Mạch', mins:15, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Zone 2 — đốt mỡ bền vững',
        exercises:['Đi bộ nhanh hoặc chạy bộ nhẹ 15 phút','Hoặc: Đạp xe Zone 2','Nhịp tim: 50–65% nhịp tim tối đa — còn nói chuyện thoải mái = đúng Zone 2'] },
      { name:'Giãn Cơ',  mins:7,  icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Tăng linh hoạt toàn thân',
        exercises:['Giãn gấp hông 30 giây/bên','Giãn đùi sau 30 giây/bên','Mở ngực 30 giây','Tư thế em bé 45 giây','Giãn vai & cổ 30 giây'] },
      { name:'Tĩnh Tâm', mins:5,  icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Củng cố kết quả & giảm hormone căng thẳng',
        exercises:['Thở hộp 4-4-4-4 × 3 vòng','Thiền quét cơ thể 1 phút','Ghi nhận thành tựu 30 giây'] },
    ],
  },
  {
    mins: 80, label: '80 phút', color: 'teal', intensityNum: 4,
    intensity: 'Vừa–Cao', forWho: 'Tập đều 3–4 tháng · Tiến bộ tốt', calBurn: '350–480 kcal',
    tagline: 'Tối ưu cho cả sức mạnh lẫn sức bền',
    headerImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:8,  icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Kích hoạt & chuẩn bị tối ưu cho buổi tập nặng',
        exercises:['Thở cơ hoành × 8','Đi bộ 90 giây','Vận động linh hoạt toàn thân 3 phút','Ngồi xổm & gập hông nhẹ × 10'] },
      { name:'Sức Mạnh', mins:35, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Khối lượng đủ lớn để tạo đà tăng trưởng',
        exercises:['Ngồi xổm 4 × 10','Hạ tạ Romania 3 × 12','Hít đất 4 × 12','Kéo dây 4 × 12','Bước tấn 3 × 10/bên','Chống tĩnh 3 × 45 giây','Nâng tứ chi 3 × 12','Xoay thân 2 × 15'] },
      { name:'Tim Mạch', mins:20, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Tim mạch cường độ thấp bền vững — cải thiện rõ rệt',
        exercises:['Đi bộ nhanh hoặc chạy bộ nhẹ 20 phút','Hoặc: Đạp xe Zone 2 cường độ thấp','Nhịp tim: 60–70% nhịp tim tối đa xuyên suốt'] },
      { name:'Giãn Cơ',  mins:10, icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Phục hồi đầy đủ sau buổi tập nặng',
        exercises:['Giãn toàn bộ cơ chính 5 phút','Foam roll (tùy chọn) 3 phút','Thở phục hồi 2 phút'] },
      { name:'Tĩnh Tâm', mins:7,  icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Tối ưu phục hồi hệ thần kinh',
        exercises:['Thở hộp × 5 vòng','Thiền quét cơ thể 2 phút','Hình dung kết quả 30 giây'] },
    ],
  },
  {
    mins: 120, label: '120 phút', color: 'purple', intensityNum: 5,
    intensity: 'Cao', forWho: 'Tập nghiêm túc 5–6 tháng', calBurn: '550–700 kcal',
    tagline: 'Buổi tập toàn diện — nền tảng thể lực thực sự',
    headerImg: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:10, icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Khởi động chuyên nghiệp — đầy đủ 4 giai đoạn',
        exercises:['Thở cơ hoành × 10','Vận động linh hoạt 4 phút','Giãn cơ động 4 phút','Bài kích hoạt cơ 2 phút'] },
      { name:'Sức Mạnh', mins:50, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Giao thức tăng cơ đầy đủ — nghỉ 90 giây',
        exercises:['Ngồi xổm 4 × 12','Hạ tạ Romania 4 × 10','Hít đất nâng cao 4 × 15','Kéo dây 4 × 12','Bước tấn 4 × 10/bên','Đẩy vai 3 × 10','Chống tĩnh 4 × 50 giây','Nâng tứ chi 3 × 15','Nâng gối treo xà 3 × 12'] },
      { name:'Tim Mạch', mins:30, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Zone 2 cường độ thấp — tối ưu đốt mỡ',
        exercises:['Zone 2 tim mạch 30 phút: chạy bộ, đi bộ nhanh, hoặc đạp xe','Nhịp tim: 55–70% nhịp tim tối đa — tốc độ chạy khoảng 6–8 phút/km','Uống nước mỗi 10 phút'] },
      { name:'Giãn Cơ',  mins:20, icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Giao thức phục hồi toàn thân',
        exercises:['Giãn cơ tĩnh toàn thân 10 phút','Foam roll các cơ trọng điểm 7 phút','Thở phục hồi 3 phút'] },
      { name:'Tĩnh Tâm', mins:10, icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Thiền sau tập — tối ưu phục hồi thể chất & tinh thần',
        exercises:['Thở hộp × 8 vòng','Thiền quét cơ thể 4 phút','Ghi nhật ký tập 2 phút'] },
    ],
  },
  {
    mins: 140, label: '140 phút', color: 'orange', intensityNum: 6,
    intensity: 'Cao', forWho: 'Tập luyện nghiêm túc > 6 tháng', calBurn: '650–820 kcal',
    tagline: 'Song song sức mạnh & sức bền — cấp độ nâng cao',
    headerImg: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:10, icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Giao thức chuẩn bị đầy đủ',
        exercises:['Vận động linh hoạt 5 phút','Khởi động động 3 phút','Kích hoạt cơ chuyên biệt 2 phút'] },
      { name:'Sức Mạnh', mins:60, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Tập sức mạnh khối lượng cao — toàn bộ nhóm cơ',
        exercises:['Ngồi xổm 5 × 12','Hạ tạ Romania 4 × 10','Hít đất nâng cao 5 × 15','Kéo dây 5 × 12','Bước tấn 4 × 12/bên','Đẩy vai 4 × 10','Chống tĩnh 5 × 60 giây','Nâng tứ chi 3 × 15','Nâng gối treo xà 4 × 12','Gập bụng chéo 3 × 20'] },
      { name:'Tim Mạch', mins:35, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Tim mạch ổn định Zone 2–3',
        exercises:['Zone 2 tim mạch 35 phút: chạy bộ, đạp xe, hoặc đi bộ nhanh','Nhịp tim: 60–70% nhịp tim tối đa — tốc độ chạy 5.5–7 phút/km','Tùy chọn: nửa đầu chạy bộ, nửa sau đạp xe (tập kết hợp nhẹ)'] },
      { name:'Giãn Cơ',  mins:25, icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Phục hồi chuyên sâu sau buổi tập khối lượng lớn',
        exercises:['Giãn cơ tĩnh 12 phút','Foam roll toàn thân 8 phút','Bài thở phục hồi 5 phút'] },
      { name:'Tĩnh Tâm', mins:10, icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Đặt lại tâm trí & thích nghi thần kinh',
        exercises:['Thư giãn cơ dần dần 6 phút','Biết ơn & đặt mục tiêu 2 phút','Lên kế hoạch buổi tiếp theo 2 phút'] },
    ],
  },
  {
    mins: 160, label: '160 phút', color: 'pink', intensityNum: 7,
    intensity: 'Rất Cao', forWho: 'Nghiệp dư chuyên nghiệp · > 1 năm kinh nghiệm', calBurn: '750–950 kcal',
    tagline: 'Phiên tập đỉnh cao — chỉ cho người có nền tốt',
    headerImg: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:15, icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Khởi động chuyên biệt theo môn — 3 giai đoạn',
        exercises:['Vận động linh hoạt toàn diện 7 phút','Bài chuẩn bị động 5 phút','Kích hoạt bùng nổ 3 phút'] },
      { name:'Sức Mạnh', mins:70, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Giao thức tăng cơ + sức mạnh bùng nổ toàn diện',
        exercises:['Biến thể ngồi xổm 5 × 12','Biến thể hạ tạ 5 × 10','Hít đất nâng cao 5 × 15','Kéo dây 5 × 12','Bước tấn nâng cao 4 × 12/bên','Đẩy vai 4 × 10','Biến thể chống tĩnh 5 × 60 giây','Cơ lõi chống xoay 4 × 12','Cô lập cơ mông & đùi sau 4 × 12','Bài bổ trợ kết thúc 15 phút'] },
      { name:'Tim Mạch', mins:40, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Giao thức tim mạch hỗn hợp Zone 2–3',
        exercises:['Zone 2 cường độ thấp 25 phút: chạy bộ, đạp xe, hoặc bơi lội','Tập ngắt quãng nhịp cao 10 phút: 5 × 1 phút chạy nhanh Zone 3–4 + 1 phút chạy chậm hồi phục','Chạy nhẹ/đi bộ hồi phục tích cực 5 phút'] },
      { name:'Giãn Cơ',  mins:25, icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Phục hồi đa lớp toàn diện',
        exercises:['Giãn cơ tĩnh toàn thân 12 phút','Foam roll & điểm kích hoạt 8 phút','Vận động linh hoạt phục hồi 5 phút'] },
      { name:'Tĩnh Tâm', mins:10, icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Giao thức phục hồi tâm trí cấp cao',
        exercises:['NSDR / nghỉ ngơi sâu không ngủ 8 phút','Nhìn lại tiến độ & ghi chép 2 phút'] },
    ],
  },
  {
    mins: 180, label: '180 phút', color: 'purple', intensityNum: 8,
    intensity: 'Cực Cao', forWho: 'Vận động viên · Mục tiêu thi đấu', calBurn: '900–1100 kcal',
    tagline: 'Phiên tập toàn diện — chỉ 1–2 lần/tuần',
    headerImg: 'https://images.unsplash.com/photo-1530655638484-de34468e9d92?w=1200&q=75',
    blocks: [
      { name:'Khởi Động', mins:15, icon:'🔥', color:'orange',
        img:'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&q=70',
        desc:'Chuẩn bị vận động viên chuyên nghiệp — 4 giai đoạn',
        exercises:['Vận động linh hoạt toàn diện 8 phút','Bài kích hoạt hệ thần kinh 4 phút','Chuẩn bị chuyên biệt theo môn 3 phút'] },
      { name:'Sức Mạnh', mins:80, icon:'💪', color:'green',
        img:'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=70',
        desc:'Khối lượng tối đa — toàn thân theo phân chia trên/dưới',
        exercises:['Biến thể ngồi xổm 5 × 12–15','Biến thể gập hông 5 × 10','Biến thể đẩy 5 × 15','Biến thể kéo 5 × 12','Vòng bước tấn 5 × 12/bên','Cơ lõi toàn diện 6 hiệp','Bài tập sức mạnh bùng nổ 15 phút','Bài tập bổ trợ 20 phút'] },
      { name:'Tim Mạch', mins:45, icon:'🏃', color:'blue',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&q=70',
        desc:'Tim mạch đa vùng nhịp — xây dựng nền sức bền',
        exercises:['Zone 2 nền 30 phút: chạy bộ liên tục hoặc đạp xe','Zone 3 nhịp độ cao 10 phút: chạy nhanh hơn Zone 2 (~4–5 phút/km)','Zone 1 hạ nhiệt chạy nhẹ/đi bộ 5 phút'] },
      { name:'Giãn Cơ',  mins:30, icon:'🧘', color:'teal',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=70',
        desc:'Giao thức phục hồi đầy đủ — đa hệ thống',
        exercises:['Giãn cơ tĩnh toàn thân 15 phút','Foam roll toàn diện 10 phút','Thở & vận động khớp 5 phút'] },
      { name:'Tĩnh Tâm', mins:10, icon:'🌿', color:'purple',
        img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70',
        desc:'Giao thức làm chủ tâm trí vận động viên',
        exercises:['Yoga Nidra / nghỉ ngơi sâu 8 phút','Nhật ký tập, suy ngẫm & kế hoạch tiếp theo 2 phút'] },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function WorkoutFramework() {
  const [activeDur,   setActiveDur]   = useState(0);
  const [activeBlock, setActiveBlock] = useState(null);
  const [modalBlock,  setModalBlock]  = useState(null);

  const fw    = FRAMEWORKS[activeDur];
  const total = fw.blocks.reduce((s, b) => s + b.mins, 0);
  const ms    = S[fw.color] || S.green;

  const handleDur = (i) => { setActiveDur(i); setActiveBlock(null); };
  const openModal  = (b, e) => { e.stopPropagation(); setModalBlock(b); };
  const closeModal = ()     => setModalBlock(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="mb-16">
      {/* ── Section header ── */}
      <div className="flex items-center gap-4 mb-7">
        <span className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 text-accent text-lg font-black flex items-center justify-center shrink-0">⏱</span>
        <h2 className="text-3xl font-black text-text">Chọn Khung Thời Gian Luyện Tập</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      <p className="text-muted text-lg mb-6">8 khung thời gian — từ 20 đến 180 phút — thiết kế theo từng mục tiêu và lịch bận</p>

      {/* ── Duration chip selector ── */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
        <div className="flex gap-2 min-w-max pb-1">
          {FRAMEWORKS.map((f, i) => {
            const isActive = activeDur === i;
            const cs = S[f.color] || S.green;
            return (
              <button
                key={f.mins}
                type="button"
                onClick={() => handleDur(i)}
                className={`group flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all duration-200 focus:outline-none ${
                  isActive ? `${cs.bg} ${cs.border}` : 'border-border hover:border-white/20 bg-surface'
                }`}
                style={{ boxShadow: isActive ? `0 4px 24px ${cs.glow}` : undefined }}
              >
                <span className={`text-lg font-black leading-none transition-colors ${isActive ? cs.text : 'text-text'}`}>
                  {f.label}
                </span>
                {/* Intensity dots */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, di) => (
                    <span
                      key={di}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                        di < Math.min(f.intensityNum, 5)
                          ? isActive ? cs.bar : 'bg-white/25'
                          : 'bg-white/8'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[8px] leading-none font-medium transition-colors ${isActive ? cs.text : 'text-muted/60'}`}>
                  {f.intensity}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Framework panel ── */}
      <div
        key={activeDur}
        className={`relative overflow-hidden rounded-3xl border ${ms.border} animate-fade-in-up`}
        style={{ boxShadow: `0 0 60px ${ms.glow}` }}
      >
        {/* Accent top bar */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${ms.hex}cc, ${ms.hex}33, transparent)` }} />

        {/* ── Header image ── */}
        <div className="relative h-48 md:h-52 overflow-hidden">
          <img src={fw.headerImg} alt="" className="w-full h-full object-cover" style={{ opacity: 0.42 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/75 via-transparent to-bg/20" />

          {/* Glow orb */}
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
            style={{ background: `radial-gradient(circle, ${ms.glow} 0%, transparent 70%)` }} />

          {/* Stats overlay — top right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <div className="glass border border-white/12 rounded-xl px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/40 uppercase tracking-wide">Calo</span>
                <span className={`text-[10px] font-bold ${ms.text}`}>{fw.calBurn}</span>
              </div>
            </div>
            <div className="glass border border-white/12 rounded-xl px-3 py-2 max-w-[180px]">
              <div className="flex items-start gap-1.5">
                <span className="text-[9px] text-white/40 uppercase tracking-wide shrink-0 mt-0.5">Dành cho</span>
                <span className="text-[10px] text-white/65 leading-snug">{fw.forWho}</span>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-5 left-5">
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`text-6xl font-black leading-none ${ms.text}`}>{fw.label}</span>
              <span className={`text-base font-bold px-2.5 py-1 rounded-full border ${ms.bg} ${ms.border} ${ms.text}`}>
                {fw.intensity}
              </span>
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-md">{fw.tagline}</p>
          </div>
        </div>

        {/* ── Timeline bar ── */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[9px] font-bold text-muted/60 uppercase tracking-widest mb-2.5">Phân bổ thời gian — {total} phút</p>

          {/* Segmented bar */}
          <div className="flex gap-0.5 h-4 rounded-full overflow-hidden bg-white/4 p-0.5">
            {fw.blocks.map((b, i) => {
              const cs = S[b.color] || S.green;
              return (
                <div
                  key={i}
                  title={`${b.name}: ${b.mins} phút`}
                  onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                  className={`${cs.bar} rounded-full cursor-pointer transition-all duration-300 hover:brightness-125 hover:scale-y-110`}
                  style={{ width: `${(b.mins / total) * 100}%`, transitionDelay: `${i * 60}ms` }}
                />
              );
            })}
          </div>

          {/* Timeline labels */}
          <div className="flex mt-1">
            {fw.blocks.map((b, i) => {
              const cs = S[b.color] || S.green;
              return (
                <div
                  key={i}
                  className="flex flex-col items-start cursor-pointer"
                  style={{ width: `${(b.mins / total) * 100}%` }}
                  onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                >
                  <span className={`text-[8px] font-bold ${cs.text} truncate px-0.5`}>{b.name}</span>
                  <span className="text-[7px] text-muted/40 px-0.5">{b.mins}'</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Block cards grid ── */}
        <div className="p-5 pt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fw.blocks.map((b, i) => {
              const cs = S[b.color] || S.green;
              const expanded = activeBlock === i;
              return (
                <div
                  key={i}
                  onClick={(e) => openModal(b, e)}
                  className="group relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-250 border-border hover:border-white/20 bg-surface/50"
                  style={{ ':hover': { boxShadow: `0 8px 32px ${cs.glow}` } }}
                >
                  {/* Image header */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={b.img}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                      style={{ opacity: expanded ? 0.45 : 0.3 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-bg ${expanded ? 'via-bg/50' : 'via-bg/60'} to-transparent`} />

                    {/* Card label row */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl leading-none">{b.icon}</span>
                        <span className="text-lg font-black text-white">{b.name}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cs.bg} ${cs.border} ${cs.text} shrink-0`}>
                        {b.mins} phút
                      </span>
                    </div>

                    {/* Expand icon */}
                    <div className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full border ${cs.border} ${cs.bg} flex items-center justify-center`}>
                      <svg className={`w-2.5 h-2.5 ${cs.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-3">
                    <p className="text-[10px] text-muted/70 mb-2.5 leading-snug">{b.desc}</p>

                    {/* Exercise chips — preview (first 3) */}
                    <div className="flex flex-wrap gap-1">
                      {b.exercises.slice(0, 3).map((ex, ei) => (
                        <span
                          key={ei}
                          className={`text-[9px] px-2 py-0.5 rounded-full border leading-snug ${cs.bg} ${cs.border} ${cs.text}`}
                        >
                          {ex}
                        </span>
                      ))}
                      {b.exercises.length > 3 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full border bg-white/4 border-white/10 text-muted/50">
                          +{b.exercises.length - 3} bài
                        </span>
                      )}
                    </div>

                    <p className={`mt-2.5 text-[9px] ${cs.text} opacity-50`}>Nhấn để xem chi tiết →</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <p className="text-muted/40 text-[10px] text-center mt-4">
            Nhấn vào từng khối để xem chi tiết · Nhấn vào thanh timeline để lọc theo giai đoạn
          </p>
        </div>
      </div>

      {/* ── Block detail modal ── */}
      {modalBlock && (() => {
        const mb = modalBlock;
        const mcs = S[mb.color] || S.green;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden border"
              style={{ borderColor: `${mcs.hex}50`, background: '#111215', boxShadow: `0 0 80px ${mcs.glow}` }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Image header */}
              <div className="relative h-52 overflow-hidden">
                <img src={mb.img} alt="" className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111215 0%, #111215 10%, rgba(17,18,21,0.45) 55%, transparent 100%)' }} />

                {/* Glow orb */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 30% 50%, ${mcs.glow} 0%, transparent 55%)`, opacity: 0.5 }} />

                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Bottom overlay content */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-5xl leading-none">{mb.icon}</span>
                    <div>
                      <h3 className="text-2xl font-black text-white leading-tight">{mb.name}</h3>
                      <p className={`text-base font-semibold ${mcs.text} mt-0.5`}>{mb.desc}</p>
                    </div>
                  </div>
                  <span className={`text-base font-bold px-3 py-1 rounded-full border shrink-0 ${mcs.bg} ${mcs.border} ${mcs.text}`}>
                    {mb.mins} phút
                  </span>
                </div>
              </div>

              {/* ── Content */}
              <div className="px-5 pb-6 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: mcs.hex }}>
                  Danh sách bài tập
                </p>
                <div className="flex flex-col gap-2">
                  {mb.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                      style={{ background: `${mcs.hex}0d`, border: `1px solid ${mcs.hex}22` }}
                    >
                      <span className={`text-base font-black shrink-0 mt-0.5 ${mcs.text}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-base text-white/80 leading-relaxed">{ex}</span>
                    </div>
                  ))}
                </div>

                {/* ESC hint */}
                <p className="text-[9px] text-muted/35 text-center mt-4">Nhấn ra ngoài hoặc nút × để đóng</p>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
