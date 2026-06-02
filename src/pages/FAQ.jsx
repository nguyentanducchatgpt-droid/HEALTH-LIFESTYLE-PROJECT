import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ── FAQ Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',  label: 'Tất Cả',             color: '#94a3b8', rgb: '148,163,184' },
  { id: 'gen',  label: 'Tổng Quan',           color: '#22c55e', rgb: '34,197,94'   },
  { id: 'move', label: 'Vận Động',            color: '#22c55e', rgb: '34,197,94'   },
  { id: 'food', label: 'Dinh Dưỡng',          color: '#84cc16', rgb: '132,204,22'  },
  { id: 'life', label: 'Lối Sống',            color: '#14b8a6', rgb: '20,184,166'  },
  { id: 'mind', label: 'Tâm Trí',             color: '#a855f7', rgb: '168,85,247'  },
  { id: 'prog', label: 'Hành Trình',          color: '#3b82f6', rgb: '59,130,246'  },
];

const FAQS = [
  // Tổng Quan
  {
    cat: 'gen', color: '#22c55e', rgb: '34,197,94',
    q: 'Website Sức Khỏe & Đời Sống dành cho ai?',
    a: 'Website dành cho bất kỳ ai muốn cải thiện sức khỏe — từ người hoàn toàn mới bắt đầu đến người đã có nền tảng nhưng muốn hệ thống hóa lại. Không cần kinh nghiệm, không cần thiết bị đặc biệt, không cần chế độ ăn kiêng khắt khe. Chỉ cần 20 phút mỗi ngày và sự kiên trì.',
  },
  {
    cat: 'gen', color: '#22c55e', rgb: '34,197,94',
    q: 'Nội dung trên website có hoàn toàn miễn phí không?',
    a: 'Có — 100% miễn phí. Toàn bộ 6 trụ cột, lộ trình 7 ngày / 12 tuần / 24 tuần, video hướng dẫn, checklist, công cụ theo dõi và tài nguyên đều không tính phí. Mục tiêu của chúng tôi là phổ cập kiến thức sức khỏe khoa học đến mọi người mà không có rào cản tài chính.',
  },
  {
    cat: 'gen', color: '#22c55e', rgb: '34,197,94',
    q: 'Tôi nên bắt đầu từ đâu nếu là người hoàn toàn mới?',
    a: 'Bắt đầu bằng trang "Hành Trình Sống Khỏe" → chọn "7 Ngày Khởi Động". Bảy ngày đầu được thiết kế để bạn làm quen dần với cả 4 trụ cột cốt lõi (vận động · dinh dưỡng · lối sống · tâm trí) mà không bị choáng ngợp. Mỗi ngày chỉ cần 20–30 phút.',
  },
  {
    cat: 'gen', color: '#22c55e', rgb: '34,197,94',
    q: 'Nội dung có dựa trên bằng chứng khoa học không?',
    a: 'Có. Tất cả nội dung được xây dựng dựa trên các nghiên cứu y học hiện đại và hướng dẫn từ các tổ chức uy tín (WHO, ACSM, AHA). Tuy nhiên, website này mang tính giáo dục — không thay thế cho tư vấn y tế cá nhân. Nếu có vấn đề sức khỏe cụ thể, hãy tham khảo bác sĩ.',
  },
  {
    cat: 'gen', color: '#22c55e', rgb: '34,197,94',
    q: '6 trụ cột sức khỏe 360° bao gồm những gì?',
    a: '6 trụ cột tạo thành hệ thống sức khỏe toàn diện: (A) Vận Động & Tập Luyện — cơ thể mạnh khỏe; (B) Dinh Dưỡng & Thực Đơn — nhiên liệu đúng; (C) Lối Sống Khỏe — ngủ, bước chân, phục hồi; (D) Tâm Trí An Nhiên — cân bằng cảm xúc; (E) Kiến Thức Sức Khỏe — hiểu cơ thể; (F) Công Cụ & Tài Nguyên — theo dõi và duy trì. Sáu trụ cột hoạt động cùng nhau — thiếu một trụ sẽ ảnh hưởng đến cả hệ thống.',
  },

  // Vận Động
  {
    cat: 'move', color: '#22c55e', rgb: '34,197,94',
    q: 'Tôi nên tập luyện bao nhiêu lần mỗi tuần?',
    a: 'Với người mới, 3 buổi/tuần (cách ngày) là lý tưởng. Cấu trúc khuyến nghị: 3 buổi sức mạnh · 2 buổi cardio nhẹ · 2 ngày phục hồi tích cực. Quan trọng hơn số buổi là tính nhất quán — 3 buổi đều đặn trong 12 tuần tốt hơn 5 buổi/tuần trong 2 tuần rồi bỏ cuộc.',
  },
  {
    cat: 'move', color: '#22c55e', rgb: '34,197,94',
    q: '6 chuyển động cơ bản là gì và tại sao quan trọng?',
    a: '6 pattern vận động nền tảng: Squat (gập gối), Hinge (gập hông), Push (đẩy), Pull (kéo), Core (lõi) và Thở. Đây là 6 nhóm cơ vận động mà cơ thể người thực hiện hàng ngày. Thành thạo 6 động tác này với form đúng trước khi tăng tải là nguyên tắc số 1 để tránh chấn thương và tạo nền tảng bền vững.',
  },
  {
    cat: 'move', color: '#22c55e', rgb: '34,197,94',
    q: 'Không có dụng cụ tập luyện, có áp dụng được không?',
    a: 'Hoàn toàn được. Toàn bộ chương trình giai đoạn 1 (7 ngày + 4 tuần đầu) sử dụng 100% bodyweight — không cần thiết bị. Từ tuần 5 trở đi bạn có thể dùng tạ đơn hoặc dây kháng lực nếu muốn tăng thách thức, nhưng không bắt buộc. Vận động thể chất tốt nhất là vận động bạn thực sự làm được mỗi ngày.',
  },
  {
    cat: 'move', color: '#22c55e', rgb: '34,197,94',
    q: 'Tôi đau lưng mãn tính, có thể tập luyện theo hướng dẫn không?',
    a: 'Phụ thuộc vào nguyên nhân và mức độ. Chương trình có phần "Phục Hồi Tích Cực" và "Giãn Cơ" phù hợp với người đau lưng nhẹ. Tuy nhiên, nếu đau lưng do bệnh lý đốt sống, thoát vị đĩa đệm hoặc đang điều trị, hãy tham khảo bác sĩ hoặc vật lý trị liệu trước khi bắt đầu. Quy tắc vàng: đau cấp tính = nghỉ ngơi; đau mãn tính nhẹ = vận động nhẹ có kiểm soát.',
  },

  // Dinh Dưỡng
  {
    cat: 'food', color: '#84cc16', rgb: '132,204,22',
    q: 'Tôi có bắt buộc phải đếm calo không?',
    a: 'Không bắt buộc, đặc biệt trong giai đoạn đầu. Mô hình "Đĩa Ăn" (½ rau · ¼ đạm · ¼ tinh bột) và quy tắc "1 lòng bàn tay đạm mỗi bữa" giúp bạn ăn đúng mà không cần đếm số. Tính calo chỉ hữu ích ở giai đoạn nâng cao (từ tuần 5 trở đi) khi bạn muốn tối ưu hóa chính xác hơn.',
  },
  {
    cat: 'food', color: '#84cc16', rgb: '132,204,22',
    q: 'TDEE là gì và tôi có cần tính không?',
    a: 'TDEE (Total Daily Energy Expenditure) là tổng lượng calo cơ thể đốt mỗi ngày, bao gồm cả hoạt động. Công thức tính TDEE có trong Bộ Công Cụ B0 của trang Dinh Dưỡng. Biết TDEE giúp bạn ăn đúng lượng cho mục tiêu: giảm cân (TDEE − 400 kcal), duy trì (= TDEE), tăng cơ (TDEE + 300 kcal). Bạn không cần tính ngay từ ngày đầu — hãy làm quen với chất lượng bữa ăn trước.',
  },
  {
    cat: 'food', color: '#84cc16', rgb: '132,204,22',
    q: 'Tôi ăn ngoài nhiều vì công việc, có áp dụng được không?',
    a: 'Có. Công thức ăn ngoài thông minh: "1 protein + 2 rau + tinh bột vừa phải". Áp dụng tại nhà hàng: gọi thêm rau hoặc salad, chọn protein nướng/hấp thay vì chiên, kiểm soát phần tinh bột. Không cần từ chối bữa xã giao — chỉ cần chiến lược đơn giản. Phần "Ăn Ngoài Thông Minh" trong ngày 3 của lộ trình 7 ngày có hướng dẫn chi tiết.',
  },
  {
    cat: 'food', color: '#84cc16', rgb: '132,204,22',
    q: 'Tôi có cần dùng thực phẩm bổ sung (supplement) không?',
    a: 'Không cần trong giai đoạn đầu. Thực phẩm nguyên bản luôn là nền tảng — supplement chỉ có tác dụng khi nền dinh dưỡng đã vững. Nếu được cân nhắc: Vitamin D3 (nếu ít ra nắng), Omega-3 (nếu ít ăn cá), Protein Whey (nếu khó đủ đạm từ thực phẩm). Tham khảo bác sĩ trước khi dùng bất kỳ supplement nào.',
  },
  {
    cat: 'food', color: '#84cc16', rgb: '132,204,22',
    q: 'Tôi cần uống bao nhiêu nước mỗi ngày?',
    a: 'Công thức đơn giản: cân nặng (kg) × 35ml. Ví dụ: 60kg → 2,1 lít/ngày. Dấu hiệu đủ nước: nước tiểu vàng nhạt như chanh. Tăng thêm 500ml khi tập luyện. Uống đều trong ngày thay vì uống nhiều một lúc. Bắt đầu ngày với 1 ly nước lớn ngay sau khi thức dậy — đây là thói quen đơn giản nhất để bắt đầu.',
  },

  // Lối Sống
  {
    cat: 'life', color: '#14b8a6', rgb: '20,184,166',
    q: 'Tôi cần ngủ bao nhiêu tiếng là đủ?',
    a: '7–9 tiếng là khuyến nghị cho người trưởng thành (WHO). Quan trọng hơn số giờ là chất lượng giấc ngủ và tính đều đặn — ngủ và dậy cùng giờ mỗi ngày (kể cả cuối tuần) quan trọng hơn là ngủ nhiều vào cuối tuần bù lại. Giấc ngủ sâu (deep sleep) xảy ra trong 2 giờ đầu — nên ngủ trước 23h để tận dụng tối đa.',
  },
  {
    cat: 'life', color: '#14b8a6', rgb: '20,184,166',
    q: 'NEAT là gì và tại sao lại quan trọng hơn tôi nghĩ?',
    a: 'NEAT (Non-Exercise Activity Thermogenesis) là năng lượng đốt từ mọi hoạt động ngoài tập luyện — đi bộ, đứng, leo cầu thang, làm việc nhà. NEAT có thể chiếm 15–50% tổng calo đốt hàng ngày, nhiều hơn cả 1 buổi tập 1 tiếng. Mục tiêu: 8.000–10.000 bước/ngày. Thay thang máy bằng cầu thang, dừng xe xa hơn 200m, đứng trong cuộc họp — những thay đổi nhỏ cộng dồn lớn.',
  },
  {
    cat: 'life', color: '#14b8a6', rgb: '20,184,166',
    q: 'Morning routine tối thiểu cần những gì?',
    a: 'Morning routine 10 phút đủ để tạo khác biệt: (1) Uống 1 ly nước lớn ngay khi thức dậy; (2) Ra tiếp xúc ánh sáng mặt trời 5 phút (reset đồng hồ sinh học); (3) Viết 1 mục tiêu cho ngày hôm đó. Không cần dậy sớm 5h sáng — chỉ cần làm đều đặn. Sau khi quen, bạn có thể mở rộng dần thêm.',
  },
  {
    cat: 'life', color: '#14b8a6', rgb: '20,184,166',
    q: 'Làm sao cải thiện chất lượng giấc ngủ một cách nhanh nhất?',
    a: 'Ba can thiệp hiệu quả nhất: (1) Không dùng thiết bị màn hình 30 phút trước ngủ (ánh sáng xanh ức chế melatonin 50%); (2) Giữ phòng ngủ 18–22°C và tối hoàn toàn; (3) Không uống caffeine sau 14h (caffeine có half-life 5–7 tiếng). Áp dụng đúng 3 điều này trong 7 ngày — bạn sẽ nhận thấy sự khác biệt rõ rệt.',
  },

  // Tâm Trí
  {
    cat: 'mind', color: '#a855f7', rgb: '168,85,247',
    q: 'Tôi chưa bao giờ thiền, bắt đầu như thế nào?',
    a: 'Thiền đơn giản nhất: ngồi thoải mái, nhắm mắt, chú ý đến hơi thở trong 5 phút. Khi tâm trí lang thang (luôn xảy ra), nhẹ nhàng đưa sự chú ý về hơi thở — không phán xét. Đó là thiền. Bắt đầu 5 phút mỗi sáng, tăng dần lên 10–15 phút sau 2 tuần. Không cần "không suy nghĩ" — nhận ra và quay lại chính là bài tập.',
  },
  {
    cat: 'mind', color: '#a855f7', rgb: '168,85,247',
    q: 'Box Breathing là gì và khi nào nên dùng?',
    a: 'Box Breathing (thở hộp): Hít vào 4 giây → Giữ 4 giây → Thở ra 4 giây → Giữ 4 giây → lặp lại. Kỹ thuật này kích hoạt hệ thần kinh phó giao cảm, giảm cortisol và nhịp tim trong 2–3 phút. Dùng khi: căng thẳng trước cuộc họp quan trọng, khó ngủ, cảm thấy overwhelmed, hoặc trước buổi tập để tập trung. Đây là công cụ được Navy SEALs sử dụng.',
  },
  {
    cat: 'mind', color: '#a855f7', rgb: '168,85,247',
    q: 'Tôi không có thời gian thiền, có cách nào không?',
    a: 'Thiền không nhất thiết là ngồi im mắt nhắm. "Micro-meditation" hiệu quả trong cuộc sống bận rộn: (1) 3 hơi thở sâu có ý thức mỗi buổi sáng (30 giây); (2) Chú tâm hoàn toàn vào bữa ăn một bữa/ngày — không điện thoại; (3) Đi bộ có ý thức 5 phút giữa ngày. Những khoảnh khắc nhỏ này cộng dồn tạo nền tảng tâm lý vững chắc.',
  },
  {
    cat: 'mind', color: '#a855f7', rgb: '168,85,247',
    q: 'Nhật ký sức khỏe (health journal) nên viết những gì?',
    a: 'Công thức nhật ký 3 dòng tối (chỉ cần 3–5 phút): (1) "Hôm nay tôi làm tốt..." — ghi nhận 1 điều tích cực dù nhỏ; (2) "Tôi học được..." — 1 bài học hoặc quan sát; (3) "Ngày mai tôi sẽ..." — 1 hành động cụ thể. Không cần hay, không cần dài — chỉ cần thật. Sau 4 tuần, nhìn lại bạn sẽ thấy pattern của bản thân rõ ràng hơn.',
  },

  // Hành Trình
  {
    cat: 'prog', color: '#3b82f6', rgb: '59,130,246',
    q: 'Sự khác nhau giữa 7 ngày, 12 tuần và 24 tuần là gì?',
    a: '7 Ngày Khởi Động: Làm quen 4 trụ cột, hình thành thói quen nền, tự tin rằng bạn có thể làm được. 12 Tuần Cơ Bản: 3 giai đoạn xây dựng nền tảng → tăng tải → cá nhân hóa. Đủ thời gian để não bộ tái lập mạng thần kinh thói quen. 24 Tuần Nâng Cao: Mở rộng sang cả 6 trụ cột đầy đủ, bao gồm kiến thức y tế, sử dụng công cụ chuyên sâu và carb cycling.',
  },
  {
    cat: 'prog', color: '#3b82f6', rgb: '59,130,246',
    q: 'Tôi có thể bỏ qua 7 ngày và bắt đầu 12 tuần luôn không?',
    a: 'Được, nhưng không khuyến nghị. 7 ngày đầu không phải "bước đệm" mà là "bước nền" — giúp bạn hiểu cơ thể phản ứng thế nào với sự thay đổi, xác định điểm yếu và tạo đà tâm lý. Người bỏ qua 7 ngày thường bỏ cuộc sớm hơn. Nếu bạn đã có nền tảng tốt (tập đều 6+ tháng), bạn có thể bắt đầu từ giai đoạn 2 của 12 tuần.',
  },
  {
    cat: 'prog', color: '#3b82f6', rgb: '59,130,246',
    q: 'Mỗi ngày tôi cần dành bao nhiêu thời gian?',
    a: 'Cấu trúc Daily Core 20–40 phút: 5 phút khởi động · 10–20 phút tập chính · 5–10 phút giãn cơ · 5 phút mind reset. Ngoài ra: morning routine 10 phút + nhật ký tối 5 phút. Tổng: 35–55 phút/ngày. Trong ngày phục hồi: chỉ cần 15 phút giãn cơ + đi bộ. Không có ngày nào yêu cầu hơn 1 tiếng.',
  },
  {
    cat: 'prog', color: '#3b82f6', rgb: '59,130,246',
    q: 'Tôi đã tập luyện 2 năm, chương trình này có phù hợp không?',
    a: 'Có, nhưng hãy chọn điểm vào phù hợp. Nếu đã có nền tảng tốt: bắt đầu từ giai đoạn 2 (Tuần 5–8) của 12 tuần, tập trung vào các trụ cột bạn còn yếu (thường là Tâm Trí hoặc Kiến Thức Sức Khỏe). Chương trình 24 tuần có phần "Carb Cycling" và "Supplement Protocol" phù hợp cho người trung cấp–nâng cao hơn.',
  },
  {
    cat: 'prog', color: '#3b82f6', rgb: '59,130,246',
    q: 'Tôi lỡ 1–2 ngày trong lộ trình thì phải làm gì?',
    a: 'Không sao cả — điều này xảy ra với 100% người. Nguyên tắc: "Không bao giờ bỏ 2 lần liên tiếp". Bỏ 1 ngày → tiếp tục từ ngày tiếp theo, không cần làm bù. Bỏ 1 tuần → quay lại từ đầu tuần đó, không cần quay về ngày 1. Sự hoàn hảo không quan trọng bằng sự nhất quán theo thời gian. 80% nhất quán trong 12 tuần > 100% trong 3 tuần rồi bỏ.',
  },
];

// ── AccordionItem ────────────────────────────────────────────────────────────
function AccordionItem({ item, isOpen, onToggle, idx }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className="group border rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? `rgba(${item.rgb},0.35)` : 'rgba(255,255,255,0.07)',
        background: isOpen ? `rgba(${item.rgb},0.04)` : 'rgba(255,255,255,0.015)',
      }}
    >
      {/* Top accent line on open */}
      <div
        className="h-[2px] transition-all duration-500"
        style={{ background: isOpen ? `linear-gradient(90deg, rgba(${item.rgb},0.8), rgba(${item.rgb},0.2))` : 'transparent' }}
      />

      {/* Question row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 cursor-pointer"
      >
        {/* Number badge */}
        <span
          className="shrink-0 w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{
            background: isOpen ? `rgba(${item.rgb},0.18)` : 'rgba(255,255,255,0.05)',
            color: isOpen ? item.color : '#64748b',
            border: `1px solid ${isOpen ? `rgba(${item.rgb},0.3)` : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {String(idx + 1).padStart(2, '0')}
        </span>

        {/* Question text */}
        <span
          className="flex-1 font-semibold text-sm md:text-base leading-snug transition-colors duration-200 pt-0.5"
          style={{ color: isOpen ? '#f1f5f9' : '#94a3b8' }}
        >
          {item.q}
        </span>

        {/* Toggle icon */}
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{
            background: isOpen ? `rgba(${item.rgb},0.15)` : 'rgba(255,255,255,0.05)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"
            style={{ color: isOpen ? item.color : '#64748b' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {/* Answer */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{ height, opacity: isOpen ? 1 : 0, transition: 'height 0.38s ease, opacity 0.3s ease' }}
      >
        <div ref={contentRef} className="px-5 pb-5 pl-16">
          <p className="text-muted/80 text-sm leading-relaxed">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function FAQ() {
  const [openIdx, setOpenIdx]     = useState(null);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch]       = useState('');
  const [mouse, setMouse]         = useState({ x: 0.5, y: 0.3 });
  const headerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const r = headerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  useEffect(() => {
    const id = 'faq-kf';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes faqReveal {
        from { opacity:0; transform:translateY(28px) scale(0.95); filter:blur(7px); }
        to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0); }
      }
      @keyframes faqSubIn {
        from { opacity:0; transform:translateY(16px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes faqLineGrow {
        from { transform:scaleX(0); opacity:0; }
        to   { transform:scaleX(1); opacity:1; }
      }
      @keyframes faqDotPulse {
        0%,100% { transform:scale(1);   opacity:0.6; }
        50%     { transform:scale(1.5); opacity:1; }
      }
      @keyframes faqGlow {
        0%,100% { opacity:0.4; transform:scale(1); }
        50%     { opacity:0.7; transform:scale(1.2); }
      }
      @keyframes faqFloat {
        0%,100% { transform:translateY(0)    rotate(0deg); }
        33%     { transform:translateY(-8px) rotate(3deg); }
        66%     { transform:translateY(5px)  rotate(-2deg); }
      }
      @keyframes faqIconSpin {
        0%,100% { transform:rotate(-5deg) scale(1); }
        50%     { transform:rotate(5deg) scale(1.08); }
      }
      .faq-title  { animation:faqReveal  0.72s cubic-bezier(0.25,0.46,0.45,0.94) both 0.05s; }
      .faq-line   { transform-origin:center; animation:faqLineGrow 1s ease both 0.3s; }
      .faq-sub    { animation:faqSubIn   0.6s ease both 0.38s; }
      .faq-search { animation:faqSubIn   0.6s ease both 0.5s; }
      .faq-dot    { animation:faqDotPulse 2.4s ease-in-out infinite; }
      .faq-dot:nth-child(2){ animation-delay:0.5s; }
      .faq-dot:nth-child(3){ animation-delay:1s; }
      .faq-glow-a { animation:faqGlow 7s ease-in-out infinite; }
      .faq-glow-b { animation:faqGlow 9s ease-in-out infinite reverse; animation-delay:-3.5s; }
      .faq-icon   { animation:faqFloat 5s ease-in-out infinite; }
      .faq-icon:nth-child(2){ animation-delay:-1.5s; animation-duration:6.5s; }
      .faq-icon:nth-child(3){ animation-delay:-3s;   animation-duration:5.5s; }
      .faq-word { display:inline-block; transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
      .faq-word:hover { transform:translateY(-4px) scale(1.04); }
    `;
    document.head.appendChild(s);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return FAQS.filter(f => {
      const catOk = activeCat === 'all' || f.cat === activeCat;
      const searchOk = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [activeCat, search]);

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i);

  const activeCatColor = CATEGORIES.find(c => c.id === activeCat)?.color || '#22c55e';
  const activeCatRgb   = CATEGORIES.find(c => c.id === activeCat)?.rgb   || '34,197,94';

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Hero Header ──────────────────────────────────────────── */}
      <div
        ref={headerRef}
        onMouseMove={handleMouseMove}
        className="relative text-center rounded-3xl py-16 px-6 mb-10 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        {/* Mouse-tracking glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse 600px 350px at ${mouse.x*100}% ${mouse.y*100}%, rgba(34,197,94,0.08), transparent 70%)`,
        }} />

        {/* Ambient blobs */}
        <div className="faq-glow-a absolute top-1/4 left-1/5  w-80 h-60 bg-green-500/5   rounded-full blur-[90px] pointer-events-none" />
        <div className="faq-glow-b absolute top-0   right-1/5 w-64 h-52 bg-purple-500/4  rounded-full blur-[80px] pointer-events-none" />

        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.3),rgba(168,85,247,0.2),transparent)' }} />

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="faq-icon absolute top-8 left-12 text-2xl opacity-10 select-none">🏃</span>
          <span className="faq-icon absolute top-12 right-16 text-2xl opacity-10 select-none">🥗</span>
          <span className="faq-icon absolute bottom-10 left-1/4 text-xl opacity-10 select-none">🧘</span>
          <span className="faq-icon absolute bottom-8 right-1/4 text-2xl opacity-10 select-none">💡</span>
          <span className="faq-icon absolute top-1/2 left-8 text-lg opacity-8 select-none">🌿</span>
          <span className="faq-icon absolute top-1/3 right-10 text-lg opacity-8 select-none">📊</span>
        </div>

        <div className="relative">
          {/* Pulsing dots */}
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="faq-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 7px rgba(34,197,94,0.8)' }} />
            <span className="faq-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 6px rgba(94,234,212,0.7)' }} />
            <span className="faq-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 5px rgba(168,85,247,0.6)' }} />
            <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-muted/50 mx-2">Câu Hỏi Thường Gặp</span>
            <span className="faq-dot w-1   h-1   rounded-full" style={{ background:'#a855f7', boxShadow:'0 0 5px rgba(168,85,247,0.6)' }} />
            <span className="faq-dot w-1.5 h-1.5 rounded-full" style={{ background:'#5eead4', boxShadow:'0 0 6px rgba(94,234,212,0.7)' }} />
            <span className="faq-dot w-2   h-2   rounded-full" style={{ background:'#22c55e', boxShadow:'0 0 7px rgba(34,197,94,0.8)' }} />
          </div>

          {/* Title */}
          <h1 className="faq-title font-black leading-tight tracking-tight mb-5 flex items-baseline justify-center gap-[0.2em]" style={{ fontSize: 'clamp(2.6rem,5.5vw,4rem)' }}>
            <span className="faq-word text-text cursor-default select-none">FAQ</span>
            <span className="faq-word cursor-default select-none" style={{
              background: 'linear-gradient(135deg,#22c55e 0%,#5eead4 50%,#a855f7 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Sức Khỏe</span>
          </h1>

          {/* Underline */}
          <div className="faq-line mx-auto mb-6 h-[2.5px] w-24 rounded-full"
            style={{ background: 'linear-gradient(90deg,#22c55e,#5eead4,#a855f7)' }} />

          {/* Subtitle */}
          <p className="faq-sub text-muted/70 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-3">
            Giải đáp những thắc mắc phổ biến nhất về hành trình sống khỏe
          </p>
          <p className="faq-sub text-muted/45 text-xs mx-auto mb-8">
            {FAQS.length} câu hỏi · 6 chủ đề · cập nhật thường xuyên
          </p>

          {/* Search */}
          <div className="faq-search relative max-w-sm mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted/40">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/4 border border-white/10 text-text placeholder-muted/40
                focus:outline-none focus:border-accent/40 focus:bg-white/6 transition-all duration-200"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Filter ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => {
          const active = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCat(cat.id); setOpenIdx(null); }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer"
              style={{
                background: active ? `rgba(${cat.rgb},0.15)` : 'rgba(255,255,255,0.04)',
                borderColor: active ? `rgba(${cat.rgb},0.45)` : 'rgba(255,255,255,0.08)',
                color: active ? cat.color : '#64748b',
                boxShadow: active ? `0 0 12px rgba(${cat.rgb},0.2)` : 'none',
              }}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="ml-1.5 opacity-60 font-normal">
                  {FAQS.filter(f => f.cat === cat.id).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── FAQ List ──────────────────────────────────────────────── */}
      <div className="space-y-2.5 mb-14">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted/50 text-sm">
            <div className="text-3xl mb-3">🔍</div>
            Không tìm thấy câu hỏi phù hợp. Thử từ khóa khác.
          </div>
        ) : (
          filtered.map((item, i) => (
            <AccordionItem
              key={`${activeCat}-${i}`}
              item={item}
              idx={i}
              isOpen={openIdx === i}
              onToggle={() => toggle(i)}
            />
          ))
        )}
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-14">
        {[
          { v: FAQS.length, l: 'Câu hỏi', color: '#22c55e', rgb: '34,197,94' },
          { v: '6', l: 'Chủ đề', color: '#5eead4', rgb: '94,234,212' },
          { v: '100%', l: 'Miễn phí', color: '#a855f7', rgb: '168,85,247' },
        ].map(s => (
          <div key={s.l} className="text-center rounded-2xl py-5 border"
            style={{ background: `rgba(${s.rgb},0.05)`, borderColor: `rgba(${s.rgb},0.18)` }}>
            <div className="text-2xl font-black mb-0.5" style={{
              background: `linear-gradient(135deg, ${s.color}, rgba(${s.rgb},0.6))`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{s.v}</div>
            <div className="text-xs text-muted/60">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Still have questions? CTA ─────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-border/40 p-8 text-center mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(34,197,94,0.3),transparent)' }} />
        <div className="relative">
          <div className="text-2xl mb-3 select-none">💬</div>
          <h2 className="text-lg font-bold text-text mb-2">Vẫn còn thắc mắc?</h2>
          <p className="text-muted/70 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            Không tìm thấy câu trả lời? Liên hệ trực tiếp — chúng tôi luôn sẵn lòng hỗ trợ.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-105"
              style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.35)', color: '#22c55e' }}>
              Liên Hệ Chúng Tôi →
            </Link>
            <Link to="/program"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }}>
              Xem Lộ Trình
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
