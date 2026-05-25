import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThoughtBubble from '../components/ThoughtBubble';

// ─── CSS Injection ───────────────────────────────────────────────────────────
function useOrbitStyles() {
  useEffect(() => {
    if (document.getElementById('n24-orbit-kf')) return;
    const s = document.createElement('style');
    s.id = 'n24-orbit-kf';
    s.textContent = `
      @property --n24-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes n24OrbitSpin { to { --n24-orbit-angle: 360deg; } }
      .n24-orbit-ring {
        background: conic-gradient(
          from var(--n24-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(245,158,11,0.0) 65deg, rgba(245,158,11,0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(245,158,11,0.75) 99deg,
          rgba(245,158,11,0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: n24OrbitSpin 3.5s linear infinite;
      }
      @keyframes n24Float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes n24FadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes n24PulseGold { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0)} 50%{box-shadow:0 0 20px 4px rgba(245,158,11,0.3)} }
      .n24-float { animation: n24Float 3.2s ease-in-out infinite; }
      .n24-fade-up { animation: n24FadeUp 0.6s ease-out both; }
      .n24-pulse-gold { animation: n24PulseGold 2s ease-in-out infinite; }
    `;
    document.head.appendChild(s);
  }, []);
}

// ─── RevealBlock ─────────────────────────────────────────────────────────────
function RevealBlock({ children, className = '' }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

// ─── B0 localStorage ─────────────────────────────────────────────────────────
function computeB0() {
  try {
    const raw = localStorage.getItem('healthapp_b0_inputs');
    if (!raw) throw new Error();
    const b = JSON.parse(raw);
    const w = parseFloat(b.w) || 70;
    const h = parseFloat(b.h) || 170;
    const age = parseInt(b.age) || 30;
    const sx = b.sx || 'male';
    const goal = b.goal || 'maintain';
    const aMap = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, veryActive:1.9 };
    const aFactor = aMap[b.a] || 1.55;
    const bmr = sx === 'female'
      ? 10*w + 6.25*h - 5*age - 161
      : 10*w + 6.25*h - 5*age + 5;
    const tdee = Math.round(bmr * aFactor);
    const kcalMap = { lose: tdee-400, maintain: tdee, gain: tdee+200, recomp: tdee-200, endurance: tdee+100, busy: tdee-300 };
    const kcal = kcalMap[goal] || tdee;
    const protein = Math.round(w * 1.9);
    return { w, h, age, sx, goal, tdee, kcal, protein, bmr: Math.round(bmr) };
  } catch {
    const w=70, h=170, age=30, tdee=2100;
    return { w, h, age, sx:'male', goal:'maintain', tdee, kcal:tdee, protein:133, bmr:1659 };
  }
}

const GOAL_LABELS = {
  lose: 'Giảm Mỡ', maintain: 'Duy Trì', gain: 'Tăng Cơ',
  recomp: 'Recomp', endurance: 'Sức Bền', busy: 'Bận Rộn',
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PHASES = [
  { id:1, weeks:'1–4', label:'Nền Tảng Ăn Khỏe', emoji:'🌱', color:'#22c55e', rgb:'34,197,94',
    goal:'Ăn đúng nhịp, đủ nước, đủ đạm, biết đĩa ăn',
    desc:'Thoát khỏi kiểu ăn thất thường: sáng bỏ bữa, trưa ăn vội, chiều thèm ngọt, tối ăn quá nhiều.',
    scoreTarget:'60–70 điểm/ngày', weekNums:[1,2,3,4] },
  { id:2, weeks:'5–8', label:'Kiểm Soát Năng Lượng', emoji:'🔢', color:'#14b8a6', rgb:'20,184,166',
    goal:'Hiểu TDEE, calo, macro, khẩu phần',
    desc:'Biết mình đang ăn bao nhiêu. Từ TDEE chia ra 3 trạng thái: giảm mỡ, duy trì, tăng cơ.',
    scoreTarget:'70–80 điểm/ngày', weekNums:[5,6,7,8] },
  { id:3, weeks:'9–12', label:'Cá Nhân Hóa Mục Tiêu', emoji:'🎯', color:'#84cc16', rgb:'132,204,22',
    goal:'Giảm mỡ / tăng cơ / duy trì / sức bền',
    desc:'Review 3 tháng đầu và chọn hướng đi phù hợp mục tiêu cá nhân.',
    scoreTarget:'75–80 điểm/ngày', weekNums:[9,10,11,12] },
  { id:4, weeks:'13–16', label:'Meal Prep & Đời Sống Thật', emoji:'🥡', color:'#f97316', rgb:'249,115,22',
    goal:'Ăn ngoài, đi làm, đi tiệc, bữa lỡ tay',
    desc:'Biến kiến thức thành thói quen thực tế trong bối cảnh bận rộn, ăn ngoài, đi tiệc.',
    scoreTarget:'80+ điểm/ngày', weekNums:[13,14,15,16] },
  { id:5, weeks:'17–20', label:'Tối Ưu Hiệu Suất & Phục Hồi', emoji:'⚡', color:'#a855f7', rgb:'168,85,247',
    goal:'Carb quanh tập, điện giải, giấc ngủ, phục hồi',
    desc:'Nâng cấp dinh dưỡng cho tập luyện. Carb thông minh, điện giải, fat tốt, ngủ tốt.',
    scoreTarget:'80–85 điểm/ngày', weekNums:[17,18,19,20] },
  { id:6, weeks:'21–24', label:'Tự Vận Hành Dài Hạn', emoji:'🎓', color:'#f59e0b', rgb:'245,158,11',
    goal:'Tự thiết kế thực đơn, review, duy trì 3–6 tháng',
    desc:'Graduation. Tự thiết kế menu, điều chỉnh plateau, duy trì khi đi tiệc/du lịch, chọn chiến lược 6 tháng tiếp.',
    scoreTarget:'85+ điểm/ngày', weekNums:[21,22,23,24] },
];

const WEEKS = [
  { n:1, phase:1, emoji:'🍽️', color:'#22c55e', rgb:'34,197,94',
    title:'Làm Quen Đĩa Ăn Dự Án',
    tagline:'"Không cần tính calo. Học nguyên tắc đĩa ½–¼–¼."',
    goal:'Mỗi bữa chính có ít nhất 1 nguồn đạm. Uống nước đều trong ngày.',
    plate:[
      {part:'½ đĩa', label:'Rau, canh, củ quả ít năng lượng', color:'#22c55e'},
      {part:'¼ đĩa', label:'Đạm — thịt, cá, trứng, đậu, tôm, gà', color:'#14b8a6'},
      {part:'¼ đĩa', label:'Tinh bột — cơm, khoai, bún, yến mạch', color:'#f59e0b'},
      {part:'Nhỏ', label:'Chất béo tốt — dầu ô-liu, quả bơ, hạt', color:'#ec4899'},
    ],
    tasks:['Chụp lại 1 bữa ăn chính','Kiểm tra bữa đó có đủ 3 nhóm: rau – đạm – tinh bột không','Uống 1 ly nước sau khi thức dậy','Không cần cắt cơm, chỉ cần giảm đồ uống ngọt'],
    kpi:['Ăn sáng ít nhất 5/7 ngày','Ít nhất 2 bữa/ngày có đạm','Rau trong ít nhất 1–2 bữa/ngày','Uống nước đều hơn'] },
  { n:2, phase:1, emoji:'💪', color:'#22c55e', rgb:'34,197,94',
    title:'Protein Là Nền Móng',
    tagline:'"Đủ đạm giúp no lâu, giữ cơ, giảm thèm ăn."',
    goal:'Mỗi bữa chính có protein. Giảm cảm giác đói vặt nhờ đủ đạm.',
    proteins:[
      {group:'Động vật', items:'trứng, cá, gà, bò nạc, heo nạc, tôm'},
      {group:'Sữa', items:'sữa tươi không đường, sữa chua Hy Lạp, phô mai tươi'},
      {group:'Thực vật', items:'đậu hũ, đậu nành, đậu lăng, đậu xanh'},
      {group:'Nhanh gọn', items:'whey, trứng luộc, cá hộp, ức gà xé'},
    ],
    tasks:['Bữa sáng có đạm','Bữa trưa có đạm','Bữa tối có đạm','Nếu thèm ngọt buổi chiều: sữa chua/trái cây/trứng luộc thay vì bánh ngọt'],
    kpi:['Đạt protein ít nhất 5/7 ngày','Giảm ăn vặt vô thức','Ít đói sau bữa chính hơn'] },
  { n:3, phase:1, emoji:'🥦', color:'#22c55e', rgb:'34,197,94',
    title:'Rau, Chất Xơ & No Lâu',
    tagline:'"Chất xơ: no lâu, ổn định đường huyết, hỗ trợ tiêu hóa."',
    goal:'Mỗi ngày có ít nhất 2 khẩu phần rau. Tập ăn chậm hơn.',
    rules:['Mỗi bữa trưa/tối: 1–2 nắm rau','Có canh là lợi thế','Ăn rau trước hoặc ăn cùng protein để giảm ăn quá nhanh','Trái cây dùng làm snack, không thay hoàn toàn rau'],
    tasks:['Thêm rau vào bữa trưa','Thêm rau/canh vào bữa tối','Ăn chậm ít nhất 1 bữa/ngày: đặt đũa xuống giữa các lần gắp','Theo dõi tiêu hóa'],
    kpi:['Có rau 2 bữa/ngày ít nhất 4/7 ngày','Đi tiêu đều hơn','Ít thèm ăn sau bữa tối'] },
  { n:4, phase:1, emoji:'💧', color:'#22c55e', rgb:'34,197,94',
    title:'Nước, Đồ Uống & Ăn Đúng Giờ',
    tagline:'"Nhiều người tăng cân không phải vì bữa chính, mà vì trà sữa, nước ngọt, cà phê sữa."',
    goal:'Uống nước đều. Giảm đồ uống ngọt. Cố định khung giờ ăn chính. Tổng kết tháng đầu.',
    tasks:['Mang theo chai nước','Uống nước trước khi uống cà phê','Đổi nước ngọt sang nước lọc/trà không đường','Không bỏ bữa quá lâu để tránh ăn bù buổi tối'],
    review:[
      {signal:'Vẫn đói nhiều', fix:'Tăng rau và protein'},
      {signal:'Đầy bụng', fix:'Tăng chất xơ từ từ'},
      {signal:'Cân tăng nhanh', fix:'Kiểm tra đồ uống/snack'},
      {signal:'Mệt khi tập', fix:'Kiểm tra tinh bột trước/sau tập'},
    ],
    kpi:['Đánh giá 4 chỉ số: cân nặng, vòng eo, năng lượng, mức độ dễ duy trì'] },
  { n:5, phase:2, emoji:'🔢', color:'#14b8a6', rgb:'20,184,166',
    title:'Hiểu TDEE & Mục Tiêu Calo',
    tagline:'"Không còn tư duy ăn càng ít càng tốt."',
    goal:'Hiểu TDEE là gì. Biết 3 trạng thái: giảm mỡ, duy trì, tăng cơ.',
    formula:[
      {goal:'Giảm mỡ', rule:'Ăn thấp hơn TDEE vừa phải (−300 đến −500 kcal)'},
      {goal:'Duy trì', rule:'Ăn gần TDEE'},
      {goal:'Tăng cơ', rule:'Ăn cao hơn TDEE nhẹ (+150 đến +300 kcal)'},
      {goal:'Sức bền/tập nhiều', rule:'Carb và tổng năng lượng thay đổi theo ngày tập'},
    ],
    tasks:['Ước tính TDEE cá nhân','Chọn mục tiêu chính trong 4 tuần tới: giảm mỡ, tăng cơ, duy trì, tăng sức bền','Ghi nhật ký ăn 3 ngày, chưa cần chỉnh quá nhiều'],
    kpi:['Biết TDEE cá nhân ước lượng','Hiểu 3 trạng thái năng lượng'] },
  { n:6, phase:2, emoji:'⚖️', color:'#14b8a6', rgb:'20,184,166',
    title:'Macro Căn Bản: Protein – Carb – Fat',
    tagline:'"Protein phục hồi, Carb nhiên liệu, Fat hormone & vitamin."',
    goal:'Hiểu vai trò từng macro. Ưu tiên protein trước. Không sợ carb. Không lạm dụng chất béo.',
    macros:[
      {macro:'Protein', role:'Phục hồi, giữ cơ, no lâu', when:'Mỗi bữa chính'},
      {macro:'Carb', role:'Năng lượng cho não, vận động, tập luyện', when:'Nhiều hơn quanh thời điểm tập'},
      {macro:'Fat', role:'Hormone, hấp thu vitamin, cảm giác ngon miệng', when:'Vừa phải, tránh quá tay'},
    ],
    tasks:['Mỗi bữa tự đánh dấu: P = protein, C = carb, F = fat, V = rau','Mục tiêu: 2–3 bữa/ngày đủ P + V'],
    kpi:['Hiểu rõ vai trò 3 macro','Không loại bỏ hoàn toàn bất kỳ nhóm thực phẩm nào'] },
  { n:7, phase:2, emoji:'✋', color:'#14b8a6', rgb:'20,184,166',
    title:'Khẩu Phần Bằng Bàn Tay',
    tagline:'"Ước lượng không cần cân — dùng được khi ăn ngoài."',
    goal:'Giảm phụ thuộc vào app tính calo. Dùng được trong mọi hoàn cảnh.',
    handParts:[
      {part:'Protein', measure:'1–2 lòng bàn tay/bữa'},
      {part:'Rau', measure:'1–2 nắm tay/bữa'},
      {part:'Tinh bột', measure:'1 nắm tay hoặc 1 cúp tay/bữa'},
      {part:'Chất béo', measure:'1 ngón cái/bữa'},
      {part:'Trái cây', measure:'1 nắm tay/lần'},
    ],
    adjust:[
      {goal:'Giảm mỡ', rule:'Giữ protein, tăng rau, giảm tinh bột/chất béo nhẹ'},
      {goal:'Tăng cơ', rule:'Giữ protein, tăng tinh bột quanh tập, thêm 1 snack giàu năng lượng'},
      {goal:'Sức bền', rule:'Carb cao hơn vào ngày chạy/đạp/bơi dài'},
    ],
    tasks:['Thực hành đo khẩu phần bằng tay tại mỗi bữa','Điều chỉnh theo mục tiêu hiện tại'],
    kpi:['Ước lượng được mà không cần cân','Biết chỉnh theo mục tiêu'] },
  { n:8, phase:2, emoji:'📊', color:'#14b8a6', rgb:'20,184,166',
    title:'Review Năng Lượng & Điều Chỉnh Lần 1',
    tagline:'"Biết đọc phản hồi cơ thể. Điều chỉnh không cực đoan."',
    goal:'Chốt "khẩu phần chuẩn cá nhân". Tạo thực đơn mẫu 3 ngày.',
    bodyFeedback:[
      {signal:'Cân giảm quá nhanh, mệt', meaning:'Có thể thiếu năng lượng'},
      {signal:'Cân không đổi, vòng eo giảm', meaning:'Đang cải thiện thành phần cơ thể'},
      {signal:'Cân tăng, vòng eo tăng', meaning:'Có thể dư calo'},
      {signal:'Tập yếu, ngủ kém', meaning:'Kiểm tra carb, nước, tổng kcal'},
      {signal:'Đói liên tục', meaning:'Tăng protein, rau, nước, ngủ'},
    ],
    tasks:['Chọn 3 bữa ăn chuẩn của bản thân','Tạo danh sách 10 món ăn phù hợp','Chuẩn bị thực đơn mẫu 3 ngày'],
    kpi:['Có thực đơn mẫu 3 ngày cá nhân','Biết điều chỉnh theo phản hồi cơ thể'] },
  { n:9, phase:3, emoji:'🔥', color:'#84cc16', rgb:'132,204,22',
    title:'Nhánh Giảm Mỡ',
    tagline:'"Thâm hụt vừa phải. Không bỏ protein. Không cắt carb cực đoan."',
    goal:'Dành cho người muốn giảm mỡ, giảm vòng eo, cải thiện sức khỏe chuyển hóa.',
    rules:['Thâm hụt vừa phải','Không bỏ protein','Không cắt carb cực đoan nếu vẫn tập','Tăng rau và NEAT','Theo dõi vòng eo thay vì chỉ nhìn cân'],
    meals:[
      {meal:'Sáng', food:'protein + carb chậm + trái cây nhỏ'},
      {meal:'Trưa', food:'½ rau, ¼ đạm, ¼ tinh bột'},
      {meal:'Tối', food:'đạm + nhiều rau, tinh bột vừa hoặc giảm nhẹ nếu ngày ít vận động'},
      {meal:'Snack', food:'sữa chua không đường, trái cây, trứng, hạt lượng nhỏ'},
    ],
    tasks:['Giảm 1 nguồn calo lỏng','Ăn rau trước trong 1 bữa/ngày','Đi bộ 10 phút sau 1 bữa chính'],
    kpi:['Vòng eo hoặc cân bắt đầu có xu hướng tốt','Vẫn đủ năng lượng tập'] },
  { n:10, phase:3, emoji:'💪', color:'#84cc16', rgb:'132,204,22',
    title:'Nhánh Tăng Cơ',
    tagline:'"Ăn đủ năng lượng. Protein đều trong ngày. Carb đủ để tập khỏe."',
    goal:'Dành cho người gầy, người tập kháng lực, người muốn tăng cơ, săn chắc.',
    rules:['Ăn đủ năng lượng','Protein đều trong ngày','Carb đủ để tập khỏe','Không tăng calo quá nhanh','Theo dõi sức mạnh, số reps, số hiệp'],
    meals:[
      {meal:'Sáng', food:'trứng/sữa/yến mạch/trái cây'},
      {meal:'Trưa', food:'cơm + thịt/cá/gà/đậu + rau'},
      {meal:'Trước tập', food:'chuối/bánh mì/khoai + ít protein'},
      {meal:'Sau tập', food:'protein + carb'},
      {meal:'Tối', food:'đạm + tinh bột + rau'},
    ],
    tasks:['Thêm 1 snack giàu protein','Ăn carb trước hoặc sau tập','Theo dõi hiệu suất tập 3 buổi'],
    kpi:['Tập khỏe hơn','Sức mạnh tăng dần'] },
  { n:11, phase:3, emoji:'🏊', color:'#84cc16', rgb:'132,204,22',
    title:'Nhánh Sức Bền',
    tagline:'"Carb là nhiên liệu chính. Nước và điện giải rất quan trọng khi đổ mồ hôi nhiều."',
    goal:'Dành cho người tập cardio nhiều: chạy, đạp xe, bơi, hoặc kết hợp nhiều môn.',
    timing:[
      {time:'Trước tập 1–2 giờ', food:'carb dễ tiêu + ít protein'},
      {time:'Trong buổi tập dài >60–90 phút', food:'nước, điện giải, carb dễ hấp thu nếu cần'},
      {time:'Sau tập', food:'protein + carb, nước, bữa chính trong vài giờ sau'},
    ],
    tasks:['Tạo mẫu "trước tập – sau tập"','Theo dõi chuột rút, mệt, khát, đau đầu','Ghi nhận buổi nào thiếu năng lượng'],
    kpi:['Ít chuột rút hơn','Hồi sức nhanh hơn sau mỗi buổi'] },
  { n:12, phase:3, emoji:'🏆', color:'#84cc16', rgb:'132,204,22',
    title:'Tổng Kết 12 Tuần & Chọn Hướng Đi',
    tagline:'"Review 3 tháng đầu. Không đổi quá nhiều thứ cùng lúc."',
    goal:'Đánh giá kết quả và quyết định hướng đi tiếp theo.',
    testMetrics:['Cân nặng trung bình','Vòng eo','Ảnh trước/sau','Sức bền khi tập','Mức đói','Giấc ngủ','Tỷ lệ ngày đạt Habit Score'],
    directions:[
      {result:'Giảm mỡ tốt, hơi mệt', next:'Tăng nhẹ carb/ngày tập'},
      {result:'Giảm chậm nhưng khỏe', next:'Giữ thêm 4 tuần'},
      {result:'Không đổi gì', next:'Kiểm tra snack, đồ uống, khẩu phần'},
      {result:'Tập tốt, muốn tăng cơ', next:'Chuyển sang thặng dư nhẹ'},
      {result:'Stress cao, ngủ kém', next:'Ưu tiên duy trì, không siết'},
    ],
    tasks:['Làm đầy đủ bộ chỉ số test','Chọn 1 hướng đi duy nhất','Đặt mục tiêu cụ thể cho 12 tuần tiếp'],
    kpi:['Có bức tranh rõ ràng về kết quả','Có kế hoạch tiếp theo'] },
  { n:13, phase:4, emoji:'🥡', color:'#f97316', rgb:'249,115,22',
    title:'Meal Prep 30 Phút',
    tagline:'"Chuẩn bị đồ ăn cho 2–3 ngày. Không cần nấu cầu kỳ."',
    goal:'Giảm phụ thuộc vào đồ ăn nhanh. Công thức meal prep 3 hộp.',
    mealBoxes:[
      {protein:'Ức gà', veg:'bông cải', carb:'khoai lang'},
      {protein:'Cá hồi/cá thu', veg:'salad', carb:'cơm'},
      {protein:'Thịt bò nạc', veg:'rau cải', carb:'bún/gạo lứt'},
      {protein:'Đậu hũ', veg:'nấm/rau luộc', carb:'khoai/cơm'},
    ],
    tasks:['Meal prep 1 lần cho 2 ngày','Viết danh sách mua đồ','Chọn 3 món "cứu đói" lành mạnh'],
    kpi:['Có đồ ăn sẵn cho 2–3 ngày','Ít phụ thuộc đồ ăn nhanh'] },
  { n:14, phase:4, emoji:'🍜', color:'#f97316', rgb:'249,115,22',
    title:'Ăn Ngoài Quán Vẫn Khỏe',
    tagline:'"Không sợ ăn ngoài. Quy tắc 3 chọn: đạm → rau/canh → tinh bột vừa."',
    goal:'Biết chọn món theo đạm – rau – tinh bột vừa. Giảm calo ẩn từ nước sốt, đồ chiên.',
    eatOutRules:[
      {place:'Phở/bún', rule:'Thêm thịt, nhiều rau, hạn chế nước béo, không thêm quẩy thường xuyên'},
      {place:'Cơm văn phòng', rule:'Chọn thịt/cá/trứng/đậu, thêm rau/canh, giảm món chiên nhiều dầu'},
      {place:'Bún thịt nướng', rule:'Thêm rau, nước mắm vừa, không thêm quá nhiều đồ chiên'},
    ],
    tasks:['Ăn ngoài 2 lần nhưng vẫn ghi nhận lựa chọn','Không gọi nước ngọt đi kèm','Chụp món ăn và phân tích theo đĩa ăn'],
    kpi:['Áp dụng được quy tắc 3 chọn','Không cảm thấy "tội lỗi" sau khi ăn ngoài'] },
  { n:15, phase:4, emoji:'🔄', color:'#f97316', rgb:'249,115,22',
    title:'Xử Lý Bữa Ăn Lỡ Tay',
    tagline:'"Không bỏ cuộc sau một bữa ăn quá nhiều. Cách bạn quay lại mới quan trọng."',
    goal:'Không dùng hình phạt: nhịn ăn, tập bù cực đoan. Quay lại nhịp bình thường trong bữa kế tiếp.',
    dontDo:['Nhịn đói cả ngày hôm sau','Tập quá sức để "đốt bù"','Tự trách quá mức','Bỏ luôn cả tuần'],
    doDo:['Uống nước','Đi bộ nhẹ','Bữa sau quay lại đạm + rau + tinh bột vừa','Ngủ đủ','Xem lý do vì sao lỡ tay'],
    tasks:['Viết "kịch bản cứu nguy" cá nhân','Chuẩn bị 2 bữa đơn giản để quay lại nhịp','Ghi 1 nguyên nhân dễ làm mình ăn quá tay'],
    kpi:['Không nhịn bù sau lỡ tay','Quay lại nhịp trong vòng 1 bữa tiếp theo'] },
  { n:16, phase:4, emoji:'⚡', color:'#f97316', rgb:'249,115,22',
    title:'Ăn Trong Ngày Bận Rộn',
    tagline:'"Không để đói quá lâu. Bữa nhanh nhưng đủ chất."',
    goal:'Có chiến lược cho ngày bận. Biết dùng bữa nhanh nhưng đủ chất.',
    quickMeals:[
      {type:'Sáng 5 phút', options:['Sữa chua Hy Lạp + yến mạch + trái cây','Trứng luộc + bánh mì + trái cây','Whey + chuối + yến mạch']},
      {type:'Trưa nhanh', options:['Cơm + gà/cá/trứng + rau','Bún/phở thêm thịt + rau','Salad có đạm + khoai/bánh mì']},
      {type:'Snack', options:['Trái cây + sữa chua','Trứng luộc','Sữa không đường','Hạt lượng nhỏ']},
    ],
    tasks:['Chuẩn bị 3 món ăn nhanh','Đặt sẵn đồ ăn dự phòng ở nơi làm việc','Không để quá 5–6 giờ không ăn nếu dễ ăn bù buổi tối'],
    kpi:['Có bộ bữa nhanh đủ chất cho ngày bận','Ít bỏ bữa hơn'] },
  { n:17, phase:5, emoji:'🍞', color:'#a855f7', rgb:'168,85,247',
    title:'Carb Thông Minh',
    tagline:'"Không xem carb là kẻ thù. Dùng carb để tập tốt hơn."',
    goal:'Biết tăng/giảm carb theo vận động.',
    carbRules:[
      {day:'Ngày tập nặng', rule:'Carb cao hơn, ưu tiên trước/sau tập'},
      {day:'Ngày nghỉ', rule:'Carb vừa phải, tăng rau và protein'},
      {day:'Ngày cardio dài', rule:'Thêm carb trước/trong/sau buổi tập'},
    ],
    tasks:['Ghi lại bữa trước tập','Đánh giá buổi tập: khỏe/yếu/đuối','Điều chỉnh carb quanh tập'],
    kpi:['Tập khỏe hơn trong ngày có carb đúng','Ít hụt năng lượng giữa buổi tập'] },
  { n:18, phase:5, emoji:'💧', color:'#a855f7', rgb:'168,85,247',
    title:'Nước, Điện Giải & Phục Hồi',
    tagline:'"Biết khi nào cần điện giải. Tránh mệt do thiếu nước."',
    goal:'Theo dõi màu nước tiểu, khát, chuột rút.',
    waterRules:[
      {situation:'Ngày thường', rule:'Uống nước chia đều'},
      {situation:'Ngày nóng/tập nhiều', rule:'Thêm canh, muối vừa phải, điện giải nếu cần'},
    ],
    warnings:['Đau đầu','Chóng mặt','Chuột rút','Nước tiểu sẫm màu','Mệt bất thường khi tập'],
    tasks:['Theo dõi nước 7 ngày','Thêm điện giải cho buổi tập dài','Không uống dồn quá nhiều nước sát giờ ngủ'],
    kpi:['Uống đủ 2–3L/ngày thường','Thêm điện giải khi tập > 60 phút'] },
  { n:19, phase:5, emoji:'🥑', color:'#a855f7', rgb:'168,85,247',
    title:'Chất Béo & Sức Khỏe Hormone',
    tagline:'"Ăn đủ fat tốt. Không lạm dụng dầu/hạt."',
    goal:'Biết nguồn chất béo tốt và chất béo nên hạn chế.',
    goodFats:['Cá béo','Trứng','Quả bơ','Dầu ô-liu','Hạt','Đậu phộng lượng vừa','Sữa/sữa chua phù hợp'],
    limitFats:['Đồ chiên ngập dầu','Bánh ngọt','Snack nhiều dầu','Thịt chế biến sẵn thường xuyên','Nước sốt béo quá nhiều'],
    tasks:['Không loại bỏ hoàn toàn chất béo','Đong dầu khi nấu','Hạn chế đồ chiên còn 1–2 lần/tuần'],
    kpi:['Có đủ fat tốt trong thực đơn','Không lạm dụng dầu/hạt'] },
  { n:20, phase:5, emoji:'😴', color:'#a855f7', rgb:'168,85,247',
    title:'Giấc Ngủ, Stress & Ăn Uống',
    tagline:'"Thiếu ngủ và stress dễ làm thèm ngọt, thèm béo, đói giả."',
    goal:'Hiểu vì sao thiếu ngủ làm khó kiểm soát ăn uống. Tạo routine tối. Giảm ăn đêm do stress.',
    sleepEffects:['Thèm ngọt','Thèm đồ béo','Đói giả','Giảm động lực tập','Tăng ăn vặt buổi tối'],
    nightRoutine:['Bữa tối đủ đạm và rau','Ngưng caffeine sớm','Tắt màn hình trước ngủ 30 phút','Viết 3 dòng xả não','Thở 4-7-8 hoặc box breathing'],
    tasks:['Theo dõi giờ ngủ','Ghi lại lúc nào thèm ăn nhất','Thử 1 routine tối trong 5 ngày'],
    kpi:['Ngủ đủ ≥7 giờ ít nhất 5/7 ngày','Giảm ăn vặt tối'] },
  { n:21, phase:6, emoji:'📋', color:'#f59e0b', rgb:'245,158,11',
    title:'Tự Thiết Kế Thực Đơn 7 Ngày',
    tagline:'"Không phụ thuộc hoàn toàn vào mẫu có sẵn. Tự xoay món để đỡ ngán."',
    goal:'Người tham gia tự lên được thực đơn 7 ngày.',
    menuSteps:['Bước 1: Chọn 7 nguồn đạm','Bước 2: Chọn 7 nguồn rau','Bước 3: Chọn 4–5 nguồn tinh bột','Bước 4: Chọn 3 món snack lành mạnh','Bước 5: Gắn vào lịch tập/nghỉ'],
    dayFrame:[
      {meal:'Sáng', food:'protein + carb vừa + trái cây/rau'},
      {meal:'Trưa', food:'đĩa ½–¼–¼'},
      {meal:'Snack', food:'protein nhẹ hoặc trái cây'},
      {meal:'Tối', food:'đạm + rau + tinh bột tùy mục tiêu'},
    ],
    tasks:['Lên menu 7 ngày','Tạo danh sách mua đồ','Chuẩn bị ít nhất 2 bữa trước'],
    kpi:['Có menu 7 ngày hoàn chỉnh','Có danh sách mua đồ cá nhân'] },
  { n:22, phase:6, emoji:'📈', color:'#f59e0b', rgb:'245,158,11',
    title:'Tự Điều Chỉnh Khi Đứng Cân',
    tagline:'"Không hoảng khi cân đứng. Dùng dữ liệu để chỉnh."',
    goal:'Biết xử lý plateau bằng dữ liệu, không cảm tính.',
    plateauCheck:['Đã theo dõi đủ 2 tuần chưa?','Vòng eo có giảm không?','Có ăn bù cuối tuần không?','Có uống đồ ngọt/rượu bia không?','Có thiếu ngủ không?','Có giảm vận động ngoài tập không?','Có táo bón/giữ nước không?'],
    plateauFix:[
      {goal:'Giảm mỡ nhưng đứng cân', fix:'Giảm nhẹ tinh bột hoặc fat, tăng bước chân, giữ protein, ngủ tốt hơn'},
      {goal:'Tăng cơ nhưng không tăng', fix:'Thêm 150–250 kcal/ngày, tăng carb quanh tập, kiểm tra tiến bộ trong gym'},
      {goal:'Quá mệt', fix:'Tăng năng lượng hoặc giảm tập, ưu tiên phục hồi'},
    ],
    tasks:['Kiểm tra 7 câu hỏi plateau','Áp dụng 1 điều chỉnh cụ thể','Chờ 2 tuần rồi đánh giá lại'],
    kpi:['Biết xử lý plateau bằng dữ liệu','Không phản ứng cực đoan'] },
  { n:23, phase:6, emoji:'🎉', color:'#f59e0b', rgb:'245,158,11',
    title:'Duy Trì Khi Du Lịch, Tiệc, Lễ',
    tagline:'"Không mất nhịp khi thay đổi môi trường. Quy tắc 80/20."',
    goal:'Biết chọn "tốt nhất có thể". Không cần hoàn hảo.',
    rule8020:[
      {type:'80% bữa ăn', items:['Đủ đạm','Đủ rau','Nước lọc','Khẩu phần vừa']},
      {type:'20% linh hoạt', items:['Món yêu thích','Tiệc','Tráng miệng','Bữa gia đình']},
    ],
    partyStrategy:[
      {time:'Trước tiệc', action:'Ăn nhẹ có protein, uống nước'},
      {time:'Trong tiệc', action:'Chọn đạm trước, ăn chậm, chọn món thật sự thích, tránh vừa ăn vừa uống nước ngọt/rượu liên tục'},
      {time:'Sau tiệc', action:'Quay lại bình thường, không nhịn cực đoan'},
    ],
    tasks:['Viết "quy tắc đi tiệc" cá nhân','Chọn 3 món linh hoạt vẫn kiểm soát được','Tập không tự trách sau một bữa lệch kế hoạch'],
    kpi:['Giữ được 80% nhịp ngay cả khi đi tiệc/du lịch'] },
  { n:24, phase:6, emoji:'🎓', color:'#f59e0b', rgb:'245,158,11',
    title:'Tổng Kết, Bảo Trì & Nâng Cấp',
    tagline:'"Graduation — chọn chiến lược 3–6 tháng tiếp theo."',
    goal:'Tổng kết 24 tuần. Xây hệ thống duy trì.',
    reviewMetrics:['Cân nặng','Vòng eo','Ảnh trước/sau','Sức bền','Sức mạnh','Giấc ngủ','Mức năng lượng','Mức stress','Khả năng tự lên thực đơn','Tỷ lệ ngày duy trì thói quen'],
    next3Paths:[
      {path:'Duy Trì Sống Khỏe', who:'Đã đạt mục tiêu cơ bản', strategy:['Không cần log calo hằng ngày','Review 1 lần/tuần','Meal prep 1–2 lần/tuần','Giữ protein và rau']},
      {path:'Giảm Mỡ Tiếp', who:'Vẫn còn mục tiêu giảm vòng eo', strategy:['Thâm hụt nhẹ','Tăng NEAT','Giữ strength training','Không siết quá 8–12 tuần liên tục nếu mệt']},
      {path:'Tăng Cơ / Hiệu Suất', who:'Đã gọn hơn, muốn khỏe và có cơ hơn', strategy:['Tăng kcal nhẹ','Protein đều','Carb quanh tập','Theo dõi sức mạnh','Ngủ và phục hồi tốt']},
    ],
    tasks:['Làm bộ chỉ số đánh giá đầy đủ','Chọn 1 trong 3 hướng duy trì','Lập kế hoạch 3–6 tháng tiếp theo'],
    kpi:['Tự xây được thực đơn 7–14 ngày','Có kế hoạch 3–6 tháng tiếp'] },
];

const HABIT_SCORE_CRITERIA = [
  {id:'protein', label:'Ăn đủ protein', desc:'Protein trong mỗi bữa chính', pts:25, icon:'🥩'},
  {id:'veggie', label:'Ăn đủ rau/chất xơ', desc:'Rau ≥2 bữa/ngày', pts:20, icon:'🥦'},
  {id:'water', label:'Uống đủ nước', desc:'Đủ 1.8–2.5L/ngày', pts:15, icon:'💧'},
  {id:'noSugarDrink', label:'Không uống đồ ngọt', desc:'Tránh trà sữa, nước ngọt thường xuyên', pts:10, icon:'🚫'},
  {id:'mealTiming', label:'Ăn đúng 3 bữa chính', desc:'Không bỏ bữa quá lâu', pts:10, icon:'⏰'},
  {id:'eatSlow', label:'Ăn chậm/không ăn quá no', desc:'≥15 phút/bữa, đặt đũa xuống', pts:10, icon:'🍽️'},
  {id:'log', label:'Ghi log/ngày', desc:'Theo dõi protein, nước, rau, cân', pts:10, icon:'📝'},
];

const SUMMARY_TABLE = [
  {n:1,phase:1,topic:'Đĩa ăn dự án',action:'½ rau–¼ đạm–¼ tinh bột'},
  {n:2,phase:1,topic:'Protein',action:'Mỗi bữa chính có đạm'},
  {n:3,phase:1,topic:'Rau & chất xơ',action:'2 khẩu phần rau/ngày'},
  {n:4,phase:1,topic:'Nước & đồ uống',action:'Giảm nước ngọt, uống nước đều'},
  {n:5,phase:2,topic:'TDEE',action:'Ước tính năng lượng cá nhân'},
  {n:6,phase:2,topic:'Macro',action:'Hiểu protein–carb–fat'},
  {n:7,phase:2,topic:'Khẩu phần bàn tay',action:'Ước lượng không cần cân'},
  {n:8,phase:2,topic:'Review lần 1',action:'Chỉnh khẩu phần theo dữ liệu'},
  {n:9,phase:3,topic:'Giảm mỡ',action:'Thâm hụt nhẹ, giữ protein'},
  {n:10,phase:3,topic:'Tăng cơ',action:'Ăn đủ, thêm carb quanh tập'},
  {n:11,phase:3,topic:'Sức bền',action:'Carb, nước, điện giải'},
  {n:12,phase:3,topic:'Tổng kết 12 tuần',action:'Chọn mục tiêu tiếp theo'},
  {n:13,phase:4,topic:'Meal prep',action:'Chuẩn bị 2–3 ngày'},
  {n:14,phase:4,topic:'Ăn ngoài',action:'Quy tắc 3 chọn'},
  {n:15,phase:4,topic:'Bữa lỡ tay',action:'Quay lại nhịp, không tự phạt'},
  {n:16,phase:4,topic:'Ngày bận',action:'Bữa nhanh đủ chất'},
  {n:17,phase:5,topic:'Carb thông minh',action:'Carb theo ngày tập/nghỉ'},
  {n:18,phase:5,topic:'Nước & điện giải',action:'Tối ưu buổi tập dài'},
  {n:19,phase:5,topic:'Chất béo tốt',action:'Đủ fat, không quá tay'},
  {n:20,phase:5,topic:'Ngủ & stress',action:'Giảm ăn do stress'},
  {n:21,phase:6,topic:'Thực đơn 7 ngày',action:'Tự lên menu'},
  {n:22,phase:6,topic:'Đứng cân',action:'Điều chỉnh bằng dữ liệu'},
  {n:23,phase:6,topic:'Du lịch/tiệc',action:'Quy tắc 80/20'},
  {n:24,phase:6,topic:'Tổng kết',action:'Chọn chiến lược 3–6 tháng'},
];

// ─── Arc Gauge ────────────────────────────────────────────────────────────────
function ArcGauge({ score }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  let tier, tierColor;
  if (score >= 90)      { tier = 'Nutrition Master'; tierColor = '#f59e0b'; }
  else if (score >= 80) { tier = 'Thói Quen Vững';   tierColor = '#14b8a6'; }
  else if (score >= 70) { tier = 'Đúng Hướng';       tierColor = '#84cc16'; }
  else if (score >= 60) { tier = 'Nền Tảng Tốt';     tierColor = '#f97316'; }
  else                  { tier = 'Đang Khởi Động';   tierColor = '#ef4444'; }

  let phaseRange = '';
  if (score >= 85)      phaseRange = 'Mục tiêu Giai Đoạn 6';
  else if (score >= 80) phaseRange = 'Mục tiêu Giai Đoạn 4–5';
  else if (score >= 70) phaseRange = 'Mục tiêu Giai Đoạn 2–3';
  else if (score >= 60) phaseRange = 'Mục tiêu Giai Đoạn 1';
  else                  phaseRange = 'Dưới mức Giai Đoạn 1';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={160} height={160} style={{ overflow: 'visible' }}>
        <circle cx={80} cy={80} r={r} fill="none" stroke="#1f1f1f" strokeWidth={12} />
        <circle cx={80} cy={80} r={r} fill="none"
          stroke={tierColor} strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
        <text x={80} y={76} textAnchor="middle" fontSize={28} fontWeight="bold" fill={tierColor}>{score}</text>
        <text x={80} y={96} textAnchor="middle" fontSize={10} fill="#9ca3af">điểm</text>
      </svg>
      <div className="text-center">
        <div className="font-bold text-sm" style={{ color: tierColor }}>{tier}</div>
        <div className="text-xs text-gray-500 mt-1">{phaseRange}</div>
      </div>
    </div>
  );
}

// ─── WeekDetail ────────────────────────────────────────────────────────────────
function WeekDetail({ wk }) {
  const [checkedTasks, setCheckedTasks] = useState({});
  const phaseObj = PHASES.find(p => p.id === wk.phase);
  const toggleTask = (i) => setCheckedTasks(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="n24-fade-up rounded-2xl border p-6 mt-4"
      style={{ borderColor: `${wk.color}33`, background: `rgba(${wk.rgb},0.04)` }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-3xl">{wk.emoji}</span>
        <div>
          <h3 className="font-bold text-lg text-white">Tuần {wk.n}: {wk.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `rgba(${phaseObj.rgb},0.15)`, color: phaseObj.color }}>
            Giai Đoạn {wk.phase}: {phaseObj.label}
          </span>
        </div>
      </div>
      <p className="text-sm italic mb-3" style={{ color: wk.color }}>{wk.tagline}</p>
      <div className="text-sm text-gray-300 mb-5 p-3 rounded-xl" style={{ background: `rgba(${wk.rgb},0.07)` }}>
        <span className="font-semibold text-white">Mục tiêu tuần: </span>{wk.goal}
      </div>

      {/* Plate */}
      {wk.plate && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Đĩa Ăn Dự Án</div>
          <div className="grid grid-cols-2 gap-2">
            {wk.plate.map((p,i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${p.color}22`, color: p.color }}>{p.part}</span>
                <span className="text-xs text-gray-300">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proteins */}
      {wk.proteins && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nguồn Đạm</div>
          <div className="grid grid-cols-2 gap-2">
            {wk.proteins.map((p,i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                <div className="text-xs font-semibold" style={{ color: wk.color }}>{p.group}</div>
                <div className="text-xs text-gray-400 mt-0.5">{p.items}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules list */}
      {wk.rules && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nguyên Tắc</div>
          <ul className="space-y-1.5">
            {wk.rules.map((r,i) => (
              <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                <span style={{ color: wk.color }}>▸</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formula table */}
      {wk.formula && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Công Thức Năng Lượng</div>
          <div className="rounded-xl overflow-hidden border border-white/5">
            {wk.formula.map((f,i) => (
              <div key={i} className={`flex gap-3 px-3 py-2.5 text-sm ${i%2===0?'bg-black/20':'bg-black/10'}`}>
                <span className="font-semibold w-28 shrink-0" style={{ color: wk.color }}>{f.goal}</span>
                <span className="text-gray-300">{f.rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Macros */}
      {wk.macros && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Vai Trò Macro</div>
          <div className="space-y-2">
            {wk.macros.map((m,i) => (
              <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="font-semibold text-sm" style={{ color: wk.color }}>{m.macro}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.role}</div>
                <div className="text-xs text-gray-500 mt-0.5">Khi nào: {m.when}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hand parts */}
      {wk.handParts && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Khẩu Phần Bàn Tay</div>
          <div className="grid grid-cols-2 gap-2">
            {wk.handParts.map((hp,i) => (
              <div key={i} className="flex justify-between p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-xs font-semibold" style={{ color: wk.color }}>{hp.part}</span>
                <span className="text-xs text-gray-400">{hp.measure}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adjust */}
      {wk.adjust && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Điều Chỉnh Theo Mục Tiêu</div>
          {wk.adjust.map((a,i) => (
            <div key={i} className="flex gap-2 text-sm py-1.5 border-b border-white/5 last:border-0">
              <span className="font-semibold w-24 shrink-0" style={{ color: wk.color }}>{a.goal}</span>
              <span className="text-gray-400">{a.rule}</span>
            </div>
          ))}
        </div>
      )}

      {/* Body Feedback */}
      {wk.bodyFeedback && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tín Hiệu Cơ Thể</div>
          <div className="rounded-xl overflow-hidden border border-white/5">
            {wk.bodyFeedback.map((f,i) => (
              <div key={i} className={`flex gap-3 px-3 py-2.5 text-xs ${i%2===0?'bg-black/20':'bg-black/10'}`}>
                <span className="text-yellow-400 w-44 shrink-0">{f.signal}</span>
                <span className="text-gray-300">{f.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review table for w4 */}
      {wk.review && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tổng Kết Tháng 1</div>
          <div className="rounded-xl overflow-hidden border border-white/5">
            {wk.review.map((r,i) => (
              <div key={i} className={`flex gap-3 px-3 py-2.5 text-xs ${i%2===0?'bg-black/20':'bg-black/10'}`}>
                <span className="text-red-400 w-40 shrink-0">{r.signal}</span>
                <span className="text-green-400">{r.fix}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meals */}
      {wk.meals && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Gợi Ý Bữa Ăn</div>
          <div className="space-y-1.5">
            {wk.meals.map((m,i) => (
              <div key={i} className="flex gap-3 text-sm p-2.5 rounded-lg bg-black/20">
                <span className="font-semibold w-20 shrink-0" style={{ color: wk.color }}>{m.meal}</span>
                <span className="text-gray-300">{m.food}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timing */}
      {wk.timing && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Thời Điểm Ăn</div>
          {wk.timing.map((t,i) => (
            <div key={i} className="p-2.5 rounded-lg bg-black/20 mb-1.5">
              <div className="text-xs font-semibold" style={{ color: wk.color }}>{t.time}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t.food}</div>
            </div>
          ))}
        </div>
      )}

      {/* testMetrics */}
      {wk.testMetrics && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chỉ Số Đánh Giá</div>
          <div className="flex flex-wrap gap-2">
            {wk.testMetrics.map((m,i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-black/30 border border-white/10 text-gray-300">{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Directions */}
      {wk.directions && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hướng Đi Tiếp Theo</div>
          <div className="rounded-xl overflow-hidden border border-white/5">
            {wk.directions.map((d,i) => (
              <div key={i} className={`flex gap-3 px-3 py-2.5 text-xs ${i%2===0?'bg-black/20':'bg-black/10'}`}>
                <span className="text-yellow-400 w-44 shrink-0">{d.result}</span>
                <span className="text-green-400">→ {d.next}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MealBoxes */}
      {wk.mealBoxes && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Công Thức Hộp Cơm</div>
          <div className="grid grid-cols-2 gap-2">
            {wk.mealBoxes.map((b,i) => (
              <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                <div style={{ color: wk.color }} className="font-semibold">{b.protein}</div>
                <div className="text-green-400">+ {b.veg}</div>
                <div className="text-amber-400">+ {b.carb}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EatOutRules */}
      {wk.eatOutRules && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Quy Tắc Ăn Ngoài</div>
          {wk.eatOutRules.map((r,i) => (
            <div key={i} className="p-2.5 rounded-lg bg-black/20 mb-1.5">
              <span className="font-semibold text-xs" style={{ color: wk.color }}>{r.place}: </span>
              <span className="text-xs text-gray-300">{r.rule}</span>
            </div>
          ))}
        </div>
      )}

      {/* Do/Don't */}
      {wk.dontDo && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Không Nên</div>
            <ul className="space-y-1">
              {wk.dontDo.map((d,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-red-400">✗</span>{d}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Nên Làm</div>
            <ul className="space-y-1">
              {wk.doDo.map((d,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-green-400">✓</span>{d}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Meals */}
      {wk.quickMeals && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Bữa Ăn Nhanh</div>
          {wk.quickMeals.map((q,i) => (
            <div key={i} className="mb-2">
              <div className="text-xs font-semibold mb-1" style={{ color: wk.color }}>{q.type}</div>
              <div className="flex flex-wrap gap-1.5">
                {q.options.map((o,j) => (
                  <span key={j} className="text-xs px-2 py-1 rounded-full bg-black/30 border border-white/10 text-gray-300">{o}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carb Rules */}
      {wk.carbRules && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Carb Theo Ngày</div>
          {wk.carbRules.map((c,i) => (
            <div key={i} className="flex gap-3 text-sm py-1.5 border-b border-white/5 last:border-0">
              <span className="font-semibold w-40 shrink-0" style={{ color: wk.color }}>{c.day}</span>
              <span className="text-gray-400">{c.rule}</span>
            </div>
          ))}
        </div>
      )}

      {/* Water Rules */}
      {wk.waterRules && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Uống Nước Theo Tình Huống</div>
          {wk.waterRules.map((r,i) => (
            <div key={i} className="flex gap-3 text-sm py-1.5 border-b border-white/5 last:border-0">
              <span className="font-semibold w-40 shrink-0" style={{ color: wk.color }}>{r.situation}</span>
              <span className="text-gray-400">{r.rule}</span>
            </div>
          ))}
          {wk.warnings && (
            <div className="mt-2">
              <div className="text-xs text-red-400 font-semibold mb-1">Dấu hiệu thiếu nước:</div>
              <div className="flex flex-wrap gap-1.5">
                {wk.warnings.map((w,i) => <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-900/20 border border-red-800/30 text-red-400">{w}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Good/Limit Fats */}
      {wk.goodFats && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Fat Tốt</div>
            <ul className="space-y-1">
              {wk.goodFats.map((f,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-green-400">+</span>{f}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Hạn Chế</div>
            <ul className="space-y-1">
              {wk.limitFats.map((f,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-red-400">−</span>{f}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Sleep Effects & Night Routine */}
      {wk.sleepEffects && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">Khi Thiếu Ngủ</div>
            <ul className="space-y-1">
              {wk.sleepEffects.map((e,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-red-400">!</span>{e}</li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-green-400 mb-2">Routine Tối</div>
            <ul className="space-y-1">
              {wk.nightRoutine.map((r,i) => <li key={i} className="text-xs text-gray-400 flex gap-1.5"><span className="text-green-400">✓</span>{r}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Menu Steps */}
      {wk.menuSteps && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Các Bước Lên Thực Đơn</div>
          <ol className="space-y-1.5">
            {wk.menuSteps.map((s,i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0" style={{ background: `rgba(${wk.rgb},0.2)`, color: wk.color }}>{i+1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Day Frame */}
      {wk.dayFrame && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Khung Ngày</div>
          {wk.dayFrame.map((d,i) => (
            <div key={i} className="flex gap-3 text-sm py-1.5 border-b border-white/5 last:border-0">
              <span className="font-semibold w-16 shrink-0" style={{ color: wk.color }}>{d.meal}</span>
              <span className="text-gray-400">{d.food}</span>
            </div>
          ))}
        </div>
      )}

      {/* Plateau Check */}
      {wk.plateauCheck && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Checklist Plateau</div>
          <ul className="space-y-1.5 mb-3">
            {wk.plateauCheck.map((c,i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-2 items-center">
                <span className="w-4 h-4 rounded border border-amber-500/50 inline-block shrink-0" />
                {c}
              </li>
            ))}
          </ul>
          {wk.plateauFix && (
            <>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Cách Xử Lý</div>
              {wk.plateauFix.map((f,i) => (
                <div key={i} className="p-2.5 rounded-lg bg-black/20 mb-1.5">
                  <div className="text-xs font-semibold" style={{ color: wk.color }}>{f.goal}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{f.fix}</div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Rule 80/20 & Party Strategy */}
      {wk.rule8020 && (
        <div className="mb-5 grid grid-cols-2 gap-3">
          {wk.rule8020.map((r,i) => (
            <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="text-xs font-semibold mb-2" style={{ color: wk.color }}>{r.type}</div>
              <ul className="space-y-1">
                {r.items.map((item,j) => <li key={j} className="text-xs text-gray-400">• {item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
      {wk.partyStrategy && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chiến Thuật Đi Tiệc</div>
          {wk.partyStrategy.map((p,i) => (
            <div key={i} className="p-2.5 rounded-lg bg-black/20 mb-1.5">
              <span className="font-semibold text-xs" style={{ color: wk.color }}>{p.time}: </span>
              <span className="text-xs text-gray-300">{p.action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Review Metrics */}
      {wk.reviewMetrics && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chỉ Số Tổng Kết</div>
          <div className="flex flex-wrap gap-2">
            {wk.reviewMetrics.map((m,i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full border font-medium" style={{ borderColor:`${wk.color}44`, color: wk.color, background:`rgba(${wk.rgb},0.08)` }}>{m}</span>
            ))}
          </div>
        </div>
      )}

      {/* Next 3 Paths */}
      {wk.next3Paths && (
        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">3 Hướng Tiếp Theo</div>
          <div className="space-y-3">
            {wk.next3Paths.map((p,i) => (
              <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="font-semibold text-sm" style={{ color: wk.color }}>{p.path}</div>
                <div className="text-xs text-gray-500 mb-2">{p.who}</div>
                <ul className="space-y-1">
                  {p.strategy.map((s,j) => <li key={j} className="text-xs text-gray-400 flex gap-1.5"><span style={{ color: wk.color }}>▸</span>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks */}
      <div className="mb-4">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nhiệm Vụ Tuần Này</div>
        <ul className="space-y-2">
          {wk.tasks.map((t, i) => (
            <li key={i}
              className="flex items-start gap-2.5 cursor-pointer group"
              onClick={() => toggleTask(i)}>
              <span className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-all ${checkedTasks[i] ? 'border-amber-500 bg-amber-500' : 'border-gray-600 group-hover:border-amber-400'}`}>
                {checkedTasks[i] && <span className="text-black text-xs font-bold">✓</span>}
              </span>
              <span className={`text-sm transition-colors ${checkedTasks[i] ? 'line-through text-gray-600' : 'text-gray-300 group-hover:text-white'}`}>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* KPI */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">KPI Tuần</div>
        <ul className="space-y-1.5">
          {wk.kpi.map((k, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-2 items-start">
              <span className="mt-0.5 shrink-0" style={{ color: wk.color }}>◆</span>{k}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NutritionTwentyFourWeekPage() {
  useOrbitStyles();

  const b0 = computeB0();
  const [activePhase, setActivePhase] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);
  const [habitChecked, setHabitChecked] = useState({});
  const [openPath, setOpenPath] = useState(null);
  const [openPrinciple, setOpenPrinciple] = useState(null);
  const weekDetailRef = useRef(null);

  const habitScore = HABIT_SCORE_CRITERIA.reduce((sum, c) => sum + (habitChecked[c.id] ? c.pts : 0), 0);

  const toggleHabit = (id) => setHabitChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const handleWeekClick = (n) => {
    setActiveWeek(prev => prev === n ? null : n);
    setTimeout(() => weekDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const heroStats = [
    { n: 24, suffix: '', label: 'Tuần', tip: '24 tuần = 6 tháng hoàn chỉnh' },
    { n: 6,  suffix: '', label: 'Giai Đoạn', tip: '6 giai đoạn mỗi 4 tuần' },
    { n: 7,  suffix: '', label: 'Tiêu Chí', tip: '7 hành vi chấm điểm hàng ngày' },
    { n: 100,suffix: '', label: 'Điểm/Ngày', tip: 'Mục tiêu 80+ điểm/ngày' },
  ];

  const objectives = [
    { icon: '🌱', text: 'Xây nền tảng ăn đúng bữa, đủ đạm, đủ rau, đủ nước' },
    { icon: '🔢', text: 'Hiểu TDEE, calo, macro và khẩu phần cá nhân' },
    { icon: '🎯', text: 'Cá nhân hóa chế độ theo mục tiêu: giảm mỡ, tăng cơ, sức bền' },
    { icon: '🥡', text: 'Áp dụng thực tế: meal prep, ăn ngoài, ngày bận, bữa lỡ tay' },
    { icon: '⚡', text: 'Tối ưu dinh dưỡng cho tập luyện và phục hồi' },
    { icon: '😴', text: 'Quản lý ngủ, stress và ăn uống cảm xúc' },
    { icon: '📋', text: 'Tự thiết kế và điều chỉnh thực đơn không cần hướng dẫn' },
    { icon: '🎓', text: 'Xây hệ thống duy trì dài hạn 3–6 tháng không cần ý chí' },
  ];

  const principles = [
    {
      id: 1, icon: '🚫', title: 'Không bắt đầu bằng ăn kiêng khắc nghiệt',
      body: 'Ăn kiêng nghiêm ngặt ngay từ đầu dẫn đến bỏ cuộc nhanh, mất cơ, và tâm lý tiêu cực với thức ăn. Lộ trình này bắt đầu từ thói quen nhỏ: đĩa ăn đúng tỷ lệ, đủ đạm, đủ rau — không cắt bỏ hoàn toàn bất kỳ thứ gì.',
    },
    {
      id: 2, icon: '🧠', title: 'Ưu tiên hành vi trước con số',
      body: 'Hành vi nhất quán tạo ra kết quả bền vững hơn là theo dõi calo tuyệt đối. Khi hành vi đúng, con số tự đi vào vùng phù hợp. Đây là lý do Habit Score 7 tiêu chí quan trọng hơn mục tiêu calo hàng ngày.',
    },
    {
      id: 3, icon: '📶', title: 'Tăng độ khó theo 6 tầng',
      body: null, // rendered as staircase
    },
    {
      id: 4, icon: '🏋️', title: 'Luôn gắn với tập luyện và phục hồi',
      body: 'Dinh dưỡng không tách rời vận động. Carb quanh buổi tập, protein sau tập, ngủ đủ giấc để phục hồi — những yếu tố này phối hợp với nhau tạo ra kết quả thực sự. Giai đoạn 5 sẽ đi sâu vào điều này.',
    },
  ];

  const stairSteps = [
    { step: 1, text: 'Ăn đủ bữa, đủ nước' },
    { step: 2, text: 'Đĩa ăn ½–¼–¼' },
    { step: 3, text: 'Ước lượng protein, carb, fat bằng bàn tay' },
    { step: 4, text: 'Tính TDEE và macro' },
    { step: 5, text: 'Cá nhân hóa theo mục tiêu và lịch tập' },
    { step: 6, text: 'Tự điều chỉnh khi cân nặng, vòng eo, hiệu suất thay đổi' },
  ];

  const phaseColorFor = (phase) => PHASES.find(p => p.id === phase)?.color || '#f59e0b';
  const phaseRgbFor = (phase) => PHASES.find(p => p.id === phase)?.rgb || '245,158,11';

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#e5e7eb' }}>
      <div className="px-4 md:px-6 max-w-4xl mx-auto pt-28 md:pt-32 pb-24">

        {/* Breadcrumb */}
        <Link to="/pillar/b" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-400 transition-colors mb-8">
          ← Dinh Dưỡng
        </Link>

        {/* Hero Row */}
        <div className="flex items-start gap-6 mb-10 relative">
          <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,158,11,0.05)' }} />
          <div className="w-20 h-20 rounded-3xl text-5xl flex items-center justify-center shrink-0 border n24-float"
            style={{ background: '#111', borderColor: 'rgba(245,158,11,0.2)' }}>
            🗓️
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight n24-fade-up" style={{ color: '#e5e7eb' }}>
              Lộ trình Nutrition <span style={{ color: '#f59e0b' }}>24 Tuần</span>
            </h1>
            <span className="inline-block text-xs font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border"
              style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.2)' }}>
              24 Weeks · 6 Phases · Long-Term Mastery
            </span>
            <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
              Từ nhận thức → kiểm soát năng lượng → cá nhân hóa → đời sống thật → tối ưu hiệu suất → tự vận hành. Hệ thống giúp bạn xây thói quen dinh dưỡng bền vững không phụ thuộc vào ý chí.
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="n24-orbit-ring rounded-3xl p-[1.5px] mb-12">
          <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80&auto=format&fit=crop"
              alt="Nutrition 24 weeks" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ color: '#f59e0b', background: 'rgba(0,0,0,0.6)', borderColor: 'rgba(245,158,11,0.2)' }}>
              Lộ Trình 24 Tuần · 6 Giai Đoạn
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, #374151, transparent)' }} />

        {/* Section 0 — Hero Stats */}
        <RevealBlock className="mb-16">
          <div className="flex flex-wrap justify-center gap-6">
            {heroStats.map((s, i) => (
              <div key={i} className="group/stat relative flex flex-col items-center">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none
                  opacity-0 group-hover/stat:opacity-100
                  scale-90 group-hover/stat:scale-100
                  -translate-y-1 group-hover/stat:translate-y-0
                  transition-all duration-200 origin-bottom">
                  <ThoughtBubble text={s.tip} idx={`n24-stat-${i}`} color="#f59e0b" />
                </div>
                <div className="w-28 h-28 rounded-2xl border flex flex-col items-center justify-center cursor-default"
                  style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
                  <span className="text-3xl font-bold" style={{ color: '#f59e0b' }}>{s.n}{s.suffix}</span>
                  <span className="text-xs text-gray-400 mt-1 text-center px-2">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* Section 1 — Personalized Banner */}
        <RevealBlock className="mb-16">
          <div className="rounded-2xl p-6 border" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))', borderColor: 'rgba(245,158,11,0.25)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h2 className="font-bold text-base" style={{ color: '#f59e0b' }}>Thông Số Cá Nhân Của Bạn</h2>
            </div>
            <p className="text-sm text-gray-400 mb-5">Lộ trình dưới đây được cá nhân hóa cho bạn.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'TDEE Ước Tính', value: `${b0.tdee} kcal` },
                { label: 'Kcal Mục Tiêu', value: `${b0.kcal} kcal` },
                { label: 'Protein Mục Tiêu', value: `${b0.protein}g/ngày` },
                { label: 'Mục Tiêu', value: GOAL_LABELS[b0.goal] || b0.goal },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 text-center">
                  <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>{item.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">Dữ liệu từ B0 · {b0.w}kg · {b0.h}cm · {b0.age}t · {b0.sx === 'female' ? 'Nữ' : 'Nam'}</p>
          </div>
        </RevealBlock>

        {/* Section 2 — Objectives */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Bạn Sẽ Học Được Gì?</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {objectives.map((o, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                <span className="text-xl shrink-0">{o.icon}</span>
                <span className="text-sm text-gray-300">{o.text}</span>
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* Section 3 — Principles */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">4 Nguyên Tắc Cốt Lõi</h2>
          <div className="space-y-3">
            {principles.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/5 overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenPrinciple(prev => prev === p.id ? null : p.id)}>
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-semibold text-sm text-white flex-1">{p.title}</span>
                  <span className="text-gray-500 text-xs">{openPrinciple === p.id ? '▲' : '▼'}</span>
                </button>
                {openPrinciple === p.id && (
                  <div className="px-5 pb-5">
                    {p.id === 3 ? (
                      <div>
                        <p className="text-sm text-gray-400 mb-4">Mỗi giai đoạn xây trên nền của giai đoạn trước. Không nhảy cóc.</p>
                        {/* Staircase SVG */}
                        <div className="overflow-x-auto">
                          <svg viewBox="0 0 540 210" width="100%" style={{ maxWidth: 540, display: 'block' }}>
                            {stairSteps.map((s, i) => {
                              const x = i * 78;
                              const y = 180 - i * 26;
                              const w = 120;
                              const h = 26;
                              const col = ['#22c55e','#14b8a6','#84cc16','#f59e0b','#a855f7','#f59e0b'][i];
                              return (
                                <g key={i}>
                                  <rect x={x} y={y} width={w + i * 20} height={h} rx={4}
                                    fill={`rgba(${['34,197,94','20,184,166','132,204,22','245,158,11','168,85,247','245,158,11'][i]},0.15)`}
                                    stroke={col} strokeWidth={1} />
                                  <text x={x + 6} y={y + 17} fontSize={9} fill={col} fontWeight="600">
                                    {s.step}. {s.text.length > 28 ? s.text.slice(0, 27) + '…' : s.text}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">{p.body}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </RevealBlock>

        {/* Section 4 — Tracking Metrics */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Chỉ Số Theo Dõi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#f59e0b' }}>Hàng Ngày (7 chỉ số)</div>
              <div className="space-y-2.5">
                {[
                  {icon:'🍽️', label:'Số bữa chính'},
                  {icon:'🥩', label:'Protein (đạt/chưa đạt)'},
                  {icon:'🥦', label:'Rau (số khẩu phần)'},
                  {icon:'💧', label:'Nước (số lít)'},
                  {icon:'🧃', label:'Đồ ngọt (có/không)'},
                  {icon:'😐', label:'Mức đói (1–10)'},
                  {icon:'⚡', label:'Năng lượng (1–10)'},
                ].map((m,i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="text-base">{m.icon}</span>{m.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 p-5">
              <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#f59e0b' }}>Hàng Tuần (9 chỉ số)</div>
              <div className="space-y-2.5">
                {[
                  {icon:'⚖️', label:'Cân nặng TB 3 ngày'},
                  {icon:'📏', label:'Vòng eo'},
                  {icon:'🏋️', label:'Số buổi tập'},
                  {icon:'👟', label:'Số bước trung bình'},
                  {icon:'😴', label:'Số ngày ngủ đủ'},
                  {icon:'🥩', label:'Số ngày đạt protein'},
                  {icon:'🥦', label:'Số ngày ăn rau đủ'},
                  {icon:'❓', label:'Vấn đề lớn nhất'},
                  {icon:'📝', label:'Điều chỉnh tuần sau'},
                ].map((m,i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="text-base">{m.icon}</span>{m.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* Section 5 — 6 Phases */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">6 Giai Đoạn</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
            {PHASES.map((ph) => (
              <button key={ph.id}
                className="shrink-0 p-4 rounded-2xl border transition-all text-left"
                style={{
                  borderColor: activePhase === ph.id ? ph.color : 'rgba(255,255,255,0.07)',
                  background: activePhase === ph.id ? `rgba(${ph.rgb},0.12)` : 'rgba(255,255,255,0.02)',
                  minWidth: 150,
                }}
                onClick={() => setActivePhase(prev => prev === ph.id ? null : ph.id)}>
                <div className="text-2xl mb-2">{ph.emoji}</div>
                <div className="text-xs text-gray-500 mb-1">Giai Đoạn {ph.id} · Tuần {ph.weeks}</div>
                <div className="font-semibold text-sm" style={{ color: ph.color }}>{ph.label}</div>
                <div className="text-xs text-gray-600 mt-1">{ph.scoreTarget}</div>
              </button>
            ))}
          </div>

          {activePhase && (() => {
            const ph = PHASES.find(p => p.id === activePhase);
            return (
              <div className="n24-fade-up rounded-2xl p-5 border"
                style={{ borderColor: `${ph.color}33`, background: `rgba(${ph.rgb},0.05)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{ph.emoji}</span>
                  <div>
                    <div className="font-bold text-white">{ph.label}</div>
                    <div className="text-xs text-gray-500">Tuần {ph.weeks} · {ph.scoreTarget}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{ph.goal}</p>
                <p className="text-sm text-gray-500 mb-4">{ph.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {ph.weekNums.map(n => (
                    <button key={n}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all hover:scale-105"
                      style={{ borderColor: `${ph.color}44`, color: ph.color, background: `rgba(${ph.rgb},0.1)` }}
                      onClick={() => handleWeekClick(n)}>
                      Tuần {n}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </RevealBlock>

        {/* Section 6 — Week Navigator */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">24 Tuần Chi Tiết</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
            {WEEKS.map((wk) => (
              <button key={wk.n}
                className="aspect-square rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 p-1"
                style={{
                  borderColor: activeWeek === wk.n ? wk.color : `rgba(${wk.rgb},0.2)`,
                  background: activeWeek === wk.n ? `rgba(${wk.rgb},0.15)` : `rgba(${wk.rgb},0.04)`,
                  boxShadow: activeWeek === wk.n ? `0 0 12px rgba(${wk.rgb},0.25)` : 'none',
                }}
                onClick={() => handleWeekClick(wk.n)}>
                <span className="text-sm font-bold" style={{ color: wk.color }}>{wk.n}</span>
                <span className="text-[8px] text-gray-500 text-center leading-tight mt-0.5 px-0.5">
                  {wk.title.split(' ').slice(0,2).join(' ')}
                </span>
              </button>
            ))}
          </div>

          <div ref={weekDetailRef}>
            {activeWeek && (
              <WeekDetail key={activeWeek} wk={WEEKS.find(w => w.n === activeWeek)} />
            )}
          </div>
        </RevealBlock>

        {/* Section 7 — Habit Score */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Habit Score Hôm Nay</h2>
          <div className="rounded-2xl border p-6" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-3">
                {HABIT_SCORE_CRITERIA.map((c) => (
                  <label key={c.id} className="flex items-start gap-3 cursor-pointer group">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${habitChecked[c.id] ? 'border-amber-500 bg-amber-500' : 'border-gray-600 group-hover:border-amber-400'}`}
                      onClick={() => toggleHabit(c.id)}>
                      {habitChecked[c.id] && <span className="text-black text-xs font-bold">✓</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{c.icon} {c.label}</span>
                        <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>+{c.pts}pt</span>
                      </div>
                      <div className="text-xs text-gray-500">{c.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center">
                <ArcGauge score={habitScore} />
                <div className="mt-4 w-full rounded-xl p-3 text-center"
                  style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div className="text-xs text-gray-500">Tổng điểm</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: '#f59e0b' }}>{habitScore} / 100</div>
                </div>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* Section 8 — Summary Table */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Bảng Tổng Hợp 24 Tuần</h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-wider text-gray-500 px-4 py-3 bg-white/[0.02] border-b border-white/5">
              <span>Tuần</span><span>GĐ</span><span>Chủ Đề</span><span>Việc Cần Làm Chính</span>
            </div>
            {SUMMARY_TABLE.map((row) => {
              const ph = PHASES.find(p => p.id === row.phase);
              return (
                <button key={row.n} className="w-full grid grid-cols-4 text-left px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors text-sm"
                  style={{ borderLeft: `3px solid ${ph.color}` }}
                  onClick={() => handleWeekClick(row.n)}>
                  <span className="font-bold" style={{ color: ph.color }}>{row.n}</span>
                  <span className="text-gray-500">{row.phase}</span>
                  <span className="text-gray-300">{row.topic}</span>
                  <span className="text-gray-500 text-xs">{row.action}</span>
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* Section 9 — After 24 Weeks */}
        <RevealBlock className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Sau 24 Tuần — 3 Hướng Đi</h2>
          <div className="space-y-3">
            {WEEKS[23].next3Paths.map((p, i) => {
              const cols = ['#22c55e','#f97316','#a855f7'];
              const rgbs = ['34,197,94','249,115,22','168,85,247'];
              return (
                <div key={i} className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: `${cols[i]}33` }}>
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                    onClick={() => setOpenPath(prev => prev === i ? null : i)}>
                    <div>
                      <div className="font-bold text-base" style={{ color: cols[i] }}>{p.path}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.who}</div>
                    </div>
                    <span className="text-gray-500 text-xs">{openPath === i ? '▲' : '▼'}</span>
                  </button>
                  {openPath === i && (
                    <div className="px-5 pb-5 pt-1" style={{ background: `rgba(${rgbs[i]},0.04)` }}>
                      <ul className="space-y-2">
                        {p.strategy.map((s, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                            <span style={{ color: cols[i] }}>▸</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </RevealBlock>

        {/* Section 10 — Safety Note */}
        <RevealBlock>
          <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">⚠️</span>
              <div>
                <div className="font-bold text-sm mb-2" style={{ color: '#f59e0b' }}>Lưu Ý Quan Trọng</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Lộ trình này là hướng dẫn tổng quát về giáo dục dinh dưỡng, không thay thế tư vấn y tế cá nhân. Nếu bạn có tình trạng sức khỏe đặc biệt (tiểu đường, bệnh thận, rối loạn ăn uống, đang mang thai, ...), hãy tham khảo bác sĩ hoặc chuyên gia dinh dưỡng được cấp phép trước khi áp dụng bất kỳ thay đổi nào về chế độ ăn. Mọi con số trong lộ trình (TDEE, protein, calo) là ước tính và cần điều chỉnh theo phản hồi thực tế của cơ thể bạn.
                </p>
              </div>
            </div>
          </div>
        </RevealBlock>

      </div>
    </div>
  );
}
