import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ── Scroll reveal ────────────────────────────────────────────────────────────
function RevealBlock({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.06 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ── FAQ data ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',  label: 'Tất Cả',   icon: '✦', color: '#94a3b8', rgb: '148,163,184', img: '' },
  { id: 'gen',  label: 'Tổng Quan', icon: '🌐', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
    desc: 'Website, nội dung, cách sử dụng' },
  { id: 'move', label: 'Vận Động',  icon: '🏃', color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70',
    desc: 'Bài tập, tần suất, chuyển động' },
  { id: 'food', label: 'Dinh Dưỡng', icon: '🥗', color: '#84cc16', rgb: '132,204,22',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=70',
    desc: 'Calo, thực đơn, dinh dưỡng cân bằng' },
  { id: 'life', label: 'Lối Sống',  icon: '🌿', color: '#14b8a6', rgb: '20,184,166',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=70',
    desc: 'Giấc ngủ, thói quen, phục hồi' },
  { id: 'mind', label: 'Tâm Trí',   icon: '🧘', color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70',
    desc: 'Thiền định, hơi thở, cảm xúc' },
  { id: 'prog', label: 'Hành Trình', icon: '📈', color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=70',
    desc: 'Lộ trình 7 ngày, 12 tuần, 24 tuần' },
  { id: 'calc', label: 'Công Thức', icon: '🧮', color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=70',
    desc: 'TDEE, BMI, Protein, Nước, Nhịp Tim' },
];

const FAQS = [
  { cat:'gen', color:'#22c55e', rgb:'34,197,94', featured:true,
    q:'Website Sức Khỏe & Đời Sống dành cho ai?',
    a:'Website dành cho bất kỳ ai muốn cải thiện sức khỏe — từ người hoàn toàn mới bắt đầu đến người đã có nền tảng nhưng muốn hệ thống hóa lại. Không cần kinh nghiệm, không cần thiết bị đặc biệt, không cần chế độ ăn kiêng khắt khe. Chỉ cần 20 phút mỗi ngày và sự kiên trì.' },
  { cat:'gen', color:'#22c55e', rgb:'34,197,94',
    q:'Nội dung trên website có hoàn toàn miễn phí không?',
    a:'Có — 100% miễn phí. Toàn bộ 6 trụ cột, lộ trình 7 ngày / 12 tuần / 24 tuần, video hướng dẫn, checklist, công cụ theo dõi và tài nguyên đều không tính phí. Mục tiêu của chúng tôi là phổ cập kiến thức sức khỏe khoa học đến mọi người mà không có rào cản tài chính.' },
  { cat:'gen', color:'#22c55e', rgb:'34,197,94', featured:true,
    q:'Tôi nên bắt đầu từ đâu nếu là người hoàn toàn mới?',
    a:'Bắt đầu bằng trang "Lộ Trình" → chọn "7 Ngày Khởi Động". Bảy ngày đầu được thiết kế để bạn làm quen dần với cả 4 trụ cột cốt lõi (vận động · dinh dưỡng · lối sống · tâm trí) mà không bị choáng ngợp. Mỗi ngày chỉ cần 20–30 phút.' },
  { cat:'gen', color:'#22c55e', rgb:'34,197,94',
    q:'Nội dung có dựa trên bằng chứng khoa học không?',
    a:'Có. Tất cả nội dung được xây dựng dựa trên các nghiên cứu y học hiện đại và hướng dẫn từ các tổ chức uy tín (WHO, ACSM, AHA). Tuy nhiên, website này mang tính giáo dục — không thay thế cho tư vấn y tế cá nhân. Nếu có vấn đề sức khỏe cụ thể, hãy tham khảo bác sĩ.' },
  { cat:'gen', color:'#22c55e', rgb:'34,197,94',
    q:'6 trụ cột sức khỏe 360° bao gồm những gì?',
    a:'6 trụ cột tạo thành hệ thống sức khỏe toàn diện: (A) Vận Động & Tập Luyện — cơ thể mạnh khỏe; (B) Dinh Dưỡng & Thực Đơn — nhiên liệu đúng; (C) Lối Sống Khỏe — ngủ, bước chân, phục hồi; (D) Tâm Trí An Nhiên — cân bằng cảm xúc; (E) Kiến Thức Sức Khỏe — hiểu cơ thể; (F) Công Cụ & Tài Nguyên — theo dõi và duy trì.' },
  { cat:'move', color:'#22c55e', rgb:'34,197,94',
    q:'Tôi nên tập luyện bao nhiêu lần mỗi tuần?',
    a:'Với người mới, 3 buổi/tuần (cách ngày) là lý tưởng. Cấu trúc khuyến nghị: 3 buổi sức mạnh · 2 buổi cardio nhẹ · 2 ngày phục hồi tích cực. Quan trọng hơn số buổi là tính nhất quán — 3 buổi đều đặn trong 12 tuần tốt hơn 5 buổi/tuần trong 2 tuần rồi bỏ cuộc.' },
  { cat:'move', color:'#22c55e', rgb:'34,197,94', featured:true,
    q:'6 chuyển động cơ bản là gì và tại sao quan trọng?',
    a:'6 pattern vận động nền tảng: Squat (gập gối), Hinge (gập hông), Push (đẩy), Pull (kéo), Core (lõi) và Thở. Đây là 6 nhóm cơ vận động mà cơ thể người thực hiện hàng ngày. Thành thạo 6 động tác này với form đúng trước khi tăng tải là nguyên tắc số 1 để tránh chấn thương và tạo nền tảng bền vững.' },
  { cat:'move', color:'#22c55e', rgb:'34,197,94',
    q:'Không có dụng cụ tập luyện, có áp dụng được không?',
    a:'Hoàn toàn được. Toàn bộ chương trình giai đoạn 1 (7 ngày + 4 tuần đầu) sử dụng 100% bodyweight — không cần thiết bị. Từ tuần 5 trở đi bạn có thể dùng tạ đơn hoặc dây kháng lực nếu muốn tăng thách thức, nhưng không bắt buộc.' },
  { cat:'move', color:'#22c55e', rgb:'34,197,94',
    q:'Tôi đau lưng mãn tính, có thể tập luyện theo hướng dẫn không?',
    a:'Phụ thuộc vào nguyên nhân và mức độ. Chương trình có phần "Phục Hồi Tích Cực" và "Giãn Cơ" phù hợp với người đau lưng nhẹ. Tuy nhiên, nếu đau lưng do bệnh lý đốt sống hoặc đang điều trị, hãy tham khảo bác sĩ hoặc vật lý trị liệu trước. Quy tắc vàng: đau cấp tính = nghỉ ngơi; đau mãn tính nhẹ = vận động nhẹ có kiểm soát.' },
  { cat:'food', color:'#84cc16', rgb:'132,204,22',
    q:'Tôi có bắt buộc phải đếm calo không?',
    a:'Không bắt buộc, đặc biệt trong giai đoạn đầu. Mô hình "Đĩa Ăn" (½ rau · ¼ đạm · ¼ tinh bột) và quy tắc "1 lòng bàn tay đạm mỗi bữa" giúp bạn ăn đúng mà không cần đếm số. Tính calo chỉ hữu ích ở giai đoạn nâng cao khi bạn muốn tối ưu hóa chính xác hơn.' },
  { cat:'food', color:'#84cc16', rgb:'132,204,22', featured:true,
    q:'TDEE là gì và tôi có cần tính không?',
    a:'TDEE (Total Daily Energy Expenditure) là tổng lượng calo cơ thể đốt mỗi ngày. Biết TDEE giúp bạn ăn đúng lượng cho mục tiêu: giảm cân (TDEE − 400 kcal), duy trì (= TDEE), tăng cơ (TDEE + 300 kcal). Công thức tính TDEE có trong Bộ Công Cụ B0 của trang Dinh Dưỡng.' },
  { cat:'food', color:'#84cc16', rgb:'132,204,22',
    q:'Tôi ăn ngoài nhiều vì công việc, có áp dụng được không?',
    a:'Có. Công thức ăn ngoài thông minh: "1 protein + 2 rau + tinh bột vừa phải". Tại nhà hàng: gọi thêm rau hoặc salad, chọn protein nướng/hấp thay vì chiên, kiểm soát phần tinh bột. Không cần từ chối bữa xã giao — chỉ cần chiến lược đơn giản.' },
  { cat:'food', color:'#84cc16', rgb:'132,204,22',
    q:'Tôi có cần dùng thực phẩm bổ sung (supplement) không?',
    a:'Không cần trong giai đoạn đầu. Thực phẩm nguyên bản luôn là nền tảng — supplement chỉ có tác dụng khi nền dinh dưỡng đã vững. Nếu được cân nhắc: Vitamin D3 (nếu ít ra nắng), Omega-3 (nếu ít ăn cá), Protein Whey (nếu khó đủ đạm từ thực phẩm). Tham khảo bác sĩ trước khi dùng bất kỳ supplement nào.' },
  { cat:'food', color:'#84cc16', rgb:'132,204,22',
    q:'Tôi cần uống bao nhiêu nước mỗi ngày?',
    a:'Công thức đơn giản: cân nặng (kg) × 35ml. Ví dụ: 60kg → 2,1 lít/ngày. Dấu hiệu đủ nước: nước tiểu vàng nhạt như chanh. Tăng thêm 500ml khi tập luyện. Uống đều trong ngày và bắt đầu ngày với 1 ly nước lớn ngay khi thức dậy.' },
  { cat:'life', color:'#14b8a6', rgb:'20,184,166',
    q:'Tôi cần ngủ bao nhiêu tiếng là đủ?',
    a:'7–9 tiếng là khuyến nghị cho người trưởng thành (WHO). Quan trọng hơn số giờ là chất lượng giấc ngủ và tính đều đặn — ngủ và dậy cùng giờ mỗi ngày (kể cả cuối tuần) quan trọng hơn là ngủ nhiều vào cuối tuần bù lại.' },
  { cat:'life', color:'#14b8a6', rgb:'20,184,166',
    q:'NEAT là gì và tại sao lại quan trọng hơn tôi nghĩ?',
    a:'NEAT (Non-Exercise Activity Thermogenesis) là năng lượng đốt từ mọi hoạt động ngoài tập luyện — đi bộ, đứng, leo cầu thang, làm việc nhà. NEAT có thể chiếm 15–50% tổng calo đốt hàng ngày. Mục tiêu: 8.000–10.000 bước/ngày.' },
  { cat:'life', color:'#14b8a6', rgb:'20,184,166',
    q:'Morning routine tối thiểu cần những gì?',
    a:'Morning routine 10 phút đủ để tạo khác biệt: (1) Uống 1 ly nước lớn; (2) Ra tiếp xúc ánh sáng mặt trời 5 phút; (3) Viết 1 mục tiêu cho ngày hôm đó. Không cần dậy sớm 5h sáng — chỉ cần làm đều đặn.' },
  { cat:'life', color:'#14b8a6', rgb:'20,184,166',
    q:'Làm sao cải thiện chất lượng giấc ngủ một cách nhanh nhất?',
    a:'Ba can thiệp hiệu quả nhất: (1) Không dùng màn hình 30 phút trước ngủ; (2) Giữ phòng ngủ 18–22°C và tối hoàn toàn; (3) Không uống caffeine sau 14h. Áp dụng đúng 3 điều này trong 7 ngày — bạn sẽ nhận thấy sự khác biệt rõ rệt.' },
  { cat:'mind', color:'#a855f7', rgb:'168,85,247',
    q:'Tôi chưa bao giờ thiền, bắt đầu như thế nào?',
    a:'Thiền đơn giản nhất: ngồi thoải mái, nhắm mắt, chú ý đến hơi thở trong 5 phút. Khi tâm trí lang thang, nhẹ nhàng đưa sự chú ý về hơi thở — không phán xét. Bắt đầu 5 phút mỗi sáng, tăng dần lên 10–15 phút sau 2 tuần.' },
  { cat:'mind', color:'#a855f7', rgb:'168,85,247',
    q:'Box Breathing là gì và khi nào nên dùng?',
    a:'Box Breathing: Hít vào 4 giây → Giữ 4 giây → Thở ra 4 giây → Giữ 4 giây → lặp lại. Kỹ thuật này kích hoạt hệ thần kinh phó giao cảm, giảm cortisol và nhịp tim trong 2–3 phút. Dùng khi: căng thẳng trước cuộc họp, khó ngủ, hoặc trước buổi tập.' },
  { cat:'mind', color:'#a855f7', rgb:'168,85,247',
    q:'Tôi không có thời gian thiền, có cách nào không?',
    a:'"Micro-meditation" hiệu quả trong cuộc sống bận rộn: (1) 3 hơi thở sâu có ý thức mỗi buổi sáng (30 giây); (2) Chú tâm hoàn toàn vào bữa ăn — không điện thoại; (3) Đi bộ có ý thức 5 phút giữa ngày. Những khoảnh khắc nhỏ này cộng dồn tạo nền tảng tâm lý vững chắc.' },
  { cat:'mind', color:'#a855f7', rgb:'168,85,247',
    q:'Nhật ký sức khỏe (health journal) nên viết những gì?',
    a:'Công thức nhật ký 3 dòng tối (3–5 phút): (1) "Hôm nay tôi làm tốt..." — ghi nhận 1 điều tích cực; (2) "Tôi học được..." — 1 bài học hoặc quan sát; (3) "Ngày mai tôi sẽ..." — 1 hành động cụ thể. Sau 4 tuần, nhìn lại bạn sẽ thấy pattern của bản thân rõ ràng hơn.' },
  { cat:'prog', color:'#3b82f6', rgb:'59,130,246',
    q:'Sự khác nhau giữa 7 ngày, 12 tuần và 24 tuần là gì?',
    a:'7 Ngày Khởi Động: Làm quen 4 trụ cột, hình thành thói quen nền. 12 Tuần Cơ Bản: 3 giai đoạn xây dựng nền tảng → tăng tải → cá nhân hóa. 24 Tuần Nâng Cao: Mở rộng sang cả 6 trụ cột đầy đủ, bao gồm kiến thức y tế và carb cycling.' },
  { cat:'prog', color:'#3b82f6', rgb:'59,130,246', featured:true,
    q:'Mỗi ngày tôi cần dành bao nhiêu thời gian?',
    a:'Cấu trúc Daily Core 20–40 phút: 5 phút khởi động · 10–20 phút tập chính · 5–10 phút giãn cơ · 5 phút mind reset. Ngoài ra: morning routine 10 phút + nhật ký tối 5 phút. Tổng: 35–55 phút/ngày. Không có ngày nào yêu cầu hơn 1 tiếng.' },
  { cat:'prog', color:'#3b82f6', rgb:'59,130,246',
    q:'Tôi có thể bỏ qua 7 ngày và bắt đầu 12 tuần luôn không?',
    a:'Được, nhưng không khuyến nghị. 7 ngày đầu giúp bạn hiểu cơ thể phản ứng thế nào với sự thay đổi, xác định điểm yếu và tạo đà tâm lý. Người bỏ qua 7 ngày thường bỏ cuộc sớm hơn. Nếu đã có nền tảng tốt (tập đều 6+ tháng), bạn có thể bắt đầu từ giai đoạn 2 của 12 tuần.' },
  { cat:'prog', color:'#3b82f6', rgb:'59,130,246',
    q:'Tôi lỡ 1–2 ngày trong lộ trình thì phải làm gì?',
    a:'Không sao cả. Nguyên tắc: "Không bao giờ bỏ 2 lần liên tiếp". Bỏ 1 ngày → tiếp tục từ ngày tiếp theo, không cần làm bù. Bỏ 1 tuần → quay lại từ đầu tuần đó. 80% nhất quán trong 12 tuần > 100% trong 3 tuần rồi bỏ.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22', featured:true,
    q:'Công thức tính BMR (Chuyển hóa cơ bản) là gì?',
    a:'BMR tính theo công thức Mifflin-St Jeor: Nam = (10 × cân nặng kg) + (6.25 × chiều cao cm) − (5 × tuổi) + 5. Nữ = (10 × cân nặng kg) + (6.25 × chiều cao cm) − (5 × tuổi) − 161. Ví dụ: Nam 30 tuổi, 70kg, 170cm → BMR = 700 + 1062.5 − 150 + 5 = 1617.5 kcal/ngày. Đây là năng lượng tối thiểu cơ thể cần khi nghỉ ngơi hoàn toàn.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22', featured:true,
    q:'TDEE được tính như thế nào? Hệ số hoạt động là bao nhiêu?',
    a:'TDEE = BMR × Hệ số hoạt động. Các mức: Ít vận động (văn phòng, không tập) × 1.2; Nhẹ (tập 1–3 buổi/tuần) × 1.375; Trung bình (tập 3–5 buổi/tuần) × 1.55; Năng động (tập 6–7 buổi/tuần) × 1.725; Rất năng động (tập 2 lần/ngày) × 1.9. Ví dụ: BMR 1617 kcal × 1.55 (trung bình) = 2506 kcal TDEE.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Tôi nên ăn bao nhiêu calo tùy theo mục tiêu?',
    a:'Điều chỉnh từ TDEE theo mục tiêu: Giảm cân = TDEE − 400 kcal (thâm hụt vừa phải, không cực đoan); Duy trì = TDEE; Tăng cơ = TDEE + 300 kcal (dư thặng nhỏ). Không nên ăn dưới BMR. Ví dụ với TDEE 2500: giảm cân ăn 2100 kcal, tăng cơ ăn 2800 kcal.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Tỷ lệ Macro (đạm, béo, tinh bột) tính thế nào?',
    a:'Bước 1 — Tính đạm: cân nặng × 1.6–2.0g (giảm cân hoặc tăng cơ dùng 2.0g; duy trì dùng 1.6g). Bước 2 — Tính béo: 25% tổng calo ÷ 9 (vì 1g béo = 9 kcal). Bước 3 — Tinh bột lấp đầy phần còn lại: (Tổng kcal − Đạm×4 − Béo×9) ÷ 4. Ví dụ 70kg, 2100 kcal giảm cân: Đạm 140g (560 kcal) · Béo 58g (525 kcal) · Tinh bột 254g (1016 kcal).' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Mật độ calo của từng nhóm chất dinh dưỡng là bao nhiêu?',
    a:'Đây là hằng số cần nhớ: Protein (đạm) = 4 kcal/g; Carbohydrate (tinh bột) = 4 kcal/g; Fat (béo) = 9 kcal/g; Alcohol = 7 kcal/g (gần bằng béo, thường bị bỏ quên). Ứng dụng: 100g ức gà (30g protein) ≈ 120 kcal; 100g cơm trắng (28g carb) ≈ 130 kcal; 1 thìa dầu ăn (14g béo) ≈ 126 kcal.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Tôi cần uống bao nhiêu nước? Công thức tính nhu cầu nước là gì?',
    a:'Công thức cơ bản: cân nặng (kg) × 35ml = lượng nước tối thiểu mỗi ngày. Ví dụ: 60kg × 35 = 2.100ml (2,1 lít); 75kg × 35 = 2.625ml (2,6 lít). Cộng thêm: +500ml mỗi buổi tập; +300ml khi thời tiết nóng. Dấu hiệu đủ nước: nước tiểu vàng nhạt. Dấu hiệu thiếu nước: nước tiểu vàng đậm, khô miệng, mệt mỏi.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Chỉ số BMI tính như thế nào và ý nghĩa từng mức?',
    a:'BMI = cân nặng (kg) ÷ [chiều cao (m)]². Ví dụ: 68kg, 1.70m → BMI = 68 ÷ (1.70)² = 23.5. Phân loại (WHO): Dưới 18.5 = Thiếu cân; 18.5–24.9 = Bình thường; 25.0–29.9 = Thừa cân; 30.0+ = Béo phì. Lưu ý: BMI không phân biệt cơ và mỡ — người có nhiều cơ bắp có thể bị xếp "thừa cân" dù sức khỏe tốt. Kết hợp với vòng eo (<90cm nam, <80cm nữ) để đánh giá chính xác hơn.' },
  { cat:'calc', color:'#f97316', rgb:'249,115,22',
    q:'Công thức tính nhịp tim tập luyện và các vùng nhịp tim là gì?',
    a:'Nhịp tim tối đa (HRmax) = 220 − tuổi. Ví dụ 30 tuổi: HRmax = 190 nhịp/phút. Các vùng nhịp tim: 50–60% HRmax = Khởi động nhẹ (ít lợi ích aerobic); 60–70% HRmax = Vùng đốt mỡ tối ưu (fat-burning zone); 70–85% HRmax = Vùng cardio — tăng tim phổi; 85–95% HRmax = Vùng nâng cao — chỉ cho người đã có nền tảng. Khuyến nghị cho người mới: duy trì 60–75% HRmax trong 20–30 phút.' },
];

// ── AccordionItem ────────────────────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle, idx }) {
  const contentRef = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    setH(isOpen && contentRef.current ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className="group/acc border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        borderColor: isOpen ? `rgba(${item.rgb},0.4)` : 'rgba(255,255,255,0.07)',
        background: isOpen ? `rgba(${item.rgb},0.04)` : 'rgba(255,255,255,0.018)',
        boxShadow: isOpen ? `0 0 30px rgba(${item.rgb},0.08)` : 'none',
      }}
      onClick={onToggle}
    >
      {/* Color bar */}
      <div className="h-[2px] transition-all duration-500"
        style={{ background: isOpen ? `linear-gradient(90deg, rgba(${item.rgb},0.9), rgba(${item.rgb},0.2))` : 'transparent' }} />

      {/* Question row */}
      <div className="px-5 py-4 flex items-start gap-4">
        <span className="shrink-0 w-8 h-8 rounded-xl text-base font-black flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{
            background: isOpen ? `rgba(${item.rgb},0.2)` : 'rgba(255,255,255,0.05)',
            color: isOpen ? item.color : '#475569',
            border: `1px solid ${isOpen ? `rgba(${item.rgb},0.35)` : 'rgba(255,255,255,0.08)'}`,
          }}>
          {String(idx + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 font-semibold text-lg md:text-lg leading-snug pt-1 transition-colors duration-200"
          style={{ color: isOpen ? '#f1f5f9' : '#94a3b8' }}>
          {item.q}
        </span>
        <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 transition-all duration-300"
          style={{
            background: isOpen ? `rgba(${item.rgb},0.18)` : 'rgba(255,255,255,0.05)',
            transform: isOpen ? 'rotate(45deg)' : 'none',
          }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"
            style={{ color: isOpen ? item.color : '#475569' }}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </div>

      {/* Answer */}
      <div style={{ height: h, overflow: 'hidden', transition: 'height 0.4s ease, opacity 0.3s ease', opacity: isOpen ? 1 : 0 }}>
        <div ref={contentRef} className="px-5 pb-5 pl-[68px]">
          <p className="text-muted/80 text-lg leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function FAQ() {
  const { t } = useTranslation();

  const CATEGORIESi18n = useMemo(() => {
    const catTexts = t('faq_page.cats', { returnObjects: true });
    const faqUI = t('faq_page.ui', { returnObjects: true });
    return CATEGORIES.map(c =>
      c.id === 'all'
        ? { ...c, label: faqUI?.all_btn || c.label }
        : { ...c, label: catTexts[c.id]?.label || c.label, desc: catTexts[c.id]?.desc || c.desc }
    );
  }, [t]);

  const FAQSi18n = useMemo(() => {
    const faqTexts = t('faq_page.faqs', { returnObjects: true });
    return FAQS.map((f, i) => ({
      ...f,
      q: Array.isArray(faqTexts) && faqTexts[i]?.q ? faqTexts[i].q : f.q,
      a: Array.isArray(faqTexts) && faqTexts[i]?.a ? faqTexts[i].a : f.a,
    }));
  }, [t]);

  const [openIdx, setOpenIdx] = useState(null);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.4 });
  const headerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const r = headerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  useEffect(() => {
    const id = 'faq2-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes faq2Reveal {
        from { opacity:0; transform:translateY(32px) scale(0.94); filter:blur(8px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes faq2Sub {
        from { opacity:0; transform:translateY(18px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes faq2Line {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes faq2DotPulse {
        0%,100% { transform:scale(1);   opacity:0.55; }
        50%     { transform:scale(1.6); opacity:1; }
      }
      @keyframes faq2GlowDrift {
        0%,100% { opacity:0.35; transform:scale(1) translate(0,0); }
        50%     { opacity:0.65; transform:scale(1.2) translate(15px,-10px); }
      }
      @keyframes faq2Float {
        0%,100% { transform:translateY(0)    rotate(0deg); }
        40%     { transform:translateY(-10px) rotate(4deg); }
        70%     { transform:translateY(6px)   rotate(-3deg); }
      }
      @keyframes faq2CatReveal {
        from { opacity:0; transform:translateY(20px) scale(0.92); }
        to   { opacity:1; transform:translateY(0)    scale(1); }
      }
      @keyframes faq2Shimmer {
        0%   { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
      .faq2-title  { animation: faq2Reveal 0.75s cubic-bezier(0.25,0.46,0.45,0.94) both 0.05s; }
      .faq2-sub    { animation: faq2Sub    0.65s ease both 0.3s; }
      .faq2-search { animation: faq2Sub    0.65s ease both 0.48s; }
      .faq2-line   { transform-origin:center; animation: faq2Line 1s ease both 0.32s; }
      .faq2-dot    { animation: faq2DotPulse 2.5s ease-in-out infinite; }
      .faq2-dot:nth-child(2){ animation-delay:0.5s; }
      .faq2-dot:nth-child(3){ animation-delay:1s; }
      .faq2-glow-a { animation: faq2GlowDrift 8s ease-in-out infinite; }
      .faq2-glow-b { animation: faq2GlowDrift 11s ease-in-out infinite reverse; animation-delay:-4.5s; }
      .faq2-float  { animation: faq2Float 5.5s ease-in-out infinite; }
      .faq2-float:nth-child(2){ animation-delay:-2s; animation-duration:7s; }
      .faq2-float:nth-child(3){ animation-delay:-4s; animation-duration:6.2s; }
      .faq2-float:nth-child(4){ animation-delay:-1s; animation-duration:8s; }
      .faq2-float:nth-child(5){ animation-delay:-3s; animation-duration:5.8s; }
      .faq2-float:nth-child(6){ animation-delay:-5s; animation-duration:7.5s; }
      .faq2-word { display:inline-block; transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1), text-shadow 0.28s ease; cursor:default; user-select:none; }
      .faq2-word:hover { transform:translateY(-5px) scale(1.05); }
      .faq2-cat-card { transition:transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; cursor:pointer; }
      .faq2-cat-card:hover { transform:translateY(-4px); }
      .faq2-cat-img { transition:transform 0.5s ease; }
      .faq2-cat-card:hover .faq2-cat-img { transform:scale(1.08); }
      .faq2-shimmer-line {
        background: linear-gradient(90deg, #22c55e 0%, #5eead4 25%, #ffffff 50%, #a855f7 75%, #22c55e 100%);
        background-size: 300% auto;
        animation: faq2Line 1s ease both 0.32s, faq2Shimmer 4s linear 1.4s infinite;
      }
      .faq2-feat-card { transition:transform 0.25s ease, box-shadow 0.25s ease; cursor:pointer; }
      .faq2-feat-card:hover { transform:translateY(-3px); }
    `;
    document.head.appendChild(s);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQSi18n.filter(f => {
      const catOk = activeCat === 'all' || f.cat === activeCat;
      const srchOk = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return catOk && srchOk;
    });
  }, [activeCat, search, FAQSi18n]);

  const featured = useMemo(() => FAQSi18n.filter(f => f.featured).slice(0, 3), [FAQSi18n]);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div ref={headerRef} onMouseMove={handleMouseMove}
        className="relative -mx-4 md:-mx-8 mb-12 overflow-hidden rounded-b-3xl text-center"
        style={{ minHeight: 340 }}>
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=65"
          alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.07 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg pointer-events-none" />

        {/* Mouse-tracking glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 600px 380px at ${mouse.x*100}% ${mouse.y*100}%, rgba(34,197,94,0.1), transparent 70%)`,
        }} />

        {/* Ambient blobs */}
        <div className="faq2-glow-a absolute top-1/4 left-1/5  w-96 h-72 bg-green-500/6   rounded-full blur-[100px] pointer-events-none" />
        <div className="faq2-glow-b absolute top-0   right-1/5 w-72 h-56 bg-purple-500/5  rounded-full blur-[80px]  pointer-events-none" />

        {/* Floating emoji icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <span className="faq2-float absolute top-10  left-[8%]  text-4xl opacity-8">🏃</span>
          <span className="faq2-float absolute top-14  right-[9%] text-3xl opacity-8">🥗</span>
          <span className="faq2-float absolute top-[45%] left-[5%]  text-3xl opacity-7">🧘</span>
          <span className="faq2-float absolute top-[40%] right-[6%] text-4xl opacity-7">💡</span>
          <span className="faq2-float absolute bottom-14 left-[14%] text-2xl opacity-6">🌿</span>
          <span className="faq2-float absolute bottom-12 right-[13%] text-2xl opacity-6">📊</span>
        </div>

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.35),rgba(168,85,247,0.25),transparent)' }} />

        <div className="relative z-10 px-4 md:px-8 pt-16 pb-14 flex flex-col items-center">
          {/* Pulsing trio */}
          <div className="inline-flex items-center gap-2.5 mb-8">
            <span className="faq2-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,0.9)' }} />
            <span className="faq2-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 7px rgba(94,234,212,0.8)' }} />
            <span className="faq2-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 6px rgba(168,85,247,0.7)' }} />
            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-muted/45 mx-2">{t('faq_page.ui.badge')}</span>
            <span className="faq2-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 6px rgba(168,85,247,0.7)' }} />
            <span className="faq2-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 7px rgba(94,234,212,0.8)' }} />
            <span className="faq2-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,0.9)' }} />
          </div>

          {/* Title */}
          <h1 className="faq2-title font-black leading-tight tracking-tight mb-5 flex items-baseline justify-center flex-wrap gap-x-[0.2em]"
            style={{ fontSize: 'clamp(2.8rem,6vw,4.4rem)' }}>
            <span className="faq2-word text-text">FAQ</span>
            <span className="faq2-word" style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #86efac 30%, #5eead4 60%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('faq_page.ui.title2')}</span>
          </h1>

          {/* Shimmer underline */}
          <div className="faq2-shimmer-line mx-auto mb-6 h-[2.5px] w-28 rounded-full" />

          {/* Subtitle */}
          <p className="faq2-sub text-muted/70 text-lg md:text-lg leading-relaxed max-w-sm mx-auto mb-2">
            {t('faq_page.ui.subtitle')}
          </p>
          <p className="faq2-sub text-muted/40 text-base mx-auto mb-9">
            {FAQSi18n.length} {t('faq_page.ui.count_suffix')}
          </p>

          {/* Search */}
          <div className="faq2-search relative max-w-sm w-full mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted/40">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input type="text" value={search}
              onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
              placeholder={t('faq_page.ui.search_placeholder')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-lg bg-white/5 border border-white/12 text-text placeholder-muted/40 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all duration-250"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category cards ───────────────────────────────────────── */}
      <RevealBlock className="mb-12">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIESi18n.filter(c => c.id !== 'all').map((cat, ci) => {
            const active = activeCat === cat.id;
            const count  = FAQSi18n.filter(f => f.cat === cat.id).length;
            return (
              <div key={cat.id}
                className="faq2-cat-card relative rounded-2xl overflow-hidden border"
                style={{
                  borderColor: active ? `rgba(${cat.rgb},0.55)` : 'rgba(255,255,255,0.07)',
                  boxShadow: active ? `0 0 24px rgba(${cat.rgb},0.2)` : 'none',
                  animationDelay: `${ci * 80}ms`,
                }}
                onClick={() => { setActiveCat(active ? 'all' : cat.id); setOpenIdx(null); }}
              >
                {/* Image */}
                {cat.img && (
                  <div className="relative h-16 overflow-hidden">
                    <img src={cat.img} alt={cat.label} className="faq2-cat-img w-full h-full object-cover" style={{ opacity: 0.45 }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.85))` }} />
                  </div>
                )}
                {/* Label */}
                <div className="p-3 pt-2">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-[10px] font-bold leading-tight" style={{ color: active ? cat.color : '#64748b' }}>
                    {cat.label}
                  </div>
                  <div className="text-[9px] text-muted/40 mt-0.5">{count} {t('faq_page.ui.cat_count')}</div>
                </div>
                {/* Active glow */}
                {active && (
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ background: `rgba(${cat.rgb},0.08)` }} />
                )}
              </div>
            );
          })}
        </div>
        {/* All / Reset pill */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => { setActiveCat('all'); setOpenIdx(null); }}
            className="px-5 py-1.5 rounded-full text-base font-medium border transition-all duration-200"
            style={{
              background: activeCat === 'all' ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
              borderColor: activeCat === 'all' ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)',
              color: activeCat === 'all' ? '#22c55e' : '#64748b',
            }}>
            ✦ {t('faq_page.ui.all_btn')} ({FAQSi18n.length})
          </button>
        </div>
      </RevealBlock>

      {/* ── Featured Q&As ───────────────────────────────────────── */}
      {!search && activeCat === 'all' && (
        <RevealBlock className="mb-12">
          <h2 className="text-base font-extrabold uppercase tracking-[0.2em] text-muted/50 mb-4 text-center">
            ★ {t('faq_page.ui.featured_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featured.map((item, i) => {
              const cat = CATEGORIESi18n.find(c => c.id === item.cat);
              return (
                <div key={i}
                  className="faq2-feat-card relative rounded-2xl overflow-hidden border p-5"
                  style={{ borderColor: `rgba(${item.rgb},0.22)`, background: `rgba(${item.rgb},0.05)`, boxShadow: `0 0 20px rgba(${item.rgb},0.06)` }}
                  onClick={() => {
                    setActiveCat(item.cat);
                    setSearch('');
                    setOpenIdx(null);
                    setTimeout(() => {
                      const idx = FAQSi18n.filter(f => f.cat === item.cat).findIndex(f => f.q === item.q);
                      setOpenIdx(idx);
                    }, 100);
                  }}
                >
                  {/* Top bar */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, rgba(${item.rgb},0.8), rgba(${item.rgb},0.2))` }} />
                  <div className="text-2xl mb-3">{cat?.icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: item.color }}>{cat?.label}</div>
                  <p className="text-lg font-semibold text-text/90 leading-snug mb-2">{item.q}</p>
                  <p className="text-base text-muted/60 leading-relaxed line-clamp-2">{item.a}</p>
                  <div className="mt-3 text-[10px] font-bold" style={{ color: item.color }}>{t('faq_page.ui.read_more')}</div>
                </div>
              );
            })}
          </div>
        </RevealBlock>
      )}

      {/* ── Active category header ───────────────────────────────── */}
      {activeCat !== 'all' && (() => {
        const cat = CATEGORIESi18n.find(c => c.id === activeCat);
        return (
          <RevealBlock className="mb-6">
            <div className="relative rounded-2xl overflow-hidden border h-32 flex items-end p-5"
              style={{ borderColor: `rgba(${cat.rgb},0.3)` }}>
              <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.15 }} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(${cat.rgb},0.1), rgba(10,10,10,0.8))` }} />
              <div className="relative z-10">
                <div className="text-3xl mb-1">{cat.icon}</div>
                <h2 className="text-xl font-black text-text">{cat.label}</h2>
                <p className="text-base text-muted/60">{cat.desc} · {FAQSi18n.filter(f => f.cat === activeCat).length} {t('faq_page.ui.cat_count')}</p>
              </div>
            </div>
          </RevealBlock>
        );
      })()}

      {/* ── FAQ Accordion ────────────────────────────────────────── */}
      <RevealBlock>
        <div className="space-y-2.5 mb-14">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted/50 text-lg">
              <div className="text-5xl mb-4">🔍</div>
              {t('faq_page.ui.no_results')}
            </div>
          ) : (
            filtered.map((item, i) => (
              <AccordionItem key={`${activeCat}-${i}`} item={item} idx={i} isOpen={openIdx === i} onToggle={() => toggle(i)} />
            ))
          )}
        </div>
      </RevealBlock>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <RevealBlock className="mb-14">
        <div className="grid grid-cols-3 gap-4">
          {[
            { target: FAQSi18n.length, suffix: '+', label: t('faq_page.ui.stat1_label'), sub: t('faq_page.ui.stat1_sub'), color: '#22c55e', rgb: '34,197,94' },
            { target: 6,  suffix: '',   label: t('faq_page.ui.stat2_label'), sub: t('faq_page.ui.stat2_sub'), color: '#5eead4', rgb: '94,234,212' },
            { target: 100, suffix: '%', label: t('faq_page.ui.stat3_label'), sub: t('faq_page.ui.stat3_sub'), color: '#a855f7', rgb: '168,85,247' },
          ].map(s => (
            <div key={s.label} className="text-center rounded-2xl py-6 border relative overflow-hidden"
              style={{ background: `rgba(${s.rgb},0.05)`, borderColor: `rgba(${s.rgb},0.18)` }}>
              <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center top, rgba(${s.rgb},0.3), transparent 70%)` }} />
              <div className="text-4xl font-black mb-0.5 relative" style={{
                background: `linear-gradient(135deg, ${s.color}, rgba(${s.rgb},0.55))`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                <AnimatedCounter target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-lg font-bold text-text/90 relative">{s.label}</div>
              <div className="text-[10px] text-muted/50 mt-0.5 relative">{s.sub}</div>
            </div>
          ))}
        </div>
      </RevealBlock>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <RevealBlock delay={100}>
        <div className="relative rounded-3xl overflow-hidden border border-border/30">
          {/* BG image */}
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=65"
            alt="" className="absolute inset-0 w-full h-full object-cover object-center" style={{ opacity: 0.06 }} />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-purple-500/8 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.4),rgba(168,85,247,0.3),transparent)' }} />

          <div className="relative p-8 md:p-10 text-center">
            <div className="text-4xl mb-4 select-none">💬</div>
            <h2 className="text-2xl font-black text-text mb-3">{t('faq_page.ui.cta_title')}</h2>
            <p className="text-muted/65 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
              {t('faq_page.ui.cta_desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-bold border transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
                ✉ {t('faq_page.ui.cta_contact')}
              </Link>
              <Link to="/program"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-bold border transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                📈 {t('faq_page.ui.cta_program')}
              </Link>
              <Link to="/pillars"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-bold border transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7' }}>
                ⬡ {t('faq_page.ui.cta_pillars')}
              </Link>
            </div>
          </div>
        </div>
      </RevealBlock>

    </div>
  );
}
