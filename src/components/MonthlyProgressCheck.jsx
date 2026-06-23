import { useState, useEffect } from 'react';

// ─── Color palette ─────────────────────────────────────────────────────────────
const C = {
  green:  { text:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30',  bar:'bg-green-500',  glow:'rgba(34,197,94,0.2)',   hex:'#22c55e', dot:'bg-green-400'  },
  blue:   { text:'text-blue-400',   bg:'bg-blue-500/10',   border:'border-blue-500/30',   bar:'bg-blue-500',   glow:'rgba(59,130,246,0.2)',  hex:'#3b82f6', dot:'bg-blue-400'  },
  purple: { text:'text-purple-400', bg:'bg-purple-500/10', border:'border-purple-500/30', bar:'bg-purple-500', glow:'rgba(168,85,247,0.2)',  hex:'#a855f7', dot:'bg-purple-400'},
  orange: { text:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30', bar:'bg-orange-500', glow:'rgba(249,115,22,0.2)',  hex:'#f97316', dot:'bg-orange-400'},
};

// ─── Test data (enriched with modal content) ───────────────────────────────────
const TEST_DATA = [
  {
    month: 1, week: 4, label: 'Tuần 4', color: 'green',
    icon: '🌱', title: 'Kiểm Tra Nền Tảng',
    desc: 'Đánh giá sau 1 tháng đầu — hỏi: "cơ thể mình đang ở đâu?"',
    tests: [
      { id:'plank', name:'Plank Tĩnh', icon:'⏱', unit:'giây',
        color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        detail:'Kiểm tra sức mạnh và sự ổn định core',
        keyFact:'Plank 30 giây là đủ để cột sống được bảo vệ trong sinh hoạt hàng ngày — nhiều hơn không nhất thiết tốt hơn.',
        details:[
          'Plank đo khả năng co cơ đẳng trương (isometric) — cơ làm việc mà không rút ngắn. Đây là nền tảng của mọi chuyển động an toàn.',
          'Form chuẩn: khuỷu tay thẳng dưới vai, người thẳng từ đầu đến gót, bụng kéo vào, không để hông nhô lên hoặc võng xuống.',
          'Nếu chưa giữ 15 giây: bắt đầu bằng knee plank (plank gối) — vẫn train đúng pattern, chỉ giảm tải trọng.',
          'Tăng tiến hợp lý: +5–10 giây/tuần. Khi đạt 60 giây chuẩn, chuyển sang side plank hoặc plank leg raise thay vì cố tăng thêm.',
        ],
        points:[
          { icon:'🔥', label:'Cơ core sâu', note:'Transversus abdominis — ổn định cột sống' },
          { icon:'🦴', label:'Tư thế trung lập', note:'Cột sống thẳng, không cong, không võng' },
          { icon:'💨', label:'Hít thở đều', note:'Đừng nín thở — thở bình thường dù đang căng' },
          { icon:'📈', label:'Tăng tiến tuần', note:'+5–10 giây/tuần là nhịp tăng hợp lý' },
        ],
        how:'Giữ plank thẳng (hoặc gối) — đếm số giây liên tục',
        levels:[{ label:'Bắt Đầu', min:15, color:'green' },{ label:'Tiến Bộ', min:30, color:'blue' },{ label:'Xuất Sắc', min:55, color:'purple' }],
        maxDisplay:90 },
      { id:'pushup', name:'Push-up Tối Đa', icon:'💪', unit:'lần',
        color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80&auto=format&fit=crop',
        detail:'Đo sức mạnh chi trên và sức bền cơ bắp',
        keyFact:'10 push-up liên tục là ngưỡng tối thiểu cho sức khỏe chi trên — tiêu chuẩn y tế chứ không phải thể thao.',
        details:[
          'Push-up train đồng thời ngực, vai trước, tricep và core — đây là bài đa cơ hiệu quả nhất không cần dụng cụ.',
          'Form chuẩn: tay rộng hơn vai một chút, hạ ngực đến gần sàn (không chạm), giữ người thẳng như plank, không để hông nhô.',
          'Người mới: bắt đầu bằng incline push-up (tay trên bàn cao) hoặc knee push-up — giảm khoảng 30–50% tải trọng.',
          'Tăng tiến: +2–3 lần/tuần hoặc giảm độ cao của bề mặt tay đặt dần xuống sàn khi đã quen.',
        ],
        points:[
          { icon:'💪', label:'Ngực & vai trước', note:'Pectoralis major + anterior deltoid' },
          { icon:'🦾', label:'Tricep hỗ trợ', note:'Push phase — duỗi thẳng khuỷu tay' },
          { icon:'🏋', label:'Core ổn định', note:'Toàn thân phải thẳng như plank' },
          { icon:'📐', label:'Độ rộng tay', note:'Rộng hơn vai một lòng bàn tay mỗi bên' },
        ],
        how:'Push-up chuẩn hoặc push-up gối — đếm số lần liên tục không dừng',
        levels:[{ label:'Bắt Đầu', min:5, color:'green' },{ label:'Tiến Bộ', min:10, color:'blue' },{ label:'Xuất Sắc', min:18, color:'purple' }],
        maxDisplay:30 },
      { id:'squat', name:'Squat 1 Phút', icon:'🦵', unit:'lần',
        color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=800&q=80&auto=format&fit=crop',
        detail:'Đo sức mạnh cơ đùi và khả năng phối hợp vận động',
        keyFact:'Squat là chuyển động "ngồi xuống – đứng lên" — chức năng cơ bản nhất của cuộc sống hàng ngày.',
        details:[
          'Squat train cơ tứ đầu đùi, cơ mông và core — đây là cụm cơ lớn nhất cơ thể, đốt calo nhiều nhất khi vận động.',
          'Form chuẩn: chân rộng ngang vai, mũi chân hướng ra ngoài nhẹ, hạ xuống đến đùi song song sàn, gối không vượt quá mũi chân nhiều.',
          'Trong 1 phút: duy trì nhịp đều — khoảng 2 giây xuống, 1 giây lên. Không cần nhanh, cần đủ form.',
          'Tăng tiến: khi đạt 28 lần/phút với form chuẩn, thêm cân (goblet squat) hoặc thử jump squat để tăng cường độ.',
        ],
        points:[
          { icon:'🦵', label:'Cơ tứ đầu', note:'Quadriceps — nhóm cơ đùi trước lớn nhất' },
          { icon:'🍑', label:'Cơ mông', note:'Glutes — ổn định hông và cột sống' },
          { icon:'⚖️', label:'Cân bằng', note:'Phân tải đều 2 chân — không ngã về trước' },
          { icon:'💨', label:'Nhịp thở', note:'Hít xuống, thở ra khi đứng lên' },
        ],
        how:'Squat liên tục trong 60 giây — đếm số lần hoàn chỉnh',
        levels:[{ label:'Bắt Đầu', min:12, color:'green' },{ label:'Tiến Bộ', min:20, color:'blue' },{ label:'Xuất Sắc', min:28, color:'purple' }],
        maxDisplay:40 },
      { id:'walk1k', name:'Đi Bộ 1km', icon:'🚶', unit:'phút',
        color:'#22c55e', rgb:'34,197,94',
        img:'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80&auto=format&fit=crop',
        detail:'Đo sức bền tim mạch ở mức độ nhẹ',
        keyFact:'Tốc độ đi bộ là một trong các chỉ số dự đoán tuổi thọ đáng tin cậy nhất — nghiên cứu JAMA 2019 trên 475,000 người.',
        details:[
          'Test cardio đơn giản nhất — không cần thiết bị, không áp lực, chỉ cần duy trì nhịp đi bộ nhanh nhất có thể liên tục 1km.',
          'Tốc độ đi bộ phản ánh hiệu suất tim mạch, sức mạnh chân và khả năng duy trì năng lượng — cả 3 yếu tố sức khỏe quan trọng.',
          'Dùng Google Maps hoặc app đo quãng đường — chọn đường thẳng, ít dốc để kết quả nhất quán qua các lần test.',
          'Mục tiêu dài hạn: dưới 11 phút/km. Khi đạt, chuyển sang interval run/walk thay vì tiếp tục đi bộ thuần.',
        ],
        points:[
          { icon:'❤️', label:'Tim mạch', note:'Nhịp tim 100–120 bpm là vùng tối ưu' },
          { icon:'🚶', label:'Tư thế đi', note:'Lưng thẳng, cánh tay đung đưa tự nhiên' },
          { icon:'📍', label:'Đo quãng đường', note:'Dùng app GPS để đảm bảo chính xác 1km' },
          { icon:'🎯', label:'Mục tiêu', note:'Giảm 30 giây mỗi tháng là tiến bộ tốt' },
        ],
        lowerBetter:true,
        how:'Thời gian hoàn thành 1km đi bộ liên tục — tính phút',
        levels:[{ label:'Bắt Đầu', min:13, color:'green' },{ label:'Tiến Bộ', min:11, color:'blue' },{ label:'Xuất Sắc', min:9, color:'purple' }],
        maxDisplay:20 },
    ],
  },
  {
    month: 2, week: 8, label: 'Tuần 8', color: 'blue',
    icon: '📈', title: 'Kiểm Tra Tiến Bộ',
    desc: 'Sau 2 tháng — hỏi: "mình đã tiến bộ bao nhiêu và hướng nào tiếp theo?"',
    tests: [
      { id:'plank', name:'Plank Tĩnh', icon:'⏱', unit:'giây',
        color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        detail:'Plank không gối — tiêu chuẩn cao hơn tháng 1',
        keyFact:'Tháng 2: benchmark tăng lên — plank thẳng (không gối) thể hiện core đã đủ mạnh để chịu toàn tải trọng cơ thể.',
        details:[
          'Tháng 2, bạn phải plank trên khuỷu tay và mũi chân — không còn cho phép dùng gối. Đây là test tải trọng thực sự.',
          'Nếu vẫn chưa làm được 30 giây plank thẳng, hãy xem lại độ consistency của tuần 1–4: có bỏ ngày không?',
          'Kỹ thuật nâng cao: thử "RKC plank" — co cơ mông và kéo khuỷu tay về phía mũi chân nhẹ nhàng để kích hoạt core sâu hơn.',
          'Mục tiêu tháng 2: đạt 50 giây plank thẳng — nghĩa là core đã sẵn sàng cho các bài nâng cao như ab wheel hoặc hollow body.',
        ],
        points:[
          { icon:'⬆️', label:'Chuẩn khó hơn', note:'Plank thẳng — không còn cho phép gối' },
          { icon:'🔒', label:'Kỹ thuật RKC', note:'Co mông + kéo khuỷu tay để tăng tension' },
          { icon:'📊', label:'So sánh tiến bộ', note:'Tháng 1: 15–55s → Tháng 2: 30–75s' },
          { icon:'🎯', label:'Mục tiêu kế tiếp', note:'Side plank + variations khi đạt 60s' },
        ],
        how:'Plank thẳng (không gối) — đếm giây liên tục',
        levels:[{ label:'Bắt Đầu', min:30, color:'green' },{ label:'Tiến Bộ', min:50, color:'blue' },{ label:'Xuất Sắc', min:75, color:'purple' }],
        maxDisplay:120 },
      { id:'pushup', name:'Push-up Tối Đa', icon:'💪', unit:'lần',
        color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80&auto=format&fit=crop',
        detail:'Push-up chuẩn — benchmark tăng so với tháng 1',
        keyFact:'Tháng 2: chỉ tính push-up chuẩn (không gối) — đây là dấu mốc chuyển từ "người mới" sang "trung cấp".',
        details:[
          'Nếu tháng 1 bạn dùng knee push-up, tháng 2 là lúc chuyển hẳn sang push-up đầy đủ — dù chỉ làm được 5–6 lần.',
          'Sự khác biệt tháng 1 → 2: từ "bao nhiêu lần có thể" sang "form giữ được đến lần nào thì hỏng".',
          'Tiêu chuẩn tháng 2: ngực hạ đến 3–5cm cách sàn, không nhún hông lên xuống, không lock khuỷu tay ở đỉnh.',
          'Đạt 18 lần chuẩn = tốt. Từ đây thêm khó: diamond push-up, decline push-up, hoặc dùng tạ cao tay.',
        ],
        points:[
          { icon:'📐', label:'Độ sâu quan trọng', note:'Ngực cách sàn ≤5cm — đếm lần đó thôi' },
          { icon:'🧍', label:'Form không nhượng bộ', note:'Dừng khi form hỏng, không ép thêm' },
          { icon:'⏱', label:'Không nghỉ giữa', note:'Test max liên tục — không ngừng để thở' },
          { icon:'🔼', label:'Lên cấp', note:'Từ 18+ lần: thử diamond hoặc decline push-up' },
        ],
        how:'Push-up chuẩn, không nghỉ — đếm số lần liên tục',
        levels:[{ label:'Bắt Đầu', min:10, color:'green' },{ label:'Tiến Bộ', min:18, color:'blue' },{ label:'Xuất Sắc', min:28, color:'purple' }],
        maxDisplay:45 },
      { id:'deadbug', name:'Dead Bug Form', icon:'🧠', unit:'điểm (0–10)',
        color:'#f97316', rgb:'249,115,22',
        img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
        detail:'Đánh giá kiểm soát motor pattern và anti-rotation core',
        keyFact:'Dead Bug là bài tập thần kinh cơ — luyện não bộ phối hợp tay chân đối diện trong khi giữ cột sống trung lập.',
        details:[
          'Dead Bug là test "kỹ năng" không phải test sức mạnh — ngay cả người yếu cũng có thể làm tốt nếu học đúng kỹ thuật.',
          'Tiêu chí tự chấm: (1) lưng có dán sàn suốt bài không? (2) tay chân đối diện có đồng bộ không? (3) có bị méo người không?',
          'Lỗi phổ biến: lưng cong, hít thở không đều, vội đưa tay chân quá nhanh, không kiểm soát khi trả về.',
          'Điểm 7–10 nghĩa là motor control tốt — chuẩn bị được cho các bài nâng cao như hanging leg raise hay ab wheel.',
        ],
        points:[
          { icon:'🧠', label:'Motor control', note:'Phối hợp tay-chân đối diện = thần kinh cơ' },
          { icon:'🫁', label:'Anti-extension', note:'Lưng dán sàn = cột sống trung lập' },
          { icon:'🎭', label:'Điểm tự đánh giá', note:'0–6: học lại; 7–8: ổn; 9–10: thành thạo' },
          { icon:'🔀', label:'Pattern', note:'Tay trái + chân phải, rồi đổi — như bò' },
        ],
        how:'Tự đánh giá: lưng có dán sàn không? tay chân có kiểm soát không? Cho điểm 0–10',
        levels:[{ label:'Học Thêm', min:4, color:'orange' },{ label:'Ổn Định', min:7, color:'blue' },{ label:'Thành Thạo', min:9, color:'purple' }],
        maxDisplay:10 },
      { id:'run1k', name:'Chạy/Đi 1km', icon:'🏃', unit:'phút',
        color:'#3b82f6', rgb:'59,130,246',
        img:'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80&auto=format&fit=crop',
        detail:'Đo sức bền tim mạch ở mức độ vừa đến cao',
        keyFact:'Tháng 2: nếu đi bộ tháng 1 được dưới 11 phút, đây là thời điểm thử interval run/walk để cán mốc 8 phút/km.',
        details:[
          'Khác tháng 1 (chỉ đi bộ), tháng 2 bạn được phép chạy — chạy bộ nhẹ, đi nhanh, hoặc kết hợp run/walk interval.',
          'Run/walk protocol đơn giản: chạy 1 phút, đi 1 phút, lặp lại. Dần dần tăng tỷ lệ chạy/đi theo tuần.',
          'Khi tim đập nhanh: đừng dừng lại — chuyển sang đi bộ nhanh. Dừng hoàn toàn làm recovery lâu hơn.',
          'Mục tiêu 8 phút/km = nhịp tim trung bình 130–140 bpm. Đây là "conversational pace" — vẫn nói được dù đang thở gấp.',
        ],
        points:[
          { icon:'🏃', label:'Run/walk OK', note:'Tháng 2 cho phép kết hợp cả hai' },
          { icon:'❤️', label:'Vùng tim mạch', note:'130–140 bpm = aerobic zone tối ưu' },
          { icon:'📱', label:'Dùng GPS app', note:'Strava/Nike Run Club đo chính xác nhất' },
          { icon:'🎯', label:'Cột mốc', note:'Dưới 8 phút = sẵn sàng tăng khoảng cách' },
        ],
        lowerBetter:true,
        how:'Thời gian hoàn thành 1km chạy bộ hoặc đi bộ nhanh — tính phút',
        levels:[{ label:'Bắt Đầu', min:11, color:'green' },{ label:'Tiến Bộ', min:8, color:'blue' },{ label:'Xuất Sắc', min:6, color:'purple' }],
        maxDisplay:15 },
    ],
  },
  {
    month: 3, week: 12, label: 'Tuần 12', color: 'purple',
    icon: '🎯', title: 'Kiểm Tra Tổng Kết 3 Tháng',
    desc: 'Đánh giá toàn diện sau 12 tuần — hỏi: "chu kỳ tiếp theo của mình là gì?"',
    tests: [
      { id:'plank', name:'Plank Nâng Cao', icon:'⏱', unit:'giây',
        color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
        detail:'Plank thẳng liên tục — tiêu chuẩn 3 tháng',
        keyFact:'Đạt 105 giây plank chuẩn sau 3 tháng = core đủ mạnh để thực hiện bất kỳ bài tập nào an toàn.',
        details:[
          'Tháng 3 benchmark tăng đáng kể: 50/75/105 giây. Đây là thử thách thực sự của 12 tuần consistency.',
          'Kỹ thuật Elite: thử RKC plank (co mông tối đa + kéo khuỷu tay về phía mũi chân) — giảm thời gian nhưng tăng tension gấp đôi.',
          'Nếu không đạt 50 giây: điều đó không có nghĩa là fail — xem lại sleep và recovery vì core strength phụ thuộc nhiều vào rest.',
          'Sau 3 tháng, nếu muốn tiếp tục: chuyển sang Ab Wheel Rollout hoặc L-sit thay vì cố tăng plank time thêm.',
        ],
        points:[
          { icon:'🏆', label:'Cột mốc 3 tháng', note:'105 giây = Elite sau 12 tuần training' },
          { icon:'🔥', label:'RKC technique', note:'Tăng tension bằng co cơ chủ động' },
          { icon:'🔄', label:'Sau tháng 3', note:'Chuyển sang Ab Wheel hoặc L-sit' },
          { icon:'🌙', label:'Sleep & Recovery', note:'Core strength phụ thuộc nhiều vào nghỉ ngơi' },
        ],
        how:'Plank thẳng liên tục — đếm đến khi không giữ được form',
        levels:[{ label:'Đạt Chuẩn', min:50, color:'green' },{ label:'Tốt', min:75, color:'blue' },{ label:'Elite', min:105, color:'purple' }],
        maxDisplay:150 },
      { id:'pushup', name:'Push-up 1 Phút', icon:'💪', unit:'lần',
        color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&q=80&auto=format&fit=crop',
        detail:'Sức bền cơ chi trên trong 60 giây',
        keyFact:'25 push-up trong 1 phút = mức "Tốt" của lực lượng vũ trang nhiều nước — tiêu chuẩn fitness toàn cầu.',
        details:[
          'Khác tháng 1 (max không giới hạn thời gian), tháng 3 là 1 phút — nghỉ giữa được nhưng đồng hồ vẫn chạy.',
          'Chiến thuật tốt nhất: 10–12 lần liên tục, nghỉ 5 giây, tiếp tục. Đừng cố làm hết một lần.',
          'Dừng khi form hỏng (hông nhô, ngực không chạm đủ độ sâu) — lần đó không tính vào kết quả.',
          '35 lần/phút = Elite sau 3 tháng. Từ đây chuyển sang pike push-up, archer push-up để tiếp tục tiến bộ.',
        ],
        points:[
          { icon:'⏱', label:'60 giây có nghỉ', note:'Dừng giữa được — thời gian vẫn chạy' },
          { icon:'🎯', label:'Chiến thuật set', note:'10–12 lần, nghỉ 5s, tiếp tục hiệu quả hơn' },
          { icon:'🏆', label:'Chuẩn quân đội', note:'25 lần/phút = tiêu chuẩn nhiều quốc gia' },
          { icon:'🔼', label:'Lên cấp', note:'Từ 35+: pike push-up, archer push-up' },
        ],
        how:'Push-up liên tục trong 60 giây — nghỉ giữa được nhưng thời gian vẫn chạy',
        levels:[{ label:'Đạt Chuẩn', min:15, color:'green' },{ label:'Tốt', min:25, color:'blue' },{ label:'Elite', min:35, color:'purple' }],
        maxDisplay:50 },
      { id:'run5k', name:"Chạy 5km (hoặc đi bộ 12' test)", icon:'🏃', unit:'phút',
        color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80&auto=format&fit=crop',
        detail:'Kiểm tra sức bền tim mạch toàn diện sau 3 tháng',
        keyFact:'Hoàn thành 5km bất kể thời gian sau 12 tuần = thành tích đáng tự hào. Hầu hết người không tập không làm được.',
        details:[
          'Nếu chưa chạy được 5km liên tục: dùng 12-minute run test (đi bộ nhanh/chạy trong 12 phút, đo quãng đường mét).',
          '5km trong 50 phút = 10 phút/km = đi bộ nhanh hoặc jog rất chậm — đây là ngưỡng tối thiểu của test này.',
          'Cách chuẩn bị: tuần 11–12, thử chạy 4km một lần. Nếu được, 5km test sẽ không khó hơn nhiều.',
          '5km dưới 28 phút = 5:36/km pace — tốt ngang runner nghiệp dư chuyên tập. Đây là mục tiêu dài hạn 6–12 tháng.',
        ],
        points:[
          { icon:'🏃', label:"5km hoặc 12' test", note:'12-minute run nếu chưa chạy được 5km' },
          { icon:'⏱', label:'Pace tham khảo', note:"50 phút = 10'/km; 38 phút = 7:36'/km" },
          { icon:'❤️', label:'Aerobic base', note:'3 tháng xây nền cardio — đây là kết quả' },
          { icon:'🎯', label:'Mục tiêu 6 tháng', note:'Dưới 35 phút = tiếp tục chu kỳ tiếp theo' },
        ],
        lowerBetter:true,
        how:"Chạy 5km bất kể thời gian. Nếu chưa chạy được: đi bộ nhanh 12 phút, đo quãng đường (mét)",
        levels:[{ label:'Hoàn Thành', min:50, color:'green' },{ label:'Tốt', min:38, color:'blue' },{ label:'Elite', min:28, color:'purple' }],
        maxDisplay:70 },
      { id:'resthr', name:'Nhịp Tim Nghỉ (Resting HR)', icon:'❤', unit:'bpm',
        color:'#a855f7', rgb:'168,85,247',
        img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
        detail:'Chỉ số tim mạch khách quan nhất sau 3 tháng',
        keyFact:'Mỗi 1 bpm giảm trong resting HR = tim đập ít hơn 1,440 lần/ngày. Sau 3 tháng tập, giảm 5–10 bpm là bình thường.',
        details:[
          'Resting HR đo buổi sáng sớm trước khi rời khỏi giường — lúc tim chưa bị ảnh hưởng bởi hoạt động, căng thẳng hay cà phê.',
          'Người không tập: 70–85 bpm. Người hoạt động vừa: 60–70 bpm. Vận động viên sức bền: 40–55 bpm.',
          'Resting HR giảm là dấu hiệu tim mạnh hơn — mỗi nhịp đập bơm nhiều máu hơn, nên cần ít nhịp hơn để duy trì lưu lượng.',
          'Nếu HR tăng bất thường buổi sáng (>5 bpm so với ngày thường): đây là tín hiệu overtraining hoặc sắp bệnh — hãy nghỉ.',
        ],
        points:[
          { icon:'🌅', label:'Đo buổi sáng', note:'Trước khi ngồi dậy, sau khi tỉnh giấc' },
          { icon:'❤️', label:'Mục tiêu tốt', note:'Dưới 65 bpm sau 3 tháng là tốt' },
          { icon:'📉', label:'Xu hướng quan trọng', note:'Giảm 5–10 bpm sau 12 tuần = bình thường' },
          { icon:'⚠️', label:'Cảnh báo', note:'Tăng >5 bpm so với baseline = nghỉ ngơi' },
        ],
        lowerBetter:true,
        how:'Đo nhịp tim buổi sáng sớm khi vừa thức dậy — trước khi rời khỏi giường',
        levels:[{ label:'Bắt Đầu', min:75, color:'green' },{ label:'Tốt', min:65, color:'blue' },{ label:'Athlete', min:55, color:'purple' }],
        maxDisplay:100 },
    ],
  },
];

// ─── Scoring helpers ──────────────────────────────────────────────────────────
function scoreTest(test, value) {
  if (value === '' || value === null || value === undefined) return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  const [l0, l1, l2] = test.levels;
  if (test.lowerBetter) {
    if (v <= l2.min) return 2;
    if (v <= l1.min) return 1;
    if (v <= l0.min) return 0;
    return 0;
  } else {
    if (v >= l2.min) return 2;
    if (v >= l1.min) return 1;
    if (v >= l0.min) return 0;
    return 0;
  }
}

function totalScore(tests, values) {
  return tests.reduce((sum, t) => {
    const s = scoreTest(t, values[t.id]);
    return sum + (s !== null ? s : 0);
  }, 0);
}

function allFilled(tests, values) {
  return tests.every(t => values[t.id] !== '' && values[t.id] !== undefined);
}

const GRADES = [
  { min: 7, grade: 'A', label: 'Xuất Sắc',         color: 'purple', note: 'Bạn đang vượt kỳ vọng — cơ thể thích nghi rất tốt. Sẵn sàng thử thách cấp độ tiếp theo.' },
  { min: 5, grade: 'B', label: 'Tiến Bộ Tốt',      color: 'blue',   note: 'Tiến bộ rõ rệt — tiếp tục theo hướng này thêm 4 tuần, bạn sẽ đạt ngưỡng xuất sắc.' },
  { min: 3, grade: 'C', label: 'Đang Xây Nền',      color: 'green',  note: 'Nền tảng đang hình thành. Đừng vội — consistency quan trọng hơn speed ở giai đoạn này.' },
  { min: 0, grade: 'D', label: 'Cần Thêm Nỗ Lực',  color: 'orange', note: 'Hãy xem lại recovery, sleep và nutrition. Tập nhiều không bằng tập đúng và ngủ đủ.' },
];

function getGrade(score) {
  return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
}

// ─── Level bar (benchmark segments) ──────────────────────────────────────────
function LevelBar({ test, value }) {
  const scored = scoreTest(test, value);
  const colors = { green: '#22c55e', blue: '#3b82f6', purple: '#a855f7', orange: '#f97316' };

  return (
    <div className="mt-2">
      <div className="flex rounded-full overflow-hidden h-1.5 gap-px">
        {test.levels.map((lv, i) => {
          const active = scored !== null && scored >= i;
          const hex = colors[lv.color] || colors.green;
          return (
            <div
              key={i}
              className="flex-1 transition-all duration-300 rounded-full"
              style={{ background: active ? hex : 'rgba(255,255,255,0.08)' }}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        {test.levels.map((lv, i) => {
          const active = scored !== null && scored >= i;
          return (
            <span
              key={i}
              className={`text-[9px] font-bold transition-colors ${active ? C[lv.color]?.text || 'text-green-400' : 'text-muted/40'}`}
            >
              {lv.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Radar chart (4-axis SVG diamond) ────────────────────────────────────────
function RadarChart({ tests, values, color }) {
  const size   = 180;
  const center = size / 2;
  const maxR   = center - 28;
  const gc     = C[color] || C.green;

  const axes = [
    { angle: -90 },
    { angle:   0 },
    { angle:  90 },
    { angle: 180 },
  ];

  const toXY = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const gridLevels = [0.33, 0.66, 1.0];

  const scorePoints = tests.map((t, i) => {
    const s = scoreTest(t, values[t.id]);
    const ratio = s !== null ? s / 2 : 0;
    return toXY(axes[i % 4].angle, ratio * maxR);
  });

  const polygonPoints = scorePoints.map(p => `${p.x},${p.y}`).join(' ');

  const labelOffset = maxR + 14;
  const axisLabels = tests.map((t, i) => {
    const pt = toXY(axes[i % 4].angle, labelOffset);
    return { ...pt, name: t.name, icon: t.icon };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {gridLevels.map((frac, gi) => {
        const pts = axes.map(a => toXY(a.angle, frac * maxR));
        const d = pts.map((p, pi) => `${pi === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return (
          <path key={gi} d={d} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        );
      })}

      {axes.map((a, i) => {
        const pt = toXY(a.angle, maxR);
        return (
          <line key={i} x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        );
      })}

      {scorePoints.length === 4 && (
        <polygon
          points={polygonPoints}
          fill={gc.glow.replace('0.2', '0.35')}
          stroke={gc.hex}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {scorePoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3" fill={gc.hex} stroke="#111" strokeWidth="1.5" />
      ))}

      <circle cx={center} cy={center} r="2.5" fill="rgba(255,255,255,0.15)" />

      {axisLabels.map((lbl, i) => {
        const angle = axes[i % 4].angle;
        let anchor = 'middle';
        if (angle === 0)   anchor = 'start';
        if (angle === 180) anchor = 'end';
        return (
          <text key={i} x={lbl.x} y={lbl.y} textAnchor={anchor} dominantBaseline="middle"
            fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="'Be Vietnam Pro', sans-serif">
            {lbl.icon}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Test detail modal ────────────────────────────────────────────────────────
function TestDetailModal({ test, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const { color = '#22c55e', rgb = '34,197,94' } = test;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${rgb},0.28)`, boxShadow: `0 0 80px rgba(${rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={test.img} alt={test.name} className="w-full h-full object-cover" style={{ opacity: 0.55 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(${rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${rgb},0.18)`, border: `2px solid rgba(${rgb},0.45)` }}>
            {test.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-1" style={{ color }}>{test.name}</h2>
          <p className="font-semibold text-base mb-4" style={{ color: `rgba(${rgb},0.7)` }}>{test.detail}</p>

          {/* Key fact */}
          <div className="rounded-xl p-3 mb-5" style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.2)` }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color }}>💡 Sự thật quan trọng</p>
            <p className="text-sm text-text/85 leading-relaxed">{test.keyFact}</p>
          </div>

          {/* How to perform */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>📋 Cách thực hiện</p>
            <p className="text-sm text-muted leading-relaxed">{test.how}</p>
          </div>

          {/* Benchmark levels */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>📊 Chuẩn đánh giá</p>
            <div className="space-y-2">
              {test.levels.map((lv, li) => {
                const lc = C[lv.color] || C.green;
                return (
                  <div key={li} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{ background: `rgba(${rgb},0.05)`, border: `1px solid rgba(${rgb},0.1)` }}>
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${lc.text}`}
                      style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.25)` }}>{li + 1}</span>
                    <span className={`font-bold text-sm flex-1 ${lc.text}`}>{lv.label}</span>
                    <span className="text-sm text-muted font-bold">
                      {test.lowerBetter ? `≤ ${lv.min}` : `≥ ${lv.min}`} {test.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Numbered details */}
          <ul className="space-y-3 mb-8">
            {test.details.map((d, di) => (
              <li key={di} className="flex gap-3 text-sm text-muted leading-relaxed">
                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `rgba(${rgb},0.14)`, color }}>{di + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>

          {/* Key points 2-col grid */}
          <div className="grid grid-cols-2 gap-3">
            {test.points.map((pt, pi) => (
              <div key={pi} className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.15)` }}>
                <span className="text-2xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <p className="font-bold text-sm text-text leading-snug">{pt.label}</p>
                  <p className="text-xs text-muted mt-0.5">{pt.note}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted mt-6 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

// ─── Test card ────────────────────────────────────────────────────────────────
function TestCard({ test, inputKey, value, onChange, submitted, tabColor, onOpenDetail }) {
  const [localVal, setLocalVal] = useState(value || '');
  const [confirmed, setConfirmed] = useState(submitted);
  const tc = C[tabColor] || C.green;
  const sc  = scoreTest(test, localVal);
  const levelColors = { green: C.green, blue: C.blue, purple: C.purple, orange: C.orange };

  const handleSubmit = () => {
    if (localVal === '') return;
    onChange(localVal);
    setConfirmed(true);
  };

  const handleReset = () => {
    setConfirmed(false);
    setLocalVal('');
    onChange('');
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl border transition-all duration-200
      ${confirmed && sc !== null
        ? `${tc.bg} ${tc.border}`
        : 'bg-surface border-border hover:border-white/16'
      }
    `}
      style={confirmed && sc !== null ? { boxShadow: `0 4px 20px ${tc.glow}` } : {}}
    >
      <div className="p-4">
        {/* Header */}
        <div className="group/header flex items-start gap-2 mb-3">
          <span className="text-2xl leading-none mt-0.5">{test.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-lg text-text leading-tight">{test.name}</p>
            <p className="text-[10px] text-muted mt-0.5 leading-relaxed">{test.how}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {confirmed && sc !== null && (
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-black border ${tc.border} ${tc.bg} ${tc.text}`}>
                {sc === 2 ? '2' : sc === 1 ? '1' : '0'}
              </div>
            )}
            <button
              onClick={onOpenDetail}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: test.color || tc.hex, background: `rgba(${test.rgb || '34,197,94'},0.1)`, border: `1px solid rgba(${test.rgb || '34,197,94'},0.2)` }}
            >
              Chi tiết
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Benchmark bar */}
        <LevelBar test={test} value={confirmed ? localVal : ''} />

        {/* Input row */}
        <div className="mt-3 flex items-center gap-2">
          {!confirmed ? (
            <>
              <div className="relative flex-1">
                <input
                  type="number"
                  min="0"
                  value={localVal}
                  onChange={e => setLocalVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="0"
                  className="w-full bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 text-lg text-text font-bold placeholder:text-muted/40 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <span className="text-[10px] text-muted shrink-0">{test.unit}</span>
              <button
                onClick={handleSubmit}
                disabled={localVal === ''}
                className={`
                  shrink-0 px-3 py-1.5 rounded-lg text-base font-bold cursor-pointer
                  transition-all duration-200 border
                  ${localVal !== ''
                    ? `${tc.bg} ${tc.border} ${tc.text} hover:opacity-80`
                    : 'bg-white/4 border-white/8 text-muted/40 cursor-not-allowed'
                  }
                `}
              >
                OK
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              {sc !== null && (() => {
                const lv = test.levels[Math.min(sc, test.levels.length - 1)];
                const lc = levelColors[lv.color] || C.green;
                return (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lc.border} ${lc.bg} ${lc.text}`}>
                    {lv.label}
                  </span>
                );
              })()}
              <span className="text-base font-black text-text">{localVal} <span className="text-muted font-normal text-[10px]">{test.unit}</span></span>
              <button
                onClick={handleReset}
                className="ml-auto text-[10px] text-muted/50 hover:text-muted cursor-pointer transition-colors"
              >
                Sửa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MonthlyProgressCheck() {
  const [activeMonth, setActiveMonth] = useState(0);
  const [inputs, setInputs]           = useState({});
  const [submitted, setSubmitted]     = useState({});
  const [detailTest, setDetailTest]   = useState(null);

  const monthData = TEST_DATA[activeMonth];
  const mc = C[monthData.color] || C.green;

  const keyFor = (mIdx, testId) => `m${mIdx}_${testId}`;

  const getVal = (testId) => inputs[keyFor(activeMonth, testId)] || '';

  const handleChange = (testId, val) => {
    setInputs(prev => ({ ...prev, [keyFor(activeMonth, testId)]: val }));
  };

  const handleSubmitAll = () => {
    setSubmitted(prev => ({ ...prev, [activeMonth]: true }));
  };

  const isMonthSubmitted = !!submitted[activeMonth];

  const currentValues = Object.fromEntries(
    monthData.tests.map(t => [t.id, getVal(t.id)])
  );

  const hasAnyInput = monthData.tests.some(t => getVal(t.id) !== '');
  const hasAllInput = allFilled(monthData.tests, currentValues);

  const total = totalScore(monthData.tests, currentValues);
  const grade = getGrade(total);
  const maxPossible = monthData.tests.length * 2;

  return (
    <>
      <section className="mb-16">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-black text-text mb-1.5 flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: mc.glow, border: `1px solid ${mc.hex}40` }}
            >
              📊
            </span>
            Kiểm Tra Tiến Bộ Hàng Tháng
          </h2>
          <p className="text-muted text-lg">Đo kết quả thực tế — không phỏng đoán, không so sánh người khác</p>
        </div>

        {/* Month tab selector */}
        <div className="flex gap-2 mb-6">
          {TEST_DATA.map((td, idx) => {
            const tc = C[td.color] || C.green;
            const active = activeMonth === idx;
            return (
              <button
                key={td.week}
                onClick={() => setActiveMonth(idx)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-xl text-lg font-bold
                  border transition-all duration-200 cursor-pointer
                  ${active
                    ? `${tc.bg} ${tc.border} ${tc.text}`
                    : 'bg-white/4 border-white/8 text-muted hover:border-white/16 hover:text-text'
                  }
                `}
                style={active ? { boxShadow: `0 0 20px ${tc.glow}` } : {}}
              >
                <span>{td.icon}</span>
                <span>{td.label}</span>
              </button>
            );
          })}
        </div>

        {/* Month title card */}
        <div
          className={`mb-5 rounded-xl border ${mc.border} ${mc.bg} px-4 py-3`}
          style={{ boxShadow: `0 2px 20px ${mc.glow}` }}
        >
          <p className={`font-black text-lg ${mc.text}`}>{monthData.title}</p>
          <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{monthData.desc}</p>
        </div>

        {/* 2×2 test grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {monthData.tests.map((test) => (
            <TestCard
              key={`${activeMonth}_${test.id}`}
              test={test}
              inputKey={keyFor(activeMonth, test.id)}
              value={getVal(test.id)}
              onChange={(val) => handleChange(test.id, val)}
              submitted={isMonthSubmitted}
              tabColor={monthData.color}
              onOpenDetail={() => setDetailTest(test)}
            />
          ))}
        </div>

        {/* Submit button */}
        {!isMonthSubmitted && hasAllInput && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSubmitAll}
              className={`
                px-6 py-2.5 rounded-xl font-bold text-lg cursor-pointer
                border transition-all duration-200 animate-fade-in-up
                ${mc.bg} ${mc.border} ${mc.text} hover:opacity-80
              `}
              style={{ boxShadow: `0 4px 24px ${mc.glow}` }}
            >
              Xem kết quả đánh giá
            </button>
          </div>
        )}

        {/* Results panel: radar + grade */}
        {hasAnyInput && (
          <div className="rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-5 animate-fade-in-up"
            style={{ boxShadow: `0 8px 40px ${mc.glow}` }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Radar chart */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Radar tiến bộ</p>
                <RadarChart
                  tests={monthData.tests}
                  values={currentValues}
                  color={monthData.color}
                />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                  {monthData.tests.map(t => (
                    <div key={t.id} className="flex items-center gap-1">
                      <span className="text-[10px]">{t.icon}</span>
                      <span className="text-[9px] text-muted truncate">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade + coach note */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${C[grade.color]?.border || 'border-green-500/30'} ${C[grade.color]?.bg || 'bg-green-500/10'}`}
                    style={{ boxShadow: `0 4px 24px ${C[grade.color]?.glow || 'rgba(34,197,94,0.2)'}` }}
                  >
                    <span className={`text-3xl font-black leading-none ${C[grade.color]?.text || 'text-green-400'}`}>
                      {grade.grade}
                    </span>
                    <span className="text-[9px] text-muted mt-0.5">{total}/{maxPossible}</span>
                  </div>
                  <div>
                    <p className={`font-black text-lg ${C[grade.color]?.text || 'text-green-400'}`}>
                      {grade.label}
                    </p>
                    <p className="text-[10px] text-muted">{monthData.title} · {monthData.label}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {monthData.tests.map(t => {
                    const s = scoreTest(t, getVal(t.id));
                    const lv = s !== null ? t.levels[Math.min(s, t.levels.length - 1)] : null;
                    const tc = lv ? (C[lv.color] || C.green) : null;
                    return (
                      <div key={t.id} className="flex items-center gap-2">
                        <span className="text-lg w-5 text-center">{t.icon}</span>
                        <span className="text-[11px] text-text/70 flex-1 truncate">{t.name}</span>
                        {s !== null && lv && tc ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tc.border} ${tc.bg} ${tc.text}`}>
                            {lv.label}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted/40">Chưa nhập</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className={`rounded-xl border ${C[grade.color]?.border || 'border-green-500/30'} ${C[grade.color]?.bg || 'bg-green-500/10'} p-3`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C[grade.color]?.hex || '#22c55e' }}>
                    Nhận xét huấn luyện viên
                  </p>
                  <p className="text-base text-text/80 leading-relaxed">{grade.note}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Detail modal — outside section to avoid transform containment */}
      {detailTest && (
        <TestDetailModal test={detailTest} onClose={() => setDetailTest(null)} />
      )}
    </>
  );
}
